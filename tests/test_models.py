"""Tests for core data types."""

from datetime import date

from cyber.models.types import Benchmark, LeaderboardRanking, Model, RawRecord, Score, Source


def test_model_creation():
    m = Model(
        id="openai/gpt-4o-2025-01",
        vendor="OpenAI",
        name="GPT-4o",
        version="2025-01",
        type="proprietary",
        modalities=["text", "vision", "audio"],
        parameters=None,
        release_date="2025-01-01",
    )
    assert m.id == "openai/gpt-4o-2025-01"
    assert m.type == "proprietary"
    assert "vision" in m.modalities


def test_benchmark_creation():
    b = Benchmark(
        id="mmlu",
        name="MMLU",
        category="reasoning",
        description="Massive Multitask Language Understanding",
        metric="accuracy",
    )
    assert b.id == "mmlu"
    assert b.category == "reasoning"


def test_score_creation():
    s = Score(
        model_id="openai/gpt-4o-2025-01",
        benchmark_id="mmlu",
        value=92.3,
        unit="%",
        source=Source(type="vendor", url="https://openai.com", date="2025-01-15", citation=None),
        is_sota=True,
        collected_at=date(2026, 4, 16),
        notes="5-shot, CoT",
    )
    assert s.value == 92.3
    assert s.is_sota is True
    assert s.source.type == "vendor"


def test_leaderboard_ranking():
    lr = LeaderboardRanking(
        leaderboard="chatbot-arena",
        model_id="openai/gpt-4o-2025-01",
        rank=2,
        score=1287.0,
        metric="elo",
        snapshot_date=date(2026, 4, 16),
        source_url="https://arena.lmsys.org",
    )
    assert lr.rank == 2
    assert lr.metric == "elo"


def test_raw_record():
    rr = RawRecord(
        scout_name="vendor-scout",
        source_url="https://openai.com/model-card",
        raw_data={"table": [["MMLU", "92.3"]]},
        collected_at=date(2026, 4, 16),
    )
    assert rr.scout_name == "vendor-scout"


def test_source_valid_types():
    valid_types = ["vendor", "paper", "leaderboard", "safety", "release"]
    for t in valid_types:
        s = Source(type=t, url="https://example.com", date="2025-01-01", citation=None)
        assert s.type == t


def test_model_type_values():
    for t in ["proprietary", "open-weight", "open-source"]:
        m = Model(id="test", vendor="Test", name="Test", version="1", type=t, modalities=["text"])
        assert m.type == t
