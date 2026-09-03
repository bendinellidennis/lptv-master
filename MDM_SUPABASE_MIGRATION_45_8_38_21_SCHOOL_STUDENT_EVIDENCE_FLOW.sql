-- MALTA DRIVING MASTER
-- BUILD 45.8.38.21 - SCHOOL <-> STUDENT EVIDENCE FLOW FOUNDATION
-- Run in Supabase SQL Editor after the real school enrollment/membership migrations.
-- Server is the source of truth. Browser roles receive RPC access only; direct table access stays closed.

begin;

create extension if not exists pgcrypto;

create table if not exists public.mdm_school_student_missions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.mdm_schools(id) on delete cascade,
  student_user_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid not null references auth.users(id) on delete restrict,
  mission_type text not null default 'proofloop' check (mission_type in ('proofloop','practical','theory','telemetry','verification')),
  status text not null default 'assigned' check (status in ('assigned','in_progress','evidence_submitted','accepted','revision_requested','cancelled')),
  payload jsonb not null default '{}'::jsonb,
  student_evidence jsonb,
  school_review jsonb,
  assigned_at timestamptz not null default now(),
  evidence_submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists mdm_school_student_missions_student_idx
  on public.mdm_school_student_missions(student_user_id,status,assigned_at desc);
create index if not exists mdm_school_student_missions_school_idx
  on public.mdm_school_student_missions(school_id,status,assigned_at desc);

alter table public.mdm_school_student_missions enable row level security;
revoke all on table public.mdm_school_student_missions from anon, authenticated;

-- Canonical school roster used by School Home modules (including telemetry).
create or replace function public.mdm_school_list_active_students()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_admin public.mdm_school_memberships%rowtype;
  v_students jsonb := '[]'::jsonb;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode='42501';
  end if;

  select * into v_admin
  from public.mdm_school_memberships
  where user_id=v_uid and role='school_admin' and status='active'
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object('ok',true,'authorized',false,'students','[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'student_user_id',m.user_id,
    'student_name',coalesce(r.student_display_name,r.student_email,'Student'),
    'student_email',coalesce(r.student_email,''),
    'registration_id',coalesce(r.mdm_registration_id,''),
    'country_pack',coalesce(r.country_pack,''),
    'membership_status',m.status
  ) order by coalesce(r.student_display_name,r.student_email,'Student')), '[]'::jsonb)
  into v_students
  from public.mdm_school_memberships m
  left join lateral (
    select er.student_display_name,er.student_email,er.mdm_registration_id,er.country_pack
    from public.mdm_school_enrollment_requests er
    where er.school_id=m.school_id and er.user_id=m.user_id and er.status='approved'
    order by er.decided_at desc nulls last,er.requested_at desc
    limit 1
  ) r on true
  where m.school_id=v_admin.school_id and m.role='student' and m.status='active';

  return jsonb_build_object('ok',true,'authorized',true,'school_id',v_admin.school_id,'students',v_students);
end;
$$;

