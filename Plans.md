# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Session 112 — Function calling / tool-use frontier (2026-06-14)
**2,600 models · 2,817 benchmarks · 12,745 scores · 🌍 +28 models / +18 benchmarks / +216 scores**

### 2026-06-14 Session 112 — Function calling / tool-use frontier (BFCL v4 + tau2 + GAIA/OSWorld/BrowseComp + frontier cards)
- 3 agents 🌍 **+28/+18/+216**. **BFCL v4 (Gorilla 2025-12-16 CSV)**: **Opus 4.5 FC 77.47 SOTA** + Sonnet 4.5 FC 73.24. **Gemini-3-Pro-Preview Prompt Live AST 83.12 SOTA**. **xLAM-2-70B-FC-R multi-turn 77.38** (open SOTA, Salesforce). **tau2-bench (Sierra)**: airline Opus 4.5 84.0 / GPT-5.2 83.0 / Gemini 3 Flash 82.5. retail **Qwen3.5-397B-A17B 84.43 SOTA**. telecom **Opus 4.6 + LongCat-Flash-Thinking-2601 tied 99.3** (pass^1). banking_knowledge **GPT-5.5 37.37 SOTA**. **ACEBench**: Kimi K2 76.5. **Real-world agents (BenchLM mirrors)**: **GAIA Mythos 5 / Fable 5 tied 52.3 SOTA**. **OSWorld-V Mythos 5 / Fable 5 tied 85.0 SOTA**, Opus 4.8 83.4, Holo3-35B-A3B 82.6 (top open). **WebArena Mythos 5 / Fable 5 tied 68.7 SOTA**. **BrowseComp GPT-5.5 Pro 90.1 SOTA**. **Princeton HAL**: SWE-V-Mini Sonnet 4.5 72.0% ($463.90), USACO GPT-5 Medium 69.1% ($116.63), CORE-Bench Hard Opus 4.5 77.8% ($87.16), tau-airline Sonnet 3.7 56.0% ($42.11). **Frontier card mining**: **Mythos 5 BrowseComp multi-agent 93.3** (beats GPT-5.5 Pro 90.1 / Opus 4.8 88.5). **DS-V4-Pro-High MCP-Atlas-Public 74.2** (beats GLM-5.1 71.8). **Mythos 5 DRACO 86.4** (first dashboard entry). Fable 5 Toolathlon Pass@3 68.5 SOTA. Sources: Mythos/Fable 5 SC §8.x, Opus 4.5-4.8 cards, DeepSeek V4 §5.3.2, Qwen 3.5 Omni Tables 4+7, MAI-Thinking-1 Table 12

### 2026-06-14 Session 111 — Cybersecurity benchmark refresh (+17/+61/+94)
- **Frontier cyber (19)**: GPT-5.5 UK AISI narrow 90.5% (+19.1pp), OpenAI Cyber Range 93.33%, Irregular CyScenarioBench 63.6%. Mythos 5 ExploitBench V8 78.0 + Firefox 147 88.4 + OSS-Fuzz 32.4 + AISI Last Ones 6/10 + Doing Life 21/23. Opus 4.5 NYU CTF 2026 59.0%. **Cyber agents (17)**: AIxCC 2025 Final Atlantis 1st ($4M) / Buttercup 2nd / Roboduck 3rd. **MDASH CyberGym 96.55%** (Build 2026; was 88.45 May — corrected SOTA, beats Mythos Preview 83.1, GPT-5.5 81.8). **xBow HackerOne US #1** (first AI 1000+ reports). D-CIPHER NYU CTF 22.0 / Cybench 22.5 / HackTheBox 44.0. XOffense AutoPenBench 79.17. Crystalline (S92) unconfirmed. **New 2026 boards (22)**: Opus 4.6 CTI-REALM 0.637 + Simbian 63%. GPT-5 SandboxEscape 0.50 (ICML 2026). GPT-5.5 CrackMeBench 92%. FuzzingBrain V2 36/40 + 41 zero-days. SEC-bench Pro 37.9/48.8. ExploitBench/ExploitGym/Cyber Defense (arXiv:2605.14153/2605.11086/2604.19533)

