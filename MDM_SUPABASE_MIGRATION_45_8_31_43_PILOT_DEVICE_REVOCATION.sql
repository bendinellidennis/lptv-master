-- MALTA DRIVING MASTER
-- BUILD 45.8.31.43 - PILOT ACCESS & LICENSING GATE / DEVICE REVOCATION
-- Run AFTER 45.8.31.42 Device Limit Enforcement has been installed and functionally verified.
-- This step lets an ACTIVE school_admin revoke a registered device belonging to the same school license.
-- A revoked device cannot self-register again with the same token under the existing registration RPC.
-- It does NOT yet write audit events or enable any frontend block.
-- It does NOT touch question banks, Replay, answer keys, official visuals, or frozen modules.
-- Idempotent: safe to run again.

begin;

create or replace function public.mdm_school_revoke_pilot_device(
  p_device_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_uid uuid := auth.uid();
  v_device public.mdm_pilot_registered_devices%rowtype;
  v_license public.mdm_pilot_licenses%rowtype;
  v_admin public.mdm_school_memberships%rowtype;
  v_active_devices integer := 0;
begin
  if v_admin_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select *
  into v_device
  from public.mdm_pilot_registered_devices
  where id = p_device_id
  for update;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'device_not_found'
    );
  end if;

  select *
  into v_license
  from public.mdm_pilot_licenses
  where id = v_device.license_id
  limit 1;

  if not found or v_license.school_id is null then
    return jsonb_build_object(
      'ok', false,
      'error', 'school_license_required'
    );
  end if;

  select *
  into v_admin
  from public.mdm_school_memberships
  where user_id = v_admin_uid
    and school_id = v_license.school_id
    and role = 'school_admin'
    and status = 'active'
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'school_admin_required'
    );
  end if;

  if v_device.status = 'revoked' then
    select count(*)::integer
    into v_active_devices
    from public.mdm_pilot_registered_devices
    where user_id = v_device.user_id
      and license_id = v_device.license_id
      and status = 'active';

    return jsonb_build_object(
      'ok', true,
      'revoked', true,
      'already_revoked', true,
      'device_id', v_device.id,
      'device_status', v_device.status,
      'active_devices', v_active_devices,
      'device_limit', v_license.device_limit,
      'next_step', 'security_audit'
    );
  end if;

  update public.mdm_pilot_registered_devices
  set status = 'revoked',
      revoked_at = now(),
      updated_at = now()
  where id = v_device.id
  returning * into v_device;

  select count(*)::integer
  into v_active_devices
  from public.mdm_pilot_registered_devices
  where user_id = v_device.user_id
    and license_id = v_device.license_id
    and status = 'active';

  return jsonb_build_object(
    'ok', true,
    'revoked', true,
    'already_revoked', false,
    'device_id', v_device.id,
    'device_status', v_device.status,
    'active_devices', v_active_devices,
    'device_limit', v_license.device_limit,
    'next_step', 'security_audit'
  );
end;
$$;

revoke all on function public.mdm_school_revoke_pilot_device(uuid) from public, anon;
grant execute on function public.mdm_school_revoke_pilot_device(uuid) to authenticated;

commit;
