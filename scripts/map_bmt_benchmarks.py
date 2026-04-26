"""Map benchmarks in config/benchmarks_meta.yaml against BMT/BMT.json.

For each benchmark in our registry:
  - If a matching BMT entry is found (by normalized title), enrich the YAML
    with paper/github/itemCount/year/authors metadata (preserving existing fields).
  - If no match, record the gap in BMT/BMT-miss.json with the benchmark id, name,
    description, expected paper, and a note suggesting BMT submission.

Matching is normalized: lowercase, drop punctuation/spaces, strip parentheticals
like "(USMLE)" so MedQA → MedQA(USMLE) still resolves.
"""
import json
import re
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parent.parent
BMT_PATH = ROOT / "BMT" / "BMT.json"
META_PATH = ROOT / "config" / "benchmarks_meta.yaml"
MISS_PATH = ROOT / "BMT" / "BMT-miss.json"
MAP_OUT = ROOT / "BMT" / "BMT-mapping.json"


def norm(s: str) -> str:
    if not s:
        return ""
    s = s.lower()
    s = re.sub(r"\([^)]*\)", "", s)
    s = re.sub(r"\bv?\d+(\.\d+)?\b", "", s)
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s


def loose_norm(s: str) -> str:
    """Looser key — keeps the meaningful root, removes common suffixes."""
    s = norm(s)
    for suffix in ("benchmark", "bench", "eval", "evaluation", "dataset", "test", "challenge", "score"):
        if s.endswith(suffix):
            s = s[: -len(suffix)]
            break
    return s


