-- S281 (2026-09-14): MiniMax model-id fragmentation cleanup (same vendor, notation variants).
--
--   minimax/minimax-m3   (17 rows) -> minimax/m3   (112 rows)  5 overlaps, identical or same-source refreshes; m3 values kept
--   minimax/minimax-m2.7 (32 rows) -> minimax/m2.7 (40 rows)   1 overlap (ECI 145.89 vs 145.53); m2.7 value kept
--   minimax/minimax-2.1  (4 rows)  -> minimax/m2.1             both ids are MiniMax M2.1 (the PACE-Bench note says so);
--   minimax/minimax-m2.1 (3 rows)  -> minimax/m2.1             no overlaps; minimax-m2.1's model row is renamed to the canonical id
--   minimax/minimax-m1-80k         -> minimax/m1-80k           rename for family consistency
-- data/model_canonical_map.json gained the same mappings so the loader rewrites future ingests.

UPDATE OR IGNORE scores SET model_id='minimax/m3' WHERE model_id='minimax/minimax-m3';
DELETE FROM scores WHERE model_id='minimax/minimax-m3';
DELETE FROM models WHERE id='minimax/minimax-m3';
UPDATE OR IGNORE scores SET model_id='minimax/m2.7' WHERE model_id='minimax/minimax-m2.7';
DELETE FROM scores WHERE model_id='minimax/minimax-m2.7';
DELETE FROM models WHERE id='minimax/minimax-m2.7';
UPDATE models SET id='minimax/m2.1', name='MiniMax M2.1', vendor='MiniMax' WHERE id='minimax/minimax-m2.1';
UPDATE OR IGNORE scores SET model_id='minimax/m2.1' WHERE model_id IN ('minimax/minimax-m2.1','minimax/minimax-2.1');
DELETE FROM scores WHERE model_id IN ('minimax/minimax-m2.1','minimax/minimax-2.1');
DELETE FROM models WHERE id='minimax/minimax-2.1';
UPDATE models SET id='minimax/m1-80k', name='MiniMax M1 (80k)', vendor='MiniMax' WHERE id='minimax/minimax-m1-80k';
UPDATE OR IGNORE scores SET model_id='minimax/m1-80k' WHERE model_id='minimax/minimax-m1-80k';
DELETE FROM scores WHERE model_id='minimax/minimax-m1-80k';
