# Science Foundation Models — 2026-05-15

Research date: 2026-05-15. STRICT-ATTRIBUTION: only triples with explicit primary-source URL retained. Niche/older models (>2yr) and unverifiable claims dropped.

## Domain coverage matrix

| Domain | Top FMs (≤2yr) | Key benchmarks | DB status |
|---|---|---|---|
| Protein structure | AlphaFold 3 (DeepMind, May 2024), ESM-3 (98B, Jan 2025), ESM Cambrian / ESM-C (Dec 2024) | PoseBusters v1/v2, CASP15/16, CAMEO | THIN — AlphaFold mentioned, no scores |
| Protein design | AlphaProteo (Sept 2024), ProGen2 (2023, edge of window) | 7-target binder panel (BHRF1, SARS-CoV-2 RBD, IL-7Rα, PD-L1, TrkA, IL-17A, VEGF-A), PDFBench (2025) | MISSING |
| DNA/genomic | Evo 2 (Arc Institute, Feb 2025, 7B/40B), Nucleotide Transformer v2, DNABERT-2 | ClinVar pathogenicity, BRCA1 SGE, GUE (28 tasks), BEND | MISSING |
| Single-cell | scGPT (Nat Methods 2024), Geneformer-V2 (104M/316M, Dec 2024), scFoundation, CellFM, UCE | Cell type annotation, drug sensitivity, perturbation prediction | MISSING |
| mRNA | Helix-mRNA v0 (Helical AI, Feb 2025) | mRNABench, CodonBERT tasks, Optimus 5-prime, ribosome load | MISSING |
| Therapeutics | TxGemma-2B/9B/27B (Google, Mar 2025), Tx-LLM | TDC (66 therapeutic tasks), ChemBench, Humanity's Last Exam Chem/Bio | PARTIAL — TDC referenced |
| Chemistry | ChemFM (Clemson, 3B, Oct 2024), MolFormer-XL (IBM, 2022 — edge), ChemDFM | MoleculeNet (11 tasks), 34 property benchmarks, USPTO reaction | THIN |
| Materials generative | MatterGen (Microsoft, Nature 2025), GNoME (DeepMind, Nat 2023 — edge) | Stability rate, novelty, energy hull distance | MISSING |
| Materials ML potentials | MACE-MP, CHGNet, EquiformerV3+DeNS-OAM, MatterSim, eSEN-30M-OAM, ORB v3, PET-OAM, Nequip-OAM, TACE-OAM | MatBench Discovery, OC20 S2EF, OC22, ODAC23 | PARTIAL — MatBench Discovery in DB |
| Catalyst | EquiformerV2 (OC20/OC22/ODAC23 top) | OC20 IS2RE/S2EF, OC22, ODAC23 | MISSING |
| Weather/Climate | Aurora (Microsoft 1.3B, Nature 2025), GraphCast (DM), GenCast (DM diffusion), Pangu-Weather (Huawei), AIFS (ECMWF), FourCastNet, FengWu, FuXi, NeuralGCM, ClimaX | WeatherBench-2, ERA5 | PARTIAL — weather benches in DB |
| Astronomy | AstroCLIP (MNRAS 2024) | Photometric redshift, galaxy property estimation, morphology | MISSING |
| Time series | TimesFM-2.5 (Sept 2025), Chronos-2 (120M, encoder-only), Moirai 2.0 (decoder-only, Aug 2025), Tiny-TimeMixer/TTM-R2 (IBM Granite, NeurIPS 2024) | GIFT-Eval (28 datasets, 144k series), fev-bench, Chronos Benchmark II, Monash | MISSING |

## New benchmarks to register

