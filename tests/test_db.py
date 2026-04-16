"""Tests for SQLite schema and CRUD operations."""

import json
import sqlite3

from cyber.db.connection import get_connection
from cyber.db.schema import (
    get_all_benchmarks,
    get_all_models,
    get_leaderboard_rankings,
    get_scores,
    init_db,
    insert_benchmark,
    insert_leaderboard_ranking,
    insert_model,
    insert_score,
)


class TestConnection:
    def test_get_connection_returns_connection(self, tmp_path):
        conn = get_connection(tmp_path / "test.db")
        assert isinstance(conn, sqlite3.Connection)
        conn.close()

    def test_wal_mode(self, tmp_path):
        conn = get_connection(tmp_path / "test.db")
        mode = conn.execute("PRAGMA journal_mode").fetchone()[0]
        assert mode == "wal"
        conn.close()

    def test_foreign_keys_enabled(self, tmp_path):
        conn = get_connection(tmp_path / "test.db")
        fk = conn.execute("PRAGMA foreign_keys").fetchone()[0]
        assert fk == 1
        conn.close()

    def test_row_factory(self, tmp_path):
        conn = get_connection(tmp_path / "test.db")
        assert conn.row_factory == sqlite3.Row
        conn.close()


class TestInitDb:
    def test_creates_tables(self, db):
        tables = db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        ).fetchall()
        table_names = [t["name"] for t in tables]
        assert "models" in table_names
        assert "benchmarks" in table_names
        assert "scores" in table_names
        assert "leaderboard_rankings" in table_names

    def test_idempotent(self, db):
        # Should not raise on second call
        init_db(db)


class TestModels:
    def test_insert_and_get(self, db):
        insert_model(
            db, id="gpt-4o", vendor="OpenAI", name="GPT-4o",
            version="2024-05-13", type="multimodal",
        )
        models = get_all_models(db)
        assert len(models) == 1
        assert models[0]["id"] == "gpt-4o"
        assert models[0]["vendor"] == "OpenAI"

    def test_modalities_stored_as_json(self, db):
        insert_model(
            db, id="gpt-4o", vendor="OpenAI", name="GPT-4o",
            version="2024-05-13", type="multimodal",
            modalities=["text", "image", "audio"],
        )
        row = get_all_models(db)[0]
        modalities = json.loads(row["modalities"])
        assert modalities == ["text", "image", "audio"]

    def test_insert_duplicate_ignored(self, db):
        insert_model(
            db, id="gpt-4o", vendor="OpenAI", name="GPT-4o",
            version="2024-05-13", type="multimodal",
        )
        insert_model(
            db, id="gpt-4o", vendor="OpenAI", name="GPT-4o CHANGED",
            version="2024-05-13", type="multimodal",
        )
        models = get_all_models(db)
        assert len(models) == 1
        assert models[0]["name"] == "GPT-4o"  # unchanged


class TestBenchmarks:
    def test_insert_and_get(self, db):
        insert_benchmark(
            db, id="mmlu", name="MMLU", category="knowledge",
            description="Massive Multitask Language Understanding", metric="accuracy",
        )
        benchmarks = get_all_benchmarks(db)
        assert len(benchmarks) == 1
        assert benchmarks[0]["id"] == "mmlu"
        assert benchmarks[0]["metric"] == "accuracy"


