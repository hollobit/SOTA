# BMT Candidate Benchmarks — 2026-04-18

Cross-referenced 2,559 entries in `data/bmt_catalog.json` against the 95 benchmarks currently tracked in `data/export/benchmarks.json`. Filtered to 2024+ publications with live paper + GitHub sources, scored for recency, frontier coverage, data availability, and citation weight.

**25 recommended candidates** organized by category. Ingestion priority and source strategy listed.

---

## Reasoning / Knowledge

| # | Candidate | Why it matters | Source | Scout strategy |
|---|-----------|----------------|--------|----------------|
| 1 | **HealthBench** (2025) | OpenAI-built medical conversation eval, 5,000 multi-turn dialogues, safety + accuracy. Frontier labs publish HealthBench scores in every release note. | [arxiv 2505.08775](https://arxiv.org/abs/2505.08775) · [github openai/simple-evals](https://github.com/openai/simple-evals) | Scrape System Cards (OpenAI/Anthropic/Google) + simple-evals README |
| 2 | **SuperGPQA** (2025) | 26,529 graduate-level questions across 285 disciplines — wider coverage than GPQA Diamond. Active leaderboard. | [arxiv 2502.14739](https://arxiv.org/abs/2502.14739) · [github SuperGPQA/SuperGPQA](https://github.com/SuperGPQA/SuperGPQA) | Scrape GitHub README leaderboard table |
| 3 | **ZebraLogic** (2025) | 1,000 controllable logic-grid puzzles. Used by Allen AI in ZeroEval suite. Frequently cited in new-release evals. | [arxiv 2502.01100](https://arxiv.org/abs/2502.01100) · [github WildEval/ZeroEval](https://github.com/WildEval/ZeroEval) | Scrape ZeroEval leaderboard.md |
| 4 | **LiveBench** (2024) | Contamination-free, monthly refresh across math/reasoning/coding/IF/data. Widely-reported. | [livebench.ai](https://livebench.ai) | Scrape livebench.ai HTML |
| 5 | **Arena-Hard-Auto** (2024) | LMSYS-built automated 500-prompt benchmark — standard reference in every model launch blog. | [github lmarena-ai/arena-hard-auto](https://github.com/lmarena-ai/arena-hard-auto) | Scrape GitHub results tables |

## Coding

| # | Candidate | Why it matters | Source | Scout strategy |
|---|-----------|----------------|--------|----------------|
| 6 | **Multi-SWE-bench** (2025) | 1,632 issues across 8 languages (Java/Go/TS/C++). Fills clear gap — SWE-bench Multilingual covers different languages. | [arxiv 2504.02605](https://arxiv.org/abs/2504.02605) · [github multi-swe-bench](https://github.com/multi-swe-bench) | Scrape GitHub leaderboard table |
| 7 | **SWE-PolyBench** (2025) | Amazon Science, 2,110 repo-level multi-language coding tasks with execution-based grading. | [arxiv 2504.08703](https://arxiv.org/abs/2504.08703) · [github amazon-science/SWE-PolyBench](https://github.com/amazon-science/SWE-PolyBench) | Scrape GitHub README + paper Table 3 |
| 8 | **SWE-bench Multimodal** (2024) | Princeton, visual-UI JS bug fixing. Extends SWE-bench into multimodal coding; unique capability gap. | [arxiv 2410.03859](https://arxiv.org/abs/2410.03859) | Scrape swebench.com leaderboard |
| 9 | **SecRepoBench** (2025) | 318 repo-level secure code completion tasks. Complements BaxBench + Vibe Coding Safety. | [arxiv 2504.21132](https://arxiv.org/abs/2504.21132) | Extract paper Table 3 |

## Cybersecurity

| # | Candidate | Why it matters | Source | Scout strategy |
|---|-----------|----------------|--------|----------------|
| 10 | **CTI-Bench** (2024) | 5,610 cyber threat intel tasks (attribution, severity, knowledge). Fills CTI gap. | [arxiv 2406.11303](https://arxiv.org/abs/2406.11303) · [github xashru/cti-bench](https://github.com/xashru/cti-bench) | Scrape GitHub results markdown |
| 11 | **CyberMetric** (2024) | 10,000 cybersecurity knowledge questions from standards/certifications. Broad adoption, TII Falcon team. | [github tiiuae/CyberMetric](https://github.com/tiiuae/CyberMetric) | Scrape GitHub leaderboard.md |
| 12 | **MegaVul** (2024) | 17,380 real C/C++ CVE vulnerabilities. Canonical modern vuln dataset. | [arxiv 2406.12450](https://arxiv.org/abs/2406.12450) | Paper Table 4 + GitHub |

## Agent

| # | Candidate | Why it matters | Source | Scout strategy |
|---|-----------|----------------|--------|----------------|
| 13 | **MCP-Bench** (2025) | Accenture-built, 28 live MCP servers × 250 tools. Complements our MCP-Atlas. | [arxiv 2508.20453](https://arxiv.org/abs/2508.20453) | Scrape GitHub README |
| 14 | **LiveMCPBench** (2025) | ICIP-CAS, 95 live MCP tasks — dynamic tool landscape, different from MCP-Atlas snapshot. | [arxiv 2508.01780](https://arxiv.org/abs/2508.01780) | Scrape GitHub README |
| 15 | **BrowseComp-Plus** (2025) | 830 queries + 100k doc fixed corpus — fairer successor to BrowseComp. Deep-research eval. | [arxiv 2508.05830](https://arxiv.org/abs/2508.05830) | Extract paper Table 2 |
| 16 | **Windows Agent Arena** (2024) | Microsoft, 154 Windows desktop tasks. Complements OSWorld (Ubuntu). | [arxiv 2409.08264](https://arxiv.org/abs/2409.08264) | Scrape GitHub leaderboard |
| 17 | **ScienceAgentBench** (2024) | 102 peer-review-derived data-science tasks. Distinct from PaperBench (implements vs reproduces). | [arxiv 2410.05080](https://arxiv.org/abs/2410.05080) | Extract paper Table 4 |

## Multimodal

| # | Candidate | Why it matters | Source | Scout strategy |
|---|-----------|----------------|--------|----------------|
| 18 | **Video-MME** (2024) | 900 videos × 2,700 QAs across durations — quoted alongside Video-MMMU in frontier labs. | [arxiv 2405.21075](https://arxiv.org/abs/2405.21075) · [github BradyFU/Video-MME](https://github.com/BradyFU/Video-MME) | Scrape GitHub leaderboard.md |
| 19 | **BLINK** (2024) | 3,807 visual perception tasks (depth/forensics/multi-view). Tests core vision primitives MMMU-Pro skips. | [arxiv 2404.12390](https://arxiv.org/abs/2404.12390) | Scrape zeyofu.github.io/blink |

## Safety / Red-teaming

| # | Candidate | Why it matters | Source | Scout strategy |
|---|-----------|----------------|--------|----------------|
| 20 | **HarmBench** (2024) | CAIS standard red-team benchmark, 510 harmful behaviors. Dominant citation for attack-success-rate. | [arxiv 2402.04249](https://arxiv.org/abs/2402.04249) · [github centerforaisafety/HarmBench](https://github.com/centerforaisafety/HarmBench) | Scrape GitHub results + paper Table 2 |
| 21 | **StrongREJECT** (2024) | 313 prompts with improved grading rubric. Often paired with HarmBench. | [arxiv 2402.10260](https://arxiv.org/abs/2402.10260) | Scrape GitHub leaderboard |
| 22 | **AIR-Bench** (2024) | 5,694 prompts across government/corporate risk categories. Tsinghua, strong adoption. | [arxiv 2402.04368](https://arxiv.org/abs/2402.04368) | Scrape GitHub results |

## Other Strategic

| # | Candidate | Why it matters | Source | Scout strategy |
|---|-----------|----------------|--------|----------------|
| 23 | **HELMET** (2024) | Princeton's 7-category long-context benchmark — more application-centric than LongBench v2. | [arxiv 2410.02694](https://arxiv.org/abs/2410.02694) | Scrape princeton-nlp/HELMET |
| 24 | **AudioBench / MMAU** (2024) | Zero audio coverage in current dashboard; speech+scene+paralinguistic. | [arxiv 2406.16020](https://arxiv.org/abs/2406.16020) | Scrape GitHub leaderboard |
| 25 | **Finance Agent Benchmark** (2025) | Vals.ai, 537 finance research questions with tool use — fills vertical-domain gap. | [arxiv 2508.00828](https://arxiv.org/abs/2508.00828) | Scrape vals.ai HTML |

---

## Coverage Gaps

- **Audio**: ZERO coverage. AudioBench is the obvious first ingestion; MMAU could follow.
- **Safety / red-teaming**: only AILuminate and FORTRESS tracked. HarmBench + StrongREJECT + AIR-Bench are the 3-benchmark canonical set every safety paper reports.
- **Long-context**: only LongBench v2 and Fiction.liveBench. HELMET adds application-centric coverage (RAG, summarization, citation).
- **CTI / threat intelligence**: CyberSOCEval, DFIR-Metric cover defense, but no dedicated CTI knowledge benchmark. CTI-Bench + CyberMetric fill this.
- **Vertical-domain agents**: finance/medical/legal absent. HealthBench, Finance Agent Benchmark cover two high-value verticals.
- **Desktop agent parity**: OSWorld (Ubuntu) tracked; Windows Agent Arena is the Windows counterpart.
- **Multimodal video**: LongVideoBench + Video-MMMU tracked; Video-MME is the "speed test" equivalent in every VLM release.

---

## Suggested Ingestion Order

1. **HealthBench + Arena-Hard-Auto** — reported in nearly every frontier model launch; immediate data availability.
2. **HarmBench + StrongREJECT + AIR-Bench** — complete the safety canon.
3. **Multi-SWE-bench + SWE-PolyBench** — broaden coding beyond the single Python/Java SWE-bench slice.
4. **CTI-Bench + CyberMetric** — fix the CTI knowledge gap; complements our existing cyber defense trio.
5. **Video-MME** — dashboard-worthy multimodal delta.
6. **HELMET** — long-context application eval.
7. **AudioBench** — open zero-coverage category.
8. **Windows Agent Arena + ScienceAgentBench + MCP-Bench + LiveMCPBench + BrowseComp-Plus** — agent breadth.
9. **SuperGPQA + ZebraLogic + LiveBench** — reasoning breadth.
10. **SecRepoBench + MegaVul** — cyber coding gap.
11. **BLINK + Finance Agent Benchmark** — multimodal depth + vertical coverage.