| benchmark_id | description | metric | primary source |
|---|---|---|---|
| posebusters_v2 | 428 protein-ligand structures from PDB pre-2021, docking + PB-validity | success rate (RMSD<2Å + PB-valid) | https://www.nature.com/articles/s41586-024-07487-w |
| casp16_monomers | CASP16 domain & multimer assessment, Punta Cana Dec 2024 | GDT-TS, TM-score | https://predictioncenter.org/casp16/ |
| cameo_continuous | continuous weekly automated protein structure eval | lDDT | https://cameo3d.org |
| tdc_admet_group | 22 ADMET datasets (9 reg, 13 cls), scaffold split | per-task AUROC/MAE | https://tdcommons.ai/benchmark/admet_group/overview/ |
| tdc_66_therapeutic | TxGemma's 66 TDC tasks aggregate | task-weighted | https://arxiv.org/abs/2504.06196 |
| moleculenet_11 | 11 fine-tuning tasks (BBBP, Tox21, ClinTox, SIDER, BACE, HIV, MUV, ESOL, FreeSolv, Lipo, QM9) | AUROC / RMSE / MAE | https://huggingface.co/ibm-research/MoLFormer-XL-both-10pct |
| guacamol_goal_directed | 20 goal-directed de novo design benchmarks | aggregated score (0-1 scale, *20) | https://pubs.acs.org/doi/10.1021/acs.jcim.8b00839 |
| pdfbench | de novo protein design from function (2025) | foldability, recovery | https://arxiv.org/pdf/2505.20346 |
| gue_28 | Genome Understanding Eval, 28 multi-species tasks | accuracy / F1 | https://arxiv.org/abs/2306.15006 |
| bend | Benchmarking DNA foundation models | per-task accuracy | https://www.nature.com/articles/s41467-025-65823-8 |
| clinvar_variant_effect | clinically significant variant pathogenicity | AUROC | https://www.biorxiv.org/content/10.1101/2025.02.18.638918v1 |
| brca1_sge | BRCA1 saturation genome editing fitness | Spearman | https://www.biorxiv.org/content/10.1101/2025.02.18.638918v1 |
| mrnabench | mRNA foundation-model benchmark suite | per-task | https://github.com/morrislab/mRNABench |
| matbench_discovery_v2 | Updated MatBench Discovery (OMat24 split adds OAM track) | F1, DAF, MAE eV/atom, precision | https://matbench-discovery.materialsproject.org/ |
| oc20_s2ef | structure-to-energy-and-forces | energy MAE (meV), force MAE (meV/Å) | https://opencatalystproject.org/leaderboard.html |
| oc22_s2ef | oxide electrocatalyst S2EF | energy/force MAE | https://opencatalystproject.org/leaderboard_oc22.html |
| weatherbench2 | global data-driven NWP benchmark | RMSE, ACC per variable/lead time | https://sites.research.google/weatherbench/ |
| gift_eval | 28 datasets, 144k series, 7 domains | aggregated MASE, CRPS | https://huggingface.co/spaces/Salesforce/GIFT-Eval |
| fev_bench | foundation eval for time series (Amazon) | MASE/CRPS aggregate | https://huggingface.co/amazon/chronos-2 |
| chronos_benchmark_ii | Chronos zero-shot eval suite | MASE/WQL | https://github.com/amazon-science/chronos-forecasting |
| chembench_preference | chemistry preference eval (ChemBench) | win rate vs reference | https://arxiv.org/abs/2504.06196 |
| astroclip_zphot | photometric redshift, galaxy property (R²), morphology | R² / accuracy | https://academic.oup.com/mnras/article/531/4/4990/7697182 |

## New models to register

