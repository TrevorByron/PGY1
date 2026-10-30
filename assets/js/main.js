/* ── How It Works — scroll-triggered animation (supports multiple .steps-wrapper regions, e.g. client-preview) ── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const previewEmbedded = document.querySelector('#layout-embedded .steps-wrapper');
  const previewModal = document.querySelector('#layout-modal .steps-wrapper');

  const toInit = [];
  if (previewEmbedded) toInit.push(previewEmbedded);
  if (previewModal) toInit.push(previewModal);
  if (!toInit.length) {
    const w = document.querySelector('.steps-wrapper');
    if (w) toInit.push(w);
  }

  toInit.forEach((wrapper) => {
    const nodeWraps = wrapper.querySelectorAll('.sc-node-wrap');
    const cards = wrapper.querySelectorAll('.step-card');
    if (nodeWraps.length < 3 || cards.length < 3) return;

    let fired = false;

    function run() {
      if (fired) return;
      fired = true;
      const delays = [600, 1400, 2200];
      delays.forEach((delay, i) => {
        setTimeout(() => {
          if (nodeWraps[i]) nodeWraps[i].classList.add('is-active');
          if (cards[i]) cards[i].classList.add('is-visible');
        }, delay);
      });
    }

    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) run();
    }, { threshold: 0.25 }).observe(wrapper);
  });
})();

/* ── Hero parallax ── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 860px)').matches) return;

  function activeHeroEl () {
    return (
      document.querySelector('#layout-modal:not([hidden]) .hero') ||
      document.querySelector('#layout-embedded:not([hidden]) .hero') ||
      document.querySelector('.hero')
    );
  }

  let raf = null;

  function tick () {
    const scrollY = window.scrollY;
    const hero = activeHeroEl();
    const qMark = document.querySelector('.header-and-questionnaire .questionnaire-page .hero-watermark--questionnaire');

    if (hero) {
      const photo = hero.querySelector('.photo-card img');
      const card1 = hero.querySelector('.float-card-1');
      const card2 = hero.querySelector('.float-card-2');
      const card3 = hero.querySelector('.float-card-3');
      const mark  = hero.querySelector('.hero-watermark');

      const heroH = hero.offsetTop + hero.offsetHeight;
      if (scrollY > heroH) { raf = null; return; }

      if (qMark) qMark.style.transform = '';
      if (photo) photo.style.transform = `scale(1.12) translateY(${scrollY * 0.09}px)`;
      if (card1) card1.style.transform = `translateY(${scrollY * -0.11}px)`;
      if (card2) card2.style.transform = `translateY(${scrollY * 0.14}px)`;
      if (card3) card3.style.transform = `translateY(${scrollY * -0.07}px)`;
      if (mark)  mark.style.transform  = `translateY(${scrollY * 0.05}px) rotate(${scrollY * 0.008}deg)`;

      raf = null;
      return;
    }

    if (qMark) {
      const qPage = qMark.closest('.questionnaire-page');
      if (qPage) {
        const end = qPage.offsetTop + qPage.offsetHeight;
        if (scrollY > end) { raf = null; return; }
      }
      qMark.style.transform = `translateY(${scrollY * 0.05}px) rotate(${scrollY * 0.008}deg)`;
    }

    raf = null;
  }

  window.addEventListener('scroll', function () {
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });

  tick();
})();

/* ── In-page anchor scrolling with sticky-nav offset ── */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getNavOffset() {
    const nav = document.querySelector('nav');
    return nav ? nav.offsetHeight + 12 : 0;
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  }

  function scrollToTarget(hash) {
    const id = hash.slice(1);
    if (!id) {
      scrollToTop();
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    const y = target.getBoundingClientRect().top + window.scrollY - getNavOffset();
    window.scrollTo({
      top: Math.max(0, y),
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    event.preventDefault();
    scrollToTarget(href);
  });

  if (window.location.hash) {
    window.addEventListener('load', function () {
      scrollToTarget(window.location.hash);
    });
  }
})();

/* ── Nav: switch between dark glass and light paper depending on the section underneath ── */
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const DARK = '.header-and-questionnaire, .qa-hero, .section-dark, .cta-section:not(.cta-section--light), .qa-cta-band, footer';
  const logo = nav.querySelector('.nav-logo-primary > img');
  const srcDark = logo && logo.getAttribute('src');
  const srcLight = srcDark && srcDark.replace('horizontal-logo.svg', 'horizontal-logo-light.svg');
  if (srcLight) new Image().src = srcLight;
  let ticking = false;
  let current = null;
  function update() {
    ticking = false;
    const r = nav.getBoundingClientRect();
    const y = r.top + r.height / 2;
    let dark = false;
    document.querySelectorAll(DARK).forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.top <= y && b.bottom >= y) dark = true;
    });
    if (dark === current) return;
    current = dark;
    nav.classList.toggle('nav--on-dark', dark);
    nav.classList.toggle('nav--on-light', !dark);
    if (logo && srcLight) logo.setAttribute('src', dark ? srcLight : srcDark);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

/* ── Conversion events (Vercel Web Analytics custom events; recorded on Pro/Enterprise plans, ignored otherwise) ── */
(function () {
  function track(name, data) {
    try { if (typeof window.va === 'function') window.va('event', { name: name, data: data }); } catch (e) { /* never block a click */ }
  }
  window.pgy1Track = track;
  function where(el) {
    const s = el.closest('section[id], header[id], nav, footer, aside, .qa-cta-band, .cta-section, .gsi-card');
    if (!s) return 'page';
    if (s.id) return s.id;
    return s.tagName.toLowerCase() === 'nav' ? 'nav' : s.tagName.toLowerCase() === 'footer' ? 'footer' : (s.className.split(' ')[0] || 'page');
  }
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const page = location.pathname;
    if (href.includes('questionnaire-embed')) track('Questionnaire CTA', { page: page, place: where(a) });
    else if (href.startsWith('tel:')) track('Call click', { page: page, place: where(a) });
    else if (href.startsWith('mailto:')) track('Email click', { page: page, place: where(a) });
  });
})();
