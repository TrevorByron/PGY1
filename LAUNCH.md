# Launching the visual refresh, questions, GSI lookup and new pages

Everything below is on the `visual-refresh` branch. New pages stay `noindex` and out of
`sitemap.xml` until `LAUNCH = True` in `scripts/site_config.py`.

## Before the merge (needs Jay)

- [ ] Jay reads all 28 question pages, the 16 hospital profiles with specific content, `/about/` and `/match-day-checklist/`
- [ ] Student loan pages checked against current rules. They come from the March 2026 webinar, before RAP launched in July 2026
      (`direct-consolidation-before-residency`, `ibr-vs-rap-for-residents`, `pslf-requirements`, `private-refinance-student-loans`, `file-taxes-as-ms4`)
- [ ] Clips Jay should sign off on: `direct-consolidation-before-residency` (says RAP isn't available until July), `roth-ira-as-a-resident` ("grows tax-deferred")
- [ ] Numbers on `/about/` confirmed: 25+ years, 100+ programs a year, ~900 physicians in 2025 (all from his 2026 webinars)
- [ ] OK to name Guardian and the 37 hospitals
- [ ] Compliance: does Guardian or his agency need to approve web copy or video first?

## Launch

1. In `scripts/site_config.py` set `LAUNCH = True`, and `REVIEWED_BY_JAY = True` if he has signed off. Bump `UPDATED` if content changed.
2. Run `bash scripts/build-all.sh`. It rebuilds questions, GSI, about, checklist, then the sitemap. Expect about 50 URLs.
3. Spot check: `grep -L 'content="index,follow"' questions/*/index.html` should print nothing.
4. `npm start` and click through `/`, `/questions/`, a question page, `/gsi/` (try "Cooper"), a hospital profile, `/about/`, `/match-day-checklist/`, `/life-insurance/`.
5. Merge `visual-refresh` into `main` and push. Vercel deploys.

## Right after it's live

- [ ] Google Search Console: verify `www.pgy1.com` (DNS TXT record), submit `https://www.pgy1.com/sitemap.xml`, request indexing for `/questions/`, `/gsi/`, `/about/`
- [ ] Bing Webmaster Tools: import from Search Console
- [ ] Check social previews: paste a question URL into Slack or iMessage, it should show that question's card (`assets/og/`)
- [ ] Rich results test on one question page and `/about/` (https://search.google.com/test/rich-results)
- [ ] Vercel Analytics: custom conversion events only report on a Pro plan

## Regenerating things

- Question pages: edit `../Question Pages - Draft Content.md`, then `bash scripts/build-all.sh`
- Hospitals: edit `data/gsi-hospitals.csv` or `data/gsi-programs/*.json`, then `bash scripts/build-all.sh`
- Social cards (needs Playwright): `node scripts/og/render.js` after the pages are built
- Clip durations for video schema (needs ffprobe): `bash scripts/clip-durations.sh`

## AI assistants (llms.txt and markdown)

- `scripts/build-markdown.py` (last step of `build-all.sh`) writes a `.md` copy of every indexed page, `llms.txt`, and `md-routes.ts`, and adds a `<link rel="alternate" type="text/markdown">` to each page
- `middleware.ts` serves the `.md` copy when a request sends `Accept: text/markdown`. Browsers never do, so they always get HTML
- `.md` files carry `X-Robots-Tag: noindex` so Google indexes the HTML pages, not the copies
- `.vercelignore` keeps this file, `scripts/` and `data/` off the live site
- Check after deploy: `curl -H "Accept: text/markdown" https://www.pgy1.com/questions/what-is-gsi-disability-insurance/` returns markdown, `/llms.txt` loads

## After each deploy: IndexNow

`python3 scripts/indexnow.py` tells Bing (and Yandex, Seznam, Naver) which pages changed, using the
sitemap's lastmod dates. Run it from your Mac once Vercel says Ready. `--all` sends every URL.
The key file is `/51b8831addf8a4f3c4b0a41d9a53007f.txt`; don't delete it.
