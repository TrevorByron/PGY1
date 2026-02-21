# PGY1 Financial Solutions — Marketing Website

Modern marketing site for physician disability insurance (PGY1 Financial Solutions Corp / Jay Weinberg, CLU ChFC). Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Features

- **Hero** with headline, primary CTA (“Take 2 mins to get a quote”), trust badges, and mobile number block
- **Process** — 3 steps with timeline expectations: basic info → we evaluate & quote → policy in place
- **Audience** — Residents & Fellows (GSI focus) and Attendings
- **Social proof** — Quantified stats, carriers, testimonials, “trusted by” hospital logos
- **Quote form** — Fillout embed (configure via environment variable or direct edit)
- **Floating CTA** — Sticky quote button that appears after scroll
- **FAQ** — Accordion with common questions (includes Schema.org FAQPage structured data)
- **About** — Jay / PGY1 intro page
- **Disability 101** — Education section + `/disability-101` page with internal links
- **Blog** — Listing + `/blog` and `/blog/[slug]` pages with CTAs
- **SEO** — Comprehensive metadata, Open Graph tags, structured data (Schema.org), sitemap, robots.txt
- **Analytics** — Google Analytics (GA4) and Facebook Pixel support with conversion tracking

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required:**
- `NEXT_PUBLIC_FILLOUT_FORM_ID` - Your Fillout form ID (see Fillout form setup below)

**Optional (Analytics):**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics GA4 Measurement ID (format: `G-XXXXXXXXXX`)
- `NEXT_PUBLIC_FB_PIXEL_ID` - Facebook Pixel ID

**Optional (Site Config):**
- `NEXT_PUBLIC_SITE_URL` - Your production domain (defaults to `https://pgy1.com`)

### Fillout Form Setup

1. Create a form at [fillout.com](https://www.fillout.com) with conditional logic and optional fields as needed.
2. Get your form ID from the Fillout dashboard (found in your form URL: `https://form.fillout.com/t/YOUR_FORM_ID`)
3. Add it to `.env.local` as `NEXT_PUBLIC_FILLOUT_FORM_ID=YOUR_FORM_ID`
   - Or directly in `src/components/QuoteForm.tsx` and `src/app/quote/page.tsx` (see comments in those files)
4. Connect Fillout to Google Sheets or your backoffice for lead capture.

### Analytics Setup

The site includes built-in analytics support for Google Analytics (GA4) and Facebook Pixel.

**Google Analytics:**
1. Create a GA4 property in [Google Analytics](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `.env.local`: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

**Facebook Pixel:**
1. Create a Pixel in [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Get your Pixel ID
3. Add to `.env.local`: `NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX`

**Conversion Tracking:**
- Page views are automatically tracked
- Form submissions, CTA clicks, and contact link clicks can be tracked via the `trackEvent` helper function
- See `src/components/Analytics.tsx` for implementation details

## Build & deploy

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) (recommended) or Netlify. Set the production URL in `src/app/layout.tsx` (`metadataBase`) and `src/app/sitemap.ts` / `src/app/robots.ts` if using a domain other than `pgy1.com`.

## Project structure

- `src/app/` — Routes (page, layout, quote, about, testimonials, disability-101, blog)
- `src/components/` — Hero, Process, Audience, SocialProof, QuoteForm, FAQ, About, Disability101, BlogPreview, CTABlock, Header, Footer, FloatingCTA, Analytics, StructuredData
- `src/lib/` — Utility functions (date formatting, read time calculation)
- `src/app/icon.tsx` — Favicon (generated)
- `src/app/apple-icon.tsx` — Apple touch icon
- `.env.example` — Environment variable template

## SEO & Structured Data

The site includes comprehensive SEO optimization:

- **Structured Data (Schema.org):**
  - LocalBusiness schema for PGY1 Financial Solutions
  - Person schema for Jay Weinberg
  - Review schemas for testimonials
  - FAQPage schema for FAQ section

- **Meta Tags:**
  - Unique titles and descriptions for all pages
  - Open Graph tags for social sharing
  - Properly configured sitemap.xml and robots.txt

Validate structured data using [Google Rich Results Test](https://search.google.com/test/rich-results).

## Conversion Tracking

The analytics component automatically tracks:
- Page views (all pages)
- Form submissions (when form is submitted)
- CTA clicks (via FloatingCTA component)
- Contact link clicks (phone/text links)

Custom events can be tracked using the `trackEvent` helper function from `src/components/Analytics.tsx`.

## Marketing / growth (conceptual)

See `docs/talking-purposes.md` for strategy notes on SEO, drip campaigns, referrals, reviews, and social content. Those are not implemented in code.
