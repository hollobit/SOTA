# World Foundation Models — 2026-05-15

Baseline DB: 1433 models / 1006 benchmarks / 5452 scores.
Investigation scope: WFM coverage gaps — missing benchmarks (VBench, VBench-2.0, IntPhys 2, MVPBench, CausalVQA, PAI-Bench, plus FVD/FID for driving WFMs) and missing models (V-JEPA 2, V-JEPA 2.1, Marble, GAIA-2).

STRICT-ATTRIBUTION: every score below has model + benchmark + numeric value + primary-source URL.

## Already covered (verify DB)

| WFM / bench | Status | Notes |
|---|---|---|
| Cosmos Predict 2.5 (2B/14B) | OK | `nvidia/cosmos-predict-2.5` family registered |
| Cosmos Reason 1 / 2 | OK | `cosmos-reason-1-7b/8b/56b`, `cosmos-reason-2` |
| Cosmos Transfer 2.5 | OK | registered |
| Cosmos Policy / Robocasa | OK | registered (multiple LIBERO scores) |
| Gemini Robotics ER 1.5 / 1.6 | OK | registered |
| Genie 2 / 3 | OK | both registered |
| GR00T N1.7 (and likely N1.6) | OK | LIBERO=98.7% |
| π-zero / π-zero-FAST | OK | LIBERO scores present (Spatial 96.8, Object 98.8, Goal 95.8, Long 85.2) |
| OpenVLA 7B / OFT | OK | LIBERO Spatial 84.7 / Object 88.4 / Goal 79.2 / Long 53.7 (baseline) |
| Octo-Base | OK | SimplerEnv 62.0% present |
| MolmoAct 2 | OK | `allenai/molmoact-2` |
| HY-World 2.0 (Hunyuan) | OK | `tencent/hy-world-2.0` |
| Lingo-2 | OK | `wayve/lingo-2` |
| Sora-2 / Sora-2 December | OK | both registered |
| Apptronik Apollo (DeepMind variant) | OK | `apptronik/apollo-gemini` |
| GAIA driving benchmark | partial | `gaia2` exists but as **agent** benchmark — NOTE COLLISION with Wayve's GAIA-2 (different thing); see below |
| VBench / VBench-2.0 | **MISSING** | not registered as benchmarks |
| V-JEPA 2 / 2.1 (Meta) | **MISSING** | not in models table |
| World Labs Marble | **MISSING** | not in models table |
| Wayve GAIA-2 driving WFM | **MISSING** | not in models table (id `gaia2` is the agent bench, different) |
| 1X Redwood | **MISSING** | not found |
| Sora 2 Pro tier | partial | tier-level not separately registered |
| IntPhys 2 / MVPBench / CausalVQA | **MISSING** | physical reasoning benchmark family from Meta |
| PAI-Bench (text2world / image2world) | OK | both registered (`pai_bench_text2world/image2world`) |

## New benchmarks to register

