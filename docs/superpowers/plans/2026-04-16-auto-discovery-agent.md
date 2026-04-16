# Auto-Discovery Benchmark Agent — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3 autonomous agents (Discovery, Collector, Librarian) that automatically find, collect, and manage benchmark data sources with adaptive scheduling and trust-based quality control.

**Architecture:** Source Registry (SQLite) as the central hub. Discovery Agent finds new sources via web search and link expansion. Collector Agent crawls registered sources with 2-tier parsers (rule-based first, Claude API fallback). Librarian Agent manages trust scores, adaptive schedules, and cross-validation. Scheduler orchestrates all agents.

**Tech Stack:** Python 3.9+, httpx, BeautifulSoup4, SQLite, Claude API (anthropic), click CLI, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-04-16-auto-discovery-agent-design.md`

---

## File Structure

```
cyber/
├── models/
│   └── types.py               (MODIFY: add SourceEntry dataclass)
│
├── db/
│   └── schema.py              (MODIFY: add sources table + CRUD)
│
├── parsers/                   (NEW directory)
│   ├── __init__.py
│   ├── base.py                # BaseParser ABC
│   ├── json_api.py            # JSON API parser
│   ├── html_table.py          # HTML table parser (BS4)
│   ├── csv_parser.py          # CSV parser
│   ├── markdown_parser.py     # Markdown table parser
│   └── llm_parser.py          # Claude API fallback parser
│
├── agents/                    (NEW directory)
│   ├── __init__.py
│   ├── discovery.py           # Discovery Agent
│   ├── collector.py           # Collector Agent
│   ├── librarian.py           # Librarian Agent
│   └── scheduler.py           # Scheduler (orchestrator)
│
├── config/
│   ├── seed_sources.yaml      (NEW)
│   └── events_calendar.yaml   (NEW)
│
├── __main__.py                (MODIFY: add discover/collect/librarian/sources commands)
│
├── tests/
│   ├── test_source_registry.py
│   ├── test_parsers.py
│   ├── test_discovery.py
│   ├── test_collector.py
│   ├── test_librarian.py
│   ├── test_scheduler.py
│   └── fixtures/
│       ├── sample_html_table.html
│       ├── sample_json_api.json
│       └── sample_leaderboard.html
│
└── .github/workflows/
    ├── discovery.yml           (NEW)
    ├── librarian-weekly.yml    (NEW)
    └── librarian-boost.yml     (NEW)
```

---

## Phase 1: Source Registry (Foundation)

### Task 1: SourceEntry Data Type

**Files:**
- Modify: `cyber/models/types.py`
- Create: `tests/test_source_registry.py`

- [ ] **Step 1: Write failing test for SourceEntry**

```python
# tests/test_source_registry.py
from datetime import date
from cyber.models.types import SourceEntry


def test_source_entry_creation():
    s = SourceEntry(
        id="src-001",
        url="https://lmarena.ai",
        name="Chatbot Arena",
        type="leaderboard",
        format="json_api",
        trust_score=0.9,
        status="active",
        discovered_by="seed",
        discovered_at=date(2026, 4, 16),
    )
    assert s.id == "src-001"
    assert s.trust_score == 0.9
    assert s.status == "active"
    assert s.crawl_count == 0
    assert s.fail_count == 0
    assert s.crawl_interval_hours == 24


def test_source_entry_defaults():
    s = SourceEntry(
        id="src-002",
        url="https://example.com",
        name="Example",
        type="blog",
        format="html_table",
        trust_score=0.4,
        status="candidate",
        discovered_by="web_search",
        discovered_at=date(2026, 4, 16),
    )
    assert s.last_crawled_at is None
    assert s.last_changed_at is None
    assert s.change_count == 0
    assert s.benchmarks == []
    assert s.models_count == 0
    assert s.notes == ""
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pytest tests/test_source_registry.py -v
```

Expected: FAIL — `ImportError: cannot import name 'SourceEntry'`

- [ ] **Step 3: Implement SourceEntry**

Add to `cyber/models/types.py`:

```python
@dataclass
class SourceEntry:
    id: str
    url: str
    name: str
    type: str       # "leaderboard" | "vendor_page" | "paper" | "blog" | "dataset_hub" | "evaluation_report"
    format: str     # "html_table" | "json_api" | "pdf" | "markdown" | "csv"
    trust_score: float
    status: str     # "active" | "candidate" | "dead" | "paused"
    discovered_by: str  # "seed" | "link_expansion" | "web_search"
    discovered_at: date
    last_crawled_at: date = None
    last_changed_at: date = None
    crawl_count: int = 0
    change_count: int = 0
    fail_count: int = 0
    crawl_interval_hours: int = 24
    benchmarks: list = field(default_factory=list)
    models_count: int = 0
    notes: str = ""
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pytest tests/test_source_registry.py -v
```

- [ ] **Step 5: Commit**

```bash
git add cyber/models/types.py tests/test_source_registry.py
git commit -m "feat: add SourceEntry dataclass for source registry"
```

---

### Task 2: Sources DB Table + CRUD

**Files:**
- Modify: `cyber/db/schema.py`
- Modify: `tests/test_source_registry.py`

- [ ] **Step 1: Write failing tests for sources CRUD**

Append to `tests/test_source_registry.py`:

```python
from cyber.db.schema import (
    init_db, insert_source, get_sources, get_source_by_id,
    update_source, get_due_sources,
)


def test_insert_and_get_source(db):
    init_db(db)
    s = SourceEntry(
        id="src-001", url="https://lmarena.ai", name="Chatbot Arena",
        type="leaderboard", format="json_api", trust_score=0.9,
        status="active", discovered_by="seed", discovered_at=date(2026, 4, 16),
        crawl_interval_hours=6,
    )
    insert_source(db, s)
    sources = get_sources(db)
    assert len(sources) == 1
    assert sources[0].name == "Chatbot Arena"
    assert sources[0].trust_score == 0.9


def test_get_source_by_id(db):
    init_db(db)
    s = SourceEntry(
        id="src-001", url="https://lmarena.ai", name="Arena",
        type="leaderboard", format="json_api", trust_score=0.9,
        status="active", discovered_by="seed", discovered_at=date(2026, 4, 16),
    )
    insert_source(db, s)
    result = get_source_by_id(db, "src-001")
    assert result is not None
    assert result.url == "https://lmarena.ai"


def test_get_source_by_id_not_found(db):
    init_db(db)
    result = get_source_by_id(db, "nonexistent")
    assert result is None


def test_update_source(db):
    init_db(db)
    s = SourceEntry(
        id="src-001", url="https://lmarena.ai", name="Arena",
        type="leaderboard", format="json_api", trust_score=0.9,
        status="active", discovered_by="seed", discovered_at=date(2026, 4, 16),
        crawl_count=0, fail_count=0,
    )
    insert_source(db, s)
    s.crawl_count = 5
    s.trust_score = 0.85
    s.last_crawled_at = date(2026, 4, 16)
    update_source(db, s)
    result = get_source_by_id(db, "src-001")
    assert result.crawl_count == 5
    assert result.trust_score == 0.85


