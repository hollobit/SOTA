#!/usr/bin/env python3
"""Record a dated snapshot of per-model token prices from OpenRouter.

Run on every deploy (and the daily schedule). Fetches the OpenRouter models
API (pure HTTP, no browser / no API key), maps ids to our canonical model ids,
and appends a compact **price-change log** to data/price_history/prices.jsonl:
one row per (date, model) ONLY when a model's input/output price differs from
its last recorded value (plus a full baseline on first run). This builds a real
per-model price time-series over time without bloating the repo — most days add
few or zero rows.

Idempotent per day: if today's date is already the latest recorded snapshot,
re-running makes no changes. Exit 0 always (a fetch failure is non-fatal so it
never blocks a deploy); it just records nothing.
"""
import json
import os
import re
import sys
import urllib.request
from datetime import date, timezone, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_JSON = os.path.join(ROOT, "data", "export", "models.json")
HIST_DIR = os.path.join(ROOT, "data", "price_history")
HIST_FILE = os.path.join(HIST_DIR, "prices.jsonl")
OR_URL = "https://openrouter.ai/api/v1/models"

VENDOR = {
    "x-ai": "xai", "moonshotai": "moonshot", "qwen": "alibaba", "meta-llama": "meta",
    "mistralai": "mistral", "z-ai": "zhipu", "thudm": "zhipu", "nousresearch": "nous",
}


def _norm_candidates(orid, vendor_map):
    orid = orid.lstrip("~").split(":")[0].strip()
    if "/" not in orid:
        return [orid.lower()]
    v, rest = orid.split("/", 1)
    v2 = vendor_map.get(v.lower(), v.lower())
    rest = re.sub(r"-(fast|latest|preview|free|beta|thinking|instruct)$", "", rest.lower())
    rest = re.sub(r"-20\d{6}$", "", rest)
    return [f"{v2}/{rest}", f"{v.lower()}/{rest}",
            f"{v2}/{rest}".replace(".", "-"), f"{v2}/{rest}".replace("-", ".")]


def _fnum(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return 0.0


def fetch_openrouter():
    req = urllib.request.Request(OR_URL, headers={"User-Agent": "sota-price-snapshot"})
    with urllib.request.urlopen(req, timeout=30) as r:
        payload = json.load(r)
    return payload.get("data", payload) if isinstance(payload, dict) else payload


def load_db_ids():
    with open(MODELS_JSON) as f:
        d = json.load(f)
    ms = d if isinstance(d, list) else d.get("models", [])
    return {m["id"].lower(): m["id"] for m in ms if isinstance(m, dict) and m.get("id")}


def last_known_prices():
    """Read prices.jsonl → {model_id: (in, out)} of the most recent value each,
    plus the latest date recorded."""
    last = {}
    latest_date = ""
    if not os.path.exists(HIST_FILE):
        return last, latest_date
    with open(HIST_FILE) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError:
                continue
            last[row["model_id"]] = (row.get("in"), row.get("out"))
            if row.get("date", "") > latest_date:
                latest_date = row["date"]
    return last, latest_date


def main():
    today = date.today().isoformat()
    dbl = load_db_ids()
    try:
        data = fetch_openrouter()
    except Exception as e:  # noqa: BLE001 — non-fatal by design
        print(f"[snapshot_pricing] OpenRouter fetch failed ({e}); recording nothing.", file=sys.stderr)
        return 0

    # current OpenRouter prices mapped to canonical ids ($/1M)
    current = {}
    for m in data:
        p = m.get("pricing") or {}
        inp = round(_fnum(p.get("prompt")) * 1e6, 4)
        out = round(_fnum(p.get("completion")) * 1e6, 4)
        if inp <= 0 and out <= 0:
            continue
        for c in _norm_candidates(m.get("id", ""), VENDOR):
            if c in dbl:
                cid = dbl[c]
                if cid not in current:
                    current[cid] = (inp, out)
                break

    last, latest_date = last_known_prices()

    if latest_date == today:
        print(f"[snapshot_pricing] {today} already recorded; no-op.")
        return 0

    # Append rows only where the price changed vs last known (or is new).
    def changed(cid, inp, out):
        if cid not in last:
            return True
        pin, pout = last[cid]
        return pin != inp or pout != out

    rows = []
    for cid in sorted(current):
        inp, out = current[cid]
        if changed(cid, inp, out):
            rows.append({"date": today, "model_id": cid, "in": inp, "out": out, "src": "openrouter"})

    if not rows:
        print(f"[snapshot_pricing] {today}: no price changes among {len(current)} models; nothing to append.")
        return 0

    os.makedirs(HIST_DIR, exist_ok=True)
    with open(HIST_FILE, "a") as f:
        for row in rows:
            f.write(json.dumps(row) + "\n")
    print(f"[snapshot_pricing] {today}: appended {len(rows)} price rows "
          f"({'baseline' if not last else 'changes'}) of {len(current)} priced models.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