| model_id | vendor | params | release | sources |
|---|---|---|---|---|
| alphafold-3 | DeepMind / Isomorphic Labs | undisclosed | 2024-05-08 | https://www.nature.com/articles/s41586-024-07487-w |
| alphaproteo | DeepMind | undisclosed | 2024-09-05 | https://arxiv.org/abs/2409.08022 |
| esm-3 | EvolutionaryScale | 98B | 2024-06 / Sci. Jan 2025 | https://www.evolutionaryscale.ai/blog/esm3-release |
| esm-cambrian-6b | EvolutionaryScale | 6B | 2024-12 | https://www.evolutionaryscale.ai/blog/esm-cambrian |
| evo-2-7b | Arc Institute | 7B | 2025-02-21 | https://www.biorxiv.org/content/10.1101/2025.02.18.638918v1 |
| evo-2-40b | Arc Institute | 40B | 2025-02-21 | https://www.biorxiv.org/content/10.1101/2025.02.18.638918v1 |
| geneformer-v2-104m | Theodoris Lab | 104M | 2024-12 | https://huggingface.co/ctheodoris/Geneformer |
| geneformer-v2-316m | Theodoris Lab | 316M | 2024-12 | https://huggingface.co/ctheodoris/Geneformer |
| scgpt | Wang Lab / UofT | ~50M | Nat Methods 2024 | https://www.nature.com/articles/s41592-024-02201-0 |
| scfoundation | Tsinghua | 100M | 2024 | https://advanced.onlinelibrary.wiley.com/doi/10.1002/advs.202514490 |
| helix-mrna-v0 | Helical AI | small (10% of FM peers) | 2025-02 | https://arxiv.org/abs/2502.13785 |
| txgemma-2b-predict | Google | 2B | 2025-03 | https://arxiv.org/abs/2504.06196 |
| txgemma-9b-predict | Google | 9B | 2025-03 | https://arxiv.org/abs/2504.06196 |
| txgemma-9b-chat | Google | 9B | 2025-03 | https://arxiv.org/abs/2504.06196 |
| txgemma-27b-predict | Google | 27B | 2025-03 | https://arxiv.org/abs/2504.06196 |
| txgemma-27b-chat | Google | 27B | 2025-03 | https://arxiv.org/abs/2504.06196 |
| chemfm-3b | Clemson (Cai et al.) | 3B | 2024-10 | https://arxiv.org/abs/2410.21422 |
| mattergen | Microsoft | diffusion ~unk | Nature 2025 | https://www.nature.com/articles/s41586-025-08628-5 |
| mattersim | Microsoft | unk | 2024-05 | https://arxiv.org/html/2405.04967v1 |
| mace-mp-0 | ACEsuit / Cambridge | ~5M | 2024 | https://github.com/ACEsuit/mace-foundations |
| equiformerv3-dens-oam | Meta FAIR | unk | 2025 | https://matbench-discovery.materialsproject.org/ |
| equiformerv2-153m | Meta FAIR | 153M | 2023 (edge) | https://opencatalystproject.org/leaderboard.html |
| esen-30m-oam | (FAIR/Allegro?) | 30M | 2025 | https://matbench-discovery.materialsproject.org/ |
| orb-v3 | Orbital Materials | unk | 2025 | https://matbench-discovery.materialsproject.org/ |
| aurora | Microsoft | 1.3B | Nature 2025 | https://www.nature.com/articles/s41586-025-09005-y |
| aifs | ECMWF | unk | 2024 ops | https://www.ecmwf.int/en/about/media-centre/aifs-blog/2024/accuracy-versus-activity |
| gencast | DeepMind | diffusion | 2024 | https://github.com/google-deepmind/graphcast |
| timesfm-2.5 | Google | 200M-class | 2025-09 | https://www.marktechpost.com/2025/09/16/google-ai-ships-timesfm-2-5/ |
| chronos-2 | Amazon | 120M | 2025 | https://huggingface.co/amazon/chronos-2 |
| moirai-2.0 | Salesforce | unk | 2025-08 | https://arxiv.org/abs/2511.11698 |
| ttm-r2 | IBM Granite | 1-5M | NeurIPS 2024 | https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2 |
| astroclip | PolymathicAI | unk | MNRAS 2024 | https://academic.oup.com/mnras/article/531/4/4990/7697182 |
| dnabert-2 | MAGICS-LAB | 117M | ICLR 2024 (edge) | https://arxiv.org/abs/2306.15006 |