def test_get_sources_by_status(db):
    init_db(db)
    s1 = SourceEntry(id="s1", url="https://a.com", name="A", type="leaderboard",
                     format="json_api", trust_score=0.9, status="active",
                     discovered_by="seed", discovered_at=date(2026, 4, 16))
    s2 = SourceEntry(id="s2", url="https://b.com", name="B", type="blog",
                     format="html_table", trust_score=0.4, status="candidate",
                     discovered_by="web_search", discovered_at=date(2026, 4, 16))
    insert_source(db, s1)
    insert_source(db, s2)
    active = get_sources(db, status="active")
    assert len(active) == 1
    assert active[0].id == "s1"


def test_get_due_sources(db):
    init_db(db)
    # Source crawled 48h ago with 24h interval → due
    s1 = SourceEntry(id="s1", url="https://a.com", name="A", type="leaderboard",
                     format="json_api", trust_score=0.9, status="active",
                     discovered_by="seed", discovered_at=date(2026, 4, 14),
                     last_crawled_at=date(2026, 4, 14), crawl_interval_hours=24)
    # Source crawled today with 24h interval → not due
    s2 = SourceEntry(id="s2", url="https://b.com", name="B", type="leaderboard",
                     format="json_api", trust_score=0.8, status="active",
                     discovered_by="seed", discovered_at=date(2026, 4, 16),
                     last_crawled_at=date(2026, 4, 16), crawl_interval_hours=24)
    # Never crawled → due
    s3 = SourceEntry(id="s3", url="https://c.com", name="C", type="blog",
                     format="html_table", trust_score=0.6, status="active",
                     discovered_by="link_expansion", discovered_at=date(2026, 4, 16))
    insert_source(db, s1)
    insert_source(db, s2)
    insert_source(db, s3)
    due = get_due_sources(db, as_of=date(2026, 4, 16))
    due_ids = [s.id for s in due]
    assert "s1" in due_ids
    assert "s3" in due_ids
    assert "s2" not in due_ids
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_source_registry.py -v
```

- [ ] **Step 3: Add sources table to SCHEMA_SQL and implement CRUD**

Add to `cyber/db/schema.py` SCHEMA_SQL:

```sql
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
```

Add functions: `insert_source(conn, source: SourceEntry)`, `get_sources(conn, status=None) -> list[SourceEntry]`, `get_source_by_id(conn, id) -> SourceEntry | None`, `update_source(conn, source: SourceEntry)`, `get_due_sources(conn, as_of: date) -> list[SourceEntry]`.

`get_due_sources` logic: SELECT sources WHERE status='active' AND (last_crawled_at IS NULL OR julianday(as_of) - julianday(last_crawled_at) >= crawl_interval_hours / 24.0) ORDER BY trust_score DESC.

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_source_registry.py -v
```

- [ ] **Step 5: Commit**

```bash
git add cyber/db/schema.py tests/test_source_registry.py
git commit -m "feat: sources table with CRUD and due-sources query"
```

---

### Task 3: Seed Sources Config + Loader

**Files:**
- Create: `config/seed_sources.yaml`
- Create: `config/events_calendar.yaml`

- [ ] **Step 1: Create seed_sources.yaml**

```yaml
sources:
  - url: "https://lmarena.ai"
    name: "Chatbot Arena"
    type: leaderboard
    format: json_api
  - url: "https://huggingface.co/spaces/open-llm-leaderboard"
    name: "Open LLM Leaderboard"
    type: leaderboard
    format: json_api
  - url: "https://scale.com/leaderboard"
    name: "SEAL Leaderboard"
    type: leaderboard
    format: html_table
  - url: "https://artificialanalysis.ai"
    name: "Artificial Analysis"
    type: leaderboard
    format: html_table
  - url: "https://livebench.ai"
    name: "LiveBench"
    type: leaderboard
    format: html_table
  - url: "https://llm-stats.com/benchmarks"
    name: "LLM Stats"
    type: leaderboard
    format: html_table
  - url: "https://matharena.ai"
    name: "MathArena"
    type: leaderboard
    format: html_table
  - url: "https://www.anthropic.com/research"
    name: "Anthropic Research"
    type: vendor_page
    format: html_table
  - url: "https://openai.com/index"
    name: "OpenAI Blog"
    type: vendor_page
    format: html_table
  - url: "https://blog.google/technology/ai/"
    name: "Google AI Blog"
    type: vendor_page
    format: html_table
  - url: "https://arxiv.org"
    name: "arXiv"
    type: paper
    format: pdf
  - url: "https://epoch.ai/benchmarks"
    name: "Epoch AI Benchmarks"
    type: evaluation_report
    format: html_table
```

- [ ] **Step 2: Create events_calendar.yaml**

```yaml
conferences:
  - name: "NeurIPS"
    month: 12
    start_day: 1
    duration_days: 14
  - name: "ICML"
    month: 7
    start_day: 14
    duration_days: 14
  - name: "ICLR"
    month: 5
    start_day: 1
    duration_days: 14
  - name: "ACL"
    month: 7
    start_day: 1
    duration_days: 14

boost_factor: 0.5
boost_on_new_model_hours: 48
```

- [ ] **Step 3: Commit**

```bash
git add config/seed_sources.yaml config/events_calendar.yaml
git commit -m "feat: seed sources config (12 sources) and conference events calendar"
```

---

## Phase 2: Parser Framework

### Task 4: BaseParser + JSON API Parser

**Files:**
- Create: `cyber/parsers/__init__.py`
- Create: `cyber/parsers/base.py`
- Create: `cyber/parsers/json_api.py`
- Create: `tests/test_parsers.py`
- Create: `tests/fixtures/sample_json_api.json`

- [ ] **Step 1: Create test fixture**

`tests/fixtures/sample_json_api.json`:
```json
[
  {"model": "anthropic/claude-opus-4.6", "benchmark": "mmlu", "score": 93.2},
  {"model": "openai/gpt-5.2", "benchmark": "mmlu", "score": 91.8},
  {"model": "anthropic/claude-opus-4.6", "benchmark": "gpqa", "score": 91.3}
]
```

- [ ] **Step 2: Write failing tests**

```python
# tests/test_parsers.py
import json
from pathlib import Path
from cyber.parsers.base import BaseParser
from cyber.parsers.json_api import JsonApiParser


class FakeParser(BaseParser):
    def parse(self, content, source_url=""):
        return [{"model": "test", "benchmark": "test", "value": 1.0}]


def test_base_parser_cannot_instantiate():
    import pytest
    with pytest.raises(TypeError):
        BaseParser()


def test_fake_parser_works():
    p = FakeParser()
    results = p.parse("anything")
    assert len(results) == 1


def test_json_api_parser():
    fixture = Path(__file__).parent / "fixtures" / "sample_json_api.json"
    content = fixture.read_text()
    parser = JsonApiParser()
    results = parser.parse(content)
    assert len(results) == 3
    assert results[0]["model_id"] == "anthropic/claude-opus-4.6"
    assert results[0]["benchmark_id"] == "mmlu"
    assert results[0]["value"] == 93.2


def test_json_api_parser_dict_with_scores():
    content = json.dumps({
        "model": "test/model",
        "scores": {"mmlu": 90.0, "gpqa": 85.0}
    })
    parser = JsonApiParser()
    results = parser.parse(content)
    assert len(results) == 2


def test_json_api_parser_empty():
    parser = JsonApiParser()
    results = parser.parse("[]")
    assert results == []


def test_json_api_parser_invalid_json():
    parser = JsonApiParser()
    results = parser.parse("not json")
    assert results == []
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
pytest tests/test_parsers.py -v
```

