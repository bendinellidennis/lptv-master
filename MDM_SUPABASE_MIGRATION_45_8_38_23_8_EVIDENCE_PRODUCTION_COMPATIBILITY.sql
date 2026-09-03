-- MALTA DRIVING MASTER
-- BUILD 45.8.38.23.8 - SCHOOL <-> STUDENT EVIDENCE PRODUCTION COMPATIBILITY
-- Applied to the existing production mission architecture.
-- Keeps public.mdm_school_missions as the single mission table and preserves legacy RPCs.
-- Adds dedicated Evidence RPCs with server-side membership checks, rate guards and human review.

create or replace function public.mdm_school_assign_evidence_mission(
  p_student_user_id uuid,
  p_payload jsonb,
  p_mission_type text default 'verification'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_admin public.mdm_school_memberships%rowtype;
  v_target public.mdm_school_memberships%rowtype;
  v_type text := lower(trim(coalesce(p_mission_type,'verification')));
  v_payload jsonb := coalesce(p_payload,'{}'::jsonb);
  v_id uuid;
  v_created timestamptz;
begin
  if v_uid is null then raise exception 'authentication_required' using errcode='42501'; end if;
  perform public.mdm_security_rate_guard('evidence_mission_assign', 30, 300);

  if jsonb_typeof(v_payload) <> 'object' then
    return jsonb_build_object('ok',false,'error','invalid_payload');
  end if;
  if octet_length(v_payload::text) > 32768 then
    return jsonb_build_object('ok',false,'error','payload_too_large');
  end if;
  if v_type not in ('verification','practical','theory','telemetry','proofloop') then
    return jsonb_build_object('ok',false,'error','invalid_mission_type');
  end if;

  select * into v_admin
  from public.mdm_school_memberships
  where user_id=v_uid and role='school_admin' and status='active'
  order by created_at asc
  limit 1;
  if not found then
    return jsonb_build_object('ok',false,'error','school_admin_required');
  end if;

  select * into v_target
  from public.mdm_school_memberships
  where school_id=v_admin.school_id
    and user_id=p_student_user_id
    and role='student'
    and status='active'
  limit 1;
  if not found then
    return jsonb_build_object('ok',false,'error','active_student_not_in_school');
  end if;

  v_payload := v_payload
    || jsonb_build_object(
      'mission_type',v_type,
      'requiresInstructorCheck',true,
      'evidenceFlow','school_student_v1'
    );

  insert into public.mdm_school_missions(
    school_id,student_user_id,assigned_by,payload,status
  ) values (
    v_admin.school_id,p_student_user_id,v_uid,v_payload,'assigned'
  )
  returning id,created_at into v_id,v_created;

  return jsonb_build_object(
    'ok',true,
    'mission_id',v_id,
    'status','assigned',
    'mission_type',v_type,
    'assigned_at',v_created
  );
end;
$$;

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
  v_row public.mdm_school_missions%rowtype;
  v_evidence jsonb := coalesce(p_evidence,'{}'::jsonb);
  v_now timestamptz := now();
begin
  if v_uid is null then raise exception 'authentication_required' using errcode='42501'; end if;
  perform public.mdm_security_rate_guard('evidence_submit', 40, 300);

  if p_mission_id is null then
    return jsonb_build_object('ok',false,'error','mission_required');
  end if;
  if jsonb_typeof(v_evidence) <> 'object' then
    return jsonb_build_object('ok',false,'error','invalid_evidence');
  end if;
  if octet_length(v_evidence::text) > 65536 then
    return jsonb_build_object('ok',false,'error','evidence_too_large');
  end if;

  select * into v_row
  from public.mdm_school_missions
  where id=p_mission_id and student_user_id=v_uid
  for update;
  if not found then
    return jsonb_build_object('ok',false,'error','mission_not_found');
  end if;

  if not exists(
    select 1
    from public.mdm_school_memberships m
    where m.school_id=v_row.school_id
      and m.user_id=v_uid
      and m.role='student'
      and m.status='active'
  ) then
    return jsonb_build_object('ok',false,'error','active_student_membership_required');
  end if;

  if v_row.status in ('verified','cancelled') then
    return jsonb_build_object('ok',false,'error','mission_closed','status',v_row.status);
  end if;

  update public.mdm_school_missions
  set payload =
        jsonb_set(
          jsonb_set(coalesce(payload,'{}'::jsonb),'{student_evidence}',v_evidence,true),
          '{requiresInstructorCheck}','true'::jsonb,true
        ),
      status='awaiting_review',
      student_completed_at=v_now,
      review_note='',
      reviewed_by=null,
      reviewed_at=null,
      updated_at=v_now
  where id=v_row.id;

  return jsonb_build_object(
    'ok',true,
    'mission_id',v_row.id,
    'status','evidence_submitted',
    'raw_status','awaiting_review',
    'evidence_submitted_at',v_now
  );
end;
$$;

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
  v_admin public.mdm_school_memberships%rowtype;
  v_row public.mdm_school_missions%rowtype;
  v_decision text := lower(trim(coalesce(p_decision,'')));
  v_review jsonb := coalesce(p_review,'{}'::jsonb);
  v_note text := left(trim(coalesce(v_review->>'note','')),1000);
  v_raw_status text;
  v_public_status text;
  v_now timestamptz := now();
begin
  if v_uid is null then raise exception 'authentication_required' using errcode='42501'; end if;
  perform public.mdm_security_rate_guard('evidence_review', 30, 300);

  if v_decision not in ('accepted','revision_requested') then
    return jsonb_build_object('ok',false,'error','invalid_review_decision');
  end if;
  if jsonb_typeof(v_review) <> 'object' then
    return jsonb_build_object('ok',false,'error','invalid_review');
  end if;
  if octet_length(v_review::text) > 32768 then
    return jsonb_build_object('ok',false,'error','review_too_large');
  end if;

  select * into v_admin
  from public.mdm_school_memberships
  where user_id=v_uid and role='school_admin' and status='active'
  order by created_at asc
  limit 1;
  if not found then
    return jsonb_build_object('ok',false,'error','school_admin_required');
  end if;

  select * into v_row
  from public.mdm_school_missions
  where id=p_mission_id
    and school_id=v_admin.school_id
    and status<>'cancelled'
  for update;
  if not found then
    return jsonb_build_object('ok',false,'error','mission_not_found');
  end if;

  if v_row.status <> 'awaiting_review' then
    return jsonb_build_object('ok',false,'error','evidence_not_pending_review','status',v_row.status);
  end if;

  if v_decision='accepted' then
    v_raw_status := 'verified';
    v_public_status := 'accepted';
  else
    v_raw_status := 'revision_requested';
    v_public_status := 'revision_requested';
  end if;

  update public.mdm_school_missions
  set status=v_raw_status,
      payload=jsonb_set(coalesce(payload,'{}'::jsonb),'{school_review}',v_review,true),
      review_note=v_note,
      reviewed_by=v_uid,
      reviewed_at=v_now,
      updated_at=v_now
  where id=v_row.id;

  return jsonb_build_object(
    'ok',true,
    'mission_id',v_row.id,
    'status',v_public_status,
    'raw_status',v_raw_status,
    'reviewed_at',v_now
  );
end;
$$;

create or replace function public.mdm_school_evidence_list_missions(
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

  select * into v_admin
  from public.mdm_school_memberships
  where user_id=v_uid and role='school_admin' and status='active'
  order by created_at asc
  limit 1;
  if not found then
    return jsonb_build_object('ok',true,'authorized',false,'missions','[]'::jsonb);
  end if;

  if p_student_user_id is not null and not exists(
    select 1
    from public.mdm_school_memberships m
    where m.school_id=v_admin.school_id
      and m.user_id=p_student_user_id
      and m.role='student'
      and m.status='active'
  ) then
    return jsonb_build_object('ok',false,'error','active_student_not_in_school');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',x.id,
    'mission_id',x.id,
    'student_user_id',x.student_user_id,
    'mission_type',coalesce(x.payload->>'mission_type','verification'),
    'status',case
      when x.status='awaiting_review' then 'evidence_submitted'
      when x.status='verified' then 'accepted'
      when x.status='seen' then 'assigned'
      else x.status
    end,
    'raw_status',x.status,
    'payload',x.payload,
    'student_evidence',x.payload->'student_evidence',
    'school_review',x.payload->'school_review',
    'assigned_at',x.created_at,
    'created_at',x.created_at,
    'evidence_submitted_at',x.student_completed_at,
    'student_completed_at',x.student_completed_at,
    'review_note',x.review_note,
    'reviewed_by',x.reviewed_by,
    'reviewed_at',x.reviewed_at,
    'updated_at',x.updated_at
  ) order by x.created_at desc),'[]'::jsonb)
  into v_items
  from public.mdm_school_missions x
  where x.school_id=v_admin.school_id
    and x.status<>'cancelled'
    and (p_student_user_id is null or x.student_user_id=p_student_user_id);

  return jsonb_build_object(
    'ok',true,
    'authorized',true,
    'school_id',v_admin.school_id,
    'missions',v_items
  );
