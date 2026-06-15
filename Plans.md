# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Session 122 — Deep re-mine post-S113 (June 2026 cards + leaderboards + niche) (2026-06-15)
**2,969 models · 3,175 benchmarks · 14,939 scores · 🌍 +35 models / +52 benchmarks / +174 scores**

### 2026-06-15 Session 122 — Deep re-mine post-S113 (June cards + leaderboards + arxiv 2606.x)
- 3 agents 🌍 **+35/+52/+174**. **AA Intelligence Index v4.0 snapshot 2026-06-15**: **Claude Fable 5 = 64.9 #1** (vs Opus 4.8 61.0) + Arena Text 1510 + WebDev 1665 (+99 moat). GPT-5.5-xhigh + GPT-5.5 = 60.0 overtakes Opus 4.7 tier. Opus 4.8-thinking softer than expected (#9 Arena only). **Gemini 3.5 Flash MCP-Atlas 83.6 NEW SOTA** displaces S112 DS-V4-Pro-High 74.2 (+9.4pt). **Claude Fable 5 multi-bench**: SWE-V 95.0 / SWE-Pro 80.3 / Terminal-Bench 2.1 88.0 / GDPval-AA 1932 Elo / OSWorld-V 85.0 / LCB 89.78 / IOI 72.25 / Vibe Code 90.35 / HLE 53. **Claude Mythos 5 SWE-V 95.5 SOTA** (benchlm 2026-06-13). **Kimi K2.7 Code SWE-V 78.20** open-source. DeepSeek-V4-Pro-Max Codeforces 1.000 + LCB 0.935. **GPT-5.5 Agents' Last Exam (ALE) overall 26.2 SOTA** (Fable 5 22.0). vals.ai "Vals Index" headline composite (NEW June 2026). **NEW June arxiv 2606.x benches**: ALE (UC Berkeley RDI 1490 tasks 13 industry clusters), CL-Bench (continual learning), ResearchClawBench (Claude Code 21.5 SOTA), RealMath-Eval (224 high-school responses), SocSci-Repro-Bench (221 tasks), CUA-HandCrafted (browser CUA safety, Sonnet 4.6 + GPT-5.4 both 0/140), SentinelBench (100 long-running monitoring tasks), K-BrowseComp (Korean web GPT-5.5 45.67%), MCP-Persona ICML 2026, FindIt MLLM localization, Embodied-R1.5 8B SOTA 16/24 embodied benches. **NEW models**: Nemotron 3 Ultra 550B-A55B (33-bench suite from HF card), Kimi K2.7 Code, GLM-5.2 (no benches yet), GPT-Rosalind-5.5 (no benches yet), GPT-5.5-xhigh. **Confirmed NOT EXIST**: GPT-5.6/6, Gemini 3.5 Pro (announced May 19 not GA) / Gemini 4, Grok 4.5/5, Llama 5.5, DeepSeek V5/V4.5/R2 (held back per CEO), Qwen 3.8/4, Kimi K2.8/K3, GLM-6, MiMo V3, Hunyuan T2. **Confirmed NOT yet refreshed**: RE-Bench/HCAST 1.2+, GAIA-3, OSWorld-V v2, τ4-bench, OmniDocBench v2.0, PhysicsMinions IPhO 2026, ARC-AGI-4, ExploitBench V9, CTI-REALM v2, LCB v7/v8, HMMT March 2026, FrontierMath-3, AISI Inspect June, UK AISI/METR/Apollo June pubs. **Gaps**: swebench/livebench/llm-stats/HF v3 leaderboards need Playwright (client-rendered)

