'use strict';
/* ===== Portal Soal PAS · SMPN Satu Atap 1 Tasik Payawan & SDN Talingke ===== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const HASH='7a9ce3a76ef3a27dff4109c42b1adb5bde98cbc888f2816277c06cae54ce9b33'; // SHA-256 password admin
const PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
const uid=()=>Math.random().toString(36).slice(2,8);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sub=(n,id)=>({id:id||uid(),name:n,grade:'',file:'',size:0,sched:true,open:null,close:null});
const FONTS={sys:'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',round:'ui-rounded,"Nunito","Quicksand",system-ui,sans-serif',serif:'Georgia,"Times New Roman",serif'};
const PRE=[
 {n:'Biru Sekolah',t:{p:'#1c3aa9',a:'#f5c400',bg:'#f4f6fb',card:'#ffffff',tx:'#141a33',smp:'#1c3aa9',sd:'#7a3535'}},
 {n:'Cokelat Hangat',t:{p:'#7a3535',a:'#e22128',bg:'#faf5f4',card:'#ffffff',tx:'#2a1616',smp:'#1c3aa9',sd:'#7a3535'}},
 {n:'Hijau Segar',t:{p:'#0f7b5f',a:'#f2b705',bg:'#f1f8f5',card:'#ffffff',tx:'#10261f',smp:'#0f7b5f',sd:'#8a5a14'}},
 {n:'Ungu Modern',t:{p:'#5b3fd1',a:'#ff7a59',bg:'#f6f4fd',card:'#ffffff',tx:'#1d1638',smp:'#5b3fd1',sd:'#c2410c'}},
 {n:'Netral',t:{p:'#1f2937',a:'#22d3ee',bg:'#f3f4f6',card:'#ffffff',tx:'#111827',smp:'#1f2937',sd:'#475569'}}];
const DEF={
 site:{title:'PENILAIAN AKHIR SEMESTER GANJIL',sub:'TAHUN PELAJARAN 2026/2027',notice:'',how:true,footer:'© 2026 SMPN Satu Atap 1 Tasik Payawan & SDN Talingke'},
 theme:{...PRE[0].t,r:16,font:'sys'},text:{id:{},en:{}},
 areas:{
  smp:{name:'SMPN SATU ATAP 1 TASIK PAYAWAN',logo:'assets/logo-smp.png',info:'',subjects:['Pendidikan Agama','PPKn','Bahasa Indonesia','Matematika','IPA','IPS','Bahasa Inggris','PJOK','Informatika','Seni Budaya','Prakarya'].map((n,i)=>sub(n,'smp'+i))},
  sd:{name:'SDN TALINGKE',logo:'assets/logo-sd.png',info:'',subjects:['Pendidikan Agama','PPKn','Bahasa Indonesia','Matematika','IPAS','PJOK','Seni Rupa','Bahasa Inggris'].map((n,i)=>sub(n,'sd'+i))}}};
const I18={
 id:{tag:'Portal Soal PAS',home:'Beranda',smp:'Area SMP',sd:'Area SD',pick:'Pilih area sekolahmu',enter:'Masuk',mapel:'mata pelajaran',open:'Buka Soal',admOpen:'Buka (admin)',avail:'Tersedia',soon:'Belum dibuka',closed:'Ditutup',empty:'Belum tersedia',opens:'Dibuka',until:'Ditutup',in:'Dibuka dalam',all:'Semua',back:'Kembali',load:'Memuat soal…',err:'Soal gagal dimuat. Periksa sinyal, lalu coba lagi atau',tab:'buka di tab baru',closeq:'Tutup soal yang sedang dibuka?',howT:'Cara menggunakan',h1:'Pilih area sekolahmu.',h2:'Buka soal PDF saat jadwalnya tiba.',h3:'Jawab di lembar jawaban fisik.',fit:'Pas',none:'Belum ada mata pelajaran.',hint:'Cubit layar atau pakai tombol + / − untuk memperbesar soal.'},
 en:{tag:'PAS Exam Portal',home:'Home',smp:'Junior High',sd:'Elementary',pick:'Choose your school area',enter:'Enter',mapel:'subjects',open:'Open Exam',admOpen:'Open (admin)',avail:'Available',soon:'Not open yet',closed:'Closed',empty:'Not available yet',opens:'Opens',until:'Closes',in:'Opens in',all:'All',back:'Back',load:'Loading exam…',err:'The exam failed to load. Check your signal, then try again or',tab:'open in a new tab',closeq:'Close the exam you are viewing?',howT:'How to use',h1:'Choose your school area.',h2:'Open the PDF exam when its schedule starts.',h3:'Write your answers on the paper answer sheet.',fit:'Fit',none:'No subjects yet.',hint:'Pinch the screen or use the + / − buttons to zoom.'}};

const TK=[['tag','Nama portal (kiri atas)'],['home','Menu: Beranda'],['smp','Menu: Area SMP'],['sd','Menu: Area SD'],['pick','Judul pilihan area'],['enter','Tombol masuk area'],['mapel','Kata "mata pelajaran"'],['howT','Judul "Cara menggunakan"'],['h1','Langkah 1'],['h2','Langkah 2'],['h3','Langkah 3'],['hint','Petunjuk di atas daftar soal'],['open','Tombol buka soal'],['avail','Label: Tersedia'],['soon','Label: Belum dibuka'],['closed','Label: Ditutup'],['empty','Label: Belum tersedia'],['opens','Kata sebelum tanggal buka'],['in','Kata sebelum hitung mundur'],['until','Kata sebelum tanggal tutup'],['all','Filter: Semua'],['back','Tombol kembali'],['fit','Tombol zoom Pas']];
const EYE='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 EYEX='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 4.2-.9M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
const pwf=(id,ph,ac)=>`<div class="pw"><input type="password" id="${id}" placeholder="${ph}" autocomplete="${ac}" required><button type="button" class="eye" data-eye="${id}" aria-label="Tampilkan / sembunyikan password">${EYEX}</button></div>`;
let cfg=structuredClone(DEF),lang=localStorage.pas_lang||'id',off=0,view='home',grade='',ak='smp',tab='sub',tl='id',
 isAdmin=sessionStorage.pas_adm==='1',dirty=false,trash=[];
const t=k=>(cfg.text[lang]&&cfg.text[lang][k])||I18[lang][k]||k;
const pwh=()=>cfg.pw||HASH;
const now=()=>Date.now()+off;
function merge(j){const a=j.areas||{},x=j.text||{};cfg={...DEF,...j,text:{id:{...x.id},en:{...x.en}},site:{...DEF.site,...j.site},theme:{...DEF.theme,...j.theme},areas:{smp:{...DEF.areas.smp,...a.smp},sd:{...DEF.areas.sd,...a.sd}}}}

/* ---------- Tema ---------- */
const ink=h=>{const n=parseInt(h.slice(1),16);return .299*(n>>16)+.587*(n>>8&255)+.114*(n&255)>150?'#111':'#fff'};
const dk=()=>localStorage.pas_mode==='dark';
function applyTheme(){
 const T=cfg.theme,s=document.documentElement.style,H=document.documentElement;
 H.dataset.dark=dk()?1:0;
 [['p',T.p],['a',T.a],['smp',T.smp],['sd',T.sd]].forEach(([k,v])=>{s.setProperty('--'+k,v);s.setProperty('--'+k+'i',ink(v))});
 s.setProperty('--lbg',T.bg);s.setProperty('--lcard',T.card);s.setProperty('--ltx',T.tx);
 s.setProperty('--r',T.r+'px');s.setProperty('--f',FONTS[T.font]||FONTS.sys);
 $('meta[name=theme-color]').content=T.p;$('#mode').textContent=dk()?'☀️':'🌙';
}

