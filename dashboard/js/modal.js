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

    init: function() {
        var base = window.location.pathname.indexOf('/dashboard/') !== -1 ? '../data' : 'data';
        fetch(base + '/bmt_connections.json').then(function(r) {
            return r.ok ? r.json() : {};
        }).then(function(d) { Modal._bmtData = d; }).catch(function() { Modal._bmtData = {}; });

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
        if (bmt.bmt_title || bmt.paper_link || bmt.github_link || bmt.description || bmt.year) {
            var metaDiv = document.createElement('div');
            metaDiv.className = 'bg-gray-800 rounded-lg p-4 mb-4 space-y-2';

            if (bmt.bmt_title) metaDiv.appendChild(this._makeLabel('Dataset', bmt.bmt_title));
            if (bmt.year) metaDiv.appendChild(this._makeLabel('Year', bmt.year));
            if (bmt.item_count) metaDiv.appendChild(this._makeLabel('Items', bmt.item_count));
            if (bmt.description) {
                var bmtDesc = document.createElement('div');
                bmtDesc.className = 'text-sm text-gray-400 mt-2';
                bmtDesc.textContent = bmt.description;
                metaDiv.appendChild(bmtDesc);
            }

            var linksDiv = document.createElement('div');
            linksDiv.className = 'flex gap-3 mt-3';
            if (bmt.paper_link) {
                var paperLink = document.createElement('a');
                paperLink.href = bmt.paper_link;
                paperLink.target = '_blank';
                paperLink.rel = 'noopener noreferrer';
                paperLink.className = 'inline-flex items-center gap-1 px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-200 text-xs rounded transition';
                paperLink.textContent = 'Paper';
                linksDiv.appendChild(paperLink);
            }
            if (bmt.github_link) {
                var ghLink = document.createElement('a');
                ghLink.href = bmt.github_link;
                ghLink.target = '_blank';
                ghLink.rel = 'noopener noreferrer';
                ghLink.className = 'inline-flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs rounded transition';
                ghLink.textContent = 'GitHub';
                linksDiv.appendChild(ghLink);
            }
            metaDiv.appendChild(linksDiv);
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

    showModel: function(modelId) {
        var model = App.data.models.find(function(m) { return m.id === modelId; });
        if (!model) return;
        history.replaceState(null, '', '#model/' + modelId);

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
