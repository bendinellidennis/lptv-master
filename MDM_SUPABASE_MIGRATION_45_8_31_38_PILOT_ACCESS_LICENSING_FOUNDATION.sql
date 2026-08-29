-- MALTA DRIVING MASTER
-- BUILD 45.8.31.38 - PILOT ACCESS & LICENSING GATE / SERVER FOUNDATION
-- Source of truth: main GitHub after 45.8.31.37.1 security hardening.
-- Purpose: create the server-side licensing data model and a read-only entitlement RPC.
-- IMPORTANT: this migration does NOT switch the frontend gate on yet and does NOT touch
-- question banks, Replay, frozen learning modules, answer keys, or premium content files.
-- Idempotent: safe to run again.

begin;

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1) LICENSES
-- One license can represent an individual pilot entitlement or a school seat pool.
-- -----------------------------------------------------------------------------
create table if not exists public.mdm_pilot_licenses (
  id uuid primary key default gen_random_uuid(),
  license_key uuid not null default gen_random_uuid() unique,
  license_type text not null default 'individual'
    check (license_type in ('individual','school','pilot')),
  plan_code text not null default 'pilot',
  school_id uuid references public.mdm_schools(id) on delete restrict,
  status text not null default 'active'
    check (status in ('active','suspended','expired','revoked')),
  seat_limit integer not null default 1 check (seat_limit > 0 and seat_limit <= 100000),
  device_limit integer not null default 2 check (device_limit > 0 and device_limit <= 20),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  revocation_reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null or expires_at > starts_at)
);

create index if not exists mdm_pilot_licenses_school_status_idx
  on public.mdm_pilot_licenses(school_id,status,expires_at);
create index if not exists mdm_pilot_licenses_status_expiry_idx
  on public.mdm_pilot_licenses(status,expires_at);

-- -----------------------------------------------------------------------------
-- 2) LICENSE USERS / SEATS
-- Server-side mapping between a license and an authenticated user.
-- -----------------------------------------------------------------------------
create table if not exists public.mdm_pilot_license_users (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references public.mdm_pilot_licenses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  seat_status text not null default 'active'
    check (seat_status in ('active','suspended','revoked')),
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(),
  revoked_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (license_id,user_id)
);

create index if not exists mdm_pilot_license_users_user_status_idx
  on public.mdm_pilot_license_users(user_id,seat_status,license_id);
create index if not exists mdm_pilot_license_users_license_status_idx
  on public.mdm_pilot_license_users(license_id,seat_status,user_id);

-- -----------------------------------------------------------------------------
-- 3) INVITATIONS
-- Store only a token hash. Raw invite tokens must never be persisted here.
-- Redemption RPC is intentionally a later step.
-- -----------------------------------------------------------------------------
create table if not exists public.mdm_pilot_invitations (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references public.mdm_pilot_licenses(id) on delete cascade,
  school_id uuid references public.mdm_schools(id) on delete restrict,
  invite_email text not null,
  invite_email_normalized text generated always as (lower(trim(invite_email))) stored,
  token_hash text not null unique,
  status text not null default 'pending'
    check (status in ('pending','redeemed','expired','revoked')),
  expires_at timestamptz not null,
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(token_hash) >= 32),
  check (expires_at > created_at)
);

create index if not exists mdm_pilot_invitations_email_status_idx
  on public.mdm_pilot_invitations(invite_email_normalized,status,expires_at);
create index if not exists mdm_pilot_invitations_license_status_idx
  on public.mdm_pilot_invitations(license_id,status,expires_at);

-- -----------------------------------------------------------------------------
-- 4) REGISTERED DEVICES
-- Privacy-preserving device identifiers only. No raw fingerprinting payloads.
-- -----------------------------------------------------------------------------
create table if not exists public.mdm_pilot_registered_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  license_id uuid not null references public.mdm_pilot_licenses(id) on delete cascade,
  device_token_hash text not null,
  device_label text,
  status text not null default 'active'
    check (status in ('active','revoked')),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id,device_token_hash),
  check (char_length(device_token_hash) >= 32)
);

create index if not exists mdm_pilot_devices_user_status_idx
  on public.mdm_pilot_registered_devices(user_id,status,last_seen_at desc);
