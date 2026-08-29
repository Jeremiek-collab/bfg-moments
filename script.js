/* =========================================================
   BFG MOMENT - Showcase Engine with HD 3D Curved Portfolio
   & Editorial Scrapbook Collage Tarifs
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Scroll & Minimalist Burger Overlay Nav
  initBurgerNav();
  
  // Initialize Hero Video Background Controls (vid1.mp4) & Full Badge Fade Loop
  initHeroVideo();

  // Initialize Lightbox Modal Handlers (Close on X, Background Click, Escape Key)
  initLightbox();
  
  // Initialize 3D Curved Perspective Portfolio (Ultra Crisp HD & Hover Video)
  init3DCurvedPortfolio();
  
  // Initialize Editorial Scrapbook Paper Stack Tarifs (Matching Reference Photos)
  initScrapbookPaperTarifs();
  
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
      document.body.style.overflow = 'hidden';
    });
  }

  function closeOverlay() {
    if (navOverlay) {
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
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
   2. HERO VIDEO & COMPLETE BADGE + TEXT DISAPPEARANCE / REAPPEARANCE
   ========================================================= */
function initHeroVideo() {
  const heroVideo = document.getElementById('heroBgVideo');
  const muteBtn = document.getElementById('btnMuteUnmute');
  const catchwordBadge = document.querySelector('.catchword-badge');
  const catchwordEl = document.querySelector('.single-catchword');

  if (heroVideo) {
    heroVideo.muted = true;
    const startPlay = () => { heroVideo.play().catch(() => {}); };
    startPlay();

    document.addEventListener('touchstart', startPlay, { once: true });
    document.addEventListener('click', startPlay, { once: true });
    document.addEventListener('scroll', startPlay, { once: true });
  }

  if (muteBtn && heroVideo) {
    muteBtn.addEventListener('click', () => {
      if (heroVideo.muted) {
        heroVideo.muted = false;
        muteBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
      } else {
        heroVideo.muted = true;
        muteBtn.innerHTML = '<i class="fa fa-volume-off"></i>';
      }
    });
  }

  if (catchwordBadge && catchwordEl) {
    const words = ["IMMORTALISER", "ÉMOTION", "CINÉMA", "PASSION"];
    let wordIdx = 0;

    setTimeout(cycleNextWord, 2500);

    function cycleNextWord() {
      catchwordBadge.style.opacity = '0';
      catchwordBadge.style.transform = 'translateY(12px)';

      setTimeout(() => {
        wordIdx = (wordIdx + 1) % words.length;
        catchwordEl.innerText = words[wordIdx];

        catchwordBadge.style.opacity = '1';
        catchwordBadge.style.transform = 'translateY(0)';

        setTimeout(cycleNextWord, 2500);
      }, 4500);
    }
  }
}

/* =========================================================
   3. LIGHTBOX MODAL HANDLER
   ========================================================= */
