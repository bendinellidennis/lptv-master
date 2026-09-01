-- MALTA DRIVING MASTER
-- BUILD 45.8.31.50.40 — REAL PILOT OWNER CONTROL
-- Run AFTER 45.8.31.38..43.
-- Adds:
--   1) SQL-editor-only secure bootstrap for the technical Owner pilot school/license.
--   2) School-admin read RPC for the active school Pilot license (admin does NOT need a student seat).
--   3) School-admin activation queue for redeemed invitations.
-- Existing mdm_school_assign_pilot_seat(uuid) remains the only seat-activation RPC.
-- No question banks, Replay, frozen learning modules, answer keys, or student history touched.

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1) SQL-EDITOR-ONLY OWNER / SCHOOL / LICENSE BOOTSTRAP
-- Not executable by browser roles.
-- ---------------------------------------------------------------------------
create or replace function public.mdm_admin_bootstrap_owner_pilot(
  p_owner_email text,
  p_school_code text default 'MDM-MT-ABC123',
  p_seat_limit integer default 30,
  p_device_limit integer default 2
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(coalesce(p_owner_email,'')));
  v_code text := upper(trim(coalesce(p_school_code,'')));
  v_seats integer := greatest(1,least(coalesce(p_seat_limit,30),100000));
  v_devices integer := greatest(1,least(coalesce(p_device_limit,2),20));
  v_uid uuid;
  v_school public.mdm_schools%rowtype;
  v_license public.mdm_pilot_licenses%rowtype;
begin
  if v_email = '' then
    return jsonb_build_object('ok',false,'error','owner_email_required');
  end if;

  select id into v_uid
  from auth.users
  where lower(email)=v_email
    and email_confirmed_at is not null
  order by created_at asc
  limit 1;

  if v_uid is null then
    return jsonb_build_object('ok',false,'error','confirmed_owner_auth_user_not_found');
  end if;

  select * into v_school
  from public.mdm_schools
  where school_code=v_code
  limit 1;

  if not found then
    insert into public.mdm_schools(school_code,name,country_code,verified)
    values (v_code,'MDM Malta Pilot School (TEST)','MT',false)
    returning * into v_school;
  end if;

  insert into public.mdm_school_memberships(
    school_id,user_id,role,status,created_at,source_request_id,updated_at
  ) values (
    v_school.id,v_uid,'school_admin','active',now(),null,now()
  )
  on conflict (school_id,user_id) do update
  set role='school_admin',
      status='active',
      source_request_id=null,
      updated_at=now();

  select * into v_license
  from public.mdm_pilot_licenses
  where school_id=v_school.id
    and license_type='school'
    and status='active'
    and starts_at<=now()
    and (expires_at is null or expires_at>now())
  order by created_at asc
  limit 1
  for update;

  if not found then
    insert into public.mdm_pilot_licenses(
      license_type,plan_code,school_id,status,seat_limit,device_limit,
      starts_at,expires_at,created_by,created_at,updated_at
    ) values (
      'school','pilot',v_school.id,'active',v_seats,v_devices,
      now(),null,v_uid,now(),now()
    )
    returning * into v_license;
  else
    update public.mdm_pilot_licenses
    set seat_limit=v_seats,
        device_limit=v_devices,
        updated_at=now()
    where id=v_license.id
    returning * into v_license;
  end if;

  return jsonb_build_object(
    'ok',true,
    'owner_user_id',v_uid,
    'owner_email',v_email,
    'school_id',v_school.id,
    'school_code',v_school.school_code,
    'school_name',v_school.name,
    'role','school_admin',
    'membership_status','active',
    'license_id',v_license.id,
    'license_status',v_license.status,
    'seat_limit',v_license.seat_limit,
    'device_limit',v_license.device_limit
  );
end;
$$;

revoke all on function public.mdm_admin_bootstrap_owner_pilot(text,text,integer,integer)
from public,anon,authenticated;
grant execute on function public.mdm_admin_bootstrap_owner_pilot(text,text,integer,integer)
to postgres;

