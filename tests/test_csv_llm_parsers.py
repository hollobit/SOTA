"""Tests for CsvParser and LlmParser."""

from __future__ import annotations

import pytest

from cyber.parsers.csv_parser import CsvParser
from cyber.parsers.llm_parser import LlmParser


class TestCsvParser:
    def test_parse_two_rows(self) -> None:
        csv_data = "model,benchmark,score\na/b,mmlu,93.2\nc/d,gpqa,91.8\n"
        parser = CsvParser()
        results = parser.parse(csv_data)
        assert len(results) == 2
        assert results[0]["model_id"] == "a/b"
        assert results[0]["value"] == 93.2

    def test_empty_csv(self) -> None:
        parser = CsvParser()
        results = parser.parse("")
        assert results == []

    def test_header_only(self) -> None:
        parser = CsvParser()
        results = parser.parse("model,benchmark,score\n")
        assert results == []

    def test_missing_columns(self) -> None:
        parser = CsvParser()
        results = parser.parse("col_a,col_b\n1,2\n")
        assert results == []

    def test_case_insensitive_headers(self) -> None:
        csv_data = "Model,Benchmark,Score\nX,Y,99.0\n"
        parser = CsvParser()
        results = parser.parse(csv_data)
        assert len(results) == 1

    def test_invalid_score_skipped(self) -> None:
        csv_data = "model,benchmark,score\na,b,not_a_number\n"
        parser = CsvParser()
        results = parser.parse(csv_data)
        assert results == []

    def test_alternate_column_names(self) -> None:
        csv_data = "model_id,benchmark_id,value\nX,Y,88.0\n"
        parser = CsvParser()
        results = parser.parse(csv_data)
        assert len(results) == 1


class TestLlmParser:
    def test_init_stores_key(self) -> None:
        parser = LlmParser(api_key="sk-test-123")
        assert parser.api_key == "sk-test-123"

    def test_no_key_returns_empty(self) -> None:
        parser = LlmParser(api_key=None)
        results = parser.parse("some content")
        assert results == []

    def test_empty_string_key_returns_empty(self) -> None:
        parser = LlmParser(api_key="")
        results = parser.parse("some content")
        assert results == []

    def test_default_model(self) -> None:
        parser = LlmParser()
        assert "claude" in parser.model.lower()

    def test_custom_model(self) -> None:
        parser = LlmParser(api_key="k", model="custom-model")
        assert parser.model == "custom-model"
