(() => {
'use strict';
const ALL_Q = Array.isArray(window.LPTV_QUESTIONS) ? window.LPTV_QUESTIONS : [];
const CORE_Q = ALL_Q.filter(q=>q.bank==='lptv_core');
const ROAD_SAFETY_Q = ALL_Q.filter(q=>q.bank==='road_safety');
const Q = ALL_Q.filter(q=>q.bank==='lptv_core'||q.bank==='road_safety');
const EXCLUDED_Q = ALL_Q.filter(q=>q.bank&&q.bank.startsWith('excluded_'));
const TAG_BANK_VERSION = 'tag-extended-v2';
const C = window.MDM_CONTENT || {licences:[],roadCode:[],regulations:[],meta:{}};
const $ = s => document.querySelector(s);
const screen = $('#screen');
const modal = $('#modal');
const backBtn = $('#backBtn');
const STORAGE = 'mdm-v1-progress';
const SETTINGS = 'mdm-v1-settings';
const SESSION = 'mdm-v1-session';

const ui = {
 en:{home:'Home',search:'Search',assistant:'Assistant',profile:'Profile',welcome:'Everything you need to learn and drive in Malta.',continue:'Continue your preparation',lptv:'LPTV',lptvSub:'Exam, study and mistakes',licences:'Driving Licences',licencesSub:'Categories used in Malta',roadCode:'Road Code',roadCodeSub:'Rules explained clearly',regulations:'Regulations',regulationsSub:'Official sources and updates',ai:'AI Assistant',aiSub:'Ask and understand simply',profileTitle:'Your profile',startExam:'Official-style exam',examDetail:'35 questions • 45 minutes • pass 30/35',study:'Study by topic',errors:'Redo mistakes',progress:'Progress',back:'Back',translate:'Translate',listen:'Listen',explain:'Explain it',confirm:'Confirm',next:'Next',exit:'Exit',question:'Question',selectOne:'Select 1 answer',selectMany:n=>`Select ${n} answers`,correct:'Correct answer',wrong:'Wrong answer',yourAnswer:'Your answer',rightAnswer:'Correct answer',passed:'PASSED',failed:'NOT PASSED',completed:'Session completed',officialSource:'Official source',openSource:'Open official source',language:'Language',theme:'Appearance',light:'Light',dark:'Dark',system:'System',clear:'Delete progress',database:'Database',questions:'questions',searchPlaceholder:'Search questions, rules or regulations…',noResults:'No results found.',assistantIntro:'Ask about a rule, a quiz question or a driving topic. I first search the verified content stored in the app.',assistantPlaceholder:'Example: How does a box junction work?',send:'Send',assistantLocal:'Local knowledge mode',assistantDisclaimer:'Answers are based on content stored in the app. Always check the linked official source for legal decisions.',officialEnglish:'Official English',italian:'Italian',maltese:'Maltese',maltesePending:'The Maltese translation of this item is being prepared. The official English text remains available.',categories:'Categories',lastVerified:'Sources checked',resetConfirm:'Delete all saved progress?',noErrors:'You have no saved mistakes yet.',resume:'Resume session',newExam:'Start new exam',allTopics:'All topics',chooseTopic:'Choose a topic',start:'Start',seen:'Seen',accuracy:'Accuracy',exams:'Exams',best:'Best result',last:'Last result',official:'Extended preparation bank',studyMode:'Study mode',examMode:'Exam mode',noHelpExam:'Translations and explanations are available after the exam.',resultReview:'Review mistakes',close:'Close',guidedStudy:'Guided study',guidedStudyDetail:'250 relevant questions • Italian translation • audio • immediate correction',assistedSimulation:'Practice test with help',assistedDetail:'35 questions • translation and audio • optional timer',realExamPieta:'Real Pietà exam',realExamDetail:'35 questions • 45 minutes • English only • correction at the end',chooseTimer:'Choose the timer',noTimer:'No timer',timer45:'45 minutes',timer30:'30 minutes',startSimulation:'Start practice test',guidedMode:'Guided study',assistedMode:'Practice with help',realExamMode:'Real Pietà exam',hideTranslation:'Hide translation',translationQuestion:'Question in Italian',translationAnswers:'Answers in Italian',whyCorrect:'Why this answer is correct',wrongChoiceReason:'The selected option does not match the rule required by the question.',fourChapters:"Complete study path",fourChaptersSub:"250 relevant questions organised into the 4 preparation chapters",weakAttack:"Weak-points attack",weakAttackSub:"Adaptive practice based on your mistakes and lowest accuracy",topicSafety:"Health, Safety and Legal Responsibilities",topicSafetyDesc:"Accidents, first aid, documents, penalties, operators, vehicles and safe loading",topicCustomer:"Customer Care and Vulnerable Passengers",topicCustomerDesc:"Passenger assistance, disability, comfort, communication and professional conduct",topicRoad:"Road Procedure and Responsibilities",topicRoadDesc:"Road rules, signs, junctions, crossings, hazards and defensive driving",topicEco:"Eco-safe Driving",topicEcoDesc:"Fuel use, emissions, environment and efficient driving",chapterProgress:"Chapter progress",startChapter:"Study this chapter",allChapterQuestions:"All chapter questions",adaptiveTraining:"Adaptive training",adaptiveTrainingDesc:"The app prioritises repeated mistakes, low accuracy and unseen questions.",availableWeak:"Questions selected for you",startWeak:"Start weak-points training",readiness:"Exam readiness",coverage:"Coverage",recentAverage:"Recent exam average",recommended:"Recommended next step",readinessStart:"Getting started",readinessGrowing:"Improving",readinessAlmost:"Almost ready",readinessReady:"Ready for the real test",recommendStudy:"Complete more guided-study questions.",recommendWeak:"Train your weakest areas.",recommendExam:"Try another realistic exam.",examHistory:"Exam history",noExamHistory:"No realistic exam completed yet.",passedSmall:"Passed",failedSmall:"Not passed",chapterQuestions:"Questions in this chapter",chapterAccuracy:"Chapter accuracy",diagnostic:"Personal diagnostic",dailyPlan:"Today's plan",dailyPlanSub:"15 personalised questions to keep your preparation moving",dailyDone:"Today's progress",dailyComplete:"Daily goal completed",startDaily:"Start today's training",repeatDaily:"Repeat today's training",streak:"Study streak",days:"days",englishCoach:"English Coach",englishCoachSub:"Key LPTV words with Italian meaning, examples and audio",vocabularySearch:"Search an English or Italian word…",knownWords:"Words learned",markKnown:"Mark as learned",known:"Learned",savedQuestions:"Saved questions",savedQuestionsSub:"Keep difficult or important questions for quick review",saveQuestion:"Save question",removeSaved:"Remove from saved",noSavedQuestions:"You have not saved any questions yet.",backup:"Progress backup",backupSub:"Save or restore your results, favourites and study history",exportBackup:"Export backup",importBackup:"Import backup",backupCreated:"Backup created.",backupRestored:"Backup restored.",backupInvalid:"This backup file is not valid.",today:"Today",words:"words",example:"Example",dailyGoal:"Daily goal",examCentre:"Exam Centre",examCentreSub:"35 questions from the extended LPTV preparation bank",examInstructions:"Exam instructions",examRuleQuestions:"35 questions",examRuleTime:"45 minutes",examRulePass:"Pass mark: 30/35",examRuleEnglish:"English only during the test",examRuleNavigation:"You may move between questions and flag them for review.",startRealExam:"Start real exam",answered:"Answered",unanswered:"Unanswered",flagged:"Flagged",flagQuestion:"Flag",unflagQuestion:"Remove flag",navigator:"Question navigator",previous:"Previous",finishExam:"Finish exam",pauseExam:"Pause exam",pauseExamConfirm:"Pause the exam and return to the menu? Your answers and timer will be saved.",confirmFinish:"Submit the exam now?",examSummary:"Exam summary",timeUsed:"Time used",topicResults:"Results by chapter",resumeExam:"Resume exam",autoSubmitted:"Time expired. The exam was submitted automatically.",answerRecorded:"Answer saved",examQuestionHelp:"Select your answer. You can change it until you submit the exam.",examPassTarget:"You need at least 30 correct answers.",newRealExam:"New real exam",allAnswered:"All questions answered",unansweredWarning:n=>`You still have ${n} unanswered question${n===1?'':'s'}. Submit anyway?`,bankScope:"Question bank",bankAll:"All relevant questions",bankCore:"LPTV core",bankRoad:"Road-safety extension",bankAuditTitle:"Extended and separated bank",bankAuditText:"250 relevant preparation questions: 68 LPTV core questions plus 182 road-safety questions.",bankExcludedText:"Excluded: 31 operator/SOV/business-management questions and 2 Category B administrative questions.",bankDisclaimer:"Transport Malta does not publish the total official LPTV question-bank size. This is a preparation bank, not a claim of the complete official list."},
 it:{home:'Home',search:'Cerca',assistant:'Assistente',profile:'Profilo',welcome:'Tutto ciò che serve per studiare e guidare a Malta.',continue:'Continua la tua preparazione',lptv:'LPTV',lptvSub:'Esame, studio ed errori',licences:'Patenti',licencesSub:'Categorie utilizzate a Malta',roadCode:'Road Code',roadCodeSub:'Regole spiegate chiaramente',regulations:'Normative',regulationsSub:'Fonti ufficiali e aggiornamenti',ai:'Assistente AI',aiSub:'Chiedi e capisci facilmente',profileTitle:'Il tuo profilo',startExam:'Esame realistico',examDetail:'35 domande • 45 minuti • promosso 30/35',study:'Studio per argomento',errors:'Rifai gli errori',progress:'Progressi',back:'Indietro',translate:'Traduci',listen:'Ascolta',explain:'Spiegamelo',confirm:'Conferma',next:'Avanti',exit:'Esci',question:'Domanda',selectOne:'Seleziona 1 risposta',selectMany:n=>`Seleziona ${n} risposte`,correct:'Risposta corretta',wrong:'Risposta errata',yourAnswer:'La tua risposta',rightAnswer:'Risposta corretta',passed:'PROMOSSO',failed:'NON SUPERATO',completed:'Sessione completata',officialSource:'Fonte ufficiale',openSource:'Apri fonte ufficiale',language:'Lingua',theme:'Aspetto',light:'Chiaro',dark:'Scuro',system:'Sistema',clear:'Cancella progressi',database:'Database',questions:'domande',searchPlaceholder:'Cerca domande, regole o normative…',noResults:'Nessun risultato trovato.',assistantIntro:'Chiedi una regola, una domanda del quiz o un argomento di guida. Cerco prima nei contenuti verificati salvati nell’app.',assistantPlaceholder:'Esempio: Come funziona una box junction?',send:'Invia',assistantLocal:'Modalità conoscenza locale',assistantDisclaimer:'Le risposte usano i contenuti salvati nell’app. Per decisioni legali controlla sempre la fonte ufficiale collegata.',officialEnglish:'Inglese ufficiale',italian:'Italiano',maltese:'Maltese',maltesePending:'La traduzione maltese di questo contenuto è in preparazione. Rimane disponibile il testo ufficiale inglese.',categories:'Categorie',lastVerified:'Fonti controllate',resetConfirm:'Cancellare tutti i progressi salvati?',noErrors:'Non hai ancora errori salvati.',resume:'Riprendi sessione',newExam:'Nuovo esame',allTopics:'Tutti gli argomenti',chooseTopic:'Scegli un argomento',start:'Inizia',seen:'Viste',accuracy:'Precisione',exams:'Esami',best:'Migliore',last:'Ultimo risultato',official:'Banca di preparazione estesa',studyMode:'Modalità studio',examMode:'Modalità esame',noHelpExam:'Traduzioni e spiegazioni saranno disponibili alla fine dell’esame.',resultReview:'Rivedi errori',close:'Chiudi',guidedStudy:'Studio guidato',guidedStudyDetail:'250 domande pertinenti • traduzione completa • audio • correzione immediata',assistedSimulation:'Simulazione con aiuti',assistedDetail:'35 domande • traduzione e audio • timer facoltativo',realExamPieta:'Esame reale Pietà',realExamDetail:'35 domande • 45 minuti • solo inglese • correzione alla fine',chooseTimer:'Scegli il timer',noTimer:'Senza timer',timer45:'45 minuti',timer30:'30 minuti',startSimulation:'Inizia simulazione',guidedMode:'Studio guidato',assistedMode:'Simulazione con aiuti',realExamMode:'Esame reale Pietà',hideTranslation:'Nascondi traduzione',translationQuestion:'Domanda in italiano',translationAnswers:'Risposte in italiano',whyCorrect:'Perché questa risposta è corretta',wrongChoiceReason:'La risposta selezionata non corrisponde alla regola richiesta dalla domanda.',fourChapters:"Percorso completo",fourChaptersSub:"250 domande pertinenti organizzate nei 4 capitoli di preparazione",weakAttack:"Attacco punti deboli",weakAttackSub:"Allenamento adattivo basato sugli errori e sulla precisione più bassa",topicSafety:"Salute, sicurezza e responsabilità legali",topicSafetyDesc:"Incidenti, primo soccorso, documenti, sanzioni, operatori, veicoli e carico sicuro",topicCustomer:"Assistenza clienti e passeggeri vulnerabili",topicCustomerDesc:"Assistenza, disabilità, comfort, comunicazione e comportamento professionale",topicRoad:"Procedure stradali e responsabilità",topicRoadDesc:"Regole, segnali, incroci, attraversamenti, pericoli e guida difensiva",topicEco:"Guida ecologica e sicura",topicEcoDesc:"Consumi, emissioni, ambiente e guida efficiente",chapterProgress:"Progresso del capitolo",startChapter:"Studia questo capitolo",allChapterQuestions:"Tutte le domande del capitolo",adaptiveTraining:"Allenamento adattivo",adaptiveTrainingDesc:"L’app dà priorità agli errori ripetuti, alla precisione più bassa e alle domande mai viste.",availableWeak:"Domande selezionate per te",startWeak:"Inizia l’allenamento sui punti deboli",readiness:"Preparazione all’esame",coverage:"Copertura",recentAverage:"Media degli ultimi esami",recommended:"Prossimo passo consigliato",readinessStart:"Preparazione iniziale",readinessGrowing:"In miglioramento",readinessAlmost:"Quasi pronto",readinessReady:"Pronto per il test reale",recommendStudy:"Completa altre domande nello Studio guidato.",recommendWeak:"Allenati sugli argomenti più deboli.",recommendExam:"Prova un altro Esame reale Pietà.",examHistory:"Storico degli esami",noExamHistory:"Non hai ancora completato un esame realistico.",passedSmall:"Promosso",failedSmall:"Non superato",chapterQuestions:"Domande del capitolo",chapterAccuracy:"Precisione del capitolo",diagnostic:"Diagnosi personale",dailyPlan:"Piano di oggi",dailyPlanSub:"15 domande personalizzate per proseguire la preparazione",dailyDone:"Progresso di oggi",dailyComplete:"Obiettivo giornaliero completato",startDaily:"Inizia l’allenamento di oggi",repeatDaily:"Ripeti l’allenamento di oggi",streak:"Giorni consecutivi",days:"giorni",englishCoach:"English Coach",englishCoachSub:"Parole LPTV importanti con significato italiano, esempi e audio",vocabularySearch:"Cerca una parola inglese o italiana…",knownWords:"Parole imparate",markKnown:"Segna come imparata",known:"Imparata",savedQuestions:"Domande salvate",savedQuestionsSub:"Conserva le domande difficili o importanti per ripassarle",saveQuestion:"Salva domanda",removeSaved:"Rimuovi dai salvati",noSavedQuestions:"Non hai ancora salvato nessuna domanda.",backup:"Copia dei progressi",backupSub:"Salva o ripristina risultati, domande salvate e storico",exportBackup:"Esporta copia",importBackup:"Importa copia",backupCreated:"Copia creata.",backupRestored:"Copia ripristinata.",backupInvalid:"Questo file di copia non è valido.",today:"Oggi",words:"parole",example:"Esempio",dailyGoal:"Obiettivo giornaliero",examCentre:"Centro Esame",examCentreSub:"35 domande dalla banca estesa di preparazione LPTV",examInstructions:"Istruzioni dell’esame",examRuleQuestions:"35 domande",examRuleTime:"45 minuti",examRulePass:"Promosso con 30/35",examRuleEnglish:"Durante il test soltanto inglese",examRuleNavigation:"Puoi spostarti tra le domande e segnalarle per rivederle.",startRealExam:"Inizia esame reale",answered:"Risposte date",unanswered:"Senza risposta",flagged:"Segnalate",flagQuestion:"Segnala",unflagQuestion:"Togli segnalazione",navigator:"Navigatore domande",previous:"Indietro",finishExam:"Concludi esame",pauseExam:"Metti in pausa",pauseExamConfirm:"Mettere in pausa l’esame e tornare al menu? Risposte e timer verranno salvati.",confirmFinish:"Consegnare adesso l’esame?",examSummary:"Riepilogo esame",timeUsed:"Tempo impiegato",topicResults:"Risultati per capitolo",resumeExam:"Riprendi esame",autoSubmitted:"Tempo scaduto. L’esame è stato consegnato automaticamente.",answerRecorded:"Risposta salvata",examQuestionHelp:"Seleziona la risposta. Puoi modificarla fino alla consegna.",examPassTarget:"Servono almeno 30 risposte corrette.",newRealExam:"Nuovo esame reale",allAnswered:"Tutte le domande hanno una risposta",unansweredWarning:n=>`Hai ancora ${n} domand${n===1?'a':'e'} senza risposta. Vuoi consegnare comunque?`,bankScope:"Banca delle domande",bankAll:"Tutte le domande pertinenti",bankCore:"Nucleo LPTV",bankRoad:"Estensione sicurezza stradale",bankAuditTitle:"Banca ampliata e separata",bankAuditText:"250 domande utili alla preparazione: 68 del nucleo LPTV e 182 di sicurezza stradale pertinente.",bankExcludedText:"Escluse: 31 domande per operatori, SOV o gestione aziendale e 2 domande amministrative della patente B.",bankDisclaimer:"Transport Malta non pubblica il numero totale della banca LPTV. Questa è una banca di preparazione, non l’elenco ufficiale completo."},
 mt:{home:'Dar',search:'Fittex',assistant:'Assistent',profile:'Profil',welcome:'Dak kollu li għandek bżonn biex titgħallem u ssuq f’Malta.',continue:'Kompli l-preparazzjoni tiegħek',lptv:'LPTV',lptvSub:'Eżami, studju u żbalji',licences:'Liċenzji tas-sewqan',licencesSub:'Kategoriji użati f’Malta',roadCode:'Kodiċi tat-Triq',roadCodeSub:'Regoli spjegati b’mod ċar',regulations:'Regolamenti',regulationsSub:'Sorsi uffiċjali u aġġornamenti',ai:'Assistent Intelliġenti',aiSub:'Staqsi u ifhem faċilment',profileTitle:'Il-profil tiegħek',startExam:'Eżami realistiku',examDetail:'35 mistoqsija • 45 minuta • tgħaddi 30/35',study:'Studja skont is-suġġett',errors:'Erġa’ agħmel l-iżbalji',progress:'Progress',back:'Lura',translate:'Ittraduċi',listen:'Isma’',explain:'Spjegali',confirm:'Ikkonferma',next:'Li jmiss',exit:'Oħroġ',question:'Mistoqsija',selectOne:'Agħżel tweġiba waħda',selectMany:n=>`Agħżel ${n} tweġibiet`,correct:'Tweġiba korretta',wrong:'Tweġiba ħażina',yourAnswer:'It-tweġiba tiegħek',rightAnswer:'It-tweġiba korretta',passed:'GĦADDEJT',failed:'MA GĦADDEJTX',completed:'Sessjoni lesta',officialSource:'Sors uffiċjali',openSource:'Iftaħ is-sors uffiċjali',language:'Lingwa',theme:'Dehra',light:'Ċar',dark:'Skur',system:'Sistema',clear:'Ħassar il-progress',database:'Database',questions:'mistoqsijiet',searchPlaceholder:'Fittex mistoqsijiet, regoli jew regolamenti…',noResults:'Ma nstab l-ebda riżultat.',assistantIntro:'Staqsi dwar regola, mistoqsija jew suġġett tas-sewqan. L-ewwel infittex fil-kontenut verifikat tal-app.',assistantPlaceholder:'Eżempju: Kif taħdem box junction?',send:'Ibgħat',assistantLocal:'Modalità ta’ għarfien lokali',assistantDisclaimer:'It-tweġibiet huma bbażati fuq il-kontenut tal-app. Għal deċiżjonijiet legali dejjem iċċekkja s-sors uffiċjali.',officialEnglish:'Ingliż uffiċjali',italian:'Taljan',maltese:'Malti',maltesePending:'It-traduzzjoni Maltija ta’ dan il-kontenut qed titħejja. It-test uffiċjali bl-Ingliż jibqa’ disponibbli.',categories:'Kategoriji',lastVerified:'Sorsi ċċekkjati',resetConfirm:'Tħassar il-progress kollu?',noErrors:'Għad m’għandekx żbalji salvati.',resume:'Kompli s-sessjoni',newExam:'Eżami ġdid',allTopics:'Is-suġġetti kollha',chooseTopic:'Agħżel suġġett',start:'Ibda',seen:'Rajthom',accuracy:'Preċiżjoni',exams:'Eżamijiet',best:'L-aħjar',last:'L-aħħar riżultat',official:'Bank ta’ preparazzjoni estiż',studyMode:'Modalità ta’ studju',examMode:'Modalità ta’ eżami',noHelpExam:'Traduzzjonijiet u spjegazzjonijiet ikunu disponibbli wara l-eżami.',resultReview:'Ara l-iżbalji',close:'Agħlaq',guidedStudy:'Studju gwidat',guidedStudyDetail:'250 mistoqsija pertinenti • traduzzjoni • awdjo • korrezzjoni immedjata',assistedSimulation:'Simulazzjoni bl-għajnuna',assistedDetail:'35 mistoqsija • traduzzjoni u awdjo • timer fakultattiv',realExamPieta:'Eżami reali ta’ Pietà',realExamDetail:'35 mistoqsija • 45 minuta • Ingliż biss • korrezzjoni fl-aħħar',chooseTimer:'Agħżel it-timer',noTimer:'Mingħajr timer',timer45:'45 minuta',timer30:'30 minuta',startSimulation:'Ibda s-simulazzjoni',guidedMode:'Studju gwidat',assistedMode:'Simulazzjoni bl-għajnuna',realExamMode:'Eżami reali ta’ Pietà',hideTranslation:'Aħbi t-traduzzjoni',translationQuestion:'Mistoqsija bit-Taljan',translationAnswers:'Tweġibiet bit-Taljan',whyCorrect:'Għaliex din it-tweġiba hija korretta',wrongChoiceReason:'L-għażla magħżula ma taqbilx mar-regola mitluba mill-mistoqsija.',fourChapters:"Kors sħiħ",fourChaptersSub:"250 mistoqsija pertinenti fl-4 kapitoli ta’ preparazzjoni",weakAttack:"Taħriġ fuq id-dgħufijiet",weakAttackSub:"Taħriġ adattiv ibbażat fuq l-iżbalji u l-inqas preċiżjoni",topicSafety:"Saħħa, sigurtà u responsabbiltajiet legali",topicSafetyDesc:"Inċidenti, first aid, dokumenti, pieni, operaturi, vetturi u tagħbija sigura",topicCustomer:"Customer care u passiġġieri vulnerabbli",topicCustomerDesc:"Assistenza, diżabilità, kumdità, komunikazzjoni u mġiba professjonali",topicRoad:"Proċeduri u responsabbiltajiet fit-triq",topicRoadDesc:"Regoli, sinjali, junctions, crossings, perikli u defensive driving",topicEco:"Sewqan ekoloġiku u sigur",topicEcoDesc:"Fjuwil, emissjonijiet, ambjent u sewqan effiċjenti",chapterProgress:"Progress tal-kapitlu",startChapter:"Studja dan il-kapitlu",allChapterQuestions:"Il-mistoqsijiet kollha tal-kapitlu",adaptiveTraining:"Taħriġ adattiv",adaptiveTrainingDesc:"L-app tagħti prijorità lill-iżbalji, preċiżjoni baxxa u mistoqsijiet mhux magħmula.",availableWeak:"Mistoqsijiet magħżula għalik",startWeak:"Ibda t-taħriġ fuq id-dgħufijiet",readiness:"Tħejjija għall-eżami",coverage:"Kopertura",recentAverage:"Medja tal-aħħar eżamijiet",recommended:"Il-pass li jmiss",readinessStart:"Bidu",readinessGrowing:"Qed titjieb",readinessAlmost:"Kważi lest",readinessReady:"Lest għat-test reali",recommendStudy:"Agħmel aktar mistoqsijiet ta’ studju.",recommendWeak:"Aħdem fuq l-aktar suġġetti dgħajfa.",recommendExam:"Ipprova eżami realistiku ieħor.",examHistory:"Storja tal-eżamijiet",noExamHistory:"Għad ma lestejt l-ebda eżami realistiku.",passedSmall:"Għaddejt",failedSmall:"Ma għaddejtx",chapterQuestions:"Mistoqsijiet tal-kapitlu",chapterAccuracy:"Preċiżjoni tal-kapitlu",diagnostic:"Dijanjosi personali",dailyPlan:"Pjan tal-lum",dailyPlanSub:"15-il mistoqsija personalizzata biex tkompli l-preparazzjoni",dailyDone:"Progress tal-lum",dailyComplete:"L-għan tal-ġurnata tlesta",startDaily:"Ibda t-taħriġ tal-lum",repeatDaily:"Erġa’ agħmel it-taħriġ tal-lum",streak:"Jiem konsekuttivi",days:"jiem",englishCoach:"English Coach",englishCoachSub:"Kliem importanti tal-LPTV bit-Taljan, eżempji u awdjo",vocabularySearch:"Fittex kelma bl-Ingliż jew bit-Taljan…",knownWords:"Kliem mitgħallem",markKnown:"Immarka bħala mitgħallma",known:"Mitgħallma",savedQuestions:"Mistoqsijiet salvati",savedQuestionsSub:"Żomm mistoqsijiet diffiċli jew importanti għar-reviżjoni",saveQuestion:"Issejvja l-mistoqsija",removeSaved:"Neħħi mis-salvati",noSavedQuestions:"Għad ma ssejvjajt l-ebda mistoqsija.",backup:"Backup tal-progress",backupSub:"Issejvja jew irrestawra r-riżultati u l-istorja",exportBackup:"Esporta backup",importBackup:"Importa backup",backupCreated:"Backup inħoloq.",backupRestored:"Backup ġie rrestawrat.",backupInvalid:"Dan il-file tal-backup mhuwiex validu.",today:"Illum",words:"kliem",example:"Eżempju",dailyGoal:"Għan tal-ġurnata",examCentre:"Ċentru tal-Eżami",examCentreSub:"35 mistoqsija mill-bank estiż ta’ preparazzjoni LPTV",examInstructions:"Istruzzjonijiet tal-eżami",examRuleQuestions:"35 mistoqsija",examRuleTime:"45 minuta",examRulePass:"Tgħaddi b’30/35",examRuleEnglish:"Ingliż biss waqt it-test",examRuleNavigation:"Tista’ timxi bejn il-mistoqsijiet u timmarkahom għar-reviżjoni.",startRealExam:"Ibda l-eżami reali",answered:"Imwieġba",unanswered:"Mhux imwieġba",flagged:"Immarkati",flagQuestion:"Immarka",unflagQuestion:"Neħħi l-marka",navigator:"Navigatur tal-mistoqsijiet",previous:"Lura",finishExam:"Temm l-eżami",pauseExam:"Waqqaf temporanjament",pauseExamConfirm:"Trid twaqqaf l-eżami u tmur lura fil-menu? It-tweġibiet u t-timer jinżammu.",confirmFinish:"Trid tissottometti l-eżami issa?",examSummary:"Sommarju tal-eżami",timeUsed:"Ħin użat",topicResults:"Riżultati skont il-kapitlu",resumeExam:"Kompli l-eżami",autoSubmitted:"Il-ħin skada. L-eżami ġie sottomess awtomatikament.",answerRecorded:"Tweġiba ssejvjata",examQuestionHelp:"Agħżel it-tweġiba. Tista’ tibdilha qabel tissottometti.",examPassTarget:"Għandek bżonn mill-inqas 30 tweġiba korretta.",newRealExam:"Eżami reali ġdid",allAnswered:"Il-mistoqsijiet kollha ġew imwieġba",unansweredWarning:n=>`Għad għandek ${n} mistoqsijiet mhux imwieġba. Tissottometti xorta?`,bankScope:"Bank tal-mistoqsijiet",bankAll:"Il-mistoqsijiet pertinenti kollha",bankCore:"Qalba LPTV",bankRoad:"Estensjoni tas-sigurtà fit-triq",bankAuditTitle:"Bank estiż u separat",bankAuditText:"250 mistoqsija għat-taħriġ: 68 qalba LPTV u 182 dwar is-sigurtà fit-triq.",bankExcludedText:"Esklużi: 31 mistoqsija ta’ operaturi/SOV/ġestjoni u 2 mistoqsijiet amministrattivi tal-liċenzja B.",bankDisclaimer:"Transport Malta ma tippubblikax id-daqs totali tal-bank LPTV. Dan huwa bank ta’ preparazzjoni, mhux il-lista uffiċjali sħiħa."}
};
let settings = load(SETTINGS,{lang:'en',theme:'system'});
let progress = load(STORAGE,{seen:{},correct:{},wrong:{},exams:[],favourites:[],activity:{},knownWords:[]});
progress.favourites=Array.isArray(progress.favourites)?progress.favourites:[];
progress.activity=progress.activity&&typeof progress.activity==='object'?progress.activity:{};
progress.knownWords=Array.isArray(progress.knownWords)?progress.knownWords:[];
let route = {name:'home',data:null};
let quiz = null;
let timerId = null;

function clone(v){return v===null?null:JSON.parse(JSON.stringify(v))}
function load(key,fallback){try{const raw=localStorage.getItem(key);if(!raw)return clone(fallback);const parsed=JSON.parse(raw);if(fallback&&typeof fallback==='object'&&!Array.isArray(fallback))return Object.assign(clone(fallback),parsed);return parsed}catch{return clone(fallback)}}
function save(key,value){localStorage.setItem(key,JSON.stringify(value))}
function allowedQuestionMap(map){
 const allowed=new Set(Q.map(q=>q.id));
 return Object.fromEntries(Object.entries(map||{}).filter(([id])=>allowed.has(id)));
}
if(progress.bankVersion!==TAG_BANK_VERSION){
 progress=Object.assign({},progress,{
   seen:allowedQuestionMap(progress.seen),
   correct:allowedQuestionMap(progress.correct),
   wrong:allowedQuestionMap(progress.wrong),
   favourites:(progress.favourites||[]).filter(id=>Q.some(q=>q.id===id)),
   bankVersion:TAG_BANK_VERSION
 });
 save(STORAGE,progress);
 const oldSession=load(SESSION,null);
 if(oldSession?.list?.some(item=>!Q.some(q=>q.id===item.id)))localStorage.removeItem(SESSION);
}
function t(key,...args){const v=(ui[settings.lang]||ui.en)[key]??ui.en[key]??key;return typeof v==='function'?v(...args):v}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function localized(obj,base){return obj[base+'_'+settings.lang]||obj[settings.lang]||obj[base+'_en']||obj.en||obj[base]||''}
function modeLabel(mode){
 if(mode==='exam')return t('realExamMode');
 if(mode==='assisted')return t('assistedMode');
 return t('guidedMode');
}

const TOPIC_GROUPS=[
 {id:'safety',icon:'🛡️',title:'topicSafety',desc:'topicSafetyDesc'},
 {id:'customer',icon:'🤝',title:'topicCustomer',desc:'topicCustomerDesc'},
 {id:'road',icon:'🛣️',title:'topicRoad',desc:'topicRoadDesc'},
 {id:'eco',icon:'🌿',title:'topicEco',desc:'topicEcoDesc'}
];

const SAFETY_CATEGORIES=new Set([
 'Accidents','First aid and shock','Vehicle safety','Vehicle faults','Tyres','Documents',
 'Documents and penalty points','Documents and disqualification','Administrative penalties',
 'Operator responsibilities','Operator licences','Driver requirements','Driving and rest periods',
 'Intermediary booking platforms','Special Occasion Vehicles','Garaging','Insurance',
 'Safe loading','LPTV Law 2026','Enforcement','Fuel safety','Vehicle lighting','Vehicle lights'
]);

const CUSTOMER_CATEGORIES=new Set([
 'Customer care','Vulnerable passengers','Disabled passengers','Passenger comfort'
]);

const ECO_CATEGORIES=new Set([
 'Eco driving','Environment','Vehicle emissions','Engine maintenance'
]);

function topicIdFor(q){
 const category=q.category||'';
 if(SAFETY_CATEGORIES.has(category))return 'safety';
 if(CUSTOMER_CATEGORIES.has(category))return 'customer';
 if(ECO_CATEGORIES.has(category))return 'eco';
 return 'road';
}
function topicDefinition(id){return TOPIC_GROUPS.find(x=>x.id===id)||TOPIC_GROUPS[2]}
function topicQuestions(id){return Q.filter(q=>topicIdFor(q)===id)}
function questionRate(q){
 const seen=progress.seen[q.id]||0;
 const correct=progress.correct[q.id]||0;
 return seen?correct/seen:null;
}
function topicStats(id){
 const list=topicQuestions(id);
 const seenUnique=list.filter(q=>(progress.seen[q.id]||0)>0).length;
 const attempts=list.reduce((n,q)=>n+(progress.seen[q.id]||0),0);
 const correct=list.reduce((n,q)=>n+(progress.correct[q.id]||0),0);
 return {total:list.length,seen:seenUnique,coverage:list.length?Math.round(seenUnique/list.length*100):0,accuracy:attempts?Math.round(correct/attempts*100):0};
}
function adaptivePool(limit=35){
 const ranked=Q.map(q=>{
   const seen=progress.seen[q.id]||0;
   const correct=progress.correct[q.id]||0;
   const wrong=progress.wrong[q.id]||0;
   const rate=seen?correct/seen:0.5;
   const priority=(wrong*7)+((1-rate)*4)+(seen===0?1.2:0)+(seen>0&&correct===0?2:0);
   return {q,priority,seen,wrong,rate,random:Math.random()};
 }).sort((a,b)=>b.priority-a.priority||a.rate-b.rate||b.wrong-a.wrong||a.random-b.random);
 return ranked.slice(0,Math.min(limit,ranked.length)).map(x=>x.q);
}
function readinessStats(){
 const st=stats();
 const coverage=Q.length?Math.round(st.seen/Q.length*100):0;
 const exams=progress.exams||[];
 const recent=exams.slice(-3);
 const examAverage=recent.length?Math.round(recent.reduce((n,e)=>n+(e.score/e.total*100),0)/recent.length):0;
 const score=Math.round((coverage*.35)+(st.accuracy*.35)+(examAverage*.30));
 let label='readinessStart',recommend='recommendStudy';
 if(score>=85&&examAverage>=86){label='readinessReady';recommend='recommendExam'}
 else if(score>=68){label='readinessAlmost';recommend='recommendWeak'}
 else if(score>=38){label='readinessGrowing';recommend=st.accuracy<75?'recommendWeak':'recommendStudy'}
 return {score,coverage,accuracy:st.accuracy,examAverage,label,recommend};
}
function formatExamDate(value){
 try{return new Intl.DateTimeFormat(settings.lang==='it'?'it-IT':settings.lang==='mt'?'mt-MT':'en-GB',{day:'2-digit',month:'2-digit',year:'2-digit'}).format(new Date(value))}
 catch{return ''}
}

const DAILY_GOAL=15;
const GLOSSARY=[{"term":"accelerate","it":"accelerare","example":"Accelerate only when the road ahead is clear.","example_it":"Accelera soltanto quando la strada davanti è libera.","tag":"Driving"},{"term":"airway","it":"vie respiratorie","example":"Check that the casualty's airway is clear.","example_it":"Controlla che le vie respiratorie dell’infortunato siano libere.","tag":"First aid"},{"term":"approach","it":"avvicinarsi","example":"Approach the junction slowly and carefully.","example_it":"Avvicinati all’incrocio lentamente e con attenzione.","tag":"Road"},{"term":"blind spot","it":"angolo cieco","example":"Check your blind spot before changing lane.","example_it":"Controlla l’angolo cieco prima di cambiare corsia.","tag":"Observation"},{"term":"brake sharply","it":"frenare bruscamente","example":"Do not brake sharply unless it is necessary.","example_it":"Non frenare bruscamente se non è necessario.","tag":"Driving"},{"term":"breakdown","it":"guasto","example":"Move to a safe place after a breakdown.","example_it":"Spostati in un luogo sicuro dopo un guasto.","tag":"Emergency"},{"term":"carriageway","it":"carreggiata","example":"Keep to the correct side of the carriageway.","example_it":"Mantieniti sul lato corretto della carreggiata.","tag":"Road"},{"term":"casualty","it":"infortunato","example":"Do not move a casualty with a suspected back injury.","example_it":"Non spostare un infortunato con una possibile lesione alla schiena.","tag":"First aid"},{"term":"cyclist","it":"ciclista","example":"Give the cyclist enough space when overtaking.","example_it":"Lascia spazio sufficiente al ciclista durante il sorpasso.","tag":"Vulnerable users"},{"term":"decelerate","it":"rallentare","example":"Decelerate smoothly before the bend.","example_it":"Rallenta gradualmente prima della curva.","tag":"Driving"},{"term":"defensive driving","it":"guida difensiva","example":"Defensive driving helps you anticipate danger.","example_it":"La guida difensiva aiuta ad anticipare i pericoli.","tag":"Driving"},{"term":"disabled passenger","it":"passeggero con disabilità","example":"Offer appropriate help to a disabled passenger.","example_it":"Offri un aiuto adeguato a un passeggero con disabilità.","tag":"Customer care"},{"term":"disqualification","it":"sospensione o revoca della patente","example":"A serious offence may lead to disqualification.","example_it":"Un’infrazione grave può portare alla sospensione o revoca della patente.","tag":"Law"},{"term":"dipped headlights","it":"fari anabbaglianti","example":"Use dipped headlights when meeting other traffic at night.","example_it":"Usa gli anabbaglianti quando incontri altri veicoli di notte.","tag":"Vehicle"},{"term":"driving licence","it":"patente di guida","example":"Carry a valid driving licence when required.","example_it":"Porta una patente valida quando richiesto.","tag":"Documents"},{"term":"elderly passenger","it":"passeggero anziano","example":"Allow extra time for an elderly passenger to enter.","example_it":"Lascia più tempo a un passeggero anziano per salire.","tag":"Customer care"},{"term":"emergency services","it":"servizi di emergenza","example":"Call the emergency services when someone is seriously injured.","example_it":"Chiama i servizi di emergenza quando qualcuno è gravemente ferito.","tag":"Emergency"},{"term":"filtering","it":"passare tra le file di veicoli","example":"Motorcyclists may be filtering through slow traffic.","example_it":"I motociclisti possono passare tra le file nel traffico lento.","tag":"Hazards"},{"term":"following distance","it":"distanza di sicurezza","example":"Increase your following distance in rain.","example_it":"Aumenta la distanza di sicurezza quando piove.","tag":"Road"},{"term":"fuel spill","it":"perdita di carburante","example":"A fuel spill is especially dangerous for motorcycles.","example_it":"Una perdita di carburante è particolarmente pericolosa per le moto.","tag":"Hazards"},{"term":"give way","it":"dare precedenza","example":"Give way to traffic already on the roundabout.","example_it":"Dai precedenza ai veicoli già sulla rotatoria.","tag":"Priority"},{"term":"glare","it":"abbagliamento","example":"Slow down if glare affects your vision.","example_it":"Rallenta se l’abbagliamento riduce la visibilità.","tag":"Visibility"},{"term":"hard shoulder","it":"corsia di emergenza","example":"Use the hard shoulder only when permitted or in an emergency.","example_it":"Usa la corsia di emergenza soltanto quando consentito o in emergenza.","tag":"Road"},{"term":"hazard","it":"pericolo","example":"Scan the road ahead for possible hazards.","example_it":"Osserva la strada davanti per individuare possibili pericoli.","tag":"Observation"},{"term":"hazard lights","it":"quattro frecce","example":"Switch on the hazard lights after a breakdown.","example_it":"Accendi le quattro frecce dopo un guasto.","tag":"Vehicle"},{"term":"hire or reward","it":"trasporto a pagamento","example":"The permit is required when carrying passengers for hire or reward.","example_it":"Il permesso è richiesto quando si trasportano passeggeri a pagamento.","tag":"LPTV"},{"term":"junction","it":"incrocio","example":"Look in every direction before entering the junction.","example_it":"Guarda in tutte le direzioni prima di entrare nell’incrocio.","tag":"Road"},{"term":"lane","it":"corsia","example":"Choose the correct lane before the roundabout.","example_it":"Scegli la corsia corretta prima della rotatoria.","tag":"Road"},{"term":"learner permit","it":"permesso per allievo conducente","example":"A learner permit is required before practical training.","example_it":"Il learner permit è necessario prima della pratica.","tag":"Documents"},{"term":"loading","it":"carico","example":"Secure the loading before starting the journey.","example_it":"Fissa il carico prima di iniziare il viaggio.","tag":"Safety"},{"term":"muffled voice","it":"voce impastata","example":"A muffled voice can make communication difficult.","example_it":"Una voce impastata può rendere difficile la comunicazione.","tag":"Communication"},{"term":"overtake","it":"sorpassare","example":"Do not overtake near a pedestrian crossing.","example_it":"Non sorpassare vicino a un attraversamento pedonale.","tag":"Road"},{"term":"pedestrian crossing","it":"attraversamento pedonale","example":"Be prepared to stop at a pedestrian crossing.","example_it":"Preparati a fermarti a un attraversamento pedonale.","tag":"Vulnerable users"},{"term":"penalty points","it":"punti di penalità","example":"Traffic offences may result in penalty points.","example_it":"Le infrazioni stradali possono comportare punti di penalità.","tag":"Law"},{"term":"priority","it":"precedenza","example":"Never assume that another driver will give you priority.","example_it":"Non presumere mai che un altro conducente ti dia la precedenza.","tag":"Road"},{"term":"rear-view mirror","it":"specchietto retrovisore","example":"Check the rear-view mirror before slowing down.","example_it":"Controlla lo specchietto retrovisore prima di rallentare.","tag":"Observation"},{"term":"reassure","it":"rassicurare","example":"Reassure a casualty who may be in shock.","example_it":"Rassicura un infortunato che potrebbe essere in stato di shock.","tag":"First aid"},{"term":"roadworthy","it":"idoneo alla circolazione","example":"The vehicle must remain roadworthy and safe.","example_it":"Il veicolo deve rimanere idoneo alla circolazione e sicuro.","tag":"Vehicle"},{"term":"roundabout","it":"rotatoria","example":"Signal correctly when leaving the roundabout.","example_it":"Segnala correttamente quando esci dalla rotatoria.","tag":"Road"},{"term":"safe gap","it":"spazio di sicurezza","example":"Wait for a safe gap before moving out.","example_it":"Aspetta uno spazio sicuro prima di immetterti.","tag":"Road"},{"term":"seat belt","it":"cintura di sicurezza","example":"Make sure every passenger uses a seat belt.","example_it":"Assicurati che ogni passeggero usi la cintura di sicurezza.","tag":"Safety"},{"term":"skid","it":"sbandata","example":"Avoid sudden steering if the vehicle starts to skid.","example_it":"Evita sterzate improvvise se il veicolo inizia a sbandare.","tag":"Vehicle"},{"term":"steering control","it":"controllo dello sterzo","example":"ABS helps the driver keep steering control while braking.","example_it":"L’ABS aiuta a mantenere il controllo dello sterzo durante la frenata.","tag":"Vehicle"},{"term":"stopping distance","it":"distanza di arresto","example":"Stopping distance increases on a wet road.","example_it":"La distanza di arresto aumenta su una strada bagnata.","tag":"Road"},{"term":"tailgating","it":"guidare troppo vicino","example":"Tailgating leaves too little time to react.","example_it":"Guidare troppo vicino lascia poco tempo per reagire.","tag":"Hazards"},{"term":"traffic sign","it":"segnale stradale","example":"Obey every mandatory traffic sign.","example_it":"Rispetta ogni segnale stradale obbligatorio.","tag":"Road"},{"term":"tunnel","it":"galleria","example":"Use hazard lights if your vehicle breaks down in a tunnel.","example_it":"Usa le quattro frecce se il veicolo si guasta in galleria.","tag":"Emergency"},{"term":"twist","it":"ruotare il busto","example":"Avoid twisting your body while lifting a heavy object.","example_it":"Evita di ruotare il busto mentre sollevi un oggetto pesante.","tag":"Safety"},{"term":"vulnerable road user","it":"utente vulnerabile della strada","example":"Slow down near vulnerable road users.","example_it":"Rallenta vicino agli utenti vulnerabili della strada.","tag":"Vulnerable users"},{"term":"warning triangle","it":"triangolo di emergenza","example":"Place the warning triangle only when it is safe to do so.","example_it":"Posiziona il triangolo di emergenza soltanto quando è sicuro farlo.","tag":"Emergency"},{"term":"wet road","it":"strada bagnata","example":"Leave a larger gap on a wet road.","example_it":"Lascia una distanza maggiore su una strada bagnata.","tag":"Weather"},{"term":"wheelchair","it":"sedia a rotelle","example":"Secure the wheelchair correctly before moving.","example_it":"Fissa correttamente la sedia a rotelle prima di partire.","tag":"Customer care"},{"term":"zebra crossing","it":"strisce pedonali","example":"Stop for pedestrians waiting at a zebra crossing.","example_it":"Fermati per i pedoni in attesa sulle strisce pedonali.","tag":"Vulnerable users"}];

function dateKey(date=new Date()){
 const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
 return `${y}-${m}-${d}`;
}
function dailyStats(){
 const today=progress.activity[dateKey()]||0;
 let cursor=new Date();
 if(!today)cursor.setDate(cursor.getDate()-1);
 let streak=0;
 for(let i=0;i<400;i++){
   const key=dateKey(cursor);
   if((progress.activity[key]||0)<=0)break;
   streak++;
   cursor.setDate(cursor.getDate()-1);
 }
 return {done:Math.min(today,DAILY_GOAL),raw:today,goal:DAILY_GOAL,complete:today>=DAILY_GOAL,streak};
}
function recordActivity(){
 const key=dateKey();
 progress.activity[key]=(progress.activity[key]||0)+1;
}
function isFavourite(id){return progress.favourites.includes(id)}
function toggleFavourite(id){
 if(isFavourite(id))progress.favourites=progress.favourites.filter(x=>x!==id);
 else progress.favourites.push(id);
 save(STORAGE,progress);
}
function savedQuestions(){return progress.favourites.map(id=>Q.find(q=>q.id===id)).filter(Boolean)}
function isKnownWord(term){return progress.knownWords.includes(term)}
function toggleKnownWord(term){
 if(isKnownWord(term))progress.knownWords=progress.knownWords.filter(x=>x!==term);
 else progress.knownWords.push(term);
 save(STORAGE,progress);
}
function dailyPool(){return adaptivePool(DAILY_GOAL)}
function examAnswerFor(q){return quiz?.answers?.[q.id]||null}
function examQuestionAnswered(q){const a=examAnswerFor(q);return !!a&&Array.isArray(a.selected)&&a.selected.length===q.correct.length}
function examAnsweredCount(){return quiz?.list?.filter(examQuestionAnswered).length||0}
function examUnansweredCount(){return Math.max(0,(quiz?.list?.length||0)-examAnsweredCount())}
function formatDuration(seconds){seconds=Math.max(0,Math.round(Number(seconds)||0));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
function examTimeUsed(){if(!quiz)return 0;const initial=Number(quiz.initialSeconds||2700);return Math.max(0,initial-Number(quiz.remaining||0))}
function examBreakdown(list,answers){
 return TOPIC_GROUPS.map(topic=>{
   const questions=list.filter(q=>topicIdFor(q)===topic.id);
   const correct=questions.filter(q=>answers[q.id]?.ok).length;
   return {id:topic.id,title:topic.title,icon:topic.icon,correct,total:questions.length,pct:questions.length?Math.round(correct/questions.length*100):0};
 }).filter(x=>x.total>0);
}
function loadExamSelection(){
 if(!quiz||quiz.mode!=='exam')return;
 const q=quiz.list[quiz.index],saved=quiz.answers[q.id];
 quiz.selected=Array.isArray(saved?.selected)?[...saved.selected]:[];
}
function goExamQuestion(index){
 if(!quiz||quiz.mode!=='exam')return;
 quiz.index=Math.max(0,Math.min(quiz.list.length-1,index));
 quiz.answered=false;quiz.showTranslation=false;loadExamSelection();saveSession();renderQuiz();window.scrollTo(0,0);
}
function toggleExamFlag(){
 if(!quiz||quiz.mode!=='exam')return;
 const id=quiz.list[quiz.index].id;
 quiz.flagged=Array.isArray(quiz.flagged)?quiz.flagged:[];
 quiz.flagged=quiz.flagged.includes(id)?quiz.flagged.filter(x=>x!==id):[...quiz.flagged,id];
 saveSession();renderQuiz();
}
function showExamNavigator(){
 if(!quiz||quiz.mode!=='exam')return;
 const answered=examAnsweredCount(),unanswered=examUnansweredCount(),flagged=(quiz.flagged||[]).length;
 modal.innerHTML=`<div class="modal-panel exam-navigator-panel"><div class="row between"><div><h2>${esc(t('navigator'))}</h2><p class="muted">${answered} ${esc(t('answered'))} • ${unanswered} ${esc(t('unanswered'))} • ${flagged} ${esc(t('flagged'))}</p></div><button class="btn secondary" data-close>${esc(t('close'))}</button></div><div class="navigator-legend"><span><i class="answered"></i>${esc(t('answered'))}</span><span><i class="flagged"></i>${esc(t('flagged'))}</span><span><i></i>${esc(t('unanswered'))}</span></div><div class="question-grid">${quiz.list.map((q,i)=>{const done=examQuestionAnswered(q),flag=(quiz.flagged||[]).includes(q.id),current=i===quiz.index;return `<button class="question-jump ${done?'answered':''} ${flag?'flagged':''} ${current?'current':''}" data-jump="${i}">${i+1}${flag?'<b>★</b>':''}</button>`}).join('')}</div><div class="actions navigator-actions"><button class="btn secondary" data-close>${esc(t('close'))}</button><button class="btn finish" id="navigatorFinish">${esc(t('finishExam'))}</button></div></div>`;
 modal.classList.remove('hidden');
 modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.classList.add('hidden'));
 modal.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{modal.classList.add('hidden');goExamQuestion(Number(b.dataset.jump))});
 $('#navigatorFinish').onclick=()=>{modal.classList.add('hidden');requestFinishExam()};
}
function requestFinishExam(){
 if(!quiz||quiz.mode!=='exam')return;
 const missing=examUnansweredCount();
 const message=missing?t('unansweredWarning',missing):t('confirmFinish');
 if(confirm(message))finishQuiz(false);
}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function applyTheme(){document.documentElement.dataset.theme=settings.theme==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):settings.theme}
function updateChrome(){document.documentElement.lang=settings.lang;$('#langBtn').textContent=settings.lang.toUpperCase();document.querySelectorAll('[data-i18n]').forEach(x=>x.textContent=t(x.dataset.i18n));backBtn.classList.toggle('hidden',route.name==='home'||route.name==='quiz');$('#bottomNav').classList.toggle('hidden',route.name==='quiz');document.querySelectorAll('[data-nav]').forEach(x=>x.classList.toggle('active',x.dataset.nav===route.name));}
function go(name,data=null,push=true){if(timerId&&name!=='quiz'){clearInterval(timerId);timerId=null}route={name,data};if(push)history.pushState({name,data},'',`#${name}`);render();}
function render(){if(route.name!=='quiz'&&timerId){clearInterval(timerId);timerId=null}updateChrome();const fn=views[route.name]||views.home;screen.innerHTML=fn(route.data);screen.focus({preventScroll:true});window.scrollTo(0,0);bindCommon();if(route.name==='quiz')renderQuiz();if(route.name==='assistant')bindAssistant();}
function bindCommon(){screen.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go,b.dataset.id||null));screen.querySelectorAll('[data-external]').forEach(b=>b.onclick=()=>window.open(b.dataset.external,'_blank','noopener'));}

