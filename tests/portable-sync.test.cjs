'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {harness,deferred,tick,read,write,SCHOOL,FLEET,CACHE}=require('./helpers/account-runtime.cjs');

// Real production functions + real P0 ownership adapter; only I/O is controlled.
// The RPC model implements the inspected SQL's per-UID compare-and-swap contract.
const PROGRESS='mdm-v1-progress',META='mdm_portable_sync_v4583135';
const PASSPORT='mdm-driver-competence-passport-v1',DRAFT='mdm-school-evidence-draft::mission-1';
const BASELINE='mdm-unified-mission-baseline-v1::mission-1';
const plain=value=>JSON.parse(JSON.stringify(value));
const items=value=>Object.fromEntries(Object.entries(value).map(([k,v])=>[k,JSON.stringify(v)]));
const progress=name=>({seen:{[name]:1},correct:{},wrong:{},exams:[]});
const snapshot=h=>plain(h.eval('mdmPortableSnapshotItems()'));
const meta=h=>read(h,META);
const state=h=>h.eval('mdmPortableSyncState.status');
function payload(h,rawItems){return {...plain(h.eval('mdmPortablePayload()')),items:{...rawItems}};}
function apply(h,p,version){h.context.testPayload=p;h.context.testVersion=version;return h.eval('mdmPortableApplyPayload(testPayload,testVersion)');}
async function clean(h,rawItems,version='v1'){assert.equal(await apply(h,payload(h,rawItems),version),true);assert.equal(state(h),'synced');}
async function until(condition,label='condition'){for(let i=0;i<250;i++){if(condition())return;await Promise.resolve();}assert.fail('Did not reach '+label);}
const reconcile=h=>h.eval('mdmPortableSyncReconcile({silent:true})');
function pull(h,index,rawItems,version='v1'){h.respond(index,{ok:true,found:true,payload:payload(h,rawItems),updated_at:version});}
async function begin(h,operation=reconcile){const count=h.requests.length,promise=operation(h);await until(()=>h.requests.length>count,'RPC');return {promise,index:count};}
class Server{
 constructor(){this.rows=new Map();this.done=new WeakSet();this.pushes=[];this.sequence=10;}
 set(uid,p,version='v1'){this.rows.set(uid,{payload:plain(p),version});return this;}
 process(h){for(let i=0;i<h.requests.length;i++){
  const r=h.requests[i];if(this.done.has(r)||r.body===undefined)continue;this.done.add(r);
  const uid=String(r.headers.Authorization||'').replace('Bearer access-',''),row=this.rows.get(uid);
  assert.ok(uid==='A'||uid==='B','authenticated RPC identity');
  if(r.url.endsWith('/mdm_user_portable_state_pull'))h.respond(i,{ok:true,found:!!row,payload:row?.payload||null,updated_at:row?.version||null});
  else{
   assert.ok(r.url.endsWith('/mdm_user_portable_state_push'));const params=JSON.parse(r.body);this.pushes.push({uid,...params});
   if((row&&params.p_expected_updated_at!==row.version)||(!row&&params.p_expected_updated_at!==null))h.respond(i,{ok:false,conflict:true,error:'portable_state_conflict',updated_at:row?.version||null});
   else{const version='v'+(++this.sequence);this.set(uid,params.p_payload,version);h.respond(i,{ok:true,updated_at:version});}
  }
 }}
 async run(h,operation=reconcile){let finished=false,value,error;Promise.resolve(operation(h)).then(v=>{finished=true;value=v;},e=>{finished=true;error=e;});await until(()=>{this.process(h);return finished;},'sync completion');if(error)throw error;return value;}
}

