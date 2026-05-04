# LLM Benchmark SOTA Dashboard — Work History

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
