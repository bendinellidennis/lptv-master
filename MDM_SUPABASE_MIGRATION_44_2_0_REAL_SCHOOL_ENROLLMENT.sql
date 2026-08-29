-- MALTA DRIVING MASTER
-- BUILD 44.2.0 - REAL SCHOOL ENROLLMENT REQUEST
-- Run once in Supabase SQL Editor AFTER schema 44.0 and Auth 44.1.0 are working.
-- Idempotent: safe to run again. It does NOT grant school membership automatically.

begin;

create extension if not exists pgcrypto;

-- Server-managed join-code registry. The browser cannot list or edit these codes.
create table if not exists public.mdm_school_join_codes (
  code text primary key,
  school_name text not null,
  country_pack text not null default 'MT-LPTV-TAG',
  status text not null default 'active' check (status in ('active','disabled')),
  is_test boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Real server enrollment requests. A request is NOT a membership.
create table if not exists public.mdm_school_enrollment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school_code text not null references public.mdm_school_join_codes(code),
  country_pack text not null default 'MT-LPTV-TAG',
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  student_display_name text,
  student_email text,
  mdm_registration_id text,
  consent_version text not null default 'school-data-v1',
  consent_at timestamptz not null default now(),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  updated_at timestamptz not null default now()
);

create unique index if not exists mdm_school_enrollment_requests_user_school_uq
  on public.mdm_school_enrollment_requests(user_id, school_code);
create index if not exists mdm_school_enrollment_requests_user_status_idx
  on public.mdm_school_enrollment_requests(user_id, status, requested_at desc);
create index if not exists mdm_school_enrollment_requests_school_status_idx
  on public.mdm_school_enrollment_requests(school_code, status, requested_at asc);

alter table public.mdm_school_join_codes enable row level security;
alter table public.mdm_school_enrollment_requests enable row level security;

-- Join codes stay server-only. Request rows are readable only by the authenticated owner.
revoke all on table public.mdm_school_join_codes from anon, authenticated;
revoke all on table public.mdm_school_enrollment_requests from anon, authenticated;
grant select on table public.mdm_school_enrollment_requests to authenticated;

drop policy if exists mdm_enrollment_requests_select_own on public.mdm_school_enrollment_requests;
create policy mdm_enrollment_requests_select_own
on public.mdm_school_enrollment_requests
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Legacy development/pilot join code retained only for historical compatibility.
-- SECURITY: it must remain disabled and cannot be reactivated by re-running this migration.
insert into public.mdm_school_join_codes(code, school_name, country_pack, status, is_test)
values ('MDM-MT-ABC123', 'MDM Malta Pilot School (TEST)', 'MT-LPTV-TAG', 'disabled', true)
on conflict (code) do update
set school_name = excluded.school_name,
    country_pack = excluded.country_pack,
    status = 'disabled',
    is_test = true,
    updated_at = now();

-- Authenticated student submits a real server request.
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

  if coalesce(v_join.country_pack, '') <> '' and v_pack <> v_join.country_pack then
    return jsonb_build_object('ok', false, 'error', 'country_pack_mismatch');
  end if;

  insert into public.mdm_school_enrollment_requests(
    user_id, school_code, country_pack, status,
    student_display_name, student_email, mdm_registration_id,
    consent_version, consent_at, requested_at, updated_at
  ) values (
    v_uid, v_join.code, v_join.country_pack, 'pending',
    nullif(left(trim(coalesce(p_display_name, '')), 160), ''),
    nullif(left(v_email, 254), ''),
    nullif(left(trim(coalesce(p_registration_id, '')), 120), ''),
    'school-data-v1', now(), now(), now()
  )
  on conflict (user_id, school_code) do update
  set status = case
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
      updated_at = now()
  returning * into v_req;

  return jsonb_build_object(
    'ok', true,
    'request_id', v_req.id,
    'status', v_req.status,
    'school_code', v_join.code,
    'school_name', v_join.school_name,
    'country_pack', v_join.country_pack,
    'is_test', v_join.is_test,
    'requested_at', v_req.requested_at,
    'consent_at', v_req.consent_at
  );
end;
$$;

-- Student can refresh only their own latest request state.
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

  return jsonb_build_object(
    'ok', true,
    'found', true,
    'request_id', v_req.id,
    'status', v_req.status,
    'school_code', v_req.school_code,
    'school_name', coalesce(v_join.school_name, v_req.school_code),
    'country_pack', v_req.country_pack,
    'is_test', coalesce(v_join.is_test, false),
    'requested_at', v_req.requested_at,
    'updated_at', v_req.updated_at,
    'decided_at', v_req.decided_at
  );
end;
$$;

-- Student may cancel only a still-pending request. This still does NOT touch membership.
create or replace function public.mdm_cancel_school_enrollment(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_req public.mdm_school_enrollment_requests%rowtype;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  update public.mdm_school_enrollment_requests
  set status = 'cancelled', updated_at = now()
  where id = p_request_id
    and user_id = v_uid
    and status = 'pending'
  returning * into v_req;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'pending_request_not_found');
  end if;

  return jsonb_build_object('ok', true, 'request_id', v_req.id, 'status', v_req.status);
end;
$$;

revoke all on function public.mdm_request_school_enrollment(text,text,text,text) from public, anon;
revoke all on function public.mdm_get_my_school_enrollment() from public, anon;
revoke all on function public.mdm_cancel_school_enrollment(uuid) from public, anon;
grant execute on function public.mdm_request_school_enrollment(text,text,text,text) to authenticated;
grant execute on function public.mdm_get_my_school_enrollment() to authenticated;
grant execute on function public.mdm_cancel_school_enrollment(uuid) to authenticated;

commit;
