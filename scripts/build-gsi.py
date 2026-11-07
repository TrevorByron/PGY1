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


# Titles Google won't cut off (about 60 characters). Longest-first fallbacks, then a few by hand.
TITLE_OVERRIDES = {
    "NewYork-Presbyterian Morgan Stanley Children's Hospital": "Morgan Stanley Children's Hospital GSI Disability Insurance",
    "NewYork-Presbyterian / Weill Cornell": "NewYork-Presbyterian Weill Cornell GSI Disability Insurance",
}


def desc_for(name, short_name, limit=155):
    """Meta description that fits: full name, then the abbreviation in parentheses, then a shorter form."""
    abbr = re.search(r"\(([^)]+)\)\s*$", name)
    alt = TITLE_OVERRIDES.get(name, "").replace(" GSI Disability Insurance", "")
    for n in (short_name, abbr.group(1) if abbr else "", alt):
        if not n:
            continue
        d = f"Residents and fellows at {n} can get a Guardian GSI disability policy through Jay Weinberg, with no health questions."
        if len(d) <= limit:
            return d + (" Get it before any other application." if len(d) + 37 <= limit else "")
    return d


def seo_title(name, short_name, limit=60):
    if name in TITLE_OVERRIDES:
        return TITLE_OVERRIDES[name]
    abbr = re.search(r"\(([^)]+)\)\s*$", name)
    for t in (f"{name} GSI Disability Insurance | PGY1.com",
              f"{short_name} GSI Disability Insurance | PGY1.com",
              f"{short_name} GSI Disability Insurance",
              *( [f"{abbr.group(1)} GSI Disability Insurance | PGY1.com"] if abbr else [] )):
        if len(t) <= limit:
            return t
    return f"{short_name} GSI Disability Insurance"


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower().replace("&", "and").replace("'", "").replace("’", "")).strip("-")


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
            f'<li><a href="/gsi/{slugify(r["display"])}/"'
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
    desc = ("Does your residency hospital offer a GSI disability policy with no health questions? Search the "
            + str(len(rows)) + " teaching hospitals where Jay Weinberg offers one.")
    multi = sum(1 for r in rows if len(r["states"]) > 1)
    # count is unique hospitals; a few systems are listed under more than one state
    multi_note = f" ({multi} {'system appears' if multi == 1 else 'systems appear'} under more than one state)" if multi else ""
    return (
        bq.head("Does Your Hospital Have a GSI Disability Policy? | PGY1.com", desc, url, ld, og_image=bq.SITE + "/assets/og/gsi.jpg", og_type="website")
        .replace('<link rel="stylesheet" href="/assets/css/refresh.css" />',
                 '<link rel="stylesheet" href="/assets/css/gsi.css" />\n  <link rel="stylesheet" href="/assets/css/refresh.css" />')
        + bq.NAV
        + f"""<header class="qa-hero gsi-hero">
  <div class="qa-shell">
      <p class="qa-eyebrow qa-eyebrow--light">GSI lookup</p>
      <h1>Does your hospital have a <em>GSI</em> policy?</h1>
      <p class="qa-lede">Jay offers a Guardian guaranteed standard issue policy, with no health questions, to residents and fellows at the hospitals below. Type your hospital, program or medical school.</p>
      <form class="gsi-search" role="search" action="/gsi/" method="get" autocomplete="off">
        <label for="gsi-q" class="gsi-sr">Hospital or program</label>
        <svg class="gsi-search__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input id="gsi-q" name="q" type="search" placeholder="e.g. Penn, Mass General, Bellevue, UCSF" role="combobox" aria-expanded="false" aria-controls="gsi-options" aria-autocomplete="list" />
        <button type="submit" class="btn-primary">Check</button>
        <ul id="gsi-options" class="gsi-options" role="listbox" hidden></ul>
      </form>
      <div id="gsi-result" class="gsi-result" aria-live="polite" hidden></div>
      <p class="gsi-hero__count">{len(rows)} hospitals and programs · as of {AS_OF} · don't see yours? <a href="mailto:jay@pgy1.com">Ask Jay</a></p>
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
        <h2>The {len(rows)} hospitals and programs Jay works with</h2>
        <p>Grouped by state{multi_note}. Offers can change, and Jay confirms eligibility before you apply. Don't see your program? <a href="mailto:jay@pgy1.com">Ask Jay</a> and he'll find out.</p>
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


# Jay's Guardian GSI, from the brochure linked on his quote page. Same for every hospital on his list.
BROCHURE = ("Guardian GSI brochure on Jay's quote page (2025)", "https://www.disabilityquotes.com/pages/pages/brochure/10061")
GSI_FACTS = [
    ("Health questions", "None. Guaranteed standard issue, no medical underwriting"),
    ("Insurance company", "Guardian (issued by Berkshire Life Insurance Company of America, a Guardian subsidiary)"),
    ("Definition of disability", "True own occupation to age 67, with medical specialty language"),
    ("Monthly benefit", "Up to $8,000, subject to new-professional limits, or up to $15,000 with financial underwriting"),
    ("Increase later", "Future Increase Option rider or Benefit Purchase Rider: add coverage later without health questions, up to $15,000 total"),
    ("Waiting period", "90 days"),
    ("Benefits paid to", "Age 67"),
    ("Mental health claims", "Paid for up to 24 months"),
    ("Partial disability", "Enhanced Partial Benefit rider: triggered by a 15% loss of income, or of time or duties"),
]
QUESTIONS = ["what-is-gsi-disability-insurance", "group-disability-insurance-enough", "do-gsi-policies-cost-more",
             "gsi-eligibility-and-limitations", "mental-health-and-disability-insurance", "already-applied-can-i-still-get-gsi"]


def load_programs(rows):
    """data/gsi-programs/*.json: hospital-specific content (published group coverage, program notes) keyed by `hospital`."""
    names = {r["name"] for r in rows}
    extra = {}
    folder = os.path.join(ROOT, "data", "gsi-programs")
    for fn in sorted(os.listdir(folder)) if os.path.isdir(folder) else []:
        if fn.endswith(".json"):
            pr = json.load(open(os.path.join(folder, fn)))
            assert pr["hospital"] in names, f"{fn}: hospital not in gsi-hospitals.csv: {pr['hospital']}"
            extra[pr["hospital"]] = pr
    return extra


def question_title(slug):
    path = os.path.join(ROOT, "questions", slug, "index.html")
    m = re.search(r"<h1>(.*?)</h1>", open(path).read(), re.S) if os.path.exists(path) else None
    assert m, f"question page not built: {slug} (run build-questions.py first)"
    return html.unescape(m.group(1))


def table(rows):
    return '<table class="gsi-table">' + "".join(
        f"<tr><th scope=\"row\">{html.escape(k)}</th><td>{html.escape(v)}</td></tr>" for k, v in rows) + "</table>"


def profile_page(r, pr):
    """One profile per hospital on Jay's list. Indexable only when it carries something specific to that hospital."""
    name = r["display"]
    short_name = re.sub(r"\s*\(.*?\)\s*$", "", name)
    url = f"{bq.SITE}{r['page']}"
    where_ = ", ".join(STATES[s] for s in r["states"])
    specific = bool(pr and (pr.get("group") or pr.get("specific")))
    sources = [BROCHURE]
    toc = [("at-a-glance", "Jay's Guardian GSI at a glance")]
    body = []
    if pr and pr.get("specific"):
        sp = pr["specific"]
        body.append(f'<h2 id="program">{html.escape(sp["title"])}</h2><p>{html.escape(sp["body"])}</p>')
        sources.append(tuple(sp["source"]))
        toc.insert(0, ("program", sp["title"]))
    if pr and pr.get("group"):
        gr = pr["group"]
        note = f'<p class="gsi-table__note">{html.escape(pr["group_note"])}</p>' if pr.get("group_note") else ""
        body.append(
            f'<h2 id="already-covered">What {html.escape(short_name)} already gives you</h2>'
            f'<p>Residents here get group disability coverage through their employer. It\'s a good start, but group policies are usually capped, '
            f'tied to the job and taxable when they pay out. Jay\'s view: make an individual policy your primary line of defense and layer the group coverage behind it.</p>'
            + table(gr["rows"])
            + f'<p class="gsi-table__note">Source: <a href="{html.escape(gr["source"][1])}" rel="nofollow">{html.escape(gr["source"][0])}</a>. Plan documents govern.</p>'
            + note
            + f'<p><a class="qa-link" href="/questions/group-disability-insurance-enough/">Is group disability insurance enough? {bq.ARROW}</a></p>'
        )
        sources.append(tuple(gr["source"]))
        toc.insert(0 if not (pr.get("specific")) else 1, ("already-covered", f"What {short_name} already gives you"))
    body.append(
        '<h2 id="at-a-glance">Jay\'s Guardian GSI at a glance</h2>'
        + table(GSI_FACTS)
        + f'<p class="gsi-table__note">From the {html.escape(BROCHURE[0])}. Optional riders cost extra, terms vary by state, and offers can change. '
        f'Jay confirms the current details for {html.escape(short_name)} before you apply.</p>'
        '<h2 id="before-you-apply">Get it before any other application</h2>'
        '<p>Most GSI policies ask whether you\'ve applied for disability insurance before. If you have, there\'s a good chance you won\'t be eligible, '
        'so lock in the GSI first, then decide whether to add anything on top.</p>'
    )
    toc.append(("before-you-apply", "Get it before any other application"))
    toc.append(("program-questions", "Questions residents ask"))
    clip = "apply-underwritten-before-gsi"
    clip_html = f"""<figure class="qa-clip">
      <video src="/assets/video/{clip}.mp4" poster="/assets/video/{clip}.jpg" controls playsinline preload="none" title="Jay Weinberg answers: Should I apply before checking for a GSI?"></video>
      <figcaption class="qa-clip__side">
        <span class="qa-video__label">Should I apply before checking for a GSI?</span>
        <p>Jay's answer, from his webinar for residents and fellows.</p>
        <a class="qa-link" href="/questions/{clip}/">Read the full answer {bq.ARROW}</a>
      </figcaption>
    </figure>"""
    qs = "".join(
        f'<a class="qa-rel" href="/questions/{q}/"><span class="qa-rel__stage">Jay answers</span>'
        f'<span class="qa-rel__title">{html.escape(question_title(q))}</span>{bq.ARROW}</a>' for q in QUESTIONS)
    src = "".join(f'<li><a href="{html.escape(u)}" rel="nofollow">{html.escape(t)}</a></li>' for t, u in dict.fromkeys(sources))
    title = f"{name} GSI disability insurance"
    desc = desc_for(name, short_name)
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "WebPage", "name": title, "description": desc, "url": url, "author": bq.JAY,
             "datePublished": bq.PUBLISHED, "dateModified": bq.UPDATED, "publisher": {"@id": bq.SITE + "/#organization"},
             "about": {"@type": "Hospital", "name": name,
                       "address": {"@type": "PostalAddress", **({"addressLocality": pr["city"]} if pr and pr.get("city") else {}),
                                   "addressRegion": r["states"][0], "addressCountry": "US"}}},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "GSI lookup", "item": bq.SITE + "/gsi/"},
                {"@type": "ListItem", "position": 2, "name": name, "item": url}]},
        ],
    }
    head = bq.head(seo_title(name, short_name), desc, url, ld, og_image=f"{bq.SITE}/assets/og/gsi-{slugify(r['display'])}.jpg").replace(
        '<link rel="stylesheet" href="/assets/css/refresh.css" />',
        '<link rel="stylesheet" href="/assets/css/gsi.css" />\n  <link rel="stylesheet" href="/assets/css/refresh.css" />')
    if not specific:  # generic profiles stay out of search until Jay adds something specific
        head = head.replace('<meta name="robots" content="index,follow" />', '<meta name="robots" content="noindex,follow" />')
    sys_line = f"{r['system']} · " if r["system"] else ""
    return (
        head + bq.NAV
        + f"""<header class="qa-hero qa-hero--page gsi-program-hero">
  <div class="qa-shell">
    <div class="qa-crumbs"><a href="/gsi/">GSI lookup</a><span aria-hidden="true">/</span><span>{html.escape(where_)}</span></div>
    <p class="gsi-card__status gsi-program-status"><span class="gsi-dot"></span>Jay offers a GSI here</p>
    <h1>{html.escape(title)}</h1>
    <p class="qa-lede">{html.escape(sys_line)}{html.escape((pr or {}).get('city', '') + ', ' if (pr or {}).get('city') else '')}{html.escape(where_)}</p>
    <div class="qa-author">
      <span class="qa-author__mark"><img src="/assets/images/Icon.svg" alt="" width="22" height="22" /></span>
      <span><strong>Jay Weinberg, CLU, ChFC</strong><span>Offers Guardian GSI policies at {html.escape(short_name)} · PGY1 Financial Solutions</span><span class="qa-dateline">{"Reviewed by Jay · " if bq.REVIEWED_BY_JAY else ""}Updated <time datetime="{bq.UPDATED}">{bq.pretty_date(bq.UPDATED)}</time></span></span>
    </div>
  </div>
</header>
<main class="qa-shell qa-grid">
  <article class="qa-main">
    <section class="qa-short" aria-label="Short answer">
      <p class="qa-eyebrow">Can {html.escape(short_name)} residents get a GSI policy?</p>
      <p class="qa-short__text">Yes. Jay offers a Guardian GSI policy to residents and fellows at {html.escape(short_name)}: no health questions, true own-occupation coverage with medical specialty language, and up to $8,000 a month to start, with room to increase later. Get it before you complete any other disability application.</p>
    </section>
    <div class="qa-body">
      {''.join(body)}
    </div>
    {clip_html}
    <div class="qa-body"><h2 id="program-questions">Questions residents ask</h2></div>
    <div class="gsi-program-questions">{qs}</div>
    <section class="qa-sources">
      <h2>Sources</h2>
      <ul class="gsi-sources">{src}</ul>
    </section>
  </article>
  <aside class="qa-side">
    <div class="qa-side__sticky">
      <div class="qa-toc">
        <p class="qa-eyebrow">On this page</p>
        <ol>{''.join(f'<li><a href="#{i}">{html.escape(t)}</a></li>' for i, t in toc)}</ol>
      </div>
      <div class="gsi-side__card">
        <img src="/assets/images/jay-face.jpg" alt="" width="64" height="64" />
        <p class="gsi-side__name">Jay Weinberg, CLU, ChFC</p>
        <p class="gsi-side__label">Offers this policy to residents and fellows at {html.escape(short_name)}</p>
        <a class="btn-primary" href="/#questionnaire-embed">Start the questionnaire</a>
        <a class="gsi-side__tel" href="tel:+16094328862">or call (609) 432-8862</a>
      </div>
    </div>
  </aside>
</main>
"""
        + bq.CTA + bq.FOOTER
    )


def main():
    rows = load()
    extra = load_programs(rows)
    for r in rows:
        r["page"] = f"/gsi/{slugify(r['display'])}/"
    data = [{"id": r["id"], "d": r["display"], "y": r["system"], "n": r["name"], "st": r["states"], "a": r["aliases"], "p": r["page"]} for r in rows]
    with open(os.path.join(ROOT, "assets", "js", "gsi-data.js"), "w") as f:
        f.write("/* Generated by scripts/build-gsi.py from data/gsi-hospitals.csv. Don't edit by hand. */\n")
        f.write("window.GSI_HOSPITALS=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    out = os.path.join(ROOT, "gsi", "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w").write(page(rows))
    n_specific = 0
    for r in rows:
        pr = extra.get(r["name"])
        n_specific += bool(pr and (pr.get("group") or pr.get("specific")))
        out = os.path.join(ROOT, r["page"].strip("/"), "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w").write(profile_page(r, pr))
    print(f"Built /gsi/ and {len(rows)} hospital profiles ({n_specific} with hospital-specific content). Draft/noindex: {bq.DRAFT}")


if __name__ == "__main__":
    main()
