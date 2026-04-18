"""Core data types for the LLM Benchmark SOTA Dashboard."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Any, List, Optional


@dataclass
class Source:
    type: str  # "vendor" | "paper" | "leaderboard" | "safety" | "release"
    url: str
    date: str
    citation: str | None = None


@dataclass
class Model:
    id: str
    vendor: str
    name: str
    version: str
    type: str  # "proprietary" | "open-weight" | "open-source"
    modalities: list[str] = field(default_factory=list)
    parameters: str | None = None
    release_date: str | None = None


@dataclass
class Benchmark:
    id: str
    name: str
    category: str  # "reasoning" | "coding" | "safety" | "multimodal" | "agent" | ...
    description: str
    metric: str  # "accuracy" | "pass@1" | "elo" | "score" | ...


@dataclass
class Score:
    model_id: str
    benchmark_id: str
    value: float
    unit: str
    source: Source
    is_sota: bool
    collected_at: date
    notes: str = ""


@dataclass
class LeaderboardRanking:
    leaderboard: str
    model_id: str
    rank: int
    score: float
    metric: str
    snapshot_date: date
    source_url: str


@dataclass
class RawRecord:
    scout_name: str
    source_url: str
    raw_data: dict[str, Any]
    collected_at: date


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
    last_crawled_at: Optional[date] = None
    last_changed_at: Optional[date] = None
    crawl_count: int = 0
    change_count: int = 0
    fail_count: int = 0
    crawl_interval_hours: int = 24
    benchmarks: List[Any] = field(default_factory=list)
    models_count: int = 0
    notes: str = ""
