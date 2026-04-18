"""Tests for ChatbotArenaScout."""

from __future__ import annotations

import json
import pytest
from datetime import date
from pathlib import Path
from unittest.mock import AsyncMock

from cyber.scouts.leaderboard.chatbot_arena import ChatbotArenaScout
from cyber.models.types import RawRecord, Score


FIXTURE_PATH = Path(__file__).parent / "fixtures" / "sample_arena.json"


@pytest.fixture
def sample_data():
    with open(FIXTURE_PATH) as f:
        return json.load(f)


@pytest.fixture
def scout():
    return ChatbotArenaScout()


class TestChatbotArenaScoutName:
    def test_scout_name(self, scout):
        """Scout name should be 'chatbot-arena-scout'."""
        assert scout.name == "chatbot-arena-scout"


class TestChatbotArenaScoutDiscover:
    async def test_discover_returns_correct_number_of_records(self, scout, sample_data):
        """discover() should return one RawRecord per arena entry."""
        scout._fetch_data = AsyncMock(return_value=sample_data)
        records = await scout.discover()
        assert len(records) == 3

    async def test_discover_returns_raw_records(self, scout, sample_data):
        """discover() should return RawRecord instances."""
        scout._fetch_data = AsyncMock(return_value=sample_data)
        records = await scout.discover()
        assert all(isinstance(r, RawRecord) for r in records)

    async def test_discover_sets_scout_name(self, scout, sample_data):
        """Each RawRecord should carry the scout's name."""
        scout._fetch_data = AsyncMock(return_value=sample_data)
        records = await scout.discover()
        for r in records:
            assert r.scout_name == "chatbot-arena-scout"

    async def test_discover_preserves_raw_data(self, scout, sample_data):
        """Raw data in records should match the fixture entries."""
        scout._fetch_data = AsyncMock(return_value=sample_data)
        records = await scout.discover()
        assert records[0].raw_data["model_id"] == "anthropic/claude-4-opus"
        assert records[1].raw_data["model_id"] == "openai/gpt-4o"
        assert records[2].raw_data["model_id"] == "google/gemini-2.5-pro"


class TestChatbotArenaScoutParse:
    def test_parse_produces_score_with_correct_benchmark_id(self, scout, sample_data):
        """parse() should produce Score with benchmark_id='chatbot-arena-elo'."""
        raw = RawRecord(
            scout_name="chatbot-arena-scout",
            source_url="https://lmarena.ai",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert len(scores) == 1
        assert scores[0].benchmark_id == "chatbot-arena-elo"

    def test_parse_correct_value(self, scout, sample_data):
        """Score value should be the ELO rating."""
        raw = RawRecord(
            scout_name="chatbot-arena-scout",
            source_url="https://lmarena.ai",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert scores[0].value == 1350

    def test_parse_correct_model_id(self, scout, sample_data):
        """Score should have the correct model_id."""
        raw = RawRecord(
            scout_name="chatbot-arena-scout",
            source_url="https://lmarena.ai",
            raw_data=sample_data[1],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert scores[0].model_id == "openai/gpt-4o"

    def test_parse_unit_is_elo(self, scout, sample_data):
        """Score unit should be 'elo'."""
        raw = RawRecord(
            scout_name="chatbot-arena-scout",
            source_url="https://lmarena.ai",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert scores[0].unit == "elo"

    def test_parse_source_type_is_leaderboard(self, scout, sample_data):
        """Source type should be 'leaderboard'."""
        raw = RawRecord(
            scout_name="chatbot-arena-scout",
            source_url="https://lmarena.ai",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert scores[0].source.type == "leaderboard"

    def test_parse_notes_include_rank_and_votes(self, scout, sample_data):
        """Notes should include rank and votes."""
        raw = RawRecord(
            scout_name="chatbot-arena-scout",
            source_url="https://lmarena.ai",
            raw_data=sample_data[0],
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert "rank" in scores[0].notes.lower()
        assert "1" in scores[0].notes
        assert "25000" in scores[0].notes
