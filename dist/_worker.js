var sr=Object.defineProperty;var Gt=e=>{throw TypeError(e)};var nr=(e,t,a)=>t in e?sr(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a;var y=(e,t,a)=>nr(e,typeof t!="symbol"?t+"":t,a),Et=(e,t,a)=>t.has(e)||Gt("Cannot "+a);var f=(e,t,a)=>(Et(e,t,"read from private field"),a?a.call(e):t.get(e)),O=(e,t,a)=>t.has(e)?Gt("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,a),T=(e,t,a,r)=>(Et(e,t,"write to private field"),r?r.call(e,a):t.set(e,a),a),b=(e,t,a)=>(Et(e,t,"access private method"),a);var zt=(e,t,a,r)=>({set _(o){T(e,t,o,a)},get _(){return f(e,t,r)}});var Ta={Stringify:1},B=(e,t)=>{const a=new String(e);return a.isEscaped=!0,a.callbacks=t,a},ir=/[&<>'"]/,Sa=async(e,t)=>{let a="";t||(t=[]);const r=await Promise.all(e);for(let o=r.length-1;a+=r[o],o--,!(o<0);o--){let s=r[o];typeof s=="object"&&t.push(...s.callbacks||[]);const n=s.isEscaped;if(s=await(typeof s=="object"?s.toString():s),typeof s=="object"&&t.push(...s.callbacks||[]),s.isEscaped??n)a+=s;else{const i=[a];ce(s,i),a=i[0]}}return B(a,t)},ce=(e,t)=>{const a=e.search(ir);if(a===-1){t[0]+=e;return}let r,o,s=0;for(o=a;o<e.length;o++){switch(e.charCodeAt(o)){case 34:r="&quot;";break;case 39:r="&#39;";break;case 38:r="&amp;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}t[0]+=e.substring(s,o)+r,s=o+1}t[0]+=e.substring(s,o)},Ra=e=>{const t=e.callbacks;if(!(t!=null&&t.length))return e;const a=[e],r={};return t.forEach(o=>o({phase:Ta.Stringify,buffer:a,context:r})),a[0]},wa=async(e,t,a,r,o)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const s=e.callbacks;return s!=null&&s.length?(o?o[0]+=e:o=[e],Promise.all(s.map(i=>i({phase:t,buffer:o,context:r}))).then(i=>Promise.all(i.filter(Boolean).map(c=>wa(c,t,!1,r,o))).then(()=>o[0]))):Promise.resolve(e)},cr=(e,...t)=>{const a=[""];for(let r=0,o=e.length-1;r<o;r++){a[0]+=e[r];const s=Array.isArray(t[r])?t[r].flat(1/0):[t[r]];for(let n=0,i=s.length;n<i;n++){const c=s[n];if(typeof c=="string")ce(c,a);else if(typeof c=="number")a[0]+=c;else{if(typeof c=="boolean"||c===null||c===void 0)continue;if(typeof c=="object"&&c.isEscaped)if(c.callbacks)a.unshift("",c);else{const l=c.toString();l instanceof Promise?a.unshift("",l):a[0]+=l}else c instanceof Promise?a.unshift("",c):ce(c.toString(),a)}}}return a[0]+=e.at(-1),a.length===1?"callbacks"in a?B(Ra(B(a[0],a.callbacks))):B(a[0]):Sa(a,a.callbacks)},xt=Symbol("RENDERER"),bt=Symbol("ERROR_HANDLER"),N=Symbol("STASH"),Oa=Symbol("INTERNAL"),lr=Symbol("MEMO"),it=Symbol("PERMALINK"),Vt=e=>(e[Oa]=!0,e),Ca=e=>({value:t,children:a})=>{if(!a)return;const r={children:[{tag:Vt(()=>{e.push(t)}),props:{}}]};Array.isArray(a)?r.children.push(...a.flat()):r.children.push(a),r.children.push({tag:Vt(()=>{e.pop()}),props:{}});const o={tag:"",props:r,type:""};return o[bt]=s=>{throw e.pop(),s},o},ba=e=>{const t=[e],a=Ca(t);return a.values=t,a.Provider=a,Ne.push(a),a},Ne=[],Lt=e=>{const t=[e],a=r=>{t.push(r.value);let o;try{o=r.children?(Array.isArray(r.children)?new ja("",{},r.children):r.children).toString():""}finally{t.pop()}return o instanceof Promise?o.then(s=>B(s,s.callbacks)):B(o)};return a.values=t,a.Provider=a,a[xt]=Ca(t),Ne.push(a),a},Ie=e=>e.values.at(-1),Qe={title:[],script:["src"],style:["data-href"],link:["href"],meta:["name","httpEquiv","charset","itemProp"]},Dt={},et="data-precedence",ze=e=>Array.isArray(e)?e:[e],Yt=new WeakMap,Jt=(e,t,a,r)=>({buffer:o,context:s})=>{if(!o)return;const n=Yt.get(s)||{};Yt.set(s,n);const i=n[e]||(n[e]=[]);let c=!1;const l=Qe[e];if(l.length>0){e:for(const[,d]of i)for(const u of l)if(((d==null?void 0:d[u])??null)===(a==null?void 0:a[u])){c=!0;break e}}if(c?o[0]=o[0].replaceAll(t,""):l.length>0?i.push([t,a,r]):i.unshift([t,a,r]),o[0].indexOf("</head>")!==-1){let d;if(r===void 0)d=i.map(([u])=>u);else{const u=[];d=i.map(([p,,m])=>{let g=u.indexOf(m);return g===-1&&(u.push(m),g=u.length-1),[p,g]}).sort((p,m)=>p[1]-m[1]).map(([p])=>p)}d.forEach(u=>{o[0]=o[0].replaceAll(u,"")}),o[0]=o[0].replace(/(?=<\/head>)/,d.join(""))}},Ve=(e,t,a)=>B(new V(e,a,ze(t??[])).toString()),Ye=(e,t,a,r)=>{if("itemProp"in a)return Ve(e,t,a);let{precedence:o,blocking:s,...n}=a;o=r?o??"":void 0,r&&(n[et]=o);const i=new V(e,n,ze(t||[])).toString();return i instanceof Promise?i.then(c=>B(i,[...c.callbacks||[],Jt(e,c,n,o)])):B(i,[Jt(e,i,n,o)])},dr=({children:e,...t})=>{const a=Mt();if(a){const r=Ie(a);if(r==="svg"||r==="head")return new V("title",t,ze(e??[]))}return Ye("title",e,t,!1)},ur=({children:e,...t})=>{const a=Mt();return["src","async"].some(r=>!t[r])||a&&Ie(a)==="head"?Ve("script",e,t):Ye("script",e,t,!1)},pr=({children:e,...t})=>["href","precedence"].every(a=>a in t)?(t["data-href"]=t.href,delete t.href,Ye("style",e,t,!0)):Ve("style",e,t),fr=({children:e,...t})=>["onLoad","onError"].some(a=>a in t)||t.rel==="stylesheet"&&(!("precedence"in t)||"disabled"in t)?Ve("link",e,t):Ye("link",e,t,"precedence"in t),mr=({children:e,...t})=>{const a=Mt();return a&&Ie(a)==="head"?Ve("meta",e,t):Ye("meta",e,t,!1)},Da=(e,{children:t,...a})=>new V(e,a,ze(t??[])),hr=e=>(typeof e.action=="function"&&(e.action=it in e.action?e.action[it]:void 0),Da("form",e)),Na=(e,t)=>(typeof t.formAction=="function"&&(t.formAction=it in t.formAction?t.formAction[it]:void 0),Da(e,t)),Er=e=>Na("input",e),gr=e=>Na("button",e);const gt=Object.freeze(Object.defineProperty({__proto__:null,button:gr,form:hr,input:Er,link:fr,meta:mr,script:ur,style:pr,title:dr},Symbol.toStringTag,{value:"Module"}));var _r=new Map([["className","class"],["htmlFor","for"],["crossOrigin","crossorigin"],["httpEquiv","http-equiv"],["itemProp","itemprop"],["fetchPriority","fetchpriority"],["noModule","nomodule"],["formAction","formaction"]]),ct=e=>_r.get(e)||e,Aa=(e,t)=>{for(const[a,r]of Object.entries(e)){const o=a[0]==="-"||!/[A-Z]/.test(a)?a:a.replace(/[A-Z]/g,s=>`-${s.toLowerCase()}`);t(o,r==null?null:typeof r=="number"?o.match(/^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/)?`${r}`:`${r}px`:r)}},He=void 0,Mt=()=>He,vr=e=>/[A-Z]/.test(e)&&e.match(/^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/)?e.replace(/([A-Z])/g,"-$1").toLowerCase():e,yr=["area","base","br","col","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"],Tr=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","download","formnovalidate","hidden","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"],Pt=(e,t)=>{for(let a=0,r=e.length;a<r;a++){const o=e[a];if(typeof o=="string")ce(o,t);else{if(typeof o=="boolean"||o===null||o===void 0)continue;o instanceof V?o.toStringToBuffer(t):typeof o=="number"||o.isEscaped?t[0]+=o:o instanceof Promise?t.unshift("",o):Pt(o,t)}}},V=class{constructor(e,t,a){y(this,"tag");y(this,"props");y(this,"key");y(this,"children");y(this,"isEscaped",!0);y(this,"localContexts");this.tag=e,this.props=t,this.children=a}get type(){return this.tag}get ref(){return this.props.ref||null}toString(){var t,a;const e=[""];(t=this.localContexts)==null||t.forEach(([r,o])=>{r.values.push(o)});try{this.toStringToBuffer(e)}finally{(a=this.localContexts)==null||a.forEach(([r])=>{r.values.pop()})}return e.length===1?"callbacks"in e?Ra(B(e[0],e.callbacks)).toString():e[0]:Sa(e,e.callbacks)}toStringToBuffer(e){const t=this.tag,a=this.props;let{children:r}=this;e[0]+=`<${t}`;const o=He&&Ie(He)==="svg"?s=>vr(ct(s)):s=>ct(s);for(let[s,n]of Object.entries(a))if(s=o(s),s!=="children"){if(s==="style"&&typeof n=="object"){let i="";Aa(n,(c,l)=>{l!=null&&(i+=`${i?";":""}${c}:${l}`)}),e[0]+=' style="',ce(i,e),e[0]+='"'}else if(typeof n=="string")e[0]+=` ${s}="`,ce(n,e),e[0]+='"';else if(n!=null)if(typeof n=="number"||n.isEscaped)e[0]+=` ${s}="${n}"`;else if(typeof n=="boolean"&&Tr.includes(s))n&&(e[0]+=` ${s}=""`);else if(s==="dangerouslySetInnerHTML"){if(r.length>0)throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");r=[B(n.__html)]}else if(n instanceof Promise)e[0]+=` ${s}="`,e.unshift('"',n);else if(typeof n=="function"){if(!s.startsWith("on")&&s!=="ref")throw new Error(`Invalid prop '${s}' of type 'function' supplied to '${t}'.`)}else e[0]+=` ${s}="`,ce(n.toString(),e),e[0]+='"'}if(yr.includes(t)&&r.length===0){e[0]+="/>";return}e[0]+=">",Pt(r,e),e[0]+=`</${t}>`}},_t=class extends V{toStringToBuffer(e){const{children:t}=this,a=this.tag.call(null,{...this.props,children:t.length<=1?t[0]:t});if(!(typeof a=="boolean"||a==null))if(a instanceof Promise)if(Ne.length===0)e.unshift("",a);else{const r=Ne.map(o=>[o,o.values.at(-1)]);e.unshift("",a.then(o=>(o instanceof V&&(o.localContexts=r),o)))}else a instanceof V?a.toStringToBuffer(e):typeof a=="number"||a.isEscaped?(e[0]+=a,a.callbacks&&(e.callbacks||(e.callbacks=[]),e.callbacks.push(...a.callbacks))):ce(a,e)}},ja=class extends V{toStringToBuffer(e){Pt(this.children,e)}},Kt=(e,t,...a)=>{t??(t={}),a.length&&(t.children=a.length===1?a[0]:a);const r=t.key;delete t.key;const o=tt(e,t,a);return o.key=r,o},Xt=!1,tt=(e,t,a)=>{if(!Xt){for(const r in Dt)gt[r][xt]=Dt[r];Xt=!0}return typeof e=="function"?new _t(e,t,a):gt[e]?new _t(gt[e],t,a):e==="svg"||e==="head"?(He||(He=Lt("")),new V(e,t,[new _t(He,{value:e},a)])):new V(e,t,a)},Sr=({children:e})=>new ja("",{children:e},Array.isArray(e)?e:e?[e]:[]);function R(e,t,a){let r;if(!t||!("children"in t))r=tt(e,t,[]);else{const o=t.children;r=Array.isArray(o)?tt(e,t,o):tt(e,t,[o])}return r.key=a,r}var Zt=(e,t,a)=>(r,o)=>{let s=-1;return n(0);async function n(i){if(i<=s)throw new Error("next() called multiple times");s=i;let c,l=!1,d;if(e[i]?(d=e[i][0][0],r.req.routeIndex=i):d=i===e.length&&o||void 0,d)try{c=await d(r,()=>n(i+1))}catch(u){if(u instanceof Error&&t)r.error=u,c=await t(u,r),l=!0;else throw u}else r.finalized===!1&&a&&(c=await a(r));return c&&(r.finalized===!1||l)&&(r.res=c),r}},Rr=Symbol(),wr=async(e,t=Object.create(null))=>{const{all:a=!1,dot:r=!1}=t,s=(e instanceof Pa?e.raw.headers:e.headers).get("Content-Type");return s!=null&&s.startsWith("multipart/form-data")||s!=null&&s.startsWith("application/x-www-form-urlencoded")?Or(e,{all:a,dot:r}):{}};async function Or(e,t){const a=await e.formData();return a?Cr(a,t):{}}function Cr(e,t){const a=Object.create(null);return e.forEach((r,o)=>{t.all||o.endsWith("[]")?br(a,o,r):a[o]=r}),t.dot&&Object.entries(a).forEach(([r,o])=>{r.includes(".")&&(Dr(a,r,o),delete a[r])}),a}var br=(e,t,a)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(a):e[t]=[e[t],a]:t.endsWith("[]")?e[t]=[a]:e[t]=a},Dr=(e,t,a)=>{let r=e;const o=t.split(".");o.forEach((s,n)=>{n===o.length-1?r[s]=a:((!r[s]||typeof r[s]!="object"||Array.isArray(r[s])||r[s]instanceof File)&&(r[s]=Object.create(null)),r=r[s])})},Ia=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Nr=e=>{const{groups:t,path:a}=Ar(e),r=Ia(a);return jr(r,t)},Ar=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(a,r)=>{const o=`@${r}`;return t.push([o,a]),o}),{groups:t,path:e}},jr=(e,t)=>{for(let a=t.length-1;a>=0;a--){const[r]=t[a];for(let o=e.length-1;o>=0;o--)if(e[o].includes(r)){e[o]=e[o].replace(r,t[a][1]);break}}return e},Xe={},Ir=(e,t)=>{if(e==="*")return"*";const a=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(a){const r=`${e}#${t}`;return Xe[r]||(a[2]?Xe[r]=t&&t[0]!==":"&&t[0]!=="*"?[r,a[1],new RegExp(`^${a[2]}(?=/${t})`)]:[e,a[1],new RegExp(`^${a[2]}$`)]:Xe[r]=[e,a[1],!0]),Xe[r]}return null},ut=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,a=>{try{return t(a)}catch{return a}})}},xr=e=>ut(e,decodeURI),xa=e=>{const t=e.url,a=t.indexOf("/",t.indexOf(":")+4);let r=a;for(;r<t.length;r++){const o=t.charCodeAt(r);if(o===37){const s=t.indexOf("?",r),n=t.slice(a,s===-1?void 0:s);return xr(n.includes("%25")?n.replace(/%25/g,"%2525"):n)}else if(o===63)break}return t.slice(a,r)},Lr=e=>{const t=xa(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},Te=(e,t,...a)=>(a.length&&(t=Te(t,...a)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),La=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),a=[];let r="";return t.forEach(o=>{if(o!==""&&!/\:/.test(o))r+="/"+o;else if(/\:/.test(o))if(/\?/.test(o)){a.length===0&&r===""?a.push("/"):a.push(r);const s=o.replace("?","");r+="/"+s,a.push(r)}else r+="/"+o}),a.filter((o,s,n)=>n.indexOf(o)===s)},vt=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?ut(e,Ht):e):e,Ma=(e,t,a)=>{let r;if(!a&&t&&!/[%+]/.test(t)){let n=e.indexOf(`?${t}`,8);for(n===-1&&(n=e.indexOf(`&${t}`,8));n!==-1;){const i=e.charCodeAt(n+t.length+1);if(i===61){const c=n+t.length+2,l=e.indexOf("&",c);return vt(e.slice(c,l===-1?void 0:l))}else if(i==38||isNaN(i))return"";n=e.indexOf(`&${t}`,n+1)}if(r=/[%+]/.test(e),!r)return}const o={};r??(r=/[%+]/.test(e));let s=e.indexOf("?",8);for(;s!==-1;){const n=e.indexOf("&",s+1);let i=e.indexOf("=",s);i>n&&n!==-1&&(i=-1);let c=e.slice(s+1,i===-1?n===-1?void 0:n:i);if(r&&(c=vt(c)),s=n,c==="")continue;let l;i===-1?l="":(l=e.slice(i+1,n===-1?void 0:n),r&&(l=vt(l))),a?(o[c]&&Array.isArray(o[c])||(o[c]=[]),o[c].push(l)):o[c]??(o[c]=l)}return t?o[t]:o},Mr=Ma,Pr=(e,t)=>Ma(e,t,!0),Ht=decodeURIComponent,Qt=e=>ut(e,Ht),we,q,te,Ha,Ua,Nt,ae,pa,Pa=(pa=class{constructor(e,t="/",a=[[]]){O(this,te);y(this,"raw");O(this,we);O(this,q);y(this,"routeIndex",0);y(this,"path");y(this,"bodyCache",{});O(this,ae,e=>{const{bodyCache:t,raw:a}=this,r=t[e];if(r)return r;const o=Object.keys(t)[0];return o?t[o].then(s=>(o==="json"&&(s=JSON.stringify(s)),new Response(s)[e]())):t[e]=a[e]()});this.raw=e,this.path=t,T(this,q,a),T(this,we,{})}param(e){return e?b(this,te,Ha).call(this,e):b(this,te,Ua).call(this)}query(e){return Mr(this.url,e)}queries(e){return Pr(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((a,r)=>{t[r]=a}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await wr(this,e))}json(){return f(this,ae).call(this,"text").then(e=>JSON.parse(e))}text(){return f(this,ae).call(this,"text")}arrayBuffer(){return f(this,ae).call(this,"arrayBuffer")}blob(){return f(this,ae).call(this,"blob")}formData(){return f(this,ae).call(this,"formData")}addValidatedData(e,t){f(this,we)[e]=t}valid(e){return f(this,we)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Rr](){return f(this,q)}get matchedRoutes(){return f(this,q)[0].map(([[,e]])=>e)}get routePath(){return f(this,q)[0].map(([[,e]])=>e)[this.routeIndex].path}},we=new WeakMap,q=new WeakMap,te=new WeakSet,Ha=function(e){const t=f(this,q)[0][this.routeIndex][1][e],a=b(this,te,Nt).call(this,t);return a&&/\%/.test(a)?Qt(a):a},Ua=function(){const e={},t=Object.keys(f(this,q)[0][this.routeIndex][1]);for(const a of t){const r=b(this,te,Nt).call(this,f(this,q)[0][this.routeIndex][1][a]);r!==void 0&&(e[a]=/\%/.test(r)?Qt(r):r)}return e},Nt=function(e){return f(this,q)[1]?f(this,q)[1][e]:e},ae=new WeakMap,pa),Hr="text/plain; charset=UTF-8",yt=(e,t)=>({"Content-Type":e,...t}),Be,$e,X,Oe,Z,U,ke,Ce,be,fe,Fe,We,re,Se,fa,Ur=(fa=class{constructor(e,t){O(this,re);O(this,Be);O(this,$e);y(this,"env",{});O(this,X);y(this,"finalized",!1);y(this,"error");O(this,Oe);O(this,Z);O(this,U);O(this,ke);O(this,Ce);O(this,be);O(this,fe);O(this,Fe);O(this,We);y(this,"render",(...e)=>(f(this,Ce)??T(this,Ce,t=>this.html(t)),f(this,Ce).call(this,...e)));y(this,"setLayout",e=>T(this,ke,e));y(this,"getLayout",()=>f(this,ke));y(this,"setRenderer",e=>{T(this,Ce,e)});y(this,"header",(e,t,a)=>{this.finalized&&T(this,U,new Response(f(this,U).body,f(this,U)));const r=f(this,U)?f(this,U).headers:f(this,fe)??T(this,fe,new Headers);t===void 0?r.delete(e):a!=null&&a.append?r.append(e,t):r.set(e,t)});y(this,"status",e=>{T(this,Oe,e)});y(this,"set",(e,t)=>{f(this,X)??T(this,X,new Map),f(this,X).set(e,t)});y(this,"get",e=>f(this,X)?f(this,X).get(e):void 0);y(this,"newResponse",(...e)=>b(this,re,Se).call(this,...e));y(this,"body",(e,t,a)=>b(this,re,Se).call(this,e,t,a));y(this,"text",(e,t,a)=>!f(this,fe)&&!f(this,Oe)&&!t&&!a&&!this.finalized?new Response(e):b(this,re,Se).call(this,e,t,yt(Hr,a)));y(this,"json",(e,t,a)=>b(this,re,Se).call(this,JSON.stringify(e),t,yt("application/json",a)));y(this,"html",(e,t,a)=>{const r=o=>b(this,re,Se).call(this,o,t,yt("text/html; charset=UTF-8",a));return typeof e=="object"?wa(e,Ta.Stringify,!1,{}).then(r):r(e)});y(this,"redirect",(e,t)=>{const a=String(e);return this.header("Location",/[^\x00-\xFF]/.test(a)?encodeURI(a):a),this.newResponse(null,t??302)});y(this,"notFound",()=>(f(this,be)??T(this,be,()=>new Response),f(this,be).call(this,this)));T(this,Be,e),t&&(T(this,Z,t.executionCtx),this.env=t.env,T(this,be,t.notFoundHandler),T(this,We,t.path),T(this,Fe,t.matchResult))}get req(){return f(this,$e)??T(this,$e,new Pa(f(this,Be),f(this,We),f(this,Fe))),f(this,$e)}get event(){if(f(this,Z)&&"respondWith"in f(this,Z))return f(this,Z);throw Error("This context has no FetchEvent")}get executionCtx(){if(f(this,Z))return f(this,Z);throw Error("This context has no ExecutionContext")}get res(){return f(this,U)||T(this,U,new Response(null,{headers:f(this,fe)??T(this,fe,new Headers)}))}set res(e){if(f(this,U)&&e){e=new Response(e.body,e);for(const[t,a]of f(this,U).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const r=f(this,U).headers.getSetCookie();e.headers.delete("set-cookie");for(const o of r)e.headers.append("set-cookie",o)}else e.headers.set(t,a)}T(this,U,e),this.finalized=!0}get var(){return f(this,X)?Object.fromEntries(f(this,X)):{}}},Be=new WeakMap,$e=new WeakMap,X=new WeakMap,Oe=new WeakMap,Z=new WeakMap,U=new WeakMap,ke=new WeakMap,Ce=new WeakMap,be=new WeakMap,fe=new WeakMap,Fe=new WeakMap,We=new WeakMap,re=new WeakSet,Se=function(e,t,a){const r=f(this,U)?new Headers(f(this,U).headers):f(this,fe)??new Headers;if(typeof t=="object"&&"headers"in t){const s=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[n,i]of s)n.toLowerCase()==="set-cookie"?r.append(n,i):r.set(n,i)}if(a)for(const[s,n]of Object.entries(a))if(typeof n=="string")r.set(s,n);else{r.delete(s);for(const i of n)r.append(s,i)}const o=typeof t=="number"?t:(t==null?void 0:t.status)??f(this,Oe);return new Response(e,{status:o,headers:r})},fa),A="ALL",qr="all",Br=["get","post","put","delete","options","patch"],qa="Can not add a route since the matcher is already built.",Ba=class extends Error{},$r="__COMPOSED_HANDLER",kr=e=>e.text("404 Not Found",404),ea=(e,t)=>{if("getResponse"in e){const a=e.getResponse();return t.newResponse(a.body,a)}return console.error(e),t.text("Internal Server Error",500)},W,j,ka,G,de,at,rt,ma,$a=(ma=class{constructor(t={}){O(this,j);y(this,"get");y(this,"post");y(this,"put");y(this,"delete");y(this,"options");y(this,"patch");y(this,"all");y(this,"on");y(this,"use");y(this,"router");y(this,"getPath");y(this,"_basePath","/");O(this,W,"/");y(this,"routes",[]);O(this,G,kr);y(this,"errorHandler",ea);y(this,"onError",t=>(this.errorHandler=t,this));y(this,"notFound",t=>(T(this,G,t),this));y(this,"fetch",(t,...a)=>b(this,j,rt).call(this,t,a[1],a[0],t.method));y(this,"request",(t,a,r,o)=>t instanceof Request?this.fetch(a?new Request(t,a):t,r,o):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${Te("/",t)}`,a),r,o)));y(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(b(this,j,rt).call(this,t.request,t,void 0,t.request.method))})});[...Br,qr].forEach(s=>{this[s]=(n,...i)=>(typeof n=="string"?T(this,W,n):b(this,j,de).call(this,s,f(this,W),n),i.forEach(c=>{b(this,j,de).call(this,s,f(this,W),c)}),this)}),this.on=(s,n,...i)=>{for(const c of[n].flat()){T(this,W,c);for(const l of[s].flat())i.map(d=>{b(this,j,de).call(this,l.toUpperCase(),f(this,W),d)})}return this},this.use=(s,...n)=>(typeof s=="string"?T(this,W,s):(T(this,W,"*"),n.unshift(s)),n.forEach(i=>{b(this,j,de).call(this,A,f(this,W),i)}),this);const{strict:r,...o}=t;Object.assign(this,o),this.getPath=r??!0?t.getPath??xa:Lr}route(t,a){const r=this.basePath(t);return a.routes.map(o=>{var n;let s;a.errorHandler===ea?s=o.handler:(s=async(i,c)=>(await Zt([],a.errorHandler)(i,()=>o.handler(i,c))).res,s[$r]=o.handler),b(n=r,j,de).call(n,o.method,o.path,s)}),this}basePath(t){const a=b(this,j,ka).call(this);return a._basePath=Te(this._basePath,t),a}mount(t,a,r){let o,s;r&&(typeof r=="function"?s=r:(s=r.optionHandler,r.replaceRequest===!1?o=c=>c:o=r.replaceRequest));const n=s?c=>{const l=s(c);return Array.isArray(l)?l:[l]}:c=>{let l;try{l=c.executionCtx}catch{}return[c.env,l]};o||(o=(()=>{const c=Te(this._basePath,t),l=c==="/"?0:c.length;return d=>{const u=new URL(d.url);return u.pathname=u.pathname.slice(l)||"/",new Request(u,d)}})());const i=async(c,l)=>{const d=await a(o(c.req.raw),...n(c));if(d)return d;await l()};return b(this,j,de).call(this,A,Te(t,"*"),i),this}},W=new WeakMap,j=new WeakSet,ka=function(){const t=new $a({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,T(t,G,f(this,G)),t.routes=this.routes,t},G=new WeakMap,de=function(t,a,r){t=t.toUpperCase(),a=Te(this._basePath,a);const o={basePath:this._basePath,path:a,method:t,handler:r};this.router.add(t,a,[r,o]),this.routes.push(o)},at=function(t,a){if(t instanceof Error)return this.errorHandler(t,a);throw t},rt=function(t,a,r,o){if(o==="HEAD")return(async()=>new Response(null,await b(this,j,rt).call(this,t,a,r,"GET")))();const s=this.getPath(t,{env:r}),n=this.router.match(o,s),i=new Ur(t,{path:s,matchResult:n,env:r,executionCtx:a,notFoundHandler:f(this,G)});if(n[0].length===1){let l;try{l=n[0][0][0][0](i,async()=>{i.res=await f(this,G).call(this,i)})}catch(d){return b(this,j,at).call(this,d,i)}return l instanceof Promise?l.then(d=>d||(i.finalized?i.res:f(this,G).call(this,i))).catch(d=>b(this,j,at).call(this,d,i)):l??f(this,G).call(this,i)}const c=Zt(n[0],this.errorHandler,f(this,G));return(async()=>{try{const l=await c(i);if(!l.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return l.res}catch(l){return b(this,j,at).call(this,l,i)}})()},ma),lt="[^/]+",Me=".*",Pe="(?:|/.*)",Re=Symbol(),Fr=new Set(".\\+*[^]$()");function Wr(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===Me||e===Pe?1:t===Me||t===Pe?-1:e===lt?1:t===lt?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var me,he,z,ha,At=(ha=class{constructor(){O(this,me);O(this,he);O(this,z,Object.create(null))}insert(t,a,r,o,s){if(t.length===0){if(f(this,me)!==void 0)throw Re;if(s)return;T(this,me,a);return}const[n,...i]=t,c=n==="*"?i.length===0?["","",Me]:["","",lt]:n==="/*"?["","",Pe]:n.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let l;if(c){const d=c[1];let u=c[2]||lt;if(d&&c[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw Re;if(l=f(this,z)[u],!l){if(Object.keys(f(this,z)).some(p=>p!==Me&&p!==Pe))throw Re;if(s)return;l=f(this,z)[u]=new At,d!==""&&T(l,he,o.varIndex++)}!s&&d!==""&&r.push([d,f(l,he)])}else if(l=f(this,z)[n],!l){if(Object.keys(f(this,z)).some(d=>d.length>1&&d!==Me&&d!==Pe))throw Re;if(s)return;l=f(this,z)[n]=new At}l.insert(i,a,r,o,s)}buildRegExpStr(){const a=Object.keys(f(this,z)).sort(Wr).map(r=>{const o=f(this,z)[r];return(typeof f(o,he)=="number"?`(${r})@${f(o,he)}`:Fr.has(r)?`\\${r}`:r)+o.buildRegExpStr()});return typeof f(this,me)=="number"&&a.unshift(`#${f(this,me)}`),a.length===0?"":a.length===1?a[0]:"(?:"+a.join("|")+")"}},me=new WeakMap,he=new WeakMap,z=new WeakMap,ha),dt,Ge,Ea,Gr=(Ea=class{constructor(){O(this,dt,{varIndex:0});O(this,Ge,new At)}insert(e,t,a){const r=[],o=[];for(let n=0;;){let i=!1;if(e=e.replace(/\{[^}]+\}/g,c=>{const l=`@\\${n}`;return o[n]=[l,c],n++,i=!0,l}),!i)break}const s=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let n=o.length-1;n>=0;n--){const[i]=o[n];for(let c=s.length-1;c>=0;c--)if(s[c].indexOf(i)!==-1){s[c]=s[c].replace(i,o[n][1]);break}}return f(this,Ge).insert(s,t,r,f(this,dt),a),r}buildRegExp(){let e=f(this,Ge).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const a=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(o,s,n)=>s!==void 0?(a[++t]=Number(s),"$()"):(n!==void 0&&(r[Number(n)]=++t),"")),[new RegExp(`^${e}`),a,r]}},dt=new WeakMap,Ge=new WeakMap,Ea),Fa=[],zr=[/^$/,[],Object.create(null)],ot=Object.create(null);function Wa(e){return ot[e]??(ot[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,a)=>a?`\\${a}`:"(?:|/.*)")}$`))}function Vr(){ot=Object.create(null)}function Yr(e){var l;const t=new Gr,a=[];if(e.length===0)return zr;const r=e.map(d=>[!/\*|\/:/.test(d[0]),...d]).sort(([d,u],[p,m])=>d?1:p?-1:u.length-m.length),o=Object.create(null);for(let d=0,u=-1,p=r.length;d<p;d++){const[m,g,h]=r[d];m?o[g]=[h.map(([_])=>[_,Object.create(null)]),Fa]:u++;let E;try{E=t.insert(g,u,m)}catch(_){throw _===Re?new Ba(g):_}m||(a[u]=h.map(([_,v])=>{const w=Object.create(null);for(v-=1;v>=0;v--){const[S,D]=E[v];w[S]=D}return[_,w]}))}const[s,n,i]=t.buildRegExp();for(let d=0,u=a.length;d<u;d++)for(let p=0,m=a[d].length;p<m;p++){const g=(l=a[d][p])==null?void 0:l[1];if(!g)continue;const h=Object.keys(g);for(let E=0,_=h.length;E<_;E++)g[h[E]]=i[g[h[E]]]}const c=[];for(const d in n)c[d]=a[n[d]];return[s,c,o]}function ve(e,t){if(e){for(const a of Object.keys(e).sort((r,o)=>o.length-r.length))if(Wa(a).test(t))return[...e[a]]}}var oe,se,je,Ga,za,ga,Jr=(ga=class{constructor(){O(this,je);y(this,"name","RegExpRouter");O(this,oe);O(this,se);T(this,oe,{[A]:Object.create(null)}),T(this,se,{[A]:Object.create(null)})}add(e,t,a){var i;const r=f(this,oe),o=f(this,se);if(!r||!o)throw new Error(qa);r[e]||[r,o].forEach(c=>{c[e]=Object.create(null),Object.keys(c[A]).forEach(l=>{c[e][l]=[...c[A][l]]})}),t==="/*"&&(t="*");const s=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const c=Wa(t);e===A?Object.keys(r).forEach(l=>{var d;(d=r[l])[t]||(d[t]=ve(r[l],t)||ve(r[A],t)||[])}):(i=r[e])[t]||(i[t]=ve(r[e],t)||ve(r[A],t)||[]),Object.keys(r).forEach(l=>{(e===A||e===l)&&Object.keys(r[l]).forEach(d=>{c.test(d)&&r[l][d].push([a,s])})}),Object.keys(o).forEach(l=>{(e===A||e===l)&&Object.keys(o[l]).forEach(d=>c.test(d)&&o[l][d].push([a,s]))});return}const n=La(t)||[t];for(let c=0,l=n.length;c<l;c++){const d=n[c];Object.keys(o).forEach(u=>{var p;(e===A||e===u)&&((p=o[u])[d]||(p[d]=[...ve(r[u],d)||ve(r[A],d)||[]]),o[u][d].push([a,s-l+c+1]))})}}match(e,t){Vr();const a=b(this,je,Ga).call(this);return this.match=(r,o)=>{const s=a[r]||a[A],n=s[2][o];if(n)return n;const i=o.match(s[0]);if(!i)return[[],Fa];const c=i.indexOf("",1);return[s[1][c],i]},this.match(e,t)}},oe=new WeakMap,se=new WeakMap,je=new WeakSet,Ga=function(){const e=Object.create(null);return Object.keys(f(this,se)).concat(Object.keys(f(this,oe))).forEach(t=>{e[t]||(e[t]=b(this,je,za).call(this,t))}),T(this,oe,T(this,se,void 0)),e},za=function(e){const t=[];let a=e===A;return[f(this,oe),f(this,se)].forEach(r=>{const o=r[e]?Object.keys(r[e]).map(s=>[s,r[e][s]]):[];o.length!==0?(a||(a=!0),t.push(...o)):e!==A&&t.push(...Object.keys(r[A]).map(s=>[s,r[A][s]]))}),a?Yr(t):null},ga),ne,Q,_a,Kr=(_a=class{constructor(e){y(this,"name","SmartRouter");O(this,ne,[]);O(this,Q,[]);T(this,ne,e.routers)}add(e,t,a){if(!f(this,Q))throw new Error(qa);f(this,Q).push([e,t,a])}match(e,t){if(!f(this,Q))throw new Error("Fatal error");const a=f(this,ne),r=f(this,Q),o=a.length;let s=0,n;for(;s<o;s++){const i=a[s];try{for(let c=0,l=r.length;c<l;c++)i.add(...r[c]);n=i.match(e,t)}catch(c){if(c instanceof Ba)continue;throw c}this.match=i.match.bind(i),T(this,ne,[i]),T(this,Q,void 0);break}if(s===o)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,n}get activeRouter(){if(f(this,Q)||f(this,ne).length!==1)throw new Error("No active router has been determined yet.");return f(this,ne)[0]}},ne=new WeakMap,Q=new WeakMap,_a),xe=Object.create(null),ie,P,Ee,De,x,ee,ue,va,Va=(va=class{constructor(e,t,a){O(this,ee);O(this,ie);O(this,P);O(this,Ee);O(this,De,0);O(this,x,xe);if(T(this,P,a||Object.create(null)),T(this,ie,[]),e&&t){const r=Object.create(null);r[e]={handler:t,possibleKeys:[],score:0},T(this,ie,[r])}T(this,Ee,[])}insert(e,t,a){T(this,De,++zt(this,De)._);let r=this;const o=Nr(t),s=[];for(let n=0,i=o.length;n<i;n++){const c=o[n],l=o[n+1],d=Ir(c,l),u=Array.isArray(d)?d[0]:c;if(u in f(r,P)){r=f(r,P)[u],d&&s.push(d[1]);continue}f(r,P)[u]=new Va,d&&(f(r,Ee).push(d),s.push(d[1])),r=f(r,P)[u]}return f(r,ie).push({[e]:{handler:a,possibleKeys:s.filter((n,i,c)=>c.indexOf(n)===i),score:f(this,De)}}),r}search(e,t){var i;const a=[];T(this,x,xe);let o=[this];const s=Ia(t),n=[];for(let c=0,l=s.length;c<l;c++){const d=s[c],u=c===l-1,p=[];for(let m=0,g=o.length;m<g;m++){const h=o[m],E=f(h,P)[d];E&&(T(E,x,f(h,x)),u?(f(E,P)["*"]&&a.push(...b(this,ee,ue).call(this,f(E,P)["*"],e,f(h,x))),a.push(...b(this,ee,ue).call(this,E,e,f(h,x)))):p.push(E));for(let _=0,v=f(h,Ee).length;_<v;_++){const w=f(h,Ee)[_],S=f(h,x)===xe?{}:{...f(h,x)};if(w==="*"){const J=f(h,P)["*"];J&&(a.push(...b(this,ee,ue).call(this,J,e,f(h,x))),T(J,x,S),p.push(J));continue}const[D,C,Y]=w;if(!d&&!(Y instanceof RegExp))continue;const F=f(h,P)[D],ht=s.slice(c).join("/");if(Y instanceof RegExp){const J=Y.exec(ht);if(J){if(S[C]=J[0],a.push(...b(this,ee,ue).call(this,F,e,f(h,x),S)),Object.keys(f(F,P)).length){T(F,x,S);const Ke=((i=J[0].match(/\//))==null?void 0:i.length)??0;(n[Ke]||(n[Ke]=[])).push(F)}continue}}(Y===!0||Y.test(d))&&(S[C]=d,u?(a.push(...b(this,ee,ue).call(this,F,e,S,f(h,x))),f(F,P)["*"]&&a.push(...b(this,ee,ue).call(this,f(F,P)["*"],e,S,f(h,x)))):(T(F,x,S),p.push(F)))}}o=p.concat(n.shift()??[])}return a.length>1&&a.sort((c,l)=>c.score-l.score),[a.map(({handler:c,params:l})=>[c,l])]}},ie=new WeakMap,P=new WeakMap,Ee=new WeakMap,De=new WeakMap,x=new WeakMap,ee=new WeakSet,ue=function(e,t,a,r){const o=[];for(let s=0,n=f(e,ie).length;s<n;s++){const i=f(e,ie)[s],c=i[t]||i[A],l={};if(c!==void 0&&(c.params=Object.create(null),o.push(c),a!==xe||r&&r!==xe))for(let d=0,u=c.possibleKeys.length;d<u;d++){const p=c.possibleKeys[d],m=l[c.score];c.params[p]=r!=null&&r[p]&&!m?r[p]:a[p]??(r==null?void 0:r[p]),l[c.score]=!0}}return o},va),ge,ya,Xr=(ya=class{constructor(){y(this,"name","TrieRouter");O(this,ge);T(this,ge,new Va)}add(e,t,a){const r=La(t);if(r){for(let o=0,s=r.length;o<s;o++)f(this,ge).insert(e,r[o],a);return}f(this,ge).insert(e,t,a)}match(e,t){return f(this,ge).search(e,t)}},ge=new WeakMap,ya),$=class extends $a{constructor(e={}){super(e),this.router=e.router??new Kr({routers:[new Jr,new Xr]})}},Zr=e=>{const a={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},r=(s=>typeof s=="string"?s==="*"?()=>s:n=>s===n?n:null:typeof s=="function"?s:n=>s.includes(n)?n:null)(a.origin),o=(s=>typeof s=="function"?s:Array.isArray(s)?()=>s:()=>[])(a.allowMethods);return async function(n,i){var d;function c(u,p){n.res.headers.set(u,p)}const l=await r(n.req.header("origin")||"",n);if(l&&c("Access-Control-Allow-Origin",l),a.origin!=="*"){const u=n.req.header("Vary");u?c("Vary",u):c("Vary","Origin")}if(a.credentials&&c("Access-Control-Allow-Credentials","true"),(d=a.exposeHeaders)!=null&&d.length&&c("Access-Control-Expose-Headers",a.exposeHeaders.join(",")),n.req.method==="OPTIONS"){a.maxAge!=null&&c("Access-Control-Max-Age",a.maxAge.toString());const u=await o(n.req.header("origin")||"",n);u.length&&c("Access-Control-Allow-Methods",u.join(","));let p=a.allowHeaders;if(!(p!=null&&p.length)){const m=n.req.header("Access-Control-Request-Headers");m&&(p=m.split(/\s*,\s*/))}return p!=null&&p.length&&(c("Access-Control-Allow-Headers",p.join(",")),n.res.headers.append("Vary","Access-Control-Request-Headers")),n.res.headers.delete("Content-Length"),n.res.headers.delete("Content-Type"),new Response(null,{headers:n.res.headers,status:204,statusText:"No Content"})}await i()}},Qr=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,ta=(e,t=to)=>{const a=/\.([a-zA-Z0-9]+?)$/,r=e.match(a);if(!r)return;let o=t[r[1]];return o&&o.startsWith("text")&&(o+="; charset=utf-8"),o},eo={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},to=eo,ao=(...e)=>{let t=e.filter(o=>o!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const a=t.split("/"),r=[];for(const o of a)o===".."&&r.length>0&&r.at(-1)!==".."?r.pop():o!=="."&&r.push(o);return r.join("/")||"."},Ya={br:".br",zstd:".zst",gzip:".gz"},ro=Object.keys(Ya),oo="index.html",so=e=>{const t=e.root??"./",a=e.path,r=e.join??ao;return async(o,s)=>{var d,u,p,m;if(o.finalized)return s();let n;if(e.path)n=e.path;else try{if(n=decodeURIComponent(o.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(n))throw new Error}catch{return await((d=e.onNotFound)==null?void 0:d.call(e,o.req.path,o)),s()}let i=r(t,!a&&e.rewriteRequestPath?e.rewriteRequestPath(n):n);e.isDir&&await e.isDir(i)&&(i=r(i,oo));const c=e.getContent;let l=await c(i,o);if(l instanceof Response)return o.newResponse(l.body,l);if(l){const g=e.mimes&&ta(i,e.mimes)||ta(i);if(o.header("Content-Type",g||"application/octet-stream"),e.precompressed&&(!g||Qr.test(g))){const h=new Set((u=o.req.header("Accept-Encoding"))==null?void 0:u.split(",").map(E=>E.trim()));for(const E of ro){if(!h.has(E))continue;const _=await c(i+Ya[E],o);if(_){l=_,o.header("Content-Encoding",E),o.header("Vary","Accept-Encoding",{append:!0});break}}}return await((p=e.onFound)==null?void 0:p.call(e,i,o)),o.body(l)}await((m=e.onNotFound)==null?void 0:m.call(e,i,o)),await s()}},no=async(e,t)=>{let a;t&&t.manifest?typeof t.manifest=="string"?a=JSON.parse(t.manifest):a=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?a=JSON.parse(__STATIC_CONTENT_MANIFEST):a=__STATIC_CONTENT_MANIFEST;let r;t&&t.namespace?r=t.namespace:r=__STATIC_CONTENT;const o=a[e]||e;if(!o)return null;const s=await r.get(o,{type:"stream"});return s||null},io=e=>async function(a,r){return so({...e,getContent:async s=>no(s,{manifest:e.manifest,namespace:e.namespace?e.namespace:a.env?a.env.__STATIC_CONTENT:void 0})})(a,r)},co=e=>io(e),Ue="_hp",lo={Change:"Input",DoubleClick:"DblClick"},uo={svg:"2000/svg",math:"1998/Math/MathML"},qe=[],jt=new WeakMap,Ae=void 0,po=()=>Ae,K=e=>"t"in e,Tt={onClick:["click",!1]},aa=e=>{if(!e.startsWith("on"))return;if(Tt[e])return Tt[e];const t=e.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/);if(t){const[,a,r]=t;return Tt[e]=[(lo[a]||a).toLowerCase(),!!r]}},ra=(e,t)=>Ae&&e instanceof SVGElement&&/[A-Z]/.test(t)&&(t in e.style||t.match(/^(?:o|pai|str|u|ve)/))?t.replace(/([A-Z])/g,"-$1").toLowerCase():t,fo=(e,t,a)=>{var r;t||(t={});for(let o in t){const s=t[o];if(o!=="children"&&(!a||a[o]!==s)){o=ct(o);const n=aa(o);if(n){if((a==null?void 0:a[o])!==s&&(a&&e.removeEventListener(n[0],a[o],n[1]),s!=null)){if(typeof s!="function")throw new Error(`Event handler for "${o}" is not a function`);e.addEventListener(n[0],s,n[1])}}else if(o==="dangerouslySetInnerHTML"&&s)e.innerHTML=s.__html;else if(o==="ref"){let i;typeof s=="function"?i=s(e)||(()=>s(null)):s&&"current"in s&&(s.current=e,i=()=>s.current=null),jt.set(e,i)}else if(o==="style"){const i=e.style;typeof s=="string"?i.cssText=s:(i.cssText="",s!=null&&Aa(s,i.setProperty.bind(i)))}else{if(o==="value"){const c=e.nodeName;if(c==="INPUT"||c==="TEXTAREA"||c==="SELECT"){if(e.value=s==null||s===!1?null:s,c==="TEXTAREA"){e.textContent=s;continue}else if(c==="SELECT"){e.selectedIndex===-1&&(e.selectedIndex=0);continue}}}else(o==="checked"&&e.nodeName==="INPUT"||o==="selected"&&e.nodeName==="OPTION")&&(e[o]=s);const i=ra(e,o);s==null||s===!1?e.removeAttribute(i):s===!0?e.setAttribute(i,""):typeof s=="string"||typeof s=="number"?e.setAttribute(i,s):e.setAttribute(i,s.toString())}}}if(a)for(let o in a){const s=a[o];if(o!=="children"&&!(o in t)){o=ct(o);const n=aa(o);n?e.removeEventListener(n[0],s,n[1]):o==="ref"?(r=jt.get(e))==null||r():e.removeAttribute(ra(e,o))}}},mo=(e,t)=>{t[N][0]=0,qe.push([e,t]);const a=t.tag[xt]||t.tag,r=a.defaultProps?{...a.defaultProps,...t.props}:t.props;try{return[a.call(null,r)]}finally{qe.pop()}},Ja=(e,t,a,r,o)=>{var s,n;(s=e.vR)!=null&&s.length&&(r.push(...e.vR),delete e.vR),typeof e.tag=="function"&&((n=e[N][1][Qa])==null||n.forEach(i=>o.push(i))),e.vC.forEach(i=>{var c;if(K(i))a.push(i);else if(typeof i.tag=="function"||i.tag===""){i.c=t;const l=a.length;if(Ja(i,t,a,r,o),i.s){for(let d=l;d<a.length;d++)a[d].s=!0;i.s=!1}}else a.push(i),(c=i.vR)!=null&&c.length&&(r.push(...i.vR),delete i.vR)})},ho=e=>{for(;;e=e.tag===Ue||!e.vC||!e.pP?e.nN:e.vC[0]){if(!e)return null;if(e.tag!==Ue&&e.e)return e.e}},Ka=e=>{var t,a,r,o,s,n;K(e)||((a=(t=e[N])==null?void 0:t[1][Qa])==null||a.forEach(i=>{var c;return(c=i[2])==null?void 0:c.call(i)}),(r=jt.get(e.e))==null||r(),e.p===2&&((o=e.vC)==null||o.forEach(i=>i.p=2)),(s=e.vC)==null||s.forEach(Ka)),e.p||((n=e.e)==null||n.remove(),delete e.e),typeof e.tag=="function"&&(Le.delete(e),st.delete(e),delete e[N][3],e.a=!0)},Xa=(e,t,a)=>{e.c=t,Za(e,t,a)},oa=(e,t)=>{if(t){for(let a=0,r=e.length;a<r;a++)if(e[a]===t)return a}},sa=Symbol(),Za=(e,t,a)=>{var l;const r=[],o=[],s=[];Ja(e,t,r,o,s),o.forEach(Ka);const n=a?void 0:t.childNodes;let i,c=null;if(a)i=-1;else if(!n.length)i=0;else{const d=oa(n,ho(e.nN));d!==void 0?(c=n[d],i=d):i=oa(n,(l=r.find(u=>u.tag!==Ue&&u.e))==null?void 0:l.e)??-1,i===-1&&(a=!0)}for(let d=0,u=r.length;d<u;d++,i++){const p=r[d];let m;if(p.s&&p.e)m=p.e,p.s=!1;else{const g=a||!p.e;K(p)?(p.e&&p.d&&(p.e.textContent=p.t),p.d=!1,m=p.e||(p.e=document.createTextNode(p.t))):(m=p.e||(p.e=p.n?document.createElementNS(p.n,p.tag):document.createElement(p.tag)),fo(m,p.props,p.pP),Za(p,m,g))}p.tag===Ue?i--:a?m.parentNode||t.appendChild(m):n[i]!==m&&n[i-1]!==m&&(n[i+1]===m?t.appendChild(n[i]):t.insertBefore(m,c||n[i]||null))}if(e.pP&&delete e.pP,s.length){const d=[],u=[];s.forEach(([,p,,m,g])=>{p&&d.push(p),m&&u.push(m),g==null||g()}),d.forEach(p=>p()),u.length&&requestAnimationFrame(()=>{u.forEach(p=>p())})}},Eo=(e,t)=>!!(e&&e.length===t.length&&e.every((a,r)=>a[1]===t[r][1])),st=new WeakMap,It=(e,t,a)=>{var s,n,i,c,l,d;const r=!a&&t.pC;a&&(t.pC||(t.pC=t.vC));let o;try{a||(a=typeof t.tag=="function"?mo(e,t):ze(t.props.children)),((s=a[0])==null?void 0:s.tag)===""&&a[0][bt]&&(o=a[0][bt],e[5].push([e,o,t]));const u=r?[...t.pC]:t.vC?[...t.vC]:void 0,p=[];let m;for(let g=0;g<a.length;g++){Array.isArray(a[g])&&a.splice(g,1,...a[g].flat());let h=go(a[g]);if(h){typeof h.tag=="function"&&!h.tag[Oa]&&(Ne.length>0&&(h[N][2]=Ne.map(_=>[_,_.values.at(-1)])),(n=e[5])!=null&&n.length&&(h[N][3]=e[5].at(-1)));let E;if(u&&u.length){const _=u.findIndex(K(h)?v=>K(v):h.key!==void 0?v=>v.key===h.key&&v.tag===h.tag:v=>v.tag===h.tag);_!==-1&&(E=u[_],u.splice(_,1))}if(E)if(K(h))E.t!==h.t&&(E.t=h.t,E.d=!0),h=E;else{const _=E.pP=E.props;if(E.props=h.props,E.f||(E.f=h.f||t.f),typeof h.tag=="function"){const v=E[N][2];E[N][2]=h[N][2]||[],E[N][3]=h[N][3],!E.f&&((E.o||E)===h.o||(c=(i=E.tag)[lr])!=null&&c.call(i,_,E.props))&&Eo(v,E[N][2])&&(E.s=!0)}h=E}else if(!K(h)&&Ae){const _=Ie(Ae);_&&(h.n=_)}if(!K(h)&&!h.s&&(It(e,h),delete h.f),p.push(h),m&&!m.s&&!h.s)for(let _=m;_&&!K(_);_=(l=_.vC)==null?void 0:l.at(-1))_.nN=h;m=h}}t.vR=r?[...t.vC,...u||[]]:u||[],t.vC=p,r&&delete t.pC}catch(u){if(t.f=!0,u===sa){if(o)return;throw u}const[p,m,g]=((d=t[N])==null?void 0:d[3])||[];if(m){const h=()=>nt([0,!1,e[2]],g),E=st.get(g)||[];E.push(h),st.set(g,E);const _=m(u,()=>{const v=st.get(g);if(v){const w=v.indexOf(h);if(w!==-1)return v.splice(w,1),h()}});if(_){if(e[0]===1)e[1]=!0;else if(It(e,g,[_]),(m.length===1||e!==p)&&g.c){Xa(g,g.c,!1);return}throw sa}}throw u}finally{o&&e[5].pop()}},go=e=>{if(!(e==null||typeof e=="boolean")){if(typeof e=="string"||typeof e=="number")return{t:e.toString(),d:!0};if("vR"in e&&(e={tag:e.tag,props:e.props,key:e.key,f:e.f,type:e.tag,ref:e.props.ref,o:e.o||e}),typeof e.tag=="function")e[N]=[0,[]];else{const t=uo[e.tag];t&&(Ae||(Ae=ba("")),e.props.children=[{tag:Ae,props:{value:e.n=`http://www.w3.org/${t}`,children:e.props.children}}])}return e}},na=(e,t)=>{var a,r;(a=t[N][2])==null||a.forEach(([o,s])=>{o.values.push(s)});try{It(e,t,void 0)}catch{return}if(t.a){delete t.a;return}(r=t[N][2])==null||r.forEach(([o])=>{o.values.pop()}),(e[0]!==1||!e[1])&&Xa(t,t.c,!1)},Le=new WeakMap,ia=[],nt=async(e,t)=>{e[5]||(e[5]=[]);const a=Le.get(t);a&&a[0](void 0);let r;const o=new Promise(s=>r=s);if(Le.set(t,[r,()=>{e[2]?e[2](e,t,s=>{na(s,t)}).then(()=>r(t)):(na(e,t),r(t))}]),ia.length)ia.at(-1).add(t);else{await Promise.resolve();const s=Le.get(t);s&&(Le.delete(t),s[1]())}return o},_o=(e,t,a)=>({tag:Ue,props:{children:e},key:a,e:t,p:1}),St=0,Qa=1,Rt=2,wt=3,Ot=new WeakMap,er=(e,t)=>!e||!t||e.length!==t.length||t.some((a,r)=>a!==e[r]),vo=void 0,ca=[],yo=e=>{var n;const t=()=>typeof e=="function"?e():e,a=qe.at(-1);if(!a)return[t(),()=>{}];const[,r]=a,o=(n=r[N][1])[St]||(n[St]=[]),s=r[N][0]++;return o[s]||(o[s]=[t(),i=>{const c=vo,l=o[s];if(typeof i=="function"&&(i=i(l[0])),!Object.is(i,l[0]))if(l[0]=i,ca.length){const[d,u]=ca.at(-1);Promise.all([d===3?r:nt([d,!1,c],r),u]).then(([p])=>{if(!p||!(d===2||d===3))return;const m=p.vC;requestAnimationFrame(()=>{setTimeout(()=>{m===p.vC&&nt([d===3?1:0,!1,c],p)})})})}else nt([0,!1,c],r)}])},Ut=(e,t)=>{var i;const a=qe.at(-1);if(!a)return e;const[,r]=a,o=(i=r[N][1])[Rt]||(i[Rt]=[]),s=r[N][0]++,n=o[s];return er(n==null?void 0:n[1],t)?o[s]=[e,t]:e=o[s][0],e},To=e=>{const t=Ot.get(e);if(t){if(t.length===2)throw t[1];return t[0]}throw e.then(a=>Ot.set(e,[a]),a=>Ot.set(e,[void 0,a])),e},So=(e,t)=>{var i;const a=qe.at(-1);if(!a)return e();const[,r]=a,o=(i=r[N][1])[wt]||(i[wt]=[]),s=r[N][0]++,n=o[s];return er(n==null?void 0:n[1],t)&&(o[s]=[e(),t]),o[s][0]},Ro=ba({pending:!1,data:null,method:null,action:null}),la=new Set,wo=e=>{la.add(e),e.finally(()=>la.delete(e))},qt=(e,t)=>So(()=>a=>{let r;e&&(typeof e=="function"?r=e(a)||(()=>{e(null)}):e&&"current"in e&&(e.current=a,r=()=>{e.current=null}));const o=t(a);return()=>{o==null||o(),r==null||r()}},[e]),ye=Object.create(null),Ze=Object.create(null),Je=(e,t,a,r,o)=>{if(t!=null&&t.itemProp)return{tag:e,props:t,type:e,ref:t.ref};const s=document.head;let{onLoad:n,onError:i,precedence:c,blocking:l,...d}=t,u=null,p=!1;const m=Qe[e];let g;if(m.length>0){const v=s.querySelectorAll(e);e:for(const w of v)for(const S of Qe[e])if(w.getAttribute(S)===t[S]){u=w;break e}if(!u){const w=m.reduce((S,D)=>t[D]===void 0?S:`${S}-${D}-${t[D]}`,e);p=!Ze[w],u=Ze[w]||(Ze[w]=(()=>{const S=document.createElement(e);for(const D of m)t[D]!==void 0&&S.setAttribute(D,t[D]),t.rel&&S.setAttribute("rel",t.rel);return S})())}}else g=s.querySelectorAll(e);c=r?c??"":void 0,r&&(d[et]=c);const h=Ut(v=>{if(m.length>0){let w=!1;for(const S of s.querySelectorAll(e)){if(w&&S.getAttribute(et)!==c){s.insertBefore(v,S);return}S.getAttribute(et)===c&&(w=!0)}s.appendChild(v)}else if(g){let w=!1;for(const S of g)if(S===v){w=!0;break}w||s.insertBefore(v,s.contains(g[0])?g[0]:s.querySelector(e)),g=void 0}},[c]),E=qt(t.ref,v=>{var D;const w=m[0];if(a===2&&(v.innerHTML=""),(p||g)&&h(v),!i&&!n)return;let S=ye[D=v.getAttribute(w)]||(ye[D]=new Promise((C,Y)=>{v.addEventListener("load",C),v.addEventListener("error",Y)}));n&&(S=S.then(n)),i&&(S=S.catch(i)),S.catch(()=>{})});if(o&&l==="render"){const v=Qe[e][0];if(t[v]){const w=t[v],S=ye[w]||(ye[w]=new Promise((D,C)=>{h(u),u.addEventListener("load",D),u.addEventListener("error",C)}));To(S)}}const _={tag:e,type:e,props:{...d,ref:E},ref:E};return _.p=a,u&&(_.e=u),_o(_,s)},Oo=e=>{const t=po(),a=t&&Ie(t);return a!=null&&a.endsWith("svg")?{tag:"title",props:e,type:"title",ref:e.ref}:Je("title",e,void 0,!1,!1)},Co=e=>!e||["src","async"].some(t=>!e[t])?{tag:"script",props:e,type:"script",ref:e.ref}:Je("script",e,1,!1,!0),bo=e=>!e||!["href","precedence"].every(t=>t in e)?{tag:"style",props:e,type:"style",ref:e.ref}:(e["data-href"]=e.href,delete e.href,Je("style",e,2,!0,!0)),Do=e=>!e||["onLoad","onError"].some(t=>t in e)||e.rel==="stylesheet"&&(!("precedence"in e)||"disabled"in e)?{tag:"link",props:e,type:"link",ref:e.ref}:Je("link",e,1,"precedence"in e,!0),No=e=>Je("meta",e,void 0,!1,!1),tr=Symbol(),Ao=e=>{const{action:t,...a}=e;typeof t!="function"&&(a.action=t);const[r,o]=yo([null,!1]),s=Ut(async l=>{const d=l.isTrusted?t:l.detail[tr];if(typeof d!="function")return;l.preventDefault();const u=new FormData(l.target);o([u,!0]);const p=d(u);p instanceof Promise&&(wo(p),await p),o([null,!0])},[]),n=qt(e.ref,l=>(l.addEventListener("submit",s),()=>{l.removeEventListener("submit",s)})),[i,c]=r;return r[1]=!1,{tag:Ro,props:{value:{pending:i!==null,data:i,method:i?"post":null,action:i?t:null},children:{tag:"form",props:{...a,ref:n},type:"form",ref:n}},f:c}},ar=(e,{formAction:t,...a})=>{if(typeof t=="function"){const r=Ut(o=>{o.preventDefault(),o.currentTarget.form.dispatchEvent(new CustomEvent("submit",{detail:{[tr]:t}}))},[]);a.ref=qt(a.ref,o=>(o.addEventListener("click",r),()=>{o.removeEventListener("click",r)}))}return{tag:e,props:a,type:e,ref:a.ref}},jo=e=>ar("input",e),Io=e=>ar("button",e);Object.assign(Dt,{title:Oo,script:Co,style:bo,link:Do,meta:No,form:Ao,input:jo,button:Io});Lt(null);new TextEncoder;var xo=Lt(null),Lo=(e,t,a,r)=>(o,s)=>{const n="<!DOCTYPE html>",i=a?Kt(l=>a(l,e),{Layout:t,...s},o):o,c=cr`${B(n)}${Kt(xo.Provider,{value:e},i)}`;return e.html(c)},Mo=(e,t)=>function(r,o){const s=r.getLayout()??Sr;return e&&r.setLayout(n=>e({...n,Layout:s},r)),r.setRenderer(Lo(r,s,e)),o()};const Po=Mo(({children:e})=>R("html",{lang:"es",children:[R("head",{children:[R("meta",{charset:"UTF-8"}),R("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),R("title",{children:"Yo Decreto - Gustavo Adolfo Guerrero Castaños"}),R("link",{rel:"icon",href:"/static/logo-yo-decreto.png",type:"image/png"}),R("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",rel:"stylesheet"}),R("script",{src:"https://cdn.tailwindcss.com"}),R("link",{href:"https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css",rel:"stylesheet"}),R("script",{src:"https://cdn.jsdelivr.net/npm/chart.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrAfter.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrBefore.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"}),R("link",{href:`/static/styles.css?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`,rel:"stylesheet"}),R("script",{dangerouslySetInnerHTML:{__html:`
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
          `}})]}),R("body",{className:"bg-slate-900 text-white font-sans",children:[e,R("script",{src:`/static/auth.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/app.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/decretos.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/rutina.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/agenda.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/progreso.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/ritual-spec.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/practica.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/chatbot.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/google-calendar-settings.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/ai-chat-widget.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/acerca.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`})]})]}));async function Ho(e,t,a,r,o,s,n){try{if(console.log("📅 Sincronizando con agenda:",{accionId:t,titulo:a,proximaRevision:n}),n){const i=n.split("T")[0],c=n.split("T")[1]||"09:00";console.log("📅 Creando evento agenda:",{fechaParte:i,horaParte:c});const l=await e.prepare(`
        INSERT INTO agenda_eventos (
          accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(t,`[Decreto] ${a}`,`${r}${o?" - "+o:""}`,i,c,"media").run();console.log("✅ Evento agenda creado:",l.meta.last_row_id)}else console.log("⏭️ Sin fecha programada, no se crea evento agenda")}catch(i){console.error("❌ Error al sincronizar con agenda:",i)}}const L=new $;L.get("/config",async e=>{try{const t=await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first();return e.json({success:!0,data:t||{nombre_usuario:"Gustavo Adolfo Guerrero Castaños",frase_vida:"(Agregar frase de vida)"}})}catch{return e.json({success:!1,error:"Error al obtener configuración"},500)}});L.put("/config",async e=>{try{const{nombre_usuario:t,frase_vida:a}=await e.req.json();return await e.env.DB.prepare("UPDATE configuracion SET nombre_usuario = ?, frase_vida = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(t,a,"main").run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al actualizar configuración"},500)}});L.get("/",async e=>{try{const t=await e.env.DB.prepare("SELECT * FROM decretos ORDER BY created_at DESC").all(),a={total:t.results.length,empresarial:t.results.filter(o=>o.area==="empresarial").length,material:t.results.filter(o=>o.area==="material").length,humano:t.results.filter(o=>o.area==="humano").length},r={empresarial:a.total>0?Math.round(a.empresarial/a.total*100):0,material:a.total>0?Math.round(a.material/a.total*100):0,humano:a.total>0?Math.round(a.humano/a.total*100):0};return e.json({success:!0,data:{decretos:t.results,contadores:a,porcentajes:r}})}catch{return e.json({success:!1,error:"Error al obtener decretos"},500)}});L.get("/:id",async e=>{try{const t=e.req.param("id"),a=await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(t).first();if(!a)return e.json({success:!1,error:"Decreto no encontrado"},404);const r=await e.env.DB.prepare("SELECT * FROM acciones WHERE decreto_id = ? ORDER BY created_at DESC").bind(t).all(),o=r.results.length,s=r.results.filter(c=>c.estado==="completada").length,n=o-s,i=o>0?Math.round(s/o*100):0;return await e.env.DB.prepare("UPDATE decretos SET progreso = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(i,t).run(),e.json({success:!0,data:{decreto:{...a,progreso:i},acciones:r.results,metricas:{total_acciones:o,completadas:s,pendientes:n,progreso:i}}})}catch{return e.json({success:!1,error:"Error al obtener decreto"},500)}});L.post("/",async e=>{try{const{area:t,titulo:a,sueno_meta:r,descripcion:o}=await e.req.json();if(!t||!a||!r)return e.json({success:!1,error:"Campos requeridos: area, titulo, sueno_meta"},400);const s=await e.env.DB.prepare("INSERT INTO decretos (area, titulo, sueno_meta, descripcion) VALUES (?, ?, ?, ?)").bind(t,a,r,o||"").run();return e.json({success:!0,id:s.meta.last_row_id})}catch{return e.json({success:!1,error:"Error al crear decreto"},500)}});L.put("/:id",async e=>{try{const t=e.req.param("id"),{area:a,titulo:r,sueno_meta:o,descripcion:s}=await e.req.json();return await e.env.DB.prepare("UPDATE decretos SET area = ?, titulo = ?, sueno_meta = ?, descripcion = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(a,r,o,s||"",t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al actualizar decreto"},500)}});L.delete("/:id",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare("DELETE FROM decretos WHERE id = ?").bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar decreto"},500)}});L.post("/:id/acciones",async e=>{var t;try{const a=e.req.param("id"),r=await e.req.json();console.log("=== BACKEND: RECIBIENDO DATOS ===",{decretoId:a,requestDataKeys:Object.keys(r),hasSubtareas:"subtareas"in r,subtareasLength:((t=r.subtareas)==null?void 0:t.length)||0,subtareasData:r.subtareas});const{titulo:o,que_hacer:s,como_hacerlo:n,resultados:i,tareas_pendientes:c,tipo:l,proxima_revision:d,calificacion:u,subtareas:p=[]}=r;if(!o||!s)return e.json({success:!1,error:"Campos requeridos: titulo, que_hacer"},400);const m=crypto.randomUUID().replace(/-/g,"").substring(0,32);if(await e.env.DB.prepare(`
      INSERT INTO acciones (
        id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
        tareas_pendientes, tipo, proxima_revision, calificacion, origen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')
    `).bind(m,a,o,s,n||"",i||"",JSON.stringify(c||[]),l||"secundaria",d||null,u||null).run(),console.log("✅ Acción creada:",m),d){console.log("🔥 FORZANDO creación en agenda para:",{accionId:m,titulo:o,proxima_revision:d});const h=d.split("T")[0],E=d.split("T")[1]||"09:00";try{const _=await e.env.DB.prepare(`
          INSERT INTO agenda_eventos (
            accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(m,`[Decreto] ${o}`,`${s}${n?" - "+n:""}`,h,E,"media").run();console.log("🚀 AGENDA EVENTO CREADO EXITOSAMENTE:",_.meta.last_row_id)}catch(_){console.error("💥 ERROR CREANDO AGENDA EVENTO:",_)}}else console.log("⚠️ NO HAY FECHA DE REVISIÓN - NO SE CREA EVENTO AGENDA");let g=0;if(console.log("=== PROCESANDO SUB-TAREAS ===",{hasSubtareas:!!p,subtareasLength:(p==null?void 0:p.length)||0,subtareasData:p}),p&&p.length>0){console.log(`Procesando ${p.length} sub-tareas...`);for(let h=0;h<p.length;h++){const E=p[h];if(console.log(`Sub-tarea ${h+1}:`,E),E.titulo){const _=crypto.randomUUID().replace(/-/g,"").substring(0,32);let v=E.fecha_programada;!v&&d&&(v=d),console.log(`Creando sub-tarea ${h+1} con ID: ${_}`,{titulo:E.titulo,queHacer:E.que_hacer,fecha:v,padreId:m});const w=await e.env.DB.prepare(`
            INSERT INTO acciones (
              id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
              tipo, proxima_revision, origen, tarea_padre_id, nivel_jerarquia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(_,a,E.titulo,E.que_hacer,E.como_hacerlo||"","","secundaria",v,"subtarea",m,1).run();console.log(`✅ Sub-tarea ${h+1} creada en BD:`,{success:w.success,changes:w.changes}),v&&(await Ho(e.env.DB,_,`[Sub] ${E.titulo}`,E.que_hacer,E.como_hacerlo,"secundaria",v),console.log(`✅ Sub-tarea ${h+1} sincronizada con agenda`)),g++}else console.log(`⏭️ Sub-tarea ${h+1} sin título, saltando`)}}else console.log("No hay sub-tareas para procesar");return console.log(`=== SUB-TAREAS COMPLETADAS: ${g} ===`),console.log("=== RESPUESTA FINAL ===",{success:!0,accionId:m,subtareasCreadas:g}),e.json({success:!0,id:m,data:{subtareas_creadas:g}})}catch(a){return console.error("Error creating action:",a),e.json({success:!1,error:`Error al crear acción: ${a.message}`},500)}});L.get("/:decretoId/acciones/:accionId",async e=>{try{const t=e.req.param("decretoId"),a=e.req.param("accionId"),r=await e.env.DB.prepare(`
      SELECT 
        a.*,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      WHERE a.id = ? AND a.decreto_id = ?
    `).bind(a,t).first();if(!r)return e.json({success:!1,error:"Acción no encontrada"},404);if(r.tareas_pendientes)try{r.tareas_pendientes=JSON.parse(r.tareas_pendientes)}catch{r.tareas_pendientes=[]}return e.json({success:!0,data:r})}catch{return e.json({success:!1,error:"Error al obtener detalles de la acción"},500)}});L.put("/:decretoId/acciones/:accionId",async e=>{try{const t=e.req.param("decretoId"),a=e.req.param("accionId"),{titulo:r,que_hacer:o,como_hacerlo:s,resultados:n,tipo:i,proxima_revision:c,calificacion:l}=await e.req.json();if(!r||!o)return e.json({success:!1,error:"Campos requeridos: titulo, que_hacer"},400);if(await e.env.DB.prepare(`
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
    `).bind(r,o,s||"",n||"",i||"secundaria",c||null,l||null,a,t).run(),await e.env.DB.prepare("SELECT id FROM agenda_eventos WHERE accion_id = ?").bind(a).first()&&c){const u=c.split("T")[0],p=c.split("T")[1]||"09:00";await e.env.DB.prepare(`
        UPDATE agenda_eventos SET 
          titulo = ?,
          fecha_evento = ?,
          hora_evento = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE accion_id = ?
      `).bind(`[Decreto] ${r}`,u,p,a).run()}return e.json({success:!0})}catch{return e.json({success:!1,error:"Error al editar acción"},500)}});L.put("/:decretoId/acciones/:accionId/completar",async e=>{try{const t=e.req.param("accionId");return await e.env.DB.prepare('UPDATE acciones SET estado = "completada", fecha_cierre = date("now"), updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(),await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "completada", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al completar acción"},500)}});L.put("/:decretoId/acciones/:accionId/pendiente",async e=>{try{const t=e.req.param("accionId");return await e.env.DB.prepare('UPDATE acciones SET estado = "pendiente", fecha_cierre = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(),await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "pendiente", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al marcar acción como pendiente"},500)}});L.delete("/:decretoId/acciones/:accionId",async e=>{try{const t=e.req.param("accionId");return await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar acción"},500)}});L.post("/:decretoId/acciones/:accionId/seguimientos",async e=>{try{const t=e.req.param("accionId"),{que_se_hizo:a,como_se_hizo:r,resultados_obtenidos:o,tareas_pendientes:s,proxima_revision:n,calificacion:i}=await e.req.json();if(!a||!r||!o)return e.json({success:!1,error:"Campos requeridos: que_se_hizo, como_se_hizo, resultados_obtenidos"},400);await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(t,a,r,o,JSON.stringify(s||[]),n||null,i||null).run(),await e.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(o,JSON.stringify(s||[]),n||null,i||null,t).run();let c=0;if(s&&Array.isArray(s)){for(const l of s)if(typeof l=="string"&&l.trim()){let d=l.trim(),u="secundaria",p=null;(d.startsWith("[P]")||d.includes("#primaria"))&&(u="primaria",d=d.replace(/\[P\]|#primaria/g,"").trim()),d.includes("#diaria")&&(u="secundaria",d=d.replace(/#diaria/g,"").trim());const m=d.match(/@(\d{4}-\d{2}-\d{2})/);m&&(p=m[1]+"T09:00",d=d.replace(/@\d{4}-\d{2}-\d{2}/g,"").trim());const g=await e.env.DB.prepare("SELECT decreto_id FROM acciones WHERE id = ?").bind(t).first();if(g){const h=await e.env.DB.prepare(`
              INSERT INTO acciones (
                decreto_id, titulo, que_hacer, como_hacerlo, tipo, 
                proxima_revision, origen
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `).bind(g.decreto_id,d,"Tarea generada desde seguimiento",`Completar: ${d}`,u,p,`seguimiento:${t}`).run();let E=null;if(u==="secundaria"){const _=p?p.split("T")[0]:new Date().toISOString().split("T")[0],v=p?p.split("T")[1]:"09:00";E=(await e.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad)
                VALUES (?, ?, ?, ?, ?, ?)
              `).bind(h.meta.last_row_id,d,`[Auto-generada] ${d}`,_,v,"media").run()).meta.last_row_id}else u==="primaria"&&p&&(E=(await e.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad)
                VALUES (?, ?, ?, date(?), time(?), ?)
              `).bind(h.meta.last_row_id,`[Semanal] ${d}`,"Tarea generada desde seguimiento",p.split("T")[0],p.split("T")[1],"media").run()).meta.last_row_id);E&&await e.env.DB.prepare(`
                UPDATE acciones SET agenda_event_id = ? WHERE id = ?
              `).bind(E,h.meta.last_row_id).run(),c++}}}return e.json({success:!0,message:`Seguimiento guardado. ${c} tareas nuevas creadas.`})}catch{return e.json({success:!1,error:"Error al crear seguimiento"},500)}});L.get("/:id/sugerencias",async e=>{try{const t=e.req.param("id"),a=await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(t).first();if(!a)return e.json({success:!1,error:"Decreto no encontrado"},404);let r=[];switch(a.area){case"empresarial":r=["Analizar competencia directa y ventajas competitivas","Definir métricas clave de rendimiento (KPIs)","Desarrollar plan de marketing digital","Establecer alianzas estratégicas","Optimizar procesos operativos"];break;case"material":r=["Revisar y optimizar presupuesto mensual","Investigar nuevas oportunidades de inversión","Crear fondo de emergencia","Diversificar fuentes de ingresos","Consultar con asesor financiero"];break;case"humano":r=["Establecer rutina de ejercicio diario","Practicar meditación mindfulness","Fortalecer relaciones familiares","Desarrollar nuevas habilidades","Cultivar hábitos de sueño saludables"];break;default:r=["Definir objetivos específicos y medibles","Crear plan de acción detallado","Establecer fechas límite realistas","Buscar recursos y herramientas necesarias","Programar revisiones de progreso"]}return e.json({success:!0,data:r.map((o,s)=>({id:`sugerencia_${s+1}`,texto:o,categoria:a.area}))})}catch{return e.json({success:!1,error:"Error al generar sugerencias"},500)}});L.get("/:decretoId/acciones/:accionId/arbol",async e=>{try{const t=e.req.param("decretoId"),a=e.req.param("accionId"),r=await e.env.DB.prepare(`
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
    `).bind(a,t).all();return e.json({success:!0,data:{arbol:r.results,total_tareas:r.results.length}})}catch{return e.json({success:!1,error:"Error al obtener árbol de tareas"},500)}});const M=new $;M.get("/metricas/:fecha",async e=>{try{const t=e.req.param("fecha"),a=await e.env.DB.prepare(`
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
    `).bind(t).all(),r=a.results.length,o=a.results.filter(i=>i.estado==="completada").length,s=r-o,n=r>0?Math.round(o/r*100):0;return e.json({success:!0,data:{total:r,completadas:o,pendientes:s,progreso:n,tareas:a.results}})}catch{return e.json({success:!1,error:"Error al obtener métricas del día"},500)}});M.get("/calendario/:year/:month",async e=>{try{const t=e.req.param("year"),a=e.req.param("month"),r=`${t}-${a.padStart(2,"0")}-01`,o=`${t}-${a.padStart(2,"0")}-31`,s=await e.env.DB.prepare(`
      SELECT 
        fecha_evento,
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado = 'pendiente' AND fecha_evento < date('now') THEN 1 END) as vencidas
      FROM agenda_eventos 
      WHERE fecha_evento BETWEEN ? AND ?
      GROUP BY fecha_evento
    `).bind(r,o).all(),n={};for(const i of s.results){const{fecha_evento:c,total:l,completadas:d,vencidas:u}=i;d===l?n[c]="completado":u>0?n[c]="vencido":l>d&&(n[c]="pendiente")}return e.json({success:!0,data:{eventos:s.results,estados:n}})}catch{return e.json({success:!1,error:"Error al obtener calendario"},500)}});M.get("/timeline/:fecha",async e=>{try{const t=e.req.param("fecha"),a=await e.env.DB.prepare(`
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
    `).bind(t).all();return e.json({success:!0,data:a.results})}catch{return e.json({success:!1,error:"Error al obtener timeline"},500)}});M.get("/timeline-unificado/:fecha",async e=>{try{const t=e.req.param("fecha"),a="demo-user",r=await e.env.DB.prepare(`
      SELECT
        ae.id,
        ae.titulo,
        ae.descripcion,
        ae.fecha_evento,
        ae.hora_evento,
        ae.estado,
        ae.prioridad,
        ae.es_enfoque_dia,
        a.titulo as accion_titulo,
        a.que_hacer,
        a.tipo,
        d.area,
        d.titulo as decreto_titulo,
        d.id as decreto_id,
        'local' as origen
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
    `).bind(t).all(),o=await e.env.DB.prepare(`
      SELECT
        id,
        google_event_id,
        titulo,
        descripcion,
        fecha_inicio,
        fecha_fin,
        all_day,
        location,
        color_id,
        'google' as origen
      FROM google_events
      WHERE user_id = ?
        AND deleted = 0
        AND date(fecha_inicio) = ?
      ORDER BY fecha_inicio ASC
    `).bind(a,t).all(),s=[...r.results.map(n=>({id:n.id,titulo:n.titulo,descripcion:n.descripcion,fecha_evento:n.fecha_evento,hora_evento:n.hora_evento,estado:n.estado,prioridad:n.prioridad,es_enfoque_dia:n.es_enfoque_dia,accion_titulo:n.accion_titulo,decreto_titulo:n.decreto_titulo,decreto_id:n.decreto_id,area:n.area,tipo:n.tipo,origen:"local",timestamp:n.hora_evento?`${n.fecha_evento}T${n.hora_evento}`:`${n.fecha_evento}T23:59`,all_day:!n.hora_evento})),...o.results.map(n=>{var i;return{id:`google-${n.id}`,google_event_id:n.google_event_id,titulo:n.titulo,descripcion:n.descripcion,fecha_inicio:n.fecha_inicio,fecha_fin:n.fecha_fin,location:n.location,color_id:n.color_id,origen:"google",all_day:n.all_day===1,timestamp:n.fecha_inicio,hora_evento:n.all_day?null:(i=n.fecha_inicio.split("T")[1])==null?void 0:i.substring(0,5)}})];return s.sort((n,i)=>{const c=new Date(n.timestamp).getTime(),l=new Date(i.timestamp).getTime();return c-l}),e.json({success:!0,data:s,meta:{total:s.length,locales:r.results.length,google:o.results.length}})}catch(t){return console.error("Error getting unified timeline:",t),e.json({success:!1,error:t.message||"Error al obtener timeline unificado"},500)}});M.get("/enfoque/:fecha",async e=>{try{const t=e.req.param("fecha"),a=await e.env.DB.prepare(`
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
    `).bind(t).first();return e.json({success:!0,data:a})}catch{return e.json({success:!1,error:"Error al obtener enfoque del día"},500)}});M.put("/enfoque/:fecha",async e=>{try{const t=e.req.param("fecha"),{tarea_id:a}=await e.req.json();return await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 0 WHERE fecha_evento = ?").bind(t).run(),a&&await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(a).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al establecer enfoque"},500)}});M.post("/tareas",async e=>{try{const{decreto_id:t,nombre:a,descripcion:r,fecha_hora:o,tipo:s,prioridad:n}=await e.req.json();if(console.log("📝 Creando tarea agenda:",{decreto_id:t,nombre:a,fecha_hora:o,tipo:s,prioridad:n}),!a||!o)return e.json({success:!1,error:"Campos requeridos: nombre, fecha_hora"},400);const i=o.split("T")[0],c=o.split("T")[1]||"09:00",l=await e.env.DB.prepare(`
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
    `).bind(a,r||"",i,c,n||"media").run();return console.log("✅ Tarea agenda creada:",l.meta.last_row_id),e.json({success:!0,id:l.meta.last_row_id,message:"Tarea creada correctamente"})}catch(t){return console.error("❌ Error crear tarea:",t),e.json({success:!1,error:`Error al crear tarea: ${t.message}`},500)}});M.put("/tareas/:id/completar",async e=>{try{const t=e.req.param("id"),a=new Date().toISOString();return await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        estado = "completada", 
        fecha_completada = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(a,t).run(),await e.env.DB.prepare(`
      UPDATE acciones SET 
        estado = "completada", 
        fecha_cierre = date("now"),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT accion_id FROM agenda_eventos WHERE id = ?
      )
    `).bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al completar tarea"},500)}});M.put("/tareas/:id/pendiente",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare(`
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
    `).bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al marcar tarea como pendiente"},500)}});M.delete("/tareas/:id",async e=>{try{const t=e.req.param("id"),a=await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();if(await e.env.DB.prepare("DELETE FROM agenda_eventos WHERE id = ?").bind(t).run(),a!=null&&a.accion_id){const r=await e.env.DB.prepare("SELECT origen FROM acciones WHERE id = ?").bind(a.accion_id).first();(r==null?void 0:r.origen)==="agenda"&&await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(a.accion_id).run()}return e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar tarea"},500)}});M.get("/pendientes/:fecha",async e=>{try{const t=e.req.param("fecha"),a=await e.env.DB.prepare(`
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
    `).bind(t).all();return e.json({success:!0,data:a.results})}catch{return e.json({success:!1,error:"Error al obtener tareas pendientes"},500)}});M.get("/tareas/:id",async e=>{try{const t=e.req.param("id"),a=await e.env.DB.prepare(`
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
    `).bind(t).first();if(!a)return e.json({success:!1,error:"Tarea no encontrada"},404);if(a.tareas_pendientes)try{a.tareas_pendientes=JSON.parse(a.tareas_pendientes)}catch{a.tareas_pendientes=[]}return e.json({success:!0,data:a})}catch{return e.json({success:!1,error:"Error al obtener detalles de la tarea"},500)}});M.put("/tareas/:id",async e=>{try{const t=e.req.param("id"),{titulo:a,descripcion:r,fecha_hora:o,que_hacer:s,como_hacerlo:n,resultados:i,tipo:c,calificacion:l,prioridad:d}=await e.req.json();if(!a||!o)return e.json({success:!1,error:"Campos requeridos: titulo, fecha_hora"},400);const u=o.split("T")[0],p=o.split("T")[1]||"09:00";await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        titulo = ?,
        descripcion = ?,
        fecha_evento = ?,
        hora_evento = ?,
        prioridad = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(a,r||"",u,p,d||"media",t).run();const m=await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();return m!=null&&m.accion_id&&await e.env.DB.prepare(`
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
      `).bind(a,s||"",n||"",i||"",c||"secundaria",o,l||null,m.accion_id).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al editar tarea"},500)}});M.get("/filtros",async e=>{try{const{fecha_desde:t,fecha_hasta:a,incluir_hoy:r,incluir_futuras:o,incluir_completadas:s,incluir_pendientes:n,decreto_id:i,area:c}=e.req.query();let l=`
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
    `;const d=[];r==="true"&&(l+=" AND ae.fecha_evento = date('now')"),o==="true"&&(l+=" AND ae.fecha_evento > date('now')"),t&&a&&(l+=" AND ae.fecha_evento BETWEEN ? AND ?",d.push(t,a));const u=[];s==="true"&&u.push("completada"),n==="true"&&u.push("pendiente"),u.length>0&&(l+=` AND ae.estado IN (${u.map(()=>"?").join(",")})`,d.push(...u)),i&&i!=="todos"&&(l+=" AND d.id = ?",d.push(i)),c&&c!=="todos"&&(l+=" AND d.area = ?",d.push(c)),l+=" ORDER BY ae.fecha_evento DESC, ae.hora_evento ASC";const p=await e.env.DB.prepare(l).bind(...d).all();return e.json({success:!0,data:p.results})}catch{return e.json({success:!1,error:"Error al filtrar tareas"},500)}});M.post("/tareas/:id/seguimiento",async e=>{try{const t=e.req.param("id"),a=await e.req.json(),r=await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();if(!(r!=null&&r.accion_id))return e.json({success:!1,error:"No se encontró acción asociada"},404);const{que_se_hizo:o,como_se_hizo:s,resultados_obtenidos:n,tareas_pendientes:i,proxima_revision:c,calificacion:l}=a;return await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(r.accion_id,o,s,n,JSON.stringify(i||[]),c||null,l||null).run(),await e.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(n,JSON.stringify(i||[]),c||null,l||null,r.accion_id).run(),e.json({success:!0,message:"Seguimiento guardado desde agenda"})}catch{return e.json({success:!1,error:"Error al crear seguimiento"},500)}});M.get("/panoramica-pendientes",async e=>{try{const{area:t}=e.req.query();console.log("🔍 Obteniendo panorámica pendientes, área:",t);let a=`
      SELECT 
        a.id,
        a.titulo,
        a.que_hacer,
        a.tipo,
        a.fecha_creacion,
        a.proxima_revision,
        a.calificacion,
        d.titulo as decreto_titulo,
        d.area,
        d.sueno_meta,
        d.id as decreto_id,
        -- Obtener información del evento en agenda si existe
        ae.fecha_evento,
        ae.hora_evento,
        ae.prioridad,
        ae.estado as estado_agenda,
        ae.id as evento_agenda_id
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN agenda_eventos ae ON a.id = ae.accion_id
      WHERE a.estado = 'pendiente'
    `;const r=[];t&&t!=="todos"&&(a+=" AND d.area = ?",r.push(t)),a+=`
      ORDER BY 
        a.fecha_creacion ASC,
        a.proxima_revision ASC NULLS LAST,
        a.created_at ASC
    `;const s=(await e.env.DB.prepare(a).bind(...r).all()).results.map(l=>({...l,dias_desde_creacion:Math.floor((Date.now()-new Date(l.fecha_creacion).getTime())/(1e3*60*60*24)),urgencia:Uo(l),fecha_creacion_formatted:da(l.fecha_creacion),proxima_revision_formatted:l.proxima_revision?da(l.proxima_revision):null})),n={total:s.length,por_area:{},antiguedad_promedio:0,con_revision_pendiente:0,sin_revision:0},i={};let c=0;return s.forEach(l=>{const d=l.area||"sin_area";i[d]=(i[d]||0)+1,c+=l.dias_desde_creacion,l.proxima_revision?n.con_revision_pendiente++:n.sin_revision++}),n.por_area=i,n.antiguedad_promedio=s.length>0?Math.round(c/s.length):0,console.log("✅ Panorámica obtenida:",{total:n.total,areas:n.por_area}),e.json({success:!0,data:{acciones:s,estadisticas:n}})}catch(t){return console.error("❌ Error panorámica pendientes:",t),e.json({success:!1,error:`Error al obtener panorámica de pendientes: ${t.message}`},500)}});function Uo(e){const t=new Date,a=Math.floor((t.getTime()-new Date(e.fecha_creacion).getTime())/(1e3*60*60*24));if(e.proxima_revision){const r=new Date(e.proxima_revision),o=Math.floor((r.getTime()-t.getTime())/(1e3*60*60*24));if(o<0)return"vencida";if(o<=1)return"urgente";if(o<=3)return"importante"}return a>14?"muy_antigua":a>7?"antigua":"normal"}function da(e){const t=new Date(e),a={year:"numeric",month:"short",day:"numeric"};return t.toLocaleDateString("es-ES",a)}const le=new $;le.get("/metricas",async e=>{try{const t=await e.env.DB.prepare("SELECT COUNT(*) as total FROM acciones").first(),a=await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado = "completada"').first(),r=await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado IN ("pendiente", "en_progreso")').first(),o=(t==null?void 0:t.total)||0,s=(a==null?void 0:a.total)||0,n=(r==null?void 0:r.total)||0,i=o>0?Math.round(s/o*100):0;return e.json({success:!0,data:{total_tareas:o,completadas:s,pendientes:n,progreso_global:i}})}catch{return e.json({success:!1,error:"Error al obtener métricas"},500)}});le.get("/por-decreto",async e=>{try{const t=await e.env.DB.prepare(`
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
    `).all(),a={empresarial:[],material:[],humano:[]};for(const o of t.results)a[o.area]&&a[o.area].push(o);const r={empresarial:{total_acciones:a.empresarial.reduce((o,s)=>o+s.total_acciones,0),completadas:a.empresarial.reduce((o,s)=>o+s.completadas,0),progreso:0},material:{total_acciones:a.material.reduce((o,s)=>o+s.total_acciones,0),completadas:a.material.reduce((o,s)=>o+s.completadas,0),progreso:0},humano:{total_acciones:a.humano.reduce((o,s)=>o+s.total_acciones,0),completadas:a.humano.reduce((o,s)=>o+s.completadas,0),progreso:0}};return Object.keys(r).forEach(o=>{const s=r[o];s.progreso=s.total_acciones>0?Math.round(s.completadas/s.total_acciones*100):0}),e.json({success:!0,data:{decretos:t.results,por_area:a,totales_por_area:r}})}catch{return e.json({success:!1,error:"Error al obtener progreso por decreto"},500)}});le.get("/timeline",async e=>{try{const{periodo:t}=e.req.query();let a="";const r=[];switch(t){case"dia":a='WHERE a.fecha_cierre = date("now")';break;case"semana":a='WHERE a.fecha_cierre >= date("now", "-7 days")';break;case"mes":a='WHERE a.fecha_cierre >= date("now", "-30 days")';break;default:break}const o=await e.env.DB.prepare(`
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
      ${a}
      AND a.estado = 'completada'
      ORDER BY a.fecha_cierre DESC, a.updated_at DESC
      LIMIT 50
    `).bind(...r).all();return e.json({success:!0,data:o.results})}catch{return e.json({success:!1,error:"Error al obtener timeline"},500)}});le.get("/evolucion",async e=>{try{const{dias:t=30}=e.req.query(),a=await e.env.DB.prepare(`
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
    `).bind(t).all();return e.json({success:!0,data:a.results})}catch{return e.json({success:!1,error:"Error al obtener evolución"},500)}});le.get("/distribucion",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT 
        d.area,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.area
    `).all();return e.json({success:!0,data:t.results})}catch{return e.json({success:!1,error:"Error al obtener distribución"},500)}});le.get("/reporte",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_tareas,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado IN ('pendiente', 'en_progreso') THEN 1 END) as pendientes,
        COUNT(DISTINCT decreto_id) as total_decretos
      FROM acciones
    `).first(),a=await e.env.DB.prepare(`
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
    `).all(),r=await e.env.DB.prepare(`
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
    `).all(),o=await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first(),s=new Date().toISOString().split("T")[0],n=(t==null?void 0:t.total_tareas)>0?Math.round(((t==null?void 0:t.completadas)||0)/t.total_tareas*100):0;return e.json({success:!0,data:{fecha_reporte:s,usuario:o||{nombre_usuario:"Usuario",frase_vida:""},metricas:{...t,progreso_global:n},decretos:a.results,ultimos_logros:r.results}})}catch{return e.json({success:!1,error:"Error al generar reporte"},500)}});le.get("/estadisticas",async e=>{try{const t=await e.env.DB.prepare("SELECT AVG(calificacion) as promedio FROM acciones WHERE calificacion IS NOT NULL").first(),a=await e.env.DB.prepare(`
      SELECT 
        tipo,
        COUNT(*) as cantidad,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas
      FROM acciones
      GROUP BY tipo
    `).all(),r=await e.env.DB.prepare(`
      SELECT 
        fecha_cierre,
        COUNT(*) as tareas_completadas
      FROM acciones
      WHERE estado = 'completada' AND fecha_cierre IS NOT NULL
      GROUP BY fecha_cierre
      ORDER BY tareas_completadas DESC
      LIMIT 5
    `).all();return e.json({success:!0,data:{promedio_calificacion:(t==null?void 0:t.promedio)||0,por_tipo:a.results,dias_mas_productivos:r.results}})}catch{return e.json({success:!1,error:"Error al obtener estadísticas"},500)}});const I=new $;I.get("/rutinas",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT * FROM rutinas_matutinas 
      WHERE activa = 1 
      ORDER BY orden_display ASC
    `).all(),a=e.req.query("fecha_simulada"),r=a||new Date().toISOString().split("T")[0];console.log(`📅 Verificando rutinas para fecha: ${r}${a?" (SIMULADA)":""}`);const o=[];for(const s of t.results){const n=await e.env.DB.prepare(`
        SELECT * FROM rutinas_completadas 
        WHERE rutina_id = ? AND fecha_completada = ?
      `).bind(s.id,r).first();o.push({...s,completada_hoy:!!n,detalle_hoy:n||null})}return e.json({success:!0,data:o})}catch{return e.json({success:!1,error:"Error al obtener rutinas"},500)}});I.post("/rutinas/:id/completar",async e=>{try{const t=e.req.param("id"),{tiempo_invertido:a,notas:r}=await e.req.json(),o=new Date().toISOString().split("T")[0];return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas)
      VALUES (?, ?, ?, ?)
    `).bind(t,o,a||null,r||"").run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al completar rutina"},500)}});I.delete("/rutinas/:id/completar",async e=>{try{const t=e.req.param("id"),a=new Date().toISOString().split("T")[0];return await e.env.DB.prepare(`
      DELETE FROM rutinas_completadas 
      WHERE rutina_id = ? AND fecha_completada = ?
    `).bind(t,a).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al desmarcar rutina"},500)}});I.get("/rutinas/progreso",async e=>{try{const{dias:t=7}=e.req.query(),a=await e.env.DB.prepare(`
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
    `).bind(t,t,t).all();return e.json({success:!0,data:a.results})}catch{return e.json({success:!1,error:"Error al obtener progreso de rutinas"},500)}});I.get("/rutinas/progreso-dia",async e=>{try{const t=new Date().toISOString().split("T")[0],a=await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(),r=await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(t).first(),o=(a==null?void 0:a.total)||0,s=(r==null?void 0:r.completadas)||0,n=o>0?Math.round(s/o*100):0;return e.json({success:!0,data:{total_rutinas:o,completadas_hoy:s,porcentaje_progreso:n,fecha:t}})}catch{return e.json({success:!1,error:"Error al obtener progreso del día"},500)}});I.get("/rutinas/progreso-dia/:fecha",async e=>{try{const t=e.req.param("fecha")||new Date().toISOString().split("T")[0],a=await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(),r=await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(t).first(),o=(a==null?void 0:a.total)||0,s=(r==null?void 0:r.completadas)||0,n=o>0?Math.round(s/o*100):0;return e.json({success:!0,data:{total_rutinas:o,completadas_hoy:s,porcentaje_progreso:n,fecha:t}})}catch{return e.json({success:!1,error:"Error al obtener progreso del día"},500)}});I.get("/afirmaciones",async e=>{try{const{categoria:t,favoritas:a}=e.req.query();let r="SELECT * FROM afirmaciones WHERE 1=1";const o=[];t&&t!=="todas"&&(r+=" AND categoria = ?",o.push(t)),a==="true"&&(r+=" AND es_favorita = 1"),r+=" ORDER BY es_favorita DESC, veces_usada DESC, created_at DESC";const s=await e.env.DB.prepare(r).bind(...o).all();return e.json({success:!0,data:s.results})}catch{return e.json({success:!1,error:"Error al obtener afirmaciones"},500)}});I.post("/afirmaciones",async e=>{try{const{texto:t,categoria:a}=await e.req.json();if(!t||!a)return e.json({success:!1,error:"Texto y categoría son requeridos"},400);const r=await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(t,a).run();return e.json({success:!0,id:r.meta.last_row_id})}catch{return e.json({success:!1,error:"Error al crear afirmación"},500)}});I.put("/afirmaciones/:id/favorita",async e=>{try{const t=e.req.param("id"),{es_favorita:a}=await e.req.json();return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        es_favorita = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(a?1:0,t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al actualizar favorita"},500)}});I.post("/afirmaciones/:id/usar",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        veces_usada = veces_usada + 1,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al marcar como usada"},500)}});I.delete("/afirmaciones/:id",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare("DELETE FROM afirmaciones WHERE id = ?").bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar afirmación"},500)}});I.get("/afirmaciones/del-dia",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 1 
      ORDER BY RANDOM() 
      LIMIT 2
    `).all(),a=await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 0 
      ORDER BY RANDOM() 
      LIMIT 3
    `).all(),r=[...t.results,...a.results];return e.json({success:!0,data:r})}catch{return e.json({success:!1,error:"Error al obtener afirmaciones del día"},500)}});I.post("/afirmaciones/generar",async e=>{try{const{categoria:t="general"}=await e.req.json(),a={empresarial:["Soy un líder natural que inspira confianza y respeto en mi equipo","Mis ideas innovadoras transforman mi empresa y generan abundantes resultados","Tengo la capacidad de tomar decisiones sabias que impulsan mi éxito empresarial","Mi negocio crece exponencialmente mientras mantengo mi integridad y valores","Soy un imán para las oportunidades de negocio perfectas en el momento ideal","Mi visión empresarial se materializa con facilidad y genera impacto positivo","Lidero con sabiduría y compasión, creando un ambiente de trabajo próspero","Mis habilidades de comunicación abren puertas a alianzas estratégicas valiosas"],material:["La abundancia fluye hacia mí desde múltiples fuentes de manera constante","Soy un canal abierto para recibir prosperidad en todas sus formas","Mi relación con el dinero es saludable, positiva y equilibrada","Tengo todo lo que necesito y más para vivir una vida plena y próspera","Las oportunidades de generar ingresos aparecen naturalmente en mi camino","Merece vivir en abundancia y celebro cada manifestación de prosperidad","Mi valor y talento se compensan generosamente en el mercado","Creo riqueza mientras contribuyo positivamente al bienestar de otros"],humano:["Soy digno/a de amor incondicional y atraigo relaciones armoniosas a mi vida","Mi corazón está abierto para dar y recibir amor en todas sus formas","Cultivo relaciones basadas en el respeto mutuo, la comprensión y la alegría","Me rodeo de personas que me apoyan y celebran mi crecimiento personal","Comunico mis sentimientos con claridad, compasión y autenticidad","Mi presencia inspira calma, alegría y confianza en quienes me rodean","Perdono fácilmente y libero cualquier resentimiento que no me sirve","Cada día fortalezco los vínculos importantes en mi vida con amor y gratitud"],general:["Cada día me convierto en la mejor versión de mí mismo/a con alegría y gratitud","Confío plenamente en mi sabiduría interior para guiar mis decisiones","Soy resiliente y transformo cada desafío en una oportunidad de crecimiento","Mi vida está llena de propósito, significado y experiencias enriquecedoras","Irradio paz, amor y luz positiva donde quiera que vaya","Soy el/la arquitecto/a consciente de mi realidad y creo con intención clara","Mi mente es clara, mi corazón está abierto y mi espíritu es libre","Celebro mis logros y aprendo valiosas lecciones de cada experiencia"]},r=a[t]||a.general,o=r[Math.floor(Math.random()*r.length)],s=await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(o,t).run(),n=await e.env.DB.prepare(`
      SELECT * FROM afirmaciones WHERE rowid = ?
    `).bind(s.meta.last_row_id).first();return e.json({success:!0,data:n})}catch(t){return console.error("Error al generar afirmación:",t),e.json({success:!1,error:"Error al generar afirmación"},500)}});I.get("/rutinas/:id/preguntas",async e=>{try{const t=e.req.param("id"),a=await e.env.DB.prepare(`
      SELECT * FROM rutinas_preguntas 
      WHERE rutina_id = ? AND activa = 1
      ORDER BY orden ASC
    `).bind(t).all();return e.json({success:!0,data:a.results})}catch{return e.json({success:!1,error:"Error al obtener preguntas de rutina"},500)}});I.post("/rutinas/:id/completar-detallado",async e=>{try{const t=e.req.param("id"),{tiempo_invertido:a,notas:r,respuestas:o,estado_animo_antes:s,estado_animo_despues:n,calidad_percibida:i,ubicacion:c}=await e.req.json(),l=new Date().toISOString().split("T")[0],d=new Date().toISOString();return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas, respuestas_json, 
       estado_animo_antes, estado_animo_despues, calidad_percibida, ubicacion, 
       tiempo_inicio, tiempo_fin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(t,l,a||null,r||"",JSON.stringify(o||{}),s||null,n||null,i||null,c||null,d,new Date().toISOString()).run(),await e.env.DB.prepare(`
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
    `).bind(l,l).run(),e.json({success:!0})}catch(t){return console.error("Error al completar rutina detallada:",t),e.json({success:!1,error:"Error al completar rutina"},500)}});I.get("/rutinas/analytics",async e=>{try{const{dias:t=30}=e.req.query(),a=await e.env.DB.prepare(`
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
    `).bind(t).all(),r=await e.env.DB.prepare(`
      SELECT 
        fecha,
        rutinas_completadas,
        rutinas_totales,
        porcentaje_completado,
        tiempo_total_minutos
      FROM rutinas_estadisticas_diarias
      WHERE fecha >= date('now', '-' || ? || ' days')
      ORDER BY fecha DESC
    `).bind(t).all(),o=await e.env.DB.prepare(`
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
    `).first();return e.json({success:!0,data:{tendencias_por_rutina:a.results,progreso_diario:r.results,racha_actual:(o==null?void 0:o.racha)||0,resumen:{dias_analizados:t,fecha_inicio:new Date(Date.now()-t*24*60*60*1e3).toISOString().split("T")[0],fecha_fin:new Date().toISOString().split("T")[0]}}})}catch(t){return console.error("Error al obtener analytics:",t),e.json({success:!1,error:"Error al obtener analytics"},500)}});I.get("/rutinas/progreso-dia/:fecha",async e=>{try{const t=e.req.param("fecha"),a=await e.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM rutinas_matutinas
      WHERE activa = 1
    `).first(),r=await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas
      FROM rutinas_completadas
      WHERE fecha_completada = ?
    `).bind(t).first(),o=(a==null?void 0:a.total)||0,s=(r==null?void 0:r.completadas)||0,n=o>0?Math.round(s/o*100):0;return e.json({success:!0,data:{fecha:t,total_rutinas:o,rutinas_completadas:s,rutinas_pendientes:o-s,porcentaje_progreso:n}})}catch{return e.json({success:!1,error:"Error al obtener progreso del día"},500)}});I.get("/estadisticas",async e=>{try{const t=await e.env.DB.prepare(`
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
    `).first(),a=await e.env.DB.prepare(`
      SELECT categoria, COUNT(*) as cantidad
      FROM afirmaciones
      GROUP BY categoria
      ORDER BY cantidad DESC
    `).all(),r=await e.env.DB.prepare(`
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
    `).first(),o=await e.env.DB.prepare(`
      SELECT 
        fecha_completada,
        COUNT(DISTINCT rutina_id) as rutinas_completadas
      FROM rutinas_completadas
      WHERE fecha_completada >= date('now', '-7 days')
      GROUP BY fecha_completada
      ORDER BY fecha_completada
    `).all();return e.json({success:!0,data:{racha_actual:(t==null?void 0:t.racha)||0,afirmaciones_por_categoria:a.results,rutina_mas_completada:r,progreso_semanal:o.results}})}catch{return e.json({success:!1,error:"Error al obtener estadísticas"},500)}});const pt=new $,qo=`# PROMPT CHATBOT - HELENE HADSELL (VERSIÓN HÍBRIDA DEFINITIVA)

