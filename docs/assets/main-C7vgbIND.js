import{g as xt,a as je,s as Te}from"./Storage-BTp_IRcA.js";import{e as He}from"./index-CiFVBsiZ.js";var vt=function(){function e(){}var r=e.prototype;return r.expandToken=function(n){for(var s=[],f="",d=0,u=n.length;d<u;++d)f+=n.charAt(d),s.push(f);return s},e}(),wt=function(){function e(){}var r=e.prototype;return r.sanitize=function(n){return n?n.toLocaleLowerCase().trim():""},e}();function Me(e,r){r=r||[],e=e||{};for(var o=e,n=0;n<r.length;n++)if(o=o[r[n]],o==null)return null;return o}var bt=function(){function e(o){this._uidFieldName=o,this._tokenToIdfCache={},this._tokenMap={}}var r=e.prototype;return r.indexDocument=function(n,s,f){this._tokenToIdfCache={};var d=this._tokenMap,u;typeof d[n]!="object"?d[n]=u={$numDocumentOccurrences:0,$totalNumOccurrences:1,$uidMap:{}}:(u=d[n],u.$totalNumOccurrences++);var p=u.$uidMap;typeof p[s]!="object"?(u.$numDocumentOccurrences++,p[s]={$document:f,$numTokenOccurrences:1}):p[s].$numTokenOccurrences++},r.search=function(n,s){for(var f={},d=0,u=n.length;d<u;d++){var p=n[d],k=this._tokenMap[p];if(!k)return[];if(d===0)for(var g=Object.keys(k.$uidMap),m=0,y=g.length;m<y;m++){var h=g[m];f[h]=k.$uidMap[h].$document}else for(var g=Object.keys(f),m=0,y=g.length;m<y;m++){var h=g[m];typeof k.$uidMap[h]!="object"&&delete f[h]}}var v=[];for(var h in f)v.push(f[h]);var w=this._createCalculateTfIdf();return v.sort(function(I,O){return w(n,O,s)-w(n,I,s)})},r._createCalculateIdf=function(){var n=this._tokenMap,s=this._tokenToIdfCache;return function(d,u){if(!s[d]){var p=typeof n[d]<"u"?n[d].$numDocumentOccurrences:0;s[d]=1+Math.log(u.length/(1+p))}return s[d]}},r._createCalculateTfIdf=function(){var n=this._tokenMap,s=this._uidFieldName,f=this._createCalculateIdf();return function(u,p,k){for(var g=0,m=0,y=u.length;m<y;++m){var h=u[m],v=f(h,k);v===1/0&&(v=0);var w;s instanceof Array?w=p&&Me(p,s):w=p&&p[s];var I=typeof n[h]<"u"&&typeof n[h].$uidMap[w]<"u"?n[h].$uidMap[w].$numTokenOccurrences:0;g+=I*v}return g}},e}(),Et=/[^a-zа-яё0-9\-']+/i,St=function(){function e(){}var r=e.prototype;return r.tokenize=function(n){return n.split(Et).filter(function(s){return s})},e}();function Ue(e,r){for(var o=0;o<r.length;o++){var n=r[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function kt(e,r,o){return r&&Ue(e.prototype,r),o&&Ue(e,o),e}var Ct=function(){function e(o){if(!o)throw Error("js-search requires a uid field name constructor parameter");this._uidFieldName=o,this._indexStrategy=new vt,this._searchIndex=new bt(o),this._sanitizer=new wt,this._tokenizer=new St,this._documents=[],this._searchableFields=[]}var r=e.prototype;return r.addDocument=function(n){this.addDocuments([n])},r.addDocuments=function(n){this._documents=this._documents.concat(n),this.indexDocuments_(n,this._searchableFields)},r.addIndex=function(n){this._searchableFields.push(n),this.indexDocuments_(this._documents,[n])},r.search=function(n){var s=this._tokenizer.tokenize(this._sanitizer.sanitize(n));return this._searchIndex.search(s,this._documents)},r.indexDocuments_=function(n,s){this._initialized=!0;for(var f=this._indexStrategy,d=this._sanitizer,u=this._searchIndex,p=this._tokenizer,k=this._uidFieldName,g=0,m=n.length;g<m;g++){var y=n[g],h;k instanceof Array?h=Me(y,k):h=y[k];for(var v=0,w=s.length;v<w;v++){var I,O=s[v];if(O instanceof Array?I=Me(y,O):I=y[O],I!=null&&typeof I!="string"&&I.toString&&(I=I.toString()),typeof I=="string")for(var R=p.tokenize(d.sanitize(I)),N=0,ie=R.length;N<ie;N++)for(var D=R[N],U=f.expandToken(D),G=0,J=U.length;G<J;G++){var X=U[G];u.indexDocument(X,h,y)}}}},kt(e,[{key:"indexStrategy",set:function(n){if(this._initialized)throw Error("IIndexStrategy cannot be set after initialization");this._indexStrategy=n},get:function(){return this._indexStrategy}},{key:"sanitizer",set:function(n){if(this._initialized)throw Error("ISanitizer cannot be set after initialization");this._sanitizer=n},get:function(){return this._sanitizer}},{key:"searchIndex",set:function(n){if(this._initialized)throw Error("ISearchIndex cannot be set after initialization");this._searchIndex=n},get:function(){return this._searchIndex}},{key:"tokenizer",set:function(n){if(this._initialized)throw Error("ITokenizer cannot be set after initialization");this._tokenizer=n},get:function(){return this._tokenizer}}]),e}(),_e={exports:{}};function It(e,r){var o=e[0]-r[0],n=e[1]-r[1];return o*o+n*n}var $t=function(r,o){if(r.length<=1)return r;o=typeof o=="number"?o:1;for(var n=o*o,s=r[0],f=[s],d,u=1,p=r.length;u<p;u++)d=r[u],It(d,s)>n&&(f.push(d),s=d);return s!==d&&f.push(d),f};function Ot(e,r,o){var n=r[0],s=r[1],f=o[0]-n,d=o[1]-s;if(f!==0||d!==0){var u=((e[0]-n)*f+(e[1]-s)*d)/(f*f+d*d);u>1?(n=o[0],s=o[1]):u>0&&(n+=f*u,s+=d*u)}return f=e[0]-n,d=e[1]-s,f*f+d*d}function Ne(e,r,o,n,s){for(var f=n,d,u=r+1;u<o;u++){var p=Ot(e[u],e[r],e[o]);p>f&&(d=u,f=p)}f>n&&(d-r>1&&Ne(e,r,d,n,s),s.push(e[d]),o-d>1&&Ne(e,d,o,n,s))}var zt=function(r,o){if(r.length<=1)return r;o=typeof o=="number"?o:1;var n=o*o,s=r.length-1,f=[r[0]];return Ne(r,0,s,n,f),f.push(r[s]),f},ot=$t,it=zt;_e.exports=function(r,o){return r=ot(r,o),r=it(r,o),r};_e.exports.radialDistance=ot;_e.exports.douglasPeucker=it;var Lt=_e.exports;const _t=xt(Lt);let at=!1;function S(e=!0){at=e}window.addEventListener("beforeunload",function(e){if(!at)return;const r="You have unsaved changes, are you sure you want to quit?";return(e||window.event).returnValue=r,r});function Ge(e,r,o,n=s=>s){return e*n(.5-r*(.5-o))}function Dt(e){return[-e[0],-e[1]]}function H(e,r){return[e[0]+r[0],e[1]+r[1]]}function K(e,r){return[e[0]-r[0],e[1]-r[1]]}function W(e,r){return[e[0]*r,e[1]*r]}function jt(e,r){return[e[0]/r,e[1]/r]}function Ie(e){return[e[1],-e[0]]}function Je(e,r){return e[0]*r[0]+e[1]*r[1]}function Tt(e,r){return e[0]===r[0]&&e[1]===r[1]}function Mt(e){return Math.hypot(e[0],e[1])}function Nt(e){return e[0]*e[0]+e[1]*e[1]}function Ze(e,r){return Nt(K(e,r))}function st(e){return jt(e,Mt(e))}function qt(e,r){return Math.hypot(e[1]-r[1],e[0]-r[0])}function $e(e,r,o){let n=Math.sin(o),s=Math.cos(o),f=e[0]-r[0],d=e[1]-r[1],u=f*s-d*n,p=f*n+d*s;return[u+r[0],p+r[1]]}function qe(e,r,o){return H(e,W(K(r,e),o))}function Qe(e,r,o){return H(e,W(r,o))}var{min:we,PI:At}=Math,Ve=.275,Oe=At+1e-4;function Pt(e,r={}){let{size:o=16,smoothing:n=.5,thinning:s=.5,simulatePressure:f=!0,easing:d=b=>b,start:u={},end:p={},last:k=!1}=r,{cap:g=!0,easing:m=b=>b*(2-b)}=u,{cap:y=!0,easing:h=b=>--b*b*b+1}=p;if(e.length===0||o<=0)return[];let v=e[e.length-1].runningLength,w=u.taper===!1?0:u.taper===!0?Math.max(o,v):u.taper,I=p.taper===!1?0:p.taper===!0?Math.max(o,v):p.taper,O=Math.pow(o*n,2),R=[],N=[],ie=e.slice(0,10).reduce((b,L)=>{let C=L.pressure;if(f){let $=we(1,L.distance/o),ce=we(1,1-$);C=we(1,b+(ce-b)*($*Ve))}return(b+C)/2},e[0].pressure),D=Ge(o,s,e[e.length-1].pressure,d),U,G=e[0].vector,J=e[0].point,X=J,Z=J,Q=X,ae=!1;for(let b=0;b<e.length;b++){let{pressure:L}=e[b],{point:C,vector:$,distance:ce,runningLength:Y}=e[b];if(b<e.length-1&&v-Y<3)continue;if(s){if(f){let F=we(1,ce/o),xe=we(1,1-F);L=we(1,ie+(xe-ie)*(F*Ve))}D=Ge(o,s,L,d)}else D=o/2;U===void 0&&(U=D);let me=Y<w?m(Y/w):1,ge=v-Y<I?h((v-Y)/I):1;D=Math.max(.01,D*Math.min(me,ge));let be=(b<e.length-1?e[b+1]:e[b]).vector,he=b<e.length-1?Je($,be):1,Ee=Je($,G)<0&&!ae,le=he!==null&&he<0;if(Ee||le){let F=W(Ie(G),D);for(let xe=1/13,ue=0;ue<=1;ue+=xe)Z=$e(K(C,F),C,Oe*ue),R.push(Z),Q=$e(H(C,F),C,Oe*-ue),N.push(Q);J=Z,X=Q,le&&(ae=!0);continue}if(ae=!1,b===e.length-1){let F=W(Ie($),D);R.push(K(C,F)),N.push(H(C,F));continue}let A=W(Ie(qe(be,$,he)),D);Z=K(C,A),(b<=1||Ze(J,Z)>O)&&(R.push(Z),J=Z),Q=H(C,A),(b<=1||Ze(X,Q)>O)&&(N.push(Q),X=Q),ie=L,G=$}let q=e[0].point.slice(0,2),M=e.length>1?e[e.length-1].point.slice(0,2):H(e[0].point,[1,1]),V=[],se=[];if(e.length===1){if(!(w||I)||k){let b=Qe(q,st(Ie(K(q,M))),-(U||D)),L=[];for(let C=1/13,$=C;$<=1;$+=C)L.push($e(b,q,Oe*2*$));return L}}else{if(!(w||I&&e.length===1))if(g)for(let L=1/13,C=L;C<=1;C+=L){let $=$e(N[0],q,Oe*C);V.push($)}else{let L=K(R[0],N[0]),C=W(L,.5),$=W(L,.51);V.push(K(q,C),K(q,$),H(q,$),H(q,C))}let b=Ie(Dt(e[e.length-1].vector));if(I||w&&e.length===1)se.push(M);else if(y){let L=Qe(M,b,D);for(let C=1/29,$=C;$<1;$+=C)se.push($e(L,M,Oe*3*$))}else se.push(H(M,W(b,D)),H(M,W(b,D*.99)),K(M,W(b,D*.99)),K(M,W(b,D)))}return R.concat(se,N.reverse(),V)}function Ft(e,r={}){var o;let{streamline:n=.5,size:s=16,last:f=!1}=r;if(e.length===0)return[];let d=.15+(1-n)*.85,u=Array.isArray(e[0])?e:e.map(({x:h,y:v,pressure:w=.5})=>[h,v,w]);if(u.length===2){let h=u[1];u=u.slice(0,-1);for(let v=1;v<5;v++)u.push(qe(u[0],h,v/4))}u.length===1&&(u=[...u,[...H(u[0],[1,1]),...u[0].slice(2)]]);let p=[{point:[u[0][0],u[0][1]],pressure:u[0][2]>=0?u[0][2]:.25,vector:[1,1],distance:0,runningLength:0}],k=!1,g=0,m=p[0],y=u.length-1;for(let h=1;h<u.length;h++){let v=f&&h===y?u[h].slice(0,2):qe(m.point,u[h],d);if(Tt(m.point,v))continue;let w=qt(v,m.point);if(g+=w,h<y&&!k){if(g<s)continue;k=!0}m={point:v,pressure:u[h][2]>=0?u[h][2]:.5,vector:st(K(m.point,v)),distance:w,runningLength:g},p.push(m)}return p[0].vector=((o=p[1])==null?void 0:o.vector)||[0,0],p}function Kt(e,r={}){return Pt(Ft(e,r),r)}var Rt=Kt;const Le=(e,r)=>(e+r)/2;function Xt(e,r=!0){const o=e.length;if(o<4)return"";let n=e[0],s=e[1];const f=e[2];let d=`M${n[0].toFixed(2)},${n[1].toFixed(2)} Q${s[0].toFixed(2)},${s[1].toFixed(2)} ${Le(s[0],f[0]).toFixed(2)},${Le(s[1],f[1]).toFixed(2)} T`;for(let u=2,p=o-1;u<p;u++)n=e[u],s=e[u+1],d+=`${Le(n[0],s[0]).toFixed(2)},${Le(n[1],s[1]).toFixed(2)} `;return r&&(d+="Z"),d}function et(e){const r=document.createElementNS("http://www.w3.org/2000/svg","path");return r.setAttributeNS(null,"fill",e.colour),Ae(r,e.points,e.size),r}function Ae(e,r,o){e.setAttributeNS(null,"d",Xt(Rt(r,{size:o,smoothing:.5,streamline:.25,thinning:.5})))}function tt(e,r,o){return e.replace(new RegExp(`(${r.map(n=>n.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")).join("|")})`,"ig"),o)}function nt(e,r){const o=[],n=/^\s*$/;function s(f){if(f.nodeType==3)(r||!n.test(f.nodeValue||""))&&o.push(f);else for(var d=0,u=f.childNodes.length;d<u;++d)s(f.childNodes[d])}return s(e),o}const rt=(e,r)=>{e.forEach(o=>{const n=o.textContent,s=r(n||""),f=document.createRange().createContextualFragment(s);o.replaceWith(f)})},Yt=(e,r,o)=>{const n=o(r);let s=nt(e,!0);rt(s,f=>tt(f,[r],'<mark class="exact">$1</mark>')),s=nt(e,!0),rt(s,f=>tt(f,n,"<mark>$1</mark>"))};function ct(e){return e&&e.constructor&&typeof e.constructor.isBuffer=="function"&&e.constructor.isBuffer(e)}function lt(e){return e}function ut(e,r){r=r||{};const o=r.delimiter||".",n=r.maxDepth,s=r.transformKey||lt,f={};function d(u,p,k){k=k||1,Object.keys(u).forEach(function(g){const m=u[g],y=r.safe&&Array.isArray(m),h=Object.prototype.toString.call(m),v=ct(m),w=h==="[object Object]"||h==="[object Array]",I=p?p+o+s(g):s(g);if(!y&&!v&&w&&Object.keys(m).length&&(!r.maxDepth||k<n))return d(m,I,k+1);f[I]=m})}return d(e),f}function dt(e,r){r=r||{};const o=r.delimiter||".",n=r.overwrite||!1,s=r.transformKey||lt,f={};if(ct(e)||Object.prototype.toString.call(e)!=="[object Object]")return e;function u(g){const m=Number(g);return isNaN(m)||g.indexOf(".")!==-1||r.object?g:m}function p(g,m,y){return Object.keys(y).reduce(function(h,v){return h[g+o+v]=y[v],h},m)}function k(g){const m=Object.prototype.toString.call(g),y=m==="[object Array]",h=m==="[object Object]";if(g){if(y)return!g.length;if(h)return!Object.keys(g).length}else return!0}return e=Object.keys(e).reduce(function(g,m){const y=Object.prototype.toString.call(e[m]);return!(y==="[object Object]"||y==="[object Array]")||k(e[m])?(g[m]=e[m],g):p(m,g,ut(e[m],r))},{}),Object.keys(e).forEach(function(g){const m=g.split(o).map(s);let y=u(m.shift()),h=u(m[0]),v=f;for(;h!==void 0;){if(y==="__proto__")return;const w=Object.prototype.toString.call(v[y]),I=w==="[object Object]"||w==="[object Array]";if(!n&&!I&&typeof v[y]<"u")return;(n&&!I||!n&&v[y]==null)&&(v[y]=typeof h=="number"&&!r.object?[]:{}),v=v[y],m.length>0&&(y=u(m.shift()),h=u(m[0]))}v[y]=dt(e[g],r)}),f}function Bt(){return new Promise((e,r)=>{const o=document.createElement("input");o.type="file",o.onchange=()=>{var f;const n=(f=o.files)==null?void 0:f[0];if(!n)return e("");const s=new FileReader;s.onload=()=>{const d=s.result,u=new TextDecoder("utf-8");let p="";const k=[],g=1e5;for(let m=0;m<d.byteLength;m+=g)for(p+=u.decode(d.slice(m,Math.min(d.byteLength,m+g)));p.includes(`,
`);){let[y,...h]=p.split(`,
`);p=h.join(`,
`),y=y.replace(/^\[\n/,""),y=y.replace(/^\]/,""),!(y==="["||y==="]")&&k.push(JSON.parse(y))}e(dt(Object.fromEntries(k)))},s.onerror=d=>{r(d)},s.readAsArrayBuffer(n)},o.oncancel=()=>{e("")},o.click()})}function Wt(e){document.addEventListener("paste",r=>{const o=r.clipboardData||r.originalEvent.clipboardData,n=o.getData("text");if(n!=null&&n.startsWith("data:image")){e(n);return}const s=o.items;for(let f in s){const d=s[f];if(d.kind==="file"){const u=d.getAsFile(),p=new FileReader;p.onload=()=>{const k=p.result;k!=null&&k.startsWith("data:image")&&e(k)},p.readAsDataURL(u)}}})}async function Ht(e){if(!("showSaveFilePicker"in window))throw new Error("browser does not support native file system access");const r={types:[{description:"JSON",accept:{"application/json":[".json"]}}]},n=await(await window.showSaveFilePicker(r)).createWritable(),s=Object.entries(ut(e));await n.write(`[
`);for(let f of s)await n.write(JSON.stringify(f)),f!==s[s.length-1]&&await n.write(`,
`);await n.write(`
]`),await n.close()}const ee=[];let oe=-1;const Ut=50;function T(e){for(ee.splice(oe+1,ee.length),ee.push(e);ee.length>Ut;)ee.shift();oe=ee.length-1,ee[oe].redo()}function Gt(){const e=ee[oe];return e?(e.undo(),--oe,e.name):(oe=-1,!1)}function Jt(){++oe;const e=ee[oe];return e?(e==null||e.redo(),e==null?void 0:e.name):(oe=ee.length-1,!1)}(async()=>{let e=je("current"),r=je("grid"),o=je("areas"),n,s=1;const f=()=>{s=Math.pow(1.1,n.zoom)},d=document.querySelector("#overlay"),u=document.querySelector("#controls"),p=document.querySelector("#map-container"),k=document.querySelector("#map"),g=document.querySelector("#images"),m=document.querySelector("#drawings"),y=document.querySelector("#pins"),h=document.querySelector("#text"),v=document.querySelector("#about"),w=document.querySelector("#cursor"),I=document.querySelector("#btn-about"),O=document.querySelector("#areas"),R=document.querySelector("#btn-area-add"),N=document.querySelector("#btn-area-rename"),ie=document.querySelector("#btn-area-delete"),D=document.querySelector("#btn-grid"),U=document.querySelector("#btn-save"),G=document.querySelector("#btn-export"),J=document.querySelector("#btn-import"),X=document.querySelector("#btn-select"),Z=document.querySelector("#btn-pan"),Q=document.querySelector("#btn-text"),ae=document.querySelectorAll('#options-colour > input[type="radio"]'),q=document.querySelector("#stroke"),M=document.querySelectorAll('#options-pin input[type="radio"]'),V=document.querySelector("#custom-pin"),se=document.querySelector("#custom-pin-entry"),b=document.querySelector("#context"),L=document.querySelector("#context-delete"),C=document.querySelector("#context-pin"),$=document.querySelector("#context-datalist"),ce=document.querySelector("#context-notes"),Y=document.querySelector("#context-images"),me=document.querySelector("#search"),ge=document.querySelector("#search-results"),be=document.querySelector("#toasts");if(!d||!u||!p||!k||!g||!m||!y||!h||!v||!w||!X||!Z||!Q||!I||!O||!R||!N||!ie||!D||!U||!G||!J||!ae.length||!q||!M.length||!V||!se||!b||!L||!$||!C||!ce||!Y||!me||!ge||!be)throw new Error("Could not find elements");const he=t=>{d.textContent=t,d.classList.add("show")},Ee=()=>{d.textContent="",d.classList.remove("show")},le=t=>{const i=document.createElement("li");i.textContent=t,be.appendChild(i),setTimeout(()=>{i.remove()},2500)},A=t=>{e=t,n=o[t],O.value=t,fe(),ft()},F=()=>{O.textContent="",Object.keys(o).sort().forEach(t=>{const i=document.createElement("option");i.value=t,i.textContent=t,t===e&&(i.selected=!0),O.appendChild(i)})},xe=()=>{document.querySelectorAll("#pins > *").forEach(t=>{t.style.transform=`translate(-50%, -50%) scale(${1/s})`})},ue=()=>{y.textContent="",n.pins.forEach((t,i)=>{const a=t.type,c=document.createElement("div");c.textContent=a||"???",c.style.top=`${t.y}px`,c.style.left=`${t.x}px`,y.appendChild(c),c.dataset.idx=i.toString(10)}),xe()},ft=()=>{F(),ue(),h.textContent="",n.text.forEach((t,i)=>{const a=document.createElement("div");try{a.contentEditable="plaintext-only"}catch{a.contentEditable="true"}a.style.top=`${t.y}px`,a.style.left=`${t.x}px`,a.style.fontSize=`${t.size*100}%`,a.textContent=t.text,a.dataset.idx=i.toString(10),h.appendChild(a),a.addEventListener("input",()=>{n.text[parseInt(a.dataset.idx||"",10)].text=a.textContent||"",S()}),a.addEventListener("blur",()=>{var c;(c=a.textContent)!=null&&c.trim()||(n.text.splice(parseInt(a.dataset.idx||"",10),1),We(a),a.remove(),S())})}),Se(),ye(),f(),ve()};I.addEventListener("click",()=>{v.classList.toggle("show")}),O.addEventListener("change",()=>{const t=e,i=O.value;t!==i&&T({name:"change area",undo(){A(t)},redo(){A(i)}})}),R.addEventListener("click",()=>{const t=window.prompt("new area name?",`area ${Object.keys(o).length}`);if(!t)return;if(o[t]){window.alert("error: an area with that name already exists!");return}const i=e,a={offset:{x:0,y:0},zoom:1,images:{},drawings:[],pins:[],text:[]};T({name:"create area",undo(){delete o[t],F(),A(i),S()},redo(){o[t]=a,F(),A(t),S()}})}),N.addEventListener("click",()=>{const t=e,i=window.prompt("rename area",e);!i||i===t||T({name:"rename area",undo(){o[t]=o[i],delete o[i],e=t,O.selectedOptions[0].value=O.selectedOptions[0].textContent=t,S()},redo(){o[i]=o[t],delete o[t],e=i,O.selectedOptions[0].value=O.selectedOptions[0].textContent=i,S()}})}),ie.addEventListener("click",()=>{const t=e;if(Object.keys(o).length<=1){window.alert("error: cannot delete only area!");return}if(!window.confirm("delete area?"))return;const i=Object.keys(o).filter(x=>x!==t)[0],a=o[t],c=O.selectedOptions[0],l=O.selectedIndex;T({name:"delete area",undo(){o[t]=a,O.insertBefore(c,O.children[l]),A(t),S()},redo(){delete o[t],c.remove(),A(i),S()}})}),D.addEventListener("click",()=>{const t="note: this is global and will misalign anything that has been already placed on the map",i=window.prompt(`Set map cell width (${t})`,r[0].toString(10));if(!i)return;const a=window.prompt(`Set map cell height (${t})`,r[1].toString(10));if(!a)return;const c=r[0],l=r[1],x=parseInt(i,10),z=parseInt(a,10);T({name:"resize grid",undo(){r[0]=c,r[1]=l,ye(),S()},redo(){r[0]=x,r[1]=z,ye(),S()}})}),U.addEventListener("click",async()=>{he("saving...");try{await Te("grid",r),await Te("current",e),await Te("areas",o),le("saved"),S(!1)}finally{Ee()}}),G.addEventListener("click",async()=>{he("exporting...");try{await Ht({grid:r,current:e,areas:o}),le("exported"),S(!1)}catch(t){He(t),window.alert(`error: failed to export - ${t.message}`)}finally{Ee()}}),J.addEventListener("click",async()=>{he("importing...");try{const t=await Bt();if(!t)return;if(typeof t.current!="string"||typeof t.areas!="object")throw new Error("invalid file");const i=r,a=t.grid,c=o,l=t.areas,x=e,z=t.current;le("imported"),T({name:"import",undo(){r=i,o=c,A(x),S()},redo(){r=a,o=l,A(z),S()}})}catch(t){He(t),window.alert(`error: failed to import - ${t.message}`)}finally{Ee()}}),ae.forEach(t=>{t.style.backgroundColor=t.value}),M.forEach(t=>{var a;const i=document.createElement("span");i.textContent=t.value||"",(a=t.parentElement)==null||a.appendChild(i)});let P="select",te="",Pe=Array.from(ae)[0].value,Fe=Array.from(M)[0].value;const B=(t,i="",a=!0)=>{var c;P=t,te=i,P==="select"?(w.textContent="",w.className="select",p.style.cursor="auto"):P==="pan"?(w.textContent="",w.className="pan",p.style.cursor="grab"):P==="text"?(w.textContent="Type here...",w.className="text",p.style.cursor="text"):P==="pin"?(Fe=te,w.textContent=te,w.className="pin",p.style.cursor="none"):P==="draw"&&(Pe=te,w.style.setProperty("--colour",te),w.textContent="",w.className="draw",p.style.cursor="crosshair"),a&&((c=document.querySelector(`input[type="radio"][name="tool"][value="${te||P}"]`))==null||c.click())};ae.forEach(t=>{t.addEventListener("change",()=>{B("draw",t.value,!1)})}),se.addEventListener("input",()=>{V.value=se.value,V.nextElementSibling.textContent=V.value,V.disabled=!V.value.trim()}),M.forEach(t=>{t.addEventListener("change",()=>{B("pin",t.value,!1)})}),X.addEventListener("change",()=>{B("select",void 0,!1)}),Z.addEventListener("change",()=>{B("pan",void 0,!1)}),Q.addEventListener("change",()=>{B("text",void 0,!1)});const Ke=()=>{w.style.setProperty("--size",`${parseInt(q.value,10)}px`)};q.addEventListener("input",Ke);const pt=(t,i)=>{const a=parseFloat(q.value)/(s*2),c=et({points:[],colour:i,size:a});m.appendChild(c);let l=[];const x=10;let z=0;const _=re=>{const ze=Date.now(),pe=Re(re.clientX,re.clientY);pe.x/=s,pe.y/=s,ze-z<x?(l[l.length-1][0]=pe.x,l[l.length-1][1]=pe.y):(z=ze,l=_t(l,2/s),l.push([pe.x,pe.y])),Ae(c,l,a)};_(t);const j=()=>{window.removeEventListener("pointermove",_),Ae(c,l,a);const re={points:l,size:a,colour:i};T({name:"draw",undo(){n.drawings.pop(),Se(),S()},redo(){n.drawings.push(re),Se(),S()}})};window.addEventListener("pointermove",_),window.addEventListener("pointerup",j,{once:!0})},ve=()=>{let t=s;for(;t>4;)t/=2;for(;t<1;)t*=2;p.style.backgroundSize=`${r[0]*t/4}px ${r[1]*t/4}px`,p.style.backgroundPositionX=`${-n.offset.x}px`,p.style.backgroundPositionY=`${-n.offset.y}px`,k.style.transform=`translate(${-n.offset.x}px, ${-n.offset.y}px) scale(${s})`,xe()},Se=()=>{m.textContent="",n.drawings.forEach(t=>{m.appendChild(et(t))})},ye=()=>{g.textContent="";const[t,i,a,c]=Object.keys(n.images).length?Object.keys(n.images).map(l=>l.split("|").map(x=>parseInt(x,10))).reduce(([l,x,z,_],[j,re])=>[Math.min(l,j),Math.min(x,re),Math.max(z,j),Math.max(_,re)],[1/0,1/0,-1/0,-1/0]):[0,0,0,0];for(let l=i-1;l<=c+1;++l)for(let x=t-1;x<=a+1;++x){const z=n.images[`${x}|${l}`],_=document.createElement(z?"img":"div");_.src=z,_.draggable=!1,_.dataset.x=x.toString(10),_.dataset.y=l.toString(10),_.style.width=`${r[0]}px`,_.style.height=`${r[1]}px`,_.style.transform=`translate(${x*r[0]}px, ${l*r[1]}px)`,g.appendChild(_)}},Re=(t,i)=>({x:t+n.offset.x,y:i+n.offset.y}),Xe=()=>({x:parseFloat(w.style.left),y:parseFloat(w.style.top)}),Ye=()=>{const t=Xe(),i=Re(t.x,t.y);return i.x/=s,i.y/=s,i},Be=t=>{const i={...n.offset},a={x:t.clientX,y:t.clientY},c=p.style.cursor;p.style.cursor="grabbing";const l=z=>{n.offset.x=-(z.clientX-a.x)+i.x,n.offset.y=-(z.clientY-a.y)+i.y,E&&de(E,ne),ve()},x=()=>{window.removeEventListener("pointermove",l),p.style.cursor=c};window.addEventListener("pointermove",l),window.addEventListener("pointerup",x,{once:!0})},mt=(t,i,a)=>{const c={x:t.clientX,y:t.clientY},l={x:parseInt(i.style.left,10),y:parseInt(i.style.top,10)},x=p.style.cursor;p.style.cursor="move";const z=j=>{a((j.clientX-c.x)/s+l.x,(j.clientY-c.y)/s+l.y)},_=()=>{window.removeEventListener("pointermove",z),p.style.cursor=x;const j={x:parseInt(i.style.left,10),y:parseInt(i.style.top,10)};(j.x!==l.x||j.y!==l.y)&&T({name:"move",undo(){a(l.x,l.y),S()},redo(){a(j.x,j.y),S()}})};window.addEventListener("pointermove",z),window.addEventListener("pointerup",_,{once:!0})};let E=null,ne="";const ke=t=>{var c;if(t!==E)return;const i=n.pins[parseInt(t.dataset.idx||"",10)];Y.textContent="";const a=(((c=i.images)==null?void 0:c.split("|"))||[]).filter(l=>l);if(a.forEach(l=>{const x=document.createElement("img");x.src=l,x.draggable=!1;const z=document.createElement("li"),_=document.createElement("button");_.title="open in new tab",_.textContent="🔍",_.addEventListener("click",()=>{window.open(l,"_blank")});const j=document.createElement("button");j.title="delete",j.textContent="✖",j.addEventListener("click",()=>{z.remove();const re=i.images,ze=Array.from(Y.querySelectorAll("img")).map(pe=>pe.src).join("|");T({name:"delete image in pin",undo(){i.images=re,ke(t),S()},redo(){i.images=ze,ke(t),S()}})}),z.appendChild(_),z.appendChild(j),z.appendChild(x),Y.appendChild(z)}),!a.length){const l=document.createElement("li");l.textContent="paste to add image",l.className="null",Y.appendChild(l)}},de=(t,i)=>{if(fe(),E=t,ne=i,i==="pin"){const a=n.pins[parseInt(E.dataset.idx||"",10)];b.classList.add("show");const c=E.getBoundingClientRect();E.classList.add("selected"),C.value=a.type||"???",ce.value=a.notes||"",ke(t),b.style.top=`${c.bottom<p.clientHeight/2?c.bottom:c.top-b.clientHeight}px`,b.style.left=`${c.right<p.clientWidth/2?c.right:c.left-b.clientWidth}px`,requestAnimationFrame(()=>{window.addEventListener("pointerdown",l=>{l.target&&![b,E].includes(l.target)&&!(b.contains(l.target)||!(E!=null&&E.contains(l.target)))&&fe()},{once:!0})})}else(i==="image"||i==="drawing")&&E.classList.add("selected")},fe=()=>{b.classList.remove("show"),E==null||E.classList.remove("selected"),E=null},We=t=>{let i=t.nextSibling;for(;i;)i.dataset.idx=(parseInt(i.dataset.idx||"",10)-1).toString(10),i=i.nextSibling};L.addEventListener("click",()=>{if(!E)return;const t=parseInt(E.dataset.idx||"",10),i=n.pins[t];T({name:"delete pin",undo(){n.pins.splice(t,0,i),ue(),de(y.children[t],"pin"),S()},redo(){n.pins.splice(t,1),ue(),fe(),S()}})}),C.addEventListener("input",()=>{if(!E)return;const t=n.pins[parseInt(E.dataset.idx||"",10)];t.type=C.value||"???",E.textContent=t.type,S()}),ce.addEventListener("input",()=>{if(!E)return;const t=n.pins[parseInt(E.dataset.idx||"",10)];t.notes=ce.value,S()}),p.addEventListener("pointerdown",t=>{const i=document.activeElement;if(u.contains(i)&&(i==null||i.blur()),t.button===1){t.preventDefault(),Be(t);return}else if(t.button===0){if(P==="select"){fe();const a=document.elementFromPoint(t.clientX,t.clientY);if(a!=null&&a.closest("#pins")){i==null||i.blur(),t.preventDefault(),de(a,"pin");const c=n.pins[parseInt(a.dataset.idx||"",10)];mt(t,a,(l,x)=>{a.style.left=`${l}px`,a.style.top=`${x}px`,c.x=l,c.y=x,de(a,"pin")})}else a!=null&&a.closest("#images")?(i==null||i.blur(),t.preventDefault(),de(a,"image")):a!=null&&a.closest("#drawings")&&(i==null||i.blur(),t.preventDefault(),de(a,"drawing"));return}else if(P==="pan")t.preventDefault(),Be(t);else if(P==="pin"){t.preventDefault();const a=te,c=document.createElement("div");c.textContent=a;const l=Ye();c.style.top=`${l.y}px`,c.style.left=`${l.x}px`,c.dataset.idx=n.pins.length.toString(10),X.click();const x={x:l.x,y:l.y,type:a,notes:"",images:""};T({name:"place pin",undo(){fe(),n.pins.pop(),c.remove(),ve(),S()},redo(){y.appendChild(c),n.pins.push(x),ve(),de(c,"pin"),S()}})}else if(P==="draw")t.preventDefault(),pt(t,te);else if(P==="text"){t.preventDefault();const a=document.createElement("div");try{a.contentEditable="plaintext-only"}catch{a.contentEditable="true"}const c=Ye();a.style.top=`${c.y}px`,a.style.left=`${c.x}px`,a.style.fontSize="200%",a.dataset.idx=n.text.length.toString(10),X.click(),a.addEventListener("input",()=>{n.text[parseInt(a.dataset.idx||"",10)].text=a.textContent||"",S()}),a.addEventListener("blur",()=>{var x;(x=a.textContent)!=null&&x.trim()||(n.text.splice(parseInt(a.dataset.idx||"",10),1),We(a),a.remove(),S())});const l={x:c.x,y:c.y,text:"",size:2};T({name:"place text",undo(){a.remove(),n.text.pop(),S()},redo(){h.appendChild(a),n.text.push(l),a.focus(),S()}})}}}),p.addEventListener("pointermove",t=>{w.style.left=`${t.clientX}px`,w.style.top=`${t.clientY}px`});const ht=t=>{const i=E;if(!i)return;const a=n.pins[parseInt(i.dataset.idx||"",10)],c=a.images,l=[a.images,t].filter(x=>x).join("|");T({name:"add image to pin",undo(){a.images=c,ke(i),S()},redo(){a.images=l,ke(i),S()}})},yt=t=>{if(!E)return;const i=`${E.dataset.x}|${E.dataset.y}`,a=n.images[i];T({name:"place image",undo(){a?n.images[i]=a:delete n.images[i],ye(),S()},redo(){n.images[i]=t,ye(),S()}})};Wt(t=>{E&&ne==="pin"?ht(t):E&&ne==="image"&&yt(t)});let De=!1;window.addEventListener("keydown",t=>{var a;const i=document.activeElement;if((i==null?void 0:i.tagName)==="TEXTAREA"||(i==null?void 0:i.tagName)==="INPUT"||(i==null?void 0:i.contentEditable)==="plaintext-only"||(i==null?void 0:i.contentEditable)==="true"){if(t.ctrlKey&&t.key==="="&&i.parentElement===h){t.preventDefault();const c=n.text[parseInt(i.dataset.idx||"",10)];c.size*=2,i.style.fontSize=`${c.size*100}%`,S()}else if(t.ctrlKey&&t.key==="-"&&i.parentElement===h){t.preventDefault();const c=n.text[parseInt(i.dataset.idx||"",10)];c.size/=2,i.style.fontSize=`${c.size*100}%`,S()}return}if(t.ctrlKey&&t.key==="z"){const c=Gt();c!==!1&&le(["undo",c].filter(l=>l).join(" - "))}if(t.ctrlKey&&t.key==="y"||t.ctrlKey&&t.shiftKey&&t.key==="z"){const c=Jt();c!==!1&&le(["redo",c].filter(l=>l).join(" - "))}if(t.key==="Escape"&&fe(),(t.key==="Backspace"||t.key==="Delete")&&E&&ne==="image"){const c=`${E.dataset.x}|${E.dataset.y}`,l=n.images[c];T({name:"delete image",undo(){n.images[c]=l,ye(),S()},redo(){delete n.images[c],ye(),S()}})}if((t.key==="Backspace"||t.key==="Delete")&&E&&ne==="drawing"){const c=Array.from(((a=E.parentElement)==null?void 0:a.children)||[]).indexOf(E),l=n.drawings[c];T({name:"delete drawing",undo(){n.drawings.splice(c,0,l),Se(),S()},redo(){n.drawings.splice(c,1),Se(),S()}})}if((t.key==="Backspace"||t.key==="Delete")&&E&&ne==="pin"&&L.click(),t.ctrlKey&&t.key==="s"){t.preventDefault(),U.click();return}if(t.ctrlKey&&t.key==="c"&&E&&ne==="image"){t.preventDefault(),navigator.clipboard.writeText(E.src);return}if(!De&&t.key===" "){De=!0;const c=P,l=te;B("pan"),window.addEventListener("keyup",x=>{x.key===" "&&(De=!1,B(c,l))})}if(t.key==="q"){t.preventDefault(),B("select");return}if(t.key==="t"){t.preventDefault(),B("text");return}if(t.key==="b"){t.preventDefault(),B("draw",Pe);return}if(t.key==="p"){t.preventDefault(),B("pin",Fe);return}}),p.addEventListener("wheel",t=>{n.offset.x+=t.deltaX,n.zoom-=Math.sign(t.deltaY);const i=s;f();const a=s-i,c=Xe(),l={x:(c.x+n.offset.x)/i,y:(c.y+n.offset.y)/i};n.offset.x+=l.x*a,n.offset.y+=l.y*a,ve(),E&&de(E,ne)});const gt=(t,i)=>{n.offset.x=t*s-p.clientWidth/2-ge.clientWidth/2,n.offset.y=i*s-p.clientHeight/2,ve()};let Ce;me.addEventListener("focus",()=>{Ce=new Ct("key"),Ce.addDocuments(Object.entries(o).flatMap(([t,{pins:i,text:a}])=>i.map((c,l)=>({key:`${t}-p-${l}`,area:t,text:[t,c.type,c.notes].filter(x=>x).join(" > "),original:c})).concat(a.map((c,l)=>({key:`${t}-t-${l}`,area:t,text:[t,c.text].filter(x=>x).join(" > "),original:c}))))),Ce.addIndex("text")}),me.addEventListener("input",()=>{const t=Ce.search(me.value);ge.textContent="",t.forEach(i=>{const a=document.createElement("li"),c=document.createElement("span");c.innerHTML=i.text,Yt(c,me.value,Ce.tokenizer.tokenize);const l=document.createElement("button");l.title="focus",l.textContent="🔍",l.addEventListener("click",()=>{fe();const x=i.area;e!==x&&A(x),gt(i.original.x,i.original.y)}),l.addEventListener("dblclick",()=>{n.zoom=1,f()}),a.appendChild(l),a.appendChild(c),ge.appendChild(a)})}),Array.from(M).forEach(t=>{const i=document.createElement("option");i.value=t.value,$.appendChild(i)}),A(e),Ke()})();
