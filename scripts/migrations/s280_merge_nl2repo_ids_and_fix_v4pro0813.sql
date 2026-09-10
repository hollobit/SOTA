-- S280 (2026-09-10): consolidate NL2Repo-Bench ids and fix two mis-filed DeepSeek-V4-Pro-0813 rows.
--
--   nl2repo_bench (15 rows) and nl2repo_qwen (2 rows) -> nl2repo (18 rows, the oldest id).
--   All three are NL2Repo-Bench (arXiv 2512.12730); the only overlapping models
--   (deepseek-v4-flash-0731 54.2, claude-opus-4.6 47.6) carried identical values.
--   The source JSONs were re-pointed in the same change; this clears the stale ids.
--
--   deepseek/deepseek-v4-pro-0813 gpqa_diamond 72.9 / hle 7.7 were the V4-Pro Non-Think values
--   (note said so); they already exist on deepseek/deepseek-v4-pro-nonthink. The V4.1-Flash launch
--   table gives 0813 at max effort: GPQA Diamond 92.4 (re-inserted by the S280 JSON).

DELETE FROM scores WHERE benchmark_id IN ('nl2repo_bench', 'nl2repo_qwen');
DELETE FROM benchmarks WHERE id IN ('nl2repo_bench', 'nl2repo_qwen');
DELETE FROM scores WHERE model_id = 'deepseek/deepseek-v4-pro-0813' AND benchmark_id IN ('gpqa_diamond', 'hle');
