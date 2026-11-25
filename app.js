const matches = [
 {id:"m1",league:"الدوري السعودي",flag:"🇸🇦",time:"انتهت",status:"finished",home:"الهلال",away:"النصر",hs:2,as:1,stats:{pos:[58,42],shots:[14,9],target:[7,4],corners:[6,3],fouls:[11,14]}},
 {id:"m2",league:"الدوري الإسباني",flag:"🇪🇸",time:"67'",status:"live",home:"ريال مدريد",away:"برشلونة",hs:1,as:1,stats:{pos:[51,49],shots:[9,8],target:[4,3],corners:[4,5],fouls:[8,10]}},
 {id:"m3",league:"الدوري الإنجليزي",flag:"🏴",time:"20:30",status:"upcoming",home:"ليفربول",away:"مانشستر سيتي",hs:null,as:null},
 {id:"m4",league:"دوري أبطال أوروبا",flag:"⭐",time:"غداً 22:00",status:"upcoming",home:"بايرن ميونخ",away:"باريس سان جيرمان",hs:null,as:null},
 {id:"m5",league:"الدوري الإيطالي",flag:"🇮🇹",time:"انتهت",status:"finished",home:"إنتر ميلان",away:"يوفنتوس",hs:2,as:0,stats:{pos:[54,46],shots:[13,7],target:[6,2],corners:[5,2],fouls:[12,15]}},
 {id:"m6",league:"الدوري الفرنسي",flag:"🇫🇷",time:"غداً 21:45",status:"upcoming",home:"مارسيليا",away:"ليون",hs:null,as:null},
 {id:"m7",league:"الدوري الألماني",flag:"🇩🇪",time:"انتهت",status:"finished",home:"بوروسيا دورتموند",away:"لايبزيغ",hs:3,as:2,stats:{pos:[48,52],shots:[15,11],target:[8,5],corners:[7,4],fouls:[9,12]}},
 {id:"m8",league:"الدوري الأمريكي",flag:"🇺🇸",time:"السبت 03:00",status:"upcoming",home:"إنتر ميامي",away:"لوس أنجلوس",hs:null,as:null}
];
const leagues = [
 ["🇸🇦","دوري روشن السعودي","السعودية","18 فريقاً"],
 ["🏴","الدوري الإنجليزي الممتاز","إنجلترا","20 فريقاً"],
 ["🇪🇸","الدوري الإسباني","إسبانيا","20 فريقاً"],
 ["🇩🇪","الدوري الألماني","ألمانيا","18 فريقاً"],
 ["🇮🇹","الدوري الإيطالي","إيطاليا","20 فريقاً"],
 ["🇫🇷","الدوري الفرنسي","فرنسا","18 فريقاً"],
 ["⭐","دوري أبطال أوروبا","أوروبا","مرحلة الدوري"],
 ["🌎","كأس العالم","دولي","منتخبات"],
 ["🇺🇸","الدوري الأمريكي MLS","الولايات المتحدة","فرق متعددة"],
 ["🇯🇵","الدوري الياباني","اليابان","فرق متعددة"]
];
let activeTab="matches", activeFilter="all", favorites=new Set(["m1"]), selectedMatch=null, search="";
const area=document.getElementById("contentArea");
const title=document.getElementById("pageTitle");
const filters=document.getElementById("matchFilters");
const searchInput=document.getElementById("searchInput");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function filteredMatches(){
 return matches.filter(m=>{
  const tabOk=activeTab!=="favorites"||favorites.has(m.id);
  const filterOk=activeFilter==="all"||(activeFilter==="live"&&m.status==="live")||(activeFilter==="finished"&&m.status==="finished")||(activeFilter==="upcoming"&&m.status==="upcoming");
  const q=search.trim().toLowerCase(), queryOk=!q||[m.home,m.away,m.league].some(x=>x.toLowerCase().includes(q));
  return tabOk&&filterOk&&queryOk;
 });
}
function matchCard(m){
 const score=m.status==="upcoming"?m.time:`${m.hs} : ${m.as}`;
 const status=m.status==="live"?`<span class="match-status live"><i class="tiny-live"></i> مباشر ${esc(m.time)}</span>`:m.status==="finished"?'<span class="match-status">انتهت</span>':`<span class="match-status">${esc(m.time)}</span>`;
 return `<article class="match-card" data-match="${m.id}"><div class="match-top"><span>${m.flag} ${esc(m.league)}</span>${status}</div><div class="teams"><div class="team"><div class="crest">${esc(m.home[0])}</div><span class="team-name">${esc(m.home)}</span></div><div><div class="score ${m.status==="upcoming"?"upcoming":""}">${score}</div><div class="score-sub">${m.status==="upcoming"?"موعد المباراة":m.status==="live"?"الشوط الثاني":"النتيجة"}</div></div><div class="team away"><div class="crest">${esc(m.away[0])}</div><span class="team-name">${esc(m.away)}</span></div></div><div class="card-foot"><span>عرض تفاصيل المباراة والإحصائيات ←</span><button class="star" data-star="${m.id}" aria-label="إضافة للمفضلة">${favorites.has(m.id)?"★":"☆"}</button></div></article>`;
}
function renderMatches(){
 const list=filteredMatches();document.getElementById("matchCount").textContent=String(list.length).padStart(2,"0");
 if(!list.length){area.innerHTML='<div class="empty">لا توجد مباريات مطابقة حالياً.</div>';return}
 let html="", last="";
 list.forEach(m=>{if(m.league!==last){html+=`<div class="league-label">${m.flag} ${esc(m.league)}</div>`;last=m.league}html+=matchCard(m)});
 area.innerHTML=html;
}
function statRow(name,a,b){const total=Math.max(a+b,1);return `<div class="stat-row"><div class="stat-values"><b>${a}${name==="الاستحواذ"?"%":""}</b><span class="stat-name">${name}</span><b>${b}${name==="الاستحواذ"?"%":""}</b></div><div class="stat-track"><div class="stat-a" style="flex:${a||.01}"></div><div class="stat-b" style="flex:${b||.01}"></div></div></div>`}
function renderDetail(m){
 filters.hidden=true;searchInput.parentElement.hidden=true;title.textContent="تفاصيل المباراة";
 const s=m.stats;
 area.innerHTML=`<button class="detail-back" id="backBtn">→ العودة للمباريات</button><div class="detail-hero"><div class="detail-competition">${m.flag} ${esc(m.league)}</div><div class="detail-teams"><div class="detail-team"><div class="crest">${esc(m.home[0])}</div><strong>${esc(m.home)}</strong></div><div><div class="detail-score">${m.hs===null?"—":m.hs+" : "+m.as}</div><div class="detail-time">${esc(m.time)}</div></div><div class="detail-team"><div class="crest">${esc(m.away[0])}</div><strong>${esc(m.away)}</strong></div></div></div><div class="panel"><div class="panel-title">📊 إحصائيات المباراة</div>${s?statRow("الاستحواذ",...s.pos)+statRow("التسديدات",...s.shots)+statRow("على المرمى",...s.target)+statRow("الركنيات",...s.corners)+statRow("الأخطاء",...s.fouls):'<div class="empty">الإحصائيات غير متاحة قبل بداية المباراة في هذه النسخة التجريبية.</div>'}</div><p class="disclaimer">بيانات هذه النسخة توضيحية. يلزم ربط مزود بيانات رياضي مرخّص لعرض النتائج والإحصائيات الحقيقية والمباشرة.</p>`;
 document.getElementById("backBtn").onclick=()=>{selectedMatch=null;render()};
}
function renderLeagues(){
 filters.hidden=true;searchInput.parentElement.hidden=false;title.textContent="البطولات";
 const q=search.trim().toLowerCase();
 const arr=leagues.filter(l=>l.join(" ").toLowerCase().includes(q));
 area.innerHTML=arr.length?`<div class="panel"><div class="panel-title">🌍 بطولات حول العالم</div>${arr.map(l=>`<div class="league-row"><div class="league-icon">${l[0]}</div><div class="league-info"><strong>${esc(l[1])}</strong><small>${esc(l[2])} · ${esc(l[3])}</small></div><span class="arrow">‹</span></div>`).join("")}</div><p class="disclaimer">القائمة تعرض أمثلة لبطولات مشهورة، وليست تغطية كاملة لكل مسابقات العالم.</p>`:'<div class="empty">لم يتم العثور على بطولة.</div>';
}
function renderNews(){
 filters.hidden=true;searchInput.parentElement.hidden=true;title.textContent="الأخبار";
 area.innerHTML=`<article class="news-card"><span class="news-tag">عالم كرة القدم</span><h3>مرحباً بك في GOAL PRO</h3><p>هذه مساحة الأخبار في التطبيق. سيتم عرض الأخبار عند ربط خدمة أخبار رياضية موثوقة.</p></article><article class="news-card"><span class="news-tag">تحديثات التطبيق</span><h3>تابع فرقك المفضلة</h3><p>أضف المباريات إلى المفضلة بالضغط على النجمة بجانب كل مباراة.</p></article>`;
}
function render(){
 if(selectedMatch){renderDetail(selectedMatch);return}
 searchInput.parentElement.hidden=false;
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("selected",b.dataset.tab===activeTab));
 filters.hidden=!(activeTab==="matches"||activeTab==="favorites");
 document.querySelectorAll(".chip").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));
 if(activeTab==="matches"||activeTab==="favorites"){title.textContent=activeTab==="favorites"?"المفضلة":"المباريات";renderMatches()}
 else if(activeTab==="leagues")renderLeagues();else renderNews();
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-tab]");if(nav){activeTab=nav.dataset.tab;selectedMatch=null;render();return}
 const f=e.target.closest("[data-filter]");if(f){activeFilter=f.dataset.filter;render();return}
 const star=e.target.closest("[data-star]");if(star){e.stopPropagation();const id=star.dataset.star;favorites.has(id)?favorites.delete(id):favorites.add(id);render();toast(favorites.has(id)?"أضيفت إلى المفضلة":"أزيلت من المفضلة");return}
 const card=e.target.closest("[data-match]");if(card){selectedMatch=matches.find(m=>m.id===card.dataset.match);renderDetail(selectedMatch);return}
 const go=e.target.closest("[data-go]");if(go){document.querySelector('[data-tab="matches"]').click()}
});
searchInput.addEventListener("input",e=>{search=e.target.value;render()});
let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").hidden=false});
document.getElementById("installBtn").addEventListener("click",async()=>{
 if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null}
 else toast(/iphone|ipad|ipod/i.test(navigator.userAgent)?"من Safari اضغط مشاركة ثم «إضافة إلى الشاشة الرئيسية»":"يمكنك إضافة الصفحة للشاشة الرئيسية من قائمة المتصفح");
});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();