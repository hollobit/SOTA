"""Tag non-foundation-model entries with a `scale_class` enrichment field.

Categories applied (curated from 1093-model audit):
  agent-system        — multi-agent system, no single weight checkpoint (AI Co-Scientist, ChemCrow)
  simulator-tool      — differentiable simulator / SDK / library (TORAX, PhysicsNeMo)
  dataset             — primarily a dataset+baselines, not a single FM
  benchmark-baseline  — evaluation reference baseline, not a comparable model
  product-wrapper     — SaaS product over a closed underlying LLM (Khanmigo, Harvey)
  classical-ml        — sub-100M parametric specialty network (M3GNet, NequIP, MACE, CHGNet, ChemBERTa, classical BERT family)
  classical-bert      — pre-LLM-era BERT-style biomedical encoder (BiomedCLIP, BioBERT, ClinicalBERT, PubMedBERT, BlueBERT)
  narrow-encoder      — task-specific vision/medical encoder, generally <2B (CONCH, RAD-DINO, CXR-Foundation, EchoCLIP)
  narrow-segmentation — segmentation-only (MedSAM, SAM-Med2D/3D, SegVol)
  narrow-task         — narrow analytical task (EQTransformer, PhaseNet, DUSt3R, Marigold)
  narrow-timeseries   — time-series only (TimesFM, Chronos, Lag-Llama, Moirai, MOMENT)
  narrow-tabular      — tabular only (TabPFN)
  narrow-tts          — text-to-speech specialist (Kokoro, Spark-TTS, CosyVoice)
  audio-codec         — audio codec (Mimi)
  robotics-policy     — manipulation policy <100M (Octo-base) or sub-FM
  wavefunction-net    — variational quantum-chem ansatz (FermiNet, PauliNet, Psiformer)
  dft-functional      — neural DFT XC functional (DM21, NeuralXC)
  small-mlp-potential — tiny chem MLP potential (ANI-1ccx, ANI-2x, AIMNet2)
  qec-decoder         — quantum error-correction decoder
  rl-search-system    — RL search method (FunSearch, AlphaChip)
  symbolic-regression — symbolic discovery method (AI Feynman)
  analysis-pipeline   — physics analysis pipeline, not a model (CERN ATLAS/CMS anomaly)
  hydrology-lstm      — LSTM-based hydrology
  roadmap             — placeholder/roadmap, not an actual model
  human-baseline      — human-performance reference

Entries not in this map default to `frontier-llm` / `large-fm` implicitly (no badge).
"""
import sys
import yaml
from pathlib import Path

ENR = "config/model_enrichment.yaml"

