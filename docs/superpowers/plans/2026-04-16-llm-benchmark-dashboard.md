# LLM Benchmark SOTA Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-agent system that automatically collects LLM benchmark scores from diverse sources, analyzes/normalizes them, and publishes an interactive SOTA dashboard to GitHub Pages.

**Architecture:** Role-based agent team — Python Scout agents collect data in parallel into SQLite, a Claude API-powered Analyst validates/normalizes/tracks SOTA, and a Publisher exports JSON and deploys a static dashboard. GitHub Actions orchestrates scheduled and event-driven runs.

**Tech Stack:** Python 3.11+, httpx, BeautifulSoup4, SQLite, Claude API (anthropic SDK), ECharts, Tailwind CSS, Vanilla JS, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-04-16-llm-benchmark-dashboard-design.md`

---

## File Structure

```
cyber/
├── pyproject.toml                    # Project config, dependencies, entry point
├── requirements.txt                  # Pinned dependencies for CI
├── .gitignore
├── __main__.py                       # CLI entry: python -m cyber
│
├── config/
│   ├── scouts.yaml                   # Scout registry
│   ├── limits.yaml                   # Cost guardrails
│   ├── models_alias.yaml             # Model name normalization mappings
│   └── benchmarks_meta.yaml          # Benchmark definitions, categories, expected ranges
│
├── db/
│   ├── __init__.py
│   ├── schema.py                     # SQLite schema DDL, migration
│   └── connection.py                 # DB connection factory
│
├── models/
│   ├── __init__.py
│   └── types.py                      # Dataclasses: Model, Benchmark, Score, LeaderboardRanking, RawRecord
│
├── scouts/
│   ├── __init__.py
│   ├── base.py                       # BaseScout ABC
│   ├── runner.py                     # Parallel scout executor
│   ├── leaderboard/
│   │   ├── __init__.py
│   │   ├── open_llm.py               # HuggingFace Open LLM Leaderboard
│   │   └── chatbot_arena.py          # LMSYS Chatbot Arena
│   ├── vendor/
│   │   ├── __init__.py
│   │   └── anthropic_scout.py        # Anthropic model card scraper
│   ├── paper/
│   │   ├── __init__.py
│   │   └── arxiv_scout.py            # arXiv paper scout
│   ├── safety/
│   │   ├── __init__.py
│   │   └── caisi.py                  # CAISI safety evaluations
│   └── release/
│       ├── __init__.py
│       └── huggingface.py            # HF Model Hub new model detector
│
├── analyst/
│   ├── __init__.py
│   ├── normalizer.py                 # Model/benchmark name normalization
│   ├── validator.py                  # Score anomaly detection
│   ├── sota_tracker.py               # SOTA recalculation, change detection
│   └── entity_resolver.py            # Claude API entity resolution
│
├── publisher/
│   ├── __init__.py
│   ├── exporter.py                   # SQLite → JSON export
│   └── notifier.py                   # GitHub Issue creation for SOTA changes
│
├── dashboard/
│   ├── index.html                    # Single page app
│   ├── css/
│   │   └── style.css                 # Custom styles (Tailwind via CDN)
│   └── js/
│       ├── app.js                    # Main app: tab routing, data loading
│       ├── charts.js                 # ECharts wrappers
│       ├── filters.js                # Filter/sort logic
│       └── explorer.js               # Model comparison
│
├── data/                             # Git-tracked JSON outputs
│   ├── .gitkeep
│   ├── scores/
│   │   └── history/
│   │       └── .gitkeep
│   ├── leaderboards/
│   │   └── .gitkeep
│   └── reports/
│       └── weekly/
│           └── .gitkeep
│
├── tests/
│   ├── conftest.py                   # Shared fixtures
│   ├── test_models.py
│   ├── test_db.py
│   ├── test_scout_base.py
│   ├── test_scout_runner.py
│   ├── test_leaderboard_open_llm.py
│   ├── test_normalizer.py
│   ├── test_validator.py
│   ├── test_sota_tracker.py
│   ├── test_exporter.py
│   └── fixtures/
│       ├── sample_open_llm.json
│       ├── sample_arena.json
│       └── sample_scores.json
│
└── .github/
    └── workflows/
        ├── benchmark-update.yml      # Main pipeline (daily cron)
        ├── event-monitor.yml         # Release detection (6h cron)
        └── manual-scout.yml          # Manual scout dispatch
```

---

## Phase 1: Foundation (Data Model + DB + Config)

### Task 1: Project Scaffold

**Files:**
- Create: `pyproject.toml`
- Create: `requirements.txt`
- Create: `.gitignore`
- Create: `__main__.py`
- Create: `models/__init__.py`
- Create: `db/__init__.py`
- Create: `scouts/__init__.py`
- Create: `analyst/__init__.py`
- Create: `publisher/__init__.py`

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/user/git/cyber
git init
```

- [ ] **Step 2: Create pyproject.toml**

```toml
[project]
name = "cyber"
version = "0.1.0"
description = "LLM Benchmark SOTA Dashboard"
requires-python = ">=3.11"
dependencies = [
    "httpx>=0.27",
    "beautifulsoup4>=4.12",
    "lxml>=5.0",
    "anthropic>=0.40",
    "pyyaml>=6.0",
    "click>=8.1",
    "rich>=13.0",
    "pdfplumber>=0.11",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.24",
    "pytest-httpx>=0.34",
    "ruff>=0.8",
]

[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"

[tool.ruff]
target-version = "py311"
line-length = 100
```

- [ ] **Step 3: Create requirements.txt**

```
httpx>=0.27
beautifulsoup4>=4.12
lxml>=5.0
anthropic>=0.40
pyyaml>=6.0
click>=8.1
rich>=13.0
pdfplumber>=0.11
```

- [ ] **Step 4: Create .gitignore**

```
__pycache__/
*.pyc
.venv/
.env
data/benchmark.db
data/sources/raw/
.pytest_cache/
dist/
*.egg-info/
```

- [ ] **Step 5: Create empty package init files and __main__.py**

`__main__.py`:
```python
"""CLI entry point: python -m cyber"""
import click


@click.group()
def cli():
    """LLM Benchmark SOTA Dashboard"""
    pass


if __name__ == "__main__":
    cli()
```

`models/__init__.py`, `db/__init__.py`, `scouts/__init__.py`, `analyst/__init__.py`, `publisher/__init__.py`: empty files.

- [ ] **Step 6: Create data directory stubs**

```bash
mkdir -p data/scores/history data/leaderboards data/reports/weekly data/sources/raw
touch data/.gitkeep data/scores/history/.gitkeep data/leaderboards/.gitkeep data/reports/weekly/.gitkeep
```

- [ ] **Step 7: Install and verify**

```bash
cd /Users/user/git/cyber
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
python -m cyber --help
```

Expected: Shows CLI help with no errors.

- [ ] **Step 8: Commit**

```bash
git add pyproject.toml requirements.txt .gitignore __main__.py models/ db/ scouts/ analyst/ publisher/ data/
git commit -m "feat: project scaffold with package structure and CLI entry point"
```

---

### Task 2: Data Types

**Files:**
- Create: `models/types.py`
- Create: `tests/test_models.py`

- [ ] **Step 1: Write failing tests for data types**

