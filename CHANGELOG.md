# Changelog

Auto-generated from `git log` (last 50 commits).

## ✨ Features

- (2026-05-03) **ux**: watchlist + URL deep-link share + score search + cost presets + Pareto category split `94b8d59`
- (2026-05-03) **quality**: light theme polish + mobile Playwright + axe-core CI `3ee5434`
- (2026-05-03) **enrichment**: 4-layer auto-extraction enhancement (release_date / modalities / vendor / param precision) `a55b213`
- (2026-05-03) cost calculator + comparison export + benchmark trend overview + benchmark detail enrich `82b6711`
- (2026-05-03) **dashboard**: vendor mini-modal + Cmd+K command palette + Recent Updates feed `90614c3`
- (2026-05-03) **enrichment**: v1.5 auto-extraction from seed _note fields (730+ models) `1cc3c3c`
- (2026-05-03) **modal**: close button + mobile TOC + collapsible preferences + history snapshot doc `07347b7`
- (2026-05-03) **modal**: family tree + lineage + carbon estimate (Phase A rich features) `46a3f60`
- (2026-05-03) **ux**: mobile-responsive modal + A11y + scroll-to-section nav + dark/light toggle `1df8c68`
- (2026-05-03) **frontier-compare**: Pareto frontier scatter chart (cost vs quality) `cf2db95`
- (2026-05-03) **modal**: collapsible section toggles with localStorage persistence `85c1758`
- (2026-05-03) **comparison**: multi-select enhancements + 'Compare with peers' modal button `5b8274d`
- (2026-05-03) **modal**: HuggingFace metadata integration (downloads/likes/size/last-modified) `a26014c`
- (2026-05-03) **modal**: 8 modal info additions — Tier 1+2 batch A `a3f7eb3`
- (2026-05-03) **modal**: strengths radar chart (5-axis percentile vs all models) `b53fb25`
- (2026-05-03) **modal**: add Performance & Cost card (Intelligence Index / Arena Elo / Age / Cadence / Cost-per-IQ / peer price position) `18311ac`
- (2026-05-03) **modal**: merge enrichment links + pricing into detail modal `67e8e27`
- (2026-05-03) **modal**: ship model modal enhancement — peer/SOTA/strengths/architecture `5329344`
- (2026-05-03) **modal**: inline SOTA tier badges in score breakdown rows `6167732`
- (2026-05-03) **modal**: add Architecture/Training/Safety section from enrichment sidecar `5939f27`
- (2026-05-03) **modal**: add Strengths and Weaknesses sections (12-month SOTA tier) `82e713f`
- (2026-05-03) **modal**: add Peer Comparison section with dropdown override `6594965`
- (2026-05-03) **modal**: show context_window/knowledge_cutoff/languages/throughput in detail card `5ad1db1`
- (2026-05-03) **modal**: lazy-load model_enrichment.json on demand `ebc91d3`
- (2026-05-03) **modal**: add peer-matcher.js (findPeers, sotaTier, strengths/weaknesses) `45d27e9`
- (2026-05-03) **exporter**: emit model_enrichment.json sidecar from YAML `ce1dfa7`
- (2026-05-03) **loader**: map context_window/knowledge_cutoff/languages from seed `d50a857`
- (2026-05-03) **db**: add context_window/knowledge_cutoff/languages columns + migration `b90201a`
- (2026-05-03) **model**: add context_window, knowledge_cutoff, languages fields `f50bd9e`
- (2026-05-03) **dashboard**: 5-tab audit + propagation for 18 new sovereign AI models `c3a0349`
- (2026-05-03) **data**: IL/AE/CA sovereign AI batch + 5-tab hardcoded list propagation `8979f54`
- (2026-05-03) **data**: International sovereign AI HF batch — FR/SG/CN/RU 6 new models `1fa85b6`
- (2026-05-03) **data**: KR sovereign AI HF batch — A.X-K1, Kanana 1.5-o, Solar Open, Kanana 2 thinking `b1108e2`

## 🐛 Fixes

- (2026-05-03) 4 quick wins — HF URL accuracy + weekly schedule + main.py mapping + pricing coverage `94d0e41`
- (2026-05-03) **modal**: 5 code-quality follow-ups from earlier task reviews `e9c8206`
- (2026-05-03) **modal**: make model names clickable in cyber-coding _renderTable + frontier-compare _renderHeatmap `4ee0855`
- (2026-05-03) **peer-matcher**: UTC-aware cutoff date + tied-score and weakness tests `df83b45`

## ♻️ Refactors

- (2026-05-03) **modal**: extract showModel inline blocks into named helper methods `5559932`

## 📊 Data

- (2026-05-03) **enrichment**: rich curation — descriptions, license terms, tokenizer, hardware, vendor logos for frontier-30 `b8779ca`
- (2026-05-03) **safety**: curate AISI cyber tier + CBRN + METR + Apollo schemer for frontier-30 `986eb6b`
- (2026-05-03) **enrichment**: frontier-30 coverage push — Arena Elo +17, pricing +7, cards +10, cutoff/langs +20 `128d2e8`
- (2026-05-03) **models**: backfill context_window/cutoff/languages for frontier-10 `f491e1c`
- (2026-05-03) **enrichment**: seed frontier-30 model architecture/training/providers `3ca0eca`

## 🧪 Tests

- (2026-05-03) **modal**: fix Playwright selectors + add CI for peer-matcher node tests `f1c87b5`
- (2026-05-03) **modal**: Playwright E2E for enhanced detail modal `90fedb7`

## 🔧 Chores

- (2026-05-03) 5 quick wins — pre-commit guide, HF metadata expand, Cmd+K fuzzy, PNG 한글 font, Arena Elo placeholder `5b19f8d`
- (2026-05-03) 7 infra + quality tools (pre-commit, PR template, dependabot, badge, Makefile, JSON schema, CI) `ba561a1`

## Other

- (2026-05-03) data + feat: 6 curation enhancements — desc 30+, system cards 9, license inline, vendor logos, benchmark refs, quant HF links `32bd907`
