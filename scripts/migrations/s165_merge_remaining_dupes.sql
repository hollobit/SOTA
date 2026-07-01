-- S165 third-pass duplicate model merge
-- Additional cases surfaced by re-scanning with vendored-tail matching + Qwen omni family + Anthropic name-order

BEGIN TRANSACTION;

CREATE TEMP TABLE merge_pairs (canonical TEXT, dupe TEXT);
INSERT INTO merge_pairs VALUES
  -- === PATTERN: Prefix-less orphans with vendored-tail match (round 3) ===
  ('meta/muse-spark', 'muse-spark'),
  ('meta/llama-3.3-70b-instruct', 'llama-3.3-70b-instruct'),
  ('meta/llama-2-70b', 'llama-2-70b'),
  ('sakana/ai-scientist-v2', 'ai-scientist-v2'),
  ('nvidia/cosmos-3', 'cosmos-3'),
  ('sakana/darwin-godel-machine', 'darwin-godel-machine'),
  ('deepseek/deepseek-v4-flash', 'deepseek-v4-flash'),
  ('google/gemini-3.1-pro-preview', 'gemini-3.1-pro-preview'),
  ('stepfun/step-3.5-flash', 'step-3.5-flash'),

  -- === PATTERN: Qwen 3.5 Omni family — 3-way dupe (dash/dash+dot/dot only) ===
  ('alibaba/qwen3.5-omni-flash', 'alibaba/qwen-3.5-omni-flash'),
  ('alibaba/qwen3.5-omni-flash', 'alibaba/qwen3-5-omni-flash'),
  ('alibaba/qwen3.5-omni-plus', 'alibaba/qwen-3.5-omni-plus'),
  ('alibaba/qwen3.5-omni-plus', 'alibaba/qwen3-5-omni-plus'),

  -- === PATTERN: Anthropic name-order swap (claude-4-opus vs claude-opus-4) ===
  ('anthropic/claude-opus-4', 'anthropic/claude-4-opus'),

  -- === PATTERN: xAI Grok remaining dash-vs-dot ===
  ('xai/grok-4.2', 'xai/grok-4-2'),
  ('xai/grok-voice-think-fast-1.0', 'xai/grok-voice-think-fast-1'),

  -- === PATTERN: xAI Grok Imagine image-quality date-suffix ===
  ('xai/grok-imagine-image-quality', 'xai/grok-imagine-image-quality-20260519');

-- BEFORE
SELECT 'BEFORE:' as label;
SELECT
  (SELECT COUNT(*) FROM models) as models,
  (SELECT COUNT(*) FROM scores) as scores,
  (SELECT COUNT(DISTINCT dupe) FROM merge_pairs WHERE dupe IN (SELECT id FROM models)) as dupes_present,
  (SELECT COUNT(*) FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs)) as scores_on_dupes;

UPDATE OR IGNORE scores
SET model_id = (SELECT canonical FROM merge_pairs WHERE dupe = scores.model_id)
WHERE model_id IN (SELECT dupe FROM merge_pairs);

DELETE FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs);
DELETE FROM models WHERE id IN (SELECT dupe FROM merge_pairs);

-- AFTER
SELECT 'AFTER:' as label;
SELECT
  (SELECT COUNT(*) FROM models) as models,
  (SELECT COUNT(*) FROM scores) as scores,
  (SELECT COUNT(*) FROM scores WHERE model_id NOT IN (SELECT id FROM models)) as orphans;

COMMIT;
