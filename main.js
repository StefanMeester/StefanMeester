(()=>{
const S=window.SITE||{},page=document.body.dataset.page;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const links=[['index.html','home','Home'],['projects.html','projects','Projects'],['about.html','about','About'],['contact.html','contact','Contact']];
document.body.insertAdjacentHTML('afterbegin',`<div class="bg" aria-hidden="true"><i></i><i></i><i></i></div><a class="skip" href="#main">Skip to content</a>
<header class="nav glass"><a class="brand" href="index.html">${esc(S.name)}</a><nav aria-label="Main">${links.map(l=>`<a href="${l[0]}"${l[1]===page?' aria-current="page"':''}>${l[2]}</a>`).join('')}</nav></header>`);
document.body.insertAdjacentHTML('beforeend',`<footer><a href="mailto:${esc(S.email)}">${esc(S.email)}</a><a href="${esc(S.instagram)}" rel="noopener">Instagram</a><p>&copy; ${esc(S.name)}</p></footer>`);
document.querySelectorAll('[data-link]').forEach(a=>{const k=a.dataset.link,v=k==='email'?(S.email&&'mailto:'+S.email):S[k];v?a.href=v:a.hidden=true});
document.querySelectorAll('[data-s]').forEach(e=>e.textContent=S[e.dataset.s]);

/* images: shimmer, fade-in, friendly fallback with retry */
document.addEventListener('load',e=>{if(e.target.tagName==='IMG'){e.target.classList.add('loaded');e.target.closest('.ph')?.classList.add('loaded')}},true);
document.addEventListener('error',e=>{const i=e.target;if(i.tagName!=='IMG')return;const w=i.closest('.ph');if(!w)return;w.classList.add('bad');
 if(!w.querySelector('.fb')&&!w.matches('.thumb,.pcard'))w.insertAdjacentHTML('beforeend','<div class="fb"><span>This image could not load.</span><button type="button" data-retry>Try again</button></div>')},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-retry]');if(!b)return;const w=b.closest('.ph'),i=w.querySelector('img');w.classList.remove('bad');b.parentNode.remove();i.src=i.src.split('?')[0]+'?r='+Date.now()});
const img=(src,alt)=>`<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;

/* projects: one list, newest first */
const PR=(window.PROJECTS||[]).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));
const year=p=>String(p.date||'').slice(0,4),cap=s=>s?s[0].toUpperCase()+s.slice(1):'';
const thumbOf=p=>p.thumb||(p.type==='video'&&p.video&&p.video.type!=='vimeo'?`https://i.ytimg.com/vi/${p.video.id}/hqdefault.jpg`:(p.photos&&p.photos[0]?p.photos[0].src:''));
const card=(p,i)=>{const t=thumbOf(p);return `<article class="ph pcard">${t?img(t,''):''}<button type="button" class="open" data-o="${i}"><strong>${esc(p.title)}</strong><small>${esc(year(p))} &middot; ${esc(cap(p.type))}</small></button></article>`};
const empty=t=>`<div class="empty glass">${t}</div>`;
const g=$('#grid');

if(g){
 const draw=list=>{g.innerHTML=list.length?list.map(([p,i])=>card(p,i)).join(''):empty(PR.length?'No projects match these filters. <button class="btn ghost" type="button" data-reset>Show all projects</button>':'No projects yet. Add your first one in js/content.js.')};
 const all=PR.map((p,i)=>[p,i]);
 if(page==='home')draw(all.slice(0,3));
 if(page==='projects'){
  const st={type:'',year:'',tag:''},uniq=a=>[...new Set(a)];
  const groups=[['type','Type',uniq(PR.map(p=>p.type)),cap],['year','Year',uniq(PR.map(year)),x=>x],['tag','Topic',uniq(PR.flatMap(p=>p.tags||[])).sort(),x=>x]].filter(x=>x[2].length>1||(x[0]==='tag'&&x[2].length));
  const F=$('#filters'),C=$('#count');
  const run=()=>{F.innerHTML=groups.map(([k,l,vals,f])=>`<div class="frow" role="group" aria-label="Filter by ${l}"><span>${l}</span>${['',...vals].map(v=>`<button type="button" class="chip" data-g="${k}" data-val="${esc(v)}" aria-pressed="${st[k]===v}">${v?esc(f(v)):'All'}</button>`).join('')}</div>`).join('');
   const list=all.filter(([p])=>(!st.type||p.type===st.type)&&(!st.year||year(p)===st.year)&&(!st.tag||(p.tags||[]).includes(st.tag)));
   draw(list);C.textContent=list.length+(list.length===1?' project':' projects')};
  document.addEventListener('click',e=>{const c=e.target.closest('.chip');if(c){const f=document.activeElement===c;st[c.dataset.g]=c.dataset.val;run();if(f)$(`.chip[data-g="${c.dataset.g}"][data-val="${c.dataset.val}"]`)?.focus()}
   if(e.target.closest('[data-reset]')){st.type=st.year=st.tag='';run()}});
  run();
 }
 /* project window: video player or photo viewer */
 document.body.insertAdjacentHTML('beforeend','<dialog id="pm" aria-label="Project"><div id="pmc"></div></dialog>');
 const pm=$('#pm'),box=$('#pmc');let cur=null,n=0;
 const view=()=>{const p=cur,meta=`${esc(year(p))} &middot; ${esc((p.tags||[]).join(', '))}${p.role?' &middot; '+esc(p.role):''}`;let top='',nav='';
  if(p.type==='video'&&p.video){const v=p.video,vim=v.type==='vimeo';
   const src=vim?`https://player.vimeo.com/video/${v.id}?autoplay=1&dnt=1`:`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;
   top=`<div class="ph thumb loaded"><iframe src="${src}" title="${esc(p.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
   nav=`<a class="btn ghost" href="${vim?'https://vimeo.com/':'https://www.youtube.com/watch?v='}${esc(v.id)}" target="_blank" rel="noopener">Watch on ${vim?'Vimeo':'YouTube'}</a>`}
  else if(p.photos&&p.photos.length){const q=p.photos[n];top=`<div class="ph" style="aspect-ratio:auto;min-height:40vh">${img(q.src,q.alt)}</div><p>${esc(q.caption)}${p.photos.length>1?` (${n+1} of ${p.photos.length})`:''}</p>`;
   if(p.photos.length>1)nav=`<button class="btn ghost" data-n="-1">Previous</button><button class="btn ghost" data-n="1">Next</button>`}
  box.innerHTML=`${top}<h2 style="margin:18px 0 4px;text-align:center">${esc(p.title)}</h2><p>${meta}</p><p>${esc(p.text)}</p><div class="row">${nav}<button class="btn" data-x>Close</button></div>`};
 document.addEventListener('click',e=>{const o=e.target.closest('[data-o]');if(o){cur=PR[+o.dataset.o];n=0;view();pm.showModal();$('[data-x]',pm).focus()}
  const s=e.target.closest('[data-n]');if(s&&cur){n=(n+ +s.dataset.n+cur.photos.length)%cur.photos.length;view()}
  if(e.target.closest('[data-x]')||e.target===pm)pm.close()});
 document.addEventListener('keydown',e=>{if(pm.open&&cur&&cur.photos&&cur.photos.length>1&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){n=(n+(e.key==='ArrowRight'?1:-1)+cur.photos.length)%cur.photos.length;view()}});
 pm.addEventListener('close',()=>{box.innerHTML=''});
}

/* contact: copy email */
document.addEventListener('click',async e=>{if(!e.target.closest('[data-copy]'))return;const t=$('#toast');
 try{await navigator.clipboard.writeText(S.email);t.textContent='Email address copied.'}catch{t.textContent='Copy failed. Select the address and copy it by hand: '+S.email}});

/* hero timecode (25 fps) */
const tc=$('#tc');if(tc&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const t0=performance.now(),p=n=>String(n).padStart(2,'0');
 setInterval(()=>{const f=Math.floor((performance.now()-t0)/40);tc.textContent=`${p(Math.floor(f/90000)%100)}:${p(Math.floor(f/1500)%60)}:${p(Math.floor(f/25)%60)}:${p(f%25)}`},40)}

/* loader: first visit per session only, gives up after 3s */
const L=$('#loader');if(L){$('span',L).textContent=S.name;const t0=performance.now();let d=0;
 const hide=()=>{if(d)return;d=1;setTimeout(()=>{L.classList.add('done');try{sessionStorage.setItem('seen',1)}catch{}},Math.max(0,700-(performance.now()-t0)))};
 if(document.readyState==='complete')hide();else addEventListener('load',hide);setTimeout(hide,3000)}
})();