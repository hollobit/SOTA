# Deepfake / AIGC Benchmarks Research — 2026-05-14

Investigator: Claude (Opus 4.7-1M)  
Scope: Identify deepfake / AI-generated-media detection benchmarks with primary-source
quantitative leaderboards suitable for inclusion in the LLM/Frontier-Model SOTA dashboard.  
STRICT-ATTRIBUTION: every (model, benchmark, score) triple cited below is sourced from the
original paper, official challenge report, or the official benchmark website/leaderboard.
Third-party blog claims are explicitly excluded.

---

## Benchmark-by-benchmark inventory

### 1. FaceForensics++ (FF++)
- arxiv: https://arxiv.org/abs/1901.08971 (ICCV 2019, Rössler et al.)
- Year: 2019
- Metric: per-manipulation classification accuracy (5-way: DF / F2F / FS / NT / Pristine);
  binary accuracy and AUC for individual manipulations
- Dataset size: 1.8M manipulated images from 1,000 videos × 4 manipulation methods
  (DeepFakes, Face2Face, FaceSwap, NeuralTextures), each at raw / c23 / c40 compression
- Primary leaderboard URL: https://kaldir.vc.in.tum.de/faceforensics_benchmark/
- Top scores (official leaderboard, overall accuracy, hidden binary test set):

| Detection model | Overall | DF | F2F | FS | NT | Pristine | Source |
|---|---|---|---|---|---|---|---|
| DirichletEnsemble-Classifier | 0.973 | 0.955 | 0.956 | 0.932 | 0.967 | 0.992 | leaderboard |
| Beijing ZKJ | 0.941 | 1.000 | 0.920 | 0.961 | 0.880 | 0.948 | leaderboard |
| ZAntiFakeBio | 0.940 | 1.000 | 0.920 | 0.971 | 0.907 | 0.936 | leaderboard |
| Leo | 0.917 | 1.000 | 0.861 | 0.971 | 0.853 | 0.922 | leaderboard |
| MixingExpert | 0.909 | 1.000 | 0.905 | 0.942 | 0.780 | 0.922 | leaderboard |
| NoSenseAtAll | 0.908 | 0.982 | 0.905 | 0.951 | 0.827 | 0.908 | leaderboard |
| RobustForensics | 0.902 | 0.991 | 0.891 | 0.951 | 0.807 | 0.904 | leaderboard |
| EfficientNet-b7 | 0.868 | 0.973 | 0.905 | 0.922 | 0.720 | 0.868 | leaderboard |

### 2. DFDC (Deepfake Detection Challenge)
- arxiv: https://arxiv.org/abs/2006.07397 (Dolhansky et al., 2020)
- Year: 2020
- Metric: Log-Loss (primary, Kaggle private leaderboard); average precision (AP) on black-box
- Dataset size: 124,000+ clips from 3,426 paid actors; multiple synthesis methods
- Primary leaderboard URL: https://www.kaggle.com/c/deepfake-detection-challenge/leaderboard
  + https://ai.meta.com/blog/deepfake-detection-challenge-results-an-open-initiative-to-advance-ai/
- Top scores (final private leaderboard, log-loss; AP on hidden black-box test):

| Rank | Team | Log-Loss | AP black-box | Source |
|---|---|---|---|---|
| 1 | Selim Seferbekov | 0.42798 | 65.18% | Meta AI blog |
| 2 | \\WM/ | 0.42842 | — | Meta AI blog |
| 3 | NtechLab | 0.43452 | — | Meta AI blog |
| 4 | Eighteen years old | 0.43476 | — | Meta AI blog |
| 5 | The Medics | 0.43711 | — | Meta AI blog |

### 3. Celeb-DF (v2)
- arxiv: https://arxiv.org/abs/1909.12962 (Li et al., CVPR 2020)
- Year: 2020 (v1: 2019; v2: 2020)
- Metric: frame-level AUC
- Dataset size: 5,639 high-quality DeepFake videos of celebrities (v2)
- Primary leaderboard URL: github.com/SCLBD/DeepfakeBench (consolidated cross-dataset eval)
- Top scores (cross-dataset, trained on FF++ c23, tested on Celeb-DF v2; frame-level AUC):

| Detection model | Celeb-DF v2 AUC | Source |
|---|---|---|
| SPSL | 0.7650 | DeepfakeBench (NeurIPS 2023) |
| UCF | 0.7527 | DeepfakeBench |
| EfficientNet-B4 | 0.7487 | DeepfakeBench |
| Xception | 0.7365 | DeepfakeBench |
| RECCE | 0.7319 | DeepfakeBench |
| CNN-Aug | 0.7027 | DeepfakeBench |
| MesoInception4 | 0.6966 | DeepfakeBench |
| Meso4 | 0.6091 | DeepfakeBench |

### 4. DeeperForensics-1.0
- arxiv: https://arxiv.org/abs/2001.03024 (Jiang et al., CVPR 2020)
- Year: 2020
- Metric: classification accuracy / AUC under real-world perturbations
- Dataset size: 60,000 videos / 17.6M frames
- Primary leaderboard URL: github.com/EndlessSora/DeeperForensics-1.0
- NOTE: per-method intra-dataset numbers in the paper are presented as accuracy-vs-distortion
  curves; the consolidated DeepfakeBench evaluation uses AUC train-FF++ → test-DF (DeeperForensics).
  Skipped from immediate registration because the official leaderboard is static (paper-only).

### 5. DF40
- arxiv: https://arxiv.org/abs/2406.13495 (Yan et al., NeurIPS 2024 D&B)
- Year: 2024
- Metric: AUC (cross-domain, per-protocol)
- Dataset size: 40 manipulation methods (10 face-swap / 13 reenactment / 12 face-synthesis / 5 editing)
- Primary leaderboard URL: github.com/YZY-stack/DF40
- Top scores (paper Protocol-1, avg AUC):

| Detection model | Avg AUC | Source |
|---|---|---|
| CLIP-Large | 0.746 (on non-face AIGC) | DF40 paper |
| SBI (blend-based) | 0.734 | DF40 paper |
| Xception (baseline) | 0.535 | DF40 paper |

### 6. DeepfakeBench (umbrella benchmark)
- arxiv: https://arxiv.org/abs/2307.01426 (Yan et al., NeurIPS 2023 D&B)
- Year: 2023
- Metric: frame-level AUC, AP, EER, ACC across 9 datasets × 15+ detectors
- Dataset size: 9 datasets (FF++, CDFv1, CDFv2, DFD, DFDC, DFDC-P, UADFV, DeeperForensics, ...)
- Primary leaderboard URL: github.com/SCLBD/DeepfakeBench
- Top scores (within-domain, train+test FF++ c23, frame AUC):

| Detector | FF++_c23 | FF++_c40 | CDFv1 | CDFv2 | DFD | DFDC | DFDC-P | UADFV |
|---|---|---|---|---|---|---|---|---|
| UCF | 0.9705 | 0.8399 | 0.7793 | 0.7527 | 0.8074 | 0.7191 | 0.7594 | 0.9528 |
| Xception | 0.9637 | 0.8261 | 0.7794 | 0.7365 | 0.8163 | 0.7077 | 0.7374 | 0.9379 |
| RECCE | 0.9621 | 0.8190 | 0.7677 | 0.7319 | 0.8119 | 0.7133 | — | — |
| SPSL | 0.9610 | 0.8174 | 0.8150 | 0.7650 | 0.8122 | 0.7040 | 0.7408 | 0.9424 |
| EfficientNet-B4 | 0.9567 | 0.8150 | 0.7909 | 0.7487 | 0.8148 | 0.6955 | 0.7283 | 0.9472 |
| CNN-Aug | 0.8493 | 0.7846 | 0.7420 | 0.7027 | 0.6464 | 0.6361 | 0.6170 | 0.8739 |
| MesoInception4 | 0.7583 | 0.7278 | 0.7366 | 0.6966 | 0.6069 | 0.6226 | 0.7561 | 0.9049 |
| Meso4 | 0.6077 | 0.5920 | 0.7358 | 0.6091 | 0.5481 | 0.5560 | 0.5994 | 0.7150 |