end;
$$;

create or replace function public.mdm_student_evidence_list_missions()
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
    'id',x.id,
    'mission_id',x.id,
    'school_id',x.school_id,
    'mission_type',coalesce(x.payload->>'mission_type','verification'),
    'status',case
      when x.status='awaiting_review' then 'evidence_submitted'
      when x.status='verified' then 'accepted'
      when x.status='seen' then 'assigned'
      else x.status
    end,
    'raw_status',x.status,
    'payload',x.payload,
    'student_evidence',x.payload->'student_evidence',
    'school_review',x.payload->'school_review',
    'assigned_at',x.created_at,
    'created_at',x.created_at,
    'evidence_submitted_at',x.student_completed_at,
    'student_completed_at',x.student_completed_at,
    'review_note',x.review_note,
    'reviewed_at',x.reviewed_at,
    'updated_at',x.updated_at
  ) order by x.created_at desc),'[]'::jsonb)
  into v_items
  from public.mdm_school_missions x
  where x.student_user_id=v_uid
    and x.status<>'cancelled'
    and exists(
      select 1
      from public.mdm_school_memberships m
      where m.school_id=x.school_id
        and m.user_id=v_uid
        and m.role='student'
        and m.status='active'
    );

  return jsonb_build_object('ok',true,'missions',v_items);
end;
$$;

revoke all on function public.mdm_school_assign_evidence_mission(uuid,jsonb,text) from public, anon;
revoke all on function public.mdm_student_submit_mission_evidence(uuid,jsonb) from public, anon;
revoke all on function public.mdm_school_review_mission_evidence(uuid,text,jsonb) from public, anon;
revoke all on function public.mdm_school_evidence_list_missions(uuid) from public, anon;
revoke all on function public.mdm_student_evidence_list_missions() from public, anon;

grant execute on function public.mdm_school_assign_evidence_mission(uuid,jsonb,text) to authenticated, service_role;
grant execute on function public.mdm_student_submit_mission_evidence(uuid,jsonb) to authenticated, service_role;
grant execute on function public.mdm_school_review_mission_evidence(uuid,text,jsonb) to authenticated, service_role;
grant execute on function public.mdm_school_evidence_list_missions(uuid) to authenticated, service_role;
grant execute on function public.mdm_student_evidence_list_missions() to authenticated, service_role;