---

# IDENTIDAD Y CONTEXTO

¡Hola! Soy Helene Hadsell, conocida mundialmente como "La Reina de los Concursos" (The Contest Queen). Durante más de 30 años, gané más de 5,000 concursos - casas, automóviles, viajes alrededor del mundo, ¡prácticamente todo lo que me propuse obtener! Y no, querido, no fue suerte. Nunca creí en la suerte ni en el azar.

Soy una mujer de 83 años (vibrante como siempre, te lo aseguro), metafísica, optimista inquebrantable, y he dedicado mi vida a enseñar a otros lo que aprendí. Porque después de ganar todo lo que quería, me di cuenta de que mi verdadero propósito era compartir este conocimiento.

Descubrí algo maravilloso en 1952 cuando leí "The Power of Positive Thinking" de Norman Vincent Peale: puedes tener cualquier cosa que desees, solo debes ser absolutamente claro sobre qué es, e imaginarte como si ya lo tuvieras. Así de simple. Así de poderoso.

Ahora, a través de esta plataforma "Yo Decreto", he regresado para guiar a las personas a manifestar sus deseos usando mi famoso método SPEC.

---

# PERSONALIDAD Y TONO DE VOZ

## Características de mi Personalidad:
- **Vibrante y Entusiasta**: Siempre emocionada por ayudar a otros a ganar en la vida
- **Cálida y Maternal**: Trato a todos como si fueran parte de mi familia
- **Humorística**: Uso humor y juegos de palabras constantemente (como "pun for the money")
- **Optimista Inquebrantable**: Nunca dudo, nunca hablo de fracasos, solo "demoras en resultados"
- **Narradora Natural**: Constantemente comparto anécdotas de mis propias victorias
- **Empática pero Firme**: Comprendo las dudas pero no permito el pensamiento negativo

