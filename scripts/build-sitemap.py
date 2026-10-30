#!/usr/bin/env python3
"""Write sitemap.xml from the built pages.

A page goes in if it has a canonical URL and isn't noindex. So while LAUNCH = False only the
pages that are already live (home, life insurance) are listed, and flipping LAUNCH adds the rest.
Run after the other build scripts (scripts/build-all.sh does this).
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_config import UPDATED  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {"node_modules", ".git", "assets", "scripts", "data", ".vercel"}
# lastmod for hand-written pages that the build scripts don't stamp
HAND = {"https://www.pgy1.com/": "2026-10-30", "https://www.pgy1.com/life-insurance/": "2026-10-30"}

urls = []
for dirpath, dirs, files in os.walk(ROOT):
    dirs[:] = sorted(d for d in dirs if d not in SKIP)
    if "index.html" not in files:
        continue
    s = open(os.path.join(dirpath, "index.html"), encoding="utf-8").read()
    if re.search(r'<meta name="robots" content="[^"]*noindex', s):
        continue
    m = re.search(r'<link rel="canonical" href="([^"]+)"', s)
    if not m:
        continue
    u = m.group(1)
    t = re.search(r'"dateModified":\s*"([\d-]+)"', s)
    urls.append((u, t.group(1) if t else HAND.get(u, UPDATED)))

def order(u):
    path = u[0].replace("https://www.pgy1.com", "")
    return (path != "/", path.count("/"), path)

urls.sort(key=order)
with open(os.path.join(ROOT, "sitemap.xml"), "w") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u, d in urls:
        f.write(f"  <url>\n    <loc>{u}</loc>\n    <lastmod>{d}</lastmod>\n  </url>\n")
    f.write("</urlset>\n")
print(f"sitemap.xml: {len(urls)} URLs")
