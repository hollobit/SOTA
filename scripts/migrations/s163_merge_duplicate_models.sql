-- S163 duplicate model merge — 20 clear cases
-- Pattern: (canonical, dupe) where scores from dupe move to canonical
-- Score conflicts (canonical already has value on that bench): dupe row deleted, canonical kept

BEGIN TRANSACTION;

-- Helper temp table listing merges
CREATE TEMP TABLE merge_pairs (canonical TEXT, dupe TEXT);
INSERT INTO merge_pairs VALUES
  -- Pattern 1: DeepSeek redundant prefix (6)
  ('deepseek/deepseek-v3.2', 'deepseek/v3.2'),
  ('deepseek/deepseek-v3.2-exp-reasoner', 'deepseek/v3.2-thinking'),
  ('deepseek/deepseek-v4-flash-high', 'deepseek/v4-flash-high'),
  ('deepseek/deepseek-v4-flash-max', 'deepseek/v4-flash-max'),
  ('deepseek/deepseek-v4-pro-high', 'deepseek/v4-pro-high'),
  ('deepseek/deepseek-v4-pro-max', 'deepseek/v4-pro-max'),
  -- Pattern 2: Anthropic dash-vs-dot version separator (4)
  ('anthropic/claude-opus-4.1', 'anthropic/claude-opus-4-1'),
  ('anthropic/claude-opus-4.5', 'anthropic/claude-opus-4-5'),
  ('anthropic/claude-sonnet-4.5', 'anthropic/claude-sonnet-4-5'),
  ('anthropic/claude-mythos-preview', 'anthropic/mythos-preview'),
  -- Pattern 3: Qwen dash-vs-dot (6) + vendor prefix reconciliation
  ('alibaba/qwen2.5-72b', 'alibaba/qwen-2.5-72b'),
  ('alibaba/qwen2.5-omni-7b', 'alibaba/qwen2-5-omni-7b'),
  ('alibaba/qwen2.5-omni-10b', 'alibaba/qwen2-5-omni-10b'),
  ('alibaba/qwen2.5-omni-5b', 'alibaba/qwen2-5-omni-5b'),
  ('alibaba/qwen-image-2.0-2026-03-03', 'alibaba/qwen-image-2-0-2026-03-03'),
  ('alibaba/qwen-image-2.0-pro-2026-04-22', 'alibaba/qwen-image-2-0-pro-2026-04-22'),
  -- Pattern 3b: Qwen vendor-prefix reconciliation (canonical = higher score count wins)
  ('qwen/qwen3.5-397b-a17b', 'alibaba/qwen-3.5-397b-a17b'),
  ('alibaba/qwen3-32b', 'qwen/qwen3-32b'),
  ('alibaba/qwen2.5-7b', 'qwen/qwen2.5-7b'),
  -- Extra: pure trailing-name-typo Qwen 3.5 4B group (verify existence)
  ('alibaba/qwen2.5-32b', 'alibaba/qwen-2.5-32b');

-- Show BEFORE state
SELECT 'BEFORE:' as label;
SELECT
  (SELECT COUNT(*) FROM models) as total_models,
  (SELECT COUNT(*) FROM scores) as total_scores,
  (SELECT COUNT(DISTINCT dupe) FROM merge_pairs WHERE dupe IN (SELECT id FROM models)) as dupes_present,
  (SELECT COUNT(*) FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs)) as scores_on_dupes;

-- Step 1: Move scores from dupe -> canonical (skip if canonical already has that bench)
UPDATE OR IGNORE scores
SET model_id = (SELECT canonical FROM merge_pairs WHERE dupe = scores.model_id)
WHERE model_id IN (SELECT dupe FROM merge_pairs);

-- Step 2: Delete any remaining scores on dupe IDs (these were conflicts — canonical kept its value)
DELETE FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs);

-- Step 3: Delete the dupe models
DELETE FROM models WHERE id IN (SELECT dupe FROM merge_pairs);

-- Show AFTER state
SELECT 'AFTER:' as label;
SELECT
  (SELECT COUNT(*) FROM models) as total_models,
  (SELECT COUNT(*) FROM scores) as total_scores,
  (SELECT COUNT(DISTINCT dupe) FROM merge_pairs WHERE dupe IN (SELECT id FROM models)) as dupes_present;

COMMIT;
