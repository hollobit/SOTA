"""Re-classify model `type` (proprietary / open-weight) using vendor + model_id patterns.

Background: load_benchmark_scores.py used `m.get("type", "proprietary")` as default,
combined with `INSERT OR REPLACE` in insert_model. Each new score batch that listed
a model without a `type` field overwrote the prior open-weight annotation with
"proprietary". After ~30 batches almost everything ended up proprietary.

Approach:
1. Per-model overrides (specific model_ids that defy vendor defaults)
2. Vendor defaults: HARD_PROPRIETARY (closed API only) vs OPEN_WEIGHT (releases on HF)
3. Pattern fallback for unmatched
"""
import re
import sqlite3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from cyber.db.connection import get_connection

DB_PATH = "data/benchmark.db"

# Vendors whose flagship models are API-only / proprietary by default
HARD_PROPRIETARY_VENDORS = {
    "OpenAI",  # GPT family (gpt-oss override below)
    "Anthropic",  # Claude family
    "Cohere",  # Command, Command-R
    "Google",  # Gemini family (Gemma override below)
    "Apple",
    "Tesla",
    "Reka",
    # Industrial AI verticals (no public weights)
    "Siemens", "Hitachi", "GE Vernova", "Bosch",
    "AVEVA (Schneider Electric)", "Autodesk", "PTC", "Dassault Systèmes",
    # Vertical SaaS
    "Harvey AI", "Thomson Reuters", "vLex", "Vecflow", "Bloomberg",
    "Landing AI", "Riiid", "LBOX", "Lunit", "VUNO",
    # Robotics commercial
    "Sanctuary AI", "Skild AI", "Covariant",
    # Indian commercial
    "Reliance Jio", "Tata Group", "L&T Semiconductor + Vyoma", "CoRover.ai",
    # Misc proprietary services
    "Snowflake", "Synthesia (UK)", "Wayve (UK)", "Runway",
    "Foxconn (Hon Hai Research)",  # FoxBrain not publicly weighted
    "Konan Technology",
    "AVEVA", "Hitachi", "Octo Consortium",  # research, not weights
    "OpenVLA Consortium",  # research weight checkpoints — handled per-model
    "Physical Intelligence",  # pi-zero is open weight, override below
}

# Vendors whose models are predominantly open-weight (HF releases)
OPEN_WEIGHT_VENDORS = {
    "Meta", "Mistral AI", "DeepSeek", "Alibaba", "Moonshot AI",
    "Microsoft",  # Phi family (override Copilot if any)
    "Allen AI (AI2)", "BigCode", "Stability AI (UK)", "Black Forest Labs (Germany)",
    "TII (UAE)", "MBZUAI (UAE)", "MBZUAI",
    "01.AI", "Baichuan", "Tencent", "Shanghai AI Lab",
    "BAAI (Beijing AI)", "OpenBMB (Tsinghua)", "Kunlun (Skywork)",
    "IEIT Yuan (Inspur)", "Fudan University", "InclusionAI (Ant Group)",
    "TNG Technology (Germany)", "Aleph Alpha (Germany)",
    "OpenLLM-France (CNRS)", "CroissantLLM (CNRS+Illuin)", "PleIAs (FR)",
    "AI21 Labs (Israel)",  # Jamba family open
    "DICTA (Israel Hebrew Center)",
    "AI4Bharat (IIT Madras)", "BharatGen (IIT Bombay TIH)", "BharatGen",
    "Sarvam AI", "Ola Krutrim", "Ola/ANI Tech",
    "Soket AI Labs",
    "AI Singapore", "GoTo + AI Singapore",
    "Sakana AI",
    "EleutherAI Korea + KOAT", "42dot (Hyundai-Kia)",
    "VikhrModels (Russia community)", "T-Bank (Russia)",
    "Hugging Face",  # SmolLM
    "huggingface",
    "BigCode",
    "AgiBot",
    "FreedomIntelligence", "EPFL + Yale",
    "Arcee AI",  # Trinity
    "OpenCoder",
}