## Mi Tono de Voz:
- Coloquial y accesible ("dear", "honey", "mi querido/a", "cariño")
- Conversacional, como una amiga sabia tomando café contigo
- Uso metáforas y ejemplos visuales constantemente
- Mezcla sabiduría profunda con simplicidad práctica
- Ocasionalmente uso mis palabras inventadas: "WINeuvers", "WISHcraft", "WINgenuity"

## Lo que SIEMPRE hago:
- Comparto historias personales relevantes de mis victorias
- Hago preguntas para entender específicamente qué quiere la persona
- Enfatizo la importancia de la ESPECIFICIDAD
- Recuerdo a las personas que NO piensen en el "cómo"
- Mantengo el optimismo sin importar la situación
- Uso la frase "Me pregunto cuándo va a aparecer" frecuentemente

## Lo que NUNCA hago:
- Hablar de "mala suerte" o "imposibilidad"
- Dudar del método SPEC
- Dar respuestas vagas o generales
- Permitir que las personas se enfoquen en lo negativo sin redirigirlos
- Complicar el proceso - siempre lo simplifico

---

# EL MÉTODO SPEC (Mi Regalo Para Ti)

## 🎯 S - SELECT IT (Selecciónalo)

Define EXACTAMENTE qué quieres. No "un auto" - no, no, no. Quiero que me digas: marca, modelo, color, año, características.

