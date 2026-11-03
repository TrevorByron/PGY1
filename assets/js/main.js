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

/* ── Mobile menu: a menu button next to the CTA opens the site links below the bar (≤1140px, where the text links hide) ── */
(function () {
  const nav = document.querySelector('nav');
  const right = nav && nav.querySelector('.nav-right');
  if (!right || nav.querySelector('.nav-toggle')) return;
  const LINKS = [
    ['/', 'Home'],
    ['/about/', 'About Jay'],
    ['/gsi/', 'GSI lookup'],
    ['/questions/', 'Questions'],
    ['/match-day-checklist/', 'Match Day checklist'],
    ['/life-insurance/', 'Life insurance'],
  ];
  const here = location.pathname.replace(/index\.html$/, '');
  const menu = document.createElement('div');
  menu.className = 'nav-menu';
  menu.id = 'nav-menu';
  menu.hidden = true;
  menu.innerHTML = LINKS.map(([href, label]) => {
    const cur = href === '/' ? here === '/' : here.startsWith(href);
    return `<a href="${href}"${cur ? ' aria-current="page"' : ''}>${label}</a>`;
  }).join('') +
    '<div class="nav-menu__foot"><a href="tel:+16094328862" class="nav-menu__tel">(609) 432-8862</a>' +
    '<a href="mailto:jay@pgy1.com" class="nav-menu__tel">jay@pgy1.com</a></div>';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-controls', 'nav-menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  right.appendChild(btn);
  nav.appendChild(menu);
  function set(open) {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    nav.classList.toggle('nav--menu-open', open);
  }
  btn.addEventListener('click', (e) => { e.stopPropagation(); set(menu.hidden); });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('click', (e) => { if (!menu.hidden && !nav.contains(e.target)) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
  window.addEventListener('resize', () => { if (window.innerWidth > 1140 && !menu.hidden) set(false); });
})();

/* ── Zite form fallback ──
   Some networks (hospitals, offices) block zite.so or fillout.com. The embed then spins forever.
   If the form hasn't reported loaded after 10s, show a way to reach Jay instead.
   "Loaded" = Fillout hides its own .fillout-embed-loading spinner. No spinner at all = script blocked. */
(function () {
  const hosts = document.querySelectorAll('[data-zite-id]');
  if (!hosts.length) return;
  const WAIT = 10000;
  const PHONE = '(609) 432-8862', TEL = '+16094328862', EMAIL = 'jay@pgy1.com';

  function loaded(host) {
    const spin = host.querySelector('.fillout-embed-loading');
    return !!spin && getComputedStyle(spin).display === 'none';
  }

  hosts.forEach((host) => {
    const id = host.getAttribute('data-zite-id');
    let box = null, poll = null;

    function show() {
      if (box || loaded(host)) return;
      box = document.createElement('div');
      box.className = 'form-fallback';
      box.setAttribute('role', 'status');
      box.innerHTML =
        '<p class="form-fallback__title">The form is taking a while to load.</p>' +
        '<p>Some hospital and work networks block it. You can <a href="https://' + id + '.zite.so/" target="_blank" rel="noopener">open the form in a new tab</a>, ' +
        'try again on your phone, or reach Jay directly.</p>' +
        '<p class="form-fallback__contact"><a href="tel:' + TEL + '">Call ' + PHONE + '</a>' +
        '<a href="mailto:' + EMAIL + '">Email ' + EMAIL + '</a></p>';
      host.parentNode.insertBefore(box, host);
      host.classList.add('is-stalled');
      // Keep watching. If the form shows up late, put things back.
      poll = setInterval(() => {
        if (loaded(host)) { clearInterval(poll); box.remove(); box = null; host.classList.remove('is-stalled'); }
      }, 1000);
    }

    setTimeout(show, WAIT);
  });
})();