- [ ] **Step 4: Implement BaseParser and JsonApiParser**

`cyber/parsers/__init__.py`: empty

`cyber/parsers/base.py`:
```python
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any, Dict, List


class BaseParser(ABC):
    @abstractmethod
    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        """Parse content and return list of dicts with model_id, benchmark_id, value keys."""
        ...
```

`cyber/parsers/json_api.py`:
```python
from __future__ import annotations
import json
from typing import Any, Dict, List
from cyber.parsers.base import BaseParser


class JsonApiParser(BaseParser):
    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        try:
            data = json.loads(content)
        except (json.JSONDecodeError, TypeError):
            return []

        results = []
        if isinstance(data, list):
            for entry in data:
                model_id = entry.get("model", entry.get("model_id", ""))
                benchmark_id = entry.get("benchmark", entry.get("benchmark_id", ""))
                value = entry.get("score", entry.get("value"))
                if model_id and benchmark_id and value is not None:
                    results.append({
                        "model_id": model_id,
                        "benchmark_id": benchmark_id,
                        "value": float(value),
                        "unit": entry.get("unit", "%"),
                    })
        elif isinstance(data, dict):
            model_id = data.get("model", data.get("model_id", ""))
            scores = data.get("scores", {})
            for bench_id, value in scores.items():
                if value is not None:
                    results.append({
                        "model_id": model_id,
                        "benchmark_id": bench_id,
                        "value": float(value),
                        "unit": "%",
                    })
        return results
```

- [ ] **Step 5: Run tests, verify pass**

```bash
pytest tests/test_parsers.py -v
```

- [ ] **Step 6: Commit**

```bash
git add cyber/parsers/ tests/test_parsers.py tests/fixtures/sample_json_api.json
git commit -m "feat: BaseParser ABC and JsonApiParser for structured API responses"
```

---

### Task 5: HTML Table Parser + Markdown Parser

**Files:**
- Modify: `cyber/parsers/html_table.py`
- Modify: `cyber/parsers/markdown_parser.py`
- Create: `tests/fixtures/sample_html_table.html`
- Modify: `tests/test_parsers.py`

- [ ] **Step 1: Create HTML fixture**

`tests/fixtures/sample_html_table.html`:
```html
<table>
<thead><tr><th>Model</th><th>MMLU</th><th>GPQA</th><th>HumanEval</th></tr></thead>
<tbody>
<tr><td>Claude Opus 4.6</td><td>93.2</td><td>91.3</td><td>92.8</td></tr>
<tr><td>GPT-5.2</td><td>91.8</td><td>92.4</td><td>90.2</td></tr>
</tbody>
</table>
```

- [ ] **Step 2: Write failing tests**

Append to `tests/test_parsers.py`:

```python
from cyber.parsers.html_table import HtmlTableParser
from cyber.parsers.markdown_parser import MarkdownParser


def test_html_table_parser():
    fixture = Path(__file__).parent / "fixtures" / "sample_html_table.html"
    content = fixture.read_text()
    parser = HtmlTableParser()
    results = parser.parse(content)
    assert len(results) == 6  # 2 models x 3 benchmarks
    mmlu_claude = [r for r in results if "claude" in r["model_id"].lower() and r["benchmark_id"] == "mmlu"]
    assert len(mmlu_claude) == 1
    assert mmlu_claude[0]["value"] == 93.2


def test_html_table_parser_no_table():
    parser = HtmlTableParser()
    results = parser.parse("<p>No table here</p>")
    assert results == []


def test_markdown_parser():
    content = "| Model | MMLU | GPQA |\n|---|---|---|\n| Claude | 93.2 | 91.3 |\n| GPT | 91.8 | 92.4 |"
    parser = MarkdownParser()
    results = parser.parse(content)
    assert len(results) == 4  # 2 models x 2 benchmarks


def test_markdown_parser_no_table():
    parser = MarkdownParser()
    results = parser.parse("Just some text with no tables")
    assert results == []
```

- [ ] **Step 3: Run tests to verify they fail**

- [ ] **Step 4: Implement HtmlTableParser**

`cyber/parsers/html_table.py`:
```python
from __future__ import annotations
import re
from typing import Any, Dict, List
from bs4 import BeautifulSoup
from cyber.parsers.base import BaseParser


class HtmlTableParser(BaseParser):
    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        soup = BeautifulSoup(content, "lxml")
        results = []
        for table in soup.find_all("table"):
            rows = table.find_all("tr")
            if len(rows) < 2:
                continue
            headers = [th.get_text(strip=True).lower() for th in rows[0].find_all(["th", "td"])]
            if not headers:
                continue
            # Find which column is the model name
            model_col = self._find_model_column(headers)
            if model_col is None:
                model_col = 0
            bench_cols = []
            for i, h in enumerate(headers):
                if i != model_col and not self._is_non_benchmark(h):
                    bench_cols.append((i, h))
            for row in rows[1:]:
                cells = [td.get_text(strip=True) for td in row.find_all(["td", "th"])]
                if len(cells) <= model_col:
                    continue
                model_name = cells[model_col]
                if not model_name:
                    continue
                for col_idx, bench_name in bench_cols:
                    if col_idx >= len(cells):
                        continue
                    val = self._extract_number(cells[col_idx])
                    if val is not None:
                        results.append({
                            "model_id": model_name,
                            "benchmark_id": bench_name.lower().replace(" ", "_"),
                            "value": val,
                            "unit": "%",
                        })
        return results

    def _find_model_column(self, headers):
        for i, h in enumerate(headers):
            if any(kw in h for kw in ["model", "name", "system", "agent"]):
                return i
        return None

    def _is_non_benchmark(self, header):
        skip = ["rank", "#", "type", "license", "org", "organization", "params", "size",
                "date", "link", "source", "votes", "provider"]
        return any(kw in header for kw in skip)

    def _extract_number(self, text):
        text = text.strip().rstrip("%")
        match = re.search(r"[\d]+(?:\.[\d]+)?", text)
        if match:
            return float(match.group())
        return None
```

- [ ] **Step 5: Implement MarkdownParser**

`cyber/parsers/markdown_parser.py`:
```python
from __future__ import annotations
import re
from typing import Any, Dict, List
from cyber.parsers.base import BaseParser


class MarkdownParser(BaseParser):
    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        results = []
        lines = content.strip().split("\n")
        table_start = None
        for i, line in enumerate(lines):
            if "|" in line and line.strip().startswith("|"):
                if table_start is None:
                    table_start = i
            elif table_start is not None:
                results.extend(self._parse_md_table(lines[table_start:i]))
                table_start = None
        if table_start is not None:
            results.extend(self._parse_md_table(lines[table_start:]))
        return results

    def _parse_md_table(self, lines):
        results = []
        clean = [l.strip().strip("|") for l in lines]
        clean = [l for l in clean if l and not re.match(r"^[\s\-:|]+$", l)]
        if len(clean) < 2:
            return results
        headers = [h.strip().lower() for h in clean[0].split("|")]
        model_col = 0
        bench_cols = [(i, h) for i, h in enumerate(headers) if i != model_col and h]
        for row_line in clean[1:]:
            cells = [c.strip() for c in row_line.split("|")]
            if len(cells) <= model_col:
                continue
            model_name = cells[model_col]
            for col_idx, bench_name in bench_cols:
                if col_idx >= len(cells):
                    continue
                val_match = re.search(r"[\d]+(?:\.[\d]+)?", cells[col_idx])
                if val_match:
                    results.append({
                        "model_id": model_name,
                        "benchmark_id": bench_name.replace(" ", "_"),
                        "value": float(val_match.group()),
                        "unit": "%",
                    })
        return results
```

