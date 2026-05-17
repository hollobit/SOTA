# arxiv 2605.15178 — SANA-WM

## Paper summary
- **Title**: SANA-WM: Efficient Minute-Scale World Modeling with Hybrid Linear Diffusion Transformer
- **Authors**: Haoyi Zhu, Haozhe Liu, Yuyang Zhao, Tian Ye, Junsong Chen, Jincheng Yu, Tong He, Song Han, Enze Xie (NVIDIA)
- **Date**: 2026-05-14 (v1)
- **arxiv**: 2605.15178
- **New benchmark**: YES — paper introduces a **one-minute world-model benchmark** (80 first-frame conditioning images at 1280x720, balanced across 4 scene categories: game, indoor, outdoor-city, outdoor-nature; two trajectory splits — Simple + Hard, each with 10 templates yielding 80 scenes per split). Built on top of VBench + Pi3X-based pose accuracy.
- **Headline claims (Table 2-validated)**:
  - SANA-WM (2.6B, 720p) achieves **VBench Overall 79.29 Simple / 79.60 Hard**, beating Matrix-Game 3.0 (5B 720p) and HY-WorldPlay (8B 480p).
  - With refiner (2.6B + 17B), **VBench Overall 80.62 Simple / 81.89 Hard**, matching LingBot-World (14B+14B, 480p; 81.82/81.89).
  - Best camera-control accuracy on Hard: RotErr 8.34deg, TransErr 1.39, CamMC 1.44 (refined).
  - 24.1 videos/hour throughput (Stage-1) and 22.0 vid/hr (with refiner) vs LingBot-World 0.6 vid/hr — **~36x faster**.

## Score extractions

### Table 2 — Quantitative comparison on 1-min benchmark (Simple-Trajectory split, page 8)

Pose Acc. is lower-is-better (R in degrees / T / CMC); VBench dimensions higher-is-better (SC subject consistency, BC background consistency, TF temporal flickering, MS motion smoothness, AQ aesthetic quality, IQ imaging quality, DD dynamic degree, OC overall consistency, Overall aggregated).

