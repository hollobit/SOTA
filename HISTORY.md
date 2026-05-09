# LLM Benchmark SOTA Dashboard — Work History

## 2026-05-10 (Session 11): Reference-link investigation sweeps — 5 ingest rounds (21 models, 6 benchmarks, 38 scores, 15 Resources refs)

### 17. 5-round 참조 링크 조사 (commits `45c1035` → `25b3c55`)

User-provided reference links 13개 (3 batches: 5+3+3+2)를 조사하고 strict-attribution rule 하에 1차 source에서 확인 가능한 정량 데이터만 ingest. 매 round는 별도 JSON file + 별도 changelog entry로 분리해서 추적성 유지.

**Round 1 — Nemotron Elastic + OpenAI Voice + Luma UNI-1** (commit `45c1035`):
- 5 links: HF model card BF16/FP8/NVFP4 (×3) + Luma UNI-1 + OpenAI Voice announcement
- **+8 models**: nvidia/nemotron-labs-3-elastic-30b/23b/12b-a3b (3 sliced variants from Star Elastic ICML 2026 paper) + openai/gpt-realtime-1.5/2/translate/whisper (4 voice models May 2026 release) + luma/uni-1 (image FM, no scores)
- **+3 benchmarks**: livecodebench_v5, big_bench_audio, audio_multichallenge
- **+19 scores**: 3 elastic × 5 benchmarks (AIME/GPQA/LiveCodeBench v5/MMLU-Pro/IFBench) + gpt-realtime-2 + 1.5 × audio benchmarks (96.6/81.4 + 48.5/34.7)

**Round 2 — Epoch ECI + MolmoAct2 + saturation analysis** (commit `a0a4878`):
- 3 links: epoch.ai/eci + arxiv 2605.02881 (MolmoAct2) + Epoch substack RIP Classic Reasoning Benchmarks
- **+2 models**: allenai/molmoact2, allenai/molmoer (VLM backbone, metadata only — PDF >10MB)
- **+2 benchmarks**: epoch_capabilities_index, epoch_capabilities_index_swe (composite metric registered)
- **+2 scores**: ECI calibration anchors per primary source explicit definition (claude-3.5-sonnet=130, gpt-5=150)
- 검증: substack 인용 "Claude Mythos GraphWalks 80%" → DB의 graphwalks_bfs 80.0과 정확 일치

**Round 3 — Resources references** (commit `461c850`):
- **+11 references** to dashboard/js/app.js 통합 그룹 `// ── 2026-05-10 link-investigation additions ──`
- Epoch ECI ecosystem 5 (epoch.ai/eci, 2 substacks, LessWrong intro, Benchmarks alt URL)
- NVIDIA Nemotron Elastic 4 (BF16/FP8/NVFP4 HF cards + arxiv 2511.16664 Star Elastic ICML 2026)
- OpenAI Voice 1, Luma UNI-1 1, MolmoAct2 1
- Cache-bust app.js v=20260510a, deploy 검증 461c8505 SHA prefix