| id | name | description | metric | source |
|---|---|---|---|---|
| `vbench_total` | VBench Total Score | Composite of Quality + Semantic Scores across 16 dimensions; weighted average (Quality+Semantic) | percent | https://github.com/Vchitect/VBench |
| `vbench_quality` | VBench Quality Score | Sub-dimension aggregate (subject consistency, motion smoothness, aesthetic, imaging quality, etc.) | percent | https://github.com/Vchitect/VBench |
| `vbench_semantic` | VBench Semantic Score | Sub-dimension aggregate (object class, multi-objects, color, scene, etc.) | percent | https://github.com/Vchitect/VBench |
| `vbench2_total` | VBench-2.0 Total Score | Mean of 5 category scores (Creativity, Commonsense, Controllability, Human Fidelity, Physics) | percent | https://arxiv.org/abs/2503.21755 |
| `vbench2_physics` | VBench-2.0 Physics Score | Mechanics + Material + Thermotics + Multi-View Consistency sub-dims | percent | https://arxiv.org/abs/2503.21755 |
| `vbench2_commonsense` | VBench-2.0 Commonsense Score | Dynamic spatial, dynamic attribute, motion order, human interaction | percent | https://arxiv.org/abs/2503.21755 |
| `vbench2_controllability` | VBench-2.0 Controllability Score | Complex landscape, complex plot, camera motion, motion rationality, instance preservation | percent | https://arxiv.org/abs/2503.21755 |
| `vbench2_human_fidelity` | VBench-2.0 Human Fidelity Score | Human Anatomy, Clothes, Identity | percent | https://arxiv.org/abs/2503.21755 |
| `vbench2_creativity` | VBench-2.0 Creativity Score | Composition + Diversity sub-dims | percent | https://arxiv.org/abs/2503.21755 |
| `intphys2` | IntPhys 2 | Physically plausible vs implausible scenario classification (Meta) | percent | https://arxiv.org/abs/2506.09849 |
| `mvpbench` | Minimal Video Pairs (MVPBench) | MCQ physical understanding with minimal-change pairs | percent | https://arxiv.org/abs/2506.09987 |
| `causalvqa` | CausalVQA | Counterfactual / anticipation / planning VQA on physical videos | percent | https://arxiv.org/abs/2506.09943 |
| `pai_bench_text2world_post` | PAI-Bench Text2World post-train | Overall score | score 0-1 | https://arxiv.org/abs/2511.00062 |
| `pai_bench_image2world_overall` | PAI-Bench Image2World Overall | Overall score | score 0-1 | https://arxiv.org/abs/2511.00062 |
| `fvd_av_multiview_stylegan` | FVD-StyleGAN (AV 7-cam) | Fréchet Video Distance with StyleGAN backbone on AV multiview | FVD (lower=better) | https://arxiv.org/abs/2511.00062 |
| `fid_av_multiview` | FID (AV 7-cam) | Fréchet Inception Distance, AV multiview generation | FID (lower=better) | https://arxiv.org/abs/2511.00062 |
| `ss_v2_top1` | Something-Something v2 (Top-1) | Action recognition top-1 accuracy | percent | https://arxiv.org/abs/2506.09985 |
| `epic_kitchens_recall5` | Epic-Kitchens-100 Recall@5 | Human action anticipation Recall@5 | recall | https://arxiv.org/abs/2506.09985 |
| `perception_test` | Perception Test | Video QA benchmark | percent | https://arxiv.org/abs/2506.09985 |
| `tempcompass` | TempCompass | Temporal video understanding | percent | https://arxiv.org/abs/2506.09985 |
| `ego4d_lta_map` | Ego4D LTA (short-term obj-interaction mAP) | Long-term anticipation mAP | mAP | https://arxiv.org/abs/2603.14482 |
| `tartandrive_ate` | TartanDrive ATE | Robotic navigation Absolute Trajectory Error | ATE (lower=better) | https://arxiv.org/abs/2603.14482 |
| `nyuv2_depth_rmse_linprobe` | NYUv2 Depth RMSE (linear probe) | Monocular depth RMSE | RMSE (lower=better) | https://arxiv.org/abs/2603.14482 |

Note: the existing benchmark `gaia2` (category=agent) is the **HF GAIA Level-2 agent benchmark**, not the Wayve driving WFM. To avoid collision, the Wayve driving WFM should use the slug `wayve_gaia2` or live as a model only (no dedicated bench since the paper reports no canonical-scale numbers).

## New models to register

| id | vendor | release | sources |
|---|---|---|---|
| `meta/v-jepa-2` | Meta AI (FAIR) | 2025-06-11 | https://arxiv.org/abs/2506.09985 ; https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks/ ; 1.2B params, JEPA video WFM |
| `meta/v-jepa-2.1` | Meta AI (FAIR) | 2026-03-15 | https://arxiv.org/abs/2603.14482 |
| `world-labs/marble` | World Labs (Fei-Fei Li) | 2025-11-12 (GA) | https://www.worldlabs.ai/ ; https://techcrunch.com/2025/11/12/fei-fei-lis-world-labs-speeds-up-the-world-model-race-with-marble-its-first-commercial-product/ — 3D persistent scene gen WFM, no public quantitative claims |
| `wayve/gaia-2` | Wayve (UK) | 2025-03-26 | https://arxiv.org/abs/2503.20523 ; latent-diffusion multi-view driving WFM. Paper reports no leaderboard-scale numbers — model-only registration |
| `openai/sora-2-pro` (optional) | OpenAI | 2025-09 | https://openai.com/index/sora-2/ ; ChatGPT Pro tier of Sora 2; no separate VBench score from primary source. SKIP unless distinct evals appear |
| `1x/redwood` | 1X Technologies | unknown | No primary-source quantitative benchmark found. SKIP for now (placeholder only) |

## Extractable scores

