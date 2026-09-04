-- S264 (2026-09-04): merge prod_disallowed_violence into prod_disallowed_gore.
--
-- OpenAI's GPT-5.6 system card states this explicitly:
--   "we have renamed our previous 'violence' category to 'gore' in order to more clearly
--    distinguish it from requests related to illicit violent behavior; this is a naming
--    change, not a change in the underlying evaluation."
--
-- S261 ingested the GPT-5.1 addendum, whose Table 1 still uses the pre-rename label
-- "violence", and created a separate prod_disallowed_violence id for it. That split one
-- evaluation across two benchmark ids.
--
-- Safe to merge: none of the four affected models (gpt-5.1-thinking, gpt-5.1-instant,
-- gpt-5-instant-aug15, gpt-5-instant-oct3) had an existing prod_disallowed_gore row.
--
-- The source resource JSON was re-pointed to prod_disallowed_gore in the same change, so
-- `make load` now inserts these rows correctly; this migration only clears the stale
-- prod_disallowed_violence rows, which the loader cannot delete on its own.
--
-- Note on cross-card drift: the GPT-5.6 card restates gpt-5.1-thinking's Gore as 0.800
-- while the GPT-5.1 card reports 0.930 for the same evaluation. The GPT-5.1 card is that
-- model's own primary source, so its value is kept, consistent with how S261/S261b
-- resolved other restatement conflicts.

DELETE FROM scores WHERE benchmark_id = 'prod_disallowed_violence';
DELETE FROM benchmarks WHERE id = 'prod_disallowed_violence';