**Round 4 — Audio MultiChallenge + Big Bench Audio deep-dive** (commit `db64d5b`):
- Round 3에서 추가한 references를 deep-dive: Scale Labs Audio MultiChallenge leaderboard (labs.scale.com/leaderboard/audiomc, arxiv 2512.14865) 30 entries 채굴 + HF Big Bench Audio release blog
- **+9 models**: gemini-3.1-flash-live-preview, gemini-2.5-flash-native-audio-preview, gpt-4o-audio-preview, gpt-4o-mini-audio-preview, gpt-realtime-mini, qwen3-omni-30b-a3b-instruct (separate from existing thinking variant), mimo-audio-7b-instruct, kimi-audio-7b-instruct, lfm2-audio-1.5b
- **+17 scores**: 16 Audio MultiChallenge (gemini-3-pro-preview 54.65 rank #1 / gemini-2.5-pro 46.90 / gemini-2.5-flash 40.04 / 등) + 1 Big Bench Audio (gpt-4o = 92 text-only baseline)
- Skipped duplicates: gpt-realtime-2 48.45 = 48.5 in DB; gpt-realtime-1.5 34.73 = 34.7

**Round 5 — CaP-X + Genesis AI GENE-26.5** (commit `25b3c55`):
- 3 links: github.com/capgym/cap-x + arxiv 2603.22435 + genesis.ai/press
- **+2 models**: genesis-ai/gene-26.5 (robotic FM May 6 2026, Eric Schmidt + Xavier Niel 투자) + nvidia/cap-agent0 (training-free agentic framework, NVIDIA + Stanford + Berkeley + UT Austin, Fei-Fei Li / Linxi Jim Fan 저자)
- **+1 benchmark**: cap_bench (39 robot manipulation tasks × 8 tiers S1-S4 + M1-M4, Robosuite + LIBERO-PRO + BEHAVIOR-1K, 12 frontier models 평가)
- **+0 scores** (arxiv PDF >10MB / HTML 추출에서 Appendix B Full Benchmark Table 미포함, qualitative claims만 — strict-attribution defer)
- **+4 Resources references**: CaP-X project page + GitHub + paper + Genesis AI

**스코어카드 Total (5 rounds)**:
- 신규 모델: **+21** (1721 → 1742)
- 신규 benchmarks: **+6** (933 → 939)
- 신규 scores: **+38** (3785 → 3823)
- Resources references: **+15** (Audio + Robotics + Foundational AI sources)
- Audio MultiChallenge benchmark: 0 → 16 entries with full leaderboard top-N coverage
- Big Bench Audio: 0 → 3 entries

**파일 deltas**:
- 5 new ingest JSON files in `resource/zzz_2026_05_10_*.json`
- `dashboard/js/app.js`: +15 Resources entries (~25 LOC)
- `data/export/reports/changelog.json`: +5 detailed per-round entries

**병렬 작업 패턴**: Round별 sequential. 각 round = WebFetch/WebSearch 조사 + DB 매핑 확인 + JSON 작성 + loader 검증 + commit + push + CI deploy + live 검증. 매 round 평균 ~12-15분. CI race condition 1회 발생 (Round 3 deploy → 첫 trigger가 이전 commit 기준 → 재trigger로 해결).

**Strict-attribution rule 효과**:
- Total candidate ingest items: 약 60건 (5 rounds 합산)
- Actual ingest: 38 scores + 21 models + 6 benchmarks
- Reject 사유: PDF 크기 한계 (CaP-X / MolmoAct2), Elo-only / qualitative claims (Luma UNI-1 / Genesis AI), 모델 attribution 부재 (PostTrainBench 51.1%, IKEA assembly ~40%)

**Live deploy**: 매 round CI run completion + cache-bust 검증. 최종 cache-bust SHA prefix `25b3c55` (round 5 commit).

---

## 2026-05-09 (Session 10): Sovereign AI menu widget expansion — 6 NEW widgets (11 tasks, 11 commits)

### 16. Sovereign AI 위젯 확충 (commits `55db2d9` → `6cbc145`)

**Focused approach**: Sovereign AI는 이미 9 widgets (Region Map / Timeline / Cumulative / Country Radar / Country Leaderboard / 3 Dimension renders / Perf Suites / Agent Products / Heatmap)을 보유하므로 다른 메뉴와 동일한 10개 widget을 강제 추가하지 않고, **부족한 영역에 6 NEW widgets만** 추가. 다른 메뉴와 차별화된 scope.

브레인스토밍(이전 메뉴별 별도 spec 합의 B 옵션) → spec(`docs/superpowers/specs/2026-05-09-sovereign-ai-widget-expansion-design.md`, 262 LOC) → plan(`docs/superpowers/plans/2026-05-09-sovereign-ai-widget-expansion.md`, 573 LOC) → subagent-driven 실행.

**Phase 1A — Foundation (Tasks 1-3)**:
- **Task 1 (`55db2d9`)**: UMD skeleton + `_BENCHMARK_DIMENSION_MAP` (29 entries: language/medical/domain) + `_resolveDimension` + 7-assertion test.
- **Task 2 (`e291c25`)**: `_ensureMountPoint` factory (a11y role=img/aria-label) + `_ensureSovereignChartsStyle` (mobile + reduced-motion) + `_applyToolbox` + `renderAll` stub. `<div id="sovereign-charts">` + `<script>` wired in index.html, `SovereignCharts.renderAll()` called from `Sovereign.render()`.
- **Task 3 (`a9f295c`)**: `_SOV_BREAKTHROUGHS` 8 milestone tiles (KMed.ai SNUH×Naver / HyperCLOVA X / DeepSeek V4 Pro / Qwen 3.6 Plus / Mistral Large 3 / Falcon TII / Aya 23 Cohere / Sea-LION v4) — 6 regions, flag emoji + region accent.

**Phase 1B — 3 immediate widgets (Tasks 4-6)**:
- **W1 Hero Cards** (`a421a64`): 8 anchor tiles, 4-col grid, region-color border-left + flag emoji. SOTA Watch sub-section (이전엔 없었던 sovereign-only NEW).
- **W3 VLAIR Legal Sub-benchmarks Radar** (`dc3f3ff`): top-5 models × 5 VLAIR sub-benches (doc_qa/summarization/chronology/redlining/data_extract). Coverage ≥3.
- **W6 Sovereign Benchmark Catalog Grid** (`31dc2a0`): searchable DOM table, ~28 sovereign-tagged benchmarks with dimension pill (language=blue/medical=emerald/domain=violet) + paper link.

**Phase 2 — 3 data-dependent widgets (Tasks 7-9)**:
- **W2 Frontier vs Sovereign-Specialist** (`20c5245`): grouped bar — frontier 5 LLMs vs sovereign 8 (DeepSeek/Qwen/Mistral/Falcon/Aya/Sea-LION/HyperCLOVA/Kimi) on multilingual benchmarks (mmmlu/c_eval/cmmlu/chinese_simpleqa/global_piqa/swe_bench_multilingual).
- **W4 Multi-language Progression** (`9d7ced1`): 6 multilingual benches multi-line over release_date.
- **W5 Per-Dimension Drill-down Modal** (`d836895`): Shift+click on dimension card (`#sov-<dim.id>-chart`) → modal with per-dimension composite. 3rd unit test (composite arithmetic).

**Phase 3 — Polish + deploy (Tasks 10-11)**:
- **Task 10 Lazy render** (`6db5e61`): renderAll → eager 2 (Hero/VLAIR) + lazy 3 (Frontier-vs-Sov / Multi-lang / Catalog) via requestIdleCallback (timeout 1500ms) + setTimeout fallback.
- **Task 11 Cache-bust + deploy** (`6cbc145`): `?v=20260509c` for sovereign.js + `?v=20260509b` for sovereign-charts.js. Push to origin/ops, trigger benchmark-update.yml CI.

**파일 deltas**:
- `dashboard/js/sovereign-charts.js`: NEW **872 LOC**
- `dashboard/js/__tests__/sovereign-charts.test.js`: NEW **(3 tests)**
- `dashboard/js/sovereign.js`: +5 LOC (renderAll hook + Shift+click handler with `_sovDimDrillWired` once-flag)
- `dashboard/index.html`: +3 LOC (mount div + script tag + cache-bust)
- `docs/superpowers/specs/2026-05-09-sovereign-ai-widget-expansion-design.md`: NEW (262 LOC)
- `docs/superpowers/plans/2026-05-09-sovereign-ai-widget-expansion.md`: NEW (573 LOC)

**스코어카드**:
- 위젯: Sovereign AI 9 → **15** (기존 9 + 6 NEW = W1/W2/W3/W4/W5/W6)
- 신규 unit test: **+3** (`_resolveDimension` / `_SOV_BREAKTHROUGHS` schema / `_perDimensionComposite`)
- 11 commits, subagent-driven-development pattern (sequential per-task)
- 신규 데이터 ingest 0건

**4-menu cumulative (Sessions 7-10)**:
- 신규 widget JS modules: **4** (ai4s 1240 + medical 1293 + physical 1327 + sovereign 872 = **4732 LOC**)
- 신규 unit tests: **15** (4+4+4+3)
- 신규 widgets: **36** (10+10+10+6)
- 신규 specs/plans: **8 docs** (4 specs + 4 plans, ~5,200 LOC)
- Total commits across S7-S10: **~60**

**Live deploy**: CI run `25601793594` triggered, awaiting completion.

---

## 2026-05-09 (Session 9): Physical AI menu widget expansion — 10 widgets (16 tasks, 16 commits)

### 15. Physical AI 위젯 확충 (commits `4bf0dcb` → `b8ada37`)

기존 2 chart widgets (timeline + radar) → **12 widgets**. AI4S/Medical AI 패턴 그대로 적용. Sub-section 구조: SOTA Watch + 5 Category Cards + Cross-Family Compare + Per-Category Mini-Leaderboards.

브레인스토밍(이전 메뉴별 별도 spec 합의 B 옵션) → spec(`docs/superpowers/specs/2026-05-09-physical-ai-widget-expansion-design.md`, 276 LOC) → plan(`docs/superpowers/plans/2026-05-09-physical-ai-widget-expansion.md`, 453 LOC) → subagent-driven 실행.

**Phase 1A — Foundation (Tasks 1-4)**:
- **Task 1 (`4bf0dcb`)**: UMD skeleton + `_FAMILY_MAP` (10 robot/vendor families: gr00t/pi/openvla/octo/gemini-robotics/industrial-humanoid/industrial-fm/world-model/human-vision/industrial-vendor) + `_resolveFamily(modelId, modelName)` + 10-assertion test.
- **Task 2 (`5802d84`)**: `_BENCHMARK_FAMILY_MAP` (28 entries: vla-manipulation/world-model/embodied-reasoning) + `_resolveSuite` + test.
- **Task 3 (`71c10fe`)**: `_ensureMountPoint` factory + `_ensurePhysicalAIChartsStyle` + `_applyToolbox` + `renderAll` stub. `<div id="physical-ai-charts">` + `<script>` wired in index.html, `PhysicalAICharts.renderAll()` from `PhysicalAI.render()`.
- **Task 4 (`815d18f`)**: `_PHY_BREAKTHROUGHS` 8 milestone tiles (NVIDIA GR00T-N1.7 / Gemini Robotics ER 1.6 / π-zero / OpenVLA-7B / NVIDIA Cosmos / FoxBrain 70B / Figure Helix / Meta Sapiens2) + schema test.

**Phase 1B — 5 immediate-render widgets (Tasks 5-9)**:
- **W1 Hero Cards** (`0b60320`): 8 anchor tiles, 4-col grid, 5-domain palette + gray fallback.
- **W2 Family × Benchmark Suite Coverage Matrix** (`0468881`): 11 robot families × 3 suite categories heatmap.
- **W3 LIBERO Suite Radar** (`274d5b5`): top-5 models × 5 LIBERO sub-benches (libero/spatial/object/goal/long). Coverage ≥3.
- **W6 LIBERO Progression Curve** (`1691010`): 5 LIBERO sub-benches multi-line over release_date.
- **W10 Physical AI Benchmark Catalog Grid** (`2f32a14`): searchable DOM table for ~28 physical-AI-tagged benchmarks.

**Phase 2B — 5 data-dependent widgets (Tasks 10-14)**:
- **W4 World Model Quality Radar** (`70e76f2`): top-5 models × 6 sub-benches (cosmos × 3 + world_model × 3). Coverage ≥2.
- **W5 Per-Category Mini-Leaderboard Modal** (`933523f`): Shift+click on category card → modal with per-category composite (max-normalized mean over all physical AI benchmarks). 4th unit test (composite arithmetic).
- **W7 Sim-to-Real Compare** (`7330057`): top-model bar across simpler_env_avg / robocasa / robocasa365.
- **W8 Industrial Deployment Map** (`30a2561`): DOM cards for manufacturing-fm + industrial-robots categories with `_DEPLOYMENT_STATUS` metadata table (FoxBrain/Helix/Optimus/Apollo/Digit/Carbon/SiFM/Bosch 등 12개 vendor 배포 status).
- **W9 Embodied Reasoning Heatmap** (`675fbf7`): top-8 models × 3 cosmos sub-benches (red→green visualMap). Coverage ≥1.

**Phase 3 — Polish + deploy (Tasks 15-16)**:
- **Task 15 Lazy render** (`611ddc5`): renderAll → eager 3 (Hero/Family/LIBERO) + lazy 6 via requestIdleCallback (timeout 1500ms) + setTimeout fallback.
- **Task 16 Cache-bust + deploy** (`b8ada37`): `?v=20260509b` for physical-ai.js + physical-ai-charts.js. Push to origin/ops, trigger benchmark-update.yml CI.

**파일 deltas**:
- `dashboard/js/physical-ai-charts.js`: NEW **1327 LOC**
- `dashboard/js/__tests__/physical-ai-charts.test.js`: NEW **(4 tests)**
- `dashboard/js/physical-ai.js`: +5 LOC (renderAll hook + Shift+click)
- `dashboard/index.html`: +3 LOC (mount div + script tag + cache-bust)
- `docs/superpowers/specs/2026-05-09-physical-ai-widget-expansion-design.md`: NEW (276 LOC)
- `docs/superpowers/plans/2026-05-09-physical-ai-widget-expansion.md`: NEW (453 LOC)

**스코어카드**:
- 위젯: Physical AI 2 → **12** (timeline + radar + W1-W10)
- 신규 unit test: **+4** (`_resolveFamily` / `_resolveSuite` / `_PHY_BREAKTHROUGHS` schema / `_perCategoryComposite`)
- a11y: role=img + aria-label + tabindex on every chart mount, mobile @media ≤768px, prefers-reduced-motion
- 16 commits, subagent-driven-development pattern (sequential per-task)
- 신규 데이터 ingest 0건 — 모든 widget이 현재 데이터로 작동

**Live deploy**: CI run `25589049659` triggered, awaiting completion.

---

## 2026-05-09 (Session 8): Medical AI menu widget expansion — 10 widgets (16 tasks, 16 commits)

### 14. Medical AI 위젯 확충 (commits `1ac79cb` → `73d1917`)

기존 2 chart widgets (timeline + radar) → **10+ widgets**. AI4S 패턴(Session 7) 그대로 적용. Sub-section 구조: SOTA Watch + 18 Category Cards + Cross-Specialty Compare + Per-Category Mini-Leaderboards.

브레인스토밍 (이전 메뉴별 별도 spec 합의 B 옵션 적용) → spec(`docs/superpowers/specs/2026-05-09-medical-ai-widget-expansion-design.md`, 341 LOC) → plan(`docs/superpowers/plans/2026-05-09-medical-ai-widget-expansion.md`, 1238 LOC) → subagent-driven 실행.

**Phase 1A — Foundation (Tasks 1-4)**:
- **Task 1 (`1ac79cb`)**: UMD skeleton + `_SPECIALTY_MAP` (12 medical specialties: general/biomedical/radiology/pathology/derm/cardio/onc/protein/multilingual/safety/mental-health/other) + `_resolveSpecialty(modelId, modelName)` + 8-assertion test.
- **Task 2 (`b4cb99c`)**: `_BENCHMARK_CATEGORY_MAP` (28 entries: clinical-knowledge/biomedical-research/healthbench/specialty/multilingual/dialog) + `_resolveCategory` + test.
- **Task 3 (`26ef737`)**: `_ensureMountPoint` factory (a11y role=img/aria-label) + `_ensureMedicalAIChartsStyle` (mobile + reduced-motion) + `_applyToolbox` + `renderAll` stub. `<div id="medical-ai-charts">` + `<script>` wired in index.html, `MedicalAICharts.renderAll()` called from `MedicalAI.render()`.
- **Task 4 (`da2255f`)**: `_MED_BREAKTHROUGHS` 8 milestone tiles (Med-Gemini-3-Pro / Med-PaLM 2 USMLE 86.5 / MedGemma 27B / Polaris-3 / OpenBioLLM-70B / M42 Med42-v2-70B / HuatuoGPT-o1 72B / KMed.ai SNUH×Naver) + schema test.

**Phase 1B — 5 immediate-render widgets (Tasks 5-9)**:
- **W1 Hero Cards** (`851499b`): 8 anchor tiles, 4-col grid, 11-domain medical palette + gray fallback.
- **W2 Specialty × Benchmark Matrix** (`f41b4a1`): 12 specialties × 6 benchmark categories heatmap. Cell = distinct model count.
- **W4 HealthBench Sub-benchmarks Radar** (`0c99587`): top-5 models × 7 sub-benches (consensus/professional/care_consult/redteam/research/goodfaith/writing). Coverage ≥3 filter.
- **W6 USMLE Progression Curve** (`f9889ec`): medqa_usmle 34 scores time-series with 0-100 yAxis.
- **W10 Medical Benchmark Catalog Grid** (`27f1787`): searchable DOM table for ~30 medical-tagged benchmarks.

**Phase 2B — 5 data-dependent widgets (Tasks 10-14)**:
- **W3 Frontier vs Medical-Specialist** (`2ec8f52`): grouped bar — frontier 6 LLMs vs medical specialist 8 (Med-Gemini/MedGemma/Med-PaLM/Med42/OpenBioLLM/Meditron) on shared MedQA-class benchmarks.
- **W5 Per-Category Mini-Leaderboard Modal** (`47a168a`): Shift+click on category card → modal with per-category composite (max-normalized mean over all medical benchmarks). 4th unit test (composite arithmetic).
- **W7 Multi-language Medical Compare** (`813bb7f`): top-model bar across mmedbench / jmedbench / medbench_cn / climedbench_cn.
- **W8 Medical Safety Heatmap** (`ee23666`): top-8 models × 5 safety sub-benches (red→green visualMap). Coverage ≥2.
- **W9 Clinical Prediction Bubble** (`4c4b0f0`): scatter (n scored × avg score) for clinical-prediction category models. MIMIC/eICU emphasis.

**Phase 3 — Polish + deploy (Tasks 15-16)**:
- **Task 15 Lazy render** (`0c71f44`): renderAll → eager 3 (Hero/Specialty/HealthBench) + lazy 6 via requestIdleCallback (timeout 1500ms) + setTimeout fallback.
- **Task 16 Cache-bust + deploy** (`73d1917`): `?v=20260509b` for medical-ai.js + medical-ai-charts.js. Push to origin/ops, trigger benchmark-update.yml CI.

**파일 deltas**:
- `dashboard/js/medical-ai-charts.js`: NEW **1293 LOC**
- `dashboard/js/__tests__/medical-ai-charts.test.js`: NEW **(4 tests)**
- `dashboard/js/medical-ai.js`: +5 LOC (renderAll hook + Shift+click handler)
- `dashboard/index.html`: +3 LOC (mount div + script tag + cache-bust)
- `docs/superpowers/specs/2026-05-09-medical-ai-widget-expansion-design.md`: NEW (341 LOC)
- `docs/superpowers/plans/2026-05-09-medical-ai-widget-expansion.md`: NEW (1238 LOC)

**스코어카드**:
- 위젯: Medical AI 2 → **12** (W1/W2/W3/W4/W5/W6/W7/W8/W9/W10 + 기존 timeline + radar)
- 신규 unit test: **+4** (`_resolveSpecialty` / `_resolveCategory` / `_MED_BREAKTHROUGHS` schema / `_perCategoryComposite`)
- a11y: role=img + aria-label + tabindex on every chart mount
- 16 commits, subagent-driven-development pattern (sequential per-task)
- 신규 데이터 ingest 0건 — 모든 widget이 현재 데이터(881 benchmarks, 3488 scores)로 작동

**Live deploy**: CI run `25587893301` triggered, awaiting completion.

---

## 2026-05-09 (Session 7): AI4S menu widget expansion — 10 widgets across 2 phases (19 tasks, 17 commits)

### 13. AI4S 위젯 신설 (commits `5489408` → `0c21c75`)

기존 0 chart widgets → **10 widgets** + 4 unit tests + 2 새 데이터 file. Sub-section 구조: SOTA Watch + 19 Domain Cards + Cross-Lab Compare + Domain Mini-Leaderboards.

브레인스토밍(/superpowers:brainstorming) → spec(`docs/superpowers/specs/2026-05-09-ai4s-widget-expansion-design.md`, 258 LOC) → plan(`docs/superpowers/plans/2026-05-09-ai4s-widget-expansion.md`, 2171 LOC) → subagent-driven 실행.

**Phase 1A — Foundation (Tasks 1-4, 4 sequential commits)**:
- **Task 1 (`5489408`)**: UMD skeleton + `_LAB_MAP` (16 labs) + `_resolveLab` + 7-assertion node test.
- **Task 2 (`e715972`)**: `_BENCHMARK_DOMAIN_MAP` (43 entries: bio-genomics/math/physics-materials/geo-climate) + `_resolveDomain` + test.
- **Task 3 (`51e6fd6`)**: `_ensureMountPoint` factory (a11y role=img/aria-label/tabindex) + `_ensureAi4sChartsStyle` (mobile + reduced-motion) + `_applyToolbox` + `renderAll` stub. Wired `<div id="ai4s-charts">` + `<script>` in index.html, `AI4SCharts.renderAll()` call from `AI4S.render()`.
- **Task 4 (`1ec8005`)**: `_BREAKTHROUGHS` 8 milestone tiles (AlphaFold 3 / AlphaProof / Aurora / MatterGen / Evo 2 / AlphaQubit / Chai-2 / Goedel-Prover v2) + schema test.

**Phase 1B — 5 immediate-render widgets (Tasks 5-9, 5 sequential commits)**:
- **W1 Breakthrough Hero Cards** (`a24cf60`): SOTA Watch sub-section, 8 anchor tiles, 4-column grid, 9-domain palette + gray fallback.
- **W2 Lab × Domain Bubble Matrix** (`970351d`): 16 labs × 19 domains heatmap. Cell value = distinct model count.
- **W4 Breakthrough Timeline** (`80733c2`): year (2017-2026) × milestone scatter, color = domain. Source-link tooltip.
- **W6 Math Progression Curve** (`45522aa`): 7 math benchmarks multi-line vs release date. Includes shared helpers `_scoresFor`, `_modelReleaseDate`.
- **W10 Benchmark Catalog Grid** (`5e6e6e5`): searchable DOM table for AI4S-tagged benchmarks (~33 entries) with domain pill + paper link.

**Phase 2A — Data sweeps (Tasks 10-12, 3 parallel agents)**:
- **Task 10 W7 Weather skill** (`ca5869e`): Pangu-Weather Z500 RMSE@72h = 134.5 (Bi et al. Nature 2023). Aurora/GraphCast/AIFS skipped — RMSE only in figures, no numerical text. Strict-attribution maintained. +1 score, +1 benchmark (`weatherbench_z500_72h`).
- **Task 11 W8 CASP12-15** (`33108b4`): AlphaFold-2 CASP14 GDT-TS = 92.4 (DeepMind blog). CASP12/13/15 skipped — predictioncenter only z-scores; Nature paywall; WebFetch denied. 4 benchmark stubs registered. +1 score.
- **Task 12 W9 Matbench Discovery** (`73b6183`): 7 models × 2 metrics = 14 scores from matbench-discovery.materialsproject.org leaderboard (CHGNet/MACE-MP-0/GNoME/MatterSim/ORB v2/ORB v3/EquiformerV2). MatterGen yield benchmark not created (paper has only relative percentages). +14 scores, +2 benchmarks.

Net Phase 2A: **+16 scores, +7 benchmarks** (DB 874→881 benchmarks, 3472→3488 scores).

**Phase 2B — 5 data-dependent widgets (Tasks 13-17, 5 sequential commits)**:
- **W3 Frontier vs Specialist Compare** (`5e31048`): grouped bar across math benchmarks, frontier 5 LLMs vs specialist 5 (AlphaProof/AlphaGeometry-2/Goedel/Kimi-math/Llemma).
- **W5 Per-Domain Mini-Leaderboard Modal** (`2041aa0`): Shift+click on domain card → modal with per-domain composite (max-normalized mean, coverage ≥1). 4th unit test (composite arithmetic).
- **W7 Weather Forecast Skill Curve** (`dd7e434`): line+area on `weatherbench_z500_72h`. Empty state with current 1 datapoint.
- **W8 CASP Protein Folding Progression** (`f7e0b71`): step-line CASP12→16. Renders 2 datapoints (CASP14 + CASP16).
- **W9 Materials Discovery Yield** (`fc0d49a`): bubble on MAE × yield × F1. 7 models render with yield=0 axis until mattergen_yield ingested.

**Phase 3 — Polish + deploy (Tasks 18-19, 2 commits)**:
- **Task 18 Lazy render** (`d63ec54`): renderAll → eager 3 (Hero/Lab×Domain/Timeline) + lazy 6 via requestIdleCallback (timeout 1500ms) + setTimeout fallback. 초기 paint 차단 방지.
- **Task 19 Cache-bust + deploy** (`0c21c75`): `?v=20260509b` for ai4s.js + ai4s-charts.js. Push to origin/ops, trigger benchmark-update.yml CI.

**파일 deltas**:
- `dashboard/js/ai4s-charts.js`: NEW **1240 LOC**
- `dashboard/js/__tests__/ai4s-charts.test.js`: NEW **47 LOC** (4 tests)
- `dashboard/js/ai4s.js`: +5 LOC (renderAll hook + Shift+click handler)
- `dashboard/index.html`: +3 LOC (mount div + script tag + cache-bust)
- `resource/zzz_w7_weather_skill_2026_05_09_scores.json`: NEW
- `resource/zzz_w8_casp_progression_2026_05_09_scores.json`: NEW
- `resource/zzz_w9_matbench_discovery_2026_05_09_scores.json`: NEW
- `docs/superpowers/specs/2026-05-09-ai4s-widget-expansion-design.md`: NEW (258 LOC)
- `docs/superpowers/plans/2026-05-09-ai4s-widget-expansion.md`: NEW (2171 LOC)

**스코어카드**:
- 위젯: AI4S 0 → **10** (W1/W2/W3/W4/W5/W6/W7/W8/W9/W10)
- 신규 score: **+16** (3472→3488)
- 신규 benchmark: **+7** (874→881)
- 신규 unit test: **+4** (vanilla node assert pattern)
- a11y: role=img + aria-label + tabindex on every chart mount, mobile @media ≤768px, prefers-reduced-motion
- 17 commits 세션, subagent-driven-development 패턴 (per-task 별도 dispatch + spec/code review for foundation, 데이터 sweep만 병렬 3 agents)

**Live deploy**: CI run `25583205588` triggered, awaiting completion.

---

## 2026-05-09 (Session 6): Agent menu A+B+C+D+E — 18 sub-tasks across 5 waves (16 commits)

### 12. 풀 스펙트럼 batch (commits `3065c59` → `f1c8df6`)

사용자가 "A+B+C+D+E를 진행해주세요" — 단일 세션에서 모든 카테고리(데이터 + UX + 위젯 + 통합 + 문서화) 동시 진행. 18 sub-task를 5 wave로 분해해서 14 병렬 에이전트 (Wave 1×6 + Wave 2×4 + Wave 3×4) + 4 controller-direct 작업(Wave 4 E2/B3, Wave 5 B1/B2) 실행. 총 16 commits (15 작업 + 1 docs).

**Wave 1 (6 병렬 — data + cross-tab files isolated)**:
- **A1 VL/multi-agent/reasoning expansion** (`50f6a72`): VL agent benchmarks +5 (visualagentbench/online_mind2web), reasoning trace +9 (METR p50/p80/ProcessBench/QwQ-32B). Multi-agent 0 (출처 고갈). +14 scores. Strict-attribution 유지.
- **A2 Edge SLM 5→9 expansion** (`ccf1eba` 번들): Phi-4 (14B) BFCL v4/v3-live/v3-multi-turn 3건. Apple FM 3B / Gemma-3-270m / Gemma-3n는 공식 1차 출처 부재로 스킵.
- **A3 api_providers enrichment** (`3065c59`): 61 → 104 모델 (+43). OpenAI/Anthropic/Google/Chinese/xAI/Meta/Mistral/Cohere/regional 모두 포함.
- **A4 frontier agentic backfill** (`b3f4758`): bfcl_v4 7→25 (+18), gaia 10→16 (+6), osworld_verified +2, terminal_bench_2 +1, usaco +1. Berkeley Gorilla CSV + HAL Princeton + Anthropic launch announcements 출처. +27 scores 5 benchmarks.
- **D1 Frontier Compare class filter** (`803ccd4`): 3 pill toggles (Frontier/Agent-Product/Edge-SLM), LocalStorage 영속, 클래스 색깔 매핑(blue/amber/emerald). 117 LOC.
- **D2 Sovereign agent products** (`ccf1eba`): 7개 sovereign agent products (Manus/Qwen Code/AutoGLM/Coze/Kimi/Solar Pro 2/Sarvam-M Agent), China 5 + Korea 1 + India 1. Manus는 main Agent 메뉴와 cross-link.

**Wave 2 (4 병렬 — different JS files)**:
- **D3 Resources agent leaderboards** (`767ea42`): Resources 탭에 18개 agentic leaderboard 항목 (HAL/AgentBench/VisualAgentBench/Mind2Web/ScreenSpot/OSWorld/BFCL/Aider/Terminal-Bench/SWE-Bench/Tau/AgentDojo/METR/Apollo/RewardBench/ProcessBench/USACO/AppWorld 등).
- **E1 Methodology page** (`2ec37fb`): 신규 `dashboard/methodology.html` 352 LOC — composite score 공식, 3 클래스 정의, strict-attribution 정책, Pareto frontier 정의, edge SLM cost treatment, 14 widget inventory, versioning. Header pill + footer 링크.
- **E3 Stale-score badge** (`b1aa91e`): 90+일 된 점수에 amber `90d+` 배지 + 한국어 툴팁. modal.js 3 render location (showBenchmark/score history/score breakdown).
- **B4 PDF export** (`9884a36`): Agent 탭 상단 `🖨 Export PDF` 버튼 + 신규 `dashboard/css/print.css` (127 LOC). `window.print()` 트리거, A4 페이지 사이즈, 위젯별 page-break.

**Wave 3 (4 병렬 — agent-charts.js NEW widgets, cache-bust q/r/s/u)**:
- **C1 W15 Vendor × Benchmark Coverage Matrix** (`ea97b8e`): 12 vendors × 12 core benchmarks heatmap, cell value = 점수 보유 모델 수. 가시적 reporting gaps. +195 LOC.
- **C2 W16 Score Trajectory Replay** (`794a3ba`): ECharts timeline keyframe 애니메이션. score_history snapshots 활용. 기본 swe_bench_verified, 5 dates 미만 시 empty state. +221 LOC.
- **C3 W17 Multi-Source Confidence Intervals** (`fc606f2`): (model, benchmark) 쌍 중 ≥2 distinct sources를 dumbbell chart로. 38 disputed pairs detected (cybench/cybergym 가장 큰 disagreement). +283 LOC.
- **C5 W19 Edge SLM Utility Scatter** (`e15d700`): edge_models_utility.json의 size_gb × battery_pct × composite score 3D-ish bubble. 7/9 SLMs 플롯. +246 LOC.

**Wave 4 (controller direct — agent-charts.js sequential)**:
- **E2 Wizard tooltips** (`a0216e7`): Build Your Agent 위저드 7개 슬라이더에 ⓘ icon + benchmark 설명 (예: "BFCL v4, GAIA, Tau2-Bench, AppWorld. API 호출, 함수 시그니처 매칭, 다단계 도구 조합").
- **B3 Lazy render** (`a0216e7`): renderAll → eager(4 above-fold) + lazy(12 below-fold via requestIdleCallback). 초기 paint가 ~12 ECharts.init 동시 실행으로 막히지 않음. setTimeout fallback.

**Wave 5 (controller direct — mobile + a11y)**:
- **B1 Mobile responsive** (`15f86de`): one-time `<style>` injection — `@media (max-width:768px)` chart 높이 420→320px, canvas max-width 100%, h2 1rem.
- **B2 Accessibility** (`15f86de`): 모든 chart mount div에 role=img + aria-label (title + hint), tabindex=0, focus outline. `prefers-reduced-motion` ECharts 애니메이션 0.001s로 단축.

**총 스코어카드**:
- 신규 점수: **+44** (3432→3476): A1 +14, A2 +3, A4 +27
- 신규 위젯: **W15/W16/W17/W19** (4개 추가, 14→18 widgets, W18 deferred)
- 모델 enrichment: api_providers 61→**104** (+43)
- Cross-tab UI: Frontier Compare class filter, Sovereign agent products section, Resources agentic leaderboards section
- 새 페이지: `methodology.html` (352 LOC)
- UX/a11y: PDF export, stale-score badge, wizard tooltips, lazy render, mobile responsive, role=img/aria-label/reduced-motion

**파일 deltas**:
- `dashboard/js/agent-charts.js`: 3877 → **4883 LOC** (+1006)
- `dashboard/js/app.js`: +20 (D3)
- `dashboard/js/frontier-compare.js`: +117 (D1)
- `dashboard/js/sovereign.js`: +174 (D2)
- `dashboard/js/modal.js`: stale-badge function + 3 callsites (E3)
- `dashboard/js/agent.js`: +PDF button (B4)
- `dashboard/methodology.html`: NEW 352 LOC
- `dashboard/css/print.css`: NEW 127 LOC
- `config/model_enrichment.yaml`: +220 lines (A3)
- `resource/zzz_w6a2_edge_slm_2026_05_09_scores.json`: NEW (A2)
- `resource/zzz_w6a4_frontier_agentic_2026_05_09_scores.json`: NEW (A4)

**병렬 작업 패턴**:
- Wave 1 6 에이전트가 6개 독립 파일 → conflict 없이 병렬 진행. D2가 D1+A2 변경을 같은 commit에 번들한 마이너 race 발생.
- Wave 2 4 에이전트가 다른 4개 JS 파일 → 충돌 없음.
- Wave 3 4 에이전트 모두 agent-charts.js NEW 함수 → cache-bust race-aware bumping (q→r→s→t→u, C3가 t 충돌 보고 u로 점프).

**Live deploy**: CI runs `25575571685` (Wave 5 push) + `25575673196` (docs push). 라이브 cache-bust SHA prefix `f1c8df64`. 라이브 JS에서 `renderVendorCoverageMatrix`(3) / `renderTrajectoryReplay`(3) / `renderConfidenceIntervals`(3) / `renderEdgeUtilityScatter`(3) / `requestIdleCallback`(3) / `_ensureAgentChartsStyle`(2) 마커 모두 확인.

**Main 동기화**: `cc88549` (HISTORY.md only, docs-only main rule 준수).

---

## 2026-05-08 (Session 5): Agent menu A+B+C — loader 2-pass + 20 new benchmarks + 3 new widgets + cross-widget brushing

### 11. Agent 탭 다음 라운드 (commits `5a0128b` → `f0a77b9`)

Session 4 batch 직후 사용자가 "A+B+C를 진행해주세요. 동시 작업이 가능하면 병렬 에이전트로 작업해주세요"로 추가 요청. A(loader 견고화 + cross-widget brushing) + B(신규 벤치마크 3개 카테고리) + C(신규 위젯 3개)로 분해. 3-wave 병렬 패턴:

**Wave 1 (4 병렬, 독립 파일)**:
- **A1 Loader 2-pass** (`5a0128b`): `scripts/load_benchmark_scores.py`를 두 단계로 리팩터 — 1) 모든 파일에서 모델/벤치마크 등록, 2) 모든 파일에서 점수 삽입. 파일 순서에 무관하게 FK constraint 통과. CONTRIBUTING.md 신설(74 LOC) — 파일 명명 규칙(`*_scores.json` suffix), 엄격 출처 규칙, JSON 스키마, 로딩 검증법 문서화. Session 4 `cbc1916` 임시 수정의 영구 해결책.
- **B1 Vision-Language agent benchmarks** (`7c8c7e4`): VisualWebArena / Online-Mind2Web / ScreenSpot-Pro / OSCopilot-GAIA / WebShop / VisualAgentBench, 6 benchmarks + 31 scores.
- **B2 Multi-agent collaboration** (`e5447e6`): AgentBench / MetaGPT-Eval / MultiAgentBench 외 3종, 6 benchmarks + 19 scores.
- **B3 Reasoning trace quality** (bundled into `e5447e6`): METR autonomy P50/P80, CoT faithfulness, Apollo scheming oversight subversion/persistence, RewardBench2, ProcessBench-F1 — 8 benchmarks + 39 scores.

