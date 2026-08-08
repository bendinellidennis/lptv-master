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
const USER_PROFILE = 'mdm-v1-user-profile';
const ADMIN_EMAIL = 'maltadrivingmaster@gmail.com';
const BUILD_VERSION = '39.9.5';
const BUILD_RELEASE_DATE = '06/08/2026';
const ERROR_REPLAY_KEY = 'mdm-v1-error-replay';
const CLOUD_READY_KEY = 'mdm-v1-cloud-ready';
const MISSION_SYSTEM_KEY = 'mdm-v1-mission-system';
const AI_INSTRUCTOR_KEY = 'mdm-v1-ai-instructor';
const INSTRUCTOR_PORTAL_KEY = 'mdm-v1-instructor-portal';
const SCHOOL_PORTAL_KEY = 'mdm-v1-school-portal-2';
const ZERO_ERROR_KEY = 'mdm-v1-zero-error';
const EXAM_DAY_KEY = 'mdm-v1-exam-day';
const RECOVERY_KEY = 'mdm-v1-coach-recovery';
const COACH_KEY = 'mdm-v1-coach';
const INVESTOR_PREVIEW_KEY = 'mdm-v1-investor-preview';
const SPLASH_KEY = 'mdm-v1-premium-splash';
const ONBOARDING_KEY = 'mdm-v1-onboarding';
const PRIVACY_PREFS_KEY = 'mdm-v1-privacy-preferences';
const PRIVACY_INFORMATION_CHECKED = '2026-08-02';
const SCHOOL_DASHBOARD_KEY = 'mdm-v1-school-dashboard';
const ROADMAP_KEY = 'mdm-v1-personal-roadmap';
const PASSPORT_KEY = 'mdm-v1-lptv-passport';
const PASSPORT_OFFICIAL_CHECKED = '2026-08-02';
const PASSPORT_LINKS = {
 main:'https://www.transport.gov.mt/Land/Professional-Transport-Services/Professional-Drivers-operating-for-Hire-or-Reward/Light-Passenger-Vehicle-8-seats-plus-driver-776',
 dpa13:'https://www.transport.gov.mt/Land/Downloads-eForms/Driving/DPA-13-APPLICATION-FOR-DRIVERS-PERMIT-GARAGE-HIRE-CABS-2069',
 dpa14:'https://www.transport.gov.mt/Land/Downloads-eForms/Driving/DPA-14-APPLICATION-FOR-RENEWAL-OF-DRIVERS-PERMIT-2070',
 dpa16:'https://www.transport.gov.mt/Land/Downloads-eForms/Driving/DPA-16-EMPLOYER-DECLARATION-FOR-LPTV-PTV-DRIVER-PERMIT-APPLICATIONS-7765',
 drv032:'https://www.transport.gov.mt/Land/Downloads-eForms/Driving/DRV-032-MEDICAL-CERTIFICATE-2096',
 sopt01:'https://www.transport.gov.mt/Land/Downloads-eForms/Driving/SOPT-01-FIRST-TIME-APPLICATIONS-FOR-DRIVER-PERMIT-TAGS-LPTV-PTV-7767',
 sopt02:'https://www.transport.gov.mt/Land/Downloads-eForms/Driving/SOPT-02-RENEWAL-APPLICATIONS-FOR-DRIVER-PERMIT-TAGS-LPTV-PTV-7768',
 operatorGuide:'https://www.transport.gov.mt/LPTV-Operator-Guide-First-time-and-Tag-Renewal-Applications.pdf-f11514',
 training:'https://www.transport.gov.mt/land/professional-transport-services/approved-training-and-tests-820',
 downloads:'https://www.transport.gov.mt/land/downloads/driving-2350',
 contact:'https://www.transport.gov.mt/Contact-61'
};
const SCHOOL_PREFS_KEY = 'mdm-v1-school-preferences';
const SCHOOL_COMPARE_KEY = 'mdm-v1-school-compare';
const SCHOOL_PARTNER_KEY = 'mdm-v1-school-partner-draft';
let deferredInstallPrompt = null;
const SCHOOL_DEMOS = [{"id":"demo-north","name":"School Partner Demo — North","area":"north","languages":["en","it"],"courses":["lptv","b"],"transmission":["automatic","manual"],"schedule":["day","evening","weekend"],"services":["english","documents","bridge","progress","vulnerable"],"plan":"featured","sponsored":true,"description_en":"Demonstration profile with LPTV support, Italian assistance and evening availability.","description_it":"Profilo dimostrativo con supporto LPTV, assistenza in italiano e disponibilità serale.","description_mt":"Profil dimostrattiv b’appoġġ LPTV, għajnuna bit-Taljan u ħinijiet ta’ filgħaxija."},{"id":"demo-central","name":"School Partner Demo — Central","area":"central","languages":["en","mt"],"courses":["lptv","b"],"transmission":["automatic"],"schedule":["day","evening"],"services":["english","documents","progress","pickup"],"plan":"pro","sponsored":false,"description_en":"Demonstration profile focused on automatic vehicles, document guidance and progress reports.","description_it":"Profilo dimostrativo dedicato a veicoli automatici, assistenza documentale e rapporti sui progressi.","description_mt":"Profil dimostrattiv għal vetturi awtomatiċi, gwida tad-dokumenti u rapporti tal-progress."},{"id":"demo-south","name":"School Partner Demo — South","area":"south","languages":["en","it","mt"],"courses":["lptv"],"transmission":["automatic","manual"],"schedule":["weekend","evening"],"services":["english","bridge","vulnerable","progress"],"plan":"pro","sponsored":false,"description_en":"Demonstration LPTV profile with weekend lessons and customer-safety scenarios.","description_it":"Profilo dimostrativo LPTV con lezioni nel weekend e scenari sulla sicurezza dei clienti.","description_mt":"Profil dimostrattiv LPTV b’lezzjonijiet fi tmiem il-ġimgħa u xenarji tas-sigurtà tal-klijenti."},{"id":"demo-gozo","name":"School Partner Demo — Gozo","area":"gozo","languages":["en","mt"],"courses":["b"],"transmission":["manual"],"schedule":["day","weekend"],"services":["documents","pickup","vulnerable"],"plan":"basic","sponsored":false,"description_en":"Demonstration profile for category B with weekend availability and collection service.","description_it":"Profilo dimostrativo per la categoria B con disponibilità nel weekend e servizio di raccolta.","description_mt":"Profil dimostrattiv għall-kategorija B b’ħinijiet fi tmiem il-ġimgħa u servizz ta’ ġbir."}];

const ui = {
 en:{home:'Home',search:'Search',assistant:'LPTV Assistant',profile:'Profile',welcome:'Everything you need to learn and drive in Malta.',continue:'Continue your preparation',lptv:'LPTV',lptvSub:'Exam, study and mistakes',licences:'Driving Licences',licencesSub:'Categories used in Malta',roadCode:'Road Code',roadCodeSub:'Rules explained clearly',regulations:'Regulations',regulationsSub:'Official sources and updates',ai:'LPTV Assistant',aiSub:'Search rules, questions and explanations offline',profileTitle:'Your profile',startExam:'Official-style exam',examDetail:'35 questions • 45 minutes • pass 30/35',study:'Study by topic',errors:'Redo mistakes',progress:'Progress',back:'Back',translate:'Translate',listen:'Listen',explain:'Explain it',confirm:'Confirm',next:'Next',exit:'Exit',question:'Question',selectOne:'Select 1 answer',selectMany:n=>`Select ${n} answers`,correct:'Correct answer',wrong:'Wrong answer',yourAnswer:'Your answer',rightAnswer:'Correct answer',passed:'PASSED',failed:'NOT PASSED',completed:'Session completed',officialSource:'Official source',openSource:'Open official source',language:'Language',theme:'Appearance',light:'Light',dark:'Dark',system:'System',clear:'Delete progress',database:'Database',questions:'questions',searchPlaceholder:'Search questions, rules or regulations…',noResults:'No results found.',assistantIntro:'Write a word or a question in English or Italian. The assistant searches the app’s question bank, glossary, road topics and official links.',assistantPlaceholder:'Example: priority at a roundabout, elderly passenger, tunnel…',send:'Send',assistantLocal:'Transparent offline search — no external AI',assistantDisclaimer:'This is an offline LPTV search assistant, not a generative AI. Results come from content stored in the app. Check official links for legal decisions.',officialEnglish:'Official English',italian:'Italian',maltese:'Maltese',maltesePending:'The Maltese translation of this item is being prepared. The official English text remains available.',categories:'Categories',lastVerified:'Sources checked',resetConfirm:'Delete all saved progress?',noErrors:'You have no saved mistakes yet.',resume:'Resume session',newExam:'Start new exam',allTopics:'All topics',chooseTopic:'Choose a topic',start:'Start',seen:'Seen',accuracy:'Accuracy',exams:'Exams',best:'Best result',last:'Last result',official:'Extended preparation bank',studyMode:'Study mode',examMode:'Exam mode',noHelpExam:'Translations and explanations are available after the exam.',resultReview:'Review mistakes',close:'Close',guidedStudy:'Guided study',guidedStudyDetail:'250 relevant questions • Italian translation • audio • immediate correction',assistedSimulation:'Practice test with help',assistedDetail:'35 questions • translation and audio • optional timer',realExamPieta:'Real Pietà exam',realExamDetail:'35 questions • 45 minutes • English only • correction at the end',chooseTimer:'Choose the timer',noTimer:'No timer',timer45:'45 minutes',timer30:'30 minutes',startSimulation:'Start practice test',guidedMode:'Guided study',assistedMode:'Practice with help',realExamMode:'Real Pietà exam',hideTranslation:'Hide translation',translationQuestion:'Question in Italian',translationAnswers:'Answers in Italian',whyCorrect:'Why this answer is correct',wrongChoiceReason:'The selected option does not match the rule required by the question.',fourChapters:"Complete study path",fourChaptersSub:"250 relevant questions organised into the 4 preparation chapters",weakAttack:"Weak-points attack",weakAttackSub:"Adaptive practice based on your mistakes and lowest accuracy",topicSafety:"Health, Safety and Legal Responsibilities",topicSafetyDesc:"Accidents, first aid, documents, penalties, operators, vehicles and safe loading",topicCustomer:"Customer Care and Vulnerable Passengers",topicCustomerDesc:"Passenger assistance, disability, comfort, communication and professional conduct",topicRoad:"Road Procedure and Responsibilities",topicRoadDesc:"Road rules, signs, junctions, crossings, hazards and defensive driving",topicEco:"Eco-safe Driving",topicEcoDesc:"Fuel use, emissions, environment and efficient driving",chapterProgress:"Chapter progress",startChapter:"Study this chapter",allChapterQuestions:"All chapter questions",adaptiveTraining:"Adaptive training",adaptiveTrainingDesc:"The app prioritises repeated mistakes, low accuracy and unseen questions.",availableWeak:"Questions selected for you",startWeak:"Start weak-points training",readiness:"Exam readiness",coverage:"Coverage",recentAverage:"Recent exam average",recommended:"Recommended next step",readinessStart:"Getting started",readinessGrowing:"Improving",readinessAlmost:"Almost ready",readinessReady:"Ready for the real test",recommendStudy:"Complete more guided-study questions.",recommendWeak:"Train your weakest areas.",recommendExam:"Try another realistic exam.",examHistory:"Exam history",noExamHistory:"No realistic exam completed yet.",passedSmall:"Passed",failedSmall:"Not passed",chapterQuestions:"Questions in this chapter",chapterAccuracy:"Chapter accuracy",diagnostic:"Personal diagnostic",dailyPlan:"Today's plan",dailyPlanSub:"15 personalised questions to keep your preparation moving",dailyDone:"Today's progress",dailyComplete:"Daily goal completed",startDaily:"Start today's training",repeatDaily:"Repeat today's training",streak:"Study streak",days:"days",englishCoach:"English Coach",englishCoachSub:"Key LPTV words with Italian meaning, examples and audio",vocabularySearch:"Search an English or Italian word…",knownWords:"Words learned",markKnown:"Mark as learned",known:"Learned",savedQuestions:"Saved questions",savedQuestionsSub:"Keep difficult or important questions for quick review",saveQuestion:"Save question",removeSaved:"Remove from saved",noSavedQuestions:"You have not saved any questions yet.",backup:"Progress backup",backupSub:"Save or restore your results, favourites and study history",exportBackup:"Export backup",importBackup:"Import backup",backupCreated:"Backup created.",backupRestored:"Backup restored.",backupInvalid:"This backup file is not valid.",today:"Today",words:"words",example:"Example",dailyGoal:"Daily goal",examCentre:"Exam Centre",examCentreSub:"35 questions from the extended LPTV preparation bank",examInstructions:"Exam instructions",examRuleQuestions:"35 questions",examRuleTime:"45 minutes",examRulePass:"Pass mark: 30/35",examRuleEnglish:"English only during the test",examRuleNavigation:"You may move between questions and flag them for review.",startRealExam:"Start real exam",answered:"Answered",unanswered:"Unanswered",flagged:"Flagged",flagQuestion:"Flag",unflagQuestion:"Remove flag",navigator:"Question navigator",previous:"Previous",finishExam:"Finish exam",pauseExam:"Pause exam",pauseExamConfirm:"Pause the exam and return to the menu? Your answers and timer will be saved.",confirmFinish:"Submit the exam now?",examSummary:"Exam summary",timeUsed:"Time used",topicResults:"Results by chapter",resumeExam:"Resume exam",autoSubmitted:"Time expired. The exam was submitted automatically.",answerRecorded:"Answer saved",examQuestionHelp:"Select your answer. You can change it until you submit the exam.",examPassTarget:"You need at least 30 correct answers.",newRealExam:"New real exam",allAnswered:"All questions answered",unansweredWarning:n=>`You still have ${n} unanswered question${n===1?'':'s'}. Submit anyway?`,bankScope:"Question bank",bankAll:"All relevant questions",bankCore:"LPTV core",bankRoad:"Road-safety extension",bankAuditTitle:"Extended and separated bank",bankAuditText:"250 relevant preparation questions: 68 LPTV core questions plus 182 road-safety questions.",bankExcludedText:"Excluded: 31 operator/SOV/business-management questions and 2 Category B administrative questions.",bankDisclaimer:"Transport Malta does not publish the total official LPTV question-bank size. This is a preparation bank, not a claim of the complete official list.",questionLibrary:"Question library",questionLibrarySub:"Search, filter and review all 250 relevant questions",scheduledReview:"Scheduled review",scheduledReviewSub:"Questions automatically return when it is time to revise them",dueNow:"Due now",nextReview:"Next review",startReview:"Start scheduled review",noReviewDue:"Nothing is due today",reviewReady:"Questions ready for review",filterStatus:"Progress status",filterChapter:"Chapter",filterBank:"Question bank",statusAll:"All statuses",statusUnseen:"Never studied",statusWrong:"Answered incorrectly",statusSaved:"Saved",statusDue:"Due for review",statusMastered:"Mastered",resultsCount:"results",attempts:"Attempts",studyNow:"Study now",mastered:"Mastered",dueToday:"Review today",reviewIn:"Review in",resetFilters:"Reset filters",loadMore:"Show more",allChapters:"All chapters",librarySearch:"Search English, Italian, category or question ID…",reviewSystem:"Smart review",reviewSystemSub:"Correct answers return after 1, 3, 7, 14 and 30 days. Mistakes return immediately.",nextReviewNone:"No review has been scheduled yet.",masteredQuestions:"Mastered questions",reviewedQuestions:"Scheduled questions",sentenceCoach:"Understand the sentence",hideSentenceCoach:"Hide sentence help",sentenceCoachSub:"Key phrases and words explained in Italian",keyPhrases:"Key exam phrases",keyWords:"Key words",slowListen:"Listen slowly",noKeyTerms:"No saved phrase or glossary word was found in this question.",phrasebook:"Exam phrasebook",phrasebookSub:"Common wording used in driving-test questions",commonPhrases:"Common exam phrases",phraseSearch:"Search an English or Italian phrase…",learnedPhrases:"Phrases learned",markPhraseKnown:"Mark phrase as learned",phraseKnown:"Phrase learned",flashcards:"Phrase flashcards",flashcardsSub:"Practise English to Italian and Italian to English",englishToItalian:"English → Italian",italianToEnglish:"Italian → English",revealAnswer:"Reveal answer",hideAnswer:"Hide answer",nextCard:"Next card",shuffleCards:"Shuffle cards",cardProgress:"Card",phraseMeaning:"Italian meaning",questionLanguageHelp:"Question language help",audioNormal:"Normal speed",audioSlow:"Slow speed",personalDetails:"Personal details",personalDetailsSub:"Complete your profile and prepare the registration contact",firstName:"First name",lastName:"Last name",emailAddress:"Email address",addressOptional:"Address (optional)",ageOptional:"Age (optional)",saveProfile:"Save profile",prepareRegistration:"Prepare registration email",profileSaved:"Profile saved on this device.",profileRequired:"Enter first name, last name and a valid email address.",privacyRequired:"Accept the privacy notice before preparing the registration.",privacyConsent:"I consent to sending these details to Malta Driving Master for user registration and support.",updatesConsent:"I would also like to receive important app updates by email.",privacyNote:"The details remain on this device. To send them, the app opens Mail or Gmail with a prepared message and you must press Send.",registrationPrepared:"Registration email prepared. Complete sending in Mail or Gmail.",registrationPending:"Profile incomplete",registrationComplete:"Profile complete",completeProfile:"Complete your profile",completeProfileSub:"Name, surname and email are required for registration.",registrationId:"Registration ID",adminContact:"Administrative contact",deletePersonalData:"Delete personal details",deletePersonalDataConfirm:"Delete the personal details saved on this device?",personalDataDeleted:"Personal details deleted.",emailInvalid:"Enter a valid email address.",ageInvalid:"Age must be between 16 and 100, or left empty.",emailNotAutomatic:"Opening the email does not send it automatically.",privacyAndContact:"Privacy and contact",savedOnDevice:"Saved on device",registrationPreparedOn:"Registration prepared",sendRegistration:"Send registration",shareRegistration:"Share registration",openGmail:"Open Gmail",openMail:"Open Mail",copyRegistration:"Copy registration details",registrationCopied:"Registration details copied.",shareUnavailable:"Sharing is not available here. Use Gmail, Mail or Copy.",gmailOpening:"Opening Gmail…",mailOpening:"Opening Mail…",sendOptions:"Registration sending options",sendOptionsSub:"Choose the method that works on your device.",copyFallback:"The details are ready. Paste them into an email addressed to:",closeOptions:"Close",directSendNote:"No message is sent automatically. Check the recipient and press Send.",detailedHistory:"Detailed exam history",examDetails:"Exam details",examDetailsSub:"Review every answer from this simulation",viewDetails:"View details",oldExamSummary:"This exam was completed before detailed history was introduced. Only the summary is available.",correctQuestions:"Correct questions",wrongQuestions:"Wrong questions",unansweredQuestions:"Unanswered questions",flaggedQuestions:"Flagged questions",selectedAnswer:"Selected answer",noAnswerSelected:"No answer selected",retryExamErrors:"Retry this exam’s mistakes",shareProgressReport:"Share progress report",copyProgressReport:"Copy progress report",progressReportCopied:"Progress report copied.",examReportCopied:"Exam report copied.",shareExamReport:"Share exam report",reportTitle:"Malta Driving Master progress report",registeredUser:"Registered user",notProvided:"Not provided",examNumber:"Exam",examResult:"Exam result",questionsReviewed:"Questions reviewed",statisticsCorrection:"Exam statistics corrected",statisticsCorrectionSub:"Each real-exam question is now counted only once.",backToProgress:"Back to progress",answerStatus:"Answer status",questionCode:"Question code",examNotFound:"Exam not found.",noMistakesInExam:"There are no mistakes to repeat in this exam.",reportPrepared:"Report prepared.",examDate:"Exam date",passRate:"Pass rate",helpSupport:"Help and support",helpSupportSub:"Install the app, learn the main functions and report a problem",installApp:"Install the app",installAppSub:"Add Malta Driving Master to your phone like a normal app",appInstalled:"App installed",appNotInstalled:"App not installed yet",installNow:"Install now",installIOS:"On iPhone: tap Share, choose Add to Home Screen, then tap Add.",installAndroid:"On Android: open the browser menu and choose Install app or Add to Home screen.",installDesktop:"Use the browser install icon or menu to install the app.",installUnavailable:"Automatic installation is not available here. Follow the instructions shown.",installationComplete:"Installation completed.",refreshApp:"Refresh app version",refreshingApp:"Checking for the latest version…",quickGuide:"Quick guide",quickGuideSub:"Open the main areas of the app",guideStudy:"Study with translations, audio and immediate correction",guideExam:"Try the 35-question realistic simulation",guideProgress:"Review results, mistakes and exam history",guideProfile:"Register, back up progress and change settings",frequentQuestions:"Frequently asked questions",faqBankQ:"Are the 250 questions the complete official Transport Malta bank?",faqBankA:"No. They are a selected preparation bank. Transport Malta does not publish the complete LPTV question bank.",faqOfflineQ:"Does the app work without internet?",faqOfflineA:"After opening it online and installing it, the main study content can work offline. External official links and sending email still need internet.",faqDataQ:"Where are my progress and personal details stored?",faqDataA:"They are saved on this device. Registration or support details reach the administrator only when you send the prepared message.",faqUpdateQ:"How do I receive a new version?",faqUpdateA:"Open this page and press Refresh app version after a new build has been published.",faqDeleteQ:"Can I delete my data?",faqDeleteA:"Yes. Personal details and study progress can be deleted separately from the Profile page.",reportProblem:"Report a problem",reportProblemSub:"Describe what happened. The message will be prepared for Malta Driving Master support.",supportCategory:"Type of report",supportTechnical:"Technical problem",supportQuestion:"Question or answer to check",supportRegistration:"Registration problem",supportSuggestion:"Suggestion",questionIdOptional:"Question code (optional)",problemDescription:"Description",problemPlaceholder:"Explain what happened and what you were doing…",descriptionRequired:"Write a description of at least 10 characters.",shareReport:"Share report",openSupportGmail:"Open Gmail",openSupportMail:"Open Mail",copySupportReport:"Copy report",supportCopied:"Support report copied.",supportPrepared:"Support report prepared.",contactSupport:"Support contact",version:"Version",privacySummary:"Privacy summary",privacySummaryText:"Study data and profile details remain on this device. Nothing is sent automatically.",openProfile:"Open profile",openStudy:"Open guided study",openExam:"Open Exam Centre",openProgress:"Open progress",standaloneMode:"Installed app mode",browserMode:"Browser mode",menuHelp:"Help",device:"Device",currentPage:"Current page",brandSlogan:"Prepare for the exam. Respect the road. Protect every passenger.",bridgeTest:"Bridge Test",bridgeTestSub:"Separates road-rule knowledge from English comprehension",bridgeIntro:"The same concepts are tested first in Italian and then in exam English. No correction is shown between the two phases.",bridgeQuestions:"Concepts to test",bridgeStart:"Start Bridge Test",bridgePhaseItalian:"Phase 1 of 2 — Understanding the rule in Italian",bridgePhaseEnglish:"Phase 2 of 2 — Understanding exam English",bridgeNoHelp:"Answer without help. The diagnostic appears only at the end.",bridgeTransition:"Italian phase completed. Now answer the same concepts in English.",bridgeResults:"Bridge Test result",knowledgeScore:"Road-rule knowledge",englishScore:"English comprehension",masteredConcepts:"Mastered in both languages",languageBarrier:"Language barrier",ruleGap:"Rule knowledge gap",recoveredEnglish:"Correct only in English",bridgeMeaning:"Your diagnostic",bridgeLanguageMeaning:"You knew the rule in Italian but missed it in English. Train the exam language.",bridgeRuleMeaning:"The rule was not clear even in Italian. Review the road concept first.",bridgeMasteredMeaning:"You understood both the rule and the English wording.",trainLanguageBarrier:"Train language barriers",trainRuleGaps:"Train rule gaps",repeatBridge:"Repeat Bridge Test",latestBridge:"Latest Bridge diagnostic",noBridgeYet:"No Bridge Test completed yet.",bridgeNotOfficial:"This is a learning diagnostic, not an official exam result.",italianPhase:"Italian phase",englishPhase:"English phase",confirmBridge:"Confirm and continue",bridgeCompleted:"Bridge Test completed.",errorDna:"Error DNA",errorDnaSub:"Discover why you make mistakes, not only which questions you miss",whyWrong:"What caused this mistake?",reasonRule:"I did not know the rule",reasonLanguage:"I did not understand the English question",reasonWord:"I did not know an important word",reasonMultiple:"I selected the wrong number of answers",reasonRush:"I read too quickly",reasonUnsure:"I was unsure and guessed",reasonSaved:"Cause saved",noErrorDna:"Choose a cause after a wrong answer and the app will build your personal error profile.",trainThisCause:"Train this cause",assistantOffline:"OFFLINE",assistantResults:"Relevant results",assistantStudyQuestion:"Study this question",assistantNoMatch:"I did not find a strong match. Try a shorter term such as roundabout, pedestrian, passenger, tunnel or brakes.",assistantTry:"Try asking",respectRoad:"Respect the road",protectPassengers:"Protect every passenger",assistantFound:n=>`${n} relevant result${n===1?'':'s'} found`,findSchool:"Find a driving school",findSchoolSub:"Compare services and discover the school that matches your needs",schoolPartner:"School Partner",schoolPartnerSub:"Present services, reach suitable students and manage qualified requests",schoolMarketplace:"Student school marketplace",schoolMarketplaceSub:"Smart Match compares your preferences with each school’s declared services.",schoolDemoNotice:"Demonstration area: these are fictional profiles used to test the platform. No real school is being advertised yet.",smartMatch:"Smart Match",smartMatchSub:"Paid visibility never changes the compatibility score.",matchScore:"match",yourPreferences:"Your preferences",preferredArea:"Preferred area",preferredLanguage:"Instructor language",courseNeeded:"Course needed",transmission:"Transmission",preferredSchedule:"Preferred schedule",supportNeeded:"Extra support",areaAll:"All Malta",areaNorth:"North",areaCentral:"Central",areaSouth:"South",areaGozo:"Gozo",languageAny:"Any language",courseLptv:"LPTV / TAG",courseB:"Category B",transmissionAny:"Automatic or manual",automatic:"Automatic",manual:"Manual",scheduleAny:"Any schedule",daytime:"Daytime",evening:"Evening",weekend:"Weekend",englishSupport:"Exam-English support",documentSupport:"Document and TAG guidance",updateMatches:"Update matches",schoolsFound:"profiles found",schoolDetails:"School details",compareSchools:"Compare schools",addToCompare:"Add to comparison",removeFromCompare:"Remove from comparison",compareLimit:"You can compare up to three schools.",comparisonEmpty:"Select schools from the directory to compare them.",servicesOffered:"Services offered",languagesSpoken:"Languages",coursesOffered:"Courses",availability:"Availability",pricingBySchool:"Prices entered by the school",pricingPending:"Prices will be supplied and maintained by the school.",requestInformation:"Request information",studentRequest:"Student information request",requestPrepared:"Request prepared.",pilotRequestNotice:"During the pilot, requests are sent to Malta Driving Master. Later they will go directly to the selected verified school.",profileNeededForRequest:"Complete your personal profile before requesting information.",demoProfile:"Demo profile",verifiedSchool:"Verified school",verificationPending:"Awaiting verification",sponsored:"Sponsored",sponsoredExplanation:"Sponsored services are clearly labelled and do not affect Smart Match.",whyMatched:"Why it matches",bridgeMatch:"Suitable for your English-learning needs",areaMatch:"Matches your preferred area",languageMatch:"Instructor language matches",scheduleMatch:"Schedule matches",serviceEnglish:"English support",serviceDocuments:"Document guidance",serviceBridge:"Bridge Test support",serviceProgress:"Student progress reports",serviceVulnerable:"Passenger-safety scenarios",servicePickup:"Collection service",schoolPlans:"School Partner plans",basicPlan:"Basic profile",basicPlanSub:"Free presence with verified identity and essential services",proPlan:"School Pro",proPlanSub:"Paid tools for services, availability, qualified requests and student groups",featuredPlan:"Sponsored services",featuredPlanSub:"Paid visibility, always clearly labelled and separate from Smart Match",commercialTerms:"Commercial terms to be defined before launch",partnerPrinciples:"Partner principles",partnerPrincipleVerify:"Schools are checked before public publication.",partnerPrincipleFair:"Payment never buys a higher compatibility score.",partnerPrincipleControl:"Students choose what progress information to share.",applySchoolPartner:"Apply as a School Partner",schoolName:"School name",permitReference:"Official permit or reference",schoolEmail:"School email",schoolPhone:"Telephone",schoolArea:"Operating area",schoolLanguages:"Languages offered",schoolServices:"Services to publish",schoolPrices:"Prices or payment information",schoolAvailability:"Availability and waiting times",schoolDescription:"What makes your school different?",choosePlan:"Interested plan",partnerConsent:"I confirm that the supplied information is accurate and may be reviewed before publication.",saveSchoolDraft:"Save school draft",sendPartnerApplication:"Send partner application",partnerDraftSaved:"School draft saved on this device.",partnerRequired:"Enter the school name, permit/reference, a valid email and accept the declaration.",partnerSendOptions:"Send application",noRealSchoolYet:"No real school has been approved inside this prototype.",studentArea:"Student area",schoolAreaTitle:"School area",smartMatchDiagnosis:"Your Bridge Test and preferences can improve the match.",paidServiceLabel:"Paid service",clearComparison:"Clear comparison",lptvPassport:"LPTV Passport",lptvPassportSub:"Your personal path from preparation to the Driver Permit Tag",passportOfficialUpdate:"Important official update",passportOfficialUpdateText:"From 29 July 2026, a new LPTV applicant must have held a valid Category B EU driving licence for at least two years and have no more than six penalty points.",passportChecked:"Official information checked",passportMode:"Application type",passportNew:"First application",passportRenewal:"Tag renewal",passportApplicantType:"Applicant category",passportMaltese:"Maltese citizen",passportEU:"Non-Maltese EU/EEA/Swiss citizen",passportTCN:"Third-country national",passportStatus:"Application status",passportPlanning:"Planning",passportCollecting:"Collecting documents",passportReady:"Ready to submit",passportSubmitted:"Application submitted",passportEligibilityLetter:"Eligibility letter / Identità step",passportWaiting:"Waiting for issue",passportIssued:"Tag issued",passportChecklist:"Personal checklist",passportChecklistSub:"Tick only documents you actually possess or steps you have completed.",passportCompleted:"completed",passportEligibility:"Eligibility check",passportLicenceSince:"Category B licence held since",passportPenaltyPoints:"Current penalty points",passportEligibleDate:"Two-year requirement reached on",passportLicenceTooNew:"The Category B licence has not yet been held for two years.",passportPointsBlocked:"More than six penalty points prevents a new application.",passportEligibilityUnknown:"Enter the licence date and penalty points to check eligibility.",passportBasicEligible:"The basic licence-duration and penalty-point conditions appear satisfied.",passportDates:"Expiry dates and validity",passportDatesSub:"The tag validity may be limited by the earliest expiry of applicable supporting documents.",passportDrivingExpiry:"Driving licence expiry",passportResidenceExpiry:"Residence document expiry",passportEmploymentExpiry:"Employment authorisation expiry",passportOperatorExpiry:"Operator licence expiry (self-employed or employer check)",passportTagExpiry:"Current/new TAG expiry",passportMedicalDate:"Medical certificate date",passportApplicationDate:"Application/submission date",passportEarliestExpiry:"Earliest entered supporting expiry",passportNoExpiry:"No expiry date entered",passportDaysRemaining:"days remaining",passportExpired:"expired",passportCalendar:"Create iPhone Calendar reminders",passportCalendarSub:"Creates an .ics file with reminders before entered expiry dates.",passportCalendarCreated:"Calendar reminder file created.",passportCalendarMissing:"Enter at least one expiry date first.",passportNotes:"Personal notes",passportSave:"Save Passport",passportSaved:"LPTV Passport saved on this device.",passportShare:"Share Passport report",passportCopy:"Copy Passport report",passportCopied:"Passport report copied.",passportReset:"Reset Passport",passportResetConfirm:"Delete the LPTV Passport checklist, dates and notes from this device?",passportResetDone:"LPTV Passport reset.",passportOfficialDocuments:"Official forms and guidance",passportOfficialWarning:"Always download the latest forms from Transport Malta before submitting. This checklist is guidance and does not replace an official eligibility decision.",passportSubmissionOffices:"Submission offices",passportSubmissionText:"Applications may be submitted in person at Transport Malta offices in Paola, Ħal Lija or Victoria, Gozo. Check current opening hours before travelling.",passportFeeNew:"First application: official page states €17.50. The July 2026 DPA13 form itemises €12 tag fee + €5.50 criminal record. An extra €10 may apply to update a Maltese licence with harmonised code 103.",passportFeeRenew:"Renewal fee: €12.",passportTagNotPermission:"An eligibility confirmation letter is not the Driver Permit Tag and does not authorise driving until the tag is formally issued.",passportValidityRule:"The permit validity cannot exceed the earliest relevant expiry among the driving licence, residence documentation, employment authorisation and, where applicable, operator licence.",passportDocId:"Valid ID card / residence documentation",passportDocLicence:"Valid Category B EU licence or licence exchanged under Maltese rules",passportDocTwoYears:"Category B licence held for at least two years",passportDocPoints:"No more than six penalty points",passportDocCourse:"LPTV Customer Care Course Certificate",passportDocDPA13:"Completed DPA13 first-application form",passportDocDPA14:"Completed DPA14 renewal form",passportDocMedical:"DRV032 medical certificate",passportDocCriminalLocal:"Local criminal-record requirement",passportDocCriminalForeign:"Foreign criminal record, where applicable",passportDocPoliceConduct:"Local Police Conduct Certificate",passportDocPhoto:"Passport photo if the driving licence was issued by another EU Member State",passportDocFeeNew:"First-application fees prepared",passportDocFeeRenew:"Renewal fee prepared",passportDocJobsplus:"JobsPlus documentation showing the required Cab Driver role",passportDocDPA16:"DPA16 Employer Declaration or valid LPTS operator licence if self-employed",passportDocOperator15:"Operator licence remains valid for more than 15 calendar days from application",passportDocSinglePermit:"Residence/work documentation reflects employer and Cab Driver designation, where applicable",passportDocSignatory:"Copy of authorised signatory ID attached where required",passportDocBluePaper:"For renewal only: interim 'blue paper' accepted only in limited cases with no disallowed employer/designation change",passportDocCopyLicence:"Copy of driving licence",passportGeneral:"General requirements",passportTCNExtra:"Additional TCN requirements",passportSubmission:"Submission and fee",passportOpen:"Open official document",passportDPA13:"DPA13 — first application",passportDPA14:"DPA14 — renewal",passportDPA16:"DPA16 — employer declaration",passportDRV032:"DRV032 — medical certificate",passportSOPT01:"SOPT 01 — first applications",passportSOPT02:"SOPT 02 — renewals",passportOperatorGuide:"LPTV Operator Guide",passportMainPage:"Official LPTV Driver Tag page",passportTraining:"Approved training and tests",passportDownloads:"Transport Malta downloads",passportContact:"Transport Malta contact/opening hours",passportCurrentProgress:"Passport readiness",passportRequiredComplete:"required items complete",passportAttention:"Attention required",passportGood:"On track",passportNoBackend:"Data and checklist remain on this device and are included in the local backup.",passportOpenDirect:"Open directly",passportShareOfficial:"Share / open in Safari",passportOfficialCopied:"Official link copied.",passportOfficialShareText:"Official Transport Malta document",passportCalendarShared:"Calendar file sent to the iPhone share menu.",passportCalendarCopiedFallback:"This browser cannot export the calendar file. The reminder list has been copied.",passportCalendarOpenSafariNote:"In Koder use Share and choose Save to Files. In the published Safari version the .ics file can also be downloaded.",passportKoderFix:"Koder-compatible controls",personalRoadmap:"Personal Roadmap",personalRoadmapSub:"One clear route from today’s study to the exam and Driver Permit Tag",roadmapInternalEstimate:"Internal preparation estimate — not an official eligibility decision",roadmapJourneyScore:"Journey score",roadmapNextAction:"Your next best action",roadmapDoNow:"Do it now",roadmapWhy:"Why this comes next",roadmapToday:"Today",roadmapWeek:"Your next 7 steps",roadmapWeekSub:"A balanced sequence generated from your real progress",roadmapSettings:"Plan settings",roadmapTargetDate:"Target date",roadmapDailyMinutes:"Minutes per study day",roadmapStudyDays:"Study days per week",roadmapMainGoal:"Main goal",roadmapGoalExam:"Pass the theory test",roadmapGoalTag:"Obtain the Driver Permit Tag",roadmapSavePlan:"Save plan",roadmapPlanSaved:"Personal Roadmap saved.",roadmapNoTarget:"No target date entered",roadmapDaysToTarget:"days to target",roadmapTargetToday:"Target date is today",roadmapTargetPassed:"Target date has passed",roadmapStudyScore:"Exam preparation",roadmapEnglishScore:"English / Bridge",roadmapPassportScore:"Documents / Passport",roadmapDailyScore:"Today’s habit",roadmapCoverage:"Question coverage",roadmapAccuracy:"Answer accuracy",roadmapExamAverage:"Recent exam average",roadmapPassportProgress:"Passport progress",roadmapBridgeProgress:"Latest Bridge result",roadmapWeakestTopic:"Topic needing most attention",roadmapAchievements:"Milestones achieved",roadmapAchievementsSub:"Progress that already belongs to you",roadmapLocked:"Not reached yet",roadmapShare:"Share Roadmap report",roadmapCopy:"Copy Roadmap report",roadmapCopied:"Roadmap report copied.",roadmapActionProfile:"Complete your personal profile",roadmapReasonProfile:"Your name and contact details are needed for reports and school requests.",roadmapActionDaily:"Complete today’s study plan",roadmapReasonDaily:"A short daily session is the fastest way to build stable recall.",roadmapActionReview:"Review questions due today",roadmapReasonReview:"Scheduled repetition prevents previously learned rules from fading.",roadmapActionBridge:"Take a Bridge Test",roadmapReasonBridge:"The app needs to separate rule knowledge from English difficulty.",roadmapActionEnglish:"Train the English barrier",roadmapReasonEnglish:"Your latest Bridge Test shows that English is reducing your score.",roadmapActionCoverage:"Continue guided study",roadmapReasonCoverage:"Too many questions have not yet been practised.",roadmapActionAccuracy:"Attack your weakest topic",roadmapReasonAccuracy:"Accuracy must become stable before relying on full simulations.",roadmapActionExam:"Run a complete exam simulation",roadmapReasonExam:"A 35-question simulation is needed to measure real exam readiness.",roadmapActionPassport:"Continue the LPTV Passport",roadmapReasonPassport:"Your study journey and document journey should progress together.",roadmapActionSchool:"Compare suitable driving schools",roadmapReasonSchool:"Your preparation data can now help you choose the right support.",roadmapActionReady:"Protect your exam readiness",roadmapReasonReady:"You are on track: use review and simulations to keep the result stable.",roadmapStepDaily:"Daily adaptive study",roadmapStepWeak:"Weak-topic attack",roadmapStepBridge:"English Bridge session",roadmapStepReview:"Scheduled review",roadmapStepExam:"Full exam simulation",roadmapStepPassport:"Passport and documents",roadmapStepReflect:"Progress check and recovery",roadmapAchievementProfile:"Personal profile complete",roadmapAchievement25:"First 25 questions studied",roadmapAchievement100:"100 different questions covered",roadmapAchievementExam:"First full simulation completed",roadmapAchievementPass:"Simulation passed at 30/35 or better",roadmapAchievementBridge:"Bridge mastery reached 80%",roadmapAchievementStreak:"Seven-day study streak",roadmapAchievementPassport:"Passport checklist complete",roadmapPace:"Estimated study pace",roadmapPaceText:"At your chosen pace, the remaining unseen questions require about",roadmapSessions:"study sessions",roadmapQuestionsLeft:"unseen questions",roadmapRecommended:"Recommended",roadmapOverallGood:"Strong overall progress",roadmapOverallGrowing:"Progress is growing",roadmapOverallStart:"Build the foundations",roadmapReset:"Reset plan settings",roadmapResetConfirm:"Reset only the Roadmap target and study settings? Study progress and Passport data will not be deleted.",roadmapResetDone:"Roadmap settings reset.",roadmapCurrentProgress:"Current progress",schoolDashboard:"School Partner Dashboard",schoolDashboardSub:"Manage a local prototype of students, groups, invitations and reports",schoolDashboardLocal:"Local prototype",schoolDashboardNotice:"This dashboard works only on this device. It does not create real school accounts, send invitations to students or synchronise private student data online.",openDashboard:"Open School Dashboard",dashboardProfile:"School profile",dashboardProfileCompletion:"Profile completion",dashboardReadyReview:"Ready to request review",dashboardDraftStatus:"Draft still incomplete",dashboardEditProfile:"Edit school profile",dashboardPublicPreview:"Public profile preview",dashboardPublicPreviewSub:"This is how the declared school information may appear after verification.",dashboardNoSchoolName:"Unnamed school draft",dashboardPermitHidden:"Permit/reference supplied for review",dashboardStudents:"Students",dashboardGroups:"Groups",dashboardInvites:"Invitation codes",dashboardAverage:"Average manual progress",dashboardNoStudents:"No students have been added.",dashboardNoGroups:"No groups have been created.",dashboardNoInvites:"No invitation codes have been generated.",dashboardManualData:"Progress values are entered manually and are not synchronised with a student’s app.",dashboardAddStudent:"Add student",dashboardStudentName:"Student name",dashboardStudentEmail:"Student email",dashboardStudentCourse:"Course",dashboardStudentGroup:"Group",dashboardStudentProgress:"Preparation %",dashboardStudentBridge:"Bridge %",dashboardStudentPassport:"Passport %",dashboardStudentStatus:"Status",dashboardStudentNotes:"Student notes",dashboardStatusActive:"Active",dashboardStatusPaused:"Paused",dashboardStatusReady:"Ready for exam",dashboardStatusCompleted:"Completed",dashboardNoGroup:"No group",dashboardSaveStudent:"Save student",dashboardUpdateStudent:"Update",dashboardRemoveStudent:"Remove",dashboardStudentRequired:"Enter a student name and a valid email address.",dashboardStudentSaved:"Student saved locally.",dashboardStudentRemoved:"Student removed.",dashboardRemoveStudentConfirm:"Remove this student from the local dashboard?",dashboardAddGroup:"Create group",dashboardGroupName:"Group name",dashboardGroupLanguage:"Teaching language",dashboardGroupSchedule:"Schedule",dashboardGroupNotes:"Group notes",dashboardSaveGroup:"Save group",dashboardGroupRequired:"Enter a group name.",dashboardGroupSaved:"Group saved locally.",dashboardRemoveGroup:"Remove group",dashboardRemoveGroupConfirm:"Remove this group? Students will remain but will no longer belong to it.",dashboardGroupRemoved:"Group removed.",dashboardMembers:"members",dashboardGenerateInvite:"Generate invitation code",dashboardInviteGroup:"Invite for group",dashboardCreateInvite:"Create code",dashboardInviteCreated:"Demonstration invitation code created.",dashboardInviteWarning:"Invitation codes are demonstrative until secure accounts and a backend are connected.",dashboardShareInvite:"Share invitation",dashboardCopyInvite:"Copy code",dashboardRemoveInvite:"Delete code",dashboardInviteText:"Malta Driving Master school invitation",dashboardInviteCopied:"Invitation copied.",dashboardReports:"School reports",dashboardReportsSub:"Create a summary from the local dashboard data.",dashboardShareReport:"Share school report",dashboardCopyReport:"Copy school report",dashboardExportCsv:"Export students CSV",dashboardReportCopied:"School report copied.",dashboardCsvShared:"Student CSV sent to the Share menu.",dashboardCsvCopied:"CSV content copied because file sharing is unavailable.",dashboardDemoData:"Load demonstration data",dashboardDemoDataSub:"Adds clearly labelled fictitious students and groups to test the dashboard.",dashboardLoadDemo:"Load demo",dashboardDemoConfirm:"Add fictitious demonstration students and groups? Existing local data will remain.",dashboardDemoLoaded:"Demonstration data loaded.",dashboardDemoBadge:"Demo",dashboardClear:"Clear dashboard data",dashboardClearConfirm:"Delete all local students, groups and invitation codes? The school application draft will remain.",dashboardCleared:"Local dashboard data cleared.",dashboardSchoolNotes:"Internal school notes",dashboardSaveNotes:"Save notes",dashboardNotesSaved:"School notes saved locally.",dashboardVerification:"Verification status",dashboardNotVerified:"Not verified",dashboardReviewNeeded:"Review required before any public publication",dashboardPrivacy:"Student privacy",dashboardPrivacyText:"Do not enter sensitive medical, identification or criminal-record information in this local prototype.",dashboardPlan:"Selected plan",dashboardCreated:"Created",dashboardLastUpdated:"Last updated",dashboardStudentCount:"student count",dashboardGroupCount:"group count",onboardingWelcome:"Welcome to Malta Driving Master",onboardingWelcomeSub:"Prepare for the exam, respect the road and protect every passenger.",onboardingChooseRole:"How will you use the platform?",onboardingStudent:"Student",onboardingStudentSub:"Study, Bridge Test, Passport, Roadmap and school comparison",onboardingSchool:"Driving school",onboardingSchoolSub:"School profile, local dashboard, students, groups and reports",onboardingBoth:"Both",onboardingBothSub:"Use the student and School Partner areas",onboardingDataTitle:"Your data stays under your control",onboardingDataText:"This version stores progress and drafts locally on this device. Data is not automatically sent to Malta Driving Master, a school or another student.",onboardingRequiredStorage:"I understand that essential local storage is used to save progress, settings and drafts on this device.",onboardingTerms:"I have read and accept the app information, limitations and responsible-use notice.",onboardingUpdates:"I would like to receive important app updates when I voluntarily send my registration email.",onboardingContinue:"Enter Malta Driving Master",onboardingRequired:"Choose a role and accept the two required acknowledgements.",onboardingLocalOnly:"Local-first prototype",onboardingNoTracking:"No advertising tracking is enabled",onboardingOfficialWarning:"The app supports preparation and organisation. It does not replace Transport Malta, an authorised school, a doctor or an official eligibility decision.",privacyCenter:"Privacy & Data Centre",privacyCenterSub:"See what is stored, export it and delete only what you choose",privacyOverview:"Data overview",privacyStoredLocally:"Stored locally on this device",privacySentOnlyByAction:"Sent only when you deliberately use Share, Gmail or Mail",privacyNoAutomaticUpload:"No automatic upload in this GitHub Pages version",privacyProfileData:"Personal profile",privacyStudyData:"Study progress",privacyPassportData:"LPTV Passport",privacyRoadmapData:"Personal Roadmap",privacySchoolData:"School and dashboard data",privacyPreferencesData:"Privacy preferences",privacyPresent:"Present",privacyEmpty:"Empty",privacyItems:"items",privacyExportTitle:"Export your data",privacyExportText:"Create a machine-readable JSON backup containing the local data selected by the app.",privacyExportAll:"Export all local data",privacyDeleteTitle:"Selective deletion",privacyDeleteText:"Delete one area without affecting the others.",privacyDeleteStudy:"Delete study progress",privacyDeleteProfile:"Delete personal profile",privacyDeletePassport:"Delete Passport",privacyDeleteRoadmap:"Delete Roadmap settings",privacyDeleteSchool:"Delete school data",privacyDeleteAll:"Delete all Malta Driving Master data",privacyDeleteStudyConfirm:"Delete answers, exams, favourites, review history and Bridge results?",privacyDeleteProfileConfirm:"Delete the personal profile saved on this device?",privacyDeletePassportConfirm:"Delete the Passport checklist, dates and notes?",privacyDeleteRoadmapConfirm:"Delete only the Roadmap settings?",privacyDeleteSchoolConfirm:"Delete school preferences, comparison, application draft and dashboard data?",privacyDeleteAllConfirm:"Permanently delete all Malta Driving Master data from this device, including progress, profile, Passport and school data?",privacyDeleted:"Selected local data deleted.",privacyAllDeleted:"All local Malta Driving Master data deleted.",privacyRequestTitle:"Data request already sent outside the device",privacyRequestText:"If you previously emailed a registration or support request, you can prepare a message asking Malta Driving Master to access, correct or erase that information.",privacyRequestAccess:"Request access",privacyRequestCorrection:"Request correction",privacyRequestErasure:"Request erasure",privacyRequestPrepared:"Privacy request prepared.",privacyRightsNotice:"EU data-protection rights may include information, access, correction, erasure and portability. Identity verification may be required for requests.",privacyConsentSettings:"Optional preferences",privacyAnalytics:"Allow future anonymous usage analytics",privacyMarketing:"Allow future promotional communications",privacyNotActive:"These optional functions are not active in the current local version.",privacySavePreferences:"Save preferences",privacyPreferencesSaved:"Privacy preferences saved.",privacyChecked:"Privacy information checked",privacyOpenCenter:"Open Privacy & Data Centre",privacyRole:"Selected platform role",privacyChangeRole:"Change role",privacyRestartOnboarding:"Show introduction again",privacyStorageNecessary:"Essential local storage",privacyStorageExplanation:"Used to remember progress and settings requested by the user. Clearing browser/app storage removes these records.",privacyContactController:"Privacy contact",privacyLegalDraft:"This is an in-app transparency summary, not a substitute for a final lawyer-reviewed privacy policy before commercial launch.",privacyDataCount:"Local data summary",privacyProfileComplete:"profile fields",privacyStudyRecords:"study records",privacyPassportChecks:"Passport checks",privacySchoolRecords:"school records",premiumTagline:"Drive with knowledge. Respect every road. Protect every passenger.",premiumEnter:"Enter Malta Driving Master",premiumLoading:"Preparing your journey",premiumSkip:"Skip",premiumTrust:"Built for safer roads and better-prepared drivers",premiumWelcomeBack:"Welcome back",premiumContinue:"Continue your journey",premiumTodayFocus:"Today’s focus",premiumNoDelay:"The intro lasts only a few seconds and can always be skipped.",premiumReplay:"Replay premium intro",mdmCoach:"MDM Coach",mdmCoachSub:"Your intelligent offline training guide",coachFoundation:"AI foundation",coachOffline:"Offline intelligence",coachOfflineText:"MDM Coach analyses only the progress stored on this device. It is not a live online AI and does not send data automatically.",confidenceScore:"Confidence Score",confidenceMeaning:"Estimated exam readiness",confidenceLow:"Build the foundations",confidenceMedium:"Progress is becoming stable",confidenceHigh:"Strong preparation",confidenceExcellent:"Exam-ready pattern detected",predictionToday:"Estimated chance today",predictionWeek:"Estimated chance in 7 days",predictionDisclaimer:"Statistical guidance only. It is not a guarantee and not an official assessment.",coachInsight:"Coach insight",coachNextMove:"Best next move",coachImprovement:"Recent improvement",coachNoData:"Complete more study activity to unlock a more reliable estimate.",coachWeakness:"Main weakness",coachStrength:"Main strength",coachTrendUp:"Your recent results are improving.",coachTrendStable:"Your recent results are stable.",coachTrendDown:"Your recent results need attention.",dailyMission:"Daily Mission",dailyMissionSub:"A short mission generated from your real progress",missionStudy:"Complete a focused study block",missionReview:"Review due or wrong questions",missionBridge:"Complete an English Bridge action",missionComplete:"Mission complete",missionCompletedText:"Today’s mission has been completed.",missionMarkDone:"Mark as done",missionReset:"Reset today’s mission",missionProgress:"Mission progress",coachAchievements:"Coach achievements",coachAchievementsSub:"Useful milestones, not decorative points",achievementFirst25:"First 25 questions",achievementFirst100:"100 questions covered",achievementExamPass:"Exam simulation passed",achievementBridge:"Bridge Champion",achievementSafety:"Safety Expert",achievementPassenger:"Passenger Care Master",achievementConsistency:"Seven-day consistency",achievementPassport:"Passport complete",achievementLocked:"Locked",investorPreview:"Investor Preview",investorPreviewSub:"A guided summary of the platform’s value",investorProblem:"Problem",investorProblemText:"Many capable candidates fail because they do not fully understand the English used in the exam and because preparation tools do not diagnose the real cause of errors.",investorSolution:"Solution",investorSolutionText:"Malta Driving Master combines exam preparation, language diagnosis, document guidance, school matching and professional school tools in one platform.",investorStudentValue:"Student value",investorSchoolValue:"School value",investorStudentPoints:"Bridge Test, personalised Roadmap, Passport, guided study, simulations and progress reports",investorSchoolPoints:"Profiles, student groups, local dashboard, qualified requests, reports and future subscription tools",investorDifferentiator:"Core differentiator",investorDifferentiatorText:"The platform distinguishes lack of knowledge from language difficulty and guides the candidate from study to the Driver Permit Tag.",investorScale:"Scalability",investorScaleText:"The same framework can expand to more languages, licence categories, schools and professional-driver markets.",investorStatus:"Current prototype status",investorStatusText:"Working offline PWA with 250 active questions, Student area, School Partner area, Privacy Centre, Roadmap, Passport and MDM Coach foundation.",investorArchitecture:"Architecture",investorArchitectureText:"Current version: HTML, CSS and JavaScript on GitHub Pages. Commercial launch: secure backend, authentication, database, payments and protected AI connection.",investorOpen:"Open Investor Preview",investorShare:"Share investor summary",investorCopy:"Copy investor summary",investorCopied:"Investor summary copied.",investorMetrics:"Prototype metrics",investorActiveQuestions:"Active questions",investorCoreModules:"Core modules",investorLanguages:"Languages",investorUserTypes:"User types",coachOpen:"Open MDM Coach",coachUpdated:"Coach updated",coachDataPoints:"data points analysed",coachScoreComponents:"Score components",coachAccuracy:"Accuracy",coachCoverage:"Coverage",coachExam:"Exam simulations",coachBridge:"Bridge result",coachConsistency:"Consistency",coachReview:"Review discipline",coachExplain:"How this estimate is calculated",coachExplainText:"The score combines answer accuracy, question coverage, exam performance, Bridge result, consistency and review behaviour.",coachReset:"Reset coach mission",coachResetConfirm:"Reset only today’s mission status? Study progress will not be deleted.",coachResetDone:"Today’s mission was reset.",coachRecovery:"Coach Explain & Recovery",coachRecoverySub:"Understand why you miss questions and follow a targeted recovery plan",recoveryOffline:"Personalised offline analysis",recoveryOfflineText:"The diagnosis uses your saved answers and self-reported error causes. It does not invent personal data or contact an external AI.",recoveryDiagnosis:"Error diagnosis",recoveryDominantCause:"Most frequent cause",recoveryRecordedErrors:"Recorded causes",recoveryNoReasons:"No error cause has been recorded yet. During guided study, answer why you got a question wrong.",recoveryReasonRule:"Rule knowledge",recoveryReasonLanguage:"English sentence",recoveryReasonWord:"Unknown word",recoveryReasonMultiple:"Multiple-answer selection",recoveryReasonRush:"Answered too quickly",recoveryReasonUnsure:"Low confidence",recoveryPrescription:"Coach prescription",recoveryRuleAdvice:"Study the rule first, then answer five questions from the same topic without using the translation.",recoveryLanguageAdvice:"Use Bridge Test and Sentence Coach before repeating the same questions in English.",recoveryWordAdvice:"Review the key words and phrasebook, then listen slowly before retrying.",recoveryMultipleAdvice:"Read the instruction twice and count how many answers must be selected before choosing.",recoveryRushAdvice:"Pause for three seconds, identify the hazard or legal duty, and only then select an answer.",recoveryUnsureAdvice:"Explain the rule aloud before answering. Confidence should come from the rule, not guessing.",recoveryGeneralAdvice:"Continue guided study and record the reason after every mistake so the plan becomes more accurate.",recoveryPriorityQuestions:"Priority recovery questions",recoveryPrioritySub:"Questions selected from mistakes, repeated causes and weak topics",recoveryStartQuestion:"Study this question",recoveryMarkResolved:"Mark resolved",recoveryResolved:"Resolved",recoveryNoQuestions:"No priority recovery question is available yet.",recoveryResetResolved:"Reset resolved questions",recoveryResetConfirm:"Reset the resolved status of recovery questions?",recoveryResetDone:"Resolved recovery questions reset.",coachDialogue:"Ask MDM Coach",coachDialogueSub:"Choose a question to receive a transparent data-based answer",coachAskWhy:"Why am I still making mistakes?",coachAskEnglish:"Is English my main problem?",coachAskReady:"Am I ready for the real exam?",coachAskNext:"What should I do now?",coachAnswerWhy:"Your current pattern shows",coachAnswerEnglishHigh:"English appears to be a significant barrier. Bridge practice should come before more full simulations.",coachAnswerEnglishLow:"English is not currently the strongest barrier. Focus more on rules and weak topics.",coachAnswerReadyHigh:"Your data shows a strong readiness pattern, but maintain it with scheduled review and realistic simulations.",coachAnswerReadyMedium:"You are progressing, but your results are not stable enough yet for a confident exam recommendation.",coachAnswerReadyLow:"More guided study and coverage are needed before relying on full exam simulations.",coachAnswerNext:"Your best next action is",recoveryPlan:"Three-step recovery plan",recoveryStepUnderstand:"Understand",recoveryStepPractise:"Practise",recoveryStepVerify:"Verify",recoveryUnderstandText:"Read the explanation and identify the exact rule or English phrase that caused the error.",recoveryPractiseText:"Complete a short focused session using the selected recovery questions.",recoveryVerifyText:"Repeat the questions later without translation and confirm the result in a simulation.",recoveryScore:"Recovery progress",recoveryOpen:"Open Recovery Coach",recoveryReport:"Share recovery report",recoveryCopy:"Copy recovery report",recoveryCopied:"Recovery report copied.",recoveryDataNeeded:"More data needed",recoveryResolvedCount:"questions resolved",examDayMode:"Exam Day Mode",examDayModeSub:"Final preparation for the real theory-test day",examDayInternal:"Internal preparation tool",examDayInternalText:"This mode does not replace official instructions, identification requirements or Transport Malta decisions.",examTargetDate:"Exam target date",examDaysRemaining:"days remaining",examDateToday:"Exam target is today",examDatePassed:"Target date has passed",examNoDate:"No exam date entered",finalReadiness:"Final Readiness",finalReady:"Strong readiness pattern",finalAlmost:"Almost ready",finalNotReady:"More preparation recommended",finalReadinessText:"Based on Confidence Score, recent simulations, Bridge result, review discipline and today’s checklist.",examDayChecklist:"Exam-day checklist",examDayChecklistSub:"Tick only what is genuinely prepared",examItemId:"Valid identification prepared",examItemBooking:"Booking details and location confirmed",examItemTime:"Arrival time planned with a safety margin",examItemRest:"Sleep and rest plan prepared",examItemTravel:"Travel route and transport confirmed",examItemLanguage:"English instructions reviewed",examItemMultiple:"Multiple-answer rules reviewed",examItemEmergency:"Emergency and safety topics reviewed",examItemCalm:"Calm-answer routine understood",examChecklistProgress:"Checklist progress",examBreathing:"60-second calm routine",examBreathingSub:"A short guided breathing exercise before study or the exam",examBreathingStart:"Start calm routine",examBreathingIn:"Breathe in",examBreathingHold:"Hold",examBreathingOut:"Breathe out",examBreathingDone:"Calm routine completed",examFinalSimulation:"Final simulation",examFinalSimulationSub:"Run a realistic 35-question simulation before considering yourself ready",examStartFinal:"Start final simulation",examLastFinalScore:"Last final score",examNoFinalScore:"No final simulation recorded",examQuickReview:"Final quick review",examQuickReviewSub:"The highest-risk areas to revise shortly before the exam",examReviewSafety:"Safety and emergencies",examReviewPassengers:"Passenger care",examReviewRoad:"Road procedure",examReviewEco:"Eco-safe driving",examReviewEnglish:"English traps",examOpenTopic:"Open review",examCertificate:"Internal readiness certificate",examCertificateSub:"A private report proving that the app’s final preparation requirements were met",examCertificateIssue:"Create readiness certificate",examCertificateLocked:"Complete the checklist and achieve a final simulation score of at least 30/35.",examCertificateReady:"Certificate available",examCertificateShare:"Share certificate",examCertificateCopy:"Copy certificate",examCertificateCopied:"Readiness certificate copied.",examCertificateDisclaimer:"This is not an official certificate and has no legal or regulatory value.",examReset:"Reset Exam Day Mode",examResetConfirm:"Reset the exam target, checklist and internal certificate? Study progress will not be deleted.",examResetDone:"Exam Day Mode reset.",examSave:"Save Exam Day",examSaved:"Exam Day settings saved.",examConfidence:"Confidence Score",examBridge:"Bridge",examRecent:"Recent simulation",examChecklist:"Checklist",examCalm:"Calm routine",examFinalStatus:"Final status",examReadyMessage:"Your data shows a strong pattern, but keep reviewing and follow all official instructions.",examAlmostMessage:"You are close. Complete the missing checklist items and run another final simulation.",examNotReadyMessage:"Focus on weak topics, English barriers and realistic simulations before booking or attending.",examRiskAlert:"Main risk before the exam",examNoRisk:"No major risk detected from current data",examRiskEnglish:"English comprehension may still reduce your score",examRiskAccuracy:"Answer accuracy is not yet stable",examRiskCoverage:"Too many questions remain unseen",examRiskSimulation:"Recent simulation performance is below the target",examRiskChecklist:"Practical exam-day preparation is incomplete",zeroErrorMode:"Zero Error Mode",zeroErrorSub:"Find and defeat the questions most likely to cost you the exam",zeroErrorInternal:"Personal risk analysis",zeroErrorInternalText:"The risk score uses only your saved attempts, mistakes, review status, error causes and weak topics. It is guidance, not a guarantee.",zeroErrorIndex:"Zero Error Index",zeroErrorRed:"Red — critical weaknesses remain",zeroErrorYellow:"Yellow — progress, but hidden risks remain",zeroErrorGreen:"Green — critical errors are under control",zeroErrorTraffic:"Readiness traffic light",zeroErrorCritical:"Critical questions",zeroErrorDefeated:"Errors defeated",zeroErrorUnseen:"Unseen high-risk questions",zeroErrorRisk:"Risk score",zeroErrorWhy:"Why this is critical",zeroErrorRepeated:"Repeated mistakes",zeroErrorLowRate:"Low answer accuracy",zeroErrorDue:"Review is due",zeroErrorWeakTopic:"Belongs to your weakest topic",zeroErrorCause:"Repeated error cause recorded",zeroErrorNeverCorrect:"Never answered correctly",zeroErrorToday:"Top 10 to repeat today",zeroErrorTomorrow:"Top 5 to repeat tomorrow",zeroErrorTop20:"Top 20 critical errors",zeroErrorTop20Sub:"Ranked by the evidence currently stored in the app",zeroErrorStudy:"Eliminate this error",zeroErrorVerify:"Verify mastery",zeroErrorMarkDefeated:"Mark as defeated",zeroErrorUndoDefeated:"Return to critical list",zeroErrorDefeatedTitle:"Defeated errors",zeroErrorDefeatedSub:"Questions you have moved out of the critical list",zeroErrorNoCritical:"No critical question is available yet. Complete more guided study and simulations.",zeroErrorNoDefeated:"No error has been defeated yet.",zeroErrorPlan:"Automatic recovery plan",zeroErrorPlanSub:"Today, tomorrow and verification",zeroErrorTodayText:"Work on the ten highest-risk unresolved questions.",zeroErrorTomorrowText:"Repeat five questions after a delay to test memory.",zeroErrorVerifyText:"Confirm mastery in English without translation and then in a full simulation.",zeroErrorProgress:"Critical-error control",zeroErrorResolved:"Defeated",zeroErrorVerified:"Verified",zeroErrorNeedsVerify:"Needs verification",zeroErrorReset:"Reset defeated errors",zeroErrorResetConfirm:"Return all defeated questions to the critical analysis? Study progress will not be deleted.",zeroErrorResetDone:"Defeated-error status reset.",zeroErrorReport:"Share Zero Error report",zeroErrorCopy:"Copy Zero Error report",zeroErrorCopied:"Zero Error report copied.",zeroErrorScoreMeaning:"Higher index means fewer unresolved critical risks.",zeroErrorDataNeeded:"More study data is needed for a reliable ranking.",zeroErrorOpen:"Open Zero Error Mode",zeroErrorQuestionCount:"questions currently analysed",zeroErrorStartToday:"Start today’s Top 10",zeroErrorStartTomorrow:"Start tomorrow’s Top 5",zeroErrorStartCritical:"Start critical session",schoolPortal2:"School Partner 2.0",schoolPortal2Sub:"Build a richer school profile and manage local commercial tools",schoolPortalNotice:"Local commercial prototype",schoolPortalNoticeText:"Profiles, bookings, reviews and requests remain on this device until a secure backend and verified accounts are added.",schoolPublicProfile:"Public school profile",schoolHeadline:"Headline",schoolWebsite:"Website",schoolWhatsapp:"WhatsApp",schoolLogoText:"Logo initials",schoolSavePublic:"Save public profile",schoolPublicSaved:"Public profile saved.",schoolVerifiedStatus:"Verification status",schoolVerified:"Verified",schoolUnverified:"Not verified",schoolInstructors:"Instructors",schoolInstructorName:"Instructor name",schoolInstructorLanguages:"Languages",schoolInstructorSpeciality:"Speciality",schoolInstructorBio:"Short biography",schoolAddInstructor:"Add instructor",schoolInstructorSaved:"Instructor saved.",schoolRemoveInstructor:"Remove instructor",schoolCourses:"Courses",schoolCourseTitle:"Course title",schoolCourseCategory:"Category",schoolCoursePrice:"Price",schoolCourseDuration:"Duration",schoolCourseFormat:"Format",schoolCourseDescription:"Course description",schoolAddCourse:"Add course",schoolCourseSaved:"Course saved.",schoolOffers:"Offers",schoolOfferTitle:"Offer title",schoolOfferDiscount:"Discount / benefit",schoolOfferExpiry:"Expiry date",schoolOfferDescription:"Offer description",schoolAddOffer:"Add offer",schoolOfferSaved:"Offer saved.",schoolReviews:"Reviews",schoolReviewName:"Reviewer name",schoolReviewRating:"Rating",schoolReviewText:"Review text",schoolAddReview:"Add demo review",schoolReviewDemo:"Demonstration review",schoolReviewSaved:"Review saved as demo.",schoolRequests:"Student requests",schoolRequestName:"Student name",schoolRequestEmail:"Student email",schoolRequestService:"Requested service",schoolRequestMessage:"Message",schoolAddRequest:"Add request",schoolRequestStatus:"Status",schoolRequestNew:"New",schoolRequestContacted:"Contacted",schoolRequestClosed:"Closed",schoolRequestSaved:"Student request saved locally.",schoolBookings:"Lesson bookings",schoolBookingStudent:"Student",schoolBookingCourse:"Course",schoolBookingDate:"Date",schoolBookingTime:"Time",schoolBookingNotes:"Booking notes",schoolAddBooking:"Add booking",schoolBookingSaved:"Booking saved locally.",schoolPortalMetrics:"Portal metrics",schoolPublishedContent:"Published content",schoolCommercialTools:"Commercial tools",schoolPortalPreview:"Student-facing preview",schoolPortalPreviewSub:"A preview of how the school could appear after verification",schoolPortalShare:"Share school profile",schoolPortalCopy:"Copy school profile",schoolPortalCopied:"School profile copied.",schoolPortalDemo:"Load portal demo",schoolPortalDemoText:"Adds fictitious instructors, courses, offers, reviews, requests and bookings.",schoolPortalDemoLoaded:"Portal demo loaded.",schoolPortalClear:"Clear School Partner 2.0 data",schoolPortalClearConfirm:"Delete instructors, courses, offers, reviews, requests and bookings from this device?",schoolPortalCleared:"School Partner 2.0 data cleared.",schoolPortalRequired:"Complete the required fields.",schoolRemove:"Remove",schoolStatusUpdate:"Update status",schoolNoItems:"No items added yet",schoolPriceFrom:"From",schoolBookNow:"Book now",schoolRequestInfo:"Request information",schoolContactSchool:"Contact school",schoolPortalOpen:"Open School Partner 2.0",instructorPortal:"Instructor Portal",instructorPortalSub:"Follow students, assign targeted work and create individual reports",instructorLocal:"Local instructor prototype",instructorLocalText:"Assignments, notes and student data stay on this device. They are not synchronised with real student accounts.",instructorProfile:"Instructor profile",instructorName:"Instructor name",instructorEmail:"Instructor email",instructorPhone:"Phone",instructorLanguages:"Languages",instructorSpeciality:"Speciality",instructorBio:"Biography",instructorSaveProfile:"Save instructor profile",instructorProfileSaved:"Instructor profile saved.",instructorStudents:"Student monitoring",instructorStudentsSub:"Uses the local students already entered in the School Dashboard",instructorNoStudents:"No students are available. Add them in the School Dashboard first.",instructorRisk:"Risk",instructorPriority:"Priority",instructorProgress:"Progress",instructorBridge:"Bridge",instructorPassport:"Passport",instructorAverage:"Average",instructorAssign:"Assign exercise",instructorAssignmentTitle:"Assignment title",instructorAssignmentType:"Assignment type",instructorAssignmentDue:"Due date",instructorAssignmentPriority:"Priority",instructorAssignmentNotes:"Assignment notes",instructorAssignmentStudent:"Student",instructorSaveAssignment:"Save assignment",instructorAssignmentSaved:"Assignment saved locally.",instructorAssignmentStudy:"Guided study",instructorAssignmentReview:"Review mistakes",instructorAssignmentBridge:"Bridge Test",instructorAssignmentExam:"Full simulation",instructorAssignmentZero:"Zero Error session",instructorAssignmentPassport:"Passport task",instructorLow:"Low",instructorMedium:"Medium",instructorHigh:"High",instructorUrgent:"Urgent",instructorAssignments:"Assignments",instructorNoAssignments:"No assignment has been created.",instructorAssignmentDone:"Completed",instructorAssignmentOpen:"Open",instructorToggleDone:"Toggle completed",instructorRemoveAssignment:"Remove assignment",instructorPrivateNotes:"Private instructor notes",instructorNoteStudent:"Student",instructorNoteText:"Private note",instructorSaveNote:"Save note",instructorNoteSaved:"Private note saved locally.",instructorNoNotes:"No private note has been added.",instructorRemoveNote:"Remove note",instructorReports:"Individual reports",instructorReportsSub:"Create a summary for one student from locally entered data",instructorSelectStudent:"Select student",instructorShareReport:"Share student report",instructorCopyReport:"Copy student report",instructorReportCopied:"Student report copied.",instructorStudentNotFound:"Select a valid student.",instructorRecommendedAction:"Recommended action",instructorAttention:"Instructor attention",instructorAttentionHigh:"Immediate support recommended",instructorAttentionMedium:"Targeted follow-up recommended",instructorAttentionLow:"Maintain current plan",instructorMetrics:"Instructor metrics",instructorActiveAssignments:"Active assignments",instructorCompletedAssignments:"Completed assignments",instructorStudentsAtRisk:"Students needing attention",instructorDemo:"Load instructor demo",instructorDemoText:"Adds clearly labelled fictitious assignments and notes.",instructorDemoLoaded:"Instructor demo loaded.",instructorClear:"Clear Instructor Portal data",instructorClearConfirm:"Delete instructor profile, assignments and private notes from this device?",instructorCleared:"Instructor Portal data cleared.",instructorOpenPortal:"Open Instructor Portal",aiInstructor:"AI Instructor",aiInstructorSub:"Contextual explanations and guided understanding for every question",aiInstructorFoundation:"AI-ready foundation",aiInstructorOffline:"Transparent offline instructor",aiInstructorOfflineText:"This build uses question data, your saved attempts and structured teaching logic. It is not yet connected to a live generative AI.",aiInstructorSettings:"Teaching settings",aiInstructorLanguage:"Explanation language",aiInstructorEnglish:"English",aiInstructorItalian:"Italian",aiInstructorBilingual:"English + Italian",aiInstructorLevel:"Explanation level",aiInstructorSimple:"Simple",aiInstructorNormal:"Normal",aiInstructorTechnical:"Technical",aiInstructorSave:"Save instructor settings",aiInstructorSaved:"AI Instructor settings saved.",aiInstructorAsk:"Talk to AI Instructor",aiInstructorUnderstand:"Help me understand",aiInstructorLesson:"Question lesson",aiInstructorSimpleExplanation:"Simple explanation",aiInstructorTechnicalExplanation:"Technical explanation",aiInstructorMaltaExample:"Real-life Malta example",aiInstructorMemoryTip:"Memory tip",aiInstructorCommonMistake:"Common mistake",aiInstructorWrongOptions:"Why the other options are wrong",aiInstructorSimilar:"Similar question to practise",aiInstructorAttempts:"Times explained",aiInstructorAdaptive:"Adaptive method",aiInstructorAdaptiveText:"The teaching style changes when the same question is explained repeatedly.",aiInstructorNoQuestion:"Select a question from the library or open AI Instructor after answering a quiz question.",aiInstructorQuestionSearch:"Search a question by ID or words",aiInstructorOpenLesson:"Open lesson",aiInstructorMyTutor:"My Tutor",aiInstructorTutorSub:"A summary of strengths, weaknesses and the next recommended lesson",aiInstructorStrong:"Strong areas",aiInstructorWeak:"Areas to improve",aiInstructorNext:"Next lesson",aiInstructorExplainedCount:"Questions explained",aiInstructorSocratic:"Make me understand",aiInstructorSocraticSub:"Answer short questions until you reach the rule yourself",aiInstructorSocraticStart:"Start guided dialogue",aiInstructorSocraticRestart:"Restart dialogue",aiInstructorSocraticNext:"Continue",aiInstructorSocraticComplete:"You reached the rule",aiInstructorSocraticQ1:"What is the main hazard, duty or vulnerable road user in this question?",aiInstructorSocraticQ2:"Which option protects safety and follows the rule most directly?",aiInstructorSocraticQ3:"Why are the remaining options less safe or less correct?",aiInstructorSocraticPrompt:"Write your reasoning in your own words",aiInstructorSocraticFeedback1:"Good. First identify the hazard or legal duty before looking at the answers.",aiInstructorSocraticFeedback2:"Now compare each option with the exact rule, not with what feels convenient.",aiInstructorSocraticFeedback3:"That final comparison is what makes the correct answer easier to remember.",aiInstructorSocraticEmpty:"Write a short answer before continuing.",aiInstructorExplainAgain:"Explain differently",aiInstructorPractise:"Practise this question",aiInstructorReport:"Share lesson",aiInstructorCopy:"Copy lesson",aiInstructorCopied:"AI Instructor lesson copied.",aiInstructorOpen:"Open AI Instructor",cloudReady:"Cloud Ready",cloudReadySub:"Local architecture prepared for future secure synchronisation",cloudNotice:"Cloud is not active yet",cloudNoticeText:"This build prepares identities, devices and a local sync queue. No data is uploaded anywhere.",cloudUserIdentity:"User identity",cloudUserId:"User ID",cloudDeviceId:"Device ID",cloudDeviceName:"Device name",cloudGenerateIdentity:"Generate identity",cloudIdentityReady:"Identity ready",cloudQueue:"Sync queue",cloudQueueSub:"Local events waiting for a future secure backend",cloudPending:"Pending items",cloudLastSync:"Last synchronisation",cloudNever:"Never",cloudLocalBackup:"Local backup",cloudCloudBackup:"Cloud backup",cloudNotConnected:"Not connected",cloudWaiting:"Waiting",cloudAddTestEvent:"Add test event",cloudClearQueue:"Clear queue",cloudQueueCleared:"Sync queue cleared.",cloudDeviceManager:"Device Manager",cloudDeviceManagerSub:"Prepare the same profile for iPhone, iPad, Android and desktop",cloudAddDevice:"Add device",cloudDeviceType:"Device type",cloudDeviceLabel:"Device label",cloudRemoveDevice:"Remove device",cloudNoDevices:"No additional device has been prepared.",cloudPreparedLogin:"Login preparation",cloudPreparedLoginText:"The app is structurally ready for future email, school and instructor accounts.",cloudArchitecture:"Cloud architecture status",cloudIdentityStatus:"Identity",cloudQueueStatus:"Queue",cloudDevicesStatus:"Devices",cloudLoginStatus:"Login",cloudReadyStatus:"Ready",cloudFutureStatus:"Future backend required",cloudEventQuiz:"Quiz progress event",cloudEventProfile:"Profile update event",cloudEventMission:"Mission event",cloudEventCreated:"Test event added to the local queue.",cloudExportQueue:"Copy sync queue",cloudQueueCopied:"Sync queue copied.",missions:"Missions",missionsSub:"Concrete study goals that improve preparation without turning it into a game",missionToday:"Mission of the day",missionSafety:"Safety Mission",missionEnglish:"English Mission",missionZero:"Zero Error Mission",missionExam:"Exam Mission",missionPassport:"Passport Mission",missionDailyText:"Complete 15 questions with at least 80% accuracy.",missionSafetyText:"Complete 10 safety and emergency questions.",missionEnglishText:"Complete one Bridge activity and review five English traps.",missionZeroText:"Defeat five critical questions in Zero Error Mode.",missionExamText:"Complete one 35-question simulation.",missionPassportText:"Complete one missing Passport requirement.",missionStart:"Start mission",missionActive:"Active mission",missionComplete:"Complete mission",missionCompleted:"Mission completed",missionProgressLabel:"Mission progress",missionReward:"Useful reward",missionRewardText:"Completing missions unlocks a preparation badge and updates the Coach.",missionReset:"Reset mission progress",missionResetConfirm:"Reset mission progress? Study data will not be deleted.",missionResetDone:"Mission progress reset.",missionNoActive:"No mission is active.",missionChoose:"Choose a mission",missionBadgeFocus:"Focused learner",missionBadgeSafety:"Safety discipline",missionBadgeEnglish:"English confidence",missionBadgeZero:"Critical errors controlled",missionBadgeExam:"Simulation discipline",missionBadgePassport:"Permit journey",missionCompletedCount:"Completed missions",missionOpen:"Open Missions",errorReplay:"Error Replay",errorReplaySub:"See the dangerous choice first, then replay the correct behaviour",errorReplayVisual:"Visual learning simulation",errorReplayVisualText:"These scenes are simplified educational illustrations based on the question topic. They are not official road diagrams or legal evidence.",errorReplayOpen:"Replay this error",errorReplayRiskScene:"Risk scene",errorReplayCorrectScene:"Correct scene",errorReplayStep1:"Observe the situation",errorReplayStep2:"Identify the hidden danger",errorReplayStep3:"Apply the safest legal action",errorReplayPlay:"Play replay",errorReplayRestart:"Restart",errorReplayNext:"Next scene",errorReplayPractise:"Practise this question",errorReplayUnderstand:"Open AI explanation",errorReplaySlow:"Slow",errorReplayNormal:"Normal",errorReplayFast:"Fast",errorReplayLibrary:"Replay library",errorReplayLibrarySub:"Mistakes and high-risk questions ready for visual review",errorReplayViewed:"Replays viewed",errorReplayCompleted:"Replays completed",errorReplayNoQuestion:"Choose a question from the replay library or open Replay after answering a quiz question.",errorReplaySearch:"Search question ID or words",errorReplayOpenScene:"Open replay",errorReplayWhyDangerous:"Why the first scene is dangerous",errorReplayWhyCorrect:"Why the second scene is correct",errorReplayDangerText:"The first action leaves a hazard uncontrolled or ignores an important safety duty.",errorReplayCorrectText:"The correct action reduces the risk and applies the safety rule tested by the question.",errorReplayBlindSpot:"Blind-spot risk",errorReplayCrossing:"Pedestrian-crossing risk",errorReplayBreakdown:"Breakdown or emergency risk",errorReplayPassenger:"Passenger-safety risk",errorReplayEco:"Eco-driving risk",errorReplayGeneral:"General road-safety risk",errorReplayShare:"Share replay lesson",errorReplayCopy:"Copy replay lesson",errorReplayCopied:"Replay lesson copied.",installedVersion:"Installed version",allModulesUpdated:"All modules aligned",releaseDate:"Release date"},
 it:{home:'Home',search:'Cerca',assistant:'Assistente LPTV',profile:'Profilo',welcome:'Tutto ciò che serve per studiare e guidare a Malta.',continue:'Continua la tua preparazione',lptv:'LPTV',lptvSub:'Esame, studio ed errori',licences:'Patenti',licencesSub:'Categorie utilizzate a Malta',roadCode:'Road Code',roadCodeSub:'Regole spiegate chiaramente',regulations:'Normative',regulationsSub:'Fonti ufficiali e aggiornamenti',ai:'Assistente LPTV',aiSub:'Cerca regole, domande e spiegazioni anche offline',profileTitle:'Il tuo profilo',startExam:'Esame realistico',examDetail:'35 domande • 45 minuti • promosso 30/35',study:'Studio per argomento',errors:'Rifai gli errori',progress:'Progressi',back:'Indietro',translate:'Traduci',listen:'Ascolta',explain:'Spiegamelo',confirm:'Conferma',next:'Avanti',exit:'Esci',question:'Domanda',selectOne:'Seleziona 1 risposta',selectMany:n=>`Seleziona ${n} risposte`,correct:'Risposta corretta',wrong:'Risposta errata',yourAnswer:'La tua risposta',rightAnswer:'Risposta corretta',passed:'PROMOSSO',failed:'NON SUPERATO',completed:'Sessione completata',officialSource:'Fonte ufficiale',openSource:'Apri fonte ufficiale',language:'Lingua',theme:'Aspetto',light:'Chiaro',dark:'Scuro',system:'Sistema',clear:'Cancella progressi',database:'Database',questions:'domande',searchPlaceholder:'Cerca domande, regole o normative…',noResults:'Nessun risultato trovato.',assistantIntro:'Scrivi una parola o una domanda in italiano oppure inglese. L’assistente cerca nella banca domande, nel dizionario, nel Codice della strada e nei collegamenti ufficiali.',assistantPlaceholder:'Esempio: precedenza in rotatoria, passeggero anziano, tunnel…',send:'Invia',assistantLocal:'Ricerca locale trasparente — nessuna AI esterna',assistantDisclaimer:'È un assistente di ricerca LPTV offline, non un’AI generativa. I risultati provengono dai contenuti dell’app. Per decisioni legali controlla le fonti ufficiali.',officialEnglish:'Inglese ufficiale',italian:'Italiano',maltese:'Maltese',maltesePending:'La traduzione maltese di questo contenuto è in preparazione. Rimane disponibile il testo ufficiale inglese.',categories:'Categorie',lastVerified:'Fonti controllate',resetConfirm:'Cancellare tutti i progressi salvati?',noErrors:'Non hai ancora errori salvati.',resume:'Riprendi sessione',newExam:'Nuovo esame',allTopics:'Tutti gli argomenti',chooseTopic:'Scegli un argomento',start:'Inizia',seen:'Viste',accuracy:'Precisione',exams:'Esami',best:'Migliore',last:'Ultimo risultato',official:'Banca di preparazione estesa',studyMode:'Modalità studio',examMode:'Modalità esame',noHelpExam:'Traduzioni e spiegazioni saranno disponibili alla fine dell’esame.',resultReview:'Rivedi errori',close:'Chiudi',guidedStudy:'Studio guidato',guidedStudyDetail:'250 domande pertinenti • traduzione completa • audio • correzione immediata',assistedSimulation:'Simulazione con aiuti',assistedDetail:'35 domande • traduzione e audio • timer facoltativo',realExamPieta:'Esame reale Pietà',realExamDetail:'35 domande • 45 minuti • solo inglese • correzione alla fine',chooseTimer:'Scegli il timer',noTimer:'Senza timer',timer45:'45 minuti',timer30:'30 minuti',startSimulation:'Inizia simulazione',guidedMode:'Studio guidato',assistedMode:'Simulazione con aiuti',realExamMode:'Esame reale Pietà',hideTranslation:'Nascondi traduzione',translationQuestion:'Domanda in italiano',translationAnswers:'Risposte in italiano',whyCorrect:'Perché questa risposta è corretta',wrongChoiceReason:'La risposta selezionata non corrisponde alla regola richiesta dalla domanda.',fourChapters:"Percorso completo",fourChaptersSub:"250 domande pertinenti organizzate nei 4 capitoli di preparazione",weakAttack:"Attacco punti deboli",weakAttackSub:"Allenamento adattivo basato sugli errori e sulla precisione più bassa",topicSafety:"Salute, sicurezza e responsabilità legali",topicSafetyDesc:"Incidenti, primo soccorso, documenti, sanzioni, operatori, veicoli e carico sicuro",topicCustomer:"Assistenza clienti e passeggeri vulnerabili",topicCustomerDesc:"Assistenza, disabilità, comfort, comunicazione e comportamento professionale",topicRoad:"Procedure stradali e responsabilità",topicRoadDesc:"Regole, segnali, incroci, attraversamenti, pericoli e guida difensiva",topicEco:"Guida ecologica e sicura",topicEcoDesc:"Consumi, emissioni, ambiente e guida efficiente",chapterProgress:"Progresso del capitolo",startChapter:"Studia questo capitolo",allChapterQuestions:"Tutte le domande del capitolo",adaptiveTraining:"Allenamento adattivo",adaptiveTrainingDesc:"L’app dà priorità agli errori ripetuti, alla precisione più bassa e alle domande mai viste.",availableWeak:"Domande selezionate per te",startWeak:"Inizia l’allenamento sui punti deboli",readiness:"Preparazione all’esame",coverage:"Copertura",recentAverage:"Media degli ultimi esami",recommended:"Prossimo passo consigliato",readinessStart:"Preparazione iniziale",readinessGrowing:"In miglioramento",readinessAlmost:"Quasi pronto",readinessReady:"Pronto per il test reale",recommendStudy:"Completa altre domande nello Studio guidato.",recommendWeak:"Allenati sugli argomenti più deboli.",recommendExam:"Prova un altro Esame reale Pietà.",examHistory:"Storico degli esami",noExamHistory:"Non hai ancora completato un esame realistico.",passedSmall:"Promosso",failedSmall:"Non superato",chapterQuestions:"Domande del capitolo",chapterAccuracy:"Precisione del capitolo",diagnostic:"Diagnosi personale",dailyPlan:"Piano di oggi",dailyPlanSub:"15 domande personalizzate per proseguire la preparazione",dailyDone:"Progresso di oggi",dailyComplete:"Obiettivo giornaliero completato",startDaily:"Inizia l’allenamento di oggi",repeatDaily:"Ripeti l’allenamento di oggi",streak:"Giorni consecutivi",days:"giorni",englishCoach:"English Coach",englishCoachSub:"Parole LPTV importanti con significato italiano, esempi e audio",vocabularySearch:"Cerca una parola inglese o italiana…",knownWords:"Parole imparate",markKnown:"Segna come imparata",known:"Imparata",savedQuestions:"Domande salvate",savedQuestionsSub:"Conserva le domande difficili o importanti per ripassarle",saveQuestion:"Salva domanda",removeSaved:"Rimuovi dai salvati",noSavedQuestions:"Non hai ancora salvato nessuna domanda.",backup:"Copia dei progressi",backupSub:"Salva o ripristina risultati, domande salvate e storico",exportBackup:"Esporta copia",importBackup:"Importa copia",backupCreated:"Copia creata.",backupRestored:"Copia ripristinata.",backupInvalid:"Questo file di copia non è valido.",today:"Oggi",words:"parole",example:"Esempio",dailyGoal:"Obiettivo giornaliero",examCentre:"Centro Esame",examCentreSub:"35 domande dalla banca estesa di preparazione LPTV",examInstructions:"Istruzioni dell’esame",examRuleQuestions:"35 domande",examRuleTime:"45 minuti",examRulePass:"Promosso con 30/35",examRuleEnglish:"Durante il test soltanto inglese",examRuleNavigation:"Puoi spostarti tra le domande e segnalarle per rivederle.",startRealExam:"Inizia esame reale",answered:"Risposte date",unanswered:"Senza risposta",flagged:"Segnalate",flagQuestion:"Segnala",unflagQuestion:"Togli segnalazione",navigator:"Navigatore domande",previous:"Indietro",finishExam:"Concludi esame",pauseExam:"Metti in pausa",pauseExamConfirm:"Mettere in pausa l’esame e tornare al menu? Risposte e timer verranno salvati.",confirmFinish:"Consegnare adesso l’esame?",examSummary:"Riepilogo esame",timeUsed:"Tempo impiegato",topicResults:"Risultati per capitolo",resumeExam:"Riprendi esame",autoSubmitted:"Tempo scaduto. L’esame è stato consegnato automaticamente.",answerRecorded:"Risposta salvata",examQuestionHelp:"Seleziona la risposta. Puoi modificarla fino alla consegna.",examPassTarget:"Servono almeno 30 risposte corrette.",newRealExam:"Nuovo esame reale",allAnswered:"Tutte le domande hanno una risposta",unansweredWarning:n=>`Hai ancora ${n} domand${n===1?'a':'e'} senza risposta. Vuoi consegnare comunque?`,bankScope:"Banca delle domande",bankAll:"Tutte le domande pertinenti",bankCore:"Nucleo LPTV",bankRoad:"Estensione sicurezza stradale",bankAuditTitle:"Banca ampliata e separata",bankAuditText:"250 domande utili alla preparazione: 68 del nucleo LPTV e 182 di sicurezza stradale pertinente.",bankExcludedText:"Escluse: 31 domande per operatori, SOV o gestione aziendale e 2 domande amministrative della patente B.",bankDisclaimer:"Transport Malta non pubblica il numero totale della banca LPTV. Questa è una banca di preparazione, non l’elenco ufficiale completo.",questionLibrary:"Banca domande",questionLibrarySub:"Cerca, filtra e ripassa tutte le 250 domande pertinenti",scheduledReview:"Ripasso programmato",scheduledReviewSub:"Le domande ritornano automaticamente quando è il momento di ripassarle",dueNow:"Da ripassare ora",nextReview:"Prossimo ripasso",startReview:"Inizia il ripasso programmato",noReviewDue:"Oggi non hai domande in scadenza",reviewReady:"Domande pronte per il ripasso",filterStatus:"Stato di preparazione",filterChapter:"Capitolo",filterBank:"Banca delle domande",statusAll:"Tutti gli stati",statusUnseen:"Mai studiate",statusWrong:"Risposte in modo errato",statusSaved:"Salvate",statusDue:"Da ripassare",statusMastered:"Imparate",resultsCount:"risultati",attempts:"Tentativi",studyNow:"Studia ora",mastered:"Imparata",dueToday:"Ripassa oggi",reviewIn:"Ripasso tra",resetFilters:"Azzera filtri",loadMore:"Mostra altre",allChapters:"Tutti i capitoli",librarySearch:"Cerca in inglese, italiano, categoria o codice domanda…",reviewSystem:"Ripasso intelligente",reviewSystemSub:"Le risposte corrette ritornano dopo 1, 3, 7, 14 e 30 giorni. Gli errori ritornano subito.",nextReviewNone:"Non è stato ancora programmato alcun ripasso.",masteredQuestions:"Domande imparate",reviewedQuestions:"Domande programmate",sentenceCoach:"Capisci la frase",hideSentenceCoach:"Nascondi aiuto frase",sentenceCoachSub:"Frasi e parole chiave spiegate in italiano",keyPhrases:"Frasi tipiche dell’esame",keyWords:"Parole chiave",slowListen:"Ascolta lentamente",noKeyTerms:"In questa domanda non sono state trovate frasi o parole già presenti nel dizionario.",phrasebook:"Frasario dell’esame",phrasebookSub:"Espressioni comuni usate nelle domande dei test di guida",commonPhrases:"Frasi comuni dell’esame",phraseSearch:"Cerca una frase inglese o italiana…",learnedPhrases:"Frasi imparate",markPhraseKnown:"Segna frase come imparata",phraseKnown:"Frase imparata",flashcards:"Flashcard delle frasi",flashcardsSub:"Allenati dall’inglese all’italiano e dall’italiano all’inglese",englishToItalian:"Inglese → Italiano",italianToEnglish:"Italiano → Inglese",revealAnswer:"Mostra risposta",hideAnswer:"Nascondi risposta",nextCard:"Prossima carta",shuffleCards:"Mescola carte",cardProgress:"Carta",phraseMeaning:"Significato italiano",questionLanguageHelp:"Aiuto per capire la domanda",audioNormal:"Velocità normale",audioSlow:"Velocità lenta",personalDetails:"Dati personali",personalDetailsSub:"Completa il profilo e prepara il contatto di registrazione",firstName:"Nome",lastName:"Cognome",emailAddress:"Indirizzo e-mail",addressOptional:"Via/indirizzo (facoltativo)",ageOptional:"Età (facoltativa)",saveProfile:"Salva profilo",prepareRegistration:"Prepara e-mail di registrazione",profileSaved:"Profilo salvato su questo dispositivo.",profileRequired:"Inserisci nome, cognome e un indirizzo e-mail valido.",privacyRequired:"Accetta l’informativa privacy prima di preparare la registrazione.",privacyConsent:"Acconsento all’invio di questi dati a Malta Driving Master per la registrazione dell’utilizzatore e l’assistenza.",updatesConsent:"Desidero ricevere anche gli aggiornamenti importanti dell’app tramite e-mail.",privacyNote:"I dati restano su questo dispositivo. Per inviarli, l’app apre Mail o Gmail con il messaggio già compilato e dovrai premere Invia.",registrationPrepared:"E-mail di registrazione preparata. Completa l’invio in Mail o Gmail.",registrationPending:"Profilo incompleto",registrationComplete:"Profilo completo",completeProfile:"Completa il tuo profilo",completeProfileSub:"Nome, cognome ed e-mail sono obbligatori per la registrazione.",registrationId:"Codice registrazione",adminContact:"Contatto amministrativo",deletePersonalData:"Cancella dati personali",deletePersonalDataConfirm:"Cancellare i dati personali salvati su questo dispositivo?",personalDataDeleted:"Dati personali cancellati.",emailInvalid:"Inserisci un indirizzo e-mail valido.",ageInvalid:"L’età deve essere compresa tra 16 e 100 oppure lasciata vuota.",emailNotAutomatic:"L’apertura dell’e-mail non esegue automaticamente l’invio.",privacyAndContact:"Privacy e contatto",savedOnDevice:"Salvato sul dispositivo",registrationPreparedOn:"Registrazione preparata",sendRegistration:"Invia registrazione",shareRegistration:"Condividi registrazione",openGmail:"Apri Gmail",openMail:"Apri Mail",copyRegistration:"Copia dati registrazione",registrationCopied:"Dati della registrazione copiati.",shareUnavailable:"La condivisione non è disponibile qui. Usa Gmail, Mail oppure Copia.",gmailOpening:"Apertura di Gmail…",mailOpening:"Apertura di Mail…",sendOptions:"Opzioni di invio registrazione",sendOptionsSub:"Scegli il sistema che funziona sul tuo dispositivo.",copyFallback:"I dati sono pronti. Incollali in un’e-mail indirizzata a:",closeOptions:"Chiudi",directSendNote:"Nessun messaggio viene inviato automaticamente. Controlla il destinatario e premi Invia.",detailedHistory:"Storico esami dettagliato",examDetails:"Dettagli dell’esame",examDetailsSub:"Controlla ogni risposta della simulazione",viewDetails:"Vedi dettagli",oldExamSummary:"Questo esame è stato svolto prima dell’introduzione dello storico dettagliato. È disponibile soltanto il riepilogo.",correctQuestions:"Domande corrette",wrongQuestions:"Domande sbagliate",unansweredQuestions:"Domande senza risposta",flaggedQuestions:"Domande segnalate",selectedAnswer:"Risposta selezionata",noAnswerSelected:"Nessuna risposta selezionata",retryExamErrors:"Ripeti gli errori di questo esame",shareProgressReport:"Condividi rapporto progressi",copyProgressReport:"Copia rapporto progressi",progressReportCopied:"Rapporto dei progressi copiato.",examReportCopied:"Rapporto dell’esame copiato.",shareExamReport:"Condividi rapporto esame",reportTitle:"Rapporto progressi Malta Driving Master",registeredUser:"Utilizzatore registrato",notProvided:"Non indicato",examNumber:"Esame",examResult:"Risultato esame",questionsReviewed:"Domande controllate",statisticsCorrection:"Statistiche esame corrette",statisticsCorrectionSub:"Ogni domanda dell’esame reale viene ora conteggiata una sola volta.",backToProgress:"Torna ai progressi",answerStatus:"Stato risposta",questionCode:"Codice domanda",examNotFound:"Esame non trovato.",noMistakesInExam:"In questo esame non ci sono errori da ripetere.",reportPrepared:"Rapporto preparato.",examDate:"Data esame",passRate:"Percentuale superamento",helpSupport:"Aiuto e assistenza",helpSupportSub:"Installa l’app, scopri le funzioni principali e segnala un problema",installApp:"Installa l’app",installAppSub:"Aggiungi Malta Driving Master al telefono come una normale applicazione",appInstalled:"Applicazione installata",appNotInstalled:"Applicazione non ancora installata",installNow:"Installa adesso",installIOS:"Su iPhone: premi Condividi, scegli Aggiungi alla schermata Home e poi premi Aggiungi.",installAndroid:"Su Android: apri il menu del browser e scegli Installa app oppure Aggiungi alla schermata Home.",installDesktop:"Usa l’icona di installazione o il menu del browser per installare l’app.",installUnavailable:"L’installazione automatica non è disponibile qui. Segui le istruzioni mostrate.",installationComplete:"Installazione completata.",refreshApp:"Aggiorna versione dell’app",refreshingApp:"Controllo dell’ultima versione…",quickGuide:"Guida rapida",quickGuideSub:"Apri le sezioni principali dell’app",guideStudy:"Studia con traduzioni, audio e correzione immediata",guideExam:"Prova la simulazione realistica da 35 domande",guideProgress:"Controlla risultati, errori e storico degli esami",guideProfile:"Registrati, salva i progressi e modifica le impostazioni",frequentQuestions:"Domande frequenti",faqBankQ:"Le 250 domande sono l’intera banca ufficiale Transport Malta?",faqBankA:"No. Sono una banca selezionata per la preparazione. Transport Malta non pubblica la banca completa delle domande LPTV.",faqOfflineQ:"L’app funziona senza internet?",faqOfflineA:"Dopo averla aperta online e installata, i principali contenuti di studio possono funzionare offline. I collegamenti ufficiali esterni e l’invio delle e-mail richiedono internet.",faqDataQ:"Dove vengono salvati progressi e dati personali?",faqDataA:"Vengono salvati su questo dispositivo. I dati di registrazione o assistenza arrivano all’amministratore soltanto quando invii il messaggio preparato.",faqUpdateQ:"Come ricevo una nuova versione?",faqUpdateA:"Dopo la pubblicazione di una nuova build, apri questa pagina e premi Aggiorna versione dell’app.",faqDeleteQ:"Posso cancellare i miei dati?",faqDeleteA:"Sì. I dati personali e i progressi di studio possono essere cancellati separatamente dalla pagina Profilo.",reportProblem:"Segnala un problema",reportProblemSub:"Descrivi cosa è successo. Il messaggio verrà preparato per l’assistenza Malta Driving Master.",supportCategory:"Tipo di segnalazione",supportTechnical:"Problema tecnico",supportQuestion:"Domanda o risposta da controllare",supportRegistration:"Problema di registrazione",supportSuggestion:"Suggerimento",questionIdOptional:"Codice domanda (facoltativo)",problemDescription:"Descrizione",problemPlaceholder:"Spiega cosa è successo e cosa stavi facendo…",descriptionRequired:"Scrivi una descrizione di almeno 10 caratteri.",shareReport:"Condividi segnalazione",openSupportGmail:"Apri Gmail",openSupportMail:"Apri Mail",copySupportReport:"Copia segnalazione",supportCopied:"Segnalazione copiata.",supportPrepared:"Segnalazione preparata.",contactSupport:"Contatto assistenza",version:"Versione",privacySummary:"Riepilogo privacy",privacySummaryText:"I dati di studio e il profilo restano su questo dispositivo. Nulla viene inviato automaticamente.",openProfile:"Apri profilo",openStudy:"Apri Studio guidato",openExam:"Apri Centro Esame",openProgress:"Apri Progressi",standaloneMode:"Modalità app installata",browserMode:"Modalità browser",menuHelp:"Aiuto",device:"Dispositivo",currentPage:"Pagina corrente",brandSlogan:"Preparati all’esame. Rispetta la strada. Proteggi ogni passeggero.",bridgeTest:"Bridge Test",bridgeTestSub:"Distingue la conoscenza delle regole dalla comprensione dell’inglese",bridgeIntro:"Gli stessi concetti vengono verificati prima in italiano e poi nell’inglese dell’esame. Tra le due fasi non viene mostrata la correzione.",bridgeQuestions:"Concetti da verificare",bridgeStart:"Avvia Bridge Test",bridgePhaseItalian:"Fase 1 di 2 — Comprensione della regola in italiano",bridgePhaseEnglish:"Fase 2 di 2 — Comprensione dell’inglese dell’esame",bridgeNoHelp:"Rispondi senza aiuti. La diagnosi apparirà soltanto alla fine.",bridgeTransition:"Fase italiana completata. Ora rispondi agli stessi concetti in inglese.",bridgeResults:"Risultato Bridge Test",knowledgeScore:"Conoscenza delle regole",englishScore:"Comprensione dell’inglese",masteredConcepts:"Concetti compresi in entrambe le lingue",languageBarrier:"Barriera linguistica",ruleGap:"Lacuna nella regola",recoveredEnglish:"Corretta soltanto in inglese",bridgeMeaning:"La tua diagnosi",bridgeLanguageMeaning:"Conoscevi la regola in italiano ma hai sbagliato in inglese. Devi allenare il linguaggio dell’esame.",bridgeRuleMeaning:"La regola non era chiara nemmeno in italiano. Prima va ripassato il concetto stradale.",bridgeMasteredMeaning:"Hai compreso sia la regola sia il modo in cui viene chiesta in inglese.",trainLanguageBarrier:"Allena le barriere linguistiche",trainRuleGaps:"Allena le lacune delle regole",repeatBridge:"Ripeti Bridge Test",latestBridge:"Ultima diagnosi Bridge",noBridgeYet:"Non hai ancora completato un Bridge Test.",bridgeNotOfficial:"È una diagnosi didattica, non un risultato ufficiale d’esame.",italianPhase:"Fase italiana",englishPhase:"Fase inglese",confirmBridge:"Conferma e continua",bridgeCompleted:"Bridge Test completato.",errorDna:"DNA dell’errore",errorDnaSub:"Scopri perché sbagli, non soltanto quali domande sbagli",whyWrong:"Qual è stata la causa di questo errore?",reasonRule:"Non conoscevo la regola",reasonLanguage:"Non ho capito la domanda in inglese",reasonWord:"Non conoscevo una parola importante",reasonMultiple:"Ho selezionato un numero errato di risposte",reasonRush:"Ho letto troppo velocemente",reasonUnsure:"Ero insicuro e ho indovinato",reasonSaved:"Causa salvata",noErrorDna:"Dopo una risposta errata scegli la causa: l’app costruirà il tuo profilo personale degli errori.",trainThisCause:"Allena questa causa",assistantOffline:"OFFLINE",assistantResults:"Risultati pertinenti",assistantStudyQuestion:"Studia questa domanda",assistantNoMatch:"Non ho trovato una corrispondenza forte. Prova con un termine più breve: rotatoria, pedone, passeggero, tunnel oppure freni.",assistantTry:"Prova a chiedere",respectRoad:"Rispetta la strada",protectPassengers:"Proteggi ogni passeggero",assistantFound:n=>`Trovati ${n} risultat${n===1?'o':'i'} pertinenti`,findSchool:"Trova una scuola guida",findSchoolSub:"Confronta i servizi e trova la scuola più adatta alle tue esigenze",schoolPartner:"School Partner",schoolPartnerSub:"Presenta i servizi, raggiungi studenti adatti e ricevi richieste qualificate",schoolMarketplace:"Area scuole per lo studente",schoolMarketplaceSub:"Smart Match confronta le tue preferenze con i servizi dichiarati da ogni scuola.",schoolDemoNotice:"Area dimostrativa: questi sono profili inventati per provare la piattaforma. Nessuna scuola reale è ancora pubblicizzata.",smartMatch:"Smart Match",smartMatchSub:"La visibilità a pagamento non modifica mai il punteggio di compatibilità.",matchScore:"compatibilità",yourPreferences:"Le tue preferenze",preferredArea:"Zona preferita",preferredLanguage:"Lingua dell’istruttore",courseNeeded:"Corso necessario",transmission:"Cambio",preferredSchedule:"Orario preferito",supportNeeded:"Supporto aggiuntivo",areaAll:"Tutta Malta",areaNorth:"Nord",areaCentral:"Centro",areaSouth:"Sud",areaGozo:"Gozo",languageAny:"Qualsiasi lingua",courseLptv:"LPTV / TAG",courseB:"Patente B",transmissionAny:"Automatico o manuale",automatic:"Automatico",manual:"Manuale",scheduleAny:"Qualsiasi orario",daytime:"Giorno",evening:"Sera",weekend:"Weekend",englishSupport:"Supporto per l’inglese dell’esame",documentSupport:"Assistenza documenti e TAG",updateMatches:"Aggiorna abbinamenti",schoolsFound:"profili trovati",schoolDetails:"Dettagli della scuola",compareSchools:"Confronta scuole",addToCompare:"Aggiungi al confronto",removeFromCompare:"Rimuovi dal confronto",compareLimit:"Puoi confrontare al massimo tre scuole.",comparisonEmpty:"Seleziona le scuole dall’elenco per confrontarle.",servicesOffered:"Servizi offerti",languagesSpoken:"Lingue",coursesOffered:"Corsi",availability:"Disponibilità",pricingBySchool:"Prezzi inseriti dalla scuola",pricingPending:"I prezzi saranno inseriti e aggiornati direttamente dalla scuola.",requestInformation:"Richiedi informazioni",studentRequest:"Richiesta informazioni studente",requestPrepared:"Richiesta preparata.",pilotRequestNotice:"Durante la fase pilota le richieste arrivano a Malta Driving Master. In seguito saranno inviate direttamente alla scuola verificata scelta.",profileNeededForRequest:"Completa il profilo personale prima di richiedere informazioni.",demoProfile:"Profilo dimostrativo",verifiedSchool:"Scuola verificata",verificationPending:"Verifica in attesa",sponsored:"Sponsorizzato",sponsoredExplanation:"I servizi sponsorizzati sono indicati chiaramente e non influenzano Smart Match.",whyMatched:"Perché è adatta",bridgeMatch:"Adatta alle tue difficoltà con l’inglese",areaMatch:"Corrisponde alla zona preferita",languageMatch:"Corrisponde alla lingua richiesta",scheduleMatch:"Corrisponde all’orario richiesto",serviceEnglish:"Supporto inglese",serviceDocuments:"Assistenza documentale",serviceBridge:"Supporto Bridge Test",serviceProgress:"Rapporti sui progressi",serviceVulnerable:"Scenari sulla sicurezza dei passeggeri",servicePickup:"Servizio di raccolta",schoolPlans:"Piani School Partner",basicPlan:"Profilo base",basicPlanSub:"Presenza gratuita con identità verificata e servizi essenziali",proPlan:"School Pro",proPlanSub:"Strumenti a pagamento per servizi, disponibilità, richieste qualificate e gruppi studenti",featuredPlan:"Servizi sponsorizzati",featuredPlanSub:"Visibilità a pagamento, sempre indicata e separata da Smart Match",commercialTerms:"Condizioni commerciali da definire prima del lancio",partnerPrinciples:"Principi della piattaforma",partnerPrincipleVerify:"Le scuole vengono controllate prima della pubblicazione.",partnerPrincipleFair:"Il pagamento non compra un punteggio di compatibilità più alto.",partnerPrincipleControl:"Lo studente sceglie quali progressi condividere.",applySchoolPartner:"Richiedi di diventare School Partner",schoolName:"Nome della scuola",permitReference:"Autorizzazione o riferimento ufficiale",schoolEmail:"E-mail della scuola",schoolPhone:"Telefono",schoolArea:"Zona operativa",schoolLanguages:"Lingue offerte",schoolServices:"Servizi da pubblicare",schoolPrices:"Prezzi o modalità di pagamento",schoolAvailability:"Disponibilità e tempi di attesa",schoolDescription:"Cosa rende diversa la tua scuola?",choosePlan:"Piano di interesse",partnerConsent:"Confermo che le informazioni fornite sono corrette e possono essere controllate prima della pubblicazione.",saveSchoolDraft:"Salva bozza scuola",sendPartnerApplication:"Invia candidatura partner",partnerDraftSaved:"Bozza della scuola salvata sul dispositivo.",partnerRequired:"Inserisci nome della scuola, autorizzazione, e-mail valida e accetta la dichiarazione.",partnerSendOptions:"Invia candidatura",noRealSchoolYet:"Nessuna scuola reale è stata ancora approvata in questo prototipo.",studentArea:"Area studente",schoolAreaTitle:"Area scuola",smartMatchDiagnosis:"Il Bridge Test e le tue preferenze possono migliorare l’abbinamento.",paidServiceLabel:"Servizio a pagamento",clearComparison:"Azzera confronto",lptvPassport:"LPTV Passport",lptvPassportSub:"Il tuo percorso personale dalla preparazione fino al Driver Permit Tag",passportOfficialUpdate:"Aggiornamento ufficiale importante",passportOfficialUpdateText:"Dal 29 luglio 2026, chi presenta una nuova domanda LPTV deve possedere una patente B valida UE da almeno due anni e non avere più di sei punti di penalità.",passportChecked:"Informazioni ufficiali controllate",passportMode:"Tipo di pratica",passportNew:"Prima richiesta",passportRenewal:"Rinnovo del TAG",passportApplicantType:"Categoria del richiedente",passportMaltese:"Cittadino maltese",passportEU:"Cittadino UE/SEE/Svizzera non maltese",passportTCN:"Cittadino di Paese terzo",passportStatus:"Stato della pratica",passportPlanning:"Programmazione",passportCollecting:"Raccolta documenti",passportReady:"Pronta per la consegna",passportSubmitted:"Domanda consegnata",passportEligibilityLetter:"Lettera di idoneità / passaggio Identità",passportWaiting:"In attesa del rilascio",passportIssued:"TAG rilasciato",passportChecklist:"Checklist personale",passportChecklistSub:"Spunta soltanto i documenti realmente posseduti o i passaggi completati.",passportCompleted:"completato",passportEligibility:"Controllo di idoneità",passportLicenceSince:"Patente B posseduta dal",passportPenaltyPoints:"Punti di penalità attuali",passportEligibleDate:"Requisito dei due anni raggiunto il",passportLicenceTooNew:"La patente B non è ancora posseduta da due anni.",passportPointsBlocked:"Più di sei punti di penalità impediscono una nuova richiesta.",passportEligibilityUnknown:"Inserisci la data della patente e i punti per controllare l’idoneità.",passportBasicEligible:"Le condizioni di base su durata della patente e punti risultano soddisfatte.",passportDates:"Scadenze e validità",passportDatesSub:"La validità del TAG può essere limitata dalla prima scadenza dei documenti applicabili.",passportDrivingExpiry:"Scadenza patente",passportResidenceExpiry:"Scadenza documento di residenza",passportEmploymentExpiry:"Scadenza autorizzazione al lavoro",passportOperatorExpiry:"Scadenza licenza operatore (autonomo o controllo datore)",passportTagExpiry:"Scadenza TAG attuale/nuovo",passportMedicalDate:"Data certificato medico",passportApplicationDate:"Data domanda/consegna",passportEarliestExpiry:"Prima scadenza inserita",passportNoExpiry:"Nessuna scadenza inserita",passportDaysRemaining:"giorni rimanenti",passportExpired:"scaduto",passportCalendar:"Crea promemoria Calendario iPhone",passportCalendarSub:"Crea un file .ics con promemoria prima delle scadenze inserite.",passportCalendarCreated:"File dei promemoria calendario creato.",passportCalendarMissing:"Inserisci prima almeno una data di scadenza.",passportNotes:"Note personali",passportSave:"Salva Passport",passportSaved:"LPTV Passport salvato sul dispositivo.",passportShare:"Condividi rapporto Passport",passportCopy:"Copia rapporto Passport",passportCopied:"Rapporto Passport copiato.",passportReset:"Azzera Passport",passportResetConfirm:"Cancellare checklist, date e note dell’LPTV Passport da questo dispositivo?",passportResetDone:"LPTV Passport azzerato.",passportOfficialDocuments:"Moduli e guide ufficiali",passportOfficialWarning:"Scarica sempre i moduli più recenti da Transport Malta prima della consegna. Questa checklist è una guida e non sostituisce una decisione ufficiale di idoneità.",passportSubmissionOffices:"Uffici di consegna",passportSubmissionText:"Le domande possono essere consegnate personalmente agli uffici Transport Malta di Paola, Ħal Lija o Victoria, Gozo. Controlla gli orari prima di partire.",passportFeeNew:"Prima richiesta: la pagina ufficiale indica €17,50. Il modulo DPA13 di luglio 2026 specifica €12 per il TAG + €5,50 per il casellario. Possono aggiungersi €10 per aggiornare una patente maltese con il codice armonizzato 103.",passportFeeRenew:"Rinnovo: €12.",passportTagNotPermission:"La lettera di conferma dell’idoneità non è il Driver Permit Tag e non autorizza a guidare finché il TAG non viene formalmente rilasciato.",passportValidityRule:"La validità del permesso non può superare la prima scadenza rilevante tra patente, documento di residenza, autorizzazione al lavoro e, quando applicabile, licenza dell’operatore.",passportDocId:"Carta d’identità o documentazione di residenza valida",passportDocLicence:"Patente B UE valida o convertita secondo le regole maltesi",passportDocTwoYears:"Patente B posseduta da almeno due anni",passportDocPoints:"Non più di sei punti di penalità",passportDocCourse:"Certificato del corso Customer Care LPTV",passportDocDPA13:"Modulo DPA13 per la prima richiesta compilato",passportDocDPA14:"Modulo DPA14 per il rinnovo compilato",passportDocMedical:"Certificato medico DRV032",passportDocCriminalLocal:"Requisito del casellario locale",passportDocCriminalForeign:"Casellario estero, quando applicabile",passportDocPoliceConduct:"Certificato locale di condotta della Polizia",passportDocPhoto:"Fototessera se la patente è stata rilasciata da un altro Stato UE",passportDocFeeNew:"Importi della prima richiesta preparati",passportDocFeeRenew:"Importo del rinnovo preparato",passportDocJobsplus:"Documentazione JobsPlus con il ruolo richiesto di Cab Driver",passportDocDPA16:"DPA16 del datore oppure licenza LPTS valida se lavoratore autonomo",passportDocOperator15:"Licenza dell’operatore valida per oltre 15 giorni dalla domanda",passportDocSinglePermit:"Documenti di residenza/lavoro con datore e qualifica Cab Driver, quando applicabile",passportDocSignatory:"Copia del documento del firmatario autorizzato allegata quando richiesta",passportDocBluePaper:"Solo rinnovo: il 'blue paper' è accettato soltanto in casi limitati senza cambi non ammessi di datore o qualifica",passportDocCopyLicence:"Copia della patente",passportGeneral:"Requisiti generali",passportTCNExtra:"Requisiti aggiuntivi TCN",passportSubmission:"Consegna e pagamento",passportOpen:"Apri documento ufficiale",passportDPA13:"DPA13 — prima richiesta",passportDPA14:"DPA14 — rinnovo",passportDPA16:"DPA16 — dichiarazione datore",passportDRV032:"DRV032 — certificato medico",passportSOPT01:"SOPT 01 — prime richieste",passportSOPT02:"SOPT 02 — rinnovi",passportOperatorGuide:"Guida operatore LPTV",passportMainPage:"Pagina ufficiale Driver Tag LPTV",passportTraining:"Formazione e test approvati",passportDownloads:"Moduli Transport Malta",passportContact:"Contatti e orari Transport Malta",passportCurrentProgress:"Preparazione Passport",passportRequiredComplete:"requisiti completati",passportAttention:"Richiede attenzione",passportGood:"Percorso regolare",passportNoBackend:"Dati e checklist restano sul dispositivo e sono compresi nel backup locale.",passportOpenDirect:"Apri direttamente",passportShareOfficial:"Condividi / apri in Safari",passportOfficialCopied:"Collegamento ufficiale copiato.",passportOfficialShareText:"Documento ufficiale Transport Malta",passportCalendarShared:"File calendario inviato al menu Condividi dell’iPhone.",passportCalendarCopiedFallback:"Questo browser non può esportare il file calendario. L’elenco dei promemoria è stato copiato.",passportCalendarOpenSafariNote:"In Koder usa Condividi e scegli Salva su File. Nella versione pubblicata aperta con Safari sarà disponibile anche il download del file .ics.",passportKoderFix:"Comandi compatibili con Koder",personalRoadmap:"Personal Roadmap",personalRoadmapSub:"Un solo percorso chiaro dallo studio di oggi fino all’esame e al Driver Permit Tag",roadmapInternalEstimate:"Stima interna di preparazione — non è una decisione ufficiale di idoneità",roadmapJourneyScore:"Punteggio del percorso",roadmapNextAction:"La tua prossima azione migliore",roadmapDoNow:"Fallo adesso",roadmapWhy:"Perché viene prima",roadmapToday:"Oggi",roadmapWeek:"I tuoi prossimi 7 passi",roadmapWeekSub:"Una sequenza equilibrata generata dai tuoi progressi reali",roadmapSettings:"Impostazioni del piano",roadmapTargetDate:"Data obiettivo",roadmapDailyMinutes:"Minuti per ogni giorno di studio",roadmapStudyDays:"Giorni di studio alla settimana",roadmapMainGoal:"Obiettivo principale",roadmapGoalExam:"Superare il test teorico",roadmapGoalTag:"Ottenere il Driver Permit Tag",roadmapSavePlan:"Salva piano",roadmapPlanSaved:"Personal Roadmap salvata.",roadmapNoTarget:"Nessuna data obiettivo inserita",roadmapDaysToTarget:"giorni all’obiettivo",roadmapTargetToday:"La data obiettivo è oggi",roadmapTargetPassed:"La data obiettivo è trascorsa",roadmapStudyScore:"Preparazione esame",roadmapEnglishScore:"Inglese / Bridge",roadmapPassportScore:"Documenti / Passport",roadmapDailyScore:"Abitudine di oggi",roadmapCoverage:"Copertura delle domande",roadmapAccuracy:"Precisione delle risposte",roadmapExamAverage:"Media esami recenti",roadmapPassportProgress:"Avanzamento Passport",roadmapBridgeProgress:"Ultimo risultato Bridge",roadmapWeakestTopic:"Argomento che richiede più attenzione",roadmapAchievements:"Traguardi raggiunti",roadmapAchievementsSub:"I progressi che hai già conquistato",roadmapLocked:"Non ancora raggiunto",roadmapShare:"Condividi rapporto Roadmap",roadmapCopy:"Copia rapporto Roadmap",roadmapCopied:"Rapporto Roadmap copiato.",roadmapActionProfile:"Completa il profilo personale",roadmapReasonProfile:"Nome e contatti servono per rapporti e richieste alle scuole.",roadmapActionDaily:"Completa il piano di studio di oggi",roadmapReasonDaily:"Una breve sessione quotidiana è il modo più rapido per creare memoria stabile.",roadmapActionReview:"Ripassa le domande in scadenza",roadmapReasonReview:"La ripetizione programmata impedisce di dimenticare regole già studiate.",roadmapActionBridge:"Esegui un Bridge Test",roadmapReasonBridge:"L’app deve distinguere la conoscenza delle regole dalla difficoltà con l’inglese.",roadmapActionEnglish:"Allena la barriera linguistica",roadmapReasonEnglish:"L’ultimo Bridge Test mostra che l’inglese sta riducendo il risultato.",roadmapActionCoverage:"Continua lo studio guidato",roadmapReasonCoverage:"Troppe domande non sono ancora state affrontate.",roadmapActionAccuracy:"Attacca l’argomento più debole",roadmapReasonAccuracy:"La precisione deve diventare stabile prima di affidarsi alle simulazioni complete.",roadmapActionExam:"Esegui una simulazione completa",roadmapReasonExam:"Serve una prova da 35 domande per misurare la preparazione reale.",roadmapActionPassport:"Continua l’LPTV Passport",roadmapReasonPassport:"Il percorso di studio e quello documentale devono avanzare insieme.",roadmapActionSchool:"Confronta le scuole più adatte",roadmapReasonSchool:"I dati della preparazione possono ora aiutarti a scegliere il supporto corretto.",roadmapActionReady:"Proteggi la preparazione raggiunta",roadmapReasonReady:"Sei sulla strada giusta: usa ripassi e simulazioni per mantenere stabile il risultato.",roadmapStepDaily:"Studio adattivo quotidiano",roadmapStepWeak:"Attacco al punto debole",roadmapStepBridge:"Sessione Bridge inglese",roadmapStepReview:"Ripasso programmato",roadmapStepExam:"Simulazione completa",roadmapStepPassport:"Passport e documenti",roadmapStepReflect:"Controllo progressi e recupero",roadmapAchievementProfile:"Profilo personale completato",roadmapAchievement25:"Prime 25 domande studiate",roadmapAchievement100:"100 domande differenti affrontate",roadmapAchievementExam:"Prima simulazione completa",roadmapAchievementPass:"Simulazione superata con almeno 30/35",roadmapAchievementBridge:"Padronanza Bridge almeno all’80%",roadmapAchievementStreak:"Sette giorni consecutivi di studio",roadmapAchievementPassport:"Checklist Passport completata",roadmapPace:"Ritmo di studio stimato",roadmapPaceText:"Con il ritmo scelto, le domande mai viste richiedono circa",roadmapSessions:"sessioni di studio",roadmapQuestionsLeft:"domande mai viste",roadmapRecommended:"Consigliato",roadmapOverallGood:"Percorso complessivo solido",roadmapOverallGrowing:"Il percorso sta crescendo",roadmapOverallStart:"Costruisci le fondamenta",roadmapReset:"Azzera impostazioni piano",roadmapResetConfirm:"Azzerare soltanto data obiettivo e impostazioni della Roadmap? Progressi di studio e Passport non saranno cancellati.",roadmapResetDone:"Impostazioni Roadmap azzerate.",roadmapCurrentProgress:"Progressi attuali",schoolDashboard:"Dashboard School Partner",schoolDashboardSub:"Gestisci il prototipo locale di studenti, gruppi, inviti e rapporti",schoolDashboardLocal:"Prototipo locale",schoolDashboardNotice:"Questa dashboard funziona soltanto su questo dispositivo. Non crea veri account scuola, non invia inviti agli studenti e non sincronizza online dati privati.",openDashboard:"Apri Dashboard scuola",dashboardProfile:"Profilo della scuola",dashboardProfileCompletion:"Completamento profilo",dashboardReadyReview:"Pronto per richiedere la verifica",dashboardDraftStatus:"Bozza ancora incompleta",dashboardEditProfile:"Modifica profilo scuola",dashboardPublicPreview:"Anteprima profilo pubblico",dashboardPublicPreviewSub:"Ecco come potrebbero apparire le informazioni dichiarate dopo la verifica.",dashboardNoSchoolName:"Bozza scuola senza nome",dashboardPermitHidden:"Autorizzazione/riferimento fornito per la verifica",dashboardStudents:"Studenti",dashboardGroups:"Gruppi",dashboardInvites:"Codici di invito",dashboardAverage:"Avanzamento medio manuale",dashboardNoStudents:"Non è stato ancora aggiunto alcuno studente.",dashboardNoGroups:"Non è stato ancora creato alcun gruppo.",dashboardNoInvites:"Non è stato ancora generato alcun codice di invito.",dashboardManualData:"I progressi sono inseriti manualmente e non vengono sincronizzati con l’app dello studente.",dashboardAddStudent:"Aggiungi studente",dashboardStudentName:"Nome dello studente",dashboardStudentEmail:"E-mail dello studente",dashboardStudentCourse:"Corso",dashboardStudentGroup:"Gruppo",dashboardStudentProgress:"Preparazione %",dashboardStudentBridge:"Bridge %",dashboardStudentPassport:"Passport %",dashboardStudentStatus:"Stato",dashboardStudentNotes:"Note sullo studente",dashboardStatusActive:"Attivo",dashboardStatusPaused:"In pausa",dashboardStatusReady:"Pronto per l’esame",dashboardStatusCompleted:"Completato",dashboardNoGroup:"Nessun gruppo",dashboardSaveStudent:"Salva studente",dashboardUpdateStudent:"Aggiorna",dashboardRemoveStudent:"Rimuovi",dashboardStudentRequired:"Inserisci il nome dello studente e un indirizzo e-mail valido.",dashboardStudentSaved:"Studente salvato localmente.",dashboardStudentRemoved:"Studente rimosso.",dashboardRemoveStudentConfirm:"Rimuovere questo studente dalla dashboard locale?",dashboardAddGroup:"Crea gruppo",dashboardGroupName:"Nome del gruppo",dashboardGroupLanguage:"Lingua delle lezioni",dashboardGroupSchedule:"Orario",dashboardGroupNotes:"Note sul gruppo",dashboardSaveGroup:"Salva gruppo",dashboardGroupRequired:"Inserisci il nome del gruppo.",dashboardGroupSaved:"Gruppo salvato localmente.",dashboardRemoveGroup:"Rimuovi gruppo",dashboardRemoveGroupConfirm:"Rimuovere questo gruppo? Gli studenti resteranno ma non ne faranno più parte.",dashboardGroupRemoved:"Gruppo rimosso.",dashboardMembers:"membri",dashboardGenerateInvite:"Genera codice di invito",dashboardInviteGroup:"Invito per il gruppo",dashboardCreateInvite:"Crea codice",dashboardInviteCreated:"Codice di invito dimostrativo creato.",dashboardInviteWarning:"I codici sono dimostrativi finché non saranno collegati account sicuri e un backend.",dashboardShareInvite:"Condividi invito",dashboardCopyInvite:"Copia codice",dashboardRemoveInvite:"Elimina codice",dashboardInviteText:"Invito scuola Malta Driving Master",dashboardInviteCopied:"Invito copiato.",dashboardReports:"Rapporti della scuola",dashboardReportsSub:"Crea un riepilogo utilizzando i dati locali della dashboard.",dashboardShareReport:"Condividi rapporto scuola",dashboardCopyReport:"Copia rapporto scuola",dashboardExportCsv:"Esporta studenti CSV",dashboardReportCopied:"Rapporto scuola copiato.",dashboardCsvShared:"File CSV degli studenti inviato al menu Condividi.",dashboardCsvCopied:"Contenuto CSV copiato perché la condivisione del file non è disponibile.",dashboardDemoData:"Carica dati dimostrativi",dashboardDemoDataSub:"Aggiunge studenti e gruppi inventati e chiaramente indicati per provare la dashboard.",dashboardLoadDemo:"Carica demo",dashboardDemoConfirm:"Aggiungere studenti e gruppi dimostrativi inventati? I dati locali esistenti resteranno.",dashboardDemoLoaded:"Dati dimostrativi caricati.",dashboardDemoBadge:"Demo",dashboardClear:"Cancella dati dashboard",dashboardClearConfirm:"Eliminare tutti gli studenti, gruppi e codici locali? La bozza della candidatura scuola resterà.",dashboardCleared:"Dati locali della dashboard cancellati.",dashboardSchoolNotes:"Note interne della scuola",dashboardSaveNotes:"Salva note",dashboardNotesSaved:"Note della scuola salvate localmente.",dashboardVerification:"Stato della verifica",dashboardNotVerified:"Non verificata",dashboardReviewNeeded:"È necessaria una verifica prima di qualsiasi pubblicazione",dashboardPrivacy:"Privacy degli studenti",dashboardPrivacyText:"Non inserire dati medici, documenti d’identità o informazioni sul casellario in questo prototipo locale.",dashboardPlan:"Piano selezionato",dashboardCreated:"Creato",dashboardLastUpdated:"Ultimo aggiornamento",dashboardStudentCount:"numero studenti",dashboardGroupCount:"numero gruppi",onboardingWelcome:"Benvenuto in Malta Driving Master",onboardingWelcomeSub:"Preparati all’esame. Rispetta la strada. Proteggi ogni passeggero.",onboardingChooseRole:"Come utilizzerai la piattaforma?",onboardingStudent:"Studente",onboardingStudentSub:"Studio, Bridge Test, Passport, Roadmap e confronto scuole",onboardingSchool:"Scuola guida",onboardingSchoolSub:"Profilo scuola, dashboard locale, studenti, gruppi e rapporti",onboardingBoth:"Entrambi",onboardingBothSub:"Utilizza sia l’area Studente sia School Partner",onboardingDataTitle:"I tuoi dati restano sotto il tuo controllo",onboardingDataText:"Questa versione salva progressi e bozze localmente sul dispositivo. I dati non vengono inviati automaticamente a Malta Driving Master, a una scuola o a un altro studente.",onboardingRequiredStorage:"Ho compreso che l’archiviazione locale essenziale serve a salvare progressi, impostazioni e bozze su questo dispositivo.",onboardingTerms:"Ho letto e accetto le informazioni sull’app, le limitazioni e l’avviso per un utilizzo responsabile.",onboardingUpdates:"Desidero ricevere aggiornamenti importanti quando invierò volontariamente l’e-mail di registrazione.",onboardingContinue:"Entra in Malta Driving Master",onboardingRequired:"Scegli un ruolo e accetta le due dichiarazioni obbligatorie.",onboardingLocalOnly:"Prototipo local-first",onboardingNoTracking:"Nessun tracciamento pubblicitario attivo",onboardingOfficialWarning:"L’app aiuta nella preparazione e nell’organizzazione. Non sostituisce Transport Malta, una scuola autorizzata, un medico o una decisione ufficiale di idoneità.",privacyCenter:"Centro Privacy e Dati",privacyCenterSub:"Controlla cosa è salvato, esportalo e cancella soltanto ciò che scegli",privacyOverview:"Panoramica dei dati",privacyStoredLocally:"Salvati localmente su questo dispositivo",privacySentOnlyByAction:"Inviati soltanto quando utilizzi volontariamente Condividi, Gmail o Mail",privacyNoAutomaticUpload:"Nessun caricamento automatico nella versione GitHub Pages",privacyProfileData:"Profilo personale",privacyStudyData:"Progressi di studio",privacyPassportData:"LPTV Passport",privacyRoadmapData:"Personal Roadmap",privacySchoolData:"Dati scuola e dashboard",privacyPreferencesData:"Preferenze privacy",privacyPresent:"Presenti",privacyEmpty:"Vuoti",privacyItems:"elementi",privacyExportTitle:"Esporta i tuoi dati",privacyExportText:"Crea un backup JSON leggibile da sistemi informatici contenente i dati locali gestiti dall’app.",privacyExportAll:"Esporta tutti i dati locali",privacyDeleteTitle:"Cancellazione selettiva",privacyDeleteText:"Cancella una sola area senza modificare le altre.",privacyDeleteStudy:"Cancella progressi di studio",privacyDeleteProfile:"Cancella profilo personale",privacyDeletePassport:"Cancella Passport",privacyDeleteRoadmap:"Cancella impostazioni Roadmap",privacyDeleteSchool:"Cancella dati scuola",privacyDeleteAll:"Cancella tutti i dati Malta Driving Master",privacyDeleteStudyConfirm:"Cancellare risposte, esami, preferiti, ripassi e risultati Bridge?",privacyDeleteProfileConfirm:"Cancellare il profilo personale salvato su questo dispositivo?",privacyDeletePassportConfirm:"Cancellare checklist, date e note del Passport?",privacyDeleteRoadmapConfirm:"Cancellare soltanto le impostazioni della Roadmap?",privacyDeleteSchoolConfirm:"Cancellare preferenze scuole, confronto, candidatura e dati dashboard?",privacyDeleteAllConfirm:"Cancellare definitivamente da questo dispositivo tutti i dati Malta Driving Master, compresi progressi, profilo, Passport e dati scuola?",privacyDeleted:"Dati locali selezionati cancellati.",privacyAllDeleted:"Tutti i dati locali Malta Driving Master sono stati cancellati.",privacyRequestTitle:"Richiesta per dati già inviati fuori dal dispositivo",privacyRequestText:"Se in precedenza hai inviato un’e-mail di registrazione o assistenza, puoi preparare un messaggio per chiedere accesso, correzione o cancellazione di quelle informazioni.",privacyRequestAccess:"Richiedi accesso",privacyRequestCorrection:"Richiedi correzione",privacyRequestErasure:"Richiedi cancellazione",privacyRequestPrepared:"Richiesta privacy preparata.",privacyRightsNotice:"I diritti europei possono comprendere informazione, accesso, correzione, cancellazione e portabilità. Per le richieste può essere necessaria la verifica dell’identità.",privacyConsentSettings:"Preferenze facoltative",privacyAnalytics:"Consenti future statistiche anonime di utilizzo",privacyMarketing:"Consenti future comunicazioni promozionali",privacyNotActive:"Queste funzioni facoltative non sono attive nell’attuale versione locale.",privacySavePreferences:"Salva preferenze",privacyPreferencesSaved:"Preferenze privacy salvate.",privacyChecked:"Informazioni privacy controllate",privacyOpenCenter:"Apri Centro Privacy e Dati",privacyRole:"Ruolo scelto nella piattaforma",privacyChangeRole:"Cambia ruolo",privacyRestartOnboarding:"Mostra nuovamente la presentazione",privacyStorageNecessary:"Archiviazione locale essenziale",privacyStorageExplanation:"Serve a ricordare progressi e impostazioni richiesti dall’utilizzatore. Cancellando i dati del browser/app, questi contenuti vengono rimossi.",privacyContactController:"Contatto privacy",privacyLegalDraft:"Questo è un riepilogo trasparente interno all’app, non sostituisce una privacy policy definitiva revisionata da un legale prima del lancio commerciale.",privacyDataCount:"Riepilogo dati locali",privacyProfileComplete:"campi profilo",privacyStudyRecords:"registrazioni di studio",privacyPassportChecks:"controlli Passport",privacySchoolRecords:"registrazioni scuola",premiumTagline:"Guida con conoscenza. Rispetta ogni strada. Proteggi ogni passeggero.",premiumEnter:"Entra in Malta Driving Master",premiumLoading:"Preparazione del tuo percorso",premiumSkip:"Salta",premiumTrust:"Creato per strade più sicure e conducenti più preparati",premiumWelcomeBack:"Bentornato",premiumContinue:"Continua il tuo percorso",premiumTodayFocus:"Obiettivo di oggi",premiumNoDelay:"L’introduzione dura pochi secondi e può sempre essere saltata.",premiumReplay:"Rivedi introduzione premium",mdmCoach:"MDM Coach",mdmCoachSub:"La tua guida intelligente offline per la preparazione",coachFoundation:"Fondazione IA",coachOffline:"Intelligenza offline",coachOfflineText:"MDM Coach analizza soltanto i progressi salvati su questo dispositivo. Non è ancora una vera IA online e non invia automaticamente alcun dato.",confidenceScore:"Confidence Score",confidenceMeaning:"Stima della preparazione all’esame",confidenceLow:"Costruisci le fondamenta",confidenceMedium:"La preparazione sta diventando stabile",confidenceHigh:"Preparazione solida",confidenceExcellent:"Rilevato un profilo pronto per l’esame",predictionToday:"Probabilità stimata oggi",predictionWeek:"Probabilità stimata tra 7 giorni",predictionDisclaimer:"È soltanto una guida statistica. Non è una garanzia né una valutazione ufficiale.",coachInsight:"Analisi del Coach",coachNextMove:"Migliore prossima azione",coachImprovement:"Miglioramento recente",coachNoData:"Completa altre attività per ottenere una stima più affidabile.",coachWeakness:"Debolezza principale",coachStrength:"Punto di forza principale",coachTrendUp:"I risultati recenti stanno migliorando.",coachTrendStable:"I risultati recenti sono stabili.",coachTrendDown:"I risultati recenti richiedono attenzione.",dailyMission:"Missione giornaliera",dailyMissionSub:"Una missione breve generata dai tuoi progressi reali",missionStudy:"Completa un blocco di studio mirato",missionReview:"Ripassa domande in scadenza o sbagliate",missionBridge:"Completa un’attività Bridge in inglese",missionComplete:"Missione completata",missionCompletedText:"Hai completato la missione di oggi.",missionMarkDone:"Segna come completato",missionReset:"Azzera missione di oggi",missionProgress:"Avanzamento missione",coachAchievements:"Traguardi del Coach",coachAchievementsSub:"Obiettivi utili, non punti decorativi",achievementFirst25:"Prime 25 domande",achievementFirst100:"100 domande affrontate",achievementExamPass:"Simulazione esame superata",achievementBridge:"Bridge Champion",achievementSafety:"Safety Expert",achievementPassenger:"Passenger Care Master",achievementConsistency:"Costanza di sette giorni",achievementPassport:"Passport completato",achievementLocked:"Bloccato",investorPreview:"Investor Preview",investorPreviewSub:"Una presentazione guidata del valore della piattaforma",investorProblem:"Problema",investorProblemText:"Molti candidati preparati falliscono perché non comprendono pienamente l’inglese dell’esame e perché gli strumenti esistenti non identificano la vera causa degli errori.",investorSolution:"Soluzione",investorSolutionText:"Malta Driving Master riunisce preparazione all’esame, diagnosi linguistica, documenti, confronto scuole e strumenti professionali per le scuole.",investorStudentValue:"Valore per lo studente",investorSchoolValue:"Valore per la scuola",investorStudentPoints:"Bridge Test, Roadmap personalizzata, Passport, studio guidato, simulazioni e rapporti",investorSchoolPoints:"Profili, gruppi studenti, dashboard, richieste qualificate, rapporti e futuri strumenti in abbonamento",investorDifferentiator:"Elemento distintivo",investorDifferentiatorText:"La piattaforma distingue la mancanza di conoscenza dalla difficoltà linguistica e accompagna il candidato dallo studio fino al Driver Permit Tag.",investorScale:"Scalabilità",investorScaleText:"La stessa struttura può estendersi ad altre lingue, categorie di patente, scuole e mercati dei conducenti professionali.",investorStatus:"Stato attuale del prototipo",investorStatusText:"PWA offline funzionante con 250 domande attive, area Studente, School Partner, Centro Privacy, Roadmap, Passport e base MDM Coach.",investorArchitecture:"Architettura",investorArchitectureText:"Versione attuale: HTML, CSS e JavaScript su GitHub Pages. Lancio commerciale: backend sicuro, account, database, pagamenti e collegamento IA protetto.",investorOpen:"Apri Investor Preview",investorShare:"Condividi sintesi investitore",investorCopy:"Copia sintesi investitore",investorCopied:"Sintesi investitore copiata.",investorMetrics:"Metriche del prototipo",investorActiveQuestions:"Domande attive",investorCoreModules:"Moduli principali",investorLanguages:"Lingue",investorUserTypes:"Tipi di utenti",coachOpen:"Apri MDM Coach",coachUpdated:"Coach aggiornato",coachDataPoints:"dati analizzati",coachScoreComponents:"Componenti del punteggio",coachAccuracy:"Precisione",coachCoverage:"Copertura",coachExam:"Simulazioni",coachBridge:"Risultato Bridge",coachConsistency:"Costanza",coachReview:"Disciplina di ripasso",coachExplain:"Come viene calcolata la stima",coachExplainText:"Il punteggio combina precisione, copertura, simulazioni, Bridge Test, costanza e comportamento nei ripassi.",coachReset:"Azzera missione Coach",coachResetConfirm:"Azzerare soltanto lo stato della missione di oggi? I progressi non saranno cancellati.",coachResetDone:"Missione di oggi azzerata.",coachRecovery:"Coach Spiegazione e Recupero",coachRecoverySub:"Comprendi perché sbagli e segui un piano di recupero mirato",recoveryOffline:"Analisi personalizzata offline",recoveryOfflineText:"La diagnosi utilizza risposte salvate e cause degli errori indicate da te. Non inventa dati personali e non contatta un’IA esterna.",recoveryDiagnosis:"Diagnosi degli errori",recoveryDominantCause:"Causa più frequente",recoveryRecordedErrors:"Cause registrate",recoveryNoReasons:"Non hai ancora registrato cause. Durante lo studio guidato indica perché hai sbagliato.",recoveryReasonRule:"Conoscenza della regola",recoveryReasonLanguage:"Frase inglese",recoveryReasonWord:"Parola sconosciuta",recoveryReasonMultiple:"Selezione di più risposte",recoveryReasonRush:"Risposta troppo veloce",recoveryReasonUnsure:"Poca sicurezza",recoveryPrescription:"Prescrizione del Coach",recoveryRuleAdvice:"Studia prima la regola, poi rispondi a cinque domande dello stesso argomento senza usare la traduzione.",recoveryLanguageAdvice:"Usa Bridge Test e Sentence Coach prima di ripetere le stesse domande in inglese.",recoveryWordAdvice:"Ripassa parole chiave e frasario, poi ascolta lentamente prima di riprovare.",recoveryMultipleAdvice:"Leggi due volte l’istruzione e conta quante risposte devi selezionare prima di scegliere.",recoveryRushAdvice:"Fermati tre secondi, identifica il pericolo o l’obbligo e solo dopo seleziona la risposta.",recoveryUnsureAdvice:"Spiega la regola ad alta voce prima di rispondere. La sicurezza deve derivare dalla regola, non dal tentativo.",recoveryGeneralAdvice:"Continua lo studio guidato e registra la causa dopo ogni errore, così il piano diventerà più preciso.",recoveryPriorityQuestions:"Domande prioritarie di recupero",recoveryPrioritySub:"Selezionate da errori, cause ripetute e argomenti deboli",recoveryStartQuestion:"Studia questa domanda",recoveryMarkResolved:"Segna risolta",recoveryResolved:"Risolta",recoveryNoQuestions:"Non sono ancora disponibili domande prioritarie.",recoveryResetResolved:"Azzera domande risolte",recoveryResetConfirm:"Azzerare lo stato risolto delle domande di recupero?",recoveryResetDone:"Stato delle domande risolte azzerato.",coachDialogue:"Chiedi a MDM Coach",coachDialogueSub:"Scegli una domanda per ricevere una risposta trasparente basata sui tuoi dati",coachAskWhy:"Perché continuo a sbagliare?",coachAskEnglish:"L’inglese è il mio problema principale?",coachAskReady:"Sono pronto per il vero esame?",coachAskNext:"Cosa devo fare adesso?",coachAnswerWhy:"Il tuo andamento attuale mostra",coachAnswerEnglishHigh:"L’inglese sembra una barriera importante. Il Bridge deve venire prima di altre simulazioni complete.",coachAnswerEnglishLow:"Al momento l’inglese non è la barriera principale. Concentrati maggiormente sulle regole e sugli argomenti deboli.",coachAnswerReadyHigh:"I dati mostrano una preparazione solida, ma devi mantenerla con ripassi programmati e simulazioni realistiche.",coachAnswerReadyMedium:"Stai migliorando, ma i risultati non sono ancora abbastanza stabili per consigliarti l’esame con sicurezza.",coachAnswerReadyLow:"Servono più studio guidato e maggiore copertura prima di affidarti alle simulazioni complete.",coachAnswerNext:"La tua migliore prossima azione è",recoveryPlan:"Piano di recupero in tre passaggi",recoveryStepUnderstand:"Comprendi",recoveryStepPractise:"Allenati",recoveryStepVerify:"Verifica",recoveryUnderstandText:"Leggi la spiegazione e identifica la regola o la frase inglese che ha provocato l’errore.",recoveryPractiseText:"Completa una breve sessione mirata utilizzando le domande selezionate.",recoveryVerifyText:"Ripeti successivamente senza traduzione e verifica il risultato in una simulazione.",recoveryScore:"Avanzamento del recupero",recoveryOpen:"Apri Coach Recupero",recoveryReport:"Condividi rapporto recupero",recoveryCopy:"Copia rapporto recupero",recoveryCopied:"Rapporto recupero copiato.",recoveryDataNeeded:"Servono più dati",recoveryResolvedCount:"domande risolte",examDayMode:"Modalità Giorno dell’Esame",examDayModeSub:"Preparazione finale per il giorno del test teorico reale",examDayInternal:"Strumento interno di preparazione",examDayInternalText:"Questa modalità non sostituisce istruzioni ufficiali, documenti richiesti o decisioni di Transport Malta.",examTargetDate:"Data obiettivo dell’esame",examDaysRemaining:"giorni rimanenti",examDateToday:"La data obiettivo è oggi",examDatePassed:"La data obiettivo è trascorsa",examNoDate:"Nessuna data d’esame inserita",finalReadiness:"Preparazione finale",finalReady:"Profilo di preparazione solido",finalAlmost:"Quasi pronto",finalNotReady:"Consigliata altra preparazione",finalReadinessText:"Calcolata da Confidence Score, simulazioni recenti, Bridge, ripassi e checklist di oggi.",examDayChecklist:"Checklist del giorno dell’esame",examDayChecklistSub:"Spunta soltanto ciò che hai realmente preparato",examItemId:"Documento d’identità valido preparato",examItemBooking:"Prenotazione, luogo e dettagli confermati",examItemTime:"Orario di arrivo programmato con margine",examItemRest:"Piano di sonno e riposo preparato",examItemTravel:"Percorso e trasporto confermati",examItemLanguage:"Istruzioni inglesi ripassate",examItemMultiple:"Regole sulle risposte multiple ripassate",examItemEmergency:"Argomenti emergenza e sicurezza ripassati",examItemCalm:"Routine per rispondere con calma compresa",examChecklistProgress:"Avanzamento checklist",examBreathing:"Routine di calma da 60 secondi",examBreathingSub:"Un breve esercizio guidato prima dello studio o dell’esame",examBreathingStart:"Avvia routine di calma",examBreathingIn:"Inspira",examBreathingHold:"Trattieni",examBreathingOut:"Espira",examBreathingDone:"Routine di calma completata",examFinalSimulation:"Simulazione finale",examFinalSimulationSub:"Esegui una simulazione realistica da 35 domande prima di considerarti pronto",examStartFinal:"Avvia simulazione finale",examLastFinalScore:"Ultimo risultato finale",examNoFinalScore:"Nessuna simulazione finale registrata",examQuickReview:"Ripasso finale rapido",examQuickReviewSub:"Le aree a rischio maggiore da rivedere poco prima dell’esame",examReviewSafety:"Sicurezza ed emergenze",examReviewPassengers:"Cura dei passeggeri",examReviewRoad:"Procedure stradali",examReviewEco:"Guida ecosostenibile",examReviewEnglish:"Trappole linguistiche",examOpenTopic:"Apri ripasso",examCertificate:"Certificato interno di preparazione",examCertificateSub:"Rapporto privato che conferma il completamento dei requisiti finali dell’app",examCertificateIssue:"Crea certificato di preparazione",examCertificateLocked:"Completa la checklist e ottieni almeno 30/35 nella simulazione finale.",examCertificateReady:"Certificato disponibile",examCertificateShare:"Condividi certificato",examCertificateCopy:"Copia certificato",examCertificateCopied:"Certificato di preparazione copiato.",examCertificateDisclaimer:"Non è un certificato ufficiale e non ha valore legale o regolamentare.",examReset:"Azzera Modalità Giorno dell’Esame",examResetConfirm:"Azzerare data, checklist e certificato interno? I progressi di studio non saranno cancellati.",examResetDone:"Modalità Giorno dell’Esame azzerata.",examSave:"Salva Giorno dell’Esame",examSaved:"Impostazioni Giorno dell’Esame salvate.",examConfidence:"Confidence Score",examBridge:"Bridge",examRecent:"Simulazione recente",examChecklist:"Checklist",examCalm:"Routine di calma",examFinalStatus:"Stato finale",examReadyMessage:"I dati mostrano una preparazione solida, ma continua a ripassare e segui tutte le istruzioni ufficiali.",examAlmostMessage:"Sei vicino. Completa la checklist e svolgi un’altra simulazione finale.",examNotReadyMessage:"Lavora sugli argomenti deboli, sull’inglese e sulle simulazioni realistiche prima dell’esame.",examRiskAlert:"Rischio principale prima dell’esame",examNoRisk:"Nessun rischio importante rilevato dai dati attuali",examRiskEnglish:"La comprensione dell’inglese può ancora ridurre il risultato",examRiskAccuracy:"La precisione delle risposte non è ancora stabile",examRiskCoverage:"Troppe domande non sono ancora state viste",examRiskSimulation:"Le simulazioni recenti sono sotto l’obiettivo",examRiskChecklist:"La preparazione pratica del giorno dell’esame è incompleta",zeroErrorMode:"Modalità Errore Zero",zeroErrorSub:"Individua e sconfiggi le domande che possono costarti l’esame",zeroErrorInternal:"Analisi personale del rischio",zeroErrorInternalText:"Il rischio utilizza soltanto tentativi, errori, ripassi, cause indicate e argomenti deboli salvati nell’app. È una guida, non una garanzia.",zeroErrorIndex:"Indice Errore Zero",zeroErrorRed:"Rosso — restano debolezze critiche",zeroErrorYellow:"Giallo — stai migliorando, ma restano rischi nascosti",zeroErrorGreen:"Verde — gli errori critici sono sotto controllo",zeroErrorTraffic:"Semaforo della preparazione",zeroErrorCritical:"Domande critiche",zeroErrorDefeated:"Errori sconfitti",zeroErrorUnseen:"Domande ad alto rischio mai viste",zeroErrorRisk:"Indice di rischio",zeroErrorWhy:"Perché è critica",zeroErrorRepeated:"Errore ripetuto",zeroErrorLowRate:"Precisione bassa",zeroErrorDue:"Ripasso in scadenza",zeroErrorWeakTopic:"Appartiene all’argomento più debole",zeroErrorCause:"Causa dell’errore registrata più volte",zeroErrorNeverCorrect:"Mai risposta correttamente",zeroErrorToday:"Top 10 da ripetere oggi",zeroErrorTomorrow:"Top 5 da ripetere domani",zeroErrorTop20:"Top 20 errori critici",zeroErrorTop20Sub:"Ordinati in base ai dati realmente salvati nell’app",zeroErrorStudy:"Elimina questo errore",zeroErrorVerify:"Verifica padronanza",zeroErrorMarkDefeated:"Segna come sconfitto",zeroErrorUndoDefeated:"Riporta tra gli errori critici",zeroErrorDefeatedTitle:"Errori sconfitti",zeroErrorDefeatedSub:"Domande rimosse dalla lista critica",zeroErrorNoCritical:"Non sono ancora disponibili domande critiche. Completa altro studio guidato e simulazioni.",zeroErrorNoDefeated:"Non hai ancora sconfitto alcun errore.",zeroErrorPlan:"Piano automatico di recupero",zeroErrorPlanSub:"Oggi, domani e verifica",zeroErrorTodayText:"Lavora sulle dieci domande irrisolte con rischio più alto.",zeroErrorTomorrowText:"Ripeti cinque domande dopo una pausa per verificare la memoria.",zeroErrorVerifyText:"Conferma la padronanza in inglese senza traduzione e poi in una simulazione completa.",zeroErrorProgress:"Controllo degli errori critici",zeroErrorResolved:"Sconfitto",zeroErrorVerified:"Verificato",zeroErrorNeedsVerify:"Da verificare",zeroErrorReset:"Azzera errori sconfitti",zeroErrorResetConfirm:"Riportare tutte le domande sconfitte nell’analisi critica? I progressi non saranno cancellati.",zeroErrorResetDone:"Stato degli errori sconfitti azzerato.",zeroErrorReport:"Condividi rapporto Errore Zero",zeroErrorCopy:"Copia rapporto Errore Zero",zeroErrorCopied:"Rapporto Errore Zero copiato.",zeroErrorScoreMeaning:"Un indice più alto indica meno rischi critici irrisolti.",zeroErrorDataNeeded:"Servono più dati di studio per una classifica affidabile.",zeroErrorOpen:"Apri Modalità Errore Zero",zeroErrorQuestionCount:"domande attualmente analizzate",zeroErrorStartToday:"Avvia Top 10 di oggi",zeroErrorStartTomorrow:"Avvia Top 5 di domani",zeroErrorStartCritical:"Avvia sessione critica",schoolPortal2:"School Partner 2.0",schoolPortal2Sub:"Crea un profilo scuola più ricco e gestisci strumenti commerciali locali",schoolPortalNotice:"Prototipo commerciale locale",schoolPortalNoticeText:"Profili, prenotazioni, recensioni e richieste restano su questo dispositivo finché non verranno aggiunti backend sicuro e account verificati.",schoolPublicProfile:"Profilo pubblico della scuola",schoolHeadline:"Frase di presentazione",schoolWebsite:"Sito web",schoolWhatsapp:"WhatsApp",schoolLogoText:"Iniziali del logo",schoolSavePublic:"Salva profilo pubblico",schoolPublicSaved:"Profilo pubblico salvato.",schoolVerifiedStatus:"Stato verifica",schoolVerified:"Verificata",schoolUnverified:"Non verificata",schoolInstructors:"Istruttori",schoolInstructorName:"Nome istruttore",schoolInstructorLanguages:"Lingue",schoolInstructorSpeciality:"Specializzazione",schoolInstructorBio:"Breve biografia",schoolAddInstructor:"Aggiungi istruttore",schoolInstructorSaved:"Istruttore salvato.",schoolRemoveInstructor:"Rimuovi istruttore",schoolCourses:"Corsi",schoolCourseTitle:"Titolo del corso",schoolCourseCategory:"Categoria",schoolCoursePrice:"Prezzo",schoolCourseDuration:"Durata",schoolCourseFormat:"Formato",schoolCourseDescription:"Descrizione del corso",schoolAddCourse:"Aggiungi corso",schoolCourseSaved:"Corso salvato.",schoolOffers:"Offerte",schoolOfferTitle:"Titolo offerta",schoolOfferDiscount:"Sconto o vantaggio",schoolOfferExpiry:"Data di scadenza",schoolOfferDescription:"Descrizione offerta",schoolAddOffer:"Aggiungi offerta",schoolOfferSaved:"Offerta salvata.",schoolReviews:"Recensioni",schoolReviewName:"Nome recensore",schoolReviewRating:"Valutazione",schoolReviewText:"Testo recensione",schoolAddReview:"Aggiungi recensione demo",schoolReviewDemo:"Recensione dimostrativa",schoolReviewSaved:"Recensione salvata come demo.",schoolRequests:"Richieste degli studenti",schoolRequestName:"Nome studente",schoolRequestEmail:"E-mail studente",schoolRequestService:"Servizio richiesto",schoolRequestMessage:"Messaggio",schoolAddRequest:"Aggiungi richiesta",schoolRequestStatus:"Stato",schoolRequestNew:"Nuova",schoolRequestContacted:"Contattato",schoolRequestClosed:"Chiusa",schoolRequestSaved:"Richiesta studente salvata localmente.",schoolBookings:"Prenotazioni lezioni",schoolBookingStudent:"Studente",schoolBookingCourse:"Corso",schoolBookingDate:"Data",schoolBookingTime:"Ora",schoolBookingNotes:"Note prenotazione",schoolAddBooking:"Aggiungi prenotazione",schoolBookingSaved:"Prenotazione salvata localmente.",schoolPortalMetrics:"Metriche del portale",schoolPublishedContent:"Contenuti pubblicabili",schoolCommercialTools:"Strumenti commerciali",schoolPortalPreview:"Anteprima per lo studente",schoolPortalPreviewSub:"Anteprima di come potrebbe apparire la scuola dopo la verifica",schoolPortalShare:"Condividi profilo scuola",schoolPortalCopy:"Copia profilo scuola",schoolPortalCopied:"Profilo scuola copiato.",schoolPortalDemo:"Carica demo portale",schoolPortalDemoText:"Aggiunge istruttori, corsi, offerte, recensioni, richieste e prenotazioni inventate.",schoolPortalDemoLoaded:"Demo portale caricata.",schoolPortalClear:"Cancella dati School Partner 2.0",schoolPortalClearConfirm:"Eliminare istruttori, corsi, offerte, recensioni, richieste e prenotazioni da questo dispositivo?",schoolPortalCleared:"Dati School Partner 2.0 cancellati.",schoolPortalRequired:"Completa i campi obbligatori.",schoolRemove:"Rimuovi",schoolStatusUpdate:"Aggiorna stato",schoolNoItems:"Nessun elemento ancora inserito",schoolPriceFrom:"Da",schoolBookNow:"Prenota",schoolRequestInfo:"Richiedi informazioni",schoolContactSchool:"Contatta la scuola",schoolPortalOpen:"Apri School Partner 2.0",instructorPortal:"Portale Istruttore",instructorPortalSub:"Segui gli allievi, assegna esercizi mirati e crea rapporti individuali",instructorLocal:"Prototipo istruttore locale",instructorLocalText:"Assegnazioni, note e dati degli allievi restano su questo dispositivo. Non vengono sincronizzati con account reali.",instructorProfile:"Profilo istruttore",instructorName:"Nome istruttore",instructorEmail:"E-mail istruttore",instructorPhone:"Telefono",instructorLanguages:"Lingue",instructorSpeciality:"Specializzazione",instructorBio:"Biografia",instructorSaveProfile:"Salva profilo istruttore",instructorProfileSaved:"Profilo istruttore salvato.",instructorStudents:"Monitoraggio allievi",instructorStudentsSub:"Utilizza gli studenti locali già inseriti nella Dashboard scuola",instructorNoStudents:"Non ci sono studenti disponibili. Inseriscili prima nella Dashboard scuola.",instructorRisk:"Rischio",instructorPriority:"Priorità",instructorProgress:"Preparazione",instructorBridge:"Bridge",instructorPassport:"Passport",instructorAverage:"Media",instructorAssign:"Assegna esercizio",instructorAssignmentTitle:"Titolo assegnazione",instructorAssignmentType:"Tipo di esercizio",instructorAssignmentDue:"Scadenza",instructorAssignmentPriority:"Priorità",instructorAssignmentNotes:"Note assegnazione",instructorAssignmentStudent:"Studente",instructorSaveAssignment:"Salva assegnazione",instructorAssignmentSaved:"Assegnazione salvata localmente.",instructorAssignmentStudy:"Studio guidato",instructorAssignmentReview:"Ripasso errori",instructorAssignmentBridge:"Bridge Test",instructorAssignmentExam:"Simulazione completa",instructorAssignmentZero:"Sessione Errore Zero",instructorAssignmentPassport:"Attività Passport",instructorLow:"Bassa",instructorMedium:"Media",instructorHigh:"Alta",instructorUrgent:"Urgente",instructorAssignments:"Assegnazioni",instructorNoAssignments:"Non è stata ancora creata alcuna assegnazione.",instructorAssignmentDone:"Completata",instructorAssignmentOpen:"Aperta",instructorToggleDone:"Cambia stato completato",instructorRemoveAssignment:"Rimuovi assegnazione",instructorPrivateNotes:"Note private dell’istruttore",instructorNoteStudent:"Studente",instructorNoteText:"Nota privata",instructorSaveNote:"Salva nota",instructorNoteSaved:"Nota privata salvata localmente.",instructorNoNotes:"Non è stata ancora aggiunta alcuna nota privata.",instructorRemoveNote:"Rimuovi nota",instructorReports:"Rapporti individuali",instructorReportsSub:"Crea un riepilogo per un allievo utilizzando i dati locali",instructorSelectStudent:"Seleziona studente",instructorShareReport:"Condividi rapporto studente",instructorCopyReport:"Copia rapporto studente",instructorReportCopied:"Rapporto studente copiato.",instructorStudentNotFound:"Seleziona uno studente valido.",instructorRecommendedAction:"Azione consigliata",instructorAttention:"Attenzione istruttore",instructorAttentionHigh:"Consigliato supporto immediato",instructorAttentionMedium:"Consigliato controllo mirato",instructorAttentionLow:"Mantieni il piano attuale",instructorMetrics:"Metriche istruttore",instructorActiveAssignments:"Assegnazioni aperte",instructorCompletedAssignments:"Assegnazioni completate",instructorStudentsAtRisk:"Studenti da seguire",instructorDemo:"Carica demo istruttore",instructorDemoText:"Aggiunge assegnazioni e note inventate e chiaramente indicate.",instructorDemoLoaded:"Demo istruttore caricata.",instructorClear:"Cancella dati Portale Istruttore",instructorClearConfirm:"Eliminare profilo istruttore, assegnazioni e note private da questo dispositivo?",instructorCleared:"Dati Portale Istruttore cancellati.",instructorOpenPortal:"Apri Portale Istruttore",aiInstructor:"Istruttore AI",aiInstructorSub:"Spiegazioni contestuali e comprensione guidata per ogni domanda",aiInstructorFoundation:"Fondazione pronta per l’IA",aiInstructorOffline:"Istruttore offline trasparente",aiInstructorOfflineText:"Questa Build utilizza i dati delle domande, i tuoi tentativi e una logica didattica strutturata. Non è ancora collegata a un’IA generativa online.",aiInstructorSettings:"Impostazioni didattiche",aiInstructorLanguage:"Lingua della spiegazione",aiInstructorEnglish:"Inglese",aiInstructorItalian:"Italiano",aiInstructorBilingual:"Inglese + Italiano",aiInstructorLevel:"Livello della spiegazione",aiInstructorSimple:"Semplice",aiInstructorNormal:"Normale",aiInstructorTechnical:"Tecnico",aiInstructorSave:"Salva impostazioni istruttore",aiInstructorSaved:"Impostazioni Istruttore AI salvate.",aiInstructorAsk:"Parla con l’Istruttore AI",aiInstructorUnderstand:"Fammi capire",aiInstructorLesson:"Lezione sulla domanda",aiInstructorSimpleExplanation:"Spiegazione semplice",aiInstructorTechnicalExplanation:"Spiegazione tecnica",aiInstructorMaltaExample:"Esempio reale a Malta",aiInstructorMemoryTip:"Trucco per ricordarla",aiInstructorCommonMistake:"Errore più comune",aiInstructorWrongOptions:"Perché le altre risposte sono sbagliate",aiInstructorSimilar:"Domanda simile da allenare",aiInstructorAttempts:"Volte spiegata",aiInstructorAdaptive:"Metodo adattivo",aiInstructorAdaptiveText:"Il modo di spiegare cambia quando la stessa domanda viene richiesta più volte.",aiInstructorNoQuestion:"Scegli una domanda dalla libreria oppure apri l’Istruttore AI dopo aver risposto a un quiz.",aiInstructorQuestionSearch:"Cerca una domanda per ID o parole",aiInstructorOpenLesson:"Apri lezione",aiInstructorMyTutor:"Il mio Tutor",aiInstructorTutorSub:"Riepilogo di punti forti, debolezze e prossima lezione consigliata",aiInstructorStrong:"Punti forti",aiInstructorWeak:"Da migliorare",aiInstructorNext:"Prossima lezione",aiInstructorExplainedCount:"Domande spiegate",aiInstructorSocratic:"Fammi capire",aiInstructorSocraticSub:"Rispondi a brevi domande finché arrivi da solo alla regola",aiInstructorSocraticStart:"Avvia dialogo guidato",aiInstructorSocraticRestart:"Ricomincia dialogo",aiInstructorSocraticNext:"Continua",aiInstructorSocraticComplete:"Hai raggiunto la regola",aiInstructorSocraticQ1:"Qual è il pericolo, l’obbligo o l’utente vulnerabile principale in questa domanda?",aiInstructorSocraticQ2:"Quale opzione protegge meglio la sicurezza e rispetta direttamente la regola?",aiInstructorSocraticQ3:"Perché le altre opzioni sono meno sicure o meno corrette?",aiInstructorSocraticPrompt:"Scrivi il ragionamento con parole tue",aiInstructorSocraticFeedback1:"Bene. Prima identifica il pericolo o l’obbligo, poi guarda le risposte.",aiInstructorSocraticFeedback2:"Ora confronta ogni opzione con la regola precisa, non con quella che sembra più comoda.",aiInstructorSocraticFeedback3:"Questo confronto finale rende la risposta corretta più facile da ricordare.",aiInstructorSocraticEmpty:"Scrivi una breve risposta prima di continuare.",aiInstructorExplainAgain:"Spiega in modo diverso",aiInstructorPractise:"Allenati su questa domanda",aiInstructorReport:"Condividi lezione",aiInstructorCopy:"Copia lezione",aiInstructorCopied:"Lezione Istruttore AI copiata.",aiInstructorOpen:"Apri Istruttore AI",cloudReady:"Cloud Ready",cloudReadySub:"Architettura locale preparata per una futura sincronizzazione sicura",cloudNotice:"Il cloud non è ancora attivo",cloudNoticeText:"Questa Build prepara identità, dispositivi e coda locale di sincronizzazione. Nessun dato viene caricato online.",cloudUserIdentity:"Identità utente",cloudUserId:"ID utente",cloudDeviceId:"ID dispositivo",cloudDeviceName:"Nome dispositivo",cloudGenerateIdentity:"Genera identità",cloudIdentityReady:"Identità pronta",cloudQueue:"Coda di sincronizzazione",cloudQueueSub:"Eventi locali in attesa di un futuro backend sicuro",cloudPending:"Elementi in attesa",cloudLastSync:"Ultima sincronizzazione",cloudNever:"Mai",cloudLocalBackup:"Backup locale",cloudCloudBackup:"Backup cloud",cloudNotConnected:"Non collegato",cloudWaiting:"In attesa",cloudAddTestEvent:"Aggiungi evento di prova",cloudClearQueue:"Svuota coda",cloudQueueCleared:"Coda di sincronizzazione svuotata.",cloudDeviceManager:"Gestione dispositivi",cloudDeviceManagerSub:"Prepara lo stesso profilo per iPhone, iPad, Android e computer",cloudAddDevice:"Aggiungi dispositivo",cloudDeviceType:"Tipo dispositivo",cloudDeviceLabel:"Nome dispositivo",cloudRemoveDevice:"Rimuovi dispositivo",cloudNoDevices:"Non è stato ancora preparato alcun dispositivo aggiuntivo.",cloudPreparedLogin:"Preparazione login",cloudPreparedLoginText:"L’app è strutturalmente pronta per futuri account studente, scuola e istruttore.",cloudArchitecture:"Stato architettura cloud",cloudIdentityStatus:"Identità",cloudQueueStatus:"Coda",cloudDevicesStatus:"Dispositivi",cloudLoginStatus:"Login",cloudReadyStatus:"Pronto",cloudFutureStatus:"Serve backend futuro",cloudEventQuiz:"Evento progresso quiz",cloudEventProfile:"Evento aggiornamento profilo",cloudEventMission:"Evento missione",cloudEventCreated:"Evento di prova aggiunto alla coda locale.",cloudExportQueue:"Copia coda sync",cloudQueueCopied:"Coda sync copiata.",missions:"Missioni",missionsSub:"Obiettivi concreti che migliorano la preparazione senza trasformarla in un gioco",missionToday:"Missione del giorno",missionSafety:"Missione Sicurezza",missionEnglish:"Missione Inglese",missionZero:"Missione Errore Zero",missionExam:"Missione Esame",missionPassport:"Missione Passport",missionDailyText:"Completa 15 domande con almeno l’80% di precisione.",missionSafetyText:"Completa 10 domande su sicurezza ed emergenze.",missionEnglishText:"Completa un’attività Bridge e ripassa cinque trappole linguistiche.",missionZeroText:"Sconfiggi cinque domande critiche nella Modalità Errore Zero.",missionExamText:"Completa una simulazione da 35 domande.",missionPassportText:"Completa un requisito mancante del Passport.",missionStart:"Avvia missione",missionActive:"Missione attiva",missionComplete:"Completa missione",missionCompleted:"Missione completata",missionProgressLabel:"Avanzamento missione",missionReward:"Ricompensa utile",missionRewardText:"Completando le missioni sblocchi un badge di preparazione e aggiorni il Coach.",missionReset:"Azzera avanzamento missioni",missionResetConfirm:"Azzerare l’avanzamento delle missioni? I dati di studio non saranno cancellati.",missionResetDone:"Avanzamento missioni azzerato.",missionNoActive:"Nessuna missione attiva.",missionChoose:"Scegli una missione",missionBadgeFocus:"Studente concentrato",missionBadgeSafety:"Disciplina nella sicurezza",missionBadgeEnglish:"Sicurezza nell’inglese",missionBadgeZero:"Errori critici sotto controllo",missionBadgeExam:"Disciplina nelle simulazioni",missionBadgePassport:"Percorso verso il permit",missionCompletedCount:"Missioni completate",missionOpen:"Apri Missioni",errorReplay:"Replay dell’Errore",errorReplaySub:"Guarda prima la scelta pericolosa e poi rivedi il comportamento corretto",errorReplayVisual:"Simulazione didattica visiva",errorReplayVisualText:"Le scene sono illustrazioni educative semplificate ricavate dall’argomento della domanda. Non sono schemi stradali ufficiali né prove legali.",errorReplayOpen:"Rivedi questo errore",errorReplayRiskScene:"Scena di rischio",errorReplayCorrectScene:"Scena corretta",errorReplayStep1:"Osserva la situazione",errorReplayStep2:"Individua il pericolo nascosto",errorReplayStep3:"Applica l’azione più sicura e corretta",errorReplayPlay:"Avvia replay",errorReplayRestart:"Ricomincia",errorReplayNext:"Scena successiva",errorReplayPractise:"Allenati su questa domanda",errorReplayUnderstand:"Apri la spiegazione AI",errorReplaySlow:"Lenta",errorReplayNormal:"Normale",errorReplayFast:"Veloce",errorReplayLibrary:"Libreria replay",errorReplayLibrarySub:"Errori e domande ad alto rischio pronti per il ripasso visivo",errorReplayViewed:"Replay visualizzati",errorReplayCompleted:"Replay completati",errorReplayNoQuestion:"Scegli una domanda dalla libreria oppure apri il Replay dopo aver risposto a un quiz.",errorReplaySearch:"Cerca ID domanda o parole",errorReplayOpenScene:"Apri replay",errorReplayWhyDangerous:"Perché la prima scena è pericolosa",errorReplayWhyCorrect:"Perché la seconda scena è corretta",errorReplayDangerText:"La prima azione lascia un pericolo senza controllo oppure ignora un importante obbligo di sicurezza.",errorReplayCorrectText:"L’azione corretta riduce il rischio e applica la regola di sicurezza verificata dalla domanda.",errorReplayBlindSpot:"Rischio angolo cieco",errorReplayCrossing:"Rischio attraversamento pedonale",errorReplayBreakdown:"Rischio guasto o emergenza",errorReplayPassenger:"Rischio sicurezza passeggeri",errorReplayEco:"Rischio guida ecologica",errorReplayGeneral:"Rischio generale della strada",errorReplayShare:"Condividi lezione replay",errorReplayCopy:"Copia lezione replay",errorReplayCopied:"Lezione replay copiata.",installedVersion:"Versione installata",allModulesUpdated:"Tutti i moduli sono allineati",releaseDate:"Data della versione"},
 mt:{home:'Dar',search:'Fittex',assistant:'Assistent LPTV',profile:'Profil',welcome:'Dak kollu li għandek bżonn biex titgħallem u ssuq f’Malta.',continue:'Kompli l-preparazzjoni tiegħek',lptv:'LPTV',lptvSub:'Eżami, studju u żbalji',licences:'Liċenzji tas-sewqan',licencesSub:'Kategoriji użati f’Malta',roadCode:'Kodiċi tat-Triq',roadCodeSub:'Regoli spjegati b’mod ċar',regulations:'Regolamenti',regulationsSub:'Sorsi uffiċjali u aġġornamenti',ai:'Assistent LPTV',aiSub:'Fittex regoli, mistoqsijiet u spjegazzjonijiet offline',profileTitle:'Il-profil tiegħek',startExam:'Eżami realistiku',examDetail:'35 mistoqsija • 45 minuta • tgħaddi 30/35',study:'Studja skont is-suġġett',errors:'Erġa’ agħmel l-iżbalji',progress:'Progress',back:'Lura',translate:'Ittraduċi',listen:'Isma’',explain:'Spjegali',confirm:'Ikkonferma',next:'Li jmiss',exit:'Oħroġ',question:'Mistoqsija',selectOne:'Agħżel tweġiba waħda',selectMany:n=>`Agħżel ${n} tweġibiet`,correct:'Tweġiba korretta',wrong:'Tweġiba ħażina',yourAnswer:'It-tweġiba tiegħek',rightAnswer:'It-tweġiba korretta',passed:'GĦADDEJT',failed:'MA GĦADDEJTX',completed:'Sessjoni lesta',officialSource:'Sors uffiċjali',openSource:'Iftaħ is-sors uffiċjali',language:'Lingwa',theme:'Dehra',light:'Ċar',dark:'Skur',system:'Sistema',clear:'Ħassar il-progress',database:'Database',questions:'mistoqsijiet',searchPlaceholder:'Fittex mistoqsijiet, regoli jew regolamenti…',noResults:'Ma nstab l-ebda riżultat.',assistantIntro:'Staqsi dwar regola, mistoqsija jew suġġett tas-sewqan. L-ewwel infittex fil-kontenut verifikat tal-app.',assistantPlaceholder:'Eżempju: prijorità fir-roundabout, passiġġier anzjan, tunnel…',send:'Ibgħat',assistantLocal:'Tfittxija lokali trasparenti — ebda AI esterna',assistantDisclaimer:'Dan huwa assistent ta’ tfittxija LPTV offline, mhux AI ġenerattiva. Għal deċiżjonijiet legali iċċekkja s-sorsi uffiċjali.',officialEnglish:'Ingliż uffiċjali',italian:'Taljan',maltese:'Malti',maltesePending:'It-traduzzjoni Maltija ta’ dan il-kontenut qed titħejja. It-test uffiċjali bl-Ingliż jibqa’ disponibbli.',categories:'Kategoriji',lastVerified:'Sorsi ċċekkjati',resetConfirm:'Tħassar il-progress kollu?',noErrors:'Għad m’għandekx żbalji salvati.',resume:'Kompli s-sessjoni',newExam:'Eżami ġdid',allTopics:'Is-suġġetti kollha',chooseTopic:'Agħżel suġġett',start:'Ibda',seen:'Rajthom',accuracy:'Preċiżjoni',exams:'Eżamijiet',best:'L-aħjar',last:'L-aħħar riżultat',official:'Bank ta’ preparazzjoni estiż',studyMode:'Modalità ta’ studju',examMode:'Modalità ta’ eżami',noHelpExam:'Traduzzjonijiet u spjegazzjonijiet ikunu disponibbli wara l-eżami.',resultReview:'Ara l-iżbalji',close:'Agħlaq',guidedStudy:'Studju gwidat',guidedStudyDetail:'250 mistoqsija pertinenti • traduzzjoni • awdjo • korrezzjoni immedjata',assistedSimulation:'Simulazzjoni bl-għajnuna',assistedDetail:'35 mistoqsija • traduzzjoni u awdjo • timer fakultattiv',realExamPieta:'Eżami reali ta’ Pietà',realExamDetail:'35 mistoqsija • 45 minuta • Ingliż biss • korrezzjoni fl-aħħar',chooseTimer:'Agħżel it-timer',noTimer:'Mingħajr timer',timer45:'45 minuta',timer30:'30 minuta',startSimulation:'Ibda s-simulazzjoni',guidedMode:'Studju gwidat',assistedMode:'Simulazzjoni bl-għajnuna',realExamMode:'Eżami reali ta’ Pietà',hideTranslation:'Aħbi t-traduzzjoni',translationQuestion:'Mistoqsija bit-Taljan',translationAnswers:'Tweġibiet bit-Taljan',whyCorrect:'Għaliex din it-tweġiba hija korretta',wrongChoiceReason:'L-għażla magħżula ma taqbilx mar-regola mitluba mill-mistoqsija.',fourChapters:"Kors sħiħ",fourChaptersSub:"250 mistoqsija pertinenti fl-4 kapitoli ta’ preparazzjoni",weakAttack:"Taħriġ fuq id-dgħufijiet",weakAttackSub:"Taħriġ adattiv ibbażat fuq l-iżbalji u l-inqas preċiżjoni",topicSafety:"Saħħa, sigurtà u responsabbiltajiet legali",topicSafetyDesc:"Inċidenti, first aid, dokumenti, pieni, operaturi, vetturi u tagħbija sigura",topicCustomer:"Customer care u passiġġieri vulnerabbli",topicCustomerDesc:"Assistenza, diżabilità, kumdità, komunikazzjoni u mġiba professjonali",topicRoad:"Proċeduri u responsabbiltajiet fit-triq",topicRoadDesc:"Regoli, sinjali, junctions, crossings, perikli u defensive driving",topicEco:"Sewqan ekoloġiku u sigur",topicEcoDesc:"Fjuwil, emissjonijiet, ambjent u sewqan effiċjenti",chapterProgress:"Progress tal-kapitlu",startChapter:"Studja dan il-kapitlu",allChapterQuestions:"Il-mistoqsijiet kollha tal-kapitlu",adaptiveTraining:"Taħriġ adattiv",adaptiveTrainingDesc:"L-app tagħti prijorità lill-iżbalji, preċiżjoni baxxa u mistoqsijiet mhux magħmula.",availableWeak:"Mistoqsijiet magħżula għalik",startWeak:"Ibda t-taħriġ fuq id-dgħufijiet",readiness:"Tħejjija għall-eżami",coverage:"Kopertura",recentAverage:"Medja tal-aħħar eżamijiet",recommended:"Il-pass li jmiss",readinessStart:"Bidu",readinessGrowing:"Qed titjieb",readinessAlmost:"Kważi lest",readinessReady:"Lest għat-test reali",recommendStudy:"Agħmel aktar mistoqsijiet ta’ studju.",recommendWeak:"Aħdem fuq l-aktar suġġetti dgħajfa.",recommendExam:"Ipprova eżami realistiku ieħor.",examHistory:"Storja tal-eżamijiet",noExamHistory:"Għad ma lestejt l-ebda eżami realistiku.",passedSmall:"Għaddejt",failedSmall:"Ma għaddejtx",chapterQuestions:"Mistoqsijiet tal-kapitlu",chapterAccuracy:"Preċiżjoni tal-kapitlu",diagnostic:"Dijanjosi personali",dailyPlan:"Pjan tal-lum",dailyPlanSub:"15-il mistoqsija personalizzata biex tkompli l-preparazzjoni",dailyDone:"Progress tal-lum",dailyComplete:"L-għan tal-ġurnata tlesta",startDaily:"Ibda t-taħriġ tal-lum",repeatDaily:"Erġa’ agħmel it-taħriġ tal-lum",streak:"Jiem konsekuttivi",days:"jiem",englishCoach:"English Coach",englishCoachSub:"Kliem importanti tal-LPTV bit-Taljan, eżempji u awdjo",vocabularySearch:"Fittex kelma bl-Ingliż jew bit-Taljan…",knownWords:"Kliem mitgħallem",markKnown:"Immarka bħala mitgħallma",known:"Mitgħallma",savedQuestions:"Mistoqsijiet salvati",savedQuestionsSub:"Żomm mistoqsijiet diffiċli jew importanti għar-reviżjoni",saveQuestion:"Issejvja l-mistoqsija",removeSaved:"Neħħi mis-salvati",noSavedQuestions:"Għad ma ssejvjajt l-ebda mistoqsija.",backup:"Backup tal-progress",backupSub:"Issejvja jew irrestawra r-riżultati u l-istorja",exportBackup:"Esporta backup",importBackup:"Importa backup",backupCreated:"Backup inħoloq.",backupRestored:"Backup ġie rrestawrat.",backupInvalid:"Dan il-file tal-backup mhuwiex validu.",today:"Illum",words:"kliem",example:"Eżempju",dailyGoal:"Għan tal-ġurnata",examCentre:"Ċentru tal-Eżami",examCentreSub:"35 mistoqsija mill-bank estiż ta’ preparazzjoni LPTV",examInstructions:"Istruzzjonijiet tal-eżami",examRuleQuestions:"35 mistoqsija",examRuleTime:"45 minuta",examRulePass:"Tgħaddi b’30/35",examRuleEnglish:"Ingliż biss waqt it-test",examRuleNavigation:"Tista’ timxi bejn il-mistoqsijiet u timmarkahom għar-reviżjoni.",startRealExam:"Ibda l-eżami reali",answered:"Imwieġba",unanswered:"Mhux imwieġba",flagged:"Immarkati",flagQuestion:"Immarka",unflagQuestion:"Neħħi l-marka",navigator:"Navigatur tal-mistoqsijiet",previous:"Lura",finishExam:"Temm l-eżami",pauseExam:"Waqqaf temporanjament",pauseExamConfirm:"Trid twaqqaf l-eżami u tmur lura fil-menu? It-tweġibiet u t-timer jinżammu.",confirmFinish:"Trid tissottometti l-eżami issa?",examSummary:"Sommarju tal-eżami",timeUsed:"Ħin użat",topicResults:"Riżultati skont il-kapitlu",resumeExam:"Kompli l-eżami",autoSubmitted:"Il-ħin skada. L-eżami ġie sottomess awtomatikament.",answerRecorded:"Tweġiba ssejvjata",examQuestionHelp:"Agħżel it-tweġiba. Tista’ tibdilha qabel tissottometti.",examPassTarget:"Għandek bżonn mill-inqas 30 tweġiba korretta.",newRealExam:"Eżami reali ġdid",allAnswered:"Il-mistoqsijiet kollha ġew imwieġba",unansweredWarning:n=>`Għad għandek ${n} mistoqsijiet mhux imwieġba. Tissottometti xorta?`,bankScope:"Bank tal-mistoqsijiet",bankAll:"Il-mistoqsijiet pertinenti kollha",bankCore:"Qalba LPTV",bankRoad:"Estensjoni tas-sigurtà fit-triq",bankAuditTitle:"Bank estiż u separat",bankAuditText:"250 mistoqsija għat-taħriġ: 68 qalba LPTV u 182 dwar is-sigurtà fit-triq.",bankExcludedText:"Esklużi: 31 mistoqsija ta’ operaturi/SOV/ġestjoni u 2 mistoqsijiet amministrattivi tal-liċenzja B.",bankDisclaimer:"Transport Malta ma tippubblikax id-daqs totali tal-bank LPTV. Dan huwa bank ta’ preparazzjoni, mhux il-lista uffiċjali sħiħa.",questionLibrary:"Bank tal-mistoqsijiet",questionLibrarySub:"Fittex, iffiltra u irrevedi l-250 mistoqsija pertinenti",scheduledReview:"Reviżjoni skedata",scheduledReviewSub:"Il-mistoqsijiet jerġgħu lura meta jkun il-ħin biex tirrevedihom",dueNow:"Għar-reviżjoni issa",nextReview:"Reviżjoni li jmiss",startReview:"Ibda r-reviżjoni skedata",noReviewDue:"Illum m’hemmx mistoqsijiet dovuti",reviewReady:"Mistoqsijiet lesti għar-reviżjoni",filterStatus:"Status tal-progress",filterChapter:"Kapitlu",filterBank:"Bank tal-mistoqsijiet",statusAll:"L-istatus kollha",statusUnseen:"Qatt ma ġew studjati",statusWrong:"Imwieġba ħażin",statusSaved:"Salvati",statusDue:"Dovuti għar-reviżjoni",statusMastered:"Mitgħallma",resultsCount:"riżultati",attempts:"Tentattivi",studyNow:"Studja issa",mastered:"Mitgħallma",dueToday:"Irrevedi llum",reviewIn:"Reviżjoni fi",resetFilters:"Neħħi l-filtri",loadMore:"Uri aktar",allChapters:"Il-kapitli kollha",librarySearch:"Fittex bl-Ingliż, bit-Taljan, kategorija jew ID…",reviewSystem:"Reviżjoni intelliġenti",reviewSystemSub:"Tweġibiet korretti jerġgħu lura wara 1, 3, 7, 14 u 30 jum. L-iżbalji jerġgħu lura minnufih.",nextReviewNone:"Għad ma ġiet skedata l-ebda reviżjoni.",masteredQuestions:"Mistoqsijiet mitgħallma",reviewedQuestions:"Mistoqsijiet skedati",sentenceCoach:"Ifhem il-frażi",hideSentenceCoach:"Aħbi l-għajnuna tal-frażi",sentenceCoachSub:"Frażijiet u kliem importanti spjegati bit-Taljan",keyPhrases:"Frażijiet tipiċi tal-eżami",keyWords:"Kliem importanti",slowListen:"Isma’ bil-mod",noKeyTerms:"Ma nstabet l-ebda frażi jew kelma mid-dizzjunarju f’din il-mistoqsija.",phrasebook:"Frażarju tal-eżami",phrasebookSub:"Espressjonijiet komuni fil-mistoqsijiet tat-test tas-sewqan",commonPhrases:"Frażijiet komuni tal-eżami",phraseSearch:"Fittex frażi bl-Ingliż jew bit-Taljan…",learnedPhrases:"Frażijiet mitgħallma",markPhraseKnown:"Immarka l-frażi bħala mitgħallma",phraseKnown:"Frażi mitgħallma",flashcards:"Flashcards tal-frażijiet",flashcardsSub:"Prattika mill-Ingliż għat-Taljan u mit-Taljan għall-Ingliż",englishToItalian:"Ingliż → Taljan",italianToEnglish:"Taljan → Ingliż",revealAnswer:"Uri t-tweġiba",hideAnswer:"Aħbi t-tweġiba",nextCard:"Karta li jmiss",shuffleCards:"Ħawwad il-karti",cardProgress:"Karta",phraseMeaning:"Tifsira bit-Taljan",questionLanguageHelp:"Għajnuna biex tifhem il-mistoqsija",audioNormal:"Veloċità normali",audioSlow:"Veloċità bil-mod",personalDetails:"Dettalji personali",personalDetailsSub:"Imla l-profil u pprepara l-kuntatt tar-reġistrazzjoni",firstName:"Isem",lastName:"Kunjom",emailAddress:"Indirizz elettroniku",addressOptional:"Indirizz (mhux obbligatorju)",ageOptional:"Età (mhux obbligatorja)",saveProfile:"Issejvja l-profil",prepareRegistration:"Ipprepara l-email tar-reġistrazzjoni",profileSaved:"Il-profil ġie ssejvjat fuq dan l-apparat.",profileRequired:"Daħħal isem, kunjom u indirizz elettroniku validu.",privacyRequired:"Aċċetta l-avviż tal-privatezza qabel ir-reġistrazzjoni.",privacyConsent:"Naċċetta li dawn id-dettalji jintbagħtu lil Malta Driving Master għar-reġistrazzjoni u l-assistenza.",updatesConsent:"Nixtieq nirċievi wkoll aġġornamenti importanti bl-email.",privacyNote:"Id-dettalji jibqgħu fuq dan l-apparat. L-app tiftaħ Mail jew Gmail u trid tagħfas Ibgħat.",registrationPrepared:"L-email tar-reġistrazzjoni ġiet ippreparata. Ibgħatha minn Mail jew Gmail.",registrationPending:"Profil mhux komplut",registrationComplete:"Profil komplut",completeProfile:"Imla l-profil tiegħek",completeProfileSub:"Isem, kunjom u email huma obbligatorji għar-reġistrazzjoni.",registrationId:"Kodiċi tar-reġistrazzjoni",adminContact:"Kuntatt amministrattiv",deletePersonalData:"Ħassar id-dettalji personali",deletePersonalDataConfirm:"Tħassar id-dettalji personali ssejvjati fuq dan l-apparat?",personalDataDeleted:"Id-dettalji personali tħassru.",emailInvalid:"Daħħal indirizz elettroniku validu.",ageInvalid:"L-età trid tkun bejn 16 u 100 jew titħalla vojta.",emailNotAutomatic:"Il-ftuħ tal-email ma jibgħathiex awtomatikament.",privacyAndContact:"Privatezza u kuntatt",savedOnDevice:"Issejvjat fuq l-apparat",registrationPreparedOn:"Reġistrazzjoni ppreparata",sendRegistration:"Ibgħat ir-reġistrazzjoni",shareRegistration:"Aqsam ir-reġistrazzjoni",openGmail:"Iftaħ Gmail",openMail:"Iftaħ Mail",copyRegistration:"Ikkopja d-dettalji",registrationCopied:"Id-dettalji tar-reġistrazzjoni ġew ikkupjati.",shareUnavailable:"Il-qsim mhux disponibbli hawn. Uża Gmail, Mail jew Ikkopja.",gmailOpening:"Qed jinfetaħ Gmail…",mailOpening:"Qed jinfetaħ Mail…",sendOptions:"Għażliet biex tibgħat ir-reġistrazzjoni",sendOptionsSub:"Agħżel il-metodu li jaħdem fuq l-apparat tiegħek.",copyFallback:"Id-dettalji huma lesti. Waħħalhom f’email lil:",closeOptions:"Agħlaq",directSendNote:"L-ebda messaġġ ma jintbagħat awtomatikament. Iċċekkja r-riċevitur u agħfas Ibgħat.",detailedHistory:"Storja dettaljata tal-eżamijiet",examDetails:"Dettalji tal-eżami",examDetailsSub:"Iċċekkja kull tweġiba tas-simulazzjoni",viewDetails:"Ara d-dettalji",oldExamSummary:"Dan l-eżami sar qabel l-istorja dettaljata. Huwa disponibbli biss is-sommarju.",correctQuestions:"Mistoqsijiet korretti",wrongQuestions:"Mistoqsijiet żbaljati",unansweredQuestions:"Mistoqsijiet mhux imwieġba",flaggedQuestions:"Mistoqsijiet immarkati",selectedAnswer:"Tweġiba magħżula",noAnswerSelected:"L-ebda tweġiba magħżula",retryExamErrors:"Erġa’ agħmel l-iżbalji ta’ dan l-eżami",shareProgressReport:"Aqsam ir-rapport tal-progress",copyProgressReport:"Ikkopja r-rapport tal-progress",progressReportCopied:"Ir-rapport tal-progress ġie kkupjat.",examReportCopied:"Ir-rapport tal-eżami ġie kkupjat.",shareExamReport:"Aqsam ir-rapport tal-eżami",reportTitle:"Rapport tal-progress Malta Driving Master",registeredUser:"Utent irreġistrat",notProvided:"Mhux indikat",examNumber:"Eżami",examResult:"Riżultat tal-eżami",questionsReviewed:"Mistoqsijiet iċċekkjati",statisticsCorrection:"Statistika tal-eżami kkoreġuta",statisticsCorrectionSub:"Kull mistoqsija tal-eżami issa tingħadd darba biss.",backToProgress:"Lura għall-progress",answerStatus:"Status tat-tweġiba",questionCode:"Kodiċi tal-mistoqsija",examNotFound:"L-eżami ma nstabx.",noMistakesInExam:"M’hemmx żbalji x’terġa’ tagħmel f’dan l-eżami.",reportPrepared:"Ir-rapport ġie ppreparat.",examDate:"Data tal-eżami",passRate:"Rata ta’ suċċess",helpSupport:"Għajnuna u appoġġ",helpSupportSub:"Installa l-app, ara l-funzjonijiet ewlenin u rrapporta problema",installApp:"Installa l-app",installAppSub:"Żid Malta Driving Master mat-telefon bħal app normali",appInstalled:"App installata",appNotInstalled:"L-app għadha mhix installata",installNow:"Installa issa",installIOS:"Fuq iPhone: agħfas Share, agħżel Add to Home Screen u mbagħad Add.",installAndroid:"Fuq Android: iftaħ il-menu tal-browser u agħżel Install app jew Add to Home screen.",installDesktop:"Uża l-ikona jew il-menu tal-browser biex tinstalla l-app.",installUnavailable:"L-installazzjoni awtomatika mhix disponibbli hawn. Segwi l-istruzzjonijiet murija.",installationComplete:"L-installazzjoni tlestiet.",refreshApp:"Aġġorna l-verżjoni tal-app",refreshingApp:"Qed tiġi ċċekkjata l-aħħar verżjoni…",quickGuide:"Gwida ta’ malajr",quickGuideSub:"Iftaħ it-taqsimiet ewlenin tal-app",guideStudy:"Studja bi traduzzjoni, awdjo u korrezzjoni immedjata",guideExam:"Ipprova s-simulazzjoni realistika ta’ 35 mistoqsija",guideProgress:"Iċċekkja r-riżultati, l-iżbalji u l-istorja tal-eżamijiet",guideProfile:"Irreġistra, issejvja l-progress u biddel is-settings",frequentQuestions:"Mistoqsijiet frekwenti",faqBankQ:"Il-250 mistoqsija huma l-bank uffiċjali sħiħ ta’ Transport Malta?",faqBankA:"Le. Huma bank magħżul għat-taħriġ. Transport Malta ma tippubblikax il-bank sħiħ tal-LPTV.",faqOfflineQ:"L-app taħdem mingħajr internet?",faqOfflineA:"Wara li tinfetaħ online u tiġi installata, il-kontenut ewlieni jista’ jaħdem offline. Links esterni u email jeħtieġu internet.",faqDataQ:"Fejn jinżammu l-progress u d-dettalji personali?",faqDataA:"Jinżammu fuq dan l-apparat. Id-dettalji jaslu għand l-amministratur biss meta tibgħat il-messaġġ.",faqUpdateQ:"Kif nirċievi verżjoni ġdida?",faqUpdateA:"Wara build ġdida, iftaħ din il-paġna u agħfas Aġġorna l-verżjoni tal-app.",faqDeleteQ:"Nista’ nħassar id-data tiegħi?",faqDeleteA:"Iva. Id-dettalji personali u l-progress jistgħu jitħassru separatament mill-Profil.",reportProblem:"Irrapporta problema",reportProblemSub:"Iddeskrivi x’ġara. Il-messaġġ jitħejja għall-appoġġ ta’ Malta Driving Master.",supportCategory:"Tip ta’ rapport",supportTechnical:"Problema teknika",supportQuestion:"Mistoqsija jew tweġiba biex tiġi ċċekkjata",supportRegistration:"Problema tar-reġistrazzjoni",supportSuggestion:"Suġġeriment",questionIdOptional:"Kodiċi tal-mistoqsija (mhux obbligatorju)",problemDescription:"Deskrizzjoni",problemPlaceholder:"Spjega x’ġara u x’kont qed tagħmel…",descriptionRequired:"Ikteb deskrizzjoni ta’ mill-inqas 10 karattri.",shareReport:"Aqsam ir-rapport",openSupportGmail:"Iftaħ Gmail",openSupportMail:"Iftaħ Mail",copySupportReport:"Ikkopja r-rapport",supportCopied:"Ir-rapport ġie kkupjat.",supportPrepared:"Ir-rapport ġie ppreparat.",contactSupport:"Kuntatt tal-appoġġ",version:"Verżjoni",privacySummary:"Sommarju tal-privatezza",privacySummaryText:"Id-data tal-istudju u l-profil jibqgħu fuq dan l-apparat. Xejn ma jintbagħat awtomatikament.",openProfile:"Iftaħ il-profil",openStudy:"Iftaħ l-istudju gwidat",openExam:"Iftaħ iċ-Ċentru tal-Eżami",openProgress:"Iftaħ il-progress",standaloneMode:"Modalità app installata",browserMode:"Modalità browser",menuHelp:"Għajnuna",device:"Apparat",currentPage:"Paġna kurrenti",brandSlogan:"Ipprepara għall-eżami. Irrispetta t-triq. Ipproteġi kull passiġġier.",bridgeTest:"Bridge Test",bridgeTestSub:"Jifred l-għarfien tar-regoli mill-fehim tal-Ingliż",bridgeIntro:"L-istess kunċetti jiġu ttestjati l-ewwel bit-Taljan u mbagħad bl-Ingliż tal-eżami.",bridgeQuestions:"Kunċetti għat-test",bridgeStart:"Ibda Bridge Test",bridgePhaseItalian:"Fażi 1 minn 2 — Ir-regola bit-Taljan",bridgePhaseEnglish:"Fażi 2 minn 2 — L-Ingliż tal-eżami",bridgeNoHelp:"Wieġeb mingħajr għajnuna. Id-dijanjosi tidher fl-aħħar.",bridgeTransition:"Il-fażi Taljana tlestiet. Issa wieġeb bl-Ingliż.",bridgeResults:"Riżultat Bridge Test",knowledgeScore:"Għarfien tar-regoli",englishScore:"Fehim tal-Ingliż",masteredConcepts:"Kunċetti mifhuma fiż-żewġ lingwi",languageBarrier:"Ostaklu tal-lingwa",ruleGap:"Nuqqas fl-għarfien tar-regola",recoveredEnglish:"Korretta biss bl-Ingliż",bridgeMeaning:"Id-dijanjosi tiegħek",bridgeLanguageMeaning:"Kont taf ir-regola bit-Taljan iżda żbaljajt bl-Ingliż.",bridgeRuleMeaning:"Ir-regola ma kinitx ċara bit-Taljan.",bridgeMasteredMeaning:"Fhimt ir-regola u l-kliem bl-Ingliż.",trainLanguageBarrier:"Ħarreġ il-lingwa",trainRuleGaps:"Ħarreġ ir-regoli",repeatBridge:"Erġa’ agħmel Bridge Test",latestBridge:"L-aħħar dijanjosi Bridge",noBridgeYet:"Għad ma lestejt l-ebda Bridge Test.",bridgeNotOfficial:"Din hija dijanjosi tat-tagħlim, mhux riżultat uffiċjali.",italianPhase:"Fażi Taljana",englishPhase:"Fażi Ingliża",confirmBridge:"Ikkonferma u kompli",bridgeCompleted:"Bridge Test tlesta.",errorDna:"DNA tal-iżball",errorDnaSub:"Skopri għaliex tiżbalja, mhux biss liema mistoqsijiet",whyWrong:"X’kienet il-kawża ta’ dan l-iżball?",reasonRule:"Ma kontx naf ir-regola",reasonLanguage:"Ma fhimtx il-mistoqsija bl-Ingliż",reasonWord:"Ma kontx naf kelma importanti",reasonMultiple:"Għażilt numru ħażin ta’ tweġibiet",reasonRush:"Qrajt malajr wisq",reasonUnsure:"Ma kontx ċert u qtajt",reasonSaved:"Il-kawża ġiet issejvjata",noErrorDna:"Agħżel il-kawża wara tweġiba ħażina biex jinbena l-profil tiegħek.",trainThisCause:"Ħarreġ din il-kawża",assistantOffline:"OFFLINE",assistantResults:"Riżultati rilevanti",assistantStudyQuestion:"Studja din il-mistoqsija",assistantNoMatch:"Ma sibtx riżultat qawwi. Ipprova kelma qasira bħal roundabout, pedestrian, passenger, tunnel jew brakes.",assistantTry:"Ipprova staqsi",respectRoad:"Irrispetta t-triq",protectPassengers:"Ipproteġi kull passiġġier",assistantFound:n=>`${n} riżultati rilevanti`,findSchool:"Sib skola tas-sewqan",findSchoolSub:"Qabbel is-servizzi u sib l-iskola l-aktar adattata għalik",schoolPartner:"School Partner",schoolPartnerSub:"Ippubblika s-servizzi u rċievi talbiet minn studenti adattati",schoolMarketplace:"Żona tal-iskejjel għall-istudent",schoolMarketplaceSub:"Smart Match iqabbel il-preferenzi tiegħek mas-servizzi ddikjarati mill-iskola.",schoolDemoNotice:"Żona dimostrattiva: dawn huma profili fittizji biex tiġi ttestjata l-pjattaforma. Għad m’hemm l-ebda skola reali reklamata.",smartMatch:"Smart Match",smartMatchSub:"Il-viżibilità mħallsa qatt ma tbiddel il-punteġġ ta’ kompatibbiltà.",matchScore:"kompatibbiltà",yourPreferences:"Il-preferenzi tiegħek",preferredArea:"Żona preferuta",preferredLanguage:"Lingwa tal-għalliem",courseNeeded:"Kors meħtieġ",transmission:"Trasmissjoni",preferredSchedule:"Ħin preferut",supportNeeded:"Appoġġ addizzjonali",areaAll:"Malta kollha",areaNorth:"Tramuntana",areaCentral:"Ċentru",areaSouth:"Nofsinhar",areaGozo:"Għawdex",languageAny:"Kwalunkwe lingwa",courseLptv:"LPTV / TAG",courseB:"Kategorija B",transmissionAny:"Awtomatika jew manwali",automatic:"Awtomatika",manual:"Manwali",scheduleAny:"Kwalunkwe ħin",daytime:"Matul il-jum",evening:"Filgħaxija",weekend:"Tmiem il-ġimgħa",englishSupport:"Appoġġ għall-Ingliż tal-eżami",documentSupport:"Gwida għad-dokumenti u TAG",updateMatches:"Aġġorna l-abbinamenti",schoolsFound:"profili misjuba",schoolDetails:"Dettalji tal-iskola",compareSchools:"Qabbel l-iskejjel",addToCompare:"Żid mal-paragun",removeFromCompare:"Neħħi mill-paragun",compareLimit:"Tista’ tqabbel sa tliet skejjel.",comparisonEmpty:"Agħżel skejjel mil-lista biex tqabbelhom.",servicesOffered:"Servizzi offruti",languagesSpoken:"Lingwi",coursesOffered:"Korsijiet",availability:"Disponibbiltà",pricingBySchool:"Prezzijiet imdaħħla mill-iskola",pricingPending:"Il-prezzijiet jinżammu aġġornati mill-iskola.",requestInformation:"Itlob informazzjoni",studentRequest:"Talba ta’ informazzjoni mill-istudent",requestPrepared:"It-talba ġiet ippreparata.",pilotRequestNotice:"Fil-fażi pilota t-talbiet jintbagħtu lil Malta Driving Master. Aktar tard imorru direttament lill-iskola verifikata.",profileNeededForRequest:"Imla l-profil personali qabel titlob informazzjoni.",demoProfile:"Profil dimostrattiv",verifiedSchool:"Skola verifikata",verificationPending:"Verifika pendenti",sponsored:"Sponsorizzat",sponsoredExplanation:"Servizzi sponsorizzati huma mmarkati u ma jinfluwenzawx Smart Match.",whyMatched:"Għaliex hija adattata",bridgeMatch:"Adattata għall-bżonnijiet tiegħek tal-Ingliż",areaMatch:"Taqbel maż-żona preferuta",languageMatch:"Taqbel mal-lingwa mitluba",scheduleMatch:"Taqbel mal-ħin mitlub",serviceEnglish:"Appoġġ bl-Ingliż",serviceDocuments:"Gwida tad-dokumenti",serviceBridge:"Appoġġ Bridge Test",serviceProgress:"Rapporti tal-progress",serviceVulnerable:"Xenarji tas-sigurtà tal-passiġġieri",servicePickup:"Servizz ta’ ġbir",schoolPlans:"Pjanijiet School Partner",basicPlan:"Profil bażiku",basicPlanSub:"Preżenza b’xejn b’identità verifikata u servizzi essenzjali",proPlan:"School Pro",proPlanSub:"Għodod imħallsa għal servizzi, disponibbiltà, talbiet u gruppi ta’ studenti",featuredPlan:"Servizzi sponsorizzati",featuredPlanSub:"Viżibilità mħallsa, dejjem immarkata u separata minn Smart Match",commercialTerms:"Kundizzjonijiet kummerċjali għandhom jiġu definiti qabel it-tnedija",partnerPrinciples:"Prinċipji tal-pjattaforma",partnerPrincipleVerify:"L-iskejjel jiġu ċċekkjati qabel il-pubblikazzjoni.",partnerPrincipleFair:"Il-ħlas ma jixtrix punteġġ ogħla ta’ kompatibbiltà.",partnerPrincipleControl:"L-istudent jagħżel liema progress jaqsam.",applySchoolPartner:"Applika bħala School Partner",schoolName:"Isem tal-iskola",permitReference:"Permess jew referenza uffiċjali",schoolEmail:"Email tal-iskola",schoolPhone:"Telefon",schoolArea:"Żona operattiva",schoolLanguages:"Lingwi offruti",schoolServices:"Servizzi għall-pubblikazzjoni",schoolPrices:"Prezzijiet jew ħlas",schoolAvailability:"Disponibbiltà u ħin ta’ stennija",schoolDescription:"X’jagħmel lill-iskola differenti?",choosePlan:"Pjan ta’ interess",partnerConsent:"Nikkonferma li l-informazzjoni hija korretta u tista’ tiġi ċċekkjata qabel il-pubblikazzjoni.",saveSchoolDraft:"Issejvja l-abbozz",sendPartnerApplication:"Ibgħat l-applikazzjoni",partnerDraftSaved:"L-abbozz tal-iskola ġie ssejvjat.",partnerRequired:"Daħħal l-isem, il-permess, email valida u aċċetta d-dikjarazzjoni.",partnerSendOptions:"Ibgħat l-applikazzjoni",noRealSchoolYet:"Għad ma ġiet approvata l-ebda skola reali f’dan il-prototip.",studentArea:"Żona tal-istudent",schoolAreaTitle:"Żona tal-iskola",smartMatchDiagnosis:"Bridge Test u l-preferenzi tiegħek jistgħu jtejbu l-abbinament.",paidServiceLabel:"Servizz imħallas",clearComparison:"Neħħi l-paragun",lptvPassport:"LPTV Passport",lptvPassportSub:"Il-mixja personali tiegħek mit-taħriġ sal-Driver Permit Tag",passportOfficialUpdate:"Aġġornament uffiċjali importanti",passportOfficialUpdateText:"Mid-29 ta’ Lulju 2026, applikant ġdid LPTV irid ikun ilu jżomm liċenzja B valida tal-UE għal mill-inqas sentejn u ma jkollux aktar minn sitt punti ta’ penali.",passportChecked:"Informazzjoni uffiċjali ċċekkjata",passportMode:"Tip ta’ applikazzjoni",passportNew:"L-ewwel applikazzjoni",passportRenewal:"Tiġdid tat-TAG",passportApplicantType:"Kategorija tal-applikant",passportMaltese:"Ċittadin Malti",passportEU:"Ċittadin UE/ŻEE/Svizzera mhux Malti",passportTCN:"Ċittadin ta’ pajjiż terz",passportStatus:"Status tal-applikazzjoni",passportPlanning:"Ippjanar",passportCollecting:"Ġbir tad-dokumenti",passportReady:"Lesta għas-sottomissjoni",passportSubmitted:"Applikazzjoni sottomessa",passportEligibilityLetter:"Ittra ta’ eliġibbiltà / pass ta’ Identità",passportWaiting:"Qed tistenna l-ħruġ",passportIssued:"TAG maħruġ",passportChecklist:"Lista personali",passportChecklistSub:"Immarka biss dokumenti li għandek jew passi li lestejt.",passportCompleted:"komplut",passportEligibility:"Kontroll tal-eliġibbiltà",passportLicenceSince:"Liċenzja B miżmuma minn",passportPenaltyPoints:"Punti ta’ penali attwali",passportEligibleDate:"Ir-rekwiżit tas-sentejn jintlaħaq",passportLicenceTooNew:"Il-liċenzja B għadha ma ilha sentejn.",passportPointsBlocked:"Aktar minn sitt punti ta’ penali jwaqqfu applikazzjoni ġdida.",passportEligibilityUnknown:"Daħħal id-data tal-liċenzja u l-punti biex tiċċekkja.",passportBasicEligible:"Il-kundizzjonijiet bażiċi jidhru sodisfatti.",passportDates:"Skadenzi u validità",passportDatesSub:"Il-validità tat-TAG tista’ tkun limitata mill-ewwel skadenza tad-dokumenti applikabbli.",passportDrivingExpiry:"Skadenza tal-liċenzja",passportResidenceExpiry:"Skadenza tad-dokument ta’ residenza",passportEmploymentExpiry:"Skadenza tal-awtorizzazzjoni tax-xogħol",passportOperatorExpiry:"Skadenza tal-liċenzja tal-operatur",passportTagExpiry:"Skadenza tat-TAG",passportMedicalDate:"Data taċ-ċertifikat mediku",passportApplicationDate:"Data tal-applikazzjoni",passportEarliestExpiry:"L-ewwel skadenza mdaħħla",passportNoExpiry:"L-ebda skadenza mdaħħla",passportDaysRemaining:"jiem fadal",passportExpired:"skadut",passportCalendar:"Oħloq tfakkiriet tal-Kalendarju",passportCalendarSub:"Joħloq fajl .ics bi tfakkiriet qabel l-iskadenzi.",passportCalendarCreated:"Il-fajl tal-kalendarju nħoloq.",passportCalendarMissing:"Daħħal mill-inqas data waħda.",passportNotes:"Noti personali",passportSave:"Issejvja Passport",passportSaved:"LPTV Passport ġie ssejvjat.",passportShare:"Aqsam ir-rapport Passport",passportCopy:"Ikkopja r-rapport Passport",passportCopied:"Ir-rapport Passport ġie kkupjat.",passportReset:"Irrisettja Passport",passportResetConfirm:"Tħassar il-lista, id-dati u n-noti?",passportResetDone:"LPTV Passport ġie rrisettjat.",passportOfficialDocuments:"Formoli u gwida uffiċjali",passportOfficialWarning:"Niżżel dejjem l-aħħar formoli minn Transport Malta. Din il-lista ma tissostitwixxix deċiżjoni uffiċjali.",passportSubmissionOffices:"Uffiċċji tas-sottomissjoni",passportSubmissionText:"L-applikazzjonijiet jistgħu jitressqu f’Paola, Ħal Lija jew Victoria, Għawdex. Iċċekkja l-ħinijiet.",passportFeeNew:"L-ewwel applikazzjoni: €17.50 skont il-paġna uffiċjali. Jista’ japplika ħlas ieħor ta’ €10 għall-kodiċi 103.",passportFeeRenew:"Tiġdid: €12.",passportTagNotPermission:"Ittra ta’ eliġibbiltà mhijiex TAG u ma tawtorizzax sewqan sakemm jinħareġ it-TAG.",passportValidityRule:"Il-validità ma tistax taqbeż l-ewwel skadenza rilevanti tad-dokumenti.",passportDocId:"ID jew dokument ta’ residenza validu",passportDocLicence:"Liċenzja B tal-UE valida",passportDocTwoYears:"Liċenzja B għal mill-inqas sentejn",passportDocPoints:"Mhux aktar minn sitt punti",passportDocCourse:"Ċertifikat tal-kors Customer Care LPTV",passportDocDPA13:"Formola DPA13 kompluta",passportDocDPA14:"Formola DPA14 kompluta",passportDocMedical:"Ċertifikat mediku DRV032",passportDocCriminalLocal:"Rekord kriminali lokali",passportDocCriminalForeign:"Rekord kriminali barrani fejn japplika",passportDocPoliceConduct:"Ċertifikat tal-kondotta tal-Pulizija",passportDocPhoto:"Ritratt fejn japplika",passportDocFeeNew:"Ħlasijiet tal-ewwel applikazzjoni",passportDocFeeRenew:"Ħlas tat-tiġdid",passportDocJobsplus:"Dokumenti JobsPlus bħala Cab Driver",passportDocDPA16:"DPA16 jew liċenzja LPTS valida għall-awtoimpjegat",passportDocOperator15:"Liċenzja tal-operatur valida għal aktar minn 15-il jum",passportDocSinglePermit:"Dokumenti tax-xogħol/residenza korretti",passportDocSignatory:"Kopja tal-ID tal-firmatarju fejn meħtieġ",passportDocBluePaper:"Blue paper għal tiġdid biss f’każijiet limitati",passportDocCopyLicence:"Kopja tal-liċenzja",passportGeneral:"Rekwiżiti ġenerali",passportTCNExtra:"Rekwiżiti addizzjonali TCN",passportSubmission:"Sottomissjoni u ħlas",passportOpen:"Iftaħ dokument uffiċjali",passportDPA13:"DPA13 — l-ewwel applikazzjoni",passportDPA14:"DPA14 — tiġdid",passportDPA16:"DPA16 — dikjarazzjoni ta’ min iħaddem",passportDRV032:"DRV032 — ċertifikat mediku",passportSOPT01:"SOPT 01 — l-ewwel applikazzjonijiet",passportSOPT02:"SOPT 02 — tiġdid",passportOperatorGuide:"Gwida tal-operatur LPTV",passportMainPage:"Paġna uffiċjali LPTV",passportTraining:"Taħriġ u testijiet approvati",passportDownloads:"Formoli Transport Malta",passportContact:"Kuntatt u ħinijiet",passportCurrentProgress:"Progress Passport",passportRequiredComplete:"rekwiżiti kompluti",passportAttention:"Jeħtieġ attenzjoni",passportGood:"Mixja tajba",passportNoBackend:"Id-data tibqa’ fuq dan l-apparat u tidħol fil-backup.",passportOpenDirect:"Iftaħ direttament",passportShareOfficial:"Aqsam / iftaħ f’Safari",passportOfficialCopied:"Il-link uffiċjali ġie kkupjat.",passportOfficialShareText:"Dokument uffiċjali ta’ Transport Malta",passportCalendarShared:"Il-fajl tal-kalendarju ntbagħat fil-menu Share tal-iPhone.",passportCalendarCopiedFallback:"Dan il-browser ma jistax jesporta l-fajl. Il-lista tat-tfakkiriet ġiet ikkupjata.",passportCalendarOpenSafariNote:"F’Koder uża Share u agħżel Save to Files. F’Safari tkun tista’ wkoll tniżżel il-fajl .ics.",passportKoderFix:"Kontrolli kompatibbli ma’ Koder",personalRoadmap:"Personal Roadmap",personalRoadmapSub:"Mixja ċara mill-istudju tal-lum sal-eżami u d-Driver Permit Tag",roadmapInternalEstimate:"Stima interna — mhijiex deċiżjoni uffiċjali ta’ eliġibbiltà",roadmapJourneyScore:"Punteġġ tal-mixja",roadmapNextAction:"L-aħjar azzjoni li jmiss",roadmapDoNow:"Agħmilha issa",roadmapWhy:"Għaliex tiġi l-ewwel",roadmapToday:"Illum",roadmapWeek:"Is-7 passi li jmiss",roadmapWeekSub:"Sekwenza ġġenerata mill-progress reali tiegħek",roadmapSettings:"Settings tal-pjan",roadmapTargetDate:"Data tal-mira",roadmapDailyMinutes:"Minuti għal kull jum ta’ studju",roadmapStudyDays:"Jiem ta’ studju fil-ġimgħa",roadmapMainGoal:"Għan ewlieni",roadmapGoalExam:"Għaddi mit-test teoriku",roadmapGoalTag:"Ikseb id-Driver Permit Tag",roadmapSavePlan:"Issejvja l-pjan",roadmapPlanSaved:"Personal Roadmap ġiet issejvjata.",roadmapNoTarget:"L-ebda data tal-mira",roadmapDaysToTarget:"jiem sal-mira",roadmapTargetToday:"Il-mira hija llum",roadmapTargetPassed:"Id-data tal-mira għaddiet",roadmapStudyScore:"Preparazzjoni għall-eżami",roadmapEnglishScore:"Ingliż / Bridge",roadmapPassportScore:"Dokumenti / Passport",roadmapDailyScore:"Drawwa tal-lum",roadmapCoverage:"Kopertura tal-mistoqsijiet",roadmapAccuracy:"Preċiżjoni",roadmapExamAverage:"Medja tal-aħħar eżamijiet",roadmapPassportProgress:"Progress Passport",roadmapBridgeProgress:"L-aħħar Bridge",roadmapWeakestTopic:"Suġġett li jeħtieġ l-aktar attenzjoni",roadmapAchievements:"Miri milħuqa",roadmapAchievementsSub:"Progress li diġà ksibt",roadmapLocked:"Għadu mhux milħuq",roadmapShare:"Aqsam ir-rapport Roadmap",roadmapCopy:"Ikkopja r-rapport Roadmap",roadmapCopied:"Ir-rapport ġie kkupjat.",roadmapActionProfile:"Imla l-profil personali",roadmapReasonProfile:"Id-dettalji huma meħtieġa għar-rapporti u t-talbiet lill-iskejjel.",roadmapActionDaily:"Imla l-pjan tal-istudju tal-lum",roadmapReasonDaily:"Sessjoni qasira kuljum tibni memorja stabbli.",roadmapActionReview:"Irrevedi l-mistoqsijiet dovuti",roadmapReasonReview:"Ir-ripetizzjoni skedata tipprevjeni li tinsa.",roadmapActionBridge:"Agħmel Bridge Test",roadmapReasonBridge:"L-app trid tifred l-għarfien mir-restrizzjoni tal-Ingliż.",roadmapActionEnglish:"Ħarreġ il-barriera tal-Ingliż",roadmapReasonEnglish:"L-aħħar Bridge juri li l-Ingliż qed inaqqas il-punteġġ.",roadmapActionCoverage:"Kompli l-istudju gwidat",roadmapReasonCoverage:"Għad hemm wisq mistoqsijiet mhux ipprattikati.",roadmapActionAccuracy:"Attakka l-aktar suġġett dgħajjef",roadmapReasonAccuracy:"Il-preċiżjoni trid tkun stabbli qabel simulazzjonijiet sħaħ.",roadmapActionExam:"Agħmel simulazzjoni sħiħa",roadmapReasonExam:"Jeħtieġ test ta’ 35 mistoqsija biex jitkejjel il-livell reali.",roadmapActionPassport:"Kompli l-LPTV Passport",roadmapReasonPassport:"L-istudju u d-dokumenti għandhom jimxu flimkien.",roadmapActionSchool:"Qabbel skejjel adattati",roadmapReasonSchool:"Il-progress jista’ jgħinek tagħżel l-appoġġ it-tajjeb.",roadmapActionReady:"Żomm il-livell miksub",roadmapReasonReady:"Int fit-triq it-tajba: kompli b’reviżjoni u simulazzjonijiet.",roadmapStepDaily:"Studju adattiv ta’ kuljum",roadmapStepWeak:"Attakk tas-suġġett dgħajjef",roadmapStepBridge:"Sessjoni Bridge bl-Ingliż",roadmapStepReview:"Reviżjoni skedata",roadmapStepExam:"Simulazzjoni sħiħa",roadmapStepPassport:"Passport u dokumenti",roadmapStepReflect:"Kontroll tal-progress",roadmapAchievementProfile:"Profil personali komplut",roadmapAchievement25:"L-ewwel 25 mistoqsija",roadmapAchievement100:"100 mistoqsija differenti",roadmapAchievementExam:"L-ewwel simulazzjoni",roadmapAchievementPass:"Simulazzjoni b’30/35 jew aktar",roadmapAchievementBridge:"Bridge mastery ta’ 80%",roadmapAchievementStreak:"Sebat ijiem konsekuttivi",roadmapAchievementPassport:"Checklist Passport kompluta",roadmapPace:"Ritmu stmat",roadmapPaceText:"Bir-ritmu magħżul, il-mistoqsijiet li fadal jeħtieġu madwar",roadmapSessions:"sessjonijiet",roadmapQuestionsLeft:"mistoqsijiet mhux meqjusa",roadmapRecommended:"Rakkomandat",roadmapOverallGood:"Progress b’saħħtu",roadmapOverallGrowing:"Il-progress qed jikber",roadmapOverallStart:"Ibni l-pedamenti",roadmapReset:"Irrisettja l-pjan",roadmapResetConfirm:"Tirrisettja biss id-data u s-settings? Il-progress ma jitħassarx.",roadmapResetDone:"Is-settings ġew irrisettjati.",roadmapCurrentProgress:"Progress attwali",schoolDashboard:"Dashboard School Partner",schoolDashboardSub:"Immaniġġja prototip lokali ta’ studenti, gruppi, stediniet u rapporti",schoolDashboardLocal:"Prototip lokali",schoolDashboardNotice:"Din id-dashboard taħdem biss fuq dan l-apparat. Ma toħloqx kontijiet reali u ma tissinkronizzax data privata online.",openDashboard:"Iftaħ Dashboard tal-iskola",dashboardProfile:"Profil tal-iskola",dashboardProfileCompletion:"Tlestija tal-profil",dashboardReadyReview:"Lest biex jintalab review",dashboardDraftStatus:"L-abbozz għadu mhux komplut",dashboardEditProfile:"Editja l-profil",dashboardPublicPreview:"Preview tal-profil pubbliku",dashboardPublicPreviewSub:"Hekk tista’ tidher l-informazzjoni wara verifika.",dashboardNoSchoolName:"Abbozz ta’ skola bla isem",dashboardPermitHidden:"Permess/referenza mogħtija għar-review",dashboardStudents:"Studenti",dashboardGroups:"Gruppi",dashboardInvites:"Kodiċijiet ta’ stedina",dashboardAverage:"Progress medju manwali",dashboardNoStudents:"Għadu ma żdied l-ebda student.",dashboardNoGroups:"Għadu ma nħoloq l-ebda grupp.",dashboardNoInvites:"Għadu ma nħoloq l-ebda kodiċi.",dashboardManualData:"Il-progress jiddaħħal manwalment u ma jiġix sinkronizzat mal-app tal-istudent.",dashboardAddStudent:"Żid student",dashboardStudentName:"Isem tal-istudent",dashboardStudentEmail:"Email tal-istudent",dashboardStudentCourse:"Kors",dashboardStudentGroup:"Grupp",dashboardStudentProgress:"Preparazzjoni %",dashboardStudentBridge:"Bridge %",dashboardStudentPassport:"Passport %",dashboardStudentStatus:"Status",dashboardStudentNotes:"Noti tal-istudent",dashboardStatusActive:"Attiv",dashboardStatusPaused:"Pawża",dashboardStatusReady:"Lest għall-eżami",dashboardStatusCompleted:"Lest",dashboardNoGroup:"L-ebda grupp",dashboardSaveStudent:"Issejvja student",dashboardUpdateStudent:"Aġġorna",dashboardRemoveStudent:"Neħħi",dashboardStudentRequired:"Daħħal isem u email valida.",dashboardStudentSaved:"L-istudent ġie ssejvjat lokalment.",dashboardStudentRemoved:"L-istudent tneħħa.",dashboardRemoveStudentConfirm:"Tneħħi dan l-istudent mid-dashboard lokali?",dashboardAddGroup:"Oħloq grupp",dashboardGroupName:"Isem tal-grupp",dashboardGroupLanguage:"Lingwa tat-tagħlim",dashboardGroupSchedule:"Ħin",dashboardGroupNotes:"Noti tal-grupp",dashboardSaveGroup:"Issejvja grupp",dashboardGroupRequired:"Daħħal isem tal-grupp.",dashboardGroupSaved:"Il-grupp ġie ssejvjat.",dashboardRemoveGroup:"Neħħi grupp",dashboardRemoveGroupConfirm:"Tneħħi l-grupp? L-istudenti jibqgħu mingħajru.",dashboardGroupRemoved:"Il-grupp tneħħa.",dashboardMembers:"membri",dashboardGenerateInvite:"Oħloq kodiċi ta’ stedina",dashboardInviteGroup:"Stedina għall-grupp",dashboardCreateInvite:"Oħloq kodiċi",dashboardInviteCreated:"Kodiċi dimostrattiv inħoloq.",dashboardInviteWarning:"Il-kodiċijiet huma dimostrattivi sakemm ikun hemm backend u kontijiet siguri.",dashboardShareInvite:"Aqsam stedina",dashboardCopyInvite:"Ikkopja kodiċi",dashboardRemoveInvite:"Ħassar kodiċi",dashboardInviteText:"Stedina Malta Driving Master",dashboardInviteCopied:"L-istedina ġiet ikkupjata.",dashboardReports:"Rapporti tal-iskola",dashboardReportsSub:"Oħloq sommarju mid-data lokali.",dashboardShareReport:"Aqsam ir-rapport",dashboardCopyReport:"Ikkopja r-rapport",dashboardExportCsv:"Esporta studenti CSV",dashboardReportCopied:"Ir-rapport ġie kkupjat.",dashboardCsvShared:"Il-fajl CSV intbagħat fil-menu Share.",dashboardCsvCopied:"Il-kontenut CSV ġie kkupjat.",dashboardDemoData:"Daħħal data dimostrattiva",dashboardDemoDataSub:"Iżid studenti u gruppi fittizji biex tittestja d-dashboard.",dashboardLoadDemo:"Daħħal demo",dashboardDemoConfirm:"Iżżid data dimostrattiva fittizja?",dashboardDemoLoaded:"Id-data dimostrattiva ddaħħlet.",dashboardDemoBadge:"Demo",dashboardClear:"Ħassar id-data tad-dashboard",dashboardClearConfirm:"Tħassar studenti, gruppi u kodiċijiet lokali?",dashboardCleared:"Id-data lokali tħassret.",dashboardSchoolNotes:"Noti interni tal-iskola",dashboardSaveNotes:"Issejvja noti",dashboardNotesSaved:"In-noti ġew issejvjati.",dashboardVerification:"Status tal-verifika",dashboardNotVerified:"Mhux verifikata",dashboardReviewNeeded:"Jeħtieġ review qabel pubblikazzjoni",dashboardPrivacy:"Privatezza tal-istudenti",dashboardPrivacyText:"Iddaħħalx data medika, dokumenti ta’ identità jew rekord kriminali f’dan il-prototip.",dashboardPlan:"Pjan magħżul",dashboardCreated:"Maħluq",dashboardLastUpdated:"L-aħħar aġġornament",dashboardStudentCount:"numru ta’ studenti",dashboardGroupCount:"numru ta’ gruppi",onboardingWelcome:"Merħba f’Malta Driving Master",onboardingWelcomeSub:"Ipprepara għall-eżami. Irrispetta t-triq. Ipproteġi kull passiġġier.",onboardingChooseRole:"Kif se tuża l-pjattaforma?",onboardingStudent:"Student",onboardingStudentSub:"Studju, Bridge Test, Passport, Roadmap u tqabbil tal-iskejjel",onboardingSchool:"Skola tas-sewqan",onboardingSchoolSub:"Profil, dashboard lokali, studenti, gruppi u rapporti",onboardingBoth:"It-tnejn",onboardingBothSub:"Uża ż-żona tal-istudent u School Partner",onboardingDataTitle:"Id-data tiegħek tibqa’ taħt il-kontroll tiegħek",onboardingDataText:"Din il-verżjoni taħżen progress u abbozzi lokalment. Id-data ma tintbagħatx awtomatikament.",onboardingRequiredStorage:"Nifhem li l-ħażna lokali essenzjali tintuża biex issalva l-progress u s-settings.",onboardingTerms:"Qrajt u naċċetta l-informazzjoni, il-limitazzjonijiet u l-użu responsabbli.",onboardingUpdates:"Nixtieq nirċievi aġġornamenti meta nibgħat volontarjament l-email tar-reġistrazzjoni.",onboardingContinue:"Idħol f’Malta Driving Master",onboardingRequired:"Agħżel rwol u aċċetta ż-żewġ dikjarazzjonijiet.",onboardingLocalOnly:"Prototip local-first",onboardingNoTracking:"L-ebda tracking tar-reklamar",onboardingOfficialWarning:"L-app tgħin fit-taħriġ u l-organizzazzjoni iżda ma tissostitwixxix deċiżjoni uffiċjali.",privacyCenter:"Ċentru tal-Privatezza u Data",privacyCenterSub:"Ara x’inhu ssejvjat, esportah u ħassar dak li tagħżel",privacyOverview:"Ħarsa ġenerali tad-data",privacyStoredLocally:"Issejvjat lokalment fuq dan l-apparat",privacySentOnlyByAction:"Jintbagħat biss meta tuża Share, Gmail jew Mail",privacyNoAutomaticUpload:"L-ebda upload awtomatiku f’din il-verżjoni",privacyProfileData:"Profil personali",privacyStudyData:"Progress tal-istudju",privacyPassportData:"LPTV Passport",privacyRoadmapData:"Personal Roadmap",privacySchoolData:"Data tal-iskola u dashboard",privacyPreferencesData:"Preferenzi tal-privatezza",privacyPresent:"Preżenti",privacyEmpty:"Vojt",privacyItems:"elementi",privacyExportTitle:"Esporta d-data",privacyExportText:"Oħloq backup JSON tad-data lokali.",privacyExportAll:"Esporta d-data lokali kollha",privacyDeleteTitle:"Tħassir selettiv",privacyDeleteText:"Ħassar żona waħda mingħajr ma taffettwa l-oħrajn.",privacyDeleteStudy:"Ħassar il-progress tal-istudju",privacyDeleteProfile:"Ħassar il-profil personali",privacyDeletePassport:"Ħassar Passport",privacyDeleteRoadmap:"Ħassar settings Roadmap",privacyDeleteSchool:"Ħassar data tal-iskola",privacyDeleteAll:"Ħassar id-data kollha",privacyDeleteStudyConfirm:"Tħassar tweġibiet, eżamijiet, favoriti u Bridge?",privacyDeleteProfileConfirm:"Tħassar il-profil personali?",privacyDeletePassportConfirm:"Tħassar il-Passport?",privacyDeleteRoadmapConfirm:"Tħassar is-settings Roadmap?",privacyDeleteSchoolConfirm:"Tħassar preferenzi u data tal-iskola?",privacyDeleteAllConfirm:"Tħassar id-data kollha ta’ Malta Driving Master?",privacyDeleted:"Id-data magħżula tħassret.",privacyAllDeleted:"Id-data lokali kollha tħassret.",privacyRequestTitle:"Talba għal data mibgħuta barra l-apparat",privacyRequestText:"Jekk bgħatt email qabel, tista’ tipprepara talba għal aċċess, korrezzjoni jew tħassir.",privacyRequestAccess:"Itlob aċċess",privacyRequestCorrection:"Itlob korrezzjoni",privacyRequestErasure:"Itlob tħassir",privacyRequestPrepared:"It-talba ġiet ippreparata.",privacyRightsNotice:"Id-drittijiet jistgħu jinkludu informazzjoni, aċċess, korrezzjoni, tħassir u portabbiltà.",privacyConsentSettings:"Preferenzi fakultattivi",privacyAnalytics:"Ippermetti statistika anonima futura",privacyMarketing:"Ippermetti komunikazzjonijiet promozzjonali futuri",privacyNotActive:"Dawn il-funzjonijiet mhumiex attivi f’din il-verżjoni.",privacySavePreferences:"Issejvja preferenzi",privacyPreferencesSaved:"Il-preferenzi ġew issejvjati.",privacyChecked:"Informazzjoni ċċekkjata",privacyOpenCenter:"Iftaħ iċ-Ċentru tal-Privatezza",privacyRole:"Rwol magħżul",privacyChangeRole:"Ibdel ir-rwol",privacyRestartOnboarding:"Erġa’ uri l-introduzzjoni",privacyStorageNecessary:"Ħażna lokali essenzjali",privacyStorageExplanation:"Tintuża biex tiftakar progress u settings. It-tħassir tal-ħażna jneħħi d-data.",privacyContactController:"Kuntatt tal-privatezza",privacyLegalDraft:"Dan huwa sommarju fl-app u mhux politika legali finali.",privacyDataCount:"Sommarju tad-data lokali",privacyProfileComplete:"oqsma tal-profil",privacyStudyRecords:"rekords tal-istudju",privacyPassportChecks:"kontrolli Passport",privacySchoolRecords:"rekords tal-iskola",premiumTagline:"Saq b’għarfien. Irrispetta kull triq. Ipproteġi kull passiġġier.",premiumEnter:"Idħol f’Malta Driving Master",premiumLoading:"Qed titħejja l-mixja tiegħek",premiumSkip:"Aqbeż",premiumTrust:"Maħluqa għal toroq aktar siguri u sewwieqa aktar preparati",premiumWelcomeBack:"Merħba lura",premiumContinue:"Kompli l-mixja tiegħek",premiumTodayFocus:"L-għan tal-lum",premiumNoDelay:"L-introduzzjoni ddum ftit sekondi u dejjem tista’ tinqabeż.",premiumReplay:"Erġa’ ara l-introduzzjoni premium",mdmCoach:"MDM Coach",mdmCoachSub:"Il-gwida intelliġenti offline tiegħek",coachFoundation:"Fondazzjoni AI",coachOffline:"Intelliġenza offline",coachOfflineText:"MDM Coach janalizza biss il-progress fuq dan l-apparat. Mhuwiex AI online u ma jibgħatx data awtomatikament.",confidenceScore:"Confidence Score",confidenceMeaning:"Stima tal-preparazzjoni",confidenceLow:"Ibni l-pedamenti",confidenceMedium:"Il-progress qed isir stabbli",confidenceHigh:"Preparazzjoni b’saħħitha",confidenceExcellent:"Mudell lest għall-eżami",predictionToday:"Probabbiltà stmata llum",predictionWeek:"Probabbiltà stmata fi 7 ijiem",predictionDisclaimer:"Gwida statistika biss. Mhijiex garanzija jew valutazzjoni uffiċjali.",coachInsight:"Analiżi tal-Coach",coachNextMove:"L-aħjar azzjoni li jmiss",coachImprovement:"Titjib riċenti",coachNoData:"Agħmel aktar attività biex tikseb stima aħjar.",coachWeakness:"Dgħufija ewlenija",coachStrength:"Saħħa ewlenija",coachTrendUp:"Ir-riżultati qed jitjiebu.",coachTrendStable:"Ir-riżultati huma stabbli.",coachTrendDown:"Ir-riżultati jeħtieġu attenzjoni.",dailyMission:"Missjoni ta’ kuljum",dailyMissionSub:"Missjoni qasira mill-progress reali tiegħek",missionStudy:"Imla blokk ta’ studju",missionReview:"Irrevedi mistoqsijiet dovuti jew żbaljati",missionBridge:"Imla attività Bridge",missionComplete:"Missjoni kompluta",missionCompletedText:"Lestejt il-missjoni tal-lum.",missionMarkDone:"Immarka komplut",missionReset:"Irrisettja l-missjoni",missionProgress:"Progress tal-missjoni",coachAchievements:"Kisbiet tal-Coach",coachAchievementsSub:"Miri utli, mhux punti dekorattivi",achievementFirst25:"L-ewwel 25 mistoqsija",achievementFirst100:"100 mistoqsija",achievementExamPass:"Simulazzjoni mgħoddija",achievementBridge:"Bridge Champion",achievementSafety:"Safety Expert",achievementPassenger:"Passenger Care Master",achievementConsistency:"Sebat ijiem konsistenti",achievementPassport:"Passport komplut",achievementLocked:"Imblukkat",investorPreview:"Investor Preview",investorPreviewSub:"Sommarju gwidat tal-valur tal-pjattaforma",investorProblem:"Problema",investorProblemText:"Ħafna kandidati jonqsu minħabba l-Ingliż u għodod li ma jidentifikawx il-kawża vera tal-iżbalji.",investorSolution:"Soluzzjoni",investorSolutionText:"Malta Driving Master jgħaqqad taħriġ, dijanjosi lingwistika, dokumenti, skejjel u għodod professjonali.",investorStudentValue:"Valur għall-istudent",investorSchoolValue:"Valur għall-iskola",investorStudentPoints:"Bridge Test, Roadmap, Passport, studju gwidat, simulazzjonijiet u rapporti",investorSchoolPoints:"Profili, gruppi, dashboard, talbiet u għodod futuri",investorDifferentiator:"Differenza ewlenija",investorDifferentiatorText:"Il-pjattaforma tifred nuqqas ta’ għarfien minn diffikultà lingwistika.",investorScale:"Skalabbiltà",investorScaleText:"L-istess sistema tista’ tikber għal aktar lingwi u kategoriji.",investorStatus:"Status tal-prototip",investorStatusText:"PWA offline b’250 mistoqsija, Student, School Partner, Privacy, Roadmap, Passport u MDM Coach.",investorArchitecture:"Arkitettura",investorArchitectureText:"Issa: HTML, CSS u JavaScript. Futur: backend sigur, kontijiet, database, pagamenti u AI protetta.",investorOpen:"Iftaħ Investor Preview",investorShare:"Aqsam sommarju",investorCopy:"Ikkopja sommarju",investorCopied:"Is-sommarju ġie kkupjat.",investorMetrics:"Metriċi tal-prototip",investorActiveQuestions:"Mistoqsijiet attivi",investorCoreModules:"Moduli",investorLanguages:"Lingwi",investorUserTypes:"Tipi ta’ utenti",coachOpen:"Iftaħ MDM Coach",coachUpdated:"Coach aġġornat",coachDataPoints:"data analizzata",coachScoreComponents:"Komponenti tal-punteġġ",coachAccuracy:"Preċiżjoni",coachCoverage:"Kopertura",coachExam:"Simulazzjonijiet",coachBridge:"Bridge",coachConsistency:"Konsistenza",coachReview:"Reviżjoni",coachExplain:"Kif tinħadem l-istima",coachExplainText:"Il-punteġġ jgħaqqad preċiżjoni, kopertura, eżamijiet, Bridge, konsistenza u reviżjoni.",coachReset:"Irrisettja missjoni",coachResetConfirm:"Tirrisettja biss il-missjoni tal-lum?",coachResetDone:"Il-missjoni ġiet irrisettjata.",coachRecovery:"Coach Spjegazzjoni u Rkupru",coachRecoverySub:"Ifhem għaliex tiżbalja u segwi pjan immirat",recoveryOffline:"Analiżi personalizzata offline",recoveryOfflineText:"Id-dijanjosi tuża t-tweġibiet u l-kawżi li ddaħħal int. Ma tibgħatx data lil AI esterna.",recoveryDiagnosis:"Dijanjosi tal-iżbalji",recoveryDominantCause:"L-aktar kawża komuni",recoveryRecordedErrors:"Kawżi rreġistrati",recoveryNoReasons:"Għad m’hemmx kawżi rreġistrati.",recoveryReasonRule:"Għarfien tar-regola",recoveryReasonLanguage:"Sentenza bl-Ingliż",recoveryReasonWord:"Kelma mhux magħrufa",recoveryReasonMultiple:"Aktar minn tweġiba waħda",recoveryReasonRush:"Tweġiba mgħaġġla",recoveryReasonUnsure:"Nuqqas ta’ kunfidenza",recoveryPrescription:"Parir tal-Coach",recoveryRuleAdvice:"Studja r-regola u mbagħad wieġeb ħames mistoqsijiet mingħajr traduzzjoni.",recoveryLanguageAdvice:"Uża Bridge Test u Sentence Coach qabel terġa’ tipprova.",recoveryWordAdvice:"Irrevedi l-kliem u isma’ bil-mod.",recoveryMultipleAdvice:"Aqra l-istruzzjoni darbtejn u għodd it-tweġibiet meħtieġa.",recoveryRushAdvice:"Stenna tliet sekondi u identifika r-regola qabel twieġeb.",recoveryUnsureAdvice:"Spjega r-regola qabel twieġeb.",recoveryGeneralAdvice:"Kompli l-istudju u rreġistra l-kawża ta’ kull żball.",recoveryPriorityQuestions:"Mistoqsijiet ta’ rkupru",recoveryPrioritySub:"Magħżula mill-iżbalji u s-suġġetti dgħajfa",recoveryStartQuestion:"Studja din il-mistoqsija",recoveryMarkResolved:"Immarka solvuta",recoveryResolved:"Solvuta",recoveryNoQuestions:"Għad m’hemmx mistoqsijiet ta’ prijorità.",recoveryResetResolved:"Irrisettja mistoqsijiet solvuti",recoveryResetConfirm:"Tirrisettja l-istatus tal-mistoqsijiet?",recoveryResetDone:"L-istatus ġie rrisettjat.",coachDialogue:"Staqsi lil MDM Coach",coachDialogueSub:"Agħżel mistoqsija għal tweġiba bbażata fuq id-data",coachAskWhy:"Għaliex għadni niżbalja?",coachAskEnglish:"L-Ingliż huwa l-problema ewlenija?",coachAskReady:"Jien lest għall-eżami?",coachAskNext:"X’għandi nagħmel issa?",coachAnswerWhy:"Il-mudell tiegħek juri",coachAnswerEnglishHigh:"L-Ingliż jidher bħala barriera importanti.",coachAnswerEnglishLow:"L-Ingliż mhuwiex il-barriera ewlenija bħalissa.",coachAnswerReadyHigh:"Id-data turi preparazzjoni b’saħħitha.",coachAnswerReadyMedium:"Qed titjieb iżda r-riżultati għadhom mhux stabbli.",coachAnswerReadyLow:"Jeħtieġ aktar studju u kopertura.",coachAnswerNext:"L-aħjar azzjoni li jmiss hija",recoveryPlan:"Pjan ta’ tliet passi",recoveryStepUnderstand:"Ifhem",recoveryStepPractise:"Ipprattika",recoveryStepVerify:"Ivverifika",recoveryUnderstandText:"Aqra l-ispjegazzjoni u identifika r-regola jew il-frażi.",recoveryPractiseText:"Agħmel sessjoni qasira bil-mistoqsijiet magħżula.",recoveryVerifyText:"Erġa’ pprova mingħajr traduzzjoni u agħmel simulazzjoni.",recoveryScore:"Progress tar-rkupru",recoveryOpen:"Iftaħ Coach Rkupru",recoveryReport:"Aqsam ir-rapport",recoveryCopy:"Ikkopja r-rapport",recoveryCopied:"Ir-rapport ġie kkupjat.",recoveryDataNeeded:"Jeħtieġ aktar data",recoveryResolvedCount:"mistoqsijiet solvuti",examDayMode:"Modalità Jum l-Eżami",examDayModeSub:"Preparazzjoni finali għall-jum tat-test teoriku",examDayInternal:"Għodda interna",examDayInternalText:"Ma tissostitwixxix istruzzjonijiet uffiċjali jew dokumenti meħtieġa.",examTargetDate:"Data tal-eżami",examDaysRemaining:"jiem fadal",examDateToday:"Id-data hija llum",examDatePassed:"Id-data għaddiet",examNoDate:"L-ebda data",finalReadiness:"Preparazzjoni finali",finalReady:"Preparazzjoni b’saħħitha",finalAlmost:"Kważi lest",finalNotReady:"Jeħtieġ aktar taħriġ",finalReadinessText:"Ibbażata fuq Confidence, simulazzjonijiet, Bridge, reviżjoni u checklist.",examDayChecklist:"Checklist tal-eżami",examDayChecklistSub:"Immarka biss dak li hu verament lest",examItemId:"Dokument validu lest",examItemBooking:"Booking u post ikkonfermati",examItemTime:"Ħin tal-wasla ppjanat",examItemRest:"Pjan ta’ rqad u mistrieħ",examItemTravel:"Rotta u trasport ikkonfermati",examItemLanguage:"Istruzzjonijiet bl-Ingliż riveduti",examItemMultiple:"Regoli ta’ tweġibiet multipli riveduti",examItemEmergency:"Sigurtà u emerġenzi riveduti",examItemCalm:"Rutina ta’ kalma mifhuma",examChecklistProgress:"Progress checklist",examBreathing:"Rutina ta’ kalma ta’ 60 sekonda",examBreathingSub:"Eżerċizzju qasir qabel l-istudju jew l-eżami",examBreathingStart:"Ibda rutina",examBreathingIn:"Ħu nifs",examBreathingHold:"Żomm",examBreathingOut:"Oħroġ in-nifs",examBreathingDone:"Rutina kompluta",examFinalSimulation:"Simulazzjoni finali",examFinalSimulationSub:"Agħmel simulazzjoni ta’ 35 mistoqsija",examStartFinal:"Ibda simulazzjoni finali",examLastFinalScore:"L-aħħar punteġġ",examNoFinalScore:"L-ebda simulazzjoni finali",examQuickReview:"Reviżjoni finali",examQuickReviewSub:"L-oqsma ta’ riskju l-aktar importanti",examReviewSafety:"Sigurtà u emerġenzi",examReviewPassengers:"Kura tal-passiġġieri",examReviewRoad:"Proċeduri tat-triq",examReviewEco:"Sewqan eco",examReviewEnglish:"Nases bl-Ingliż",examOpenTopic:"Iftaħ reviżjoni",examCertificate:"Ċertifikat intern",examCertificateSub:"Rapport privat tal-preparazzjoni",examCertificateIssue:"Oħloq ċertifikat",examCertificateLocked:"Imla l-checklist u ġib mill-inqas 30/35.",examCertificateReady:"Ċertifikat disponibbli",examCertificateShare:"Aqsam ċertifikat",examCertificateCopy:"Ikkopja ċertifikat",examCertificateCopied:"Ċertifikat ikkupjat.",examCertificateDisclaimer:"Mhuwiex ċertifikat uffiċjali.",examReset:"Irrisettja Exam Day",examResetConfirm:"Tirrisettja d-data, checklist u ċertifikat?",examResetDone:"Exam Day ġie rrisettjat.",examSave:"Issejvja",examSaved:"Settings issejvjati.",examConfidence:"Confidence Score",examBridge:"Bridge",examRecent:"Simulazzjoni riċenti",examChecklist:"Checklist",examCalm:"Rutina ta’ kalma",examFinalStatus:"Status finali",examReadyMessage:"Id-data turi preparazzjoni b’saħħitha.",examAlmostMessage:"Kważi lest. Imla l-checklist u agħmel simulazzjoni oħra.",examNotReadyMessage:"Jeħtieġ aktar studju u simulazzjonijiet.",examRiskAlert:"Riskju ewlieni",examNoRisk:"L-ebda riskju kbir",examRiskEnglish:"L-Ingliż jista’ jnaqqas il-punteġġ",examRiskAccuracy:"Il-preċiżjoni mhix stabbli",examRiskCoverage:"Wisq mistoqsijiet għadhom mhux meqjusa",examRiskSimulation:"Is-simulazzjoni hija taħt il-mira",examRiskChecklist:"Il-preparazzjoni prattika mhix kompluta",zeroErrorMode:"Modalità Żero Żbalji",zeroErrorSub:"Sib u għeleb il-mistoqsijiet li jistgħu jiswewlek l-eżami",zeroErrorInternal:"Analiżi personali tar-riskju",zeroErrorInternalText:"Ir-riskju juża biss tentattivi, żbalji, reviżjoni u data maħżuna lokalment.",zeroErrorIndex:"Indiċi Żero Żbalji",zeroErrorRed:"Aħmar — għad hemm riskji kritiċi",zeroErrorYellow:"Isfar — progress iżda għad hemm riskji",zeroErrorGreen:"Aħdar — l-iżbalji kritiċi huma taħt kontroll",zeroErrorTraffic:"Dawl tal-preparazzjoni",zeroErrorCritical:"Mistoqsijiet kritiċi",zeroErrorDefeated:"Żbalji megħluba",zeroErrorUnseen:"Mistoqsijiet ta’ riskju mhux meqjusa",zeroErrorRisk:"Punteġġ tar-riskju",zeroErrorWhy:"Għaliex hija kritika",zeroErrorRepeated:"Żbalji ripetuti",zeroErrorLowRate:"Preċiżjoni baxxa",zeroErrorDue:"Reviżjoni dovuta",zeroErrorWeakTopic:"Mis-suġġett l-aktar dgħajjef",zeroErrorCause:"Kawża ripetuta",zeroErrorNeverCorrect:"Qatt ma kienet korretta",zeroErrorToday:"Top 10 għal-lum",zeroErrorTomorrow:"Top 5 għal għada",zeroErrorTop20:"Top 20 żbalji kritiċi",zeroErrorTop20Sub:"Ikklassifikati mid-data maħżuna",zeroErrorStudy:"Elimina dan l-iżball",zeroErrorVerify:"Ivverifika l-ħakma",zeroErrorMarkDefeated:"Immarka megħlub",zeroErrorUndoDefeated:"Erġa’ poġġi fil-lista",zeroErrorDefeatedTitle:"Żbalji megħluba",zeroErrorDefeatedSub:"Mistoqsijiet imneħħija mil-lista kritika",zeroErrorNoCritical:"Għad m’hemmx mistoqsijiet kritiċi.",zeroErrorNoDefeated:"Għad ma għelebt l-ebda żball.",zeroErrorPlan:"Pjan awtomatiku",zeroErrorPlanSub:"Illum, għada u verifika",zeroErrorTodayText:"Aħdem fuq l-għaxar mistoqsijiet bl-ogħla riskju.",zeroErrorTomorrowText:"Irrepeti ħames mistoqsijiet wara pawża.",zeroErrorVerifyText:"Ivverifika bl-Ingliż mingħajr traduzzjoni u f’simulazzjoni.",zeroErrorProgress:"Kontroll tar-riskji",zeroErrorResolved:"Megħlub",zeroErrorVerified:"Verifikat",zeroErrorNeedsVerify:"Jeħtieġ verifika",zeroErrorReset:"Irrisettja żbalji megħluba",zeroErrorResetConfirm:"Tirritorna l-mistoqsijiet kollha fil-lista kritika?",zeroErrorResetDone:"L-istatus ġie rrisettjat.",zeroErrorReport:"Aqsam ir-rapport",zeroErrorCopy:"Ikkopja r-rapport",zeroErrorCopied:"Ir-rapport ġie kkupjat.",zeroErrorScoreMeaning:"Indiċi ogħla jfisser inqas riskji.",zeroErrorDataNeeded:"Jeħtieġ aktar data.",zeroErrorOpen:"Iftaħ Modalità Żero Żbalji",zeroErrorQuestionCount:"mistoqsijiet analizzati",zeroErrorStartToday:"Ibda Top 10",zeroErrorStartTomorrow:"Ibda Top 5",zeroErrorStartCritical:"Ibda sessjoni kritika",schoolPortal2:"School Partner 2.0",schoolPortal2Sub:"Oħloq profil aktar komplut u għodod kummerċjali lokali",schoolPortalNotice:"Prototip kummerċjali lokali",schoolPortalNoticeText:"Il-profili u bookings jibqgħu fuq dan l-apparat sakemm jiżdied backend sigur.",schoolPublicProfile:"Profil pubbliku tal-iskola",schoolHeadline:"Headline",schoolWebsite:"Website",schoolWhatsapp:"WhatsApp",schoolLogoText:"Inizjali tal-logo",schoolSavePublic:"Issejvja profil",schoolPublicSaved:"Il-profil ġie ssejvjat.",schoolVerifiedStatus:"Status tal-verifika",schoolVerified:"Verifikata",schoolUnverified:"Mhux verifikata",schoolInstructors:"Istrutturi",schoolInstructorName:"Isem tal-istruttur",schoolInstructorLanguages:"Lingwi",schoolInstructorSpeciality:"Speċjalità",schoolInstructorBio:"Bijografija qasira",schoolAddInstructor:"Żid istruttur",schoolInstructorSaved:"L-istruttur ġie ssejvjat.",schoolRemoveInstructor:"Neħħi istruttur",schoolCourses:"Korsijiet",schoolCourseTitle:"Titlu tal-kors",schoolCourseCategory:"Kategorija",schoolCoursePrice:"Prezz",schoolCourseDuration:"Tul",schoolCourseFormat:"Format",schoolCourseDescription:"Deskrizzjoni",schoolAddCourse:"Żid kors",schoolCourseSaved:"Il-kors ġie ssejvjat.",schoolOffers:"Offerti",schoolOfferTitle:"Titlu tal-offerta",schoolOfferDiscount:"Skont jew benefiċċju",schoolOfferExpiry:"Skadenza",schoolOfferDescription:"Deskrizzjoni",schoolAddOffer:"Żid offerta",schoolOfferSaved:"L-offerta ġiet issejvjata.",schoolReviews:"Reviews",schoolReviewName:"Isem",schoolReviewRating:"Rating",schoolReviewText:"Test",schoolAddReview:"Żid review demo",schoolReviewDemo:"Review dimostrattiva",schoolReviewSaved:"Review demo ssejvjata.",schoolRequests:"Talbiet tal-istudenti",schoolRequestName:"Isem tal-istudent",schoolRequestEmail:"Email",schoolRequestService:"Servizz",schoolRequestMessage:"Messaġġ",schoolAddRequest:"Żid talba",schoolRequestStatus:"Status",schoolRequestNew:"Ġdida",schoolRequestContacted:"Ikkuntattjat",schoolRequestClosed:"Magħluqa",schoolRequestSaved:"It-talba ġiet ssejvjata.",schoolBookings:"Bookings",schoolBookingStudent:"Student",schoolBookingCourse:"Kors",schoolBookingDate:"Data",schoolBookingTime:"Ħin",schoolBookingNotes:"Noti",schoolAddBooking:"Żid booking",schoolBookingSaved:"Il-booking ġie ssejvjat.",schoolPortalMetrics:"Metriċi",schoolPublishedContent:"Kontenut",schoolCommercialTools:"Għodod kummerċjali",schoolPortalPreview:"Preview għall-istudent",schoolPortalPreviewSub:"Kif tista’ tidher l-iskola wara verifika",schoolPortalShare:"Aqsam profil",schoolPortalCopy:"Ikkopja profil",schoolPortalCopied:"Il-profil ġie kkupjat.",schoolPortalDemo:"Daħħal demo",schoolPortalDemoText:"Iżid data fittizja.",schoolPortalDemoLoaded:"Demo ddaħħlet.",schoolPortalClear:"Ħassar data",schoolPortalClearConfirm:"Tħassar id-data School Partner 2.0?",schoolPortalCleared:"Id-data tħassret.",schoolPortalRequired:"Imla l-oqsma meħtieġa.",schoolRemove:"Neħħi",schoolStatusUpdate:"Aġġorna status",schoolNoItems:"Għad m’hemm xejn",schoolPriceFrom:"Minn",schoolBookNow:"Ibbukkja",schoolRequestInfo:"Itlob informazzjoni",schoolContactSchool:"Ikkuntattja l-iskola",schoolPortalOpen:"Iftaħ School Partner 2.0",instructorPortal:"Portal tal-Istruttur",instructorPortalSub:"Segwi studenti, assenja xogħol u oħloq rapporti",instructorLocal:"Prototip lokali",instructorLocalText:"Assignments u noti jibqgħu fuq dan l-apparat.",instructorProfile:"Profil tal-istruttur",instructorName:"Isem",instructorEmail:"Email",instructorPhone:"Telefon",instructorLanguages:"Lingwi",instructorSpeciality:"Speċjalità",instructorBio:"Bijografija",instructorSaveProfile:"Issejvja profil",instructorProfileSaved:"Profil issejvjat.",instructorStudents:"Monitoraġġ studenti",instructorStudentsSub:"Juża studenti lokali mid-Dashboard",instructorNoStudents:"Għad m’hemmx studenti.",instructorRisk:"Riskju",instructorPriority:"Prijorità",instructorProgress:"Progress",instructorBridge:"Bridge",instructorPassport:"Passport",instructorAverage:"Medja",instructorAssign:"Assenja xogħol",instructorAssignmentTitle:"Titlu",instructorAssignmentType:"Tip",instructorAssignmentDue:"Data",instructorAssignmentPriority:"Prijorità",instructorAssignmentNotes:"Noti",instructorAssignmentStudent:"Student",instructorSaveAssignment:"Issejvja",instructorAssignmentSaved:"Assignment issejvjat.",instructorAssignmentStudy:"Studju gwidat",instructorAssignmentReview:"Reviżjoni żbalji",instructorAssignmentBridge:"Bridge Test",instructorAssignmentExam:"Simulazzjoni",instructorAssignmentZero:"Zero Error",instructorAssignmentPassport:"Passport",instructorLow:"Baxxa",instructorMedium:"Medja",instructorHigh:"Għolja",instructorUrgent:"Urġenti",instructorAssignments:"Assignments",instructorNoAssignments:"Għad m’hemmx assignments.",instructorAssignmentDone:"Lesta",instructorAssignmentOpen:"Miftuħa",instructorToggleDone:"Ibdel status",instructorRemoveAssignment:"Neħħi",instructorPrivateNotes:"Noti privati",instructorNoteStudent:"Student",instructorNoteText:"Nota privata",instructorSaveNote:"Issejvja nota",instructorNoteSaved:"Nota ssejvjata.",instructorNoNotes:"Għad m’hemmx noti.",instructorRemoveNote:"Neħħi nota",instructorReports:"Rapporti individwali",instructorReportsSub:"Oħloq sommarju għal student",instructorSelectStudent:"Agħżel student",instructorShareReport:"Aqsam rapport",instructorCopyReport:"Ikkopja rapport",instructorReportCopied:"Rapport ikkupjat.",instructorStudentNotFound:"Agħżel student validu.",instructorRecommendedAction:"Azzjoni rakkomandata",instructorAttention:"Attenzjoni",instructorAttentionHigh:"Jeħtieġ appoġġ immedjat",instructorAttentionMedium:"Jeħtieġ follow-up",instructorAttentionLow:"Żomm il-pjan",instructorMetrics:"Metriċi",instructorActiveAssignments:"Assignments miftuħa",instructorCompletedAssignments:"Assignments lesti",instructorStudentsAtRisk:"Studenti ta’ riskju",instructorDemo:"Daħħal demo",instructorDemoText:"Iżid assignments u noti fittizji.",instructorDemoLoaded:"Demo ddaħħlet.",instructorClear:"Ħassar data",instructorClearConfirm:"Tħassar il-profil, assignments u noti?",instructorCleared:"Id-data tħassret.",instructorOpenPortal:"Iftaħ Portal tal-Istruttur",aiInstructor:"Istruttur AI",aiInstructorSub:"Spjegazzjonijiet u tagħlim gwidat għal kull mistoqsija",aiInstructorFoundation:"Fondazzjoni lesta għall-AI",aiInstructorOffline:"Istruttur offline trasparenti",aiInstructorOfflineText:"Din il-Build tuża data lokali u loġika didattika. Għadha mhix marbuta ma’ AI online.",aiInstructorSettings:"Settings tat-tagħlim",aiInstructorLanguage:"Lingwa",aiInstructorEnglish:"Ingliż",aiInstructorItalian:"Taljan",aiInstructorBilingual:"Ingliż + Taljan",aiInstructorLevel:"Livell",aiInstructorSimple:"Sempliċi",aiInstructorNormal:"Normali",aiInstructorTechnical:"Tekniku",aiInstructorSave:"Issejvja settings",aiInstructorSaved:"Settings issejvjati.",aiInstructorAsk:"Kellem lill-Istruttur AI",aiInstructorUnderstand:"Għinni nifhem",aiInstructorLesson:"Lezzjoni tal-mistoqsija",aiInstructorSimpleExplanation:"Spjegazzjoni sempliċi",aiInstructorTechnicalExplanation:"Spjegazzjoni teknika",aiInstructorMaltaExample:"Eżempju f’Malta",aiInstructorMemoryTip:"Mod kif tiftakar",aiInstructorCommonMistake:"Żball komuni",aiInstructorWrongOptions:"Għaliex l-oħrajn huma żbaljati",aiInstructorSimilar:"Mistoqsija simili",aiInstructorAttempts:"Drabi spjegata",aiInstructorAdaptive:"Metodu adattiv",aiInstructorAdaptiveText:"Il-metodu jinbidel meta l-istess mistoqsija tiġi spjegata aktar minn darba.",aiInstructorNoQuestion:"Agħżel mistoqsija jew iftaħ l-Istruttur wara quiz.",aiInstructorQuestionSearch:"Fittex ID jew kliem",aiInstructorOpenLesson:"Iftaħ lezzjoni",aiInstructorMyTutor:"It-Tutur tiegħi",aiInstructorTutorSub:"Saħħiet, dgħufijiet u lezzjoni li jmiss",aiInstructorStrong:"Saħħiet",aiInstructorWeak:"Bżonn titjib",aiInstructorNext:"Lezzjoni li jmiss",aiInstructorExplainedCount:"Mistoqsijiet spjegati",aiInstructorSocratic:"Għinni nifhem",aiInstructorSocraticSub:"Wieġeb mistoqsijiet qosra biex tasal għar-regola",aiInstructorSocraticStart:"Ibda djalogu",aiInstructorSocraticRestart:"Ibda mill-ġdid",aiInstructorSocraticNext:"Kompli",aiInstructorSocraticComplete:"Wasalt għar-regola",aiInstructorSocraticQ1:"X’inhu l-periklu jew obbligu ewlieni?",aiInstructorSocraticQ2:"Liema għażla tipproteġi s-sigurtà?",aiInstructorSocraticQ3:"Għaliex l-għażliet l-oħra huma inqas korretti?",aiInstructorSocraticPrompt:"Ikteb ir-raġunament tiegħek",aiInstructorSocraticFeedback1:"Tajjeb. Sib il-periklu jew obbligu l-ewwel.",aiInstructorSocraticFeedback2:"Qabbel kull għażla mar-regola.",aiInstructorSocraticFeedback3:"Dan il-paragun jgħinek tiftakar.",aiInstructorSocraticEmpty:"Ikteb tweġiba qasira.",aiInstructorExplainAgain:"Spjega b’mod ieħor",aiInstructorPractise:"Ipprattika din il-mistoqsija",aiInstructorReport:"Aqsam lezzjoni",aiInstructorCopy:"Ikkopja lezzjoni",aiInstructorCopied:"Lezzjoni kkupjata.",aiInstructorOpen:"Iftaħ Istruttur AI",cloudReady:"Cloud Ready",cloudReadySub:"Arkitettura lokali għal sinkronizzazzjoni futura",cloudNotice:"Il-cloud għadu mhux attiv",cloudNoticeText:"Din il-Build tipprepara identità, apparati u sync queue lokali. L-ebda data ma tittella’ online.",cloudUserIdentity:"Identità tal-utent",cloudUserId:"User ID",cloudDeviceId:"Device ID",cloudDeviceName:"Isem tal-apparat",cloudGenerateIdentity:"Oħloq identità",cloudIdentityReady:"Identità lesta",cloudQueue:"Sync queue",cloudQueueSub:"Avvenimenti lokali għal backend futur",cloudPending:"Elementi pendenti",cloudLastSync:"L-aħħar sync",cloudNever:"Qatt",cloudLocalBackup:"Backup lokali",cloudCloudBackup:"Cloud backup",cloudNotConnected:"Mhux konness",cloudWaiting:"Qed jistenna",cloudAddTestEvent:"Żid test event",cloudClearQueue:"Ħassar queue",cloudQueueCleared:"Queue tħassret.",cloudDeviceManager:"Device Manager",cloudDeviceManagerSub:"Ipprepara l-istess profil fuq diversi apparati",cloudAddDevice:"Żid apparat",cloudDeviceType:"Tip",cloudDeviceLabel:"Isem",cloudRemoveDevice:"Neħħi",cloudNoDevices:"Għad m’hemmx apparati.",cloudPreparedLogin:"Preparazzjoni login",cloudPreparedLoginText:"L-app hija lesta strutturalment għal accounts futuri.",cloudArchitecture:"Status tal-cloud",cloudIdentityStatus:"Identità",cloudQueueStatus:"Queue",cloudDevicesStatus:"Apparati",cloudLoginStatus:"Login",cloudReadyStatus:"Lest",cloudFutureStatus:"Jeħtieġ backend",cloudEventQuiz:"Quiz event",cloudEventProfile:"Profile event",cloudEventMission:"Mission event",cloudEventCreated:"Event miżjud.",cloudExportQueue:"Ikkopja queue",cloudQueueCopied:"Queue kkupjata.",missions:"Missjonijiet",missionsSub:"Għanijiet konkreti għall-preparazzjoni",missionToday:"Missjoni tal-lum",missionSafety:"Missjoni Sigurtà",missionEnglish:"Missjoni Ingliż",missionZero:"Missjoni Zero Error",missionExam:"Missjoni Eżami",missionPassport:"Missjoni Passport",missionDailyText:"Imla 15-il mistoqsija b’80% preċiżjoni.",missionSafetyText:"Imla 10 mistoqsijiet ta’ sigurtà.",missionEnglishText:"Imla attività Bridge u 5 traps bl-Ingliż.",missionZeroText:"Għeleb 5 mistoqsijiet kritiċi.",missionExamText:"Imla simulazzjoni ta’ 35 mistoqsija.",missionPassportText:"Imla rekwiżit wieħed tal-Passport.",missionStart:"Ibda missjoni",missionActive:"Missjoni attiva",missionComplete:"Imla missjoni",missionCompleted:"Missjoni kompluta",missionProgressLabel:"Progress",missionReward:"Premju utli",missionRewardText:"Missjonijiet jagħtu badge u jaġġornaw il-Coach.",missionReset:"Irrisettja missjonijiet",missionResetConfirm:"Tirrisettja l-progress tal-missjonijiet?",missionResetDone:"Progress irrisettjat.",missionNoActive:"L-ebda missjoni attiva.",missionChoose:"Agħżel missjoni",missionBadgeFocus:"Studju ffukat",missionBadgeSafety:"Dixxiplina tas-sigurtà",missionBadgeEnglish:"Kunfidenza fl-Ingliż",missionBadgeZero:"Żbalji taħt kontroll",missionBadgeExam:"Dixxiplina tas-simulazzjoni",missionBadgePassport:"Vjaġġ tal-permit",missionCompletedCount:"Missjonijiet kompluti",missionOpen:"Iftaħ Missjonijiet",errorReplay:"Replay tal-Iżball",errorReplaySub:"Ara l-għażla perikoluża u mbagħad l-imġiba korretta",errorReplayVisual:"Simulazzjoni viżiva edukattiva",errorReplayVisualText:"Ix-xeni huma illustrazzjonijiet edukattivi simplifikati u mhux dijagrammi uffiċjali.",errorReplayOpen:"Erġa’ ara dan l-iżball",errorReplayRiskScene:"Xena ta’ riskju",errorReplayCorrectScene:"Xena korretta",errorReplayStep1:"Osserva s-sitwazzjoni",errorReplayStep2:"Sib il-periklu",errorReplayStep3:"Agħmel l-azzjoni l-aktar sigura",errorReplayPlay:"Ibda replay",errorReplayRestart:"Ibda mill-ġdid",errorReplayNext:"Xena li jmiss",errorReplayPractise:"Ipprattika l-mistoqsija",errorReplayUnderstand:"Iftaħ l-ispjegazzjoni AI",errorReplaySlow:"Bil-mod",errorReplayNormal:"Normali",errorReplayFast:"Mgħaġġla",errorReplayLibrary:"Librerija replay",errorReplayLibrarySub:"Żbalji u mistoqsijiet ta’ riskju",errorReplayViewed:"Replays meqjusa",errorReplayCompleted:"Replays kompluti",errorReplayNoQuestion:"Agħżel mistoqsija jew iftaħ replay wara quiz.",errorReplaySearch:"Fittex ID jew kliem",errorReplayOpenScene:"Iftaħ replay",errorReplayWhyDangerous:"Għaliex l-ewwel xena hija perikoluża",errorReplayWhyCorrect:"Għaliex it-tieni xena hija korretta",errorReplayDangerText:"L-ewwel azzjoni tħalli riskju mhux ikkontrollat.",errorReplayCorrectText:"L-azzjoni korretta tnaqqas ir-riskju u ssegwi r-regola.",errorReplayBlindSpot:"Riskju ta’ blind spot",errorReplayCrossing:"Riskju ta’ crossing",errorReplayBreakdown:"Riskju ta’ breakdown",errorReplayPassenger:"Riskju tal-passiġġier",errorReplayEco:"Riskju eco",errorReplayGeneral:"Riskju ġenerali",errorReplayShare:"Aqsam il-lezzjoni",errorReplayCopy:"Ikkopja l-lezzjoni",errorReplayCopied:"Lezzjoni kkupjata.",installedVersion:"Verżjoni installata",allModulesUpdated:"Il-moduli kollha huma allinjati",releaseDate:"Data tal-verżjoni"}
};
let settings = load(SETTINGS,{lang:'en',theme:'system'});
let progress = load(STORAGE,{seen:{},correct:{},wrong:{},exams:[],favourites:[],activity:{},knownWords:[],knownPhrases:[],review:{},errorReasons:{},bridgeResults:[]});
progress.favourites=Array.isArray(progress.favourites)?progress.favourites:[];
progress.activity=progress.activity&&typeof progress.activity==='object'?progress.activity:{};
progress.knownWords=Array.isArray(progress.knownWords)?progress.knownWords:[];
progress.knownPhrases=Array.isArray(progress.knownPhrases)?progress.knownPhrases:[];
progress.review=progress.review&&typeof progress.review==='object'?progress.review:{};
progress.errorReasons=progress.errorReasons&&typeof progress.errorReasons==='object'?progress.errorReasons:{};
progress.bridgeResults=Array.isArray(progress.bridgeResults)?progress.bridgeResults:[];

const DEFAULT_SCHOOL_PREFS={
 area:'all',
 language:settings.lang==='it'?'it':settings.lang==='mt'?'mt':'en',
 course:'lptv',
 transmission:'any',
 schedule:'any',
 englishSupport:false,
 documentSupport:false
};
let schoolPreferences=Object.assign({},DEFAULT_SCHOOL_PREFS,load(SCHOOL_PREFS_KEY,{}));
let schoolCompare=Array.isArray(load(SCHOOL_COMPARE_KEY,[]))?load(SCHOOL_COMPARE_KEY,[]):[];
schoolCompare=schoolCompare.filter(id=>SCHOOL_DEMOS.some(school=>school.id===id)).slice(0,3);
let schoolPartnerDraft=Object.assign({
 schoolName:'',permit:'',email:'',phone:'',area:'central',
 languages:['en'],services:[],prices:'',availability:'',
 description:'',plan:'basic',consent:false
},load(SCHOOL_PARTNER_KEY,{}));














const DEFAULT_ERROR_REPLAY={
 lastQuestionId:'',
 viewed:{},
 completed:{},
 speed:'normal',
 lastVisit:'',
 cameraMode:'auto',
 perception:{attempts:0,hits:0,totalMs:0,bestMs:0,lastResult:null}
};
let errorReplay=Object.assign({},DEFAULT_ERROR_REPLAY,load(ERROR_REPLAY_KEY,{}));
errorReplay.viewed=errorReplay.viewed&&typeof errorReplay.viewed==='object'?errorReplay.viewed:{};
errorReplay.completed=errorReplay.completed&&typeof errorReplay.completed==='object'?errorReplay.completed:{};
errorReplay.perception=Object.assign({attempts:0,hits:0,totalMs:0,bestMs:0,lastResult:null},errorReplay.perception||{});
let replayPerceptionStartedAt=0;

const DEFAULT_CLOUD_READY={
 userId:'',
 deviceId:'',
 deviceName:'',
 queue:[],
 lastLocalBackup:'',
 lastSync:'',
 cloudStatus:'not_connected',
 devices:[],
 loginPrepared:true
};
let cloudReady=Object.assign({},DEFAULT_CLOUD_READY,load(CLOUD_READY_KEY,{}));
cloudReady.queue=Array.isArray(cloudReady.queue)?cloudReady.queue:[];
cloudReady.devices=Array.isArray(cloudReady.devices)?cloudReady.devices:[];

const DEFAULT_MISSION_SYSTEM={
 activeMissionId:'',
 completedMissionIds:[],
 missionProgress:{},
 lastGeneratedDate:''
};
let missionSystem=Object.assign({},DEFAULT_MISSION_SYSTEM,load(MISSION_SYSTEM_KEY,{}));
missionSystem.completedMissionIds=Array.isArray(missionSystem.completedMissionIds)?missionSystem.completedMissionIds:[];
missionSystem.missionProgress=missionSystem.missionProgress&&typeof missionSystem.missionProgress==='object'?missionSystem.missionProgress:{};

const DEFAULT_AI_INSTRUCTOR={
 languageMode:'bilingual',
 level:'simple',
 explained:{},
 lastQuestionId:'',
 lastVisit:'',
 socratic:{questionId:'',step:0,answers:[]}
};
let aiInstructor=Object.assign({},DEFAULT_AI_INSTRUCTOR,load(AI_INSTRUCTOR_KEY,{}));
aiInstructor.explained=aiInstructor.explained&&typeof aiInstructor.explained==='object'?aiInstructor.explained:{};
aiInstructor.socratic=Object.assign({questionId:'',step:0,answers:[]},aiInstructor.socratic||{});
aiInstructor.socratic.answers=Array.isArray(aiInstructor.socratic.answers)?aiInstructor.socratic.answers:[];

const DEFAULT_INSTRUCTOR_PORTAL={
 profile:{
  name:'',
  email:'',
  phone:'',
  languages:'',
  speciality:'',
  bio:''
 },
 assignments:[],
 notes:[],
 lastVisit:''
};
let instructorPortal=Object.assign({},DEFAULT_INSTRUCTOR_PORTAL,load(INSTRUCTOR_PORTAL_KEY,{}));
instructorPortal.profile=Object.assign({},DEFAULT_INSTRUCTOR_PORTAL.profile,instructorPortal.profile||{});
instructorPortal.assignments=Array.isArray(instructorPortal.assignments)?instructorPortal.assignments:[];
instructorPortal.notes=Array.isArray(instructorPortal.notes)?instructorPortal.notes:[];

const DEFAULT_SCHOOL_PORTAL={
 instructors:[],
 courses:[],
 offers:[],
 reviews:[],
 requests:[],
 bookings:[],
 publicProfile:{
  headline:'',
  website:'',
  whatsapp:'',
  logoText:'MDM',
  verified:false
 }
};
let schoolPortal=Object.assign({},DEFAULT_SCHOOL_PORTAL,load(SCHOOL_PORTAL_KEY,{}));
for(const key of ['instructors','courses','offers','reviews','requests','bookings']){
 schoolPortal[key]=Array.isArray(schoolPortal[key])?schoolPortal[key]:[];
}
schoolPortal.publicProfile=Object.assign({},DEFAULT_SCHOOL_PORTAL.publicProfile,schoolPortal.publicProfile||{});

const DEFAULT_ZERO_ERROR_STATE={
 defeatedIds:[],
 verifiedIds:[],
 lastPlanDate:'',
 lastVisit:''
};
let zeroErrorState=Object.assign({},DEFAULT_ZERO_ERROR_STATE,load(ZERO_ERROR_KEY,{}));
zeroErrorState.defeatedIds=Array.isArray(zeroErrorState.defeatedIds)?zeroErrorState.defeatedIds:[];
zeroErrorState.verifiedIds=Array.isArray(zeroErrorState.verifiedIds)?zeroErrorState.verifiedIds:[];

const DEFAULT_EXAM_DAY_STATE={
 targetDate:'',
 checklist:{},
 breathingDone:false,
 finalSimulationDone:false,
 finalSimulationScore:0,
 finalSimulationDate:'',
 certificateIssued:false,
 certificateDate:''
};
let examDayState=Object.assign({},DEFAULT_EXAM_DAY_STATE,load(EXAM_DAY_KEY,{}));
examDayState.checklist=examDayState.checklist&&typeof examDayState.checklist==='object'?examDayState.checklist:{};

const DEFAULT_RECOVERY_STATE={
 completedQuestionIds:[],
 lastPrompt:'',
 lastVisit:''
};
let recoveryState=Object.assign({},DEFAULT_RECOVERY_STATE,load(RECOVERY_KEY,{}));
recoveryState.completedQuestionIds=Array.isArray(recoveryState.completedQuestionIds)?recoveryState.completedQuestionIds:[];

const DEFAULT_COACH_STATE={
 missionDate:'',
 missionDone:false,
 missionSteps:{study:false,review:false,bridge:false},
 lastCoachVisit:'',
 investorPreviewViewed:false
};
let coachState=Object.assign({},DEFAULT_COACH_STATE,load(COACH_KEY,{}));
coachState.missionSteps=Object.assign({study:false,review:false,bridge:false},coachState.missionSteps||{});

const DEFAULT_ONBOARDING={
 completed:false,
 role:'student',
 acceptedLocalStorage:false,
 acceptedTerms:false,
 optionalUpdates:false,
 completedAt:''
};
let onboarding=Object.assign({},DEFAULT_ONBOARDING,load(ONBOARDING_KEY,{}));
const DEFAULT_PRIVACY_PREFS={
 analytics:false,
 marketing:false,
 updatedAt:''
};
let privacyPreferences=Object.assign({},DEFAULT_PRIVACY_PREFS,load(PRIVACY_PREFS_KEY,{}));

const DEFAULT_SCHOOL_DASHBOARD={
 students:[],
 groups:[],
 invites:[],
 schoolNotes:'',
 savedAt:''
};
let schoolDashboard=Object.assign({},DEFAULT_SCHOOL_DASHBOARD,load(SCHOOL_DASHBOARD_KEY,{}));
schoolDashboard.students=Array.isArray(schoolDashboard.students)?schoolDashboard.students:[];
schoolDashboard.groups=Array.isArray(schoolDashboard.groups)?schoolDashboard.groups:[];
schoolDashboard.invites=Array.isArray(schoolDashboard.invites)?schoolDashboard.invites:[];

const DEFAULT_PERSONAL_ROADMAP={
 targetDate:'',
 dailyMinutes:20,
 studyDays:5,
 mainGoal:'tag',
 savedAt:''
};
let personalRoadmap=Object.assign({},DEFAULT_PERSONAL_ROADMAP,load(ROADMAP_KEY,{}));
personalRoadmap.dailyMinutes=Math.max(10,Math.min(120,Number(personalRoadmap.dailyMinutes)||20));
personalRoadmap.studyDays=Math.max(1,Math.min(7,Number(personalRoadmap.studyDays)||5));

const DEFAULT_LPTV_PASSPORT={
 mode:'new',
 applicantType:'eu',
 status:'planning',
 licenceSince:'',
 penaltyPoints:'',
 checklist:{},
 dates:{
  drivingLicence:'',
  residence:'',
  employment:'',
  operatorLicence:'',
  tagExpiry:'',
  medical:'',
  application:''
 },
 notes:'',
 savedAt:''
};
let lptvPassport=Object.assign({},DEFAULT_LPTV_PASSPORT,load(PASSPORT_KEY,{}));
lptvPassport.checklist=lptvPassport.checklist&&typeof lptvPassport.checklist==='object'?lptvPassport.checklist:{};
lptvPassport.dates=Object.assign({},DEFAULT_LPTV_PASSPORT.dates,lptvPassport.dates||{});

let route = {name:'home',data:null};
let quiz = null;
let bridgeState = null;
let timerId = null;

function clone(v){return v===null?null:JSON.parse(JSON.stringify(v))}
function load(key,fallback){try{const raw=localStorage.getItem(key);if(!raw)return clone(fallback);const parsed=JSON.parse(raw);if(fallback&&typeof fallback==='object'&&!Array.isArray(fallback))return Object.assign(clone(fallback),parsed);return parsed}catch{return clone(fallback)}}
function save(key,value){localStorage.setItem(key,JSON.stringify(value))}

function createRegistrationId(){
 const timestamp=Date.now().toString(36).toUpperCase();
 const random=Math.random().toString(36).slice(2,7).toUpperCase();
 return `MDM-${timestamp}-${random}`;
}
let userProfile=load(USER_PROFILE,{
 firstName:'',lastName:'',email:'',address:'',age:'',
 privacyConsent:false,updatesConsent:false,
 registrationId:createRegistrationId(),savedAt:'',emailPreparedAt:''
});
if(!userProfile.registrationId)userProfile.registrationId=createRegistrationId();

function cleanProfileValue(value,max=160){
 return String(value??'').trim().slice(0,max);
}
function validProfileEmail(value){
 return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(value||'').trim());
}
function profileComplete(profile=userProfile){
 return Boolean(
  cleanProfileValue(profile.firstName,60) &&
  cleanProfileValue(profile.lastName,60) &&
  validProfileEmail(profile.email) &&
  profile.privacyConsent
 );
}
function collectProfileForm(){
 return {
  firstName:$('#personalFirstName')?.value||'',
  lastName:$('#personalLastName')?.value||'',
  email:$('#personalEmail')?.value||'',
  address:$('#personalAddress')?.value||'',
  age:$('#personalAge')?.value||'',
  privacyConsent:Boolean($('#personalPrivacy')?.checked),
  updatesConsent:Boolean($('#personalUpdates')?.checked),
  registrationId:userProfile.registrationId||createRegistrationId(),
  savedAt:userProfile.savedAt||new Date().toISOString(),
  emailPreparedAt:userProfile.emailPreparedAt||''
 };
}
function validatePersonalProfile(profile){
 if(!cleanProfileValue(profile.firstName,60)||!cleanProfileValue(profile.lastName,60))return t('profileRequired');
 if(!validProfileEmail(profile.email))return t('emailInvalid');
 if(profile.age!==''&&(Number(profile.age)<16||Number(profile.age)>100))return t('ageInvalid');
 if(!profile.privacyConsent)return t('privacyRequired');
 return '';
}
function savePersonalProfile(profile){
 userProfile={
  firstName:cleanProfileValue(profile.firstName,60),
  lastName:cleanProfileValue(profile.lastName,60),
  email:cleanProfileValue(profile.email,120).toLowerCase(),
  address:cleanProfileValue(profile.address,180),
  age:profile.age===''?'':Number(profile.age),
  privacyConsent:Boolean(profile.privacyConsent),
  updatesConsent:Boolean(profile.updatesConsent),
  registrationId:cleanProfileValue(profile.registrationId,80)||createRegistrationId(),
  savedAt:profile.savedAt||new Date().toISOString(),
  emailPreparedAt:profile.emailPreparedAt||''
 };
 save(USER_PROFILE,userProfile);
 return userProfile;
}
function profileDate(value){
 if(!value)return '';
 try{
  const locale=settings.lang==='it'?'it-IT':settings.lang==='mt'?'mt-MT':'en-GB';
  return new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
 }catch{return String(value)}
}
function profileReminderHtml(){
 if(profileComplete())return '';
 return `<button class="profile-reminder" data-go="profile"><span>👤</span><div><strong>${esc(t('completeProfile'))}</strong><small>${esc(t('completeProfileSub'))}</small></div><b>›</b></button>`;
}
function personalProfileHtml(){
 const complete=profileComplete();
 return `<div class="card personal-profile-card ${complete?'complete':'incomplete'}">
  <div class="personal-profile-head">
   <div><h3>${esc(t('personalDetails'))}</h3><p>${esc(t('personalDetailsSub'))}</p></div>
   <span class="profile-status">${complete?'✓':'!'} ${esc(complete?t('registrationComplete'):t('registrationPending'))}</span>
  </div>
  <div class="personal-form-grid">
   <label><span>${esc(t('firstName'))} *</span><input id="personalFirstName" maxlength="60" autocomplete="given-name" value="${esc(userProfile.firstName)}"></label>
   <label><span>${esc(t('lastName'))} *</span><input id="personalLastName" maxlength="60" autocomplete="family-name" value="${esc(userProfile.lastName)}"></label>
   <label class="full"><span>${esc(t('emailAddress'))} *</span><input id="personalEmail" type="email" maxlength="120" autocomplete="email" inputmode="email" value="${esc(userProfile.email)}"></label>
   <label class="full"><span>${esc(t('addressOptional'))}</span><input id="personalAddress" maxlength="180" autocomplete="street-address" value="${esc(userProfile.address)}"></label>
   <label><span>${esc(t('ageOptional'))}</span><input id="personalAge" type="number" min="16" max="100" inputmode="numeric" value="${esc(userProfile.age)}"></label>
   <div class="registration-id-box"><span>${esc(t('registrationId'))}</span><strong>${esc(userProfile.registrationId)}</strong></div>
  </div>
  <div class="privacy-box">
   <h4>${esc(t('privacyAndContact'))}</h4>
   <label class="consent-row"><input id="personalPrivacy" type="checkbox" ${userProfile.privacyConsent?'checked':''}><span>${esc(t('privacyConsent'))}</span></label>
   <label class="consent-row"><input id="personalUpdates" type="checkbox" ${userProfile.updatesConsent?'checked':''}><span>${esc(t('updatesConsent'))}</span></label>
   <p>${esc(t('privacyNote'))}</p>
   <strong>✉ ${esc(ADMIN_EMAIL)}</strong>
  </div>
  ${userProfile.savedAt?`<div class="profile-timestamps"><span>${esc(t('savedOnDevice'))}: ${esc(profileDate(userProfile.savedAt))}</span>${userProfile.emailPreparedAt?`<span>${esc(t('registrationPreparedOn'))}: ${esc(profileDate(userProfile.emailPreparedAt))}</span>`:''}</div>`:''}
  <div class="profile-form-actions">
   <button class="btn secondary" id="savePersonalProfile">${esc(t('saveProfile'))}</button>
   <button class="btn registration-send" id="showRegistrationOptions">✉ ${esc(t('sendRegistration'))}</button>
  </div>
  <div id="registrationOptions" class="registration-options hidden">
   <div class="registration-options-head">
    <div><h4>${esc(t('sendOptions'))}</h4><p>${esc(t('sendOptionsSub'))}</p></div>
    <button id="closeRegistrationOptions" aria-label="${esc(t('closeOptions'))}">×</button>
   </div>
   <div class="registration-methods">
    <button class="registration-method share" id="shareRegistration"><span>↗</span><strong>${esc(t('shareRegistration'))}</strong><small>iPhone / iPad</small></button>
    <button class="registration-method gmail" id="openRegistrationGmail"><span>G</span><strong>${esc(t('openGmail'))}</strong><small>Gmail</small></button>
    <button class="registration-method mail" id="openRegistrationMail"><span>✉</span><strong>${esc(t('openMail'))}</strong><small>Apple Mail</small></button>
    <button class="registration-method copy" id="copyRegistration"><span>⧉</span><strong>${esc(t('copyRegistration'))}</strong><small>${esc(ADMIN_EMAIL)}</small></button>
   </div>
   <p class="copy-fallback-note">${esc(t('copyFallback'))}<br><strong>${esc(ADMIN_EMAIL)}</strong></p>
  </div>
  <p class="send-warning">⚠ ${esc(t('directSendNote'))}</p>
  <button class="text-danger-button" id="deletePersonalProfile">${esc(t('deletePersonalData'))}</button>
 </div>`;
}
function registrationPayload(){
 const form=collectProfileForm();
 const error=validatePersonalProfile(form);
 if(error){toast(error);return null}
 const saved=savePersonalProfile(form);
 saved.emailPreparedAt=new Date().toISOString();
 save(USER_PROFILE,saved);
 const subject=`Malta Driving Master - Registrazione ${saved.registrationId}`;
 const body=[
  `DESTINATARIO: ${ADMIN_EMAIL}`,
  '',
  'NUOVA REGISTRAZIONE MALTA DRIVING MASTER',
  '',
  `Nome: ${saved.firstName}`,
  `Cognome: ${saved.lastName}`,
  `E-mail utente: ${saved.email}`,
  `Indirizzo: ${saved.address||'Non indicato'}`,
  `Età: ${saved.age||'Non indicata'}`,
  `Aggiornamenti via e-mail: ${saved.updatesConsent?'Sì':'No'}`,
  `Consenso registrazione: ${saved.privacyConsent?'Sì':'No'}`,
  `Codice registrazione: ${saved.registrationId}`,
  'Versione app: Build 08.2',
  `Data: ${new Date().toLocaleString()}`,
  '',
  'Messaggio preparato volontariamente dall’utente attraverso Malta Driving Master.'
 ].join('\n');
 return {saved,subject,body};
}
function mailtoRegistration(payload){
 return `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
}
function gmailRegistration(payload){
 return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ADMIN_EMAIL)}&su=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
}
function openRegistrationMail(){
 const payload=registrationPayload();
 if(!payload)return;
 toast(t('mailOpening'));
 window.location.href=mailtoRegistration(payload);
}
function openRegistrationGmail(){
 const payload=registrationPayload();
 if(!payload)return;
 toast(t('gmailOpening'));
 const url=gmailRegistration(payload);
 const opened=window.open(url,'_blank','noopener,noreferrer');
 if(!opened)window.location.href=url;
}
async function shareRegistration(){
 const payload=registrationPayload();
 if(!payload)return;
 const text=`A: ${ADMIN_EMAIL}\n\n${payload.body}`;
 if(!navigator.share){
  toast(t('shareUnavailable'));
  return;
 }
 try{
  await navigator.share({
   title:payload.subject,
   text
  });
 }catch(error){
  if(error?.name!=='AbortError')toast(t('shareUnavailable'));
 }
}
async function copyRegistration(){
 const payload=registrationPayload();
 if(!payload)return;
 const text=`A: ${ADMIN_EMAIL}\nOggetto: ${payload.subject}\n\n${payload.body}`;
 try{
  if(navigator.clipboard&&window.isSecureContext){
   await navigator.clipboard.writeText(text);
  }else{
   const area=document.createElement('textarea');
   area.value=text;
   area.setAttribute('readonly','');
   area.style.position='fixed';
   area.style.opacity='0';
   document.body.appendChild(area);
   area.select();
   document.execCommand('copy');
   area.remove();
  }
  toast(t('registrationCopied'));
 }catch{
  window.prompt(`${t('copyFallback')} ${ADMIN_EMAIL}`,text);
 }
}
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
   review:allowedQuestionMap(progress.review),
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

const ERROR_REASON_IDS=['rule','language','word','multiple','rush','unsure'];
function errorReasonKey(id){return 'reason'+id.charAt(0).toUpperCase()+id.slice(1)}
function errorReasonLabel(id){return t(errorReasonKey(id))}
function recordErrorReason(q,a,reason){
 if(!q||!a||a.ok||a.reason)return;
 a.reason=reason;
 const map=progress.errorReasons[q.id]&&typeof progress.errorReasons[q.id]==='object'?progress.errorReasons[q.id]:{};
 map[reason]=Number(map[reason]||0)+1;
 progress.errorReasons[q.id]=map;
 save(STORAGE,progress);saveSession();
 toast(t('reasonSaved'));
 showExplanation(q,a);
}
function errorReasonTotals(){
 const totals=Object.fromEntries(ERROR_REASON_IDS.map(id=>[id,0]));
 Object.values(progress.errorReasons||{}).forEach(map=>ERROR_REASON_IDS.forEach(id=>totals[id]+=Number(map?.[id]||0)));
 return totals;
}
function errorReasonQuestions(reason){
 return Q.filter(q=>Number(progress.errorReasons?.[q.id]?.[reason]||0)>0)
  .sort((a,b)=>Number(progress.errorReasons[b.id]?.[reason]||0)-Number(progress.errorReasons[a.id]?.[reason]||0));
}
function trainErrorReason(reason){
 const pool=errorReasonQuestions(reason);
 if(!pool.length)return toast(t('noResults'));
 if(reason==='language'||reason==='word')return startBridgeTest(Math.min(10,Math.max(5,pool.length)),pool.map(q=>q.id));
 startQuiz(shuffle(pool).slice(0,Math.min(20,pool.length)),'guided');
}
function errorReasonHtml(q,a){
 if(!a||a.ok)return '';
 if(a.reason)return `<div class="error-reason-box saved"><div><strong>✓ ${esc(t('reasonSaved'))}</strong><span>${esc(errorReasonLabel(a.reason))}</span></div></div>`;
 return `<div class="error-reason-box"><h4>${esc(t('whyWrong'))}</h4><div class="error-reason-grid">${ERROR_REASON_IDS.map(id=>`<button data-error-reason="${id}">${esc(errorReasonLabel(id))}</button>`).join('')}</div></div>`;
}
function errorDnaHtml(){
 const totals=errorReasonTotals(),sum=Object.values(totals).reduce((a,b)=>a+b,0),max=Math.max(1,...Object.values(totals));
 return `<div class="card error-dna-card"><div class="feature-heading"><div><h3>🧬 ${esc(t('errorDna'))}</h3><p>${esc(t('errorDnaSub'))}</p></div><strong>${sum}</strong></div>${sum?`<div class="dna-bars">${ERROR_REASON_IDS.map(id=>`<div class="dna-row"><span>${esc(errorReasonLabel(id))}</span><div><i style="width:${Math.round(totals[id]/max*100)}%"></i></div><b>${totals[id]}</b><button data-dna-reason="${id}">›</button></div>`).join('')}</div>`:`<p class="muted">${esc(t('noErrorDna'))}</p>`}</div>`;
}
function bridgeEligibleQuestions(){return Q.filter(q=>q.question_it&&Array.isArray(q.answers_it)&&q.answers_it.length===q.answers.length)}
function buildBridgeQuestions(count,focusIds=[]){
 const eligible=bridgeEligibleQuestions(),byId=new Map(eligible.map(q=>[q.id,q]));
 const selected=[],used=new Set();
 shuffle(focusIds).forEach(id=>{const q=byId.get(id);if(q&&!used.has(id)&&selected.length<count){selected.push(q);used.add(id)}});
 const topicPools=TOPIC_GROUPS.map(topic=>shuffle(eligible.filter(q=>topicIdFor(q)===topic.id&&!used.has(q.id))));
 let cursor=0;
 while(selected.length<count&&topicPools.some(pool=>pool.length)){
  const pool=topicPools[cursor%topicPools.length];
  const q=pool.shift();if(q&&!used.has(q.id)){selected.push(q);used.add(q.id)}
  cursor++;
 }
 if(selected.length<count)shuffle(eligible.filter(q=>!used.has(q.id))).slice(0,count-selected.length).forEach(q=>selected.push(q));
 return selected.slice(0,count);
}
function startBridgeTest(count=10,focusIds=[]){
 const list=buildBridgeQuestions(Number(count)||10,focusIds);
 bridgeState={list,phase:'it',index:0,selected:[],itAnswers:{},enAnswers:{},enOrder:shuffle(list.map(q=>q.id)),startedAt:new Date().toISOString()};
 go('bridgequiz');
}
function bridgeCurrentQuestion(){
 if(!bridgeState)return null;
 if(bridgeState.phase==='it')return bridgeState.list[bridgeState.index]||null;
 const id=bridgeState.enOrder[bridgeState.index];return bridgeState.list.find(q=>q.id===id)||null;
}
function answerIsCorrect(q,selected){const a=[...(selected||[])].sort((x,y)=>x-y),b=[...q.correct].sort((x,y)=>x-y);return a.length===b.length&&JSON.stringify(a)===JSON.stringify(b)}
function bridgeResultById(id){return (progress.bridgeResults||[]).find(item=>item.id===id)||(progress.bridgeResults||[]).at(-1)||null}
function latestBridgeResult(){return (progress.bridgeResults||[]).at(-1)||null}
function completeBridgeTest(){
 const list=bridgeState.list;
 const mastered=[],language=[],rule=[],recovered=[];
 let itCorrect=0,enCorrect=0;
 list.forEach(q=>{
  const itOk=answerIsCorrect(q,bridgeState.itAnswers[q.id]);
  const enOk=answerIsCorrect(q,bridgeState.enAnswers[q.id]);
  if(itOk)itCorrect++;if(enOk)enCorrect++;
  if(itOk&&enOk)mastered.push(q.id);
  else if(itOk&&!enOk)language.push(q.id);
  else if(!itOk&&!enOk)rule.push(q.id);
  else recovered.push(q.id);
 });
 const result={id:`BR-${Date.now().toString(36).toUpperCase()}`,date:new Date().toISOString(),total:list.length,itCorrect,enCorrect,knowledgePct:Math.round(itCorrect/list.length*100),englishPct:Math.round(enCorrect/list.length*100),masteredPct:Math.round(mastered.length/list.length*100),masteredIds:mastered,languageIds:language,ruleIds:rule,recoveredIds:recovered};
 progress.bridgeResults.push(result);progress.bridgeResults=progress.bridgeResults.slice(-20);save(STORAGE,progress);
 bridgeState=null;toast(t('bridgeCompleted'));go('bridgeresult',result.id);
}
function confirmBridgeAnswer(){
 const q=bridgeCurrentQuestion();if(!q)return;
 if(bridgeState.selected.length!==q.correct.length)return toast(q.correct.length===1?t('selectOne'):t('selectMany',q.correct.length));
 const key=bridgeState.phase==='it'?'itAnswers':'enAnswers';bridgeState[key][q.id]=[...bridgeState.selected];bridgeState.selected=[];
 if(bridgeState.index<bridgeState.list.length-1){bridgeState.index++;renderBridgeQuiz();return}
 if(bridgeState.phase==='it'){bridgeState.phase='en';bridgeState.index=0;toast(t('bridgeTransition'));renderBridgeQuiz();return}
 completeBridgeTest();
}
function renderBridgeQuiz(){
 if(!bridgeState){go('bridgesetup');return}
 const q=bridgeCurrentQuestion(),isIt=bridgeState.phase==='it',total=bridgeState.list.length*2,done=(isIt?0:bridgeState.list.length)+bridgeState.index;
 $('#bridgePhase').textContent=t(isIt?'bridgePhaseItalian':'bridgePhaseEnglish');
 $('#bridgeCounter').textContent=`${done+1}/${total}`;$('#bridgeProgress').style.width=`${Math.round(done/total*100)}%`;
 $('#bridgeQuestion').textContent=isIt?q.question_it:q.question;
 $('#bridgeInstruction').textContent=q.correct.length===1?t('selectOne'):t('selectMany',q.correct.length);
 const answers=isIt?q.answers_it:q.answers;
 $('#bridgeOptions').innerHTML=answers.map((answer,i)=>`<button class="option ${bridgeState.selected.includes(i)?'selected':''}" data-bridge-opt="${i}"><span class="option-main"><strong>${String.fromCharCode(65+i)}.</strong> ${esc(answer)}</span></button>`).join('');
 screen.querySelectorAll('[data-bridge-opt]').forEach(button=>button.onclick=()=>{const i=Number(button.dataset.bridgeOpt),max=q.correct.length;if(bridgeState.selected.includes(i))bridgeState.selected=bridgeState.selected.filter(x=>x!==i);else{if(bridgeState.selected.length>=max)return toast(max===1?t('selectOne'):t('selectMany',max));bridgeState.selected.push(i)}renderBridgeQuiz()});
 $('#bridgeConfirm').onclick=confirmBridgeAnswer;
 $('#bridgeExit').onclick=()=>{if(confirm(t('exit')+'?')){bridgeState=null;go('lptv')}};
}
function bridgeProgressHtml(){
 const result=latestBridgeResult();
 if(!result)return `<div class="card bridge-progress-card"><div class="feature-heading"><div><h3>🌉 ${esc(t('latestBridge'))}</h3><p>${esc(t('noBridgeYet'))}</p></div></div><button class="btn" data-go="bridgesetup">${esc(t('bridgeStart'))}</button></div>`;
 return `<div class="card bridge-progress-card"><div class="feature-heading"><div><h3>🌉 ${esc(t('latestBridge'))}</h3><p>${esc(formatExamDate(result.date))}</p></div><strong>${result.masteredPct}%</strong></div><div class="bridge-mini-grid"><div><b>${result.knowledgePct}%</b><span>${esc(t('knowledgeScore'))}</span></div><div><b>${result.englishPct}%</b><span>${esc(t('englishScore'))}</span></div><div><b>${result.languageIds.length}</b><span>${esc(t('languageBarrier'))}</span></div><div><b>${result.ruleIds.length}</b><span>${esc(t('ruleGap'))}</span></div></div><button class="btn secondary" data-go="bridgeresult" data-id="${esc(result.id)}">${esc(t('viewDetails'))}</button></div>`;
}

let libraryLimit=50;
let flashState={deck:[],index:0,revealed:false,direction:'en-it'};

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

const PHRASEBOOK=[{"id":"P001","en":"what should you do","it":"cosa dovresti fare","tag":"Instruction"},{"id":"P002","en":"what should you do first","it":"cosa dovresti fare per prima cosa","tag":"Instruction"},{"id":"P003","en":"what is the main reason","it":"qual è il motivo principale","tag":"Reason"},{"id":"P004","en":"what is the safest action","it":"qual è l’azione più sicura","tag":"Safety"},{"id":"P005","en":"what is most likely to happen","it":"cosa è più probabile che accada","tag":"Prediction"},{"id":"P006","en":"what should you be aware of","it":"di cosa dovresti essere consapevole","tag":"Hazard"},{"id":"P007","en":"what should you avoid","it":"cosa dovresti evitare","tag":"Safety"},{"id":"P008","en":"what is the purpose of","it":"qual è lo scopo di","tag":"Meaning"},{"id":"P009","en":"what is the best way to","it":"qual è il modo migliore per","tag":"Instruction"},{"id":"P010","en":"which two answers are correct","it":"quali due risposte sono corrette","tag":"Multiple answers"},{"id":"P011","en":"select two answers","it":"seleziona due risposte","tag":"Multiple answers"},{"id":"P012","en":"what does this sign mean","it":"cosa significa questo segnale","tag":"Signs"},{"id":"P013","en":"you are approaching","it":"ti stai avvicinando a","tag":"Road situation"},{"id":"P014","en":"you are driving past","it":"stai passando accanto a","tag":"Road situation"},{"id":"P015","en":"you notice","it":"noti / ti accorgi di","tag":"Observation"},{"id":"P016","en":"you are following","it":"stai seguendo","tag":"Road situation"},{"id":"P017","en":"you should be prepared to stop","it":"dovresti essere pronto a fermarti","tag":"Safety"},{"id":"P018","en":"slow down and be prepared to stop","it":"rallenta e preparati a fermarti","tag":"Safety"},{"id":"P019","en":"give way to","it":"dai la precedenza a","tag":"Priority"},{"id":"P020","en":"keep a safe distance","it":"mantieni una distanza di sicurezza","tag":"Safety"},{"id":"P021","en":"check your mirrors","it":"controlla gli specchietti","tag":"Observation"},{"id":"P022","en":"before moving off","it":"prima di partire","tag":"Procedure"},{"id":"P023","en":"when overtaking","it":"durante il sorpasso","tag":"Overtaking"},{"id":"P024","en":"do not overtake","it":"non sorpassare","tag":"Overtaking"},{"id":"P025","en":"in an emergency","it":"in caso di emergenza","tag":"Emergency"},{"id":"P026","en":"if your vehicle breaks down","it":"se il tuo veicolo si guasta","tag":"Emergency"},{"id":"P027","en":"you must not","it":"non devi / è vietato","tag":"Prohibition"},{"id":"P028","en":"you may","it":"puoi / ti è consentito","tag":"Permission"},{"id":"P029","en":"the road is wet","it":"la strada è bagnata","tag":"Weather"},{"id":"P030","en":"visibility is poor","it":"la visibilità è scarsa","tag":"Visibility"},{"id":"P031","en":"at a pedestrian crossing","it":"a un attraversamento pedonale","tag":"Pedestrians"},{"id":"P032","en":"at a junction","it":"a un incrocio","tag":"Junction"},{"id":"P033","en":"on a roundabout","it":"su una rotatoria","tag":"Roundabout"},{"id":"P034","en":"a passenger asks","it":"un passeggero chiede","tag":"Customer care"},{"id":"P035","en":"a vulnerable passenger","it":"un passeggero vulnerabile","tag":"Customer care"},{"id":"P036","en":"what documents are required","it":"quali documenti sono richiesti","tag":"Documents"},{"id":"P037","en":"what is the maximum","it":"qual è il massimo","tag":"Limit"},{"id":"P038","en":"what is the minimum","it":"qual è il minimo","tag":"Limit"},{"id":"P039","en":"how should you react","it":"come dovresti reagire","tag":"Reaction"},{"id":"P040","en":"why should you","it":"perché dovresti","tag":"Reason"},{"id":"P041","en":"be aware that","it":"tieni presente che","tag":"Warning"},{"id":"P042","en":"allow extra time","it":"concedi più tempo","tag":"Customer care"},{"id":"P043","en":"move to a safe place","it":"spostati in un luogo sicuro","tag":"Emergency"},{"id":"P044","en":"call for help","it":"chiama aiuto","tag":"Emergency"},{"id":"P045","en":"switch on your hazard lights","it":"accendi le quattro frecce","tag":"Emergency"},{"id":"P046","en":"do not move the casualty","it":"non spostare l’infortunato","tag":"First aid"},{"id":"P047","en":"reassure the casualty","it":"rassicura l’infortunato","tag":"First aid"},{"id":"P048","en":"be prepared to take action","it":"preparati ad agire","tag":"Safety"},{"id":"P049","en":"leave enough room","it":"lascia spazio sufficiente","tag":"Safety"},{"id":"P050","en":"sound your horn","it":"suona il clacson","tag":"Warning"},{"id":"P051","en":"flash your headlights","it":"lampeggia con i fari","tag":"Warning"},{"id":"P052","en":"reduce your speed","it":"riduci la velocità","tag":"Safety"},{"id":"P053","en":"increase your following distance","it":"aumenta la distanza di sicurezza","tag":"Safety"},{"id":"P054","en":"keep well back","it":"mantieniti ben distante","tag":"Safety"},{"id":"P055","en":"stop if necessary","it":"fermati se necessario","tag":"Safety"}];

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
function isKnownPhrase(id){return progress.knownPhrases.includes(id)}
function toggleKnownPhrase(id){
 if(isKnownPhrase(id))progress.knownPhrases=progress.knownPhrases.filter(value=>value!==id);
 else progress.knownPhrases.push(id);
 save(STORAGE,progress);
}
function phraseMatches(text){
 const haystack=normaliseVocabularyText(text);
 return PHRASEBOOK
   .filter(item=>haystack.includes(normaliseVocabularyText(item.en)))
   .sort((a,b)=>b.en.length-a.en.length)
   .slice(0,8);
}
function glossaryMatches(text){
 const haystack=' '+normaliseVocabularyText(text)+' ';
 return GLOSSARY
   .filter(item=>{
     const term=normaliseVocabularyText(item.term);
     return term&&haystack.includes(' '+term+' ');
   })
   .sort((a,b)=>b.term.length-a.term.length)
   .slice(0,10);
}
function questionLanguageMatches(q){
 const text=[q.question,...(q.answers||[])].join(' ');
 return {phrases:phraseMatches(text),words:glossaryMatches(text)};
}
function speakAtRate(text,rate=.88){
 speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(text);
 utterance.lang='en-GB';
 utterance.rate=rate;
 speechSynthesis.speak(utterance);
}
function sentenceCoachHtml(q){
 const matches=questionLanguageMatches(q);
 const phraseHtml=matches.phrases.length?`<div class="coach-section"><h4>${esc(t('keyPhrases'))}</h4><div class="coach-items">${matches.phrases.map(item=>`<button class="coach-item" data-coach-phrase="${esc(item.id)}"><span>${esc(item.en)}</span><strong>${esc(item.it)}</strong><small>${esc(item.tag)}</small></button>`).join('')}</div></div>`:'';
 const wordHtml=matches.words.length?`<div class="coach-section"><h4>${esc(t('keyWords'))}</h4><div class="coach-items">${matches.words.map(item=>`<button class="coach-item word" data-coach-word="${esc(item.term)}"><span>${esc(item.term)}</span><strong>${esc(item.it)}</strong><small>${esc(item.tag)}</small></button>`).join('')}</div></div>`:'';
 return `<div class="sentence-coach"><div class="sentence-coach-head"><div><h3>${esc(t('questionLanguageHelp'))}</h3><p>${esc(t('sentenceCoachSub'))}</p></div><button class="coach-slow" id="coachSlow">🐢 ${esc(t('slowListen'))}</button></div>${phraseHtml||wordHtml?phraseHtml+wordHtml:`<p class="muted">${esc(t('noKeyTerms'))}</p>`}</div>`;
}
function initialiseFlashcards(){
 if(!flashState.deck.length){
   flashState.deck=shuffle(PHRASEBOOK.map(item=>item.id));
   flashState.index=0;
   flashState.revealed=false;
 }
}
function currentFlashcard(){
 initialiseFlashcards();
 const id=flashState.deck[flashState.index%flashState.deck.length];
 return PHRASEBOOK.find(item=>item.id===id)||PHRASEBOOK[0];
}
function dailyPool(){return adaptivePool(DAILY_GOAL)}
const REVIEW_INTERVALS=[1,3,7,14,30,60];
function addDaysKey(days){
 const date=new Date();
 date.setHours(12,0,0,0);
 date.setDate(date.getDate()+Number(days||0));
 return dateKey(date);
}
function reviewRecord(id){
 const value=progress.review[id];
 return value&&typeof value==='object'?value:null;
}
function updateReviewSchedule(q,ok){
 const previous=reviewRecord(q.id)||{streak:0,interval:0,due:dateKey()};
 let streak,interval;
 if(ok){
   streak=Math.max(0,Number(previous.streak||0))+1;
   interval=REVIEW_INTERVALS[Math.min(streak-1,REVIEW_INTERVALS.length-1)];
 }else{
   streak=0;
   interval=0;
 }
 progress.review[q.id]={
   streak,
   interval,
   due:ok?addDaysKey(interval):dateKey(),
   last:dateKey(),
   lastResult:ok?'correct':'wrong'
 };
}
function dueQuestions(){
 const today=dateKey();
 return Q.filter(q=>{
   const item=reviewRecord(q.id);
   return item&&item.due&&item.due<=today;
 }).sort((a,b)=>(reviewRecord(a.id)?.due||'').localeCompare(reviewRecord(b.id)?.due||''));
}
function nextReviewDate(){
 const today=dateKey();
 const dates=Q.map(q=>reviewRecord(q.id)?.due).filter(value=>value&&value>today).sort();
 return dates[0]||null;
}
function questionAttempts(q){return Number(progress.seen[q.id]||0)}
function questionAccuracy(q){
 const attempts=questionAttempts(q);
 return attempts?Math.round(Number(progress.correct[q.id]||0)/attempts*100):0;
}
function isMastered(q){
 const item=reviewRecord(q.id);
 return questionAttempts(q)>=3&&questionAccuracy(q)>=80&&Number(item?.streak||0)>=3;
}
function reviewStats(){
 const scheduled=Q.filter(q=>reviewRecord(q.id)).length;
 const mastered=Q.filter(isMastered).length;
 const due=dueQuestions().length;
 return {scheduled,mastered,due,next:nextReviewDate()};
}
function reviewDateLabel(value){
 if(!value)return t('nextReviewNone');
 const today=new Date();today.setHours(12,0,0,0);
 const target=new Date(value+'T12:00:00');
 const days=Math.round((target-today)/86400000);
 if(days<=0)return t('dueToday');
 if(days===1)return `${t('reviewIn')} 1 ${t('days').replace(/s$/,'')}`;
 return `${t('reviewIn')} ${days} ${t('days')}`;
}
function libraryStatusMatches(q,status){
 if(status==='unseen')return questionAttempts(q)===0;
 if(status==='wrong')return Number(progress.wrong[q.id]||0)>0;
 if(status==='saved')return isFavourite(q.id);
 if(status==='due')return dueQuestions().some(item=>item.id===q.id);
 if(status==='mastered')return isMastered(q);
 return true;
}
function libraryBankQuestions(bank){
 if(bank==='core')return CORE_Q;
 if(bank==='road')return ROAD_SAFETY_Q;
 return Q;
}
function examAnswerFor(q){return quiz?.answers?.[q.id]||null}
function examQuestionAnswered(q){const a=examAnswerFor(q);return !!a&&Array.isArray(a.selected)&&a.selected.length===q.correct.length}
function examAnsweredCount(){return quiz?.list?.filter(examQuestionAnswered).length||0}
function examUnansweredCount(){return Math.max(0,(quiz?.list?.length||0)-examAnsweredCount())}
function formatDuration(seconds){seconds=Math.max(0,Math.round(Number(seconds)||0));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
function examTimeUsed(){if(!quiz)return 0;const initial=Number(quiz.initialSeconds||2700);return Math.max(0,initial-Number(quiz.remaining||0))}

function examRecordId(){
 return `EX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
}
function examDetailItems(exam){
 if(!exam||!Array.isArray(exam.details))return [];
 return exam.details.map(detail=>{
  const q=Q.find(item=>item.id===detail.id);
  if(!q)return null;
  const selected=Array.isArray(detail.selected)?detail.selected:[];
  const answered=selected.length===q.correct.length;
  return {
   q,
   selected,
   answered,
   ok:Boolean(detail.ok),
   flagged:Boolean(detail.flagged)
  };
 }).filter(Boolean);
}
function examPassRate(){
 const exams=progress.exams||[];
 if(!exams.length)return 0;
 return Math.round(exams.filter(exam=>Number(exam.score)>=30).length/exams.length*100);
}
function progressReportText(){
 const st=stats(),ready=readinessStats(),review=reviewStats();
 const name=[userProfile.firstName,userProfile.lastName].filter(Boolean).join(' ')||t('notProvided');
 const topicLines=TOPIC_GROUPS.map(topic=>{
  const result=topicStats(topic.id);
  return `- ${t(topic.title)}: ${result.accuracy}%`;
 }).join('\n');
 return [
  t('reportTitle').toUpperCase(),
  '',
  `${t('registeredUser')}: ${name}`,
  `E-mail: ${userProfile.email||t('notProvided')}`,
  `${t('registrationId')}: ${userProfile.registrationId||t('notProvided')}`,
  '',
  `${t('readiness')}: ${ready.score}%`,
  `${t('coverage')}: ${ready.coverage}%`,
  `${t('accuracy')}: ${ready.accuracy}%`,
  `${t('seen')}: ${st.seen}/${Q.length}`,
  `${t('exams')}: ${st.exams}`,
  `${t('best')}: ${st.best||'—'}`,
  `${t('last')}: ${st.last||'—'}`,
  `${t('passRate')}: ${examPassRate()}%`,
  `${t('dueNow')}: ${review.due}`,
  `${t('masteredQuestions')}: ${review.mastered}`,
  ...(latestBridgeResult()?[`${t('knowledgeScore')}: ${latestBridgeResult().knowledgePct}%`,`${t('englishScore')}: ${latestBridgeResult().englishPct}%`,`${t('languageBarrier')}: ${latestBridgeResult().languageIds.length}`,`${t('ruleGap')}: ${latestBridgeResult().ruleIds.length}`]:[]),
  '',
  `${t('topicResults')}:`,
  topicLines,
  '',
  `Build 12 • ${new Date().toLocaleString()}`
 ].join('\n');
}
function examReportText(exam,index){
 const items=examDetailItems(exam);
 const wrong=items.filter(item=>!item.ok);
 const lines=items.map((item,position)=>{
  const chosen=item.selected.length?item.selected.map(i=>item.q.answers[i]).join(' | '):t('noAnswerSelected');
  return `${position+1}. ${item.ok?'✓':'✗'} ${item.q.id}\n${item.q.question}\n${t('selectedAnswer')}: ${chosen}`;
 }).join('\n\n');
 return [
  `MALTA DRIVING MASTER — ${t('examDetails').toUpperCase()}`,
  '',
  `${t('examNumber')}: ${index+1}`,
  `${t('examDate')}: ${formatExamDate(exam.date)}`,
  `${t('examResult')}: ${exam.score}/${exam.total} — ${exam.score>=30?t('passedSmall'):t('failedSmall')}`,
  `${t('timeUsed')}: ${formatDuration(exam.timeUsed||0)}`,
  `${t('wrongQuestions')}: ${wrong.length}`,
  `${t('unansweredQuestions')}: ${exam.unanswered||0}`,
  `${t('flaggedQuestions')}: ${exam.flagged||0}`,
  '',
  lines||t('oldExamSummary')
 ].join('\n');
}
async function copyTextSafe(text,successMessage){
 try{
  if(navigator.clipboard&&window.isSecureContext){
   await navigator.clipboard.writeText(text);
  }else{
   const area=document.createElement('textarea');
   area.value=text;
   area.setAttribute('readonly','');
   area.style.position='fixed';
   area.style.opacity='0';
   document.body.appendChild(area);
   area.select();
   document.execCommand('copy');
   area.remove();
  }
  toast(successMessage);
  return true;
 }catch{
  window.prompt(t('copyFallback'),text);
  return false;
 }
}
async function shareTextReport(title,text,copyMessage){
 if(navigator.share){
  try{
   await navigator.share({title,text});
   return;
  }catch(error){
   if(error?.name==='AbortError')return;
  }
 }
 await copyTextSafe(text,copyMessage);
}

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
function updateChrome(){document.documentElement.lang=settings.lang;$('#langBtn').textContent=settings.lang.toUpperCase();document.querySelectorAll('[data-i18n]').forEach(x=>x.textContent=t(x.dataset.i18n));backBtn.classList.toggle('hidden',route.name==='home'||route.name==='quiz');$('#bottomNav').classList.toggle('hidden',route.name==='quiz'||route.name==='bridgequiz');document.querySelectorAll('[data-nav]').forEach(x=>x.classList.toggle('active',x.dataset.nav===route.name));}
function go(name,data=null,push=true){if(timerId&&name!=='quiz'){clearInterval(timerId);timerId=null}if(errorReplayTimer&&name!=='errorreplay'){clearInterval(errorReplayTimer);errorReplayTimer=null}if(name!=='errorreplay'&&window.ReplayEngine)ReplayEngine.stop();route={name,data};if(push)history.pushState({name,data},'',`#${name}`);render();}
function render(options={}){
 if(route.name!=='quiz'&&timerId){clearInterval(timerId);timerId=null}
 updateChrome();
 const existingSplash=$('#premiumSplash');
 if(existingSplash)existingSplash.remove();
 const fn=views[route.name]||views.home;
 screen.innerHTML=fn(route.data);
 screen.focus({preventScroll:true});
 if(!options.preserveScroll)window.scrollTo(0,0);
 document.body.classList.toggle('premium-splash-open',shouldShowPremiumSplash());
 const splashMarkup=premiumSplashHtml();
 if(splashMarkup)document.body.insertAdjacentHTML('beforeend',splashMarkup);
 bindCommon();
 if(route.name==='quiz')renderQuiz();
 if(route.name==='assistant')bindAssistant();
}
function bindCommon(){
 const premiumSkip=$('#premiumSkip');
 const premiumEnter=$('#premiumEnter');
 if(premiumSkip)premiumSkip.onclick=dismissPremiumSplash;
 if(premiumEnter)premiumEnter.onclick=dismissPremiumSplash;
 if(route.name==='errorreplay')bindErrorReplay();
 if(route.name==='cloudready')bindCloudReady();
 if(route.name==='missions')bindMissions();
 if(route.name==='aiinstructor')bindAiInstructor();
 if(route.name==='instructorportal')bindInstructorPortal();
 if(route.name==='schoolportal2')bindSchoolPortal2();
 if(route.name==='zeroerror')bindZeroError();
 if(route.name==='examday')bindExamDay();
 if(route.name==='recoverycoach')bindRecoveryCoach();
 if(route.name==='coach')bindCoach();
 if(route.name==='investorpreview')bindInvestorPreview();
 if(route.name==='onboarding')bindOnboarding();
 if(route.name==='privacycenter')bindPrivacyCenter();screen.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go,b.dataset.id||null));screen.querySelectorAll('[data-external]').forEach(b=>b.onclick=()=>window.open(b.dataset.external,'_blank','noopener'));}


function isStandaloneMode(){
 return window.matchMedia?.('(display-mode: standalone)').matches===true || window.navigator.standalone===true;
}
function devicePlatform(){
 const ua=navigator.userAgent||'';
 if(/iPad|iPhone|iPod/i.test(ua)||(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1))return 'ios';
 if(/Android/i.test(ua))return 'android';
 return 'desktop';
}
function installInstruction(){
 const platform=devicePlatform();
 if(platform==='ios')return t('installIOS');
 if(platform==='android')return t('installAndroid');
 return t('installDesktop');
}
function appModeLabel(){
 return isStandaloneMode()?t('standaloneMode'):t('browserMode');
}
async function promptInstallApp(){
 if(isStandaloneMode())return toast(t('appInstalled'));
 if(deferredInstallPrompt){
  try{
   deferredInstallPrompt.prompt();
   const choice=await deferredInstallPrompt.userChoice;
   if(choice?.outcome==='accepted')toast(t('installationComplete'));
  }catch{
   toast(t('installUnavailable'));
  }finally{
   deferredInstallPrompt=null;
   if(route.name==='help')render();
  }
  return;
 }
 toast(t('installUnavailable'));
}
async function refreshApplication(){
 toast(t('refreshingApp'));
 try{
  const registration=await navigator.serviceWorker?.getRegistration?.();
  if(registration)await registration.update();
  if(window.caches){
   const keys=await caches.keys();
   await Promise.all(keys.filter(key=>key!=='mdm-build-26-1').map(key=>caches.delete(key)));
  }
 }catch{}
 setTimeout(()=>window.location.reload(),450);
}
function supportCategoryLabel(value){
 const map={
  technical:t('supportTechnical'),
  question:t('supportQuestion'),
  registration:t('supportRegistration'),
  suggestion:t('supportSuggestion')
 };
 return map[value]||map.technical;
}
function supportPayload(){
 const category=$('#supportCategory')?.value||'technical';
 const questionId=cleanProfileValue($('#supportQuestionId')?.value||'',40);
 const description=cleanProfileValue($('#supportDescription')?.value||'',1800);
 if(description.length<10){
  toast(t('descriptionRequired'));
  return null;
 }
 const userName=[userProfile.firstName,userProfile.lastName].filter(Boolean).join(' ')||t('notProvided');
 const subject=`Malta Driving Master - ${supportCategoryLabel(category)}${questionId?' - '+questionId:''}`;
 const body=[
  'SEGNALAZIONE MALTA DRIVING MASTER',
  '',
  `${t('supportCategory')}: ${supportCategoryLabel(category)}`,
  `${t('questionIdOptional')}: ${questionId||t('notProvided')}`,
  `${t('problemDescription')}:`,
  description,
  '',
  `${t('registeredUser')}: ${userName}`,
  `E-mail: ${userProfile.email||t('notProvided')}`,
  `${t('registrationId')}: ${userProfile.registrationId||t('notProvided')}`,
  `${t('version')}: Build ${BUILD_VERSION}`,
  `${t('device')}: ${navigator.userAgent||t('notProvided')}`,
  `${t('currentPage')}: ${location.href}`,
  `${appModeLabel()}`,
  `Data: ${new Date().toLocaleString()}`,
  '',
  'Messaggio preparato volontariamente dall’utente. Nessun dato è stato inviato automaticamente.'
 ].join('\n');
 return {subject,body};
}
function supportMailUrl(payload){
 return `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
}
function supportGmailUrl(payload){
 return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ADMIN_EMAIL)}&su=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
}
function openSupportMail(){
 const payload=supportPayload();
 if(!payload)return;
 window.location.href=supportMailUrl(payload);
}
function openSupportGmail(){
 const payload=supportPayload();
 if(!payload)return;
 const url=supportGmailUrl(payload);
 const opened=window.open(url,'_blank','noopener,noreferrer');
 if(!opened)window.location.href=url;
}
async function shareSupportReport(){
 const payload=supportPayload();
 if(!payload)return;
 await shareTextReport(payload.subject,`A: ${ADMIN_EMAIL}\n\n${payload.body}`,t('supportCopied'));
}
async function copySupportReport(){
 const payload=supportPayload();
 if(!payload)return;
 await copyTextSafe(`A: ${ADMIN_EMAIL}\nOggetto: ${payload.subject}\n\n${payload.body}`,t('supportCopied'));
}
function helpInstallHtml(){
 const installed=isStandaloneMode();
 const platform=devicePlatform();
 return `<div class="help-install-card ${installed?'installed':'browser'}">
  <div class="help-install-head">
   <span>${installed?'✓':'⬇'}</span>
   <div><h3>${esc(t('installApp'))}</h3><p>${esc(t('installAppSub'))}</p></div>
   <b>${esc(installed?t('appInstalled'):t('appNotInstalled'))}</b>
  </div>
  <div class="install-instruction"><strong>${platform==='ios'?'iPhone / iPad':platform==='android'?'Android':'Browser'}</strong><p>${esc(installInstruction())}</p></div>
  <div class="help-action-grid">
   <button class="btn" id="installAppBtn" ${installed?'disabled':''}>${installed?'✓ '+esc(t('appInstalled')):'⬇ '+esc(t('installNow'))}</button>
   <button class="btn secondary" id="refreshAppBtn">⟳ ${esc(t('refreshApp'))}</button>
  </div>
  <div class="app-version-row"><span>${esc(t('version'))}</span><strong>Build ${esc(BUILD_VERSION)}</strong><small>${esc(appModeLabel())}</small></div>
 </div>`;
}




function roadmapBridgeScore(){
 const bridge=latestBridgeResult();
 return bridge?Math.round((Number(bridge.knowledgePct||0)+Number(bridge.englishPct||0))/2):0;
}
function roadmapComponentStats(){
 const readiness=readinessStats();
 const passport=passportRequiredStats();
 const day=dailyStats();
 const bridgeScore=roadmapBridgeScore();
 const dailyScore=Math.min(100,Math.round(day.done/day.goal*100));
 const overall=Math.round(
  readiness.score*.50+
  bridgeScore*.20+
  passport.pct*.20+
  dailyScore*.10
 );
 return {readiness,passport,day,bridgeScore,dailyScore,overall};
}
function roadmapWeakestTopic(){
 return TOPIC_GROUPS
  .map(topic=>{
   const values=topicStats(topic.id);
   const composite=Math.round(values.coverage*.45+values.accuracy*.55);
   return {topic,values,composite};
  })
  .sort((a,b)=>a.composite-b.composite||a.values.accuracy-b.values.accuracy)[0];
}
function roadmapLatestExamPct(){
 const exam=(progress.exams||[]).at(-1);
 return exam?Math.round(Number(exam.score||0)/Number(exam.total||35)*100):0;
}
function roadmapNextAction(){
 const components=roadmapComponentStats();
 const review=reviewStats();
 const bridge=latestBridgeResult();
 const examPct=roadmapLatestExamPct();

 if(!profileComplete())return {icon:'◎',title:'roadmapActionProfile',reason:'roadmapReasonProfile',route:'profile'};
 if(review.due>0)return {icon:'⏳',title:'roadmapActionReview',reason:'roadmapReasonReview',route:'reviewsetup',detail:`${review.due} ${t('dueNow')}`};
 if(!components.day.complete)return {icon:'🎯',title:'roadmapActionDaily',reason:'roadmapReasonDaily',route:'dailysetup',detail:`${components.day.done}/${components.day.goal}`};
 if(!bridge)return {icon:'🌉',title:'roadmapActionBridge',reason:'roadmapReasonBridge',route:'bridgesetup'};
 if(Number(bridge.englishPct||0)<70)return {icon:'🔤',title:'roadmapActionEnglish',reason:'roadmapReasonEnglish',route:'bridgesetup',detail:`${bridge.englishPct}%`};
 if(components.readiness.coverage<70)return {icon:'📘',title:'roadmapActionCoverage',reason:'roadmapReasonCoverage',route:'studysetup',detail:`${components.readiness.coverage}%`};
 if(components.readiness.accuracy<78)return {icon:'🧬',title:'roadmapActionAccuracy',reason:'roadmapReasonAccuracy',route:'progress',detail:`${components.readiness.accuracy}%`};
 if(!(progress.exams||[]).length||examPct<86)return {icon:'⏱️',title:'roadmapActionExam',reason:'roadmapReasonExam',route:'examsetup',detail:examPct?`${examPct}%`:'35 / 45'};
 if(components.passport.pct<100)return {icon:'🧭',title:'roadmapActionPassport',reason:'roadmapReasonPassport',route:'passport',detail:`${components.passport.pct}%`};
 if(!schoolCompare.length)return {icon:'🏫',title:'roadmapActionSchool',reason:'roadmapReasonSchool',route:'schools'};
 return {icon:'🏆',title:'roadmapActionReady',reason:'roadmapReasonReady',route:'reviewsetup',detail:`${components.overall}%`};
}
function roadmapTargetState(){
 if(!personalRoadmap.targetDate)return {type:'none',days:null,text:t('roadmapNoTarget')};
 const days=passportDaysUntil(personalRoadmap.targetDate);
 if(days<0)return {type:'passed',days,text:`${Math.abs(days)} ${t('days')} — ${t('roadmapTargetPassed')}`};
 if(days===0)return {type:'today',days,text:t('roadmapTargetToday')};
 return {type:'future',days,text:`${days} ${t('roadmapDaysToTarget')}`};
}
function roadmapStudyPace(){
 const st=stats();
 const remaining=Math.max(0,Q.length-st.seen);
 const questionsPerSession=Math.max(5,Math.round(personalRoadmap.dailyMinutes*.65));
 const sessions=remaining?Math.ceil(remaining/questionsPerSession):0;
 return {remaining,questionsPerSession,sessions};
}
function roadmapAchievements(){
 const st=stats();
 const day=dailyStats();
 const bridge=latestBridgeResult();
 const passport=passportRequiredStats();
 const exams=progress.exams||[];
 return [
  {icon:'◎',label:'roadmapAchievementProfile',done:profileComplete()},
  {icon:'2️⃣5️⃣',label:'roadmapAchievement25',done:st.seen>=25},
  {icon:'💯',label:'roadmapAchievement100',done:st.seen>=100},
  {icon:'⏱️',label:'roadmapAchievementExam',done:exams.length>=1},
  {icon:'✅',label:'roadmapAchievementPass',done:exams.some(exam=>Number(exam.score||0)>=30)},
  {icon:'🌉',label:'roadmapAchievementBridge',done:Boolean(bridge&&Number(bridge.masteredPct||0)>=80)},
  {icon:'🔥',label:'roadmapAchievementStreak',done:day.streak>=7},
  {icon:'🧭',label:'roadmapAchievementPassport',done:passport.pct>=100}
 ];
}
function roadmapWeekPlan(){
 const weak=roadmapWeakestTopic();
 const action=roadmapNextAction();
 return [
  {day:0,icon:action.icon,title:action.title,route:action.route,recommended:true},
  {day:1,icon:'📘',title:'roadmapStepDaily',route:'dailysetup'},
  {day:2,icon:weak.topic.icon,title:'roadmapStepWeak',route:'studysetup',detail:t(weak.topic.title)},
  {day:3,icon:'🌉',title:'roadmapStepBridge',route:'bridgesetup'},
  {day:4,icon:'⏳',title:'roadmapStepReview',route:'reviewsetup'},
  {day:5,icon:'⏱️',title:'roadmapStepExam',route:'examsetup'},
  {day:6,icon:personalRoadmap.mainGoal==='tag'?'🧭':'🧬',title:personalRoadmap.mainGoal==='tag'?'roadmapStepPassport':'roadmapStepReflect',route:personalRoadmap.mainGoal==='tag'?'passport':'progress'}
 ];
}
function roadmapDayLabel(offset){
 const date=new Date();
 date.setDate(date.getDate()+offset);
 const locale=settings.lang==='it'?'it-IT':settings.lang==='mt'?'mt-MT':'en-GB';
 const label=new Intl.DateTimeFormat(locale,{weekday:'short',day:'numeric'}).format(date);
 return offset===0?`${t('roadmapToday')} • ${label}`:label;
}
function roadmapOverallLabel(score){
 if(score>=75)return 'roadmapOverallGood';
 if(score>=40)return 'roadmapOverallGrowing';
 return 'roadmapOverallStart';
}
function collectRoadmapForm(){
 return {
  targetDate:$('#roadmapTargetDate')?.value||'',
  dailyMinutes:Math.max(10,Math.min(120,Number($('#roadmapDailyMinutes')?.value)||20)),
  studyDays:Math.max(1,Math.min(7,Number($('#roadmapStudyDays')?.value)||5)),
  mainGoal:$('#roadmapMainGoal')?.value==='exam'?'exam':'tag',
  savedAt:new Date().toISOString()
 };
}
function saveRoadmapForm(){
 personalRoadmap=collectRoadmapForm();
 save(ROADMAP_KEY,personalRoadmap);
 toast(t('roadmapPlanSaved'));
 render();
}
function roadmapReportText(){
 const component=roadmapComponentStats();
 const action=roadmapNextAction();
 const weak=roadmapWeakestTopic();
 const target=roadmapTargetState();
 const achievements=roadmapAchievements();
 const pace=roadmapStudyPace();
 return [
  'MALTA DRIVING MASTER — PERSONAL ROADMAP',
  '',
  `${t('registeredUser')}: ${[userProfile.firstName,userProfile.lastName].filter(Boolean).join(' ')||t('notProvided')}`,
  `${t('roadmapJourneyScore')}: ${component.overall}% — ${t(roadmapOverallLabel(component.overall))}`,
  `${t('roadmapStudyScore')}: ${component.readiness.score}%`,
  `${t('roadmapEnglishScore')}: ${component.bridgeScore}%`,
  `${t('roadmapPassportScore')}: ${component.passport.pct}%`,
  `${t('roadmapDailyScore')}: ${component.dailyScore}%`,
  `${t('roadmapTargetDate')}: ${personalRoadmap.targetDate?passportDateLabel(personalRoadmap.targetDate):t('roadmapNoTarget')}`,
  `${target.text}`,
  '',
  `${t('roadmapNextAction')}: ${t(action.title)}`,
  `${t('roadmapWhy')}: ${t(action.reason)}`,
  `${t('roadmapWeakestTopic')}: ${t(weak.topic.title)} — ${weak.values.accuracy}%`,
  '',
  `${t('roadmapCoverage')}: ${component.readiness.coverage}%`,
  `${t('roadmapAccuracy')}: ${component.readiness.accuracy}%`,
  `${t('roadmapExamAverage')}: ${component.readiness.examAverage}%`,
  `${t('roadmapQuestionsLeft')}: ${pace.remaining}`,
  `${t('roadmapSessions')}: ${pace.sessions}`,
  '',
  `${t('roadmapAchievements')}:`,
  ...achievements.map(item=>`${item.done?'✓':'□'} ${t(item.label)}`),
  '',
  `${t('roadmapInternalEstimate')}`,
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
}
function bindRoadmap(){
 $('#saveRoadmap').onclick=saveRoadmapForm;
 $('#shareRoadmap').onclick=()=>shareTextReport(t('personalRoadmap'),roadmapReportText(),t('roadmapCopied'));
 $('#copyRoadmap').onclick=()=>copyTextSafe(roadmapReportText(),t('roadmapCopied'));
 $('#resetRoadmap').onclick=()=>{
  if(!confirm(t('roadmapResetConfirm')))return;
  personalRoadmap={...DEFAULT_PERSONAL_ROADMAP};
  localStorage.removeItem(ROADMAP_KEY);
  toast(t('roadmapResetDone'));
  render();
 };
}

function passportChecklistItems(){
 const general=[];
 const tcn=[];
 const submission=[];
 if(lptvPassport.mode==='new'){
  general.push(
   {id:'id',label:'passportDocId',required:true},
   {id:'licence',label:'passportDocLicence',required:true},
   {id:'twoYears',label:'passportDocTwoYears',required:true},
   {id:'points',label:'passportDocPoints',required:true},
   {id:'course',label:'passportDocCourse',required:true},
   {id:'medical',label:'passportDocMedical',required:true},
   {id:'criminalLocal',label:'passportDocCriminalLocal',required:true},
   {id:'criminalForeign',label:'passportDocCriminalForeign',required:false},
   {id:'photo',label:'passportDocPhoto',required:false}
  );
  submission.push(
   {id:'dpa13',label:'passportDocDPA13',required:true},
   {id:'feeNew',label:'passportDocFeeNew',required:true}
  );
 }else{
  general.push(
   {id:'id',label:'passportDocId',required:true},
   {id:'copyLicence',label:'passportDocCopyLicence',required:true},
   {id:'medical',label:'passportDocMedical',required:true},
   {id:'policeConduct',label:'passportDocPoliceConduct',required:true},
   {id:'bluePaper',label:'passportDocBluePaper',required:false}
  );
  submission.push(
   {id:'dpa14',label:'passportDocDPA14',required:true},
   {id:'feeRenew',label:'passportDocFeeRenew',required:true}
  );
 }
 if(lptvPassport.applicantType==='tcn'){
  tcn.push(
   {id:'jobsplus',label:'passportDocJobsplus',required:true},
   {id:'dpa16',label:'passportDocDPA16',required:true},
   {id:'operator15',label:'passportDocOperator15',required:true},
   {id:'singlePermit',label:'passportDocSinglePermit',required:true},
   {id:'signatory',label:'passportDocSignatory',required:false}
  );
 }
 return [
  {id:'general',title:'passportGeneral',items:general},
  ...(tcn.length?[{id:'tcn',title:'passportTCNExtra',items:tcn}]:[]),
  {id:'submission',title:'passportSubmission',items:submission}
 ];
}
function passportAllItems(){
 return passportChecklistItems().flatMap(group=>group.items);
}
function passportRequiredStats(){
 const required=passportAllItems().filter(item=>item.required);
 const done=required.filter(item=>Boolean(lptvPassport.checklist[item.id])).length;
 return {done,total:required.length,pct:required.length?Math.round(done/required.length*100):0};
}
function addYearsIso(value,years){
 if(!value)return '';
 const date=new Date(value+'T12:00:00');
 if(Number.isNaN(date.getTime()))return '';
 date.setFullYear(date.getFullYear()+years);
 return date.toISOString().slice(0,10);
}
function passportLicenceEligibility(){
 if(lptvPassport.mode!=='new')return {state:'renewal',eligible:true,date:''};
 const date=lptvPassport.licenceSince;
 const points=lptvPassport.penaltyPoints;
 if(!date||points==='')return {state:'unknown',eligible:false,date:addYearsIso(date,2)};
 const eligibleDate=addYearsIso(date,2);
 const dateOk=eligibleDate&&eligibleDate<=dateKey();
 const pointsOk=Number(points)<=6;
 return {
  state:dateOk&&pointsOk?'ok':!dateOk?'licence':'points',
  eligible:dateOk&&pointsOk,
  date:eligibleDate,
  dateOk,
  pointsOk
 };
}
function passportDateLabel(value){
 if(!value)return '';
 try{
  const locale=settings.lang==='it'?'it-IT':settings.lang==='mt'?'mt-MT':'en-GB';
  return new Intl.DateTimeFormat(locale,{dateStyle:'medium'}).format(new Date(value+'T12:00:00'));
 }catch{return value}
}
function passportDaysUntil(value){
 if(!value)return null;
 const today=new Date();today.setHours(12,0,0,0);
 const target=new Date(value+'T12:00:00');
 return Math.round((target-today)/86400000);
}
function passportRelevantExpiryEntries(){
 const labels={
  drivingLicence:'passportDrivingExpiry',
  residence:'passportResidenceExpiry',
  employment:'passportEmploymentExpiry',
  operatorLicence:'passportOperatorExpiry',
  tagExpiry:'passportTagExpiry'
 };
 return Object.entries(labels)
  .map(([key,label])=>({key,label,value:lptvPassport.dates[key]}))
  .filter(item=>item.value)
  .sort((a,b)=>a.value.localeCompare(b.value));
}
function passportEarliestExpiry(){
 return passportRelevantExpiryEntries()[0]||null;
}
function collectPassportForm(){
 const checklist={...lptvPassport.checklist};
 screen.querySelectorAll('[data-passport-check]').forEach(input=>{
  checklist[input.dataset.passportCheck]=input.checked;
 });
 return {
  mode:$('#passportMode')?.value||lptvPassport.mode,
  applicantType:$('#passportApplicantType')?.value||lptvPassport.applicantType,
  status:$('#passportStatus')?.value||lptvPassport.status,
  licenceSince:$('#passportLicenceSince')?.value||'',
  penaltyPoints:$('#passportPenaltyPoints')?.value??'',
  checklist,
  dates:{
   drivingLicence:$('#passportDrivingExpiry')?.value||'',
   residence:$('#passportResidenceExpiry')?.value||'',
   employment:$('#passportEmploymentExpiry')?.value||'',
   operatorLicence:$('#passportOperatorExpiry')?.value||'',
   tagExpiry:$('#passportTagExpiry')?.value||'',
   medical:$('#passportMedicalDate')?.value||'',
   application:$('#passportApplicationDate')?.value||''
  },
  notes:cleanProfileValue($('#passportNotes')?.value,3000),
  savedAt:new Date().toISOString()
 };
}
function savePassportForm(showToast=true){
 lptvPassport=collectPassportForm();
 save(PASSPORT_KEY,lptvPassport);
 if(showToast)toast(t('passportSaved'));
 return lptvPassport;
}
function passportReportText(){
 const stats=passportRequiredStats();
 const eligibility=passportLicenceEligibility();
 const earliest=passportEarliestExpiry();
 const completed=passportAllItems()
  .filter(item=>lptvPassport.checklist[item.id])
  .map(item=>`✓ ${t(item.label)}`)
  .join('\n');
 const missing=passportAllItems()
  .filter(item=>item.required&&!lptvPassport.checklist[item.id])
  .map(item=>`□ ${t(item.label)}`)
  .join('\n');
 return [
  'MALTA DRIVING MASTER — LPTV PASSPORT',
  '',
  `${t('registeredUser')}: ${[userProfile.firstName,userProfile.lastName].filter(Boolean).join(' ')||t('notProvided')}`,
  `${t('passportMode')}: ${t(lptvPassport.mode==='new'?'passportNew':'passportRenewal')}`,
  `${t('passportApplicantType')}: ${t(lptvPassport.applicantType==='maltese'?'passportMaltese':lptvPassport.applicantType==='tcn'?'passportTCN':'passportEU')}`,
  `${t('passportStatus')}: ${t({
   planning:'passportPlanning',collecting:'passportCollecting',ready:'passportReady',
   submitted:'passportSubmitted',eligibility:'passportEligibilityLetter',
   waiting:'passportWaiting',issued:'passportIssued'
  }[lptvPassport.status]||'passportPlanning')}`,
  `${t('passportCurrentProgress')}: ${stats.done}/${stats.total} (${stats.pct}%)`,
  eligibility.date?`${t('passportEligibleDate')}: ${passportDateLabel(eligibility.date)}`:'',
  earliest?`${t('passportEarliestExpiry')}: ${t(earliest.label)} — ${passportDateLabel(earliest.value)}`:'',
  '',
  `${t('passportCompleted')}:`,
  completed||'—',
  '',
  `${t('passportAttention')}:`,
  missing||'—',
  '',
  `${t('passportNotes')}: ${lptvPassport.notes||'—'}`,
  '',
  `${t('passportChecked')}: ${PASSPORT_OFFICIAL_CHECKED}`,
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].filter(Boolean).join('\n');
}
function icsEscape(value){
 return String(value||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
}
function icsDate(value){
 return String(value||'').replaceAll('-','');
}
function dateMinusDays(value,days){
 const date=new Date(value+'T12:00:00');
 date.setDate(date.getDate()-days);
 return date.toISOString().slice(0,10);
}
function passportReminderText(entries){
 const offsets=[90,60,30,14,7,1];
 const rows=['MALTA DRIVING MASTER — LPTV PASSPORT',''];
 entries.forEach(entry=>{
  rows.push(`${t(entry.label)}: ${passportDateLabel(entry.value)}`);
  offsets.forEach(offset=>{
   const reminder=dateMinusDays(entry.value,offset);
   if(reminder>=dateKey())rows.push(`• ${passportDateLabel(reminder)} — ${offset} ${t('days')} prima`);
  });
  rows.push('');
 });
 return rows.join('\n').trim();
}
async function createPassportCalendar(){
 savePassportForm(false);
 const entries=passportRelevantExpiryEntries();
 if(!entries.length)return toast(t('passportCalendarMissing'));
 const today=dateKey();
 const offsets=[90,60,30,14,7,1];
 const events=[];
 for(const entry of entries){
  for(const offset of offsets){
   const reminder=dateMinusDays(entry.value,offset);
   if(reminder<today)continue;
   events.push([
    'BEGIN:VEVENT',
    `UID:${entry.key}-${entry.value}-${offset}@maltadrivingmaster`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z')}`,
    `DTSTART;VALUE=DATE:${icsDate(reminder)}`,
    `SUMMARY:${icsEscape(`LPTV Passport — ${t(entry.label)} tra ${offset} giorni`)}`,
    `DESCRIPTION:${icsEscape(`${t(entry.label)}: ${passportDateLabel(entry.value)}. Controlla i requisiti aggiornati su Transport Malta.`)}`,
    'END:VEVENT'
   ].join('\r\n'));
  }
 }
 if(!events.length)return toast(t('passportCalendarMissing'));
 const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Malta Driving Master//LPTV Passport//IT','CALSCALE:GREGORIAN','METHOD:PUBLISH',...events,'END:VCALENDAR'].join('\r\n');
 const filename='LPTV-Passport-Promemoria.ics';
 try{
  const file=new File([content],filename,{type:'text/calendar'});
  if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
   await navigator.share({
    files:[file],
    title:'LPTV Passport',
    text:t('passportCalendar')
   });
   toast(t('passportCalendarShared'));
   return;
  }
 }catch(error){
  if(error&&error.name==='AbortError')return;
 }
 try{
  const blob=new Blob([content],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;
  link.download=filename;
  link.style.display='none';
  document.body.appendChild(link);
  link.click();
  setTimeout(()=>{link.remove();URL.revokeObjectURL(url)},1500);
 }catch{}
 await copyTextSafe(passportReminderText(entries),t('passportCalendarCopiedFallback'));
}
function passportChecklistHtml(){
 return passportChecklistItems().map(group=>`<section class="passport-check-group">
  <h3>${esc(t(group.title))}</h3>
  ${group.items.map(item=>`<label class="passport-check-row ${item.required?'required':'optional'}">
   <input type="checkbox" data-passport-check="${esc(item.id)}" ${lptvPassport.checklist[item.id]?'checked':''}>
   <span><strong>${esc(t(item.label))}</strong><small>${item.required?'*':''}</small></span>
  </label>`).join('')}
 </section>`).join('');
}
function passportOfficialLinkList(){
 return [
  ['main','passportMainPage'],
  [lptvPassport.mode==='new'?'dpa13':'dpa14',lptvPassport.mode==='new'?'passportDPA13':'passportDPA14'],
  ['drv032','passportDRV032'],
  ['dpa16','passportDPA16'],
  [lptvPassport.mode==='new'?'sopt01':'sopt02',lptvPassport.mode==='new'?'passportSOPT01':'passportSOPT02'],
  ['operatorGuide','passportOperatorGuide'],
  ['training','passportTraining'],
  ['downloads','passportDownloads'],
  ['contact','passportContact']
 ];
}
function passportOfficialLinksHtml(){
 return passportOfficialLinkList().map(([key,label])=>`<article class="passport-official-link">
  <div><span>↗</span><strong>${esc(t(label))}</strong></div>
  <div class="passport-official-actions">
   <button class="btn secondary" data-passport-open-link="${esc(key)}">${esc(t('passportOpenDirect'))}</button>
   <button class="btn secondary" data-passport-share-link="${esc(key)}">${esc(t('passportShareOfficial'))}</button>
  </div>
 </article>`).join('');
}
function openPassportOfficialLink(key){
 const url=PASSPORT_LINKS[key];
 if(!url)return;
 window.location.href=url;
}
async function sharePassportOfficialLink(key){
 const url=PASSPORT_LINKS[key];
 if(!url)return;
 const item=passportOfficialLinkList().find(([value])=>value===key);
 const title=item?t(item[1]):t('passportOfficialShareText');
 try{
  if(navigator.share){
   await navigator.share({title,text:t('passportOfficialShareText'),url});
   return;
  }
 }catch(error){
  if(error&&error.name==='AbortError')return;
 }
 await copyTextSafe(url,t('passportOfficialCopied'));
}
function bindPassport(){
 const dynamicIds=['passportMode','passportApplicantType'];
 dynamicIds.forEach(id=>$('#'+id).onchange=()=>{
  savePassportForm(false);
  render();
 });
 const autosaveIds=[
  'passportStatus','passportLicenceSince','passportPenaltyPoints',
  'passportDrivingExpiry','passportResidenceExpiry','passportEmploymentExpiry',
  'passportOperatorExpiry','passportTagExpiry','passportMedicalDate',
  'passportApplicationDate','passportNotes'
 ];
 autosaveIds.forEach(id=>{
  const element=$('#'+id);
  if(element)element.onchange=()=>savePassportForm(false);
 });
 screen.querySelectorAll('[data-passport-check]').forEach(input=>{
  input.onchange=()=>{
   savePassportForm(false);
   const stats=passportRequiredStats();
   const value=$('#passportProgressValue');
   const bar=$('#passportProgressBar');
   if(value)value.textContent=`${stats.done}/${stats.total} • ${stats.pct}%`;
   if(bar)bar.style.width=stats.pct+'%';
  };
 });
 $('#savePassport').onclick=()=>{savePassportForm(true);render()};
 $('#sharePassport').onclick=()=>{
  savePassportForm(false);
  shareTextReport('LPTV Passport',passportReportText(),t('passportCopied'));
 };
 $('#copyPassport').onclick=()=>{
  savePassportForm(false);
  copyTextSafe(passportReportText(),t('passportCopied'));
 };
 $('#createPassportCalendar').onclick=createPassportCalendar;
 screen.querySelectorAll('[data-passport-open-link]').forEach(button=>{
  button.onclick=()=>openPassportOfficialLink(button.dataset.passportOpenLink);
 });
 screen.querySelectorAll('[data-passport-share-link]').forEach(button=>{
  button.onclick=()=>sharePassportOfficialLink(button.dataset.passportShareLink);
 });
 $('#resetPassport').onclick=()=>{
  if(!confirm(t('passportResetConfirm')))return;
  lptvPassport=JSON.parse(JSON.stringify(DEFAULT_LPTV_PASSPORT));
  localStorage.removeItem(PASSPORT_KEY);
  toast(t('passportResetDone'));
  render();
 };
}

function schoolById(id){return SCHOOL_DEMOS.find(school=>school.id===id)||null}
function schoolAreaLabel(area){return t({north:'areaNorth',central:'areaCentral',south:'areaSouth',gozo:'areaGozo'}[area]||'areaAll')}
function schoolLanguageLabel(code){return code==='it'?'Italiano':code==='mt'?'Malti':'English'}
function schoolCourseLabel(code){return t(code==='b'?'courseB':'courseLptv')}
function schoolTransmissionLabel(code){return t(code==='manual'?'manual':'automatic')}
function schoolScheduleLabel(code){return t(code==='evening'?'evening':code==='weekend'?'weekend':'daytime')}
function schoolServiceLabel(code){
 const map={
  english:'serviceEnglish',
  documents:'serviceDocuments',
  bridge:'serviceBridge',
  progress:'serviceProgress',
  vulnerable:'serviceVulnerable',
  pickup:'servicePickup'
 };
 return t(map[code]||code);
}
function schoolDescription(school){
 return school[`description_${settings.lang}`]||school.description_en;
}
function bridgeSuggestsEnglishSupport(){
 const result=latestBridgeResult();
 if(!result)return false;
 return Number(result.englishPct||0)+10<Number(result.knowledgePct||0)||Number(result.languageIds?.length||0)>0;
}
function schoolMatchDetails(school){
 const prefs=schoolPreferences;
 let earned=10,total=10;
 const reasons=[];

 total+=25;
 if(prefs.course==='any'||school.courses.includes(prefs.course)){earned+=25}

 total+=18;
 if(prefs.area==='all'){earned+=12}
 else if(school.area===prefs.area){earned+=18;reasons.push(t('areaMatch'))}

 total+=18;
 if(prefs.language==='any'){earned+=12}
 else if(school.languages.includes(prefs.language)){earned+=18;reasons.push(t('languageMatch'))}

 total+=10;
 if(prefs.transmission==='any'){earned+=7}
 else if(school.transmission.includes(prefs.transmission)){earned+=10}

 total+=10;
 if(prefs.schedule==='any'){earned+=7}
 else if(school.schedule.includes(prefs.schedule)){earned+=10;reasons.push(t('scheduleMatch'))}

 const needsEnglish=prefs.englishSupport||bridgeSuggestsEnglishSupport();
 total+=5;
 if(!needsEnglish||school.services.includes('english')){
  earned+=5;
  if(needsEnglish&&school.services.includes('english'))reasons.push(t('bridgeMatch'));
 }

 total+=4;
 if(!prefs.documentSupport||school.services.includes('documents'))earned+=4;

 return {
  score:Math.max(0,Math.min(100,Math.round(earned/total*100))),
  reasons:reasons.slice(0,3)
 };
}
function schoolMatchesFilters(school){
 const prefs=schoolPreferences;
 if(prefs.area!=='all'&&school.area!==prefs.area)return false;
 if(prefs.language!=='any'&&!school.languages.includes(prefs.language))return false;
 if(prefs.course!=='any'&&!school.courses.includes(prefs.course))return false;
 if(prefs.transmission!=='any'&&!school.transmission.includes(prefs.transmission))return false;
 if(prefs.schedule!=='any'&&!school.schedule.includes(prefs.schedule))return false;
 if(prefs.englishSupport&&!school.services.includes('english'))return false;
 if(prefs.documentSupport&&!school.services.includes('documents'))return false;
 return true;
}
function sortedSchoolProfiles(){
 return SCHOOL_DEMOS
  .filter(schoolMatchesFilters)
  .map(school=>({school,match:schoolMatchDetails(school)}))
  .sort((a,b)=>b.match.score-a.match.score||a.school.name.localeCompare(b.school.name));
}
function saveSchoolPreferences(){
 save(SCHOOL_PREFS_KEY,schoolPreferences);
}
function schoolCardHtml(school,match){
 const selected=schoolCompare.includes(school.id);
 return `<article class="school-card">
  <div class="school-card-top">
   <div>
    <div class="school-badges">
     <span class="badge demo-school">${esc(t('demoProfile'))}</span>
     ${school.sponsored?`<span class="badge sponsored-school">${esc(t('sponsored'))}</span>`:''}
    </div>
    <h3>${esc(school.name)}</h3>
    <p>${esc(schoolAreaLabel(school.area))} • ${school.languages.map(schoolLanguageLabel).join(' / ')}</p>
   </div>
   <div class="match-score"><strong>${match.score}%</strong><span>${esc(t('matchScore'))}</span></div>
  </div>
  <p class="school-description">${esc(schoolDescription(school))}</p>
  <div class="school-service-chips">${school.services.slice(0,4).map(service=>`<span>${esc(schoolServiceLabel(service))}</span>`).join('')}</div>
  ${match.reasons.length?`<div class="match-reasons"><strong>${esc(t('whyMatched'))}</strong>${match.reasons.map(reason=>`<span>✓ ${esc(reason)}</span>`).join('')}</div>`:''}
  <div class="school-card-actions">
   <button class="btn" data-go="schooldetail" data-id="${esc(school.id)}">${esc(t('schoolDetails'))}</button>
   <button class="btn secondary ${selected?'selected':''}" data-school-compare="${esc(school.id)}">${selected?'✓ '+esc(t('removeFromCompare')):esc(t('addToCompare'))}</button>
  </div>
 </article>`;
}
function renderSchoolResults(){
 const container=$('#schoolResults');
 if(!container)return;
 const list=sortedSchoolProfiles();
 $('#schoolCount').textContent=list.length;
 container.innerHTML=list.length
  ?list.map(item=>schoolCardHtml(item.school,item.match)).join('')
  :`<div class="card school-empty"><span>🔎</span><h3>${esc(t('noResults'))}</h3><p>${esc(t('resetFilters'))}</p></div>`;
 container.querySelectorAll('[data-school-compare]').forEach(button=>{
  button.onclick=()=>toggleSchoolCompare(button.dataset.schoolCompare);
 });
 const compareButton=$('#openSchoolCompare');
 if(compareButton){
  compareButton.textContent=`${t('compareSchools')} (${schoolCompare.length}/3)`;
  compareButton.disabled=schoolCompare.length===0;
 }
}
function toggleSchoolCompare(id){
 if(schoolCompare.includes(id)){
  schoolCompare=schoolCompare.filter(value=>value!==id);
 }else{
  if(schoolCompare.length>=3)return toast(t('compareLimit'));
  schoolCompare.push(id);
 }
 save(SCHOOL_COMPARE_KEY,schoolCompare);
 if(route.name==='schools')renderSchoolResults();
 else render();
}
function bindSchoolDirectory(){
 const area=$('#schoolAreaFilter'),language=$('#schoolLanguageFilter'),course=$('#schoolCourseFilter');
 const transmission=$('#schoolTransmissionFilter'),schedule=$('#schoolScheduleFilter');
 const english=$('#schoolEnglishFilter'),documents=$('#schoolDocumentFilter');

 area.value=schoolPreferences.area;
 language.value=schoolPreferences.language;
 course.value=schoolPreferences.course;
 transmission.value=schoolPreferences.transmission;
 schedule.value=schoolPreferences.schedule;
 english.checked=Boolean(schoolPreferences.englishSupport);
 documents.checked=Boolean(schoolPreferences.documentSupport);

 const update=()=>{
  schoolPreferences={
   area:area.value,
   language:language.value,
   course:course.value,
   transmission:transmission.value,
   schedule:schedule.value,
   englishSupport:english.checked,
   documentSupport:documents.checked
  };
  saveSchoolPreferences();
  renderSchoolResults();
 };
 [area,language,course,transmission,schedule].forEach(control=>control.onchange=update);
 [english,documents].forEach(control=>control.onchange=update);
 $('#updateSchoolMatches').onclick=update;
 $('#openSchoolCompare').onclick=()=>go('schoolcompare');
 renderSchoolResults();
}
function schoolRequestPayload(school){
 if(!profileComplete()){
  toast(t('profileNeededForRequest'));
  go('profile');
  return null;
 }
 const readiness=readinessStats();
 const bridge=latestBridgeResult();
 const subject=`Malta Driving Master - ${t('studentRequest')} - ${school.name}`;
 const body=[
  'RICHIESTA PILOTA STUDENTE / STUDENT PILOT REQUEST',
  '',
  `Profilo scuola selezionato: ${school.name}`,
  `Codice scuola demo: ${school.id}`,
  `Studente: ${userProfile.firstName} ${userProfile.lastName}`,
  `E-mail studente: ${userProfile.email}`,
  `Codice registrazione: ${userProfile.registrationId}`,
  `Zona preferita: ${schoolAreaLabel(schoolPreferences.area)}`,
  `Corso: ${schoolCourseLabel(schoolPreferences.course)}`,
  `Lingua richiesta: ${schoolPreferences.language==='any'?'Any':schoolLanguageLabel(schoolPreferences.language)}`,
  `Cambio: ${schoolPreferences.transmission==='any'?'Any':schoolTransmissionLabel(schoolPreferences.transmission)}`,
  `Orario: ${schoolPreferences.schedule==='any'?'Any':schoolScheduleLabel(schoolPreferences.schedule)}`,
  `Preparazione esame: ${readiness.score}%`,
  `Bridge Test inglese: ${bridge?bridge.englishPct+'%':'Non svolto'}`,
  '',
  'La richiesta è inviata a Malta Driving Master perché questo è un profilo dimostrativo.',
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
 return {subject,body};
}
async function shareSchoolRequest(school){
 const payload=schoolRequestPayload(school);
 if(!payload)return;
 await shareTextReport(payload.subject,`A: ${ADMIN_EMAIL}\n\n${payload.body}`,t('requestPrepared'));
}
function openSchoolRequestGmail(school){
 const payload=schoolRequestPayload(school);
 if(!payload)return;
 const url=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ADMIN_EMAIL)}&su=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
 const opened=window.open(url,'_blank','noopener,noreferrer');
 if(!opened)window.location.href=url;
}
function openSchoolRequestMail(school){
 const payload=schoolRequestPayload(school);
 if(!payload)return;
 window.location.href=`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
}
async function copySchoolRequest(school){
 const payload=schoolRequestPayload(school);
 if(!payload)return;
 await copyTextSafe(`A: ${ADMIN_EMAIL}\nOggetto: ${payload.subject}\n\n${payload.body}`,t('requestPrepared'));
}
function bindSchoolDetail(){
 const school=schoolById(route.data);
 if(!school)return;
 const compare=$('#detailSchoolCompare');
 if(compare)compare.onclick=()=>toggleSchoolCompare(school.id);
 $('#shareSchoolRequest').onclick=()=>shareSchoolRequest(school);
 $('#gmailSchoolRequest').onclick=()=>openSchoolRequestGmail(school);
 $('#mailSchoolRequest').onclick=()=>openSchoolRequestMail(school);
 $('#copySchoolRequest').onclick=()=>copySchoolRequest(school);
}
function bindSchoolCompare(){
 screen.querySelectorAll('[data-remove-compare]').forEach(button=>button.onclick=()=>{
  schoolCompare=schoolCompare.filter(id=>id!==button.dataset.removeCompare);
  save(SCHOOL_COMPARE_KEY,schoolCompare);
  render();
 });
 const clear=$('#clearSchoolComparison');
 if(clear)clear.onclick=()=>{
  schoolCompare=[];
  save(SCHOOL_COMPARE_KEY,schoolCompare);
  render();
 };
}










function aiEffectiveLanguageMode(){
 if(settings.lang==='it')return 'italian';
 if(settings.lang==='en')return 'english';
 if(settings.lang==='mt')return aiInstructor.languageMode==='english'?'english':'bilingual';
 return aiInstructor.languageMode||'bilingual';
}



let errorReplayTimer=null;
let errorReplayStep=0;
function errorReplaySave(){save(ERROR_REPLAY_KEY,errorReplay)}
function errorReplayQuestion(id){return Q.find(question=>question.id===id)||null}
function errorReplayViewedCount(){return Object.keys(errorReplay.viewed).filter(id=>errorReplay.viewed[id]).length}
function errorReplayCompletedCount(){return Object.keys(errorReplay.completed).filter(id=>errorReplay.completed[id]).length}
function replayUi(it,en){return settings.lang==='en'?en:it}
function replayCorrectAnswer(question){
 const list=settings.lang==='en'?question.answers:(question.answers_it||question.answers);
 return (question.correct||[]).map(index=>list[index]).filter(Boolean).join(' • ');
}
function replayAllText(question){
 return [question.question,question.question_it,...(question.answers||[]),...(question.answers_it||[]),question.explanation,question.explanation_it].filter(Boolean).join(' ').toLowerCase();
}
function errorReplayScenario(question){
 const text=replayAllText(question);
 if((text.includes('overtak')||text.includes('sorpass'))&&(text.includes('dip')||text.includes('avvall')||text.includes('bend')||text.includes('curv')||text.includes('crest')||text.includes('hill')))return {type:'overtaking',labelIt:'Sorpasso con visuale limitata',labelEn:'Overtaking with limited view',dangerIt:'La corsia opposta sembra libera, ma un veicolo può essere nascosto dall’avvallamento o dalla curva.',dangerEn:'The opposite lane looks clear, but a vehicle may be hidden by the dip or bend.',safeIt:'Resta dietro al veicolo e sorpassa solo quando tutta la strada davanti è visibile.',safeEn:'Stay behind and overtake only when the whole road ahead is visible.',focusIt:'Visuale completa della corsia opposta',focusEn:'Full view of the opposite lane'};
 if(text.includes('cyclist')||text.includes('bicycle')||text.includes('ciclist')||text.includes('bici'))return {type:'cyclist',labelIt:'Sorpasso di un ciclista',labelEn:'Passing a cyclist',dangerIt:'Velocità e distanza laterale insufficienti non lasciano spazio a una deviazione improvvisa.',dangerEn:'Too much speed and too little side clearance leave no room for a sudden wobble.',safeIt:'Riduci la velocità, aspetta spazio sufficiente e lascia un margine laterale ampio.',safeEn:'Slow down, wait for enough room and leave a wide lateral gap.',focusIt:'Velocità bassa e distanza laterale',focusEn:'Low speed and side clearance'};
 if(text.includes('blind spot')||text.includes('angolo cieco')||text.includes('shoulder')||text.includes('spalla')||text.includes('u-turn')||text.includes('inversione a u'))return {type:'blindspot',labelIt:'Controllo dell’angolo cieco',labelEn:'Blind-spot check',dangerIt:'Gli specchi non mostrano tutta l’area accanto e dietro al veicolo.',dangerEn:'Mirrors do not show the whole area beside and behind the vehicle.',safeIt:'Controlla gli specchi e fai un rapido controllo sopra la spalla prima della manovra.',safeEn:'Check the mirrors and make a quick shoulder check before moving.',focusIt:'Area non visibile negli specchi',focusEn:'Area not visible in mirrors'};
 if(text.includes('pedestrian')||text.includes('crossing')||text.includes('pelican')||text.includes('pedone')||text.includes('attraversamento'))return {type:'crossing',labelIt:'Attraversamento pedonale',labelEn:'Pedestrian crossing',dangerIt:'Il pedone può entrare sulla carreggiata anche quando sembra fermo sul bordo.',dangerEn:'A pedestrian may enter the road even when appearing to wait at the kerb.',safeIt:'Rallenta prima dell’attraversamento, copri il freno e preparati a fermarti.',safeEn:'Slow before the crossing, cover the brake and be ready to stop.',focusIt:'Pedone, bordo strada e spazio di arresto',focusEn:'Pedestrian, kerb and stopping distance'};
 if(text.includes('large vehicle')||text.includes('lorry')||text.includes('truck')||text.includes('bus')||text.includes('veicolo grande')||text.includes('camion'))return {type:'largevehicle',labelIt:'Distanza da un veicolo grande',labelEn:'Following a large vehicle',dangerIt:'Troppo vicino perdi la visuale e puoi sparire dagli specchi del conducente.',dangerEn:'Following too closely blocks your view and may hide you from the driver’s mirrors.',safeIt:'Aumenta la distanza finché vedi gli specchi del veicolo e la strada davanti.',safeEn:'Increase the gap until you can see its mirrors and the road ahead.',focusIt:'Specchi del veicolo e visuale davanti',focusEn:'Vehicle mirrors and view ahead'};
 if(text.includes('mobile phone')||text.includes('hands-free')||text.includes('telefono')||text.includes('vivavoce'))return {type:'phone',labelIt:'Distrazione alla guida',labelEn:'Driver distraction',dangerIt:'Lo sguardo o l’attenzione mentale lasciano la strada proprio mentre la situazione cambia.',dangerEn:'Your eyes or mental attention leave the road while the situation is changing.',safeIt:'Non usare il telefono durante la guida; fermati in un luogo sicuro prima di utilizzarlo.',safeEn:'Do not use the phone while driving; stop safely before using it.',focusIt:'Occhi, mani e attenzione sulla strada',focusEn:'Eyes, hands and attention on the road'};
 if(text.includes('tunnel')||text.includes('breakdown')||text.includes('hazard light')||text.includes('guasto')||text.includes('galleria'))return {type:'breakdown',labelIt:'Guasto o emergenza',labelEn:'Breakdown or emergency',dangerIt:'Restare esposti nella corsia aumenta il rischio di un secondo incidente.',dangerEn:'Remaining exposed in the traffic lane increases the risk of a secondary collision.',safeIt:'Accendi le luci di emergenza, porta il veicolo fuori dalla corsia quando possibile e cerca aiuto da un punto protetto.',safeEn:'Use hazard lights, move out of the lane when possible and seek help from a protected place.',focusIt:'Visibilità, posizione sicura e via di fuga',focusEn:'Visibility, safe position and escape route'};
 if(text.includes('wheelchair')||text.includes('disabled')||text.includes('vulnerable passenger')||text.includes('passenger')||text.includes('passegger'))return {type:'passenger',labelIt:'Sicurezza del passeggero',labelEn:'Passenger safety',dangerIt:'Partire prima che il passeggero sia stabile o assicurato può causare una caduta o un infortunio.',dangerEn:'Moving before the passenger is stable or secured can cause a fall or injury.',safeIt:'Attendi che il passeggero sia seduto, assicurato e lontano dalle parti mobili prima di partire.',safeEn:'Wait until the passenger is seated, secured and clear of moving parts before setting off.',focusIt:'Posizione, cintura e porte',focusEn:'Position, restraint and doors'};
 if(text.includes('load')||text.includes('loading')||text.includes('cargo')||text.includes('carico'))return {type:'loading',labelIt:'Carico sicuro',labelEn:'Safe loading',dangerIt:'Un carico non fissato può spostarsi, alterare la stabilità o colpire persone.',dangerEn:'Unsecured cargo can move, affect stability or strike people.',safeIt:'Distribuisci il peso, fissa il carico e controlla porte e sporgenze prima di partire.',safeEn:'Distribute the weight, secure the load and check doors and projections before moving.',focusIt:'Peso, fissaggio e stabilità',focusEn:'Weight, restraint and stability'};
 if(topicIdFor(question)==='eco'||text.includes('fuel')||text.includes('emission')||text.includes('eco'))return {type:'eco',labelIt:'Guida fluida ed efficiente',labelEn:'Smooth and efficient driving',dangerIt:'Accelerazioni e frenate brusche aumentano consumo, emissioni e rischio.',dangerEn:'Harsh acceleration and braking increase fuel use, emissions and risk.',safeIt:'Anticipa il traffico, mantieni una velocità regolare e usa comandi progressivi.',safeEn:'Read the traffic ahead, keep a steady speed and use progressive controls.',focusIt:'Anticipo, fluidità e spazio',focusEn:'Anticipation, smoothness and space'};
 if(text.includes('mirror')&&text.includes('signal')&&text.includes('manoeuvre'))return {type:'routine',labelIt:'Sequenza Specchio–Segnale–Manovra',labelEn:'Mirror–Signal–Manoeuvre routine',dangerIt:'Cambiare direzione senza una sequenza ordinata può sorprendere gli altri utenti.',dangerEn:'Changing direction without a clear routine may surprise other road users.',safeIt:'Controlla gli specchi, segnala in tempo e compi la manovra solo quando è sicura.',safeEn:'Check mirrors, signal in good time and manoeuvre only when safe.',focusIt:'Osservazione prima dell’azione',focusEn:'Observation before action'};
 return {type:'general',labelIt:'Decisione di guida sicura',labelEn:'Safe driving decision',dangerIt:'Agire senza osservare e valutare lascia poco margine per correggere un errore.',dangerEn:'Acting without observing and assessing leaves little margin to correct a mistake.',safeIt:'Osserva, identifica il pericolo e applica la risposta indicata dalla regola.',safeEn:'Observe, identify the hazard and apply the action required by the rule.',focusIt:'Osservazione, rischio e azione',focusEn:'Observation, risk and action'};
}
function errorReplaySceneType(question){return errorReplayScenario(question).type}
function errorReplaySceneLabel(type){
 const q=errorReplayQuestion(route.data?.questionId||errorReplay.lastQuestionId||'');
 const s=q?errorReplayScenario(q):null;
 if(s&&s.type===type)return replayUi(s.labelIt,s.labelEn);
 return replayUi('Scenario di sicurezza stradale','Road-safety scenario');
}
function errorReplayMarkViewed(id){errorReplay.viewed[id]=true;errorReplay.lastQuestionId=id;errorReplay.lastVisit=new Date().toISOString();errorReplaySave()}
function errorReplayMarkCompleted(id){errorReplay.completed[id]=true;errorReplaySave();cloudAddQueueEvent('error-replay',{questionId:id,action:'complete'})}
/* Legacy SVG replay renderer permanently removed in Build 39.9.5. */
function replayPerceptionAverage(){
 const p=errorReplay.perception||{};
 return p.hits?Math.round((p.totalMs||0)/p.hits):0;
}
function replayPerceptionScore(){
 const p=errorReplay.perception||{};
 if(!p.attempts)return 0;
 const accuracy=(p.hits||0)/p.attempts;
 const avg=replayPerceptionAverage();
 const speed=p.hits?Math.max(0,1-Math.max(0,avg-900)/4100):0;
 return Math.round((accuracy*.72+speed*.28)*100);
}
function replayPerceptionPanel(){
 const p=errorReplay.perception||{attempts:0,hits:0,totalMs:0,bestMs:0};
 const avg=replayPerceptionAverage(),score=replayPerceptionScore();
 return `<div class="vision-score-card">
  <div><span>PERCEPTION SCORE</span><strong>${score}</strong><small>/100</small></div>
  <dl>
   <div><dt>${esc(replayUi('Precisione','Accuracy'))}</dt><dd>${p.attempts?Math.round((p.hits||0)/p.attempts*100):0}%</dd></div>
   <div><dt>${esc(replayUi('Tempo medio','Average time'))}</dt><dd>${avg?`${(avg/1000).toFixed(1)}s`:'—'}</dd></div>
   <div><dt>${esc(replayUi('Migliore','Best'))}</dt><dd>${p.bestMs?`${(p.bestMs/1000).toFixed(1)}s`:'—'}</dd></div>
  </dl>
 </div>`;
}

const REAL_FILM_SCENES={
 observe:'https://unsplash.com/photos/tWRuTSUd0Qg/download?force=true&w=1600',
 reveal:'https://unsplash.com/photos/6kniumtSVl4/download?force=true&w=1600',
 safe:'https://unsplash.com/photos/tWRuTSUd0Qg/download?force=true&w=1600'
};

function replayRealFilmCopy(scenario,phase){
 if(phase===0)return {
  kicker:replayUi('SCENA REALE · OSSERVAZIONE','REAL SCENE · OBSERVATION'),
  title:replayUi('Non decidere finché non vedi tutta la strada','Do not decide until the whole road is visible'),
  body:replayUi('Osserva dove la carreggiata scompare. Tocca quel punto prima di vedere la spiegazione.','Watch where the road disappears. Tap that point before revealing the explanation.')
 };
 if(phase===1)return {
  kicker:replayUi('FREEZE TIME · PERICOLO','FREEZE TIME · HAZARD'),
  title:replayUi('La curva elimina la visuale necessaria al sorpasso','The bend removes the visibility needed to overtake'),
  body:replayUi('La strada oltre la curva non è controllabile. Un veicolo può comparire quando la manovra è già iniziata.','The road beyond the bend cannot be checked. A vehicle may appear after the manoeuvre has already started.')
 };
 if(phase===2)return {
  kicker:replayUi('SPIEGAZIONE · REGOLA','EXPLANATION · RULE'),
  title:replayUi('Aspetta una visuale continua e completamente libera','Wait for a continuous, completely clear view'),
  body:replayUi('Rimani nella tua corsia e valuta nuovamente il sorpasso soltanto su un tratto lungo, diritto e visibile.','Stay in your lane and reassess only on a long, straight and fully visible section.')
 };
 return {
  kicker:replayUi('AZIONE CORRETTA · IN MOVIMENTO','CORRECT ACTION · IN MOTION'),
  title:replayUi('Il conducente rallenta, mantiene la distanza e resta in corsia','The driver slows, keeps distance and stays in lane'),
  body:replayUi('La sequenza mostra la risposta corretta eseguita nella situazione reale: niente sorpasso finché la visuale non è completa.','The sequence shows the correct answer being carried out in the real situation: no overtaking until visibility is complete.')
 };
}




let replayCoachFeedback=null;

function replayCoachCardHtml(){
 if(!replayCoachFeedback)return '';
 const icon=replayCoachFeedback.tone==='success'?'✓':replayCoachFeedback.tone==='warning'?'!':'i';
 return `<div class="replay-coach-card ${replayCoachFeedback.tone}">
  <div class="replay-coach-icon">${icon}</div>
  <div>
   <span>${esc(replayUi('COACH DINAMICO','DYNAMIC COACH'))}</span>
   <strong>${esc(replayCoachFeedback.title)}</strong>
   <p>${esc(replayCoachFeedback.body)}</p>
  </div>
 </div>`;
}


function replayCoachVisibleHtml(){
 if(!replayCoachFeedback)return '';
 const icon=replayCoachFeedback.tone==='success'?'✓':replayCoachFeedback.tone==='warning'?'!':'i';
 return `<div class="replay-coach-visible ${replayCoachFeedback.tone}" data-visible-coach>
  <div class="replay-coach-visible-icon">${icon}</div>
  <div>
   <span>${esc(replayUi('COACH DINAMICO','DYNAMIC COACH'))}</span>
   <strong>${esc(replayCoachFeedback.title)}</strong>
   <p>${esc(replayCoachFeedback.body)}</p>
  </div>
 </div>`;
}

function replayDifficultyHtml(question){
 const scene=replaySceneSelection(question).scene;
 const profile=window.ReplayCoach?.getProfile(question,scene);
 const variant=window.ReplayCoach?.variantFor(question,scene);
 if(!profile||!variant)return '';
 const label=settings.lang==='it'?variant.labelIt:variant.labelEn;
 return `<div class="replay-difficulty-card">
  <div><span>${esc(replayUi('DIFFICOLTÀ ADATTIVA','ADAPTIVE DIFFICULTY'))}</span><strong>${esc(replayUi('Livello','Level'))} ${profile.difficulty||1}</strong></div>
  <div><small>${esc(replayUi('Variante attiva','Active variant'))}</small><b>${esc(label)}</b></div>
 </div>`;
}

const ACTIVE_COUNTRY_PACK_ID='MT-LPTV';

function activeCountryPack(){
 return window.CountryPacks?.get(ACTIVE_COUNTRY_PACK_ID)||null;
}

function replayPackStatusHtml(){
 const pack=activeCountryPack();
 if(!pack)return '';
 return `<div class="replay-pack-status">
  <div><span>COUNTRY PACK</span><strong>🇲🇹 ${esc(pack.countryName)} · ${esc(pack.licenceType)}</strong></div>
  <dl>
   <div><dt>${esc(replayUi('Guida','Driving'))}</dt><dd>${esc(replayUi('Sinistra','Left'))}</dd></div>
   <div><dt>${esc(replayUi('Unità','Units'))}</dt><dd>${esc(pack.units.speed)}</dd></div>
  </dl>
  <small>${esc(replayUi(
   'Il motore è pronto per scene maltesi. Il filmato attuale resta un pilot tecnico finché non viene sostituito con materiale girato a Malta.',
   'The engine is ready for Maltese scenes. The current video remains a technical pilot until Malta footage replaces it.'
  ))}</small>
 </div>`;
}

function replayHazardSurfaceHtml(options={}){
 const ariaIt=options.ariaIt||'Tocca il punto in cui termina la visuale';
 const ariaEn=options.ariaEn||'Tap where visibility ends';
 const instructionIt=options.instructionIt||'TOCCA DOVE FINISCE LA VISUALE';
 const instructionEn=options.instructionEn||'TAP WHERE VISIBILITY ENDS';
 const left=Number.isFinite(options.left)?options.left:53;
 const top=Number.isFinite(options.top)?options.top:47;
 return `<button class="replay-hazard-surface" data-hazard-surface
  aria-label="${esc(replayUi(ariaIt,ariaEn))}">
  <span class="hazard-instruction">${esc(replayUi(instructionIt,instructionEn))}</span>
  <i class="hazard-target-guide" style="left:${left}%;top:${top}%"></i>
 </button>`;
}



let replayAssetVerification={};

async function verifyReplayAssets(){
 const pack=activeCountryPack();
 const entries=window.SceneAssets?.list()||[];
 const results={};
 for(const item of entries){
  results[item.sceneKey]=await window.SceneAssets.verify(item.sceneKey,pack);
 }
 replayAssetVerification=results;
 if(route?.name==='errorreplay')render();
 return results;
}

function replayAssetStatusHtml(question){
 const selection=replaySceneSelection(question);
 const key=selection.key;
 const manifest=key?window.SceneAssets?.get(key):null;
 const verification=key?replayAssetVerification[key]:null;
 if(!key)return '';

 const language=settings.lang==='it'?'it':'en';
 let state='waiting';
 let title=language==='it'?'Filmato non ancora inserito':'Footage not added yet';
 let body=language==='it'
  ?'Il Replay non userà video generici. Verrà attivato solo quando il file corretto per Malta sarà presente e approvato.'
  :'The Replay will not use generic footage. It will activate only when the correct approved Malta file is present.';

 if(manifest?.status==='approved'&&verification?.ok){
  state='ready';
  title=language==='it'?'Asset verificato':'Asset verified';
  body=language==='it'
   ?'Video, poster, lato di guida e Country Pack sono compatibili.'
   :'Video, poster, driving side and Country Pack are compatible.';
 }else if(manifest?.status==='approved'&&!verification){
  state='checking';
  title=language==='it'?'Verifica asset in corso':'Checking scene assets';
  body=language==='it'
   ?'Il motore sta controllando video e poster.'
   :'The engine is checking the video and poster.';
 }else if(verification&&!verification.ok){
  state='blocked';
  title=language==='it'?'Scena bloccata correttamente':'Scene correctly blocked';
  body=language==='it'
   ?'Manca un asset approvato e pertinente. Nessun video casuale verrà mostrato.'
   :'An approved relevant asset is missing. No random video will be shown.';
 }

 return `<div class="scene-asset-card ${state}">
  <div class="scene-asset-icon">${state==='ready'?'✓':state==='blocked'?'×':'…'}</div>
  <div>
   <span>${esc(replayUi('CONTROLLO ASSET','ASSET CONTROL'))}</span>
   <strong>${esc(title)}</strong>
   <p>${esc(body)}</p>
   ${manifest?.sourceType==='local'?`<small>${esc(manifest.video)}</small>`:''}
  </div>
 </div>`;
}

function replaySceneSelection(question){
 const key=window.SceneCatalog?.classifyQuestion(question);
 const entry=key?window.SceneCatalog?.get(key):null;
 const pack=activeCountryPack();
 const scene=entry?.engineSceneId?window.ReplayEngine?.getScene(entry.engineSceneId):null;
 const asset=key?window.SceneAssets?.get(key):null;
 const validation=window.SceneCatalog?.validate(entry,scene,pack,question,asset)||{ok:false,reason:'catalog-unavailable'};
 const assetVerification=key?replayAssetVerification[key]:null;
 const assetAllowed=asset?.status==='approved'&&(assetVerification?.ok!==false);
 return {key,entry,scene,validation,asset,assetVerification,assetAllowed};
}

function replaySceneAudit(){
 return window.SceneCatalog?.audit({
  questions:window.LPTV_QUESTIONS||[],
  engine:window.ReplayEngine,
  assets:window.SceneAssets,
  pack:activeCountryPack()
 })||{ok:false,errors:[{code:'audit-unavailable'}],warnings:[]};
}

function replayLibraryCardHtml(question){
 const items=window.SceneCatalog?.list()||[];
 const ready=window.SceneCatalog?.readyCount()||0;
 const selection=replaySceneSelection(question);
 const language=settings.lang==='it'?'it':'en';

 const currentTitle=selection.entry
  ?(language==='it'?selection.entry.titleIt:selection.entry.titleEn)
  :replayUi('Nessuna scena classificata','No classified scene');

 const currentState=selection.validation.ok
  ?replayUi('Pronta e verificata','Ready and verified')
  :selection.entry
   ?replayUi('In produzione: non verrà mostrato un video non pertinente','In production: an unrelated video will not be shown')
   :replayUi('Replay testuale disponibile','Text replay available');

 return `<div class="scene-library-card">
  <div class="scene-library-head">
   <div><span>${esc(replayUi('MALTA REPLAY LIBRARY','MALTA REPLAY LIBRARY'))}</span><strong>${ready} / ${items.length} ${esc(replayUi('scene pronte','scenes ready'))}</strong></div>
   <b>${selection.validation.ok?'✓':'…'}</b>
  </div>
  <div class="scene-library-current">
   <small>${esc(replayUi('Scena collegata alla domanda','Scene linked to this question'))}</small>
   <strong>${esc(currentTitle)}</strong>
   <p>${esc(currentState)}</p>
  </div>
 </div>`;
}

const REPLAY_ACTION_SCENE_ID='MT_OVERTAKE_LIMITED_VIEW_V1';
const PEDESTRIAN_WAVE_SCENE_ID='MT_PEDESTRIAN_WAVE_ACROSS_V1';
const ZEBRA_WAITING_SCENE_ID='MT_ZEBRA_WAITING_STOP_V1';
function replayPhaseContinueHtml(phase){
 if(phase!==1&&phase!==2)return '';
 return `<button type="button" class="replay-phase-continue" data-replay-phase-continue="${phase+1}">${esc(replayUi('Continua','Continue'))}<span aria-hidden="true">→</span></button>`;
}
function replayZebraWaitingOverlay(phase){
 if(phase===1)return `<div class="wave-across-freeze danger"><strong>${esc(replayUi('PEDONI IN ATTESA: DEVI ESSERE PRONTO A FERMARTI','PEDESTRIANS WAITING: BE READY TO STOP'))}</strong><span>${esc(replayUi('Avvicinarti troppo velocemente riduce il tempo per reagire e può mettere i pedoni in pericolo.','Approaching too fast reduces reaction time and may endanger pedestrians.'))}</span>${replayPhaseContinueHtml(phase)}</div>`;
 if(phase===2)return `<div class="wave-across-freeze explain"><strong>${esc(replayUi('RALLENTA E PREPARATI A FERMARTI','SLOW DOWN AND PREPARE TO STOP'))}</strong><span>${esc(replayUi('La risposta corretta della domanda è rallentare e prepararsi a fermarsi per i pedoni in attesa.','The correct answer is to slow down and prepare to stop for pedestrians waiting to cross.'))}</span>${replayPhaseContinueHtml(phase)}</div>`;
 if(phase===3)return `<div class="wave-across-action"><strong>${esc(replayUi('RALLENTA • CONTROLLA • FERMATI SE NECESSARIO','SLOW DOWN • CHECK • STOP IF NECESSARY'))}</strong></div>`;
 return '';
}
function replayZebraWaitingScene(question,phase){
 const labels=[
  [replayUi('SCENA REALE · OSSERVAZIONE','REAL SCENE · OBSERVATION'),replayUi('Tocca i pedoni in attesa vicino all’attraversamento','Tap the pedestrians waiting near the crossing')],
  [replayUi('FREEZE TIME · PERICOLO','FREEZE TIME · HAZARD'),''],
  [replayUi('SPIEGAZIONE · REGOLA','EXPLANATION · RULE'),''],
  [replayUi('AZIONE CORRETTA · IN MOVIMENTO','CORRECT ACTION · IN MOTION'),'']
 ][phase];
 const options={
  0:{startRatio:0,autoplay:true,endRatio:.48},
  1:{startRatio:.36,freeze:true},
  2:{startRatio:.36,freeze:true},
  3:{startRatio:.48,autoplay:true,endRatio:.95}
 }[phase];
 return `<section class="real-film-replay wave-across-replay zebra-waiting-replay phase-${phase}" data-zebra-waiting>
  <div class="wave-across-stage">
   ${ReplayEngine.renderVideoMarkup(ZEBRA_WAITING_SCENE_ID,{label:replayUi('Pedoni in attesa a un attraversamento zebra','Pedestrians waiting at a zebra crossing')})}
   <div class="real-film-top compact"><span class="real-film-badge"><i></i>${esc(labels[0])}</span><span class="real-film-count">${String(phase+1).padStart(2,'0')} / 04</span></div>
   ${phase===0?`<div class="wave-across-instruction">${esc(labels[1])}</div>${replayHazardSurfaceHtml({instructionIt:'TOCCA I PEDONI IN ATTESA',instructionEn:'TAP THE WAITING PEDESTRIANS',ariaIt:'Tocca i pedoni in attesa vicino all’attraversamento',ariaEn:'Tap the pedestrians waiting near the crossing',left:50,top:58})}`:''}
   ${replayZebraWaitingOverlay(phase)}
  </div>
  ${replayCoachVisibleHtml()}
  <div class="real-film-controls four ${phase===0?'hazard-locked':''}">
   ${['Trova','Pericolo','Spiega','Esegui'].map((name,i)=>`<button class="${phase===i?'active':''}" data-replay-stage="${i}" ${i>phase?'disabled aria-disabled="true"':''}><span>0${i+1}</span><strong>${esc(replayUi(name,['Find','Hazard','Explain','Perform'][i]))}</strong></button>`).join('')}
  </div>
  <template data-replay-phase-options>${esc(JSON.stringify(options))}</template>
 </section>`;
}
function replayWaveAcrossOverlay(phase){
 if(phase===1)return `<div class="wave-across-freeze danger"><div class="driver-wave-hand" aria-hidden="true">✋</div><strong>${esc(replayUi('NON DARE IL VIA CON UN GESTO','DO NOT WAVE THEM ACROSS'))}</strong><span>${esc(replayUi('Il pedone può interpretarlo come “puoi attraversare”.','The pedestrian may interpret it as permission to cross.'))}</span>${replayPhaseContinueHtml(phase)}</div>`;
 if(phase===2)return `<div class="wave-across-freeze explain"><strong>${esc(replayUi('NON PUOI GARANTIRE LE ALTRE CORSIE','YOU CANNOT GUARANTEE THE OTHER LANES'))}</strong><span>${esc(replayUi('Un altro veicolo potrebbe arrivare da una direzione che il pedone non vede.','Another vehicle may approach from a direction the pedestrian cannot see.'))}</span><div class="cross-traffic-arrows">← ${esc(replayUi('TRAFFICO','TRAFFIC'))} →</div>${replayPhaseContinueHtml(phase)}</div>`;
 if(phase===3)return `<div class="wave-across-action"><strong>${esc(replayUi('RALLENTA • NON FARE CENNI • RESTA PRONTO A FERMARTI','SLOW DOWN • DO NOT WAVE • BE READY TO STOP'))}</strong></div>`;
 return '';
}
function replayWaveAcrossScene(question,phase){
 const labels=[
  [replayUi('SCENA REALE · OSSERVAZIONE','REAL SCENE · OBSERVATION'),replayUi('Tocca il pedone e controlla il traffico intorno','Tap the pedestrian and check the surrounding traffic')],
  [replayUi('FREEZE TIME · PERICOLO','FREEZE TIME · HAZARD'),''],
  [replayUi('SPIEGAZIONE · REGOLA','EXPLANATION · RULE'),''],
  [replayUi('AZIONE CORRETTA · IN MOVIMENTO','CORRECT ACTION · IN MOTION'),'']
 ][phase];
 const options={
  0:{startRatio:0,autoplay:true,endRatio:.48},
  1:{startRatio:.36,freeze:true},
  2:{startRatio:.36,freeze:true},
  3:{startRatio:.48,autoplay:true,endRatio:.95}
 }[phase];
 return `<section class="real-film-replay wave-across-replay phase-${phase}" data-wave-across>
  <div class="wave-across-stage">
   ${ReplayEngine.renderVideoMarkup(PEDESTRIAN_WAVE_SCENE_ID,{label:replayUi('Pedoni e traffico a un attraversamento','Pedestrians and traffic at a crossing')})}
   <div class="real-film-top compact"><span class="real-film-badge"><i></i>${esc(labels[0])}</span><span class="real-film-count">${String(phase+1).padStart(2,'0')} / 04</span></div>
   ${phase===0?`<div class="wave-across-instruction">${esc(labels[1])}</div>${replayHazardSurfaceHtml()}`:''}
   ${replayWaveAcrossOverlay(phase)}
  </div>
  ${replayCoachVisibleHtml()}
  <div class="real-film-controls four ${phase===0?'hazard-locked':''}">
   ${['Trova','Pericolo','Spiega','Esegui'].map((name,i)=>`<button class="${phase===i?'active':''}" data-replay-stage="${i}" ${i>phase?'disabled aria-disabled="true"':''}><span>0${i+1}</span><strong>${esc(replayUi(name,['Find','Hazard','Explain','Perform'][i]))}</strong></button>`).join('')}
  </div>
  <template data-replay-phase-options>${esc(JSON.stringify(options))}</template>
 </section>`;
}


function replayCorrectMotionHtml_DEPRECATED(){
 const offlineText=esc(replayUi('Il video richiede una connessione Internet','The video requires an Internet connection'));
 const label=esc(replayUi('Guida reale mantenendo la corsia e la distanza di sicurezza','Real driving while maintaining lane and safety distance'));
 return ReplayEngine.renderVideoMarkup(REPLAY_ACTION_SCENE_ID,{offlineText,label});
}

function replayAnswerCard(copy,phase){
 return `<div class="replay-answer-below ${phase===3?'action':''}">
  <span>${esc(copy.kicker)}</span>
  <h3>${esc(copy.title)}</h3>
  <p>${esc(copy.body)}</p>
  ${phase===3?`<div class="replay-answer-result"><i></i><strong>${esc(replayUi('Risposta corretta eseguita','Correct answer performed'))}</strong></div>`:''}
 </div>`;
}

function replayRealFilmScene_DEPRECATED(question,phase){
 const copy=replayRealFilmCopy(errorReplayScenario(question),phase);
 const image=phase===1?REAL_FILM_SCENES.reveal:REAL_FILM_SCENES.observe;
 const locked=phase===0;

 return `<section class="real-film-replay real-film-phase-${phase}" data-real-film>
  <div class="real-film-stage clean-stage">
   ${phase===3?'':`<img class="real-film-photo" src="${image}"
    alt="${esc(replayUi('Scena stradale reale','Real road scene'))}"
    referrerpolicy="no-referrer"
    onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('real-film-media-error')">`}

   ${phase===3?'':`<div class="real-film-loading">
    <span></span><b>${esc(replayUi('Caricamento scena reale','Loading real scene'))}</b>
   </div><div class="real-film-grade"></div>`}

   <div class="real-film-top compact">
    <span class="real-film-badge"><i></i>${esc(copy.kicker)}</span>
    <span class="real-film-count">${String(phase+1).padStart(2,'0')} / 04</span>
   </div>

   ${phase===0?replayHazardSurfaceHtml():''}

   ${phase===1?`<div class="real-film-reveal-zone">
    <span></span><b>${esc(replayUi('VISUALE INTERROTTA','VISIBILITY ENDS'))}</b>
   </div>`:''}

   ${phase===2?`<div class="real-film-safe-message minimal">
    <i></i><span>${esc(replayUi('ATTENDI','WAIT'))}</span>
   </div>`:''}

   ${phase===3?replayCorrectMotionHtml_DEPRECATED():''}

   <div class="real-film-credit">
    ${phase===1?'Foto: Sergi Kabrera · Unsplash':'Foto: Olya P · Unsplash'}
   </div>
  </div>

  ${replayCoachVisibleHtml()}
  ${replayAnswerCard(copy,phase)}

  <div class="real-film-controls four ${locked?'hazard-locked':''}">
   <button class="${phase===0?'active':''}" data-replay-stage="0">
    <span>01</span><strong>${esc(replayUi('Trova','Find'))}</strong>
   </button>
   <button class="${phase===1?'active':''}" data-replay-stage="1"
    ${locked?'disabled aria-disabled="true"':''}>
    <span>02</span><strong>${esc(replayUi('Pericolo','Hazard'))}</strong>
   </button>
   <button class="${phase===2?'active':''}" data-replay-stage="2"
    ${locked?'disabled aria-disabled="true"':''}>
    <span>03</span><strong>${esc(replayUi('Spiega','Explain'))}</strong>
   </button>
   <button class="${phase===3?'active':''}" data-replay-stage="3"
    ${locked?'disabled aria-disabled="true"':''}>
    <span>04</span><strong>${esc(replayUi('Esegui','Perform'))}</strong>
   </button>
  </div>

  ${replayPerceptionPanel()}
 </section>`;
}

function replayStandardVideoOverlay(scene,phase){
 const ui=scene?.ui||{};
 const phaseData=(ui.phases||[])[phase]||{};
 if(phase===0)return '';
 const tone=phase===1?'danger':phase===2?'explain':'action';
 const title=replayUi(phaseData.titleIt||'',phaseData.titleEn||'');
 const body=replayUi(phaseData.bodyIt||'',phaseData.bodyEn||'');
 return `<div class="wave-across-freeze ${tone}"><strong>${esc(title)}</strong>${body?`<span>${esc(body)}</span>`:''}${replayPhaseContinueHtml(phase)}</div>`;
}
function replayStandardBelowCaption(scene,phase){
 const ui=scene?.ui||{};
 const phaseData=(ui.phases||[])[phase]||{};
 const title=replayUi(phaseData.titleIt||'',phaseData.titleEn||'');
 const body=replayUi(phaseData.bodyIt||'',phaseData.bodyEn||'');
 const learningIt=scene?.learning?.correctIt||'';
 const learningEn=scene?.learning?.correctEn||'';
 if(phase===0){
  const text=replayUi(learningIt,learningEn);
  return text?`<div class="replay-caption-below observe"><span>${esc(replayUi('OBIETTIVO','OBJECTIVE'))}</span><p>${esc(text)}</p></div>`:'';
 }
 if(!title&&!body)return '';
 return `<div class="replay-caption-below ${phase===3?'action':phase===2?'explain':'danger'}"><span>${esc(phase===3?replayUi('AZIONE CORRETTA','CORRECT ACTION'):phase===2?replayUi('SPIEGAZIONE','EXPLANATION'):replayUi('PERICOLO','HAZARD'))}</span>${title?`<strong>${esc(title)}</strong>`:''}${body?`<p>${esc(body)}</p>`:''}</div>`;
}
function replayCaptionVttData(scene,phase){
 const ui=scene?.ui||{};
 const phaseData=(ui.phases||[])[phase]||{};
 const title=replayUi(phaseData.titleIt||'',phaseData.titleEn||'');
 const body=replayUi(phaseData.bodyIt||'',phaseData.bodyEn||'');
 const text=[title,body].filter(Boolean).join(' — ');
 if(!text)return '';
 const safe=text.replace(/-->/g,'→').replace(/\r?\n/g,' ');
 const vtt=`WEBVTT\n\n00:00:00.000 --> 00:10:00.000\n${safe}\n`;
 return `data:text/vtt;charset=utf-8,${encodeURIComponent(vtt)}`;
}
function replayStandardVideoScene(question,phase,scene){
 const ui=scene?.ui||{};
 const hotspot=ui.hotspot||{};
 const options={...((ui.phaseOptions||[])[phase]||({0:{startRatio:0,autoplay:true,endRatio:.48},1:{startRatio:.36,freeze:true},2:{startRatio:.36,freeze:true},3:{startRatio:.48,autoplay:true,endRatio:.95}}[phase]))};
 if(phase===3&&ui.staticUntilFinal){options.freeze=false;options.autoplay=true;}
 const phaseMedia=(ui.phaseMedia||[])[phase]||null;
 if(phaseMedia?.videoSources)options.videoSources=phaseMedia.videoSources;
 const labels=[
  replayUi('SCENA REALE · OSSERVAZIONE','REAL SCENE · OBSERVATION'),
  replayUi('FREEZE TIME · PERICOLO','FREEZE TIME · HAZARD'),
  replayUi('SPIEGAZIONE · REGOLA','EXPLANATION · RULE'),
  replayUi('AZIONE CORRETTA · IN MOVIMENTO','CORRECT ACTION · IN MOTION')
 ];
 const instruction=replayUi(hotspot.instructionIt||'TOCCA IL PERICOLO',hotspot.instructionEn||'TAP THE HAZARD');
 return `<section class="real-film-replay wave-across-replay standard-video-replay phase-${phase}${ui.staticUntilFinal?' static-until-final':''}" data-standard-video>
  <div class="wave-across-stage">
   ${ReplayEngine.renderVideoMarkup(scene.id,{label:replayUi(scene.accessibilityLabel||scene.title,scene.accessibilityLabel||scene.title),mediaOverride:phaseMedia||undefined,captionVtt:phase===3?replayCaptionVttData(scene,phase):'',language:settings.lang==='it'?'it':'en'})}
   <div class="real-film-top compact"><span class="real-film-badge"><i></i>${esc(labels[phase])}</span><span class="real-film-count">${String(phase+1).padStart(2,'0')} / 04</span></div>
   ${phase===0?`<div class="wave-across-instruction">${esc(instruction)}</div>${replayHazardSurfaceHtml({instructionIt:hotspot.instructionIt||'TOCCA IL PERICOLO',instructionEn:hotspot.instructionEn||'TAP THE HAZARD',ariaIt:hotspot.ariaIt||hotspot.instructionIt||'Tocca il pericolo',ariaEn:hotspot.ariaEn||hotspot.instructionEn||'Tap the hazard',left:Number(hotspot.left||50),top:Number(hotspot.top||50)})}`:''}
   ${replayStandardVideoOverlay(scene,phase)}
  </div>
  ${replayStandardBelowCaption(scene,phase)}
  ${replayCoachVisibleHtml()}
  <div class="real-film-controls four ${phase===0?'hazard-locked':''}">
   ${['Trova','Pericolo','Spiega','Esegui'].map((name,i)=>`<button class="${phase===i?'active':''}" data-replay-stage="${i}" ${i>phase?'disabled aria-disabled="true"':''}><span>0${i+1}</span><strong>${esc(replayUi(name,['Find','Hazard','Explain','Perform'][i]))}</strong></button>`).join('')}
  </div>
  <template data-replay-phase-options>${esc(JSON.stringify(options))}</template>
 </section>`;
}
function replayStrictUnavailableScene(question,selection){
 const reason=selection?.validation?.reason||'scene-not-ready';
 return `<section class="real-film-replay strict-unavailable-replay" data-strict-unavailable>
  <div class="strict-unavailable-card">
   <span>${esc(replayUi('SCENA REALE NON DISPONIBILE','REAL SCENE UNAVAILABLE'))}</span>
   <strong>${esc(replayUi('Replay bloccato dal controllo qualità','Replay blocked by quality control'))}</strong>
   <p>${esc(replayUi('Questa domanda non mostrerà disegni o video generici. Verrà riattivata solo con una scena reale approvata e perfettamente pertinente.','This question will not show drawings or generic video. It will be re-enabled only with an approved, directly relevant real scene.'))}</p>
   <small>${esc(reason)}</small>
  </div>
 </section>`;
}
function errorReplayVisualHtml(question,step=0){
 const phase=Math.min(3,step);
 const selection=replaySceneSelection(question);
 const approved=selection.entry?.status==='ready'&&selection.asset?.status==='approved'&&selection.scene?.media?.video;
 if(question?.id==='CARS2.6'&&approved&&selection.scene?.id===PEDESTRIAN_WAVE_SCENE_ID){
  return replayWaveAcrossScene(question,phase);
 }
 if(question?.id==='CARS2.4'&&approved&&selection.scene?.id===ZEBRA_WAITING_SCENE_ID){
  return replayZebraWaitingScene(question,phase);
 }
 if(approved&&selection.scene?.replayTemplate==='standard-video'){
  return replayStandardVideoScene(question,phase,selection.scene);
 }
 return replayStrictUnavailableScene(question,selection);
}

function errorReplayLessonText(question){
 const scenario=errorReplayScenario(question);
 return ['MALTA DRIVING MASTER — ERROR REPLAY','',`${question.id} — ${question.question}`,`IT: ${question.question_it||question.question}`,'',`${replayUi('Pericolo','Hazard')}: ${replayUi(scenario.dangerIt,scenario.dangerEn)}`,`${replayUi('Azione corretta','Correct action')}: ${replayCorrectAnswer(question)}`,`${replayUi('Motivo','Reason')}: ${settings.lang==='en'?(question.explanation||question.explanation_it):(question.explanation_it||question.explanation)}`,'',`Build ${BUILD_VERSION}`].join('\n');
}
function errorReplayPool(){
 const ranked=zeroErrorRanked(true).map(item=>item.question),wrong=Q.filter(question=>(progress.wrong?.[question.id]||0)>0),unique=[];
 [...wrong,...ranked].forEach(question=>{if(question&&!unique.some(item=>item.id===question.id))unique.push(question)});
 return unique.slice(0,30);
}
function errorReplayViewHtml(){
 const questionId=route.data?.questionId||errorReplay.lastQuestionId||'',question=errorReplayQuestion(questionId),pool=errorReplayPool();
 const scenario=question?errorReplayScenario(question):null;
 return [
  `<div class="section-title replay-section-title"><div><span class="replay-title-symbol" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M16 12h18a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6h2Z"/><path d="m20 20 11 7-11 7Z"/></svg></span><div><h2>${esc(t('errorReplay'))}</h2><p>${esc(replayUi('Scene cinematiche e spiegazioni immediate','Cinematic scenes with immediate explanations'))}</p></div></div><span class="badge official">Build ${esc(BUILD_VERSION)}</span></div>`,
  `<div class="replay-professional-note"><strong>${esc(replayUi('SIMULATORE VISIVO','VISUAL SIMULATOR'))}</strong><p>${esc(replayUi('Ogni scena evidenzia posizione dei veicoli, visuale, traiettoria e margine di sicurezza. La regola ufficiale resta il testo inglese della domanda.','Each scene highlights vehicle position, view, path and safety margin. The official rule remains the English question text.'))}</p></div><div class="replay-core-status"><span>REPLAY CORE ENGINE 1.0</span><strong>${esc(replayUi('Motore separato attivo','Separate engine active'))}</strong><small>${esc(replayUi('Scene, timeline e video ora sono gestiti fuori dal codice principale.','Scenes, timeline and video are now managed outside the main app code.'))}</small></div>${replayPackStatusHtml()}${replayLibraryCardHtml(question)}${replayAssetStatusHtml(question)}${replayDifficultyHtml(question)}${replayCoachCardHtml()}`,
  `<div class="replay-metrics"><article><strong>${errorReplayViewedCount()}</strong><span>${esc(t('errorReplayViewed'))}</span></article><article><strong>${errorReplayCompletedCount()}</strong><span>${esc(t('errorReplayCompleted'))}</span></article><article><strong>${pool.length}</strong><span>${esc(t('errorReplayLibrary'))}</span></article></div>`,
  `<div class="card replay-search-card"><input id="errorReplaySearch" placeholder="${esc(t('errorReplaySearch'))}" value="${esc(question?.id||'')}"><button class="btn" id="errorReplaySearchBtn">${esc(t('errorReplayOpenScene'))}</button></div>`,
  question?`<section class="replay-main-card">
   <div class="replay-question-head"><span>${esc(question.id)} · ${esc(replayUi(scenario.labelIt,scenario.labelEn))}</span><h2>${esc(question.question)}</h2><p>${esc(question.question_it||question.question)}</p></div>
   ${errorReplayVisualHtml(question,errorReplayStep)}
   <div class="replay-stage-nav four"><button class="${errorReplayStep===0?'active':''}" data-replay-stage="0"><span>01</span><strong>${esc(replayUi('Situazione','Situation'))}</strong><small>${esc(replayUi('Guarda la strada','Read the road'))}</small></button><button class="${errorReplayStep===1?'active':''}" data-replay-stage="1"><span>02</span><strong>${esc(replayUi('Pericolo','Hazard'))}</strong><small>${esc(replayUi('Scopri cosa non vedi','Reveal what is hidden'))}</small></button><button class="${errorReplayStep===2?'active':''}" data-replay-stage="2"><span>03</span><strong>${esc(replayUi('Spiegazione','Explanation'))}</strong><small>${esc(replayUi('Capisci la regola','Understand the rule'))}</small></button><button class="${errorReplayStep===3?'active':''}" data-replay-stage="3"><span>04</span><strong>${esc(replayUi('Azione','Action'))}</strong><small>${esc(replayUi('Guardala in movimento','Watch it in motion'))}</small></button></div>
   <div class="replay-decision-panel"><article class="avoid"><span>${esc(replayUi('DA EVITARE','AVOID'))}</span><h3>${esc(replayUi(scenario.dangerIt,scenario.dangerEn))}</h3></article><article class="correct"><span>${esc(replayUi('AZIONE CORRETTA','CORRECT ACTION'))}</span><h3>${esc(replayCorrectAnswer(question))}</h3><p>${esc(settings.lang==='en'?(question.explanation||question.explanation_it):(question.explanation_it||question.explanation))}</p></article></div>
   <div class="replay-controls"><select id="errorReplaySpeed"><option value="slow" ${errorReplay.speed==='slow'?'selected':''}>${esc(t('errorReplaySlow'))}</option><option value="normal" ${errorReplay.speed==='normal'?'selected':''}>${esc(t('errorReplayNormal'))}</option><option value="fast" ${errorReplay.speed==='fast'?'selected':''}>${esc(t('errorReplayFast'))}</option></select><button class="btn" id="errorReplayPlay">${esc(errorReplayStep>=2?replayUi('Rivedi dall’inizio','Replay from start'):replayUi('Avvia analisi','Start analysis'))}</button><button class="btn secondary" id="errorReplayNext">${esc(replayUi('Passaggio successivo','Next stage'))}</button></div>
   <div class="replay-actions"><button class="btn" data-replay-practise="${esc(question.id)}">${esc(t('errorReplayPractise'))}</button><button class="btn secondary" data-replay-ai="${esc(question.id)}">${esc(t('errorReplayUnderstand'))}</button></div>
   <div class="replay-share-actions"><button class="btn" data-replay-share="${esc(question.id)}">${esc(t('errorReplayShare'))}</button><button class="btn secondary" data-replay-copy="${esc(question.id)}">${esc(t('errorReplayCopy'))}</button></div>
  </section>`:`<div class="card replay-empty"><p>${esc(t('errorReplayNoQuestion'))}</p></div>`,
  `<div class="section-title"><div><h2>${esc(t('errorReplayLibrary'))}</h2><p>${esc(replayUi('Seleziona una domanda per aprire la ricostruzione tecnica','Select a question to open its technical reconstruction'))}</p></div><strong>${pool.length}</strong></div>`,
  `<div class="replay-library-grid">${pool.length?pool.map(item=>{const s=errorReplayScenario(item);return `<button data-replay-open="${esc(item.id)}"><span>${esc(item.id)} · ${esc(replayUi(s.labelIt,s.labelEn))}</span><strong>${esc(item.question)}</strong><small>${esc(item.question_it||item.question)}</small></button>`}).join(''):`<p>${esc(t('errorReplayNoQuestion'))}</p>`}</div>`
 ].join('');
}
function errorReplayOpen(id){
 const question=errorReplayQuestion(id);
 if(!question){toast(t('noResults'));return}
 errorReplayStep=0;
 replayCoachFeedback=null;
 errorReplayMarkViewed(id);
 try{
  go('errorreplay',{questionId:id});
 }catch(err){
  console.error('Error Replay navigation fallback',err);
  route={name:'errorreplay',data:{questionId:id}};
  try{history.pushState({name:'errorreplay',data:{questionId:id}},'','#errorreplay')}catch(_){}
  render();
 }
}
function errorReplaySearch(){const value=cleanProfileValue($('#errorReplaySearch')?.value,180).toLowerCase();if(!value)return;const question=Q.find(item=>item.id.toLowerCase()===value)||Q.find(item=>(item.question+' '+(item.question_it||'')).toLowerCase().includes(value));if(!question)return toast(t('noResults'));errorReplayOpen(question.id)}
function renderReplayStable(){
 const anchor=screen.querySelector('[data-real-film]')||screen.querySelector('.replay-main-card');
 const anchorTop=anchor?anchor.getBoundingClientRect().top:null;
 render({preserveScroll:true});
 if(anchorTop===null)return;
 requestAnimationFrame(()=>{
  const nextAnchor=screen.querySelector('[data-real-film]')||screen.querySelector('.replay-main-card');
  if(!nextAnchor)return;
  const delta=nextAnchor.getBoundingClientRect().top-anchorTop;
  if(Math.abs(delta)>.5)window.scrollBy(0,delta);
 });
}

let replayStageHoldToken=0;
function replayHoldCurrentStage(){
 const stage=screen.querySelector('.standard-video-replay .wave-across-stage');
 if(!stage)return null;
 const rect=stage.getBoundingClientRect();
 if(rect.width<2||rect.height<2)return null;
 const holder=document.createElement('div');
 holder.className='replay-stage-transition-hold';
 holder.dataset.replayStageHold=String(++replayStageHoldToken);
 Object.assign(holder.style,{
  position:'fixed',left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,
  zIndex:'2147482000',pointerEvents:'none',overflow:'hidden',borderRadius:getComputedStyle(stage).borderRadius||'28px'
 });
 holder.appendChild(stage);
 document.body.appendChild(holder);
 return holder;
}
function replayReleaseStageWhenReady(holder){
 if(!holder)return;
 let released=false;
 let observer=null;
 let timeout=null;
 const release=()=>{
  if(released)return;released=true;
  observer?.disconnect();
  if(timeout)clearTimeout(timeout);
  holder.classList.add('is-releasing');
  setTimeout(()=>holder.remove(),90);
 };
 const player=screen.querySelector('[data-replay-engine-player]');
 const video=player?.querySelector('[data-replay-engine-video]');
 const poster=player?.querySelector('[data-replay-engine-poster]');
 if(video?.classList.contains('replay-frame-ready')){requestAnimationFrame(release);return;}
 if(video&&typeof MutationObserver!=='undefined'){
  observer=new MutationObserver(()=>{
   if(video.classList.contains('replay-frame-ready'))requestAnimationFrame(release);
  });
  observer.observe(video,{attributes:true,attributeFilter:['class']});
 }
 // If the decoded frame callback is unusually slow, a fully loaded poster is still safe.
 const posterReady=()=>{
  if(poster?.complete&&poster.naturalWidth>0)requestAnimationFrame(()=>requestAnimationFrame(release));
 };
 if(poster){poster.addEventListener('load',posterReady,{once:true});posterReady();}
 timeout=setTimeout(()=>{
  // Do not expose a black stage: only release on timeout when either frame or poster is demonstrably ready.
  if(video?.classList.contains('replay-frame-ready')||(poster?.complete&&poster.naturalWidth>0))release();
 },1800);
}
function replayTransitionWithStageHold(question,target,{clearCoach=true}={}){
 const safeTarget=Math.max(0,Math.min(3,Number(target)||0));
 const holder=replayHoldCurrentStage();
 errorReplayStep=safeTarget;
 if(errorReplayStep>=3)errorReplayMarkCompleted(question?.id||'');
 if(clearCoach)replayCoachFeedback=null;
 renderReplayStable();
 requestAnimationFrame(()=>replayReleaseStageWhenReady(holder));
}

function errorReplayNextStep(questionId){errorReplayStep=Math.min(3,errorReplayStep+1);if(errorReplayStep>=3)errorReplayMarkCompleted(questionId);renderReplayStable()}
function errorReplayPlay(questionId){
 if(errorReplayTimer){clearInterval(errorReplayTimer);errorReplayTimer=null}
 if(errorReplayStep===0){
  toast(replayUi(
   'Prima individua il pericolo nella scena e premi Continua.',
   'Find the hazard in the scene and press Continue first.'
  ));
  return;
 }
 if(errorReplayStep>=3)errorReplayStep=1;
 const speed=$('#errorReplaySpeed')?.value||errorReplay.speed||'normal';errorReplay.speed=speed;errorReplaySave();
 const delay=speed==='slow'?2300:speed==='fast'?900:1500;
 errorReplayTimer=setInterval(()=>{errorReplayStep++;if(errorReplayStep>=3){errorReplayStep=3;clearInterval(errorReplayTimer);errorReplayTimer=null;errorReplayMarkCompleted(questionId)}renderReplayStable()},delay);
}
function bindErrorReplay(){
 const questionId=route.data?.questionId||errorReplay.lastQuestionId||'';
 const question=errorReplayQuestion(questionId);

 if(questionId)errorReplayMarkViewed(questionId);

 const searchButton=$('#errorReplaySearchBtn');
 if(searchButton)searchButton.onclick=errorReplaySearch;

 const search=$('#errorReplaySearch');
 if(search){
  search.onkeydown=event=>{
   if(event.key==='Enter')errorReplaySearch();
  };
 }

 const playButton=$('#errorReplayPlay');
 if(playButton)playButton.onclick=()=>errorReplayPlay(questionId);

 const nextButton=$('#errorReplayNext');
 if(nextButton){
  nextButton.onclick=()=>{
   // Stage 01 must be completed by finding the hazard.
   if(errorReplayStep===0){
    toast(replayUi(
     'Prima individua il pericolo nella scena.',
     'Find the hazard in the scene first.'
    ));
    return;
   }
   if(errorReplayStep===1||errorReplayStep===2){
    toast(replayUi(
     'Premi Continua nella scena.',
     'Press Continue in the scene.'
    ));
    return;
   }
   errorReplayNextStep(questionId);
  };
 }

 const speed=$('#errorReplaySpeed');
 if(speed){
  speed.onchange=()=>{
   errorReplay.speed=speed.value;
   errorReplaySave();
  };
 }

 screen.querySelectorAll('[data-replay-stage]').forEach(button=>{
  button.onclick=()=>{
   if(button.disabled||button.getAttribute('aria-disabled')==='true'){
    toast(replayUi(
     'Prima individua il pericolo.',
     'Find the hazard first.'
    ));
    return;
   }

   const requested=Number(button.dataset.replayStage)||0;

   if(requested>errorReplayStep){
    toast(replayUi(
     'Usa Continua per passare alla fase successiva.',
     'Use Continue to move to the next stage.'
    ));
    return;
   }

   if(errorReplayStep===0&&requested>0){
    toast(replayUi(
     'Prima individua il pericolo nella scena.',
     'Find the hazard in the scene first.'
    ));
    return;
   }

   replayTransitionWithStageHold(question,requested,{clearCoach:false});
  };
 });

 const phaseContinue=screen.querySelector('[data-replay-phase-continue]');
 if(phaseContinue){
  phaseContinue.onclick=event=>{
   event.preventDefault();
   event.stopPropagation();
   const target=Number(phaseContinue.dataset.replayPhaseContinue);
   if(!Number.isFinite(target)||target!==errorReplayStep+1)return;
   replayTransitionWithStageHold(question,target,{clearCoach:true});
  };
 }

 const replayPlayer=$('[data-replay-engine-player]');
 if(replayPlayer){
  const sceneId=replayPlayer.dataset.replayEnginePlayer||REPLAY_ACTION_SCENE_ID;
  let phaseOptions={};
  const optionsTemplate=screen.querySelector('[data-replay-phase-options]');
  if(optionsTemplate){try{phaseOptions=JSON.parse(optionsTemplate.textContent||'{}')}catch(_){phaseOptions={}}}
  ReplayEngine.mount(replayPlayer,sceneId,{
   language:settings.lang==='it'?'it':'en',
   playbackRate:errorReplay.speed==='slow'?.68:errorReplay.speed==='fast'?1:.82,
   ...phaseOptions
  });
 }

 const hazardSurface=$('[data-hazard-surface]');

 if(hazardSurface&&question){
  replayPerceptionStartedAt=performance.now();

  const clearAttempt=()=>{
   hazardSurface.querySelectorAll('.hazard-tap-marker').forEach(node=>node.remove());
   hazardSurface.querySelector('.hazard-inline-feedback')?.remove();
  };

  const renderInlineFeedback=(feedback,hit)=>{
   const panel=document.createElement('div');
   panel.className=`hazard-inline-feedback ${hit?'success':'warning'}`;

   const heading=hit
    ?replayUi('Pericolo individuato','Hazard identified')
    :replayUi('Non è questo il punto','This is not the point');

   const isWaveAcross=question?.id==='CARS2.6';
   const isZebraWaiting=question?.id==='CARS2.4';
   const activeScene=replaySceneSelection(question).scene;
   const instruction=hit
    ?(isWaveAcross?replayUi('Hai individuato il pedone e il punto in cui un gesto potrebbe essere frainteso.','You identified the pedestrian and where a gesture could be misunderstood.'):isZebraWaiting?replayUi('Hai individuato i pedoni in attesa: ora devi rallentare e prepararti a fermarti.','You identified the waiting pedestrians: now slow down and prepare to stop.'):activeScene?.coach?replayUi(activeScene.coach.hitIt||'Pericolo individuato.',activeScene.coach.hitEn||'Hazard identified.'):replayUi('Pericolo individuato.','Hazard identified.'))
    :(isWaveAcross?replayUi('Tocca il pedone e controlla anche il traffico che potrebbe arrivare dalle altre corsie.','Tap the pedestrian and also check traffic that may approach from other lanes.'):isZebraWaiting?replayUi('Tocca i pedoni in attesa vicino all’attraversamento.','Tap the pedestrians waiting near the crossing.'):activeScene?.coach?replayUi(activeScene.coach.missIt||'Osserva meglio la scena.','Look more carefully at the scene.'):replayUi('Osserva meglio la scena.','Look more carefully at the scene.'));

   panel.innerHTML=`
    <strong>${esc(heading)}</strong>
    <span>${esc(instruction)}</span>
    ${feedback?`
     <div class="hazard-inline-coach ${esc(feedback.tone||'info')}">
      <small>${esc(replayUi('COACH DINAMICO','DYNAMIC COACH'))}</small>
      <b>${esc(feedback.title)}</b>
      <p>${esc(feedback.body)}</p>
     </div>`:''}
    ${hit?`<button type="button" class="hazard-continue-button" data-hazard-continue>
     ${esc(replayUi('Continua','Continue'))}<span aria-hidden="true">→</span>
    </button>`:''}
   `;

   hazardSurface.appendChild(panel);

   const continueButton=panel.querySelector('[data-hazard-continue]');
   if(continueButton){
    continueButton.onclick=continueEvent=>{
     continueEvent.preventDefault();
     continueEvent.stopPropagation();
     replayTransitionWithStageHold(question,1,{clearCoach:false});
    };
   }
  };

  hazardSurface.onclick=event=>{
   event.preventDefault();
   event.stopPropagation();

   if(hazardSurface.dataset.resolved==='true')return;

   clearAttempt();
   hazardSurface.classList.remove('hazard-missed','hazard-found');

   const rect=hazardSurface.getBoundingClientRect();
   const x=(event.clientX-rect.left)/rect.width;
   const y=(event.clientY-rect.top)/rect.height;

   // Calibrated to the actual observation image:
   // road horizon / loss of full opposing-lane visibility.
   const isWaveAcross=question?.id==='CARS2.6';
   const isZebraWaiting=question?.id==='CARS2.4';
   const activeScene=replaySceneSelection(question).scene;
   const sceneHotspot=activeScene?.ui?.hotspot||null;
   const targetX=sceneHotspot?Number(sceneHotspot.left||50)/100:(isWaveAcross||isZebraWaiting)?.50:.53;
   const targetY=sceneHotspot?Number(sceneHotspot.top||50)/100:(isWaveAcross||isZebraWaiting)?.58:.47;
   const radiusX=sceneHotspot?Number(sceneHotspot.radiusX||22)/100:(isWaveAcross||isZebraWaiting)?.28:.20;
   const radiusY=sceneHotspot?Number(sceneHotspot.radiusY||20)/100:(isWaveAcross||isZebraWaiting)?.24:.16;

   const dx=(x-targetX)/radiusX;
   const dy=(y-targetY)/radiusY;
   const hit=(dx*dx+dy*dy)<=1;
   const elapsed=Math.max(
    120,
    Math.round(performance.now()-replayPerceptionStartedAt)
   );

   const perception=errorReplay.perception;
   perception.attempts+=1;

   const marker=document.createElement('span');
   marker.className=`hazard-tap-marker ${hit?'hit':'miss'}`;
   marker.style.left=`${Math.max(3,Math.min(97,x*100))}%`;
   marker.style.top=`${Math.max(3,Math.min(97,y*100))}%`;
   hazardSurface.appendChild(marker);

   const scene=replaySceneSelection(question).scene;
   replayCoachFeedback=window.ReplayCoach?.coachMessage(
    question,
    scene,
    {hit,elapsed,x,y},
    settings.lang==='it'?'it':'en'
   )||null;

   if(hit){
    perception.hits+=1;
    perception.totalMs+=elapsed;
    perception.bestMs=perception.bestMs
     ?Math.min(perception.bestMs,elapsed)
     :elapsed;
    perception.lastResult={
     questionId,
     elapsed,
     hit:true,
     at:new Date().toISOString()
    };
    errorReplaySave();

    hazardSurface.classList.add('hazard-found');
    hazardSurface.dataset.resolved='true';
    hazardSurface.setAttribute('aria-disabled','true');
    renderInlineFeedback(replayCoachFeedback,true);

    // The Coach remains visible. Progression is intentionally manual:
    // only the Continue button can open phase 02.
   }else{
    perception.lastResult={
     questionId,
     elapsed,
     hit:false,
     at:new Date().toISOString()
    };
    errorReplaySave();

    hazardSurface.classList.add('hazard-missed');

    const guide=hazardSurface.querySelector('.hazard-target-guide');
    if(guide){
     guide.style.left=`${targetX*100}%`;
     guide.style.top=`${targetY*100}%`;
    }

    // No renderReplayStable() here: message and Coach remain visible.
    renderInlineFeedback(replayCoachFeedback,false);
   }
  };
 }

 screen.querySelectorAll('[data-replay-open]').forEach(button=>{
  button.onclick=()=>errorReplayOpen(button.dataset.replayOpen);
 });

 screen.querySelectorAll('[data-replay-practise]').forEach(button=>{
  button.onclick=()=>{
   const selected=errorReplayQuestion(button.dataset.replayPractise);
   if(selected)startQuiz([selected],'guided');
  };
 });

 screen.querySelectorAll('[data-replay-ai]').forEach(button=>{
  button.onclick=()=>go('aiinstructor',{questionId:button.dataset.replayAi});
 });

 screen.querySelectorAll('[data-replay-share]').forEach(button=>{
  button.onclick=()=>{
   const selected=errorReplayQuestion(button.dataset.replayShare);
   if(selected){
    shareTextReport(
     t('errorReplay'),
     errorReplayLessonText(selected),
     t('errorReplayCopied')
    );
   }
  };
 });

 screen.querySelectorAll('[data-replay-copy]').forEach(button=>{
  button.onclick=()=>{
   const selected=errorReplayQuestion(button.dataset.replayCopy);
   if(selected){
    copyTextSafe(errorReplayLessonText(selected),t('errorReplayCopied'));
   }
  };
 });
}
function cloudReadySave(){save(CLOUD_READY_KEY,cloudReady)}
function missionSystemSave(){save(MISSION_SYSTEM_KEY,missionSystem)}
function cloudShortId(prefix){
 return `${prefix}-${Math.random().toString(36).slice(2,6).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}
function cloudEnsureIdentity(){
 if(!cloudReady.userId)cloudReady.userId=cloudShortId('MDM');
 if(!cloudReady.deviceId)cloudReady.deviceId=cloudShortId('DEV');
 if(!cloudReady.deviceName)cloudReady.deviceName='Primary Device';
 if(!cloudReady.devices.some(device=>device.id===cloudReady.deviceId)){
  cloudReady.devices.unshift({
   id:cloudReady.deviceId,
   type:'iphone',
   label:cloudReady.deviceName,
   primary:true,
   createdAt:new Date().toISOString()
  });
 }
 cloudReadySave();
}
function cloudAddQueueEvent(type,payload={}){
 cloudEnsureIdentity();
 cloudReady.queue.unshift({
  id:cloudShortId('EVT'),
  type,
  payload,
  userId:cloudReady.userId,
  deviceId:cloudReady.deviceId,
  createdAt:new Date().toISOString(),
  status:'pending'
 });
 cloudReadySave();
}
function cloudQueueText(){
 return JSON.stringify({
  app:'Malta Driving Master',
  build:BUILD_VERSION,
  userId:cloudReady.userId,
  deviceId:cloudReady.deviceId,
  queue:cloudReady.queue
 },null,2);
}
function cloudAddTestEvent(){
 const types=['quiz','profile','mission'];
 const type=types[cloudReady.queue.length%types.length];
 cloudAddQueueEvent(type,{demo:true,createdAt:new Date().toISOString()});
 toast(t('cloudEventCreated'));
 render();
}
function cloudClearQueue(){
 cloudReady.queue=[];
 cloudReadySave();
 toast(t('cloudQueueCleared'));
 render();
}
function cloudAddDevice(){
 const type=$('#cloudDeviceType')?.value||'iphone';
 const label=cleanProfileValue($('#cloudDeviceLabel')?.value,80);
 if(!label)return toast(t('schoolPortalRequired'));
 cloudReady.devices.push({
  id:cloudShortId('DEV'),
  type,label,primary:false,createdAt:new Date().toISOString()
 });
 cloudReadySave();render();
}
function cloudRemoveDevice(id){
 if(id===cloudReady.deviceId)return;
 cloudReady.devices=cloudReady.devices.filter(device=>device.id!==id);
 cloudReadySave();render();
}
function cloudDeviceIcon(type){
 return type==='ipad'?'📱':type==='android'?'🤖':type==='desktop'?'💻':'📲';
}
function cloudReadyViewHtml(){
 cloudEnsureIdentity();
 const lastSync=cloudReady.lastSync?dashboardDate(cloudReady.lastSync):t('cloudNever');
 return [
  `<div class="section-title"><div><h2>☁️ ${esc(t('cloudReady'))}</h2><p>${esc(t('cloudReadySub'))}</p></div><span class="badge official">Build ${esc(BUILD_VERSION)}</span></div>`,
  `<div class="cloud-ready-notice"><span>🔒</span><div><strong>${esc(t('cloudNotice'))}</strong><p>${esc(t('cloudNoticeText'))}</p></div></div>`,
  `<section class="cloud-status-grid"><article><span>${esc(t('cloudIdentityStatus'))}</span><strong>${esc(t('cloudReadyStatus'))}</strong></article><article><span>${esc(t('cloudQueueStatus'))}</span><strong>${cloudReady.queue.length}</strong></article><article><span>${esc(t('cloudDevicesStatus'))}</span><strong>${cloudReady.devices.length}</strong></article><article><span>${esc(t('cloudLoginStatus'))}</span><strong>${esc(t('cloudFutureStatus'))}</strong></article></section>`,
  `<div class="card cloud-identity-card"><h3>${esc(t('cloudUserIdentity'))}</h3><div class="cloud-id-grid"><label><span>${esc(t('cloudUserId'))}</span><code>${esc(cloudReady.userId)}</code></label><label><span>${esc(t('cloudDeviceId'))}</span><code>${esc(cloudReady.deviceId)}</code></label><label><span>${esc(t('cloudDeviceName'))}</span><code>${esc(cloudReady.deviceName)}</code></label></div><button class="btn secondary" id="generateCloudIdentity">${esc(t('cloudGenerateIdentity'))}</button></div>`,
  `<div class="card cloud-queue-card"><div class="cloud-card-heading"><div><h3>${esc(t('cloudQueue'))}</h3><p>${esc(t('cloudQueueSub'))}</p></div><strong>${cloudReady.queue.length}</strong></div><div class="cloud-queue-summary"><span>${esc(t('cloudPending'))}: ${cloudReady.queue.length}</span><span>${esc(t('cloudLastSync'))}: ${esc(lastSync)}</span><span>${esc(t('cloudLocalBackup'))}: ${cloudReady.lastLocalBackup?esc(dashboardDate(cloudReady.lastLocalBackup)):'OK'}</span><span>${esc(t('cloudCloudBackup'))}: ${esc(t('cloudWaiting'))}</span></div><div class="cloud-queue-list">${cloudReady.queue.length?cloudReady.queue.slice(0,8).map(item=>`<article><span>${esc(item.type)}</span><code>${esc(item.id)}</code><small>${esc(dashboardDate(item.createdAt))}</small></article>`).join(''):`<p>${esc(t('cloudNoDevices'))}</p>`}</div><div class="cloud-actions"><button class="btn" id="addCloudTestEvent">${esc(t('cloudAddTestEvent'))}</button><button class="btn secondary" id="copyCloudQueue">${esc(t('cloudExportQueue'))}</button><button class="btn secondary" id="clearCloudQueue">${esc(t('cloudClearQueue'))}</button></div></div>`,
  `<div class="card cloud-device-card"><div class="cloud-card-heading"><div><h3>${esc(t('cloudDeviceManager'))}</h3><p>${esc(t('cloudDeviceManagerSub'))}</p></div><span>📱</span></div><div class="cloud-device-form"><select id="cloudDeviceType"><option value="iphone">iPhone</option><option value="ipad">iPad</option><option value="android">Android</option><option value="desktop">Desktop</option></select><input id="cloudDeviceLabel" placeholder="${esc(t('cloudDeviceLabel'))}"><button class="btn" id="addCloudDevice">${esc(t('cloudAddDevice'))}</button></div><div class="cloud-device-list">${cloudReady.devices.length?cloudReady.devices.map(device=>`<article><span>${cloudDeviceIcon(device.type)}</span><div><strong>${esc(device.label)}</strong><small>${esc(device.id)}${device.primary?' • Primary':''}</small></div>${device.primary?'':`<button data-cloud-remove="${esc(device.id)}">${esc(t('cloudRemoveDevice'))}</button>`}</article>`).join(''):`<p>${esc(t('cloudNoDevices'))}</p>`}</div></div>`,
  `<div class="card cloud-login-card"><span>🔐</span><div><h3>${esc(t('cloudPreparedLogin'))}</h3><p>${esc(t('cloudPreparedLoginText'))}</p></div><strong>${esc(t('cloudFutureStatus'))}</strong></div>`
 ].join('');
}
function bindCloudReady(){
 $('#generateCloudIdentity').onclick=()=>{cloudReady.userId='';cloudReady.deviceId='';cloudReady.devices=[];cloudEnsureIdentity();render()};
 $('#addCloudTestEvent').onclick=cloudAddTestEvent;
 $('#copyCloudQueue').onclick=()=>copyTextSafe(cloudQueueText(),t('cloudQueueCopied'));
 $('#clearCloudQueue').onclick=cloudClearQueue;
 $('#addCloudDevice').onclick=cloudAddDevice;
 screen.querySelectorAll('[data-cloud-remove]').forEach(button=>button.onclick=()=>cloudRemoveDevice(button.dataset.cloudRemove));
}
function missionDefinitions(){
 return [
  {id:'daily',icon:'🎯',title:'missionToday',text:'missionDailyText',badge:'missionBadgeFocus',route:'dailysetup'},
  {id:'safety',icon:'🛡️',title:'missionSafety',text:'missionSafetyText',badge:'missionBadgeSafety',route:'studysetup'},
  {id:'english',icon:'🔤',title:'missionEnglish',text:'missionEnglishText',badge:'missionBadgeEnglish',route:'bridgesetup'},
  {id:'zero',icon:'🚦',title:'missionZero',text:'missionZeroText',badge:'missionBadgeZero',route:'zeroerror'},
  {id:'exam',icon:'⏱️',title:'missionExam',text:'missionExamText',badge:'missionBadgeExam',route:'examsetup'},
  {id:'passport',icon:'🧭',title:'missionPassport',text:'missionPassportText',badge:'missionBadgePassport',route:'passport'}
 ];
}
function missionById(id){return missionDefinitions().find(item=>item.id===id)||null}
function missionProgressValue(id){
 const progressValue=missionSystem.missionProgress[id];
 return Math.max(0,Math.min(100,Number(progressValue||0)));
}
function missionStart(id){
 missionSystem.activeMissionId=id;
 missionSystem.lastGeneratedDate=dateKey();
 missionSystem.missionProgress[id]=Math.max(0,missionProgressValue(id));
 missionSystemSave();
 cloudAddQueueEvent('mission',{action:'start',missionId:id});
 render();
}
function missionAdvance(id,amount=25){
 missionSystem.missionProgress[id]=Math.min(100,missionProgressValue(id)+amount);
 missionSystemSave();
}
function missionComplete(id){
 missionSystem.missionProgress[id]=100;
 if(!missionSystem.completedMissionIds.includes(id))missionSystem.completedMissionIds.push(id);
 if(missionSystem.activeMissionId===id)missionSystem.activeMissionId='';
 missionSystemSave();
 cloudAddQueueEvent('mission',{action:'complete',missionId:id});
 toast(t('missionCompleted'));
 render();
}
function missionReset(){
 if(!confirm(t('missionResetConfirm')))return;
 missionSystem=JSON.parse(JSON.stringify(DEFAULT_MISSION_SYSTEM));
 localStorage.removeItem(MISSION_SYSTEM_KEY);
 toast(t('missionResetDone'));
 render();
}
function missionViewHtml(){
 const defs=missionDefinitions();
 const active=missionById(missionSystem.activeMissionId);
 return [
  `<div class="section-title"><div><h2>🎯 ${esc(t('missions'))}</h2><p>${esc(t('missionsSub'))}</p></div><span class="badge official">Build ${esc(BUILD_VERSION)}</span></div>`,
  `<section class="mission-hero"><div><span>${esc(t('missionCompletedCount'))}</span><strong>${missionSystem.completedMissionIds.length}</strong></div><div><span>${esc(t('missionActive'))}</span><h3>${active?active.icon+' '+esc(t(active.title)):esc(t('missionNoActive'))}</h3><p>${active?esc(t(active.text)):esc(t('missionChoose'))}</p></div></section>`,
  active?`<div class="card mission-active-card"><div class="mission-progress-head"><span>${esc(t('missionProgressLabel'))}</span><strong>${missionProgressValue(active.id)}%</strong></div><div class="mission-progress-bar"><span style="width:${missionProgressValue(active.id)}%"></span></div><div class="mission-active-actions"><button class="btn" data-go="${esc(active.route)}">${esc(t('missionStart'))}</button><button class="btn secondary" data-mission-advance="${esc(active.id)}">+25%</button><button class="btn secondary" data-mission-complete="${esc(active.id)}">${esc(t('missionComplete'))}</button></div></div>`:'',
  `<div class="mission-grid">${defs.map(item=>`<article class="${missionSystem.completedMissionIds.includes(item.id)?'completed':''}"><span>${item.icon}</span><h3>${esc(t(item.title))}</h3><p>${esc(t(item.text))}</p><small>${esc(t(item.badge))}</small><div class="mission-card-progress"><span style="width:${missionProgressValue(item.id)}%"></span></div><button class="btn ${missionSystem.activeMissionId===item.id?'secondary':''}" data-mission-start="${item.id}">${missionSystem.activeMissionId===item.id?esc(t('missionActive')):esc(t('missionStart'))}</button></article>`).join('')}</div>`,
  `<div class="card mission-reward-card"><span>🏅</span><div><h3>${esc(t('missionReward'))}</h3><p>${esc(t('missionRewardText'))}</p></div></div>`,
  `<button class="text-danger-button" id="resetMissions">${esc(t('missionReset'))}</button>`
 ].join('');
}
function bindMissions(){
 screen.querySelectorAll('[data-mission-start]').forEach(button=>button.onclick=()=>missionStart(button.dataset.missionStart));
 screen.querySelectorAll('[data-mission-advance]').forEach(button=>button.onclick=()=>{missionAdvance(button.dataset.missionAdvance);render()});
 screen.querySelectorAll('[data-mission-complete]').forEach(button=>button.onclick=()=>missionComplete(button.dataset.missionComplete));
 $('#resetMissions').onclick=missionReset;
}

function aiInstructorSave(){save(AI_INSTRUCTOR_KEY,aiInstructor)}
function aiQuestionById(id){return Q.find(question=>question.id===id)||null}
function aiExplanationCount(id){return Number(aiInstructor.explained[id]||0)}
function aiRecordExplanation(id){
 aiInstructor.explained[id]=aiExplanationCount(id)+1;
 aiInstructor.lastQuestionId=id;
 aiInstructor.lastVisit=new Date().toISOString();
 aiInstructorSave();
}
function aiTopicContext(question){
 const topic=TOPIC_GROUPS.find(item=>item.id===topicIdFor(question));
 return topic?`${topic.icon} ${t(topic.title)}`:question.category;
}
function aiSimpleExplanation(question){
 const mode=aiEffectiveLanguageMode();
 const en=question.explanation||question.explanation_it||'';
 const it=question.explanation_it||question.explanation||'';
 const correctEn=question.correct.map(index=>question.answers[index]).join(' • ');
 const correctIt=question.correct.map(index=>(question.answers_it&&question.answers_it[index])||question.answers[index]).join(' • ');
 if(mode==='english')return `${en}\n\nCorrect answer: ${correctEn}.`;
 if(mode==='italian')return `${it}\n\nRisposta corretta: ${correctIt}.`;
 return `${en}\n\n🇮🇹 ${it}\n\n✓ EN: ${correctEn}\n✓ IT: ${correctIt}`;
}
function aiTechnicalExplanation(question){
 const mode=aiEffectiveLanguageMode();
 const correctEn=question.correct.map(index=>question.answers[index]).join(' • ');
 const correctIt=question.correct.map(index=>(question.answers_it&&question.answers_it[index])||question.answers[index]).join(' • ');
 const topic=aiTopicContext(question);
 const enMultiple=question.correct.length>1
  ?`The instruction requires ${question.correct.length} correct selections.`
  :'The question requires one best answer.';
 const itMultiple=question.correct.length>1
  ?`L’istruzione richiede ${question.correct.length} risposte corrette.`
  :'La domanda richiede una sola risposta migliore.';
 const en=`${enMultiple} The correct choice is “${correctEn}”. It is the option that most directly satisfies the safety or legal principle tested in ${topic}. ${question.explanation||''}`.trim();
 const it=`${itMultiple} La risposta corretta è “${correctIt}”. È l’opzione che rispetta più direttamente il principio di sicurezza o la regola verificata in ${topic}. ${question.explanation_it||''}`.trim();
 if(mode==='english')return en;
 if(mode==='italian')return it;
 return `${en}\n\n🇮🇹 ${it}`;
}
function aiMaltaExample(question){
 const mode=aiEffectiveLanguageMode();
 const topic=topicIdFor(question);
 const enExamples={
  safety:'Imagine the same situation during a breakdown, collision or emergency on a busy Maltese road: first control the immediate danger and protect people.',
  customer:'Imagine carrying an elderly, disabled or vulnerable passenger in Valletta or Sliema: professional care, patience and safe assistance come before speed.',
  road:'Imagine meeting this situation in Malta traffic near a crossing, junction or parked vehicles: reduce speed, observe carefully and be prepared to stop.',
  eco:'Imagine driving repeatedly through Malta traffic: smooth acceleration, correct gears and anticipation reduce fuel use and unnecessary emissions.'
 };
 const itExamples={
  safety:'Immagina la stessa situazione durante un guasto, un incidente o un’emergenza su una strada trafficata di Malta: prima devi controllare il pericolo immediato e proteggere le persone.',
  customer:'Immagina di trasportare a Valletta o Sliema un passeggero anziano, disabile o vulnerabile: assistenza, pazienza e sicurezza vengono prima della velocità.',
  road:'Immagina di incontrare questa situazione nel traffico di Malta vicino a un attraversamento, un incrocio o veicoli parcheggiati: rallenta, osserva con attenzione e preparati a fermarti.',
  eco:'Immagina di guidare ogni giorno nel traffico di Malta: accelerazioni dolci, marcia corretta e capacità di prevedere il traffico riducono consumi ed emissioni.'
 };
 const en=enExamples[topic]||'Imagine meeting this situation during a real professional journey in Malta: identify the hazard, apply the rule and choose the safest lawful action.';
 const it=itExamples[topic]||'Immagina di trovarti in questa situazione durante un vero servizio professionale a Malta: individua il pericolo, applica la regola e scegli l’azione più sicura e corretta.';
 if(mode==='english')return en;
 if(mode==='italian')return it;
 return `${en}\n\n🇮🇹 ${it}`;
}
function aiMemoryTip(question){
 const mode=aiEffectiveLanguageMode();
 const text=(question.question+' '+question.answers.join(' ')).toLowerCase();
 let en='',it='';
 if(text.includes('always')||text.includes('never')){
  en='Be careful with absolute words such as “always” and “never”: check whether the rule truly has no exception.';
  it='Fai attenzione alle parole assolute come “sempre” e “mai”: verifica che la regola non preveda davvero eccezioni.';
 }else if(question.correct.length>1){
  en=`Before answering, count the required selections: this question needs ${question.correct.length}.`;
  it=`Prima di rispondere, conta quante opzioni devi selezionare: questa domanda ne richiede ${question.correct.length}.`;
 }else if(text.includes('first')||text.includes('priority')){
  en='Remember: identify what must happen first, not what might happen later.';
  it='Ricorda: devi individuare ciò che va fatto per prima cosa, non ciò che potrebbe accadere dopo.';
 }else if(text.includes('pedestrian')||text.includes('passenger')){
  en='Think “protect the vulnerable person first”.';
  it='Pensa: “prima si protegge la persona più vulnerabile”.';
 }else if(text.includes('tunnel')||text.includes('breakdown')){
  en='Think: visibility, warning, safe position, then help.';
  it='Ricorda questa sequenza: renditi visibile, avvisa gli altri, mettiti in sicurezza e poi chiedi aiuto.';
 }else{
  en='Reduce the question to one rule: hazard → duty → safest lawful action.';
  it='Riduci la domanda a una regola semplice: pericolo → obbligo → azione più sicura e corretta.';
 }
 if(mode==='english')return en;
 if(mode==='italian')return it;
 return `${en}\n\n🇮🇹 ${it}`;
}
function aiCommonMistake(question){
 const reasons=progress.errorReasons?.[question.id]||{};
 const ordered=Object.entries(reasons).sort((a,b)=>Number(b[1])-Number(a[1]));
 if(ordered.length&&Number(ordered[0][1])>0)return t(recoveryReasonTranslationKey(ordered[0][0]));
 if(question.correct.length>1)return t('recoveryReasonMultiple');
 if((progress.wrong?.[question.id]||0)>1)return t('zeroErrorRepeated');
 return t('recoveryReasonUnsure');
}
function aiWrongOptions(question){
 return question.answers.map((answer,index)=>{
  if(question.correct.includes(index))return null;
  const translated=(question.answers_it&&question.answers_it[index])||answer;
  return {label:`${String.fromCharCode(65+index)}. ${answer}`,text:`${translated}: ${t('wrongChoiceReason')}`};
 }).filter(Boolean);
}
function aiSimilarQuestion(question){
 const pool=Q.filter(item=>item.id!==question.id&&topicIdFor(item)===topicIdFor(question));
 if(!pool.length)return null;
 const wrongFirst=pool.sort((a,b)=>(progress.wrong?.[b.id]||0)-(progress.wrong?.[a.id]||0));
 return wrongFirst[0]||pool[0];
}
function aiAdaptiveMethod(question){
 const count=aiExplanationCount(question.id);
 const mode=aiEffectiveLanguageMode();
 let en='',it='';
 if(count>=3){
  en=`Times explained: ${count}. Use the Socratic dialogue and answer without translation.`;
  it=`Volte spiegata: ${count}. Usa il dialogo “Fammi capire” e prova a rispondere senza traduzione.`;
 }else if(count===2){
  en=`Times explained: ${count}. Try the real-life example and memory tip before repeating the question.`;
  it=`Volte spiegata: ${count}. Prima di ripetere la domanda, rileggi l’esempio reale e il trucco per ricordarla.`;
 }else{
  en=`Times explained: ${count}. Start with the simple explanation, then verify the technical rule.`;
  it=`Volte spiegata: ${count}. Inizia dalla spiegazione semplice e poi verifica la regola tecnica.`;
 }
 if(mode==='english')return en;
 if(mode==='italian')return it;
 return `${en}\n\n🇮🇹 ${it}`;
}
function aiLessonText(question){
 const similar=aiSimilarQuestion(question);
 return [
  'MALTA DRIVING MASTER — AI INSTRUCTOR LESSON',
  '',
  `${question.id} — ${question.question}`,
  `🇮🇹 ${question.question_it||question.question}`,
  '',
  `${t('aiInstructorSimpleExplanation')}:`,
  aiSimpleExplanation(question),
  '',
  `${t('aiInstructorTechnicalExplanation')}:`,
  aiTechnicalExplanation(question),
  '',
  `${t('aiInstructorMaltaExample')}:`,
  aiMaltaExample(question),
  '',
  `${t('aiInstructorMemoryTip')}:`,
  aiMemoryTip(question),
  '',
  `${t('aiInstructorCommonMistake')}: ${aiCommonMistake(question)}`,
  `${t('aiInstructorSimilar')}: ${similar?similar.id+' — '+similar.question:'—'}`,
  '',
  t('aiInstructorOfflineText'),
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
}
function aiInstructorLessonHtml(question,record=true){
 if(record)aiRecordExplanation(question.id);
 const similar=aiSimilarQuestion(question);
 const wrongOptions=aiWrongOptions(question);
 return `<section class="ai-lesson">
  <div class="ai-lesson-head"><div><span>${esc(question.id)} • ${esc(aiTopicContext(question))}</span><h2>${esc(question.question)}</h2><p>🇮🇹 ${esc(question.question_it||question.question)}</p></div><strong>${aiExplanationCount(question.id)}×</strong></div>
  <div class="ai-lesson-grid">
   <article><span>🟢</span><h3>${esc(t('aiInstructorSimpleExplanation'))}</h3><p>${esc(aiSimpleExplanation(question)).replaceAll('\n','<br>')}</p></article>
   <article><span>⚙️</span><h3>${esc(t('aiInstructorTechnicalExplanation'))}</h3><p>${esc(aiTechnicalExplanation(question))}</p></article>
   <article><span>🇲🇹</span><h3>${esc(t('aiInstructorMaltaExample'))}</h3><p>${esc(aiMaltaExample(question))}</p></article>
   <article><span>🧠</span><h3>${esc(t('aiInstructorMemoryTip'))}</h3><p>${esc(aiMemoryTip(question))}</p></article>
  </div>
  <div class="card ai-common-mistake"><span>${esc(t('aiInstructorCommonMistake'))}</span><strong>${esc(aiCommonMistake(question))}</strong><p>${esc(aiAdaptiveMethod(question))}</p></div>
  <div class="card ai-wrong-options"><h3>${esc(t('aiInstructorWrongOptions'))}</h3>${wrongOptions.map(item=>`<div><strong>${esc(item.label)}</strong><p>${esc(item.text)}</p></div>`).join('')}</div>
  ${similar?`<div class="card ai-similar"><span>${esc(t('aiInstructorSimilar'))}</span><h3>${esc(similar.id)} — ${esc(similar.question)}</h3><button class="btn secondary" data-ai-open="${esc(similar.id)}">${esc(t('aiInstructorOpenLesson'))}</button></div>`:''}
  <div class="ai-lesson-actions"><button class="btn" data-ai-socratic="${esc(question.id)}">🧩 ${esc(t('aiInstructorUnderstand'))}</button><button class="btn secondary" data-ai-practise="${esc(question.id)}">${esc(t('aiInstructorPractise'))}</button><button class="btn secondary" data-ai-explain-again="${esc(question.id)}">${esc(t('aiInstructorExplainAgain'))}</button></div>
  <div class="ai-share-actions"><button class="btn" data-ai-share="${esc(question.id)}">↗ ${esc(t('aiInstructorReport'))}</button><button class="btn secondary" data-ai-copy="${esc(question.id)}">⧉ ${esc(t('aiInstructorCopy'))}</button></div>
 </section>`;
}
function aiSocraticStart(id){
 aiInstructor.socratic={questionId:id,step:0,answers:[]};
 aiInstructor.lastQuestionId=id;
 aiInstructorSave();
 go('aiinstructor',{questionId:id,socratic:true});
}
function aiSocraticPrompt(step){
 return t(step===0?'aiInstructorSocraticQ1':step===1?'aiInstructorSocraticQ2':'aiInstructorSocraticQ3');
}
function aiSocraticFeedback(step){
 return t(step===0?'aiInstructorSocraticFeedback1':step===1?'aiInstructorSocraticFeedback2':'aiInstructorSocraticFeedback3');
}
function aiSocraticHtml(question){
 const step=Math.max(0,Math.min(3,Number(aiInstructor.socratic.step||0)));
 if(step>=3){
  return `<div class="ai-socratic-complete"><span>✓</span><h3>${esc(t('aiInstructorSocraticComplete'))}</h3><p>${esc(question.explanation_it||question.explanation||'')}</p><button class="btn" data-ai-socratic-restart="${esc(question.id)}">${esc(t('aiInstructorSocraticRestart'))}</button></div>`;
 }
 return `<div class="ai-socratic-panel">
  <div class="ai-socratic-progress"><span style="width:${(step+1)/3*100}%"></span></div>
  <small>${step+1}/3</small>
  <h3>${esc(aiSocraticPrompt(step))}</h3>
  ${step>0?`<p class="ai-socratic-feedback">${esc(aiSocraticFeedback(step-1))}</p>`:''}
  <textarea id="aiSocraticAnswer" placeholder="${esc(t('aiInstructorSocraticPrompt'))}">${esc(aiInstructor.socratic.answers[step]||'')}</textarea>
  <button class="btn" id="aiSocraticNext">${esc(t('aiInstructorSocraticNext'))}</button>
  <button class="btn secondary" data-ai-socratic-restart="${esc(question.id)}">${esc(t('aiInstructorSocraticRestart'))}</button>
 </div>`;
}
function aiSocraticNext(){
 const answer=cleanProfileValue($('#aiSocraticAnswer')?.value,1000);
 if(!answer)return toast(t('aiInstructorSocraticEmpty'));
 const step=Number(aiInstructor.socratic.step||0);
 aiInstructor.socratic.answers[step]=answer;
 aiInstructor.socratic.step=Math.min(3,step+1);
 aiInstructorSave();
 render();
}
function aiTutorSummary(){
 const rankings=coachTopicRankings();
 const strong=rankings.slice(0,2);
 const weak=[...rankings].reverse().slice(0,2);
 const next=roadmapNextAction();
 return {strong,weak,next,count:Object.keys(aiInstructor.explained).length};
}
function aiInstructorViewHtml(){
 const queryId=route.data?.questionId||aiInstructor.lastQuestionId||'';
 const question=aiQuestionById(queryId);
 const tutor=aiTutorSummary();
 const socratic=Boolean(route.data?.socratic)&&question;
 return [
  `<div class="section-title"><div><h2>🧠 ${esc(t('aiInstructor'))}</h2><p>${esc(t('aiInstructorSub'))}</p></div><span class="badge official">Build ${esc(BUILD_VERSION)}</span></div>`,
  `<div css="ai-offline-banner"><span>🔒</span><div><strong>${esc(t('aiInstructorOffline'))}</strong><p>${esc(t('aiInstructorOfflineText'))}</p></div></div>`,
  `<div class="card ai-settings-card"><h3>${esc(t('aiInstructorSettings'))}</h3><div class="ai-settings-grid"><label><span>${esc(t('aiInstructorLanguage'))}</span><select id="aiLanguageMode"><option value="english" ${aiInstructor.languageMode==='english'?'selected':''}>${esc(t('aiInstructorEnglish'))}</option><option value="italian" ${aiInstructor.languageMode==='italian'?'selected':''}>${esc(t('aiInstructorItalian'))}</option><option value="bilingual" ${aiInstructor.languageMode==='bilingual'?'selected':''}>${esc(t('aiInstructorBilingual'))}</option></select></label><label><span>${esc(t('aiInstructorLevel'))}</span><select id="aiLevel"><option value="simple" ${aiInstructor.level==='simple'?'selected':''}>${esc(t('aiInstructorSimple'))}</option><option value="normal" ${aiInstructor.level==='normal'?'selected':''}>${esc(t('aiInstructorNormal'))}</option><option value="technical" ${aiInstructor.level==='technical'?'selected':''}>${esc(t('aiInstructorTechnical'))}</option></select></label></div><button class="btn secondary" id="saveAiInstructor">${esc(t('aiInstructorSave'))}</button></div>`,
  `<div class="card ai-tutor-card"><div class="ai-tutor-head"><div><h3>${esc(t('aiInstructorMyTutor'))}</h3><p>${esc(t('aiInstructorTutorSub'))}</p></div><strong>${tutor.count}</strong></div><div class="ai-tutor-grid"><article><span>${esc(t('aiInstructorStrong'))}</span>${tutor.strong.map(item=>`<p>${item.topic.icon} ${esc(t(item.topic.title))} — ${item.score}%</p>`).join('')}</article><article><span>${esc(t('aiInstructorWeak'))}</span>${tutor.weak.map(item=>`<p>${item.topic.icon} ${esc(t(item.topic.title))} — ${item.score}%</p>`).join('')}</article><article><span>${esc(t('aiInstructorNext'))}</span><p>${tutor.next.icon} ${esc(t(tutor.next.title))}</p><small>${esc(t(tutor.next.reason))}</small></article></div></div>`,
  `<div class="card ai-search-card"><input id="aiQuestionSearch" placeholder="${esc(t('aiInstructorQuestionSearch'))}" value="${esc(question?.id||'')}"><button class="btn" id="aiQuestionSearchBtn">${esc(t('aiInstructorOpenLesson'))}</button></div>`,
  question?`${socratic?`<div class="section-title"><div><h2>🧩 ${esc(t('aiInstructorSocratic'))}</h2><p>${esc(t('aiInstructorSocraticSub'))}</p></div></div>${aiSocraticHtml(question)}`:aiInstructorLessonHtml(question,false)}`:`<div class="card ai-empty"><p>${esc(t('aiInstructorNoQuestion'))}</p><button class="btn" data-go="questionlibrary">${esc(t('questionLibrary'))}</button></div>`
 ].join('');
}
function aiFindQuestionFromSearch(){
 const value=cleanProfileValue($('#aiQuestionSearch')?.value,180).toLowerCase();
 if(!value)return;
 const question=Q.find(item=>item.id.toLowerCase()===value)||
  Q.find(item=>(item.question+' '+(item.question_it||'')).toLowerCase().includes(value));
 if(!question)return toast(t('noResults'));
 aiInstructor.lastQuestionId=question.id;
 aiInstructorSave();
 go('aiinstructor',{questionId:question.id});
}
function saveAiInstructorSettings(){
 aiInstructor.languageMode=$('#aiLanguageMode')?.value||'bilingual';
 aiInstructor.level=$('#aiLevel')?.value||'simple';
 aiInstructorSave();
 toast(t('aiInstructorSaved'));
 render();
}
function bindAiInstructor(){
 aiInstructor.lastVisit=new Date().toISOString();
 aiInstructorSave();
 $('#saveAiInstructor').onclick=saveAiInstructorSettings;
 $('#aiQuestionSearchBtn').onclick=aiFindQuestionFromSearch;
 const search=$('#aiQuestionSearch');
 if(search)search.onkeydown=event=>{if(event.key==='Enter')aiFindQuestionFromSearch()};
 const next=$('#aiSocraticNext');
 if(next)next.onclick=aiSocraticNext;
 screen.querySelectorAll('[data-ai-open]').forEach(button=>button.onclick=()=>go('aiinstructor',{questionId:button.dataset.aiOpen}));
 screen.querySelectorAll('[data-ai-socratic]').forEach(button=>button.onclick=()=>aiSocraticStart(button.dataset.aiSocratic));
 screen.querySelectorAll('[data-ai-socratic-restart]').forEach(button=>button.onclick=()=>aiSocraticStart(button.dataset.aiSocraticRestart));
 screen.querySelectorAll('[data-ai-practise]').forEach(button=>button.onclick=()=>{const q=aiQuestionById(button.dataset.aiPractise);if(q)startQuiz([q],'guided')});
 screen.querySelectorAll('[data-ai-explain-again]').forEach(button=>button.onclick=()=>{aiRecordExplanation(button.dataset.aiExplainAgain);render()});
 screen.querySelectorAll('[data-ai-share]').forEach(button=>button.onclick=()=>{const q=aiQuestionById(button.dataset.aiShare);if(q)shareTextReport(t('aiInstructorLesson'),aiLessonText(q),t('aiInstructorCopied'))});
 screen.querySelectorAll('[data-ai-copy]').forEach(button=>button.onclick=()=>{const q=aiQuestionById(button.dataset.aiCopy);if(q)copyTextSafe(aiLessonText(q),t('aiInstructorCopied'))});
}

function instructorPortalSave(){save(INSTRUCTOR_PORTAL_KEY,instructorPortal)}
function instructorPortalId(prefix){return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}
function instructorStudentOptions(selected=''){
 return `<option value="">${esc(t('instructorSelectStudent'))}</option>`+
  schoolDashboard.students.map(student=>`<option value="${esc(student.id)}" ${student.id===selected?'selected':''}>${esc(student.name)}</option>`).join('');
}
function instructorStudentRisk(student){
 const average=dashboardStudentAverage(student);
 if(average<50||student.status==='paused')return 'high';
 if(average<75)return 'medium';
 return 'low';
}
function instructorAttentionLabel(risk){
 return t(risk==='high'?'instructorAttentionHigh':risk==='medium'?'instructorAttentionMedium':'instructorAttentionLow');
}
function instructorPriorityLabel(priority){
 return t(priority==='urgent'?'instructorUrgent':priority==='high'?'instructorHigh':priority==='medium'?'instructorMedium':'instructorLow');
}
function instructorAssignmentTypeLabel(type){
 const map={
  study:'instructorAssignmentStudy',
  review:'instructorAssignmentReview',
  bridge:'instructorAssignmentBridge',
  exam:'instructorAssignmentExam',
  zero:'instructorAssignmentZero',
  passport:'instructorAssignmentPassport'
 };
 return t(map[type]||'instructorAssignmentStudy');
}
function saveInstructorProfile(){
 instructorPortal.profile={
  name:cleanProfileValue($('#instructorName')?.value,100),
  email:cleanProfileValue($('#instructorEmail')?.value,120),
  phone:cleanProfileValue($('#instructorPhone')?.value,80),
  languages:cleanProfileValue($('#instructorLanguages')?.value,150),
  speciality:cleanProfileValue($('#instructorSpeciality')?.value,150),
  bio:cleanProfileValue($('#instructorBio')?.value,800)
 };
 instructorPortalSave();toast(t('instructorProfileSaved'));render();
}
function addInstructorAssignment(){
 const studentId=$('#instructorAssignmentStudent')?.value||'';
 const title=cleanProfileValue($('#instructorAssignmentTitle')?.value,140);
 if(!studentId||!title)return toast(t('schoolPortalRequired'));
 instructorPortal.assignments.unshift({
  id:instructorPortalId('assignment'),
  studentId,title,
  type:$('#instructorAssignmentType')?.value||'study',
  due:$('#instructorAssignmentDue')?.value||'',
  priority:$('#instructorAssignmentPriority')?.value||'medium',
  notes:cleanProfileValue($('#instructorAssignmentNotes')?.value,700),
  done:false,
  demo:false,
  createdAt:new Date().toISOString()
 });
 instructorPortalSave();toast(t('instructorAssignmentSaved'));render();
}
function addInstructorNote(){
 const studentId=$('#instructorNoteStudent')?.value||'';
 const text=cleanProfileValue($('#instructorNoteText')?.value,1000);
 if(!studentId||!text)return toast(t('schoolPortalRequired'));
 instructorPortal.notes.unshift({
  id:instructorPortalId('note'),
  studentId,text,demo:false,createdAt:new Date().toISOString()
 });
 instructorPortalSave();toast(t('instructorNoteSaved'));render();
}
function toggleInstructorAssignment(id){
 const item=instructorPortal.assignments.find(entry=>entry.id===id);
 if(!item)return;
 item.done=!item.done;
 item.updatedAt=new Date().toISOString();
 instructorPortalSave();render();
}
function removeInstructorItem(type,id){
 if(type==='assignments')instructorPortal.assignments=instructorPortal.assignments.filter(item=>item.id!==id);
 if(type==='notes')instructorPortal.notes=instructorPortal.notes.filter(item=>item.id!==id);
 instructorPortalSave();render();
}
function instructorStudentRecommendedAction(student){
 const risk=instructorStudentRisk(student);
 if(Number(student.bridge||0)<60)return t('instructorAssignmentBridge');
 if(Number(student.progress||0)<65)return t('instructorAssignmentStudy');
 if(Number(student.passport||0)<50)return t('instructorAssignmentPassport');
 if(risk==='high')return t('instructorAssignmentReview');
 return t('instructorAssignmentExam');
}
function instructorStudentReportText(studentId){
 const student=dashboardStudentById(studentId);
 if(!student)return '';
 const assignments=instructorPortal.assignments.filter(item=>item.studentId===studentId);
 const notes=instructorPortal.notes.filter(item=>item.studentId===studentId);
 const risk=instructorStudentRisk(student);
 return [
  'MALTA DRIVING MASTER — INSTRUCTOR STUDENT REPORT',
  '',
  `${t('dashboardStudentName')}: ${student.name}`,
  `${t('dashboardStudentEmail')}: ${student.email}`,
  `${t('dashboardStudentCourse')}: ${dashboardCourseLabel(student.course)}`,
  `${t('instructorProgress')}: ${dashboardClamp(student.progress)}%`,
  `${t('instructorBridge')}: ${dashboardClamp(student.bridge)}%`,
  `${t('instructorPassport')}: ${dashboardClamp(student.passport)}%`,
  `${t('instructorAverage')}: ${dashboardStudentAverage(student)}%`,
  `${t('instructorAttention')}: ${instructorAttentionLabel(risk)}`,
  `${t('instructorRecommendedAction')}: ${instructorStudentRecommendedAction(student)}`,
  '',
  `${t('instructorAssignments')}:`,
  ...(assignments.length?assignments.map(item=>`- ${item.done?'✓':'□'} ${item.title} | ${instructorAssignmentTypeLabel(item.type)} | ${instructorPriorityLabel(item.priority)} | ${item.due||'—'}`):['—']),
  '',
  `${t('instructorPrivateNotes')}:`,
  ...(notes.length?notes.map(item=>`- ${item.text}`):['—']),
  '',
  t('instructorLocalText'),
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
}
function shareInstructorStudentReport(copyOnly=false){
 const studentId=$('#instructorReportStudent')?.value||'';
 const text=instructorStudentReportText(studentId);
 if(!text)return toast(t('instructorStudentNotFound'));
 if(copyOnly)return copyTextSafe(text,t('instructorReportCopied'));
 shareTextReport(t('instructorReports'),text,t('instructorReportCopied'));
}
function loadInstructorDemo(){
 const student=schoolDashboard.students[0];
 if(!student)return toast(t('instructorNoStudents'));
 const now=new Date().toISOString();
 instructorPortal.assignments.push({
  id:instructorPortalId('assignment'),studentId:student.id,
  title:'Demo Bridge recovery',type:'bridge',due:'',priority:'high',
  notes:'Fictitious demonstration assignment.',done:false,demo:true,createdAt:now
 });
 instructorPortal.notes.push({
  id:instructorPortalId('note'),studentId:student.id,
  text:'Fictitious private instructor note.',demo:true,createdAt:now
 });
 instructorPortalSave();toast(t('instructorDemoLoaded'));render();
}
function clearInstructorPortal(){
 if(!confirm(t('instructorClearConfirm')))return;
 instructorPortal=JSON.parse(JSON.stringify(DEFAULT_INSTRUCTOR_PORTAL));
 localStorage.removeItem(INSTRUCTOR_PORTAL_KEY);
 toast(t('instructorCleared'));render();
}
function instructorPortalMetrics(){
 const active=instructorPortal.assignments.filter(item=>!item.done).length;
 const completed=instructorPortal.assignments.filter(item=>item.done).length;
 const atRisk=schoolDashboard.students.filter(student=>instructorStudentRisk(student)!=='low').length;
 return {active,completed,atRisk,students:schoolDashboard.students.length};
}
function instructorPortalViewHtml(){
 const metrics=instructorPortalMetrics();
 return [
  `<div class="section-title"><div><h2>👨‍🏫 ${esc(t('instructorPortal'))}</h2><p>${esc(t('instructorPortalSub'))}</p></div><span class="badge partner-badge">Build 23</span></div>`,
  `<div class="instructor-local-notice"><span>🔒</span><div><strong>${esc(t('instructorLocal'))}</strong><p>${esc(t('instructorLocalText'))}</p></div></div>`,
  `<div class="instructor-metrics"><article><strong>${metrics.students}</strong><span>${esc(t('instructorStudents'))}</span></article><article><strong>${metrics.active}</strong><span>${esc(t('instructorActiveAssignments'))}</span></article><article><strong>${metrics.completed}</strong><span>${esc(t('instructorCompletedAssignments'))}</span></article><article><strong>${metrics.atRisk}</strong><span>${esc(t('instructorStudentsAtRisk'))}</span></article></div>`,
  `<div class="card instructor-profile-card"><h3>${esc(t('instructorProfile'))}</h3><div class="instructor-form-grid"><input id="instructorName" placeholder="${esc(t('instructorName'))}" value="${esc(instructorPortal.profile.name)}"><input id="instructorEmail" type="email" placeholder="${esc(t('instructorEmail'))}" value="${esc(instructorPortal.profile.email)}"><input id="instructorPhone" placeholder="${esc(t('instructorPhone'))}" value="${esc(instructorPortal.profile.phone)}"><input id="instructorLanguages" placeholder="${esc(t('instructorLanguages'))}" value="${esc(instructorPortal.profile.languages)}"><input id="instructorSpeciality" placeholder="${esc(t('instructorSpeciality'))}" value="${esc(instructorPortal.profile.speciality)}"><input id="instructorBio" placeholder="${esc(t('instructorBio'))}" value="${esc(instructorPortal.profile.bio)}"></div><button class="btn" id="saveInstructorProfile">${esc(t('instructorSaveProfile'))}</button></div>`,
  `<div class="card instructor-students-card"><div class="instructor-heading"><div><h3>${esc(t('instructorStudents'))}</h3><p>${esc(t('instructorStudentsSub'))}</p></div><span>🎓</span></div>${schoolDashboard.students.length?`<div class="instructor-student-grid">${schoolDashboard.students.map(student=>{const risk=instructorStudentRisk(student);return `<article class="risk-${risk}"><div><h4>${esc(student.name)}</h4><p>${esc(student.email)}</p></div><strong>${dashboardStudentAverage(student)}%</strong><div class="instructor-student-bars"><span>${esc(t('instructorProgress'))}: ${dashboardClamp(student.progress)}%</span><span>${esc(t('instructorBridge'))}: ${dashboardClamp(student.bridge)}%</span><span>${esc(t('instructorPassport'))}: ${dashboardClamp(student.passport)}%</span></div><small>${esc(instructorAttentionLabel(risk))}</small><b>${esc(t('instructorRecommendedAction'))}: ${esc(instructorStudentRecommendedAction(student))}</b></article>`}).join('')}</div>`:`<p>${esc(t('instructorNoStudents'))}</p>`}</div>`,
  `<div class="instructor-two-col"><div class="card"><h3>${esc(t('instructorAssign'))}</h3><div class="instructor-form-grid"><select id="instructorAssignmentStudent">${instructorStudentOptions()}</select><input id="instructorAssignmentTitle" placeholder="${esc(t('instructorAssignmentTitle'))}"><select id="instructorAssignmentType"><option value="study">${esc(t('instructorAssignmentStudy'))}</option><option value="review">${esc(t('instructorAssignmentReview'))}</option><option value="bridge">${esc(t('instructorAssignmentBridge'))}</option><option value="exam">${esc(t('instructorAssignmentExam'))}</option><option value="zero">${esc(t('instructorAssignmentZero'))}</option><option value="passport">${esc(t('instructorAssignmentPassport'))}</option></select><input id="instructorAssignmentDue" type="date"><select id="instructorAssignmentPriority"><option value="low">${esc(t('instructorLow'))}</option><option value="medium" selected>${esc(t('instructorMedium'))}</option><option value="high">${esc(t('instructorHigh'))}</option><option value="urgent">${esc(t('instructorUrgent'))}</option></select><input id="instructorAssignmentNotes" placeholder="${esc(t('instructorAssignmentNotes'))}"></div><button class="btn" id="addInstructorAssignment">${esc(t('instructorSaveAssignment'))}</button></div><div class="card"><h3>${esc(t('instructorPrivateNotes'))}</h3><div class="instructor-form-grid"><select id="instructorNoteStudent">${instructorStudentOptions()}</select><input id="instructorNoteText" placeholder="${esc(t('instructorNoteText'))}"></div><button class="btn" id="addInstructorNote">${esc(t('instructorSaveNote'))}</button></div></div>`,
  `<div class="card instructor-list-card"><h3>${esc(t('instructorAssignments'))}</h3><div class="instructor-item-list">${instructorPortal.assignments.length?instructorPortal.assignments.map(item=>{const student=dashboardStudentById(item.studentId);return `<article class="${item.done?'done':''}"><div><span>${item.demo?'Demo • ':''}${esc(student?.name||'—')}</span><h4>${esc(item.title)}</h4><p>${esc(instructorAssignmentTypeLabel(item.type))} • ${esc(instructorPriorityLabel(item.priority))} • ${esc(item.due||'—')}</p><small>${esc(item.notes||'')}</small></div><div><button data-toggle-assignment="${item.id}">${item.done?'✓ '+esc(t('instructorAssignmentDone')):esc(t('instructorAssignmentOpen'))}</button><button data-remove-instructor="assignments:${item.id}">${esc(t('schoolRemove'))}</button></div></article>`}).join(''):`<p>${esc(t('instructorNoAssignments'))}</p>`}</div></div>`,
  `<div class="card instructor-list-card"><h3>${esc(t('instructorPrivateNotes'))}</h3><div class="instructor-item-list">${instructorPortal.notes.length?instructorPortal.notes.map(item=>{const student=dashboardStudentById(item.studentId);return `<article><div><span>${item.demo?'Demo • ':''}${esc(student?.name||'—')}</span><p>${esc(item.text)}</p><small>${esc(dashboardDate(item.createdAt))}</small></div><div><button data-remove-instructor="notes:${item.id}">${esc(t('schoolRemove'))}</button></div></article>`}).join(''):`<p>${esc(t('instructorNoNotes'))}</p>`}</div></div>`,
  `<div class="card instructor-report-card"><h3>${esc(t('instructorReports'))}</h3><p>${esc(t('instructorReportsSub'))}</p><select id="instructorReportStudent">${instructorStudentOptions()}</select><div class="instructor-report-actions"><button class="btn" id="shareInstructorReport">↗ ${esc(t('instructorShareReport'))}</button><button class="btn secondary" id="copyInstructorReport">⧉ ${esc(t('instructorCopyReport'))}</button></div></div>`,
  `<div class="instructor-bottom-actions"><button class="btn secondary" id="loadInstructorDemo">${esc(t('instructorDemo'))}</button><button class="text-danger-button" id="clearInstructorPortal">${esc(t('instructorClear'))}</button></div>`
 ].join('');
}
function bindInstructorPortal(){
 instructorPortal.lastVisit=new Date().toISOString();
 instructorPortalSave();
 $('#saveInstructorProfile').onclick=saveInstructorProfile;
 $('#addInstructorAssignment').onclick=addInstructorAssignment;
 $('#addInstructorNote').onclick=addInstructorNote;
 $('#shareInstructorReport').onclick=()=>shareInstructorStudentReport(false);
 $('#copyInstructorReport').onclick=()=>shareInstructorStudentReport(true);
 $('#loadInstructorDemo').onclick=loadInstructorDemo;
 $('#clearInstructorPortal').onclick=clearInstructorPortal;
 screen.querySelectorAll('[data-toggle-assignment]').forEach(button=>button.onclick=()=>toggleInstructorAssignment(button.dataset.toggleAssignment));
 screen.querySelectorAll('[data-remove-instructor]').forEach(button=>button.onclick=()=>{const [type,id]=button.dataset.removeInstructor.split(':');removeInstructorItem(type,id)});
}

function schoolPortalSave(){
 save(SCHOOL_PORTAL_KEY,schoolPortal);
}
function schoolPortalId(prefix){
 return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
}
function schoolPortalSchoolName(){
 return schoolPartnerDraft.schoolName||t('dashboardNoSchoolName');
}
function saveSchoolPortalPublic(){
 schoolPortal.publicProfile={
  headline:cleanProfileValue($('#schoolPortalHeadline')?.value,180),
  website:cleanProfileValue($('#schoolPortalWebsite')?.value,180),
  whatsapp:cleanProfileValue($('#schoolPortalWhatsapp')?.value,80),
  logoText:cleanProfileValue($('#schoolPortalLogoText')?.value,5).toUpperCase()||'MDM',
  verified:false
 };
 schoolPortalSave();
 toast(t('schoolPublicSaved'));
 render();
}
function addSchoolInstructor(){
 const name=cleanProfileValue($('#schoolInstructorName')?.value,100);
 if(!name)return toast(t('schoolPortalRequired'));
 schoolPortal.instructors.unshift({
  id:schoolPortalId('instructor'),
  name,
  languages:cleanProfileValue($('#schoolInstructorLanguages')?.value,120),
  speciality:cleanProfileValue($('#schoolInstructorSpeciality')?.value,120),
  bio:cleanProfileValue($('#schoolInstructorBio')?.value,600),
  demo:false,
  createdAt:new Date().toISOString()
 });
 schoolPortalSave();toast(t('schoolInstructorSaved'));render();
}
function addSchoolCourse(){
 const title=cleanProfileValue($('#schoolCourseTitle')?.value,120);
 if(!title)return toast(t('schoolPortalRequired'));
 schoolPortal.courses.unshift({
  id:schoolPortalId('course'),
  title,
  category:$('#schoolCourseCategory')?.value||'lptv',
  price:cleanProfileValue($('#schoolCoursePrice')?.value,40),
  duration:cleanProfileValue($('#schoolCourseDuration')?.value,80),
  format:cleanProfileValue($('#schoolCourseFormat')?.value,80),
  description:cleanProfileValue($('#schoolCourseDescription')?.value,800),
  demo:false,
  createdAt:new Date().toISOString()
 });
 schoolPortalSave();toast(t('schoolCourseSaved'));render();
}
function addSchoolOffer(){
 const title=cleanProfileValue($('#schoolOfferTitle')?.value,120);
 if(!title)return toast(t('schoolPortalRequired'));
 schoolPortal.offers.unshift({
  id:schoolPortalId('offer'),
  title,
  discount:cleanProfileValue($('#schoolOfferDiscount')?.value,120),
  expiry:$('#schoolOfferExpiry')?.value||'',
  description:cleanProfileValue($('#schoolOfferDescription')?.value,600),
  demo:false,
  createdAt:new Date().toISOString()
 });
 schoolPortalSave();toast(t('schoolOfferSaved'));render();
}
function addSchoolReview(){
 const name=cleanProfileValue($('#schoolReviewName')?.value,100);
 const text=cleanProfileValue($('#schoolReviewText')?.value,600);
 if(!name||!text)return toast(t('schoolPortalRequired'));
 schoolPortal.reviews.unshift({
  id:schoolPortalId('review'),
  name,
  rating:Math.max(1,Math.min(5,Number($('#schoolReviewRating')?.value)||5)),
  text,
  demo:true,
  createdAt:new Date().toISOString()
 });
 schoolPortalSave();toast(t('schoolReviewSaved'));render();
}
function addSchoolRequest(){
 const name=cleanProfileValue($('#schoolRequestName')?.value,100);
 const email=cleanProfileValue($('#schoolRequestEmail')?.value,120).toLowerCase();
 if(!name||!validProfileEmail(email))return toast(t('schoolPortalRequired'));
 schoolPortal.requests.unshift({
  id:schoolPortalId('request'),
  name,email,
  service:cleanProfileValue($('#schoolRequestService')?.value,120),
  message:cleanProfileValue($('#schoolRequestMessage')?.value,800),
  status:'new',
  demo:false,
  createdAt:new Date().toISOString()
 });
 schoolPortalSave();toast(t('schoolRequestSaved'));render();
}
function addSchoolBooking(){
 const student=cleanProfileValue($('#schoolBookingStudent')?.value,100);
 const date=$('#schoolBookingDate')?.value||'';
 if(!student||!date)return toast(t('schoolPortalRequired'));
 schoolPortal.bookings.unshift({
  id:schoolPortalId('booking'),
  student,
  courseId:$('#schoolBookingCourse')?.value||'',
  date,
  time:$('#schoolBookingTime')?.value||'',
  notes:cleanProfileValue($('#schoolBookingNotes')?.value,600),
  demo:false,
  createdAt:new Date().toISOString()
 });
 schoolPortalSave();toast(t('schoolBookingSaved'));render();
}
function removeSchoolPortalItem(type,id){
 if(!Array.isArray(schoolPortal[type]))return;
 schoolPortal[type]=schoolPortal[type].filter(item=>item.id!==id);
 schoolPortalSave();render();
}
function updateSchoolRequestStatus(id,status){
 const request=schoolPortal.requests.find(item=>item.id===id);
 if(!request)return;
 request.status=['new','contacted','closed'].includes(status)?status:'new';
 schoolPortalSave();render();
}
function schoolPortalCourseTitle(id){
 return schoolPortal.courses.find(item=>item.id===id)?.title||'—';
}
function schoolPortalStatusLabel(status){
 return t(status==='contacted'?'schoolRequestContacted':status==='closed'?'schoolRequestClosed':'schoolRequestNew');
}
function schoolPortalProfileText(){
 return [
  'MALTA DRIVING MASTER — SCHOOL PARTNER 2.0',
  '',
  `${t('schoolName')}: ${schoolPortalSchoolName()}`,
  `${t('schoolHeadline')}: ${schoolPortal.publicProfile.headline||'—'}`,
  `${t('schoolWebsite')}: ${schoolPortal.publicProfile.website||'—'}`,
  `${t('schoolWhatsapp')}: ${schoolPortal.publicProfile.whatsapp||'—'}`,
  `${t('schoolVerifiedStatus')}: ${t('schoolUnverified')}`,
  '',
  `${t('schoolInstructors')}: ${schoolPortal.instructors.length}`,
  ...schoolPortal.instructors.map(item=>`- ${item.name} | ${item.languages||'—'} | ${item.speciality||'—'}`),
  '',
  `${t('schoolCourses')}: ${schoolPortal.courses.length}`,
  ...schoolPortal.courses.map(item=>`- ${item.title} | ${item.price||'—'} | ${item.duration||'—'}`),
  '',
  `${t('schoolOffers')}: ${schoolPortal.offers.length}`,
  ...schoolPortal.offers.map(item=>`- ${item.title} | ${item.discount||'—'}`),
  '',
  t('schoolPortalNoticeText'),
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
}
function loadSchoolPortalDemo(){
 const now=new Date().toISOString();
 schoolPortal.instructors.push({
  id:schoolPortalId('instructor'),name:'Demo Instructor',languages:'English, Italiano',
  speciality:'LPTV and Bridge support',bio:'Fictitious demonstration instructor.',demo:true,createdAt:now
 });
 const courseId=schoolPortalId('course');
 schoolPortal.courses.push({
  id:courseId,title:'Demo LPTV Complete',category:'lptv',price:'€199',
  duration:'3 days + support',format:'Classroom + app',
  description:'Fictitious demonstration course.',demo:true,createdAt:now
 });
 schoolPortal.offers.push({
  id:schoolPortalId('offer'),title:'Demo Early Booking',discount:'10% discount',
  expiry:'',description:'Fictitious demonstration offer.',demo:true,createdAt:now
 });
 schoolPortal.reviews.push({
  id:schoolPortalId('review'),name:'Demo Student',rating:5,
  text:'Fictitious demonstration review.',demo:true,createdAt:now
 });
 schoolPortal.requests.push({
  id:schoolPortalId('request'),name:'Demo Request',email:'demo.request@example.invalid',
  service:'LPTV course',message:'Fictitious student request.',status:'new',demo:true,createdAt:now
 });
 schoolPortal.bookings.push({
  id:schoolPortalId('booking'),student:'Demo Student',courseId,date:dateKey(),
  time:'18:00',notes:'Fictitious booking.',demo:true,createdAt:now
 });
 schoolPortalSave();toast(t('schoolPortalDemoLoaded'));render();
}
function clearSchoolPortal(){
 if(!confirm(t('schoolPortalClearConfirm')))return;
 schoolPortal=JSON.parse(JSON.stringify(DEFAULT_SCHOOL_PORTAL));
 localStorage.removeItem(SCHOOL_PORTAL_KEY);
 toast(t('schoolPortalCleared'));render();
}
function schoolPortalPreviewHtml(){
 const courses=schoolPortal.courses.slice(0,3);
 const offers=schoolPortal.offers.slice(0,2);
 const reviews=schoolPortal.reviews.slice(0,3);
 return `<section class="school-portal-preview">
  <div class="school-portal-preview-head">
   <div class="school-portal-logo">${esc(schoolPortal.publicProfile.logoText||'MDM')}</div>
   <div><span>${esc(t('schoolUnverified'))}</span><h2>${esc(schoolPortalSchoolName())}</h2><p>${esc(schoolPortal.publicProfile.headline||t('schoolPortalPreviewSub'))}</p></div>
  </div>
  <div class="school-portal-preview-contact">
   <span>🌐 ${esc(schoolPortal.publicProfile.website||t('notProvided'))}</span>
   <span>💬 ${esc(schoolPortal.publicProfile.whatsapp||t('notProvided'))}</span>
  </div>
  <div class="school-portal-preview-courses">${courses.length?courses.map(course=>`<article><h3>${esc(course.title)}</h3><p>${esc(course.description||'')}</p><strong>${esc(course.price||'—')}</strong><button>${esc(t('schoolBookNow'))}</button></article>`).join(''):`<p>${esc(t('schoolNoItems'))}</p>`}</div>
  <div class="school-portal-preview-offers">${offers.map(offer=>`<span>🎁 ${esc(offer.title)} — ${esc(offer.discount||'')}</span>`).join('')}</div>
  <div class="school-portal-preview-reviews">${reviews.map(review=>`<blockquote><strong>${'★'.repeat(review.rating)}</strong><p>${esc(review.text)}</p><small>${esc(review.name)} • ${esc(t('schoolReviewDemo'))}</small></blockquote>`).join('')}</div>
 </section>`;
}
function schoolPortalViewHtml(){
 const contentCount=schoolPortal.instructors.length+schoolPortal.courses.length+schoolPortal.offers.length+schoolPortal.reviews.length;
 const commercialCount=schoolPortal.requests.length+schoolPortal.bookings.length;
 return [
  `<div class="section-title"><div><h2>🏫 ${esc(t('schoolPortal2'))}</h2><p>${esc(t('schoolPortal2Sub'))}</p></div><span class="badge partner-badge">Build 23</span></div><button class="instructor-portal-launch" data-go="instructorportal"><span>👨‍🏫</span><div><strong>${esc(t('instructorPortal'))}</strong><small>${esc(t('instructorPortalSub'))}</small></div><b>›</b></button>`,
  `<div class="school-portal-notice"><span>🔒</span><div><strong>${esc(t('schoolPortalNotice'))}</strong><p>${esc(t('schoolPortalNoticeText'))}</p></div></div>`,
  `<div class="school-portal-metrics"><article><strong>${schoolPortal.instructors.length}</strong><span>${esc(t('schoolInstructors'))}</span></article><article><strong>${schoolPortal.courses.length}</strong><span>${esc(t('schoolCourses'))}</span></article><article><strong>${contentCount}</strong><span>${esc(t('schoolPublishedContent'))}</span></article><article><strong>${commercialCount}</strong><span>${esc(t('schoolCommercialTools'))}</span></article></div>`,
  `<div class="card school-portal-public-card"><h3>${esc(t('schoolPublicProfile'))}</h3><div class="school-portal-form-grid"><label><span>${esc(t('schoolHeadline'))}</span><input id="schoolPortalHeadline" value="${esc(schoolPortal.publicProfile.headline)}"></label><label><span>${esc(t('schoolWebsite'))}</span><input id="schoolPortalWebsite" value="${esc(schoolPortal.publicProfile.website)}"></label><label><span>${esc(t('schoolWhatsapp'))}</span><input id="schoolPortalWhatsapp" value="${esc(schoolPortal.publicProfile.whatsapp)}"></label><label><span>${esc(t('schoolLogoText'))}</span><input id="schoolPortalLogoText" maxlength="5" value="${esc(schoolPortal.publicProfile.logoText)}"></label></div><button class="btn" id="saveSchoolPortalPublic">${esc(t('schoolSavePublic'))}</button></div>`,
  `<div class="card"><div class="school-portal-heading"><div><h3>${esc(t('schoolPortalPreview'))}</h3><p>${esc(t('schoolPortalPreviewSub'))}</p></div><span>👁</span></div>${schoolPortalPreviewHtml()}</div>`,
  `<div class="school-portal-two-col"><div class="card"><h3>${esc(t('schoolInstructors'))}</h3><div class="school-portal-form-grid"><input id="schoolInstructorName" placeholder="${esc(t('schoolInstructorName'))}"><input id="schoolInstructorLanguages" placeholder="${esc(t('schoolInstructorLanguages'))}"><input id="schoolInstructorSpeciality" placeholder="${esc(t('schoolInstructorSpeciality'))}"><input id="schoolInstructorBio" placeholder="${esc(t('schoolInstructorBio'))}"></div><button class="btn" id="addSchoolInstructor">${esc(t('schoolAddInstructor'))}</button><div class="school-portal-list">${schoolPortal.instructors.length?schoolPortal.instructors.map(item=>`<article><div><h4>${esc(item.name)}</h4><p>${esc(item.languages||'')} • ${esc(item.speciality||'')}</p><small>${esc(item.bio||'')}</small></div><button data-remove-portal="instructors:${item.id}">${esc(t('schoolRemove'))}</button></article>`).join(''):`<p>${esc(t('schoolNoItems'))}</p>`}</div></div>`,
  `<div class="card"><h3>${esc(t('schoolCourses'))}</h3><div class="school-portal-form-grid"><input id="schoolCourseTitle" placeholder="${esc(t('schoolCourseTitle'))}"><select id="schoolCourseCategory"><option value="lptv">LPTV</option><option value="b">${esc(t('courseB'))}</option></select><input id="schoolCoursePrice" placeholder="${esc(t('schoolCoursePrice'))}"><input id="schoolCourseDuration" placeholder="${esc(t('schoolCourseDuration'))}"><input id="schoolCourseFormat" placeholder="${esc(t('schoolCourseFormat'))}"><input id="schoolCourseDescription" placeholder="${esc(t('schoolCourseDescription'))}"></div><button class="btn" id="addSchoolCourse">${esc(t('schoolAddCourse'))}</button><div class="school-portal-list">${schoolPortal.courses.length?schoolPortal.courses.map(item=>`<article><div><h4>${esc(item.title)}</h4><p>${esc(item.price||'')} • ${esc(item.duration||'')} • ${esc(item.format||'')}</p><small>${esc(item.description||'')}</small></div><button data-remove-portal="courses:${item.id}">${esc(t('schoolRemove'))}</button></article>`).join(''):`<p>${esc(t('schoolNoItems'))}</p>`}</div></div></div>`,
  `<div class="school-portal-two-col"><div class="card"><h3>${esc(t('schoolOffers'))}</h3><div class="school-portal-form-grid"><input id="schoolOfferTitle" placeholder="${esc(t('schoolOfferTitle'))}"><input id="schoolOfferDiscount" placeholder="${esc(t('schoolOfferDiscount'))}"><input id="schoolOfferExpiry" type="date"><input id="schoolOfferDescription" placeholder="${esc(t('schoolOfferDescription'))}"></div><button class="btn" id="addSchoolOffer">${esc(t('schoolAddOffer'))}</button><div class="school-portal-list">${schoolPortal.offers.length?schoolPortal.offers.map(item=>`<article><div><h4>${esc(item.title)}</h4><p>${esc(item.discount||'')} ${item.expiry?'• '+esc(passportDateLabel(item.expiry)):''}</p><small>${esc(item.description||'')}</small></div><button data-remove-portal="offers:${item.id}">${esc(t('schoolRemove'))}</button></article>`).join(''):`<p>${esc(t('schoolNoItems'))}</p>`}</div></div>`,
  `<div class="card"><h3>${esc(t('schoolReviews'))}</h3><div class="school-portal-form-grid"><input id="schoolReviewName" placeholder="${esc(t('schoolReviewName'))}"><select id="schoolReviewRating">${[5,4,3,2,1].map(value=>`<option value="${value}">${value}/5</option>`).join('')}</select><input id="schoolReviewText" placeholder="${esc(t('schoolReviewText'))}"></div><button class="btn" id="addSchoolReview">${esc(t('schoolAddReview'))}</button><div class="school-portal-list">${schoolPortal.reviews.length?schoolPortal.reviews.map(item=>`<article><div><h4>${'★'.repeat(item.rating)} ${esc(item.name)}</h4><p>${esc(item.text)}</p><small>${esc(t('schoolReviewDemo'))}</small></div><button data-remove-portal="reviews:${item.id}">${esc(t('schoolRemove'))}</button></article>`).join(''):`<p>${esc(t('schoolNoItems'))}</p>`}</div></div></div>`,
  `<div class="school-portal-two-col"><div class="card"><h3>${esc(t('schoolRequests'))}</h3><div class="school-portal-form-grid"><input id="schoolRequestName" placeholder="${esc(t('schoolRequestName'))}"><input id="schoolRequestEmail" type="email" placeholder="${esc(t('schoolRequestEmail'))}"><input id="schoolRequestService" placeholder="${esc(t('schoolRequestService'))}"><input id="schoolRequestMessage" placeholder="${esc(t('schoolRequestMessage'))}"></div><button class="btn" id="addSchoolRequest">${esc(t('schoolAddRequest'))}</button><div class="school-portal-list">${schoolPortal.requests.length?schoolPortal.requests.map(item=>`<article><div><h4>${esc(item.name)}</h4><p>${esc(item.email)} • ${esc(item.service||'')}</p><small>${esc(item.message||'')}</small><select data-request-status="${item.id}"><option value="new" ${item.status==='new'?'selected':''}>${esc(t('schoolRequestNew'))}</option><option value="contacted" ${item.status==='contacted'?'selected':''}>${esc(t('schoolRequestContacted'))}</option><option value="closed" ${item.status==='closed'?'selected':''}>${esc(t('schoolRequestClosed'))}</option></select></div><button data-remove-portal="requests:${item.id}">${esc(t('schoolRemove'))}</button></article>`).join(''):`<p>${esc(t('schoolNoItems'))}</p>`}</div></div>`,
  `<div class="card"><h3>${esc(t('schoolBookings'))}</h3><div class="school-portal-form-grid"><input id="schoolBookingStudent" placeholder="${esc(t('schoolBookingStudent'))}"><select id="schoolBookingCourse"><option value="">${esc(t('schoolBookingCourse'))}</option>${schoolPortal.courses.map(course=>`<option value="${course.id}">${esc(course.title)}</option>`).join('')}</select><input id="schoolBookingDate" type="date"><input id="schoolBookingTime" type="time"><input id="schoolBookingNotes" placeholder="${esc(t('schoolBookingNotes'))}"></div><button class="btn" id="addSchoolBooking">${esc(t('schoolAddBooking'))}</button><div class="school-portal-list">${schoolPortal.bookings.length?schoolPortal.bookings.map(item=>`<article><div><h4>${esc(item.student)}</h4><p>${esc(schoolPortalCourseTitle(item.courseId))} • ${esc(item.date)} ${esc(item.time||'')}</p><small>${esc(item.notes||'')}</small></div><button data-remove-portal="bookings:${item.id}">${esc(t('schoolRemove'))}</button></article>`).join(''):`<p>${esc(t('schoolNoItems'))}</p>`}</div></div></div>`,
  `<div class="school-portal-actions"><button class="btn" id="shareSchoolPortal">↗ ${esc(t('schoolPortalShare'))}</button><button class="btn secondary" id="copySchoolPortal">⧉ ${esc(t('schoolPortalCopy'))}</button><button class="btn secondary" id="loadSchoolPortalDemo">${esc(t('schoolPortalDemo'))}</button></div>`,
  `<button class="text-danger-button" id="clearSchoolPortal">${esc(t('schoolPortalClear'))}</button>`
 ].join('');
}
function bindSchoolPortal2(){
 $('#saveSchoolPortalPublic').onclick=saveSchoolPortalPublic;
 $('#addSchoolInstructor').onclick=addSchoolInstructor;
 $('#addSchoolCourse').onclick=addSchoolCourse;
 $('#addSchoolOffer').onclick=addSchoolOffer;
 $('#addSchoolReview').onclick=addSchoolReview;
 $('#addSchoolRequest').onclick=addSchoolRequest;
 $('#addSchoolBooking').onclick=addSchoolBooking;
 $('#shareSchoolPortal').onclick=()=>shareTextReport(t('schoolPortal2'),schoolPortalProfileText(),t('schoolPortalCopied'));
 $('#copySchoolPortal').onclick=()=>copyTextSafe(schoolPortalProfileText(),t('schoolPortalCopied'));
 $('#loadSchoolPortalDemo').onclick=loadSchoolPortalDemo;
 $('#clearSchoolPortal').onclick=clearSchoolPortal;
 screen.querySelectorAll('[data-remove-portal]').forEach(button=>{
  button.onclick=()=>{
   const [type,id]=button.dataset.removePortal.split(':');
   removeSchoolPortalItem(type,id);
  };
 });
 screen.querySelectorAll('[data-request-status]').forEach(select=>{
  select.onchange=()=>updateSchoolRequestStatus(select.dataset.requestStatus,select.value);
 });
}

function zeroErrorIsDefeated(id){
 return zeroErrorState.defeatedIds.includes(id);
}
function zeroErrorIsVerified(id){
 return zeroErrorState.verifiedIds.includes(id);
}
function zeroErrorReasonCount(question){
 const reasons=progress.errorReasons?.[question.id]||{};
 return Object.values(reasons).reduce((sum,value)=>sum+Number(value||0),0);
}
function zeroErrorRiskData(question){
 const seen=Number(progress.seen?.[question.id]||0);
 const correct=Number(progress.correct?.[question.id]||0);
 const wrong=Number(progress.wrong?.[question.id]||0);
 const rate=seen?correct/seen:0;
 const reasons=[];
 let score=0;

 if(wrong>=3){score+=Math.min(30,wrong*7);reasons.push('zeroErrorRepeated')}
 else if(wrong>0){score+=wrong*6;reasons.push('zeroErrorRepeated')}

 if(seen>0&&rate<.5){score+=22;reasons.push('zeroErrorLowRate')}
 else if(seen>0&&rate<.75){score+=12;reasons.push('zeroErrorLowRate')}

 if(seen>0&&correct===0){score+=18;reasons.push('zeroErrorNeverCorrect')}

 const review=reviewRecord(question.id);
 if(review&&review.due&&review.due<=dateKey()){score+=10;reasons.push('zeroErrorDue')}

 const weak=roadmapWeakestTopic();
 if(topicIdFor(question)===weak.topic.id){score+=9;reasons.push('zeroErrorWeakTopic')}

 const reasonCount=zeroErrorReasonCount(question);
 if(reasonCount>=2){score+=Math.min(15,reasonCount*3);reasons.push('zeroErrorCause')}

 if(seen===0&&topicIdFor(question)===weak.topic.id){
  score+=5;
  reasons.push('zeroErrorUnseen');
 }

 if(zeroErrorIsVerified(question.id))score=Math.max(0,score-18);
 if(zeroErrorIsDefeated(question.id))score=Math.max(0,score-35);

 return {
  question,seen,correct,wrong,rate,
  score:Math.min(100,Math.round(score)),
  reasons:[...new Set(reasons)]
 };
}
function zeroErrorRanked(includeDefeated=false){
 return Q.map(zeroErrorRiskData)
  .filter(item=>item.score>0&&(includeDefeated||!zeroErrorIsDefeated(item.question.id)))
  .sort((a,b)=>b.score-a.score||b.wrong-a.wrong||a.rate-b.rate);
}
function zeroErrorCriticalList(){
 return zeroErrorRanked(false).slice(0,20);
}
function zeroErrorTodayList(){
 return zeroErrorRanked(false).slice(0,10).map(item=>item.question);
}
function zeroErrorTomorrowList(){
 return zeroErrorRanked(false).slice(10,15).map(item=>item.question);
}
function zeroErrorDefeatedList(){
 return zeroErrorState.defeatedIds
  .map(id=>Q.find(question=>question.id===id))
  .filter(Boolean)
  .map(zeroErrorRiskData)
  .sort((a,b)=>b.score-a.score);
}
function zeroErrorMetrics(){
 const critical=zeroErrorCriticalList();
 const defeated=zeroErrorDefeatedList();
 const analysed=zeroErrorRanked(true);
 const unseen=analysed.filter(item=>item.seen===0).length;
 const averageRisk=critical.length?critical.reduce((sum,item)=>sum+item.score,0)/critical.length:0;
 const defeatedFactor=Math.min(25,defeated.length*2);
 const index=Math.max(0,Math.min(100,Math.round(100-averageRisk+defeatedFactor)));
 const light=index>=78?'green':index>=48?'yellow':'red';
 return {critical,defeated,analysed,unseen,index,light,averageRisk:Math.round(averageRisk)};
}
function zeroErrorLightLabel(light){
 return light==='green'?'zeroErrorGreen':light==='yellow'?'zeroErrorYellow':'zeroErrorRed';
}
function zeroErrorToggleDefeated(id){
 if(zeroErrorIsDefeated(id)){
  zeroErrorState.defeatedIds=zeroErrorState.defeatedIds.filter(value=>value!==id);
  zeroErrorState.verifiedIds=zeroErrorState.verifiedIds.filter(value=>value!==id);
 }else{
  zeroErrorState.defeatedIds.push(id);
 }
 save(ZERO_ERROR_KEY,zeroErrorState);
 render();
}
function zeroErrorToggleVerified(id){
 if(zeroErrorIsVerified(id)){
  zeroErrorState.verifiedIds=zeroErrorState.verifiedIds.filter(value=>value!==id);
 }else{
  zeroErrorState.verifiedIds.push(id);
 }
 save(ZERO_ERROR_KEY,zeroErrorState);
 render();
}
function zeroErrorStartList(list){
 if(!list.length)return toast(t('zeroErrorNoCritical'));
 startQuiz(list,'guided');
}
function zeroErrorStartOne(id){
 const question=Q.find(item=>item.id===id);
 if(question)startQuiz([question],'guided');
}
function zeroErrorReset(){
 if(!confirm(t('zeroErrorResetConfirm')))return;
 zeroErrorState.defeatedIds=[];
 zeroErrorState.verifiedIds=[];
 save(ZERO_ERROR_KEY,zeroErrorState);
 toast(t('zeroErrorResetDone'));
 render();
}
function zeroErrorReportText(){
 const metrics=zeroErrorMetrics();
 return [
  'MALTA DRIVING MASTER — ZERO ERROR MODE',
  '',
  `${t('zeroErrorIndex')}: ${metrics.index}%`,
  `${t('zeroErrorTraffic')}: ${t(zeroErrorLightLabel(metrics.light))}`,
  `${t('zeroErrorCritical')}: ${metrics.critical.length}`,
  `${t('zeroErrorDefeated')}: ${metrics.defeated.length}`,
  `${t('zeroErrorUnseen')}: ${metrics.unseen}`,
  '',
  `${t('zeroErrorTop20')}:`,
  ...metrics.critical.map((item,index)=>`${index+1}. ${item.question.id} — ${item.score}/100 — ${item.question.question}`),
  '',
  `${t('zeroErrorDefeatedTitle')}:`,
  ...(metrics.defeated.length?metrics.defeated.map(item=>`✓ ${item.question.id} — ${item.question.question}`):['—']),
  '',
  t('zeroErrorInternalText'),
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
}
function zeroErrorCardHtml(item,index){
 const q=item.question;
 const defeated=zeroErrorIsDefeated(q.id);
 const verified=zeroErrorIsVerified(q.id);
 return `<article class="zero-error-question ${defeated?'defeated':''}">
  <div class="zero-error-rank">${index+1}</div>
  <div class="zero-error-question-body">
   <div class="zero-error-question-meta"><span>${esc(q.id)} • ${esc(q.category)}</span><strong>${item.score}/100</strong></div>
   <h3>${esc(q.question)}</h3>
   <p>🇮🇹 ${esc(q.question_it||q.question)}</p>
   <div class="zero-error-reasons">${item.reasons.map(reason=>`<span>${esc(t(reason))}</span>`).join('')}</div>
   <div class="zero-error-question-stats">
    <span>${esc(t('attempts'))}: ${item.seen}</span>
    <span>${esc(t('wrong'))}: ${item.wrong}</span>
    <span>${esc(t('accuracy'))}: ${item.seen?Math.round(item.rate*100):0}%</span>
   </div>
   <div class="zero-error-question-actions">
    <button class="btn" data-zero-study="${esc(q.id)}">${esc(t('zeroErrorStudy'))}</button>
    <button class="btn secondary ${verified?'active':''}" data-zero-verify="${esc(q.id)}">${verified?'✓ '+esc(t('zeroErrorVerified')):esc(t('zeroErrorVerify'))}</button>
    <button class="btn secondary ${defeated?'danger':''}" data-zero-defeat="${esc(q.id)}">${defeated?esc(t('zeroErrorUndoDefeated')):esc(t('zeroErrorMarkDefeated'))}</button>
   </div>
  </div>
 </article>`;
}
function zeroErrorViewHtml(){
 const metrics=zeroErrorMetrics();
 const today=zeroErrorTodayList();
 const tomorrow=zeroErrorTomorrowList();
 const lightIcon=metrics.light==='green'?'🟢':metrics.light==='yellow'?'🟡':'🔴';
 return [
  `<div class="section-title"><div><h2>🚦 ${esc(t('zeroErrorMode'))}</h2><p>${esc(t('zeroErrorSub'))}</p></div><span class="badge official">Build 21</span></div>`,
  `<div class="zero-error-notice"><span>🔒</span><div><strong>${esc(t('zeroErrorInternal'))}</strong><p>${esc(t('zeroErrorInternalText'))}</p></div></div>`,
  `<section class="zero-error-hero ${metrics.light}"><div class="zero-error-index" style="--zero-index:${metrics.index}"><div><strong>${metrics.index}%</strong><span>${esc(t('zeroErrorIndex'))}</span></div></div><div><span>${esc(t('zeroErrorTraffic'))}</span><h3>${lightIcon} ${esc(t(zeroErrorLightLabel(metrics.light)))}</h3><p>${esc(t('zeroErrorScoreMeaning'))}</p><small>${metrics.analysed.length} ${esc(t('zeroErrorQuestionCount'))}</small></div></section>`,
  `<div class="zero-error-metrics"><article><span>⚠️</span><strong>${metrics.critical.length}</strong><small>${esc(t('zeroErrorCritical'))}</small></article><article><span>🏆</span><strong>${metrics.defeated.length}</strong><small>${esc(t('zeroErrorDefeated'))}</small></article><article><span>👁</span><strong>${metrics.unseen}</strong><small>${esc(t('zeroErrorUnseen'))}</small></article><article><span>📉</span><strong>${metrics.averageRisk}</strong><small>${esc(t('zeroErrorRisk'))}</small></article></div>`,
  `<div class="section-title"><div><h2>${esc(t('zeroErrorPlan'))}</h2><p>${esc(t('zeroErrorPlanSub'))}</p></div></div>`,
  `<div class="zero-error-plan-grid"><article><span>1</span><h3>${esc(t('zeroErrorToday'))}</h3><p>${esc(t('zeroErrorTodayText'))}</p><button class="btn" id="startZeroToday">${esc(t('zeroErrorStartToday'))}</button></article><article><span>2</span><h3>${esc(t('zeroErrorTomorrow'))}</h3><p>${esc(t('zeroErrorTomorrowText'))}</p><button class="btn secondary" id="startZeroTomorrow">${esc(t('zeroErrorStartTomorrow'))}</button></article><article><span>3</span><h3>${esc(t('zeroErrorVerify'))}</h3><p>${esc(t('zeroErrorVerifyText'))}</p><button class="btn secondary" data-go="examsetup">${esc(t('examSimulation'))}</button></article></div>`,
  `<div class="section-title"><div><h2>${esc(t('zeroErrorTop20'))}</h2><p>${esc(t('zeroErrorTop20Sub'))}</p></div><strong>${metrics.critical.length}</strong></div>`,
  metrics.critical.length?`<div class="zero-error-list">${metrics.critical.map((item,index)=>zeroErrorCardHtml(item,index)).join('')}</div>`:`<div class="card zero-error-empty"><p>${esc(t('zeroErrorNoCritical'))}</p><button class="btn" data-go="studysetup">${esc(t('guidedStudy'))}</button></div>`,
  `<div class="section-title"><div><h2>${esc(t('zeroErrorDefeatedTitle'))}</h2><p>${esc(t('zeroErrorDefeatedSub'))}</p></div><strong>${metrics.defeated.length}</strong></div>`,
  metrics.defeated.length?`<div class="zero-error-defeated-list">${metrics.defeated.map((item,index)=>zeroErrorCardHtml(item,index)).join('')}</div>`:`<div class="card zero-error-empty"><p>${esc(t('zeroErrorNoDefeated'))}</p></div>`,
  `<div class="zero-error-report-actions"><button class="btn" id="shareZeroError">↗ ${esc(t('zeroErrorReport'))}</button><button class="btn secondary" id="copyZeroError">⧉ ${esc(t('zeroErrorCopy'))}</button></div>`,
  `<button class="text-danger-button" id="resetZeroError">${esc(t('zeroErrorReset'))}</button>`
 ].join('');
}
function bindZeroError(){
 zeroErrorState.lastPlanDate=dateKey();
 zeroErrorState.lastVisit=new Date().toISOString();
 save(ZERO_ERROR_KEY,zeroErrorState);
 $('#startZeroToday').onclick=()=>zeroErrorStartList(zeroErrorTodayList());
 $('#startZeroTomorrow').onclick=()=>zeroErrorStartList(zeroErrorTomorrowList());
 $('#shareZeroError').onclick=()=>shareTextReport(t('zeroErrorMode'),zeroErrorReportText(),t('zeroErrorCopied'));
 $('#copyZeroError').onclick=()=>copyTextSafe(zeroErrorReportText(),t('zeroErrorCopied'));
 $('#resetZeroError').onclick=zeroErrorReset;
 screen.querySelectorAll('[data-zero-study]').forEach(button=>button.onclick=()=>zeroErrorStartOne(button.dataset.zeroStudy));
 screen.querySelectorAll('[data-zero-verify]').forEach(button=>button.onclick=()=>zeroErrorToggleVerified(button.dataset.zeroVerify));
 screen.querySelectorAll('[data-zero-defeat]').forEach(button=>button.onclick=()=>zeroErrorToggleDefeated(button.dataset.zeroDefeat));
}

function examDayChecklistItems(){
 return [
  ['id','examItemId'],
  ['booking','examItemBooking'],
  ['time','examItemTime'],
  ['rest','examItemRest'],
  ['travel','examItemTravel'],
  ['language','examItemLanguage'],
  ['multiple','examItemMultiple'],
  ['emergency','examItemEmergency'],
  ['calm','examItemCalm']
 ];
}
function examDayChecklistStats(){
 const items=examDayChecklistItems();
 const done=items.filter(([id])=>Boolean(examDayState.checklist[id])).length;
 return {done,total:items.length,pct:Math.round(done/items.length*100)};
}
function examDayTargetText(){
 if(!examDayState.targetDate)return t('examNoDate');
 const days=passportDaysUntil(examDayState.targetDate);
 if(days<0)return `${Math.abs(days)} ${t('days')} • ${t('examDatePassed')}`;
 if(days===0)return t('examDateToday');
 return `${days} ${t('examDaysRemaining')}`;
}
function examDayLatestScore(){
 if(examDayState.finalSimulationDone)return Number(examDayState.finalSimulationScore||0);
 const exam=(progress.exams||[]).at(-1);
 return exam?Number(exam.score||0):0;
}
function examDayRisk(){
 const metrics=coachMetrics();
 const checklist=examDayChecklistStats();
 if(metrics.bridgeScore<65)return 'examRiskEnglish';
 if(metrics.accuracy<78)return 'examRiskAccuracy';
 if(metrics.coverage<75)return 'examRiskCoverage';
 if(examDayLatestScore()<30)return 'examRiskSimulation';
 if(checklist.pct<100)return 'examRiskChecklist';
 return 'examNoRisk';
}
function examDayReadiness(){
 const metrics=coachMetrics();
 const checklist=examDayChecklistStats();
 const latest=examDayLatestScore();
 const examPct=Math.min(100,Math.round(latest/35*100));
 const calm=examDayState.breathingDone?100:0;
 const score=Math.round(
  metrics.confidence*.45+
  examPct*.30+
  checklist.pct*.15+
  calm*.10
 );
 const state=score>=82&&latest>=30&&checklist.pct===100?'ready':score>=60?'almost':'notready';
 return {score,state,metrics,checklist,latest,examPct,calm};
}
function examDayStateLabel(state){
 return state==='ready'?'finalReady':state==='almost'?'finalAlmost':'finalNotReady';
}
function examDayStateMessage(state){
 return state==='ready'?'examReadyMessage':state==='almost'?'examAlmostMessage':'examNotReadyMessage';
}
function collectExamDayForm(){
 const checklist={...examDayState.checklist};
 screen.querySelectorAll('[data-exam-check]').forEach(input=>{
  checklist[input.dataset.examCheck]=input.checked;
 });
 examDayState.targetDate=$('#examTargetDate')?.value||'';
 examDayState.checklist=checklist;
}
function saveExamDay(){
 collectExamDayForm();
 save(EXAM_DAY_KEY,examDayState);
 toast(t('examSaved'));
 render();
}
function startExamBreathing(){
 const overlay=document.createElement('div');
 overlay.className='exam-breathing-overlay';
 overlay.innerHTML=`<div class="exam-breathing-circle"><strong id="examBreathingWord">${esc(t('examBreathingIn'))}</strong><span id="examBreathingCount">4</span></div>`;
 document.body.appendChild(overlay);
 const phases=[
  [t('examBreathingIn'),4],
  [t('examBreathingHold'),4],
  [t('examBreathingOut'),6]
 ];
 let cycle=0,phase=0,remaining=phases[0][1];
 const word=overlay.querySelector('#examBreathingWord');
 const count=overlay.querySelector('#examBreathingCount');
 const timer=setInterval(()=>{
  remaining--;
  count.textContent=remaining;
  if(remaining<=0){
   phase++;
   if(phase>=phases.length){
    phase=0;
    cycle++;
   }
   if(cycle>=4){
    clearInterval(timer);
    examDayState.breathingDone=true;
    save(EXAM_DAY_KEY,examDayState);
    word.textContent=t('examBreathingDone');
    count.textContent='✓';
    setTimeout(()=>{overlay.remove();render()},1200);
    return;
   }
   word.textContent=phases[phase][0];
   remaining=phases[phase][1];
   count.textContent=remaining;
  }
 },1000);
 overlay.onclick=()=>{
  clearInterval(timer);
  overlay.remove();
 };
}
function startFinalSimulation(){
 examDayState.finalSimulationDone=false;
 save(EXAM_DAY_KEY,examDayState);
 startQuiz(sample(Q,35),'exam');
}
function syncExamDaySimulation(){
 const exam=(progress.exams||[]).at(-1);
 if(!exam)return;
 const examTime=exam.date||exam.completedAt||exam.timestamp||'';
 if(!examDayState.finalSimulationDate||String(examTime)>String(examDayState.finalSimulationDate)){
  examDayState.finalSimulationDone=true;
  examDayState.finalSimulationScore=Number(exam.score||0);
  examDayState.finalSimulationDate=examTime||new Date().toISOString();
  save(EXAM_DAY_KEY,examDayState);
 }
}
function examDayCertificateEligible(){
 const readiness=examDayReadiness();
 return readiness.checklist.pct===100&&readiness.latest>=30;
}
function issueExamDayCertificate(){
 collectExamDayForm();
 if(!examDayCertificateEligible())return toast(t('examCertificateLocked'));
 examDayState.certificateIssued=true;
 examDayState.certificateDate=new Date().toISOString();
 save(EXAM_DAY_KEY,examDayState);
 render();
}
function examDayCertificateText(){
 const readiness=examDayReadiness();
 return [
  'MALTA DRIVING MASTER',
  'INTERNAL READINESS CERTIFICATE',
  '',
  `${t('registeredUser')}: ${[userProfile.firstName,userProfile.lastName].filter(Boolean).join(' ')||t('notProvided')}`,
  `${t('examFinalStatus')}: ${t(examDayStateLabel(readiness.state))}`,
  `${t('finalReadiness')}: ${readiness.score}%`,
  `${t('examConfidence')}: ${readiness.metrics.confidence}%`,
  `${t('examBridge')}: ${readiness.metrics.bridgeScore}%`,
  `${t('examLastFinalScore')}: ${readiness.latest}/35`,
  `${t('examChecklistProgress')}: ${readiness.checklist.done}/${readiness.checklist.total}`,
  `${t('examBreathing')}: ${examDayState.breathingDone?'✓':'—'}`,
  `${t('examTargetDate')}: ${examDayState.targetDate?passportDateLabel(examDayState.targetDate):t('examNoDate')}`,
  `${t('examRiskAlert')}: ${t(examDayRisk())}`,
  '',
  t('examCertificateDisclaimer'),
  '',
  `Issued: ${examDayState.certificateDate?new Date(examDayState.certificateDate).toLocaleString():new Date().toLocaleString()}`,
  `Build ${BUILD_VERSION}`
 ].join('\n');
}
function resetExamDay(){
 if(!confirm(t('examResetConfirm')))return;
 examDayState=JSON.parse(JSON.stringify(DEFAULT_EXAM_DAY_STATE));
 localStorage.removeItem(EXAM_DAY_KEY);
 toast(t('examResetDone'));
 render();
}
function examDayReviewCards(){
 return [
  ['🛡','examReviewSafety','safety'],
  ['🤝','examReviewPassengers','customer'],
  ['🛣','examReviewRoad','road'],
  ['🌱','examReviewEco','eco'],
  ['🔤','examReviewEnglish','bridge']
 ];
}
function examDayViewHtml(){
 syncExamDaySimulation();
 const readiness=examDayReadiness();
 const eligible=examDayCertificateEligible();
 return [
  `<div class="section-title"><div><h2>🎯 ${esc(t('examDayMode'))}</h2><p>${esc(t('examDayModeSub'))}</p></div><span class="badge official">Build 20</span></div>`,
  `<div class="exam-day-warning"><span>ℹ</span><div><strong>${esc(t('examDayInternal'))}</strong><p>${esc(t('examDayInternalText'))}</p></div></div>`,
  `<section class="exam-day-hero ${readiness.state}"><div class="exam-readiness-ring" style="--exam-score:${readiness.score}"><div><strong>${readiness.score}%</strong><span>${esc(t('finalReadiness'))}</span></div></div><div><span>${esc(t('examFinalStatus'))}</span><h3>${esc(t(examDayStateLabel(readiness.state)))}</h3><p>${esc(t(examDayStateMessage(readiness.state)))}</p><small>${esc(t('examRiskAlert'))}: ${esc(t(examDayRisk()))}</small></div></section>`,
  `<div class="exam-day-metrics"><article><span>${esc(t('examConfidence'))}</span><strong>${readiness.metrics.confidence}%</strong></article><article><span>${esc(t('examBridge'))}</span><strong>${readiness.metrics.bridgeScore}%</strong></article><article><span>${esc(t('examRecent'))}</span><strong>${readiness.latest}/35</strong></article><article><span>${esc(t('examChecklist'))}</span><strong>${readiness.checklist.pct}%</strong></article></div>`,
  `<div class="card exam-date-card"><label><span>${esc(t('examTargetDate'))}</span><input id="examTargetDate" type="date" value="${esc(examDayState.targetDate)}"></label><strong>${esc(examDayTargetText())}</strong><button class="btn secondary" id="saveExamDay">${esc(t('examSave'))}</button></div>`,
  `<div class="card exam-checklist-card"><div class="exam-card-heading"><div><h3>${esc(t('examDayChecklist'))}</h3><p>${esc(t('examDayChecklistSub'))}</p></div><strong>${readiness.checklist.done}/${readiness.checklist.total}</strong></div><div class="exam-checklist-list">${examDayChecklistItems().map(([id,label])=>`<label><input type="checkbox" data-exam-check="${id}" ${examDayState.checklist[id]?'checked':''}><span>${esc(t(label))}</span></label>`).join('')}</div><div class="exam-progress"><span style="width:${readiness.checklist.pct}%"></span></div></div>`,
  `<div class="exam-action-grid"><article class="card"><span>🫁</span><h3>${esc(t('examBreathing'))}</h3><p>${esc(t('examBreathingSub'))}</p><button class="btn ${examDayState.breathingDone?'secondary':''}" id="startExamBreathing">${examDayState.breathingDone?'✓ '+esc(t('examBreathingDone')):esc(t('examBreathingStart'))}</button></article><article class="card"><span>⏱️</span><h3>${esc(t('examFinalSimulation'))}</h3><p>${esc(t('examFinalSimulationSub'))}</p><strong>${readiness.latest?`${readiness.latest}/35`:esc(t('examNoFinalScore'))}</strong><button class="btn" id="startFinalSimulation">${esc(t('examStartFinal'))}</button></article></div>`,
  `<div class="section-title"><div><h2>${esc(t('examQuickReview'))}</h2><p>${esc(t('examQuickReviewSub'))}</p></div></div>`,
  `<div class="exam-review-grid">${examDayReviewCards().map(([icon,label,route])=>`<button data-exam-review="${route}"><span>${icon}</span><strong>${esc(t(label))}</strong><small>${esc(t('examOpenTopic'))}</small></button>`).join('')}</div>`,
  `<div class="card exam-certificate-card ${eligible?'ready':'locked'}"><div><span>🏅</span><div><h3>${esc(t('examCertificate'))}</h3><p>${esc(t('examCertificateSub'))}</p></div></div>${eligible?`<strong>${esc(t('examCertificateReady'))}</strong><button class="btn" id="issueExamCertificate">${examDayState.certificateIssued?'✓ '+esc(t('examCertificateReady')):esc(t('examCertificateIssue'))}</button>${examDayState.certificateIssued?`<div class="exam-certificate-actions"><button class="btn secondary" id="shareExamCertificate">↗ ${esc(t('examCertificateShare'))}</button><button class="btn secondary" id="copyExamCertificate">⧉ ${esc(t('examCertificateCopy'))}</button></div>`:''}`:`<p>${esc(t('examCertificateLocked'))}</p>`}<small>${esc(t('examCertificateDisclaimer'))}</small></div>`,
  `<button class="text-danger-button" id="resetExamDay">${esc(t('examReset'))}</button>`
 ].join('');
}
function bindExamDay(){
 screen.querySelectorAll('[data-exam-check]').forEach(input=>{
  input.onchange=()=>{
   examDayState.checklist[input.dataset.examCheck]=input.checked;
   save(EXAM_DAY_KEY,examDayState);
   render();
  };
 });
 $('#saveExamDay').onclick=saveExamDay;
 $('#startExamBreathing').onclick=startExamBreathing;
 $('#startFinalSimulation').onclick=startFinalSimulation;
 $('#resetExamDay').onclick=resetExamDay;
 const issue=$('#issueExamCertificate');
 if(issue)issue.onclick=issueExamDayCertificate;
 const share=$('#shareExamCertificate');
 if(share)share.onclick=()=>shareTextReport(t('examCertificate'),examDayCertificateText(),t('examCertificateCopied'));
 const copy=$('#copyExamCertificate');
 if(copy)copy.onclick=()=>copyTextSafe(examDayCertificateText(),t('examCertificateCopied'));
 screen.querySelectorAll('[data-exam-review]').forEach(button=>{
  button.onclick=()=>{
   const route=button.dataset.examReview;
   if(route==='bridge')go('bridgesetup');
   else go('studysetup',{topic:route});
  };
 });
}

function recoveryReasonTranslationKey(id){
 const map={
  rule:'recoveryReasonRule',
  language:'recoveryReasonLanguage',
  word:'recoveryReasonWord',
  multiple:'recoveryReasonMultiple',
  rush:'recoveryReasonRush',
  unsure:'recoveryReasonUnsure'
 };
 return map[id]||'recoveryDataNeeded';
}
function recoveryAdviceKey(id){
 const map={
  rule:'recoveryRuleAdvice',
  language:'recoveryLanguageAdvice',
  word:'recoveryWordAdvice',
  multiple:'recoveryMultipleAdvice',
  rush:'recoveryRushAdvice',
  unsure:'recoveryUnsureAdvice'
 };
 return map[id]||'recoveryGeneralAdvice';
}
function recoveryDiagnosisData(){
 const totals=errorReasonTotals();
 const entries=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
 const sum=entries.reduce((total,item)=>total+item[1],0);
 const dominant=entries[0]&&entries[0][1]>0?entries[0][0]:'';
 return {totals,entries,sum,dominant};
}
function recoveryPriorityPool(){
 const diagnosis=recoveryDiagnosisData();
 const weak=roadmapWeakestTopic();
 return Q.map(question=>{
  const wrong=Number(progress.wrong?.[question.id]||0);
  const reasonMap=progress.errorReasons?.[question.id]||{};
  const reasonScore=Object.values(reasonMap).reduce((a,b)=>a+Number(b||0),0);
  const weakBonus=topicIdFor(question)===weak.topic.id?3:0;
  const reviewItem=reviewRecord(question.id);
  const due=reviewItem&&reviewItem.due&&reviewItem.due<=dateKey()?2:0;
  return {question,score:wrong*4+reasonScore*3+weakBonus+due};
 }).filter(item=>item.score>0)
   .sort((a,b)=>b.score-a.score)
   .map(item=>item.question)
   .slice(0,12);
}
function recoveryResolved(questionId){
 return recoveryState.completedQuestionIds.includes(questionId);
}
function toggleRecoveryResolved(questionId){
 if(recoveryResolved(questionId)){
  recoveryState.completedQuestionIds=recoveryState.completedQuestionIds.filter(id=>id!==questionId);
 }else{
  recoveryState.completedQuestionIds.push(questionId);
 }
 save(RECOVERY_KEY,recoveryState);
 render();
}
function startRecoveryQuestion(questionId){
 const question=Q.find(item=>item.id===questionId);
 if(!question)return;
 startQuiz([question],'guided');
}
function resetRecoveryResolved(){
 if(!confirm(t('recoveryResetConfirm')))return;
 recoveryState.completedQuestionIds=[];
 save(RECOVERY_KEY,recoveryState);
 toast(t('recoveryResetDone'));
 render();
}
function recoveryDialogueAnswer(prompt){
 const diagnosis=recoveryDiagnosisData();
 const metrics=coachMetrics();
 const next=roadmapNextAction();
 if(prompt==='english'){
  const languageTotal=Number(diagnosis.totals.language||0)+Number(diagnosis.totals.word||0);
  const otherTotal=Math.max(0,diagnosis.sum-languageTotal);
  return languageTotal>otherTotal||metrics.bridgeScore<65?t('coachAnswerEnglishHigh'):t('coachAnswerEnglishLow');
 }
 if(prompt==='ready'){
  if(metrics.confidence>=80)return t('coachAnswerReadyHigh');
  if(metrics.confidence>=50)return t('coachAnswerReadyMedium');
  return t('coachAnswerReadyLow');
 }
 if(prompt==='next')return `${t('coachAnswerNext')}: ${t(next.title)}. ${t(next.reason)}`;
 if(!diagnosis.dominant)return t('recoveryNoReasons');
 return `${t('coachAnswerWhy')}: ${t(recoveryReasonTranslationKey(diagnosis.dominant))}. ${t(recoveryAdviceKey(diagnosis.dominant))}`;
}
function setRecoveryDialogue(prompt){
 recoveryState.lastPrompt=prompt;
 recoveryState.lastVisit=new Date().toISOString();
 save(RECOVERY_KEY,recoveryState);
 const answer=$('#recoveryDialogueAnswer');
 if(answer)answer.textContent=recoveryDialogueAnswer(prompt);
 screen.querySelectorAll('[data-recovery-prompt]').forEach(button=>button.classList.toggle('selected',button.dataset.recoveryPrompt===prompt));
}
function recoveryReportText(){
 const diagnosis=recoveryDiagnosisData();
 const metrics=coachMetrics();
 const pool=recoveryPriorityPool();
 const dominant=diagnosis.dominant?t(recoveryReasonTranslationKey(diagnosis.dominant)):t('recoveryDataNeeded');
 return [
  'MALTA DRIVING MASTER — COACH EXPLAIN & RECOVERY',
  '',
  `${t('confidenceScore')}: ${metrics.confidence}%`,
  `${t('recoveryDominantCause')}: ${dominant}`,
  `${t('recoveryRecordedErrors')}: ${diagnosis.sum}`,
  `${t('recoveryResolvedCount')}: ${recoveryState.completedQuestionIds.length}`,
  '',
  `${t('recoveryPrescription')}: ${t(recoveryAdviceKey(diagnosis.dominant))}`,
  '',
  `${t('recoveryPriorityQuestions')}:`,
  ...pool.map((question,index)=>`${index+1}. ${question.id} — ${question.question}`),
  '',
  t('recoveryOfflineText'),
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
}
function recoveryViewHtml(){
 const diagnosis=recoveryDiagnosisData();
 const pool=recoveryPriorityPool();
 const resolved=pool.filter(question=>recoveryResolved(question.id)).length;
 const score=pool.length?Math.round(resolved/pool.length*100):0;
 const prescription=t(recoveryAdviceKey(diagnosis.dominant));
 const dialoguePrompt=recoveryState.lastPrompt||'why';
 return [
  `<div class="section-title"><div><h2>🩺 ${esc(t('coachRecovery'))}</h2><p>${esc(t('coachRecoverySub'))}</p></div><span class="badge official">Build 19</span></div>`,
  `<div class="recovery-offline"><span>🔒</span><div><strong>${esc(t('recoveryOffline'))}</strong><p>${esc(t('recoveryOfflineText'))}</p></div></div>`,
  `<section class="recovery-diagnosis-card"><div class="recovery-score" style="--recovery-score:${score}"><div><strong>${score}%</strong><span>${esc(t('recoveryScore'))}</span></div></div><div><span>${esc(t('recoveryDiagnosis'))}</span><h3>${diagnosis.dominant?esc(t(recoveryReasonTranslationKey(diagnosis.dominant))):esc(t('recoveryDataNeeded'))}</h3><p>${diagnosis.sum} ${esc(t('recoveryRecordedErrors'))} • ${resolved}/${pool.length} ${esc(t('recoveryResolvedCount'))}</p></div></section>`,
  diagnosis.sum?`<div class="card recovery-reason-card"><h3>${esc(t('recoveryRecordedErrors'))}</h3><div class="recovery-reason-bars">${diagnosis.entries.map(([id,value])=>`<div><span>${esc(t(recoveryReasonTranslationKey(id)))}</span><i><b style="width:${diagnosis.sum?Math.round(value/diagnosis.sum*100):0}%"></b></i><strong>${value}</strong></div>`).join('')}</div></div>`:`<div class="card recovery-empty-reasons"><p>${esc(t('recoveryNoReasons'))}</p></div>`,
  `<div class="card recovery-prescription"><span>${esc(t('recoveryPrescription'))}</span><h3>${diagnosis.dominant?'🧠':'📘'} ${esc(prescription)}</h3></div>`,
  `<div class="section-title"><div><h2>${esc(t('recoveryPlan'))}</h2></div></div>`,
  `<div class="recovery-plan-grid"><article><span>1</span><h3>${esc(t('recoveryStepUnderstand'))}</h3><p>${esc(t('recoveryUnderstandText'))}</p></article><article><span>2</span><h3>${esc(t('recoveryStepPractise'))}</h3><p>${esc(t('recoveryPractiseText'))}</p></article><article><span>3</span><h3>${esc(t('recoveryStepVerify'))}</h3><p>${esc(t('recoveryVerifyText'))}</p></article></div>`,
  `<div class="card recovery-dialogue-card"><h3>${esc(t('coachDialogue'))}</h3><p>${esc(t('coachDialogueSub'))}</p><div class="recovery-prompt-grid"><button data-recovery-prompt="why">${esc(t('coachAskWhy'))}</button><button data-recovery-prompt="english">${esc(t('coachAskEnglish'))}</button><button data-recovery-prompt="ready">${esc(t('coachAskReady'))}</button><button data-recovery-prompt="next">${esc(t('coachAskNext'))}</button></div><div class="recovery-dialogue-answer" id="recoveryDialogueAnswer">${esc(recoveryDialogueAnswer(dialoguePrompt))}</div></div>`,
  `<div class="section-title"><div><h2>${esc(t('recoveryPriorityQuestions'))}</h2><p>${esc(t('recoveryPrioritySub'))}</p></div><strong>${pool.length}</strong></div>`,
  pool.length?`<div class="recovery-question-list">${pool.map(question=>`<article class="${recoveryResolved(question.id)?'resolved':''}"><div><span>${esc(question.id)} • ${esc(question.category)}</span><h3>${esc(question.question)}</h3><p>🇮🇹 ${esc(question.question_it||'')}</p></div><div class="recovery-question-actions"><button class="btn" data-recovery-study="${esc(question.id)}">${esc(t('recoveryStartQuestion'))}</button><button class="btn secondary" data-recovery-resolve="${esc(question.id)}">${recoveryResolved(question.id)?'✓ '+esc(t('recoveryResolved')):esc(t('recoveryMarkResolved'))}</button></div></article>`).join('')}</div>`:`<div class="card"><p>${esc(t('recoveryNoQuestions'))}</p><button class="btn" data-go="studysetup">${esc(t('guidedStudy'))}</button></div>`,
  `<div class="recovery-report-actions"><button class="btn" id="shareRecoveryReport">↗ ${esc(t('recoveryReport'))}</button><button class="btn secondary" id="copyRecoveryReport">⧉ ${esc(t('recoveryCopy'))}</button></div>`,
  `<button class="text-danger-button" id="resetRecoveryResolved">${esc(t('recoveryResetResolved'))}</button>`
 ].join('');
}
function bindRecoveryCoach(){
 recoveryState.lastVisit=new Date().toISOString();
 save(RECOVERY_KEY,recoveryState);
 screen.querySelectorAll('[data-recovery-prompt]').forEach(button=>button.onclick=()=>setRecoveryDialogue(button.dataset.recoveryPrompt));
 screen.querySelectorAll('[data-recovery-study]').forEach(button=>button.onclick=()=>startRecoveryQuestion(button.dataset.recoveryStudy));
 screen.querySelectorAll('[data-recovery-resolve]').forEach(button=>button.onclick=()=>toggleRecoveryResolved(button.dataset.recoveryResolve));
 $('#shareRecoveryReport').onclick=()=>shareTextReport(t('coachRecovery'),recoveryReportText(),t('recoveryCopied'));
 $('#copyRecoveryReport').onclick=()=>copyTextSafe(recoveryReportText(),t('recoveryCopied'));
 $('#resetRecoveryResolved').onclick=resetRecoveryResolved;
 setRecoveryDialogue(recoveryState.lastPrompt||'why');
}

function coachTodayKey(){return dateKey()}
function coachEnsureMission(){
 const today=coachTodayKey();
 if(coachState.missionDate!==today){
  coachState.missionDate=today;
  coachState.missionDone=false;
  coachState.missionSteps={study:false,review:false,bridge:false};
  save(COACH_KEY,coachState);
 }
}
function coachExamScores(){
 return (progress.exams||[]).map(exam=>{
  const total=Number(exam.total||35);
  return total?Math.round(Number(exam.score||0)/total*100):0;
 }).filter(Number.isFinite);
}
function coachRecentTrend(){
 const scores=coachExamScores();
 if(scores.length<2)return {delta:0,state:'stable'};
 const recent=scores.slice(-3);
 const delta=recent.at(-1)-recent[0];
 return {delta,state:delta>=5?'up':delta<=-5?'down':'stable'};
}
function coachReviewDiscipline(){
 const review=progress.review||{};
 const values=Object.values(review);
 if(!values.length)return 0;
 const mastered=values.filter(item=>Number(item.level||0)>=3).length;
 return Math.round(mastered/values.length*100);
}
function coachConsistencyScore(){
 const activity=progress.activity||{};
 const today=new Date();
 let active=0;
 for(let offset=0;offset<7;offset++){
  const d=new Date(today);
  d.setDate(d.getDate()-offset);
  const key=d.toISOString().slice(0,10);
  if(Number(activity[key]||0)>0)active++;
 }
 return Math.round(active/7*100);
}
function coachMetrics(){
 const readiness=readinessStats();
 const exams=coachExamScores();
 const examScore=exams.length?Math.round(exams.slice(-3).reduce((a,b)=>a+b,0)/Math.min(3,exams.length)):0;
 const bridge=latestBridgeResult();
 const bridgeScore=bridge?Math.round((Number(bridge.knowledgePct||0)+Number(bridge.englishPct||0))/2):0;
 const consistency=coachConsistencyScore();
 const review=coachReviewDiscipline();
 const accuracy=readiness.accuracy||0;
 const coverage=readiness.coverage||0;
 const confidence=Math.max(0,Math.min(100,Math.round(
  accuracy*.24+
  coverage*.18+
  examScore*.24+
  bridgeScore*.16+
  consistency*.10+
  review*.08
 )));
 const todayChance=Math.max(5,Math.min(95,Math.round(confidence*.92)));
 const trend=coachRecentTrend();
 const improvementBoost=trend.state==='up'?7:trend.state==='down'?-4:2;
 const weekChance=Math.max(todayChance,Math.min(97,Math.round(todayChance+improvementBoost+(100-coverage)*.04)));
 const points=
  Object.keys(progress.seen||{}).length+
  (progress.exams||[]).length+
  (progress.bridgeResults||[]).length+
  Object.keys(progress.review||{}).length+
  Object.keys(progress.activity||{}).length;
 return {accuracy,coverage,examScore,bridgeScore,consistency,review,confidence,todayChance,weekChance,trend,points};
}
function coachConfidenceLabel(score){
 if(score>=85)return 'confidenceExcellent';
 if(score>=70)return 'confidenceHigh';
 if(score>=45)return 'confidenceMedium';
 return 'confidenceLow';
}
function coachTopicRankings(){
 return TOPIC_GROUPS.map(topic=>{
  const values=topicStats(topic.id);
  const score=Math.round(values.accuracy*.65+values.coverage*.35);
  return {topic,values,score};
 }).sort((a,b)=>b.score-a.score);
}
function coachInsightData(){
 const metrics=coachMetrics();
 const rankings=coachTopicRankings();
 const strength=rankings[0];
 const weakness=rankings.at(-1);
 const next=roadmapNextAction();
 return {metrics,strength,weakness,next};
}
function coachAchievementData(){
 const st=stats();
 const bridge=latestBridgeResult();
 const passport=passportRequiredStats();
 const exams=progress.exams||[];
 const safety=topicStats('safety');
 const passenger=topicStats('customer');
 return [
  {icon:'2️⃣5️⃣',label:'achievementFirst25',done:st.seen>=25},
  {icon:'💯',label:'achievementFirst100',done:st.seen>=100},
  {icon:'✅',label:'achievementExamPass',done:exams.some(exam=>Number(exam.score||0)>=30)},
  {icon:'🌉',label:'achievementBridge',done:Boolean(bridge&&Number(bridge.masteredPct||0)>=80)},
  {icon:'🛡',label:'achievementSafety',done:safety.accuracy>=85&&safety.coverage>=70},
  {icon:'🤝',label:'achievementPassenger',done:passenger.accuracy>=85&&passenger.coverage>=70},
  {icon:'🔥',label:'achievementConsistency',done:coachConsistencyScore()>=100},
  {icon:'🧭',label:'achievementPassport',done:passport.pct>=100}
 ];
}
function coachMissionItems(){
 const review=reviewStats();
 const bridge=latestBridgeResult();
 return [
  {
   id:'study',icon:'📘',label:'missionStudy',
   route:'dailysetup',detail:`${dailyStats().done}/${dailyStats().goal}`
  },
  {
   id:'review',icon:'⏳',label:'missionReview',
   route:'reviewsetup',detail:review.due?`${review.due} ${t('dueNow')}`:`${(progress.wrong||[]).length||0}`
  },
  {
   id:'bridge',icon:'🌉',label:'missionBridge',
   route:'bridgesetup',detail:bridge?`${bridge.englishPct}%`:'—'
  }
 ];
}
function toggleCoachMissionStep(id){
 coachEnsureMission();
 coachState.missionSteps[id]=!coachState.missionSteps[id];
 const values=Object.values(coachState.missionSteps);
 coachState.missionDone=values.every(Boolean);
 save(COACH_KEY,coachState);
 render();
}
function resetCoachMission(){
 if(!confirm(t('coachResetConfirm')))return;
 coachState.missionDate=coachTodayKey();
 coachState.missionDone=false;
 coachState.missionSteps={study:false,review:false,bridge:false};
 save(COACH_KEY,coachState);
 toast(t('coachResetDone'));
 render();
}
function investorSummaryText(){
 const metrics=coachMetrics();
 return [
  'MALTA DRIVING MASTER — INVESTOR PREVIEW',
  '',
  `${t('investorProblem')}: ${t('investorProblemText')}`,
  '',
  `${t('investorSolution')}: ${t('investorSolutionText')}`,
  '',
  `${t('investorDifferentiator')}: ${t('investorDifferentiatorText')}`,
  '',
  `${t('investorStudentValue')}: ${t('investorStudentPoints')}`,
  `${t('investorSchoolValue')}: ${t('investorSchoolPoints')}`,
  '',
  `${t('investorScale')}: ${t('investorScaleText')}`,
  '',
  `${t('investorStatus')}: ${t('investorStatusText')}`,
  `${t('investorArchitecture')}: ${t('investorArchitectureText')}`,
  '',
  `${t('investorActiveQuestions')}: 250`,
  `${t('investorCoreModules')}: 12+`,
  `${t('investorLanguages')}: 3`,
  `${t('investorUserTypes')}: 2`,
  `${t('confidenceScore')}: ${metrics.confidence}%`,
  '',
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
}
function bindCoach(){
 coachEnsureMission();
 coachState.lastCoachVisit=new Date().toISOString();
 save(COACH_KEY,coachState);
 screen.querySelectorAll('[data-coach-mission]').forEach(button=>{
  button.onclick=()=>toggleCoachMissionStep(button.dataset.coachMission);
 });
 $('#resetCoachMission').onclick=resetCoachMission;
}
function bindInvestorPreview(){
 coachState.investorPreviewViewed=true;
 save(COACH_KEY,coachState);
 $('#shareInvestorPreview').onclick=()=>shareTextReport(t('investorPreview'),investorSummaryText(),t('investorCopied'));
 $('#copyInvestorPreview').onclick=()=>copyTextSafe(investorSummaryText(),t('investorCopied'));
}

function onboardingRoleLabel(role){
 return t(role==='school'?'onboardingSchool':role==='both'?'onboardingBoth':'onboardingStudent');
}
function completeOnboarding(){
 const role=screen.querySelector('[name="onboardingRole"]:checked')?.value||'';
 const localStorageAccepted=Boolean($('#onboardingStorage')?.checked);
 const termsAccepted=Boolean($('#onboardingTerms')?.checked);
 if(!role||!localStorageAccepted||!termsAccepted)return toast(t('onboardingRequired'));
 onboarding={
  completed:true,
  role,
  acceptedLocalStorage:true,
  acceptedTerms:true,
  optionalUpdates:Boolean($('#onboardingUpdates')?.checked),
  completedAt:new Date().toISOString()
 };
 save(ONBOARDING_KEY,onboarding);
 if(onboarding.optionalUpdates){
  userProfile.updatesConsent=true;
  save(USER_PROFILE,userProfile);
 }
 go(role==='school'?'schoolpartner':'home');
}
function bindOnboarding(){
 screen.querySelectorAll('[data-onboarding-role]').forEach(card=>{
  card.onclick=event=>{
   if(event.target.tagName!=='INPUT')card.querySelector('input').checked=true;
   screen.querySelectorAll('[data-onboarding-role]').forEach(item=>{
    item.classList.toggle('selected',item.querySelector('input').checked);
   });
  };
 });
 $('#completeOnboarding').onclick=completeOnboarding;
}
function privacyDataSummary(){
 const profileCount=['firstName','lastName','email','address','age'].filter(key=>String(userProfile[key]??'').trim()).length;
 const studyCount=
  Object.keys(progress.seen||{}).length+
  (progress.exams||[]).length+
  (progress.favourites||[]).length+
  Object.keys(progress.review||{}).length+
  (progress.bridgeResults||[]).length;
 const passportCount=
  Object.values(lptvPassport.checklist||{}).filter(Boolean).length+
  Object.values(lptvPassport.dates||{}).filter(Boolean).length+
  (lptvPassport.notes?1:0);
 const roadmapCount=[
  personalRoadmap.targetDate,
  personalRoadmap.dailyMinutes,
  personalRoadmap.studyDays,
  personalRoadmap.mainGoal
 ].filter(Boolean).length;
 const schoolCount=
  (schoolCompare||[]).length+
  (schoolDashboard.students||[]).length+
  (schoolDashboard.groups||[]).length+
  (schoolDashboard.invites||[]).length+
  Object.values(schoolPartnerDraft||{}).filter(value=>Array.isArray(value)?value.length:Boolean(value)).length;
 return {profileCount,studyCount,passportCount,roadmapCount,schoolCount};
}
function resetStudyData(){
 progress={
  seen:{},correct:{},wrong:{},exams:[],favourites:[],activity:{},
  knownWords:[],knownPhrases:[],review:{},errorReasons:{},
  bridgeResults:[],bankVersion:TAG_BANK_VERSION
 };
 save(STORAGE,progress);
 localStorage.removeItem(SESSION);
}
function resetProfileData(){
 localStorage.removeItem(USER_PROFILE);
 userProfile={
  firstName:'',lastName:'',email:'',address:'',age:'',
  privacyConsent:false,updatesConsent:false,
  registrationId:createRegistrationId(),savedAt:'',emailPreparedAt:''
 };
}
function resetPassportData(){
 lptvPassport=JSON.parse(JSON.stringify(DEFAULT_LPTV_PASSPORT));
 localStorage.removeItem(PASSPORT_KEY);
}
function resetRoadmapData(){
 personalRoadmap={...DEFAULT_PERSONAL_ROADMAP};
 localStorage.removeItem(ROADMAP_KEY);
}
function resetSchoolData(){
 schoolPreferences={...DEFAULT_SCHOOL_PREFS};
 schoolCompare=[];
 schoolPartnerDraft={
  schoolName:'',permit:'',email:'',phone:'',area:'central',
  languages:['en'],services:[],prices:'',availability:'',
  description:'',plan:'basic',consent:false
 };
 schoolDashboard=JSON.parse(JSON.stringify(DEFAULT_SCHOOL_DASHBOARD));
 [SCHOOL_PREFS_KEY,SCHOOL_COMPARE_KEY,SCHOOL_PARTNER_KEY,SCHOOL_DASHBOARD_KEY].forEach(key=>localStorage.removeItem(key));
}
function deletePrivacyArea(area){
 const config={
  study:['privacyDeleteStudyConfirm',resetStudyData],
  profile:['privacyDeleteProfileConfirm',resetProfileData],
  passport:['privacyDeletePassportConfirm',resetPassportData],
  roadmap:['privacyDeleteRoadmapConfirm',resetRoadmapData],
  school:['privacyDeleteSchoolConfirm',resetSchoolData]
 };
 const entry=config[area];
 if(!entry||!confirm(t(entry[0])))return;
 entry[1]();
 toast(t('privacyDeleted'));
 render();
}
function deleteAllAppData(){
 if(!confirm(t('privacyDeleteAllConfirm')))return;
 const keys=[
  STORAGE,SETTINGS,SESSION,USER_PROFILE,
  SCHOOL_PREFS_KEY,SCHOOL_COMPARE_KEY,SCHOOL_PARTNER_KEY,SCHOOL_DASHBOARD_KEY,
  PASSPORT_KEY,ROADMAP_KEY,ONBOARDING_KEY,PRIVACY_PREFS_KEY
 ];
 keys.forEach(key=>localStorage.removeItem(key));
 toast(t('privacyAllDeleted'));
 setTimeout(()=>location.reload(),500);
}
function savePrivacyPreferences(){
 privacyPreferences={
  analytics:Boolean($('#privacyAnalytics')?.checked),
  marketing:Boolean($('#privacyMarketing')?.checked),
  updatedAt:new Date().toISOString()
 };
 save(PRIVACY_PREFS_KEY,privacyPreferences);
 toast(t('privacyPreferencesSaved'));
}
function privacyRequestPayload(type){
 const labels={
  access:t('privacyRequestAccess'),
  correction:t('privacyRequestCorrection'),
  erasure:t('privacyRequestErasure')
 };
 const subject=`Malta Driving Master - Privacy - ${labels[type]||type}`;
 const body=[
  'PRIVACY REQUEST / RICHIESTA PRIVACY',
  '',
  `Request type: ${labels[type]||type}`,
  `Name: ${[userProfile.firstName,userProfile.lastName].filter(Boolean).join(' ')||t('notProvided')}`,
  `Email: ${userProfile.email||t('notProvided')}`,
  `Registration ID: ${userProfile.registrationId||t('notProvided')}`,
  '',
  'I am contacting Malta Driving Master regarding information that I may previously have sent by email.',
  'Please advise what identity verification is required and how this request will be handled.',
  '',
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
 return {subject,body};
}
async function sendPrivacyRequest(type){
 const payload=privacyRequestPayload(type);
 await shareTextReport(payload.subject,`A: ${ADMIN_EMAIL}\n\n${payload.body}`,t('privacyRequestPrepared'));
}
function restartOnboarding(){
 onboarding={...DEFAULT_ONBOARDING};
 save(ONBOARDING_KEY,onboarding);
 go('onboarding');
}
function bindPrivacyCenter(){
 $('#privacyExportAll').onclick=exportBackup;
 screen.querySelectorAll('[data-delete-privacy]').forEach(button=>{
  button.onclick=()=>deletePrivacyArea(button.dataset.deletePrivacy);
 });
 $('#privacyDeleteAll').onclick=deleteAllAppData;
 $('#privacySavePreferences').onclick=savePrivacyPreferences;
 screen.querySelectorAll('[data-privacy-request]').forEach(button=>{
  button.onclick=()=>sendPrivacyRequest(button.dataset.privacyRequest);
 });
 $('#privacyRestartOnboarding').onclick=restartOnboarding;
}

function schoolDashboardId(prefix='item'){
 return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
}
function dashboardClamp(value){
 return Math.max(0,Math.min(100,Number(value)||0));
}
function dashboardSchoolName(){
 return schoolPartnerDraft.schoolName||t('dashboardNoSchoolName');
}
function dashboardProfileCompletion(){
 const fields=[
  schoolPartnerDraft.schoolName,
  schoolPartnerDraft.permit,
  schoolPartnerDraft.email,
  schoolPartnerDraft.phone,
  schoolPartnerDraft.area,
  Array.isArray(schoolPartnerDraft.languages)&&schoolPartnerDraft.languages.length,
  Array.isArray(schoolPartnerDraft.services)&&schoolPartnerDraft.services.length,
  schoolPartnerDraft.prices,
  schoolPartnerDraft.availability,
  schoolPartnerDraft.description,
  schoolPartnerDraft.consent
 ];
 const complete=fields.filter(Boolean).length;
 return {complete,total:fields.length,pct:Math.round(complete/fields.length*100)};
}
function dashboardGroupById(id){
 return schoolDashboard.groups.find(group=>group.id===id)||null;
}
function dashboardStudentById(id){
 return schoolDashboard.students.find(student=>student.id===id)||null;
}
function dashboardInviteById(id){
 return schoolDashboard.invites.find(invite=>invite.id===id)||null;
}
function dashboardStudentAverage(student){
 return Math.round((
  dashboardClamp(student.progress)+
  dashboardClamp(student.bridge)+
  dashboardClamp(student.passport)
 )/3);
}
function dashboardStats(){
 const students=schoolDashboard.students;
 const average=students.length
  ?Math.round(students.reduce((sum,student)=>sum+dashboardStudentAverage(student),0)/students.length)
  :0;
 return {
  students:students.length,
  groups:schoolDashboard.groups.length,
  invites:schoolDashboard.invites.length,
  average
 };
}
function dashboardStatusLabel(status){
 const map={
  active:'dashboardStatusActive',
  paused:'dashboardStatusPaused',
  ready:'dashboardStatusReady',
  completed:'dashboardStatusCompleted'
 };
 return t(map[status]||'dashboardStatusActive');
}
function dashboardCourseLabel(course){
 return course==='b'?t('courseB'):t('courseLptv');
}
function dashboardDate(value){
 if(!value)return '—';
 try{
  const locale=settings.lang==='it'?'it-IT':settings.lang==='mt'?'mt-MT':'en-GB';
  return new Intl.DateTimeFormat(locale,{dateStyle:'medium'}).format(new Date(value));
 }catch{return value}
}
function dashboardSave(){
 schoolDashboard.savedAt=new Date().toISOString();
 save(SCHOOL_DASHBOARD_KEY,schoolDashboard);
}
function dashboardProfilePreviewHtml(){
 const languages=(schoolPartnerDraft.languages||[]).map(schoolLanguageLabel);
 const services=(schoolPartnerDraft.services||[]).map(schoolServiceLabel);
 return `<article class="dashboard-public-preview">
  <div class="school-badges">
   <span class="badge demo-school">${esc(t('dashboardNotVerified'))}</span>
   <span class="badge partner-badge">${esc(t('dashboardPlan'))}: ${esc(schoolPartnerDraft.plan||'basic')}</span>
  </div>
  <h3>${esc(dashboardSchoolName())}</h3>
  <p>${esc(schoolPartnerDraft.description||t('dashboardPublicPreviewSub'))}</p>
  <div class="dashboard-preview-meta">
   <span>📍 ${esc(schoolAreaLabel(schoolPartnerDraft.area||'central'))}</span>
   <span>🌐 ${esc(languages.join(', ')||t('notProvided'))}</span>
   <span>✓ ${esc(t('dashboardPermitHidden'))}</span>
  </div>
  <div class="school-service-chips">${services.length?services.map(service=>`<span>${esc(service)}</span>`).join(''):`<span>${esc(t('notProvided'))}</span>`}</div>
 </article>`;
}
function dashboardGroupOptions(selected=''){
 return `<option value="">${esc(t('dashboardNoGroup'))}</option>`+
  schoolDashboard.groups.map(group=>`<option value="${esc(group.id)}" ${group.id===selected?'selected':''}>${esc(group.name)}</option>`).join('');
}
function dashboardStudentFormHtml(student=null){
 const current=student||{
  id:'',name:'',email:'',course:'lptv',groupId:'',
  progress:0,bridge:0,passport:0,status:'active',notes:''
 };
 return `<div class="dashboard-student-form" data-student-form="${esc(current.id||'new')}">
  <div class="dashboard-form-grid">
   <label><span>${esc(t('dashboardStudentName'))} *</span><input data-student-field="name" maxlength="100" value="${esc(current.name)}"></label>
   <label><span>${esc(t('dashboardStudentEmail'))} *</span><input data-student-field="email" type="email" maxlength="120" value="${esc(current.email)}"></label>
   <label><span>${esc(t('dashboardStudentCourse'))}</span><select data-student-field="course"><option value="lptv" ${current.course==='lptv'?'selected':''}>${esc(t('courseLptv'))}</option><option value="b" ${current.course==='b'?'selected':''}>${esc(t('courseB'))}</option></select></label>
   <label><span>${esc(t('dashboardStudentGroup'))}</span><select data-student-field="groupId">${dashboardGroupOptions(current.groupId)}</select></label>
   <label><span>${esc(t('dashboardStudentProgress'))}</span><input data-student-field="progress" type="number" min="0" max="100" value="${dashboardClamp(current.progress)}"></label>
   <label><span>${esc(t('dashboardStudentBridge'))}</span><input data-student-field="bridge" type="number" min="0" max="100" value="${dashboardClamp(current.bridge)}"></label>
   <label><span>${esc(t('dashboardStudentPassport'))}</span><input data-student-field="passport" type="number" min="0" max="100" value="${dashboardClamp(current.passport)}"></label>
   <label><span>${esc(t('dashboardStudentStatus'))}</span><select data-student-field="status">
    <option value="active" ${current.status==='active'?'selected':''}>${esc(t('dashboardStatusActive'))}</option>
    <option value="paused" ${current.status==='paused'?'selected':''}>${esc(t('dashboardStatusPaused'))}</option>
    <option value="ready" ${current.status==='ready'?'selected':''}>${esc(t('dashboardStatusReady'))}</option>
    <option value="completed" ${current.status==='completed'?'selected':''}>${esc(t('dashboardStatusCompleted'))}</option>
   </select></label>
  </div>
  <label class="dashboard-long-field"><span>${esc(t('dashboardStudentNotes'))}</span><textarea data-student-field="notes" maxlength="1000">${esc(current.notes||'')}</textarea></label>
  <div class="dashboard-inline-actions">
   <button class="btn" data-save-dashboard-student="${esc(current.id||'new')}">${esc(current.id?t('dashboardUpdateStudent'):t('dashboardSaveStudent'))}</button>
   ${current.id?`<button class="btn secondary danger" data-remove-dashboard-student="${esc(current.id)}">${esc(t('dashboardRemoveStudent'))}</button>`:''}
  </div>
 </div>`;
}
function dashboardStudentCardsHtml(){
 if(!schoolDashboard.students.length)return `<div class="dashboard-empty"><span>👤</span><p>${esc(t('dashboardNoStudents'))}</p></div>`;
 return schoolDashboard.students.map(student=>{
  const group=dashboardGroupById(student.groupId);
  const average=dashboardStudentAverage(student);
  return `<article class="dashboard-student-card ${student.demo?'demo-record':''}">
   <div class="dashboard-student-head">
    <div>${student.demo?`<span class="badge demo-school">${esc(t('dashboardDemoBadge'))}</span>`:''}<h3>${esc(student.name)}</h3><p>${esc(student.email)}</p></div>
    <div class="dashboard-student-score"><strong>${average}%</strong><span>${esc(t('dashboardAverage'))}</span></div>
   </div>
   <div class="dashboard-student-meta">
    <span>${esc(dashboardCourseLabel(student.course))}</span>
    <span>${esc(group?group.name:t('dashboardNoGroup'))}</span>
    <span>${esc(dashboardStatusLabel(student.status))}</span>
   </div>
   <div class="dashboard-progress-bars">
    <div><span>${esc(t('dashboardStudentProgress'))}</span><i><b style="width:${dashboardClamp(student.progress)}%"></b></i><strong>${dashboardClamp(student.progress)}%</strong></div>
    <div><span>${esc(t('dashboardStudentBridge'))}</span><i><b style="width:${dashboardClamp(student.bridge)}%"></b></i><strong>${dashboardClamp(student.bridge)}%</strong></div>
    <div><span>${esc(t('dashboardStudentPassport'))}</span><i><b style="width:${dashboardClamp(student.passport)}%"></b></i><strong>${dashboardClamp(student.passport)}%</strong></div>
   </div>
   <details><summary>${esc(t('dashboardUpdateStudent'))}</summary>${dashboardStudentFormHtml(student)}</details>
  </article>`;
 }).join('');
}
function dashboardGroupCardsHtml(){
 if(!schoolDashboard.groups.length)return `<div class="dashboard-empty"><span>👥</span><p>${esc(t('dashboardNoGroups'))}</p></div>`;
 return schoolDashboard.groups.map(group=>{
  const members=schoolDashboard.students.filter(student=>student.groupId===group.id).length;
  return `<article class="dashboard-group-card ${group.demo?'demo-record':''}">
   <div>${group.demo?`<span class="badge demo-school">${esc(t('dashboardDemoBadge'))}</span>`:''}<h3>${esc(group.name)}</h3><p>${esc(schoolLanguageLabel(group.language))} • ${esc(schoolScheduleLabel(group.schedule))}</p></div>
   <strong>${members} ${esc(t('dashboardMembers'))}</strong>
   ${group.notes?`<p>${esc(group.notes)}</p>`:''}
   <button class="btn secondary danger" data-remove-dashboard-group="${esc(group.id)}">${esc(t('dashboardRemoveGroup'))}</button>
  </article>`;
 }).join('');
}
function dashboardInviteCardsHtml(){
 if(!schoolDashboard.invites.length)return `<div class="dashboard-empty"><span>✉</span><p>${esc(t('dashboardNoInvites'))}</p></div>`;
 return schoolDashboard.invites.map(invite=>{
  const group=dashboardGroupById(invite.groupId);
  return `<article class="dashboard-invite-card">
   <div><span>${esc(t('dashboardCreated'))}: ${esc(dashboardDate(invite.createdAt))}</span><strong>${esc(invite.code)}</strong><small>${esc(group?group.name:t('dashboardNoGroup'))}</small></div>
   <div class="dashboard-invite-actions">
    <button class="btn" data-share-dashboard-invite="${esc(invite.id)}">↗ ${esc(t('dashboardShareInvite'))}</button>
    <button class="btn secondary" data-copy-dashboard-invite="${esc(invite.id)}">⧉ ${esc(t('dashboardCopyInvite'))}</button>
    <button class="btn secondary danger" data-remove-dashboard-invite="${esc(invite.id)}">${esc(t('dashboardRemoveInvite'))}</button>
   </div>
  </article>`;
 }).join('');
}
function dashboardCollectStudent(form){
 const value=name=>form.querySelector(`[data-student-field="${name}"]`)?.value||'';
 return {
  name:cleanProfileValue(value('name'),100),
  email:cleanProfileValue(value('email'),120).toLowerCase(),
  course:value('course')==='b'?'b':'lptv',
  groupId:value('groupId'),
  progress:dashboardClamp(value('progress')),
  bridge:dashboardClamp(value('bridge')),
  passport:dashboardClamp(value('passport')),
  status:['active','paused','ready','completed'].includes(value('status'))?value('status'):'active',
  notes:cleanProfileValue(value('notes'),1000)
 };
}
function saveDashboardStudent(id){
 const form=screen.querySelector(`[data-student-form="${CSS.escape(id)}"]`);
 if(!form)return;
 const data=dashboardCollectStudent(form);
 if(!data.name||!validProfileEmail(data.email))return toast(t('dashboardStudentRequired'));
 if(id==='new'){
  schoolDashboard.students.unshift({
   id:schoolDashboardId('student'),
   ...data,
   demo:false,
   createdAt:new Date().toISOString(),
   updatedAt:new Date().toISOString()
  });
 }else{
  const student=dashboardStudentById(id);
  if(!student)return;
  Object.assign(student,data,{updatedAt:new Date().toISOString()});
 }
 dashboardSave();
 toast(t('dashboardStudentSaved'));
 render();
}
function removeDashboardStudent(id){
 if(!confirm(t('dashboardRemoveStudentConfirm')))return;
 schoolDashboard.students=schoolDashboard.students.filter(student=>student.id!==id);
 dashboardSave();
 toast(t('dashboardStudentRemoved'));
 render();
}
function saveDashboardGroup(){
 const name=cleanProfileValue($('#dashboardGroupName')?.value,100);
 if(!name)return toast(t('dashboardGroupRequired'));
 schoolDashboard.groups.unshift({
  id:schoolDashboardId('group'),
  name,
  language:$('#dashboardGroupLanguage')?.value||'en',
  schedule:$('#dashboardGroupSchedule')?.value||'day',
  notes:cleanProfileValue($('#dashboardGroupNotes')?.value,600),
  demo:false,
  createdAt:new Date().toISOString()
 });
 dashboardSave();
 toast(t('dashboardGroupSaved'));
 render();
}
function removeDashboardGroup(id){
 if(!confirm(t('dashboardRemoveGroupConfirm')))return;
 schoolDashboard.groups=schoolDashboard.groups.filter(group=>group.id!==id);
 schoolDashboard.students.forEach(student=>{
  if(student.groupId===id)student.groupId='';
 });
 schoolDashboard.invites=schoolDashboard.invites.filter(invite=>invite.groupId!==id);
 dashboardSave();
 toast(t('dashboardGroupRemoved'));
 render();
}
function createDashboardInvite(){
 const groupId=$('#dashboardInviteGroup')?.value||'';
 const code=`MDM-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
 schoolDashboard.invites.unshift({
  id:schoolDashboardId('invite'),
  code,
  groupId,
  createdAt:new Date().toISOString()
 });
 dashboardSave();
 toast(t('dashboardInviteCreated'));
 render();
}
function dashboardInviteMessage(invite){
 const group=dashboardGroupById(invite.groupId);
 return [
  t('dashboardInviteText'),
  '',
  `${t('schoolName')}: ${dashboardSchoolName()}`,
  `${t('dashboardInviteGroup')}: ${group?group.name:t('dashboardNoGroup')}`,
  `${t('dashboardInvites')}: ${invite.code}`,
  '',
  t('dashboardInviteWarning'),
  `Build ${BUILD_VERSION}`
 ].join('\n');
}
async function shareDashboardInvite(id){
 const invite=dashboardInviteById(id);
 if(!invite)return;
 await shareTextReport(t('dashboardInviteText'),dashboardInviteMessage(invite),t('dashboardInviteCopied'));
}
async function copyDashboardInvite(id){
 const invite=dashboardInviteById(id);
 if(!invite)return;
 await copyTextSafe(dashboardInviteMessage(invite),t('dashboardInviteCopied'));
}
function removeDashboardInvite(id){
 schoolDashboard.invites=schoolDashboard.invites.filter(invite=>invite.id!==id);
 dashboardSave();
 render();
}
function dashboardSchoolReport(){
 const profile=dashboardProfileCompletion();
 const stats=dashboardStats();
 const studentRows=schoolDashboard.students.map(student=>{
  const group=dashboardGroupById(student.groupId);
  return `- ${student.name} | ${dashboardCourseLabel(student.course)} | ${group?group.name:t('dashboardNoGroup')} | ${dashboardStudentAverage(student)}% | ${dashboardStatusLabel(student.status)}`;
 });
 return [
  'MALTA DRIVING MASTER — SCHOOL PARTNER DASHBOARD',
  '',
  `${t('schoolName')}: ${dashboardSchoolName()}`,
  `${t('dashboardProfileCompletion')}: ${profile.pct}%`,
  `${t('dashboardVerification')}: ${t('dashboardNotVerified')}`,
  `${t('dashboardPlan')}: ${schoolPartnerDraft.plan||'basic'}`,
  `${t('dashboardStudents')}: ${stats.students}`,
  `${t('dashboardGroups')}: ${stats.groups}`,
  `${t('dashboardInvites')}: ${stats.invites}`,
  `${t('dashboardAverage')}: ${stats.average}%`,
  '',
  `${t('dashboardStudents')}:`,
  ...(studentRows.length?studentRows:['—']),
  '',
  `${t('dashboardSchoolNotes')}: ${schoolDashboard.schoolNotes||'—'}`,
  '',
  t('schoolDashboardNotice'),
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
}
function dashboardCsvText(){
 const quote=value=>`"${String(value??'').replaceAll('"','""')}"`;
 const header=[
  'Name','Email','Course','Group','Preparation','Bridge','Passport',
  'Average','Status','Notes','Demo','Created','Updated'
 ];
 const rows=schoolDashboard.students.map(student=>{
  const group=dashboardGroupById(student.groupId);
  return [
   student.name,student.email,dashboardCourseLabel(student.course),
   group?group.name:'',dashboardClamp(student.progress),
   dashboardClamp(student.bridge),dashboardClamp(student.passport),
   dashboardStudentAverage(student),dashboardStatusLabel(student.status),
   student.notes||'',student.demo?'yes':'no',
   student.createdAt||'',student.updatedAt||''
  ].map(quote).join(',');
 });
 return [header.map(quote).join(','),...rows].join('\n');
}
async function exportDashboardCsv(){
 const csv=dashboardCsvText();
 const filename='malta-driving-master-students.csv';
 try{
  const file=new File([csv],filename,{type:'text/csv;charset=utf-8'});
  if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
   await navigator.share({files:[file],title:t('dashboardExportCsv')});
   toast(t('dashboardCsvShared'));
   return;
  }
 }catch(error){
  if(error&&error.name==='AbortError')return;
 }
 await copyTextSafe(csv,t('dashboardCsvCopied'));
}
function loadDashboardDemo(){
 if(!confirm(t('dashboardDemoConfirm')))return;
 const firstGroupId=schoolDashboardId('group');
 const secondGroupId=schoolDashboardId('group');
 const now=new Date().toISOString();
 schoolDashboard.groups.push(
  {id:firstGroupId,name:'Demo LPTV Evening',language:'it',schedule:'evening',notes:'Fictitious demonstration group',demo:true,createdAt:now},
  {id:secondGroupId,name:'Demo Weekend Bridge',language:'en',schedule:'weekend',notes:'Fictitious demonstration group',demo:true,createdAt:now}
 );
 schoolDashboard.students.push(
  {id:schoolDashboardId('student'),name:'Demo Student One',email:'demo.one@example.invalid',course:'lptv',groupId:firstGroupId,progress:72,bridge:58,passport:35,status:'active',notes:'Fictitious record',demo:true,createdAt:now,updatedAt:now},
  {id:schoolDashboardId('student'),name:'Demo Student Two',email:'demo.two@example.invalid',course:'lptv',groupId:secondGroupId,progress:88,bridge:84,passport:70,status:'ready',notes:'Fictitious record',demo:true,createdAt:now,updatedAt:now}
 );
 dashboardSave();
 toast(t('dashboardDemoLoaded'));
 render();
}
function clearSchoolDashboard(){
 if(!confirm(t('dashboardClearConfirm')))return;
 schoolDashboard=JSON.parse(JSON.stringify(DEFAULT_SCHOOL_DASHBOARD));
 localStorage.removeItem(SCHOOL_DASHBOARD_KEY);
 toast(t('dashboardCleared'));
 render();
}
function saveDashboardNotes(){
 schoolDashboard.schoolNotes=cleanProfileValue($('#dashboardSchoolNotes')?.value,3000);
 dashboardSave();
 toast(t('dashboardNotesSaved'));
}
function bindSchoolDashboard(){
 screen.querySelectorAll('[data-save-dashboard-student]').forEach(button=>{
  button.onclick=()=>saveDashboardStudent(button.dataset.saveDashboardStudent);
 });
 screen.querySelectorAll('[data-remove-dashboard-student]').forEach(button=>{
  button.onclick=()=>removeDashboardStudent(button.dataset.removeDashboardStudent);
 });
 screen.querySelectorAll('[data-remove-dashboard-group]').forEach(button=>{
  button.onclick=()=>removeDashboardGroup(button.dataset.removeDashboardGroup);
 });
 screen.querySelectorAll('[data-share-dashboard-invite]').forEach(button=>{
  button.onclick=()=>shareDashboardInvite(button.dataset.shareDashboardInvite);
 });
 screen.querySelectorAll('[data-copy-dashboard-invite]').forEach(button=>{
  button.onclick=()=>copyDashboardInvite(button.dataset.copyDashboardInvite);
 });
 screen.querySelectorAll('[data-remove-dashboard-invite]').forEach(button=>{
  button.onclick=()=>removeDashboardInvite(button.dataset.removeDashboardInvite);
 });
 $('#dashboardSaveGroup').onclick=saveDashboardGroup;
 $('#dashboardCreateInvite').onclick=createDashboardInvite;
 $('#dashboardShareReport').onclick=()=>shareTextReport(t('dashboardReports'),dashboardSchoolReport(),t('dashboardReportCopied'));
 $('#dashboardCopyReport').onclick=()=>copyTextSafe(dashboardSchoolReport(),t('dashboardReportCopied'));
 $('#dashboardExportCsv').onclick=exportDashboardCsv;
 $('#dashboardLoadDemo').onclick=loadDashboardDemo;
 $('#dashboardClear').onclick=clearSchoolDashboard;
 $('#dashboardSaveNotes').onclick=saveDashboardNotes;
}

function partnerSelectedValues(selector){
 return [...screen.querySelectorAll(selector)].filter(input=>input.checked).map(input=>input.value);
}
function collectSchoolPartnerDraft(){
 return {
  schoolName:cleanProfileValue($('#partnerSchoolName')?.value,100),
  permit:cleanProfileValue($('#partnerPermit')?.value,100),
  email:cleanProfileValue($('#partnerEmail')?.value,120).toLowerCase(),
  phone:cleanProfileValue($('#partnerPhone')?.value,60),
  area:$('#partnerArea')?.value||'central',
  languages:partnerSelectedValues('[data-partner-language]'),
  services:partnerSelectedValues('[data-partner-service]'),
  prices:cleanProfileValue($('#partnerPrices')?.value,1000),
  availability:cleanProfileValue($('#partnerAvailability')?.value,600),
  description:cleanProfileValue($('#partnerDescription')?.value,1200),
  plan:$('#partnerPlan')?.value||'basic',
  consent:Boolean($('#partnerConsent')?.checked)
 };
}
function validateSchoolPartnerDraft(draft){
 if(!draft.schoolName||!draft.permit||!validProfileEmail(draft.email)||!draft.consent)return t('partnerRequired');
 return '';
}
function saveSchoolPartnerDraft(){
 schoolPartnerDraft=collectSchoolPartnerDraft();
 save(SCHOOL_PARTNER_KEY,schoolPartnerDraft);
 toast(t('partnerDraftSaved'));
}
function schoolPartnerPayload(){
 const draft=collectSchoolPartnerDraft();
 const error=validateSchoolPartnerDraft(draft);
 if(error){toast(error);return null}
 schoolPartnerDraft=draft;
 save(SCHOOL_PARTNER_KEY,schoolPartnerDraft);
 const subject=`Malta Driving Master - School Partner - ${draft.schoolName}`;
 const body=[
  'RICHIESTA SCHOOL PARTNER',
  '',
  `Scuola: ${draft.schoolName}`,
  `Autorizzazione/riferimento: ${draft.permit}`,
  `E-mail: ${draft.email}`,
  `Telefono: ${draft.phone||'Non indicato'}`,
  `Zona: ${schoolAreaLabel(draft.area)}`,
  `Lingue: ${draft.languages.map(schoolLanguageLabel).join(', ')||'Non indicate'}`,
  `Servizi: ${draft.services.map(schoolServiceLabel).join(', ')||'Non indicati'}`,
  `Piano richiesto: ${draft.plan}`,
  '',
  `Prezzi/pagamenti: ${draft.prices||'Non indicati'}`,
  `Disponibilità: ${draft.availability||'Non indicata'}`,
  `Descrizione: ${draft.description||'Non indicata'}`,
  '',
  `Dichiarazione accettata: ${draft.consent?'Sì':'No'}`,
  `Build ${BUILD_VERSION} • ${new Date().toLocaleString()}`
 ].join('\n');
 return {subject,body};
}
async function shareSchoolPartnerApplication(){
 const payload=schoolPartnerPayload();
 if(!payload)return;
 await shareTextReport(payload.subject,`A: ${ADMIN_EMAIL}\n\n${payload.body}`,t('requestPrepared'));
}
function openSchoolPartnerGmail(){
 const payload=schoolPartnerPayload();
 if(!payload)return;
 const url=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ADMIN_EMAIL)}&su=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
 const opened=window.open(url,'_blank','noopener,noreferrer');
 if(!opened)window.location.href=url;
}
function openSchoolPartnerMail(){
 const payload=schoolPartnerPayload();
 if(!payload)return;
 window.location.href=`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
}
async function copySchoolPartnerApplication(){
 const payload=schoolPartnerPayload();
 if(!payload)return;
 await copyTextSafe(`A: ${ADMIN_EMAIL}\nOggetto: ${payload.subject}\n\n${payload.body}`,t('requestPrepared'));
}
function bindSchoolPartner(){
 $('#saveSchoolDraft').onclick=saveSchoolPartnerDraft;
 $('#shareSchoolPartner').onclick=shareSchoolPartnerApplication;
 $('#gmailSchoolPartner').onclick=openSchoolPartnerGmail;
 $('#mailSchoolPartner').onclick=openSchoolPartnerMail;
 $('#copySchoolPartner').onclick=copySchoolPartnerApplication;
}


let premiumSplashSeen=Boolean(load(SPLASH_KEY,false));
function premiumUserName(){
 const name=[userProfile.firstName,userProfile.lastName].filter(Boolean).join(' ');
 return name||t('premiumWelcomeBack');
}
function shouldShowPremiumSplash(){
 return onboarding.completed&&!premiumSplashSeen&&route.name!=='onboarding'&&route.name!=='privacycenter';
}
function dismissPremiumSplash(){
 premiumSplashSeen=true;
 save(SPLASH_KEY,true);
 document.body.classList.remove('premium-splash-open');
 const splash=$('#premiumSplash');
 if(!splash)return;
 splash.classList.add('closing');
 setTimeout(()=>splash.remove(),430);
}
function replayPremiumSplash(){
 premiumSplashSeen=false;
 save(SPLASH_KEY,false);
 render();
}
function premiumSplashHtml(){
 if(!shouldShowPremiumSplash())return '';
 return `<div id="premiumSplash" class="premium-splash">
  <button class="premium-skip" id="premiumSkip">${esc(t('premiumSkip'))}</button>
  <div class="premium-orbit orbit-one"></div>
  <div class="premium-orbit orbit-two"></div>
  <div class="premium-splash-content">
   <div class="premium-logo-mark"><span>M</span><b>D</b><em>M</em></div>
   <p class="premium-eyebrow">MALTA DRIVING MASTER</p>
   <h1>${esc(t('premiumTagline'))}</h1>
   <div class="premium-loader"><span></span></div>
   <p class="premium-loading-text">${esc(t('premiumLoading'))}</p>
   <button class="premium-enter" id="premiumEnter">${esc(t('premiumEnter'))}</button>
   <small>${esc(t('premiumNoDelay'))}</small>
  </div>
 </div>`;
}


function coachViewHtml(){
 coachEnsureMission();
 const insight=coachInsightData();
 const m=insight.metrics;
 const achievements=coachAchievementData();
 const mission=coachMissionItems();
 const missionDone=Object.values(coachState.missionSteps).filter(Boolean).length;
 const trendKey=m.trend.state==='up'?'coachTrendUp':m.trend.state==='down'?'coachTrendDown':'coachTrendStable';
 const componentRows=[
  ['coachAccuracy',m.accuracy],
  ['coachCoverage',m.coverage],
  ['coachExam',m.examScore],
  ['coachBridge',m.bridgeScore],
  ['coachConsistency',m.consistency],
  ['coachReview',m.review]
 ];
 return [
  `<div class="section-title"><div><h2>🧠 ${esc(t('mdmCoach'))}</h2><p>${esc(t('mdmCoachSub'))}</p></div><span class="badge official">${esc(t('coachFoundation'))}</span></div>`,
  `<div class="coach-offline-banner"><span>🔒</span><div><strong>${esc(t('coachOffline'))}</strong><p>${esc(t('coachOfflineText'))}</p></div></div>`,
  `<button class="coach-recovery-launch" data-go="recoverycoach"><span>🩺</span><div><strong>${esc(t('coachRecovery'))}</strong><small>${esc(t('coachRecoverySub'))}</small></div><b>›</b></button>`,
  `<button class="coach-recovery-launch zero-launch" data-go="zeroerror"><span>🚦</span><div><strong>${esc(t('zeroErrorMode'))}</strong><small>${esc(t('zeroErrorSub'))}</small></div><b>›</b></button>`,
  `<section class="coach-hero"><div class="coach-score-ring" style="--coach-score:${m.confidence}"><div><strong>${m.confidence}%</strong><span>${esc(t('confidenceScore'))}</span></div></div><div><span>${esc(t('confidenceMeaning'))}</span><h3>${esc(t(coachConfidenceLabel(m.confidence)))}</h3><p>${esc(t(trendKey))}</p><small>${m.points} ${esc(t('coachDataPoints'))}</small></div></section>`,
  `<div class="coach-prediction-grid"><article><span>${esc(t('predictionToday'))}</span><strong>${m.todayChance}%</strong></article><article><span>${esc(t('predictionWeek'))}</span><strong>${m.weekChance}%</strong></article></div>`,
  `<p class="coach-disclaimer">${esc(t('predictionDisclaimer'))}</p>`,
  `<div class="coach-insight-grid"><article class="card"><span>${esc(t('coachWeakness'))}</span><h3>${insight.weakness.topic.icon} ${esc(t(insight.weakness.topic.title))}</h3><p>${insight.weakness.values.accuracy}% • ${insight.weakness.values.coverage}%</p></article><article class="card"><span>${esc(t('coachStrength'))}</span><h3>${insight.strength.topic.icon} ${esc(t(insight.strength.topic.title))}</h3><p>${insight.strength.values.accuracy}% • ${insight.strength.values.coverage}%</p></article></div>`,
  `<div class="card coach-next-card"><span>${esc(t('coachNextMove'))}</span><h3>${insight.next.icon} ${esc(t(insight.next.title))}</h3><p>${esc(t(insight.next.reason))}</p><button class="btn" data-go="${esc(insight.next.route)}">${esc(t('roadmapDoNow'))}</button></div>`,
  `<div class="card coach-components-card"><h3>${esc(t('coachScoreComponents'))}</h3><div class="coach-component-list">${componentRows.map(row=>`<div><span>${esc(t(row[0]))}</span><i><b style="width:${row[1]}%"></b></i><strong>${row[1]}%</strong></div>`).join('')}</div><details><summary>${esc(t('coachExplain'))}</summary><p>${esc(t('coachExplainText'))}</p></details></div>`,
  `<div class="section-title"><div><h2>${esc(t('dailyMission'))}</h2><p>${esc(t('dailyMissionSub'))}</p></div><strong>${missionDone}/3</strong></div>`,
  `<div class="coach-mission-card ${coachState.missionDone?'complete':''}">${mission.map(item=>`<article><button class="coach-mission-check ${coachState.missionSteps[item.id]?'done':''}" data-coach-mission="${item.id}">${coachState.missionSteps[item.id]?'✓':'○'}</button><span>${item.icon}</span><div><strong>${esc(t(item.label))}</strong><small>${esc(item.detail)}</small></div><button class="coach-mission-open" data-go="${item.route}">›</button></article>`).join('')}<div class="coach-mission-footer"><span>${esc(t('missionProgress'))}: ${missionDone}/3</span>${coachState.missionDone?`<strong>🎉 ${esc(t('missionComplete'))}</strong>`:''}</div></div>`,
  `<button class="text-danger-button coach-reset" id="resetCoachMission">${esc(t('coachReset'))}</button>`,
  `<div class="section-title"><div><h2>${esc(t('coachAchievements'))}</h2><p>${esc(t('coachAchievementsSub'))}</p></div></div>`,
  `<div class="coach-achievement-grid">${achievements.map(item=>`<article class="${item.done?'done':'locked'}"><span>${item.icon}</span><strong>${esc(t(item.label))}</strong><small>${item.done?'✓':esc(t('achievementLocked'))}</small></article>`).join('')}</div>`
 ].join('');
}
function investorPreviewViewHtml(){
 return [
  `<div class="section-title"><div><h2>💼 ${esc(t('investorPreview'))}</h2><p>${esc(t('investorPreviewSub'))}</p></div><span class="badge partner-badge">Build 18</span></div>`,
  `<section class="investor-hero"><div class="investor-logo">MDM</div><div><span>MALTA DRIVING MASTER</span><h1>${esc(t('premiumTagline'))}</h1><p>${esc(t('investorStatusText'))}</p></div></section>`,
  `<div class="investor-metric-grid"><article><strong>250</strong><span>${esc(t('investorActiveQuestions'))}</span></article><article><strong>12+</strong><span>${esc(t('investorCoreModules'))}</span></article><article><strong>3</strong><span>${esc(t('investorLanguages'))}</span></article><article><strong>2</strong><span>${esc(t('investorUserTypes'))}</span></article></div>`,
  `<div class="investor-story-grid"><article><span>01</span><h3>${esc(t('investorProblem'))}</h3><p>${esc(t('investorProblemText'))}</p></article><article><span>02</span><h3>${esc(t('investorSolution'))}</h3><p>${esc(t('investorSolutionText'))}</p></article><article><span>03</span><h3>${esc(t('investorDifferentiator'))}</h3><p>${esc(t('investorDifferentiatorText'))}</p></article><article><span>04</span><h3>${esc(t('investorScale'))}</h3><p>${esc(t('investorScaleText'))}</p></article></div>`,
  `<div class="investor-value-grid"><article><span>🎓</span><h3>${esc(t('investorStudentValue'))}</h3><p>${esc(t('investorStudentPoints'))}</p></article><article><span>🏢</span><h3>${esc(t('investorSchoolValue'))}</h3><p>${esc(t('investorSchoolPoints'))}</p></article></div>`,
  `<div class="card investor-architecture-card"><h3>${esc(t('investorArchitecture'))}</h3><p>${esc(t('investorArchitectureText'))}</p></div>`,
  `<div class="investor-actions"><button class="btn" id="shareInvestorPreview">↗ ${esc(t('investorShare'))}</button><button class="btn secondary" id="copyInvestorPreview">⧉ ${esc(t('investorCopy'))}</button></div>`
 ].join('');
}

const views={
 errorreplay:()=>errorReplayViewHtml(),
 cloudready:()=>cloudReadyViewHtml(),
 missions:()=>missionViewHtml(),
 aiinstructor:()=>aiInstructorViewHtml(),
 instructorportal:()=>instructorPortalViewHtml(),
 schoolportal2:()=>schoolPortalViewHtml(),
 zeroerror:()=>zeroErrorViewHtml(),
 examday:()=>examDayViewHtml(),
 recoverycoach:()=>recoveryViewHtml(),
 coach:()=>coachViewHtml(),
 investorpreview:()=>investorPreviewViewHtml(),
 onboarding:()=>`<section class="onboarding-shell"><div class="onboarding-brand"><div class="onboarding-logo">MDM</div><span>${esc(t('onboardingLocalOnly'))}</span><h1>${esc(t('onboardingWelcome'))}</h1><p>${esc(t('onboardingWelcomeSub'))}</p></div><div class="onboarding-panel"><h2>${esc(t('onboardingChooseRole'))}</h2><div class="onboarding-role-grid"><label data-onboarding-role class="${onboarding.role==='student'?'selected':''}"><input type="radio" name="onboardingRole" value="student" ${onboarding.role==='student'?'checked':''}><span>🎓</span><strong>${esc(t('onboardingStudent'))}</strong><small>${esc(t('onboardingStudentSub'))}</small></label><label data-onboarding-role class="${onboarding.role==='school'?'selected':''}"><input type="radio" name="onboardingRole" value="school" ${onboarding.role==='school'?'checked':''}><span>🏢</span><strong>${esc(t('onboardingSchool'))}</strong><small>${esc(t('onboardingSchoolSub'))}</small></label><label data-onboarding-role class="${onboarding.role==='both'?'selected':''}"><input type="radio" name="onboardingRole" value="both" ${onboarding.role==='both'?'checked':''}><span>🤝</span><strong>${esc(t('onboardingBoth'))}</strong><small>${esc(t('onboardingBothSub'))}</small></label></div><div class="onboarding-data-card"><div><span>🔒</span><div><h3>${esc(t('onboardingDataTitle'))}</h3><p>${esc(t('onboardingDataText'))}</p></div></div><ul><li>${esc(t('onboardingNoTracking'))}</li><li>${esc(t('privacyNoAutomaticUpload'))}</li><li>${esc(t('onboardingOfficialWarning'))}</li></ul></div><div class="onboarding-consents"><label><input type="checkbox" id="onboardingStorage" ${onboarding.acceptedLocalStorage?'checked':''}><span>${esc(t('onboardingRequiredStorage'))} *</span></label><label><input type="checkbox" id="onboardingTerms" ${onboarding.acceptedTerms?'checked':''}><span>${esc(t('onboardingTerms'))} *</span></label><label class="optional"><input type="checkbox" id="onboardingUpdates" ${onboarding.optionalUpdates?'checked':''}><span>${esc(t('onboardingUpdates'))}</span></label></div><button class="btn onboarding-continue" id="completeOnboarding">${esc(t('onboardingContinue'))}</button><p class="onboarding-privacy-link"><button data-go="privacycenter">${esc(t('privacyOpenCenter'))}</button></p></div></section>`,
 privacycenter:()=>{const summary=privacyDataSummary();const cards=[['privacyProfileData',summary.profileCount,'privacyProfileComplete'],['privacyStudyData',summary.studyCount,'privacyStudyRecords'],['privacyPassportData',summary.passportCount,'privacyPassportChecks'],['privacyRoadmapData',personalRoadmap.targetDate?1:0,'privacyItems'],['privacySchoolData',summary.schoolCount,'privacySchoolRecords'],['privacyPreferencesData',Object.values(privacyPreferences).filter(Boolean).length,'privacyItems']];return `<div class="section-title"><div><h2>🔒 ${esc(t('privacyCenter'))}</h2><p>${esc(t('privacyCenterSub'))}</p></div><span class="privacy-checked">${esc(t('privacyChecked'))}: ${PRIVACY_INFORMATION_CHECKED}</span></div><div class="privacy-local-banner"><span>📱</span><div><strong>${esc(t('privacyStoredLocally'))}</strong><p>${esc(t('privacySentOnlyByAction'))}. ${esc(t('privacyNoAutomaticUpload'))}.</p></div></div><div class="privacy-summary-grid">${cards.map(([label,count,unit])=>`<article><span>${esc(t(label))}</span><strong>${count}</strong><small>${esc(t(unit))}</small></article>`).join('')}</div><div class="card privacy-explain-card"><h3>${esc(t('privacyStorageNecessary'))}</h3><p>${esc(t('privacyStorageExplanation'))}</p><div class="privacy-role-row"><span>${esc(t('privacyRole'))}</span><strong>${esc(onboardingRoleLabel(onboarding.role))}</strong></div><button class="btn secondary" id="privacyRestartOnboarding">${esc(t('privacyRestartOnboarding'))}</button></div><div class="card privacy-export-card"><h3>${esc(t('privacyExportTitle'))}</h3><p>${esc(t('privacyExportText'))}</p><button class="btn" id="privacyExportAll">${esc(t('privacyExportAll'))}</button></div><div class="card privacy-preferences-card"><h3>${esc(t('privacyConsentSettings'))}</h3><p>${esc(t('privacyNotActive'))}</p><label><input type="checkbox" id="privacyAnalytics" ${privacyPreferences.analytics?'checked':''}><span>${esc(t('privacyAnalytics'))}</span></label><label><input type="checkbox" id="privacyMarketing" ${privacyPreferences.marketing?'checked':''}><span>${esc(t('privacyMarketing'))}</span></label><button class="btn secondary" id="privacySavePreferences">${esc(t('privacySavePreferences'))}</button></div><div class="card privacy-delete-card"><h3>${esc(t('privacyDeleteTitle'))}</h3><p>${esc(t('privacyDeleteText'))}</p><div class="privacy-delete-grid"><button data-delete-privacy="study">${esc(t('privacyDeleteStudy'))}</button><button data-delete-privacy="profile">${esc(t('privacyDeleteProfile'))}</button><button data-delete-privacy="passport">${esc(t('privacyDeletePassport'))}</button><button data-delete-privacy="roadmap">${esc(t('privacyDeleteRoadmap'))}</button><button data-delete-privacy="school">${esc(t('privacyDeleteSchool'))}</button></div><button class="btn danger privacy-delete-all" id="privacyDeleteAll">${esc(t('privacyDeleteAll'))}</button></div><div class="card privacy-request-card"><h3>${esc(t('privacyRequestTitle'))}</h3><p>${esc(t('privacyRequestText'))}</p><div class="privacy-request-actions"><button class="btn secondary" data-privacy-request="access">${esc(t('privacyRequestAccess'))}</button><button class="btn secondary" data-privacy-request="correction">${esc(t('privacyRequestCorrection'))}</button><button class="btn secondary" data-privacy-request="erasure">${esc(t('privacyRequestErasure'))}</button></div><p class="privacy-rights">${esc(t('privacyRightsNotice'))}</p><strong>${esc(t('privacyContactController'))}: ${esc(ADMIN_EMAIL)}</strong></div><div class="privacy-legal-note">${esc(t('privacyLegalDraft'))}</div>`},

 home:()=>{const day=dailyStats(),review=reviewStats(),next=roadmapNextAction();return `${profileReminderHtml()}<section class="premium-home-welcome"><div><span>${esc(t('premiumWelcomeBack'))}</span><h2>${esc(premiumUserName())}</h2><p>${esc(t('premiumTrust'))}</p></div><div class="premium-home-badge">MDM</div></section><section class="premium-focus-card"><div><span>${esc(t('premiumTodayFocus'))}</span><h3>${next.icon} ${esc(t(next.title))}</h3><p>${esc(t(next.reason))}</p></div><button class="btn" data-go="${esc(next.route)}">${esc(t('premiumContinue'))}</button></section><section class="hero"><h1>${esc(t('brandSlogan'))}</h1><p>${esc(t('welcome'))}</p><div class="malta-line"><span class="malta-dot"></span><span>Malta • English • Italiano • Malti</span></div></section><button class="daily-banner ${day.complete?'complete':''}" data-go="dailysetup"><div class="daily-ring" style="--daily:${Math.round(day.done/day.goal*100)}"><strong>${day.done}/${day.goal}</strong></div><div><span>${esc(t('today'))}</span><h2>${esc(day.complete?t('dailyComplete'):t('dailyPlan'))}</h2><p>${esc(t('dailyPlanSub'))}</p></div><strong class="daily-streak">🔥 ${day.streak}</strong></button><div class="section-title"><div><h2>${esc(t('continue'))}</h2><p>${esc(t('database'))}: ${Q.length} ${esc(t('questions'))}</p></div><span class="badge official">${esc(t('official'))}</span></div><section class="grid"><button class="home-card" data-go="lptv"><span class="card-icon">🚘</span><div><h3>${esc(t('lptv'))}</h3><p>${esc(t('lptvSub'))}</p></div></button><button class="home-card guided-home" data-go="studysetup"><span class="card-icon">📘</span><div><h3>${esc(t('guidedStudy'))}</h3><p>${esc(t('guidedStudyDetail'))}</p></div></button><button class="home-card review-home" data-go="reviewsetup"><span class="card-icon">⏳</span><div><h3>${esc(t('scheduledReview'))}</h3><p>${review.due} ${esc(t('dueNow'))}</p></div></button><button class="home-card library-home" data-go="questionlibrary"><span class="card-icon">🗂️</span><div><h3>${esc(t('questionLibrary'))}</h3><p>${esc(t('questionLibrarySub'))}</p></div></button><button class="home-card bridge-home" data-go="bridgesetup"><span class="card-icon">🌉</span><div><h3>${esc(t('bridgeTest'))}</h3><p>${esc(t('bridgeTestSub'))}</p></div></button><button class="home-card coach-home" data-go="coach"><span class="card-icon">🧠</span><div><h3>${esc(t('mdmCoach'))}</h3><p>${esc(t('mdmCoachSub'))}</p></div></button><button class="home-card recovery-home" data-go="recoverycoach"><span class="card-icon">🩺</span><div><h3>${esc(t('coachRecovery'))}</h3><p>${esc(t('coachRecoverySub'))}</p></div></button><button class="home-card exam-day-home" data-go="examday"><span class="card-icon">🎯</span><div><h3>${esc(t('examDayMode'))}</h3><p>${esc(t('examDayModeSub'))}</p></div></button><button class="home-card zero-error-home" data-go="zeroerror"><span class="card-icon">🚦</span><div><h3>${esc(t('zeroErrorMode'))}</h3><p>${esc(t('zeroErrorSub'))}</p></div></button><button class="home-card roadmap-home" data-go="roadmap"><span class="card-icon">🗺️</span><div><h3>${esc(t('personalRoadmap'))}</h3><p>${esc(t('personalRoadmapSub'))}</p></div></button><button class="home-card passport-home" data-go="passport"><span class="card-icon">🧭</span><div><h3>${esc(t('lptvPassport'))}</h3><p>${esc(t('lptvPassportSub'))}</p></div></button><button class="home-card school-home" data-go="schools"><span class="card-icon">🏫</span><div><h3>${esc(t('findSchool'))}</h3><p>${esc(t('findSchoolSub'))}</p></div></button><button class="home-card school-partner-home" data-go="schoolpartner"><span class="card-icon">🤝</span><div><h3>${esc(t('schoolPartner'))}</h3><p>${esc(t('schoolPartnerSub'))}</p></div></button><button class="home-card school-dashboard-home" data-go="schooldashboard"><span class="card-icon">🏢</span><div><h3>${esc(t('schoolDashboard'))}</h3><p>${esc(t('schoolDashboardSub'))}</p></div></button><button class="home-card school-portal2-home" data-go="schoolportal2"><span class="card-icon">🏫</span><div><h3>${esc(t('schoolPortal2'))}</h3><p>${esc(t('schoolPortal2Sub'))}</p></div></button><button class="home-card error-replay-home" data-go="errorreplay"><span class="card-icon replay-card-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 10h24a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6Z"/><path d="m20 18 12 8-12 8Z"/></svg></span><div><h3>${esc(t('errorReplay'))}</h3><p>${esc(t('errorReplaySub'))}</p></div></button><button class="home-card cloud-ready-home" data-go="cloudready"><span class="card-icon">☁️</span><div><h3>${esc(t('cloudReady'))}</h3><p>${esc(t('cloudReadySub'))}</p></div></button><button class="home-card missions-home" data-go="missions"><span class="card-icon">🎯</span><div><h3>${esc(t('missions'))}</h3><p>${esc(t('missionsSub'))}</p></div></button><button class="home-card ai-instructor-home" data-go="aiinstructor"><span class="card-icon">🧠</span><div><h3>${esc(t('aiInstructor'))}</h3><p>${esc(t('aiInstructorSub'))}</p></div></button><button class="home-card instructor-portal-home" data-go="instructorportal"><span class="card-icon">👨‍🏫</span><div><h3>${esc(t('instructorPortal'))}</h3><p>${esc(t('instructorPortalSub'))}</p></div></button><button class="home-card coach" data-go="vocabulary"><span class="card-icon">🔤</span><div><h3>${esc(t('englishCoach'))}</h3><p>${esc(t('englishCoachSub'))}</p></div></button><button class="home-card saved" data-go="favourites"><span class="card-icon">★</span><div><h3>${esc(t('savedQuestions'))}</h3><p>${progress.favourites.length} ${esc(t('questions'))}</p></div></button><button class="home-card red" data-go="licences"><span class="card-icon">🪪</span><div><h3>${esc(t('licences'))}</h3><p>${esc(t('licencesSub'))}</p></div></button><button class="home-card stone" data-go="roadcode"><span class="card-icon">📘</span><div><h3>${esc(t('roadCode'))}</h3><p>${esc(t('roadCodeSub'))}</p></div></button><button class="home-card green" data-go="regulations"><span class="card-icon">⚖️</span><div><h3>${esc(t('regulations'))}</h3><p>${esc(t('regulationsSub'))}</p></div></button><button class="home-card purple" data-go="assistant"><span class="card-icon">✦</span><div><h3>${esc(t('ai'))}</h3><p>${esc(t('aiSub'))}</p></div></button><button class="home-card" data-go="profile"><span class="card-icon">◎</span><div><h3>${esc(t('profile'))}</h3><p>${esc(t('progress'))} • ${esc(t('language'))}</p></div></button><button class="home-card help-home" data-go="help"><span class="card-icon">?</span><div><h3>${esc(t('helpSupport'))}</h3><p>${esc(t('helpSupportSub'))}</p></div></button></section>`},
 lptv:()=>{const session=load(SESSION,null),ready=readinessStats(),day=dailyStats(),review=reviewStats();return `<div class="section-title"><div><h2>${esc(t('lptv'))}</h2><p>${Q.length} ${esc(t('questions'))}</p></div><span class="readiness-mini">${ready.score}%</span></div><div class="stack">${session&&session.list?.length?`<button class="big-action green" id="resumeBtn"><div>${esc(t('resume'))}<small>${esc(modeLabel(session.mode))} • ${session.index+1}/${session.list.length}</small></div><span>▶</span></button>`:''}<button class="big-action daily-action" data-go="dailysetup"><div>${esc(t('dailyPlan'))}<small>${day.done}/${day.goal} • 🔥 ${day.streak} ${esc(t('days'))}</small></div><span>${day.complete?'✓':'☀️'}</span></button><button class="big-action green guided-primary" data-go="studysetup"><div>${esc(t('guidedStudy'))}<small>${esc(t('guidedStudyDetail'))}</small></div><span>📘</span></button><button class="big-action bridge-action" data-go="bridgesetup"><div>${esc(t('bridgeTest'))}<small>${esc(t('bridgeTestSub'))}</small></div><span>🌉</span></button><button class="big-action review-action" data-go="reviewsetup"><div>${esc(t('scheduledReview'))}<small>${review.due} ${esc(t('dueNow'))} • ${review.mastered} ${esc(t('mastered'))}</small></div><span>⏳</span></button><button class="big-action library-action" data-go="questionlibrary"><div>${esc(t('questionLibrary'))}<small>${esc(t('questionLibrarySub'))}</small></div><span>🗂️</span></button><button class="big-action chapter-action" data-go="chapters"><div>${esc(t('fourChapters'))}<small>${esc(t('fourChaptersSub'))}</small></div><span>🧭</span></button><button class="big-action weak-action" data-go="weaksetup"><div>${esc(t('weakAttack'))}<small>${esc(t('weakAttackSub'))}</small></div><span>⚡</span></button><button class="big-action coach-action" data-go="vocabulary"><div>${esc(t('englishCoach'))}<small>${progress.knownWords.length}/${GLOSSARY.length} ${esc(t('words'))}</small></div><span>🔤</span></button><button class="big-action saved-action" data-go="favourites"><div>${esc(t('savedQuestions'))}<small>${progress.favourites.length} ${esc(t('questions'))}</small></div><span>★</span></button><button class="big-action assisted" data-go="assistedsetup"><div>${esc(t('assistedSimulation'))}<small>${esc(t('assistedDetail'))}</small></div><span>📝</span></button><button class="big-action red" data-go="examsetup"><div>${esc(t('examCentre'))}<small>${esc(t('examCentreSub'))}</small></div><span>🎯</span></button><button class="big-action secondary" id="wrongBtn"><div>${esc(t('errors'))}<small>${countWrong()} ${esc(t('questions'))}</small></div><span>↻</span></button><button class="big-action secondary" data-go="progress"><div>${esc(t('progress'))}<small>${ready.score}% • ${esc(t(ready.label))}</small></div><span>📊</span></button></div>`},
 examsetup:()=>`<div class="card exam-setup-card"><span class="mode-pill exam">🎯 ${esc(t('examCentre'))}</span><h2>${esc(t('realExamPieta'))}</h2><p class="muted">${esc(t('examCentreSub'))}</p><div class="exam-rule-grid"><div><strong>35</strong><span>${esc(t('examRuleQuestions'))}</span></div><div><strong>45:00</strong><span>${esc(t('examRuleTime'))}</span></div><div><strong>30/35</strong><span>${esc(t('examRulePass'))}</span></div></div><div class="bank-audit"><h3>✓ ${esc(t('bankAuditTitle'))}</h3><p>${esc(t('bankAuditText'))}</p><p>${esc(t('bankExcludedText'))}</p><small>${esc(t('bankDisclaimer'))}</small></div><div class="exam-instructions"><h3>${esc(t('examInstructions'))}</h3><p>✓ ${esc(t('examRuleEnglish'))}</p><p>✓ ${esc(t('examRuleNavigation'))}</p><p>✓ ${esc(t('examPassTarget'))}</p></div><button class="big-action red" id="startRealExam"><div>${esc(t('startRealExam'))}</div><span>▶</span></button></div>`,
 studysetup:()=>{const cats=[...new Set(Q.map(q=>q.category))].sort();return `<div class="card setup-card"><span class="mode-pill guided">${esc(t('guidedMode'))}</span><h2>${esc(t('guidedStudy'))}</h2><p class="muted">${esc(t('guidedStudyDetail'))}</p><label>${esc(t('bankScope'))}</label><select id="studyBank"><option value="all">${esc(t('bankAll'))} (${Q.length})</option><option value="core">${esc(t('bankCore'))} (${CORE_Q.length})</option><option value="road">${esc(t('bankRoad'))} (${ROAD_SAFETY_Q.length})</option></select><label>${esc(t('chooseTopic'))}</label><select id="studyCategory"><option value="ALL">${esc(t('allTopics'))}</option>${cats.map(c=>`<option>${esc(c)}</option>`).join('')}</select><label>${esc(t('questions'))}</label><select id="studyCount"><option>10</option><option selected>20</option><option>35</option><option>50</option></select><button class="big-action green" id="startStudy"><div>${esc(t('start'))}</div><span>▶</span></button></div>`},

 assistedsetup:()=>`<div class="card setup-card"><span class="mode-pill assisted">${esc(t('assistedMode'))}</span><h2>${esc(t('assistedSimulation'))}</h2><p class="muted">${esc(t('assistedDetail'))}</p><div class="exam-rules"><div><span>${esc(t('questions'))}</span><strong>35</strong></div><div><span>${esc(t('translate'))} + ${esc(t('listen'))}</span><strong>✓</strong></div></div><label>${esc(t('chooseTimer'))}</label><select id="assistedTimer"><option value="0">${esc(t('noTimer'))}</option><option value="1800">${esc(t('timer30'))}</option><option value="2700">${esc(t('timer45'))}</option></select><button class="big-action assisted" id="startAssisted"><div>${esc(t('startSimulation'))}</div><span>▶</span></button></div>`,
 chapters:()=>`<div class="section-title"><div><h2>${esc(t('fourChapters'))}</h2><p>${esc(t('fourChaptersSub'))}</p></div></div><div class="topic-grid">${TOPIC_GROUPS.map(topic=>{const st=topicStats(topic.id);return `<button class="topic-card" data-topic="${topic.id}"><div class="topic-icon">${topic.icon}</div><div class="topic-content"><h3>${esc(t(topic.title))}</h3><p>${esc(t(topic.desc))}</p><div class="topic-numbers"><span>${st.seen}/${st.total} ${esc(t('seen'))}</span><strong>${st.accuracy}%</strong></div><div class="mini-bar"><span style="width:${st.coverage}%"></span></div></div><span class="chev">›</span></button>`}).join('')}</div>`,
 chaptersetup:(id)=>{const topic=topicDefinition(id),st=topicStats(id);return `<div class="card setup-card"><span class="mode-pill chapter">${topic.icon} ${esc(t('chapterProgress'))}</span><h2>${esc(t(topic.title))}</h2><p class="muted">${esc(t(topic.desc))}</p><div class="chapter-summary"><div><span>${esc(t('chapterQuestions'))}</span><strong>${st.total}</strong></div><div><span>${esc(t('seen'))}</span><strong>${st.seen}</strong></div><div><span>${esc(t('chapterAccuracy'))}</span><strong>${st.accuracy}%</strong></div></div><label>${esc(t('questions'))}</label><select id="chapterCount"><option value="10">10</option><option value="20" selected>20</option><option value="35">35</option><option value="all">${esc(t('allChapterQuestions'))}</option></select><button class="big-action chapter-action" id="startChapter" data-topic="${topic.id}"><div>${esc(t('startChapter'))}</div><span>▶</span></button></div>`},
 weaksetup:()=>{const pool=adaptivePool(35);return `<div class="card setup-card"><span class="mode-pill weak">⚡ ${esc(t('diagnostic'))}</span><h2>${esc(t('adaptiveTraining'))}</h2><p class="muted">${esc(t('adaptiveTrainingDesc'))}</p><div class="chapter-summary"><div><span>${esc(t('availableWeak'))}</span><strong>${pool.length}</strong></div><div><span>${esc(t('errors'))}</span><strong>${countWrong()}</strong></div><div><span>${esc(t('accuracy'))}</span><strong>${stats().accuracy}%</strong></div></div><label>${esc(t('questions'))}</label><select id="weakCount"><option value="10">10</option><option value="20" selected>20</option><option value="35">35</option></select><button class="big-action weak-action" id="startWeak"><div>${esc(t('startWeak'))}</div><span>⚡</span></button></div>`},
 dailysetup:()=>{const day=dailyStats();return `<div class="card setup-card"><span class="mode-pill daily">☀️ ${esc(t('dailyPlan'))}</span><h2>${esc(day.complete?t('dailyComplete'):t('dailyPlanSub'))}</h2><div class="daily-detail"><div class="daily-ring large" style="--daily:${Math.round(day.done/day.goal*100)}"><strong>${day.done}/${day.goal}</strong><span>${esc(t('dailyGoal'))}</span></div><div><p><b>${esc(t('dailyDone'))}:</b> ${day.done}/${day.goal}</p><p><b>${esc(t('streak'))}:</b> 🔥 ${day.streak} ${esc(t('days'))}</p><p class="muted">${esc(t('adaptiveTrainingDesc'))}</p></div></div><button class="big-action daily-action" id="startDaily"><div>${esc(day.complete?t('repeatDaily'):t('startDaily'))}</div><span>▶</span></button></div>`},
 vocabulary:()=>`<div class="section-title"><div><h2>${esc(t('englishCoach'))}</h2><p>${progress.knownWords.length}/${GLOSSARY.length} ${esc(t('knownWords'))}</p></div></div><div class="coach-menu"><button class="coach-menu-card" data-go="phrasebook"><span>💬</span><div><h3>${esc(t('phrasebook'))}</h3><p>${esc(t('phrasebookSub'))}</p></div></button><button class="coach-menu-card" data-go="flashcards"><span>🃏</span><div><h3>${esc(t('flashcards'))}</h3><p>${esc(t('flashcardsSub'))}</p></div></button></div><div class="search-box"><input id="vocabularySearch" placeholder="${esc(t('vocabularySearch'))}" autocomplete="off"><button id="vocabularySearchBtn">⌕</button></div><div class="vocabulary-chips"><button data-vocabulary-chip="road">Road</button><button data-vocabulary-chip="brake">Brake</button><button data-vocabulary-chip="passenger">Passenger</button><button data-vocabulary-chip="hazard">Hazard</button><button data-vocabulary-chip="">Tutte</button></div><div id="vocabularyResults" class="vocabulary-list"></div>`,
 favourites:()=>{const list=savedQuestions();return `<div class="section-title"><div><h2>${esc(t('savedQuestions'))}</h2><p>${list.length} ${esc(t('questions'))}</p></div></div>`+(list.length?`<div class="list">${list.map(q=>`<article class="saved-question"><button class="saved-open" data-qid="${esc(q.id)}"><span class="badge">${esc(q.category)}</span><h3>${esc(q.question)}</h3><p>${esc(q.question_it)}</p></button><button class="saved-remove" data-remove-saved="${esc(q.id)}" aria-label="${esc(t('removeSaved'))}">★</button></article>`).join('')}</div>`:`<div class="card empty-state"><div>☆</div><h3>${esc(t('noSavedQuestions'))}</h3><p>${esc(t('savedQuestionsSub'))}</p></div>`)},
 reviewsetup:()=>{const stats=reviewStats(),due=dueQuestions(),preview=due.slice(0,5);return `<div class="section-title"><div><h2>${esc(t('scheduledReview'))}</h2><p>${esc(t('scheduledReviewSub'))}</p></div><span class="review-count">${stats.due}</span></div><div class="review-overview"><div><span>${esc(t('dueNow'))}</span><strong>${stats.due}</strong></div><div><span>${esc(t('masteredQuestions'))}</span><strong>${stats.mastered}</strong></div><div><span>${esc(t('reviewedQuestions'))}</span><strong>${stats.scheduled}</strong></div></div><div class="card review-system-card"><h3>${esc(t('reviewSystem'))}</h3><p>${esc(t('reviewSystemSub'))}</p>${stats.due?`<button class="big-action review-action" id="startScheduledReview"><div>${esc(t('startReview'))}</div><span>▶</span></button>`:`<div class="review-empty"><span>✓</span><h3>${esc(t('noReviewDue'))}</h3><p>${esc(stats.next?reviewDateLabel(stats.next):t('nextReviewNone'))}</p></div>`}</div>${preview.length?`<div class="card" style="margin-top:14px"><h3>${esc(t('reviewReady'))}</h3>${preview.map(q=>`<button class="review-preview" data-review-question="${esc(q.id)}"><span>${esc(q.category)}</span><strong>${esc(q.question)}</strong><small>${esc(q.question_it)}</small></button>`).join('')}</div>`:''}<button class="big-action library-action" data-go="questionlibrary"><div>${esc(t('questionLibrary'))}</div><span>🗂️</span></button>`},
 questionlibrary:()=>`<div class="section-title"><div><h2>${esc(t('questionLibrary'))}</h2><p>${esc(t('questionLibrarySub'))}</p></div></div><div class="library-controls"><div class="search-box"><input id="librarySearch" placeholder="${esc(t('librarySearch'))}" autocomplete="off"><button id="librarySearchButton">⌕</button></div><div class="library-filter-grid"><label>${esc(t('filterBank'))}<select id="libraryBank"><option value="all">${esc(t('bankAll'))} (${Q.length})</option><option value="core">${esc(t('bankCore'))} (${CORE_Q.length})</option><option value="road">${esc(t('bankRoad'))} (${ROAD_SAFETY_Q.length})</option></select></label><label>${esc(t('filterChapter'))}<select id="libraryTopic"><option value="all">${esc(t('allChapters'))}</option>${TOPIC_GROUPS.map(topic=>`<option value="${topic.id}">${topic.icon} ${esc(t(topic.title))}</option>`).join('')}</select></label><label>${esc(t('filterStatus'))}<select id="libraryStatus"><option value="all">${esc(t('statusAll'))}</option><option value="unseen">${esc(t('statusUnseen'))}</option><option value="wrong">${esc(t('statusWrong'))}</option><option value="saved">${esc(t('statusSaved'))}</option><option value="due">${esc(t('statusDue'))}</option><option value="mastered">${esc(t('statusMastered'))}</option></select></label></div><button class="btn secondary library-reset" id="libraryReset">${esc(t('resetFilters'))}</button></div><div class="library-result-head"><strong id="libraryResultCount"></strong><span>${esc(t('resultsCount'))}</span></div><div id="libraryResults" class="question-library-list"></div><button class="btn secondary library-more hidden" id="libraryMore">${esc(t('loadMore'))}</button>`,
 phrasebook:()=>`<div class="section-title"><div><h2>${esc(t('phrasebook'))}</h2><p>${progress.knownPhrases.length}/${PHRASEBOOK.length} ${esc(t('learnedPhrases'))}</p></div></div><div class="search-box"><input id="phraseSearch" placeholder="${esc(t('phraseSearch'))}" autocomplete="off"><button id="phraseSearchButton">⌕</button></div><div id="phraseResults" class="phrase-list"></div>`,
 flashcards:()=>`<div class="section-title"><div><h2>${esc(t('flashcards'))}</h2><p>${esc(t('flashcardsSub'))}</p></div></div><div class="flash-direction"><button data-flash-direction="en-it">${esc(t('englishToItalian'))}</button><button data-flash-direction="it-en">${esc(t('italianToEnglish'))}</button></div><div id="flashcardHost"></div>`,
 examdetail:()=>{const index=Number(route.data),exam=(progress.exams||[])[index];if(!exam)return `<div class="card"><h2>${esc(t('examNotFound'))}</h2><button class="btn" data-go="progress">${esc(t('backToProgress'))}</button></div>`;const items=examDetailItems(exam),wrongItems=items.filter(item=>!item.ok),correctItems=items.filter(item=>item.ok),flaggedItems=items.filter(item=>item.flagged);return `<div class="section-title"><div><h2>${esc(t('examDetails'))}</h2><p>${esc(formatExamDate(exam.date))}</p></div><span class="exam-score-pill ${exam.score>=30?'pass':'fail'}">${exam.score}/${exam.total}</span></div><div class="exam-detail-summary"><div><strong>${correctItems.length||exam.score}</strong><span>${esc(t('correctQuestions'))}</span></div><div><strong>${wrongItems.length||(exam.total-exam.score)}</strong><span>${esc(t('wrongQuestions'))}</span></div><div><strong>${exam.unanswered||0}</strong><span>${esc(t('unansweredQuestions'))}</span></div><div><strong>${flaggedItems.length||exam.flagged||0}</strong><span>${esc(t('flaggedQuestions'))}</span></div></div><div class="report-actions"><button class="btn" id="shareExamReport">↗ ${esc(t('shareExamReport'))}</button><button class="btn secondary" id="copyExamReport">⧉ ${esc(t('copyProgressReport'))}</button></div>${items.length?`<div class="exam-detail-list">${items.map((item,position)=>{const selected=item.selected.length?item.selected.map(i=>item.q.answers[i]).join(' • '):t('noAnswerSelected');const correct=item.q.correct.map(i=>item.q.answers[i]).join(' • ');return `<article class="exam-answer-card ${item.ok?'correct':'wrong'}"><div class="exam-answer-head"><span>${position+1}</span><div><small>${esc(item.q.id)} • ${esc(item.q.category)}</small><strong>${item.ok?'✓ '+esc(t('correct')):'✗ '+esc(item.answered?t('wrong'):t('unanswered'))}</strong></div>${item.flagged?'<b>★</b>':''}</div><h3>${esc(item.q.question)}</h3><p class="exam-answer-it">🇮🇹 ${esc(item.q.question_it)}</p><div class="exam-choice selected"><span>${esc(t('selectedAnswer'))}</span><strong>${esc(selected)}</strong></div>${!item.ok?`<div class="exam-choice correct"><span>${esc(t('rightAnswer'))}</span><strong>${esc(correct)}</strong></div>`:''}</article>`}).join('')}</div>`:`<div class="card old-exam-notice"><span>ℹ</span><p>${esc(t('oldExamSummary'))}</p></div>`}<div class="exam-detail-actions"><button class="btn secondary" data-go="progress">${esc(t('backToProgress'))}</button><button class="btn" id="retryExamMistakes">${esc(t('retryExamErrors'))}</button></div>`},
 bridgesetup:()=>{const latest=latestBridgeResult();return `<div class="section-title"><div><h2>🌉 ${esc(t('bridgeTest'))}</h2><p>${esc(t('bridgeTestSub'))}</p></div></div><div class="card bridge-intro-card"><p>${esc(t('bridgeIntro'))}</p><div class="bridge-flow"><div><span>1</span><strong>🇮🇹 ${esc(t('italianPhase'))}</strong></div><b>→</b><div><span>2</span><strong>🇬🇧 ${esc(t('englishPhase'))}</strong></div><b>→</b><div><span>3</span><strong>🧭 ${esc(t('bridgeMeaning'))}</strong></div></div><label>${esc(t('bridgeQuestions'))}</label><select id="bridgeCount"><option value="10" selected>10</option><option value="20">20</option></select><button class="big-action bridge-action" id="startBridge"><div>${esc(t('bridgeStart'))}</div><span>▶</span></button><p class="bridge-disclaimer">${esc(t('bridgeNotOfficial'))}</p></div>${latest?bridgeProgressHtml():''}`},
 bridgequiz:()=>`<div class="card bridge-quiz-card"><div class="bridge-quiz-head"><span id="bridgePhase" class="mode-label"></span><b id="bridgeCounter"></b></div><div class="progress"><span id="bridgeProgress"></span></div><p class="bridge-no-help">${esc(t('bridgeNoHelp'))}</p><div id="bridgeQuestion" class="question"></div><div id="bridgeInstruction" class="quiz-instruction"></div><div id="bridgeOptions"></div><div class="actions quiz-footer"><button class="btn secondary" id="bridgeExit">${esc(t('exit'))}</button><button class="btn" id="bridgeConfirm">${esc(t('confirmBridge'))}</button></div></div>`,
 bridgeresult:()=>{const r=bridgeResultById(route.data);if(!r)return `<div class="card"><h2>${esc(t('noBridgeYet'))}</h2><button class="btn" data-go="bridgesetup">${esc(t('bridgeStart'))}</button></div>`;return `<div class="section-title"><div><h2>🌉 ${esc(t('bridgeResults'))}</h2><p>${esc(formatExamDate(r.date))}</p></div><span class="bridge-result-score">${r.masteredPct}%</span></div><div class="bridge-result-grid"><div><strong>${r.knowledgePct}%</strong><span>${esc(t('knowledgeScore'))}</span></div><div><strong>${r.englishPct}%</strong><span>${esc(t('englishScore'))}</span></div><div><strong>${r.masteredIds.length}/${r.total}</strong><span>${esc(t('masteredConcepts'))}</span></div><div><strong>${r.languageIds.length}</strong><span>${esc(t('languageBarrier'))}</span></div><div><strong>${r.ruleIds.length}</strong><span>${esc(t('ruleGap'))}</span></div><div><strong>${r.recoveredIds.length}</strong><span>${esc(t('recoveredEnglish'))}</span></div></div><div class="bridge-diagnosis"><article class="mastered"><span>✓</span><div><h3>${esc(t('masteredConcepts'))}</h3><p>${esc(t('bridgeMasteredMeaning'))}</p></div></article><article class="language"><span>🔤</span><div><h3>${esc(t('languageBarrier'))}: ${r.languageIds.length}</h3><p>${esc(t('bridgeLanguageMeaning'))}</p></div></article><article class="rule"><span>📘</span><div><h3>${esc(t('ruleGap'))}: ${r.ruleIds.length}</h3><p>${esc(t('bridgeRuleMeaning'))}</p></div></article></div><div class="bridge-result-actions">${r.languageIds.length?`<button class="btn" id="trainBridgeLanguage">${esc(t('trainLanguageBarrier'))}</button>`:''}${r.ruleIds.length?`<button class="btn" id="trainBridgeRules">${esc(t('trainRuleGaps'))}</button>`:''}<button class="btn secondary" data-go="bridgesetup">${esc(t('repeatBridge'))}</button><button class="btn secondary" data-go="progress">${esc(t('backToProgress'))}</button></div><p class="bridge-disclaimer">${esc(t('bridgeNotOfficial'))}</p>`},
 help:()=>{const installed=isStandaloneMode();return `<div class="section-title"><div><h2>${esc(t('helpSupport'))}</h2><p>${esc(t('helpSupportSub'))}</p></div><span class="badge official">Build ${esc(BUILD_VERSION)}</span></div>${helpInstallHtml()}<div class="card quick-guide-card" style="margin-top:14px"><div class="help-card-title"><div><h3>${esc(t('quickGuide'))}</h3><p>${esc(t('quickGuideSub'))}</p></div><span>↗</span></div><div class="quick-guide-grid"><button data-go="studysetup"><span>📘</span><strong>${esc(t('openStudy'))}</strong><small>${esc(t('guideStudy'))}</small></button><button data-go="examsetup"><span>🎯</span><strong>${esc(t('openExam'))}</strong><small>${esc(t('guideExam'))}</small></button><button data-go="progress"><span>📊</span><strong>${esc(t('openProgress'))}</strong><small>${esc(t('guideProgress'))}</small></button><button data-go="profile"><span>👤</span><strong>${esc(t('openProfile'))}</strong><small>${esc(t('guideProfile'))}</small></button></div></div><div class="card faq-card" style="margin-top:14px"><h3>${esc(t('frequentQuestions'))}</h3><details><summary>${esc(t('faqBankQ'))}</summary><p>${esc(t('faqBankA'))}</p></details><details><summary>${esc(t('faqOfflineQ'))}</summary><p>${esc(t('faqOfflineA'))}</p></details><details><summary>${esc(t('faqDataQ'))}</summary><p>${esc(t('faqDataA'))}</p></details><details><summary>${esc(t('faqUpdateQ'))}</summary><p>${esc(t('faqUpdateA'))}</p></details><details><summary>${esc(t('faqDeleteQ'))}</summary><p>${esc(t('faqDeleteA'))}</p></details></div><div class="card support-card" style="margin-top:14px"><div class="help-card-title"><div><h3>${esc(t('reportProblem'))}</h3><p>${esc(t('reportProblemSub'))}</p></div><span>🛠</span></div><div class="support-form"><label><span>${esc(t('supportCategory'))}</span><select id="supportCategory"><option value="technical">${esc(t('supportTechnical'))}</option><option value="question">${esc(t('supportQuestion'))}</option><option value="registration">${esc(t('supportRegistration'))}</option><option value="suggestion">${esc(t('supportSuggestion'))}</option></select></label><label><span>${esc(t('questionIdOptional'))}</span><input id="supportQuestionId" maxlength="40" placeholder="LPTV.188"></label><label class="full"><span>${esc(t('problemDescription'))}</span><textarea id="supportDescription" maxlength="1800" placeholder="${esc(t('problemPlaceholder'))}"></textarea></label></div><div class="support-method-grid"><button class="btn" id="shareSupportReport">↗ ${esc(t('shareReport'))}</button><button class="btn secondary" id="openSupportGmail">G ${esc(t('openSupportGmail'))}</button><button class="btn secondary" id="openSupportMail">✉ ${esc(t('openSupportMail'))}</button><button class="btn secondary" id="copySupportReport">⧉ ${esc(t('copySupportReport'))}</button></div><p class="support-contact">${esc(t('contactSupport'))}: <strong>${esc(ADMIN_EMAIL)}</strong></p></div><div class="card privacy-summary-card" style="margin-top:14px"><span>🔒</span><div><h3>${esc(t('privacySummary'))}</h3><p>${esc(t('privacySummaryText'))}</p></div><button class="btn secondary" data-go="profile">${esc(t('openProfile'))}</button></div>`},



 roadmap:()=>{const component=roadmapComponentStats(),action=roadmapNextAction(),target=roadmapTargetState(),pace=roadmapStudyPace(),weak=roadmapWeakestTopic(),bridge=latestBridgeResult(),passport=passportRequiredStats(),achievements=roadmapAchievements(),doneAchievements=achievements.filter(item=>item.done).length,week=roadmapWeekPlan();return `<div class="section-title"><div><h2>🗺️ ${esc(t('personalRoadmap'))}</h2><p>${esc(t('personalRoadmapSub'))}</p></div><span class="roadmap-version">Build 14</span></div><div class="roadmap-disclaimer">${esc(t('roadmapInternalEstimate'))}</div><section class="roadmap-hero"><div class="roadmap-main-score" style="--roadmap-score:${component.overall}"><div><strong>${component.overall}%</strong><span>${esc(t('roadmapJourneyScore'))}</span></div></div><div class="roadmap-hero-copy"><span>${esc(t(roadmapOverallLabel(component.overall)))}</span><h3>${esc(t(action.title))}</h3><p>${esc(t(action.reason))}</p><button class="btn" data-go="${esc(action.route)}">${action.icon} ${esc(t('roadmapDoNow'))}</button></div></section><section class="roadmap-component-grid"><article><span>📘</span><div><strong>${component.readiness.score}%</strong><small>${esc(t('roadmapStudyScore'))}</small></div><i><b style="width:${component.readiness.score}%"></b></i></article><article><span>🌉</span><div><strong>${component.bridgeScore}%</strong><small>${esc(t('roadmapEnglishScore'))}</small></div><i><b style="width:${component.bridgeScore}%"></b></i></article><article><span>🧭</span><div><strong>${component.passport.pct}%</strong><small>${esc(t('roadmapPassportScore'))}</small></div><i><b style="width:${component.passport.pct}%"></b></i></article><article><span>🔥</span><div><strong>${component.dailyScore}%</strong><small>${esc(t('roadmapDailyScore'))}</small></div><i><b style="width:${component.dailyScore}%"></b></i></article></section><div class="roadmap-detail-grid"><article class="card roadmap-next-card"><div class="roadmap-card-heading"><div><span>${esc(t('roadmapNextAction'))}</span><h3>${action.icon} ${esc(t(action.title))}</h3></div>${action.detail?`<strong>${esc(action.detail)}</strong>`:''}</div><p><b>${esc(t('roadmapWhy'))}:</b> ${esc(t(action.reason))}</p><button class="btn" data-go="${esc(action.route)}">${esc(t('roadmapDoNow'))}</button></article><article class="card roadmap-target-card"><span>${esc(t('roadmapTargetDate'))}</span><strong>${personalRoadmap.targetDate?esc(passportDateLabel(personalRoadmap.targetDate)):esc(t('roadmapNoTarget'))}</strong><p class="${target.type}">${esc(target.text)}</p><div class="roadmap-pace"><b>${pace.remaining}</b><span>${esc(t('roadmapQuestionsLeft'))}</span><b>${pace.sessions}</b><span>${esc(t('roadmapSessions'))}</span></div></article></div><div class="card roadmap-metrics-card"><h3>${esc(t('roadmapCurrentProgress'))}</h3><div class="roadmap-metrics"><div><span>${esc(t('roadmapCoverage'))}</span><strong>${component.readiness.coverage}%</strong></div><div><span>${esc(t('roadmapAccuracy'))}</span><strong>${component.readiness.accuracy}%</strong></div><div><span>${esc(t('roadmapExamAverage'))}</span><strong>${component.readiness.examAverage}%</strong></div><div><span>${esc(t('roadmapBridgeProgress'))}</span><strong>${bridge?bridge.masteredPct+'%':'—'}</strong></div><div><span>${esc(t('roadmapPassportProgress'))}</span><strong>${passport.done}/${passport.total}</strong></div><div><span>${esc(t('roadmapWeakestTopic'))}</span><strong>${esc(t(weak.topic.title))}</strong><small>${weak.values.accuracy}%</small></div></div></div><div class="section-title roadmap-week-title"><div><h2>${esc(t('roadmapWeek'))}</h2><p>${esc(t('roadmapWeekSub'))}</p></div></div><div class="roadmap-week-list">${week.map(item=>`<button class="roadmap-day ${item.recommended?'recommended':''}" data-go="${esc(item.route)}"><span class="roadmap-day-date">${esc(roadmapDayLabel(item.day))}</span><i>${item.icon}</i><div><strong>${esc(t(item.title))}</strong>${item.detail?`<small>${esc(item.detail)}</small>`:''}</div>${item.recommended?`<b>${esc(t('roadmapRecommended'))}</b>`:'<em>›</em>'}</button>`).join('')}</div><div class="card roadmap-achievements-card"><div class="roadmap-card-heading"><div><span>${esc(t('roadmapAchievementsSub'))}</span><h3>${esc(t('roadmapAchievements'))}</h3></div><strong>${doneAchievements}/${achievements.length}</strong></div><div class="roadmap-achievements">${achievements.map(item=>`<div class="${item.done?'done':'locked'}"><i>${item.icon}</i><span>${esc(t(item.label))}</span><small>${item.done?'✓':esc(t('roadmapLocked'))}</small></div>`).join('')}</div></div><div class="card roadmap-settings-card"><h3>${esc(t('roadmapSettings'))}</h3><div class="roadmap-settings-grid"><label><span>${esc(t('roadmapTargetDate'))}</span><input id="roadmapTargetDate" type="date" value="${esc(personalRoadmap.targetDate)}"></label><label><span>${esc(t('roadmapDailyMinutes'))}</span><select id="roadmapDailyMinutes">${[10,15,20,30,45,60,90,120].map(value=>`<option value="${value}" ${Number(personalRoadmap.dailyMinutes)===value?'selected':''}>${value}</option>`).join('')}</select></label><label><span>${esc(t('roadmapStudyDays'))}</span><select id="roadmapStudyDays">${[1,2,3,4,5,6,7].map(value=>`<option value="${value}" ${Number(personalRoadmap.studyDays)===value?'selected':''}>${value}</option>`).join('')}</select></label><label><span>${esc(t('roadmapMainGoal'))}</span><select id="roadmapMainGoal"><option value="exam" ${personalRoadmap.mainGoal==='exam'?'selected':''}>${esc(t('roadmapGoalExam'))}</option><option value="tag" ${personalRoadmap.mainGoal==='tag'?'selected':''}>${esc(t('roadmapGoalTag'))}</option></select></label></div><div class="roadmap-settings-actions"><button class="btn" id="saveRoadmap">${esc(t('roadmapSavePlan'))}</button><button class="btn secondary" id="shareRoadmap">↗ ${esc(t('roadmapShare'))}</button><button class="btn secondary" id="copyRoadmap">⧉ ${esc(t('roadmapCopy'))}</button></div></div><button class="text-danger-button roadmap-reset" id="resetRoadmap">${esc(t('roadmapReset'))}</button>`},
 passport:()=>{const stats=passportRequiredStats(),eligibility=passportLicenceEligibility(),earliest=passportEarliestExpiry(),days=earliest?passportDaysUntil(earliest.value):null;const eligibilityText=eligibility.state==='unknown'?t('passportEligibilityUnknown'):eligibility.state==='licence'?t('passportLicenceTooNew'):eligibility.state==='points'?t('passportPointsBlocked'):t('passportBasicEligible');return `<div class="section-title"><div><h2>🧭 ${esc(t('lptvPassport'))}</h2><p>${esc(t('lptvPassportSub'))}</p></div><span class="passport-build">Build 13</span></div><div class="passport-update"><span>!</span><div><strong>${esc(t('passportOfficialUpdate'))}</strong><p>${esc(t('passportOfficialUpdateText'))}</p><small>${esc(t('passportChecked'))}: ${PASSPORT_OFFICIAL_CHECKED}</small></div></div><div class="card passport-config-card"><div class="passport-config-grid"><label><span>${esc(t('passportMode'))}</span><select id="passportMode"><option value="new" ${lptvPassport.mode==='new'?'selected':''}>${esc(t('passportNew'))}</option><option value="renewal" ${lptvPassport.mode==='renewal'?'selected':''}>${esc(t('passportRenewal'))}</option></select></label><label><span>${esc(t('passportApplicantType'))}</span><select id="passportApplicantType"><option value="maltese" ${lptvPassport.applicantType==='maltese'?'selected':''}>${esc(t('passportMaltese'))}</option><option value="eu" ${lptvPassport.applicantType==='eu'?'selected':''}>${esc(t('passportEU'))}</option><option value="tcn" ${lptvPassport.applicantType==='tcn'?'selected':''}>${esc(t('passportTCN'))}</option></select></label><label class="full"><span>${esc(t('passportStatus'))}</span><select id="passportStatus"><option value="planning" ${lptvPassport.status==='planning'?'selected':''}>${esc(t('passportPlanning'))}</option><option value="collecting" ${lptvPassport.status==='collecting'?'selected':''}>${esc(t('passportCollecting'))}</option><option value="ready" ${lptvPassport.status==='ready'?'selected':''}>${esc(t('passportReady'))}</option><option value="submitted" ${lptvPassport.status==='submitted'?'selected':''}>${esc(t('passportSubmitted'))}</option><option value="eligibility" ${lptvPassport.status==='eligibility'?'selected':''}>${esc(t('passportEligibilityLetter'))}</option><option value="waiting" ${lptvPassport.status==='waiting'?'selected':''}>${esc(t('passportWaiting'))}</option><option value="issued" ${lptvPassport.status==='issued'?'selected':''}>${esc(t('passportIssued'))}</option></select></label></div></div><div class="passport-progress-card"><div><span>${esc(t('passportCurrentProgress'))}</span><strong id="passportProgressValue">${stats.done}/${stats.total} • ${stats.pct}%</strong></div><div class="passport-progress-track"><span id="passportProgressBar" style="width:${stats.pct}%"></span></div><small>${esc(t('passportRequiredComplete'))}</small></div>${lptvPassport.mode==='new'?`<div class="card passport-eligibility-card ${eligibility.eligible?'good':'attention'}"><div class="passport-card-heading"><div><h3>${esc(t('passportEligibility'))}</h3><p>${esc(eligibilityText)}</p></div><span>${eligibility.eligible?'✓':'!'}</span></div><div class="passport-eligibility-grid"><label><span>${esc(t('passportLicenceSince'))}</span><input id="passportLicenceSince" type="date" value="${esc(lptvPassport.licenceSince)}"></label><label><span>${esc(t('passportPenaltyPoints'))}</span><input id="passportPenaltyPoints" type="number" min="0" max="99" inputmode="numeric" value="${esc(lptvPassport.penaltyPoints)}"></label></div>${eligibility.date?`<div class="eligible-date"><span>${esc(t('passportEligibleDate'))}</span><strong>${esc(passportDateLabel(eligibility.date))}</strong></div>`:''}</div>`:''}<div class="card passport-checklist-card"><div class="passport-card-heading"><div><h3>${esc(t('passportChecklist'))}</h3><p>${esc(t('passportChecklistSub'))}</p></div><span>✓</span></div>${passportChecklistHtml()}</div><div class="card passport-dates-card"><div class="passport-card-heading"><div><h3>${esc(t('passportDates'))}</h3><p>${esc(t('passportDatesSub'))}</p></div><span>📅</span></div><div class="passport-date-grid"><label><span>${esc(t('passportDrivingExpiry'))}</span><input id="passportDrivingExpiry" type="date" value="${esc(lptvPassport.dates.drivingLicence)}"></label><label><span>${esc(t('passportResidenceExpiry'))}</span><input id="passportResidenceExpiry" type="date" value="${esc(lptvPassport.dates.residence)}"></label><label><span>${esc(t('passportEmploymentExpiry'))}</span><input id="passportEmploymentExpiry" type="date" value="${esc(lptvPassport.dates.employment)}"></label><label><span>${esc(t('passportOperatorExpiry'))}</span><input id="passportOperatorExpiry" type="date" value="${esc(lptvPassport.dates.operatorLicence)}"></label><label><span>${esc(t('passportTagExpiry'))}</span><input id="passportTagExpiry" type="date" value="${esc(lptvPassport.dates.tagExpiry)}"></label><label><span>${esc(t('passportMedicalDate'))}</span><input id="passportMedicalDate" type="date" value="${esc(lptvPassport.dates.medical)}"></label><label><span>${esc(t('passportApplicationDate'))}</span><input id="passportApplicationDate" type="date" value="${esc(lptvPassport.dates.application)}"></label></div><div class="passport-earliest ${days!==null&&days<30?'urgent':''}"><span>${esc(t('passportEarliestExpiry'))}</span><strong>${earliest?`${esc(t(earliest.label))}: ${esc(passportDateLabel(earliest.value))}`:esc(t('passportNoExpiry'))}</strong>${earliest?`<small>${days<0?Math.abs(days)+' '+esc(t('days'))+' '+esc(t('passportExpired')):days+' '+esc(t('passportDaysRemaining'))}</small>`:''}</div><button class="btn passport-calendar-btn" id="createPassportCalendar">📅 ${esc(t('passportCalendar'))}</button><p class="muted">${esc(t('passportCalendarSub'))}</p><p class="passport-koder-note"><strong>${esc(t('passportKoderFix'))}:</strong> ${esc(t('passportCalendarOpenSafariNote'))}</p></div><div class="passport-rule-grid"><article><span>⚖️</span><p>${esc(t('passportValidityRule'))}</p></article><article><span>ℹ</span><p>${esc(lptvPassport.mode==='new'?t('passportFeeNew'):t('passportFeeRenew'))}</p></article>${lptvPassport.applicantType==='tcn'?`<article><span>!</span><p>${esc(t('passportTagNotPermission'))}</p></article>`:''}</div><div class="card passport-notes-card"><h3>${esc(t('passportNotes'))}</h3><textarea id="passportNotes" maxlength="3000">${esc(lptvPassport.notes)}</textarea><p class="muted">${esc(t('passportNoBackend'))}</p></div><div class="passport-actions"><button class="btn" id="savePassport">${esc(t('passportSave'))}</button><button class="btn secondary" id="sharePassport">↗ ${esc(t('passportShare'))}</button><button class="btn secondary" id="copyPassport">⧉ ${esc(t('passportCopy'))}</button></div><div class="card passport-official-card"><h3>${esc(t('passportOfficialDocuments'))}</h3><p>${esc(t('passportOfficialWarning'))}</p><div class="passport-official-grid">${passportOfficialLinksHtml()}</div><div class="passport-office-box"><strong>${esc(t('passportSubmissionOffices'))}</strong><p>${esc(t('passportSubmissionText'))}</p></div></div><button class="text-danger-button passport-reset" id="resetPassport">${esc(t('passportReset'))}</button>`},
 schools:()=>`<div class="section-title"><div><h2>🏫 ${esc(t('findSchool'))}</h2><p>${esc(t('schoolMarketplaceSub'))}</p></div><span class="badge demo-school">${esc(t('studentArea'))}</span></div><div class="school-demo-notice"><span>ℹ</span><p>${esc(t('schoolDemoNotice'))}</p></div><div class="card school-filter-card"><div class="school-filter-title"><div><h3>${esc(t('yourPreferences'))}</h3><p>${esc(t('smartMatchDiagnosis'))}</p></div><span>🧭</span></div><div class="school-filter-grid"><label><span>${esc(t('preferredArea'))}</span><select id="schoolAreaFilter"><option value="all">${esc(t('areaAll'))}</option><option value="north">${esc(t('areaNorth'))}</option><option value="central">${esc(t('areaCentral'))}</option><option value="south">${esc(t('areaSouth'))}</option><option value="gozo">${esc(t('areaGozo'))}</option></select></label><label><span>${esc(t('preferredLanguage'))}</span><select id="schoolLanguageFilter"><option value="any">${esc(t('languageAny'))}</option><option value="en">English</option><option value="it">Italiano</option><option value="mt">Malti</option></select></label><label><span>${esc(t('courseNeeded'))}</span><select id="schoolCourseFilter"><option value="any">${esc(t('allTopics'))}</option><option value="lptv">${esc(t('courseLptv'))}</option><option value="b">${esc(t('courseB'))}</option></select></label><label><span>${esc(t('transmission'))}</span><select id="schoolTransmissionFilter"><option value="any">${esc(t('transmissionAny'))}</option><option value="automatic">${esc(t('automatic'))}</option><option value="manual">${esc(t('manual'))}</option></select></label><label><span>${esc(t('preferredSchedule'))}</span><select id="schoolScheduleFilter"><option value="any">${esc(t('scheduleAny'))}</option><option value="day">${esc(t('daytime'))}</option><option value="evening">${esc(t('evening'))}</option><option value="weekend">${esc(t('weekend'))}</option></select></label></div><div class="school-support-checks"><label><input type="checkbox" id="schoolEnglishFilter"><span>${esc(t('englishSupport'))}</span></label><label><input type="checkbox" id="schoolDocumentFilter"><span>${esc(t('documentSupport'))}</span></label></div><div class="school-filter-actions"><button class="btn" id="updateSchoolMatches">${esc(t('updateMatches'))}</button><button class="btn secondary" id="openSchoolCompare">${esc(t('compareSchools'))} (${schoolCompare.length}/3)</button></div></div><div class="smart-match-trust"><div><strong>${esc(t('smartMatch'))}</strong><span>${esc(t('smartMatchSub'))}</span></div><b>${esc(t('sponsoredExplanation'))}</b></div><div class="school-result-heading"><strong id="schoolCount">0</strong><span>${esc(t('schoolsFound'))}</span></div><div id="schoolResults" class="school-list"></div>`,
 schooldetail:()=>{const school=schoolById(route.data);if(!school)return `<div class="card"><h2>${esc(t('noResults'))}</h2><button class="btn" data-go="schools">${esc(t('back'))}</button></div>`;const match=schoolMatchDetails(school),selected=schoolCompare.includes(school.id);return `<div class="section-title"><div><h2>${esc(t('schoolDetails'))}</h2><p>${esc(schoolAreaLabel(school.area))}</p></div><div class="match-score large"><strong>${match.score}%</strong><span>${esc(t('matchScore'))}</span></div></div><div class="school-demo-notice"><span>ℹ</span><p>${esc(t('schoolDemoNotice'))}</p></div><article class="school-detail-card"><div class="school-badges"><span class="badge demo-school">${esc(t('demoProfile'))}</span>${school.sponsored?`<span class="badge sponsored-school">${esc(t('sponsored'))}</span>`:''}</div><h2>${esc(school.name)}</h2><p class="school-description">${esc(schoolDescription(school))}</p>${match.reasons.length?`<div class="detail-match-reasons"><h3>${esc(t('whyMatched'))}</h3>${match.reasons.map(reason=>`<span>✓ ${esc(reason)}</span>`).join('')}</div>`:''}<div class="school-detail-grid"><div><span>${esc(t('languagesSpoken'))}</span><strong>${school.languages.map(schoolLanguageLabel).join(', ')}</strong></div><div><span>${esc(t('coursesOffered'))}</span><strong>${school.courses.map(schoolCourseLabel).join(', ')}</strong></div><div><span>${esc(t('transmission'))}</span><strong>${school.transmission.map(schoolTransmissionLabel).join(', ')}</strong></div><div><span>${esc(t('availability'))}</span><strong>${school.schedule.map(schoolScheduleLabel).join(', ')}</strong></div></div><div class="detail-services"><h3>${esc(t('servicesOffered'))}</h3>${school.services.map(service=>`<span>✓ ${esc(schoolServiceLabel(service))}</span>`).join('')}</div><div class="school-pricing-box"><span>${esc(t('pricingBySchool'))}</span><strong>${esc(t('pricingPending'))}</strong></div><button class="btn secondary compare-detail-button ${selected?'selected':''}" id="detailSchoolCompare">${selected?'✓ '+esc(t('removeFromCompare')):esc(t('addToCompare'))}</button></article><div class="card school-request-card"><h3>${esc(t('requestInformation'))}</h3><p>${esc(t('pilotRequestNotice'))}</p><div class="request-method-grid"><button class="btn" id="shareSchoolRequest">↗ ${esc(t('shareRegistration'))}</button><button class="btn secondary" id="gmailSchoolRequest">G ${esc(t('openGmail'))}</button><button class="btn secondary" id="mailSchoolRequest">✉ ${esc(t('openMail'))}</button><button class="btn secondary" id="copySchoolRequest">⧉ ${esc(t('copyRegistration'))}</button></div></div>`},
 schoolcompare:()=>{const schools=schoolCompare.map(schoolById).filter(Boolean);return `<div class="section-title"><div><h2>${esc(t('compareSchools'))}</h2><p>${schools.length}/3</p></div><span class="badge official">${esc(t('smartMatch'))}</span></div>${schools.length?`<div class="school-compare-grid">${schools.map(school=>{const match=schoolMatchDetails(school);return `<article class="compare-school-card"><button class="compare-remove" data-remove-compare="${esc(school.id)}">×</button><span class="badge demo-school">${esc(t('demoProfile'))}</span><h3>${esc(school.name)}</h3><div class="match-score"><strong>${match.score}%</strong><span>${esc(t('matchScore'))}</span></div><dl><dt>${esc(t('schoolAreaTitle'))}</dt><dd>${esc(schoolAreaLabel(school.area))}</dd><dt>${esc(t('languagesSpoken'))}</dt><dd>${esc(school.languages.map(schoolLanguageLabel).join(', '))}</dd><dt>${esc(t('coursesOffered'))}</dt><dd>${esc(school.courses.map(schoolCourseLabel).join(', '))}</dd><dt>${esc(t('transmission'))}</dt><dd>${esc(school.transmission.map(schoolTransmissionLabel).join(', '))}</dd><dt>${esc(t('availability'))}</dt><dd>${esc(school.schedule.map(schoolScheduleLabel).join(', '))}</dd><dt>${esc(t('servicesOffered'))}</dt><dd>${esc(school.services.map(schoolServiceLabel).join(', '))}</dd></dl><button class="btn" data-go="schooldetail" data-id="${esc(school.id)}">${esc(t('schoolDetails'))}</button></article>`}).join('')}</div><button class="btn secondary clear-school-comparison" id="clearSchoolComparison">${esc(t('clearComparison'))}</button>`:`<div class="card comparison-empty"><span>⚖️</span><h3>${esc(t('comparisonEmpty'))}</h3><button class="btn" data-go="schools">${esc(t('findSchool'))}</button></div>`}`},

 schooldashboard:()=>{const profile=dashboardProfileCompletion(),stats=dashboardStats();return `<div class="section-title"><div><h2>🏢 ${esc(t('schoolDashboard'))}</h2><p>${esc(t('schoolDashboardSub'))}</p></div><span class="badge partner-badge">${esc(t('schoolDashboardLocal'))}</span></div><button class="school-portal2-launch" data-go="schoolportal2"><span>🏫</span><div><strong>${esc(t('schoolPortal2'))}</strong><small>${esc(t('schoolPortal2Sub'))}</small></div><b>›</b></button><div class="school-dashboard-notice"><span>🔒</span><div><strong>${esc(t('schoolDashboardLocal'))}</strong><p>${esc(t('schoolDashboardNotice'))}</p></div></div><section class="dashboard-profile-card"><div class="dashboard-profile-top"><div><span>${esc(t('dashboardProfile'))}</span><h2>${esc(dashboardSchoolName())}</h2><p>${esc(t('dashboardReviewNeeded'))}</p></div><div class="dashboard-profile-ring" style="--profile:${profile.pct}"><strong>${profile.pct}%</strong><span>${esc(t('dashboardProfileCompletion'))}</span></div></div><div class="dashboard-verification-row"><span>${esc(t('dashboardVerification'))}</span><strong>${esc(t('dashboardNotVerified'))}</strong><em>${esc(profile.pct>=80?t('dashboardReadyReview'):t('dashboardDraftStatus'))}</em></div><div class="dashboard-profile-actions"><button class="btn" data-go="schoolpartner">${esc(t('dashboardEditProfile'))}</button></div></section><div class="dashboard-stat-grid"><article><span>👤</span><strong>${stats.students}</strong><small>${esc(t('dashboardStudents'))}</small></article><article><span>👥</span><strong>${stats.groups}</strong><small>${esc(t('dashboardGroups'))}</small></article><article><span>✉</span><strong>${stats.invites}</strong><small>${esc(t('dashboardInvites'))}</small></article><article><span>📈</span><strong>${stats.average}%</strong><small>${esc(t('dashboardAverage'))}</small></article></div><div class="card dashboard-preview-card"><div class="dashboard-section-heading"><div><h3>${esc(t('dashboardPublicPreview'))}</h3><p>${esc(t('dashboardPublicPreviewSub'))}</p></div><span>👁</span></div>${dashboardProfilePreviewHtml()}</div><div class="card dashboard-groups-card"><div class="dashboard-section-heading"><div><h3>${esc(t('dashboardGroups'))}</h3><p>${esc(t('dashboardGroupCount'))}: ${stats.groups}</p></div><span>👥</span></div><div class="dashboard-create-group"><div class="dashboard-form-grid"><label><span>${esc(t('dashboardGroupName'))} *</span><input id="dashboardGroupName" maxlength="100"></label><label><span>${esc(t('dashboardGroupLanguage'))}</span><select id="dashboardGroupLanguage"><option value="en">English</option><option value="it">Italiano</option><option value="mt">Malti</option></select></label><label><span>${esc(t('dashboardGroupSchedule'))}</span><select id="dashboardGroupSchedule"><option value="day">${esc(t('daytime'))}</option><option value="evening">${esc(t('evening'))}</option><option value="weekend">${esc(t('weekend'))}</option></select></label><label><span>${esc(t('dashboardGroupNotes'))}</span><input id="dashboardGroupNotes" maxlength="600"></label></div><button class="btn" id="dashboardSaveGroup">${esc(t('dashboardSaveGroup'))}</button></div><div class="dashboard-group-list">${dashboardGroupCardsHtml()}</div></div><div class="card dashboard-students-card"><div class="dashboard-section-heading"><div><h3>${esc(t('dashboardStudents'))}</h3><p>${esc(t('dashboardManualData'))}</p></div><span>🎓</span></div><details class="dashboard-add-details"><summary>${esc(t('dashboardAddStudent'))}</summary>${dashboardStudentFormHtml()}</details><div class="dashboard-student-list">${dashboardStudentCardsHtml()}</div></div><div class="card dashboard-invites-card"><div class="dashboard-section-heading"><div><h3>${esc(t('dashboardGenerateInvite'))}</h3><p>${esc(t('dashboardInviteWarning'))}</p></div><span>✉</span></div><div class="dashboard-invite-create"><label><span>${esc(t('dashboardInviteGroup'))}</span><select id="dashboardInviteGroup">${dashboardGroupOptions()}</select></label><button class="btn" id="dashboardCreateInvite">${esc(t('dashboardCreateInvite'))}</button></div><div class="dashboard-invite-list">${dashboardInviteCardsHtml()}</div></div><div class="card dashboard-notes-card"><h3>${esc(t('dashboardSchoolNotes'))}</h3><textarea id="dashboardSchoolNotes" maxlength="3000">${esc(schoolDashboard.schoolNotes||'')}</textarea><button class="btn secondary" id="dashboardSaveNotes">${esc(t('dashboardSaveNotes'))}</button></div><div class="card dashboard-reports-card"><div class="dashboard-section-heading"><div><h3>${esc(t('dashboardReports'))}</h3><p>${esc(t('dashboardReportsSub'))}</p></div><span>📊</span></div><div class="dashboard-report-actions"><button class="btn" id="dashboardShareReport">↗ ${esc(t('dashboardShareReport'))}</button><button class="btn secondary" id="dashboardCopyReport">⧉ ${esc(t('dashboardCopyReport'))}</button><button class="btn secondary" id="dashboardExportCsv">CSV ${esc(t('dashboardExportCsv'))}</button></div></div><div class="dashboard-privacy-box"><span>🛡</span><div><strong>${esc(t('dashboardPrivacy'))}</strong><p>${esc(t('dashboardPrivacyText'))}</p></div></div><div class="card dashboard-demo-card"><div><h3>${esc(t('dashboardDemoData'))}</h3><p>${esc(t('dashboardDemoDataSub'))}</p></div><button class="btn secondary" id="dashboardLoadDemo">${esc(t('dashboardLoadDemo'))}</button></div><button class="text-danger-button dashboard-clear" id="dashboardClear">${esc(t('dashboardClear'))}</button>`},
 schoolpartner:()=>`<div class="section-title"><div><h2>🤝 ${esc(t('schoolPartner'))}</h2><p>${esc(t('schoolPartnerSub'))}</p></div><span class="badge partner-badge">${esc(t('schoolAreaTitle'))}</span></div><div class="school-demo-notice partner"><span>🔒</span><p>${esc(t('noRealSchoolYet'))} ${esc(t('commercialTerms'))}.</p></div><button class="dashboard-partner-launch" data-go="schooldashboard"><span>🏢</span><div><strong>${esc(t('openDashboard'))}</strong><small>${esc(t('schoolDashboardSub'))}</small></div><b>›</b></button><div class="partner-plan-grid"><article><span>FREE</span><h3>${esc(t('basicPlan'))}</h3><p>${esc(t('basicPlanSub'))}</p></article><article class="pro"><span>PRO</span><h3>${esc(t('proPlan'))}</h3><p>${esc(t('proPlanSub'))}</p></article><article class="featured"><span>${esc(t('paidServiceLabel'))}</span><h3>${esc(t('featuredPlan'))}</h3><p>${esc(t('featuredPlanSub'))}</p></article></div><div class="card partner-principles"><h3>${esc(t('partnerPrinciples'))}</h3><p>✓ ${esc(t('partnerPrincipleVerify'))}</p><p>✓ ${esc(t('partnerPrincipleFair'))}</p><p>✓ ${esc(t('partnerPrincipleControl'))}</p></div><div class="card partner-form-card"><h3>${esc(t('applySchoolPartner'))}</h3><div class="partner-form-grid"><label><span>${esc(t('schoolName'))} *</span><input id="partnerSchoolName" maxlength="100" value="${esc(schoolPartnerDraft.schoolName)}"></label><label><span>${esc(t('permitReference'))} *</span><input id="partnerPermit" maxlength="100" value="${esc(schoolPartnerDraft.permit)}"></label><label><span>${esc(t('schoolEmail'))} *</span><input id="partnerEmail" type="email" maxlength="120" value="${esc(schoolPartnerDraft.email)}"></label><label><span>${esc(t('schoolPhone'))}</span><input id="partnerPhone" maxlength="60" value="${esc(schoolPartnerDraft.phone)}"></label><label><span>${esc(t('schoolArea'))}</span><select id="partnerArea"><option value="north" ${schoolPartnerDraft.area==='north'?'selected':''}>${esc(t('areaNorth'))}</option><option value="central" ${schoolPartnerDraft.area==='central'?'selected':''}>${esc(t('areaCentral'))}</option><option value="south" ${schoolPartnerDraft.area==='south'?'selected':''}>${esc(t('areaSouth'))}</option><option value="gozo" ${schoolPartnerDraft.area==='gozo'?'selected':''}>${esc(t('areaGozo'))}</option></select></label><label><span>${esc(t('choosePlan'))}</span><select id="partnerPlan"><option value="basic" ${schoolPartnerDraft.plan==='basic'?'selected':''}>${esc(t('basicPlan'))}</option><option value="pro" ${schoolPartnerDraft.plan==='pro'?'selected':''}>${esc(t('proPlan'))}</option><option value="featured" ${schoolPartnerDraft.plan==='featured'?'selected':''}>${esc(t('featuredPlan'))}</option></select></label></div><fieldset class="partner-checks"><legend>${esc(t('schoolLanguages'))}</legend>${['en','it','mt'].map(code=>`<label><input type="checkbox" value="${code}" data-partner-language ${schoolPartnerDraft.languages.includes(code)?'checked':''}><span>${schoolLanguageLabel(code)}</span></label>`).join('')}</fieldset><fieldset class="partner-checks"><legend>${esc(t('schoolServices'))}</legend>${['english','documents','bridge','progress','vulnerable','pickup'].map(code=>`<label><input type="checkbox" value="${code}" data-partner-service ${schoolPartnerDraft.services.includes(code)?'checked':''}><span>${esc(schoolServiceLabel(code))}</span></label>`).join('')}</fieldset><label class="partner-long-field"><span>${esc(t('schoolPrices'))}</span><textarea id="partnerPrices" maxlength="1000">${esc(schoolPartnerDraft.prices)}</textarea></label><label class="partner-long-field"><span>${esc(t('schoolAvailability'))}</span><textarea id="partnerAvailability" maxlength="600">${esc(schoolPartnerDraft.availability)}</textarea></label><label class="partner-long-field"><span>${esc(t('schoolDescription'))}</span><textarea id="partnerDescription" maxlength="1200">${esc(schoolPartnerDraft.description)}</textarea></label><label class="partner-consent"><input type="checkbox" id="partnerConsent" ${schoolPartnerDraft.consent?'checked':''}><span>${esc(t('partnerConsent'))}</span></label><div class="partner-form-actions"><button class="btn secondary" id="saveSchoolDraft">${esc(t('saveSchoolDraft'))}</button><button class="btn" id="shareSchoolPartner">↗ ${esc(t('sendPartnerApplication'))}</button><button class="btn secondary" id="gmailSchoolPartner">G ${esc(t('openGmail'))}</button><button class="btn secondary" id="mailSchoolPartner">✉ ${esc(t('openMail'))}</button><button class="btn secondary" id="copySchoolPartner">⧉ ${esc(t('copyRegistration'))}</button></div></div>`,
 licences:()=>`<div class="section-title"><div><h2>${esc(t('licences'))}</h2><p>Malta</p></div></div><div class="category-grid">${C.licences.map(x=>`<button class="licence-card" data-licence="${esc(x.code)}"><div style="font-size:27px">${x.icon}</div><strong>${esc(x.code)}</strong><span>${esc(x[settings.lang]||x.en)}</span></button>`).join('')}</div><div class="card" style="margin-top:14px"><span class="badge official">${esc(t('officialSource'))}</span><p class="muted">${esc(t('assistantDisclaimer'))}</p><a class="source-link" href="https://www.transport.gov.mt/land/driving-licence-783" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></div>`,
 roadcode:()=>`<div class="section-title"><div><h2>${esc(t('roadCode'))}</h2><p>${esc(t('categories'))}</p></div></div><div class="list">${C.roadCode.map(x=>`<button class="list-card" data-road="${esc(x.id)}"><span class="list-icon">${x.icon}</span><div><h3>${esc(x[settings.lang]||x.en)}</h3><p>${esc(localized(x,'summary'))}</p></div><span class="chev">›</span></button>`).join('')}</div><div class="card"><span class="badge official">${esc(t('officialSource'))}</span><p class="muted">${esc(t('lastVerified'))}: ${esc(C.meta.verified)}</p><a class="source-link" href="https://www.transport.gov.mt/land/roads-and-traffic-management/road-code-7389" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></div>`,
 regulations:()=>`<div class="section-title"><div><h2>${esc(t('regulations'))}</h2><p>${esc(t('lastVerified'))}: ${esc(C.meta.verified)}</p></div></div><div class="list">${C.regulations.map(x=>`<article class="list-card"><span class="list-icon">${x.icon}</span><div style="flex:1"><span class="badge official">${esc(t('officialSource'))}</span><h3>${esc(x[settings.lang]||x.en)}</h3><p>${esc(localized(x,'desc'))}</p><a class="source-link" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></div></article>`).join('')}</div>`,
 search:()=>`<div class="section-title"><div><h2>${esc(t('search'))}</h2><p>${Q.length} ${esc(t('questions'))}</p></div></div><div class="search-box"><input id="globalSearch" placeholder="${esc(t('searchPlaceholder'))}" autocomplete="off"><button id="searchBtn">⌕</button></div><div id="searchResults" class="list" style="margin-top:14px"></div>`,
 assistant:()=>`<div class="section-title"><div><h2>${esc(t('ai'))}</h2><p>${esc(t('assistantLocal'))}</p></div><span class="badge assistant-offline">${esc(t('assistantOffline'))}</span></div><div class="assistant-trust"><span>🔎</span><p>${esc(t('assistantDisclaimer'))}</p></div><div class="card"><p>${esc(t('assistantIntro'))}</p><strong class="assistant-try">${esc(t('assistantTry'))}:</strong><div class="prompt-chips"><button data-prompt="precedenza rotatoria">${settings.lang==='it'?'Precedenza in rotatoria':'Roundabout priority'}</button><button data-prompt="passeggero anziano">${settings.lang==='it'?'Passeggero anziano':'Elderly passenger'}</button><button data-prompt="guasto tunnel">${settings.lang==='it'?'Guasto nel tunnel':'Tunnel breakdown'}</button><button data-prompt="freni ABS">ABS</button></div><div class="assistant-log" id="assistantLog"><div class="assistant-bubble bot">${esc(t('assistantIntro'))}</div></div><textarea id="assistantInput" placeholder="${esc(t('assistantPlaceholder'))}"></textarea><button class="big-action" id="assistantSend"><div>${esc(t('send'))}</div><span>➤</span></button></div>`,
 profile:()=>{const st=stats(),day=dailyStats(),review=reviewStats();return `<div class="section-title"><div><h2>${esc(t('profileTitle'))}</h2><p>Malta Driving Master</p></div></div>${personalProfileHtml()}<div class="card installed-version-card"><div><span>${esc(t('installedVersion'))}</span><h3>Malta Driving Master — Build ${esc(BUILD_VERSION)}</h3><p>✓ ${esc(t('allModulesUpdated'))}</p></div><strong>${esc(t('releaseDate'))}<br>${esc(BUILD_RELEASE_DATE)}</strong></div><div class="stat-grid"><div class="stat-card"><strong>${st.seen}</strong><span>${esc(t('seen'))}</span></div><div class="stat-card"><strong>${st.accuracy}%</strong><span>${esc(t('accuracy'))}</span></div><div class="stat-card"><strong>${day.streak}</strong><span>${esc(t('streak'))}</span></div><div class="stat-card"><strong>${review.due}</strong><span>${esc(t('dueNow'))}</span></div><div class="stat-card"><strong>${review.mastered}</strong><span>${esc(t('masteredQuestions'))}</span></div><div class="stat-card"><strong>${progress.knownPhrases.length}</strong><span>${esc(t('learnedPhrases'))}</span></div><div class="stat-card"><strong>${st.best ?? '—'}</strong><span>${esc(t('best'))}</span></div></div><div class="card" style="margin-top:14px"><h3>${esc(t('language'))}</h3><select id="profileLang"><option value="en">English</option><option value="it">Italiano</option><option value="mt">Malti</option></select><h3>${esc(t('theme'))}</h3><select id="profileTheme"><option value="system">${esc(t('system'))}</option><option value="light">${esc(t('light'))}</option><option value="dark">${esc(t('dark'))}</option></select></div><div class="card profile-help-card" style="margin-top:14px"><div><h3>${esc(t('helpSupport'))}</h3><p class="muted">${esc(t('installAppSub'))}</p></div><button class="btn" data-go="help">${esc(t('menuHelp'))} ›</button></div><div class="card investor-profile-card" style="margin-top:14px"><div><h3>${esc(t('investorPreview'))}</h3><p class="muted">${esc(t('investorPreviewSub'))}</p></div><button class="btn" data-go="investorpreview">${esc(t('investorOpen'))} ›</button></div><div class="card profile-privacy-card" style="margin-top:14px"><div><h3>${esc(t('privacyCenter'))}</h3><p class="muted">${esc(t('privacyCenterSub'))}</p></div><div class="profile-privacy-actions"><button class="btn" data-go="privacycenter">${esc(t('privacyOpenCenter'))} ›</button><button class="btn secondary" id="replayPremiumIntro">${esc(t('premiumReplay'))}</button></div></div><div class="card backup-card" style="margin-top:14px"><h3>${esc(t('backup'))}</h3><p class="muted">${esc(t('backupSub'))}</p><div class="actions"><button class="btn" id="exportBackup">${esc(t('exportBackup'))}</button><button class="btn secondary" id="importBackup">${esc(t('importBackup'))}</button><input id="backupFile" type="file" accept="application/json,.json" hidden></div></div><div class="card" style="margin-top:14px"><button class="btn danger" id="clearProgress" style="width:100%">${esc(t('clear'))}</button></div>`},
 progress:()=>{const st=stats(),ready=readinessStats(),by=categoryStats(),examEntries=(progress.exams||[]).map((exam,index)=>({exam,index})).slice(-8).reverse();return `<div class="section-title"><div><h2>${esc(t('progress'))}</h2><p>${st.seen}/${Q.length}</p></div></div><div class="stats-fix-note"><span>✓</span><div><strong>${esc(t('statisticsCorrection'))}</strong><small>${esc(t('statisticsCorrectionSub'))}</small></div></div>${bridgeProgressHtml()}${errorDnaHtml()}<div class="readiness-card"><div class="readiness-circle" style="--score:${ready.score}"><div><strong>${ready.score}%</strong><span>${esc(t('readiness'))}</span></div></div><div class="readiness-copy"><h3>${esc(t(ready.label))}</h3><p>${esc(t(ready.recommend))}</p><button class="btn" data-go="${ready.score<68?'weaksetup':'lptv'}">${esc(t('recommended'))}</button></div></div><div class="report-actions"><button class="btn" id="shareProgressReport">↗ ${esc(t('shareProgressReport'))}</button><button class="btn secondary" id="copyProgressReport">⧉ ${esc(t('copyProgressReport'))}</button></div><div class="metric-bars"><div><div class="label"><span>${esc(t('coverage'))}</span><strong>${ready.coverage}%</strong></div><div class="mini-bar"><span style="width:${ready.coverage}%"></span></div></div><div><div class="label"><span>${esc(t('accuracy'))}</span><strong>${ready.accuracy}%</strong></div><div class="mini-bar"><span style="width:${ready.accuracy}%"></span></div></div><div><div class="label"><span>${esc(t('recentAverage'))}</span><strong>${ready.examAverage}%</strong></div><div class="mini-bar"><span style="width:${ready.examAverage}%"></span></div></div></div><div class="stat-grid"><div class="stat-card"><strong>${st.seen}</strong><span>${esc(t('seen'))}</span></div><div class="stat-card"><strong>${st.accuracy}%</strong><span>${esc(t('accuracy'))}</span></div><div class="stat-card"><strong>${st.exams}</strong><span>${esc(t('exams'))}</span></div><div class="stat-card"><strong>${examPassRate()}%</strong><span>${esc(t('passRate'))}</span></div><div class="stat-card"><strong>${st.last ?? '—'}</strong><span>${esc(t('last'))}</span></div></div><div class="card" style="margin-top:14px"><h3>${esc(t('fourChapters'))}</h3>${TOPIC_GROUPS.map(topic=>{const x=topicStats(topic.id);return `<button class="progress-topic" data-go="chaptersetup" data-id="${topic.id}"><span>${topic.icon} ${esc(t(topic.title))}</span><strong>${x.accuracy}%</strong><div class="mini-bar"><span style="width:${x.coverage}%"></span></div></button>`}).join('')}</div><div class="card detailed-history-card" style="margin-top:14px"><div class="history-heading"><div><h3>${esc(t('detailedHistory'))}</h3><p>${esc(t('examDetailsSub'))}</p></div><span>${examEntries.length}</span></div>${examEntries.length?`<div class="exam-history detailed">${examEntries.map(({exam,index})=>{const passed=exam.score>=30;return `<button class="exam-row exam-detail-row" data-exam-index="${index}"><span>${formatExamDate(exam.date)}</span><strong>${exam.score}/${exam.total}</strong><em class="${passed?'pass':'fail'}">${esc(t(passed?'passedSmall':'failedSmall'))}</em><b>${esc(t('viewDetails'))} ›</b></button>`}).join('')}</div>`:`<p class="muted">${esc(t('noExamHistory'))}</p>`}</div><div class="card" style="margin-top:14px"><h3>${esc(t('categories'))}</h3>${by.length?by.map(x=>`<div class="bar-row"><div class="label"><span>${esc(x.category)}</span><strong>${x.pct}%</strong></div><div class="mini-bar"><span style="width:${x.pct}%"></span></div></div>`).join(''):`<p class="muted">${esc(t('noResults'))}</p>`}</div>`},
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
 if(route.name==='reviewsetup'){
   const start=$('#startScheduledReview');
   if(start)start.onclick=()=>startQuiz(dueQuestions().slice(0,35),'guided');
   screen.querySelectorAll('[data-review-question]').forEach(button=>button.onclick=()=>startQuiz([Q.find(q=>q.id===button.dataset.reviewQuestion)],'guided'));
 }
 if(route.name==='questionlibrary')bindQuestionLibrary();
 if(route.name==='roadmap')bindRoadmap();
 if(route.name==='passport')bindPassport();
 if(route.name==='schools')bindSchoolDirectory();
 if(route.name==='schooldetail')bindSchoolDetail();
 if(route.name==='schoolcompare')bindSchoolCompare();
 if(route.name==='schooldashboard')bindSchoolDashboard();
 if(route.name==='schoolpartner')bindSchoolPartner();
 if(route.name==='bridgesetup')$('#startBridge').onclick=()=>startBridgeTest(Number($('#bridgeCount').value));
 if(route.name==='bridgequiz')renderBridgeQuiz();
 if(route.name==='bridgeresult'){
   const result=bridgeResultById(route.data);
   const language=$('#trainBridgeLanguage'),rules=$('#trainBridgeRules');
   if(language)language.onclick=()=>startBridgeTest(Math.min(10,Math.max(5,result.languageIds.length)),result.languageIds);
   if(rules)rules.onclick=()=>{const list=result.ruleIds.map(id=>Q.find(q=>q.id===id)).filter(Boolean);if(list.length)startQuiz(list,'guided')};
 }
 if(route.name==='progress'){
   $('#shareProgressReport').onclick=()=>shareTextReport(t('reportTitle'),progressReportText(),t('progressReportCopied'));
   $('#copyProgressReport').onclick=()=>copyTextSafe(progressReportText(),t('progressReportCopied'));
   screen.querySelectorAll('[data-dna-reason]').forEach(button=>button.onclick=()=>trainErrorReason(button.dataset.dnaReason));
   screen.querySelectorAll('[data-exam-index]').forEach(button=>button.onclick=()=>go('examdetail',button.dataset.examIndex));
 }
 if(route.name==='examdetail'){
   const index=Number(route.data),exam=(progress.exams||[])[index];
   $('#shareExamReport').onclick=()=>shareTextReport(t('examDetails'),examReportText(exam,index),t('examReportCopied'));
   $('#copyExamReport').onclick=()=>copyTextSafe(examReportText(exam,index),t('examReportCopied'));
   $('#retryExamMistakes').onclick=()=>{
     const wrong=examDetailItems(exam).filter(item=>!item.ok).map(item=>item.q);
     if(!wrong.length)return toast(t('noMistakesInExam'));
     startQuiz(wrong,'guided');
   };
 }
 if(route.name==='vocabulary')bindVocabulary();
 if(route.name==='phrasebook')bindPhrasebook();
 if(route.name==='flashcards')bindFlashcards();
 if(route.name==='favourites'){
   screen.querySelectorAll('[data-qid]').forEach(b=>b.onclick=()=>startQuiz([Q.find(q=>q.id===b.dataset.qid)],'guided'));
   screen.querySelectorAll('[data-remove-saved]').forEach(b=>b.onclick=()=>{toggleFavourite(b.dataset.removeSaved);render()});
 }
 if(route.name==='licences')screen.querySelectorAll('[data-licence]').forEach(b=>b.onclick=()=>showLicence(b.dataset.licence));
 if(route.name==='roadcode')screen.querySelectorAll('[data-road]').forEach(b=>b.onclick=()=>showRoad(b.dataset.road));
 if(route.name==='search'){const run=()=>renderSearch($('#globalSearch').value);$('#searchBtn').onclick=run;$('#globalSearch').oninput=run;renderSearch('')}
 if(route.name==='help'){
   $('#installAppBtn').onclick=promptInstallApp;
   $('#refreshAppBtn').onclick=refreshApplication;
   $('#shareSupportReport').onclick=shareSupportReport;
   $('#openSupportGmail').onclick=openSupportGmail;
   $('#openSupportMail').onclick=openSupportMail;
   $('#copySupportReport').onclick=copySupportReport;
 }
 if(route.name==='profile'){
   const replayPremium=$('#replayPremiumIntro');
   if(replayPremium)replayPremium.onclick=replayPremiumSplash;
   const l=$('#profileLang'),th=$('#profileTheme'),file=$('#backupFile');
   $('#savePersonalProfile').onclick=()=>{
     const form=collectProfileForm();
     const error=validatePersonalProfile(form);
     if(error){toast(error);return}
     savePersonalProfile(form);
     toast(t('profileSaved'));
     render();
   };
   const registrationOptions=$('#registrationOptions');
   $('#showRegistrationOptions').onclick=()=>{
     const form=collectProfileForm();
     const error=validatePersonalProfile(form);
     if(error){toast(error);return}
     savePersonalProfile(form);
     registrationOptions.classList.remove('hidden');
     registrationOptions.scrollIntoView({behavior:'smooth',block:'nearest'});
   };
   $('#closeRegistrationOptions').onclick=()=>registrationOptions.classList.add('hidden');
   $('#shareRegistration').onclick=shareRegistration;
   $('#openRegistrationGmail').onclick=openRegistrationGmail;
   $('#openRegistrationMail').onclick=openRegistrationMail;
   $('#copyRegistration').onclick=copyRegistration;
   $('#deletePersonalProfile').onclick=()=>{
     if(!confirm(t('deletePersonalDataConfirm')))return;
     localStorage.removeItem(USER_PROFILE);
     userProfile={
       firstName:'',lastName:'',email:'',address:'',age:'',
       privacyConsent:false,updatesConsent:false,
       registrationId:createRegistrationId(),savedAt:'',emailPreparedAt:''
     };
     toast(t('personalDataDeleted'));
     render();
   };
   l.value=settings.lang;th.value=settings.theme;
   l.onchange=()=>{settings.lang=l.value;save(SETTINGS,settings);render()};
   th.onchange=()=>{settings.theme=th.value;save(SETTINGS,settings);applyTheme();render()};
   $('#exportBackup').onclick=exportBackup;
   $('#importBackup').onclick=()=>file.click();
   file.onchange=()=>{if(file.files?.[0])importBackup(file.files[0])};
   $('#clearProgress').onclick=()=>{if(confirm(t('resetConfirm'))){progress={seen:{},correct:{},wrong:{},exams:[],favourites:[],activity:{},knownWords:[],knownPhrases:[],review:{},errorReasons:{},bridgeResults:[],bankVersion:TAG_BANK_VERSION};save(STORAGE,progress);localStorage.removeItem(SESSION);render()}}
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
  if(typeof quiz.showSentenceCoach!=='boolean')quiz.showSentenceCoach=false;

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
    help.innerHTML=`<div class="actions learning-tools"><button class="btn secondary" id="translateBtn">🇮🇹 ${esc(quiz.showTranslation?t('hideTranslation'):t('translate'))}</button><button class="btn secondary" id="listenBtn">🔊 ${esc(t('listen'))}</button><button class="btn secondary sentence-coach-toggle ${quiz.showSentenceCoach?'active':''}" id="sentenceCoachBtn">🧩 ${esc(quiz.showSentenceCoach?t('hideSentenceCoach'):t('sentenceCoach'))}</button><button class="btn secondary favourite-quiz ${isFavourite(q.id)?'active':''}" id="favouriteBtn">${isFavourite(q.id)?'★':'☆'} ${esc(isFavourite(q.id)?t('removeSaved'):t('saveQuestion'))}</button></div>${quiz.showTranslation?`<div class="translation"><strong>${esc(t('translationQuestion'))}</strong><p>${esc(q.question_it||q.question)}</p><small>${esc(t('translationAnswers'))}: ↓</small></div>`:''}${quiz.showSentenceCoach?sentenceCoachHtml(q):''}`;
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
    $('#sentenceCoachBtn').onclick=()=>{quiz.showSentenceCoach=!quiz.showSentenceCoach;saveSession();renderQuiz()};
    $('#favouriteBtn').onclick=()=>{toggleFavourite(q.id);renderQuiz()};
    if(quiz.showSentenceCoach){
      $('#coachSlow').onclick=()=>speakAtRate(`${q.question}. ${q.answers.map((answer,index)=>`${String.fromCharCode(65+index)}. ${answer}`).join('. ')}`,.62);
      screen.querySelectorAll('[data-coach-phrase]').forEach(button=>button.onclick=()=>{const item=PHRASEBOOK.find(value=>value.id===button.dataset.coachPhrase);if(item)speakAtRate(item.en,.72)});
      screen.querySelectorAll('[data-coach-word]').forEach(button=>button.onclick=()=>speakAtRate(button.dataset.coachWord,.72));
    }
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
function confirmAnswer(){
 const q=quiz.list[quiz.index],need=q.correct.length;
 if(quiz.selected.length!==need)return toast(need===1?t('selectOne'):t('selectMany',need));
 const chosen=[...quiz.selected].sort((a,b)=>a-b),correct=[...q.correct].sort((a,b)=>a-b);
 const ok=JSON.stringify(chosen)===JSON.stringify(correct);
 quiz.answers[q.id]={selected:chosen,ok};
 quiz.answered=true;
 if(quiz.mode==='exam'){
  saveSession();
  nextQuestion();
  return;
 }
 progress.seen[q.id]=(progress.seen[q.id]||0)+1;
 if(ok)progress.correct[q.id]=(progress.correct[q.id]||0)+1;
 else progress.wrong[q.id]=(progress.wrong[q.id]||0)+1;
 recordActivity();
 updateReviewSchedule(q,ok);
 save(STORAGE,progress);
 saveSession();
 renderQuiz();
}
function applyReview(q,a){if(!a)return;screen.querySelectorAll('[data-opt]').forEach(b=>{const i=Number(b.dataset.opt);if(q.correct.includes(i))b.classList.add('correct');else if(a.selected.includes(i))b.classList.add('wrong')});showExplanation(q,a)}
function showExplanation(q,a){
 const box=$('#quizExplanation');
 const replaySelection=replaySceneSelection(q);
 const hasApprovedReplay=!!(replaySelection.entry?.status==='ready'&&replaySelection.asset?.status==='approved'&&replaySelection.scene?.media?.video);
 const inlineApprovedReplay=hasApprovedReplay?`<div class="quiz-inline-approved-replay"><div class="quiz-inline-replay-head"><span>${esc(replayUi('REPLAY REALE · SUBITO VISIBILE','REAL REPLAY · IMMEDIATELY VISIBLE'))}</span><strong>${esc(q.id)}</strong></div>${errorReplayVisualHtml(q,0)}</div>`:'';
 const chosenEn=a?.selected?.map(i=>q.answers[i]).join(' • ')||'—';
 const chosenIt=a?.selected?.map(i=>(q.answers_it&&q.answers_it[i])||q.answers[i]).join(' • ')||'—';
 const rightEn=q.correct.map(i=>q.answers[i]).join(' • ');
 const rightIt=q.correct.map(i=>(q.answers_it&&q.answers_it[i])||q.answers[i]).join(' • ');
 const wrongSelected=(a?.selected||[]).filter(i=>!q.correct.includes(i));
 box.innerHTML=`<strong class="explanation-title">${a?(a.ok?'✅ '+t('correct'):'❌ '+t('wrong')):'✦ '+t('explain')}</strong>
 ${a?`<div class="answer-review"><p><b>${esc(t('yourAnswer'))}:</b><br>${esc(chosenEn)}<br><span>🇮🇹 ${esc(chosenIt)}</span></p></div>`:''}
 <div class="answer-review correct-review"><p><b>${esc(t('rightAnswer'))}:</b><br>${esc(rightEn)}<br><span>🇮🇹 ${esc(rightIt)}</span></p></div>
 ${wrongSelected.length?`<div class="why-box wrong-reason"><b>${esc(t('wrong'))}</b><p>${esc(t('wrongChoiceReason'))}</p></div>`:''}
 <div class="why-box"><b>${esc(t('whyCorrect'))}</b><p>${esc(q.explanation||'')}</p><p>🇮🇹 ${esc(q.explanation_it||q.explanation||'')}</p></div>
 ${errorReasonHtml(q,a)}
 ${inlineApprovedReplay}
 <div class="ai-context-launch"><button class="btn" id="quizAiInstructor">🧠 ${esc(t('aiInstructorAsk'))}</button><button class="btn secondary" id="quizAiUnderstand">🧩 ${esc(t('aiInstructorUnderstand'))}</button><button class="btn secondary" id="quizErrorReplay"><span class="replay-inline-icon" aria-hidden="true">R</span>${esc(t('errorReplayOpen'))}</button></div>`;
 box.classList.remove('hidden');
 box.querySelectorAll('[data-error-reason]').forEach(button=>button.onclick=()=>recordErrorReason(q,a,button.dataset.errorReason));
 $('#quizAiInstructor').onclick=()=>{aiRecordExplanation(q.id);go('aiinstructor',{questionId:q.id})};
 $('#quizAiUnderstand').onclick=()=>aiSocraticStart(q.id);
 {
 const replayBtn=$('#quizErrorReplay');
 if(replayBtn){
  replayBtn.type='button';
  replayBtn.onclick=(event)=>{
   event.preventDefault();
   event.stopPropagation();
   errorReplayOpen(q.id);
  };
 }
}
}
function nextQuestion(){if(quiz?.mode==='exam'){if(quiz.index<quiz.list.length-1)goExamQuestion(quiz.index+1);else showExamNavigator();return}if(quiz.index<quiz.list.length-1){quiz.index++;quiz.selected=[];quiz.answered=false;quiz.showTranslation=false;quiz.showSentenceCoach=false;saveSession();renderQuiz();window.scrollTo(0,0)}else finishQuiz(false)}
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
     updateReviewSchedule(q,!!a?.ok);
   });
 }
 const correct=list.filter(q=>answers[q.id]?.ok).length,total=list.length;
 const wrongIds=list.filter(q=>!answers[q.id]?.ok).map(q=>q.id);
 const unanswered=mode==='exam'?list.filter(q=>!answers[q.id]||answers[q.id].selected?.length!==q.correct.length).length:0;
 const flagged=mode==='exam'?(quiz.flagged||[]).length:0;
 const pass=mode==='exam'&&correct>=30;
 const timeUsed=mode==='exam'?examTimeUsed():0;
 const breakdown=mode==='exam'?examBreakdown(list,answers):[];
 let examRecord=null;
 if(mode==='exam'){
   examRecord={
    id:examRecordId(),
    date:new Date().toISOString(),
    score:correct,
    total,
    timeUsed,
    unanswered,
    flagged,
    breakdown,
    details:list.map(q=>({
     id:q.id,
     selected:Array.isArray(answers[q.id]?.selected)?answers[q.id].selected:[],
     ok:Boolean(answers[q.id]?.ok),
     flagged:(quiz.flagged||[]).includes(q.id)
    }))
   };
   progress.exams.push(examRecord);
   progress.exams=progress.exams.slice(-30);
 }
 save(STORAGE,progress);localStorage.removeItem(SESSION);
 const title=mode==='exam'?(pass?t('passed'):t('failed')):t('completed');
 quiz=null;go('result',{correct,total,pass,title,wrongIds,mode,timeUsed,unanswered,flagged,breakdown,autoSubmitted,examId:examRecord?.id||null});
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

function bindQuestionLibrary(){
 const input=$('#librarySearch'),bank=$('#libraryBank'),topic=$('#libraryTopic'),status=$('#libraryStatus');
 const refresh=()=>{libraryLimit=50;renderQuestionLibrary()};
 input.oninput=refresh;
 input.onsearch=refresh;
 $('#librarySearchButton').onclick=refresh;
 bank.onchange=refresh;
 topic.onchange=refresh;
 status.onchange=refresh;
 $('#libraryReset').onclick=()=>{
   input.value='';bank.value='all';topic.value='all';status.value='all';libraryLimit=50;renderQuestionLibrary();
 };
 $('#libraryMore').onclick=()=>{libraryLimit+=50;renderQuestionLibrary()};
 renderQuestionLibrary();
}
function renderQuestionLibrary(){
 const input=$('#librarySearch'),bank=$('#libraryBank'),topic=$('#libraryTopic'),status=$('#libraryStatus');
 if(!input||!bank||!topic||!status)return;
 const query=normaliseVocabularyText(input.value);
 const dueIds=new Set(dueQuestions().map(q=>q.id));
 const list=libraryBankQuestions(bank.value).filter(q=>{
   const haystack=normaliseVocabularyText(`${q.id} ${q.category} ${q.question} ${q.question_it} ${q.explanation||''} ${q.explanation_it||''}`);
   const searchOk=!query||haystack.includes(query);
   const topicOk=topic.value==='all'||topicIdFor(q)===topic.value;
   let statusOk=true;
   if(status.value==='unseen')statusOk=questionAttempts(q)===0;
   else if(status.value==='wrong')statusOk=Number(progress.wrong[q.id]||0)>0;
   else if(status.value==='saved')statusOk=isFavourite(q.id);
   else if(status.value==='due')statusOk=dueIds.has(q.id);
   else if(status.value==='mastered')statusOk=isMastered(q);
   return searchOk&&topicOk&&statusOk;
 }).sort((a,b)=>{
   const dueA=dueIds.has(a.id)?1:0,dueB=dueIds.has(b.id)?1:0;
   if(dueA!==dueB)return dueB-dueA;
   const wrongA=Number(progress.wrong[a.id]||0),wrongB=Number(progress.wrong[b.id]||0);
   if(wrongA!==wrongB)return wrongB-wrongA;
   return a.id.localeCompare(b.id);
 });
 $('#libraryResultCount').textContent=list.length;
 const visible=list.slice(0,libraryLimit);
 $('#libraryResults').innerHTML=visible.length?visible.map(q=>{
   const attempts=questionAttempts(q),accuracy=questionAccuracy(q),record=reviewRecord(q.id),due=dueIds.has(q.id),mastered=isMastered(q);
   const bankLabel=q.bank==='lptv_core'?t('bankCore'):t('bankRoad');
   return `<article class="library-question ${due?'due':''} ${mastered?'mastered':''}">
     <div class="library-question-head"><div><span class="badge">${esc(bankLabel)}</span><span class="badge soft">${esc(q.category)}</span></div><button class="library-star ${isFavourite(q.id)?'active':''}" data-library-save="${esc(q.id)}">${isFavourite(q.id)?'★':'☆'}</button></div>
     <h3>${esc(q.question)}</h3>
     <p class="library-translation">🇮🇹 ${esc(q.question_it)}</p>
     <div class="library-stats"><span>${esc(t('attempts'))}: <b>${attempts}</b></span><span>${esc(t('accuracy'))}: <b>${attempts?accuracy+'%':'—'}</b></span>${due?`<span class="due-label">${esc(t('dueToday'))}</span>`:mastered?`<span class="mastered-label">✓ ${esc(t('mastered'))}</span>`:record?.due?`<span>${esc(reviewDateLabel(record.due))}</span>`:''}</div>
     <div class="library-actions"><button class="btn" data-library-open="${esc(q.id)}">${esc(t('studyNow'))}</button><button class="btn secondary" data-library-speak="${esc(q.id)}">🔊 ${esc(t('listen'))}</button></div>
   </article>`;
 }).join(''):`<div class="card empty-search"><div>🔎</div><h3>${esc(t('noResults'))}</h3><p class="muted">${esc(t('resetFilters'))}</p></div>`;
 const more=$('#libraryMore');
 more.classList.toggle('hidden',visible.length>=list.length);
 more.disabled=visible.length>=list.length;
 screen.querySelectorAll('[data-library-open]').forEach(button=>button.onclick=()=>startQuiz([Q.find(q=>q.id===button.dataset.libraryOpen)],'guided'));
 screen.querySelectorAll('[data-library-speak]').forEach(button=>button.onclick=()=>{const q=Q.find(item=>item.id===button.dataset.librarySpeak);if(q)speakQuestion(q)});
 screen.querySelectorAll('[data-library-save]').forEach(button=>button.onclick=()=>{toggleFavourite(button.dataset.librarySave);renderQuestionLibrary()});
}
function bindPhrasebook(){
 const input=$('#phraseSearch'),button=$('#phraseSearchButton');
 const run=()=>renderPhrasebook(input.value);
 input.oninput=run;
 input.onsearch=run;
 button.onclick=run;
 renderPhrasebook('');
}
function renderPhrasebook(term){
 const box=$('#phraseResults');
 const query=normaliseVocabularyText(term);
 const list=PHRASEBOOK.filter(item=>!query||normaliseVocabularyText(`${item.en} ${item.it} ${item.tag}`).includes(query));
 box.innerHTML=list.length?list.map(item=>`<article class="phrase-card ${isKnownPhrase(item.id)?'known':''}">
   <div class="phrase-card-head"><div><span class="badge">${esc(item.tag)}</span><h3>${esc(item.en)}</h3><strong>${esc(item.it)}</strong></div><button class="phrase-audio" data-phrase-audio="${esc(item.id)}">🔊</button></div>
   <div class="phrase-card-actions"><button class="btn secondary" data-phrase-slow="${esc(item.id)}">🐢 ${esc(t('slowListen'))}</button><button class="btn ${isKnownPhrase(item.id)?'known-active':'secondary'}" data-known-phrase="${esc(item.id)}">${isKnownPhrase(item.id)?'✓ '+esc(t('phraseKnown')):'○ '+esc(t('markPhraseKnown'))}</button></div>
 </article>`).join(''):`<div class="card empty-search"><div>🔎</div><h3>${esc(t('noResults'))}</h3></div>`;
 box.querySelectorAll('[data-phrase-audio]').forEach(button=>button.onclick=()=>{const item=PHRASEBOOK.find(value=>value.id===button.dataset.phraseAudio);if(item)speakAtRate(item.en,.88)});
 box.querySelectorAll('[data-phrase-slow]').forEach(button=>button.onclick=()=>{const item=PHRASEBOOK.find(value=>value.id===button.dataset.phraseSlow);if(item)speakAtRate(item.en,.62)});
 box.querySelectorAll('[data-known-phrase]').forEach(button=>button.onclick=()=>{toggleKnownPhrase(button.dataset.knownPhrase);renderPhrasebook($('#phraseSearch')?.value||'')});
}
function bindFlashcards(){
 screen.querySelectorAll('[data-flash-direction]').forEach(button=>button.onclick=()=>{
   flashState.direction=button.dataset.flashDirection;
   flashState.revealed=false;
   renderFlashcard();
 });
 initialiseFlashcards();
 renderFlashcard();
}
function renderFlashcard(){
 const host=$('#flashcardHost');
 if(!host)return;
 const item=currentFlashcard();
 const enFirst=flashState.direction==='en-it';
 const front=enFirst?item.en:item.it;
 const back=enFirst?item.it:item.en;
 screen.querySelectorAll('[data-flash-direction]').forEach(button=>button.classList.toggle('active',button.dataset.flashDirection===flashState.direction));
 host.innerHTML=`<div class="flashcard ${flashState.revealed?'revealed':''}">
   <div class="flash-progress">${esc(t('cardProgress'))} ${flashState.index+1}/${flashState.deck.length}</div>
   <span class="badge">${esc(item.tag)}</span>
   <h2>${esc(front)}</h2>
   ${flashState.revealed?`<div class="flash-answer"><span>${esc(t('phraseMeaning'))}</span><strong>${esc(back)}</strong></div>`:`<div class="flash-hidden">?</div>`}
   <div class="flash-audio-row"><button class="btn secondary" id="flashNormal">🔊 ${esc(t('audioNormal'))}</button><button class="btn secondary" id="flashSlow">🐢 ${esc(t('audioSlow'))}</button></div>
   <button class="btn flash-reveal" id="flashReveal">${esc(flashState.revealed?t('hideAnswer'):t('revealAnswer'))}</button>
   <div class="flash-actions"><button class="btn ${isKnownPhrase(item.id)?'known-active':'secondary'}" id="flashKnown">${isKnownPhrase(item.id)?'✓ '+esc(t('phraseKnown')):'○ '+esc(t('markPhraseKnown'))}</button><button class="btn" id="flashNext">${esc(t('nextCard'))} ›</button></div>
   <button class="btn secondary flash-shuffle" id="flashShuffle">⤨ ${esc(t('shuffleCards'))}</button>
 </div>`;
 const audioText=item.en;
 $('#flashNormal').onclick=()=>speakAtRate(audioText,.88);
 $('#flashSlow').onclick=()=>speakAtRate(audioText,.62);
 $('#flashReveal').onclick=()=>{flashState.revealed=!flashState.revealed;renderFlashcard()};
 $('#flashKnown').onclick=()=>{toggleKnownPhrase(item.id);renderFlashcard()};
 $('#flashNext').onclick=()=>{flashState.index=(flashState.index+1)%flashState.deck.length;flashState.revealed=false;renderFlashcard()};
 $('#flashShuffle').onclick=()=>{flashState.deck=shuffle(PHRASEBOOK.map(value=>value.id));flashState.index=0;flashState.revealed=false;renderFlashcard()};
}
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
 const data={app:'Malta Driving Master',version:'26.1',exportedAt:new Date().toISOString(),progress,settings,userProfile,schoolPreferences,schoolCompare,schoolPartnerDraft,schoolDashboard,schoolPortal,instructorPortal,aiInstructor,cloudReady,missionSystem,errorReplay,lptvPassport,personalRoadmap,onboarding,privacyPreferences,coachState,recoveryState,examDayState,zeroErrorState};
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
       knownWords:Array.isArray(p.knownWords)?p.knownWords:[],
       knownPhrases:Array.isArray(p.knownPhrases)?p.knownPhrases:[],
       review:p.review&&typeof p.review==='object'?allowedQuestionMap(p.review):{},
       errorReasons:p.errorReasons&&typeof p.errorReasons==='object'?allowedQuestionMap(p.errorReasons):{},
       bridgeResults:Array.isArray(p.bridgeResults)?p.bridgeResults:[],
       bankVersion:TAG_BANK_VERSION
     };
     if(data.settings&&['en','it','mt'].includes(data.settings.lang)){
       settings=Object.assign(settings,data.settings);
       save(SETTINGS,settings);
       applyTheme();
     }
     if(data.userProfile&&typeof data.userProfile==='object'){
       userProfile=Object.assign({
        firstName:'',lastName:'',email:'',address:'',age:'',
        privacyConsent:false,updatesConsent:false,
        registrationId:createRegistrationId(),savedAt:'',emailPreparedAt:''
       },data.userProfile);
       if(!userProfile.registrationId)userProfile.registrationId=createRegistrationId();
       save(USER_PROFILE,userProfile);
     }
     if(data.schoolPreferences&&typeof data.schoolPreferences==='object'){
       schoolPreferences=Object.assign({},DEFAULT_SCHOOL_PREFS,data.schoolPreferences);
       save(SCHOOL_PREFS_KEY,schoolPreferences);
     }
     if(Array.isArray(data.schoolCompare)){
       schoolCompare=data.schoolCompare.filter(id=>SCHOOL_DEMOS.some(school=>school.id===id)).slice(0,3);
       save(SCHOOL_COMPARE_KEY,schoolCompare);
     }
     if(data.schoolPartnerDraft&&typeof data.schoolPartnerDraft==='object'){
       schoolPartnerDraft=Object.assign({},schoolPartnerDraft,data.schoolPartnerDraft);
       save(SCHOOL_PARTNER_KEY,schoolPartnerDraft);
     }
     if(data.schoolDashboard&&typeof data.schoolDashboard==='object'){
       schoolDashboard=Object.assign({},DEFAULT_SCHOOL_DASHBOARD,data.schoolDashboard);
       schoolDashboard.students=Array.isArray(schoolDashboard.students)?schoolDashboard.students:[];
       schoolDashboard.groups=Array.isArray(schoolDashboard.groups)?schoolDashboard.groups:[];
       schoolDashboard.invites=Array.isArray(schoolDashboard.invites)?schoolDashboard.invites:[];
       save(SCHOOL_DASHBOARD_KEY,schoolDashboard);
     }
     if(data.lptvPassport&&typeof data.lptvPassport==='object'){
       lptvPassport=Object.assign({},DEFAULT_LPTV_PASSPORT,data.lptvPassport);
       lptvPassport.checklist=lptvPassport.checklist&&typeof lptvPassport.checklist==='object'?lptvPassport.checklist:{};
       lptvPassport.dates=Object.assign({},DEFAULT_LPTV_PASSPORT.dates,lptvPassport.dates||{});
       save(PASSPORT_KEY,lptvPassport);
     }
     if(data.personalRoadmap&&typeof data.personalRoadmap==='object'){
       personalRoadmap=Object.assign({},DEFAULT_PERSONAL_ROADMAP,data.personalRoadmap);
       personalRoadmap.dailyMinutes=Math.max(10,Math.min(120,Number(personalRoadmap.dailyMinutes)||20));
       personalRoadmap.studyDays=Math.max(1,Math.min(7,Number(personalRoadmap.studyDays)||5));
       save(ROADMAP_KEY,personalRoadmap);
     }
     if(data.onboarding&&typeof data.onboarding==='object'){
       onboarding=Object.assign({},DEFAULT_ONBOARDING,data.onboarding);
       save(ONBOARDING_KEY,onboarding);
     }
     if(data.privacyPreferences&&typeof data.privacyPreferences==='object'){
       privacyPreferences=Object.assign({},DEFAULT_PRIVACY_PREFS,data.privacyPreferences);
       save(PRIVACY_PREFS_KEY,privacyPreferences);
     }
     if(data.coachState&&typeof data.coachState==='object'){
       coachState=Object.assign({},DEFAULT_COACH_STATE,data.coachState);
       coachState.missionSteps=Object.assign({study:false,review:false,bridge:false},coachState.missionSteps||{});
       save(COACH_KEY,coachState);
     }
     if(data.recoveryState&&typeof data.recoveryState==='object'){
       recoveryState=Object.assign({},DEFAULT_RECOVERY_STATE,data.recoveryState);
       recoveryState.completedQuestionIds=Array.isArray(recoveryState.completedQuestionIds)?recoveryState.completedQuestionIds:[];
       save(RECOVERY_KEY,recoveryState);
     }
     if(data.examDayState&&typeof data.examDayState==='object'){
       examDayState=Object.assign({},DEFAULT_EXAM_DAY_STATE,data.examDayState);
       examDayState.checklist=examDayState.checklist&&typeof examDayState.checklist==='object'?examDayState.checklist:{};
       save(EXAM_DAY_KEY,examDayState);
     }
     if(data.zeroErrorState&&typeof data.zeroErrorState==='object'){
       zeroErrorState=Object.assign({},DEFAULT_ZERO_ERROR_STATE,data.zeroErrorState);
       zeroErrorState.defeatedIds=Array.isArray(zeroErrorState.defeatedIds)?zeroErrorState.defeatedIds:[];
       zeroErrorState.verifiedIds=Array.isArray(zeroErrorState.verifiedIds)?zeroErrorState.verifiedIds:[];
       save(ZERO_ERROR_KEY,zeroErrorState);
     }
     if(data.schoolPortal&&typeof data.schoolPortal==='object'){
       schoolPortal=Object.assign({},DEFAULT_SCHOOL_PORTAL,data.schoolPortal);
       for(const key of ['instructors','courses','offers','reviews','requests','bookings']){
        schoolPortal[key]=Array.isArray(schoolPortal[key])?schoolPortal[key]:[];
       }
       schoolPortal.publicProfile=Object.assign({},DEFAULT_SCHOOL_PORTAL.publicProfile,schoolPortal.publicProfile||{});
       save(SCHOOL_PORTAL_KEY,schoolPortal);
     }
     if(data.instructorPortal&&typeof data.instructorPortal==='object'){
       instructorPortal=Object.assign({},DEFAULT_INSTRUCTOR_PORTAL,data.instructorPortal);
       instructorPortal.profile=Object.assign({},DEFAULT_INSTRUCTOR_PORTAL.profile,instructorPortal.profile||{});
       instructorPortal.assignments=Array.isArray(instructorPortal.assignments)?instructorPortal.assignments:[];
       instructorPortal.notes=Array.isArray(instructorPortal.notes)?instructorPortal.notes:[];
       save(INSTRUCTOR_PORTAL_KEY,instructorPortal);
     }
     if(data.aiInstructor&&typeof data.aiInstructor==='object'){
       aiInstructor=Object.assign({},DEFAULT_AI_INSTRUCTOR,data.aiInstructor);
       aiInstructor.explained=aiInstructor.explained&&typeof aiInstructor.explained==='object'?aiInstructor.explained:{};
       aiInstructor.socratic=Object.assign({questionId:'',step:0,answers:[]},aiInstructor.socratic||{});
       aiInstructor.socratic.answers=Array.isArray(aiInstructor.socratic.answers)?aiInstructor.socratic.answers:[];
       save(AI_INSTRUCTOR_KEY,aiInstructor);
     }
     if(data.cloudReady&&typeof data.cloudReady==='object'){
       cloudReady=Object.assign({},DEFAULT_CLOUD_READY,data.cloudReady);
       cloudReady.queue=Array.isArray(cloudReady.queue)?cloudReady.queue:[];
       cloudReady.devices=Array.isArray(cloudReady.devices)?cloudReady.devices:[];
       save(CLOUD_READY_KEY,cloudReady);
     }
     if(data.missionSystem&&typeof data.missionSystem==='object'){
       missionSystem=Object.assign({},DEFAULT_MISSION_SYSTEM,data.missionSystem);
       missionSystem.completedMissionIds=Array.isArray(missionSystem.completedMissionIds)?missionSystem.completedMissionIds:[];
       missionSystem.missionProgress=missionSystem.missionProgress&&typeof missionSystem.missionProgress==='object'?missionSystem.missionProgress:{};
       save(MISSION_SYSTEM_KEY,missionSystem);
     }
     if(data.errorReplay&&typeof data.errorReplay==='object'){
       errorReplay=Object.assign({},DEFAULT_ERROR_REPLAY,data.errorReplay);
       errorReplay.viewed=errorReplay.viewed&&typeof errorReplay.viewed==='object'?errorReplay.viewed:{};
       errorReplay.completed=errorReplay.completed&&typeof errorReplay.completed==='object'?errorReplay.completed:{};
       errorReplay.perception=Object.assign({attempts:0,hits:0,totalMs:0,bestMs:0,lastResult:null},errorReplay.perception||{});
       save(ERROR_REPLAY_KEY,errorReplay);
     }
     save(STORAGE,progress);localStorage.removeItem(SESSION);toast(t('backupRestored'));setTimeout(render,400);
   }catch{toast(t('backupInvalid'))}
 };
 reader.onerror=()=>toast(t('backupInvalid'));
 reader.readAsText(file);
}
const ASSISTANT_ALIASES={
 precedenza:'priority give way',priorita:'priority give way',rotatoria:'roundabout',rotonda:'roundabout',incrocio:'junction',pedone:'pedestrian',pedoni:'pedestrians',ciclista:'cyclist',ciclisti:'cyclists',moto:'motorcycle',motociclista:'motorcyclist',anziano:'elderly vulnerable passenger',disabile:'disabled vulnerable passenger',passeggero:'passenger customer',cliente:'passenger customer',tunnel:'tunnel',guasto:'breakdown',freni:'brakes braking',freno:'brake braking',pioggia:'rain wet road',nebbia:'fog visibility',velocita:'speed',parcheggio:'parking',sorpasso:'overtaking',cintura:'seat belt',alcool:'alcohol',farmaci:'medicine drugs',incidente:'accident emergency first aid',ambulanza:'emergency first aid',clacson:'horn',specchietti:'mirrors',segnale:'sign',segnali:'signs',strisce:'crossing road markings',bagaglio:'luggage load',bambino:'child',bambini:'children'
};
const ASSISTANT_STOP=new Set(['come','cosa','quale','quali','quando','dove','perche','perché','devo','dovrei','fare','funziona','della','delle','degli','nella','nelle','with','what','when','where','which','should','would','does','about','from','that','this','have','your']);
function assistantNormalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function assistantTerms(text){
 const raw=assistantNormalize(text).split(' ').filter(token=>token.length>2&&!ASSISTANT_STOP.has(token));
 const expanded=[];raw.forEach(token=>{expanded.push(token);if(ASSISTANT_ALIASES[token])expanded.push(...ASSISTANT_ALIASES[token].split(' '))});
 return [...new Set(expanded)];
}
function assistantScore(haystack,query,terms){
 const hay=assistantNormalize(haystack);let score=0;
 if(query&&hay.includes(query))score+=12;
 terms.forEach(term=>{if(hay.includes(term))score+=term.length>6?4:2});
 return score;
}
function assistantSearch(text){
 const query=assistantNormalize(text),terms=assistantTerms(text);
 const questions=Q.map(q=>({type:'question',item:q,score:assistantScore(`${q.id} ${q.category} ${q.question} ${q.question_it} ${q.explanation||''} ${q.explanation_it||''} ${(q.answers||[]).join(' ')} ${(q.answers_it||[]).join(' ')}`,query,terms)})).filter(x=>x.score>1).sort((a,b)=>b.score-a.score).slice(0,5);
 const roads=C.roadCode.map(item=>({type:'road',item,score:assistantScore(`${item.en} ${item.it} ${item.mt} ${item.summary_en} ${item.summary_it} ${item.summary_mt}`,query,terms)})).filter(x=>x.score>1).sort((a,b)=>b.score-a.score).slice(0,3);
 const regs=C.regulations.map(item=>({type:'reg',item,score:assistantScore(`${item.en} ${item.it} ${item.mt} ${item.desc_en} ${item.desc_it} ${item.desc_mt}`,query,terms)})).filter(x=>x.score>1).sort((a,b)=>b.score-a.score).slice(0,2);
 return [...questions,...roads,...regs].sort((a,b)=>b.score-a.score).slice(0,7);
}
function bindAssistantResultActions(log){
 log.querySelectorAll('[data-assistant-qid]').forEach(button=>button.onclick=()=>{const q=Q.find(item=>item.id===button.dataset.assistantQid);if(q)startQuiz([q],'guided')});
 log.querySelectorAll('[data-assistant-road]').forEach(button=>button.onclick=()=>showRoad(button.dataset.assistantRoad));
}
function bindAssistant(){
 const input=$('#assistantInput'),send=$('#assistantSend'),log=$('#assistantLog');
 const ask=()=>{const text=input.value.trim();if(!text)return;log.insertAdjacentHTML('beforeend',`<div class="assistant-bubble user">${esc(text)}</div>`);log.insertAdjacentHTML('beforeend',`<div class="assistant-bubble bot rich">${assistantAnswer(text)}</div>`);input.value='';bindAssistantResultActions(log);log.lastElementChild.scrollIntoView({behavior:'smooth'})};
 send.onclick=ask;input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();ask()}});screen.querySelectorAll('[data-prompt]').forEach(button=>button.onclick=()=>{input.value=button.dataset.prompt;ask()});
}
function assistantAnswer(text){
 const results=assistantSearch(text);
 if(!results.length)return `<p>${esc(t('assistantNoMatch'))}</p>`;
 return `<strong>${esc(t('assistantFound',results.length))}</strong><div class="assistant-results">${results.map(result=>{
  if(result.type==='question'){const q=result.item,right=q.correct.map(i=>q.answers[i]).join(' • ');return `<article><span class="badge">${esc(q.category)}</span><h4>${esc(q.question)}</h4><p>🇮🇹 ${esc(q.question_it)}</p><div class="assistant-answer"><b>${esc(t('rightAnswer'))}:</b> ${esc(right)}</div><p>${esc(settings.lang==='it'?(q.explanation_it||q.explanation):(q.explanation||q.explanation_it))}</p><button class="btn" data-assistant-qid="${esc(q.id)}">${esc(t('assistantStudyQuestion'))} ›</button></article>`}
  if(result.type==='road'){const item=result.item;return `<article><span class="badge official">${esc(t('roadCode'))}</span><h4>${item.icon} ${esc(item[settings.lang]||item.en)}</h4><p>${esc(localized(item,'summary'))}</p><button class="btn secondary" data-assistant-road="${esc(item.id)}">${esc(t('viewDetails'))} ›</button></article>`}
  const item=result.item;return `<article><span class="badge official">${esc(t('officialSource'))}</span><h4>${item.icon} ${esc(item[settings.lang]||item.en)}</h4><p>${esc(localized(item,'desc'))}</p><a class="source-link" href="${esc(item.url)}" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></article>`
 }).join('')}</div>`;
}
function showLicence(code){const x=C.licences.find(x=>x.code===code);modal.innerHTML=`<div class="modal-panel"><div class="row between"><h2>${x.icon} ${esc(x.code)}</h2><button class="btn secondary" data-close>${esc(t('close'))}</button></div><p style="font-size:20px">${esc(x[settings.lang]||x.en)}</p><p class="muted">${esc(t('assistantDisclaimer'))}</p><a class="source-link" href="https://www.transport.gov.mt/land/driving-licence-783" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a></div>`;modal.classList.remove('hidden');modal.querySelector('[data-close]').onclick=()=>modal.classList.add('hidden')}
function showRoad(id){const x=C.roadCode.find(x=>x.id===id);const related=Q.filter(q=>(q.category+' '+q.question+' '+q.question_it).toLowerCase().includes(x.en.split(' ')[0].toLowerCase())).slice(0,5);modal.innerHTML=`<div class="modal-panel"><div class="row between"><h2>${x.icon} ${esc(x[settings.lang]||x.en)}</h2><button class="btn secondary" data-close>${esc(t('close'))}</button></div><p>${esc(localized(x,'summary'))}</p><span class="badge official">${esc(t('officialSource'))}</span><a class="source-link" href="https://www.transport.gov.mt/land/roads-and-traffic-management/road-code-7389" target="_blank" rel="noopener">${esc(t('openSource'))} ↗</a>${related.length?`<h3 style="margin-top:22px">${esc(t('questions'))}</h3><div class="list">${related.map(q=>`<button class="list-card" data-qid="${esc(q.id)}"><div><h3>${esc(q.question)}</h3><p>${esc(q.question_it)}</p></div></button>`).join('')}</div>`:''}</div>`;modal.classList.remove('hidden');modal.querySelector('[data-close]').onclick=()=>modal.classList.add('hidden');modal.querySelectorAll('[data-qid]').forEach(b=>b.onclick=()=>{modal.classList.add('hidden');startQuiz([Q.find(q=>q.id===b.dataset.qid)],'guided')})}
function showLanguages(){modal.innerHTML=`<div class="modal-panel"><h2>${esc(t('language'))}</h2><div class="language-list"><button data-lang="en">🇬🇧 English</button><button data-lang="it">🇮🇹 Italiano</button><button data-lang="mt">🇲🇹 Malti</button></div></div>`;modal.classList.remove('hidden');modal.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{settings.lang=b.dataset.lang;save(SETTINGS,settings);modal.classList.add('hidden');render()})}

$('#langBtn').onclick=showLanguages;backBtn.onclick=()=>history.back();document.querySelector('.brand').onclick=()=>{if(route.name==='quiz'&&quiz){if(quiz.mode==='exam'){if(confirm(t('pauseExamConfirm'))){clearInterval(timerId);timerId=null;saveSession();go('home')}}else if(confirm(t('exit')+'?')){clearInterval(timerId);timerId=null;localStorage.removeItem(SESSION);quiz=null;go('home')}}else go('home')};document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>go(b.dataset.nav));window.onpopstate=e=>{route=e.state||{name:'home',data:null};render()};window.addEventListener('beforeunload',saveSession);
window.addEventListener('beforeinstallprompt',event=>{
 event.preventDefault();
 deferredInstallPrompt=event;
 if(route.name==='help')render();
});
window.addEventListener('appinstalled',()=>{
 deferredInstallPrompt=null;
 toast(t('installationComplete'));
 if(route.name==='help')render();
});
applyTheme();if(!localStorage.getItem(SETTINGS))setTimeout(showLanguages,250);
const initialName=location.hash.replace(/^#/,'');
if(!onboarding.completed&&initialName!=='privacycenter'){
 route={name:'onboarding',data:null};
}else{
 route=views[initialName]?{name:initialName,data:null}:{name:'home',data:null};
}
history.replaceState(route,'',location.pathname+`#${route.name}`);
render();setTimeout(()=>verifyReplayAssets().catch(()=>{}),250);
})();
