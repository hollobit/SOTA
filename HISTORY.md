# LLM Benchmark SOTA Dashboard — Work History

## 2026-04-26 ~ 04-28: Medical AI 메뉴 신설 + 종합 expansion (10+ batches)

### Medical AI 신규 탭 (Sovereign/Physical AI 패턴 미러)
**위치**: `dashboard/index.html` 신규 `tab-medical-ai` + `dashboard/js/medical-ai.js`. 총 30 카테고리 + 32 sub-suite leaderboard + ~750 models / 188 benchmarks / ~1,500 scores.

### 카테고리 구조 (30개)
- **Functional**: Clinical LLMs · Biomedical LLMs · Multilingual & Regional · Biomedical Encoder Models · Medical Imaging FMs (SAM 1/2/3 + MedSAM 1/2/3) · Specialty FMs (Pathology/Ophthalmology/Cardiology/Dermatology) · Frontier Baselines · Nursing AI · Medical VLMs · Protein Structure & Design · Drug Discovery · Radiology Reporting · Multilingual Regional · Safety Evaluators · Clinical Outcome Prediction · ⌚ Time-Series & Wearable Health FMs · 🏛️ MLCommons MedPerf
- **Sovereign 11개국**: 🇰🇷 Korea (LLM/FM only — SNUH KMed.ai, Lunit MedScale 32B, Kakao Healthcare, MedKAIST) · 🇯🇵 Japan (ELYZA-LLM-Med, MedCALM, JMedLoRA) · 🇩🇪 Germany (DKFZ+EMBL Delphi Nature 2025, Aignostics×Mayo, TUM MedBERT.DE) · 🇫🇷 France (BioMistral CNRS, Owkin H-Optimus/DRAGON, Raidium) · 🇬🇧 UK (NHS AIDE, RETFound 2 DeepMind+UCL, Imperial Medical) · 🇨🇦 Canada (Vector Clairvoyance, UHN AI Hub, Mila CliniCLM, T-CAIREM) · 🇮🇳 India (Fractal Vaidya 2.0 — HealthBench Hard 50.1 world 1st 50+, Apollo, AI4Bharat Airavata) · 🇦🇪 UAE (Med42 Cerebras, TII Falcon Bio) · 🇸🇬 Singapore (Synapxe MOH, AI Singapore SEA-MedLex) · 🇨🇳 China (Alibaba SumiHealth, Tencent MedLLM-2, Baidu Wenxin Yiyi, MMedLM, HuatuoGPT) · 🇺🇸 US (Polaris, Almanac, MIT CLIPath, NIH C-MedBERT)

### BENCHMARK_SUITES (32개)
🩺 Clinical Workflow Chat & Safety (HealthBench Pro/Base, Polaris, CARE-QA) / 🎓 Medical Licensing & QA (MedQA, MedMCQA, PubMedQA, MMLU Clinical, MedXpertQA, MedBullets, EHRQA) / 🌏 Multilingual / Regional (MMedBench, MedBench Chinese, KMLE, MedAgentBench, Open Medical-LLM avg) / 🏥 Clinical Case Reasoning (NEJM, JAMA) / 🧊 Medical Imaging Segmentation (Universal Med-Seg, BraTS, OmniMedVQA, RAD-ChestCT) / 🔬 Specialty Imaging (RetBench, RadBench, Path AUROC, EchoNet, PanDerm) / 📚 Biomedical NLP / 🛡️ Medical Safety & Hallucination (Med-HALT, MedHallu, MedHallBench, MedSafetyBench AMA, PatientSafeBench, CSEDB Nature npj 2025, CRAFT-MD, MEDIC) / 📝 Radiology Report Gen ReXrank 8-metric (MedVersa SOTA RadGraph-F1 32.1) / 🖼️ Medical VQA (VQA-RAD, SLAKE, Path-VQA, PMC-VQA) / 📈 Clinical Outcome Prediction (MIMIC-IV Sepsis, AKI, eICU cross-gen) / 🇰🇷 Korean Sovereign / 👁️ Medical VLM / ⚠️ Bio Dual-Use & Safety (WMDP-Bio/Chem, VCT, BioLP-bench) / 🧪 Protein (CASP16 GDT, AlphaFold3 pLDDT, PDBBind RMSD, Absci yield) / 💊 Drug Discovery (MoleculeNet, TDC ADMET) / 🧮 Medical Calculation & Long-Context (MedCalc-Bench NeurIPS 2024, LongHealth, MedRAG, LiveDRBench) / 🌐 Chinese Medical (MedJourney, CliMedBench, MedDialog, PharmKG) / 👩‍⚕️ Nursing AI (NCLEX-RN, Chinese Nursing Licensure, NurseLLM 7B) / 🩻 Advanced Medical Imaging (CheXpert Plus, CXR-LT 2024, Chest ImaGenome, HAM10000, DRIVE retinal, DDSM mammography, RSNA Brain Hemorrhage, STOIC COVID CT, MCA-RG MICCAI 2025) / 🏥 MedHELM Holistic Medical Eval (Stanford CRFM 5-cat × 22-subcat × 121-task, Claude Opus 4.6 81.5 SOTA) / 🤖 Medical Agent (AgentClinic-MedQA/NEJM, MedAgentBench NEJM AI 2025, MedQA Vals AI, MedArena Stanford HAI Elo) / 📋 EHR-grounded & Clinical Notes (EHRNoteQA, MedRepBench, ClinicalBench) / 🔬 BMT Pathology / 🧪 BMT Bio Protocols / 🌏 National Medical Licensing & Sovereign / 🧊 3D Medical Segmentation (SAM 3, MedSAM 3, VISTA3D, SAM-Med3D, SegVol, SAT-Pro, nnInteractive) / ⌚ Time-Series & Wearable Health (TimesFM zero-shot, PH-LLM Sleep/Fitness beats human experts, LSM-2 40M hrs Fitbit, Apple 57-task, JEPA BP, CVD-HIV) / 🏛️ MLCommons MedPerf Federated (FeTS 2.0 nnUNet 32 sites × 6 continents × 41 models, Dice 0.95 record Nature Comm. 2025; AILuminate v1.1; MLPerf Inference v5.1)

