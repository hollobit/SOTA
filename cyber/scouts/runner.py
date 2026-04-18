"""Parallel scout executor."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from typing import List

from cyber.models.types import Score
from cyber.scouts.base import BaseScout


@dataclass
class ScoutResults:
    """Aggregated results from running multiple scouts."""

    scores: List[Score] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)


async def _run_single_scout(scout: BaseScout) -> ScoutResults:
    """Run a single scout, catching any exceptions."""
    results = ScoutResults()
    try:
        raw_records = await scout.discover()
        for raw in raw_records:
            parsed = scout.parse(raw)
            results.scores.extend(parsed)
    except Exception as exc:
        results.errors.append(f"[{scout.name}] {type(exc).__name__}: {exc}")
    return results


async def run_scouts(scouts: List[BaseScout]) -> ScoutResults:
    """Run all scouts in parallel, isolating failures.

    One scout failing does not prevent others from completing.
    """
    if not scouts:
        return ScoutResults()

    tasks = [_run_single_scout(scout) for scout in scouts]
    individual_results = await asyncio.gather(*tasks)

    combined = ScoutResults()
    for result in individual_results:
        combined.scores.extend(result.scores)
        combined.errors.extend(result.errors)
    return combined
