'use strict';
// Run with: node --test tests/auth-session-lifecycle.test.cjs
// Execute production Auth functions unchanged. Only network, storage and UI
// boundaries are doubled; requests are settled explicitly, without timers.
const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const core=fs.readFileSync(path.join(root,'app-3994-458293-part-b1.js'),'utf8');
const gate=fs.readFileSync(path.join(root,'mdm-signed-out-neutral-45831551.js'),'utf8');
const links=fs.readFileSync(path.join(root,'mdm-pilot-school-dashboard-4583147.js'),'utf8');
const AUTH_KEY='mdm_auth_session_v4410';

function exactFunction(source,name){
 const match=new RegExp('^( *)(?:async )?function '+name+'\\(','m').exec(source);
 assert.ok(match,'Production function missing: '+name);
 const lineEnd=source.indexOf('\n',match.index);
 if(source.slice(match.index,lineEnd).trimEnd().endsWith('}'))return source.slice(match.index,lineEnd);
 const end=source.indexOf('\n'+match[1]+'}',lineEnd);
 assert.ok(end>lineEnd,'Production function boundary missing: '+name);
 return source.slice(match.index,end+match[1].length+2);
}
const coreNames=['mdmAuthSave','mdmAuthParse','mdmAuthErrorMessage','mdmAuthCredentialsInvalid',
 'mdmAuthRecordFailure','mdmAuthFresh','mdmAuthStoreResponse','mdmAuthClear','mdmAuthRequest',
 'mdmAuthRefreshSession','mdmAuthVerifySession','mdmAuthReadCredentials','mdmAuthSignUp',
 'mdmAuthSignIn','mdmAuthSignOut','mdmAuthRestoreIfNeeded'];
const declarations=core.slice(core.indexOf('const MDM_AUTH_SESSION_KEY='),core.indexOf('const MDM_AUTH_ATTEMPT_KEY='));
const source=declarations+'\n'+coreNames.map(n=>exactFunction(core,n)).join('\n');
const payload=(id='A',suffix='NEW')=>({access_token:id+'_ACCESS_'+suffix,refresh_token:id+'_REFRESH_'+suffix,
 expires_in:3600,user:{id,email:id.toLowerCase()+'@example.invalid'}});
const initial=()=>({status:'authenticated',email:'a@example.invalid',user:{id:'A',email:'a@example.invalid'},
 accessToken:'A_ACCESS',refreshToken:'A_REFRESH',expiresAt:Date.now()+3600000});
const tick=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};

