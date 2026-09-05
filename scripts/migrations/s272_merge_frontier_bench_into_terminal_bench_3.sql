-- S272 (2026-09-05): retire `frontier_bench` — it is Terminal-Bench 3.0 under its pre-release name.
--
-- Evidence:
--   * https://github.com/harbor-framework/frontier-bench (the id's only source) 301-redirects to
--     harbor-framework/terminal-bench, whose v3.0.0 release is tagged 2026-07-23 and whose README
--     already read "# Terminal-Bench 3" before 2026-07-15.
--   * Its four rows — GPT-5.6 Sol 34.4, Fable 5 33.8, Opus 4.8 21.1 — match the official
--     Terminal-Bench 3.0 launch post (tbench.ai/blog/terminal-bench-3-0) digit for digit; the fourth
--     (Opus 5 43.3) is a 2026-07-31 leaderboard snapshot of the same board, shown as 42.7 by the
--     Terminal-Bench-Science comparison chart in September.
--
-- Canonical id: terminal_bench_3 (already holds all four models plus GLM-5.3, Gemini 3.7 Flash, Terra,
-- Luna). Nothing is moved: every frontier_bench model already has a terminal_bench_3 row, and the
-- Opus 5 43.3 snapshot is preserved in that row's notes. The source JSON
-- (resource/zzzzzzzzzz_fullmenu_audit_w2_2026_07_31_scores.json) was re-pointed in the same change, so
-- `make load` no longer recreates the id; this migration clears what the loader cannot delete.

DELETE FROM scores WHERE benchmark_id = 'frontier_bench';
DELETE FROM benchmarks WHERE id = 'frontier_bench';
