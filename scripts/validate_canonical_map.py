#!/usr/bin/env python3
"""Validate data/model_canonical_map.json — the dupe->canonical rewrite table the loader applies.

Why this exists: scripts/load_benchmark_scores.py rewrites ids with a single dict lookup
(`canonical_map.get(mid, mid)`), so it only follows ONE hop. If a map entry points at an id
that is itself a key in the map, the rewrite stops halfway and silently recreates a retired
id on every ingest. That is exactly what happened in S268:

    alibaba/qwen-3.5-397b-a17b -> qwen/qwen3.5-397b-a17b -> alibaba/qwen3.5-397b-a17b

Deleting the retired id from the DB did nothing because `make load` kept resurrecting it.

Checks performed
  CHAIN      a target that is itself a dupe key (the S268 bug)   -> fixable
  CYCLE      entries that loop back on themselves                -> not auto-fixable
  SELF       an entry mapping an id to itself                    -> fixable (dropped)
  DB_DUPE    a dupe key still present in the models table        -> reported
  DANGLING   a canonical target absent from the models table     -> reported

Usage
    python3 scripts/validate_canonical_map.py           # report only, non-zero exit on error
    python3 scripts/validate_canonical_map.py --fix     # collapse chains / drop self-maps
"""
import json
import sqlite3
import sys
from pathlib import Path

MAP_PATH = Path("data/model_canonical_map.json")
DB_PATH = Path("data/benchmark.db")


def resolve(mapping, start):
    """Follow the chain to its endpoint. Returns (endpoint, path, looped)."""
    seen, cur, path = {start}, start, [start]
    while cur in mapping:
        nxt = mapping[cur]
        if nxt in seen:
            return cur, path, True
        seen.add(nxt)
        path.append(nxt)
        cur = nxt
    return cur, path, False


def main() -> int:
    if not MAP_PATH.exists():
        print(f"[canonical-map] {MAP_PATH} missing", file=sys.stderr)
        return 1
    mapping = json.loads(MAP_PATH.read_text())
    fix = "--fix" in sys.argv

    chains, cycles, selfs = [], [], []
    for dupe, canon in mapping.items():
        if dupe == canon:
            selfs.append(dupe)
            continue
        if canon in mapping:
            end, path, looped = resolve(mapping, dupe)
            (cycles if looped else chains).append((dupe, path, end))

    db_dupes, dangling = [], []
    if DB_PATH.exists():
        con = sqlite3.connect(DB_PATH)
        ids = {r[0] for r in con.execute("SELECT id FROM models")}
        scored = {r[0] for r in con.execute("SELECT DISTINCT model_id FROM scores")}
        for dupe, canon in mapping.items():
            if dupe in ids or dupe in scored:
                db_dupes.append(dupe)
            if canon not in ids and canon not in mapping:
                dangling.append((dupe, canon))
        con.close()

    print(f"[canonical-map] {len(mapping)} entries")
    for label, items in (("CHAIN", chains), ("CYCLE", cycles), ("SELF", selfs),
                         ("DB_DUPE", db_dupes), ("DANGLING", dangling)):
        print(f"[canonical-map] {label:9} {len(items)}")

    for dupe, path, end in chains:
        print(f"  CHAIN    {' -> '.join(path)}   (loader stops at {path[1]}, should reach {end})")
    for dupe, path, _ in cycles:
        print(f"  CYCLE    {' -> '.join(path)}")
    for dupe in selfs:
        print(f"  SELF     {dupe}")
    for dupe in db_dupes[:20]:
        print(f"  DB_DUPE  {dupe} still present in the DB — run its migration or re-load")
    if len(db_dupes) > 20:
        print(f"  ... and {len(db_dupes) - 20} more")
    for dupe, canon in dangling[:20]:
        print(f"  DANGLING {dupe} -> {canon} (target not in models)")
    if len(dangling) > 20:
        print(f"  ... and {len(dangling) - 20} more")

    if fix and (chains or selfs):
        fixed = {}
        for dupe, canon in mapping.items():
            if dupe == canon:
                continue
            end, _, looped = resolve(mapping, dupe)
            fixed[dupe] = mapping[dupe] if looped else end
        MAP_PATH.write_text(json.dumps(fixed, ensure_ascii=False, indent=1, sort_keys=True) + "\n")
        print(f"[canonical-map] --fix applied: collapsed {len(chains)} chain(s), "
              f"dropped {len(selfs)} self-map(s); {len(mapping)} -> {len(fixed)} entries")
        if cycles:
            print("[canonical-map] cycles still need manual resolution", file=sys.stderr)
        return 1 if cycles else 0

    blocking = chains or cycles or selfs
    if blocking:
        print("[canonical-map] FAIL — chains/cycles let the loader revive retired ids. "
              "Re-run with --fix (cycles need manual edits).", file=sys.stderr)
        return 1
    print("[canonical-map] OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
