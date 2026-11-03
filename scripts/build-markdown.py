#!/usr/bin/env python3
"""Write a markdown copy of every indexed page, plus llms.txt.

For AI assistants that read pages directly (Claude, ChatGPT search, Perplexity). They get the
content without the nav, scripts and layout. Two ways in:
  /questions/<slug>.md          the .md file this script writes
  /questions/<slug>/ + Accept: text/markdown   middleware.ts serves the same file
Same rule as the sitemap: a page gets a markdown copy if it has a canonical URL and isn't noindex.
Run after the other build scripts (scripts/build-all.sh does this). No dependencies.
"""
import html
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.pgy1.com"
SKIP_DIRS = {"node_modules", ".git", "assets", "scripts", "data", ".vercel"}
PHONE, EMAIL = "(609) 432-8862", "jay@pgy1.com"
# Tag llms.txt links so a visit that starts from an AI answer shows up in analytics.
TAG = "utm_source=llms.txt"

# Elements whose whole subtree is dropped.
DROP_TAGS = {"script", "style", "svg", "template", "form", "iframe", "nav", "button", "noscript",
             "select", "head", "picture", "img"}
# Class fragments for layout and widgets that aren't content.
DROP_CLASSES = ("qa-toc", "nav-", "dot-grid", "hero-watermark", "questionnaire-page",
                "questionnaire-embed", "gsi-search", "gsi-results", "qa-stage__count", "trust-",
                "avatar", "q-hero-avatars", "qa-ts", "qa-crumbs", "qa-chips", "cl-progress",
                "cl-print", "cl-box", "qa-video__label", "qa-arrow")


def absolute(href):
    if href.startswith(("http://", "https://", "mailto:", "tel:")):
        return href
    if href.startswith("/"):
        return SITE + href
    return SITE + "/" + href


INLINE = {"span", "strong", "b", "em", "i", "time", "small", "a"}
VOID = {"br", "hr", "img", "meta", "link", "input", "source", "wbr"}


