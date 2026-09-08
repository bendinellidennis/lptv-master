# P0-02 — Account ownership and provenance

Baseline: `59f736a6066faf0fb5bf4e52c191fc37df1557b2`. Existing evidence: ISO-01 (School/Fleet leakage), ISO-02 (portable keys outside isolation), ISO-03 (late mission response cached under the next user). This is the implementation contract, written before application changes. Auth/logout is already fixed and is not part of this patch.

## Inventory

| Ownership | Namespaces / data | Policy |
|---|---|---|
| Account | `mdm-v1-progress`, `mdm-v1-session`, `mdm-v1-user-profile`, legacy `mdm-v1-profile`, `mdm-v1-error-replay`, `mdm-replay-coach-v1` | Learning, quiz session, identity and personal Replay results; scope storage without editing Replay code/content. |
| Account | `mdm-v1-mission-system`, `mdm-v1-ai-instructor`, `mdm-v1-zero-error`, `mdm-v1-exam-day`, `mdm-v1-coach-recovery`, `mdm-v1-coach`, `mdm-v1-personal-roadmap`, `mdm-v1-lptv-passport`, `mdm-language-twin-v1` | Personal learning and preparation state. |
| Account | `mdm-v1-real-road-twin`, `mdm-v1-real-road-telemetry`, `mdm-v1-real-road-selected-pattern`, `mdm-v1-real-road-telemetry-mission-launch` | Includes the launch context in sessionStorage and live recording state. |
| Account | `mdm-v1-onboarding`, `mdm-v1-privacy-preferences`, `mdm-v1-pilot-analytics`, `mdm_security_stability_trust_458290` | Account choices/evidence. Only ownership changes; consent, privacy and trust business rules do not change. |
| Account | `mdm-v1-account-enrollment`, `mdm-v1-account-enrollment-user:<uid>`, `mdm-v1-school-dashboard`, `mdm-v1-school-preferences`, `mdm-v1-school-compare`, `mdm-v1-school-partner-draft`, `mdm-v1-school-portal-2`, `mdm_school_home_brand_v1` | Membership state, preferences, invitations created by a school, contacts and branding. |
| Account | `mdm-v1-instructor-portal`, `mdm_school_command_center_4110`, `mdm_instructor_assignments_4320`, `mdm_instructor_studio_4120`, `mdm_school_operations_45824`, `mdm_fleet_corporate_45825` | Rosters, snapshots, lesson assignments/media references, operations and corporate context. |
| Account | `mdm-v1-country-pack-engine`, `mdm-v1-license-pack-engine` | Learning pack choices; licensing/entitlement rules are not changed. |
| Account | `mdm-v1-cloud-ready`, `mdm-production-sync-v45828`, `mdm-production-permission-v458284`, `mdm-school-operations-production-v458285`, `mdm_portable_sync_v4583135` | Mixed legacy cloud-ready object contains queue/user data, so the whole object is account-owned (including its historical device label). Server snapshots, outbox, conflicts, permission caches and sync metadata cannot cross accounts. |
| Account | `mdm-school-evidence-cache-v1`, `mdm-school-evidence-draft::<mission>`, `mdm-proofloop-verification-v1`, `mdm-unified-mission-baseline-v1`, `mdm-proofloop-cosign-v2`, `mdm-proofloop-exam-outcome-v1`, `mdm-driver-competence-passport-v1`, `mdm_pilot_quality_metrics_v1::<uid>` | Evidence, drafts, verification baselines and derived caches, including existing UID suffixes and mission suffixes. |
| Account / recovery only | `mdm_owner_legacy_quarantine_v1::`, `mdm_account_contamination_backup_v1::`, `mdm_dennis_pre_restore_v1::`, `mdm_dennis_pre_rehydrate_v1::`, migration/recovery markers | Historical data is preserved. A global backup is not an ordinary account-readable namespace. Recovery requires matching provenance. |
| Account | IndexedDB `mdm_instructor_studio_media_v1` | Instructor media database scoped to the captured account; an unowned legacy database is preserved, not silently assigned to the current user. |
| Account / memory | Core persisted objects, quiz/flash/bridge state, roster, student missions, selected school learner, evidence/production snapshots, assignment and telemetry operations | Reload account objects and clear transient server caches synchronously on identity/generation transitions; never reuse A objects for B. |
| Device | `mdm-v1-settings` (`lang`, `theme` only), `mdm-v1-investor-preview`, `mdm-v1-premium-splash`, `mdm_backend_setup_v4400`, `mdm_auth_attempt_guard_v458319`, `mdm_pilot_device_token_v4583146`, `mdm-home-performance-focus-v1`, `mdm_post_login_reload_v1` | Preserve real device configuration and UI preferences; no account migration. Static application/service-worker caches contain application assets, not authenticated RPC responses. |
| Pre-login / invite | `mdm_pilot_pending_invite_v1`, invitation URL/context, `__MDM_RECOVERY_HASH__`, `__MDM_PASSWORD_RECOVERY_IN_PROGRESS__`, per-invite session markers | Keep the invitation context separate. The existing server redeem/auth rules determine the recipient. Never use this context as ownership proof for learning/School/Fleet data. |
| Auth infrastructure | `mdm_auth_session_v4410` and the existing generation/version | Read identity/generation only. Do not alter the completed Auth/logout lifecycle. |

