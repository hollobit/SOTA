-- S170 final round — 4 more prefix-less orphans matched via dash→dot version transform + Llama-instruct canonical restoration
-- The 4 direct dupes: qwen3-7-max/max-preview/plus (dash→dot to alibaba/qwen3.7-*),
-- gemma_4_26b_a4b_qat (underscore→dash to google/gemma-4-26b-a4b-qat).
-- Plus 2 Llama-instruct orphans get NEW canonicals created (meta/ base exists but not -instruct variant).

BEGIN TRANSACTION;

-- Restore missing Llama-3.1 -instruct canonical models so orphan scores land somewhere sensible
-- (they're semantically distinct from the base pretrained models).
INSERT INTO models (id, vendor, name, version, type, modalities, release_date) VALUES
  ('meta/llama-3.1-70b-instruct', 'meta', 'Llama 3.1 70B Instruct', '3.1', 'language', '["text"]', '2024-07-23'),
  ('meta/llama-3.1-405b-instruct', 'meta', 'Llama 3.1 405B Instruct', '3.1', 'language', '["text"]', '2024-07-23');

CREATE TEMP TABLE merge_pairs (canonical TEXT, dupe TEXT);
INSERT INTO merge_pairs VALUES
  ('alibaba/qwen3.7-max', 'qwen3-7-max'),
  ('alibaba/qwen3.7-max-preview', 'qwen3-7-max-preview'),
  ('alibaba/qwen3.7-plus', 'qwen3-7-plus'),
  ('google/gemma-4-26b-a4b-qat', 'gemma_4_26b_a4b_qat'),
  ('meta/llama-3.1-70b-instruct', 'llama-3.1-70b-instruct'),
  ('meta/llama-3.1-405b-instruct', 'llama-3.1-405b-instruct');

SELECT 'BEFORE:', (SELECT COUNT(*) FROM models), (SELECT COUNT(*) FROM scores);
UPDATE OR IGNORE scores SET model_id = (SELECT canonical FROM merge_pairs WHERE dupe = scores.model_id) WHERE model_id IN (SELECT dupe FROM merge_pairs);
DELETE FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs);
DELETE FROM models WHERE id IN (SELECT dupe FROM merge_pairs);
SELECT 'AFTER:', (SELECT COUNT(*) FROM models), (SELECT COUNT(*) FROM scores), (SELECT COUNT(*) FROM scores WHERE model_id NOT IN (SELECT id FROM models));

COMMIT;
