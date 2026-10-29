/* =========================================================
   BFG MOMENT — Interactions du site
   Préchargement cinéma, films plein écran, projets filtrables,
   menu plein écran, panneau contact et réservation WhatsApp.
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initHero();
  initPreloader();
  initMenu();
  initContactPanel();
  initLightbox();
  initWork();
  initFrames();
  renderPricing();
  renderTestimonials();
  initBooking();
});

/* =========================================================
   1. HORLOGE (Abidjan = GMT)
   ========================================================= */
function initClock() {
  const clocks = document.querySelectorAll('.js-clock');
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Africa/Abidjan'
  });
  const tick = () => {
    const t = fmt.format(new Date());
    clocks.forEach(c => { c.textContent = t; });
  };
  tick();
  setInterval(tick, 1000);
}

/* =========================================================
   2. PRÉCHARGEMENT : barre qui s'étire, puis ouverture letterbox
   ========================================================= */
function initPreloader() {
  const pre = document.getElementById('preloader');
  const bar = document.getElementById('plBar');
  const pct = document.getElementById('plPct');
  const role = document.getElementById('plRole');
  const finish = () => {
    if (pre) pre.classList.add('is-done');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-revealed');
  };
  if (!pre || reduceMotion) { finish(); return; }

  const roles = ['Photographe', 'Vidéaste', 'Drone 4K'];
  let r = 0;
  const roleTimer = setInterval(() => { r = (r + 1) % roles.length; role.textContent = roles[r]; }, 650);

  // Progression calée sur l'horloge (1,6 s minimum) ; elle attend la première
  // vidéo, 3 s au plus, pour que le film démarre dès l'ouverture.
  const firstVideo = document.querySelector('.hero-slide video');
  const start = performance.now();
  const MIN = 1600;
  const MAX = 3000;
  const isReady = () => !firstVideo || firstVideo.readyState >= 3;

  const step = (now) => {
    const t = now - start;
    const done = (t >= MIN && isReady()) || t >= MAX;
    const p = done ? 100 : Math.min(92, (t / MIN) * 92);
    bar.style.width = `${p}%`;
    pct.textContent = `${Math.round(p)}%`;
    if (done) {
      clearInterval(roleTimer);
      finish();
      return;
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* =========================================================
   3. HERO : films plein écran avec règle de timeline
   ========================================================= */
const heroFilms = [
  { src: 'assets/hero-showreel.mp4', poster: 'assets/posters/hero-showreel-poster.webp', title: 'BFG Showreel 2026', cat: 'Film' },
  { src: 'assets/video-ghana.mp4', poster: 'assets/posters/video-ghana-poster.webp', title: "Quand 2 cultures s'unissent", cat: "Mariage · Ghana × Côte d'Ivoire" },
  { src: 'assets/video-baoule.mp4', poster: 'assets/posters/video-baoule-poster.webp', title: 'Love All Day', cat: 'Mariage traditionnel baoulé' },
  { src: 'assets/hero-reel.mp4', poster: 'assets/hero-poster.webp', title: 'Mariages & événements', cat: 'Extraits · Abidjan' }
];

function initHero() {
  const wrap = document.getElementById('heroSlides');
  const ruler = document.getElementById('heroRuler');
  const title = document.getElementById('heroTitle');
  const cat = document.getElementById('heroCat');
  const soundBtn = document.getElementById('heroSoundBtn');
  const hero = document.getElementById('hero');
  if (!wrap || !ruler) return;

  const TICKS = 5;
  const slides = heroFilms.map((film, i) => {
    const slide = document.createElement('div');
    slide.className = `hero-slide${i === 0 ? ' is-active' : ''}`;
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = i === 0 ? 'auto' : 'metadata';
    video.poster = film.poster;
    video.src = film.src;
    video.setAttribute('aria-hidden', 'true');
    slide.appendChild(video);
    wrap.appendChild(slide);

    const seg = document.createElement('button');
    seg.type = 'button';
    seg.className = 'ruler-seg';
    seg.dataset.n = i + 1;
    seg.setAttribute('role', 'tab');
    seg.setAttribute('aria-label', `Film ${i + 1} : ${film.title}`);
    seg.innerHTML = '<span class="ruler-tick"></span>'.repeat(TICKS);
    seg.addEventListener('click', () => go(i));
    ruler.appendChild(seg);
    return { slide, video, seg };
  });
  const head = document.createElement('span');
  head.className = 'ruler-head';
  ruler.appendChild(head);

  let current = 0;
  let muted = true;
  let inView = true;

  function setCaption(film, animate) {
    title.textContent = film.title;
    cat.textContent = film.cat;
    if (!animate) return;
    [title, cat].forEach(el => {
      el.classList.remove('is-swapping');
      void el.offsetWidth;
      el.classList.add('is-swapping');
    });
  }

  function playCurrent() {
    const v = slides[current].video;
    if (reduceMotion || !inView) return;
    v.play().catch(() => {});
  }

  function go(i) {
    if (i === current) return;
    const prev = slides[current];
    const next = slides[i];
    prev.slide.classList.remove('is-active');
    prev.slide.classList.add('is-leaving');
    setTimeout(() => {
      prev.slide.classList.remove('is-leaving');
      prev.video.pause();
    }, 1100);
    next.video.currentTime = 0;
    next.video.muted = muted;
    next.slide.classList.add('is-active');
    current = i;
    slides.forEach((s, j) => {
      s.seg.classList.toggle('is-active', j === i);
      s.seg.setAttribute('aria-selected', j === i ? 'true' : 'false');
    });
    setCaption(heroFilms[i], true);
    playCurrent();
  }

  slides.forEach((s, i) => {
    s.seg.classList.toggle('is-active', i === 0);
    s.seg.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    s.video.addEventListener('ended', () => { if (i === current) go((current + 1) % slides.length); });
  });
  setCaption(heroFilms[0], false);

  // Tête de lecture sur la règle : position = film courant + avancement.
  function moveHead() {
    const s = slides[current];
    const d = s.video.duration;
    const ratio = d ? Math.min(s.video.currentTime / d, 1) : 0;
    const left = s.seg.offsetLeft + ratio * s.seg.offsetWidth;
    head.style.left = `${left}px`;
    requestAnimationFrame(moveHead);
  }
  requestAnimationFrame(moveHead);

  // Clavier et balayage tactile.
  hero.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go((current + 1) % slides.length);
    if (e.key === 'ArrowLeft') go((current - 1 + slides.length) % slides.length);
  });
  let touchX = null;
  hero.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) go((current + (dx < 0 ? 1 : -1) + slides.length) % slides.length);
    touchX = null;
  });

  // Pause hors écran (batterie / CPU).
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) playCurrent(); else slides[current].video.pause();
    }, { threshold: 0.15 }).observe(hero);
  }
  playCurrent();

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      muted = !muted;
      slides[current].video.muted = muted;
      if (!muted) playCurrent();
      soundBtn.setAttribute('aria-pressed', muted ? 'false' : 'true');
      soundBtn.setAttribute('aria-label', muted ? 'Activer le son' : 'Couper le son');
      soundBtn.querySelector('use').setAttribute('href', muted ? '#i-volume-off' : '#i-volume-on');
    });
  }
}

