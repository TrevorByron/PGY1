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
