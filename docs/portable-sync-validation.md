# Malta Driving Master — P1 portable sync/reconcile: validazione

Commit iniziale verificato: `9bd23ac1e184f2aa96cf052a67036f10821b2af2`.

## Esito

**147 PASS / 0 FAIL**: 53 P1 (52 casi nella nuova suite e conversione del caso legacy che documentava il falso synced), 57 P0-02 e 37 Auth/logout. Nessun test saltato o cancellato. Tutte le verifiche funzionali dei due P0 sono conservate; il loro codice applicativo non è modificato.

Comando riproducibile:

```sh
node --test --test-reporter=tap tests/portable-sync.test.cjs tests/account-isolation.test.cjs tests/auth-session-lifecycle.test.cjs
```

La fixture condivisa esegue le funzioni estratte dal codice applicativo corrente e l'adapter reale P0-02. Usa storage, XHR e DOM controllati; il modello RPC riproduce la serializzazione per UID e il compare-and-swap verificati nelle due funzioni SQL reali. Nessun dato di produzione è stato scritto per i test. Questo esito è runtime controllato in Node, non una certificazione end-to-end su iPhone/Safari o su due dispositivi fisici.

## Causa radice e correzione

Il precedente ramo `checked` aggiornava `lastServerUpdatedAt` dopo il pull senza provare che il payload server fosse stato applicato. Quel timestamp diventava poi la versione attesa dell'upload di una copia locale ancora vecchia. Inoltre, il punteggio di studio era un indicatore incompleto della presenza dei dati; apply lasciava residui e le scritture dirette potevano sfuggire al flag dirty.

Il nuovo protocollo distingue versione osservata e base provata con impronta completa SHA-256. La base cambia solo dopo apply verificato, uguaglianza verificata o ack del contenuto effettivamente inviato. Restore elimina le chiavi assenti nel proprio perimetro e ricarica la memoria tramite il bridge P0 esistente; errori causano rollback e impediscono synced. Un marker persistente blocca upload dopo apply interrotto. Le modifiche durante upload restano dirty. I metadati restano nel namespace account già imposto dal P0-02.

Il contratto completo, scritto prima della patch, è in [portable-sync-contract.md](portable-sync-contract.md).

## Macchina degli stati

| Locale / server | Azione e risultato |
|---|---|
| Entrambi assenti | empty; nessun upload |
| Dati locali / server assente, nessuna base esistente | Creazione con versione attesa null; synced solo dopo ack verificato |
| Locale assente senza base / server presente | Restore completo; synced solo dopo apply e verifica |
| Clean / stessa versione | Verifica uguaglianza; synced |
| Clean / versione server diversa | Apply completo e verifica; poi synced |
| Dirty / versione server della base | Upload CAS; ack prova solo la copia inviata |
| Dirty / server cambiato | conflict; conservare entrambe le copie |
| Copie uguali / versione differente | Acquisire base verificata, anche dopo ack perso |
| Metadata legacy non provati / copie divergenti | conflict; nessuna promozione automatica del vecchio timestamp |
| Base esistente / server scomparso | conflict; nessuna ricreazione automatica |
| Restore esplicito | Conferma esistente, nuovo pull, apply verificato |
| Usa questo dispositivo | Conferma esistente, nuovo pull, CAS esplicito; base solo dopo ack |
| Chiavi assenti | Cancellazioni nello snapshot moderno; per legacy cancellare solo il perimetro allora coperto |
| Errore rete/storage | error ritentabile, base conservata; rollback se necessario |
| Altro dispositivo / rientro stesso account | Rileggere la base scoped; restore se clean, conflitto se divergentemente dirty |
| Cambio account con operazione pendente | Scartare la continuazione obsoleta con i guard P0-02 invariati |

## File inclusi

- `app-3994-458293-part-b1.js`: soltanto funzioni `mdmPortable*` e inventario portable. Sono preservati i messaggi di esito manuale; nessun nuovo timer, patch DOM o modifica del renderer.
- `index.html`: soltanto versione della risorsa core per invalidare la vecchia cache.
- `tests/helpers/account-runtime.cjs`: fixture comune estratta dai test esistenti e completata per il flusso P1.
- `tests/account-isolation.test.cjs`: import della fixture; i 57 corpi dei test P0 restano identici; il vecchio test P1 diventa una regressione negativa.
- `tests/portable-sync.test.cjs`: nuova matrice P1.
- `docs/portable-sync-contract.md`: contratto e inventario.
- `docs/portable-sync-validation.md`: questo report.

## Controlli finali

