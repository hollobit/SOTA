"""Collector Agent — selects parsers, computes diffs, filters top models."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Type

from cyber.parsers.base import BaseParser

TOP_MODELS_LIMIT = 40


@dataclass
class DiffResult:
    """Result of comparing new vs old scores."""

    new_scores: List[Dict[str, Any]] = field(default_factory=list)
    updated: List[Dict[str, Any]] = field(default_factory=list)
    disappeared: List[Dict[str, Any]] = field(default_factory=list)
    unchanged: int = 0


class CollectorAgent:
    """Collect benchmark data, diff against previous, and filter top models."""

    def select_parser(self, format_type: str) -> Optional[BaseParser]:
        """Return the appropriate parser instance for *format_type*."""
        mapping: Dict[str, str] = {
            "json_api": "cyber.parsers.json_api.JsonApiParser",
            "html_table": "cyber.parsers.html_table.HtmlTableParser",
            "markdown": "cyber.parsers.markdown_parser.MarkdownParser",
            "csv": "cyber.parsers.csv_parser.CsvParser",
        }
        fqn = mapping.get(format_type)
        if fqn is None:
            return None
        module_path, class_name = fqn.rsplit(".", 1)
        import importlib
        mod = importlib.import_module(module_path)
        cls: Type[BaseParser] = getattr(mod, class_name)
        return cls()

    def compute_diff(
        self,
        new_scores: List[Dict[str, Any]],
        old_scores: List[Dict[str, Any]],
    ) -> DiffResult:
        """Compare *new_scores* against *old_scores* and classify changes.

        Each score dict is keyed by (model_id, benchmark_id).
        """
        def _key(s: Dict[str, Any]) -> tuple:
            return (s["model_id"], s["benchmark_id"])

        old_map: Dict[tuple, Dict[str, Any]] = {_key(s): s for s in old_scores}
        new_map: Dict[tuple, Dict[str, Any]] = {_key(s): s for s in new_scores}

        result = DiffResult()

        for key, score in new_map.items():
            if key not in old_map:
                result.new_scores.append(score)
            elif old_map[key].get("value") != score.get("value"):
                result.updated.append(score)
            else:
                result.unchanged += 1

        for key, score in old_map.items():
            if key not in new_map:
                result.disappeared.append(score)

        return result

    def filter_top_models(
        self,
        scores: List[Dict[str, Any]],
        limit: int = TOP_MODELS_LIMIT,
    ) -> List[Dict[str, Any]]:
        """Per benchmark, keep only the top *limit* models by value."""
        by_bench: Dict[str, List[Dict[str, Any]]] = {}
        for s in scores:
            bench = s.get("benchmark_id", "")
            by_bench.setdefault(bench, []).append(s)

        result: List[Dict[str, Any]] = []
        for bench, bench_scores in by_bench.items():
            sorted_scores = sorted(bench_scores, key=lambda x: x.get("value", 0), reverse=True)
            result.extend(sorted_scores[:limit])
        return result
