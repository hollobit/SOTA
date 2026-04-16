"""Librarian Agent — manages crawl intervals, trust scores, and source health."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Optional, Set

from cyber.models.types import SourceEntry

HIGH_TRUST_DOMAINS: Set[str] = {
    "arxiv.org", "huggingface.co", "anthropic.com", "openai.com",
    "deepmind.google", "blog.google", "nist.gov", "epoch.ai", "scale.com",
}

# Conference windows: (month, start_day, end_day)
_CONFERENCES = [
    ("NeurIPS", 12, 1, 14),
    ("ICML", 7, 14, 28),
    ("ICLR", 5, 1, 14),
    ("ACL", 7, 1, 14),
]


class LibrarianAgent:
    """Manage source metadata: crawl intervals, trust, health status."""

    def compute_interval(self, source: SourceEntry) -> int:
        """Return recommended crawl interval in hours based on change rate."""
        if source.crawl_count == 0:
            return 24

        change_rate = source.change_count / source.crawl_count if source.crawl_count > 0 else 0.0

        if change_rate > 0.5:
            return 6
        elif change_rate > 0.2:
            return 24
        elif change_rate > 0.05:
            return 72
        else:
            return 168

    def compute_trust(
        self,
        source: SourceEntry,
        cross_validation_pass: bool = False,
        first_sota_reporter: bool = False,
    ) -> float:
        """Compute updated trust score with bonuses and penalties."""
        trust = source.trust_score

        # Bonus for cross-validation
        if cross_validation_pass:
            trust += 0.1

        # Bonus for being first to report SOTA
        if first_sota_reporter:
            trust += 0.15

        # Penalty for high fail count
        if source.fail_count >= 3:
            trust -= 0.1 * (source.fail_count - 2)

        # Bonus for high-trust domain
        from urllib.parse import urlparse
        domain = urlparse(source.url).netloc.replace("www.", "")
        if domain in HIGH_TRUST_DOMAINS:
            trust += 0.05

        # Clamp to [0, 1]
        return max(0.0, min(1.0, trust))

    def check_health(
        self,
        source: SourceEntry,
        as_of: Optional[date] = None,
    ) -> str:
        """Return the health status: 'active', 'dead', or 'paused'."""
        if as_of is None:
            as_of = date.today()

        # Too many failures → dead
        if source.fail_count >= 5:
            return "dead"

        # Low trust → paused
        if source.trust_score < 0.3:
            return "paused"

        # Candidate with at least one success → active
        if source.status == "candidate" and source.crawl_count > 0 and source.fail_count < source.crawl_count:
            return "active"

        # Candidate with 14 days and zero successes → dead
        if source.status == "candidate":
            days_since = (as_of - source.discovered_at).days
            if days_since >= 14 and source.crawl_count == 0:
                return "dead"

        # Default: keep current status
        return source.status

    def is_conference_season(self, d: Optional[date] = None) -> bool:
        """Return True if *d* falls within a major AI conference window."""
        if d is None:
            d = date.today()

        for name, month, start_day, end_day in _CONFERENCES:
            if d.month == month and start_day <= d.day <= end_day:
                return True
        return False

    def apply_boost(self, interval: int, factor: float = 0.5) -> int:
        """Reduce *interval* by *factor*, with a floor of 6 hours."""
        return max(6, int(interval * factor))