function harness({session=initial(),storage=new Map(),seed=true}={}){
 if(seed)storage.set(AUTH_KEY,JSON.stringify(session));
 const requests=[],fetches=[],timers=[],effects={renders:0,reloads:0,sync:0,binds:[],notes:[],busy:[]};
 const elements=new Map();
 for(const id of ['mdmAuthEmail','mdmStableAuthEmail'])elements.set(id,{value:'b@example.invalid'});
 for(const id of ['mdmAuthPassword','mdmStableAuthPassword','mdmRecoveryPassword','mdmRecoveryPassword2'])elements.set(id,{value:'synthetic-password'});
 for(const id of ['mdmStableAuthSignIn','mdmStableAuthSignUp','mdmStableAuthRecover','mdmRecoveryPasswordSave','mdmRecoveryPasswordNote','mdmSignedOutAuthNote'])elements.set(id,{style:{},textContent:'',disabled:false});
 const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)};
 class XHR{
  open(method,url){this.method=method;this.url=url;this.headers={};}
  setRequestHeader(k,v){this.headers[k]=v;}
  send(body){this.body=body;requests.push(this);}
 }
 const cfg={enabled:true,endpoint:'https://auth.example.invalid',publishableKey:'synthetic-public-key'};
 const location={href:'https://app.example.invalid/',hash:'',reload(){effects.reloads++;}};
 const c=vm.createContext({Date,JSON,Promise,Map,Set,URL,URLSearchParams,console,XMLHttpRequest:XHR,
  localStorage,sessionStorage:{setItem(){}},window:{MDM_BACKEND_CONFIG:cfg},location,
  history:{state:null,replaceState(_state,_title,url){location.href=new URL(url,location.href).href;location.hash=new URL(location.href).hash;}},
  document:{getElementById:id=>elements.get(id)||null},$:selector=>elements.get(selector.slice(1)),
  fetch:(url,options)=>new Promise((resolve,reject)=>fetches.push({url,options,resolve,reject})),
  load:(k,fallback)=>storage.has(k)?JSON.parse(storage.get(k)):fallback,
  save:(k,v)=>storage.set(k,JSON.stringify(v)),
  mdmBackendPublicConfig:()=>cfg,mdmAuthAttemptAllowed:()=>({ok:true}),mdmAuthAttemptSuccess(){},mdmAuthAttemptFail(){},
  accountEnrollment:{role:'student'},userProfile:{},BUILD_VERSION:'test',
  accountEnrollmentBindToAuthUser:id=>effects.binds.push(id),mdmSchoolAdminReset(){},mdmPlatformOwnerReset(){},
  render(){effects.renders++;},toast:message=>effects.notes.push(message),lang3:(it,en)=>en,
  setTimeout:fn=>timers.push(fn),accountRefreshSchoolAdminConsole(){effects.sync++;},
  mdmRefreshPlatformOwnerGate(){effects.sync++;},mdmPortableSyncReconcile(){effects.sync++;}
 });
 vm.runInContext(source,c);
 const gateNames=['readSession','authenticated','authErrorMessage','storeAuthenticatedSession','saveRecoveryPassword','directAuth'];
 vm.runInContext(`(function(){const AUTH_KEY=${JSON.stringify(AUTH_KEY)},VERSION='test';let emailDraft='';
 let recoverySession={accessToken:'RECOVERY_ACCESS',refreshToken:'RECOVERY_REFRESH',expiresIn:3600};
 function t(it,en){return en;} function authNote(){} function setAuthBusy(){} async function requestPasswordSetup(){return true;}
 ${gateNames.map(n=>exactFunction(gate,n)).join('\n')}
 window.testGate={directAuth,saveRecoveryPassword};})();`,c);
 vm.runInContext(`(function(){function cfg(){return {endpoint:'https://auth.example.invalid',key:'synthetic-public-key'};}
 function jwtExpired(){return false;} function showStudentNotice(){} function syncInviteLoginEmail(){} function lang3(it,en){return en;}
 ${exactFunction(links,'adoptMagicLinkSession')}
 window.testLinks={adoptMagicLinkSession};})();`,c);
 const run=expression=>vm.runInContext(expression,c);
 const snapshot=()=>JSON.parse(run('JSON.stringify(mdmAuthSession)'));
 const stored=()=>JSON.parse(storage.get(AUTH_KEY));
 const respond=(index,status,data='',kind='load')=>{
  const xhr=requests[index];assert.ok(xhr,'Missing XHR '+index);
  xhr.status=status;xhr.responseText=typeof data==='string'?data:JSON.stringify(data);
  xhr['on'+kind]();
 };
 const fetched=(index,status,data)=>{assert.ok(fetches[index]);fetches[index].resolve({ok:status>=200&&status<300,status,
  text:async()=>JSON.stringify(data),json:async()=>data});};
 const login=(id='B')=>{c.testPayload=payload(id);const generation=run('window.MDM_AUTH_LIFECYCLE.begin()');
  c.testGeneration=generation;assert.equal(run('window.MDM_AUTH_LIFECYCLE.store(testGeneration,testPayload,testPayload.user.email)'),true);return generation;};
 return {c,run,snapshot,stored,respond,fetched,login,requests,fetches,timers,effects,storage,elements};
}
function signedOut(h){
 for(const s of [h.snapshot(),h.stored()]){
  assert.equal(s.status,'signed_out');assert.equal(s.accessToken,'');assert.equal(s.refreshToken,'');assert.equal(s.user,null);
 }
 assert.equal(h.run('mdmAuthFresh()'),false);
}

test('AUTH-01: logout is immediate and a refresh completing after server logout cannot restore credentials',async()=>{
 const h=harness(),refresh=h.run('mdmAuthRefreshSession()'),logout=h.run('mdmAuthSignOut()');
 signedOut(h);assert.equal(h.stored().generation,1);
 assert.ok(h.requests[1].url.endsWith('/logout?scope=local'));
 assert.equal(h.requests[1].headers.Authorization,'Bearer A_ACCESS');
 h.respond(1,204);await logout;h.respond(0,200,payload());
 assert.equal(await refresh,false);signedOut(h);assert.deepEqual(h.effects.binds,['A','']);
});