### 7. AV-Deepfake1M
- arxiv/paper: https://arxiv.org/abs/2311.15308 (Cai et al., ACM MM 2024, Best Paper Award)
- Year: 2024
- Metric: AP@{0.5, 0.75, 0.9, 0.95} + AR@{50, 20, 10, 5}, temporal-localization framing
- Dataset size: 1M+ videos, 2,000+ subjects, content-driven LLM-edited manipulations
- Primary leaderboard URL: github.com/ControlNet/AV-Deepfake1M
- Top scores (TestA, temporal-localization AP@0.5):

| Detection model | AP@0.5 | AP@0.75 | Source |
|---|---|---|---|
| UMMAFormer | 51.64 | 28.07 | AV-Deepfake1M README |
| BA-TFD+ | 44.42 | — | AV-Deepfake1M README |
| ActionFormer + InternVideo | 36.08 | — | AV-Deepfake1M README |
| Pindrop Labs (1M-Challenge winner, TestA) | 77.94 | — | ACM MM 2024 challenge report |

### 8. WildDeepfake
- arxiv: https://arxiv.org/abs/2101.01456 (Zi et al., ACM MM 2020)
- Year: 2020
- Metric: accuracy / AUC
- Dataset size: 7,314 face sequences from 707 in-the-wild deepfake videos
- Primary leaderboard URL: github.com/OpenTAI/wild-deepfake
- NOTE: The paper-reported absolute numbers vary by method choice; baseline Xception scores
  below 70% accuracy according to the original ACM MM 2020 paper. Useful as a "robustness"
  benchmark but the official site does not host a maintained leaderboard. Skipped as primary
  registration target but worth re-evaluation if a curated leaderboard appears.

### 9. ASVspoof 5 (2024)
- arxiv: https://arxiv.org/abs/2408.08739 (Wang et al., 2024)
- Year: 2024
- Metric: min-DCF (primary), EER, C_llr (Track 1); min-a-DCF (Track 2)
- Dataset size: crowdsourced; large adversarial / codec-degraded test sets
- Primary leaderboard URL: https://www.asvspoof.org + CodaLab competition pages
- Top scores (Track 1 — speech deepfake detection, closed condition):

| Rank | Team | min-DCF | EER | C_llr | Source |
|---|---|---|---|---|---|
| 1 | T32 | 0.2436 | 8.61% | 0.9458 | ASVspoof 5 paper |
| 2 | T47 | 0.2660 | 9.18% | 0.6091 | ASVspoof 5 paper |
| 3 | T24 | 0.2975 | 10.43% | 0.4182 | ASVspoof 5 paper |
| 4 | T45 | 0.3948 | 14.33% | 0.8515 | ASVspoof 5 paper |
| 5 | T13 | 0.4025 | 14.75% | 0.5238 | ASVspoof 5 paper |

Open condition (top systems):
| Rank | Team | min-DCF | EER |
|---|---|---|---|
| 1 | T45 | 0.0750 | 2.59% |
| 2 | T36 | 0.0936 | 3.41% |
| 3 | T27 | 0.0937 | 3.42% |

### 10. ASVspoof 2021
- arxiv: https://arxiv.org/abs/2109.00537 (Yamagishi et al., 2021)
- Year: 2021
- Metric: min-tDCF (LA/PA), EER (DF)
- Dataset size: LA / PA / DF tracks
- Primary leaderboard URL: https://www.asvspoof.org
- Top scores (LA track): best system B03 → min-tDCF = 0.3445 (from official challenge paper);
  baseline B01 → min-tDCF = 0.9434, baseline B02 → 0.9724. Per-team detailed leaderboard is in the
  official challenge summary paper.

### 11. GenImage
- arxiv: https://arxiv.org/abs/2306.08571 (Zhu et al., NeurIPS 2023 D&B)
- Year: 2023
- Metric: cross-generator classification accuracy (8 generators)
- Dataset size: ~1M paired images across 8 generators (Midjourney, SDv1.4/1.5, ADM, GLIDE, Wukong, VQDM, BigGAN)
- Primary leaderboard URL: github.com/GenImage-Dataset/GenImage
- Top scores (paper Table 3, models trained on SDv1.4, % accuracy):

