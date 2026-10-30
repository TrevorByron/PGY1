/* GSI hospital lookup (/gsi/). Data: window.GSI_HOSPITALS, built from data/gsi-hospitals.csv.
   Each row: id, d (display name), y (health system), n (Jay's original name), st (states), a (aliases). */
(function () {
  const H = window.GSI_HOSPITALS || [];
  const result = document.getElementById('gsi-result');           // present only on /gsi/
  const form = document.querySelector(result ? '.gsi-hero .gsi-search' : '.gsi-home .gsi-search');
  if (!form || !H.length) return;
  const input = form.querySelector('input');
  let list = form.querySelector('.gsi-options');
  if (!list) {                                                      // homepage: add the dropdown
    list = document.createElement('ul');
    list.className = 'gsi-options';
    list.id = 'gsi-options-home';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    form.appendChild(list);
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
  }

  const STATE_NAMES = { AL: 'Alabama', AR: 'Arkansas', AZ: 'Arizona', CA: 'California', CT: 'Connecticut', DC: 'Washington, DC', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', IL: 'Illinois', IN: 'Indiana', KY: 'Kentucky', LA: 'Louisiana', MA: 'Massachusetts', MD: 'Maryland', ME: 'Maine', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', MS: 'Mississippi', NC: 'North Carolina', NE: 'Nebraska', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NV: 'Nevada', NY: 'New York', OH: 'Ohio', OK: 'Oklahoma', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', TN: 'Tennessee', TX: 'Texas', VA: 'Virginia', VT: 'Vermont', WA: 'Washington', WI: 'Wisconsin' };
  const STOP = new Set(['the', 'of', 'at', 'and', 'for', 'in', 'hospital', 'medical', 'center', 'centre', 'health', 'university', 'med', 'ctr', 'system', 'residency', 'program']);

  /* ── Matching ─────────────────────────────────────── */
  function norm(s) {
    return s.toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/\bsaint\b/g, 'st').replace(/\bst\./g, 'st')
      .replace(/\bmount\b/g, 'mt').replace(/\bmt\./g, 'mt')
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
  function toks(s) { return norm(s).split(' ').filter(Boolean); }
  function near(a, b) { // within one edit: "vanderbuilt", "presbyterain"
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else if (a[i + 1] === b[j] && a[i] === b[j + 1]) { i += 2; j += 2; }
      else { i++; j++; }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  }
  const IDX = H.map((h) => ({
    h,
    nameT: toks(h.d + ' ' + h.y + ' ' + h.n),
    aliasT: toks(h.a.join(' ') + ' ' + h.st.map((s) => STATE_NAMES[s] + ' ' + s).join(' ')),
    aliasStr: h.a.map(norm),
    full: norm(h.d),
  }));
  let lastScores = [];
  function score(q) {
    const nq = norm(q);
    let qt = toks(q);
    if (!qt.length) return [];
    const meaningful = qt.filter((t) => !STOP.has(t));
    if (meaningful.length) qt = meaningful;
    const out = [];
    IDX.forEach((e) => {
      let s = 0;
      for (const t of qt) {
        const inName = e.nameT.includes(t) ? 3 : e.nameT.some((w) => w.startsWith(t)) ? 2 : 0;
        const inAlias = e.aliasT.includes(t) ? 2 : e.aliasT.some((w) => w.startsWith(t) && t.length > 1) ? 1 : 0;
        let best = Math.max(inName, inAlias);
        if (!best && t.length >= 5 && (e.nameT.some((w) => near(w, t)) || e.aliasT.some((w) => near(w, t)))) best = 1;
        if (!best) return;
        s += best;
      }
      if (e.aliasStr.includes(nq)) s += 6;
      if (e.full.startsWith(nq)) s += 4;
      else if (e.full.includes(nq)) s += 2;
      out.push({ e, s });
    });
    out.sort((a, b) => b.s - a.s || a.e.h.d.localeCompare(b.e.h.d));
    lastScores = out.map((o) => o.s);
    return out.map((o) => o.e.h);
  }
  window.__gsiScore = score;

  /* ── Homepage: dropdown, then "Check" opens the lookup page ── */
  if (!result) {
    const escH = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const whereH = (h) => h.st.map((st) => STATE_NAMES[st]).join(', ');
    let opts = [], act = -1, chosen = null;
    const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); };
    const mark = (i) => { act = i; [...list.children].forEach((li, k) => li.classList.toggle('is-active', k === i)); };
    const choose = (h) => { chosen = h; input.value = h.d; form.classList.add('is-picked'); close(); form.querySelector('button[type=submit]').focus(); };
    input.addEventListener('input', () => {
      chosen = null; form.classList.remove('is-picked');
      opts = input.value.trim() ? score(input.value).slice(0, 6) : []; act = -1;
      if (!opts.length) { close(); return; }
      list.innerHTML = opts.map((h, i) => `<li role="option" data-i="${i}"><span class="gsi-opt__name">${escH(h.d)}</span><span class="gsi-opt__meta">${h.y ? escH(h.y) + ' · ' : ''}${escH(whereH(h))}</span></li>`).join('');
      list.hidden = false; input.setAttribute('aria-expanded', 'true');
    });
    input.addEventListener('keydown', (ev) => {
      if (list.hidden) return;
      if (ev.key === 'ArrowDown') { ev.preventDefault(); mark(Math.min(act + 1, opts.length - 1)); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); mark(Math.max(act - 1, 0)); }
      else if (ev.key === 'Escape') close();
      else if (ev.key === 'Enter' && act >= 0) { ev.preventDefault(); choose(opts[act]); }
    });
    list.addEventListener('mousedown', (ev) => { const li = ev.target.closest('li[data-i]'); if (!li) return; ev.preventDefault(); choose(opts[+li.dataset.i]); });
    input.addEventListener('blur', () => setTimeout(close, 120));
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const q = input.value.trim();
      if (!q) { input.focus(); return; }
      location.href = chosen && chosen.d === q ? '/gsi/?h=' + chosen.id : '/gsi/?q=' + encodeURIComponent(q);
    });
    return;
  }

  /* ── Rendering ────────────────────────────────────── */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const where = (h) => h.st.map((s) => STATE_NAMES[s]).join(', ');
  const byId = (id) => H.find((o) => o.id === id);

  const intro = document.querySelector('.gsi-intro');
  const checked = document.querySelector('.gsi-checked');
  const profile = document.getElementById('gsi-profile');
  const why = document.querySelector('.gsi-why');
  const baseTitle = document.title;
  const CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const DASH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>';
  const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  const SIDE = (label) =>
    '<aside class="gsi-side"><div class="gsi-side__card">' +
      '<img src="/assets/images/jay-face.jpg" alt="" width="64" height="64" />' +
      '<p class="gsi-side__name">Jay Weinberg, CLU, ChFC</p>' +
      `<p class="gsi-side__label">${label}</p>` +
      '<a class="btn-primary" href="/#questionnaire-embed">Start the questionnaire</a>' +
      '<a class="gsi-side__tel" href="tel:+16094328862">or call (609) 432-8862</a>' +
      '<a class="gsi-side__tel" href="mailto:jay@pgy1.com">jay@pgy1.com</a>' +
    '</div></aside>';

  const INLINE_CTA = '<div class="gsi-inline-cta"><a class="btn-primary" href="/#questionnaire-embed">Start the questionnaire</a><a href="tel:+16094328862">or call Jay at (609) 432-8862</a></div>';

  const CLIP =
    '<section class="gsi-block"><h2>Watch Jay explain GSI</h2>' +
    '<figure class="qa-clip"><video src="/assets/video/what-is-gsi-disability-insurance.mp4" poster="/assets/video/what-is-gsi-disability-insurance.jpg" controls playsinline preload="none" title="Jay Weinberg answers: What is a GSI disability policy?"></video>' +
    '<figcaption class="qa-clip__side"><span class="qa-video__label">What is a GSI disability policy?</span>' +
    '<p>Thirty seconds from his webinar for residents and fellows.</p>' +
    `<a class="qa-link" href="/questions/what-is-gsi-disability-insurance/">Read the full answer ${ARROW}</a></figcaption></figure></section>`;

  function enterProfile(state, title, whereLine, crumb, bodyHtml, url) {
    intro.hidden = true;
    result.hidden = true;
    checked.hidden = false;
    document.getElementById('gsi-status').innerHTML = state;
    document.getElementById('gsi-name').textContent = title;
    document.getElementById('gsi-where').textContent = whereLine;
    document.getElementById('gsi-crumb-state').textContent = crumb;
    profile.innerHTML = bodyHtml;
    profile.hidden = false;
    if (why) why.hidden = true;
    document.title = title + ' GSI disability insurance | PGY1.com';
    history.replaceState(null, '', url);
  }

  function leaveProfile() {
    checked.hidden = true;
    profile.hidden = true;
    profile.innerHTML = '';
    intro.hidden = false;
    if (why) why.hidden = false;
    document.title = baseTitle;
    input.value = '';
    history.replaceState(null, '', '/gsi/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => input.focus(), 250);
  }

  function showProfile(h) {
    const siblings = h.y ? H.filter((o) => o !== h && o.y === h.y) : [];
    const sib = siblings.length
      ? `<section class="gsi-block"><h2>Also on Jay's list from ${esc(h.y)}</h2><ul class="gsi-siblings">` +
        siblings.map((o) => `<li><a href="/gsi/?h=${o.id}" data-id="${o.id}">${esc(o.d)}<span>${esc(where(o))}</span></a></li>`).join('') +
        '</ul></section>'
      : '';
    enterProfile(
      `<span class="gsi-badge is-yes">${CHECK}GSI available</span><span class="gsi-checked__note">Checked against Jay's list</span>`,
      h.d,
      (h.y ? h.y + ' · ' : '') + where(h),
      where(h),
      '<div class="qa-shell gsi-profile-grid"><div class="gsi-profile-main">' +
        '<section class="gsi-block"><h2>At a glance</h2><dl class="gsi-facts">' +
          '<div><dt>Policy</dt><dd>Guardian guaranteed standard issue (GSI)</dd></div>' +
          '<div><dt>Health questions</dt><dd>None</dd></div>' +
          '<div><dt>Who can get it</dt><dd>Residents and fellows in eligible programs</dd></div>' +
          '<div><dt>How long it takes</dt><dd>A few days to a week</dd></div>' +
        '</dl>' +
        '<p class="gsi-warn"><strong>Don\'t apply for any other disability policy first.</strong> Most GSI policies ask whether you\'ve applied before, and if you have, you may not be eligible.</p>' + INLINE_CTA + '</section>' +
        '<section class="gsi-block"><h2>What happens next</h2><ol class="gsi-steps">' +
          '<li><strong>Answer a few questions.</strong> The questionnaire takes about 2 minutes and covers your training, program and current coverage.</li>' +
          `<li><strong>Jay confirms your eligibility.</strong> He checks the GSI against your program and start date.</li>` +
          '<li><strong>Decide together.</strong> Jay walks you through the policy and whether anything else makes sense for you.</li>' +
        '</ol></section>' +
        CLIP + sib +
      '</div>' + SIDE('Places this policy for residents and fellows here') + '</div>',
      '/gsi/?h=' + h.id
    );
  }

  function showNotFound(q) {
    enterProfile(
      `<span class="gsi-badge is-no">${DASH}Not on Jay's list</span><span class="gsi-checked__note">Checked against Jay's list</span>`,
      q,
      'We couldn\'t match this to a hospital on Jay\'s GSI list.',
      'Not found',
      '<div class="qa-shell gsi-profile-grid"><div class="gsi-profile-main">' +
        '<section class="gsi-block"><h2>That doesn\'t mean there\'s no GSI</h2>' +
        '<p class="gsi-p">Hospitals go by different names, offers change, and some GSIs are through other insurance companies. Jay keeps track of the ones he knows about and will point you to the right person if he can\'t offer it himself.</p>' +
        '<p class="gsi-warn"><strong>Until you know, don\'t apply for any other disability policy.</strong> Most GSI policies ask whether you\'ve applied before.</p>' + INLINE_CTA + '</section>' +
        '<section class="gsi-block"><h2>What to do</h2><ol class="gsi-steps">' +
          '<li><strong>Tell Jay where you\'re training.</strong> Start the questionnaire or email jay@pgy1.com with your hospital and program.</li>' +
          '<li><strong>Jay checks for a GSI.</strong> If he can\'t offer it, he\'ll tell you who can.</li>' +
          '<li><strong>Then decide.</strong> With or without a GSI, Jay walks you through what makes sense.</li>' +
        '</ol></section>' +
        CLIP +
      '</div>' + SIDE('Will check your hospital for you') + '</div>',
      '/gsi/?q=' + encodeURIComponent(q)
    );
  }

  function showChoices(q, hits) {
    result.innerHTML =
      '<article class="gsi-profile gsi-profile--list">' +
        `<p class="gsi-profile__status is-yes"><span class="gsi-dot"></span>${hits.length} matches on Jay's list</p>` +
        '<h2>Which one is yours?</h2>' +
        '<ul class="gsi-choices">' +
          hits.slice(0, 8).map((o) => `<li><a href="/gsi/?h=${o.id}" data-id="${o.id}"><span>${esc(o.d)}</span><small>${o.y ? esc(o.y) + ' · ' : ''}${esc(where(o))}</small></a></li>`).join('') +
        '</ul>' +
        (hits.length > 8 ? '<p class="gsi-profile__hint">Keep typing to narrow it down.</p>' : '') +
      '</article>';
    result.hidden = false;
    history.replaceState(null, '', '/gsi/?q=' + encodeURIComponent(q));
  }

  document.querySelector('.gsi-again').addEventListener('click', leaveProfile);
  document.querySelector('.gsi-back').addEventListener('click', (ev) => { ev.preventDefault(); leaveProfile(); });

  /* ── Combobox ─────────────────────────────────────── */
  let options = [];
  let active = -1;
  function renderOptions(items) {
    options = items.slice(0, 7);
    active = -1;
    if (!options.length || !input.value.trim()) { closeOptions(); return; }
    list.innerHTML = options.map((h, i) =>
      `<li role="option" id="gsi-opt-${i}" data-i="${i}"><span class="gsi-opt__name">${esc(h.d)}</span>` +
      `<span class="gsi-opt__meta">${h.y ? esc(h.y) + ' · ' : ''}${esc(where(h))}</span></li>`).join('');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }
  function closeOptions() {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }
  function setActive(i) {
    active = i;
    [...list.children].forEach((li, k) => li.classList.toggle('is-active', k === i));
    if (i >= 0) input.setAttribute('aria-activedescendant', 'gsi-opt-' + i);
  }
  let picked = null; // hospital chosen from the dropdown, waiting for "Check"
  function choose(h) {
    input.value = h.d;
    picked = null;
    form.classList.remove('is-picked');
    closeOptions();
    showProfile(h);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function pick(h) {
    picked = h;
    input.value = h.d;
    form.classList.add('is-picked');
    closeOptions();
    form.querySelector('button[type=submit]').focus();
  }
  function submit(q) {
    q = q.trim();
    if (!q) return;
    if (picked && picked.d === q) { choose(picked); return; }
    const hits = score(q);
    closeOptions();
    if (!hits.length) { showNotFound(q); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (hits.length === 1 || lastScores[0] > lastScores[1]) choose(hits[0]);
    else showChoices(q, hits);
  }

  input.addEventListener('input', () => {
    picked = null;
    form.classList.remove('is-picked');
    renderOptions(score(input.value));
  });
  input.addEventListener('keydown', (ev) => {
    if (list.hidden) return;
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive(Math.min(active + 1, options.length - 1)); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(Math.max(active - 1, 0)); }
    else if (ev.key === 'Escape') { closeOptions(); }
    else if (ev.key === 'Enter' && active >= 0) { ev.preventDefault(); pick(options[active]); }
  });
  list.addEventListener('mousedown', (ev) => {
    const li = ev.target.closest('li[data-i]');
    if (!li) return;
    ev.preventDefault();
    pick(options[+li.dataset.i]);
  });
  input.addEventListener('blur', () => setTimeout(closeOptions, 120));
  form.addEventListener('submit', (ev) => { ev.preventDefault(); submit(input.value); });

  // Any in-page link to a hospital (profile siblings, choices, the full list) opens its profile without a reload
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[data-id]');
    if (!a || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
    const h = byId(a.dataset.id);
    if (!h) return;
    ev.preventDefault();
    choose(h);
  });

  // Deep links: /gsi/?h=<id> or /gsi/?q=<text> (the homepage search posts here)
  const params = new URLSearchParams(location.search);
  const hid = params.get('h');
  const q = params.get('q');
  if (hid && byId(hid)) choose(byId(hid));
  else if (q) { input.value = q; submit(q); }
})();