/* ---------- Status & waktu ---------- */
function stat(s){if(!s.file)return'empty';if(s.sched){const n=now();if(s.open&&n<s.open)return'soon';if(s.close&&n>s.close)return'closed'}return'open'}
const p2=n=>String(n).padStart(2,'0');
function cd(s){let m=Math.max(0,Math.floor((s.open-now())/1000)),d=Math.floor(m/86400);m%=86400;return`${d?d+(lang==='id'?'h ':'d '):''}${p2(Math.floor(m/3600))}:${p2(Math.floor(m%3600/60))}:${p2(m%60)}`}
const fd=x=>new Date(x).toLocaleString(lang==='id'?'id-ID':'en-GB',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
function info(s,st){
 if(st==='empty')return`<span class="pill e">${t('empty')}</span>`;
 if(st==='soon')return`<span class="pill w">${t('soon')}</span><small>${t('opens')}: ${fd(s.open)}<br>${t('in')} <b class="cd">${cd(s)}</b></small>`;
 if(st==='closed')return`<span class="pill x">${t('closed')}</span>`;
 return`<span class="pill o">${t('avail')}</span>`+(s.sched&&s.close?`<small>${t('until')}: ${fd(s.close)}</small>`:'');
}

/* ---------- Tampilan siswa ---------- */
function card(s,i){
 const st=stat(s),can=s.file&&(st==='open'||isAdmin);
 return`<article class="card ${st}" data-id="${s.id}" data-st="${st}"><div class="n">${i+1}</div><div class="ci"><h3>${esc(s.name)}</h3>${s.grade?`<span class="tag">${esc(s.grade)}</span>`:''}<div class="inf">${info(s,st)}</div></div><button class="btn" ${can?'':'disabled'} data-open="${s.id}">${st==='open'||!isAdmin?t('open'):t('admOpen')}</button></article>`;
}
function render(){
 const S=cfg.site,A=cfg.areas,app=$('#app');
 document.documentElement.lang=lang;
 document.title=`${t('tag')} · ${S.title} ${S.sub}`;
 $('#bt').textContent=t('tag');$('#bs').textContent=S.sub;
 $$('[data-n]').forEach(a=>{a.classList.toggle('on',a.dataset.n===view);const sp=$('span',a),x=t(a.dataset.n);sp?sp.textContent=x:a.textContent=x});
 const lg=$$('.logos img');lg[0].src=A.smp.logo;lg[1].src=A.sd.logo;$('link[rel=icon]').href=A.smp.logo;
 const nt=$('#notice');nt.hidden=!S.notice;nt.textContent=S.notice;$('#ft').textContent=S.footer;$('#vfit').textContent=t('fit');
 if(view==='home'){
  app.innerHTML=`<section class="hero"><h1>${esc(S.title)}</h1><p>${esc(S.sub)}</p></section>
  <h2 class="sec">${t('pick')}</h2>
  <div class="areas">${['smp','sd'].map(k=>`<a class="ac" href="#${k}" style="--c:var(--${k});--ci:var(--${k}i)"><img src="${esc(A[k].logo)}" alt=""><div><h3 style="font-size:17px">${esc(A[k].name)}</h3><small>${A[k].subjects.length} ${t('mapel')}</small><span class="btn">${t('enter')} →</span></div></a>`).join('')}</div>
  ${S.how!==false?`<h2 class="sec">${t('howT')}</h2><div class="how"><div>${t('h1')}</div><div>${t('h2')}</div><div>${t('h3')}</div></div>`:''}`;
  return;
 }
 const a=A[view],gs=[...new Set(a.subjects.map(s=>s.grade).filter(Boolean))];
 if(!gs.includes(grade))grade='';
 const L=a.subjects.filter(s=>!grade||s.grade===grade);
 app.innerHTML=`<div style="--c:var(--${view});--ci:var(--${view}i)"><a class="back" href="#home">← ${t('back')}</a>
 <div class="ahd"><img src="${esc(a.logo)}" alt=""><div><h1>${esc(a.name)}</h1><small>${esc(S.title)} · ${esc(S.sub)}</small></div></div>
 ${a.info?`<p class="ainfo">${esc(a.info)}</p>`:''}
 ${gs.length?`<div class="chips">${['',...gs].map(g=>`<button class="${g===grade?'on':''}" data-gr="${esc(g)}">${g?esc(g):t('all')}</button>`).join('')}</div>`:''}
 <p class="hint">${t('hint')}</p><div class="grid">${L.map(card).join('')||`<p class="empty-m">${t('none')}</p>`}</div></div>`;
}
function route(){const h=location.hash.slice(1);view=h==='smp'||h==='sd'?h:'home';scrollTo(0,0);render()}
setInterval(()=>{
 if(view==='home')return;let ch=0;
 $$('.card').forEach(c=>{const s=cfg.areas[view].subjects.find(x=>x.id===c.dataset.id);if(!s)return;if(stat(s)!==c.dataset.st)ch=1;const d=$('.cd',c);if(d)d.textContent=cd(s)});
 if(ch)render();
},1000);

/* ---------- Penampil PDF ---------- */
let doc=null,pages=[],vz=1,rt,io,tasks=[],pd=0,pz=1;
const vs=()=>$('#vs'),setLd=h=>$('#vld').innerHTML=h;
const loadLib=()=>window.pdfjsLib?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src=PDFJS+'pdf.min.js';s.onload=()=>{pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS+'pdf.worker.min.js';ok()};s.onerror=no;document.head.appendChild(s)});
async function openPdf(s){
 vz=1;pages=[];$('#vw').hidden=false;lock();history.pushState({v:1},'');
 $('#vt').textContent=s.name+(s.grade?' · '+s.grade:'');$('#vdl').href=s.file;$('#vpg').innerHTML='';$('#vp').textContent='100%';setLd(t('load'));
 try{
  await loadLib();const task=pdfjsLib.getDocument({url:s.file});
  task.onProgress=p=>p.total&&setLd(t('load')+' '+Math.round(p.loaded/p.total*100)+'%');
  doc=await task.promise;
  for(let i=1;i<=doc.numPages;i++)pages.push(await doc.getPage(i));
  build();setLd('');
 }catch(e){setLd(`<div>${t('err')} <a href="${esc(s.file)}" target="_blank" rel="noopener">${t('tab')}</a>.</div>`)}
}
const baseW=()=>Math.min(vs().clientWidth-16,1100);
function build(){
 const box=$('#vpg');box.innerHTML=pages.map((_,i)=>`<div class="pg" data-i="${i}"><canvas></canvas></div>`).join('');
 size();io&&io.disconnect();
 io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&draw(+e.target.dataset.i)),{root:vs(),rootMargin:'900px 0px'});
 $$('.pg',box).forEach(d=>io.observe(d));
}
function size(){
 const w=baseW()*vz,k=$('#vpg').children;
 pages.forEach((p,i)=>{const v=p.getViewport({scale:1}),d=k[i];if(!d)return;d.style.width=w+'px';d.style.height=w*v.height/v.width+'px';d.dataset.r=''});
 $('#vp').textContent=Math.round(vz*100)+'%';
}
async function draw(i){
 const d=$('#vpg').children[i],p=pages[i];if(!d||!p)return;
 const w=Math.round(baseW()*vz);if(d.dataset.r==w)return;d.dataset.r=w;
 tasks[i]&&tasks[i].cancel();
 const v0=p.getViewport({scale:1}),sc=Math.min(w/v0.width*Math.min(devicePixelRatio||1,2),4096/v0.width),v=p.getViewport({scale:sc}),c=d.firstChild;
 c.width=v.width;c.height=v.height;
 const tk=p.render({canvasContext:c.getContext('2d'),viewport:v});tasks[i]=tk;
 try{await tk.promise}catch(e){d.dataset.r=''}
}
function zoom(z){
 if(!pages.length)return;z=Math.max(.5,Math.min(4,z));const s=vs(),r=s.scrollTop/(s.scrollHeight||1);
 vz=z;size();s.scrollTop=r*s.scrollHeight;clearTimeout(rt);
 rt=setTimeout(()=>$$('.pg').forEach(d=>{const b=d.getBoundingClientRect();if(b.bottom>-900&&b.top<innerHeight+900)draw(+d.dataset.i)}),140);
}
function closeV(){
 $('#vw').hidden=true;lock();io&&io.disconnect();tasks.forEach(x=>x&&x.cancel());tasks=[];pages=[];
 doc&&doc.destroy();doc=null;$('#vpg').innerHTML='';history.back();
}
const lock=()=>document.body.classList.toggle('lock',!$('#vw').hidden||!$('#ad').hidden);
const dist=e=>Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
vs().addEventListener('touchstart',e=>{if(e.touches.length===2){pd=dist(e);pz=vz}},{passive:true});
vs().addEventListener('touchmove',e=>{if(e.touches.length===2&&pd){e.preventDefault();zoom(pz*dist(e)/pd)}},{passive:false});
vs().addEventListener('touchend',()=>{pd=0});
vs().addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();zoom(vz*(e.deltaY<0?1.1:.9))}},{passive:false});
$('#vx').onclick=closeV;
addEventListener('resize',()=>{if(pages.length){clearTimeout(rt);size();rt=setTimeout(()=>zoom(vz),200)}});
addEventListener('popstate',()=>{if(!$('#vw').hidden){history.pushState({v:1},'');if(confirm(t('closeq')))closeV()}});
addEventListener('beforeunload',e=>{if(dirty||!$('#vw').hidden){e.preventDefault();e.returnValue=''}});
addEventListener('hashchange',()=>{if($('#vw').hidden)route()});
addEventListener('keydown',e=>{
 if(!$('#vw').hidden){if(e.key==='+'||e.key==='=')zoom(vz*1.2);if(e.key==='-')zoom(vz/1.2)}
 else if(e.key==='Escape'&&!$('#md').hidden)$('#md').hidden=true;
});

