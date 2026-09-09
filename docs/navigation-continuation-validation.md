# Continua: navigazione domande/Replay — 2026-09-09

## Riferimento e perimetro

Main iniziale verificato con fetch: `c227a24169fe5b57a6f31ad56e84885cdaf490ab`.
Intervento limitato alla destinazione visibile dopo l'avanzamento Replay.
Nessuna modifica a contenuti Replay, banche domande, Auth/logout, isolamento
account, portable sync, lingue, licensing, privacy o altri renderer.

La modifica locale estranea di `replay-scenes.js` deve rimanere esclusa.
SHA-256 preservato:
`3edf4aac6767b534db6471d1fc98e710f2a6cdeb43527837c7a81fd8349ebfa5`.

## Evidenza e causa

Nel filmato fornito (26,5 secondi), dopo Continua viene mostrata la griglia
delle domande; tornando verso la scena si vede però la fase successiva
(02/04 e successivamente 04/04). Il sintomo filmato è quindi compatibile con
un riposizionamento errato, non con il mancato incremento della fase.

Percorso effettivo:

1. Il dock mobile, il pulsante di fase e il pulsante dopo la decisione sicura
   chiamano tutti `replayAdvanceTo(target, questionId)`.
2. Il metodo incrementa `errorReplayStep`, mantenendo `route` e `questionId`.
3. Prima del fix chiamava `renderReplayStable`: leggeva la posizione della
   vecchia scena, rigenerava lo schermo e ripristinava quell'offset in un
   `requestAnimationFrame` con `scrollBy`.
4. La posizione precedente non identifica la destinazione del nuovo step.
   Quando cambia l'altezza del contenuto, mantenere una posizione interna
   alla vecchia fase può collocare la vista sulla griglia che segue la scena.
   Il renderer installato, inoltre, non inoltra `preserveScroll`; il callback
   differito compensava anche lo scroll a zero effettuato dal render.

Il test controllato esegue le funzioni di produzione e il wrapper realmente
installato: offset iniziale -1100 px, nuova scena alta 650 px e griglia
successiva. Prima del fix la fase avanza ma resta fuori vista. Dopo il fix
la destinazione viene posizionata a 10 px dal bordo superiore, nel ciclo
di render stesso, senza callback di scroll pendente.
Questi valori sono dati di test, non misure del dispositivo del filmato.

Il confronto con `9bd23ac1e184f2aa96cf052a67036f10821b2af2` e con
`4c98677adbd0f30d71431cbf251fea8736c0bca9` mostra invariati gli handler
di avanzamento e il render stabile. Non è dimostrato che il P1 abbia
introdotto il difetto filmato; la comparsa recente non basta ad attribuirlo
a quel commit.

## Correzione minima

Solo `replayAdvanceTo` cambia: imposta `errorReplayAutoFocusScene=true` e
chiama `render({preserveScroll:true})`. Riutilizza il posizionamento sincrono
già esistente in `bindErrorReplay` per l'ingresso nella scena. Non modifica
`renderReplayStable`, il renderer generale, il routing, la progressione,
la validazione della risposta, i contenuti o le lingue.

`index.html` aggiorna soltanto la query del file JavaScript, per distinguere
il nuovo asset in cache. Nessun service worker o altro modulo viene modificato.

## Matrice della navigazione