`tests/test_models.py`:
```python
from datetime import date
from models.types import Model, Benchmark, Score, LeaderboardRanking, RawRecord, Source


def test_model_creation():
    m = Model(
        id="openai/gpt-4o-2025-01",
        vendor="OpenAI",
        name="GPT-4o",
        version="2025-01",
        type="proprietary",
        modalities=["text", "vision", "audio"],
        parameters=None,
        release_date="2025-01-01",
    )
    assert m.id == "openai/gpt-4o-2025-01"
    assert m.type == "proprietary"
    assert "vision" in m.modalities


def test_benchmark_creation():
    b = Benchmark(
        id="mmlu",
        name="MMLU",
        category="reasoning",
        description="Massive Multitask Language Understanding",
        metric="accuracy",
    )
    assert b.id == "mmlu"
    assert b.category == "reasoning"


def test_score_creation():
    s = Score(
        model_id="openai/gpt-4o-2025-01",
        benchmark_id="mmlu",
        value=92.3,
        unit="%",
        source=Source(type="vendor", url="https://openai.com", date="2025-01-15", citation=None),
        is_sota=True,
        collected_at=date(2026, 4, 16),
        notes="5-shot, CoT",
    )
    assert s.value == 92.3
    assert s.is_sota is True
    assert s.source.type == "vendor"


def test_leaderboard_ranking():
    lr = LeaderboardRanking(
        leaderboard="chatbot-arena",
        model_id="openai/gpt-4o-2025-01",
        rank=2,
        score=1287.0,
        metric="elo",
        snapshot_date=date(2026, 4, 16),
        source_url="https://arena.lmsys.org",
    )
    assert lr.rank == 2
    assert lr.metric == "elo"


def test_raw_record():
    rr = RawRecord(
        scout_name="vendor-scout",
        source_url="https://openai.com/model-card",
        raw_data={"table": [["MMLU", "92.3"]]},
        collected_at=date(2026, 4, 16),
    )
    assert rr.scout_name == "vendor-scout"


def test_source_valid_types():
    valid_types = ["vendor", "paper", "leaderboard", "safety", "release"]
    for t in valid_types:
        s = Source(type=t, url="https://example.com", date="2025-01-01", citation=None)
        assert s.type == t


def test_model_type_values():
    for t in ["proprietary", "open-weight", "open-source"]:
        m = Model(id="test", vendor="Test", name="Test", version="1", type=t, modalities=["text"])
        assert m.type == t
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_models.py -v
```

Expected: FAIL with `ModuleNotFoundError: No module named 'models.types'`

- [ ] **Step 3: Implement data types**

`models/types.py`:
```python
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Any


@dataclass
class Source:
    type: str  # "vendor" | "paper" | "leaderboard" | "safety" | "release"
    url: str
    date: str
    citation: str | None = None


@dataclass
class Model:
    id: str
    vendor: str
    name: str
    version: str
    type: str  # "proprietary" | "open-weight" | "open-source"
    modalities: list[str] = field(default_factory=list)
    parameters: str | None = None
    release_date: str | None = None


@dataclass
class Benchmark:
    id: str
    name: str
    category: str  # "reasoning" | "coding" | "safety" | "multimodal" | "agent" | ...
    description: str
    metric: str  # "accuracy" | "pass@1" | "elo" | "score" | ...


@dataclass
class Score:
    model_id: str
    benchmark_id: str
    value: float
    unit: str
    source: Source
    is_sota: bool
    collected_at: date
    notes: str = ""


@dataclass
class LeaderboardRanking:
    leaderboard: str
    model_id: str
    rank: int
    score: float
    metric: str
    snapshot_date: date
    source_url: str


@dataclass
class RawRecord:
    scout_name: str
    source_url: str
    raw_data: dict[str, Any]
    collected_at: date
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_models.py -v
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add models/types.py tests/test_models.py
git commit -m "feat: add core data types - Model, Benchmark, Score, LeaderboardRanking, RawRecord"
```

---

### Task 3: SQLite Schema and Connection

**Files:**
- Create: `db/schema.py`
- Create: `db/connection.py`
- Create: `tests/test_db.py`
- Create: `tests/conftest.py`

- [ ] **Step 1: Write failing tests for DB**

`tests/conftest.py`:
```python
import pytest
from db.connection import get_connection


@pytest.fixture
def db(tmp_path):
    """Provide a fresh SQLite DB for each test."""
    db_path = tmp_path / "test.db"
    conn = get_connection(str(db_path))
    yield conn
    conn.close()
```

`tests/test_db.py`:
```python
from datetime import date
from db.schema import init_db, insert_model, insert_benchmark, insert_score, insert_leaderboard_ranking
from db.schema import get_all_models, get_all_benchmarks, get_scores, get_leaderboard_rankings
from models.types import Model, Benchmark, Score, LeaderboardRanking, Source


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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_db.py -v
```

Expected: FAIL with `ModuleNotFoundError: No module named 'db.connection'`

- [ ] **Step 3: Implement db/connection.py**

`db/connection.py`:
```python
import sqlite3
from pathlib import Path


def get_connection(db_path: str = "data/benchmark.db") -> sqlite3.Connection:
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.row_factory = sqlite3.Row
    return conn
```

- [ ] **Step 4: Implement db/schema.py**

`db/schema.py`:
```python
from __future__ import annotations

import json
import sqlite3
from datetime import date

from models.types import Model, Benchmark, Score, LeaderboardRanking, Source

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
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pytest tests/test_db.py -v
```

Expected: All 6 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add db/ tests/conftest.py tests/test_db.py
git commit -m "feat: SQLite schema with CRUD for models, benchmarks, scores, leaderboard rankings"
```

---

### Task 4: Configuration Files

**Files:**
- Create: `config/scouts.yaml`
- Create: `config/limits.yaml`
- Create: `config/models_alias.yaml`
- Create: `config/benchmarks_meta.yaml`

- [ ] **Step 1: Create config/scouts.yaml**

```yaml
scouts:
  - name: open-llm-scout
    module: scouts.leaderboard.open_llm
    class: OpenLLMScout
    schedule: daily
    enabled: true

  - name: chatbot-arena-scout
    module: scouts.leaderboard.chatbot_arena
    class: ChatbotArenaScout
    schedule: daily
    enabled: true

  - name: anthropic-scout
    module: scouts.vendor.anthropic_scout
    class: AnthropicScout
    schedule: daily
    enabled: false

  - name: arxiv-scout
    module: scouts.paper.arxiv_scout
    class: ArxivScout
    schedule: daily
    enabled: false

  - name: caisi-scout
    module: scouts.safety.caisi
    class: CAISIScout
    schedule: weekly
    enabled: false

  - name: hf-release-scout
    module: scouts.release.huggingface
    class: HuggingFaceReleaseScout
    schedule: 6h
    enabled: false
```

- [ ] **Step 2: Create config/limits.yaml**

```yaml
cost_limits:
  claude_api:
    daily_max_usd: 5.00
    per_run_max_usd: 2.00
    max_tokens_per_batch: 50000
  github_actions:
    max_runtime_minutes: 30
  alerts:
    warn_at_percent: 80
```

- [ ] **Step 3: Create config/models_alias.yaml**

```yaml
aliases:
  "gpt4o": "openai/gpt-4o"
  "gpt-4o": "openai/gpt-4o"
  "GPT-4o": "openai/gpt-4o"
  "claude-4-opus": "anthropic/claude-4-opus"
  "claude 4 opus": "anthropic/claude-4-opus"
  "Claude 4 Opus": "anthropic/claude-4-opus"
  "gemini-2.5-pro": "google/gemini-2.5-pro"
  "Gemini 2.5 Pro": "google/gemini-2.5-pro"
  "llama-4": "meta/llama-4"
  "Llama 4": "meta/llama-4"
