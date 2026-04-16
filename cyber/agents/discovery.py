"""Discovery Agent — classifies URLs, generates search queries, extracts links."""

from __future__ import annotations

import re
from datetime import date
from typing import Any, Dict, List, Optional, Set
from urllib.parse import urljoin, urlparse

from cyber.models.types import SourceEntry

# Social-media and non-benchmark domains to skip during link extraction.
_SKIP_DOMAINS: Set[str] = {
    "twitter.com", "x.com", "facebook.com", "instagram.com",
    "linkedin.com", "youtube.com", "reddit.com", "tiktok.com",
    "github.com",
}

# Keywords that signal benchmark-related content.
_BENCHMARK_KEYWORDS: Set[str] = {
    "benchmark", "leaderboard", "eval", "evaluation", "score",
    "ranking", "sota", "performance", "accuracy", "mmlu", "gpqa",
    "humaneval", "arena", "elo", "llm-perf", "model-comparison",
}

# Domain → type/format mapping for well-known sites.
_DOMAIN_MAP: Dict[str, Dict[str, str]] = {
    "arxiv.org": {"type": "paper", "format": "pdf"},
    "huggingface.co": {"type": "dataset_hub", "format": "json_api"},
    "openai.com": {"type": "vendor_page", "format": "html_table"},
    "anthropic.com": {"type": "vendor_page", "format": "html_table"},
    "deepmind.google": {"type": "vendor_page", "format": "html_table"},
    "blog.google": {"type": "vendor_page", "format": "html_table"},
    "scale.com": {"type": "leaderboard", "format": "html_table"},
    "lmarena.ai": {"type": "leaderboard", "format": "json_api"},
    "livebench.ai": {"type": "leaderboard", "format": "html_table"},
    "epoch.ai": {"type": "evaluation_report", "format": "html_table"},
}

_PATH_PATTERNS: Dict[str, Dict[str, str]] = {
    "leaderboard": {"type": "leaderboard", "format": "html_table"},
    "benchmark": {"type": "leaderboard", "format": "html_table"},
    "eval": {"type": "evaluation_report", "format": "html_table"},
}

# Base search queries for discovering new benchmark sources.
_BASE_QUERIES: List[str] = [
    "LLM benchmark leaderboard {year}",
    "AI model evaluation results {year}",
    "new benchmark dataset language model {year}",
    "SOTA results NLP {year}",
]

_BENCHMARK_QUERIES: List[str] = [
    "MMLU leaderboard {year}",
    "GPQA benchmark results {year}",
    "HumanEval coding benchmark {year}",
    "MATH benchmark results {year}",
    "ARC-AGI benchmark {year}",
]


class DiscoveryAgent:
    """Discover and classify benchmark-related URLs."""

    def classify_url(self, url: str) -> Dict[str, str]:
        """Return ``{"type": ..., "format": ...}`` for the given URL."""
        parsed = urlparse(url)
        domain = parsed.netloc.replace("www.", "")

        # Check known domains first.
        if domain in _DOMAIN_MAP:
            return dict(_DOMAIN_MAP[domain])

        # Check path patterns.
        path_lower = parsed.path.lower()
        for pattern, classification in _PATH_PATTERNS.items():
            if pattern in path_lower:
                return dict(classification)

        # Fallback.
        return {"type": "unknown", "format": "html_table"}

    def is_benchmark_related(self, url: str) -> bool:
        """Heuristic check: does the URL path/query contain benchmark keywords?"""
        lower = url.lower()
        return any(kw in lower for kw in _BENCHMARK_KEYWORDS)

    def generate_search_queries(self, year: Optional[int] = None) -> List[str]:
        """Return a list of search queries for discovering benchmark sources."""
        if year is None:
            year = date.today().year
        queries: List[str] = []
        for q in _BASE_QUERIES + _BENCHMARK_QUERIES:
            queries.append(q.format(year=year))
        return queries

    def extract_links(self, html: str, base_url: str) -> List[str]:
        """Extract href links from HTML, resolve relative URLs, skip social media."""
        pattern = r'href=["\']([^"\']+)["\']'
        raw_links = re.findall(pattern, html)
        result: List[str] = []
        seen: Set[str] = set()

        for link in raw_links:
            # Resolve relative URLs.
            full = urljoin(base_url, link)
            parsed = urlparse(full)
            if parsed.scheme not in ("http", "https"):
                continue
            domain = parsed.netloc.replace("www.", "")
            if domain in _SKIP_DOMAINS:
                continue
            if full not in seen:
                seen.add(full)
                result.append(full)
        return result

    def create_candidate(
        self,
        url: str,
        name: str,
        discovered_by: str,
    ) -> SourceEntry:
        """Create a SourceEntry candidate with trust based on discovery method."""
        trust_map = {"seed": 0.9, "link_expansion": 0.6, "web_search": 0.4}
        trust = trust_map.get(discovered_by, 0.5)
        classification = self.classify_url(url)

        return SourceEntry(
            id=urlparse(url).netloc.replace("www.", "") + urlparse(url).path.rstrip("/"),
            url=url,
            name=name,
            type=classification["type"],
            format=classification["format"],
            trust_score=trust,
            status="candidate",
            discovered_by=discovered_by,
            discovered_at=date.today(),
        )