/* =========================================================
   4. MENU PLEIN ÉCRAN
   ========================================================= */
function setOverlay(el, open) {
  el.classList.toggle('is-open', open);
  if (open) el.removeAttribute('inert'); else el.setAttribute('inert', '');
  document.body.classList.toggle('no-scroll', open || document.querySelector('.nav-overlay.is-open, .contact-panel.is-open') !== null);
}

function initMenu() {
  const btn = document.getElementById('burgerBtn');
  const nav = document.getElementById('navOverlay');
  if (!btn || !nav) return;

  nav.querySelectorAll('.nav-item').forEach((item, i) => {
    item.querySelector('.nav-num').style.setProperty('--i', i);
    item.querySelector('.nav-label').style.setProperty('--i', i);
    item.addEventListener('click', () => toggle(false));
  });

  function toggle(open) {
    setOverlay(nav, open);
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  btn.addEventListener('click', () => toggle(!nav.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { toggle(false); btn.focus(); }
  });
  window.closeMenu = () => toggle(false);
}

/* =========================================================
   5. PANNEAU CONTACT
   ========================================================= */
function initContactPanel() {
  const panel = document.getElementById('contactPanel');
  const closeBtn = document.getElementById('contactCloseBtn');
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!panel) return;
  let returnFocus = null;

  const open = () => {
    if (window.closeMenu) window.closeMenu();
    returnFocus = document.activeElement;
    setOverlay(panel, true);
    setTimeout(() => closeBtn.focus({ preventScroll: true }), 400);
  };
  const close = () => {
    setOverlay(panel, false);
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
  };

  // Délégation : les boutons "Réserver" des tarifs sont rendus après coup.
  document.addEventListener('click', (e) => { if (e.target.closest('.js-open-contact')) open(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('bfgmoment@gmail.com');
        copyBtn.textContent = 'Adresse copiée';
      } catch {
        copyBtn.textContent = 'bfgmoment@gmail.com';
      }
      setTimeout(() => { copyBtn.textContent = "Copier l'adresse"; }, 2000);
    });
  }
}