const views={
 home:()=>{const day=dailyStats();return `<section class="hero"><h1>${esc(C.meta.slogan)}</h1><p>${esc(t('welcome'))}</p><div class="malta-line"><span class="malta-dot"></span><span>Malta • English • Italiano • Malti</span></div></section><button class="daily-banner ${day.complete?'complete':''}" data-go="dailysetup"><div class="daily-ring" style="--daily:${Math.round(day.done/day.goal*100)}"><strong>${day.done}/${day.goal}</strong></div><div><span>${esc(t('today'))}</span><h2>${esc(day.complete?t('dailyComplete'):t('dailyPlan'))}</h2><p>${esc(t('dailyPlanSub'))}</p></div><strong class="daily-streak">🔥 ${day.streak}</strong></button><div class="section-title"><div><h2>${esc(t('continue'))}</h2><p>${esc(t('database'))}: ${Q.length} ${esc(t('questions'))}</p></div><span class="badge official">${esc(t('official'))}</span></div><section class="grid"><button class="home-card" data-go="lptv"><span class="card-icon">🚘</span><div><h3>${esc(t('lptv'))}</h3><p>${esc(t('lptvSub'))}</p></div></button><button class="home-card guided-home" data-go="studysetup"><span class="card-icon">📘</span><div><h3>${esc(t('guidedStudy'))}</h3><p>${esc(t('guidedStudyDetail'))}</p></div></button><button class="home-card coach" data-go="vocabulary"><span class="card-icon">🔤</span><div><h3>${esc(t('englishCoach'))}</h3><p>${esc(t('englishCoachSub'))}</p></div></button><button class="home-card saved" data-go="favourites"><span class="card-icon">★</span><div><h3>${esc(t('savedQuestions'))}</h3><p>${progress.favourites.length} ${esc(t('questions'))}</p></div></button><button class="home-card red" data-go="licences"><span class="card-icon">🪪</span><div><h3>${esc(t('licences'))}</h3><p>${esc(t('licencesSub'))}</p></div></button><button class="home-card stone" data-go="roadcode"><span class="card-icon">📘</span><div><h3>${esc(t('roadCode'))}</h3><p>${esc(t('roadCodeSub'))}</p></div></button><button class="home-card green" data-go="regulations"><span class="card-icon">⚖️</span><div><h3>${esc(t('regulations'))}</h3><p>${esc(t('regulationsSub'))}</p></div></button><button class="home-card purple" data-go="assistant"><span class="card-icon">✦</span><div><h3>${esc(t('ai'))}</h3><p>${esc(t('aiSub'))}</p></div></button><button class="home-card" data-go="profile"><span class="card-icon">◎</span><div><h3>${esc(t('profile'))}</h3><p>${esc(t('progress'))} • ${esc(t('language'))}</p></div></button></section>`},
 lptv:()=>{const session=load(SESSION,null),ready=readinessStats(),day=dailyStats();return `<div class="section-title"><div><h2>${esc(t('lptv'))}</h2><p>${Q.length} ${esc(t('questions'))}</p></div><span class="readiness-mini">${ready.score}%</span></div><div class="stack">${session&&session.list?.length?`<button class="big-action green" id="resumeBtn"><div>${esc(t('resume'))}<small>${esc(modeLabel(session.mode))} • ${session.index+1}/${session.list.length}</small></div><span>▶</span></button>`:''}<button class="big-action daily-action" data-go="dailysetup"><div>${esc(t('dailyPlan'))}<small>${day.done}/${day.goal} • 🔥 ${day.streak} ${esc(t('days'))}</small></div><span>${day.complete?'✓':'☀️'}</span></button><button class="big-action green guided-primary" data-go="studysetup"><div>${esc(t('guidedStudy'))}<small>${esc(t('guidedStudyDetail'))}</small></div><span>📘</span></button><button class="big-action chapter-action" data-go="chapters"><div>${esc(t('fourChapters'))}<small>${esc(t('fourChaptersSub'))}</small></div><span>🧭</span></button><button class="big-action weak-action" data-go="weaksetup"><div>${esc(t('weakAttack'))}<small>${esc(t('weakAttackSub'))}</small></div><span>⚡</span></button><button class="big-action coach-action" data-go="vocabulary"><div>${esc(t('englishCoach'))}<small>${progress.knownWords.length}/${GLOSSARY.length} ${esc(t('words'))}</small></div><span>🔤</span></button><button class="big-action saved-action" data-go="favourites"><div>${esc(t('savedQuestions'))}<small>${progress.favourites.length} ${esc(t('questions'))}</small></div><span>★</span></button><button class="big-action assisted" data-go="assistedsetup"><div>${esc(t('assistedSimulation'))}<small>${esc(t('assistedDetail'))}</small></div><span>📝</span></button><button class="big-action red" data-go="examsetup"><div>${esc(t('examCentre'))}<small>${esc(t('examCentreSub'))}</small></div><span>🎯</span></button><button class="big-action secondary" id="wrongBtn"><div>${esc(t('errors'))}<small>${countWrong()} ${esc(t('questions'))}</small></div><span>↻</span></button><button class="big-action secondary" data-go="progress"><div>${esc(t('progress'))}<small>${ready.score}% • ${esc(t(ready.label))}</small></div><span>📊</span></button></div>`},
 examsetup:()=>`<div class="card exam-setup-card"><span class="mode-pill exam">🎯 ${esc(t('examCentre'))}</span><h2>${esc(t('realExamPieta'))}</h2><p class="muted">${esc(t('examCentreSub'))}</p><div class="exam-rule-grid"><div><strong>35</strong><span>${esc(t('examRuleQuestions'))}</span></div><div><strong>45:00</strong><span>${esc(t('examRuleTime'))}</span></div><div><strong>30/35</strong><span>${esc(t('examRulePass'))}</span></div></div><div class="bank-audit"><h3>✓ ${esc(t('bankAuditTitle'))}</h3><p>${esc(t('bankAuditText'))}</p><p>${esc(t('bankExcludedText'))}</p><small>${esc(t('bankDisclaimer'))}</small></div><div class="exam-instructions"><h3>${esc(t('examInstructions'))}</h3><p>✓ ${esc(t('examRuleEnglish'))}</p><p>✓ ${esc(t('examRuleNavigation'))}</p><p>✓ ${esc(t('examPassTarget'))}</p></div><button class="big-action red" id="startRealExam"><div>${esc(t('startRealExam'))}</div><span>▶</span></button></div>`,
 studysetup:()=>{const cats=[...new Set(Q.map(q=>q.category))].sort();return `<div class="card setup-card"><span class="mode-pill guided">${esc(t('guidedMode'))}</span><h2>${esc(t('guidedStudy'))}</h2><p class="muted">${esc(t('guidedStudyDetail'))}</p><label>${esc(t('bankScope'))}</label><select id="studyBank"><option value="all">${esc(t('bankAll'))} (${Q.length})</option><option value="core">${esc(t('bankCore'))} (${CORE_Q.length})</option><option value="road">${esc(t('bankRoad'))} (${ROAD_SAFETY_Q.length})</option></select><label>${esc(t('chooseTopic'))}</label><select id="studyCategory"><option value="ALL">${esc(t('allTopics'))}</option>${cats.map(c=>`<option>${esc(c)}</option>`).join('')}</select><label>${esc(t('questions'))}</label><select id="studyCount"><option>10</option><option selected>20</option><option>35</option><option>50</option></select><button class="big-action green" id="startStudy"><div>${esc(t('start'))}</div><span>▶</span></button></div>`},

 assistedsetup:()=>`<div class="card setup-card"><span class="mode-pill assisted">${esc(t('assistedMode'))}</span><h2>${esc(t('assistedSimulation'))}</h2><p class="muted">${esc(t('assistedDetail'))}</p><div class="exam-rules"><div><span>${esc(t('questions'))}</span><strong>35</strong></div><div><span>${esc(t('translate'))} + ${esc(t('listen'))}</span><strong>✓</strong></div></div><label>${esc(t('chooseTimer'))}</label><select id="assistedTimer"><option value="0">${esc(t('noTimer'))}</option><option value="1800">${esc(t('timer30'))}</option><option value="2700">${esc(t('timer45'))}</option></select><button class="big-action assisted" id="startAssisted"><div>${esc(t('startSimulation'))}</div><span>▶</span></button></div>`,
 chapters:()=>`<div class="section-title"><div><h2>${esc(t('fourChapters'))}</h2><p>${esc(t('fourChaptersSub'))}</p></div></div><div class="topic-grid">${TOPIC_GROUPS.map(topic=>{const st=topicStats(topic.id);return `<button class="topic-card" data-topic="${topic.id}"><div class="topic-icon">${topic.icon}</div><div class="topic-content"><h3>${esc(t(topic.title))}</h3><p>${esc(t(topic.desc))}</p><div class="topic-numbers"><span>${st.seen}/${st.total} ${esc(t('seen'))}</span><strong>${st.accuracy}%</strong></div><div class="mini-bar"><span style="width:${st.coverage}%"></span></div></div><span class="chev">›</span></button>`}).join('')}</div>`,
 chaptersetup:(id)=>{const topic=topicDefinition(id),st=topicStats(id);return `<div class="card setup-card"><span class="mode-pill chapter">${topic.icon} ${esc(t('chapterProgress'))}</span><h2>${esc(t(topic.title))}</h2><p class="muted">${esc(t(topic.desc))}</p><div class="chapter-summary"><div><span>${esc(t('chapterQuestions'))}</span><strong>${st.total}</strong></div><div><span>${esc(t('seen'))}</span><strong>${st.seen}</strong></div><div><span>${esc(t('chapterAccuracy'))}</span><strong>${st.accuracy}%</strong></div></div><label>${esc(t('questions'))}</label><select id="chapterCount"><option value="10">10</option><option value="20" selected>20</option><option value="35">35</option><option value="all">${esc(t('allChapterQuestions'))}</option></select><button class="big-action chapter-action" id="startChapter" data-topic="${topic.id}"><div>${esc(t('startChapter'))}</div><span>▶</span></button></div>`},
 weaksetup:()=>{const pool=adaptivePool(35);return `<div class="card setup-card"><span class="mode-pill weak">⚡ ${esc(t('diagnostic'))}</span><h2>${esc(t('adaptiveTraining'))}</h2><p class="muted">${esc(t('adaptiveTrainingDesc'))}</p><div class="chapter-summary"><div><span>${esc(t('availableWeak'))}</span><strong>${pool.length}</strong></div><div><span>${esc(t('errors'))}</span><strong>${countWrong()}</strong></div><div><span>${esc(t('accuracy'))}</span><strong>${stats().accuracy}%</strong></div></div><label>${esc(t('questions'))}</label><select id="weakCount"><option value="10">10</option><option value="20" selected>20</option><option value="35">35</option></select><button class="big-action weak-action" id="startWeak"><div>${esc(t('startWeak'))}</div><span>⚡</span></button></div>`},
 dailysetup:()=>{const day=dailyStats();return `<div class="card setup-card"><span class="mode-pill daily">☀️ ${esc(t('dailyPlan'))}</span><h2>${esc(day.complete?t('dailyComplete'):t('dailyPlanSub'))}</h2><div class="daily-detail"><div class="daily-ring large" style="--daily:${Math.round(day.done/day.goal*100)}"><strong>${day.done}/${day.goal}</strong><span>${esc(t('dailyGoal'))}</span></div><div><p><b>${esc(t('dailyDone'))}:</b> ${day.done}/${day.goal}</p><p><b>${esc(t('streak'))}:</b> 🔥 ${day.streak} ${esc(t('days'))}</p><p class="muted">${esc(t('adaptiveTrainingDesc'))}</p></div></div><button class="big-action daily-action" id="startDaily"><div>${esc(day.complete?t('repeatDaily'):t('startDaily'))}</div><span>▶</span></button></div>`},
 vocabulary:()=>`<div class="section-title"><div><h2>${esc(t('englishCoach'))}</h2><p>${progress.knownWords.length}/${GLOSSARY.length} ${esc(t('knownWords'))}</p></div></div><div class="search-box"><input id="vocabularySearch" placeholder="${esc(t('vocabularySearch'))}" autocomplete="off"><button id="vocabularySearchBtn">⌕</button></div><div class="vocabulary-chips"><button data-vocabulary-chip="road">Road</button><button data-vocabulary-chip="brake">Brake</button><button data-vocabulary-chip="passenger">Passenger</button><button data-vocabulary-chip="hazard">Hazard</button><button data-vocabulary-chip="">Tutte</button></div><div id="vocabularyResults" class="vocabulary-list"></div>`,
 favourites:()=>{const list=savedQuestions();return `<div class="section-title"><div><h2>${esc(t('savedQuestions'))}</h2><p>${list.length} ${esc(t('questions'))}</p></div></div>`+(list.length?`<div class="list">${list.map(q=>`<article class="saved-question"><button class="saved-open" data-qid="${esc(q.id)}"><span class="badge">${esc(q.category)}</span><h3>${esc(q.question)}</h3><p>${esc(q.question_it)}</p></button><button class="saved-remove" data-remove-saved="${esc(q.id)}" aria-label="${esc(t('removeSaved'))}">★</button></article>`).join('')}</div>`:`<div class="card empty-state"><div>☆</div><h3>${esc(t('noSavedQuestions'))}</h3><p>${esc(t('savedQuestionsSub'))}</p></div>`)},
 licences:()=>`<div class="section-title"><div><h2>${esc(t('licences'))}</h2><p>Malta</p></div></div><div class="category-grid">${C.licences.map(x=>`<button class="licence-card" data-licence="${esc(x.code)}"><div style="font-size:27px">${x.icon}</div><strong>${esc(x.code)}</strong><span>${esc(x[settings.lang]||x.en)}</span></button>`).join('')}</div><div class="card" style="margin-top:14px"><span class="badge official">${esc(t('officialSource'))}</span><p class="muted">${esc(t('assistantDisclaimer'))}</p><a class="source-link" href="https://www.transport.gov.mt/land/driving-licence-783" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></div>`,
 roadcode:()=>`<div class="section-title"><div><h2>${esc(t('roadCode'))}</h2><p>${esc(t('categories'))}</p></div></div><div class="list">${C.roadCode.map(x=>`<button class="list-card" data-road="${esc(x.id)}"><span class="list-icon">${x.icon}</span><div><h3>${esc(x[settings.lang]||x.en)}</h3><p>${esc(localized(x,'summary'))}</p></div><span class="chev">›</span></button>`).join('')}</div><div class="card"><span class="badge official">${esc(t('officialSource'))}</span><p class="muted">${esc(t('lastVerified'))}: ${esc(C.meta.verified)}</p><a class="source-link" href="https://www.transport.gov.mt/land/roads-and-traffic-management/road-code-7389" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></div>`,
 regulations:()=>`<div class="section-title"><div><h2>${esc(t('regulations'))}</h2><p>${esc(t('lastVerified'))}: ${esc(C.meta.verified)}</p></div></div><div class="list">${C.regulations.map(x=>`<article class="list-card"><span class="list-icon">${x.icon}</span><div style="flex:1"><span class="badge official">${esc(t('officialSource'))}</span><h3>${esc(x[settings.lang]||x.en)}</h3><p>${esc(localized(x,'desc'))}</p><a class="source-link" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></div></article>`).join('')}</div>`,
 search:()=>`<div class="section-title"><div><h2>${esc(t('search'))}</h2><p>${Q.length} ${esc(t('questions'))}</p></div></div><div class="search-box"><input id="globalSearch" placeholder="${esc(t('searchPlaceholder'))}" autocomplete="off"><button id="searchBtn">⌕</button></div><div id="searchResults" class="list" style="margin-top:14px"></div>`,
 assistant:()=>`<div class="section-title"><div><h2>${esc(t('ai'))}</h2><p>${esc(t('assistantLocal'))}</p></div><span class="badge warning">BETA</span></div><div class="card"><p>${esc(t('assistantIntro'))}</p><div class="prompt-chips"><button data-prompt="box junction">Box junction</button><button data-prompt="penalty points">Penalty points</button><button data-prompt="parking">Parking</button><button data-prompt="LPTV">LPTV</button></div><div class="assistant-log" id="assistantLog"><div class="assistant-bubble bot">${esc(t('assistantDisclaimer'))}</div></div><textarea id="assistantInput" placeholder="${esc(t('assistantPlaceholder'))}"></textarea><button class="big-action" id="assistantSend"><div>${esc(t('send'))}</div><span>➤</span></button></div>`,
 profile:()=>{const st=stats(),day=dailyStats();return `<div class="section-title"><div><h2>${esc(t('profileTitle'))}</h2><p>Malta Driving Master</p></div></div><div class="stat-grid"><div class="stat-card"><strong>${st.seen}</strong><span>${esc(t('seen'))}</span></div><div class="stat-card"><strong>${st.accuracy}%</strong><span>${esc(t('accuracy'))}</span></div><div class="stat-card"><strong>${day.streak}</strong><span>${esc(t('streak'))}</span></div><div class="stat-card"><strong>${st.best ?? '—'}</strong><span>${esc(t('best'))}</span></div></div><div class="card" style="margin-top:14px"><h3>${esc(t('language'))}</h3><select id="profileLang"><option value="en">English</option><option value="it">Italiano</option><option value="mt">Malti</option></select><h3>${esc(t('theme'))}</h3><select id="profileTheme"><option value="system">${esc(t('system'))}</option><option value="light">${esc(t('light'))}</option><option value="dark">${esc(t('dark'))}</option></select></div><div class="card backup-card" style="margin-top:14px"><h3>${esc(t('backup'))}</h3><p class="muted">${esc(t('backupSub'))}</p><div class="actions"><button class="btn" id="exportBackup">${esc(t('exportBackup'))}</button><button class="btn secondary" id="importBackup">${esc(t('importBackup'))}</button><input id="backupFile" type="file" accept="application/json,.json" hidden></div></div><div class="card" style="margin-top:14px"><button class="btn danger" id="clearProgress" style="width:100%">${esc(t('clear'))}</button></div>`},
 progress:()=>{const st=stats(),ready=readinessStats(),by=categoryStats(),exams=(progress.exams||[]).slice(-8).reverse();return `<div class="section-title"><div><h2>${esc(t('progress'))}</h2><p>${st.seen}/${Q.length}</p></div></div><div class="readiness-card"><div class="readiness-circle" style="--score:${ready.score}"><div><strong>${ready.score}%</strong><span>${esc(t('readiness'))}</span></div></div><div class="readiness-copy"><h3>${esc(t(ready.label))}</h3><p>${esc(t(ready.recommend))}</p><button class="btn" data-go="${ready.score<68?'weaksetup':'lptv'}">${esc(t('recommended'))}</button></div></div><div class="metric-bars"><div><div class="label"><span>${esc(t('coverage'))}</span><strong>${ready.coverage}%</strong></div><div class="mini-bar"><span style="width:${ready.coverage}%"></span></div></div><div><div class="label"><span>${esc(t('accuracy'))}</span><strong>${ready.accuracy}%</strong></div><div class="mini-bar"><span style="width:${ready.accuracy}%"></span></div></div><div><div class="label"><span>${esc(t('recentAverage'))}</span><strong>${ready.examAverage}%</strong></div><div class="mini-bar"><span style="width:${ready.examAverage}%"></span></div></div></div><div class="stat-grid"><div class="stat-card"><strong>${st.seen}</strong><span>${esc(t('seen'))}</span></div><div class="stat-card"><strong>${st.accuracy}%</strong><span>${esc(t('accuracy'))}</span></div><div class="stat-card"><strong>${st.exams}</strong><span>${esc(t('exams'))}</span></div><div class="stat-card"><strong>${st.last ?? '—'}</strong><span>${esc(t('last'))}</span></div></div><div class="card" style="margin-top:14px"><h3>${esc(t('fourChapters'))}</h3>${TOPIC_GROUPS.map(topic=>{const x=topicStats(topic.id);return `<button class="progress-topic" data-go="chaptersetup" data-id="${topic.id}"><span>${topic.icon} ${esc(t(topic.title))}</span><strong>${x.accuracy}%</strong><div class="mini-bar"><span style="width:${x.coverage}%"></span></div></button>`}).join('')}</div><div class="card" style="margin-top:14px"><h3>${esc(t('examHistory'))}</h3>${exams.length?`<div class="exam-history">${exams.map(e=>{const passed=e.score>=30;return `<div class="exam-row"><span>${formatExamDate(e.date)}</span><strong>${e.score}/${e.total}</strong><em class="${passed?'pass':'fail'}">${esc(t(passed?'passedSmall':'failedSmall'))}</em></div>`}).join('')}</div>`:`<p class="muted">${esc(t('noExamHistory'))}</p>`}</div><div class="card" style="margin-top:14px"><h3>${esc(t('categories'))}</h3>${by.length?by.map(x=>`<div class="bar-row"><div class="label"><span>${esc(x.category)}</span><strong>${x.pct}%</strong></div><div class="mini-bar"><span style="width:${x.pct}%"></span></div></div>`).join(''):`<p class="muted">${esc(t('noResults'))}</p>`}</div>`},
 quiz:()=>`<div class="card quiz-card"><div class="quiz-head"><span class="badge counter-badge" id="qCounter"></span><span class="timer" id="quizTimer"></span></div><div class="progress"><span id="quizProgress"></span></div><div id="examStatus" class="exam-status hidden"></div><div class="quiz-mode-row"><span class="mode-label" id="quizModeBadge"></span><span id="quizMeta" class="muted small"></span></div><div id="quizQuestion" class="question"></div><div id="quizHelp"></div><div id="quizInstruction" class="quiz-instruction"></div><div id="quizOptions"></div><div id="quizExplanation" class="explanation hidden"></div><div class="actions quiz-footer"><button class="btn secondary" id="quizExit">${esc(t('exit'))}</button><button class="btn secondary hidden" id="examPrev">‹ ${esc(t('previous'))}</button><button class="btn flag hidden" id="examFlag">☆ ${esc(t('flagQuestion'))}</button><button class="btn secondary hidden" id="examNavigator">☷ ${esc(t('navigator'))}</button><button class="btn" id="quizConfirm">${esc(t('confirm'))}</button><button class="btn hidden" id="quizNext">${esc(t('next'))}</button><button class="btn finish hidden" id="examFinish">${esc(t('finishExam'))}</button></div></div>`,

 result:()=>{const r=route.data;return `<div class="card result-card"><div class="result-hero ${r.mode==='exam'?(r.pass?'pass':'fail'):'complete'}"><span>${r.mode==='exam'?(r.pass?'✓':'!'):'✓'}</span><h2>${esc(r.title)}</h2><div class="score">${r.correct}/${r.total}</div><p>${Math.round(r.correct/r.total*100)}%</p></div>${r.mode==='exam'?`<div class="result-metrics"><div><span>${esc(t('timeUsed'))}</span><strong>${formatDuration(r.timeUsed)}</strong></div><div><span>${esc(t('unanswered'))}</span><strong>${r.unanswered}</strong></div><div><span>${esc(t('flagged'))}</span><strong>${r.flagged}</strong></div></div><div class="card inset-card"><h3>${esc(t('topicResults'))}</h3>${r.breakdown.map(x=>`<div class="topic-result"><span>${x.icon} ${esc(t(x.title))}</span><strong>${x.correct}/${x.total}</strong><div class="mini-bar"><span style="width:${x.pct}%"></span></div></div>`).join('')}</div>`:''}<div class="actions result-actions"><button class="btn secondary" data-go="lptv">${esc(t('close'))}</button>${r.mode==='exam'?`<button class="btn secondary" data-go="examsetup">${esc(t('newRealExam'))}</button>`:''}${r.wrongIds.length?`<button class="btn" id="reviewWrong">${esc(t('resultReview'))}</button>`:''}</div></div>`}

};