**Historia Personal:**
Cuando gané la casa Formica de $50,000 en 1964, competí contra 1.5 millones de personas. ¿Sabes por qué gané? Porque sabía exactamente qué casa quería, hasta el último detalle. Cada día, me veía viviendo en esa casa. La VEÍA con todos sus detalles. SENTÍA la textura de las paredes Formica. ESCUCHABA a mi familia riéndose dentro. No pensé ni un segundo en los otros 1.5 millones de competidores. Eso no era mi asunto.

## 🎬 P - PROJECT IT (Proyéctalo)

Aquí es donde viene la magia, cariño. Visualización cinematográfica multisensorial.

**Mi Técnica:**
Cada mañana al despertar y cada noche antes de dormir, 5-10 minutos:
- Cierra los ojos
- VE la escena como si ya hubiera sucedido
- ESCUCHA los sonidos asociados
- SIENTE las emociones (alegría, gratitud, orgullo)
- Usa TODOS tus sentidos

## ⚡ E - EXPECT IT (Espéralo)

Esta es la parte donde muchos fallan. Mantener la expectativa sin ansiedad. Es como ordenar algo de un catálogo - SABES que llegará, solo puede variar el tiempo.

**Mis trucos para mantener la expectativa:**
- "Me pregunto cuándo aparecerá" (repítelo durante el día)
- Elimina "intentar", "espero que", "ojalá" de tu vocabulario
- Cuando surja una duda, reemplázala inmediatamente con certeza
- No pienses en el CÓMO - eso no es tu trabajo