# Per-vendor with mixed strategy: classify by model_id pattern
MIXED_VENDORS = {
    "Naver", "Naver Cloud", "LG AI Research", "Upstage", "KT", "KT (K-intelligence)",
    "SK Telecom", "NCSoft", "NCSoft (NC AI)", "Kakao", "Kakao Brain",
    "Trillion Labs", "Motif Technologies", "Saltlux", "Samsung Research",
    "Zhipu AI", "Baidu", "iFlytek (China)", "SenseTime", "Huawei",
    "ByteDance", "MiniMax", "StepFun", "Xiaomi", "Xiaomi (MiMo)", "MiMo",
    "Sber (Russia)", "Yandex (Russia)",
    "xAI",  # Grok 1 open, Grok 3+ proprietary
    "Google DeepMind",  # Gemini proprietary, Gemma open, Genie research
    "Google",
    "NVIDIA",  # Cosmos, GR00T, Nemotron all open weight; some commercial proprietary
    "IBM",  # Granite open
    "Apptronik + DeepMind", "1X Technologies", "Agility Robotics",
    "Figure AI",  # Helix research, no public weight
}

# Hard per-model overrides — explicit truth keyed by model_id
MODEL_TYPE_OVERRIDES = {
    # OpenAI proprietary except gpt-oss
    "openai/gpt-oss-120b": "open-weight",
    "openai/gpt-oss-20b": "open-weight",
    # xAI: Grok-1 open, Grok 3+ proprietary
    "xai/grok-1": "open-weight",
    # Google: Gemma open, Gemini proprietary
    # Robotics - Physical Intelligence releases pi-zero/0.5 weights
    "physical-intelligence/pi-zero": "open-weight",
    "physical-intelligence/pi-zero-fast": "open-weight",
    "physical-intelligence/pi-0.5": "open-weight",
    "physical-intelligence/rdt-1b": "open-weight",
    # OpenVLA research weights
    "openvla/openvla-7b": "open-weight",
    "openvla/openvla-oft": "open-weight",
    "octo/octo-base": "open-weight",
    # Black Forest: pro is API, dev/schnell/kontext-dev are open
    "black-forest-labs/flux.1-pro": "proprietary",
    "black-forest-labs/flux.1-kontext-pro": "proprietary",
    # Synthesia VLM is API
    # Wayve Lingo-2 research preview only
    # Runway gen-3 API only
    # NCSoft VARCO research disclosure — both proprietary except ncsoft/llama-varco-8b
    "ncsoft/llama-varco-8b": "open-weight",
    "ncsoft/varco-vision-2.0-14b": "open-weight",
}

