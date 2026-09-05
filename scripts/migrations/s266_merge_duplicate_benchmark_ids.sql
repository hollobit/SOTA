-- S266 (2026-09-05): merge two duplicated benchmark ids into their canonical form.
--
--   bfcl_v4_overall   -> bfcl_v4
--   omnidocbench-v1.6 -> omnidocbench_v1_6
--
-- Evidence they are the same metric, not different ones:
--   * bfcl_v4 / bfcl_v4_overall shared 16 models, and 14 of them carried identical values
--     (claude-opus-4.5 77.47, o3 63.05, gemini-3-pro-preview 72.51, ...). The two that differ
--     (qwen3-32b 46.7 vs 48.71, command-a 57.06 vs 46.49) reflect leaderboard refreshes.
--   * omnidocbench-v1.6 / omnidocbench_v1_6 shared 4 models with identical values across all
--     four (paddleocr-vl-1.6 96.33, glm-ocr 95.22, paddleocr-vl-1.5 94.93, dots-ocr 90.77).
--
-- Canonical choice:
--   * bfcl_v4 — the larger, older series (48 rows, back to 2026-04-17) and the id recent
--     sessions write to.
--   * omnidocbench_v1_6 — snake_case, consistent with the sub-metric ids
--     omnidocbench_v1_6_textedit / _tableteds / _readorder.
--
-- The source resource JSONs were re-pointed in the same change (rows whose model already
-- existed on the canonical id were dropped rather than merged, so the canonical value wins),
-- so `make load` now inserts correctly. This migration only clears the stale rows and the
-- now-unused benchmark definitions, which the loader cannot delete on its own.

DELETE FROM scores WHERE benchmark_id IN ('bfcl_v4_overall', 'omnidocbench-v1.6');
DELETE FROM benchmarks WHERE id IN ('bfcl_v4_overall', 'omnidocbench-v1.6');
