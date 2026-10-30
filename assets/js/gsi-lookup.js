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
      if (window.pgy1Track) window.pgy1Track('GSI lookup from homepage', { picked: !!(chosen && chosen.d === q) });
      location.href = chosen && chosen.d === q ? '/gsi/?h=' + chosen.id : '/gsi/?q=' + encodeURIComponent(q);
    });
    return;
  }

  /* ── Rendering: a result card under the search, shown only after "Check" ── */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const where = (h) => h.st.map((s) => STATE_NAMES[s]).join(', ');
  const byId = (id) => H.find((o) => o.id === id);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CTA =
    '<div class="gsi-card__actions">' +
      '<a class="btn-primary" href="/#questionnaire-embed">Start the questionnaire</a>' +
      '<a class="gsi-card__tel" href="tel:+16094328862">or call Jay at (609) 432-8862</a>' +
    '</div>';

  const track = (name, data) => { if (window.pgy1Track) window.pgy1Track(name, data); };
  function render(htmlStr, url) {
    result.innerHTML = htmlStr;
    result.hidden = false;
    if (url) history.replaceState(null, '', url);
  }

  // "Looking up…" step: a short pause with a status line, so the answer reads as a lookup, not a link
  let lookupTimer = null, stepTimer = null;
  function lookingUp(label, then) {
    clearTimeout(lookupTimer); clearTimeout(stepTimer);
    form.classList.add('is-busy');
    render(
      '<div class="gsi-card gsi-card--loading" role="status">' +
        '<span class="gsi-spinner" aria-hidden="true"></span>' +
        `<div><p class="gsi-card__loading-title">Looking up ${esc(label)}</p>` +
        `<p class="gsi-card__loading-step">Checking Jay's list of ${H.length} hospitals and programs</p></div>` +
      '</div>'
    );
    const step = result.querySelector('.gsi-card__loading-step');
    stepTimer = setTimeout(() => { if (step) step.textContent = 'Matching names, health systems and affiliated programs'; }, reduce ? 0 : 650);
    lookupTimer = setTimeout(() => { clearTimeout(stepTimer); form.classList.remove('is-busy'); then(); }, reduce ? 150 : 1300);
  }

  function showProfile(h) {
    track('GSI lookup', { result: 'found', hospital: h.id });
    const siblings = h.y ? H.filter((o) => o !== h && o.y === h.y) : [];
    const sib = siblings.length
      ? `<p class="gsi-card__more"><span>Also on the list from ${esc(h.y)}:</span> ` +
        siblings.slice(0, 5).map((o) => `<a href="/gsi/?h=${o.id}" data-id="${o.id}">${esc(o.d)}</a>`).join('') +
        (siblings.length > 5 ? `<em>+${siblings.length - 5} more</em>` : '') + '</p>'
      : '';
    render(
      '<article class="gsi-card gsi-card--yes">' +
        '<p class="gsi-card__status"><span class="gsi-dot"></span>On Jay\'s GSI list</p>' +
        `<h2>${esc(h.d)}</h2>` +
        `<p class="gsi-card__where">${h.y ? esc(h.y) + ' · ' : ''}${esc(where(h))}</p>` +
        '<p>Residents and fellows at this program can get a Guardian guaranteed standard issue policy, with no health questions. <strong>Talk to Jay before you apply for any other disability policy.</strong> Applying elsewhere first can make you ineligible.</p>' +
        CTA + sib +
      '</article>',
      '/gsi/?h=' + h.id
    );
  }

  function showNotFound(q) {
    track('GSI lookup', { result: 'not_found', query: q.slice(0, 120) });
    render(
      '<article class="gsi-card gsi-card--no">' +
        '<p class="gsi-card__status"><span class="gsi-dot"></span>Not on Jay\'s list</p>' +
        `<h2>We couldn't find "${esc(q)}"</h2>` +
        '<p>That doesn\'t mean there\'s no GSI. Hospitals go by different names, offers change, and some GSIs are through other insurance companies. Jay keeps track of the ones he knows about and will point you to the right person if he can\'t offer it himself.</p>' +
        CTA +
        '<p class="gsi-card__more">Or <a href="#all">browse the full list by state</a>.</p>' +
      '</article>',
      '/gsi/?q=' + encodeURIComponent(q)
    );
  }

  function showChoices(q, hits) {
    track('GSI lookup', { result: 'several', query: q.slice(0, 120) });
    render(
      '<article class="gsi-card">' +
        `<p class="gsi-card__status"><span class="gsi-dot"></span>${hits.length} matches on Jay's list</p>` +
        '<h2>Which one is yours?</h2>' +
        '<ul class="gsi-card__choices">' +
          hits.slice(0, 8).map((o) => `<li><a href="/gsi/?h=${o.id}" data-id="${o.id}"><span>${esc(o.d)}</span><small>${o.y ? esc(o.y) + ' · ' : ''}${esc(where(o))}</small></a></li>`).join('') +
        '</ul>' +
        (hits.length > 8 ? '<p class="gsi-card__more">Keep typing to narrow it down.</p>' : '') +
      '</article>',
      '/gsi/?q=' + encodeURIComponent(q)
    );
  }

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
    lookingUp(h.d, () => showProfile(h));
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
    if (!q) { input.focus(); return; }
    if (picked && picked.d === q) { choose(picked); return; }
    closeOptions();
    const hits = score(q);
    lookingUp(q, () => {
      if (!hits.length) showNotFound(q);
      else if (hits.length === 1 || lastScores[0] > lastScores[1]) { input.value = hits[0].d; showProfile(hits[0]); }
      else showChoices(q, hits);
    });
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
    if (!result.contains(a)) form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    choose(h);
  });

  // Deep links: /gsi/?h=<id> or /gsi/?q=<text> (the homepage search posts here)
  const params = new URLSearchParams(location.search);
  const hid = params.get('h');
  const q = params.get('q');
  if (hid && byId(hid)) choose(byId(hid));
  else if (q) { input.value = q; submit(q); }
})();
