# MDM P0-02 — Validazione finale

Commit iniziale verificato: `59f736a6066faf0fb5bf4e52c191fc37df1557b2` (HEAD e origin/main di partenza).

La patch locale preesistente è stata continuata, non riapplicata. Le riproduzioni ISO-01, ISO-02 e ISO-03 dell'audit sono conservate. Il contratto completo e l'inventario dei namespace sono in [account-isolation-contract.md](account-isolation-contract.md).

## Esito

**95 PASS / 0 FAIL / 0 skipped**: 57 test P0-02, 37 test Auth/logout preesistenti, 1 controllo del perimetro P1. Il test P1 passa perché conferma la presenza del difetto storico: non certifica la correttezza della sincronizzazione.

Comando eseguito:

```sh
node --test --test-reporter=tap tests/account-isolation.test.cjs tests/auth-session-lifecycle.test.cjs
```

Test eseguiti con funzioni di produzione caricate in Node VM, trasporti controllabili e fixture di Storage, IndexedDB, callback e timer. Questa verifica copre le sequenze asincrone e la provenienza dei dati; non è un collaudo end-to-end su iPhone/Safari reale né una prova contro Supabase di produzione. Nessuna scrittura al backend è stata eseguita durante questi test.

Gli ultimi tre casi residui sono stati riprodotti con FAIL prima della correzione e poi PASS: provenienza dei contenitori creati dai normalizzatori e normalizzazione School Portal al cambio account. La matrice seguente riporta solo l'esecuzione finale sulla patch da consegnare.

## Matrice completa