test('AUTH-01: late refresh is discarded even before logout server response arrives',async()=>{
 const h=harness(),refresh=h.run('mdmAuthRefreshSession()'),logout=h.run('mdmAuthSignOut()');
 h.respond(0,200,payload());assert.equal(await refresh,false);signedOut(h);
 h.respond(1,0,'','timeout');await logout;signedOut(h);
});

for(const [status,kind,body] of [[0,'timeout',''],[0,'error',''],[0,'abort',''],[408,'load',{code:'request_timeout'}],
 [409,'load',{code:'conflict'}],[429,'load',{code:'over_request_rate_limit'}],[503,'load',{message:'unavailable'}]]){
 test(`AUTH-02: refresh ${status}/${kind} retains credentials and a subsequent retry succeeds`,async()=>{
  const h=harness(),refresh=h.run('mdmAuthRefreshSession()');h.respond(0,status,body,kind);
  assert.equal(await refresh,false);assert.equal(h.snapshot().refreshToken,'A_REFRESH');
  assert.equal(h.run('mdmAuthFresh()'),true);assert.equal(h.stored().generation,0);
  const retry=h.run('mdmAuthRefreshSession()');h.respond(1,200,payload());
  assert.equal(await retry,true);assert.equal(h.stored().refreshToken,'A_REFRESH_NEW');
 });
}

test('AUTH-03: simultaneous refresh callers share one promise and one rotating-token request',async()=>{
 const h=harness(),first=h.run('mdmAuthRefreshSession()'),second=h.run('mdmAuthRefreshSession()');
 assert.equal(first,second);assert.equal(h.requests.length,1);
 h.respond(0,200,payload());assert.deepEqual(await Promise.all([first,second]),[true,true]);
 assert.equal(h.run('mdmAuthFresh()'),true);assert.equal(h.stored().refreshToken,'A_REFRESH_NEW');
});

test('AUTH-03: a failed shared refresh can be retried once by concurrent callers',async()=>{
 const h=harness(),first=h.run('mdmAuthRefreshSession()'),second=h.run('mdmAuthRefreshSession()');
 h.respond(0,0,'','timeout');assert.deepEqual(await Promise.all([first,second]),[false,false]);
 const retry=h.run('mdmAuthRefreshSession()'),joined=h.run('mdmAuthRefreshSession()');
 assert.equal(retry,joined);assert.equal(h.requests.length,2);h.respond(1,200,payload());
 assert.deepEqual(await Promise.all([retry,joined]),[true,true]);
});

test('valid token: verify keeps the authenticated state, preserves expiry and does not refresh',async()=>{
 const h=harness(),expiry=h.snapshot().expiresAt,verify=h.run('mdmAuthVerifySession({silent:true})');
 assert.equal(h.run('mdmAuthFresh()'),true);h.respond(0,200,initial().user);
 assert.equal(await verify,true);assert.equal(h.requests.length,1);assert.equal(h.stored().expiresAt,expiry);
 assert.equal(h.stored().accessToken,'A_ACCESS');assert.equal(h.stored().user.id,'A');
});

for(const response of [{status:200,body:initial().user},{status:401,body:{code:'bad_jwt'}},{status:0,body:'',kind:'timeout'}]){
 test(`verify ${response.status} arriving after logout cannot restore or change the new session`,async()=>{
  const h=harness(),verify=h.run('mdmAuthVerifySession({silent:true})'),logout=h.run('mdmAuthSignOut()');
  signedOut(h);h.login('B');const before=h.stored();
  h.respond(0,response.status,response.body,response.kind||'load');assert.equal(await verify,false);
  h.respond(1,204);await logout;assert.deepEqual(h.stored(),before);assert.equal(h.snapshot().user.id,'B');
 });
}

test('verify timeout retains valid credentials and can recover without signing in again',async()=>{
 const h=harness(),verify=h.run('mdmAuthVerifySession({silent:true})');h.respond(0,0,'','timeout');
 assert.equal(await verify,false);assert.equal(h.run('mdmAuthFresh()'),true);
 const retry=h.run('mdmAuthVerifySession({silent:true})');h.respond(1,200,initial().user);
 assert.equal(await retry,true);assert.equal(h.stored().refreshToken,'A_REFRESH');
});

