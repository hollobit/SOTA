"""SOTA (State-of-the-Art) tracker for benchmark scores."""

from __future__ import annotations

import copy
from dataclasses import dataclass
from typing import Dict, List, Mapping, Optional

from cyber.models.types import Benchmark, Score


@dataclass
class SOTAChange:
    type: str  # "NEW_SOTA" | "NEW_BENCHMARK" | "NEW_MODEL"
    benchmark_id: str
    new_model: str
    new_value: float
    old_model: Optional[str] = None
    old_value: Optional[float] = None


# Metric tokens that mean "lower is better." Match either an explicit
# `_lower_better` suffix or one of these substrings (case-insensitive).
# Conservative: only metrics where lower-better is unambiguous.
_LOWER_BETTER_TOKENS = (
    "rmse",
    "mae",
    "loss",
    "perplexity",
    "fvd",                    # Fréchet Video Distance
    "mean_angular_error",
    "seconds",                # latency
    "ms_latency",
    "_error_deg",
    "harm",                   # safety: lower harm = better
    "leakage_pct",
    "asr",                    # attack success rate (red-team perspective)
    "lying_rate",
    "control_rate",           # apollo eval-aware control
)


def _is_lower_better(metric: Optional[str]) -> bool:
    """Return True iff the benchmark metric should be minimized for SOTA."""
    if not metric:
        return False
    m = metric.lower()
    if m.endswith("_lower_better"):
        return True
    return any(tok in m for tok in _LOWER_BETTER_TOKENS)


class SOTATracker:
    """Tracks state-of-the-art scores across benchmarks."""

    def compute_sota(
        self,
        scores: List[Score],
        benchmarks: Optional[Mapping[str, Benchmark]] = None,
    ) -> Dict[str, Score]:
        """Find the SOTA score per benchmark.

        For higher-better metrics (default) this returns the max.
        For lower-better metrics — detected from the benchmark's `metric`
        string when `benchmarks` is provided — it returns the min.
        Without `benchmarks`, every benchmark is treated as higher-better
        (preserves the legacy behaviour).
        """
        best: Dict[str, Score] = {}
        for s in scores:
            bench = benchmarks.get(s.benchmark_id) if benchmarks else None
            lower_better = _is_lower_better(bench.metric) if bench else False
            current = best.get(s.benchmark_id)
            if current is None:
                best[s.benchmark_id] = s
            elif lower_better:
                if s.value < current.value:
                    best[s.benchmark_id] = s
            else:
                if s.value > current.value:
                    best[s.benchmark_id] = s
        return best

    def detect_changes(
        self,
        old_sota: Dict[str, Score],
        new_sota: Dict[str, Score],
    ) -> List[SOTAChange]:
        """Compare old vs new SOTA dicts, detect NEW_SOTA and NEW_BENCHMARK."""
        changes: List[SOTAChange] = []
        for bench_id, new_score in new_sota.items():
            if bench_id not in old_sota:
                changes.append(SOTAChange(
                    type="NEW_BENCHMARK",
                    benchmark_id=bench_id,
                    new_model=new_score.model_id,
                    new_value=new_score.value,
                ))
            else:
                old_score = old_sota[bench_id]
                if (new_score.model_id != old_score.model_id
                        or new_score.value != old_score.value):
                    changes.append(SOTAChange(
                        type="NEW_SOTA",
                        benchmark_id=bench_id,
                        new_model=new_score.model_id,
                        new_value=new_score.value,
                        old_model=old_score.model_id,
                        old_value=old_score.value,
                    ))
        return changes

    def mark_sota(
        self,
        scores: List[Score],
        benchmarks: Optional[Mapping[str, Benchmark]] = None,
    ) -> List[Score]:
        """Return new list with is_sota flags set correctly."""
        sota = self.compute_sota(scores, benchmarks)
        sota_keys = {
            (s.model_id, s.benchmark_id) for s in sota.values()
        }
        result = []
        for s in scores:
            new_s = copy.copy(s)
            new_s.is_sota = (s.model_id, s.benchmark_id) in sota_keys
            result.append(new_s)
        return result
