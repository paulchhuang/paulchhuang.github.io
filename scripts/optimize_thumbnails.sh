#!/usr/bin/env bash
# Optimize thumbnails in assets/publications/.
#
# - GIFs over 1.5 MB: re-encode at max 600 px wide, 10 fps, palette-mapped.
# - PNGs over 500 KB: rescale to max 1000 px wide, lossless PNG re-encode.
# - JPGs over 500 KB: rescale to max 1000 px wide, q=85.
#
# Files smaller than the thresholds are left alone. Display thumbs are 260 px
# wide, so 600/1000 px keeps headroom for retina without bloat.
set -euo pipefail

cd "$(dirname "$0")/.."
DIR="assets/publications"
TMP="$(mktemp -d)"
trap "rm -rf $TMP" EXIT

shopt -s nullglob
total_before=0
total_after=0

for f in "$DIR"/*.gif "$DIR"/*.png "$DIR"/*.jpg; do
  [ -f "$f" ] || continue
  size=$(stat -f%z "$f")
  ext="${f##*.}"
  base=$(basename "$f")

  case "$ext" in
    gif)
      threshold=1500000
      ;;
    png|jpg)
      threshold=500000
      ;;
    *)
      continue
      ;;
  esac

  if [ "$size" -lt "$threshold" ]; then
    total_before=$((total_before + size))
    total_after=$((total_after + size))
    printf "  skip  %-30s %5d KB\n" "$base" "$((size/1024))"
    continue
  fi

  out="$TMP/$base"
  case "$ext" in
    gif)
      ffmpeg -y -v error -i "$f" -filter_complex \
        "fps=10,scale='min(600,iw)':-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" \
        "$out" 2>&1
      ;;
    png)
      ffmpeg -y -v error -i "$f" -vf "scale='min(1000,iw)':-1:flags=lanczos" \
        -compression_level 100 "$out" 2>&1
      ;;
    jpg)
      ffmpeg -y -v error -i "$f" -vf "scale='min(1000,iw)':-1:flags=lanczos" \
        -q:v 4 "$out" 2>&1
      ;;
  esac

  new_size=$(stat -f%z "$out")
  total_before=$((total_before + size))

  # Only replace if smaller.
  if [ "$new_size" -lt "$size" ]; then
    cp "$out" "$f"
    total_after=$((total_after + new_size))
    pct=$((100 * new_size / size))
    printf "  opt   %-30s %5d KB -> %5d KB  (%d%%)\n" "$base" "$((size/1024))" "$((new_size/1024))" "$pct"
  else
    total_after=$((total_after + size))
    printf "  keep  %-30s %5d KB  (re-encode was larger)\n" "$base" "$((size/1024))"
  fi
done

printf "\nTotal: %d MB -> %d MB  (saved %d MB)\n" \
  "$((total_before/1024/1024))" \
  "$((total_after/1024/1024))" \
  "$(((total_before-total_after)/1024/1024))"