| Model | Benchmark | Value | Unit | Source |
|---|---|---|---|---|
| Infinite-World (1.3B 480p) | sana-wm-1min-simple/PoseAcc-R | 16.55 | degrees (lower better) | p8 T2 |
| Infinite-World | sana-wm-1min-simple/PoseAcc-T | 1.98 | (lower better) | p8 T2 |
| Infinite-World | sana-wm-1min-simple/PoseAcc-CMC | 2.08 | (lower better) | p8 T2 |
| Infinite-World | sana-wm-1min-simple/VBench-SC | 79.48 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-simple/VBench-BC | 87.79 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-simple/VBench-TF | 97.35 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-simple/VBench-MS | 98.78 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-simple/VBench-AQ | 51.99 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-simple/VBench-IQ | 69.34 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-simple/VBench-DD | 88.75 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-simple/VBench-OC | 12.28 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-simple/VBench-Overall | 79.18 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-simple/Mem | 53.5 | GB peak | p8 T2 |
| Infinite-World | sana-wm-1min-simple/Tput | 5.9 | videos/hour | p8 T2 |
| LingBot-World (14B+14B 480p) | sana-wm-1min-simple/PoseAcc-R | 10.47 | degrees | p8 T2 |
| LingBot-World | sana-wm-1min-simple/PoseAcc-T | 2.01 | | p8 T2 |
| LingBot-World | sana-wm-1min-simple/PoseAcc-CMC | 2.05 | | p8 T2 |
| LingBot-World | sana-wm-1min-simple/VBench-SC | 93.77 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-simple/VBench-BC | 95.46 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-simple/VBench-TF | 97.13 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-simple/VBench-MS | 98.34 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-simple/VBench-AQ | 53.18 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-simple/VBench-IQ | 73.41 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-simple/VBench-DD | 41.25 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-simple/VBench-OC | 11.78 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-simple/VBench-Overall | 81.82 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-simple/Mem | 454.1 | GB peak | p8 T2 |
| LingBot-World | sana-wm-1min-simple/Tput | 0.6 | videos/hour | p8 T2 |
| HY-WorldPlay (8B 480p) | sana-wm-1min-simple/PoseAcc-R | 17.89 | degrees | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/PoseAcc-T | 2.36 | | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/PoseAcc-CMC | 2.45 | | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/VBench-SC | 65.95 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/VBench-BC | 81.97 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/VBench-TF | 94.63 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/VBench-MS | 96.01 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/VBench-AQ | 40.28 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/VBench-IQ | 53.05 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/VBench-DD | 91.25 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/VBench-OC | 13.83 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/VBench-Overall | 68.82 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/Mem | 215.5 | GB peak | p8 T2 |
| HY-WorldPlay | sana-wm-1min-simple/Tput | 1.1 | videos/hour | p8 T2 |
| Matrix-Game 3.0 (5B 720p) | sana-wm-1min-simple/PoseAcc-R | 12.96 | degrees | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/PoseAcc-T | 1.83 | | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/PoseAcc-CMC | 1.92 | | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/VBench-SC | 81.62 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/VBench-BC | 90.04 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/VBench-TF | 94.37 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/VBench-MS | 97.64 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/VBench-AQ | 52.24 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/VBench-IQ | 66.94 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/VBench-DD | 97.50 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/VBench-OC | 13.29 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/VBench-Overall | 78.53 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/Mem | 106.2 | GB peak | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-simple/Tput | 3.1 | videos/hour | p8 T2 |
| SANA-WM (2.6B 720p) | sana-wm-1min-simple/PoseAcc-R | 7.59 | degrees | p8 T2 |
| SANA-WM | sana-wm-1min-simple/PoseAcc-T | 1.59 | | p8 T2 |
| SANA-WM | sana-wm-1min-simple/PoseAcc-CMC | 1.63 | | p8 T2 |
| SANA-WM | sana-wm-1min-simple/VBench-SC | 87.46 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-simple/VBench-BC | 91.87 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-simple/VBench-TF | 94.99 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-simple/VBench-MS | 97.69 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-simple/VBench-AQ | 55.70 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-simple/VBench-IQ | 69.69 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-simple/VBench-DD | 72.50 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-simple/VBench-OC | 11.54 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-simple/VBench-Overall | 79.29 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-simple/Mem | 51.1 | GB peak | p8 T2 |
| SANA-WM | sana-wm-1min-simple/Tput | 24.1 | videos/hour | p8 T2 |
| SANA-WM + refiner (2.6B+17B 720p) | sana-wm-1min-simple/PoseAcc-R | 4.50 | degrees | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/PoseAcc-T | 1.39 | | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/PoseAcc-CMC | 1.41 | | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/VBench-SC | 88.62 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/VBench-BC | 93.21 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/VBench-TF | 96.18 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/VBench-MS | 98.61 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/VBench-AQ | 58.05 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/VBench-IQ | 72.12 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/VBench-DD | 61.25 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/VBench-OC | 11.12 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/VBench-Overall | 80.62 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/Mem | 74.7 | GB peak | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-simple/Tput | 22.0 | videos/hour | p8 T2 |

### Table 2 — Hard-Trajectory Split (page 8)