| N. | Test eseguito | Esito |
|---:|---|---|
| 1 | ISO-01 A logout B: School/Fleet isolated; B can write its own namespace | PASS |
| 2 | ISO-01 A B without reload: School/Fleet isolated; B can write its own namespace | PASS |
| 3 | A B A: each account retains its own data and old operations remain invalid | PASS |
| 4 | New login to same account restores owned data but invalidates previous operation | PASS |
| 5 | Memory: progress/profile and server caches are synchronously rehydrated without reload | PASS |
| 6 | Memory: saving old School/Fleet objects and fresh containers with old nested data is rejected | PASS |
| 7 | Late School response after B does not publish A roster or overwrite B in-flight state | PASS |
| 8 | Switch during the first Auth await prevents an A operation sending a request as B | PASS |
| 9 | ISO-03 late evidence/mission fetch does not cache A missions under B | PASS |
| 10 | ISO-02 portable B payload excludes every account namespace previously written by A | PASS |
| 11 | Fleet: late server preview cannot publish A corporate records in B memory/cache | PASS |
| 12 | School Operations: late permissions/snapshot response cannot be saved for B | PASS |
| 13 | Portable: late A pull cannot restore data or mark the B namespace synchronized | PASS |
| 14 | Portable: response resolved just before B login cannot retry an A upload with B credentials | PASS |
| 15 | Portable: an explicitly retained old payload cannot be applied by B | PASS |
| 16 | Evidence: switch while reading the response body also discards A missions | PASS |
| 17 | Evidence: a valid current-account response remains usable and is hidden after switching | PASS |
| 18 | Legacy: legitimate profile-owned personal history remains recoverable for its owner only | PASS |
| 19 | Legacy identified root owner: mdm_school_operations_45824 | PASS |
| 20 | Legacy identified root owner: mdm_fleet_corporate_45825 | PASS |
| 21 | Legacy: a nested learner/contact email cannot claim an unowned School/Fleet namespace | PASS |
| 22 | Legacy: explicit foreign UID wins over matching root email | PASS |
| 23 | Legacy: existing UID-scoped evidence and School/Fleet data remain accessible only to that UID | PASS |
| 24 | Invite: pre-login context and per-invite marker survive logout and account changes | PASS |
| 25 | Device-owned data stays device-owned: mdm-v1-settings | PASS |
| 26 | Device-owned data stays device-owned: mdm_pilot_device_token_v4583146 | PASS |
| 27 | Device-owned data stays device-owned: mdm_backend_setup_v4400 | PASS |
| 28 | Device-owned data stays device-owned: mdm_auth_attempt_guard_v458319 | PASS |
| 29 | sessionStorage mission launch is account-owned, not an invite/device context | PASS |
| 30 | Explicit foreign user/owner namespaces, nested mission suffixes and enrollment keys are blocked | PASS |
| 31 | Unknown MDM data is private by default; guests are not promoted into a later account | PASS |
| 32 | Expired credentials alone do not drop ownership; a same-generation refresh keeps current data operations valid | PASS |
| 33 | Bound callback and cloned object preserve A provenance through A B A | PASS |
| 34 | Late FileReader import does not overwrite B memory or prepare A data for sync | PASS |
| 35 | IndexedDB media opens an account namespace and discards an old database-open completion | PASS |
| 36 | Previously misfiled ISO-03 cache is preserved but cannot be read under B without provenance | PASS |
| 37 | Cache with an explicitly foreign student is rejected even if filed/stamped as B | PASS |
| 38 | An object first saved by A cannot later be relabelled/saved by B | PASS |
| 39 | A successful current-account School response still updates its roster | PASS |
| 40 | Temporary data transport failure retains account data and a following request succeeds | PASS |
| 41 | Legitimate backup with matching profile provenance is recovered after B to A without reload | PASS |
| 42 | Storage identity and private Auth token mismatch cannot send a data request | PASS |
| 43 | Old XHR receipt also hides A response after resolution but before inspection | PASS |
| 44 | Old server portable payload cannot be reapplied after a later account switch | PASS |
| 45 | P1 remains open: clean nonempty local data still follows the existing checked/synced branch | PASS |
| 46 | School invitation queue: a late response cannot refill B account memory | PASS |
| 47 | School activation alert: the old request cannot use its rows after account change | PASS |
| 48 | Telemetry: a late student mission response cannot save A sessions in B storage | PASS |
| 49 | Assignment confirmation: A cannot start another retry request with B credentials | PASS |
| 50 | IndexedDB media result for A is usable and keeps provenance | PASS |
| 51 | IndexedDB media result late after B is discarded | PASS |
| 52 | A backup explicitly identifying a foreign owner cannot overwrite B progress | PASS |
| 53 | RPC timer cleanup: stale success releases its timer without cancelling B request | PASS |
| 54 | RPC timer cleanup: stale network rejection releases its timer without cancelling B request | PASS |
| 55 | RPC timer cleanup: stale timeout releases its timer without cancelling B request | PASS |
| 56 | Normalized memory retains provenance: schoolCompare | PASS |
| 57 | Normalized memory retains provenance: aiInstructor.recoveryPlan | PASS |
| 58 | Legacy School Portal uses the existing startup array normalization on account re-entry | PASS |
| 59 | AUTH-01: logout is immediate and a refresh completing after server logout cannot restore credentials | PASS |
| 60 | AUTH-01: late refresh is discarded even before logout server response arrives | PASS |
| 61 | AUTH-02: refresh 0/timeout retains credentials and a subsequent retry succeeds | PASS |
| 62 | AUTH-02: refresh 0/error retains credentials and a subsequent retry succeeds | PASS |
| 63 | AUTH-02: refresh 0/abort retains credentials and a subsequent retry succeeds | PASS |
| 64 | AUTH-02: refresh 408/load retains credentials and a subsequent retry succeeds | PASS |
| 65 | AUTH-02: refresh 409/load retains credentials and a subsequent retry succeeds | PASS |
| 66 | AUTH-02: refresh 429/load retains credentials and a subsequent retry succeeds | PASS |
| 67 | AUTH-02: refresh 503/load retains credentials and a subsequent retry succeeds | PASS |
| 68 | AUTH-03: simultaneous refresh callers share one promise and one rotating-token request | PASS |
| 69 | AUTH-03: a failed shared refresh can be retried once by concurrent callers | PASS |
| 70 | valid token: verify keeps the authenticated state, preserves expiry and does not refresh | PASS |
| 71 | verify 200 arriving after logout cannot restore or change the new session | PASS |
| 72 | verify 401 arriving after logout cannot restore or change the new session | PASS |
| 73 | verify 0 arriving after logout cannot restore or change the new session | PASS |
| 74 | verify timeout retains valid credentials and can recover without signing in again | PASS |
| 75 | verify 401 followed by a transient refresh failure must not reinterpret the first 401 as final invalidation | PASS |
| 76 | verify joins an existing refresh and a logout cancels the second user verification | PASS |
| 77 | restore with only a refresh token works and remains fenced by logout | PASS |
| 78 | real credential rejection refresh_token_not_found clears the session, while a later explicit login still works | PASS |
| 79 | real credential rejection refresh_token_already_used clears the session, while a later explicit login still works | PASS |
| 80 | real credential rejection session_not_found clears the session, while a later explicit login still works | PASS |
| 81 | real credential rejection session_expired clears the session, while a later explicit login still works | PASS |
| 82 | real credential rejection invalid_grant clears the session, while a later explicit login still works | PASS |
| 83 | 401 without a refresh token invalidates credentials; unknown 400/403 failures preserve retry capability | PASS |
| 84 | malformed success responses cannot create or overwrite an authenticated identity | PASS |
| 85 | old refresh finalizer cannot release the refresh belonging to a new explicit login | PASS |
| 86 | mdmAuthSignIn: late success after logout is ignored and a subsequent login works while logout is pending | PASS |
| 87 | mdmAuthSignUp: late success after logout is ignored and a subsequent login works while logout is pending | PASS |
| 88 | explicit legacy login succeeds before an old server logout completes and its finalizer retains ownership | PASS |
| 89 | visible signin: a stale response cannot persist or reload; a new explicit attempt succeeds | PASS |
| 90 | visible signup: a stale response cannot persist or reload; a new explicit attempt succeeds | PASS |
| 91 | visible login recovers after a rejected network request and works during an old logout | PASS |
| 92 | recovery: password response after logout cannot restore the session; a new explicit attempt can | PASS |
| 93 | magic link: delayed user lookup cannot restore a session after logout; a newly opened link can | PASS |
| 94 | existing deferred post-auth callbacks do not start school/sync work after logout | PASS |
| 95 | a persisted logout fences old callbacks even before another page receives a storage event | PASS |