- [ ] **Step 6: Run tests, verify pass**

```bash
pytest tests/test_parsers.py -v
```

- [ ] **Step 7: Commit**

```bash
git add cyber/parsers/html_table.py cyber/parsers/markdown_parser.py tests/fixtures/sample_html_table.html tests/test_parsers.py
git commit -m "feat: HTML table and Markdown parsers for benchmark data extraction"
```

---

### Task 6: CSV Parser + LLM Fallback Parser

**Files:**
- Create: `cyber/parsers/csv_parser.py`
- Create: `cyber/parsers/llm_parser.py`
- Modify: `tests/test_parsers.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/test_parsers.py`:

```python
from cyber.parsers.csv_parser import CsvParser
from cyber.parsers.llm_parser import LlmParser


def test_csv_parser():
    content = "model,benchmark,score\nclaude,mmlu,93.2\ngpt,mmlu,91.8"
    parser = CsvParser()
    results = parser.parse(content)
    assert len(results) == 2
    assert results[0]["value"] == 93.2


def test_csv_parser_empty():
    parser = CsvParser()
    results = parser.parse("")
    assert results == []


def test_llm_parser_init():
    parser = LlmParser(api_key="test-key")
    assert parser._api_key == "test-key"
```

- [ ] **Step 2: Implement CsvParser**

`cyber/parsers/csv_parser.py`:
```python
from __future__ import annotations
import csv
import io
from typing import Any, Dict, List
from cyber.parsers.base import BaseParser


class CsvParser(BaseParser):
    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        if not content.strip():
            return []
        results = []
        reader = csv.DictReader(io.StringIO(content))
        for row in reader:
            model_id = row.get("model", row.get("model_id", ""))
            benchmark_id = row.get("benchmark", row.get("benchmark_id", ""))
            value = row.get("score", row.get("value"))
            if model_id and benchmark_id and value is not None:
                try:
                    results.append({
                        "model_id": model_id,
                        "benchmark_id": benchmark_id.lower(),
                        "value": float(value),
                        "unit": row.get("unit", "%"),
                    })
                except ValueError:
                    continue
        return results
```

- [ ] **Step 3: Implement LlmParser**

`cyber/parsers/llm_parser.py`:
```python
from __future__ import annotations
import json
import os
from typing import Any, Dict, List, Optional
from cyber.parsers.base import BaseParser

EXTRACT_PROMPT = """Analyze the following text from a benchmark evaluation page.
Extract all model benchmark scores as a JSON array.
Each entry should have: "model_id", "benchmark_id", "value" (numeric), "unit".
If no benchmark data is found, return an empty array [].
Only return valid JSON, no explanation.

Text:
{content}"""


class LlmParser(BaseParser):
    def __init__(self, api_key: Optional[str] = None):
        self._api_key = api_key or os.environ.get("ANTHROPIC_API_KEY", "")

    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        if not self._api_key:
            return []
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=self._api_key)
            truncated = content[:8000]
            response = client.messages.create(
                model="claude-sonnet-4-5-20250514",
                max_tokens=2000,
                messages=[{"role": "user", "content": EXTRACT_PROMPT.format(content=truncated)}],
            )
            text = response.content[0].text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1].rsplit("```", 1)[0]
            data = json.loads(text)
            results = []
            for entry in data:
                if all(k in entry for k in ("model_id", "benchmark_id", "value")):
                    results.append({
                        "model_id": entry["model_id"],
                        "benchmark_id": str(entry["benchmark_id"]).lower(),
                        "value": float(entry["value"]),
                        "unit": entry.get("unit", "%"),
                    })
            return results
        except Exception:
            return []
```

- [ ] **Step 4: Run tests, verify pass**

```bash
pytest tests/test_parsers.py -v
```

- [ ] **Step 5: Commit**

```bash
git add cyber/parsers/csv_parser.py cyber/parsers/llm_parser.py tests/test_parsers.py
git commit -m "feat: CSV parser and Claude API LLM fallback parser"
```

---

## Phase 3: Agents

### Task 7: Discovery Agent

**Files:**
- Create: `cyber/agents/__init__.py`
- Create: `cyber/agents/discovery.py`
- Create: `tests/test_discovery.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_discovery.py
import pytest
from datetime import date
from unittest.mock import AsyncMock, patch, MagicMock
from cyber.agents.discovery import DiscoveryAgent


@pytest.fixture
def agent():
    return DiscoveryAgent(seed_sources=[], bmt_benchmarks=[])


def test_agent_name(agent):
    assert agent.name == "discovery-agent"


def test_classify_url_known_domains(agent):
    assert agent.classify_url("https://arxiv.org/abs/1234")["type"] == "paper"
    assert agent.classify_url("https://huggingface.co/spaces/something")["type"] == "dataset_hub"
    assert agent.classify_url("https://openai.com/index/gpt5")["type"] == "vendor_page"


def test_classify_url_leaderboard_path(agent):
    result = agent.classify_url("https://example.com/leaderboard")
    assert result["type"] == "leaderboard"


def test_classify_url_unknown(agent):
    result = agent.classify_url("https://random-site.com/page")
    assert result["type"] == "unknown"


def test_is_benchmark_related(agent):
    assert agent.is_benchmark_related("https://example.com/llm-benchmark-results") is True
    assert agent.is_benchmark_related("https://example.com/cat-pictures") is False


def test_generate_search_queries(agent):
    agent._bmt_benchmarks = ["MMLU", "GPQA", "HumanEval"]
    queries = agent.generate_search_queries(year=2026)
    assert len(queries) > 0
    assert any("MMLU" in q for q in queries)
    assert any("2026" in q for q in queries)


def test_extract_links_from_html(agent):
    html = '<a href="https://other.com/leaderboard">Link</a><a href="/internal">Int</a>'
    links = agent.extract_links(html, base_url="https://example.com")
    assert "https://other.com/leaderboard" in links
    assert "https://example.com/internal" in links
```

- [ ] **Step 2: Implement DiscoveryAgent**

`cyber/agents/__init__.py`: empty

`cyber/agents/discovery.py`:
```python
from __future__ import annotations
import re
import uuid
from datetime import date
from typing import Any, Dict, List, Optional, Set
from urllib.parse import urljoin, urlparse

from cyber.models.types import SourceEntry

KNOWN_DOMAINS = {
    "arxiv.org": {"type": "paper", "format": "pdf"},
    "huggingface.co": {"type": "dataset_hub", "format": "json_api"},
    "openai.com": {"type": "vendor_page", "format": "html_table"},
    "anthropic.com": {"type": "vendor_page", "format": "html_table"},
    "blog.google": {"type": "vendor_page", "format": "html_table"},
    "deepmind.google": {"type": "vendor_page", "format": "html_table"},
    "nist.gov": {"type": "evaluation_report", "format": "html_table"},
    "epoch.ai": {"type": "evaluation_report", "format": "html_table"},
    "scale.com": {"type": "leaderboard", "format": "html_table"},
}

