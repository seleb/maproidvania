const __vite__fileDeps=["./main-BRpGuA3d.js","./Storage-C1SZS-hw.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();const g="modulepreload",w=function(o,n){return new URL(o,n).href},h={},p=function(n,l,c){let e=Promise.resolve();if(l&&l.length>0){const t=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),m=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));e=Promise.all(l.map(i=>{if(i=w(i,c),i in h)return;h[i]=!0;const a=i.endsWith(".css"),y=a?'[rel="stylesheet"]':"";if(!!c)for(let u=t.length-1;u>=0;u--){const d=t[u];if(d.href===i&&(!a||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${i}"]${y}`))return;const s=document.createElement("link");if(s.rel=a?"stylesheet":g,a||(s.as="script",s.crossOrigin=""),s.href=i,m&&s.setAttribute("nonce",m),document.head.appendChild(s),a)return new Promise((u,d)=>{s.addEventListener("load",u),s.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${i}`)))})}))}return e.then(()=>n()).catch(t=>{const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=t,window.dispatchEvent(r),!r.defaultPrevented)throw t})};function v(...o){return console.error(...o)}const f=document.querySelector("#preloader");if(!f)throw new Error("Could not find preloader element");(async()=>{const{init:o}=await p(()=>import("./Storage-C1SZS-hw.js").then(n=>n.S),[],import.meta.url);await o(),await p(()=>import("./main-BRpGuA3d.js"),__vite__mapDeps([0,1]),import.meta.url),f.remove()})().catch(o=>{v("failed to load",o),f.textContent=`Something went wrong: ${(o==null?void 0:o.message)||"unknown error"}`});export{v as e};
