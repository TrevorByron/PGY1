// Vercel Routing Middleware. One job: content negotiation for AI agents.
// A request that asks for markdown (Accept: text/markdown) gets the page's .md copy instead
// of the HTML. Everyone else, browsers included, passes straight through untouched.
// The .md files and the route list are written by scripts/build-markdown.py.
import { next, rewrite } from "@vercel/functions";
import { MD_ROUTES } from "./md-routes";

export const config = {
  // Pages only: skip assets, files with an extension, and Vercel's own paths.
  matcher: ["/((?!assets/|_vercel/|.*\\.[a-zA-Z0-9]+$).*)"],
};

export default function middleware(request: Request) {
  try {
    const accept = request.headers.get("accept") || "";
    if (!/text\/markdown/i.test(accept)) return next();
    const url = new URL(request.url);
    const path = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
    const md = MD_ROUTES[path];
    if (!md) return next();
    return rewrite(new URL(md, request.url));
  } catch {
    // Never let this break a page.
    return next();
  }
}
