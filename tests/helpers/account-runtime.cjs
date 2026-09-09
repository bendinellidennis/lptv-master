'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..','..'),core=fs.readFileSync(path.join(root,'app-3994-458293-part-b1.js'),'utf8');
// Execute production declarations/functions. No copied isolation implementation.
function declaration(name){
 const m=new RegExp('\\b(?:const|let) '+name+'\\b','m').exec(core);if(!m)throw Error('Declaration: '+name);
 for(let end=core.indexOf(';',m.index);end>=0;end=core.indexOf(';',end+1)){
  const text=core.slice(m.index,end+1);try{new vm.Script(text);return text;}catch(_){if(text.length>50000)throw Error('Declaration too long: '+name);}
 }
}
function fn(name,source=core){
 const m=new RegExp('^(?:async )?function '+name+'\\(','m').exec(source);if(!m)throw Error('Function: '+name);
 const first=source.indexOf('\n',m.index),line=source.slice(m.index,first);
 if(line.endsWith('}'))return line;
 for(let end=source.indexOf('\n}',m.index);end>=0;end=source.indexOf('\n}',end+2)){const text=source.slice(m.index,end+2);try{new vm.Script(text);return text;}catch(_){if(text.length>80000)throw Error('Function parse: '+name);}}
 throw Error(name);
}
const stateNames=['progress','schoolPreferences','schoolCompare','schoolPartnerDraft','errorReplay','cloudReady','accountEnrollment','missionSystem','aiInstructor','instructorPortal','schoolPortal','zeroErrorState','examDayState','recoveryState','coachState','onboarding','privacyPreferences','pilotAnalytics','schoolDashboard','personalRoadmap','lptvPassport','userProfile','countryPackEngineState','licensePackEngineState','languageTwin','realRoadTwin','realRoadTelemetryStore','mdmProductionPermissionState','mdmProductionSyncState','schoolOperationsProductionState','securityTrustState'];
const otherNames=['settings','quiz','bridgeState','flashState','timerId','mdmLearningSyncState','mdmServerMissions','mdmSchoolStudentMissions','mdmServerRoster','mdmPlatformOwnerGate','mdmProtectedContentStatus','mdmSchoolAdminConsole','mdmPortableSyncState','mdmLearningSyncInFlight','mdmServerRosterInFlight','mdmProductionSyncInFlight','mdmSchoolAdminInFlight','mdmEnrollmentInFlight','mdmPortableSyncInFlight','mdmPlatformOwnerGateInFlight','mdmProtectedContentInFlight','mdmPortableSyncApplying','mdmPortableSyncTimer','instructorStudioObjectUrls','realRoadTelemetryRuntime','mdmAuthSession','mdmAuthGeneration','mdmAuthInFlight','mdmAuthRefreshInFlight'];
const functionNames=['clone','load','save','createRegistrationId','normaliseAiRecoveryPlan','mdmAccountOwnData','mdmAccountRehydrateData','instructorStudioClearObjectUrls','realRoadTelemetryDetach','schoolOperationsDefault','schoolOperationsLoad','schoolOperationsSave','fleetCorporateDefault','fleetCorporateLoad','fleetCorporateSave','mdmDataRpc','mdmDataErrorMessage','mdmPortableSyncMeta','mdmPortableSyncMetaSave','mdmPortableSyncMarkDirty','mdmPortableSnapshotItems','mdmPortablePayload','mdmPortablePayloadValid','mdmPortableStudyScore','mdmPortableParseRaw','mdmPortableApplyPayload','mdmPortableServerPull','mdmPortableServerPush','mdmPortableSyncReconcile','mdmPortableSyncForceRestore','mdmPortableSyncForceUpload','mdmStudentRefreshMissions','mdmSchoolRefreshStudentMissions','schoolRosterRefreshServer','mdmServerRosterReset','schoolOperationsProductionProbe','schoolOperationsProductionResetForAccount','schoolOperationsProductionAuthScope','schoolOperationsProductionSave','mdmProductionSyncPullPreview','mdmProductionSyncSave','mdmProductionSyncClone','mdmProductionSyncEntity','mdmProductionSyncRecordKey','mdmProductionSyncKey','mdmProductionSyncMergeServerVersions','mdmEnsureFreshAuthForData','mdmAuthParse','mdmAuthIsCurrent','mdmAuthAdvanceGeneration','mdmAuthBeginSession','mdmAuthSave','mdmAuthStoreResponse','mdmAuthFresh','mdmAuthSummary','mdmAuthClear','instructorStudioOpenDb','instructorStudioMediaGet','instructorStudioMediaPut','instructorStudioMediaDelete','importBackup'];
// Functions not used by a test can remain unresolved until called; missing
// functions in this list are removed only when they are genuinely absent.
const productionFunctions=[...new Set([...functionNames,...Array.from(core.matchAll(/^(?:async )?function (mdmPortable\w+)\(/gm),m=>m[1])])].filter(n=>new RegExp('^(?:async )?function '+n+'\\(','m').test(core)).map(n=>fn(n)).join('\n');
const declarations=new Map();
function addDecl(name){if(declarations.has(name))return;const text=declaration(name);declarations.set(name,null);
 for(const id of new Set(text.match(/\b[A-Z][A-Z0-9_]+\b/g)||[])){if(id!==name&&new RegExp('\\b(?:const|let) '+id+'\\b','m').test(core))addDecl(id);}
 declarations.set(name,text);
}
for(const n of [...stateNames,...otherNames,'MDM_PORTABLE_SYNC_KEYS','MDM_PORTABLE_SYNC_META_KEY','MDM_PORTABLE_SYNC_SCHEMA','MDM_PORTABLE_SYNC_PREFIXES','SESSION','SCHOOL_OPERATIONS_KEY','FLEET_CORPORATE_KEY','INSTRUCTOR_STUDIO_DB','INSTRUCTOR_STUDIO_STORE','SCHOOL_DEMOS'])addDecl(n);
// Declare constants first, then the production lexical state in source order.
const constants=[...declarations].filter(([n])=>!stateNames.includes(n)&&!otherNames.includes(n)).map(([,s])=>s).join('\n');
const variables=[...stateNames,...otherNames].sort((a,b)=>core.indexOf(declaration(a))-core.indexOf(declaration(b))).map(n=>declaration(n)).join('\n');
const startupSource=productionFunctions+'\n'+[...new Set(declarations.values())].sort((a,b)=>core.indexOf(a)-core.indexOf(b)).join('\n');
const AUTH='mdm_auth_session_v4410',SCHOOL='mdm_school_operations_45824',FLEET='mdm_fleet_corporate_45825',CACHE='mdm-school-evidence-cache-v1';
const session=(id,generation=1)=>({status:'authenticated',generation,user:{id,email:id.toLowerCase()+'@example.test'},accessToken:'access-'+id,refreshToken:'refresh-'+id,expiresAt:Date.now()+3600000});
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
async function tick(){for(let i=0;i<5;i++)await Promise.resolve();}
function harness(seed={},initial='A'){
 class Storage{constructor(){this.data=new Map();}getItem(k){return this.data.has(String(k))?this.data.get(String(k)):null;}setItem(k,v){this.data.set(String(k),String(v));}removeItem(k){this.data.delete(String(k));}key(i){return [...this.data.keys()][i]||null;}get length(){return this.data.size;}clear(){this.data.clear();}}
 const local=new Storage(),sessionStore=new Storage();for(const[k,v]of Object.entries(seed))local.setItem(k,typeof v==='string'?v:JSON.stringify(v));if(initial)local.setItem(AUTH,JSON.stringify(session(initial)));
 const events=new Map(),documentEvents=new Map(),requests=[],fetches=[],timers=[],clearedTimers=[],readers=[],dbOpens=[];
 const element=()=>({querySelector:()=>null,querySelectorAll:()=>[],classList:{add(){},remove(){},contains(){return false;}},remove(){},addEventListener(){}});
 const context={console,crypto:{subtle:{digest:async(_algorithm,input)=>Uint8Array.from(require('node:crypto').createHash('sha256').update(input).digest()).buffer}},AbortController,URLSearchParams,history:{pushState(){},replaceState(){}},Storage,localStorage:local,sessionStorage:sessionStore,URL:{revokeObjectURL(){}},Blob,Date,Math,JSON,Set,WeakMap,WeakSet,Promise,TextEncoder,Uint8Array,ArrayBuffer,location:{href:'https://example.test/#home',hash:'#home',hostname:'localhost',reload(){throw Error('Unexpected reload');}},navigator:{geolocation:{clearWatch(){}}},document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener(n,f){if(!documentEvents.has(n))documentEvents.set(n,[]);documentEvents.get(n).push(f);},createElement:element,head:{appendChild(){}},body:element()},setTimeout:(f,ms)=>{timers.push({f,ms});return timers.length;},clearTimeout(id){clearedTimers.push(id);if(timers[id-1])timers[id-1].cancelled=true;},setInterval:(f,ms)=>{timers.push({f,ms});return timers.length;},clearInterval(){},addEventListener:(n,f)=>{if(!events.has(n))events.set(n,[]);events.get(n).push(f);},removeEventListener(){},MDM_BACKEND_CONFIG:{enabled:true,endpoint:'https://example.test',publishableKey:'test-public-key'},BUILD_VERSION:'test-build',C:{},Q:[],screen:element(),toast(){},render(){},t:k=>k,lang3:(it,en)=>en,confirm:()=>true,FileReader:class{constructor(){readers.push(this);}readAsText(){}},XMLHttpRequest:class{constructor(){this.status=0;this.responseText='';this.headers={};requests.push(this);}open(method,url){this.method=method;this.url=url;}setRequestHeader(k,v){this.headers[k]=v;}send(body){this.body=body;}},fetch:(url,options)=>{const d=deferred();fetches.push({url,options,...d});return d.promise;},indexedDB:{open(name){const req={};dbOpens.push({name,req});return req;}}};
 context.window=context;vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(root,'mdm-account-isolation-safe-45831532.js'),'utf8'),context);
 vm.runInContext(startupSource,context);
 vm.runInContext("function accountEnrollmentBindToAuthUser(){};function mdmBackendPublicConfig(){return window.MDM_BACKEND_CONFIG;} window.MDM_ACCOUNT_ISOLATION_SAFE.subscribe(mdmAccountRehydrateData);",context);
 const api=context.MDM_ACCOUNT_ISOLATION_SAFE;
 return {context,api,local,sessionStore,events,documentEvents,requests,fetches,timers,clearedTimers,readers,dbOpens,eval:code=>vm.runInContext(code,context),login(id){context.nextUser=id;vm.runInContext("{const nextGen=mdmAuthBeginSession(nextUser.toLowerCase()+'@example.test');mdmAuthStoreResponse({access_token:'access-'+nextUser,refresh_token:'refresh-'+nextUser,expires_in:3600,user:{id:nextUser,email:nextUser.toLowerCase()+'@example.test'}},'',nextGen);}",context);},logout(){vm.runInContext('mdmAuthClear();',context);},respond(index,body,status=200){const r=requests[index];assert.ok(r,'Expected actual RPC request');r.status=status;r.responseText=JSON.stringify(body);r.onload();},module(file){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);}};
}
function write(h,k,v){h.context.testValue=v;h.context.testKey=k;return h.eval('save(testKey,testValue)');}
function read(h,k){return JSON.parse(h.local.getItem(k)||'null');}

module.exports={harness,fn,deferred,tick,read,write,core,session,AUTH,SCHOOL,FLEET,CACHE};
