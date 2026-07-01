-- S166 fourth-pass duplicate model merge
-- Focus: Vendor abbreviation reconciliation (bfl/blackforestlabs, mistral/mistral_ai, google-deepmind/deepmind, HuggingFaceTB/huggingface case, etc.)

BEGIN TRANSACTION;

CREATE TEMP TABLE merge_pairs (canonical TEXT, dupe TEXT);
INSERT INTO merge_pairs VALUES
  -- === PATTERN: DeepMind / Google-DeepMind consolidation ===
  -- All research models under 'deepmind/' merge to 'google-deepmind/' (official org name)
  ('google-deepmind/alphafold-3', 'deepmind/alphafold-3'),
  ('google-deepmind/alphafold-3', 'google/alphafold-3'),
  ('google-deepmind/alphagenome', 'deepmind/alphagenome'),
  ('google-deepmind/alphageometry-2', 'deepmind/alphageometry-2'),
  ('google-deepmind/alphaproof', 'deepmind/alphaproof'),
  ('google-deepmind/alphafold-server', 'deepmind/alphafold-server'),
  ('google-deepmind/gencast', 'deepmind/gencast'),
  ('google-deepmind/gnome', 'deepmind/gnome'),
  ('google-deepmind/gemini-robotics-er-1.5', 'google/gemini-robotics-er-1.5'),

  -- === PATTERN: Google prefix for older RT (google/ has more scores) ===
  ('google/rt-2-x', 'google-deepmind/rt-2-x'),
  ('google/gemini-robotics-er-1.6', 'google-deepmind/gemini-robotics-er-1.6'),
  ('google/gemini-robotics-1.5', 'google-deepmind/gemini-robotics-1.5'),

  -- === PATTERN: 01.AI vs yi (Yi = 01.AI's product) ===
  ('01-ai/yi-1.5-34b', 'yi/yi-1.5-34b'),
  ('01-ai/yi-1.5-9b', 'yi/yi-1.5-9b'),
  ('01-ai/yi-coder-9b', 'yi/yi-coder-9b'),

  -- === PATTERN: Black Forest Labs (bfl / black-forest-labs / blackforestlabs) ===
  -- Canonical = 'black-forest-labs/' (HuggingFace org)
  ('black-forest-labs/flux-2-dev', 'bfl/flux-2-dev'),
  ('black-forest-labs/flux-2-dev', 'blackforestlabs/flux-2-dev'),

  -- === PATTERN: Mistral vs mistral_ai (Voxtral) ===
  ('mistral/voxtral-mini-3b-2507', 'mistral_ai/voxtral-mini-3b-2507'),
  ('mistral/voxtral-small-24b-2507', 'mistral_ai/voxtral-small-24b-2507'),

  -- === PATTERN: Arcee AI (arcee vs arcee-ai) ===
  ('arcee-ai/trinity-large-thinking', 'arcee/trinity-large-thinking'),

  -- === PATTERN: NX-AI (nx-ai vs nxai) — canonical 'nx-ai/' ===
  ('nx-ai/tirex', 'nxai/tirex'),

  -- === PATTERN: Fish Audio (fish-audio vs fishaudio) ===
  ('fish-audio/s2-pro', 'fishaudio/s2-pro'),

  -- === PATTERN: HuggingFaceTB case + org drift → lowercase huggingface/ ===
  -- 'HuggingFaceTB' is the SmolLM team, but 'huggingface/' is what the dashboard uses
  ('huggingface/smollm3-3b', 'HuggingFaceTB/SmolLM3-3B'),
  ('huggingface/smollm2-1.7b-instruct', 'HuggingFaceTB/SmolLM2-1.7B-Instruct'),

  -- === PATTERN: Self-referential vendor (vendor/tail == tail) ===
  ('alibaba/z-image-turbo', 'z-image-turbo/z-image-turbo'),
  ('shanghai-ai-lab/visionfm', 'visionfm/visionfm'),

  -- === PATTERN: Empty pairs cleanup (both 0 scores, pick one) ===
  ('lean-dojo/reprover', 'leandojo/reprover'),
  ('xxlong0/wonder3d', 'wonder3d/wonder3d');

SELECT 'BEFORE:' as label;
SELECT
  (SELECT COUNT(*) FROM models) as models,
  (SELECT COUNT(*) FROM scores) as scores,
  (SELECT COUNT(DISTINCT dupe) FROM merge_pairs WHERE dupe IN (SELECT id FROM models)) as dupes_present,
  (SELECT COUNT(*) FROM scores WHERE model_id IN (SELECT dupe FROM merge_pairs)) as scores_on_dupes,
  (SELECT COUNT(DISTINCT canonical) FROM merge_pairs WHERE canonical NOT IN (SELECT id FROM models)) as missing_canonicals;

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