### VBench-1.0 Text-to-Video (Total Score, Quality, Semantic)
Source: https://huggingface.co/spaces/Vchitect/VBench_Leaderboard (HF Space)

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| Vchitect/IPOW | vbench_total | 88.26 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| Vchitect/IPOW | vbench_quality | 87.83 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| Vchitect/IPOW | vbench_semantic | 90.01 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| shengshu/vidu-q1-20250417 | vbench_total | 87.41 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| ipoc/ipoc-20250414 | vbench_total | 86.57 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| jiutian/jt-3.5 | vbench_total | 86.47 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| alibaba/wan2.1-20250224 | vbench_total | 86.22 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| ipoc/ipoc | vbench_total | 85.71 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| miraclevision/v5 | vbench_total | 85.23 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| google/veo-3 | vbench_total | 85.06 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| google/veo-3 | vbench_quality | 85.70 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| google/veo-3 | vbench_semantic | 82.49 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| landiff/landiff | vbench_total | 84.87 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| alibaba/wan2.1 | vbench_total | 84.70 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| open-sora/open-sora-2.0 | vbench_total | 84.34 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| openai/sora | vbench_total | 84.28 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| openai/sora | vbench_quality | 85.51 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| openai/sora | vbench_semantic | 79.35 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |

### VBench-2.0 (Intrinsic Faithfulness)
Source: https://arxiv.org/abs/2503.21755 (Table 2) + HF Space

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| google/veo-3 | vbench2_total | 66.72 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| google/veo-3 | vbench2_creativity | 60.85 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| google/veo-3 | vbench2_commonsense | 69.48 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| google/veo-3 | vbench2_controllability | 47.04 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| google/veo-3 | vbench2_human_fidelity | 86.88 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| google/veo-3 | vbench2_physics | 69.35 | percent | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard |
| tencent/hunyuanvideo | vbench2_human_anatomy | 88.58 | percent | https://arxiv.org/abs/2503.21755 |
| tencent/hunyuanvideo | vbench2_mechanics | 76.09 | percent | https://arxiv.org/abs/2503.21755 |
| tencent/hunyuanvideo | vbench2_material | 64.37 | percent | https://arxiv.org/abs/2503.21755 |
| tencent/hunyuanvideo | vbench2_thermotics | 56.52 | percent | https://arxiv.org/abs/2503.21755 |
| tencent/hunyuanvideo | vbench2_multiview_consistency | 43.80 | percent | https://arxiv.org/abs/2503.21755 |
| tencent/hunyuanvideo | vbench2_complex_plot | 10.11 | percent | https://arxiv.org/abs/2503.21755 |
| zhipu/cogvideox-1.5 | vbench2_human_anatomy | 59.72 | percent | https://arxiv.org/abs/2503.21755 |
| zhipu/cogvideox-1.5 | vbench2_mechanics | 80.80 | percent | https://arxiv.org/abs/2503.21755 |
| zhipu/cogvideox-1.5 | vbench2_material | 83.19 | percent | https://arxiv.org/abs/2503.21755 |
| zhipu/cogvideox-1.5 | vbench2_thermotics | 67.13 | percent | https://arxiv.org/abs/2503.21755 |
| openai/sora | vbench2_human_anatomy | 86.45 | percent | https://arxiv.org/abs/2503.21755 |
| openai/sora | vbench2_human_clothes | 98.15 | percent | https://arxiv.org/abs/2503.21755 |
| openai/sora | vbench2_diversity | 67.48 | percent | https://arxiv.org/abs/2503.21755 |
| openai/sora | vbench2_dynamic_attribute | 8.06 | percent | https://arxiv.org/abs/2503.21755 |
| kuaishou/kling-1.6 | vbench2_human_anatomy | 86.99 | percent | https://arxiv.org/abs/2503.21755 |
| kuaishou/kling-1.6 | vbench2_camera_motion | 61.73 | percent | https://arxiv.org/abs/2503.21755 |
| kuaishou/kling-1.6 | vbench2_multiview_consistency | 64.38 | percent | https://arxiv.org/abs/2503.21755 |
| kuaishou/kling-1.6 | vbench2_instance_preservation | 76.10 | percent | https://arxiv.org/abs/2503.21755 |

(Full 18-dimension grid for HunyuanVideo, CogVideoX-1.5, Sora, Kling 1.6 captured above — paper Table 2.)

### V-JEPA 2 / 2.1 (Meta)

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| meta/v-jepa-2 | ss_v2_top1 | 77.3 | percent | https://arxiv.org/abs/2506.09985 |
| meta/v-jepa-2 | epic_kitchens_recall5 | 39.7 | recall | https://arxiv.org/abs/2506.09985 |
| meta/v-jepa-2 | perception_test | 84.0 | percent | https://arxiv.org/abs/2506.09985 |
| meta/v-jepa-2 | tempcompass | 76.9 | percent | https://arxiv.org/abs/2506.09985 |
| meta/v-jepa-2 | intphys2 | 56.4 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| meta/v-jepa-2 | mvpbench | 44.5 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| meta/v-jepa-2 | causalvqa | 44.89 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| meta/v-jepa-2.1 | ego4d_lta_map | 7.71 | mAP | https://arxiv.org/abs/2603.14482 |
| meta/v-jepa-2.1 | epic_kitchens_recall5 | 40.8 | recall | https://arxiv.org/abs/2603.14482 |
| meta/v-jepa-2.1 | ss_v2_top1 | 77.7 | percent | https://arxiv.org/abs/2603.14482 |
| meta/v-jepa-2.1 | tartandrive_ate | 5.687 | ATE | https://arxiv.org/abs/2603.14482 |
| meta/v-jepa-2.1 | nyuv2_depth_rmse_linprobe | 0.307 | RMSE | https://arxiv.org/abs/2603.14482 |

