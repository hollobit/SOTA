"""LLM-based fallback parser using Claude API for unstructured content."""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from cyber.parsers.base import BaseParser


class LlmParser(BaseParser):
    """Use an LLM (Claude) to extract benchmark data from unstructured text.

    Returns [] if no API key is configured. Actual API calls are gated behind
    the ``api_key`` being set.
    """

    def __init__(self, api_key: Optional[str] = None, model: str = "claude-sonnet-4-20250514") -> None:
        self.api_key = api_key
        self.model = model

    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        if not self.api_key:
            return []

        try:
            import anthropic  # type: ignore[import-untyped]
        except ImportError:
            return []

        client = anthropic.Anthropic(api_key=self.api_key)
        prompt = (
            "Extract all benchmark scores from the following content. "
            "Return a JSON array where each element has keys: "
            '"model", "benchmark", "score" (numeric). '
            "Return ONLY the JSON array, no other text.\n\n"
            f"Content:\n{content[:8000]}"
        )

        try:
            message = client.messages.create(
                model=self.model,
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}],
            )
            text = message.content[0].text
            data = json.loads(text)
            if not isinstance(data, list):
                return []
            results: List[Dict[str, Any]] = []
            for item in data:
                if not isinstance(item, dict):
                    continue
                model_name = item.get("model", "")
                benchmark = item.get("benchmark", "")
                score = item.get("score")
                if model_name and benchmark and score is not None:
                    results.append({
                        "model_id": str(model_name),
                        "benchmark_id": str(benchmark),
                        "value": float(score),
                        "unit": "%",
                    })
            return results
        except Exception:
            return []
