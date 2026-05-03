# Model Detail Modal — Information Enhancement Design

**Date:** 2026-05-03
**Status:** Approved (brainstorming complete)
**Owner:** USER
**Repo:** hollobit/SOTA (cyber)

---

## 1. Goal

The model detail modal (`Modal.showModel(modelId)` in `dashboard/js/modal.js`) currently shows core fields, reference links, version history, and categorized scores. The goal is to enrich it with:

1. **Comparison context (priority)** — automatic peer matching, SOTA tier badges in a 12-month rolling window, automatic strengths/weaknesses extraction.
2. **Information depth** — architecture details (MoE/dense, attention type, experts), training info (pretrain tokens, knowledge cutoff), throughput (tokens/sec, latency), safety classification (AISI cyber tier, CBRN risk).
3. **Practical decision-making** — quantization variants, API providers, supported languages, license details.

A user opening any model modal should be able to answer "where does this model sit relative to its 12-month peers" and "what is this model under the hood" without leaving the modal.

## 2. Non-Goals

- Automatic safety score harvesting (manual curation only in v1)
- Multi-language UI translation (Korean/English text remain mixed as today)
- ECharts charts inside the modal (peer table only)
- Live API availability detection
- Search/filter UI changes outside the modal
- Backfilling enrichment for all 761 models in v1 (frontier 30 only)

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  exporter (Python, cyber/publisher/exporter.py)          │
│   ├─ Model schema extended: +context_window,            │
│   │  +knowledge_cutoff, +languages                       │
│   │  (parameters already exists, fix exporter)           │
│   └─ NEW: enrichment exporter                            │
│      reads config/model_enrichment.yaml                  │
│      writes data/export/model_enrichment.json            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  dashboard/js/modal.js + peer-matcher.js (NEW)           │
│   ├─ App.data.models[modelId]    (core)                  │
│   ├─ App.data.enrichment[modelId] (sidecar lazy-load)    │
│   ├─ App.data.pricing[modelId]    (existing)             │
│   ├─ NEW: peer matcher (overlap × score similarity)     │
│   └─ NEW: SOTA tracker (12-month rolling window)        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Model Modal — 7 sections                                │
│   1. Header + meta badges (existing)                     │
│   2. Detail card (extended: +context, +cutoff, +langs,   │
│      +throughput)                                        │
│   3. Reference links (existing)                          │
│   4. NEW: Peer Comparison (auto + dropdown override)    │
│   5. NEW: Strengths / Weaknesses extracted               │
│   6. NEW: Architecture / Training / Safety (sidecar)     │
│   7. Score breakdown by category (existing + inline      │
│      SOTA tier badges)                                   │
│   8. Version history (existing)                          │
└─────────────────────────────────────────────────────────┘
```

### Design principles

- **Graceful degradation** — every new section hides itself if its data is absent. The 730 models without enrichment must not show empty rails.
- **Lazy load** — `model_enrichment.json` is fetched on first modal open, not at page load. Initial dashboard load cost is zero.
- **Single source of truth per concern** — `parameters` lives in the Model schema; MoE/expert/attention specifics live in enrichment. No duplication.
- **Pure-data approach** — peer matcher and SOTA tier are deterministic functions of (models, scores). No server round-trip.

## 4. Data Schema

### 4.1 Model schema extensions (`cyber/models/types.py`)

```python
@dataclass
class Model:
    id: str
    vendor: str
    name: str
    version: str
    type: str
    modalities: list[str] = field(default_factory=list)
    parameters: str | None = None              # already exists, exporter must propagate
    release_date: str | None = None
    # NEW
    context_window: int | None = None          # tokens (e.g., 262144)
    knowledge_cutoff: str | None = None        # ISO date prefix "YYYY-MM"
    languages: list[str] | None = None         # ISO codes (["en","ko","es","de","ja","vi"])
