/**
 * Physical AI tab: cross-comparison of World Foundation Models, VLA policies,
 * Industrial Robotics, and Manufacturing FMs. Pulls from the same model/score
 * registry as Sovereign AI but groups by embodied-intelligence category
 * instead of country.
 */
var PhysicalAI = {
    CATEGORIES: [
        {
            code: 'world-models',
            label: 'World Foundation Models',
            icon: '🌐',
            note: 'Cosmos Predict / Reason · DeepMind Genie · Tencent HY-World · WonderWorld · CogVideoX-I2V · Runway Gen-3 · AgiBot · Omniverse Mega',
            models: [
                'nvidia/cosmos-predict-2.5', 'nvidia/cosmos-predict-2.5-2b', 'nvidia/cosmos-predict-2.5-14b', 'nvidia/cosmos-predict-1-7b',
                'nvidia/cosmos-reason-2', 'nvidia/cosmos-reason-1', 'nvidia/cosmos-reason-1-56b', 'nvidia/cosmos-reason-1-8b',
                'nvidia/cosmos-policy-robocasa',
                // 2026-05-30 Session 38 — NVIDIA Cosmos3 + Cosmos-Reason2 (PAI-Bench SOTA family)
                'nvidia/cosmos3-super', 'nvidia/cosmos3-nano',
                'nvidia/cosmos-reason2-32b', 'nvidia/cosmos-reason2-8b',
                // 2026-06-02 S46 — Cosmos 3 Tech Report (NVIDIA): Edge + post-trained variants
                'nvidia/cosmos3-edge',
                'nvidia/cosmos3-super-text2image', 'nvidia/cosmos3-super-image2video',
                'nvidia/cosmos3-nano-policy-droid',
                // 2026-05-30 Session 39 — Conditional video generation (PAI-Bench-C)
                'nvidia/cosmos-transfer2.5-2b',
                'alibaba/wan-2.2-fun-a14b-control', 'alibaba/wan-2.2-fun-5b-control',
                // 2026-05-31 S41 — WorldArena Track 1 new frontier baselines
                'google/veo-3.1', 'alibaba/wan-2.2', 'alibaba/wan-2.6',
                // 2026-06-04 S51 — arena.ai T2V/I2V Arena new entries
                'alibaba/wan2.7-t2v', 'xai/grok-imagine-video-1.5-preview-720p',
                // 2026-05-30 WorldArena named baselines (Tsinghua FIB)
                'tsinghua/ctrl-world', 'bytedance/irasim',
                // 2026-05-30 PAI-Bench-G additional video gen entries (S38)
                'alibaba/wan-2.2-i2v-a14b',
                // 2026-05-30 PAI-Bench-U VLM frontier (S38)
                'alibaba/qwen3-vl-235b-a22b-instruct',
                'google-deepmind/genie-3', 'google-deepmind/genie-2',
                'tencent/hy-world-2.0',
                'wonderworld/wonderworld', 'zhipu/cogvideox-i2v', 'runway/gen-3',
                'agibot/genie-envisioner',
                'nvidia/omniverse-mega',
                // 2026-05 World Foundation Model batch (Sections 45, 48)
                'nvidia/sana-wm', 'nvidia/sana-wm-refiner',
                'meta/v-jepa-2', 'meta/v-jepa-2.1',
                'world-labs/marble',
                'wayve/gaia-2',
                'lingbot/lingbot-world',
                'skywork/matrix-game-3.0',
                'tencent/hy-worldplay',
                'infinite-world/infinite-world'
            ]
        },
        {
            code: 'vla-policies',
            label: 'VLA Policies (generalist robots)',
            icon: '🦾',
            note: 'Vision-Language-Action 일반 로봇 정책 — GR00T N1/N1.5/N1.6/N1.7 · Pi-Zero/Pi-0.5 · OpenVLA + OFT · Octo-Base · Gemini Robotics-ER',
            models: [
                'nvidia/gr00t-n1.7', 'nvidia/gr00t-n1.6', 'nvidia/gr00t-n1.5', 'nvidia/gr00t-n1',
                'physical-intelligence/pi-zero', 'physical-intelligence/pi-zero-fast', 'physical-intelligence/pi-0.5', 'physical-intelligence/rdt-1b',
                'openvla/openvla-7b', 'openvla/openvla-oft',
                'octo/octo-base',
                'google-deepmind/gemini-robotics-er-1.6', 'google-deepmind/gemini-robotics-er-1.5',
                // May 2026 additions — Allen AI MolmoAct2 family + NVIDIA CaP-X coding-agent for manipulation
                'allenai/molmoact2', 'allenai/molmoer', 'nvidia/cap-agent0',
                'allenai/molmoact-2',  // canonical id used in newer ingest (Section 38)
                // 2026-05-20 Alibaba Qwen robotics — quadruped robot dog control + navigation FM
                'alibaba/qwen-robotclaw', 'alibaba/qwen-robotnav',
                // 2026-06-01 S45 — Alibaba Qwen-VLA paper (arxiv 2605.30280): unified VLA across tasks/environments/embodiments
                'alibaba/qwen-vla-base', 'alibaba/qwen-vla-instruct',
                'alibaba/qwen-vla-aloha-pretrain', 'alibaba/qwen-vla-aloha-no-pretrain',
                'amap-cvlab/abot-m0', 'starvla/starvla-oft'
            ]
        },
        {
            code: 'industrial-robots',
            label: 'Industrial Robotics',
            icon: '🤖',
            note: '휴머노이드·산업 통합 brain — Skild · Covariant · Figure · 1X · Apptronik · Agility · Sanctuary · Tesla',
            models: [
                'skild/skild-brain',
                'covariant/rfm-1',
                'figure-ai/helix',
                '1x/world-model',
                'apptronik/apollo-gemini',
                'agility/digit-arc',
                'sanctuary/carbon',
                'tesla/optimus-vlm',
                // May 6 2026 — Genesis AI robotic FM with dexterous hand + tactile glove
                'genesis-ai/gene-26.5'
            ]
        },
        {
            code: 'manufacturing-fm',
            label: 'Manufacturing & Industrial AI',
            icon: '🏭',
            note: '산업·공정·CAD·digital twin — Foxconn · Siemens · Hitachi · GE Vernova · Bosch · AVEVA · Autodesk · Landing AI · PTC · Dassault',
            models: [
                'foxconn/foxbrain-70b',
                'siemens/sifm',
                'hitachi/hal',
                'ge-vernova/predix-ai',
                'bosch/industrial-genai',
                'aveva/industrial-ai-assistant',
                'autodesk/bernini',
                'landing-ai/visionagent',
                'ptc/creo-copilot',
                'dassault/3dx-aura'
            ]
        },
        {
            code: 'human-centric-vision',
            label: 'Human-Centric Vision Foundation Models',
            icon: '🧍',
            note: '인간 중심 비전 트랜스포머 — pose/segmentation/normals/pointmap/albedo. Meta Sapiens2 family (1B human images 사전학습) · Reka Edge (physical AI edge VLM)',
            models: [
                'meta/sapiens2-5b', 'meta/sapiens2-1b-4k', 'meta/sapiens2-1b', 'meta/sapiens2-0.8b', 'meta/sapiens2-0.4b', 'meta/sapiens2-0.1b',
                'reka/reka-edge-2603'
            ]
        }
    ],

    // Vendor cluster colors so timeline is readable across categories.
    VENDOR_GROUPS: {
        'NVIDIA':                          '#76b900',
        'Google DeepMind':                 '#4285f4',
        'Physical Intelligence':           '#ec4899',
        'OpenVLA Consortium':              '#a855f7',
        'AgiBot':                          '#0ea5e9',
        'Skild AI':                        '#f97316',
        'Covariant':                       '#14b8a6',
        'Figure AI':                       '#ef4444',
        '1X Technologies':                 '#22d3ee',
        'Apptronik + DeepMind':            '#3b82f6',
        'Agility Robotics':                '#fbbf24',
        'Sanctuary AI':                    '#a78bfa',
        'Tesla':                           '#dc2626',
        'Foxconn (Hon Hai Research)':      '#f59e0b',
        'Siemens':                         '#10b981',
        'Hitachi':                         '#06b6d4',
        'GE Vernova':                      '#84cc16',
        'Bosch':                           '#f43f5e',
        'AVEVA (Schneider Electric)':      '#22c55e',
        'Autodesk':                        '#0284c7',
        'Landing AI':                      '#facc15',
        'PTC':                             '#16a34a',
        'Dassault Systèmes':               '#9333ea'
    },

    // Benchmarks grouped into thematic sub-suites so the leaderboard renders
    // as multi-section tables (instead of one wide column-stuffed table).
    // Each suite gets its own table with its own model rows.
    BENCHMARK_SUITES: [
        {
            id: 'vla-manipulation',
            label: '🦾 VLA Manipulation Suites',
            note: 'LIBERO 4-suite + RoboCasa + RoboTwin + VLABench + ALOHA + Bridge V2 + Open X-Embodiment + DexMimicGen',
            benchmarks: [
                'libero', 'libero_spatial', 'libero_object', 'libero_goal', 'libero_long',
                'robocasa', 'robocasa365', 'robotwin2', 'vlabench', 'vlabench_track1_primitive',
                'bridge_v2', 'aloha_4task_avg',
                'open_x_embodiment', 'dexmimicgen', 'gr1_tabletop',
                'simpler_env_avg', 'roboarena_elo',
                'gr1_real_lang_following', 'unitree_g1_1k_demos', 'realworld_language_following',
                // 2026-05-30 Positronic Robotics PhAIL v1.0 — real-hardware bin-picking
                'phail_v1_uph',
                // 2026-06-01 S45 — Qwen-VLA paper (arxiv 2605.30280) benches
                'robotwin_easy', 'robotwin_hard', 'simpler_widowx', 'robocasa_gr1',
                'simplerenv_ood', 'domino_sr', 'aloha_real_in_domain', 'r2r_val_unseen_sr',
                // 2026-06-02 S46 — Cosmos 3 Tech Report benches (RoboLab DROID / LIBERO-10 adaptation)
                'robolab_droid_specific', 'libero_10_adaptation_2k'
            ]
        },
        {
            id: 'world-model',
            label: '🌐 World Model Quality',
            note: 'PAI-Bench · WorldScore (Stanford) · WorldModelBench (NeurIPS 2025) · EWMBench (AgiBot) · 1X World Model Challenge · AV/Robot FVD-FID-PSNR · World-model real-time FPS / consistency horizon',
            benchmarks: [
                'pai_bench_text2world', 'pai_bench_image2world',
                'pai_bench_text2world_post', 'pai_bench_image2world_overall',  // 2026-05 NVIDIA Cosmos Predict 2.5 paper
                'fvd_av_multiview',  // 2026-05 Cosmos Predict 2.5 FVD
                'worldscore_static', 'worldscore_dynamic', 'worldscore_3d_consistency',
                'ewmbench', 'worldmodelbench_avg',
                'humanoid_sampling_psnr', 'humanoid_compression_top500_ce',
                'world_model_fps', 'world_model_consistency', 'world_model_visual_memory',
                'av_fvd', 'av_fid', 'robot_manip_psnr', 'robot_manip_fvd',
                // 2026-05 VBench / VBench-2.0 (Section 45)
                'vbench_total', 'vbench_quality', 'vbench_semantic',
                'vbench2_total', 'vbench2_physics', 'vbench2_commonsense',
                'vbench2_controllability', 'vbench2_human_fidelity', 'vbench2_creativity',
                // 2026-05 NVIDIA SANA-WM 1-minute world model bench (Section 48)
                'sana_wm_1min_simple_vbench', 'sana_wm_1min_hard_vbench',
                'sana_wm_1min_simple_pose_r', 'sana_wm_1min_hard_pose_r',
                'sana_wm_1min_simple_diq', 'sana_wm_1min_hard_diq',
                'sana_wm_1min_throughput',
                // 2026-05-30 Tsinghua FIB WorldArena + SHI-Labs PAI-Bench Generation (arxiv 2512.01989)
                'worldarena', 'pai_bench_g',
                // 2026-05-30 Session 39 PAI-Bench Conditional Generation Quality
                'pai_bench_c_quality',
                // 2026-05-31 S40 WorldArena Track 2 Policy Evaluator (HF Space public 05-29)
                'worldarena_track2_policy',
                // 2026-05-31 S41 WorldArena Track 1 — 16 sub-metrics across 6 dimensions
                'worldarena_image_quality', 'worldarena_aesthetic_quality',
                'worldarena_jepa_similarity', 'worldarena_dynamic_degree', 'worldarena_flow_score', 'worldarena_motion_smoothness',
                'worldarena_subject_consistency', 'worldarena_background_consistency', 'worldarena_photometric_consistency',
                'worldarena_interaction_quality', 'worldarena_trajectory_accuracy',
                'worldarena_depth_accuracy', 'worldarena_perspectivity',
                'worldarena_instruction_following', 'worldarena_semantic_alignment', 'worldarena_action_following',
                // 2026-06-02 S46 — Cosmos 3 Tech Report video/image generation + physics + HUE + audio
                'paibench_g_t2v_overall', 'paibench_g_i2v_overall', 'rbench_i2v',
                'physics_iq_i2v', 'physics_iq_v2v',
                'cosmos_hue_t2v', 'cosmos_hue_i2v', 'human_world_bench_i2v',
                'soundbench_avq', 'soundbench_sav',
                'unigenbench_all_1170', 'cvtg_500l_pned', 'cvtg_102ch_pned', 'hpsv3', 'aesthetic_v2',
                // 2026-06-02 S46b deep re-mine — Cosmos HUE per-dimension + per-domain + PAIBench-G sub-scores + SoundBench PQ
                'cosmos_hue_t2v_sem_align', 'cosmos_hue_t2v_phys_laws', 'cosmos_hue_t2v_geom_reas', 'cosmos_hue_t2v_vis_integ',
                'cosmos_hue_t2v_av', 'cosmos_hue_t2v_physics', 'cosmos_hue_t2v_robot',
                'cosmos_hue_i2v_phys_laws', 'cosmos_hue_i2v_vis_integ',
                'paibench_g_t2v_domain', 'paibench_g_t2v_quality',
                'paibench_g_i2v_domain', 'paibench_g_i2v_quality',
                'soundbench_pq',
                // 2026-06-04 S51 — arena.ai T2V/I2V Arena Elo
                'arena_i2v_elo', 'arena_t2v_elo'
            ]
        },
        {
            id: 'embodied-reasoning',
            label: '🧠 Embodied Reasoning',
            note: 'Cosmos Reason 1 (PCS · Embodied · Intuitive Physics) · Gemini Robotics-ER · ERQA · Pixmo-Point · LingoQA · RoboVQA',
            benchmarks: [
                'cosmos_physical_common_sense', 'cosmos_embodied_reasoning', 'cosmos_intuitive_physics',
                'intuitive_physics_spatial_puzzle', 'intuitive_physics_arrow_of_time', 'intuitive_physics_object_permanence',
                'gemini_instrument_reading', 'instrument_reading_agentic_vision',
                'erqa', 'pixmo_point', 'physical_ai_bench', 'physical_reasoning_leaderboard',
                'robovqa', 'lingoqa',
                // 2026-05 Meta Physical Reasoning Leaderboard + V-JEPA 2 video understanding (Section 45)
                'intphys2', 'mvpbench', 'causalvqa',
                'ss_v2_top1', 'epic_kitchens_recall5', 'perception_test', 'tempcompass',
                // 2026-05-21 FactoryBench (arxiv 2605.07675) — 4-level causal reasoning over industrial robot telemetry
                'factorybench_l1_state', 'factorybench_l2_intervention',
                'factorybench_l3_counterfactual', 'factorybench_l4_decision',
                // 2026-05-30 SHI-Labs PAI-Bench Understanding (arxiv 2512.01989)
                'pai_bench_u'
            ]
        },
        {
            id: 'industrial-deployment',
            label: '🏭 Industrial Deployment Metrics',
            note: 'Real-world deployment KPIs — Skild failure recovery · Covariant pick retry · Figure Helix throughput / barcode / T_eff / BMW uptime · OpenVLA LoRA efficiency · FoxBrain news rewrite / TMMLU+ · CaP-Bench (39 tasks × 8 tiers, robot manipulation coding agents, NVIDIA + Stanford + Berkeley + UT Austin Mar 2026)',
            benchmarks: [
                'skild_failure_recovery', 'humanoid_failure_recovery_time',
                'pick_retry_reduction',
                'helix_logistics_throughput', 'helix_barcode_accuracy', 'helix_effective_throughput', 'bmw_deployment_uptime',
                'openvla_lora_efficiency',
                'mfg_news_rewrite', 'tmmlu_plus',
                // May 2026 addition — robot-manipulation coding-agent benchmark (CaP-X / arxiv 2603.22435)
                'cap_bench'
            ]
        }
    ],

    // Backwards-compat flat list (kept for any external callers)
    get BENCHMARKS() {
        var all = [];
        this.BENCHMARK_SUITES.forEach(function(s) {
            s.benchmarks.forEach(function(b) { if (all.indexOf(b) === -1) all.push(b); });
        });
        return all;
    },

    // Model release dates (month precision). Re-uses Sovereign's RELEASE_DATES
    // map at runtime when available, with locally-required entries as fallback.
    _localReleaseDates: {
        'nvidia/cosmos-predict-2.5': '2025-09', 'nvidia/cosmos-reason-2': '2025-09', 'nvidia/cosmos-policy-robocasa': '2025-10',
        'nvidia/cosmos-reason-1': '2025-03',
        'nvidia/cosmos-predict-2.5-2b': '2025-09', 'nvidia/cosmos-predict-2.5-14b': '2025-09', 'nvidia/cosmos-predict-1-7b': '2024-12',
        'nvidia/cosmos-reason-1-56b': '2025-03', 'nvidia/cosmos-reason-1-8b': '2025-03',
        'nvidia/gr00t-n1.7': '2025-11', 'nvidia/gr00t-n1.6': '2025-08',
        'nvidia/gr00t-n1.5': '2025-06', 'nvidia/gr00t-n1': '2025-03',
        'google-deepmind/genie-3': '2025-08', 'google-deepmind/genie-2': '2024-12',
        'physical-intelligence/pi-zero': '2024-11', 'physical-intelligence/pi-zero-fast': '2025-04',
        'physical-intelligence/pi-0.5': '2025-04', 'physical-intelligence/rdt-1b': '2024-10',
        'openvla/openvla-7b': '2024-06', 'openvla/openvla-oft': '2025-02',
        'octo/octo-base': '2024-05',
        'agibot/genie-envisioner': '2025-06',
        'tencent/hy-world-2.0': '2026-04',
        'wonderworld/wonderworld': '2024-08',
        'zhipu/cogvideox-i2v': '2024-09',
        'runway/gen-3': '2024-06'
    },

    _models: [],
    _benchmarks: [],
    _scores: [],
    _initialized: false,
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
        this._initialized = true;

        if (typeof PhysicalAICharts !== 'undefined' && PhysicalAICharts.renderAll) {
            PhysicalAICharts.renderAll();
        }
    },

    // ─────────────── Helpers (mirror Sovereign's where useful) ───────────────
    _getModel: function(mid) {
        return this._models.find(function(m) { return m.id === mid; });
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
    _getReleaseDate: function(mid) {
        if (typeof Sovereign !== 'undefined' && Sovereign.RELEASE_DATES && Sovereign.RELEASE_DATES[mid]) {
            return Sovereign.RELEASE_DATES[mid];
        }
        return this._localReleaseDates[mid] || null;
    },
    _extractParamsB: function(modelName) {
        if (!modelName) return null;
        var matches = modelName.match(/(\d+(?:\.\d+)?)\s*B\b/gi);
        if (!matches || matches.length === 0) return null;
        var nums = matches.map(function(s) {
            var n = parseFloat(s.replace(/[Bb]/, '').trim());
            return isNaN(n) ? null : n;
        }).filter(function(n) { return n != null; });
        return nums.length === 0 ? null : Math.max.apply(null, nums);
    },
    _dateToTs: function(yyyyMm) {
        var parts = yyyyMm.split('-');
        var y = parseInt(parts[0], 10);
        var m = parts.length > 1 ? parseInt(parts[1], 10) : 6;
        return new Date(Date.UTC(y, m - 1, 15)).getTime();
    },
    _categoryOf: function(modelId) {
        for (var i = 0; i < this.CATEGORIES.length; i++) {
            if (this.CATEGORIES[i].models.indexOf(modelId) !== -1) return this.CATEGORIES[i];
        }
        return null;
    },

    // ─────────────── Category map cards ───────────────
    _renderCategoryMap: function() {
        var container = document.getElementById('phys-category-map');
        if (!container) return;
        container.textContent = '';
        var self = this;

        this.CATEGORIES.forEach(function(cat) {
            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col';

            var head = document.createElement('div');
            head.className = 'flex items-center gap-2 mb-2';
            var icon = document.createElement('span');
            icon.style.fontSize = '20px';
            icon.textContent = cat.icon;
            head.appendChild(icon);
            var label = document.createElement('span');
            label.className = 'text-widget text-gray-200 font-semibold';
            label.textContent = cat.label;
            head.appendChild(label);
            var presentCnt = cat.models.filter(function(mid) { return self._getModel(mid); }).length;
            var count = document.createElement('span');
            count.className = 'ml-auto text-xs text-gray-500';
            count.textContent = presentCnt + ' models';
            head.appendChild(count);
            card.appendChild(head);

            var note = document.createElement('p');
            note.className = 'text-xs text-gray-500 mb-3';
            note.textContent = cat.note;
            card.appendChild(note);

            var list = document.createElement('div');
            list.className = 'flex flex-col gap-1';

            // Sort by release date desc
            var sorted = cat.models.slice().sort(function(a, b) {
                var da = self._getReleaseDate(a) || '';
                var db = self._getReleaseDate(b) || '';
                if (!da && !db) return 0;
                if (!da) return 1;
                if (!db) return -1;
                return db.localeCompare(da);
            });

            sorted.forEach(function(mid) {
                var m = self._getModel(mid);
                if (!m) return;
                var releaseDate = self._getReleaseDate(mid);
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
                var meta = document.createElement('span');
                meta.className = 'text-xs text-gray-500';
                meta.textContent = m.vendor || '';
                meta.style.maxWidth = '40%';
                meta.style.textAlign = 'right';
                meta.style.whiteSpace = 'nowrap';
                meta.style.overflow = 'hidden';
                meta.style.textOverflow = 'ellipsis';
                row.appendChild(meta);
                list.appendChild(row);
            });

            if (presentCnt === 0) {
                var empty = document.createElement('div');
                empty.className = 'text-xs text-gray-600 italic';
                empty.textContent = '— no models tracked yet';
                list.appendChild(empty);
            }
            card.appendChild(list);

            card.addEventListener('click', (function(catCode) {
                return function(e) {
                    if (e.shiftKey && typeof PhysicalAICharts !== 'undefined' && PhysicalAICharts.openCategoryLeaderboard) {
                        PhysicalAICharts.openCategoryLeaderboard(catCode);
                        return;
                    }
                    // (preserve any existing non-shift click behavior here, or no-op)
                };
            })(cat.code));
            card.title = (card.title || '') + ' · Shift+click for leaderboard';

            container.appendChild(card);
        });
    },

    // ─────────────── Benchmark leaderboard ───────────────
    _renderBenchmarkTable: function() {
        var el = document.getElementById('phys-benchmark-table');
        if (!el) return;
        el.textContent = '';
        var self = this;

        // Build the master model list: every model that appears in any category.
        var allModelIds = [];
        this.CATEGORIES.forEach(function(cat) {
            cat.models.forEach(function(mid) {
                if (allModelIds.indexOf(mid) === -1 && self._getModel(mid)) allModelIds.push(mid);
            });
        });
        // Also include any DB model with a score on a Physical-AI benchmark
        // but not in our category lists (e.g. baselines: gpt-4o, o1).
        var allBenchIds = this.BENCHMARK_SUITES.reduce(function(acc, s) {
            return acc.concat(s.benchmarks);
        }, []);
        this._scores.forEach(function(s) {
            if (allBenchIds.indexOf(s.benchmark_id) !== -1 && allModelIds.indexOf(s.model_id) === -1) {
                if (self._getModel(s.model_id)) allModelIds.push(s.model_id);
            }
        });

        // Summary banner
        var totalScores = 0;
        var benchHits = {};
        this._scores.forEach(function(s) {
            if (allBenchIds.indexOf(s.benchmark_id) !== -1) {
                totalScores++;
                benchHits[s.benchmark_id] = (benchHits[s.benchmark_id] || 0) + 1;
            }
        });
        var activeBenchCount = Object.keys(benchHits).length;
        var summary = document.createElement('p');
        summary.className = 'text-xs text-gray-500 mb-3';
        var sb = document.createElement('strong');
        sb.className = 'text-gray-300';
        sb.textContent = totalScores + ' verified Physical AI scores';
        summary.appendChild(sb);
        summary.appendChild(document.createTextNode(' across '));
        var sc = document.createElement('strong');
        sc.className = 'text-gray-300';
        sc.textContent = String(activeBenchCount);
        summary.appendChild(sc);
        summary.appendChild(document.createTextNode(' active benchmarks · click any score cell for source/history modal · click model name for details'));
        el.appendChild(summary);

        // One table per BENCHMARK_SUITE
        this.BENCHMARK_SUITES.forEach(function(suite, suiteIdx) {
            var activeBids = suite.benchmarks.filter(function(bid) {
                return allModelIds.some(function(mid) { return self._getScore(mid, bid) != null; });
            });
            if (activeBids.length === 0) return;

            var rowIds = allModelIds.filter(function(mid) {
                return activeBids.some(function(bid) { return self._getScore(mid, bid) != null; });
            });
            if (rowIds.length === 0) return;

            var TABLE_ID = 'phys-suite-' + suiteIdx;

            // Apply sort: explicit per-column when set, else default category-then-sum
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

            // Suite section header
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

    // ─────────────── Timeline scatter (x = date, y = category) ───────────────
    _renderTimeline: function() {
        var el = document.getElementById('phys-timeline');
        if (!el) return;
        var prev = echarts.getInstanceByDom(el);
        if (prev) prev.dispose();
        el.textContent = '';
        var self = this;

        var pointsByVendor = {};
        var categoryLabels = this.CATEGORIES.map(function(c) { return c.icon + ' ' + c.label; });

        this.CATEGORIES.forEach(function(cat) {
            cat.models.forEach(function(mid) {
                var m = self._getModel(mid);
                var date = self._getReleaseDate(mid);
                if (!m || !date) return;
                var ts = self._dateToTs(date);
                var paramsB = self._extractParamsB(m.name);
                var symbolSize = paramsB ? Math.max(10, Math.min(38, Math.sqrt(paramsB) * 3)) : 14;
                var vendor = m.vendor || 'Other';
                if (!pointsByVendor[vendor]) pointsByVendor[vendor] = [];
                pointsByVendor[vendor].push({
                    value: [ts, cat.icon + ' ' + cat.label, mid, m.name, date, paramsB, vendor, cat.label],
                    symbolSize: symbolSize
                });
            });
        });

        var seriesData = Object.keys(pointsByVendor).map(function(vendor) {
            var color = self.VENDOR_GROUPS[vendor] || '#94a3b8';
            return {
                name: vendor,
                type: 'scatter',
                data: pointsByVendor[vendor],
                itemStyle: { color: color, opacity: 0.85, borderColor: '#0b0f17', borderWidth: 1 },
                emphasis: { focus: 'series', itemStyle: { borderColor: '#fff', borderWidth: 2, opacity: 1 } }
            };
        });

        if (seriesData.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 표시할 모델이 없습니다';
            el.appendChild(empty);
            return;
        }

        var chart = echarts.init(el);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(p) {
                    var v = p.value;
                    var lines = [
                        '<strong>' + v[3] + '</strong>',
                        'Category: ' + v[7],
                        'Vendor: ' + v[6],
                        '출시: ' + v[4]
                    ];
                    if (v[5] != null) lines.push('파라미터: ~' + v[5] + 'B');
                    return lines.join('<br/>');
                }
            },
            legend: {
                data: seriesData.map(function(s) { return s.name; }),
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                top: 0, type: 'scroll'
            },
            grid: { left: 8, right: 32, bottom: 50, top: 60, containLabel: true },
            xAxis: {
                type: 'time',
                axisLabel: { color: Theme.textMuted, fontSize: 10 },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { lineStyle: { color: Theme.border, opacity: 0.3 } }
            },
            yAxis: {
                type: 'category', data: categoryLabels,
                axisLabel: { color: Theme.textMuted, fontSize: 11 },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { show: true, lineStyle: { color: Theme.border, opacity: 0.2 } }
            },
            dataZoom: [
                { type: 'inside', xAxisIndex: 0 },
                { type: 'slider', xAxisIndex: 0, height: 14, bottom: 8, textStyle: { color: Theme.textMuted, fontSize: 9 } }
            ],
            series: seriesData
        });
        chart.on('click', function(p) {
            if (p && p.value && p.value[2]) {
                if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(p.value[2]);
            }
        });
        window.addEventListener('resize', function() { chart.resize(); });
    },

    // ─────────────── Capability radar (4-axis) ───────────────
    _renderRadar: function() {
        var el = document.getElementById('phys-radar');
        if (!el) return;
        var prev = echarts.getInstanceByDom(el);
        if (prev) prev.dispose();
        el.textContent = '';
        var self = this;

        // 4-axis definition. Each axis aggregates a benchmark group. Expanded
        // to include the new benchmarks discovered in the Apr 2026 sweep.
        var AXES = [
            { name: 'VLA Policy', benches: [
                'libero', 'libero_spatial', 'libero_object', 'libero_goal', 'libero_long',
                'robocasa', 'robocasa365', 'robotwin2', 'vlabench', 'vlabench_track1_primitive',
                'bridge_v2', 'aloha_4task_avg', 'open_x_embodiment', 'simpler_env_avg',
                'gr1_real_lang_following', 'unitree_g1_1k_demos', 'realworld_language_following'
            ] },
            { name: 'World Model Coherence', benches: [
                'world_model_consistency', 'world_model_fps', 'world_model_visual_memory',
                'pai_bench_text2world', 'pai_bench_image2world',
                'worldscore_static', 'worldscore_dynamic', 'worldscore_3d_consistency',
                'ewmbench', 'worldmodelbench_avg',
                'humanoid_sampling_psnr', 'robot_manip_psnr'
            ] },
            { name: 'Embodied Reasoning', benches: [
                'gemini_instrument_reading', 'skild_failure_recovery',
                'cosmos_physical_common_sense', 'cosmos_embodied_reasoning', 'cosmos_intuitive_physics',
                'intuitive_physics_spatial_puzzle', 'intuitive_physics_arrow_of_time', 'intuitive_physics_object_permanence',
                'erqa', 'pixmo_point', 'physical_ai_bench', 'robovqa', 'lingoqa'
            ] },
            { name: 'Industrial Integration', benches: [
                'mfg_news_rewrite', 'tmmlu_plus',
                'helix_logistics_throughput', 'helix_barcode_accuracy', 'helix_effective_throughput',
                'pick_retry_reduction', 'humanoid_failure_recovery_time', 'bmw_deployment_uptime'
            ] }
        ];

        // For each category, compute axis score = mean of best-of-fleet across the axis benches.
        var radarData = [];
        this.CATEGORIES.forEach(function(cat, idx) {
            var values = AXES.map(function(axis) {
                var benchBests = axis.benches.map(function(bid) {
                    var best = null;
                    cat.models.forEach(function(mid) {
                        var v = self._getScore(mid, bid);
                        if (v != null && (best == null || v > best)) best = v;
                    });
                    return best;
                }).filter(function(v) { return v != null; });
                if (benchBests.length === 0) return 0;
                return benchBests.reduce(function(a, b) { return a + b; }, 0) / benchBests.length;
            });
            // Skip categories with all-zero values
            if (values.every(function(v) { return v === 0; })) return;
            radarData.push({
                value: values,
                name: cat.icon + ' ' + cat.label,
                idx: idx
            });
        });

        if (radarData.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— Capability radar에 표시할 데이터가 부족합니다';
            el.appendChild(empty);
            return;
        }

        // Per-axis max for normalization (don't squash high-variance axes)
        var axisMax = AXES.map(function(_, ai) {
            return Math.max(100, Math.max.apply(null, radarData.map(function(d) { return d.value[ai]; })));
        });
        var indicators = AXES.map(function(axis, ai) {
            return { name: axis.name, max: axisMax[ai] };
        });

        var palette = [Theme.series[0], Theme.series[1], Theme.series[4], Theme.series[5]];
        var chart = echarts.init(el);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(p) {
                    var lines = [p.name];
                    p.value.forEach(function(v, i) {
                        lines.push(indicators[i].name + ': ' + (typeof v === 'number' ? v.toFixed(1) : v));
                    });
                    return lines.join('<br/>');
                }
            },
            legend: {
                data: radarData.map(function(d) { return d.name; }),
                textStyle: { color: Theme.textMuted, fontSize: 10 }, top: 0, type: 'scroll'
            },
            radar: {
                indicator: indicators, shape: 'polygon',
                axisName: { color: Theme.textMuted, fontSize: 11 },
                splitLine: { lineStyle: { color: Theme.border } },
                splitArea: { areaStyle: { color: ['transparent'] } },
                axisLine: { lineStyle: { color: Theme.border } }
            },
            series: [{
                type: 'radar',
                data: radarData.map(function(d) {
                    return {
                        value: d.value, name: d.name,
                        itemStyle: { color: palette[d.idx % palette.length] },
                        lineStyle: { color: palette[d.idx % palette.length], width: 2 },
                        areaStyle: { opacity: 0.1 }
                    };
                })
            }]
        });
        window.addEventListener('resize', function() { chart.resize(); });
    }
};