# Manual aliases for benchmarks where BMT.json uses a different canonical title.
ALIASES = {
    "medqa_usmle": ["MedQA (USMLE)", "MedQA"],
    "medqa_4opt": ["MedQA (USMLE)", "MedQA"],
    "mmlu_clinical": ["MMLU"],
    "medbullets": ["MedBullets-5op", "MedBullets"],
    "medxpertqa_text": ["MedXpertQA"],
    "medxpertqa_mm": ["MedXpertQA"],
    "medxpertqa": ["MedXpertQA"],
    "vqa_rad": ["VQA-RAD"],
    "slake_vqa": ["SLAKE", "SLAKE: A Semantically-Labeled Knowledge-Enhanced Dataset for Medical Visual Question Answering"],
    "path_vqa": ["PathVQA", "Path-VQA"],
    "pmc_vqa": ["PMC-VQA"],
    "afrimed_qa_mcq": ["AfriMed-QA"],
    "afrimed_qa_saq": ["AfriMed-QA"],
    "rexrank_radgraph_f1": ["MIMIC-CXR", "ReXrank"],
    "rexrank_bertscore": ["MIMIC-CXR", "ReXrank"],
    "rexrank_radcliq": ["MIMIC-CXR", "ReXrank"],
    "rexrank_green": ["MIMIC-CXR", "ReXrank"],
    "rexrank_finerad": ["MIMIC-CXR", "ReXrank"],
    "rexgrad_acc": ["MIMIC-CXR", "ReXrank"],
    "chexpert_f1": ["CheXpert"],
    "swe_bench": ["SWE-bench"],
    "math": ["MATH"],
    "aime": ["AIME"],
    "humaneval": ["HumanEval"],
    "ifeval": ["IFEval"],
    "truthfulqa": ["TruthfulQA"],
    "mimic_iv_sepsis_auc": ["MIMIC-IV"],
    "mimic_aki_mortality": ["MIMIC-IV"],
    "eicu_xgen_auc": ["MIMIC-IV", "eICU"],
    "mimic_iv_readmit": ["MIMIC-IV"],
    "wmdp_bio": ["WMDP", "WMDP-Bio"],
    "wmdp_chem": ["WMDP", "WMDP-Chem"],
    "casp16_gdt": ["CASP", "CASP16", "CASP15 Datasets (and previous editions)", "CASP15 Datasets"],
    "alphafold3_pae": ["AlphaFold"],
    "moleculenet_avg": ["MoleculeNet"],
    "tdc_admet": ["TDC", "Therapeutics Data Commons"],
    "biolp_bench": ["BioLP-bench"],
    "vct_virology": ["VCT", "Virology Capabilities Test"],
    "med_halt": ["Med-HALT"],
    "medhallu": ["MedHallu"],
    "medhallbench": ["MedHallBench"],
    "medsafetybench": ["MedSafetyBench"],
    "patientsafebench": ["PatientSafeBench", "PatientSafetyBench"],
    "csedb_safety": ["CSEDB"],
    "csedb_effectiveness": ["CSEDB"],
    "craft_md": ["CRAFT-MD"],
    "medic_eval": ["MEDIC"],
    "blue_benchmark": ["BLUE", "BLUE Benchmark"],
    "medarabench": ["MedAraBench"],
    "bimedix_eval": ["BiMediX"],
    "panderm_skin": ["PanDerm"],
    "echonet_lvef_mae": ["EchoNet-Dynamic", "EchoCLIP"],
    "echonet_lvef_auc50": ["EchoNet-Dynamic", "EchoCLIP"],
    "rad_chestct": ["RAD-ChestCT"],
    "brats": ["BraTS"],
    "omnimedvqa": ["OmniMedVQA"],
    "kmle": ["KMLE", "Korean Medical Licensing Examination"],
    "kmle_2025": ["KMLE", "Korean Medical Licensing Examination"],
    "kormedlawqa": ["KorMedLawQA"],
    "ehrqa": ["EHRQA"],
    "care_qa": ["CARE-QA"],
    "neet_pg": ["NEET-PG", "NEET PG"],
    "indic_med_bench": ["Indic Medical"],
    "cmexam_cn": ["CMExam"],
    "promedqa_cn": ["PromedQA"],
    "biomistral_multilingual": ["BioMistral"],
    "owkin_path_avg": ["TCGA"],
    "openai_healthbench_hard": ["HealthBench"],
    "mmedbench": ["MMedBench"],
    "medbench_cn": ["MedBench"],
    "medagentbench": ["MedAgentBench"],
    "amega": ["AMEGA"],
    "meds_bench": ["MedS-Bench"],
    "open_medical_llm_avg": ["Open Medical-LLM Leaderboard", "Open Medical-LLM"],
    "polaris_safety": ["Polaris"],
    "medseg_dice": ["MedSAM"],
    "retbench_auc": ["RetBench"],
    "radbench": ["RadFM", "RadBench"],
    "path_bench": ["TCGA"],
    "medriskeval": ["MedRiskEval"],
    "igakuqa": ["IgakuQA"],
    "jmedbench": ["JMedBench"],
    "jmed_lora_eval": ["JMedLoRA"],
    "delphi_disease_risk": ["UK Biobank", "Delphi"],
    "lunit_dx_auc": ["CheXpert"],
    "vqamed_2024": ["VQA-Med"],
    "med_internvl_avg": ["MedDr"],
    "m42_clinical_avg": [],
    "synapxe_sg_eval": [],
    "nhs_aide_eval": [],
    "uhn_clin_bench": [],
    "absci_yield": [],
    "pdbbind_rmsd": ["PDBBind"],
    "gpqa": ["GPQA", "GPQA: A Graduate-Level Google-Proof Q&A Benchmark", "Graduate-Level Google-Proof"],
    "gsm8k": ["GSM8K"],
    "mmmu": ["MMMU"],
}