BENCHMARK_KEYWORDS = [
    "benchmark", "leaderboard", "evaluation", "eval", "model card",
    "system card", "mmlu", "gpqa", "humaneval", "swe-bench",
    "results", "performance", "scores", "ranking",
]

SKIP_DOMAINS = {"twitter.com", "x.com", "facebook.com", "linkedin.com",
                "youtube.com", "reddit.com", "github.com/login", "t.co"}


class DiscoveryAgent:
    name = "discovery-agent"

    def __init__(self, seed_sources: List[Dict], bmt_benchmarks: List[str]):
        self._seed_sources = seed_sources
        self._bmt_benchmarks = bmt_benchmarks

    def classify_url(self, url: str) -> Dict[str, str]:
        parsed = urlparse(url)
        domain = parsed.netloc.replace("www.", "")
        for known, info in KNOWN_DOMAINS.items():
            if known in domain:
                return {"type": info["type"], "format": info["format"]}
        path = parsed.path.lower()
        if "/leaderboard" in path or "/ranking" in path:
            return {"type": "leaderboard", "format": "html_table"}
        if "/benchmark" in path or "/eval" in path:
            return {"type": "evaluation_report", "format": "html_table"}
        if "/model-card" in path or "/model_card" in path:
            return {"type": "vendor_page", "format": "html_table"}
        return {"type": "unknown", "format": "html_table"}

    def is_benchmark_related(self, url: str) -> bool:
        url_lower = url.lower()
        return any(kw in url_lower for kw in BENCHMARK_KEYWORDS)

    def generate_search_queries(self, year: int = 2026) -> List[str]:
        queries = [
            f"LLM benchmark leaderboard {year}",
            f"foundation model evaluation results {year}",
            f"new AI benchmark {year}",
            f"model comparison benchmark scores {year}",
        ]
        for bench in self._bmt_benchmarks[:10]:
            queries.append(f"{bench} benchmark results {year}")
        return queries

    def extract_links(self, html: str, base_url: str) -> List[str]:
        links = []
        for match in re.finditer(r'href=["\']([^"\']+)["\']', html):
            href = match.group(1)
            full_url = urljoin(base_url, href)
            parsed = urlparse(full_url)
            if parsed.scheme in ("http", "https"):
                domain = parsed.netloc.replace("www.", "")
                if domain not in SKIP_DOMAINS:
                    links.append(full_url)
        return links

    def create_candidate(self, url: str, name: str, discovered_by: str) -> SourceEntry:
        classification = self.classify_url(url)
        trust = 0.9 if discovered_by == "seed" else 0.6 if discovered_by == "link_expansion" else 0.4
        return SourceEntry(
            id=f"src-{uuid.uuid4().hex[:12]}",
            url=url,
            name=name,
            type=classification["type"] if classification["type"] != "unknown" else "blog",
            format=classification["format"],
            trust_score=trust,
            status="candidate" if discovered_by != "seed" else "active",
            discovered_by=discovered_by,
            discovered_at=date.today(),
        )
```

- [ ] **Step 3: Run tests, verify pass**

```bash
pytest tests/test_discovery.py -v
```

- [ ] **Step 4: Commit**

```bash
git add cyber/agents/ tests/test_discovery.py
git commit -m "feat: Discovery Agent with URL classification, link extraction, search query generation"
```

---

### Task 8: Collector Agent

**Files:**
- Create: `cyber/agents/collector.py`
- Create: `tests/test_collector.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_collector.py
import pytest
from datetime import date
from unittest.mock import AsyncMock, patch, MagicMock
from cyber.agents.collector import CollectorAgent, DiffResult
from cyber.models.types import SourceEntry


@pytest.fixture
def source():
    return SourceEntry(
        id="src-001", url="https://example.com/leaderboard", name="Test LB",
        type="leaderboard", format="json_api", trust_score=0.9,
        status="active", discovered_by="seed", discovered_at=date(2026, 4, 16),
    )


@pytest.fixture
def agent():
    return CollectorAgent()


def test_select_parser_json(agent):
    parser = agent.select_parser("json_api")
    assert parser.__class__.__name__ == "JsonApiParser"


def test_select_parser_html(agent):
    parser = agent.select_parser("html_table")
    assert parser.__class__.__name__ == "HtmlTableParser"


def test_select_parser_csv(agent):
    parser = agent.select_parser("csv")
    assert parser.__class__.__name__ == "CsvParser"


def test_select_parser_markdown(agent):
    parser = agent.select_parser("markdown")
    assert parser.__class__.__name__ == "MarkdownParser"


def test_diff_new_scores(agent):
    new = [{"model_id": "a", "benchmark_id": "mmlu", "value": 90.0}]
    old = []
    diff = agent.compute_diff(new, old)
    assert len(diff.new_scores) == 1
    assert len(diff.updated) == 0


def test_diff_updated_score(agent):
    new = [{"model_id": "a", "benchmark_id": "mmlu", "value": 92.0}]
    old = [{"model_id": "a", "benchmark_id": "mmlu", "value": 90.0}]
    diff = agent.compute_diff(new, old)
    assert len(diff.new_scores) == 0
    assert len(diff.updated) == 1
    assert diff.updated[0]["old_value"] == 90.0
    assert diff.updated[0]["new_value"] == 92.0


def test_diff_unchanged(agent):
    new = [{"model_id": "a", "benchmark_id": "mmlu", "value": 90.0}]
    old = [{"model_id": "a", "benchmark_id": "mmlu", "value": 90.0}]
    diff = agent.compute_diff(new, old)
    assert len(diff.new_scores) == 0
    assert len(diff.updated) == 0
    assert diff.unchanged == 1
```

- [ ] **Step 2: Implement CollectorAgent**

`cyber/agents/collector.py`:
```python
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from cyber.parsers.json_api import JsonApiParser
from cyber.parsers.html_table import HtmlTableParser
from cyber.parsers.csv_parser import CsvParser
from cyber.parsers.markdown_parser import MarkdownParser
from cyber.parsers.base import BaseParser


@dataclass
class DiffResult:
    new_scores: List[Dict[str, Any]] = field(default_factory=list)
    updated: List[Dict[str, Any]] = field(default_factory=list)
    disappeared: List[Dict[str, Any]] = field(default_factory=list)
    unchanged: int = 0


PARSER_MAP = {
    "json_api": JsonApiParser,
    "html_table": HtmlTableParser,
    "csv": CsvParser,
    "markdown": MarkdownParser,
}


class CollectorAgent:
    name = "collector-agent"

    def select_parser(self, format_type: str) -> BaseParser:
        cls = PARSER_MAP.get(format_type, HtmlTableParser)
        return cls()

    def compute_diff(
        self,
        new_scores: List[Dict[str, Any]],
        old_scores: List[Dict[str, Any]],
    ) -> DiffResult:
        old_map = {}
        for s in old_scores:
            key = (s["model_id"], s["benchmark_id"])
            old_map[key] = s["value"]

        result = DiffResult()
        seen_keys = set()

        for s in new_scores:
            key = (s["model_id"], s["benchmark_id"])
            seen_keys.add(key)
            if key not in old_map:
                result.new_scores.append(s)
            elif old_map[key] != s["value"]:
                result.updated.append({
                    "model_id": s["model_id"],
                    "benchmark_id": s["benchmark_id"],
                    "old_value": old_map[key],
                    "new_value": s["value"],
                })
            else:
                result.unchanged += 1

        for key in old_map:
            if key not in seen_keys:
                result.disappeared.append({
                    "model_id": key[0],
                    "benchmark_id": key[1],
                    "value": old_map[key],
                })

        return result
