"""Tests for HtmlTableParser and MarkdownParser."""

from __future__ import annotations

from pathlib import Path

import pytest

from cyber.parsers.html_table import HtmlTableParser
from cyber.parsers.markdown_parser import MarkdownParser

FIXTURES = Path(__file__).parent / "fixtures"


class TestHtmlTableParser:
    def test_parse_fixture(self) -> None:
        content = (FIXTURES / "sample_html_table.html").read_text()
        parser = HtmlTableParser()
        results = parser.parse(content)
        # 2 models x 3 benchmarks = 6
        assert len(results) == 6

    def test_model_names(self) -> None:
        content = (FIXTURES / "sample_html_table.html").read_text()
        parser = HtmlTableParser()
        results = parser.parse(content)
        models = {r["model_id"] for r in results}
        assert "Claude Opus 4.6" in models
        assert "GPT-5.2" in models

    def test_benchmark_ids_lowercase(self) -> None:
        content = (FIXTURES / "sample_html_table.html").read_text()
        parser = HtmlTableParser()
        results = parser.parse(content)
        bench_ids = {r["benchmark_id"] for r in results}
        assert bench_ids == {"mmlu", "gpqa", "humaneval"}

    def test_no_table_returns_empty(self) -> None:
        parser = HtmlTableParser()
        results = parser.parse("<html><body><p>No table here</p></body></html>")
        assert results == []

    def test_table_without_model_col_returns_empty(self) -> None:
        parser = HtmlTableParser()
        html = "<table><tr><th>Rank</th><th>Score</th></tr><tr><td>1</td><td>99</td></tr></table>"
        results = parser.parse(html)
        assert results == []

    def test_skip_non_benchmark_columns(self) -> None:
        parser = HtmlTableParser()
        html = """<table><tr><th>Model</th><th>Rank</th><th>MMLU</th><th>License</th></tr>
        <tr><td>TestModel</td><td>1</td><td>90.5</td><td>MIT</td></tr></table>"""
        results = parser.parse(html)
        assert len(results) == 1
        assert results[0]["benchmark_id"] == "mmlu"


class TestMarkdownParser:
    def test_parse_markdown_table(self) -> None:
        md = """| Model | MMLU | GPQA |
| --- | --- | --- |
| Claude Opus 4.6 | 93.2 | 91.3 |
| GPT-5.2 | 91.8 | 92.4 |
"""
        parser = MarkdownParser()
        results = parser.parse(md)
        assert len(results) == 4  # 2 models x 2 benchmarks

    def test_model_names_extracted(self) -> None:
        md = """| Model | MMLU |
| --- | --- |
| TestModel | 85.0 |
"""
        parser = MarkdownParser()
        results = parser.parse(md)
        assert results[0]["model_id"] == "TestModel"

    def test_no_table_returns_empty(self) -> None:
        parser = MarkdownParser()
        results = parser.parse("Just some text, no table.")
        assert results == []

    def test_only_header_no_data(self) -> None:
        md = """| Model | MMLU |
| --- | --- |
"""
        parser = MarkdownParser()
        results = parser.parse(md)
        assert results == []

    def test_values_are_float(self) -> None:
        md = """| Model | Score |
| --- | --- |
| A | 95.5 |
"""
        parser = MarkdownParser()
        results = parser.parse(md)
        assert results[0]["value"] == 95.5
        assert isinstance(results[0]["value"], float)