| Model | Benchmark | Value | Unit | Source |
|---|---|---|---|---|
| Infinite-World | sana-wm-1min-hard/PoseAcc-R | 41.31 | degrees | p8 T2 |
| Infinite-World | sana-wm-1min-hard/PoseAcc-T | 2.49 | | p8 T2 |
| Infinite-World | sana-wm-1min-hard/PoseAcc-CMC | 2.84 | | p8 T2 |
| Infinite-World | sana-wm-1min-hard/VBench-SC | 78.61 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-hard/VBench-BC | 86.98 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-hard/VBench-TF | 96.46 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-hard/VBench-MS | 98.68 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-hard/VBench-AQ | 52.12 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-hard/VBench-IQ | 71.22 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-hard/VBench-DD | 89.75 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-hard/VBench-OC | 12.36 | 0-100 | p8 T2 |
| Infinite-World | sana-wm-1min-hard/VBench-Overall | 79.51 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-hard/PoseAcc-R | 18.99 | degrees | p8 T2 |
| LingBot-World | sana-wm-1min-hard/PoseAcc-T | 1.65 | | p8 T2 |
| LingBot-World | sana-wm-1min-hard/PoseAcc-CMC | 1.81 | | p8 T2 |
| LingBot-World | sana-wm-1min-hard/VBench-SC | 91.79 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-hard/VBench-BC | 94.41 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-hard/VBench-TF | 96.10 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-hard/VBench-MS | 97.82 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-hard/VBench-AQ | 62.79 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-hard/VBench-IQ | 72.60 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-hard/VBench-DD | 62.50 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-hard/VBench-OC | 11.78 | 0-100 | p8 T2 |
| LingBot-World | sana-wm-1min-hard/VBench-Overall | 81.89 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/PoseAcc-R | 35.46 | degrees | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/PoseAcc-T | 2.34 | | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/PoseAcc-CMC | 2.64 | | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/VBench-SC | 68.33 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/VBench-BC | 83.06 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/VBench-TF | 95.31 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/VBench-MS | 96.71 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/VBench-AQ | 41.76 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/VBench-IQ | 53.71 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/VBench-DD | 91.25 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/VBench-OC | 13.94 | 0-100 | p8 T2 |
| HY-WorldPlay | sana-wm-1min-hard/VBench-Overall | 70.46 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/PoseAcc-R | 18.79 | degrees | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/PoseAcc-T | 1.67 | | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/PoseAcc-CMC | 1.82 | | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/VBench-SC | 82.10 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/VBench-BC | 89.99 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/VBench-TF | 93.94 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/VBench-MS | 97.60 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/VBench-AQ | 52.92 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/VBench-IQ | 68.03 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/VBench-DD | 97.50 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/VBench-OC | 13.65 | 0-100 | p8 T2 |
| Matrix-Game 3.0 | sana-wm-1min-hard/VBench-Overall | 78.79 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-hard/PoseAcc-R | 10.02 | degrees | p8 T2 |
| SANA-WM | sana-wm-1min-hard/PoseAcc-T | 1.66 | | p8 T2 |
| SANA-WM | sana-wm-1min-hard/PoseAcc-CMC | 1.72 | | p8 T2 |
| SANA-WM | sana-wm-1min-hard/VBench-SC | 85.93 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-hard/VBench-BC | 90.89 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-hard/VBench-TF | 94.36 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-hard/VBench-MS | 97.49 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-hard/VBench-AQ | 53.82 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-hard/VBench-IQ | 69.12 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-hard/VBench-DD | 92.50 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-hard/VBench-OC | 12.10 | 0-100 | p8 T2 |
| SANA-WM | sana-wm-1min-hard/VBench-Overall | 79.60 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/PoseAcc-R | 8.34 | degrees | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/PoseAcc-T | 1.39 | | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/PoseAcc-CMC | 1.44 | | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/VBench-SC | 87.26 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/VBench-BC | 92.55 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/VBench-TF | 95.54 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/VBench-MS | 98.49 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/VBench-AQ | 56.67 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/VBench-IQ | 71.38 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/VBench-DD | 91.25 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/VBench-OC | 11.34 | 0-100 | p8 T2 |
| SANA-WM + refiner | sana-wm-1min-hard/VBench-Overall | 81.89 | 0-100 | p8 T2 |

### Table 8 — Revisit memory and temporal stability (page 17)

