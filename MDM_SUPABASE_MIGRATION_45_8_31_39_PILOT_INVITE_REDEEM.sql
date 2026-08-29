-- MALTA DRIVING MASTER
-- BUILD 45.8.31.39 - PILOT ACCESS & LICENSING GATE / INVITE + REDEEM
-- Run AFTER 45.8.31.38 has been installed and verified.
-- This step installs invitation/redeem server logic only.
-- It does NOT assign a license seat yet and does NOT enable any frontend block.
-- It does NOT touch question banks, Replay, answer keys, official visuals, or frozen modules.
-- Idempotent: safe to run again.

begin;

create extension if not exists pgcrypto;

-- Prevent more than one live pending invitation for the same license/email pair.
create unique index if not exists mdm_pilot_invitations_one_pending_uq
  on public.mdm_pilot_invitations(license_id, invite_email_normalized)
  where status = 'pending';

-- -----------------------------------------------------------------------------
-- SCHOOL ADMIN: CREATE INVITATION
-- Security rules:
--   * authenticated user required
--   * active school_admin membership required
--   * license must belong to the same school
--   * license must be active and within its validity window
--   * raw invite token is returned once; only SHA-256 hash is stored
--   * this RPC does NOT allocate a seat
-- -----------------------------------------------------------------------------
create or replace function public.mdm_school_create_pilot_invitation(
  p_license_id uuid,
  p_invite_email text,
  p_valid_hours integer default 72
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(trim(coalesce(p_invite_email, '')));
  v_hours integer := greatest(1, least(coalesce(p_valid_hours, 72), 168));
  v_member public.mdm_school_memberships%rowtype;
  v_license public.mdm_pilot_licenses%rowtype;
  v_raw_token text;
  v_token_hash text;
  v_inv public.mdm_pilot_invitations%rowtype;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if v_email = ''
     or char_length(v_email) > 254
     or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_email');
  end if;

  select * into v_license
  from public.mdm_pilot_licenses
  where id = p_license_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'license_not_found');
  end if;

  if v_license.school_id is null then
    return jsonb_build_object('ok', false, 'error', 'school_license_required');
  end if;

  select * into v_member
  from public.mdm_school_memberships
  where user_id = v_uid
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

  -- Revoke an older still-pending invitation for the same email/license.
  update public.mdm_pilot_invitations
  set status = 'revoked',
      updated_at = now()
  where license_id = v_license.id
    and invite_email_normalized = v_email
    and status = 'pending';

  v_raw_token := encode(extensions.gen_random_bytes(32), 'hex');
  v_token_hash := encode(extensions.digest(v_raw_token, 'sha256'), 'hex');

  insert into public.mdm_pilot_invitations(
    license_id,
    school_id,
    invite_email,
    token_hash,
    status,
    expires_at,
    created_by,
    created_at,
    updated_at
  ) values (
    v_license.id,
    v_license.school_id,
    v_email,
    v_token_hash,
    'pending',
    now() + make_interval(hours => v_hours),
    v_uid,
    now(),
    now()
  )
  returning * into v_inv;

  return jsonb_build_object(
    'ok', true,
    'invitation_id', v_inv.id,
    'license_id', v_inv.license_id,
    'school_id', v_inv.school_id,
    'invite_email', v_inv.invite_email_normalized,
    'status', v_inv.status,
    'expires_at', v_inv.expires_at,
    'invite_token', v_raw_token
  );
end;
$$;

-- -----------------------------------------------------------------------------
-- AUTHENTICATED USER: REDEEM INVITATION
-- Security rules:
--   * token is compared by SHA-256 hash only
--   * invitation must be pending and unexpired
--   * signed-in JWT email must match invited email
--   * license must still be active
--   * redemption does NOT allocate/activate a seat yet
-- -----------------------------------------------------------------------------
create or replace function public.mdm_redeem_pilot_invitation(
  p_invite_token text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_jwt_email text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  v_token text := trim(coalesce(p_invite_token, ''));
  v_hash text;
  v_inv public.mdm_pilot_invitations%rowtype;
  v_license public.mdm_pilot_licenses%rowtype;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if v_token = '' or char_length(v_token) < 32 or char_length(v_token) > 256 then
    return jsonb_build_object('ok', false, 'error', 'invalid_invite_token');
  end if;

  if v_jwt_email = '' then
    return jsonb_build_object('ok', false, 'error', 'authenticated_email_required');
  end if;

  v_hash := encode(extensions.digest(v_token, 'sha256'), 'hex');

  select * into v_inv
  from public.mdm_pilot_invitations
  where token_hash = v_hash
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invitation_not_found');
  end if;

  if v_inv.status <> 'pending' then
    return jsonb_build_object('ok', false, 'error', 'invitation_not_pending', 'status', v_inv.status);
  end if;

  if v_inv.expires_at <= now() then
    update public.mdm_pilot_invitations
    set status = 'expired', updated_at = now()
    where id = v_inv.id;

    return jsonb_build_object('ok', false, 'error', 'invitation_expired');
  end if;

  if v_inv.invite_email_normalized <> v_jwt_email then
    return jsonb_build_object('ok', false, 'error', 'invitation_email_mismatch');
  end if;

  select * into v_license
  from public.mdm_pilot_licenses
  where id = v_inv.license_id
  limit 1;

  if not found
     or v_license.status <> 'active'
     or v_license.starts_at > now()
     or (v_license.expires_at is not null and v_license.expires_at <= now()) then
    return jsonb_build_object('ok', false, 'error', 'license_not_active');
  end if;

  update public.mdm_pilot_invitations
  set status = 'redeemed',
      redeemed_by = v_uid,
      redeemed_at = now(),
      updated_at = now()
  where id = v_inv.id
  returning * into v_inv;

  return jsonb_build_object(
    'ok', true,
    'redeemed', true,
    'invitation_id', v_inv.id,
    'license_id', v_inv.license_id,
    'school_id', v_inv.school_id,
    'invite_email', v_inv.invite_email_normalized,
    'redeemed_by', v_inv.redeemed_by,
    'redeemed_at', v_inv.redeemed_at,
    'seat_assigned', false,
    'next_step', 'license_seat_assignment'
  );
end;
$$;

revoke all on function public.mdm_school_create_pilot_invitation(uuid,text,integer) from public, anon;
revoke all on function public.mdm_redeem_pilot_invitation(text) from public, anon;

grant execute on function public.mdm_school_create_pilot_invitation(uuid,text,integer) to authenticated;
grant execute on function public.mdm_redeem_pilot_invitation(text) to authenticated;

commit;
