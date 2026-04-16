"""Tests for the Validator class."""

from cyber.analyst.validator import ValidationResult, Validator


class TestValidator:
    def setup_method(self):
        self.validator = Validator(
            benchmark_ranges={
                "mmlu": (0.0, 100.0),
                "humaneval": (0.0, 100.0),
            }
        )

    def test_score_in_range_valid(self):
        result = self.validator.validate("mmlu", 85.0)
        assert result.is_valid is True
        assert result.anomaly is None

    def test_below_range(self):
        result = self.validator.validate("mmlu", -0.1)
        # Negative check fires first
        assert result.is_valid is False

    def test_above_range(self):
        result = self.validator.validate("mmlu", 105.0)
        assert result.is_valid is False
        assert result.anomaly == "above_range"

    def test_unknown_benchmark_passes(self):
        result = self.validator.validate("unknown_bench", 999.0)
        assert result.is_valid is True

    def test_negative_score(self):
        result = self.validator.validate("mmlu", -5.0)
        assert result.is_valid is False
        assert result.anomaly == "negative"

    def test_large_drop_from_previous(self):
        # Drop of more than 30% from previous value
        result = self.validator.validate("mmlu", 50.0, previous_value=90.0)
        assert result.is_valid is False
        assert result.anomaly == "large_drop"

    def test_normal_change_from_previous(self):
        # Small drop within 30%
        result = self.validator.validate("mmlu", 80.0, previous_value=90.0)
        assert result.is_valid is True

    def test_below_range_not_negative(self):
        v = Validator(benchmark_ranges={"custom": (10.0, 50.0)})
        result = v.validate("custom", 5.0)
        assert result.is_valid is False
        assert result.anomaly == "below_range"
