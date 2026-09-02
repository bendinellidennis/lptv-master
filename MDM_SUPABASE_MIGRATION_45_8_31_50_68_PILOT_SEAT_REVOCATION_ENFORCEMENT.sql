-- MALTA DRIVING MASTER
-- BUILD 45.8.31.50.68 — PILOT SEAT REVOCATION + ENFORCEMENT
-- Run after the existing 45.8.31.38..43 and 45.8.31.50.40 migrations.
-- Revocation changes only seat_status. It never deletes Auth users, profiles,
-- school memberships, devices, progress, history, settings, or synchronized data.

begin;

create or replace function public.mdm_school_revoke_pilot_seat(
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
  v_admin public.mdm_school_memberships%rowtype;
  v_seat public.mdm_pilot_license_users%rowtype;
begin
  if v_admin_uid is null then
    raise exception 'authentication_required' using errcode='42501';
  end if;

  select * into v_inv
  from public.mdm_pilot_invitations
  where id=p_invitation_id
    and status='redeemed'
    and redeemed_by is not null
  limit 1;

  if not found then
    return jsonb_build_object('ok',false,'error','redeemed_invitation_not_found');
  end if;

  select * into v_admin
  from public.mdm_school_memberships
  where user_id=v_admin_uid
    and school_id=v_inv.school_id
    and role='school_admin'
    and status='active'
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object('ok',false,'error','school_admin_required');
  end if;

  select * into v_seat
  from public.mdm_pilot_license_users
  where license_id=v_inv.license_id
    and user_id=v_inv.redeemed_by
  limit 1
  for update;

  if not found then
    return jsonb_build_object('ok',false,'error','pilot_seat_not_found');
  end if;

  if v_seat.seat_status='revoked' then
    return jsonb_build_object(
      'ok',true,'revoked',true,'already_revoked',true,
      'seat_id',v_seat.id,'seat_status',v_seat.seat_status,
      'user_id',v_seat.user_id
    );
  end if;

  update public.mdm_pilot_license_users
  set seat_status='revoked',
      revoked_at=now(),
      updated_at=now()
  where id=v_seat.id
  returning * into v_seat;

  return jsonb_build_object(
    'ok',true,'revoked',true,'already_revoked',false,
    'seat_id',v_seat.id,'seat_status',v_seat.seat_status,
    'user_id',v_seat.user_id,'data_preserved',true
  );
end;
$$;

revoke all on function public.mdm_school_revoke_pilot_seat(uuid) from public,anon;
grant execute on function public.mdm_school_revoke_pilot_seat(uuid) to authenticated;

-- Keep school administrators authorized without consuming a student seat.
create or replace function public.mdm_check_my_pilot_entitlement()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_row record;
  v_active_devices integer := 0;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode='42501';
  end if;

  if exists (
    select 1 from public.mdm_school_memberships sm
    where sm.user_id=v_uid and sm.role='school_admin' and sm.status='active'
  ) then
    return jsonb_build_object(
      'ok',true,'authorized',true,'access_role','school_admin',
      'device_limit',0,'active_devices',0,'device_limit_reached',false
    );
  end if;

  select l.id as license_id,l.license_type,l.plan_code,l.school_id,
         l.status as license_status,l.device_limit,l.starts_at,l.expires_at,
         lu.seat_status
  into v_row
  from public.mdm_pilot_license_users lu
  join public.mdm_pilot_licenses l on l.id=lu.license_id
  where lu.user_id=v_uid
    and lu.seat_status='active'
    and l.status='active'
    and l.starts_at<=now()
    and (l.expires_at is null or l.expires_at>now())
  order by l.expires_at nulls last,lu.assigned_at asc
  limit 1;

  if not found then
    return jsonb_build_object('ok',true,'authorized',false,'reason','no_active_license');
  end if;

  select count(*)::integer into v_active_devices
  from public.mdm_pilot_registered_devices d
  where d.user_id=v_uid and d.license_id=v_row.license_id and d.status='active';

  return jsonb_build_object(
    'ok',true,'authorized',true,'access_role','student',
    'license_id',v_row.license_id,'license_type',v_row.license_type,
    'plan_code',v_row.plan_code,'school_id',v_row.school_id,
    'license_status',v_row.license_status,'seat_status',v_row.seat_status,
    'starts_at',v_row.starts_at,'expires_at',v_row.expires_at,
    'device_limit',v_row.device_limit,'active_devices',v_active_devices,
    'device_limit_reached',(v_active_devices>=v_row.device_limit)
  );
end;
$$;

revoke all on function public.mdm_check_my_pilot_entitlement() from public,anon;
grant execute on function public.mdm_check_my_pilot_entitlement() to authenticated;

commit;
