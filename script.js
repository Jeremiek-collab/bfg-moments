/* =========================================================
   BFG MOMENT - Showcase Engine with HD 3D Curved Portfolio
   & Editorial Scrapbook Collage Tarifs
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Scroll & Minimalist Burger Overlay Nav
  initBurgerNav();
  
  // Initialize Lightbox Modal Handlers (Close on X, Background Click, Escape Key)
  initLightbox();
  
  // Initialize 3D Curved Perspective Portfolio (Ultra Crisp HD & Hover Video)
  init3DCurvedPortfolio();
  
  // Initialize Editorial Scrapbook Paper Stack Tarifs (Matching Reference Photos)
  initScrapbookPaperTarifs();
  
  // Initialize Testimonials (section "Ils nous ont fait confiance")
  renderTestimonials();

  // Initialize Booking Form & WhatsApp Links
  initBooking();
});

/* =========================================================
   1. BURGER NAVIGATION OVERLAY LOGIC
   ========================================================= */
function initBurgerNav() {
  const header = document.querySelector('.site-header');
  const burgerBtn = document.getElementById('burgerBtn');
  const navOverlay = document.getElementById('navOverlay');
  const closeOverlayBtn = document.getElementById('closeOverlayBtn');
  const overlayLinks = document.querySelectorAll('.overlay-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (burgerBtn && navOverlay) {
    burgerBtn.addEventListener('click', () => {
      navOverlay.classList.add('active');
      burgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeOverlayBtn) closeOverlayBtn.focus({ preventScroll: true });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });

  function closeOverlay() {
    if (navOverlay && navOverlay.classList.contains('active')) {
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (burgerBtn) {
        burgerBtn.setAttribute('aria-expanded', 'false');
        burgerBtn.focus();
      }
    }
  }

  if (closeOverlayBtn) {
    closeOverlayBtn.addEventListener('click', closeOverlay);
  }

  overlayLinks.forEach(link => {
    link.addEventListener('click', () => {
      overlayLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      closeOverlay();
    });
  });
}

/* =========================================================
   3. LIGHTBOX MODAL HANDLER (clavier, précédent / suivant, focus)
   ========================================================= */
const lightboxState = { items: [], index: 0, returnFocus: null };

function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');
  if (!lightbox) return;

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => stepLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => stepLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
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

function openLightbox(items, index) {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;
  lightboxState.items = items;
  lightboxState.index = index;
  lightboxState.returnFocus = document.activeElement;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  renderLightboxItem();
  const closeBtn = document.getElementById('lightboxCloseBtn');
  if (closeBtn) closeBtn.focus();
}

function stepLightbox(delta) {
  const total = lightboxState.items.length;
  if (!total) return;
  lightboxState.index = (lightboxState.index + delta + total) % total;
  renderLightboxItem();
}

function renderLightboxItem() {
  const item = lightboxState.items[lightboxState.index];
  const mediaContainer = document.querySelector('.lightbox-media-container');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.querySelector('.lightbox-desc');
  const counter = document.getElementById('lightboxCounter');
  if (!item || !mediaContainer) return;

  clearLightboxMedia(mediaContainer);
  if (item.type === 'video') {
    const vid = document.createElement('video');
    vid.src = item.src;
    vid.poster = item.poster || '';
    vid.controls = true;
    vid.autoplay = true;
    vid.playsInline = true;
    mediaContainer.appendChild(vid);
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    img.decoding = 'async';
    mediaContainer.appendChild(img);
  }
  if (lightboxTitle) lightboxTitle.innerText = item.title;
  if (lightboxDesc) lightboxDesc.innerText = `${item.pill} - ${item.subtitle}`;
  if (counter) counter.innerText = `${lightboxState.index + 1} / ${lightboxState.items.length}`;
}

function clearLightboxMedia(mediaContainer) {
  const vid = mediaContainer.querySelector('video');
  if (vid) {
    vid.pause();
    vid.removeAttribute('src');
    vid.load();
  }
  mediaContainer.innerHTML = '';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const mediaContainer = document.querySelector('.lightbox-media-container');
  if (!lightbox || lightbox.hidden) return;
  if (mediaContainer) clearLightboxMedia(mediaContainer);
  lightbox.hidden = true;
  document.body.style.overflow = '';
  const back = lightboxState.returnFocus;
  if (back && typeof back.focus === 'function' && document.contains(back)) back.focus();
}

