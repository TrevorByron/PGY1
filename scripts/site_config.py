"""One place for launch settings. Every build script reads this.

LAUNCH = False keeps every new page (questions, GSI lookup, hospital profiles, about, checklist)
noindex and out of sitemap.xml. Set it to True after Jay signs off, then run scripts/build-all.sh.
"""
LAUNCH = True
# True once Jay has read and approved the question pages; their byline then says he reviewed them.
REVIEWED_BY_JAY = False
# Dates on the question pages and in their Article schema. Bump UPDATED when content changes.
PUBLISHED = "2026-10-30"
UPDATED = "2026-10-30"

# Licensing disclosure (footer on generated pages, About page, Jay's schema). Hidden while empty.
# Fill in from Jay: his NPN (National Producer Number) and the states he's licensed in, e.g. ["NJ", "PA", "NY"].
LICENSE_NPN = ""
LICENSED_STATES = []


def license_line():
    """One sentence for the footer and About page, or "" until both values exist."""
    if not (LICENSE_NPN and LICENSED_STATES):
        return ""
    return f"Jay Weinberg is a licensed insurance producer, NPN {LICENSE_NPN}, licensed in {', '.join(LICENSED_STATES)}."
