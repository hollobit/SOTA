"""SQLite connection factory with WAL mode and foreign keys."""

from __future__ import annotations

import sqlite3
from pathlib import Path


def get_connection(db_path: str | Path = "data/benchmark.db") -> sqlite3.Connection:
    """Create a SQLite connection with WAL mode, foreign keys, and Row factory."""
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn
