"""Core data types for the LLM Benchmark SOTA Dashboard."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Any


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