/* =========================================================
   6. VISIONNEUSE (clavier, précédent / suivant, focus)
   ========================================================= */
const lightboxState = { items: [], index: 0, returnFocus: null, label: '' };

function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;
  document.getElementById('lightboxCloseBtn').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrevBtn').addEventListener('click', () => stepLightbox(-1));
  document.getElementById('lightboxNextBtn').addEventListener('click', () => stepLightbox(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lb-media')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
    if (e.key === 'Tab') trapFocus(e, lightbox);
  });
}

function trapFocus(e, container) {
  const focusables = container.querySelectorAll('button, [href], video, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openLightbox(project, index = 0) {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;
  lightboxState.items = project.media;
  lightboxState.index = index;
  lightboxState.label = project;
  lightboxState.returnFocus = document.activeElement;
  lightbox.hidden = false;
  document.body.classList.add('no-scroll');
  renderLightboxItem();
  document.getElementById('lightboxCloseBtn').focus();
}

function stepLightbox(delta) {
  const total = lightboxState.items.length;
  if (total < 2) return;
  lightboxState.index = (lightboxState.index + delta + total) % total;
  renderLightboxItem();
}

function renderLightboxItem() {
  const item = lightboxState.items[lightboxState.index];
  const project = lightboxState.label;
  const box = document.querySelector('.lb-media');
  if (!item || !box) return;
  clearLightboxMedia(box);
  if (item.type === 'video') {
    const vid = document.createElement('video');
    vid.src = item.src;
    vid.poster = item.poster || '';
    vid.controls = true;
    vid.autoplay = true;
    vid.playsInline = true;
    box.appendChild(vid);
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = `${project.title} – ${project.category}, photo BFG Moment`;
    img.decoding = 'async';
    box.appendChild(img);
  }
  const total = lightboxState.items.length;
  document.getElementById('lightboxTitle').textContent = project.title;
  document.getElementById('lightboxDesc').textContent = `${project.category} · ${project.place}`;
  document.getElementById('lightboxCounter').textContent =
    `${String(lightboxState.index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  document.querySelectorAll('.lb-nav').forEach(b => { b.style.visibility = total > 1 ? 'visible' : 'hidden'; });
}

function clearLightboxMedia(box) {
  const vid = box.querySelector('video');
  if (vid) { vid.pause(); vid.removeAttribute('src'); vid.load(); }
  box.innerHTML = '';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox || lightbox.hidden) return;
  clearLightboxMedia(document.querySelector('.lb-media'));
  lightbox.hidden = true;
  document.body.classList.remove('no-scroll');
  const back = lightboxState.returnFocus;
  if (back && typeof back.focus === 'function' && document.contains(back)) back.focus();
}

/* =========================================================
   7. PROJETS : grille 2 + 3, vue liste, filtres
   ========================================================= */
const categories = [
  { id: 'all', label: 'Tout' },
  { id: 'film', label: 'Films' },
  { id: 'trad', label: 'Mariage traditionnel' },
  { id: 'civil', label: 'Mariage civil' },
  { id: 'culture', label: 'Culture & festivals' },
  { id: 'soutenance', label: 'Soutenances' }
];

const projects = [
  {
    title: "Quand 2 cultures s'unissent", cat: 'film', category: 'Film de mariage', place: 'Ghana × Côte d\'Ivoire',
    credits: ['Réalisation : BFG Moment', 'Mariage Ghana × Côte d\'Ivoire'],
    media: [{ type: 'video', src: 'assets/video-ghana.mp4', poster: 'assets/posters/video-ghana-poster.webp' }]
  },
  {
    title: 'Love All Day', cat: 'film', category: 'Film de mariage', place: 'Mariage baoulé',
    credits: ['Réalisation : BFG Moment', 'Mariage traditionnel baoulé'],
    media: [{ type: 'video', src: 'assets/video-baoule.mp4', poster: 'assets/posters/video-baoule-poster.webp' }]
  },
  {
    title: 'Vales & Marie', cat: 'trad', category: 'Mariage traditionnel', place: 'Mariage baoulé',
    credits: ['Photographie : BFG Moment', '5 images'],
    media: [10, 11, 12, 13, 14].map(n => ({ type: 'image', src: `assets/vales-marie-${n}.webp` }))
  },
  {
    title: 'Couple Kerozen', cat: 'civil', category: 'Mariage civil', place: 'Hôtel communal',
    credits: ['Photographie : BFG Moment', 'Cérémonie à l\'hôtel communal'],
    media: [20, 21].map(n => ({ type: 'image', src: `assets/kerozen-civil-${n}.webp` }))
  },
  {
    title: 'MASA 2026', cat: 'culture', category: 'Festival', place: 'Abidjan', year: '2026',
    credits: ['Photographie : BFG Moment', 'Ebinto, performances'],
    media: [1, 2].map(n => ({ type: 'image', src: `assets/masa-culture-${n}.webp` }))
  },
  {
    title: 'QITAA 2025', cat: 'culture', category: 'Concert', place: 'Abidjan', year: '2025',
    credits: ['Photographie : BFG Moment', 'Captation live'],
    media: [3, 4, 5, 6].map(n => ({ type: 'image', src: `assets/qitaa-concert-${n}.webp` }))
  },
  {
    title: 'Abissa ESMA', cat: 'culture', category: 'Festival', place: 'Côte d\'Ivoire',
    credits: ['Photographie : BFG Moment', 'Fête de l\'Abissa'],
    media: [22, 23].map(n => ({ type: 'image', src: `assets/abissa-esma-${n}.webp` }))
  },
  {
    title: 'Soutenance Dr. Jennifer', cat: 'soutenance', category: 'Soutenance', place: 'CHU de Cocody',
    credits: ['Photographie : BFG Moment', 'CHU de Cocody'],
    media: [8, 9].map(n => ({ type: 'image', src: `assets/soutenance-jennifer-${n}.webp` }))
  },
  {
    title: 'MASA 2024', cat: 'culture', category: 'Festival', place: 'Abidjan', year: '2024',
    credits: ['Photographie : BFG Moment', 'Scènes du festival'],
    media: [15, 16, 17].map(n => ({ type: 'image', src: `assets/media-${n}.webp` }))
  },
  {
    title: 'BFG Showreel 2026', cat: 'film', category: 'Showreel', place: 'Abidjan', year: '2026',
    credits: ['Réalisation : BFG Moment', 'Le meilleur de nos films'],
    media: [{ type: 'video', src: 'assets/hero-showreel.mp4', poster: 'assets/posters/hero-showreel-poster.webp' }]
  }
];

function coverOf(p) {
  const m = p.media[0];
  return m.type === 'video' ? m.poster : m.src;
}

function initWork() {
  const grid = document.getElementById('workGrid');
  const list = document.getElementById('workList');
  const filtersList = document.getElementById('filtersList');
  const toggle = document.getElementById('filtersToggle');
  const panel = document.getElementById('filtersPanel');
  const count = document.getElementById('workCount');
  const preview = document.getElementById('listPreview');
  if (!grid || !list) return;

  projects.forEach((p, i) => {
    const num = String(i + 1).padStart(3, '0');
    const video = p.media.find(m => m.type === 'video');

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'work-card';
    card.dataset.cat = p.cat;
    card.setAttribute('aria-label', `${video ? 'Lire le film' : 'Voir les photos'} : ${p.title}, ${p.category}`);
    card.innerHTML = `
      <div class="wc-media">
        <span class="wc-index">${num}</span>
        <img src="${coverOf(p)}" alt="" loading="lazy" decoding="async">
        ${video ? `<video src="${video.src}" muted loop playsinline preload="none" tabindex="-1" aria-hidden="true"></video>` : ''}
      </div>
      <div class="wc-info">
        <h3 class="wc-title">${p.title}</h3>
        <span class="wc-cat">${p.category}</span>
        <p class="wc-credits">${p.credits.map(c => `<span>${c}</span>`).join('')}</p>
      </div>`;
    const v = card.querySelector('video');
    if (v && !reduceMotion) {
      card.addEventListener('mouseenter', () => { card.classList.add('is-playing'); v.play().catch(() => {}); });
      card.addEventListener('mouseleave', () => { card.classList.remove('is-playing'); v.pause(); v.currentTime = 0; });
    }
    card.addEventListener('click', () => openLightbox(p));
    grid.appendChild(card);

    const li = document.createElement('li');
    li.className = 'wl-item';
    li.dataset.cat = p.cat;
    li.innerHTML = `
      <button type="button" class="wl-btn">
        <span class="wl-num">${num}</span>
        <span class="wl-title">${p.title}</span>
        <span class="wl-cat">${p.category}</span>
        <span class="wl-year">${p.year || p.place}</span>
      </button>`;
    const lb = li.querySelector('button');
    lb.addEventListener('click', () => openLightbox(p));
    lb.addEventListener('mouseenter', () => {
      preview.querySelector('img').src = coverOf(p);
      preview.classList.add('is-visible');
    });
    lb.addEventListener('mouseleave', () => preview.classList.remove('is-visible'));
    list.appendChild(li);
  });

  list.addEventListener('mousemove', (e) => {
    preview.style.left = `${e.clientX}px`;
    preview.style.top = `${e.clientY}px`;
  });

  // Rythme de la grille : 2 cartes larges, puis des rangées de 3.
  function layout() {
    const visible = [...grid.children].filter(c => !c.classList.contains('is-hidden'));
    visible.forEach((c, i) => c.classList.toggle('is-wide', i < 2));
  }

  function applyFilter(id) {
    let n = 0;
    [...grid.children, ...list.children].forEach(el => {
      const show = id === 'all' || el.dataset.cat === id;
      el.classList.toggle('is-hidden', !show);
    });
    n = [...grid.children].filter(c => !c.classList.contains('is-hidden')).length;
    count.textContent = `(${String(n).padStart(2, '0')})`;
    filtersList.querySelectorAll('.filter-btn').forEach(b => {
      const on = b.dataset.cat === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    layout();
  }

  categories.forEach((c, i) => {
    const total = c.id === 'all' ? projects.length : projects.filter(p => p.cat === c.id).length;
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" class="filter-btn" data-cat="${c.id}"><small>${String(i + 1).padStart(2, '0')}</small>${c.label}<small>(${String(total).padStart(2, '0')})</small></button>`;
    li.querySelector('button').addEventListener('click', () => applyFilter(c.id));
    filtersList.appendChild(li);
  });

  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.querySelectorAll('.view-btn').forEach(b => {
    b.addEventListener('click', () => {
      const isList = b.dataset.view === 'list';
      grid.hidden = isList;
      list.hidden = !isList;
      document.querySelectorAll('.view-btn').forEach(x => {
        const on = x === b;
        x.classList.toggle('is-active', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  });

  applyFilter('all');
}

/* Bandeau d'images défilant (toutes les photos des projets) */
function initFrames() {
  const track = document.getElementById('framesTrack');
  if (!track) return;
  const frames = [];
  projects.forEach(p => p.media.forEach((m, i) => frames.push({ p, i, src: m.type === 'video' ? m.poster : m.src })));
  [false, true].forEach(dup => {
    frames.forEach(f => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'frame';
      b.setAttribute('aria-label', `${f.p.title} – image ${f.i + 1}`);
      if (dup) { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }
      b.innerHTML = `<img src="${f.src}" alt="" loading="lazy" decoding="async">`;
      b.addEventListener('click', () => openLightbox(f.p, f.i));
      track.appendChild(b);
    });
  });
}

/* =========================================================
   8. TARIFS
   ========================================================= */
const allPricingPackages = [
  { category: 'traditional', name: 'Classique', subtitle: 'Mariage traditionnel baoulé & CI', price: '300 000', featured: false, image: 'assets/vales-marie-10.webp',
    features: ['1 photographe dédié', '1 cadreur vidéo HD', 'Film complet & teaser réseaux', '+250 photos retouchées HD'] },
  { category: 'traditional', name: 'Luxe', subtitle: 'Mariage traditionnel prestige', price: '400 000', featured: true, image: 'assets/vales-marie-12.webp',
    features: ['1 photographe dédié', '1 cadreur vidéo HD', 'Livre photo prestige 100 pages', '+300 photos retouchées HD'] },
  { category: 'traditional', name: 'Premium', subtitle: 'Mariage traditionnel excellence', price: '500 000', featured: false, image: 'assets/vales-marie-11.webp',
    features: ['2 photographes dédiés', '2 cadreurs vidéo HD/4K', 'Livre photo prestige 100 pages', 'Film complet & teaser 4K'] },
  { category: 'modern', name: 'Civil Classique', subtitle: 'Mariage civil, hôtel communal', price: '350 000', featured: false, image: 'assets/kerozen-civil-20.webp',
    features: ['1 photographe dédié', '1 cadreur vidéo HD', 'Film cérémonie & soirée', '+300 photos retouchées HD'] },
  { category: 'modern', name: 'Civil Luxe', subtitle: 'Mariage civil & soirée gala, drone 4K', price: '500 000', featured: true, image: 'assets/kerozen-civil-21.webp',
    features: ['1 droniste 4K certifié', '1 photographe dédié', 'Livre photo prestige 100 pages', 'Film complet & teaser 4K'] },
  { category: 'modern', name: 'Pack Ultime', subtitle: 'Couverture totale VIP, 2 jours', price: '600 000', featured: false, image: 'assets/vales-marie-13.webp',
    features: ['1 droniste 4K certifié', '2 photographes dédiés', '2 cadreurs vidéo HD/4K', 'Livre photo prestige 100 pages'] }
];

function renderPricing() {
  const root = document.getElementById('priceList');
  if (!root) return;
  const groups = [
    { id: 'traditional', label: 'Mariage traditionnel' },
    { id: 'modern', label: 'Mariage civil' }
  ];
  let n = 0;
  groups.forEach(g => {
    const packs = allPricingPackages.filter(p => p.category === g.id);
    const head = document.createElement('div');
    head.className = 'price-group-title';
    head.innerHTML = `<span>(${g.label})</span><span>${String(packs.length).padStart(2, '0')} formules</span>`;
    root.appendChild(head);
    packs.forEach(p => {
      n += 1;
      const row = document.createElement('article');
      row.className = 'price-row';
      row.innerHTML = `
        <span class="pr-num">${String(n).padStart(3, '0')}</span>
        <div>
          <h3 class="pr-name">${p.name}</h3>
          <span class="pr-sub">${p.subtitle}</span>
          ${p.featured ? '<span class="pr-badge">Le plus demandé</span>' : ''}
        </div>
        <ul class="pr-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
        <div class="pr-thumb"><img src="${p.image}" alt="" loading="lazy" decoding="async"></div>
        <div class="pr-price">${p.price}<small>FCFA</small>
          <button type="button" class="pr-book link-underline js-open-contact">Réserver</button>
        </div>`;
      root.appendChild(row);
    });
  });
}

/* =========================================================
   9. TÉMOIGNAGES
   ---------------------------------------------------------
   Remplacer les entrées ci-dessous par de vrais témoignages
   clients : { quote, name, event, placeholder: false }.
   Tant que placeholder vaut true, la carte porte la mention
   "Exemple" pour ne pas être prise pour un vrai avis.
   ========================================================= */
const testimonialsData = [
  {
    quote: "Votre témoignage apparaîtra ici. Quelques phrases sur l'ambiance du jour J, la qualité des photos et du film, et ce que vous avez ressenti en les découvrant.",
    name: 'Prénom N.',
    event: 'Mariage traditionnel · Abidjan',
    placeholder: true
  },
  {
    quote: "Votre témoignage apparaîtra ici. Un mot sur l'équipe, la discrétion pendant la cérémonie et les délais de livraison.",
    name: 'Prénom N.',
    event: 'Mariage civil · Hôtel communal',
    placeholder: true
  },
  {
    quote: "Votre témoignage apparaîtra ici. Le ressenti d'un organisateur d'événement culturel ou d'une soutenance capturée par BFG Moment.",
    name: 'Prénom N.',
    event: 'Événement culturel · MASA',
    placeholder: true
  }
];

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  testimonialsData.forEach((item, i) => {
    const card = document.createElement('article');
    card.className = `testimonial-card${item.placeholder ? ' is-placeholder' : ''}`;
    card.innerHTML = `
      <span class="testimonial-num">(${String(i + 1).padStart(2, '0')})</span>
      ${item.placeholder ? '<span class="testimonial-tag">Exemple</span>' : ''}
      <blockquote class="testimonial-text"><p>${item.quote}</p></blockquote>
      <footer class="testimonial-meta"><span>${item.name}</span><span>${item.event}</span></footer>`;
    grid.appendChild(card);
  });
}

/* =========================================================
   10. RÉSERVATION → WHATSAPP
   ========================================================= */
function initBooking() {
  const bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (id) => (document.getElementById(id)?.value || '').trim();
    const fullName = `${val('firstNameInput')} ${val('lastNameInput')}`.trim() || 'Client BFG';
    const checkedServices = Array.from(document.querySelectorAll('input[name="servicesWanted"]:checked'))
      .map(cb => cb.value).join(', ');

    const whatsappText = `*NOUVELLE DEMANDE DE PROJET - BFG MOMENT*%0A%0A` +
      `👤 *Nom complet* : ${encodeURIComponent(fullName)}%0A` +
      `✉️ *Email* : ${encodeURIComponent(val('emailInput'))}%0A` +
      `📞 *Téléphone / WhatsApp* : ${encodeURIComponent(val('phoneInput'))}%0A` +
      `💍 *Type d'événement* : ${encodeURIComponent(val('serviceSelect') || 'Mariage')}%0A` +
      `📅 *Date prévue* : ${encodeURIComponent(val('dateInput') || 'À définir')}%0A` +
      `📍 *Lieu / Ville* : ${encodeURIComponent(val('locationInput'))}%0A` +
      `✨ *Prestations souhaitées* : ${encodeURIComponent(checkedServices || 'Non spécifié')}%0A` +
      `💬 *Détails du projet* :%0A${encodeURIComponent(val('messageInput'))}`;

    // Numéro WhatsApp officiel BFG Moment : +225 0767660476
    window.open(`https://wa.me/2250767660476?text=${whatsappText}`, '_blank');
  });
}