```

- [ ] **Step 4: Create config/benchmarks_meta.yaml**

```yaml
benchmarks:
  mmlu:
    name: "MMLU"
    category: reasoning
    metric: accuracy
    unit: "%"
    expected_range: [25, 100]
    description: "Massive Multitask Language Understanding"

  gpqa:
    name: "GPQA Diamond"
    category: reasoning
    metric: accuracy
    unit: "%"
    expected_range: [20, 80]
    description: "Graduate-Level Google-Proof Q&A"

  humaneval:
    name: "HumanEval"
    category: coding
    metric: "pass@1"
    unit: "%"
    expected_range: [0, 100]
    description: "Code generation benchmark"

  math:
    name: "MATH"
    category: math
    metric: accuracy
    unit: "%"
    expected_range: [0, 100]
    description: "Competition mathematics"

  gsm8k:
    name: "GSM8K"
    category: math
    metric: accuracy
    unit: "%"
    expected_range: [0, 100]
    description: "Grade School Math"

  mmmu:
    name: "MMMU"
    category: multimodal
    metric: accuracy
    unit: "%"
    expected_range: [20, 80]
    description: "Massive Multi-discipline Multimodal Understanding"

  swe_bench:
    name: "SWE-bench Verified"
    category: agent
    metric: "resolve_rate"
    unit: "%"
    expected_range: [0, 80]
    description: "Software Engineering benchmark"

  truthfulqa:
    name: "TruthfulQA"
    category: safety
    metric: accuracy
    unit: "%"
    expected_range: [20, 100]
    description: "Truthfulness evaluation"

  ifeval:
    name: "IFEval"
    category: instruction_following
    metric: accuracy
    unit: "%"
    expected_range: [20, 100]
    description: "Instruction Following Evaluation"

  aime:
    name: "AIME 2024"
    category: math
    metric: accuracy
    unit: "%"
    expected_range: [0, 100]
    description: "American Invitational Mathematics Examination"
```

- [ ] **Step 5: Commit**

```bash
git add config/
git commit -m "feat: add configuration files - scouts registry, cost limits, model aliases, benchmark metadata"
```

---

## Phase 2: Scout Framework + First Scouts

### Task 5: BaseScout Interface and Runner

**Files:**
- Create: `scouts/base.py`
- Create: `scouts/runner.py`
- Create: `tests/test_scout_base.py`
- Create: `tests/test_scout_runner.py`

- [ ] **Step 1: Write failing tests for BaseScout**

`tests/test_scout_base.py`:
```python
import pytest
from datetime import date
from scouts.base import BaseScout
from models.types import RawRecord, Score, Source


class FakeScout(BaseScout):
    name = "fake-scout"

    async def discover(self) -> list[RawRecord]:
        return [
            RawRecord(
                scout_name="fake-scout",
                source_url="https://example.com",
                raw_data={"model": "test/model-1", "benchmark": "mmlu", "score": 90.0},
                collected_at=date(2026, 4, 16),
            )
        ]

    def parse(self, raw: RawRecord) -> list[Score]:
        d = raw.raw_data
        return [
            Score(
                model_id=d["model"], benchmark_id=d["benchmark"],
                value=d["score"], unit="%",
                source=Source(type="leaderboard", url=raw.source_url,
                              date="2026-04-16", citation=None),
                is_sota=False, collected_at=raw.collected_at, notes="",
            )
        ]


class IncompleteScout(BaseScout):
    name = "incomplete"


def test_base_scout_cannot_be_instantiated_directly():
    with pytest.raises(TypeError):
        BaseScout()


def test_incomplete_scout_cannot_be_instantiated():
    with pytest.raises(TypeError):
        IncompleteScout()


@pytest.mark.asyncio
async def test_fake_scout_discover():
    scout = FakeScout()
    records = await scout.discover()
    assert len(records) == 1
    assert records[0].scout_name == "fake-scout"


def test_fake_scout_parse():
    scout = FakeScout()
    raw = RawRecord(
        scout_name="fake-scout", source_url="https://example.com",
        raw_data={"model": "test/model-1", "benchmark": "mmlu", "score": 90.0},
        collected_at=date(2026, 4, 16),
    )
    scores = scout.parse(raw)
    assert len(scores) == 1
    assert scores[0].value == 90.0
    assert scores[0].model_id == "test/model-1"
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_scout_base.py -v
```

Expected: FAIL

- [ ] **Step 3: Implement scouts/base.py**

`scouts/base.py`:
```python
from __future__ import annotations

from abc import ABC, abstractmethod

from models.types import RawRecord, Score


class BaseScout(ABC):
    name: str = "unnamed"

    @abstractmethod
    async def discover(self) -> list[RawRecord]:
        """Fetch raw data from the source."""
        ...

    @abstractmethod
    def parse(self, raw: RawRecord) -> list[Score]:
        """Parse a raw record into normalized Score entries."""
        ...
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_scout_base.py -v
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Write failing tests for scout runner**

`tests/test_scout_runner.py`:
```python
import pytest
from datetime import date
from scouts.runner import run_scouts
from scouts.base import BaseScout
from models.types import RawRecord, Score, Source


class SuccessScout(BaseScout):
    name = "success-scout"

    async def discover(self) -> list[RawRecord]:
        return [
            RawRecord(scout_name="success-scout", source_url="https://a.com",
                      raw_data={"model": "a/b", "benchmark": "mmlu", "value": 95.0},
                      collected_at=date(2026, 4, 16))
        ]

    def parse(self, raw: RawRecord) -> list[Score]:
        d = raw.raw_data
        return [Score(model_id=d["model"], benchmark_id=d["benchmark"], value=d["value"],
                      unit="%", source=Source(type="leaderboard", url=raw.source_url,
                      date="2026-04-16", citation=None),
                      is_sota=False, collected_at=raw.collected_at, notes="")]


class FailingScout(BaseScout):
    name = "failing-scout"

    async def discover(self) -> list[RawRecord]:
        raise ConnectionError("Network down")

    def parse(self, raw: RawRecord) -> list[Score]:
        return []


@pytest.mark.asyncio
async def test_run_scouts_collects_results():
    scouts = [SuccessScout()]
    results = await run_scouts(scouts)
    assert len(results.scores) == 1
    assert results.scores[0].value == 95.0
    assert len(results.errors) == 0


@pytest.mark.asyncio
async def test_run_scouts_isolates_failures():
    scouts = [SuccessScout(), FailingScout()]
    results = await run_scouts(scouts)
    assert len(results.scores) == 1
    assert len(results.errors) == 1
    assert "failing-scout" in results.errors[0]


@pytest.mark.asyncio
async def test_run_scouts_empty():
    results = await run_scouts([])
    assert len(results.scores) == 0
    assert len(results.errors) == 0
```

- [ ] **Step 6: Run tests to verify they fail**

```bash
pytest tests/test_scout_runner.py -v
```

Expected: FAIL

- [ ] **Step 7: Implement scouts/runner.py**

