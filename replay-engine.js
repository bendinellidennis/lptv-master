
(function(global){
 'use strict';

 const registry=new Map();
 let mounted=null;
 let audioContext=null;

 function registerScene(scene){
  if(!scene?.id)throw new Error('Replay scene id missing');
  if(!Array.isArray(scene.timeline))throw new Error('Replay timeline missing');
  registry.set(scene.id,Object.freeze(scene));
  return scene;
 }

 function getScene(id){return registry.get(id)||null;}
 function listScenes(){return Array.from(registry.values());}

 function formatTime(value){
  if(!Number.isFinite(value)||value<0)return '0:00';
  const total=Math.floor(value);
  return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
 }

 function renderVideoMarkup(sceneId,options={}){
  const scene=getScene(sceneId);
  if(!scene)return '';
  const media=scene.media||{};
  const label=options.label||scene.accessibilityLabel||scene.title||scene.id;

  return `<div class="replay-engine-player" data-replay-engine-player="${scene.id}">
   <video class="cinematic-action-video" data-replay-engine-video
    src="${media.video||''}" muted playsinline preload="metadata"
    poster="${media.poster||''}" aria-label="${label}"></video>

   <div class="cinematic-video-fallback replay-neutral-loader" data-replay-engine-fallback>
    <div class="replay-loading-state"><i></i><span>${options.loadingText||'Loading video'}</span></div>
   </div>

   <button class="replay-big-play" type="button" data-replay-big-play aria-label="Play">▶</button>
   <div class="cinematic-video-cue" data-replay-engine-cue></div>
   <div class="cinematic-video-source">${media.credit||''}</div>

   <div class="replay-player-controls">
    <div class="replay-player-row">
     <button type="button" data-replay-back aria-label="Back 5 seconds">↶ 5</button>
     <button type="button" class="replay-main-toggle" data-replay-toggle aria-label="Play or pause">▶</button>
     <button type="button" data-replay-forward aria-label="Forward 5 seconds">5 ↷</button>
     <span class="replay-time" data-replay-time>0:00 / 0:00</span>
     <button type="button" data-replay-sound-toggle aria-label="Enable replay sounds">🔇</button>
     <button type="button" data-replay-fullscreen aria-label="Fullscreen">⛶</button>
    </div>
    <input type="range" min="0" max="1000" value="0" step="1"
     data-replay-seek aria-label="Video position">
   </div>
  </div>`;
 }

 function ensureAudio(){
  if(!audioContext){
   const AudioCtor=global.AudioContext||global.webkitAudioContext;
   if(AudioCtor)audioContext=new AudioCtor();
  }
  if(audioContext?.state==='suspended')audioContext.resume().catch(()=>{});
  return audioContext;
 }

 function tone(kind='info',force=false){
  if(!mounted||(!force&&!mounted.soundEnabled))return;
  const context=ensureAudio();
  if(!context)return;

  const preset={
   test:[740,.18,.04],
   slow:[180,.20,.025],
   danger:[520,.18,.035],
   success:[660,.24,.03],
   info:[320,.14,.02]
  }[kind]||[320,.14,.02];

  const [frequency,duration,volume]=preset;
  const now=context.currentTime;
  const oscillator=context.createOscillator();
  const gain=context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.type=kind==='danger'?'triangle':'sine';
  oscillator.frequency.setValueAtTime(frequency,now);

  if(kind==='success'||kind==='test'){
   oscillator.frequency.exponentialRampToValueAtTime(880,now+duration);
  }
  if(kind==='danger'){
   oscillator.frequency.exponentialRampToValueAtTime(380,now+duration);
  }

  gain.gain.setValueAtTime(.0001,now);
  gain.gain.exponentialRampToValueAtTime(volume,now+.02);
  gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  oscillator.start(now);
  oscillator.stop(now+duration+.03);
 }

 function timelineIndex(scene,currentTime){
  let result=-1;
  scene.timeline.forEach((item,index)=>{
   if(currentTime>=Number(item.at||0))result=index;
  });
  return result;
 }

 function updateUI(){
  if(!mounted?.video)return;
  const video=mounted.video;
  const duration=Number.isFinite(video.duration)?video.duration:0;
  const current=Number.isFinite(video.currentTime)?video.currentTime:0;

  if(mounted.seek&&!mounted.seeking){
   mounted.seek.value=duration?Math.round(current/duration*1000):0;
  }
  if(mounted.time){
   mounted.time.textContent=`${formatTime(current)} / ${formatTime(duration)}`;
  }
  if(mounted.toggle)mounted.toggle.textContent=video.paused?'▶':'⏸';
  if(mounted.bigPlay){
   mounted.bigPlay.textContent=video.paused?'▶':'⏸';
   mounted.bigPlay.classList.toggle('is-hidden',!video.paused);
  }
 }

 function updateTimeline(){
  if(!mounted?.video)return;
  const index=timelineIndex(mounted.scene,mounted.video.currentTime);
  if(index===mounted.lastEventIndex)return;
  mounted.lastEventIndex=index;
  if(index<0)return;

  const event=mounted.scene.timeline[index];
  if(mounted.cue){
   mounted.cue.textContent=(mounted.language==='it'?event.textIt:event.textEn)
    ||event.textEn||event.textIt||'';
   mounted.cue.classList.remove('is-visible');
   void mounted.cue.offsetWidth;
   mounted.cue.classList.add('is-visible');
  }

  if(event.event==='slow')tone('slow');
  else if(event.event==='danger')tone('danger');
  else if(event.event==='lane'||event.event==='wait')tone('success');
  else tone('info');
 }

 function sync(){
  updateUI();
  updateTimeline();
 }

 function play(){
  if(!mounted?.video)return;
  mounted.video.play().catch(()=>{});
 }

 function pause(){
  mounted?.video?.pause();
 }

 function togglePlay(){
  if(!mounted?.video)return;
  mounted.video.paused?play():pause();
 }

 function seekBy(seconds){
  if(!mounted?.video||!Number.isFinite(mounted.video.duration))return;
  mounted.video.currentTime=Math.max(
   0,
   Math.min(mounted.video.duration,mounted.video.currentTime+seconds)
  );
  mounted.lastEventIndex=-1;
  sync();
 }

 function openNativeFullscreen(){
  if(!mounted?.video)return;

  const source=mounted.video;
  const savedTime=Number.isFinite(source.currentTime)?source.currentTime:0;
  const resumeAfter=!source.paused;
  source.pause();

  // iPhone/Koder may refuse a second fullscreen request on the same
  // HTMLVideoElement. A fresh native element is created on every tap.
  const nativeVideo=document.createElement('video');
  nativeVideo.src=source.currentSrc||source.src;
  nativeVideo.controls=true;
  nativeVideo.playsInline=false;
  nativeVideo.muted=source.muted;
  nativeVideo.preload='auto';
  nativeVideo.style.position='fixed';
  nativeVideo.style.left='-9999px';
  nativeVideo.style.top='0';
  nativeVideo.style.width='1px';
  nativeVideo.style.height='1px';
  document.body.appendChild(nativeVideo);

  let closed=false;

  const closeNative=()=>{
   if(closed)return;
   closed=true;

   try{
    if(Number.isFinite(nativeVideo.currentTime)){
     source.currentTime=nativeVideo.currentTime;
    }
   }catch(_){}

   try{nativeVideo.pause();}catch(_){}
   nativeVideo.removeAttribute('src');
   try{nativeVideo.load();}catch(_){}
   nativeVideo.remove();

   mounted.lastEventIndex=-1;
   sync();
   if(resumeAfter)play();
  };

  nativeVideo.addEventListener('webkitendfullscreen',closeNative,{once:true});
  nativeVideo.addEventListener('ended',closeNative,{once:true});

  const launch=()=>{
   try{nativeVideo.currentTime=savedTime;}catch(_){}

   // play() is intentionally inside the direct user action path.
   nativeVideo.play().catch(()=>{});

   try{
    if(typeof nativeVideo.webkitEnterFullscreen==='function'){
     nativeVideo.webkitEnterFullscreen();
     return;
    }
   }catch(_){}

   const request=nativeVideo.requestFullscreen||nativeVideo.webkitRequestFullscreen;
   if(request){
    try{
     const promise=request.call(nativeVideo);
     if(promise?.catch)promise.catch(closeNative);
     return;
    }catch(_){}
   }

   closeNative();
  };

  if(nativeVideo.readyState>=1)launch();
  else nativeVideo.addEventListener('loadedmetadata',launch,{once:true});
 }

 function stop(){
  if(!mounted)return;
  mounted.cleanup.forEach(cleanup=>{
   try{cleanup();}catch(_){}
  });
  try{mounted.video?.pause();}catch(_){}
  mounted=null;
 }

 function mount(root,sceneId,options={}){
  stop();

  const scene=getScene(sceneId);
  if(!root||!scene)return null;

  const query=selector=>root.querySelector(selector);
  const video=query('[data-replay-engine-video]');

  mounted={
   root,
   scene,
   video,
   fallback:query('[data-replay-engine-fallback]'),
   cue:query('[data-replay-engine-cue]'),
   toggle:query('[data-replay-toggle]'),
   bigPlay:query('[data-replay-big-play]'),
   back:query('[data-replay-back]'),
   forward:query('[data-replay-forward]'),
   seek:query('[data-replay-seek]'),
   time:query('[data-replay-time]'),
   soundToggle:query('[data-replay-sound-toggle]'),
   fullscreen:query('[data-replay-fullscreen]'),
   language:options.language||'en',
   soundEnabled:false,
   lastEventIndex:-1,
   seeking:false,
   cleanup:[]
  };

  if(video){
   video.playbackRate=Number(options.playbackRate||scene.playbackRate||1);
   video.loop=false;

   const onCanPlay=()=>{
    if(mounted?.fallback)mounted.fallback.hidden=true;
    sync();
   };
   const onError=()=>{
    if(mounted?.fallback)mounted.fallback.hidden=false;
   };
   const onSync=()=>sync();
   const onSeeked=()=>{
    if(mounted)mounted.lastEventIndex=-1;
    sync();
   };

   video.addEventListener('canplay',onCanPlay);
   video.addEventListener('error',onError);
   video.addEventListener('loadedmetadata',onSync);
   video.addEventListener('timeupdate',onSync);
   video.addEventListener('play',onSync);
   video.addEventListener('pause',onSync);
   video.addEventListener('ended',onSync);
   video.addEventListener('seeked',onSeeked);

   mounted.cleanup.push(
    ()=>video.removeEventListener('canplay',onCanPlay),
    ()=>video.removeEventListener('error',onError),
    ()=>video.removeEventListener('loadedmetadata',onSync),
    ()=>video.removeEventListener('timeupdate',onSync),
    ()=>video.removeEventListener('play',onSync),
    ()=>video.removeEventListener('pause',onSync),
    ()=>video.removeEventListener('ended',onSync),
    ()=>video.removeEventListener('seeked',onSeeked)
   );
  }

  if(mounted.toggle)mounted.toggle.onclick=togglePlay;
  if(mounted.bigPlay)mounted.bigPlay.onclick=togglePlay;
  if(mounted.back)mounted.back.onclick=()=>seekBy(-5);
  if(mounted.forward)mounted.forward.onclick=()=>seekBy(5);

  if(mounted.fullscreen){
   // One direct click handler only. No rebinding or accumulating touch events.
   mounted.fullscreen.onclick=event=>{
    event.preventDefault();
    event.stopPropagation();
    openNativeFullscreen();
   };
  }

  if(mounted.seek){
   mounted.seek.oninput=()=>{
    if(!mounted?.video||!Number.isFinite(mounted.video.duration))return;
    mounted.seeking=true;
    mounted.video.currentTime=
     Number(mounted.seek.value)/1000*mounted.video.duration;
    mounted.lastEventIndex=-1;
    sync();
   };
   mounted.seek.onchange=()=>{
    if(mounted)mounted.seeking=false;
    sync();
   };
  }

  if(mounted.soundToggle){
   mounted.soundToggle.onclick=()=>{
    mounted.soundEnabled=!mounted.soundEnabled;
    mounted.soundToggle.textContent=mounted.soundEnabled?'🔊':'🔇';
    if(mounted.soundEnabled)tone('test',true);
   };
  }

  sync();
  return mounted;
 }

 global.ReplayEngine=Object.freeze({
  version:'2.0.0',
  registerScene,
  getScene,
  listScenes,
  renderVideoMarkup,
  mount,
  stop
 });
})(window);