**Wave 2 (3 병렬, agent-charts.js NEW 함수)**:
- **C1 Cost Simulator (W12)** (`9a816e1`): 일일 요청 수 / 평균 입출력 토큰 / reasoning toggle 슬라이더 → 모델별 월 비용 ranked 테이블. Sanity: Opus 4.7 = $22.50/일 (예상치와 일치). 348 LOC.
- **C2 Provider Availability Map (W13)** (`edb03e4`): top-25 모델 × 14 클라우드 프로바이더 ECharts heatmap. `config/model_enrichment.yaml`에 22개 새 모델의 `api_providers` 필드 채움 (총 61개 모델 enrichment 보유).
- **C4 Recommendation Breakdown (W14)** (`cb2741a`): "Build Your Agent" 위저드의 각 결과 행에 "Why?" 버튼 추가 → 카테고리별 기여도를 보여주는 horizontal bar chart 모달.

**Wave 3 (controller 직접, 기존 위젯 augment)**:
- **A2 Cross-widget linked brushing** (`f0a77b9`): IIFE 상단에 `_brush.on/off/emit/current` pub/sub 추가. 리더보드 행 hover → W1 Cost Scatter의 매칭 bubble을 `dispatchAction({type:'highlight'})`로 강조 + 행 내 fingerprint 캔버스에 violet ring + scale(1.08) + 행에 violet 틴트. 데이터셋 가드(`brushBound`/`brushSub`)로 재렌더 시 리스너 누적 방지.
- **A3 Pareto frontier 라벨**: `_paretoFrontier()` 결과 model_id를 set으로 모은 후, 프론티어에 있는 bubble만 model 이름 라벨 표시. 약 3-6개 "best-in-class" 마커가 라벨링되고 나머지는 깨끗.

**병렬 작업 흥미점**:
- Wave 1 4개 에이전트는 완전 독립 파일(scripts/, resource/×3)이라 충돌 0건.
- Wave 2 3개 에이전트가 `agent-charts.js` 동시 편집 — 각자 _NEW_ 함수만 추가하는 패턴으로 conflict-free. 각 에이전트가 cache-bust를 다른 letter로 bump.
- Wave 3는 기존 함수 augment라 controller 직접 작업.

**DB delta**:
- 신규 벤치마크: **+20** (855 → 875)
- 신규 점수: **+89** (3343 → 3432)
- API providers 채워진 모델: 39 → **61**

**파일 deltas**:
- `dashboard/js/agent-charts.js`: 2961 → **3877 LOC** (+916, 3 new widgets + brushing)
- `dashboard/index.html`: agent-charts.js cache-bust `?v=20260508o` → `?v=20260508p`
- `scripts/load_benchmark_scores.py`: 1-pass → **2-pass refactor**
- `CONTRIBUTING.md`: NEW (74 LOC)
- `config/model_enrichment.yaml`: 39 → **61** entries with `api_providers`
- `resource/zzz...vl_agent_benchmarks_2026_05_08_scores.json`: NEW (6 benches, 31 scores)
- `resource/zzz...multi_agent_2026_05_08_scores.json`: NEW (6 benches, 19 scores)
- `resource/zzz...reasoning_trace_2026_05_08_scores.json`: NEW (8 benches, 39 scores)

**Live deploy**: CI run `25546781257` (1m42s 성공), 캐시-버스트 SHA prefix `f0a77b92`. 라이브 JS에서 `_brush`(8) / `frontierIds`(3) / `_bubbleWithLabel`(4) 마커 모두 확인.

---

## 2026-05-08 (Session 4): Agent menu A+B+C+E batch — 3 new widgets + polish + data fills

### 10. Agent 탭 종합 보강 (commits `6bbfe57` → `cbc1916`)

이전 세션의 8개 위젯을 ship한 후 사용자 피드백 반영. A(데이터 채우기) + B(위젯 폴리시) + C(새 위젯) + E(housekeeping) 4 카테고리 동시 진행. 9개 병렬 에이전트가 2 wave로 작업:

**Wave 1 (5 병렬, 분리된 파일)**:
- **E1 README** (`6bbfe57`): 14 tabs + 8 widgets 문서화, screenshot embed, CI workflow 노트.
- **E2+E3 Modal** (`3142413`): agent-product 모달에 "Built on: <base model>" 링크 + Devin/Manus 'subscription' 태그.
- **A3 HAL composite** (`d92dd53`): HAL Princeton 9 sub-leaderboard에서 11 모델 cost-controlled aggregate score 추출.
- **A1 Edge SLM** (`97bdbb9`): Phi-4-mini / Gemma 3 / FunctionGemma / Llama 3.2의 BFCL/mobile_actions 점수 6건 (DONE_WITH_CONCERNS — Apple FM, Phi-4 14B는 vendor 미공개).
- **A2 Agent product** (`0488ff3`): Cursor / Devin / Manus / Operator / Mariner / Computer Use / Claude Code 11 신규 점수.

**Wave 2 (4 병렬, agent-charts.js NEW 함수)**:
- **C1 Capability Sankey** (`0f30aef`): 12 모델 → 10 카테고리 → 20 벤치마크 flow. ECharts sankey, 42 nodes / 97 edges.
- **C2 Cumulative SOTA Wins** (`bd73921`): 11 history snapshot 활용한 시간별 SOTA 보유 일수 stacked area.
- **C4 Build Your Agent wizard** (`d70a40c`): 7개 priority slider + 2 toggle → top-10 추천. 374 LOC. Default state top: claude-mythos-preview 350.0.
- **B-polish bundle** (`64cdeec`): 모든 ECharts 위젯에 toolbox (PNG/dataView/restore), 모든 위젯에 ⓘ help icon, W3/W5/W8/C2/C4에 LocalStorage 상태 저장.

**Wave 3 (controller fix)**:
- **CI 로더 버그 수정** (`cbc1916`): W1A/W1B 파일명에 `_scores_<date>_<scores>` 패턴이 있어 로더 glob `*_scores_*.json`이 모델 등록 파일(`*_scores.json`)보다 먼저 처리되어 FK constraint failure. 파일명에서 mid-string `_scores_` 제거.

**병렬 작업 패턴 흥미점**:
- 모든 5+4 = 9 에이전트가 같은 작업 디렉토리(/Users/user/git/cyber)에서 cwd-isolated 모드로 동작.
- agent-charts.js 동시 편집 시 W2B/W2C 에이전트가 다른 에이전트들의 WIP를 stash로 처리 후 자기 작업만 깔끔하게 commit (Python 원자적 rewrite 패턴 사용).
- Race conditions 발생했으나 stash + atomic rewrite로 모두 복구. 최종 commit chain은 깔끔.

**DB delta**:
- 신규 점수: 28 (W1A 6 + W1B 11 + W1C 11)
- agent-products with scores: 1 → **8** (10개 중)
- edge-SLMs with scores: 0 → **5** (9개 중)
- HAL composite: 0 → **11**
- TOTAL scores: 3315 → **3343**
- TOTAL benchmarks: 854 → **855** (+1, swe_bench original)

**파일 deltas**:
- `dashboard/js/agent-charts.js`: 2181 → **2961 LOC** (+780, 3 new widgets + polish)
- `dashboard/js/modal.js`: +69
- `README.md`: 47 → 71 LOC + 1 screenshot
- 4 신규 resource JSON ingest 파일

**라이브 deploy**: gh-pages `7e0cb7e`, cache-bust `?v=cbc19163`. 11개 위젯(8 + Sankey + Cumulative SOTA + Wizard) + leaderboard fingerprints 모두 라이브.

**Deferred (backlog)**:
- B1 Linked brushing (cross-widget 모델 hover→highlight) — 복잡도 높고 ROI 제한적. 각 위젯이 독립적으로 toolbox/info/click-to-modal을 갖춘 상태라 나중에 단계적으로.
- C3 Pareto frontier 시간 애니메이션 — 가격 historical data 부재로 부분 구현만 가능.
- Edge SLM 추가 점수 (Apple FM / Phi-4 14B vendor 미공개) — 외부 publication 대기.

---

## 2026-05-08 (Session 3): Agent menu graphical widgets — 8 ECharts visualisations via parallel agents

### 9. Agent 탭에 8개 그래픽 비교 위젯 추가 (commits `b24fcaf` → `82dcdef`)

기존 텍스트 위주 Agent 탭에 ECharts 기반 그래픽 위젯 8개를 추가. 5개의 병렬 worktree-격리 에이전트가 동시 작업하여 ~60분에 완성.

**구현된 위젯 8개**:
1. **💰 Cost vs Performance Scatter** (`agent-chart-cost-scatter`) — Y=종합 Agent Score, X=$/1M out (log scale), 색=class, 크기=coverage, 보라색 dashed Pareto frontier 라인. 의사결정 도구 1순위 차트.
2. **🔥 Capability Heatmap** (`agent-chart-heatmap`) — Top 20 agents × 12 핵심 벤치마크. red→green 색상 스케일, 정규화된 점수, 클릭 → Modal.showModel.
3. **🕸️ Category Radar** (`agent-chart-radar`) — 카테고리 선택 + top 8 에이전트 체크박스 (최대 5개 동시 overlay). 사용자가 비교할 에이전트를 직접 선택.
4. **⚖️ Frontier vs Agent-Product vs Edge Dot Plot** (`agent-chart-classplot`) — 10개 벤치마크 행마다 3 클래스 best 점수의 점 + 연결선. "scaffolding tax" / "edge gap" 시각화.
5. **⏱️ SOTA Timeline** (`agent-chart-sota-timeline`) — 벤치마크 선택 가능. `data/scores/history/<date>.json` 일별 스냅샷 11일치 활용. SOTA holder 전환 시 색 밴드 변경 + handover 라벨.
6. **📊 Vendor × Benchmark Bubble Matrix** (`agent-chart-vendor-matrix`) — Top 12 벤더 × 10 벤치마크. 버블 크기/색=벤더 best score. viridis 색상 스케일.
7. **🧬 Capability Fingerprint Mini-Radar** — Composite Leaderboard 각 행에 60×60 Canvas2D 4축 (Coding/Web/OS/Tool-use) 마이크로 레이더. 25개 행 = 25개 미니 시그니처.
8. **📈 Score Distribution Violin** (`agent-chart-class-violin`) — Frontier/Agent-Product/Edge 3개 boxplot + horizontal jitter 점들. ECharts custom series 사용. 클래스 간 분포 차이 시각화.

