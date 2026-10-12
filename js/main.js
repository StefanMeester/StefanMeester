(()=>{
const S=window.SITE||{},V=window.VIDEOS||[],P=window.PHOTOS||[],page=document.body.dataset.page;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const links=[['index.html','home','Home'],['work.html','work','Videos'],['photos.html','photos','Photos'],['about.html','about','About'],['contact.html','contact','Contact']];
document.body.insertAdjacentHTML('afterbegin',`<div class="bg" aria-hidden="true"><i></i><i></i><i></i></div><a class="skip" href="#main">Skip to content</a>
<header class="nav glass"><a class="brand" href="index.html">${esc(S.name)}</a><nav aria-label="Main">${links.map(l=>`<a href="${l[0]}"${l[1]===page?' aria-current="page"':''}>${l[2]}</a>`).join('')}</nav></header>`);
document.body.insertAdjacentHTML('beforeend',`<footer><a href="mailto:${esc(S.email)}">${esc(S.email)}</a><a href="${esc(S.instagram)}" rel="noopener">Instagram</a><p>&copy; ${new Date().getFullYear()} ${esc(S.name)}. Student work, MBO Film- en videomaker at Firda. This site uses no cookies or tracking. Videos load from YouTube or Vimeo only when you press play.</p></footer>`);
document.querySelectorAll('[data-s]').forEach(e=>e.textContent=S[e.dataset.s]);

/* images: shimmer, fade-in, and a friendly fallback with retry */
document.addEventListener('load',e=>{if(e.target.tagName==='IMG'){e.target.classList.add('loaded');e.target.closest('.ph')?.classList.add('loaded')}},true);
document.addEventListener('error',e=>{const i=e.target;if(i.tagName!=='IMG')return;const w=i.closest('.ph');if(!w)return;w.classList.add('bad');
 if(!w.querySelector('.fb')&&!w.classList.contains('thumb'))w.insertAdjacentHTML('beforeend','<div class="fb"><span>This image could not load.</span><button type="button" data-retry>Try again</button></div>')},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-retry]');if(!b)return;e.stopPropagation();const w=b.closest('.ph'),i=w.querySelector('img');w.classList.remove('bad');b.parentNode.remove();i.src=i.src.split('?')[0]+'?r='+Date.now()});

const img=(src,alt)=>`<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const empty=t=>`<div class="empty glass">${t}</div>`;

/* videos: thumbnail first, player loads only on click */
const vurl=v=>v.type==='vimeo'?`https://vimeo.com/${v.id}`:`https://www.youtube.com/watch?v=${v.id}`;
const vcard=(v,i)=>{const t=v.thumb||(v.type==='vimeo'?'':`https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg`);
 return `<article class="card glass"><button class="ph thumb" type="button" data-v="${i}" aria-label="Play ${esc(v.title)}">${t?img(t,''):''}<span class="play"><svg width="22" height="22" viewBox="0 0 24 24"><path fill="#fff" d="M7 4v16l13-8z"/></svg></span></button>
 <div class="info"><h3>${esc(v.title)}</h3><small>${esc(v.meta)}</small><p>${esc(v.text)}</p><a class="yt" href="${vurl(v)}" rel="noopener" target="_blank">Watch on ${v.type==='vimeo'?'Vimeo':'YouTube'} (opens in a new tab)</a></div></article>`};
document.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;const v=V[b.dataset.v];
 const src=v.type==='vimeo'?`https://player.vimeo.com/video/${v.id}?autoplay=1&dnt=1`:`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;
 b.outerHTML=`<div class="ph thumb loaded"><iframe src="${src}" title="${esc(v.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`});

const g=$('#grid');
if(g&&page==='home'||g&&page==='work')g.innerHTML=V.length?V.slice(0,page==='home'?3:99).map(vcard).join(''):empty('No videos yet. Add your first one in js/content.js.');
if(g&&page==='photos'){g.innerHTML=P.length?P.map((p,i)=>`<button class="ph" type="button" data-p="${i}" aria-label="Open photo: ${esc(p.alt)}">${img(p.src,p.alt)}</button>`).join(''):empty('No photos yet. Add your first one in js/content.js.');
 document.body.insertAdjacentHTML('beforeend','<dialog id="lb" aria-label="Photo viewer"><div id="lbi"></div><div class="row"><button class="btn ghost" data-n="-1">Previous</button><button class="btn ghost" data-n="1">Next</button><button class="btn" data-x>Close</button></div></dialog>');
 const lb=$('#lb');let n=0;const show=k=>{n=(k+P.length)%P.length;const p=P[n];$('#lbi').innerHTML=`<div class="ph" style="aspect-ratio:auto;min-height:40vh">${img(p.src,p.alt)}</div><p>${esc(p.caption)}</p>`};
 document.addEventListener('click',e=>{const o=e.target.closest('[data-p]');if(o&&!e.target.closest('[data-retry]')){show(+o.dataset.p);lb.showModal()}
  const s=e.target.closest('[data-n]');if(s)show(n+ +s.dataset.n);if(e.target.closest('[data-x]')||e.target===lb)lb.close()});
 document.addEventListener('keydown',e=>{if(!lb.open)return;if(e.key==='ArrowRight')show(n+1);if(e.key==='ArrowLeft')show(n-1)})}

/* contact: copy email with confirmation */
document.addEventListener('click',async e=>{if(!e.target.closest('[data-copy]'))return;const t=$('#toast');
 try{await navigator.clipboard.writeText(S.email);t.textContent='Email address copied.'}catch{t.textContent='Copy failed. Select the address and copy it by hand: '+S.email}});

/* hero timecode (25 fps) */
const tc=$('#tc');if(tc&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const t0=performance.now(),p=n=>String(n).padStart(2,'0');
 setInterval(()=>{const f=Math.floor((performance.now()-t0)/40);tc.textContent=`${p(Math.floor(f/90000)%100)}:${p(Math.floor(f/1500)%60)}:${p(Math.floor(f/25)%60)}:${p(f%25)}`},40)}

/* loader: first visit per session only, always gives up after 3s */
const L=$('#loader');if(L){$('span',L).textContent=S.name;const t0=performance.now();let d=0;
 const hide=()=>{if(d)return;d=1;setTimeout(()=>{L.classList.add('done');try{sessionStorage.setItem('seen',1)}catch{}},Math.max(0,700-(performance.now()-t0)))};
 if(document.readyState==='complete')hide();else addEventListener('load',hide);setTimeout(hide,3000)}
})();