// Map2follow: live example map (zoom, search, filters, pop-ups, routes, you-are-here, seasons, EN/ES), packages and contact form.
(function(){
const $=i=>document.getElementById(i);
const OLD_HASH={kontakt:"contact",paket:"packages",package:"packages",erkunden:"explore",einsatz:"uses",ablauf:"process",upgrade:"why"};
const oh=location.hash.slice(1);if(OLD_HASH[oh]){history.replaceState(null,"","#"+OLD_HASH[oh]);const t=$(OLD_HASH[oh]);t&&t.scrollIntoView()}
const calm=matchMedia("(prefers-reduced-motion:reduce)").matches;

// ---- example park (fictional places), positions in percent of the map image
const CATS={ride:{c:"#ff5a3c",en:"Rides",es:"Atracciones"},food:{c:"#f59a0c",en:"Food",es:"Comida"},service:{c:"#1f8fd6",en:"Service",es:"Servicios"},meet:{c:"#d61f7a",en:"Meeting points",es:"Puntos de encuentro"},place:{c:"#1fb26b",en:"Places",es:"Lugares"}};
const P=[
{id:"entrance",c:"service",ic:"🎟️",x:54,y:70,en:["Main entrance","Tickets, info and the start of your visit."],es:["Entrada principal","Taquilla, información y punto de partida de tu visita."]},
{id:"parking",c:"service",ic:"🅿️",x:48,y:83,en:["Parking","Parking right by the lake."],es:["Estacionamiento","Estacionamiento junto al lago."]},
{id:"firstaid",c:"service",ic:"⛑️",x:47,y:66,en:["First aid","First aid station by the entrance plaza."],es:["Primeros auxilios","Puesto de primeros auxilios junto a la plaza de entrada."]},
{id:"wc1",c:"service",ic:"🚻",x:42,y:57,en:["Restrooms center","Restrooms in the middle of the park."],es:["Baños centro","Baños en el centro del parque."]},
{id:"wc2",c:"service",ic:"🚻",x:72,y:71,en:["Restrooms lakeside","Restrooms toward the lake."],es:["Baños junto al lago","Baños hacia el lago."]},
{id:"meetA",c:"meet",ic:"📍",x:50,y:63,en:["Meeting point A","Entrance plaza. An easy spot to regroup with your family or group."],es:["Punto de encuentro A","Plaza de la entrada. Un lugar fácil para reunirse con tu familia o grupo."]},
{id:"meetB",c:"meet",ic:"📍",x:64,y:52,en:["Meeting point B","Station square, next to the steam train."],es:["Punto de encuentro B","Plaza de la estación, junto al tren de vapor."]},
{id:"rack",c:"ride",ic:"🚞",x:40,y:23,en:["Mountain railway","Rack railway through the green north of the park."],es:["Tren de montaña","Tren de cremallera por el norte verde del parque."]},
{id:"steam",c:"ride",ic:"🚂",x:61,y:58,en:["Steam train","Departs from the station in the center."],es:["Tren de vapor","Sale de la estación en el centro."]},
{id:"cable",c:"ride",ic:"🚠",x:85,y:61,en:["Cable car","Base station at the east end of the park."],es:["Teleférico","Estación base en el extremo este del parque."]},
{id:"village",c:"place",ic:"🏘️",x:44,y:35,en:["Storybook village","Small houses, tunnels and play areas."],es:["Aldea de cuentos","Casitas, túneles y zonas de juego."]},
{id:"view",c:"place",ic:"🔭",x:30,y:61,en:["Lake view","Lookout point with a view over the lake."],es:["Mirador del lago","Mirador con vista sobre el lago."]},
{id:"shop",c:"place",ic:"🛍️",x:40,y:41,en:["Gift shop","Souvenirs and gifts in the village."],es:["Tienda de regalos","Recuerdos y regalos en la aldea."]},
{id:"crepes",c:"food",ic:"🥞",x:37,y:52,en:["Crêpe stand","Sweet and savory crêpes."],es:["Puesto de crepas","Crepas dulces y saladas."]},
{id:"buffet",c:"food",ic:"🍴",x:56,y:52,en:["Station café","Hot meals at the station."],es:["Café de la estación","Comidas calientes en la estación."]},
{id:"snack",c:"food",ic:"🍟",x:78,y:53,en:["Snack bar","Fries, drinks and ice cream."],es:["Snack bar","Papas fritas, bebidas y helados."]},
{id:"fireworks",c:"place",ic:"🎆",x:66,y:80,ev:1,en:["Fireworks viewpoint","Event layer: best view of the evening fireworks over the lake."],es:["Mirador de fuegos artificiales","Capa de evento: la mejor vista de los fuegos artificiales sobre el lago."]},
{id:"stage",c:"place",ic:"🎪",x:51,y:45,ev:1,en:["Event stage","Event layer: shows and music during the event."],es:["Escenario del evento","Capa de evento: espectáculos y música durante el evento."]}];
// numbered signposts in the park; each has its own QR code that opens the map with a you-are-here marker
const SIGNS=[{id:"s1",n:1,x:52,y:67,en:"Entrance plaza",es:"Plaza de la entrada"},{id:"s2",n:2,x:60,y:54,en:"Station square",es:"Plaza de la estación"},{id:"s3",n:3,x:43,y:44,en:"Village gate",es:"Puerta de la aldea"},{id:"s4",n:4,x:76,y:61,en:"East promenade",es:"Paseo este"}];
// walkway graph for suggested routes
const N={E:[54,70],K:[48,82],A:[50,64],B:[46,57],C:[44,48],D:[42,38],F:[41,27],G:[57,60],H:[62,56],J:[70,60],L:[78,58],M:[85,62],Q:[37,55],R:[31,60],S:[40,43],T:[56,51],U:[70,70]};
const EDG=[["E","K"],["E","A"],["A","B"],["B","C"],["C","D"],["D","F"],["A","G"],["G","H"],["H","J"],["J","L"],["L","M"],["B","Q"],["Q","R"],["C","S"],["S","D"],["H","T"],["T","C"],["J","U"],["E","U"]];
const TOUR=["entrance","steam","snack","cable","buffet","village","rack"];
const T={en:{all:"All",search:"Search for a place",where:"Where to?",tap:"Tap a place on the map, in the list or search for it.",route:"Route from here",routeE:"Route from the entrance",here:"You are here",hereAt:"You are here: Signpost",scan:"Simulate a QR scan at a signpost:",tour:"Suggested route: highlights tour",tourT:"Highlights tour",tourD:"A suggested loop past the main rides and food stops.",routeTo:"Suggested route to",from:"from",entr:"the entrance",sum:"Summer",fall:"Fall",win:"Winter",ev:"Event layer",zin:"Zoom in",zout:"Zoom out",zres:"Reset view",close:"Close",none:"No place found.",sign:"Signpost",photo:"Photo of"},
 es:{all:"Todo",search:"Buscar un lugar",where:"¿A dónde vas?",tap:"Toca un lugar en el mapa, en la lista o búscalo.",route:"Ruta desde aquí",routeE:"Ruta desde la entrada",here:"Estás aquí",hereAt:"Estás aquí: Señal",scan:"Simula un escaneo QR en una señal:",tour:"Ruta sugerida: recorrido destacado",tourT:"Recorrido destacado",tourD:"Un circuito sugerido por las principales atracciones y paradas de comida.",routeTo:"Ruta sugerida a",from:"desde",entr:"la entrada",sum:"Verano",fall:"Otoño",win:"Invierno",ev:"Capa de evento",zin:"Acercar",zout:"Alejar",zres:"Restablecer vista",close:"Cerrar",none:"No se encontró ningún lugar.",sign:"Señal",photo:"Foto de"}};
let lang="en",cat="all",cur=null,season="sum",ev=false,here=null,q="",tour=false;
const t=k=>T[lang][k],nm=p=>p[lang][0],ds=p=>p[lang][1];
const rw=$("rwrap"),zl=$("zl"),pinsBox=$("pins"),rsvg=$("route"),pop=$("pop");
if(!rw)return;
// pins and signposts
P.forEach(p=>{const b=document.createElement("button");b.type="button";b.className="rpin";b.dataset.id=p.id;b.style.cssText=`--c:${CATS[p.c].c};left:${p.x}%;top:${p.y}%`;b.innerHTML=`${p.ic}<span class="l"></span>`;b.onclick=e=>{e.stopPropagation();select(p.id,true)};pinsBox.appendChild(b)});
SIGNS.forEach(s=>{const d=document.createElement("span");d.className="sgn";d.dataset.id=s.id;d.style.cssText=`left:${s.x}%;top:${s.y}%`;d.textContent=s.n;d.setAttribute("aria-hidden","true");pinsBox.appendChild(d)});
const hm=document.createElement("span");hm.className="here";hm.hidden=true;hm.innerHTML='<i></i><b></b>';pinsBox.appendChild(hm);
// controls
const mkChip=(box,k,label,fn,cls="chip")=>{const b=document.createElement("button");b.type="button";b.className=cls;b.dataset.k=k;b.onclick=fn;box.appendChild(b);return b};
["all",...Object.keys(CATS)].forEach(k=>mkChip($("cats"),k,"",()=>{cat=k;tour=false;if(cur&&k!=="all"&&P.find(x=>x.id===cur).c!==k)cur=null;render()}));
["sum","fall","win"].forEach(k=>mkChip($("seas"),k,"",()=>{season=k;render()}));
mkChip($("seas"),"ev","",()=>{ev=!ev;if(!ev&&cur&&P.find(x=>x.id===cur).ev)cur=null;render()});
mkChip($("tourbox"),"tour","",()=>{tour=!tour;if(tour){cur=null;view(1,50,50)}render()});
SIGNS.forEach(s=>mkChip($("scan"),s.id,"",()=>setHere(s.id,true),"chip sm"));
document.querySelectorAll("#langs button").forEach(b=>b.onclick=()=>{lang=b.dataset.l;render()});
$("q").addEventListener("input",e=>{q=e.target.value.trim().toLowerCase();render()});
$("q").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const f=visible()[0];if(f)select(f.id,true)}});
// zoom and pan
let z=1,tx=0,ty=0;
function clamp(){const W=rw.clientWidth,H=rw.clientHeight;tx=Math.min(0,Math.max(W-W*z,tx));ty=Math.min(0,Math.max(H-H*z,ty))}
function apply(){clamp();zl.style.transform=`translate(${tx}px,${ty}px) scale(${z})`;zl.style.setProperty("--z",z);rw.classList.toggle("zoomed",z>1.01)}
function view(nz,cx,cy){const W=rw.clientWidth,H=rw.clientHeight;z=Math.max(1,Math.min(4,nz));tx=W/2-cx/100*W*z;ty=H/2-cy/100*H*z;apply();placePop()}
function zoomAt(f,px,py){const nz=Math.max(1,Math.min(4,z*f));tx=px-(px-tx)*nz/z;ty=py-(py-ty)*nz/z;z=nz;apply();placePop()}
$("zin").onclick=()=>zoomAt(1.5,rw.clientWidth/2,rw.clientHeight/2);
$("zout").onclick=()=>zoomAt(1/1.5,rw.clientWidth/2,rw.clientHeight/2);
$("zres").onclick=()=>{z=1;tx=ty=0;apply();placePop()};
rw.addEventListener("wheel",e=>{if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();const r=rw.getBoundingClientRect();zoomAt(e.deltaY<0?1.2:1/1.2,e.clientX-r.left,e.clientY-r.top)},{passive:false});
const pts=new Map();let pinch=0,moved=false;
rw.addEventListener("pointerdown",e=>{if(e.target.closest(".rpin,.pop,.zc"))return;pts.set(e.pointerId,[e.clientX,e.clientY]);moved=false;rw.setPointerCapture(e.pointerId)});
rw.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;const [px,py]=pts.get(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);
 if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);const r=rw.getBoundingClientRect();if(pinch)zoomAt(d/pinch,(a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top);pinch=d;moved=true;return}
 if(z>1){tx+=e.clientX-px;ty+=e.clientY-py;if(Math.abs(e.clientX-px)+Math.abs(e.clientY-py)>1)moved=true;apply();placePop()}});