function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const closeBtn = document.querySelector('.lightbox-close');
  const mediaContainer = document.querySelector('.lightbox-media-container');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    if (mediaContainer) {
      const vid = mediaContainer.querySelector('video');
      if (vid) {
        vid.pause();
        vid.src = '';
      }
      mediaContainer.innerHTML = '';
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

/* =========================================================
   4. NOS RÉALISATIONS - 3D CURVED PERSPECTIVE CAROUSEL
   ========================================================= */
const portfolio23Dataset = [
  { type: "video", src: "assets/video-ghana.mp4", category: "video", title: "Quand 2 cultures s'unissent", subtitle: "Ghana x CI", pill: "CINÉMA VIDEO" },
  { type: "video", src: "assets/video-baoule.mp4", category: "video", title: "Love All Day - Baoulé", subtitle: "Traditionnel", pill: "CINÉMA VIDEO" },
  { type: "image", src: "assets/vales-marie-10.jpg", category: "mariage-trad", title: "Vales & Marie 1", subtitle: "Mariage Baoulé", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/vales-marie-11.jpg", category: "mariage-trad", title: "Moments d'Émotion", subtitle: "Vales & Marie", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/vales-marie-12.jpg", category: "mariage-trad", title: "Élégance Baoulé", subtitle: "Mariage Trad", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/kerozen-civil-20.jpg", category: "mariage-civil", title: "Couple KEROZEN", subtitle: "Mariage Civil", pill: "MARIAGE CIVIL" },
  { type: "image", src: "assets/kerozen-civil-21.jpg", category: "mariage-civil", title: "Hôtel Communal", subtitle: "Mariage Civil", pill: "MARIAGE CIVIL" },
  { type: "image", src: "assets/masa-culture-1.jpg", category: "evenement", title: "MASA - Ebinto", subtitle: "Abidjan", pill: "MASA 2026" },
  { type: "image", src: "assets/masa-culture-2.jpg", category: "evenement", title: "MASA - Performance", subtitle: "Spectacle", pill: "MASA 2026" },
  { type: "image", src: "assets/soutenance-jennifer-8.jpg", category: "soutenance", title: "Dr. Jennifer 1", subtitle: "CHU Cocody", pill: "SOUTENANCE" },
  { type: "image", src: "assets/soutenance-jennifer-9.jpg", category: "soutenance", title: "Dr. Jennifer 2", subtitle: "CHU Cocody", pill: "SOUTENANCE" },
  { type: "image", src: "assets/qitaa-concert-3.jpg", category: "evenement", title: "QITAA 2025 Live 1", subtitle: "Concert", pill: "SPECTACLE" },
  { type: "image", src: "assets/qitaa-concert-4.jpg", category: "evenement", title: "QITAA 2025 Live 2", subtitle: "Concert", pill: "SPECTACLE" },
  { type: "image", src: "assets/qitaa-concert-5.jpg", category: "evenement", title: "QITAA 2025 Live 3", subtitle: "Concert", pill: "SPECTACLE" },
  { type: "image", src: "assets/qitaa-concert-6.jpg", category: "evenement", title: "QITAA 2025 Live 4", subtitle: "Concert", pill: "SPECTACLE" },
  { type: "image", src: "assets/abissa-esma-22.jpg", category: "evenement", title: "Abissa ESMA 1", subtitle: "Festival", pill: "ABISSA" },
  { type: "image", src: "assets/abissa-esma-23.jpg", category: "evenement", title: "Abissa ESMA 2", subtitle: "Festival", pill: "ABISSA" },
  { type: "image", src: "assets/vales-marie-13.jpg", category: "mariage-trad", title: "Vales & Marie 4", subtitle: "Mariage Trad", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/vales-marie-14.jpg", category: "mariage-trad", title: "Vales & Marie 5", subtitle: "Mariage Trad", pill: "MARIAGE TRAD" },
  { type: "image", src: "assets/media-15.jpg", category: "evenement", title: "MASA 2024 Scène 1", subtitle: "Abidjan", pill: "MASA 2024" },
  { type: "image", src: "assets/media-16.jpg", category: "evenement", title: "MASA 2024 Scène 2", subtitle: "Abidjan", pill: "MASA 2024" },
  { type: "image", src: "assets/media-17.jpg", category: "evenement", title: "MASA 2024 Scène 3", subtitle: "Abidjan", pill: "MASA 2024" },
  { type: "video", src: "assets/hero-showreel.mp4", category: "video", title: "BFG Showreel 2026", subtitle: "Best Of Video", pill: "SHOWREEL" }
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

  function createCard(item, index) {
    const card = document.createElement('div');
    card.className = 'hd-curved-card';
    card.setAttribute('data-index', index);

    const imgSrc = item.type === 'video' ? 'assets/vales-marie-10.jpg' : item.src;

    card.innerHTML = `
      <img src="${imgSrc}" alt="${item.title}" class="hd-card-media">
      ${item.type === 'video' ? `
        <video src="${item.src}" loop muted playsinline class="hd-card-video"></video>
      ` : ''}
      <div class="hd-card-overlay">
        <span class="hd-tag-pill">${item.pill}</span>
        <div class="hd-card-info">
          <div>
            <div class="hd-card-title">${item.title}</div>
            <div class="hd-card-sub">${item.subtitle}</div>
          </div>
          <div class="hd-play-circle">
            <i class="fa ${item.type === 'video' ? 'fa-play' : 'fa-search-plus'}"></i>
          </div>
        </div>
      </div>
    `;

    const video = card.querySelector('video');
    if (video) {
      card.addEventListener('mouseenter', () => { video.play().catch(() => {}); });
      card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    }

    card.addEventListener('click', () => { openLightboxFromCurved(item); });
    return card;
  }

  function renderTrack(track, items) {
    track.innerHTML = '';
    
    // Premier groupe
    const group1 = document.createElement('div');
    group1.className = 'curved-track-group';
    items.forEach((item, i) => {
      group1.appendChild(createCard(item, i));
    });

    // Deuxième groupe dupliqué pour la boucle infinie continue 100% fluide
    const group2 = document.createElement('div');
    group2.className = 'curved-track-group';
    group2.setAttribute('aria-hidden', 'true');
    items.forEach((item, i) => {
      group2.appendChild(createCard(item, i + items.length));
    });

    track.appendChild(group1);
    track.appendChild(group2);
  }

  // Distribution équilibrée (12 items par ligne)
  const balancedSecondHalf = secondHalf.concat(allItems.slice(0, 1));

  renderTrack(track1, firstHalf);
  renderTrack(track2, balancedSecondHalf);
}

function openLightboxFromCurved(item) {
  const lightbox = document.getElementById('lightboxModal');
  const mediaContainer = document.querySelector('.lightbox-media-container');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxDesc = document.querySelector('.lightbox-desc');

  if (!lightbox || !mediaContainer) return;

  mediaContainer.innerHTML = '';

  if (item.type === 'video') {
    const vid = document.createElement('video');
    vid.src = item.src;
    vid.controls = true;
    vid.autoplay = true;
    vid.style.maxWidth = '100%';
    vid.style.maxHeight = '75vh';
    mediaContainer.appendChild(vid);
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '75vh';
    mediaContainer.appendChild(img);
  }

  if (lightboxTitle) lightboxTitle.innerText = item.title;
  if (lightboxDesc) lightboxDesc.innerText = `${item.pill} - ${item.subtitle}`;

  lightbox.classList.add('active');
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
    image: "assets/vales-marie-10.jpg",
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
    image: "assets/vales-marie-12.jpg",
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
    image: "assets/vales-marie-11.jpg",
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
    image: "assets/kerozen-civil-20.jpg",
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
    image: "assets/kerozen-civil-21.jpg",
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
    image: "assets/vales-marie-13.jpg",
    tilt: "2.2deg",
    features: [
      "1 Droniste 4K Certifié Inclus",
      "2 Photographes Dédiés Pros",
      "2 Cadreurs Vidéo Pros HD/4K",
      "Livre Photo Prestige 100 Pages"
    ]
  }
];

let filteredScrapbookList = [...allPricingPackages];

function initScrapbookPaperTarifs() {
  const stage = document.getElementById('paperStackStage');
  const tabBtns = document.querySelectorAll('.pricing-tabs-wrapper .p-tab-btn');

  if (!stage) return;

  // Filter Tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-tab');
      if (targetCategory === 'all') {
        filteredScrapbookList = [...allPricingPackages];
      } else {
        filteredScrapbookList = allPricingPackages.filter(p => p.category === targetCategory);
      }

      renderPaperStack();
    });
  });

  renderPaperStack();
}