```

The loader (`scripts/load_benchmark_scores.py`) must be updated to map these four fields from seed JSON when present. The exporter (`cyber/publisher/exporter.py:_export_models`) currently does `asdict(m)` and works correctly once the dataclass has these fields — no exporter code change needed beyond verifying the round-trip.

### 4.2 Sidecar `data/export/model_enrichment.json` (NEW)

```json
{
  "_meta": {
    "generated_at": "2026-05-03",
    "covered_models": 30,
    "schema_version": "1.0"
  },
  "models": {
    "lg/exaone-4.5-33b": {
      "architecture": {
        "type": "dense",
        "total_params_b": 33,
        "active_params_b": null,
        "layers": null,
        "attention": "hybrid_swa_global",
        "attention_pattern": "16 × (3 SWA + 1 Global)",
        "experts_total": null,
        "experts_active": null,
        "vision_encoder_b": 1.29
      },
      "training": {
        "pretrain_tokens": null,
        "compute_flops": null,
        "phases": ["base pretrain", "vision adapter", "SFT", "DPO"]
      },
      "safety": {
        "aisi_cyber_tier": null,
        "cbrn_risk": null,
        "self_reported_safety_card": "https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B"
      },
      "throughput": {
        "tokens_per_second": null,
        "latency_p50_ms": null,
        "_note": "Not measured by Artificial Analysis"
      },
      "quantizations": ["fp8", "awq", "gguf"],
      "api_providers": ["huggingface_inference", "vllm", "ollama"],
      "_sources": [
        "https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B",
        "http://arxiv.org/abs/2604.08644"
      ]
    }
  }
}
```

All nested fields are optional; null is allowed and triggers row-level hiding in the UI.

### 4.3 Input file `config/model_enrichment.yaml` (NEW)

```yaml
schema_version: "1.0"
models:
  lg/exaone-4.5-33b:
    architecture:
      type: dense
      total_params_b: 33
      attention_pattern: "16 × (3 SWA + 1 Global)"
      vision_encoder_b: 1.29
    quantizations: [fp8, awq, gguf]
    _sources:
      - https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B