const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=0};
rw.addEventListener("pointerup",up);rw.addEventListener("pointercancel",up);
rw.addEventListener("click",e=>{if(moved||e.target.closest(".rpin,.pop,.zc"))return;cur=null;render()});
addEventListener("resize",()=>{apply();placePop()});
// routes
function nearest(x,y){let b=null,d=1e9;for(const k in N){const dd=Math.hypot(N[k][0]-x,N[k][1]-y);if(dd<d){d=dd;b=k}}return b}
function path(a,b){const D={[a]:0},pr={},Qs=new Set(Object.keys(N));while(Qs.size){let u=null;Qs.forEach(k=>{if(D[k]!==undefined&&(u===null||D[k]<D[u]))u=k});if(u===null||u===b)break;Qs.delete(u);
 EDG.forEach(([m,n])=>{const v=m===u?n:n===u?m:null;if(v&&Qs.has(v)){const d=D[u]+Math.hypot(N[m][0]-N[n][0],N[m][1]-N[n][1]);if(D[v]===undefined||d<D[v]){D[v]=d;pr[v]=u}}})}
 const o=[b];while(o[0]!==a&&pr[o[0]])o.unshift(pr[o[0]]);return o.map(k=>N[k])}
const startPt=()=>{const s=SIGNS.find(x=>x.id===here);return s?[s.x,s.y]:[54,70]};
function routeTo(p){const s=startPt();return [s,...path(nearest(...s),nearest(p.x,p.y)),[p.x,p.y]]}
function draw(list){rsvg.innerHTML=list.length?`<polyline points="${list.map(p=>p.join(",")).join(" ")}" class="rb"/><polyline points="${list.map(p=>p.join(",")).join(" ")}" class="rl"/>`:""}
let showRoute=false;
// you are here
function setHere(id,focus){here=id;const s=SIGNS.find(x=>x.id===id);if(!s)return;hm.hidden=false;hm.style.left=s.x+"%";hm.style.top=s.y+"%";
 if(focus){view(2,s.x,s.y)}render()}
