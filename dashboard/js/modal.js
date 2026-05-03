/**
 * Modal dialogs for benchmark detail and model detail views.
 * Uses safe DOM methods (createElement + textContent) for all dynamic content.
 */
var Modal = {
    _bmtData: null,

    // Built-in benchmark metadata for benchmarks not in BMT
    _builtinMeta: {
        gpqa_diamond: { desc: 'Graduate-level science questions designed to be Google-proof. 198 expert-crafted questions across physics, chemistry, and biology.', paper: 'https://arxiv.org/abs/2311.12022', github: 'https://github.com/idavidrein/gpqa', year: '2023', items: '198 questions' },
        swe_bench_verified: { desc: 'Real GitHub issues resolved by AI agents. 2,294 human-verified tasks from popular Python repositories.', paper: 'https://arxiv.org/abs/2310.06770', github: 'https://github.com/princeton-nlp/SWE-bench', year: '2023', items: '2,294 tasks' },
        swe_bench_pro: { desc: 'Advanced SWE-bench requiring extended multi-step reasoning. Models scoring 80%+ on Verified reach only 46-58% on Pro.', paper: 'https://arxiv.org/abs/2310.06770', github: 'https://github.com/princeton-nlp/SWE-bench', year: '2024', items: 'Subset of SWE-bench' },
        swe_bench_multilingual: { desc: 'Cross-language software engineering tasks spanning Python, Java, JavaScript, TypeScript, and more.', paper: 'https://arxiv.org/abs/2310.06770', github: 'https://github.com/princeton-nlp/SWE-bench', year: '2024' },
        swe_rebench: { desc: 'Stricter re-evaluation of SWE-bench with improved verification to reduce false positives.', paper: 'https://swe-rebench.com', github: 'https://github.com/swe-rebench', year: '2026' },
        terminal_bench_2: { desc: '89 Docker container tasks across SWE, biology, security, and gaming. Measures autonomous terminal agent capability.', paper: 'https://www.tbench.ai', github: 'https://github.com/laude-institute/terminal-bench', year: '2025', items: '89 tasks' },
        hle: { desc: "Humanity's Last Exam — 2,500 expert-crafted questions at the frontier of human knowledge across math, science, and humanities.", paper: 'https://arxiv.org/abs/2501.14249', github: 'https://github.com/centerforaisafety/hle', year: '2025', items: '2,500 questions' },
        arc_agi_2: { desc: 'Visual reasoning puzzles testing fluid intelligence and generalization. Measures abstract pattern recognition beyond training data.', paper: 'https://arcprize.org/arc-agi/2', github: 'https://github.com/fchollet/ARC-AGI', year: '2024' },
        aime_2025: { desc: 'American Invitational Mathematics Examination 2025. 30 problems testing advanced high school mathematics.', paper: 'https://arxiv.org/abs/2503.04235', github: 'https://matharena.ai', year: '2025', items: '30 problems' },
        hmmt_2025: { desc: 'Harvard-MIT Mathematics Tournament 2025. Collegiate-level competition math problems.', paper: 'https://matharena.ai', year: '2025' },
        imo_answerbench: { desc: 'International Mathematical Olympiad answer-format problems for automated evaluation.', paper: 'https://matharena.ai', year: '2025' },
        cybench: { desc: '40 professional-level CTF challenges from HackTheBox, SekaiCTF, and more. Spans crypto, web, reversing, forensics, exploitation.', paper: 'https://arxiv.org/abs/2408.08926', github: 'https://github.com/stanford-crfm/cybench', year: '2024', items: '40 challenges' },
        cvebench: { desc: '40 critical-severity CVE-based real-world web application vulnerability exploitation benchmark.', paper: 'https://arxiv.org/abs/2503.17332', github: 'https://github.com/uiuc-kang-lab/cve-bench', year: '2025', items: '40 CVEs' },
        cybergym: { desc: '1,507 real-world vulnerability instances from 188 open-source projects. Tests exploit PoC generation and zero-day discovery.', paper: 'https://arxiv.org/abs/2506.02548', github: 'https://github.com/sunblaze-ucb/cybergym', year: '2025', items: '1,507 instances' },
        evmbench_exploit: { desc: 'Smart contract exploit generation — craft transactions that drain funds from vulnerable Ethereum contracts.', paper: 'https://openai.com/index/introducing-evmbench/', github: 'https://github.com/openai/evmbench', year: '2026', items: '120 vulnerabilities' },
        evmbench_detect: { desc: 'Smart contract security audit — detect high-severity vulnerabilities in Ethereum contract code.', paper: 'https://openai.com/index/introducing-evmbench/', github: 'https://github.com/openai/evmbench', year: '2026', items: '120 vulnerabilities' },
        evmbench_patch: { desc: 'Smart contract vulnerability patching — fix security flaws while preserving contract functionality.', paper: 'https://openai.com/index/introducing-evmbench/', github: 'https://github.com/openai/evmbench', year: '2026', items: '120 vulnerabilities' },
        airtbench: { desc: '70 AI/ML CTF challenges testing autonomous red teaming of AI systems. Black-box exploitation tasks.', paper: 'https://arxiv.org/abs/2506.14682', github: 'https://github.com/dreadnode/AIRTBench-Code', year: '2025', items: '70 challenges' },
        firefox_147: { desc: 'Browser JS shell exploitation from crash inputs. Measures code execution success rate on real Firefox vulnerabilities.', paper: 'https://www.anthropic.com/research', year: '2026' },
        cyber_range: { desc: '15 network attack scenarios including C2, SSRF, binary exploitation, EDR evasion, and privilege escalation.', paper: 'https://openai.com/index/introducing-gpt-5-4/', year: '2026', items: '15 scenarios' },
        autopatchbench: { desc: '136 real-world C/C++ vulnerabilities for automated patching. Verified through fuzzing and differential testing.', paper: 'https://ai.meta.com/research/publications/cyberseceval-4/', github: 'https://github.com/facebookresearch/CyberSecEval', year: '2025', items: '136 samples' },
        cybersoceval: { desc: 'SOC malware analysis and threat intelligence reasoning. Meta + CrowdStrike joint benchmark.', paper: 'https://arxiv.org/abs/2509.20166', github: 'https://github.com/CrowdStrike/CyberSOCEval_data', year: '2025' },
        zerodaybench: { desc: 'Unseen zero-day vulnerability detection and remediation across multiple information levels.', paper: 'https://arxiv.org/abs/2603.02297', year: '2026' },
        dfir_metric: { desc: 'Digital forensics and incident response — MCQ knowledge + CTF forensics skills.', paper: 'https://arxiv.org/abs/2501.16466', year: '2025', items: '713 MCQs + 150 CTF challenges' },
        browsecomp: { desc: '1,266 hard-to-find web information retrieval tasks requiring persistent navigation and synthesis.', paper: 'https://openai.com/index/browsecomp/', github: 'https://github.com/openai/browsecomp', year: '2025', items: '1,266 questions' },
        osworld_verified: { desc: 'Real computer environment (Ubuntu) open-ended tasks. Tests GUI/CLI operation by multimodal agents.', paper: 'https://arxiv.org/abs/2404.07972', github: 'https://github.com/xlang-ai/OSWorld', year: '2024' },
        tau_bench: { desc: 'Tool-Agent-User interaction across airline, retail, and telecom domains.', paper: 'https://arxiv.org/abs/2406.12045', github: 'https://github.com/sierra-research/tau-bench', year: '2024' },
        tau2_bench: { desc: 'Tool-Agent-User interaction v2 with improved evaluation across multiple service domains.', paper: 'https://arxiv.org/abs/2506.07982', github: 'https://github.com/sierra-research/tau2-bench', year: '2025' },
        mcp_atlas: { desc: '1,000 tasks across 36 real MCP servers and 220 tools for multi-step tool-use competency evaluation.', year: '2026', items: '1,000 tasks' },
        deepsearchqa: { desc: 'Multi-step web research requiring deep browsing and information synthesis. F1 score metric.', year: '2026' },
        vending_bench_2: { desc: 'Long-horizon agentic task simulating running a vending machine business over a year. Scored by final bank balance.', year: '2025' },
        metr_time_horizons: { desc: 'Human task duration at which AI agents reach 50% autonomous success. Doubling every ~4 months.', paper: 'https://metr.org/time-horizons/', year: '2025' },
        webarena: { desc: 'Web-based task automation across realistic web applications (CMS, ecommerce, forums).', paper: 'https://arxiv.org/abs/2307.13854', github: 'https://github.com/web-arena-x/webarena', year: '2023' },
        mmmu_pro: { desc: 'Multimodal understanding and reasoning with college-level subject knowledge across 30 subjects.', paper: 'https://arxiv.org/abs/2401.11943', github: 'https://github.com/MMMU-Benchmark', year: '2024' },
        mathvision: { desc: 'Visual math problem solving requiring both mathematical reasoning and visual understanding.', paper: 'https://arxiv.org/abs/2402.14804', year: '2024' },
        video_mmmu: { desc: 'Knowledge acquisition from videos — tests understanding of educational and scientific video content.', paper: 'https://arxiv.org/abs/2501.13826', year: '2025' },
        longvideobench: { desc: 'Long video understanding benchmark testing comprehension over extended video sequences.', paper: 'https://arxiv.org/abs/2407.15754', year: '2024' },
        screenspot_pro: { desc: 'Screen understanding for GUI agents — identifies UI elements and their functions from screenshots.', year: '2025' },
        charxiv_reasoning: { desc: 'Information synthesis from complex academic charts and figures. Tests chart reasoning ability.', paper: 'https://arxiv.org/abs/2406.18521', github: 'https://github.com/princeton-nlp/CharXiv', year: '2024' },
        omnidocbench: { desc: 'OCR and document understanding benchmark. Edit Distance metric (lower is better for original, higher for normalized).', year: '2025' },
        mmmlu: { desc: 'Multilingual MMLU — massive multitask evaluation across 57 subjects in 14+ languages.', paper: 'https://arxiv.org/abs/2009.03300', year: '2024' },
        mmlu_pro: { desc: 'MMLU-Pro — harder version of MMLU with 10 answer choices and more reasoning-focused questions.', paper: 'https://arxiv.org/abs/2406.01574', github: 'https://github.com/TIGER-Lab/MMLU-Pro', year: '2024' },
        global_piqa: { desc: 'Commonsense reasoning across 100 languages and cultures.', year: '2025' },
        simpleqa_verified: { desc: 'Parametric knowledge verification — tests factual recall accuracy on verifiable questions.', year: '2025' },
        facts_benchmark: { desc: 'Factual grounding, search, and retrieval benchmark suite.', year: '2025' },
        longbench_v2: { desc: 'Long-context understanding benchmark testing reasoning over extended text passages.', paper: 'https://arxiv.org/abs/2412.15204', year: '2024' },
        gdpval_aa: { desc: 'Real-world code generation quality evaluation using ELO-based pairwise comparison.', year: '2025' },
        livecodebench: { desc: 'Contamination-free coding benchmark with monthly refreshed competitive programming problems.', paper: 'https://arxiv.org/abs/2403.07974', github: 'https://github.com/LiveCodeBench/LiveCodeBench', year: '2024' },
        scicode: { desc: 'Scientific coding tasks requiring domain knowledge in physics, chemistry, and biology.', paper: 'https://arxiv.org/abs/2407.13168', github: 'https://github.com/scicode-bench/SciCode', year: '2024' },
        paperbench: { desc: 'Reproduce ML paper results from code — tests ability to implement methodology from academic papers.', year: '2025' },
        mle_bench: { desc: 'ML Engineering benchmark — solve Kaggle-style ML competitions to bronze medal threshold.', paper: 'https://arxiv.org/abs/2410.07095', github: 'https://github.com/openai/mle-bench', year: '2024' },
        monorepo_bench: { desc: 'Large codebase navigation and modification tasks in monorepo environments.', year: '2026' },
        cyscenariobench: { desc: 'Multi-step cyber attack scenario challenges requiring strategic planning and execution.', year: '2026' },
        baxbench: { desc: '392 security-critical backend coding tasks across 14 frameworks and 6 languages.', paper: 'https://baxbench.com/paper.pdf', github: 'https://github.com/logic-star-ai/baxbench', year: '2025', items: '392 tasks' },
        matharena_apex: { desc: 'Most challenging math contest problems — frontier difficulty beyond AIME level.', paper: 'https://matharena.ai', year: '2025' },
        tau3_bench: { desc: 'Next-generation agent tool-use benchmark with knowledge retrieval and voice beyond TAU2.', paper: 'https://sierra.ai/blog/bench-advancing-agent-benchmarking-to-knowledge-and-voice', year: '2026' },
        apex_agents: { desc: 'AI Productivity Index — 480 long-horizon cross-application professional tasks from banking, consulting, and law.', paper: 'https://arxiv.org/abs/2601.14242', github: 'https://www.mercor.com/apex/', year: '2026', items: '480 tasks' },
        frontiermath: { desc: 'Research-level mathematics problems at the frontier of human mathematical knowledge. Problems that took expert mathematicians hours to days.', paper: 'https://arxiv.org/abs/2411.04872', year: '2024' },
        livecodebench_elo: { desc: 'LiveCodeBench Elo rating from competitive programming (Codeforces/ICPC/IOI style).', paper: 'https://arxiv.org/abs/2403.07974', github: 'https://github.com/LiveCodeBench/LiveCodeBench', year: '2024' },
        livecodebench_v6: { desc: 'LiveCodeBench version 6 — latest contamination-free competitive coding problems.', paper: 'https://arxiv.org/abs/2403.07974', year: '2025' },
        fortress: { desc: 'FORTRESS — 1,010 expert-crafted adversarial prompts for CBRNE, terrorism, criminal eval. Attack Success Rate metric (lower=safer). Scale AI.', paper: 'https://arxiv.org/abs/2506.14922', github: 'https://labs.scale.com/leaderboard/fortress', year: '2025', items: '1,010 prompts' },
        replibench: { desc: 'RepliBench — 86 tasks measuring autonomous self-replication capabilities across 4 domains: obtain resources, exfiltrate weights, replicate, persist. UK AISI.', paper: 'https://arxiv.org/abs/2504.18565', year: '2025', items: '86 tasks' },
        tlo_cyber_range: { desc: 'The Last Ones (TLO) — 32-step corporate network attack simulation from reconnaissance to full takeover. Estimated 20 human-hours. UK AISI.', paper: 'https://www.aisi.gov.uk/blog/how-do-frontier-ai-agents-perform-in-multi-step-cyber-attack-scenarios', year: '2026', items: '32 steps' },
        vibe_code_bench: { desc: 'Vibe Code Bench — 100 web application specifications evaluated through 964 browser-based workflows. End-to-end functional app development.', paper: 'https://arxiv.org/abs/2603.04601', year: '2026', items: '100 specs' },
        abc_bench: { desc: 'ABC-Bench — 224 agentic backend coding tasks. Requires full dev lifecycle: repo exploration, containerized deployment, API tests.', paper: 'https://arxiv.org/abs/2601.11077', github: 'https://github.com/OpenMOSS/ABC-Bench', year: '2026', items: '224 tasks' },
        mhbench: { desc: 'MHBench — 40 emulated multi-host network environments for autonomous red teaming. Tests multi-stage attacks: reconnaissance, lateral movement, privilege escalation.', paper: 'https://arxiv.org/abs/2501.16466', year: '2025', items: '40 networks' },
        cyberexplorer: { desc: 'CyberExplorer — 40 vulnerable web services in VM. Autonomous exploitation without prior knowledge. Reactive multi-agent framework.', paper: 'https://arxiv.org/abs/2602.08023', year: '2026', items: '40 services' },
        vibe_coding_safety: { desc: 'Vibe Coding Safety — measures security of AI-generated code in real-world tasks. Only 8.25% of outputs are both functionally correct AND secure.', paper: 'https://arxiv.org/abs/2512.03262', year: '2025' },
        ailuminate: { desc: 'AILuminate v1.0 — MLCommons industry-standard AI safety benchmark. 12 hazard categories, 24,000+ prompts, 5-point grading scale (Poor to Excellent).', paper: 'https://arxiv.org/abs/2503.05731', github: 'https://ailuminate.mlcommons.org/benchmarks/', year: '2025', items: '24,000+ prompts' },
        arc_agi_1: { desc: 'ARC-AGI-1 — Original abstract reasoning benchmark testing fluid intelligence and generalization.', paper: 'https://arcprize.org/arc-agi', github: 'https://github.com/fchollet/ARC-AGI', year: '2024' },
        bfcl_v4: { desc: 'Berkeley Function Calling Leaderboard V4 — tool-use accuracy across Python/Java/JS/REST API with agentic web search evaluation.', paper: 'https://arxiv.org/abs/2402.15491', github: 'https://gorilla.cs.berkeley.edu/leaderboard.html', year: '2024' },
        aider_polyglot: { desc: '225 Exercism problems across C++, Go, Java, JS, Python, Rust. Tests coding ability with error correction (2 attempts per problem).', paper: 'https://aider.chat/docs/leaderboards/', year: '2024', items: '225 problems' },
        webvoyager: { desc: 'Web navigation benchmark for autonomous browsing agents across real websites.', paper: 'https://arxiv.org/abs/2401.13919', year: '2024' },
        ifbench: { desc: 'IFBench — 58 verifiable out-of-domain instruction following constraints. Tests generalization of instruction following beyond training.', paper: 'https://arxiv.org/abs/2507.02833', github: 'https://github.com/allenai/IFBench', year: '2025', items: '58 constraints' },
        arena_hard_v2: { desc: 'Arena Hard v2 — 500 curated prompts from Chatbot Arena and WildChat-1M. Automated LLM benchmark by LMSYS.', paper: 'https://arxiv.org/abs/2406.11939', github: 'https://github.com/lmarena/arena-hard-auto', year: '2024', items: '500 prompts' },
        hmmt_2026: { desc: 'HMMT February 2026 — latest Harvard-MIT Mathematics Tournament problems.', paper: 'https://matharena.ai', year: '2026' },
        aime_2026: { desc: 'AIME 2026 — American Invitational Mathematics Examination 2026 problems.', paper: 'https://matharena.ai', year: '2026' }
    },

    _lastTrigger: null,

    // Filename (as stored in score.source.url) → public canonical URL.
    // When a score's source is a local PDF, we can't link to the PDF on
    // GitHub Pages (they are not deployed), but we can point users at the
    // vendor's canonical page for the same document.
    _pdfPublicUrl: {
        'Claude Opus 4.7 System Card.pdf': 'https://www.anthropic.com/research',
        'Claude Opus 4.6 System Card 02-05.pdf': 'https://www.anthropic.com/research',
        'Claude Mythos Preview System Card.pdf': 'https://www.anthropic.com/research',
        'gpt-5-4-thinking.pdf': 'https://openai.com/index/introducing-gpt-5-4/',
        'GPT-5-3-Codex-System-Card-02.pdf': 'https://openai.com/index/introducing-gpt-5-3-codex/',
        'Gemini-3-Pro-Model-Card.pdf': 'https://deepmind.google/models/gemini-3-pro/',
        '2602.02276v1.pdf': 'https://arxiv.org/abs/2602.02276',
        '2604.03121v1.pdf': 'https://arxiv.org/abs/2604.03121',
        '2602.15763v2.pdf': 'https://arxiv.org/abs/2602.15763',
        '2602.04705v1.pdf': 'https://arxiv.org/abs/2602.04705',
        '2604.08644v1.pdf': 'https://arxiv.org/abs/2604.08644',
        '2601.07022v1.pdf': 'https://arxiv.org/abs/2601.07022',
        '2601.09200v5.pdf': 'https://arxiv.org/abs/2601.09200',
        '2603.18788v2.pdf': 'https://arxiv.org/abs/2603.18788',
        '2604.07035v1.pdf': 'https://arxiv.org/abs/2604.07035'
    },
    _sourceLink: function(source) {
        if (!source) return null;
        var url = source.url || '';
        if (/^https?:\/\//.test(url)) return url;
        // Local PDF path — strip 'resource/' prefix and look up public URL
        var basename = url.split('/').pop();
        return Modal._pdfPublicUrl[basename] || null;
    },

    // Cache for per-date history snapshots. Key: 'YYYY-MM-DD' → array of scores.
    _historySnapshots: {},
    _historyIndex: null,
    _historyDataBase: null,

    init: function() {
        var base = window.location.pathname.indexOf('/dashboard/') !== -1 ? '../data' : 'data';
        Modal._historyDataBase = base;
        fetch(base + '/bmt_connections.json').then(function(r) {
            return r.ok ? r.json() : {};
        }).then(function(d) {
            Modal._bmtData = d;
            // Re-render visible tables that surface BMT badges, since the
            // initial render likely happened before this fetch resolved.
            try {
                if (typeof App !== 'undefined') {
                    if (App.renderLeaderboard) App.renderLeaderboard();
                    if (App._renderSOTATable) App._renderSOTATable();
                }
            } catch (e) { /* non-fatal */ }
        }).catch(function() { Modal._bmtData = {}; });

        // Preload the history index (list of snapshot dates). Each date's
        // full snapshot is lazy-loaded on demand inside showScoreSource.
        fetch(base + '/scores/history/index.json').then(function(r) {
            return r.ok ? r.json() : { dates: [] };
        }).then(function(d) {
            Modal._historyIndex = (d && d.dates) || [];
        }).catch(function() { Modal._historyIndex = []; });

        var overlay = document.getElementById('modal-overlay');
        var close = document.getElementById('modal-close');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) Modal.close();
            });
        }
        if (close) {
            close.addEventListener('click', function() { Modal.close(); });
        }
        document.addEventListener('keydown', function(e) {
            if (e.key !== 'Escape') return;
            if (overlay && !overlay.classList.contains('hidden')) Modal.close();
        });
    },

    /**
     * Load all history snapshots and return their (date, scoreRow) pairs
     * for the given (modelId, benchmarkId). Cached across calls.
     * Returns a Promise resolving to [{date, score}, ...] in date order.
     */
    _loadScoreHistory: function(modelId, benchmarkId) {
        var dates = Modal._historyIndex || [];
        if (!dates.length) return Promise.resolve([]);
        var base = Modal._historyDataBase;
        var fetches = dates.map(function(d) {
            if (Modal._historySnapshots[d]) return Promise.resolve(Modal._historySnapshots[d]);
            return fetch(base + '/scores/history/' + d + '.json').then(function(r) {
                return r.ok ? r.json() : [];
            }).then(function(arr) {
                Modal._historySnapshots[d] = arr;
                return arr;
            }).catch(function() { return []; });
        });
        return Promise.all(fetches).then(function(snapshots) {
            var rows = [];
            snapshots.forEach(function(snap, i) {
                var hit = snap.find(function(s) {
                    return s.model_id === modelId && s.benchmark_id === benchmarkId;
                });
                if (hit) rows.push({ date: dates[i], score: hit });
            });
            return rows;
        });
    },

    _open: function(trigger) {
        Modal._lastTrigger = trigger || document.activeElement;
        var overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('hidden');
        var closeBtn = document.getElementById('modal-close');
        if (closeBtn) closeBtn.focus();
    },

    close: function() {
        var overlay = document.getElementById('modal-overlay');
        if (overlay) overlay.classList.add('hidden');
        var a = document.querySelector('.tab-btn.active');
        if (a) history.replaceState(null, '', '#' + a.dataset.tab);
        if (Modal._lastTrigger && typeof Modal._lastTrigger.focus === 'function') {
            try { Modal._lastTrigger.focus(); } catch (e) { /* detached node */ }
        }
        Modal._lastTrigger = null;
    },

    _makeLabel: function(labelText, valueText) {
        var div = document.createElement('div');
        div.className = 'text-sm';
        var lbl = document.createElement('span');
        lbl.className = 'text-gray-500';
        lbl.textContent = labelText + ': ';
        div.appendChild(lbl);
        var val = document.createElement('span');
        val.className = 'text-gray-200';
        val.textContent = valueText;
        div.appendChild(val);
        return div;
    },

    showBenchmark: function(benchId) {
        var bench = App.data.benchmarks.find(function(b) { return b.id === benchId; });
        if (!bench) return;
        history.replaceState(null, '', '#bench/' + benchId);

        var bmt = (this._bmtData || {})[benchId] || (this._bmtData || {})[benchId.replace(/_/g, '')] || {};
        var builtin = this._builtinMeta[benchId] || {};

        // Merge: BMT takes priority, then builtin
        if (!bmt.paper_link && builtin.paper) bmt.paper_link = builtin.paper;
        if (!bmt.github_link && builtin.github) bmt.github_link = builtin.github;
        if (!bmt.description && builtin.desc) bmt.description = builtin.desc;
        if (!bmt.year && builtin.year) bmt.year = builtin.year;
        if (!bmt.item_count && builtin.items) bmt.item_count = builtin.items;
        // Use builtin desc as benchmark description if bench.description is empty
        if (!bench.description && builtin.desc) bench = { id: bench.id, name: bench.name, category: bench.category, description: builtin.desc };

        var scores = App.data.scores.filter(function(s) { return s.benchmark_id === benchId; });
        scores.sort(function(a, b) { return b.value - a.value; });

        var container = document.getElementById('modal-content');
        container.textContent = '';

        // Title
        var h2 = document.createElement('h2');
        h2.id = 'modal-title';
        h2.className = 'text-xl font-bold text-white mb-1';
        h2.textContent = bench.name;
        container.appendChild(h2);

        // Category badge
        var catBadge = document.createElement('span');
        catBadge.className = 'inline-block px-2 py-0.5 rounded text-xs bg-blue-900 text-blue-300 mb-3';
        catBadge.textContent = bench.category;
        container.appendChild(catBadge);

        // Description
        if (bench.description) {
            var desc = document.createElement('p');
            desc.className = 'text-gray-400 text-sm mb-4';
            desc.textContent = bench.description;
            container.appendChild(desc);
        }

        // BMT metadata + builtin metadata
        if (bmt.bmt_title || bmt.paper_link || bmt.github_link || bmt.description || bmt.year || (bmt.authors && bmt.authors.length) || bmt.specs || bmt.source) {
            var metaDiv = document.createElement('div');
            metaDiv.className = 'bg-gray-800 rounded-lg p-4 mb-4 space-y-2';

            // Header row: BMT title + (publisher source) badge
            if (bmt.bmt_title || bmt.source) {
                var headerRow = document.createElement('div');
                headerRow.className = 'flex items-baseline gap-2 flex-wrap';
                if (bmt.bmt_title) {
                    var titleLabel = document.createElement('span');
                    titleLabel.className = 'text-xs text-gray-500';
                    titleLabel.textContent = 'BMT Dataset';
                    headerRow.appendChild(titleLabel);
                    var titleVal = document.createElement('span');
                    titleVal.className = 'text-sm font-semibold text-gray-200';
                    titleVal.textContent = bmt.bmt_title;
                    headerRow.appendChild(titleVal);
                }
                if (bmt.source) {
                    var srcBadge = document.createElement('span');
                    srcBadge.className = 'inline-block px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300';
                    srcBadge.textContent = bmt.source;
                    headerRow.appendChild(srcBadge);
                }
                metaDiv.appendChild(headerRow);
            }

            if (bmt.year) metaDiv.appendChild(this._makeLabel('Year', bmt.year));
            if (bmt.item_count) metaDiv.appendChild(this._makeLabel('Items', bmt.item_count));
            if (bmt.specs) metaDiv.appendChild(this._makeLabel('Specs', bmt.specs));

            // Authors (truncate to first 3 + "et al.")
            if (bmt.authors && bmt.authors.length) {
                var authStr;
                if (bmt.authors.length > 4) {
                    authStr = bmt.authors.slice(0, 3).join(', ') + ', et al. (' + bmt.authors.length + ' authors)';
                } else {
                    authStr = bmt.authors.join(', ');
                }
                metaDiv.appendChild(this._makeLabel('Authors', authStr));
            }

            if (bmt.description) {
                var bmtDesc = document.createElement('div');
                bmtDesc.className = 'text-sm text-gray-400 mt-2 leading-relaxed';
                bmtDesc.textContent = bmt.description;
                metaDiv.appendChild(bmtDesc);
            }

            var linksDiv = document.createElement('div');
            linksDiv.className = 'flex gap-3 mt-3 flex-wrap';
            if (bmt.paper_link) {
                var paperLink = document.createElement('a');
                paperLink.href = bmt.paper_link;
                paperLink.target = '_blank';
                paperLink.rel = 'noopener noreferrer';
                paperLink.className = 'inline-flex items-center gap-1 px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-200 text-xs rounded transition';
                paperLink.textContent = '📄 Paper';
                linksDiv.appendChild(paperLink);
            }
            if (bmt.github_link) {
                var ghLink = document.createElement('a');
                ghLink.href = bmt.github_link;
                ghLink.target = '_blank';
                ghLink.rel = 'noopener noreferrer';
                ghLink.className = 'inline-flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs rounded transition';
                ghLink.textContent = '⚙ GitHub';
                linksDiv.appendChild(ghLink);
            }
            // BMT registry deep-link if we have a bmt_id
            if (bmt.bmt_id) {
                var bmtLink = document.createElement('a');
                bmtLink.href = 'https://benchmark-mt.com/dataset/' + encodeURIComponent(bmt.bmt_id);
                bmtLink.target = '_blank';
                bmtLink.rel = 'noopener noreferrer';
                bmtLink.className = 'inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs rounded transition';
                bmtLink.textContent = '🗂 BMT Registry';
                linksDiv.appendChild(bmtLink);
            }
            if (linksDiv.children.length) metaDiv.appendChild(linksDiv);
            container.appendChild(metaDiv);
        }

        // Scores table
        var h3 = document.createElement('h3');
        h3.className = 'text-sm font-semibold text-gray-300 mb-2';
        h3.textContent = 'Model Rankings (' + scores.length + ' models)';
        container.appendChild(h3);

        var table = document.createElement('table');
        table.className = 'w-full text-sm';
        var thead = document.createElement('thead');
        var hr = document.createElement('tr');
        ['#', 'Model', 'Score', 'Source'].forEach(function(t) {
            var th = document.createElement('th');
            th.className = 'text-left text-gray-500 pb-2 pr-3 text-xs';
            th.textContent = t;
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        scores.forEach(function(s, i) {
            var model = App.data.models.find(function(m) { return m.id === s.model_id; });
            var tr = document.createElement('tr');
            tr.className = 'border-t border-gray-800';

            var tdRank = document.createElement('td');
            tdRank.className = 'py-1.5 pr-3 text-gray-500';
            tdRank.textContent = i + 1;
            tr.appendChild(tdRank);

            var tdModel = document.createElement('td');
            tdModel.className = 'py-1.5 pr-3 text-gray-200';
            var modelSpan = document.createElement('span');
            modelSpan.className = 'cursor-pointer hover:text-blue-400 transition';
            modelSpan.textContent = model ? model.name : s.model_id.split('/').pop();
            modelSpan.onclick = (function(mid) { return function(e) { e.stopPropagation(); Modal.showModel(mid); }; })(s.model_id);
            tdModel.appendChild(modelSpan);
            if (i === 0 && s.is_sota) {
                var sota = document.createElement('span');
                sota.className = 'ml-2 px-1.5 py-0.5 bg-green-900 text-green-300 text-xs rounded';
                sota.textContent = 'SOTA';
                tdModel.appendChild(sota);
            }
            tr.appendChild(tdModel);

            var tdScore = document.createElement('td');
            tdScore.className = 'py-1.5 pr-3 font-mono';
            if (i === 0) tdScore.className += ' text-green-400 font-bold';
            else if (i < 3) tdScore.className += ' text-blue-400';
            else tdScore.className += ' text-gray-300';
            tdScore.textContent = s.value > 500 ? Math.round(s.value) : s.value;
            tr.appendChild(tdScore);

            var tdSrc = document.createElement('td');
            tdSrc.className = 'py-1.5 text-xs';
            var srcType = (s.source && s.source.type) || 'web';
            var publicUrl = Modal._sourceLink(s.source);
            if (publicUrl) {
                var a = document.createElement('a');
                a.href = publicUrl;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = (srcType === 'pdf' ? 'text-purple-400' : 'text-blue-400') + ' hover:underline';
                a.textContent = srcType + ' \u2197';
                a.title = publicUrl;
                tdSrc.appendChild(a);
            } else {
                tdSrc.className += srcType === 'pdf' ? ' text-purple-400' : ' text-gray-500';
                tdSrc.textContent = srcType;
            }
            tr.appendChild(tdSrc);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);

        Modal._open();
    },

    /**
     * Show a focused detail modal for a single (model, benchmark) score cell.
     * Displays source URL (public-canonical where possible), collection date,
     * notes, and cross-links to the full benchmark / model views.
     */
    showScoreSource: function(modelId, benchmarkId) {
        var score = App.data.scores.find(function(s) {
            return s.model_id === modelId && s.benchmark_id === benchmarkId;
        });
        if (!score) return;
        var model = App.data.models.find(function(m) { return m.id === modelId; });
        var bench = App.data.benchmarks.find(function(b) { return b.id === benchmarkId; });
        if (!bench) return;

        history.replaceState(null, '', '#score/' + modelId + '/' + benchmarkId);

        var container = document.getElementById('modal-content');
        container.textContent = '';

        // Title: "Kimi K2.6 — SWE-bench Verified"
        var h2 = document.createElement('h2');
        h2.id = 'modal-title';
        h2.className = 'text-xl font-bold text-white mb-1';
        h2.textContent = (model ? model.name : modelId.split('/').pop()) + ' — ' + bench.name;
        container.appendChild(h2);

        // Category + SOTA badges
        var badges = document.createElement('div');
        badges.className = 'flex gap-2 mb-4';
        var catBadge = document.createElement('span');
        catBadge.className = 'inline-block px-2 py-0.5 rounded text-xs bg-blue-900 text-blue-300';
        catBadge.textContent = bench.category;
        badges.appendChild(catBadge);
        if (score.is_sota) {
            var sotaBadge = document.createElement('span');
            sotaBadge.className = 'inline-block px-2 py-0.5 rounded text-xs bg-green-900 text-green-300 font-semibold';
            sotaBadge.textContent = 'SOTA';
            badges.appendChild(sotaBadge);
        }
        container.appendChild(badges);

        // Big score display
        var scoreBlock = document.createElement('div');
        scoreBlock.className = 'bg-gray-800 rounded-lg p-5 mb-4 flex items-baseline gap-3';
        var valueSpan = document.createElement('span');
        valueSpan.className = 'text-4xl font-bold ' + (score.is_sota ? 'text-green-400' : 'text-blue-300');
        valueSpan.textContent = score.value > 500 ? Math.round(score.value) : score.value;
        scoreBlock.appendChild(valueSpan);
        var unitSpan = document.createElement('span');
        unitSpan.className = 'text-gray-400 text-lg';
        unitSpan.textContent = score.unit || '';
        scoreBlock.appendChild(unitSpan);
        container.appendChild(scoreBlock);

        // Provenance block: source URL, type, dates, notes
        var meta = document.createElement('div');
        meta.className = 'bg-gray-800 rounded-lg p-4 mb-4 space-y-2';
        var metaHeader = document.createElement('h3');
        metaHeader.className = 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2';
        metaHeader.textContent = '검증 소스';
        meta.appendChild(metaHeader);

        var srcType = (score.source && score.source.type) || 'web';
        meta.appendChild(this._makeLabel('Source type', srcType));

        var publicUrl = Modal._sourceLink(score.source);
        var rawUrl = (score.source && score.source.url) || '';
        if (publicUrl) {
            var linkRow = document.createElement('div');
            linkRow.className = 'text-sm';
            var lbl = document.createElement('span');
            lbl.className = 'text-gray-500';
            lbl.textContent = 'Source URL: ';
            linkRow.appendChild(lbl);
            var a = document.createElement('a');
            a.href = publicUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = (srcType === 'pdf' ? 'text-purple-400' : 'text-blue-400') + ' hover:underline break-all';
            a.textContent = publicUrl;
            linkRow.appendChild(a);
            meta.appendChild(linkRow);
        } else if (rawUrl) {
            meta.appendChild(this._makeLabel('Source path', rawUrl));
        }

        if (score.source && score.source.date) {
            meta.appendChild(this._makeLabel('Source date', score.source.date));
        }
        if (score.collected_at && score.collected_at !== (score.source && score.source.date)) {
            meta.appendChild(this._makeLabel('수집일 (collected_at)', score.collected_at));
        } else if (score.collected_at) {
            meta.appendChild(this._makeLabel('수집일', score.collected_at));
        }
        if (score.source && score.source.citation) {
            meta.appendChild(this._makeLabel('Citation', score.source.citation));
        }
        if (score.notes) {
            var noteBox = document.createElement('div');
            noteBox.className = 'text-sm mt-3 pt-3 border-t border-gray-700';
            var noteLbl = document.createElement('div');
            noteLbl.className = 'text-gray-500 mb-1';
            noteLbl.textContent = 'Notes';
            noteBox.appendChild(noteLbl);
            var noteTxt = document.createElement('div');
            noteTxt.className = 'text-gray-200';
            noteTxt.textContent = score.notes;
            noteBox.appendChild(noteTxt);
            meta.appendChild(noteBox);
        }
        container.appendChild(meta);

        // Benchmark registry links — surfaces paper/github/leaderboard/BMT
        // registry deep-links pulled from config/benchmarks_meta.yaml at
        // export time. Only render when at least one link exists.
        var registryLinks = [];
        if (bench.paper) registryLinks.push({ label: 'Paper', url: bench.paper, color: 'text-purple-400' });
        if (bench.github) registryLinks.push({ label: 'GitHub', url: bench.github, color: 'text-emerald-400' });
        if (bench.leaderboard) registryLinks.push({ label: 'Leaderboard', url: bench.leaderboard, color: 'text-blue-400' });
        if (bench.bmt && bench.bmt.bmt_id) {
            registryLinks.push({
                label: 'BMT Registry',
                url: 'https://github.com/hollobit/SOTA/blob/ops/BMT/BMT.json',
                color: 'text-amber-400',
                aux: '#' + bench.bmt.bmt_id + (bench.bmt.bmt_title ? ' — ' + bench.bmt.bmt_title : '')
            });
        }
        if (registryLinks.length || bench.year || bench.item_count) {
            var regBlock = document.createElement('div');
            regBlock.className = 'bg-gray-800 rounded-lg p-4 mb-4 space-y-2';
            var regHeader = document.createElement('h3');
            regHeader.className = 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2';
            regHeader.textContent = '벤치마크 레지스트리 (BMT / Paper / GitHub)';
            regBlock.appendChild(regHeader);

            if (bench.year) regBlock.appendChild(this._makeLabel('Year', bench.year));
            if (bench.item_count) regBlock.appendChild(this._makeLabel('Item count', bench.item_count));

            registryLinks.forEach(function(rl) {
                var row = document.createElement('div');
                row.className = 'text-sm';
                var lbl = document.createElement('span');
                lbl.className = 'text-gray-500';
                lbl.textContent = rl.label + ': ';
                row.appendChild(lbl);
                var a = document.createElement('a');
                a.href = rl.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = rl.color + ' hover:underline break-all';
                a.textContent = rl.url;
                row.appendChild(a);
                if (rl.aux) {
                    var aux = document.createElement('div');
                    aux.className = 'text-xs text-gray-500 mt-0.5';
                    aux.textContent = rl.aux;
                    row.appendChild(aux);
                }
                regBlock.appendChild(row);
            });
            container.appendChild(regBlock);
        }

        // Change-history section (async loaded from daily snapshots in
        // data/export/scores/history/YYYY-MM-DD.json). Skeleton appears
        // immediately; rows fill in once snapshots resolve. Dedupes runs
        // of consecutive identical values so only real changes show.
        var historyBlock = document.createElement('div');
        historyBlock.className = 'bg-gray-800 rounded-lg p-4 mb-4';
        var historyHeader = document.createElement('h3');
        historyHeader.className = 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3';
        historyHeader.textContent = '변경 이력 (Collection / Verification History)';
        historyBlock.appendChild(historyHeader);
        var historyBody = document.createElement('div');
        historyBody.className = 'text-sm space-y-2';
        historyBody.textContent = 'Loading history…';
        historyBlock.appendChild(historyBody);
        container.appendChild(historyBlock);

        Modal._loadScoreHistory(modelId, benchmarkId).then(function(rows) {
            historyBody.textContent = '';
            if (!rows.length) {
                var none = document.createElement('div');
                none.className = 'text-gray-500';
                none.textContent = 'No daily snapshots contain this score.';
                historyBody.appendChild(none);
                return;
            }
            // Collapse consecutive identical runs: show (first-date, last-date, value, source, notes)
            // A row is "identical" when value + source.url + notes all match the previous row.
            var runs = [];
            rows.forEach(function(r) {
                var sig = r.score.value + '|' + ((r.score.source && r.score.source.url) || '') + '|' + (r.score.notes || '');
                var last = runs[runs.length - 1];
                if (last && last.sig === sig) {
                    last.lastDate = r.date;
                } else {
                    runs.push({ firstDate: r.date, lastDate: r.date, sig: sig, score: r.score });
                }
            });

            var summary = document.createElement('div');
            summary.className = 'text-xs text-gray-500 mb-2';
            summary.textContent = rows.length + ' snapshots across ' +
                rows[0].date + ' → ' + rows[rows.length - 1].date + '. ' +
                (runs.length === 1 ? 'Value unchanged across all snapshots.'
                                   : runs.length + ' distinct value/source states recorded.');
            historyBody.appendChild(summary);

            runs.forEach(function(run, idx) {
                var row = document.createElement('div');
                row.className = 'border-l-2 border-gray-700 pl-3 py-1';

                // Highlight the most recent run with an accent border
                if (idx === runs.length - 1) {
                    row.style.borderLeftColor = '#3b82f6'; // Theme.accentStrong
                }

                // Date range + value
                var head = document.createElement('div');
                head.className = 'flex items-baseline gap-2';
                var dateSpan = document.createElement('span');
                dateSpan.className = 'text-gray-400 text-xs font-mono';
                dateSpan.textContent = run.firstDate === run.lastDate
                    ? run.firstDate
                    : run.firstDate + ' → ' + run.lastDate;
                head.appendChild(dateSpan);

                var arrow = document.createElement('span');
                arrow.className = 'text-gray-600 text-xs';
                arrow.textContent = '·';
                head.appendChild(arrow);

                var valSpan = document.createElement('span');
                valSpan.className = (idx === runs.length - 1 ? 'text-blue-300' : 'text-gray-300') + ' font-mono font-semibold';
                valSpan.textContent = (run.score.value > 500 ? Math.round(run.score.value) : run.score.value) + (run.score.unit ? ' ' + run.score.unit : '');
                head.appendChild(valSpan);

                if (run.score.is_sota) {
                    var sotaTag = document.createElement('span');
                    sotaTag.className = 'px-1.5 py-0.5 bg-green-900 text-green-300 text-xs rounded';
                    sotaTag.textContent = 'SOTA';
                    head.appendChild(sotaTag);
                }

                // Show delta vs previous run
                if (idx > 0) {
                    var prevVal = runs[idx - 1].score.value;
                    var delta = run.score.value - prevVal;
                    if (Math.abs(delta) > 0.001) {
                        var deltaSpan = document.createElement('span');
                        deltaSpan.className = 'text-xs ' + (delta > 0 ? 'text-green-400' : 'text-red-400');
                        deltaSpan.textContent = (delta > 0 ? '+' : '') + delta.toFixed(Math.abs(delta) < 10 ? 2 : 1);
                        head.appendChild(deltaSpan);
                    }
                }
                row.appendChild(head);

                // Source + notes
                var srcLine = document.createElement('div');
                srcLine.className = 'text-xs text-gray-500 mt-0.5';
                var srcType = (run.score.source && run.score.source.type) || 'web';
                var srcUrl = Modal._sourceLink(run.score.source);
                srcLine.appendChild(document.createTextNode(srcType + ' · '));
                if (srcUrl) {
                    var a = document.createElement('a');
                    a.href = srcUrl;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.className = 'text-blue-400 hover:underline break-all';
                    a.textContent = srcUrl.length > 80 ? srcUrl.slice(0, 77) + '…' : srcUrl;
                    srcLine.appendChild(a);
                } else if (run.score.source && run.score.source.url) {
                    srcLine.appendChild(document.createTextNode(run.score.source.url));
                }
                row.appendChild(srcLine);

                if (run.score.notes) {
                    var noteLine = document.createElement('div');
                    noteLine.className = 'text-xs text-gray-400 mt-0.5 italic';
                    noteLine.textContent = run.score.notes;
                    row.appendChild(noteLine);
                }

                historyBody.appendChild(row);
            });
        }).catch(function() {
            historyBody.textContent = 'Failed to load history.';
        });

        // Cross-links
        var linksDiv = document.createElement('div');
        linksDiv.className = 'flex gap-2 mb-2';
        var benchLink = document.createElement('button');
        benchLink.className = 'px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs rounded transition';
        benchLink.textContent = '벤치마크 전체 랭킹 →';
        benchLink.onclick = function() { Modal.showBenchmark(benchmarkId); };
        linksDiv.appendChild(benchLink);
        var modelLink = document.createElement('button');
        modelLink.className = 'px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs rounded transition';
        modelLink.textContent = '모델 전체 점수 →';
        modelLink.onclick = function() { Modal.showModel(modelId); };
        linksDiv.appendChild(modelLink);
        container.appendChild(linksDiv);

        Modal._open();
    },

    showModel: function(modelId) {
        var model = App.data.models.find(function(m) { return m.id === modelId; });
        if (!model) return;
        history.replaceState(null, '', '#model/' + modelId);

        // Lazy load enrichment; render synchronously with what we have, then patch
        var _enrichmentPromise = (typeof App !== 'undefined' && App.loadEnrichment)
            ? App.loadEnrichment()
            : Promise.resolve({});

        var scores = App.data.scores.filter(function(s) { return s.model_id === modelId; });

        var byCategory = {};
        scores.forEach(function(s) {
            var bench = App.data.benchmarks.find(function(b) { return b.id === s.benchmark_id; });
            var cat = bench ? bench.category : 'other';
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push({ bench: bench, score: s });
        });

        var container = document.getElementById('modal-content');
        container.textContent = '';

        var h2 = document.createElement('h2');
        h2.id = 'modal-title';
        h2.className = 'text-xl font-bold text-white mb-1';
        h2.textContent = model.name;
        container.appendChild(h2);

        var meta = document.createElement('div');
        meta.className = 'flex gap-2 mb-4';

        var vendorBadge = document.createElement('span');
        vendorBadge.className = 'inline-block px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300';
        vendorBadge.textContent = model.vendor;
        meta.appendChild(vendorBadge);

        var typeBadge = document.createElement('span');
        typeBadge.className = 'inline-block px-2 py-0.5 rounded text-xs';
        if (model.type === 'proprietary') typeBadge.className += ' bg-red-900 text-red-300';
        else if (model.type === 'open-weight') typeBadge.className += ' bg-green-900 text-green-300';
        else typeBadge.className += ' bg-blue-900 text-blue-300';
        typeBadge.textContent = model.type;
        meta.appendChild(typeBadge);

        var countBadge = document.createElement('span');
        countBadge.className = 'inline-block px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400';
        countBadge.textContent = scores.length + ' benchmarks';
        meta.appendChild(countBadge);
        container.appendChild(meta);

        // Vendor model count badge (clickable to filter leaderboard by vendor)
        try {
            var vendorCount = (App.data.models || []).filter(function (mm) {
                return mm.vendor === model.vendor;
            }).length;
            if (vendorCount > 1) {
                var vBar = document.createElement('div');
                vBar.className = 'mb-3 text-xs text-gray-400';
                vBar.appendChild(document.createTextNode((model.vendor || 'unknown') + ' has '));
                var cs = document.createElement('strong');
                cs.className = 'text-blue-400';
                cs.textContent = vendorCount;
                vBar.appendChild(cs);
                vBar.appendChild(document.createTextNode(' tracked models'));
                container.appendChild(vBar);
            }
        } catch (e) { /* non-fatal */ }

        // ---- Detailed model info card ----
        var detail = document.createElement('div');
        detail.className = 'bg-gray-800 rounded-lg p-4 mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm';
        function addField(label, value, opts) {
            if (value === undefined || value === null || value === '') return;
            var wrap = document.createElement('div');
            if (opts && opts.full) wrap.className = 'col-span-2';
            var lbl = document.createElement('div');
            lbl.className = 'text-xs text-gray-500';
            lbl.textContent = label;
            wrap.appendChild(lbl);
            var val = document.createElement('div');
            val.className = 'text-sm text-gray-200';
            val.textContent = value;
            wrap.appendChild(val);
            detail.appendChild(wrap);
        }
        addField('Vendor', model.vendor);
        addField('Released', model.release_date || model.released_at);
        addField('Type', model.type);
        addField('Version', model.version);
        if (Array.isArray(model.modalities) && model.modalities.length) {
            addField('Modalities', model.modalities.join(', '));
        }
        if (model.parameters) addField('Parameters', model.parameters);
        if (model.params_b) addField('Parameters (B)', model.params_b + (model.active_params_b ? ' total / ' + model.active_params_b + ' active' : ''));
        if (model.context_window) addField('Context Window', Number(model.context_window).toLocaleString() + ' tokens');
        if (model.knowledge_cutoff) addField('Knowledge Cutoff', model.knowledge_cutoff);
        if (Array.isArray(model.languages) && model.languages.length) {
            var langs = model.languages;
            var langText = langs.length <= 6 ? langs.join(', ') : (langs.slice(0, 6).join(', ') + ' (+' + (langs.length - 6) + ')');
            addField('Languages', langText);
        }
        if (model.license) addField('License', model.license);

        var pricing = model.pricing || (App.data.pricing && App.data.pricing[modelId]);
        if (pricing) {
            if (pricing.tokens_per_second != null) {
                addField('Throughput', pricing.tokens_per_second + ' tokens/sec');
            }
            if (pricing.input != null) addField('Input price (per 1M tokens)', '$' + pricing.input);
            if (pricing.output != null) addField('Output price (per 1M tokens)', '$' + pricing.output);
            if (pricing.cached_input != null) addField('Cached input', '$' + pricing.cached_input);
        }
        if (model._note || model.notes || model.description) {
            addField('Description', model._note || model.notes || model.description, {full: true});
        }
        if (detail.children.length) container.appendChild(detail);

        // ---- Reference links — system card / model card / homepage / HF / paper ----
        // Aggregate from any plausible field name on the model object.
        function pickLinks(m) {
            var links = [];
            function push(label, url, color) {
                if (!url || typeof url !== 'string') return;
                if (links.some(function(l) { return l.url === url; })) return;
                links.push({label: label, url: url, color: color});
            }
            // System card
            push('📋 System Card', m.system_card || m.system_card_url, 'purple');
            // Model card
            push('🪪 Model Card', m.model_card || m.model_card_url, 'cyan');
            // Hugging Face
            push('🤗 HuggingFace', m.huggingface || m.hf_url || m.hf, 'yellow');
            // Homepage / vendor
            push('🌐 Homepage', m.homepage || m.url || m.vendor_url || m.website, 'blue');
            // Paper / arxiv
            push('📄 Paper', m.paper || m.paper_url || m.arxiv || m.arxiv_url, 'pink');
            // GitHub / repo
            push('⚙ GitHub', m.github || m.github_url || m.repo, 'gray');
            // Blog announcement
            push('📰 Blog', m.blog || m.announcement || m.launch_blog, 'green');
            // Generic 'links' array (each entry {label, url})
            if (Array.isArray(m.links)) m.links.forEach(function(l) { push(l.label || 'Link', l.url, 'blue'); });
            return links;
        }
        var refLinks = pickLinks(model);
        if (refLinks.length) {
            var linksDiv = document.createElement('div');
            linksDiv.className = 'flex flex-wrap gap-2 mb-4';
            refLinks.forEach(function(l) {
                var a = document.createElement('a');
                a.href = l.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs transition';
                var bg = {
                    purple: 'bg-purple-900 hover:bg-purple-800 text-purple-200',
                    cyan: 'bg-cyan-900 hover:bg-cyan-800 text-cyan-200',
                    yellow: 'bg-yellow-900 hover:bg-yellow-800 text-yellow-200',
                    blue: 'bg-blue-900 hover:bg-blue-800 text-blue-200',
                    pink: 'bg-pink-900 hover:bg-pink-800 text-pink-200',
                    gray: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
                    green: 'bg-green-900 hover:bg-green-800 text-green-200'
                }[l.color] || 'bg-gray-700 hover:bg-gray-600 text-gray-200';
                a.className += ' ' + bg;
                a.textContent = l.label;
                a.title = l.url;
                linksDiv.appendChild(a);
            });
            container.appendChild(linksDiv);
        }

        // ---- Peer Comparison (NEW) ----
        try {
            var peerCandidates = (window.PeerMatcher && PeerMatcher.findPeers)
                ? PeerMatcher.findPeers(modelId, App.data.models, App.data.scores, 5)
                : [];
            if (peerCandidates.length > 0) {
                var peerDiv = document.createElement('div');
                peerDiv.className = 'mb-4';
                var ph = document.createElement('h3');
                ph.className = 'text-sm font-semibold text-gray-300 mb-2';
                ph.textContent = 'Peer Comparison';
                peerDiv.appendChild(ph);

                var picker = document.createElement('div');
                picker.className = 'flex items-center gap-2 mb-2 text-xs text-gray-400';
                var pickerLabel = document.createElement('span');
                pickerLabel.textContent = 'Most similar:';
                picker.appendChild(pickerLabel);
                var sel = document.createElement('select');
                sel.className = 'bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs';
                peerCandidates.forEach(function (p) {
                    var pm = App.data.models.find(function (m) { return m.id === p.modelId; });
                    var label = (pm ? pm.name : p.modelId) + '  (overlap ' + p.overlap + ', avg d ' + p.avgDelta.toFixed(1) + ')';
                    var opt = document.createElement('option');
                    opt.value = p.modelId;
                    opt.textContent = label;
                    sel.appendChild(opt);
                });
                picker.appendChild(sel);
                // NEW: Quick "Compare with peers" button — jumps to Comparison tab pre-selected
                var cmpBtn = document.createElement('button');
                cmpBtn.className = 'ml-2 bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs';
                cmpBtn.textContent = 'Compare with peers ↗';
                cmpBtn.title = 'Open Comparison tab with this model + top 3 peers selected';
                cmpBtn.onclick = (function (peers, targetId) {
                    return function () {
                        var ids = [targetId].concat(peers.slice(0, 3).map(function (p) { return p.modelId; }));
                        // Switch to comparison tab
                        var btn = document.getElementById('tabbtn-comparison');
                        if (btn) btn.click();
                        // Pre-select these models
                        setTimeout(function () {
                            var msel = document.getElementById('cmp-models');
                            if (!msel) return;
                            Array.prototype.forEach.call(msel.options, function (o) { o.selected = false; });
                            ids.forEach(function (id) {
                                var found = Array.prototype.find.call(msel.options, function (o) { return o.value === id; });
                                if (found) found.selected = true;
                            });
                            // Trigger comparison render
                            if (typeof Comparison !== 'undefined' && Comparison.render) {
                                if (Comparison._updateCounters) Comparison._updateCounters();
                                Comparison.render();
                            }
                            // Close modal
                            var modalRoot = document.getElementById('modal');
                            if (modalRoot) modalRoot.classList.add('hidden');
                        }, 150);
                    };
                })(peerCandidates, modelId);
                picker.appendChild(cmpBtn);
                peerDiv.appendChild(picker);

                var tableWrap = document.createElement('div');
                tableWrap.className = 'overflow-x-auto';
                peerDiv.appendChild(tableWrap);

                var renderPeerTable = function (peerId) {
                    tableWrap.textContent = '';
                    var picked = peerCandidates.find(function (p) { return p.modelId === peerId; });
                    if (!picked) return;
                    var peerScores = {};
                    App.data.scores.forEach(function (s) {
                        if (s.model_id === peerId) peerScores[s.benchmark_id] = s.value;
                    });
                    var targetScores = {};
                    App.data.scores.forEach(function (s) {
                        if (s.model_id === modelId) targetScores[s.benchmark_id] = s.value;
                    });

                    var tbl = document.createElement('table');
                    tbl.className = 'w-full text-xs text-gray-200';
                    var thead = document.createElement('thead');
                    var theadRow = document.createElement('tr');
                    theadRow.className = 'text-gray-500 border-b border-gray-700';
                    ['Benchmark', model.name, 'Peer', 'd'].forEach(function (label, idx) {
                        var th = document.createElement('th');
                        th.className = idx === 0 ? 'text-left py-1' : 'text-right py-1';
                        th.textContent = label;
                        theadRow.appendChild(th);
                    });
                    thead.appendChild(theadRow);
                    tbl.appendChild(thead);

                    var tb = document.createElement('tbody');
                    picked.sharedBenches.forEach(function (b) {
                        var bench = App.data.benchmarks.find(function (x) { return x.id === b; });
                        var name = bench ? bench.name : b;
                        var t = targetScores[b];
                        var p = peerScores[b];
                        var delta = t - p;
                        var deltaClass = delta > 0 ? 'text-green-400' : (delta < 0 ? 'text-red-400' : 'text-gray-400');
                        var sign = delta > 0 ? '+' : '';
                        var tier = window.PeerMatcher
                            ? PeerMatcher.sotaTier(t, modelId, b, App.data.models, App.data.scores)
                            : null;
                        var badgeText = tier ? ' ' + (tier.tier === 'sota' ? '*' : (tier.tier === 'top3' ? '+' : '~')) : '';
                        var tr = document.createElement('tr');
                        tr.className = 'border-b border-gray-800';

                        var cName = document.createElement('td'); cName.className = 'py-1'; cName.textContent = name;
                        var cTarget = document.createElement('td'); cTarget.className = 'text-right py-1'; cTarget.textContent = t.toFixed(1) + badgeText;
                        var cPeer = document.createElement('td'); cPeer.className = 'text-right py-1 text-gray-400'; cPeer.textContent = p.toFixed(1);
                        var cDelta = document.createElement('td'); cDelta.className = 'text-right py-1 ' + deltaClass; cDelta.textContent = sign + delta.toFixed(1);

                        tr.appendChild(cName); tr.appendChild(cTarget); tr.appendChild(cPeer); tr.appendChild(cDelta);
                        tb.appendChild(tr);
                    });
                    tbl.appendChild(tb);
                    tableWrap.appendChild(tbl);

                    var foot = document.createElement('div');
                    foot.className = 'text-xs text-gray-500 mt-1';
                    var avgSign = picked.avgDelta >= 0 ? '+' : '';
                    foot.textContent = 'Avg d ' + avgSign + picked.avgDelta.toFixed(1) + 'pt across ' + picked.overlap + ' shared benchmarks';
                    peerDiv.appendChild(foot);
                };

                sel.onchange = function () { renderPeerTable(sel.value); };
                renderPeerTable(peerCandidates[0].modelId);

                container.appendChild(peerDiv);
            }
        } catch (e) {
            console.warn('[modal] peer comparison error', e);
        }

        // ---- Strengths & Weaknesses (NEW) ----
        try {
            if (window.PeerMatcher && PeerMatcher.extractStrengthsWeaknesses) {
                var sw = PeerMatcher.extractStrengthsWeaknesses(modelId, App.data.models, App.data.scores);

                if (sw.strengths.length > 0) {
                    var strDiv = document.createElement('div');
                    strDiv.className = 'mb-4';
                    var sh = document.createElement('h3');
                    sh.className = 'text-sm font-semibold text-gray-300 mb-2';
                    sh.textContent = 'Strengths (12-month SOTA tier)';
                    strDiv.appendChild(sh);
                    var ul = document.createElement('ul');
                    ul.className = 'text-xs text-gray-200 space-y-1';
                    sw.strengths.forEach(function (r) {
                        var bench = App.data.benchmarks.find(function (b) { return b.id === r.benchmark_id; });
                        var name = bench ? bench.name : r.benchmark_id;
                        var li = document.createElement('li');
                        li.className = 'flex justify-between border-b border-gray-800 py-1';
                        var nameSpan = document.createElement('span');
                        nameSpan.textContent = name;
                        var valSpan = document.createElement('span');
                        var bold = document.createElement('strong');
                        bold.textContent = r.value.toFixed(1);
                        valSpan.appendChild(bold);
                        valSpan.appendChild(document.createTextNode(' ' + r.tier.label + ' '));
                        var rankSpan = document.createElement('span');
                        rankSpan.className = 'text-gray-500';
                        rankSpan.textContent = '(' + r.tier.rank + '/' + r.tier.total + ')';
                        valSpan.appendChild(rankSpan);
                        li.appendChild(nameSpan);
                        li.appendChild(valSpan);
                        ul.appendChild(li);
                    });
                    strDiv.appendChild(ul);
                    container.appendChild(strDiv);
                }

                if (sw.weaknesses.length > 0) {
                    var weakDiv = document.createElement('div');
                    weakDiv.className = 'mb-4';
                    var wh = document.createElement('h3');
                    wh.className = 'text-sm font-semibold text-gray-300 mb-2';
                    wh.textContent = 'Weaknesses (vs peer avg)';
                    weakDiv.appendChild(wh);
                    var wul = document.createElement('ul');
                    wul.className = 'text-xs text-gray-200 space-y-1';
                    sw.weaknesses.forEach(function (r) {
                        var bench = App.data.benchmarks.find(function (b) { return b.id === r.benchmark_id; });
                        var name = bench ? bench.name : r.benchmark_id;
                        var li = document.createElement('li');
                        li.className = 'flex justify-between border-b border-gray-800 py-1';
                        var n = document.createElement('span');
                        n.textContent = name;
                        var v = document.createElement('span');
                        v.appendChild(document.createTextNode(r.value.toFixed(1) + '  '));
                        var avg = document.createElement('span');
                        avg.className = 'text-gray-500';
                        avg.textContent = 'peer avg ' + r.peerAvg.toFixed(1) + '  ';
                        v.appendChild(avg);
                        var d = document.createElement('span');
                        d.className = 'text-red-400';
                        d.textContent = 'd ' + r.delta.toFixed(1);
                        v.appendChild(d);
                        li.appendChild(n);
                        li.appendChild(v);
                        wul.appendChild(li);
                    });
                    weakDiv.appendChild(wul);
                    container.appendChild(weakDiv);
                }
            }
        } catch (e) {
            console.warn('[modal] strengths/weaknesses error', e);
        }

        // ---- Source URLs from this model's score rows (deduplicated) ----
        var srcUrls = {};
        scores.forEach(function(s) {
            var src = s.source && s.source.url;
            if (src && src.startsWith('http')) srcUrls[src] = (srcUrls[src] || 0) + 1;
        });
        var topSrcs = Object.keys(srcUrls).sort(function(a, b) { return srcUrls[b] - srcUrls[a]; }).slice(0, 5);
        if (topSrcs.length) {
            var srcDiv = document.createElement('div');
            srcDiv.className = 'mb-4';
            var stitle = document.createElement('h3');
            stitle.className = 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2';
            stitle.textContent = 'Score Sources (' + topSrcs.length + ' unique)';
            srcDiv.appendChild(stitle);
            var slist = document.createElement('div');
            slist.className = 'flex flex-wrap gap-1.5';
            topSrcs.forEach(function(u) {
                var a = document.createElement('a');
                a.href = u;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'inline-block px-2 py-1 rounded text-xs bg-gray-800 hover:bg-gray-700 text-blue-400 hover:underline';
                try {
                    var host = new URL(u).hostname.replace(/^www\./, '');
                    a.textContent = host + ' (' + srcUrls[u] + ')';
                } catch (e) { a.textContent = u.slice(0, 50); }
                a.title = u;
                slist.appendChild(a);
            });
            srcDiv.appendChild(slist);
            container.appendChild(srcDiv);
        }

        // ---- Version history (sibling models from same vendor with similar id stem) ----
        try {
            var stem = modelId.split('/').pop().replace(/[\d._-]+$/, '').replace(/-(pro|max|mini|flash|nano|ultra|small|medium|large|haiku|sonnet|opus|preview|beta|thinking|fast|reasoning|chat)$/i, '');
            if (stem.length >= 3) {
                var siblings = App.data.models.filter(function(m) {
                    if (m.id === modelId) return false;
                    if (m.vendor !== model.vendor) return false;
                    var sname = m.id.split('/').pop();
                    return sname.toLowerCase().indexOf(stem.toLowerCase()) >= 0;
                });
                if (siblings.length) {
                    siblings.sort(function(a, b) {
                        var ad = a.release_date || ''; var bd = b.release_date || '';
                        return bd.localeCompare(ad);
                    });
                    var hist = document.createElement('div');
                    hist.className = 'mb-4';
                    var ht = document.createElement('h3');
                    ht.className = 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2';
                    ht.textContent = 'Version History (' + model.vendor + ')';
                    hist.appendChild(ht);
                    var list = document.createElement('div');
                    list.className = 'flex flex-wrap gap-1.5';
                    siblings.slice(0, 30).forEach(function(sib) {
                        var pill = document.createElement('span');
                        pill.className = 'inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer transition';
                        pill.title = sib.id;
                        var rd = sib.release_date ? ' · ' + sib.release_date.slice(0, 7) : '';
                        pill.textContent = sib.name + rd;
                        pill.onclick = (function(mid) { return function() { Modal.showModel(mid); }; })(sib.id);
                        list.appendChild(pill);
                    });
                    hist.appendChild(list);
                    container.appendChild(hist);
                }
            }
        } catch (e) { /* version history is non-fatal */ }

        // ---- Architecture / Training / Safety (NEW, deferred) ----
        var enrichSlot = document.createElement('div');
        enrichSlot.id = 'modal-enrichment-slot';
        container.appendChild(enrichSlot);
        Promise.all([
            _enrichmentPromise,
            (typeof App !== 'undefined' && App.loadHFMetadata) ? App.loadHFMetadata() : Promise.resolve({})
        ]).then(function (results) {
            var enrichmentMap = results[0];
            var hfMap = results[1] || {};
            var entry = enrichmentMap && enrichmentMap[modelId];
            if (!entry) return;

            // ---- Patch Reference Links + Pricing from enrichment ----
            try {
                var entryLinks = entry.links || {};
                var entryPricing = entry.pricing || {};

                // Augment Reference Links if any enrichment URLs present
                var enrichedLinks = [];
                function pushE(label, url, color) {
                    if (!url || typeof url !== 'string') return;
                    enrichedLinks.push({ label: label, url: url, color: color });
                }
                pushE('📋 System Card', entryLinks.system_card, 'purple');
                pushE('🪪 Model Card', entryLinks.model_card, 'cyan');
                pushE('🤗 HuggingFace', entryLinks.huggingface, 'yellow');
                pushE('🌐 Homepage', entryLinks.homepage, 'blue');
                pushE('📄 Paper', entryLinks.paper, 'pink');
                pushE('⚙ GitHub', entryLinks.github, 'gray');
                pushE('📰 Blog', entryLinks.blog, 'green');

                if (enrichedLinks.length) {
                    var linksDiv2 = document.createElement('div');
                    linksDiv2.className = 'flex flex-wrap gap-2 mb-4';
                    var linksTitle = document.createElement('div');
                    linksTitle.className = 'w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1';
                    linksTitle.textContent = 'Reference Links';
                    linksDiv2.appendChild(linksTitle);
                    var bgMap = {
                        purple: 'bg-purple-900 hover:bg-purple-800 text-purple-200',
                        cyan: 'bg-cyan-900 hover:bg-cyan-800 text-cyan-200',
                        yellow: 'bg-yellow-900 hover:bg-yellow-800 text-yellow-200',
                        blue: 'bg-blue-900 hover:bg-blue-800 text-blue-200',
                        pink: 'bg-pink-900 hover:bg-pink-800 text-pink-200',
                        gray: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
                        green: 'bg-green-900 hover:bg-green-800 text-green-200'
                    };
                    enrichedLinks.forEach(function (l) {
                        var a = document.createElement('a');
                        a.href = l.url;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        a.className = 'inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs transition ' + (bgMap[l.color] || bgMap.gray);
                        a.textContent = l.label;
                        a.title = l.url;
                        linksDiv2.appendChild(a);
                    });
                    enrichSlot.appendChild(linksDiv2);
                }

                // Augment Pricing rows in the existing detail card if enrichment has prices
                if ((entryPricing.input != null || entryPricing.output != null || entryPricing.cached_input != null) && detail) {
                    var priceCard = document.createElement('div');
                    priceCard.className = 'mb-4 bg-gray-800 rounded-lg p-4';
                    var priceTitle = document.createElement('h3');
                    priceTitle.className = 'text-sm font-semibold text-gray-300 mb-2';
                    priceTitle.textContent = 'Pricing (per 1M tokens, ' + (entryPricing.currency || 'USD') + ')';
                    priceCard.appendChild(priceTitle);
                    function priceRow(label, value) {
                        if (value == null) return;
                        var r = document.createElement('div');
                        r.className = 'grid grid-cols-3 gap-2 text-xs py-0.5';
                        var l = document.createElement('div');
                        l.className = 'text-gray-500 col-span-1';
                        l.textContent = label;
                        r.appendChild(l);
                        var v = document.createElement('div');
                        v.className = 'text-gray-200 col-span-2';
                        v.textContent = '$' + value;
                        r.appendChild(v);
                        priceCard.appendChild(r);
                    }
                    priceRow('Input', entryPricing.input);
                    priceRow('Output', entryPricing.output);
                    priceRow('Cached input', entryPricing.cached_input);
                    enrichSlot.appendChild(priceCard);
                }
            } catch (e) {
                console.warn('[modal] enrichment links/pricing patch error', e);
            }

            // ---- Performance & Cost (NEW: 4-priority additions) ----
            try {
                var bm = entry.benchmarks_meta || {};
                var pricingFromEnrich = entry.pricing || {};
                var aaPricing = (App.data.pricing && App.data.pricing[modelId]) || {};

                // Merge: enrichment pricing takes precedence, else AA pricing
                var inputPrice = pricingFromEnrich.input != null ? pricingFromEnrich.input : aaPricing.input;
                var outputPrice = pricingFromEnrich.output != null ? pricingFromEnrich.output : aaPricing.output;
                var intelligenceIdx = bm.intelligence_index_override != null ? bm.intelligence_index_override : aaPricing.intelligence_index;
                var arenaElo = bm.arena_elo;
                var throughput = aaPricing.tokens_per_second;

                // Compute model age + cadence
                var ageDays = null, ageStr = null;
                if (model.release_date || model.released_at) {
                    var releaseStr = model.release_date || model.released_at;
                    var rd = new Date(releaseStr);
                    if (!isNaN(rd.getTime())) {
                        ageDays = Math.floor((Date.now() - rd.getTime()) / 86400000);
                        if (ageDays < 30) ageStr = ageDays + ' days ago';
                        else if (ageDays < 365) ageStr = Math.floor(ageDays / 30) + ' months ago';
                        else ageStr = (ageDays / 365).toFixed(1) + ' years ago';
                    }
                }

                // Vendor release cadence: avg gap between releases by same vendor
                var cadenceStr = null;
                try {
                    var sameVendor = (App.data.models || []).filter(function (mm) {
                        return mm.vendor === model.vendor && (mm.release_date || mm.released_at);
                    }).map(function (mm) { return new Date(mm.release_date || mm.released_at); })
                      .filter(function (d) { return !isNaN(d.getTime()); })
                      .sort(function (a, b) { return a - b; });
                    if (sameVendor.length >= 3) {
                        var gaps = [];
                        for (var gi = 1; gi < sameVendor.length; gi++) {
                            gaps.push((sameVendor[gi] - sameVendor[gi-1]) / 86400000);
                        }
                        var avgGap = gaps.reduce(function (a, b) { return a + b; }, 0) / gaps.length;
                        if (avgGap > 0) cadenceStr = 'Avg ' + Math.round(avgGap) + ' days between vendor releases';
                    }
                } catch (e) { /* cadence non-fatal */ }

                // Cost per IQ point (Cost-per-Intelligence)
                var costPerIQ = null;
                if (intelligenceIdx && intelligenceIdx > 0 && (inputPrice != null)) {
                    // Use blended cost: avg of input + 5×output (typical chat ratio 1:5)
                    var blendedCost = inputPrice + (outputPrice != null ? outputPrice * 5 : 0);
                    costPerIQ = (blendedCost / intelligenceIdx).toFixed(3);
                }

                // Peer pricing comparison: median input price among recent (≤365d) models with pricing
                var peerInputMedian = null, peerOutputMedian = null, pricePosition = null;
                try {
                    var pmap = App.data.pricing || {};
                    var peerInputs = [], peerOutputs = [];
                    Object.keys(pmap).forEach(function (mid) {
                        if (mid === modelId) return;
                        var p = pmap[mid];
                        if (p && typeof p.input === 'number') peerInputs.push(p.input);
                        if (p && typeof p.output === 'number') peerOutputs.push(p.output);
                    });
                    function median(arr) {
                        if (!arr.length) return null;
                        var s = arr.slice().sort(function (a, b) { return a - b; });
                        var mid = Math.floor(s.length / 2);
                        return s.length % 2 ? s[mid] : (s[mid-1] + s[mid]) / 2;
                    }
                    peerInputMedian = median(peerInputs);
                    peerOutputMedian = median(peerOutputs);
                    if (inputPrice != null && peerInputMedian != null) {
                        var ratio = inputPrice / peerInputMedian;
                        if (ratio < 0.5) pricePosition = 'Significantly cheaper';
                        else if (ratio < 0.85) pricePosition = 'Below peer median';
                        else if (ratio < 1.15) pricePosition = 'Near peer median';
                        else if (ratio < 2.0) pricePosition = 'Above peer median';
                        else pricePosition = 'Significantly pricier';
                    }
                } catch (e) { /* peer comp non-fatal */ }

                // Only render if we have at least one piece of new data
                if (intelligenceIdx != null || arenaElo != null || ageStr || costPerIQ != null || cadenceStr || pricePosition) {
                    var perfCard = document.createElement('div');
                    perfCard.className = 'mb-4 bg-gray-800 rounded-lg p-4';
                    var perfTitle = document.createElement('h3');
                    perfTitle.className = 'text-sm font-semibold text-gray-300 mb-2';
                    perfTitle.textContent = 'Performance & Cost';
                    perfCard.appendChild(perfTitle);

                    function perfRow(label, value, hint) {
                        if (value == null || value === '') return;
                        var r = document.createElement('div');
                        r.className = 'grid grid-cols-3 gap-2 text-xs py-0.5';
                        var l = document.createElement('div');
                        l.className = 'text-gray-500 col-span-1';
                        l.textContent = label;
                        r.appendChild(l);
                        var v = document.createElement('div');
                        v.className = 'text-gray-200 col-span-2';
                        v.textContent = String(value);
                        if (hint) {
                            var hintSpan = document.createElement('span');
                            hintSpan.className = 'ml-2 text-gray-500';
                            hintSpan.textContent = '(' + hint + ')';
                            v.appendChild(hintSpan);
                        }
                        r.appendChild(v);
                        perfCard.appendChild(r);
                    }

                    if (intelligenceIdx != null) perfRow('Intelligence Index', intelligenceIdx, 'Artificial Analysis');
                    if (arenaElo != null) {
                        var eloLabel = arenaElo;
                        if (bm.arena_elo_source) eloLabel = arenaElo + '';
                        perfRow('LMSys Arena Elo', eloLabel, 'lmarena.ai');
                    }
                    if (throughput != null) perfRow('Throughput', throughput + ' tokens/sec');
                    if (ageStr) perfRow('Released', ageStr, model.release_date);
                    if (cadenceStr) perfRow('Vendor cadence', cadenceStr);
                    if (costPerIQ != null) {
                        perfRow('Cost / IQ point', '$' + costPerIQ, 'blended input+5×output / Intelligence Index');
                        // Build distribution from peer pricing
                        try {
                            var pmap2 = App.data.pricing || {};
                            var peerCosts = [];
                            Object.keys(pmap2).forEach(function (mid) {
                                var p = pmap2[mid];
                                if (!p || !p.intelligence_index || !p.input) return;
                                var peerBlended = p.input + (p.output != null ? p.output * 5 : 0);
                                peerCosts.push(peerBlended / p.intelligence_index);
                            });
                            if (peerCosts.length >= 5) {
                                peerCosts.sort(function (a, b) { return a - b; });
                                var pmin = peerCosts[0];
                                var pmax = peerCosts[peerCosts.length - 1];
                                var thisCost = parseFloat(costPerIQ);
                                var pos = (thisCost - pmin) / (pmax - pmin);
                                pos = Math.max(0, Math.min(1, pos));
                                // Inline progress bar — lower is better, so flip color scale
                                var barWrap = document.createElement('div');
                                barWrap.className = 'grid grid-cols-3 gap-2 text-xs py-0.5';
                                var lblBar = document.createElement('div');
                                lblBar.className = 'text-gray-500 col-span-1';
                                lblBar.textContent = 'Cost position';
                                barWrap.appendChild(lblBar);
                                var barCell = document.createElement('div');
                                barCell.className = 'col-span-2';
                                var barTrack = document.createElement('div');
                                barTrack.style.position = 'relative';
                                barTrack.style.background = '#1f2937';
                                barTrack.style.height = '8px';
                                barTrack.style.borderRadius = '4px';
                                barTrack.style.overflow = 'hidden';
                                var barFill = document.createElement('div');
                                barFill.style.position = 'absolute';
                                barFill.style.top = '0';
                                barFill.style.left = '0';
                                barFill.style.height = '100%';
                                barFill.style.width = (pos * 100).toFixed(1) + '%';
                                barFill.style.background = pos < 0.33 ? '#10b981' : (pos < 0.66 ? '#f59e0b' : '#ef4444');
                                barTrack.appendChild(barFill);
                                barCell.appendChild(barTrack);
                                var captionBar = document.createElement('div');
                                captionBar.className = 'text-xs text-gray-500 mt-0.5';
                                captionBar.textContent = 'Cheaper $' + pmin.toFixed(2) + ' ← peer range → $' + pmax.toFixed(2) + ' Pricier';
                                barCell.appendChild(captionBar);
                                barWrap.appendChild(barCell);
                                perfCard.appendChild(barWrap);
                            }
                        } catch (e) { /* mini bar non-fatal */ }
                    }
                    if (pricePosition && peerInputMedian != null) {
                        perfRow('Price position', pricePosition, 'peer median input $' + peerInputMedian.toFixed(2) + '/M');
                    }

                    // Data freshness — most recent score collected_at for this model
                    try {
                        var latest = null;
                        for (var sfi = 0; sfi < App.data.scores.length; sfi++) {
                            var sf = App.data.scores[sfi];
                            if (sf.model_id !== modelId) continue;
                            var d = sf.source && sf.source.date;
                            if (d && (!latest || d > latest)) latest = d;
                        }
                        if (latest) {
                            var now = new Date();
                            var dl = new Date(latest);
                            if (!isNaN(dl.getTime())) {
                                var dayDiff = Math.floor((now - dl) / 86400000);
                                var freshLabel;
                                if (dayDiff < 1) freshLabel = 'today';
                                else if (dayDiff < 7) freshLabel = dayDiff + ' days ago';
                                else if (dayDiff < 60) freshLabel = Math.floor(dayDiff / 7) + ' weeks ago';
                                else freshLabel = Math.floor(dayDiff / 30) + ' months ago';
                                perfRow('Data freshness', freshLabel, 'most recent score: ' + latest);
                            }
                        }
                    } catch (e) { /* freshness non-fatal */ }

                    // Same-class peer count (size bracket)
                    try {
                        var entryArchForClass = entry.architecture || {};
                        var pb = entryArchForClass.total_params_b;
                        if (!pb && model.parameters) {
                            var pmatch = String(model.parameters).match(/(\d+(?:\.\d+)?)\s*B/i);
                            if (pmatch) pb = parseFloat(pmatch[1]);
                        }
                        if (pb) {
                            var classMin, classMax, classLabel;
                            if (pb < 10) { classMin = 0; classMax = 10; classLabel = '<10B'; }
                            else if (pb < 50) { classMin = 10; classMax = 50; classLabel = '10-50B'; }
                            else if (pb < 200) { classMin = 50; classMax = 200; classLabel = '50-200B'; }
                            else if (pb < 700) { classMin = 200; classMax = 700; classLabel = '200-700B'; }
                            else { classMin = 700; classMax = Infinity; classLabel = '700B+'; }
                            // Count peers in same class — using enrichment.architecture.total_params_b across all enriched models
                            var classCount = 0;
                            Object.keys(enrichmentMap).forEach(function (mid) {
                                var ma = (enrichmentMap[mid].architecture || {}).total_params_b;
                                if (typeof ma === 'number' && ma >= classMin && ma < classMax) classCount++;
                            });
                            if (classCount >= 2) {
                                perfRow('Same-class peers', classCount + ' models', classLabel + ' parameter range');
                            }
                        }
                    } catch (e) { /* class peer non-fatal */ }

                    // Benchmark coverage
                    try {
                        var totalBench = (App.data.benchmarks || []).length;
                        var modelBenchSet = {};
                        for (var bsi = 0; bsi < App.data.scores.length; bsi++) {
                            if (App.data.scores[bsi].model_id === modelId) modelBenchSet[App.data.scores[bsi].benchmark_id] = true;
                        }
                        var modelBenchCount = Object.keys(modelBenchSet).length;
                        if (totalBench > 0 && modelBenchCount > 0) {
                            var pctCov = (modelBenchCount / totalBench * 100).toFixed(1);
                            perfRow('Benchmark coverage', modelBenchCount + ' / ' + totalBench + ' benchmarks (' + pctCov + '%)');
                        }
                    } catch (e) { /* coverage non-fatal */ }

                    // HuggingFace metadata
                    try {
                        var hf = hfMap[modelId];
                        if (hf) {
                            if (hf.downloads_30d != null) {
                                perfRow('HF downloads (30d)', hf.downloads_30d.toLocaleString(), 'huggingface.co');
                            }
                            if (hf.likes != null) {
                                perfRow('HF likes', hf.likes.toLocaleString());
                            }
                            if (hf.total_size_bytes != null) {
                                var gb = (hf.total_size_bytes / 1e9).toFixed(1);
                                perfRow('HF repo size', gb + ' GB', (hf.file_count || '?') + ' files');
                            }
                            if (hf.last_modified) {
                                var hfDate = String(hf.last_modified).slice(0, 10);
                                perfRow('HF last update', hfDate);
                            }
                        }
                    } catch (e) { /* hf metadata non-fatal */ }

                    enrichSlot.appendChild(perfCard);
                }
            } catch (e) {
                console.warn('[modal] performance & cost section error', e);
            }

            var arch = entry.architecture || {};
            var train = entry.training || {};
            var safety = entry.safety || {};
            var quants = entry.quantizations || [];
            var providers = entry.api_providers || [];

            var anyArch = arch.type || arch.total_params_b || arch.attention || arch.attention_pattern || arch.experts_total;
            var anyTrain = train.pretrain_tokens || train.compute_flops || (train.phases && train.phases.length);
            var anySafety = safety.aisi_cyber_tier || safety.cbrn_risk || safety.self_reported_safety_card;
            var anyQuant = quants.length > 0;
            var anyProv = providers.length > 0;
            if (!(anyArch || anyTrain || anySafety || anyQuant || anyProv)) return;

            var card = document.createElement('div');
            card.className = 'mb-4 bg-gray-800 rounded-lg p-4';
            var hd = document.createElement('h3');
            hd.className = 'text-sm font-semibold text-gray-300 mb-3';
            hd.textContent = 'Architecture / Training / Safety';
            card.appendChild(hd);

            function row(label, value) {
                if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) return;
                var r = document.createElement('div');
                r.className = 'grid grid-cols-3 gap-2 text-xs py-0.5';
                var l = document.createElement('div');
                l.className = 'text-gray-500 col-span-1';
                l.textContent = label;
                r.appendChild(l);
                var v = document.createElement('div');
                v.className = 'text-gray-200 col-span-2';
                v.textContent = Array.isArray(value) ? value.join(', ') : String(value);
                r.appendChild(v);
                card.appendChild(r);
            }

            if (anyArch) {
                row('Architecture', arch.type ? arch.type.toUpperCase() : null);
                if (arch.total_params_b != null) {
                    var paramsLabel = arch.total_params_b + 'B';
                    if (arch.active_params_b != null) paramsLabel += ' total / ' + arch.active_params_b + 'B active';
                    if (arch.vision_encoder_b != null) paramsLabel += ' (+' + arch.vision_encoder_b + 'B vision)';
                    row('Parameters', paramsLabel);
                }
                if (arch.layers != null) row('Layers', arch.layers);
                if (arch.attention != null) row('Attention', arch.attention.toUpperCase().replace(/_/g, ' '));
                if (arch.attention_pattern != null) row('Pattern', arch.attention_pattern);
                if (arch.experts_total != null) {
                    var expLabel = arch.experts_total + ' experts';
                    if (arch.experts_active != null) expLabel += ', ' + arch.experts_active + ' active';
                    row('Experts', expLabel);
                }
            }

            if (anyTrain) {
                row('Pretrain tokens', train.pretrain_tokens);
                row('Compute (FLOPs)', train.compute_flops);
                if (train.phases && train.phases.length) row('Phases', train.phases);
            }

            if (anySafety) {
                row('AISI cyber tier', safety.aisi_cyber_tier);
                row('CBRN risk', safety.cbrn_risk);
                if (safety.self_reported_safety_card) {
                    var sr = document.createElement('div');
                    sr.className = 'grid grid-cols-3 gap-2 text-xs py-0.5';
                    var sl = document.createElement('div');
                    sl.className = 'text-gray-500 col-span-1';
                    sl.textContent = 'Safety card';
                    sr.appendChild(sl);
                    var sv = document.createElement('div');
                    sv.className = 'col-span-2';
                    var sa = document.createElement('a');
                    sa.href = safety.self_reported_safety_card;
                    sa.target = '_blank';
                    sa.rel = 'noopener';
                    sa.className = 'text-blue-400 hover:underline';
                    sa.textContent = safety.self_reported_safety_card.replace(/^https?:\/\//, '').slice(0, 60);
                    sv.appendChild(sa);
                    sr.appendChild(sv);
                    card.appendChild(sr);
                }
            }

            if (anyQuant) {
                var paramsBNum = arch.total_params_b || arch.active_params_b;
                var quantStrs = quants.map(function (q) {
                    var qup = q.toUpperCase();
                    if (!paramsBNum) return qup;
                    var bytesPerParam = { fp16: 2, bf16: 2, fp8: 1, awq: 0.5, gguf: 0.6, int8: 1, int4: 0.5 }[q.toLowerCase()];
                    if (bytesPerParam) {
                        var sizeGB = (paramsBNum * bytesPerParam).toFixed(1);
                        return qup + ' (~' + sizeGB + 'GB)';
                    }
                    return qup;
                });
                row('Quantizations', quantStrs);
            }
            if (anyProv) row('API providers', providers);

            enrichSlot.appendChild(card);
        });

        // ---- Strengths Radar Chart (NEW) ----
        try {
            // Categories to plot. Must match benchmark.category strings.
            var radarCats = [
                { key: 'reasoning', label: 'Reasoning' },
                { key: 'coding', label: 'Coding' },
                { key: 'math', label: 'Math' },
                { key: 'agent', label: 'Agent' },
                { key: 'multimodal', label: 'Multimodal' }
            ];

            // Group all scores by (model_id, category) → list of values
            var catScoresByModel = {};
            for (var si = 0; si < App.data.scores.length; si++) {
                var sc = App.data.scores[si];
                var bench = App.data.benchmarks.find(function (b) { return b.id === sc.benchmark_id; });
                if (!bench) continue;
                var cat = bench.category;
                if (!catScoresByModel[sc.model_id]) catScoresByModel[sc.model_id] = {};
                if (!catScoresByModel[sc.model_id][cat]) catScoresByModel[sc.model_id][cat] = [];
                catScoresByModel[sc.model_id][cat].push(sc.value);
            }
            function avg(arr) {
                if (!arr || !arr.length) return null;
                var s = 0;
                for (var i = 0; i < arr.length; i++) s += arr[i];
                return s / arr.length;
            }

            // For each category, compute target avg + sorted distribution of all models' avgs
            var distByCat = {};
            radarCats.forEach(function (rc) {
                var values = [];
                Object.keys(catScoresByModel).forEach(function (mid) {
                    var a = avg(catScoresByModel[mid][rc.key]);
                    if (a != null) values.push(a);
                });
                values.sort(function (a, b) { return a - b; });
                distByCat[rc.key] = values;
            });

            // Compute target's percentile per category
            var radarData = [];
            var radarIndicators = [];
            radarCats.forEach(function (rc) {
                var targetAvg = avg((catScoresByModel[modelId] || {})[rc.key]);
                if (targetAvg == null) return; // skip — no data for this category
                var dist = distByCat[rc.key];
                if (dist.length < 3) return; // skip — too few peers
                // Percentile = fraction of peers strictly less than target
                var below = 0;
                for (var di = 0; di < dist.length; di++) {
                    if (dist[di] < targetAvg) below++;
                }
                var pct = (below / dist.length) * 100;
                radarIndicators.push({ name: rc.label + ' (' + targetAvg.toFixed(0) + ')', max: 100 });
                radarData.push(pct);
            });

            if (radarIndicators.length >= 3) {
                var radarCard = document.createElement('div');
                radarCard.className = 'mb-4 bg-gray-800 rounded-lg p-4';
                var radarTitle = document.createElement('h3');
                radarTitle.className = 'text-sm font-semibold text-gray-300 mb-2';
                radarTitle.textContent = 'Strengths Radar (percentile vs all models)';
                radarCard.appendChild(radarTitle);

                var radarHost = document.createElement('div');
                radarHost.style.height = '280px';
                radarHost.style.width = '100%';
                radarCard.appendChild(radarHost);
                container.appendChild(radarCard);

                // Defer init until host is in DOM
                setTimeout(function () {
                    if (typeof echarts === 'undefined') return;
                    var chart = echarts.init(radarHost, 'dark');
                    chart.setOption({
                        backgroundColor: 'transparent',
                        tooltip: { trigger: 'item' },
                        radar: {
                            indicator: radarIndicators,
                            shape: 'polygon',
                            splitNumber: 4,
                            axisName: { color: '#d1d5db', fontSize: 11 },
                            splitLine: { lineStyle: { color: 'rgba(160,160,160,0.25)' } },
                            splitArea: { show: false },
                            axisLine: { lineStyle: { color: 'rgba(160,160,160,0.4)' } }
                        },
                        series: [{
                            type: 'radar',
                            data: [{
                                value: radarData,
                                name: model.name,
                                lineStyle: { width: 2 },
                                areaStyle: { opacity: 0.25 },
                                itemStyle: { color: '#60a5fa' }
                            }]
                        }]
                    });
                    // Resize handler
                    window.addEventListener('resize', function () { chart.resize(); });
                }, 0);
            }
        } catch (e) {
            console.warn('[modal] strengths radar error', e);
        }

        // ---- Score History Trend (Time-series, NEW) ----
        try {
            var historyDates = Object.keys(App.data.history || {}).sort();
            if (historyDates.length >= 2) {
                // Pick top 4 benchmarks (by descending value) for this model
                var modelScoresMap = {};
                for (var hsi = 0; hsi < App.data.scores.length; hsi++) {
                    var hs = App.data.scores[hsi];
                    if (hs.model_id === modelId) modelScoresMap[hs.benchmark_id] = hs.value;
                }
                var topBenches = Object.keys(modelScoresMap)
                    .sort(function (a, b) { return modelScoresMap[b] - modelScoresMap[a]; })
                    .slice(0, 4);

                if (topBenches.length >= 1) {
                    // Build series — for each top benchmark, value over time
                    var seriesData = topBenches.map(function (bid) {
                        var bench = App.data.benchmarks.find(function (b) { return b.id === bid; });
                        var name = bench ? bench.name : bid;
                        var pts = historyDates.map(function (dt) {
                            var snap = App.data.history[dt] || [];
                            var found = snap.find(function (x) { return x.model_id === modelId && x.benchmark_id === bid; });
                            return found ? found.value : null;
                        });
                        return { name: name, type: 'line', data: pts, connectNulls: true, smooth: true };
                    });

                    // Only render if at least one series has 2+ data points
                    var hasData = seriesData.some(function (s) {
                        return s.data.filter(function (v) { return v != null; }).length >= 2;
                    });
                    if (hasData) {
                        var historyCard = document.createElement('div');
                        historyCard.className = 'mb-4 bg-gray-800 rounded-lg p-4';
                        var historyTitle = document.createElement('h3');
                        historyTitle.className = 'text-sm font-semibold text-gray-300 mb-2';
                        historyTitle.textContent = 'Score History (top ' + topBenches.length + ' benchmarks)';
                        historyCard.appendChild(historyTitle);
                        var historyHost = document.createElement('div');
                        historyHost.style.height = '240px';
                        historyHost.style.width = '100%';
                        historyCard.appendChild(historyHost);
                        container.appendChild(historyCard);

                        setTimeout(function () {
                            if (typeof echarts === 'undefined') return;
                            var chart = echarts.init(historyHost, 'dark');
                            chart.setOption({
                                backgroundColor: 'transparent',
                                tooltip: { trigger: 'axis' },
                                legend: { textStyle: { color: '#d1d5db', fontSize: 10 }, top: 0 },
                                grid: { left: 40, right: 20, top: 30, bottom: 30 },
                                xAxis: {
                                    type: 'category',
                                    data: historyDates,
                                    axisLabel: { color: '#9ca3af', fontSize: 10 }
                                },
                                yAxis: {
                                    type: 'value',
                                    axisLabel: { color: '#9ca3af', fontSize: 10 },
                                    splitLine: { lineStyle: { color: 'rgba(160,160,160,0.15)' } }
                                },
                                series: seriesData
                            });
                            window.addEventListener('resize', function () { chart.resize(); });
                        }, 0);
                    }
                }
            }
        } catch (e) {
            console.warn('[modal] score history error', e);
        }

        var catOrder = ['reasoning', 'coding', 'math', 'cybersecurity', 'cyber_defense', 'agent', 'multimodal', 'multilingual', 'other'];
        var catNames = {
            reasoning: 'Reasoning', coding: 'Coding', math: 'Math',
            cybersecurity: 'Cybersecurity (Attack)', cyber_defense: 'Cyber Defense',
            agent: 'Agent', multimodal: 'Multimodal', multilingual: 'Multilingual', other: 'Other'
        };

        catOrder.forEach(function(cat) {
            var items = byCategory[cat];
            if (!items || items.length === 0) return;
            items.sort(function(a, b) { return b.score.value - a.score.value; });

            var section = document.createElement('div');
            section.className = 'mb-4';

            var h3 = document.createElement('h3');
            h3.className = 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2';
            h3.textContent = catNames[cat] || cat;
            section.appendChild(h3);

            items.forEach(function(item) {
                var row = document.createElement('div');
                row.className = 'flex items-center justify-between py-1.5 border-t border-gray-800 hover:bg-gray-800 rounded px-2 -mx-2 cursor-pointer transition';
                row.onclick = (function(bid) { return function() { Modal.showBenchmark(bid); }; })(item.bench ? item.bench.id : item.score.benchmark_id);

                var left = document.createElement('span');
                left.className = 'text-sm text-gray-300';
                left.textContent = item.bench ? item.bench.name : item.score.benchmark_id;
                row.appendChild(left);

                var right = document.createElement('div');
                right.className = 'flex items-center gap-2';

                var val = document.createElement('span');
                val.className = 'text-sm font-mono';
                val.className += item.score.is_sota ? ' text-green-400 font-bold' : ' text-gray-200';
                val.textContent = item.score.value > 500 ? Math.round(item.score.value) : item.score.value;
                right.appendChild(val);

                // NEW: 12-month rolling SOTA tier badge from peer-matcher
                var tier = (window.PeerMatcher && PeerMatcher.sotaTier)
                    ? PeerMatcher.sotaTier(item.score.value, modelId, item.score.benchmark_id, App.data.models, App.data.scores)
                    : null;
                if (tier) {
                    var tierBadge = document.createElement('span');
                    tierBadge.className = 'px-1.5 py-0.5 text-xs rounded';
                    if (tier.tier === 'sota') tierBadge.className += ' bg-yellow-900 text-yellow-300';
                    else if (tier.tier === 'top3') tierBadge.className += ' bg-gray-600 text-gray-100';
                    else if (tier.tier === 'top10') tierBadge.className += ' bg-gray-700 text-gray-200';
                    else tierBadge.className += ' bg-gray-800 text-gray-400';
                    tierBadge.textContent = tier.label;
                    tierBadge.title = tier.label + ' (' + tier.rank + '/' + tier.total + ')';
                    right.appendChild(tierBadge);
                }

                if (item.score.is_sota) {
                    var sotaBadge = document.createElement('span');
                    sotaBadge.className = 'px-1.5 py-0.5 bg-green-900 text-green-300 text-xs rounded';
                    sotaBadge.textContent = 'SOTA';
                    right.appendChild(sotaBadge);
                }

                var st = (item.score.source && item.score.source.type) || 'web';
                var publicUrl = Modal._sourceLink(item.score.source);
                var srcNode;
                if (publicUrl) {
                    srcNode = document.createElement('a');
                    srcNode.href = publicUrl;
                    srcNode.target = '_blank';
                    srcNode.rel = 'noopener noreferrer';
                    srcNode.className = 'text-xs ' + (st === 'pdf' ? 'text-purple-400' : 'text-blue-400') + ' hover:underline';
                    srcNode.textContent = st + ' \u2197';
                    srcNode.title = publicUrl;
                } else {
                    srcNode = document.createElement('span');
                    srcNode.className = 'text-xs ' + (st === 'pdf' ? 'text-purple-400' : 'text-gray-600');
                    srcNode.textContent = st;
                }
                right.appendChild(srcNode);

                row.appendChild(right);
                section.appendChild(row);
            });

            container.appendChild(section);
        });

        Modal._open();
    }
};