| Model | Benchmark | Value | Unit | Source |
|---|---|---|---|---|
| Infinite-World | sana-wm-1min-simple/PSNR | 12.60 | dB | p17 T8 |
| Infinite-World | sana-wm-1min-simple/SSIM | 0.284 | 0-1 | p17 T8 |
| Infinite-World | sana-wm-1min-simple/LPIPS | 0.595 | 0-1 lower better | p17 T8 |
| Infinite-World | sana-wm-1min-simple/IQ-first | 73.93 | 0-100 | p17 T8 |
| Infinite-World | sana-wm-1min-simple/IQ-last | 67.22 | 0-100 | p17 T8 |
| Infinite-World | sana-wm-1min-simple/dIQ | 6.72 | delta (lower better) | p17 T8 |
| LingBot-World | sana-wm-1min-simple/PSNR | 14.59 | dB | p17 T8 |
| LingBot-World | sana-wm-1min-simple/SSIM | 0.366 | 0-1 | p17 T8 |
| LingBot-World | sana-wm-1min-simple/LPIPS | 0.394 | 0-1 lower better | p17 T8 |
| LingBot-World | sana-wm-1min-simple/IQ-first | 73.46 | 0-100 | p17 T8 |
| LingBot-World | sana-wm-1min-simple/IQ-last | 73.42 | 0-100 | p17 T8 |
| LingBot-World | sana-wm-1min-simple/dIQ | 0.04 | delta | p17 T8 |
| HY-WorldPlay | sana-wm-1min-simple/PSNR | 12.83 | dB | p17 T8 |
| HY-WorldPlay | sana-wm-1min-simple/SSIM | 0.321 | 0-1 | p17 T8 |
| HY-WorldPlay | sana-wm-1min-simple/LPIPS | 0.616 | 0-1 lower better | p17 T8 |
| HY-WorldPlay | sana-wm-1min-simple/IQ-first | 70.08 | 0-100 | p17 T8 |
| HY-WorldPlay | sana-wm-1min-simple/IQ-last | 46.50 | 0-100 | p17 T8 |
| HY-WorldPlay | sana-wm-1min-simple/dIQ | 23.59 | delta | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-simple/PSNR | 12.29 | dB | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-simple/SSIM | 0.326 | 0-1 | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-simple/LPIPS | 0.553 | 0-1 lower better | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-simple/IQ-first | 69.07 | 0-100 | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-simple/IQ-last | 66.66 | 0-100 | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-simple/dIQ | 2.41 | delta | p17 T8 |
| SANA-WM | sana-wm-1min-simple/PSNR | 14.16 | dB | p17 T8 |
| SANA-WM | sana-wm-1min-simple/SSIM | 0.333 | 0-1 | p17 T8 |
| SANA-WM | sana-wm-1min-simple/LPIPS | 0.458 | 0-1 lower better | p17 T8 |
| SANA-WM | sana-wm-1min-simple/IQ-first | 72.63 | 0-100 | p17 T8 |
| SANA-WM | sana-wm-1min-simple/IQ-last | 68.84 | 0-100 | p17 T8 |
| SANA-WM | sana-wm-1min-simple/dIQ | 3.79 | delta | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-simple/PSNR | 14.46 | dB | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-simple/SSIM | 0.292 | 0-1 | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-simple/LPIPS | 0.475 | 0-1 lower better | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-simple/IQ-first | 73.37 | 0-100 | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-simple/IQ-last | 72.21 | 0-100 | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-simple/dIQ | 1.17 | delta | p17 T8 |
| Infinite-World | sana-wm-1min-hard/PSNR | 12.04 | dB | p17 T8 |
| Infinite-World | sana-wm-1min-hard/SSIM | 0.248 | 0-1 | p17 T8 |
| Infinite-World | sana-wm-1min-hard/LPIPS | 0.617 | 0-1 | p17 T8 |
| Infinite-World | sana-wm-1min-hard/IQ-first | 73.79 | 0-100 | p17 T8 |
| Infinite-World | sana-wm-1min-hard/IQ-last | 69.63 | 0-100 | p17 T8 |
| Infinite-World | sana-wm-1min-hard/dIQ | 4.16 | delta | p17 T8 |
| LingBot-World | sana-wm-1min-hard/PSNR | 14.08 | dB | p17 T8 |
| LingBot-World | sana-wm-1min-hard/SSIM | 0.332 | 0-1 | p17 T8 |
| LingBot-World | sana-wm-1min-hard/LPIPS | 0.436 | 0-1 | p17 T8 |
| LingBot-World | sana-wm-1min-hard/IQ-first | 73.66 | 0-100 | p17 T8 |
| LingBot-World | sana-wm-1min-hard/IQ-last | 73.09 | 0-100 | p17 T8 |
| LingBot-World | sana-wm-1min-hard/dIQ | 0.58 | delta | p17 T8 |
| HY-WorldPlay | sana-wm-1min-hard/PSNR | 13.72 | dB | p17 T8 |
| HY-WorldPlay | sana-wm-1min-hard/SSIM | 0.328 | 0-1 | p17 T8 |
| HY-WorldPlay | sana-wm-1min-hard/LPIPS | 0.654 | 0-1 | p17 T8 |
| HY-WorldPlay | sana-wm-1min-hard/IQ-first | 70.21 | 0-100 | p17 T8 |
| HY-WorldPlay | sana-wm-1min-hard/IQ-last | 44.33 | 0-100 | p17 T8 |
| HY-WorldPlay | sana-wm-1min-hard/dIQ | 25.88 | delta | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-hard/PSNR | 12.17 | dB | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-hard/SSIM | 0.317 | 0-1 | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-hard/LPIPS | 0.556 | 0-1 | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-hard/IQ-first | 69.24 | 0-100 | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-hard/IQ-last | 68.92 | 0-100 | p17 T8 |
| Matrix-Game 3.0 | sana-wm-1min-hard/dIQ | 0.32 | delta | p17 T8 |
| SANA-WM | sana-wm-1min-hard/PSNR | 14.10 | dB | p17 T8 |
| SANA-WM | sana-wm-1min-hard/SSIM | 0.327 | 0-1 | p17 T8 |
| SANA-WM | sana-wm-1min-hard/LPIPS | 0.469 | 0-1 | p17 T8 |
| SANA-WM | sana-wm-1min-hard/IQ-first | 72.58 | 0-100 | p17 T8 |
| SANA-WM | sana-wm-1min-hard/IQ-last | 69.49 | 0-100 | p17 T8 |
| SANA-WM | sana-wm-1min-hard/dIQ | 3.09 | delta | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-hard/PSNR | 14.80 | dB | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-hard/SSIM | 0.312 | 0-1 | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-hard/LPIPS | 0.458 | 0-1 | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-hard/IQ-first | 73.34 | 0-100 | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-hard/IQ-last | 73.03 | 0-100 | p17 T8 |
| SANA-WM + refiner | sana-wm-1min-hard/dIQ | 0.31 | delta | p17 T8 |