/* =========================================================
   4. NOS RÉALISATIONS - 3D CURVED PERSPECTIVE CAROUSEL
   ========================================================= */
const portfolio23Dataset = [
  { type: "video", src: "assets/video-ghana.mp4", poster: "assets/posters/video-ghana-poster.webp", category: "video", title: "Quand 2 cultures s'unissent", subtitle: "Ghana x CI", pill: "CINÉMA VIDEO" },
  { type: "video", src: "assets/video-baoule.mp4", poster: "assets/posters/video-baoule-poster.webp", category: "video", title: "Love All Day - Baoulé", subtitle: "Traditionnel", pill: "CINÉMA VIDEO" },
  { type: "image", src: "assets/vales-marie-10.webp", category: "mariage-trad", title: "Vales & Marie 1", subtitle: "Mariage Baoulé", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/vales-marie-11.webp", category: "mariage-trad", title: "Moments d'Émotion", subtitle: "Vales & Marie", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/vales-marie-12.webp", category: "mariage-trad", title: "Élégance Baoulé", subtitle: "Mariage Trad", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/kerozen-civil-20.webp", category: "mariage-civil", title: "Couple KEROZEN", subtitle: "Mariage Civil", pill: "MARIAGE CIVIL" },
  { type: "image", src: "assets/kerozen-civil-21.webp", category: "mariage-civil", title: "Hôtel Communal", subtitle: "Mariage Civil", pill: "MARIAGE CIVIL" },
  { type: "image", src: "assets/masa-culture-1.webp", category: "evenement", title: "MASA - Ebinto", subtitle: "Abidjan", pill: "MASA 2026" },
  { type: "image", src: "assets/masa-culture-2.webp", category: "evenement", title: "MASA - Performance", subtitle: "Spectacle", pill: "MASA 2026" },
  { type: "image", src: "assets/soutenance-jennifer-8.webp", category: "soutenance", title: "Dr. Jennifer 1", subtitle: "CHU Cocody", pill: "SOUTENANCE" },
  { type: "image", src: "assets/soutenance-jennifer-9.webp", category: "soutenance", title: "Dr. Jennifer 2", subtitle: "CHU Cocody", pill: "SOUTENANCE" },
  { type: "image", src: "assets/qitaa-concert-3.webp", category: "evenement", title: "QITAA 2025 Live 1", subtitle: "Concert", pill: "SPECTACLE" },
  { type: "image", src: "assets/qitaa-concert-4.webp", category: "evenement", title: "QITAA 2025 Live 2", subtitle: "Concert", pill: "SPECTACLE" },
  { type: "image", src: "assets/qitaa-concert-5.webp", category: "evenement", title: "QITAA 2025 Live 3", subtitle: "Concert", pill: "SPECTACLE" },
  { type: "image", src: "assets/qitaa-concert-6.webp", category: "evenement", title: "QITAA 2025 Live 4", subtitle: "Concert", pill: "SPECTACLE" },
  { type: "image", src: "assets/abissa-esma-22.webp", category: "evenement", title: "Abissa ESMA 1", subtitle: "Festival", pill: "ABISSA" },
  { type: "image", src: "assets/abissa-esma-23.webp", category: "evenement", title: "Abissa ESMA 2", subtitle: "Festival", pill: "ABISSA" },
  { type: "image", src: "assets/vales-marie-13.webp", category: "mariage-trad", title: "Vales & Marie 4", subtitle: "Mariage Trad", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/vales-marie-14.webp", category: "mariage-trad", title: "Vales & Marie 5", subtitle: "Mariage Trad", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/media-15.webp", category: "evenement", title: "MASA 2024 Scène 1", subtitle: "Abidjan", pill: "MASA 2024" },
  { type: "image", src: "assets/media-16.webp", category: "evenement", title: "MASA 2024 Scène 2", subtitle: "Abidjan", pill: "MASA 2024" },
  { type: "image", src: "assets/media-17.webp", category: "evenement", title: "MASA 2024 Scène 3", subtitle: "Abidjan", pill: "MASA 2024" },
  { type: "video", src: "assets/hero-showreel.mp4", poster: "assets/posters/hero-showreel-poster.webp", category: "video", title: "BFG Showreel 2026", subtitle: "Best Of Video", pill: "SHOWREEL" }
];

function init3DCurvedPortfolio() {
  const track1 = document.getElementById('curvedTrack');
  const stage1 = document.getElementById('curvedStageWrapper');
  const track2 = document.getElementById('curvedTrack2');
  const stage2 = document.getElementById('curvedStageWrapper2');

  if (!track1 || !stage1 || !track2 || !stage2) return;

  const allItems = [...portfolio23Dataset];
  const midPoint = Math.ceil(allItems.length / 2);
  const firstHalf = allItems.slice(0, midPoint);
  const secondHalf = allItems.slice(midPoint);

  function createCard(item, index, list, isDuplicate) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'hd-curved-card';
    card.setAttribute('data-index', index);
    card.setAttribute('aria-label', `${item.type === 'video' ? 'Lire la vidéo' : 'Agrandir la photo'} : ${item.title}`);
    if (isDuplicate) card.tabIndex = -1;

    const imgSrc = item.type === 'video' ? item.poster : item.src;

    card.innerHTML = `
      <img src="${imgSrc}" alt="" class="hd-card-media" loading="lazy" decoding="async">
      ${item.type === 'video' ? `
        <video src="${item.src}" poster="${item.poster}" preload="none" loop muted playsinline class="hd-card-video" tabindex="-1"></video>
      ` : ''}
      <div class="hd-card-overlay">
        <span class="hd-tag-pill">${item.pill}</span>
        <div class="hd-card-info">
          <div>
            <div class="hd-card-title">${item.title}</div>
            <div class="hd-card-sub">${item.subtitle}</div>
          </div>
          <div class="hd-play-circle">
            <svg class="icon ${item.type === 'video' ? 'icon-fill' : ''}" aria-hidden="true" focusable="false"><use href="#i-${item.type === 'video' ? 'play' : 'zoom-in'}"/></svg>
          </div>
        </div>
      </div>
    `;

    // Survol ou focus clavier : la vidéo démarre ; sortie : retour au début.
    const video = card.querySelector('video');
    if (video) {
      const start = () => { video.play().catch(() => {}); };
      const stop = () => { video.pause(); video.currentTime = 0; };
      card.addEventListener('mouseenter', start);
      card.addEventListener('focus', start);
      card.addEventListener('mouseleave', stop);
      card.addEventListener('blur', stop);
    }

    card.addEventListener('click', () => { openLightbox(list, index % list.length); });
    return card;
  }

  function renderTrack(track, items) {
    track.innerHTML = '';
    
    // Premier groupe
    const group1 = document.createElement('div');
    group1.className = 'curved-track-group';
    items.forEach((item, i) => {
      group1.appendChild(createCard(item, i, items, false));
    });

    // Deuxième groupe dupliqué pour la boucle infinie continue 100% fluide
    const group2 = document.createElement('div');
    group2.className = 'curved-track-group';
    group2.setAttribute('aria-hidden', 'true');
    items.forEach((item, i) => {
      group2.appendChild(createCard(item, i + items.length, items, true));
    });

    track.appendChild(group1);
    track.appendChild(group2);
  }

  // Distribution équilibrée (12 items par ligne)
  const balancedSecondHalf = secondHalf.concat(allItems.slice(0, 1));

  renderTrack(track1, firstHalf);
  renderTrack(track2, balancedSecondHalf);
}