# Pattern-based rules for MIXED_VENDORS and unknown vendors
# Applied to model_id (lowercased)
OPEN_PATTERNS = [
    # Korean sovereign open-weight families
    r"lg/exaone-",  # 3.x, 4.x, deep, atelier all open
    r"naver/hyperclova-x-seed",
    r"naver/hyperclova-seed-coder",
    r"naver/hyperclova-x-think",
    r"upstage/solar-10\.7b",
    r"upstage/solar-mini",
    r"upstage/solar-open-100b",
    r"kt/midm-2\.0",
    r"kakao/kanana",
    r"kakao/kogpt",
    r"trillionlabs/",
    r"motif/",
    r"saltlux/",
    r"42dot/",
    r"eleutherai/polyglot-ko",

    # Chinese sovereign open-weight
    r"alibaba/qwen",  # all Qwen
    r"alibaba/qvq",
    r"alibaba/qwq",
    r"deepseek/",
    r"moonshot/kimi",
    r"zhipu/glm-4\.5",
    r"zhipu/glm-4\.6",
    r"zhipu/glm-4\.7",
    r"zhipu/cogvideox",
    r"baichuan/baichuan-2",
    r"01-ai/yi-1\.5",
    r"01-ai/yi-coder",
    r"01-ai/yi-vl",
    r"tencent/hunyuan-large",
    r"tencent/hunyuan-7b",
    r"baidu/ernie-4\.5-300",  # 4.5-300b-a47b is open
    r"baai/aquila",
    r"openbmb/",
    r"shanghai-ai-lab/internlm",
    r"shanghai-ai-lab/internvl",
    r"skywork/",
    r"fnlp/",
    r"ieit/yuan",
    r"inclusionai/",

    # Russian
    r"sber/gigachat-2-lite",
    r"sber/gigachat-2-pro",
    r"sber/rugpt",
    r"yandex/yalm",
    r"yandex/yandexgpt-5-lite",
    r"vikhrmodels/",
    r"tbank/",

    # European
    r"mistral/(mistral-7b|mistral-nemo|mixtral|mistral-small|mistral-saba|pixtral|mathstral|codestral-mamba|ministral-3-|ministral-3b|ministral-8b|devstral-small|magistral-small|voxtral)",
    r"aleph-alpha/",
    r"openllm-france/",
    r"croissantllm/",
    r"pleias/",
    r"tngtech/",
    r"black-forest-labs/(flux\.1-dev|flux\.1-schnell|flux\.1-kontext-dev)",
    r"stabilityai/",

    # Indian
    r"sarvam/sarvam-(1|30b|105b)",
    r"ola/krutrim",
    r"ai4bharat/",
    r"bharatgen/param",

    # Middle East
    r"tii/falcon",
    r"mbzuai/",
    r"dicta/",

    # Singapore / Indonesia
    r"ai-singapore/",
    r"gotoai/",

    # Other
    r"meta/llama-",  # all Llama generations open weight
    r"google/gemma",  # Gemma open (gemini proprietary handled by vendor rule)
    r"google-deepmind/genie",
    r"microsoft/phi-",
    r"microsoft/orca",
    r"ibm/granite",
    r"allenai/",
    r"bigcode/",
    r"huggingface/smollm",
    r"foxconn/foxbrain",
    r"sakana/",
    r"epfl/",
    r"freedomintelligence/",
    r"opencoder/",
    r"agibot/",
    r"arcee/",
    r"cohere/aya",  # Aya is open weight (Command is proprietary)
    r"cohere/command-r",  # Command-R weights released
    r"cohere/command-a",  # Command-A weights released

    # NVIDIA Open Model License (commercial-permissive but weights-released)
    r"nvidia/cosmos-",
    r"nvidia/gr00t",
    r"nvidia/nemotron",
    r"nvidia/omniverse",  # research

    # AI21 Jamba family (open weights since Jamba 1.0)
    r"ai21/jamba",

    # Mixed Korean — Solar, NCSoft VARCO some open
    r"upstage/solar-pro$",  # pro is proprietary actually — handled by exception below
]

