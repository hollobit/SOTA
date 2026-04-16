"""Tests for core data types."""

from cyber.models.types import Benchmark, LeaderboardRanking, Model, RawRecord, Score, Source


class TestSource:
    def test_create_source(self):
        s = Source(type="web", url="https://example.com", date="2025-01-01", citation="Example")
        assert s.type == "web"
        assert s.url == "https://example.com"
        assert s.date == "2025-01-01"
        assert s.citation == "Example"

    def test_source_types(self):
        for t in ("web", "pdf", "api", "manual"):
            s = Source(type=t, url="https://x.com", date="2025-01-01", citation="c")
            assert s.type == t


class TestModel:
    def test_create_model_minimal(self):
        m = Model(
            id="gpt-4o",
            vendor="OpenAI",
            name="GPT-4o",
            version="2024-05-13",
            type="multimodal",
        )
        assert m.id == "gpt-4o"
        assert m.vendor == "OpenAI"
        assert m.modalities == ["text"]
        assert m.parameters is None
        assert m.release_date is None

    def test_create_model_full(self):
        m = Model(
            id="llama-4-maverick",
            vendor="Meta",
            name="Llama 4 Maverick",
            version="1.0",
            type="chat",
            modalities=["text", "image"],
            parameters="400B",
            release_date="2025-04-05",
        )
        assert m.parameters == "400B"
        assert "image" in m.modalities
        assert m.release_date == "2025-04-05"


class TestBenchmark:
    def test_create_benchmark(self):
        b = Benchmark(
            id="mmlu",
            name="MMLU",
            category="knowledge",
            description="Massive Multitask Language Understanding",
            metric="accuracy",
        )
        assert b.id == "mmlu"
        assert b.metric == "accuracy"


class TestScore:
    def test_create_score(self):
        src = Source(type="web", url="https://x.com", date="2025-01-01", citation="c")
        s = Score(
            model_id="gpt-4o",
            benchmark_id="mmlu",
            value=88.7,
            unit="%",
            source=src,
        )
        assert s.model_id == "gpt-4o"
        assert s.benchmark_id == "mmlu"
        assert s.value == 88.7
        assert s.is_sota is False
        assert s.collected_at  # auto-generated
        assert s.notes == ""

    def test_score_with_sota(self):
        src = Source(type="api", url="https://x.com", date="2025-01-01", citation="c")
        s = Score(
            model_id="claude-4-opus",
            benchmark_id="gpqa",
            value=72.5,
            unit="%",
            source=src,
            is_sota=True,
            notes="New SOTA on GPQA Diamond",
        )
        assert s.is_sota is True
        assert s.notes == "New SOTA on GPQA Diamond"


class TestLeaderboardRanking:
    def test_create_ranking(self):
        r = LeaderboardRanking(
            leaderboard="chatbot-arena",
            model_id="gpt-4o",
            rank=1,
            score=1287.0,
            metric="elo",
            snapshot_date="2025-06-01",
            source_url="https://chat.lmsys.org",
        )
        assert r.leaderboard == "chatbot-arena"
        assert r.rank == 1
        assert r.score == 1287.0
        assert r.metric == "elo"


class TestRawRecord:
    def test_create_raw_record(self):
        r = RawRecord(
            scout_name="open-llm-scout",
            source_url="https://hf.co/leaderboard",
            raw_data={"model": "test", "scores": [1, 2, 3]},
        )
        assert r.scout_name == "open-llm-scout"
        assert r.raw_data["model"] == "test"
        assert r.collected_at  # auto-generated

    def test_raw_record_preserves_dict(self):
        data = {"nested": {"key": "value"}, "list": [1, 2]}
        r = RawRecord(
            scout_name="test",
            source_url="https://x.com",
            raw_data=data,
        )
        assert r.raw_data["nested"]["key"] == "value"