**병렬 작업 패턴 (worktree-격리 에이전트 5명)**:
- Agent A: Widget 1 — `5a44392` (250 LOC body, ~3분)
- Agent B: Widget 2 — `31b7c34` (193 LOC body)
- Agent C: Widget 3+7 — bundled into `f0c18cf` + `cb50c36` (radar 59+~200 helpers, fingerprints 45+~150 helpers)
- Agent D: Widget 4+6 — `cb50c36` (153+168 LOC, vendor canonicalization 포함)
- Agent E: Widget 5+8 — `82dcdef` (8+15 entry + 600 LOC helpers like `_drawSOTATimeline`/`_drawClassViolin`/`_loadHistoryIndex`)

다섯 에이전트가 동시에 같은 파일(`dashboard/js/agent-charts.js`)에 작업했으나 각자 다른 함수를 추가하는 구조라 머지 충돌 없음. 병렬화로 실시간 약 12분 만에 8개 위젯 완성 (직렬이었으면 5-6시간 추정).

**파일 deltas**: `dashboard/js/agent-charts.js` 0 → **2,181 LOC** (신규), `dashboard/index.html` +1 (script tag + cache-bust), `dashboard/js/agent.js` +14 (renderAll 호출 wiring).

**라이브 검증**: Playwright headless 로 `http://localhost:8765/index.html#agent` 접속, 7개 ECharts 캔버스 렌더링 + 25개 fingerprint 미니레이더 + Fingerprint 헤더 모두 확인. DevTools console: 0개 errors (favicon 404 만 — 무관).

**아키텍처 노트**:
- 모든 위젯 mount-point lazy 생성 (`_ensureMountPoint`) → 한 위젯이 실패해도 다른 위젯 무관.
- 데이터 fetch는 promise-cached (`_pricingPromise`, `_loadHistoryIndex`) → 사용자 dropdown 토글 시 재페치 없음.
- 모든 DOM 조작 `createElement`/`appendChild`/`textContent` (security hook 통과). innerHTML 0건.
- ECharts 'dark' 테마 일관 사용 (`Charts._getOrCreate` 팩토리).
- 공유 헬퍼 (`_normalizedScore`, `_categoryCoverage`, `_classColor`, `_modelClass`, `_canonVendor` 등) 8개 위젯이 재사용.

**남은 한계**: Edge SLM 점수 부족 (Cost Scatter 상의 Edge 점이 placeholder `$0.01` 위치, agentic 점수 0건이라 종합 점수 계산에 진입 못 함). Edge 컬럼 데이터는 후속 sweep 필요.

**Cache-bust 최종**: `agent.js?v=20260508g`, `agent-charts.js?v=20260508f`, `modal.js?v=20260508a`. CI 자동으로 `?v=<commit-sha-prefix>` 로 재작성하여 deploy.

---

## 2026-05-08 (Session 2): Agent menu launch + agentic data sweep

### 8. Agent menu — new top-level tab + 28-task plan execution

새로운 `Agent` 탭을 메뉴 바에 추가 (AI4S 와 Explorer 사이). 4개 sub-section 구조:

**4 sub-section UI** (vanilla ES5 + Tailwind dark theme, ~990 LOC `dashboard/js/agent.js`):
- **SOTA Watch** (4 tiles): Top Coder / Top Web Agent / Top OS Agent / Best Defense — 매핑은 swe_bench_verified / browsecomp / osworld_verified / agentdojo_utility
- **Categories** (10 cards, edge spans full row): Coding / Web & Browsing / OS-Computer Use / Tool Use & Function Calling / MCP / Customer Service / Domain (cross-listed Medical/AI4S) / Safety (lower-better marked) / General/Composite / On-device-Edge
- **Compare** (3-column dropdown-switchable): Frontier (general-purpose) / Agent Products / On-device-Edge — switches across SWE Verified / SWE Pro / Terminal-Bench 2.0 / OSWorld-V / GAIA / TAU2 / BFCL v4 / Mobile Actions / MobileAgentBench
- **Composite Leaderboard** (top 25): normalized agent_score across all agentic benchmarks, coverage threshold ≥3, safety ASR/jailbreak rows inverted (lower-better)

**Modal extension**: 2 new `scale_class` badges added — `agent-product` (amber `🛠️ Agent product`), `edge-slm` (green `📱 Edge SLM`).

**Data deltas (Tasks 10-23)**:
- 14 new agentic benchmarks: aider_polyglot, swe_lancer, mle_bench, usaco, appworld, hal_overall_accuracy_at_fixed_cost, mobile_agent_bench, mobilebench_v2, mobilebench_xiaomi, mlperf_mobile_llm, mlperf_inference_edge_v5_1, mlperf_tiny_v1_2, tinyml_energy_v1, function_gemma_calling
- 19 new model_ids registered (10 agent-product wrappers: Claude Code/Codex CLI/Cursor Composer/Replit Agent/Devin/Manus/Computer Use/Mariner/Operator/Cowork; 9 edge-SLMs: Apple FM 3B+Private Cloud/Phi-4+mini/Gemma 3-270M+3n+Function/Llama 3.2 1B+3B)
- 10 retag candidates upgraded to `scale_class: edge-slm` in `model_enrichment.yaml` (Phi-4, Jamba 1.5/1.6/1.7/2 mini, Jamba2 3B, Qwen 1.5/2.5 7B, Qwen3 8B, OLMo 2 7B)
- 24 new score rows via Playwright + WebFetch primary-source extraction: USACO 8 (HAL Princeton) / GAIA 5 (HAL) / Aider Polyglot 7 (aider.chat) / Claude Code SWE-Verified 87.6 (Anthropic) / Codex CLI SWE-Verified 85.0 + Terminal-Bench 82.0 + SWE-Pro 56.8 (OpenAI/Scale SEAL)
- 20 Resources entries added (11 agent leaderboards + 9 on-device sites): HAL Princeton (4 sub-leaderboards) / AA Coding Agents / BenchLM Agent / AI Agent Square / Rapid Claw Framework Scorecard / MorphLLM Coding Agents / Helicone Manus / Phil Schmid Compendium / MobileAgentBench / Xiaomi Mobile-Bench / MLCommons MLPerf Mobile/Tiny/Edge / Google AI Edge LiteRT-LM / Apple ML / HuggingFace SmolLM / Local AI Master SLM Guide

**Edge utility metrics file** (`config/edge_models_utility.json`): 9 SLM entries with size_gb / battery_pct_per_25_conversations citations from primary sources (Apple ML, HuggingFace, Google blog "Pixel 9 Pro 0.75% per 25 conversations").

**Strict-attribution applied throughout**: every score row has model_id + benchmark_id + value visible in cited primary source. Anonymized AISI joint-testing scores excluded. SWE-bench self-reporting concerns flagged in benchmark notes.

**DB final state**: benchmarks 842 → **854** (+12 net), models 1096 → **1114** (+18), scores 3261 → **3315** (+54). Coverage gap warning eliminated for all 72 hardcoded benchmark IDs in `agent.js CATEGORIES`.

**14 commits** (`079cac2` → `f34d77c`) — see `git log --oneline 3559b5d..f34d77c` for the chronological build sequence.

---

## 2026-05-08: AA Intelligence Index sweep + Resources tab refresh + ZAYA1/PhysForge daily ingest + AISI 13건 reference 보강

### Session overview
오늘 세션은 (1) ZAYA1-8B (Zyphra MoE on AMD) + PhysForge (HKU 3D physical-AI) 2건 daily-sweep ingest, (2) 4개 reference leaderboard (artificialanalysis.ai, lmarena.ai/arena.ai, livebench.ai, eqbench.com) Resources 탭 description 보강 + EQ-Bench Creative Writing Longform 신규 등록, (3) artificialanalysis.ai top-25 leaderboard 에서 AA Intelligence Index 신규 점수 10건 ingest, (4) 6개 기존 AISI(US/UK/JP/SG/KR/CN) reference description 갱신 + US AISI → CAISI URL 교체, (5) 7개 신규 AISI(호주/캐나다/CIFAR/프랑스 INESIA/인도/EU AI Office/Network mission) Resources 탭 등록, (6) 6개 AISI 1차 출처 문서(Joint Testing 보고서/Synthetic Content Research Agenda/GPAI Code of Practice/UK 연구 agenda + Year in Review) 추가로 구성됨.

### 1. AA Intelligence Index 5/8 sweep (commit `c577b4f`)
artificialanalysis.ai/leaderboards/models top-25 를 직접 fetch 해서, DB에 model 은 있지만 `aa_intelligence_index` 점수가 없던 10개에 대해 strict-attribution 으로 점수 추가:

| Rank | Model | Score |
|------|-------|-------|
| 4 | google/gemini-3.1-pro (Gemini 3.1 Pro Preview) | 57 |
| 8 | openai/gpt-5.3-codex (GPT-5.3 Codex xhigh) | 54 |
| 10 | meta/muse-spark | 52 |
| 12 | alibaba/qwen3.6-max-preview | 52 |
| 13 | anthropic/claude-sonnet-4.6 (Sonnet 4.6 max) | 52 |
| 14 | deepseek/deepseek-v4-pro-max (V4 Pro Max) | 52 |
| 15 | zhipu/glm-5.1 | 51 |
| 17 | alibaba/qwen3.6-plus | 50 |
| 19 | zhipu/glm-5 | 50 |
| 20 | minimax/m2.7 | 50 |

기존 5건(gpt-5.5 60, claude-opus-4.7 57, mimo-v2.5-pro 54, kimi-k2.6 54, grok-4.3 53.2) 은 leaderboard 값과 일치하므로 그대로 유지. `aa_intelligence_index` 커버리지 8 → 18 (+10).

**다른 reference 사이트의 한계**: lmarena.ai (→ arena.ai 리디렉트), livebench.ai/#/, eqbench.com/creative_writing_longform.html 모두 client-side React/Vue 로 leaderboard table 을 렌더링 → WebFetch 는 빈 헤더만 반환. 강한 추출은 browser automation 필요. Resources 탭 discovery link 로 유지하되 자동 ingest 는 보류.

### 2. Resources 탭 + seed_sources.yaml 보강 (commit `e1b323b`, `13c37a9`)
4개 reference 사이트에 대해 description 을 기능적으로 보강:
- **Chatbot Arena (lmarena.ai → arena.ai)**: redirect 노트 + 모달리티/scoring 설명 추가
- **Artificial Analysis Leaderboard**: "356+ models, 4-axis Intelligence/Speed/Cost/Context ranking" 명시
- **LiveBench (livebench.ai)**: 6 categories, monthly refresh, contamination-free 강조
- **EQ-Bench Creative Writing Longform**: 신규 등록 (1 entry, paragraph-level analytical writing 평가)

`config/seed_sources.yaml` 에 EQ-Bench, LiveBench(refreshed), AA Leaderboard 3건 등록.

### 3. ZAYA1-8B + PhysForge daily sweep (commit `9f5929f`)
2026-05-06 ~ 05-08 window 에서 strict-attribution 으로 검증된 2건:
- **Zyphra ZAYA1-8B (MoE, 2026-05-06)**: 8.4B total / 760M active, AMD 하드웨어 전용 학습, Markovian RSA test-time compute 도입. 8개 점수 (AIME 2026: 89.1, HMMT 2026: 71.6, HMMT 2025: 89.6, IMO-AnswerBench: 59.3, LiveCodeBench-v6: 65.8, GPQA-Diamond: 71.0, MMLU-Pro: 74.2, IFEval: 85.58)
- **HKU MMLab PhysForge (2026-05-06)**: VLM physical-architect + physics-grounded diffusion (KineVoxel Injection), PhysDB 150k assets, ICML 2026 — `scale_class=agent-system` 로 등록.

Frontier Compare 메뉴 `FRONTIER_MODELS` 에 zaya1-8b 추가.

### 4. Frontier Compare + Cyber & Coding 메뉴 propagation
AA Intelligence Index 데이터로 점수 커버리지가 확장된 모델 중 menu 누락분 보강:
- **Frontier Compare**: `anthropic/claude-sonnet-4.6` 추가 (Sonnet 4.6 max — 36개 score 보유, opus 와 함께 비교 가능)
- **Cyber & Coding**: `deepseek/deepseek-v4-pro-max` 추가 (24개 score, 코딩계열 reasoning 비교)
- `qwen3.6-max-preview` 는 AA 점수 단 1건뿐이라 menu propagation 보류.

cache-bust: `frontier-compare.js?v=20260508b`, `cyber-coding.js?v=20260508a`

### 5. AISI Resources 탭 13건 신규/갱신 (commits `c6cc9fc` / `a210daa` / `d386060`)

기존 등록되어 있던 6개 AISI(US/UK/JP/SG/KR/CN) description 을 구체적 최근 작업 기준으로 갱신하고, 누락된 7개 AISI 와 6개 1차 출처 문서를 추가했습니다.

**기존 AISI 6건 갱신** (`c6cc9fc`):
- **US AISI → US CAISI**: 2025년 중반 정부 개편으로 NIST 산하 "Center for AI Standards and Innovation" 으로 재명명. URL `nist.gov/artificial-intelligence/ai-safety-institute` → `nist.gov/caisi`. 새 활동: Google DeepMind/MS/xAI Frontier 사전배포 평가 합의(May 2026), DeepSeek V4 평가(May 2026), AI Agent Red-Teaming Competition(Mar 2026), AI Agent Standards Initiative, OpenMined 보안 평가 파트너십.
- **UK AISI Blog**: 최근 6편 게시물(MS 파트너십 May 5/GPT-5.5 사이버 평가 Apr 30/Mythos 사이버 평가 Apr 13/OpenClaw sandboxed-agent recon/sycophancy 감소/alignment-sabotage 평가) 명시.
- **Japan AISI**: AI Safety Annual Report 2025 (Apr 28), Known Attacks and Their Impacts EN/JP (Apr 24), FY2025 Conformity Assessment SWG (Apr 23) 반영.
- **Singapore AISI**: International Joint Testing(3JT), 다국어 LLM 평가 (UK+Japan), AI 에이전트 데이터 유출 테스트(Korea), SCAI 2025 + Singapore Consensus 추가.
- **Korea AISI**: URL `/eng` → `/kor` (사용자 지정), 4개 트랙 명시.
- **China AISI** (3건): 변경 없음 (이미 충분).

**신규 AISI 7건** (`a210daa`) — International Network of AI Safety Institutes 10개 창립 멤버 100% 커버리지 달성:
| AISI | URL | 메타 |
|------|-----|------|
| Australia AISI (DISR) | industry.gov.au | A$30M, 2026 초 운영 시작 |
| Canada AISI / CAISI Canada (ISED) | ised-isde.canada.ca | C$50M/5y, NRC 연구팀 + CIFAR |
| CAISI Research Program (CIFAR) | cifar.ca/ai/caisi | 2026 calls: interpretability/robustness/cyber-misuse |
| France INESIA | inria.fr | ANSSI+LNE+PEReN+Inria 4-org federation, 2026-2027 roadmap |
| India AISI (IndiaAI MeitY) | indiaai.gov.in | 2025-01-30 발표, 7-Sutras 프레임워크 India AI Impact Summit 2026 |
| EU AI Office | digital-strategy.ec.europa.eu | GPAI 의무 2025-08-02, high-risk 2026-08-02 |
| AISI International Network Mission | ised-isde.canada.ca | 10개 창립 멤버, Vancouver 2nd convening Jul 2025 |

UAE는 별도 국가 AISI 없음 → MBZUAI Institute of Foundation Models는 LLM 연구소(국가 안전 평가 기관 X), 기존 TII Falcon 등록으로 충분 → 추가 보류.
Kenya는 Network 멤버이나 독립 사이트 미존재 → Network mission entry 로 커버.

**AISI 1차 출처 6건** (`d386060`):
- 3rd Joint Testing Exercise — Agentic Eval Report (sgaisi.sg, Jul 17 2025) — Singapore lead 누출/사기 + UK lead 사이버보안, ~1500 tasks/1200 tools, Cybench+Intercode 사용. **모델 익명화 (A-F)** 으로 strict-attribution 규칙상 점수 적재 불가; pass rate 만 공개 (~57% / ~35% leakage, 23%/28% judge discrepancy). 9개 AISI 참가.
- Synthetic Content Research Agenda (DISR + ISED 공동, Jul 14 2025) — AI 생성 합성 콘텐츠 위험 연구 의제.
- GPAI Code of Practice 최종본 (code-of-practice.ai, EU AI Office Jul 10 2025) — 전체 signatory: Anthropic / Google / IBM / Microsoft / OpenAI / Amazon / Mistral / Aleph Alpha. xAI는 Safety & Security 챕터만 부분 서명. **Meta 미서명** (2026-01 기준).
- GPAI Signatory Taskforce.
- UK AISI Research Agenda.
- UK AISI 2025 Year in Review — 30+ frontier 모델 평가, self-replication 벤치마크, sandbagging 탐지, 76K 참가 설득력 연구 (Science 발표).

