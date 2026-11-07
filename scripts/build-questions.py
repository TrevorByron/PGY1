#!/usr/bin/env python3
"""Build /questions/ pages from the draft content markdown.

Usage (from the site root):
    python3 scripts/build-questions.py "../Question Pages - Draft Content.md"

Reads one markdown file (format described at the top of that file) and writes:
    questions/index.html            the hub page
    questions/<slug>/index.html     one page per question

Pages are noindex until LAUNCH = True in scripts/site_config.py. Run scripts/build-all.sh
after changing it; that also rewrites sitemap.xml.
"""
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_config import LAUNCH, REVIEWED_BY_JAY, PUBLISHED, UPDATED, license_line  # noqa: E402
DRAFT = not LAUNCH
JAY = {"@type": "Person", "@id": "https://www.pgy1.com/#jay", "name": "Jay Weinberg", "honorificSuffix": "CLU, ChFC",
       "url": "https://www.pgy1.com/about/"}
SITE = "https://www.pgy1.com"
PHONE_DISPLAY = "(609) 432-8862"
PHONE_TEL = "+16094328862"
STAGE_ORDER = ["Before Match", "GSI policies", "Choosing a policy", "Medical school to residency", "Life insurance"]
STAGE_BLURB = {
    "Before Match": "For MS4s and anyone about to start residency.",
    "GSI policies": "Guaranteed standard issue: the no-health-questions option many teaching hospitals have.",
    "Choosing a policy": "The wording and features that decide whether a policy actually pays.",
    "Medical school to residency": "Student loans, taxes, housing and your first paycheck, from Jay's spring transition webinar.",
    "Life insurance": "Term vs permanent, and when residents usually start looking.",
}

# Source label prefix -> (YouTube id, upload date, full title)
VIDEOS = {
    "Disability Insurance and GSI Policies (Oct 2026)": ("4ya8ytnG_iA", "2026-10-02", "Disability Insurance and GSI Policies for Resident and Fellow Physicians"),
    "Spring 2026 Financial Transition webinar": ("mwKg8wIhO0o", "2026-03-25", "Spring 2026 Financial Transition from Medical Student to PGY1 Intern Resident Physician"),
    "Masterclass – Disability Insurance and GSI Policies (Apr 2026)": ("OGv0T4QPqWo", "2026-04-23", "Masterclass - Disability Insurance and GSI Policies for Resident and Fellow Physicians"),
    "Disability Insurance Securing Coverage in Residency (2019 clip)": ("BhnIu7f7ix4", "2019-10-15", "Jay Weinberg - Disability Insurance Securing Coverage in Residency"),
    "Disability Insurance Future Increase Options (2019 clip)": ("4Gt82q0vOiI", "2019-10-15", "Jay Weinberg - Disability Insurance Future Increase Options"),
    "Masterclass – GSI Disability Insurance (Mar 2026)": ("jbIEKrrgKos", "2026-03-18", "Masterclass GSI Disability Insurance for Medical Students, Resident, and Fellow Physicians"),
    "Contract Do's and Don'ts and Disability Insurance (Mar 2026)": ("aPpAWC_QIBs", "2026-03-18", "Physician Employment Contract Do's and Don'ts and Disability Insurance"),
    "Physician Disability Insurance (2019 clip)": ("vAOUJKaQ-Qg", "2019-04-05", "4 3 19 Jay Weinberg speaking on Physician Disability Insurance"),
    "How to Secure a Comprehensive Individual Disability Policy (2019 clip)": ("ejAw4gmIM9c", "2019-10-15", "Jay Weinberg - How to Secure Comprehensive Individual Disability Policy"),
    "Roth IRA (2019 clip)": ("wQk-ccpDshI", "2019-04-05", "4 3 19 Jay Weinberg speaking on Roth IRA"),
    "Disability Insurance - Own Occupation (2019 clip)": ("bgIzpPZVG4g", "2019-10-15", "Jay Weinberg - Disability Insurance - Own Occupation"),
}
VIDEO_BY_ID = {v[0]: v for v in VIDEOS.values()}
# ISO 8601 durations for the local clips (written by scripts/clip-durations.sh)
_dur = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "clip-durations.json")
CLIP_DURATIONS = json.load(open(_dur)) if os.path.exists(_dur) else {}