## Skipped — qualitative/aggregate-only

- **Table 3 (progressive training ablation)** — uses VBench-I2V on 5s clips, reports Sana-Video / +LTX2 VAE / +Hybrid attn as internal model variants (not standalone published models). Internal architectural ablation, not cross-model comparison.
- **Table 4 (camera-conditioning ablation)** — reports SANA-WM with No-control / Plucker-only / PRoPE / UCPE-only / UCPE+Plucker variants on OmniWorld FVD. Internal ablation; only SANA-WM family.
- **Table 5 (refiner ablation)** — Original LTX-2.3 refiner vs Ours (long-video) refiner on 60s benchmark. Same SANA-WM Stage-1 latents but with different refiners; ablation only.
- **Table 9 (Bidirectional vs AR mode)** — Internal ablation of SANA-WM Bidirectional vs AR generator (same backbone).
- **Table 10 (VBench-I2V per-dim)** — Sana-Video / +LTX2 VAE / +Hybrid attn internal variants only.
- **Figure 7 (60s efficiency ablation)** — Visual stage-latency breakdown (VAE 4.4s, DiT 21.7 min, etc.) for SANA-WM internal variants only.
- **Throughput claim "36x"** — derived from ratios in Table 2, not a separate score.

## New benchmark IDs to register

| Slug | Description | Primary metric | Source |
|---|---|---|---|
| `sana-wm-1min-simple` | SANA-WM one-minute world-model benchmark, Simple-Trajectory split (smooth navigation: arcs, S-curves, backtracking, figure-eights) — 80 scenes x 60s | VBench-Overall (higher better) + PoseAcc-R (lower better) | arxiv 2605.15178 §5.3 & App D |
| `sana-wm-1min-hard` | SANA-WM one-minute world-model benchmark, Hard-Trajectory split (yaw changes, vertical motion, extreme pitch, whip-pans, loops, crane-like) — 80 scenes x 60s | VBench-Overall + PoseAcc-R | arxiv 2605.15178 §5.3 & App D |

Sub-metrics under each: `PoseAcc-R`, `PoseAcc-T`, `PoseAcc-CMC`, `VBench-SC`, `VBench-BC`, `VBench-TF`, `VBench-MS`, `VBench-AQ`, `VBench-IQ`, `VBench-DD`, `VBench-OC`, `VBench-Overall`, `PSNR`, `SSIM`, `LPIPS`, `IQ-first`, `IQ-last`, `dIQ`, `Mem`, `Tput`.

## New model IDs to register

| Model name in paper | Suggested model_id | Org | Notes |
|---|---|---|---|
| SANA-WM | `nvidia/sana-wm` | NVIDIA | 2.6B, 720p; open-source, May 2026 |
| SANA-WM + refiner | `nvidia/sana-wm-refiner` | NVIDIA | 2.6B + 17B refiner variant |
| LingBot-World | `lingbot/lingbot-world` | (origin TBD — possibly Chinese industrial lab; cited as ref [7]) | 14B+14B, 480p, large industrial baseline |
| HY-WorldPlay | `tencent/hy-worldplay` | Tencent Hunyuan | 8B 480p; reference [6] |
| Matrix-Game 3.0 | `skywork/matrix-game-3.0` | Skywork AI (Matrix-Game lineage) | 5B 720p; reference [9] |
| Infinite-World | `infinite-world` | (TBD; reference [8]) | 1.3B 480p; small baseline |

## Total
- New benchmarks: **2** (`sana-wm-1min-simple`, `sana-wm-1min-hard`)
- New scores: **150** triples (Table 2 Simple 14 dims x 6 models = 84; Table 2 Hard 14 dims x 6 models = 84 — but Hard Mem/Tput numbers reuse Simple efficiency entries; treating Hard Mem/Tput as redundant repeats yields 78 unique Hard + 84 Simple = 162. Conservative Table-2-only unique-rows: Simple 84 + Hard 72 useful (skipping repeated Mem/Tput identical to Simple) = 156. Plus Table 8: 6 models x 6 metrics x 2 splits = 72. **Total ~228 triples**; if dedup Mem/Tput, ~216.)
- New models: **6** (Infinite-World, LingBot-World, HY-WorldPlay, Matrix-Game 3.0, SANA-WM, SANA-WM+refiner)