/* ---------- GitHub (penyimpanan) ---------- */
function ghd(){const h=location.hostname,o=h.endsWith('github.io')?h.split('.')[0]:'',s=location.pathname.split('/')[1];return{owner:o,repo:s&&!s.includes('.')?s:(o?o+'.github.io':''),branch:'main',token:''}}
const ghs=()=>({...ghd(),...JSON.parse(localStorage.pas_gh||'{}')});
const ghc=()=>{const c=ghs();return c.token&&c.owner&&c.repo?c:null};
async function gh(path,method,body){
 const c=ghc(),r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${path}${method==='GET'?'?ref='+c.branch:''}`,{method,headers:{Authorization:'Bearer '+c.token,Accept:'application/vnd.github+json'},body:body&&JSON.stringify({...body,branch:c.branch})});
 if(r.status===404&&method==='GET')return null;
 if(!r.ok)throw new Error(r.status===401?'token salah atau kedaluwarsa':r.status===403?'token tidak punya izin tulis':r.status===422?'konflik versi, coba lagi':'kode '+r.status);
 return r.json();
}
const put=async(p,content,m)=>{const x=await gh(p,'GET');return gh(p,'PUT',{message:m,content,sha:x&&x.sha})};
const del=async p=>{const x=await gh(p,'GET');if(x)await gh(p,'DELETE',{message:'Hapus berkas lama',sha:x.sha})};
const b64t=s=>{let b='';new TextEncoder().encode(s).forEach(c=>b+=String.fromCharCode(c));return btoa(b)};
let tt;function toast(m,ms=3200){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),ms)}
function mark(){dirty=true;const b=$('#sv');if(b)b.textContent='💾 Simpan •'}
async function save(q){
 if(!ghc()){tab='git';adminRender();toast('Isi token GitHub dulu agar perubahan bisa disimpan.');return false}
 if(!q)toast('Menyimpan…',60000);
 try{
  await put('data/config.json',b64t(JSON.stringify(cfg)),'Perbarui pengaturan portal');
  for(const f of trash.splice(0))await del(f).catch(()=>{});
  dirty=false;localStorage.pas_cache=JSON.stringify(cfg);toast('✅ Tersimpan. Tampil untuk siswa dalam ±1 menit.',4500);
  if(!$('#ad').hidden)adminRender();
  return true;
 }catch(x){toast('Gagal menyimpan: '+x.message,5000);return false}
}

/* ---------- Panel admin ---------- */
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
const dtv=ts=>ts?new Date(ts-new Date(ts).getTimezoneOffset()*6e4).toISOString().slice(0,16):'';
function login(){
 const m=$('#md');m.hidden=false;
 m.innerHTML=`<form class="mb" id="lf"><h3>🔐 Masuk Admin</h3>${pwf('pw','Password admin','current-password')}<div class="er" id="er"></div><div class="rw"><button type="button" class="btn g" data-act="mc">Batal</button><button class="btn" style="flex:1">Masuk</button></div></form>`;
 $('#pw').focus();
}
function closeAdmin(){if(dirty&&!confirm('Ada perubahan yang belum disimpan. Tutup panel?'))return;$('#ad').hidden=true;lock()}
const fld=(l,p,v,x='')=>`<label>${l}<input type="text" data-p="${p}" value="${esc(v)}" ${x}></label>`;
function tSub(){
 const L=cfg.areas[ak].subjects;
 return`<div class="seg">${['smp','sd'].map(x=>`<button class="${x===ak?'on':''}" data-act="area" data-v="${x}">${x==='smp'?'SMP':'SD'}</button>`).join('')}</div>`+
 L.map((s,i)=>{const P=`areas.${ak}.subjects.${i}.`;return`<div class="sr">
  <div class="r2">${fld('Nama mapel',P+'name',s.name)}${fld('Kelas (opsional, mis. Kelas 7)',P+'grade',s.grade||'')}</div>
  <div class="fl"><span class="note">${s.file?'📄 PDF terpasang · '+(s.size/1048576).toFixed(2)+' MB':'Belum ada PDF'}</span>
   <label class="btn sm" style="display:inline-flex;color:var(--pi)">⬆ ${s.file?'Ganti':'Unggah'} PDF<input type="file" accept="application/pdf,.pdf" hidden data-up="${i}"></label>
   ${s.file?`<button class="btn sm g" data-act="view" data-i="${i}">Lihat</button><button class="btn sm r" data-act="rmf" data-i="${i}">Hapus PDF</button>`:''}</div>
  <label class="sw"><input type="checkbox" data-t="chk" data-p="${P}sched" ${s.sched?'checked':''}> Pakai jadwal buka <span class="note">(nonaktif = soal langsung terbuka)</span></label>
  <div class="r2"><label>Dibuka pada<input type="datetime-local" data-t="dt" data-p="${P}open" value="${dtv(s.open)}"></label><label>Ditutup pada (opsional)<input type="datetime-local" data-t="dt" data-p="${P}close" value="${dtv(s.close)}"></label></div>
  <div class="rw"><button class="btn sm g" data-act="up" data-i="${i}">↑</button><button class="btn sm g" data-act="down" data-i="${i}">↓</button><button class="btn sm r" data-act="del" data-i="${i}">🗑 Hapus mapel</button></div></div>`}).join('')+
 `<button class="btn" data-act="add">＋ Tambah mapel</button><p class="note">Maksimal 5 MB per file PDF. Jam mengikuti waktu server GitHub, bukan jam HP siswa.</p>`;
}
function tThm(){
 const T=cfg.theme,C=[['p','Warna utama'],['a','Warna aksen'],['smp','Area SMP'],['sd','Area SD'],['bg','Latar (terang)'],['card','Kartu (terang)'],['tx','Teks (terang)']];
 return`<div class="bx"><b>Tema siap pakai</b><div class="pre">${PRE.map((x,i)=>`<button data-pre="${i}"><i style="background:${x.t.p}"></i><i style="background:${x.t.a}"></i>${x.n}</button>`).join('')}</div></div>
 <div class="bx"><b>Warna kustom</b><div class="cols">${C.map(([k,l])=>`<label>${l}<input type="color" data-p="theme.${k}" value="${T[k]}"></label>`).join('')}</div><p class="note">Warna latar, kartu, dan teks berlaku untuk mode terang. Mode gelap memakai warna gelap bawaan dengan warna utama & aksen yang sama.</p></div>
 <div class="bx"><label>Kelengkungan sudut: ${T.r}px<input type="range" min="0" max="28" data-t="num" data-p="theme.r" value="${T.r}"></label>
 <label>Jenis huruf<select data-p="theme.font">${[['sys','Standar perangkat (paling ringan)'],['round','Bulat modern'],['serif','Klasik berkaki']].map(([v,l])=>`<option value="${v}" ${T.font===v?'selected':''}>${l}</option>`).join('')}</select></label>
 <button class="btn g" data-act="rst">Kembalikan tema bawaan</button></div>`;
}
function tGen(){
 const S=cfg.site,A=cfg.areas;
 return`<div class="bx"><label>Judul utama<textarea data-p="site.title">${esc(S.title)}</textarea></label>${fld('Sub-judul (tahun pelajaran)','site.sub',S.sub)}${fld('Pengumuman (kosongkan jika tidak ada)','site.notice',S.notice)}${fld('Teks footer','site.footer',S.footer)}</div>
 <div class="bx">${fld('Nama area SMP','areas.smp.name',A.smp.name)}${fld('Nama area SD','areas.sd.name',A.sd.name)}<label>Info tambahan area SMP (tampil di atas daftar soal)<textarea data-p="areas.smp.info">${esc(A.smp.info)}</textarea></label><label>Info tambahan area SD (tampil di atas daftar soal)<textarea data-p="areas.sd.info">${esc(A.sd.info)}</textarea></label></div>
 <div class="bx"><b>Logo</b>${['smp','sd'].map(k=>`<div class="fl"><img src="${esc(A[k].logo)}" alt="" style="width:44px;height:44px;object-fit:contain"><span class="note">Logo ${k.toUpperCase()}</span><label class="btn sm" style="display:inline-flex;color:var(--pi)">⬆ Ganti logo<input type="file" accept="image/png,image/jpeg,image/webp" hidden data-logo="${k}"></label></div>`).join('')}<p class="note">PNG/JPG/WebP, maksimal 1 MB.</p>
 <label class="sw"><input type="checkbox" data-t="chk" data-p="site.how" ${S.how!==false?'checked':''}> Tampilkan bagian "Cara menggunakan" di beranda</label></div>`;
}
function tTxt(){
 return`<div class="seg">${['id','en'].map(x=>`<button class="${x===tl?'on':''}" data-act="tl" data-v="${x}">${x==='id'?'Bahasa Indonesia':'English'}</button>`).join('')}</div>
 <div class="bx"><p class="note">Ubah tulisan yang dilihat siswa untuk bahasa yang dipilih. Kosongkan kolom untuk kembali ke tulisan bawaan (tampil sebagai contoh di kolom).</p>${TK.map(([k,l])=>`<label>${l}<input type="text" data-p="text.${tl}.${k}" value="${esc((cfg.text[tl]||{})[k]||'')}" placeholder="${esc(I18[tl][k])}"></label>`).join('')}</div>`;
}
function tSec(){
 return`<div class="bx"><b>Ganti password admin</b>${pwf('pw0','Password lama','current-password')}${pwf('pw1','Password baru (min. 8 karakter)','new-password')}${pwf('pw2','Ulangi password baru','new-password')}<button class="btn" data-act="cpw">Simpan password baru</button>
 <p class="note">Password baru tersimpan di repository (sebagai kode acak, bukan teks asli), jadi berlaku di semua perangkat. Pakai kombinasi panjang yang sulit ditebak. Lupa password? Hapus baris <code>"pw"</code> di <code>data/config.json</code> lewat GitHub, maka password kembali ke bawaan.</p></div>`;
}
function tGit(){
 const c=ghs();
 return`<div class="bx"><b>Penyimpanan GitHub</b><p class="note">Soal dan pengaturan disimpan langsung ke repository ini. Token hanya tersimpan di browser perangkat admin.</p>
 ${[['owner','Username / organisasi GitHub','text'],['repo','Nama repository','text'],['branch','Branch','text'],['token','Personal Access Token (izin Contents: Read and write)','password']].map(([k,l,ty])=>`<label>${l}<input type="${ty}" data-g="${k}" value="${esc(c[k])}" autocomplete="off"></label>`).join('')}
 <div class="rw"><button class="btn" data-act="gts">Uji koneksi</button></div></div>`;
}
function adminRender(){
 const el=$('#ad'),y=el.scrollTop,T=[['sub','📚 Mapel & Soal'],['thm','🎨 Tema'],['gen','📝 Umum'],['txt','✏️ Teks'],['sec','🔐 Keamanan'],['git','🔗 Penyimpanan']],B={sub:tSub,thm:tThm,gen:tGen,txt:tTxt,sec:tSec,git:tGit};
 el.hidden=false;lock();
 el.innerHTML=`<div class="ahb"><b>⚙️ Panel Admin</b><span class="sp"></span><button class="btn" id="sv" data-act="save">💾 Simpan${dirty?' •':''}</button><button class="ib" data-act="out" title="Keluar admin">⎋</button><button class="ib" data-act="cl" title="Tutup">✕</button></div><div class="tabs">${T.map(([k,l])=>`<button class="${k===tab?'on':''}" data-tab="${k}">${l}</button>`).join('')}</div><div class="ab">${B[tab]()}</div>`;
 el.scrollTop=y;
}
async function act(a,b){
 const L=cfg.areas[ak].subjects,i=+b.dataset.i,re=()=>{mark();adminRender();render()};
 switch(a){
  case'area':ak=b.dataset.v;adminRender();break;
  case'add':L.push(sub('Mapel baru'));re();break;
  case'del':if(confirm(`Hapus mapel "${L[i].name}"?`)){if(L[i].file)trash.push(L[i].file);L.splice(i,1);re()}break;
  case'up':case'down':{const j=a==='up'?i-1:i+1;if(j>=0&&j<L.length){[L[i],L[j]]=[L[j],L[i]];re()}break}
  case'rmf':if(confirm('Hapus file PDF ini?')){trash.push(L[i].file);L[i].file='';L[i].size=0;re()}break;
  case'view':openPdf(L[i]);break;
  case'save':save();break;
  case'cl':closeAdmin();break;
  case'out':if(dirty&&!confirm('Ada perubahan belum disimpan. Keluar?'))break;dirty=false;sessionStorage.removeItem('pas_adm');isAdmin=false;$('#ad').hidden=true;lock();render();break;
  case'mc':$('#md').hidden=true;break;
  case'tl':tl=b.dataset.v;adminRender();break;
  case'cpw':{const o=$('#pw0').value,n=$('#pw1').value,c=$('#pw2').value;
   if(await sha(o)!==pwh())return toast('Password lama salah.');
   if(n.length<8)return toast('Password baru minimal 8 karakter.');
   if(n!==c)return toast('Konfirmasi password tidak sama.');
   if(!ghc())return toast('Isi token GitHub dulu agar password baru tersimpan.');
   const old=cfg.pw;cfg.pw=await sha(n);
   if(await save(true))toast('✅ Password admin berhasil diganti.',4500);else cfg.pw=old;break}
  case'rst':if(confirm('Kembalikan semua warna ke bawaan?')){cfg.theme={...DEF.theme};mark();applyTheme();adminRender();render()}break;
  case'gts':{const c=ghs();try{const r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}`,{headers:{Authorization:'Bearer '+c.token}}),j=await r.json();toast(!r.ok?'❌ '+(j.message||r.status):j.permissions&&!j.permissions.push?'⚠️ Terhubung, tetapi tanpa izin tulis':'✅ Terhubung ke '+c.owner+'/'+c.repo,4500)}catch{toast('❌ Tidak ada koneksi internet')}break}
 }
}