| Test | Caso | Esito |
| --- | --- | --- |
| NAV-01 | Continua mobile: fase successiva visibile, domanda/route conservate | PASS |
| NAV-02.1 | Continua fase 02 → 03 | PASS |
| NAV-02.2 | Continua fase 03 → 04 | PASS |
| NAV-03 | Ultima fase: completamento una volta, nessun Continua ulteriore | PASS |
| NAV-04 | Doppio tap su pulsante precedente: nessun salto di fase | PASS |
| NAV-05 | Target non validi/non sequenziali: nessun avanzamento | PASS |
| NAV-06.0 | Posizionamento con fallback sulla scheda Replay | PASS |
| NAV-06.1 | Posizionamento con ancora film | PASS |
| NAV-07 | Home dopo Continua: nessun callback di scroll pendente | PASS |
| NAV-08 | Ritorno a una fase precedente | PASS |
| NAV-09 | Apertura volontaria di altra domanda dalla lista Replay | PASS |
| NAV-10 | Decisione errata: resta in fase, niente Continua prematuro | PASS |
| NAV-11 | Decisione corretta: Continua mobile alla fase successiva | PASS |
| NAV-12 | Errore poi risposta corretta: Continua interno al pannello | PASS |
| NAV-13 | Domanda normale: handler Next avanza nello stesso quiz | PASS |
| NAV-14.1 | Risposta corretta e domanda successiva | PASS |
| NAV-14.0 | Risposta errata e domanda successiva | PASS |
| NAV-15 | Ultima domanda del blocco: risultati e contesto di ritorno | PASS |
| NAV-16 | Uscita volontaria dal quiz alla lista | PASS |
| NAV-17.it | Domanda Replay: inglese e traduzione italiana sotto | PASS |
| NAV-17.en | Domanda Replay: solo inglese | PASS |
| NAV-17.mt | Domanda Replay: solo maltese | PASS |
| NAV-18 | Render stabile non di avanzamento: comportamento conservato | PASS |
| NAV-19 | Back Replay: history/popstate | PASS |
| NAV-20 | Back domanda guidata: ritorno alla lista di provenienza | PASS |
| NAV-21 | Back categoria Replay: posizione della lista conservata | PASS |
| NAV-22 | Ricomincia: fase iniziale della stessa domanda | PASS |

Prima della modifica applicativa: 23 test iniziali, 15 PASS e 8 FAIL
(le asserzioni sul nuovo posizionamento fallivano). Dopo la correzione:
23/23 PASS; aggiunti i quattro casi Back/categoria/Restart: 27/27 PASS.

## Regressioni precedenti e controlli finali

| Suite | PASS | FAIL |
| --- | ---: | ---: |
| Navigazione nuova | 27 | 0 |
| Auth/logout | 37 | 0 |
| Account isolation (57 precedenti + 1 test negativo P1 già presente) | 58 | 0 |
| Portable sync/reconcile | 52 | 0 |
| Totale | 174 | 0 |

Comando eseguito:

```sh
node --test tests/auth-session-lifecycle.test.cjs tests/account-isolation.test.cjs tests/portable-sync.test.cjs tests/navigation-continuation.test.cjs
```

`node --check`: PASS sul core e sui due nuovi file di test.
`git diff --check`: PASS.
I test precedenti e il relativo helper non sono stati modificati.
Il confronto completo del core consente soltanto la sostituzione del corpo
di `replayAdvanceTo`; il resto del file rimane identico al main iniziale.

## Limiti e condizione separata non modificata

I test di navigazione eseguono codice di produzione in Node/VM con DOM,
geometria e servizi ausiliari controllati. Non sono test end-to-end su
iPhone/Safari, né attestano un deployment già aggiornato sul dispositivo.
Il video è stato esaminato; il browser cloud non ha potuto aprire il server
locale (`ERR_BLOCKED_BY_CLIENT`). Nessun aggiramento del blocco è stato tentato.
Il collaudo sul dispositivo reale resta necessario.

Una diagnosi precedente alla ricezione del video ha anche riprodotto un
caso distinto: applicare un restore server durante un quiz attivo può
azzerare il quiz tramite `mdmAccountRehydrateData`, e `renderQuiz` torna a
`lptv`. Questa condizione non identifica quanto filmato (dove le fasi
Replay avanzano); rimane aperta e non corretta qui, perché coinvolge i
flussi restore/isolation esclusi dall'autorizzazione di questo intervento.
Le sue evidenze sono conservate separatamente. Nessun altro fix è incluso.
