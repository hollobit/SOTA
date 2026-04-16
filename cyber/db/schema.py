"""SQLite schema and CRUD operations for the benchmark database."""

from __future__ import annotations

import json
import sqlite3
from datetime import date

from cyber.models.types import Benchmark, LeaderboardRanking, Model, Score, Source

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS models (
    id TEXT PRIMARY KEY,
    vendor TEXT NOT NULL,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    type TEXT NOT NULL,
    modalities TEXT NOT NULL DEFAULT '[]',
    parameters TEXT,
    release_date TEXT
);

CREATE TABLE IF NOT EXISTS benchmarks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    metric TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
    model_id TEXT NOT NULL,
    benchmark_id TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_date TEXT NOT NULL,
    source_citation TEXT,
    is_sota INTEGER NOT NULL DEFAULT 0,
    collected_at TEXT NOT NULL,
    notes TEXT DEFAULT '',
    PRIMARY KEY (model_id, benchmark_id),
    FOREIGN KEY (model_id) REFERENCES models(id),
    FOREIGN KEY (benchmark_id) REFERENCES benchmarks(id)
);

CREATE TABLE IF NOT EXISTS leaderboard_rankings (
    leaderboard TEXT NOT NULL,
    model_id TEXT NOT NULL,
    rank INTEGER NOT NULL,
    score REAL NOT NULL,
    metric TEXT NOT NULL,
    snapshot_date TEXT NOT NULL,
    source_url TEXT NOT NULL,
    PRIMARY KEY (leaderboard, model_id, snapshot_date),
    FOREIGN KEY (model_id) REFERENCES models(id)
);
"""


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA_SQL)
    conn.commit()


def insert_model(conn: sqlite3.Connection, model: Model) -> None:
    conn.execute(
        """INSERT OR REPLACE INTO models
           (id, vendor, name, version, type, modalities, parameters, release_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (model.id, model.vendor, model.name, model.version, model.type,
         json.dumps(model.modalities), model.parameters, model.release_date),
    )
    conn.commit()


def insert_benchmark(conn: sqlite3.Connection, benchmark: Benchmark) -> None:
    conn.execute(
        """INSERT OR REPLACE INTO benchmarks (id, name, category, description, metric)
           VALUES (?, ?, ?, ?, ?)""",
        (benchmark.id, benchmark.name, benchmark.category,
         benchmark.description, benchmark.metric),
    )
    conn.commit()


def insert_score(conn: sqlite3.Connection, score: Score) -> None:
    conn.execute(
        """INSERT OR REPLACE INTO scores
           (model_id, benchmark_id, value, unit, source_type, source_url,
            source_date, source_citation, is_sota, collected_at, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (score.model_id, score.benchmark_id, score.value, score.unit,
         score.source.type, score.source.url, score.source.date,
         score.source.citation, int(score.is_sota),
         score.collected_at.isoformat(), score.notes),
    )
    conn.commit()


def insert_leaderboard_ranking(conn: sqlite3.Connection, lr: LeaderboardRanking) -> None:
    conn.execute(
        """INSERT OR REPLACE INTO leaderboard_rankings
           (leaderboard, model_id, rank, score, metric, snapshot_date, source_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (lr.leaderboard, lr.model_id, lr.rank, lr.score, lr.metric,
         lr.snapshot_date.isoformat(), lr.source_url),
    )
    conn.commit()


def get_all_models(conn: sqlite3.Connection) -> list[Model]:
    rows = conn.execute("SELECT * FROM models").fetchall()
    return [
        Model(
            id=r["id"], vendor=r["vendor"], name=r["name"], version=r["version"],
            type=r["type"], modalities=json.loads(r["modalities"]),
            parameters=r["parameters"], release_date=r["release_date"],
        )
        for r in rows
    ]


def get_all_benchmarks(conn: sqlite3.Connection) -> list[Benchmark]:
    rows = conn.execute("SELECT * FROM benchmarks").fetchall()
    return [
        Benchmark(id=r["id"], name=r["name"], category=r["category"],
                  description=r["description"], metric=r["metric"])
        for r in rows
    ]


def get_scores(conn: sqlite3.Connection) -> list[Score]:
    rows = conn.execute("SELECT * FROM scores").fetchall()
    return [
        Score(
            model_id=r["model_id"], benchmark_id=r["benchmark_id"],
            value=r["value"], unit=r["unit"],
            source=Source(type=r["source_type"], url=r["source_url"],
                          date=r["source_date"], citation=r["source_citation"]),
            is_sota=bool(r["is_sota"]),
            collected_at=date.fromisoformat(r["collected_at"]),
            notes=r["notes"],
        )
        for r in rows
    ]


def get_leaderboard_rankings(conn: sqlite3.Connection) -> list[LeaderboardRanking]:
    rows = conn.execute("SELECT * FROM leaderboard_rankings").fetchall()
    return [
        LeaderboardRanking(
            leaderboard=r["leaderboard"], model_id=r["model_id"],
            rank=r["rank"], score=r["score"], metric=r["metric"],
            snapshot_date=date.fromisoformat(r["snapshot_date"]),
            source_url=r["source_url"],
        )
        for r in rows
    ]
