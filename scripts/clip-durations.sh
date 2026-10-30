#!/bin/bash
# Rewrite data/clip-durations.json from assets/video/*.mp4 (used for VideoObject duration). Needs ffprobe.
cd "$(dirname "$0")/.." && python3 - <<'PY'
import subprocess, json, glob, os
d = {}
for f in sorted(glob.glob("assets/video/*.mp4")):
    t = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
    d[os.path.basename(f)[:-4]] = f"PT{int(t // 60)}M{int(round(t % 60))}S" if t >= 60 else f"PT{int(round(t))}S"
json.dump(d, open("data/clip-durations.json", "w"), indent=1)
print(len(d), "clip durations")
PY
