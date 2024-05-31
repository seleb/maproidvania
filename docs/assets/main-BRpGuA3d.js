import{g as rt,a as Ce,s as ze}from"./Storage-C1SZS-hw.js";import{e as je}from"./index-2cF-9IBa.js";var ot=function(){function e(){}var r=e.prototype;return r.expandToken=function(n){for(var s=[],p="",u=0,c=n.length;u<c;++u)p+=n.charAt(u),s.push(p);return s},e}(),at=function(){function e(){}var r=e.prototype;return r.sanitize=function(n){return n?n.toLocaleLowerCase().trim():""},e}();function Le(e,r){r=r||[],e=e||{};for(var o=e,n=0;n<r.length;n++)if(o=o[r[n]],o==null)return null;return o}var it=function(){function e(o){this._uidFieldName=o,this._tokenToIdfCache={},this._tokenMap={}}var r=e.prototype;return r.indexDocument=function(n,s,p){this._tokenToIdfCache={};var u=this._tokenMap,c;typeof u[n]!="object"?u[n]=c={$numDocumentOccurrences:0,$totalNumOccurrences:1,$uidMap:{}}:(c=u[n],c.$totalNumOccurrences++);var h=c.$uidMap;typeof h[s]!="object"?(c.$numDocumentOccurrences++,h[s]={$document:p,$numTokenOccurrences:1}):h[s].$numTokenOccurrences++},r.search=function(n,s){for(var p={},u=0,c=n.length;u<c;u++){var h=n[u],S=this._tokenMap[h];if(!S)return[];if(u===0)for(var $=Object.keys(S.$uidMap),E=0,I=$.length;E<I;E++){var y=$[E];p[y]=S.$uidMap[y].$document}else for(var $=Object.keys(p),E=0,I=$.length;E<I;E++){var y=$[E];typeof S.$uidMap[y]!="object"&&delete p[y]}}var f=[];for(var y in p)f.push(p[y]);var C=this._createCalculateTfIdf();return f.sort(function(v,X){return C(n,X,s)-C(n,v,s)})},r._createCalculateIdf=function(){var n=this._tokenMap,s=this._tokenToIdfCache;return function(u,c){if(!s[u]){var h=typeof n[u]<"u"?n[u].$numDocumentOccurrences:0;s[u]=1+Math.log(c.length/(1+h))}return s[u]}},r._createCalculateTfIdf=function(){var n=this._tokenMap,s=this._uidFieldName,p=this._createCalculateIdf();return function(c,h,S){for(var $=0,E=0,I=c.length;E<I;++E){var y=c[E],f=p(y,S);f===1/0&&(f=0);var C;s instanceof Array?C=h&&Le(h,s):C=h&&h[s];var v=typeof n[y]<"u"&&typeof n[y].$uidMap[C]<"u"?n[y].$uidMap[C].$numTokenOccurrences:0;$+=v*f}return $}},e}(),st=/[^a-zа-яё0-9\-']+/i,ct=function(){function e(){}var r=e.prototype;return r.tokenize=function(n){return n.split(st).filter(function(s){return s})},e}();function Fe(e,r){for(var o=0;o<r.length;o++){var n=r[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function lt(e,r,o){return r&&Fe(e.prototype,r),o&&Fe(e,o),e}var dt=function(){function e(o){if(!o)throw Error("js-search requires a uid field name constructor parameter");this._uidFieldName=o,this._indexStrategy=new ot,this._searchIndex=new it(o),this._sanitizer=new at,this._tokenizer=new ct,this._documents=[],this._searchableFields=[]}var r=e.prototype;return r.addDocument=function(n){this.addDocuments([n])},r.addDocuments=function(n){this._documents=this._documents.concat(n),this.indexDocuments_(n,this._searchableFields)},r.addIndex=function(n){this._searchableFields.push(n),this.indexDocuments_(this._documents,[n])},r.search=function(n){var s=this._tokenizer.tokenize(this._sanitizer.sanitize(n));return this._searchIndex.search(s,this._documents)},r.indexDocuments_=function(n,s){this._initialized=!0;for(var p=this._indexStrategy,u=this._sanitizer,c=this._searchIndex,h=this._tokenizer,S=this._uidFieldName,$=0,E=n.length;$<E;$++){var I=n[$],y;S instanceof Array?y=Le(I,S):y=I[S];for(var f=0,C=s.length;f<C;f++){var v,X=s[f];if(X instanceof Array?v=Le(I,X):v=I[X],v!=null&&typeof v!="string"&&v.toString&&(v=v.toString()),typeof v=="string")for(var Y=h.tokenize(u.sanitize(v)),P=0,ne=Y.length;P<ne;P++)for(var _=Y[P],Q=p.expandToken(_),H=0,A=Q.length;H<A;H++){var G=Q[H];c.indexDocument(G,y,I)}}}},lt(e,[{key:"indexStrategy",set:function(n){if(this._initialized)throw Error("IIndexStrategy cannot be set after initialization");this._indexStrategy=n},get:function(){return this._indexStrategy}},{key:"sanitizer",set:function(n){if(this._initialized)throw Error("ISanitizer cannot be set after initialization");this._sanitizer=n},get:function(){return this._sanitizer}},{key:"searchIndex",set:function(n){if(this._initialized)throw Error("ISearchIndex cannot be set after initialization");this._searchIndex=n},get:function(){return this._searchIndex}},{key:"tokenizer",set:function(n){if(this._initialized)throw Error("ITokenizer cannot be set after initialization");this._tokenizer=n},get:function(){return this._tokenizer}}]),e}(),$e={exports:{}};function ut(e,r){var o=e[0]-r[0],n=e[1]-r[1];return o*o+n*n}var pt=function(r,o){if(r.length<=1)return r;o=typeof o=="number"?o:1;for(var n=o*o,s=r[0],p=[s],u,c=1,h=r.length;c<h;c++)u=r[c],ut(u,s)>n&&(p.push(u),s=u);return s!==u&&p.push(u),p};function ft(e,r,o){var n=r[0],s=r[1],p=o[0]-n,u=o[1]-s;if(p!==0||u!==0){var c=((e[0]-n)*p+(e[1]-s)*u)/(p*p+u*u);c>1?(n=o[0],s=o[1]):c>0&&(n+=p*c,s+=u*c)}return p=e[0]-n,u=e[1]-s,p*p+u*u}function _e(e,r,o,n,s){for(var p=n,u,c=r+1;c<o;c++){var h=ft(e[c],e[r],e[o]);h>p&&(u=c,p=h)}p>n&&(u-r>1&&_e(e,r,u,n,s),s.push(e[u]),o-u>1&&_e(e,u,o,n,s))}var mt=function(r,o){if(r.length<=1)return r;o=typeof o=="number"?o:1;var n=o*o,s=r.length-1,p=[r[0]];return _e(r,0,s,n,p),p.push(r[s]),p},Je=pt,Ze=mt;$e.exports=function(r,o){return r=Je(r,o),r=Ze(r,o),r};$e.exports.radialDistance=Je;$e.exports.douglasPeucker=Ze;var ht=$e.exports;const gt=rt(ht);function Re(e,r,o,n=s=>s){return e*n(.5-r*(.5-o))}function xt(e){return[-e[0],-e[1]]}function U(e,r){return[e[0]+r[0],e[1]+r[1]]}function R(e,r){return[e[0]-r[0],e[1]-r[1]]}function B(e,r){return[e[0]*r,e[1]*r]}function yt(e,r){return[e[0]/r,e[1]/r]}function ve(e){return[e[1],-e[0]]}function Xe(e,r){return e[0]*r[0]+e[1]*r[1]}function vt(e,r){return e[0]===r[0]&&e[1]===r[1]}function wt(e){return Math.hypot(e[0],e[1])}function Et(e){return e[0]*e[0]+e[1]*e[1]}function Ye(e,r){return Et(R(e,r))}function Qe(e){return yt(e,wt(e))}function bt(e,r){return Math.hypot(e[1]-r[1],e[0]-r[0])}function we(e,r,o){let n=Math.sin(o),s=Math.cos(o),p=e[0]-r[0],u=e[1]-r[1],c=p*s-u*n,h=p*n+u*s;return[c+r[0],h+r[1]]}function De(e,r,o){return U(e,B(R(r,e),o))}function Ke(e,r,o){return U(e,B(r,o))}var{min:me,PI:St}=Math,We=.275,Ee=St+1e-4;function kt(e,r={}){let{size:o=16,smoothing:n=.5,thinning:s=.5,simulatePressure:p=!0,easing:u=x=>x,start:c={},end:h={},last:S=!1}=r,{cap:$=!0,easing:E=x=>x*(2-x)}=c,{cap:I=!0,easing:y=x=>--x*x*x+1}=h;if(e.length===0||o<=0)return[];let f=e[e.length-1].runningLength,C=c.taper===!1?0:c.taper===!0?Math.max(o,f):c.taper,v=h.taper===!1?0:h.taper===!0?Math.max(o,f):h.taper,X=Math.pow(o*n,2),Y=[],P=[],ne=e.slice(0,10).reduce((x,z)=>{let w=z.pressure;if(p){let b=me(1,z.distance/o),se=me(1,1-b);w=me(1,x+(se-x)*(b*We))}return(x+w)/2},e[0].pressure),_=Re(o,s,e[e.length-1].pressure,u),Q,H=e[0].vector,A=e[0].point,G=A,J=A,K=G,re=!1;for(let x=0;x<e.length;x++){let{pressure:z}=e[x],{point:w,vector:b,distance:se,runningLength:oe}=e[x];if(x<e.length-1&&f-oe<3)continue;if(s){if(p){let D=me(1,se/o),ge=me(1,1-D);z=me(1,ne+(ge-ne)*(D*We))}_=Re(o,s,z,u)}else _=o/2;Q===void 0&&(Q=_);let ce=oe<C?E(oe/C):1,F=f-oe<v?y((f-oe)/v):1;_=Math.max(.01,_*Math.min(ce,F));let de=(x<e.length-1?e[x+1]:e[x]).vector,ue=x<e.length-1?Xe(b,de):1,he=Xe(b,H)<0&&!re,be=ue!==null&&ue<0;if(he||be){let D=B(ve(H),_);for(let ge=1/13,W=0;W<=1;W+=ge)J=we(R(w,D),w,Ee*W),Y.push(J),K=we(U(w,D),w,Ee*-W),P.push(K);A=J,G=K,be&&(re=!0);continue}if(re=!1,x===e.length-1){let D=B(ve(b),_);Y.push(R(w,D)),P.push(U(w,D));continue}let q=B(ve(De(de,b,ue)),_);J=R(w,q),(x<=1||Ye(A,J)>X)&&(Y.push(J),A=J),K=U(w,q),(x<=1||Ye(G,K)>X)&&(P.push(K),G=K),ne=z,H=b}let j=e[0].point.slice(0,2),T=e.length>1?e[e.length-1].point.slice(0,2):U(e[0].point,[1,1]),ie=[],N=[];if(e.length===1){if(!(C||v)||S){let x=Ke(j,Qe(ve(R(j,T))),-(Q||_)),z=[];for(let w=1/13,b=w;b<=1;b+=w)z.push(we(x,j,Ee*2*b));return z}}else{if(!(C||v&&e.length===1))if($)for(let z=1/13,w=z;w<=1;w+=z){let b=we(P[0],j,Ee*w);ie.push(b)}else{let z=R(Y[0],P[0]),w=B(z,.5),b=B(z,.51);ie.push(R(j,w),R(j,b),U(j,b),U(j,w))}let x=ve(xt(e[e.length-1].vector));if(v||C&&e.length===1)N.push(T);else if(I){let z=Ke(T,x,_);for(let w=1/29,b=w;b<1;b+=w)N.push(we(z,T,Ee*3*b))}else N.push(U(T,B(x,_)),U(T,B(x,_*.99)),R(T,B(x,_*.99)),R(T,B(x,_)))}return Y.concat(N,P.reverse(),ie)}function $t(e,r={}){var o;let{streamline:n=.5,size:s=16,last:p=!1}=r;if(e.length===0)return[];let u=.15+(1-n)*.85,c=Array.isArray(e[0])?e:e.map(({x:y,y:f,pressure:C=.5})=>[y,f,C]);if(c.length===2){let y=c[1];c=c.slice(0,-1);for(let f=1;f<5;f++)c.push(De(c[0],y,f/4))}c.length===1&&(c=[...c,[...U(c[0],[1,1]),...c[0].slice(2)]]);let h=[{point:[c[0][0],c[0][1]],pressure:c[0][2]>=0?c[0][2]:.25,vector:[1,1],distance:0,runningLength:0}],S=!1,$=0,E=h[0],I=c.length-1;for(let y=1;y<c.length;y++){let f=p&&y===I?c[y].slice(0,2):De(E.point,c[y],u);if(vt(E.point,f))continue;let C=bt(f,E.point);if($+=C,y<I&&!S){if($<s)continue;S=!0}E={point:f,pressure:c[y][2]>=0?c[y][2]:.5,vector:Qe(R(E.point,f)),distance:C,runningLength:$},h.push(E)}return h[0].vector=((o=h[1])==null?void 0:o.vector)||[0,0],h}function It(e,r={}){return kt($t(e,r),r)}var Ct=It;const ke=(e,r)=>(e+r)/2;function zt(e,r=!0){const o=e.length;if(o<4)return"";let n=e[0],s=e[1];const p=e[2];let u=`M${n[0].toFixed(2)},${n[1].toFixed(2)} Q${s[0].toFixed(2)},${s[1].toFixed(2)} ${ke(s[0],p[0]).toFixed(2)},${ke(s[1],p[1]).toFixed(2)} T`;for(let c=2,h=o-1;c<h;c++)n=e[c],s=e[c+1],u+=`${ke(n[0],s[0]).toFixed(2)},${ke(n[1],s[1]).toFixed(2)} `;return r&&(u+="Z"),u}function Be(e){const r=document.createElementNS("http://www.w3.org/2000/svg","path");return r.setAttributeNS(null,"fill",e.colour),Oe(r,e.points,e.size),r}function Oe(e,r,o){e.setAttributeNS(null,"d",zt(Ct(r,{size:o,smoothing:.5,streamline:.25,thinning:.5})))}function Ue(e,r,o){return e.replace(new RegExp(`(${r.map(n=>n.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")).join("|")})`,"ig"),o)}function He(e,r){const o=[],n=/^\s*$/;function s(p){if(p.nodeType==3)(r||!n.test(p.nodeValue||""))&&o.push(p);else for(var u=0,c=p.childNodes.length;u<c;++u)s(p.childNodes[u])}return s(e),o}const Ge=(e,r)=>{e.forEach(o=>{const n=o.textContent,s=r(n||""),p=document.createRange().createContextualFragment(s);o.replaceWith(p)})},Lt=(e,r,o)=>{const n=o(r);let s=He(e,!0);Ge(s,p=>Ue(p,[r],'<mark class="exact">$1</mark>')),s=He(e,!0),Ge(s,p=>Ue(p,n,"<mark>$1</mark>"))};function _t(){return new Promise((e,r)=>{const o=document.createElement("input");o.type="file",o.onchange=()=>{var p;const n=(p=o.files)==null?void 0:p[0];if(!n)return;const s=new FileReader;s.readAsText(n,"UTF-8"),s.onload=()=>{var u;e(((u=s.result)==null?void 0:u.toString())||"")},s.onerror=r},o.click()})}function Dt(e){document.addEventListener("paste",r=>{const o=r.clipboardData||r.originalEvent.clipboardData,n=o.getData("text");if(n!=null&&n.startsWith("data:image")){e(n);return}const s=o.items;for(let p in s){const u=s[p];if(u.kind==="file"){const c=u.getAsFile(),h=new FileReader;h.onload=()=>{const S=h.result;S!=null&&S.startsWith("data:image")&&e(S)},h.readAsDataURL(c)}}})}async function Ot(e){const r={types:[{description:"JSON",accept:{"application/json":[".json"]}}]},n=await(await window.showSaveFilePicker(r)).createWritable();await n.write(e),await n.close()}const Z=[];let te=-1;const Tt=50;function M(e){for(Z.splice(te+1,Z.length),Z.push(e);Z.length>Tt;)Z.shift();te=Z.length-1,Z[te].redo()}function Mt(){const e=Z[te];return e?(e.undo(),--te,e.name):(te=-1,!1)}function Nt(){++te;const e=Z[te];return e?(e==null||e.redo(),e==null?void 0:e.name):(te=Z.length-1,!1)}(async()=>{let e=Ce("current"),r=Ce("grid"),o=Ce("areas"),n,s=1;const p=()=>{s=Math.pow(1.1,n.zoom)},u=document.querySelector("#controls"),c=document.querySelector("#map-container"),h=document.querySelector("#map"),S=document.querySelector("#images"),$=document.querySelector("#drawings"),E=document.querySelector("#pins"),I=document.querySelector("#text"),y=document.querySelector("#about"),f=document.querySelector("#cursor"),C=document.querySelector("#btn-about"),v=document.querySelector("#areas"),X=document.querySelector("#btn-area-add"),Y=document.querySelector("#btn-area-rename"),P=document.querySelector("#btn-area-delete"),ne=document.querySelector("#btn-grid"),_=document.querySelector("#btn-save"),Q=document.querySelector("#btn-export"),H=document.querySelector("#btn-import"),A=document.querySelector("#btn-select"),G=document.querySelector("#btn-pan"),J=document.querySelector("#btn-text"),K=document.querySelectorAll('#options-colour > input[type="radio"]'),re=document.querySelector("#stroke"),j=document.querySelectorAll('#options-pin input[type="radio"]'),T=document.querySelector("#custom-pin"),ie=document.querySelector("#custom-pin-entry"),N=document.querySelector("#context"),x=document.querySelector("#context-delete"),z=document.querySelector("#context-notes"),w=document.querySelector("#context-images"),b=document.querySelector("#search"),se=document.querySelector("#search-results"),oe=document.querySelector("#toasts");if(!u||!c||!h||!S||!$||!E||!I||!y||!f||!A||!G||!J||!C||!v||!X||!Y||!P||!ne||!_||!Q||!H||!K.length||!re||!j.length||!T||!ie||!N||!x||!z||!w||!b||!se||!oe)throw new Error("Could not find elements");const ce=t=>{const a=document.createElement("li");a.textContent=t,oe.appendChild(a),setTimeout(()=>{a.remove()},2500)},F=t=>{e=t,n=o[t],v.value=t,be()},de=()=>{v.textContent="",Object.keys(o).sort().forEach(t=>{const a=document.createElement("option");a.value=t,a.textContent=t,t===e&&(a.selected=!0),v.appendChild(a)})},ue=()=>{document.querySelectorAll("#pins > *").forEach(t=>{t.style.transform=`translate(-50%, -50%) scale(${1/s})`})},he=()=>{E.textContent="",n.pins.forEach((t,a)=>{const i=t.type,l=document.createElement("div");l.textContent=i,l.style.top=`${t.y}px`,l.style.left=`${t.x}px`,E.appendChild(l),l.dataset.idx=a.toString(10)}),ue()},be=()=>{de(),he(),I.textContent="",n.text.forEach((t,a)=>{const i=document.createElement("div");i.contentEditable="plaintext-only",i.style.top=`${t.y}px`,i.style.left=`${t.x}px`,i.style.fontSize=`${t.size*100}%`,i.textContent=t.text,i.dataset.idx=a.toString(10),I.appendChild(i),i.addEventListener("input",()=>{n.text[parseInt(i.dataset.idx||"",10)].text=i.textContent||""}),i.addEventListener("blur",()=>{var l;(l=i.textContent)!=null&&l.trim()||(n.text.splice(parseInt(i.dataset.idx||"",10),1),Pe(i),i.remove())})}),xe(),le(),p(),W()};C.addEventListener("click",()=>{y.classList.toggle("show")}),v.addEventListener("change",()=>{const t=e,a=v.value;M({name:"change area",undo(){F(t)},redo(){F(a)}})}),X.addEventListener("click",()=>{const t=window.prompt("new area name?",`area ${Object.keys(o).length}`);if(!t)return;if(o[t]){window.alert("error: an area with that name already exists!");return}const a=e,i={offset:{x:0,y:0},zoom:1,images:{},drawings:[],pins:[],text:[]};M({name:"create area",undo(){delete o[t],de(),F(a)},redo(){o[t]=i,de(),F(t)}})}),Y.addEventListener("click",()=>{const t=e,a=window.prompt("rename area",e);!a||a===t||M({name:"rename area",undo(){o[t]=o[a],delete o[a],e=t,v.selectedOptions[0].value=v.selectedOptions[0].textContent=t},redo(){o[a]=o[t],delete o[t],e=a,v.selectedOptions[0].value=v.selectedOptions[0].textContent=a}})}),P.addEventListener("click",()=>{const t=e;if(Object.keys(o).length<=1){window.alert("error: cannot delete only area!");return}if(!window.confirm("delete area?"))return;const a=Object.keys(o).filter(m=>m!==t)[0],i=o[t],l=v.selectedOptions[0],d=v.selectedIndex;M({name:"delete area",undo(){o[t]=i,v.insertBefore(l,v.children[d]),F(t)},redo(){delete o[t],l.remove(),F(a)}})}),ne.addEventListener("click",()=>{const t="note: this is global and will misalign anything that has been already placed on the map",a=window.prompt(`Set map cell width (${t})`,r[0].toString(10));if(!a)return;const i=window.prompt(`Set map cell height (${t})`,r[1].toString(10));if(!i)return;const l=r[0],d=r[1],m=parseInt(a,10),k=parseInt(i,10);M({name:"resize grid",undo(){r[0]=l,r[1]=d,le()},redo(){r[0]=m,r[1]=k,le()}})}),_.addEventListener("click",async()=>{await ze("grid",r),await ze("current",e),await ze("areas",o),ce("saved")}),Q.addEventListener("click",async()=>{try{const t=JSON.stringify({grid:r,current:e,areas:o},void 0,"	");await Ot(t),ce("exported")}catch(t){je(t),window.alert(`error: failed to export - ${t.message}`)}}),H.addEventListener("click",async()=>{try{const t=await _t(),a=JSON.parse(t);if(typeof a.current!="string"||typeof a.areas!="object")throw new Error("invalid file");const i=o,l=a.areas,d=e,m=a.current;ce("imported"),M({name:"import",undo(){o=i,F(d)},redo(){o=l,F(m)}})}catch(t){je(t),window.alert(`error: failed to import - ${t.message}`)}}),K.forEach(t=>{t.style.backgroundColor=t.value}),j.forEach(t=>{var i;const a=document.createElement("span");a.textContent=t.value||"",(i=t.parentElement)==null||i.appendChild(a)});let q="select",D="";K.forEach(t=>{t.addEventListener("change",()=>{q="draw",D=t.value,f.style.setProperty("--colour",t.value),f.textContent="",f.className="draw",c.style.cursor="crosshair"})}),ie.addEventListener("input",()=>{T.value=ie.value,T.nextElementSibling.textContent=T.value,T.disabled=!T.value.trim()}),j.forEach(t=>{t.addEventListener("change",()=>{q="pin",D=t.value,f.textContent=t.value,f.className="pin",c.style.cursor="none"})}),A.addEventListener("change",()=>{q="select",D="",f.textContent="",f.className="select",c.style.cursor="auto"}),G.addEventListener("change",()=>{q="pan",D="",f.textContent="",f.className="pan",c.style.cursor="grab"}),J.addEventListener("change",()=>{q="text",D="",f.textContent="Type here...",f.className="text",c.style.cursor="text"}),re.addEventListener("input",()=>{f.style.setProperty("--size",`${parseInt(re.value,10)}px`)});const ge=(t,a)=>{const i=parseFloat(re.value)/s,l=Be({points:[],colour:a,size:i});$.appendChild(l);let d=[];const m=10;let k=0;const L=ee=>{const Ae=Date.now(),fe=Te(ee.clientX,ee.clientY);fe.x/=s,fe.y/=s,Ae-k<m?(d[d.length-1][0]=fe.x,d[d.length-1][1]=fe.y):(k=Ae,d=gt(d,2/s),d.push([fe.x,fe.y])),Oe(l,d,i)};L(t);const O=()=>{window.removeEventListener("pointermove",L),Oe(l,d,i);const ee={points:d,size:i,colour:a};M({name:"draw",undo(){n.drawings.pop(),xe()},redo(){n.drawings.push(ee),xe()}})};window.addEventListener("pointermove",L),window.addEventListener("pointerup",O,{once:!0})},W=()=>{let t=s;for(;t>4;)t/=2;for(;t<1;)t*=2;c.style.backgroundSize=`${r[0]*t/4}px ${r[1]*t/4}px`,c.style.backgroundPositionX=`${-n.offset.x}px`,c.style.backgroundPositionY=`${-n.offset.y}px`,h.style.transform=`translate(${-n.offset.x}px, ${-n.offset.y}px) scale(${s})`,ue()},xe=()=>{$.textContent="",n.drawings.forEach(t=>{$.appendChild(Be(t))})},le=()=>{S.textContent="";const[t,a,i,l]=Object.keys(n.images).length?Object.keys(n.images).map(d=>d.split("|").map(m=>parseInt(m,10))).reduce(([d,m,k,L],[O,ee])=>[Math.min(d,O),Math.min(m,ee),Math.max(k,O),Math.max(L,ee)],[1/0,1/0,-1/0,-1/0]):[0,0,0,0];for(let d=a-1;d<=l+1;++d)for(let m=t-1;m<=i+1;++m){const k=n.images[`${m}|${d}`],L=document.createElement(k?"img":"div");L.src=k,L.draggable=!1,L.dataset.x=m.toString(10),L.dataset.y=d.toString(10),L.style.width=`${r[0]}px`,L.style.height=`${r[1]}px`,L.style.transform=`translate(${m*r[0]}px, ${d*r[1]}px)`,S.appendChild(L)}},Te=(t,a)=>({x:t+n.offset.x,y:a+n.offset.y}),Me=()=>({x:parseFloat(f.style.left),y:parseFloat(f.style.top)}),Ne=()=>{const t=Me(),a=Te(t.x,t.y);return a.x/=s,a.y/=s,a},qe=t=>{const a={...n.offset},i={x:t.clientX,y:t.clientY},l=c.style.cursor;c.style.cursor="grabbing";const d=k=>{n.offset.x=-(k.clientX-i.x)+a.x,n.offset.y=-(k.clientY-i.y)+a.y,g&&ae(g,V),W()},m=()=>{window.removeEventListener("pointermove",d),c.style.cursor=l};window.addEventListener("pointermove",d),window.addEventListener("pointerup",m,{once:!0})},Ve=(t,a,i)=>{const l={x:t.clientX,y:t.clientY},d={x:parseInt(a.style.left,10),y:parseInt(a.style.top,10)},m=c.style.cursor;c.style.cursor="move";const k=O=>{i((O.clientX-l.x)/s+d.x,(O.clientY-l.y)/s+d.y)},L=()=>{window.removeEventListener("pointermove",k),c.style.cursor=m;const O={x:parseInt(a.style.left,10),y:parseInt(a.style.top,10)};(O.x!==d.x||O.y!==d.y)&&M({name:"move",undo(){i(d.x,d.y)},redo(){i(O.x,O.y)}})};window.addEventListener("pointermove",k),window.addEventListener("pointerup",L,{once:!0})};let g=null,V="";const Se=t=>{var l;if(t!==g)return;const a=n.pins[parseInt(t.dataset.idx||"",10)];w.textContent="";const i=(((l=a.images)==null?void 0:l.split("|"))||[]).filter(d=>d);if(i.forEach(d=>{const m=document.createElement("img");m.src=d,m.draggable=!1;const k=document.createElement("li"),L=document.createElement("button");L.title="open in new tab",L.textContent="🔍",L.addEventListener("click",()=>{window.open(d,"_blank")});const O=document.createElement("button");O.title="delete",O.textContent="✖",O.addEventListener("click",()=>{k.remove(),a.images=Array.from(w.querySelectorAll("img")).map(ee=>ee.src).join("|"),Se(t)}),k.appendChild(L),k.appendChild(O),k.appendChild(m),w.appendChild(k)}),!i.length){const d=document.createElement("li");d.textContent="paste to add image",d.className="null",w.appendChild(d)}},ae=(t,a)=>{if(pe(),g=t,V=a,a==="pin"){const i=n.pins[parseInt(g.dataset.idx||"",10)];N.classList.add("show");const l=g.getBoundingClientRect();g.classList.add("selected"),z.value=i.notes||"",Se(t),N.style.top=`${l.bottom<c.clientHeight/2?l.bottom:l.top-N.clientHeight}px`,N.style.left=`${l.right<c.clientWidth/2?l.right:l.left-N.clientWidth}px`,requestAnimationFrame(()=>{window.addEventListener("pointerdown",d=>{d.target&&![N,g].includes(d.target)&&!(N.contains(d.target)||!(g!=null&&g.contains(d.target)))&&pe()},{once:!0})})}else(a==="image"||a==="drawing")&&g.classList.add("selected")},pe=()=>{N.classList.remove("show"),g==null||g.classList.remove("selected"),g=null},Pe=t=>{let a=t.nextSibling;for(;a;)a.dataset.idx=(parseInt(a.dataset.idx||"",10)-1).toString(10),a=a.nextSibling};x.addEventListener("click",()=>{if(!g)return;const t=parseInt(g.dataset.idx||"",10),a=n.pins[t];M({name:"delete pin",undo(){n.pins.splice(t,0,a),he(),ae(E.children[t],"pin")},redo(){n.pins.splice(t,1),he(),pe()}})}),z.addEventListener("input",()=>{if(!g)return;const t=n.pins[parseInt(g.dataset.idx||"",10)];t.notes=z.value}),c.addEventListener("pointerdown",t=>{const a=document.activeElement;if(u.contains(a)&&(a==null||a.blur()),t.button===1){t.preventDefault(),qe(t);return}else if(t.button===0){if(q==="select"){pe();const i=document.elementFromPoint(t.clientX,t.clientY);if(i!=null&&i.closest("#pins")){a==null||a.blur(),t.preventDefault(),ae(i,"pin");const l=n.pins[parseInt(i.dataset.idx||"",10)];Ve(t,i,(d,m)=>{i.style.left=`${d}px`,i.style.top=`${m}px`,l.x=d,l.y=m,ae(i,"pin")})}else i!=null&&i.closest("#images")?(a==null||a.blur(),t.preventDefault(),ae(i,"image")):i!=null&&i.closest("#drawings")&&(a==null||a.blur(),t.preventDefault(),ae(i,"drawing"));return}else if(q==="pan")t.preventDefault(),qe(t);else if(q==="pin"){t.preventDefault();const i=D,l=document.createElement("div");l.textContent=i;const d=Ne();l.style.top=`${d.y}px`,l.style.left=`${d.x}px`,l.dataset.idx=n.pins.length.toString(10),A.click();const m={x:d.x,y:d.y,type:D,notes:"",images:""};M({name:"place pin",undo(){pe(),n.pins.pop(),l.remove(),W()},redo(){E.appendChild(l),n.pins.push(m),W(),ae(l,"pin")}})}else if(q==="draw")t.preventDefault(),ge(t,D);else if(q==="text"){t.preventDefault();const i=document.createElement("div");i.contentEditable="plaintext-only";const l=Ne();i.style.top=`${l.y}px`,i.style.left=`${l.x}px`,i.style.fontSize="200%",i.dataset.idx=n.text.length.toString(10),A.click(),i.addEventListener("input",()=>{n.text[parseInt(i.dataset.idx||"",10)].text=i.textContent||""}),i.addEventListener("blur",()=>{var m;(m=i.textContent)!=null&&m.trim()||(n.text.splice(parseInt(i.dataset.idx||"",10),1),Pe(i),i.remove())});const d={x:l.x,y:l.y,text:"",size:2};M({name:"place text",undo(){i.remove(),n.text.pop()},redo(){I.appendChild(i),n.text.push(d),i.focus()}})}}}),c.addEventListener("pointermove",t=>{f.style.left=`${t.clientX}px`,f.style.top=`${t.clientY}px`});const et=t=>{const a=g;if(!a)return;const i=n.pins[parseInt(a.dataset.idx||"",10)],l=i.images,d=[i.images,t].filter(m=>m).join("|");M({name:"add image to pin",undo(){i.images=l,Se(a)},redo(){i.images=d,Se(a)}})},tt=t=>{if(!g)return;const a=`${g.dataset.x}|${g.dataset.y}`,i=n.images[a];M({name:"place image",undo(){i?n.images[a]=i:delete n.images[a],le()},redo(){n.images[a]=t,le()}})};Dt(t=>{g&&V==="pin"?et(t):g&&V==="image"&&tt(t)});let Ie=!1;window.addEventListener("keydown",t=>{var i;const a=document.activeElement;if((a==null?void 0:a.tagName)==="TEXTAREA"||(a==null?void 0:a.tagName)==="INPUT"||(a==null?void 0:a.contentEditable)==="plaintext-only"){if(t.ctrlKey&&t.key==="="&&a.parentElement===I){t.preventDefault();const l=n.text[parseInt(a.dataset.idx||"",10)];l.size*=2,a.style.fontSize=`${l.size*100}%`}else if(t.ctrlKey&&t.key==="-"&&a.parentElement===I){t.preventDefault();const l=n.text[parseInt(a.dataset.idx||"",10)];l.size/=2,a.style.fontSize=`${l.size*100}%`}return}if(t.ctrlKey&&t.key==="z"){const l=Mt();l!==!1&&ce(["undo",l].filter(d=>d).join(" - "))}if(t.ctrlKey&&t.key==="y"||t.ctrlKey&&t.shiftKey&&t.key==="z"){const l=Nt();l!==!1&&ce(["redo",l].filter(d=>d).join(" - "))}if(t.key==="Escape"&&pe(),(t.key==="Backspace"||t.key==="Delete")&&g&&V==="image"){const l=`${g.dataset.x}|${g.dataset.y}`,d=n.images[l];M({name:"delete image",undo(){n.images[l]=d,le()},redo(){delete n.images[l],le()}})}if((t.key==="Backspace"||t.key==="Delete")&&g&&V==="drawing"){const l=Array.from(((i=g.parentElement)==null?void 0:i.children)||[]).indexOf(g),d=n.drawings[l];M({name:"delete drawing",undo(){n.drawings.splice(l,0,d),xe()},redo(){n.drawings.splice(l,1),xe()}})}if((t.key==="Backspace"||t.key==="Delete")&&g&&V==="pin"&&x.click(),t.ctrlKey&&t.key==="s"){t.preventDefault(),_.click();return}if(t.ctrlKey&&t.key==="c"&&g&&V==="image"){t.preventDefault(),navigator.clipboard.writeText(g.src);return}if(!Ie&&t.key===" "){Ie=!0;const l=q,d=D;G.click(),window.addEventListener("keyup",m=>{var k;m.key===" "&&(Ie=!1,(k=document.querySelector(`input[name="tool"][value="${d}"], input[name="tool"][value="${l}"]`))==null||k.click())})}}),c.addEventListener("wheel",t=>{n.offset.x+=t.deltaX,n.zoom-=Math.sign(t.deltaY);const a=s;p();const i=s-a,l=Me(),d={x:(l.x+n.offset.x)/a,y:(l.y+n.offset.y)/a};n.offset.x+=d.x*i,n.offset.y+=d.y*i,W(),g&&ae(g,V)});const nt=(t,a)=>{n.offset.x=t*s-c.clientWidth/2,n.offset.y=a*s-c.clientHeight/2,W()};let ye;b.addEventListener("focus",()=>{ye=new dt("key"),ye.addDocuments(Object.entries(o).flatMap(([t,{pins:a,text:i}])=>a.map((l,d)=>({key:`${t}-p-${d}`,text:[t,l.type,l.notes].filter(m=>m).join(" > "),original:l})).concat(i.map((l,d)=>({key:`${t}-t-${d}`,text:[t,l.text].filter(m=>m).join(" > "),original:l}))))),ye.addIndex("text")}),b.addEventListener("input",()=>{const t=ye.search(b.value);se.textContent="",t.forEach(a=>{const i=document.createElement("li"),l=document.createElement("span");l.innerHTML=a.text,Lt(l,b.value,ye.tokenizer.tokenize);const d=document.createElement("button");d.title="focus",d.textContent="🔍",d.addEventListener("click",()=>{const[m]=a.key.split("-");e!==m&&F(m),nt(a.original.x,a.original.y)}),i.appendChild(d),i.appendChild(l),se.appendChild(i)})}),F(e)})();