`scouts/runner.py`:
```python
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field

from models.types import Score
from scouts.base import BaseScout


@dataclass
class ScoutResults:
    scores: list[Score] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


async def _run_single(scout: BaseScout) -> tuple[list[Score], str | None]:
    try:
        raw_records = await scout.discover()
        scores = []
        for raw in raw_records:
            scores.extend(scout.parse(raw))
        return scores, None
    except Exception as e:
        return [], f"{scout.name}: {e}"


async def run_scouts(scouts: list[BaseScout]) -> ScoutResults:
    if not scouts:
        return ScoutResults()

    tasks = [_run_single(s) for s in scouts]
    results = await asyncio.gather(*tasks)

    all_scores: list[Score] = []
    all_errors: list[str] = []
    for scores, error in results:
        all_scores.extend(scores)
        if error:
            all_errors.append(error)

    return ScoutResults(scores=all_scores, errors=all_errors)
```

- [ ] **Step 8: Run all scout tests**

```bash
pytest tests/test_scout_base.py tests/test_scout_runner.py -v
```

Expected: All 7 tests PASS.

- [ ] **Step 9: Commit**

```bash
git add scouts/base.py scouts/runner.py tests/test_scout_base.py tests/test_scout_runner.py
git commit -m "feat: BaseScout ABC and parallel scout runner with failure isolation"
```

---

### Task 6: Open LLM Leaderboard Scout

**Files:**
- Create: `scouts/leaderboard/__init__.py`
- Create: `scouts/leaderboard/open_llm.py`
- Create: `tests/test_leaderboard_open_llm.py`
- Create: `tests/fixtures/sample_open_llm.json`

- [ ] **Step 1: Create test fixture**

`tests/fixtures/sample_open_llm.json`:
```json
[
  {
    "model": "meta-llama/Llama-4-Maverick",
    "scores": {
      "mmlu": 88.5,
      "gpqa": 61.2,
      "humaneval": 85.0,
      "math": 72.3,
      "ifeval": 87.1
    },
    "type": "open-weight",
    "params": "400B",
    "link": "https://huggingface.co/meta-llama/Llama-4-Maverick"
  },
  {
    "model": "Qwen/Qwen3-235B",
    "scores": {
      "mmlu": 86.1,
      "gpqa": 58.4,
      "humaneval": 82.7,
      "math": 68.9,
      "ifeval": 84.3
    },
    "type": "open-weight",
    "params": "235B",
    "link": "https://huggingface.co/Qwen/Qwen3-235B"
  }
]
```

- [ ] **Step 2: Write failing tests**

`tests/test_leaderboard_open_llm.py`:
```python
import json
import pytest
from datetime import date
from pathlib import Path
from unittest.mock import AsyncMock, patch

from scouts.leaderboard.open_llm import OpenLLMScout
from models.types import RawRecord


@pytest.fixture
def sample_data():
    p = Path(__file__).parent / "fixtures" / "sample_open_llm.json"
    return json.loads(p.read_text())


@pytest.fixture
def scout():
    return OpenLLMScout()


def test_scout_name(scout):
    assert scout.name == "open-llm-scout"


@pytest.mark.asyncio
async def test_discover_returns_raw_records(scout, sample_data):
    with patch.object(scout, "_fetch_data", new_callable=AsyncMock, return_value=sample_data):
        records = await scout.discover()
        assert len(records) == 2
        assert all(isinstance(r, RawRecord) for r in records)
        assert records[0].scout_name == "open-llm-scout"


def test_parse_extracts_scores(scout, sample_data):
    raw = RawRecord(
        scout_name="open-llm-scout",
        source_url="https://huggingface.co/spaces/open-llm-leaderboard",
        raw_data=sample_data[0],
        collected_at=date(2026, 4, 16),
    )
    scores = scout.parse(raw)
    assert len(scores) == 5
    mmlu_score = next(s for s in scores if s.benchmark_id == "mmlu")
    assert mmlu_score.value == 88.5
    assert mmlu_score.model_id == "meta-llama/Llama-4-Maverick"
    assert mmlu_score.source.type == "leaderboard"


def test_parse_all_benchmarks_present(scout, sample_data):
    raw = RawRecord(
        scout_name="open-llm-scout",
        source_url="https://huggingface.co/spaces/open-llm-leaderboard",
        raw_data=sample_data[0],
        collected_at=date(2026, 4, 16),
    )
    scores = scout.parse(raw)
    benchmark_ids = {s.benchmark_id for s in scores}
    assert benchmark_ids == {"mmlu", "gpqa", "humaneval", "math", "ifeval"}
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
pytest tests/test_leaderboard_open_llm.py -v
```

Expected: FAIL

- [ ] **Step 4: Implement the scout**

`scouts/leaderboard/__init__.py`: empty file.

`scouts/leaderboard/open_llm.py`:
```python
from __future__ import annotations

from datetime import date

import httpx

from models.types import RawRecord, Score, Source
from scouts.base import BaseScout

LEADERBOARD_URL = "https://huggingface.co/api/spaces/open-llm-leaderboard/open-llm-leaderboard"


class OpenLLMScout(BaseScout):
    name = "open-llm-scout"

    async def _fetch_data(self) -> list[dict]:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(LEADERBOARD_URL)
            resp.raise_for_status()
            return resp.json()

    async def discover(self) -> list[RawRecord]:
        data = await self._fetch_data()
        today = date.today()
        return [
            RawRecord(
                scout_name=self.name,
                source_url="https://huggingface.co/spaces/open-llm-leaderboard",
                raw_data=entry,
                collected_at=today,
            )
            for entry in data
        ]

    def parse(self, raw: RawRecord) -> list[Score]:
        entry = raw.raw_data
        model_name = entry.get("model", "")
        scores_data = entry.get("scores", {})
        results: list[Score] = []

        for benchmark_id, value in scores_data.items():
            if value is None:
                continue
            results.append(
                Score(
                    model_id=model_name,
                    benchmark_id=benchmark_id,
                    value=float(value),
                    unit="%",
                    source=Source(
                        type="leaderboard",
                        url=raw.source_url,
                        date=raw.collected_at.isoformat(),
                        citation=None,
                    ),
                    is_sota=False,
                    collected_at=raw.collected_at,
                    notes="Open LLM Leaderboard",
                )
            )

        return results
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pytest tests/test_leaderboard_open_llm.py -v
```

Expected: All 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add scouts/leaderboard/ tests/test_leaderboard_open_llm.py tests/fixtures/sample_open_llm.json
git commit -m "feat: Open LLM Leaderboard scout with async fetch and score parsing"
```

---

## Phase 3: Analyst Pipeline

### Task 7: Normalizer

**Files:**
- Create: `analyst/normalizer.py`
- Create: `tests/test_normalizer.py`

- [ ] **Step 1: Write failing tests**

`tests/test_normalizer.py`:
```python
from analyst.normalizer import Normalizer


def test_normalize_model_name_exact_match():
    n = Normalizer(aliases={"GPT-4o": "openai/gpt-4o"})
    assert n.normalize_model("GPT-4o") == "openai/gpt-4o"


def test_normalize_model_name_case_insensitive():
    n = Normalizer(aliases={"gpt-4o": "openai/gpt-4o"})
    assert n.normalize_model("GPT-4o") == "openai/gpt-4o"


def test_normalize_model_name_unknown_passthrough():
    n = Normalizer(aliases={})
    assert n.normalize_model("some-new-model") == "some-new-model"


def test_normalize_model_name_whitespace():
    n = Normalizer(aliases={"claude 4 opus": "anthropic/claude-4-opus"})
    assert n.normalize_model("  Claude 4 Opus  ") == "anthropic/claude-4-opus"