def main() -> None:
    bmt = json.loads(BMT_PATH.read_text())
    meta = yaml.safe_load(META_PATH.read_text())

    # Build BMT lookup: normalized title → entry. Keep all variants.
    bmt_index: dict[str, list[dict]] = {}
    bmt_loose: dict[str, list[dict]] = {}
    for e in bmt:
        key = norm(e.get("title", ""))
        bmt_index.setdefault(key, []).append(e)
        lk = loose_norm(e.get("title", ""))
        if lk:
            bmt_loose.setdefault(lk, []).append(e)
        # Also index aliases inside title parens like "MMLU (Massive Multitask...)"
        m = re.match(r"^([^(]+)\s*\(([^)]+)\)", e.get("title", ""))
        if m:
            for part in (m.group(1), m.group(2)):
                k2 = norm(part)
                if k2:
                    bmt_index.setdefault(k2, []).append(e)
                lk2 = loose_norm(part)
                if lk2:
                    bmt_loose.setdefault(lk2, []).append(e)

    matched: list[dict] = []
    missed: list[dict] = []
    for b in meta.get("benchmarks", []):
        bid = b["id"]
        bname = b.get("name", bid)
        candidates = [
            norm(bname),
            norm(re.sub(r"\([^)]*\)", "", bname)),
            norm(bid.replace("_", " ")),
        ]
        # Append manual alias keys
        for alias in ALIASES.get(bid, []):
            candidates.append(norm(alias))
        candidates = [c for c in candidates if c]
        hit = None
        # Strict match first
        for k in candidates:
            if k in bmt_index:
                hit = bmt_index[k][0]
                break
        # Loose match fallback
        if not hit:
            loose_cands = [loose_norm(bname), loose_norm(bname.split(" ")[0])]
            for alias in ALIASES.get(bid, []):
                loose_cands.append(loose_norm(alias))
            loose_cands = [c for c in loose_cands if c]
            for k in loose_cands:
                if k in bmt_loose:
                    hit = bmt_loose[k][0]
                    break
        if hit:
            matched.append({
                "id": bid,
                "name": bname,
                "bmt_id": hit.get("id"),
                "bmt_title": hit.get("title"),
                "paper": hit.get("paperLink"),
                "github": hit.get("githubLink"),
                "year": hit.get("year"),
                "item_count": hit.get("itemCount"),
                "specs": hit.get("specs"),
                "authors": hit.get("authors", []),
                "description": hit.get("description"),
            })
        else:
            missed.append({
                "id": bid,
                "name": bname,
                "metric": b.get("metric"),
                "category": b.get("category"),
                "description": b.get("description", ""),
                "paper": b.get("paper"),
                "expected_range": b.get("expected_range"),
                "note": "Not found in BMT/BMT.json — consider submitting this benchmark to BMT registry.",
            })

    # Write outputs
    MISS_PATH.write_text(json.dumps(missed, indent=2, ensure_ascii=False))
    MAP_OUT.write_text(json.dumps(matched, indent=2, ensure_ascii=False))

    # Enrich the YAML with bmt fields (idempotent)
    matched_by_id = {m["id"]: m for m in matched}
    for b in meta.get("benchmarks", []):
        m = matched_by_id.get(b["id"])
        if not m:
            continue
        bmt_info = {
            "bmt_id": m["bmt_id"],
            "bmt_title": m["bmt_title"],
        }
        if m.get("paper") and not b.get("paper"):
            b["paper"] = m["paper"]
        if m.get("github"):
            b["github"] = m["github"]
        if m.get("year"):
            b["year"] = m["year"]
        if m.get("item_count"):
            b["item_count"] = m["item_count"]
        b["bmt"] = bmt_info

    META_PATH.write_text(yaml.safe_dump(meta, sort_keys=False, allow_unicode=True))

    print(f"Total benchmarks in meta: {len(meta.get('benchmarks', []))}")
    print(f"Matched in BMT: {len(matched)}")
    print(f"Missed (written to BMT-miss.json): {len(missed)}")
    print(f"Mapping written to: {MAP_OUT}")
    print(f"Misses written to: {MISS_PATH}")
    print(f"benchmarks_meta.yaml enriched with bmt_id/github/year/item_count")


if __name__ == "__main__":
    main()