test('P1-01 clean + server newer applies storage, memory and proven version before synced',async()=>{
 const h=harness(),old=items({[PROGRESS]:progress('old')}),next=items({[PROGRESS]:progress('new')});await clean(h,old);
 const server=new Server().set('A',payload(h,next),'v2');assert.equal(await server.run(h),true);
 assert.deepEqual(snapshot(h),next);assert.equal(h.eval('progress.seen.new'),1);assert.equal(h.eval('progress.seen.old'),undefined);
 assert.equal(meta(h).baseVersion,'v2');assert.equal(meta(h).lastServerUpdatedAt,'v2');assert.equal(state(h),'synced');assert.equal(server.pushes.length,0);
});
test('P1-02 refused apply cannot promote the observed version or leave synced/checking',async()=>{
 const h=harness(),old=items({[PROGRESS]:progress('old')});await clean(h,old);h.eval('mdmPortableApplyPayload=()=>false;');
 const server=new Server().set('A',payload(h,items({[PROGRESS]:progress('new')})),'v2');assert.equal(await server.run(h),false);
 assert.deepEqual(snapshot(h),old);assert.equal(meta(h).baseVersion,'v1');assert.equal(meta(h).observedVersion,'v2');assert.equal(state(h),'error');
});
test('P1-03 dirty + server newer conflicts without loss or timestamp promotion',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('base')}));write(h,PROGRESS,progress('local'));
 const remote=items({[PROGRESS]:progress('remote')}),server=new Server().set('A',payload(h,remote),'v2');assert.equal(await server.run(h),false);
 assert.equal(state(h),'conflict');assert.equal(meta(h).dirty,true);assert.equal(meta(h).baseVersion,'v1');assert.equal(meta(h).observedVersion,'v2');
 assert.equal(read(h,PROGRESS).seen.local,1);assert.deepEqual(server.rows.get('A').payload.items,remote);assert.equal(server.pushes.length,0);
});
test('P1-04 dirty + server same uploads using the proven base and records the accepted snapshot',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);const server=new Server().set('A',payload(h,base));write(h,PROGRESS,progress('edit'));
 assert.equal(await server.run(h),true);assert.equal(server.pushes[0].p_expected_updated_at,'v1');assert.deepEqual(server.rows.get('A').payload.items,snapshot(h));assert.equal(meta(h).dirty,false);assert.equal(state(h),'synced');
});
test('P1-05 server absent + local Fleet-only data creates state despite zero study score',async()=>{
 const h=harness();write(h,FLEET,{context:{organisation:'fleet'}});assert.equal(h.eval('mdmPortableStudyScore(mdmPortablePayload())'),0);
 const server=new Server();assert.equal(await server.run(h),true);assert.equal(server.pushes[0].p_expected_updated_at,null);assert.ok(server.rows.get('A').payload.items[FLEET]);assert.equal(state(h),'synced');
});
test('P1-06 local absent restores a complete non-progress server snapshot',async()=>{
 const h=harness(),incoming=items({[PASSPORT]:{competence:4},[SCHOOL]:{bookings:[{id:'server'}]}}),server=new Server().set('A',payload(h,incoming));
 assert.equal(await server.run(h),true);assert.deepEqual(snapshot(h),incoming);assert.equal(h.eval('schoolOperationsLoad().bookings[0].id'),'server');assert.equal(state(h),'synced');
});
test('P1-07 keys absent from a modern server snapshot are deleted, including dynamic keys',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('old'),[FLEET]:{private:'obsolete'},[DRAFT]:{draft:1},[BASELINE]:{baseline:1}}));
 const next=items({[PROGRESS]:progress('new')}),server=new Server().set('A',payload(h,next),'v2');assert.equal(await server.run(h),true);
 assert.deepEqual(snapshot(h),next);assert.equal(read(h,FLEET),null);assert.equal(h.local.getItem(DRAFT),null);assert.equal(h.local.getItem('mdm-unified-mission-baseline-v1::user:A::mission-1'),null);
});
test('P1-08 both local and server absent is empty and never creates a meaningless row',async()=>{
 const h=harness(),server=new Server();assert.equal(await server.run(h),true);assert.equal(state(h),'empty');assert.equal(meta(h).baseVersion,'');assert.equal(server.pushes.length,0);
});
test('P1-09 empty local snapshot with an existing base is an uploadable deletion',async()=>{
 const h=harness(),base=items({[FLEET]:{old:1}});await clean(h,base);h.local.removeItem(FLEET);const server=new Server().set('A',payload(h,base));
 assert.equal(await server.run(h),true);assert.deepEqual(server.rows.get('A').payload.items,{});assert.equal(server.pushes[0].p_expected_updated_at,'v1');assert.equal(state(h),'synced');
});
test('P1-10 empty modern server snapshot clears a clean local copy',async()=>{
 const h=harness();await clean(h,items({[FLEET]:{old:1},[PROGRESS]:progress('old')}));const server=new Server().set('A',payload(h,{}),'v2');
 assert.equal(await server.run(h),true);assert.deepEqual(snapshot(h),{});assert.deepEqual(plain(h.eval('progress.seen')),{});assert.equal(meta(h).baseVersion,'v2');
});
test('P1-11 second device, return to first, next upload all use actually applied versions',async()=>{
 const a=harness(),b=harness(),base=items({[PROGRESS]:progress('base')}),server=new Server().set('A',payload(a,base));
 assert.equal(await server.run(a),true);assert.equal(await server.run(b),true);write(b,PROGRESS,progress('device2'));assert.equal(await server.run(b),true);
 const version2=server.rows.get('A').version;assert.equal(await server.run(a),true);assert.equal(read(a,PROGRESS).seen.device2,1);assert.equal(meta(a).baseVersion,version2);
 write(a,FLEET,{organisation:'device1'});assert.equal(await server.run(a),true);assert.equal(server.pushes[1].p_expected_updated_at,version2);assert.equal(JSON.parse(server.rows.get('A').payload.items[PROGRESS]).seen.device2,1);
});
test('P1-12 independently dirty second device conflicts with the first accepted upload',async()=>{
 const a=harness(),b=harness(),base=items({[PROGRESS]:progress('base')}),server=new Server().set('A',payload(a,base));await server.run(a);await server.run(b);
 write(a,PROGRESS,progress('first'));write(b,PROGRESS,progress('second'));assert.equal(await server.run(a),true);assert.equal(await server.run(b),false);
 assert.equal(state(b),'conflict');assert.equal(read(b,PROGRESS).seen.second,1);assert.equal(server.pushes.length,1);
});
test('P1-13 same account logout/login preserves its baseline and applies newer server state',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('old')}));const fingerprint=meta(h).baseFingerprint;h.logout();h.login('A');assert.equal(meta(h).baseFingerprint,fingerprint);
 const server=new Server().set('A',payload(h,items({[PROGRESS]:progress('new')})),'v2');assert.equal(await server.run(h),true);assert.equal(read(h,PROGRESS).seen.new,1);assert.equal(meta(h).baseVersion,'v2');
});
test('P1-14 A B A: payload and metadata remain scoped to each identity',async()=>{
 const h=harness();await clean(h,items({[FLEET]:{private:'A'}}),'a1');const aMeta=meta(h);h.login('B');assert.equal(meta(h),null);assert.deepEqual(snapshot(h),{});
 await clean(h,items({[SCHOOL]:{private:'B'}}),'b1');assert.ok(!JSON.stringify(h.eval('mdmPortablePayload()')).includes('"private":"A"'));assert.equal(meta(h).baseVersion,'b1');
 h.login('A');assert.deepEqual(meta(h),aMeta);assert.equal(read(h,FLEET).private,'A');assert.equal(read(h,SCHOOL),null);
});
test('P1-15 an old A payload cannot be applied to B or reused after A B A',async()=>{
 const h=harness();write(h,FLEET,{private:'A'});const old=h.eval('mdmPortablePayload()');h.login('B');assert.equal(await apply(h,old,'v2'),false);assert.deepEqual(snapshot(h),{});
 h.login('A');assert.equal(await apply(h,old,'v2'),false);assert.equal(meta(h)?.baseVersion||'','');
});
test('P1-16 observed but unapplied server version cannot authorize an automatic push',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);write(h,PROGRESS,progress('dirty'));
 await new Server().set('A',payload(h,items({[PROGRESS]:progress('remote')})),'v2').run(h);const count=h.requests.length;
 const result=await h.eval("mdmPortableServerPush('v2')");assert.equal(result.conflict,true);assert.equal(h.requests.length,count);assert.equal(meta(h).baseVersion,'v1');assert.equal(meta(h).lastServerUpdatedAt,'v1');
});
test('P1-17 temporary timeout preserves the proven base and retry succeeds',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);write(h,PROGRESS,progress('edit'));const pending=await begin(h);h.requests[pending.index].ontimeout();
 assert.equal(await pending.promise,false);assert.equal(state(h),'error');assert.equal(meta(h).baseVersion,'v1');assert.equal(read(h,PROGRESS).seen.edit,1);
 const server=new Server().set('A',payload(h,base));server.done.add(h.requests[0]);assert.equal(await server.run(h),true);assert.equal(state(h),'synced');
});
test('P1-18 upload accepted but ack lost recovers by content equality without another upload',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);write(h,PROGRESS,progress('edit'));const p=await begin(h);pull(h,p.index,base);
 await until(()=>h.requests.length===2,'push');const accepted=JSON.parse(h.requests[1].body).p_payload;h.requests[1].ontimeout();assert.equal(await p.promise,false);assert.equal(meta(h).baseVersion,'v1');
 const server=new Server().set('A',accepted,'v2');h.requests.forEach(r=>server.done.add(r));assert.equal(await server.run(h),true);assert.equal(meta(h).baseVersion,'v2');assert.equal(server.pushes.length,0);
});
test('P1-19 late A pull cannot mutate B data, metadata or sync status',async()=>{
 const h=harness(),old=items({[FLEET]:{private:'A'}});await clean(h,old);const p=await begin(h);h.login('B');const bState=state(h);pull(h,p.index,items({[FLEET]:{private:'late-A'}}),'v2');
 assert.equal(await p.promise,false);assert.deepEqual(snapshot(h),{});assert.equal(meta(h),null);assert.equal(state(h),bState);assert.equal(h.local.data.has(META+'::user:B'),false);
});
test('P1-20 late A upload ack cannot establish a baseline for B',async()=>{
 const h=harness(),base=items({[FLEET]:{value:'base'}});await clean(h,base);write(h,FLEET,{value:'A-edit'});const p=await begin(h);pull(h,p.index,base);await until(()=>h.requests.length===2,'push');h.login('B');h.respond(1,{ok:true,updated_at:'v2'});
 assert.equal(await p.promise,false);assert.equal(meta(h),null);assert.deepEqual(snapshot(h),{});h.login('A');assert.equal(meta(h).baseVersion,'v1');
});
test('P1-21 edits during upload remain dirty against the exact acknowledged snapshot',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);write(h,PROGRESS,progress('sent'));const p=await begin(h);pull(h,p.index,base);await until(()=>h.requests.length===2,'push');
 const sent=JSON.parse(h.requests[1].body).p_payload;write(h,FLEET,{edit:'during-upload'});h.respond(1,{ok:true,updated_at:'v2'});assert.equal(await p.promise,true);assert.equal(state(h),'dirty');assert.equal(meta(h).dirty,true);assert.equal(meta(h).baseVersion,'v2');
 const server=new Server().set('A',sent,'v2');h.requests.forEach(r=>server.done.add(r));assert.equal(await server.run(h),true);assert.equal(server.pushes[0].p_expected_updated_at,'v2');assert.ok(server.rows.get('A').payload.items[FLEET]);
});
test('P1-22 edits while a pull is pending turn a newer server response into a conflict',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('base')}));const p=await begin(h);write(h,PROGRESS,progress('during-pull'));pull(h,p.index,items({[PROGRESS]:progress('remote')}),'v2');
 assert.equal(await p.promise,false);assert.equal(state(h),'conflict');assert.equal(read(h,PROGRESS).seen['during-pull'],1);assert.equal(meta(h).baseVersion,'v1');
});
test('P1-23 edits while restore fingerprint is pending cannot be overwritten',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('base')}));const p=apply(h,payload(h,items({[PROGRESS]:progress('remote')})),'v2');write(h,PROGRESS,progress('new-local'));
 assert.equal(await p,false);assert.equal(state(h),'dirty');assert.equal(read(h,PROGRESS).seen['new-local'],1);assert.equal(meta(h).baseVersion,'v1');
});
test('P1-24 ownership change while restore fingerprint is pending aborts before any write',async()=>{
 const h=harness();const p=apply(h,payload(h,items({[PROGRESS]:progress('A')})),'v1');h.login('B');await assert.rejects(p,error=>h.api.changed(error));assert.deepEqual(snapshot(h),{});assert.equal(meta(h),null);
});
test('P1-25 failed metadata persistence cannot produce synced or an advanced base',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);const original=h.local.setItem.bind(h.local);h.local.setItem=(k,v)=>{if(k.startsWith(META))return;original(k,v);};
 assert.equal(await new Server().set('A',payload(h,items({[PROGRESS]:progress('new')})),'v2').run(h),false);assert.equal(state(h),'error');assert.equal(meta(h).baseVersion,'v1');assert.deepEqual(snapshot(h),base);
});
test('P1-26 mid-apply storage error rolls back data and memory; a retry can restore',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base'),[FLEET]:{base:1}});await clean(h,base);const original=h.local.setItem.bind(h.local);let fail=true;
 h.local.setItem=(k,v)=>{if(k===FLEET&&fail){fail=false;throw Error('quota');}return original(k,v);};const incoming=items({[PROGRESS]:progress('new'),[FLEET]:{new:1}});
 assert.equal(await apply(h,payload(h,incoming),'v2'),false);assert.deepEqual(snapshot(h),base);assert.equal(h.eval('progress.seen.base'),1);assert.equal(meta(h).baseVersion,'v1');assert.equal(meta(h).applyPending,false);assert.equal(state(h),'error');
 assert.equal(await apply(h,payload(h,incoming),'v2'),true);assert.equal(state(h),'synced');
});
test('P1-27 silently refused deletion fails readback and rolls back instead of synced',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base'),[FLEET]:{base:1}});await clean(h,base);const original=h.local.removeItem.bind(h.local);h.local.removeItem=k=>{if(k!==FLEET)return original(k);};
 assert.equal(await apply(h,payload(h,items({[PROGRESS]:progress('new')})),'v2'),false);assert.deepEqual(snapshot(h),base);assert.equal(meta(h).baseVersion,'v1');assert.equal(state(h),'error');
});
test('P1-28 failed final baseline write rolls back the otherwise applied snapshot',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);const original=h.local.setItem.bind(h.local);let fail=true;
 h.local.setItem=(k,v)=>{if(k.startsWith(META)&&fail&&JSON.parse(v).baseVersion==='v2'&&!JSON.parse(v).applyPending){fail=false;return;}return original(k,v);};
 assert.equal(await apply(h,payload(h,items({[PROGRESS]:progress('new')})),'v2'),false);assert.deepEqual(snapshot(h),base);assert.equal(h.eval('progress.seen.base'),1);assert.equal(meta(h).baseVersion,'v1');assert.equal(state(h),'error');
});
test('P1-29 persisted incomplete apply blocks automatic upload; explicit restore recovers',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('base')}));const m=meta(h);m.applyPending=true;h.local.setItem(META,JSON.stringify(m));h.local.setItem(PROGRESS,JSON.stringify(progress('partial')));
 const server=new Server().set('A',payload(h,items({[PROGRESS]:progress('server')})),'v2');assert.equal(await server.run(h),false);assert.equal(state(h),'conflict');assert.equal(server.pushes.length,0);
 assert.equal(await server.run(h,x=>x.eval('mdmPortableSyncForceRestore()')),true);assert.equal(meta(h).applyPending,false);assert.equal(read(h,PROGRESS).seen.server,1);assert.equal(state(h),'synced');
});
test('P1-30 newly covered verification/outcome/passport/cosign/cache keys round trip completely',async()=>{
 const h=harness(),b=harness(),data={};for(const key of ['mdm-proofloop-verification-v1','mdm-proofloop-exam-outcome-v1',PASSPORT,'mdm-proofloop-cosign-v2'])data[key]={value:key};
 data[CACHE]={ownerUserId:'A',ownershipSchema:'mdm-account-owned-v2',missions:[{id:'mission',student_user_id:'A'}]};const all=items(data);await clean(h,all);const server=new Server().set('A',payload(h,snapshot(h)));
 assert.equal(await server.run(b),true);assert.deepEqual(snapshot(b),all);
});
test('P1-31 logical mission/draft keys transfer across devices, foreign UID keys never export',async()=>{
 const h=harness(),b=harness();h.local.setItem('mdm-unified-mission-baseline-v1::user:A::mission-1',JSON.stringify({baseline:7}));h.local.setItem(DRAFT,JSON.stringify({text:'draft'}));
 h.local.data.set('mdm-unified-mission-baseline-v1::user:B::private',JSON.stringify({secret:'B'}));h.local.data.set('mdm-school-evidence-draft::private::user:B',JSON.stringify({secret:'B'}));
 const p=plain(h.eval('mdmPortablePayload()'));assert.deepEqual(Object.keys(p.items).sort(),[BASELINE,DRAFT].sort());assert.ok(!JSON.stringify(p.items).includes('::user:'));
 assert.equal(await new Server().set('A',p).run(b),true);assert.equal(JSON.parse(b.local.getItem('mdm-unified-mission-baseline-v1::user:A::mission-1')).baseline,7);assert.equal(read(b,DRAFT).text,'draft');
});
test('P1-32 legacy restore deletes covered absences but preserves newer extensions and device settings',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('old'),[FLEET]:{old:1},[PASSPORT]:{newFeature:1}}));h.local.setItem('mdm-v1-settings',JSON.stringify({lang:'mt',device:'mine'}));
 const legacy={schema:'mdm-portable-state-v1',items:items({[PROGRESS]:progress('legacy'),'mdm-v1-settings':{lang:'en'},'mdm-v1-real-road-telemetry-mission-launch':{id:'old-session'}})};
 assert.equal(await apply(h,legacy,'v2'),true);assert.equal(read(h,FLEET),null);assert.equal(read(h,PASSPORT).newFeature,1);assert.equal(read(h,'mdm-v1-settings').device,'mine');assert.equal(h.sessionStore.getItem('mdm-v1-real-road-telemetry-mission-launch'),null);assert.equal(state(h),'dirty');
 const server=new Server().set('A',legacy,'v2');assert.equal(await server.run(h),true);assert.equal(server.pushes[0].p_payload.snapshotVersion,2);assert.ok(server.pushes[0].p_payload.items[PASSPORT]);assert.ok(!server.pushes[0].p_payload.items['mdm-v1-settings']);
});
test('P1-33 legacy timestamp can acquire a proven baseline only when full content is equal',async()=>{
 const data=items({[PROGRESS]:progress('same')}),h=harness({[PROGRESS+'::user:A']:data[PROGRESS],[META+'::user:A']:{dirty:false,lastServerUpdatedAt:'unproven'}});
 const server=new Server().set('A',payload(h,data),'v2');assert.equal(await server.run(h),true);assert.equal(meta(h).baseVersion,'v2');assert.match(meta(h).baseFingerprint,/^[a-f0-9]{64}$/);assert.equal(state(h),'synced');
});
test('P1-34 a previously known server row disappearing produces conflict without resurrection',async()=>{
 const h=harness();await clean(h,items({[FLEET]:{private:1}}));const server=new Server();assert.equal(await server.run(h),false);assert.equal(state(h),'conflict');assert.equal(meta(h).baseVersion,'v1');assert.equal(server.pushes.length,0);
});
test('P1-35 same server version with inconsistent content cannot authorize upload',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('base')}));write(h,PROGRESS,progress('edit'));const server=new Server().set('A',payload(h,items({[PROGRESS]:progress('unexpected')})),'v1');
 assert.equal(await server.run(h),false);assert.equal(state(h),'conflict');assert.equal(meta(h).lastError,'server_version_content_mismatch');assert.equal(server.pushes.length,0);
});
test('P1-36 null values, foreign namespaces and unsupported manifests reject the whole snapshot',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);
 const bad=[{...payload(h,base),items:{...base,[FLEET]:null}},{...payload(h,base),snapshotVersion:3},{...payload(h,base),managedKeys:[]},payload(h,{[DRAFT+'::user:B']:'{}'})];
 for(const p of bad){assert.equal(await apply(h,p,'v2'),false);assert.deepEqual(snapshot(h),base);assert.equal(meta(h).baseVersion,'v1');}
});
test('P1-37 a misfiled foreign-student cache fails apply readback; P0 provenance is not bypassed',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);const bad=items({[PROGRESS]:progress('new'),[CACHE]:{ownerUserId:'A',ownershipSchema:'mdm-account-owned-v2',missions:[{id:'foreign',student_user_id:'B'}]}});
 assert.equal(await apply(h,payload(h,bad),'v2'),false);assert.equal(read(h,CACHE),null);assert.deepEqual(snapshot(h),base);assert.equal(state(h),'error');
});
test('P1-38 direct localStorage writes without markDirty are detected by full fingerprint',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);h.local.setItem(FLEET,JSON.stringify({direct:1}));assert.equal(meta(h).dirty,false);
 const server=new Server().set('A',payload(h,base));assert.equal(await server.run(h),true);assert.equal(JSON.parse(server.pushes[0].p_payload.items[FLEET]).direct,1);
});
test('P1-39 storage read errors cannot be interpreted as an absent local copy',async()=>{
 const h=harness();write(h,FLEET,{private:1});const original=h.local.getItem.bind(h.local);h.local.getItem=k=>{if(k===FLEET)throw Error('read unavailable');return original(k);};
 const server=new Server();assert.equal(await server.run(h),false);assert.equal(state(h),'error');assert.equal(server.pushes.length,0);
});
test('P1-40 upload ack without a real server version cannot create a fabricated baseline',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);write(h,PROGRESS,progress('edit'));const p=await begin(h);pull(h,p.index,base);await until(()=>h.requests.length===2,'push');h.respond(1,{ok:true});
 assert.equal(await p.promise,false);assert.equal(meta(h).baseVersion,'v1');assert.equal(state(h),'error');assert.equal(meta(h).lastError,'missing_server_version');
});
test('P1-41 server changes between pull and push: CAS conflict preserves local edits',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);write(h,PROGRESS,progress('edit'));const p=await begin(h);pull(h,p.index,base);await until(()=>h.requests.length===2,'push');
 h.respond(1,{ok:false,conflict:true,error:'portable_state_conflict',updated_at:'v2'});assert.equal(await p.promise,false);assert.equal(state(h),'conflict');assert.equal(meta(h).baseVersion,'v1');assert.equal(read(h,PROGRESS).seen.edit,1);
});
test('P1-42 explicit device overwrite uses fresh CAS without promoting it before ack',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('base')}));write(h,PROGRESS,progress('chosen'));const p=await begin(h,x=>x.eval('mdmPortableSyncForceUpload()'));pull(h,p.index,items({[PROGRESS]:progress('remote')}),'v2');
 await until(()=>h.requests.length===2,'explicit push');assert.equal(JSON.parse(h.requests[1].body).p_expected_updated_at,'v2');assert.equal(meta(h).baseVersion,'v1');h.respond(1,{ok:true,updated_at:'v3'});assert.equal(await p.promise,true);assert.equal(meta(h).baseVersion,'v3');assert.equal(state(h),'synced');
});
test('P1-43 cancelling explicit restore/upload has no I/O and preserves both copies',async()=>{
 const h=harness(),base=items({[FLEET]:{mine:1}});await clean(h,base);h.context.confirm=()=>false;
 assert.equal(await h.eval('mdmPortableSyncForceRestore()'),false);assert.equal(await h.eval('mdmPortableSyncForceUpload()'),false);assert.equal(h.requests.length,0);assert.deepEqual(snapshot(h),base);
});
test('P1-44 concurrent reconciliation shares the in-flight gate instead of racing two pulls',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);const first=await begin(h);assert.equal(await reconcile(h),false);assert.equal(h.requests.length,1);pull(h,first.index,base);assert.equal(await first.promise,true);
});
test('P1-45 server HTTP error preserves edits/base and a later pull/upload retries cleanly',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);write(h,PROGRESS,progress('edit'));const p=await begin(h);h.respond(p.index,{error:'temporarily unavailable'},503);assert.equal(await p.promise,false);assert.equal(meta(h).baseVersion,'v1');assert.equal(state(h),'error');
 const server=new Server().set('A',payload(h,base));server.done.add(h.requests[0]);assert.equal(await server.run(h),true);assert.equal(state(h),'synced');
});
test('P1-46 pending restore in A B A remains stale even when the original UID returns',async()=>{
 const h=harness();await clean(h,items({[FLEET]:{original:'A'}}));const p=await begin(h);h.login('B');h.login('A');pull(h,p.index,items({[FLEET]:{late:'A'}}),'v2');
 assert.equal(await p.promise,false);assert.equal(read(h,FLEET).original,'A');assert.equal(meta(h).baseVersion,'v1');
});
test('P1-47 unavailable content hashing fails closed before any restore mutation',async()=>{
 const h=harness(),base=items({[FLEET]:{old:1}});await clean(h,base);h.context.crypto.subtle.digest=async()=>{throw Error('digest unavailable');};
 assert.equal(await new Server().set('A',payload(h,items({[FLEET]:{new:1}})),'v2').run(h),false);assert.deepEqual(snapshot(h),base);assert.equal(meta(h).baseVersion,'v1');assert.equal(state(h),'error');
});
test('P1-48 pageshow and foreground resume reconcile without a new timer or reload',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);h.eval('mdmPortableSyncBoot()');const timers=h.timers.length;
 for(const listener of h.events.get('pageshow'))listener({persisted:true});await until(()=>h.requests.length===1,'pageshow pull');pull(h,0,items({[PROGRESS]:progress('return')}),'v2');await until(()=>state(h)==='synced','resume synced');assert.equal(read(h,PROGRESS).seen.return,1);
 h.context.document.hidden=true;for(const listener of h.documentEvents.get('visibilitychange'))listener();await tick();assert.equal(h.requests.length,1);
 h.context.document.hidden=false;for(const listener of h.documentEvents.get('visibilitychange'))listener();await until(()=>h.requests.length===2,'visible pull');pull(h,1,items({[PROGRESS]:progress('foreground')}),'v3');await until(()=>meta(h).baseVersion==='v3','foreground synced');
 assert.equal(read(h,PROGRESS).seen.foreground,1);assert.equal(h.timers.length,timers);
});
test('P1-49 boot subscription resumes the same account after login and drops stale queued resumes',async()=>{
 const h=harness();await clean(h,items({[PROGRESS]:progress('base')}));h.eval('mdmPortableSyncBoot()');h.logout();h.login('A');await until(()=>h.requests.length===1,'login pull');pull(h,0,items({[PROGRESS]:progress('after-login')}),'v2');await until(()=>meta(h).baseVersion==='v2','login apply');
 assert.equal(read(h,PROGRESS).seen['after-login'],1);h.logout();h.login('A');h.login('B');await until(()=>h.requests.length===2,'current B pull');assert.equal(h.requests[1].headers.Authorization,'Bearer access-B');h.respond(1,{ok:true,found:false});await until(()=>state(h)==='empty','B empty');assert.equal(h.requests.length,2);assert.deepEqual(snapshot(h),{});
});
test('P1-50 a page reload reconstructs the persisted baseline and restores newer server content',async()=>{
 const first=harness();await clean(first,items({[PROGRESS]:progress('old')}));const reloaded=harness(Object.fromEntries(first.local.data));assert.equal(meta(reloaded).baseVersion,'v1');
 const server=new Server().set('A',payload(reloaded,items({[PROGRESS]:progress('new')})),'v2');assert.equal(await server.run(reloaded),true);assert.equal(reloaded.eval('progress.seen.new'),1);assert.equal(state(reloaded),'synced');
});
test('P1-51 malformed server snapshot fails before any local content or base change',async()=>{
 const h=harness(),base=items({[PROGRESS]:progress('base')});await clean(h,base);const p=await begin(h);h.respond(p.index,{ok:true,found:true,updated_at:'v2',payload:{schema:'mdm-portable-state-v1',snapshotVersion:2,items:{[PROGRESS]:'{}'}}});
 assert.equal(await p.promise,false);assert.equal(state(h),'error');assert.deepEqual(snapshot(h),base);assert.equal(meta(h).baseVersion,'v1');
});
test('P1-52 manual sync keeps conflict/restore feedback; silent sync and cancellation stay silent',async()=>{
 const h=harness(),messages=[];h.context.toast=message=>messages.push(message);await clean(h,items({[FLEET]:{base:1}}));write(h,FLEET,{local:1});const server=new Server().set('A',payload(h,items({[FLEET]:{server:1}})),'v2');
 assert.equal(await server.run(h),false);assert.equal(messages.length,0);assert.equal(await server.run(h,x=>x.eval('mdmPortableSyncReconcile({silent:false})')),false);assert.match(messages[0],/Choose Restore/);
 h.context.confirm=()=>false;assert.equal(await h.eval('mdmPortableSyncForceRestore()'),false);assert.equal(messages.length,1);
 h.context.confirm=()=>true;assert.equal(await server.run(h,x=>x.eval('mdmPortableSyncForceRestore()')),true);assert.match(messages[1],/Progress restored/);assert.equal(messages.length,2);
});