-- ---------------------------------------------------------------------------
-- 2) SCHOOL ADMIN: GET ACTIVE SCHOOL PILOT LICENSE
-- Does not require the admin to consume a student seat.
-- ---------------------------------------------------------------------------
create or replace function public.mdm_school_get_pilot_license()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_member public.mdm_school_memberships%rowtype;
  v_school public.mdm_schools%rowtype;
  v_license public.mdm_pilot_licenses%rowtype;
  v_active_seats integer := 0;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode='42501';
  end if;

  select * into v_member
  from public.mdm_school_memberships
  where user_id=v_uid
    and role='school_admin'
    and status='active'
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object('ok',true,'authorized',false,'reason','school_admin_required');
  end if;

  select * into v_school
  from public.mdm_schools
  where id=v_member.school_id
  limit 1;

  if not found then
    return jsonb_build_object('ok',false,'authorized',false,'reason','school_record_missing');
  end if;

  select * into v_license
  from public.mdm_pilot_licenses
  where school_id=v_school.id
    and license_type='school'
    and status='active'
    and starts_at<=now()
    and (expires_at is null or expires_at>now())
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok',true,'authorized',true,'license_found',false,
      'school_id',v_school.id,'school_code',v_school.school_code,'school_name',v_school.name
    );
  end if;

  select count(*)::integer into v_active_seats
  from public.mdm_pilot_license_users
  where license_id=v_license.id
    and seat_status='active';

  return jsonb_build_object(
    'ok',true,
    'authorized',true,
    'license_found',true,
    'school_id',v_school.id,
    'school_code',v_school.school_code,
    'school_name',v_school.name,
    'license_id',v_license.id,
    'license_status',v_license.status,
    'seat_limit',v_license.seat_limit,
    'active_seats',v_active_seats,
    'seats_remaining',greatest(v_license.seat_limit-v_active_seats,0),
    'device_limit',v_license.device_limit,
    'expires_at',v_license.expires_at
  );
end;
$$;

revoke all on function public.mdm_school_get_pilot_license() from public,anon;
grant execute on function public.mdm_school_get_pilot_license() to authenticated;

-- ---------------------------------------------------------------------------
-- 3) SCHOOL ADMIN: LIST REDEEMED INVITATIONS AWAITING/ALREADY ASSIGNED
-- ---------------------------------------------------------------------------
create or replace function public.mdm_school_list_pilot_activation_queue()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_member public.mdm_school_memberships%rowtype;
  v_school public.mdm_schools%rowtype;
  v_items jsonb := '[]'::jsonb;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode='42501';
  end if;

  select * into v_member
  from public.mdm_school_memberships
  where user_id=v_uid
    and role='school_admin'
    and status='active'
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object('ok',true,'authorized',false,'items','[]'::jsonb);
  end if;

  select * into v_school
  from public.mdm_schools
  where id=v_member.school_id
  limit 1;

  if not found then
    return jsonb_build_object('ok',false,'authorized',false,'error','school_record_missing');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'invitation_id',i.id,
    'license_id',i.license_id,
    'invite_email',i.invite_email_normalized,
    'redeemed_by',i.redeemed_by,
    'redeemed_at',i.redeemed_at,
    'seat_assigned',coalesce(lu.seat_status='active',false),
    'seat_id',lu.id,
    'seat_status',lu.seat_status
  ) order by i.redeemed_at asc),'[]'::jsonb)
  into v_items
  from public.mdm_pilot_invitations i
  left join public.mdm_pilot_license_users lu
    on lu.license_id=i.license_id
   and lu.user_id=i.redeemed_by
  where i.school_id=v_school.id
    and i.status='redeemed'
    and i.redeemed_by is not null;

  return jsonb_build_object(
    'ok',true,
    'authorized',true,
    'school_id',v_school.id,
    'school_code',v_school.school_code,
    'school_name',v_school.name,
    'items',v_items
  );
end;
$$;

revoke all on function public.mdm_school_list_pilot_activation_queue() from public,anon;
grant execute on function public.mdm_school_list_pilot_activation_queue() to authenticated;

commit;

-- ONE-TIME SQL EDITOR BOOTSTRAP AFTER INSTALL:
-- select public.mdm_admin_bootstrap_owner_pilot(
--   'maltadrivingmaster@gmail.com',
--   'MDM-MT-ABC123',
--   30,
--   2
-- );
