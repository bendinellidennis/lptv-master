# P1 portable sync/reconcile - contratto prima dell'implementazione

Base verificata: `9bd23ac1e184f2aa96cf052a67036f10821b2af2`. Fonte: SYNC-01 e difetti correlati già acquisiti. Nessuna nuova analisi dei moduli P0. Il metadato `mdm_portable_sync_v4583135` è già account-owned grazie al P0-02: il relativo adapter resta invariato.

## Causa e invarianti

Il vecchio ramo `checked` promuove una versione soltanto letta a `lastServerUpdatedAt`, senza apply né verifica di uguaglianza. Lo stesso valore viene poi usato come compare-and-swap per un upload. `dirty` non rileva tutte le scritture dirette, lo study score non copre tutti i dati, e apply è una sovrapposizione di chiavi invece di uno snapshot completo.

- Separare `observedVersion` dalla base effettiva `baseVersion` + impronta SHA-256 del contenuto (`baseFingerprint`). `lastServerUpdatedAt` resta alias compatibile della sola base verificata.
- La base è provata soltanto da apply verificato, uguaglianza verificata con lo snapshot server o upload accettato dal server. Un vecchio timestamp non è una prova.
- L'impronta considera tutte le chiavi portable e tutti i relativi valori, ordinando i nomi delle chiavi. Rileva anche scritture dirette che non chiamano `save`, rimozioni e snapshot vuoti. Lo study score rimane solo una misura visuale esistente.
- `synced` richiede base provata, snapshot locale uguale alla base, nessun apply incompleto. La versione soltanto osservata non può autorizzare un upload automatico.
- Catturare e verificare il contesto del P0-02 a ogni confine asincrono; conservare le relative protezioni, senza cambiarle.

## Macchina degli stati minima

| Stato locale / server | Transizione consentita | Risultato |
|---|---|---|
| Local absent / server absent | Registrare assenza verificata; nessun upload | empty |
| Local data senza base / server absent | Creazione con expected version null | synced solo dopo ack e verifica del contenuto corrente |
| Local absent senza base / server data | Apply completo e verifica locale | synced, oppure dirty se restano estensioni non coperte da un vecchio snapshot |
| Local clean / server same | Verificare identità del contenuto | synced |
| Local clean / server newer | Applicare realmente snapshot e cancellazioni, ricaricare la memoria | synced solo dopo successo |
| Local dirty / server same | Upload con la versione della base effettiva | synced se non intervengono nuovi cambiamenti; altrimenti dirty |
| Local dirty / server newer | Conservare entrambe le copie e non inviare | conflict |
| Copie uguali / versione differente | Uguaglianza verificata consente di acquisire la base | synced; recupera anche ack persi |
| Local nonempty con metadata legacy/non provati / server differente | Nessuna promozione del timestamp e nessuna sovrascrittura automatica | conflict; usare le scelte esplicite già esistenti |
| Base nota / server scomparso | Non ricreare automaticamente una copia potenzialmente cancellata | conflict |
| Restore esplicito | Consenso già esistente, nuovo pull, apply verificato | base del server applicato |
| Upload esplicito “Usa questo dispositivo” | Scelta esplicita di sostituzione, nuovo pull, CAS sulla versione osservata | nessuna promozione a base prima dell'ack; cambiamenti concorrenti sul server causano conflict |
| Errore rete / risposta invalida | Conservare base e dirty; rendere l'errore visibile allo stato sync | error, ritentabile |
| Secondo dispositivo / ritorno al primo | Ogni dispositivo conserva la propria base locale; il server serializza per UID | restore se clean; conflict se dirty e server cambiato |
| Stesso account dopo logout/login | Rileggere metadata scoped, verificare snapshot e riprendere reconcile | stessa base di contenuto; nuova generazione invalida le vecchie operazioni |
| Cambio account durante operazione | Scartare la continuazione obsoleta | nessuna modifica al nuovo account |

## Snapshot e cancellazioni

Il wire schema resta `mdm-portable-state-v1`, compatibile con le RPC esistenti. La revisione snapshot 2 dichiara il proprio insieme di chiavi e prefissi. Una chiave assente è una cancellazione entro quel perimetro; un valore non stringa, un perimetro sconosciuto o una chiave non consentita invalidano il payload intero, prima delle scritture.

- Conservare tutte le precedenti chiavi account-owned già portable.
- Escludere `mdm-v1-settings` (device-owned) e il contesto sessionStorage `mdm-v1-real-road-telemetry-mission-launch`: non sono dati account da trasferire. I vecchi payload che li contengono non li applicano.
- Aggiungere i dati recenti: `mdm-proofloop-verification-v1`, `mdm-proofloop-exam-outcome-v1`, `mdm-driver-competence-passport-v1`, `mdm-proofloop-cosign-v2`, `mdm-school-evidence-cache-v1`; prefissi `mdm-unified-mission-baseline-v1::` e `mdm-school-evidence-draft::`.
- I nomi portable dei prefissi sono logici, senza UID. La traduzione usa esclusivamente il contesto corrente e l'adapter del P0-02; nessun namespace estraneo viene enumerato nel payload.
- Per snapshot legacy, le assenze cancellano solo le vecchie chiavi note. Le nuove chiavi non coperte vengono conservate come modifiche locali da caricare, senza fingere `synced`.
- Cache missioni importate restano soggette ai controlli di provenienza ISO-03 del P0-02. Non introdurre fallback che aggirino tali controlli.
- Restano esclusi token, backend config, inviti pre-login, gate/permission cache, outbox Production Sync, impostazioni device, media binari IndexedDB e moduli congelati. Nessuna nuova funzionalità di trasferimento media.

## Apply, concorrenza locale e errori

Prima delle scritture: validare schema e ownership, calcolare impronte, verificare che il contenuto locale non sia cambiato durante gli await. Persistenza iniziale di un marker `applyPending` che invalida l'autorizzazione a upload/synced fino al commit dell'apply. Scrivere/rimuovere le chiavi, rileggere e confrontare il risultato, ripristinare lo stato core usando il bridge già esistente del P0-02, poi registrare la base. Nessun nuovo timer, patch DOM o modifica al renderer.

Su errore: rollback dei valori originali e del relativo stato in memoria; non dichiarare synced. Un apply interrotto con marker persistente resta non sincronizzato al rientro; uguaglianza verificata o restore esplicito permettono il recupero. Un errore di scrittura metadata non può essere ignorato.

L'upload conserva lo snapshot effettivamente inviato. Se il locale cambia mentre la richiesta è in corso, l'ack prova la base inviata ma il locale resta dirty. I controlli CAS delle RPC esistenti restano autoritativi anche per due dispositivi concorrenti. Nessuna modifica SQL, Auth, RLS, ownership School/Fleet o adapter account.

## Verifica prevista

Nuova suite P1 per tutti gli stati sopra, errori storage/rete, cancellazioni, metadata legacy, prefissi recenti e riprese asincrone. Rieseguire i 57 test P0-02 e i 37 Auth/logout. Il precedente test che documentava la permanenza di P1 diventa una regressione negativa del falso synced; le 94 verifiche funzionali P0 restano richieste.