### 2026-06-15 Sessions 119-121 (compressed) — Edge LLM + 3D Gen + 8-tab propagation (+99/+118/+779)
- S121 8-tab propagation: 6 JS files modified (+109/-7). 70 S111-S120 model IDs propagated. cyber-coding +33 cyber benches + 14 agents. medical-ai clinical-llm +9 / radiology +11. physical-ai vla +7 / humanoids +8. frontier-compare +24 sub-12B. agent tool-use +14 / web-browse +5. ai4s prover regex extended. Audit 6/6 syntax OK / 0/70 FK failures. S120 3D (first broad sweep — dashboard had ZERO 3D coverage): 3D Arena Elo CSM Cube 1405 SOTA. Hi3DEval Object Hunyuan3D 2.5 = 16.561 SOTA. Hunyuan3D 2.5 ULIP-T 0.07853. TRELLIS-Image-Large Toys4k CLIP 85.77. TRELLIS.2 4B Dec 2025 CLIP 0.894. **SPAR3D GSO CD 0.120 / F-Score@0.2 0.850 SOTA**. InstantMesh F-Score@0.2 0.882. ProlificDreamer T3Bench single 49.4 SOTA. 17 open + 19 commercial 3D + 17 academic comparators. NOT EXIST: Luma Genie 2, StableMesh (=TripoSR/SPAR3D), Wonder3D-XL, DreamGaussian-2, OpenLRM/PF-LRM/GS-LRM. Anonymized Commercial 1/2 NOT mapped. Gap: Meshy/Tripo/Adobe/Edify don't publish public benches. **S119 Edge LLM (biggest score haul +545)**: Phi-4-mini-instruct (3.8B) GSM8K 88.6/MATH 64.0/MMLU-Pro 52.8 sub-3B multi-bench. Phi-4-mini-reasoning MATH-500 94.6/AIME-24 57.5. Granite 4.0 H-Tiny (7B/1B-active MoE) MMLU 68.65/HumanEval 83/IFEval 81.44. BitNet b1.58 2B4T MMLU 53.2 (1.58-bit native). **SmolLM3-3B BFCL v3 92.3 SUB-3B BEATS ALL FRONTIER** (vs GLM-4.5 77.8, Sonnet 4.6 76.0). MobileLLM-Pro 1.08B/R1-950M. Gemma 3 270M/1B. OLMo 2 1B. Falcon3 1B/3B. **Nemotron Nano 9B v2 hybrid Mamba** MATH-500 97.8/AIME-25 72.1/LCB 71.1 sub-10B SOTA. **Granite 4.1 8B Instruct** MMLU 73.84/HumanEval 87.20/IFEval 87.06. DS-R1-Distill-Qwen-7B MATH-500 92.8. Light-R1-7B-DS AIME24 59.1/25 44.3. Phi-4-mini-flash-reasoning MATH-500 92.45. xLAM-2-8B BFCL v3 72.04. **Gemma 4 family** AIME 2026: 31B=89.2/26B-A4B=88.3/12B=77.5. **Qwen3.6-27B AIME 2026 94.1+SWE-V 77.2 sub-30B coding crown**. CodeGemma 7B, OLMo 2 7B/13B, OLMoE 1B-7B, Marin 8B (Stanford). AAII v4.0 sub-12B: Gemma 4 26B-A4B AAII 31 Pareto leader / 12B 29 / Qwen3.5-4B 27. NOT EXIST: Phi-5 family (Phi-4 latest), Gemma 4 sub-3B (Gemma 3 latest), Llama 3.3/3.5 sub-12B, Qwen 3.5+ sub-3B dense, DS-R2-Distill, Qwen3-Reasoner, GLM-Edge, Granite 4.0 8B/11B (4.1 supersedes), Aya-23-8B (Aya Expanse), StableLM 3/4, TinyLlama 2.0, Kimi K0.5/K0.6, Samsung Gauss benches

