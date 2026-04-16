"""Validator for anomaly detection in benchmark scores."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional, Tuple


@dataclass
class ValidationResult:
    is_valid: bool
    anomaly: Optional[str] = None
    message: str = ""


class Validator:
    """Validates benchmark scores and detects anomalies."""

    def __init__(
        self,
        benchmark_ranges: Optional[Dict[str, Tuple[float, float]]] = None,
    ) -> None:
        self._ranges: Dict[str, Tuple[float, float]] = benchmark_ranges or {}

    def validate(
        self,
        benchmark_id: str,
        value: float,
        previous_value: Optional[float] = None,
    ) -> ValidationResult:
        """Validate a score value against known ranges and previous values.

        Checks (in order):
        - negative: value < 0
        - below_range: value below benchmark min
        - above_range: value above benchmark max
        - large_drop: >30% drop from previous value
        """
        # Check negative
        if value < 0:
            return ValidationResult(
                is_valid=False,
                anomaly="negative",
                message=f"Negative score: {value}",
            )

        # Check range if benchmark is known
        if benchmark_id in self._ranges:
            lo, hi = self._ranges[benchmark_id]
            if value < lo:
                return ValidationResult(
                    is_valid=False,
                    anomaly="below_range",
                    message=f"Score {value} below range [{lo}, {hi}] for {benchmark_id}",
                )
            if value > hi:
                return ValidationResult(
                    is_valid=False,
                    anomaly="above_range",
                    message=f"Score {value} above range [{lo}, {hi}] for {benchmark_id}",
                )

        # Check large drop from previous
        if previous_value is not None and previous_value > 0:
            drop_pct = (previous_value - value) / previous_value
            if drop_pct > 0.30:
                return ValidationResult(
                    is_valid=False,
                    anomaly="large_drop",
                    message=f"Score dropped {drop_pct:.1%} from {previous_value} to {value}",
                )

        return ValidationResult(is_valid=True)
