-- S168 sixth-pass dedup — LumiOpen case, QwenLM/alibaba, zai-org/zhipu extension, alibaba-nlp/alibaba

BEGIN TRANSACTION;

CREATE TEMP TABLE merge_pairs (canonical TEXT, dupe TEXT);
INSERT INTO merge_pairs VALUES
  -- === PATTERN: LumiOpen case + org drift (LumiOpen vs lumi-open) ===
  ('lumi-open/llama-poro-2-70b-instruct', 'LumiOpen/Llama-Poro-2-70B-Instruct'),
  ('lumi-open/llama-poro-2-8b-instruct', 'LumiOpen/Llama-Poro-2-8B-Instruct'),

  -- === PATTERN: QwenLM case + org drift (QwenLM → alibaba per canonical) ===
  ('alibaba/qwen-vla-instruct', 'QwenLM/Qwen-VLA-Instruct'),

  -- === PATTERN: Zhipu / zai / zai-org GLM extension ===
  ('zhipu/glm-5.1', 'zai/glm-5.1'),
  ('zai-org/glm-ocr', 'zai/glm-ocr'),

  -- === PATTERN: alibaba-nlp vs alibaba (GTE embedding models) ===
  ('alibaba-nlp/gte-qwen2-1.5b-instruct', 'alibaba/gte-qwen2-1.5b-instruct'),
  ('alibaba-nlp/gte-qwen2-7b-instruct', 'alibaba/gte-qwen2-7b-instruct'),

  -- === PATTERN: FireRed (Tencent's team, canonical firered/ per project name) ===
  ('firered/firered-ocr-2b', 'tencent/firered-ocr-2b'),

  -- === PATTERN: MBZUAI Oryx (both empty, pick shorter for consistency) ===
  ('mbzuai/bimedix', 'mbzuai-oryx/bimedix');

SELECT 'BEFORE:', (SELECT COUNT(*) FROM models), (SELECT COUNT(*) FROM scores);
UPDATE OR IGNORE scores SET model_id = (SELECT canonical FROM merge_pairs WHERE dupe = scores.model_id) WHERE model_id IN (SELECT dupe FROM merge_pairs);
DELETE FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs);
DELETE FROM models WHERE id IN (SELECT dupe FROM merge_pairs);
SELECT 'AFTER:', (SELECT COUNT(*) FROM models), (SELECT COUNT(*) FROM scores), (SELECT COUNT(*) FROM scores WHERE model_id NOT IN (SELECT id FROM models));

COMMIT;
