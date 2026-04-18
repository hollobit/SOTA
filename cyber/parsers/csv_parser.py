"""Parser for CSV data containing benchmark scores."""

from __future__ import annotations

import csv
import io
from typing import Any, Dict, List

from cyber.parsers.base import BaseParser


class CsvParser(BaseParser):
    """Parse CSV with columns: model, benchmark, score (or value)."""

    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        if not content.strip():
            return []

        reader = csv.DictReader(io.StringIO(content))
        fieldnames = reader.fieldnames or []
        lower_fields = [f.lower() for f in fieldnames]

        # Locate column names (case-insensitive)
        model_col = self._find_col(fieldnames, lower_fields, ("model", "model_name", "model_id"))
        bench_col = self._find_col(fieldnames, lower_fields, ("benchmark", "benchmark_id", "bench"))
        score_col = self._find_col(fieldnames, lower_fields, ("score", "value", "result"))

        if model_col is None or bench_col is None or score_col is None:
            return []

        results: List[Dict[str, Any]] = []
        for row in reader:
            model = row.get(model_col, "").strip()
            benchmark = row.get(bench_col, "").strip()
            score_str = row.get(score_col, "").strip()
            if not model or not benchmark or not score_str:
                continue
            try:
                value = float(score_str)
            except ValueError:
                continue
            results.append({
                "model_id": model,
                "benchmark_id": benchmark,
                "value": value,
                "unit": "%",
            })
        return results

    @staticmethod
    def _find_col(
        fieldnames: List[str],
        lower_fields: List[str],
        candidates: tuple,
    ) -> Any:
        for c in candidates:
            if c in lower_fields:
                return fieldnames[lower_fields.index(c)]
        return None
