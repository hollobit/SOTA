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

    def _export_benchmarks(self) -> None:
        benchmarks = get_all_benchmarks(self._conn)
        data = [asdict(b) for b in benchmarks]
        self._write_json(self._output_dir / "benchmarks.json", data)

    def _export_scores(self) -> None:
        scores = get_scores(self._conn)
        data = [self._score_to_dict(s) for s in scores]
        self._write_json(self._output_dir / "scores" / "current.json", data)

    def _export_sota(self) -> None:
        scores = get_scores(self._conn)
        tracker = SOTATracker()
        sota = tracker.compute_sota(scores)
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
