-- S171 targeted Claude + OpenAI dedup
-- Anthropic name-order swaps + OpenAI dash-vs-dot version separators + canonical creation

BEGIN TRANSACTION;

-- Create 4 missing OpenAI dot-form canonicals so orphan scores land correctly
INSERT INTO models (id, vendor, name, version, type, modalities, release_date) VALUES
  ('openai/gpt-5.1-low', 'openai', 'GPT-5.1 (low)', '5.1', 'reasoning', '["text"]', '2026-01-15'),
  ('openai/gpt-5.2-high', 'openai', 'GPT-5.2 (high)', '5.2', 'reasoning', '["text"]', '2026-02-01'),
  ('openai/gpt-5.2-medium', 'openai', 'GPT-5.2 (medium)', '5.2', 'reasoning', '["text"]', '2026-02-01'),
  ('openai/gpt-5.2-chat-latest', 'openai', 'GPT-5.2 Chat Latest', '5.2', 'reasoning', '["text"]', '2026-02-01');

CREATE TEMP TABLE merge_pairs (canonical TEXT, dupe TEXT);
INSERT INTO merge_pairs VALUES
  -- === Anthropic name-order swaps ===
  ('anthropic/claude-3.7-sonnet', 'anthropic/claude-sonnet-3.7'),
  ('anthropic/claude-haiku-4.5', 'anthropic/claude-4.5-haiku'),
  -- === Anthropic broken-ID cleanup (with_fallback config variant → base Fable 5) ===
  ('anthropic/claude-fable-5', 'anthropic/claude-fable-5-with_fallback (adaptive default)'),
  -- === OpenAI dash-vs-dot version (direct canonical exists) ===
  ('openai/gpt-4.1', 'openai/gpt-4-1'),
  ('openai/gpt-4.1-mini', 'openai/gpt-4-1-mini'),
  ('openai/gpt-5.1-high', 'openai/gpt-5-1-high'),
  ('openai/gpt-image-1.5-high-fidelity', 'openai/gpt-image-1-5-high-fidelity'),
  -- === OpenAI dash-vs-dot with newly-created canonicals ===
  ('openai/gpt-5.1-low', 'openai/gpt-5-1-low'),
  ('openai/gpt-5.2-high', 'openai/gpt-5-2-high'),
  ('openai/gpt-5.2-medium', 'openai/gpt-5-2-medium'),
  ('openai/gpt-5.2-chat-latest', 'openai/gpt-5-2-chat-latest');

SELECT 'BEFORE:', (SELECT COUNT(*) FROM models), (SELECT COUNT(*) FROM scores),
       (SELECT COUNT(*) FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs));
UPDATE OR IGNORE scores SET model_id = (SELECT canonical FROM merge_pairs WHERE dupe = scores.model_id) WHERE model_id IN (SELECT dupe FROM merge_pairs);
DELETE FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs);
DELETE FROM models WHERE id IN (SELECT dupe FROM merge_pairs);
SELECT 'AFTER:', (SELECT COUNT(*) FROM models), (SELECT COUNT(*) FROM scores), (SELECT COUNT(*) FROM scores WHERE model_id NOT IN (SELECT id FROM models));

COMMIT;
