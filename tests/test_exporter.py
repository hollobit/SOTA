"""Tests for cyber.publisher.exporter."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

import pytest

from cyber.db.schema import (
    insert_benchmark,
    insert_leaderboard_ranking,
    insert_model,
    insert_score,
)
from cyber.models.types import Benchmark, LeaderboardRanking, Model, Score, Source
from cyber.publisher.exporter import Exporter


def _seed_db(db) -> None:
    """Insert a Model, Benchmark, Score, and LeaderboardRanking for testing."""
    model = Model(
        id="openai/gpt-5",
        vendor="OpenAI",
        name="GPT-5",
        version="2025-03",
        type="proprietary",
        modalities=["text", "image"],
        parameters="unknown",
        release_date="2025-03-15",
    )
    insert_model(db, model)

    benchmark = Benchmark(
        id="mmlu",
        name="MMLU",
        category="reasoning",
        description="Massive Multitask Language Understanding",
        metric="accuracy",
    )
    insert_benchmark(db, benchmark)

    score = Score(
        model_id="openai/gpt-5",
        benchmark_id="mmlu",
        value=92.5,
        unit="%",
        source=Source(
            type="vendor",
            url="https://openai.com/gpt5",
            date="2025-03-15",
            citation="OpenAI GPT-5 Technical Report",
        ),
        is_sota=True,
        collected_at=date(2025, 3, 20),
        notes="initial score",
    )
    insert_score(db, score)

    ranking = LeaderboardRanking(
        leaderboard="chatbot_arena",
        model_id="openai/gpt-5",
        rank=1,
        score=1350.0,
        metric="elo",
        snapshot_date=date(2025, 3, 20),
        source_url="https://arena.lmsys.org",
    )
    insert_leaderboard_ranking(db, ranking)


def test_export_all_creates_expected_files(db, tmp_path):
    """export_all creates all expected JSON files."""
    _seed_db(db)
    output_dir = tmp_path / "output"

    exporter = Exporter(db, output_dir)
    exporter.export_all()

    assert (output_dir / "models.json").exists()
    assert (output_dir / "benchmarks.json").exists()
    assert (output_dir / "scores" / "current.json").exists()
    assert (output_dir / "sota.json").exists()
    assert (output_dir / "leaderboards" / "chatbot_arena.json").exists()
    # history snapshot
    today = date.today().isoformat()
    assert (output_dir / "scores" / "history" / f"{today}.json").exists()


def test_models_json_content(db, tmp_path):
    """models.json content is correct."""
    _seed_db(db)
    output_dir = tmp_path / "output"

    exporter = Exporter(db, output_dir)
    exporter.export_all()

    data = json.loads((output_dir / "models.json").read_text())
    assert len(data) == 1
    m = data[0]
    assert m["id"] == "openai/gpt-5"
    assert m["vendor"] == "OpenAI"
    assert m["name"] == "GPT-5"
    assert m["modalities"] == ["text", "image"]


def test_sota_json_has_correct_entry(db, tmp_path):
    """sota.json has correct SOTA entry."""
    _seed_db(db)
    output_dir = tmp_path / "output"

    exporter = Exporter(db, output_dir)
    exporter.export_all()

    data = json.loads((output_dir / "sota.json").read_text())
    assert "mmlu" in data
    assert data["mmlu"]["model_id"] == "openai/gpt-5"
    assert data["mmlu"]["value"] == 92.5


def test_history_snapshot_exists_with_today_date(db, tmp_path):
    """history snapshot file exists with today's date in filename."""
    _seed_db(db)
    output_dir = tmp_path / "output"

    exporter = Exporter(db, output_dir)
    exporter.export_all()

    today = date.today().isoformat()
    snapshot_path = output_dir / "scores" / "history" / f"{today}.json"
    assert snapshot_path.exists()

    data = json.loads(snapshot_path.read_text())
    assert len(data) == 1
    assert data[0]["model_id"] == "openai/gpt-5"


def test_history_compact_change_log(db, tmp_path):
    """compact.json records value/url changes and disappearances per (model, benchmark)."""
    _seed_db(db)
    output_dir = tmp_path / "output"
    hist = output_dir / "scores" / "history"
    hist.mkdir(parents=True)
    a = {"model_id": "m1", "benchmark_id": "b1", "value": 1.0, "unit": "%", "source": {"url": "u1"}}
    b = {"model_id": "m2", "benchmark_id": "b1", "value": 5.0, "unit": "%", "source": {"url": "u2"}}
    (hist / "2026-01-01.json").write_text(json.dumps([a, b]))
    (hist / "2026-01-02.json").write_text(json.dumps([dict(a, value=2.0)]))
    (hist / "2026-01-03.json").write_text(json.dumps([dict(a, value=2.0)]))

    Exporter(db, output_dir)._export_history_compact()

    data = json.loads((hist / "compact.json").read_text())
    assert data["dates"] == ["2026-01-01", "2026-01-02", "2026-01-03"]
    assert data["counts"] == [2, 1, 1]
    rows = {(data["m"][r[0]], data["b"][r[1]]): r[2:] for r in data["r"]}
    url, unit = data["s"].index, data["u"].index
    assert rows[("m1", "b1")] == [[0, 1.0, url("u1"), unit("%")], [1, 2.0, url("u1"), unit("%")]]
    assert rows[("m2", "b1")] == [[0, 5.0, url("u2"), unit("%")], [1, None]]


def test_history_detail_shards(db, tmp_path):
    """detail/NN.json keeps notes / is_sota / collected_at per change, in the benchmark's shard."""
    _seed_db(db)
    output_dir = tmp_path / "output"
    hist = output_dir / "scores" / "history"
    hist.mkdir(parents=True)
    a = {"model_id": "m1", "benchmark_id": "b1", "value": 1.0, "unit": "%", "is_sota": True,
         "collected_at": "2026-01-01", "notes": "n1", "source": {"url": "u1"}}
    (hist / "2026-01-01.json").write_text(json.dumps([a]))
    (hist / "2026-01-02.json").write_text(json.dumps([dict(a, notes="n2", is_sota=False)]))

    Exporter(db, output_dir)._export_history_compact()

    shard = Exporter.history_shard("b1")
    data = json.loads((hist / "detail" / f"{shard:02d}.json").read_text())
    assert len(list((hist / "detail").glob("*.json"))) == Exporter.HISTORY_DETAIL_SHARDS
    (row,) = data["r"]
    assert row[:2] == ["m1", "b1"]
    assert [data["n"][c[3]] for c in row[2:]] == ["n1", "n2"]
    assert [c[4] for c in row[2:]] == [1, 0]
    assert [data["u"][c[6]] for c in row[2:]] == ["%", "%"]
    # value/url/unit unchanged -> no extra entry in the chart log
    compact = json.loads((hist / "compact.json").read_text())
    assert len(compact["r"][0]) == 3