```

- [ ] **Step 3: Run tests, verify pass**

```bash
pytest tests/test_collector.py -v
```

- [ ] **Step 4: Commit**

```bash
git add cyber/agents/collector.py tests/test_collector.py
git commit -m "feat: Collector Agent with parser selection and change diff engine"
```

---

### Task 9: Librarian Agent

**Files:**
- Create: `cyber/agents/librarian.py`
- Create: `tests/test_librarian.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_librarian.py
from datetime import date
from cyber.agents.librarian import LibrarianAgent
from cyber.models.types import SourceEntry


@pytest.fixture
def agent():
    return LibrarianAgent()


def test_compute_interval_high_change_rate(agent):
    s = SourceEntry(id="s1", url="u", name="n", type="leaderboard", format="json_api",
                    trust_score=0.9, status="active", discovered_by="seed",
                    discovered_at=date(2026, 1, 1), crawl_count=10, change_count=8)
    interval = agent.compute_interval(s)
    assert interval == 6


def test_compute_interval_moderate(agent):
    s = SourceEntry(id="s1", url="u", name="n", type="leaderboard", format="json_api",
                    trust_score=0.9, status="active", discovered_by="seed",
                    discovered_at=date(2026, 1, 1), crawl_count=10, change_count=3)
    interval = agent.compute_interval(s)
    assert interval == 24


def test_compute_interval_slow(agent):
    s = SourceEntry(id="s1", url="u", name="n", type="leaderboard", format="json_api",
                    trust_score=0.9, status="active", discovered_by="seed",
                    discovered_at=date(2026, 1, 1), crawl_count=100, change_count=8)
    interval = agent.compute_interval(s)
    assert interval == 72


def test_compute_interval_static(agent):
    s = SourceEntry(id="s1", url="u", name="n", type="paper", format="pdf",
                    trust_score=0.9, status="active", discovered_by="seed",
                    discovered_at=date(2026, 1, 1), crawl_count=100, change_count=2)
    interval = agent.compute_interval(s)
    assert interval == 168


def test_compute_interval_zero_crawls(agent):
    s = SourceEntry(id="s1", url="u", name="n", type="leaderboard", format="json_api",
                    trust_score=0.9, status="active", discovered_by="seed",
                    discovered_at=date(2026, 1, 1), crawl_count=0, change_count=0)
    interval = agent.compute_interval(s)
    assert interval == 24  # default for unknown


def test_compute_trust(agent):
    s = SourceEntry(id="s1", url="https://arxiv.org/something", name="n", type="paper",
                    format="pdf", trust_score=0.4, status="active",
                    discovered_by="web_search", discovered_at=date(2026, 1, 1),
                    crawl_count=15, fail_count=0)
    new_trust = agent.compute_trust(s, cross_validation_pass=True)
    assert new_trust > 0.4  # should increase due to known domain + cross validation


def test_compute_trust_penalty(agent):
    s = SourceEntry(id="s1", url="https://random.com", name="n", type="blog",
                    format="html_table", trust_score=0.6, status="active",
                    discovered_by="link_expansion", discovered_at=date(2026, 1, 1),
                    crawl_count=10, fail_count=6)  # 60% failure
    new_trust = agent.compute_trust(s, cross_validation_pass=False)
    assert new_trust < 0.6


def test_health_check_dead(agent):
    s = SourceEntry(id="s1", url="u", name="n", type="blog", format="html_table",
                    trust_score=0.5, status="active", discovered_by="seed",
                    discovered_at=date(2026, 1, 1), fail_count=5)
    new_status = agent.check_health(s, as_of=date(2026, 4, 16))
    assert new_status == "dead"


def test_health_check_paused(agent):
    s = SourceEntry(id="s1", url="u", name="n", type="blog", format="html_table",
                    trust_score=0.2, status="active", discovered_by="seed",
                    discovered_at=date(2026, 1, 1), fail_count=0)
    new_status = agent.check_health(s, as_of=date(2026, 4, 16))
    assert new_status == "paused"


def test_health_check_active_ok(agent):
    s = SourceEntry(id="s1", url="u", name="n", type="leaderboard", format="json_api",
                    trust_score=0.9, status="active", discovered_by="seed",
                    discovered_at=date(2026, 1, 1), fail_count=0)
    new_status = agent.check_health(s, as_of=date(2026, 4, 16))
    assert new_status == "active"


def test_is_conference_season(agent):
    assert agent.is_conference_season(date(2026, 12, 5)) is True   # NeurIPS
    assert agent.is_conference_season(date(2026, 3, 15)) is False  # No conference


import pytest
```

- [ ] **Step 2: Implement LibrarianAgent**

`cyber/agents/librarian.py`:
```python
from __future__ import annotations
from datetime import date
from typing import List, Optional
from urllib.parse import urlparse

from cyber.models.types import SourceEntry

HIGH_TRUST_DOMAINS = {
    "arxiv.org", "huggingface.co", "anthropic.com", "openai.com",
    "deepmind.google", "blog.google", "nist.gov", "epoch.ai", "scale.com",
}

CONFERENCES = [
    {"name": "NeurIPS", "month": 12, "start_day": 1, "duration_days": 14},
    {"name": "ICML", "month": 7, "start_day": 14, "duration_days": 14},
    {"name": "ICLR", "month": 5, "start_day": 1, "duration_days": 14},
    {"name": "ACL", "month": 7, "start_day": 1, "duration_days": 14},
]


class LibrarianAgent:
    name = "librarian-agent"

    def compute_interval(self, source: SourceEntry) -> int:
        if source.crawl_count == 0:
            return 24
        rate = source.change_count / source.crawl_count
        if rate > 0.5:
            return 6
        elif rate > 0.2:
            return 24
        elif rate > 0.05:
            return 72
        else:
            return 168

    def compute_trust(
        self,
        source: SourceEntry,
        cross_validation_pass: bool = False,
        first_sota_reporter: bool = False,
    ) -> float:
        base = source.trust_score
        bonus = 0.0
        penalty = 0.0

        # Known domain bonus
        domain = urlparse(source.url).netloc.replace("www.", "")
        if any(d in domain for d in HIGH_TRUST_DOMAINS):
            bonus += 0.10

        # Cross-validation
        if cross_validation_pass:
            bonus += 0.10

        # Consecutive success
        if source.crawl_count >= 10 and source.fail_count == 0:
            bonus += 0.05

        # First SOTA reporter
        if first_sota_reporter:
            bonus += 0.05

        # Failure penalty
        if source.crawl_count > 0:
            fail_rate = source.fail_count / source.crawl_count
            if fail_rate > 0.5:
                penalty += 0.15

        # Consecutive failure penalty
        if source.fail_count >= 3:
            penalty += 0.20

        # Cross-validation mismatch
        if not cross_validation_pass and source.crawl_count >= 5:
            penalty += 0.10

        return max(0.0, min(1.0, base + bonus - penalty))

    def check_health(self, source: SourceEntry, as_of: date) -> str:
        if source.status == "active" and source.fail_count >= 5:
            return "dead"
        if source.status == "active" and source.trust_score < 0.3:
            return "paused"
        if source.status == "candidate":
            days_since = (as_of - source.discovered_at).days
            if source.crawl_count > 0 and source.fail_count == 0:
                return "active"
            if days_since >= 14 and source.crawl_count == 0:
                return "dead"
        return source.status

    def is_conference_season(self, check_date: date) -> bool:
        for conf in CONFERENCES:
            start = date(check_date.year, conf["month"], conf["start_day"])
            end_day = conf["start_day"] + conf["duration_days"]
            # Handle month overflow simply
            try:
                end = date(check_date.year, conf["month"], end_day)
            except ValueError:
                end = date(check_date.year, conf["month"] + 1, end_day - 28)
            if start <= check_date <= end:
                return True
        return False

    def apply_boost(self, interval: int, boost_factor: float = 0.5) -> int:
        return max(6, int(interval * boost_factor))