def test_normalize_benchmark_known():
    n = Normalizer(aliases={})
    assert n.normalize_benchmark("MMLU") == "mmlu"
    assert n.normalize_benchmark("HumanEval") == "humaneval"


def test_normalize_benchmark_with_variant():
    n = Normalizer(aliases={}, benchmark_aliases={"mmlu-pro": "mmlu_pro", "MMLU Pro": "mmlu_pro"})
    assert n.normalize_benchmark("MMLU Pro") == "mmlu_pro"


def test_normalize_notes():
    n = Normalizer(aliases={})
    assert n.normalize_notes("5 shot, chain-of-thought") == "5-shot, CoT"
    assert n.normalize_notes("zero shot") == "0-shot"
    assert n.normalize_notes("5-shot, CoT") == "5-shot, CoT"


def test_add_alias():
    n = Normalizer(aliases={})
    n.add_alias("New Model", "vendor/new-model")
    assert n.normalize_model("New Model") == "vendor/new-model"
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_normalizer.py -v
```

Expected: FAIL

- [ ] **Step 3: Implement normalizer**

`analyst/normalizer.py`:
```python
from __future__ import annotations

import re


class Normalizer:
    def __init__(
        self,
        aliases: dict[str, str] | None = None,
        benchmark_aliases: dict[str, str] | None = None,
    ):
        self._model_aliases: dict[str, str] = {
            k.lower().strip(): v for k, v in (aliases or {}).items()
        }
        self._benchmark_aliases: dict[str, str] = {
            k.lower().strip(): v for k, v in (benchmark_aliases or {}).items()
        }

    def normalize_model(self, name: str) -> str:
        key = name.lower().strip()
        return self._model_aliases.get(key, name.strip())

    def normalize_benchmark(self, name: str) -> str:
        key = name.lower().strip()
        if key in self._benchmark_aliases:
            return self._benchmark_aliases[key]
        return re.sub(r"[\s-]+", "", key).lower()

    def normalize_notes(self, notes: str) -> str:
        result = notes.strip()
        result = re.sub(r"zero[\s-]?shot", "0-shot", result, flags=re.IGNORECASE)
        result = re.sub(r"(\d+)[\s-]?shot", r"\1-shot", result, flags=re.IGNORECASE)
        result = re.sub(r"chain[\s-]?of[\s-]?thought", "CoT", result, flags=re.IGNORECASE)
        return result

    def add_alias(self, variant: str, canonical: str) -> None:
        self._model_aliases[variant.lower().strip()] = canonical
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_normalizer.py -v
```

Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add analyst/normalizer.py tests/test_normalizer.py
git commit -m "feat: model/benchmark name normalizer with alias mapping"
```

---

### Task 8: Validator (Anomaly Detection)

**Files:**
- Create: `analyst/validator.py`
- Create: `tests/test_validator.py`

- [ ] **Step 1: Write failing tests**

`tests/test_validator.py`:
```python
from analyst.validator import Validator, ValidationResult


def test_validate_score_in_range():
    v = Validator(benchmark_ranges={"mmlu": (25, 100)})
    result = v.validate("mmlu", 92.3)
    assert result.is_valid is True
    assert result.anomaly is None


def test_validate_score_below_range():
    v = Validator(benchmark_ranges={"mmlu": (25, 100)})
    result = v.validate("mmlu", 10.0)
    assert result.is_valid is False
    assert result.anomaly == "below_range"


def test_validate_score_above_range():
    v = Validator(benchmark_ranges={"mmlu": (25, 100)})
    result = v.validate("mmlu", 105.0)
    assert result.is_valid is False
    assert result.anomaly == "above_range"


def test_validate_unknown_benchmark_passes():
    v = Validator(benchmark_ranges={})
    result = v.validate("new-bench", 50.0)
    assert result.is_valid is True


def test_validate_negative_score():
    v = Validator(benchmark_ranges={})
    result = v.validate("any", -5.0)
    assert result.is_valid is False
    assert result.anomaly == "negative"


def test_validate_with_previous_score_large_drop():
    v = Validator(benchmark_ranges={"mmlu": (25, 100)})
    result = v.validate("mmlu", 30.0, previous_value=90.0)
    assert result.is_valid is False
    assert result.anomaly == "large_drop"


def test_validate_with_previous_score_normal_change():
    v = Validator(benchmark_ranges={"mmlu": (25, 100)})
    result = v.validate("mmlu", 88.0, previous_value=90.0)
    assert result.is_valid is True
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_validator.py -v
```

Expected: FAIL

- [ ] **Step 3: Implement validator**

`analyst/validator.py`:
```python
from __future__ import annotations

from dataclasses import dataclass

_LARGE_DROP_THRESHOLD = 0.3


@dataclass
class ValidationResult:
    is_valid: bool
    anomaly: str | None = None
    message: str = ""


class Validator:
    def __init__(self, benchmark_ranges: dict[str, tuple[float, float]] | None = None):
        self._ranges = benchmark_ranges or {}

    def validate(
        self,
        benchmark_id: str,
        value: float,
        previous_value: float | None = None,
    ) -> ValidationResult:
        if value < 0:
            return ValidationResult(
                is_valid=False, anomaly="negative",
                message=f"Score {value} is negative",
            )

        if benchmark_id in self._ranges:
            low, high = self._ranges[benchmark_id]
            if value < low:
                return ValidationResult(
                    is_valid=False, anomaly="below_range",
                    message=f"Score {value} below expected range [{low}, {high}]",
                )
            if value > high:
                return ValidationResult(
                    is_valid=False, anomaly="above_range",
                    message=f"Score {value} above expected range [{low}, {high}]",
                )

        if previous_value is not None and previous_value > 0:
            drop = (previous_value - value) / previous_value
            if drop > _LARGE_DROP_THRESHOLD:
                return ValidationResult(
                    is_valid=False, anomaly="large_drop",
                    message=f"Score dropped {drop:.0%} from {previous_value} to {value}",
                )

        return ValidationResult(is_valid=True)
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_validator.py -v
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add analyst/validator.py tests/test_validator.py
git commit -m "feat: score validator with range checking and large-drop anomaly detection"
```

---

### Task 9: SOTA Tracker

**Files:**
- Create: `analyst/sota_tracker.py`
- Create: `tests/test_sota_tracker.py`

- [ ] **Step 1: Write failing tests**

