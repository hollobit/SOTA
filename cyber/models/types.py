"""Core data types for the LLM Benchmark SOTA Dashboard."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Literal


@dataclass
class Source:
    """Reference to a data source."""

    type: Literal["web", "pdf", "api", "manual"]
    url: str
    date: str  # ISO date string
    citation: str


@dataclass
class Model:
    """An LLM model entry."""

    id: str
    vendor: str
    name: str
    version: str
    type: Literal["base", "chat", "instruct", "reasoning", "multimodal"]
    modalities: list[str] = field(default_factory=lambda: ["text"])
    parameters: str | None = None  # e.g. "70B", "unknown"
    release_date: str | None = None  # ISO date string


@dataclass
class Benchmark:
    """A benchmark definition."""

    id: str
    name: str
    category: str
    description: str
    metric: str  # e.g. "accuracy", "pass@1"


@dataclass
class Score:
    """A model's score on a benchmark."""

    model_id: str
    benchmark_id: str
    value: float
    unit: str  # e.g. "%", "elo"
    source: Source
    is_sota: bool = False
    collected_at: str = field(default_factory=lambda: datetime.now(UTC).isoformat())
    notes: str = ""


@dataclass
class LeaderboardRanking:
    """A model's ranking on a leaderboard snapshot."""

    leaderboard: str
    model_id: str
    rank: int
    score: float
    metric: str
    snapshot_date: str  # ISO date string
    source_url: str


@dataclass
class RawRecord:
    """Raw data collected by a scout before normalization."""

    scout_name: str
    source_url: str
    raw_data: dict
    collected_at: str = field(default_factory=lambda: datetime.now(UTC).isoformat())