/* =========================================================
   5. EDITORIAL SCRAPBOOK PAPER STACK TARIFS
   ========================================================= */
const allPricingPackages = [
  {
    id: "trad-classique",
    category: "traditional",
    name: "Classique",
    docNum: "TECH-NOTE #01",
    subtitle: "Mariage Traditionnel Baoulé & CI",
    price: "300.000 FCFA",
    featured: false,
    image: "assets/vales-marie-10.webp",
    tilt: "-2.5deg",
    features: [
      "1 Photographe Dédié Pro",
      "1 Cadreur Vidéo Dédié HD",
      "Film Complet & Teaser Réseaux",
      "+250 Photos Retouchées HD"
    ]
  },
  {
    id: "trad-luxe",
    category: "traditional",
    name: "Formule Luxe",
    docNum: "TECH-NOTE #02",
    subtitle: "Mariage Traditionnel Prestige",
    price: "400.000 FCFA",
    featured: true,
    image: "assets/vales-marie-12.webp",
    tilt: "2.8deg",
    features: [
      "1 Photographe Dédié Pro",
      "1 Cadreur Vidéo Dédié HD",
      "Livre Photo Prestige 100 Pages",
      "+300 Photos Retouchées HD"
    ]
  },
  {
    id: "trad-premium",
    category: "traditional",
    name: "Formule Premium",
    docNum: "TECH-NOTE #03",
    subtitle: "Mariage Traditionnel Excellence",
    price: "500.000 FCFA",
    featured: false,
    image: "assets/vales-marie-11.webp",
    tilt: "-1.8deg",
    features: [
      "2 Photographes Dédiés Pros",
      "2 Cadreurs Vidéo Pros HD/4K",
      "Livre Photo Prestige 100 Pages",
      "Film Complet & Teaser 4K"
    ]
  },
  {
    id: "civil-classique",
    category: "modern",
    name: "Civil Classique",
    docNum: "TECH-NOTE #04",
    subtitle: "Mariage Civil Hôtel Communal",
    price: "350.000 FCFA",
    featured: false,
    image: "assets/kerozen-civil-20.webp",
    tilt: "1.5deg",
    features: [
      "1 Photographe Dédié Pro",
      "1 Cadreur Vidéo Dédié HD",
      "Film Cérémonie & Soirée",
      "+300 Photos Retouchées HD"
    ]
  },
  {
    id: "civil-luxe",
    category: "modern",
    name: "Civil Luxe Drone 4K",
    docNum: "TECH-NOTE #05",
    subtitle: "Mariage Civil & Soirée Gala",
    price: "500.000 FCFA",
    featured: true,
    image: "assets/kerozen-civil-21.webp",
    tilt: "-3.2deg",
    features: [
      "1 Droniste 4K Certifié Inclus",
      "1 Photographe Dédié Pro",
      "Livre Photo Prestige 100 Pages",
      "Film Complet & Teaser 4K"
    ]
  },
  {
    id: "civil-premium",
    category: "modern",
    name: "Pack Ultime",
    docNum: "TECH-NOTE #06",
    subtitle: "Couverture Totale VIP 2 Jours",
    price: "600.000 FCFA",
    featured: false,
    image: "assets/vales-marie-13.webp",
    tilt: "2.2deg",
    features: [
      "1 Droniste 4K Certifié Inclus",
      "2 Photographes Dédiés Pros",
      "2 Cadreurs Vidéo Pros HD/4K",
      "Livre Photo Prestige 100 Pages"
    ]
  }
];

