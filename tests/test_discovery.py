"""Tests for DiscoveryAgent."""

from __future__ import annotations

import pytest

from cyber.agents.discovery import DiscoveryAgent


@pytest.fixture
def agent() -> DiscoveryAgent:
    return DiscoveryAgent()


class TestClassifyUrl:
    def test_known_domain_arxiv(self, agent: DiscoveryAgent) -> None:
        result = agent.classify_url("https://arxiv.org/abs/2401.12345")
        assert result["type"] == "paper"
        assert result["format"] == "pdf"

    def test_known_domain_huggingface(self, agent: DiscoveryAgent) -> None:
        result = agent.classify_url("https://huggingface.co/datasets/some-ds")
        assert result["type"] == "dataset_hub"
        assert result["format"] == "json_api"

    def test_known_domain_openai(self, agent: DiscoveryAgent) -> None:
        result = agent.classify_url("https://openai.com/research")
        assert result["type"] == "vendor_page"

    def test_known_domain_anthropic(self, agent: DiscoveryAgent) -> None:
        result = agent.classify_url("https://anthropic.com/research")
        assert result["type"] == "vendor_page"

    def test_path_pattern_leaderboard(self, agent: DiscoveryAgent) -> None:
        result = agent.classify_url("https://example.com/some/leaderboard/page")
        assert result["type"] == "leaderboard"

    def test_path_pattern_benchmark(self, agent: DiscoveryAgent) -> None:
        result = agent.classify_url("https://example.com/benchmark/results")
        assert result["type"] == "leaderboard"

    def test_unknown_url(self, agent: DiscoveryAgent) -> None:
        result = agent.classify_url("https://unknown-site.com/page")
        assert result["type"] == "unknown"
        assert result["format"] == "html_table"


class TestIsBenchmarkRelated:
    def test_benchmark_keyword(self, agent: DiscoveryAgent) -> None:
        assert agent.is_benchmark_related("https://example.com/benchmark/results")

    def test_leaderboard_keyword(self, agent: DiscoveryAgent) -> None:
        assert agent.is_benchmark_related("https://example.com/leaderboard")

    def test_not_related(self, agent: DiscoveryAgent) -> None:
        assert not agent.is_benchmark_related("https://example.com/about-us")

    def test_mmlu_keyword(self, agent: DiscoveryAgent) -> None:
        assert agent.is_benchmark_related("https://example.com/mmlu-scores")


class TestGenerateSearchQueries:
    def test_returns_list(self, agent: DiscoveryAgent) -> None:
        queries = agent.generate_search_queries(2026)
        assert isinstance(queries, list)
        assert len(queries) > 0

    def test_year_in_queries(self, agent: DiscoveryAgent) -> None:
        queries = agent.generate_search_queries(2026)
        for q in queries:
            assert "2026" in q

    def test_base_and_benchmark_queries(self, agent: DiscoveryAgent) -> None:
        queries = agent.generate_search_queries(2026)
        assert len(queries) >= 9  # 4 base + 5 benchmark


class TestExtractLinks:
    def test_basic_extraction(self, agent: DiscoveryAgent) -> None:
        html = '<a href="https://example.com/page">Link</a>'
        links = agent.extract_links(html, "https://base.com")
        assert "https://example.com/page" in links

    def test_relative_url_resolved(self, agent: DiscoveryAgent) -> None:
        html = '<a href="/path/page">Link</a>'
        links = agent.extract_links(html, "https://base.com")
        assert "https://base.com/path/page" in links

    def test_skip_social_media(self, agent: DiscoveryAgent) -> None:
        html = '<a href="https://twitter.com/user">T</a><a href="https://example.com">E</a>'
        links = agent.extract_links(html, "https://base.com")
        assert len(links) == 1
        assert "twitter.com" not in links[0]

    def test_dedup(self, agent: DiscoveryAgent) -> None:
        html = '<a href="https://a.com">1</a><a href="https://a.com">2</a>'
        links = agent.extract_links(html, "https://base.com")
        assert len(links) == 1


class TestCreateCandidate:
    def test_seed_trust(self, agent: DiscoveryAgent) -> None:
        entry = agent.create_candidate("https://example.com", "Ex", "seed")
        assert entry.trust_score == 0.9

    def test_link_trust(self, agent: DiscoveryAgent) -> None:
        entry = agent.create_candidate("https://example.com", "Ex", "link_expansion")
        assert entry.trust_score == 0.6

    def test_search_trust(self, agent: DiscoveryAgent) -> None:
        entry = agent.create_candidate("https://example.com", "Ex", "web_search")
        assert entry.trust_score == 0.4

    def test_candidate_status(self, agent: DiscoveryAgent) -> None:
        entry = agent.create_candidate("https://example.com", "Ex", "seed")
        assert entry.status == "candidate"
