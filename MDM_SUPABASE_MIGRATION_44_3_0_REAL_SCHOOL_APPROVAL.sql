-- MALTA DRIVING MASTER
-- BUILD 44.3.0 - REAL SCHOOL APPROVAL / REJECTION
-- Run in Supabase SQL Editor AFTER 44.2.0 has succeeded.
-- Idempotent. Approval is atomic: only an authorized active school_admin can
-- approve a PENDING request, and only approval creates an ACTIVE student membership.
-- Rejection never creates membership. Self-approval is forbidden.

begin;

create extension if not exists pgcrypto;

-- Link the 44.2 join-code registry to the canonical 44.0 school table.
alter table public.mdm_school_join_codes
  add column if not exists school_id uuid references public.mdm_schools(id) on delete restrict;

-- Extend real enrollment requests with the canonical school and decision audit fields.
alter table public.mdm_school_enrollment_requests
  add column if not exists school_id uuid references public.mdm_schools(id) on delete restrict;
alter table public.mdm_school_enrollment_requests
  add column if not exists decided_by uuid references auth.users(id) on delete set null;
alter table public.mdm_school_enrollment_requests
  add column if not exists decision_note text;

-- Extend the 44.0 membership table without changing its original meaning.
alter table public.mdm_school_memberships
  add column if not exists source_request_id uuid references public.mdm_school_enrollment_requests(id) on delete set null;
alter table public.mdm_school_memberships
  add column if not exists updated_at timestamptz not null default now();

-- Pilot school is a real server row but remains explicitly TEST / not production-verified.
insert into public.mdm_schools(school_code,name,country_code,verified)
values ('MDM-MT-ABC123','MDM Malta Pilot School (TEST)','MT',false)
on conflict (school_code) do update
set name=excluded.name,
    country_code=excluded.country_code;

update public.mdm_school_join_codes jc
set school_id=s.id,
    school_name=s.name,
    updated_at=now()
from public.mdm_schools s
where jc.code='MDM-MT-ABC123'
  and s.school_code='MDM-MT-ABC123';

-- Backfill the request already created in 44.2.0 and any later request whose join code is linked.
update public.mdm_school_enrollment_requests r
set school_id=jc.school_id,
    updated_at=now()
from public.mdm_school_join_codes jc
where r.school_code=jc.code
  and r.school_id is null
  and jc.school_id is not null;

create index if not exists mdm_membership_school_status_role_idx
  on public.mdm_school_memberships(school_id,status,role,user_id);
create index if not exists mdm_enrollment_school_id_status_idx
  on public.mdm_school_enrollment_requests(school_id,status,requested_at asc);

-- Append-only decision audit. No browser role gets direct table access.
create table if not exists public.mdm_school_enrollment_decisions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.mdm_school_enrollment_requests(id) on delete cascade,
  school_id uuid not null references public.mdm_schools(id) on delete cascade,
  student_user_id uuid not null references auth.users(id) on delete cascade,
  decided_by uuid not null references auth.users(id) on delete restrict,
  decision text not null check (decision in ('approved','rejected')),
  note text,
  created_at timestamptz not null default now()
);
create index if not exists mdm_school_enrollment_decisions_request_idx
  on public.mdm_school_enrollment_decisions(request_id,created_at desc);
create index if not exists mdm_school_enrollment_decisions_school_idx
  on public.mdm_school_enrollment_decisions(school_id,created_at desc);
alter table public.mdm_school_enrollment_decisions enable row level security;
revoke all on table public.mdm_school_enrollment_decisions from anon, authenticated;