def is_draft(q):
    """`draft: yes` in the content file: the page is built so Jay can read it at its URL, but it's noindex,
    left out of the /questions/ hub and of related links on other pages, and so also out of the sitemap,
    llms.txt and the markdown copies (those follow noindex)."""
    return q.get("draft", "").strip().lower() in ("yes", "true", "1")


def page_title(q, limit=60):
    """<title> for a question page: the question itself when it fits, otherwise the shorter `seo:` line
    from the content file. The H1 always stays the full question."""
    for t in (f"{q['title']} | PGY1.com", f"{q.get('seo', '')} | PGY1.com", q["title"], q.get("seo", "")):
        if t.strip(" |") and len(t) <= limit and not t.startswith(" |"):
            return t
    return q.get("seo") or q["title"]


def iso_datetime(d):
    """Google wants uploadDate as a full datetime with a timezone, not just a date."""
    return d if "T" in d else f"{d}T12:00:00-05:00"

def secs(ts):
    parts = [int(p) for p in ts.split(":")]
    total = 0
    for p in parts:
        total = total * 60 + p
    return total


def pretty_date(iso):
    y, m, d = (int(x) for x in iso.split("-"))
    months = "January February March April May June July August September October November December".split()
    return f"{months[m - 1]} {d}, {y}"


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def headings(lines):
    return [l[4:].strip() for l in lines if l.startswith("### ")]


def first_sentence(text, min_len=60):
    parts = re.split(r"(?<=[.!?])\s+", text)
    out = ""
    for p in parts:
        out = (out + " " + p).strip()
        if len(out) >= min_len:
            break
    return out


def inline(text):
    t = html.escape(text, quote=False)
    t = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2">\1</a>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\w)", r"<em>\1</em>", t)
    return t


def body_to_html(lines):
    out, para, lst, kind = [], [], [], None

    def flush():
        nonlocal para, lst, kind
        if para:
            out.append("<p>" + inline(" ".join(para)) + "</p>")
            para = []
        if lst:
            tag = "ol" if kind == "ol" else "ul"
            out.append(f"<{tag}>" + "".join(f"<li>{inline(i)}</li>" for i in lst) + f"</{tag}>")
            lst, kind = [], None

    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            flush()
            continue
        if line.startswith("### "):
            flush()
            htext = line[4:].strip()
            out.append(f'<h2 id="{slugify(htext)}">' + inline(htext) + "</h2>")
            continue
        m_ol = re.match(r"^\d+\.\s+(.*)", line)
        m_ul = re.match(r"^[-*]\s+(.*)", line)
        if m_ol or m_ul:
            if para:
                flush()
            k = "ol" if m_ol else "ul"
            if kind and kind != k:
                flush()
            kind = k
            lst.append((m_ol or m_ul).group(1))
            continue
        if lst and line.startswith("   "):
            lst[-1] += " " + line.strip()
            continue
        if lst:
            flush()
        para.append(line.strip())
    flush()
    return "\n".join(out)


