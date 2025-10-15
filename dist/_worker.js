var na=Object.defineProperty;var zt=e=>{throw TypeError(e)};var ia=(e,t,r)=>t in e?na(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var T=(e,t,r)=>ia(e,typeof t!="symbol"?t+"":t,r),gt=(e,t,r)=>t.has(e)||zt("Cannot "+r);var f=(e,t,r)=>(gt(e,t,"read from private field"),r?r.call(e):t.get(e)),w=(e,t,r)=>t.has(e)?zt("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),y=(e,t,r,a)=>(gt(e,t,"write to private field"),a?a.call(e,r):t.set(e,r),r),D=(e,t,r)=>(gt(e,t,"access private method"),r);var Vt=(e,t,r,a)=>({set _(s){y(e,t,s,r)},get _(){return f(e,t,a)}});var Sr={Stringify:1},k=(e,t)=>{const r=new String(e);return r.isEscaped=!0,r.callbacks=t,r},ca=/[&<>'"]/,Rr=async(e,t)=>{let r="";t||(t=[]);const a=await Promise.all(e);for(let s=a.length-1;r+=a[s],s--,!(s<0);s--){let o=a[s];typeof o=="object"&&t.push(...o.callbacks||[]);const n=o.isEscaped;if(o=await(typeof o=="object"?o.toString():o),typeof o=="object"&&t.push(...o.callbacks||[]),o.isEscaped??n)r+=o;else{const i=[r];ce(o,i),r=i[0]}}return k(r,t)},ce=(e,t)=>{const r=e.search(ca);if(r===-1){t[0]+=e;return}let a,s,o=0;for(s=r;s<e.length;s++){switch(e.charCodeAt(s)){case 34:a="&quot;";break;case 39:a="&#39;";break;case 38:a="&amp;";break;case 60:a="&lt;";break;case 62:a="&gt;";break;default:continue}t[0]+=e.substring(o,s)+a,o=s+1}t[0]+=e.substring(o,s)},Or=e=>{const t=e.callbacks;if(!(t!=null&&t.length))return e;const r=[e],a={};return t.forEach(s=>s({phase:Sr.Stringify,buffer:r,context:a})),r[0]},wr=async(e,t,r,a,s)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const o=e.callbacks;return o!=null&&o.length?(s?s[0]+=e:s=[e],Promise.all(o.map(i=>i({phase:t,buffer:s,context:a}))).then(i=>Promise.all(i.filter(Boolean).map(c=>wr(c,t,!1,a,s))).then(()=>s[0]))):Promise.resolve(e)},da=(e,...t)=>{const r=[""];for(let a=0,s=e.length-1;a<s;a++){r[0]+=e[a];const o=Array.isArray(t[a])?t[a].flat(1/0):[t[a]];for(let n=0,i=o.length;n<i;n++){const c=o[n];if(typeof c=="string")ce(c,r);else if(typeof c=="number")r[0]+=c;else{if(typeof c=="boolean"||c===null||c===void 0)continue;if(typeof c=="object"&&c.isEscaped)if(c.callbacks)r.unshift("",c);else{const d=c.toString();d instanceof Promise?r.unshift("",d):r[0]+=d}else c instanceof Promise?r.unshift("",c):ce(c.toString(),r)}}}return r[0]+=e.at(-1),r.length===1?"callbacks"in r?k(Or(k(r[0],r.callbacks))):k(r[0]):Rr(r,r.callbacks)},Mt=Symbol("RENDERER"),Nt=Symbol("ERROR_HANDLER"),N=Symbol("STASH"),Cr=Symbol("INTERNAL"),la=Symbol("MEMO"),dt=Symbol("PERMALINK"),Yt=e=>(e[Cr]=!0,e),Dr=e=>({value:t,children:r})=>{if(!r)return;const a={children:[{tag:Yt(()=>{e.push(t)}),props:{}}]};Array.isArray(r)?a.children.push(...r.flat()):a.children.push(r),a.children.push({tag:Yt(()=>{e.pop()}),props:{}});const s={tag:"",props:a,type:""};return s[Nt]=o=>{throw e.pop(),o},s},br=e=>{const t=[e],r=Dr(t);return r.values=t,r.Provider=r,Ie.push(r),r},Ie=[],Pt=e=>{const t=[e],r=a=>{t.push(a.value);let s;try{s=a.children?(Array.isArray(a.children)?new jr("",{},a.children):a.children).toString():""}finally{t.pop()}return s instanceof Promise?s.then(o=>k(o,o.callbacks)):k(s)};return r.values=t,r.Provider=r,r[Mt]=Dr(t),Ie.push(r),r},xe=e=>e.values.at(-1),tt={title:[],script:["src"],style:["data-href"],link:["href"],meta:["name","httpEquiv","charset","itemProp"]},At={},rt="data-precedence",Ye=e=>Array.isArray(e)?e:[e],Jt=new WeakMap,Kt=(e,t,r,a)=>({buffer:s,context:o})=>{if(!s)return;const n=Jt.get(o)||{};Jt.set(o,n);const i=n[e]||(n[e]=[]);let c=!1;const d=tt[e];if(d.length>0){e:for(const[,l]of i)for(const u of d)if(((l==null?void 0:l[u])??null)===(r==null?void 0:r[u])){c=!0;break e}}if(c?s[0]=s[0].replaceAll(t,""):d.length>0?i.push([t,r,a]):i.unshift([t,r,a]),s[0].indexOf("</head>")!==-1){let l;if(a===void 0)l=i.map(([u])=>u);else{const u=[];l=i.map(([p,,m])=>{let _=u.indexOf(m);return _===-1&&(u.push(m),_=u.length-1),[p,_]}).sort((p,m)=>p[1]-m[1]).map(([p])=>p)}l.forEach(u=>{s[0]=s[0].replaceAll(u,"")}),s[0]=s[0].replace(/(?=<\/head>)/,l.join(""))}},Je=(e,t,r)=>k(new V(e,r,Ye(t??[])).toString()),Ke=(e,t,r,a)=>{if("itemProp"in r)return Je(e,t,r);let{precedence:s,blocking:o,...n}=r;s=a?s??"":void 0,a&&(n[rt]=s);const i=new V(e,n,Ye(t||[])).toString();return i instanceof Promise?i.then(c=>k(i,[...c.callbacks||[],Kt(e,c,n,s)])):k(i,[Kt(e,i,n,s)])},ua=({children:e,...t})=>{const r=Ht();if(r){const a=xe(r);if(a==="svg"||a==="head")return new V("title",t,Ye(e??[]))}return Ke("title",e,t,!1)},pa=({children:e,...t})=>{const r=Ht();return["src","async"].some(a=>!t[a])||r&&xe(r)==="head"?Je("script",e,t):Ke("script",e,t,!1)},fa=({children:e,...t})=>["href","precedence"].every(r=>r in t)?(t["data-href"]=t.href,delete t.href,Ke("style",e,t,!0)):Je("style",e,t),ma=({children:e,...t})=>["onLoad","onError"].some(r=>r in t)||t.rel==="stylesheet"&&(!("precedence"in t)||"disabled"in t)?Je("link",e,t):Ke("link",e,t,"precedence"in t),Ea=({children:e,...t})=>{const r=Ht();return r&&xe(r)==="head"?Je("meta",e,t):Ke("meta",e,t,!1)},Nr=(e,{children:t,...r})=>new V(e,r,Ye(t??[])),ha=e=>(typeof e.action=="function"&&(e.action=dt in e.action?e.action[dt]:void 0),Nr("form",e)),Ar=(e,t)=>(typeof t.formAction=="function"&&(t.formAction=dt in t.formAction?t.formAction[dt]:void 0),Nr(e,t)),_a=e=>Ar("input",e),ga=e=>Ar("button",e);const vt=Object.freeze(Object.defineProperty({__proto__:null,button:ga,form:ha,input:_a,link:ma,meta:Ea,script:pa,style:fa,title:ua},Symbol.toStringTag,{value:"Module"}));var va=new Map([["className","class"],["htmlFor","for"],["crossOrigin","crossorigin"],["httpEquiv","http-equiv"],["itemProp","itemprop"],["fetchPriority","fetchpriority"],["noModule","nomodule"],["formAction","formaction"]]),lt=e=>va.get(e)||e,Ir=(e,t)=>{for(const[r,a]of Object.entries(e)){const s=r[0]==="-"||!/[A-Z]/.test(r)?r:r.replace(/[A-Z]/g,o=>`-${o.toLowerCase()}`);t(s,a==null?null:typeof a=="number"?s.match(/^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/)?`${a}`:`${a}px`:a)}},qe=void 0,Ht=()=>qe,Ta=e=>/[A-Z]/.test(e)&&e.match(/^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/)?e.replace(/([A-Z])/g,"-$1").toLowerCase():e,ya=["area","base","br","col","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"],Sa=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","download","formnovalidate","hidden","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"],Ut=(e,t)=>{for(let r=0,a=e.length;r<a;r++){const s=e[r];if(typeof s=="string")ce(s,t);else{if(typeof s=="boolean"||s===null||s===void 0)continue;s instanceof V?s.toStringToBuffer(t):typeof s=="number"||s.isEscaped?t[0]+=s:s instanceof Promise?t.unshift("",s):Ut(s,t)}}},V=class{constructor(e,t,r){T(this,"tag");T(this,"props");T(this,"key");T(this,"children");T(this,"isEscaped",!0);T(this,"localContexts");this.tag=e,this.props=t,this.children=r}get type(){return this.tag}get ref(){return this.props.ref||null}toString(){var t,r;const e=[""];(t=this.localContexts)==null||t.forEach(([a,s])=>{a.values.push(s)});try{this.toStringToBuffer(e)}finally{(r=this.localContexts)==null||r.forEach(([a])=>{a.values.pop()})}return e.length===1?"callbacks"in e?Or(k(e[0],e.callbacks)).toString():e[0]:Rr(e,e.callbacks)}toStringToBuffer(e){const t=this.tag,r=this.props;let{children:a}=this;e[0]+=`<${t}`;const s=qe&&xe(qe)==="svg"?o=>Ta(lt(o)):o=>lt(o);for(let[o,n]of Object.entries(r))if(o=s(o),o!=="children"){if(o==="style"&&typeof n=="object"){let i="";Ir(n,(c,d)=>{d!=null&&(i+=`${i?";":""}${c}:${d}`)}),e[0]+=' style="',ce(i,e),e[0]+='"'}else if(typeof n=="string")e[0]+=` ${o}="`,ce(n,e),e[0]+='"';else if(n!=null)if(typeof n=="number"||n.isEscaped)e[0]+=` ${o}="${n}"`;else if(typeof n=="boolean"&&Sa.includes(o))n&&(e[0]+=` ${o}=""`);else if(o==="dangerouslySetInnerHTML"){if(a.length>0)throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");a=[k(n.__html)]}else if(n instanceof Promise)e[0]+=` ${o}="`,e.unshift('"',n);else if(typeof n=="function"){if(!o.startsWith("on")&&o!=="ref")throw new Error(`Invalid prop '${o}' of type 'function' supplied to '${t}'.`)}else e[0]+=` ${o}="`,ce(n.toString(),e),e[0]+='"'}if(ya.includes(t)&&a.length===0){e[0]+="/>";return}e[0]+=">",Ut(a,e),e[0]+=`</${t}>`}},Tt=class extends V{toStringToBuffer(e){const{children:t}=this,r=this.tag.call(null,{...this.props,children:t.length<=1?t[0]:t});if(!(typeof r=="boolean"||r==null))if(r instanceof Promise)if(Ie.length===0)e.unshift("",r);else{const a=Ie.map(s=>[s,s.values.at(-1)]);e.unshift("",r.then(s=>(s instanceof V&&(s.localContexts=a),s)))}else r instanceof V?r.toStringToBuffer(e):typeof r=="number"||r.isEscaped?(e[0]+=r,r.callbacks&&(e.callbacks||(e.callbacks=[]),e.callbacks.push(...r.callbacks))):ce(r,e)}},jr=class extends V{toStringToBuffer(e){Ut(this.children,e)}},Xt=(e,t,...r)=>{t??(t={}),r.length&&(t.children=r.length===1?r[0]:r);const a=t.key;delete t.key;const s=at(e,t,r);return s.key=a,s},Zt=!1,at=(e,t,r)=>{if(!Zt){for(const a in At)vt[a][Mt]=At[a];Zt=!0}return typeof e=="function"?new Tt(e,t,r):vt[e]?new Tt(vt[e],t,r):e==="svg"||e==="head"?(qe||(qe=Pt("")),new V(e,t,[new Tt(qe,{value:e},r)])):new V(e,t,r)},Ra=({children:e})=>new jr("",{children:e},Array.isArray(e)?e:e?[e]:[]);function R(e,t,r){let a;if(!t||!("children"in t))a=at(e,t,[]);else{const s=t.children;a=Array.isArray(s)?at(e,t,s):at(e,t,[s])}return a.key=r,a}var Qt=(e,t,r)=>(a,s)=>{let o=-1;return n(0);async function n(i){if(i<=o)throw new Error("next() called multiple times");o=i;let c,d=!1,l;if(e[i]?(l=e[i][0][0],a.req.routeIndex=i):l=i===e.length&&s||void 0,l)try{c=await l(a,()=>n(i+1))}catch(u){if(u instanceof Error&&t)a.error=u,c=await t(u,a),d=!0;else throw u}else a.finalized===!1&&r&&(c=await r(a));return c&&(a.finalized===!1||d)&&(a.res=c),a}},Oa=Symbol(),wa=async(e,t=Object.create(null))=>{const{all:r=!1,dot:a=!1}=t,o=(e instanceof Hr?e.raw.headers:e.headers).get("Content-Type");return o!=null&&o.startsWith("multipart/form-data")||o!=null&&o.startsWith("application/x-www-form-urlencoded")?Ca(e,{all:r,dot:a}):{}};async function Ca(e,t){const r=await e.formData();return r?Da(r,t):{}}function Da(e,t){const r=Object.create(null);return e.forEach((a,s)=>{t.all||s.endsWith("[]")?ba(r,s,a):r[s]=a}),t.dot&&Object.entries(r).forEach(([a,s])=>{a.includes(".")&&(Na(r,a,s),delete r[a])}),r}var ba=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},Na=(e,t,r)=>{let a=e;const s=t.split(".");s.forEach((o,n)=>{n===s.length-1?a[o]=r:((!a[o]||typeof a[o]!="object"||Array.isArray(a[o])||a[o]instanceof File)&&(a[o]=Object.create(null)),a=a[o])})},Lr=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Aa=e=>{const{groups:t,path:r}=Ia(e),a=Lr(r);return ja(a,t)},Ia=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,a)=>{const s=`@${a}`;return t.push([s,r]),s}),{groups:t,path:e}},ja=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[a]=t[r];for(let s=e.length-1;s>=0;s--)if(e[s].includes(a)){e[s]=e[s].replace(a,t[r][1]);break}}return e},Qe={},La=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const a=`${e}#${t}`;return Qe[a]||(r[2]?Qe[a]=t&&t[0]!==":"&&t[0]!=="*"?[a,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:Qe[a]=[e,r[1],!0]),Qe[a]}return null},ft=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},xa=e=>ft(e,decodeURI),xr=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let a=r;for(;a<t.length;a++){const s=t.charCodeAt(a);if(s===37){const o=t.indexOf("?",a),n=t.slice(r,o===-1?void 0:o);return xa(n.includes("%25")?n.replace(/%25/g,"%2525"):n)}else if(s===63)break}return t.slice(r,a)},Ma=e=>{const t=xr(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},Re=(e,t,...r)=>(r.length&&(t=Re(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),Mr=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let a="";return t.forEach(s=>{if(s!==""&&!/\:/.test(s))a+="/"+s;else if(/\:/.test(s))if(/\?/.test(s)){r.length===0&&a===""?r.push("/"):r.push(a);const o=s.replace("?","");a+="/"+o,r.push(a)}else a+="/"+s}),r.filter((s,o,n)=>n.indexOf(s)===o)},yt=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?ft(e,qt):e):e,Pr=(e,t,r)=>{let a;if(!r&&t&&!/[%+]/.test(t)){let n=e.indexOf(`?${t}`,8);for(n===-1&&(n=e.indexOf(`&${t}`,8));n!==-1;){const i=e.charCodeAt(n+t.length+1);if(i===61){const c=n+t.length+2,d=e.indexOf("&",c);return yt(e.slice(c,d===-1?void 0:d))}else if(i==38||isNaN(i))return"";n=e.indexOf(`&${t}`,n+1)}if(a=/[%+]/.test(e),!a)return}const s={};a??(a=/[%+]/.test(e));let o=e.indexOf("?",8);for(;o!==-1;){const n=e.indexOf("&",o+1);let i=e.indexOf("=",o);i>n&&n!==-1&&(i=-1);let c=e.slice(o+1,i===-1?n===-1?void 0:n:i);if(a&&(c=yt(c)),o=n,c==="")continue;let d;i===-1?d="":(d=e.slice(i+1,n===-1?void 0:n),a&&(d=yt(d))),r?(s[c]&&Array.isArray(s[c])||(s[c]=[]),s[c].push(d)):s[c]??(s[c]=d)}return t?s[t]:s},Pa=Pr,Ha=(e,t)=>Pr(e,t,!0),qt=decodeURIComponent,er=e=>ft(e,qt),Ce,B,te,Ur,qr,It,re,fr,Hr=(fr=class{constructor(e,t="/",r=[[]]){w(this,te);T(this,"raw");w(this,Ce);w(this,B);T(this,"routeIndex",0);T(this,"path");T(this,"bodyCache",{});w(this,re,e=>{const{bodyCache:t,raw:r}=this,a=t[e];if(a)return a;const s=Object.keys(t)[0];return s?t[s].then(o=>(s==="json"&&(o=JSON.stringify(o)),new Response(o)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,y(this,B,r),y(this,Ce,{})}param(e){return e?D(this,te,Ur).call(this,e):D(this,te,qr).call(this)}query(e){return Pa(this.url,e)}queries(e){return Ha(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,a)=>{t[a]=r}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await wa(this,e))}json(){return f(this,re).call(this,"text").then(e=>JSON.parse(e))}text(){return f(this,re).call(this,"text")}arrayBuffer(){return f(this,re).call(this,"arrayBuffer")}blob(){return f(this,re).call(this,"blob")}formData(){return f(this,re).call(this,"formData")}addValidatedData(e,t){f(this,Ce)[e]=t}valid(e){return f(this,Ce)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Oa](){return f(this,B)}get matchedRoutes(){return f(this,B)[0].map(([[,e]])=>e)}get routePath(){return f(this,B)[0].map(([[,e]])=>e)[this.routeIndex].path}},Ce=new WeakMap,B=new WeakMap,te=new WeakSet,Ur=function(e){const t=f(this,B)[0][this.routeIndex][1][e],r=D(this,te,It).call(this,t);return r&&/\%/.test(r)?er(r):r},qr=function(){const e={},t=Object.keys(f(this,B)[0][this.routeIndex][1]);for(const r of t){const a=D(this,te,It).call(this,f(this,B)[0][this.routeIndex][1][r]);a!==void 0&&(e[r]=/\%/.test(a)?er(a):a)}return e},It=function(e){return f(this,B)[1]?f(this,B)[1][e]:e},re=new WeakMap,fr),Ua="text/plain; charset=UTF-8",St=(e,t)=>({"Content-Type":e,...t}),Fe,$e,X,De,Z,U,We,be,Ne,me,Ge,ze,ae,Oe,mr,qa=(mr=class{constructor(e,t){w(this,ae);w(this,Fe);w(this,$e);T(this,"env",{});w(this,X);T(this,"finalized",!1);T(this,"error");w(this,De);w(this,Z);w(this,U);w(this,We);w(this,be);w(this,Ne);w(this,me);w(this,Ge);w(this,ze);T(this,"render",(...e)=>(f(this,be)??y(this,be,t=>this.html(t)),f(this,be).call(this,...e)));T(this,"setLayout",e=>y(this,We,e));T(this,"getLayout",()=>f(this,We));T(this,"setRenderer",e=>{y(this,be,e)});T(this,"header",(e,t,r)=>{this.finalized&&y(this,U,new Response(f(this,U).body,f(this,U)));const a=f(this,U)?f(this,U).headers:f(this,me)??y(this,me,new Headers);t===void 0?a.delete(e):r!=null&&r.append?a.append(e,t):a.set(e,t)});T(this,"status",e=>{y(this,De,e)});T(this,"set",(e,t)=>{f(this,X)??y(this,X,new Map),f(this,X).set(e,t)});T(this,"get",e=>f(this,X)?f(this,X).get(e):void 0);T(this,"newResponse",(...e)=>D(this,ae,Oe).call(this,...e));T(this,"body",(e,t,r)=>D(this,ae,Oe).call(this,e,t,r));T(this,"text",(e,t,r)=>!f(this,me)&&!f(this,De)&&!t&&!r&&!this.finalized?new Response(e):D(this,ae,Oe).call(this,e,t,St(Ua,r)));T(this,"json",(e,t,r)=>D(this,ae,Oe).call(this,JSON.stringify(e),t,St("application/json",r)));T(this,"html",(e,t,r)=>{const a=s=>D(this,ae,Oe).call(this,s,t,St("text/html; charset=UTF-8",r));return typeof e=="object"?wr(e,Sr.Stringify,!1,{}).then(a):a(e)});T(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});T(this,"notFound",()=>(f(this,Ne)??y(this,Ne,()=>new Response),f(this,Ne).call(this,this)));y(this,Fe,e),t&&(y(this,Z,t.executionCtx),this.env=t.env,y(this,Ne,t.notFoundHandler),y(this,ze,t.path),y(this,Ge,t.matchResult))}get req(){return f(this,$e)??y(this,$e,new Hr(f(this,Fe),f(this,ze),f(this,Ge))),f(this,$e)}get event(){if(f(this,Z)&&"respondWith"in f(this,Z))return f(this,Z);throw Error("This context has no FetchEvent")}get executionCtx(){if(f(this,Z))return f(this,Z);throw Error("This context has no ExecutionContext")}get res(){return f(this,U)||y(this,U,new Response(null,{headers:f(this,me)??y(this,me,new Headers)}))}set res(e){if(f(this,U)&&e){e=new Response(e.body,e);for(const[t,r]of f(this,U).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const a=f(this,U).headers.getSetCookie();e.headers.delete("set-cookie");for(const s of a)e.headers.append("set-cookie",s)}else e.headers.set(t,r)}y(this,U,e),this.finalized=!0}get var(){return f(this,X)?Object.fromEntries(f(this,X)):{}}},Fe=new WeakMap,$e=new WeakMap,X=new WeakMap,De=new WeakMap,Z=new WeakMap,U=new WeakMap,We=new WeakMap,be=new WeakMap,Ne=new WeakMap,me=new WeakMap,Ge=new WeakMap,ze=new WeakMap,ae=new WeakSet,Oe=function(e,t,r){const a=f(this,U)?new Headers(f(this,U).headers):f(this,me)??new Headers;if(typeof t=="object"&&"headers"in t){const o=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[n,i]of o)n.toLowerCase()==="set-cookie"?a.append(n,i):a.set(n,i)}if(r)for(const[o,n]of Object.entries(r))if(typeof n=="string")a.set(o,n);else{a.delete(o);for(const i of n)a.append(o,i)}const s=typeof t=="number"?t:(t==null?void 0:t.status)??f(this,De);return new Response(e,{status:s,headers:a})},mr),A="ALL",Ba="all",ka=["get","post","put","delete","options","patch"],Br="Can not add a route since the matcher is already built.",kr=class extends Error{},Fa="__COMPOSED_HANDLER",$a=e=>e.text("404 Not Found",404),tr=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},W,I,$r,G,ue,st,ot,Er,Fr=(Er=class{constructor(t={}){w(this,I);T(this,"get");T(this,"post");T(this,"put");T(this,"delete");T(this,"options");T(this,"patch");T(this,"all");T(this,"on");T(this,"use");T(this,"router");T(this,"getPath");T(this,"_basePath","/");w(this,W,"/");T(this,"routes",[]);w(this,G,$a);T(this,"errorHandler",tr);T(this,"onError",t=>(this.errorHandler=t,this));T(this,"notFound",t=>(y(this,G,t),this));T(this,"fetch",(t,...r)=>D(this,I,ot).call(this,t,r[1],r[0],t.method));T(this,"request",(t,r,a,s)=>t instanceof Request?this.fetch(r?new Request(t,r):t,a,s):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${Re("/",t)}`,r),a,s)));T(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(D(this,I,ot).call(this,t.request,t,void 0,t.request.method))})});[...ka,Ba].forEach(o=>{this[o]=(n,...i)=>(typeof n=="string"?y(this,W,n):D(this,I,ue).call(this,o,f(this,W),n),i.forEach(c=>{D(this,I,ue).call(this,o,f(this,W),c)}),this)}),this.on=(o,n,...i)=>{for(const c of[n].flat()){y(this,W,c);for(const d of[o].flat())i.map(l=>{D(this,I,ue).call(this,d.toUpperCase(),f(this,W),l)})}return this},this.use=(o,...n)=>(typeof o=="string"?y(this,W,o):(y(this,W,"*"),n.unshift(o)),n.forEach(i=>{D(this,I,ue).call(this,A,f(this,W),i)}),this);const{strict:a,...s}=t;Object.assign(this,s),this.getPath=a??!0?t.getPath??xr:Ma}route(t,r){const a=this.basePath(t);return r.routes.map(s=>{var n;let o;r.errorHandler===tr?o=s.handler:(o=async(i,c)=>(await Qt([],r.errorHandler)(i,()=>s.handler(i,c))).res,o[Fa]=s.handler),D(n=a,I,ue).call(n,s.method,s.path,o)}),this}basePath(t){const r=D(this,I,$r).call(this);return r._basePath=Re(this._basePath,t),r}mount(t,r,a){let s,o;a&&(typeof a=="function"?o=a:(o=a.optionHandler,a.replaceRequest===!1?s=c=>c:s=a.replaceRequest));const n=o?c=>{const d=o(c);return Array.isArray(d)?d:[d]}:c=>{let d;try{d=c.executionCtx}catch{}return[c.env,d]};s||(s=(()=>{const c=Re(this._basePath,t),d=c==="/"?0:c.length;return l=>{const u=new URL(l.url);return u.pathname=u.pathname.slice(d)||"/",new Request(u,l)}})());const i=async(c,d)=>{const l=await r(s(c.req.raw),...n(c));if(l)return l;await d()};return D(this,I,ue).call(this,A,Re(t,"*"),i),this}},W=new WeakMap,I=new WeakSet,$r=function(){const t=new Fr({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,y(t,G,f(this,G)),t.routes=this.routes,t},G=new WeakMap,ue=function(t,r,a){t=t.toUpperCase(),r=Re(this._basePath,r);const s={basePath:this._basePath,path:r,method:t,handler:a};this.router.add(t,r,[a,s]),this.routes.push(s)},st=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},ot=function(t,r,a,s){if(s==="HEAD")return(async()=>new Response(null,await D(this,I,ot).call(this,t,r,a,"GET")))();const o=this.getPath(t,{env:a}),n=this.router.match(s,o),i=new qa(t,{path:o,matchResult:n,env:a,executionCtx:r,notFoundHandler:f(this,G)});if(n[0].length===1){let d;try{d=n[0][0][0][0](i,async()=>{i.res=await f(this,G).call(this,i)})}catch(l){return D(this,I,st).call(this,l,i)}return d instanceof Promise?d.then(l=>l||(i.finalized?i.res:f(this,G).call(this,i))).catch(l=>D(this,I,st).call(this,l,i)):d??f(this,G).call(this,i)}const c=Qt(n[0],this.errorHandler,f(this,G));return(async()=>{try{const d=await c(i);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return D(this,I,st).call(this,d,i)}})()},Er),ut="[^/]+",He=".*",Ue="(?:|/.*)",we=Symbol(),Wa=new Set(".\\+*[^]$()");function Ga(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===He||e===Ue?1:t===He||t===Ue?-1:e===ut?1:t===ut?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var Ee,he,z,hr,jt=(hr=class{constructor(){w(this,Ee);w(this,he);w(this,z,Object.create(null))}insert(t,r,a,s,o){if(t.length===0){if(f(this,Ee)!==void 0)throw we;if(o)return;y(this,Ee,r);return}const[n,...i]=t,c=n==="*"?i.length===0?["","",He]:["","",ut]:n==="/*"?["","",Ue]:n.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(c){const l=c[1];let u=c[2]||ut;if(l&&c[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw we;if(d=f(this,z)[u],!d){if(Object.keys(f(this,z)).some(p=>p!==He&&p!==Ue))throw we;if(o)return;d=f(this,z)[u]=new jt,l!==""&&y(d,he,s.varIndex++)}!o&&l!==""&&a.push([l,f(d,he)])}else if(d=f(this,z)[n],!d){if(Object.keys(f(this,z)).some(l=>l.length>1&&l!==He&&l!==Ue))throw we;if(o)return;d=f(this,z)[n]=new jt}d.insert(i,r,a,s,o)}buildRegExpStr(){const r=Object.keys(f(this,z)).sort(Ga).map(a=>{const s=f(this,z)[a];return(typeof f(s,he)=="number"?`(${a})@${f(s,he)}`:Wa.has(a)?`\\${a}`:a)+s.buildRegExpStr()});return typeof f(this,Ee)=="number"&&r.unshift(`#${f(this,Ee)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},Ee=new WeakMap,he=new WeakMap,z=new WeakMap,hr),pt,Ve,_r,za=(_r=class{constructor(){w(this,pt,{varIndex:0});w(this,Ve,new jt)}insert(e,t,r){const a=[],s=[];for(let n=0;;){let i=!1;if(e=e.replace(/\{[^}]+\}/g,c=>{const d=`@\\${n}`;return s[n]=[d,c],n++,i=!0,d}),!i)break}const o=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let n=s.length-1;n>=0;n--){const[i]=s[n];for(let c=o.length-1;c>=0;c--)if(o[c].indexOf(i)!==-1){o[c]=o[c].replace(i,s[n][1]);break}}return f(this,Ve).insert(o,t,a,f(this,pt),r),a}buildRegExp(){let e=f(this,Ve).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],a=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,o,n)=>o!==void 0?(r[++t]=Number(o),"$()"):(n!==void 0&&(a[Number(n)]=++t),"")),[new RegExp(`^${e}`),r,a]}},pt=new WeakMap,Ve=new WeakMap,_r),Wr=[],Va=[/^$/,[],Object.create(null)],nt=Object.create(null);function Gr(e){return nt[e]??(nt[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function Ya(){nt=Object.create(null)}function Ja(e){var d;const t=new za,r=[];if(e.length===0)return Va;const a=e.map(l=>[!/\*|\/:/.test(l[0]),...l]).sort(([l,u],[p,m])=>l?1:p?-1:u.length-m.length),s=Object.create(null);for(let l=0,u=-1,p=a.length;l<p;l++){const[m,_,E]=a[l];m?s[_]=[E.map(([g])=>[g,Object.create(null)]),Wr]:u++;let h;try{h=t.insert(_,u,m)}catch(g){throw g===we?new kr(_):g}m||(r[u]=E.map(([g,v])=>{const O=Object.create(null);for(v-=1;v>=0;v--){const[S,b]=h[v];O[S]=b}return[g,O]}))}const[o,n,i]=t.buildRegExp();for(let l=0,u=r.length;l<u;l++)for(let p=0,m=r[l].length;p<m;p++){const _=(d=r[l][p])==null?void 0:d[1];if(!_)continue;const E=Object.keys(_);for(let h=0,g=E.length;h<g;h++)_[E[h]]=i[_[E[h]]]}const c=[];for(const l in n)c[l]=r[n[l]];return[o,c,s]}function ye(e,t){if(e){for(const r of Object.keys(e).sort((a,s)=>s.length-a.length))if(Gr(r).test(t))return[...e[r]]}}var se,oe,Le,zr,Vr,gr,Ka=(gr=class{constructor(){w(this,Le);T(this,"name","RegExpRouter");w(this,se);w(this,oe);y(this,se,{[A]:Object.create(null)}),y(this,oe,{[A]:Object.create(null)})}add(e,t,r){var i;const a=f(this,se),s=f(this,oe);if(!a||!s)throw new Error(Br);a[e]||[a,s].forEach(c=>{c[e]=Object.create(null),Object.keys(c[A]).forEach(d=>{c[e][d]=[...c[A][d]]})}),t==="/*"&&(t="*");const o=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const c=Gr(t);e===A?Object.keys(a).forEach(d=>{var l;(l=a[d])[t]||(l[t]=ye(a[d],t)||ye(a[A],t)||[])}):(i=a[e])[t]||(i[t]=ye(a[e],t)||ye(a[A],t)||[]),Object.keys(a).forEach(d=>{(e===A||e===d)&&Object.keys(a[d]).forEach(l=>{c.test(l)&&a[d][l].push([r,o])})}),Object.keys(s).forEach(d=>{(e===A||e===d)&&Object.keys(s[d]).forEach(l=>c.test(l)&&s[d][l].push([r,o]))});return}const n=Mr(t)||[t];for(let c=0,d=n.length;c<d;c++){const l=n[c];Object.keys(s).forEach(u=>{var p;(e===A||e===u)&&((p=s[u])[l]||(p[l]=[...ye(a[u],l)||ye(a[A],l)||[]]),s[u][l].push([r,o-d+c+1]))})}}match(e,t){Ya();const r=D(this,Le,zr).call(this);return this.match=(a,s)=>{const o=r[a]||r[A],n=o[2][s];if(n)return n;const i=s.match(o[0]);if(!i)return[[],Wr];const c=i.indexOf("",1);return[o[1][c],i]},this.match(e,t)}},se=new WeakMap,oe=new WeakMap,Le=new WeakSet,zr=function(){const e=Object.create(null);return Object.keys(f(this,oe)).concat(Object.keys(f(this,se))).forEach(t=>{e[t]||(e[t]=D(this,Le,Vr).call(this,t))}),y(this,se,y(this,oe,void 0)),e},Vr=function(e){const t=[];let r=e===A;return[f(this,se),f(this,oe)].forEach(a=>{const s=a[e]?Object.keys(a[e]).map(o=>[o,a[e][o]]):[];s.length!==0?(r||(r=!0),t.push(...s)):e!==A&&t.push(...Object.keys(a[A]).map(o=>[o,a[A][o]]))}),r?Ja(t):null},gr),ne,Q,vr,Xa=(vr=class{constructor(e){T(this,"name","SmartRouter");w(this,ne,[]);w(this,Q,[]);y(this,ne,e.routers)}add(e,t,r){if(!f(this,Q))throw new Error(Br);f(this,Q).push([e,t,r])}match(e,t){if(!f(this,Q))throw new Error("Fatal error");const r=f(this,ne),a=f(this,Q),s=r.length;let o=0,n;for(;o<s;o++){const i=r[o];try{for(let c=0,d=a.length;c<d;c++)i.add(...a[c]);n=i.match(e,t)}catch(c){if(c instanceof kr)continue;throw c}this.match=i.match.bind(i),y(this,ne,[i]),y(this,Q,void 0);break}if(o===s)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,n}get activeRouter(){if(f(this,Q)||f(this,ne).length!==1)throw new Error("No active router has been determined yet.");return f(this,ne)[0]}},ne=new WeakMap,Q=new WeakMap,vr),Me=Object.create(null),ie,H,_e,Ae,L,ee,pe,Tr,Yr=(Tr=class{constructor(e,t,r){w(this,ee);w(this,ie);w(this,H);w(this,_e);w(this,Ae,0);w(this,L,Me);if(y(this,H,r||Object.create(null)),y(this,ie,[]),e&&t){const a=Object.create(null);a[e]={handler:t,possibleKeys:[],score:0},y(this,ie,[a])}y(this,_e,[])}insert(e,t,r){y(this,Ae,++Vt(this,Ae)._);let a=this;const s=Aa(t),o=[];for(let n=0,i=s.length;n<i;n++){const c=s[n],d=s[n+1],l=La(c,d),u=Array.isArray(l)?l[0]:c;if(u in f(a,H)){a=f(a,H)[u],l&&o.push(l[1]);continue}f(a,H)[u]=new Yr,l&&(f(a,_e).push(l),o.push(l[1])),a=f(a,H)[u]}return f(a,ie).push({[e]:{handler:r,possibleKeys:o.filter((n,i,c)=>c.indexOf(n)===i),score:f(this,Ae)}}),a}search(e,t){var i;const r=[];y(this,L,Me);let s=[this];const o=Lr(t),n=[];for(let c=0,d=o.length;c<d;c++){const l=o[c],u=c===d-1,p=[];for(let m=0,_=s.length;m<_;m++){const E=s[m],h=f(E,H)[l];h&&(y(h,L,f(E,L)),u?(f(h,H)["*"]&&r.push(...D(this,ee,pe).call(this,f(h,H)["*"],e,f(E,L))),r.push(...D(this,ee,pe).call(this,h,e,f(E,L)))):p.push(h));for(let g=0,v=f(E,_e).length;g<v;g++){const O=f(E,_e)[g],S=f(E,L)===Me?{}:{...f(E,L)};if(O==="*"){const J=f(E,H)["*"];J&&(r.push(...D(this,ee,pe).call(this,J,e,f(E,L))),y(J,L,S),p.push(J));continue}const[b,C,Y]=O;if(!l&&!(Y instanceof RegExp))continue;const $=f(E,H)[b],_t=o.slice(c).join("/");if(Y instanceof RegExp){const J=Y.exec(_t);if(J){if(S[C]=J[0],r.push(...D(this,ee,pe).call(this,$,e,f(E,L),S)),Object.keys(f($,H)).length){y($,L,S);const Ze=((i=J[0].match(/\//))==null?void 0:i.length)??0;(n[Ze]||(n[Ze]=[])).push($)}continue}}(Y===!0||Y.test(l))&&(S[C]=l,u?(r.push(...D(this,ee,pe).call(this,$,e,S,f(E,L))),f($,H)["*"]&&r.push(...D(this,ee,pe).call(this,f($,H)["*"],e,S,f(E,L)))):(y($,L,S),p.push($)))}}s=p.concat(n.shift()??[])}return r.length>1&&r.sort((c,d)=>c.score-d.score),[r.map(({handler:c,params:d})=>[c,d])]}},ie=new WeakMap,H=new WeakMap,_e=new WeakMap,Ae=new WeakMap,L=new WeakMap,ee=new WeakSet,pe=function(e,t,r,a){const s=[];for(let o=0,n=f(e,ie).length;o<n;o++){const i=f(e,ie)[o],c=i[t]||i[A],d={};if(c!==void 0&&(c.params=Object.create(null),s.push(c),r!==Me||a&&a!==Me))for(let l=0,u=c.possibleKeys.length;l<u;l++){const p=c.possibleKeys[l],m=d[c.score];c.params[p]=a!=null&&a[p]&&!m?a[p]:r[p]??(a==null?void 0:a[p]),d[c.score]=!0}}return s},Tr),ge,yr,Za=(yr=class{constructor(){T(this,"name","TrieRouter");w(this,ge);y(this,ge,new Yr)}add(e,t,r){const a=Mr(t);if(a){for(let s=0,o=a.length;s<o;s++)f(this,ge).insert(e,a[s],r);return}f(this,ge).insert(e,t,r)}match(e,t){return f(this,ge).search(e,t)}},ge=new WeakMap,yr),q=class extends Fr{constructor(e={}){super(e),this.router=e.router??new Xa({routers:[new Ka,new Za]})}},Qa=e=>{const r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},a=(o=>typeof o=="string"?o==="*"?()=>o:n=>o===n?n:null:typeof o=="function"?o:n=>o.includes(n)?n:null)(r.origin),s=(o=>typeof o=="function"?o:Array.isArray(o)?()=>o:()=>[])(r.allowMethods);return async function(n,i){var l;function c(u,p){n.res.headers.set(u,p)}const d=await a(n.req.header("origin")||"",n);if(d&&c("Access-Control-Allow-Origin",d),r.origin!=="*"){const u=n.req.header("Vary");u?c("Vary",u):c("Vary","Origin")}if(r.credentials&&c("Access-Control-Allow-Credentials","true"),(l=r.exposeHeaders)!=null&&l.length&&c("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),n.req.method==="OPTIONS"){r.maxAge!=null&&c("Access-Control-Max-Age",r.maxAge.toString());const u=await s(n.req.header("origin")||"",n);u.length&&c("Access-Control-Allow-Methods",u.join(","));let p=r.allowHeaders;if(!(p!=null&&p.length)){const m=n.req.header("Access-Control-Request-Headers");m&&(p=m.split(/\s*,\s*/))}return p!=null&&p.length&&(c("Access-Control-Allow-Headers",p.join(",")),n.res.headers.append("Vary","Access-Control-Request-Headers")),n.res.headers.delete("Content-Length"),n.res.headers.delete("Content-Type"),new Response(null,{headers:n.res.headers,status:204,statusText:"No Content"})}await i()}},es=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,rr=(e,t=rs)=>{const r=/\.([a-zA-Z0-9]+?)$/,a=e.match(r);if(!a)return;let s=t[a[1]];return s&&s.startsWith("text")&&(s+="; charset=utf-8"),s},ts={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},rs=ts,as=(...e)=>{let t=e.filter(s=>s!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const r=t.split("/"),a=[];for(const s of r)s===".."&&a.length>0&&a.at(-1)!==".."?a.pop():s!=="."&&a.push(s);return a.join("/")||"."},Jr={br:".br",zstd:".zst",gzip:".gz"},ss=Object.keys(Jr),os="index.html",ns=e=>{const t=e.root??"./",r=e.path,a=e.join??as;return async(s,o)=>{var l,u,p,m;if(s.finalized)return o();let n;if(e.path)n=e.path;else try{if(n=decodeURIComponent(s.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(n))throw new Error}catch{return await((l=e.onNotFound)==null?void 0:l.call(e,s.req.path,s)),o()}let i=a(t,!r&&e.rewriteRequestPath?e.rewriteRequestPath(n):n);e.isDir&&await e.isDir(i)&&(i=a(i,os));const c=e.getContent;let d=await c(i,s);if(d instanceof Response)return s.newResponse(d.body,d);if(d){const _=e.mimes&&rr(i,e.mimes)||rr(i);if(s.header("Content-Type",_||"application/octet-stream"),e.precompressed&&(!_||es.test(_))){const E=new Set((u=s.req.header("Accept-Encoding"))==null?void 0:u.split(",").map(h=>h.trim()));for(const h of ss){if(!E.has(h))continue;const g=await c(i+Jr[h],s);if(g){d=g,s.header("Content-Encoding",h),s.header("Vary","Accept-Encoding",{append:!0});break}}}return await((p=e.onFound)==null?void 0:p.call(e,i,s)),s.body(d)}await((m=e.onNotFound)==null?void 0:m.call(e,i,s)),await o()}},is=async(e,t)=>{let r;t&&t.manifest?typeof t.manifest=="string"?r=JSON.parse(t.manifest):r=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?r=JSON.parse(__STATIC_CONTENT_MANIFEST):r=__STATIC_CONTENT_MANIFEST;let a;t&&t.namespace?a=t.namespace:a=__STATIC_CONTENT;const s=r[e]||e;if(!s)return null;const o=await a.get(s,{type:"stream"});return o||null},cs=e=>async function(r,a){return ns({...e,getContent:async o=>is(o,{manifest:e.manifest,namespace:e.namespace?e.namespace:r.env?r.env.__STATIC_CONTENT:void 0})})(r,a)},ds=e=>cs(e),Be="_hp",ls={Change:"Input",DoubleClick:"DblClick"},us={svg:"2000/svg",math:"1998/Math/MathML"},ke=[],Lt=new WeakMap,je=void 0,ps=()=>je,K=e=>"t"in e,Rt={onClick:["click",!1]},ar=e=>{if(!e.startsWith("on"))return;if(Rt[e])return Rt[e];const t=e.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/);if(t){const[,r,a]=t;return Rt[e]=[(ls[r]||r).toLowerCase(),!!a]}},sr=(e,t)=>je&&e instanceof SVGElement&&/[A-Z]/.test(t)&&(t in e.style||t.match(/^(?:o|pai|str|u|ve)/))?t.replace(/([A-Z])/g,"-$1").toLowerCase():t,fs=(e,t,r)=>{var a;t||(t={});for(let s in t){const o=t[s];if(s!=="children"&&(!r||r[s]!==o)){s=lt(s);const n=ar(s);if(n){if((r==null?void 0:r[s])!==o&&(r&&e.removeEventListener(n[0],r[s],n[1]),o!=null)){if(typeof o!="function")throw new Error(`Event handler for "${s}" is not a function`);e.addEventListener(n[0],o,n[1])}}else if(s==="dangerouslySetInnerHTML"&&o)e.innerHTML=o.__html;else if(s==="ref"){let i;typeof o=="function"?i=o(e)||(()=>o(null)):o&&"current"in o&&(o.current=e,i=()=>o.current=null),Lt.set(e,i)}else if(s==="style"){const i=e.style;typeof o=="string"?i.cssText=o:(i.cssText="",o!=null&&Ir(o,i.setProperty.bind(i)))}else{if(s==="value"){const c=e.nodeName;if(c==="INPUT"||c==="TEXTAREA"||c==="SELECT"){if(e.value=o==null||o===!1?null:o,c==="TEXTAREA"){e.textContent=o;continue}else if(c==="SELECT"){e.selectedIndex===-1&&(e.selectedIndex=0);continue}}}else(s==="checked"&&e.nodeName==="INPUT"||s==="selected"&&e.nodeName==="OPTION")&&(e[s]=o);const i=sr(e,s);o==null||o===!1?e.removeAttribute(i):o===!0?e.setAttribute(i,""):typeof o=="string"||typeof o=="number"?e.setAttribute(i,o):e.setAttribute(i,o.toString())}}}if(r)for(let s in r){const o=r[s];if(s!=="children"&&!(s in t)){s=lt(s);const n=ar(s);n?e.removeEventListener(n[0],o,n[1]):s==="ref"?(a=Lt.get(e))==null||a():e.removeAttribute(sr(e,s))}}},ms=(e,t)=>{t[N][0]=0,ke.push([e,t]);const r=t.tag[Mt]||t.tag,a=r.defaultProps?{...r.defaultProps,...t.props}:t.props;try{return[r.call(null,a)]}finally{ke.pop()}},Kr=(e,t,r,a,s)=>{var o,n;(o=e.vR)!=null&&o.length&&(a.push(...e.vR),delete e.vR),typeof e.tag=="function"&&((n=e[N][1][ea])==null||n.forEach(i=>s.push(i))),e.vC.forEach(i=>{var c;if(K(i))r.push(i);else if(typeof i.tag=="function"||i.tag===""){i.c=t;const d=r.length;if(Kr(i,t,r,a,s),i.s){for(let l=d;l<r.length;l++)r[l].s=!0;i.s=!1}}else r.push(i),(c=i.vR)!=null&&c.length&&(a.push(...i.vR),delete i.vR)})},Es=e=>{for(;;e=e.tag===Be||!e.vC||!e.pP?e.nN:e.vC[0]){if(!e)return null;if(e.tag!==Be&&e.e)return e.e}},Xr=e=>{var t,r,a,s,o,n;K(e)||((r=(t=e[N])==null?void 0:t[1][ea])==null||r.forEach(i=>{var c;return(c=i[2])==null?void 0:c.call(i)}),(a=Lt.get(e.e))==null||a(),e.p===2&&((s=e.vC)==null||s.forEach(i=>i.p=2)),(o=e.vC)==null||o.forEach(Xr)),e.p||((n=e.e)==null||n.remove(),delete e.e),typeof e.tag=="function"&&(Pe.delete(e),it.delete(e),delete e[N][3],e.a=!0)},Zr=(e,t,r)=>{e.c=t,Qr(e,t,r)},or=(e,t)=>{if(t){for(let r=0,a=e.length;r<a;r++)if(e[r]===t)return r}},nr=Symbol(),Qr=(e,t,r)=>{var d;const a=[],s=[],o=[];Kr(e,t,a,s,o),s.forEach(Xr);const n=r?void 0:t.childNodes;let i,c=null;if(r)i=-1;else if(!n.length)i=0;else{const l=or(n,Es(e.nN));l!==void 0?(c=n[l],i=l):i=or(n,(d=a.find(u=>u.tag!==Be&&u.e))==null?void 0:d.e)??-1,i===-1&&(r=!0)}for(let l=0,u=a.length;l<u;l++,i++){const p=a[l];let m;if(p.s&&p.e)m=p.e,p.s=!1;else{const _=r||!p.e;K(p)?(p.e&&p.d&&(p.e.textContent=p.t),p.d=!1,m=p.e||(p.e=document.createTextNode(p.t))):(m=p.e||(p.e=p.n?document.createElementNS(p.n,p.tag):document.createElement(p.tag)),fs(m,p.props,p.pP),Qr(p,m,_))}p.tag===Be?i--:r?m.parentNode||t.appendChild(m):n[i]!==m&&n[i-1]!==m&&(n[i+1]===m?t.appendChild(n[i]):t.insertBefore(m,c||n[i]||null))}if(e.pP&&delete e.pP,o.length){const l=[],u=[];o.forEach(([,p,,m,_])=>{p&&l.push(p),m&&u.push(m),_==null||_()}),l.forEach(p=>p()),u.length&&requestAnimationFrame(()=>{u.forEach(p=>p())})}},hs=(e,t)=>!!(e&&e.length===t.length&&e.every((r,a)=>r[1]===t[a][1])),it=new WeakMap,xt=(e,t,r)=>{var o,n,i,c,d,l;const a=!r&&t.pC;r&&(t.pC||(t.pC=t.vC));let s;try{r||(r=typeof t.tag=="function"?ms(e,t):Ye(t.props.children)),((o=r[0])==null?void 0:o.tag)===""&&r[0][Nt]&&(s=r[0][Nt],e[5].push([e,s,t]));const u=a?[...t.pC]:t.vC?[...t.vC]:void 0,p=[];let m;for(let _=0;_<r.length;_++){Array.isArray(r[_])&&r.splice(_,1,...r[_].flat());let E=_s(r[_]);if(E){typeof E.tag=="function"&&!E.tag[Cr]&&(Ie.length>0&&(E[N][2]=Ie.map(g=>[g,g.values.at(-1)])),(n=e[5])!=null&&n.length&&(E[N][3]=e[5].at(-1)));let h;if(u&&u.length){const g=u.findIndex(K(E)?v=>K(v):E.key!==void 0?v=>v.key===E.key&&v.tag===E.tag:v=>v.tag===E.tag);g!==-1&&(h=u[g],u.splice(g,1))}if(h)if(K(E))h.t!==E.t&&(h.t=E.t,h.d=!0),E=h;else{const g=h.pP=h.props;if(h.props=E.props,h.f||(h.f=E.f||t.f),typeof E.tag=="function"){const v=h[N][2];h[N][2]=E[N][2]||[],h[N][3]=E[N][3],!h.f&&((h.o||h)===E.o||(c=(i=h.tag)[la])!=null&&c.call(i,g,h.props))&&hs(v,h[N][2])&&(h.s=!0)}E=h}else if(!K(E)&&je){const g=xe(je);g&&(E.n=g)}if(!K(E)&&!E.s&&(xt(e,E),delete E.f),p.push(E),m&&!m.s&&!E.s)for(let g=m;g&&!K(g);g=(d=g.vC)==null?void 0:d.at(-1))g.nN=E;m=E}}t.vR=a?[...t.vC,...u||[]]:u||[],t.vC=p,a&&delete t.pC}catch(u){if(t.f=!0,u===nr){if(s)return;throw u}const[p,m,_]=((l=t[N])==null?void 0:l[3])||[];if(m){const E=()=>ct([0,!1,e[2]],_),h=it.get(_)||[];h.push(E),it.set(_,h);const g=m(u,()=>{const v=it.get(_);if(v){const O=v.indexOf(E);if(O!==-1)return v.splice(O,1),E()}});if(g){if(e[0]===1)e[1]=!0;else if(xt(e,_,[g]),(m.length===1||e!==p)&&_.c){Zr(_,_.c,!1);return}throw nr}}throw u}finally{s&&e[5].pop()}},_s=e=>{if(!(e==null||typeof e=="boolean")){if(typeof e=="string"||typeof e=="number")return{t:e.toString(),d:!0};if("vR"in e&&(e={tag:e.tag,props:e.props,key:e.key,f:e.f,type:e.tag,ref:e.props.ref,o:e.o||e}),typeof e.tag=="function")e[N]=[0,[]];else{const t=us[e.tag];t&&(je||(je=br("")),e.props.children=[{tag:je,props:{value:e.n=`http://www.w3.org/${t}`,children:e.props.children}}])}return e}},ir=(e,t)=>{var r,a;(r=t[N][2])==null||r.forEach(([s,o])=>{s.values.push(o)});try{xt(e,t,void 0)}catch{return}if(t.a){delete t.a;return}(a=t[N][2])==null||a.forEach(([s])=>{s.values.pop()}),(e[0]!==1||!e[1])&&Zr(t,t.c,!1)},Pe=new WeakMap,cr=[],ct=async(e,t)=>{e[5]||(e[5]=[]);const r=Pe.get(t);r&&r[0](void 0);let a;const s=new Promise(o=>a=o);if(Pe.set(t,[a,()=>{e[2]?e[2](e,t,o=>{ir(o,t)}).then(()=>a(t)):(ir(e,t),a(t))}]),cr.length)cr.at(-1).add(t);else{await Promise.resolve();const o=Pe.get(t);o&&(Pe.delete(t),o[1]())}return s},gs=(e,t,r)=>({tag:Be,props:{children:e},key:r,e:t,p:1}),Ot=0,ea=1,wt=2,Ct=3,Dt=new WeakMap,ta=(e,t)=>!e||!t||e.length!==t.length||t.some((r,a)=>r!==e[a]),vs=void 0,dr=[],Ts=e=>{var n;const t=()=>typeof e=="function"?e():e,r=ke.at(-1);if(!r)return[t(),()=>{}];const[,a]=r,s=(n=a[N][1])[Ot]||(n[Ot]=[]),o=a[N][0]++;return s[o]||(s[o]=[t(),i=>{const c=vs,d=s[o];if(typeof i=="function"&&(i=i(d[0])),!Object.is(i,d[0]))if(d[0]=i,dr.length){const[l,u]=dr.at(-1);Promise.all([l===3?a:ct([l,!1,c],a),u]).then(([p])=>{if(!p||!(l===2||l===3))return;const m=p.vC;requestAnimationFrame(()=>{setTimeout(()=>{m===p.vC&&ct([l===3?1:0,!1,c],p)})})})}else ct([0,!1,c],a)}])},Bt=(e,t)=>{var i;const r=ke.at(-1);if(!r)return e;const[,a]=r,s=(i=a[N][1])[wt]||(i[wt]=[]),o=a[N][0]++,n=s[o];return ta(n==null?void 0:n[1],t)?s[o]=[e,t]:e=s[o][0],e},ys=e=>{const t=Dt.get(e);if(t){if(t.length===2)throw t[1];return t[0]}throw e.then(r=>Dt.set(e,[r]),r=>Dt.set(e,[void 0,r])),e},Ss=(e,t)=>{var i;const r=ke.at(-1);if(!r)return e();const[,a]=r,s=(i=a[N][1])[Ct]||(i[Ct]=[]),o=a[N][0]++,n=s[o];return ta(n==null?void 0:n[1],t)&&(s[o]=[e(),t]),s[o][0]},Rs=br({pending:!1,data:null,method:null,action:null}),lr=new Set,Os=e=>{lr.add(e),e.finally(()=>lr.delete(e))},kt=(e,t)=>Ss(()=>r=>{let a;e&&(typeof e=="function"?a=e(r)||(()=>{e(null)}):e&&"current"in e&&(e.current=r,a=()=>{e.current=null}));const s=t(r);return()=>{s==null||s(),a==null||a()}},[e]),Se=Object.create(null),et=Object.create(null),Xe=(e,t,r,a,s)=>{if(t!=null&&t.itemProp)return{tag:e,props:t,type:e,ref:t.ref};const o=document.head;let{onLoad:n,onError:i,precedence:c,blocking:d,...l}=t,u=null,p=!1;const m=tt[e];let _;if(m.length>0){const v=o.querySelectorAll(e);e:for(const O of v)for(const S of tt[e])if(O.getAttribute(S)===t[S]){u=O;break e}if(!u){const O=m.reduce((S,b)=>t[b]===void 0?S:`${S}-${b}-${t[b]}`,e);p=!et[O],u=et[O]||(et[O]=(()=>{const S=document.createElement(e);for(const b of m)t[b]!==void 0&&S.setAttribute(b,t[b]),t.rel&&S.setAttribute("rel",t.rel);return S})())}}else _=o.querySelectorAll(e);c=a?c??"":void 0,a&&(l[rt]=c);const E=Bt(v=>{if(m.length>0){let O=!1;for(const S of o.querySelectorAll(e)){if(O&&S.getAttribute(rt)!==c){o.insertBefore(v,S);return}S.getAttribute(rt)===c&&(O=!0)}o.appendChild(v)}else if(_){let O=!1;for(const S of _)if(S===v){O=!0;break}O||o.insertBefore(v,o.contains(_[0])?_[0]:o.querySelector(e)),_=void 0}},[c]),h=kt(t.ref,v=>{var b;const O=m[0];if(r===2&&(v.innerHTML=""),(p||_)&&E(v),!i&&!n)return;let S=Se[b=v.getAttribute(O)]||(Se[b]=new Promise((C,Y)=>{v.addEventListener("load",C),v.addEventListener("error",Y)}));n&&(S=S.then(n)),i&&(S=S.catch(i)),S.catch(()=>{})});if(s&&d==="render"){const v=tt[e][0];if(t[v]){const O=t[v],S=Se[O]||(Se[O]=new Promise((b,C)=>{E(u),u.addEventListener("load",b),u.addEventListener("error",C)}));ys(S)}}const g={tag:e,type:e,props:{...l,ref:h},ref:h};return g.p=r,u&&(g.e=u),gs(g,o)},ws=e=>{const t=ps(),r=t&&xe(t);return r!=null&&r.endsWith("svg")?{tag:"title",props:e,type:"title",ref:e.ref}:Xe("title",e,void 0,!1,!1)},Cs=e=>!e||["src","async"].some(t=>!e[t])?{tag:"script",props:e,type:"script",ref:e.ref}:Xe("script",e,1,!1,!0),Ds=e=>!e||!["href","precedence"].every(t=>t in e)?{tag:"style",props:e,type:"style",ref:e.ref}:(e["data-href"]=e.href,delete e.href,Xe("style",e,2,!0,!0)),bs=e=>!e||["onLoad","onError"].some(t=>t in e)||e.rel==="stylesheet"&&(!("precedence"in e)||"disabled"in e)?{tag:"link",props:e,type:"link",ref:e.ref}:Xe("link",e,1,"precedence"in e,!0),Ns=e=>Xe("meta",e,void 0,!1,!1),ra=Symbol(),As=e=>{const{action:t,...r}=e;typeof t!="function"&&(r.action=t);const[a,s]=Ts([null,!1]),o=Bt(async d=>{const l=d.isTrusted?t:d.detail[ra];if(typeof l!="function")return;d.preventDefault();const u=new FormData(d.target);s([u,!0]);const p=l(u);p instanceof Promise&&(Os(p),await p),s([null,!0])},[]),n=kt(e.ref,d=>(d.addEventListener("submit",o),()=>{d.removeEventListener("submit",o)})),[i,c]=a;return a[1]=!1,{tag:Rs,props:{value:{pending:i!==null,data:i,method:i?"post":null,action:i?t:null},children:{tag:"form",props:{...r,ref:n},type:"form",ref:n}},f:c}},aa=(e,{formAction:t,...r})=>{if(typeof t=="function"){const a=Bt(s=>{s.preventDefault(),s.currentTarget.form.dispatchEvent(new CustomEvent("submit",{detail:{[ra]:t}}))},[]);r.ref=kt(r.ref,s=>(s.addEventListener("click",a),()=>{s.removeEventListener("click",a)}))}return{tag:e,props:r,type:e,ref:r.ref}},Is=e=>aa("input",e),js=e=>aa("button",e);Object.assign(At,{title:ws,script:Cs,style:Ds,link:bs,meta:Ns,form:As,input:Is,button:js});Pt(null);new TextEncoder;var Ls=Pt(null),xs=(e,t,r,a)=>(s,o)=>{const n="<!DOCTYPE html>",i=r?Xt(d=>r(d,e),{Layout:t,...o},s):s,c=da`${k(n)}${Xt(Ls.Provider,{value:e},i)}`;return e.html(c)},Ms=(e,t)=>function(a,s){const o=a.getLayout()??Ra;return e&&a.setLayout(n=>e({...n,Layout:o},a)),a.setRenderer(xs(a,o,e)),s()};const Ps=Ms(({children:e})=>R("html",{lang:"es",children:[R("head",{children:[R("meta",{charset:"UTF-8"}),R("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),R("title",{children:"Yo Decreto - Gustavo Adolfo Guerrero Castaños"}),R("link",{rel:"icon",href:"/static/logo-yo-decreto.png",type:"image/png"}),R("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",rel:"stylesheet"}),R("script",{src:"https://cdn.tailwindcss.com"}),R("link",{href:"https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css",rel:"stylesheet"}),R("script",{src:"https://cdn.jsdelivr.net/npm/chart.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrAfter.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrBefore.js"}),R("script",{src:"https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"}),R("link",{href:`/static/styles.css?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`,rel:"stylesheet"}),R("script",{dangerouslySetInnerHTML:{__html:`
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
          `}})]}),R("body",{className:"bg-slate-900 text-white font-sans",children:[e,R("script",{src:`/static/auth.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/app.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/decretos.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/rutina.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/agenda.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/progreso.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/ritual-spec.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/practica.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/chatbot.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/google-calendar-settings.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/ai-chat-widget.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`}),R("script",{src:`/static/acerca.js?v=${Date.now()}&cb=${Math.random()}&t=${new Date().getTime()}`})]})]}));async function Hs(e,t,r,a,s,o,n){try{if(console.log("📅 Sincronizando con agenda:",{accionId:t,titulo:r,proximaRevision:n}),n){const i=n.split("T")[0],c=n.split("T")[1]||"09:00";console.log("📅 Creando evento agenda:",{fechaParte:i,horaParte:c});const d=await e.prepare(`
        INSERT INTO agenda_eventos (
          accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(t,`[Decreto] ${r}`,`${a}${s?" - "+s:""}`,i,c,"media").run();console.log("✅ Evento agenda creado:",d.meta.last_row_id)}else console.log("⏭️ Sin fecha programada, no se crea evento agenda")}catch(i){console.error("❌ Error al sincronizar con agenda:",i)}}const x=new q;x.get("/config",async e=>{try{const t=await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first();return e.json({success:!0,data:t||{nombre_usuario:"Gustavo Adolfo Guerrero Castaños",frase_vida:"(Agregar frase de vida)"}})}catch{return e.json({success:!1,error:"Error al obtener configuración"},500)}});x.put("/config",async e=>{try{const{nombre_usuario:t,frase_vida:r}=await e.req.json();return await e.env.DB.prepare("UPDATE configuracion SET nombre_usuario = ?, frase_vida = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(t,r,"main").run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al actualizar configuración"},500)}});x.get("/",async e=>{try{const t=await e.env.DB.prepare("SELECT * FROM decretos ORDER BY created_at DESC").all(),r={total:t.results.length,empresarial:t.results.filter(s=>s.area==="empresarial").length,material:t.results.filter(s=>s.area==="material").length,humano:t.results.filter(s=>s.area==="humano").length},a={empresarial:r.total>0?Math.round(r.empresarial/r.total*100):0,material:r.total>0?Math.round(r.material/r.total*100):0,humano:r.total>0?Math.round(r.humano/r.total*100):0};return e.json({success:!0,data:{decretos:t.results,contadores:r,porcentajes:a}})}catch{return e.json({success:!1,error:"Error al obtener decretos"},500)}});x.get("/:id",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(t).first();if(!r)return e.json({success:!1,error:"Decreto no encontrado"},404);const a=await e.env.DB.prepare("SELECT * FROM acciones WHERE decreto_id = ? ORDER BY created_at DESC").bind(t).all(),s=a.results.length,o=a.results.filter(c=>c.estado==="completada").length,n=s-o,i=s>0?Math.round(o/s*100):0;return await e.env.DB.prepare("UPDATE decretos SET progreso = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(i,t).run(),e.json({success:!0,data:{decreto:{...r,progreso:i},acciones:a.results,metricas:{total_acciones:s,completadas:o,pendientes:n,progreso:i}}})}catch{return e.json({success:!1,error:"Error al obtener decreto"},500)}});x.post("/",async e=>{try{const{area:t,titulo:r,sueno_meta:a,descripcion:s}=await e.req.json();if(!t||!r||!a)return e.json({success:!1,error:"Campos requeridos: area, titulo, sueno_meta"},400);const o=await e.env.DB.prepare("INSERT INTO decretos (area, titulo, sueno_meta, descripcion) VALUES (?, ?, ?, ?)").bind(t,r,a,s||"").run();return e.json({success:!0,id:o.meta.last_row_id})}catch{return e.json({success:!1,error:"Error al crear decreto"},500)}});x.put("/:id",async e=>{try{const t=e.req.param("id"),{area:r,titulo:a,sueno_meta:s,descripcion:o}=await e.req.json();return await e.env.DB.prepare("UPDATE decretos SET area = ?, titulo = ?, sueno_meta = ?, descripcion = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(r,a,s,o||"",t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al actualizar decreto"},500)}});x.delete("/:id",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare("DELETE FROM decretos WHERE id = ?").bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar decreto"},500)}});x.post("/:id/acciones",async e=>{var t;try{const r=e.req.param("id"),a=await e.req.json();console.log("=== BACKEND: RECIBIENDO DATOS ===",{decretoId:r,requestDataKeys:Object.keys(a),hasSubtareas:"subtareas"in a,subtareasLength:((t=a.subtareas)==null?void 0:t.length)||0,subtareasData:a.subtareas});const{titulo:s,que_hacer:o,como_hacerlo:n,resultados:i,tareas_pendientes:c,tipo:d,proxima_revision:l,calificacion:u,subtareas:p=[]}=a;if(!s||!o)return e.json({success:!1,error:"Campos requeridos: titulo, que_hacer"},400);const m=crypto.randomUUID().replace(/-/g,"").substring(0,32);if(await e.env.DB.prepare(`
      INSERT INTO acciones (
        id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
        tareas_pendientes, tipo, proxima_revision, calificacion, origen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')
    `).bind(m,r,s,o,n||"",i||"",JSON.stringify(c||[]),d||"secundaria",l||null,u||null).run(),console.log("✅ Acción creada:",m),l){console.log("🔥 FORZANDO creación en agenda para:",{accionId:m,titulo:s,proxima_revision:l});const E=l.split("T")[0],h=l.split("T")[1]||"09:00";try{const g=await e.env.DB.prepare(`
          INSERT INTO agenda_eventos (
            accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(m,`[Decreto] ${s}`,`${o}${n?" - "+n:""}`,E,h,"media").run();console.log("🚀 AGENDA EVENTO CREADO EXITOSAMENTE:",g.meta.last_row_id)}catch(g){console.error("💥 ERROR CREANDO AGENDA EVENTO:",g)}}else console.log("⚠️ NO HAY FECHA DE REVISIÓN - NO SE CREA EVENTO AGENDA");let _=0;if(console.log("=== PROCESANDO SUB-TAREAS ===",{hasSubtareas:!!p,subtareasLength:(p==null?void 0:p.length)||0,subtareasData:p}),p&&p.length>0){console.log(`Procesando ${p.length} sub-tareas...`);for(let E=0;E<p.length;E++){const h=p[E];if(console.log(`Sub-tarea ${E+1}:`,h),h.titulo){const g=crypto.randomUUID().replace(/-/g,"").substring(0,32);let v=h.fecha_programada;!v&&l&&(v=l),console.log(`Creando sub-tarea ${E+1} con ID: ${g}`,{titulo:h.titulo,queHacer:h.que_hacer,fecha:v,padreId:m});const O=await e.env.DB.prepare(`
            INSERT INTO acciones (
              id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
              tipo, proxima_revision, origen, tarea_padre_id, nivel_jerarquia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(g,r,h.titulo,h.que_hacer,h.como_hacerlo||"","","secundaria",v,"subtarea",m,1).run();console.log(`✅ Sub-tarea ${E+1} creada en BD:`,{success:O.success,changes:O.changes}),v&&(await Hs(e.env.DB,g,`[Sub] ${h.titulo}`,h.que_hacer,h.como_hacerlo,"secundaria",v),console.log(`✅ Sub-tarea ${E+1} sincronizada con agenda`)),_++}else console.log(`⏭️ Sub-tarea ${E+1} sin título, saltando`)}}else console.log("No hay sub-tareas para procesar");return console.log(`=== SUB-TAREAS COMPLETADAS: ${_} ===`),console.log("=== RESPUESTA FINAL ===",{success:!0,accionId:m,subtareasCreadas:_}),e.json({success:!0,id:m,data:{subtareas_creadas:_}})}catch(r){return console.error("Error creating action:",r),e.json({success:!1,error:`Error al crear acción: ${r.message}`},500)}});x.get("/:decretoId/acciones/:accionId",async e=>{try{const t=e.req.param("decretoId"),r=e.req.param("accionId"),a=await e.env.DB.prepare(`
      SELECT 
        a.*,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      WHERE a.id = ? AND a.decreto_id = ?
    `).bind(r,t).first();if(!a)return e.json({success:!1,error:"Acción no encontrada"},404);if(a.tareas_pendientes)try{a.tareas_pendientes=JSON.parse(a.tareas_pendientes)}catch{a.tareas_pendientes=[]}return e.json({success:!0,data:a})}catch{return e.json({success:!1,error:"Error al obtener detalles de la acción"},500)}});x.put("/:decretoId/acciones/:accionId",async e=>{try{const t=e.req.param("decretoId"),r=e.req.param("accionId"),{titulo:a,que_hacer:s,como_hacerlo:o,resultados:n,tipo:i,proxima_revision:c,calificacion:d}=await e.req.json();if(!a||!s)return e.json({success:!1,error:"Campos requeridos: titulo, que_hacer"},400);if(await e.env.DB.prepare(`
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
    `).bind(a,s,o||"",n||"",i||"secundaria",c||null,d||null,r,t).run(),await e.env.DB.prepare("SELECT id FROM agenda_eventos WHERE accion_id = ?").bind(r).first()&&c){const u=c.split("T")[0],p=c.split("T")[1]||"09:00";await e.env.DB.prepare(`
        UPDATE agenda_eventos SET 
          titulo = ?,
          fecha_evento = ?,
          hora_evento = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE accion_id = ?
      `).bind(`[Decreto] ${a}`,u,p,r).run()}return e.json({success:!0})}catch{return e.json({success:!1,error:"Error al editar acción"},500)}});x.put("/:decretoId/acciones/:accionId/completar",async e=>{try{const t=e.req.param("accionId");return await e.env.DB.prepare('UPDATE acciones SET estado = "completada", fecha_cierre = date("now"), updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(),await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "completada", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al completar acción"},500)}});x.put("/:decretoId/acciones/:accionId/pendiente",async e=>{try{const t=e.req.param("accionId");return await e.env.DB.prepare('UPDATE acciones SET estado = "pendiente", fecha_cierre = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(),await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "pendiente", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al marcar acción como pendiente"},500)}});x.delete("/:decretoId/acciones/:accionId",async e=>{try{const t=e.req.param("accionId");return await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar acción"},500)}});x.post("/:decretoId/acciones/:accionId/seguimientos",async e=>{try{const t=e.req.param("accionId"),{que_se_hizo:r,como_se_hizo:a,resultados_obtenidos:s,tareas_pendientes:o,proxima_revision:n,calificacion:i}=await e.req.json();if(!r||!a||!s)return e.json({success:!1,error:"Campos requeridos: que_se_hizo, como_se_hizo, resultados_obtenidos"},400);await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(t,r,a,s,JSON.stringify(o||[]),n||null,i||null).run(),await e.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(s,JSON.stringify(o||[]),n||null,i||null,t).run();let c=0;if(o&&Array.isArray(o)){for(const d of o)if(typeof d=="string"&&d.trim()){let l=d.trim(),u="secundaria",p=null;(l.startsWith("[P]")||l.includes("#primaria"))&&(u="primaria",l=l.replace(/\[P\]|#primaria/g,"").trim()),l.includes("#diaria")&&(u="secundaria",l=l.replace(/#diaria/g,"").trim());const m=l.match(/@(\d{4}-\d{2}-\d{2})/);m&&(p=m[1]+"T09:00",l=l.replace(/@\d{4}-\d{2}-\d{2}/g,"").trim());const _=await e.env.DB.prepare("SELECT decreto_id FROM acciones WHERE id = ?").bind(t).first();if(_){const E=await e.env.DB.prepare(`
              INSERT INTO acciones (
                decreto_id, titulo, que_hacer, como_hacerlo, tipo, 
                proxima_revision, origen
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `).bind(_.decreto_id,l,"Tarea generada desde seguimiento",`Completar: ${l}`,u,p,`seguimiento:${t}`).run();let h=null;if(u==="secundaria"){const g=p?p.split("T")[0]:new Date().toISOString().split("T")[0],v=p?p.split("T")[1]:"09:00";h=(await e.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad)
                VALUES (?, ?, ?, ?, ?, ?)
              `).bind(E.meta.last_row_id,l,`[Auto-generada] ${l}`,g,v,"media").run()).meta.last_row_id}else u==="primaria"&&p&&(h=(await e.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad)
                VALUES (?, ?, ?, date(?), time(?), ?)
              `).bind(E.meta.last_row_id,`[Semanal] ${l}`,"Tarea generada desde seguimiento",p.split("T")[0],p.split("T")[1],"media").run()).meta.last_row_id);h&&await e.env.DB.prepare(`
                UPDATE acciones SET agenda_event_id = ? WHERE id = ?
              `).bind(h,E.meta.last_row_id).run(),c++}}}return e.json({success:!0,message:`Seguimiento guardado. ${c} tareas nuevas creadas.`})}catch{return e.json({success:!1,error:"Error al crear seguimiento"},500)}});x.get("/:id/sugerencias",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(t).first();if(!r)return e.json({success:!1,error:"Decreto no encontrado"},404);let a=[];switch(r.area){case"empresarial":a=["Analizar competencia directa y ventajas competitivas","Definir métricas clave de rendimiento (KPIs)","Desarrollar plan de marketing digital","Establecer alianzas estratégicas","Optimizar procesos operativos"];break;case"material":a=["Revisar y optimizar presupuesto mensual","Investigar nuevas oportunidades de inversión","Crear fondo de emergencia","Diversificar fuentes de ingresos","Consultar con asesor financiero"];break;case"humano":a=["Establecer rutina de ejercicio diario","Practicar meditación mindfulness","Fortalecer relaciones familiares","Desarrollar nuevas habilidades","Cultivar hábitos de sueño saludables"];break;default:a=["Definir objetivos específicos y medibles","Crear plan de acción detallado","Establecer fechas límite realistas","Buscar recursos y herramientas necesarias","Programar revisiones de progreso"]}return e.json({success:!0,data:a.map((s,o)=>({id:`sugerencia_${o+1}`,texto:s,categoria:r.area}))})}catch{return e.json({success:!1,error:"Error al generar sugerencias"},500)}});x.get("/:decretoId/acciones/:accionId/arbol",async e=>{try{const t=e.req.param("decretoId"),r=e.req.param("accionId"),a=await e.env.DB.prepare(`
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
    `).bind(r,t).all();return e.json({success:!0,data:{arbol:a.results,total_tareas:a.results.length}})}catch{return e.json({success:!1,error:"Error al obtener árbol de tareas"},500)}});const M=new q;M.get("/metricas/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
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
    `).bind(t).all(),a=r.results.length,s=r.results.filter(i=>i.estado==="completada").length,o=a-s,n=a>0?Math.round(s/a*100):0;return e.json({success:!0,data:{total:a,completadas:s,pendientes:o,progreso:n,tareas:r.results}})}catch{return e.json({success:!1,error:"Error al obtener métricas del día"},500)}});M.get("/calendario/:year/:month",async e=>{try{const t=e.req.param("year"),r=e.req.param("month"),a=`${t}-${r.padStart(2,"0")}-01`,s=`${t}-${r.padStart(2,"0")}-31`,o=await e.env.DB.prepare(`
      SELECT 
        fecha_evento,
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado = 'pendiente' AND fecha_evento < date('now') THEN 1 END) as vencidas
      FROM agenda_eventos 
      WHERE fecha_evento BETWEEN ? AND ?
      GROUP BY fecha_evento
    `).bind(a,s).all(),n={};for(const i of o.results){const{fecha_evento:c,total:d,completadas:l,vencidas:u}=i;l===d?n[c]="completado":u>0?n[c]="vencido":d>l&&(n[c]="pendiente")}return e.json({success:!0,data:{eventos:o.results,estados:n}})}catch{return e.json({success:!1,error:"Error al obtener calendario"},500)}});M.get("/timeline/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
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
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener timeline"},500)}});M.get("/timeline-unificado/:fecha",async e=>{try{const t=e.req.param("fecha"),r="demo-user",a=await e.env.DB.prepare(`
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
    `).bind(t).all(),s=await e.env.DB.prepare(`
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
    `).bind(r,t).all(),o=[...a.results.map(n=>({id:n.id,titulo:n.titulo,descripcion:n.descripcion,fecha_evento:n.fecha_evento,hora_evento:n.hora_evento,estado:n.estado,prioridad:n.prioridad,es_enfoque_dia:n.es_enfoque_dia,accion_titulo:n.accion_titulo,decreto_titulo:n.decreto_titulo,decreto_id:n.decreto_id,area:n.area,tipo:n.tipo,origen:"local",timestamp:n.hora_evento?`${n.fecha_evento}T${n.hora_evento}`:`${n.fecha_evento}T23:59`,all_day:!n.hora_evento})),...s.results.map(n=>{var i;return{id:`google-${n.id}`,google_event_id:n.google_event_id,titulo:n.titulo,descripcion:n.descripcion,fecha_inicio:n.fecha_inicio,fecha_fin:n.fecha_fin,location:n.location,color_id:n.color_id,origen:"google",all_day:n.all_day===1,timestamp:n.fecha_inicio,hora_evento:n.all_day?null:(i=n.fecha_inicio.split("T")[1])==null?void 0:i.substring(0,5)}})];return o.sort((n,i)=>{const c=new Date(n.timestamp).getTime(),d=new Date(i.timestamp).getTime();return c-d}),e.json({success:!0,data:o,meta:{total:o.length,locales:a.results.length,google:s.results.length}})}catch(t){return console.error("Error getting unified timeline:",t),e.json({success:!1,error:t.message||"Error al obtener timeline unificado"},500)}});M.get("/enfoque/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
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
    `).bind(t).first();return e.json({success:!0,data:r})}catch{return e.json({success:!1,error:"Error al obtener enfoque del día"},500)}});M.put("/enfoque/:fecha",async e=>{try{const t=e.req.param("fecha"),{tarea_id:r}=await e.req.json();return await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 0 WHERE fecha_evento = ?").bind(t).run(),r&&await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(r).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al establecer enfoque"},500)}});M.post("/tareas",async e=>{try{const{decreto_id:t,nombre:r,descripcion:a,fecha_hora:s,tipo:o,prioridad:n}=await e.req.json();if(console.log("📝 Creando tarea agenda:",{decreto_id:t,nombre:r,fecha_hora:s,tipo:o,prioridad:n}),!r||!s)return e.json({success:!1,error:"Campos requeridos: nombre, fecha_hora"},400);const i=s.split("T")[0],c=s.split("T")[1]||"09:00",d=await e.env.DB.prepare(`
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
    `).bind(r,a||"",i,c,n||"media").run();return console.log("✅ Tarea agenda creada:",d.meta.last_row_id),e.json({success:!0,id:d.meta.last_row_id,message:"Tarea creada correctamente"})}catch(t){return console.error("❌ Error crear tarea:",t),e.json({success:!1,error:`Error al crear tarea: ${t.message}`},500)}});M.put("/tareas/:id/completar",async e=>{try{const t=e.req.param("id"),r=new Date().toISOString();return await e.env.DB.prepare(`
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
    `).bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al marcar tarea como pendiente"},500)}});M.delete("/tareas/:id",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();if(await e.env.DB.prepare("DELETE FROM agenda_eventos WHERE id = ?").bind(t).run(),r!=null&&r.accion_id){const a=await e.env.DB.prepare("SELECT origen FROM acciones WHERE id = ?").bind(r.accion_id).first();(a==null?void 0:a.origen)==="agenda"&&await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(r.accion_id).run()}return e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar tarea"},500)}});M.get("/pendientes/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
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
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener tareas pendientes"},500)}});M.get("/tareas/:id",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare(`
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
    `).bind(t).first();if(!r)return e.json({success:!1,error:"Tarea no encontrada"},404);if(r.tareas_pendientes)try{r.tareas_pendientes=JSON.parse(r.tareas_pendientes)}catch{r.tareas_pendientes=[]}return e.json({success:!0,data:r})}catch{return e.json({success:!1,error:"Error al obtener detalles de la tarea"},500)}});M.put("/tareas/:id",async e=>{try{const t=e.req.param("id"),{titulo:r,descripcion:a,fecha_hora:s,que_hacer:o,como_hacerlo:n,resultados:i,tipo:c,calificacion:d,prioridad:l}=await e.req.json();if(!r||!s)return e.json({success:!1,error:"Campos requeridos: titulo, fecha_hora"},400);const u=s.split("T")[0],p=s.split("T")[1]||"09:00";await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        titulo = ?,
        descripcion = ?,
        fecha_evento = ?,
        hora_evento = ?,
        prioridad = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(r,a||"",u,p,l||"media",t).run();const m=await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();return m!=null&&m.accion_id&&await e.env.DB.prepare(`
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
      `).bind(r,o||"",n||"",i||"",c||"secundaria",s,d||null,m.accion_id).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al editar tarea"},500)}});M.get("/filtros",async e=>{try{const{fecha_desde:t,fecha_hasta:r,incluir_hoy:a,incluir_futuras:s,incluir_completadas:o,incluir_pendientes:n,decreto_id:i,area:c}=e.req.query();let d=`
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
    `;const l=[];a==="true"&&(d+=" AND ae.fecha_evento = date('now')"),s==="true"&&(d+=" AND ae.fecha_evento > date('now')"),t&&r&&(d+=" AND ae.fecha_evento BETWEEN ? AND ?",l.push(t,r));const u=[];o==="true"&&u.push("completada"),n==="true"&&u.push("pendiente"),u.length>0&&(d+=` AND ae.estado IN (${u.map(()=>"?").join(",")})`,l.push(...u)),i&&i!=="todos"&&(d+=" AND d.id = ?",l.push(i)),c&&c!=="todos"&&(d+=" AND d.area = ?",l.push(c)),d+=" ORDER BY ae.fecha_evento DESC, ae.hora_evento ASC";const p=await e.env.DB.prepare(d).bind(...l).all();return e.json({success:!0,data:p.results})}catch{return e.json({success:!1,error:"Error al filtrar tareas"},500)}});M.post("/tareas/:id/seguimiento",async e=>{try{const t=e.req.param("id"),r=await e.req.json(),a=await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();if(!(a!=null&&a.accion_id))return e.json({success:!1,error:"No se encontró acción asociada"},404);const{que_se_hizo:s,como_se_hizo:o,resultados_obtenidos:n,tareas_pendientes:i,proxima_revision:c,calificacion:d}=r;return await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(a.accion_id,s,o,n,JSON.stringify(i||[]),c||null,d||null).run(),await e.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(n,JSON.stringify(i||[]),c||null,d||null,a.accion_id).run(),e.json({success:!0,message:"Seguimiento guardado desde agenda"})}catch{return e.json({success:!1,error:"Error al crear seguimiento"},500)}});M.get("/panoramica-pendientes",async e=>{try{const{area:t}=e.req.query();console.log("🔍 Obteniendo panorámica pendientes, área:",t);let r=`
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
    `;const a=[];t&&t!=="todos"&&(r+=" AND d.area = ?",a.push(t)),r+=`
      ORDER BY 
        a.fecha_creacion ASC,
        a.proxima_revision ASC NULLS LAST,
        a.created_at ASC
    `;const o=(await e.env.DB.prepare(r).bind(...a).all()).results.map(d=>({...d,dias_desde_creacion:Math.floor((Date.now()-new Date(d.fecha_creacion).getTime())/(1e3*60*60*24)),urgencia:Us(d),fecha_creacion_formatted:ur(d.fecha_creacion),proxima_revision_formatted:d.proxima_revision?ur(d.proxima_revision):null})),n={total:o.length,por_area:{},antiguedad_promedio:0,con_revision_pendiente:0,sin_revision:0},i={};let c=0;return o.forEach(d=>{const l=d.area||"sin_area";i[l]=(i[l]||0)+1,c+=d.dias_desde_creacion,d.proxima_revision?n.con_revision_pendiente++:n.sin_revision++}),n.por_area=i,n.antiguedad_promedio=o.length>0?Math.round(c/o.length):0,console.log("✅ Panorámica obtenida:",{total:n.total,areas:n.por_area}),e.json({success:!0,data:{acciones:o,estadisticas:n}})}catch(t){return console.error("❌ Error panorámica pendientes:",t),e.json({success:!1,error:`Error al obtener panorámica de pendientes: ${t.message}`},500)}});function Us(e){const t=new Date,r=Math.floor((t.getTime()-new Date(e.fecha_creacion).getTime())/(1e3*60*60*24));if(e.proxima_revision){const a=new Date(e.proxima_revision),s=Math.floor((a.getTime()-t.getTime())/(1e3*60*60*24));if(s<0)return"vencida";if(s<=1)return"urgente";if(s<=3)return"importante"}return r>14?"muy_antigua":r>7?"antigua":"normal"}function ur(e){const t=new Date(e),r={year:"numeric",month:"short",day:"numeric"};return t.toLocaleDateString("es-ES",r)}const de=new q;de.get("/metricas",async e=>{try{const t=await e.env.DB.prepare("SELECT COUNT(*) as total FROM acciones").first(),r=await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado = "completada"').first(),a=await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado IN ("pendiente", "en_progreso")').first(),s=(t==null?void 0:t.total)||0,o=(r==null?void 0:r.total)||0,n=(a==null?void 0:a.total)||0,i=s>0?Math.round(o/s*100):0;return e.json({success:!0,data:{total_tareas:s,completadas:o,pendientes:n,progreso_global:i}})}catch{return e.json({success:!1,error:"Error al obtener métricas"},500)}});de.get("/por-decreto",async e=>{try{const t=await e.env.DB.prepare(`
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
    `).all(),r={empresarial:[],material:[],humano:[]};for(const s of t.results)r[s.area]&&r[s.area].push(s);const a={empresarial:{total_acciones:r.empresarial.reduce((s,o)=>s+o.total_acciones,0),completadas:r.empresarial.reduce((s,o)=>s+o.completadas,0),progreso:0},material:{total_acciones:r.material.reduce((s,o)=>s+o.total_acciones,0),completadas:r.material.reduce((s,o)=>s+o.completadas,0),progreso:0},humano:{total_acciones:r.humano.reduce((s,o)=>s+o.total_acciones,0),completadas:r.humano.reduce((s,o)=>s+o.completadas,0),progreso:0}};return Object.keys(a).forEach(s=>{const o=a[s];o.progreso=o.total_acciones>0?Math.round(o.completadas/o.total_acciones*100):0}),e.json({success:!0,data:{decretos:t.results,por_area:r,totales_por_area:a}})}catch{return e.json({success:!1,error:"Error al obtener progreso por decreto"},500)}});de.get("/timeline",async e=>{try{const{periodo:t}=e.req.query();let r="";const a=[];switch(t){case"dia":r='WHERE a.fecha_cierre = date("now")';break;case"semana":r='WHERE a.fecha_cierre >= date("now", "-7 days")';break;case"mes":r='WHERE a.fecha_cierre >= date("now", "-30 days")';break;default:break}const s=await e.env.DB.prepare(`
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
    `).bind(...a).all();return e.json({success:!0,data:s.results})}catch{return e.json({success:!1,error:"Error al obtener timeline"},500)}});de.get("/evolucion",async e=>{try{const{dias:t=30}=e.req.query(),r=await e.env.DB.prepare(`
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
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener evolución"},500)}});de.get("/distribucion",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT 
        d.area,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.area
    `).all();return e.json({success:!0,data:t.results})}catch{return e.json({success:!1,error:"Error al obtener distribución"},500)}});de.get("/reporte",async e=>{try{const t=await e.env.DB.prepare(`
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
    `).all(),s=await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first(),o=new Date().toISOString().split("T")[0],n=(t==null?void 0:t.total_tareas)>0?Math.round(((t==null?void 0:t.completadas)||0)/t.total_tareas*100):0;return e.json({success:!0,data:{fecha_reporte:o,usuario:s||{nombre_usuario:"Usuario",frase_vida:""},metricas:{...t,progreso_global:n},decretos:r.results,ultimos_logros:a.results}})}catch{return e.json({success:!1,error:"Error al generar reporte"},500)}});de.get("/estadisticas",async e=>{try{const t=await e.env.DB.prepare("SELECT AVG(calificacion) as promedio FROM acciones WHERE calificacion IS NOT NULL").first(),r=await e.env.DB.prepare(`
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
    `).all();return e.json({success:!0,data:{promedio_calificacion:(t==null?void 0:t.promedio)||0,por_tipo:r.results,dias_mas_productivos:a.results}})}catch{return e.json({success:!1,error:"Error al obtener estadísticas"},500)}});const j=new q;j.get("/rutinas",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT * FROM rutinas_matutinas 
      WHERE activa = 1 
      ORDER BY orden_display ASC
    `).all(),r=e.req.query("fecha_simulada"),a=r||new Date().toISOString().split("T")[0];console.log(`📅 Verificando rutinas para fecha: ${a}${r?" (SIMULADA)":""}`);const s=[];for(const o of t.results){const n=await e.env.DB.prepare(`
        SELECT * FROM rutinas_completadas 
        WHERE rutina_id = ? AND fecha_completada = ?
      `).bind(o.id,a).first();s.push({...o,completada_hoy:!!n,detalle_hoy:n||null})}return e.json({success:!0,data:s})}catch{return e.json({success:!1,error:"Error al obtener rutinas"},500)}});j.post("/rutinas/:id/completar",async e=>{try{const t=e.req.param("id"),{tiempo_invertido:r,notas:a}=await e.req.json(),s=new Date().toISOString().split("T")[0];return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas)
      VALUES (?, ?, ?, ?)
    `).bind(t,s,r||null,a||"").run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al completar rutina"},500)}});j.delete("/rutinas/:id/completar",async e=>{try{const t=e.req.param("id"),r=new Date().toISOString().split("T")[0];return await e.env.DB.prepare(`
      DELETE FROM rutinas_completadas 
      WHERE rutina_id = ? AND fecha_completada = ?
    `).bind(t,r).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al desmarcar rutina"},500)}});j.get("/rutinas/progreso",async e=>{try{const{dias:t=7}=e.req.query(),r=await e.env.DB.prepare(`
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
    `).bind(t,t,t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener progreso de rutinas"},500)}});j.get("/rutinas/progreso-dia",async e=>{try{const t=new Date().toISOString().split("T")[0],r=await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(),a=await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(t).first(),s=(r==null?void 0:r.total)||0,o=(a==null?void 0:a.completadas)||0,n=s>0?Math.round(o/s*100):0;return e.json({success:!0,data:{total_rutinas:s,completadas_hoy:o,porcentaje_progreso:n,fecha:t}})}catch{return e.json({success:!1,error:"Error al obtener progreso del día"},500)}});j.get("/rutinas/progreso-dia/:fecha",async e=>{try{const t=e.req.param("fecha")||new Date().toISOString().split("T")[0],r=await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(),a=await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(t).first(),s=(r==null?void 0:r.total)||0,o=(a==null?void 0:a.completadas)||0,n=s>0?Math.round(o/s*100):0;return e.json({success:!0,data:{total_rutinas:s,completadas_hoy:o,porcentaje_progreso:n,fecha:t}})}catch{return e.json({success:!1,error:"Error al obtener progreso del día"},500)}});j.get("/afirmaciones",async e=>{try{const{categoria:t,favoritas:r}=e.req.query();let a="SELECT * FROM afirmaciones WHERE 1=1";const s=[];t&&t!=="todas"&&(a+=" AND categoria = ?",s.push(t)),r==="true"&&(a+=" AND es_favorita = 1"),a+=" ORDER BY es_favorita DESC, veces_usada DESC, created_at DESC";const o=await e.env.DB.prepare(a).bind(...s).all();return e.json({success:!0,data:o.results})}catch{return e.json({success:!1,error:"Error al obtener afirmaciones"},500)}});j.post("/afirmaciones",async e=>{try{const{texto:t,categoria:r}=await e.req.json();if(!t||!r)return e.json({success:!1,error:"Texto y categoría son requeridos"},400);const a=await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(t,r).run();return e.json({success:!0,id:a.meta.last_row_id})}catch{return e.json({success:!1,error:"Error al crear afirmación"},500)}});j.put("/afirmaciones/:id/favorita",async e=>{try{const t=e.req.param("id"),{es_favorita:r}=await e.req.json();return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        es_favorita = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(r?1:0,t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al actualizar favorita"},500)}});j.post("/afirmaciones/:id/usar",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        veces_usada = veces_usada + 1,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al marcar como usada"},500)}});j.delete("/afirmaciones/:id",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare("DELETE FROM afirmaciones WHERE id = ?").bind(t).run(),e.json({success:!0})}catch{return e.json({success:!1,error:"Error al eliminar afirmación"},500)}});j.get("/afirmaciones/del-dia",async e=>{try{const t=await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 1 
      ORDER BY RANDOM() 
      LIMIT 2
    `).all(),r=await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 0 
      ORDER BY RANDOM() 
      LIMIT 3
    `).all(),a=[...t.results,...r.results];return e.json({success:!0,data:a})}catch{return e.json({success:!1,error:"Error al obtener afirmaciones del día"},500)}});j.post("/afirmaciones/generar",async e=>{try{const{categoria:t="general"}=await e.req.json(),r={empresarial:["Soy un líder natural que inspira confianza y respeto en mi equipo","Mis ideas innovadoras transforman mi empresa y generan abundantes resultados","Tengo la capacidad de tomar decisiones sabias que impulsan mi éxito empresarial","Mi negocio crece exponencialmente mientras mantengo mi integridad y valores","Soy un imán para las oportunidades de negocio perfectas en el momento ideal","Mi visión empresarial se materializa con facilidad y genera impacto positivo","Lidero con sabiduría y compasión, creando un ambiente de trabajo próspero","Mis habilidades de comunicación abren puertas a alianzas estratégicas valiosas"],material:["La abundancia fluye hacia mí desde múltiples fuentes de manera constante","Soy un canal abierto para recibir prosperidad en todas sus formas","Mi relación con el dinero es saludable, positiva y equilibrada","Tengo todo lo que necesito y más para vivir una vida plena y próspera","Las oportunidades de generar ingresos aparecen naturalmente en mi camino","Merece vivir en abundancia y celebro cada manifestación de prosperidad","Mi valor y talento se compensan generosamente en el mercado","Creo riqueza mientras contribuyo positivamente al bienestar de otros"],humano:["Soy digno/a de amor incondicional y atraigo relaciones armoniosas a mi vida","Mi corazón está abierto para dar y recibir amor en todas sus formas","Cultivo relaciones basadas en el respeto mutuo, la comprensión y la alegría","Me rodeo de personas que me apoyan y celebran mi crecimiento personal","Comunico mis sentimientos con claridad, compasión y autenticidad","Mi presencia inspira calma, alegría y confianza en quienes me rodean","Perdono fácilmente y libero cualquier resentimiento que no me sirve","Cada día fortalezco los vínculos importantes en mi vida con amor y gratitud"],general:["Cada día me convierto en la mejor versión de mí mismo/a con alegría y gratitud","Confío plenamente en mi sabiduría interior para guiar mis decisiones","Soy resiliente y transformo cada desafío en una oportunidad de crecimiento","Mi vida está llena de propósito, significado y experiencias enriquecedoras","Irradio paz, amor y luz positiva donde quiera que vaya","Soy el/la arquitecto/a consciente de mi realidad y creo con intención clara","Mi mente es clara, mi corazón está abierto y mi espíritu es libre","Celebro mis logros y aprendo valiosas lecciones de cada experiencia"]},a=r[t]||r.general,s=a[Math.floor(Math.random()*a.length)],o=await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(s,t).run(),n=await e.env.DB.prepare(`
      SELECT * FROM afirmaciones WHERE rowid = ?
    `).bind(o.meta.last_row_id).first();return e.json({success:!0,data:n})}catch(t){return console.error("Error al generar afirmación:",t),e.json({success:!1,error:"Error al generar afirmación"},500)}});j.get("/rutinas/:id/preguntas",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare(`
      SELECT * FROM rutinas_preguntas 
      WHERE rutina_id = ? AND activa = 1
      ORDER BY orden ASC
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch{return e.json({success:!1,error:"Error al obtener preguntas de rutina"},500)}});j.post("/rutinas/:id/completar-detallado",async e=>{try{const t=e.req.param("id"),{tiempo_invertido:r,notas:a,respuestas:s,estado_animo_antes:o,estado_animo_despues:n,calidad_percibida:i,ubicacion:c}=await e.req.json(),d=new Date().toISOString().split("T")[0],l=new Date().toISOString();return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas, respuestas_json, 
       estado_animo_antes, estado_animo_despues, calidad_percibida, ubicacion, 
       tiempo_inicio, tiempo_fin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(t,d,r||null,a||"",JSON.stringify(s||{}),o||null,n||null,i||null,c||null,l,new Date().toISOString()).run(),await e.env.DB.prepare(`
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
    `).bind(d,d).run(),e.json({success:!0})}catch(t){return console.error("Error al completar rutina detallada:",t),e.json({success:!1,error:"Error al completar rutina"},500)}});j.get("/rutinas/analytics",async e=>{try{const{dias:t=30}=e.req.query(),r=await e.env.DB.prepare(`
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
    `).first();return e.json({success:!0,data:{tendencias_por_rutina:r.results,progreso_diario:a.results,racha_actual:(s==null?void 0:s.racha)||0,resumen:{dias_analizados:t,fecha_inicio:new Date(Date.now()-t*24*60*60*1e3).toISOString().split("T")[0],fecha_fin:new Date().toISOString().split("T")[0]}}})}catch(t){return console.error("Error al obtener analytics:",t),e.json({success:!1,error:"Error al obtener analytics"},500)}});j.get("/rutinas/progreso-dia/:fecha",async e=>{try{const t=e.req.param("fecha"),r=await e.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM rutinas_matutinas
      WHERE activa = 1
    `).first(),a=await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas
      FROM rutinas_completadas
      WHERE fecha_completada = ?
    `).bind(t).first(),s=(r==null?void 0:r.total)||0,o=(a==null?void 0:a.completadas)||0,n=s>0?Math.round(o/s*100):0;return e.json({success:!0,data:{fecha:t,total_rutinas:s,rutinas_completadas:o,rutinas_pendientes:s-o,porcentaje_progreso:n}})}catch{return e.json({success:!1,error:"Error al obtener progreso del día"},500)}});j.get("/estadisticas",async e=>{try{const t=await e.env.DB.prepare(`
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
    `).all();return e.json({success:!0,data:{racha_actual:(t==null?void 0:t.racha)||0,afirmaciones_por_categoria:r.results,rutina_mas_completada:a,progreso_semanal:s.results}})}catch{return e.json({success:!1,error:"Error al obtener estadísticas"},500)}});const mt=new q,qs=`# PROMPT CHATBOT - HELENE HADSELL (VERSIÓN HÍBRIDA DEFINITIVA)

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

¡Adelante, dear! 💫👑`;mt.post("/chat",async e=>{try{const{message:t,conversationHistory:r=[]}=await e.req.json();if(!t)return e.json({success:!1,error:"Mensaje requerido"},400);const a=e.req.header("X-User-ID");let s="";if(a){const l=await e.env.DB.prepare(`
        SELECT titulo, categoria, descripcion
        FROM decretos
        WHERE user_id = ? AND estado = 'activo'
        LIMIT 3
      `).bind(a).all();l.results.length>0&&(s=`

DECRETOS ACTUALES DEL USUARIO:
${l.results.map(u=>`- ${u.categoria}: ${u.titulo}`).join(`
`)}

Usa esta información para dar coaching personalizado y específico.`)}const o=[{role:"user",content:qs+s},{role:"assistant",content:"¡Hola dear! Soy Helene Hadsell, La Reina de los Concursos. Estoy aquí para ayudarte a manifestar tus sueños usando mi método SPEC. ¿Qué quieres crear en tu vida?"},...r.map(l=>({role:l.role,content:l.content})),{role:"user",content:t}];console.log("🤖 Enviando mensaje a Gemini...");const n=e.env.GOOGLE_AI_API_KEY||"";if(!n)return e.json({success:!1,error:"API key no configurada"},500);const i=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:o.map(l=>({role:l.role==="assistant"?"model":"user",parts:[{text:l.content}]})),generationConfig:{temperature:.9,topK:40,topP:.95,maxOutputTokens:2048},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_MEDIUM_AND_ABOVE"},{category:"HARM_CATEGORY_HATE_SPEECH",threshold:"BLOCK_MEDIUM_AND_ABOVE"},{category:"HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold:"BLOCK_MEDIUM_AND_ABOVE"},{category:"HARM_CATEGORY_DANGEROUS_CONTENT",threshold:"BLOCK_MEDIUM_AND_ABOVE"}]})}),c=await i.json();if(!i.ok)return console.error("❌ Error de Gemini:",c),e.json({success:!1,error:"Error al procesar mensaje con IA",details:c},500);const d=c.candidates[0].content.parts[0].text;return console.log("✅ Respuesta de Helene generada"),a&&await e.env.DB.prepare(`
        INSERT INTO chatbot_conversaciones (user_id, mensaje_usuario, respuesta_helene, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(a,t,d).run(),e.json({success:!0,data:{message:d,conversationHistory:[...r,{role:"user",content:t},{role:"assistant",content:d}]}})}catch(t){return console.error("❌ Error en chatbot:",t),e.json({success:!1,error:"Error interno del servidor",details:t instanceof Error?t.message:String(t)},500)}});mt.get("/history",async e=>{try{const t=e.req.header("X-User-ID");if(!t)return e.json({success:!1,error:"Usuario no autenticado"},401);const r=await e.env.DB.prepare(`
      SELECT mensaje_usuario, respuesta_helene, created_at
      FROM chatbot_conversaciones
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch(t){return console.error("❌ Error al obtener historial:",t),e.json({success:!1,error:"Error al obtener historial"},500)}});mt.delete("/history",async e=>{try{const t=e.req.header("X-User-ID");return t?(await e.env.DB.prepare(`
      DELETE FROM chatbot_conversaciones
      WHERE user_id = ?
    `).bind(t).run(),e.json({success:!0})):e.json({success:!1,error:"Usuario no autenticado"},401)}catch(t){return console.error("❌ Error al limpiar historial:",t),e.json({success:!1,error:"Error al limpiar historial"},500)}});const le=new q;async function Bs(e,t,r){const a=["material","humano","empresarial"],s={};for(const o of a){const i=await e.prepare(`
      SELECT
        d.*,
        COALESCE(
          julianday(?) - julianday(d.last_primary_date),
          julianday(?) - julianday(d.created_at)
        ) as days_since_primary
      FROM decretos d
      WHERE d.categoria = ?
      ORDER BY
        days_since_primary DESC,
        d.faith_level ASC,
        d.created_at ASC
      LIMIT 1
    `).bind(r,r,o).first();if(!i)throw new Error(`No hay decretos en categoría ${o}`);s[o]=i}return s}le.get("/today",async e=>{try{const t=e.req.header("X-User-ID")||"demo-user",r=e.env.DB,a=new Date().toISOString().split("T")[0];let s=await r.prepare(`
      SELECT
        dr.*,
        dm.titulo as material_titulo,
        dm.descripcion as material_description,
        dh.titulo as humano_titulo,
        dh.descripcion as humano_description,
        de.titulo as empresarial_titulo,
        de.descripcion as empresarial_description
      FROM daily_rotation dr
      LEFT JOIN decretos dm ON dr.decreto_material_id = dm.id
      LEFT JOIN decretos dh ON dr.decreto_humano_id = dh.id
      LEFT JOIN decretos de ON dr.decreto_empresarial_id = de.id
      WHERE dr.user_id = ? AND dr.date = ?
    `).bind(t,a).first();if(!s){const m=await Bs(r,t,a);await r.prepare(`
        INSERT INTO daily_rotation (user_id, date, decreto_material_id, decreto_humano_id, decreto_empresarial_id)
        VALUES (?, ?, ?, ?, ?)
      `).bind(t,a,m.material.id,m.humano.id,m.empresarial.id).run();for(const[_,E]of Object.entries(m))await r.prepare(`
          UPDATE decretos SET last_primary_date = ? WHERE id = ?
        `).bind(a,E.id).run();s=await r.prepare(`
        SELECT
          dr.*,
          dm.titulo as material_titulo,
          dm.descripcion as material_description,
          dm.faith_level as material_faith,
          dh.titulo as humano_titulo,
          dh.descripcion as humano_description,
          dh.faith_level as humano_faith,
          de.titulo as empresarial_titulo,
          de.descripcion as empresarial_description,
          de.faith_level as empresarial_faith
        FROM daily_rotation dr
        LEFT JOIN decretos dm ON dr.decreto_material_id = dm.id
        LEFT JOIN decretos dh ON dr.decreto_humano_id = dh.id
        LEFT JOIN decretos de ON dr.decreto_empresarial_id = de.id
        WHERE dr.user_id = ? AND dr.date = ?
      `).bind(t,a).first()}const o=await r.prepare(`
      SELECT
        d.*,
        CASE
          WHEN d.id = ? THEN 'primary'
          WHEN d.id = ? THEN 'primary'
          WHEN d.id = ? THEN 'primary'
          ELSE 'secondary'
        END as role
      FROM decretos d
      WHERE d.id NOT IN (?, ?, ?)
    `).bind(s.decreto_material_id,s.decreto_humano_id,s.decreto_empresarial_id,s.decreto_material_id,s.decreto_humano_id,s.decreto_empresarial_id).all(),n=await r.prepare(`
      SELECT * FROM daily_routines
      WHERE user_id = ? AND date = ?
    `).bind(t,a).all(),i=await r.prepare(`
      SELECT * FROM faith_tracking
      WHERE user_id = ? AND date = ?
    `).bind(t,a).all(),c=await r.prepare(`
      SELECT * FROM merit_commitments
      WHERE user_id = ? AND date = ?
    `).bind(t,a).first(),d=await r.prepare(`
      SELECT * FROM task_completion
      WHERE user_id = ? AND date = ?
    `).bind(t,a).all(),l=new Date(a).getDay(),p=["RECARGA","SELECT","PROJECT","EXPECT","MERECIMIENTO","ACCION","GRATITUD"][l];return e.json({success:!0,data:{date:a,dailyFocus:p,primary:{material:{id:s.decreto_material_id,titulo:s.material_titulo,description:s.material_description,faith_level:s.material_faith},humano:{id:s.decreto_humano_id,titulo:s.humano_titulo,description:s.humano_description,faith_level:s.humano_faith},empresarial:{id:s.decreto_empresarial_id,titulo:s.empresarial_titulo,description:s.empresarial_description,faith_level:s.empresarial_faith}},secondary:o.results,routines:n.results,faithCheckins:i.results,meritCommitment:c,completedTasks:d.results}})}catch(t){return console.error("Error al obtener rotación del día:",t),e.json({success:!1,error:t.message||"Error al obtener rotación del día"},500)}});le.post("/complete-task",async e=>{try{const t=e.req.header("X-User-ID")||"demo-user",r=e.env.DB,{decretoId:a,taskType:s,minutesSpent:o,notes:n}=await e.req.json(),i=new Date().toISOString().split("T")[0],c=new Date().toISOString();return await r.prepare(`
      INSERT INTO task_completion (user_id, decreto_id, date, task_type, completed, minutes_spent, notes, completed_at)
      VALUES (?, ?, ?, ?, 1, ?, ?, ?)
      ON CONFLICT(user_id, decreto_id, date, task_type)
      DO UPDATE SET
        completed = 1,
        minutes_spent = excluded.minutes_spent,
        notes = excluded.notes,
        completed_at = excluded.completed_at
    `).bind(t,a,i,s,o||0,n||"",c).run(),e.json({success:!0,message:"Tarea marcada como completada"})}catch(t){return console.error("Error al completar tarea:",t),e.json({success:!1,error:t.message||"Error al completar tarea"},500)}});le.post("/faith-checkin",async e=>{try{const t=e.req.header("X-User-ID")||"demo-user",r=e.env.DB,{decretoId:a,checkInTime:s,faithLevel:o,notes:n}=await e.req.json(),i=new Date().toISOString().split("T")[0];if(o<1||o>10)return e.json({success:!1,error:"El nivel de fe debe estar entre 1 y 10"},400);await r.prepare(`
      INSERT INTO faith_tracking (user_id, decreto_id, date, check_in_time, faith_level, notes)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, decreto_id, date, check_in_time)
      DO UPDATE SET
        faith_level = excluded.faith_level,
        notes = excluded.notes
    `).bind(t,a,i,s,o,n||"").run();const c=await r.prepare(`
      SELECT AVG(faith_level) as avg_faith
      FROM faith_tracking
      WHERE decreto_id = ?
        AND date >= date('now', '-7 days')
    `).bind(a).first();return await r.prepare(`
      UPDATE decretos SET faith_level = ? WHERE id = ?
    `).bind(c.avg_faith||o,a).run(),e.json({success:!0,message:"Check-in de fe registrado",data:{avgFaith:c.avg_faith}})}catch(t){return console.error("Error al registrar check-in de fe:",t),e.json({success:!1,error:t.message||"Error al registrar check-in de fe"},500)}});le.post("/merit-commitment",async e=>{try{const t=e.req.header("X-User-ID")||"demo-user",r=e.env.DB,{commitment:a,completed:s,reflection:o}=await e.req.json(),n=new Date().toISOString().split("T")[0],i=new Date().toISOString();return await r.prepare(`
      INSERT INTO merit_commitments (user_id, date, commitment, completed, completed_at, reflection)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, date)
      DO UPDATE SET
        commitment = excluded.commitment,
        completed = excluded.completed,
        completed_at = excluded.completed_at,
        reflection = excluded.reflection
    `).bind(t,n,a,s?1:0,s?i:null,o||"").run(),e.json({success:!0,message:"Compromiso de merecimiento guardado"})}catch(t){return console.error("Error al guardar compromiso de merecimiento:",t),e.json({success:!1,error:t.message||"Error al guardar compromiso"},500)}});le.post("/routine",async e=>{try{const t=e.req.header("X-User-ID")||"demo-user",r=e.env.DB,{routineType:a,notes:s}=await e.req.json(),o=new Date().toISOString().split("T")[0],n=new Date().toISOString();return await r.prepare(`
      INSERT INTO daily_routines (user_id, date, routine_type, completed, completed_at, notes)
      VALUES (?, ?, ?, 1, ?, ?)
      ON CONFLICT(user_id, date, routine_type)
      DO UPDATE SET
        completed = 1,
        completed_at = excluded.completed_at,
        notes = excluded.notes
    `).bind(t,o,a,n,s||"").run(),e.json({success:!0,message:`Rutina ${a==="morning"?"matutina":"vespertina"} completada`})}catch(t){return console.error("Error al completar rutina:",t),e.json({success:!1,error:t.message||"Error al completar rutina"},500)}});le.get("/stats",async e=>{try{const t=e.req.header("X-User-ID")||"demo-user",r=e.env.DB,a=await r.prepare(`
      SELECT
        date,
        COUNT(*) as total_tasks,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_tasks,
        SUM(minutes_spent) as total_minutes
      FROM task_completion
      WHERE user_id = ?
        AND date >= date('now', '-7 days')
      GROUP BY date
      ORDER BY date DESC
    `).bind(t).all(),s=await r.prepare(`
      SELECT
        d.categoria,
        AVG(ft.faith_level) as avg_faith
      FROM faith_tracking ft
      JOIN decretos d ON ft.decreto_id = d.id
      WHERE ft.user_id = ?
        AND ft.date >= date('now', '-7 days')
      GROUP BY d.categoria
    `).bind(t).all(),o=await r.prepare(`
      SELECT COUNT(DISTINCT date) as streak_days
      FROM daily_routines
      WHERE user_id = ?
        AND date >= date('now', '-30 days')
        AND completed = 1
    `).bind(t).first();return e.json({success:!0,data:{completionStats:a.results,avgFaithByCategory:s.results,streak:o.streak_days||0}})}catch(t){return console.error("Error al obtener estadísticas:",t),e.json({success:!1,error:t.message||"Error al obtener estadísticas"},500)}});le.post("/signal",async e=>{try{const t=e.req.header("X-User-ID")||"demo-user",r=e.env.DB,{decretoId:a,description:s,signalType:o,emotionalImpact:n}=await e.req.json(),i=new Date().toISOString().split("T")[0];return await r.prepare(`
      INSERT INTO signals_synchronicities (user_id, decreto_id, date, description, signal_type, emotional_impact)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(t,a,i,s,o||"señal",n||null).run(),e.json({success:!0,message:"Señal registrada exitosamente"})}catch(t){return console.error("Error al registrar señal:",t),e.json({success:!1,error:t.message||"Error al registrar señal"},500)}});var ks=/^[\w!#$%&'*.^`|~+-]+$/,Fs=/^[ !#-:<-[\]-~]*$/,$s=(e,t)=>{if(e.indexOf(t)===-1)return{};const r=e.trim().split(";"),a={};for(let s of r){s=s.trim();const o=s.indexOf("=");if(o===-1)continue;const n=s.substring(0,o).trim();if(t!==n||!ks.test(n))continue;let i=s.substring(o+1).trim();if(i.startsWith('"')&&i.endsWith('"')&&(i=i.slice(1,-1)),Fs.test(i)){a[n]=i.indexOf("%")!==-1?ft(i,qt):i;break}}return a},Ws=(e,t,r={})=>{let a=`${e}=${t}`;if(e.startsWith("__Secure-")&&!r.secure)throw new Error("__Secure- Cookie must have Secure attributes");if(e.startsWith("__Host-")){if(!r.secure)throw new Error("__Host- Cookie must have Secure attributes");if(r.path!=="/")throw new Error('__Host- Cookie must have Path attributes with "/"');if(r.domain)throw new Error("__Host- Cookie must not have Domain attributes")}if(r&&typeof r.maxAge=="number"&&r.maxAge>=0){if(r.maxAge>3456e4)throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");a+=`; Max-Age=${r.maxAge|0}`}if(r.domain&&r.prefix!=="host"&&(a+=`; Domain=${r.domain}`),r.path&&(a+=`; Path=${r.path}`),r.expires){if(r.expires.getTime()-Date.now()>3456e7)throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");a+=`; Expires=${r.expires.toUTCString()}`}if(r.httpOnly&&(a+="; HttpOnly"),r.secure&&(a+="; Secure"),r.sameSite&&(a+=`; SameSite=${r.sameSite.charAt(0).toUpperCase()+r.sameSite.slice(1)}`),r.priority&&(a+=`; Priority=${r.priority.charAt(0).toUpperCase()+r.priority.slice(1)}`),r.partitioned){if(!r.secure)throw new Error("Partitioned Cookie must have Secure attributes");a+="; Partitioned"}return a},bt=(e,t,r)=>(t=encodeURIComponent(t),Ws(e,t,r)),Ft=(e,t,r)=>{const a=e.req.raw.headers.get("Cookie");{if(!a)return;let s=t;return $s(a,s)[s]}},Gs=(e,t,r)=>{let a;return(r==null?void 0:r.prefix)==="secure"?a=bt("__Secure-"+e,t,{path:"/",...r,secure:!0}):(r==null?void 0:r.prefix)==="host"?a=bt("__Host-"+e,t,{...r,path:"/",secure:!0,domain:void 0}):a=bt(e,t,{path:"/",...r}),a},sa=(e,t,r,a)=>{const s=Gs(t,r,a);e.header("Set-Cookie",s,{append:!0})};const ve=new q,fe={generateToken(){return Math.random().toString(36).substr(2)+Date.now().toString(36)},verifyPassword(e,t){return e===t},hashPassword(e){return"$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"},isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)},async createSession(e,t,r){const a=this.generateToken(),s=new Date,o=r?30*24:24;return s.setHours(s.getHours()+o),await e.prepare(`
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
    `).run()}};ve.post("/register",async e=>{try{const{name:t,email:r,password:a}=await e.req.json();if(!t||!r||!a)return e.json({error:"Nombre, email y contraseña son requeridos"},400);if(!fe.isValidEmail(r))return e.json({error:"Formato de email inválido"},400);if(a.length<6)return e.json({error:"La contraseña debe tener al menos 6 caracteres"},400);if(await e.env.DB.prepare(`
      SELECT id FROM auth_users WHERE email = ?
    `).bind(r).first())return e.json({error:"Ya existe una cuenta con este email"},409);const o=await e.env.DB.prepare(`
      INSERT INTO auth_users (email, password_hash, name, is_active)
      VALUES (?, ?, ?, 1)
    `).bind(r,a,t).run();return o.success?e.json({success:!0,message:"Cuenta creada exitosamente",user:{id:o.meta.last_row_id,email:r,name:t}}):e.json({error:"Error al crear la cuenta"},500)}catch(t){return console.error("Error en registro:",t),e.json({error:"Error interno del servidor"},500)}});ve.post("/login",async e=>{try{const{email:t,password:r,remember:a=!1}=await e.req.json();if(!t||!r)return e.json({error:"Email y contraseña son requeridos"},400);if(!fe.isValidEmail(t))return e.json({error:"Formato de email inválido"},400);const s=await e.env.DB.prepare(`
      SELECT id, email, name, password_hash, is_active, last_login
      FROM auth_users 
      WHERE email = ?
    `).bind(t).first();if(!s||!s.is_active)return e.json({error:"Credenciales incorrectas"},401);if(!fe.verifyPassword(r,s.password_hash))return e.json({error:"Credenciales incorrectas"},401);await e.env.DB.prepare(`
      UPDATE auth_users 
      SET last_login = datetime('now')
      WHERE id = ?
    `).bind(s.id).run();const o=await fe.createSession(e.env.DB,s.id,a);return await fe.cleanExpiredSessions(e.env.DB),a&&sa(e,"yo-decreto-token",o,{maxAge:30*24*60*60,httpOnly:!1,secure:!1,sameSite:"Lax"}),e.json({success:!0,token:o,user:{id:s.id,email:s.email,name:s.name,last_login:s.last_login}})}catch(t){return console.error("Error en login:",t),e.json({error:"Error interno del servidor"},500)}});ve.get("/validate",async e=>{try{const t=e.req.header("Authorization"),r=Ft(e,"yo-decreto-token");let a=null;if(t&&t.startsWith("Bearer ")?a=t.substring(7):r&&(a=r),!a)return e.json({error:"Token no proporcionado"},401);const s=await fe.validateSession(e.env.DB,a);return s?e.json({success:!0,user:{id:s.id,email:s.email,name:s.name,last_login:s.last_login}}):e.json({error:"Sesión inválida o expirada"},401)}catch(t){return console.error("Error validando sesión:",t),e.json({error:"Error interno del servidor"},500)}});ve.post("/logout",async e=>{try{const t=e.req.header("Authorization"),r=Ft(e,"yo-decreto-token");let a=null;return t&&t.startsWith("Bearer ")?a=t.substring(7):r&&(a=r),a&&(await e.env.DB.prepare(`
        DELETE FROM auth_sessions 
        WHERE session_token = ?
      `).bind(a).run(),sa(e,"yo-decreto-token","",{maxAge:0})),e.json({success:!0,message:"Sesión cerrada correctamente"})}catch(t){return console.error("Error en logout:",t),e.json({error:"Error interno del servidor"},500)}});ve.get("/me",async e=>{try{const t=e.req.header("Authorization"),r=Ft(e,"yo-decreto-token");let a=null;if(t&&t.startsWith("Bearer ")?a=t.substring(7):r&&(a=r),!a)return e.json({error:"Token no proporcionado"},401);const s=await fe.validateSession(e.env.DB,a);return s?e.json({success:!0,user:{id:s.id,email:s.email,name:s.name,last_login:s.last_login}}):e.json({error:"Sesión inválida"},401)}catch(t){return console.error("Error obteniendo usuario:",t),e.json({error:"Error interno del servidor"},500)}});ve.get("/stats",async e=>{try{const t=await e.env.DB.prepare(`
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
    `).first();return e.json({success:!0,stats:{sessions:t,users:r}})}catch(t){return console.error("Error obteniendo estadísticas:",t),e.json({error:"Error interno del servidor"},500)}});const F=new q;F.get("/auth-url",async e=>{var t,r;try{console.log("DEBUG: Starting auth-url endpoint"),console.log("DEBUG: c.env:",e.env),console.log("DEBUG: typeof c.env:",typeof e.env),console.log("DEBUG: c.env keys:",e.env?Object.keys(e.env):"c.env is null/undefined");const a=(t=e.env)==null?void 0:t.GOOGLE_CLIENT_ID,s=((r=e.env)==null?void 0:r.GOOGLE_REDIRECT_URI)||`${new URL(e.req.url).origin}/api/google-calendar/callback`;if(console.log("DEBUG: clientId:",a?"SET":"NOT SET"),console.log("DEBUG: redirectUri:",s),!a)return e.json({success:!1,error:"Google Calendar no está configurado. Falta GOOGLE_CLIENT_ID.",debug:{hasEnv:!!e.env,envKeys:e.env?Object.keys(e.env):[]}},500);const o=["https://www.googleapis.com/auth/calendar.events","https://www.googleapis.com/auth/calendar.readonly"].join(" "),n=new URL("https://accounts.google.com/o/oauth2/v2/auth");return n.searchParams.set("client_id",a),n.searchParams.set("redirect_uri",s),n.searchParams.set("response_type","code"),n.searchParams.set("scope",o),n.searchParams.set("access_type","offline"),n.searchParams.set("prompt","consent"),e.json({success:!0,data:{authUrl:n.toString()}})}catch(a){return console.error("Error generating auth URL:",a),console.error("Error stack:",a.stack),e.json({success:!1,error:a.message||"Error al generar URL de autenticación",errorType:a.constructor.name,errorStack:a.stack},500)}});F.get("/callback",async e=>{try{const t=e.req.query("code"),r=e.req.query("error");if(r)return e.redirect(`/?google_auth_error=${r}`);if(!t)return e.json({success:!1,error:"No se recibió código de autorización"},400);const a=e.env.DB,s=e.env.GOOGLE_CLIENT_ID,o=e.env.GOOGLE_CLIENT_SECRET,n=e.env.GOOGLE_REDIRECT_URI||`${new URL(e.req.url).origin}/api/google-calendar/callback`,i=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code:t,client_id:s,client_secret:o,redirect_uri:n,grant_type:"authorization_code"})}),c=await i.json();if(!i.ok)throw new Error(c.error_description||"Error al obtener tokens");const d=new Date(Date.now()+c.expires_in*1e3).toISOString();return await a.prepare(`
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
    `).bind("demo-user",c.access_token,c.refresh_token,d).run(),e.redirect("/?google_auth_success=1")}catch(t){return console.error("Error in OAuth callback:",t),e.redirect(`/?google_auth_error=${encodeURIComponent(t.message)}`)}});F.get("/status",async e=>{try{const a=await e.env.DB.prepare(`
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
    `).bind("demo-user").first();return e.json({success:!0,data:a||{is_connected:0}})}catch(t){return console.error("Error getting integration status:",t),e.json({success:!1,error:t.message||"Error al obtener estado de integración"},500)}});F.post("/disconnect",async e=>{try{return await e.env.DB.prepare(`
      UPDATE user_integrations
      SET
        google_access_token = NULL,
        google_refresh_token = NULL,
        google_token_expiry = NULL,
        sync_enabled = 0,
        updated_at = datetime('now')
      WHERE user_id = ?
    `).bind("demo-user").run(),e.json({success:!0,message:"Google Calendar desconectado exitosamente"})}catch(t){return console.error("Error disconnecting Google Calendar:",t),e.json({success:!1,error:t.message||"Error al desconectar Google Calendar"},500)}});F.put("/settings",async e=>{try{const t=e.env.DB,r="demo-user",a=await e.req.json(),{auto_import:s,auto_export:o,export_rutinas:n,export_decretos_primarios:i,export_agenda_eventos:c,export_acciones:d,conflict_resolution:l,timezone:u}=a;return await t.prepare(`
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
    `).bind(s,o,n,i,c,d,l,u,r).run(),e.json({success:!0,message:"Configuración actualizada exitosamente"})}catch(t){return console.error("Error updating settings:",t),e.json({success:!1,error:t.message||"Error al actualizar configuración"},500)}});async function zs(e,t){const r=e.env.DB,a=e.env.GOOGLE_CLIENT_ID,s=e.env.GOOGLE_CLIENT_SECRET,o=await r.prepare(`
    SELECT google_refresh_token, google_token_expiry
    FROM user_integrations
    WHERE user_id = ?
  `).bind(t).first();if(!(o!=null&&o.google_refresh_token))throw new Error("No refresh token available");const n=new Date,i=new Date(o.google_token_expiry);if(n<i)return null;const c=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:a,client_secret:s,refresh_token:o.google_refresh_token,grant_type:"refresh_token"})}),d=await c.json();if(!c.ok)throw new Error(d.error_description||"Error refreshing token");const l=new Date(Date.now()+d.expires_in*1e3).toISOString();return await r.prepare(`
    UPDATE user_integrations
    SET
      google_access_token = ?,
      google_token_expiry = ?,
      updated_at = datetime('now')
    WHERE user_id = ?
  `).bind(d.access_token,l,t).run(),d.access_token}async function Et(e,t){const r=e.env.DB,a=await zs(e,t);if(a)return a;const s=await r.prepare(`
    SELECT google_access_token
    FROM user_integrations
    WHERE user_id = ?
  `).bind(t).first();if(!(s!=null&&s.google_access_token))throw new Error("No access token available. Please reconnect Google Calendar.");return s.google_access_token}F.post("/import",async e=>{var t,r,a,s,o,n;try{const i=e.env.DB,c="demo-user",{startDate:d,endDate:l}=await e.req.json(),p=(await i.prepare(`
      INSERT INTO sync_log (user_id, sync_type, sync_direction, started_at)
      VALUES (?, 'import', 'google_to_local', datetime('now'))
    `).bind(c).run()).meta.last_row_id;try{const m=await Et(e,c),_=await i.prepare(`
        SELECT google_calendar_id, timezone
        FROM user_integrations
        WHERE user_id = ?
      `).bind(c).first(),E=(_==null?void 0:_.google_calendar_id)||"primary",h=new URL(`https://www.googleapis.com/calendar/v3/calendars/${E}/events`);h.searchParams.set("timeMin",d||new Date().toISOString()),h.searchParams.set("timeMax",l||new Date(Date.now()+30*24*60*60*1e3).toISOString()),h.searchParams.set("singleEvents","true"),h.searchParams.set("orderBy","startTime");const g=await fetch(h.toString(),{headers:{Authorization:`Bearer ${m}`,Accept:"application/json"}}),v=await g.json();if(!g.ok)throw new Error(((t=v.error)==null?void 0:t.message)||"Error fetching events from Google Calendar");const O=v.items||[];let S=0,b=0;for(const C of O){const Y=((r=C.start)==null?void 0:r.dateTime)||((a=C.start)==null?void 0:a.date),$=((s=C.end)==null?void 0:s.dateTime)||((o=C.end)==null?void 0:o.date),_t=!((n=C.start)!=null&&n.dateTime);(await i.prepare(`
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
        `).bind(C.id,c,C.summary||"(Sin título)",C.description||null,Y,$,_t?1:0,C.location||null,C.attendees?JSON.stringify(C.attendees):null,C.colorId||null,C.recurringEventId?1:0,C.recurringEventId||null).run()).meta.changes>0&&(await i.prepare(`
            SELECT id FROM google_events WHERE google_event_id = ?
          `).bind(C.id).first()?b++:S++)}return await i.prepare(`
        UPDATE sync_log
        SET
          events_processed = ?,
          events_created = ?,
          events_updated = ?,
          completed_at = datetime('now'),
          status = 'completed'
        WHERE id = ?
      `).bind(O.length,S,b,p).run(),await i.prepare(`
        UPDATE user_integrations
        SET last_import = datetime('now')
        WHERE user_id = ?
      `).bind(c).run(),e.json({success:!0,data:{eventsProcessed:O.length,eventsCreated:S,eventsUpdated:b}})}catch(m){throw await i.prepare(`
        UPDATE sync_log
        SET
          status = 'failed',
          errors = 1,
          error_details = ?,
          completed_at = datetime('now')
        WHERE id = ?
      `).bind(JSON.stringify({message:m.message}),p).run(),m}}catch(i){return console.error("Error importing events:",i),e.json({success:!1,error:i.message||"Error al importar eventos de Google Calendar"},500)}});F.get("/events",async e=>{try{const t=e.env.DB,r="demo-user",a=e.req.query("startDate"),s=e.req.query("endDate");let o=`
      SELECT
        id, google_event_id, titulo, descripcion,
        fecha_inicio, fecha_fin, all_day, location,
        color_id, recurring, synced_at
      FROM google_events
      WHERE user_id = ? AND deleted = 0
    `;const n=[r];a&&(o+=" AND fecha_inicio >= ?",n.push(a)),s&&(o+=" AND fecha_inicio <= ?",n.push(s)),o+=" ORDER BY fecha_inicio ASC";const{results:i}=await t.prepare(o).bind(...n).all();return e.json({success:!0,data:i})}catch(t){return console.error("Error fetching Google events:",t),e.json({success:!1,error:t.message||"Error al obtener eventos de Google Calendar"},500)}});async function $t(e,t){var a;const r=await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(t)});if(!r.ok){const s=await r.json();throw new Error(((a=s.error)==null?void 0:a.message)||"Error creating event in Google Calendar")}return r.json()}async function Wt(e,t,r){var s;const a=await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${t}`,{method:"PUT",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(r)});if(!a.ok){const o=await a.json();throw new Error(((s=o.error)==null?void 0:s.message)||"Error updating event in Google Calendar")}return a.json()}F.post("/export-rutina",async e=>{try{const t=e.env.DB,r="demo-user",{date:a,routineType:s}=await e.req.json(),o=await t.prepare(`
      SELECT auto_export, export_rutinas
      FROM user_integrations
      WHERE user_id = ?
    `).bind(r).first();if(!(o!=null&&o.auto_export)||!(o!=null&&o.export_rutinas))return e.json({success:!1,error:"Exportación de rutinas no habilitada"},400);const n=await Et(e,r),c={morning:{title:"🌅 Rutina Matutina - Yo Decreto",startTime:"06:00",duration:10,description:`10 minutos de rutina matutina:
- Gratitud (3 cosas)
- Intención del día
- Visualización multisensorial (5 min)`},evening:{title:"🌙 Rutina Vespertina - Yo Decreto",startTime:"21:00",duration:10,description:`10 minutos de rutina vespertina:
- Revisión del día
- Registro de señales
- Gratitud final`}}[s],d=`${a}T${c.startTime}:00`,l=new Date(new Date(d).getTime()+c.duration*6e4).toISOString(),u=await t.prepare(`
      SELECT google_event_id
      FROM event_sync_mapping
      WHERE user_id = ? AND local_event_type = 'routine' AND local_event_id = ?
    `).bind(r,`${a}_${s}`).first();let p;return u?p=await Wt(n,u.google_event_id,{summary:c.title,description:c.description,start:{dateTime:d,timeZone:"America/Mexico_City"},end:{dateTime:l,timeZone:"America/Mexico_City"},colorId:"9"}):(p=await $t(n,{summary:c.title,description:c.description,start:{dateTime:d,timeZone:"America/Mexico_City"},end:{dateTime:l,timeZone:"America/Mexico_City"},colorId:"9",reminders:{useDefault:!1,overrides:[{method:"popup",minutes:10}]}}),await t.prepare(`
        INSERT INTO event_sync_mapping (user_id, local_event_type, local_event_id, google_event_id, sync_direction)
        VALUES (?, 'routine', ?, ?, 'export')
      `).bind(r,`${a}_${s}`,p.id).run()),e.json({success:!0,data:{googleEventId:p.id}})}catch(t){return console.error("Error exporting rutina:",t),e.json({success:!1,error:t.message||"Error al exportar rutina a Google Calendar"},500)}});F.post("/export-decreto-primario",async e=>{try{const t=e.env.DB,r="demo-user",{date:a,decretoId:s,categoria:o,titulo:n,startTime:i}=await e.req.json(),c=await t.prepare(`
      SELECT auto_export, export_decretos_primarios
      FROM user_integrations
      WHERE user_id = ?
    `).bind(r).first();if(!(c!=null&&c.auto_export)||!(c!=null&&c.export_decretos_primarios))return e.json({success:!1,error:"Exportación de decretos primarios no habilitada"},400);const d=await Et(e,r),l={material:"🏆",humano:"❤️",empresarial:"💼"},u={material:"5",humano:"11",empresarial:"1"},p=`${l[o]} Trabajar: ${n}`,m=`${a}T${i||"09:00"}:00`,_=new Date(new Date(m).getTime()+40*6e4).toISOString(),E=await t.prepare(`
      SELECT google_event_id
      FROM event_sync_mapping
      WHERE user_id = ? AND local_event_type = 'daily_rotation' AND local_event_id = ?
    `).bind(r,`${a}_${s}`).first();let h;return E?h=await Wt(d,E.google_event_id,{summary:p,description:`Decreto Primario del día (${o})

Dedica 30-40 minutos a trabajar en este decreto.

🎯 Aplicación: Yo Decreto`,start:{dateTime:m,timeZone:"America/Mexico_City"},end:{dateTime:_,timeZone:"America/Mexico_City"},colorId:u[o]}):(h=await $t(d,{summary:p,description:`Decreto Primario del día (${o})

Dedica 30-40 minutos a trabajar en este decreto.

🎯 Aplicación: Yo Decreto`,start:{dateTime:m,timeZone:"America/Mexico_City"},end:{dateTime:_,timeZone:"America/Mexico_City"},colorId:u[o],reminders:{useDefault:!1,overrides:[{method:"popup",minutes:10}]}}),await t.prepare(`
        INSERT INTO event_sync_mapping (user_id, local_event_type, local_event_id, google_event_id, sync_direction)
        VALUES (?, 'daily_rotation', ?, ?, 'export')
      `).bind(r,`${a}_${s}`,h.id).run()),e.json({success:!0,data:{googleEventId:h.id}})}catch(t){return console.error("Error exporting decreto primario:",t),e.json({success:!1,error:t.message||"Error al exportar decreto a Google Calendar"},500)}});F.post("/export-agenda-evento",async e=>{try{const t=e.env.DB,r="demo-user",{eventoId:a}=await e.req.json(),s=await t.prepare(`
      SELECT auto_export, export_agenda_eventos
      FROM user_integrations
      WHERE user_id = ?
    `).bind(r).first();if(!(s!=null&&s.auto_export)||!(s!=null&&s.export_agenda_eventos))return e.json({success:!1,error:"Exportación de eventos de agenda no habilitada"},400);const o=await t.prepare(`
      SELECT id, titulo, descripcion, fecha_evento, hora_evento
      FROM agenda_eventos
      WHERE id = ?
    `).bind(a).first();if(!o)return e.json({success:!1,error:"Evento no encontrado"},404);const n=await Et(e,r),i=o.hora_evento?`${o.fecha_evento}T${o.hora_evento}:00`:o.fecha_evento,c=o.hora_evento?new Date(new Date(i).getTime()+60*6e4).toISOString():o.fecha_evento,d=await t.prepare(`
      SELECT google_event_id
      FROM event_sync_mapping
      WHERE user_id = ? AND local_event_type = 'agenda_evento' AND local_event_id = ?
    `).bind(r,a).first();let l;const u={summary:`📋 ${o.titulo}`,description:o.descripcion?`${o.descripcion}

🎯 Desde: Yo Decreto`:"🎯 Desde: Yo Decreto",colorId:"7"};return o.hora_evento?(u.start={dateTime:i,timeZone:"America/Mexico_City"},u.end={dateTime:c,timeZone:"America/Mexico_City"}):(u.start={date:o.fecha_evento},u.end={date:o.fecha_evento}),d?l=await Wt(n,d.google_event_id,u):(l=await $t(n,u),await t.prepare(`
        INSERT INTO event_sync_mapping (user_id, local_event_type, local_event_id, google_event_id, sync_direction)
        VALUES (?, 'agenda_evento', ?, ?, 'export')
      `).bind(r,a,l.id).run()),e.json({success:!0,data:{googleEventId:l.id}})}catch(t){return console.error("Error exporting agenda evento:",t),e.json({success:!1,error:t.message||"Error al exportar evento a Google Calendar"},500)}});F.post("/sync-all",async e=>{try{const t=e.env.DB,r="demo-user",a=new Date().toISOString().split("T")[0],s=await t.prepare(`
      SELECT auto_export, export_rutinas, export_decretos_primarios, export_agenda_eventos
      FROM user_integrations
      WHERE user_id = ?
    `).bind(r).first();if(!(s!=null&&s.auto_export))return e.json({success:!1,error:"Exportación automática no habilitada"},400);const o={rutinas:0,decretosPrimarios:0,agendaEventos:0,errors:[]};if(s.export_rutinas)try{await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-rutina`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:a,routineType:"morning"})}),o.rutinas++,await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-rutina`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:a,routineType:"evening"})}),o.rutinas++}catch(n){o.errors.push(`Rutinas: ${n.message}`)}if(s.export_decretos_primarios)try{const n=await t.prepare(`
          SELECT decreto_material_id, decreto_humano_id, decreto_empresarial_id
          FROM daily_rotation
          WHERE user_id = ? AND date = ?
        `).bind(r,a).first();if(n){const i=await t.prepare("SELECT id, titulo FROM decretos WHERE id = ?").bind(n.decreto_material_id).first();i&&(await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-decreto-primario`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:a,decretoId:i.id,categoria:"material",titulo:i.titulo,startTime:"10:00"})}),o.decretosPrimarios++);const c=await t.prepare("SELECT id, titulo FROM decretos WHERE id = ?").bind(n.decreto_humano_id).first();c&&(await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-decreto-primario`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:a,decretoId:c.id,categoria:"humano",titulo:c.titulo,startTime:"14:00"})}),o.decretosPrimarios++);const d=await t.prepare("SELECT id, titulo FROM decretos WHERE id = ?").bind(n.decreto_empresarial_id).first();d&&(await fetch(`${new URL(e.req.url).origin}/api/google-calendar/export-decreto-primario`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:a,decretoId:d.id,categoria:"empresarial",titulo:d.titulo,startTime:"17:00"})}),o.decretosPrimarios++)}}catch(n){o.errors.push(`Decretos primarios: ${n.message}`)}return e.json({success:!0,data:o})}catch(t){return console.error("Error syncing all:",t),e.json({success:!1,error:t.message||"Error al sincronizar todos los eventos"},500)}});const ht=new q;ht.post("/chat",async e=>{var t,r,a,s,o,n;try{const{message:i,includePortfolioContext:c,history:d}=await e.req.json();if(!i)return e.json({success:!1,error:"Mensaje requerido"},400);const l=(t=e.env)==null?void 0:t.GEMINI_API_KEY;if(!l)return e.json({success:!1,error:"Gemini API no configurado"},500);let u="";if(c)try{const g="demo-user",v=await e.env.DB.prepare(`
          SELECT titulo, area, sueno_meta, descripcion
          FROM decretos
          LIMIT 10
        `).bind().all(),O=new Date().toISOString().split("T")[0],S=await e.env.DB.prepare(`
          SELECT titulo, descripcion, prioridad
          FROM agenda_eventos
          WHERE user_id = ? AND fecha = ?
          LIMIT 10
        `).bind(g,O).all(),b=await e.env.DB.prepare(`
          SELECT nombre, completada_hoy
          FROM rutinas_diarias
          WHERE user_id = ?
        `).bind(g).all();u=`
CONTEXTO DEL USUARIO:

Decretos activos:
${v.results.map(C=>`- ${C.titulo} (${C.area}): ${C.sueno_meta} - Estado: ${C.estado}`).join(`
`)}

Agenda de hoy:
${S.results.map(C=>`- ${C.titulo}: ${C.descripcion||"Sin descripción"}`).join(`
`)}

Rutinas diarias:
${b.results.map(C=>`- ${C.nombre}: ${C.completada_hoy?"Completada ✓":"Pendiente"}`).join(`
`)}
`}catch(g){console.error("Error obteniendo contexto:",g)}const p=`Eres un asistente de la aplicación "Yo Decreto", una herramienta de manifestación y productividad basada en las enseñanzas de Helene Hadsell.

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
`,m=[{role:"user",parts:[{text:p}]},{role:"model",parts:[{text:"¡Entendido! Estoy aquí para ayudarte con Yo Decreto. ¿En qué puedo apoyarte hoy?"}]}];d&&Array.isArray(d)&&d.forEach(g=>{g.role==="user"?m.push({role:"user",parts:[{text:g.content}]}):g.role==="assistant"&&m.push({role:"model",parts:[{text:g.content}]})}),m.push({role:"user",parts:[{text:i}]});const _=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${l}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:m.slice(1),generationConfig:{temperature:.9,topK:40,topP:.95,maxOutputTokens:500},systemInstruction:{parts:[{text:p}]}})}),E=await _.json();if(!_.ok)return console.error("Gemini API error:",E),e.json({success:!1,error:"Error al procesar tu mensaje. Por favor intenta de nuevo."},500);const h=((n=(o=(s=(a=(r=E.candidates)==null?void 0:r[0])==null?void 0:a.content)==null?void 0:s.parts)==null?void 0:o[0])==null?void 0:n.text)||"No pude generar una respuesta.";return e.json({success:!0,response:h})}catch(i){return console.error("Error en /api/ai/chat:",i),e.json({success:!1,error:"Error al procesar tu mensaje. Por favor intenta de nuevo."},500)}});ht.post("/action",async e=>{try{const t=await e.req.json(),r="demo-user";if(!t.action)return e.json({success:!1,error:"Acción no especificada"},400);switch(t.action){case"create_decreto":return await e.env.DB.prepare(`
          INSERT INTO decretos_primarios (user_id, titulo, area, sueno_meta, descripcion)
          VALUES (?, ?, ?, ?, ?)
        `).bind(r,t.data.titulo,t.data.area||"General",t.data.sueno_meta||"",t.data.descripcion||"").run(),e.json({success:!0,message:"✅ Decreto creado exitosamente"});case"create_evento":return await e.env.DB.prepare(`
          INSERT INTO agenda_eventos (user_id, titulo, descripcion, fecha, hora_inicio)
          VALUES (?, ?, ?, ?, ?)
        `).bind(r,t.data.titulo,t.data.descripcion||"",t.data.fecha||new Date().toISOString().split("T")[0],t.data.hora||"09:00").run(),e.json({success:!0,message:"✅ Evento agregado a tu agenda"});case"create_rutina":return await e.env.DB.prepare(`
          INSERT INTO rutinas_diarias (user_id, nombre, descripcion, momento, tiempo_estimado)
          VALUES (?, ?, ?, ?, ?)
        `).bind(r,t.data.nombre,t.data.descripcion||"",t.data.momento||"manana",t.data.tiempo||5).run(),e.json({success:!0,message:"✅ Rutina agregada exitosamente"});default:return e.json({success:!1,error:"Acción no reconocida"},400)}}catch(t){return console.error("Error en /api/ai/action:",t),e.json({success:!1,error:"Error al ejecutar la acción"},500)}});ht.post("/generate-visualization",async e=>{var t,r,a,s,o,n;try{const{decretoId:i,titulo:c,sueno_meta:d,descripcion:l,area:u}=await e.req.json();if(!i||!c)return e.json({success:!1,error:"Datos incompletos"},400);const p=(t=e.env)==null?void 0:t.GEMINI_API_KEY;if(!p)return e.json({success:!1,error:"Servicio de generación de imágenes no configurado"},500);console.log("🎨 Paso 1: Generando prompt optimizado con Gemini...");const m=`Eres un experto en generar prompts para modelos de generación de imágenes como Stable Diffusion.

Tu tarea: Crear un prompt en INGLÉS de máximo 200 palabras para generar una imagen motivacional que represente visualmente este objetivo:

Título: ${c}
Área: ${u}
Sueño/Meta: ${d||""}
Descripción: ${l||""}

El prompt debe:
- Ser muy descriptivo y visual
- Incluir detalles de iluminación, colores, atmósfera
- Ser inspirador y motivacional
- Estar en inglés
- Máximo 200 palabras
- Enfocarse en el resultado final conseguido, no en el proceso

Responde SOLO con el prompt, sin explicaciones adicionales.`,_=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${p}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:m}]}],generationConfig:{temperature:.9,maxOutputTokens:300}})}),E=await _.json();if(!_.ok)return console.error("Gemini API error:",E),e.json({success:!1,error:"Error al generar prompt de imagen"},500);const h=((n=(o=(s=(a=(r=E.candidates)==null?void 0:r[0])==null?void 0:a.content)==null?void 0:s.parts)==null?void 0:o[0])==null?void 0:n.text)||"";if(console.log("✅ Prompt optimizado generado:",h.substring(0,100)+"..."),console.log("🎨 Paso 2: Generando imagen con Cloudflare AI..."),!e.env.AI)return console.error("❌ Workers AI no está configurado"),e.json({success:!1,error:"Workers AI no está habilitado. Por favor configura el binding de AI en Cloudflare Pages Dashboard."},500);const g=await e.env.AI.run("@cf/stabilityai/stable-diffusion-xl-base-1.0",{prompt:h});if(!g||!g.image)return console.error("❌ Cloudflare AI no devolvió imagen válida:",g),e.json({success:!1,error:"Error al generar imagen con Cloudflare AI"},500);console.log("💾 Paso 3: Guardando imagen en R2...");const v=Date.now(),O=Math.random().toString(36).substring(2,8),S=`visualization-${i}-${v}-${O}.png`;await e.env.R2.put(S,g.image,{httpMetadata:{contentType:"image/png"}});const b=`/api/logos/${S}`;return await e.env.DB.prepare(`
      UPDATE decretos
      SET imagen_visualizacion = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(b,i).run(),console.log("✅ Imagen generada y guardada exitosamente"),e.json({success:!0,imageUrl:b,message:"¡Imagen generada exitosamente!"})}catch(i){return console.error("Error en /api/ai/generate-visualization:",i),e.json({success:!1,error:"Error al generar la visualización",details:i instanceof Error?i.message:String(i),stack:i instanceof Error?i.stack:void 0},500)}});const Gt=new q;Gt.get("/:filename",async e=>{var t,r;try{const a=e.req.param("filename");if(!((t=e.env)!=null&&t.R2))return console.error("R2 binding not found"),e.json({error:"R2 storage not configured"},500);const s=await e.env.R2.get(a);if(!s)return e.json({error:"Image not found"},404);const o=(r=a.split(".").pop())==null?void 0:r.toLowerCase(),i={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",svg:"image/svg+xml",webp:"image/webp"}[o||""]||"application/octet-stream";return new Response(s.body,{headers:{"Content-Type":i,"Cache-Control":"public, max-age=31536000, immutable",ETag:s.httpEtag||""}})}catch(a){return console.error("Error serving image from R2:",a),e.json({error:"Failed to load image"},500)}});Gt.post("/upload",async e=>{var t;try{if(!((t=e.env)!=null&&t.R2))return e.json({error:"R2 storage not configured"},500);const a=(await e.req.formData()).get("file");if(!a)return e.json({error:"No file provided"},400);if(!["image/png","image/jpeg","image/jpg","image/gif","image/svg+xml","image/webp"].includes(a.type))return e.json({error:"Invalid file type. Only images are allowed."},400);if(a.size>5*1024*1024)return e.json({error:"File too large. Maximum size is 5MB."},400);const o=a.name.split(".").pop(),n=Date.now(),i=Math.random().toString(36).substring(2,8),c=`logo-${n}-${i}.${o}`,d=await a.arrayBuffer();await e.env.R2.put(c,d,{httpMetadata:{contentType:a.type}});const l=`/api/logos/${c}`;return e.json({success:!0,url:l,filename:c})}catch(r){return console.error("Error uploading to R2:",r),e.json({error:"Failed to upload image"},500)}});const Te=new q;Te.post("/sesiones",async e=>{try{const{decreto_id:t,momento:r}=await e.req.json();if(!r||!["manana","noche"].includes(r))return e.json({success:!1,error:'Momento inválido (debe ser "manana" o "noche")'},400);const a=new Date().toISOString().split("T")[0],s=new Date().toISOString(),n=(await e.env.DB.prepare(`
      INSERT INTO ritual_spec_sesiones
      (decreto_id, momento, fecha, hora_inicio, completada, duracion_segundos)
      VALUES (?, ?, ?, ?, 0, 0)
    `).bind(t||null,r,a,s).run()).meta.last_row_id;return e.json({success:!0,session_id:n,fecha:a,hora_inicio:s})}catch(t){return console.error("Error al crear sesión de ritual:",t),e.json({success:!1,error:"Error al crear sesión de ritual"},500)}});Te.get("/sesiones",async e=>{try{const t=e.req.query("fecha")||new Date().toISOString().split("T")[0],r=await e.env.DB.prepare(`
      SELECT
        rss.*,
        d.titulo as decreto_titulo,
        d.area as decreto_area
      FROM ritual_spec_sesiones rss
      LEFT JOIN decretos d ON rss.decreto_id = d.id
      WHERE rss.fecha = ?
      ORDER BY rss.hora_inicio DESC
    `).bind(t).all();return e.json({success:!0,data:r.results})}catch(t){return console.error("Error al obtener sesiones:",t),e.json({success:!1,error:"Error al obtener sesiones"},500)}});Te.get("/sesiones/:id",async e=>{try{const t=e.req.param("id"),r=await e.env.DB.prepare(`
      SELECT
        rss.*,
        d.titulo as decreto_titulo,
        d.area as decreto_area
      FROM ritual_spec_sesiones rss
      LEFT JOIN decretos d ON rss.decreto_id = d.id
      WHERE rss.id = ?
    `).bind(t).first();return r?e.json({success:!0,data:r}):e.json({success:!1,error:"Sesión no encontrada"},404)}catch(t){return console.error("Error al obtener sesión:",t),e.json({success:!1,error:"Error al obtener sesión"},500)}});Te.put("/sesiones/:id",async e=>{try{const t=e.req.param("id"),{completada:r,duracion_segundos:a,etapa_actual:s,notas:o}=await e.req.json(),n=r?new Date().toISOString():null;return await e.env.DB.prepare(`
      UPDATE ritual_spec_sesiones
      SET
        completada = COALESCE(?, completada),
        duracion_segundos = COALESCE(?, duracion_segundos),
        etapa_actual = COALESCE(?, etapa_actual),
        notas = COALESCE(?, notas),
        hora_fin = COALESCE(?, hora_fin),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(r!==void 0?r?1:0:null,a||null,s||null,o||null,n,t).run(),e.json({success:!0})}catch(t){return console.error("Error al actualizar sesión:",t),e.json({success:!1,error:"Error al actualizar sesión"},500)}});Te.delete("/sesiones/:id",async e=>{try{const t=e.req.param("id");return await e.env.DB.prepare("DELETE FROM ritual_spec_sesiones WHERE id = ?").bind(t).run(),e.json({success:!0})}catch(t){return console.error("Error al eliminar sesión:",t),e.json({success:!1,error:"Error al eliminar sesión"},500)}});Te.get("/estadisticas",async e=>{var t,r;try{const a=await e.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM ritual_spec_sesiones
      WHERE completada = 1
    `).first(),s=await e.env.DB.prepare(`
      SELECT
        momento,
        COUNT(*) as cantidad
      FROM ritual_spec_sesiones
      WHERE completada = 1
      GROUP BY momento
    `).all(),o=((t=s.results.find(d=>d.momento==="manana"))==null?void 0:t.cantidad)||0,n=((r=s.results.find(d=>d.momento==="noche"))==null?void 0:r.cantidad)||0,i=await e.env.DB.prepare(`
      WITH RECURSIVE fecha_serie AS (
        SELECT date('now') as fecha
        UNION ALL
        SELECT date(fecha, '-1 day')
        FROM fecha_serie
        WHERE fecha >= date('now', '-30 days')
      ),
      dias_con_ritual AS (
        SELECT DISTINCT fecha
        FROM ritual_spec_sesiones
        WHERE completada = 1 AND fecha >= date('now', '-30 days')
      )
      SELECT COUNT(*) as racha
      FROM fecha_serie fs
      WHERE fs.fecha IN (SELECT fecha FROM dias_con_ritual)
      AND NOT EXISTS (
        SELECT 1 FROM fecha_serie fs2
        WHERE fs2.fecha > fs.fecha
        AND fs2.fecha NOT IN (SELECT fecha FROM dias_con_ritual)
      )
    `).first(),c=await e.env.DB.prepare(`
      SELECT AVG(duracion_segundos) as promedio
      FROM ritual_spec_sesiones
      WHERE completada = 1 AND duracion_segundos > 0
    `).first();return e.json({success:!0,data:{sesiones_completadas:(a==null?void 0:a.total)||0,sesiones_manana:o,sesiones_noche:n,racha_dias:(i==null?void 0:i.racha)||0,duracion_promedio_segundos:(c==null?void 0:c.promedio)||0,duracion_promedio_minutos:Math.round(((c==null?void 0:c.promedio)||0)/60)}})}catch(a){return console.error("Error al obtener estadísticas del ritual:",a),e.json({success:!1,error:"Error al obtener estadísticas"},500)}});const P=new q;P.use(Ps);P.use("/api/*",Qa());P.use("/static/*",ds());P.route("/api/auth",ve);P.route("/api/logos",Gt);P.route("/api/decretos",x);P.route("/api/agenda",M);P.route("/api/progreso",de);P.route("/api/practica",j);P.route("/api/chatbot",mt);P.route("/api/rutina",le);P.route("/api/ritual",Te);P.route("/api/google-calendar",F);P.route("/api/ai",ht);P.get("/",e=>e.render(R("div",{children:R("div",{id:"app",children:R("div",{className:"loading-screen",children:[R("img",{src:"/static/logo-yo-decreto.png",alt:"Yo Decreto",className:"logo-yo-decreto logo-lg w-auto mx-auto mb-4"}),R("div",{className:"loader"}),R("h2",{children:"Cargando..."})]})})})));P.get("*",e=>e.render(R("div",{children:R("div",{id:"app",children:R("div",{className:"loading-screen",children:[R("img",{src:"/static/logo-yo-decreto.png",alt:"Yo Decreto",className:"logo-yo-decreto logo-lg w-auto mx-auto mb-4"}),R("div",{className:"loader"}),R("h2",{children:"Cargando..."})]})})})));const pr=new q,Vs=Object.assign({"/src/index.tsx":P});let oa=!1;for(const[,e]of Object.entries(Vs))e&&(pr.route("/",e),pr.notFound(e.notFoundHandler),oa=!0);if(!oa)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{pr as default};