**Strict-attribution rule 적용 결과**: 신규 모델 0건, 신규 벤치마크 점수 0건. AISI joint testing 보고서가 모델명을 의도적으로 익명화하기 때문. 새 점수 적재는 불가능했으나 **메타데이터 layer (1차 출처 reference)** 로는 13건 모두 가치 보존됨.

Resources 탭: 404 → 417 entries. seed_sources.yaml 일치.

### 6. Playwright sweep — LiveBench / EQ-Bench / Arena 46 점수 ingest (commit `7568163`)

이전 5/8 sweep 에서 client-side rendered table 때문에 WebFetch 로 추출 불가했던 3개 leaderboard 를 Playwright headless browser 로 직접 렌더링해서 strict-attribution 으로 ingest:

- **LiveBench Global Average** (기존 `livebench`): top 30 frontier 모델 중 DB 매핑 가능한 20개. 1위 GPT-5.5 80.71 / 2위 GPT-5.4-thinking 80.28 / 3위 Gemini 3.1 Pro 79.93 / Claude Opus 4.7 76.91 / Sonnet 4.6 75.47 / DeepSeek V4 Pro 73.58 / Kimi K2.6 72.17 / GLM-5.1 70.18 / Grok 4.20 67.96 / Grok 4.3 66.74 / Minimax M2.7 63.49 등.
- **EQ-Bench Creative Writing Longform** (NEW 벤치마크 `eq_bench_creative_writing_longform`): top 10 등록. 1위 Claude Opus 4.7 81.8 / Sonnet 4.6 79.9 / Kimi K2.6 78.5 / GPT-5.4 78.3 / GPT-5.5 78.2 / Opus 4.6 77.7 / DeepSeek V4 Pro 75.6 / Kimi K2.5 74.9 / GLM-5.1 73.5 / Opus 4.5 73.1.
- **Arena Text** (기존 `lmarena` — lmarena.ai → arena.ai 리브랜딩): top 10 → unique 8개. Opus 4.7-thinking 1503 / Opus 4.6-thinking 1502 / Gemini 3.1 Pro 1492 / Muse Spark 1490 / Gemini 3 Pro 1486 / GPT-5.5 1484 / Grok 4.20 1480 / GPT-5.2 1477.
- **Arena WebDev** (기존 `webdev_arena`): top 10 → unique 8개. Opus 4.7 1570 / Opus 4.6 1549 / GLM-5.1 1531 / Sonnet 4.6 1524 / Kimi K2.6 1523 / Muse Spark 1509 / GPT-5.5 1491 / Opus 4.5 1490.

Variant convention: 다중 effort/thinking 변형이 있는 경우 모델별 highest variant 선택 (기존 80.3/79.9/76.3 이 LiveBench top-effort 와 일치하는 관행 따름).

DB delta: benchmarks 887 → 888 (+1), scores 3508 → 3554 (+46).

Vision Arena 와 Search Arena 는 별도 신규 benchmark 등록 + 이름 매핑 필요로 다음 sweep 으로 보류.

### 7. Playwright sweep R2 — cc:TODO 부분 closure + Arena V/S + MRCR v2 + LiveBench backlog (commit `4f6e06e`)

Plans.md "Next Steps" 의 cc:TODO 항목 4건 + 오늘 sweep 의 deferred 항목 2건을 일괄 처리:

**신규 벤치마크 3건**:
- `arena_vision_elo` — arena.ai Vision Arena Elo
- `arena_search_elo` — arena.ai Search/grounding Arena Elo
- `mrcr_v2_8needle` — OpenAI MRCR v2 8-needle (1M long-context retrieval)

**신규 점수 30건**:
- Arena Vision Elo: 7 (Opus 4.7 thinking 1305 / Opus 4.6 1300 / Muse Spark 1298 / Gemini 3 Pro 1288 / GPT-5.5 1288 / GPT-5.2 1279 / Gemini 3.1 Pro 1277)
- Arena Search Elo: 10 (Opus 4.6-search 1255 / GPT-5.5-search 1235 / Opus 4.7 1233 / Sonnet 4.6-search 1221 / Gemini 3.1 Pro grounding 1218 / GPT-5.2-search 1213 / Gemini 3 Pro grounding 1210 / Grok 4.20 1209 / Gemini 3 Flash grounding 1208 / Grok 4.3 1205)
- MRCR v2 8-needle: 7 (Opus 4.6 93.0 / GPT-5.5 74.0 / Gemini 3.1 Flash-Lite 60.1 / GPT-5.4 mini 33.6 / Gemini 3 Pro 26.3 / Gemini 3.1 Pro 26.3 / Gemini 3 Flash 22.1)
- LiveBench backlog: 6 (GPT-5.1 Codex Max 73.98 / Gemini 3 Flash 72.40 / GPT-5 Pro 70.48 / Sonnet 4.5 68.19 / GPT-5.4 mini 67.54 / GPT-5 mini 65.91)

**cc:TODO 상태 업데이트**:
- ✅ MRCR v2 8-needle: closure
- ⚠️ Video-MME: Playwright 렌더링 성공 (technical block 해제) 했으나 leaderboard 가 2025-09 까지로 stale. 2026 frontier 모델 미반영 → BLOCKED on external publication 그대로
- ❌ HarmBench / StrongREJECT / AIR-Bench: 2026 frontier 점수 미발견 (이전 sweep 과 동일)
- ❌ MMAU: 2026 frontier 점수 미발견
- ✅ UK AISI Cyber Expert tier: 이미 DB 적재 (verified — gpt-5.5 71.4 / mythos 68.6 / gpt-5.4 52.4 / opus 4.7 48.6 on aisi_advanced_expert_avg)

DB final delta (오늘 세션 누적): benchmarks 839 → 842 (+3 today, +4 this session if EQ-Bench Longform counted from earlier), distinct scores 3261 → 3291 (+30 this round).

### Reproducibility
```bash
python scripts/load_benchmark_scores.py resource/zzzz...aa_intelligence_2026_05_08_scores.json
python -m cyber export
python scripts/audit_version_date_consistency.py   # 0 contradictions
```

---

## 2026-05-06: AI4S menu + nuclear/energy expansion + open-weight curation + non-FM scale_class

### Session overview
하루 동안 5개 영역 작업: (1) AI4S(AI for Science) 신규 메뉴 + 배경 데이터 적재 + 6개월 업데이트 + reference 사이트, (2) 모델 detail link 일괄 enrichment, (3) open-weight 모델 검증 (실제 weight 공개 여부), (4) 비-FM(narrow ML, agent system, dataset, tool) 메타데이터 분류, (5) 모달 UI에 scale_class 배지 표시.

### 1. AI for Science (AI4S) 메뉴 신설 + 모델 적재 (commit `2829449`)
text LLM 중심 dashboard를 13개 foundation model 카테고리로 확장. 93개 신규 모델 + 8개 sub-category:

| 카테고리 | 핵심 |
|---------|------|
| 🧪 Co-Scientist (10) | Google AI Co-Scientist, Sakana AI Scientist v1/v2/DGM, FutureHouse PaperQA2-Crow/Falcon/Owl/Phoenix, Stanford Virtual Lab (Nature 2025 SARS-CoV-2 nanobodies), LBNL A-Lab |
| 📐 Math / Formal Proof (15) | DeepMind AlphaProof + AlphaGeometry-2 (IMO 2024 silver), DeepSeek-Prover V1.5/V2 671B+7B, Goedel-Prover V2 32B+8B (Princeton+Tsinghua), HunyuanProver, Llemma 7B+34B, OpenMath2-70B, MathFusion, ReProver, Lean-STaR, InternLM2-Math/StepProver, Gemini Deep Think IMO 2025 gold |
| ⚗️ Chemistry (8) | ChemDFM 13B/v1.5-8B, ChemBERTa-2/3, Recursion MolE (Nature Comm), ChemGPT, MolGen, Chemformer, RoboChem (Nature), Uni-Mol V2 |
| 🔭 Astronomy (7) | AstroLLaMA, AstroPT (DESI galaxy stamps), AstroM3 tri-modal, Polymathic AION-1/AstroCLIP/Multimodal-Universe (100TB), AstroNN-Stars |
| ⚛️ Physics / Materials (15) | MACE-MP, Orb v1/v2, DPA-2, EquiformerV2, UMA OMat24, MatterGen + MatterSim (Microsoft), GNoME (Nature), CHGNet, M3GNet, NequIP, AlphaQubit (Nature), Polymathic Multiple-Physics + The-Well |
| 🌍 Earth / Climate (11) | Microsoft Aurora (Nature 2025), Pangu-Weather, GraphCast, GenCast (Nature 2024), ECMWF AIFS-1.0, FuXi, FengWu, ClimaX, IBM-NASA Prithvi WxC + EO-2.0, ClimateGPT |
| 🧬 Bio / Genomics (16) | Arc Evo 1/2 (40B+7B 1Mb-context), Baker Lab RFdiffusion + RoseTTAFold-AA + RFdiffusion-AA, SaProt 650M+1.3B, ProtGPT2, GenSLMs (Gordon Bell), scGPT (Nature Methods), Nucleotide Transformer, HyenaDNA, Caduceus, AlphaMissense (Science), AlphaGenome, Chai-2 |
| 🌐 Multi-disciplinary (2) | Galactica 30B+120B (Meta) |

UI: tab between Medical AI and Explorer, 8 summary tiles + category filter + search, cards grouped by category sorted by release_date desc, click→Modal.showModel.

### 2. AI4S 확장 — 원자력/에너지/양자화학 등 11 sub-categories (commit `4e772a2`)
84개 신규 모델 (8 → 19 sub-categories):

| 신규 카테고리 | 모델 수 | 핵심 |
|------|------|------|
| ☢️ Nuclear / Fusion (15) | DeepMind TORAX (JAX tokamak transport), TCV plasma RL (Nature 2022), TCV rampdown (Nat Comm 2025), PPPL Diag2Diag/ELM/Plasma-Heating, KFE+DIII-D Tearing RL (Nature 2024), AHU XiHeFusion, Proxima ConStellaRation, MIT-CFS, INL+NVIDIA Prometheus |
| ⚡ Energy / Grid / Battery (16) | ECMWF AIFS Single/Ensemble, ETH+IBM GAIA Power Dispatch, IBM GridFM, NREL eGridGPT, EnergyGPT 8B, EF-LLM, PowerGraph-LLM, PBT Battery Transformer, TRI D3BATT, IBM-NASA Surya 1.0 (366M heliophysics) |
| 🔬 Quantum Chemistry / DFT (11) | DeepMind FermiNet/Psiformer/DM21, FU Berlin PauliNet, Princeton NeuralXC, Caltech OrbNet + Entos Denali, U.Florida ANI-1ccx/2x, CMU AIMNet2, NVIDIA PhysicsNeMo |
| ✨ Cosmology / Particle Physics (5) | Simons CAMELS (4,233 sims), MIT AI Feynman, ATLAS+CMS CERN anomaly detection, Polymathic Walrus 1.3B |
| 🌋 Geosciences / Seismology (5) | Stanford EQTransformer + PhaseNet, USTC SeisCLIP, Tsinghua Seismic FM, GEM-3D |
| 💨 Atmospheric Chemistry (5) | Juelich+CERN AtmoRep 3.5B, ECMWF AIFS-COMPO, Zeeman ML-CTM, ECCC EnsAI, PCDC-Net |
| 💧 Hydrology / Water (3) | Google+JKU NeuralHydrology, Google Caravan, Fine Flood FM |
| 🌾 Agriculture / Plant (13) | AgriGPT, AgriGPT-VL, MBZUAI AgroGPT, InstaDeep AgroNT, PlantRNA-FM, scPlantLLM, NASA Harvest GeoCIF/ARYA/VeRCYe, ORNL APPL/GPGP |
| 💊 Pharma / Drug Discovery (4) | Recursion Phenom-Beta, Isomorphic Iso-DDE, Insilico Chemistry42 |
| 🤖 Lab Automation (3) | CMU Coscientist (Nature 2023), ChemCrow, ANL protein-design FM |
| ➕ Co-Scientist 추가 | AuroraGPT (Argonne exascale), Khanmigo (pedagogy) |

기존 카테고리 보강: ORNL ORBIT 113B + ORBIT-2, Helmholtz HClimRep, Polymathic Walrus 1.3B.

### 3. AI4S 6개월 업데이트 (commit `15e496f`)
2025-11-01 ~ 2026-05-06 윈도우 신규 24 모델 + 16 벤치마크 + 10 점수:

- **Climate**: WeatherNext 2 (Google, 8x faster), Aurora Open full weights (Microsoft), AIFS 1.1.0 (ECMWF)
- **Nuclear**: TORAX-CFS 파트너십, TokaMind (UKAEA+IBM, MAST tokamak FM)
- **Energy**: GridFM v0.5 (IBM+LF Energy)
- **Math**: **Goedel-Prover V2 32B (88.1%/90.4% MiniF2F, ICLR 2026)**, **Gemini 3 Deep Think (gold IMO/ICPC/IPhO/IChO)**
- **Bio/Pharma**: BoltzGen 1 (MIT), AneWomni 2026, NVIDIA RNAPro/ReaSyn v2
- **Materials**: Orb v3 (10-40x faster), ALCHEMI TorchSim, AlphaChip 2026 open checkpoint, GR00T N1.5/N1.7, Cosmos-Transfer 2.5
- **Time-series**: TimesFM 2.5 (16384 context, 60% smaller)

신규 벤치마크: Physical AI Bench (NVIDIA), WxC-Bench (NASA+IBM), AI AgriBench (UIUC), TokaMark (UKAEA), DisruptionBench (MIT PSFC), MOFSimBench, AgriBench-13K, MiniF2F, IMO 2025, ICPC 2025, IPhO/IChO 2025, AIFS 1.1↑1.0, AlphaGenome 24-task/26-task.

### 4. AI4S Reference 사이트 36개 추가 (commit `f8fbe1f`)
9개 도메인의 leaderboard / benchmark / dataset / DOE national lab 사이트:
- Math: MathArena (ETH 라이브), MiniF2F GitHub, PutnamBench, OlympiadBench, IMO-Bench (DeepMind ProofBench), OlympicArena
- Materials: Matbench Discovery, Matbench v0.1, Open Catalyst Project, FAIR Chemistry, GuacaMol, MoleculeNet, Open Reaction Database
- Bio: CASP Prediction Center, ProteinGym, PDB Statistics
- Climate: WeatherBench 2 (Google+ECMWF 라이브), ECMWF AIFS Blog/Charts, Microsoft Aurora GitHub
- Robotics: RoboArena (DROID Elo), LIBERO, RoboCasa 365, NVIDIA Cosmos
- Astronomy/Cosmology: Polymathic AI, MultiModalUniverse, DESI, SDSS
- Particle Physics: LHC Olympics 2020, ML4Jets, Dark Machines
- Nuclear: DisruptionBench, DisruptionPy
- Aggregators: SciArena (Allen AI Elo), Papers with Code, HF Papers, DOE Office of Science, Argonne ALCF, ORNL AI

dashboard Resources 탭 + config/seed_sources.yaml 양쪽 등록.

### 5. 모델별 1차 출처 링크 enrichment (commits `16e333b`, `df3bdb1`, `3eb6d73`)
175개 AI4S 모델에 `links.{huggingface, github, paper, blog, model_card, system_card, homepage}` 7-필드 enrichment 추가. 모달이 자동 인식하여 컬러 코딩된 Reference Links 버튼으로 표시.

이후 4-pass deep audit:
- Pass 1 (이전): 75 링크 + 66 reclassify
- Pass 2 (`curate_open_links_v2.py`): Major-vendor 329 모델 verified URL +352 fields
- Pass 3 (extension): Arcee Trinity, EleutherAI Polyglot-Ko, Physical Intelligence Pi-Zero, OpenMEDLab, Audio family, Video gen, Time-series, Tabular +86 fields
- Pass 4 (long-tail): Cohere Aya, Databricks DBRX, Bowang MedSAM, ELYZA Med, AI Singapore SEA-LION v4, JMedLLM +33 fields
- Pass 5 (reclassify): paper-only academic 109건 → proprietary
- Pass 6 (cleanup): 마지막 2개 outlier 수작업

**최종 100% open-weight 모델 HF/GitHub 커버리지 달성** (이전 27%):
- proprietary 500 (46%) / open-weight 485 (44%) / open-weights 85 (8%) / open-source 23 (2%)
- Open w/o HF/GitHub: **0개** (이전 511)