### 2026-06-14 Sessions 109-110 — Embedding + VLM frontier (+87/+66/+364)
- S110 VLM: **Mythos 5 MMMU-Pro 92.7**. **Qwen3-VL-235B-A22B MMMU-Pro Vision 69.3** (first open). **Qwen3-VL-32B-Thinking BLINK 80.3** (+16.5pp). **InternVL3.5-241B OCRBench 907**. Qwen3-VL-32B-Thinking MathVista 85.9. CharXiv RQ 66.2. **Opus 4.8 ScreenSpot-Pro 87.9**. **Gemini 3 Pro Video-MMMU 87.6** (above human 80.5). 12 bench boards. Strict catches: Qwen3.5-VL/Pixtral L2/Phi-5-vision/CogVLM3/Florence-3/Yi-VL2/Idefics4 don't exist. S109 Embed: **gemini-embedding-002 MTEB Multilingual 69.9** + Code 84.0. **Qwen3-Embedding-8B sweeps**: MTEB-en v2 75.22 / MMTEB 70.58 (displaces Gemini) / CMTEB 73.84 / Code 80.68. EmbeddingGemma 300M on-device SOTA. Strict catches: NV-Embed-v3/bge-icl-v3/snowflake-v3/SFR-3/Stella-v6/gte-Qwen3/text-embedding-3.5 don't exist

### 2026-06-11~14 Sessions 101-108 — Audio + Global South + MiMo + Coding agents + K2.7-Code + AI4S + Long-context + Math/Reasoning (+302/+207/+624)
- S106-108: **GPT-5.4-xhigh USAMO 2026 95.24%** (first proof-based). **Gemini Deep Think IMO 2025 35/42 GOLD**. **DeepSeek-v3.2-Speciale Putnam 103/120**. **Goedel-V2-32B MiniF2F 90.4** (>90% first, 20× fewer params). **Opus 4.6 MRCR-v2 8N @ 1M 76.0**. **Mythos 5 GraphWalks BFS@1M 79.4/Parents@1M 97.5**. Mamba-3 ICLR 2026 half state. **IsoDDE 50% Runs-N-Poses** vs AF3 23.3. Chai-2 20% antibody (100×). EquiformerV3+DeNS-OAM MatBench F1 0.931. GPT-5 USNCO 93.2. **PhysicsMinions IPhO-2025 26.8/30** first open gold. S105 K2.7-Code = K2.6 arch -30% thinking. S101-104: Devin 2.0 SWE-V 45.8 (3.3x). **Auggie SWE-Pro 51.80** ahead Cursor/Claude Code/Codex on Opus 4.7. **Mythos 5 sweeps coding** (Aider 95.5/SWE-V 95.5/SWE-Pro 80.3). **SWE-Lancer GPT-5.1 Codex 66.3**. Tau2 GLM-4.7-Flash 98.8. **Cohere Transcribe LibriSpeech 1.25**. Parakeet TDT v3 RTFx 3332x. **Fun-Realtime-TTS Elo 1226 #1**. Qwen3.5-Omni-Plus 4-audio sweep. Sarvam-105B JEE-Main 100/100. Qalb-1.0 Urdu 90.34. Falcon-H1-34B MMLU 84.05. ALLaM-7B Arabic 67.78. S103 MiMoCode = CLI agent NOT a model

