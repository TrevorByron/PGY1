/* GSI hospital lookup (/gsi/). Data: window.GSI_HOSPITALS, built from data/gsi-hospitals.csv. */
(function () {
  const H = window.GSI_HOSPITALS || [];
  const form = document.querySelector('.gsi-search');
  const input = document.getElementById('gsi-q');
  const list = document.getElementById('gsi-options');
  const result = document.getElementById('gsi-result');
  if (!form || !input || !H.length) return;

  const STATE_NAMES = { AL: 'Alabama', AR: 'Arkansas', AZ: 'Arizona', CA: 'California', CT: 'Connecticut', DC: 'Washington DC', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', IL: 'Illinois', IN: 'Indiana', KY: 'Kentucky', LA: 'Louisiana', MA: 'Massachusetts', MD: 'Maryland', ME: 'Maine', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', MS: 'Mississippi', NC: 'North Carolina', NE: 'Nebraska', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NV: 'Nevada', NY: 'New York', OH: 'Ohio', OK: 'Oklahoma', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', TN: 'Tennessee', TX: 'Texas', VA: 'Virginia', VT: 'Vermont', WA: 'Washington', WI: 'Wisconsin' };
  const STOP = new Set(['the', 'of', 'at', 'and', 'for', 'in', 'hospital', 'medical', 'center', 'centre', 'health', 'university', 'med', 'ctr', 'system', 'residency', 'program']);

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
  // true when a and b are within one edit (typos like "vanderbuilt", "presbyterain")
  function near(a, b) {
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

  // Pre-index: name tokens weigh more than alias tokens
  const IDX = H.map((h) => {
    const nameT = toks(h.t + ' ' + h.s);
    const aliasStr = h.a.map(norm);
    const aliasT = toks(h.a.join(' ') + ' ' + h.st.map((s) => STATE_NAMES[s] + ' ' + s).join(' '));
    return { h, nameT, aliasT, aliasStr, full: norm(h.t + ' ' + h.s) };
  });

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
      let all = true;
      for (const t of qt) {
        const inName = e.nameT.some((w) => w === t) ? 3 : e.nameT.some((w) => w.startsWith(t)) ? 2 : 0;
        const inAlias = e.aliasT.some((w) => w === t) ? 2 : e.aliasT.some((w) => w.startsWith(t) && t.length > 1) ? 1 : 0;
        let best = Math.max(inName, inAlias);
        if (!best && t.length >= 5 && (e.nameT.some((w) => near(w, t)) || e.aliasT.some((w) => near(w, t)))) best = 1;
        if (!best) { all = false; break; }
        s += best;
      }
      if (!all) return;
      if (e.aliasStr.includes(nq)) s += 6;          // typed an exact alias (HUP, MGH, Bellevue)
      if (e.full.startsWith(nq)) s += 4;
      else if (e.full.includes(nq)) s += 2;
      out.push({ e, s });
    });
    out.sort((a, b) => b.s - a.s || a.e.h.t.localeCompare(b.e.h.t));
    lastScores = out.map((o) => o.s);
    return out.map((o) => o.e.h);
  }

  function esc(s) { return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function where(h) { return h.st.map((s) => STATE_NAMES[s]).join(', '); }

  let options = [];
  let active = -1;

  function renderOptions(items) {
    options = items.slice(0, 8);
    active = -1;
    if (!options.length || !input.value.trim()) { closeOptions(); return; }
    list.innerHTML = options.map((h, i) =>
      `<li role="option" id="gsi-opt-${i}" data-i="${i}"><span class="gsi-opt__name">${esc(h.t)}</span>` +
      `<span class="gsi-opt__meta">${esc(h.s ? h.s + ' · ' : '')}${esc(where(h))}</span></li>`).join('');
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

  const CTA = '<div class="gsi-result__actions">' +
    '<a class="btn-primary" href="/#questionnaire-embed">Start the questionnaire</a>' +
    '<a class="gsi-result__tel" href="tel:+16094328862">or call Jay at (609) 432-8862</a></div>';

  function showFound(h, others) {
    const more = others && others.length
      ? `<p class="gsi-result__more">Also in the same system: ${others.slice(0, 4).map((o) => `<button type="button" data-id="${o.id}">${esc(o.t)}${o.s ? ' · ' + esc(o.s) : ''}</button>`).join('')}</p>`
      : '';
    result.className = 'gsi-result gsi-result--found';
    result.innerHTML =
      '<p class="gsi-result__status"><span class="gsi-dot"></span>On Jay\'s GSI list</p>' +
      `<h2>${esc(h.t)}${h.s ? `<span>${esc(h.s)}</span>` : ''}</h2>` +
      `<p>Residents and fellows at this program can get a Guardian guaranteed standard issue policy, with no health questions. <strong>Talk to Jay before you apply for any other disability policy.</strong> Applying elsewhere first can make you ineligible.</p>` +
      CTA + more;
    result.hidden = false;
    history.replaceState(null, '', '/gsi/?h=' + h.id);
  }

  function showNotFound(q) {
    result.className = 'gsi-result gsi-result--none';
    result.innerHTML =
      '<p class="gsi-result__status"><span class="gsi-dot"></span>Not on the list yet</p>' +
      `<h2>We couldn't find “${esc(q)}”</h2>` +
      '<p>That doesn\'t mean there\'s no GSI. Hospitals use different names, offers change, and some GSIs are through other insurance companies. Jay keeps track of the ones he knows about and will point you to the right person if he can\'t offer it himself.</p>' +
      CTA + '<p class="gsi-result__more">Or <a href="#all">browse the full list by state</a>.</p>';
    result.hidden = false;
    history.replaceState(null, '', '/gsi/?q=' + encodeURIComponent(q));
  }

  function choose(h) {
    input.value = h.t + (h.s ? ' · ' + h.s : '');
    closeOptions();
    const family = H.filter((o) => o !== h && o.t === h.t);
    showFound(h, family);
  }

  function showChoices(q, hits) {
    result.className = 'gsi-result gsi-result--found';
    result.innerHTML =
      `<p class="gsi-result__status"><span class="gsi-dot"></span>${hits.length} matches on Jay's GSI list</p>` +
      `<h2>Which one is yours?</h2>` +
      `<p class="gsi-result__more gsi-result__choices">${hits.slice(0, 12).map((o) => `<button type="button" data-id="${o.id}">${esc(o.t)}${o.s ? ' · ' + esc(o.s) : ''}</button>`).join('')}</p>` +
      (hits.length > 12 ? '<p class="gsi-result__more">Keep typing to narrow it down, or <a href="#all">browse the full list</a>.</p>' : '');
    result.hidden = false;
    history.replaceState(null, '', '/gsi/?q=' + encodeURIComponent(q));
  }

  function submit(q) {
    q = q.trim();
    if (!q) return;
    const hits = score(q);
    closeOptions();
    if (!hits.length) { showNotFound(q); return; }
    // A clear winner gets the answer; a tie (e.g. "Northwell", "Mayo") asks which one
    if (hits.length === 1 || lastScores[0] > lastScores[1]) choose(hits[0]);
    else showChoices(q, hits.filter((h, i) => lastScores[i] === lastScores[0]).concat(hits.filter((h, i) => lastScores[i] !== lastScores[0])));
  }

  input.addEventListener('input', () => renderOptions(score(input.value)));
  input.addEventListener('keydown', (ev) => {
    if (list.hidden) return;
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive(Math.min(active + 1, options.length - 1)); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(Math.max(active - 1, 0)); }
    else if (ev.key === 'Escape') { closeOptions(); }
    else if (ev.key === 'Enter' && active >= 0) { ev.preventDefault(); choose(options[active]); }
  });
  list.addEventListener('mousedown', (ev) => {
    const li = ev.target.closest('li[data-i]');
    if (!li) return;
    ev.preventDefault();
    choose(options[+li.dataset.i]);
  });
  input.addEventListener('blur', () => setTimeout(closeOptions, 120));
  form.addEventListener('submit', (ev) => { ev.preventDefault(); submit(input.value); });
  result.addEventListener('click', (ev) => {
    const b = ev.target.closest('button[data-id]');
    if (!b) return;
    const h = H.find((o) => o.id === b.dataset.id);
    if (h) choose(h);
  });
  // Clicking a hospital in the full list selects it
  document.querySelectorAll('.gsi-states li[data-id]').forEach((li) => {
    li.addEventListener('click', () => {
      const h = H.find((o) => o.id === li.dataset.id);
      if (!h) return;
      choose(h);
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Deep links: /gsi/?h=<id> or /gsi/?q=<text> (the homepage search posts here)
  const params = new URLSearchParams(location.search);
  const hid = params.get('h');
  const q = params.get('q');
  if (hid) { const h = H.find((o) => o.id === hid); if (h) choose(h); }
  else if (q) { input.value = q; submit(q); }

  // Expose the matcher for testing
  window.__gsiScore = score;
})();