-- School creates one server mission for one ACTIVE student in the same school.
create or replace function public.mdm_school_assign_mission(
  p_student_user_id uuid,
  p_payload jsonb,
  p_mission_type text default 'proofloop'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_admin public.mdm_school_memberships%rowtype;
  v_student public.mdm_school_memberships%rowtype;
  v_type text := lower(trim(coalesce(p_mission_type,'proofloop')));
  v_payload jsonb := coalesce(p_payload,'{}'::jsonb);
  v_row public.mdm_school_student_missions%rowtype;
begin
  if v_uid is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if p_student_user_id is null then return jsonb_build_object('ok',false,'error','student_required'); end if;
  if v_type not in ('proofloop','practical','theory','telemetry','verification') then
    return jsonb_build_object('ok',false,'error','invalid_mission_type');
  end if;
  if octet_length(v_payload::text)>32768 then return jsonb_build_object('ok',false,'error','payload_too_large'); end if;

  select * into v_admin from public.mdm_school_memberships
  where user_id=v_uid and role='school_admin' and status='active'
  order by created_at asc limit 1;
  if not found then return jsonb_build_object('ok',false,'error','school_admin_required'); end if;

  select * into v_student from public.mdm_school_memberships
  where school_id=v_admin.school_id and user_id=p_student_user_id and role='student' and status='active'
  limit 1;
  if not found then return jsonb_build_object('ok',false,'error','active_student_not_in_school'); end if;

  insert into public.mdm_school_student_missions(
    school_id,student_user_id,assigned_by,mission_type,status,payload
  ) values (
    v_admin.school_id,p_student_user_id,v_uid,v_type,'assigned',v_payload
  ) returning * into v_row;

  return jsonb_build_object('ok',true,'mission_id',v_row.id,'status',v_row.status,'mission_type',v_row.mission_type,'assigned_at',v_row.assigned_at);
end;
$$;

-- Student sees only missions belonging to their own ACTIVE school membership.
create or replace function public.mdm_student_list_missions()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_items jsonb := '[]'::jsonb;
begin
  if v_uid is null then raise exception 'authentication_required' using errcode='42501'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'mission_id',x.id,
    'school_id',x.school_id,
    'mission_type',x.mission_type,
    'status',x.status,
    'payload',x.payload,
    'student_evidence',x.student_evidence,
    'school_review',x.school_review,
    'assigned_at',x.assigned_at,
    'evidence_submitted_at',x.evidence_submitted_at,
    'reviewed_at',x.reviewed_at,
    'updated_at',x.updated_at
  ) order by x.assigned_at desc), '[]'::jsonb)
  into v_items
  from public.mdm_school_student_missions x
  where x.student_user_id=v_uid
    and exists (
      select 1 from public.mdm_school_memberships m
      where m.school_id=x.school_id and m.user_id=v_uid and m.role='student' and m.status='active'
    );

  return jsonb_build_object('ok',true,'missions',v_items);
end;
$$;

-- Student submits evidence; identity, school and mission ownership are server-verified.
create or replace function public.mdm_student_submit_mission_evidence(
  p_mission_id uuid,
  p_evidence jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_evidence jsonb := coalesce(p_evidence,'{}'::jsonb);
  v_row public.mdm_school_student_missions%rowtype;
begin
  if v_uid is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if p_mission_id is null then return jsonb_build_object('ok',false,'error','mission_required'); end if;
  if octet_length(v_evidence::text)>65536 then return jsonb_build_object('ok',false,'error','evidence_too_large'); end if;

  select * into v_row from public.mdm_school_student_missions
  where id=p_mission_id and student_user_id=v_uid
  for update;
  if not found then return jsonb_build_object('ok',false,'error','mission_not_found'); end if;

  if not exists (
    select 1 from public.mdm_school_memberships m
    where m.school_id=v_row.school_id and m.user_id=v_uid and m.role='student' and m.status='active'
  ) then return jsonb_build_object('ok',false,'error','active_student_membership_required'); end if;

  if v_row.status in ('accepted','cancelled') then
    return jsonb_build_object('ok',false,'error','mission_closed','status',v_row.status);
  end if;

  update public.mdm_school_student_missions
  set student_evidence=v_evidence,
      status='evidence_submitted',
      evidence_submitted_at=now(),
      school_review=null,
      reviewed_at=null,
      reviewed_by=null,
      updated_at=now()
  where id=v_row.id;

  return jsonb_build_object('ok',true,'mission_id',v_row.id,'status','evidence_submitted','evidence_submitted_at',now());
end;
$$;

-- School sees missions only for its own school.
create or replace function public.mdm_school_list_student_missions(
  p_student_user_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_admin public.mdm_school_memberships%rowtype;
  v_items jsonb := '[]'::jsonb;
begin
  if v_uid is null then raise exception 'authentication_required' using errcode='42501'; end if;

  select * into v_admin from public.mdm_school_memberships
  where user_id=v_uid and role='school_admin' and status='active'
  order by created_at asc limit 1;
  if not found then return jsonb_build_object('ok',true,'authorized',false,'missions','[]'::jsonb); end if;

  if p_student_user_id is not null and not exists (
    select 1 from public.mdm_school_memberships m
    where m.school_id=v_admin.school_id and m.user_id=p_student_user_id and m.role='student' and m.status='active'
  ) then return jsonb_build_object('ok',false,'error','active_student_not_in_school'); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'mission_id',x.id,
    'student_user_id',x.student_user_id,
    'mission_type',x.mission_type,
    'status',x.status,
    'payload',x.payload,
    'student_evidence',x.student_evidence,
    'school_review',x.school_review,
    'assigned_at',x.assigned_at,
    'evidence_submitted_at',x.evidence_submitted_at,
    'reviewed_at',x.reviewed_at,
    'updated_at',x.updated_at
  ) order by x.assigned_at desc), '[]'::jsonb)
  into v_items
  from public.mdm_school_student_missions x
  where x.school_id=v_admin.school_id
    and (p_student_user_id is null or x.student_user_id=p_student_user_id);

  return jsonb_build_object('ok',true,'authorized',true,'school_id',v_admin.school_id,'missions',v_items);
