"""SQLite schema and CRUD operations for the benchmark database."""

from __future__ import annotations

import json
import sqlite3

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS models (
    id TEXT PRIMARY KEY,
    vendor TEXT NOT NULL,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    type TEXT NOT NULL,
    modalities TEXT NOT NULL DEFAULT '["text"]',
    parameters TEXT,
    release_date TEXT
);

CREATE TABLE IF NOT EXISTS benchmarks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
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
    source_citation TEXT NOT NULL DEFAULT '',
    is_sota INTEGER NOT NULL DEFAULT 0,
    collected_at TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
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
    """Initialize the database schema."""
    conn.executescript(SCHEMA_SQL)


def insert_model(
    conn: sqlite3.Connection,
    *,
    id: str,
    vendor: str,
    name: str,
    version: str,
    type: str,
    modalities: list[str] | None = None,
    parameters: str | None = None,
    release_date: str | None = None,
) -> None:
    """Insert a model, ignoring duplicates."""
    conn.execute(
        """INSERT OR IGNORE INTO models (id, vendor, name, version, type, modalities, parameters, release_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (id, vendor, name, version, type, json.dumps(modalities or ["text"]), parameters, release_date),
    )
    conn.commit()


def insert_benchmark(
    conn: sqlite3.Connection,
    *,
    id: str,
    name: str,
    category: str,
    description: str,
    metric: str,
) -> None:
    """Insert a benchmark, ignoring duplicates."""
    conn.execute(
        """INSERT OR IGNORE INTO benchmarks (id, name, category, description, metric)
           VALUES (?, ?, ?, ?, ?)""",
        (id, name, category, description, metric),
    )
    conn.commit()


def insert_score(
    conn: sqlite3.Connection,
    *,
    model_id: str,
    benchmark_id: str,
    value: float,
    unit: str,
    source_type: str,
    source_url: str,
    source_date: str,
    source_citation: str = "",
    is_sota: bool = False,
    collected_at: str,
    notes: str = "",
) -> None:
    """Insert or update (upsert) a score for a model+benchmark pair."""
    conn.execute(
        """INSERT INTO scores
           (model_id, benchmark_id, value, unit, source_type, source_url, source_date,
            source_citation, is_sota, collected_at, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(model_id, benchmark_id) DO UPDATE SET
               value = excluded.value,
               unit = excluded.unit,
               source_type = excluded.source_type,
               source_url = excluded.source_url,
               source_date = excluded.source_date,
               source_citation = excluded.source_citation,
               is_sota = excluded.is_sota,
               collected_at = excluded.collected_at,
               notes = excluded.notes""",
        (model_id, benchmark_id, value, unit, source_type, source_url, source_date,
         source_citation, int(is_sota), collected_at, notes),
    )
    conn.commit()


def insert_leaderboard_ranking(
    conn: sqlite3.Connection,
    *,
    leaderboard: str,
    model_id: str,
    rank: int,
    score: float,
    metric: str,
    snapshot_date: str,
    source_url: str,
) -> None:
    """Insert a leaderboard ranking, ignoring duplicates."""
    conn.execute(
        """INSERT OR IGNORE INTO leaderboard_rankings
           (leaderboard, model_id, rank, score, metric, snapshot_date, source_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (leaderboard, model_id, rank, score, metric, snapshot_date, source_url),
    )
    conn.commit()


def get_all_models(conn: sqlite3.Connection) -> list[sqlite3.Row]:
    """Get all models."""
    return conn.execute("SELECT * FROM models ORDER BY id").fetchall()


def get_all_benchmarks(conn: sqlite3.Connection) -> list[sqlite3.Row]:
    """Get all benchmarks."""
    return conn.execute("SELECT * FROM benchmarks ORDER BY id").fetchall()


def get_scores(
    conn: sqlite3.Connection,
    *,
    model_id: str | None = None,
    benchmark_id: str | None = None,
) -> list[sqlite3.Row]:
    """Get scores, optionally filtered by model_id and/or benchmark_id."""
    query = "SELECT * FROM scores WHERE 1=1"
    params: list[str] = []
    if model_id is not None:
        query += " AND model_id = ?"
        params.append(model_id)
    if benchmark_id is not None:
        query += " AND benchmark_id = ?"
        params.append(benchmark_id)
    query += " ORDER BY model_id, benchmark_id"
    return conn.execute(query, params).fetchall()


def get_leaderboard_rankings(
    conn: sqlite3.Connection,
    *,
    leaderboard: str | None = None,
    model_id: str | None = None,
) -> list[sqlite3.Row]:
    """Get leaderboard rankings, optionally filtered."""
    query = "SELECT * FROM leaderboard_rankings WHERE 1=1"
    params: list[str] = []
    if leaderboard is not None:
        query += " AND leaderboard = ?"
        params.append(leaderboard)
    if model_id is not None:
        query += " AND model_id = ?"
        params.append(model_id)
    query += " ORDER BY leaderboard, rank"
    return conn.execute(query, params).fetchall()