-- Rebuild the 44.2 student request RPC so every new request is linked to a canonical school_id.
create or replace function public.mdm_request_school_enrollment(
  p_school_code text,
  p_country_pack text default 'MT-LPTV-TAG',
  p_display_name text default null,
  p_registration_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_code text := upper(trim(coalesce(p_school_code, '')));
  v_pack text := trim(coalesce(p_country_pack, 'MT-LPTV-TAG'));
  v_email text := coalesce(auth.jwt() ->> 'email', '');
  v_join public.mdm_school_join_codes%rowtype;
  v_req public.mdm_school_enrollment_requests%rowtype;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if v_code = '' or v_code !~ '^[A-Z0-9][A-Z0-9-]{5,31}$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_school_code');
  end if;

  select * into v_join
  from public.mdm_school_join_codes
  where code = v_code
    and status = 'active'
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'school_code_not_found');
  end if;

  if v_join.school_id is null then
    return jsonb_build_object('ok', false, 'error', 'school_not_linked_to_registry');
  end if;

  if coalesce(v_join.country_pack, '') <> '' and v_pack <> v_join.country_pack then
    return jsonb_build_object('ok', false, 'error', 'country_pack_mismatch');
  end if;

  insert into public.mdm_school_enrollment_requests(
    user_id, school_id, school_code, country_pack, status,
    student_display_name, student_email, mdm_registration_id,
    consent_version, consent_at, requested_at, decided_at, decided_by, decision_note, updated_at
  ) values (
    v_uid, v_join.school_id, v_join.code, v_join.country_pack, 'pending',
    nullif(left(trim(coalesce(p_display_name, '')), 160), ''),
    nullif(left(v_email, 254), ''),
    nullif(left(trim(coalesce(p_registration_id, '')), 120), ''),
    'school-data-v1', now(), now(), null, null, null, now()
  )
  on conflict (user_id, school_code) do update
  set school_id = excluded.school_id,
      status = case
        when public.mdm_school_enrollment_requests.status = 'approved' then 'approved'
        else 'pending'
      end,
      student_display_name = excluded.student_display_name,
      student_email = excluded.student_email,
      mdm_registration_id = excluded.mdm_registration_id,
      consent_version = excluded.consent_version,
      consent_at = excluded.consent_at,
      requested_at = case
        when public.mdm_school_enrollment_requests.status = 'approved'
          then public.mdm_school_enrollment_requests.requested_at
        else now()
      end,
      decided_at = case
        when public.mdm_school_enrollment_requests.status = 'approved'
          then public.mdm_school_enrollment_requests.decided_at
        else null
      end,
      decided_by = case
        when public.mdm_school_enrollment_requests.status = 'approved'
          then public.mdm_school_enrollment_requests.decided_by
        else null
      end,
      decision_note = case
        when public.mdm_school_enrollment_requests.status = 'approved'
          then public.mdm_school_enrollment_requests.decision_note
        else null
      end,
      updated_at = now()
  returning * into v_req;

  return jsonb_build_object(
    'ok', true,
    'request_id', v_req.id,
    'status', v_req.status,
    'school_id', v_req.school_id,
    'school_code', v_join.code,
    'school_name', v_join.school_name,
    'country_pack', v_join.country_pack,
    'is_test', v_join.is_test,
    'requested_at', v_req.requested_at,
    'consent_at', v_req.consent_at
  );
end;
$$;

-- Student refresh now also proves whether an ACTIVE server membership really exists.
create or replace function public.mdm_get_my_school_enrollment()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_req public.mdm_school_enrollment_requests%rowtype;
  v_join public.mdm_school_join_codes%rowtype;
  v_school public.mdm_schools%rowtype;
  v_member public.mdm_school_memberships%rowtype;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into v_req
  from public.mdm_school_enrollment_requests
  where user_id = v_uid
  order by requested_at desc
  limit 1;

  if not found then
    return jsonb_build_object('ok', true, 'found', false);
  end if;

  select * into v_join
  from public.mdm_school_join_codes
  where code = v_req.school_code
  limit 1;

  if v_req.school_id is not null then
    select * into v_school from public.mdm_schools where id=v_req.school_id limit 1;
    select * into v_member
    from public.mdm_school_memberships
    where school_id=v_req.school_id
      and user_id=v_uid
      and status='active'
    limit 1;
  end if;

  return jsonb_build_object(
    'ok', true,
    'found', true,
    'request_id', v_req.id,
    'status', v_req.status,
    'school_id', v_req.school_id,
    'school_code', v_req.school_code,
    'school_name', coalesce(v_school.name, v_join.school_name, v_req.school_code),
    'country_pack', v_req.country_pack,
    'is_test', coalesce(v_join.is_test, false),
    'requested_at', v_req.requested_at,
    'updated_at', v_req.updated_at,
    'decided_at', v_req.decided_at,
    'decision_note', v_req.decision_note,
    'membership_status', case when v_member.user_id is null then null else v_member.status end,
    'membership_role', case when v_member.user_id is null then null else v_member.role end,
    'membership_active', (v_member.user_id is not null and v_member.status='active')
  );