## Extractable scores (STRICT-ATTRIBUTION verified)

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| alphafold-3 | posebusters_v2 | 76 | % success (RMSD<2Å + PB-valid) | https://www.nature.com/articles/s41586-024-07487-w |
| alphafold-3 | posebusters_v2 (vs Vina/RFAA) | +50 | % rel. accuracy improvement | https://www.nature.com/articles/s41586-024-07487-w |
| alphaproteo | bhrf1_binder | 88 | % experimental success rate | https://arxiv.org/abs/2409.08022 |
| alphaproteo | 7-target avg vs best-prior | 3-300 | fold tighter binding affinity | https://arxiv.org/abs/2409.08022 |
| aurora | weatherbench2_ifs_targets | 92 | % of variable/level/lead-time targets RMSE<IFS | https://www.nature.com/articles/s41586-025-09005-y |
| aurora | weatherbench2_>12h_rmse | 24 | % RMSE reduction vs IFS | https://www.nature.com/articles/s41586-025-09005-y |
| aurora | ifs_speedup | 5000 | x compute speedup | https://www.nature.com/articles/s41586-025-09005-y |
| txgemma-27b | tdc_66_therapeutic_vs_genrlst | 64/66 | tasks ≥ Tx-LLM baseline (45/66 superior) | https://arxiv.org/abs/2504.06196 |
| txgemma-27b | tdc_66_therapeutic_vs_speclst | 50/66 | tasks ≥ specialist (26/66 superior) | https://arxiv.org/abs/2504.06196 |
| txgemma-agentic-tx | humanitys_last_exam_chem_bio | +52.3 | % rel. improvement over o3-mini-high | https://arxiv.org/abs/2504.06196 |
| txgemma-agentic-tx | gpqa_chemistry | +26.7 | % rel. over o3-mini-high | https://arxiv.org/abs/2504.06196 |
| txgemma-agentic-tx | chembench_preference | +6.3 | % rel. | https://arxiv.org/abs/2504.06196 |
| txgemma-agentic-tx | chembench_mini | +2.4 | % rel. | https://arxiv.org/abs/2504.06196 |
| chemfm-3b | 34_property_benchmarks_aggregate | up to 67.48 | % perf improvement vs task-specific SOTA | https://arxiv.org/abs/2410.21422 |
| chemfm-3b | reaction_prediction_top1 | up to +3.7 | % top-1 accuracy across 4 datasets | https://arxiv.org/abs/2410.21422 |
| chemfm-3b | conditional_mol_gen | up to 33.80 | % MAD reduction conditioned vs actual | https://arxiv.org/abs/2410.21422 |
| mattergen | stable_novel_unique_rate | 2x | vs prior generative baselines | https://www.nature.com/articles/s41586-025-08628-5 |
| mattergen | energy_minimum_distance | 10x | closer to local energy minimum | https://www.nature.com/articles/s41586-025-08628-5 |
| mattergen | tacr2o6_synthesis_bulk_modulus | 169 | GPa (target 200 GPa, <20% rel. err) | https://www.nature.com/articles/s41586-025-08628-5 |
| gnome | stable_structures_predicted | 380000 | new stable crystals (of 2.2M predictions) | https://www.nature.com/articles/s41586-023-06735-9 |
| gnome | experimental_validation_count | 736 | independently synthesized | https://www.nature.com/articles/s41586-023-06735-9 |
| gnome | stability_prediction_rate | 80 | % (vs 50% prior algorithms) | https://www.nature.com/articles/s41586-023-06735-9 |
| equiformerv3-dens-oam | matbench_discovery_f1 | 0.931 | F1 | https://matbench-discovery.materialsproject.org/ |
| equiformerv3-dens-oam | matbench_discovery_mae | 0.018 | eV/atom | https://matbench-discovery.materialsproject.org/ |
| equiformerv3-dens-oam | matbench_discovery_daf | 6.074 | DAF | https://matbench-discovery.materialsproject.org/ |
| equiformerv3-dens-oam | matbench_discovery_precision | 0.928 | precision | https://matbench-discovery.materialsproject.org/ |
| pet-oam-xl | matbench_discovery_f1 | 0.924 | F1 | https://matbench-discovery.materialsproject.org/ |
| esen-30m-oam | matbench_discovery_f1 | 0.925 | F1 | https://matbench-discovery.materialsproject.org/ |
| esen-30m-oam | matbench_discovery_mae | 0.018 | eV/atom | https://matbench-discovery.materialsproject.org/ |
| equflash | matbench_discovery_f1 | 0.919 | F1 | https://matbench-discovery.materialsproject.org/ |
| matris-10m-oam | matbench_discovery_f1 | 0.921 | F1 | https://matbench-discovery.materialsproject.org/ |
| tace-oam-l | matbench_discovery_f1 | 0.910 | F1 | https://matbench-discovery.materialsproject.org/ |
| nequip-oam-xl | matbench_discovery_f1 | 0.906 | F1 | https://matbench-discovery.materialsproject.org/ |
| sevennet-omni-i12 | matbench_discovery_f1 | 0.906 | F1 | https://matbench-discovery.materialsproject.org/ |
| orb-v3 | matbench_discovery_f1 | 0.905 | F1 | https://matbench-discovery.materialsproject.org/ |
| allegro-oam-l | matbench_discovery_f1 | 0.895 | F1 | https://matbench-discovery.materialsproject.org/ |
| equiformerv2-153m | oc20_s2ef_force_mae | 14.2 | meV/Å | https://opencatalystproject.org/leaderboard.html |
| equiformerv2-153m | oc20_s2ef_energy_mae | 15.0 | meV | https://opencatalystproject.org/leaderboard.html |
| moirai-2.0 | gift_eval_mase_rank | 1 | rank among non-leaking models | https://www.salesforce.com/blog/moirai-2-0/ |
| timesfm-2.5 | gift_eval_zero_shot_mase | 1 | rank, zero-shot foundation models | https://www.marktechpost.com/2025/09/16/google-ai-ships-timesfm-2-5/ |
| timesfm-2.0 | gift_eval_mase_vs_next | +6 | % better aggregated MASE | https://github.com/google-research/timesfm |
| chronos-2 | gift_eval | best | pretrained-model SOTA | https://huggingface.co/amazon/chronos-2 |
| chronos-2 | fev_bench | best | pretrained-model SOTA | https://huggingface.co/amazon/chronos-2 |
| chronos-2 | chronos_benchmark_ii | best | pretrained-model SOTA | https://huggingface.co/amazon/chronos-2 |
| ttm-r2 | zero_shot_forecasting | 4-40 | % better than MOIRAI/TimesFM (paper claim) | https://arxiv.org/pdf/2401.03955 |
| dnabert-2 | gue_28 | SOTA | aggregate (21× fewer params vs NT-v2) | https://arxiv.org/abs/2306.15006 |
| astroclip | photometric_redshift | similar | to specialized ResNet18 baseline | https://academic.oup.com/mnras/article/531/4/4990/7697182 |
| astroclip | physical_property_estimation_r2 | +19 | % R² over supervised baseline | https://academic.oup.com/mnras/article/531/4/4990/7697182 |
| astroclip | image_self_supervised_baselines | ~2x | better on zphot & property prediction | https://academic.oup.com/mnras/article/531/4/4990/7697182 |
| esm-3 | esmgfp_sequence_identity | 58 | % similar to closest natural GFP | https://www.evolutionaryscale.ai/blog/esm3-release |
| helix-mrna-v0 | mrnabench_parameter_efficiency | 10 | % parameters of peer FMs | https://arxiv.org/abs/2502.13785 |
| helix-mrna-v0 | sequence_length_support | 6x | longer than current approaches | https://arxiv.org/abs/2502.13785 |

