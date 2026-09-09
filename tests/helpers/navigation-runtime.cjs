'use strict';
const {harness,fn,core}=require('./account-runtime.cjs');

// Production handlers/render functions with a deterministic DOM/layout boundary.
// This fixture does not emulate Safari or assert production device E2E coverage.
class Element {
 constructor(){this.dataset={};this.style={};this.children=[];this.selectors=new Map();this.classes=new Set();this.classList={add:(...xs)=>xs.forEach(x=>this.classes.add(x)),remove:(...xs)=>xs.forEach(x=>this.classes.delete(x)),contains:x=>this.classes.has(x),toggle:(x,on)=>on===false?this.classes.delete(x):this.classes.add(x)};}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 querySelectorAll(s){return this.selectors.get(s)||[];}
 appendChild(el){this.children.push(el);el.parentElement=this;return el;}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(x=>x!==this);}
 setAttribute(k,v){this[k]=v;}
 getAttribute(k){return this[k]??null;}
 addEventListener(){}
 focus(){}
 set innerHTML(value){this.html=value;this.children=[];if(value.includes('data-replay-mobile-continue>'))this.selectors.set('[data-replay-mobile-continue]',[new Element()]);}
 get innerHTML(){return this.html||'';}
}
function click(button){if(!button?.onclick)throw Error('Missing production click binding');const event={prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;}};button.onclick(event);return event;}
function navigation({phase=0,lang='it',offset=1100,film=false}={}){
 const h=harness(),c=h.context,ids=new Map(),screen=new Element(),frames=[],scrolls=[],completed=[];
 const layout={sceneTop:4000,oldHeight:1600,nextHeight:650,gridGap:100,film,phase};
 c.screen=screen;c.document.body=new Element();c.document.createElement=()=>new Element();c.performance={now:()=>1000};
 c.$=s=>ids.get(s)||null;c.scrollY=layout.sceneTop+offset;
 c.scrollTo=(x,y)=>{c.scrollY=typeof x==='object'?x.top:y;scrolls.push(c.scrollY);};
 c.scrollBy=(x,y)=>c.scrollTo(0,c.scrollY+y);c.requestAnimationFrame=f=>{frames.push(f);return frames.length;};
 c.clearInterval=()=>{};c.completed=completed;c.historyCalls=[];c.history.pushState=(state,_,url)=>c.historyCalls.push({state,url});
 c.ReplayEngine={stop(){}};
 function rebuild(){
  layout.phase=h.eval('errorReplayStep');ids.clear();screen.selectors.clear();screen.children=[];
  const anchor=new Element();anchor.getBoundingClientRect=()=>({top:layout.sceneTop-c.scrollY,height:layout.phase===0?layout.oldHeight:layout.nextHeight});
  screen.selectors.set('.replay-main-card',[anchor]);if(film)screen.selectors.set('[data-real-film]',[anchor]);
  const stages=[0,1,2,3].map(i=>{const b=new Element();b.dataset.replayStage=String(i);b.disabled=i>layout.phase;return b;});screen.selectors.set('[data-replay-stage]',stages);
  if(layout.phase===1||layout.phase===2){const b=new Element();b.dataset.replayPhaseContinue=String(layout.phase+1);screen.selectors.set('[data-replay-phase-continue]',[b]);}
  ids.set('#errorReplayRestart',new Element());
  const open=new Element();open.dataset.replayOpen='Q2';screen.selectors.set('[data-replay-open]',[open]);
  for(const id of ['qCounter','quizTimer','quizProgress','quizModeBadge','quizMeta','quizQuestion','quizInstruction','examStatus','quizHelp','quizOptions','quizExplanation','quizConfirm','quizNext','examPrev','examFlag','examNavigator','examFinish','quizExit'])ids.set('#'+id,new Element());
  if(h.eval('route.name')!=='errorreplay')screen.selectors.clear();
 }
 const select=screen.querySelector.bind(screen);screen.querySelector=s=>s==='[data-replay-mobile-continue-dock]'?screen.children.find(n=>n.dataset.replayMobileContinueDock)||null:select(s);
 c.rebuild=rebuild;
 h.eval(`var route={name:'errorreplay',data:{questionId:'Q1'}};
 var errorReplayStep=${phase},errorReplayTimer=null,replayCoachFeedback=null,errorReplayAutoFocusScene=false;
 var interactiveReplayOpenCategory='',interactiveReplayCategoryReturnScroll=0;
 settings.lang=${JSON.stringify(lang)};
 function mdmAuthSummary(){return {authenticated:false};}
 function mdmProtectedRouteDecision(){return {ok:true};}
 function mdmApplyProtectedRouteGate(name,data){return {name,data};}
 function routeAllowedForLanguage(){return true;}
 function updateChrome(){} function mdmLabelCurrentScreen(){} function shouldShowPremiumSplash(){return false;}
 function premiumSplashHtml(){return '';} function applyStrictLanguageUiLiterals(){} function ensureStrictLanguageObserver(){}
 function bindCommon(){if(route.name==='errorreplay')bindErrorReplay();}
 function bindViewSpecific(){} function errorReplayQuestion(id){return {id};}
 function errorReplayMarkViewed(){} function errorReplayMarkCompleted(id){completed.push(id);}
 function drivingTwinLoopMarkReplayComplete(){} function drivingTwinLoopStartTest(){}
 function t(k){return k;} function replayUi(it,en){return settings.lang==='it'?it:en;}
 var views={errorreplay(){rebuild();return 'replay';},home(){rebuild();return 'home';},quiz(){rebuild();return 'quiz';}};
 `);
 const names=['esc','isItalianAssisted','isMalteseMode','lang3','questionText','questionAnswers','questionExplanation','render','go','bindErrorReplay','renderReplayStable','replayAdvanceTo','replayRemoveMobileContinueDock','replayMountMobileContinueDock','errorReplayOpen','errorReplaySearch','mountInteractiveReplayDecision','nextQuestion','confirmAnswer','finishQuiz','saveSession','requestExitQuiz'];
 h.eval(names.map(n=>fn(n)).join('\n'));
 // Use the actual installed wrapper, not an idealised renderer preserving options.
 h.eval(core.match(/const oldRender=render;render=function\(\)\{oldRender\(\);bindViewSpecific\(\)\};/)[0]);
 rebuild();h.eval('bindErrorReplay()');
 return Object.assign(h,{screen,ids,frames,scrolls,completed,layout,click,
  flush(){while(frames.length)frames.shift()();},
  top(){return layout.sceneTop-c.scrollY;},
  gridTop(){return layout.sceneTop+(layout.phase===0?layout.oldHeight:layout.nextHeight)+layout.gridGap-c.scrollY;},
  dock(){return screen.querySelector('[data-replay-mobile-continue-dock]')?.querySelector('[data-replay-mobile-continue]');}
 });
}
function quizFlow(options={}){
 const h=navigation(options);
 h.eval(`route={name:'quiz',data:null};
 quiz={list:[{id:'Q1',question:'English one',question_it:'Italiano uno',question_mt:'Malti wieħed',answers:['Yes','No'],answers_it:['Sì','No'],answers_mt:['Iva','Le'],correct:[0]},{id:'Q2',question:'English two',question_it:'Italiano due',question_mt:'Malti tnejn',answers:['Yes','No'],answers_it:['Sì','No'],answers_mt:['Iva','Le'],correct:[0]}],index:0,mode:'guided',answers:{},selected:[],answered:false,returnRoute:'lptv',returnData:{category:'test'},showTranslation:false};
 function aiCaptureResponseMs(){return 250;} function recordActivity(){} function updateReviewSchedule(){} function aiRecordPatternAttempt(){}
 function pilotAnalyticsTrack(){} function pilotAnalyticsPackFromRoute(){return 'test';}
 function modeLabel(v){return v;} function questionCategory(){return 'test';}
 function languageTwinStudyText(q){return questionText(q);} function languageTwinStudyAnswers(q){return questionAnswers(q);}
 function languageTwinSupportAnswers(){return [];} function languageTwinShouldShowSupport(){return false;}
 function languageTwinAdaptiveHintsHtml(){return '';} function quizLanguageTwinLabel(){return '';}
 function isFavourite(){return false;} function questionVisualHtml(){return '';} function questionAnswerVisual(){return '';}
 function applyReview(){} function selectOption(){}
 `);
 h.eval(fn('renderQuiz'));h.eval('renderQuiz();saveSession();');return h;
}
module.exports={navigation,quizFlow,Element,click,fn,core};
