#!/usr/bin/env python3
"""Tell Bing (and the other IndexNow engines) which pages changed, so they recrawl them in hours, not weeks.

Run after a deploy is live:   python3 scripts/indexnow.py          (pages whose sitemap lastmod changed)
                              python3 scripts/indexnow.py --all    (every URL in the sitemap)
The key file at /51b8831addf8a4f3c4b0a41d9a53007f.txt proves we own the site. data/indexnow-sent.json remembers what was sent.
"""
import json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOST = "www.pgy1.com"
KEY = "51b8831addf8a4f3c4b0a41d9a53007f"
STATE = os.path.join(ROOT, "data", "indexnow-sent.json")

sm = open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read()
pages = dict(re.findall(r"<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>", sm))
sent = json.load(open(STATE)) if os.path.exists(STATE) else {}
urls = list(pages) if "--all" in sys.argv else [u for u, d in pages.items() if sent.get(u) != d]
if not urls:
    print("Nothing changed since the last submission.")
    sys.exit(0)
body = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": urls}).encode()
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body,
                             headers={"Content-Type": "application/json; charset=utf-8"})
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        print(f"IndexNow: {r.status} for {len(urls)} URLs")
except urllib.error.HTTPError as e:
    print(f"IndexNow refused: {e.code} {e.read()[:200]!r}")
    sys.exit(1)
sent.update({u: pages[u] for u in urls})
json.dump(sent, open(STATE, "w"), indent=1, sort_keys=True)
