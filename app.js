// Map2follow: interactive example map, before/after slider, package builder and contact form.
(function(){
const $=i=>document.getElementById(i);
// Old German anchors still lead to the right section.
const OLD_HASH={kontakt:"contact",paket:"packages",package:"packages",erkunden:"explore",einsatz:"uses",ablauf:"process",upgrade:"why"};
const oh=location.hash.slice(1);if(OLD_HASH[oh]){history.replaceState(null,"","#"+OLD_HASH[oh]);const t=$(OLD_HASH[oh]);t&&t.scrollIntoView()}

// ---- example park (fictional places)
const CATS={ride:{n:"Rides",c:"#ff5a3c"},food:{n:"Food",c:"#f59a0c"},shop:{n:"Shop",c:"#9a5fe0"},service:{n:"Service",c:"#1f8fd6"},place:{n:"Places",c:"#1fb26b"}};
const P=[
{id:"entrance",n:"Main entrance",c:"service",ic:"🎟️",d:"Tickets, info and the start of your visit."},
{id:"meet",n:"Meeting point",c:"service",ic:"📍",d:"Agreed spot to regroup with your family or group."},
{id:"parking",n:"Parking",c:"service",ic:"🅿️",d:"Parking right by the lake."},
{id:"rack",n:"Mountain railway",c:"ride",ic:"🚞",d:"Rack railway through the green north of the park."},
{id:"village",n:"Storybook village",c:"place",ic:"🏘️",d:"Small houses, tunnels and play areas."},
{id:"steam",n:"Steam train",c:"ride",ic:"🚂",d:"Departs from the station in the center."},
{id:"view",n:"Lake view",c:"place",ic:"🔭",d:"Lookout point with a view over the lake."},
{id:"cable",n:"Cable car",c:"ride",ic:"🚠",d:"Base station at the east end of the park."},
{id:"shop",n:"Gift shop",c:"shop",ic:"🛍️",d:"Souvenirs and gifts in the village."},
{id:"crepes",n:"Crêpe stand",c:"food",ic:"🥞",d:"Sweet and savory crêpes."},
{id:"buffet",n:"Station café",c:"food",ic:"🍴",d:"Hot meals at the station."},
{id:"snack",n:"Snack bar",c:"food",ic:"🍟",d:"Fries, drinks and ice cream."},
{id:"wc1",n:"Restrooms center",c:"service",ic:"🚻",d:"Restrooms in the middle of the park."},
{id:"wc2",n:"Restrooms lakeside",c:"service",ic:"🚻",d:"Restrooms toward the lake."}];
// pin positions in percent of the image (x,y); adjust with the #pins mode
const RPOS={entrance:[54,70],meet:[49,64],parking:[48,83],rack:[40,23],village:[44,35],steam:[61,58],view:[30,61],cable:[85,61],shop:[40,41],crepes:[37,52],buffet:[56,52],snack:[78,53],wc1:[42,57],wc2:[72,71]};
let cat="all",cur=null;

P.forEach(p=>{const bt=document.createElement("button");bt.type="button";bt.className="item";bt.dataset.id=p.id;bt.setAttribute("aria-pressed","false");
 bt.innerHTML=`<i style="background:${CATS[p.c].c}"></i><span>${p.ic} ${p.n}</span>`;bt.onclick=()=>{cur=p.id;apply()};$("list").appendChild(bt)});
[["all","All"],...Object.entries(CATS).map(([k,v])=>[k,v.n])].forEach(([k,n])=>{const bt=document.createElement("button");bt.type="button";bt.className="chip";bt.textContent=n;bt.dataset.k=k;
 bt.onclick=()=>{cat=k;if(cur&&k!=="all"&&P.find(x=>x.id===cur).c!==k)cur=null;apply()};$("cats").appendChild(bt)});

const w=$("rwrap"),cal=location.hash==="#pins";
P.forEach(p=>{const pos=RPOS[p.id];if(!pos)return;const b=document.createElement("button");b.type="button";b.className="rpin";b.dataset.id=p.id;b.style.setProperty("--c",CATS[p.c].c);b.style.left=pos[0]+"%";b.style.top=pos[1]+"%";b.setAttribute("aria-label",p.n);
 b.innerHTML=`${p.ic}<span class="l">${p.n}</span>`;
 if(cal){b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);b.dataset.drag=1};
  b.onpointermove=e=>{if(!b.dataset.drag)return;const r=w.getBoundingClientRect();const x=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100));b.style.left=x+"%";b.style.top=y+"%";RPOS[p.id]=[Math.round(x),Math.round(y)];$("rcal").value=JSON.stringify(RPOS)};
  b.onpointerup=()=>{delete b.dataset.drag}}
 else b.onclick=()=>{cur=p.id;apply()};
 w.appendChild(b)});
if(cal){$("rcal").hidden=false;$("rcal").value=JSON.stringify(RPOS)}

