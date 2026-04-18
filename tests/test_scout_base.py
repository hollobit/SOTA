"""Tests for BaseScout ABC."""

import pytest
from datetime import date
from cyber.scouts.base import BaseScout
from cyber.models.types import RawRecord, Score, Source


class FakeScout(BaseScout):
    """A concrete scout for testing."""
    name = "fake-scout"

    async def discover(self) -> list:
        return [
            RawRecord(
                scout_name=self.name,
                source_url="https://example.com",
                raw_data={"model": "test-model", "score": 90.0},
                collected_at=date(2026, 1, 1),
            )
        ]

    def parse(self, raw: RawRecord) -> list:
        return [
            Score(
                model_id=raw.raw_data["model"],
                benchmark_id="test-bench",
                value=raw.raw_data["score"],
                unit="accuracy",
                source=Source(type="leaderboard", url=raw.source_url, date="2026-01-01"),
                is_sota=False,
                collected_at=raw.collected_at,
            )
        ]


class TestBaseScoutABC:
    def test_cannot_instantiate_without_methods(self):
        """BaseScout cannot be instantiated without implementing abstract methods."""
        with pytest.raises(TypeError):
            BaseScout()  # type: ignore

    def test_incomplete_scout_raises(self):
        """A subclass missing abstract methods cannot be instantiated."""
        class IncompleteScout(BaseScout):
            name = "incomplete"

            async def discover(self) -> list:
                return []
            # missing parse()

        with pytest.raises(TypeError):
            IncompleteScout()

    def test_fake_scout_instantiates(self):
        """A fully implemented scout can be instantiated."""
        scout = FakeScout()
        assert scout.name == "fake-scout"

    async def test_discover_returns_raw_records(self):
        """discover() should return a list of RawRecord."""
        scout = FakeScout()
        records = await scout.discover()
        assert len(records) == 1
        assert isinstance(records[0], RawRecord)
        assert records[0].scout_name == "fake-scout"

    def test_parse_returns_scores(self):
        """parse() should return a list of Score."""
        scout = FakeScout()
        raw = RawRecord(
            scout_name="fake-scout",
            source_url="https://example.com",
            raw_data={"model": "test-model", "score": 90.0},
            collected_at=date(2026, 1, 1),
        )
        scores = scout.parse(raw)
        assert len(scores) == 1
        assert isinstance(scores[0], Score)
        assert scores[0].model_id == "test-model"
        assert scores[0].value == 90.0