### 2026-06-11 Sessions 93-100 — Quant + Chinese + Robotics + Image/Video + Medical + KR+JP + EU sovereign (+282/+352/+965)
- S93-100: **Mistral Large 3 675B/41B Apache MoE largest worldwide**. Cohere Command A Plus 218B/25B 48 langs. **Llama-Poro-2-8B Finnish 14x lift**. **SKT A.X K1 KMMLU 80.2**. K-EXAONE HRM8K 90.9. **Stockmark-2-100B JMT-Bench 7.87**. Fable 5 HealthBench Pro 0.660. Opus 4.6 AutoMedBench 66.5. Reve 2.0 T2I 1280 #2. HiDream-O1-Image 8B GenEval 0.90. **Wan 2.7 Video Pro T2V 1762** open-Apache. Sora-2 retired. **Spirit v1.6 RoboArena 1924 #1**. **LingBot-VA LIBERO 98.5%**. DeepSeek V4 1.6T HMMT 95.2. GLM-5.1 754B **SWE-Pro 58.4 first non-NVIDIA**. Qwen 3.6 35B-A3B-FP8 ELO 1397. Gemma 4 31B Q4_0 MMLU-Pro 85.2

### 2026-06-10 Sessions 86-92 (compressed) — 513 SOTAs
- S86-92: Mythos 5 (Organic Chem 90.1/Kernel 430.93×/Firefox 147 88.4/CyberGym 83.8). Fable 5 Blueprint-Bench 2 38.6. Cosmos 3 Super-T2I UniGenBench 91.36/HWB 71.9/RoboLab 39.7. Playwright CyberGym Crystalline/Opus 4.6 90.2. GPT-5.5 109 (CTF Pro 96.3/CVE-Bench 93.1) + 146 Safety. Gemini 3 Pro 16+17. MAI Thinking 71. Google evals ~370 (Gemini 3.1 Pro LCB Pro 2887). Anthropic gap 43 (USAMO 96.7). Arena GPT-Image-2 1465. CTI-REALM Opus 4.6 0.637. UK AISI MSCyber 22/32. NYU CTF Opus 4.5 59.0%. Cyber Defense Opus 4.6 15. Gordian Knot 54.6

### 2026-06-10 Sessions 77-85 (compressed) — 131 SOTAs
- S77-85: SciVQR/GraphInstruct/CommonWhy 23. gwBench 8. AgentRx MedPatch 0.877. Creativity 13. GeoBuild GPT-5.1 78.9. ExploitBench V8 Mythos Preview T1 ACE 0.439. **GPT-5.5 Codex CLI 0.0244** sole public ACE. VectraYX Spanish cyber 0.880. RealICU GPT-5.4+ICU-Evo 0.867. SMAC-Talk Qwen3.5 122B KDC→UDC 10. ERRORQUAKE Mistral-Small-24B b=1.250. DELEGATE-52 Gemini 3.1 Pro RS@20 80.9. Text2CAD DSv3.2 L4 8.26. Qwen-VLA LIBERO 97.9. DSPV2-671B MiniF2F 88.9. BenchCAD Qwen3-VL-2B V2C 0.768. Qwen3.5-Omni-Plus KeSpeech 3.46 6.8x

### 2026-06-10 Sessions 74-76 (compressed) — 39 SOTAs
- S74-76: Mythos 5 AECI **161.29** + Long-form virology Task 1 **0.77** (3.5x expert). Cosmos 3 Reasoner 4 cats (Super 73.7/Robotics 57.8/Smart-Infra 62.6/Driving 79.3). Opus 4.8 bio/safety 11 (Mythos Preview Virology 0.94/SHADE-Arena Opus 4.8 93% 4.4x Mythos 21%/Child Safety 95%). Goedel-V2-32B MiniF2F 92.7. Gemini 3 Pro Med 4 SOTAs (MedQA 95.1). GPT-5.5 UK AISI Cyber 90.5. MedGemma 1.5 EHRNoteQA 80.4. 8-pass S65-74 누적 ~81 NEW SOTAs 단일 Anthropic 출시. *Capability ↑ Safety/hallucination ↓*

