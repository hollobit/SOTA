"""SOTA (State-of-the-Art) tracker for benchmark scores."""

from __future__ import annotations

import copy
from dataclasses import dataclass
from typing import Dict, List, Optional

from cyber.models.types import Score


@dataclass
class SOTAChange:
    type: str  # "NEW_SOTA" | "NEW_BENCHMARK" | "NEW_MODEL"
    benchmark_id: str
    new_model: str
    new_value: float
    old_model: Optional[str] = None
    old_value: Optional[float] = None


class SOTATracker:
    """Tracks state-of-the-art scores across benchmarks."""

    def compute_sota(self, scores: List[Score]) -> Dict[str, Score]:
        """Find highest score per benchmark."""
        best: Dict[str, Score] = {}
        for s in scores:
            if s.benchmark_id not in best or s.value > best[s.benchmark_id].value:
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

    def mark_sota(self, scores: List[Score]) -> List[Score]:
        """Return new list with is_sota flags set correctly."""
        sota = self.compute_sota(scores)
        sota_keys = {
            (s.model_id, s.benchmark_id) for s in sota.values()
        }
        result = []
        for s in scores:
            new_s = copy.copy(s)
            new_s.is_sota = (s.model_id, s.benchmark_id) in sota_keys
            result.append(new_s)
        return result
