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
        """Run all individual exports."""
        self._export_models()
        self._export_enrichment()
        self._export_benchmarks()
        self._export_scores()
        self._export_sota()
        self._export_leaderboards()
        self._export_history_snapshot()

    def _write_json(self, path: Path, data: Any) -> None:
        """Write data as JSON with ensure_ascii=False and indent=2."""
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2, default=str))

    def _score_to_dict(self, s: Score) -> Dict[str, Any]:
        """Convert a Score dataclass to a JSON-serializable dict."""
        d = asdict(s)
        d["collected_at"] = s.collected_at.isoformat()
        return d

    def _export_models(self) -> None:
        models = get_all_models(self._conn)
        data = [asdict(m) for m in models]
        self._write_json(self._output_dir / "models.json", data)

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
        self._write_json(self._output_dir / "benchmarks.json", data)

    def _export_scores(self) -> None:
        scores = get_scores(self._conn)
        data = [self._score_to_dict(s) for s in scores]
        self._write_json(self._output_dir / "scores" / "current.json", data)

    def _export_sota(self) -> None:
        scores = get_scores(self._conn)
        from cyber.db.schema import get_all_benchmarks
        benchmarks = {b.id: b for b in get_all_benchmarks(self._conn)}
        tracker = SOTATracker()
        sota = tracker.compute_sota(scores, benchmarks=benchmarks)
        data = {k: self._score_to_dict(v) for k, v in sota.items()}
        self._write_json(self._output_dir / "sota.json", data)

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

    def _export_history_snapshot(self) -> None:
        scores = get_scores(self._conn)
        data = [self._score_to_dict(s) for s in scores]
        today = date.today().isoformat()
        history_dir = self._output_dir / "scores" / "history"
        self._write_json(history_dir / f"{today}.json", data)

        # Also write an index.json listing every historical snapshot so the
        # dashboard can iterate without having to hardcode dates.
        snapshots = sorted(
            p.stem for p in history_dir.glob("*.json")
            if p.stem != "index" and len(p.stem) == 10
        )
        self._write_json(history_dir / "index.json", {"dates": snapshots})

