-- MALTA DRIVING MASTER
-- BUILD 45.8.31.40 - PILOT ACCESS & LICENSING GATE / LICENSE SEAT ASSIGNMENT
-- Run AFTER 45.8.31.39 Invite/Redeem has been installed and functionally verified.
-- This step assigns a redeemed invitation to an ACTIVE server-side license seat.
-- It does NOT register devices, enforce device limits, revoke access, write audit events,
-- or enable any frontend block.
-- It does NOT touch question banks, Replay, answer keys, official visuals, or frozen modules.
-- Idempotent: safe to run again.

begin;

-- -----------------------------------------------------------------------------
-- SCHOOL ADMIN: ASSIGN A REDEEMED INVITATION TO A LICENSE SEAT
-- Security rules:
--   * authenticated caller required
--   * caller must be ACTIVE school_admin for the invitation/license school
--   * invitation must already be REDEEMED and contain redeemed_by
--   * license must still be ACTIVE and within its validity window
--   * license row is locked before seat count check to prevent concurrent over-allocation
--   * active seats may never exceed seat_limit
--   * same license/user assignment is idempotent
-- -----------------------------------------------------------------------------
create or replace function public.mdm_school_assign_pilot_seat(
  p_invitation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_uid uuid := auth.uid();
  v_inv public.mdm_pilot_invitations%rowtype;
  v_license public.mdm_pilot_licenses%rowtype;
  v_admin public.mdm_school_memberships%rowtype;
  v_seat public.mdm_pilot_license_users%rowtype;
  v_active_seats integer := 0;
begin
  if v_admin_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into v_inv
  from public.mdm_pilot_invitations
  where id = p_invitation_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invitation_not_found');
  end if;

  if v_inv.status <> 'redeemed' or v_inv.redeemed_by is null then
    return jsonb_build_object(
      'ok', false,
      'error', 'invitation_not_redeemed',
      'status', v_inv.status
    );
  end if;

  select * into v_license
  from public.mdm_pilot_licenses
  where id = v_inv.license_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'license_not_found');
  end if;

  if v_license.school_id is null
     or v_inv.school_id is null
     or v_inv.school_id <> v_license.school_id then
    return jsonb_build_object('ok', false, 'error', 'school_license_mismatch');
  end if;

  select * into v_admin
  from public.mdm_school_memberships
  where user_id = v_admin_uid
    and school_id = v_license.school_id
    and role = 'school_admin'
    and status = 'active'
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'school_admin_required');
  end if;

  if v_license.status <> 'active'
     or v_license.starts_at > now()
     or (v_license.expires_at is not null and v_license.expires_at <= now()) then
    return jsonb_build_object('ok', false, 'error', 'license_not_active');
  end if;

  -- Idempotency: an already ACTIVE seat for this redeemed user is returned unchanged.
  select * into v_seat
  from public.mdm_pilot_license_users
  where license_id = v_license.id
    and user_id = v_inv.redeemed_by
  limit 1;

  if found and v_seat.seat_status = 'active' then
    select count(*)::integer into v_active_seats
    from public.mdm_pilot_license_users
    where license_id = v_license.id
      and seat_status = 'active';

    return jsonb_build_object(
      'ok', true,
      'assigned', true,
      'already_assigned', true,
      'seat_id', v_seat.id,
      'license_id', v_license.id,
      'user_id', v_inv.redeemed_by,
      'seat_status', v_seat.seat_status,
      'active_seats', v_active_seats,
      'seat_limit', v_license.seat_limit,
      'seats_remaining', greatest(v_license.seat_limit - v_active_seats, 0)
    );
  end if;

  select count(*)::integer into v_active_seats
  from public.mdm_pilot_license_users
  where license_id = v_license.id
    and seat_status = 'active';

  if v_active_seats >= v_license.seat_limit then
    return jsonb_build_object(
      'ok', false,
      'error', 'seat_limit_reached',
      'active_seats', v_active_seats,
      'seat_limit', v_license.seat_limit
    );
  end if;

  insert into public.mdm_pilot_license_users(
    license_id,
    user_id,
    seat_status,
    assigned_by,
    assigned_at,
    revoked_at,
    updated_at
  ) values (
    v_license.id,
    v_inv.redeemed_by,
    'active',
    v_admin_uid,
    now(),
    null,
    now()
  )
  on conflict (license_id, user_id) do update
  set seat_status = 'active',
      assigned_by = excluded.assigned_by,
      assigned_at = now(),
      revoked_at = null,
      updated_at = now()
  returning * into v_seat;

  v_active_seats := v_active_seats + 1;

  return jsonb_build_object(
    'ok', true,
    'assigned', true,
    'already_assigned', false,
    'seat_id', v_seat.id,
    'license_id', v_license.id,
    'user_id', v_inv.redeemed_by,
    'seat_status', v_seat.seat_status,
    'active_seats', v_active_seats,
    'seat_limit', v_license.seat_limit,
    'seats_remaining', greatest(v_license.seat_limit - v_active_seats, 0),
    'next_step', 'device_registration'
  );
end;
$$;

revoke all on function public.mdm_school_assign_pilot_seat(uuid) from public, anon;
grant execute on function public.mdm_school_assign_pilot_seat(uuid) to authenticated;

commit;