class TestScores:
    def _setup_model_and_benchmark(self, db):
        insert_model(
            db, id="gpt-4o", vendor="OpenAI", name="GPT-4o",
            version="2024-05-13", type="multimodal",
        )
        insert_benchmark(
            db, id="mmlu", name="MMLU", category="knowledge",
            description="Test", metric="accuracy",
        )

    def test_insert_and_get(self, db):
        self._setup_model_and_benchmark(db)
        insert_score(
            db, model_id="gpt-4o", benchmark_id="mmlu", value=88.7,
            unit="%", source_type="web", source_url="https://x.com",
            source_date="2025-01-01", collected_at="2025-06-01T00:00:00",
        )
        scores = get_scores(db)
        assert len(scores) == 1
        assert scores[0]["value"] == 88.7
        assert scores[0]["is_sota"] == 0

    def test_upsert_updates_existing(self, db):
        self._setup_model_and_benchmark(db)
        insert_score(
            db, model_id="gpt-4o", benchmark_id="mmlu", value=88.7,
            unit="%", source_type="web", source_url="https://x.com",
            source_date="2025-01-01", collected_at="2025-06-01T00:00:00",
        )
        # Upsert with new value
        insert_score(
            db, model_id="gpt-4o", benchmark_id="mmlu", value=90.2,
            unit="%", source_type="api", source_url="https://y.com",
            source_date="2025-06-15", collected_at="2025-06-15T00:00:00",
            is_sota=True, notes="Updated score",
        )
        scores = get_scores(db)
        assert len(scores) == 1
        assert scores[0]["value"] == 90.2
        assert scores[0]["is_sota"] == 1
        assert scores[0]["notes"] == "Updated score"

    def test_filter_by_model_id(self, db):
        self._setup_model_and_benchmark(db)
        insert_model(
            db, id="claude-4", vendor="Anthropic", name="Claude 4",
            version="1.0", type="chat",
        )
        insert_score(
            db, model_id="gpt-4o", benchmark_id="mmlu", value=88.7,
            unit="%", source_type="web", source_url="https://x.com",
            source_date="2025-01-01", collected_at="2025-06-01T00:00:00",
        )
        insert_score(
            db, model_id="claude-4", benchmark_id="mmlu", value=91.0,
            unit="%", source_type="web", source_url="https://x.com",
            source_date="2025-01-01", collected_at="2025-06-01T00:00:00",
        )
        scores = get_scores(db, model_id="claude-4")
        assert len(scores) == 1
        assert scores[0]["model_id"] == "claude-4"

    def test_filter_by_benchmark_id(self, db):
        self._setup_model_and_benchmark(db)
        insert_score(
            db, model_id="gpt-4o", benchmark_id="mmlu", value=88.7,
            unit="%", source_type="web", source_url="https://x.com",
            source_date="2025-01-01", collected_at="2025-06-01T00:00:00",
        )
        scores = get_scores(db, benchmark_id="mmlu")
        assert len(scores) == 1
        scores = get_scores(db, benchmark_id="gpqa")
        assert len(scores) == 0


class TestLeaderboardRankings:
    def test_insert_and_get(self, db):
        insert_model(
            db, id="gpt-4o", vendor="OpenAI", name="GPT-4o",
            version="2024-05-13", type="multimodal",
        )
        insert_leaderboard_ranking(
            db, leaderboard="chatbot-arena", model_id="gpt-4o",
            rank=1, score=1287.0, metric="elo",
            snapshot_date="2025-06-01", source_url="https://chat.lmsys.org",
        )
        rankings = get_leaderboard_rankings(db)
        assert len(rankings) == 1
        assert rankings[0]["rank"] == 1
        assert rankings[0]["score"] == 1287.0

    def test_filter_by_leaderboard(self, db):
        insert_model(
            db, id="gpt-4o", vendor="OpenAI", name="GPT-4o",
            version="2024-05-13", type="multimodal",
        )
        insert_leaderboard_ranking(
            db, leaderboard="chatbot-arena", model_id="gpt-4o",
            rank=1, score=1287.0, metric="elo",
            snapshot_date="2025-06-01", source_url="https://chat.lmsys.org",
        )
        insert_leaderboard_ranking(
            db, leaderboard="open-llm", model_id="gpt-4o",
            rank=3, score=75.5, metric="average",
            snapshot_date="2025-06-01", source_url="https://hf.co",
        )
        rankings = get_leaderboard_rankings(db, leaderboard="chatbot-arena")
        assert len(rankings) == 1
        assert rankings[0]["leaderboard"] == "chatbot-arena"

    def test_duplicate_ignored(self, db):
        insert_model(
            db, id="gpt-4o", vendor="OpenAI", name="GPT-4o",
            version="2024-05-13", type="multimodal",
        )
        insert_leaderboard_ranking(
            db, leaderboard="chatbot-arena", model_id="gpt-4o",
            rank=1, score=1287.0, metric="elo",
            snapshot_date="2025-06-01", source_url="https://chat.lmsys.org",
        )
        insert_leaderboard_ranking(
            db, leaderboard="chatbot-arena", model_id="gpt-4o",
            rank=2, score=1300.0, metric="elo",
            snapshot_date="2025-06-01", source_url="https://chat.lmsys.org",
        )
        rankings = get_leaderboard_rankings(db)
        assert len(rankings) == 1
        assert rankings[0]["rank"] == 1  # first insert wins