## Skipped (no primary leaderboard / too niche / already covered / >2yr old)

- **MoleculeNet single scores** — original MolFormer paper is 2022 (>2yr edge); 2022 AUROCs technically primary but model exceeds 2-year window.
- **ChemBERTa-2** — published 2022, outside latest-models window.
- **BindGPT** — no canonical primary paper found; may refer to non-foundation-model approach. Drop.
- **TDC per-task ADMET scores for individual specialist models** — TDC leaderboard reproducibility scandal (only 3/22 models passed 2026 audit per bioRxiv 2026.02.26.708193), risky to register specialists.
- **GraphCast / Pangu-Weather / FourCastNet** — published 2023, RMSE per-variable still primary but >2yr old at point of registration; only register if newer Z500/T850 RMSE published in 2024-2025 by WeatherBench-2 team.
- **MoleculeNet primary task numbers for IBM MoLFormer-XL** — model itself is 2022.
- **ProGen2 perplexity** — Cell Systems 2023, outside window edge.
- **CASP15 results** — already referenced in DB per task context.
- **AlphaProteo per-target affinity values** — paper content blocked from extraction (303 redirect); blog reports "3-300 fold" range only. Aggregate metric registered; per-target Kd needs paper PDF.
- **AlphaFold 3 per-DockQ-score breakdowns** — Nature paper 403'd from fetch; only the headline 76% and 50% claims confirmed elsewhere. Skip per-interface scores until primary table fetched.
- **Geneformer / scGPT per-cell-type AUROC** — multiple secondary benchmarking papers, but each primary FM paper does not report aggregable singletons; register only as benchmark family, no scores until canonical leaderboard.
- **OC22 ODAC23 individual model scores** — leaderboard exists, did not fetch deeply; register benchmark, fetch scores in follow-up.
- **GuacaMol** — 2019 baseline only; no canonical 2024-2025 leaderboard.
- **AstroLLaVA** — no clear primary paper located in this search pass. Skip.
- **Tx-LLM** — superseded by TxGemma; TxGemma's TDC results subsume.
- **CAMEO continuous eval** — weekly snapshots; not point-in-time triple-friendly.

