#!/usr/bin/env python3
"""Build the GSI hospital lookup at /gsi/ from data/gsi-hospitals.csv.

Usage (from the site root):
    python3 scripts/build-gsi.py

data/gsi-hospitals.csv columns:
    name     exactly as it appears in Jay's Guardian quote dropdown (disabilityquotes.com/pgy1)
    display  the name shown to people (cleaned up: no "| Medical", state codes spelled out by the page)
    system   parent health system, if any (groups siblings on the profile)
    state    two-letter code; several separated by ";" (e.g. "IN;KY;IL")
    aliases  other names people type, separated by ";" (short names, abbreviations, cities, flagship hospitals)

To update the list: edit the CSV, set AS_OF, rebuild. Shares DRAFT, nav and footer with build-questions.py.
"""
import csv
import html
import importlib.util
import json
import os
import re

AS_OF = "October 2026"
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

spec = importlib.util.spec_from_file_location("bq", os.path.join(HERE, "build-questions.py"))
bq = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bq)

STATES = {
    "AL": "Alabama", "AR": "Arkansas", "AZ": "Arizona", "CA": "California", "CT": "Connecticut", "DC": "District of Columbia",
    "DE": "Delaware", "FL": "Florida", "GA": "Georgia", "IL": "Illinois", "IN": "Indiana", "KY": "Kentucky", "LA": "Louisiana",
    "MA": "Massachusetts", "MD": "Maryland", "ME": "Maine", "MI": "Michigan", "MN": "Minnesota", "MO": "Missouri",
    "MS": "Mississippi", "NC": "North Carolina", "NE": "Nebraska", "NH": "New Hampshire", "NJ": "New Jersey",
    "NM": "New Mexico", "NV": "Nevada", "NY": "New York", "OH": "Ohio", "OK": "Oklahoma", "PA": "Pennsylvania",
    "RI": "Rhode Island", "SC": "South Carolina", "TN": "Tennessee", "TX": "Texas", "VA": "Virginia", "VT": "Vermont",
    "WA": "Washington", "WI": "Wisconsin",
}


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower().replace("&", "and")).strip("-")


def load():
    rows = []
    with open(os.path.join(ROOT, "data", "gsi-hospitals.csv"), newline="") as f:
        for r in csv.DictReader(f):
            states = [s.strip() for s in r["state"].split(";") if s.strip()]
            for s in states:
                assert s in STATES, f"unknown state {s} for {r['name']}"
            rows.append({
                "id": slugify(r["name"]),
                "name": r["name"].strip(),
                "display": r["display"].strip(),
                "system": r["system"].strip(),
                "states": states,
                "aliases": [a.strip() for a in r["aliases"].split(";") if a.strip()],
            })
    ids = [r["id"] for r in rows]
    assert len(ids) == len(set(ids)), "duplicate hospital ids"
    return rows