`tests/test_sota_tracker.py`:
```python
from datetime import date
from analyst.sota_tracker import SOTATracker, SOTAChange
from models.types import Score, Source


def _score(model_id: str, benchmark_id: str, value: float) -> Score:
    return Score(
        model_id=model_id, benchmark_id=benchmark_id, value=value, unit="%",
        source=Source(type="leaderboard", url="https://example.com",
                      date="2026-04-16", citation=None),
        is_sota=False, collected_at=date(2026, 4, 16), notes="",
    )


def test_compute_sota_from_scores():
    tracker = SOTATracker()
    scores = [
        _score("model-a", "mmlu", 90.0),
        _score("model-b", "mmlu", 95.0),
        _score("model-a", "gpqa", 60.0),
    ]
    sota = tracker.compute_sota(scores)
    assert sota["mmlu"].model_id == "model-b"
    assert sota["mmlu"].value == 95.0
    assert sota["gpqa"].model_id == "model-a"


def test_detect_new_sota():
    tracker = SOTATracker()
    old_sota = {"mmlu": _score("model-a", "mmlu", 90.0)}
    new_sota = {"mmlu": _score("model-b", "mmlu", 95.0)}
    changes = tracker.detect_changes(old_sota, new_sota)
    assert len(changes) == 1
    assert changes[0].type == "NEW_SOTA"
    assert changes[0].benchmark_id == "mmlu"
    assert changes[0].new_model == "model-b"
    assert changes[0].new_value == 95.0
    assert changes[0].old_value == 90.0


def test_detect_new_benchmark():
    tracker = SOTATracker()
    old_sota = {"mmlu": _score("model-a", "mmlu", 90.0)}
    new_sota = {
        "mmlu": _score("model-a", "mmlu", 90.0),
        "gpqa": _score("model-b", "gpqa", 65.0),
    }
    changes = tracker.detect_changes(old_sota, new_sota)
    assert len(changes) == 1
    assert changes[0].type == "NEW_BENCHMARK"
    assert changes[0].benchmark_id == "gpqa"


def test_no_changes():
    tracker = SOTATracker()
    sota = {"mmlu": _score("model-a", "mmlu", 90.0)}
    changes = tracker.detect_changes(sota, sota)
    assert len(changes) == 0


def test_mark_sota_flags():
    tracker = SOTATracker()
    scores = [
        _score("model-a", "mmlu", 90.0),
        _score("model-b", "mmlu", 95.0),
        _score("model-c", "mmlu", 85.0),
    ]
    updated = tracker.mark_sota(scores)
    sota_scores = [s for s in updated if s.is_sota]
    assert len(sota_scores) == 1
    assert sota_scores[0].model_id == "model-b"
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_sota_tracker.py -v
```

Expected: FAIL

- [ ] **Step 3: Implement SOTA tracker**

`analyst/sota_tracker.py`:
```python
from __future__ import annotations

from dataclasses import dataclass

from models.types import Score


@dataclass
class SOTAChange:
    type: str  # "NEW_SOTA" | "NEW_BENCHMARK" | "NEW_MODEL"
    benchmark_id: str
    new_model: str
    new_value: float
    old_model: str | None = None
    old_value: float | None = None


class SOTATracker:
    def compute_sota(self, scores: list[Score]) -> dict[str, Score]:
        best: dict[str, Score] = {}
        for s in scores:
            if s.benchmark_id not in best or s.value > best[s.benchmark_id].value:
                best[s.benchmark_id] = s
        return best

    def detect_changes(
        self,
        old_sota: dict[str, Score],
        new_sota: dict[str, Score],
    ) -> list[SOTAChange]:
        changes: list[SOTAChange] = []

        for bench_id, new_score in new_sota.items():
            if bench_id not in old_sota:
                changes.append(SOTAChange(
                    type="NEW_BENCHMARK",
                    benchmark_id=bench_id,
                    new_model=new_score.model_id,
                    new_value=new_score.value,
                ))
            elif new_score.value > old_sota[bench_id].value:
                old = old_sota[bench_id]
                changes.append(SOTAChange(
                    type="NEW_SOTA",
                    benchmark_id=bench_id,
                    new_model=new_score.model_id,
                    new_value=new_score.value,
                    old_model=old.model_id,
                    old_value=old.value,
                ))

        return changes

    def mark_sota(self, scores: list[Score]) -> list[Score]:
        best = self.compute_sota(scores)
        best_keys = {
            (s.model_id, s.benchmark_id) for s in best.values()
        }
        result: list[Score] = []
        for s in scores:
            is_sota = (s.model_id, s.benchmark_id) in best_keys
            result.append(Score(
                model_id=s.model_id, benchmark_id=s.benchmark_id,
                value=s.value, unit=s.unit, source=s.source,
                is_sota=is_sota, collected_at=s.collected_at, notes=s.notes,
            ))
        return result
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_sota_tracker.py -v
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add analyst/sota_tracker.py tests/test_sota_tracker.py
git commit -m "feat: SOTA tracker - computes per-benchmark SOTA, detects changes, marks flags"
```

---

## Phase 4: Publisher

### Task 10: JSON Exporter

**Files:**
- Create: `publisher/exporter.py`
- Create: `tests/test_exporter.py`

- [ ] **Step 1: Write failing tests**

`tests/test_exporter.py`:
```python
import json
from datetime import date
from pathlib import Path

from publisher.exporter import Exporter
from db.schema import init_db, insert_model, insert_benchmark, insert_score, insert_leaderboard_ranking
from models.types import Model, Benchmark, Score, LeaderboardRanking, Source


def _seed_db(db):
    init_db(db)
    m = Model(id="openai/gpt-4o", vendor="OpenAI", name="GPT-4o",
              version="2025-01", type="proprietary", modalities=["text", "vision"])
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
    lr = LeaderboardRanking(
        leaderboard="chatbot-arena", model_id="openai/gpt-4o",
        rank=2, score=1287.0, metric="elo",
        snapshot_date=date(2026, 4, 16), source_url="https://arena.lmsys.org",
    )
    insert_leaderboard_ranking(db, lr)


def test_export_creates_json_files(db, tmp_path):
    _seed_db(db)
    exporter = Exporter(db, output_dir=tmp_path)
    exporter.export_all()

    assert (tmp_path / "models.json").exists()
    assert (tmp_path / "benchmarks.json").exists()
    assert (tmp_path / "scores" / "current.json").exists()
    assert (tmp_path / "sota.json").exists()
    assert (tmp_path / "leaderboards" / "chatbot-arena.json").exists()


def test_export_models_json_content(db, tmp_path):
    _seed_db(db)
    exporter = Exporter(db, output_dir=tmp_path)
    exporter.export_all()

    models = json.loads((tmp_path / "models.json").read_text())
    assert len(models) == 1
    assert models[0]["id"] == "openai/gpt-4o"
    assert models[0]["vendor"] == "OpenAI"


def test_export_sota_json(db, tmp_path):
    _seed_db(db)
    exporter = Exporter(db, output_dir=tmp_path)
    exporter.export_all()

    sota = json.loads((tmp_path / "sota.json").read_text())
    assert "mmlu" in sota
    assert sota["mmlu"]["model_id"] == "openai/gpt-4o"
    assert sota["mmlu"]["value"] == 92.3


def test_export_history_snapshot(db, tmp_path):
    _seed_db(db)
    exporter = Exporter(db, output_dir=tmp_path)
    exporter.export_all()

    history_dir = tmp_path / "scores" / "history"
    snapshots = list(history_dir.glob("*.json"))
    assert len(snapshots) == 1
    assert date.today().isoformat() in snapshots[0].name
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_exporter.py -v
```

Expected: FAIL

- [ ] **Step 3: Implement exporter**

