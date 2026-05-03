#!/usr/bin/env python3
"""Recompute enrichment coverage badge in README.md from data/export/model_enrichment.json."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def main() -> int:
    enrichment_file = Path("data/export/model_enrichment.json")
    if not enrichment_file.exists():
        print("[badge] enrichment.json not found, skipping", file=sys.stderr)
        return 0
    data = json.loads(enrichment_file.read_text())
    covered = data.get("_meta", {}).get("covered_models", 0)

    # Frontier-30 count from manual YAML
    manual_file = Path("config/model_enrichment.yaml")
    manual_count = 0
    if manual_file.exists():
        try:
            import yaml
            doc = yaml.safe_load(manual_file.read_text()) or {}
            manual_count = len(doc.get("models", {}) or {})
        except Exception:
            pass

    # Compose markdown badges
    badges = (
        f"![Total enrichment](https://img.shields.io/badge/enrichment-{covered}%20models-blue) "
        f"![Manual curation](https://img.shields.io/badge/manual%20frontier-{manual_count}-green)"
    )

    readme = Path("README.md")
    content = readme.read_text() if readme.exists() else "# SOTA Dashboard\n\n"

    # Insert/replace badges block
    badge_marker_start = "<!-- BADGES:START -->"
    badge_marker_end = "<!-- BADGES:END -->"
    block = f"{badge_marker_start}\n{badges}\n{badge_marker_end}"

    if badge_marker_start in content:
        content = re.sub(
            re.escape(badge_marker_start) + ".*?" + re.escape(badge_marker_end),
            block,
            content,
            flags=re.DOTALL,
        )
    else:
        # Insert after first heading
        lines = content.split("\n")
        if lines and lines[0].startswith("#"):
            lines.insert(2, block + "\n")
        else:
            lines.insert(0, block + "\n")
        content = "\n".join(lines)

    readme.write_text(content)
    print(f"[badge] updated README — {covered} total / {manual_count} manual")
    return 0


if __name__ == "__main__":
    sys.exit(main())