test('verify 401 followed by a transient refresh failure must not reinterpret the first 401 as final invalidation',async()=>{
 const h=harness(),verify=h.run('mdmAuthVerifySession({silent:true})');h.respond(0,401,{code:'bad_jwt'});await tick();
 h.respond(1,0,'','timeout');assert.equal(await verify,false);assert.equal(h.stored().refreshToken,'A_REFRESH');
 const retry=h.run('mdmAuthVerifySession({silent:true})');h.respond(2,401,{code:'bad_jwt'});await tick();
 h.respond(3,200,payload());await tick();h.respond(4,200,initial().user);assert.equal(await retry,true);
});

test('verify joins an existing refresh and a logout cancels the second user verification',async()=>{
 const h=harness(),refresh=h.run('mdmAuthRefreshSession()'),verify=h.run('mdmAuthVerifySession({silent:true})');
 h.respond(1,401,{code:'bad_jwt'});await tick();assert.equal(h.requests.length,2);
 h.respond(0,200,payload());assert.equal(await refresh,true);await tick();assert.equal(h.requests.length,3);
 const logout=h.run('mdmAuthSignOut()');h.respond(2,200,initial().user);
 assert.equal(await verify,false);signedOut(h);h.respond(3,204);await logout;
});

test('restore with only a refresh token works and remains fenced by logout',async()=>{
 const h=harness({session:{...initial(),accessToken:''}}),verify=h.run('mdmAuthVerifySession({silent:true})');
 h.respond(0,200,payload());assert.equal(await verify,true);
 const other=harness({session:{...initial(),accessToken:''}}),late=other.run('mdmAuthVerifySession({silent:true})');
 await other.run('mdmAuthSignOut()');other.respond(0,200,payload());assert.equal(await late,false);signedOut(other);
});

for(const code of ['refresh_token_not_found','refresh_token_already_used','session_not_found','session_expired','invalid_grant']){
 test(`real credential rejection ${code} clears the session, while a later explicit login still works`,async()=>{
  const h=harness(),refresh=h.run('mdmAuthRefreshSession()');h.respond(0,400,{code});
  assert.equal(await refresh,false);signedOut(h);h.login();assert.equal(h.run('mdmAuthFresh()'),true);
 });
}

test('401 without a refresh token invalidates credentials; unknown 400/403 failures preserve retry capability',async()=>{
 const h=harness({session:{...initial(),refreshToken:''}}),verify=h.run('mdmAuthVerifySession({silent:true})');
 h.respond(0,401,{code:'bad_jwt'});assert.equal(await verify,false);signedOut(h);
 for(const status of [400,403]){
  const retry=harness(),p=retry.run('mdmAuthRefreshSession()');retry.respond(0,status,{code:'unexpected_failure'});
  assert.equal(await p,false);assert.equal(retry.stored().refreshToken,'A_REFRESH');
 }
});

test('malformed success responses cannot create or overwrite an authenticated identity',async()=>{
 const h=harness(),before=h.stored(),refresh=h.run('mdmAuthRefreshSession()');h.respond(0,200,{access_token:'incomplete'});
 assert.equal(await refresh,false);assert.equal(h.stored().accessToken,before.accessToken);
 const verify=h.run('mdmAuthVerifySession({silent:true})');h.respond(1,200,{});
 assert.equal(await verify,false);assert.equal(h.stored().user.id,'A');
});

test('old refresh finalizer cannot release the refresh belonging to a new explicit login',async()=>{
 const h=harness(),old=h.run('mdmAuthRefreshSession()'),logout=h.run('mdmAuthSignOut()');h.login('B');
 const current=h.run('mdmAuthRefreshSession()');h.respond(0,0,'','timeout');assert.equal(await old,false);
 assert.equal(h.run('mdmAuthRefreshSession()'),current);assert.equal(h.requests.length,3);
 h.respond(2,200,payload('B'));assert.equal(await current,true);h.respond(1,204);await logout;
 assert.equal(h.stored().user.id,'B');
});

for(const method of ['mdmAuthSignIn','mdmAuthSignUp']){
 test(`${method}: late success after logout is ignored and a subsequent login works while logout is pending`,async()=>{
  const h=harness(),pending=h.run(method+'()'),logout=h.run('mdmAuthSignOut()');signedOut(h);
  // Starting the explicit request already discarded the old token, so logout needs no network call.
  await logout;h.respond(0,200,payload('B'));await pending;signedOut(h);
  const next=h.run('mdmAuthSignIn()');h.respond(1,200,payload('B'));await next;
  assert.equal(h.run('mdmAuthFresh()'),true);assert.equal(h.stored().user.id,'B');
 });
}