- `node --check`: PASS sui quattro file JavaScript/CJS modificati o nuovi.
- `git diff --check`: PASS.
- Confronto AST e sorgente con il commit iniziale: tutto il codice core fuori da funzioni/const portable è invariato; nessuna funzione rimossa.
- `index.html`: solo query di versione dello script core.
- Adapter P0-02 e file dei 37 test Auth: SHA-256 identici all'inizio.
- I 57 corpi dei test P0-02 sono identici al main iniziale.
- Tutte le 15 evidenze originarie dell'audit conservano il proprio SHA-256.
- Replay, banche domande, renderer, licensing, privacy e moduli freeze non modificati.
- `replay-scenes.js` resta una modifica locale estranea, intatta ed esclusa. SHA-256: `3edf4aac6767b534db6471d1fc98e710f2a6cdeb43527837c7a81fd8349ebfa5`.

## Limiti e compatibilità

Non viene inventata una base per dati legacy divergenti: l'utente deve scegliere fra le due azioni già disponibili. Gli snapshot legacy preservano le nuove estensioni locali come dirty, mentre la revisione 2 dichiara un perimetro completo. Un manifest futuro non riconosciuto viene rifiutato integralmente. I media binari IndexedDB restano fuori dal portable state. Nessuna modifica SQL, RLS, Auth o ownership School/Fleet.

Le suite hanno inizialmente rilevato errori d'integrazione della fixture, poi corretti, e un ramo di apply rifiutato che lasciava `checking`, corretto prima della validazione finale. Il diff ha inoltre rilevato la necessità di conservare i messaggi di esito manuale, coperti dall'ultimo test. Non sono state rilevate regressioni nella matrice finale.

## Matrice completa eseguita

### P1

| Verifica | Esito |
|---|---|
| P1 legacy metadata: an unproven clean timestamp cannot declare diverging content synced | PASS |
| P1-01 clean + server newer applies storage, memory and proven version before synced | PASS |
| P1-02 refused apply cannot promote the observed version or leave synced/checking | PASS |
| P1-03 dirty + server newer conflicts without loss or timestamp promotion | PASS |
| P1-04 dirty + server same uploads using the proven base and records the accepted snapshot | PASS |
| P1-05 server absent + local Fleet-only data creates state despite zero study score | PASS |
| P1-06 local absent restores a complete non-progress server snapshot | PASS |
| P1-07 keys absent from a modern server snapshot are deleted, including dynamic keys | PASS |
| P1-08 both local and server absent is empty and never creates a meaningless row | PASS |
| P1-09 empty local snapshot with an existing base is an uploadable deletion | PASS |
| P1-10 empty modern server snapshot clears a clean local copy | PASS |
| P1-11 second device, return to first, next upload all use actually applied versions | PASS |
| P1-12 independently dirty second device conflicts with the first accepted upload | PASS |
| P1-13 same account logout/login preserves its baseline and applies newer server state | PASS |
| P1-14 A B A: payload and metadata remain scoped to each identity | PASS |
| P1-15 an old A payload cannot be applied to B or reused after A B A | PASS |
| P1-16 observed but unapplied server version cannot authorize an automatic push | PASS |
| P1-17 temporary timeout preserves the proven base and retry succeeds | PASS |
| P1-18 upload accepted but ack lost recovers by content equality without another upload | PASS |
| P1-19 late A pull cannot mutate B data, metadata or sync status | PASS |
| P1-20 late A upload ack cannot establish a baseline for B | PASS |
| P1-21 edits during upload remain dirty against the exact acknowledged snapshot | PASS |
| P1-22 edits while a pull is pending turn a newer server response into a conflict | PASS |
| P1-23 edits while restore fingerprint is pending cannot be overwritten | PASS |
| P1-24 ownership change while restore fingerprint is pending aborts before any write | PASS |
| P1-25 failed metadata persistence cannot produce synced or an advanced base | PASS |
| P1-26 mid-apply storage error rolls back data and memory; a retry can restore | PASS |
| P1-27 silently refused deletion fails readback and rolls back instead of synced | PASS |
| P1-28 failed final baseline write rolls back the otherwise applied snapshot | PASS |
| P1-29 persisted incomplete apply blocks automatic upload; explicit restore recovers | PASS |
| P1-30 newly covered verification/outcome/passport/cosign/cache keys round trip completely | PASS |
| P1-31 logical mission/draft keys transfer across devices, foreign UID keys never export | PASS |
| P1-32 legacy restore deletes covered absences but preserves newer extensions and device settings | PASS |
| P1-33 legacy timestamp can acquire a proven baseline only when full content is equal | PASS |
| P1-34 a previously known server row disappearing produces conflict without resurrection | PASS |
| P1-35 same server version with inconsistent content cannot authorize upload | PASS |
| P1-36 null values, foreign namespaces and unsupported manifests reject the whole snapshot | PASS |
| P1-37 a misfiled foreign-student cache fails apply readback; P0 provenance is not bypassed | PASS |
| P1-38 direct localStorage writes without markDirty are detected by full fingerprint | PASS |
| P1-39 storage read errors cannot be interpreted as an absent local copy | PASS |
| P1-40 upload ack without a real server version cannot create a fabricated baseline | PASS |
| P1-41 server changes between pull and push: CAS conflict preserves local edits | PASS |
| P1-42 explicit device overwrite uses fresh CAS without promoting it before ack | PASS |
| P1-43 cancelling explicit restore/upload has no I/O and preserves both copies | PASS |
| P1-44 concurrent reconciliation shares the in-flight gate instead of racing two pulls | PASS |
| P1-45 server HTTP error preserves edits/base and a later pull/upload retries cleanly | PASS |
| P1-46 pending restore in A B A remains stale even when the original UID returns | PASS |
| P1-47 unavailable content hashing fails closed before any restore mutation | PASS |
| P1-48 pageshow and foreground resume reconcile without a new timer or reload | PASS |
| P1-49 boot subscription resumes the same account after login and drops stale queued resumes | PASS |
| P1-50 a page reload reconstructs the persisted baseline and restores newer server content | PASS |
| P1-51 malformed server snapshot fails before any local content or base change | PASS |
| P1-52 manual sync keeps conflict/restore feedback; silent sync and cancellation stay silent | PASS |

