#!/usr/bin/env python3
"""Fetch HuggingFace model metadata and emit data/export/hf_metadata.json.

Reads config/model_enrichment.yaml, extracts links.huggingface URLs (which
look like https://huggingface.co/<org>/<repo>), calls
https://huggingface.co/api/models/<org>/<repo>, and writes a sidecar JSON.

Resilient to:
- Missing huggingface URLs (skip silently)
- 404 (model deleted/private — skip with warning)
- Rate limit (sleep + retry once, max 60s total per model)
- Schema versioning and lastFetched timestamps so the modal can show staleness
"""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.request
import urllib.error
from datetime import date, datetime
from pathlib import Path

import yaml


HF_API = "https://huggingface.co/api/models/"
TIMEOUT = 15
USER_AGENT = "cyber-sota-dashboard/1.0 (+https://github.com/hollobit/SOTA)"


def parse_hf_url(url: str) -> str | None:
    """Extract '<org>/<repo>' from a HuggingFace model URL.

    Examples:
        https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B → LGAI-EXAONE/EXAONE-4.5-33B
        https://huggingface.co/Qwen/Qwen3.6-27B/tree/main → Qwen/Qwen3.6-27B
    """
    m = re.match(r"https?://huggingface\.co/([^/]+)/([^/?#]+)", url or "")
    if not m:
        return None
    return m.group(1) + "/" + m.group(2)


def fetch_one(repo_id: str) -> dict | None:
    """Fetch HF metadata for one model. Return dict or None on failure."""
    url = HF_API + repo_id
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data
        except urllib.error.HTTPError as e:
            if e.code == 404:
                print(f"[hf] 404 not found: {repo_id}", file=sys.stderr)
                return None
            if e.code in (429, 503) and attempt == 0:
                print(f"[hf] rate limited on {repo_id}, sleeping 30s", file=sys.stderr)
                time.sleep(30)
                continue
            print(f"[hf] HTTP {e.code} for {repo_id}", file=sys.stderr)
            return None
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            print(f"[hf] network error for {repo_id}: {e}", file=sys.stderr)
            return None
        except Exception as e:
            print(f"[hf] unexpected error for {repo_id}: {e}", file=sys.stderr)
            return None
    return None


def normalize(repo_id: str, raw: dict) -> dict:
    """Extract the fields we want from the raw HF response."""
    siblings = raw.get("siblings") or []
    total_bytes = sum(s.get("size") or 0 for s in siblings if isinstance(s, dict))
    return {
        "hf_repo_id": repo_id,
        "downloads_30d": raw.get("downloads"),
        "downloads_all_time": raw.get("downloadsAllTime"),
        "likes": raw.get("likes"),
        "last_modified": raw.get("lastModified"),
        "library_name": raw.get("library_name"),
        "pipeline_tag": raw.get("pipeline_tag"),
        "tags": (raw.get("tags") or [])[:20],  # cap to 20 most-relevant tags
        "total_size_bytes": total_bytes if total_bytes > 0 else None,
        "file_count": len(siblings) if siblings else None,
    }


def main() -> int:
    yaml_path = Path("config/model_enrichment.yaml")
    if not yaml_path.exists():
        print(f"[hf] config not found: {yaml_path}", file=sys.stderr)
        return 1
    doc = yaml.safe_load(yaml_path.read_text()) or {}
    models = doc.get("models", {}) or {}

    out = {}
    fetched = 0
    skipped = 0
    failed = 0

    for model_id, entry in models.items():
        hf_url = (entry.get("links") or {}).get("huggingface")
        repo_id = parse_hf_url(hf_url) if hf_url else None
        if not repo_id:
            skipped += 1
            continue
        print(f"[hf] fetching {model_id} → {repo_id}", file=sys.stderr)
        raw = fetch_one(repo_id)
        if raw is None:
            failed += 1
            continue
        out[model_id] = normalize(repo_id, raw)
        fetched += 1
        # Polite rate: 250ms between requests
        time.sleep(0.25)

    out_dir = Path("data/export")
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "hf_metadata.json"
    out_file.write_text(json.dumps({
        "_meta": {
            "generated_at": date.today().isoformat(),
            "fetched": fetched,
            "skipped_no_url": skipped,
            "failed": failed,
            "schema_version": "1.0",
        },
        "models": out,
    }, indent=2))
    print(f"[hf] wrote {out_file}: {fetched} fetched, {skipped} skipped, {failed} failed",
          file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