function initScrapbookPaperTarifs() {
  const stage = document.getElementById('paperStackStage');
  if (!stage) return;
  stage.innerHTML = '';

  allPricingPackages.forEach((pack, index) => {
    const card = document.createElement('article');
    card.className = `paper-card ${pack.featured ? 'featured-paper' : ''}`;
    card.setAttribute('data-index', index);
    card.setAttribute('aria-label', `${pack.name} - ${pack.subtitle} - ${pack.price}`);
    card.tabIndex = 0;
    card.style.setProperty('--tilt', pack.tilt);
    card.innerHTML = `
      <div>
        <div class="paper-card-header">
          <div>
            <h3 class="paper-card-title">${pack.name}</h3>
            <div class="paper-card-sub">${pack.subtitle}</div>
          </div>
          <div class="paper-doc-num">${pack.docNum}</div>
        </div>
        <div class="paper-photo-cutout">
          <img src="${pack.image}" alt="" class="paper-photo-img" loading="lazy" decoding="async">
        </div>
        <ul class="paper-specs-list">
          ${pack.features.map(feat => `
            <li class="paper-spec-item">
              <svg class="icon" aria-hidden="true" focusable="false"><use href="#i-check-square"/></svg> <span>${feat}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="paper-card-footer">
        <div>
          <div class="paper-price-label">Tarif Officiel</div>
          <div class="paper-price-val">${pack.price}</div>
        </div>
      </div>
    `;

    // Survol / focus clavier : la fiche passe au premier plan.
    // Clic / tap : on épingle la fiche (utile sur mobile, sans survol).
    const raise = () => card.classList.add('is-raised');
    const lower = () => card.classList.remove('is-raised');
    card.addEventListener('mouseenter', raise);
    card.addEventListener('mouseleave', lower);
    card.addEventListener('focus', raise);
    card.addEventListener('blur', lower);
    card.addEventListener('click', () => {
      const wasPinned = card.classList.contains('is-pinned');
      stage.querySelectorAll('.paper-card.is-pinned').forEach(c => c.classList.remove('is-pinned'));
      if (!wasPinned) card.classList.add('is-pinned');
    });
    stage.appendChild(card);
  });
}

/* =========================================================
   6. TÉMOIGNAGES ("Ils nous ont fait confiance")
   ---------------------------------------------------------
   Remplacer les entrées ci-dessous par de vrais témoignages
   clients : { quote, name, event, placeholder: false }.
   Tant que placeholder vaut true, la carte porte la mention
   "Exemple" pour ne pas être prise pour un vrai avis.
   ========================================================= */
const testimonialsData = [
  {
    quote: "Votre témoignage apparaîtra ici. Quelques phrases sur l'ambiance du jour J, la qualité des photos et du film, et ce que vous avez ressenti en les découvrant.",
    name: "Prénom N.",
    event: "Mariage traditionnel · Abidjan",
    placeholder: true
  },
  {
    quote: "Votre témoignage apparaîtra ici. Un mot sur l'équipe, la discrétion pendant la cérémonie et les délais de livraison.",
    name: "Prénom N.",
    event: "Mariage civil · Hôtel communal",
    placeholder: true
  },
  {
    quote: "Votre témoignage apparaîtra ici. Le ressenti d'un organisateur d'événement culturel ou d'une soutenance capturée par BFG Moment.",
    name: "Prénom N.",
    event: "Événement culturel · MASA",
    placeholder: true
  }
];

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const starSvg = '<svg class="icon icon-fill" aria-hidden="true" focusable="false"><use href="#i-star"/></svg>';
  testimonialsData.forEach((item) => {
    const card = document.createElement('article');
    card.className = `testimonial-card ${item.placeholder ? 'is-placeholder' : ''}`;
    card.innerHTML = `
      ${item.placeholder ? '<span class="testimonial-placeholder-tag">Exemple</span>' : ''}
      <svg class="icon testimonial-quote" aria-hidden="true" focusable="false"><use href="#i-quote"/></svg>
      <div class="testimonial-stars" role="img" aria-label="Note : 5 étoiles sur 5">${starSvg.repeat(5)}</div>
      <blockquote class="testimonial-text"><p>${item.quote}</p></blockquote>
      <footer class="testimonial-meta">
        <span class="testimonial-name">${item.name}</span>
        <span class="testimonial-event">${item.event}</span>
      </footer>
    `;
    grid.appendChild(card);
  });
}

/* =========================================================
   7. DIRECT BOOKING FORM & WHATSAPP INTEGRATION
   ========================================================= */
function initBooking() {
  const bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = (document.getElementById('firstNameInput')?.value || '').trim();
    const lastName = (document.getElementById('lastNameInput')?.value || '').trim();
    const fullName = `${firstName} ${lastName}`.trim() || 'Client BFG';
    const email = (document.getElementById('emailInput')?.value || '').trim();
    const phone = (document.getElementById('phoneInput')?.value || '').trim();

    const checkedServices = Array.from(
      document.querySelectorAll('input[name="servicesWanted"]:checked')
    ).map(cb => cb.value).join(', ');

    const service = document.getElementById('serviceSelect')?.value || 'Mariage';
    const date = document.getElementById('dateInput')?.value || 'À définir';
    const location = (document.getElementById('locationInput')?.value || '').trim();
    const message = (document.getElementById('messageInput')?.value || '').trim();

    // Format WhatsApp message
    const whatsappText = `*NOUVELLE DEMANDE DE PROJET - BFG MOMENT*%0A%0A` +
      `👤 *Nom complet* : ${encodeURIComponent(fullName)}%0A` +
      `✉️ *Email* : ${encodeURIComponent(email)}%0A` +
      `📞 *Téléphone / WhatsApp* : ${encodeURIComponent(phone)}%0A` +
      `💍 *Type d'événement* : ${encodeURIComponent(service)}%0A` +
      `📅 *Date prévue* : ${encodeURIComponent(date)}%0A` +
      `📍 *Lieu / Ville* : ${encodeURIComponent(location)}%0A` +
      `✨ *Prestations souhaitées* : ${encodeURIComponent(checkedServices || 'Non spécifié')}%0A` +
      `💬 *Détails du projet* :%0A${encodeURIComponent(message)}`;

    // Official BFG Moment WhatsApp number: +225 0767660476
    const whatsappUrl = `https://wa.me/2250767660476?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank');
  });
}
