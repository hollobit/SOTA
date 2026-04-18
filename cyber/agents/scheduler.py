"""Scheduler — filters due sources and groups them by trust tier."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Dict, List, Optional

from cyber.models.types import SourceEntry


class Scheduler:
    """Decide which sources to crawl and how to parallelize."""

    def filter_due(
        self,
        sources: List[SourceEntry],
        as_of: Optional[date] = None,
    ) -> List[SourceEntry]:
        """Return active sources that are overdue or never crawled, sorted by trust DESC."""
        if as_of is None:
            as_of = date.today()

        due: List[SourceEntry] = []
        for s in sources:
            if s.status != "active":
                continue
            if s.last_crawled_at is None:
                due.append(s)
            else:
                hours_since = (as_of - s.last_crawled_at).total_seconds() / 3600
                if hours_since >= s.crawl_interval_hours:
                    due.append(s)

        due.sort(key=lambda s: s.trust_score, reverse=True)
        return due

    def group_by_trust(
        self,
        sources: List[SourceEntry],
    ) -> Dict[str, List[SourceEntry]]:
        """Group sources into high (>=0.8), medium (0.5~0.8), low (<0.5)."""
        groups: Dict[str, List[SourceEntry]] = {
            "high": [],
            "medium": [],
            "low": [],
        }
        for s in sources:
            if s.trust_score >= 0.8:
                groups["high"].append(s)
            elif s.trust_score >= 0.5:
                groups["medium"].append(s)
            else:
                groups["low"].append(s)
        return groups

    @staticmethod
    def max_parallel(group: str) -> int:
        """Return max parallel crawl slots for a trust tier."""
        limits = {"high": 10, "medium": 5, "low": 3}
        return limits.get(group, 3)
