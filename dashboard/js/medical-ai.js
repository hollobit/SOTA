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
        'Absci':                             '#dc2626'
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
        this._renderRadar();
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
