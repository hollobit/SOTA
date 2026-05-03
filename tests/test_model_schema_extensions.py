"""Verify Model dataclass and schema round-trip new fields."""
from __future__ import annotations

import sqlite3
import json
import tempfile
from pathlib import Path

from cyber.models.types import Model
from cyber.db.schema import init_db, insert_model


def test_model_dataclass_accepts_new_fields():
    m = Model(
        id="lg/exaone-4.5-33b",
        vendor="LG AI Research",
        name="EXAONE 4.5 33B",
        version="",
        type="open-weight",
        modalities=["text", "image"],
        parameters="33B (31.7B LM + 1.29B vision encoder)",
        release_date="2026-04-23",
        context_window=262144,
        knowledge_cutoff="2026-04",
        languages=["en", "ko", "es", "de", "ja", "vi"],
    )
    assert m.context_window == 262144
    assert m.knowledge_cutoff == "2026-04"
    assert m.languages == ["en", "ko", "es", "de", "ja", "vi"]


def test_model_dataclass_defaults_new_fields_to_none():
    m = Model(
        id="x/y", vendor="x", name="y", version="", type="proprietary",
    )
    assert m.context_window is None
    assert m.knowledge_cutoff is None
    assert m.languages is None
