"""Tests for Scheduler."""

from __future__ import annotations

from datetime import date, timedelta

import pytest

from cyber.agents.scheduler import Scheduler
from cyber.models.types import SourceEntry


def _make_source(**kwargs) -> SourceEntry:
    defaults = dict(
        id="test",
        url="https://example.com",
        name="Test",
        type="leaderboard",
        format="html_table",
        trust_score=0.5,
        status="active",
        discovered_by="seed",
        discovered_at=date(2026, 1, 1),
        crawl_count=0,
        change_count=0,
        fail_count=0,
        crawl_interval_hours=24,
    )
    defaults.update(kwargs)
    return SourceEntry(**defaults)


@pytest.fixture
def scheduler() -> Scheduler:
    return Scheduler()


class TestFilterDue:
    def test_never_crawled_included(self, scheduler: Scheduler) -> None:
        src = _make_source(last_crawled_at=None)
        result = scheduler.filter_due([src], as_of=date(2026, 4, 1))
        assert len(result) == 1

    def test_overdue_included(self, scheduler: Scheduler) -> None:
        src = _make_source(last_crawled_at=date(2026, 1, 1), crawl_interval_hours=24)
        result = scheduler.filter_due([src], as_of=date(2026, 1, 5))
        assert len(result) == 1

    def test_not_due_excluded(self, scheduler: Scheduler) -> None:
        today = date(2026, 4, 1)
        src = _make_source(last_crawled_at=today, crawl_interval_hours=24)
        result = scheduler.filter_due([src], as_of=today)
        assert len(result) == 0

    def test_non_active_excluded(self, scheduler: Scheduler) -> None:
        src = _make_source(status="dead", last_crawled_at=None)
        result = scheduler.filter_due([src], as_of=date(2026, 4, 1))
        assert len(result) == 0

    def test_sorted_by_trust_desc(self, scheduler: Scheduler) -> None:
        s1 = _make_source(id="a", trust_score=0.3, last_crawled_at=None)
        s2 = _make_source(id="b", trust_score=0.9, last_crawled_at=None)
        result = scheduler.filter_due([s1, s2], as_of=date(2026, 4, 1))
        assert result[0].trust_score > result[1].trust_score


class TestGroupByTrust:
    def test_high(self, scheduler: Scheduler) -> None:
        src = _make_source(trust_score=0.9)
        groups = scheduler.group_by_trust([src])
        assert len(groups["high"]) == 1

    def test_medium(self, scheduler: Scheduler) -> None:
        src = _make_source(trust_score=0.6)
        groups = scheduler.group_by_trust([src])
        assert len(groups["medium"]) == 1

    def test_low(self, scheduler: Scheduler) -> None:
        src = _make_source(trust_score=0.3)
        groups = scheduler.group_by_trust([src])
        assert len(groups["low"]) == 1

    def test_boundary_08_is_high(self, scheduler: Scheduler) -> None:
        src = _make_source(trust_score=0.8)
        groups = scheduler.group_by_trust([src])
        assert len(groups["high"]) == 1

    def test_boundary_05_is_medium(self, scheduler: Scheduler) -> None:
        src = _make_source(trust_score=0.5)
        groups = scheduler.group_by_trust([src])
        assert len(groups["medium"]) == 1

    def test_mixed(self, scheduler: Scheduler) -> None:
        sources = [
            _make_source(id="h", trust_score=0.9),
            _make_source(id="m", trust_score=0.6),
            _make_source(id="l", trust_score=0.2),
        ]
        groups = scheduler.group_by_trust(sources)
        assert len(groups["high"]) == 1
        assert len(groups["medium"]) == 1
        assert len(groups["low"]) == 1


class TestMaxParallel:
    def test_high(self) -> None:
        assert Scheduler.max_parallel("high") == 10

    def test_medium(self) -> None:
        assert Scheduler.max_parallel("medium") == 5

    def test_low(self) -> None:
        assert Scheduler.max_parallel("low") == 3

    def test_unknown_defaults_to_3(self) -> None:
        assert Scheduler.max_parallel("unknown") == 3
