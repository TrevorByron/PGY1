#!/usr/bin/env python3
"""Build the standalone pages that share the question-page shell:

    about/index.html                 About Jay Weinberg
    match-day-checklist/index.html   Jay's checklist for the move from MS4 to PGY1

Everything stated here comes from Jay's own words in his 2026 webinars or from the homepage.
The webinar each fact comes from is noted next to it. Noindex until LAUNCH = True in site_config.py.
"""
import html
import importlib.util
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
spec = importlib.util.spec_from_file_location("bq", os.path.join(HERE, "build-questions.py"))
bq = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bq)
SITE = bq.SITE
YT_CHANNEL = "https://www.youtube.com/@JayWeinbergDisabilityInsurance"

PERSON = {
    "@type": "Person",
    "@id": SITE + "/#jay",
    "name": "Jay Weinberg",
    "honorificSuffix": "CLU, ChFC",
    "jobTitle": "Founder",
    "worksFor": {"@id": SITE + "/#organization"},
    "url": SITE + "/about/",
    "image": SITE + "/assets/images/jay-headshot.jpg",
    "description": "Independent disability insurance broker who works exclusively with physicians, "
                   "specializing in coverage for medical students, residents and fellows.",
    "award": "#1 Individual Disability Insurance Broker Award with Guardian (2024 and 2025)",
    "hasCredential": [
        {"@type": "EducationalOccupationalCredential", "name": "Chartered Life Underwriter (CLU)", "credentialCategory": "Professional designation"},
        {"@type": "EducationalOccupationalCredential", "name": "Chartered Financial Consultant (ChFC)", "credentialCategory": "Professional designation"},
    ],
    "knowsAbout": ["Physician disability insurance", "Guaranteed standard issue (GSI) disability insurance",
                   "True own-occupation disability insurance", "Life insurance for physicians"],
    "sameAs": [YT_CHANNEL, "https://www.emra.org/jay-weinberg"],
}


from site_config import LICENSE_NPN, LICENSED_STATES  # noqa: E402

if LICENSE_NPN:
    PERSON["identifier"] = {"@type": "PropertyValue", "propertyID": "NPN", "value": LICENSE_NPN}
if LICENSED_STATES:
    PERSON["hasCredential"].append({"@type": "EducationalOccupationalCredential", "credentialCategory": "license",
                                    "name": "Insurance producer license",
                                    "recognizedBy": [{"@type": "State", "name": st} for st in LICENSED_STATES]})


def with_css(head):
    return head.replace('<link rel="stylesheet" href="/assets/css/refresh.css" />',
                        '<link rel="stylesheet" href="/assets/css/gsi.css" />\n  <link rel="stylesheet" href="/assets/css/pages.css" />\n  <link rel="stylesheet" href="/assets/css/refresh.css" />')


