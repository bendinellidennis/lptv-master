
(function(){
 const splash=document.getElementById('mdmStartupSplash');
 if(!splash)return;
 const born=performance.now();
 function hide(){const wait=Math.max(0,420-(performance.now()-born));setTimeout(()=>{splash.classList.add('is-ready');setTimeout(()=>splash.remove(),350)},wait)}
 if(document.readyState==='complete')hide(); else window.addEventListener('load',hide,{once:true});
 setTimeout(hide,4500);
})();