### 핵심 SOTA 결과 (2026-04-28 기준)
- ChatGPT for Clinicians (GPT-5.4) HealthBench Professional **59.0** vs human physicians 43.7
- Vaidya 2.0 HealthBench Hard **50.1** (world 1st 50+, beats GPT-5+Gemini Pro 3 at India AI Impact Summit 2026)
- Med-Gemini-L MedQA **91.1** / GPT-5.5 95.4 / o4-mini-high 95.2 (Vals AI Apr 2026 SOTA)
- Polaris 3.0 4.2T constellation **99.38%** clinical safety
- MedSAM-3 14-modality avg Dice **91.5** SOTA (text-promptable medical seg)
- MedSAM-3 Agent (MLLM-in-loop) **93.4**
- MedSAM Universal Med-Seg Dice **92.0** median
- VISTA3D 127-organ Dice **86.8**
- Virchow2 PathMCQA **85.7** / BEETLE 88.5 / SPIDER 84.3
- AlphaFold 3 PDBBench RMSD **1.65Å** (beats specialized docking)
- Claude Opus 4.6 MedHELM **81.5** SOTA
- ChemFM 3B MoleculeNet 81.5 (+67.48% gains)
- PH-LLM 2 Sleep **79%** / Fitness **88%** (beats human experts 76/71)
- LSM-2 40M-hr Fitbit health classification AUROC **84.5**
- FeTS 2.0 nnUNet post-op GBM Dice **0.95** record (Nature Comm. 2025)
- ELYZA-LLM-Med 70B IgakuQA **87.5** (Japan SOTA)
- Qwen-2.5 Medical Chinese Nursing **88.9** SOTA
- NurseLLM NCLEX-RN **88.4** (first nursing-specialized LLM)
- SNUH KMed.ai KMLE **96.4** (3-yr avg, world-class claim)

### BMT Registry 통합
- `scripts/map_bmt_benchmarks.py`: idempotent — strict + loose + alpha-only + substring fallback. 100+ ALIASES
- BMT/BMT.json (2,559 entries 외부) → BMT-mapping.json (**119 matched** = 63%) + BMT-miss.json (69 misses, sovereign/sub-metric variants)
- `cyber/publisher/exporter.py`가 `config/benchmarks_meta.yaml` 메타데이터 자동 머지 → `data/export/benchmarks.json`에 paper/github/year/item_count/leaderboard/bmt 필드 노출
- `dashboard/js/modal.js Modal.showScoreSource`: 'BMT / Paper / GitHub' 4-link block + year + item_count 렌더링

### Resources 탭 + Changelog propagation
의료 AI 누적 자료 일괄 등록 — PDF 30+ 신규, 사이트 100+ 신규 (Stanford MedHELM, AgentClinic, MedAgentBench, ReXrank, MedSAM 3 paper+GitHub, AlphaFold 3 Nature, TimesFM Google Research, PH-LLM Nature Med, LSM-2, Apple Wearable, MLCommons MedPerf+FeTS, AILuminate, NurseLLM, NCLEX studies, Chinese Nursing Licensure JMIR, CheXpert Plus, MIMIC-IV/eICU PhysioNet, BMT Registry GitHub permalinks 등).

### 출시 타임라인 그래프 (Medical AI 탭, 2026-04-26)
국가별 색상 scatter (14개국 팔레트), x = 출시일, y = 파라미터 (B, log scale 기본 + linear/best-score 토글). 기간 필터 (전체/2026/2025/2024/2023이전). 버블 크기 √파라미터, 클릭 → 모델 상세 modal. KNOWN_PARAMS_MED 140+ entries, _VENDOR_COUNTRY_FALLBACK 90+ vendor prefix → country mapping.

### 2026-04-28 finalization
- BMT mapping recovery: 102 → 119 matched (script extended)
- Modal BMT links + exporter YAML merge
- Cyber & Coding backfill: Claude Opus 4.7 SWE-bench Verified **87.6 SOTA**, Cybench 86.4, FORTRESS 92.7
- Physical AI backfill: NVIDIA GR00T N1.7 LIBERO 98.7
- Plans.md 정리 (237 → 185 lines under 200-line limit)

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