### 2026-06-10 Sessions 70-73 (compressed) — 27 SOTAs
- S70-73: S73 DeepSearchQA F1 Preview 94.4 + Gray Swan ART Mythos 5 4.8 + Browser injection Mythos 5 29.7% 60x worse Opus 4.8 0.5. S72 SWE-V Mythos 5 95.5/SWE-Multi 92.2/ProgramBench 88.5/DRACO 86.4/Multi-Agent BrowseComp async 93.3/ChartMuseum 93.2/LAB-Bench FigQA 90.7. S71 cyber: Firefox 147 Mythos 5 88.4 (Opus 4.8 8.8 = 10x). CyberGym 99.4 SATURATED. UK AISI doing_life 21/23. Fable 5 cyber_classifier 99.3. S70 HLE no-tools 59 + 4 cyber benches (firefox 148/149 PoC 14, Windows BSOD 18 + priv-esc 8)

### 2026-06-09~10 Sessions 65-69 (compressed)
- S69 6 NEW audio/T2I vendors (bytedance/hidream-o1-image-1.5 T2I #3 1265, mistral voxtral-small-transcribe 2.8%, cohere/xai/gladia/amazon ASR). AA TTS refresh Fun-Realtime-TTS 1231→1228 #1
- S68 PDF deep re-mine 🌍 **14 NEW SOTAs** (8.5-8.20.7): Mythos 5 arxivmath 78.52 / USAMO 99.8 / USAMO 2026 99.8 / officeqa 79 / proteingym_hard 44.8 / terminal_bench_2_1 88 / structural_biology 87.2 / gmmlu 93.2 / include 90.5 / labbench2_avg 80.2. Fable 5 cursorbench 72.9 / riemannbench 55 / frontier_swe_mean5 2.12 / real_world_finance_v2_elo 1374. S67 audit propagation Frontier/Cyber/Sovereign
- S66 🌍 Fable 5 AAII **65** #1 (was Opus 4.8 61). GDPval-AA Elo 1932, SWE-Verified 95.0, Blueprint-Bench 2 38.6. NEW Cohere North Mini Code + MS MAI. S65 🌍 13 NEW SOTAs Fable/Mythos 5: Fable 5 SWE-Pro 80.3 / FrontierCode 29.3+46.3 / GDP.pdf 29.8. Mythos 5 ExploitBench 78 / OSWorld 85 / Toolathlon 61.7+58.3 / BioMystery 83.9+46.1 / LatchBio 69.2+59.3 / BrowseComp 88. **+19/+15/+95** = 1688/1467/7520

### 2026-06-09 Sessions 60-64 (compressed)
- S64 NEW Physical AI VLA generalistai/gen-1 🌍 3 NEW SOTAs (multitask 99%, box-folding 12.1s 2.8x π0, phone-packing 15.5s). +gen-0. 1X World Model Lab launched. S63 7-tab audit (12 models × 7 tabs) Frontier/Cyber/Agent propagation. S62 NEW Intelligence×Price Pareto widget (4 dominant: MiMo V2.5 Pro 270 #1, M3 250, Gemini 3.1 Pro 34, Opus 4.8 15). S61 MiniMax M3 22 sub-scores + 🌍 IFBench 83 #1 + Non-Hall 84 #1 + 3 NEW AA perf benchmarks. S60 18-vendor audit + Frontier-vs-Small Gap 3-widget suite. **+3/+6/+41** cumulative = 1669/1452/7425.

### 2026-06-04~09 Sessions 51-59 (compressed)
- S59 NEW Physical AI Edge & Mobile Small-LLM 4-widget subsection (66 ≤12B / 12 countries). S58 🌍 NEW AA Transcribe SOTA fun-realtime-asr-preview 1.7% WER, xAI TTS Elo 1208. S55 AA T2I 2 NEW + TTS Quality Elo Fun-Realtime-TTS 1227 SOTA. S54 Nemotron 3 Ultra AAII 48 + ITBench-AA Opus 4.7 47% SOTA. S53 NEW AA Transcribe Scribe v2 2.2%. S52 AutoMedBench Opus 4.6 66.5 + K-BrowseComp 45.67%. S51 minimax/m3 AAII 55 + 3 arena.ai NEW. **+23/+13/+111** cumulative.

### 2026-06-03~04 Sessions 47-50 (compressed)
- S50 GPT-Rosalind 4 life-sci (LifeSciBench 63.4) + Gemma 4 12B (MMLU Pro 77.2). S49 The AI Scientist 🌍 **WORLD FIRST: AI paper passed ICLR 2025 ICBINB blind peer review** (avg 6.33/10), Automated Reviewer F1 0.67. S48 MS 7 NEW MAI (MAI-Thinking-1 SWE-Pro 52.8, MAI-Code-1-Flash 5B, MAI-Transcribe-1.5 2.4% / 43 lang, MAI-Voice-2). 🔧 exporter bug fix. S47 Opus 4.8 AAII 61 #1 + Gemini 3.5 Flash ECI 156.31. **+14/+32/+101** cumulative = 1637/1428/7246

### 2026-06-02 Session 46b — Cosmos 3 + Qwen3.7-Plus deep re-mine (compressed)
- Cosmos3-Edge HMMT25 76.3 vs Qwen3.5-2B 22.9. Cosmos HUE per-dim — **Cosmos3-Super AV 87.7 / Physics 91.5 SOTA**. Qwen3.7-Plus complete 69-bench + 6 comparison cols. 18 NEW benches. **+0/+18/+98** = 1621/1396/7145.

### 2026-06-02 Session 46 — Cosmos 3 + Qwen3.7-Plus GA (compressed)
- Cosmos 3 omnimodal MoT (5 NEW models) — UniGenBench 91.36 (AA T2I #1 open) / PAIBench-G T2V 80.0 / I2V 82.8 / Physics-IQ V2V 63.4 BoN / RoboLab 39.7 (RoboArena #1). Qwen3.7-Plus 1M ctx — Terminal-Bench 2.0 70.3 / MRCR-v2 128k 91.7 / ScreenSpot Pro 79.0. **+5/+49/+103** = 1621/1378/7047.

### 2026-06-01 Session 44 — MiniMax M3 release (compressed)
- MiniMax M3 native multimodal MSA 1M ctx open-weight, SWE-Bench Pro 59.0% (surpasses GPT-5.5+Gemini 3.1 Pro). 3 NEW benches: PostTrainBench/SWE-fficiency/KernelBench Hard. Biohub ESM 0 ingest. **+1/+3/+8** = 1606/1321/6908. v=20260601c

### 2026-06-01 Session 43 — NVIDIA Nemotron 4-family ingest (compressed)
- Nemotron RAG/Parse/Speech/Safety from HF cards + arxiv 2511.20478. 7 models, 11 bench families. SOTAs: ViDoRe V3 63.54 (colembed-vl-8b-v2) · MMTEB v2 69.46 (llama-embed-nemotron-8b) · OmniDoc EN NED 0.048 (ocr-v2) · LibriSpeech clean WER 1.93% (parakeet-tdt v3). **+7/+11/+15** = 1605/1318/6900. v=20260601b

### 2026-05-31 Session 42 — ESM Cambrian / ESMFold2 (compressed)
- Biohub+EvolutionaryScale 71MB PDF. 7 protein models. SOTAs: ESMFold2+MSA PPI 76% / AbAg 53% / ESMC 6B 0.725 contact / ESMFold2-Fast 9.4s. **+7/+9/+19** = 1598/1307/6885.

### 2026-05-31 Session 41 — WorldArena.ai HF Space (compressed)
- HF grew 6→86 baselines. 3 NEW video-gen: Veo 3.1 / Wan 2.2 / Wan 2.6 #2. Physical AI +16 sub-metrics. **+1/+16/+131** = 1591/1298/6866.

### 2026-05-31 Session 40 — Deep re-mine round 2 (compressed)
- Opus 4.8 sys card unmined +7 NEW + SkillOpt + WorldArena T2 + AA Playwright. **+0/+10/+35** = 1590/1282/6735.

### 2026-05-30 Session 39 — Deep re-mine S33-S38 (compressed)
- 7 models + 13 benches. MAJOR BACKFILL FACTS+CompassRank. **+7/+13/+143** = 1590/1272/6700.

### 2026-05-30 Session 38 — 13-link multi-source (compressed)
- 9 models + 6 benches. Cosmos3-Super PAI-Bench-G 83.9 SOTA. **+9/+6/+21** = 1583/1259/6557.

### 2026-05-30 Session 37 — 17-link multi-source (compressed)
- gemini-3-flash-preview + 8 CN VLMs + CAD benches + FACTS/CompassRank. **+9/+8/+58** = 1574/1253/6536.

### 2026-05-29 Session 36 — 10-link multi-source (compressed)
- AgentDoG 1.5-4B + Gemini Embedding 2 + LocateAnything-3B + LFM2.5. R-Judge/ATBench/Offensive Cyber/MTEB-Code/AutoScientists BioML. **+4/+18/+46** = 1565/1245/6478.

### 2026-05-29 Sessions 34-35 (compressed)
- S35 Qwen3.5-Omni + Step-Audio-R1.5 / MMAU NEW. S34 SubQ 1M-Preview Subquadratic (RULER@128K 95.0). **+2/+2/+16** = 1561/1227/6432.

### 2026-05-28 ~ 29 Sessions 31-33 (compressed — see HISTORY.md)
- **S33** Claude Opus 4.8 244pp card (47 scores SWE-Verified 88.6/USAMO 96.7/GDPval-AA 1890 ELO; Mythos leads cyber), AutoScientists BioML 74.40, SkillOpt headline. 33b/c sync + §8.11/12/3.3.4 mine (ChartMuseum 89.7). **+3/+37/+146** = 1559/1225/6416 v=20260529a-c
- **S32** 4-link: 2 refs (SciMuse/WorldModelSurvey/Epicure/Google ThreatIntel), 0 score delta v=20260528e. **S31** DeepSWE 113 SWE tasks (gpt-5.5 70 SOTA, 3.5-flash > 3.1-pro inversion) + AAII fills. **+1/+1/+13** v=20260528d

### 2026-05-28 Session 30 — DeepRare + AgingBench + SciMuse + Gemini-for-Science
- DeepRare HPO R@1 57.18% (vs Claude-3.7-thinking 33.39). Multimodal Xinhua 69.1 vs Exomiser 55.9. Physician 163 cases 64.4 vs 54.6. AgingBench (UT Austin) + SciMuse (Max Planck 0.51) + AlphaEvolve + Antigravity NEW. **+13/+18/+33**=1555/1187/6257. v=20260528b

### 2026-05-27~28 Sessions 26-29 (compressed)
- S29 ERA/Robin/AutoSOTA + S28 MDASH/Co-Sci + S27 SensorFM + S26 Image/Video tabs. **+12/+37/+46**
**Live**: https://hollobit.github.io/SOTA/ · **CI**: benchmark-update.yml daily 06:00 UTC + workflow_dispatch; cache-bust auto.

### 2026-05-23 ~ 27 Sessions 21-25 (compressed — see HISTORY.md)
- **S25-S21** Glasswing/CVD + menu propagation + 7 user refs + arena.ai 12-leaderboard sweep. **+58/+26/+170**

### 2026-05-22 Session 20 cont'd 6 — Qwen3.7-Max official split from preview ID
- Split alibaba/qwen3.7-max (May 20 official, 45 scores) from qwen3.7-max-preview (May 14 arena, Elo 1475 only). SQL migrated 45 rows + JSON re-attributed. Menu: sovereign + frontier-compare. **+1/0/0**=1471/1106/6008. v=20260522a

### 2026-05-21 Session 20 (compressed)
- Qwen3.7-Max launch + Qwen3.7 deep dive + OpenAI Safety Hub + Mythos cyber + Palisade GPT-5 CTFs + FactoryBench (industrial robot 4-level). **+5/+72/+150**

### 2026-05-19 ~ 20 Sessions 18-19 (compressed — see HISTORY.md for full details)
- **Session 19** (May 20): Gemini 3.5 Flash + Omni Flash launch (14 benches) + TextArena/arena.ai + Qwen 3.7 Max/Plus preview + 35 cross-model triples from Gemini PDF page-4 comparison table (GPT-5.5 MRCR 128k 94.8 top, Opus 4.7 59.3 weakness) + SWE-Bench Pro correction + changelog PDF export
- **Session 18** (May 19): ExploitBench leaderboard delta + FRONTIER_MODELS hardcoded propagation + deep menu audit pass 2 (Agent/AI4S/Physical AI) + cyber-coding menu surface

### 2026-05-12~18 Sessions 12-17 (compressed)
- S17 SANA-WM/Grok CLI/cyber arxiv; S16 GBA Eval; S15 World FM/V-JEPA 2; S14 deepfake/AIGC; S13 Sovereign 13-country.
- **Session 12** (May 12): Mythos cyber + DELEGATE-52 + Onyx Open LLM (19 models × 10 benches) + Medical AI timeline + AA per-bench sub-scores

### 2026-05-10~11 Session 11 — ECI + AAII composite mega-ingest (compressed)
- ECI 3→178 + AAII 29→178. FC composite_eci/aaii split. AI4S widget W3/W9. 6 PDFs.

## Previous: Agent menu launch (2026-05-08, Session 2)
**1,114 models · 854 benchmarks · 3,315 scores · 14 active tabs (Overview / Leaderboard / Trends / Timeline / Comparison / Frontier Compare / Cyber & Coding / Sovereign AI / Physical AI / Medical AI / AI4S / **Agent (10 sub-categories)** / Explorer / Resources / Changelog)**

### 2026-05-08 Session 2 — Agent menu launch
- 28-task plan executed via subagent-driven-development skill: `docs/superpowers/specs/2026-05-08-agent-menu-design.md` + `docs/superpowers/plans/2026-05-08-agent-menu.md`
- 14 commits (`079cac2` → `f34d77c`): UI scaffolding (Tasks 1-9), benchmark registration (10-12), model registration (13-17), score sweep (18-23), Resources/docs sync (24-28)
- 4 sub-section UI: SOTA Watch + Categories + Frontier-vs-AgentProduct-vs-Edge Compare + Composite Leaderboard
- Strict-attribution maintained for all 24 new score rows

## Earlier sessions (compressed — see HISTORY.md)

---

## Active Monitoring Sources (24개)

### Leaderboards (실시간 업데이트)
| 소스 | URL | 벤치마크 |
|-----|-----|---------|
| LLM Stats | llm-stats.com | GPQA, SWE-bench, AIME, HLE, ARC-AGI-2, MMLU-Pro 등 |
| Vellum | vellum.ai/llm-leaderboard | 6개 주요 벤치마크 비교 |
| Artificial Analysis | artificialanalysis.ai | Intelligence Index, 10개 평가 |
| Chatbot Arena | lmarena.ai | Arena Elo |
| ARC Prize | arcprize.org/leaderboard | ARC-AGI-2 |
| LM Council | lmcouncil.ai/benchmarks | 18개 독립 벤치마크 |
| LiveBench | livebench.ai | Contamination-free 코딩 |
| Onyx | onyx.app/llm-leaderboard | 18개 벤치마크 |

### Cybersecurity & Coding
| 소스 | URL | 벤치마크 |
|-----|-----|---------|
| Cybench | cybench.github.io | CTF 40개 과제 |
| CyberGym | cybergym.io | 1,507 취약점 |
| Wiz Cyber Model Arena | wiz.io/cyber-model-arena | 257 실전 과제 |
| EVMbench | github.com/openai/evmbench | 스마트 컨트랙트 |
| AIRTBench | github.com/dreadnode/AIRTBench-Code | AI 레드팀 CTF |
| CyberSecEval 4 | github.com/facebookresearch/CyberSecEval | AutoPatchBench |
| CyberSOCEval | github.com/CrowdStrike/CyberSOCEval_data | SOC 방어 |
| BaxBench | baxbench.com | 보안 백엔드 코딩 |

### Agent
| 소스 | URL | 벤치마크 |
|-----|-----|---------|
| OSWorld | os-world.github.io | 컴퓨터 사용 |
| GAIA | huggingface.co/spaces/gaia-benchmark | 도구 활용 |
| BrowseComp | llm-stats.com/benchmarks/browsecomp | 웹 탐색 |
| TAU-bench | benchlm.ai/benchmarks/tauBench | 고객 서비스 |
| METR Time Horizons | metr.org/time-horizons | 자율 에이전트 |

### Evaluation Reports
| 소스 | URL | 내용 |
|-----|-----|-----|
| Epoch AI | epoch.ai/benchmarks | 40+ 벤치마크 트렌드 |

---

## Next Steps (향후 작업)

### Completed (compressed — see HISTORY.md)

### cc:TODO — Watch for future publications (external dependency) — last full re-sweep 2026-05-29 (Session 35)
- [x] MRCR v2 8-needle — ingested 2026-05-08 (Opus 4.6 93.0 / GPT-5.5 74.0 / Gemini 3.x)
- [x] Video-MME — **RESOLVED S35**: official board still stale (2025-09), but ingested 2026-frontier from Qwen3.5-Omni report (Omni-Plus 81.9/Flash 77.0 w/o-sub) + new `video_mme_audio` bench (Gemini-3.1 Pro 89.0)
- [x] MMAU — **RESOLVED S35**: first coverage (7 scores) from Qwen3.5-Omni + Step-Audio-R1.5 reports; Omni-Plus 82.2 SOTA (>human 78)
- [x] Qwen 3.7 Max/Plus preview — **RESOLVED-superseded**: official qwen3.7-max ingested S20 (45 scores); previews stay arena-Elo-only (category boards rank-only)
- [ ] HarmBench / StrongREJECT / AIR-Bench — **STILL BLOCKED** (rechecked 2026-05-29): Opus 4.8/GPT-5.5/Gemini 3.5 cards dropped these public benches for internal evals; HELM AIR-Bench frozen v1.1.0 (2024)
- [ ] Gemini Omni Flash — **STILL BLOCKED** (rechecked 2026-05-29): generative-media model, benches still deferred to API rollout; AA model page 404
- [ ] AutoPatchBench / CyberSOCEval — **STILL BLOCKED** (rechecked 2026-05-29): per-model scores image-only (PNG figures); paper lineups predate current frontier

## Architecture

```
resource/                    → PDF 원본 + 수집된 JSON 데이터
config/seed_sources.yaml     → 모니터링 소스 레지스트리
cyber/scouts/                → 데이터 수집 에이전트
cyber/analyst/               → SOTA 분석 + 정규화
data/benchmark.db            → SQLite 통합 DB
data/export/                 → 대시보드용 JSON export
dashboard/                   → 정적 대시보드 (ECharts + Tailwind)
  ├── js/app.js              → 메인 앱 (탭 라우팅, 데이터 로딩)
  ├── js/cyber-coding.js     → Cyber & Coding 4축 뷰
  ├── js/charts.js           → ECharts 래퍼
  ├── js/comparison.js       → 모델 비교 매트릭스
  └── js/explorer.js         → 1:1 모델 비교
BMT/                         → Benchmark Library 카탈로그 (2,559 엔트리)
```

## Key Data Files — `resource/*scores_2026_*.json` 시드 · `data/export/{models,benchmarks,scores/current,sota}.json` + `history/*.json` 일별 스냅샷 · `data/bmt_connections.json`/`bmt_catalog.json` BMT 매핑+카탈로그 (2,559개)
