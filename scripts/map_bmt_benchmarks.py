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


def alpha_only(s: str) -> str:
    """Strip everything except letters — strongest fuzzy key."""
    if not s: return ""
    return re.sub(r"[^a-z]+", "", s.lower())


def loose_norm(s: str) -> str:
    """Looser key — keeps the meaningful root, removes common suffixes."""
    s = norm(s)
    for suffix in ("benchmark", "bench", "eval", "evaluation", "dataset", "test", "challenge", "score", "questions", "qa"):
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
    "medhallbench": ["MedHallBench", "MedHallBench v2"],
    "craft_md": ["CRAFT-MD", "Tau-break (part of CRAFT)"],
    "pmc_vqa": ["PMC-VQA", "PMC VQA"],
    "medarabench": ["MedAraBench", "Medical Arabic"],
    "bimedix_eval": ["BiMediX", "BiMediX-bench", "BiMediX Eval"],
    "medriskeval": ["MedRiskEval", "Medical Risk Eval"],
    "igakuqa": ["IgakuQA", "Japanese Medical Licensing"],
    "jmedbench": ["JMedBench", "Japanese Medical"],
    "jmed_lora_eval": ["JMedLoRA"],
    "neet_pg": ["NEET-PG", "NEET PG", "Indian Medical PG"],
    "indic_med_bench": ["Indic Medical", "AI4Bharat", "Indic Bench"],
    "cmexam_cn": ["CMExam", "Chinese Medical Licensing"],
    "promedqa_cn": ["PromedQA", "Chinese Professional Medicine"],
    "delphi_disease_risk": ["UK Biobank", "Delphi", "1000 disease risk"],
    "biomistral_multilingual": ["BioMistral"],
    "owkin_path_avg": ["TCGA", "Owkin", "TCGA-LGG Radiogenomics"],
    "openai_healthbench_hard": ["HealthBench", "HealthBench Hard"],
    "medbullets": ["MedBullets-5op", "MedBullets"],
    "nejm_image": ["NEJM Image Challenge", "NEJM"],
    "jama_clin_chal": ["JAMA Clinical Challenge", "JAMA"],
    "rexrank_radgraph_f1": ["RadGraph", "RadGraph2", "ReXrank"],
    "rexrank_bertscore": ["ReXrank", "MIMIC-CXR"],
    "rexrank_radcliq": ["ReXrank"],
    "rexrank_green": ["ReXrank"],
    "rexrank_finerad": ["ReXrank"],
    "rexgrad_acc": ["ReXrank", "ReXGradient"],
    "chexpert_f1": ["CheXpert", "CheXpert Plus"],
    "chexpert_plus": ["CheXpert Plus", "CheXpert"],
    "retbench_auc": ["RetBench"],
    "path_bench": ["TCGA", "TCGA-Reports"],
    "kmle": ["KMLE", "Korean Medical Licensing"],
    "kmle_2025": ["KMLE", "Korean Medical Licensing"],
    "kormedlawqa": ["KorMedLawQA", "Korean Medical Law"],
    "ehrqa": ["EHRQA", "DrugEHRQA"],
    "rad_chestct": ["RAD-ChestCT", "Chest CT"],
    "alphafold3_pae": ["AlphaFold", "AlphaFold3"],
    "pdbbind_rmsd": ["PDBBind", "Boltz", "Chai-1"],
    "absci_yield": ["Absci", "de novo Antibody"],
    "med_internvl_avg": ["MedDr", "InternVL"],
    "patientsafebench": ["PatientSafetyBench", "PatientSafeBench"],
    "lits_3d": ["LiTS", "Liver Tumor Segmentation"],
    "promise12": ["PROMISE12", "Prostate MRI"],
    "isles_2024": ["ISLES 2022", "ISLES"],
    "msd_decathlon": ["Medical Segmentation Decathlon", "MSD"],
    "brats_2023": ["BraTS 2023", "BraTS"],
    "isic_2020": ["ISIC 2020", "SIIM-ISIC"],
    "siim_acr_pneumothorax": ["SIIM", "SIIM-ISIC", "ISIC 2020"],
    "hyper_kvasir": ["Hyper-Kvasir"],
    "padchest_gr": ["PadChest-GR", "PadChest"],
    "pharmkg": ["PharmKG"],
    "roco_v2": ["ROCO v2", "ROCO"],
    "rsna_pneumonia": ["RSNA Pneumonia"],
    "rsna_brain_hemorrhage": ["RSNA Intracranial", "RSNA Hemorrhage"],
    "tcga_reports": ["TCGA-Reports", "TCGA"],
    "vindr_cxr": ["VinDr-CXR", "VinDr"],
    "ruijin_pd": ["Ruijin", "Parkinson"],
    "vqamed_2024": ["VQA-Med", "VQAMed"],
    "panderm_skin": ["PanDerm"],
    "echonet_lvef_mae": ["EchoNet"],
    "echonet_lvef_auc50": ["EchoNet"],
    "echobench_med": ["EchoBench"],
    "dermabench": ["DermaBench"],
    "dermavqa_das": ["DermaVQA-DAS", "DermaVQA"],
    "histai_wsi": ["HISTAI"],
    "beetle_seg": ["BEETLE"],
    "spider_path": ["SPIDER"],
    "medmnist_v2": ["MedMNIST v2", "MedMNIST"],
    "ehrnoteqa": ["EHRNoteQA"],
    "ham10000": ["HAM10000"],
    "drive_retinal": ["DRIVE", "Retinal Vessel"],
    "ddsm_mammo": ["DDSM", "Mammography"],
    "stoic_2021": ["STOIC", "COVID-19 CT"],
    "fets_2_brats": ["FeTS", "Federated Tumor Segmentation"],
    "fets_2024_aggregation": ["FeTS"],
    "ailuminate_med": ["AILuminate"],
    "vista3d_organs": ["VISTA3D", "VISTA-3D"],
    "ct_3d_seg_avg": ["3D CT", "Volumetric"],
    "sam3_pcs_image": ["SAM 3", "SAM3"],
    "sam3_pcs_video": ["SAM 3", "SAM3"],
    "medsam3_2d_avg": ["MedSAM 3", "MedSAM3"],
    "sa_co": ["SA-Co", "Segment Anything Concepts"],
    "ph_llm_sleep": ["PH-LLM", "Personal Health"],
    "ph_llm_fitness": ["PH-LLM", "Personal Health"],
    "timesfm_eval": ["TimesFM"],
    "gift_eval_ts": ["GIFT-Eval", "GIFT Eval"],
    "lsm2_health_classify": ["LSM-2", "LSM2"],
    "lsm2_bmi_regression": ["LSM-2"],
    "lsm2_imputation": ["LSM-2"],
    "apple_wearable_57": ["Apple Wearable", "Beyond Sensor"],
    "wearable_cvd_hiv": ["Wearable", "CVD"],
    "wearable_jepa_bp": ["JEPA", "Wearable"],
    "wearable_movement_mental": ["Wearable Movement"],
    "mlcommons_medperf": ["MedPerf", "MLCommons"],
    "mlperf_inference_med": ["MLPerf"],
    "agentclinic_medqa": ["AgentClinic", "AgentClinic-MedQA"],
    "agentclinic_nejm": ["AgentClinic", "AgentClinic-NEJM"],
    "medjourney_cn": ["MedJourney"],
    "longhealth": ["LongHealth"],
    "medcalc_bench": ["MedCalc-Bench", "MedCalc"],
    "medrag_bench": ["MedRAG"],
    "live_dr_bench": ["LiveDRBench"],
    "toxicchat_med": ["ToxicChat"],
    "climedbench_cn": ["CliMedBench"],
    "multimed": ["MultiMed", "MultiMedBench"],
    "openi_iu": ["OpenI", "Indiana"],
    "meddialog": ["MedDialog"],
    "meddialog_rubrics": ["MedDialogRubrics"],
    "medrepbench": ["MedRepBench"],
    "pathmcqa": ["PathMCQA"],
    "ukbob": ["UKBOB", "UK Biobank Body Organs"],
    "open_medical_llm_avg": ["Open Medical-LLM Leaderboard", "Open Medical-LLM", "Open Medical LLM"],
    "polaris_safety": ["Polaris", "Hippocratic"],
    "csedb_safety": ["CSEDB"],
    "csedb_effectiveness": ["CSEDB"],
    "medic_eval": ["MEDIC", "Medical Segmentation Decathlon"],
    "meds_bench": ["MedS-Bench"],
    "mmedbench": ["MMedBench"],
    "medbench_cn": ["MedBench v4", "CliMedBench", "MMedBench"],
    "amega": ["AMEGA"],
    "blue_benchmark": ["BLUE"],
    "med_halt": ["Med-HALT", "MedHalt"],
    "medhallu": ["MedHallu"],
    "medhelm": ["MedHELM"],
    "medxpertqa": ["MedXpertQA"],
    "medxpertqa_text": ["MedXpertQA"],
    "medxpertqa_mm": ["MedXpertQA"],
    "vct_virology": ["Virology Capabilities Test", "VCT", "Long-form Virology"],
    "wmdp_bio": ["WMDP", "WMDP-Bio"],
    "wmdp_chem": ["WMDP", "WMDP-Chem"],
    "biolp_bench": ["BioLP-bench", "BioLP"],
    "casp16_gdt": ["CASP", "CASP15"],
    "moleculenet_avg": ["MoleculeNet"],
    "tdc_admet": ["TDC", "Therapeutics Data Commons", "ADMET"],
    "vqa_rad": ["VQA-RAD"],
    "slake_vqa": ["SLAKE"],
    "path_vqa": ["PathVQA", "Path-VQA"],
    "medqa_usmle": ["MedQA"],
    "medqa_4opt": ["MedQA"],
    "afrimed_qa_mcq": ["AfriMed-QA"],
    "afrimed_qa_saq": ["AfriMed-QA"],
    "medqa_vals_ai": ["MedQA"],
    "med80_avg": ["Medical Segmentation"],
    "medbench": ["MedBench v4", "MedBench"],
    "med_seg": ["Medical Segmentation"],
    "structured_radiology_2025": ["Structured Radiology", "Radiology Report"],
    "cxr_lt_2024": ["CXR-LT", "CXR Long-Tailed"],
    "ms_cxr": ["MS-CXR"],
    "chest_imagenome": ["Chest ImaGenome"],
    "mca_rg_miccai25": ["MCA-RG", "Medical Concept Alignment"],
    "cxpmrg_bench": ["CXPMRG", "CheXpert Plus"],
    "nclex_rn": ["NCLEX", "Nursing Licensure"],
    "nclex_cn_translated": ["NCLEX"],
    "cn_nursing_licensing": ["Chinese Nursing", "Nursing Licensure"],
    "nurse_mcq_618": ["Nursing", "NCLEX"],
    "nurse_education_eval": ["Nursing Education", "Nursing"],
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
    bmt_alpha: dict[str, list[dict]] = {}
    for e in bmt:
        key = norm(e.get("title", ""))
        bmt_index.setdefault(key, []).append(e)
        lk = loose_norm(e.get("title", ""))
        if lk:
            bmt_loose.setdefault(lk, []).append(e)
        ak = alpha_only(e.get("title", ""))
        if ak:
            bmt_alpha.setdefault(ak, []).append(e)
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
                ak2 = alpha_only(part)
                if ak2:
                    bmt_alpha.setdefault(ak2, []).append(e)
        # Index split title at colons / dashes (e.g., "FeTS: Federated Tumor Segmentation")
        first_word = re.split(r"[:\-]", e.get("title", ""), maxsplit=1)[0].strip()
        if first_word and first_word != e.get("title"):
            for keyfn, idx in ((norm, bmt_index), (loose_norm, bmt_loose), (alpha_only, bmt_alpha)):
                k3 = keyfn(first_word)
                if k3:
                    idx.setdefault(k3, []).append(e)

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
        # Alpha-only fallback (strongest fuzzy match)
        if not hit:
            alpha_cands = [alpha_only(bname), alpha_only(re.sub(r"\([^)]*\)", "", bname))]
            for alias in ALIASES.get(bid, []):
                alpha_cands.append(alpha_only(alias))
            alpha_cands = [c for c in alpha_cands if c and len(c) >= 4]
            for k in alpha_cands:
                if k in bmt_alpha:
                    hit = bmt_alpha[k][0]
                    break
        # Substring fallback — keyword-in-title match for short distinctive aliases
        if not hit:
            sub_cands = []
            for alias in ALIASES.get(bid, []):
                a = alpha_only(alias)
                if a and len(a) >= 5:
                    sub_cands.append(a)
            for sub in sub_cands:
                # Find any BMT title whose alpha-form CONTAINS this token
                for k, entries in bmt_alpha.items():
                    if sub in k:
                        hit = entries[0]
                        break
                if hit:
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
