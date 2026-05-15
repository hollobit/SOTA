# The Well (PolymathicAI) — 2026-05-15

## What it is
- **Both a dataset and a benchmark**, but primarily a **training-data resource for physics-ML surrogate models** with a unified PyTorch eval harness + simple baselines.
- Authors explicitly disclaim: *"The models benchmarked in the original paper of The Well have been designed as a simple baseline. They should not be considered as state-of-the-art."*
- **Size / scope**: 15 TB across 16 (paper) / 18 (current docs) physics-simulation datasets. Individual datasets 6.9 GB – 5.1 TB. Domains: fluid dynamics, MHD (extra-galactic, supernova, neutron-star merger), biological / active matter, acoustic scattering, Rayleigh-Bénard, Gray-Scott reaction-diffusion, viscoelastic instability, planet shallow-water, turbulent radiative layers, etc.
- **arXiv paper**: https://arxiv.org/abs/2412.00568 (NeurIPS 2024 Datasets & Benchmarks track)
- **GitHub**: https://github.com/PolymathicAI/the_well
- **HF**: https://huggingface.co/polymathic-ai
- **Docs / baseline tables**: https://polymathic-ai.org/the_well/benchmarks/
- **Metric**: **VRMSE** (Variance-scaled RMSE). "Predicting the mean of target field → score = 1." Lower is better.
- **No frontier LLM (Gemini Sci, GPT-5, Claude, etc.) is evaluated on it.** This is a PDE-solver / neural-operator benchmark, not an LLM benchmark.

## Models evaluated (one-step prediction VRMSE)
Only 4 architectures, all time-boxed to 12 h on a single H100 — explicit baselines, not SOTA.

| Model | Sub-bench | Value | Unit | Source |
|---|---|---|---|---|
| FNO | acoustic_scattering (maze) | 0.5062 | VRMSE | arxiv 2412.00568 / benchmarks page |
| TFNO | acoustic_scattering (maze) | 0.5057 | VRMSE | arxiv 2412.00568 |
| U-net | acoustic_scattering (maze) | 0.0351 | VRMSE | arxiv 2412.00568 |
| CNextU-net | acoustic_scattering (maze) | 0.0153 | VRMSE | arxiv 2412.00568 |
| FNO | active_matter | 0.3691 | VRMSE | arxiv 2412.00568 |
| TFNO | active_matter | 0.3598 | VRMSE | arxiv 2412.00568 |
| U-net | active_matter | 0.2489 | VRMSE | arxiv 2412.00568 |
| CNextU-net | active_matter | 0.1034 | VRMSE | arxiv 2412.00568 |
| FNO | convective_envelope_rsg | 0.0269 | VRMSE | arxiv 2412.00568 |
| TFNO | convective_envelope_rsg | 0.0283 | VRMSE | arxiv 2412.00568 |
| U-net | convective_envelope_rsg | 0.0555 | VRMSE | arxiv 2412.00568 |
| CNextU-net | convective_envelope_rsg | 0.0799 | VRMSE | arxiv 2412.00568 |
| FNO | euler_multi_quadrants (periodic) | 0.4081 | VRMSE | arxiv 2412.00568 |
| TFNO | euler_multi_quadrants (periodic) | 0.4163 | VRMSE | arxiv 2412.00568 |
| U-net | euler_multi_quadrants (periodic) | 0.1834 | VRMSE | arxiv 2412.00568 |
| CNextU-net | euler_multi_quadrants (periodic) | 0.1531 | VRMSE | arxiv 2412.00568 |
| FNO | gray_scott_reaction_diffusion | 0.1365 | VRMSE | arxiv 2412.00568 |
| TFNO | gray_scott_reaction_diffusion | 0.3633 | VRMSE | arxiv 2412.00568 |
| U-net | gray_scott_reaction_diffusion | 0.2252 | VRMSE | arxiv 2412.00568 |
| CNextU-net | gray_scott_reaction_diffusion | 0.1761 | VRMSE | arxiv 2412.00568 |
| FNO | helmholtz_staircase | 0.00046 | VRMSE | arxiv 2412.00568 |
| TFNO | helmholtz_staircase | 0.00346 | VRMSE | arxiv 2412.00568 |
| U-net | helmholtz_staircase | 0.01931 | VRMSE | arxiv 2412.00568 |
| CNextU-net | helmholtz_staircase | 0.02758 | VRMSE | arxiv 2412.00568 |
| FNO | MHD_64 | 0.3605 | VRMSE | arxiv 2412.00568 |
| TFNO | MHD_64 | 0.3561 | VRMSE | arxiv 2412.00568 |
| U-net | MHD_64 | 0.1798 | VRMSE | arxiv 2412.00568 |
| CNextU-net | MHD_64 | 0.1633 | VRMSE | arxiv 2412.00568 |
| FNO | planetswe | 0.1727 | VRMSE | arxiv 2412.00568 |
| TFNO | planetswe | 0.0853 | VRMSE | arxiv 2412.00568 |
| U-net | planetswe | 0.3620 | VRMSE | arxiv 2412.00568 |
| CNextU-net | planetswe | 0.3724 | VRMSE | arxiv 2412.00568 |
| FNO | post_neutron_star_merger | 0.3866 | VRMSE | arxiv 2412.00568 |
| TFNO | post_neutron_star_merger | 0.3793 | VRMSE | arxiv 2412.00568 |
| FNO | rayleigh_benard | 0.8395 | VRMSE | arxiv 2412.00568 |
| TFNO | rayleigh_benard | 0.6566 | VRMSE | arxiv 2412.00568 |
| U-net | rayleigh_benard | 1.4860 | VRMSE | arxiv 2412.00568 |
| CNextU-net | rayleigh_benard | 0.6699 | VRMSE | arxiv 2412.00568 |
| FNO | shear_flow | 1.189 | VRMSE | arxiv 2412.00568 |
| TFNO | shear_flow | 1.472 | VRMSE | arxiv 2412.00568 |
| U-net | shear_flow | 3.447 | VRMSE | arxiv 2412.00568 |
| CNextU-net | shear_flow | 0.8080 | VRMSE | arxiv 2412.00568 |
| FNO | supernova_explosion_64 | 0.3783 | VRMSE | arxiv 2412.00568 |
| TFNO | supernova_explosion_64 | 0.3785 | VRMSE | arxiv 2412.00568 |
| U-net | supernova_explosion_64 | 0.3063 | VRMSE | arxiv 2412.00568 |
| CNextU-net | supernova_explosion_64 | 0.3181 | VRMSE | arxiv 2412.00568 |
| FNO | turbulence_gravity_cooling | 0.2429 | VRMSE | arxiv 2412.00568 |
| TFNO | turbulence_gravity_cooling | 0.2673 | VRMSE | arxiv 2412.00568 |
| U-net | turbulence_gravity_cooling | 0.6753 | VRMSE | arxiv 2412.00568 |
| CNextU-net | turbulence_gravity_cooling | 0.2096 | VRMSE | arxiv 2412.00568 |
| FNO | turbulent_radiative_layer_2D | 0.5001 | VRMSE | arxiv 2412.00568 |
| TFNO | turbulent_radiative_layer_2D | 0.5016 | VRMSE | arxiv 2412.00568 |
| U-net | turbulent_radiative_layer_2D | 0.2418 | VRMSE | arxiv 2412.00568 |
| CNextU-net | turbulent_radiative_layer_2D | 0.1956 | VRMSE | arxiv 2412.00568 |
| FNO | turbulent_radiative_layer_3D | 0.5278 | VRMSE | arxiv 2412.00568 |
| TFNO | turbulent_radiative_layer_3D | 0.5187 | VRMSE | arxiv 2412.00568 |
| U-net | turbulent_radiative_layer_3D | 0.3728 | VRMSE | arxiv 2412.00568 |
| CNextU-net | turbulent_radiative_layer_3D | 0.3667 | VRMSE | arxiv 2412.00568 |
| FNO | viscoelastic_instability | 0.7212 | VRMSE | arxiv 2412.00568 |
| TFNO | viscoelastic_instability | 0.7102 | VRMSE | arxiv 2412.00568 |
| U-net | viscoelastic_instability | 0.4185 | VRMSE | arxiv 2412.00568 |
| CNextU-net | viscoelastic_instability | 0.2499 | VRMSE | arxiv 2412.00568 |