def parse(path):
    text = open(path, encoding="utf-8").read()
    chunks = re.split(r"^## ", text, flags=re.M)[1:]
    qs = []
    for ch in chunks:
        lines = ch.split("\n")
        q = {"title": lines[0].strip().rstrip("-").strip()}
        i = 1
        while i < len(lines) and re.match(r"^[a-z]+:\s", lines[i]):
            k, v = lines[i].split(":", 1)
            q[k.strip()] = v.strip()
            i += 1
        rest = lines[i:]
        # cut trailing separator
        rest = [l for l in rest if l.strip() != "---"]
        short, body, sources, mode = "", [], [], "body"
        for l in rest:
            if l.startswith("**Short answer:**"):
                short = l.replace("**Short answer:**", "").strip()
                continue
            if l.strip() == "Sources:":
                mode = "src"
                continue
            if mode == "src":
                m = re.match(r"^-\s+(.*?)\s*\[([\d:]+)\]\s*$", l)
                if m:
                    sources.append((m.group(1), m.group(2)))
                continue
            body.append(l)
        q["short"], q["body"], q["sources"] = short, body, sources
        vid, ts, vtitle = re.match(r"^(\S+)\s+([\d:]+)\s*\|\s*(.*)$", q["video"]).groups()
        q["video_id"], q["video_ts"], q["video_title"] = vid, ts, vtitle
        q["related"] = [s.strip() for s in q.get("related", "").split(",") if s.strip()]
        qs.append(q)
    return qs


def head(title, desc, canonical, extra_ld, og_image=None, og_type="article"):
    robots = '<meta name="robots" content="noindex,follow" />' if DRAFT else '<meta name="robots" content="index,follow" />'
    t, d = html.escape(title), html.escape(desc)
    img = og_image or "https://www.pgy1.com/assets/images/unfurl.png?v=20260508"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{t}</title>
  <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
  <meta name="description" content="{d}" />
  <link rel="canonical" href="{canonical}" />
  {robots}
  <meta property="og:type" content="{og_type}" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="{t}" />
  <meta property="og:description" content="{d}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:site_name" content="PGY1.com" />
  <meta property="og:image" content="{img}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{t}" />
  <meta name="twitter:description" content="{d}" />
  <meta name="twitter:image" content="{img}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <script>window.va = window.va || function () {{ (window.vaq = window.vaq || []).push(arguments); }};</script>
  <script defer src="/_vercel/insights/script.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/css/main.css" />
  <link rel="stylesheet" href="/assets/css/questions.css" />
  <link rel="stylesheet" href="/assets/css/refresh.css" />
  <script type="application/ld+json">{json.dumps(extra_ld, ensure_ascii=False)}</script>
</head>
<body>
"""


NAV = f"""<nav>
  <a href="/" class="nav-logo">
    <span class="nav-logo-primary">
      <img src="/assets/images/horizontal-logo.svg" alt="PGY1.com Disability Insurance for Physicians" />
    </span>
  </a>
  <div class="nav-right">
    <a href="/about/" class="nav-link">About Jay</a>
    <a href="/gsi/" class="nav-link">GSI lookup</a>
    <a href="/questions/" class="nav-link">Questions</a>
    <a href="tel:{PHONE_TEL}" class="nav-link nav-link-tel"><span>{PHONE_DISPLAY}</span></a>
    <a href="/#questionnaire-embed" class="nav-cta">Get started →</a>
  </div>
</nav>
"""

LICENSE_HTML = f'\n  <p class="footer-license">{license_line()}</p>' if license_line() else ""
FOOTER = f"""<footer>
  <div class="dot-grid" aria-hidden="true"></div>
  <p>© 2026 PGY1 Financial Solutions Corp · Jay Weinberg, CLU ChFC</p>{LICENSE_HTML}
  <div class="footer-links">
    <a href="tel:{PHONE_TEL}" class="footer-tel"><span>{PHONE_DISPLAY}</span></a>
    <a href="/about/">About Jay</a>
    <a href="/gsi/">GSI lookup</a>
    <a href="/questions/">Questions</a>
    <a href="/match-day-checklist/">Match Day checklist</a>
    <a href="/life-insurance/">Life insurance</a>
    <a href="/">Home</a>
  </div>