### 6. 비-FM `scale_class` 메타데이터 + 모달 배지 (commit `d3ce2f2`)
사용자 audit 발견: 1,093개 dashboard 항목 중 ~127개가 large-scale LLM/FM이 아님 (narrow specialty network, agent system, dataset, simulator/tool, benchmark baseline, product wrapper 등). 사용자가 Option A(메타데이터 표시) 선택.

`scripts/tag_non_fm_class.py` — 216개 항목을 22개 카테고리로 태깅:

| 분류 | 개수 | 라벨 |
|------|-----|------|
| classical-ml | 21 | 🔬 Classical ML (M3GNet 250K, NequIP 1M, MACE, CHGNet, Orb v1/v2/v3, ChemBERTa) |
| narrow-encoder | 17 | 🎨 Narrow encoder (CONCH, UNI2, TITAN, Virchow2, Prov-GigaPath, RAD-DINO, RETFound) |
| narrow-segmentation | 15 | ✂️ Narrow segmentation (MedSAM, SAM-Med2D/3D, SAM 1/2.1/3/3D) |
| agent-system | 15 | 🤖 Agent system (AI Co-Scientist, Sakana AI Scientist, ChemCrow, FutureHouse) |
| product-wrapper | 15 | 🏷 Product wrapper (Khanmigo, Harvey, CoCounsel, Runway/Kling/Pika/Luma/Sora) |
| narrow-timeseries | 11 | 📈 Narrow time-series (TimesFM, Chronos, Lag-Llama, Moirai, MOMENT) |
| classical-bert | 10 | 📚 Classical BERT (BiomedCLIP, BioGPT, PubMedBERT, ClinicalBERT, BioBERT, GatorTron) |
| benchmark-baseline | 9 | 🎯 Benchmark baseline (CheXpert, MIMIC-CXR, MedPerf-FETs, MedHallu) |
| narrow-tts | 7 | 🔊 Narrow TTS (Kokoro, Spark-TTS, CosyVoice 2/3, ChatTTS, F5-TTS) |
| robotics-policy | 7 | 🤖 Robotics policy (Octo, OpenVLA, Pi-Zero/0.5, RDT-1B) |
| dataset | 6 | 📦 Dataset (MultiModalUniverse, CAMELS, The Well, MPP) |
| dft-functional | 4 | ⚛️ DFT functional (DM21, NeuralXC, OrbNet) |
| analysis-pipeline | 4 | 🔬 Analysis pipeline (ATLAS/CMS CERN, Fermilab Genesis) |
| simulator-tool | 3 | 🛠 Simulator/Tool (TORAX, PhysicsNeMo) |
| wavefunction-net | 3 | ⚛️ Wavefunction net (FermiNet, PauliNet, Psiformer) |
| small-mlp-potential | 3 | ⚛️ Small MLP potential (ANI-1ccx/2x, AIMNet2) |
| rl-search-system | 3 | 🔍 RL-search system (FunSearch, AlphaChip, GNoME) |
| hydrology-lstm | 3 | 💧 Hydrology LSTM (NeuralHydrology, Caravan) |
| roadmap | 3 | 🗺 Roadmap (placeholder) |
| narrow-task | 24 | 🎯 Narrow task (RFdiffusion, RoseTTAFold-AA, AlphaFold 2/3, Boltz, EQTransformer, FLUX.1) |
| narrow-tabular | 2 | 📊 Narrow tabular (TabPFN v2/2.5) |
| qec-decoder | 2 | 🧊 QEC decoder (AlphaQubit) |
| audio-codec / symbolic-regression / human-baseline | 1+1+1 | 🎙 ∑ 👤 |

**모달 UI 변경**: `_renderHeader`가 enrichment.scale_class를 읽어 amber 배지로 표시. Frontier FM (GPT-5.5, Claude, Llama 등)은 배지 없음 (clean default).

라이브 검증 8개 sample 전부 정확:
- cmu/coscientist → 🤖 Agent system
- deepmind/torax → 🛠 Simulator/Tool
- meta/sam-3 → ✂️ Narrow segmentation
- prior-labs/tabpfn-v2 → 📊 Narrow tabular
- google/timesfm-2.5 → 📈 Narrow time-series
- simons-flatiron/camels → 📦 Dataset
- stanford/eqtransformer → 🎯 Narrow task
- khan-academy-openai/khanmigo → 🏷 Product wrapper
- openai/gpt-5.5 → (no badge — frontier FM)

### 데이터 규모 증분 (Day-of-day, 5/5 종료 → 5/6 종료)
| 항목 | 5/5 | 5/6 | 증가 |
|------|------|------|------|
| 모델 | 893 | **1,093** | +200 |
| AI4S 카테고리 | 0 | **19 sub-categories** | NEW |
| AI4S 모델 | 0 | **177~200** | NEW |
| Resource sites | 311 | **347** | +36 (모두 AI4S leaderboards) |
| Enrichment 항목 | 130 | **305** | +175 |
| 1차 링크 보유 모델 | ~32 | **593 (100% open)** | +561 |
| Open w/o HF/GitHub | 511 | **0** | -511 |
| Type 분포 | 64% open | 54% open / 46% proprietary | 109 reclassify |
| scale_class 태깅 | 0 | **216** | NEW (22 categories) |
| Version-vs-date 모순 | 0 | **0** | 유지 |

### 커밋 시퀀스 (2026-05-06)
- `2829449` AI4S 메뉴 신설 + 93 모델 + 8 sub-categories
- `4e772a2` AI4S 11 sub-categories 추가 (nuclear/energy/quantum-chem 등 +84 모델)
- `15e496f` AI4S 6-month updates (+24 모델 +16 benchmarks +10 scores)
- `f8fbe1f` AI4S Resource 사이트 36개 추가
- `16e333b` 175 AI4S 모델 enrichment 1차 링크
- `df3bdb1` 67 mis-classified open→proprietary + 75 HF/GitHub 링크 보강
- `3eb6d73` 4-pass open-weight 100% 커버리지 달성 (1093 → 0 missing)
- `d3ce2f2` 비-FM scale_class 배지 시스템 (216 entries × 22 categories)

---

## 2026-05-05: 13-category foundation expansion + Timeline infographic + version-vs-date audit + partial-date v6

### Session overview
하루 동안 7개 영역에서 데이터·코드·시각화 작업을 동시에 진행. Text LLM 중심 dashboard를 13개 foundation 카테고리(audio/video/3D/VLM/VLA/reasoning/diffusion-LM/code/math/medical/legal/bio/time-series/tabular)로 확장하고, Timeline 메뉴에 카드형 인포그래픽 + 다운로드 기능을 추가. 사용자가 발견한 GPT-5.1/5.2 출시일 모순을 시작점으로 전수 audit 자동화 수행.

### 1. Foundation model 13개 카테고리 확장 (commit `a4e063e`)
이전까지는 text LLM 중심이었던 dashboard를 95개 신규 모델로 비-text foundation까지 cross-category 비교 가능하게 확장. 모든 entry는 1차 출처 검증.

| 카테고리 | 신규 | 핵심 모델 |
|---------|-----|----------|
| 🎙️ Audio/Speech | 16 | ElevenLabs v3, Voxtral Small/Mini, Step-Audio R1/EditX, Moshi+Mimi, Sesame CSM-1B, ChatTTS, F5-TTS, Kokoro, Spark-TTS, CosyVoice 2/3, Whisper-v3-turbo |
| 🎬 Video Gen | 16 | Sora 2, Veo 3/3.1, Kling 2.0/2.5/2.6, HunyuanVideo 1.5/I2V, Wan 2.1/2.2, Mochi 1, CogVideoX 5B/1.5, Pika 2.2, Runway Gen-4/4.5, MiniMax Video-01/Hailuo 02, Luma Ray 2, Pyramid Flow |
| 🌐 3D/World | 9 | SV4D 2.0, TRELLIS/TRELLIS.2, Hunyuan3D 2/2.1, DUSt3R+MASt3R, Depth-Anything v2, Marigold v1.1, VGGT |
| 👁️ VLM | 12 | Molmo 7B-D, Janus-Pro, Pixtral 12B/Large 124B, LLaVA-OneVision, Qwen2.5-VL/Omni, Qwen3-VL/Omni, InternVL 2.5/3.5 |
| 🧠 Reasoning | 10 | DeepSeek-R1, Qwen3-Thinking 235B/30B/4B, Magistral Small, Skywork-OR1, GLM-Z1, Doubao 1.5 Pro, Phi-4-reasoning-vision |
| 🌊 Diffusion-LM | 1 | Mercury Coder |
| 💻 Code | 6 | Qwen2.5/3-Coder, Devstral 2, Granite 34B Code, Seed-Coder, Doubao Seed-Code |
| ➗ Math | 4 | Qwen2.5-Math, NuminaMath 7B/72B, DeepSeek-Math V2 |
| 🩺 Medical | 3 | HuatuoGPT-o1 72B/8B, Med42 v2 70B |
| ⚖️ Legal | 2 | Harvey Protégé, CoCounsel Legal |
| 🧬 Bio/Protein | 5 | AlphaFold-3, Boltz-1/2, ESM-3 98B, Chai-1 |
| 📈 Time-series | 8 | Chronos-T5/Bolt/2, TimesFM 2.5, Lag-Llama, Moirai, MOMENT |
| 📊 Tabular | 2 | TabPFN v2 / 2.5 |

### 2. Timeline 메뉴 카드형 인포그래픽 추가 + skill 저장 (commits `0307724` → `d57d534`)
사용자 스펙: 가로 16:9, 월별 컬럼, 좌→우 시간 진행, 카드형 이벤트 표시, 정확한 버전명 필수, 모호한 표현 금지. ECharts 산점차트에서 hand-rolled SVG 인포그래픽으로 완전 재구성.

**최종 구현:**
- **SVG 동적 viewBox**: 16:9 base 1920×1080, 카드 수에 따라 너비/높이 확장 (6개월 3064×1490, 12개월 7132×2030)
- **월별 가변 너비**: 1~14건 280px / 15~28건 566px / 29~42건 852px / 43+건 1138px (sub-column fan-out)
- **모든 카드 빠짐없이 렌더**: `+N more` truncation 0 (114/114, 12개월 모드 223/223)
- **카드 4-코너 레이아웃**: 좌상 logo / 우상 MM.DD / 본문 모델명+벤더 / 좌하 license pill / 중하 country / 우하 28×28 flag tile (24px emoji)
- **국가 매핑 보강**: Sakana(JP), Kakao Healthcare(KR), Arcee/Inception(US), Fractal(IN) prefix 추가
- **컨테이너 스크롤 0**: `overflow:hidden` + SVG `width:100%` + viewBox 비례 축소로 좁은 viewport에서도 모든 카드 visible
- **다운로드 3종**: PNG (2x raster, ~3840×2030 native) / SVG (vector ~79KB) / CSV (release_date,model_id,name,vendor,country,type)
- **Footer attribution**: `Author: Jonghong Jeon · hollobit@etri.re.kr` + `Source: https://hollobit.github.io/SOTA/#timeline · data verified against vendor blogs, llm-stats.com, HuggingFace model cards` + `Generated YYYY-MM-DD`
- **Skill 저장**: `~/.claude/skills/timeline-infographic/skill.md` + 프로젝트 `.claude/skills/` 미러 — 13개 hard rules + 5단계 구현 절차 + 7-point Playwright 검증 체크리스트 + 9개 anti-patterns 문서화

### 3. Version vs date contradiction 자동 audit + corrections v5 (commit `70b7ceb`)
사용자 발견: GPT-5.1(2025-11-13) 보다 GPT-5.2(2025-11-10)가 먼저인 모순. 전수 audit 스크립트 작성.

`scripts/audit_version_date_consistency.py` — model_id를 `(family, version_tuple, variant)`로 파싱, 같은 family/variant 그룹에서 version 오름차순 vs date 오름차순 일치 여부 검사. 4건 모순 발견:

