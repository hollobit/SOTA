"""Tests for OpenLLMScout."""

import json
import pytest
from datetime import date
from pathlib import Path
from unittest.mock import AsyncMock, patch

from cyber.scouts.leaderboard.open_llm import OpenLLMScout
from cyber.models.types import RawRecord, Score


FIXTURE_PATH = Path(__file__).parent / "fixtures" / "sample_open_llm.json"


@pytest.fixture
def sample_data():
    with open(FIXTURE_PATH) as f:
        return json.load(f)


@pytest.fixture
def scout():
    return OpenLLMScout()


class TestOpenLLMScoutDiscover:
    async def test_discover_returns_raw_records(self, scout, sample_data):
        """discover() should return one RawRecord per model entry."""
        scout._fetch_data = AsyncMock(return_value=sample_data)
        records = await scout.discover()
        assert len(records) == 2
        assert all(isinstance(r, RawRecord) for r in records)

    async def test_discover_sets_scout_name(self, scout, sample_data):
        """Each RawRecord should carry the scout's name."""
        scout._fetch_data = AsyncMock(return_value=sample_data)
        records = await scout.discover()
        for r in records:
            assert r.scout_name == "open-llm-scout"

    async def test_discover_preserves_raw_data(self, scout, sample_data):
        """Raw data in records should match the fixture entries."""
        scout._fetch_data = AsyncMock(return_value=sample_data)
        records = await scout.discover()
        assert records[0].raw_data["model"] == "meta-llama/Llama-4-Maverick"
        assert records[1].raw_data["model"] == "Qwen/Qwen3-235B"


class TestOpenLLMScoutParse:
    def test_parse_extracts_correct_number_of_scores(self, scout, sample_data):
        """parse() should produce one Score per benchmark in scores dict."""
        raw = RawRecord(
            scout_name="open-llm-scout",
            source_url="https://huggingface.co/spaces/open-llm-leaderboard",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert len(scores) == 5  # mmlu, gpqa, humaneval, math, ifeval

    def test_parse_correct_model_id(self, scout, sample_data):
        """Each Score should have the correct model_id."""
        raw = RawRecord(
            scout_name="open-llm-scout",
            source_url="https://huggingface.co/spaces/open-llm-leaderboard",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        for s in scores:
            assert s.model_id == "meta-llama/Llama-4-Maverick"

    def test_parse_correct_benchmark_ids(self, scout, sample_data):
        """Benchmark IDs should match the keys in the scores dict."""
        raw = RawRecord(
            scout_name="open-llm-scout",
            source_url="https://huggingface.co/spaces/open-llm-leaderboard",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        bench_ids = {s.benchmark_id for s in scores}
        assert bench_ids == {"mmlu", "gpqa", "humaneval", "math", "ifeval"}

    def test_parse_correct_values(self, scout, sample_data):
        """Score values should match the fixture data."""
        raw = RawRecord(
            scout_name="open-llm-scout",
            source_url="https://huggingface.co/spaces/open-llm-leaderboard",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        value_map = {s.benchmark_id: s.value for s in scores}
        assert value_map["mmlu"] == 88.5
        assert value_map["gpqa"] == 61.2
        assert value_map["humaneval"] == 85.0

    def test_parse_score_metadata(self, scout, sample_data):
        """Scores should have correct source type and unit."""
        raw = RawRecord(
            scout_name="open-llm-scout",
            source_url="https://huggingface.co/spaces/open-llm-leaderboard",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        for s in scores:
            assert isinstance(s, Score)
            assert s.source.type == "leaderboard"
            assert s.unit == "accuracy"
            assert s.collected_at == date(2026, 4, 16)