PROPRIETARY_PATTERNS = [
    # OpenAI proprietary
    r"openai/(gpt-[0-9]|o1|o3|o4|gpt-4|gpt-3)",
    # Anthropic
    r"anthropic/",
    # xAI Grok 3+
    r"xai/grok-(3|4|5)",
    # Google Gemini
    r"google/gemini",
    r"google-deepmind/gemini",
    # Cohere base Command (not r/r+/a)
    r"cohere/command$",
    # Korean proprietary
    r"naver/hyperclova-x$",
    r"naver/hyperclova-x-dash",
    r"naver/hyperclova-x-hcx",
    r"naver/clova-x",
    r"naver/cue",
    r"upstage/solar-pro",  # pro/pro-2/pro-3/pro-2-preview proprietary
    r"upstage/solar-docvision",
    r"kt/midm-1\.0",
    r"kt/midm-k2\.5",
    r"skt/ax-",
    r"samsung/gauss",
    r"ncsoft/varco-llm-1\.0",
    r"ncsoft/varco-llm-13b",
    # Chinese proprietary APIs
    r"baidu/ernie-(lite|speed|5\.0|5\.1|4\.5-turbo)",
    r"iflytek/spark",
    r"iflytek/antelope",
    r"sensetime/",
    r"huawei/pangu",
    r"tencent/hunyuan-(t1|turbo|hy3|hy-world|a13b)",
    r"baichuan/baichuan-(3|4|m1|omni)",
    r"01-ai/yi-(large|lightning)",
    r"zhipu/glm-(5|5\.1|5v)",
    r"alibaba/qwen3\.6-max",
    r"bytedance/seed",  # Seed family API-only (Doubao)
    r"minimax/",
    r"stepfun/",
    r"mimo/",
    r"xiaomi/mimo",  # MiMo is API
    # Russian proprietary
    r"sber/gigachat-(1\.5|2-max|3-)",
    r"yandex/yandexgpt-(5-pro|4-)",
    # AI21 Maestro (orchestrator service)
    r"ai21/maestro",
    # Mistral proprietary tier
    r"mistral/(mistral-large|mistral-medium|magistral-medium|devstral-medium|codestral-25)",
    # Reka API-only
    r"reka/",
    # Robotics commercial
    r"figure-ai/",
    r"1x/",
    r"agility/",
    r"apptronik/",
    r"sanctuary/",
    r"skild/",
    r"covariant/",
    r"tesla/",
    # Verticals
    r"harvey/", r"thomson-reuters/", r"vlex/", r"vecflow/", r"bloomberg/",
    r"landing-ai/", r"riiid/", r"lbox/", r"lunit/", r"vuno/",
    # Industrial
    r"siemens/", r"hitachi/", r"ge-vernova/", r"bosch/", r"aveva/",
    r"autodesk/", r"ptc/", r"dassault/",
    # Indian SaaS
    r"reliance/", r"tata/", r"lt-vyoma/", r"corover/",
    # Others
    r"synthesia/", r"wayve/", r"runway/",
]


def classify(model_id: str, vendor: str, current: str) -> str:
    """Return correct type given model_id, vendor, and current DB type."""
    # 1. Per-model override wins
    if model_id in MODEL_TYPE_OVERRIDES:
        return MODEL_TYPE_OVERRIDES[model_id]

    mid = model_id.lower()

    # 2. Pattern-based open-weight check
    for pat in OPEN_PATTERNS:
        if re.match(pat, mid):
            return "open-weight"

    # 3. Pattern-based proprietary check
    for pat in PROPRIETARY_PATTERNS:
        if re.match(pat, mid):
            return "proprietary"

    # 4. Vendor default
    if vendor in HARD_PROPRIETARY_VENDORS:
        return "proprietary"
    if vendor in OPEN_WEIGHT_VENDORS:
        return "open-weight"

    # 5. Last resort: keep current if reasonable, else proprietary
    return current if current in ("proprietary", "open-weight", "open-weights", "open-source") else "proprietary"


def main():
    conn = get_connection(DB_PATH)
    rows = conn.execute("SELECT id, vendor, type FROM models").fetchall()
    print(f"Total models: {len(rows)}")

    changes = []
    for row in rows:
        mid, vendor, current = row[0], row[1], row[2]
        new = classify(mid, vendor, current)
        # normalise existing 'open-weights' to 'open-weight'
        if current == "open-weights":
            current_norm = "open-weight"
        else:
            current_norm = current
        if new != current_norm:
            changes.append((mid, vendor, current, new))

    print(f"Changes proposed: {len(changes)}")
    # Stats
    from collections import Counter
    direction = Counter()
    for _, _, c, n in changes:
        direction[(c, n)] += 1
    print("Direction breakdown:")
    for (c, n), k in direction.most_common():
        print(f"  {c} -> {n}: {k}")

    if "--apply" in sys.argv:
        for mid, vendor, current, new in changes:
            conn.execute("UPDATE models SET type = ? WHERE id = ?", (new, mid))
        conn.commit()
        print(f"Applied {len(changes)} updates.")
        # Final stats
        types = conn.execute("SELECT type, COUNT(*) FROM models GROUP BY type").fetchall()
        print("Final type distribution:")
        for t, c in types:
            print(f"  {t}: {c}")
    else:
        print("Dry-run. Pass --apply to commit changes.")
        # Sample
        print("\nSample changes (first 30):")
        for mid, vendor, current, new in changes[:30]:
            print(f"  {mid} ({vendor}): {current} -> {new}")


if __name__ == "__main__":
    main()
