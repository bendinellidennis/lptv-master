-- MALTA DRIVING MASTER
-- BUILD 45.8.31.42 - PILOT ACCESS & LICENSING GATE / DEVICE LIMIT ENFORCEMENT
-- Run AFTER 45.8.31.41 Device Registration has been installed and functionally verified.
-- This step enforces device_limit server-side inside device registration.
-- It does NOT revoke devices, write audit events, or enable any frontend block.
-- It does NOT touch question banks, Replay, answer keys, official visuals, or frozen modules.
-- Idempotent: safe to run again.

begin;

create or replace function public.mdm_register_my_pilot_device(
  p_device_token text,
  p_device_label text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_token text := trim(coalesce(p_device_token, ''));
  v_label text := nullif(trim(coalesce(p_device_label, '')), '');
  v_token_hash text;
  v_license public.mdm_pilot_licenses%rowtype;
  v_seat public.mdm_pilot_license_users%rowtype;
  v_device public.mdm_pilot_registered_devices%rowtype;
  v_active_devices integer := 0;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if char_length(v_token) < 32 or char_length(v_token) > 512 then
    return jsonb_build_object(
      'ok', false,
      'error', 'invalid_device_token'
    );
  end if;

  if v_label is not null and char_length(v_label) > 120 then
    return jsonb_build_object(
      'ok', false,
      'error', 'invalid_device_label'
    );
  end if;

  select l.*
  into v_license
  from public.mdm_pilot_license_users lu
  join public.mdm_pilot_licenses l
    on l.id = lu.license_id
  where lu.user_id = v_uid
    and lu.seat_status = 'active'
    and l.status = 'active'
    and l.starts_at <= now()
    and (l.expires_at is null or l.expires_at > now())
  order by l.expires_at nulls last, lu.assigned_at asc
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'no_active_license_seat'
    );
  end if;

  -- Serialize registrations against the license row so concurrent requests cannot
  -- both pass the device-limit count check.
  select *
  into v_license
  from public.mdm_pilot_licenses
  where id = v_license.id
  for update;

  select *
  into v_seat
  from public.mdm_pilot_license_users
  where license_id = v_license.id
    and user_id = v_uid
    and seat_status = 'active'
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'no_active_license_seat'
    );
  end if;

  v_token_hash := encode(
    extensions.digest(v_token, 'sha256'),
    'hex'
  );

  -- Existing device is idempotent and remains usable even when the account is
  -- currently at its device limit.
  select *
  into v_device
  from public.mdm_pilot_registered_devices
  where user_id = v_uid
    and device_token_hash = v_token_hash
  limit 1;

  if found then
    if v_device.status = 'revoked' then
      return jsonb_build_object(
        'ok', false,
        'error', 'device_revoked',
        'device_id', v_device.id
      );
    end if;

    update public.mdm_pilot_registered_devices
    set license_id = v_license.id,
        device_label = coalesce(v_label, device_label),
        last_seen_at = now(),
        updated_at = now()
    where id = v_device.id
    returning * into v_device;

    select count(*)::integer
    into v_active_devices
    from public.mdm_pilot_registered_devices
    where user_id = v_uid
      and license_id = v_license.id
      and status = 'active';

    return jsonb_build_object(
      'ok', true,
      'registered', true,
      'already_registered', true,
      'device_id', v_device.id,
      'license_id', v_license.id,
      'seat_id', v_seat.id,
      'device_status', v_device.status,
      'device_label', v_device.device_label,
      'active_devices', v_active_devices,
      'device_limit', v_license.device_limit,
      'device_limit_enforced', true,
      'device_limit_reached', (v_active_devices >= v_license.device_limit),
      'next_step', 'device_revocation'
    );
  end if;

  select count(*)::integer
  into v_active_devices
  from public.mdm_pilot_registered_devices
  where user_id = v_uid
    and license_id = v_license.id
    and status = 'active';

  if v_active_devices >= v_license.device_limit then
    return jsonb_build_object(
      'ok', false,
      'registered', false,
      'error', 'device_limit_reached',
      'active_devices', v_active_devices,
      'device_limit', v_license.device_limit,
      'device_limit_enforced', true
    );
  end if;

  insert into public.mdm_pilot_registered_devices(
    user_id,
    license_id,
    device_token_hash,
    device_label,
    status,
    first_seen_at,
    last_seen_at,
    updated_at
  ) values (
    v_uid,
    v_license.id,
    v_token_hash,
    v_label,
    'active',
    now(),
    now(),
    now()
  )
  returning * into v_device;

  v_active_devices := v_active_devices + 1;

  return jsonb_build_object(
    'ok', true,
    'registered', true,
    'already_registered', false,
    'device_id', v_device.id,
    'license_id', v_license.id,
    'seat_id', v_seat.id,
    'device_status', v_device.status,
    'device_label', v_device.device_label,
    'active_devices', v_active_devices,
    'device_limit', v_license.device_limit,
    'device_limit_enforced', true,
    'device_limit_reached', (v_active_devices >= v_license.device_limit),
    'next_step', 'device_revocation'
  );
end;
$$;

revoke all on function public.mdm_register_my_pilot_device(text,text) from public, anon;
grant execute on function public.mdm_register_my_pilot_device(text,text) to authenticated;

commit;
