"""Parser for structured JSON API responses containing benchmark data."""

from __future__ import annotations

import json
from typing import Any, Dict, List

from cyber.parsers.base import BaseParser


class JsonApiParser(BaseParser):
    """Handles two JSON formats:

    1. Array of {"model": "x", "benchmark": "y", "score": 90.0}
    2. Dict with {"model": "x", "scores": {"mmlu": 90.0, "gpqa": 85.0}}
    """

    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        """Parse JSON content and return standardized benchmark records."""
        try:
            data = json.loads(content)
        except (json.JSONDecodeError, TypeError):
            return []

        results: List[Dict[str, Any]] = []

        if isinstance(data, list):
            results = self._parse_array(data)
        elif isinstance(data, dict):
            results = self._parse_dict(data)

        return results

    def _parse_array(self, data: List[Any]) -> List[Dict[str, Any]]:
        """Parse array format: [{"model": ..., "benchmark": ..., "score": ...}]."""
        results: List[Dict[str, Any]] = []
        for item in data:
            if not isinstance(item, dict):
                continue
            model = item.get("model", "")
            benchmark = item.get("benchmark", "")
            score = item.get("score")
            if model and benchmark and score is not None:
                try:
                    results.append({
                        "model_id": str(model),
                        "benchmark_id": str(benchmark),
                        "value": float(score),
                        "unit": "%",
                    })
                except (ValueError, TypeError):
                    continue
        return results

    def _parse_dict(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse dict format: {"model": ..., "scores": {"mmlu": 90.0, ...}}."""
        results: List[Dict[str, Any]] = []
        model = data.get("model", "")
        scores = data.get("scores", {})
        if not model or not isinstance(scores, dict):
            return results
        for benchmark, score in scores.items():
            if score is not None:
                try:
                    results.append({
                        "model_id": str(model),
                        "benchmark_id": str(benchmark),
                        "value": float(score),
                        "unit": "%",
                    })
                except (ValueError, TypeError):
                    continue
        return results