// selection and popup
function select(id,focus){cur=id;tour=false;showRoute=false;const p=P.find(x=>x.id===id);if(focus&&z>1)view(z,p.x,p.y);render()}
function placePop(){if(!cur||pop.hidden)return;const p=P.find(x=>x.id===cur);const W=rw.clientWidth,H=rw.clientHeight;let x=tx+p.x/100*W*z,y=ty+p.y/100*H*z;
 const pw=pop.offsetWidth,ph=pop.offsetHeight;let left=Math.max(8,Math.min(W-pw-8,x-pw/2)),top=y-ph-26;if(top<8)top=Math.min(H-ph-8,y+26);pop.style.left=left+"px";pop.style.top=top+"px"}
const visible=()=>P.filter(p=>(!p.ev||ev)&&(cat==="all"||p.c===cat)&&(!q||nm(p).toLowerCase().includes(q)||ds(p).toLowerCase().includes(q)));
function render(){
 document.documentElement.lang=lang==="es"?"es":"en";
 document.querySelectorAll("#langs button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.l===lang));
 document.querySelectorAll("#cats .chip").forEach(b=>{b.textContent=b.dataset.k==="all"?t("all"):CATS[b.dataset.k][lang];b.setAttribute("aria-pressed",b.dataset.k===cat)});
 document.querySelectorAll("#seas .chip").forEach(b=>{b.textContent=t(b.dataset.k);b.setAttribute("aria-pressed",b.dataset.k==="ev"?ev:b.dataset.k===season)});
 const tb=document.querySelector("#tourbox .chip");tb.textContent=t("tour");tb.setAttribute("aria-pressed",tour);
 document.querySelectorAll("#scan .chip").forEach(b=>{const s=SIGNS.find(x=>x.id===b.dataset.k);b.textContent=`${t("sign")} ${s.n}`;b.setAttribute("aria-pressed",here===s.id);b.setAttribute("aria-label",`${t("sign")} ${s.n}: ${s[lang]}`)});
 $("scanL").textContent=t("scan");$("q").placeholder=t("search");$("qL").textContent=t("search");
 $("zin").setAttribute("aria-label",t("zin"));$("zout").setAttribute("aria-label",t("zout"));$("zres").setAttribute("aria-label",t("zres"));
 rw.dataset.season=season;rw.classList.toggle("event",ev);
 const vis=new Set(visible().map(p=>p.id));
 document.querySelectorAll(".rpin").forEach(g=>{const p=P.find(x=>x.id===g.dataset.id);g.hidden=p.ev&&!ev;g.querySelector(".l").textContent=nm(p);g.setAttribute("aria-label",nm(p));g.classList.toggle("sel",g.dataset.id===cur);g.classList.toggle("dim",!vis.has(p.id)&&p.id!==cur)});
 if(here){const s=SIGNS.find(x=>x.id===here);hm.querySelector("b").textContent=t("here")}
 // list
 const L=$("list");L.replaceChildren();const v=visible();
 if(!v.length){const e=document.createElement("p");e.className="note";e.textContent=t("none");L.appendChild(e)}
 v.forEach(p=>{const b=document.createElement("button");b.type="button";b.className="item";b.setAttribute("aria-pressed",p.id===cur);b.innerHTML=`<i style="background:${CATS[p.c].c}"></i><span>${p.ic} ${nm(p)}</span>`;b.onclick=()=>select(p.id,true);L.appendChild(b)});
 // info + popup + route
 const p=P.find(x=>x.id===cur);
 const hs=here?SIGNS.find(x=>x.id===here):null;
 const hereTxt=hs?`<p class="hereinfo">📍 ${t("hereAt")} ${hs.n} · ${hs[lang]}</p>`:"";
 if(tour){const pts=[];let a=TOUR[0];TOUR.slice(1).forEach(id=>{const A=P.find(x=>x.id===a),B=P.find(x=>x.id===id);pts.push([A.x,A.y],...path(nearest(A.x,A.y),nearest(B.x,B.y)),[B.x,B.y]);a=id});draw(pts);
  $("info").innerHTML=`<b>🧭 ${t("tourT")}</b><span>${t("tourD")}</span>${hereTxt}`;pop.hidden=true;return}
 if(p&&showRoute){draw(routeTo(p))}else draw([]);
 if(!p){$("info").innerHTML=`<b>${t("where")}</b><span>${t("tap")}</span>${hereTxt}`;pop.hidden=true;return}
 $("info").innerHTML=`<b>${p.ic} ${nm(p)}</b><span>${CATS[p.c][lang]}. ${ds(p)}</span>${showRoute?`<p class="hereinfo">🧭 ${t("routeTo")} ${nm(p)} ${t("from")} ${hs?t("sign")+" "+hs.n:t("entr")}</p>`:hereTxt}`;
 pop.hidden=false;
 pop.innerHTML=`<div class="ph" role="img" aria-label="${t("photo")} ${nm(p)}" style="background-position:${p.x}% ${p.y}%"></div><div class="pb"><b>${p.ic} ${nm(p)}</b><span>${ds(p)}</span><button type="button" class="rbtn">${hs?t("route"):t("routeE")}</button></div><button type="button" class="px" aria-label="${t("close")}">×</button>`;
 pop.querySelector(".rbtn").onclick=e=>{e.stopPropagation();showRoute=true;render()};
 pop.querySelector(".px").onclick=e=>{e.stopPropagation();cur=null;render()};
 placePop()}
render();
// QR deep link: ?here=s2 (or #here=s2) opens the map with a you-are-here marker at that signpost
const hp=new URLSearchParams(location.search).get("here")||(location.hash.match(/here=(s\d)/)||[])[1];
if(hp&&SIGNS.some(s=>s.id===hp)){$("explore").scrollIntoView();setTimeout(()=>setHere(hp,true),60)}

// ---- hero parallax and scroll reveal
const hv=$("hv");
if(hv&&!calm&&matchMedia("(pointer:fine)").matches){const h=document.querySelector(".hero");let raf=0;
 h.addEventListener("pointermove",e=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=h.getBoundingClientRect();hv.style.setProperty("--mx",((e.clientX-r.left)/r.width-.5).toFixed(3));hv.style.setProperty("--my",((e.clientY-r.top)/r.height-.5).toFixed(3))})});
 h.addEventListener("pointerleave",()=>{hv.style.setProperty("--mx",0);hv.style.setProperty("--my",0)})}
