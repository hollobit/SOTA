"""Tests for source registry: SourceEntry dataclass and DB CRUD."""

from __future__ import annotations

from datetime import date, timedelta

import pytest

from cyber.models.types import SourceEntry


# === Task 1: SourceEntry dataclass tests ===


class TestSourceEntryCreation:
    """test_source_entry_creation — all fields set explicitly."""

    def test_source_entry_creation(self):
        entry = SourceEntry(
            id="chatbot-arena",
            url="https://lmarena.ai",
            name="Chatbot Arena",
            type="leaderboard",
            format="json_api",
            trust_score=0.95,
            status="active",
            discovered_by="seed",
            discovered_at=date(2025, 1, 1),
            last_crawled_at=date(2025, 6, 1),
            last_changed_at=date(2025, 5, 15),
            crawl_count=10,
            change_count=3,
            fail_count=1,
            crawl_interval_hours=12,
            benchmarks=["arena-elo", "arena-hard"],
            models_count=150,
            notes="Primary source",
        )
        assert entry.id == "chatbot-arena"
        assert entry.url == "https://lmarena.ai"
        assert entry.name == "Chatbot Arena"
        assert entry.type == "leaderboard"
        assert entry.format == "json_api"
        assert entry.trust_score == 0.95
        assert entry.status == "active"
        assert entry.discovered_by == "seed"
        assert entry.discovered_at == date(2025, 1, 1)
        assert entry.last_crawled_at == date(2025, 6, 1)
        assert entry.last_changed_at == date(2025, 5, 15)
        assert entry.crawl_count == 10
        assert entry.change_count == 3
        assert entry.fail_count == 1
        assert entry.crawl_interval_hours == 12
        assert entry.benchmarks == ["arena-elo", "arena-hard"]
        assert entry.models_count == 150
        assert entry.notes == "Primary source"

    def test_source_entry_defaults(self):
        entry = SourceEntry(
            id="test",
            url="https://example.com",
            name="Test",
            type="leaderboard",
            format="html_table",
            trust_score=0.5,
            status="candidate",
            discovered_by="seed",
            discovered_at=date(2025, 1, 1),
        )
        assert entry.last_crawled_at is None
        assert entry.last_changed_at is None
        assert entry.crawl_count == 0
        assert entry.change_count == 0
        assert entry.fail_count == 0
        assert entry.crawl_interval_hours == 24
        assert entry.benchmarks == []
        assert entry.models_count == 0
        assert entry.notes == ""


# === Task 2: Sources DB table CRUD tests ===


from cyber.db.schema import (
    get_due_sources,
    get_source_by_id,
    get_sources,
    insert_source,
    update_source,
)


def _make_source(**overrides) -> SourceEntry:
    """Helper to create a SourceEntry with sensible defaults."""
    defaults = dict(
        id="src-1",
        url="https://example.com",
        name="Example",
        type="leaderboard",
        format="html_table",
        trust_score=0.8,
        status="active",
        discovered_by="seed",
        discovered_at=date(2025, 1, 1),
    )
    defaults.update(overrides)
    return SourceEntry(**defaults)


class TestInsertAndGetSource:
    def test_insert_and_get_source(self, db):
        src = _make_source(benchmarks=["bench-a", "bench-b"], models_count=42)
        insert_source(db, src)
        results = get_sources(db)
        assert len(results) == 1
        got = results[0]
        assert got.id == "src-1"
        assert got.url == "https://example.com"
        assert got.benchmarks == ["bench-a", "bench-b"]
        assert got.models_count == 42
        assert got.trust_score == 0.8


class TestGetSourceById:
    def test_get_source_by_id(self, db):
        insert_source(db, _make_source(id="abc"))
        result = get_source_by_id(db, "abc")
        assert result is not None
        assert result.id == "abc"

    def test_get_source_by_id_not_found(self, db):
        result = get_source_by_id(db, "nonexistent")
        assert result is None


class TestUpdateSource:
    def test_update_source(self, db):
        src = _make_source()
        insert_source(db, src)
        src.trust_score = 0.99
        src.crawl_count = 5
        src.notes = "updated"
        update_source(db, src)
        got = get_source_by_id(db, "src-1")
        assert got.trust_score == 0.99
        assert got.crawl_count == 5
        assert got.notes == "updated"


class TestGetSourcesByStatus:
    def test_get_sources_by_status(self, db):
        insert_source(db, _make_source(id="a1", url="https://a.com", status="active"))
        insert_source(db, _make_source(id="a2", url="https://b.com", status="active"))
        insert_source(db, _make_source(id="c1", url="https://c.com", status="candidate"))
        assert len(get_sources(db, status="active")) == 2
        assert len(get_sources(db, status="candidate")) == 1
        assert len(get_sources(db)) == 3


class TestGetDueSources:
    def test_get_due_sources(self, db):
        today = date(2025, 6, 15)

        # Due: last crawled 3 days ago, interval = 24h (1 day)
        insert_source(
            db,
            _make_source(
                id="due",
                url="https://due.com",
                status="active",
                trust_score=0.9,
                last_crawled_at=today - timedelta(days=3),
                crawl_interval_hours=24,
            ),
        )
        # Not due: last crawled today, interval = 24h
        insert_source(
            db,
            _make_source(
                id="not-due",
                url="https://notdue.com",
                status="active",
                trust_score=0.7,
                last_crawled_at=today,
                crawl_interval_hours=24,
            ),
        )
        # Never crawled (should be due)
        insert_source(
            db,
            _make_source(
                id="never",
                url="https://never.com",
                status="active",
                trust_score=0.5,
            ),
        )
        # Paused — not returned even if due
        insert_source(
            db,
            _make_source(
                id="paused",
                url="https://paused.com",
                status="paused",
                last_crawled_at=today - timedelta(days=30),
            ),
        )

        due = get_due_sources(db, as_of=today)
        due_ids = [s.id for s in due]
        assert "due" in due_ids
        assert "never" in due_ids
        assert "not-due" not in due_ids
        assert "paused" not in due_ids
        # Sorted by trust_score DESC
        assert due[0].trust_score >= due[1].trust_score
