// Render 1200x630 social preview cards into assets/og/. Needs Playwright (npx playwright / require('playwright')).
// Usage: node scripts/og/render.js   (reads the built pages to find titles)
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const h1 = p => (read(p).match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").trim();
const jobs = [];
for (const d of fs.readdirSync(path.join(ROOT, 'questions'))) {
  const p = `questions/${d}/index.html`;
  if (fs.existsSync(path.join(ROOT, p))) jobs.push({ out: `q-${d}`, eyebrow: 'Residents ask', title: h1(p) });
}
for (const d of fs.readdirSync(path.join(ROOT, 'gsi'))) {
  const p = `gsi/${d}/index.html`;
  if (!fs.existsSync(path.join(ROOT, p))) continue;
  const name = h1(p).replace(/ GSI disability insurance$/i, '');
  jobs.push({ out: `gsi-${d}`, eyebrow: 'GSI disability insurance', title: `Does <em>${name}</em> have a GSI policy?`, sub: `Jay offers a Guardian GSI here` });
}
jobs.push({ out: 'questions', eyebrow: 'Questions, answered by Jay', title: 'Disability insurance questions from <em>residents and fellows</em>' });
jobs.push({ out: 'gsi', eyebrow: 'GSI lookup', title: 'Does your hospital have a <em>GSI</em> disability policy?' });
jobs.push({ out: 'about', eyebrow: 'About Jay', title: 'Over 25 years in physician <em>disability insurance</em>' });
jobs.push({ out: 'match-day-checklist', eyebrow: 'Match Day checklist', title: 'From MS4 to PGY1: <em>the money to-dos</em>' });
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await pg.goto('file://' + path.join(__dirname, 'card.html'));
  for (const j of jobs) {
    await pg.evaluate(j => {
      document.getElementById('e').textContent = j.eyebrow;
      const t = document.getElementById('t'); t.innerHTML = j.title;
      document.getElementById('s').textContent = j.sub || 'Physician disability insurance specialist';
      let fs = 76; t.style.setProperty('--fs', fs + 'px');
      while (t.getBoundingClientRect().bottom > 440 && fs > 40) { fs -= 2; t.style.setProperty('--fs', fs + 'px'); }
    }, j);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(ROOT, 'assets/og', j.out + '.jpg'), type: 'jpeg', quality: 84 });
  }
  await b.close(); console.log(jobs.length, 'cards');
})();