const rv=document.querySelectorAll(".rv");
if(calm||!("IntersectionObserver" in window))rv.forEach(e=>e.classList.add("in"));
else{const io=new IntersectionObserver(en=>en.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{rootMargin:"0px 0px -8% 0px"});rv.forEach(e=>io.observe(e))}

// ---- packages and add-ons
let pkg=null,sketch=false;const addons=new Set();
const reqText=()=>[sketch?"Request: Free live preview":"",pkg?`Package: ${pkg.n} ($${pkg.p})`:"",addons.size?`Add-ons (price on request): ${[...addons].join(", ")}`:""].filter(Boolean).join("\n");
function syncReq(){const s=$("selPkg");const t=reqText();s.hidden=!t;s.textContent=t.replace(/\n/g," · ");
 const w=$("w");const rest=w.value.split("\n").filter(l=>!/^(Request|Package|Add-ons)/.test(l)).join("\n").trim();w.value=[t,rest].filter(Boolean).join("\n")}
document.querySelectorAll("[data-pkg],[data-sketch]").forEach(a=>a.addEventListener("click",()=>{if(a.dataset.pkg)pkg={n:a.dataset.pkg,p:a.dataset.price};if(a.dataset.sketch!==undefined)sketch=true;syncReq();setTimeout(()=>$("n").focus({preventScroll:true}),400)}));
document.querySelectorAll(".addon").forEach(b=>b.addEventListener("click",()=>{const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);on?addons.add(b.textContent):addons.delete(b.textContent);syncReq()}));
const names=()=>[pkg?pkg.n+" package":"",...addons].filter(Boolean);
// ---- contact
// To send directly without opening an email program, put a form endpoint here
// (e.g. a Formspree or Web3Forms URL) and update the privacy policy. Left empty, the request opens as an email draft.
const FORM_ENDPOINT="";
const TO="map2follow@gmail.com";
$("f").addEventListener("submit",e=>{e.preventDefault();
 const t=`${sketch?"Free live preview request":"Park map request"}\nPark: ${$("n").value||"-"}\nContact: ${$("e").value||"-"}\nPackage: ${pkg?pkg.n+" ($"+pkg.p+")":"-"}\nAdd-ons: ${[...addons].join(", ")||"-"}\nWishes: ${$("w").value||"-"}\n\nOur current map is attached.`;
 const st=$("st");
 if(FORM_ENDPOINT){
  fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({park:$("n").value,email:$("e").value,message:t})})
   .then(r=>{if(!r.ok)throw 0;st.textContent="Thank you, your request was sent. We will get back to you.";$("f").reset()}).catch(()=>{st.textContent="Sending failed. Please email us at map2follow@gmail.com."});
  return}
 try{navigator.clipboard.writeText(t).catch(()=>{})}catch(_){}
 st.textContent="Your email program opens with the request. Please attach your current map and send it. The text was also copied.";
 location.href="mailto:"+TO+"?subject="+encodeURIComponent((sketch?"Free live preview request":"Park map request")+(pkg?" ("+pkg.n+" package)":"")+": "+($("n").value||""))+"&body="+encodeURIComponent(t)});
// close the mobile menu after choosing a link
document.querySelectorAll(".mmp a").forEach(a=>a.addEventListener("click",()=>a.closest("details").open=false));
})();