CLASSIFICATIONS = {
    # ===== Agent systems (no single model weight) =====
    "google/ai-co-scientist": "agent-system",
    "deepmind-doe/genesis-ai-co-scientist-deployment": "agent-system",
    "sakana/ai-scientist-v1": "agent-system",
    "sakana/ai-scientist-v2": "agent-system",
    "sakana/darwin-godel-machine": "agent-system",
    "futurehouse/paperqa2-crow": "agent-system",
    "futurehouse/falcon-research": "agent-system",
    "futurehouse/owl": "agent-system",
    "futurehouse/phoenix-chemistry": "agent-system",
    "stanford/virtual-lab": "agent-system",
    "rochester-epfl/chemcrow": "agent-system",
    "cmu/coscientist": "agent-system",
    "argonne/protein-design-fm": "agent-system",

    # ===== Simulators / SDKs / libraries =====
    "deepmind/torax": "simulator-tool",
    "deepmind-cfs/torax-cfs": "simulator-tool",
    "nvidia/physicsnemo": "simulator-tool",

    # ===== Datasets / benchmark suites =====
    "polymathic/multimodal-universe": "dataset",
    "simons-flatiron/camels": "dataset",
    "polymathic/the-well": "dataset",
    "polymathic/multiple-physics": "dataset",
    "proxima-fusion/constellaration": "dataset",
    "academic/multimodal-universe": "dataset",

    # ===== Benchmark baselines / human ref =====
    "stanford/chexpert-baseline": "benchmark-baseline",
    "mit/mimic-cxr-baseline": "benchmark-baseline",
    "yale/medic-eval-baseline": "benchmark-baseline",
    "google/afrimed-qa-baseline": "benchmark-baseline",
    "mlcommons/medperf-fets-baseline": "benchmark-baseline",
    "mlcommons/gandlf-workflow": "benchmark-baseline",
    "mlcommons/nnunet-fets-consensus": "benchmark-baseline",
    "mit-mediallab/medhallu-detector": "benchmark-baseline",
    "ucsd/medhallbench-judge": "benchmark-baseline",
    "baseline/physician": "human-baseline",

    # ===== Product wrappers (SaaS over closed LLM) =====
    "khan-academy-openai/khanmigo": "product-wrapper",
    "harvey/protege": "product-wrapper",
    "harvey/harvey-assistant": "product-wrapper",
    "thomson-reuters/cocounsel-2": "product-wrapper",
    "thomson-reuters/cocounsel-legal": "product-wrapper",
    "vlex/vincent-ai": "product-wrapper",
    "vecflow/oliver": "product-wrapper",
    "lbox/lbox-caselaw": "product-wrapper",
    "riiid/riiid-tutor": "product-wrapper",
    "landing-ai/visionagent": "product-wrapper",
    "synthesia/synthesia-vlm": "product-wrapper",
    "wayve/lingo-2": "product-wrapper",
    "runway/gen-3": "product-wrapper",  # service
    "runway/gen-4": "product-wrapper",
    "runway/gen-4.5": "product-wrapper",
    "luma/ray-2": "product-wrapper",
    "pikalabs/pika-2.2": "product-wrapper",
    "kuaishou/kling-2.0": "product-wrapper",
    "kuaishou/kling-2.5-turbo": "product-wrapper",
    "kuaishou/kling-2.6": "product-wrapper",

    # ===== Classical-ML (sub-100M parametric universal interatomic potentials) =====
    "ucsd/m3gnet": "classical-ml",
    "harvard/nequip": "classical-ml",
    "berkeley/chgnet": "classical-ml",
    "cambridge/mace-mp-0": "classical-ml",
    "deepmodeling/dpa-2": "classical-ml",
    "orbital-materials/orb-v1": "classical-ml",
    "orbital-materials/orb-v2": "classical-ml",
    "orbital-materials/orb-v3": "classical-ml",
    "orbital-materials/alchemi-torchsim-2026": "classical-ml",
    "meta/equiformer-v2": "classical-ml",
    "meta/uma-omat24": "classical-ml",
    "meta/uma-omol25": "classical-ml",
    "deepchem/chemberta-2": "classical-ml",
    "deepchem/chemberta-3": "classical-ml",
    "molecularai/chemformer": "classical-ml",
    "mit/chemgpt-1.2b": "classical-ml",  # smallish
    "ncfrey/chemgpt-1.2b": "classical-ml",
    "dptech/uni-mol-v2": "classical-ml",

    # ===== Classical-BERT biomedical encoders =====
    "microsoft/biomedclip": "classical-bert",
    "microsoft/biogpt-large": "classical-bert",
    "microsoft/pubmedbert": "classical-bert",
    "stanford-emily/clinicalbert": "classical-bert",
    "ncbi-nlm/biobert-large": "classical-bert",
    "ncbi-nlm/bluebert-large": "classical-bert",
    "stanford/clinical-modernbert": "classical-bert",
    "stanford/clinical-pred-bert": "classical-bert",
    "ufl-nvidia/gatortron-large": "classical-bert",
    "tum/medbert-de-large": "classical-bert",

    # ===== Narrow encoders (task-specific vision/medical) =====
    "mahmoodlab/conch": "narrow-encoder",
    "mahmoodlab/uni2": "narrow-encoder",
    "mahmoodlab/titan": "narrow-encoder",
    "mahmoodlab/pathchat": "narrow-encoder",
    "paige-ai/virchow2": "narrow-encoder",
    "paige-ai/virchow2g": "narrow-encoder",
    "microsoft/prov-gigapath": "narrow-encoder",
    "microsoft/rad-dino": "narrow-encoder",
    "microsoft/cxr-foundation": "narrow-encoder",
    "microsoft/medimageinsight": "narrow-encoder",
    "google/derm-foundation": "narrow-encoder",
    "moorfields/retfound": "narrow-encoder",
    "moorfields-deepmind/retfound-2": "narrow-encoder",
    "rad-onc/cxr-pro": "narrow-encoder",
    "rad-onc/cheXagent-8b": "narrow-encoder",
    "echonet/echoclip": "narrow-encoder",
    "echonet/echofm": "narrow-encoder",
    "echonet/echo-vision-fm": "narrow-encoder",
    "shanghai-ai-lab/visionfm": "narrow-encoder",
    "smartlab/meddr-internvl-40b": "narrow-encoder",
    "biomed-ai/sat-pro": "narrow-encoder",
    "biomed-ai/segvol": "narrow-segmentation",
    "monai/vista3d": "narrow-segmentation",
    "z-imaging/nninteractive": "narrow-segmentation",
    "valence-labs/recursion-phenomml": "narrow-encoder",
    "recursion/phenom-beta": "narrow-encoder",

    # ===== Segmentation-only =====
    "bowang-lab/medsam": "narrow-segmentation",
    "bowang-lab/medsam-2": "narrow-segmentation",
    "openmedlab/sam-med2d": "narrow-segmentation",
    "openmedlab/sam-med3d": "narrow-segmentation",
    "openmedlab/sam-med3d-turbo": "narrow-segmentation",
    "joey-liu/medsam-3": "narrow-segmentation",
    "joey-liu/medsam-3-agent": "narrow-segmentation",
    "meta/sam-1-vit-h": "narrow-segmentation",
    "meta/sam-2.1-large": "narrow-segmentation",
    "meta/sam-3": "narrow-segmentation",
    "meta/sam-3.1": "narrow-segmentation",
    "meta/sam-3d": "narrow-segmentation",

    # ===== Narrow specialty tasks =====
    "stanford/eqtransformer": "narrow-task",
    "stanford/phasenet": "narrow-task",
    "ustc/seisclip": "narrow-task",
    "tsinghua/seismic-foundation": "narrow-task",
    "academic/gem-3d-seismic": "narrow-task",
    "tiktok/depth-anything-v2-large": "narrow-task",
    "google/depth-anything-v2": "narrow-task",
    "ethz/marigold-depth-v1.1": "narrow-task",
    "naver/dust3r": "narrow-task",
    "naver/mast3r": "narrow-task",
    "meta/vggt": "narrow-task",

    # ===== Time-series specialists =====
    "google/timesfm-1-200m": "narrow-timeseries",
    "google/timesfm-1.0-200m": "narrow-timeseries",
    "google/timesfm-2.5": "narrow-timeseries",
    "google/timesfm-2.5-200m": "narrow-timeseries",
    "amazon/chronos-t5-large": "narrow-timeseries",
    "amazon/chronos-bolt-base": "narrow-timeseries",
    "amazon/chronos-2": "narrow-timeseries",
    "servicenow/lag-llama": "narrow-timeseries",
    "salesforce/moirai-1.0-r-large": "narrow-timeseries",
    "cmu/moment-1-large": "narrow-timeseries",
    "community/solar-transformer": "narrow-timeseries",

    # ===== Tabular specialists =====
    "prior-labs/tabpfn-v2": "narrow-tabular",
    "prior-labs/tabpfn-2.5": "narrow-tabular",

    # ===== TTS specialists =====
    "hexgrad/kokoro-82m": "narrow-tts",
    "mobvoi/spark-tts-0.5b": "narrow-tts",
    "alibaba/cosyvoice2-0.5b": "narrow-tts",
    "alibaba/cosyvoice3-0.5b": "narrow-tts",
    "2noise/chattts": "narrow-tts",
    "swivid/f5-tts": "narrow-tts",
    "stepfun/step-audio-tts-3b": "narrow-tts",

    # ===== Audio codecs =====
    "kyutai/mimi": "audio-codec",

    # ===== Robotics policies (sub-FM) =====
    "octo/octo-base": "robotics-policy",
    "openvla/openvla-7b": "robotics-policy",
    "openvla/openvla-oft": "robotics-policy",
    "physical-intelligence/pi-zero": "robotics-policy",
    "physical-intelligence/pi-zero-fast": "robotics-policy",
    "physical-intelligence/pi-0.5": "robotics-policy",
    "physical-intelligence/rdt-1b": "robotics-policy",

    # ===== Quantum-chem wavefunction networks =====
    "deepmind/ferminet": "wavefunction-net",
    "fu-berlin/paulinet": "wavefunction-net",
    "deepmind/psiformer": "wavefunction-net",

    # ===== Neural DFT functionals =====
    "deepmind/dm21-functional": "dft-functional",
    "princeton/neuralxc": "dft-functional",
    "caltech/orbnet": "dft-functional",
    "entos/orbnet-denali": "dft-functional",

    # ===== Tiny molecular potentials =====
    "ufl/ani-1ccx": "small-mlp-potential",
    "ufl/ani-2x": "small-mlp-potential",
    "cmu/aimnet2": "small-mlp-potential",

    # ===== Quantum error correction decoders =====
    "deepmind/alphaqubit": "qec-decoder",
    "google-quantum/alphaqubit-willow": "qec-decoder",

    # ===== RL search / discovery systems =====
    "deepmind/funsearch": "rl-search-system",
    "deepmind/alphachip-2026": "rl-search-system",
    "deepmind/gnome": "rl-search-system",
    "lbnl/a-lab": "agent-system",
    "robochem/robochem": "agent-system",

    # ===== Symbolic regression =====
    "mit/ai-feynman": "symbolic-regression",

    # ===== Particle physics analysis =====
    "atlas-cern/anomaly-detection": "analysis-pipeline",
    "cms-cern/anomaly-tn": "analysis-pipeline",
    "fermilab/genesis-fermi-2026": "analysis-pipeline",
    "darpa/aixcc-team-atlanta": "analysis-pipeline",

    # ===== Hydrology =====
    "google-jku/neuralhydrology": "hydrology-lstm",
    "google/caravan": "hydrology-lstm",
    "google/fine-flood-fm": "hydrology-lstm",

    # ===== Specific protein design (smallish) =====
    "baker/rfdiffusion": "narrow-task",
    "baker/rfdiffusion-aa": "narrow-task",
    "baker/rosettafold-aa": "narrow-task",
    "ipd/rosettafold-3": "narrow-task",
    "deepmind/alphafold-2": "narrow-task",
    "deepmind/alphafold-3": "narrow-task",
    "deepmind/alphafold-server": "product-wrapper",
    "deepmind/alphamissense": "narrow-task",
    "deepmind/alphagenome": "narrow-task",
    "boltz-ai/boltz-1": "narrow-task",
    "boltz-ai/boltz-2": "narrow-task",
    "mit-jameel/boltz-1": "narrow-task",
    "mit-jameel/boltz-2": "narrow-task",
    "mit/boltzgen-1": "narrow-task",
    "chai/chai-1": "narrow-task",
    "chai-discovery/chai-1": "narrow-task",
    "chai/chai-2": "narrow-task",

    # ===== Roadmaps / placeholders =====
    "bharatgen/param-1t-roadmap": "roadmap",
    "bharatgen/param2-sutra": "roadmap",
    "soketai/eka-roadmap": "roadmap",

    # ===== Stable Diffusion / FLUX / image-only =====
    "stabilityai/sd-3.5-large": "narrow-task",
    "stabilityai/sv4d2.0": "narrow-task",
    "stabilityai/stable-code-3b": "classical-ml",
    "stabilityai/stable-lm-zephyr-3b": "classical-ml",
    "stabilityai/stablelm-2-1.6b": "classical-ml",
    "black-forest-labs/flux.1-pro": "narrow-task",
    "black-forest-labs/flux.1-dev": "narrow-task",
    "black-forest-labs/flux.1-schnell": "narrow-task",
    "black-forest-labs/flux.1-kontext-pro": "narrow-task",
    "black-forest-labs/flux.1-kontext-dev": "narrow-task",
    "tencent/hunyuan3d-2": "narrow-task",
    "tencent/hunyuan3d-2.1": "narrow-task",
    "microsoft/trellis-image-large": "narrow-task",
    "microsoft/trellis-2-4b": "narrow-task",
}


def main():
    apply_changes = "--apply" in sys.argv
    with open(ENR) as f:
        enr = yaml.safe_load(f)
    if enr.get("models") is None:
        enr["models"] = {}

    touched = 0
    for mid, scale_class in CLASSIFICATIONS.items():
        existing = enr["models"].get(mid) or {}
        if existing.get("scale_class") != scale_class:
            existing["scale_class"] = scale_class
            enr["models"][mid] = existing
            touched += 1

    print(f"Tagged {touched} entries with scale_class.")
    print()
    from collections import Counter
    counts = Counter(CLASSIFICATIONS.values())
    print("Classification distribution:")
    for k, n in counts.most_common():
        print(f"  {k:<22} {n}")
    print(f"\nTotal classifications: {sum(counts.values())}")

    if apply_changes:
        with open(ENR, "w") as f:
            yaml.safe_dump(enr, f, sort_keys=False, allow_unicode=True, default_flow_style=False)
        print("Written to enrichment YAML.")
    else:
        print("\nPass --apply to commit.")


if __name__ == "__main__":
    main()