function apply(){
 document.querySelectorAll("#cats .chip").forEach(x=>x.setAttribute("aria-pressed",x.dataset.k===cat));
 document.querySelectorAll(".item").forEach(x=>{const p=P.find(y=>y.id===x.dataset.id);x.hidden=cat!=="all"&&p.c!==cat;x.setAttribute("aria-pressed",x.dataset.id===cur)});
 document.querySelectorAll(".rpin").forEach(g=>{const q=P.find(x=>x.id===g.dataset.id);g.classList.toggle("sel",g.dataset.id===cur);g.style.opacity=(cat==="all"||q.c===cat||q.id==="entrance")?1:.25});
 const p=P.find(x=>x.id===cur);
 $("info").innerHTML=p?`<b>${p.ic} ${p.n}</b><span>${CATS[p.c].n}. ${p.d}</span>`:`<b>Where to?</b><span>Tap a place on the map or in the list.</span>`}
apply();

// ---- before/after slider
const ba=$("ba"),rg=$("baR");
const setP=v=>ba.style.setProperty("--p",v+"%");
if(ba&&rg){rg.addEventListener("input",()=>setP(rg.value));
if(!matchMedia("(prefers-reduced-motion:reduce)").matches&&"IntersectionObserver" in window){
 let done=false;new IntersectionObserver((en,ob)=>{if(done||!en[0].isIntersecting)return;done=true;ob.disconnect();
  const t0=performance.now(),D=2600;(function f(t){const k=Math.min(1,(t-t0)/D),v=50+Math.sin(k*Math.PI*2)*(1-k*.4)*30;setP(v);rg.value=v;if(k<1)requestAnimationFrame(f);else{setP(50);rg.value=50}})(t0)},{threshold:.6}).observe(ba)}}

// ---- packages and add-ons
let pkg=null;const addons=new Set();
const reqText=()=>[pkg?`Package: ${pkg.n} ($${pkg.p})`:"",addons.size?`Add-ons (price on request): ${[...addons].join(", ")}`:""].filter(Boolean).join("\n");
function syncReq(){const s=$("selPkg");const t=reqText();s.hidden=!t;s.textContent=t.replace(/\n/g," · ");
 const w=$("w");const rest=w.value.split("\n").filter(l=>!/^(Package|Add-ons)/.test(l)).join("\n").trim();w.value=[t,rest].filter(Boolean).join("\n")}
document.querySelectorAll("[data-pkg]").forEach(a=>a.addEventListener("click",()=>{pkg={n:a.dataset.pkg,p:a.dataset.price};syncReq();setTimeout(()=>$("n").focus({preventScroll:true}),400)}));
document.querySelectorAll(".addon").forEach(b=>b.addEventListener("click",()=>{const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);on?addons.add(b.textContent):addons.delete(b.textContent);syncReq()}));
const names=()=>[pkg?pkg.n+" package":"",...addons].filter(Boolean);

// ---- hero parallax and scroll reveal
const calm=matchMedia("(prefers-reduced-motion:reduce)").matches;
const hv=$("hv");
if(hv&&!calm&&matchMedia("(pointer:fine)").matches){const h=document.querySelector(".hero");let raf=0;
 h.addEventListener("pointermove",e=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=h.getBoundingClientRect();hv.style.setProperty("--mx",((e.clientX-r.left)/r.width-.5).toFixed(3));hv.style.setProperty("--my",((e.clientY-r.top)/r.height-.5).toFixed(3))})});
 h.addEventListener("pointerleave",()=>{hv.style.setProperty("--mx",0);hv.style.setProperty("--my",0)})}
const rv=document.querySelectorAll(".rv");
if(calm||!("IntersectionObserver" in window))rv.forEach(e=>e.classList.add("in"));
else{const io=new IntersectionObserver(en=>en.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{rootMargin:"0px 0px -8% 0px"});rv.forEach(e=>io.observe(e))}

// ---- contact
// To send directly without opening an email program, put a form endpoint here
// (e.g. a Formspree or Web3Forms URL) and update the privacy policy. Left empty, the request opens as an email draft.
const FORM_ENDPOINT="";
const TO="map2follow@gmail.com";
$("f").addEventListener("submit",e=>{e.preventDefault();
 const t=`Park map request\nPark: ${$("n").value||"-"}\nContact: ${$("e").value||"-"}\nPackage: ${pkg?pkg.n+" ($"+pkg.p+")":"-"}\nAdd-ons: ${[...addons].join(", ")||"-"}\nWishes: ${$("w").value||"-"}\n\nOur current map is attached.`;
 const st=$("st");
 if(FORM_ENDPOINT){
  fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({park:$("n").value,email:$("e").value,message:t})})
   .then(r=>{if(!r.ok)throw 0;st.textContent="Thank you, your request was sent. We will get back to you.";$("f").reset()}).catch(()=>{st.textContent="Sending failed. Please email us at map2follow@gmail.com."});
  return}
 try{navigator.clipboard.writeText(t).catch(()=>{})}catch(_){}
 st.textContent="Your email program opens with the request. Please attach your current map and send it. The text was also copied.";
 location.href="mailto:"+TO+"?subject="+encodeURIComponent("Park map request"+(pkg?" ("+pkg.n+" package)":"")+": "+($("n").value||""))+"&body="+encodeURIComponent(t)});
// close the mobile menu after choosing a link
document.querySelectorAll(".mmp a").forEach(a=>a.addEventListener("click",()=>a.closest("details").open=false));
})();