function bindViewSpecific(){
 if(route.name==='lptv'){
   $('#wrongBtn').onclick=()=>{const pool=Q.filter(q=>(progress.wrong[q.id]||0)>0);if(!pool.length)return toast(t('noErrors'));startQuiz(shuffle(pool).slice(0,35),'guided')};
   const r=$('#resumeBtn');if(r)r.onclick=resumeQuiz;
 }
 if(route.name==='examsetup')$('#startRealExam').onclick=()=>startQuiz(buildExam(),'exam',{timerSeconds:2700});
 if(route.name==='studysetup')$('#startStudy').onclick=()=>{
   const bank=$('#studyBank').value,cat=$('#studyCategory').value,n=Number($('#studyCount').value);
   const bankPool=bank==='core'?CORE_Q:bank==='road'?ROAD_SAFETY_Q:Q;
   const pool=cat==='ALL'?bankPool:bankPool.filter(q=>q.category===cat);
   startQuiz(shuffle(pool).slice(0,Math.min(n,pool.length)),'guided')
 };
 if(route.name==='assistedsetup')$('#startAssisted').onclick=()=>{const seconds=Number($('#assistedTimer').value);startQuiz(buildExam(),'assisted',{timerSeconds:seconds})};
 if(route.name==='chapters')screen.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>go('chaptersetup',b.dataset.topic));
 if(route.name==='chaptersetup')$('#startChapter').onclick=()=>{const id=$('#startChapter').dataset.topic;const pool=topicQuestions(id);const value=$('#chapterCount').value;const n=value==='all'?pool.length:Number(value);startQuiz(shuffle(pool).slice(0,Math.min(n,pool.length)),'guided')};
 if(route.name==='weaksetup')$('#startWeak').onclick=()=>{const n=Number($('#weakCount').value);startQuiz(adaptivePool(n),'guided')};
 if(route.name==='dailysetup')$('#startDaily').onclick=()=>startQuiz(dailyPool(),'guided');
 if(route.name==='vocabulary')bindVocabulary();
 if(route.name==='favourites'){
   screen.querySelectorAll('[data-qid]').forEach(b=>b.onclick=()=>startQuiz([Q.find(q=>q.id===b.dataset.qid)],'guided'));
   screen.querySelectorAll('[data-remove-saved]').forEach(b=>b.onclick=()=>{toggleFavourite(b.dataset.removeSaved);render()});
 }
 if(route.name==='licences')screen.querySelectorAll('[data-licence]').forEach(b=>b.onclick=()=>showLicence(b.dataset.licence));
 if(route.name==='roadcode')screen.querySelectorAll('[data-road]').forEach(b=>b.onclick=()=>showRoad(b.dataset.road));
 if(route.name==='search'){const run=()=>renderSearch($('#globalSearch').value);$('#searchBtn').onclick=run;$('#globalSearch').oninput=run;renderSearch('')}
 if(route.name==='profile'){
   const l=$('#profileLang'),th=$('#profileTheme'),file=$('#backupFile');
   l.value=settings.lang;th.value=settings.theme;
   l.onchange=()=>{settings.lang=l.value;save(SETTINGS,settings);render()};
   th.onchange=()=>{settings.theme=th.value;save(SETTINGS,settings);applyTheme();render()};
   $('#exportBackup').onclick=exportBackup;
   $('#importBackup').onclick=()=>file.click();
   file.onchange=()=>{if(file.files?.[0])importBackup(file.files[0])};
   $('#clearProgress').onclick=()=>{if(confirm(t('resetConfirm'))){progress={seen:{},correct:{},wrong:{},exams:[],favourites:[],activity:{},knownWords:[]};save(STORAGE,progress);localStorage.removeItem(SESSION);render()}}
 }
 if(route.name==='result'){const b=$('#reviewWrong');if(b)b.onclick=()=>{const list=route.data.wrongIds.map(id=>Q.find(q=>q.id===id)).filter(Boolean);startQuiz(list,'guided')}}
}
const oldRender=render;render=function(){oldRender();bindViewSpecific()};

