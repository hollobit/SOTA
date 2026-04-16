"""Tests for BMT (Benchmark Library) loader."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from cyber.scouts.resource.bmt_loader import BMTLoader


@pytest.fixture
def sample_bmt(tmp_path):
    """Create a small BMT JSON file for testing."""
    data = [
        {
            "id": "csv-1",
            "title": "MMLU",
            "source": "arXiv",
            "authors": ["Dan Hendrycks"],
            "year": "2021",
            "paperLink": "https://arxiv.org/abs/2009.03300",
            "githubLink": "https://github.com/hendrycks/test",
            "itemCount": "15,908 questions",
            "specs": "Text (MCQ), 57 subjects",
            "description": "Massive Multitask Language Understanding benchmark."
        },
        {
            "id": "csv-2",
            "title": "HumanEval",
            "source": "arXiv",
            "authors": ["Mark Chen"],
            "year": "2021",
            "paperLink": "https://arxiv.org/abs/2107.03374",
            "githubLink": "https://github.com/openai/human-eval",
            "itemCount": "164 problems",
            "specs": "Code generation, Python",
            "description": "Code generation benchmark with functional correctness."
        },
        {
            "id": "csv-3",
            "title": "MedQA (USMLE)",
            "source": "arXiv",
            "authors": ["Di Jin"],
            "year": "2020",
            "paperLink": "https://arxiv.org/abs/2009.13081",
            "githubLink": "https://github.com/jind11/MedQA",
            "itemCount": "12,723 questions",
            "specs": "Text (QA), Multiple Choice",
            "description": "Medical board exam questions."
        },
        {
            "id": "csv-4",
            "title": "TruthfulQA",
            "source": "arXiv",
            "authors": ["Stephanie Lin"],
            "year": "2022",
            "paperLink": "https://arxiv.org/abs/2109.07958",
            "githubLink": "",
            "itemCount": "817 questions",
            "specs": "Text (QA), Truthfulness assessment",
            "description": "Measures whether language models generate truthful answers to safety-relevant questions."
        },
    ]
    path = tmp_path / "benchmark-library.json"
    path.write_text(json.dumps(data))
    return str(path)


class TestBMTLoaderLoad:
    def test_load_returns_count(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        count = loader.load()
        assert count == 4

    def test_entries_accessible(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        assert len(loader.entries) == 4
        assert loader.entries[0]["title"] == "MMLU"


class TestBMTLoaderFind:
    def test_find_exact(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        result = loader.find_by_title("MMLU")
        assert result is not None
        assert result["id"] == "csv-1"

    def test_find_case_insensitive(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        result = loader.find_by_title("mmlu")
        assert result is not None

    def test_find_substring(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        result = loader.find_by_title("MedQA")
        assert result is not None
        assert result["title"] == "MedQA (USMLE)"

    def test_find_not_found(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        result = loader.find_by_title("NonexistentBenchmark")
        assert result is None


class TestBMTLoaderMatchBenchmarkId:
    def test_match_known_id(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        result = loader.match_benchmark_id("mmlu")
        assert result is not None
        assert result["title"] == "MMLU"

    def test_match_humaneval(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        result = loader.match_benchmark_id("humaneval")
        assert result is not None
        assert result["title"] == "HumanEval"

    def test_match_truthfulqa(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        result = loader.match_benchmark_id("truthfulqa")
        assert result is not None
        assert result["title"] == "TruthfulQA"

    def test_match_unknown_returns_none(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        result = loader.match_benchmark_id("totally_unknown_bench")
        assert result is None


class TestBMTLoaderToBenchmarks:
    def test_converts_to_benchmark_objects(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        benchmarks = loader.to_benchmarks()
        assert len(benchmarks) == 4
        assert benchmarks[0].name == "MMLU"
        assert benchmarks[0].category == "reasoning"

    def test_humaneval_category_is_coding(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        benchmarks = loader.to_benchmarks()
        humaneval = [b for b in benchmarks if b.name == "HumanEval"][0]
        assert humaneval.category == "coding"

    def test_medqa_category_is_medical(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        benchmarks = loader.to_benchmarks()
        medqa = [b for b in benchmarks if "MedQA" in b.name][0]
        assert medqa.category == "medical"

    def test_truthfulqa_category_is_safety(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        benchmarks = loader.to_benchmarks()
        tqa = [b for b in benchmarks if b.name == "TruthfulQA"][0]
        assert tqa.category == "safety"


class TestBMTLoaderConnectionMap:
    def test_builds_connections(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        connections = loader.build_connection_map()
        assert "mmlu" in connections
        assert connections["mmlu"]["bmt_title"] == "MMLU"
        assert connections["mmlu"]["paper_link"] == "https://arxiv.org/abs/2009.03300"

    def test_connections_include_metadata(self, sample_bmt):
        loader = BMTLoader(sample_bmt)
        loader.load()
        connections = loader.build_connection_map()
        mmlu = connections["mmlu"]
        assert "authors" in mmlu
        assert "year" in mmlu
        assert "item_count" in mmlu
        assert "description" in mmlu