class MD(HTMLParser):
    """Small HTML to markdown converter for this site's own templates."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []          # finished blocks
        self.buf = []          # inline text of the current block
        self.stack = []        # open tags: (tag, dropped)
        self.counters = []     # one per open list: [kind, n]
        self.links = []        # open <a> hrefs (None when the link is dropped)
        self.block = None      # prefix for the current block ("## ", "- ", "> ")
        self.row = None        # cells of the current table row
        self.sep = None        # separator owed after an inline element closed

    @property
    def dropping(self):
        return any(d for _, d in self.stack)

    def flush(self):
        text = re.sub(r"[ \t\r\n]+", " ", "".join(self.buf)).strip()
        text = re.sub(r"\s+\]\(", "](", text).replace("[ ", "[")
        self.buf, self.sep = [], None
        if text:
            self.out.append((self.block or "") + text)
        self.block = None

    def emit(self, text):
        # Adjacent spans with no space between them ("<strong>Jay</strong><span>Broker</span>")
        # would run together, so put a separator in when one is owed.
        if self.sep and text and not text[0].isspace() and text[0] not in ".,;:)!?":
            last = "".join(self.buf).rstrip("*[")
            if last and not last[-1].isspace():
                self.buf.append(self.sep)
        self.sep = None
        self.buf.append(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        void = tag in VOID
        if self.dropping:
            if not void:
                self.stack.append((tag, True))
            return
        cls = a.get("class") or ""
        if (tag in DROP_TAGS or "hidden" in a or a.get("aria-hidden") == "true"
                or any(c in cls for c in DROP_CLASSES)):
            if not void:
                self.stack.append((tag, True))
            return
        if not void:
            self.stack.append((tag, False))
        if tag in ("h1", "h2", "h3", "h4"):
            self.flush()
            self.block = "#" * int(tag[1]) + " "
        elif tag in ("p", "div", "section", "article", "header", "figcaption", "figure", "main", "aside"):
            self.flush()
        elif tag == "blockquote":
            self.flush()
            self.block = "> "
        elif tag in ("ul", "ol"):
            self.flush()
            self.counters.append([tag, 0])
        elif tag == "li":
            self.flush()
            depth = max(len(self.counters) - 1, 0)
            if self.counters and self.counters[-1][0] == "ol":
                self.counters[-1][1] += 1
                self.block = "   " * depth + f"{self.counters[-1][1]}. "
            else:
                self.block = "   " * depth + "- "
        elif tag == "br":
            self.buf.append(" ")
        elif tag == "a":
            href = a.get("href", "")
            if href and not href.startswith(("#", "javascript")):
                self.links.append(absolute(html.unescape(href)))
                self.emit("[")
            else:
                self.links.append(None)
        elif tag in ("strong", "b"):
            self.emit("**")
        elif tag in ("em", "i"):
            self.emit("*")
        elif tag == "video":
            self.flush()
            if a.get("src"):
                self.out.append(f"[{a.get('title') or 'Video'} (video)]({absolute(a['src'])})")
        elif tag == "table":
            self.flush()
            self.rows = 0
        elif tag == "tr":
            self.flush()
            self.row = []
        elif tag in ("td", "th"):
            self.buf = []

    def handle_endtag(self, tag):
        idx = next((i for i in range(len(self.stack) - 1, -1, -1) if self.stack[i][0] == tag), None)
        if idx is None:
            return
        was_dropped = self.stack[idx][1]
        parent_dropping = any(d for _, d in self.stack[:idx])
        popped = self.stack[idx:]
        del self.stack[idx:]
        # lists closed implicitly by sloppy nesting
        for t, d in popped[1:]:
            if t in ("ul", "ol") and not d and self.counters:
                self.counters.pop()
        if was_dropped or parent_dropping:
            return
        if tag in ("h1", "h2", "h3", "h4", "p", "li", "blockquote", "figcaption", "div", "section",
                   "header", "article", "figure", "aside"):
            self.flush()
        elif tag in ("ul", "ol"):
            self.flush()
            if self.counters:
                self.counters.pop()
            self.out.append("")
        elif tag == "a":
            href = self.links.pop() if self.links else None
            if href:
                if "".join(self.buf).rstrip().endswith("["):
                    while self.buf and self.buf[-1] != "[":
                        self.buf.pop()
                    if self.buf:
                        self.buf.pop()
                else:
                    self.buf.append(f"]({href})")
            self.sep = " · "
        elif tag in ("strong", "b"):
            self.buf.append("**")
            self.sep = " "
        elif tag in ("em", "i"):
            self.buf.append("*")
        elif tag in ("span", "time", "small"):
            self.sep = " · "
        elif tag in ("td", "th"):
            if self.row is not None:
                self.row.append(re.sub(r"\s+", " ", "".join(self.buf)).strip())
            self.buf = []
        elif tag == "tr":
            if self.row:
                self.out.append("| " + " | ".join(self.row) + " |")
                self.rows = getattr(self, "rows", 0) + 1
                if self.rows == 1:
                    self.out.append("|" + " --- |" * len(self.row))
            self.row = None

    def handle_data(self, data):
        if not self.dropping:
            self.emit(data)

    def markdown(self):
        self.flush()
        md, last = [], None
        for b in self.out:
            if b == "":
                if last != "":
                    md.append("")
                last = ""
                continue
            tight = (re.match(r"^\s*(-|\d+\.) ", b) and last and re.match(r"^\s*(-|\d+\.) ", last)) or \
                    (b.startswith("|") and last and last.startswith("|"))
            if md and md[-1] != "" and not tight:
                md.append("")
            md.append(b)
            last = b
        text = "\n".join(md)
        text = re.sub(r"\*\*\s*\*\*", "", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip() + "\n"


def meta(s, name):
    m = re.search(rf'<meta name="{name}" content="([^"]*)"', s)
    return html.unescape(m.group(1)) if m else ""


def convert(s):
    start = s.find("<h1")
    # start at the hero that holds the h1, so its intro paragraph comes along
    hero = s.rfind("<header", 0, start)
    main_open = s.find("<main")
    if hero != -1 and (main_open == -1 or hero > s.rfind("</nav>", 0, start)):
        start = hero
    end = s.find("</main>")
    end = end if end != -1 else s.find("<footer")
    p = MD()
    p.feed(s[start:end])
    return p.markdown()


def pages():
    for dirpath, dirs, files in os.walk(ROOT):
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS)
        if "index.html" not in files:
            continue
        s = open(os.path.join(dirpath, "index.html"), encoding="utf-8").read()
        if re.search(r'<meta name="robots" content="[^"]*noindex', s):
            continue
        m = re.search(r'<link rel="canonical" href="([^"]+)"', s)
        if not m:
            continue
        yield m.group(1), s


def md_path(url):
    path = url.replace(SITE, "").strip("/")
    return "index.md" if not path else path + ".md"


FOOTER = (
    "---\n\n"
    "PGY1 Financial Solutions Corp · Jay Weinberg, CLU, ChFC · independent disability insurance broker "
    f"for residents, fellows and physicians · {PHONE} · {EMAIL}\n\n"
    f"Start here: [2-minute questionnaire]({SITE}/) · [Does your hospital have a GSI policy?]({SITE}/gsi/) · "
    f"[All questions]({SITE}/questions/)\n\n"
    "General information from Jay's webinars, not advice for your situation. Policy details vary by "
    "hospital, state and insurance company.\n"
)

# write the .md copies
written, info = 0, {}
for url, s in pages():
    title = re.search(r"<title>([^<]*)</title>", s)
    title = html.unescape(title.group(1)).strip() if title else url
    body = convert(s)
    header = f"<!-- {url} -->\n\n"
    rel = md_path(url)
    dest = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(dest) or ROOT, exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        f.write(header + body + "\n" + FOOTER)
    h1 = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", s)
    h1 = html.unescape(re.sub(r"<[^>]+>", "", h1.group(1))).strip() if h1 else title
    info[url] = {"title": re.sub(r"\s+", " ", h1), "desc": meta(s, "description"), "md": rel}
    written += 1


def link(url):
    i = info[url]
    sep = "&" if "?" in url else "?"
    return f"- [{i['title']}]({url}{sep}{TAG}): {i['desc']} (markdown: {SITE}/{i['md']})"


# questions, grouped the way the hub groups them
hub = open(os.path.join(ROOT, "questions", "index.html"), encoding="utf-8").read()
stages = []
for sec in re.findall(r'<section class="qa-stage"[\s\S]*?</section>', hub):
    name = html.unescape(re.search(r"<h2>([^<]*)</h2>", sec).group(1))
    hrefs = re.findall(r'class="qa-row" href="(/questions/[^"]+)"', sec)
    stages.append((name, [SITE + h for h in hrefs if SITE + h in info]))
listed = {u for _, us in stages for u in us}

L = []
L.append("# PGY1.com")
L.append("")
L.append("> Disability insurance for resident and fellow physicians, explained by Jay Weinberg, CLU, ChFC, "
         "an independent broker who has worked only with physicians for 25+ years and lectures at 100+ "
         "residency and fellowship programs a year.")
L.append("")
L.append("PGY1 Financial Solutions Corp helps medical students, residents and fellows choose disability "
         "insurance at the start of training: GSI (guaranteed standard issue) policies with no health "
         "questions, own-occupation coverage, and what to do before Match Day and July 1. The answers on "
         "this site come from Jay's recorded webinars, in his own words, each with a short video clip.")
L.append("")
L.append("Every page is available as markdown: add `.md` to the URL without the trailing slash "
         f"({SITE}/questions/what-is-gsi-disability-insurance.md), or request any page with "
         "`Accept: text/markdown`.")
L.append("")
L.append(f"Contact: {PHONE} · {EMAIL}. General information, not advice for a specific situation.")
L.append("")
L.append("## Start here")
L.append("")
for u in (SITE + "/", SITE + "/questions/", SITE + "/gsi/", SITE + "/about/"):
    if u in info:
        L.append(link(u))
L.append("")
for name, us in stages:
    L.append(f"## Questions: {name}")
    L.append("")
    L.extend(link(u) for u in us)
    L.append("")
gsi = sorted(u for u in info if u.startswith(SITE + "/gsi/") and u != SITE + "/gsi/")
if gsi:
    L.append("## GSI policies by hospital")
    L.append("")
    L.append(f"Hospitals where Jay can offer a Guardian GSI policy. The full list is at {SITE}/gsi/.")
    L.append("")
    L.extend(link(u) for u in gsi)
    L.append("")
rest = [u for u in info if u not in listed and u not in gsi
        and u not in (SITE + "/", SITE + "/questions/", SITE + "/gsi/", SITE + "/about/")]
if rest:
    L.append("## More")
    L.append("")
    L.extend(link(u) for u in sorted(rest))
    L.append("")

with open(os.path.join(ROOT, "llms.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(L))

# route list for middleware.ts (Accept: text/markdown -> the .md copy)
routes = {u.replace(SITE, "") or "/": "/" + i["md"] for u, i in sorted(info.items())}
with open(os.path.join(ROOT, "md-routes.ts"), "w", encoding="utf-8") as f:
    f.write("// Generated by scripts/build-markdown.py. Don't edit by hand.\n")
    f.write("export const MD_ROUTES: Record<string, string> = {\n")
    for k, v in routes.items():
        f.write(f'  "{k}": "{v}",\n')
    f.write("};\n\n")
    # every page address on the site, indexed or not, so middleware.ts can 404 the rest
    allp = []
    for dirpath, dirs, files in os.walk(ROOT):
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS)
        if "index.html" in files:
            rel = os.path.relpath(dirpath, ROOT).replace(os.sep, "/")
            allp.append("/" if rel == "." else "/" + rel + "/")
    f.write("export const PAGES = new Set<string>([\n")
    for k in sorted(allp):
        f.write(f'  "{k}",\n')
    f.write("]);\n")

# point each page at its markdown copy, once
for u, i in info.items():
    rel = u.replace(SITE, "").strip("/")
    page = os.path.join(ROOT, rel, "index.html")
    s = open(page, encoding="utf-8").read()
    tag = f'<link rel="alternate" type="text/markdown" href="/{i["md"]}" />'
    if 'type="text/markdown"' in s:
        s = re.sub(r'<link rel="alternate" type="text/markdown" href="[^"]*" ?/?>', tag, s)
    else:
        s = re.sub(r'(<link rel="canonical" href="[^"]+"\s*/?>)', r"\1\n  " + tag, s, count=1)
    open(page, "w", encoding="utf-8").write(s)
print(f"markdown: {written} pages, llms.txt: {len(info)} links")