</footer>
<script src="/assets/js/main.js" defer></script>
</body>
</html>
"""

CTA = """<section class="qa-cta-band">
  <div class="qa-shell qa-cta">
    <div class="qa-cta__text">
      <p class="qa-eyebrow qa-eyebrow--light">Next step</p>
      <h2>Talk with Jay about your situation</h2>
      <p>Answer a few questions, about 2 minutes. Jay reviews your situation and which policies you're eligible for. Conversations are confidential and there's no fee to talk.</p>
    </div>
    <div class="qa-cta__actions">
      <a href="/#questionnaire-embed" class="btn-primary">Start the questionnaire</a>
      <a href="tel:+16094328862" class="qa-cta__tel">or call (609) 432-8862</a>
    </div>
  </div>
</section>
"""

ARROW = '<svg class="qa-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
PLAY = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>'


def page(q, by_slug):
    url = f"{SITE}/questions/{q['slug']}/"
    vid, start = q["video_id"], secs(q["video_ts"])
    upload = VIDEO_BY_ID.get(vid, (vid, None, q["video_title"]))[1]
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": q["title"],
                "description": q["description"],
                "url": url,
                "author": JAY,
                "publisher": {"@id": SITE + "/#organization"},
                "datePublished": PUBLISHED,
                "dateModified": UPDATED,
                "mainEntityOfPage": url,
            },
            {
                "@type": "VideoObject",
                "name": (q["title"] if q.get("clip") else q["video_title"]),
                "description": q["description"],
                **({
                    "thumbnailUrl": f"{SITE}/assets/video/{q['clip']}.jpg",
                    "uploadDate": iso_datetime("2026-10-30"),
                    **({"duration": CLIP_DURATIONS[q["clip"]]} if q["clip"] in CLIP_DURATIONS else {}),
                    "contentUrl": f"{SITE}/assets/video/{q['clip']}.mp4",
                } if q.get("clip") else {
                    "thumbnailUrl": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
                    "uploadDate": iso_datetime(upload),
                    "embedUrl": f"https://www.youtube-nocookie.com/embed/{vid}",
                    "contentUrl": f"https://www.youtube.com/watch?v={vid}",
                }),
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
                    {"@type": "ListItem", "position": 2, "name": "Questions", "item": SITE + "/questions/"},
                    {"@type": "ListItem", "position": 3, "name": q["title"], "item": url},
                ],
            },
        ],
    }
    src_items = []
    for label, ts in q["sources"]:
        v = next((VIDEOS[k] for k in VIDEOS if label.startswith(k)), None)
        name = html.escape(label)
        if v:
            src_items.append(
                f'<li><a href="https://www.youtube.com/watch?v={v[0]}&amp;t={secs(ts)}s"><span class="qa-ts">{PLAY}{ts}</span><span>{name}</span></a></li>'
            )
        else:
            src_items.append(f'<li><span class="qa-ts">{ts}</span><span>{name}</span></li>')
    if q.get("clip"):
        c = q["clip"]
        video_html = f"""<figure class="qa-clip">
      <video src="/assets/video/{c}.mp4" poster="/assets/video/{c}.jpg" controls playsinline preload="none" title="Jay Weinberg answers: {html.escape(q['title'])}"></video>
      <figcaption class="qa-clip__side">
        <span class="qa-video__label">Jay answers it</span>
        <p>A short clip from his webinar for residents and fellows, with captions.</p>
        <a class="qa-link" href="https://www.youtube.com/watch?v={vid}&amp;t={start}s">Watch the full webinar from {q['video_ts']} {ARROW}</a>
      </figcaption>
    </figure>"""
    else:
        video_html = f"""<figure class="qa-video">
      <figcaption class="qa-video__head">
        <span class="qa-video__label">Watch Jay explain it</span>
        <span class="qa-ts">{PLAY}Starts at {q['video_ts']}</span>
      </figcaption>
      <div class="qa-video__frame">
        <iframe src="https://www.youtube-nocookie.com/embed/{vid}?start={start}&amp;rel=0" title="{html.escape(q['video_title'])}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p class="qa-video__source">From “{html.escape(q['video_title'])}”</p>
    </figure>"""
    note_html = (
        f'<aside class="qa-note"><p class="qa-eyebrow">A note from Jay</p><p>{inline(q["note"])}</p></aside>'
        if q.get("note") else ""
    )
    if q["stage"] == "Medical school to residency":
        side_card = ('<p class="qa-side__title">Just matched?</p><p>Work through Jay\'s <a href="/match-day-checklist/">Match Day checklist</a>. '
                     'Disability insurance is usually near the top. <a href="/questions/disability-insurance-before-residency/">Do these three things before you apply</a>.</p>')
    elif q["stage"] == "Life insurance":
        side_card = ('<p class="qa-side__title">Looking at term life?</p><p>Jay offers life insurance too. '
                     '<a href="/life-insurance/">Start a life insurance quote</a> or email <a href="mailto:jay@pgy1.com">jay@pgy1.com</a>.</p>')
    else:
        side_card = ('<p class="qa-side__title">Does your hospital have a GSI policy?</p><p>'
                     '<a href="/gsi/">Look up your hospital</a> on Jay\'s list of teaching hospitals with a GSI, '
                     'or email <a href="mailto:jay@pgy1.com">jay@pgy1.com</a> with where you\'re training.</p>')
    toc = "".join(f'<li><a href="#{slugify(h)}">{inline(h)}</a></li>' for h in headings(q["body"]))
    related = "".join(
        f'<a class="qa-rel" href="/questions/{s}/"><span class="qa-rel__stage">{html.escape(by_slug[s]["stage"])}</span>'
        f'<span class="qa-rel__title">{html.escape(by_slug[s]["title"])}</span>{ARROW}</a>'
        for s in q["related"] if s in by_slug and (is_draft(q) or not is_draft(by_slug[s]))
    )
    return (
        (lambda h: h.replace('<meta name="robots" content="index,follow" />', '<meta name="robots" content="noindex,follow" />') if is_draft(q) else h)(
            head(page_title(q), q["description"], url, ld, og_image=f"{SITE}/assets/og/q-{q['slug']}.jpg"))
        + NAV
        + f"""<header class="qa-hero qa-hero--page">
  <div class="qa-shell">
    <div class="qa-crumbs"><a href="/questions/">Questions</a><span aria-hidden="true">/</span><span>{html.escape(q['stage'])}</span></div>
    <h1>{html.escape(q['title'])}</h1>
    <div class="qa-author">
      <span class="qa-author__mark"><img src="/assets/images/Icon.svg" alt="" width="22" height="22" /></span>
      <span><strong>Jay Weinberg, CLU, ChFC</strong><span>Physician disability insurance specialist · PGY1 Financial Solutions</span><span class="qa-dateline">{"Reviewed by Jay · " if REVIEWED_BY_JAY else ""}Updated <time datetime="{UPDATED}">{pretty_date(UPDATED)}</time></span></span>
    </div>
  </div>
