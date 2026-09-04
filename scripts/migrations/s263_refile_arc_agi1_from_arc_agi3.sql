-- S263 (2026-09-04): re-file Epoch's ARC-AGI-1 rows that were stored under the arc_agi_3 id.
--
-- Epoch's benchmark-stitching CSV exposes a field named `arc_agi`, which is ARC-AGI-1 as published
-- on the ARC Prize Leaderboard. An earlier ingest mapped it onto the `arc_agi_3` benchmark id.
--
-- Evidence this was a misfiling, not a real result:
--   * openai/o3      scores 6.5  on arc_agi_2 but appeared to score 61.0 on the *harder* arc_agi_3
--   * openai/gpt-5.1 scores 17.6 on arc_agi_2 but appeared to score 73.0 on arc_agi_3
--   * GPT-5.6 Sol's actual ARC-AGI-3 result, from OpenAI's own card, is 7.78
--   * the values match the well-known ARC-AGI-1 leaderboard (o3 61%, GPT-4o 5%, o1 27%)
--
-- The source resource/*.json rows were already re-pointed to arc_agi_1 (see the same-named
-- python fix), so `make load` now inserts them correctly. This migration removes the stale
-- arc_agi_3 rows that the loader cannot delete on its own, since it only does INSERT OR REPLACE.
--
-- Effect: arc_agi_3 keeps only genuine ARC-AGI-3 results, making GPT-6 Astra's 62.7 (standard
-- harness, max effort) the top standard-harness score it should have been.

DELETE FROM scores
WHERE benchmark_id = 'arc_agi_3'
  AND notes LIKE '%benchmark-stitching CSV (arc_agi)%';
