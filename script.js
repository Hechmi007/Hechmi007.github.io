/* ═══════════════════════════════════════════════════════════
   OPEX CONSULTING — SHARED SCRIPT
   Used by: index.html, railway.html, automotive.html
═══════════════════════════════════════════════════════════ */

/* Favicon (generated so no separate icon file is required) */
(function(){
  const c=document.createElement('canvas');c.width=64;c.height=64;
  const x=c.getContext('2d'),g=x.createLinearGradient(0,64,64,0);
  g.addColorStop(0,'#22398C');g.addColorStop(1,'#4FB4EF');
  x.fillStyle=g;x.beginPath();x.arc(32,32,30,0,Math.PI*2);x.fill();
  x.fillStyle='#fff';x.font='bold 26px serif';
  x.textAlign='center';x.textBaseline='middle';x.fillText('O',32,33);
  const l=document.createElement('link');l.rel='icon';l.href=c.toDataURL();
  document.head.appendChild(l);
})();

/* Year in footer */
document.addEventListener('DOMContentLoaded', () => {
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
});

/* Nav scroll shadow */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), {passive:true});
}

/* Mobile menu */
const burger = document.getElementById('burger'), mob = document.getElementById('mob');
if (burger && mob) {
  burger.addEventListener('click', () => {
    const o = mob.classList.toggle('open');
    burger.classList.toggle('open', o);
    burger.setAttribute('aria-expanded', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeMob(); });
}
function closeMob() {
  if (!mob) return;
  mob.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* Scroll reveal */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('on'); ro.unobserve(e.target); }});
}, { threshold:.1, rootMargin:'0px 0px -30px 0px' });
document.querySelectorAll('.r').forEach(el => ro.observe(el));
document.querySelectorAll('#hero .r, .page-header .r').forEach(el => el.classList.add('on'));

/* Why-card cursor-tracking glow */
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* Scroll-scrubbed videos — frame follows scroll position instead of
   playing normally. Works for any number of .scrub-video sections. */
document.querySelectorAll('.scrub-video').forEach(wrap => {
  const video = wrap.querySelector('.scrub-video-el');
  const caption = wrap.querySelector('.scrub-caption');
  const hint = wrap.querySelector('.scrub-hint');
  if (!video) return;

  let duration = 0;
  video.muted = true;
  video.playsInline = true;

  function primeDecoder(){
    // Browsers won't render new frames from manual currentTime
    // changes until the video has actually started playing once.
    const p = video.play();
    if (p && p.then) p.then(() => video.pause()).catch(() => {});
    else video.pause();
  }

  video.addEventListener('loadedmetadata', () => {
    duration = video.duration || 0;
    primeDecoder();
  });
  video.addEventListener('canplay', () => {
    if (!duration) duration = video.duration || 0;
  });
  if (video.readyState >= 1) {
    duration = video.duration || 0;
    primeDecoder();
  }

  let lastTime = -1;
  let rafId = null;
  let active = false;

  function update(){
    const rect = wrap.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    let progress = total > 0 ? (-rect.top) / total : 0;
    progress = Math.max(0, Math.min(1, progress));

    if (duration > 0 && isFinite(duration)) {
      const target = progress * duration;
      if (Math.abs(target - lastTime) > 1 / 60) {
        video.currentTime = target;
        lastTime = target;
      }
    }
    if (caption) {
      caption.style.opacity = Math.max(0, 1 - progress * 2.4);
      caption.style.transform = `translateY(${progress * 30}px)`;
    }
    if (hint) {
      hint.style.opacity = Math.max(0, 1 - progress * 6);
    }
    if (active) rafId = requestAnimationFrame(update);
  }

  function start(){ if (!active) { active = true; rafId = requestAnimationFrame(update); } }
  function stop(){ active = false; if (rafId) cancelAnimationFrame(rafId); }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { e.isIntersecting ? start() : stop(); });
  }, { rootMargin: '200px 0px 200px 0px' });
  io.observe(wrap);
});