create index if not exists mdm_pilot_devices_license_status_idx
  on public.mdm_pilot_registered_devices(license_id,status,user_id);

-- -----------------------------------------------------------------------------
-- 5) SECURITY AUDIT
-- Append-only through future SECURITY DEFINER RPCs. No browser direct access.
-- -----------------------------------------------------------------------------
create table if not exists public.mdm_pilot_security_audit (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  school_id uuid references public.mdm_schools(id) on delete set null,
  license_id uuid references public.mdm_pilot_licenses(id) on delete set null,
  event_type text not null,
  outcome text not null check (outcome in ('allow','deny','info')),
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists mdm_pilot_security_audit_user_time_idx
  on public.mdm_pilot_security_audit(user_id,created_at desc);
create index if not exists mdm_pilot_security_audit_license_time_idx
  on public.mdm_pilot_security_audit(license_id,created_at desc);
create index if not exists mdm_pilot_security_audit_event_time_idx
  on public.mdm_pilot_security_audit(event_type,created_at desc);

-- -----------------------------------------------------------------------------
-- 6) RLS + LEAST PRIVILEGE
-- No table is directly readable/writable from anon or authenticated browser roles.
-- Access will be mediated by narrow RPCs.
-- -----------------------------------------------------------------------------
alter table public.mdm_pilot_licenses enable row level security;
alter table public.mdm_pilot_license_users enable row level security;
alter table public.mdm_pilot_invitations enable row level security;
alter table public.mdm_pilot_registered_devices enable row level security;
alter table public.mdm_pilot_security_audit enable row level security;

revoke all on table public.mdm_pilot_licenses from public, anon, authenticated;
revoke all on table public.mdm_pilot_license_users from public, anon, authenticated;
revoke all on table public.mdm_pilot_invitations from public, anon, authenticated;
revoke all on table public.mdm_pilot_registered_devices from public, anon, authenticated;
revoke all on table public.mdm_pilot_security_audit from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- 7) READ-ONLY ENTITLEMENT CHECK
-- This is intentionally the only browser-callable RPC in this first server step.
-- It does not grant, redeem, revoke, or mutate anything.
-- -----------------------------------------------------------------------------
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
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select
    l.id as license_id,
    l.license_type,
    l.plan_code,
    l.school_id,
    l.status as license_status,
    l.seat_limit,
    l.device_limit,
    l.starts_at,
    l.expires_at,
    lu.seat_status
  into v_row
  from public.mdm_pilot_license_users lu
  join public.mdm_pilot_licenses l on l.id = lu.license_id
  where lu.user_id = v_uid
    and lu.seat_status = 'active'
    and l.status = 'active'
    and l.starts_at <= now()
    and (l.expires_at is null or l.expires_at > now())
  order by l.expires_at nulls last, lu.assigned_at asc
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', true,
      'authorized', false,
      'reason', 'no_active_license'
    );
  end if;

  select count(*)::integer
  into v_active_devices
  from public.mdm_pilot_registered_devices d
  where d.user_id = v_uid
    and d.license_id = v_row.license_id
    and d.status = 'active';

  return jsonb_build_object(
    'ok', true,
    'authorized', true,
    'license_id', v_row.license_id,
    'license_type', v_row.license_type,
    'plan_code', v_row.plan_code,
    'school_id', v_row.school_id,
    'license_status', v_row.license_status,
    'seat_status', v_row.seat_status,
    'starts_at', v_row.starts_at,
    'expires_at', v_row.expires_at,
    'device_limit', v_row.device_limit,
    'active_devices', v_active_devices,
    'device_limit_reached', (v_active_devices >= v_row.device_limit)
  );
end;
$$;

revoke all on function public.mdm_check_my_pilot_entitlement() from public, anon;
grant execute on function public.mdm_check_my_pilot_entitlement() to authenticated;

commit;

-- ACCEPTANCE FOR THIS STEP AFTER RUNNING IN SUPABASE:
-- 1) all five mdm_pilot_* tables exist with RLS enabled;
-- 2) anon/authenticated have no direct table privileges;
-- 3) anon cannot execute mdm_check_my_pilot_entitlement();
-- 4) authenticated can execute it and receives authorized=false until a real server license is assigned;
-- 5) existing Auth / School / Student flows remain unchanged because the frontend gate is not enabled yet.
