"""Tests for resource folder scout."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import List
from unittest.mock import AsyncMock, patch

import pytest

from cyber.models.types import RawRecord, Score
from cyber.scouts.resource.scanner import ResourceScout


@pytest.fixture
def resource_dir(tmp_path):
    """Create a temporary resource directory with sample files."""
    return tmp_path / "resource"


@pytest.fixture
def scout(resource_dir):
    return ResourceScout(resource_dir=str(resource_dir))


class TestResourceScoutName:
    def test_name(self, scout):
        assert scout.name == "resource-scout"


class TestResourceScoutDiscover:
    def test_discover_empty_dir(self, scout, resource_dir):
        """Discover returns empty list if resource dir is empty or missing."""
        import asyncio
        records = asyncio.run(scout.discover())
        assert records == []

    def test_discover_finds_md_files(self, scout, resource_dir):
        """Discover finds Markdown files."""
        import asyncio
        resource_dir.mkdir(parents=True, exist_ok=True)
        (resource_dir / "model_card.md").write_text("# Test\n| MMLU | 90.0 |")
        records = asyncio.run(scout.discover())
        assert len(records) == 1
        assert records[0].scout_name == "resource-scout"
        assert "model_card.md" in records[0].source_url

    def test_discover_finds_txt_files(self, scout, resource_dir):
        """Discover finds .txt files."""
        import asyncio
        resource_dir.mkdir(parents=True, exist_ok=True)
        (resource_dir / "results.txt").write_text("MMLU: 90.0\nGPQA: 65.0")
        records = asyncio.run(scout.discover())
        assert len(records) == 1

    def test_discover_finds_json_files(self, scout, resource_dir):
        """Discover finds .json files."""
        import asyncio
        resource_dir.mkdir(parents=True, exist_ok=True)
        data = [{"model": "test/m", "benchmark": "mmlu", "score": 88.0}]
        (resource_dir / "scores.json").write_text(json.dumps(data))
        records = asyncio.run(scout.discover())
        assert len(records) == 1

    def test_discover_finds_csv_files(self, scout, resource_dir):
        """Discover finds .csv files."""
        import asyncio
        resource_dir.mkdir(parents=True, exist_ok=True)
        (resource_dir / "data.csv").write_text("model,benchmark,score\ntest/m,mmlu,88.0")
        records = asyncio.run(scout.discover())
        assert len(records) == 1

    def test_discover_skips_processed_files(self, scout, resource_dir):
        """Discover skips files already in .processed manifest."""
        import asyncio
        resource_dir.mkdir(parents=True, exist_ok=True)
        (resource_dir / "old.md").write_text("# old")
        (resource_dir / ".processed").write_text("old.md\n")
        records = asyncio.run(scout.discover())
        assert len(records) == 0

    def test_discover_ignores_dotfiles(self, scout, resource_dir):
        """Discover ignores hidden files like .processed."""
        import asyncio
        resource_dir.mkdir(parents=True, exist_ok=True)
        (resource_dir / ".processed").write_text("something")
        (resource_dir / ".hidden").write_text("hidden")
        records = asyncio.run(scout.discover())
        assert len(records) == 0

    def test_discover_finds_pdf_extension(self, scout, resource_dir):
        """Discover includes .pdf files in the list."""
        import asyncio
        resource_dir.mkdir(parents=True, exist_ok=True)
        (resource_dir / "paper.pdf").write_bytes(b"%PDF-fake")
        records = asyncio.run(scout.discover())
        assert len(records) == 1
        assert records[0].raw_data["file_type"] == "pdf"


class TestResourceScoutParseMarkdown:
    def test_parse_markdown_table(self, scout):
        """Parse extracts scores from a markdown table."""
        content = "| Benchmark | Score |\n|---|---|\n| MMLU | 89.2 |\n| GPQA | 63.1 |"
        raw = RawRecord(
            scout_name="resource-scout",
            source_url="resource/card.md",
            raw_data={"content": content, "filename": "card.md", "file_type": "md"},
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert len(scores) >= 2
        mmlu = [s for s in scores if "mmlu" in s.benchmark_id.lower()]
        assert len(mmlu) == 1
        assert mmlu[0].value == 89.2


class TestResourceScoutParseJSON:
    def test_parse_json_array(self, scout):
        """Parse extracts scores from JSON array format."""
        data = [
            {"model": "vendor/model-x", "benchmark": "mmlu", "score": 91.0},
            {"model": "vendor/model-x", "benchmark": "gpqa", "score": 70.0},
        ]
        raw = RawRecord(
            scout_name="resource-scout",
            source_url="resource/scores.json",
            raw_data={"content": json.dumps(data), "filename": "scores.json", "file_type": "json"},
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert len(scores) == 2
        assert scores[0].model_id == "vendor/model-x"
        assert scores[0].value == 91.0

    def test_parse_json_dict_with_scores(self, scout):
        """Parse handles JSON dict with model+scores structure."""
        data = {
            "model": "vendor/model-y",
            "scores": {"mmlu": 88.5, "gpqa": 62.0}
        }
        raw = RawRecord(
            scout_name="resource-scout",
            source_url="resource/data.json",
            raw_data={"content": json.dumps(data), "filename": "data.json", "file_type": "json"},
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert len(scores) == 2


class TestResourceScoutParseCSV:
    def test_parse_csv(self, scout):
        """Parse extracts scores from CSV format."""
        content = "model,benchmark,score\nvendor/m,mmlu,90.0\nvendor/m,gpqa,65.0"
        raw = RawRecord(
            scout_name="resource-scout",
            source_url="resource/data.csv",
            raw_data={"content": content, "filename": "data.csv", "file_type": "csv"},
            collected_at=date(2026, 4, 16),
        )
        scores = scout.parse(raw)
        assert len(scores) == 2
        assert scores[0].value == 90.0


class TestResourceScoutMarkProcessed:
    def test_mark_processed(self, scout, resource_dir):
        """mark_processed adds filename to .processed manifest."""
        resource_dir.mkdir(parents=True, exist_ok=True)
        scout.mark_processed("card.md")
        manifest = (resource_dir / ".processed").read_text()
        assert "card.md" in manifest

    def test_mark_processed_appends(self, scout, resource_dir):
        """mark_processed appends without overwriting."""
        resource_dir.mkdir(parents=True, exist_ok=True)
        (resource_dir / ".processed").write_text("old.md\n")
        scout.mark_processed("new.md")
        manifest = (resource_dir / ".processed").read_text()
        assert "old.md" in manifest
        assert "new.md" in manifest
