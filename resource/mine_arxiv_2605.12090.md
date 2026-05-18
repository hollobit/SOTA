# arxiv 2605.12090 — World Action Models

## Paper summary
- **Title:** World Action Models: The Next Frontier in Embodied AI
- **Authors:** Siyin Wang, Junhao Shi, Zhaoyang Fu, Xinzhe He, Feihong Liu, Chenchen Yang, Yikang Zhou, Zhaoye Fei, Jingjing Gong, Jinlan Fu, Mike Zheng Shou, Xuanjing Huang, Xipeng Qiu, Yu-Gang Jiang
- **Affiliations:** Fudan University (Institute of Trustworthy Embodied AI / OpenMOSS), Shanghai Innovation Institute, National University of Singapore
- **Date:** 12 May 2026 (arXiv v1, 69 pages)
- **Type:** SURVEY paper (not a benchmark paper, not a new model release)
- **New benchmark introduced:** NONE — paper proposes a taxonomy / framework for "World Action Models" (WAMs); it does not release a new dataset, model, or numeric leaderboard.
- **Scope:** First systematic survey of WAMs (embodied foundation models that unify predictive state modeling with action generation). Organizes existing work into Cascaded WAM (Explicit / Implicit planning) and Joint WAM (Autoregressive / Diffusion-based, Unified / Multi-Stream). Sections: Definition (Sec. 2), Background (Sec. 3), Architecture (Sec. 4), Training Datasets (Sec. 5), Evaluation (Sec. 6), Open Challenges (Sec. 7).
- **Top finding:** The field has fragmented into ~80+ named methods (UniPi, VLP, RoboEnvision, This&That, Say-Dream-Act, TesserAct, MVISTA-4D, Vidar, Gen2Act, Veo-Act, VAG, π₀.₇, GR-1/2/MG, CoT-VLA, WorldVLA, RynnVLA-002, F1, VLA-JEPA, PAD, VideoVLA, UWM, DreamZero, Cosmos Policy, GigaWorld-Policy, X-WAM, UD-VLA, FLARE, FRAPPE, CoVAR, LDA-1B, DUST, LingBot-VA, DexWorldModel, AIM, Motus, MotuBrain, AdaWorldPolicy, DiT4DiT, Fast-WAM, WAV, Act2Goal, UVA, PhysGen, Video Policy, ARDuP, mimic-video, VPP, VILP, LAPA, villa-X, S-VAM, OmniVTA, MWM, etc.) with no head-to-head evaluation under matched conditions. Authors explicitly call this out (Sec. 7: "no systematic, controlled study has evaluated these paradigms against one another under matched conditions of scale, data, and evaluation protocol").

## Score extractions
| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| Ctrl-World (improvement applied to π_{0.5}-DROID) | π_{0.5}-DROID downstream tasks | +44.7 | % success-rate improvement (Δ vs base) | p.12, Sec. 3.3.1 prose |

**That is the only concrete numeric (model, benchmark, value) triple in the entire 69-page paper.** All other "benchmark" mentions are qualitative ("comparable", "stronger", "achieves"). Tables 1, 2, 3 (taxonomy) and Tables 4, 5, 6, 7 (datasets) and Tables 8, 9 (eval benchmarks) list architectures / dataset specs / benchmark metadata only — no model scores.

Also note: the single triple above is not a strict (model, benchmark, value) score either — it is a *delta* improvement applied to a third-party policy. Under STRICT-ATTRIBUTION it should arguably be skipped (see Skipped section).

## New benchmark IDs to register
**None.** The paper introduces zero new benchmarks. It surveys existing ones (PhyGenBench, VBench-2.0, WorldModelBench, Physics-IQ, WorldScore, EWMBench, WorldSimBench, Wow-wo-val, MetaWorld, RLBench, Robomimic, Franka Kitchen, CALVIN, ManiSkill/2/3, VIMA-Bench, VLMbench, ARNOLD, LIBERO, LIBERO-plus, LIBERO-pro, LIBERO-X, COLOSSEUM, GemBench, AGNOSTOS, SimplerEnv, RoboCasa, GenManip, VLABench, RoboVerse, RoboSuite, RoboEval, RoboMME, RoboLab, PolaRiS, RoboTwin, BiGym, HumanoidBench, HumanoidGen, HomeRobot, ManipulaTHOR, BEHAVIOR-1K, SoftGym, PlasticineLab, DaXBench, TacSL, ManiFeel, RoboArena, RoboChallenge, Maniparena) but introduces none.