test('explicit legacy login succeeds before an old server logout completes and its finalizer retains ownership',async()=>{
 const h=harness(),oldVerify=h.run('mdmAuthVerifySession({silent:true})'),logout=h.run('mdmAuthSignOut()');
 const login=h.run('mdmAuthSignIn()');h.respond(0,401,{code:'bad_jwt'});await oldVerify;
 assert.equal(h.run('mdmAuthInFlight'),true);h.respond(2,200,payload('B'));await login;
 const before=h.stored();h.respond(1,204);await logout;assert.deepEqual(h.stored(),before);
});

for(const action of ['signin','signup']){
 test(`visible ${action}: a stale response cannot persist or reload; a new explicit attempt succeeds`,async()=>{
  const h=harness(),pending=h.run(`window.testGate.directAuth('${action}')`);
  await h.run('mdmAuthSignOut()');h.fetched(0,200,payload('B'));await pending;
  signedOut(h);assert.equal(h.effects.reloads,0);
  const next=h.run(`window.testGate.directAuth('${action}')`);h.fetched(1,200,payload('B'));await next;
  assert.equal(h.stored().user.id,'B');assert.equal(h.snapshot().user.id,'B');assert.equal(h.effects.reloads,1);
 });
}

test('visible login recovers after a rejected network request and works during an old logout',async()=>{
 const h=harness(),logout=h.run('mdmAuthSignOut()'),first=h.run("window.testGate.directAuth('signin')");
 h.fetches[0].reject(new TypeError('synthetic network failure'));await first;signedOut(h);
 const second=h.run("window.testGate.directAuth('signin')");h.fetched(1,200,payload('B'));await second;
 h.respond(0,204);await logout;assert.equal(h.stored().user.id,'B');assert.equal(h.effects.reloads,1);
});

test('recovery: password response after logout cannot restore the session; a new explicit attempt can',async()=>{
 const h=harness(),recovery=h.run('window.testGate.saveRecoveryPassword()');await h.run('mdmAuthSignOut()');
 h.fetched(0,200,payload('B').user);await recovery;signedOut(h);assert.equal(h.effects.reloads,0);
 const next=h.run('window.testGate.saveRecoveryPassword()');h.fetched(1,200,payload('B').user);await next;
 assert.equal(h.stored().accessToken,'RECOVERY_ACCESS');assert.equal(h.effects.reloads,1);
});

test('magic link: delayed user lookup cannot restore a session after logout; a newly opened link can',async()=>{
 const h=harness();h.c.location.hash='#access_token=LINK_ACCESS&refresh_token=LINK_REFRESH';
 const pending=h.run('window.testLinks.adoptMagicLinkSession()');await h.run('mdmAuthSignOut()');
 h.fetched(0,200,payload('B').user);assert.equal(await pending,false);signedOut(h);
 const next=h.run('window.testLinks.adoptMagicLinkSession()');h.fetched(1,200,payload('B').user);
 assert.equal(await next,true);assert.equal(h.stored().user.id,'B');assert.equal(h.stored().source,'pilot_magic_link');
});

test('existing deferred post-auth callbacks do not start school/sync work after logout',async()=>{
 const h=harness(),verify=h.run('mdmAuthVerifySession({silent:true})');h.respond(0,200,initial().user);await verify;
 const logout=h.run('mdmAuthSignOut()');h.timers.forEach(fn=>fn());assert.equal(h.effects.sync,0);
 h.respond(1,204);await logout;
});

test('a persisted logout fences old callbacks even before another page receives a storage event',async()=>{
 const h=harness(),refresh=h.run('mdmAuthRefreshSession()'),other=harness({storage:h.storage,seed:false});
 const logout=other.run('mdmAuthSignOut()');h.respond(0,200,payload());assert.equal(await refresh,false);
 assert.equal(h.run('mdmAuthFresh()'),false);assert.equal(h.stored().status,'signed_out');
 other.respond(0,204);await logout;
 const reloaded=harness({storage:h.storage,seed:false});signedOut(reloaded);
 reloaded.login('B');assert.equal(reloaded.run('mdmAuthFresh()'),true);
});