end;
$$;

-- Human review is explicit: accepted or revision_requested. No automatic practical certification.
create or replace function public.mdm_school_review_mission_evidence(
  p_mission_id uuid,
  p_decision text,
  p_review jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_decision text := lower(trim(coalesce(p_decision,'')));
  v_review jsonb := coalesce(p_review,'{}'::jsonb);
  v_admin public.mdm_school_memberships%rowtype;
  v_row public.mdm_school_student_missions%rowtype;
begin
  if v_uid is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if v_decision not in ('accepted','revision_requested') then return jsonb_build_object('ok',false,'error','invalid_review_decision'); end if;
  if octet_length(v_review::text)>32768 then return jsonb_build_object('ok',false,'error','review_too_large'); end if;

  select * into v_admin from public.mdm_school_memberships
  where user_id=v_uid and role='school_admin' and status='active'
  order by created_at asc limit 1;
  if not found then return jsonb_build_object('ok',false,'error','school_admin_required'); end if;

  select * into v_row from public.mdm_school_student_missions
  where id=p_mission_id and school_id=v_admin.school_id
  for update;
  if not found then return jsonb_build_object('ok',false,'error','mission_not_found'); end if;
  if v_row.status<>'evidence_submitted' then return jsonb_build_object('ok',false,'error','evidence_not_pending_review','status',v_row.status); end if;

  update public.mdm_school_student_missions
  set status=v_decision,
      school_review=v_review,
      reviewed_at=now(),
      reviewed_by=v_uid,
      updated_at=now()
  where id=v_row.id;

  return jsonb_build_object('ok',true,'mission_id',v_row.id,'status',v_decision,'reviewed_at',now());
end;
$$;

revoke all on function public.mdm_school_list_active_students() from public, anon;
revoke all on function public.mdm_school_assign_mission(uuid,jsonb,text) from public, anon;
revoke all on function public.mdm_student_list_missions() from public, anon;
revoke all on function public.mdm_student_submit_mission_evidence(uuid,jsonb) from public, anon;
revoke all on function public.mdm_school_list_student_missions(uuid) from public, anon;
revoke all on function public.mdm_school_review_mission_evidence(uuid,text,jsonb) from public, anon;

grant execute on function public.mdm_school_list_active_students() to authenticated;
grant execute on function public.mdm_school_assign_mission(uuid,jsonb,text) to authenticated;
grant execute on function public.mdm_student_list_missions() to authenticated;
grant execute on function public.mdm_student_submit_mission_evidence(uuid,jsonb) to authenticated;
grant execute on function public.mdm_school_list_student_missions(uuid) to authenticated;
grant execute on function public.mdm_school_review_mission_evidence(uuid,text,jsonb) to authenticated;

commit;