def write(rel, content):
    out = os.path.join(ROOT, rel, "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(content)


def webinar_links():
    rows = []
    for label, (vid, date, title) in bq.VIDEOS.items():
        if not date.startswith("2026"):
            continue
        rows.append((date, f'<li><a href="https://www.youtube.com/watch?v={vid}"><span class="qa-ts">{bq.PLAY}{bq.pretty_date(date)}</span><span>{html.escape(title)}</span></a></li>'))
    return "".join(r for _, r in sorted(rows, reverse=True))


def about():
    url = SITE + "/about/"
    desc = ("Jay Weinberg, CLU, ChFC, is an independent disability insurance broker who works only with physicians "
            "and lectures at 100+ residency programs a year.")
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "ProfilePage", "@id": url, "url": url, "name": "About Jay Weinberg, CLU, ChFC",
         "mainEntity": {"@id": SITE + "/#jay"}, "isPartOf": {"@id": SITE + "/#website"}},
        PERSON,
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "About Jay", "item": url}]},
    ]}
    return (
        with_css(bq.head("About Jay Weinberg, CLU, ChFC | PGY1.com", desc, url, ld,
                         og_image=SITE + "/assets/og/about.jpg", og_type="profile"))
        + bq.NAV
        + f"""<header class="qa-hero qa-hero--page pg-about-hero">
  <div class="qa-shell pg-about-hero__inner">
    <img class="pg-about-photo" src="/assets/images/jay-face.jpg" alt="Jay Weinberg" width="200" height="200" />
    <div>
      <p class="qa-eyebrow qa-eyebrow--light">About Jay</p>
      <h1>Jay Weinberg, CLU, ChFC</h1>
      <p class="qa-lede">Founder of PGY1 Financial Solutions Corp. An independent disability insurance broker whose practice is exclusively with physicians.</p>
    </div>
  </div>
</header>
<main class="qa-shell qa-grid">
  <article class="qa-main">
    <section class="qa-short" aria-label="In Jay's words">
      <p class="qa-eyebrow">In Jay's words</p>
      <p class="qa-short__text">“My name is Jay Weinberg, and I specialize in disability insurance for physicians. I've been in this line of work for over 25 years, and in a given year, I provide lectures to well over 100 residency programs, fellowship programs, graduating medical students, and some associations and societies.”</p>
    </section>
    <div class="pg-facts">
      <div><strong>25+</strong><span>years in physician disability insurance</span></div>
      <div><strong>100+</strong><span>residency, fellowship and medical school programs he lectures to each year</span></div>
      <div><strong>~900</strong><span>physicians helped with individual disability policies in 2025</span></div>
    </div>
    <div class="qa-body">
      <h2 id="what-jay-does">What Jay does</h2>
      <p>Jay has spent his career making sure physicians don't reach their attending years without the income protection they've earned, and he built PGY1.com specifically for residents and fellows. For them it usually starts with one question: does your hospital have a guaranteed standard issue (GSI) policy? If it does, residents there can get coverage with no health questions. <a href="/gsi/">Look up your hospital</a>.</p>
      <p>He's an independent broker, which means he represents multiple insurance companies rather than one. He also offers <a href="/life-insurance/">life insurance</a>. In 2024 and 2025 Jay received Guardian's #1 Individual Disability Insurance Broker Award.</p>
      <h2 id="lectures">Lectures and webinars</h2>
      <p>In a given year Jay lectures to well over 100 residency programs, fellowship programs, medical schools, societies and associations. He also hosts free webinars for graduating medical students, residents and fellows. Many of the <a href="/questions/">answers on this site</a> come straight from those webinars, with short clips of Jay explaining each one.</p>
      <h2 id="what-jay-doesnt-do">What Jay doesn't do</h2>
      <p>Jay is upfront about this in his webinars. He's not a student loan specialist, and for anything complicated he points people to their financial aid office or a student loan specialist. He doesn't offer investment advice or Roth IRAs. He has no financial ties to mortgage brokers. The student loan, housing and Roth IRA pages here are his general guidance from his spring webinar, not personal advice.</p>
      <h2 id="credentials">Credentials</h2>
      <ul>
        <li><strong>CLU</strong>, Chartered Life Underwriter</li>
        <li><strong>ChFC</strong>, Chartered Financial Consultant</li>
        <li>Founder, PGY1 Financial Solutions Corp</li>
        <li>#1 Individual Disability Insurance Broker Award with Guardian, 2024 and 2025</li>{(chr(10) + "        <li>" + html.escape(bq.license_line()) + "</li>") if bq.license_line() else ""}
      </ul>
    </div>
    <section class="qa-sources">
      <h2>Watch Jay's webinars</h2>
      <p>Full recordings on <a href="{YT_CHANNEL}">his YouTube channel</a>.</p>
      <ul>{webinar_links()}</ul>
    </section>
  </article>
  <aside class="qa-side">
    <div class="qa-side__sticky">
      <div class="gsi-side__card pg-reveal" id="about-card">
        <img src="/assets/images/jay-face.jpg" alt="" width="64" height="64" />
        <p class="gsi-side__name">Jay Weinberg, CLU, ChFC</p>
        <p class="gsi-side__label">No fees to talk. Conversations are confidential.</p>
        <a class="btn-primary" href="/#questionnaire-embed">Start the questionnaire</a>
        <a class="gsi-side__tel" href="tel:{bq.PHONE_TEL}">or call {bq.PHONE_DISPLAY}</a>
        <a class="gsi-side__tel" href="mailto:jay@pgy1.com">jay@pgy1.com</a>
      </div>
    </div>
  </aside>
</main>
<script>
(function () {{
  var card = document.getElementById("about-card"), hero = document.querySelector(".qa-hero");
  if (!card || !hero || !("IntersectionObserver" in window)) {{ if (card) card.classList.add("is-in"); return; }}
  new IntersectionObserver(function (e) {{ card.classList.toggle("is-in", !e[0].isIntersecting); }},
    {{ rootMargin: "-100px 0px 0px 0px" }}).observe(hero);
}})();
</script>
"""
        + bq.CTA + bq.FOOTER
    )