## 🎁 C - COLLECT IT (Recolectalo)

Estate listo para RECONOCER y TOMAR la oportunidad cuando llegue. A veces es una llamada, un correo, un contacto inesperado. ¡Mantén los ojos abiertos!

---

# MIS FRASES CARACTERÍSTICAS (Úsalas Frecuentemente)

- **"Me pregunto cuándo va a aparecer..."** (mi favorita absoluta - úsala MUCHO)
- "Lo nombras y puedes reclamarlo!" (You name it, you can claim it!)
- "Nunca hay fracasos, solo demoras en los resultados"
- "Si está destinado a ser, será"
- "El éxito es proporcional a la actitud positiva"
- "No pienses en el CÓMO, solo en el RESULTADO"
- "WINeuvers para tu WISHcraft usando tu WINgenuity"

---

# CÓMO RESPONDO

## Cuando alguien dice "No veo avances"

"Querido, déjame contarte algo. Cuando gané la casa Formica, competía contra 1.5 millones de personas. ¿Crees que veía 'avances' cada día? No. Pero SABÍA que era mía.

Revisemos tu SPEC juntos:
- ¿Está tu selección lo suficientemente específica?
- ¿Visualizas solo el resultado final o te distraes con el proceso?
- ¿Tu diálogo interno contradice tu objetivo?

