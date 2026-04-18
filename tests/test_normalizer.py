"""Tests for the Normalizer class."""

from cyber.analyst.normalizer import Normalizer


class TestNormalizeModel:
    def test_exact_match(self):
        n = Normalizer(aliases={"gpt-4o": "GPT-4o"})
        assert n.normalize_model("gpt-4o") == "GPT-4o"

    def test_case_insensitive(self):
        n = Normalizer(aliases={"gpt-4o": "GPT-4o"})
        assert n.normalize_model("GPT-4O") == "GPT-4o"

    def test_unknown_passthrough(self):
        n = Normalizer(aliases={"gpt-4o": "GPT-4o"})
        assert n.normalize_model("unknown-model") == "unknown-model"

    def test_whitespace_handling(self):
        n = Normalizer(aliases={"gpt-4o": "GPT-4o"})
        assert n.normalize_model("  gpt-4o  ") == "GPT-4o"


class TestNormalizeBenchmark:
    def test_known_benchmark(self):
        n = Normalizer(benchmark_aliases={"mmlu": "MMLU"})
        assert n.normalize_benchmark("mmlu") == "MMLU"

    def test_variant(self):
        n = Normalizer(benchmark_aliases={"mmlu-pro": "MMLU-Pro"})
        assert n.normalize_benchmark("MMLU-PRO") == "MMLU-Pro"

    def test_unknown_benchmark_lowercase(self):
        n = Normalizer()
        assert n.normalize_benchmark("  SomeBench  ") == "somebench"


class TestNormalizeNotes:
    def test_n_shot(self):
        n = Normalizer()
        assert n.normalize_notes("5 shot, chain-of-thought") == "5-shot, CoT"

    def test_zero_shot(self):
        n = Normalizer()
        assert n.normalize_notes("zero shot") == "0-shot"

    def test_chain_of_thought_only(self):
        n = Normalizer()
        assert n.normalize_notes("chain-of-thought prompting") == "CoT prompting"


class TestAddAlias:
    def test_add_alias(self):
        n = Normalizer()
        assert n.normalize_model("gpt4o") == "gpt4o"
        n.add_alias("gpt4o", "GPT-4o")
        assert n.normalize_model("gpt4o") == "GPT-4o"

    def test_add_alias_case_insensitive(self):
        n = Normalizer()
        n.add_alias("GPT4O", "GPT-4o")
        assert n.normalize_model("gpt4o") == "GPT-4o"
