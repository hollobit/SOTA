-- S167 fifth-pass dedup — more vendor abbreviation cases
-- BFL/flux family completion, Zhipu vs zai, TII vs tiiuae, boltz-1, chai-1/2, figure-03, FAIR + matbench

BEGIN TRANSACTION;

CREATE TEMP TABLE merge_pairs (canonical TEXT, dupe TEXT);
INSERT INTO merge_pairs VALUES
  -- === PATTERN: BFL family completion (all flux-2-* variants → black-forest-labs/) ===
  ('black-forest-labs/flux-2-flex', 'bfl/flux-2-flex'),
  ('black-forest-labs/flux-2-max', 'bfl/flux-2-max'),
  ('black-forest-labs/flux-2-pro', 'bfl/flux-2-pro'),
  ('bfl/flux-2-klein-4b', 'blackforestlabs/flux-2-klein-4b'),

  -- === PATTERN: Zhipu vs zai (canonical zhipu/) — GLM family ===
  ('zhipu/glm-4.5', 'zai/glm-4.5'),
  ('zhipu/glm-4.5-air', 'zai/glm-4.5-air'),
  ('zhipu/glm-4.6', 'zai/glm-4.6'),
  ('zhipu/glm-4.7', 'zai/glm-4.7'),
  ('zhipu/glm-5', 'zai/glm-5'),

  -- === PATTERN: TII vs tiiuae (canonical tiiuae/ = HuggingFace convention) ===
  ('tiiuae/falcon-h1-34b', 'tii/falcon-h1-34b'),
  ('tiiuae/falcon-mamba-7b', 'tii/falcon-mamba-7b'),

  -- === PATTERN: Polymathic (both empty, pick canonical) ===
  ('polymathic/astroclip', 'polymathicai/astroclip'),

  -- === PATTERN: Boltz-1 (canonical boltz-ai per S163 flag) ===
  ('boltz-ai/boltz-1', 'mit-jameel/boltz-1'),

  -- === PATTERN: Chai-1 + Chai-2 (canonical chai-discovery/) ===
  ('chai-discovery/chai-1', 'chai/chai-1'),
  ('chai-discovery/chai-2', 'chai/chai-2'),

  -- === PATTERN: Figure 03 (canonical figure-ai/) ===
  ('figure-ai/figure-03', 'figure/figure-03'),

  -- === PATTERN: FAIR + matbench OAM (canonical fair/) ===
  ('fair/equiformerv3-dens-oam', 'matbench-oam/equiformerv3-dens-oam'),
  ('fair/esen-30m-oam', 'matbench-oam/esen-30m-oam');

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

SELECT 'AFTER:' as label;
SELECT
  (SELECT COUNT(*) FROM models) as models,
  (SELECT COUNT(*) FROM scores) as scores,
  (SELECT COUNT(*) FROM scores WHERE model_id NOT IN (SELECT id FROM models)) as orphans;

COMMIT;
