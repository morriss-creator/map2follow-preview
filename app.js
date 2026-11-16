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
{id:"village",c:"place",ic:"🏘️",x:45.8,y:36,en:["Storybook village","Small houses, tunnels and play areas."],es:["Aldea de cuentos","Casitas, túneles y zonas de juego."]},
{id:"view",c:"place",ic:"🔭",x:30,y:61,en:["Lake view","Lookout point with a view over the lake."],es:["Mirador del lago","Mirador con vista sobre el lago."]},
{id:"shop",c:"place",ic:"🛍️",x:40,y:41,en:["Gift shop","Souvenirs and gifts in the village."],es:["Tienda de regalos","Recuerdos y regalos en la aldea."]},
{id:"crepes",c:"food",ic:"🥞",x:37,y:52,en:["Crêpe stand","Sweet and savory crêpes."],es:["Puesto de crepas","Crepas dulces y saladas."]},
{id:"buffet",c:"food",ic:"🍴",x:56,y:52,en:["Station café","Hot meals at the station."],es:["Café de la estación","Comidas calientes en la estación."]},
{id:"snack",c:"food",ic:"🍟",x:78,y:53,en:["Snack bar","Fries, drinks and ice cream."],es:["Snack bar","Papas fritas, bebidas y helados."]},
{id:"fireworks",c:"place",ic:"🎆",x:66,y:80,ev:1,en:["Fireworks viewpoint","Event layer: best view of the evening fireworks over the lake."],es:["Mirador de fuegos artificiales","Capa de evento: la mejor vista de los fuegos artificiales sobre el lago."]},
{id:"stage",c:"place",ic:"🎪",x:51,y:45,ev:1,en:["Event stage","Event layer: shows and music during the event."],es:["Escenario del evento","Capa de evento: espectáculos y música durante el evento."]}];
// numbered signposts in the park; each has its own QR code that opens the map with a you-are-here marker
const SIGNS=[{id:"s1",n:1,x:49.5,y:70.5,en:"Entrance plaza",es:"Plaza de la entrada"},{id:"s2",n:2,x:60,y:54,en:"Station square",es:"Plaza de la estación"},{id:"s3",n:3,x:48,y:48.64,en:"Village gate",es:"Puerta de la aldea"},{id:"s4",n:4,x:76,y:61,en:"East promenade",es:"Paseo este"}];
// walkway graph traced along the illustrated paths of the map (vertices in percent of the map image)
const GV=[47.5,84,50.33,83.38,51.5,82,54.22,81.45,54.85,80.8,55,80,55.33,80.06,58.11,79.41,59.44,78.57,61.56,78.59,63.67,79.37,64.5,80,52.01,78.57,53.5,76,52.6,74.11,52.72,73.66,53.5,72.5,52.89,72.22,51.67,70.93,50.11,70.82,49.5,70.5,49.1,66.96,48.56,66.07,47.5,65,47.93,64.84,48.2,63.99,47.43,61.61,46.89,60.81,45.74,60.55,45.54,60.19,45.6,59.8,45.56,57.59,45.78,56.1,45.78,52.53,45.6,52,46.78,51.67,48.44,50.64,48.89,50.69,49.1,51.1,49.13,50.6,49.37,50.25,50.33,50.2,52.11,51.03,52.35,51.49,52.25,52.12,52.64,51.97,52.89,52.12,53.52,54.46,52.85,56.1,52.79,57.14,53.12,58.02,53.9,58.5,53.57,59.23,53.67,60.42,53.53,61.01,51.7,63.5,51.89,62.5,51.77,61.61,51.22,61.04,50.69,61.14,51.02,60.57,51.02,59.97,49.8,57.74,49.98,56.8,49.46,56.78,49.19,55.95,50.22,64.53,49.78,64.57,48.78,64.14,44.44,53.11,43.48,53.31,42.44,55.14,42.06,55.38,41.8,55.2,40.11,54.76,38.11,54.76,37.5,54.6,36.11,54.61,35,55.04,34.5,55,42.56,51.75,41.89,51.19,40.6,49.4,40.11,48.71,39,47.9,38.15,46.73,38.1,45.98,38.5,45.5,37.56,46.16,37.15,45.93,36.22,44.56,35.56,44.91,34.01,44.96,33.74,45.19,33,46.8,32.67,46.73,30.33,47.22,28.89,48.59,28,48.8,48,48.64,49.44,48.35,50.56,47.02,51,45.83,50.81,45.09,50.6,45,50.86,44.35,50.96,42.86,51.5,41.5,51.35,41.98,50.78,41.91,49.56,39.73,48.11,38.19,47,37.5,53.67,58.73,53.67,59.08,54.11,59.9,54.67,60.27,55.11,60.32,55.53,59.97,55.47,59.52,56.5,61,56.85,62.8,57.12,63.31,57.56,63.54,59,63.6,60.44,63.54,61,63.79,62.25,65.18,62.29,65.62,62,66,62.19,66.44,62.67,66.77,63.67,66.85,64.78,67.39,66,67.5,68.56,67.64,69.26,68.55,70.33,68.65,71.5,69.5,73.33,69.48,74.89,68.95,75.7,68.3,79.22,68.3,80.33,67.99,83.11,68.01,84.22,67.46,85.22,67.39,86.5,66.8,54.43,58.13,54.85,57.44,55.04,55.51,55.5,54.5,56.89,53.08,57.44,52.83,58.56,52.93,59.5,54,59.89,54.25,60.37,54.15,60.54,53.72,60.59,52.23,60.81,51.74,61.22,51.5,62.52,51.32,64.5,48.8,64.22,48.69,63.04,46.28,62.4,45.4,62.46,42.81,62.3,42.5,60.35,39.88,59.9,37.95,60,36.5,59.38,36.01,59.1,35.27,59.17,34.82,60.06,33.33,60,31.5,60.26,32.44,60.78,33.33,62.56,35.17,63.56,35.93,65.33,36.47,66.89,38.28,69.33,40.2,69.63,40.28,70.15,39.95,70.44,40,70.69,40.33,70.7,40.8,71.67,40.48,72.22,40.72,74.21,42.58,75,44.3,75.67,43.88,77.22,44.18,77.78,44.54,79.33,46.36,79.8,46.4,80,46.2,80.26,46.92,82,48.93,82.61,49,83,48.5,82.37,49.7,82.51,50.74,83.33,52.53,83.94,52.99,84.3,53,84.07,53.05,83.9,53.57,83.93,55.51,85.3,57.5,85.52,58.09,86.56,58.28,87.33,59.08,87.74,59.97,87.8,61,87.51,62.95,87.81,63.64,88.3,64,88.02,63.99,87.79,64.32,87.37,66.15,64.43,49.55,65,50.45,65.89,50.58,67.11,50.07,68.4,51.7,69.78,53.01,70.5,54,71.11,54.1,71.78,54.63,72.42,55.51,72.7,56.4,72.85,55.21,73.43,54.02,73.74,52.58,74.22,52.17,74.78,52,75.17,52.18,75.2,52.5,72.65,58.33,72.3,59.2,73.33,59.28,74.56,60.14,75.5,59.3,78,59.09,80.22,59.97,80.72,59.82,81,59.5,84.22,59.42,85.07,58.48,57.7,28.4,55.89,27.43,54.7,26,54.39,25.97,53.33,25.25,51.5,22.8,49.56,21.96,48.28,21.8,48,21.6,47.44,21.74,46.33,22.97,45.33,23.43,45,23.41,44.58,23.05,44.39,22.69,44.5,22.3,43.89,22.6,42.11,22.72,41.79,23.08,41.5,24,41.22,25.89,41.26,26.79,41.61,27.9,41.4,28.3,41.72,27.98,42.33,27.84,43.65,28.29,44,29,46.43,28.92,46.77,29.48,46.6,30.5,46.58,32.14,47.3,33.5,47.33,35.42,71.56,60.37,70.33,61.03,70,61.5,72.3,64.2,72.5,67,72.32,68.3,38.83,45.48,39.38,44.94,39.63,44.2,39.6,43.3,23.33,48.96,22,49.37,21.67,49.65,21.52,51.93,20.77,53.82,20.44,54.17,19.75,54.25,19.63,54.41,19.63,58.93,20.33,60.12,21.33,61.01,23.22,61.01,24.33,61.28,25.78,60.91,26.44,60.4,27.68,58.88,28.56,58.47,28.93,58.04,29.88,54.32,29.57,53.13,29.41,51.27],GE=[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,2,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34,35,35,36,36,37,37,38,38,39,39,40,40,41,41,42,42,43,43,44,44,45,45,46,46,47,47,48,48,49,49,50,50,51,51,52,52,53,53,54,54,55,55,56,56,57,57,58,58,59,59,60,60,61,61,62,62,63,63,64,64,65,65,38,55,66,66,67,67,68,68,23,34,69,69,70,70,71,71,72,72,73,73,74,74,75,75,76,76,77,77,78,78,79,34,80,80,81,81,82,82,83,83,84,84,85,85,86,86,87,87,88,88,89,89,90,90,91,91,92,92,93,93,94,94,95,95,96,96,97,97,98,34,99,99,100,100,101,101,102,102,103,103,104,104,105,105,106,106,107,107,108,108,109,109,110,110,111,111,112,51,113,113,114,114,115,115,116,116,117,117,118,118,119,119,120,120,121,121,122,122,123,123,124,124,125,125,126,126,127,127,128,128,129,129,130,130,131,131,132,132,133,133,134,134,135,135,136,136,137,137,138,138,139,139,140,140,141,141,142,142,143,143,144,144,145,145,146,146,147,51,148,148,149,149,150,150,151,151,152,152,153,153,154,154,155,155,156,156,157,157,158,158,159,159,160,160,161,161,162,162,163,163,164,164,165,165,166,166,167,167,168,168,169,169,170,170,171,171,172,172,173,173,174,174,175,175,176,176,177,177,178,178,179,179,180,180,181,181,182,182,183,183,184,184,185,185,186,186,187,187,188,188,189,189,190,190,191,191,192,192,193,193,194,194,195,195,196,196,197,197,198,198,199,199,200,200,201,201,202,202,203,203,204,204,205,205,206,206,207,207,208,208,209,209,210,210,211,211,212,212,213,213,214,214,215,215,216,216,217,217,218,218,219,219,220,220,221,221,222,222,147,163,223,223,224,224,225,225,226,226,227,227,228,228,229,229,230,230,231,231,232,232,233,233,234,234,235,235,236,236,237,237,238,238,239,239,240,233,241,241,242,242,243,243,244,244,245,245,246,246,247,247,248,248,249,249,250,250,251,251,211,176,252,252,253,253,254,254,255,255,256,256,257,257,258,258,259,259,260,260,261,261,262,262,263,263,264,264,265,265,266,266,267,267,268,268,269,269,270,270,271,271,272,272,273,273,274,274,275,275,276,276,277,277,278,278,279,279,280,280,281,281,282,282,283,283,284,284,285,285,112,242,286,286,287,287,288,288,289,289,290,290,291,291,138,87,292,292,293,293,294,294,295,98,296,296,297,297,298,298,299,299,300,300,301,301,302,302,303,303,304,304,305,305,306,306,307,307,308,308,309,309,310,310,311,311,312,312,313,313,314,314,315,315,316,316,98];
const TOUR=["entrance","steam","snack","cable","buffet","village","rack"];
const T={en:{all:"All",search:"Search for a place",where:"Where to?",tap:"Tap a place on the map, in the list or search for it.",route:"Route from here",routeE:"Route from the entrance",here:"You are here",hereAt:"You are here: Signpost",scan:"Simulate a QR scan at a signpost:",tour:"Suggested route: highlights tour",tourT:"Highlights tour",tourD:"A suggested loop past the main rides and food stops.",routeTo:"Suggested route to",from:"from",entr:"the entrance",spr:"Spring",sum:"Summer",fall:"Fall",win:"Winter",ev:"Event layer",zin:"Zoom in",zout:"Zoom out",zres:"Reset view",close:"Close",none:"No place found.",sign:"Signpost",photo:"Photo of"},
 es:{all:"Todo",search:"Buscar un lugar",where:"¿A dónde vas?",tap:"Toca un lugar en el mapa, en la lista o búscalo.",route:"Ruta desde aquí",routeE:"Ruta desde la entrada",here:"Estás aquí",hereAt:"Estás aquí: Señal",scan:"Simula un escaneo QR en una señal:",tour:"Ruta sugerida: recorrido destacado",tourT:"Recorrido destacado",tourD:"Un circuito sugerido por las principales atracciones y paradas de comida.",routeTo:"Ruta sugerida a",from:"desde",entr:"la entrada",spr:"Primavera",sum:"Verano",fall:"Otoño",win:"Invierno",ev:"Capa de evento",zin:"Acercar",zout:"Alejar",zres:"Restablecer vista",close:"Cerrar",none:"No se encontró ningún lugar.",sign:"Señal",photo:"Foto de"}};
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
const loadSeason=k=>{const im=zl.querySelector(`img.sl[data-s="${k}"]`);if(im&&!im.getAttribute("srcset"))im.setAttribute("srcset",im.dataset.srcset)};
["spr","sum","fall","win"].forEach(k=>mkChip($("seas"),k,"",()=>{loadSeason(k);season=k;render()}));
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
const NV=GV.length/2,KY=1344/1800,AD=Array.from({length:NV},()=>[]),vx=i=>[GV[2*i],GV[2*i+1]];
for(let i=0;i<GE.length;i+=2){const a=GE[i],b=GE[i+1],w=Math.hypot(GV[2*a]-GV[2*b],(GV[2*a+1]-GV[2*b+1])*KY);AD[a].push([b,w]);AD[b].push([a,w])}
function nearest(x,y){let b=0,d=1e9;for(let i=0;i<NV;i++){const dd=Math.hypot(GV[2*i]-x,(GV[2*i+1]-y)*KY);if(dd<d){d=dd;b=i}}return b}
// shortest walk along the paths (Dijkstra)
function path(a,b){const D=new Float64Array(NV).fill(Infinity),pr=new Int32Array(NV).fill(-1),done=new Uint8Array(NV);D[a]=0;
 for(;;){let u=-1;for(let i=0;i<NV;i++)if(!done[i]&&D[i]<Infinity&&(u<0||D[i]<D[u]))u=i;if(u<0||u===b)break;done[u]=1;for(const [v,w] of AD[u])if(D[u]+w<D[v]){D[v]=D[u]+w;pr[v]=u}}
 const o=[b];while(o[0]!==a&&pr[o[0]]>=0)o.unshift(pr[o[0]]);return o.map(vx)}