# (group, [(item title, detail, link, link label)]). All from the Spring 2026 webinar (Mar 25).
CHECKLIST = [
    ("Taxes and student loans", [
        ("File your taxes as an MS4, even with no income",
         "Loan servicers use your tax return to verify income. Filing speeds things up and can set up a $0 payment for intern year.",
         "/questions/file-taxes-as-ms4/", "Why file with no income"),
        ("Talk to financial aid or a student loan specialist before any big move",
         "Jay's not a student loan specialist, and this year is different from past years. Get advice on your situation first.",
         "/questions/direct-consolidation-before-residency/", "Direct consolidation before residency?"),
        ("Pick a repayment plan",
         "For most PGY1s it comes down to IBR or RAP. In residency the monthly payments are usually close.",
         "/questions/ibr-vs-rap-for-residents/", "IBR or RAP"),
        ("Going for PSLF? Certify every year",
         "Right loans, right employer, 120 qualifying payments. Annual certification keeps your count clean.",
         "/questions/pslf-requirements/", "What PSLF requires"),
    ]),
    ("Disability insurance", [
        ("Check whether your hospital has a GSI policy, before you apply for anything",
         "A GSI policy has no health questions. Applying for an underwritten policy first can knock you out of it.",
         "/gsi/", "Look up your hospital"),
        ("Learn the one feature that matters most: own-occupation",
         "The definition of disability decides whether a policy pays. Not every policy has true own-occupation wording.",
         "/questions/own-occupation-disability-insurance/", "True own-occupation"),
        ("Budget about $100 a month",
         "Jay's rule of thumb for a resident or fellow around 30. Start small and increase later.",
         "/questions/disability-insurance-cost-resident/", "What it costs"),
    ]),
    ("Moving and mail", [
        ("Update your mailing address",
         "Student loan servicers, credit card companies and anywhere else important. Then forward your mail.", None, None),
        ("Put every bill you can on autopay",
         "A missed bill that lands at your old address can end up on your credit report.", None, None),
        ("Read your mail",
         "You'll be extremely busy. Carve out a few minutes a week so nothing slips.", None, None),
    ]),
    ("Your first paycheck", [
        ("Work out your take-home pay and build a budget",
         "Rent or mortgage, car, insurance, food, parking. A spreadsheet or the back of a napkin. Don't spend more than you make.",
         "/questions/budget-and-emergency-fund-intern-year/", "Budget and emergency fund"),
        ("Start an emergency fund",
         "Roughly three months of living expenses, in money you can get to on short notice.",
         "/questions/budget-and-emergency-fund-intern-year/", "How much to set aside"),
        ("Look at a Roth IRA",
         "After-tax money in, tax-free money out. Eligibility depends on income and filing status. Talk to an investment professional.",
         "/questions/roth-ira-as-a-resident/", "Roth IRA as a resident"),
    ]),
    ("Depending on your situation", [
        ("Married, have dependents or a co-signer on your loans? Look at life insurance",
         "Those are the usual triggers. Most people Jay works with choose level-premium term.",
         "/questions/life-insurance-as-a-resident/", "Life insurance as a resident"),
        ("Rent or buy",
         "How many years is your training, and where did you match? Most residents are renting right now.",
         "/questions/rent-or-buy-during-residency/", "Rent or buy"),
        ("Thinking about refinancing? Probably not if you want PSLF",
         "Once loans leave the government you can't put them back. The exception is high-rate private loans.",
         "/questions/private-refinance-student-loans/", "Private refinance"),
    ]),
]