### P0-02 isolamento account

| Verifica | Esito |
|---|---|
| ISO-01 A logout B: School/Fleet isolated; B can write its own namespace | PASS |
| ISO-01 A B without reload: School/Fleet isolated; B can write its own namespace | PASS |
| A B A: each account retains its own data and old operations remain invalid | PASS |
| New login to same account restores owned data but invalidates previous operation | PASS |
| Memory: progress/profile and server caches are synchronously rehydrated without reload | PASS |
| Memory: saving old School/Fleet objects and fresh containers with old nested data is rejected | PASS |
| Late School response after B does not publish A roster or overwrite B in-flight state | PASS |
| Switch during the first Auth await prevents an A operation sending a request as B | PASS |
| ISO-03 late evidence/mission fetch does not cache A missions under B | PASS |
| ISO-02 portable B payload excludes every account namespace previously written by A | PASS |
| Fleet: late server preview cannot publish A corporate records in B memory/cache | PASS |
| School Operations: late permissions/snapshot response cannot be saved for B | PASS |
| Portable: late A pull cannot restore data or mark the B namespace synchronized | PASS |
| Portable: response resolved just before B login cannot retry an A upload with B credentials | PASS |
| Portable: an explicitly retained old payload cannot be applied by B | PASS |
| Evidence: switch while reading the response body also discards A missions | PASS |
| Evidence: a valid current-account response remains usable and is hidden after switching | PASS |
| Legacy: legitimate profile-owned personal history remains recoverable for its owner only | PASS |
| Legacy identified root owner: mdm_school_operations_45824 | PASS |
| Legacy identified root owner: mdm_fleet_corporate_45825 | PASS |
| Legacy: a nested learner/contact email cannot claim an unowned School/Fleet namespace | PASS |
| Legacy: explicit foreign UID wins over matching root email | PASS |
| Legacy: existing UID-scoped evidence and School/Fleet data remain accessible only to that UID | PASS |
| Invite: pre-login context and per-invite marker survive logout and account changes | PASS |
| Device-owned data stays device-owned: mdm-v1-settings | PASS |
| Device-owned data stays device-owned: mdm_pilot_device_token_v4583146 | PASS |
| Device-owned data stays device-owned: mdm_backend_setup_v4400 | PASS |
| Device-owned data stays device-owned: mdm_auth_attempt_guard_v458319 | PASS |
| sessionStorage mission launch is account-owned, not an invite/device context | PASS |
| Explicit foreign user/owner namespaces, nested mission suffixes and enrollment keys are blocked | PASS |
| Unknown MDM data is private by default; guests are not promoted into a later account | PASS |
| Expired credentials alone do not drop ownership; a same-generation refresh keeps current data operations valid | PASS |
| Bound callback and cloned object preserve A provenance through A B A | PASS |
| Late FileReader import does not overwrite B memory or prepare A data for sync | PASS |
| IndexedDB media opens an account namespace and discards an old database-open completion | PASS |
| Previously misfiled ISO-03 cache is preserved but cannot be read under B without provenance | PASS |
| Cache with an explicitly foreign student is rejected even if filed/stamped as B | PASS |
| An object first saved by A cannot later be relabelled/saved by B | PASS |
| A successful current-account School response still updates its roster | PASS |
| Temporary data transport failure retains account data and a following request succeeds | PASS |
| Legitimate backup with matching profile provenance is recovered after B to A without reload | PASS |
| Storage identity and private Auth token mismatch cannot send a data request | PASS |
| Old XHR receipt also hides A response after resolution but before inspection | PASS |
| Old server portable payload cannot be reapplied after a later account switch | PASS |
| School invitation queue: a late response cannot refill B account memory | PASS |
| School activation alert: the old request cannot use its rows after account change | PASS |
| Telemetry: a late student mission response cannot save A sessions in B storage | PASS |
| Assignment confirmation: A cannot start another retry request with B credentials | PASS |
| IndexedDB media result for A is usable and keeps provenance | PASS |
| IndexedDB media result late after B is discarded | PASS |
| A backup explicitly identifying a foreign owner cannot overwrite B progress | PASS |
| RPC timer cleanup: stale success releases its timer without cancelling B request | PASS |
| RPC timer cleanup: stale network rejection releases its timer without cancelling B request | PASS |
| RPC timer cleanup: stale timeout releases its timer without cancelling B request | PASS |
| Normalized memory retains provenance: schoolCompare | PASS |
| Normalized memory retains provenance: aiInstructor.recoveryPlan | PASS |
| Legacy School Portal uses the existing startup array normalization on account re-entry | PASS |

