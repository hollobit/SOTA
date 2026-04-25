/**
 * Sovereign AI tab: compares regional/sovereign LLMs against frontier baselines
 * across three axes that frontier-only metrics don't capture:
 *   1. Language Adaptation       — regional language / cultural reasoning
 *   2. Medical System Integration — regional medical licensing / clinical
 *   3. Government / Regulated Domain — legal, finance, sovereign cyber
 *
 * Sovereign AI is the new axis of frontier competition in 2026: language
 * adaptation, healthcare-system fit, and government-policy alignment. This
 * tab makes those values legible alongside the global frontier leaderboard.
 */
var Sovereign = {
    REGIONS: [
        {
            code: 'kr', label: 'Korea', flag: '🇰🇷',
            note: '독자 AI 파운데이션 모델 5팀 (LG · KT · SKT · Upstage · Naver) + Kakao · NCSoft · Trillion · Motif · Konan · Saltlux · Samsung Gauss',
            models: [
                'lg/exaone-4.5-33b', 'lg/k-exaone-236b',
                'lg/exaone-4.0-32b', 'lg/exaone-4.0.1-32b', 'lg/exaone-4.0-1.2b',
                'lg/exaone-deep-32b', 'lg/exaone-deep-7.8b', 'lg/exaone-deep-2.4b',
                'lg/exaone-3.5-32b', 'lg/exaone-3.5-7.8b', 'lg/exaone-3.5-2.4b',
                'upstage/solar-pro-3', 'upstage/solar-open-100b',
                'upstage/solar-pro-2', 'upstage/solar-pro-2-preview',
                'upstage/solar-pro', 'upstage/solar-mini', 'upstage/solar-docvision',
                'skt/ax-k1', 'skt/ax-4.0', 'skt/ax-4.0-light', 'skt/ax-4.0-vl-light',
                'kt/midm-k2.5-pro', 'kt/midm-2.0-base', 'kt/midm-2.0-mini',
                'naver/hyperclova-x-think-32b', 'naver/hyperclova-x-think-14b',
                'naver/hyperclova-x-seed-omni-8b', 'naver/hyperclova-x-seed-vision-3b',
                'naver/hyperclova-x',
                'kakao/kanana-2-30b-a3b-thinking', 'kakao/kanana-1.5-8b',
                'kakao/kanana-1.5-15.7b-a3b', 'kakao/kanana-flag-32.5b',
                'ncsoft/varco-vision-2.0-14b', 'ncsoft/llama-varco-8b',
                'trillionlabs/tri-21b', 'trillionlabs/tri-7b',
                'motif/motif-2-12.7b-reasoning', 'motif/motif-2-12.7b-instruct',
                'konan/konan-llm-ond-4b', 'konan/konan-llm-ent-11',
                'saltlux/luxia-21.4b',
                'samsung/gauss-2-supreme', 'samsung/gauss-2-balanced', 'samsung/gauss-2-compact',
                'snuh-naver/kmed-ai',
                // Historical lineage
                'lg/exaone-3.0-7.8b', 'lg/exaone-atelier',
                'upstage/solar-10.7b',
                'kakao/kogpt-6b',
                'naver/hyperclova-x-hcx-003', 'naver/hyperclova-x-dash',
                'naver/hyperclova-seed-coder-8b', 'naver/clova-x', 'naver/cue',
                'kt/midm-1.0',
                'ncsoft/varco-llm-1.0-52b', 'ncsoft/varco-llm-13b',
                'trillionlabs/trillion-7b-preview',
                '42dot/42dot-llm-sft-1.3b', '42dot/42dot-llm-plm-1.3b',
                'eleutherai/polyglot-ko-12.8b', 'eleutherai/polyglot-ko-5.8b',
                'eleutherai/polyglot-ko-3.8b', 'eleutherai/polyglot-ko-1.3b',
                // Korean vertical AI
                'lunit/lunit-insight-mmg', 'lunit/lunit-scope-pdl1',
                'vuno/vuno-med-chest-xray', 'vuno/vuno-med-deepbrain',
                'lbox/lbox-caselaw',
                'riiid/riiid-tutor'
            ]
        },
        {
            code: 'fr', label: 'France', flag: '🇫🇷',
            note: '프랑스 sovereign frontier — Mistral 풀라인업 (Mistral 7B·Mixtral·Nemo·Saba·Codestral·Mathstral·Pixtral·Magistral·Devstral·Ministral·Voxtral) + PleIAs · Lucie · CroissantLLM · HuggingFace SmolLM',
            models: [
                // Mistral — flagship & frontier
                'mistral/mistral-large-3', 'mistral/mistral-medium-3.1', 'mistral/mistral-medium-3',
                'mistral/mistral-large-2', 'mistral/mistral-large-1',
                'mistral/mistral-small-4', 'mistral/mistral-small-3.2', 'mistral/mistral-small-3.1', 'mistral/mistral-small-3', 'mistral/mistral-small-2', 'mistral/mistral-small-1',
                // Mistral — reasoning
                'mistral/magistral-medium-1.2', 'mistral/magistral-small-1.2', 'mistral/magistral-medium-1', 'mistral/magistral-small-1',
                // Mistral — code
                'mistral/devstral-2', 'mistral/devstral-medium', 'mistral/devstral-small-2', 'mistral/devstral-small-1.1', 'mistral/devstral-small-1',
                'mistral/codestral-25.08', 'mistral/codestral-22b', 'mistral/codestral-mamba-7b',
                // Mistral — math
                'mistral/mathstral-7b',
                // Mistral — vision / multimodal / audio
                'mistral/pixtral-large', 'mistral/pixtral-12b', 'mistral/voxtral-tts',
                // Mistral — Ministraux (edge)
                'mistral/ministral-3-14b', 'mistral/ministral-3-8b', 'mistral/ministral-3-3b',
                'mistral/ministral-8b-v1', 'mistral/ministral-3b-v1',
                // Mistral — original / regional
                'mistral/mistral-7b', 'mistral/mixtral-8x7b', 'mistral/mixtral-8x22b',
                'mistral/mistral-nemo-12b', 'mistral/mistral-saba-24b',
                // PleIAs (Common Corpus)
                'pleias/pleias-1.0-pico-3.5b', 'pleias/pleias-1.0-olmo-1b',
                'pleias/pleias-rag-1b', 'pleias/pleias-rag-350m',
                // CNRS / academic
                'openllm-france/lucie-7b', 'croissantllm/croissant-1.3b',
                // Hugging Face SmolLM family
                'huggingface/smollm3-3b', 'huggingface/smollm2-1.7b', 'huggingface/smollm2-360m', 'huggingface/smollm2-135m', 'huggingface/smollm-1.7b'
            ]
        },
        {
            code: 'cn', label: 'China', flag: '🇨🇳',
            note: '중국 frontier 전체 — Qwen 풀+specialists · DeepSeek (V3-V4/R1/Coder/Math/VL) · Kimi · GLM · Hunyuan · ERNIE · Doubao · iFlytek Spark · Yi · Baichuan · InternLM · SenseNova · Skywork · MiniCPM · PanGu · Aquila · MOSS · Yuan',
            models: [
                // Alibaba Qwen — full param lineup
                'alibaba/qwen3.6-plus', 'alibaba/qwen3.6-27b', 'alibaba/qwen3.6-35b-a3b',
                'alibaba/qwen3.5-397b', 'alibaba/qwen3.5-122b', 'alibaba/qwen3.5-27b',
                'alibaba/qwen3-235b-a22b-thinking-2507', 'alibaba/qwen3-235b-a22b-instruct-2507', 'alibaba/qwen3-235b-a22b',
                'alibaba/qwen3-30b-a3b', 'alibaba/qwen3-32b', 'alibaba/qwen3-14b', 'alibaba/qwen3-8b', 'alibaba/qwen3-4b', 'alibaba/qwen3-1.7b', 'alibaba/qwen3-0.6b',
                'alibaba/qwen3-next',
                'alibaba/qwen2.5-72b', 'alibaba/qwen2.5-32b', 'alibaba/qwen2.5-14b', 'alibaba/qwen2.5-7b',
                // DeepSeek
                'deepseek/deepseek-v4-pro-max', 'deepseek/deepseek-v4-pro', 'deepseek/deepseek-v4-flash',
                'deepseek/deepseek-v3.2', 'deepseek/deepseek-v3.2-speciale',
                'deepseek/deepseek-v3.1-terminus', 'deepseek/deepseek-v3',
                'deepseek/deepseek-r1-0528', 'deepseek/deepseek-r1',
                // Zhipu GLM
                'zhipu/glm-5.1', 'zhipu/glm-5', 'zhipu/glm-4.7', 'zhipu/glm-4.6', 'zhipu/glm-4.5', 'zhipu/glm-4.5-air',
                // Moonshot Kimi
                'moonshot/kimi-k2.6', 'moonshot/kimi-k2.5', 'moonshot/kimi-k2-thinking',
                'moonshot/kimi-k2-instruct', 'moonshot/kimi-k2-base', 'moonshot/kimi-k1.5',
                // MiniMax / MiMo / StepFun
                'minimax/m2.7', 'minimax/m2.5',
                'mimo/mimo-v2-pro', 'mimo/mimo-v2-flash',
                'stepfun/step-3.5-flash', 'stepfun/step-2-pro', 'stepfun/step-2-mini',
                // Baidu ERNIE
                'baidu/ernie-5.0', 'baidu/ernie-4.5-300b-a47b', 'baidu/ernie-4.5-turbo', 'baidu/ernie-speed', 'baidu/ernie-lite',
                // Tencent Hunyuan
                'tencent/hunyuan-t1', 'tencent/hunyuan-large', 'tencent/hunyuan-turbo', 'tencent/hunyuan-7b',
                // ByteDance Doubao Seed
                'bytedance/seed-2.0-pro', 'bytedance/seed-1.6', 'bytedance/seed-1.5-pro', 'bytedance/seed-1.5-lite',
                // iFlytek Spark (state-backed)
                'iflytek/spark-x1', 'iflytek/spark-4-ultra', 'iflytek/spark-4', 'iflytek/antelope-3.0',
                // 01.AI (Lee Kai-Fu)
                '01-ai/yi-lightning', '01-ai/yi-large', '01-ai/yi-1.5-34b', '01-ai/yi-1.5-9b', '01-ai/yi-1.5-6b',
                '01-ai/yi-coder-9b', '01-ai/yi-vl-34b',
                // Baichuan
                'baichuan/baichuan-4', 'baichuan/baichuan-3', 'baichuan/baichuan-2-13b', 'baichuan/baichuan-2-7b',
                'baichuan/baichuan-m1-14b', 'baichuan/baichuan-omni-1.5',
                // Shanghai AI Lab — InternLM/InternVL
                'shanghai-ai-lab/internlm-3-8b', 'shanghai-ai-lab/internlm-2.5-20b',
                'shanghai-ai-lab/internlm-2.5-7b', 'shanghai-ai-lab/internlm-2.5-1.8b',
                'shanghai-ai-lab/internvl-3', 'shanghai-ai-lab/internvl-2.5',
                // SenseTime
                'sensetime/sensenova-v6', 'sensetime/sensechat-5', 'sensetime/sensenova',
                // Skywork (Kunlun)
                'skywork/skywork-moe', 'skywork/skywork-13b', 'skywork/skywork-r1v-3', 'skywork/skywork-o1',
                // OpenBMB MiniCPM (Tsinghua)
                'openbmb/minicpm-4.1-8b', 'openbmb/minicpm-4-8b', 'openbmb/minicpm-3-4b',
                'openbmb/minicpm-v-2.6', 'openbmb/minicpm-o-2.6',
                // Huawei PanGu
                'huawei/pangu-ultra-moe', 'huawei/pangu-5', 'huawei/pangu-embedding',
                // BAAI Aquila / Wudao
                'baai/aquila2-34b', 'baai/aquila2-7b', 'baai/wudao-2',
                // Fudan / Inspur
                'fnlp/moss-2', 'ieit/yuan-2.0',
                // Qwen specialists (reasoning, vision, code, math, audio)
                'alibaba/qwq-32b', 'alibaba/qvq-72b-preview',
                'alibaba/qwen2.5-coder-32b', 'alibaba/qwen2.5-coder-14b', 'alibaba/qwen2.5-coder-7b',
                'alibaba/qwen2.5-math-72b', 'alibaba/qwen2.5-math-7b',
                'alibaba/qwen2-vl-72b', 'alibaba/qwen3-vl-235b', 'alibaba/qwen2-audio',
                // DeepSeek specialists
                'deepseek/deepseek-coder-v2', 'deepseek/deepseek-coder-v2-lite',
                'deepseek/deepseek-math-7b', 'deepseek/deepseek-vl2', 'deepseek/janus-pro-7b',
                // Medical specialist
                'freedomintelligence/huatuogpt-ii'
            ]
        },
        {
            code: 'jp', label: 'Japan', flag: '🇯🇵',
            note: 'Sakana AI evolutionary models',
            models: ['sakana/namazu']
        },
        {
            code: 'in', label: 'India', flag: '🇮🇳',
            note: '독자 sovereign AI Mission — Sarvam · BharatGen · Krutrim · Soket AI · AI4Bharat · BharatGPT + Tata MAITRI · Reliance JioBrain · L&T-Vyoma',
            models: [
                // Sarvam — full lineup (incl. MoE 30B/105B)
                'sarvam/sarvam-105b', 'sarvam/sarvam-30b',
                'sarvam/sarvam-m', 'sarvam/sarvam-1',
                // BharatGen (govt-funded IIT Bombay TIH)
                'bharatgen/param2-17b', 'bharatgen/param-1-2.9b',
                'bharatgen/param2-sutra', 'bharatgen/param-1t-roadmap',
                // Krutrim (Ola)
                'ola/krutrim-2-12b', 'ola/krutrim-spectre', 'ola/krutrim',
                // Soket AI (Project EKA)
                'soketai/sutra-pro', 'soketai/sutra-light',
                'soketai/pragna-1b', 'soketai/eka-roadmap',
                // AI4Bharat (IIT Madras govt-backed)
                'ai4bharat/indicllm', 'ai4bharat/indicbert-v2', 'ai4bharat/indictrans2',
                // CoRover
                'corover/bharatgpt',
                // Conglomerate / industry-led (announced)
                'reliance/jiobrain', 'tata/maitri', 'lt-vyoma/sovereign-ai'
            ]
        },
        {
            code: 'il', label: 'Israel', flag: '🇮🇱',
            note: 'AI21 Jamba 풀라인업 (1.0/1.5/1.6/1.7/Jamba2 + Reasoning + Maestro) + DICTA Hebrew sovereign LLM',
            models: [
                // AI21 Jamba — flagships (latest first)
                'ai21/jamba2-mini', 'ai21/jamba2-3b', 'ai21/jamba-reasoning', 'ai21/maestro',
                'ai21/jamba-large-1.7', 'ai21/jamba-1.7-mini',
                'ai21/jamba-1.6-large', 'ai21/jamba-1.6-mini',
                'ai21/jamba-large-1.5', 'ai21/jamba-1.5-mini',
                'ai21/jamba-1.0',
                // DICTA — Hebrew sovereign LLM
                'dicta/dictalm-3.0-24b',
                'dicta/dictalm-2.0-instruct', 'dicta/dictalm-2.0'
            ]
        },
        {
            code: 'ae', label: 'UAE', flag: '🇦🇪',
            note: 'TII Falcon-H1/H1R/Falcon3/Mamba/Falcon2/180B + MBZUAI K2/Atlas-Chat/BiMediX (Arabic)',
            models: [
                // TII Falcon-H1 family (May 2025)
                'tii/falcon-h1-34b', 'tii/falcon-h1-arabic-34b', 'tii/falcon-h1r-7b', 'tii/falcon-h1-7b',
                'tii/falcon-h1-3b', 'tii/falcon-h1-1.5b-deep', 'tii/falcon-h1-1.5b', 'tii/falcon-h1-0.5b',
                // TII Falcon3 family (Dec 2024)
                'tii/falcon3-10b', 'tii/falcon3-7b', 'tii/falcon3-3b', 'tii/falcon3-1b',
                // TII older
                'tii/falcon-mamba-7b', 'tii/falcon2-11b', 'tii/falcon-180b', 'tii/falcon-perception',
                // MBZUAI
                'mbzuai/llm360-k2-65b', 'mbzuai/atlas-chat-9b', 'mbzuai/bimedix'
            ]
        },
        {
            code: 'sg', label: 'Singapore', flag: '🇸🇬',
            note: 'AI Singapore SEA-LION 풀라인업 (Llama/Gemma2/Apertus 기반) + GoTo Sahabat-AI (인도네시아어)',
            models: [
                'ai-singapore/apertus-sea-lion-v4-8b', 'ai-singapore/gemma-sea-lion-v4-4b-vl',
                'ai-singapore/llama-sea-lion-v3.5-70b', 'ai-singapore/llama-sea-lion-v3.5-8b',
                'ai-singapore/gemma2-sea-lion-v3-9b', 'ai-singapore/sea-lion-v2.1-7b',
                'gotoai/sahabat-ai-v1-70b', 'gotoai/sahabat-ai-v1-8b'
            ]
        },
        {
            code: 'ch', label: 'Switzerland', flag: '🇨🇭',
            note: 'EPFL Meditron / Apertus (의료·인도주의)',
            models: ['epfl/meditron-70b', 'epfl/meditron-7b', 'epfl/llama-3-meditron-70b']
        },
        {
            code: 'us-legal', label: 'US (Legal AI)', flag: '⚖️',
            note: 'Vertical legal AI (Harvey · CoCounsel · Vincent · Oliver)',
            models: [
                'harvey/harvey-assistant',
                'thomson-reuters/cocounsel-2',
                'vlex/vincent-ai',
                'vecflow/oliver'
            ]
        },
        {
            code: 'us-fin', label: 'US (Finance)', flag: '💰',
            note: 'Bloomberg sovereign-data finance LLM',
            models: ['bloomberg/bloomberg-gpt']
        },
        {
            code: 'ru', label: 'Russia', flag: '🇷🇺',
            note: 'Yandex YandexGPT 5 + Sber GigaChat 1/2/3 (incl. 3 Ultra Preview 702B-A36B MoE) + Vikhr opensource + T-Bank',
            models: [
                'yandex/yandexgpt-5-pro', 'yandex/yandexgpt-5-lite-8b', 'yandex/yandexgpt-4-pro', 'yandex/yalm-100b',
                'sber/gigachat-3-ultra', 'sber/gigachat-3-lightning',
                'sber/gigachat-2-max', 'sber/gigachat-2-pro', 'sber/gigachat-2-lite', 'sber/gigachat-1.5',
                'sber/rugpt-3.5-13b',
                'vikhrmodels/vikhr-nemo-12b', 'vikhrmodels/vikhr-yandexgpt-5-lite-8b',
                'tbank/t-pro-1', 'tbank/t-lite-1'
            ]
        },
        {
            code: 'de', label: 'Germany', flag: '🇩🇪',
            note: 'Aleph Alpha Pharia (sovereign EU AI Act compliant) + Black Forest Labs FLUX (image gen) + TNG DeepSeek Chimera',
            models: [
                'aleph-alpha/pharia-1-7b-control', 'aleph-alpha/pharia-1-7b-control-aligned',
                'aleph-alpha/pharia-2-tfree', 'aleph-alpha/luminous',
                'black-forest-labs/flux.1-pro', 'black-forest-labs/flux.1-dev', 'black-forest-labs/flux.1-schnell',
                'black-forest-labs/flux.1-kontext-pro', 'black-forest-labs/flux.1-kontext-dev',
                'tngtech/r1t-chimera', 'tngtech/r1t2-chimera'
            ]
        },
        {
            code: 'uk', label: 'United Kingdom', flag: '🇬🇧',
            note: 'Stability AI (StableLM/Stable Diffusion) + Synthesia + Wayve · UK Sovereign AI Fund £500M (2025)',
            models: [
                'stabilityai/stablelm-2-12b', 'stabilityai/stablelm-2-1.6b',
                'stabilityai/stable-code-3b', 'stabilityai/stable-lm-zephyr-3b',
                'stabilityai/sd-3.5-large',
                'synthesia/synthesia-vlm', 'wayve/lingo-2'
            ]
        },
        {
            code: 'us-open', label: 'US (Open-source / Open-weight)', flag: '🇺🇸',
            note: 'Meta Llama 4 (Behemoth/Maverick/Scout) + Llama 3.1-3.3 · Microsoft Phi-4 family · Google Gemma 3 · IBM Granite 3 · Allen AI OLMo 2 · Databricks DBRX · Snowflake Arctic · Cohere Command · xAI Grok-1 · StarCoder 2',
            models: [
                // Meta Llama 4 + 3.x
                'meta/llama-4-behemoth', 'meta/llama-4-maverick', 'meta/llama-4-scout',
                'meta/llama-3.3-70b',
                'meta/llama-3.2-90b-vision', 'meta/llama-3.2-11b-vision', 'meta/llama-3.2-3b', 'meta/llama-3.2-1b',
                'meta/llama-3.1-405b', 'meta/llama-3.1-70b', 'meta/llama-3.1-8b',
                // Microsoft Phi-4
                'microsoft/phi-4', 'microsoft/phi-4-mini', 'microsoft/phi-4-multimodal', 'microsoft/phi-4-reasoning',
                'microsoft/phi-3.5-mini',
                // Google Gemma
                'google/gemma-3-27b', 'google/gemma-3-12b', 'google/gemma-3-4b', 'google/gemma-3-1b',
                'google/gemma-2-27b', 'google/gemma-2-9b',
                // IBM Granite
                'ibm/granite-3.3-8b', 'ibm/granite-3.3-2b', 'ibm/granite-3.2-vision', 'ibm/granite-3.1-8b',
                // Allen AI
                'allenai/olmo-2-13b', 'allenai/olmo-2-7b', 'allenai/tulu-3-70b', 'allenai/molmo-72b',
                // Databricks / Snowflake
                'databricks/dbrx-instruct',
                'snowflake/arctic-instruct',
                // Cohere
                'cohere/command-a', 'cohere/command-r-plus', 'cohere/command-r', 'cohere/aya-expanse-32b',
                // xAI
                'xai/grok-1',
                // StarCoder
                'bigcode/starcoder2-15b', 'bigcode/starcoder2-7b'
            ]
        },
        {
            code: 'darpa', label: 'DARPA AIxCC', flag: '🛡️',
            note: 'DARPA 국방·도메인 Cyber Reasoning System',
            models: ['darpa/aixcc-team-atlanta']
        },
        {
            code: 'mfg-industrial', label: 'Manufacturing & Industrial', flag: '🏭',
            note: 'Foxconn FoxBrain · Siemens SIFM · Hitachi HAL · GE Vernova · Bosch · AVEVA',
            models: [
                'foxconn/foxbrain-70b',
                'siemens/sifm',
                'hitachi/hal',
                'ge-vernova/predix-ai',
                'bosch/industrial-genai',
                'aveva/industrial-ai-assistant'
            ]
        },
        {
            code: 'mfg-robots', label: 'Industrial Robotics', flag: '🤖',
            note: 'Skild · Covariant · Figure · 1X · Apptronik · Agility · Sanctuary · Tesla · Gemini Robotics-ER',
            models: [
                'skild/skild-brain',
                'covariant/rfm-1',
                'figure-ai/helix',
                '1x/world-model',
                'apptronik/apollo-gemini',
                'agility/digit-arc',
                'sanctuary/carbon',
                'tesla/optimus-vlm',
                'google-deepmind/gemini-robotics-er-1.6',
                'google-deepmind/gemini-robotics-er-1.5'
            ]
        },
        {
            code: 'mfg-cad-vision', label: 'Industrial CAD / Vision / Twin', flag: '⚙️',
            note: 'Autodesk Bernini · NVIDIA Omniverse Mega · Landing AI · PTC · Dassault',
            models: [
                'autodesk/bernini',
                'nvidia/omniverse-mega',
                'landing-ai/visionagent',
                'ptc/creo-copilot',
                'dassault/3dx-aura'
            ]
        }
    ],

    // Release / announcement dates (YYYY-MM, or YYYY when month is unknown).
    // Used for sorting newest-first and surfacing the year next to model names.
    RELEASE_DATES: {
        // Korea — LG
        'lg/exaone-4.5-33b': '2025-11', 'lg/k-exaone-236b': '2025-08',
        'lg/exaone-4.0.1-32b': '2025-09', 'lg/exaone-4.0-32b': '2025-07', 'lg/exaone-4.0-1.2b': '2025-07',
        'lg/exaone-deep-32b': '2025-03', 'lg/exaone-deep-7.8b': '2025-03', 'lg/exaone-deep-2.4b': '2025-03',
        'lg/exaone-3.5-32b': '2024-12', 'lg/exaone-3.5-7.8b': '2024-12', 'lg/exaone-3.5-2.4b': '2024-12',
        // Korea — Upstage
        'upstage/solar-pro-3': '2026-03', 'upstage/solar-open-100b': '2025-10',
        'upstage/solar-pro-2': '2025-08', 'upstage/solar-pro-2-preview': '2025-06',
        'upstage/solar-pro': '2024-09', 'upstage/solar-mini': '2024-04', 'upstage/solar-docvision': '2025',
        // Korea — SKT
        'skt/ax-k1': '2025-09', 'skt/ax-4.0': '2025-07', 'skt/ax-4.0-light': '2025-07', 'skt/ax-4.0-vl-light': '2025-09',
        // Korea — KT
        'kt/midm-k2.5-pro': '2025-10', 'kt/midm-2.0-base': '2025-07', 'kt/midm-2.0-mini': '2025-07',
        // Korea — Naver
        'naver/hyperclova-x-think-32b': '2025-12', 'naver/hyperclova-x-think-14b': '2025-06',
        'naver/hyperclova-x-seed-omni-8b': '2025-07', 'naver/hyperclova-x-seed-vision-3b': '2025-04',
        'naver/hyperclova-x': '2024-08',
        // Korea — Kakao
        'kakao/kanana-2-30b-a3b-thinking': '2025-12', 'kakao/kanana-1.5-15.7b-a3b': '2025-09',
        'kakao/kanana-1.5-8b': '2025-05', 'kakao/kanana-flag-32.5b': '2024-11',
        // Korea — others
        'ncsoft/varco-vision-2.0-14b': '2025-07', 'ncsoft/llama-varco-8b': '2024-09',
        'trillionlabs/tri-21b': '2025-02', 'trillionlabs/tri-7b': '2025-04',
        'motif/motif-2-12.7b-reasoning': '2025-11', 'motif/motif-2-12.7b-instruct': '2025-11',
        'konan/konan-llm-ond-4b': '2025-09', 'konan/konan-llm-ent-11': '2025-06',
        'saltlux/luxia-21.4b': '2024-03',
        'samsung/gauss-2-supreme': '2024-11', 'samsung/gauss-2-balanced': '2024-11', 'samsung/gauss-2-compact': '2024-11',
        'snuh-naver/kmed-ai': '2025',
        // Korea — historical lineage
        'lg/exaone-3.0-7.8b': '2024-08', 'lg/exaone-atelier': '2024-04',
        'upstage/solar-10.7b': '2023-12',
        'kakao/kogpt-6b': '2021-11',
        'naver/hyperclova-x-hcx-003': '2024-04', 'naver/hyperclova-x-dash': '2024-08',
        'naver/hyperclova-seed-coder-8b': '2025-04', 'naver/clova-x': '2023-08', 'naver/cue': '2023-09',
        'kt/midm-1.0': '2023-10',
        'ncsoft/varco-llm-1.0-52b': '2023-08', 'ncsoft/varco-llm-13b': '2023-09',
        'trillionlabs/trillion-7b-preview': '2024-09',
        '42dot/42dot-llm-sft-1.3b': '2023-09', '42dot/42dot-llm-plm-1.3b': '2023-09',
        'eleutherai/polyglot-ko-12.8b': '2023-04', 'eleutherai/polyglot-ko-5.8b': '2023-04',
        'eleutherai/polyglot-ko-3.8b': '2023-04', 'eleutherai/polyglot-ko-1.3b': '2023-04',
        // Korean vertical AI
        'lunit/lunit-insight-mmg': '2024-03', 'lunit/lunit-scope-pdl1': '2024-09',
        'vuno/vuno-med-chest-xray': '2024-01', 'vuno/vuno-med-deepbrain': '2024-06',
        'lbox/lbox-caselaw': '2024-05',
        'riiid/riiid-tutor': '2024-03',

        // China — DeepSeek
        'deepseek/deepseek-v4-pro-max': '2026-04', 'deepseek/deepseek-v4-pro': '2026-04', 'deepseek/deepseek-v4-flash': '2026-04',
        'deepseek/deepseek-v3.2': '2025-09', 'deepseek/deepseek-v3.2-speciale': '2025-10',
        'deepseek/deepseek-v3.1-terminus': '2025-09', 'deepseek/deepseek-v3': '2024-12',
        'deepseek/deepseek-r1-0528': '2025-05', 'deepseek/deepseek-r1': '2025-01',
        // China — Alibaba Qwen
        'alibaba/qwen3.6-plus': '2026-04', 'alibaba/qwen3.6-27b': '2026-04', 'alibaba/qwen3.6-35b-a3b': '2026-04',
        'alibaba/qwen3.5-397b': '2025-12', 'alibaba/qwen3.5-122b': '2025-12', 'alibaba/qwen3.5-27b': '2025-12',
        'alibaba/qwen3-235b-a22b-thinking-2507': '2025-07', 'alibaba/qwen3-235b-a22b-instruct-2507': '2025-07', 'alibaba/qwen3-235b-a22b': '2025-04',
        'alibaba/qwen3-30b-a3b': '2025-04',
        'alibaba/qwen3-32b': '2025-04', 'alibaba/qwen3-14b': '2025-04', 'alibaba/qwen3-8b': '2025-04',
        'alibaba/qwen3-4b': '2025-04', 'alibaba/qwen3-1.7b': '2025-04', 'alibaba/qwen3-0.6b': '2025-04',
        'alibaba/qwen3-next': '2025-09',
        'alibaba/qwen2.5-72b': '2024-09', 'alibaba/qwen2.5-32b': '2024-09', 'alibaba/qwen2.5-14b': '2024-09', 'alibaba/qwen2.5-7b': '2024-09',
        // China — Zhipu GLM
        'zhipu/glm-5.1': '2026-03', 'zhipu/glm-5': '2025-10', 'zhipu/glm-4.7': '2025-09',
        'zhipu/glm-4.6': '2025-09', 'zhipu/glm-4.5': '2025-07', 'zhipu/glm-4.5-air': '2025-07',
        // China — Moonshot Kimi
        'moonshot/kimi-k2.6': '2026-04', 'moonshot/kimi-k2.5': '2026-01', 'moonshot/kimi-k2-thinking': '2025-09',
        'moonshot/kimi-k2-instruct': '2025-07', 'moonshot/kimi-k2-base': '2025-07', 'moonshot/kimi-k1.5': '2025-01',
        // China — MiniMax / MiMo / StepFun
        'minimax/m2.7': '2026-03', 'minimax/m2.5': '2025-09',
        'mimo/mimo-v2-pro': '2025-12', 'mimo/mimo-v2-flash': '2025-12',
        'stepfun/step-3.5-flash': '2025-12', 'stepfun/step-2-pro': '2024-12', 'stepfun/step-2-mini': '2024-08',
        // China — Baidu ERNIE
        'baidu/ernie-5.0': '2025-11', 'baidu/ernie-4.5-300b-a47b': '2025-06', 'baidu/ernie-4.5-turbo': '2025-04',
        'baidu/ernie-speed': '2024-03', 'baidu/ernie-lite': '2024-03',
        // China — Tencent Hunyuan
        'tencent/hunyuan-t1': '2025-03', 'tencent/hunyuan-large': '2024-11', 'tencent/hunyuan-turbo': '2024-11', 'tencent/hunyuan-7b': '2024-11',
        // China — ByteDance Doubao Seed
        'bytedance/seed-2.0-pro': '2026-02', 'bytedance/seed-1.6': '2025-09', 'bytedance/seed-1.5-pro': '2025-04', 'bytedance/seed-1.5-lite': '2025-04',
        // China — iFlytek Spark
        'iflytek/spark-x1': '2025-04', 'iflytek/spark-4-ultra': '2024-10', 'iflytek/spark-4': '2024-06', 'iflytek/antelope-3.0': '2025-09',
        // China — 01.AI
        '01-ai/yi-lightning': '2024-11', '01-ai/yi-large': '2024-05',
        '01-ai/yi-1.5-34b': '2024-05', '01-ai/yi-1.5-9b': '2024-05', '01-ai/yi-1.5-6b': '2024-05',
        '01-ai/yi-coder-9b': '2024-09', '01-ai/yi-vl-34b': '2024-01',
        // China — Baichuan
        'baichuan/baichuan-4': '2024-05', 'baichuan/baichuan-3': '2024-01',
        'baichuan/baichuan-2-13b': '2023-09', 'baichuan/baichuan-2-7b': '2023-09',
        'baichuan/baichuan-m1-14b': '2025-01', 'baichuan/baichuan-omni-1.5': '2025-01',
        // China — Shanghai AI Lab InternLM
        'shanghai-ai-lab/internlm-3-8b': '2025-01', 'shanghai-ai-lab/internlm-2.5-20b': '2024-08',
        'shanghai-ai-lab/internlm-2.5-7b': '2024-07', 'shanghai-ai-lab/internlm-2.5-1.8b': '2024-08',
        'shanghai-ai-lab/internvl-3': '2025-04', 'shanghai-ai-lab/internvl-2.5': '2024-12',
        // China — SenseTime
        'sensetime/sensenova-v6': '2025-04', 'sensetime/sensechat-5': '2024-04', 'sensetime/sensenova': '2023-04',
        // China — Skywork
        'skywork/skywork-moe': '2024-06', 'skywork/skywork-13b': '2023-10',
        'skywork/skywork-r1v-3': '2025-04', 'skywork/skywork-o1': '2024-11',
        // China — OpenBMB MiniCPM
        'openbmb/minicpm-4.1-8b': '2025-09', 'openbmb/minicpm-4-8b': '2025-06', 'openbmb/minicpm-3-4b': '2024-09',
        'openbmb/minicpm-v-2.6': '2024-08', 'openbmb/minicpm-o-2.6': '2025-01',
        // China — Huawei PanGu
        'huawei/pangu-ultra-moe': '2025-05', 'huawei/pangu-5': '2025-04', 'huawei/pangu-embedding': '2025-06',
        // China — BAAI Aquila
        'baai/aquila2-34b': '2024-04', 'baai/aquila2-7b': '2023-10', 'baai/wudao-2': '2021-06',
        // China — Fudan / Inspur
        'fnlp/moss-2': '2024-08', 'ieit/yuan-2.0': '2023-12',
        // China — Qwen specialists
        'alibaba/qwq-32b': '2025-03', 'alibaba/qvq-72b-preview': '2024-12',
        'alibaba/qwen2.5-coder-32b': '2024-11', 'alibaba/qwen2.5-coder-14b': '2024-11', 'alibaba/qwen2.5-coder-7b': '2024-09',
        'alibaba/qwen2.5-math-72b': '2024-09', 'alibaba/qwen2.5-math-7b': '2024-09',
        'alibaba/qwen2-vl-72b': '2024-08', 'alibaba/qwen3-vl-235b': '2025-09', 'alibaba/qwen2-audio': '2024-08',
        // China — DeepSeek specialists
        'deepseek/deepseek-coder-v2': '2024-06', 'deepseek/deepseek-coder-v2-lite': '2024-06',
        'deepseek/deepseek-math-7b': '2024-02', 'deepseek/deepseek-vl2': '2024-12', 'deepseek/janus-pro-7b': '2025-01',
        // China — medical
        'freedomintelligence/huatuogpt-ii': '2024-05',

        // France — Mistral flagship + reasoning
        'mistral/mistral-large-3': '2025-12', 'mistral/mistral-large-2': '2024-07', 'mistral/mistral-large-1': '2024-02',
        'mistral/mistral-medium-3.1': '2025-09', 'mistral/mistral-medium-3': '2025-05',
        'mistral/mistral-small-4': '2026-02', 'mistral/mistral-small-3.2': '2025-07', 'mistral/mistral-small-3.1': '2025-03', 'mistral/mistral-small-3': '2025-01', 'mistral/mistral-small-2': '2024-09', 'mistral/mistral-small-1': '2023-09',
        'mistral/magistral-medium-1.2': '2025-09', 'mistral/magistral-small-1.2': '2025-09',
        'mistral/magistral-medium-1': '2025-06', 'mistral/magistral-small-1': '2025-06',
        // France — Mistral code
        'mistral/devstral-2': '2025-12', 'mistral/devstral-medium': '2025-09', 'mistral/devstral-small-2': '2025-12', 'mistral/devstral-small-1.1': '2025-07', 'mistral/devstral-small-1': '2025-05',
        'mistral/codestral-25.08': '2025-08', 'mistral/codestral-22b': '2024-05', 'mistral/codestral-mamba-7b': '2024-07',
        // France — Mistral math/vision/audio
        'mistral/mathstral-7b': '2024-07',
        'mistral/pixtral-large': '2024-11', 'mistral/pixtral-12b': '2024-09',
        'mistral/voxtral-tts': '2025-04',
        // France — Ministraux
        'mistral/ministral-3-14b': '2025-10', 'mistral/ministral-3-8b': '2025-10', 'mistral/ministral-3-3b': '2025-10',
        'mistral/ministral-8b-v1': '2024-10', 'mistral/ministral-3b-v1': '2024-10',
        // France — Mistral original / regional
        'mistral/mistral-7b': '2023-09', 'mistral/mixtral-8x7b': '2023-12', 'mistral/mixtral-8x22b': '2024-04',
        'mistral/mistral-nemo-12b': '2024-07', 'mistral/mistral-saba-24b': '2025-02',
        // France — PleIAs
        'pleias/pleias-1.0-pico-3.5b': '2024-11', 'pleias/pleias-1.0-olmo-1b': '2024-11',
        'pleias/pleias-rag-1b': '2025-03', 'pleias/pleias-rag-350m': '2025-03',
        // France — CNRS / academic
        'openllm-france/lucie-7b': '2025-01', 'croissantllm/croissant-1.3b': '2024-02',
        // France — HuggingFace SmolLM
        'huggingface/smollm3-3b': '2025-07', 'huggingface/smollm2-1.7b': '2024-11', 'huggingface/smollm2-360m': '2024-11', 'huggingface/smollm2-135m': '2024-11', 'huggingface/smollm-1.7b': '2024-07',

        // Japan / India / Israel / UAE / SG / CH / US
        'sakana/namazu': '2024-03',
        // Singapore — SEA-LION lineup
        'ai-singapore/apertus-sea-lion-v4-8b': '2025-04', 'ai-singapore/gemma-sea-lion-v4-4b-vl': '2025-04',
        'ai-singapore/llama-sea-lion-v3.5-70b': '2025-03', 'ai-singapore/llama-sea-lion-v3.5-8b': '2025-03',
        'ai-singapore/gemma2-sea-lion-v3-9b': '2024-10', 'ai-singapore/sea-lion-v2.1-7b': '2024-04',
        'gotoai/sahabat-ai-v1-70b': '2024-12', 'gotoai/sahabat-ai-v1-8b': '2024-12',
        // India — Sarvam
        'sarvam/sarvam-1': '2024-10', 'sarvam/sarvam-m': '2025-05',
        'sarvam/sarvam-30b': '2025-09', 'sarvam/sarvam-105b': '2025-09',
        // India — BharatGen
        'bharatgen/param2-17b': '2025-07', 'bharatgen/param-1-2.9b': '2025-02',
        'bharatgen/param2-sutra': '2026-02', 'bharatgen/param-1t-roadmap': '2026-01',
        // India — Krutrim
        'ola/krutrim-2-12b': '2025-01', 'ola/krutrim-spectre': '2025-06', 'ola/krutrim': '2024-12',
        // India — Soket AI
        'soketai/pragna-1b': '2024-04', 'soketai/sutra-pro': '2024-11', 'soketai/sutra-light': '2024-11', 'soketai/eka-roadmap': '2025-09',
        // India — AI4Bharat
        'ai4bharat/indicllm': '2024-12', 'ai4bharat/indicbert-v2': '2024-08', 'ai4bharat/indictrans2': '2024-04',
        // India — CoRover / industry
        'corover/bharatgpt': '2024-01',
        'reliance/jiobrain': '2024-11', 'tata/maitri': '2024-10', 'lt-vyoma/sovereign-ai': '2026-01',
        // Israel — AI21 Jamba
        'ai21/jamba-large-1.7': '2025-08', 'ai21/jamba-1.7-mini': '2025-07',
        'ai21/jamba-1.6-large': '2025-03', 'ai21/jamba-1.6-mini': '2025-03',
        'ai21/jamba-large-1.5': '2024-08', 'ai21/jamba-1.5-mini': '2024-08',
        'ai21/jamba-1.0': '2024-03',
        'ai21/jamba2-mini': '2026-02', 'ai21/jamba2-3b': '2026-02',
        'ai21/jamba-reasoning': '2025-09', 'ai21/maestro': '2025-04',
        // Israel — Dicta
        'dicta/dictalm-3.0-24b': '2025-09', 'dicta/dictalm-2.0-instruct': '2024-07', 'dicta/dictalm-2.0': '2024-04',
        // UAE — TII Falcon-H1 (May 2025)
        'tii/falcon-h1-34b': '2025-05', 'tii/falcon-h1-arabic-34b': '2025-08', 'tii/falcon-h1r-7b': '2025-11',
        'tii/falcon-h1-7b': '2025-05', 'tii/falcon-h1-3b': '2025-05',
        'tii/falcon-h1-1.5b-deep': '2025-05', 'tii/falcon-h1-1.5b': '2025-05', 'tii/falcon-h1-0.5b': '2025-05',
        // UAE — Falcon3 (Dec 2024)
        'tii/falcon3-10b': '2024-12', 'tii/falcon3-7b': '2024-12', 'tii/falcon3-3b': '2024-12', 'tii/falcon3-1b': '2024-12',
        // UAE — older Falcon
        'tii/falcon-mamba-7b': '2024-08', 'tii/falcon2-11b': '2024-05', 'tii/falcon-180b': '2023-09', 'tii/falcon-perception': '2025-03',
        // UAE — MBZUAI
        'mbzuai/llm360-k2-65b': '2024-08', 'mbzuai/atlas-chat-9b': '2024-09', 'mbzuai/bimedix': '2024-02',
        'epfl/meditron-70b': '2023-11', 'epfl/meditron-7b': '2023-11', 'epfl/llama-3-meditron-70b': '2024-09',
        'harvey/harvey-assistant': '2025-09', 'thomson-reuters/cocounsel-2': '2025-04', 'vlex/vincent-ai': '2024-06', 'vecflow/oliver': '2025-02',
        'bloomberg/bloomberg-gpt': '2023-03',
        'darpa/aixcc-team-atlanta': '2025-08',

        // Russia
        'yandex/yandexgpt-5-pro': '2025-02', 'yandex/yandexgpt-5-lite-8b': '2025-02',
        'yandex/yandexgpt-4-pro': '2024-04', 'yandex/yalm-100b': '2022-06',
        'sber/gigachat-3-ultra': '2025-11', 'sber/gigachat-3-lightning': '2025-11',
        'sber/gigachat-2-max': '2025-04', 'sber/gigachat-2-pro': '2025-04', 'sber/gigachat-2-lite': '2025-04',
        'sber/gigachat-1.5': '2024-09', 'sber/rugpt-3.5-13b': '2023-09',
        'vikhrmodels/vikhr-nemo-12b': '2024-09', 'vikhrmodels/vikhr-yandexgpt-5-lite-8b': '2025-03',
        'tbank/t-pro-1': '2024-12', 'tbank/t-lite-1': '2024-12',

        // Germany
        'aleph-alpha/pharia-1-7b-control': '2024-08', 'aleph-alpha/pharia-1-7b-control-aligned': '2024-08',
        'aleph-alpha/pharia-2-tfree': '2025-09', 'aleph-alpha/luminous': '2022-04',
        'black-forest-labs/flux.1-pro': '2024-08', 'black-forest-labs/flux.1-dev': '2024-08', 'black-forest-labs/flux.1-schnell': '2024-08',
        'black-forest-labs/flux.1-kontext-pro': '2025-05', 'black-forest-labs/flux.1-kontext-dev': '2025-06',
        'tngtech/r1t-chimera': '2025-04', 'tngtech/r1t2-chimera': '2025-08',

        // UK
        'stabilityai/stablelm-2-12b': '2024-04', 'stabilityai/stablelm-2-1.6b': '2024-01',
        'stabilityai/stable-code-3b': '2024-03', 'stabilityai/stable-lm-zephyr-3b': '2023-12',
        'stabilityai/sd-3.5-large': '2024-10',
        'synthesia/synthesia-vlm': '2024-08', 'wayve/lingo-2': '2024-04',

        // US Open — Meta Llama
        'meta/llama-4-behemoth': '2025-04', 'meta/llama-4-maverick': '2025-04', 'meta/llama-4-scout': '2025-04',
        'meta/llama-3.3-70b': '2024-12',
        'meta/llama-3.2-90b-vision': '2024-09', 'meta/llama-3.2-11b-vision': '2024-09',
        'meta/llama-3.2-3b': '2024-09', 'meta/llama-3.2-1b': '2024-09',
        'meta/llama-3.1-405b': '2024-07', 'meta/llama-3.1-70b': '2024-07', 'meta/llama-3.1-8b': '2024-07',
        // US Open — Microsoft Phi
        'microsoft/phi-4': '2024-12', 'microsoft/phi-4-mini': '2025-02',
        'microsoft/phi-4-multimodal': '2025-02', 'microsoft/phi-4-reasoning': '2025-04',
        'microsoft/phi-3.5-mini': '2024-08',
        // US Open — Google Gemma
        'google/gemma-3-27b': '2025-03', 'google/gemma-3-12b': '2025-03', 'google/gemma-3-4b': '2025-03', 'google/gemma-3-1b': '2025-03',
        'google/gemma-2-27b': '2024-06', 'google/gemma-2-9b': '2024-06',
        // US Open — IBM Granite
        'ibm/granite-3.3-8b': '2025-04', 'ibm/granite-3.3-2b': '2025-04',
        'ibm/granite-3.2-vision': '2025-02', 'ibm/granite-3.1-8b': '2024-12',
        // US Open — Allen AI
        'allenai/olmo-2-13b': '2024-11', 'allenai/olmo-2-7b': '2024-11',
        'allenai/tulu-3-70b': '2024-11', 'allenai/molmo-72b': '2024-09',
        // US Open — Databricks / Snowflake
        'databricks/dbrx-instruct': '2024-03',
        'snowflake/arctic-instruct': '2024-04',
        // US Open — Cohere
        'cohere/command-a': '2025-03', 'cohere/command-r-plus': '2024-04', 'cohere/command-r': '2024-04', 'cohere/aya-expanse-32b': '2024-10',
        // US Open — xAI
        'xai/grok-1': '2024-03',
        // US Open — StarCoder
        'bigcode/starcoder2-15b': '2024-02', 'bigcode/starcoder2-7b': '2024-02',

        // Manufacturing
        'foxconn/foxbrain-70b': '2025-03',
        'siemens/sifm': '2024-04', 'hitachi/hal': '2024-03', 'ge-vernova/predix-ai': '2024-09', 'bosch/industrial-genai': '2024-09', 'aveva/industrial-ai-assistant': '2024-09',
        'skild/skild-brain': '2025-07', 'covariant/rfm-1': '2024-03', 'figure-ai/helix': '2025-02', '1x/world-model': '2024-12',
        'apptronik/apollo-gemini': '2025-03', 'agility/digit-arc': '2024-10', 'sanctuary/carbon': '2024-04', 'tesla/optimus-vlm': '2024-10',
        'google-deepmind/gemini-robotics-er-1.6': '2026-04', 'google-deepmind/gemini-robotics-er-1.5': '2025-09',
        'landing-ai/visionagent': '2024-09',
        'nvidia/omniverse-mega': '2025-01',
        'autodesk/bernini': '2024-04', 'ptc/creo-copilot': '2024-06', 'dassault/3dx-aura': '2024-05'
    },

    FRONTIER_REFERENCE: [
        'anthropic/claude-opus-4.7',
        'openai/gpt-5.5',
        'openai/gpt-5.5-pro',
        'google/gemini-3.1-pro',
        'meta/muse-spark'
    ],

    DIMENSIONS: [
        {
            id: 'language',
            label: '🌐 Language Adaptation',
            desc: '지역 언어·문화 적응 능력 — frontier MMLU로는 드러나지 않는 다국어 적용 수준을 측정.',
            benchmarks: ['mmmlu', 'c_eval', 'cmmlu', 'chinese_simpleqa', 'global_piqa', 'swe_bench_multilingual']
        },
        {
            id: 'medical',
            label: '🏥 Medical System Integration',
            desc: '지역 의료 시스템·면허 정합성 — KMLE · USMLE · Arabic medical · AfriMed-QA 등 의료 시스템별 평가.',
            benchmarks: ['kmle', 'medqa', 'medqa_5op', 'pubmedqa', 'mmlu_med', 'medxpertqa', 'medmcqa', 'med_avg', 'healthbench', 'healthbench_professional', 'afrimed_qa', 'ehrqa']
        },
        {
            id: 'domain',
            label: '🏛️ Government / Regulated Domain',
            desc: '법률·금융·사이버 방어 등 sovereign 도메인 — VLAIR 변호사 평가 · DARPA AIxCC · Bloomberg finance.',
            benchmarks: ['vlair_doc_qa', 'vlair_summarization', 'vlair_chronology', 'vlair_redlining', 'vlair_data_extract', 'vlair_transcript', 'aixcc_synth_vuln', 'fpb', 'convfinqa', 'finqa']
        }
    ],

    _models: [],
    _benchmarks: [],
    _scores: [],
    _initialized: false,

    // Sort state per table — table id → { key, dir }.
    // dir: 'asc' | 'desc' | null (cleared)
    _sortStates: {},

    // Map view mode: 'all' (every registered model) or 'active' (released within last 12 months).
    _mapViewMode: 'all',
    _ACTIVE_WINDOW_MONTHS: 12,

    // Cumulative chart state
    _cumViewMode: 'region',  // 'region' | 'vendor'

    _cycleSort: function(tableId, key, defaultDir) {
        var s = this._sortStates[tableId] || { key: null, dir: null };
        if (s.key !== key) {
            this._sortStates[tableId] = { key: key, dir: defaultDir || 'desc' };
        } else if (s.dir === 'desc') {
            this._sortStates[tableId] = { key: key, dir: 'asc' };
        } else if (s.dir === 'asc') {
            this._sortStates[tableId] = { key: null, dir: null };
        } else {
            this._sortStates[tableId] = { key: key, dir: defaultDir || 'desc' };
        }
    },

    _sortIndicator: function(tableId, key) {
        var s = this._sortStates[tableId];
        if (!s || s.key !== key) return '';
        return s.dir === 'asc' ? ' ▲' : s.dir === 'desc' ? ' ▼' : '';
    },

    _makeSortableTh: function(tableId, key, label, defaultDir, onClick) {
        var th = document.createElement('th');
        th.textContent = label + this._sortIndicator(tableId, key);
        th.style.cursor = 'pointer';
        th.setAttribute('role', 'button');
        th.setAttribute('title', '클릭하여 정렬 (' + (defaultDir === 'asc' ? 'asc → desc → off' : 'desc → asc → off') + ')');
        var s = this._sortStates[tableId];
        if (s && s.key === key) {
            th.style.color = '#3b82f6';
            th.style.fontWeight = 'bold';
        }
        th.addEventListener('click', onClick);
        return th;
    },

    init: function(models, benchmarks, scores) {
        this._models = models || [];
        this._benchmarks = benchmarks || [];
        this._scores = scores || [];
    },

    render: function() {
        this._models = App.data.models;
        this._benchmarks = App.data.benchmarks;
        this._scores = App.data.scores;

        this._renderRegionMap();
        this._renderTimeline();
        this._renderCumulative();
        this._renderCountryRadar();
        this._renderCountryLeaderboard();
        var self = this;
        this.DIMENSIONS.forEach(function(dim) {
            self._renderDimension(dim);
        });
        this._renderHeatmap();

        // Wire timeline filter + map view toggle controls (only on first render)
        if (!this._initialized) {
            var periodSel = document.getElementById('sov-timeline-period');
            var sizeSel = document.getElementById('sov-timeline-size-mode');
            if (periodSel) periodSel.addEventListener('change', function() { self._renderTimeline(); });
            if (sizeSel) sizeSel.addEventListener('change', function() { self._renderTimeline(); });

            var btnAll = document.getElementById('sov-map-view-all');
            var btnActive = document.getElementById('sov-map-view-active');
            if (btnAll && btnActive) {
                btnAll.addEventListener('click', function() {
                    self._mapViewMode = 'all';
                    self._updateMapToggleStyles();
                    self._renderRegionMap();
                });
                btnActive.addEventListener('click', function() {
                    self._mapViewMode = 'active';
                    self._updateMapToggleStyles();
                    self._renderRegionMap();
                });
            }

            // Cumulative chart controls
            var cumRegionBtn = document.getElementById('sov-cum-view-region');
            var cumVendorBtn = document.getElementById('sov-cum-view-vendor');
            var cumGranSel = document.getElementById('sov-cum-granularity');
            var cumRegionSel = document.getElementById('sov-cum-region-select');
            if (cumRegionBtn && cumVendorBtn) {
                cumRegionBtn.addEventListener('click', function() {
                    self._cumViewMode = 'region';
                    self._renderCumulative();
                });
                cumVendorBtn.addEventListener('click', function() {
                    self._cumViewMode = 'vendor';
                    self._renderCumulative();
                });
            }
            if (cumGranSel) cumGranSel.addEventListener('change', function() { self._renderCumulative(); });
            if (cumRegionSel) cumRegionSel.addEventListener('change', function() { self._renderCumulative(); });
        }
        this._initialized = true;
    },

    _updateMapToggleStyles: function() {
        var btnAll = document.getElementById('sov-map-view-all');
        var btnActive = document.getElementById('sov-map-view-active');
        if (!btnAll || !btnActive) return;
        var activeCls = 'px-3 py-1 bg-blue-600 text-white';
        var inactiveCls = 'px-3 py-1 bg-gray-800 text-gray-300';
        btnAll.className = this._mapViewMode === 'all' ? activeCls : inactiveCls;
        btnActive.className = this._mapViewMode === 'active' ? activeCls : inactiveCls;
    },

    // Returns true if a release date is within the active window (last N months from today).
    _isActive: function(yyyyMm) {
        if (!yyyyMm) return false;
        var ts = this._dateToTs(yyyyMm);
        var now = Date.now();
        var cutoff = now - this._ACTIVE_WINDOW_MONTHS * 30 * 24 * 3600 * 1000;
        return ts >= cutoff;
    },

    // Extract approximate parameter count (in billions) from a model name.
    // Heuristic: look for patterns like "70B", "1.5B", "405B", "236B-A21B" (use total).
    // Returns null if no number found.
    _extractParamsB: function(modelName) {
        if (!modelName) return null;
        // Match the LARGEST number followed by B (case-insensitive)
        var matches = modelName.match(/(\d+(?:\.\d+)?)\s*B\b/gi);
        if (!matches || matches.length === 0) return null;
        var nums = matches.map(function(s) {
            var n = parseFloat(s.replace(/[Bb]/, '').trim());
            return isNaN(n) ? null : n;
        }).filter(function(n) { return n != null; });
        if (nums.length === 0) return null;
        // Return the largest (often "total" for MoE before "active")
        return Math.max.apply(null, nums);
    },

    _bestScoreFor: function(modelId) {
        var best = 0;
        this._scores.forEach(function(s) {
            if (s.model_id === modelId && typeof s.value === 'number' && s.value > best) {
                best = s.value;
            }
        });
        return best > 0 ? best : null;
    },

    // ─────────────── Release timeline (country × date × params) ───────────────
    _renderTimeline: function() {
        var el = document.getElementById('sov-timeline');
        if (!el) return;
        // Dispose any previous ECharts instance bound to this element so a
        // re-render under new filters fully replaces the chart instead of
        // returning the cached instance with stale options.
        var prev = echarts.getInstanceByDom(el);
        if (prev) prev.dispose();
        el.textContent = '';
        var self = this;

        var periodSel = document.getElementById('sov-timeline-period');
        var sizeSel = document.getElementById('sov-timeline-size-mode');
        var period = periodSel ? periodSel.value : '2025';
        var sizeMode = sizeSel ? sizeSel.value : 'params';

        // Build data points: { region, date, modelId, params, bestScore, modality }
        var modelById = {};
        this._models.forEach(function(m) { modelById[m.id] = m; });

        // Categorize by primary modality cluster for color coding
        function categoryOf(model) {
            var mods = model.modalities || [];
            if (mods.indexOf('video') !== -1) return 'video/world';
            if (mods.indexOf('image') !== -1 && mods.indexOf('audio') !== -1) return 'omni';
            if (mods.indexOf('image') !== -1) return 'multimodal';
            if (mods.indexOf('audio') !== -1) return 'audio';
            return 'text';
        }
        var categoryColors = {
            'text': Theme.series[1],          // blue
            'multimodal': Theme.series[0],     // green
            'omni': Theme.series[4],           // purple
            'video/world': Theme.series[5],    // pink
            'audio': Theme.series[2]           // amber
        };

        // Iterate REGIONS to attach country labels
        var points = [];
        var regionLabels = [];
        this.REGIONS.forEach(function(region) {
            var hasAny = false;
            region.models.forEach(function(mid) {
                var date = self.RELEASE_DATES[mid];
                var model = modelById[mid];
                if (!date || !model) return;
                // Period filter
                var year = date.slice(0, 4);
                if (period !== 'all') {
                    if (period === '2023') {
                        if (parseInt(year, 10) > 2023) return;
                    } else {
                        if (year !== period) return;
                    }
                }
                hasAny = true;
                var ts = self._dateToTs(date);
                var paramsB = self._extractParamsB(model.name);
                var bestScore = self._bestScoreFor(mid);
                var symbolSize;
                if (sizeMode === 'params') {
                    symbolSize = paramsB ? Math.max(8, Math.min(50, Math.sqrt(paramsB) * 3.5)) : 8;
                } else if (sizeMode === 'best-score') {
                    symbolSize = bestScore ? Math.max(8, bestScore * 0.6) : 8;
                } else {
                    symbolSize = 14;
                }
                var cat = categoryOf(model);
                points.push({
                    value: [ts, region.label, symbolSize, paramsB, bestScore, mid, model.name, date, cat],
                    itemStyle: {
                        color: categoryColors[cat] || Theme.series[1],
                        opacity: 0.85,
                        borderColor: '#0b0f17',
                        borderWidth: 1
                    },
                    symbolSize: symbolSize
                });
            });
            if (hasAny) regionLabels.push(region.flag + ' ' + region.label);
        });

        if (points.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 선택한 기간에 표시할 모델이 없습니다';
            el.appendChild(empty);
            return;
        }

        // Re-map y-axis values to "flag + label" so axis displays prettier names
        var labelByPlain = {};
        this.REGIONS.forEach(function(r) { labelByPlain[r.label] = r.flag + ' ' + r.label; });
        points.forEach(function(p) { p.value[1] = labelByPlain[p.value[1]] || p.value[1]; });

        // Sort regionLabels by latest model date desc (most active region on top)
        var regionLatest = {};
        points.forEach(function(p) {
            var label = p.value[1];
            if (!regionLatest[label] || p.value[0] > regionLatest[label]) regionLatest[label] = p.value[0];
        });
        regionLabels.sort(function(a, b) { return regionLatest[b] - regionLatest[a]; });

        var chart = echarts.init(el);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(p) {
                    var v = p.value;
                    var lines = [
                        '<strong>' + v[6] + '</strong>',
                        '국가: ' + v[1],
                        '출시: ' + v[7],
                        v[3] != null ? '파라미터: ~' + v[3] + 'B' : '',
                        v[4] != null ? 'Best 벤치마크: ' + v[4].toFixed(1) : '',
                        '카테고리: ' + v[8]
                    ].filter(Boolean);
                    return lines.join('<br/>');
                }
            },
            legend: {
                data: Object.keys(categoryColors),
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                top: 0,
                selectedMode: 'multiple'
            },
            grid: { left: 8, right: 32, bottom: 50, top: 36, containLabel: true },
            xAxis: {
                type: 'time',
                axisLabel: { color: Theme.textMuted, fontSize: 10 },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { lineStyle: { color: Theme.border, opacity: 0.3 } }
            },
            yAxis: {
                type: 'category',
                data: regionLabels,
                axisLabel: { color: Theme.textMuted, fontSize: 11 },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { show: true, lineStyle: { color: Theme.border, opacity: 0.2 } }
            },
            dataZoom: [
                { type: 'inside', xAxisIndex: 0 },
                { type: 'slider', xAxisIndex: 0, height: 16, bottom: 8, textStyle: { color: Theme.textMuted, fontSize: 9 } }
            ],
            series: Object.keys(categoryColors).map(function(cat) {
                return {
                    name: cat,
                    type: 'scatter',
                    data: points.filter(function(p) { return p.value[8] === cat; }),
                    emphasis: { focus: 'series', itemStyle: { borderColor: '#fff', borderWidth: 2 } }
                };
            })
        });
        chart.on('click', function(p) {
            if (p && p.value && p.value[5]) {
                if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(p.value[5]);
            }
        });
        window.addEventListener('resize', function() { chart.resize(); });
    },

    _dateToTs: function(yyyyMm) {
        // Convert "YYYY-MM" or "YYYY" to unix-ms timestamp (mid-month for sorting clarity)
        var parts = yyyyMm.split('-');
        var y = parseInt(parts[0], 10);
        var m = parts.length > 1 ? parseInt(parts[1], 10) : 6;  // mid-year if month unknown
        return new Date(Date.UTC(y, m - 1, 15)).getTime();
    },

    // Bucket a YYYY-MM date string into a time bucket key for cumulative aggregation.
    // Returns end-of-period timestamp so cumulative steps land at period boundaries.
    _bucketKey: function(yyyyMm, granularity) {
        var parts = yyyyMm.split('-');
        var y = parseInt(parts[0], 10);
        var m = parts.length > 1 ? parseInt(parts[1], 10) : 6;
        if (granularity === 'year') {
            return new Date(Date.UTC(y, 11, 31)).getTime();
        } else if (granularity === 'quarter') {
            var qEnd = (Math.floor((m - 1) / 3) + 1) * 3;  // 3, 6, 9, 12
            return new Date(Date.UTC(y, qEnd - 1, 28)).getTime();  // safe last day
        } else {
            // month: end of given month (28 is safe for any month)
            return new Date(Date.UTC(y, m - 1, 28)).getTime();
        }
    },

    _formatBucketLabel: function(ts, granularity) {
        var d = new Date(ts);
        var y = d.getUTCFullYear();
        var m = d.getUTCMonth() + 1;
        if (granularity === 'year') return String(y);
        if (granularity === 'quarter') {
            var q = Math.floor((m - 1) / 3) + 1;
            return y + ' Q' + q;
        }
        return y + '-' + (m < 10 ? '0' + m : m);
    },

    // ─────────────── Cumulative release count by region or region+vendor ───────────────
    _renderCumulative: function() {
        var el = document.getElementById('sov-cumulative');
        if (!el) return;
        var prev = echarts.getInstanceByDom(el);
        if (prev) prev.dispose();
        el.textContent = '';
        var self = this;

        var granSel = document.getElementById('sov-cum-granularity');
        var granularity = granSel ? granSel.value : 'quarter';
        var regionFilterWrap = document.getElementById('sov-cum-region-filter');
        var regionSel = document.getElementById('sov-cum-region-select');

        // Highlight active toggle button
        var btnRegion = document.getElementById('sov-cum-view-region');
        var btnVendor = document.getElementById('sov-cum-view-vendor');
        var activeCls = 'px-3 py-1 bg-blue-600 text-white';
        var inactiveCls = 'px-3 py-1 bg-gray-800 text-gray-300';
        if (btnRegion && btnVendor) {
            btnRegion.className = this._cumViewMode === 'region' ? activeCls : inactiveCls;
            btnVendor.className = this._cumViewMode === 'vendor' ? activeCls : inactiveCls;
        }

        // Show region selector only in vendor mode
        if (regionFilterWrap) {
            if (this._cumViewMode === 'vendor') {
                regionFilterWrap.classList.remove('hidden');
                // Populate region select if empty
                if (regionSel && regionSel.options.length === 0) {
                    var opt = document.createElement('option');
                    opt.value = '__all__';
                    opt.textContent = '전체 region';
                    regionSel.appendChild(opt);
                    this.REGIONS.forEach(function(r) {
                        var o = document.createElement('option');
                        o.value = r.code;
                        o.textContent = r.flag + ' ' + r.label;
                        regionSel.appendChild(o);
                    });
                    regionSel.value = '__all__';
                }
            } else {
                regionFilterWrap.classList.add('hidden');
            }
        }

        // Collect (date, seriesKey) tuples
        var modelById = {};
        this._models.forEach(function(m) { modelById[m.id] = m; });

        var seriesEvents = {};  // seriesKey → array of bucketTs
        var seriesMeta = {};    // seriesKey → { label, region, vendor }

        function addEvent(seriesKey, label, region, vendor, bucketTs) {
            if (!seriesEvents[seriesKey]) {
                seriesEvents[seriesKey] = [];
                seriesMeta[seriesKey] = { label: label, region: region, vendor: vendor };
            }
            seriesEvents[seriesKey].push(bucketTs);
        }

        var regionFilter = regionSel ? regionSel.value : '__all__';

        this.REGIONS.forEach(function(region) {
            if (self._cumViewMode === 'vendor' && regionFilter !== '__all__' && region.code !== regionFilter) {
                return;
            }
            region.models.forEach(function(mid) {
                var m = modelById[mid];
                var date = self.RELEASE_DATES[mid];
                if (!m || !date) return;
                var bucketTs = self._bucketKey(date, granularity);
                if (self._cumViewMode === 'region') {
                    var key = region.code;
                    addEvent(key, region.flag + ' ' + region.label, region, null, bucketTs);
                } else {
                    var vendor = m.vendor || 'unknown';
                    var key = region.code + '||' + vendor;
                    var label = (regionFilter === '__all__' ? region.flag + ' ' : '') + vendor;
                    addEvent(key, label, region, vendor, bucketTs);
                }
            });
        });

        var seriesKeys = Object.keys(seriesEvents);
        if (seriesKeys.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 데이터가 없습니다';
            el.appendChild(empty);
            return;
        }

        // Build the union of all bucket timestamps for x-axis
        var allBuckets = {};
        seriesKeys.forEach(function(k) {
            seriesEvents[k].forEach(function(ts) { allBuckets[ts] = true; });
        });
        var bucketList = Object.keys(allBuckets).map(Number).sort(function(a, b) { return a - b; });

        // For each series, build cumulative count over bucketList
        // Vendor view can be huge — cap to top-N by total count to stay legible
        var TOP_N_VENDORS = 18;
        var seriesTotals = seriesKeys.map(function(k) {
            return { key: k, total: seriesEvents[k].length };
        }).sort(function(a, b) { return b.total - a.total; });
        var keepKeys = (self._cumViewMode === 'vendor')
            ? seriesTotals.slice(0, TOP_N_VENDORS).map(function(x) { return x.key; })
            : seriesKeys;

        var seriesData = keepKeys.map(function(k) {
            // Count events per bucket
            var perBucket = {};
            seriesEvents[k].forEach(function(ts) { perBucket[ts] = (perBucket[ts] || 0) + 1; });
            var cumulative = 0;
            var data = bucketList.map(function(ts) {
                cumulative += (perBucket[ts] || 0);
                return [ts, cumulative];
            });
            // Trim leading zeros so each series starts when its first model ships
            var firstNonZero = data.findIndex(function(d) { return d[1] > 0; });
            if (firstNonZero > 0) data = data.slice(firstNonZero);
            return {
                name: seriesMeta[k].label,
                type: 'line',
                step: 'end',
                showSymbol: false,
                smooth: false,
                data: data,
                emphasis: { focus: 'series' },
                lineStyle: { width: 2 }
            };
        });

        // Color via Theme.series cycling
        seriesData.forEach(function(s, i) {
            var color = Theme.series[i % Theme.series.length];
            s.itemStyle = { color: color };
            s.lineStyle.color = color;
        });

        var legendData = seriesData.map(function(s) { return s.name; });
        var subtitle = self._cumViewMode === 'region'
            ? '전체 ' + seriesData.length + '개 region'
            : 'Top-' + Math.min(TOP_N_VENDORS, seriesKeys.length) + ' vendors'
              + (regionFilter !== '__all__' ? ' (filter: ' + regionFilter + ')' : '');

        var chart = echarts.init(el);
        chart.setOption({
            backgroundColor: 'transparent',
            title: {
                text: self._cumViewMode === 'region' ? '국가별 누적 출시' : '국가-개발사별 누적 출시',
                subtext: subtitle,
                textStyle: { color: Theme.textPrimary, fontSize: 13 },
                subtextStyle: { color: Theme.textMuted, fontSize: 10 },
                left: 'left', top: 0
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross', label: { backgroundColor: '#0b0f17' } },
                formatter: function(arr) {
                    if (!arr || arr.length === 0) return '';
                    var label = self._formatBucketLabel(arr[0].value[0], granularity);
                    var sorted = arr.slice().sort(function(a, b) { return b.value[1] - a.value[1]; });
                    var lines = ['<strong>' + label + '</strong>'];
                    sorted.slice(0, 12).forEach(function(p) {
                        lines.push(p.marker + ' ' + p.seriesName + ': <strong>' + p.value[1] + '</strong>');
                    });
                    if (sorted.length > 12) lines.push('… +' + (sorted.length - 12) + ' more');
                    return lines.join('<br/>');
                }
            },
            legend: {
                data: legendData,
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                top: 36,
                type: 'scroll'
            },
            grid: { left: 8, right: 32, bottom: 50, top: 80, containLabel: true },
            xAxis: {
                type: 'time',
                axisLabel: { color: Theme.textMuted, fontSize: 10 },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { lineStyle: { color: Theme.border, opacity: 0.3 } }
            },
            yAxis: {
                type: 'value',
                name: 'Cumulative releases',
                nameTextStyle: { color: Theme.textMuted, fontSize: 10 },
                axisLabel: { color: Theme.textMuted, fontSize: 10 },
                splitLine: { lineStyle: { color: Theme.border, opacity: 0.3 } }
            },
            dataZoom: [
                { type: 'inside', xAxisIndex: 0 },
                { type: 'slider', xAxisIndex: 0, height: 14, bottom: 8, textStyle: { color: Theme.textMuted, fontSize: 9 } }
            ],
            series: seriesData
        });
        window.addEventListener('resize', function() { chart.resize(); });
    },

    _getModelName: function(mid) {
        var m = this._models.find(function(m) { return m.id === mid; });
        return m ? m.name : mid.split('/').pop();
    },

    _getBenchmark: function(bid) {
        return this._benchmarks.find(function(b) { return b.id === bid; });
    },

    _getScore: function(modelId, benchId) {
        var s = this._scores.find(function(s) {
            return s.model_id === modelId && s.benchmark_id === benchId;
        });
        return s ? s.value : null;
    },

    _allSovereignIds: function() {
        var present = {};
        this._models.forEach(function(m) { present[m.id] = true; });
        var ids = [];
        this.REGIONS.forEach(function(r) {
            r.models.forEach(function(mid) {
                if (present[mid]) ids.push(mid);
            });
        });
        return ids;
    },

    _regionFor: function(modelId) {
        for (var i = 0; i < this.REGIONS.length; i++) {
            if (this.REGIONS[i].models.indexOf(modelId) !== -1) return this.REGIONS[i];
        }
        return null;
    },

    // ─────────────── Country aggregate radar (3-axis per country) ───────────────
    _renderCountryRadar: function() {
        var el = document.getElementById('sov-country-radar');
        if (!el) return;
        el.textContent = '';
        var self = this;

        // For each region, compute mean best-score across each dimension's benchmarks
        var radarData = [];
        this.REGIONS.forEach(function(region) {
            var presentModels = region.models.filter(function(mid) {
                return self._models.some(function(m) { return m.id === mid; });
            });
            if (presentModels.length === 0) return;
            var dimMeans = self.DIMENSIONS.map(function(dim) {
                // For each benchmark in this dimension, take best score across the country's models;
                // average those bests over benchmarks that have at least one score.
                var benchBests = dim.benchmarks.map(function(bid) {
                    var best = null;
                    presentModels.forEach(function(mid) {
                        var v = self._getScore(mid, bid);
                        if (v != null && (best == null || v > best)) best = v;
                    });
                    return best;
                }).filter(function(v) { return v != null; });
                if (benchBests.length === 0) return 0;
                return benchBests.reduce(function(a, b) { return a + b; }, 0) / benchBests.length;
            });
            // Skip countries with no scores in any dimension
            if (dimMeans.every(function(v) { return v === 0; })) return;
            radarData.push({
                value: dimMeans,
                name: region.flag + ' ' + region.label,
                regionCode: region.code
            });
        });

        if (radarData.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 국가별 비교 데이터가 부족합니다';
            el.appendChild(empty);
            return;
        }

        var indicators = this.DIMENSIONS.map(function(d) { return { name: d.label, max: 100 }; });
        var chart = echarts.init(el);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(p) {
                    var lines = [p.name];
                    p.value.forEach(function(v, i) {
                        lines.push(indicators[i].name + ': ' + v.toFixed(1));
                    });
                    return lines.join('<br/>');
                }
            },
            legend: {
                data: radarData.map(function(d) { return d.name; }),
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                top: 0, type: 'scroll'
            },
            radar: {
                indicator: indicators,
                shape: 'polygon',
                axisName: { color: Theme.textMuted, fontSize: 11 },
                splitLine: { lineStyle: { color: Theme.border } },
                splitArea: { areaStyle: { color: ['transparent'] } },
                axisLine: { lineStyle: { color: Theme.border } }
            },
            series: [{
                type: 'radar',
                data: radarData.map(function(d, i) {
                    return {
                        value: d.value,
                        name: d.name,
                        itemStyle: { color: Theme.series[i % Theme.series.length] },
                        lineStyle: { color: Theme.series[i % Theme.series.length], width: 2 },
                        areaStyle: { opacity: 0.08 }
                    };
                })
            }]
        });
        window.addEventListener('resize', function() { chart.resize(); });
    },

    // ─────────────── Country leaderboard (full models × benchmarks per country) ───────────────
    _renderCountryLeaderboard: function() {
        var el = document.getElementById('sov-country-leaderboard');
        if (!el) return;
        el.textContent = '';
        var self = this;
        var TABLE_ID = 'country-leaderboard';

        // Pick representative benchmarks: top-3 per dimension by score coverage
        var unionBids = [];
        this.DIMENSIONS.forEach(function(dim) {
            var picked = dim.benchmarks.map(function(bid) {
                var cnt = 0;
                self._scores.forEach(function(s) { if (s.benchmark_id === bid) cnt++; });
                return { bid: bid, cnt: cnt };
            }).filter(function(x) { return x.cnt > 0; })
              .sort(function(a, b) { return b.cnt - a.cnt; })
              .slice(0, 3)
              .map(function(x) { return x.bid; });
            unionBids = unionBids.concat(picked);
        });

        // Build row data first so we can sort
        var rowData = this.REGIONS.map(function(region) {
            var presentModels = region.models.filter(function(mid) {
                return self._models.some(function(m) { return m.id === mid; });
            });
            if (presentModels.length === 0) return null;
            var benchBests = {};
            unionBids.forEach(function(bid) {
                var bestVal = null, bestModel = null;
                presentModels.forEach(function(mid) {
                    var v = self._getScore(mid, bid);
                    if (v != null && (bestVal == null || v > bestVal)) {
                        bestVal = v;
                        bestModel = mid;
                    }
                });
                benchBests[bid] = { val: bestVal, model: bestModel };
            });
            return { region: region, count: presentModels.length, bests: benchBests };
        }).filter(function(r) { return r != null; });

        // Apply current sort
        var s = this._sortStates[TABLE_ID];
        if (s && s.key && s.dir) {
            rowData.sort(function(a, b) {
                var va, vb;
                if (s.key === 'region') { va = a.region.label; vb = b.region.label; }
                else if (s.key === 'count') { va = a.count; vb = b.count; }
                else { va = a.bests[s.key] ? a.bests[s.key].val : null; vb = b.bests[s.key] ? b.bests[s.key].val : null; }
                var aNull = va == null, bNull = vb == null;
                if (aNull && bNull) return 0;
                if (aNull) return 1;
                if (bNull) return -1;
                if (typeof va === 'string') {
                    return s.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
                }
                return s.dir === 'asc' ? va - vb : vb - va;
            });
        }

        var table = document.createElement('table');
        table.className = 'sota-table text-sm';

        var thead = document.createElement('thead');
        var hr = document.createElement('tr');
        hr.appendChild(self._makeSortableTh(TABLE_ID, 'region', 'Region', 'asc', function() {
            self._cycleSort(TABLE_ID, 'region', 'asc');
            self._renderCountryLeaderboard();
        }));
        var thC = self._makeSortableTh(TABLE_ID, 'count', 'Models', 'desc', function() {
            self._cycleSort(TABLE_ID, 'count', 'desc');
            self._renderCountryLeaderboard();
        });
        thC.style.fontSize = '11px';
        hr.appendChild(thC);
        unionBids.forEach(function(bid) {
            var b = self._getBenchmark(bid);
            var label = b ? b.name : bid;
            var th = self._makeSortableTh(TABLE_ID, bid, label, 'desc', (function(localBid) {
                return function() {
                    self._cycleSort(TABLE_ID, localBid, 'desc');
                    self._renderCountryLeaderboard();
                };
            })(bid));
            th.style.fontSize = '11px';
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');

        // For color coding: per-benchmark global best across all regions in the leaderboard
        var globalMaxes = {};
        unionBids.forEach(function(bid) {
            var max = 0;
            self.REGIONS.forEach(function(region) {
                region.models.forEach(function(mid) {
                    var v = self._getScore(mid, bid);
                    if (v != null && v > max) max = v;
                });
            });
            globalMaxes[bid] = max;
        });

        rowData.forEach(function(row) {
            var region = row.region;
            var tr = document.createElement('tr');

            var tdR = document.createElement('td');
            tdR.textContent = region.flag + ' ' + region.label;
            tdR.style.whiteSpace = 'nowrap';
            tdR.style.fontWeight = '600';
            tr.appendChild(tdR);

            var tdC = document.createElement('td');
            tdC.textContent = row.count;
            tdC.style.textAlign = 'center';
            tdC.style.color = Theme.textMuted;
            tr.appendChild(tdC);

            unionBids.forEach(function(bid) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                var best = row.bests[bid];
                if (best && best.val != null) {
                    td.textContent = best.val.toFixed(1);
                    var ratio = globalMaxes[bid] > 0 ? best.val / globalMaxes[bid] : 0;
                    if (ratio >= 0.99) { td.style.color = Theme.series[0]; td.style.fontWeight = 'bold'; }
                    else if (ratio >= 0.9) td.style.color = Theme.series[1];
                    else if (ratio >= 0.75) td.style.color = Theme.series[2];
                    else td.style.color = Theme.series[3];
                    td.style.cursor = 'pointer';
                    td.setAttribute('role', 'button');
                    td.title = (self._getModelName(best.model) || best.model) + ' · 클릭 시 검증 소스';
                    td.addEventListener('click', (function(m, b) {
                        return function() {
                            if (typeof Modal !== 'undefined' && Modal.showScoreSource) Modal.showScoreSource(m, b);
                        };
                    })(best.model, bid));
                } else {
                    td.textContent = '—';
                    td.style.color = Theme.textDisabled;
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        el.appendChild(table);
    },

    _renderRegionMap: function() {
        var container = document.getElementById('sov-region-map');
        if (!container) return;
        container.textContent = '';
        var self = this;
        this._updateMapToggleStyles();

        var activeMode = this._mapViewMode === 'active';

        this.REGIONS.forEach(function(region) {
            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col';

            // Determine which models pass current view filter.
            var presentModels = region.models.filter(function(mid) {
                return self._models.some(function(m) { return m.id === mid; });
            });
            var visibleModels = activeMode
                ? presentModels.filter(function(mid) { return self._isActive(self.RELEASE_DATES[mid]); })
                : presentModels;

            var head = document.createElement('div');
            head.className = 'flex items-center gap-2 mb-2';
            var flag = document.createElement('span');
            flag.style.fontSize = '20px';
            flag.textContent = region.flag;
            head.appendChild(flag);
            var label = document.createElement('span');
            label.className = 'text-widget text-gray-200 font-semibold';
            label.textContent = region.label;
            head.appendChild(label);
            var count = document.createElement('span');
            count.className = 'ml-auto text-xs text-gray-500';
            count.textContent = activeMode
                ? visibleModels.length + ' / ' + presentModels.length + ' active'
                : presentModels.length + ' models';
            head.appendChild(count);
            card.appendChild(head);

            var note = document.createElement('p');
            note.className = 'text-xs text-gray-500 mb-3';
            note.textContent = region.note;
            card.appendChild(note);

            var list = document.createElement('div');
            list.className = 'flex flex-col gap-1';

            // Sort visible models by release date desc (unknown dates last).
            var sortedModels = visibleModels.slice().sort(function(a, b) {
                var da = self.RELEASE_DATES[a] || '';
                var db = self.RELEASE_DATES[b] || '';
                if (!da && !db) return 0;
                if (!da) return 1;
                if (!db) return -1;
                return db.localeCompare(da);
            });

            sortedModels.forEach(function(mid) {
                var m = self._models.find(function(x) { return x.id === mid; });
                if (!m) return;
                var releaseDate = self.RELEASE_DATES[mid];
                var row = document.createElement('div');
                row.className = 'flex items-center justify-between gap-2 text-xs';
                var name = document.createElement('span');
                name.className = 'text-gray-300 truncate cursor-pointer';
                name.textContent = m.name + (releaseDate ? '  (' + releaseDate + ')' : '');
                name.title = mid + ' — 클릭하면 모델 상세';
                name.addEventListener('click', (function(modelId) {
                    return function() {
                        if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(modelId);
                    };
                })(mid));
                row.appendChild(name);
                var badge = document.createElement('span');
                badge.className = 'badge badge-' + (m.type || 'open-weight');
                badge.textContent = (m.type || 'open-weight').replace('-', ' ');
                row.appendChild(badge);
                list.appendChild(row);
            });

            if (visibleModels.length === 0) {
                var empty = document.createElement('div');
                empty.className = 'text-xs text-gray-600 italic';
                empty.textContent = activeMode && presentModels.length > 0
                    ? '— 최근 ' + self._ACTIVE_WINDOW_MONTHS + '개월 내 출시 모델 없음'
                    : '— no models tracked yet';
                list.appendChild(empty);
            }
            card.appendChild(list);
            container.appendChild(card);
        });
    },

    _renderDimension: function(dim) {
        var self = this;
        var sovIds = this._allSovereignIds();
        var sovScored = sovIds.map(function(mid) {
            var sum = 0, cnt = 0;
            dim.benchmarks.forEach(function(bid) {
                var v = self._getScore(mid, bid);
                if (v != null) { sum += v; cnt++; }
            });
            return { mid: mid, avg: cnt ? sum / cnt : null, cnt: cnt };
        }).filter(function(x) { return x.cnt > 0; });
        sovScored.sort(function(a, b) {
            if (b.cnt !== a.cnt) return b.cnt - a.cnt;
            return (b.avg || 0) - (a.avg || 0);
        });

        var frScored = this.FRONTIER_REFERENCE.filter(function(mid) {
            return dim.benchmarks.some(function(bid) {
                return self._getScore(mid, bid) != null;
            });
        });

        var topSov = sovScored.slice(0, 6).map(function(x) { return x.mid; });
        var topFrontier = frScored.slice(0, 3);

        var combined = topSov.concat(topFrontier);
        var activeBids = dim.benchmarks.filter(function(bid) {
            return combined.some(function(mid) { return self._getScore(mid, bid) != null; });
        });

        var chartEl = document.getElementById('sov-' + dim.id + '-chart');
        var tableEl = document.getElementById('sov-' + dim.id + '-table');
        if (!chartEl || !tableEl) return;
        chartEl.textContent = '';
        tableEl.textContent = '';

        if (activeBids.length === 0 || combined.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 이 차원에 해당하는 데이터가 아직 없습니다';
            chartEl.appendChild(empty);
            return;
        }

        this._renderDimChart(chartEl, dim, activeBids, topSov, topFrontier);
        this._renderDimTable(tableEl, dim, activeBids, topSov, topFrontier);
    },

    _renderDimChart: function(el, dim, activeBids, sovIds, frIds) {
        var chart = echarts.init(el);
        var self = this;
        var benchNames = activeBids.map(function(bid) {
            var b = self._getBenchmark(bid);
            return b ? b.name : bid;
        });

        function buildSeries(modelIds, isFrontier) {
            return modelIds.map(function(mid, i) {
                var color = isFrontier ? Theme.textMuted : Theme.series[i % Theme.series.length];
                return {
                    name: self._getModelName(mid) + (isFrontier ? '  · frontier' : ''),
                    type: 'bar',
                    data: activeBids.map(function(bid) {
                        var v = self._getScore(mid, bid);
                        return v != null ? v : null;
                    }),
                    itemStyle: {
                        color: color,
                        opacity: isFrontier ? 0.55 : 1.0,
                        borderColor: isFrontier ? Theme.borderStrong : 'transparent',
                        borderWidth: isFrontier ? 1 : 0
                    }
                };
            });
        }

        var series = buildSeries(sovIds, false).concat(buildSeries(frIds, true));
        var legend = sovIds.map(function(mid) { return self._getModelName(mid); })
            .concat(frIds.map(function(mid) { return self._getModelName(mid) + '  · frontier'; }));

        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: legend, textStyle: { color: Theme.textMuted, fontSize: 10 }, top: 0, type: 'scroll' },
            grid: { left: 8, right: 16, bottom: 70, top: 40, containLabel: true },
            xAxis: {
                type: 'category', data: benchNames,
                axisLabel: {
                    color: Theme.textMuted, fontSize: 9, rotate: 30, interval: 0,
                    formatter: function(v) { return v.length > 22 ? v.slice(0, 20) + '…' : v; }
                },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            yAxis: {
                type: 'value', axisLabel: { color: Theme.textMuted },
                splitLine: { lineStyle: { color: Theme.border } }
            },
            series: series
        });
        window.addEventListener('resize', function() { chart.resize(); });
    },

    _renderDimTable: function(el, dim, activeBids, sovIds, frIds) {
        var self = this;
        var TABLE_ID = 'dim-' + dim.id;
        var rows = sovIds.concat(frIds);
        var rowKind = {};
        sovIds.forEach(function(m) { rowKind[m] = 'sovereign'; });
        frIds.forEach(function(m) { rowKind[m] = 'frontier'; });

        var maxes = {};
        activeBids.forEach(function(bid) {
            var max = 0;
            rows.forEach(function(mid) {
                var v = self._getScore(mid, bid);
                if (v != null && v > max) max = v;
            });
            maxes[bid] = max;
        });

        // Apply sort
        var s = this._sortStates[TABLE_ID];
        if (s && s.key && s.dir) {
            rows.sort(function(a, b) {
                var va, vb;
                if (s.key === 'model') { va = self._getModelName(a); vb = self._getModelName(b); }
                else if (s.key === 'region') {
                    var ra = self._regionFor(a), rb = self._regionFor(b);
                    va = ra ? ra.label : (rowKind[a] === 'frontier' ? 'frontier' : '—');
                    vb = rb ? rb.label : (rowKind[b] === 'frontier' ? 'frontier' : '—');
                }
                else { va = self._getScore(a, s.key); vb = self._getScore(b, s.key); }
                var aNull = va == null, bNull = vb == null;
                if (aNull && bNull) return 0;
                if (aNull) return 1;
                if (bNull) return -1;
                if (typeof va === 'string') {
                    return s.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
                }
                return s.dir === 'asc' ? va - vb : vb - va;
            });
        }

        var table = document.createElement('table');
        table.className = 'sota-table text-sm';

        var thead = document.createElement('thead');
        var hr = document.createElement('tr');
        hr.appendChild(self._makeSortableTh(TABLE_ID, 'model', 'Model', 'asc', function() {
            self._cycleSort(TABLE_ID, 'model', 'asc');
            self._renderDimension(dim);
        }));
        hr.appendChild(self._makeSortableTh(TABLE_ID, 'region', 'Region', 'asc', function() {
            self._cycleSort(TABLE_ID, 'region', 'asc');
            self._renderDimension(dim);
        }));
        activeBids.forEach(function(bid) {
            var b = self._getBenchmark(bid);
            var label = b ? b.name : bid;
            var th = self._makeSortableTh(TABLE_ID, bid, label, 'desc', (function(localBid) {
                return function() {
                    self._cycleSort(TABLE_ID, localBid, 'desc');
                    self._renderDimension(dim);
                };
            })(bid));
            th.style.fontSize = '11px';
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        rows.forEach(function(mid) {
            var tr = document.createElement('tr');
            if (rowKind[mid] === 'frontier') tr.style.opacity = '0.7';

            var tdName = document.createElement('td');
            tdName.textContent = self._getModelName(mid);
            tdName.style.whiteSpace = 'nowrap';
            tdName.style.cursor = 'pointer';
            tdName.title = mid + ' — 클릭하면 모델 상세';
            tdName.addEventListener('click', (function(m) {
                return function() {
                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(m);
                };
            })(mid));
            tr.appendChild(tdName);

            var tdRegion = document.createElement('td');
            var region = self._regionFor(mid);
            tdRegion.textContent = region ? (region.flag + ' ' + region.label) : (rowKind[mid] === 'frontier' ? 'frontier' : '—');
            tdRegion.style.fontSize = '11px';
            tdRegion.style.color = rowKind[mid] === 'frontier' ? Theme.textMuted : Theme.textPrimary;
            tr.appendChild(tdRegion);

            activeBids.forEach(function(bid) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                var v = self._getScore(mid, bid);
                if (v != null) {
                    td.textContent = v.toFixed(1);
                    var ratio = maxes[bid] > 0 ? v / maxes[bid] : 0;
                    if (ratio >= 0.95) { td.style.color = Theme.series[0]; td.style.fontWeight = 'bold'; }
                    else if (ratio >= 0.85) td.style.color = Theme.series[1];
                    else if (ratio >= 0.7) td.style.color = Theme.series[2];
                    else td.style.color = Theme.series[3];
                    td.style.cursor = 'pointer';
                    td.setAttribute('role', 'button');
                    td.title = '클릭하면 검증 소스·수집일 이력';
                    td.addEventListener('click', (function(m, b) {
                        return function() {
                            if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                                Modal.showScoreSource(m, b);
                            }
                        };
                    })(mid, bid));
                } else {
                    td.textContent = '—';
                    td.style.color = Theme.textDisabled;
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        el.appendChild(table);
    },

    _renderHeatmap: function() {
        var el = document.getElementById('sov-heatmap');
        if (!el) return;
        el.textContent = '';
        var self = this;

        var modelIds = [];
        this.REGIONS.forEach(function(r) {
            var present = r.models.filter(function(mid) {
                return self._models.some(function(m) { return m.id === mid; });
            });
            modelIds = modelIds.concat(present.slice(0, 2));
        });

        var unionBids = [];
        this.DIMENSIONS.forEach(function(d) { unionBids = unionBids.concat(d.benchmarks); });

        var activeBids = unionBids.filter(function(bid) {
            var cnt = 0;
            modelIds.forEach(function(mid) {
                if (self._getScore(mid, bid) != null) cnt++;
            });
            return cnt >= 2;
        });

        if (activeBids.length === 0 || modelIds.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 히트맵에 표시할 교차 데이터가 부족합니다';
            el.appendChild(empty);
            return;
        }

        var modelLabels = modelIds.map(function(mid) {
            var r = self._regionFor(mid);
            return self._getModelName(mid) + (r ? '  ' + r.flag : '');
        });
        var benchLabels = activeBids.map(function(bid) {
            var b = self._getBenchmark(bid);
            return b ? b.name : bid;
        });
        var data = [];
        modelIds.forEach(function(mid, mi) {
            activeBids.forEach(function(bid, bi) {
                var v = self._getScore(mid, bid);
                data.push([bi, mi, v != null ? v : '-']);
            });
        });

        var chart = echarts.init(el);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                position: 'top',
                formatter: function(p) {
                    return benchLabels[p.data[0]] + ' → ' + modelLabels[p.data[1]] + '<br/>' +
                        (typeof p.data[2] === 'number' ? p.data[2].toFixed(1) : 'no data');
                }
            },
            grid: { left: 8, right: 16, bottom: 80, top: 30, containLabel: true },
            xAxis: {
                type: 'category', data: benchLabels,
                splitArea: { show: true },
                axisLabel: {
                    color: Theme.textMuted, rotate: 35, fontSize: 9, interval: 0,
                    formatter: function(v) { return v.length > 18 ? v.slice(0, 16) + '…' : v; }
                }
            },
            yAxis: {
                type: 'category', data: modelLabels,
                splitArea: { show: true },
                axisLabel: { color: Theme.textMuted, fontSize: 10 }
            },
            visualMap: {
                min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                inRange: { color: ['#1f2937', '#3b82f6', '#10b981', '#fbbf24'] }
            },
            series: [{
                name: 'score', type: 'heatmap',
                data: data.filter(function(d) { return typeof d[2] === 'number'; }),
                label: {
                    show: true, color: '#fff', fontSize: 9,
                    formatter: function(p) { return typeof p.data[2] === 'number' ? p.data[2].toFixed(0) : ''; }
                }
            }]
        });
        chart.on('click', function(p) {
            var mid = modelIds[p.data[1]];
            var bid = activeBids[p.data[0]];
            if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                Modal.showScoreSource(mid, bid);
            }
        });
        window.addEventListener('resize', function() { chart.resize(); });
    }
};
