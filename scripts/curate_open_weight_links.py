"""Curate model type classifications and enrichment links.

Two-pass cleanup:
1. Reclassify entries that are NOT actually open-weight/source (commercial APIs,
   roadmap entries, vertical SaaS, etc.) → 'proprietary'
2. Add HF/GitHub links to genuinely-open models missing them in enrichment.

Conservative: only acts on entries with strong evidence either way.
"""
import sqlite3
import sys
import yaml
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

DB_PATH = "data/benchmark.db"

# Models that should be PROPRIETARY despite being marked open-* — verified
# via vendor docs, no public weights/source.
RECLASSIFY_TO_PROPRIETARY = {
    # Commercial-only Chinese services / API
    "mimo/mimo-v2-pro": "MiMo Pro is API-only, no weights released",
    "mimo/mimo-v2-flash": "MiMo Flash API-only",
    "xiaomi/mimo-v2.5": "Xiaomi MiMo 2.5 API-only",
    "minimax/m2.7": "MiniMax M2.7 API-only",
    "stepfun/step-2-mini": "StepFun API-only",
    "stepfun/step-2-pro": "StepFun API-only",
    "stepfun/step-3.5-flash": "StepFun API-only",
    "tencent/hunyuan-turbo": "Hunyuan Turbo API-only",
    "tencent/hunyuan-t1": "Hunyuan T1 API-only",
    "tencent/hy-world-2.0": "Tencent HunyuanWorld API-only",
    "tencent/hunyuan-hy3-preview": "Hunyuan HY3 preview API-only",
    "alibaba/qwen3.6-max-preview": "Qwen3.6-Max API-only preview",
    "zhipu/glm-5v-turbo": "GLM-5V Turbo API-only",
    "zhipu/cogvideox-i2v": "CogVideoX I2V variant — only base CogVideoX-5B is open",
    "iflytek/spark-x1": "iFlytek Spark X1 API-only",
    "iflytek/spark-4": "iFlytek API-only",
    "iflytek/spark-4-ultra": "iFlytek API-only",
    "iflytek/antelope-3.0": "iFlytek API-only",
    "sensetime/sensechat-5": "SenseChat API-only",
    "sensetime/sensenova": "SenseNova API-only",
    "sensetime/sensenova-v6": "SenseNova v6 API-only",
    "huawei/pangu-5": "Huawei Pangu 5 API-only",
    "baichuan/baichuan-3": "Baichuan 3 API-only (only Baichuan-2 was open)",
    "baichuan/baichuan-4": "Baichuan 4 API-only",
    "baichuan/baichuan-m1-14b": "Baichuan M1 commercial",
    "baichuan/baichuan-omni-1.5": "Baichuan Omni commercial",
    "01-ai/yi-large": "Yi Large API-only",
    "01-ai/yi-lightning": "Yi Lightning API-only",
    "fnlp/moss-2": "MOSS-2 API-only after withdrawal",
    "ieit/yuan-2.0": "Yuan 2.0 commercial",

    # Russian commercial
    "sber/gigachat-1.5": "GigaChat 1.5 commercial API",
    "sber/gigachat-3-ultra": "GigaChat 3 Ultra API-only",
    "sber/gigachat-3-lightning": "GigaChat 3 Lightning API-only",

    # Korean commercial
    "kt/midm-1.0": "Mid-m 1.0 commercial",
    "kt/midm-k2.5-pro": "Mid-m K2.5 Pro commercial",
    "skt/ax-4.0": "SKT A.X commercial",
    "skt/ax-4.0-light": "SKT A.X Light commercial",
    "skt/ax-4.0-vl-light": "SKT A.X VL Light commercial",
    "naver/clova-x": "Naver Clova-X commercial",
    "naver/cue": "Naver Cue commercial",
    "naver/hyperclova-x": "HyperCLOVA-X base API-only",
    "naver/hyperclova-x-dash": "HyperCLOVA-X Dash API-only",
    "naver/hyperclova-x-hcx-003": "HyperCLOVA-X HCX-003 API-only",
    "samsung/gauss-2-balanced": "Galaxy AI Gauss 2 internal",
    "samsung/gauss-2-compact": "Galaxy AI Gauss 2 internal",
    "samsung/gauss-2-supreme": "Galaxy AI Gauss 2 internal",
    "ncsoft/varco-llm-1.0-52b": "VARCO 1.0 internal research",
    "ncsoft/varco-llm-13b": "VARCO 13B internal research",
    "konan/konan-llm-ent-11": "Konan LLM commercial",
    "konan/konan-llm-ond-4b": "Konan LLM commercial",

    # Roadmap / non-existent
    "bharatgen/param-1t-roadmap": "Roadmap entry, not a model",
    "bharatgen/param2-sutra": "Roadmap entry",
    "soketai/eka-roadmap": "Roadmap entry",
    "soketai/pragna-1b": "Soket AI internal",
    "soketai/sutra-light": "Soket AI internal",
    "soketai/sutra-pro": "Soket AI commercial",

    # India commercial
    "tata/maitri": "Tata Maitri commercial",
    "reliance/jiobrain": "Reliance JioBrain commercial",
    "lt-vyoma/sovereign-ai": "L&T Vyoma commercial",
    "corover/bharatgpt": "CoRover BharatGPT commercial",

    # Robotics commercial / no weights
    "1x/world-model": "1X internal",
    "tesla/optimus-vlm": "Tesla internal",
    "agility/digit-arc": "Agility internal",
    "apptronik/apollo-gemini": "Apollo+Gemini internal partnership",
    "sanctuary/carbon": "Sanctuary internal",
    "skild/skild-brain": "Skild internal",
    "covariant/rfm-1": "Covariant commercial",
    "figure-ai/helix": "Figure internal",

    # Verticals / SaaS
    "harvey/protege": "Harvey Protégé SaaS",
    "harvey/harvey-assistant": "Harvey commercial",
    "thomson-reuters/cocounsel-2": "CoCounsel commercial",
    "thomson-reuters/cocounsel-legal": "CoCounsel commercial",
    "vlex/vincent-ai": "Vincent AI commercial",
    "vecflow/oliver": "Vecflow Oliver commercial",
    "bloomberg/bloomberg-gpt": "Bloomberg internal (paper only)",
    "lbox/lbox-caselaw": "LBOX commercial",
    "riiid/riiid-tutor": "Riiid commercial",
    "landing-ai/visionagent": "Landing AI commercial",

    # Industrial AI verticals
    "siemens/sifm": "Siemens SIFM internal",
    "hitachi/hal": "Hitachi HAL internal",
    "ge-vernova/predix-ai": "Predix internal",
    "bosch/industrial-genai": "Bosch internal",
    "aveva/industrial-ai-assistant": "AVEVA commercial",
    "autodesk/bernini": "Autodesk Bernini research",
    "ptc/creo-copilot": "PTC commercial",
    "dassault/3dx-aura": "Dassault commercial",

    # Medical SaaS
    "lunit/lunit-insight-mmg": "Lunit commercial",
    "lunit/lunit-scope-pdl1": "Lunit commercial",
    "lunit/insight-mmg-v3": "Lunit commercial",
    "lunit/insight-cxr-v4": "Lunit commercial",
    "lunit/medscale-foundation-32b": "Lunit commercial",
    "vuno/med-deepcars": "VUNO commercial",
    "vuno/vuno-med-chest-xray": "VUNO commercial",
    "vuno/vuno-med-deepbrain": "VUNO commercial",
    "vuno/med-chest-x-detect": "VUNO commercial",
    "hippocratic-ai/polaris-1": "Hippocratic AI commercial",
    "hippocratic-ai/polaris-2": "Hippocratic AI commercial",
    "hippocratic-ai/polaris-3": "Hippocratic AI commercial",

    # Co-Scientists / proprietary research agents
    "google/ai-co-scientist": "Google internal Gemini-backed",
    "deepmind-doe/genesis-ai-co-scientist-deployment": "DOE deployment, internal",
    "deepmind/alphaproof": "DeepMind internal",
    "deepmind/alphageometry-2": "DeepMind paper-only",
    "deepmind/funsearch": "DeepMind paper-only",
    "deepmind/gemini-deepthink-imo": "Gemini internal IMO variant",
    "deepmind/gemini-3-deep-think": "Gemini internal",
    "openai/openai-imo-experimental": "OpenAI internal",
    "futurehouse/falcon-research": "FutureHouse SaaS",
    "futurehouse/owl": "FutureHouse SaaS",
    "futurehouse/phoenix-chemistry": "FutureHouse SaaS",
    "futurehouse/paperqa2-crow": "FutureHouse SaaS",
    "stanford/virtual-lab": "Paper-only",
    "lbnl/a-lab": "LBNL internal lab",
    "anl/auroragpt": "ANL internal",
    "khan-academy-openai/khanmigo": "Khanmigo SaaS product",

    # Climate / weather proprietary
    "deepmind/weathernext-2": "Google internal product",
    "deepmind/torax": "TORAX is open simulator (JAX library), but no model weights — paper+GitHub but conceptually a tool not weighted FM",
    "deepmind-cfs/torax-cfs": "Partnership announcement, no public weights",
    "deepmind/tcv-plasma-rl": "DeepMind paper-only",
    "deepmind/tcv-rampdown": "DeepMind paper-only",
    "kfe/diii-d-tearing-rl": "KFE DIII-D paper-only",
    "pppl/elm-suppression-ml": "PPPL paper-only",
    "cfs-pppl-ornl/heat-ml": "Lab partnership paper-only",
    "pppl/plasma-heating-surrogate": "PPPL paper-only",
    "msft-inl/nuclear-licensing-ai": "INL+Microsoft commercial",
    "inl-nvidia/prometheus": "INL+NVIDIA commercial",

    # Pharma / drug discovery commercial
    "recursion/phenom-beta": "Recursion BioNeMo commercial",
    "recursion/mole": "Recursion commercial",
    "isomorphic/iso-dde": "Isomorphic commercial drug-discovery engine",
    "isomorphic/iso-rx-v1": "Isomorphic commercial",
    "insilico/chemistry42": "Insilico commercial platform",
    "chai/chai-2": "Chai-2 commercial successor (Chai-1 is open)",

    # Particle/physics labs
    "atlas-cern/anomaly-detection": "ATLAS internal analysis",
    "cms-cern/anomaly-tn": "CMS internal analysis",
    "fermilab/genesis-fermi-2026": "Fermilab Genesis internal",
    "deepmind/alphachip-2026": "DeepMind chip-design internal",
    "deepmind/alphaqubit": "DeepMind quantum internal",
    "google-quantum/alphaqubit-willow": "Google Quantum internal",
    "deepmind/alphamissense": "DeepMind missense internal model",
    "deepmind/alphagenome": "DeepMind paper + open code (kept as open-weight, has GitHub)",
    "google-deepmind/genie-2": "DeepMind paper-only",
    "google-deepmind/genie-3": "DeepMind paper-only",
    "google-deepmind/gemini-robotics-er-1.5": "Google internal robotics",
    "google-deepmind/gemini-robotics-er-1.6": "Google internal robotics",

    # Other research-only / paper-only
    "argonne/protein-design-fm": "ANL internal (Aurora exascale)",
    "ornl/orbit": "ORNL paper-only",
    "ornl/orbit-2": "ORNL paper-only",
    "ornl/appl-foundation": "ORNL internal",
    "ornl/gpgp": "ORNL paper-only",
    "helmholtz/hclimrep": "Helmholtz consortium initiative",
    "ecmwf/aifs-1.1.0": "ECMWF AIFS 1.0 is open via HF; 1.1 is paper announcement",
    "ecmwf/aifs-compo": "ECMWF AIFS-COMPO paper-only as of submission",
    "ukaea-ibm/tokamind": "UKAEA+IBM blog announcement, no weights",
    "fudan/fuxi": "FuXi paper + GitHub but model weights gated",
    "shanghai-ai-lab/fengwu": "FengWu paper-only as of arxiv submission",
    "huawei/pangu-weather": "Pangu-Weather has GitHub with code; weights are published — KEEP open",
    "huawei/pangu-embedding": "Huawei internal",
    "huawei/pangu-ultra-moe": "Huawei internal",
    "ibm-lf/gridfm-v0.5": "IBM+LF Energy paper-only",
    "ibm/gridfm-architecture": "Paper only",
    "ibm-eth/gaia-power-dispatch": "Paper-only",
    "nrel/egridgpt": "NREL internal",
    "academic/energygpt-llama3.1-8b": "Academic paper-only",
    "academic/ef-llm": "Academic paper-only",
    "academic/powergraph-llm": "Academic paper-only",
    "academic/powerpm": "Academic paper-only",
    "academic/weather-fm-grid": "Academic paper-only",
    "academic/pbt-battery-transformer": "Academic paper-only",
    "tri/d3batt": "TRI commercial framework (Toyota)",
    "tri-mit-stanford/d3batt": "TRI commercial framework",
    "tri/polymer-electrolyte-gen": "TRI commercial",

    # Astronomy paper-only
    "berkeley/astrom3": "AstroM3 paper-only",
    "polymathic/multimodal-universe": "MultimodalUniverse is dataset+code, not a single model — keep open as it has HF dataset",  # actually keep
    "u-toronto/astronn-stars": "AstroNN paper-only",

    # Geosci paper-only
    "tsinghua/seismic-foundation": "Tsinghua paper-only",
    "academic/gem-3d-seismic": "Academic paper-only",

    # Atmospheric / hydrology paper-only
    "academic/zeeman-ml-ctm": "Academic paper-only",
    "eccc/ensai-emulator": "ECCC internal emulator",
    "academic/pcdc-net": "Academic paper-only",
    "google/fine-flood-fm": "Google internal flood FM",

    # Agriculture commercial / SaaS
    "academic/agrigpt": "Academic paper-only",
    "academic/agrigpt-vl": "Academic paper-only",
    "academic/ipm-agrigpt": "Academic paper-only",
    "academic/scplantllm": "Academic paper-only",
    "academic/pdllms": "Academic paper-only",
    "nasa-harvest/geocif": "NASA Harvest research",
    "nasa-harvest/arya": "NASA Harvest research",
    "nasa-harvest/vercye": "NASA Harvest research",
    "ai4bharat/airavata-medical": "Research paper only",

    # Misc paper-only or unclear
    "openi-cn/biancang-7b": "OpenI BianCang paper-only",
    "deepmind/alphafold-server": "AlphaFold Server is hosted SaaS, not weights",
    "hippocratic-ai/polaris-1": "Hippocratic commercial",
    "darpa/aixcc-team-atlanta": "Project, not a model — flag",
    "wonderworld/wonderworld": "WonderWorld paper, no weights",

    # Apple / commercial niche
    "apple/wearable-fm-behavioral": "Apple internal research",

    # Misc Chinese commercial
    "baidu/ernie-lite": "Baidu API",
    "baidu/ernie-speed": "Baidu API",
    "baidu/ernie-bot-3.5-medical": "Baidu medical API",
    "baidu/wenxin-yiyi-medical": "Baidu medical API",
    "tencent/hunyuan-7b": "Tencent Hunyuan-7B is a series — weights vary",  # keep open
    "tencent/medllm-2": "Tencent Yuanbao medical paper-only",

    # Russian commercial
    "yandex/yandexgpt-4-pro": "YandexGPT 4 Pro API",

    # Specialty research
    "snuh-naver/kmed-ai": "SNUH+Naver internal",
    "google/medgemma-1.5-4b": "MedGemma 1.5 4B research",
    "google/med-gemini-3-pro": "Google internal Med-Gemini 3 Pro",
    "google/med-gemini-l-2": "Google internal Med-Gemini 2",
    "google/medgemma-27b": "MedGemma 27B is open weight, on HF — KEEP open",
    "google/medgemma-9b": "KEEP open (HF)",

    # Research-only that flag as open but no public weights
    "msr-asia/tamgen-3b": "MSR Asia paper-only",
    "google/tx-llm": "Google internal Tx-LLM",
    "google/ph-llm": "Google internal PH-LLM",
    "google/ph-llm-2": "Google internal PH-LLM 2",
    "google/lsm-1": "Google internal LSM",
    "google/lsm-2": "Google internal LSM 2",
    "google/wearable-llm-agent": "Google internal",
    "google/derm-foundation": "Google internal",
    "google/afrimed-qa-baseline": "Google research",
    "google/medgemma-1.5-4b": "MedGemma 1.5 4B research preview",
    "deepmind/dolphin-clinical": "DeepMind internal clinical",
    "anthropic/claude-medical-eval": "Anthropic internal",
    "openai/openai-health-research": "OpenAI internal",

    # Astro speciality
    "polymathic/astroclip": "Open via HF — keep",  # keep
}