Skipped: `rayleigh_taylor_instability (At=0.25)` — all 4 models diverged (VRMSE >>10); `post_neutron_star_merger` U-net / CNextU-net not reported.

## New benchmark IDs to register (if any)
- `the_well_vrmse` (composite) — possible, but probably too granular (17 sub-benches × 4 models).
- Alternative: register each sub-bench as its own benchmark (`the_well_active_matter_vrmse`, `the_well_mhd64_vrmse`, …). Heavy and only 4 stale models per bench.

## New model IDs to register (if any)
- **FNO** (Fourier Neural Operator, Li et al. 2021) — likely already meaningful in `ai4s`.
- **TFNO** (Tucker-Factorized FNO).
- **U-net** (generic baseline, 2015).
- **CNextU-net** (ConvNeXt-based U-net, Polymathic's modernized baseline).

All four are physics-surrogate baselines, **not frontier general-purpose models**. None of FRONTIER_MODELS-style LLMs are evaluated.

## Skipped / not extractable
- `rayleigh_taylor_instability` row (all diverged).
- `post_neutron_star_merger` U-net / CNextU-net entries (marked `—`).
- No MPP (Multiple Physics Pretraining) or Stable-Sci scores in the paper's baseline table — those exist as separate Polymathic releases but are NOT benchmarked inside The Well's official results page.
- No frontier LLM (Gemini Sci, GPT-5, Claude, Grok) — N/A for this benchmark family.

## Recommended action
**Skip from the main SOTA / Frontier dashboard.** The Well is a physics-surrogate **training dataset** with explicit "do not treat as SOTA" baselines; it does not measure frontier-LLM capability and shares zero models with our `FRONTIER_MODELS` pool.

If we want to expand `ai4s` later:
1. Register **The Well (VRMSE)** as a single composite benchmark under `ai4s`, with sub-benches stored as metadata only (not 17 separate IDs).
2. Add **CNextU-net**, **FNO**, **TFNO**, **U-net** as `ai4s`-only models.
3. Store the arxiv 2412.00568 PDF under `resource/` per the system-card-PDF rule (it is a benchmark-dataset paper).
4. Treat MPP / Stable-Sci as separate **Polymathic foundation models** with their own (currently no-leaderboard) page; do not invent scores for them on The Well.

Action priority: **LOW** — physics-surrogate niche, no LLM overlap, baselines self-described as not-SOTA.