def checklist():
    url = SITE + "/match-day-checklist/"
    desc = ("Jay Weinberg's Match Day checklist for the move from MS4 to PGY1: taxes, student loans, disability insurance, "
            "moving and your first paycheck.")
    n = sum(len(items) for _, items in CHECKLIST)
    groups, k = [], 0
    for g, items in CHECKLIST:
        lis = []
        for title, detail, link, label in items:
            k += 1
            more = f' <a href="{link}">{html.escape(label)} {bq.ARROW}</a>' if link else ""
            lis.append(f'<li class="cl-item"><label><input type="checkbox" data-k="{k}" />'
                       f'<span class="cl-box" aria-hidden="true"></span><span class="cl-text"><strong>{html.escape(title)}</strong>'
                       f'<span>{html.escape(detail)}{more}</span></span></label></li>')
        groups.append(f'<section class="cl-group"><h2 id="{bq.slugify(g)}">{html.escape(g)}</h2><ul class="cl-list">{"".join(lis)}</ul></section>')
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "headline": "Match Day checklist: from MS4 to PGY1", "description": desc, "url": url,
         "author": bq.JAY, "publisher": {"@id": SITE + "/#organization"},
         "datePublished": bq.PUBLISHED, "dateModified": bq.UPDATED, "mainEntityOfPage": url},
        {"@type": "ItemList", "name": "Match Day checklist", "numberOfItems": n,
         "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": t}
                             for i, t in enumerate(t for _, items in CHECKLIST for t, *_ in items)]},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Match Day checklist", "item": url}]},
    ]}
    toc = "".join(f'<li><a href="#{bq.slugify(g)}">{html.escape(g)}</a></li>' for g, _ in CHECKLIST)
    return (
        with_css(bq.head("Match Day Checklist: MS4 to PGY1 Money To-Dos | PGY1.com", desc, url, ld,
                         og_image=SITE + "/assets/og/match-day-checklist.jpg"))
        + bq.NAV
        + f"""<header class="qa-hero qa-hero--page">
  <div class="qa-shell">
    <div class="qa-crumbs"><a href="/questions/">Questions</a><span aria-hidden="true">/</span><span>Before Match</span></div>
    <h1>Match Day checklist: from MS4 to PGY1</h1>
    <div class="qa-author">
      <span class="qa-author__mark"><img src="/assets/images/Icon.svg" alt="" width="22" height="22" /></span>
      <span><strong>Jay Weinberg, CLU, ChFC</strong><span>From his Spring 2026 webinar for graduating medical students</span><span class="qa-dateline">Updated <time datetime="{bq.UPDATED}">{bq.pretty_date(bq.UPDATED)}</time></span></span>
    </div>
  </div>
</header>
<main class="qa-shell qa-grid">
  <article class="qa-main">
    <section class="qa-short" aria-label="Short answer">
      <p class="qa-eyebrow">How to use it</p>
      <p class="qa-short__text">Rank these by your own situation and work through them one at a time. For most people, a student loan plan and disability insurance come first.</p>
    </section>
    <aside class="qa-note"><p class="qa-eyebrow">A note from Jay</p><p>I'm not a student loan specialist. If your situation is complicated, or before you make any definitive moves on your loans, meet with your financial aid office or a student loan specialist.</p></aside>
    <p class="cl-progress" aria-live="polite"><span id="cl-done">0</span> of {n} done <button type="button" class="cl-print" onclick="window.print()">Print</button></p>
    {''.join(groups)}
  </article>
  <aside class="qa-side">
    <div class="qa-side__sticky">
      <div class="qa-toc">
        <p class="qa-eyebrow">On this page</p>
        <ol>{toc}</ol>
      </div>
      <div class="qa-side__card">
        <p class="qa-side__title">Disability insurance is on the list?</p>
        <p>Jay can tell you what you're eligible for, including any GSI at your hospital.</p>
        <a href="/#questionnaire-embed" class="btn-primary qa-side__btn">Start the questionnaire</a>
      </div>
    </div>
  </aside>
</main>
<script>
(function () {{
  var KEY = "pgy1-checklist", saved = {{}};
  try {{ saved = JSON.parse(localStorage.getItem(KEY) || "{{}}"); }} catch (e) {{}}
  var boxes = document.querySelectorAll(".cl-item input"), out = document.getElementById("cl-done");
  function count() {{ var n = 0; boxes.forEach(function (b) {{ if (b.checked) n++; }}); out.textContent = n; }}
  boxes.forEach(function (b) {{
    b.checked = !!saved[b.dataset.k];
    b.addEventListener("change", function () {{
      saved[b.dataset.k] = b.checked;
      try {{ localStorage.setItem(KEY, JSON.stringify(saved)); }} catch (e) {{}}
      count();
    }});
  }});
  count();
}})();
</script>
"""
        + bq.CTA + bq.FOOTER
    )