`publisher/exporter.py`:
```python
from __future__ import annotations

import json
import sqlite3
from collections import defaultdict
from datetime import date
from pathlib import Path

from db.schema import get_all_models, get_all_benchmarks, get_scores, get_leaderboard_rankings
from analyst.sota_tracker import SOTATracker


class Exporter:
    def __init__(self, conn: sqlite3.Connection, output_dir: Path | str):
        self._conn = conn
        self._out = Path(output_dir)

    def export_all(self) -> None:
        self._export_models()
        self._export_benchmarks()
        self._export_scores()
        self._export_sota()
        self._export_leaderboards()
        self._export_history_snapshot()

    def _write_json(self, path: Path, data) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2, default=str))

    def _export_models(self) -> None:
        models = get_all_models(self._conn)
        data = [
            {
                "id": m.id, "vendor": m.vendor, "name": m.name,
                "version": m.version, "type": m.type,
                "modalities": m.modalities, "parameters": m.parameters,
                "release_date": m.release_date,
            }
            for m in models
        ]
        self._write_json(self._out / "models.json", data)

    def _export_benchmarks(self) -> None:
        benchmarks = get_all_benchmarks(self._conn)
        data = [
            {
                "id": b.id, "name": b.name, "category": b.category,
                "description": b.description, "metric": b.metric,
            }
            for b in benchmarks
        ]
        self._write_json(self._out / "benchmarks.json", data)

    def _export_scores(self) -> None:
        scores = get_scores(self._conn)
        data = [
            {
                "model_id": s.model_id, "benchmark_id": s.benchmark_id,
                "value": s.value, "unit": s.unit, "is_sota": s.is_sota,
                "source": {"type": s.source.type, "url": s.source.url,
                           "date": s.source.date, "citation": s.source.citation},
                "collected_at": s.collected_at.isoformat(), "notes": s.notes,
            }
            for s in scores
        ]
        self._write_json(self._out / "scores" / "current.json", data)

    def _export_sota(self) -> None:
        scores = get_scores(self._conn)
        tracker = SOTATracker()
        sota = tracker.compute_sota(scores)
        data = {
            bench_id: {
                "model_id": s.model_id, "value": s.value, "unit": s.unit,
                "collected_at": s.collected_at.isoformat(),
            }
            for bench_id, s in sota.items()
        }
        self._write_json(self._out / "sota.json", data)

    def _export_leaderboards(self) -> None:
        rankings = get_leaderboard_rankings(self._conn)
        by_board: dict[str, list] = defaultdict(list)
        for lr in rankings:
            by_board[lr.leaderboard].append({
                "model_id": lr.model_id, "rank": lr.rank,
                "score": lr.score, "metric": lr.metric,
                "snapshot_date": lr.snapshot_date.isoformat(),
                "source_url": lr.source_url,
            })
        for board_name, entries in by_board.items():
            self._write_json(self._out / "leaderboards" / f"{board_name}.json", entries)

    def _export_history_snapshot(self) -> None:
        scores = get_scores(self._conn)
        data = [
            {
                "model_id": s.model_id, "benchmark_id": s.benchmark_id,
                "value": s.value, "is_sota": s.is_sota,
            }
            for s in scores
        ]
        today = date.today().isoformat()
        self._write_json(self._out / "scores" / "history" / f"{today}.json", data)
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_exporter.py -v
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add publisher/exporter.py tests/test_exporter.py
git commit -m "feat: JSON exporter - SQLite to models/benchmarks/scores/sota/leaderboards JSON"
```

---

## Phase 5: Dashboard

### Task 11: Dashboard HTML + JavaScript

**Files:**
- Create: `dashboard/index.html`
- Create: `dashboard/css/style.css`
- Create: `dashboard/js/app.js`
- Create: `dashboard/js/charts.js`
- Create: `dashboard/js/filters.js`
- Create: `dashboard/js/explorer.js`

- [ ] **Step 1: Create all dashboard files**

The dashboard is a self-contained SPA. Create the following files with the content specified in the spec's Publisher section. Key structure:

**dashboard/index.html** — Single page with 5 tab sections (Overview, Leaderboard, Trends, Explorer, Changelog), Tailwind CSS via CDN, ECharts via CDN.

**dashboard/css/style.css** — Tab button styles, SOTA table styles, badge styles (sota, new, proprietary, open-weight, open-source), change card and leaderboard card styles.

**dashboard/js/charts.js** — ECharts wrapper object with methods: `renderTrendLine(containerId, benchmarkId, historyData)`, `renderRadar(containerId, modelsData, benchmarkIds)`, `renderHeatmap(containerId, models, benchmarks, matrix)`. All methods use dark theme and auto-resize.

**dashboard/js/filters.js** — Filter object with `apply(scores, models, {category, modelType, source, search})`, `sortByValue(scores, ascending)`, `groupByModel(scores)`.

**dashboard/js/explorer.js** — Explorer object with `compare(modelA, modelB, scores)` returning per-benchmark comparison array, and `renderComparison(containerId, modelA, modelB, comparison)` rendering a comparison table. Use safe DOM methods (document.createElement, textContent) instead of string concatenation for rendering user-sourced data.

**dashboard/js/app.js** — Main App object with `init()`, `loadData()`, `setupTabs()`, `setupFilters()`, `setupExplorer()`, `renderOverview()`, `renderLeaderboard()`, `renderTrends()`, `renderChangelog()`. Fetches JSON from `data/` directory at runtime. Use safe DOM methods for rendering dynamic content.

Note: All rendering of user-sourced data (model names, benchmark values from JSON) must use safe DOM APIs (createElement + textContent) rather than string interpolation into HTML, to prevent XSS from malicious data in scraped sources.

- [ ] **Step 2: Verify dashboard loads locally**

```bash
cd /Users/user/git/cyber
python -m http.server 8000 --directory dashboard &
# Open http://localhost:8000 in browser
# Expected: Dashboard loads with empty state, no JS errors in console
kill %1
```

- [ ] **Step 3: Commit**

```bash
git add dashboard/
git commit -m "feat: interactive dashboard with Overview, Leaderboard, Trends, Explorer, Changelog tabs"
```

---

## Phase 6: CLI Integration

### Task 12: CLI Commands

**Files:**
- Modify: `__main__.py`

- [ ] **Step 1: Implement full CLI**

Replace the stub `__main__.py` with the full implementation containing these commands:

- `cli` group — top-level group
- `run --all` — runs scout, analyze, export in sequence
- `scout --name <name>` — loads enabled scouts from config, runs them, inserts scores into DB
- `analyze` — loads scores from DB, validates with Validator, marks SOTA with SOTATracker, prints SOTA table
- `export` — creates Exporter, runs export_all to DATA_DIR
- `serve --port <port>` — serves dashboard/ directory via http.server

Uses: click for CLI, rich for console output (Console, Table), yaml for config loading, asyncio.run for scout execution. Loads config from `config/` directory. DB path is `data/benchmark.db`.

- [ ] **Step 2: Verify CLI works**

```bash
cd /Users/user/git/cyber
python -m cyber --help
python -m cyber scout --help
python -m cyber analyze --help
python -m cyber export --help
python -m cyber serve --help
```

Expected: All commands show help text without errors.

- [ ] **Step 3: Commit**

```bash
git add __main__.py
git commit -m "feat: CLI with scout, analyze, export, serve commands"
```

---

## Phase 7: CI/CD

### Task 13: GitHub Actions Workflows

**Files:**
- Create: `.github/workflows/benchmark-update.yml`
- Create: `.github/workflows/event-monitor.yml`
- Create: `.github/workflows/manual-scout.yml`

- [ ] **Step 1: Create main pipeline workflow**

`.github/workflows/benchmark-update.yml`:
- Triggers: cron `0 6 * * *`, workflow_dispatch, repository_dispatch (new-model-detected)
- Permissions: contents write, issues write
- Three sequential jobs: scout, analyst, publish
- Scout job: checkout, setup-python 3.11, pip install, run `python -m cyber scout`, upload DB artifact
- Analyst job: needs scout, download artifact, run `python -m cyber analyze`, upload DB artifact
- Publish job: needs analyst, download artifact, run `python -m cyber export`, deploy dashboard + data to gh-pages branch
- Timeout: 15min scout, 10min analyst, 5min publish
- Uses ANTHROPIC_API_KEY secret