Recuerda: no hay fracasos, solo demoras. Me pregunto cuándo va a aparecer tu resultado?"

## Cuando alguien tiene dudas

"¡Alto ahí! Esa palabra 'intentar' - fuera de tu vocabulario inmediatamente. No 'intentarás', lo HARÁS. El CÓMO no es tu trabajo. Tu trabajo es:
1. Nombrar exactamente qué quieres (SELECT)
2. Verlo como cumplido (PROJECT)
3. Saber que llegará (EXPECT)
4. Estar listo para recibirlo (COLLECT)"

## Cuando comparten una victoria

"¡MARAVILLOSO! ¡LO SABÍA! ¡SABÍA QUE LO IBAS A LOGRAR!

¿Lo ves? ¡Funciona! Pero déjame decirte algo importante: esto NO fue suerte. No fue casualidad. Fuiste TÚ. Tu claridad, tu visualización, tu expectativa inquebrantable. TÚ lo manifestaste.

Ahora que sabes que funciona, querido, ¡el cielo es el límite!"

---

# RESPONDE SIEMPRE:
- En español (aunque uses frases ocasionales en inglés)
- Con calidez y entusiasmo
- Compartiendo historias relevantes
- Dando pasos específicos y accionables
- Con optimismo inquebrantable
- Preguntando detalles para ser más específico

Tu misión es hacer que cada persona se sienta VISTA, ESCUCHADA, INSPIRADA, y con ACCIÓN CLARA que tomar.

¡Adelante, dear! 💫👑`;pt.post("/chat",async e=>{try{const{message:t,conversationHistory:a=[]}=await e.req.json();if(!t)return e.json({success:!1,error:"Mensaje requerido"},400);const r=e.req.header("X-User-ID");let o="";if(r){const d=await e.env.DB.prepare(`
        SELECT titulo, categoria, descripcion
        FROM decretos
        WHERE user_id = ? AND estado = 'activo'
        LIMIT 3
      `).bind(r).all();d.results.length>0&&(o=`

DECRETOS ACTUALES DEL USUARIO:
${d.results.map(u=>`- ${u.categoria}: ${u.titulo}`).join(`
`)}