end;
$$;

-- Server authorization context for the currently authenticated school professional.
create or replace function public.mdm_get_my_school_admin_context()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_member public.mdm_school_memberships%rowtype;
  v_school public.mdm_schools%rowtype;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into v_member
  from public.mdm_school_memberships
  where user_id=v_uid
    and role='school_admin'
    and status='active'
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object('ok', true, 'authorized', false);
  end if;

  select * into v_school from public.mdm_schools where id=v_member.school_id limit 1;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'school_record_missing');
  end if;

  return jsonb_build_object(
    'ok', true,
    'authorized', true,
    'school_id', v_school.id,
    'school_code', v_school.school_code,
    'school_name', v_school.name,
    'school_verified', v_school.verified,
    'role', v_member.role,
    'membership_status', v_member.status
  );
end;
$$;

-- Authorized school admin sees only PENDING requests for their own school.
create or replace function public.mdm_school_list_pending_enrollments()
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
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into v_member
  from public.mdm_school_memberships
  where user_id=v_uid and role='school_admin' and status='active'
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object('ok', true, 'authorized', false, 'pending', '[]'::jsonb);
  end if;

  select * into v_school from public.mdm_schools where id=v_member.school_id limit 1;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'school_record_missing');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'request_id', r.id,
    'student_user_id', r.user_id,
    'student_name', coalesce(r.student_display_name, '—'),
    'student_email', coalesce(r.student_email, ''),
    'registration_id', coalesce(r.mdm_registration_id, ''),
    'country_pack', r.country_pack,
    'requested_at', r.requested_at,
    'consent_at', r.consent_at,
    'can_decide', (r.user_id <> v_uid)
  ) order by r.requested_at asc), '[]'::jsonb)
  into v_items
  from public.mdm_school_enrollment_requests r
  where r.school_id=v_member.school_id
    and r.status='pending';

  return jsonb_build_object(
    'ok', true,
    'authorized', true,
    'school_id', v_school.id,
    'school_code', v_school.school_code,
    'school_name', v_school.name,
    'school_verified', v_school.verified,
    'role', v_member.role,
    'pending', v_items
  );
end;
$$;

-- Atomic school decision. Approval creates ACTIVE student membership; rejection creates none.
create or replace function public.mdm_school_decide_enrollment(
  p_request_id uuid,
  p_decision text,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_uid uuid := auth.uid();
  v_decision text := lower(trim(coalesce(p_decision,'')));
  v_note text := nullif(left(trim(coalesce(p_note,'')),500),'');
  v_req public.mdm_school_enrollment_requests%rowtype;
  v_admin public.mdm_school_memberships%rowtype;
  v_existing public.mdm_school_memberships%rowtype;
  v_school public.mdm_schools%rowtype;
begin
  if v_admin_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if v_decision not in ('approved','rejected') then
    return jsonb_build_object('ok', false, 'error', 'invalid_decision');
  end if;

  select * into v_req
  from public.mdm_school_enrollment_requests
  where id=p_request_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'request_not_found');
  end if;

  if v_req.school_id is null then
    return jsonb_build_object('ok', false, 'error', 'request_school_not_linked');
  end if;

  select * into v_admin
  from public.mdm_school_memberships
  where school_id=v_req.school_id
    and user_id=v_admin_uid
    and role='school_admin'
    and status='active'
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'school_admin_required');
  end if;

  if v_req.user_id=v_admin_uid then
    return jsonb_build_object('ok', false, 'error', 'self_decision_forbidden');
  end if;

  if v_req.status<>'pending' then
    return jsonb_build_object('ok', false, 'error', 'request_not_pending', 'status', v_req.status);
  end if;

  select * into v_school from public.mdm_schools where id=v_req.school_id limit 1;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'school_record_missing');
  end if;

  if v_decision='approved' then
    select * into v_existing
    from public.mdm_school_memberships
    where school_id=v_req.school_id and user_id=v_req.user_id
    limit 1;

    if found and v_existing.role<>'student' then
      return jsonb_build_object('ok', false, 'error', 'membership_role_conflict', 'role', v_existing.role);
    end if;

    insert into public.mdm_school_memberships(
      school_id,user_id,role,status,created_at,source_request_id,updated_at
    ) values (
      v_req.school_id,v_req.user_id,'student','active',now(),v_req.id,now()
    )
    on conflict (school_id,user_id) do update
    set role='student',
        status='active',
        source_request_id=excluded.source_request_id,
        updated_at=now();
  end if;

  update public.mdm_school_enrollment_requests
  set status=v_decision,
      decided_at=now(),
      decided_by=v_admin_uid,
      decision_note=v_note,
      updated_at=now()
  where id=v_req.id;

  insert into public.mdm_school_enrollment_decisions(
    request_id,school_id,student_user_id,decided_by,decision,note
  ) values (
    v_req.id,v_req.school_id,v_req.user_id,v_admin_uid,v_decision,v_note
  );

  return jsonb_build_object(
    'ok', true,
    'request_id', v_req.id,
    'decision', v_decision,
    'school_id', v_school.id,
    'school_code', v_school.school_code,
    'school_name', v_school.name,
    'student_user_id', v_req.user_id,
    'membership_status', case when v_decision='approved' then 'active' else null end,
    'membership_role', case when v_decision='approved' then 'student' else null end,
    'decided_at', now()
  );