| # | 진단 | 조치 |
|---|------|------|
| 1 | gpt-5.1 (11-13) > gpt-5.2 (**11-10**) | gpt-5.2 → **2025-12-11** ([OpenAI 공식](https://openai.com/index/introducing-gpt-5-2/), Code Red Gemini 3 대응); gpt-5.1 → **2025-11-12** |
| 2 | gpt-4.1 vs gpt-4.5 | OpenAI 비순차 명명 (4.5 Orion이 먼저) — 사실, whitelist |
| 3 | nemotron-3-340b (2025-08) vs nemotron-4-340b (2024-06) | nemotron-3-340b → **2025-12-15** (family 발표일) + whitelist |
| 4 | grok-4.3 vs grok-4.20 | xAI 농담 명명 (420 meme이 먼저) — 사실, whitelist |

추가 partial date 보강 (8건): gpt-3.5-turbo-0125/0301/0613, gpt-4(2023-03-14), gpt-4-0125-preview, gpt-4-turbo-2024-04-09, gpt-5-nano(2025-08-07), **gpt-5.4-mini(2026-03-17)** (5.4 base 12일 후, OpenAI release notes).

**최종 결과: 0 contradictions** (54 versioned groups). KNOWN_NONSEQUENTIAL whitelist에 3개 vendor의 정당한 비순차 명명 inline 문서화.

### 4. Partial-date v6 — 77건 YYYY-MM → YYYY-MM-DD (commit `d57d534`)
audit으로 230개 partial-date 항목 발견. 검증 가능한 77개를 정확한 일자로 업그레이드:

- **Meta**: Llama 2 7B/13B (2023-07-18), Llama 3 8B/70B (2024-04-18), SAM 1 (2023-04-05), SAM 2.1 (2024-09-30), SAM 3/3D (2025-11-19)
- **Anthropic**: Claude 2.1 (2023-11-21), Claude 3 Sonnet (2024-03-04)
- **Google**: Gemini 1.0 Pro (2023-12-06), Gemini 1.5 Pro (2024-02-15), Gemini 2.5 Flash (2025-04-09), Gemma 7B (2024-02-21), MedGemma 9B/27B (2025-05-20), Med-PaLM 1/2, PH-LLM, Tx-LLM, Med-Gemini-L-1
- **DeepMind**: AlphaFold 2 (2021-07-15 Nature), AlphaFold 3 (2024-05-08), AlphaFold Server (2024-11-13)
- **Alibaba/Qwen**: Qwen 1.5 7B/32B/72B (2024-02-04), Qwen 2.5 32B/72B (2024-09-19), Qwen3-30B, Qwen3.5-397B-A17B
- **Amazon**: Nova Micro (2024-12-03 re:Invent)
- **Medical foundation**: Meditron 7B/70B, HuatuoGPT-II/Vision, RETFound, Clinical Camel, Med-Flamingo, MedAlpaca, PMC-LLaMA, DoctorGLM, Apollo 2B/6B/7B/MedLM-7B, MedSAM 1/2, SAM-Med2D/3D, H-Optimus, CONCH, UNI2, Virchow2, OpenBioLLM 8B/70B, BioMistral, Med42 v1/v2, BiomedCLIP, BioGPT, LLaVA-Med, PubMedBERT, ClinicalBERT, BioBERT, BlueBERT, GatorTron, MolFormer, BiomedLM-2.7B

남은 153건: 주로 specialty medical/research 모델 (명확한 public release 이벤트 없음, YYYY-MM 자체가 best signal).

### 5. May 2026 weekly batch (commit `0de4888`)
2026-05-01~05 윈도우는 frontier 모델 출시 공백기 — llm-stats / aiflashreport / mean.ceo / HF Daily Papers 모두 0건 확인. 유일한 backfill: **Inception Mercury 2** (2026-04-23, diffusion-based parallel-token reasoning, 1009 tok/s on Blackwell, 128k ctx) + 신규 벤치마크 **MemRouter** (arxiv 2605.00356, LoCoMo conversational memory routing).

### 6. ThinkPol AI Coding Contest + NIST CAISI evaluation (commit `696e86e`)
2개 1차 출처 보고서로 51개 신규 점수:

**(1) ThinkPol Word Gem Puzzle**: 오픈웨이트 Kimi K2.6가 frontier closed 모델들을 제치고 우승. 9개 모델 ranking + cumulative 77 (Kimi 1위) + AA Intelligence Index (GPT-5.5: 60, Opus 4.7: 57)

**(2) NIST CAISI DeepSeek V4 Pro 평가**: DeepSeek V4 Pro vs GPT-5.5/5.4-mini/Opus 4.6 9개 차원 평가, IRT Elo composite. 핵심 결론: DeepSeek V4 Pro lag ~8개월. 신규 벤치마크 7개 (ctf_archive_diamond, portbench, arc_agi_2_semi_private, pumac_2024, ai_coding_contest_word_gem/cumulative, irt_capability_elo) + 신규 모델 2개 (xai/grok-expert-4.2, deepseek/deepseek-v4 base).

### 7. Trinity family 정확한 메타데이터 + 4 benchmark scores (commit `e8accab`)
사용자 제공 링크 (arcee.ai blog + arxiv 2602.17004)로 placeholder `trinity-large-thinking`을 5개 정확한 entries로 교체:
- arcee/trinity-large-preview/base/truebase (2026-01-27, 400B/13B-active sparse MoE 256 experts × 4 active, 17T tokens, 2048 B300 GPU × 33일, $20M)
- arcee/trinity-mini (26B/3B-active, 2026-02-19)
- arcee/trinity-nano (6B/1B-active, 2026-02-19)

벤치마크 점수 4건 (Trinity Large Preview vs Llama-4-Maverick): MMLU 87.2, MMLU-Pro 75.2, GPQA-Diamond 63.3, AIME-2025 24.0.

### 8. National attribution 5건 수정 (commit `e75e4fe`)
사용자 지적: vendor → country 매핑 오류. timeline.js `VENDOR_TO_COUNTRY`에 prefix 추가:
- `sakana/` → 🇯🇵 Japan (이전엔 sakanaai만 매핑)
- `kakao-healthcare/` → 🇰🇷 Korea
- `arcee/` `arcee-ai/` → 🇺🇸 USA
- `inception/` `inceptionlabs/` → 🇺🇸 USA
- `fractal/` `fractalanalytics/` → 🇮🇳 India

DB vendor 라벨도 `(Country)` suffix 정규화 (Sakana AI (Japan), Arcee AI (USA) 등).

### 데이터 규모 증분 (Day-of-day)
| 항목 | 시작 (5/4 종료) | 종료 (5/5) | 증가 |
|------|---------------|-----------|------|
| 모델 | 795 | **893** | +98 |
| 벤치마크 | 855 | **863** | +8 |
| 점수 | 3,369 | **3,424** | +55 |
| 출시일 보유 | 757 | ~880+ | +120 (포함 partial→exact upgrade) |
| Partial date (YYYY-MM only) | 230 | 153 | -77 (정확한 일자로 업그레이드) |
| Version-vs-date 모순 | (검사 안됨) | **0 / 59 그룹** | audit 자동화 |
| Foundation 카테고리 커버 | text+VLA | **13개** | +12 카테고리 |

### 커밋 시퀀스 (2026-05-05)
- `0de4888` May 2026 daily sweep + Mercury 2 + MemRouter
- `696e86e` ThinkPol coding contest + NIST CAISI evaluation (51 scores)
- `e8accab` Arcee Trinity family proper entries + 4 benchmarks
- `70b7ceb` Version vs date audit script + 11 corrections (GPT-5.2 한 달 오류 등)
- `0307724` → `0d8a9e7` → `02138d5` → `029cb3b` → `a89f5b8` Timeline 인포그래픽 진화 (column-card → 가변 너비 → 큰 국기 → 4-코너 → 스크롤 제거 → 저자/출처 footer → #timeline anchor)
- `1ba0d4a` Timeline 인포그래픽 skill 저장
- `a4e063e` 13개 foundation 카테고리 95개 모델 신규
- `e75e4fe` Sakana/Kakao Healthcare/Arcee/Inception/Fractal 국가 매핑
- `d57d534` Partial-date v6 — 77건 YYYY-MM → YYYY-MM-DD

---

## 2026-05-04: May 2026 batch + release_date backfill (635→757) + type misclassification fix + Trends repair

### Session overview
하루 동안 5개 영역에서 데이터·코드·UX를 동시 개선. 사용자가 발견한 두 개의 잠재 회귀(Trends 빈 화면, sovereign type 오분류)는 모두 silent 회귀 — 누적 데이터 인제스트가 일으킨 것이지 비즈니스 변화가 아님.

### 1. May 2026 weekly batch (commit `a85f078`)
신규 모델 7개·벤치마크 3개·점수 38개 추가. 모두 1차 출처 검증.

| 항목 | 출처 | 비고 |
|------|------|------|
| Qwen3.6-Max preview (Alibaba) | qwen.ai/blog | 1M context MoE flagship |
| Hunyuan HY3 preview (Tencent) | arena.ai changelog | frontier-tier |
| GLM-5V Turbo (Zhipu) | arena.ai changelog | vision variant of GLM-5.1 |
| ERNIE 5.1 preview (Baidu) | arena.ai changelog | text |
| MiMo-v2 Omni (Xiaomi) | arena.ai changelog | text+image+audio |
| Grok 4.3 (xAI) | arena.ai changelog | multimodal |
| Trinity Large Thinking (Arcee) | arena.ai changelog | ~400B reasoning open-weight |
| HealthBench Professional (OpenAI) | cdn.openai.com | 525 clinician tasks |
| DoctorBench LLM (Diagens) | pharmiweb release | LLM/VLM/Agent 3 tracks |
| REBench | arxiv 2604.27319 | reverse engineering |

신규 점수 38개: DeepSeek V4 Pro Max(12 benches from HF card), Qwen3.6-27B(10 benches), Claude Opus 4.7(9 benches via Vellum), GPT-5.5/Pro(3 benches via Vellum), Kimi K2.6(AA Intelligence Index).

### 2. Release date backfill: 361 → 757 (+396, 95.2%) (commits `4bfa970`, `a85f078`, `4c3b33f`, `368e9ec`)
출시일 보유율을 4단계 작업으로 45.7% → 95.2%로 끌어올림. 검증 출처: `llm-stats.com/models/<slug>` per-model 페이지, vendor blog 발표일, HuggingFace upload timestamp, arxiv paper 날짜.

| 단계 | 추가 | 누적 | 커버리지 | 핵심 카테고리 |
|------|------|------|---------|--------------|
| v1 (기존) | — | 361 | 45.7% | 90 popular flagship |
| v2 | +121 | 482 | 61.1% | GPT-5.x family, Claude 4.x, Grok 1/3/4/4.20, Llama 4 Scout/Maverick, DeepSeek family, Qwen3 + 3.6, Kimi K1.5/K2/K2.6, Mistral Large/Medium/Small/Devstral/Magistral/Codestral, Phi-4, GLM-4.5/4.6, Hunyuan-Large/T1/Turbo, Baichuan-2/3/4/M1/Omni, ERNIE 4.5, EXAONE 3.0/3.5/4.0/Deep, HyperCLOVA-X, Solar 10.7B/Pro/Pro2, SmolLM, Yi 1.5 |
| v3 | +153 | 635 | 79.9% | Mythos preview (2026-04-07 Project Glasswing), Opus 4.6, GPT-4.5/o4-mini/5.2-pro/5.3-codex, Llama 3.2 family, Mistral 7B/Mixtral/Nemo/Saba/Pixtral/Mathstral/Codestral-Mamba/Ministral/Voxtral, QvQ-72B/QwQ-32B/Qwen3.5-27B/122B/397B, GLM-4.7/5/5.1, MiniMax M2.5, ByteDance Seed 1.5/1.6/2.0, AI21 Jamba 1.0~1.7+Reasoning+Maestro, IBM Granite 3.1~3.3, TII Falcon Mamba+3+H1, Stability AI 전체, Black Forest FLUX.1+Kontext, Allen AI OLMo-2/Tulu-3/Molmo, Naver HyperCLOVA-X SEED, KT Mid-m, Kakao Kanana/KoGPT, LG EXAONE 4.0.1/Atelier, Yandex YaLM/GPT-4/5, Sber GigaChat 2.x, Sarvam-1/M, Krutrim, AI Singapore SEA-LION |
| v4 | +122 | 757 | **95.2%** | Pi-Zero/0.5/Pi-Zero-Fast/RDT-1B, GR00T N1/1.5/1.6, Cosmos Reason 1/2 + Predict 1/2.5, Figure Helix, 1X World Model, Tesla Optimus VLM, Genie 2/3, Gemini Robotics ER 1.5/1.6, Devstral Small 2, Ministral 3 family, Jamba 2 (Jamba2-Mini/3B), Step 2/3.5, Huawei Pangu 5/Embedding/Ultra-MoE, iFlytek Spark 4/X1, SenseTime SenseNova v6, BAAI Aquila 2/Wudao 2, Skywork R1V-3, TNG R1T/R1T2 Chimera, Aleph Alpha Luminous/Pharia 1/2, Lucie-7B, CroissantLLM, PleIAs, AI4Bharat 전체, BharatGen Param 1/2, Sarvam 30B/105B, Krutrim Spectre, MBZUAI K2/Atlas/BiMediX, DICTA Lm 2/3, Samsung Gauss 2, SKT A.X 4.0, NCSoft VARCO, Kanana 2 Thinking/Flag, Motif/Trillion, T-Bank, Siemens SIFM/Autodesk Bernini/PTC/Dassault/AVEVA, EPFL Meditron/HuatuoGPT-II/FoxBrain, Sakana Namazu, Bloomberg GPT, Llama 4 Behemoth |

남은 38개는 commercial-only product, roadmap entry, 비공개 specialty(Harvey/Vincent/Oliver/Riiid/Lunit/VUNO/JioBrain/Maitri 등).

### 3. Sovereign AI 모델 type 오분류 일괄 수정 (commit `b338b24`)
사용자 보고: "대부분의 소버린 AI 모델이 open weight에서 proprietary로 바뀌었다." 진단 결과 비즈니스 변화가 아니라 **데이터 인제스트 누적 회귀** — 354개 sovereign 모델 중 321개(90.7%)가 잘못 proprietary로 표시.

**근본 원인 (2개 결함의 결합):**
- `scripts/load_benchmark_scores.py:54`의 `m.get("type", "proprietary")` 디폴트
- `cyber/db/schema.py:106`의 `INSERT OR REPLACE INTO models` (UPSERT 아님)
- 누적 효과: ~30개 score batch가 매번 type을 `proprietary`로 silent overwrite

**수정:**
1. **Stop the bleed**: loader가 type 미지정시 기존 DB 값 보존
2. **Heal existing**: `scripts/reclassify_model_types.py` 신규 — per-model override + pattern rule + vendor default 3계층 룰로 489건 수정
   - 339건 `proprietary → open-weight` (silent flips 복구)
   - 8건 `open-weight → proprietary` (정확화: Solar-Pro/2/3, MiMo-v2-flash/pro, Konan, GigaChat 3 등)
   - 140건 표기 정규화

| 분류 | 이전 | 이후 |
|------|------|------|
| proprietary | 511 | 255 (-256) |
| open-weight | 64 | 379 (+315) |
| open-weights | 220 | 161 |

검증된 spot check: Qwen3.6-27B / DeepSeek V4 Pro / Kimi K2.6 / EXAONE 4.0 / Mistral 7B / Llama 4 Scout / Gemma 3 27B / Hunyuan-Large / ERNIE 4.5-300B / GLM-4.6 / HyperCLOVA-X Think / Mid-m 2.0 / Solar Mini → all `open-weight`. Solar Pro 3 / GPT-5.5 / Claude Opus 4.7 / Gemini 3 Pro / Grok 4 / GLM-5.1 / A.X 4.0 / HyperCLOVA-X → all `proprietary`. Grok 1 → `open-weight` (xAI 2024-03 release).

### 4. Trends 메뉴 그래프 미렌더링 픽스 (commits `7eecf5b`, `8216c42`)
사용자 보고: "여전히 Trends의 그래프들이 안보인다." Playwright로 라이브 진단.

**원인 1 — Silent JS 에러로 후속 차트 모두 abort:**
`App.data.pricing`은 `aa_pricing.json` 재구성 이후 **model_id 키의 object**로 export되는데, `_renderPricingChart`가 `.filter()`를 호출 → `TypeError: pricing.filter is not a function`. 이 에러가 `renderTrends()` 후속 호출(`_renderSotaHighlights`, `_renderTrendOverview`, `_renderSOTATrend`)을 모두 abort. 결과: sota-changelog와 correlation-chart만 보이고 나머지는 모두 빈 화면.
- 수정: object → array 정규화, `output → price_per_1m_output` 키 변환

**원인 2 — 조건부 차트 기본 빈 상태:**
trend-chart, radar-chart, heatmap-chart는 `#trend-benchmark` 드롭다운 선택시에만 렌더되는데 기본값이 빈 문자열. 첫 방문자는 항상 placeholder만 봄.
- 수정: 벤치마크 옵션을 score-coverage 내림차순 정렬 + 첫 항목(`gpqa_diamond`) 자동 선택

**보강 (commit `7eecf5b`)**: `Charts._getOrCreate`에 ResizeObserver + post-init RAF resize 추가, `_activateTab`에 double-RAF 패턴으로 grid layout 안정화 보장.

라이브 검증 결과: 7개 차트(SOTA Trend / Model Rankings / Category Radar / Cross-Benchmark Heatmap / Correlation / Pricing / Trend Overview) + SOTA Highlights 리스트 모두 정상 페인트.

### 5. Timeline 메뉴 출시일 / 시스템 등록일 분리 (이전 commit `4bfa970`)
사용자 지적: 모델 공개일과 시스템 등록일은 다른 의미인데 같이 사용하고 있음. Timeline은 모델 공개일 기준으로 정렬해야 함.
- `scripts/extract_enrichment_from_notes.py`: `release_date_inferred` → `system_registered_date` 필드 rename (filename date는 우리가 등록한 날짜이지 모델 출시일이 아님)
- `dashboard/js/timeline.js`: `_getReleaseDate()`는 `model.release_date` 또는 `released_at`만 반환 (fallback 제거). `_getSystemRegisteredDate()` 별도 메서드 신설. 두 컬럼 표시 — primary(실제 출시일) + secondary(`+YYYY-MM-DD` 회색 italic, 시스템 등록일).
- `dashboard/js/modal.js`: misleading "Released (inferred)" 행을 "시스템 등록일" 별도 italic 행으로 분리.

### 데이터 규모 증분 (Day-of-day)
| 항목 | 시작 | 종료 | 증가 |
|------|------|------|------|
| 모델 | 789 | **795** | +6 |
| 벤치마크 | 852 | **855** | +3 |
| 점수 | 3,331 | **3,369** | +38 |
| 출시일 보유 | 361 | **757** | +396 |
| 출시일 커버리지 | 45.7% | **95.2%** | +49.5pp |
| open-weight 모델 | 64 | **379** | +315 |
| proprietary 모델 | 511 | **255** | -256 |

### 커밋 시퀀스
- `4bfa970` Timeline release_date / system_registered_date 분리
- `a85f078` May 2026 weekly batch (7 models, 3 benches, 38 scores)
- `4c3b33f` Release date v3 backfill (+153)
- `368e9ec` Release date v4 backfill (+122, 95.2%)
- `7eecf5b` Trends ResizeObserver + double-RAF
- `8216c42` Trends pricing TypeError + auto-select default benchmark
- `b338b24` Sovereign AI type 오분류 489건 수정 + loader bug fix

---

## 2026-04-25: Sovereign AI menu + Physical AI / World Models (7 batches)

### Sovereign AI dashboard menu (NEW)
2026년 frontier 경쟁의 새 axis — **언어 적응 · 의료 시스템 통합 · 정부 정책 정합** — 을 frontier-only metric과 구분하여 비교하는 신규 메뉴 추가.

- **위치**: `dashboard/index.html` 신규 섹션 `tab-sovereign` + `dashboard/js/sovereign.js`
- **구조**:
  - **Region Map (11 cards)**: Korea / China / Japan / India / Israel / UAE / Singapore / Switzerland / US-Legal / US-Finance / DARPA AIxCC — 각 카드에 vendor·model name·type badge·sovereign 메타데이터.
  - **Dimension panels (3)**: Language Adaptation · Medical System Integration · Government / Regulated Domain — 각 차원 별로 sovereign 모델 top-6 vs frontier baseline (Claude/GPT-5.5/Gemini/Muse Spark) top-3 비교 막대 차트 + 표.
  - **Cross-region heatmap**: 각 region 대표 모델 × 전체 sovereign 벤치마크 union — 셀 클릭 시 검증 소스/이력 모달.
- **시각 설계**: sovereign 모델은 채도 높은 `Theme.series`, frontier reference는 `Theme.textMuted` + 0.55 opacity + border 처리하여 sovereign value gap을 시각적으로 표시.
- **Click handlers**: 모든 점수 셀 → `Modal.showScoreSource(modelId, benchId)`, 모델명 → `Modal.showModel(modelId)`. Heatmap은 ECharts `chart.on('click')`로 동일 모달 라우팅.

### Physical AI / World Models batch
NVIDIA Cosmos World Foundation Models, GR00T 휴머노이드 VLA, DeepMind Genie 3, Physical Intelligence Pi-Zero, OpenVLA-7B, AgiBot Genie Envisioner — 11개 모델, 7개 벤치마크.

| Benchmark | SOTA | Score |
|-----------|------|-------|
| LIBERO (4-suite avg) | NVIDIA Cosmos Policy | 98.5% |
| RoboCasa (50 demos) | NVIDIA Cosmos Policy | 67.1% |
| World Model FPS | DeepMind Genie 3 | 24fps @ 720p |
| World Model Consistency | DeepMind Genie 3 | ~180s (3x Genie 2) |

### 데이터 규모 증분
| 항목 | 2026-04-25 (이전) | 2026-04-25 (현재) | 증가 |
|-----|-------------|-------------|----|
| 모델 | 96 | **128** | +32 |
| 벤치마크 | 203 | **224** | +21 |
| 점수 | 1,045 | **1,087** | +42 |
| SOTA | 172 | **186** | +14 |
| 모니터링 소스 | 75+ | **84+** | +9 |

---

## 2026-04-25: Regional + Mistral lineup expansion (4 batches)

### Session Overview
After daily monitoring sweep confirmed no new frontier launches between Apr 23 → Apr 25, four sequential batches added regional and domain-specialized models that the dashboard had been ignoring.

### Batch summary
| 배치 | 신규 모델 | 신규 벤치마크 | 신규 점수 | PDFs |
|-----|--------|-----------|---------|-----|
| Daily sweep | 0 | 0 | 0 | — |
| Regional v1 | 11 | 8 | 16 | 0 |
| Regional v2 | 2 | 21 | 51 | 2 (MedGemma TR + 1.5 TR) |
| Mistral lineup | 13 | 4 | 22 | 0 |
| **합계 (4/24 → 4/25)** | **+26** | **+33** | **+89** | **+2 PDF** |

### 신규 모델 (지역/도메인별, 26개)
- **France (Mistral, 16개)**: Large 3, Small 4, Magistral Small/Medium 1.2, Devstral 2, Devstral Small 2/Medium/Small 1.1, Codestral 25.08, Pixtral Large, Voxtral TTS, Mistral Medium 3.1, Small 3.2, Ministral 3 14B/8B/3B
- **Google Medical (3개)**: MedGemma 27B, MedGemma 4B-PT, MedGemma 1.5 4B + Gemma 3 27B/4B baselines
- **UAE TII (2개)**: Falcon-H1 Arabic 34B (hybrid Mamba-Transformer), Falcon Perception 600M
- **Japan Sakana (1개)**: Namazu (alpha)
- **Singapore AI Singapore (2개)**: Apertus-SEA-LION v4 8B-IT, Gemma-SEA-LION v4 4B-VL

### 신규 벤치마크 33개 (5 카테고리)
- **의료**: medqa, medmcqa, pubmedqa, mmlu_med, medxpertqa, afrimed_qa, ehrqa, mimic_cxr_f1, chexpert_f1, dermmcqa, vqa_rad
- **수학**: math_500, amc_23, aime_24, gsm8k
- **추론**: arc_challenge, truthfulqa, hellaswag, ifeval, bbh, mtbench, alpaca_eval_v2
- **코딩**: mbpp, mbpp_plus, humaneval_plus, cruxeval, repobench
- **멀티모달**: mathvista_mini, mmbench_en, ai2d, docvqa, chartqa, vqav2

### 새 SOTA Highlights
- **MedQA**: MedGemma 27B 87.7% (Gemma 3 27B 74.9% baseline)
- **MIMIC-CXR**: MedGemma 27B Multimodal 90.0 F1
- **DocVQA**: Pixtral Large 93.3 ANLS
- **AI2D (BBox)**: Pixtral Large 93.8%
- **HellaSwag**: Falcon-H1 34B 81.94% (size class SOTA)
- **MATH-500**: Mistral Large 3 93.60%
- **MedXpertQA**: MedGemma 27B 25.7%
- **SWE-Verified (open-weight)**: Devstral 2 72.2%

### CI / Infrastructure
- **Auto cache-bust**: `?v=$BUILD_SHA[:8]` rewriting in publish step — no more manual JS version bumps after every JS change
- **2 PDFs saved**: MedGemma TR (2.7 MB) + 1.5 TR (3.7 MB)
- **5 deploy fixes during session**: 2 FK violations resolved with self-contained batch declarations; CDN cache TTL accommodated via cache-bust query strings
- **3 Resources/Changelog menu syncs** (per memory rule)

### 데이터 규모 증분
| 항목 | 2026-04-24 종료 | 2026-04-25 종료 | 증가 |
|-----|-------------|-------------|----|
| 모델 | 70 | **96** | +26 |
| 벤치마크 | 170 | **203** | +33 |
| 점수 | 956 | **1,045** | +89 |
| SOTA | 140 | **172** | +32 |
| 모니터링 소스 | 67 | **75+** | +8 |

---

## 2026-04-24: Frontier Model Refresh (GPT-5.5, Kimi K2.6, Qwen3.6-27B/35B-A3B)

### Session Overview
4개 신규 URL 소스를 기반으로 frontier 모델 4개 · 벤치마크 9개 · 점수 48개를 추가 ingest.
Primary sources: `deploymentsafety.openai.com/gpt-5-5/introduction`, `qwen.ai/blog?id=qwen3.6-35b-a3b`, `llm-stats.com/llm-updates`, `platform.kimi.ai/docs/guide/kimi-k2-6-quickstart`.

### 추가된 모델
| 모델 | 벤더 | 릴리스 | 타입 | 점수 수 |
|-----|-----|-------|-----|------|
| GPT-5.5 | OpenAI | 2026-04-23 | proprietary | 9 |
| GPT-5.5 Pro | OpenAI | 2026-04-23 | proprietary | 2 |
| Kimi K2.6 | Moonshot AI | 2026-04-20 | open-weight (multimodal) | 16 |
| Qwen3.6-27B | Alibaba | 2026-04-22 | open-weight (dense, multimodal) | 13 |
| Qwen3.6-35B-A3B | Alibaba | 2026-04-16 | open-weight (MoE) | +8 (backfill) |

### 추가된 벤치마크 (9개)
`healthbench_professional` (reasoning) · `toolathlon` (agent) · `mcpmark` (agent) · `qwen_web_bench` (agent, ELO) · `nl2repo` (coding) · `android_world` (agent) · `vlms_are_blind` (multimodal) · `realworldqa` (multimodal) · `skills_bench` (agent)

### 주요 Frontier 비교 하이라이트
- **Kimi K2.6 vs GPT-5.4 xhigh vs Claude Opus 4.6 max vs Gemini 3.1 Pro thinking high**: AIME 2026 96.4, SWE-Verified 80.2, BrowseComp 83.2 (swarm 86.3)
- **GPT-5.5 cyber**: CTF 85% pass@12 · Cyber Range 93.33% (14/15) · CyScenarioBench 26% (+17pt vs GPT-5.4) · UK AISI 32-step corporate attack 1/10 solved
- **Qwen3.6-27B dense breakout**: SWE-Pro 53.5 > Qwen3.5-397B-A17B's 50.9 (dense 27B outperforms 397B MoE)

### 데이터 규모 증분
| 항목 | 2026-04-18 | 2026-04-24 | 증가 |
|-----|----------|----------|----|
| 모델 | 63 | 67 | +4 |
| 벤치마크 | 95 | 126 | +9 (+22 pre-existing reload) |
| 점수 | 721 | 797 | +76 |
| SOTA | 78 | 96 | +18 |
| 웹 소스 | 26 | 34 | +8 |

### 파일 변경 내역
- `resource/frontier_2026_04_24_scores.json` — 신규 배치 파일 (4 모델 + 9 벤치마크 + 48 점수)
- `config/seed_sources.yaml` — 8 신규 모니터링 소스 등록
- `Plans.md`, `HISTORY.md` — 세션 기록

---

## 2026-04-17: Cybersecurity/Coding/Agent Benchmark Expansion

### Session Overview
Frontier 모델들의 사이버보안 공격/방어 능력, 코딩 능력, 에이전트 능력을 종합 평가하기 위한 벤치마크 데이터 수집 및 대시보드 확장 작업.

### Phase 1: 최신 벤치마크 데이터 수집
- 주요 리더보드(LLM Stats, Vellum, Artificial Analysis, Chatbot Arena, ARC Prize, LM Council)에서 최신 점수 수집
- 새 모델 9개 추가: GPT-5.3 Codex, GPT-5.4 mini, Muse Spark, GLM-5/5.1, Step-3.5-Flash, MiMo-V2-Pro, DeepSeek V3.2 Speciale, Grok-4.20
- 새 벤치마크 2개 추가: HLE (Humanity's Last Exam), ARC-AGI-2
- DB 재로드 + export + 대시보드 확인 완료

### Phase 2: Cyber & Coding 탭 신설
- `dashboard/js/cyber-coding.js` 생성 — 4축 뷰 (Attack / Defense / Coding / Agent)
- 사이버보안 공격 벤치마크 6개: Cybench, CVE-Bench, CyberGym, EVMbench Exploit/Detect, AIRTBench
- 사이버보안 방어 벤치마크 3개: AutoPatchBench, CyberSOCEval, ZeroDayBench
- 코딩 벤치마크 4개: SWE-bench Verified/Pro, Terminal-Bench 2.0, LiveCodeBench
- 에이전트 벤치마크 4개: OSWorld-Verified, GAIA, BrowseComp, TAU-bench
- 바 차트 + 데이터 테이블 + 레이더 차트 + 벤치마크 설명 패널 구현
- `App.data` 참조 버그 수정 (데이터 로딩 타이밍 이슈)

### Phase 3: BMT 카탈로그 연결 및 시드 소스 확장
- BMT (Benchmark Library) 2,559개 엔트리에서 97개 사이버보안 관련 벤치마크 식별
- `bmt_loader.py`에 12개 사이버보안/코딩 벤치마크 매핑 추가
- `config/seed_sources.yaml`에 시드 소스 13개 추가 (Wiz Cyber Model Arena, EVMbench, AIRTBench, CyberSecEval 4, CyberSOCEval, Cybench, CyberGym, OSWorld, GAIA, BrowseComp, TAU-bench, METR, BaxBench)

### Phase 4: PDF System Card / Model Card / 논문 분석
8개 PDF에서 벤치마크 데이터를 병렬 에이전트로 완전 추출:

| PDF 문서 | 추출 벤치마크 수 |
|---------|-------------|
| Claude Opus 4.6 System Card (Feb 2026) | 27개 |
| GPT-5.3-Codex System Card (Feb 2026) | 13개 (CTF 88%, CVE-Bench 90%, Cyber Range 80%) |
| Claude Mythos Preview System Card (Apr 2026) | 5개 (Cybench 100%, CyberGym 83%, Firefox 147 84%) |
| Gemini 3 Pro Model Card (Nov 2025) | 22개 벤치마크 × 4모델 전체 테이블 |
| Kimi K2.5 Safety Evaluation (2604.03121) | 12개 사이버보안 (EVMbench 3종, DFIR, HTB Pentest) |
| Kimi K2.5 Technical Report (2602.02276) | 55+ 벤치마크 Table 4 완전 추출 |
| GLM-5 Paper (2602.15763) | 30+ 벤치마크 Table 7 + SWE-rebench Table 9 |
| Gemma 4/Phi-4/Qwen3 MoE (2604.07035) | 참조용 (efficiency vs accuracy) |

### Phase 5: 추가 웹 소스 통합
- MiniMax M2.7 발표 (minimax.io): SWE-bench Pro 56.2%, Terminal-Bench 57.0%, GDPval-AA Elo 1495
- Gemma 4 Model Card (ai.google.dev): Gemma 4 31B + 26B-A4B 전체 벤치마크

### Phase 6: 추가 PDF 문서 분석 (3차 배치)
- **GPT-5.4 Thinking System Card** (Mar 2026): CTF 88.2%, CVE-Bench 86.3%, Cyber Range 73.3%, MLE-Bench 23.3%, Monorepo-Bench 59.3%, CyScenarioBench 11%
- **EXAONE 4.5 Technical Report** (LG AI, Apr 2026): 33개 벤치마크 (비전 21 + 언어 12), AIME 92.6%, LiveCodeBench 81.4%
- **Solar Open Technical Report** (Upstage, Jan 2026): 30개 벤치마크 (한국어 13 + 영어 17), GPQA 68.1%, AIME 84.3%
- **A.X K1 Technical Report** (SK Telecom, Feb 2026): 28개 벤치마크, AIME 89.8%, 한국어 SOTA
- **Mi:dm K 2.5 Pro** (KT, Mar 2026): 32B 엔터프라이즈 모델, tau2-Bench Telecom 89.0
- **ERNIE 5.0 Technical Report** (Baidu, Feb 2026): 80+ 벤치마크, SimpleQA 74.0%, 멀티모달+오디오
- **Qwen 3.6-Plus 블로그**: 45+ 벤치마크, SWE-bench Pro 56.6%, Terminal-Bench 61.6%, MathVision 88.0%

### Phase 7: Claude Opus 4.7 System Card (Apr 2026)
- **40+ 벤치마크** 완전 추출
- SWE-bench Verified **87.6%** (SOTA), SWE-bench Pro **64.3%** (SOTA)
- OSWorld **78.0%**, GDPval-AA Elo **1753** (SOTA)
- CyberGym 73%, Firefox 147 exploitation 45.2%
- Vending-Bench 2: **$10,937** (Max effort, SOTA)
- 비교 모델 점수: GPT-5.4, GPT-5.4 Pro, Gemini 3.1 Pro, Claude Mythos

### Phase 8: 커버리지 갭 분석 및 보충
- 21개 frontier 모델 × 22개 핵심 벤치마크 커버리지 매트릭스 분석
- 45% → 63% 커버리지 개선 (209/462 → 149/234 기준)
- Grok-4 Heavy/4: SWE-bench, LiveCodeBench, MMLU-Pro 점수 추가
- Gemini 3.1 Pro: BrowseComp 85.9%, LiveCodeBench 2887 Elo 추가
- Claude Mythos Preview: ARC-AGI-2 98.7%, MMLU-Pro 97.8% 추가
- 각 모델별 누락 벤치마크 리스트 정리 (미평가 vs 미공개 구분)

### 최종 데이터 규모
| 항목 | 세션 시작 (4/16 기준) | 세션 종료 (4/17) | 증가 |
|------|----------------|-------------|------|
| 모델 수 | 39 | 64 | +25 |
| 벤치마크 수 | 9 | 74 | +65 |
| 점수 엔트리 | ~130 | 625 | +495 |
| PDF 소스 | 0 | 15 | +15 |
| 웹 소스 | 6 | 26 | +20 |
| GitHub Pages | - | hollobit.github.io/SOTA | live |

### 벤치마크 카테고리별 최종 현황
| 카테고리 | 수 | 대표 벤치마크 |
|---------|---|------------|
| Coding | 13 | SWE-bench (4종), Terminal-Bench, LiveCodeBench, PaperBench, SciCode, GDPval-AA |
| Agent | 13 | OSWorld, GAIA, BrowseComp, TAU/τ2-bench, WebArena, DeepSearchQA, MCP-Atlas, Vending-Bench 2 |
| Reasoning | 11 | GPQA, HLE, ARC-AGI-2, MMLU-Pro, FACTS, SimpleQA, LongBench v2 |
| Cybersecurity Attack | 8 | Cybench, CVE-Bench, CyberGym, EVMbench Exploit/Detect, AIRTBench, Firefox 147, Cyber Range |
| Math | 8 | AIME, HMMT, IMO-AnswerBench, MathArena Apex |
| Multimodal | 8 | MMMU-Pro, MathVision, Video-MMMU, LongVideoBench, ScreenSpot-Pro, CharXiv, OmniDocBench |
| Cyber Defense | 5 | AutoPatchBench, CyberSOCEval, ZeroDayBench, EVMbench Patch, DFIR-Metric |
| Multilingual | 2 | MMMLU, Global PIQA |

### 파일 변경 내역
- `resource/benchmark_scores_2026_04.json` — 주 데이터 파일, 54모델 × 68벤치마크 × 470점수
- `config/seed_sources.yaml` — 시드 소스 24개
- `cyber/scouts/resource/bmt_loader.py` — BMT 매핑 12개 추가
- `dashboard/index.html` — Cyber & Coding 탭 추가
- `dashboard/js/cyber-coding.js` — 신규 (4축 뷰 렌더링)
- `dashboard/js/app.js` — CyberCoding 통합
- `scripts/load_benchmark_scores.py` — 변경 없음 (기존 로직 활용)

---

## 2026-04-16: 초기 구축 세션

### 작업 내용
- LLM Benchmark SOTA Dashboard 설계 및 구현
- Python 데이터 파이프라인 (Scout → Analyst → Publisher)
- SQLite DB 스키마 + 데이터 모델
- 정적 대시보드 (ECharts + Tailwind CSS + Vanilla JS)
- CLI 명령어 (`scout`, `analyze`, `export`, `serve`, `run`)
- GitHub Actions CI/CD 파이프라인
- 15개 시드 소스 수집 (Chatbot Arena, Open LLM, SEAL, Artificial Analysis, Vellum, LiveBench, Onyx, LLM Stats, MathArena, Epoch AI, LM Council 등)
- 초기 데이터: 39모델, 9벤치마크, ~130점수
