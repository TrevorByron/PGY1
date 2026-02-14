# PGY1 Financial Solutions — Marketing Website

Modern marketing site for physician disability insurance (PGY1 Financial Solutions Corp / Jay Weinberg, CLU ChFC). Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Features

- **Hero** with headline, primary CTA (“1 min, 100% private”), and mobile number block
- **Process** — 3 steps: basic info → we evaluate & quote → policy in place
- **Audience** — Residents & Fellows (GSI focus) and Attendings
- **Social proof** — Carriers, stats, testimonials, “trusted by” copy
- **Quote form** — Fillout embed (add your form ID in `src/components/QuoteForm.tsx`)
- **FAQ** — Accordion with common questions
- **About** — Jay / PGY1 intro
- **Disability 101** — Short education section + `/disability-101` page
- **Blog** — Stub listing + `/blog` and `/blog/[slug]` pages
- **SEO** — Metadata, Open Graph, sitemap, robots.txt

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Fillout form

1. Create a form at [fillout.com](https://www.fillout.com) with conditional logic and optional fields as needed.
2. In `src/components/QuoteForm.tsx`, set `FILLOUT_FORM_ID` to your form ID (or replace the placeholder block with your Fillout embed code).
3. Connect Fillout to Google Sheets or your backoffice for lead capture.

## Build & deploy

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) (recommended) or Netlify. Set the production URL in `src/app/layout.tsx` (`metadataBase`) and `src/app/sitemap.ts` / `src/app/robots.ts` if using a domain other than `pgy1.com`.

## Project structure

- `src/app/` — Routes (page, layout, disability-101, blog)
- `src/components/` — Hero, Process, Audience, SocialProof, QuoteForm, FAQ, About, Disability101, BlogPreview, CTABlock, Header, Footer
- `src/app/icon.tsx` — Favicon (generated)
- `src/app/apple-icon.tsx` — Apple touch icon

## Marketing / growth (conceptual)

See `docs/talking-purposes.md` for strategy notes on SEO, drip campaigns, referrals, reviews, and social content. Those are not implemented in code.