### 2026-06-14 Sessions 114-118 (compressed) — Gen-AI + Robotics/VLA + Medical + Audio/Speech + OCR/Doc (+229/+125/+831)
- S118 OCR: **PaddleOCR-VL 1.6 0.9B OmniDocBench v1.6 = 96.33 SOTA**. MinerU 2.5-Pro 95.75 / GLM-OCR 0.9B 94.62 / Qianfan-OCR 93.12 / dots.ocr 90.77. **Unsiloed Parser olmOCR-Bench 88.0 SOTA**. Chandra OCR 2 (Datalab pivoted Marker→Chandra) 85.9 / LightOnOCR-2-1B 83.2 / olmOCR-2-7B 82.4. **Qwen3-VL-235B DocVQA-test 0.971**. Kimi K2.5 InfoVQA 0.926. Qwen3.6-Plus CC-OCR 0.834 + MMLongBench-Doc 0.620. NOT EXIST: Tesseract V6, LayoutLMv4, DiT-2, Donut V2/V3, Nougat 2, Marker 2, Florence-3 DocAI. S117 Audio: Fun-Realtime-ASR 1.7% SOTA + Fun-Realtime-TTS Elo 1226.47 (Alibaba both). Cohere Transcribe 03-2026 Open ASR 5.42. Scribe v2 3-board sweep. Qwen3.5-Omni-Plus VoiceBench 93.1 SOTA. Nemotron 3 Nano Omni VoiceBench 89.39 open SOTA. Step-Audio-R1 BBA 98.7. GPT-Realtime-2 BBA 96.6. PersonaPlex Jan 2026. Hibiki-Zero ASR-BLEU 34.6. Data-hygiene: openai/realtime-tts-2 misattributed (Inworld). NOT EXIST: Whisper V3.5/V4, Parakeet TDT v4, Scribe v3, Acoustica, Gemini Live 2, Kimi K2-Voice. S116 Medical: **Gemini 3.1 Pro MedQA-USMLE 97.4 SOTA**. MedGemma 27B MedQA 87.7. MedGemma 1.5 EHRQA 89.6. Fable 5 HealthBench Pro 0.660. Muse Spark MedXpertQA 0.784. AMIE Co-Clinician RxQA 73.3. Prov-GigaPath 25/26 path SOTA. VISTA-3D Dice 0.91. MAIRA-2 RadFact 90%. VisionFM AUROC 0.974 DR. NOT EXIST: MedGemma 2, Med-PaLM 3, HuatuoGPT-O2, Polaris 4, MAIRA-3, UNI-2, Virchow2G. S115 Robotics: Xiaomi-Robotics-0 4.7B LIBERO 98.7 SOTA. FutureVLA-GT LIBERO Object 99.8. xVLA-base 1% trainable. Flower-VLA CALVIN ABC 4.53. GR00T N2 preview. Humanoid hw: Atlas Electric 56 DoF/Unitree H1 3.3 m/s/G1 $16K cheapest. Optimus 8 km/h rejected. NOT EXIST: π1, Gemini Robotics 2.0, Helix 03, GR00T N3, Cosmos 4, Optimus Gen 3. S114 Gen-AI: **GPT-Image-2 AA T2I 1339 SOTA**. Dreamina Seedance 2.0 AA T2V/I2V SOTA. gemini-omni-flash arena.ai T2V 1527 + I2V 1475 #1. **FLUX.2-dev 32B open-weights leader**. FLUX.2-klein-4B Apache. Wan 2.2 first open MoE video. Kling 3.0/Ideogram 4.0/MJ V8.1/MAI-Image 2.5/Reve 2.0 new. NOT EXIST: GPT-Image-3, Sora 3, Imagen 5, Veo 4, SD 4, HiDream-O2/O3, Wan 2.5-3.0 (API)