Any other MDM data key is private by default; the device/context allow-list is explicit. Both localStorage and account-owned sessionStorage keys use the same ownership policy. Explicit foreign UID suffixes are rejected rather than re-scoped to the current user.

## Contract

1. The owner is the authenticated session UID, not a role, selected learner, email inside a roster, or the user present when a request finishes. Existing `::user:<uid>` and historical technical-Owner namespaces remain compatible.
2. Capture `{userId, generation, epoch}` at operation entry, before the first await. A normal token refresh retains ownership. Logout, direct A-to-B login, re-login and A-to-B-to-A invalidate earlier operations. An expired token does not itself transfer data ownership.
3. Check the captured context in the resumed caller after every relevant await and before storage/cache/outbox writes. A late response is discarded. A stale finally block cannot release another account's in-flight operation.
4. Tag objects loaded from account storage with provenance; saving an old object, or a new container holding its nested objects, is rejected. Rehydrate core lexical state in its own runtime scope without a DOM patch, reload, timer, or renderer change.
5. School/Fleet and all portable account keys are scoped before snapshot preparation. Bind portable request/apply boundaries to their starting account. Keep P1 reconcile decisions, conflict rules and the known incorrect `synced` decision unchanged.
6. Previously UID-scoped user-created data stays available to that UID. Exception: ISO-03 already permitted evidence cache rows to be misfiled under a different UID. Old evidence caches are usable only when every server row identifies the current student, or when newly stamped by a guarded response with the matching owner; ambiguous cache bytes are retained but hidden until the existing server refresh succeeds. The original personal-data legacy migration is retained only for a matching profile owner. Newly isolated global namespaces require their own root owner UID/email evidence; a nested student/contact email is never proof. Ambiguous data stays preserved and hidden rather than being assigned to the next login. Never overwrite healthy owned data from a legacy source.
7. No guest-to-account promotion. Explicit login to the same account reads its stored namespace again; unrelated device settings and a pre-login invitation remain available.

## Minimal implementation boundary

Extend the existing storage adapter with ownership/context/provenance and a synchronous subscription. Add a core data-state bridge and ownership guards around data operations, plus guards in independent School/evidence/assignment/telemetry transports. Scope instructor media storage. Add executable regression tests using production source with controlled asynchronous responses. No schema, RLS, Supabase function, question bank, Replay asset, renderer, licensing or privacy rule changes.

This is isolation between first-party application account lifecycles. It does not replace Supabase authorization/RLS or claim to protect localStorage from arbitrary same-origin malicious JavaScript.
