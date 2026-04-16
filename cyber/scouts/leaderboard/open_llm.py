"""Open LLM Leaderboard scout."""

from __future__ import annotations

from datetime import date
from typing import Any, Dict, List

import httpx

from cyber.models.types import RawRecord, Score, Source
from cyber.scouts.base import BaseScout

LEADERBOARD_URL = "https://huggingface.co/api/spaces/open-llm-leaderboard/results"


class OpenLLMScout(BaseScout):
    """Scout that fetches data from the HuggingFace Open LLM Leaderboard."""

    name = "open-llm-scout"

    async def _fetch_data(self) -> List[Dict[str, Any]]:
        """Fetch leaderboard data via HTTP."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(LEADERBOARD_URL)
            resp.raise_for_status()
            return resp.json()

    async def discover(self) -> List[RawRecord]:
        """Fetch leaderboard entries and wrap each as a RawRecord."""
        data = await self._fetch_data()
        today = date.today()
        return [
            RawRecord(
                scout_name=self.name,
                source_url="https://huggingface.co/spaces/open-llm-leaderboard",
                raw_data=entry,
                collected_at=today,
            )
            for entry in data
        ]

    def parse(self, raw: RawRecord) -> List[Score]:
        """Extract individual benchmark scores from a raw leaderboard entry."""
        entry = raw.raw_data
        model_id = entry["model"]
        scores_dict = entry.get("scores", {})
        source = Source(
            type="leaderboard",
            url=raw.source_url,
            date=str(raw.collected_at),
        )
        return [
            Score(
                model_id=model_id,
                benchmark_id=bench,
                value=value,
                unit="accuracy",
                source=source,
                is_sota=False,
                collected_at=raw.collected_at,
            )
            for bench, value in scores_dict.items()
        ]