### 2026-06-14 Session 113 — Deep re-mine sweep (cards/PDF tables + DeepMind methodology)
- 3 agents 🌍 **+6/+81/+410**. **Anthropic Mythos/Fable 5 SC § 3-8.20 deep table mining (257 triples)**: 52 NEW bench IDs — SHADE family (stealth visible-thinking / hidden-scratchpad / prompt-optimized / fine-tuned), BBQ disambiguated+ambiguous, election integrity API, identity honesty hard/easy, browser-PI 3-condition (no/current/updated safeguards), life-sci LABBench2 sub-cats + SpatialBench + SingleCellBench + BioMystery + Organic Chemistry + structural biology v2, OfficeQA Pro Fable 5 57.9 SOTA, Finance Agent Benchmark v2, Real-World Finance v2 Elo Fable 5 1374, **Mythos 5 USAMO 2026 99.8** / GMMLU 93.2 / MILU 92.9 / INCLUDE 90.5, FrontierSWE mean@5 Fable 5 2.12 SOTA, FrontierCode Diamond Fable 5 30.2, Vending-Bench 2 Opus 4.8 $5,787.43, CritPt physics Mythos 5 28.6, RiemannBench Mythos 5 55.0, AutomationBench Fable 5 17.4. ExploitBench V8 AutoNudge Mythos 5 78%, OSS-Fuzz ≥0.4 32.4%, CyberGym pass@1 83.8%, Firefox 147 88.4%. Browser-use PI updated safeguards Mythos 5 = 0/129 perfect. **DeepSeek V4-Pro Tech Report Tables 1+6+7 + Figs 8+9 (254 triples)**: **V4-Pro-Max Putnam-2025 proof 120/120** (ties Axiom, beats Seed-1.5-Prover 110). **V4-Flash-Max Putnam-200 Pass@8 81%** (crushes Gemini 3 Pro 26.5%). V4-Pro-Max Apex Shortlist 90.2 (Chinese SOTA). HMMT Feb 2026: GPT-5.4-xHigh 97.7 / Opus 4.6-Max 96.2 / V4-Pro-Max 95.2. MRCR 1M Opus 4.6-Max 92.9 (V4-Pro-Max 83.5, Gemini 3.1 Pro 76.3). New comparators: Seed-1.5/2.0-Prover, Axiom, Aristotle. 8 MRCR per-position bins. **Gemini deep re-mine (49 triples)**: **Gemini 3.1 Deep Think Codeforces 3455 Elo** new SOTA + IMO 2025 81.5 / IPhO 87.7 / IChO 82.8 first numeric self-reports. Gemini 3 Pro LMArena 1501 top-of-launch. Gemini 3 Pro tau2-airline 73.0 self-report. Gemini 3 Pro Deep Think HLE-no-tools 41.0 / ARC-AGI-2 code 45.1 / GPQA 93.8. Gemini 3.1 Flash Image baseline (non-Thinking) 9 GenAI-Bench dims. RE-Bench LLM Foundry 47s + human-norm avg