# Keys that should NOT actually be flipped (the dict above includes some I want to keep open)
KEEP_OPEN = {
    "huawei/pangu-weather",
    "polymathic/multimodal-universe",
    "polymathic/astroclip",
    "google/medgemma-27b",
    "google/medgemma-9b",
    "tencent/hunyuan-7b",
    "deepmind/alphagenome",
    "deepmind/torax",
}

# Add HF/GitHub links for genuinely-open models that lack them in enrichment.
# (model_id -> {huggingface, github, paper})
ADD_LINKS = {
    "microsoft/prov-gigapath": {
        "huggingface": "https://huggingface.co/prov-gigapath/prov-gigapath",
        "github": "https://github.com/prov-gigapath/prov-gigapath",
        "paper": "https://www.nature.com/articles/s41586-024-07441-w"
    },
    "microsoft/rad-dino": {
        "huggingface": "https://huggingface.co/microsoft/rad-dino",
        "paper": "https://arxiv.org/abs/2401.10815"
    },
    "microsoft/biomedclip": {
        "huggingface": "https://huggingface.co/microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224",
    },
    "microsoft/biogpt-large": {
        "huggingface": "https://huggingface.co/microsoft/biogpt-large",
    },
    "microsoft/llava-med": {
        "github": "https://github.com/microsoft/LLaVA-Med",
        "huggingface": "https://huggingface.co/microsoft/llava-med-v1.5-mistral-7b",
    },
    "microsoft/medimageinsight": {
        "github": "https://github.com/microsoft/medimageinsight",
    },
    "microsoft/healthgpt": {
        "github": "https://github.com/microsoft/healthgpt",
    },
    "microsoft/pubmedbert": {
        "huggingface": "https://huggingface.co/microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext",
    },
    "paige-ai/virchow2": {
        "huggingface": "https://huggingface.co/paige-ai/Virchow2",
    },
    "paige-ai/virchow2g": {
        "huggingface": "https://huggingface.co/paige-ai/Virchow2G",
    },
    "mahmoodlab/uni2": {
        "huggingface": "https://huggingface.co/MahmoodLab/UNI2-h",
    },
    "mahmoodlab/titan": {
        "huggingface": "https://huggingface.co/MahmoodLab/TITAN",
    },
    "mahmoodlab/conch": {
        "huggingface": "https://huggingface.co/MahmoodLab/CONCH",
    },
    "mahmoodlab/pathchat": {
        "huggingface": "https://huggingface.co/MahmoodLab/PathChat",
    },
    "openmeditron/meditron3-70b": {
        "huggingface": "https://huggingface.co/OpenMeditron/Meditron3-70B",
    },
    "openmeditron/meditron3-8b": {
        "huggingface": "https://huggingface.co/OpenMeditron/Meditron3-Llama3.1-8B",
    },
    "epfl/meditron-70b": {
        "huggingface": "https://huggingface.co/epfl-llm/meditron-70b",
        "github": "https://github.com/epfLLM/meditron",
    },
    "epfl/meditron-7b": {
        "huggingface": "https://huggingface.co/epfl-llm/meditron-7b",
        "github": "https://github.com/epfLLM/meditron",
    },
    "epfl/llama-3-meditron-70b": {
        "huggingface": "https://huggingface.co/OpenMeditron/Meditron3-70B",
    },
    "magic-ai4med/mmedlm-2-70b": {
        "huggingface": "https://huggingface.co/Henrychur/MMed-Llama-3-70B",
        "github": "https://github.com/MAGIC-AI4Med/MMedLM",
    },
    "magic-ai4med/mmedlm-2-7b": {
        "huggingface": "https://huggingface.co/Henrychur/MMedLM2-7B",
        "github": "https://github.com/MAGIC-AI4Med/MMedLM",
    },
    "magic-ai4med/mmedlm-2-1.8b": {
        "huggingface": "https://huggingface.co/Henrychur/MMedLM2-1_8B",
    },
    "hpai-bsc/aloe-beta-70b": {
        "huggingface": "https://huggingface.co/HPAI-BSC/Llama3.1-Aloe-Beta-70B",
    },
    "hpai-bsc/aloe-beta-8b": {
        "huggingface": "https://huggingface.co/HPAI-BSC/Llama3.1-Aloe-Beta-8B",
    },
    "freedomintelligence/apollo-medlm-7b": {
        "huggingface": "https://huggingface.co/FreedomIntelligence/Apollo-7B",
        "github": "https://github.com/FreedomIntelligence/Apollo",
    },
    "yale/me-llama-13b": {
        "huggingface": "https://huggingface.co/Yale-EHRs/Me-Llama-13B-instruct",
        "github": "https://github.com/BIDS-Xu-Lab/Me-LLaMA",
    },
    "yale/medic-eval-baseline": {
        "github": "https://github.com/IBM/medic-benchmark",
    },
    "shanghai-ai-lab/visionfm": {
        "huggingface": "https://huggingface.co/Hanky/VisionFM",
        "github": "https://github.com/ABILab-CUHK/VisionFM",
    },
    "shanghai-ai-lab/radfm": {
        "github": "https://github.com/chaoyi-wu/RadFM",
        "huggingface": "https://huggingface.co/chaoyi-wu/RadFM",
    },
    "stanford/chexzero": {
        "github": "https://github.com/rajpurkarlab/CheXzero",
    },
    "stanford/clinical-camel": {
        "huggingface": "https://huggingface.co/wanglab/ClinicalCamel-70B",
    },
    "stanford/biomedlm-2.7b": {
        "huggingface": "https://huggingface.co/stanford-crfm/BioMedLM",
    },
    "stanford/almanac-rag": {
        "github": "https://github.com/cyrilzakka/almanac-rag",
    },
    "stanford/cardio-wearable-fm": {
        "github": "https://github.com/StanfordBDHG/CardioWearableFM",
    },
    "stanford/clinical-modernbert": {
        "huggingface": "https://huggingface.co/Simonlee711/Clinical-ModernBERT",
    },
    "stanford/clinical-pred-bert": {
        "huggingface": "https://huggingface.co/emilyalsentzer/Bio_ClinicalBERT",
    },
    "stanford-emily/clinicalbert": {
        "huggingface": "https://huggingface.co/emilyalsentzer/Bio_ClinicalBERT",
    },
    "stanford/med-flamingo-9b": {
        "github": "https://github.com/snap-stanford/med-flamingo",
        "huggingface": "https://huggingface.co/med-flamingo/med-flamingo",
    },
    "ibm/granite-3.3-8b": {
        "huggingface": "https://huggingface.co/ibm-granite/granite-3.3-8b-instruct",
    },
    "ibm/granite-3.3-2b": {
        "huggingface": "https://huggingface.co/ibm-granite/granite-3.3-2b-instruct",
    },
    "ibm/granite-3.2-vision": {
        "huggingface": "https://huggingface.co/ibm-granite/granite-vision-3.2-2b",
    },
    "ibm/granite-3.1-8b": {
        "huggingface": "https://huggingface.co/ibm-granite/granite-3.1-8b-instruct",
    },
    "ibm/granite-34b-code-instruct": {
        "huggingface": "https://huggingface.co/ibm-granite/granite-34b-code-instruct-8k",
    },
    "ibm/molformer-1.1b": {
        "huggingface": "https://huggingface.co/ibm/MoLFormer-XL-both-10pct",
    },
    "ibm/gp-molformer-1.1b": {
        "github": "https://github.com/IBM/GP-MoLFormer",
    },
    "ncfrey/chemgpt-1.2b": {
        "huggingface": "https://huggingface.co/ncfrey/ChemGPT-1.2B",
    },
    "deepchem/chemberta-2": {
        "huggingface": "https://huggingface.co/DeepChem/ChemBERTa-77M-MTR",
        "github": "https://github.com/seyonechithrananda/bert-loves-chemistry",
    },
    "tii/falcon-h1-7b": {
        "huggingface": "https://huggingface.co/tiiuae/Falcon-H1-7B-Instruct",
    },
    "tii/falcon-h1-3b": {
        "huggingface": "https://huggingface.co/tiiuae/Falcon-H1-3B-Instruct",
    },
    "tii/falcon-h1-1.5b": {
        "huggingface": "https://huggingface.co/tiiuae/Falcon-H1-1.5B-Instruct",
    },
    "tii/falcon-h1-0.5b": {
        "huggingface": "https://huggingface.co/tiiuae/Falcon-H1-0.5B-Instruct",
    },
    "tii/falcon-mamba-7b": {
        "huggingface": "https://huggingface.co/tiiuae/falcon-mamba-7b",
    },
    "tii/falcon3-7b": {
        "huggingface": "https://huggingface.co/tiiuae/Falcon3-7B-Instruct",
    },
    "tii/falcon3-10b": {
        "huggingface": "https://huggingface.co/tiiuae/Falcon3-10B-Instruct",
    },
    "tii/falcon3-3b": {
        "huggingface": "https://huggingface.co/tiiuae/Falcon3-3B-Instruct",
    },
    "tii/falcon3-1b": {
        "huggingface": "https://huggingface.co/tiiuae/Falcon3-1B-Instruct",
    },
    "huawei/pangu-weather": {
        "github": "https://github.com/198808xc/Pangu-Weather",
    },
    "alibaba/qwen3.6-27b": {
        "huggingface": "https://huggingface.co/Qwen/Qwen3.6-27B",
    },
    "alibaba/qwen3.6-35b-a3b": {
        "huggingface": "https://huggingface.co/Qwen/Qwen3.6-35B-A3B",
    },
    "moonshot/kimi-k2-instruct": {
        "huggingface": "https://huggingface.co/moonshotai/Kimi-K2-Instruct",
        "github": "https://github.com/MoonshotAI/Kimi-K2",
    },
    "moonshot/kimi-k2.6": {
        "huggingface": "https://huggingface.co/moonshotai/Kimi-K2.6",
    },
    "deepseek/deepseek-v4-pro": {
        "huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro",
    },
    "deepseek/deepseek-v4-flash": {
        "huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash",
    },
    "alibaba/qwen3-coder": {
        "huggingface": "https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct",
    },
    "stability/stable-lm-zephyr-3b": {
        "huggingface": "https://huggingface.co/stabilityai/stablelm-zephyr-3b",
    },
    "deepmind/alphafold-2": {
        "github": "https://github.com/google-deepmind/alphafold",
    },
    "ufl/ani-1ccx": {
        "github": "https://github.com/isayev/ASE_ANI",
    },
    "ufl/ani-2x": {
        "github": "https://github.com/isayev/ASE_ANI",
    },
    "google-deepmind/genie-2": {
        "blog": "https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/",
    },
    "tencent/hunyuan-7b": {
        "huggingface": "https://huggingface.co/tencent/Hunyuan-7B-Instruct",
    },
    "tencent/hunyuan-large": {
        "huggingface": "https://huggingface.co/tencent/Tencent-Hunyuan-Large",
    },
    "polymathic/aion-1": {
        "huggingface": "https://huggingface.co/datasets/MultimodalUniverse/MultimodalUniverse",
    },
    "smith42/astropt-2.1b": {
        "huggingface": "https://huggingface.co/smith42/astropt",
        "github": "https://github.com/Smith42/astroPT",
    },
}


