#!/bin/bash
# Rebuild every generated page, then the sitemap. Run from anywhere.
# Launch: set LAUNCH = True (and REVIEWED_BY_JAY once he's signed off) in scripts/site_config.py, then run this.
set -e
cd "$(dirname "$0")/.."
python3 scripts/build-questions.py "../Question Pages - Draft Content.md"
python3 scripts/build-gsi.py
python3 scripts/build-pages.py
python3 scripts/build-sitemap.py
python3 scripts/build-markdown.py