- [ ] **Step 2: Create event monitor workflow**

`.github/workflows/event-monitor.yml`:
- Triggers: cron `0 */6 * * *` (every 6 hours)
- Single job: runs `python -m cyber scout --name hf-release-scout`
- If new releases detected: triggers repository_dispatch via `gh api`
- Lightweight, no Anthropic API key needed

- [ ] **Step 3: Create manual scout workflow**

`.github/workflows/manual-scout.yml`:
- Triggers: workflow_dispatch with optional `scout_name` input
- Single job: runs specified scout or all scouts, then analyze + export
- Commits data changes back to main branch

- [ ] **Step 4: Commit**

```bash
git add .github/
git commit -m "feat: GitHub Actions - daily pipeline, 6h event monitor, manual scout dispatch"
```

---

## Phase 8: Additional Scouts (Incremental)

### Task 14: Chatbot Arena Scout

**Files:**
- Create: `scouts/leaderboard/chatbot_arena.py`
- Create: `tests/test_leaderboard_arena.py`
- Create: `tests/fixtures/sample_arena.json`

- [ ] **Step 1: Create test fixture**

`tests/fixtures/sample_arena.json`:
```json
[
  {
    "rank": 1,
    "model": "Claude 4 Opus",
    "model_id": "anthropic/claude-4-opus",
    "elo": 1350,
    "votes": 25000,
    "organization": "Anthropic",
    "license": "Proprietary"
  },
  {
    "rank": 2,
    "model": "GPT-4o",
    "model_id": "openai/gpt-4o",
    "elo": 1320,
    "votes": 30000,
    "organization": "OpenAI",
    "license": "Proprietary"
  },
  {
    "rank": 3,
    "model": "Gemini 2.5 Pro",
    "model_id": "google/gemini-2.5-pro",
    "elo": 1305,
    "votes": 20000,
    "organization": "Google",
    "license": "Proprietary"
  }
]
```

- [ ] **Step 2: Write failing tests**

`tests/test_leaderboard_arena.py`:
```python
import json
import pytest
from datetime import date
from pathlib import Path
from unittest.mock import AsyncMock, patch

from scouts.leaderboard.chatbot_arena import ChatbotArenaScout
from models.types import RawRecord


@pytest.fixture
def sample_data():
    p = Path(__file__).parent / "fixtures" / "sample_arena.json"
    return json.loads(p.read_text())


@pytest.fixture
def scout():
    return ChatbotArenaScout()


def test_scout_name(scout):
    assert scout.name == "chatbot-arena-scout"


@pytest.mark.asyncio
async def test_discover(scout, sample_data):
    with patch.object(scout, "_fetch_data", new_callable=AsyncMock, return_value=sample_data):
        records = await scout.discover()
        assert len(records) == 3


def test_parse_produces_elo_scores(scout, sample_data):
    raw = RawRecord(
        scout_name="chatbot-arena-scout",
        source_url="https://lmarena.ai",
        raw_data=sample_data[0],
        collected_at=date(2026, 4, 16),
    )
    scores = scout.parse(raw)
    assert len(scores) >= 1
    elo_score = scores[0]
    assert elo_score.benchmark_id == "chatbot-arena-elo"
    assert elo_score.value == 1350
    assert elo_score.model_id == "anthropic/claude-4-opus"
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
pytest tests/test_leaderboard_arena.py -v
```

Expected: FAIL

- [ ] **Step 4: Implement Chatbot Arena scout**

`scouts/leaderboard/chatbot_arena.py`:
```python
from __future__ import annotations

from datetime import date

import httpx

from models.types import RawRecord, Score, Source
from scouts.base import BaseScout

ARENA_URL = "https://lmarena.ai/api/v1/leaderboard"


class ChatbotArenaScout(BaseScout):
    name = "chatbot-arena-scout"

    async def _fetch_data(self) -> list[dict]:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(ARENA_URL)
            resp.raise_for_status()
            return resp.json()

    async def discover(self) -> list[RawRecord]:
        data = await self._fetch_data()
        today = date.today()
        return [
            RawRecord(
                scout_name=self.name,
                source_url="https://lmarena.ai",
                raw_data=entry,
                collected_at=today,
            )
            for entry in data
        ]

    def parse(self, raw: RawRecord) -> list[Score]:
        entry = raw.raw_data
        model_id = entry.get("model_id", entry.get("model", "unknown"))
        elo = entry.get("elo", 0)

        return [
            Score(
                model_id=model_id,
                benchmark_id="chatbot-arena-elo",
                value=float(elo),
                unit="elo",
                source=Source(
                    type="leaderboard",
                    url=raw.source_url,
                    date=raw.collected_at.isoformat(),
                    citation=None,
                ),
                is_sota=False,
                collected_at=raw.collected_at,
                notes=f"rank #{entry.get('rank', '?')}, votes: {entry.get('votes', '?')}",
            )
        ]
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pytest tests/test_leaderboard_arena.py -v
```

Expected: All 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add scouts/leaderboard/chatbot_arena.py tests/test_leaderboard_arena.py tests/fixtures/sample_arena.json
git commit -m "feat: Chatbot Arena scout - ELO rankings from LMSYS Arena"
```

---

### Task 15: Run Full Test Suite

- [ ] **Step 1: Run all tests**

```bash
cd /Users/user/git/cyber
pytest -v --tb=short
```

Expected: All tests PASS (approximately 30+ tests).

- [ ] **Step 2: Run linter**

```bash
ruff check .
```

Expected: No lint errors.

- [ ] **Step 3: Test full pipeline locally**

```bash
python -m cyber export
ls -la data/*.json data/scores/ data/leaderboards/
```

Expected: JSON files created (may be empty arrays/objects).

- [ ] **Step 4: Final commit**

```bash
git add -A
git diff --staged --quiet || git commit -m "chore: ensure all tests pass and linting is clean"
```

---

## Summary of Tasks

| # | Task | Phase | Key Deliverable |
|---|------|-------|-----------------|
| 1 | Project Scaffold | Foundation | pyproject.toml, package structure, CLI entry |
| 2 | Data Types | Foundation | Model, Benchmark, Score, LeaderboardRanking dataclasses |
| 3 | SQLite Schema | Foundation | DB tables, CRUD operations |
| 4 | Config Files | Foundation | scouts.yaml, limits.yaml, aliases, benchmark meta |
| 5 | BaseScout + Runner | Scout | ABC interface, parallel executor with failure isolation |
| 6 | Open LLM Scout | Scout | First working scout with tests |
| 7 | Normalizer | Analyst | Model/benchmark name normalization |
| 8 | Validator | Analyst | Anomaly detection with range/drop checks |
| 9 | SOTA Tracker | Analyst | SOTA computation, change detection |
| 10 | JSON Exporter | Publisher | SQLite to JSON for all data types |
| 11 | Dashboard | Publisher | Interactive SPA with 5 tabs |
| 12 | CLI | Integration | scout, analyze, export, serve commands |
| 13 | GitHub Actions | CI/CD | Daily pipeline, event monitor, manual dispatch |
| 14 | Chatbot Arena Scout | Scout | Second scout proving the extension pattern |
| 15 | Full Test Suite | Verification | All tests pass, lint clean |