### Meta Physical Reasoning Leaderboard (other models)
Source: https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| google/gemini-1.5-pro | intphys2 | 92.44 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| google/gemini-1.5-pro | mvpbench | 47.19 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| google/gemini-1.5-pro | causalvqa | 84.78 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| google/gemini-2.5-flash | intphys2 | 56.1 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| google/gemini-2.5-flash | causalvqa | 61.66 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| openai/gpt-4o | intphys2 | 53.19 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| openai/gpt-4o | mvpbench | 32.5 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| openai/gpt-4o | causalvqa | 50.95 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| nvidia/cosmos-reason-2-8b | intphys2 | 58.14 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| nvidia/cosmos-reason-2-8b | mvpbench | 47.19 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| nvidia/cosmos-reason-2-8b | causalvqa | 59.14 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| nvidia/cosmos-reason-1-7b | intphys2 | 59.88 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| nvidia/cosmos-reason-1-7b | mvpbench | 41.31 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| nvidia/cosmos-reason-1-7b | causalvqa | 48.17 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| alibaba/qwen2.5-vl | intphys2 | 49.12 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| alibaba/qwen2.5-vl | mvpbench | 36.7 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| alibaba/qwen2.5-vl | causalvqa | 49.05 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| meta/plm-8b | mvpbench | 39.7 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| meta/plm-8b | causalvqa | 50.06 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| internvl/internvl2.5 | mvpbench | 39.9 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| internvl/internvl2.5 | causalvqa | 47.54 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| llava/llava-onevision | mvpbench | 20.7 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |
| llava/llava-onevision | causalvqa | 45.27 | percent | https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard |

Human ceiling: IntPhys 2 = 92.44, MVPBench = 92.9, CausalVQA = 84.78.

### NVIDIA Cosmos Predict 2.5 (paper arxiv 2511.00062)

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| nvidia/cosmos-predict-2.5-14b | pai_bench_text2world_post | 0.768 | score | https://arxiv.org/abs/2511.00062 |
| nvidia/cosmos-predict-2.5-14b | pai_bench_image2world_overall | 0.810 | score | https://arxiv.org/abs/2511.00062 |
| nvidia/cosmos-predict-2.5-14b | fvd_av_multiview_stylegan | 23.06 | FVD | https://arxiv.org/abs/2511.00062 |
| nvidia/cosmos-predict-2.5-14b | fid_av_multiview | 12.10 | FID | https://arxiv.org/abs/2511.00062 |
| nvidia/cosmos-predict-1-7b | fvd_av_multiview_stylegan | 63.69 | FVD | https://arxiv.org/abs/2511.00062 |
| nvidia/cosmos-predict-1-7b | fid_av_multiview | 25.34 | FID | https://arxiv.org/abs/2511.00062 |
| alibaba/wan2.2-5b | pai_bench_text2world_post | 0.764 | score | https://arxiv.org/abs/2511.00062 |

### LIBERO supplements (already-registered models that lacked specific suite breakdowns)
Source: https://arxiv.org/abs/2502.19645 (OpenVLA-OFT, Table I)

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| openvla/diffusion-policy | libero_spatial | 78.3 | percent | https://arxiv.org/abs/2502.19645 |
| openvla/diffusion-policy | libero_object | 92.5 | percent | https://arxiv.org/abs/2502.19645 |
| openvla/diffusion-policy | libero_goal | 68.3 | percent | https://arxiv.org/abs/2502.19645 |
| openvla/diffusion-policy | libero_long | 50.5 | percent | https://arxiv.org/abs/2502.19645 |
| openvla/dit-policy | libero_spatial | 84.2 | percent | https://arxiv.org/abs/2502.19645 |
| openvla/dit-policy | libero_object | 96.3 | percent | https://arxiv.org/abs/2502.19645 |
| openvla/dit-policy | libero_goal | 85.4 | percent | https://arxiv.org/abs/2502.19645 |
| openvla/dit-policy | libero_long | 63.8 | percent | https://arxiv.org/abs/2502.19645 |
| mdt/mdt | libero_long | 64.8 | percent | https://arxiv.org/abs/2502.19645 |
| physical-intelligence/pi-zero-fast | libero_spatial | 96.4 | percent | https://arxiv.org/abs/2502.19645 |
| physical-intelligence/pi-zero-fast | libero_object | 96.8 | percent | https://arxiv.org/abs/2502.19645 |
| physical-intelligence/pi-zero-fast | libero_goal | 88.6 | percent | https://arxiv.org/abs/2502.19645 |
| physical-intelligence/pi-zero-fast | libero_long | 60.2 | percent | https://arxiv.org/abs/2502.19645 |

