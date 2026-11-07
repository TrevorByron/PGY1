#!/usr/bin/env python3
"""Print title and meta description length for every page in sitemap.xml. Flags titles over 60
characters and descriptions over 155, which Google usually cuts off in results."""
import html, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.pgy1.com"
urls = re.findall(r"<loc>([^<]+)</loc>", open(os.path.join(ROOT, "sitemap.xml")).read())
bad = 0
for u in urls:
    rel = u.replace(SITE, "").strip("/")
    s = open(os.path.join(ROOT, rel, "index.html"), encoding="utf-8").read()
    t = html.unescape(re.search(r"<title>([^<]*)</title>", s).group(1))
    d = html.unescape((re.search(r'<meta name="description" content="([^"]*)"', s) or [None, ""])[1])
    flag = ("T" if len(t) > 60 else " ") + ("D" if len(d) > 155 else " ")
    bad += flag.strip() != ""
    if "-q" not in sys.argv or flag.strip():
        print(f"{flag} {len(t):3d} {len(d):3d}  {u.replace(SITE, '')}  |  {t}")
print(f"{bad} of {len(urls)} pages over a limit (T = title > 60, D = description > 155)")
sys.exit(1 if bad and "--strict" in sys.argv else 0)
