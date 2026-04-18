"""Tests for BaseParser ABC and JsonApiParser."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

import pytest

from cyber.parsers.base import BaseParser
from cyber.parsers.json_api import JsonApiParser

FIXTURES = Path(__file__).parent / "fixtures"


class TestBaseParser:
    """BaseParser is abstract and cannot be instantiated directly."""

    def test_cannot_instantiate(self) -> None:
        with pytest.raises(TypeError):
            BaseParser()  # type: ignore[abstract]

    def test_subclass_must_implement_parse(self) -> None:
        class Incomplete(BaseParser):
            pass

        with pytest.raises(TypeError):
            Incomplete()  # type: ignore[abstract]

    def test_concrete_subclass_works(self) -> None:
        class Concrete(BaseParser):
            def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
                return []

        parser = Concrete()
        assert parser.parse("") == []


class TestJsonApiParserArray:
    """Array format: [{"model": ..., "benchmark": ..., "score": ...}]."""

    def test_parse_fixture_file(self) -> None:
        content = (FIXTURES / "sample_json_api.json").read_text()
        parser = JsonApiParser()
        results = parser.parse(content)
        assert len(results) == 2
        assert results[0]["model_id"] == "anthropic/claude-opus-4.6"
        assert results[0]["benchmark_id"] == "mmlu"
        assert results[0]["value"] == 93.2

    def test_parse_array_two_results(self) -> None:
        data = [
            {"model": "a/b", "benchmark": "x", "score": 1.0},
            {"model": "c/d", "benchmark": "y", "score": 2.0},
        ]
        parser = JsonApiParser()
        results = parser.parse(json.dumps(data))
        assert len(results) == 2

    def test_empty_array(self) -> None:
        parser = JsonApiParser()
        results = parser.parse("[]")
        assert results == []

    def test_invalid_json_returns_empty(self) -> None:
        parser = JsonApiParser()
        results = parser.parse("not valid json {{{")
        assert results == []

    def test_missing_fields_skipped(self) -> None:
        data = [{"model": "a", "benchmark": "b"}]  # no score
        parser = JsonApiParser()
        results = parser.parse(json.dumps(data))
        assert results == []


class TestJsonApiParserDict:
    """Dict format: {"model": ..., "scores": {"mmlu": 90.0, ...}}."""

    def test_parse_dict_with_scores(self) -> None:
        data = {"model": "anthropic/claude-opus-4.6", "scores": {"mmlu": 93.2, "gpqa": 91.3}}
        parser = JsonApiParser()
        results = parser.parse(json.dumps(data))
        assert len(results) == 2
        assert results[0]["model_id"] == "anthropic/claude-opus-4.6"

    def test_dict_no_model(self) -> None:
        data = {"scores": {"mmlu": 90.0}}
        parser = JsonApiParser()
        results = parser.parse(json.dumps(data))
        assert results == []

    def test_dict_no_scores(self) -> None:
        data = {"model": "x"}
        parser = JsonApiParser()
        results = parser.parse(json.dumps(data))
        assert results == []
