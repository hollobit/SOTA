"""Shared test fixtures."""

import pytest

from cyber.db.connection import get_connection
from cyber.db.schema import init_db


@pytest.fixture
def db(tmp_path):
    """Create an in-memory-like temporary database with schema initialized."""
    db_path = tmp_path / "test.db"
    conn = get_connection(db_path)
    init_db(conn)
    yield conn
    conn.close()