```

The exporter reads this YAML, normalizes structure, and writes the JSON sidecar. Missing top-level keys (architecture, training, safety, throughput, quantizations, api_providers) are filled with null/empty defaults at export time.

### 4.4 Initial frontier-30 coverage (Phase 1 of D-rollout)

The following 30 models will have hand-curated enrichment entries in v1:

OpenAI: gpt-5.5, gpt-5.5-pro, gpt-5.4, gpt-5.4-thinking, gpt-5.3-codex
Anthropic: claude-opus-4.7, claude-mythos-preview, claude-opus-4.6
Google: gemini-3.1-pro, gemini-3-pro
xAI: grok-4.3, grok-4-heavy
Meta: muse-spark
DeepSeek: deepseek-v4-pro, deepseek-v4-flash
Moonshot: kimi-k2.6
Z.ai (China): glm-5.1, glm-5
Alibaba: qwen3.6-27b, qwen3.6-35b-a3b
Tencent: hy3-preview
Baidu: ernie-5.0
LG (Korea): exaone-4.5-33b, k-exaone-236b
SKT: ax-k1
Mistral: mistral-medium-3.5, mistral-small-4
Sber (Russia): gigachat-3.1-ultra
DICTA (Israel): dictalm-3.0-24b-thinking
Cohere (Canada): tiny-aya-3b

These 30 cover ≈80% of frontier model views in the dashboard.

## 5. Algorithms

### 5.1 Peer matcher

Located in `dashboard/js/peer-matcher.js` (NEW).

```javascript
function findPeers(modelId, allModels, allScores, k) {
    if (k === undefined) k = 3;
    var target = scoresByModel(modelId, allScores);
    var targetBenches = new Set(Object.keys(target));
    if (targetBenches.size < 5) return [];

    var candidates = [];
    allModels.forEach(function(m) {
        if (m.id === modelId) return;
        var scores = scoresByModel(m.id, allScores);
        var overlap = Object.keys(scores).filter(function(b) {
            return targetBenches.has(b);
        });
        if (overlap.length < 5) return;

        var diffs = overlap.map(function(b) {
            return Math.abs(scores[b] - target[b]);
        });
        var avgDelta = diffs.reduce(function(a, b) { return a + b; }, 0) / diffs.length;

        candidates.push({
            modelId: m.id,
            overlap: overlap.length,
            avgDelta: avgDelta,
            score: overlap.length / (1 + avgDelta * 0.3)
        });
    });

    return candidates.sort(function(a, b) { return b.score - a.score; }).slice(0, k);
}
```

**Threshold rationale:**
- `overlap >= 5` — minimum shared benchmarks for a meaningful comparison.
- `score = overlap / (1 + avgDelta × 0.3)` — balances coverage and similarity. Factor 0.3 was chosen by inspection: 1pt average delta ≈ losing 0.3 overlap, so a model with 18 shared benches and 2pt avg delta scores ~11.25, vs 8 shared benches and 0.5pt delta scores ~6.96. Tunable in v1.5.
- All benchmark values assumed to be in similar units (% accuracy, % win rate, etc.). Current DB invariant. If we later add elo-scale or absolute-time benchmarks, peer matcher needs unit-aware normalization — this is an explicit v1.5 follow-up, not a v1 blocker.

### 5.2 SOTA tier tracker (12-month rolling window)

```javascript
function sotaTier(score, modelId, benchmarkId, allModels, allScores) {
    var cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    var cutoffStr = cutoff.toISOString().slice(0, 10);

    var recentModels = new Set(
        allModels
            .filter(function(m) { return m.release_date && m.release_date >= cutoffStr; })
            .map(function(m) { return m.id; })
    );

    var peers = allScores
        .filter(function(s) {
            return s.benchmark_id === benchmarkId && recentModels.has(s.model_id);
        })
        .map(function(s) { return s.value; })
        .sort(function(a, b) { return b - a; });

    if (peers.length < 5) return null;

    var rank = peers.indexOf(score) + 1;
    var total = peers.length;
    if (rank === 1) return { tier: 'sota', label: '👑 SOTA', rank: rank, total: total };
    if (rank <= 3) return { tier: 'top3', label: '🥈 Top 3', rank: rank, total: total };
    if (rank <= 10) return { tier: 'top10', label: '🥉 Top 10', rank: rank, total: total };
    if (rank / total <= 0.25) return { tier: 'q1', label: 'Top 25%', rank: rank, total: total };
    return null;
}
```

**Edge cases:**
- Tied scores: all share the same rank (`indexOf` returns first match).
- Models with `release_date == null`: excluded from population (conservative — better to undercount than overcount).
- Population < 5: no badge issued (statistical noise floor).
- The target model itself appears in `peers`; `indexOf(score)` returns its own rank correctly.

### 5.3 Strengths / weaknesses extraction

```javascript
function extractStrengthsWeaknesses(modelId, allScores, allModels) {
    var modelScores = allScores.filter(function(s) { return s.model_id === modelId; });

    var withTier = modelScores.map(function(s) {
        var tier = sotaTier(s.value, modelId, s.benchmark_id, allModels, allScores);
        return { benchmark_id: s.benchmark_id, value: s.value, tier: tier };
    });

    var strengths = withTier
        .filter(function(r) {
            return r.tier && (r.tier.tier === 'sota' || r.tier.tier === 'top3');
        })
        .sort(function(a, b) { return a.tier.rank - b.tier.rank; })
        .slice(0, 5);

    var weaknesses = withTier
        .map(function(r) {
            var peerAvg = avgPeerScore(r.benchmark_id, allModels, allScores);
            return Object.assign({}, r, { peerAvg: peerAvg, delta: r.value - peerAvg });
        })
        .filter(function(r) { return r.peerAvg !== null && r.delta < -10; })
        .sort(function(a, b) { return a.delta - b.delta; })
        .slice(0, 5);

    return { strengths: strengths, weaknesses: weaknesses };
}
```

**Why peer-relative weaknesses, not absolute:** Some benchmarks (e.g., HLE) have all-frontier scores around 30%; calling 30% a "weakness" is incorrect because that's where the field is. A model ranked 80th of 100 on HLE at 28% has a real weakness; one ranked 5th of 100 at 30% does not.

## 6. Modal UI

The modal renders sections in this order, each gracefully hiding when its data is absent:

1. **Header** — `<h2>Model Name</h2>` + 3 badges (vendor, type, score count). Existing.
2. **Detail card** — 2-column grid. Adds: Context Window, Knowledge Cutoff, Languages, Throughput rows. Existing fields preserved.
3. **Reference links** — System Card / Model Card / HF / Homepage / Paper / GitHub / Blog. Existing.
4. **🎯 Peer Comparison** *(NEW)* — table comparing target model with auto-selected closest peer. Dropdown above table lets user override (top-5 candidates). Columns: benchmark, target score (with SOTA badge), peer score, delta. Footer: "Avg Δ ±X.Xpt across N shared benchmarks".
5. **💪 Strengths** *(NEW)* — top-5 SOTA/Top-3 tier benchmarks, sorted by rank.
6. **⚠ Weaknesses** *(NEW)* — top-5 benchmarks where this model trails peer average by ≥10pt, sorted by delta.
7. **🏗 Architecture / Training / Safety** *(NEW)* — bordered card with 3 subsections. Each subsection hides if all its rows are null.
8. **📊 Score breakdown by category** — existing categorized score list. Each row gains an inline SOTA tier badge (👑 / 🥈 / 🥉) when applicable.
9. **📜 Version history** — sibling models from same vendor. Existing.
10. **Score sources fallback** — only when no curated reference links. Existing.

Visual spec (full mockup) is in design conversation; implementation should match section ordering and graceful-hide behavior described above.

## 7. Error Handling & Graceful Degradation

| Scenario | Behavior |
|---|---|
| `model_enrichment.json` fetch fails (404, network) | All enrichment sections hidden; one-time `console.warn`; modal otherwise normal |
| Specific model has no enrichment entry | Architecture/Training/Safety section hidden (expected for 730/761 models) |
| `release_date == null` on target model | SOTA badges show "n/a"; model excluded from peer population |
| Peer overlap < 5 candidates with ≥5 shared benches | "🎯 Peer Comparison: insufficient overlap data" message; dropdown disabled |
| User selects "self" in dropdown | Self filtered from dropdown options |
| `aa_pricing.json` lacks throughput | "— tokens/sec (not measured)" rendered in gray |
| Strengths section yields zero results | Strengths section hidden |
| Weaknesses section yields zero results | Weaknesses section hidden |
| Languages present in enrichment but absent in schema | Enrichment value used; both null → row hidden |

## 8. Performance

- **Enrichment lazy load:** `fetch('data/model_enrichment.json')` triggered by first `Modal.showModel()` call. Single in-flight promise (`_enrichmentPromise`) prevents duplicate requests.
- **Peer matcher complexity:** O(M × B) per call where M = models (~760), B = avg benchmarks per model (~30). Real-world ~22,800 ops; <5ms on typical client. No memoization needed for v1; add `_peerCache[modelId]` if profiling reveals jank in dropdown re-renders.
- **SOTA tier complexity:** O(N log N) sort per (benchmark, score) lookup. Without caching, modal opening evaluates ~30 benchmarks × ~750 scores → ~30ms. Acceptable; precompute index `_sotaIndex[benchmarkId] = sortedDescending(scores)` on first SOTA call to amortize.
- **JSON sidecar size:** 30 models × ~500 bytes = ~15KB. Negligible. Future ~300 models → ~150KB, still small.

## 9. Testing Strategy

| Layer | Tool | What's verified |
|---|---|---|
| Model schema round-trip | pytest unit | `Model(parameters="33B", context_window=262144, languages=["en","ko"])` saves and loads via `insert_model`/`get_all_models`. JSON export contains the new fields. |
| Enrichment YAML → JSON pipeline | pytest unit | YAML with all 30 frontier models compiles to JSON matching schema_version 1.0; missing optional fields default to null. |
| Peer matcher determinism | JS unit (Jest or vanilla `assert`) | Same `(modelId, allModels, allScores)` → same ranked output. EXAONE 4.5 → top peer is alibaba/qwen3-vl-32b (oracle expectation). |
| SOTA tier 12-month window | JS unit | Models with `release_date < today-365d` excluded; tied scores share rank; population < 5 returns null. |
| Strengths/weaknesses limits | JS unit | If 100 strengths, only top 5 returned, sorted by rank ascending. Weaknesses require `delta < -10`. |
| Modal integration | Playwright | Click EXAONE 4.5 in leaderboard → 6 new sections render. WeMath row in score table shows 👑 badge. Peer dropdown contains ≥3 options. |
| Graceful degradation | Playwright | Mock 404 on `model_enrichment.json` → modal still opens; Architecture section absent; no console errors. |
| Lazy load | DevTools network panel | Page load triggers no `model_enrichment.json` request. First `Modal.showModel()` triggers exactly one. |

## 10. Rollout

1. **v1 (this spec)**: schema extension + enrichment pipeline + modal UI; frontier-30 hand-curated.
2. **v1.5** (separate spec): auto-extract enrichment from existing seed `_note` fields via regex (e.g., "192 experts", "256K context"). Human-verified before merge.
3. **v2** (optional): vendor model card scraper; CI job re-runs enrichment quarterly.

## 11. Open Questions

None — all alternatives discussed in brainstorming were resolved. Tunable parameters (peer scoring factor 0.3, weakness threshold -10pt, badge tiers SOTA/Top3/Top10/Top25%) are intentionally hardcoded in v1; revisit in v1.5 with usage data.

## 12. Files Touched

**Modified:**
- `cyber/models/types.py` — Model dataclass +3 fields
- `cyber/db/schema.py` — INSERT OR REPLACE for new columns; CREATE TABLE migration
- `scripts/load_benchmark_scores.py` — map new fields from seed JSON
- `cyber/publisher/exporter.py` — new `_export_enrichment` method
- `dashboard/js/modal.js` — new sections, lazy-load enrichment, integrate peer-matcher
- `dashboard/js/app.js` — load `model_enrichment.json` in App.data on demand
- `dashboard/index.html` — cache-bust modal.js + new peer-matcher.js script tag

**Created:**
- `dashboard/js/peer-matcher.js` — `findPeers`, `sotaTier`, `extractStrengthsWeaknesses` (pure functions, no globals)
- `config/model_enrichment.yaml` — frontier-30 hand-curated enrichment
- `data/export/model_enrichment.json` — generated by exporter
- `tests/test_model_schema_extensions.py`
- `tests/test_enrichment_export.py`
- `dashboard/js/__tests__/peer-matcher.test.js` (or vanilla harness)

**Deferred to v1.5:**
- Auto-extraction script for `_note` field parsing
- Comprehensive Playwright suite