function buildExam(){
 const quotas={safety:9,customer:5,road:17,eco:4};
 const selected=[],used=new Set();
 for(const [topic,amount] of Object.entries(quotas)){
   const pool=shuffle(Q.filter(q=>topicIdFor(q)===topic));
   for(const q of pool){
     if(selected.filter(x=>topicIdFor(x)===topic).length>=amount)break;
     if(!used.has(q.id)){used.add(q.id);selected.push(q)}
   }
 }
 const remaining=shuffle(Q.filter(q=>!used.has(q.id)));
 while(selected.length<35&&remaining.length)selected.push(remaining.shift());
 return shuffle(selected).slice(0,35);
}
function startQuiz(list,mode,options={}){
 const timerSeconds=Number(options.timerSeconds||0);
 quiz={list,index:0,mode,answers:{},selected:[],remaining:mode==='exam'?2700:timerSeconds,initialSeconds:mode==='exam'?2700:timerSeconds,timerEnabled:mode==='exam'||timerSeconds>0,answered:false,showTranslation:false,flagged:[],startedAt:new Date().toISOString(),finished:false};
 saveSession();go('quiz');if(quiz.timerEnabled)startTimer()
}
function resumeQuiz(){
 const s=load(SESSION,null);if(!s?.list?.length)return;
 quiz=s;
 if(typeof quiz.timerEnabled!=='boolean')quiz.timerEnabled=quiz.mode==='exam';
 if(typeof quiz.showTranslation!=='boolean')quiz.showTranslation=false;
 if(!Array.isArray(quiz.flagged))quiz.flagged=[];
 if(!quiz.initialSeconds)quiz.initialSeconds=quiz.mode==='exam'?2700:(quiz.remaining||0);
 if(!quiz.startedAt)quiz.startedAt=new Date().toISOString();
 loadExamSelection();
 go('quiz');if(quiz.timerEnabled&&quiz.remaining>0)startTimer()
}
function saveSession(){if(quiz)save(SESSION,quiz)}
function startTimer(){clearInterval(timerId);timerId=setInterval(()=>{quiz.remaining=Math.max(0,quiz.remaining-1);const el=$('#quizTimer');if(el){el.textContent=formatTime(quiz.remaining);el.classList.toggle('danger',quiz.remaining<=300)}saveSession();if(quiz.remaining<=0){if(quiz.mode==='exam')toast(t('autoSubmitted'));finishQuiz(true)}},1000)}
function formatTime(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
function renderQuiz(){
  if(!quiz || !Array.isArray(quiz.list) || !quiz.list.length){ go('lptv'); return; }
  const q=quiz.list[quiz.index];
  if(quiz.mode==='exam')loadExamSelection();
  quiz.selected=Array.isArray(quiz.selected)?quiz.selected:[];
  if(typeof quiz.showTranslation!=='boolean')quiz.showTranslation=false;

  $('#qCounter').textContent=`${t('question')} ${quiz.index+1} ${settings.lang==='it'?'di':'/'} ${quiz.list.length}`;
  $('#quizTimer').textContent=quiz.timerEnabled?formatTime(quiz.remaining):t('noTimer');
  $('#quizTimer').classList.toggle('danger',quiz.timerEnabled&&quiz.remaining<=300);
  $('#quizProgress').style.width=`${((quiz.index+1)/quiz.list.length)*100}%`;
  $('#quizModeBadge').textContent=modeLabel(quiz.mode);
  $('#quizModeBadge').className=`mode-label ${quiz.mode}`;
  $('#quizMeta').textContent=q.category;
  $('#quizQuestion').textContent=q.question;
  $('#quizInstruction').textContent=q.correct.length===1?t('selectOne'):t('selectMany',q.correct.length);
  const examStatus=$('#examStatus');
  if(quiz.mode==='exam'){
    const answered=examAnsweredCount(),unanswered=examUnansweredCount(),flagged=(quiz.flagged||[]).length;
    examStatus.innerHTML=`<button id="statusNavigator"><span><b>${answered}</b>${esc(t('answered'))}</span><span><b>${unanswered}</b>${esc(t('unanswered'))}</span><span><b>${flagged}</b>${esc(t('flagged'))}</span></button>`;
    examStatus.classList.remove('hidden');
  }else examStatus.classList.add('hidden');

  const help=$('#quizHelp');
  if(quiz.mode==='exam'){
    help.innerHTML=`<div class="exam-lock">🔒 ${esc(t('examQuestionHelp'))}</div>`;
  }else{
    help.innerHTML=`<div class="actions learning-tools"><button class="btn secondary" id="translateBtn">🇮🇹 ${esc(quiz.showTranslation?t('hideTranslation'):t('translate'))}</button><button class="btn secondary" id="listenBtn">🔊 ${esc(t('listen'))}</button><button class="btn secondary favourite-quiz ${isFavourite(q.id)?'active':''}" id="favouriteBtn">${isFavourite(q.id)?'★':'☆'} ${esc(isFavourite(q.id)?t('removeSaved'):t('saveQuestion'))}</button></div>${quiz.showTranslation?`<div class="translation"><strong>${esc(t('translationQuestion'))}</strong><p>${esc(q.question_it||q.question)}</p><small>${esc(t('translationAnswers'))}: ↓</small></div>`:''}`;
  }

  $('#quizOptions').innerHTML=q.answers.map((answer,i)=>{
    const translated=(q.answers_it&&q.answers_it[i])||answer;
    return `<button class="option ${quiz.selected.includes(i)?'selected':''}" data-opt="${i}"><span class="option-main"><strong>${String.fromCharCode(65+i)}.</strong> ${esc(answer)}</span>${quiz.mode!=='exam'&&quiz.showTranslation?`<span class="option-translation">🇮🇹 ${esc(translated)}</span>`:''}</button>`;
  }).join('');

  $('#quizExplanation').classList.add('hidden');
  const isExam=quiz.mode==='exam';
  $('#quizConfirm').classList.toggle('hidden',isExam||!!quiz.answered);
  $('#quizNext').classList.toggle('hidden',!isExam&&!quiz.answered);
  $('#examPrev').classList.toggle('hidden',!isExam);
  $('#examFlag').classList.toggle('hidden',!isExam);
  $('#examNavigator').classList.toggle('hidden',!isExam);
  $('#examFinish').classList.toggle('hidden',!isExam);
  if(isExam){
    $('#quizNext').classList.remove('hidden');
    $('#quizNext').textContent=quiz.index===quiz.list.length-1?t('navigator'):t('next');
    $('#examPrev').disabled=quiz.index===0;
    const flagged=(quiz.flagged||[]).includes(q.id);
    $('#examFlag').textContent=`${flagged?'★':'☆'} ${t(flagged?'unflagQuestion':'flagQuestion')}`;
  }
  screen.querySelectorAll('[data-opt]').forEach(b=>{b.onclick=()=>selectOption(Number(b.dataset.opt))});
  $('#quizExit').onclick=()=>{
    if(isExam){if(confirm(t('pauseExamConfirm'))){clearInterval(timerId);timerId=null;saveSession();go('lptv')}}
    else if(confirm(t('exit')+'?')){localStorage.removeItem(SESSION);go('lptv')}
  };
  $('#quizConfirm').onclick=confirmAnswer;
  $('#quizNext').onclick=()=>isExam?(quiz.index<quiz.list.length-1?goExamQuestion(quiz.index+1):showExamNavigator()):nextQuestion();
  if(isExam){
    $('#examPrev').onclick=()=>goExamQuestion(quiz.index-1);
    $('#examFlag').onclick=toggleExamFlag;
    $('#examNavigator').onclick=showExamNavigator;
    $('#examFinish').onclick=requestFinishExam;
    $('#statusNavigator').onclick=showExamNavigator;
  }

  if(quiz.mode!=='exam'){
    $('#translateBtn').onclick=()=>{quiz.showTranslation=!quiz.showTranslation;saveSession();renderQuiz()};
    $('#listenBtn').onclick=()=>speakQuestion(q);
    $('#favouriteBtn').onclick=()=>{toggleFavourite(q.id);renderQuiz()};
    if(quiz.answered)applyReview(q,quiz.answers[q.id]);
  }
}
function selectOption(i){
 if(quiz.answered&&quiz.mode!=='exam')return;
 const q=quiz.list[quiz.index],max=q.correct.length;
 if(quiz.selected.includes(i))quiz.selected=quiz.selected.filter(x=>x!==i);
 else{if(quiz.selected.length>=max)return toast(max===1?t('selectOne'):t('selectMany',max));quiz.selected.push(i)}
 if(quiz.mode==='exam'){
   const chosen=[...quiz.selected].sort((a,b)=>a-b),correct=[...q.correct].sort((a,b)=>a-b);
   quiz.answers[q.id]={selected:chosen,ok:chosen.length===correct.length&&JSON.stringify(chosen)===JSON.stringify(correct)};
 }
 saveSession();renderQuiz();
}
function confirmAnswer(){const q=quiz.list[quiz.index],need=q.correct.length;if(quiz.selected.length!==need)return toast(need===1?t('selectOne'):t('selectMany',need));const chosen=[...quiz.selected].sort((a,b)=>a-b),correct=[...q.correct].sort((a,b)=>a-b),ok=JSON.stringify(chosen)===JSON.stringify(correct);quiz.answers[q.id]={selected:chosen,ok};quiz.answered=true;progress.seen[q.id]=(progress.seen[q.id]||0)+1;if(ok)progress.correct[q.id]=(progress.correct[q.id]||0)+1;else progress.wrong[q.id]=(progress.wrong[q.id]||0)+1;recordActivity();save(STORAGE,progress);saveSession();if(quiz.mode==='exam')nextQuestion();else renderQuiz()}
function applyReview(q,a){if(!a)return;screen.querySelectorAll('[data-opt]').forEach(b=>{const i=Number(b.dataset.opt);if(q.correct.includes(i))b.classList.add('correct');else if(a.selected.includes(i))b.classList.add('wrong')});showExplanation(q,a)}
function showExplanation(q,a){
 const box=$('#quizExplanation');
 const chosenEn=a?.selected?.map(i=>q.answers[i]).join(' • ')||'—';
 const chosenIt=a?.selected?.map(i=>(q.answers_it&&q.answers_it[i])||q.answers[i]).join(' • ')||'—';
 const rightEn=q.correct.map(i=>q.answers[i]).join(' • ');
 const rightIt=q.correct.map(i=>(q.answers_it&&q.answers_it[i])||q.answers[i]).join(' • ');
 const wrongSelected=(a?.selected||[]).filter(i=>!q.correct.includes(i));
 box.innerHTML=`<strong class="explanation-title">${a?(a.ok?'✅ '+t('correct'):'❌ '+t('wrong')):'✦ '+t('explain')}</strong>
 ${a?`<div class="answer-review"><p><b>${esc(t('yourAnswer'))}:</b><br>${esc(chosenEn)}<br><span>🇮🇹 ${esc(chosenIt)}</span></p></div>`:''}
 <div class="answer-review correct-review"><p><b>${esc(t('rightAnswer'))}:</b><br>${esc(rightEn)}<br><span>🇮🇹 ${esc(rightIt)}</span></p></div>
 ${wrongSelected.length?`<div class="why-box wrong-reason"><b>${esc(t('wrong'))}</b><p>${esc(t('wrongChoiceReason'))}</p></div>`:''}
 <div class="why-box"><b>${esc(t('whyCorrect'))}</b><p>${esc(q.explanation||'')}</p><p>🇮🇹 ${esc(q.explanation_it||q.explanation||'')}</p></div>`;
 box.classList.remove('hidden')
}
function nextQuestion(){if(quiz?.mode==='exam'){if(quiz.index<quiz.list.length-1)goExamQuestion(quiz.index+1);else showExamNavigator();return}if(quiz.index<quiz.list.length-1){quiz.index++;quiz.selected=[];quiz.answered=false;quiz.showTranslation=false;saveSession();renderQuiz();window.scrollTo(0,0)}else finishQuiz(false)}
function finishQuiz(autoSubmitted=false){
 if(!quiz||quiz.finished)return;
 quiz.finished=true;clearInterval(timerId);timerId=null;
 const mode=quiz.mode,list=[...quiz.list],answers={...quiz.answers};
 if(mode==='exam'){
   list.forEach(q=>{
     const a=answers[q.id];
     progress.seen[q.id]=(progress.seen[q.id]||0)+1;
     if(a?.ok)progress.correct[q.id]=(progress.correct[q.id]||0)+1;
     else progress.wrong[q.id]=(progress.wrong[q.id]||0)+1;
   });
 }
 const correct=list.filter(q=>answers[q.id]?.ok).length,total=list.length;
 const wrongIds=list.filter(q=>!answers[q.id]?.ok).map(q=>q.id);
 const unanswered=mode==='exam'?list.filter(q=>!answers[q.id]||answers[q.id].selected?.length!==q.correct.length).length:0;
 const flagged=mode==='exam'?(quiz.flagged||[]).length:0;
 const pass=mode==='exam'&&correct>=30;
 const timeUsed=mode==='exam'?examTimeUsed():0;
 const breakdown=mode==='exam'?examBreakdown(list,answers):[];
 if(mode==='exam'){
   progress.exams.push({date:new Date().toISOString(),score:correct,total,timeUsed,unanswered,breakdown});
   progress.exams=progress.exams.slice(-30);
 }
 save(STORAGE,progress);localStorage.removeItem(SESSION);
 const title=mode==='exam'?(pass?t('passed'):t('failed')):t('completed');
 quiz=null;go('result',{correct,total,pass,title,wrongIds,mode,timeUsed,unanswered,flagged,breakdown,autoSubmitted});
}
function speak(text){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=.88;speechSynthesis.speak(u)}
function speakQuestion(q){
 const options=q.answers.map((answer,i)=>`${String.fromCharCode(65+i)}. ${answer}`).join('. ');
 speak(`${q.question}. ${options}`);
}
function countWrong(){return Q.filter(q=>(progress.wrong[q.id]||0)>0).length}
function stats(){const seen=Q.filter(q=>(progress.seen[q.id]||0)>0).length,attempts=Q.reduce((n,q)=>n+(progress.seen[q.id]||0),0),correct=Q.reduce((n,q)=>n+(progress.correct[q.id]||0),0),exams=progress.exams||[],scores=exams.map(e=>e.score);return{seen,accuracy:attempts?Math.round(correct/attempts*100):0,exams:exams.length,best:scores.length?Math.max(...scores)+'/35':null,last:scores.length?scores.at(-1)+'/35':null}}
function categoryStats(){const map={};Q.forEach(q=>{const s=progress.seen[q.id]||0,c=progress.correct[q.id]||0;if(!s)return;(map[q.category]??={s:0,c:0});map[q.category].s+=s;map[q.category].c+=c});return Object.entries(map).map(([category,v])=>({category,pct:Math.round(v.c/v.s*100)})).sort((a,b)=>a.pct-b.pct).slice(0,12)}
function renderSearch(term){const box=$('#searchResults');term=term.trim().toLowerCase();if(!term){box.innerHTML=`<p class="muted">${esc(t('searchPlaceholder'))}</p>`;return}const qs=Q.filter(q=>(q.question+' '+q.question_it+' '+q.category+' '+q.id).toLowerCase().includes(term)).slice(0,20),words=GLOSSARY.filter(x=>(x.term+' '+x.it+' '+x.example+' '+x.example_it).toLowerCase().includes(term)).slice(0,8),rs=C.regulations.filter(x=>(x.en+' '+x.it+' '+x.mt+' '+x.desc_en+' '+x.desc_it).toLowerCase().includes(term)),topics=C.roadCode.filter(x=>(x.en+' '+x.it+' '+x.mt+' '+x.summary_en+' '+x.summary_it).toLowerCase().includes(term));const html=[...words.map(x=>`<article class="list-card"><span class="list-icon">🔤</span><div><span class="badge">${esc(t('englishCoach'))}</span><h3>${esc(x.term)} — ${esc(x.it)}</h3><p>${esc(x.example)}</p></div></article>`),...qs.map(q=>`<button class="list-card" data-qid="${esc(q.id)}"><span class="list-icon">?</span><div><span class="badge">${esc(q.category)}</span><h3>${esc(q.question)}</h3><p>${esc(q.question_it)}</p></div><span class="chev">›</span></button>`),...topics.map(x=>`<button class="list-card" data-road="${esc(x.id)}"><span class="list-icon">${x.icon}</span><div><h3>${esc(x[settings.lang]||x.en)}</h3><p>${esc(localized(x,'summary'))}</p></div></button>`),...rs.map(x=>`<article class="list-card"><span class="list-icon">${x.icon}</span><div><h3>${esc(x[settings.lang]||x.en)}</h3><p>${esc(localized(x,'desc'))}</p><a class="source-link" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></div></article>`)].join('');box.innerHTML=html||`<p class="muted">${esc(t('noResults'))}</p>`;box.querySelectorAll('[data-qid]').forEach(b=>b.onclick=()=>startQuiz([Q.find(q=>q.id===b.dataset.qid)],'guided'));box.querySelectorAll('[data-road]').forEach(b=>b.onclick=()=>showRoad(b.dataset.road))}

function bindVocabulary(){
 const input=$('#vocabularySearch'),button=$('#vocabularySearchBtn');
 const run=()=>renderVocabulary(input.value);
 input.oninput=run;
 input.onsearch=run;
 button.onclick=run;
 screen.querySelectorAll('[data-vocabulary-chip]').forEach(chip=>{
   chip.onclick=()=>{
     input.value=chip.dataset.vocabularyChip;
     renderVocabulary(input.value);
   };
 });
 renderVocabulary('');
}
function normaliseVocabularyText(value){
 return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
}
function vocabularyQueryVariants(value){
 const clean=normaliseVocabularyText(value);
 if(!clean)return [];
 const variants=new Set([clean]);
 clean.split(/\s+/).forEach(word=>{
   variants.add(word);
   if(word.length>3&&word.endsWith('ies'))variants.add(word.slice(0,-3)+'y');
   if(word.length>3&&word.endsWith('es')){
     variants.add(word.slice(0,-2));
     variants.add(word.slice(0,-1));
   }
   if(word.length>3&&word.endsWith('s'))variants.add(word.slice(0,-1));
 });
 return [...variants].filter(Boolean);
}
function renderVocabulary(term){
 const box=$('#vocabularyResults');
 const variants=vocabularyQueryVariants(term);
 const list=GLOSSARY.filter(x=>{
   if(!variants.length)return true;
   const haystack=normaliseVocabularyText(x.term+' '+x.it+' '+x.tag+' '+x.example+' '+x.example_it);
   return variants.some(query=>haystack.includes(query));
 });
 box.innerHTML=list.length?list.map(x=>`<article class="vocabulary-card ${isKnownWord(x.term)?'known':''}">
   <div class="vocabulary-head"><div><span class="badge">${esc(x.tag)}</span><h3>${esc(x.term)}</h3><strong>${esc(x.it)}</strong></div><button class="word-audio" data-speak-word="${esc(x.term)}" aria-label="${esc(t('listen'))}">🔊</button></div>
   <div class="word-example"><span>${esc(t('example'))}</span><p>${esc(x.example)}</p><p>🇮🇹 ${esc(x.example_it)}</p></div>
   <button class="known-button ${isKnownWord(x.term)?'active':''}" data-known-word="${esc(x.term)}">${isKnownWord(x.term)?'✓ '+esc(t('known')):'○ '+esc(t('markKnown'))}</button>
 </article>`).join(''):`<div class="card empty-search"><div>🔎</div><h3>${esc(t('noResults'))}</h3><p class="muted">Prova una parola più breve, per esempio: <b>road</b>, <b>brake</b>, <b>hazard</b> oppure <b>passenger</b>.</p></div>`;
 box.querySelectorAll('[data-speak-word]').forEach(b=>b.onclick=()=>{const item=GLOSSARY.find(x=>x.term===b.dataset.speakWord);if(item)speak(`${item.term}. ${item.example}`)});
 box.querySelectorAll('[data-known-word]').forEach(b=>b.onclick=()=>{toggleKnownWord(b.dataset.knownWord);renderVocabulary($('#vocabularySearch')?.value||'')});
}
async function exportBackup(){
 const data={app:'Malta Driving Master',version:'5.2',exportedAt:new Date().toISOString(),progress,settings};
 const json=JSON.stringify(data,null,2);
 const filename=`malta-driving-master-backup-${dateKey()}.json`;
 try{
   const file=new File([json],filename,{type:'application/json'});
   if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
     await navigator.share({
       files:[file],
       title:'Malta Driving Master',
       text:'Copia dei progressi di Malta Driving Master'
     });
     toast(t('backupCreated'));
     return;
   }
 }catch(error){
   if(error&&error.name==='AbortError')return;
 }
 const blob=new Blob([json],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;
 a.download=filename;
 a.style.display='none';
 document.body.appendChild(a);
 a.click();
 setTimeout(()=>{a.remove();URL.revokeObjectURL(url)},1500);
 toast(t('backupCreated'));
}
function importBackup(file){
 const reader=new FileReader();
 reader.onload=()=>{
   try{
     const data=JSON.parse(reader.result);
     const p=data?.progress;
     if(!p||typeof p.seen!=='object'||typeof p.correct!=='object'||typeof p.wrong!=='object'||!Array.isArray(p.exams))throw new Error('invalid');
     progress={
       seen:p.seen||{},correct:p.correct||{},wrong:p.wrong||{},exams:p.exams||[],
       favourites:Array.isArray(p.favourites)?p.favourites:[],
       activity:p.activity&&typeof p.activity==='object'?p.activity:{},
       knownWords:Array.isArray(p.knownWords)?p.knownWords:[]
     };
     if(data.settings&&['en','it','mt'].includes(data.settings.lang)){
       settings=Object.assign(settings,data.settings);
       save(SETTINGS,settings);
       applyTheme();
     }
     save(STORAGE,progress);localStorage.removeItem(SESSION);toast(t('backupRestored'));setTimeout(render,400);
   }catch{toast(t('backupInvalid'))}
 };
 reader.onerror=()=>toast(t('backupInvalid'));
 reader.readAsText(file);
}
function bindAssistant(){const input=$('#assistantInput'),send=$('#assistantSend'),log=$('#assistantLog');const ask=()=>{const text=input.value.trim();if(!text)return;log.insertAdjacentHTML('beforeend',`<div class="assistant-bubble user">${esc(text)}</div>`);const answer=assistantAnswer(text);log.insertAdjacentHTML('beforeend',`<div class="assistant-bubble bot">${answer}</div>`);input.value='';log.lastElementChild.scrollIntoView({behavior:'smooth'})};send.onclick=ask;screen.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>{input.value=b.dataset.prompt;ask()})}
function assistantAnswer(text){const term=text.toLowerCase(),words=term.split(/\s+/).filter(w=>w.length>3);const scored=Q.map(q=>{const hay=(q.question+' '+q.question_it+' '+q.explanation+' '+q.explanation_it+' '+q.category).toLowerCase();return{q,score:words.reduce((n,w)=>n+(hay.includes(w)?1:0),0)}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3);const reg=C.regulations.find(x=>(x.en+' '+x.it+' '+x.mt+' '+x.desc_en+' '+x.desc_it).toLowerCase().includes(words[0]||term));if(scored.length){const q=scored[0].q;return `<strong>${esc(q.category)}</strong><p>${esc(settings.lang==='it'?q.explanation_it:q.explanation)}</p><p><b>${esc(t('rightAnswer'))}:</b> ${esc(q.correct.map(i=>q.answers[i]).join(' • '))}</p>`}if(reg)return `<strong>${esc(reg[settings.lang]||reg.en)}</strong><p>${esc(localized(reg,'desc'))}</p><a class="source-link" href="${esc(reg.url)}" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a>`;return esc(t('noResults')+' '+t('assistantDisclaimer'))}
function showLicence(code){const x=C.licences.find(x=>x.code===code);modal.innerHTML=`<div class="modal-panel"><div class="row between"><h2>${x.icon} ${esc(x.code)}</h2><button class="btn secondary" data-close>${esc(t('close'))}</button></div><p style="font-size:20px">${esc(x[settings.lang]||x.en)}</p><p class="muted">${esc(t('assistantDisclaimer'))}</p><a class="source-link" href="https://www.transport.gov.mt/land/driving-licence-783" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></div>`;modal.classList.remove('hidden');modal.querySelector('[data-close]').onclick=()=>modal.classList.add('hidden')}
function showRoad(id){const x=C.roadCode.find(x=>x.id===id);const related=Q.filter(q=>(q.category+' '+q.question+' '+q.question_it).toLowerCase().includes(x.en.split(' ')[0].toLowerCase())).slice(0,5);modal.innerHTML=`<div class="modal-panel"><div class="row between"><h2>${x.icon} ${esc(x[settings.lang]||x.en)}</h2><button class="btn secondary" data-close>${esc(t('close'))}</button></div><p>${esc(localized(x,'summary'))}</p><span class="badge official">${esc(t('officialSource'))}</span><a class="source-link" href="https://www.transport.gov.mt/land/roads-and-traffic-management/road-code-7389" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a>${related.length?`<h3 style="margin-top:22px">${esc(t('questions'))}</h3><div class="list">${related.map(q=>`<button class="list-card" data-qid="${esc(q.id)}"><div><h3>${esc(q.question)}</h3><p>${esc(q.question_it)}</p></div></button>`).join('')}</div>`:''}</div>`;modal.classList.remove('hidden');modal.querySelector('[data-close]').onclick=()=>modal.classList.add('hidden');modal.querySelectorAll('[data-qid]').forEach(b=>b.onclick=()=>{modal.classList.add('hidden');startQuiz([Q.find(q=>q.id===b.dataset.qid)],'guided')})}
function showLanguages(){modal.innerHTML=`<div class="modal-panel"><h2>${esc(t('language'))}</h2><div class="language-list"><button data-lang="en">🇬🇧 English</button><button data-lang="it">🇮🇹 Italiano</button><button data-lang="mt">🇲🇹 Malti</button></div></div>`;modal.classList.remove('hidden');modal.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{settings.lang=b.dataset.lang;save(SETTINGS,settings);modal.classList.add('hidden');render()})}

$('#langBtn').onclick=showLanguages;backBtn.onclick=()=>history.back();document.querySelector('.brand').onclick=()=>{if(route.name==='quiz'&&quiz){if(quiz.mode==='exam'){if(confirm(t('pauseExamConfirm'))){clearInterval(timerId);timerId=null;saveSession();go('home')}}else if(confirm(t('exit')+'?')){clearInterval(timerId);timerId=null;localStorage.removeItem(SESSION);quiz=null;go('home')}}else go('home')};document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>go(b.dataset.nav));window.onpopstate=e=>{route=e.state||{name:'home',data:null};render()};window.addEventListener('beforeunload',saveSession);applyTheme();if(!localStorage.getItem(SETTINGS))setTimeout(showLanguages,250);history.replaceState({name:'home',data:null},'',location.pathname+'#home');render();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