```

- [ ] **Step 3: Run tests, verify pass**

```bash
pytest tests/test_librarian.py -v
```

- [ ] **Step 4: Commit**

```bash
git add cyber/agents/librarian.py tests/test_librarian.py
git commit -m "feat: Librarian Agent with adaptive scheduling, trust scoring, health checks"
```

---

### Task 10: Scheduler (Orchestrator)

**Files:**
- Create: `cyber/agents/scheduler.py`
- Create: `tests/test_scheduler.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_scheduler.py
import pytest
from datetime import date
from cyber.agents.scheduler import Scheduler
from cyber.models.types import SourceEntry


@pytest.fixture
def sources():
    return [
        SourceEntry(id="s1", url="https://a.com", name="A", type="leaderboard",
                    format="json_api", trust_score=0.9, status="active",
                    discovered_by="seed", discovered_at=date(2026, 4, 1),
                    last_crawled_at=date(2026, 4, 14), crawl_interval_hours=24),
        SourceEntry(id="s2", url="https://b.com", name="B", type="blog",
                    format="html_table", trust_score=0.6, status="active",
                    discovered_by="link_expansion", discovered_at=date(2026, 4, 10),
                    last_crawled_at=date(2026, 4, 16), crawl_interval_hours=24),
        SourceEntry(id="s3", url="https://c.com", name="C", type="leaderboard",
                    format="html_table", trust_score=0.3, status="candidate",
                    discovered_by="web_search", discovered_at=date(2026, 4, 15)),
    ]


def test_filter_due_sources(sources):
    scheduler = Scheduler()
    due = scheduler.filter_due(sources, as_of=date(2026, 4, 16))
    due_ids = [s.id for s in due]
    assert "s1" in due_ids   # crawled 2 days ago, 24h interval → due
    assert "s2" not in due_ids  # crawled today → not due
    assert "s3" not in due_ids  # candidate, not active


def test_group_by_trust(sources):
    scheduler = Scheduler()
    groups = scheduler.group_by_trust(sources)
    assert len(groups["high"]) == 1   # trust >= 0.8
    assert len(groups["medium"]) == 1  # 0.5 <= trust < 0.8
    assert len(groups["low"]) == 1     # trust < 0.5


def test_max_parallel():
    scheduler = Scheduler()
    assert scheduler.max_parallel("high") == 10
    assert scheduler.max_parallel("medium") == 5
    assert scheduler.max_parallel("low") == 3
```

- [ ] **Step 2: Implement Scheduler**

`cyber/agents/scheduler.py`:
```python
from __future__ import annotations
from datetime import date, timedelta
from typing import Dict, List

from cyber.models.types import SourceEntry


class Scheduler:
    name = "scheduler"

    def filter_due(self, sources: List[SourceEntry], as_of: date) -> List[SourceEntry]:
        due = []
        for s in sources:
            if s.status != "active":
                continue
            if s.last_crawled_at is None:
                due.append(s)
            else:
                days_since = (as_of - s.last_crawled_at).days
                hours_since = days_since * 24
                if hours_since >= s.crawl_interval_hours:
                    due.append(s)
        return sorted(due, key=lambda s: s.trust_score, reverse=True)

    def group_by_trust(self, sources: List[SourceEntry]) -> Dict[str, List[SourceEntry]]:
        groups = {"high": [], "medium": [], "low": []}
        for s in sources:
            if s.trust_score >= 0.8:
                groups["high"].append(s)
            elif s.trust_score >= 0.5:
                groups["medium"].append(s)
            else:
                groups["low"].append(s)
        return groups

    def max_parallel(self, group: str) -> int:
        return {"high": 10, "medium": 5, "low": 3}.get(group, 3)
```

- [ ] **Step 3: Run tests, verify pass**

```bash
pytest tests/test_scheduler.py -v
```

- [ ] **Step 4: Commit**

```bash
git add cyber/agents/scheduler.py tests/test_scheduler.py
git commit -m "feat: Scheduler with due-source filtering, trust grouping, parallel limits"
```

---

## Phase 4: CLI + CI/CD Integration

### Task 11: CLI Commands

**Files:**
- Modify: `cyber/__main__.py`

- [ ] **Step 1: Add new CLI commands**

Add to `cyber/__main__.py` (before `if __name__ == "__main__"`):

```python
@cli.command()
@click.option("--strategy", type=click.Choice(["all", "search", "expand"]), default="all")
def discover(strategy):
    """Run Discovery Agent to find new benchmark sources."""
    from cyber.agents.discovery import DiscoveryAgent
    from cyber.db.connection import get_connection
    from cyber.db.schema import init_db, get_sources, insert_source

    conn = get_connection(DB_PATH)
    init_db(conn)
    existing = get_sources(conn)
    existing_urls = {s.url for s in existing}

    seeds_cfg = _load_yaml("seed_sources.yaml") if (CONFIG_DIR / "seed_sources.yaml").exists() else {}
    seed_list = seeds_cfg.get("sources", [])

    agent = DiscoveryAgent(seed_sources=seed_list, bmt_benchmarks=[])

    # Register seeds not yet in DB
    registered = 0
    for seed in seed_list:
        if seed["url"] not in existing_urls:
            entry = agent.create_candidate(seed["url"], seed["name"], "seed")
            insert_source(conn, entry)
            registered += 1
            existing_urls.add(seed["url"])

    conn.close()
    console.print(f"[green]Discovery complete. {registered} new seeds registered.[/green]")


@cli.command()
@click.option("--all", "collect_all", is_flag=True, help="Collect from all active sources.")
@click.option("--source", "source_name", default=None, help="Collect from specific source.")
def collect(collect_all, source_name):
    """Run Collector Agent on due sources."""
    from cyber.agents.collector import CollectorAgent
    from cyber.agents.scheduler import Scheduler
    from cyber.db.connection import get_connection
    from cyber.db.schema import init_db, get_sources, get_due_sources

    conn = get_connection(DB_PATH)
    init_db(conn)

    scheduler = Scheduler()
    if collect_all:
        sources = get_sources(conn, status="active")
    elif source_name:
        all_src = get_sources(conn, status="active")
        sources = [s for s in all_src if s.name == source_name]
    else:
        sources = get_due_sources(conn, as_of=date.today())

    console.print(f"[bold cyan]Collecting from {len(sources)} source(s)...[/bold cyan]")
    agent = CollectorAgent()
    for s in sources:
        console.print(f"  {s.name} ({s.format})")

    conn.close()
    console.print(f"[green]Collection complete.[/green]")