| Method | Midjourney | SDv1.4 | SDv1.5 | ADM | GLIDE | Wukong | VQDM | BigGAN | Avg |
|---|---|---|---|---|---|---|---|---|---|
| Swin-T | 62.1 | 99.9 | 99.8 | 49.8 | 67.6 | 99.1 | 62.3 | 57.6 | 74.8 |
| ResNet-50 | 54.9 | 99.9 | 99.7 | 53.5 | 61.9 | 98.2 | 56.6 | 52.0 | 72.1 |
| DeiT-S | 55.6 | 99.9 | 99.8 | 49.8 | 58.1 | 98.9 | 56.9 | 53.5 | 71.6 |
| GramNet | 54.2 | 99.2 | 99.1 | 50.3 | 54.6 | 98.9 | 50.8 | 51.7 | 69.9 |
| Spec | 52.0 | 99.4 | 99.2 | 49.7 | 49.8 | 94.8 | 55.6 | 49.8 | 68.8 |
| F3-Net | 50.1 | 99.9 | 99.9 | 49.9 | 50.0 | 99.9 | 49.9 | 49.9 | 68.7 |
| CNNSpot | 52.8 | 96.3 | 95.9 | 50.1 | 39.8 | 78.6 | 53.4 | 46.8 | 64.2 |

### 12. DIRE / DiffusionForensics
- arxiv: https://arxiv.org/abs/2303.09295 (Wang et al., ICCV 2023)
- Year: 2023
- Metric: accuracy (ACC) / average precision (AP)
- Dataset size: DiffusionForensics — multi-source diffusion images (LSUN-Bedroom, ImageNet, CelebA-HQ)
- Primary leaderboard URL: github.com/ZhendongWang6/DIRE
- Top scores (paper Table 2; train ADM-LSUN-Bedroom, test cross-diffusion):

| Method | ACC | AP | Source |
|---|---|---|---|
| DIRE | 99.9% (avg) | 100.0% (avg) | DIRE ICCV 2023 |
| CNNSpot | (below DIRE) | — | DIRE paper baseline |
| F3-Net | (below DIRE) | — | DIRE paper baseline |
| GramNet | (below DIRE) | — | DIRE paper baseline |

### 13. Deepfake-Eval-2024
- arxiv: https://arxiv.org/abs/2503.02857 (Chandra et al., 2025)
- Year: 2024-2025 (release Mar 2025)
- Metric: AUC, accuracy, F1, precision, recall (each modality)
- Dataset size: 45 hours video / 56.5 hours audio / 1,975 images from 88 sites in 52 languages
- Primary leaderboard URL: huggingface.co/datasets/nuriachandra/Deepfake-Eval-2024
- Top scores (open-source SOTA models, zero-shot):

| Modality | Model | AUC | Accuracy | F1 | Source |
|---|---|---|---|---|---|
| Video | GenConViT | 0.63 | 0.60 | 0.54 | Deepfake-Eval-2024 paper |
| Video | FTCN | 0.50 | 0.51 | 0.41 | paper |
| Video | Styleflow | 0.51 | 0.52 | 0.48 | paper |
| Audio | AASIST | 0.43 | 0.42 | 0.39 | paper |
| Audio | RawNet2 | 0.53 | 0.48 | 0.49 | paper |
| Audio | P3 | 0.58 | 0.36 | 0.53 | paper |
| Image | UFD | 0.56 | 0.63 | 0.77 | paper |
| Image | DistilDIRE | 0.52 | 0.61 | 0.74 | paper |
| Image | NPR | 0.53 | 0.47 | 0.41 | paper |

Top commercial systems (anonymized per agreement) — Video AUC 0.79, Audio AUC 0.93, Image AUC 0.90.

### 14. VLM-Deepfake (Zero-shot VLM eval)
- arxiv: https://arxiv.org/abs/2506.10474 ("LLMs Are Not Yet Ready for Deepfake Image Detection")
- Year: 2025
- Metric: zero-shot classification accuracy across 3 deepfake types (faceswap, reenactment, synthetic)
- Dataset size: structured subsets across faceswap / reenactment / GAN / diffusion
- Primary leaderboard URL: arxiv paper Table 2 only (no maintained leaderboard)
- Top scores (avg zero-shot accuracy):

