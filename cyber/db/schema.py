"""SQLite schema and CRUD operations for the benchmark database."""

from __future__ import annotations

import json
import sqlite3
from datetime import date

from typing import Optional

from cyber.models.types import Benchmark, LeaderboardRanking, Model, Score, SourceEntry
from cyber.models.types import Source

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

CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    format TEXT NOT NULL,
    trust_score REAL NOT NULL DEFAULT 0.5,
    status TEXT NOT NULL DEFAULT 'candidate',
    discovered_by TEXT NOT NULL,
    discovered_at TEXT NOT NULL,
    last_crawled_at TEXT,
    last_changed_at TEXT,
    crawl_count INTEGER NOT NULL DEFAULT 0,
    change_count INTEGER NOT NULL DEFAULT 0,
    fail_count INTEGER NOT NULL DEFAULT 0,
    crawl_interval_hours INTEGER NOT NULL DEFAULT 24,
    benchmarks TEXT NOT NULL DEFAULT '[]',
    models_count INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT ''
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


# ---------------------------------------------------------------------------
# Source registry CRUD
# ---------------------------------------------------------------------------

def _row_to_source_entry(r: sqlite3.Row) -> SourceEntry:
    """Convert a DB row to a SourceEntry dataclass."""
    return SourceEntry(
        id=r["id"],
        url=r["url"],
        name=r["name"],
        type=r["type"],
        format=r["format"],
        trust_score=r["trust_score"],
        status=r["status"],
        discovered_by=r["discovered_by"],
        discovered_at=date.fromisoformat(r["discovered_at"]),
        last_crawled_at=date.fromisoformat(r["last_crawled_at"]) if r["last_crawled_at"] else None,
        last_changed_at=date.fromisoformat(r["last_changed_at"]) if r["last_changed_at"] else None,
        crawl_count=r["crawl_count"],
        change_count=r["change_count"],
        fail_count=r["fail_count"],
        crawl_interval_hours=r["crawl_interval_hours"],
        benchmarks=json.loads(r["benchmarks"]),
        models_count=r["models_count"],
        notes=r["notes"],
    )


def insert_source(conn: sqlite3.Connection, source: SourceEntry) -> None:
    """INSERT OR REPLACE a source entry."""
    conn.execute(
        """INSERT OR REPLACE INTO sources
           (id, url, name, type, format, trust_score, status, discovered_by,
            discovered_at, last_crawled_at, last_changed_at, crawl_count,
            change_count, fail_count, crawl_interval_hours, benchmarks,
            models_count, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            source.id, source.url, source.name, source.type, source.format,
            source.trust_score, source.status, source.discovered_by,
            source.discovered_at.isoformat(),
            source.last_crawled_at.isoformat() if source.last_crawled_at else None,
            source.last_changed_at.isoformat() if source.last_changed_at else None,
            source.crawl_count, source.change_count, source.fail_count,
            source.crawl_interval_hours, json.dumps(source.benchmarks),
            source.models_count, source.notes,
        ),
    )
    conn.commit()


def get_sources(conn: sqlite3.Connection, status: Optional[str] = None) -> list:
    """Return all sources, optionally filtered by status."""
    if status is not None:
        rows = conn.execute(
            "SELECT * FROM sources WHERE status = ?", (status,)
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM sources").fetchall()
    return [_row_to_source_entry(r) for r in rows]


def get_source_by_id(conn: sqlite3.Connection, id: str) -> Optional[SourceEntry]:
    """Return a single source by id, or None."""
    row = conn.execute("SELECT * FROM sources WHERE id = ?", (id,)).fetchone()
    if row is None:
        return None
    return _row_to_source_entry(row)


def update_source(conn: sqlite3.Connection, source: SourceEntry) -> None:
    """UPDATE a source entry by id."""
    conn.execute(
        """UPDATE sources SET
            url = ?, name = ?, type = ?, format = ?, trust_score = ?,
            status = ?, discovered_by = ?, discovered_at = ?,
            last_crawled_at = ?, last_changed_at = ?,
            crawl_count = ?, change_count = ?, fail_count = ?,
            crawl_interval_hours = ?, benchmarks = ?,
            models_count = ?, notes = ?
           WHERE id = ?""",
        (
            source.url, source.name, source.type, source.format,
            source.trust_score, source.status, source.discovered_by,
            source.discovered_at.isoformat(),
            source.last_crawled_at.isoformat() if source.last_crawled_at else None,
            source.last_changed_at.isoformat() if source.last_changed_at else None,
            source.crawl_count, source.change_count, source.fail_count,
            source.crawl_interval_hours, json.dumps(source.benchmarks),
            source.models_count, source.notes,
            source.id,
        ),
    )
    conn.commit()


def get_due_sources(conn: sqlite3.Connection, as_of: date) -> list:
    """Return active sources that are due for crawling, sorted by trust_score DESC."""
    rows = conn.execute(
        """SELECT * FROM sources
           WHERE status = 'active'
             AND (last_crawled_at IS NULL
                  OR julianday(?) - julianday(last_crawled_at) >= crawl_interval_hours / 24.0)
           ORDER BY trust_score DESC""",
        (as_of.isoformat(),),
    ).fetchall()
    return [_row_to_source_entry(r) for r in rows]
