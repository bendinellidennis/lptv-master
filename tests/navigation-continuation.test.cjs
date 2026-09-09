'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {navigation,quizFlow,Element,fn,core}=require('./helpers/navigation-runtime.cjs');

test('NAV-01: mobile Continue advances and reveals the next scene, not the grid',()=>{
 const h=navigation();h.eval("replayMountMobileContinueDock(1,'Q1')");const event=h.click(h.dock());h.flush();
 assert.equal(h.eval('errorReplayStep'),1);assert.equal(h.eval('route.name'),'errorreplay');assert.equal(h.eval('route.data.questionId'),'Q1');
 assert.equal(event.prevented,true);assert.equal(event.stopped,true);assert.equal(h.top(),10);assert.ok(h.gridTop()>0);
});
for(const phase of [1,2])test(`NAV-02.${phase}: phase ${phase+1} Continue advances with destination visible`,()=>{
 const h=navigation({phase});h.click(h.screen.querySelector('[data-replay-phase-continue]'));h.flush();assert.equal(h.eval('errorReplayStep'),phase+1);assert.equal(h.top(),10);assert.equal(h.eval('route.data.questionId'),'Q1');
});
test('NAV-03: final Replay phase records completion once and has no further Continue',()=>{
 const h=navigation({phase:2});const button=h.dock();h.click(button);h.flush();assert.equal(h.eval('errorReplayStep'),3);assert.deepEqual(h.completed,['Q1']);assert.equal(h.dock(),undefined);
 h.click(button);assert.deepEqual(h.completed,['Q1']);assert.equal(h.eval('errorReplayStep'),3);
});
test('NAV-04: duplicate tap on detached Continue cannot skip a phase',()=>{
 const h=navigation();h.eval("replayMountMobileContinueDock(1,'Q1')");const button=h.dock();h.click(button);h.click(button);h.flush();assert.equal(h.eval('errorReplayStep'),1);assert.equal(h.context.historyCalls.length,0);
});
test('NAV-05: invalid/non-sequential targets do not alter the flow',()=>{
 const h=navigation();for(const value of ['NaN','Infinity','-1','0','2','1.5'])h.eval(`replayAdvanceTo(${value},'Q1')`);assert.equal(h.eval('errorReplayStep'),0);assert.equal(h.scrolls.length,0);
});
for(const film of [false,true])test(`NAV-06.${Number(film)}: focus works with ${film?'film':'main-card fallback'} anchor`,()=>{
 const h=navigation({film,offset:1800});h.eval("replayAdvanceTo(1,'Q1')");assert.equal(h.top(),10);assert.equal(h.frames.length,0);assert.equal(h.eval('errorReplayAutoFocusScene'),false);
});
test('NAV-07: Continue has no pending scroll able to hijack subsequent Home navigation',()=>{
 const h=navigation();h.eval("replayAdvanceTo(1,'Q1');go('home')");assert.equal(h.frames.length,0);h.flush();assert.equal(h.eval('route.name'),'home');assert.equal(h.context.scrollY,0);
});
test('NAV-08: previous Replay stage remains reachable with the existing stable render',()=>{
 const h=navigation({phase:2,offset:120});h.click(h.screen.querySelectorAll('[data-replay-stage]')[1]);h.flush();assert.equal(h.eval('errorReplayStep'),1);assert.equal(h.eval('route.name'),'errorreplay');assert.equal(h.top(),-120);
});
test('NAV-09: opening another question from the explicit Replay list still works',()=>{
 const h=navigation({phase:2});h.click(h.screen.querySelector('[data-replay-open]'));assert.equal(h.eval('route.data.questionId'),'Q2');assert.equal(h.eval('errorReplayStep'),0);assert.equal(h.top(),10);assert.equal(h.context.historyCalls.length,1);
});
function decision(){
 const h=navigation(),panel=new Element(),host=new Element();panel.selectors.set('[data-interactive-replay-decision]',[host]);
 const wrong=new Element(),right=new Element();wrong.dataset.interactiveChoice='wrong';right.dataset.interactiveChoice='right';host.selectors.set('[data-interactive-choice]',[wrong,right]);
 h.context.panel=panel;h.eval(`function interactiveReplayConfig(){return {choices:[{id:'wrong',correct:false,consequence:'risk'},{id:'right',correct:true,consequence:'safe'}]};}function interactiveReplayRecord(){}function interactiveReplayText(v){return v;}mountInteractiveReplayDecision(panel,{id:'Q1'});`);return {h,host,wrong,right};
}
test('NAV-10: wrong interactive decision stays in the current phase without Continue',()=>{
 const {h,wrong}=decision();h.click(wrong);assert.equal(h.eval('errorReplayStep'),0);assert.equal(h.dock(),undefined);assert.equal(h.eval('route.name'),'errorreplay');
});
test('NAV-11: correct interactive decision creates Continue and reveals the next phase',()=>{
 const {h,right}=decision();h.click(right);assert.ok(h.dock());h.click(h.dock());h.flush();assert.equal(h.eval('errorReplayStep'),1);assert.equal(h.top(),10);
});
test('NAV-12: wrong then correct decision advances once through the inline Continue handler',()=>{
 const {h,host,wrong,right}=decision();h.click(wrong);h.click(right);h.click(host.children.find(n=>n.dataset.hazardContinue));h.flush();assert.equal(h.eval('errorReplayStep'),1);assert.equal(h.top(),10);
});
test('NAV-13: normal question continuation keeps the quiz and advances its index',()=>{
 const h=quizFlow();h.click(h.ids.get('#quizNext'));assert.equal(h.eval('quiz.index'),1);assert.equal(h.eval('route.name'),'quiz');assert.equal(h.ids.get('#quizQuestion').textContent,'English two');
});
for(const correct of [true,false])test(`NAV-14.${Number(correct)}: ${correct?'correct':'wrong'} answer followed by Next keeps the next question`,()=>{
 const h=quizFlow();h.eval(`quiz.selected=[${correct?0:1}];`);h.click(h.ids.get('#quizConfirm'));assert.equal(h.eval("quiz.answers.Q1.ok"),correct);h.click(h.ids.get('#quizNext'));assert.equal(h.eval('quiz.index'),1);assert.equal(h.eval('route.name'),'quiz');assert.equal(h.eval('quiz.answered'),false);assert.equal(h.eval("quiz.answers.Q1.ok"),correct);
});
test('NAV-15: final question opens results, not the list, preserving return context',()=>{
 const h=quizFlow();h.eval('quiz.index=1;renderQuiz();');h.click(h.ids.get('#quizNext'));assert.equal(h.eval('quiz'),null);assert.equal(h.eval('route.name'),'result');assert.equal(h.eval('route.data.total'),2);assert.equal(h.eval('route.data.returnRoute'),'lptv');
});
test('NAV-16: voluntary quiz Exit still returns to its list and clears the active session',()=>{
 const h=quizFlow();h.click(h.ids.get('#quizExit'));assert.equal(h.eval('route.name'),'lptv');assert.equal(h.eval('quiz'),null);assert.equal(h.eval('localStorage.getItem(SESSION)'),null);assert.equal(h.eval('route.data.category'),'test');
});
for(const lang of ['it','en','mt'])test(`NAV-17.${lang}: Replay question stays in the same language after Continue`,()=>{
 const h=navigation({lang});h.eval(`var sample={question:'English question',question_it:'Traduzione italiana',question_mt:'Mistoqsija bil-Malti'};`);
 // Execute the exact production question-heading template, with no language overrides.
 const source=fn('errorReplayViewHtml'),head=source.match(/<div class="replay-question-head">[\s\S]*?<\/div>/)[0];
 h.eval(`var question=sample,scenario={labelIt:'Scenario',labelEn:'Scenario'};function heading(){return \`${head}\`;}`);
 const before=h.eval('heading()');h.eval("replayAdvanceTo(1,'Q1')");assert.equal(h.eval('heading()'),before);
 assert.equal(before.includes('English question'),lang!=='mt');assert.equal(before.includes('Traduzione italiana'),lang==='it');assert.equal(before.includes('Mistoqsija bil-Malti'),lang==='mt');
});
test('NAV-18: existing stable rerender itself is unchanged for non-advancing operations',()=>{
 const h=navigation({offset:220});h.eval('renderReplayStable()');h.flush();assert.equal(h.top(),-220);assert.equal(h.eval('errorReplayStep'),0);
});
function bindBack(h){
 h.context.backBtn=new Element();
 const start=core.indexOf('backBtn.onclick=()=>'),end=core.indexOf(";document.querySelector('.brand')",start);
 assert.ok(start>0&&end>start);h.eval(core.slice(start,end));
 const popStart=core.indexOf('window.onpopstate=e=>'),popEnd=core.indexOf(";window.addEventListener('beforeunload'",popStart);
 assert.ok(popStart>0&&popEnd>popStart);h.eval(core.slice(popStart,popEnd));
}
test('NAV-19: Back from Replay still delegates to browser history/popstate',()=>{
 const h=navigation();bindBack(h);let backCalls=0;h.context.history.back=()=>{backCalls++;h.context.onpopstate({state:{name:'errorreplay',data:{questionId:'Q0'}}});};
 h.eval("replayAdvanceTo(1,'Q1')");h.click(h.context.backBtn);h.flush();assert.equal(backCalls,1);assert.equal(h.eval('route.data.questionId'),'Q0');assert.equal(h.context.scrollY,0);
});
test('NAV-20: Back from a guided question still returns to the originating list',()=>{
 const h=quizFlow();bindBack(h);h.click(h.context.backBtn);assert.equal(h.eval('route.name'),'lptv');assert.equal(h.eval('route.data.category'),'test');assert.equal(h.eval('quiz'),null);
});
test('NAV-21: voluntary category Back keeps its existing list position',()=>{
 const h=navigation({phase:1}),back=new Element();h.screen.selectors.set('[data-interactive-category-back]',[back]);
 h.eval("interactiveReplayOpenCategory='junctions';interactiveReplayCategoryReturnScroll=150;bindErrorReplay()");h.click(back);h.flush();assert.equal(h.eval('interactiveReplayOpenCategory'),'');assert.equal(h.context.scrollY,150);assert.equal(h.eval('route.name'),'errorreplay');
});
test('NAV-22: Restart still returns to phase one, keeping the selected question',()=>{
 const h=navigation({phase:3,offset:100});h.click(h.ids.get('#errorReplayRestart'));h.flush();assert.equal(h.eval('errorReplayStep'),0);assert.equal(h.eval('route.data.questionId'),'Q1');assert.equal(h.top(),-100);
});