const startPt=()=>{const s=SIGNS.find(x=>x.id===here);return s?[s.x,s.y]:[54,70]};
function routeTo(p){const s=startPt();return [s,...path(nearest(...s),nearest(p.x,p.y)),[p.x,p.y]]}
function smoothD(l){const q=l.filter((p,i)=>!i||Math.hypot(p[0]-l[i-1][0],p[1]-l[i-1][1])>.05);if(q.length<3)return "M"+q.map(p=>p.join(",")).join("L");
 const f=n=>n.toFixed(2);let d=`M${q[0][0]},${q[0][1]}`;for(let i=1;i<q.length-1;i++){d+=`Q${q[i][0]},${q[i][1]} ${f((q[i][0]+q[i+1][0])/2)},${f((q[i][1]+q[i+1][1])/2)}`}return d+`L${q[q.length-1][0]},${q[q.length-1][1]}`}
function fit(l){if(!l.length)return;const xs=l.map(q=>q[0]),ys=l.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 view(Math.max(1,Math.min(2.5,.8*Math.min(100/Math.max(1,x1-x0),100/Math.max(1,y1-y0)))),(x0+x1)/2,(y0+y1)/2)}
function draw(list){if(!list.length){rsvg.innerHTML="";return}const d=smoothD(list);rsvg.innerHTML=`<path d="${d}" class="rb"/><path d="${d}" class="rl"/>`}
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
 pop.hidden=showRoute;if(showRoute)return;
 pop.innerHTML=`<div class="ph" role="img" aria-label="${t("photo")} ${nm(p)}" style="background-position:${p.x}% ${p.y}%"></div><div class="pb"><b>${p.ic} ${nm(p)}</b><span>${ds(p)}</span><button type="button" class="rbtn">${hs?t("route"):t("routeE")}</button></div><button type="button" class="px" aria-label="${t("close")}">×</button>`;
 pop.querySelector(".rbtn").onclick=e=>{e.stopPropagation();showRoute=true;render();fit(routeTo(p))};
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
