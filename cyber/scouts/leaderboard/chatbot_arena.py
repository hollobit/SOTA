"""Chatbot Arena scout — ELO rankings from LMSYS Arena."""

from __future__ import annotations

from datetime import date
from typing import Any, Dict, List

import httpx

from cyber.models.types import RawRecord, Score, Source
from cyber.scouts.base import BaseScout

ARENA_URL = "https://lmarena.ai/api/v1/leaderboard"


class ChatbotArenaScout(BaseScout):
    """Scout that fetches ELO rankings from the LMSYS Chatbot Arena."""

    name = "chatbot-arena-scout"

    async def _fetch_data(self) -> List[Dict[str, Any]]:
        """Fetch arena leaderboard data via HTTP."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(ARENA_URL)
            resp.raise_for_status()
            return resp.json()

    async def discover(self) -> List[RawRecord]:
        """Fetch arena entries and wrap each as a RawRecord."""
        data = await self._fetch_data()
        today = date.today()
        return [
            RawRecord(
                scout_name=self.name,
                source_url="https://lmarena.ai",
                raw_data=entry,
                collected_at=today,
            )
            for entry in data
        ]

    def parse(self, raw: RawRecord) -> List[Score]:
        """Extract ELO score from a raw arena entry."""
        entry = raw.raw_data
        model_id = entry["model_id"]
        elo = entry["elo"]
        rank = entry.get("rank", "N/A")
        votes = entry.get("votes", "N/A")
        source = Source(
            type="leaderboard",
            url=raw.source_url,
            date=str(raw.collected_at),
        )
        return [
            Score(
                model_id=model_id,
                benchmark_id="chatbot-arena-elo",
                value=float(elo),
                unit="elo",
                source=source,
                is_sota=False,
                collected_at=raw.collected_at,
                notes=f"rank: {rank}, votes: {votes}",
            )
        ]
