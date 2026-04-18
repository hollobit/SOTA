"""Tests for database schema and CRUD operations."""

from datetime import date

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
from cyber.models.types import Benchmark, LeaderboardRanking, Model, Score, Source


def test_init_db_creates_tables(db):
    init_db(db)
    cursor = db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [row[0] for row in cursor.fetchall()]
    assert "models" in tables
    assert "benchmarks" in tables
    assert "scores" in tables
    assert "leaderboard_rankings" in tables


def test_insert_and_get_model(db):
    init_db(db)
    m = Model(
        id="openai/gpt-4o", vendor="OpenAI", name="GPT-4o",
        version="2025-01", type="proprietary", modalities=["text", "vision"],
    )
    insert_model(db, m)
    models = get_all_models(db)
    assert len(models) == 1
    assert models[0].id == "openai/gpt-4o"
    assert models[0].modalities == ["text", "vision"]


def test_insert_and_get_benchmark(db):
    init_db(db)
    b = Benchmark(id="mmlu", name="MMLU", category="reasoning",
                  description="Multitask LU", metric="accuracy")
    insert_benchmark(db, b)
    benchmarks = get_all_benchmarks(db)
    assert len(benchmarks) == 1
    assert benchmarks[0].id == "mmlu"


def test_insert_and_get_score(db):
    init_db(db)
    m = Model(id="openai/gpt-4o", vendor="OpenAI", name="GPT-4o",
              version="2025-01", type="proprietary", modalities=["text"])
    insert_model(db, m)
    b = Benchmark(id="mmlu", name="MMLU", category="reasoning",
                  description="Multitask LU", metric="accuracy")
    insert_benchmark(db, b)
    s = Score(
        model_id="openai/gpt-4o", benchmark_id="mmlu", value=92.3, unit="%",
        source=Source(type="vendor", url="https://openai.com", date="2025-01-15", citation=None),
        is_sota=True, collected_at=date(2026, 4, 16), notes="5-shot",
    )
    insert_score(db, s)
    scores = get_scores(db)
    assert len(scores) == 1
    assert scores[0].value == 92.3


def test_upsert_score_updates_existing(db):
    init_db(db)
    m = Model(id="openai/gpt-4o", vendor="OpenAI", name="GPT-4o",
              version="2025-01", type="proprietary", modalities=["text"])
    insert_model(db, m)
    b = Benchmark(id="mmlu", name="MMLU", category="reasoning",
                  description="Multitask LU", metric="accuracy")
    insert_benchmark(db, b)
    src = Source(type="vendor", url="https://openai.com", date="2025-01-15", citation=None)
    s1 = Score(model_id="openai/gpt-4o", benchmark_id="mmlu", value=90.0, unit="%",
               source=src, is_sota=False, collected_at=date(2026, 4, 15), notes="5-shot")
    s2 = Score(model_id="openai/gpt-4o", benchmark_id="mmlu", value=92.3, unit="%",
               source=src, is_sota=True, collected_at=date(2026, 4, 16), notes="5-shot")
    insert_score(db, s1)
    insert_score(db, s2)
    scores = get_scores(db)
    assert len(scores) == 1
    assert scores[0].value == 92.3


def test_insert_and_get_leaderboard_ranking(db):
    init_db(db)
    m = Model(id="openai/gpt-4o", vendor="OpenAI", name="GPT-4o",
              version="2025-01", type="proprietary", modalities=["text"])
    insert_model(db, m)
    lr = LeaderboardRanking(
        leaderboard="chatbot-arena", model_id="openai/gpt-4o",
        rank=2, score=1287.0, metric="elo",
        snapshot_date=date(2026, 4, 16), source_url="https://arena.lmsys.org",
    )
    insert_leaderboard_ranking(db, lr)
    rankings = get_leaderboard_rankings(db)
    assert len(rankings) == 1
    assert rankings[0].rank == 2