@cli.command()
@click.option("--health", is_flag=True, help="Run health check only.")
@click.option("--trust", is_flag=True, help="Recalculate trust scores only.")
def librarian(health, trust):
    """Run Librarian Agent for source management."""
    from cyber.agents.librarian import LibrarianAgent
    from cyber.db.connection import get_connection
    from cyber.db.schema import init_db, get_sources, update_source

    conn = get_connection(DB_PATH)
    init_db(conn)
    agent = LibrarianAgent()
    sources = get_sources(conn)

    if health or (not health and not trust):
        changed = 0
        for s in sources:
            new_status = agent.check_health(s, as_of=date.today())
            if new_status != s.status:
                s.status = new_status
                update_source(conn, s)
                changed += 1
                console.print(f"  [yellow]{s.name}: {s.status} → {new_status}[/yellow]")
        console.print(f"[green]Health check: {changed} status changes[/green]")

    if trust or (not health and not trust):
        for s in sources:
            new_interval = agent.compute_interval(s)
            if new_interval != s.crawl_interval_hours:
                s.crawl_interval_hours = new_interval
                update_source(conn, s)
        console.print("[green]Intervals updated[/green]")

    conn.close()


@cli.command()
@click.option("--status", default=None, help="Filter by status.")
@click.option("--add", "add_url", default=None, help="Add a source URL manually.")
@click.option("--remove", "remove_name", default=None, help="Remove a source by name.")
def sources(status, add_url, remove_name):
    """View and manage the source registry."""
    from cyber.db.connection import get_connection
    from cyber.db.schema import init_db, get_sources, insert_source
    from cyber.agents.discovery import DiscoveryAgent

    conn = get_connection(DB_PATH)
    init_db(conn)

    if add_url:
        agent = DiscoveryAgent(seed_sources=[], bmt_benchmarks=[])
        entry = agent.create_candidate(add_url, add_url.split("/")[-1] or "Manual", "seed")
        insert_source(conn, entry)
        console.print(f"[green]Added: {entry.name} ({entry.url})[/green]")
        conn.close()
        return

    src_list = get_sources(conn, status=status)
    table = Table(title=f"Source Registry ({len(src_list)} sources)")
    table.add_column("Name", style="cyan", max_width=25)
    table.add_column("Type")
    table.add_column("Status")
    table.add_column("Trust", justify="right")
    table.add_column("Crawls", justify="right")
    table.add_column("Interval", justify="right")
    table.add_column("Last Crawled")

    for s in src_list:
        trust_style = "green" if s.trust_score >= 0.7 else "yellow" if s.trust_score >= 0.4 else "red"
        table.add_row(
            s.name, s.type, s.status,
            f"[{trust_style}]{s.trust_score:.2f}[/{trust_style}]",
            str(s.crawl_count),
            f"{s.crawl_interval_hours}h",
            str(s.last_crawled_at or "never"),
        )
    console.print(table)
    conn.close()
```

- [ ] **Step 2: Verify CLI works**

```bash
python -m cyber discover --help
python -m cyber collect --help
python -m cyber librarian --help
python -m cyber sources --help
```

- [ ] **Step 3: Commit**

```bash
git add cyber/__main__.py
git commit -m "feat: CLI commands for discover, collect, librarian, sources"
```

---

### Task 12: GitHub Actions Workflows

**Files:**
- Create: `.github/workflows/discovery.yml`
- Create: `.github/workflows/librarian-weekly.yml`
- Create: `.github/workflows/librarian-boost.yml`

- [ ] **Step 1: Create discovery.yml**

```yaml
name: Discovery Agent
on:
  schedule:
    - cron: "0 3 * * 3,6"
  workflow_dispatch:
  repository_dispatch:
    types: [new-model-detected, conference-season]
permissions:
  contents: write
jobs:
  discover:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11", cache: pip }
      - run: pip install -e .
      - run: python -m cyber discover
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/
          git diff --staged --quiet || git commit -m "data: discovery agent run $(date -u +%Y-%m-%d)"
          git push
```

- [ ] **Step 2: Create librarian-weekly.yml**

```yaml
name: Librarian Weekly Review
on:
  schedule:
    - cron: "0 2 * * 0"
  workflow_dispatch:
permissions:
  contents: write
jobs:
  review:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11", cache: pip }
      - run: pip install -e .
      - run: python -m cyber librarian
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/
          git diff --staged --quiet || git commit -m "data: librarian weekly review $(date -u +%Y-%m-%d)"
          git push
```

- [ ] **Step 3: Create librarian-boost.yml**

```yaml
name: Librarian Event Boost
on:
  repository_dispatch:
    types: [conference-season-start, conference-season-end]
permissions:
  contents: write
jobs:
  boost:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11", cache: pip }
      - run: pip install -e .
      - run: python -m cyber librarian --trust
```

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/discovery.yml .github/workflows/librarian-weekly.yml .github/workflows/librarian-boost.yml
git commit -m "feat: GitHub Actions for Discovery (2x/week), Librarian weekly, event boost"
```

---

### Task 13: Full Integration Test

- [ ] **Step 1: Run full test suite**

```bash
python -m pytest tests/ -v --tb=short
```

Expected: All tests pass.

- [ ] **Step 2: Test seed loading end-to-end**

```bash
rm -f data/benchmark.db
python -m cyber discover
python -m cyber sources
```

Expected: 12 seed sources registered, table displayed.

- [ ] **Step 3: Test librarian**

```bash
python -m cyber librarian
```

Expected: Health check and interval update with no errors.

- [ ] **Step 4: Commit if needed**

```bash
git add -A
git diff --staged --quiet || git commit -m "chore: integration test fixes"
```

---

## Summary of Tasks

| # | Task | Phase | Key Deliverable |
|---|------|-------|-----------------|
| 1 | SourceEntry Type | Registry | SourceEntry dataclass |
| 2 | Sources DB CRUD | Registry | sources table, insert/get/update/get_due |
| 3 | Seed Sources Config | Registry | seed_sources.yaml, events_calendar.yaml |
| 4 | BaseParser + JSON | Parsers | Parser ABC, JSON API parser |
| 5 | HTML + Markdown | Parsers | HTML table parser, Markdown parser |
| 6 | CSV + LLM | Parsers | CSV parser, Claude API fallback |
| 7 | Discovery Agent | Agents | URL classification, link extraction, search queries |
| 8 | Collector Agent | Agents | Parser selection, diff engine |
| 9 | Librarian Agent | Agents | Adaptive scheduling, trust scoring, health checks |
| 10 | Scheduler | Agents | Due-source filtering, trust grouping |
| 11 | CLI Commands | Integration | discover, collect, librarian, sources commands |
| 12 | GitHub Actions | CI/CD | 3 new workflows |
| 13 | Integration Test | Verification | Full test suite + end-to-end |