def page(rows):
    url = f"{bq.SITE}/gsi/"
    data = [{"id": r["id"], "d": r["display"], "y": r["system"], "n": r["name"], "st": r["states"], "a": r["aliases"]} for r in rows]
    by_state = {}
    for r in rows:
        for st in r["states"]:
            by_state.setdefault(st, []).append(r)
    state_keys = sorted(by_state, key=lambda st: STATES[st])
    groups = []
    for st in state_keys:
        items = sorted(by_state[st], key=lambda r: r["display"].lower())
        lis = "".join(
            (f'<li><a href="{r["page"]}" class="has-page"' if r.get("page") else f'<li><a href="/gsi/?h={r["id"]}" data-id="{r["id"]}"')
            + ""
            + (f' title="{html.escape(r["system"])}"' if r["system"] else "")
            + f'>{html.escape(r["display"])}</a></li>'
            for r in items
        )
        groups.append(f'<section class="gsi-state" id="state-{st.lower()}"><h3>{STATES[st]}</h3><ul>{lis}</ul></section>')
    ld = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "GSI disability insurance hospital lookup for residents and fellows",
        "url": url,
        "about": "Teaching hospitals where residents and fellows can get a guaranteed standard issue (GSI) disability insurance policy",
        "publisher": {"@type": "Organization", "name": "PGY1 Financial Solutions Corp", "url": bq.SITE},
    }
    desc = ("Check whether your residency or fellowship hospital offers a guaranteed standard issue (GSI) disability policy, "
            "with no health questions. Jay Weinberg's list of " + str(len(rows)) + " teaching hospitals and programs.")
    return (
        bq.head("Does Your Hospital Have a GSI Disability Policy? | PGY1.com", desc, url, ld)
        .replace('<link rel="stylesheet" href="/assets/css/refresh.css" />',
                 '<link rel="stylesheet" href="/assets/css/gsi.css" />\n  <link rel="stylesheet" href="/assets/css/refresh.css" />')
        + bq.NAV
        + f"""<header class="qa-hero gsi-hero">
  <div class="qa-shell">
      <p class="qa-eyebrow qa-eyebrow--light">GSI lookup</p>
      <h1>Does your hospital have a <em>GSI</em> policy?</h1>
      <p class="qa-lede">Jay keeps a list of the teaching hospitals where residents and fellows can get a Guardian guaranteed standard issue policy, with no health questions. Type your hospital, program or medical school.</p>
      <form class="gsi-search" role="search" action="/gsi/" method="get" autocomplete="off">
        <label for="gsi-q" class="gsi-sr">Hospital or program</label>
        <svg class="gsi-search__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input id="gsi-q" name="q" type="search" placeholder="e.g. Penn, Mass General, Bellevue, UCSF" role="combobox" aria-expanded="false" aria-controls="gsi-options" aria-autocomplete="list" />
        <button type="submit" class="btn-primary">Check</button>
        <ul id="gsi-options" class="gsi-options" role="listbox" hidden></ul>
      </form>
      <div id="gsi-result" class="gsi-result" aria-live="polite" hidden></div>
      <p class="gsi-hero__count">{len(rows)} hospitals and programs · list as of {AS_OF}</p>
  </div>
</header>
<main>
  <section class="gsi-why">
    <div class="qa-shell gsi-why__grid">
      <div>
        <p class="qa-eyebrow">Why check first</p>
        <h2>Find out before you fill out any other application</h2>
      </div>
      <ol class="gsi-why__list">
        <li><strong>No health questions.</strong> The insurance company issues the policy without looking at your medical records, usually within a few days.</li>
        <li><strong>Applying elsewhere first can rule you out.</strong> Most GSI policies ask whether you've already applied for disability insurance. If you have, there's a good chance you won't be eligible.</li>
        <li><strong>Your GME office probably can't tell you.</strong> GSI policies are individual policies, not part of your hospital's benefits, so they usually won't show up at open enrollment.</li>
      </ol>
    </div>
    <div class="qa-shell gsi-why__links">
      <a class="qa-rel" href="/questions/what-is-gsi-disability-insurance/"><span class="qa-rel__stage">Watch Jay explain</span><span class="qa-rel__title">What is a GSI disability policy?</span>{bq.ARROW}</a>
      <a class="qa-rel" href="/questions/apply-underwritten-before-gsi/"><span class="qa-rel__stage">Watch Jay explain</span><span class="qa-rel__title">Should I apply before checking for a GSI?</span>{bq.ARROW}</a>
      <a class="qa-rel" href="/questions/why-gme-cant-tell-you-about-gsi/"><span class="qa-rel__stage">Watch Jay explain</span><span class="qa-rel__title">Why can't my GME office tell me?</span>{bq.ARROW}</a>
    </div>
  </section>
  <section class="gsi-all" id="all">
    <div class="qa-shell">
      <div class="gsi-all__head">
        <h2>All {len(rows)} hospitals and programs on Jay's list</h2>
        <p>Grouped by state. GSI offers can change or end at any time, and some hospitals have a GSI through another insurance company. Jay confirms eligibility before you apply.</p>
      </div>
      <div class="gsi-states">
{chr(10).join(groups)}
      </div>
    </div>
  </section>
</main>
"""
        + bq.CTA
        + '<script src="/assets/js/gsi-data.js" defer></script>\n'
        + '<script src="/assets/js/gsi-lookup.js" defer></script>\n'
        + bq.FOOTER
    )