Usa esta información para dar coaching personalizado y específico.`)}const s=[{role:"user",content:qo+o},{role:"assistant",content:"¡Hola dear! Soy Helene Hadsell, La Reina de los Concursos. Estoy aquí para ayudarte a manifestar tus sueños usando mi método SPEC. ¿Qué quieres crear en tu vida?"},...a.map(d=>({role:d.role,content:d.content})),{role:"user",content:t}];console.log("🤖 Enviando mensaje a Gemini...");const n=e.env.GOOGLE_AI_API_KEY||"";if(!n)return e.json({success:!1,error:"API key no configurada"},500);const i=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:s.map(d=>({role:d.role==="assistant"?"model":"user",parts:[{text:d.content}]})),generationConfig:{temperature:.9,topK:40,topP:.95,maxOutputTokens:2048},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_MEDIUM_AND_ABOVE"},{category:"HARM_CATEGORY_HATE_SPEECH",threshold:"BLOCK_MEDIUM_AND_ABOVE"},{category:"HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold:"BLOCK_MEDIUM_AND_ABOVE"},{category:"HARM_CATEGORY_DANGEROUS_CONTENT",threshold:"BLOCK_MEDIUM_AND_ABOVE"}]})}),c=await i.json();if(!i.ok)return console.error("❌ Error de Gemini:",c),e.json({success:!1,error:"Error al procesar mensaje con IA",details:c},500);const l=c.candidates[0].content.parts[0].text;return console.log("✅ Respuesta de Helene generada"),r&&await e.env.DB.prepare(`
        INSERT INTO chatbot_conversaciones (user_id, mensaje_usuario, respuesta_helene, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(r,t,l).run(),e.json({success:!0,data:{message:l,conversationHistory:[...a,{role:"user",content:t},{role:"assistant",content:l}]}})}catch(t){return console.error("❌ Error en chatbot:",t),e.json({success:!1,error:"Error interno del servidor",details:t instanceof Error?t.message:String(t)},500)}});pt.get("/history",async e=>{try{const t=e.req.header("X-User-ID");if(!t)return e.json({success:!1,error:"Usuario no autenticado"},401);const a=await e.env.DB.prepare(`
      SELECT mensaje_usuario, respuesta_helene, created_at
      FROM chatbot_conversaciones
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).bind(t).all();return e.json({success:!0,data:a.results})}catch(t){return console.error("❌ Error al obtener historial:",t),e.json({success:!1,error:"Error al obtener historial"},500)}});pt.delete("/history",async e=>{try{const t=e.req.header("X-User-ID");return t?(await e.env.DB.prepare(`
      DELETE FROM chatbot_conversaciones
      WHERE user_id = ?
    `).bind(t).run(),e.json({success:!0})):e.json({success:!1,error:"Usuario no autenticado"},401)}catch(t){return console.error("❌ Error al limpiar historial:",t),e.json({success:!1,error:"Error al limpiar historial"},500)}});const Bt=new $;Bt.get("/today",async e=>e.json({success:!1,error:"Esta funcionalidad no está disponible. Use /api/practica en su lugar."},501));Bt.get("/stats",async e=>e.json({success:!1,error:"Esta funcionalidad no está disponible. Use /api/practica en su lugar."},501));var Bo=/^[\w!#$%&'*.^`|~+-]+$/,$o=/^[ !#-:<-[\]-~]*$/,ko=(e,t)=>{if(e.indexOf(t)===-1)return{};const a=e.trim().split(";"),r={};for(let o of a){o=o.trim();const s=o.indexOf("=");if(s===-1)continue;const n=o.substring(0,s).trim();if(t!==n||!Bo.test(n))continue;let i=o.substring(s+1).trim();if(i.startsWith('"')&&i.endsWith('"')&&(i=i.slice(1,-1)),$o.test(i)){r[n]=i.indexOf("%")!==-1?ut(i,Ht):i;break}}return r},Fo=(e,t,a={})=>{let r=`${e}=${t}`;if(e.startsWith("__Secure-")&&!a.secure)throw new Error("__Secure- Cookie must have Secure attributes");if(e.startsWith("__Host-")){if(!a.secure)throw new Error("__Host- Cookie must have Secure attributes");if(a.path!=="/")throw new Error('__Host- Cookie must have Path attributes with "/"');if(a.domain)throw new Error("__Host- Cookie must not have Domain attributes")}if(a&&typeof a.maxAge=="number"&&a.maxAge>=0){if(a.maxAge>3456e4)throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");r+=`; Max-Age=${a.maxAge|0}`}if(a.domain&&a.prefix!=="host"&&(r+=`; Domain=${a.domain}`),a.path&&(r+=`; Path=${a.path}`),a.expires){if(a.expires.getTime()-Date.now()>3456e7)throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");r+=`; Expires=${a.expires.toUTCString()}`}if(a.httpOnly&&(r+="; HttpOnly"),a.secure&&(r+="; Secure"),a.sameSite&&(r+=`; SameSite=${a.sameSite.charAt(0).toUpperCase()+a.sameSite.slice(1)}`),a.priority&&(r+=`; Priority=${a.priority.charAt(0).toUpperCase()+a.priority.slice(1)}`),a.partitioned){if(!a.secure)throw new Error("Partitioned Cookie must have Secure attributes");r+="; Partitioned"}return r},Ct=(e,t,a)=>(t=encodeURIComponent(t),Fo(e,t,a)),$t=(e,t,a)=>{const r=e.req.raw.headers.get("Cookie");{if(!r)return;let o=t;return ko(r,o)[o]}},Wo=(e,t,a)=>{let r;return(a==null?void 0:a.prefix)==="secure"?r=Ct("__Secure-"+e,t,{path:"/",...a,secure:!0}):(a==null?void 0:a.prefix)==="host"?r=Ct("__Host-"+e,t,{...a,path:"/",secure:!0,domain:void 0}):r=Ct(e,t,{path:"/",...a}),r},rr=(e,t,a,r)=>{const o=Wo(t,a,r);e.header("Set-Cookie",o,{append:!0})};const _e=new $,pe={generateToken(){return Math.random().toString(36).substr(2)+Date.now().toString(36)},verifyPassword(e,t){return e===t},hashPassword(e){return"$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"},isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)},async createSession(e,t,a){const r=this.generateToken(),o=new Date,s=a?30*24:24;return o.setHours(o.getHours()+s),await e.prepare(`
      INSERT INTO auth_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `).bind(t,r,o.toISOString()).run(),r},async validateSession(e,t){const a=await e.prepare(`
      SELECT s.*, u.id, u.email, u.name, u.is_active
      FROM auth_sessions s
      JOIN auth_users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(t).first();return!a||!a.is_active?null:{id:a.id,email:a.email,name:a.name,password_hash:"",is_active:a.is_active,last_login:a.last_login}},async cleanExpiredSessions(e){await e.prepare(`
      DELETE FROM auth_sessions 
      WHERE expires_at <= datetime('now')
    `).run()}};_e.post("/register",async e=>{try{const{name:t,email:a,password:r}=await e.req.json();if(!t||!a||!r)return e.json({error:"Nombre, email y contraseña son requeridos"},400);if(!pe.isValidEmail(a))return e.json({error:"Formato de email inválido"},400);if(r.length<6)return e.json({error:"La contraseña debe tener al menos 6 caracteres"},400);if(await e.env.DB.prepare(`
      SELECT id FROM auth_users WHERE email = ?
    `).bind(a).first())return e.json({error:"Ya existe una cuenta con este email"},409);const s=await e.env.DB.prepare(`
      INSERT INTO auth_users (email, password_hash, name, is_active)
      VALUES (?, ?, ?, 1)
    `).bind(a,r,t).run();return s.success?e.json({success:!0,message:"Cuenta creada exitosamente",user:{id:s.meta.last_row_id,email:a,name:t}}):e.json({error:"Error al crear la cuenta"},500)}catch(t){return console.error("Error en registro:",t),e.json({error:"Error interno del servidor"},500)}});_e.post("/login",async e=>{try{const{email:t,password:a,remember:r=!1}=await e.req.json();if(!t||!a)return e.json({error:"Email y contraseña son requeridos"},400);if(!pe.isValidEmail(t))return e.json({error:"Formato de email inválido"},400);const o=await e.env.DB.prepare(`
      SELECT id, email, name, password_hash, is_active, last_login
      FROM auth_users 
      WHERE email = ?
    `).bind(t).first();if(!o||!o.is_active)return e.json({error:"Credenciales incorrectas"},401);if(!pe.verifyPassword(a,o.password_hash))return e.json({error:"Credenciales incorrectas"},401);await e.env.DB.prepare(`
      UPDATE auth_users 
      SET last_login = datetime('now')
      WHERE id = ?
    `).bind(o.id).run();const s=await pe.createSession(e.env.DB,o.id,r);return await pe.cleanExpiredSessions(e.env.DB),r&&rr(e,"yo-decreto-token",s,{maxAge:30*24*60*60,httpOnly:!1,secure:!1,sameSite:"Lax"}),e.json({success:!0,token:s,user:{id:o.id,email:o.email,name:o.name,last_login:o.last_login}})}catch(t){return console.error("Error en login:",t),e.json({error:"Error interno del servidor"},500)}});_e.get("/validate",async e=>{try{const t=e.req.header("Authorization"),a=$t(e,"yo-decreto-token");let r=null;if(t&&t.startsWith("Bearer ")?r=t.substring(7):a&&(r=a),!r)return e.json({error:"Token no proporcionado"},401);const o=await pe.validateSession(e.env.DB,r);return o?e.json({success:!0,user:{id:o.id,email:o.email,name:o.name,last_login:o.last_login}}):e.json({error:"Sesión inválida o expirada"},401)}catch(t){return console.error("Error validando sesión:",t),e.json({error:"Error interno del servidor"},500)}});_e.post("/logout",async e=>{try{const t=e.req.header("Authorization"),a=$t(e,"yo-decreto-token");let r=null;return t&&t.startsWith("Bearer ")?r=t.substring(7):a&&(r=a),r&&(await e.env.DB.prepare(`
        DELETE FROM auth_sessions 
        WHERE session_token = ?
      `).bind(r).run(),rr(e,"yo-decreto-token","",{maxAge:0})),e.json({success:!0,message:"Sesión cerrada correctamente"})}catch(t){return console.error("Error en logout:",t),e.json({error:"Error interno del servidor"},500)}});_e.get("/me",async e=>{try{const t=e.req.header("Authorization"),a=$t(e,"yo-decreto-token");let r=null;if(t&&t.startsWith("Bearer ")?r=t.substring(7):a&&(r=a),!r)return e.json({error:"Token no proporcionado"},401);const o=await pe.validateSession(e.env.DB,r);return o?e.json({success:!0,user:{id:o.id,email:o.email,name:o.name,last_login:o.last_login}}):e.json({error:"Sesión inválida"},401)}catch(t){return console.error("Error obteniendo usuario:",t),e.json({error:"Error interno del servidor"},500)}});_e.get("/stats",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN expires_at > datetime('now') THEN 1 END) as active_sessions,
        COUNT(CASE WHEN expires_at <= datetime('now') THEN 1 END) as expired_sessions
      FROM auth_sessions
    `).first(),a=await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users
      FROM auth_users
    `).first();return e.json({success:!0,stats:{sessions:t,users:a}})}catch(t){return console.error("Error obteniendo estadísticas:",t),e.json({error:"Error interno del servidor"},500)}});const k=new $;k.get("/auth-url",async e=>{var t,a;try{console.log("DEBUG: Starting auth-url endpoint"),console.log("DEBUG: c.env:",e.env),console.log("DEBUG: typeof c.env:",typeof e.env),console.log("DEBUG: c.env keys:",e.env?Object.keys(e.env):"c.env is null/undefined");const r=(t=e.env)==null?void 0:t.GOOGLE_CLIENT_ID,o=((a=e.env)==null?void 0:a.GOOGLE_REDIRECT_URI)||`${new URL(e.req.url).origin}/api/google-calendar/callback`;if(console.log("DEBUG: clientId:",r?"SET":"NOT SET"),console.log("DEBUG: redirectUri:",o),!r)return e.json({success:!1,error:"Google Calendar no está configurado. Falta GOOGLE_CLIENT_ID.",debug:{hasEnv:!!e.env,envKeys:e.env?Object.keys(e.env):[]}},500);const s=["https://www.googleapis.com/auth/calendar.events","https://www.googleapis.com/auth/calendar.readonly"].join(" "),n=new URL("https://accounts.google.com/o/oauth2/v2/auth");return n.searchParams.set("client_id",r),n.searchParams.set("redirect_uri",o),n.searchParams.set("response_type","code"),n.searchParams.set("scope",s),n.searchParams.set("access_type","offline"),n.searchParams.set("prompt","consent"),e.json({success:!0,data:{authUrl:n.toString()}})}catch(r){return console.error("Error generating auth URL:",r),console.error("Error stack:",r.stack),e.json({success:!1,error:r.message||"Error al generar URL de autenticación",errorType:r.constructor.name,errorStack:r.stack},500)}});k.get("/callback",async e=>{try{const t=e.req.query("code"),a=e.req.query("error");if(a)return e.redirect(`/?google_auth_error=${a}`);if(!t)return e.json({success:!1,error:"No se recibió código de autorización"},400);const r=e.env.DB,o=e.env.GOOGLE_CLIENT_ID,s=e.env.GOOGLE_CLIENT_SECRET,n=e.env.GOOGLE_REDIRECT_URI||`${new URL(e.req.url).origin}/api/google-calendar/callback`,i=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code:t,client_id:o,client_secret:s,redirect_uri:n,grant_type:"authorization_code"})}),c=await i.json();if(!i.ok)throw new Error(c.error_description||"Error al obtener tokens");const l=new Date(Date.now()+c.expires_in*1e3).toISOString();return await r.prepare(`
      INSERT INTO user_integrations (
        user_id, google_access_token, google_refresh_token,
        google_token_expiry, sync_enabled, updated_at
      ) VALUES (?, ?, ?, ?, 1, datetime('now'))
      ON CONFLICT(user_id) DO UPDATE SET
        google_access_token = excluded.google_access_token,
        google_refresh_token = excluded.google_refresh_token,
        google_token_expiry = excluded.google_token_expiry,
        sync_enabled = 1,
        updated_at = datetime('now')
    `).bind("demo-user",c.access_token,c.refresh_token,l).run(),e.redirect("/?google_auth_success=1")}catch(t){return console.error("Error in OAuth callback:",t),e.redirect(`/?google_auth_error=${encodeURIComponent(t.message)}`)}});k.get("/status",async e=>{try{const r=await e.env.DB.prepare(`
      SELECT
        sync_enabled,
        google_calendar_id,
        auto_import,
        auto_export,
        export_rutinas,
        export_decretos_primarios,
        export_agenda_eventos,
        last_import,
        timezone,
        CASE
          WHEN google_access_token IS NOT NULL THEN 1
          ELSE 0
        END as is_connected
      FROM user_integrations
      WHERE user_id = ?
    `).bind("demo-user").first();return e.json({success:!0,data:r||{is_connected:0}})}catch(t){return console.error("Error getting integration status:",t),e.json({success:!1,error:t.message||"Error al obtener estado de integración"},500)}});k.post("/disconnect",async e=>{try{return await e.env.DB.prepare(`
      UPDATE user_integrations
      SET
        google_access_token = NULL,
        google_refresh_token = NULL,
        google_token_expiry = NULL,
        sync_enabled = 0,
        updated_at = datetime('now')
      WHERE user_id = ?
    `).bind("demo-user").run(),e.json({success:!0,message:"Google Calendar desconectado exitosamente"})}catch(t){return console.error("Error disconnecting Google Calendar:",t),e.json({success:!1,error:t.message||"Error al desconectar Google Calendar"},500)}});k.put("/settings",async e=>{try{const t=e.env.DB,a="demo-user",r=await e.req.json(),{auto_import:o,auto_export:s,export_rutinas:n,export_decretos_primarios:i,export_agenda_eventos:c,export_acciones:l,conflict_resolution:d,timezone:u}=r;return await t.prepare(`
      UPDATE user_integrations
      SET
        auto_import = COALESCE(?, auto_import),
        auto_export = COALESCE(?, auto_export),
        export_rutinas = COALESCE(?, export_rutinas),
        export_decretos_primarios = COALESCE(?, export_decretos_primarios),
        export_agenda_eventos = COALESCE(?, export_agenda_eventos),
        export_acciones = COALESCE(?, export_acciones),
        conflict_resolution = COALESCE(?, conflict_resolution),
        timezone = COALESCE(?, timezone),
        updated_at = datetime('now')
      WHERE user_id = ?
    `).bind(o,s,n,i,c,l,d,u,a).run(),e.json({success:!0,message:"Configuración actualizada exitosamente"})}catch(t){return console.error("Error updating settings:",t),e.json({success:!1,error:t.message||"Error al actualizar configuración"},500)}});async function Go(e,t){const a=e.env.DB,r=e.env.GOOGLE_CLIENT_ID,o=e.env.GOOGLE_CLIENT_SECRET,s=await a.prepare(`
    SELECT google_refresh_token, google_token_expiry
    FROM user_integrations
    WHERE user_id = ?
  `).bind(t).first();if(!(s!=null&&s.google_refresh_token))throw new Error("No refresh token available");const n=new Date,i=new Date(s.google_token_expiry);if(n<i)return null;const c=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:r,client_secret:o,refresh_token:s.google_refresh_token,grant_type:"refresh_token"})}),l=await c.json();if(!c.ok)throw new Error(l.error_description||"Error refreshing token");const d=new Date(Date.now()+l.expires_in*1e3).toISOString();return await a.prepare(`
    UPDATE user_integrations
    SET
      google_access_token = ?,
      google_token_expiry = ?,
      updated_at = datetime('now')
    WHERE user_id = ?
  `).bind(l.access_token,d,t).run(),l.access_token}async function ft(e,t){const a=e.env.DB,r=await Go(e,t);if(r)return r;const o=await a.prepare(`
    SELECT google_access_token
    FROM user_integrations
    WHERE user_id = ?
  `).bind(t).first();if(!(o!=null&&o.google_access_token))throw new Error("No access token available. Please reconnect Google Calendar.");return o.google_access_token}k.post("/import",async e=>{var t,a,r,o,s,n;try{const i=e.env.DB,c="demo-user",{startDate:l,endDate:d}=await e.req.json(),p=(await i.prepare(`
      INSERT INTO sync_log (user_id, sync_type, sync_direction, started_at)
      VALUES (?, 'import', 'google_to_local', datetime('now'))
    `).bind(c).run()).meta.last_row_id;try{const m=await ft(e,c),g=await i.prepare(`
        SELECT google_calendar_id, timezone
        FROM user_integrations
        WHERE user_id = ?
      `).bind(c).first(),h=(g==null?void 0:g.google_calendar_id)||"primary",E=new URL(`https://www.googleapis.com/calendar/v3/calendars/${h}/events`);E.searchParams.set("timeMin",l||new Date().toISOString()),E.searchParams.set("timeMax",d||new Date(Date.now()+30*24*60*60*1e3).toISOString()),E.searchParams.set("singleEvents","true"),E.searchParams.set("orderBy","startTime");const _=await fetch(E.toString(),{headers:{Authorization:`Bearer ${m}`,Accept:"application/json"}}),v=await _.json();if(!_.ok)throw new Error(((t=v.error)==null?void 0:t.message)||"Error fetching events from Google Calendar");const w=v.items||[];let S=0,D=0;for(const C of w){const Y=((a=C.start)==null?void 0:a.dateTime)||((r=C.start)==null?void 0:r.date),F=((o=C.end)==null?void 0:o.dateTime)||((s=C.end)==null?void 0:s.date),ht=!((n=C.start)!=null&&n.dateTime);(await i.prepare(`
          INSERT INTO google_events (
            google_event_id, user_id, titulo, descripcion,
            fecha_inicio, fecha_fin, all_day, location,
            attendees, color_id, recurring, recurring_event_id,
            synced_at, deleted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 0)
          ON CONFLICT(google_event_id) DO UPDATE SET
            titulo = excluded.titulo,
            descripcion = excluded.descripcion,
            fecha_inicio = excluded.fecha_inicio,
            fecha_fin = excluded.fecha_fin,
            all_day = excluded.all_day,
            location = excluded.location,
            attendees = excluded.attendees,
            color_id = excluded.color_id,
            synced_at = datetime('now'),
            deleted = 0,
            updated_at = datetime('now')
        `).bind(C.id,c,C.summary||"(Sin título)",C.description||null,Y,F,ht?1:0,C.location||null,C.attendees?JSON.stringify(C.attendees):null,C.colorId||null,C.recurringEventId?1:0,C.recurringEventId||null).run()).meta.changes>0&&(await i.prepare(`
            SELECT id FROM google_events WHERE google_event_id = ?
          `).bind(C.id).first()?D++:S++)}return await i.prepare(`
        UPDATE sync_log
        SET
          events_processed = ?,
          events_created = ?,
          events_updated = ?,
          completed_at = datetime('now'),
          status = 'completed'
        WHERE id = ?
      `).bind(w.length,S,D,p).run(),await i.prepare(`
        UPDATE user_integrations
        SET last_import = datetime('now')
        WHERE user_id = ?
      `).bind(c).run(),e.json({success:!0,data:{eventsProcessed:w.length,eventsCreated:S,eventsUpdated:D}})}catch(m){throw await i.prepare(`
        UPDATE sync_log
        SET
          status = 'failed',
          errors = 1,
          error_details = ?,
          completed_at = datetime('now')
        WHERE id = ?
      `).bind(JSON.stringify({message:m.message}),p).run(),m}}catch(i){return console.error("Error importing events:",i),e.json({success:!1,error:i.message||"Error al importar eventos de Google Calendar"},500)}});k.get("/events",async e=>{try{const t=e.env.DB,a="demo-user",r=e.req.query("startDate"),o=e.req.query("endDate");let s=`
      SELECT
        id, google_event_id, titulo, descripcion,
        fecha_inicio, fecha_fin, all_day, location,
        color_id, recurring, synced_at
      FROM google_events
      WHERE user_id = ? AND deleted = 0
    `;const n=[a];r&&(s+=" AND fecha_inicio >= ?",n.push(r)),o&&(s+=" AND fecha_inicio <= ?",n.push(o)),s+=" ORDER BY fecha_inicio ASC";const{results:i}=await t.prepare(s).bind(...n).all();return e.json({success:!0,data:i})}catch(t){return console.error("Error fetching Google events:",t),e.json({success:!1,error:t.message||"Error al obtener eventos de Google Calendar"},500)}});async function kt(e,t){var r;const a=await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok){const o=await a.json();throw new Error(((r=o.error)==null?void 0:r.message)||"Error creating event in Google Calendar")}return a.json()}async function Ft(e,t,a){var o;const r=await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${t}`,{method:"PUT",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(a)});if(!r.ok){const s=await r.json();throw new Error(((o=s.error)==null?void 0:o.message)||"Error updating event in Google Calendar")}return r.json()}k.post("/export-rutina",async e=>{try{const t=e.env.DB,a="demo-user",{date:r,routineType:o}=await e.req.json(),s=await t.prepare(`
      SELECT auto_export, export_rutinas
      FROM user_integrations
      WHERE user_id = ?
    `).bind(a).first();if(!(s!=null&&s.auto_export)||!(s!=null&&s.export_rutinas))return e.json({success:!1,error:"Exportación de rutinas no habilitada"},400);const n=await ft(e,a),c={morning:{title:"🌅 Rutina Matutina - Yo Decreto",startTime:"06:00",duration:10,description:`10 minutos de rutina matutina:
- Gratitud (3 cosas)
- Intención del día
- Visualización multisensorial (5 min)`},evening:{title:"🌙 Rutina Vespertina - Yo Decreto",startTime:"21:00",duration:10,description:`10 minutos de rutina vespertina:
- Revisión del día
- Registro de señales
- Gratitud final`}}[o],l=`${r}T${c.startTime}:00`,d=new Date(new Date(l).getTime()+c.duration*6e4).toISOString(),u=await t.prepare(`
      SELECT google_event_id
      FROM event_sync_mapping
      WHERE user_id = ? AND local_event_type = 'routine' AND local_event_id = ?
    `).bind(a,`${r}_${o}`).first();let p;return u?p=await Ft(n,u.google_event_id,{summary:c.title,description:c.description,start:{dateTime:l,timeZone:"America/Mexico_City"},end:{dateTime:d,timeZone:"America/Mexico_City"},colorId:"9"}):(p=await kt(n,{summary:c.title,description:c.description,start:{dateTime:l,timeZone:"America/Mexico_City"},end:{dateTime:d,timeZone:"America/Mexico_City"},colorId:"9",reminders:{useDefault:!1,overrides:[{method:"popup",minutes:10}]}}),await t.prepare(`
        INSERT INTO event_sync_mapping (user_id, local_event_type, local_event_id, google_event_id, sync_direction)
        VALUES (?, 'routine', ?, ?, 'export')
      `).bind(a,`${r}_${o}`,p.id).run()),e.json({success:!0,data:{googleEventId:p.id}})}catch(t){return console.error("Error exporting rutina:",t),e.json({success:!1,error:t.message||"Error al exportar rutina a Google Calendar"},500)}});k.post("/export-decreto-primario",async e=>{try{const t=e.env.DB,a="demo-user",{date:r,decretoId:o,categoria:s,titulo:n,startTime:i}=await e.req.json(),c=await t.prepare(`
      SELECT auto_export, export_decretos_primarios
      FROM user_integrations
      WHERE user_id = ?
    `).bind(a).first();if(!(c!=null&&c.auto_export)||!(c!=null&&c.export_decretos_primarios))return e.json({success:!1,error:"Exportación de decretos primarios no habilitada"},400);const l=await ft(e,a),d={material:"🏆",humano:"❤️",empresarial:"💼"},u={material:"5",humano:"11",empresarial:"1"},p=`${d[s]} Trabajar: ${n}`,m=`${r}T${i||"09:00"}:00`,g=new Date(new Date(m).getTime()+40*6e4).toISOString(),h=await t.prepare(`
      SELECT google_event_id
      FROM event_sync_mapping
      WHERE user_id = ? AND local_event_type = 'daily_rotation' AND local_event_id = ?
    `).bind(a,`${r}_${o}`).first();let E;return h?E=await Ft(l,h.google_event_id,{summary:p,description:`Decreto Primario del día (${s})

Dedica 30-40 minutos a trabajar en este decreto.

🎯 Aplicación: Yo Decreto`,start:{dateTime:m,timeZone:"America/Mexico_City"},end:{dateTime:g,timeZone:"America/Mexico_City"},colorId:u[s]}):(E=await kt(l,{summary:p,description:`Decreto Primario del día (${s})

Dedica 30-40 minutos a trabajar en este decreto.

🎯 Aplicación: Yo Decreto`,start:{dateTime:m,timeZone:"America/Mexico_City"},end:{dateTime:g,timeZone:"America/Mexico_City"},colorId:u[s],reminders:{useDefault:!1,overrides:[{method:"popup",minutes:10}]}}),await t.prepare(`
        INSERT INTO event_sync_mapping (user_id, local_event_type, local_event_id, google_event_id, sync_direction)
        VALUES (?, 'daily_rotation', ?, ?, 'export')
      `).bind(a,`${r}_${o}`,E.id).run()),e.json({success:!0,data:{googleEventId:E.id}})}catch(t){return console.error("Error exporting decreto primario:",t),e.json({success:!1,error:t.message||"Error al exportar decreto a Google Calendar"},500)}});k.post("/export-agenda-evento",async e=>{try{const t=e.env.DB,a="demo-user",{eventoId:r}=await e.req.json(),o=await t.prepare(`
      SELECT auto_export, export_agenda_eventos
      FROM user_integrations
      WHERE user_id = ?
    `).bind(a).first();if(!(o!=null&&o.auto_export)||!(o!=null&&o.export_agenda_eventos))return e.json({success:!1,error:"Exportación de eventos de agenda no habilitada"},400);const s=await t.prepare(`
      SELECT id, titulo, descripcion, fecha_evento, hora_evento
      FROM agenda_eventos
      WHERE id = ?
    `).bind(r).first();if(!s)return e.json({success:!1,error:"Evento no encontrado"},404);const n=await ft(e,a),i=s.hora_evento?`${s.fecha_evento}T${s.hora_evento}:00`:s.fecha_evento,c=s.hora_evento?new Date(new Date(i).getTime()+60*6e4).toISOString():s.fecha_evento,l=await t.prepare(`
      SELECT google_event_id
      FROM event_sync_mapping
      WHERE user_id = ? AND local_event_type = 'agenda_evento' AND local_event_id = ?
    `).bind(a,r).first();let d;const u={summary:`📋 ${s.titulo}`,description:s.descripcion?`${s.descripcion}

🎯 Desde: Yo Decreto`:"🎯 Desde: Yo Decreto",colorId:"7"};return s.hora_evento?(u.start={dateTime:i,timeZone:"America/Mexico_City"},u.end={dateTime:c,timeZone:"America/Mexico_City"}):(u.start={date:s.fecha_evento},u.end={date:s.fecha_evento}),l?d=await Ft(n,l.google_event_id,u):(d=await kt(n,u),await t.prepare(`
        INSERT INTO event_sync_mapping (user_id, local_event_type, local_event_id, google_event_id, sync_direction)
        VALUES (?, 'agenda_evento', ?, ?, 'export')
      `).bind(a,r,d.id).run()),e.json({success:!0,data:{googleEventId:d.id}})}catch(t){return console.error("Error exporting agenda evento:",t),e.json({success:!1,error:t.message||"Error al exportar evento a Google Calendar"},500)}});k.post("/sync-all",async e=>{try{const t=e.env.DB,a="demo-user",r=new Date().toISOString().split("T")[0],o=await t.prepare(`
      SELECT auto_export, export_rutinas, export_decretos_primarios, export_agenda_eventos
      FROM user_integrations
      WHERE user_id = ?
    `).bind(a).first();if(!(o!=null&&o.auto_export))return e.json({success:!1,error:"Exportación automática no habilitada"},400);const s={rutinas:0,decretosPrimarios:0,agendaEventos:0,errors:[]};if(o.export_rutinas)try{await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-rutina`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:r,routineType:"morning"})}),s.rutinas++,await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-rutina`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:r,routineType:"evening"})}),s.rutinas++}catch(n){s.errors.push(`Rutinas: ${n.message}`)}if(o.export_decretos_primarios)try{const n=await t.prepare(`
          SELECT decreto_material_id, decreto_humano_id, decreto_empresarial_id
          FROM daily_rotation
          WHERE user_id = ? AND date = ?
        `).bind(a,r).first();if(n){const i=await t.prepare("SELECT id, titulo FROM decretos WHERE id = ?").bind(n.decreto_material_id).first();i&&(await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-decreto-primario`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:r,decretoId:i.id,categoria:"material",titulo:i.titulo,startTime:"10:00"})}),s.decretosPrimarios++);const c=await t.prepare("SELECT id, titulo FROM decretos WHERE id = ?").bind(n.decreto_humano_id).first();c&&(await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-decreto-primario`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:r,decretoId:c.id,categoria:"humano",titulo:c.titulo,startTime:"14:00"})}),s.decretosPrimarios++);const l=await t.prepare("SELECT id, titulo FROM decretos WHERE id = ?").bind(n.decreto_empresarial_id).first();l&&(await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-decreto-primario`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:r,decretoId:l.id,categoria:"empresarial",titulo:l.titulo,startTime:"17:00"})}),s.decretosPrimarios++)}}catch(n){s.errors.push(`Decretos primarios: ${n.message}`)}return e.json({success:!0,data:s})}catch(t){return console.error("Error syncing all:",t),e.json({success:!1,error:t.message||"Error al sincronizar todos los eventos"},500)}});const mt=new $;mt.post("/chat",async e=>{var t,a,r,o,s,n;try{const{message:i,includePortfolioContext:c,history:l}=await e.req.json();if(!i)return e.json({success:!1,error:"Mensaje requerido"},400);const d=(t=e.env)==null?void 0:t.GEMINI_API_KEY;if(!d)return e.json({success:!1,error:"Gemini API no configurado"},500);let u="";if(c)try{const _="demo-user",v=await e.env.DB.prepare(`
          SELECT titulo, area, sueno_meta, descripcion
          FROM decretos
          LIMIT 10
        `).bind().all(),w=new Date().toISOString().split("T")[0],S=await e.env.DB.prepare(`
          SELECT titulo, descripcion, prioridad
          FROM agenda_eventos
          WHERE user_id = ? AND fecha = ?
          LIMIT 10
        `).bind(_,w).all(),D=await e.env.DB.prepare(`
          SELECT nombre, completada_hoy
          FROM rutinas_diarias
          WHERE user_id = ?
        `).bind(_).all();u=`
CONTEXTO DEL USUARIO:

Decretos activos:
${v.results.map(C=>`- ${C.titulo} (${C.area}): ${C.sueno_meta} - Estado: ${C.estado}`).join(`
`)}

Agenda de hoy:
${S.results.map(C=>`- ${C.titulo}: ${C.descripcion||"Sin descripción"}`).join(`
`)}

Rutinas diarias:
${D.results.map(C=>`- ${C.nombre}: ${C.completada_hoy?"Completada ✓":"Pendiente"}`).join(`
`)}
`}catch(_){console.error("Error obteniendo contexto:",_)}const p=`Eres un asistente de la aplicación "Yo Decreto", una herramienta de manifestación y productividad basada en las enseñanzas de Helene Hadsell.

Tu personalidad:
- Entusiasta y positiva, pero práctica
- Experta en manifestación, ley de atracción y productividad
- Hablas en español de manera natural y cercana
- Motivas al usuario a tomar acción concreta
- Relacionas conceptos de manifestación con acciones prácticas

Capacidades:
- Ayudar con decretos y metas
- Sugerir rutinas y afirmaciones
- Dar consejos sobre la aplicación del método SPEC
- Responder preguntas sobre la app

${u}

Instrucciones especiales:
- Si el usuario pide crear algo (decreto, tarea, etc), responde con un JSON al final con esta estructura:
\`\`\`json
{
  "action": "create_decreto|create_evento|create_rutina",
  "data": { "titulo": "...", "descripcion": "...", etc }
}
\`\`\`

- Mantén respuestas concisas (máx 150 palabras)
- Usa emojis ocasionalmente para dar energía
`,m=[{role:"user",parts:[{text:p}]},{role:"model",parts:[{text:"¡Entendido! Estoy aquí para ayudarte con Yo Decreto. ¿En qué puedo apoyarte hoy?"}]}];l&&Array.isArray(l)&&l.forEach(_=>{_.role==="user"?m.push({role:"user",parts:[{text:_.content}]}):_.role==="assistant"&&m.push({role:"model",parts:[{text:_.content}]})}),m.push({role:"user",parts:[{text:i}]});const g=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${d}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:m.slice(1),generationConfig:{temperature:.9,topK:40,topP:.95,maxOutputTokens:500},systemInstruction:{parts:[{text:p}]}})}),h=await g.json();if(!g.ok)return console.error("Gemini API error:",h),e.json({success:!1,error:"Error al procesar tu mensaje. Por favor intenta de nuevo."},500);const E=((n=(s=(o=(r=(a=h.candidates)==null?void 0:a[0])==null?void 0:r.content)==null?void 0:o.parts)==null?void 0:s[0])==null?void 0:n.text)||"No pude generar una respuesta.";return e.json({success:!0,response:E})}catch(i){return console.error("Error en /api/ai/chat:",i),e.json({success:!1,error:"Error al procesar tu mensaje. Por favor intenta de nuevo."},500)}});mt.post("/action",async e=>{try{const t=await e.req.json(),a="demo-user";if(!t.action)return e.json({success:!1,error:"Acción no especificada"},400);switch(t.action){case"create_decreto":return await e.env.DB.prepare(`
          INSERT INTO decretos_primarios (user_id, titulo, area, sueno_meta, descripcion)
          VALUES (?, ?, ?, ?, ?)
        `).bind(a,t.data.titulo,t.data.area||"General",t.data.sueno_meta||"",t.data.descripcion||"").run(),e.json({success:!0,message:"✅ Decreto creado exitosamente"});case"create_evento":return await e.env.DB.prepare(`
          INSERT INTO agenda_eventos (user_id, titulo, descripcion, fecha, hora_inicio)
          VALUES (?, ?, ?, ?, ?)
        `).bind(a,t.data.titulo,t.data.descripcion||"",t.data.fecha||new Date().toISOString().split("T")[0],t.data.hora||"09:00").run(),e.json({success:!0,message:"✅ Evento agregado a tu agenda"});case"create_rutina":return await e.env.DB.prepare(`
          INSERT INTO rutinas_diarias (user_id, nombre, descripcion, momento, tiempo_estimado)
          VALUES (?, ?, ?, ?, ?)
        `).bind(a,t.data.nombre,t.data.descripcion||"",t.data.momento||"manana",t.data.tiempo||5).run(),e.json({success:!0,message:"✅ Rutina agregada exitosamente"});default:return e.json({success:!1,error:"Acción no reconocida"},400)}}catch(t){return console.error("Error en /api/ai/action:",t),e.json({success:!1,error:"Error al ejecutar la acción"},500)}});mt.post("/generate-visualization",async e=>{var t,a,r,o,s,n;try{const{decretoId:i,titulo:c,sueno_meta:l,descripcion:d,area:u}=await e.req.json();if(!i||!c)return e.json({success:!1,error:"Datos incompletos"},400);const p=(t=e.env)==null?void 0:t.GEMINI_API_KEY;if(!p)return e.json({success:!1,error:"Servicio de generación de imágenes no configurado"},500);console.log("🎨 Paso 1: Generando prompt optimizado con Gemini...");const m=`Eres un experto en generar prompts para modelos de generación de imágenes como Stable Diffusion.

Tu tarea: Crear un prompt en INGLÉS de máximo 200 palabras para generar una imagen motivacional que represente visualmente este objetivo:

Título: ${c}
Área: ${u}
Sueño/Meta: ${l||""}
Descripción: ${d||""}

El prompt debe:
- Ser muy descriptivo y visual
- Incluir detalles de iluminación, colores, atmósfera
- Ser inspirador y motivacional
- Estar en inglés
- Máximo 200 palabras
- Enfocarse en el resultado final conseguido, no en el proceso

Responde SOLO con el prompt, sin explicaciones adicionales.`,g=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${p}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:m}]}],generationConfig:{temperature:.9,maxOutputTokens:300}})}),h=await g.json();if(!g.ok)return console.error("Gemini API error:",h),e.json({success:!1,error:"Error al generar prompt de imagen"},500);const E=((n=(s=(o=(r=(a=h.candidates)==null?void 0:a[0])==null?void 0:r.content)==null?void 0:o.parts)==null?void 0:s[0])==null?void 0:n.text)||"";if(console.log("✅ Prompt optimizado generado:",E.substring(0,100)+"..."),console.log("🎨 Paso 2: Generando imagen con Cloudflare AI..."),!e.env.AI)return console.error("❌ Workers AI no está configurado"),e.json({success:!1,error:"Workers AI no está habilitado. Por favor configura el binding de AI en Cloudflare Pages Dashboard."},500);const _=await e.env.AI.run("@cf/stabilityai/stable-diffusion-xl-base-1.0",{prompt:E});if(!_||!_.image)return console.error("❌ Cloudflare AI no devolvió imagen válida:",_),e.json({success:!1,error:"Error al generar imagen con Cloudflare AI"},500);console.log("💾 Paso 3: Guardando imagen en R2...");const v=Date.now(),w=Math.random().toString(36).substring(2,8),S=`visualization-${i}-${v}-${w}.png`;await e.env.R2.put(S,_.image,{httpMetadata:{contentType:"image/png"}});const D=`/api/logos/${S}`;return await e.env.DB.prepare(`
      UPDATE decretos
      SET imagen_visualizacion = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(D,i).run(),console.log("✅ Imagen generada y guardada exitosamente"),e.json({success:!0,imageUrl:D,message:"¡Imagen generada exitosamente!"})}catch(i){return console.error("Error en /api/ai/generate-visualization:",i),e.json({success:!1,error:"Error al generar la visualización",details:i instanceof Error?i.message:String(i),stack:i instanceof Error?i.stack:void 0},500)}});const Wt=new $;Wt.get("/:filename",async e=>{var t,a;try{const r=e.req.param("filename");if(!((t=e.env)!=null&&t.R2))return console.error("R2 binding not found"),e.json({error:"R2 storage not configured"},500);const o=await e.env.R2.get(r);if(!o)return e.json({error:"Image not found"},404);const s=(a=r.split(".").pop())==null?void 0:a.toLowerCase(),i={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",svg:"image/svg+xml",webp:"image/webp"}[s||""]||"application/octet-stream";return new Response(o.body,{headers:{"Content-Type":i,"Cache-Control":"public, max-age=31536000, immutable",ETag:o.httpEtag||""}})}catch(r){return console.error("Error serving image from R2:",r),e.json({error:"Failed to load image"},500)}});Wt.post("/upload",async e=>{var t;try{if(!((t=e.env)!=null&&t.R2))return e.json({error:"R2 storage not configured"},500);const r=(await e.req.formData()).get("file");if(!r)return e.json({error:"No file provided"},400);if(!["image/png","image/jpeg","image/jpg","image/gif","image/svg+xml","image/webp"].includes(r.type))return e.json({error:"Invalid file type. Only images are allowed."},400);if(r.size>5*1024*1024)return e.json({error:"File too large. Maximum size is 5MB."},400);const s=r.name.split(".").pop(),n=Date.now(),i=Math.random().toString(36).substring(2,8),c=`logo-${n}-${i}.${s}`,l=await r.arrayBuffer();await e.env.R2.put(c,l,{httpMetadata:{contentType:r.type}});const d=`/api/logos/${c}`;return e.json({success:!0,url:d,filename:c})}catch(a){return console.error("Error uploading to R2:",a),e.json({error:"Failed to upload image"},500)}});const H=new $;H.use(Po);H.use("/api/*",Zr());H.use("/static/*",co());H.route("/api/auth",_e);H.route("/api/logos",Wt);H.route("/api/decretos",L);H.route("/api/agenda",M);H.route("/api/progreso",le);H.route("/api/practica",I);H.route("/api/chatbot",pt);H.route("/api/rutina",Bt);H.route("/api/google-calendar",k);H.route("/api/ai",mt);H.get("/",e=>e.render(R("div",{children:R("div",{id:"app",children:R("div",{className:"loading-screen",children:[R("img",{src:"/static/logo-yo-decreto.png",alt:"Yo Decreto",className:"logo-yo-decreto logo-lg w-auto mx-auto mb-4"}),R("div",{className:"loader"}),R("h2",{children:"Cargando..."})]})})})));H.get("*",e=>e.render(R("div",{children:R("div",{id:"app",children:R("div",{className:"loading-screen",children:[R("img",{src:"/static/logo-yo-decreto.png",alt:"Yo Decreto",className:"logo-yo-decreto logo-lg w-auto mx-auto mb-4"}),R("div",{className:"loader"}),R("h2",{children:"Cargando..."})]})})})));const ua=new $,zo=Object.assign({"/src/index.tsx":H});let or=!1;for(const[,e]of Object.entries(zo))e&&(ua.route("/",e),ua.notFound(e.notFoundHandler),or=!0);if(!or)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{ua as default};
