// Vercel Routing Middleware. Two jobs, both for page addresses only (no assets, no files):
// 1. Content negotiation for AI agents: Accept: text/markdown gets the page's .md copy.
// 2. A real 404 for addresses that aren't on the site, instead of the homepage.
// Everything else passes straight through. Route lists come from scripts/build-markdown.py.
import { next, rewrite } from "@vercel/functions";
import { MD_ROUTES, PAGES } from "./md-routes";

const REDIRECTS = new Set(["/questionnaire/", "/questionnaire/index.html/"]);

export const config = {
  matcher: ["/((?!assets/|_vercel/|.*\\.[a-zA-Z0-9]+$).*)"],
};

export default async function middleware(request: Request) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";

    // REDIRECTS: addresses vercel.json redirects, so they must not 404 here.
    if (!PAGES.has(path) && !REDIRECTS.has(path)) {
      const page = await fetch(new URL("/404.html", url.origin));
      if (!page.ok) return next();
      return new Response(page.body, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate" },
      });
    }

    const accept = request.headers.get("accept") || "";
    if (/text\/markdown/i.test(accept) && MD_ROUTES[path]) {
      return rewrite(new URL(MD_ROUTES[path], request.url));
    }
    return next();
  } catch {
    // Never let this break a page.
    return next();
  }
}
