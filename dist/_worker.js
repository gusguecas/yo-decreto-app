var Kr=Object.defineProperty;var Ht=e=>{throw TypeError(e)};var Xr=(e,t,r)=>t in e?Kr(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var g=(e,t,r)=>Xr(e,typeof t!="symbol"?t+"":t,r),ut=(e,t,r)=>t.has(e)||Ht("Cannot "+r);var u=(e,t,r)=>(ut(e,t,"read from private field"),r?r.call(e):t.get(e)),R=(e,t,r)=>t.has(e)?Ht("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),T=(e,t,r,a)=>(ut(e,t,"write to private field"),a?a.call(e,r):t.set(e,r),r),N=(e,t,r)=>(ut(e,t,"access private method"),r);var Pt=(e,t,r,a)=>({set _(s){T(e,t,s,r)},get _(){return u(e,t,a)}});var ur={Stringify:1},U=(e,t)=>{const r=new String(e);return r.isEscaped=!0,r.callbacks=t,r},Zr=/[&<>'"]/,fr=async(e,t)=>{let r="";t||(t=[]);const a=await Promise.all(e);for(let s=a.length-1;r+=a[s],s--,!(s<0);s--){let n=a[s];typeof n=="object"&&t.push(...n.callbacks||[]);const o=n.isEscaped;if(n=await(typeof n=="object"?n.toString():n),typeof n=="object"&&t.push(...n.callbacks||[]),n.isEscaped??o)r+=n;else{const i=[r];se(n,i),r=i[0]}}return U(r,t)},se=(e,t)=>{const r=e.search(Zr);if(r===-1){t[0]+=e;return}let a,s,n=0;for(s=r;s<e.length;s++){switch(e.charCodeAt(s)){case 34:a="&quot;";break;case 39:a="&#39;";break;case 38:a="&amp;";break;case 60:a="&lt;";break;case 62:a="&gt;";break;default:continue}t[0]+=e.substring(n,s)+a,n=s+1}t[0]+=e.substring(n,s)},pr=e=>{const t=e.callbacks;if(!(t!=null&&t.length))return e;const r=[e],a={};return t.forEach(s=>s({phase:ur.Stringify,buffer:r,context:a})),r[0]},hr=async(e,t,r,a,s)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const n=e.callbacks;return n!=null&&n.length?(s?s[0]+=e:s=[e],Promise.all(n.map(i=>i({phase:t,buffer:s,context:a}))).then(i=>Promise.all(i.filter(Boolean).map(c=>hr(c,t,!1,a,s))).then(()=>s[0]))):Promise.resolve(e)},Qr=(e,...t)=>{const r=[""];for(let a=0,s=e.length-1;a<s;a++){r[0]+=e[a];const n=Array.isArray(t[a])?t[a].flat(1/0):[t[a]];for(let o=0,i=n.length;o<i;o++){const c=n[o];if(typeof c=="string")se(c,r);else if(typeof c=="number")r[0]+=c;else{if(typeof c=="boolean"||c===null||c===void 0)continue;if(typeof c=="object"&&c.isEscaped)if(c.callbacks)r.unshift("",c);else{const l=c.toString();l instanceof Promise?r.unshift("",l):r[0]+=l}else c instanceof Promise?r.unshift("",c):se(c.toString(),r)}}}return r[0]+=e.at(-1),r.length===1?"callbacks"in r?U(pr(U(r[0],r.callbacks))):U(r[0]):fr(r,r.callbacks)},Ct=Symbol("RENDERER"),Rt=Symbol("ERROR_HANDLER"),b=Symbol("STASH"),Er=Symbol("INTERNAL"),ea=Symbol("MEMO"),nt=Symbol("PERMALINK"),Ut=e=>(e[Er]=!0,e),mr=e=>({value:t,children:r})=>{if(!r)return;const a={children:[{tag:Ut(()=>{e.push(t)}),props:{}}]};Array.isArray(r)?a.children.push(...r.flat()):a.children.push(r),a.children.push({tag:Ut(()=>{e.pop()}),props:{}});const s={tag:"",props:a,type:""};return s[Rt]=n=>{throw e.pop(),n},s},vr=e=>{const t=[e],r=mr(t);return r.values=t,r.Provider=r,Ce.push(r),r},Ce=[],Dt=e=>{const t=[e],r=a=>{t.push(a.value);let s;try{s=a.children?(Array.isArray(a.children)?new yr("",{},a.children):a.children).toString():""}finally{t.pop()}return s instanceof Promise?s.then(n=>U(n,n.callbacks)):U(s)};return r.values=t,r.Provider=r,r[Ct]=mr(t),Ce.push(r),r},je=e=>e.values.at(-1),Xe={title:[],script:["src"],style:["data-href"],link:["href"],meta:["name","httpEquiv","charset","itemProp"]},St={},Ze="data-precedence",ze=e=>Array.isArray(e)?e:[e],Bt=new WeakMap,qt=(e,t,r,a)=>({buffer:s,context:n})=>{if(!s)return;const o=Bt.get(n)||{};Bt.set(n,o);const i=o[e]||(o[e]=[]);let c=!1;const l=Xe[e];if(l.length>0){e:for(const[,d]of i)for(const p of l)if(((d==null?void 0:d[p])??null)===(r==null?void 0:r[p])){c=!0;break e}}if(c?s[0]=s[0].replaceAll(t,""):l.length>0?i.push([t,r,a]):i.unshift([t,r,a]),s[0].indexOf("</head>")!==-1){let d;if(a===void 0)d=i.map(([p])=>p);else{const p=[];d=i.map(([f,,E])=>{let v=p.indexOf(E);return v===-1&&(p.push(E),v=p.length-1),[f,v]}).sort((f,E)=>f[1]-E[1]).map(([f])=>f)}d.forEach(p=>{s[0]=s[0].replaceAll(p,"")}),s[0]=s[0].replace(/(?=<\/head>)/,d.join(""))}},Ve=(e,t,r)=>U(new $(e,r,ze(t??[])).toString()),Ye=(e,t,r,a)=>{if("itemProp"in r)return Ve(e,t,r);let{precedence:s,blocking:n,...o}=r;s=a?s??"":void 0,a&&(o[Ze]=s);const i=new $(e,o,ze(t||[])).toString();return i instanceof Promise?i.then(c=>U(i,[...c.callbacks||[],qt(e,c,o,s)])):U(i,[qt(e,i,o,s)])},ta=({children:e,...t})=>{const r=At();if(r){const a=je(r);if(a==="svg"||a==="head")return new $("title",t,ze(e??[]))}return Ye("title",e,t,!1)},ra=({children:e,...t})=>{const r=At();return["src","async"].some(a=>!t[a])||r&&je(r)==="head"?Ve("script",e,t):Ye("script",e,t,!1)},aa=({children:e,...t})=>["href","precedence"].every(r=>r in t)?(t["data-href"]=t.href,delete t.href,Ye("style",e,t,!0)):Ve("style",e,t),sa=({children:e,...t})=>["onLoad","onError"].some(r=>r in t)||t.rel==="stylesheet"&&(!("precedence"in t)||"disabled"in t)?Ve("link",e,t):Ye("link",e,t,"precedence"in t),na=({children:e,...t})=>{const r=At();return r&&je(r)==="head"?Ve("meta",e,t):Ye("meta",e,t,!1)},_r=(e,{children:t,...r})=>new $(e,r,ze(t??[])),oa=e=>(typeof e.action=="function"&&(e.action=nt in e.action?e.action[nt]:void 0),_r("form",e)),gr=(e,t)=>(typeof t.formAction=="function"&&(t.formAction=nt in t.formAction?t.formAction[nt]:void 0),_r(e,t)),ia=e=>gr("input",e),ca=e=>gr("button",e);const ft=Object.freeze(Object.defineProperty({__proto__:null,button:ca,form:oa,input:ia,link:sa,meta:na,script:ra,style:aa,title:ta},Symbol.toStringTag,{value:"Module"}));var la=new Map([["className","class"],["htmlFor","for"],["crossOrigin","crossorigin"],["httpEquiv","http-equiv"],["itemProp","itemprop"],["fetchPriority","fetchpriority"],["noModule","nomodule"],["formAction","formaction"]]),ot=e=>la.get(e)||e,Tr=(e,t)=>{for(const[r,a]of Object.entries(e)){const s=r[0]==="-"||!/[A-Z]/.test(r)?r:r.replace(/[A-Z]/g,n=>`-${n.toLowerCase()}`);t(s,a==null?null:typeof a=="number"?s.match(/^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/)?`${a}`:`${a}px`:a)}},He=void 0,At=()=>He,da=e=>/[A-Z]/.test(e)&&e.match(/^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/)?e.replace(/([A-Z])/g,"-$1").toLowerCase():e,ua=["area","base","br","col","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"],fa=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","download","formnovalidate","hidden","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"],jt=(e,t)=>{for(let r=0,a=e.length;r<a;r++){const s=e[r];if(typeof s=="string")se(s,t);else{if(typeof s=="boolean"||s===null||s===void 0)continue;s instanceof $?s.toStringToBuffer(t):typeof s=="number"||s.isEscaped?t[0]+=s:s instanceof Promise?t.unshift("",s):jt(s,t)}}},$=class{constructor(e,t,r){g(this,"tag");g(this,"props");g(this,"key");g(this,"children");g(this,"isEscaped",!0);g(this,"localContexts");this.tag=e,this.props=t,this.children=r}get type(){return this.tag}get ref(){return this.props.ref||null}toString(){var t,r;const e=[""];(t=this.localContexts)==null||t.forEach(([a,s])=>{a.values.push(s)});try{this.toStringToBuffer(e)}finally{(r=this.localContexts)==null||r.forEach(([a])=>{a.values.pop()})}return e.length===1?"callbacks"in e?pr(U(e[0],e.callbacks)).toString():e[0]:fr(e,e.callbacks)}toStringToBuffer(e){const t=this.tag,r=this.props;let{children:a}=this;e[0]+=`<${t}`;const s=He&&je(He)==="svg"?n=>da(ot(n)):n=>ot(n);for(let[n,o]of Object.entries(r))if(n=s(n),n!=="children"){if(n==="style"&&typeof o=="object"){let i="";Tr(o,(c,l)=>{l!=null&&(i+=`${i?";":""}${c}:${l}`)}),e[0]+=' style="',se(i,e),e[0]+='"'}else if(typeof o=="string")e[0]+=` ${n}="`,se(o,e),e[0]+='"';else if(o!=null)if(typeof o=="number"||o.isEscaped)e[0]+=` ${n}="${o}"`;else if(typeof o=="boolean"&&fa.includes(n))o&&(e[0]+=` ${n}=""`);else if(n==="dangerouslySetInnerHTML"){if(a.length>0)throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");a=[U(o.__html)]}else if(o instanceof Promise)e[0]+=` ${n}="`,e.unshift('"',o);else if(typeof o=="function"){if(!n.startsWith("on")&&n!=="ref")throw new Error(`Invalid prop '${n}' of type 'function' supplied to '${t}'.`)}else e[0]+=` ${n}="`,se(o.toString(),e),e[0]+='"'}if(ua.includes(t)&&a.length===0){e[0]+="/>";return}e[0]+=">",jt(a,e),e[0]+=`</${t}>`}},pt=class extends ${toStringToBuffer(e){const{children:t}=this,r=this.tag.call(null,{...this.props,children:t.length<=1?t[0]:t});if(!(typeof r=="boolean"||r==null))if(r instanceof Promise)if(Ce.length===0)e.unshift("",r);else{const a=Ce.map(s=>[s,s.values.at(-1)]);e.unshift("",r.then(s=>(s instanceof $&&(s.localContexts=a),s)))}else r instanceof $?r.toStringToBuffer(e):typeof r=="number"||r.isEscaped?(e[0]+=r,r.callbacks&&(e.callbacks||(e.callbacks=[]),e.callbacks.push(...r.callbacks))):se(r,e)}},yr=class extends ${toStringToBuffer(e){jt(this.children,e)}},Ft=(e,t,...r)=>{t??(t={}),r.length&&(t.children=r.length===1?r[0]:r);const a=t.key;delete t.key;const s=Qe(e,t,r);return s.key=a,s},$t=!1,Qe=(e,t,r)=>{if(!$t){for(const a in St)ft[a][Ct]=St[a];$t=!0}return typeof e=="function"?new pt(e,t,r):ft[e]?new pt(ft[e],t,r):e==="svg"||e==="head"?(He||(He=Dt("")),new $(e,t,[new pt(He,{value:e},r)])):new $(e,t,r)},pa=({children:e})=>new yr("",{children:e},Array.isArray(e)?e:e?[e]:[]);function S(e,t,r){let a;if(!t||!("children"in t))a=Qe(e,t,[]);else{const s=t.children;a=Array.isArray(s)?Qe(e,t,s):Qe(e,t,[s])}return a.key=r,a}var Wt=(e,t,r)=>(a,s)=>{let n=-1;return o(0);async function o(i){if(i<=n)throw new Error("next() called multiple times");n=i;let c,l=!1,d;if(e[i]?(d=e[i][0][0],a.req.routeIndex=i):d=i===e.length&&s||void 0,d)try{c=await d(a,()=>o(i+1))}catch(p){if(p instanceof Error&&t)a.error=p,c=await t(p,a),l=!0;else throw p}else a.finalized===!1&&r&&(c=await r(a));return c&&(a.finalized===!1||l)&&(a.res=c),a}},ha=Symbol(),Ea=async(e,t=Object.create(null))=>{const{all:r=!1,dot:a=!1}=t,n=(e instanceof Nr?e.raw.headers:e.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?ma(e,{all:r,dot:a}):{}};async function ma(e,t){const r=await e.formData();return r?va(r,t):{}}function va(e,t){const r=Object.create(null);return e.forEach((a,s)=>{t.all||s.endsWith("[]")?_a(r,s,a):r[s]=a}),t.dot&&Object.entries(r).forEach(([a,s])=>{a.includes(".")&&(ga(r,a,s),delete r[a])}),r}var _a=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},ga=(e,t,r)=>{let a=e;const s=t.split(".");s.forEach((n,o)=>{o===s.length-1?a[n]=r:((!a[n]||typeof a[n]!="object"||Array.isArray(a[n])||a[n]instanceof File)&&(a[n]=Object.create(null)),a=a[n])})},Rr=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Ta=e=>{const{groups:t,path:r}=ya(e),a=Rr(r);return Ra(a,t)},ya=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,a)=>{const s=`@${a}`;return t.push([s,r]),s}),{groups:t,path:e}},Ra=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[a]=t[r];for(let s=e.length-1;s>=0;s--)if(e[s].includes(a)){e[s]=e[s].replace(a,t[r][1]);break}}return e},Ge={},Sa=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const a=`${e}#${t}`;return Ge[a]||(r[2]?Ge[a]=t&&t[0]!==":"&&t[0]!=="*"?[a,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:Ge[a]=[e,r[1],!0]),Ge[a]}return null},lt=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},wa=e=>lt(e,decodeURI),Sr=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let a=r;for(;a<t.length;a++){const s=t.charCodeAt(a);if(s===37){const n=t.indexOf("?",a),o=t.slice(r,n===-1?void 0:n);return wa(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(s===63)break}return t.slice(r,a)},Oa=e=>{const t=Sr(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},Te=(e,t,...r)=>(r.length&&(t=Te(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),wr=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let a="";return t.forEach(s=>{if(s!==""&&!/\:/.test(s))a+="/"+s;else if(/\:/.test(s))if(/\?/.test(s)){r.length===0&&a===""?r.push("/"):r.push(a);const n=s.replace("?","");a+="/"+n,r.push(a)}else a+="/"+s}),r.filter((s,n,o)=>o.indexOf(s)===n)},ht=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?lt(e,It):e):e,Or=(e,t,r)=>{let a;if(!r&&t&&!/[%+]/.test(t)){let o=e.indexOf(`?${t}`,8);for(o===-1&&(o=e.indexOf(`&${t}`,8));o!==-1;){const i=e.charCodeAt(o+t.length+1);if(i===61){const c=o+t.length+2,l=e.indexOf("&",c);return ht(e.slice(c,l===-1?void 0:l))}else if(i==38||isNaN(i))return"";o=e.indexOf(`&${t}`,o+1)}if(a=/[%+]/.test(e),!a)return}const s={};a??(a=/[%+]/.test(e));let n=e.indexOf("?",8);for(;n!==-1;){const o=e.indexOf("&",n+1);let i=e.indexOf("=",n);i>o&&o!==-1&&(i=-1);let c=e.slice(n+1,i===-1?o===-1?void 0:o:i);if(a&&(c=ht(c)),n=o,c==="")continue;let l;i===-1?l="":(l=e.slice(i+1,o===-1?void 0:o),a&&(l=ht(l))),r?(s[c]&&Array.isArray(s[c])||(s[c]=[]),s[c].push(l)):s[c]??(s[c]=l)}return t?s[t]:s},Na=Or,ba=(e,t)=>Or(e,t,!0),It=decodeURIComponent,kt=e=>lt(e,It),Se,P,K,br,Cr,wt,Z,rr,Nr=(rr=class{constructor(e,t="/",r=[[]]){R(this,K);g(this,"raw");R(this,Se);R(this,P);g(this,"routeIndex",0);g(this,"path");g(this,"bodyCache",{});R(this,Z,e=>{const{bodyCache:t,raw:r}=this,a=t[e];if(a)return a;const s=Object.keys(t)[0];return s?t[s].then(n=>(s==="json"&&(n=JSON.stringify(n)),new Response(n)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,T(this,P,r),T(this,Se,{})}param(e){return e?N(this,K,br).call(this,e):N(this,K,Cr).call(this)}query(e){return Na(this.url,e)}queries(e){return ba(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,a)=>{t[a]=r}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await Ea(this,e))}json(){return u(this,Z).call(this,"text").then(e=>JSON.parse(e))}text(){return u(this,Z).call(this,"text")}arrayBuffer(){return u(this,Z).call(this,"arrayBuffer")}blob(){return u(this,Z).call(this,"blob")}formData(){return u(this,Z).call(this,"formData")}addValidatedData(e,t){u(this,Se)[e]=t}valid(e){return u(this,Se)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[ha](){return u(this,P)}get matchedRoutes(){return u(this,P)[0].map(([[,e]])=>e)}get routePath(){return u(this,P)[0].map(([[,e]])=>e)[this.routeIndex].path}},Se=new WeakMap,P=new WeakMap,K=new WeakSet,br=function(e){const t=u(this,P)[0][this.routeIndex][1][e],r=N(this,K,wt).call(this,t);return r&&/\%/.test(r)?kt(r):r},Cr=function(){const e={},t=Object.keys(u(this,P)[0][this.routeIndex][1]);for(const r of t){const a=N(this,K,wt).call(this,u(this,P)[0][this.routeIndex][1][r]);a!==void 0&&(e[r]=/\%/.test(a)?kt(a):a)}return e},wt=function(e){return u(this,P)[1]?u(this,P)[1][e]:e},Z=new WeakMap,rr),Ca="text/plain; charset=UTF-8",Et=(e,t)=>({"Content-Type":e,...t}),Be,qe,V,we,Y,L,Fe,Oe,Ne,de,$e,We,Q,ye,ar,Da=(ar=class{constructor(e,t){R(this,Q);R(this,Be);R(this,qe);g(this,"env",{});R(this,V);g(this,"finalized",!1);g(this,"error");R(this,we);R(this,Y);R(this,L);R(this,Fe);R(this,Oe);R(this,Ne);R(this,de);R(this,$e);R(this,We);g(this,"render",(...e)=>(u(this,Oe)??T(this,Oe,t=>this.html(t)),u(this,Oe).call(this,...e)));g(this,"setLayout",e=>T(this,Fe,e));g(this,"getLayout",()=>u(this,Fe));g(this,"setRenderer",e=>{T(this,Oe,e)});g(this,"header",(e,t,r)=>{this.finalized&&T(this,L,new Response(u(this,L).body,u(this,L)));const a=u(this,L)?u(this,L).headers:u(this,de)??T(this,de,new Headers);t===void 0?a.delete(e):r!=null&&r.append?a.append(e,t):a.set(e,t)});g(this,"status",e=>{T(this,we,e)});g(this,"set",(e,t)=>{u(this,V)??T(this,V,new Map),u(this,V).set(e,t)});g(this,"get",e=>u(this,V)?u(this,V).get(e):void 0);g(this,"newResponse",(...e)=>N(this,Q,ye).call(this,...e));g(this,"body",(e,t,r)=>N(this,Q,ye).call(this,e,t,r));g(this,"text",(e,t,r)=>!u(this,de)&&!u(this,we)&&!t&&!r&&!this.finalized?new Response(e):N(this,Q,ye).call(this,e,t,Et(Ca,r)));g(this,"json",(e,t,r)=>N(this,Q,ye).call(this,JSON.stringify(e),t,Et("application/json",r)));g(this,"html",(e,t,r)=>{const a=s=>N(this,Q,ye).call(this,s,t,Et("text/html; charset=UTF-8",r));return typeof e=="object"?hr(e,ur.Stringify,!1,{}).then(a):a(e)});g(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});g(this,"notFound",()=>(u(this,Ne)??T(this,Ne,()=>new Response),u(this,Ne).call(this,this)));T(this,Be,e),t&&(T(this,Y,t.executionCtx),this.env=t.env,T(this,Ne,t.notFoundHandler),T(this,We,t.path),T(this,$e,t.matchResult))}get req(){return u(this,qe)??T(this,qe,new Nr(u(this,Be),u(this,We),u(this,$e))),u(this,qe)}get event(){if(u(this,Y)&&"respondWith"in u(this,Y))return u(this,Y);throw Error("This context has no FetchEvent")}get executionCtx(){if(u(this,Y))return u(this,Y);throw Error("This context has no ExecutionContext")}get res(){return u(this,L)||T(this,L,new Response(null,{headers:u(this,de)??T(this,de,new Headers)}))}set res(e){if(u(this,L)&&e){e=new Response(e.body,e);for(const[t,r]of u(this,L).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const a=u(this,L).headers.getSetCookie();e.headers.delete("set-cookie");for(const s of a)e.headers.append("set-cookie",s)}else e.headers.set(t,r)}T(this,L,e),this.finalized=!0}get var(){return u(this,V)?Object.fromEntries(u(this,V)):{}}},Be=new WeakMap,qe=new WeakMap,V=new WeakMap,we=new WeakMap,Y=new WeakMap,L=new WeakMap,Fe=new WeakMap,Oe=new WeakMap,Ne=new WeakMap,de=new WeakMap,$e=new WeakMap,We=new WeakMap,Q=new WeakSet,ye=function(e,t,r){const a=u(this,L)?new Headers(u(this,L).headers):u(this,de)??new Headers;if(typeof t=="object"&&"headers"in t){const n=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[o,i]of n)o.toLowerCase()==="set-cookie"?a.append(o,i):a.set(o,i)}if(r)for(const[n,o]of Object.entries(r))if(typeof o=="string")a.set(n,o);else{a.delete(n);for(const i of o)a.append(n,i)}const s=typeof t=="number"?t:(t==null?void 0:t.status)??u(this,we);return new Response(e,{status:s,headers:a})},ar),C="ALL",Aa="all",ja=["get","post","put","delete","options","patch"],Dr="Can not add a route since the matcher is already built.",Ar=class extends Error{},Ia="__COMPOSED_HANDLER",Ma=e=>e.text("404 Not Found",404),zt=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},B,D,Ir,q,ie,et,tt,sr,jr=(sr=class{constructor(t={}){R(this,D);g(this,"get");g(this,"post");g(this,"put");g(this,"delete");g(this,"options");g(this,"patch");g(this,"all");g(this,"on");g(this,"use");g(this,"router");g(this,"getPath");g(this,"_basePath","/");R(this,B,"/");g(this,"routes",[]);R(this,q,Ma);g(this,"errorHandler",zt);g(this,"onError",t=>(this.errorHandler=t,this));g(this,"notFound",t=>(T(this,q,t),this));g(this,"fetch",(t,...r)=>N(this,D,tt).call(this,t,r[1],r[0],t.method));g(this,"request",(t,r,a,s)=>t instanceof Request?this.fetch(r?new Request(t,r):t,a,s):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${Te("/",t)}`,r),a,s)));g(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(N(this,D,tt).call(this,t.request,t,void 0,t.request.method))})});[...ja,Aa].forEach(n=>{this[n]=(o,...i)=>(typeof o=="string"?T(this,B,o):N(this,D,ie).call(this,n,u(this,B),o),i.forEach(c=>{N(this,D,ie).call(this,n,u(this,B),c)}),this)}),this.on=(n,o,...i)=>{for(const c of[o].flat()){T(this,B,c);for(const l of[n].flat())i.map(d=>{N(this,D,ie).call(this,l.toUpperCase(),u(this,B),d)})}return this},this.use=(n,...o)=>(typeof n=="string"?T(this,B,n):(T(this,B,"*"),o.unshift(n)),o.forEach(i=>{N(this,D,ie).call(this,C,u(this,B),i)}),this);const{strict:a,...s}=t;Object.assign(this,s),this.getPath=a??!0?t.getPath??Sr:Oa}route(t,r){const a=this.basePath(t);return r.routes.map(s=>{var o;let n;r.errorHandler===zt?n=s.handler:(n=async(i,c)=>(await Wt([],r.errorHandler)(i,()=>s.handler(i,c))).res,n[Ia]=s.handler),N(o=a,D,ie).call(o,s.method,s.path,n)}),this}basePath(t){const r=N(this,D,Ir).call(this);return r._basePath=Te(this._basePath,t),r}mount(t,r,a){let s,n;a&&(typeof a=="function"?n=a:(n=a.optionHandler,a.replaceRequest===!1?s=c=>c:s=a.replaceRequest));const o=n?c=>{const l=n(c);return Array.isArray(l)?l:[l]}:c=>{let l;try{l=c.executionCtx}catch{}return[c.env,l]};s||(s=(()=>{const c=Te(this._basePath,t),l=c==="/"?0:c.length;return d=>{const p=new URL(d.url);return p.pathname=p.pathname.slice(l)||"/",new Request(p,d)}})());const i=async(c,l)=>{const d=await r(s(c.req.raw),...o(c));if(d)return d;await l()};return N(this,D,ie).call(this,C,Te(t,"*"),i),this}},B=new WeakMap,D=new WeakSet,Ir=function(){const t=new jr({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,T(t,q,u(this,q)),t.routes=this.routes,t},q=new WeakMap,ie=function(t,r,a){t=t.toUpperCase(),r=Te(this._basePath,r);const s={basePath:this._basePath,path:r,method:t,handler:a};this.router.add(t,r,[a,s]),this.routes.push(s)},et=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},tt=function(t,r,a,s){if(s==="HEAD")return(async()=>new Response(null,await N(this,D,tt).call(this,t,r,a,"GET")))();const n=this.getPath(t,{env:a}),o=this.router.match(s,n),i=new Da(t,{path:n,matchResult:o,env:a,executionCtx:r,notFoundHandler:u(this,q)});if(o[0].length===1){let l;try{l=o[0][0][0][0](i,async()=>{i.res=await u(this,q).call(this,i)})}catch(d){return N(this,D,et).call(this,d,i)}return l instanceof Promise?l.then(d=>d||(i.finalized?i.res:u(this,q).call(this,i))).catch(d=>N(this,D,et).call(this,d,i)):l??u(this,q).call(this,i)}const c=Wt(o[0],this.errorHandler,u(this,q));return(async()=>{try{const l=await c(i);if(!l.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return l.res}catch(l){return N(this,D,et).call(this,l,i)}})()},sr),it="[^/]+",xe=".*",Le="(?:|/.*)",Re=Symbol(),xa=new Set(".\\+*[^]$()");function La(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===xe||e===Le?1:t===xe||t===Le?-1:e===it?1:t===it?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var ue,fe,F,nr,Ot=(nr=class{constructor(){R(this,ue);R(this,fe);R(this,F,Object.create(null))}insert(t,r,a,s,n){if(t.length===0){if(u(this,ue)!==void 0)throw Re;if(n)return;T(this,ue,r);return}const[o,...i]=t,c=o==="*"?i.length===0?["","",xe]:["","",it]:o==="/*"?["","",Le]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let l;if(c){const d=c[1];let p=c[2]||it;if(d&&c[2]&&(p===".*"||(p=p.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(p))))throw Re;if(l=u(this,F)[p],!l){if(Object.keys(u(this,F)).some(f=>f!==xe&&f!==Le))throw Re;if(n)return;l=u(this,F)[p]=new Ot,d!==""&&T(l,fe,s.varIndex++)}!n&&d!==""&&a.push([d,u(l,fe)])}else if(l=u(this,F)[o],!l){if(Object.keys(u(this,F)).some(d=>d.length>1&&d!==xe&&d!==Le))throw Re;if(n)return;l=u(this,F)[o]=new Ot}l.insert(i,r,a,s,n)}buildRegExpStr(){const r=Object.keys(u(this,F)).sort(La).map(a=>{const s=u(this,F)[a];return(typeof u(s,fe)=="number"?`(${a})@${u(s,fe)}`:xa.has(a)?`\\${a}`:a)+s.buildRegExpStr()});return typeof u(this,ue)=="number"&&r.unshift(`#${u(this,ue)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},ue=new WeakMap,fe=new WeakMap,F=new WeakMap,nr),ct,ke,or,Ha=(or=class{constructor(){R(this,ct,{varIndex:0});R(this,ke,new Ot)}insert(e,t,r){const a=[],s=[];for(let o=0;;){let i=!1;if(e=e.replace(/\{[^}]+\}/g,c=>{const l=`@\\${o}`;return s[o]=[l,c],o++,i=!0,l}),!i)break}const n=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=s.length-1;o>=0;o--){const[i]=s[o];for(let c=n.length-1;c>=0;c--)if(n[c].indexOf(i)!==-1){n[c]=n[c].replace(i,s[o][1]);break}}return u(this,ke).insert(n,t,a,u(this,ct),r),a}buildRegExp(){let e=u(this,ke).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],a=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,n,o)=>n!==void 0?(r[++t]=Number(n),"$()"):(o!==void 0&&(a[Number(o)]=++t),"")),[new RegExp(`^${e}`),r,a]}},ct=new WeakMap,ke=new WeakMap,or),Mr=[],Pa=[/^$/,[],Object.create(null)],rt=Object.create(null);function xr(e){return rt[e]??(rt[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function Ua(){rt=Object.create(null)}function Ba(e){var l;const t=new Ha,r=[];if(e.length===0)return Pa;const a=e.map(d=>[!/\*|\/:/.test(d[0]),...d]).sort(([d,p],[f,E])=>d?1:f?-1:p.length-E.length),s=Object.create(null);for(let d=0,p=-1,f=a.length;d<f;d++){const[E,v,h]=a[d];E?s[v]=[h.map(([_])=>[_,Object.create(null)]),Mr]:p++;let m;try{m=t.insert(v,p,E)}catch(_){throw _===Re?new Ar(v):_}E||(r[p]=h.map(([_,y])=>{const O=Object.create(null);for(y-=1;y>=0;y--){const[w,M]=m[y];O[w]=M}return[_,O]}))}const[n,o,i]=t.buildRegExp();for(let d=0,p=r.length;d<p;d++)for(let f=0,E=r[d].length;f<E;f++){const v=(l=r[d][f])==null?void 0:l[1];if(!v)continue;const h=Object.keys(v);for(let m=0,_=h.length;m<_;m++)v[h[m]]=i[v[h[m]]]}const c=[];for(const d in o)c[d]=r[o[d]];return[n,c,s]}function _e(e,t){if(e){for(const r of Object.keys(e).sort((a,s)=>s.length-a.length))if(xr(r).test(t))return[...e[r]]}}var ee,te,Ae,Lr,Hr,ir,qa=(ir=class{constructor(){R(this,Ae);g(this,"name","RegExpRouter");R(this,ee);R(this,te);T(this,ee,{[C]:Object.create(null)}),T(this,te,{[C]:Object.create(null)})}add(e,t,r){var i;const a=u(this,ee),s=u(this,te);if(!a||!s)throw new Error(Dr);a[e]||[a,s].forEach(c=>{c[e]=Object.create(null),Object.keys(c[C]).forEach(l=>{c[e][l]=[...c[C][l]]})}),t==="/*"&&(t="*");const n=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const c=xr(t);e===C?Object.keys(a).forEach(l=>{var d;(d=a[l])[t]||(d[t]=_e(a[l],t)||_e(a[C],t)||[])}):(i=a[e])[t]||(i[t]=_e(a[e],t)||_e(a[C],t)||[]),Object.keys(a).forEach(l=>{(e===C||e===l)&&Object.keys(a[l]).forEach(d=>{c.test(d)&&a[l][d].push([r,n])})}),Object.keys(s).forEach(l=>{(e===C||e===l)&&Object.keys(s[l]).forEach(d=>c.test(d)&&s[l][d].push([r,n]))});return}const o=wr(t)||[t];for(let c=0,l=o.length;c<l;c++){const d=o[c];Object.keys(s).forEach(p=>{var f;(e===C||e===p)&&((f=s[p])[d]||(f[d]=[..._e(a[p],d)||_e(a[C],d)||[]]),s[p][d].push([r,n-l+c+1]))})}}match(e,t){Ua();const r=N(this,Ae,Lr).call(this);return this.match=(a,s)=>{const n=r[a]||r[C],o=n[2][s];if(o)return o;const i=s.match(n[0]);if(!i)return[[],Mr];const c=i.indexOf("",1);return[n[1][c],i]},this.match(e,t)}},ee=new WeakMap,te=new WeakMap,Ae=new WeakSet,Lr=function(){const e=Object.create(null);return Object.keys(u(this,te)).concat(Object.keys(u(this,ee))).forEach(t=>{e[t]||(e[t]=N(this,Ae,Hr).call(this,t))}),T(this,ee,T(this,te,void 0)),e},Hr=function(e){const t=[];let r=e===C;return[u(this,ee),u(this,te)].forEach(a=>{const s=a[e]?Object.keys(a[e]).map(n=>[n,a[e][n]]):[];s.length!==0?(r||(r=!0),t.push(...s)):e!==C&&t.push(...Object.keys(a[C]).map(n=>[n,a[C][n]]))}),r?Ba(t):null},ir),re,J,cr,Fa=(cr=class{constructor(e){g(this,"name","SmartRouter");R(this,re,[]);R(this,J,[]);T(this,re,e.routers)}add(e,t,r){if(!u(this,J))throw new Error(Dr);u(this,J).push([e,t,r])}match(e,t){if(!u(this,J))throw new Error("Fatal error");const r=u(this,re),a=u(this,J),s=r.length;let n=0,o;for(;n<s;n++){const i=r[n];try{for(let c=0,l=a.length;c<l;c++)i.add(...a[c]);o=i.match(e,t)}catch(c){if(c instanceof Ar)continue;throw c}this.match=i.match.bind(i),T(this,re,[i]),T(this,J,void 0);break}if(n===s)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(u(this,J)||u(this,re).length!==1)throw new Error("No active router has been determined yet.");return u(this,re)[0]}},re=new WeakMap,J=new WeakMap,cr),Ie=Object.create(null),ae,x,pe,be,j,G,ce,lr,Pr=(lr=class{constructor(e,t,r){R(this,G);R(this,ae);R(this,x);R(this,pe);R(this,be,0);R(this,j,Ie);if(T(this,x,r||Object.create(null)),T(this,ae,[]),e&&t){const a=Object.create(null);a[e]={handler:t,possibleKeys:[],score:0},T(this,ae,[a])}T(this,pe,[])}insert(e,t,r){T(this,be,++Pt(this,be)._);let a=this;const s=Ta(t),n=[];for(let o=0,i=s.length;o<i;o++){const c=s[o],l=s[o+1],d=Sa(c,l),p=Array.isArray(d)?d[0]:c;if(p in u(a,x)){a=u(a,x)[p],d&&n.push(d[1]);continue}u(a,x)[p]=new Pr,d&&(u(a,pe).push(d),n.push(d[1])),a=u(a,x)[p]}return u(a,ae).push({[e]:{handler:r,possibleKeys:n.filter((o,i,c)=>c.indexOf(o)===i),score:u(this,be)}}),a}search(e,t){var i;const r=[];T(this,j,Ie);let s=[this];const n=Rr(t),o=[];for(let c=0,l=n.length;c<l;c++){const d=n[c],p=c===l-1,f=[];for(let E=0,v=s.length;E<v;E++){const h=s[E],m=u(h,x)[d];m&&(T(m,j,u(h,j)),p?(u(m,x)["*"]&&r.push(...N(this,G,ce).call(this,u(m,x)["*"],e,u(h,j))),r.push(...N(this,G,ce).call(this,m,e,u(h,j)))):f.push(m));for(let _=0,y=u(h,pe).length;_<y;_++){const O=u(h,pe)[_],w=u(h,j)===Ie?{}:{...u(h,j)};if(O==="*"){const X=u(h,x)["*"];X&&(r.push(...N(this,G,ce).call(this,X,e,u(h,j))),T(X,j,w),f.push(X));continue}const[M,ve,oe]=O;if(!d&&!(oe instanceof RegExp))continue;const k=u(h,x)[M],Gr=n.slice(c).join("/");if(oe instanceof RegExp){const X=oe.exec(Gr);if(X){if(w[ve]=X[0],r.push(...N(this,G,ce).call(this,k,e,u(h,j),w)),Object.keys(u(k,x)).length){T(k,j,w);const dt=((i=X[0].match(/\//))==null?void 0:i.length)??0;(o[dt]||(o[dt]=[])).push(k)}continue}}(oe===!0||oe.test(d))&&(w[ve]=d,p?(r.push(...N(this,G,ce).call(this,k,e,w,u(h,j))),u(k,x)["*"]&&r.push(...N(this,G,ce).call(this,u(k,x)["*"],e,w,u(h,j)))):(T(k,j,w),f.push(k)))}}s=f.concat(o.shift()??[])}return r.length>1&&r.sort((c,l)=>c.score-l.score),[r.map(({handler:c,params:l})=>[c,l])]}},ae=new WeakMap,x=new WeakMap,pe=new WeakMap,be=new WeakMap,j=new WeakMap,G=new WeakSet,ce=function(e,t,r,a){const s=[];for(let n=0,o=u(e,ae).length;n<o;n++){const i=u(e,ae)[n],c=i[t]||i[C],l={};if(c!==void 0&&(c.params=Object.create(null),s.push(c),r!==Ie||a&&a!==Ie))for(let d=0,p=c.possibleKeys.length;d<p;d++){const f=c.possibleKeys[d],E=l[c.score];c.params[f]=a!=null&&a[f]&&!E?a[f]:r[f]??(a==null?void 0:a[f]),l[c.score]=!0}}return s},lr),he,dr,$a=(dr=class{constructor(){g(this,"name","TrieRouter");R(this,he);T(this,he,new Pr)}add(e,t,r){const a=wr(t);if(a){for(let s=0,n=a.length;s<n;s++)u(this,he).insert(e,a[s],r);return}u(this,he).insert(e,t,r)}match(e,t){return u(this,he).search(e,t)}},he=new WeakMap,dr),Ee=class extends jr{constructor(e={}){super(e),this.router=e.router??new Fa({routers:[new qa,new $a]})}},Wa=e=>{const r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},a=(n=>typeof n=="string"?n==="*"?()=>n:o=>n===o?o:null:typeof n=="function"?n:o=>n.includes(o)?o:null)(r.origin),s=(n=>typeof n=="function"?n:Array.isArray(n)?()=>n:()=>[])(r.allowMethods);return async function(o,i){var d;function c(p,f){o.res.headers.set(p,f)}const l=await a(o.req.header("origin")||"",o);if(l&&c("Access-Control-Allow-Origin",l),r.origin!=="*"){const p=o.req.header("Vary");p?c("Vary",p):c("Vary","Origin")}if(r.credentials&&c("Access-Control-Allow-Credentials","true"),(d=r.exposeHeaders)!=null&&d.length&&c("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),o.req.method==="OPTIONS"){r.maxAge!=null&&c("Access-Control-Max-Age",r.maxAge.toString());const p=await s(o.req.header("origin")||"",o);p.length&&c("Access-Control-Allow-Methods",p.join(","));let f=r.allowHeaders;if(!(f!=null&&f.length)){const E=o.req.header("Access-Control-Request-Headers");E&&(f=E.split(/\s*,\s*/))}return f!=null&&f.length&&(c("Access-Control-Allow-Headers",f.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await i()}},ka=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,Vt=(e,t=Va)=>{const r=/\.([a-zA-Z0-9]+?)$/,a=e.match(r);if(!a)return;let s=t[a[1]];return s&&s.startsWith("text")&&(s+="; charset=utf-8"),s},za={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},Va=za,Ya=(...e)=>{let t=e.filter(s=>s!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const r=t.split("/"),a=[];for(const s of r)s===".."&&a.length>0&&a.at(-1)!==".."?a.pop():s!=="."&&a.push(s);return a.join("/")||"."},Ur={br:".br",zstd:".zst",gzip:".gz"},Ja=Object.keys(Ur),Ga="index.html",Ka=e=>{const t=e.root??"./",r=e.path,a=e.join??Ya;return async(s,n)=>{var d,p,f,E;if(s.finalized)return n();let o;if(e.path)o=e.path;else try{if(o=decodeURIComponent(s.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(o))throw new Error}catch{return await((d=e.onNotFound)==null?void 0:d.call(e,s.req.path,s)),n()}let i=a(t,!r&&e.rewriteRequestPath?e.rewriteRequestPath(o):o);e.isDir&&await e.isDir(i)&&(i=a(i,Ga));const c=e.getContent;let l=await c(i,s);if(l instanceof Response)return s.newResponse(l.body,l);if(l){const v=e.mimes&&Vt(i,e.mimes)||Vt(i);if(s.header("Content-Type",v||"application/octet-stream"),e.precompressed&&(!v||ka.test(v))){const h=new Set((p=s.req.header("Accept-Encoding"))==null?void 0:p.split(",").map(m=>m.trim()));for(const m of Ja){if(!h.has(m))continue;const _=await c(i+Ur[m],s);if(_){l=_,s.header("Content-Encoding",m),s.header("Vary","Accept-Encoding",{append:!0});break}}}return await((f=e.onFound)==null?void 0:f.call(e,i,s)),s.body(l)}await((E=e.onNotFound)==null?void 0:E.call(e,i,s)),await n()}},Xa=async(e,t)=>{let r;t&&t.manifest?typeof t.manifest=="string"?r=JSON.parse(t.manifest):r=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?r=JSON.parse(__STATIC_CONTENT_MANIFEST):r=__STATIC_CONTENT_MANIFEST;let a;t&&t.namespace?a=t.namespace:a=__STATIC_CONTENT;const s=r[e]||e;if(!s)return null;const n=await a.get(s,{type:"stream"});return n||null},Za=e=>async function(r,a){return Ka({...e,getContent:async n=>Xa(n,{manifest:e.manifest,namespace:e.namespace?e.namespace:r.env?r.env.__STATIC_CONTENT:void 0})})(r,a)},Qa=e=>Za(e),Pe="_hp",es={Change:"Input",DoubleClick:"DblClick"},ts={svg:"2000/svg",math:"1998/Math/MathML"},Ue=[],Nt=new WeakMap,De=void 0,rs=()=>De,z=e=>"t"in e,mt={onClick:["click",!1]},Yt=e=>{if(!e.startsWith("on"))return;if(mt[e])return mt[e];const t=e.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/);if(t){const[,r,a]=t;return mt[e]=[(es[r]||r).toLowerCase(),!!a]}},Jt=(e,t)=>De&&e instanceof SVGElement&&/[A-Z]/.test(t)&&(t in e.style||t.match(/^(?:o|pai|str|u|ve)/))?t.replace(/([A-Z])/g,"-$1").toLowerCase():t,as=(e,t,r)=>{var a;t||(t={});for(let s in t){const n=t[s];if(s!=="children"&&(!r||r[s]!==n)){s=ot(s);const o=Yt(s);if(o){if((r==null?void 0:r[s])!==n&&(r&&e.removeEventListener(o[0],r[s],o[1]),n!=null)){if(typeof n!="function")throw new Error(`Event handler for "${s}" is not a function`);e.addEventListener(o[0],n,o[1])}}else if(s==="dangerouslySetInnerHTML"&&n)e.innerHTML=n.__html;else if(s==="ref"){let i;typeof n=="function"?i=n(e)||(()=>n(null)):n&&"current"in n&&(n.current=e,i=()=>n.current=null),Nt.set(e,i)}else if(s==="style"){const i=e.style;typeof n=="string"?i.cssText=n:(i.cssText="",n!=null&&Tr(n,i.setProperty.bind(i)))}else{if(s==="value"){const c=e.nodeName;if(c==="INPUT"||c==="TEXTAREA"||c==="SELECT"){if(e.value=n==null||n===!1?null:n,c==="TEXTAREA"){e.textContent=n;continue}else if(c==="SELECT"){e.selectedIndex===-1&&(e.selectedIndex=0);continue}}}else(s==="checked"&&e.nodeName==="INPUT"||s==="selected"&&e.nodeName==="OPTION")&&(e[s]=n);const i=Jt(e,s);n==null||n===!1?e.removeAttribute(i):n===!0?e.setAttribute(i,""):typeof n=="string"||typeof n=="number"?e.setAttribute(i,n):e.setAttribute(i,n.toString())}}}if(r)for(let s in r){const n=r[s];if(s!=="children"&&!(s in t)){s=ot(s);const o=Yt(s);o?e.removeEventListener(o[0],n,o[1]):s==="ref"?(a=Nt.get(e))==null||a():e.removeAttribute(Jt(e,s))}}},ss=(e,t)=>{t[b][0]=0,Ue.push([e,t]);const r=t.tag[Ct]||t.tag,a=r.defaultProps?{...r.defaultProps,...t.props}:t.props;try{return[r.call(null,a)]}finally{Ue.pop()}},Br=(e,t,r,a,s)=>{var n,o;(n=e.vR)!=null&&n.length&&(a.push(...e.vR),delete e.vR),typeof e.tag=="function"&&((o=e[b][1][Wr])==null||o.forEach(i=>s.push(i))),e.vC.forEach(i=>{var c;if(z(i))r.push(i);else if(typeof i.tag=="function"||i.tag===""){i.c=t;const l=r.length;if(Br(i,t,r,a,s),i.s){for(let d=l;d<r.length;d++)r[d].s=!0;i.s=!1}}else r.push(i),(c=i.vR)!=null&&c.length&&(a.push(...i.vR),delete i.vR)})},ns=e=>{for(;;e=e.tag===Pe||!e.vC||!e.pP?e.nN:e.vC[0]){if(!e)return null;if(e.tag!==Pe&&e.e)return e.e}},qr=e=>{var t,r,a,s,n,o;z(e)||((r=(t=e[b])==null?void 0:t[1][Wr])==null||r.forEach(i=>{var c;return(c=i[2])==null?void 0:c.call(i)}),(a=Nt.get(e.e))==null||a(),e.p===2&&((s=e.vC)==null||s.forEach(i=>i.p=2)),(n=e.vC)==null||n.forEach(qr)),e.p||((o=e.e)==null||o.remove(),delete e.e),typeof e.tag=="function"&&(Me.delete(e),at.delete(e),delete e[b][3],e.a=!0)},Fr=(e,t,r)=>{e.c=t,$r(e,t,r)},Gt=(e,t)=>{if(t){for(let r=0,a=e.length;r<a;r++)if(e[r]===t)return r}},Kt=Symbol(),$r=(e,t,r)=>{var l;const a=[],s=[],n=[];Br(e,t,a,s,n),s.forEach(qr);const o=r?void 0:t.childNodes;let i,c=null;if(r)i=-1;else if(!o.length)i=0;else{const d=Gt(o,ns(e.nN));d!==void 0?(c=o[d],i=d):i=Gt(o,(l=a.find(p=>p.tag!==Pe&&p.e))==null?void 0:l.e)??-1,i===-1&&(r=!0)}for(let d=0,p=a.length;d<p;d++,i++){const f=a[d];let E;if(f.s&&f.e)E=f.e,f.s=!1;else{const v=r||!f.e;z(f)?(f.e&&f.d&&(f.e.textContent=f.t),f.d=!1,E=f.e||(f.e=document.createTextNode(f.t))):(E=f.e||(f.e=f.n?document.createElementNS(f.n,f.tag):document.createElement(f.tag)),as(E,f.props,f.pP),$r(f,E,v))}f.tag===Pe?i--:r?E.parentNode||t.appendChild(E):o[i]!==E&&o[i-1]!==E&&(o[i+1]===E?t.appendChild(o[i]):t.insertBefore(E,c||o[i]||null))}if(e.pP&&delete e.pP,n.length){const d=[],p=[];n.forEach(([,f,,E,v])=>{f&&d.push(f),E&&p.push(E),v==null||v()}),d.forEach(f=>f()),p.length&&requestAnimationFrame(()=>{p.forEach(f=>f())})}},os=(e,t)=>!!(e&&e.length===t.length&&e.every((r,a)=>r[1]===t[a][1])),at=new WeakMap,bt=(e,t,r)=>{var n,o,i,c,l,d;const a=!r&&t.pC;r&&(t.pC||(t.pC=t.vC));let s;try{r||(r=typeof t.tag=="function"?ss(e,t):ze(t.props.children)),((n=r[0])==null?void 0:n.tag)===""&&r[0][Rt]&&(s=r[0][Rt],e[5].push([e,s,t]));const p=a?[...t.pC]:t.vC?[...t.vC]:void 0,f=[];let E;for(let v=0;v<r.length;v++){Array.isArray(r[v])&&r.splice(v,1,...r[v].flat());let h=is(r[v]);if(h){typeof h.tag=="function"&&!h.tag[Er]&&(Ce.length>0&&(h[b][2]=Ce.map(_=>[_,_.values.at(-1)])),(o=e[5])!=null&&o.length&&(h[b][3]=e[5].at(-1)));let m;if(p&&p.length){const _=p.findIndex(z(h)?y=>z(y):h.key!==void 0?y=>y.key===h.key&&y.tag===h.tag:y=>y.tag===h.tag);_!==-1&&(m=p[_],p.splice(_,1))}if(m)if(z(h))m.t!==h.t&&(m.t=h.t,m.d=!0),h=m;else{const _=m.pP=m.props;if(m.props=h.props,m.f||(m.f=h.f||t.f),typeof h.tag=="function"){const y=m[b][2];m[b][2]=h[b][2]||[],m[b][3]=h[b][3],!m.f&&((m.o||m)===h.o||(c=(i=m.tag)[ea])!=null&&c.call(i,_,m.props))&&os(y,m[b][2])&&(m.s=!0)}h=m}else if(!z(h)&&De){const _=je(De);_&&(h.n=_)}if(!z(h)&&!h.s&&(bt(e,h),delete h.f),f.push(h),E&&!E.s&&!h.s)for(let _=E;_&&!z(_);_=(l=_.vC)==null?void 0:l.at(-1))_.nN=h;E=h}}t.vR=a?[...t.vC,...p||[]]:p||[],t.vC=f,a&&delete t.pC}catch(p){if(t.f=!0,p===Kt){if(s)return;throw p}const[f,E,v]=((d=t[b])==null?void 0:d[3])||[];if(E){const h=()=>st([0,!1,e[2]],v),m=at.get(v)||[];m.push(h),at.set(v,m);const _=E(p,()=>{const y=at.get(v);if(y){const O=y.indexOf(h);if(O!==-1)return y.splice(O,1),h()}});if(_){if(e[0]===1)e[1]=!0;else if(bt(e,v,[_]),(E.length===1||e!==f)&&v.c){Fr(v,v.c,!1);return}throw Kt}}throw p}finally{s&&e[5].pop()}},is=e=>{if(!(e==null||typeof e=="boolean")){if(typeof e=="string"||typeof e=="number")return{t:e.toString(),d:!0};if("vR"in e&&(e={tag:e.tag,props:e.props,key:e.key,f:e.f,type:e.tag,ref:e.props.ref,o:e.o||e}),typeof e.tag=="function")e[b]=[0,[]];else{const t=ts[e.tag];t&&(De||(De=vr("")),e.props.children=[{tag:De,props:{value:e.n=`http://www.w3.org/${t}`,children:e.props.children}}])}return e}},Xt=(e,t)=>{var r,a;(r=t[b][2])==null||r.forEach(([s,n])=>{s.values.push(n)});try{bt(e,t,void 0)}catch{return}if(t.a){delete t.a;return}(a=t[b][2])==null||a.forEach(([s])=>{s.values.pop()}),(e[0]!==1||!e[1])&&Fr(t,t.c,!1)},Me=new WeakMap,Zt=[],st=async(e,t)=>{e[5]||(e[5]=[]);const r=Me.get(t);r&&r[0](void 0);let a;const s=new Promise(n=>a=n);if(Me.set(t,[a,()=>{e[2]?e[2](e,t,n=>{Xt(n,t)}).then(()=>a(t)):(Xt(e,t),a(t))}]),Zt.length)Zt.at(-1).add(t);else{await Promise.resolve();const n=Me.get(t);n&&(Me.delete(t),n[1]())}return s},cs=(e,t,r)=>({tag:Pe,props:{children:e},key:r,e:t,p:1}),vt=0,Wr=1,_t=2,gt=3,Tt=new WeakMap,kr=(e,t)=>!e||!t||e.length!==t.length||t.some((r,a)=>r!==e[a]),ls=void 0,Qt=[],ds=e=>{var o;const t=()=>typeof e=="function"?e():e,r=Ue.at(-1);if(!r)return[t(),()=>{}];const[,a]=r,s=(o=a[b][1])[vt]||(o[vt]=[]),n=a[b][0]++;return s[n]||(s[n]=[t(),i=>{const c=ls,l=s[n];if(typeof i=="function"&&(i=i(l[0])),!Object.is(i,l[0]))if(l[0]=i,Qt.length){const[d,p]=Qt.at(-1);Promise.all([d===3?a:st([d,!1,c],a),p]).then(([f])=>{if(!f||!(d===2||d===3))return;const E=f.vC;requestAnimationFrame(()=>{setTimeout(()=>{E===f.vC&&st([d===3?1:0,!1,c],f)})})})}else st([0,!1,c],a)}])},Mt=(e,t)=>{var i;const r=Ue.at(-1);if(!r)return e;const[,a]=r,s=(i=a[b][1])[_t]||(i[_t]=[]),n=a[b][0]++,o=s[n];return kr(o==null?void 0:o[1],t)?s[n]=[e,t]:e=s[n][0],e},us=e=>{const t=Tt.get(e);if(t){if(t.length===2)throw t[1];return t[0]}throw e.then(r=>Tt.set(e,[r]),r=>Tt.set(e,[void 0,r])),e},fs=(e,t)=>{var i;const r=Ue.at(-1);if(!r)return e();const[,a]=r,s=(i=a[b][1])[gt]||(i[gt]=[]),n=a[b][0]++,o=s[n];return kr(o==null?void 0:o[1],t)&&(s[n]=[e(),t]),s[n][0]},ps=vr({pending:!1,data:null,method:null,action:null}),er=new Set,hs=e=>{er.add(e),e.finally(()=>er.delete(e))},xt=(e,t)=>fs(()=>r=>{let a;e&&(typeof e=="function"?a=e(r)||(()=>{e(null)}):e&&"current"in e&&(e.current=r,a=()=>{e.current=null}));const s=t(r);return()=>{s==null||s(),a==null||a()}},[e]),ge=Object.create(null),Ke=Object.create(null),Je=(e,t,r,a,s)=>{if(t!=null&&t.itemProp)return{tag:e,props:t,type:e,ref:t.ref};const n=document.head;let{onLoad:o,onError:i,precedence:c,blocking:l,...d}=t,p=null,f=!1;const E=Xe[e];let v;if(E.length>0){const y=n.querySelectorAll(e);e:for(const O of y)for(const w of Xe[e])if(O.getAttribute(w)===t[w]){p=O;break e}if(!p){const O=E.reduce((w,M)=>t[M]===void 0?w:`${w}-${M}-${t[M]}`,e);f=!Ke[O],p=Ke[O]||(Ke[O]=(()=>{const w=document.createElement(e);for(const M of E)t[M]!==void 0&&w.setAttribute(M,t[M]),t.rel&&w.setAttribute("rel",t.rel);return w})())}}else v=n.querySelectorAll(e);c=a?c??"":void 0,a&&(d[Ze]=c);const h=Mt(y=>{if(E.length>0){let O=!1;for(const w of n.querySelectorAll(e)){if(O&&w.getAttribute(Ze)!==c){n.insertBefore(y,w);return}w.getAttribute(Ze)===c&&(O=!0)}n.appendChild(y)}else if(v){let O=!1;for(const w of v)if(w===y){O=!0;break}O||n.insertBefore(y,n.contains(v[0])?v[0]:n.querySelector(e)),v=void 0}},[c]),m=xt(t.ref,y=>{var M;const O=E[0];if(r===2&&(y.innerHTML=""),(f||v)&&h(y),!i&&!o)return;let w=ge[M=y.getAttribute(O)]||(ge[M]=new Promise((ve,oe)=>{y.addEventListener("load",ve),y.addEventListener("error",oe)}));o&&(w=w.then(o)),i&&(w=w.catch(i)),w.catch(()=>{})});if(s&&l==="render"){const y=Xe[e][0];if(t[y]){const O=t[y],w=ge[O]||(ge[O]=new Promise((M,ve)=>{h(p),p.addEventListener("load",M),p.addEventListener("error",ve)}));us(w)}}const _={tag:e,type:e,props:{...d,ref:m},ref:m};return _.p=r,p&&(_.e=p),cs(_,n)},Es=e=>{const t=rs(),r=t&&je(t);return r!=null&&r.endsWith("svg")?{tag:"title",props:e,type:"title",ref:e.ref}:Je("title",e,void 0,!1,!1)},ms=e=>!e||["src","async"].some(t=>!e[t])?{tag:"script",props:e,type:"script",ref:e.ref}:Je("script",e,1,!1,!0),vs=e=>!e||!["href","precedence"].every(t=>t in e)?{tag:"style",props:e,type:"style",ref:e.ref}:(e["data-href"]=e.href,delete e.href,Je("style",e,2,!0,!0)),_s=e=>!e||["onLoad","onError"].some(t=>t in e)||e.rel==="stylesheet"&&(!("precedence"in e)||"disabled"in e)?{tag:"link",props:e,type:"link",ref:e.ref}:Je("link",e,1,"precedence"in e,!0),gs=e=>Je("meta",e,void 0,!1,!1),zr=Symbol(),Ts=e=>{const{action:t,...r}=e;typeof t!="function"&&(r.action=t);const[a,s]=ds([null,!1]),n=Mt(async l=>{const d=l.isTrusted?t:l.detail[zr];if(typeof d!="function")return;l.preventDefault();const p=new FormData(l.target);s([p,!0]);const f=d(p);f instanceof Promise&&(hs(f),await f),s([null,!0])},[]),o=xt(e.ref,l=>(l.addEventListener("submit",n),()=>{l.removeEventListener("submit",n)})),[i,c]=a;return a[1]=!1,{tag:ps,props:{value:{pending:i!==null,data:i,method:i?"post":null,action:i?t:null},children:{tag:"form",props:{...r,ref:o},type:"form",ref:o}},f:c}},Vr=(e,{formAction:t,...r})=>{if(typeof t=="function"){const a=Mt(s=>{s.preventDefault(),s.currentTarget.form.dispatchEvent(new CustomEvent("submit",{detail:{[zr]:t}}))},[]);r.ref=xt(r.ref,s=>(s.addEventListener("click",a),()=>{s.removeEventListener("click",a)}))}return{tag:e,props:r,type:e,ref:r.ref}},ys=e=>Vr("input",e),Rs=e=>Vr("button",e);Object.assign(St,{title:Es,script:ms,style:vs,link:_s,meta:gs,form:Ts,input:ys,button:Rs});Dt(null);new TextEncoder;var Ss=Dt(null),ws=(e,t,r,a)=>(s,n)=>{const o="<!DOCTYPE html>",i=r?Ft(l=>r(l,e),{Layout:t,...n},s):s,c=Qr`${U(o)}${Ft(Ss.Provider,{value:e},i)}`;return e.html(c)},Os=(e,t)=>function(a,s){const n=a.getLayout()??pa;return e&&a.setLayout(o=>e({...o,Layout:n},a)),a.setRenderer(ws(a,n,e)),s()};const Ns=Os(({children:e})=>S("html",{lang:"es",children:[S("head",{children:[S("meta",{charset:"UTF-8"}),S("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),S("title",{children:"Yo Decreto - Gustavo Adolfo Guerrero Castaños"}),S("link",{rel:"icon",href:"/static/logo-yo-decreto.png",type:"image/png"}),S("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",rel:"stylesheet"}),S("script",{src:"https://cdn.tailwindcss.com"}),S("link",{href:"https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css",rel:"stylesheet"}),S("script",{src:"https://cdn.jsdelivr.net/npm/chart.js"}),S("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"}),S("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js"}),S("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrAfter.js"}),S("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrBefore.js"}),S("script",{src:"https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"}),S("link",{href:"/static/styles.css",rel:"stylesheet"}),S("script",{dangerouslySetInnerHTML:{__html:`
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    'sans': ['Inter', 'system-ui', 'sans-serif'],
                  },
                  colors: {
                    primary: {
                      50: '#f0f9ff',
                      100: '#e0f2fe',
                      200: '#bae6fd',
                      300: '#7dd3fc',
                      400: '#38bdf8',
                      500: '#0ea5e9',
                      600: '#0284c7',
                      700: '#0369a1',
                      800: '#075985',
                      900: '#0c4a6e',
                    },
                    accent: {
                      green: '#10b981',
                      purple: '#8b5cf6',
                      red: '#ef4444',
                      orange: '#f59e0b',
                      blue: '#3b82f6'
                    }
                  }
                }
              }
            }
          `}})]}),S("body",{className:"bg-slate-900 text-white font-sans",children:[e,S("script",{src:`/static/auth.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),S("script",{src:`/static/app.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),S("script",{src:`/static/decretos.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),S("script",{src:`/static/agenda.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),S("script",{src:`/static/progreso.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),S("script",{src:`/static/practica.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),S("script",{src:`/static/acerca.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`})]})]}));async function bs(e,t,r,a,s,n,o){try{if(console.log("📅 Sincronizando con agenda:",{accionId:t,titulo:r,proximaRevision:o}),o){const i=o.split("T")[0],c=o.split("T")[1]||"09:00";console.log("📅 Creando evento agenda:",{fechaParte:i,horaParte:c});const l=await e.prepare(`
        INSERT INTO agenda_eventos (
          accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(t,`[Decreto] ${r}`,`${a}${s?" - "+s:""}`,i,c,"media").run();console.log("✅ Evento agenda creado:",l.meta.last_row_id)}else console.log("⏭️ Sin fecha programada, no se crea evento agenda")}catch(i){console.error("❌ Error al sincronizar con agenda:",i)}}const I=new Ee;I.get("/config",async e=>{try{const t=await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first();return e.json({success:!0,data:t||{nombre_usuario:"Gustavo Adolfo Guerrero Castaños",frase_vida:"(Agregar frase de vida)"}})}catch{return e.json({success:!1,error:"Error al obtener configuración"},500)}});I.put("/config",async e=>{try{const{nombre_usuario:t,frase_vida:r}=await e.req.json();return await e.env.DB.prepare("UPDATE configuracion SET nombre_usuario = ?, frase_vida = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(t,r,"main").run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al actualizar configuración"},500)}});I.get("/",async e=>{try{const t=await e.env.DB.prepare("SELECT * FROM decretos ORDER BY created_at DESC").all(),r={total:t.results.length,empresarial:t.results.filter(s=>s.area==="empresarial").length,material:t.results.filter(s=>s.area==="material").length,humano:t.results.filter(s=>s.area==="humano").length},a={empresarial:r.total>0?Math.round(r.empresarial/r.total*100):0,material:r.total>0?Math.round(r.material/r.total*100):0,humano:r.total>0?Math.round(r.humano/r.total*100):0};return e.json({success:!0,data:{decretos:t.results,contadores:r,porcentajes:a}})}catch{return e.json({success:!1,error:"Error al obtener decretos"},500)}});I.get("/:id",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(t).first();if(!r)return e.json({success:!1,error:"Decreto no encontrado"},404);const a=await e.env.DB.prepare("SELECT * FROM acciones WHERE decreto_id = ? ORDER BY created_at DESC").bind(t).all(),s=a.results.length,n=a.results.filter(c=>c.estado==="completada").length,o=s-n,i=s>0?Math.round(n/s*100):0;return await e.env.DB.prepare("UPDATE decretos SET progreso = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(i,t).run(),e.json({success:!0,data:{decreto:{...r,progreso:i},acciones:a.results,metricas:{total_acciones:s,completadas:n,pendientes:o,progreso:i}}})}catch{return e.json({success:!1,error:"Error al obtener decreto"},500)}});I.post("/",async e=>{try{const{area:t,titulo:r,sueno_meta:a,descripcion:s}=await e.req.json();if(!t||!r||!a)return e.json({success:!1,error:"Campos requeridos: area, titulo, sueno_meta"},400);const n=await e.env.DB.prepare("INSERT INTO decretos (area, titulo, sueno_meta, descripcion) VALUES (?, ?, ?, ?)").bind(t,r,a,s||"").run();return e.json({success:!0,id:n.meta.last_row_id})}catch{return e.json({success:!1,error:"Error al crear decreto"},500)}});I.put("/:id",async e=>{try{const t=e.req.param("id"),{area:r,titulo:a,sueno_meta:s,descripcion:n}=await e.req.json();return await e.env.DB.prepare("UPDATE decretos SET area = ?, titulo = ?, sueno_meta = ?, descripcion = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(r,a,s,n||"",t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al actualizar decreto"},500)}});I.delete("/:id",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare("DELETE FROM decretos WHERE id = ?").bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar decreto"},500)}});I.post("/:id/acciones",async e=>{var t;try{const r=e.req.param("id"),a=await e.req.json();console.log("=== BACKEND: RECIBIENDO DATOS ===",{decretoId:r,requestDataKeys:Object.keys(a),hasSubtareas:"subtareas"in a,subtareasLength:((t=a.subtareas)==null?void 0:t.length)||0,subtareasData:a.subtareas});const{titulo:s,que_hacer:n,como_hacerlo:o,resultados:i,tareas_pendientes:c,tipo:l,proxima_revision:d,calificacion:p,subtareas:f=[]}=a;if(!s||!n)return e.json({success:!1,error:"Campos requeridos: titulo, que_hacer"},400);const E=crypto.randomUUID().replace(/-/g,"").substring(0,32);if(await e.env.DB.prepare(`
      INSERT INTO acciones (
        id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
        tareas_pendientes, tipo, proxima_revision, calificacion, origen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')
    `).bind(E,r,s,n,o||"",i||"",JSON.stringify(c||[]),l||"secundaria",d||null,p||null).run(),console.log("✅ Acción creada:",E),d){console.log("🔥 FORZANDO creación en agenda para:",{accionId:E,titulo:s,proxima_revision:d});const h=d.split("T")[0],m=d.split("T")[1]||"09:00";try{const _=await e.env.DB.prepare(`
          INSERT INTO agenda_eventos (
            accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(E,`[Decreto] ${s}`,`${n}${o?" - "+o:""}`,h,m,"media").run();console.log("🚀 AGENDA EVENTO CREADO EXITOSAMENTE:",_.meta.last_row_id)}catch(_){console.error("💥 ERROR CREANDO AGENDA EVENTO:",_)}}else console.log("⚠️ NO HAY FECHA DE REVISIÓN - NO SE CREA EVENTO AGENDA");let v=0;if(console.log("=== PROCESANDO SUB-TAREAS ===",{hasSubtareas:!!f,subtareasLength:(f==null?void 0:f.length)||0,subtareasData:f}),f&&f.length>0){console.log(`Procesando ${f.length} sub-tareas...`);for(let h=0;h<f.length;h++){const m=f[h];if(console.log(`Sub-tarea ${h+1}:`,m),m.titulo){const _=crypto.randomUUID().replace(/-/g,"").substring(0,32);let y=m.fecha_programada;!y&&d&&(y=d),console.log(`Creando sub-tarea ${h+1} con ID: ${_}`,{titulo:m.titulo,queHacer:m.que_hacer,fecha:y,padreId:E});const O=await e.env.DB.prepare(`
            INSERT INTO acciones (
              id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
              tipo, proxima_revision, origen, tarea_padre_id, nivel_jerarquia
            ) VALUES (?, ?, ?, ?, ?, '', 'secundaria', ?, 'subtarea', ?, 1)
          `).bind(_,r,m.titulo,m.que_hacer,m.como_hacerlo||"",y,E).run();console.log(`✅ Sub-tarea ${h+1} creada en BD:`,{success:O.success,changes:O.changes}),y&&(await bs(e.env.DB,_,`[Sub] ${m.titulo}`,m.que_hacer,m.como_hacerlo,"secundaria",y),console.log(`✅ Sub-tarea ${h+1} sincronizada con agenda`)),v++}else console.log(`⏭️ Sub-tarea ${h+1} sin título, saltando`)}}else console.log("No hay sub-tareas para procesar");return console.log(`=== SUB-TAREAS COMPLETADAS: ${v} ===`),console.log("=== RESPUESTA FINAL ===",{success:!0,accionId:E,subtareasCreadas:v}),e.json({success:!0,id:E,data:{subtareas_creadas:v}})}catch(r){return console.error("Error creating action:",r),e.json({success:!1,error:`Error al crear acción: ${r.message}`},500)}});I.get("/:decretoId/acciones/:accionId",async e=>{try{const t=e.req.param("decretoId"),r=e.req.param("accionId"),a=await e.env.DB.prepare(`
      SELECT 
        a.*,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      WHERE a.id = ? AND a.decreto_id = ?
    `).bind(r,t).first();if(!a)return e.json({success:!1,error:"Acción no encontrada"},404);if(a.tareas_pendientes)try{a.tareas_pendientes=JSON.parse(a.tareas_pendientes)}catch{a.tareas_pendientes=[]}return e.json({success:!0,data:a})}catch{return e.json({success:!1,error:"Error al obtener detalles de la acción"},500)}});I.put("/:decretoId/acciones/:accionId",async e=>{try{const t=e.req.param("decretoId"),r=e.req.param("accionId"),{titulo:a,que_hacer:s,como_hacerlo:n,resultados:o,tipo:i,proxima_revision:c,calificacion:l}=await e.req.json();if(!a||!s)return e.json({success:!1,error:"Campos requeridos: titulo, que_hacer"},400);if(await e.env.DB.prepare(`
      UPDATE acciones SET 
        titulo = ?,
        que_hacer = ?,
        como_hacerlo = ?,
        resultados = ?,
        tipo = ?,
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND decreto_id = ?
    `).bind(a,s,n||"",o||"",i||"secundaria",c||null,l||null,r,t).run(),await e.env.DB.prepare("SELECT id FROM agenda_eventos WHERE accion_id = ?").bind(r).first()&&c){const p=c.split("T")[0],f=c.split("T")[1]||"09:00";await e.env.DB.prepare(`
        UPDATE agenda_eventos SET 
          titulo = ?,
          fecha_evento = ?,
          hora_evento = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE accion_id = ?
      `).bind(`[Decreto] ${a}`,p,f,r).run()}return e.json({success:!0})}catch{return e.json({success:!1,error:"Error al editar acción"},500)}});I.put("/:decretoId/acciones/:accionId/completar",async e=>{try{const t=e.req.param("accionId");return await e.env.DB.prepare('UPDATE acciones SET estado = "completada", fecha_cierre = date("now"), updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(),await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "completada", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al completar acción"},500)}});I.put("/:decretoId/acciones/:accionId/pendiente",async e=>{try{const t=e.req.param("accionId");return await e.env.DB.prepare('UPDATE acciones SET estado = "pendiente", fecha_cierre = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(),await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "pendiente", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al marcar acción como pendiente"},500)}});I.delete("/:decretoId/acciones/:accionId",async e=>{try{const t=e.req.param("accionId");return await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar acción"},500)}});I.post("/:decretoId/acciones/:accionId/seguimientos",async e=>{try{const t=e.req.param("accionId"),{que_se_hizo:r,como_se_hizo:a,resultados_obtenidos:s,tareas_pendientes:n,proxima_revision:o,calificacion:i}=await e.req.json();if(!r||!a||!s)return e.json({success:!1,error:"Campos requeridos: que_se_hizo, como_se_hizo, resultados_obtenidos"},400);await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(t,r,a,s,JSON.stringify(n||[]),o||null,i||null).run(),await e.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(s,JSON.stringify(n||[]),o||null,i||null,t).run();let c=0;if(n&&Array.isArray(n)){for(const l of n)if(typeof l=="string"&&l.trim()){let d=l.trim(),p="secundaria",f=null;(d.startsWith("[P]")||d.includes("#primaria"))&&(p="primaria",d=d.replace(/\[P\]|#primaria/g,"").trim()),d.includes("#diaria")&&(p="secundaria",d=d.replace(/#diaria/g,"").trim());const E=d.match(/@(\d{4}-\d{2}-\d{2})/);E&&(f=E[1]+"T09:00",d=d.replace(/@\d{4}-\d{2}-\d{2}/g,"").trim());const v=await e.env.DB.prepare("SELECT decreto_id FROM acciones WHERE id = ?").bind(t).first();if(v){const h=await e.env.DB.prepare(`
              INSERT INTO acciones (
                decreto_id, titulo, que_hacer, como_hacerlo, tipo, 
                proxima_revision, origen
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `).bind(v.decreto_id,d,"Tarea generada desde seguimiento",`Completar: ${d}`,p,f,`seguimiento:${t}`).run();let m=null;if(p==="secundaria"){const _=f?f.split("T")[0]:new Date().toISOString().split("T")[0],y=f?f.split("T")[1]:"09:00";m=(await e.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad)
                VALUES (?, ?, ?, ?, ?, ?)
              `).bind(h.meta.last_row_id,d,`[Auto-generada] ${d}`,_,y,"media").run()).meta.last_row_id}else p==="primaria"&&f&&(m=(await e.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad)
                VALUES (?, ?, ?, date(?), time(?), ?)
              `).bind(h.meta.last_row_id,`[Semanal] ${d}`,"Tarea generada desde seguimiento",f.split("T")[0],f.split("T")[1],"media").run()).meta.last_row_id);m&&await e.env.DB.prepare(`
                UPDATE acciones SET agenda_event_id = ? WHERE id = ?
              `).bind(m,h.meta.last_row_id).run(),c++}}}return e.json({success:!0,message:`Seguimiento guardado. ${c} tareas nuevas creadas.`})}catch{return e.json({success:!1,error:"Error al crear seguimiento"},500)}});I.get("/:id/sugerencias",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(t).first();if(!r)return e.json({success:!1,error:"Decreto no encontrado"},404);let a=[];switch(r.area){case"empresarial":a=["Analizar competencia directa y ventajas competitivas","Definir métricas clave de rendimiento (KPIs)","Desarrollar plan de marketing digital","Establecer alianzas estratégicas","Optimizar procesos operativos"];break;case"material":a=["Revisar y optimizar presupuesto mensual","Investigar nuevas oportunidades de inversión","Crear fondo de emergencia","Diversificar fuentes de ingresos","Consultar con asesor financiero"];break;case"humano":a=["Establecer rutina de ejercicio diario","Practicar meditación mindfulness","Fortalecer relaciones familiares","Desarrollar nuevas habilidades","Cultivar hábitos de sueño saludables"];break;default:a=["Definir objetivos específicos y medibles","Crear plan de acción detallado","Establecer fechas límite realistas","Buscar recursos y herramientas necesarias","Programar revisiones de progreso"]}return e.json({success:!0,data:a.map((s,n)=>({id:`sugerencia_${n+1}`,texto:s,categoria:r.area}))})}catch{return e.json({success:!1,error:"Error al generar sugerencias"},500)}});I.get("/:decretoId/acciones/:accionId/arbol",async e=>{try{const t=e.req.param("decretoId"),r=e.req.param("accionId"),a=await e.env.DB.prepare(`
      WITH RECURSIVE arbol_completo AS (
        -- Tarea raíz
        SELECT 
          a.id, a.titulo, a.que_hacer, a.estado, a.nivel_jerarquia,
          a.tarea_padre_id, a.proxima_revision, a.tiene_derivadas,
          0 as profundidad, CAST(a.id AS TEXT) as path
        FROM acciones a
        WHERE a.id = ? AND a.decreto_id = ?
        
        UNION ALL
        
        -- Tareas derivadas
        SELECT 
          a.id, a.titulo, a.que_hacer, a.estado, a.nivel_jerarquia,
          a.tarea_padre_id, a.proxima_revision, a.tiene_derivadas,
          ac.profundidad + 1, ac.path || '/' || CAST(a.id AS TEXT)
        FROM acciones a
        JOIN arbol_completo ac ON a.tarea_padre_id = ac.id
        WHERE a.nivel_jerarquia <= 2
      )
      SELECT ac.*, td.dias_offset, td.orden, td.tipo_relacion
      FROM arbol_completo ac
      LEFT JOIN tareas_derivadas td ON td.tarea_hija_id = ac.id
      ORDER BY ac.profundidad, td.orden
    `).bind(r,t).all();return e.json({success:!0,data:{arbol:a.results,total_tareas:a.results.length}})}catch{return e.json({success:!1,error:"Error al obtener árbol de tareas"},500)}});const H=new Ee;H.get("/metricas/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
      SELECT 
        ae.*, 
        a.titulo as accion_titulo, 
        a.fecha_creacion as accion_fecha_creacion,
        a.fecha_cierre as accion_fecha_cierre,
        d.area, 
        d.titulo as decreto_titulo
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
      ORDER BY 
        CASE ae.prioridad 
          WHEN 'alta' THEN 1 
          WHEN 'media' THEN 2 
          WHEN 'baja' THEN 3 
          ELSE 2 
        END ASC, 
        ae.hora_evento ASC
    `).bind(t).all(),a=r.results.length,s=r.results.filter(i=>i.estado==="completada").length,n=a-s,o=a>0?Math.round(s/a*100):0;return e.json({success:!0,data:{total:a,completadas:s,pendientes:n,progreso:o,tareas:r.results}})}catch{return e.json({success:!1,error:"Error al obtener métricas del día"},500)}});H.get("/calendario/:year/:month",async e=>{try{const t=e.req.param("year"),r=e.req.param("month"),a=`${t}-${r.padStart(2,"0")}-01`,s=`${t}-${r.padStart(2,"0")}-31`,n=await e.env.DB.prepare(`
      SELECT 
        fecha_evento,
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado = 'pendiente' AND fecha_evento < date('now') THEN 1 END) as vencidas
      FROM agenda_eventos 
      WHERE fecha_evento BETWEEN ? AND ?
      GROUP BY fecha_evento
    `).bind(a,s).all(),o={};for(const i of n.results){const{fecha_evento:c,total:l,completadas:d,vencidas:p}=i;d===l?o[c]="completado":p>0?o[c]="vencido":l>d&&(o[c]="pendiente")}return e.json({success:!0,data:{eventos:n.results,estados:o}})}catch{return e.json({success:!1,error:"Error al obtener calendario"},500)}});H.get("/timeline/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        a.que_hacer,
        a.tipo,
        a.fecha_creacion as accion_fecha_creacion,
        a.fecha_cierre as accion_fecha_cierre,
        d.area,
        d.titulo as decreto_titulo,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
      ORDER BY 
        CASE ae.prioridad 
          WHEN 'alta' THEN 1 
          WHEN 'media' THEN 2 
          WHEN 'baja' THEN 3 
          ELSE 2 
        END ASC, 
        ae.hora_evento ASC, 
        ae.created_at ASC
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener timeline"},500)}});H.get("/enfoque/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        d.titulo as decreto_titulo,
        d.area
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ? AND ae.es_enfoque_dia = 1
      LIMIT 1
    `).bind(t).first();return e.json({success:!0,data:r})}catch{return e.json({success:!1,error:"Error al obtener enfoque del día"},500)}});H.put("/enfoque/:fecha",async e=>{try{const t=e.req.param("fecha"),{tarea_id:r}=await e.req.json();return await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 0 WHERE fecha_evento = ?").bind(t).run(),r&&await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(r).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al establecer enfoque"},500)}});H.post("/tareas",async e=>{try{const{decreto_id:t,nombre:r,descripcion:a,fecha_hora:s,tipo:n,prioridad:o}=await e.req.json();if(console.log("📝 Creando tarea agenda:",{decreto_id:t,nombre:r,fecha_hora:s,tipo:n,prioridad:o}),!r||!s)return e.json({success:!1,error:"Campos requeridos: nombre, fecha_hora"},400);const i=s.split("T")[0],c=s.split("T")[1]||"09:00",l=await e.env.DB.prepare(`
      INSERT INTO agenda_eventos (
        titulo, 
        descripcion, 
        fecha_evento, 
        hora_evento,
        prioridad,
        estado,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(r,a||"",i,c,o||"media").run();return console.log("✅ Tarea agenda creada:",l.meta.last_row_id),e.json({success:!0,id:l.meta.last_row_id,message:"Tarea creada correctamente"})}catch(t){return console.error("❌ Error crear tarea:",t),e.json({success:!1,error:`Error al crear tarea: ${t.message}`},500)}});H.put("/tareas/:id/completar",async e=>{try{const t=e.req.param("id"),r=new Date().toISOString();return await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        estado = "completada", 
        fecha_completada = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(r,t).run(),await e.env.DB.prepare(`
      UPDATE acciones SET 
        estado = "completada", 
        fecha_cierre = date("now"),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT accion_id FROM agenda_eventos WHERE id = ?
      )
    `).bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al completar tarea"},500)}});H.put("/tareas/:id/pendiente",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        estado = "pendiente", 
        fecha_completada = NULL,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(t).run(),await e.env.DB.prepare(`
      UPDATE acciones SET 
        estado = "pendiente", 
        fecha_cierre = NULL,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT accion_id FROM agenda_eventos WHERE id = ?
      )
    `).bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al marcar tarea como pendiente"},500)}});H.delete("/tareas/:id",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();if(await e.env.DB.prepare("DELETE FROM agenda_eventos WHERE id = ?").bind(t).run(),r!=null&&r.accion_id){const a=await e.env.DB.prepare("SELECT origen FROM acciones WHERE id = ?").bind(r.accion_id).first();(a==null?void 0:a.origen)==="agenda"&&await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(r.accion_id).run()}return e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar tarea"},500)}});H.get("/pendientes/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
      SELECT 
        ae.id,
        ae.titulo,
        ae.hora_evento,
        a.titulo as accion_titulo,
        d.titulo as decreto_titulo,
        d.area
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ? AND ae.estado = 'pendiente'
      ORDER BY ae.hora_evento ASC
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener tareas pendientes"},500)}});H.get("/tareas/:id",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare(`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        a.que_hacer,
        a.como_hacerlo,
        a.resultados,
        a.tipo,
        a.calificacion,
        a.proxima_revision,
        a.tareas_pendientes,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.id = ?
    `).bind(t).first();if(!r)return e.json({success:!1,error:"Tarea no encontrada"},404);if(r.tareas_pendientes)try{r.tareas_pendientes=JSON.parse(r.tareas_pendientes)}catch{r.tareas_pendientes=[]}return e.json({success:!0,data:r})}catch{return e.json({success:!1,error:"Error al obtener detalles de la tarea"},500)}});H.put("/tareas/:id",async e=>{try{const t=e.req.param("id"),{titulo:r,descripcion:a,fecha_hora:s,que_hacer:n,como_hacerlo:o,resultados:i,tipo:c,calificacion:l,prioridad:d}=await e.req.json();if(!r||!s)return e.json({success:!1,error:"Campos requeridos: titulo, fecha_hora"},400);const p=s.split("T")[0],f=s.split("T")[1]||"09:00";await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        titulo = ?,
        descripcion = ?,
        fecha_evento = ?,
        hora_evento = ?,
        prioridad = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(r,a||"",p,f,d||"media",t).run();const E=await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();return E!=null&&E.accion_id&&await e.env.DB.prepare(`
        UPDATE acciones SET 
          titulo = ?,
          que_hacer = ?,
          como_hacerlo = ?,
          resultados = ?,
          tipo = ?,
          proxima_revision = ?,
          calificacion = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(r,n||"",o||"",i||"",c||"secundaria",s,l||null,E.accion_id).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al editar tarea"},500)}});H.get("/filtros",async e=>{try{const{fecha_desde:t,fecha_hasta:r,incluir_hoy:a,incluir_futuras:s,incluir_completadas:n,incluir_pendientes:o,decreto_id:i,area:c}=e.req.query();let l=`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        a.tipo,
        d.titulo as decreto_titulo,
        d.area,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE 1=1
    `;const d=[];a==="true"&&(l+=" AND ae.fecha_evento = date('now')"),s==="true"&&(l+=" AND ae.fecha_evento > date('now')"),t&&r&&(l+=" AND ae.fecha_evento BETWEEN ? AND ?",d.push(t,r));const p=[];n==="true"&&p.push("completada"),o==="true"&&p.push("pendiente"),p.length>0&&(l+=` AND ae.estado IN (${p.map(()=>"?").join(",")})`,d.push(...p)),i&&i!=="todos"&&(l+=" AND d.id = ?",d.push(i)),c&&c!=="todos"&&(l+=" AND d.area = ?",d.push(c)),l+=" ORDER BY ae.fecha_evento DESC, ae.hora_evento ASC";const f=await e.env.DB.prepare(l).bind(...d).all();return e.json({success:!0,data:f.results})}catch{return e.json({success:!1,error:"Error al filtrar tareas"},500)}});H.post("/tareas/:id/seguimiento",async e=>{try{const t=e.req.param("id"),r=await e.req.json(),a=await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();if(!(a!=null&&a.accion_id))return e.json({success:!1,error:"No se encontró acción asociada"},404);const{que_se_hizo:s,como_se_hizo:n,resultados_obtenidos:o,tareas_pendientes:i,proxima_revision:c,calificacion:l}=r;return await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(a.accion_id,s,n,o,JSON.stringify(i||[]),c||null,l||null).run(),await e.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(o,JSON.stringify(i||[]),c||null,l||null,a.accion_id).run(),e.json({success:!0,message:"Seguimiento guardado desde agenda"})}catch{return e.json({success:!1,error:"Error al crear seguimiento"},500)}});const ne=new Ee;ne.get("/metricas",async e=>{try{const t=await e.env.DB.prepare("SELECT COUNT(*) as total FROM acciones").first(),r=await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado = "completada"').first(),a=await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado IN ("pendiente", "en_progreso")').first(),s=(t==null?void 0:t.total)||0,n=(r==null?void 0:r.total)||0,o=(a==null?void 0:a.total)||0,i=s>0?Math.round(n/s*100):0;return e.json({success:!0,data:{total_tareas:s,completadas:n,pendientes:o,progreso_global:i}})}catch{return e.json({success:!1,error:"Error al obtener métricas"},500)}});ne.get("/por-decreto",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT 
        d.id,
        d.titulo,
        d.area,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN a.estado IN ('pendiente', 'en_progreso') THEN 1 END) as pendientes,
        CASE 
          WHEN COUNT(a.id) > 0 
          THEN ROUND((COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) * 100.0) / COUNT(a.id))
          ELSE 0 
        END as progreso_porcentaje
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.id, d.titulo, d.area
      ORDER BY d.area, d.created_at
    `).all(),r={empresarial:[],material:[],humano:[]};for(const s of t.results)r[s.area]&&r[s.area].push(s);const a={empresarial:{total_acciones:r.empresarial.reduce((s,n)=>s+n.total_acciones,0),completadas:r.empresarial.reduce((s,n)=>s+n.completadas,0),progreso:0},material:{total_acciones:r.material.reduce((s,n)=>s+n.total_acciones,0),completadas:r.material.reduce((s,n)=>s+n.completadas,0),progreso:0},humano:{total_acciones:r.humano.reduce((s,n)=>s+n.total_acciones,0),completadas:r.humano.reduce((s,n)=>s+n.completadas,0),progreso:0}};return Object.keys(a).forEach(s=>{const n=a[s];n.progreso=n.total_acciones>0?Math.round(n.completadas/n.total_acciones*100):0}),e.json({success:!0,data:{decretos:t.results,por_area:r,totales_por_area:a}})}catch{return e.json({success:!1,error:"Error al obtener progreso por decreto"},500)}});ne.get("/timeline",async e=>{try{const{periodo:t}=e.req.query();let r="";const a=[];switch(t){case"dia":r='WHERE a.fecha_cierre = date("now")';break;case"semana":r='WHERE a.fecha_cierre >= date("now", "-7 days")';break;case"mes":r='WHERE a.fecha_cierre >= date("now", "-30 days")';break;default:break}const s=await e.env.DB.prepare(`
      SELECT 
        a.titulo,
        a.fecha_cierre,
        a.tipo,
        a.calificacion,
        d.titulo as decreto_titulo,
        d.area,
        s.que_se_hizo,
        s.resultados_obtenidos
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN seguimientos s ON a.id = s.accion_id
      ${r}
      AND a.estado = 'completada'
      ORDER BY a.fecha_cierre DESC, a.updated_at DESC
      LIMIT 50
    `).bind(...a).all();return e.json({success:!0,data:s.results})}catch{return e.json({success:!1,error:"Error al obtener timeline"},500)}});ne.get("/evolucion",async e=>{try{const{dias:t=30}=e.req.query(),r=await e.env.DB.prepare(`
      SELECT 
        fecha_cierre,
        COUNT(*) as completadas_dia,
        SUM(COUNT(*)) OVER (ORDER BY fecha_cierre) as acumuladas
      FROM acciones
      WHERE estado = 'completada' 
        AND fecha_cierre >= date('now', '-' || ? || ' days')
        AND fecha_cierre IS NOT NULL
      GROUP BY fecha_cierre
      ORDER BY fecha_cierre
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener evolución"},500)}});ne.get("/distribucion",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT 
        d.area,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.area
    `).all();return e.json({success:!0,data:t.results})}catch{return e.json({success:!1,error:"Error al obtener distribución"},500)}});ne.get("/reporte",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_tareas,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado IN ('pendiente', 'en_progreso') THEN 1 END) as pendientes,
        COUNT(DISTINCT decreto_id) as total_decretos
      FROM acciones
    `).first(),r=await e.env.DB.prepare(`
      SELECT 
        d.titulo,
        d.area,
        d.sueno_meta,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas,
        CASE 
          WHEN COUNT(a.id) > 0 
          THEN ROUND((COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) * 100.0) / COUNT(a.id))
          ELSE 0 
        END as progreso
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.id, d.titulo, d.area, d.sueno_meta
      ORDER BY progreso DESC
    `).all(),a=await e.env.DB.prepare(`
      SELECT 
        a.titulo,
        a.fecha_cierre,
        d.titulo as decreto_titulo,
        d.area,
        s.resultados_obtenidos
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN seguimientos s ON a.id = s.accion_id
      WHERE a.estado = 'completada'
      ORDER BY a.fecha_cierre DESC
      LIMIT 10
    `).all(),s=await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first(),n=new Date().toISOString().split("T")[0],o=(t==null?void 0:t.total_tareas)>0?Math.round(((t==null?void 0:t.completadas)||0)/t.total_tareas*100):0;return e.json({success:!0,data:{fecha_reporte:n,usuario:s||{nombre_usuario:"Usuario",frase_vida:""},metricas:{...t,progreso_global:o},decretos:r.results,ultimos_logros:a.results}})}catch{return e.json({success:!1,error:"Error al generar reporte"},500)}});ne.get("/estadisticas",async e=>{try{const t=await e.env.DB.prepare("SELECT AVG(calificacion) as promedio FROM acciones WHERE calificacion IS NOT NULL").first(),r=await e.env.DB.prepare(`
      SELECT 
        tipo,
        COUNT(*) as cantidad,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas
      FROM acciones
      GROUP BY tipo
    `).all(),a=await e.env.DB.prepare(`
      SELECT 
        fecha_cierre,
        COUNT(*) as tareas_completadas
      FROM acciones
      WHERE estado = 'completada' AND fecha_cierre IS NOT NULL
      GROUP BY fecha_cierre
      ORDER BY tareas_completadas DESC
      LIMIT 5
    `).all();return e.json({success:!0,data:{promedio_calificacion:(t==null?void 0:t.promedio)||0,por_tipo:r.results,dias_mas_productivos:a.results}})}catch{return e.json({success:!1,error:"Error al obtener estadísticas"},500)}});const A=new Ee;A.get("/rutinas",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT * FROM rutinas_matutinas 
      WHERE activa = 1 
      ORDER BY orden_display ASC
    `).all(),r=e.req.query("fecha_simulada"),a=r||new Date().toISOString().split("T")[0];console.log(`📅 Verificando rutinas para fecha: ${a}${r?" (SIMULADA)":""}`);const s=[];for(const n of t.results){const o=await e.env.DB.prepare(`
        SELECT * FROM rutinas_completadas 
        WHERE rutina_id = ? AND fecha_completada = ?
      `).bind(n.id,a).first();s.push({...n,completada_hoy:!!o,detalle_hoy:o||null})}return e.json({success:!0,data:s})}catch{return e.json({success:!1,error:"Error al obtener rutinas"},500)}});A.post("/rutinas/:id/completar",async e=>{try{const t=e.req.param("id"),{tiempo_invertido:r,notas:a}=await e.req.json(),s=new Date().toISOString().split("T")[0];return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas)
      VALUES (?, ?, ?, ?)
    `).bind(t,s,r||null,a||"").run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al completar rutina"},500)}});A.delete("/rutinas/:id/completar",async e=>{try{const t=e.req.param("id"),r=new Date().toISOString().split("T")[0];return await e.env.DB.prepare(`
      DELETE FROM rutinas_completadas 
      WHERE rutina_id = ? AND fecha_completada = ?
    `).bind(t,r).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al desmarcar rutina"},500)}});A.get("/rutinas/progreso",async e=>{try{const{dias:t=7}=e.req.query(),r=await e.env.DB.prepare(`
      SELECT 
        rm.nombre,
        rm.icono,
        COUNT(rc.id) as dias_completados,
        ? as dias_totales,
        ROUND((COUNT(rc.id) * 100.0) / ?, 1) as porcentaje_completado
      FROM rutinas_matutinas rm
      LEFT JOIN rutinas_completadas rc ON rm.id = rc.rutina_id
        AND rc.fecha_completada >= date('now', '-' || ? || ' days')
      WHERE rm.activa = 1
      GROUP BY rm.id, rm.nombre, rm.icono
      ORDER BY porcentaje_completado DESC
    `).bind(t,t,t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener progreso de rutinas"},500)}});A.get("/rutinas/progreso-dia",async e=>{try{const t=new Date().toISOString().split("T")[0],r=await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(),a=await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(t).first(),s=(r==null?void 0:r.total)||0,n=(a==null?void 0:a.completadas)||0,o=s>0?Math.round(n/s*100):0;return e.json({success:!0,data:{total_rutinas:s,completadas_hoy:n,porcentaje_progreso:o,fecha:t}})}catch{return e.json({success:!1,error:"Error al obtener progreso del día"},500)}});A.get("/rutinas/progreso-dia/:fecha",async e=>{try{const t=e.req.param("fecha")||new Date().toISOString().split("T")[0],r=await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(),a=await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(t).first(),s=(r==null?void 0:r.total)||0,n=(a==null?void 0:a.completadas)||0,o=s>0?Math.round(n/s*100):0;return e.json({success:!0,data:{total_rutinas:s,completadas_hoy:n,porcentaje_progreso:o,fecha:t}})}catch{return e.json({success:!1,error:"Error al obtener progreso del día"},500)}});A.get("/afirmaciones",async e=>{try{const{categoria:t,favoritas:r}=e.req.query();let a="SELECT * FROM afirmaciones WHERE 1=1";const s=[];t&&t!=="todas"&&(a+=" AND categoria = ?",s.push(t)),r==="true"&&(a+=" AND es_favorita = 1"),a+=" ORDER BY es_favorita DESC, veces_usada DESC, created_at DESC";const n=await e.env.DB.prepare(a).bind(...s).all();return e.json({success:!0,data:n.results})}catch{return e.json({success:!1,error:"Error al obtener afirmaciones"},500)}});A.post("/afirmaciones",async e=>{try{const{texto:t,categoria:r}=await e.req.json();if(!t||!r)return e.json({success:!1,error:"Texto y categoría son requeridos"},400);const a=await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(t,r).run();return e.json({success:!0,id:a.meta.last_row_id})}catch{return e.json({success:!1,error:"Error al crear afirmación"},500)}});A.put("/afirmaciones/:id/favorita",async e=>{try{const t=e.req.param("id"),{es_favorita:r}=await e.req.json();return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        es_favorita = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(r?1:0,t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al actualizar favorita"},500)}});A.post("/afirmaciones/:id/usar",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        veces_usada = veces_usada + 1,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al marcar como usada"},500)}});A.delete("/afirmaciones/:id",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare("DELETE FROM afirmaciones WHERE id = ?").bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar afirmación"},500)}});A.get("/afirmaciones/del-dia",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 1 
      ORDER BY RANDOM() 
      LIMIT 2
    `).all(),r=await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 0 
      ORDER BY RANDOM() 
      LIMIT 3
    `).all(),a=[...t.results,...r.results];return e.json({success:!0,data:a})}catch{return e.json({success:!1,error:"Error al obtener afirmaciones del día"},500)}});A.post("/afirmaciones/generar",async e=>{try{const{categoria:t="general"}=await e.req.json(),r={empresarial:["Soy un líder natural que inspira confianza y respeto en mi equipo","Mis ideas innovadoras transforman mi empresa y generan abundantes resultados","Tengo la capacidad de tomar decisiones sabias que impulsan mi éxito empresarial","Mi negocio crece exponencialmente mientras mantengo mi integridad y valores","Soy un imán para las oportunidades de negocio perfectas en el momento ideal","Mi visión empresarial se materializa con facilidad y genera impacto positivo","Lidero con sabiduría y compasión, creando un ambiente de trabajo próspero","Mis habilidades de comunicación abren puertas a alianzas estratégicas valiosas"],material:["La abundancia fluye hacia mí desde múltiples fuentes de manera constante","Soy un canal abierto para recibir prosperidad en todas sus formas","Mi relación con el dinero es saludable, positiva y equilibrada","Tengo todo lo que necesito y más para vivir una vida plena y próspera","Las oportunidades de generar ingresos aparecen naturalmente en mi camino","Merece vivir en abundancia y celebro cada manifestación de prosperidad","Mi valor y talento se compensan generosamente en el mercado","Creo riqueza mientras contribuyo positivamente al bienestar de otros"],humano:["Soy digno/a de amor incondicional y atraigo relaciones armoniosas a mi vida","Mi corazón está abierto para dar y recibir amor en todas sus formas","Cultivo relaciones basadas en el respeto mutuo, la comprensión y la alegría","Me rodeo de personas que me apoyan y celebran mi crecimiento personal","Comunico mis sentimientos con claridad, compasión y autenticidad","Mi presencia inspira calma, alegría y confianza en quienes me rodean","Perdono fácilmente y libero cualquier resentimiento que no me sirve","Cada día fortalezco los vínculos importantes en mi vida con amor y gratitud"],general:["Cada día me convierto en la mejor versión de mí mismo/a con alegría y gratitud","Confío plenamente en mi sabiduría interior para guiar mis decisiones","Soy resiliente y transformo cada desafío en una oportunidad de crecimiento","Mi vida está llena de propósito, significado y experiencias enriquecedoras","Irradio paz, amor y luz positiva donde quiera que vaya","Soy el/la arquitecto/a consciente de mi realidad y creo con intención clara","Mi mente es clara, mi corazón está abierto y mi espíritu es libre","Celebro mis logros y aprendo valiosas lecciones de cada experiencia"]},a=r[t]||r.general,s=a[Math.floor(Math.random()*a.length)],n=await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(s,t).run(),o=await e.env.DB.prepare(`
      SELECT * FROM afirmaciones WHERE rowid = ?
    `).bind(n.meta.last_row_id).first();return e.json({success:!0,data:o})}catch(t){return console.error("Error al generar afirmación:",t),e.json({success:!1,error:"Error al generar afirmación"},500)}});A.get("/rutinas/:id/preguntas",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare(`
      SELECT * FROM rutinas_preguntas 
      WHERE rutina_id = ? AND activa = 1
      ORDER BY orden ASC
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener preguntas de rutina"},500)}});A.post("/rutinas/:id/completar-detallado",async e=>{try{const t=e.req.param("id"),{tiempo_invertido:r,notas:a,respuestas:s,estado_animo_antes:n,estado_animo_despues:o,calidad_percibida:i,ubicacion:c}=await e.req.json(),l=new Date().toISOString().split("T")[0],d=new Date().toISOString();return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas, respuestas_json, 
       estado_animo_antes, estado_animo_despues, calidad_percibida, ubicacion, 
       tiempo_inicio, tiempo_fin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(t,l,r||null,a||"",JSON.stringify(s||{}),n||null,o||null,i||null,c||null,d,new Date().toISOString()).run(),await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_estadisticas_diarias 
      (fecha, rutinas_completadas, rutinas_totales, porcentaje_completado, tiempo_total_minutos)
      SELECT 
        ?,
        COUNT(DISTINCT rc.rutina_id) as completadas,
        (SELECT COUNT(*) FROM rutinas_matutinas WHERE activa = 1) as totales,
        ROUND((COUNT(DISTINCT rc.rutina_id) * 100.0) / 
              (SELECT COUNT(*) FROM rutinas_matutinas WHERE activa = 1), 2) as porcentaje,
        COALESCE(SUM(rc.tiempo_invertido), 0) as tiempo_total
      FROM rutinas_completadas rc
      WHERE rc.fecha_completada = ?
    `).bind(l,l).run(),e.json({success:!0})}catch(t){return console.error("Error al completar rutina detallada:",t),e.json({success:!1,error:"Error al completar rutina"},500)}});A.get("/rutinas/analytics",async e=>{try{const{dias:t=30}=e.req.query(),r=await e.env.DB.prepare(`
      SELECT 
        rm.nombre,
        rm.icono,
        COUNT(rc.id) as veces_completada,
        AVG(rc.tiempo_invertido) as tiempo_promedio,
        AVG(rc.calidad_percibida) as calidad_promedio,
        AVG(rc.estado_animo_despues) as animo_promedio_despues
      FROM rutinas_matutinas rm
      LEFT JOIN rutinas_completadas rc ON rm.id = rc.rutina_id
        AND rc.fecha_completada >= date('now', '-' || ? || ' days')
      WHERE rm.activa = 1
      GROUP BY rm.id, rm.nombre, rm.icono
      ORDER BY veces_completada DESC
    `).bind(t).all(),a=await e.env.DB.prepare(`
      SELECT 
        fecha,
        rutinas_completadas,
        rutinas_totales,
        porcentaje_completado,
        tiempo_total_minutos
      FROM rutinas_estadisticas_diarias
      WHERE fecha >= date('now', '-' || ? || ' days')
      ORDER BY fecha DESC
    `).bind(t).all(),s=await e.env.DB.prepare(`
      WITH fechas_consecutivas AS (
        SELECT fecha, 
               LAG(fecha) OVER (ORDER BY fecha DESC) as fecha_anterior
        FROM rutinas_estadisticas_diarias
        WHERE fecha <= date('now') 
          AND rutinas_completadas > 0
        ORDER BY fecha DESC
      )
      SELECT COUNT(*) as racha
      FROM fechas_consecutivas
      WHERE fecha_anterior IS NULL 
         OR date(fecha, '+1 day') = fecha_anterior
         OR fecha = date('now')
    `).first();return e.json({success:!0,data:{tendencias_por_rutina:r.results,progreso_diario:a.results,racha_actual:(s==null?void 0:s.racha)||0,resumen:{dias_analizados:t,fecha_inicio:new Date(Date.now()-t*24*60*60*1e3).toISOString().split("T")[0],fecha_fin:new Date().toISOString().split("T")[0]}}})}catch(t){return console.error("Error al obtener analytics:",t),e.json({success:!1,error:"Error al obtener analytics"},500)}});A.get("/rutinas/progreso-dia/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM rutinas_matutinas
      WHERE activa = 1
    `).first(),a=await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas
      FROM rutinas_completadas
      WHERE fecha_completada = ?
    `).bind(t).first(),s=(r==null?void 0:r.total)||0,n=(a==null?void 0:a.completadas)||0,o=s>0?Math.round(n/s*100):0;return e.json({success:!0,data:{fecha:t,total_rutinas:s,rutinas_completadas:n,rutinas_pendientes:s-n,porcentaje_progreso:o}})}catch{return e.json({success:!1,error:"Error al obtener progreso del día"},500)}});A.get("/estadisticas",async e=>{try{const t=await e.env.DB.prepare(`
      WITH RECURSIVE fecha_serie AS (
        SELECT date('now') as fecha
        UNION ALL
        SELECT date(fecha, '-1 day')
        FROM fecha_serie
        WHERE fecha >= date('now', '-30 days')
      ),
      dias_con_rutinas AS (
        SELECT DISTINCT fecha_completada
        FROM rutinas_completadas
        WHERE fecha_completada >= date('now', '-30 days')
      )
      SELECT COUNT(*) as racha
      FROM fecha_serie fs
      WHERE fs.fecha IN (SELECT fecha_completada FROM dias_con_rutinas)
      AND NOT EXISTS (
        SELECT 1 FROM fecha_serie fs2
        WHERE fs2.fecha > fs.fecha 
        AND fs2.fecha NOT IN (SELECT fecha_completada FROM dias_con_rutinas)
      )
    `).first(),r=await e.env.DB.prepare(`
      SELECT categoria, COUNT(*) as cantidad
      FROM afirmaciones
      GROUP BY categoria
      ORDER BY cantidad DESC
    `).all(),a=await e.env.DB.prepare(`
      SELECT 
        rm.nombre,
        rm.icono,
        COUNT(rc.id) as veces_completada
      FROM rutinas_matutinas rm
      LEFT JOIN rutinas_completadas rc ON rm.id = rc.rutina_id
      WHERE rm.activa = 1
      GROUP BY rm.id, rm.nombre, rm.icono
      ORDER BY veces_completada DESC
      LIMIT 1
    `).first(),s=await e.env.DB.prepare(`
      SELECT 
        fecha_completada,
        COUNT(DISTINCT rutina_id) as rutinas_completadas
      FROM rutinas_completadas
      WHERE fecha_completada >= date('now', '-7 days')
      GROUP BY fecha_completada
      ORDER BY fecha_completada
    `).all();return e.json({success:!0,data:{racha_actual:(t==null?void 0:t.racha)||0,afirmaciones_por_categoria:r.results,rutina_mas_completada:a,progreso_semanal:s.results}})}catch{return e.json({success:!1,error:"Error al obtener estadísticas"},500)}});var Cs=/^[\w!#$%&'*.^`|~+-]+$/,Ds=/^[ !#-:<-[\]-~]*$/,As=(e,t)=>{if(e.indexOf(t)===-1)return{};const r=e.trim().split(";"),a={};for(let s of r){s=s.trim();const n=s.indexOf("=");if(n===-1)continue;const o=s.substring(0,n).trim();if(t!==o||!Cs.test(o))continue;let i=s.substring(n+1).trim();if(i.startsWith('"')&&i.endsWith('"')&&(i=i.slice(1,-1)),Ds.test(i)){a[o]=i.indexOf("%")!==-1?lt(i,It):i;break}}return a},js=(e,t,r={})=>{let a=`${e}=${t}`;if(e.startsWith("__Secure-")&&!r.secure)throw new Error("__Secure- Cookie must have Secure attributes");if(e.startsWith("__Host-")){if(!r.secure)throw new Error("__Host- Cookie must have Secure attributes");if(r.path!=="/")throw new Error('__Host- Cookie must have Path attributes with "/"');if(r.domain)throw new Error("__Host- Cookie must not have Domain attributes")}if(r&&typeof r.maxAge=="number"&&r.maxAge>=0){if(r.maxAge>3456e4)throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");a+=`; Max-Age=${r.maxAge|0}`}if(r.domain&&r.prefix!=="host"&&(a+=`; Domain=${r.domain}`),r.path&&(a+=`; Path=${r.path}`),r.expires){if(r.expires.getTime()-Date.now()>3456e7)throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");a+=`; Expires=${r.expires.toUTCString()}`}if(r.httpOnly&&(a+="; HttpOnly"),r.secure&&(a+="; Secure"),r.sameSite&&(a+=`; SameSite=${r.sameSite.charAt(0).toUpperCase()+r.sameSite.slice(1)}`),r.priority&&(a+=`; Priority=${r.priority.charAt(0).toUpperCase()+r.priority.slice(1)}`),r.partitioned){if(!r.secure)throw new Error("Partitioned Cookie must have Secure attributes");a+="; Partitioned"}return a},yt=(e,t,r)=>(t=encodeURIComponent(t),js(e,t,r)),Lt=(e,t,r)=>{const a=e.req.raw.headers.get("Cookie");{if(!a)return;let s=t;return As(a,s)[s]}},Is=(e,t,r)=>{let a;return(r==null?void 0:r.prefix)==="secure"?a=yt("__Secure-"+e,t,{path:"/",...r,secure:!0}):(r==null?void 0:r.prefix)==="host"?a=yt("__Host-"+e,t,{...r,path:"/",secure:!0,domain:void 0}):a=yt(e,t,{path:"/",...r}),a},Yr=(e,t,r,a)=>{const s=Is(t,r,a);e.header("Set-Cookie",s,{append:!0})};const me=new Ee,le={generateToken(){return Math.random().toString(36).substr(2)+Date.now().toString(36)},verifyPassword(e,t){return e===t},hashPassword(e){return"$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"},isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)},async createSession(e,t,r){const a=this.generateToken(),s=new Date,n=r?30*24:24;return s.setHours(s.getHours()+n),await e.prepare(`
      INSERT INTO auth_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `).bind(t,a,s.toISOString()).run(),a},async validateSession(e,t){const r=await e.prepare(`
      SELECT s.*, u.id, u.email, u.name, u.is_active
      FROM auth_sessions s
      JOIN auth_users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(t).first();return!r||!r.is_active?null:{id:r.id,email:r.email,name:r.name,password_hash:"",is_active:r.is_active,last_login:r.last_login}},async cleanExpiredSessions(e){await e.prepare(`
      DELETE FROM auth_sessions 
      WHERE expires_at <= datetime('now')
    `).run()}};me.post("/register",async e=>{try{const{name:t,email:r,password:a}=await e.req.json();if(!t||!r||!a)return e.json({error:"Nombre, email y contraseña son requeridos"},400);if(!le.isValidEmail(r))return e.json({error:"Formato de email inválido"},400);if(a.length<6)return e.json({error:"La contraseña debe tener al menos 6 caracteres"},400);if(await e.env.DB.prepare(`
      SELECT id FROM auth_users WHERE email = ?
    `).bind(r).first())return e.json({error:"Ya existe una cuenta con este email"},409);const n=await e.env.DB.prepare(`
      INSERT INTO auth_users (email, password_hash, name, is_active)
      VALUES (?, ?, ?, 1)
    `).bind(r,a,t).run();return n.success?e.json({success:!0,message:"Cuenta creada exitosamente",user:{id:n.meta.last_row_id,email:r,name:t}}):e.json({error:"Error al crear la cuenta"},500)}catch(t){return console.error("Error en registro:",t),e.json({error:"Error interno del servidor"},500)}});me.post("/login",async e=>{try{const{email:t,password:r,remember:a=!1}=await e.req.json();if(!t||!r)return e.json({error:"Email y contraseña son requeridos"},400);if(!le.isValidEmail(t))return e.json({error:"Formato de email inválido"},400);const s=await e.env.DB.prepare(`
      SELECT id, email, name, password_hash, is_active, last_login
      FROM auth_users 
      WHERE email = ?
    `).bind(t).first();if(!s||!s.is_active)return e.json({error:"Credenciales incorrectas"},401);if(!le.verifyPassword(r,s.password_hash))return e.json({error:"Credenciales incorrectas"},401);await e.env.DB.prepare(`
      UPDATE auth_users 
      SET last_login = datetime('now')
      WHERE id = ?
    `).bind(s.id).run();const n=await le.createSession(e.env.DB,s.id,a);return await le.cleanExpiredSessions(e.env.DB),a&&Yr(e,"yo-decreto-token",n,{maxAge:30*24*60*60,httpOnly:!1,secure:!1,sameSite:"Lax"}),e.json({success:!0,token:n,user:{id:s.id,email:s.email,name:s.name,last_login:s.last_login}})}catch(t){return console.error("Error en login:",t),e.json({error:"Error interno del servidor"},500)}});me.get("/validate",async e=>{try{const t=e.req.header("Authorization"),r=Lt(e,"yo-decreto-token");let a=null;if(t&&t.startsWith("Bearer ")?a=t.substring(7):r&&(a=r),!a)return e.json({error:"Token no proporcionado"},401);const s=await le.validateSession(e.env.DB,a);return s?e.json({success:!0,user:{id:s.id,email:s.email,name:s.name,last_login:s.last_login}}):e.json({error:"Sesión inválida o expirada"},401)}catch(t){return console.error("Error validando sesión:",t),e.json({error:"Error interno del servidor"},500)}});me.post("/logout",async e=>{try{const t=e.req.header("Authorization"),r=Lt(e,"yo-decreto-token");let a=null;return t&&t.startsWith("Bearer ")?a=t.substring(7):r&&(a=r),a&&(await e.env.DB.prepare(`
        DELETE FROM auth_sessions 
        WHERE session_token = ?
      `).bind(a).run(),Yr(e,"yo-decreto-token","",{maxAge:0})),e.json({success:!0,message:"Sesión cerrada correctamente"})}catch(t){return console.error("Error en logout:",t),e.json({error:"Error interno del servidor"},500)}});me.get("/me",async e=>{try{const t=e.req.header("Authorization"),r=Lt(e,"yo-decreto-token");let a=null;if(t&&t.startsWith("Bearer ")?a=t.substring(7):r&&(a=r),!a)return e.json({error:"Token no proporcionado"},401);const s=await le.validateSession(e.env.DB,a);return s?e.json({success:!0,user:{id:s.id,email:s.email,name:s.name,last_login:s.last_login}}):e.json({error:"Sesión inválida"},401)}catch(t){return console.error("Error obteniendo usuario:",t),e.json({error:"Error interno del servidor"},500)}});me.get("/stats",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN expires_at > datetime('now') THEN 1 END) as active_sessions,
        COUNT(CASE WHEN expires_at <= datetime('now') THEN 1 END) as expired_sessions
      FROM auth_sessions
    `).first(),r=await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users
      FROM auth_users
    `).first();return e.json({success:!0,stats:{sessions:t,users:r}})}catch(t){return console.error("Error obteniendo estadísticas:",t),e.json({error:"Error interno del servidor"},500)}});const W=new Ee;W.use(Ns);W.use("/api/*",Wa());W.use("/static/*",Qa());W.route("/api/auth",me);W.route("/api/decretos",I);W.route("/api/agenda",H);W.route("/api/progreso",ne);W.route("/api/practica",A);W.get("/",e=>e.render(S("div",{children:S("div",{id:"app",children:S("div",{className:"loading-screen",children:[S("img",{src:"/static/logo-yo-decreto.png",alt:"Yo Decreto",className:"logo-yo-decreto logo-lg w-auto mx-auto mb-4"}),S("div",{className:"loader"}),S("h2",{children:"Cargando..."})]})})})));W.get("*",e=>e.render(S("div",{children:S("div",{id:"app",children:S("div",{className:"loading-screen",children:[S("img",{src:"/static/logo-yo-decreto.png",alt:"Yo Decreto",className:"logo-yo-decreto logo-lg w-auto mx-auto mb-4"}),S("div",{className:"loader"}),S("h2",{children:"Cargando..."})]})})})));const tr=new Ee,Ms=Object.assign({"/src/index.tsx":W});let Jr=!1;for(const[,e]of Object.entries(Ms))e&&(tr.route("/",e),tr.notFound(e.notFoundHandler),Jr=!0);if(!Jr)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{tr as default};