def notfound():
    """404.html. Served with a real 404 status: by Vercel for missing files, and by middleware.ts
    for page addresses that aren't on the site."""
    desc = "This page isn't on PGY1.com. Find Jay's answers to residents' disability insurance questions, or check your hospital for a GSI policy."
    h = with_css(bq.head("Page not found | PGY1.com", desc, SITE + "/", {"@context": "https://schema.org", "@type": "WebPage", "name": "Page not found"}))
    h = re.sub(r'<meta name="robots" content="[^"]*" />', '<meta name="robots" content="noindex,follow" />', h)
    h = re.sub(r'\s*<link rel="canonical" href="[^"]*" />', "", h)
    links = [
        ("/questions/", "Questions, answered by Jay", "28 short answers from his webinars, each with a clip."),
        ("/gsi/", "Does your hospital have a GSI policy?", "Look up your hospital. GSI policies ask no health questions."),
        ("/match-day-checklist/", "Match Day checklist", "What to sort out between Match Day and July 1."),
        ("/#questionnaire-embed", "Start the questionnaire", "About 2 minutes. Jay builds your file from it."),
    ]
    rows = "".join(f'<li><a class="qa-row" href="{u}"><span class="qa-row__text"><span class="qa-row__title">{html.escape(t)}</span>'
                   f'<span class="qa-row__preview">{html.escape(d)}</span></span>{bq.ARROW}</a></li>' for u, t, d in links)
    return (
        h + bq.NAV
        + f"""<header class="qa-hero qa-hero--hub">
  <div class="qa-shell">
    <p class="qa-eyebrow qa-eyebrow--light">Page not found</p>
    <h1>We can't find that page</h1>
    <p class="qa-lede">The link may be old, or the address has a typo. Here's where most people are headed.</p>
  </div>
</header>
<main class="qa-shell">
  <section class="qa-stage nf-stage">
    <ul class="qa-rows">{rows}</ul>
  </section>
  <p class="nf-contact">Still stuck? Call Jay at <a href="tel:+16094328862">(609) 432-8862</a> or email <a href="mailto:jay@pgy1.com">jay@pgy1.com</a>.</p>
</main>
"""
        + bq.FOOTER
    )


def main():
    write("about", about())
    write("match-day-checklist", checklist())
    with open(os.path.join(ROOT, "404.html"), "w", encoding="utf-8") as f:
        f.write(notfound())
    print(f"Built /about/ and /match-day-checklist/. Draft/noindex: {bq.DRAFT}")


if __name__ == "__main__":
    main()
