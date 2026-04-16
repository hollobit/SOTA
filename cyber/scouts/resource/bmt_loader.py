"""BMT (Benchmark Library) loader — imports benchmark dataset catalog into the system.

Reads the BMT benchmark-library JSON and registers each dataset as a Benchmark
entry in the database, enriching it with metadata (paper links, authors, specs).
Also creates a mapping file for connecting benchmark IDs used in model scores
to their corresponding BMT dataset entries.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

from cyber.models.types import Benchmark


# Known mappings from common benchmark IDs (used in scores) to BMT titles
# This is the bridge between "mmlu" in a score record and "MMLU" in the BMT catalog
_KNOWN_MAPPINGS: Dict[str, List[str]] = {
    "mmlu": ["MMLU", "Measuring Massive Multitask Language Understanding"],
    "mmlu_pro": ["MMLU-Pro"],
    "gpqa": ["GPQA", "GPQA Diamond"],
    "humaneval": ["HumanEval"],
    "math": ["MATH"],
    "gsm8k": ["GSM8K", "GSM-8K"],
    "mmmu": ["MMMU"],
    "swe_bench": ["SWE-bench", "SWE-Bench"],
    "truthfulqa": ["TruthfulQA"],
    "ifeval": ["IFEval"],
    "aime": ["AIME"],
    "hellaswag": ["HellaSwag"],
    "arc": ["ARC", "AI2 Reasoning Challenge"],
    "winogrande": ["WinoGrande"],
    "bbh": ["BBH", "BIG-Bench Hard"],
    "mbpp": ["MBPP"],
    "medqa": ["MedQA"],
    "pubmedqa": ["PubMedQA"],
    "medmcqa": ["MedMCQA"],
    "mathvista": ["MathVista"],
    "docvqa": ["DocVQA"],
    "mt_bench": ["MT-Bench"],
    "alpaca_eval": ["AlpacaEval"],
    "livecodebench": ["LiveCodeBench"],
    "chatbot-arena-elo": ["Chatbot Arena", "LMSYS Chatbot Arena"],
    "webarena": ["WebArena"],
    "gaia": ["GAIA"],
}


class BMTLoader:
    """Loads BMT benchmark library and creates connections to the scoring system."""

    def __init__(self, bmt_path: str):
        self._path = Path(bmt_path)
        self._entries: List[Dict[str, Any]] = []
        self._title_index: Dict[str, Dict[str, Any]] = {}

    def load(self) -> int:
        """Load BMT JSON file. Returns number of entries loaded."""
        with open(self._path) as f:
            self._entries = json.load(f)
        # Build title index for fast lookup (lowercased)
        self._title_index = {}
        for entry in self._entries:
            key = entry["title"].lower().strip()
            self._title_index[key] = entry
        return len(self._entries)

    @property
    def entries(self) -> List[Dict[str, Any]]:
        return self._entries

    def find_by_title(self, title: str) -> Optional[Dict[str, Any]]:
        """Find a BMT entry by exact or fuzzy title match."""
        key = title.lower().strip()
        # Exact match
        if key in self._title_index:
            return self._title_index[key]
        # Substring match
        for k, v in self._title_index.items():
            if key in k or k in key:
                return v
        return None

    def match_benchmark_id(self, benchmark_id: str) -> Optional[Dict[str, Any]]:
        """Try to find a BMT entry matching a benchmark_id from our scoring system."""
        # Check known mappings
        titles = _KNOWN_MAPPINGS.get(benchmark_id.lower(), [])
        for title in titles:
            entry = self.find_by_title(title)
            if entry:
                return entry
        # Try direct title match
        return self.find_by_title(benchmark_id)

    def to_benchmarks(self) -> List[Benchmark]:
        """Convert BMT entries to Benchmark dataclass instances."""
        benchmarks = []
        for entry in self._entries:
            bench_id = self._title_to_id(entry["title"])
            category = self._infer_category(entry)
            benchmarks.append(Benchmark(
                id=bench_id,
                name=entry["title"],
                category=category,
                description=entry.get("description", ""),
                metric="varies",
            ))
        return benchmarks

    def build_connection_map(self) -> Dict[str, Dict[str, Any]]:
        """Build a mapping from score benchmark_ids to BMT metadata.

        Returns dict like:
        {
            "mmlu": {
                "bmt_id": "csv-123",
                "bmt_title": "MMLU",
                "paper_link": "https://...",
                "github_link": "https://...",
                "item_count": "...",
                "specs": "...",
                "description": "...",
                "authors": [...],
                "year": "2023"
            },
            ...
        }
        """
        connections = {}
        for bench_id, titles in _KNOWN_MAPPINGS.items():
            for title in titles:
                entry = self.find_by_title(title)
                if entry:
                    connections[bench_id] = {
                        "bmt_id": entry.get("id", ""),
                        "bmt_title": entry["title"],
                        "paper_link": entry.get("paperLink", ""),
                        "github_link": entry.get("githubLink", ""),
                        "item_count": entry.get("itemCount", ""),
                        "specs": entry.get("specs", ""),
                        "description": entry.get("description", ""),
                        "authors": entry.get("authors", []),
                        "year": entry.get("year", ""),
                    }
                    break
        return connections

    def _title_to_id(self, title: str) -> str:
        """Convert a BMT title to a benchmark ID."""
        # "MedQA (USMLE)" -> "medqa_usmle"
        cleaned = re.sub(r"[^\w\s]", " ", title.lower())
        cleaned = re.sub(r"\s+", "_", cleaned.strip())
        return cleaned[:64]  # Cap length

    def _infer_category(self, entry: Dict[str, Any]) -> str:
        """Infer benchmark category from title/description/specs."""
        text = (entry.get("title", "") + " " +
                entry.get("description", "") + " " +
                entry.get("specs", "")).lower()

        if any(w in text for w in ["medical", "clinical", "health", "biomedical", "radiology"]):
            return "medical"
        if any(w in text for w in ["code", "programming", "software", "coding"]):
            return "coding"
        if any(w in text for w in ["math", "arithmetic", "algebra", "geometry"]):
            return "math"
        if any(w in text for w in ["image", "vision", "visual", "video", "multimodal"]):
            return "multimodal"
        if any(w in text for w in ["safety", "toxic", "bias", "red team", "harmful"]):
            return "safety"
        if any(w in text for w in ["speech", "audio", "asr", "tts"]):
            return "audio"
        if any(w in text for w in ["robot", "embodied", "navigation"]):
            return "robotics"
        if any(w in text for w in ["reasoning", "logic", "commonsense", "multitask", "understanding"]):
            return "reasoning"
        if any(w in text for w in ["question answering", "reading comprehension"]):
            return "qa"
        if any(w in text for w in ["translation", "multilingual"]):
            return "multilingual"
        return "other"