### 2026-06-11~14 Sessions 101-112 (compressed) — Tool-use + Cyber + Audio + Global South + MiMo + Coding + K2.7-Code + AI4S + Long-context + Math + Embedding + VLM (+434/+352/+1298)
- S112 Tool-use: BFCL v4 Opus 4.5 FC 77.47 + Gemini-3-Pro Live AST 83.12 + xLAM-2-70B multi-turn 77.38 (open). τ2: airline Opus 4.5 84.0, retail Qwen3.5-397B 84.43, telecom Opus 4.6+LongCat 99.3, banking GPT-5.5 37.37. GAIA+WebArena+OSWorld-V Mythos/Fable 5 tied SOTA. BrowseComp GPT-5.5 Pro 90.1 single / Mythos 5 93.3 multi-agent. DS-V4-Pro-High MCP-Atlas-Public 74.2. HAL: Sonnet 4.5 72.0/Opus 4.5 77.8/GPT-5-M 69.1. Mythos 5 DRACO 86.4. Fable 5 Toolathlon Pass@3 68.5
- S111 Cyber: **MDASH CyberGym 96.55** (Build 2026; was 88.45 May — corrected, beats Mythos Preview 83.1/GPT-5.5 81.8). GPT-5.5 UK AISI narrow 90.5%/OpenAI Cyber Range 93.33/CyScenarioBench 63.6. Mythos 5 ExploitBench V8 78.0/Firefox 147 88.4/AISI Last Ones 6-10/Doing Life 21-23. Opus 4.5 NYU CTF 2026 59.0. AIxCC 2025 Final Atlantis 1st ($4M)/Buttercup 2nd. xBow HackerOne US #1 (first AI). D-CIPHER NYU CTF 22.0/Cybench 22.5/HackTheBox 44.0. XOffense AutoPenBench 79.17. Opus 4.6 CTI-REALM 0.637/Simbian 63%. GPT-5 SandboxEscape 0.50 ICML 2026. GPT-5.5 CrackMeBench 92%. FuzzingBrain V2 36/40+41 zero-days. SEC-bench Pro 37.9/48.8. ExploitBench/ExploitGym/Cyber Defense (arXiv:2605.14153/2605.11086/2604.19533). S110 VLM: Mythos 5 MMMU-Pro 92.7. Qwen3-VL-235B MMMU-Pro Vision 69.3 (open). Qwen3-VL-32B-Thinking BLINK 80.3/MathVista 85.9. InternVL3.5-241B OCRBench 907. Opus 4.8 ScreenSpot-Pro 87.9. Gemini 3 Pro Video-MMMU 87.6. S109 Embed: gemini-embedding-002 MTEB-Multi 69.9/Code 84.0. Qwen3-Embedding-8B sweeps (MTEB-en v2 75.22/MMTEB 70.58/CMTEB 73.84/Code 80.68). EmbeddingGemma 300M on-device SOTA. S106-108: GPT-5.4-xhigh USAMO 2026 95.24 (first proof). Gemini Deep Think IMO 2025 35/42 GOLD. DSv3.2-Speciale Putnam 103/120. Goedel-V2-32B MiniF2F 90.4 (>90% first, 20× fewer params). Opus 4.6 MRCR-v2 8N@1M 76.0. Mythos 5 GraphWalks BFS@1M 79.4/Parents@1M 97.5. Mamba-3 ICLR 2026 half state. IsoDDE 50% Runs-N-Poses. Chai-2 20% antibody (100×). EquiformerV3+DeNS-OAM MatBench F1 0.931. PhysicsMinions IPhO-2025 26.8/30 first open gold. S105 K2.7-Code = K2.6 arch -30% thinking. S101-104: Devin 2.0 SWE-V 45.8. Auggie SWE-Pro 51.80. Mythos 5 sweeps coding (Aider 95.5/SWE-V 95.5/SWE-Pro 80.3). SWE-Lancer GPT-5.1 Codex 66.3. Tau2 GLM-4.7-Flash 98.8. Cohere Transcribe LibriSpeech 1.25. Parakeet TDT v3 RTFx 3332x. Fun-Realtime-TTS Elo 1226 #1. Qwen3.5-Omni-Plus 4-audio sweep. Sarvam-105B JEE-Main 100/100. Qalb-1.0 Urdu 90.34. Falcon-H1-34B MMLU 84.05. ALLaM-7B Arabic 67.78. S103 MiMoCode = CLI agent NOT a model

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
- [ ] Gemini Omni Flash — **STILL BLOCKED** (rechecked 2026-05-29): generative-media model, benches still deferred to API rollout. AutoPatchBench / CyberSOCEval — image-only (PNG figures); paper lineups predate current frontier

## Architecture

```
resource/                    → PDF 원본 + 수집된 JSON 데이터
config/seed_sources.yaml     → 모니터링 소스 레지스트리
cyber/scouts/                → 데이터 수집 에이전트
cyber/analyst/               → SOTA 분석 + 정규화
data/benchmark.db            → SQLite 통합 DB
data/export/                 → 대시보드용 JSON export
dashboard/                   → 정적 대시보드 (ECharts + Tailwind, js/app.js+cyber-coding.js+charts.js+comparison.js+explorer.js)
BMT/                         → Benchmark Library 카탈로그 (2,559 엔트리)
```

## Key Data Files — `resource/*scores_2026_*.json` 시드 · `data/export/{models,benchmarks,scores/current,sota}.json` + `history/*.json` 일별 스냅샷 · `data/bmt_connections.json`/`bmt_catalog.json` BMT 매핑+카탈로그 (2,559개)