| VLM | Faceswap+Reenactment | Synthetic (GAN+Diffusion) | Source |
|---|---|---|---|
| GPT-4o (ChatGPT) | 0.77 | 0.67 | arxiv 2506.10474 Table 2 |
| Claude Sonnet 4 | 0.30 | 0.60 | arxiv 2506.10474 |
| Gemini 2.5 Flash | 0.10 | 0.27 | arxiv 2506.10474 |
| Grok 3 | 0.00 | 0.27 | arxiv 2506.10474 |

This is the ONLY benchmark with explicit frontier-VLM scores attributable to specific models.

---

## Skipped (no extractable primary-source leaderboard)

- **WildDeepfake** — paper provides per-method curves; no maintained model-by-model table. Skip until DeepfakeBench v2 includes it.
- **DF-Platter** — CVPR 2023 paper provides c23/c40 numbers but no public leaderboard maintained.
- **DF-TIMIT** — small/legacy dataset (2018), no maintained leaderboard.
- **WaveFake** — paper reports per-architecture EER ranges but framing is EER-distribution, not a model ranking table.
- **ADD 2023** — Track 1.2 winning system WEER=12.45%; full ranked leaderboard not in primary source (only top-3 cited).
- **AIGCDetectBenchmark / Sentry / WildFake / DeepfakeArt / Mirage** — repository-only, no primary-source ranked tables identified.
- **DeeperForensics-1.0** — paper-only static results; superseded by DeepfakeBench's cross-dataset eval (already covered).

---

## New benchmark IDs to register

| benchmark_id | display name | year | category | metric | primary source |
|---|---|---|---|---|---|
| face_forensics_pp | FaceForensics++ | 2019 | media-forensics | accuracy (5-way) | arxiv 1901.08971 + kaldir.vc.in.tum.de leaderboard |
| dfdc | Deepfake Detection Challenge | 2020 | media-forensics | log-loss + AP (black-box) | arxiv 2006.07397 + Meta AI blog |
| celeb_df_v2 | Celeb-DF v2 | 2020 | media-forensics | AUC (frame-level) | arxiv 1909.12962 |
| df40 | DF40 (40-manipulation deepfake bench) | 2024 | media-forensics | AUC | arxiv 2406.13495 (NeurIPS 2024) |
| deepfake_bench | DeepfakeBench (umbrella, 9 datasets × 15+ detectors) | 2023 | media-forensics | AUC | arxiv 2307.01426 (NeurIPS 2023) |
| av_deepfake_1m | AV-Deepfake1M | 2024 | media-forensics-av | AP@0.5 (temporal localization) | arxiv 2311.15308 (ACM MM 2024 Best Paper) |
| asvspoof_5 | ASVspoof 5 (2024) | 2024 | audio-deepfake | min-DCF + EER | arxiv 2408.08739 |
| asvspoof_2021 | ASVspoof 2021 | 2021 | audio-deepfake | min-tDCF + EER | arxiv 2109.00537 |
| gen_image | GenImage | 2023 | aigc-image-detection | accuracy (cross-generator) | arxiv 2306.08571 (NeurIPS 2023) |
| diffusion_forensics | DiffusionForensics / DIRE | 2023 | aigc-image-detection | ACC / AP | arxiv 2303.09295 (ICCV 2023) |
| deepfake_eval_2024 | Deepfake-Eval-2024 (in-the-wild) | 2024 | media-forensics-wild | AUC (per modality) | arxiv 2503.02857 |
| vlm_deepfake_zeroshot | VLM zero-shot deepfake detection | 2025 | aigc-detection-vlm | accuracy (zero-shot) | arxiv 2506.10474 |

→ **12 new benchmark IDs.**

---

## New model IDs to register (detection-specialist models)

Vendor "detection-specialist" / "academic-baseline" — these are specialized CNN/transformer detectors, not LLMs.

