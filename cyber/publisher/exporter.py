"""JSON exporter — writes SQLite data to structured JSON files."""

from __future__ import annotations

import json
import sqlite3
from dataclasses import asdict
from datetime import date
from pathlib import Path
from typing import Any, Dict, List

from cyber.analyst.sota_tracker import SOTATracker
from cyber.db.schema import (
    get_all_benchmarks,
    get_all_models,
    get_leaderboard_rankings,
    get_scores,
)
from cyber.models.types import Score


class Exporter:
    """Export benchmark data from SQLite to JSON files."""

    def __init__(self, conn: sqlite3.Connection, output_dir: Any) -> None:
        self._conn = conn
        self._output_dir = Path(output_dir)

    def export_all(self) -> None:
        """Run all individual exports (scores are read from the DB once)."""
        scores = get_scores(self._conn)
        self._export_models()
        self._export_enrichment()
        self._export_benchmarks()
        self._export_scores(scores)
        self._export_sota(scores)
        self._export_leaderboards()
        self._export_history_snapshot(scores)
        self._export_history_compact()

    def _write_json(self, path: Path, data: Any, compact: bool = False) -> None:
        """Write data as JSON (ensure_ascii=False). Pretty-printed with indent=2
        unless compact=True — the large dashboard payloads are written without
        whitespace because the browser parses every byte on load."""
        path.parent.mkdir(parents=True, exist_ok=True)
        if compact:
            text = json.dumps(data, ensure_ascii=False, separators=(",", ":"), default=str)
        else:
            text = json.dumps(data, ensure_ascii=False, indent=2, default=str)
        path.write_text(text)

    def _score_to_dict(self, s: Score) -> Dict[str, Any]:
        """Convert a Score dataclass to a JSON-serializable dict (same shape as
        dataclasses.asdict, built directly: asdict deep-copies every field and
        was half of the export time)."""
        src = s.source
        return {
            "model_id": s.model_id,
            "benchmark_id": s.benchmark_id,
            "value": s.value,
            "unit": s.unit,
            "source": {"type": src.type, "url": src.url, "date": src.date, "citation": src.citation},
            "is_sota": s.is_sota,
            "collected_at": s.collected_at.isoformat(),
            "notes": s.notes,
        }

    def _export_models(self) -> None:
        models = get_all_models(self._conn)
        data = [asdict(m) for m in models]
        self._write_json(self._output_dir / "models.json", data, compact=True)

    def _export_enrichment(self) -> None:
        """Compile config/model_enrichment.yaml to data/export/model_enrichment.json.

        Missing top-level keys are filled with null/empty defaults so the
        modal can render rows uniformly without per-key existence checks.
        """
        from datetime import date as _date

        try:
            import yaml  # type: ignore
        except ImportError:
            yaml = None

        manual_path = Path("config") / "model_enrichment.yaml"
        auto_path = Path("config") / "model_enrichment_auto.yaml"
        models_in: Dict[str, Dict[str, Any]] = {}
        schema_version = "1.0"

        # Load auto-extracted first (lowest priority)
        if yaml is not None and auto_path.exists():
            try:
                auto_doc = yaml.safe_load(auto_path.read_text()) or {}
                models_in.update(auto_doc.get("models", {}) or {})
            except Exception:
                pass

        # Load manual second (overrides auto per-model)
        if yaml is not None and manual_path.exists():
            doc = yaml.safe_load(manual_path.read_text()) or {}
            schema_version = doc.get("schema_version", "1.0")
            manual_models = doc.get("models", {}) or {}
            # Manual takes precedence at model level (overwrites auto entries fully)
            models_in.update(manual_models)

        def norm(entry: Dict[str, Any]) -> Dict[str, Any]:
            arch = entry.get("architecture") or {}
            train = entry.get("training") or {}
            safety = entry.get("safety") or {}
            tput = entry.get("throughput") or {}
            out = {
                "architecture": {
                    "type": arch.get("type"),
                    "total_params_b": arch.get("total_params_b"),
                    "active_params_b": arch.get("active_params_b"),
                    "layers": arch.get("layers"),
                    "attention": arch.get("attention"),
                    "attention_pattern": arch.get("attention_pattern"),
                    "experts_total": arch.get("experts_total"),
                    "experts_active": arch.get("experts_active"),
                    "vision_encoder_b": arch.get("vision_encoder_b"),
                },
                "training": {
                    "pretrain_tokens": train.get("pretrain_tokens"),
                    "compute_flops": train.get("compute_flops"),
                    "phases": train.get("phases", []) or [],
                },
                "safety": {
                    "aisi_cyber_tier": safety.get("aisi_cyber_tier"),
                    "cbrn_risk": safety.get("cbrn_risk"),
                    "metr_autonomy_50pct": safety.get("metr_autonomy_50pct"),
                    "apollo_schemer_score": safety.get("apollo_schemer_score"),
                    "self_reported_safety_card": safety.get("self_reported_safety_card"),
                },
                "throughput": {
                    "tokens_per_second": tput.get("tokens_per_second"),
                    "latency_p50_ms": tput.get("latency_p50_ms"),
                },
                "quantizations": entry.get("quantizations", []) or [],
                "api_providers": entry.get("api_providers", []) or [],
                "_sources": entry.get("_sources", []) or [],
                "links": {
                    "homepage": (entry.get("links") or {}).get("homepage"),
                    "system_card": (entry.get("links") or {}).get("system_card"),
                    "model_card": (entry.get("links") or {}).get("model_card"),
                    "huggingface": (entry.get("links") or {}).get("huggingface"),
                    "paper": (entry.get("links") or {}).get("paper"),
                    "github": (entry.get("links") or {}).get("github"),
                    "blog": (entry.get("links") or {}).get("blog"),
                },
                "pricing": {
                    "input": (entry.get("pricing") or {}).get("input"),
                    "output": (entry.get("pricing") or {}).get("output"),
                    "cached_input": (entry.get("pricing") or {}).get("cached_input"),
                    "currency": (entry.get("pricing") or {}).get("currency", "USD"),
                },
                "benchmarks_meta": {
                    "arena_elo": (entry.get("benchmarks_meta") or {}).get("arena_elo"),
                    "arena_elo_source": (entry.get("benchmarks_meta") or {}).get("arena_elo_source"),
                    "intelligence_index_override": (entry.get("benchmarks_meta") or {}).get("intelligence_index_override"),
                },
            }
            # Preserve any forward-compat keys that aren't in our known schema
            known = set(out.keys())
            for k, v in entry.items():
                if k not in known:
                    out[k] = v
            return out

        out = {
            "_meta": {
                "generated_at": _date.today().isoformat(),
                "covered_models": len(models_in),
                "schema_version": schema_version,
            },
            "models": {mid: norm(entry) for mid, entry in models_in.items()},
        }
        self._write_json(self._output_dir / "model_enrichment.json", out)

    def _export_benchmarks(self) -> None:
        benchmarks = get_all_benchmarks(self._conn)
        # Merge BMT/registry metadata (paper/github/year/item_count/bmt_id)
        # from config/benchmarks_meta.yaml so the dashboard can deep-link
        # benchmark detail to upstream BMT registry without duplicating data.
        meta_by_id: Dict[str, Dict[str, Any]] = {}
        try:
            import yaml  # type: ignore
            yaml_path = Path("config") / "benchmarks_meta.yaml"
            if yaml_path.exists():
                meta_doc = yaml.safe_load(yaml_path.read_text()) or {}
                for entry in meta_doc.get("benchmarks", []):
                    bid = entry.get("id")
                    if bid:
                        meta_by_id[bid] = entry
        except Exception:
            meta_by_id = {}

        data = []
        for b in benchmarks:
            d = asdict(b)
            extra = meta_by_id.get(b.id, {})
            for key in ("paper", "github", "year", "item_count", "leaderboard", "bmt", "reliability"):
                if key in extra and extra[key] is not None:
                    d[key] = extra[key]
            data.append(d)
        self._write_json(self._output_dir / "benchmarks.json", data, compact=True)

    def _export_scores(self, scores: List[Score] | None = None) -> None:
        if scores is None:
            scores = get_scores(self._conn)
        full = [self._score_to_dict(s) for s in scores]
        # Split the payload: the boot-critical shared score index + Explorer
        # table/filters only need model_id/benchmark_id/value/unit/is_sota +
        # source.type/date + collected_at. The heavy click-time-only fields
        # (source.url ~35% + notes ~23% of the raw JSON) move to an
        # INDEX-ALIGNED sidecar (current_meta.json) that the dashboard fetches
        # lazily and merges back onto the score objects. lean[i] <-> meta[i].
        lean: List[Dict[str, Any]] = []
        meta: List[Dict[str, Any]] = []
        for d in full:
            src = d.get("source") or {}
            meta.append(
                {
                    "url": src.get("url"),
                    "citation": src.get("citation"),
                    "notes": d.get("notes") or "",
                }
            )
            lean.append(
                {
                    "model_id": d.get("model_id"),
                    "benchmark_id": d.get("benchmark_id"),
                    "value": d.get("value"),
                    "unit": d.get("unit"),
                    "is_sota": d.get("is_sota", False),
                    "source": {"type": src.get("type"), "date": src.get("date")},
                    "collected_at": d.get("collected_at"),
                }
            )
        self._write_json(self._output_dir / "scores" / "current.json", lean, compact=True)
        self._write_json(self._output_dir / "scores" / "current_meta.json", meta, compact=True)

    def _export_sota(self, scores: List[Score] | None = None) -> None:
        if scores is None:
            scores = get_scores(self._conn)
        benchmarks = {b.id: b for b in get_all_benchmarks(self._conn)}
        tracker = SOTATracker()
        sota = tracker.compute_sota(scores, benchmarks=benchmarks)
        data = {k: self._score_to_dict(v) for k, v in sota.items()}
        self._write_json(self._output_dir / "sota.json", data, compact=True)

    def _export_leaderboards(self) -> None:
        rankings = get_leaderboard_rankings(self._conn)
        grouped: Dict[str, List[Dict[str, Any]]] = {}
        for r in rankings:
            d = asdict(r)
            d["snapshot_date"] = r.snapshot_date.isoformat()
            grouped.setdefault(r.leaderboard, []).append(d)
        for name, entries in grouped.items():
            self._write_json(
                self._output_dir / "leaderboards" / f"{name}.json", entries
            )

    def _export_history_snapshot(self, scores: List[Score] | None = None) -> None:
        if scores is None:
            scores = get_scores(self._conn)
        data = [self._score_to_dict(s) for s in scores]
        today = date.today().isoformat()
        history_dir = self._output_dir / "scores" / "history"
        self._write_json(history_dir / f"{today}.json", data, compact=True)

        # Also write an index.json listing every historical snapshot so the
        # dashboard can iterate without having to hardcode dates.
        snapshots = sorted(
            p.stem for p in history_dir.glob("*.json")
            if p.stem != "index" and len(p.stem) == 10
        )
        self._write_json(history_dir / "index.json", {"dates": snapshots})

    HISTORY_DETAIL_SHARDS = 64

    @staticmethod
    def history_shard(benchmark_id: str, shards: int = 64) -> int:
        """FNV-1a (32-bit) over UTF-16 code units, mod `shards` — the dashboard
        computes the same value in JS to pick the detail file to fetch."""
        h = 0x811C9DC5
        data = benchmark_id.encode("utf-16-le")
        for i in range(0, len(data), 2):
            h ^= data[i] | (data[i + 1] << 8)
            h = (h * 0x01000193) & 0xFFFFFFFF
        return h % shards

    def _export_history_compact(self) -> None:
        """Fold every daily snapshot into compact history files so the dashboard
        no longer downloads each full snapshot (100 snapshots ≈ 700 MB raw).

        scores/history/compact.json (v2) — value/url/unit change log per
        (model, benchmark) for charts: dates[], counts[] (rows per snapshot),
        string tables m/b/u/s (model ids, benchmark ids, units, source urls)
        and r[]: [model_idx, bench_idx, [date_idx, value, url_idx, unit_idx], ...].
        An entry is written when value, url or unit changes; [date_idx, null]
        marks the pair disappearing; url_idx is -1 when the score had no url.

        scores/history/detail/NN.json (v2) — the same log with notes, is_sota
        and collected_at, sharded by history_shard(benchmark_id) for the score
        source modal: r[]: [model_id, bench_id,
        [date_idx, value, url_idx, note_idx, is_sota, collected_idx, unit_idx], ...]
        with per-shard string tables s/n/c/u.
        """
        history_dir = self._output_dir / "scores" / "history"
        files = sorted(p for p in history_dir.glob("*.json") if p.stem != "index" and len(p.stem) == 10)
        tables: Dict[str, Dict[str, int]] = {k: {} for k in ("m", "b", "u", "s", "n", "c")}

        def ix(t: str, key: str) -> int:
            d = tables[t]
            if key not in d:
                d[key] = len(d)
            return d[key]

        state: Dict[tuple, tuple] = {}
        dstate: Dict[tuple, tuple] = {}
        rows: Dict[tuple, list] = {}
        drows: Dict[tuple, list] = {}
        counts: List[int] = []
        for di, path in enumerate(files):
            snap = json.loads(path.read_text())
            if isinstance(snap, dict):
                snap = snap.get("scores") or []
            counts.append(len(snap))
            seen = set()
            for sc in snap:
                key = (ix("m", sc["model_id"]), ix("b", sc["benchmark_id"]))
                src = sc.get("source") or {}
                url = src.get("url") if isinstance(src, dict) else src
                si = ix("s", url) if url else -1
                val = sc.get("value")
                ui = ix("u", sc.get("unit") if sc.get("unit") is not None else "")
                seen.add(key)
                if state.get(key) != (val, si, ui):
                    rows.setdefault(key, []).append([di, val, si, ui])
                    state[key] = (val, si, ui)
                full = (val, si, ix("n", sc.get("notes") or ""), 1 if sc.get("is_sota") else 0, ix("c", sc.get("collected_at") or ""), ui)
                if dstate.get(key) != full:
                    drows.setdefault(key, []).append([di] + list(full))
                    dstate[key] = full
            for key in [k for k in state if k not in seen]:
                rows[key].append([di, None])
                del state[key]
            for key in [k for k in dstate if k not in seen]:
                drows[key].append([di, None])
                del dstate[key]
        dates = [p.stem for p in files]
        lists = {k: list(v) for k, v in tables.items()}
        out = {
            "v": 2, "dates": dates, "counts": counts,
            "m": lists["m"], "b": lists["b"], "u": lists["u"], "s": lists["s"],
            "r": [[mi, bi] + row for (mi, bi), row in rows.items()],
        }
        self._write_json(history_dir / "compact.json", out, compact=True)

        # Detail shards: each carries only the strings its own rows use.
        shards: Dict[int, list] = {i: [] for i in range(self.HISTORY_DETAIL_SHARDS)}
        for (mi, bi), row in drows.items():
            bid = lists["b"][bi]
            shards[self.history_shard(bid, self.HISTORY_DETAIL_SHARDS)].append((lists["m"][mi], bid, row))
        for n, items in shards.items():
            loc = {k: {} for k in ("s", "n", "c", "u")}

            def lx(t: str, gidx: int) -> int:
                if gidx < 0:
                    return -1
                d = loc[t]
                if gidx not in d:
                    d[gidx] = len(d)
                return d[gidx]

            r_out = []
            for mid, bid, row in items:
                ent = [mid, bid]
                for ch in row:
                    if ch[1] is None:
                        ent.append([ch[0], None])
                    else:
                        ent.append([ch[0], ch[1], lx("s", ch[2]), lx("n", ch[3]), ch[4], lx("c", ch[5]), lx("u", ch[6])])
                r_out.append(ent)
            inv = {t: [None] * len(d) for t, d in loc.items()}
            for t, d in loc.items():
                for gidx, lidx in d.items():
                    inv[t][lidx] = lists[t][gidx]
            self._write_json(history_dir / "detail" / f"{n:02d}.json",
                             {"v": 2, "dates": dates, "s": inv["s"], "n": inv["n"], "c": inv["c"], "u": inv["u"], "r": r_out}, compact=True)