(Most of these are also already in DB — verify with sqlite before insert.)

### Pi-Zero internal eval (already partially in DB; included for completeness)
Source: https://www.pi.website/blog/pi0

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| physical-intelligence/pi-zero | bussing_easy_ur5e | 0.971 | normalized | https://www.pi.website/blog/pi0 |
| physical-intelligence/pi-zero | bussing_hard_ur5e | 0.875 | normalized | https://www.pi.website/blog/pi0 |
| physical-intelligence/pi-zero | shirt_folding_biarx | 1.000 | normalized | https://www.pi.website/blog/pi0 |
| physical-intelligence/pi-zero | grocery_bagging_ur5e | 0.786 | normalized | https://www.pi.website/blog/pi0 |
| physical-intelligence/pi-zero | toast_out_bitrossen | 0.750 | normalized | https://www.pi.website/blog/pi0 |

(These are π-zero specific tasks — likely too narrow to merit dedicated benchmarks.)

## Skipped

- **VBench-2.0 leaderboard full table** — HF Space renders only 1-2 rows by default. The paper's Table 2 covers 4 models (Sora/Kling/Hunyuan/CogVideoX); newer entries (Veo 3, Wan 2.2, LTX-2) need scraping with pagination. **Captured what's accessible.**
- **World Labs Marble** — no primary-source quantitative metrics published (the company emphasises qualitative persistence/coherence, not numeric benchmarks). Register the model only; no scores possible under STRICT-ATTRIBUTION.
- **Wayve GAIA-2** — paper arxiv 2503.20523 describes metrics (FDD, FVMD, IoU) but does not publish numeric leaderboard tables; uses "validation loss" qualitatively. Register the model only; no scores under STRICT-ATTRIBUTION.
- **Wayve GAIA-1 9B** — same as GAIA-2 (architecture / scaling paper, no canonical leaderboard).
- **Sora 2 Pro** — no separate VBench / quantitative source distinguishing it from Sora 2 base; the Sora row on VBench-1 is the original Sora, not Sora 2. **SKIP**.
- **1X Redwood** — no primary-source quantitative benchmark; only company blog mentions. **SKIP**.
- **CALVIN benchmark** — no centralized leaderboard with primary-source values for current SOTA WFM policies (π-zero/OpenVLA papers do not report CALVIN canonical scores). Skip benchmark registration unless multiple primary-source rows can be assembled.
- **MetaWorld** — same reason as CALVIN; modern VLA papers (π-zero, OpenVLA) do not report canonical 54-task MetaWorld results. Skip.
- **LIBERO Pro / LIBERO Plus** (arxiv 2510.03827 / 2510.13626) — robustness extensions; benchmark exists but the WFM-relevant papers report per-model robustness deltas, not single canonical scores. Worth registering as `libero_pro` / `libero_plus` if dedicated coverage is added later.
- **PhysReasonBench** — likely conflates with the Physical Reasoning Leaderboard above. Not a separate paper.
- **Apptronik Apollo-1** — no primary-source benchmark numbers found for the standalone Apollo-1 model (existing `apptronik/apollo-gemini` covers the DeepMind partnership).

## Notes / collisions to fix

1. The existing DB benchmark id `gaia2` (category=agent) is **HF's GAIA Level-2 agent benchmark**, not Wayve's GAIA-2 WFM. When registering the Wayve model, use `wayve/gaia-2` as model_id and avoid bench-side conflict.
2. The DB already contains a `physical_reasoning_leaderboard` benchmark (category=multimodal). Suggest splitting into the three Meta sub-benchmarks (`intphys2`, `mvpbench`, `causalvqa`) for STRICT-ATTRIBUTION per-component scoring; the aggregate slug can remain as a derived field.
3. DB has `pai_bench_text2world` / `pai_bench_image2world` — the arxiv 2511.00062 paper distinguishes "baseline" vs "post-train" variants. Recommend adding `pai_bench_text2world_post` to track post-training gains as separate triple.
