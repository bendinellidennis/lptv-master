'use strict';
/* MDM 45.8.31.4 — production defensive hardening; no frame-busting. */
(()=> {
  const VERSION='45.8.31.4';
  try{window.name=''}catch{}
  const hardenExternalLink=(a)=>{
    if(!a||a.tagName!=='A')return;
    try{
      const u=new URL(a.href,location.href);
      if(u.origin!==location.origin){
        a.referrerPolicy='no-referrer';
        const rel=new Set(String(a.rel||'').split(/\s+/).filter(Boolean));
        rel.add('noopener'); rel.add('noreferrer'); a.rel=[...rel].join(' ');
      }
    }catch{}
  };
  document.addEventListener('click',(e)=>{const a=e.target?.closest?.('a');if(a)hardenExternalLink(a)},true);
  const observer=new MutationObserver((records)=>{
    for(const record of records)for(const node of record.addedNodes){
      if(node.nodeType!==1)continue;
      if(node.tagName==='A')hardenExternalLink(node);
      node.querySelectorAll?.('a').forEach(hardenExternalLink);
    }
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  Object.defineProperty(window,'MDM_SECURITY_HARDENING',{value:Object.freeze({version:VERSION}),enumerable:false,writable:false,configurable:false});
})();