## New model IDs to register
**None for the survey itself.** However, the paper references ~150 named WAM/VLA/world-model methods that *may* warrant model_id registration if used elsewhere. Canonical-mapping candidates already in scope:
- π_{0.7} (Physical Intelligence) — ref [79], arXiv 2604.15483 → `physical-intelligence/pi-0.7`
- π_{0.5} / π_{0.5}-DROID — ref [253], arXiv 2504.16054 → `physical-intelligence/pi-0.5`
- π₀ (already canonical) — ref [3], arXiv 2410.24164 → `physical-intelligence/pi-zero`
- Cosmos Policy / Cosmos-Predict2 — refs [16, 349] → `nvidia/cosmos-policy`, `nvidia/cosmos-predict-2`
- V-JEPA 2 / V-JEPA 2.1 — refs [302, 306] → `meta/v-jepa-2`, `meta/v-jepa-2.1`
- Genie (interactive envs) — ref [278] → `google-deepmind/genie` (Genie 2/3 not cited here)
- Veo-Act / Veo Robotics — refs [60, 78] → `google-deepmind/veo-act`
- GR-1, GR-MG, GR-2 — refs [86, 87, 88] → `bytedance/gr-1`, `gr-mg`, `gr-2`
- VLA-JEPA — ref [92], arXiv 2602.10098 → `fudan/vla-jepa`
- WorldVLA — ref [90] → `alibaba/worldvla`
- RynnVLA-002 — ref [91] → `alibaba/rynnvla-002`
- F1 — ref [93] → `f1-vla` (org TBD)
- Cosmos-Transfer1 — ref [281] → `nvidia/cosmos-transfer-1`

These are method *names from the survey*, not registrations — the paper provides zero performance numbers for any of them.

**Models from the user's canonical-mapping list NOT mentioned in the paper:**
- MolmoAct 2 (allenai) — not cited
- GR00T N1.6 / N1.7 (nvidia) — not cited (the GR-1/2 here is ByteDance, different lineage)
- SANA-WM / +refiner (nvidia) — not cited
- Gemini Robotics ER 1.5 / 1.6 — not cited (only "Gemini Robotics in Veo World Simulator" ref [60])
- Cosmos-Reason-2, Cosmos-Policy-Robocasa, Cosmos-Predict-1-7B, Cosmos-Predict-2.5 — only generic "Cosmos-Predict2" / "Cosmos Policy" / "Cosmos-Transfer1" cited
- Genie 3, Genie 2 — only Genie (2024) ref [278] cited
- OpenVLA-7B — cited once in intro (ref [2]) without scores
- RT-2 — cited once in intro (ref [1]) without scores

## Skipped
- **Ctrl-World +44.7% on π_{0.5}-DROID** — skipped under STRICT-ATTRIBUTION when applying the rule literally: this is a *delta* attributed by the survey authors paraphrasing the Ctrl-World paper (ref [38], arXiv 2510.10125); the (model, benchmark, value) anchor lives in the cited primary, not in the survey. The survey is a tertiary mention. To register cleanly, mine arxiv:2510.10125 directly. The triple is recorded in the table above for traceability but flagged as not-strict.
- All ~366 references with no quantitative claims in the survey text itself.
- All architectural / dataset / metric tables (Tables 1-9) which contain zero numeric scores.
- DreamZero "~7Hz inference vs 50Hz VLA standard" (p.43) — latency claim, not a benchmark score.

## Total
- **Strict (model, benchmark, value) triples in this paper: 0**
- **Loose / paraphrased delta triples: 1** (Ctrl-World on π_{0.5}-DROID)
- **New benchmarks introduced: 0**
- **New models introduced: 0**
- **Extractable yield: zero usable rows for a strict-attribution score database.**

## Recommendation
This is a survey paper. It is highly valuable as a **reference/taxonomy resource** (e.g., to register ~150 WAM method names into a model registry, or to seed a "WAM benchmarks list" page) but yields no benchmark scores. For actual numbers on the named WAM methods, mine the primary papers — top targets in the lineage the user listed:
- arXiv 2510.10125 — Ctrl-World (π_{0.5}-DROID improvement)
- arXiv 2504.16054 — π_{0.5}
- arXiv 2604.15483 — π_{0.7}
- arXiv 2506.09985 — V-JEPA 2
- arXiv 2603.14482 — V-JEPA 2.1
- arXiv 2602.10098 — VLA-JEPA (LIBERO + SimplerEnv + LIBERO-Plus)
- arXiv 2506.06949 — DreamDojo
- arXiv 2503.14492 — Cosmos-Transfer1
- arXiv 2402.15391 — Genie
- arXiv 2402.08191 — COLOSSEUM
- arXiv 2510.13626 — LIBERO-Plus (in-depth robustness analysis of VLA — same authors)