def load_programs(rows):
    """data/gsi-programs/*.json: full pages for hospitals Jay has a direct relationship with."""
    by_name = {r["name"]: r for r in rows}
    progs = []
    folder = os.path.join(ROOT, "data", "gsi-programs")
    for fn in sorted(os.listdir(folder)) if os.path.isdir(folder) else []:
        if not fn.endswith(".json"):
            continue
        pr = json.load(open(os.path.join(folder, fn)))
        assert pr["hospital"] in by_name, f"{fn}: hospital not in gsi-hospitals.csv: {pr['hospital']}"
        pr["row"] = by_name[pr["hospital"]]
        progs.append(pr)
    return progs


def question_title(slug):
    path = os.path.join(ROOT, "questions", slug, "index.html")
    m = re.search(r"<h1>(.*?)</h1>", open(path).read(), re.S) if os.path.exists(path) else None
    assert m, f"question page not built: {slug} (run build-questions.py first)"
    return html.unescape(m.group(1))


def program_page(pr):
    r = pr["row"]
    url = f"{bq.SITE}/gsi/{pr['slug']}/"
    state = r["states"][0]
    facts = "".join(f"<tr><th scope=\"row\">{html.escape(k)}</th><td>{html.escape(v)}</td></tr>" for k, v in pr["facts"])
    qs = "".join(
        f'<a class="qa-rel" href="/questions/{s}/"><span class="qa-rel__stage">Jay answers</span>'
        f'<span class="qa-rel__title">{html.escape(question_title(s))}</span>{bq.ARROW}</a>'
        for s in pr["questions"]
    )
    sources = "".join(f'<li><a href="{html.escape(u)}" rel="nofollow">{html.escape(t)}</a></li>' for t, u in pr["sources"])
    clip = pr.get("clip")
    clip_html = (
        f"""<figure class="qa-clip">
      <video src="/assets/video/{clip}.mp4" poster="/assets/video/{clip}.jpg" controls playsinline preload="none" title="Jay Weinberg answers: {html.escape(pr['clip_title'])}"></video>
      <figcaption class="qa-clip__side">
        <span class="qa-video__label">{html.escape(pr['clip_title'])}</span>
        <p>Jay's answer, from his webinar for residents and fellows.</p>
        <a class="qa-link" href="/questions/{clip}/">Read the full answer {bq.ARROW}</a>
      </figcaption>
    </figure>"""
        if clip else ""
    )
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "name": pr["title"],
                "description": pr["description"],
                "url": url,
                "author": bq.JAY,
                "datePublished": bq.PUBLISHED,
                "dateModified": bq.UPDATED,
                "about": {"@type": "Hospital", "name": r["display"],
                          "address": {"@type": "PostalAddress", "addressLocality": pr.get("city", ""), "addressRegion": state, "addressCountry": "US"}},
                "publisher": {"@id": bq.SITE + "/#organization"},
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "GSI lookup", "item": bq.SITE + "/gsi/"},
                    {"@type": "ListItem", "position": 2, "name": r["display"], "item": url},
                ],
            },
        ],
    }
    head = bq.head(pr["seo_title"], pr["description"], url, ld).replace(
        '<link rel="stylesheet" href="/assets/css/refresh.css" />',
        '<link rel="stylesheet" href="/assets/css/gsi.css" />\n  <link rel="stylesheet" href="/assets/css/refresh.css" />')
    return (
        head
        + bq.NAV
        + f"""<header class="qa-hero qa-hero--page gsi-program-hero">
  <div class="qa-shell">
    <div class="qa-crumbs"><a href="/gsi/">GSI lookup</a><span aria-hidden="true">/</span><span>{STATES[state]}</span></div>
    <p class="gsi-card__status gsi-program-status"><span class="gsi-dot"></span>On Jay's GSI list</p>
    <h1>{html.escape(pr['title'])}</h1>
    <p class="qa-lede">{html.escape(pr['lede'])}</p>
    <div class="qa-author">
      <span class="qa-author__mark"><img src="/assets/images/Icon.svg" alt="" width="22" height="22" /></span>
      <span><strong>Jay Weinberg, CLU, ChFC</strong><span>Broker for Cooper's GSI program · PGY1 Financial Solutions</span><span class="qa-dateline">{"Reviewed by Jay · " if bq.REVIEWED_BY_JAY else ""}Updated <time datetime="{bq.UPDATED}">{bq.pretty_date(bq.UPDATED)}</time></span></span>
    </div>
  </div>
</header>
<main class="qa-shell qa-grid">
  <article class="qa-main">
    <section class="qa-short" aria-label="Short answer">
      <p class="qa-eyebrow">Can Cooper residents get a GSI policy?</p>
      <p class="qa-short__text">{html.escape(pr['short'])}</p>
    </section>
    <div class="qa-body">
      <h2 id="at-a-glance">Cooper's GSI at a glance</h2>
      <table class="gsi-table">{facts}</table>
      <p class="gsi-table__note">{html.escape(pr['facts_note'])}</p>
      <h2 id="before-you-apply">Get it before any other application</h2>
      <p>Most GSI policies ask whether you've applied for disability insurance before. If you have, there's a good chance you won't be eligible, so lock in the GSI first, then decide whether to add anything on top.</p>
    </div>
    {clip_html}
    <div class="qa-body">
      <h2 id="program-questions">Questions Cooper residents ask</h2>
    </div>
    <div class="gsi-program-questions">{qs}</div>
    <section class="qa-sources">
      <h2>Sources</h2>
      <ul class="gsi-sources">{sources}</ul>
    </section>
  </article>
  <aside class="qa-side">
    <div class="qa-side__sticky">
      <div class="qa-toc">
        <p class="qa-eyebrow">On this page</p>
        <ol><li><a href="#at-a-glance">Cooper's GSI at a glance</a></li><li><a href="#before-you-apply">Get it before any other application</a></li><li><a href="#program-questions">Questions Cooper residents ask</a></li></ol>
      </div>
      <div class="gsi-side__card">
        <img src="/assets/images/jay-face.jpg" alt="" width="64" height="64" />
        <p class="gsi-side__name">Jay Weinberg, CLU, ChFC</p>
        <p class="gsi-side__label">Places Cooper's GSI policy for residents and fellows</p>
        <a class="btn-primary" href="/#questionnaire-embed">Start the questionnaire</a>
        <a class="gsi-side__tel" href="tel:+16094328862">or call (609) 432-8862</a>
      </div>
    </div>
  </aside>
</main>
"""
        + bq.CTA
        + bq.FOOTER
    )


def main():
    rows = load()
    progs = load_programs(rows)
    for pr in progs:
        pr["row"]["page"] = f"/gsi/{pr['slug']}/"
    data = [{"id": r["id"], "d": r["display"], "y": r["system"], "n": r["name"], "st": r["states"], "a": r["aliases"],
             **({"p": r["page"]} if r.get("page") else {})} for r in rows]
    with open(os.path.join(ROOT, "assets", "js", "gsi-data.js"), "w") as f:
        f.write("/* Generated by scripts/build-gsi.py from data/gsi-hospitals.csv. Don't edit by hand. */\n")
        f.write("window.GSI_HOSPITALS=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    out = os.path.join(ROOT, "gsi", "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w").write(page(rows))
    for pr in progs:
        out = os.path.join(ROOT, "gsi", pr["slug"], "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w").write(program_page(pr))
    print(f"Built /gsi/ with {len(rows)} hospitals and {len(progs)} program page(s). Draft/noindex: {bq.DRAFT}")


if __name__ == "__main__":
    main()