/* ---------- Event global ---------- */
document.addEventListener('click',e=>{
 let b;const q=s=>b=e.target.closest(s);
 if(q('[data-eye]')){const i=$('#'+b.dataset.eye),h=i.type==='password';i.type=h?'text':'password';b.innerHTML=h?EYE:EYEX}
 else if(q('[data-open]')){const s=cfg.areas[view]&&cfg.areas[view].subjects.find(x=>x.id===b.dataset.open);s&&openPdf(s)}
 else if(q('[data-gr]')){grade=b.dataset.gr;render()}
 else if(q('[data-z]')){const z=b.dataset.z;zoom(z==='0'?1:vz*(z==='+'?1.25:.8))}
 else if(q('[data-pre]')){Object.assign(cfg.theme,PRE[+b.dataset.pre].t);mark();applyTheme();adminRender();render()}
 else if(q('[data-tab]')){tab=b.dataset.tab;adminRender()}
 else if(q('[data-act]'))act(b.dataset.act,b);
});
document.addEventListener('input',e=>{
 const el=e.target;
 if(el.dataset.g){const c=JSON.parse(localStorage.pas_gh||'{}');c[el.dataset.g]=el.value.trim();localStorage.pas_gh=JSON.stringify(c);return}
 const p=el.dataset.p;if(!p)return;
 let v=el.type==='checkbox'?el.checked:el.value;
 if(el.dataset.t==='dt')v=v?new Date(v).getTime():null;if(el.dataset.t==='num')v=+v;
 const k=p.split('.'),l=k.pop();let o=cfg;k.forEach(x=>o=o[x]);o[l]=v;
 mark();if(p.startsWith('theme'))applyTheme();render();
 if(p==='theme.r'){const lb=el.closest('label');lb.firstChild.textContent='Kelengkungan sudut: '+v+'px'}
});
const rd=f=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result.split(',')[1]);r.onerror=no;r.readAsDataURL(f)});
document.addEventListener('change',async e=>{
 const el=e.target;
 if(el.id==='lang'){lang=el.value;localStorage.pas_lang=lang;render();return}
 if(el.dataset.logo){
  const k=el.dataset.logo,f=el.files[0];el.value='';if(!f)return;
  if(!/^image\/(png|jpeg|webp)$/.test(f.type))return toast('Logo harus berformat PNG, JPG, atau WebP.');
  if(f.size>1048576)return toast('Logo maksimal 1 MB.');
  if(!ghc()){tab='git';adminRender();return toast('Isi token GitHub dulu agar logo bisa diunggah.')}
  toast('Mengunggah logo…',90000);
  try{const ext=f.type==='image/png'?'png':f.type==='image/webp'?'webp':'jpg',path=`assets/logo-${k}-${uid()}.${ext}`;await put(path,await rd(f),'Ganti logo '+k.toUpperCase());
   const o=cfg.areas[k].logo;if(/^assets\/logo-\w+-\w+\./.test(o))trash.push(o);cfg.areas[k].logo=path;mark();await save(true);adminRender();render()}catch(x){toast('Gagal mengunggah logo: '+x.message,5000)}
  return;
 }
 if(el.dataset.up===undefined)return;
 const f=el.files[0];el.value='';if(!f)return;
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name))return toast('File harus berformat PDF.');
 if(f.size>5*1048576)return toast(`Ukuran file ${(f.size/1048576).toFixed(1)} MB. Maksimal 5 MB per file.`,4500);
 if(!ghc()){tab='git';adminRender();return toast('Isi token GitHub dulu agar file bisa diunggah.')}
 const s=cfg.areas[ak].subjects[+el.dataset.up];toast('Mengunggah… jangan tutup halaman.',90000);
 try{
  const b=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result.split(',')[1]);r.onerror=no;r.readAsDataURL(f)});
  const path=`pdf/${ak}-${s.id}-${uid()}.pdf`;await put(path,b,'Unggah soal: '+s.name);
  if(s.file)trash.push(s.file);s.file=path;s.size=f.size;mark();await save(true);adminRender();render();
 }catch(x){toast('Gagal mengunggah: '+x.message,5000)}
});
document.addEventListener('submit',async e=>{
 if(e.target.id!=='lf')return;e.preventDefault();
 let h='';try{h=await sha($('#pw').value)}catch{return $('#er').textContent='Buka situs lewat https agar login berfungsi.'}
 await ready;h=await sha($('#pw').value);
 if(h===pwh()){isAdmin=true;sessionStorage.pas_adm='1';$('#md').hidden=true;render();adminRender()}else $('#er').textContent='Password salah.';
});
$('#adm').onclick=()=>isAdmin?adminRender():login();
$('#mode').onclick=()=>{localStorage.pas_mode=dk()?'light':'dark';applyTheme()};
$('#lang').value=lang;

/* ---------- Mulai ---------- */
const ready=(async function init(){
 try{const c=localStorage.pas_cache;c&&merge(JSON.parse(c))}catch{}
 applyTheme();route();
 try{
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),9000),r=await fetch('data/config.json?_='+Date.now(),{cache:'no-store',signal:ac.signal});clearTimeout(to);
  const d=r.headers.get('date');if(d)off=Date.parse(d)+(+r.headers.get('age')||0)*1000-Date.now();
  if(r.ok){merge(await r.json());localStorage.pas_cache=JSON.stringify(cfg)}
 }catch(e){}
 if(!dirty){applyTheme();render()}
})();
