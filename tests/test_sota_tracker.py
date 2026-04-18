"""Tests for the SOTATracker class."""

from datetime import date

from cyber.analyst.sota_tracker import SOTAChange, SOTATracker
from cyber.models.types import Score, Source


def _make_score(model_id, benchmark_id, value, is_sota=False):
    return Score(
        model_id=model_id,
        benchmark_id=benchmark_id,
        value=value,
        unit="%",
        source=Source(type="vendor", url="https://example.com", date="2025-01-01"),
        is_sota=is_sota,
        collected_at=date(2025, 1, 1),
    )


class TestComputeSOTA:
    def test_picks_highest_per_benchmark(self):
        tracker = SOTATracker()
        scores = [
            _make_score("gpt-4o", "mmlu", 88.0),
            _make_score("claude-3", "mmlu", 90.5),
            _make_score("gpt-4o", "humaneval", 92.0),
            _make_score("claude-3", "humaneval", 89.0),
        ]
        sota = tracker.compute_sota(scores)
        assert sota["mmlu"].model_id == "claude-3"
        assert sota["mmlu"].value == 90.5
        assert sota["humaneval"].model_id == "gpt-4o"
        assert sota["humaneval"].value == 92.0


class TestDetectChanges:
    def test_new_sota(self):
        tracker = SOTATracker()
        old = {"mmlu": _make_score("gpt-4o", "mmlu", 88.0)}
        new = {"mmlu": _make_score("claude-3", "mmlu", 91.0)}
        changes = tracker.detect_changes(old, new)
        assert len(changes) == 1
        assert changes[0].type == "NEW_SOTA"
        assert changes[0].benchmark_id == "mmlu"
        assert changes[0].new_model == "claude-3"
        assert changes[0].new_value == 91.0
        assert changes[0].old_model == "gpt-4o"
        assert changes[0].old_value == 88.0

    def test_new_benchmark(self):
        tracker = SOTATracker()
        old = {}
        new = {"mmlu": _make_score("claude-3", "mmlu", 91.0)}
        changes = tracker.detect_changes(old, new)
        assert len(changes) == 1
        assert changes[0].type == "NEW_BENCHMARK"
        assert changes[0].benchmark_id == "mmlu"
        assert changes[0].old_model is None
        assert changes[0].old_value is None

    def test_no_changes(self):
        tracker = SOTATracker()
        same = {"mmlu": _make_score("gpt-4o", "mmlu", 88.0)}
        changes = tracker.detect_changes(same, same)
        assert len(changes) == 0


class TestMarkSOTA:
    def test_sets_is_sota_correctly(self):
        tracker = SOTATracker()
        scores = [
            _make_score("gpt-4o", "mmlu", 88.0),
            _make_score("claude-3", "mmlu", 90.5),
            _make_score("gpt-4o", "humaneval", 92.0),
            _make_score("claude-3", "humaneval", 89.0),
        ]
        marked = tracker.mark_sota(scores)
        # Original list unchanged
        assert all(not s.is_sota for s in scores)
        # Marked list has correct flags
        for s in marked:
            if s.model_id == "claude-3" and s.benchmark_id == "mmlu":
                assert s.is_sota is True
            elif s.model_id == "gpt-4o" and s.benchmark_id == "humaneval":
                assert s.is_sota is True
            else:
                assert s.is_sota is False