function renderPaperStack() {
  const stage = document.getElementById('paperStackStage');
  if (!stage) return;

  stage.innerHTML = '';

  filteredScrapbookList.forEach((pack, index) => {
    const card = document.createElement('div');
    card.className = `paper-card ${pack.featured ? 'featured-paper' : ''}`;
    card.setAttribute('data-index', index);
    card.style.transform = `rotate(${pack.tilt})`;

    card.innerHTML = `
      <div>
        <div class="paper-card-header">
          <div>
            <div class="paper-card-title">${pack.name}</div>
            <div class="paper-card-sub">${pack.subtitle}</div>
          </div>
          <div class="paper-doc-num">${pack.docNum}</div>
        </div>

        <div class="paper-photo-cutout">
          <img src="${pack.image}" alt="${pack.name}" class="paper-photo-img">
        </div>

        <div class="paper-specs-list">
          ${pack.features.map(feat => `
            <div class="paper-spec-item">
              <i class="fa fa-check-square-o"></i> <span>${feat}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="paper-card-footer">
        <div>
          <div class="paper-price-label">Tarif Officiel</div>
          <div class="paper-price-val">${pack.price}</div>
        </div>
      </div>
    `;

    // Interactive Paper Hover & Elevate Effect
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '50';
      card.style.transform = 'rotate(0deg) scale(1.05)';
      card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.25)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '1';
      card.style.transform = `rotate(${pack.tilt})`;
      card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    });

    stage.appendChild(card);
  });
}



function preselectPack(packName) {
  const serviceSelect = document.getElementById('serviceSelect');
  if (serviceSelect) {
    serviceSelect.value = packName.toLowerCase().includes('civil') ? 'Mariage Civil' : 'Mariage Traditionnel';
  }
  const messageInput = document.getElementById('messageInput');
  if (messageInput) {
    messageInput.value = `Bonjour BFG MOMENT, je souhaite réserver la formule : ${packName}. Merci de me recontacter !`;
  }
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
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