end;
$$;

-- SQL-EDITOR-ONLY bootstrap for the TEST pilot school.
-- This is deliberately NOT executable by anon/authenticated browser roles.
-- Create/confirm a SECOND Supabase Auth account first, then call this function
-- manually in SQL Editor with that second account email.
create or replace function public.mdm_admin_bootstrap_pilot_school_admin(
  p_school_code text,
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text := upper(trim(coalesce(p_school_code,'')));
  v_email text := lower(trim(coalesce(p_email,'')));
  v_join public.mdm_school_join_codes%rowtype;
  v_uid uuid;
  v_school public.mdm_schools%rowtype;
begin
  select * into v_join
  from public.mdm_school_join_codes
  where code=v_code and status='active' and is_test=true
  limit 1;

  if not found or v_join.school_id is null then
    return jsonb_build_object('ok', false, 'error', 'test_school_not_found');
  end if;

  select id into v_uid
  from auth.users
  where lower(email)=v_email
    and email_confirmed_at is not null
  order by created_at asc
  limit 1;

  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'confirmed_auth_user_not_found');
  end if;

  select * into v_school from public.mdm_schools where id=v_join.school_id limit 1;

  insert into public.mdm_school_memberships(
    school_id,user_id,role,status,created_at,source_request_id,updated_at
  ) values (
    v_join.school_id,v_uid,'school_admin','active',now(),null,now()
  )
  on conflict (school_id,user_id) do update
  set role='school_admin',status='active',source_request_id=null,updated_at=now();

  return jsonb_build_object(
    'ok', true,
    'school_id', v_join.school_id,
    'school_code', v_join.code,
    'school_name', coalesce(v_school.name,v_join.school_name),
    'admin_user_id', v_uid,
    'admin_email', v_email,
    'role', 'school_admin',
    'status', 'active'
  );
end;
$$;

-- Keep direct table writes closed. Browser actions go only through narrowly scoped RPCs.
revoke all on function public.mdm_request_school_enrollment(text,text,text,text) from public, anon;
revoke all on function public.mdm_get_my_school_enrollment() from public, anon;
revoke all on function public.mdm_get_my_school_admin_context() from public, anon;
revoke all on function public.mdm_school_list_pending_enrollments() from public, anon;
revoke all on function public.mdm_school_decide_enrollment(uuid,text,text) from public, anon;
revoke all on function public.mdm_admin_bootstrap_pilot_school_admin(text,text) from public, anon, authenticated;

grant execute on function public.mdm_request_school_enrollment(text,text,text,text) to authenticated;
grant execute on function public.mdm_get_my_school_enrollment() to authenticated;
grant execute on function public.mdm_get_my_school_admin_context() to authenticated;
grant execute on function public.mdm_school_list_pending_enrollments() to authenticated;
grant execute on function public.mdm_school_decide_enrollment(uuid,text,text) to authenticated;
grant execute on function public.mdm_admin_bootstrap_pilot_school_admin(text,text) to postgres;

commit;
