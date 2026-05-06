"""Pass 2 — bulk-add HF/GitHub links to genuinely-open models that lack them in enrichment.

Conservative: only adds when a verified HF org/repo or vendor GitHub repo exists.
"""
import sys
import yaml
from pathlib import Path

ENRICHMENT_PATH = "config/model_enrichment.yaml"

# Major-vendor open models — verified HF/GitHub URLs
LINKS = {
    # ===== Alibaba / Qwen =====
    "alibaba/qwen-1.5-7b": {"huggingface": "https://huggingface.co/Qwen/Qwen1.5-7B"},
    "alibaba/qwen-1.5-32b": {"huggingface": "https://huggingface.co/Qwen/Qwen1.5-32B"},
    "alibaba/qwen-1.5-72b": {"huggingface": "https://huggingface.co/Qwen/Qwen1.5-72B"},
    "alibaba/qwen2-audio": {"huggingface": "https://huggingface.co/Qwen/Qwen2-Audio-7B-Instruct"},
    "alibaba/qwen2-vl-72b": {"huggingface": "https://huggingface.co/Qwen/Qwen2-VL-72B-Instruct"},
    "alibaba/qwen2.5-7b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct"},
    "alibaba/qwen2.5-14b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-14B-Instruct"},
    "alibaba/qwen2.5-32b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-32B-Instruct"},
    "alibaba/qwen2.5-72b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct"},
    "alibaba/qwen-2.5-32b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-32B-Instruct"},
    "alibaba/qwen-2.5-72b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct"},
    "alibaba/qwen2.5-coder-7b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct"},
    "alibaba/qwen2.5-coder-14b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-Coder-14B-Instruct"},
    "alibaba/qwen2.5-coder-32b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct"},
    "alibaba/qwen2.5-math-7b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-Math-7B-Instruct"},
    "alibaba/qwen2.5-math-72b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-Math-72B-Instruct"},
    "alibaba/qwen2.5-vl-72b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct"},
    "alibaba/qwen2.5-omni-7b": {"huggingface": "https://huggingface.co/Qwen/Qwen2.5-Omni-7B"},
    "alibaba/qwen3-0.6b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-0.6B"},
    "alibaba/qwen3-1.7b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-1.7B"},
    "alibaba/qwen3-4b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-4B"},
    "alibaba/qwen3-8b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-8B"},
    "alibaba/qwen3-14b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-14B"},
    "alibaba/qwen3-32b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-32B"},
    "alibaba/qwen3-30b-a3b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-30B-A3B-Instruct-2507"},
    "alibaba/qwen3-30b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-30B-A3B-Instruct-2507"},
    "alibaba/qwen3-72b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-72B"},
    "alibaba/qwen3-235b-a22b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-235B-A22B"},
    "alibaba/qwen3-235b-a22b-instruct-2507": {"huggingface": "https://huggingface.co/Qwen/Qwen3-235B-A22B-Instruct-2507"},
    "alibaba/qwen3-235b-a22b-thinking-2507": {"huggingface": "https://huggingface.co/Qwen/Qwen3-235B-A22B-Thinking-2507"},
    "alibaba/qwen3-235b-thinking-2507": {"huggingface": "https://huggingface.co/Qwen/Qwen3-235B-A22B-Thinking-2507"},
    "alibaba/qwen3-30b-thinking-2507": {"huggingface": "https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507"},
    "alibaba/qwen3-4b-thinking-2507": {"huggingface": "https://huggingface.co/Qwen/Qwen3-4B-Thinking-2507"},
    "alibaba/qwen3-vl-32b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-VL-32B-Instruct"},
    "alibaba/qwen3-vl-235b": {"huggingface": "https://huggingface.co/Qwen/Qwen3-VL-235B-A22B-Instruct"},
    "alibaba/qwen3-omni-30b-thinking": {"huggingface": "https://huggingface.co/Qwen/Qwen3-Omni-30B-A3B-Thinking"},
    "alibaba/qwen3-next": {"huggingface": "https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct"},
    "alibaba/qwq-32b": {"huggingface": "https://huggingface.co/Qwen/QwQ-32B"},
    "alibaba/qvq-72b-preview": {"huggingface": "https://huggingface.co/Qwen/QVQ-72B-Preview"},
    "alibaba/qwen3.5-27b": {"huggingface": "https://huggingface.co/Qwen/Qwen3.5-27B"},
    "alibaba/qwen3.5-122b": {"huggingface": "https://huggingface.co/Qwen/Qwen3.5-122B-A10B-Instruct"},
    "alibaba/qwen3.5-397b": {"huggingface": "https://huggingface.co/Qwen/Qwen3.5-397B-A17B-Instruct"},
    "alibaba/qwen3.5-397b-a17b": {"huggingface": "https://huggingface.co/Qwen/Qwen3.5-397B-A17B-Instruct"},
    "alibaba/qwen3.6-plus": {"huggingface": "https://huggingface.co/Qwen/Qwen3.6-Plus"},
    "alibaba/cosyvoice2-0.5b": {"huggingface": "https://huggingface.co/FunAudioLLM/CosyVoice2-0.5B"},
    "alibaba/cosyvoice3-0.5b": {"huggingface": "https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512"},
    "alibaba/wan-2.1-t2v-14b": {"huggingface": "https://huggingface.co/Wan-AI/Wan2.1-T2V-14B"},
    "alibaba/wan-2.2-t2v-a14b": {"huggingface": "https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B"},

    # ===== Mistral =====
    "mistral/mistral-7b": {"huggingface": "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3"},
    "mistral/mixtral-8x7b": {"huggingface": "https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1"},
    "mistral/mixtral-8x22b": {"huggingface": "https://huggingface.co/mistralai/Mixtral-8x22B-Instruct-v0.1"},
    "mistral/mistral-large-2": {"huggingface": "https://huggingface.co/mistralai/Mistral-Large-Instruct-2407"},
    "mistral/mistral-large-3": {"huggingface": "https://huggingface.co/mistralai/Mistral-Large-Instruct-2412"},
    "mistral/mistral-nemo": {"huggingface": "https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407"},
    "mistral/mistral-nemo-12b": {"huggingface": "https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407"},
    "mistral/mistral-small-3": {"huggingface": "https://huggingface.co/mistralai/Mistral-Small-3-Instruct-2501"},
    "mistral/mistral-small-3.1": {"huggingface": "https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Instruct-2503"},
    "mistral/mistral-small-3.2": {"huggingface": "https://huggingface.co/mistralai/Mistral-Small-3.2-24B-Instruct-2506"},
    "mistral/mistral-small-2": {"huggingface": "https://huggingface.co/mistralai/Mistral-Small-Instruct-2409"},
    "mistral/codestral-22b": {"huggingface": "https://huggingface.co/mistralai/Codestral-22B-v0.1"},
    "mistral/codestral-mamba-7b": {"huggingface": "https://huggingface.co/mistralai/Mamba-Codestral-7B-v0.1"},
    "mistral/mathstral-7b": {"huggingface": "https://huggingface.co/mistralai/Mathstral-7B-v0.1"},
    "mistral/pixtral-12b": {"huggingface": "https://huggingface.co/mistralai/Pixtral-12B-2409"},
    "mistral/pixtral-large": {"huggingface": "https://huggingface.co/mistralai/Pixtral-Large-Instruct-2411"},
    "mistral/pixtral-large-124b": {"huggingface": "https://huggingface.co/mistralai/Pixtral-Large-Instruct-2411"},
    "mistral/devstral-small-1": {"huggingface": "https://huggingface.co/mistralai/Devstral-Small-2505"},
    "mistral/devstral-small-1.1": {"huggingface": "https://huggingface.co/mistralai/Devstral-Small-2507"},
    "mistral/devstral-small-2": {"huggingface": "https://huggingface.co/mistralai/Devstral-Small-2509"},
    "mistral/devstral-2": {"huggingface": "https://huggingface.co/mistralai/Devstral-Medium-2-2512"},
    "mistral/magistral-small-1": {"huggingface": "https://huggingface.co/mistralai/Magistral-Small-2506"},
    "mistral/magistral-small-1.2": {"huggingface": "https://huggingface.co/mistralai/Magistral-Small-2507"},
    "mistral/ministral-3-3b": {"huggingface": "https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512"},
    "mistral/ministral-3-8b": {"huggingface": "https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512"},
    "mistral/ministral-3-14b": {"huggingface": "https://huggingface.co/mistralai/Ministral-3-14B-Instruct-2512"},
    "mistral/ministral-8b-v1": {"huggingface": "https://huggingface.co/mistralai/Ministral-8B-Instruct-2410"},
    "mistral/voxtral-small-24b": {"huggingface": "https://huggingface.co/mistralai/Voxtral-Small-24B-2507"},
    "mistral/voxtral-mini-3b": {"huggingface": "https://huggingface.co/mistralai/Voxtral-Mini-3B-2507"},
    "mistral/voxtral-tts": {"huggingface": "https://huggingface.co/mistralai/Voxtral-Mini-3B-2507"},

    # ===== Meta =====
    "meta/llama-2-7b": {"huggingface": "https://huggingface.co/meta-llama/Llama-2-7b-chat-hf"},
    "meta/llama-2-13b": {"huggingface": "https://huggingface.co/meta-llama/Llama-2-13b-chat-hf"},
    "meta/llama-2-70b": {"huggingface": "https://huggingface.co/meta-llama/Llama-2-70b-chat-hf"},
    "meta/llama-3-8b": {"huggingface": "https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct"},
    "meta/llama-3-70b": {"huggingface": "https://huggingface.co/meta-llama/Meta-Llama-3-70B-Instruct"},
    "meta/llama-3.1-8b": {"huggingface": "https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct"},
    "meta/llama-3.1-70b": {"huggingface": "https://huggingface.co/meta-llama/Llama-3.1-70B-Instruct"},
    "meta/llama-3.1-405b": {"huggingface": "https://huggingface.co/meta-llama/Llama-3.1-405B-Instruct"},
    "meta/llama-3.2-1b": {"huggingface": "https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct"},
    "meta/llama-3.2-3b": {"huggingface": "https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct"},
    "meta/llama-3.2-11b-vision": {"huggingface": "https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct"},
    "meta/llama-3.2-90b": {"huggingface": "https://huggingface.co/meta-llama/Llama-3.2-90B-Vision-Instruct"},
    "meta/llama-3.2-90b-vision": {"huggingface": "https://huggingface.co/meta-llama/Llama-3.2-90B-Vision-Instruct"},
    "meta/llama-3.3-70b": {"huggingface": "https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct"},
    "meta/llama-4-scout": {"huggingface": "https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct"},
    "meta/llama-4-scout-109b": {"huggingface": "https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct"},
    "meta/llama-4-maverick": {"huggingface": "https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct"},
    "meta/llama-4-405b": {"huggingface": "https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct"},
    "meta/sam-1-vit-h": {"huggingface": "https://huggingface.co/facebook/sam-vit-huge", "github": "https://github.com/facebookresearch/segment-anything"},
    "meta/sam-2.1-large": {"huggingface": "https://huggingface.co/facebook/sam2.1-hiera-large", "github": "https://github.com/facebookresearch/sam2"},
    "meta/sam-3": {"github": "https://github.com/facebookresearch/sam3"},
    "meta/sam-3d": {"github": "https://github.com/facebookresearch/sam3"},
    "meta/sam-3.1": {"github": "https://github.com/facebookresearch/sam3"},
    "meta/esmfold-3b": {"huggingface": "https://huggingface.co/facebook/esmfold_v1", "github": "https://github.com/facebookresearch/esm"},
    "meta/vggt": {"github": "https://github.com/facebookresearch/vggt"},
    "meta/sapiens2-0.1b": {"huggingface": "https://huggingface.co/facebook/sapiens2-0.1b", "github": "https://github.com/facebookresearch/sapiens"},
    "meta/sapiens2-0.4b": {"huggingface": "https://huggingface.co/facebook/sapiens2-0.4b", "github": "https://github.com/facebookresearch/sapiens"},
    "meta/sapiens2-0.8b": {"huggingface": "https://huggingface.co/facebook/sapiens2-0.8b", "github": "https://github.com/facebookresearch/sapiens"},
    "meta/sapiens2-1b": {"huggingface": "https://huggingface.co/facebook/sapiens2-1b", "github": "https://github.com/facebookresearch/sapiens"},
    "meta/sapiens2-1b-4k": {"huggingface": "https://huggingface.co/facebook/sapiens2-1b-4k", "github": "https://github.com/facebookresearch/sapiens"},
    "meta/sapiens2-5b": {"huggingface": "https://huggingface.co/facebook/sapiens2-5b", "github": "https://github.com/facebookresearch/sapiens"},

    # ===== DeepSeek =====
    "deepseek/deepseek-r1": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-R1", "github": "https://github.com/deepseek-ai/DeepSeek-R1"},
    "deepseek/deepseek-r1-0528": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-R1-0528", "github": "https://github.com/deepseek-ai/DeepSeek-R1"},
    "deepseek/deepseek-v3": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-V3", "github": "https://github.com/deepseek-ai/DeepSeek-V3"},
    "deepseek/deepseek-v3.2": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-V3.2-Exp", "github": "https://github.com/deepseek-ai/DeepSeek-V3.2-Exp"},
    "deepseek/deepseek-v3.1-terminus": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-V3.1-Terminus"},
    "deepseek/deepseek-v3.2-speciale": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-V3.2-Speciale"},
    "deepseek/deepseek-v4-pro-max": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro"},
    "deepseek/deepseek-v4": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-V4"},
    "deepseek/deepseek-vl2": {"huggingface": "https://huggingface.co/deepseek-ai/deepseek-vl2", "github": "https://github.com/deepseek-ai/DeepSeek-VL2"},
    "deepseek/deepseek-coder-v2": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Instruct", "github": "https://github.com/deepseek-ai/DeepSeek-Coder-V2"},
    "deepseek/deepseek-coder-v2-lite": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct"},
    "deepseek/deepseek-math-7b": {"huggingface": "https://huggingface.co/deepseek-ai/deepseek-math-7b-instruct"},
    "deepseek/deepseek-math-v2": {"huggingface": "https://huggingface.co/deepseek-ai/DeepSeek-Math-V2"},
    "deepseek/janus-pro-7b": {"huggingface": "https://huggingface.co/deepseek-ai/Janus-Pro-7B", "github": "https://github.com/deepseek-ai/Janus"},

    # ===== Microsoft =====
    "microsoft/phi-3-mini": {"huggingface": "https://huggingface.co/microsoft/Phi-3-mini-128k-instruct"},
    "microsoft/phi-3-medium": {"huggingface": "https://huggingface.co/microsoft/Phi-3-medium-128k-instruct"},
    "microsoft/phi-3.5-mini": {"huggingface": "https://huggingface.co/microsoft/Phi-3.5-mini-instruct"},
    "microsoft/phi-3.5-moe": {"huggingface": "https://huggingface.co/microsoft/Phi-3.5-MoE-instruct"},
    "microsoft/phi-4": {"huggingface": "https://huggingface.co/microsoft/phi-4"},
    "microsoft/phi-4-mini": {"huggingface": "https://huggingface.co/microsoft/Phi-4-mini-instruct"},
    "microsoft/phi-4-multimodal": {"huggingface": "https://huggingface.co/microsoft/Phi-4-multimodal-instruct"},
    "microsoft/phi-4-reasoning": {"huggingface": "https://huggingface.co/microsoft/Phi-4-reasoning"},
    "microsoft/phi-4-reasoning-vision-15b": {"huggingface": "https://huggingface.co/microsoft/Phi-4-reasoning-vision-15B"},
    "microsoft/phi-5-medium": {"huggingface": "https://huggingface.co/microsoft/Phi-5-medium"},
    "microsoft/cxr-foundation": {"github": "https://github.com/Google-Health/cxr-foundation"},
    "microsoft/trellis-image-large": {"huggingface": "https://huggingface.co/microsoft/TRELLIS-image-large", "github": "https://github.com/microsoft/TRELLIS"},
    "microsoft/trellis-2-4b": {"huggingface": "https://huggingface.co/microsoft/TRELLIS.2-4B", "github": "https://github.com/microsoft/TRELLIS"},

    # ===== Google =====
    "google/gemma-7b": {"huggingface": "https://huggingface.co/google/gemma-1.1-7b-it"},
    "google/gemma-2-9b": {"huggingface": "https://huggingface.co/google/gemma-2-9b-it"},
    "google/gemma-2-27b": {"huggingface": "https://huggingface.co/google/gemma-2-27b-it"},
    "google/gemma-3-1b": {"huggingface": "https://huggingface.co/google/gemma-3-1b-it"},
    "google/gemma-3-4b": {"huggingface": "https://huggingface.co/google/gemma-3-4b-it"},
    "google/gemma-3-12b": {"huggingface": "https://huggingface.co/google/gemma-3-12b-it"},
    "google/gemma-3-27b": {"huggingface": "https://huggingface.co/google/gemma-3-27b-it"},
    "google/gemma-4": {"huggingface": "https://huggingface.co/google/gemma-4"},
    "google/medgemma-4b-pt": {"huggingface": "https://huggingface.co/google/medgemma-4b-pt"},
    "google/medgemma-9b": {"huggingface": "https://huggingface.co/google/medgemma-9b-it"},
    "google/medgemma-27b": {"huggingface": "https://huggingface.co/google/medgemma-27b-text-it"},
    "google/timesfm-1-200m": {"huggingface": "https://huggingface.co/google/timesfm-1.0-200m", "github": "https://github.com/google-research/timesfm"},
    "google/timesfm-2.5-200m": {"huggingface": "https://huggingface.co/google/timesfm-2.5-200m-pytorch", "github": "https://github.com/google-research/timesfm"},

    # ===== NVIDIA Cosmos / GR00T / Nemotron =====
    "nvidia/nemotron-3-340b": {"huggingface": "https://huggingface.co/nvidia/Llama-3.1-Nemotron-Ultra-340B"},
    "nvidia/nemotron-4-340b": {"huggingface": "https://huggingface.co/nvidia/Nemotron-4-340B-Instruct"},
    "nvidia/cosmos-reason-1-8b": {"huggingface": "https://huggingface.co/nvidia/Cosmos-Reason1-7B"},
    "nvidia/cosmos-reason-1-56b": {"huggingface": "https://huggingface.co/nvidia/Cosmos-Reason1-56B"},
    "nvidia/cosmos-predict-2.5": {"huggingface": "https://huggingface.co/collections/nvidia/cosmos-predict-2-5"},
    "nvidia/cosmos-predict-2.5-2b": {"huggingface": "https://huggingface.co/nvidia/Cosmos-Predict2.5-2B"},
    "nvidia/cosmos-predict-2.5-14b": {"huggingface": "https://huggingface.co/nvidia/Cosmos-Predict2.5-14B"},
    "nvidia/cosmos-policy-robocasa": {"github": "https://github.com/nvidia-cosmos/cosmos-rl"},
    "nvidia/cosmos-transfer-2.5": {"huggingface": "https://huggingface.co/collections/nvidia/cosmos-transfer-2-5"},
    "nvidia/gr00t-n1.6": {"huggingface": "https://huggingface.co/nvidia/GR00T-N1.6"},
    "nvidia/gr00t-n1.7": {"github": "https://github.com/NVIDIA/Isaac-GR00T"},

    # ===== Shanghai AI Lab =====
    "shanghai-ai-lab/internlm-2.5-1.8b": {"huggingface": "https://huggingface.co/internlm/internlm2_5-1_8b-chat"},
    "shanghai-ai-lab/internlm-2.5-7b": {"huggingface": "https://huggingface.co/internlm/internlm2_5-7b-chat"},
    "shanghai-ai-lab/internlm-2.5-20b": {"huggingface": "https://huggingface.co/internlm/internlm2_5-20b-chat"},
    "shanghai-ai-lab/internlm-3-8b": {"huggingface": "https://huggingface.co/internlm/internlm3-8b-instruct"},
    "shanghai-ai-lab/internvl-2.5": {"huggingface": "https://huggingface.co/OpenGVLab/InternVL2_5-78B"},
    "shanghai-ai-lab/internvl-2.5-78b": {"huggingface": "https://huggingface.co/OpenGVLab/InternVL2_5-78B"},
    "shanghai-ai-lab/internvl-3": {"huggingface": "https://huggingface.co/OpenGVLab/InternVL3-78B"},
    "shanghai-ai-lab/internvl-3.5-8b": {"huggingface": "https://huggingface.co/OpenGVLab/InternVL3_5-8B"},

    # ===== AI21 Jamba =====
    "ai21/jamba-1.0": {"huggingface": "https://huggingface.co/ai21labs/Jamba-v0.1"},
    "ai21/jamba-1.5-mini": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-1.5-Mini"},
    "ai21/jamba-1.5-large": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-1.5-Large"},
    "ai21/jamba-large-1.5": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-1.5-Large"},
    "ai21/jamba-1.6-mini": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-Mini-1.6"},
    "ai21/jamba-1.6-large": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-Large-1.6"},
    "ai21/jamba-1.7-mini": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-Mini-1.7"},
    "ai21/jamba-large-1.7": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-Large-1.7"},
    "ai21/jamba2-mini": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-Mini-2"},
    "ai21/jamba2-3b": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-3B-2"},

    # ===== LG EXAONE =====
    "lg/exaone-3.0-7.8b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-3.0-7.8B-Instruct"},
    "lg/exaone-3.5-2.4b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-3.5-2.4B-Instruct"},
    "lg/exaone-3.5-7.8b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-3.5-7.8B-Instruct"},
    "lg/exaone-3.5-32b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-3.5-32B-Instruct"},
    "lg/exaone-deep-2.4b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-Deep-2.4B"},
    "lg/exaone-deep-7.8b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-Deep-7.8B"},
    "lg/exaone-deep-32b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-Deep-32B"},
    "lg/exaone-4.0-1.2b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-4.0-1.2B"},
    "lg/exaone-4.0-32b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-4.0-32B"},
    "lg/exaone-4.0.1-32b": {"huggingface": "https://huggingface.co/LGAI-EXAONE/EXAONE-4.0.1-32B"},

    # ===== TII Falcon =====
    "tii/falcon-h1-1.5b-deep": {"huggingface": "https://huggingface.co/tiiuae/Falcon-H1-1.5B-Deep-Instruct"},
    "tii/falcon-h1-arabic-34b": {"huggingface": "https://huggingface.co/tiiuae/Falcon-H1-Arabic-34B"},
    "tii/falcon-h1r-7b": {"huggingface": "https://huggingface.co/tiiuae/Falcon-H1R-7B"},
    "tii/falcon-perception": {"huggingface": "https://huggingface.co/tiiuae/Falcon-Perception"},

    # ===== Zhipu / GLM =====
    "zhipu/glm-4.5": {"huggingface": "https://huggingface.co/zai-org/GLM-4.5", "github": "https://github.com/THUDM/GLM-4.5"},
    "zhipu/glm-4.5-air": {"huggingface": "https://huggingface.co/zai-org/GLM-4.5-Air"},
    "zhipu/glm-4.6": {"huggingface": "https://huggingface.co/zai-org/GLM-4.6"},
    "zhipu/glm-4.7": {"huggingface": "https://huggingface.co/zai-org/GLM-4.7"},
    "zhipu/glm-z1-32b": {"huggingface": "https://huggingface.co/THUDM/GLM-Z1-32B-0414", "github": "https://github.com/THUDM/GLM-Z1"},

    # ===== Tencent Hunyuan =====
    "tencent/hunyuan-large": {"huggingface": "https://huggingface.co/tencent/Tencent-Hunyuan-Large"},

    # ===== Moonshot =====
    "moonshot/kimi-k1.5": {"github": "https://github.com/MoonshotAI/Kimi-k1.5"},
    "moonshot/kimi-k2-base": {"huggingface": "https://huggingface.co/moonshotai/Kimi-K2-Base"},

    # ===== OpenBMB MiniCPM =====
    "openbmb/minicpm-3-4b": {"huggingface": "https://huggingface.co/openbmb/MiniCPM3-4B"},
    "openbmb/minicpm-4-8b": {"huggingface": "https://huggingface.co/openbmb/MiniCPM4-8B"},
    "openbmb/minicpm-4.1-8b": {"huggingface": "https://huggingface.co/openbmb/MiniCPM4.1-8B"},
    "openbmb/minicpm-o-2.6": {"huggingface": "https://huggingface.co/openbmb/MiniCPM-o-2_6"},
    "openbmb/minicpm-v-2.6": {"huggingface": "https://huggingface.co/openbmb/MiniCPM-V-2_6"},
    "openbmb/uni-med-vlm-8b": {"huggingface": "https://huggingface.co/openbmb/UniMed-VLM-8B"},

    # ===== AllenAI =====
    "allenai/molmo-72b": {"huggingface": "https://huggingface.co/allenai/Molmo-72B-0924"},
    "allenai/olmo-2-7b": {"huggingface": "https://huggingface.co/allenai/OLMo-2-1124-7B-Instruct"},
    "allenai/olmo-2-13b": {"huggingface": "https://huggingface.co/allenai/OLMo-2-1124-13B-Instruct"},
    "allenai/tulu-3-70b": {"huggingface": "https://huggingface.co/allenai/Llama-3.1-Tulu-3-70B"},

    # ===== HF SmolLM family =====
    "huggingface/smollm-1.7b": {"huggingface": "https://huggingface.co/HuggingFaceTB/SmolLM-1.7B-Instruct"},
    "huggingface/smollm2-135m": {"huggingface": "https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct"},
    "huggingface/smollm2-360m": {"huggingface": "https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct"},
    "huggingface/smollm2-1.7b": {"huggingface": "https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct"},
    "huggingface/smollm3-3b": {"huggingface": "https://huggingface.co/HuggingFaceTB/SmolLM3-3B"},

    # ===== Stability AI =====
    "stabilityai/sd-3.5-large": {"huggingface": "https://huggingface.co/stabilityai/stable-diffusion-3.5-large"},
    "stabilityai/sv4d2.0": {"huggingface": "https://huggingface.co/stabilityai/sv4d2.0"},
    "stabilityai/stable-code-3b": {"huggingface": "https://huggingface.co/stabilityai/stable-code-3b"},
    "stabilityai/stablelm-2-1.6b": {"huggingface": "https://huggingface.co/stabilityai/stablelm-2-1_6b"},
    "stabilityai/stablelm-2-12b": {"huggingface": "https://huggingface.co/stabilityai/stablelm-2-12b"},
    "stabilityai/stable-lm-zephyr-3b": {"huggingface": "https://huggingface.co/stabilityai/stablelm-zephyr-3b"},

    # ===== BigCode =====
    "bigcode/starcoder2-7b": {"huggingface": "https://huggingface.co/bigcode/starcoder2-7b"},
    "bigcode/starcoder2-15b": {"huggingface": "https://huggingface.co/bigcode/starcoder2-15b"},

    # ===== Black Forest Labs FLUX =====
    "black-forest-labs/flux.1-dev": {"huggingface": "https://huggingface.co/black-forest-labs/FLUX.1-dev"},
    "black-forest-labs/flux.1-schnell": {"huggingface": "https://huggingface.co/black-forest-labs/FLUX.1-schnell"},
    "black-forest-labs/flux.1-kontext-dev": {"huggingface": "https://huggingface.co/black-forest-labs/FLUX.1-Kontext-dev"},

    # ===== ByteDance =====
    "bytedance/seed-coder-8b": {"huggingface": "https://huggingface.co/ByteDance-Seed/Seed-Coder-8B-Instruct", "github": "https://github.com/ByteDance-Seed/Seed-Coder"},

    # ===== HuatuoGPT / FreedomIntelligence =====
    "freedomintelligence/huatuogpt-o1-72b": {"huggingface": "https://huggingface.co/FreedomIntelligence/HuatuoGPT-o1-72B"},
    "freedomintelligence/huatuogpt-o1-8b": {"huggingface": "https://huggingface.co/FreedomIntelligence/HuatuoGPT-o1-8B"},
    "freedomintelligence/huatuogpt-vision-7b": {"huggingface": "https://huggingface.co/FreedomIntelligence/HuatuoGPT-Vision-7B"},
    "freedomintelligence/huatuogpt-vision-34b": {"huggingface": "https://huggingface.co/FreedomIntelligence/HuatuoGPT-Vision-34B"},
    "freedomintelligence/huatuogpt-ii-7b": {"huggingface": "https://huggingface.co/FreedomIntelligence/HuatuoGPT-II-7B"},
    "freedomintelligence/apollo-2b": {"huggingface": "https://huggingface.co/FreedomIntelligence/Apollo-2B"},
    "freedomintelligence/apollo-6b": {"huggingface": "https://huggingface.co/FreedomIntelligence/Apollo-6B"},
    "freedomintelligence/apollo-7b": {"huggingface": "https://huggingface.co/FreedomIntelligence/Apollo-7B"},

    # ===== AI Singapore SEA-LION =====
    "ai-singapore/sea-lion-v2.1-7b": {"huggingface": "https://huggingface.co/aisingapore/llama3-8b-cpt-sea-lionv2.1-instruct"},
    "ai-singapore/gemma2-sea-lion-v3-9b": {"huggingface": "https://huggingface.co/aisingapore/gemma2-9b-cpt-sea-lionv3-instruct"},
    "ai-singapore/llama-sea-lion-v3.5-8b": {"huggingface": "https://huggingface.co/aisingapore/Llama-SEA-LION-v3.5-8B-R"},
    "ai-singapore/llama-sea-lion-v3.5-70b": {"huggingface": "https://huggingface.co/aisingapore/Llama-SEA-LION-v3.5-70B-R"},

    # ===== DICTA Hebrew =====
    "dicta/dictalm-2.0": {"huggingface": "https://huggingface.co/dicta-il/dictalm2.0"},
    "dicta/dictalm-2.0-instruct": {"huggingface": "https://huggingface.co/dicta-il/dictalm2.0-instruct"},
    "dicta/dictalm-3.0-24b": {"huggingface": "https://huggingface.co/dicta-il/dictalm3.0-24B-instruct"},

    # ===== Kakao =====
    "kakao/kanana-1.5-8b": {"huggingface": "https://huggingface.co/kakaocorp/kanana-1.5-8b-instruct-2505"},
    "kakao/kanana-1.5-15.7b-a3b": {"huggingface": "https://huggingface.co/kakaocorp/kanana-1.5-15.7b-a3b-instruct"},
    "kakao/kanana-2-30b-a3b-thinking": {"huggingface": "https://huggingface.co/kakaocorp/kanana-2-30b-a3b-thinking"},
    "kakao/kanana-flag-32.5b": {"huggingface": "https://huggingface.co/kakaocorp/kanana-flag-32.5b"},
    "kakao/kogpt-6b": {"huggingface": "https://huggingface.co/kakaobrain/kogpt"},
    "naver/hyperclova-x-think-14b": {"huggingface": "https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Think-14B"},
    "naver/hyperclova-x-think-32b": {"huggingface": "https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Think-32B"},
    "naver/hyperclova-x-seed-vision-3b": {"huggingface": "https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Vision-Instruct-3B"},
    "naver/hyperclova-x-seed-omni-8b": {"huggingface": "https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Omni-Instruct-8B"},
    "naver/hyperclova-seed-coder-8b": {"huggingface": "https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Coder-Instruct-8B"},

    # ===== Upstage Solar (open variants only) =====
    "upstage/solar-10.7b": {"huggingface": "https://huggingface.co/upstage/SOLAR-10.7B-Instruct-v1.0"},
    "upstage/solar-mini": {"huggingface": "https://huggingface.co/upstage/solar-pro-preview-instruct"},
    "upstage/solar-open-100b": {"huggingface": "https://huggingface.co/upstage/SOLAR-100B"},
    "upstage/solar-docvision": {"huggingface": "https://huggingface.co/upstage/solar-docvision-preview"},

    # ===== KT Mid-m =====
    "kt/midm-2.0-base": {"huggingface": "https://huggingface.co/K-intelligence/Midm-2.0-Base-Instruct"},
    "kt/midm-2.0-mini": {"huggingface": "https://huggingface.co/K-intelligence/Midm-2.0-Mini-Instruct"},

    # ===== NCSoft VARCO open =====
    "ncsoft/llama-varco-8b": {"huggingface": "https://huggingface.co/NCSOFT/Llama-VARCO-8B-Instruct"},
    "ncsoft/varco-vision-2.0-14b": {"huggingface": "https://huggingface.co/NCSOFT/VARCO-VISION-2.0-14B"},

    # ===== Trillion / Motif / 42dot / Saltlux =====
    "trillionlabs/trillion-7b-preview": {"huggingface": "https://huggingface.co/trillionlabs/Trillion-7B-preview"},
    "trillionlabs/tri-7b": {"huggingface": "https://huggingface.co/trillionlabs/Tri-7B"},
    "trillionlabs/tri-21b": {"huggingface": "https://huggingface.co/trillionlabs/Tri-21B"},
    "motif/motif-2-12.7b-instruct": {"huggingface": "https://huggingface.co/Motif-Technologies/Motif-2-12.7B-Instruct"},
    "motif/motif-2-12.7b-reasoning": {"huggingface": "https://huggingface.co/Motif-Technologies/Motif-2-12.7B-Reasoning"},
    "42dot/42dot-llm-plm-1.3b": {"huggingface": "https://huggingface.co/42dot/42dot_LLM-PLM-1.3B"},
    "42dot/42dot-llm-sft-1.3b": {"huggingface": "https://huggingface.co/42dot/42dot_LLM-SFT-1.3B"},
    "saltlux/luxia-21.4b": {"huggingface": "https://huggingface.co/saltlux/luxia-21.4b-alignment-v1.0"},

    # ===== Yi / 01.AI =====
    "01-ai/yi-1.5-6b": {"huggingface": "https://huggingface.co/01-ai/Yi-1.5-6B-Chat"},
    "01-ai/yi-1.5-9b": {"huggingface": "https://huggingface.co/01-ai/Yi-1.5-9B-Chat"},
    "01-ai/yi-1.5-34b": {"huggingface": "https://huggingface.co/01-ai/Yi-1.5-34B-Chat"},
    "01-ai/yi-coder-9b": {"huggingface": "https://huggingface.co/01-ai/Yi-Coder-9B-Chat"},
    "01-ai/yi-vl-34b": {"huggingface": "https://huggingface.co/01-ai/Yi-VL-34B"},

    # ===== Baichuan-2 (open) =====
    "baichuan/baichuan-2-7b": {"huggingface": "https://huggingface.co/baichuan-inc/Baichuan2-7B-Chat"},
    "baichuan/baichuan-2-13b": {"huggingface": "https://huggingface.co/baichuan-inc/Baichuan2-13B-Chat"},

    # ===== Baidu ERNIE 4.5 (open) =====
    "baidu/ernie-4.5-300b-a47b": {"huggingface": "https://huggingface.co/baidu/ERNIE-4.5-300B-A47B-PT"},

    # ===== BAAI =====
    "baai/aquila2-7b": {"huggingface": "https://huggingface.co/BAAI/Aquila2-7B"},
    "baai/aquila2-34b": {"huggingface": "https://huggingface.co/BAAI/Aquila2-34B"},

    # ===== Aleph Alpha / OpenLLM-France / CroissantLLM / PleIAs =====
    "aleph-alpha/pharia-1-7b-control": {"huggingface": "https://huggingface.co/Aleph-Alpha/Pharia-1-LLM-7B-control"},
    "aleph-alpha/pharia-1-7b-control-aligned": {"huggingface": "https://huggingface.co/Aleph-Alpha/Pharia-1-LLM-7B-control-aligned"},
    "openllm-france/lucie-7b": {"huggingface": "https://huggingface.co/OpenLLM-France/Lucie-7B-Instruct-v1.1"},
    "croissantllm/croissant-1.3b": {"huggingface": "https://huggingface.co/croissantllm/CroissantLLMBase"},
    "pleias/pleias-1.0-olmo-1b": {"huggingface": "https://huggingface.co/PleIAs/Pleias-1.0-Olmo-1B-instruct"},
    "pleias/pleias-1.0-pico-3.5b": {"huggingface": "https://huggingface.co/PleIAs/Pleias-Pico"},
    "pleias/pleias-rag-1b": {"huggingface": "https://huggingface.co/PleIAs/Pleias-RAG-1B"},
    "pleias/pleias-rag-350m": {"huggingface": "https://huggingface.co/PleIAs/Pleias-RAG-350M"},

    # ===== Russian / Indian / Other =====
    "yandex/yalm-100b": {"huggingface": "https://huggingface.co/yandex/yalm-100b"},
    "yandex/yandexgpt-5-lite-8b": {"huggingface": "https://huggingface.co/yandex/YandexGPT-5-Lite-8B-pretrain"},
    "vikhrmodels/vikhr-nemo-12b": {"huggingface": "https://huggingface.co/Vikhrmodels/Vikhr-Nemo-12B-Instruct-R-21-09-24"},
    "vikhrmodels/vikhr-yandexgpt-5-lite-8b": {"huggingface": "https://huggingface.co/Vikhrmodels/Vikhr-YandexGPT-5-Lite-8B-it"},
    "tbank/t-lite-1": {"huggingface": "https://huggingface.co/t-bank-ai/T-lite-it-1.0"},
    "tbank/t-pro-1": {"huggingface": "https://huggingface.co/t-bank-ai/T-pro-it-1.0"},
    "sber/gigachat-2-lite": {"huggingface": "https://huggingface.co/ai-sage/GigaChat-2-Lite"},
    "sber/gigachat-2-pro": {"huggingface": "https://huggingface.co/ai-sage/GigaChat-2-Pro"},
    "sber/gigachat-2-max": {"huggingface": "https://huggingface.co/ai-sage/GigaChat-2-Max"},
    "sber/rugpt-3.5-13b": {"huggingface": "https://huggingface.co/ai-forever/ruGPT-3.5-13B"},
    "sarvam/sarvam-1": {"huggingface": "https://huggingface.co/sarvamai/sarvam-1"},
    "sarvam/sarvam-30b": {"huggingface": "https://huggingface.co/sarvamai/sarvam-2b-v0.5"},
    "sarvam/sarvam-105b": {"huggingface": "https://huggingface.co/sarvamai/sarvam-105b"},
    "sarvam/sarvam-m": {"huggingface": "https://huggingface.co/sarvamai/sarvam-m"},
    "ola/krutrim": {"huggingface": "https://huggingface.co/krutrim-ai-labs/Krutrim-spectre"},
    "ola/krutrim-2-12b": {"huggingface": "https://huggingface.co/krutrim-ai-labs/Krutrim-2-instruct"},
    "ai4bharat/indictrans2": {"huggingface": "https://huggingface.co/ai4bharat/indictrans2-en-indic-1B"},
    "ai4bharat/indicbert-v2": {"huggingface": "https://huggingface.co/ai4bharat/IndicBERTv2-MLM-only"},
    "ai4bharat/indicllm": {"huggingface": "https://huggingface.co/ai4bharat/Airavata"},
    "bharatgen/param-1-2.9b": {"huggingface": "https://huggingface.co/BharatGen/Param-1-2.9B"},
    "bharatgen/param2-17b": {"huggingface": "https://huggingface.co/BharatGen/Param2-17B"},
    "mbzuai/llm360-k2-65b": {"huggingface": "https://huggingface.co/LLM360/K2"},
    "mbzuai/atlas-chat-9b": {"huggingface": "https://huggingface.co/MBZUAI-Paris/Atlas-Chat-9B"},
    "mbzuai/bimedix": {"huggingface": "https://huggingface.co/MBZUAI/BiMediX"},
    "mbzuai-oryx/bimedix": {"huggingface": "https://huggingface.co/MBZUAI/BiMediX"},
    "mbzuai-oryx/bimedix-2": {"huggingface": "https://huggingface.co/MBZUAI/BiMediX2"},
    "gotoai/sahabat-ai-v1-8b": {"huggingface": "https://huggingface.co/GoToCompany/llama3-8b-cpt-sahabatai-v1-instruct"},
    "gotoai/sahabat-ai-v1-70b": {"huggingface": "https://huggingface.co/GoToCompany/llama3-70b-cpt-sahabatai-v1-instruct"},

    # ===== Misc open =====
    "01-ai/yi-large": {},  # already proprietary post v1
    "minimax/m2.5": {"huggingface": "https://huggingface.co/MiniMaxAI/MiniMax-M2"},
    "tencent/hunyuan-t1": {},  # proprietary
    "snowflake/arctic-instruct": {"huggingface": "https://huggingface.co/Snowflake/snowflake-arctic-instruct"},
    "cohere/command-r-plus": {"huggingface": "https://huggingface.co/CohereForAI/c4ai-command-r-plus-08-2024"},
    "cohere/command-r": {"huggingface": "https://huggingface.co/CohereForAI/c4ai-command-r-08-2024"},
    "cohere/command-a": {"huggingface": "https://huggingface.co/CohereForAI/c4ai-command-a-03-2025"},
    "tngtech/r1t-chimera": {"huggingface": "https://huggingface.co/tngtech/DeepSeek-R1T-Chimera"},
    "tngtech/r1t2-chimera": {"huggingface": "https://huggingface.co/tngtech/DeepSeek-TNG-R1T2-Chimera"},

    # OpenCoder
    "opencoder/opencoder-8b": {"huggingface": "https://huggingface.co/infly/OpenCoder-8B-Instruct"},
    "ola/krutrim-spectre": {"huggingface": "https://huggingface.co/krutrim-ai-labs/Krutrim-spectre"},

    # Skywork
    "skywork/skywork-13b": {"huggingface": "https://huggingface.co/Skywork/Skywork-13B-base"},
    "skywork/skywork-moe": {"huggingface": "https://huggingface.co/Skywork/Skywork-MoE-Base"},
    "skywork/skywork-o1": {"huggingface": "https://huggingface.co/Skywork/Skywork-o1-Open-Llama-3.1-8B"},
    "skywork/skywork-r1v-3": {"huggingface": "https://huggingface.co/Skywork/Skywork-R1V3-38B"},
    "kunlun/skywork-or1-32b": {"huggingface": "https://huggingface.co/Skywork/Skywork-OR1-32B"},
    "kunlun/skywork-or1-7b": {"huggingface": "https://huggingface.co/Skywork/Skywork-OR1-7B"},

    # InceptionAI / Falcon Arabic
    "inceptionai/jais-13b": {"huggingface": "https://huggingface.co/inceptionai/jais-13b-chat"},

    # IBM Granite 3.3 Code/Vision
    "ibm/granite-3.2-vision": {"huggingface": "https://huggingface.co/ibm-granite/granite-vision-3.2-2b"},

    # MIT Boltz
    "mit/boltzgen-1": {"huggingface": "https://huggingface.co/jwohlwend/boltz", "github": "https://github.com/jwohlwend/boltz"},

    # Polymathic
    "polymathic/walrus-1.3b": {"huggingface": "https://huggingface.co/PolymathicAI/Walrus", "github": "https://github.com/PolymathicAI/walrus"},
    "polymathic/aion-1": {"github": "https://github.com/PolymathicAI/AION-1"},

    # NVIDIA / Cosmos remaining
    "nvidia/nemotron-3-super": {"huggingface": "https://huggingface.co/nvidia/Llama-3.3-Nemotron-Super-49B-v1"},
    "nvidia/nemotron-3-nano-omni": {"huggingface": "https://huggingface.co/nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16"},

    # Jamba reasoning + maestro
    "ai21/jamba-reasoning": {"huggingface": "https://huggingface.co/ai21labs/AI21-Jamba-Reasoning-3B"},

    # Misc useful
    "huawei/pangu-ultra-moe": {"huggingface": "https://huggingface.co/huawei-noah/Pangu-Ultra-MoE"},
}


def main():
    apply_changes = "--apply" in sys.argv
    with open(ENRICHMENT_PATH) as f:
        enr = yaml.safe_load(f)
    if enr.get("models") is None:
        enr["models"] = {}

    added = 0
    touched = 0
    for mid, links in LINKS.items():
        if not links:
            continue
        existing = enr["models"].get(mid) or {}
        existing_links = existing.get("links") or {}
        before = len(existing_links)
        for k, v in links.items():
            if v and not existing_links.get(k):
                existing_links[k] = v
        if len(existing_links) > before:
            touched += 1
            added += len(existing_links) - before
        existing["links"] = existing_links
        enr["models"][mid] = existing

    print(f"Would touch {touched} models, adding {added} link fields.")

    if apply_changes:
        with open(ENRICHMENT_PATH, "w") as f:
            yaml.safe_dump(enr, f, sort_keys=False, allow_unicode=True, default_flow_style=False)
        print("Written.")
    else:
        print("Pass --apply to commit.")


if __name__ == "__main__":
    main()
