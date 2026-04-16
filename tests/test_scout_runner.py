"""Tests for scout runner."""

import pytest
from datetime import date
from cyber.scouts.base import BaseScout
from cyber.scouts.runner import ScoutResults, run_scouts
from cyber.models.types import RawRecord, Score, Source


class SuccessScout(BaseScout):
    name = "success-scout"

    async def discover(self) -> list:
        return [
            RawRecord(
                scout_name=self.name,
                source_url="https://example.com/success",
                raw_data={"model": "model-a", "score": 95.0},
                collected_at=date(2026, 1, 1),
            )
        ]

    def parse(self, raw: RawRecord) -> list:
        return [
            Score(
                model_id=raw.raw_data["model"],
                benchmark_id="bench-1",
                value=raw.raw_data["score"],
                unit="accuracy",
                source=Source(type="leaderboard", url=raw.source_url, date="2026-01-01"),
                is_sota=False,
                collected_at=raw.collected_at,
            )
        ]


class FailingScout(BaseScout):
    name = "failing-scout"

    async def discover(self) -> list:
        raise RuntimeError("Network error")

    def parse(self, raw: RawRecord) -> list:
        return []


class MultiScoreScout(BaseScout):
    name = "multi-scout"

    async def discover(self) -> list:
        return [
            RawRecord(
                scout_name=self.name,
                source_url="https://example.com/multi",
                raw_data={"model": "model-b", "scores": {"mmlu": 80.0, "gpqa": 70.0}},
                collected_at=date(2026, 2, 1),
            )
        ]

    def parse(self, raw: RawRecord) -> list:
        scores_dict = raw.raw_data["scores"]
        return [
            Score(
                model_id=raw.raw_data["model"],
                benchmark_id=bench,
                value=val,
                unit="accuracy",
                source=Source(type="leaderboard", url=raw.source_url, date="2026-02-01"),
                is_sota=False,
                collected_at=raw.collected_at,
            )
            for bench, val in scores_dict.items()
        ]


class TestScoutResults:
    def test_dataclass_fields(self):
        result = ScoutResults(scores=[], errors=[])
        assert result.scores == []
        assert result.errors == []


class TestRunScouts:
    async def test_single_success(self):
        """Runner collects results from a single scout."""
        results = await run_scouts([SuccessScout()])
        assert len(results.scores) == 1
        assert results.scores[0].model_id == "model-a"
        assert len(results.errors) == 0

    async def test_multiple_scouts(self):
        """Runner collects results from multiple scouts."""
        results = await run_scouts([SuccessScout(), MultiScoreScout()])
        assert len(results.scores) == 3  # 1 + 2
        assert len(results.errors) == 0

    async def test_failure_isolation(self):
        """One failing scout does not stop others."""
        results = await run_scouts([SuccessScout(), FailingScout()])
        assert len(results.scores) == 1
        assert results.scores[0].model_id == "model-a"
        assert len(results.errors) == 1
        assert "failing-scout" in results.errors[0]

    async def test_empty_list(self):
        """Runner with no scouts returns empty results."""
        results = await run_scouts([])
        assert len(results.scores) == 0
        assert len(results.errors) == 0