## Controlli finali del perimetro

- `node --check`: PASS su tutti i 10 file JavaScript applicativi modificati e sul nuovo file di test.
- `git diff --check`: PASS.
- Le funzioni `mdmAuth*` sono identiche al main iniziale; il test Auth esistente non è stato modificato.
- Confronto AST: le decisioni di `mdmPortableSyncReconcile`, ForceRestore e ForceUpload sono invariate, rimossi dal confronto i soli guard di ownership.
- Confronto AST: il flusso di invito e la risoluzione dei dati di licenza restano equivalenti, rimossi i soli guard di ownership. Nessuna modifica alle regole di licensing o privacy.
- Template invariati nei moduli modificati; `index.html` differisce solo nelle versioni degli script. Nessun renderer, Replay congelato o banca domande modificato.
- Le 15 evidenze originali dell'audit mantengono il rispettivo SHA-256.
- `replay-scenes.js`: modifica locale estranea preservata, SHA-256 `3edf4aac6767b534db6471d1fc98e710f2a6cdeb43527837c7a81fd8349ebfa5`; esclusa dal commit P0-02.

## File del solo P0-02

- `app-3994-458293-part-b1.js`
- `index.html`
- `mdm-account-isolation-safe-45831532.js`
- `mdm-assignment-delivery-integrity-458382531.js`
- `mdm-inline-458294-1.js`
- `mdm-pilot-school-dashboard-4583147.js`
- `mdm-proofloop-verification-4583817.js`
- `mdm-pwa-refresh-458344.js`
- `mdm-school-telemetry-4583819.js`
- `mdm-school-telemetry-engine-45838193.js`
- `mdm-student-school-evidence-45838239.js`
- `tests/account-isolation.test.cjs`
- `docs/account-isolation-contract.md`
- `docs/account-isolation-validation.md`

## Stato lasciato aperto

**P1 portable sync/reconcile resta aperto.** Questa patch impedisce la contaminazione del payload tra identità e scarta operazioni obsolete; non corregge il ramo che può dichiarare `synced` dati locali non aggiornati dal server. Nessun intervento successivo al P0-02 è incluso.

I dati legacy identificabili restano recuperabili dal proprietario; quelli di provenienza ambigua restano conservati e non sono assegnati automaticamente. Per le cache già esposte all'ISO-03, il suffisso UID storico non basta: servono righe server attribuibili o il nuovo marcatore del writer protetto.