| model_id | display name | type | sources |
|---|---|---|---|
| sclbd/ucf | UCF | image-detector | arxiv 2307.01426 |
| sclbd/xception-df | Xception (FF++ baseline) | image-detector | arxiv 1901.08971 + 2307.01426 |
| sclbd/efficientnet-b4-df | EfficientNet-B4 (deepfake) | image-detector | arxiv 2307.01426 |
| sclbd/recce | RECCE | image-detector | arxiv 2307.01426 (RECCE: CVPR 2022) |
| sclbd/spsl | SPSL | image-detector | arxiv 2307.01426 |
| sclbd/meso4 | Meso-4 / MesoInception4 | image-detector | MesoNet (WIFS 2018) + DeepfakeBench |
| sclbd/cnn-aug | CNN-Aug | image-detector | arxiv 2307.01426 |
| sclbd/f3-net | F3-Net | image-detector | DeepfakeBench, GenImage |
| sclbd/sbi | SBI (Self-Blended Images) | image-detector | DF40, CVPR 2022 |
| dire/dire | DIRE (Diffusion Reconstruction Error) | diffusion-detector | arxiv 2303.09295 |
| genimage/swin-t | Swin-T (GenImage) | aigc-detector | arxiv 2306.08571 |
| genimage/resnet50 | ResNet-50 (GenImage) | aigc-detector | arxiv 2306.08571 |
| genimage/cnnspot | CNNSpot | aigc-detector | Wang et al. CVPR 2020 |
| genimage/gramnet | GramNet | aigc-detector | arxiv 2306.08571 |
| deepfake-eval-2024/genconvit | GenConViT | video-detector | arxiv 2503.02857 |
| deepfake-eval-2024/ftcn | FTCN | video-detector | arxiv 2503.02857 |
| deepfake-eval-2024/styleflow | Styleflow | video-detector | arxiv 2503.02857 |
| deepfake-eval-2024/aasist | AASIST | audio-detector | arxiv 2503.02857 |
| deepfake-eval-2024/rawnet2 | RawNet2 | audio-detector | arxiv 2503.02857 |
| deepfake-eval-2024/ufd | UFD | image-detector | arxiv 2503.02857 |
| deepfake-eval-2024/distildire | DistilDIRE | image-detector | arxiv 2503.02857 |
| df40/clip-large-df | CLIP-Large (DF40-eval) | aigc-detector | arxiv 2406.13495 |
| ff_pp_leaderboard/dirichlet | DirichletEnsemble-Classifier (FF++ #1) | image-detector | FF++ leaderboard |
| dfdc/seferbekov | Seferbekov DFDC winner | video-detector | Meta AI blog 2020 |
| av_deepfake_1m/ummaformer | UMMAFormer | av-deepfake-detector | AV-Deepfake1M README |
| av_deepfake_1m/ba-tfd+ | BA-TFD+ | av-deepfake-detector | AV-Deepfake1M README |
| asvspoof_5/szu-afs | SZU-AFS (ASVspoof 5 top) | audio-spoof-detector | arxiv 2408.09933 |

Plus existing models for VLM zero-shot eval (use existing IDs in DB):
- openai/gpt-4o (or GPT-5 series equivalent)
- anthropic/claude-sonnet-4
- google/gemini-2.5-flash
- xai/grok-3

→ ~26 new detection-specialist models. (Some can be deduplicated if already in DB.)

---

## New scores to register (approximate count)

- FaceForensics++ leaderboard: 8 top entries × overall = 8 scores (per-manipulation cells would add ~40 more if desired)
- DFDC: 5 entries × log-loss = 5 scores (+ AP for #1 = 1)
- DeepfakeBench cross-dataset (Celeb-DF v2 AUC): 8 detectors = 8 scores
- DeepfakeBench within-FF++ (8 detectors × 8 datasets) = ~64 scores
- DF40: 3 detectors × avg AUC = 3 scores
- AV-Deepfake1M: 4 entries × AP@0.5 = 4 scores
- ASVspoof 5 Track 1: 5 closed + 3 open = 8 scores per metric (min-DCF, EER)
- ASVspoof 2021: 1 best system + baseline = 2 scores
- GenImage: 7 detectors × 9 cells (8 generators + avg) = ~63 scores (or 7 avg scores)
- DIRE: 1 score (DIRE avg)
- Deepfake-Eval-2024: 9 open-source × 5 metrics = 45 scores + 3 commercial-aggregate = ~48
- VLM zero-shot: 4 VLMs × 2 categories = 8 scores

→ **Total: ~155 scores** if all granular; ~80 scores with one row per detector × benchmark.

---

## Total

- New benchmarks: **12**
- New detection-specialist models: **~26** (plus reuse 4 existing frontier VLMs)
- New scores (recommended top-row registration): **~80**
- New scores (full per-manipulation granularity): **~155**

---

## Source URLs (primary)

- FF++ paper: https://arxiv.org/abs/1901.08971
- FF++ official leaderboard: https://kaldir.vc.in.tum.de/faceforensics_benchmark/
- DFDC paper: https://arxiv.org/abs/2006.07397
- DFDC Meta AI results post: https://ai.meta.com/blog/deepfake-detection-challenge-results-an-open-initiative-to-advance-ai/
- Celeb-DF paper: https://arxiv.org/abs/1909.12962
- DeeperForensics paper: https://arxiv.org/abs/2001.03024
- DF40 paper: https://arxiv.org/abs/2406.13495
- DF40 repo: https://github.com/YZY-stack/DF40
- DeepfakeBench paper: https://arxiv.org/abs/2307.01426
- DeepfakeBench repo: https://github.com/SCLBD/DeepfakeBench
- AV-Deepfake1M paper: https://arxiv.org/abs/2311.15308
- AV-Deepfake1M repo: https://github.com/ControlNet/AV-Deepfake1M
- ASVspoof 5 paper: https://arxiv.org/abs/2408.08739
- ASVspoof 2021 paper: https://arxiv.org/abs/2109.00537
- GenImage paper: https://arxiv.org/abs/2306.08571
- GenImage repo: https://github.com/GenImage-Dataset/GenImage
- DIRE / DiffusionForensics paper: https://arxiv.org/abs/2303.09295
- Deepfake-Eval-2024 paper: https://arxiv.org/abs/2503.02857
- VLM-deepfake zero-shot study: https://arxiv.org/abs/2506.10474

---

## Top-3 recommended benchmarks (priority for registration)

1. **DeepfakeBench (umbrella, arxiv 2307.01426)** — single highest-yield. Covers 9 datasets ×
   15+ detectors with published AUC tables. Registering this one benchmark unlocks ~64
   scores across FF++ / Celeb-DF / DFDC / DFD / UADFV / DFDC-P internally. Single citation,
   single methodology, peer-reviewed NeurIPS 2023.
2. **Deepfake-Eval-2024 (arxiv 2503.02857)** — the only "in-the-wild 2024" benchmark with
   numerical AUC scores for both open-source and (aggregated) commercial detectors across
   video / audio / image. Reveals the catastrophic 45-50% AUC drop of academic-trained
   detectors on real-world 2024 deepfakes. Strategically the most-cited "current" benchmark.
3. **ASVspoof 5 (arxiv 2408.08739)** — audio modality is otherwise unrepresented in the DB.
   Official challenge report, full min-DCF/EER tables for closed and open conditions.

## Key SOTA detection models

- **UCF** (DeepfakeBench winner, FF++ AUC 0.971, Celeb-DF v2 0.753)
- **CLIP-Large** for AIGC (DF40 non-face AUC 0.746, far above Xception 0.535)
- **DIRE** for diffusion images (ACC 99.9% / AP 100% avg)
- **Selim Seferbekov ensemble** (DFDC winner, log-loss 0.428, black-box AP 65.18%)
- **SZU-AFS** (ASVspoof 5 top: min-DCF 0.115, EER 4.04%)

## Frontier-VLM evaluation

Only one primary source provides explicit (VLM model × deepfake-benchmark × score) triples:
arxiv 2506.10474 (2025), which evaluates **GPT-4o, Claude Sonnet 4, Gemini 2.5 Flash, Grok 3**
zero-shot on faceswap / reenactment / synthetic generation. GPT-4o leads at 0.77 / 0.67
average accuracy; the others collapse (Gemini 0.10 on faceswap, Grok 0.00). Deepfake-Eval-2024
also evaluates "22 commercial models" but anonymizes them per contract — so individual frontier
brands can't be triple-attributed there.

Net summary: **modern LLMs/VLMs are evaluated only by one primary source (arxiv 2506.10474),
and they generally underperform specialist detectors.** Specialist CNN/Transformer detectors
(UCF, EfficientNet-B4, Xception, RECCE, CLIP-Large, DIRE, AASIST, RawNet2) remain the
appropriate detection-model registrations for this domain.
