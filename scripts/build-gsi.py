#!/usr/bin/env python3
"""Build the GSI hospital lookup at /gsi/ from data/gsi-hospitals.csv.

Usage (from the site root):
    python3 scripts/build-gsi.py

data/gsi-hospitals.csv columns:
    name     exactly as it appears in Jay's Guardian quote dropdown (disabilityquotes.com/pgy1)
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
            parts = [p.strip() for p in r["name"].split("|")]
            rows.append({
                "id": slugify(r["name"]),
                "name": r["name"].strip(),
                "title": parts[0],
                "sub": " · ".join(parts[1:]),
                "states": states,
                "aliases": [a.strip() for a in r["aliases"].split(";") if a.strip()],
            })
    ids = [r["id"] for r in rows]
    assert len(ids) == len(set(ids)), "duplicate hospital ids"
    return rows


def page(rows):
    url = f"{bq.SITE}/gsi/"
    data = [{"id": r["id"], "t": r["title"], "s": r["sub"], "st": r["states"], "a": r["aliases"]} for r in rows]
    by_state = {}
    for r in rows:
        for s in r["states"]:
            by_state.setdefault(s, []).append(r)
    state_keys = sorted(by_state, key=lambda s: STATES[s])
    jump = "".join(f'<a href="#state-{s.lower()}">{s}</a>' for s in state_keys)
    groups = []
    for s in state_keys:
        items = sorted(by_state[s], key=lambda r: r["name"].lower())
        lis = "".join(
            f'<li id="h-{r["id"]}" data-id="{r["id"]}"><span class="gsi-list__name">{html.escape(r["title"])}</span>'
            + (f'<span class="gsi-list__sub">{html.escape(r["sub"])}</span>' if r["sub"] else "")
            + "</li>"
            for r in items
        )
        groups.append(
            f'<section class="gsi-state" id="state-{s.lower()}"><h3>{STATES[s]} <span>{len(items)}</span></h3><ul>{lis}</ul></section>'
        )
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
        <div>
          <p class="qa-eyebrow">The full list</p>
          <h2>Every hospital on Jay's GSI list, by state</h2>
        </div>
        <p>GSI offers can change or end at any time, and some hospitals have GSIs through other insurance companies that aren't on this list. Jay confirms eligibility before you apply.</p>
      </div>
      <div class="gsi-jump">{jump}</div>
      <div class="gsi-states">
{chr(10).join(groups)}
      </div>
    </div>
  </section>
</main>
"""
        + bq.CTA
        + f'<script>window.GSI_HOSPITALS={json.dumps(data, ensure_ascii=False, separators=(",", ":"))};</script>\n'
        + '<script src="/assets/js/gsi-lookup.js" defer></script>\n'
        + bq.FOOTER
    )


def main():
    rows = load()
    out = os.path.join(ROOT, "gsi", "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w").write(page(rows))
    print(f"Built /gsi/ with {len(rows)} hospitals. Draft/noindex: {bq.DRAFT}")


if __name__ == "__main__":
    main()
