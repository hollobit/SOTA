"""Tests for the SOTATracker class."""

from datetime import date

from cyber.analyst.sota_tracker import SOTAChange, SOTATracker, _is_lower_better
from cyber.models.types import Benchmark, Score, Source


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


def _make_benchmark(bid, metric):
    return Benchmark(id=bid, name=bid, category="test", description="", metric=metric)


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


class TestLowerBetterDetection:
    def test_explicit_suffix(self):
        assert _is_lower_better("rmse_lower_better")
        assert _is_lower_better("mae_lower_better")
        assert _is_lower_better("control_rate_lower_better")

    def test_known_tokens(self):
        assert _is_lower_better("rmse")
        assert _is_lower_better("mae")
        assert _is_lower_better("perplexity")
        assert _is_lower_better("loss")
        assert _is_lower_better("fvd")
        assert _is_lower_better("mean_angular_error_deg")
        assert _is_lower_better("seconds")

    def test_higher_better_metrics(self):
        assert not _is_lower_better("accuracy")
        assert not _is_lower_better("pass@1")
        assert not _is_lower_better("elo")
        assert not _is_lower_better("f1")
        assert not _is_lower_better("auroc")
        assert not _is_lower_better("score")
        assert not _is_lower_better("gdt_ts")

    def test_none_or_empty(self):
        assert not _is_lower_better(None)
        assert not _is_lower_better("")


class TestComputeSOTALowerBetter:
    def test_lower_better_picks_min(self):
        """RMSE: lower is better — Pangu 134.5 should win, not ClimaX 201.0."""
        tracker = SOTATracker()
        benchmarks = {
            "weatherbench_z500_72h": _make_benchmark("weatherbench_z500_72h", "rmse"),
        }
        scores = [
            _make_score("microsoft/climax", "weatherbench_z500_72h", 201.0),
            _make_score("ecmwf/ifs", "weatherbench_z500_72h", 152.8),
            _make_score("huawei/pangu-weather", "weatherbench_z500_72h", 134.5),
        ]
        sota = tracker.compute_sota(scores, benchmarks)
        assert sota["weatherbench_z500_72h"].model_id == "huawei/pangu-weather"
        assert sota["weatherbench_z500_72h"].value == 134.5

    def test_explicit_lower_better_suffix(self):
        tracker = SOTATracker()
        benchmarks = {
            "matbench_discovery_mae": _make_benchmark(
                "matbench_discovery_mae", "mae_lower_better"
            ),
        }
        scores = [
            _make_score("model-a", "matbench_discovery_mae", 0.063),
            _make_score("model-b", "matbench_discovery_mae", 0.035),
            _make_score("model-c", "matbench_discovery_mae", 0.080),
        ]
        sota = tracker.compute_sota(scores, benchmarks)
        assert sota["matbench_discovery_mae"].model_id == "model-b"
        assert sota["matbench_discovery_mae"].value == 0.035

    def test_higher_better_unchanged(self):
        """Higher-better metric still picks max even when benchmarks dict is provided."""
        tracker = SOTATracker()
        benchmarks = {"mmlu": _make_benchmark("mmlu", "accuracy")}
        scores = [
            _make_score("gpt-4o", "mmlu", 88.0),
            _make_score("claude-3", "mmlu", 90.5),
        ]
        sota = tracker.compute_sota(scores, benchmarks)
        assert sota["mmlu"].model_id == "claude-3"
        assert sota["mmlu"].value == 90.5

    def test_legacy_no_benchmarks_arg(self):
        """Without benchmarks dict, all benchmarks treated as higher-better."""
        tracker = SOTATracker()
        scores = [
            _make_score("a", "rmse_bench", 100.0),
            _make_score("b", "rmse_bench", 50.0),
        ]
        sota = tracker.compute_sota(scores)  # no benchmarks → max wins
        assert sota["rmse_bench"].model_id == "a"
        assert sota["rmse_bench"].value == 100.0

    def test_mark_sota_lower_better(self):
        tracker = SOTATracker()
        benchmarks = {"rmse_b": _make_benchmark("rmse_b", "rmse")}
        scores = [
            _make_score("hi", "rmse_b", 200.0),
            _make_score("lo", "rmse_b", 50.0),
        ]
        marked = tracker.mark_sota(scores, benchmarks)
        sota_models = {s.model_id for s in marked if s.is_sota}
        assert sota_models == {"lo"}
