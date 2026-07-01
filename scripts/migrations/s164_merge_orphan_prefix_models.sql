-- S164 second-pass duplicate model merge (post-S163)
-- Focus: prefix-less orphans (missing vendor/), dash-vs-dot within same vendor,
-- vendor case normalization, extra Kimi/Grok/PleIAs cases.
-- Same policy as S163: UPDATE OR IGNORE moves scores, DELETE dupes.

BEGIN TRANSACTION;

CREATE TEMP TABLE merge_pairs (canonical TEXT, dupe TEXT);
INSERT INTO merge_pairs VALUES
  -- === PATTERN: PREFIX-LESS Anthropic Claude (12 orphans) ===
  ('anthropic/claude-fable-5', 'claude-fable-5'),
  ('anthropic/claude-mythos-5', 'claude-mythos-5'),
  ('anthropic/claude-opus-4.5', 'claude-opus-4-5'),
  ('anthropic/claude-opus-4.6', 'claude-opus-4-6'),
  ('anthropic/claude-opus-4.6-thinking', 'claude-opus-4-6-thinking'),
  ('anthropic/claude-opus-4.7', 'claude-opus-4-7'),
  ('anthropic/claude-opus-4.7-thinking', 'claude-opus-4-7-thinking'),
  ('anthropic/claude-opus-4.8', 'claude-opus-4-8'),
  ('anthropic/claude-opus-4.8-thinking', 'claude-opus-4-8-thinking'),
  ('anthropic/claude-sonnet-3.7', 'claude-sonnet-3-7'),
  ('anthropic/claude-sonnet-4.5', 'claude-sonnet-4-5'),
  ('anthropic/claude-sonnet-4.6', 'claude-sonnet-4-6'),

  -- === PATTERN: PREFIX-LESS NVIDIA Cosmos ===
  ('nvidia/cosmos-3-nano', 'cosmos-3-nano'),
  ('nvidia/cosmos-reason-1', 'cosmos-reason-1'),

  -- === PATTERN: PREFIX-LESS DeepSeek ===
  ('deepseek/deepseek-r1', 'deepseek-r1'),
  ('deepseek/deepseek-v3.2', 'deepseek-v3.2'),
  ('deepseek/deepseek-v4-pro', 'deepseek-v4-pro'),
  ('deepseek/deepseek-v4-pro-max', 'deepseek-v4-pro-max'),

  -- === PATTERN: PREFIX-LESS Google Gemini (also dash-to-dot in version) ===
  ('google/gemini-1.5-pro', 'gemini-1-5-pro'),
  ('google/gemini-2.5-pro', 'gemini-2-5-pro'),
  ('google/gemini-2.5-flash', 'gemini-2.5-flash'),
  ('google/gemini-3.1-pro', 'gemini-3-1-pro'),
  ('google/gemini-3.5-flash', 'gemini-3-5-flash'),
  ('google/gemini-3.5-flash', 'gemini-3.5-flash'),
  ('google/gemini-3-pro', 'gemini-3-pro'),

  -- === PATTERN: PREFIX-LESS OpenAI GPT (dash-to-dot) ===
  ('openai/gpt-4o', 'gpt-4o'),
  ('openai/gpt-5.1', 'gpt-5.1'),
  ('openai/gpt-5.1-codex', 'gpt-5-1-codex'),
  ('openai/gpt-5.4', 'gpt-5-4'),
  ('openai/gpt-5.4', 'gpt-5.4'),
  ('openai/gpt-5.4-high', 'gpt-5-4-high'),
  ('openai/gpt-5.5', 'gpt-5-5'),
  ('openai/gpt-5.5', 'gpt-5.5'),
  ('openai/gpt-5.5-high', 'gpt-5-5-high'),
  ('openai/gpt-5.5-xhigh', 'gpt-5-5-xhigh'),
  ('openai/gpt-oss-120b', 'gpt-oss-120b'),
  ('openai/o3', 'openai-o3'),

  -- === PATTERN: PREFIX-LESS Meta Llama ===
  ('meta/llama-3.3-70b', 'llama-3.3-70b'),
  ('meta/llama-4-maverick', 'llama-4-maverick'),
  ('meta/llama-4-scout', 'llama-4-scout'),

  -- === PATTERN: PREFIX-LESS Moonshot Kimi (dash-to-dot) ===
  ('moonshot/kimi-k2.6', 'kimi-k2-6'),
  ('moonshot/kimi-k2.7-code', 'kimi-k2-7-code'),

  -- === PATTERN: Various prefix-less ===
  ('minimax/m3', 'minimax-m3'),
  ('nvidia/nemotron-3-ultra', 'nemotron-3-ultra'),

  -- === PATTERN: Alibaba Qwen 3.6 dash-to-dot ===
  ('alibaba/qwen3.6-27b', 'qwen-3.6-27b'),

  -- === PATTERN: xAI Grok dash-to-dot + prefix-less ===
  ('xai/grok-4.3-high', 'xai/grok-4-3-high'),
  ('xai/grok-4.3-high', 'grok-4-3-high'),
  ('xai/grok-4.20-beta1', 'grok-4-20-beta1'),
  ('xai/grok-4.20-beta-0309-reasoning', 'grok-4-20-beta-reasoning'),

  -- === PATTERN: Moonshot Kimi extra dupes ===
  ('moonshot/kimi-k2.5', 'moonshot/kimi-k2-5'),
  ('moonshot/kimi-k2.5', 'moonshotai/kimi-k2.5'),

  -- === PATTERN: Case-based dupes ===
  ('pleias/pleias-rag-1b', 'PleIAs/Pleias-RAG-1B'),
  ('pleias/pleias-rag-350m', 'PleIAs/Pleias-RAG-350M'),

  -- === PATTERN: 42dot dash-to-dot ===
  ('42dot/42dot-llm-sft-1.3b', '42dot/42dot-llm-sft-1-3b');

-- Show BEFORE state
SELECT 'BEFORE:' as label;
SELECT
  (SELECT COUNT(*) FROM models) as models,
  (SELECT COUNT(*) FROM scores) as scores,
  (SELECT COUNT(DISTINCT dupe) FROM merge_pairs WHERE dupe IN (SELECT id FROM models)) as dupes_present,
  (SELECT COUNT(*) FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs)) as scores_on_dupes,
  (SELECT COUNT(DISTINCT canonical) FROM merge_pairs WHERE canonical NOT IN (SELECT id FROM models)) as missing_canonicals;

-- Step 1: move scores from dupe → canonical (skip conflicts)
UPDATE OR IGNORE scores
SET model_id = (SELECT canonical FROM merge_pairs WHERE dupe = scores.model_id)
WHERE model_id IN (SELECT dupe FROM merge_pairs);

-- Step 2: delete conflict remainders on dupe IDs (canonical won)
DELETE FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs);

-- Step 3: delete dupe models
DELETE FROM models WHERE id IN (SELECT dupe FROM merge_pairs);

-- Show AFTER
SELECT 'AFTER:' as label;
SELECT
  (SELECT COUNT(*) FROM models) as models,
  (SELECT COUNT(*) FROM scores) as scores,
  (SELECT COUNT(*) FROM scores WHERE model_id NOT IN (SELECT id FROM models)) as orphans;

COMMIT;