</header>
<main class="qa-shell qa-grid">
  <article class="qa-main">
    <section class="qa-short" aria-label="Short answer">
      <p class="qa-eyebrow">Short answer</p>
      <p class="qa-short__text">{inline(q['short'])}</p>
    </section>
    {note_html}
    {video_html}
    <div class="qa-body">
{body_to_html(q['body'])}
    </div>
    <section class="qa-sources">
      <h2>Where Jay covers this</h2>
      <p>Jump to each moment in his webinars.</p>
      <ul>{''.join(src_items)}</ul>
    </section>
  </article>
  <aside class="qa-side">
    <div class="qa-side__sticky">
      <div class="qa-toc">
        <p class="qa-eyebrow">On this page</p>
        <ol>{toc}</ol>
      </div>
      <div class="qa-side__card">
        {side_card}
        <a href="/#questionnaire-embed" class="btn-primary qa-side__btn">Start the questionnaire</a>
      </div>
    </div>
  </aside>
</main>
<section class="qa-related-band">
  <div class="qa-shell">
    <div class="qa-section-head">
      <h2>Related questions</h2>
      <a href="/questions/" class="qa-link">All questions {ARROW}</a>
    </div>
    <div class="qa-rel-grid">{related}</div>
  </div>
</section>
"""
        + CTA
        + FOOTER
    )


def hub(qs):
    qs = [q for q in qs if not is_draft(q)]
    url = f"{SITE}/questions/"
    stages = [s for s in STAGE_ORDER if any(q["stage"] == s for q in qs)]
    chips = "".join(f'<a href="#{slugify(s)}">{html.escape(s)}</a>' for s in stages)
    groups = []
    for stage in stages:
        items = [q for q in qs if q["stage"] == stage]
        rows = "".join(
            f'<li><a class="qa-row" href="/questions/{q["slug"]}/"><span class="qa-row__text">'
            f'<span class="qa-row__title">{html.escape(q["title"])}</span>'
            f'<span class="qa-row__preview">{inline(first_sentence(q["short"]))}</span></span>{ARROW}</a></li>'
            for q in items
        )
        n = len(items)
        groups.append(
            f'<section class="qa-stage" id="{slugify(stage)}"><div class="qa-stage__head">'
            f'<h2>{html.escape(stage)}</h2><p>{html.escape(STAGE_BLURB.get(stage, ""))}</p>'
            f'<span class="qa-stage__count">{n} question{"s" if n != 1 else ""}</span></div>'
            f'<ul class="qa-rows">{rows}</ul></section>'
        )
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": url,
                "name": "Disability insurance questions for residents and fellows",
                "url": url,
                "isPartOf": {"@id": SITE + "/#website"},
                "publisher": {"@id": SITE + "/#organization"},
                "author": JAY,
                "hasPart": [{"@type": "Article", "headline": q["title"], "url": f"{SITE}/questions/{q['slug']}/"} for q in qs],
                "mainEntity": {
                    "@type": "ItemList",
                    "numberOfItems": len(qs),
                    "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": q["title"],
                                         "url": f"{SITE}/questions/{q['slug']}/"} for i, q in enumerate(qs)],
                },
            },
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
                {"@type": "ListItem", "position": 2, "name": "Questions", "item": url}]},
        ],
    }
    desc = "Jay Weinberg, CLU, ChFC, answers the disability insurance questions residents, fellows and MS4s ask most, with clips from his webinars."
    return (
        head("Disability Insurance Questions from Residents | PGY1.com", desc, url, ld, og_image=f"{SITE}/assets/og/questions.jpg", og_type="website")
        + NAV
        + f"""<header class="qa-hero qa-hero--hub">
  <div class="qa-shell">
    <p class="qa-eyebrow qa-eyebrow--light">Questions, answered by Jay</p>
    <h1>Disability insurance questions from residents and fellows</h1>
    <p class="qa-lede">Short answers first, then Jay's full explanation from his webinars, with the video cued to the moment he answers it.</p>
    <div class="qa-chips">{chips}</div>
  </div>
</header>
<main class="qa-shell qa-hub">
"""
        + "\n".join(groups)
        + "</main>\n"
        + CTA
        + FOOTER
    )


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "../Question Pages - Draft Content.md"
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    qs = parse(src)
    by_slug = {q["slug"]: q for q in qs}
    for q in qs:
        d = os.path.join(root, "questions", q["slug"])
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
            f.write(page(q, by_slug))
    with open(os.path.join(root, "questions", "index.html"), "w", encoding="utf-8") as f:
        f.write(hub(qs))
    missing = [(q["slug"], s) for q in qs for s in q["related"] if s not in by_slug]
    print(f"Built {len(qs)} question pages + hub. Draft/noindex: {DRAFT}")
    if missing:
        print("Related slugs not found:", missing)


if __name__ == "__main__":
    main()
