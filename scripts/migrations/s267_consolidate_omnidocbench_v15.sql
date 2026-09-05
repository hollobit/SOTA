-- S267 (2026-09-05): consolidate the seven OmniDocBench v1.5 ids into two.
--
-- The family had spread ONE benchmark across seven ids while mixing three different
-- representations of the result:
--     (a) edit distance, 0-1, LOWER is better     e.g. gemini-3-pro 0.115
--     (b) overall score, 0-1, higher is better    e.g. qwen3.6-35b-a3b 0.899
--     (c) overall score, 0-100, higher is better  e.g. qwen3.6-35b-a3b 89.9
--
-- Four ids (omnidocbench, omnidocbench_1_5, omnidocbench_v15, omnidocbench_v1_5) held BOTH
-- directions at once, so a naive ranking on any of them put the best model last.
--
-- Cross-checks that pin the three representations together:
--     gemini-3-pro    = 0.115 edit distance  and  90.33 composite score
--     gemini-3-flash  = 0.121 edit distance  and  0.901 on llm-stats
--     qwen3.6-35b-a3b = 0.899 on llm-stats   and  89.9 on its own HF card
--
-- Consolidated into:
--     omnidocbench_v1_5_composite    — 0-100, higher better  (0-1 score rows multiplied by 100)
--     omnidocbench_1_5_lower_better  — 0-1 edit distance, lower better
--
-- Retired: omnidocbench, omnidocbench-v1.5, omnidocbench_1.5, omnidocbench_1_5,
--          omnidocbench_v15, omnidocbench_v1_5
--
-- The source resource JSONs were re-pointed in the same change (rows for a model already
-- present on the target id were dropped so the canonical value wins), so `make load` now
-- inserts correctly. This migration clears the stale rows and definitions.
--
-- NOT touched: the v1.6 ids and the per-sub-metric ids
-- (omnidocbench_v1_6*, omnidocbench_overall_edit_*, omnidocbench_table_teds_*,
--  omnidocbench_read_order_*, omnidocbench_text_edit_*, omnidocbench_en/_zh,
--  omnidocbench_complex_parsing, omnidocbench_overall, omnidocbench_v1_0_*, omnidocbench_v1_7).

DELETE FROM scores WHERE benchmark_id IN
  ('omnidocbench', 'omnidocbench-v1.5', 'omnidocbench_1.5', 'omnidocbench_1_5',
   'omnidocbench_v15', 'omnidocbench_v1_5');

DELETE FROM benchmarks WHERE id IN
  ('omnidocbench', 'omnidocbench-v1.5', 'omnidocbench_1.5', 'omnidocbench_1_5',
   'omnidocbench_v15', 'omnidocbench_v1_5');