def main():
    conn = sqlite3.connect(DB_PATH)
    apply_changes = "--apply" in sys.argv
    flips = []
    for mid, reason in RECLASSIFY_TO_PROPRIETARY.items():
        if mid in KEEP_OPEN:
            continue
        cur = conn.execute("SELECT id, type FROM models WHERE id = ?", (mid,)).fetchone()
        if not cur:
            continue
        if cur[1] in ("open-weight", "open-weights", "open-source"):
            flips.append((mid, cur[1], reason))

    print(f"Reclassifications proposed: {len(flips)}")
    print()
    print("Direction breakdown:")
    print(f"  open-weight/open-source -> proprietary: {len(flips)}")
    print()
    if not apply_changes:
        print("Sample (first 25):")
        for mid, cur, r in flips[:25]:
            print(f"  {mid:<55} {cur:<13} -> proprietary  ({r[:50]})")
        print()
        print("Pass --apply to commit changes.")
        return

    for mid, _, _ in flips:
        conn.execute("UPDATE models SET type = 'proprietary' WHERE id = ?", (mid,))
    conn.commit()
    print(f"Applied {len(flips)} reclassifications.")

    # Add enrichment links for genuinely-open models
    enr_path = "config/model_enrichment.yaml"
    with open(enr_path) as f:
        enr = yaml.safe_load(f)
    if enr.get("models") is None:
        enr["models"] = {}
    added = 0
    for mid, links in ADD_LINKS.items():
        existing = enr["models"].get(mid) or {}
        existing_links = existing.get("links") or {}
        for k, v in links.items():
            if not existing_links.get(k):
                existing_links[k] = v
                added += 1
        existing["links"] = existing_links
        enr["models"][mid] = existing
    with open(enr_path, "w") as f:
        yaml.safe_dump(enr, f, sort_keys=False, allow_unicode=True, default_flow_style=False)
    print(f"Added {added} enrichment links across {len(ADD_LINKS)} models.")


if __name__ == "__main__":
    main()
