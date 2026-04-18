"""Tests for CollectorAgent."""

from __future__ import annotations

import pytest

from cyber.agents.collector import CollectorAgent, DiffResult, TOP_MODELS_LIMIT


@pytest.fixture
def agent() -> CollectorAgent:
    return CollectorAgent()


class TestSelectParser:
    def test_json_api(self, agent: CollectorAgent) -> None:
        parser = agent.select_parser("json_api")
        assert parser is not None
        assert type(parser).__name__ == "JsonApiParser"

    def test_html_table(self, agent: CollectorAgent) -> None:
        parser = agent.select_parser("html_table")
        assert parser is not None
        assert type(parser).__name__ == "HtmlTableParser"

    def test_markdown(self, agent: CollectorAgent) -> None:
        parser = agent.select_parser("markdown")
        assert parser is not None
        assert type(parser).__name__ == "MarkdownParser"

    def test_csv(self, agent: CollectorAgent) -> None:
        parser = agent.select_parser("csv")
        assert parser is not None
        assert type(parser).__name__ == "CsvParser"

    def test_unknown_format(self, agent: CollectorAgent) -> None:
        parser = agent.select_parser("pdf")
        assert parser is None


class TestComputeDiff:
    def test_all_new(self, agent: CollectorAgent) -> None:
        new = [{"model_id": "a", "benchmark_id": "b", "value": 90.0}]
        diff = agent.compute_diff(new, [])
        assert len(diff.new_scores) == 1
        assert diff.unchanged == 0
        assert len(diff.updated) == 0

    def test_updated(self, agent: CollectorAgent) -> None:
        old = [{"model_id": "a", "benchmark_id": "b", "value": 90.0}]
        new = [{"model_id": "a", "benchmark_id": "b", "value": 95.0}]
        diff = agent.compute_diff(new, old)
        assert len(diff.updated) == 1
        assert len(diff.new_scores) == 0

    def test_unchanged(self, agent: CollectorAgent) -> None:
        data = [{"model_id": "a", "benchmark_id": "b", "value": 90.0}]
        diff = agent.compute_diff(data, data)
        assert diff.unchanged == 1
        assert len(diff.new_scores) == 0
        assert len(diff.updated) == 0

    def test_disappeared(self, agent: CollectorAgent) -> None:
        old = [{"model_id": "a", "benchmark_id": "b", "value": 90.0}]
        diff = agent.compute_diff([], old)
        assert len(diff.disappeared) == 1

    def test_mixed(self, agent: CollectorAgent) -> None:
        old = [
            {"model_id": "a", "benchmark_id": "x", "value": 90.0},
            {"model_id": "b", "benchmark_id": "x", "value": 80.0},
        ]
        new = [
            {"model_id": "a", "benchmark_id": "x", "value": 90.0},  # unchanged
            {"model_id": "c", "benchmark_id": "x", "value": 70.0},  # new
        ]
        diff = agent.compute_diff(new, old)
        assert diff.unchanged == 1
        assert len(diff.new_scores) == 1
        assert len(diff.disappeared) == 1


class TestFilterTopModels:
    def test_within_limit(self, agent: CollectorAgent) -> None:
        scores = [{"model_id": f"m{i}", "benchmark_id": "b", "value": float(i)} for i in range(5)]
        result = agent.filter_top_models(scores, limit=10)
        assert len(result) == 5

    def test_exceeds_limit(self, agent: CollectorAgent) -> None:
        scores = [{"model_id": f"m{i}", "benchmark_id": "b", "value": float(i)} for i in range(50)]
        result = agent.filter_top_models(scores, limit=TOP_MODELS_LIMIT)
        assert len(result) == TOP_MODELS_LIMIT

    def test_top_values_kept(self, agent: CollectorAgent) -> None:
        scores = [
            {"model_id": "low", "benchmark_id": "b", "value": 10.0},
            {"model_id": "high", "benchmark_id": "b", "value": 99.0},
            {"model_id": "mid", "benchmark_id": "b", "value": 50.0},
        ]
        result = agent.filter_top_models(scores, limit=2)
        model_ids = [r["model_id"] for r in result]
        assert "high" in model_ids
        assert "mid" in model_ids
        assert "low" not in model_ids

    def test_multiple_benchmarks(self, agent: CollectorAgent) -> None:
        scores = [
            {"model_id": "a", "benchmark_id": "x", "value": 90.0},
            {"model_id": "b", "benchmark_id": "x", "value": 80.0},
            {"model_id": "a", "benchmark_id": "y", "value": 70.0},
        ]
        result = agent.filter_top_models(scores, limit=1)
        assert len(result) == 2  # top 1 from each benchmark


class TestDiffResult:
    def test_dataclass_fields(self) -> None:
        d = DiffResult()
        assert d.new_scores == []
        assert d.updated == []
        assert d.disappeared == []
        assert d.unchanged == 0
