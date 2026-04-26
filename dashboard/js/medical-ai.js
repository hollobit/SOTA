/**
 * Medical AI tab: cross-comparison of clinical LLMs (ChatGPT for Clinicians,
 * Med-Gemini, Med-PaLM, MedGemma), biomedical LLMs (OpenBioLLM, BioMistral,
 * Meditron, BioGPT), and medical imaging foundation models (SAM/MedSAM,
 * pathology FMs Virchow/CONCH/UNI, radiology RadFM/CheXzero, ophthalmology
 * RETFound). Mirrors PhysicalAI's category + suite + sortable-table pattern.
 */
var MedicalAI = {
    CATEGORIES: [
        {
            code: 'clinical-llm',
            label: 'Clinical LLMs',
            icon: '🩺',
            note: 'ChatGPT for Clinicians · Med-Gemini · Med-PaLM · MedGemma · Polaris · Almanac — 임상의 워크플로 전용',
            models: [
                'openai/chatgpt-clinicians-gpt55',
                'openai/chatgpt-clinicians-gpt54',
                'google/med-gemini-3-pro',
                'google/med-gemini-l-2',
                'google/med-gemini-l-1',
                'google/med-palm-2',
                'google/med-palm-1',
                'google/medgemma-27b',
                'google/medgemma-9b',
                'google/medgemma-1.5-4b',
                'hippocratic-ai/polaris-3',
                'hippocratic-ai/polaris-2',
                'hippocratic-ai/polaris-1',
                'stanford/almanac-rag'
            ]
        },
        {
            code: 'biomedical-llm',
            label: 'Biomedical LLMs',
            icon: '🧬',
            note: 'PubMed·Clinical guideline 사전학습 — OpenBioLLM · BioMistral · Meditron · BioGPT · Med42 · Aloe · BioMedLM · PMC-LLaMA · Me-LLaMA',
            models: [
                'saama/openbiollm-llama3-70b',
                'saama/openbiollm-llama3-8b',
                'biomistral/biomistral-7b',
                'epfl/meditron-70b',
                'epfl/meditron-7b',
                'openmeditron/meditron3-70b',
                'openmeditron/meditron3-8b',
                'microsoft/biogpt-large',
                'stanford/clinical-camel',
                'ucl/medalpaca-13b',
                'm42-health/med42-v2-70b',
                'm42-health/med42-v2-8b',
                'hpai-bsc/aloe-beta-70b',
                'hpai-bsc/aloe-beta-8b',
                'stanford/biomedlm-2.7b',
                'chaoyi-wu/pmc-llama-13b',
                'yale/me-llama-13b',
                'tencent/medchat-llm-13b',
                'ziya/asclepius-llama2-13b'
            ]
        },
        {
            code: 'multilingual-medical',
            label: 'Multilingual & Regional Medical LLMs',
            icon: '🌏',
            note: 'MMedLM (6-lang) · Apollo · HuatuoGPT(중국) · Zhongjing · BianQue · DoctorGLM · BianCang(TCM) · AI-MedLex(SG)',
            models: [
                'magic-ai4med/mmedlm-2-70b',
                'magic-ai4med/mmedlm-2-7b',
                'magic-ai4med/mmedlm-2-1.8b',
                'freedomintelligence/apollo-medlm-7b',
                'freedomintelligence/huatuogpt-ii-7b',
                'freedomintelligence/huatuogpt-o1-72b',
                'thu-coai/zhongjing-13b',
                'scutcyr/bianque-2',
                'thudm/doctorglm-6b',
                'openi-cn/biancang-7b',
                'ai-singapore-mlb/aimedlex'
            ]
        },
        {
            code: 'biomedical-encoder',
            label: 'Biomedical Encoder Models (BERT-class)',
            icon: '📚',
            note: 'GatorTron · ClinicalBERT · BlueBERT · BioBERT · PubMedBERT · Clinical ModernBERT — biomedical NER/relation/embeddings',
            models: [
                'ufl-nvidia/gatortron-large',
                'stanford-emily/clinicalbert',
                'ncbi-nlm/bluebert-large',
                'ncbi-nlm/biobert-large',
                'microsoft/pubmedbert',
                'stanford/clinical-modernbert'
            ]
        },
        {
            code: 'korean-medical',
            label: 'Korean Medical AI (Sovereign)',
            icon: '🇰🇷',
            note: 'SNUH KMed.ai (KMLE 96.4 SOTA) · SNU-Med v1 · Lunit MedScale 32B (정부 consortium) · Lunit INSIGHT · VUNO Med-DeepCARS/Chest · Kakao Healthcare Foundation · MedKAIST',
            models: [
                'snuh-naver/kmed-ai',
                'snuh/snu-med-llm-v1',
                'lunit/medscale-foundation-32b',
                'lunit/insight-cxr-v4',
                'lunit/insight-mmg-v3',
                'vuno/med-deepcars',
                'vuno/med-chest-x-detect',
                'kakao-healthcare/kakaohealth-foundation-7b',
                'kaist/medkaist-llm-13b'
            ]
        },
        {
            code: 'medical-vlm',
            label: 'Medical Vision-Language Models',
            icon: '👁️',
            note: 'Med-Flamingo (Stanford 9B few-shot) · MedDr (InternVL 40B, derm/endo SOTA) · HuatuoGPT-Vision 7B/34B · BiomedGPT Large/XL · Intern-Medical 25B · Uni-Med · MedImageInsight · HealthGPT',
            models: [
                'stanford/med-flamingo-9b',
                'smartlab/meddr-internvl-40b',
                'freedomintelligence/huatuogpt-vision-7b',
                'freedomintelligence/huatuogpt-vision-34b',
                'taokz/biomedgpt-large',
                'taokz/biomedgpt-xlarge',
                'shanghai-ai-lab/intern-medical-25b',
                'openbmb/uni-med-vlm-8b',
                'microsoft/medimageinsight',
                'microsoft/healthgpt'
            ]
        },
        {
            code: 'protein-fm',
            label: 'Protein Structure & Design FMs',
            icon: '🧪',
            note: 'AlphaFold 2/3 + Server · ESMFold/ESM3 · RoseTTAFold 3 · Boltz-1/2 · Chai-1 · OpenFold 3 · Absci de novo antibody · Isomorphic Iso-RX',
            models: [
                'google-deepmind/alphafold-3',
                'google-deepmind/alphafold-2',
                'deepmind/alphafold-server',
                'meta/esmfold-3b',
                'meta/esm3-98b',
                'ipd/rosettafold-3',
                'boltz-ai/boltz-2',
                'boltz-ai/boltz-1',
                'chai-discovery/chai-1',
                'openfold/openfold-3',
                'absci/absci-design-fm',
                'isomorphic/iso-rx-v1'
            ]
        },
        {
            code: 'drug-discovery',
            label: 'Drug Discovery & Chemistry FMs',
            icon: '💊',
            note: 'MoLFormer / GP-MoLFormer (IBM) · ChemFM 3B (UCSD) · TamGen (target-aware) · Tx-LLM (Google) · BioNeMo 2 (NVIDIA) · LaMGen 3D · Recursion PhenomML',
            models: [
                'ibm/molformer-1.1b',
                'ibm/gp-molformer-1.1b',
                'ucsd/chemfm-3b',
                'msr-asia/tamgen-3b',
                'google/tx-llm',
                'nvidia/bionemo-2',
                'lamgen/lamgen-3d',
                'valence-labs/recursion-phenomml'
            ]
        },
        {
            code: 'radiology-reporting',
            label: 'Radiology Report Generation',
            icon: '📝',
            note: 'MedVersa (Harvard) · MAIRA-1/2 (Microsoft) · CheXagent · CXR-PRO · LLM-CXR · RGRG — chest X-ray + multi-modality report generation, ReXrank leaderboard',
            models: [
                'harvard/medversa-8b',
                'rad-onc/maira-2',
                'rad-onc/maira-1',
                'rad-onc/cheXagent-8b',
                'rad-onc/cxr-pro',
                'rad-onc/llm-cxr',
                'rad-onc/rgrg',
                'mit/mimic-cxr-baseline',
                'stanford/chexpert-baseline'
            ]
        },
        {
            code: 'multilingual-medical-vlm',
            label: 'Multilingual Medical (Arabic · African · Chinese)',
            icon: '🌍',
            note: 'BiMediX 1/2 (Arabic-English MoE, MBZUAI) · MedAraBench · AfriMed-QA baseline · 추가 medical 지역화 모델',
            models: [
                'mbzuai-oryx/bimedix-2',
                'mbzuai-oryx/bimedix',
                'mbzuai/medarabench-baseline',
                'google/afrimed-qa-baseline'
            ]
        },
        {
            code: 'safety-evaluator',
            label: 'Medical Safety / Hallucination Evaluators',
            icon: '🛡️',
            note: 'Med-HALT · MedHallu Detector · MedHallBench Judge · MEDIC Indicator Baseline — hallucination + clinical safety eval models',
            models: [
                'mit-mediallab/medhallu-detector',
                'ucsd/medhallbench-judge',
                'stanford/medhalt-eval',
                'yale/medic-eval-baseline'
            ]
        },
        {
            code: 'clinical-prediction',
            label: 'Clinical Outcome Prediction (MIMIC/eICU)',
            icon: '📈',
            note: 'ClinicalPredBERT · MIMIC-IV Sepsis Bench · MIMIC-IV AKI XGBoost · Clinical Mortality LLM (24h pred) — ICU mortality / sepsis / readmission AUROC',
            models: [
                'stanford/clinical-pred-bert',
                'mit-mimic/mimic-iv-bench',
                'phys-intelligence/medic-aki-xgb',
                'duke/clin-mortality-llm'
            ]
        },
        {
            code: 'global-japan',
            label: '🇯🇵 Japan Medical AI',
            icon: '🇯🇵',
            note: 'ELYZA-LLM-Med (IgakuQA SOTA) · CyberAgent MedCALM · JMedLoRA · Stockmark Medical · PFN BioMedic · Rikkyo JMedLLM',
            models: [
                'elyza/elyza-llm-med-70b',
                'elyza/elyza-llm-med-7b',
                'cyberagent/medcalm-7b',
                'univ-tokyo/jmedlora-7b',
                'stockmark/stockmark-medical-13b',
                'preferred-networks/pfn-bio-medic-13b',
                'rikkyo/jmedllm-bilingual-13b'
            ]
        },
        {
            code: 'global-germany',
            label: '🇩🇪 Germany Medical AI',
            icon: '🇩🇪',
            note: 'DKFZ+EMBL Delphi (1,000-disease risk, Nature 2025) · Aignostics×Mayo + Charité Rudolf (pathology FM) · TUM MedBERT.DE · Siemens Healthineers AI FM',
            models: [
                'dkfz-embl/disease-risk-fm',
                'aignostics-mayo/path-fm',
                'charite/aignostics-rudolf',
                'tum/medbert-de-large',
                'siemens-healthineers/aifm'
            ]
        },
        {
            code: 'global-france',
            label: '🇫🇷 France Medical AI',
            icon: '🇫🇷',
            note: 'BioMistral 1/2 (Avignon+CNRS Jean Zay HPC) · Owkin H-Optimus + DRAGON 2 (pathology+omics) · Raidium MedFound 3 (radiology)',
            models: [
                'mistral/biomistral-2-7b',
                'biomistral/biomistral-7b',
                'owkin/h-optimus-1',
                'owkin/dragon-2-fm',
                'raidium/medfound-3'
            ]
        },
        {
            code: 'global-uk',
            label: '🇬🇧 UK Medical AI',
            icon: '🇬🇧',
            note: 'NHS England AIDE Clinical · Moorfields+UCL+DeepMind RETFound 2 · UCL AISL · DeepMind Dolphin Clinical · Imperial Medical LLM',
            models: [
                'nhs-england/aide-clinical-llm',
                'moorfields-deepmind/retfound-2',
                'moorfields/retfound',
                'ucl-aisl/aisl-clinical-13b',
                'deepmind/dolphin-clinical',
                'imperial/imperial-medical-llm',
                'ucl/medalpaca-13b'
            ]
        },
        {
            code: 'global-canada',
            label: '🇨🇦 Canada Medical AI',
            icon: '🇨🇦',
            note: 'Vector Institute Clairvoyance · UHN Foundation (Toronto) · McGill+Mila CliniCLM · T-CAIREM HealthBench',
            models: [
                'vector/clairvoyance-13b',
                'vector/uhn-foundation-7b',
                'mcgill-mila/cliniclm-7b',
                'tcairem/healthbench-7b'
            ]
        },
        {
            code: 'global-india',
            label: '🇮🇳 India Medical AI',
            icon: '🇮🇳',
            note: 'Fractal Vaidya 1/2 (HealthBench Hard 50.1 SOTA) · FreedomIntelligence Apollo 2B/6B/7B (multilingual) · AI4Bharat Airavata Medical · AZmed Eve radiology',
            models: [
                'fractal/vaidya-2',
                'fractal/vaidya-1',
                'freedomintelligence/apollo-7b',
                'freedomintelligence/apollo-6b',
                'freedomintelligence/apollo-2b',
                'ai4bharat/airavata-medical',
                'azmed/eve-radiology'
            ]
        },
        {
            code: 'global-uae',
            label: '🇦🇪 UAE Medical AI',
            icon: '🇦🇪',
            note: 'Med42 v1/v2 (M42+Cerebras+Core42) · TII Falcon Bio-Medical · BiMediX 1/2 (MBZUAI Arabic-English MoE) · MedAraBench',
            models: [
                'm42-uae/med42-2-70b',
                'm42-uae/med42-1-70b',
                'm42-health/med42-v2-70b',
                'm42-health/med42-v2-8b',
                'tii-uae/falcon-bio-medical',
                'mbzuai-oryx/bimedix-2',
                'mbzuai-oryx/bimedix',
                'mbzuai/medarabench-baseline'
            ]
        },
        {
            code: 'global-singapore',
            label: '🇸🇬 Singapore Medical AI',
            icon: '🇸🇬',
            note: 'Synapxe Clinical-CLM (MOH Singapore) · AI Singapore SEA-MedLex',
            models: [
                'ihis-singapore/clinical-clm-7b',
                'ai-singapore/sea-medlex-13b',
                'ai-singapore-mlb/aimedlex'
            ]
        },
        {
            code: 'global-china',
            label: '🇨🇳 China Medical AI',
            icon: '🇨🇳',
            note: 'Alibaba SumiHealth · Tencent MedLLM-2 (Yuanbao) · Baidu Wenxin Yiyi · Shanghai AI Lab Puyu Medical · Tsinghua GLM-Medical · iFLYTEK Spark Medical · MMedLM 2 · HuatuoGPT 시리즈',
            models: [
                'alibaba-damo/sumihealth-72b',
                'tencent/medllm-2',
                'baidu/wenxin-yiyi-medical',
                'shanghai-ai-lab/puyu-medical-7b',
                'thudm/glm-medical-9b',
                'iflytek/spark-medical-3',
                'magic-ai4med/mmedlm-2-70b',
                'magic-ai4med/mmedlm-2-7b',
                'magic-ai4med/mmedlm-2-1.8b',
                'freedomintelligence/huatuogpt-ii-7b',
                'freedomintelligence/huatuogpt-o1-72b',
                'freedomintelligence/huatuogpt-vision-7b',
                'freedomintelligence/huatuogpt-vision-34b',
                'thu-coai/zhongjing-13b',
                'scutcyr/bianque-2',
                'thudm/doctorglm-6b',
                'openi-cn/biancang-7b',
                'shanghai-ai-lab/intern-medical-25b',
                'shanghai-ai-lab/radfm',
                'shanghai-ai-lab/visionfm',
                'openmedlab/sam-med2d',
                'openmedlab/sam-med3d'
            ]
        },
        {
            code: 'global-us',
            label: '🇺🇸 US Medical AI',
            icon: '🇺🇸',
            note: 'OpenAI/Anthropic/Google clinical · MIT CLIPath 3 · NIH C-MedBERT 2 · Stanford ClinicalFormer 3 · Mahmood Lab pathology · Stanford radiology · Cedars-Sinai cardiology · Yale + Penn',
            models: [
                'openai/chatgpt-clinicians-gpt55',
                'openai/chatgpt-clinicians-gpt54',
                'openai/openai-health-research',
                'anthropic/claude-medical-eval',
                'google/med-gemini-3-pro',
                'google/med-palm-2',
                'google/medgemma-27b',
                'mit/clipath-3',
                'nih/c-medbert-2',
                'stanford/clinicalformer-3',
                'stanford/clinical-pred-bert',
                'mahmoodlab/uni2',
                'mahmoodlab/conch',
                'mahmoodlab/titan',
                'paige-ai/virchow2',
                'echonet/echoclip',
                'echonet/echofm',
                'harvard/medversa-8b',
                'rad-onc/cheXagent-8b',
                'hippocratic-ai/polaris-3',
                'stanford/almanac-rag'
            ]
        },
        {
            code: 'medical-imaging',
            label: 'Medical Imaging FMs (Universal/Radiology/CXR)',
            icon: '🖼️',
            note: 'Universal segmentation — SAM 2 · MedSAM · SAM-Med2D/3D · BiomedCLIP · LLaVA-Med · Dragonfly-Med · RadFM · CheXzero · CXR Foundation · Rad-DINO',
            models: [
                'meta/sam-2.1-large',
                'meta/sam-1-vit-h',
                'bowang-lab/medsam-2',
                'bowang-lab/medsam',
                'openmedlab/sam-med2d',
                'openmedlab/sam-med3d',
                'microsoft/biomedclip',
                'microsoft/llava-med',
                'microsoft/rad-dino',
                'microsoft/cxr-foundation',
                'shanghai-ai-lab/radfm',
                'stanford/chexzero',
                'together-ai/dragonfly-med-8b'
            ]
        },
        {
            code: 'specialty-fm',
            label: 'Specialty FMs (Pathology · Ophthalmology · Cardiology · Dermatology)',
            icon: '🔬',
            note: 'Pathology — Virchow2/2G · UNI2 · CONCH · TITAN · Prov-GigaPath · PathChat. Ophthalmology — RETFound · VisionFM. Cardiology — EchoCLIP/EchoFM/Echo-Vision-FM. Dermatology — PanDerm · Derm Foundation',
            models: [
                'paige-ai/virchow2',
                'paige-ai/virchow2g',
                'mahmoodlab/uni2',
                'mahmoodlab/conch',
                'mahmoodlab/titan',
                'microsoft/prov-gigapath',
                'mahmoodlab/pathchat',
                'moorfields/retfound',
                'shanghai-ai-lab/visionfm',
                'echonet/echoclip',
                'echonet/echofm',
                'echonet/echo-vision-fm',
                'monash/panderm',
                'google/derm-foundation'
            ]
        },
        {
            code: 'frontier-baseline',
            label: 'Frontier Baselines (medical eval)',
            icon: '🌐',
            note: '범용 frontier 모델 — medical 벤치 비교 baseline (GPT-5.5 · Claude Opus 4.6)',
            models: [
                'openai/gpt-5.5',
                'anthropic/claude-opus-4.6'
            ]
        }
    ],

    BENCHMARK_SUITES: [
        {
            label: '🩺 Clinical Workflow Chat & Safety',
            note: 'OpenAI HealthBench Professional/Base · Polaris clinical safety · CARE-QA · Almanac RAG factuality',
            benchmarks: ['healthbench_professional', 'healthbench', 'polaris_safety', 'care_qa']
        },
        {
            label: '🎓 Medical Licensing & QA',
            note: 'USMLE / MedQA / MedMCQA / PubMedQA / MMLU clinical / MedXpertQA / MedBullets / EHRQA',
            benchmarks: ['medqa_usmle', 'medmcqa', 'pubmedqa', 'mmlu_clinical', 'medxpertqa', 'medbullets', 'ehrqa']
        },
        {
            label: '🌏 Multilingual / Regional Medical QA',
            note: 'MMedBench (6-lang rationale) · MedBench Chinese · KMLE Korean · MedAgentBench · Open Medical-LLM Leaderboard average',
            benchmarks: ['mmedbench', 'medbench_cn', 'kmle', 'medagentbench', 'open_medical_llm_avg']
        },
        {
            label: '🏥 Clinical Case Reasoning',
            note: 'NEJM Image Challenge · JAMA Clinical Challenge — case-based diagnostic reasoning · MedXpertQA Multimodal',
            benchmarks: ['nejm_image', 'jama_clin_chal', 'medxpertqa_mm']
        },
        {
            label: '🧊 Medical Imaging Segmentation',
            note: 'Universal Med-Seg Dice (CT/MRI/X-ray/endoscopy/ultrasound) · BraTS Brain · OmniMedVQA · RAD-ChestCT',
            benchmarks: ['medseg_dice', 'brats', 'omnimedvqa', 'rad_chestct']
        },
        {
            label: '🔬 Specialty Imaging FMs',
            note: 'RetBench (ophthalmology AUC) · RadBench (radiology) · Pathology External AUROC · EchoNet LVEF (cardiology) · PanDerm (dermatology)',
            benchmarks: ['retbench_auc', 'radbench', 'path_bench', 'echonet_lvef_auc50', 'echonet_lvef_mae', 'panderm_skin']
        },
        {
            label: '📚 Biomedical NLP (Encoder Models)',
            note: 'BLUE benchmark · MedS-Bench 11-task · AMEGA on-device — BERT-class biomedical encoder evaluation',
            benchmarks: ['blue_benchmark', 'meds_bench', 'amega']
        },
        {
            label: '🇰🇷 Korean Medical Sovereign',
            note: 'KMLE 2025 (320Q × 4 sections, SNUH 96.4) · KorMedLawQA · Lunit Dx AUROC (CXR/MMG external)',
            benchmarks: ['kmle_2025', 'kormedlawqa', 'lunit_dx_auc']
        },
        {
            label: '👁️ Medical VLM Evaluation',
            note: 'Med-InternVL Avg (14 imaging tasks) · VQA-Med 2024 · MedXpertQA Multimodal · NEJM Image — vision-language medical eval',
            benchmarks: ['med_internvl_avg', 'vqamed_2024']
        },
        {
            label: '⚠️ Bio Dual-Use & Safety',
            note: 'WMDP-Bio/Chem (CAIS hazardous knowledge proxy) · VCT (Virology Capabilities Test, beats 94% expert virologists) · BioLP-bench (lab protocol error correction)',
            benchmarks: ['wmdp_bio', 'wmdp_chem', 'vct_virology', 'biolp_bench']
        },
        {
            label: '🧪 Protein Structure & Design',
            note: 'CASP16 GDT-TS · AlphaFold3 confident pLDDT · PDBBind RMSD (docking) · Absci de novo antibody binding yield',
            benchmarks: ['casp16_gdt', 'alphafold3_pae', 'pdbbind_rmsd', 'absci_yield']
        },
        {
            label: '💊 Drug Discovery & Chemistry FMs',
            note: 'MoleculeNet 17-task avg · TDC ADMET 22-task — chemistry FM property prediction (MoLFormer / ChemFM / TamGen)',
            benchmarks: ['moleculenet_avg', 'tdc_admet']
        },
        {
            label: '🛡️ Medical Safety / Hallucination',
            note: 'Med-HALT · MedHallu · MedHallBench · MedSafetyBench (AMA principles, lower=safer) · PatientSafeBench · CSEDB Safety/Effectiveness · CRAFT-MD · MEDIC',
            benchmarks: ['med_halt', 'medhallu', 'medhallbench', 'medsafetybench', 'patientsafebench', 'csedb_safety', 'csedb_effectiveness', 'craft_md', 'medic_eval']
        },
        {
            label: '📝 Radiology Report Generation (ReXrank)',
            note: 'ReXrank 8-metric eval — RadGraph-F1 · BERTScore · RadCliQ (lower=better) · GREEN · FineRadScore · ReXGradient holdout · CheXpert F1 (14 finding)',
            benchmarks: ['rexrank_radgraph_f1', 'rexrank_bertscore', 'rexrank_radcliq', 'rexrank_green', 'rexrank_finerad', 'rexgrad_acc', 'chexpert_f1']
        },
        {
            label: '🖼️ Medical VQA (radiology · pathology)',
            note: 'VQA-RAD · SLAKE-VQA (EN+CN) · Path-VQA · PMC-VQA — image-grounded medical question answering',
            benchmarks: ['vqa_rad', 'slake_vqa', 'path_vqa', 'pmc_vqa']
        },
        {
            label: '🌍 Regional Medical (Arabic · African)',
            note: 'AfriMed-QA MCQ/SAQ · BiMediX bilingual eval · MedAraBench (24,883 Arabic MCQs)',
            benchmarks: ['afrimed_qa_mcq', 'afrimed_qa_saq', 'bimedix_eval', 'medarabench']
        },
        {
            label: '📈 Clinical Outcome Prediction (ICU)',
            note: 'MIMIC-IV Sepsis 24h-mortality AUROC · MIMIC-AKI XGBoost · eICU cross-generalization · MIMIC-IV 30-day Readmission',
            benchmarks: ['mimic_iv_sepsis_auc', 'mimic_aki_mortality', 'eicu_xgen_auc', 'mimic_iv_readmit']
        },
        {
            label: '🌏 National Medical Licensing & Sovereign Eval',
            note: 'IgakuQA (Japan SOTA) · NEET-PG (India) · CMExam (China) · PromedQA (Chinese Tsinghua) · M42 Clinical · Synapxe SG · NHS AIDE · UHN Clin · Delphi 1,000-Disease (DKFZ+EMBL Nature 2025) · BioMistral Multilingual',
            benchmarks: ['igakuqa', 'jmedbench', 'jmed_lora_eval', 'neet_pg', 'indic_med_bench', 'cmexam_cn', 'promedqa_cn', 'm42_clinical_avg', 'synapxe_sg_eval', 'nhs_aide_eval', 'uhn_clin_bench', 'delphi_disease_risk', 'biomistral_multilingual', 'owkin_path_avg', 'openai_healthbench_hard']
        }
    ],

    VENDOR_GROUPS: {
        'OpenAI':                            '#10b981',
        'Google DeepMind':                   '#4285f4',
        'Google':                            '#4285f4',
        'Anthropic':                         '#d97706',
        'Saama (Aaditya Ura)':               '#a855f7',
        'Avignon Univ + Nantes Univ':        '#06b6d4',
        'EPFL + Yale':                       '#f59e0b',
        'Microsoft Research':                '#3b82f6',
        'Microsoft + Google':                '#3b82f6',
        'Microsoft + Providence':            '#3b82f6',
        'Stanford + Toronto':                '#dc2626',
        'Stanford AIMI':                     '#dc2626',
        'UCL + LMU Munich':                  '#84cc16',
        'Meta AI':                           '#1877f2',
        'Bowang Lab (UoT)':                  '#f97316',
        'OpenMEDLab (Shanghai AI Lab)':      '#ef4444',
        'Shanghai AI Lab':                   '#ef4444',
        'Moorfields + UCL':                  '#84cc16',
        'Paige AI + MSK':                    '#ec4899',
        'Mahmood Lab (Harvard)':             '#a855f7',
        'Hippocratic AI':                    '#22d3ee',
        'OpenMeditron (EPFL+Yale)':          '#f59e0b',
        'MAGIC-AI4Med (Shanghai Jiao Tong)': '#ef4444',
        'M42 Health (UAE)':                  '#10b981',
        'HPAI BSC (Barcelona)':              '#fb923c',
        'FreedomIntelligence (CUHK)':        '#dc2626',
        'Stanford CRFM':                     '#dc2626',
        'Yale + UPenn':                      '#84cc16',
        'Cedars-Sinai (echonet)':            '#ec4899',
        'Cedars-Sinai':                      '#ec4899',
        'Google Health':                     '#4285f4',
        'Monash University':                 '#fb923c',
        'Univ Florida + NVIDIA':             '#76b900',
        'Microsoft Research':                '#3b82f6',
        'Together AI':                       '#a855f7',
        'AI Singapore':                      '#0ea5e9',
        'Tsinghua / SJTU':                   '#ef4444',
        'Zhengzhou University':              '#ef4444',
        'OpenI / Shandong Univ':             '#ef4444',
        'SCUTCyR (S. China Univ. of Tech.)': '#ef4444',
        'NCBI / NIH':                        '#3b82f6',
        'Korea Univ + NCBI':                 '#84cc16',
        'Stanford AIMI':                     '#dc2626',
        'Emily Alsentzer (MIT/Harvard)':     '#a855f7',
        'Stanford (Hiesinger Lab)':          '#dc2626',
        'UT Southwestern':                   '#dc2626',
        'Shanghai Jiao Tong (Wu et al)':     '#ef4444',
        'Stanford / Daejin Univ':            '#dc2626',
        'SNUH + Naver Cloud':                '#03c75a',
        'Seoul National University Hospital':'#03c75a',
        'Lunit + KAIST + SNU + Kakao Healthcare': '#0090d4',
        'Lunit':                             '#0090d4',
        'VUNO':                              '#22c55e',
        'Kakao Healthcare':                  '#fee500',
        'KAIST':                             '#004080',
        'Stanford + Hospital Italiano':      '#dc2626',
        'SmartLab HKUST + InternVL Team':    '#ef4444',
        'Lehigh + IBM':                      '#3b82f6',
        'OpenBMB':                           '#a855f7',
        'Google DeepMind + Isomorphic Labs': '#4285f4',
        'Meta FAIR':                         '#1877f2',
        'EvolutionaryScale (ex-Meta)':       '#0866ff',
        'IPD UW (Baker Lab)':                '#7c3aed',
        'Boltz-AI (MIT)':                    '#a855f7',
        'Chai Discovery':                    '#10b981',
        'OpenFold Consortium':               '#06b6d4',
        'IBM Research':                      '#054ada',
        'UC San Diego (Wang Lab)':           '#dc2626',
        'Microsoft Research Asia':           '#3b82f6',
        'Google Research':                   '#4285f4',
        'NVIDIA':                            '#76b900',
        'Isomorphic Labs':                   '#7c3aed',
        'Tencent AI Lab':                    '#0ea5e9',
        'Recursion + Valence Labs':          '#f97316',
        'Absci':                             '#dc2626',
        'Harvard MGB':                       '#a855f7',
        'MBZUAI Oryx':                       '#10b981',
        'MBZUAI':                            '#10b981',
        'Google Research + UCT':             '#fbbf24',
        'Yale + Google':                     '#84cc16',
        'MIT Media Lab':                     '#ec4899',
        'UCSD':                              '#dc2626',
        'MedHalt Consortium':                '#a855f7',
        'MIT LCP':                           '#3b82f6',
        'MIT LCP + BIDMC':                   '#3b82f6',
        'PUMC + Beihang':                    '#ef4444',
        'Duke + UCB':                        '#0ea5e9',
        'ELYZA (Japan)':                     '#bc002d',
        'CyberAgent + Univ Tokyo':           '#ff6b00',
        'Univ Tokyo Hospital':               '#bc002d',
        'Stockmark (Japan)':                 '#0070bb',
        'Preferred Networks (Japan)':        '#1d3557',
        'Rikkyo Univ':                       '#5e2750',
        'DKFZ + EMBL':                       '#000000',
        'Aignostics + Mayo Clinic':          '#0033a0',
        'Aignostics + Charité Berlin':       '#dc143c',
        'TUM München (Germany)':             '#0033a0',
        'Siemens Healthineers':              '#009999',
        'Avignon Univ + Nantes Univ + CNRS': '#002654',
        'Owkin (France)':                    '#7c3aed',
        'Raidium (France)':                  '#ed2939',
        'NHS England + Aide':                '#005eb8',
        'Moorfields + UCL + DeepMind':       '#005eb8',
        'UCL AI Centre':                     '#500778',
        'Google DeepMind UK':                '#4285f4',
        'Imperial College London':           '#003e74',
        'UHN AI Hub + Vector Institute':     '#ff0000',
        'Vector Institute (Canada)':         '#ff0000',
        'McGill + Mila (Canada)':            '#ed1b24',
        'T-CAIREM Univ Toronto':             '#002a5c',
        'Fractal Analytics (India)':         '#ff9933',
        'FreedomIntelligence (CUHK + India consortium)': '#ff9933',
        'AI4Bharat (IIT Madras)':            '#ff9933',
        'AZmed (India + France)':            '#ff9933',
        'M42 + Cerebras + Core42 (UAE)':     '#00732f',
        'M42 + Cerebras (UAE)':              '#00732f',
        'TII UAE':                           '#00732f',
        'Synapxe (Singapore MOH)':           '#ed2939',
        'Alibaba DAMO Academy':              '#ff6a00',
        'Tencent AI Lab (Yuanbao)':          '#0ea5e9',
        'Baidu Research':                    '#2932e1',
        'Tsinghua THUDM':                    '#660874',
        'iFLYTEK':                           '#005baa',
        'MIT CSAIL':                         '#a31f34',
        'OpenAI Research':                   '#10b981',
        'Anthropic Health Research':         '#d97706',
        'NIH NCBI':                          '#3b82f6'
    },

    _models: [],
    _benchmarks: [],
    _scores: [],
    _sortStates: {},

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
        this._renderCategoryMap();
        this._renderBenchmarkTable();
        this._renderTimeline();
        this._renderRadar();
        var self = this;
        var periodSel = document.getElementById('med-timeline-period');
        var yModeSel = document.getElementById('med-timeline-y-mode');
        if (periodSel && !periodSel._wired) {
            periodSel._wired = true;
            periodSel.addEventListener('change', function() { self._renderTimeline(); });
        }
        if (yModeSel && !yModeSel._wired) {
            yModeSel._wired = true;
            yModeSel.addEventListener('change', function() { self._renderTimeline(); });
        }
    },

    _getModel: function(mid) {
        return this._models.find(function(m) { return m.id === mid; });
    },
    _getBenchmark: function(bid) {
        return this._benchmarks.find(function(b) { return b.id === bid; });
    },
    _getScore: function(mid, bid) {
        var s = this._scores.find(function(x) { return x.model_id === mid && x.benchmark_id === bid; });
        return s ? s.value : null;
    },
    _categoryOf: function(mid) {
        return this.CATEGORIES.find(function(c) { return c.models.indexOf(mid) !== -1; });
    },

    _renderCategoryMap: function() {
        var el = document.getElementById('med-category-map');
        if (!el) return;
        el.textContent = '';
        var self = this;

        var grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

        this.CATEGORIES.forEach(function(cat) {
            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded-lg p-4';

            var head = document.createElement('div');
            head.className = 'flex items-center justify-between mb-2';
            var title = document.createElement('h3');
            title.className = 'text-base font-semibold text-gray-200';
            title.textContent = cat.icon + ' ' + cat.label;
            head.appendChild(title);
            var count = document.createElement('span');
            count.className = 'text-xs text-gray-500';
            var present = cat.models.filter(function(mid) { return self._getModel(mid); });
            count.textContent = present.length + ' models';
            head.appendChild(count);
            card.appendChild(head);

            var note = document.createElement('p');
            note.className = 'text-xs text-gray-500 mb-3';
            note.textContent = cat.note;
            card.appendChild(note);

            var list = document.createElement('div');
            list.className = 'space-y-1';
            present.forEach(function(mid) {
                var m = self._getModel(mid);
                if (!m) return;
                var row = document.createElement('div');
                row.className = 'flex justify-between text-xs';
                var nm = document.createElement('span');
                var rd = m.release_date || m.released_at;
                if (rd && rd.length >= 7) rd = rd.slice(0, 7);
                nm.textContent = m.name + (rd ? ' (' + rd + ')' : '');
                nm.style.cursor = 'pointer';
                nm.title = mid + ' — 클릭하면 모델 상세';
                nm.addEventListener('click', (function(modelId) {
                    return function() {
                        if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(modelId);
                    };
                })(mid));
                row.appendChild(nm);
                var vd = document.createElement('span');
                vd.className = 'text-gray-500';
                vd.textContent = m.vendor || '—';
                row.appendChild(vd);
                list.appendChild(row);
            });
            card.appendChild(list);
            grid.appendChild(card);
        });
        el.appendChild(grid);
    },

    _renderBenchmarkTable: function() {
        var el = document.getElementById('med-benchmark-table');
        if (!el) return;
        el.textContent = '';
        var self = this;

        var allModelIds = [];
        this.CATEGORIES.forEach(function(cat) {
            cat.models.forEach(function(mid) {
                if (allModelIds.indexOf(mid) === -1 && self._getModel(mid)) allModelIds.push(mid);
            });
        });
        var allBenchIds = this.BENCHMARK_SUITES.reduce(function(acc, s) { return acc.concat(s.benchmarks); }, []);
        this._scores.forEach(function(s) {
            if (allBenchIds.indexOf(s.benchmark_id) !== -1 && allModelIds.indexOf(s.model_id) === -1) {
                if (self._getModel(s.model_id)) allModelIds.push(s.model_id);
            }
        });

        var totalScores = 0, benchHits = {};
        this._scores.forEach(function(s) {
            if (allBenchIds.indexOf(s.benchmark_id) !== -1) {
                totalScores++;
                benchHits[s.benchmark_id] = (benchHits[s.benchmark_id] || 0) + 1;
            }
        });
        var summary = document.createElement('p');
        summary.className = 'text-xs text-gray-500 mb-3';
        var sb = document.createElement('strong');
        sb.className = 'text-gray-300';
        sb.textContent = totalScores + ' verified Medical AI scores';
        summary.appendChild(sb);
        summary.appendChild(document.createTextNode(' across '));
        var sc = document.createElement('strong');
        sc.className = 'text-gray-300';
        sc.textContent = String(Object.keys(benchHits).length);
        summary.appendChild(sc);
        summary.appendChild(document.createTextNode(' active benchmarks · click any score cell for source/history modal · click model name for details'));
        el.appendChild(summary);

        this.BENCHMARK_SUITES.forEach(function(suite, suiteIdx) {
            var activeBids = suite.benchmarks.filter(function(bid) {
                return allModelIds.some(function(mid) { return self._getScore(mid, bid) != null; });
            });
            if (activeBids.length === 0) return;

            var rowIds = allModelIds.filter(function(mid) {
                return activeBids.some(function(bid) { return self._getScore(mid, bid) != null; });
            });
            if (rowIds.length === 0) return;

            var TABLE_ID = 'med-suite-' + suiteIdx;

            var sortS = self._sortStates[TABLE_ID];
            if (sortS && sortS.key && sortS.dir) {
                rowIds.sort(function(a, b) {
                    var va, vb;
                    if (sortS.key === 'model') {
                        var ma = self._getModel(a), mb = self._getModel(b);
                        va = ma ? ma.name : a;
                        vb = mb ? mb.name : b;
                    } else if (sortS.key === 'category') {
                        var ca = self._categoryOf(a), cb = self._categoryOf(b);
                        va = ca ? ca.label : '';
                        vb = cb ? cb.label : '';
                    } else if (sortS.key === 'vendor') {
                        var ma2 = self._getModel(a), mb2 = self._getModel(b);
                        va = ma2 && ma2.vendor ? ma2.vendor : '';
                        vb = mb2 && mb2.vendor ? mb2.vendor : '';
                    } else {
                        va = self._getScore(a, sortS.key);
                        vb = self._getScore(b, sortS.key);
                    }
                    var aNull = va == null || va === '', bNull = vb == null || vb === '';
                    if (aNull && bNull) return 0;
                    if (aNull) return 1;
                    if (bNull) return -1;
                    if (typeof va === 'string') {
                        return sortS.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
                    }
                    return sortS.dir === 'asc' ? va - vb : vb - va;
                });
            } else {
                rowIds.sort(function(a, b) {
                    var ca = self._categoryOf(a), cb = self._categoryOf(b);
                    var ia = ca ? self.CATEGORIES.indexOf(ca) : 99;
                    var ib = cb ? self.CATEGORIES.indexOf(cb) : 99;
                    if (ia !== ib) return ia - ib;
                    var sa = activeBids.reduce(function(acc, bid) { var v = self._getScore(a, bid); return acc + (v != null ? v : 0); }, 0);
                    var sb2 = activeBids.reduce(function(acc, bid) { var v = self._getScore(b, bid); return acc + (v != null ? v : 0); }, 0);
                    return sb2 - sa;
                });
            }

            var maxes = {};
            activeBids.forEach(function(bid) {
                var max = 0;
                rowIds.forEach(function(mid) {
                    var v = self._getScore(mid, bid);
                    if (v != null && v > max) max = v;
                });
                maxes[bid] = max;
            });

            var suiteHead = document.createElement('div');
            suiteHead.className = 'mt-6 mb-2';
            var suiteTitle = document.createElement('h4');
            suiteTitle.className = 'text-sm font-semibold text-gray-200';
            suiteTitle.textContent = suite.label + '  (' + activeBids.length + ' benchmarks · ' + rowIds.length + ' models)';
            suiteHead.appendChild(suiteTitle);
            var suiteNote = document.createElement('p');
            suiteNote.className = 'text-xs text-gray-500';
            suiteNote.textContent = suite.note;
            suiteHead.appendChild(suiteNote);
            el.appendChild(suiteHead);

            var wrap = document.createElement('div');
            wrap.className = 'overflow-x-auto';
            var table = document.createElement('table');
            table.className = 'sota-table text-sm';

            var thead = document.createElement('thead');
            var hr = document.createElement('tr');
            hr.appendChild(self._makeSortableTh(TABLE_ID, 'model', 'Model', 'asc', function() {
                self._cycleSort(TABLE_ID, 'model', 'asc');
                self._renderBenchmarkTable();
            }));
            var thC = self._makeSortableTh(TABLE_ID, 'category', 'Category', 'asc', function() {
                self._cycleSort(TABLE_ID, 'category', 'asc');
                self._renderBenchmarkTable();
            });
            thC.style.fontSize = '11px';
            hr.appendChild(thC);
            var thV = self._makeSortableTh(TABLE_ID, 'vendor', 'Vendor', 'asc', function() {
                self._cycleSort(TABLE_ID, 'vendor', 'asc');
                self._renderBenchmarkTable();
            });
            thV.style.fontSize = '11px';
            hr.appendChild(thV);
            activeBids.forEach(function(bid) {
                var b = self._getBenchmark(bid);
                var label = b ? b.name : bid;
                var th = self._makeSortableTh(TABLE_ID, bid, label, 'desc', (function(localBid) {
                    return function() {
                        self._cycleSort(TABLE_ID, localBid, 'desc');
                        self._renderBenchmarkTable();
                    };
                })(bid));
                th.style.fontSize = '10px';
                th.style.whiteSpace = 'nowrap';
                hr.appendChild(th);
            });
            thead.appendChild(hr);
            table.appendChild(thead);

            var tbody = document.createElement('tbody');
            rowIds.forEach(function(mid) {
                var m = self._getModel(mid);
                var cat = self._categoryOf(mid);
                var tr = document.createElement('tr');

                var tdName = document.createElement('td');
                tdName.textContent = m ? m.name : mid;
                tdName.style.whiteSpace = 'nowrap';
                tdName.style.cursor = 'pointer';
                tdName.title = mid + ' — 클릭하면 모델 상세';
                tdName.addEventListener('click', (function(modelId) {
                    return function() {
                        if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(modelId);
                    };
                })(mid));
                tr.appendChild(tdName);

                var tdCat = document.createElement('td');
                tdCat.textContent = cat ? (cat.icon + ' ' + cat.label.split(' ')[0]) : '—';
                tdCat.style.fontSize = '11px';
                tdCat.style.color = Theme.textMuted;
                tdCat.style.whiteSpace = 'nowrap';
                tr.appendChild(tdCat);

                var tdV = document.createElement('td');
                tdV.textContent = m ? (m.vendor || '—') : '—';
                tdV.style.fontSize = '11px';
                tdV.style.color = Theme.textMuted;
                tdV.style.whiteSpace = 'nowrap';
                tr.appendChild(tdV);

                activeBids.forEach(function(bid) {
                    var td = document.createElement('td');
                    td.style.textAlign = 'center';
                    var v = self._getScore(mid, bid);
                    if (v != null) {
                        var bench = self._getBenchmark(bid);
                        var unit = bench && bench.metric ? bench.metric : '';
                        td.textContent = v.toFixed(unit === 'fps' || unit === 'seconds' || unit === 'hours' || unit === 'elo' ? 0 : 1);
                        var ratio = maxes[bid] > 0 ? v / maxes[bid] : 0;
                        if (ratio >= 0.99) { td.style.color = Theme.series[0]; td.style.fontWeight = 'bold'; }
                        else if (ratio >= 0.85) td.style.color = Theme.series[1];
                        else if (ratio >= 0.7) td.style.color = Theme.series[2];
                        else td.style.color = Theme.series[3];
                        td.style.cursor = 'pointer';
                        td.setAttribute('role', 'button');
                        td.title = '클릭하면 검증 소스';
                        td.addEventListener('click', (function(m, b) {
                            return function() {
                                if (typeof Modal !== 'undefined' && Modal.showScoreSource) Modal.showScoreSource(m, b);
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
            wrap.appendChild(table);
            el.appendChild(wrap);
        });
    },

    // Curated parameter sizes (B) for medical models — used when name doesn't carry "NB" suffix.
    KNOWN_PARAMS_MED: {
        'openai/chatgpt-clinicians-gpt55': null,
        'openai/chatgpt-clinicians-gpt54': null,
        'google/med-gemini-3-pro': null,
        'google/med-gemini-l-2': null,
        'google/med-gemini-l-1': null,
        'google/med-palm-2': 340,
        'google/med-palm-1': 540,
        'google/medgemma-27b': 27,
        'google/medgemma-9b': 9,
        'google/medgemma-1.5-4b': 4,
        'saama/openbiollm-llama3-70b': 70,
        'saama/openbiollm-llama3-8b': 8,
        'biomistral/biomistral-7b': 7,
        'mistral/biomistral-2-7b': 7,
        'epfl/meditron-70b': 70, 'epfl/meditron-7b': 7,
        'openmeditron/meditron3-70b': 70, 'openmeditron/meditron3-8b': 8,
        'microsoft/biogpt-large': 1.5,
        'stanford/clinical-camel': 70,
        'ucl/medalpaca-13b': 13,
        'magic-ai4med/mmedlm-2-70b': 70, 'magic-ai4med/mmedlm-2-7b': 7, 'magic-ai4med/mmedlm-2-1.8b': 1.8,
        'm42-health/med42-v2-70b': 70, 'm42-health/med42-v2-8b': 8,
        'm42-uae/med42-2-70b': 70, 'm42-uae/med42-1-70b': 70,
        'tii-uae/falcon-bio-medical': 40,
        'hpai-bsc/aloe-beta-70b': 70, 'hpai-bsc/aloe-beta-8b': 8,
        'freedomintelligence/apollo-medlm-7b': 7,
        'freedomintelligence/apollo-7b': 7, 'freedomintelligence/apollo-6b': 6, 'freedomintelligence/apollo-2b': 2,
        'freedomintelligence/huatuogpt-ii-7b': 7, 'freedomintelligence/huatuogpt-o1-72b': 72,
        'freedomintelligence/huatuogpt-vision-7b': 7, 'freedomintelligence/huatuogpt-vision-34b': 34,
        'stanford/biomedlm-2.7b': 2.7,
        'chaoyi-wu/pmc-llama-13b': 13,
        'yale/me-llama-13b': 13,
        'tencent/medchat-llm-13b': 13,
        'scutcyr/bianque-2': 6,
        'thu-coai/zhongjing-13b': 13,
        'thudm/doctorglm-6b': 6, 'thudm/glm-medical-9b': 9,
        'openi-cn/biancang-7b': 7,
        'ziya/asclepius-llama2-13b': 13,
        'stanford/almanac-rag': null,
        'together-ai/dragonfly-med-8b': 8,
        'shanghai-ai-lab/intern-medical-25b': 25,
        'shanghai-ai-lab/puyu-medical-7b': 7,
        'shanghai-ai-lab/radfm': 14,
        'openbmb/uni-med-vlm-8b': 8,
        'microsoft/biomedclip': 0.4, 'microsoft/llava-med': 7,
        'microsoft/rad-dino': 0.3, 'microsoft/cxr-foundation': 0.3,
        'microsoft/medimageinsight': null, 'microsoft/healthgpt': null,
        'microsoft/pubmedbert': 0.11, 'microsoft/prov-gigapath': 1.1,
        'meta/sam-2.1-large': 0.22, 'meta/sam-1-vit-h': 0.64,
        'bowang-lab/medsam-2': 0.4, 'bowang-lab/medsam': 0.09,
        'openmedlab/sam-med2d': 0.27, 'openmedlab/sam-med3d': 0.4,
        'shanghai-ai-lab/visionfm': 1.0,
        'stanford/chexzero': 0.15, 'moorfields/retfound': 0.3,
        'paige-ai/virchow2': 0.6, 'paige-ai/virchow2g': 1.85,
        'mahmoodlab/uni2': 0.6, 'mahmoodlab/conch': 0.4, 'mahmoodlab/titan': 1.0, 'mahmoodlab/pathchat': null,
        'ufl-nvidia/gatortron-large': 8.9,
        'stanford-emily/clinicalbert': 0.11, 'ncbi-nlm/bluebert-large': 0.34,
        'ncbi-nlm/biobert-large': 0.34, 'stanford/clinical-modernbert': 0.4,
        'google-deepmind/alphafold-3': null, 'google-deepmind/alphafold-2': null,
        'meta/esmfold-3b': 3, 'meta/esm3-98b': 98,
        'ipd/rosettafold-3': null,
        'boltz-ai/boltz-2': null, 'boltz-ai/boltz-1': null,
        'chai-discovery/chai-1': null, 'deepmind/alphafold-server': null,
        'openfold/openfold-3': null,
        'absci/absci-design-fm': null, 'isomorphic/iso-rx-v1': null,
        'ibm/molformer-1.1b': 1.1, 'ibm/gp-molformer-1.1b': 1.1,
        'ucsd/chemfm-3b': 3,
        'msr-asia/tamgen-3b': 3, 'google/tx-llm': null, 'nvidia/bionemo-2': null,
        'lamgen/lamgen-3d': null, 'valence-labs/recursion-phenomml': null,
        'snuh-naver/kmed-ai': null, 'snuh/snu-med-llm-v1': null,
        'lunit/medscale-foundation-32b': 32,
        'lunit/insight-cxr-v4': null, 'lunit/insight-mmg-v3': null,
        'vuno/med-deepcars': null, 'vuno/med-chest-x-detect': null,
        'kakao-healthcare/kakaohealth-foundation-7b': 7,
        'kaist/medkaist-llm-13b': 13,
        'stanford/med-flamingo-9b': 9,
        'smartlab/meddr-internvl-40b': 40,
        'taokz/biomedgpt-large': 0.182, 'taokz/biomedgpt-xlarge': 0.472,
        'echonet/echoclip': 0.4, 'echonet/echofm': null, 'echonet/echo-vision-fm': null,
        'google/derm-foundation': 0.4, 'monash/panderm': 0.6,
        'harvard/medversa-8b': 8,
        'rad-onc/maira-2': 7, 'rad-onc/maira-1': 7,
        'rad-onc/cheXagent-8b': 8, 'rad-onc/cxr-pro': 0.3,
        'rad-onc/llm-cxr': 7, 'rad-onc/rgrg': 0.2,
        'mit/mimic-cxr-baseline': 0.05, 'stanford/chexpert-baseline': 0.05,
        'phys-intelligence/medic-aki-xgb': 0.001, 'duke/clin-mortality-llm': 7,
        'mbzuai-oryx/bimedix-2': 56, 'mbzuai-oryx/bimedix': 56,
        'mbzuai/medarabench-baseline': 7,
        'google/afrimed-qa-baseline': null,
        'yale/medic-eval-baseline': 7,
        'mit-mediallab/medhallu-detector': 7, 'ucsd/medhallbench-judge': 7,
        'stanford/medhalt-eval': null, 'stanford/clinical-pred-bert': 0.11,
        'mit-mimic/mimic-iv-bench': null,
        'hippocratic-ai/polaris-3': 4200, 'hippocratic-ai/polaris-2': null, 'hippocratic-ai/polaris-1': 1000,
        'elyza/elyza-llm-med-7b': 7, 'elyza/elyza-llm-med-70b': 70,
        'cyberagent/medcalm-7b': 7, 'univ-tokyo/jmedlora-7b': 7,
        'stockmark/stockmark-medical-13b': 13,
        'preferred-networks/pfn-bio-medic-13b': 13,
        'rikkyo/jmedllm-bilingual-13b': 13,
        'dkfz-embl/disease-risk-fm': null,
        'aignostics-mayo/path-fm': null, 'charite/aignostics-rudolf': null,
        'tum/medbert-de-large': 0.34, 'siemens-healthineers/aifm': null,
        'owkin/h-optimus-1': 1.1, 'owkin/dragon-2-fm': null,
        'raidium/medfound-3': null,
        'nhs-england/aide-clinical-llm': null,
        'moorfields-deepmind/retfound-2': 0.3,
        'ucl-aisl/aisl-clinical-13b': 13,
        'deepmind/dolphin-clinical': null, 'imperial/imperial-medical-llm': 13,
        'vector/uhn-foundation-7b': 7, 'vector/clairvoyance-13b': 13,
        'mcgill-mila/cliniclm-7b': 7, 'tcairem/healthbench-7b': 7,
        'fractal/vaidya-2': 30, 'fractal/vaidya-1': null,
        'ai4bharat/airavata-medical': 7, 'azmed/eve-radiology': null,
        'ihis-singapore/clinical-clm-7b': 7, 'ai-singapore/sea-medlex-13b': 13,
        'ai-singapore-mlb/aimedlex': null,
        'alibaba-damo/sumihealth-72b': 72,
        'tencent/medllm-2': null, 'baidu/wenxin-yiyi-medical': null,
        'iflytek/spark-medical-3': null,
        'mit/clipath-3': 0.6, 'openai/openai-health-research': null,
        'anthropic/claude-medical-eval': null, 'nih/c-medbert-2': 0.34,
        'stanford/clinicalformer-3': 0.4
    },

    // Map model_id → country/region label for the timeline grouping.
    // Matches the country categories defined in CATEGORIES (global-japan, etc).
    _COUNTRY_BY_CATEGORY_CODE: {
        'korean-medical': { code: 'kr', label: 'Korea', flag: '🇰🇷' },
        'global-japan':    { code: 'jp', label: 'Japan', flag: '🇯🇵' },
        'global-germany':  { code: 'de', label: 'Germany', flag: '🇩🇪' },
        'global-france':   { code: 'fr', label: 'France', flag: '🇫🇷' },
        'global-uk':       { code: 'uk', label: 'UK', flag: '🇬🇧' },
        'global-canada':   { code: 'ca', label: 'Canada', flag: '🇨🇦' },
        'global-india':    { code: 'in', label: 'India', flag: '🇮🇳' },
        'global-uae':      { code: 'ae', label: 'UAE', flag: '🇦🇪' },
        'global-singapore':{ code: 'sg', label: 'Singapore', flag: '🇸🇬' },
        'global-china':    { code: 'cn', label: 'China', flag: '🇨🇳' },
        'global-us':       { code: 'us', label: 'US', flag: '🇺🇸' }
    },

    // Vendor-prefix fallback for models not in any country category
    _VENDOR_COUNTRY_FALLBACK: [
        ['openai/', 'us', 'US', '🇺🇸'],
        ['anthropic/', 'us', 'US', '🇺🇸'],
        ['google/', 'us', 'US', '🇺🇸'],
        ['google-deepmind/', 'us', 'US', '🇺🇸'],
        ['deepmind/', 'uk', 'UK', '🇬🇧'],
        ['meta/', 'us', 'US', '🇺🇸'],
        ['microsoft/', 'us', 'US', '🇺🇸'],
        ['nvidia/', 'us', 'US', '🇺🇸'],
        ['ibm/', 'us', 'US', '🇺🇸'],
        ['stanford/', 'us', 'US', '🇺🇸'],
        ['stanford-emily/', 'us', 'US', '🇺🇸'],
        ['mit/', 'us', 'US', '🇺🇸'],
        ['mit-mimic/', 'us', 'US', '🇺🇸'],
        ['mit-mediallab/', 'us', 'US', '🇺🇸'],
        ['nih/', 'us', 'US', '🇺🇸'],
        ['ncbi-nlm/', 'us', 'US', '🇺🇸'],
        ['ucsd/', 'us', 'US', '🇺🇸'],
        ['ucl/', 'uk', 'UK', '🇬🇧'],
        ['imperial/', 'uk', 'UK', '🇬🇧'],
        ['moorfields/', 'uk', 'UK', '🇬🇧'],
        ['nhs-england/', 'uk', 'UK', '🇬🇧'],
        ['epfl/', 'eu-other', 'EU (other)', '🇪🇺'],
        ['biomistral/', 'fr', 'France', '🇫🇷'],
        ['mistral/', 'fr', 'France', '🇫🇷'],
        ['owkin/', 'fr', 'France', '🇫🇷'],
        ['raidium/', 'fr', 'France', '🇫🇷'],
        ['dkfz-embl/', 'de', 'Germany', '🇩🇪'],
        ['aignostics-mayo/', 'de', 'Germany', '🇩🇪'],
        ['charite/', 'de', 'Germany', '🇩🇪'],
        ['tum/', 'de', 'Germany', '🇩🇪'],
        ['siemens-healthineers/', 'de', 'Germany', '🇩🇪'],
        ['hpai-bsc/', 'eu-other', 'EU (other)', '🇪🇺'],
        ['m42-uae/', 'ae', 'UAE', '🇦🇪'],
        ['m42-health/', 'ae', 'UAE', '🇦🇪'],
        ['tii-uae/', 'ae', 'UAE', '🇦🇪'],
        ['mbzuai-oryx/', 'ae', 'UAE', '🇦🇪'],
        ['mbzuai/', 'ae', 'UAE', '🇦🇪'],
        ['ihis-singapore/', 'sg', 'Singapore', '🇸🇬'],
        ['ai-singapore/', 'sg', 'Singapore', '🇸🇬'],
        ['ai-singapore-mlb/', 'sg', 'Singapore', '🇸🇬'],
        ['fractal/', 'in', 'India', '🇮🇳'],
        ['ai4bharat/', 'in', 'India', '🇮🇳'],
        ['azmed/', 'in', 'India', '🇮🇳'],
        ['freedomintelligence/', 'cn', 'China', '🇨🇳'],
        ['shanghai-ai-lab/', 'cn', 'China', '🇨🇳'],
        ['openmedlab/', 'cn', 'China', '🇨🇳'],
        ['magic-ai4med/', 'cn', 'China', '🇨🇳'],
        ['alibaba-damo/', 'cn', 'China', '🇨🇳'],
        ['tencent/', 'cn', 'China', '🇨🇳'],
        ['baidu/', 'cn', 'China', '🇨🇳'],
        ['thudm/', 'cn', 'China', '🇨🇳'],
        ['thu-coai/', 'cn', 'China', '🇨🇳'],
        ['scutcyr/', 'cn', 'China', '🇨🇳'],
        ['openi-cn/', 'cn', 'China', '🇨🇳'],
        ['iflytek/', 'cn', 'China', '🇨🇳'],
        ['chaoyi-wu/', 'cn', 'China', '🇨🇳'],
        ['openbmb/', 'cn', 'China', '🇨🇳'],
        ['smartlab/', 'cn', 'China', '🇨🇳'],
        ['elyza/', 'jp', 'Japan', '🇯🇵'],
        ['cyberagent/', 'jp', 'Japan', '🇯🇵'],
        ['univ-tokyo/', 'jp', 'Japan', '🇯🇵'],
        ['stockmark/', 'jp', 'Japan', '🇯🇵'],
        ['preferred-networks/', 'jp', 'Japan', '🇯🇵'],
        ['rikkyo/', 'jp', 'Japan', '🇯🇵'],
        ['snuh-naver/', 'kr', 'Korea', '🇰🇷'],
        ['snuh/', 'kr', 'Korea', '🇰🇷'],
        ['lunit/', 'kr', 'Korea', '🇰🇷'],
        ['vuno/', 'kr', 'Korea', '🇰🇷'],
        ['kakao-healthcare/', 'kr', 'Korea', '🇰🇷'],
        ['kaist/', 'kr', 'Korea', '🇰🇷'],
        ['vector/', 'ca', 'Canada', '🇨🇦'],
        ['mcgill-mila/', 'ca', 'Canada', '🇨🇦'],
        ['tcairem/', 'ca', 'Canada', '🇨🇦'],
        ['monash/', 'au', 'Australia', '🇦🇺'],
        ['bowang-lab/', 'ca', 'Canada', '🇨🇦'],
        ['hippocratic-ai/', 'us', 'US', '🇺🇸'],
        ['mahmoodlab/', 'us', 'US', '🇺🇸'],
        ['paige-ai/', 'us', 'US', '🇺🇸'],
        ['echonet/', 'us', 'US', '🇺🇸'],
        ['saama/', 'us', 'US', '🇺🇸'],
        ['phys-intelligence/', 'us', 'US', '🇺🇸'],
        ['duke/', 'us', 'US', '🇺🇸'],
        ['ufl-nvidia/', 'us', 'US', '🇺🇸'],
        ['yale/', 'us', 'US', '🇺🇸'],
        ['harvard/', 'us', 'US', '🇺🇸'],
        ['rad-onc/', 'us', 'US', '🇺🇸'],
        ['ziya/', 'us', 'US', '🇺🇸'],
        ['together-ai/', 'us', 'US', '🇺🇸'],
        ['boltz-ai/', 'us', 'US', '🇺🇸'],
        ['chai-discovery/', 'us', 'US', '🇺🇸'],
        ['ipd/', 'us', 'US', '🇺🇸'],
        ['openfold/', 'us', 'US', '🇺🇸'],
        ['msr-asia/', 'cn', 'China', '🇨🇳'],
        ['absci/', 'us', 'US', '🇺🇸'],
        ['isomorphic/', 'uk', 'UK', '🇬🇧'],
        ['valence-labs/', 'ca', 'Canada', '🇨🇦'],
        ['lamgen/', 'cn', 'China', '🇨🇳']
    ],

    _extractParamsB: function(modelName, modelId) {
        if (modelId && this.KNOWN_PARAMS_MED && this.KNOWN_PARAMS_MED[modelId] != null) {
            return this.KNOWN_PARAMS_MED[modelId];
        }
        if (modelId && this.KNOWN_PARAMS_MED && Object.prototype.hasOwnProperty.call(this.KNOWN_PARAMS_MED, modelId)) {
            return null;  // explicitly unknown
        }
        if (!modelName) return null;
        var m = modelName.match(/(\d+(?:\.\d+)?)\s*B\b/gi);
        if (!m) return null;
        var nums = m.map(function(s) { var n = parseFloat(s); return isNaN(n) ? null : n; }).filter(function(n) { return n != null; });
        return nums.length ? Math.max.apply(null, nums) : null;
    },

    _bestScoreFor: function(mid) {
        var best = 0;
        this._scores.forEach(function(s) {
            if (s.model_id === mid && typeof s.value === 'number' && s.value > best) best = s.value;
        });
        return best > 0 ? best : null;
    },

    _dateToTs: function(yyyyMm) {
        if (!yyyyMm) return null;
        var parts = String(yyyyMm).split('-');
        var y = parseInt(parts[0], 10);
        if (isNaN(y)) return null;
        var mo = parts.length > 1 ? parseInt(parts[1], 10) : 6;
        if (isNaN(mo)) mo = 6;
        return new Date(Date.UTC(y, mo - 1, 15)).getTime();
    },

    _countryOf: function(mid) {
        // Country is decided first by category membership, then vendor-prefix.
        var cat = this._categoryOf(mid);
        if (cat && this._COUNTRY_BY_CATEGORY_CODE[cat.code]) return this._COUNTRY_BY_CATEGORY_CODE[cat.code];
        var fb = this._VENDOR_COUNTRY_FALLBACK;
        for (var i = 0; i < fb.length; i++) {
            if (mid.indexOf(fb[i][0]) === 0) return { code: fb[i][1], label: fb[i][2], flag: fb[i][3] };
        }
        return { code: 'other', label: 'Other', flag: '·' };
    },

    _renderTimeline: function() {
        var el = document.getElementById('med-timeline');
        if (!el || typeof echarts === 'undefined') return;
        var prev = echarts.getInstanceByDom(el);
        if (prev) prev.dispose();
        Array.prototype.slice.call(el.children).forEach(function(child) {
            var ci = echarts.getInstanceByDom(child);
            if (ci) ci.dispose();
        });
        el.textContent = '';
        var self = this;

        var period = (document.getElementById('med-timeline-period') || {}).value || 'all';
        var yMode = (document.getElementById('med-timeline-y-mode') || {}).value || 'params-log';

        // Country palette — distinct colors per nation
        var countryColors = {
            'kr': '#03c75a', 'jp': '#bc002d', 'de': '#000000', 'fr': '#0055a4',
            'uk': '#012169', 'ca': '#ff0000', 'in': '#ff9933', 'ae': '#00732f',
            'sg': '#ed2939', 'cn': '#de2910', 'us': '#3c3b6e', 'eu-other': '#003399',
            'au': '#012169', 'other': '#94a3b8'
        };
        // Country display order — matches user's prompt sequence
        var countryOrder = ['cn','jp','fr','ae','sg','us','de','uk','ca','in','kr','eu-other','au','other'];

        // Build only models that belong to a medical category (exclude pure
        // frontier baselines unless they're in 'global-us')
        var allMedicalIds = {};
        this.CATEGORIES.forEach(function(cat) {
            cat.models.forEach(function(mid) { allMedicalIds[mid] = true; });
        });

        var UNKNOWN_PARAMS_Y = 0.05;
        var pointsByCountry = {};
        var countryLabel = {};
        var totalKept = 0, totalUnknownParams = 0;
        var totalAvailable = 0;

        this._models.forEach(function(model) {
            var mid = model.id;
            if (!allMedicalIds[mid]) return;
            totalAvailable++;
            var date = model.release_date || model.released_at;
            if (!date) return;

            var year = String(date).slice(0, 4);
            if (period !== 'all') {
                if (period === 'pre-2024') {
                    if (parseInt(year, 10) >= 2024) return;
                } else if (year !== period) return;
            }

            var country = self._countryOf(mid);
            var paramsB = self._extractParamsB(model.name, mid);
            var bestScore = self._bestScoreFor(mid);
            var ts = self._dateToTs(date);
            if (ts == null) return;

            var yVal = null, isUnknownPlaceholder = false;
            if (yMode === 'params-log' || yMode === 'params-linear') {
                if (paramsB == null) {
                    yVal = UNKNOWN_PARAMS_Y;
                    isUnknownPlaceholder = true;
                    totalUnknownParams++;
                } else {
                    yVal = paramsB;
                }
            } else if (yMode === 'best-score') {
                if (bestScore == null) return;
                yVal = bestScore;
            }

            var symbolSize = paramsB ? Math.max(8, Math.min(32, Math.sqrt(paramsB) * 2.4)) : 8;

            if (!pointsByCountry[country.code]) pointsByCountry[country.code] = [];
            countryLabel[country.code] = country.flag + ' ' + country.label;
            pointsByCountry[country.code].push({
                value: [ts, yVal, mid, model.name, date, paramsB, bestScore, country.flag + ' ' + country.label],
                symbolSize: symbolSize,
                itemStyle: isUnknownPlaceholder ? { opacity: 0.4, borderColor: '#0b0f17', borderWidth: 1 } : null
            });
            totalKept++;
        });

        var seriesData = [];
        var legendNames = [];
        countryOrder.forEach(function(code) {
            var pts = pointsByCountry[code];
            if (!pts || pts.length === 0) return;
            var color = countryColors[code] || '#94a3b8';
            pts.forEach(function(p) {
                if (!p.itemStyle) {
                    p.itemStyle = { color: color, opacity: 0.82, borderColor: '#0b0f17', borderWidth: 1 };
                } else if (!p.itemStyle.color) {
                    p.itemStyle.color = color;
                }
            });
            legendNames.push(countryLabel[code]);
            seriesData.push({
                name: countryLabel[code],
                type: 'scatter',
                data: pts,
                itemStyle: { color: color, opacity: 0.82, borderColor: '#0b0f17', borderWidth: 1 },
                emphasis: { focus: 'series', itemStyle: { borderColor: '#fff', borderWidth: 2, opacity: 1 } }
            });
        });

        if (seriesData.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 선택한 기간에 표시할 medical 모델이 없습니다';
            el.appendChild(empty);
            return;
        }

        var yAxisName, yAxisType, yAxisLabel;
        if (yMode === 'params-log') {
            yAxisName = '파라미터 (B) — log scale, 미공개=하단';
            yAxisType = 'log';
            yAxisLabel = function(v) { if (v <= UNKNOWN_PARAMS_Y * 1.5) return '?'; return v + 'B'; };
        } else if (yMode === 'params-linear') {
            yAxisName = '파라미터 (B) — linear';
            yAxisType = 'value';
            yAxisLabel = function(v) { return v + 'B'; };
        } else {
            yAxisName = 'Best benchmark score';
            yAxisType = 'value';
            yAxisLabel = function(v) { return v.toFixed(0); };
        }

        var coverage = document.createElement('p');
        coverage.className = 'text-xs text-gray-500 mb-2';
        coverage.textContent = '표시 중: ' + totalKept + ' / ' + totalAvailable + ' medical 모델'
            + (totalUnknownParams > 0 && yMode.indexOf('params') === 0
                ? ' · 그 중 ' + totalUnknownParams + '개는 파라미터 미공개 (y=하단 마커)' : '');
        el.appendChild(coverage);

        var host = document.createElement('div');
        host.style.height = 'calc(100% - 24px)';
        el.appendChild(host);

        var chart = echarts.init(host);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(p) {
                    var v = p.value;
                    var lines = [
                        '<strong>' + v[3] + '</strong>',
                        '국가: ' + v[7],
                        '출시: ' + v[4]
                    ];
                    if (v[5] != null) lines.push('파라미터: ~' + v[5] + 'B');
                    else if (yMode.indexOf('params') === 0) lines.push('파라미터: <em>미공개</em>');
                    if (v[6] != null) lines.push('Best 벤치마크: ' + v[6].toFixed(1));
                    return lines.join('<br/>');
                }
            },
            legend: {
                data: legendNames,
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                top: 0, type: 'scroll',
                pageTextStyle: { color: Theme.textMuted, fontSize: 10 }
            },
            grid: { left: 8, right: 32, bottom: 50, top: 50, containLabel: true },
            xAxis: {
                type: 'time', name: '출시일',
                nameTextStyle: { color: Theme.textMuted, fontSize: 10 },
                axisLabel: { color: Theme.textMuted, fontSize: 10 },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { lineStyle: { color: Theme.border, opacity: 0.3 } }
            },
            yAxis: {
                type: yAxisType, name: yAxisName,
                nameTextStyle: { color: Theme.textMuted, fontSize: 10 },
                axisLabel: { color: Theme.textMuted, fontSize: 10, formatter: yAxisLabel },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { lineStyle: { color: Theme.border, opacity: 0.3 } }
            },
            dataZoom: [
                { type: 'inside', xAxisIndex: 0, yAxisIndex: 0 },
                { type: 'slider', xAxisIndex: 0, height: 14, bottom: 8, textStyle: { color: Theme.textMuted, fontSize: 9 } }
            ],
            series: seriesData
        });
        chart.on('click', function(p) {
            if (p && p.value && p.value[2] && typeof Modal !== 'undefined' && Modal.showModel) {
                Modal.showModel(p.value[2]);
            }
        });
        window.addEventListener('resize', function() { chart.resize(); });
    },

    _renderRadar: function() {
        var el = document.getElementById('med-radar');
        if (!el || typeof echarts === 'undefined') return;
        var existing = echarts.getInstanceByDom(el);
        if (existing) existing.dispose();

        var self = this;
        // Pick top-6 clinical-LLM-eligible models by HealthBench Pro then MedQA
        var allBids = ['healthbench_professional', 'healthbench', 'medqa_usmle', 'medmcqa', 'pubmedqa', 'mmlu_clinical', 'medxpertqa'];
        var modelScoreSums = {};
        this._models.forEach(function(m) {
            var sum = 0, cnt = 0;
            allBids.forEach(function(bid) {
                var v = self._getScore(m.id, bid);
                if (v != null) { sum += v; cnt++; }
            });
            if (cnt >= 2) modelScoreSums[m.id] = sum / cnt;
        });
        var top = Object.keys(modelScoreSums).sort(function(a, b) {
            return modelScoreSums[b] - modelScoreSums[a];
        }).slice(0, 6);
        if (top.length < 2) {
            el.textContent = '';
            return;
        }

        var indicators = allBids.map(function(bid) {
            var b = self._getBenchmark(bid);
            return { name: b ? b.name : bid, max: 100 };
        });

        var series = top.map(function(mid) {
            var m = self._getModel(mid);
            return {
                name: m ? m.name : mid,
                value: allBids.map(function(bid) { return self._getScore(mid, bid) || 0; })
            };
        });

        var palette = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        var chart = echarts.init(el, null, { renderer: 'canvas' });
        chart.setOption({
            backgroundColor: 'transparent',
            color: palette,
            tooltip: {},
            legend: {
                data: series.map(function(s) { return s.name; }),
                textStyle: { color: '#9ca3af', fontSize: 11 },
                bottom: 0
            },
            radar: {
                indicator: indicators,
                splitLine: { lineStyle: { color: '#374151' } },
                splitArea: { areaStyle: { color: ['rgba(31,41,55,0.3)', 'rgba(17,24,39,0.3)'] } },
                axisName: { color: '#9ca3af', fontSize: 11 }
            },
            series: [{ type: 'radar', data: series, symbolSize: 4, areaStyle: { opacity: 0.15 } }]
        });
        window.addEventListener('resize', function() { chart.resize(); });
    }
};