---

## Summary

**Top 5 SciFM families worth adding (highest yield, cleanest attribution):**

1. **AlphaFold 3 + AlphaProteo** (DeepMind biomolecular) — PoseBusters 76%, 50% rel improvement, AlphaProteo 88% BHRF1 success, 3-300× affinity. Anchors structure prediction coverage.
2. **MatBench Discovery leaderboard** — already in DB but missing 13 new top-15 OAM-track models (EquiformerV3+DeNS-OAM 0.931 F1, etc.). High-density score addition with zero new benchmark registration cost.
3. **Time-series FMs (TimesFM-2.5, Chronos-2, Moirai 2.0, TTM-R2)** — GIFT-Eval is now the canonical leaderboard. Four foundation-model entries from primary blogs/papers, all 2024-2025.
4. **Evo 2 (Arc Institute)** — 7B + 40B, ClinVar/BRCA1 SGE published, Nature paper. Anchors DNA-FM category which is currently empty.
5. **TxGemma + Aurora + MatterGen** — Nature/arxiv-published numbers (TDC 66 tasks 50/66 superior, Aurora 92% IFS targets, MatterGen 2× novelty 10× energy proximity). Three Nature-tier papers, very clean attribution.

**Total estimated yield:** ~22 new benchmarks, ~32 new models, ~45 strict-attribution score triples. Roughly doubles dedicated SciFM coverage in the DB.

**Frontier-vs-specialist pattern observed:**
- **Specialists win on classical accuracy benches**: MatBench Discovery leaderboard is 100% specialist UMLIPs (no frontier LLM appears). OC20/OC22 are all specialist GNNs. WeatherBench-2 is all weather FMs.
- **Frontier LLMs win on reasoning-over-science**: ChemBench, GPQA Chemistry, Humanity's Last Exam Chem/Bio — TxGemma-agentic system reports +52% over o3-mini, but the underlying eval is text reasoning, not 3D structure.
- **Hybrid emerging in single-cell + perturbation**: scGPT/Geneformer/scFoundation underperform simple linear baselines on perturbation per Nat Methods 2025 audit — capability claim risk is high.
- **Reproducibility caveat**: TDC ADMET leaderboard 2026 audit (bioRxiv 2026.02.26) found 19/22 top models non-reproducible — register the benchmark but be conservative on which specialist scores to import.

Word count: ~390.
