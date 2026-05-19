#!/usr/bin/env python3
"""
Download publication thumbnails from paulchhuang.wixsite.com into
assets/publications/ with consistent paper-keyed filenames.

Mapping is hand-curated from inspecting the Wix page HTML (each <img>'s
alt attribute, surrounding paper title, or matching filename hint).

Re-run: `python3 scripts/scrape_publications.py`
"""
from __future__ import annotations

import os
import sys
import urllib.request
from pathlib import Path

WIX_BASE = "https://static.wixstatic.com/media/"
USER_AGENT = "Mozilla/5.0 (compatible; pub-scraper/1.0)"

# paper_key -> (wix media file, output extension)
# Conference + journal papers, in chronological-desc order matching publications.html.
MAPPING: list[tuple[str, str]] = [
    # 2025
    ("jog3r",                "78b63d_e243f4aea69a4091bd7aa969e31f53dd~mv2.jpg"),
    ("boosting_camera",      "78b63d_a91ae141a9e9461db745b008c77f4969~mv2.gif"),
    ("humoto",               "78b63d_f1c7f4b47fd0434885499c278cc64f1c~mv2.png"),
    ("videohandle",          "78b63d_ee44193cc7e64f0abb566db86b435362~mv2.gif"),
    ("shape_my_moves",       "78b63d_b8819cfd3ade49c59cba98c77fe5c54c~mv2.gif"),
    ("track4gen",            "78b63d_9ede179e43674fb9935e0445278e6afe~mv2.gif"),
    # 2024
    ("matatlas",             "78b63d_0ab8f641f3f04f3b8b5cbda4e6938e20~mv2.png"),
    ("actanywhere",          "78b63d_73d8cbd1398a4a8ba260d8dc60006606~mv2.png"),
    ("synchmr",              "78b63d_fa8959d576364e94ba6a31624d12cc19~mv2.gif"),
    ("generative_rendering", "78b63d_ed0102cc8ed64ebf90db2659335d3711~mv2.gif"),
    ("bliss",                "78b63d_33cf19fe4522421bb14e7d04a6128858~mv2.png"),
    # 2023
    ("pix2video",            "78b63d_d9e86c3863d74484bf1661ebbc49156c~mv2.gif"),
    ("cyclenet",             "78b63d_b917b913276144feaaf3012781f2895e~mv2.png"),
    ("mime",                 "78b63d_60b7430abdad410293662d4db905f7d7~mv2.gif"),
    ("sgnify",               "78b63d_4d04b9b4adf44d0dba63931c2e745134~mv2.gif"),
    ("ipman",                "78b63d_2c5144a1198b41c299fb3161ddb405f3~mv2.gif"),
    ("smartmocap",           "78b63d_2f746f5eec3947d390f3e174c2d83b4d~mv2.png"),
    # 2022
    ("rich",                 "78b63d_52aabcc589994cc280c452f71e954d96~mv2.gif"),
    ("shapy",                "78b63d_c98970f96e404d2da44d894a56a05def~mv2.png"),
    ("mover",                "78b63d_c28294f0648a442ca18464e3482ad7eb~mv2.png"),
    # 2021
    ("spec",                 "78b63d_a9b5e13c9686423fb13ebc2c1f6f39bd~mv2.png"),
    ("pare",                 "78b63d_7a5233ba7ef3418c9b9884624630540b~mv2.png"),
    ("tuch",                 "78b63d_b2929953c68d4a9190ec8483579d438c~mv2.png"),
    ("agora",                "78b63d_4dea04f2508449e8ab49726042563492~mv2.png"),
    # 2017 / 2016 / 2015 / 2014 / 2013
    ("ijcv_2016",            "78b63d_750cc09b7f734ffa85cf79ac70e15b57~mv2.png"),
    ("cvpr_2016_volumetric", "c2b5e6_c7ffebd1f52f4b93bc9764ae4ce9ab72~mv2.png"),
    ("dv_2015_repeatable",   "78b63d_fa2378b4c7cd4bed9df5050983f7e754~mv2.png"),
    ("cvpr_2015_userspec",   "78b63d_b2164e8af71843238e8eed5c7fd86313~mv2.gif"),
    ("ismar_2015",           "78b63d_1854ca356a8c40d6bc515a8f6f00ecb1~mv2.png"),
    ("tip_2014",             "78b63d_d48c7423632e4236835b333cec047845~mv2.png"),
    ("cvpr_2014_keyframes",  "78b63d_dc9d5606164c4706a0bec7b607ba6960~mv2.png"),
    ("dv_2013_robust",       "78b63d_a65c344b87464188a56461990be06892~mv2.png"),
    # 2012 / 2010
    ("eccvw_2012",           "c2b5e6_fda4267c27614de0929ec637065630d6~mv2.png"),
    ("iscas_2010",           "c2b5e6_a88dec4e509b43f3befd9cb9ef66bf02~mv2.gif"),
]

# Newer papers whose thumbnails come from project pages (not the Wix CDN).
# key -> direct URL.
EXTRA_URLS: list[tuple[str, str]] = [
    ("trajectorymover", "https://chhatrekiran.github.io/trajectorymover/assets/figures/data_pipe.png"),
    ("memory_v2v",     "https://dohunlee1.github.io/MemoryV2V/static/images/method/fig_main.png"),
    ("worldcam",       "https://cvlab-kaist.github.io/WorldCam/static/images/method/dataset.png"),
    ("lost",           "https://lost3d.github.io/static/images/teaser.png"),
    ("vrgbx",          "https://aleafy.github.io/vrgbx/static/results/wild2.gif"),
]

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "assets" / "publications"


def download(url: str, dest: Path) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    dest.write_bytes(data)
    return len(data)


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    total = 0
    failed: list[str] = []
    jobs: list[tuple[str, str]] = (
        [(k, WIX_BASE + f) for k, f in MAPPING] + list(EXTRA_URLS)
    )
    for key, url in jobs:
        ext = url.rsplit(".", 1)[1]
        out = OUT_DIR / f"{key}.{ext}"
        try:
            size = download(url, out)
            total += size
            print(f"  ok  {key}.{ext}  ({size/1024:.0f} KB)")
        except Exception as e:
            failed.append(f"{key}: {e}")
            print(f"  FAIL {key}.{ext}: {e}", file=sys.stderr)

    print(f"\nDownloaded {len(jobs) - len(failed)}/{len(jobs)} files, "
          f"{total/1024/1024:.1f} MB into {OUT_DIR.relative_to(REPO_ROOT)}/")
    if failed:
        print("Failures:", *failed, sep="\n  ", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