### Auth/logout

| Verifica | Esito |
|---|---|
| AUTH-01: logout is immediate and a refresh completing after server logout cannot restore credentials | PASS |
| AUTH-01: late refresh is discarded even before logout server response arrives | PASS |
| AUTH-02: refresh 0/timeout retains credentials and a subsequent retry succeeds | PASS |
| AUTH-02: refresh 0/error retains credentials and a subsequent retry succeeds | PASS |
| AUTH-02: refresh 0/abort retains credentials and a subsequent retry succeeds | PASS |
| AUTH-02: refresh 408/load retains credentials and a subsequent retry succeeds | PASS |
| AUTH-02: refresh 409/load retains credentials and a subsequent retry succeeds | PASS |
| AUTH-02: refresh 429/load retains credentials and a subsequent retry succeeds | PASS |
| AUTH-02: refresh 503/load retains credentials and a subsequent retry succeeds | PASS |
| AUTH-03: simultaneous refresh callers share one promise and one rotating-token request | PASS |
| AUTH-03: a failed shared refresh can be retried once by concurrent callers | PASS |
| valid token: verify keeps the authenticated state, preserves expiry and does not refresh | PASS |
| verify 200 arriving after logout cannot restore or change the new session | PASS |
| verify 401 arriving after logout cannot restore or change the new session | PASS |
| verify 0 arriving after logout cannot restore or change the new session | PASS |
| verify timeout retains valid credentials and can recover without signing in again | PASS |
| verify 401 followed by a transient refresh failure must not reinterpret the first 401 as final invalidation | PASS |
| verify joins an existing refresh and a logout cancels the second user verification | PASS |
| restore with only a refresh token works and remains fenced by logout | PASS |
| real credential rejection refresh_token_not_found clears the session, while a later explicit login still works | PASS |
| real credential rejection refresh_token_already_used clears the session, while a later explicit login still works | PASS |
| real credential rejection session_not_found clears the session, while a later explicit login still works | PASS |
| real credential rejection session_expired clears the session, while a later explicit login still works | PASS |
| real credential rejection invalid_grant clears the session, while a later explicit login still works | PASS |
| 401 without a refresh token invalidates credentials; unknown 400/403 failures preserve retry capability | PASS |
| malformed success responses cannot create or overwrite an authenticated identity | PASS |
| old refresh finalizer cannot release the refresh belonging to a new explicit login | PASS |
| mdmAuthSignIn: late success after logout is ignored and a subsequent login works while logout is pending | PASS |
| mdmAuthSignUp: late success after logout is ignored and a subsequent login works while logout is pending | PASS |
| explicit legacy login succeeds before an old server logout completes and its finalizer retains ownership | PASS |
| visible signin: a stale response cannot persist or reload; a new explicit attempt succeeds | PASS |
| visible signup: a stale response cannot persist or reload; a new explicit attempt succeeds | PASS |
| visible login recovers after a rejected network request and works during an old logout | PASS |
| recovery: password response after logout cannot restore the session; a new explicit attempt can | PASS |
| magic link: delayed user lookup cannot restore a session after logout; a newly opened link can | PASS |
| existing deferred post-auth callbacks do not start school/sync work after logout | PASS |
| a persisted logout fences old callbacks even before another page receives a storage event | PASS |
