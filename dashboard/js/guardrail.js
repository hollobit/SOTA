/**
 * Guardrail tab (S300) — guardrail / safety-classifier models, guardrail benchmark datasets and results.
 * Data-driven from App.data.scores (score index). Sections:
 *   1. how to read the metrics   2. Artificial Analysis guardrail benchmark (F1 / recall / specificity / latency)
 *   3. vendor-run comparisons (GA Guard, Red Hat EvalHub, TrueFoundry)   4. paper result heatmaps
 *   5. agent tool-call guardrails (RAIL Guard)   6. benchmark dataset catalogue   7. guard model registry
 * All text goes through textContent; score cells open Modal.showScoreSource.
 */
var Guardrail = {
    _initialized: false,
    _charts: [],

    // Guard models that predate S300 (registered with other types) — the rest are type === 'guard'.
    EXTRA_GUARDS: ['openai/gpt-oss-safeguard-20b', 'mistral/shieldstral-1.0-3b', 'ai-singapore/sea-guard',
                   'qcri/fanar-2-27b-fanarguard-4b', 'typhoon-ai/thai-safety-classifier',
                   // decision models used as zero-shot guardrails (Red Hat EvalHub) — type 'decision' since S301
                   'typesafe/jev-1.13', 'convaiinnovations/laya'],
    // General LLMs that appear in guardrail comparisons as prompted baselines / judged agents.
    PROMPTED: { 'openai/gpt-oss-20b': 1, 'openai/gpt-oss-120b': 1, 'openai/gpt-5-high': 1, 'openai/gpt-5-mini': 1, 'alibaba/qwen3.6-35b-a3b': 1, 'google/diffusiongemma-26b-a4b': 1 },
    API_GUARDS: { 'openai/omni-moderation': 1, 'openai/text-moderation': 1, 'amazon/bedrock-guardrails': 1, 'microsoft/azure-ai-content-safety': 1,
                  'microsoft/azure-ai-language-pii': 1, 'google/vertex-ai-model-armor': 1, 'lakera/lakera-guard': 1, 'virtueai/virtueguard-text-lite': 1,
                  'pangea/ai-guard': 1, 'promptfoo/guardrails': 1, 'protectai/llm-guard-gpt-4o': 1, 'typesafe/jev-1.13': 1 },

    AA: {
        url: 'https://artificialanalysis.ai/articles/guardrail-safety-benchmark',
        avg: 'aa_guardrail_avg_f1', recall: 'aa_guardrail_recall', precision: 'aa_guardrail_precision', spec: 'aa_guardrail_specificity',
        lat: 'aa_guardrail_latency_ms_lower_better', p95: 'aa_guardrail_p95_latency_ms_lower_better', tok: 'aa_guardrail_output_tokens',
        ds: [{ k: 'wildguardtest', label: 'WildGuardTest' }, { k: 'toxicchat', label: 'ToxicChat' }, { k: 'xstest', label: 'XSTest' }]
    },

    PAPERS: [
        { key: 'guardsetx', title: 'GuardSet-X — 도메인별 정책 기반 가드레일 F1 (19 guards × 12 domains)', url: 'https://arxiv.org/abs/2506.19054',
          note: 'Table 1. 소셜미디어·규제(EU AI Act, GDPR)·HR·금융·법률·교육·코드·사이버 도메인별 실제 정책 문서에서 만든 위반/정상 샘플. 높을수록 좋음.',
          cols: [['guardsetx_social_messaging_f1', 'Social·Msg'], ['guardsetx_social_community_f1', 'Social·Comm'], ['guardsetx_social_streaming_f1', 'Social·Stream'],
                 ['guardsetx_regulation_eu_ai_act_f1', 'EU AI Act'], ['guardsetx_regulation_gdpr_f1', 'GDPR'], ['guardsetx_hr_service_f1', 'HR·Service'],
                 ['guardsetx_hr_customer_f1', 'HR·Customer'], ['guardsetx_finance_f1', 'Finance'], ['guardsetx_law_f1', 'Law'], ['guardsetx_education_f1', 'Education'],
                 ['guardsetx_code_f1', 'Code'], ['guardsetx_cyber_f1', 'Cyber']] },
        { key: 'guardsetx_asr', title: 'GuardSet-X — 탈옥 최적화 공격 성공률 (ASR, 낮을수록 좋음)', url: 'https://arxiv.org/abs/2506.19054',
          note: 'Table 2. 가드레일을 우회하도록 최적화한 공격 프롬프트의 성공률. 낮을수록 견고함.', lower: true,
          cols: [['guardsetx_social_messaging_asr_lower_better', 'Social·Msg'], ['guardsetx_social_community_asr_lower_better', 'Social·Comm'],
                 ['guardsetx_social_streaming_asr_lower_better', 'Social·Stream'], ['guardsetx_regulation_eu_ai_act_asr_lower_better', 'EU AI Act'],
                 ['guardsetx_regulation_gdpr_asr_lower_better', 'GDPR'], ['guardsetx_hr_asr_lower_better', 'HR'], ['guardsetx_finance_asr_lower_better', 'Finance'],
                 ['guardsetx_law_asr_lower_better', 'Law'], ['guardsetx_education_asr_lower_better', 'Education'], ['guardsetx_code_asr_lower_better', 'Code'],
                 ['guardsetx_cyber_asr_lower_better', 'Cyber'], ['guardsetx_average_asr_lower_better', 'Avg']] },
        { key: 'guardbench', title: 'GuardBench — 40개 안전 데이터셋 (11 guards, EMNLP 2024)', url: 'https://aclanthology.org/2024.emnlp-main.1022/',
          note: 'Table 3. 전부 유해인 데이터셋은 Recall, 혼합 데이터셋은 F1. 프롬프트(P) / 대화(C) 분류. PromptsEN/DE/FR/IT/ES·UnsafeQA는 GuardBench가 새로 만든 셋.',
          prefixCols: true },
        { key: 'csguard', title: 'CS-Guard — 코드 생성 보안 가드레일 (입력 분류기 ASR · 출력 분류기 F1)', url: 'https://arxiv.org/abs/2609.09798',
          note: 'Fig. 5/6. 악성코드 생성 요청(텍스트→코드)과 악성 코드 변환(코드→코드). L1 = 기본 프롬프트, L2 = 탈옥 7종 + FSA 평균. 입력 분류기는 ASR(낮을수록 좋음), 출력 분류기는 F1.',
          cols: [['csguard_inputclf_t2c_l1_asr_lower_better', '입력 ASR · T2C L1', true], ['csguard_inputclf_t2c_l2_avg_asr_lower_better', '입력 ASR · T2C L2', true],
                 ['csguard_inputclf_t2c_l2_fsa_asr_lower_better', '입력 ASR · FSA', true], ['csguard_inputclf_c2c_avg_asr_lower_better', '입력 ASR · C2C', true],
                 ['csguard_outputclf_t2c_l1_f1', '출력 F1 · T2C L1'], ['csguard_outputclf_t2c_l2_avg_f1', '출력 F1 · T2C L2'],
                 ['csguard_outputclf_t2c_l2_fsa_f1', '출력 F1 · FSA'], ['csguard_outputclf_c2c_avg_f1', '출력 F1 · C2C']] },
        { key: 'image', title: '이미지 가드레일 — SafeEditBench · UnsafeBench · LlavaGuardBench (arXiv 2603.01228)', url: 'https://arxiv.org/abs/2603.01228',
          note: 'SafeEditBench(정책 L1–L5를 편집해 같은 이미지의 정답이 바뀌는지) — 정책 적응력. UnsafeBench F1, LlavaGuardBench, 일반 능력 평균(MMMU·RealWorldQA·BLINK·MMT).',
          cols: [['safeeditbench_overall_f1', 'SafeEdit Overall'], ['safeeditbench_policy_l1_acc', 'SafeEdit L1 (acc)'], ['safeeditbench_policy_l3_f1', 'SafeEdit L3'],
                 ['safeeditbench_policy_l5_f1', 'SafeEdit L5'], ['unsafebench_f1', 'UnsafeBench'], ['unsafebench_f1_rerun_imageguard', 'UnsafeBench (재실행)'],
                 ['imageguard_llavaguardbench', 'LlavaGuardBench'], ['imageguard_general_avg', '일반 능력 평균']] }
    ],

    DATASETS: [
        { name: 'WildGuardTest', who: 'AI2 · NeurIPS 2024', size: '~1.7K', what: '프롬프트 유해성 · 응답 유해성 · 거절 3종 라벨. 합성+사람 작성.', prefix: ['wildguardtest_', 'aa_guardrail_wildguardtest'], url: 'https://huggingface.co/datasets/allenai/wildguardmix' },
        { name: 'ToxicChat', who: 'LMSYS · EMNLP 2023', size: '5.1K test', what: 'Vicuna 데모 실사용자 프롬프트, 유해 ~7%. 실제 트래픽 분포.', prefix: ['toxicchat_', 'aa_guardrail_toxicchat'], url: 'https://huggingface.co/datasets/lmsys/toxic-chat' },
        { name: 'XSTest', who: 'Röttger et al. · NAACL 2024', size: '450', what: '안전하지만 위험 단어가 들어간 250개 + 유해 200개 — 과잉 거절(over-refusal) 측정.', prefix: ['xstest_', 'aa_guardrail_xstest'], url: 'https://arxiv.org/abs/2308.01263' },
        { name: 'GuardBench', who: 'EC JRC (Bassani & Sanchez) · EMNLP 2024', size: '40 datasets', what: '프롬프트·대화 분류 40개 셋 통합 + 다국어(DE/FR/IT/ES) 신규 셋. 파이썬 라이브러리.', prefix: ['guardbench_', '_rerun_guardbench'], url: 'https://aclanthology.org/2024.emnlp-main.1022/' },
        { name: 'GuardSet-X', who: 'AI-Secure (구 PolyGuard) · arXiv 2506.19054', size: '8 domains · 150+ policies', what: '실제 기업·규제 정책 문서에서 위반/정상 질의·대화를 생성. 도메인·정책 출처별 F1과 탈옥 ASR.', prefix: ['guardsetx_'], url: 'https://arxiv.org/abs/2506.19054' },
        { name: 'CS-Guard', who: 'arXiv 2609.09798 (2026-09)', size: '1,000 + 331 prompts', what: '코드 생성 보안: 악성코드 요청(텍스트→코드)·악성 코드 완성/삽입/번역(코드→코드), 탈옥 7종 + 허구 시나리오 공격(FSA).', prefix: ['csguard_'], url: 'https://arxiv.org/abs/2609.09798' },
        { name: 'RAIL Guard', who: 'Responsible AI Labs · arXiv 2607.16215', size: '1,197 + 392', what: 'Pool A 콘텐츠 프롬프트(6 도메인, benign/edge/adversarial), Pool B 에이전트 도구 호출 시나리오(5 도메인). Apache-2.0.', prefix: ['railguard_'], url: 'https://huggingface.co/datasets/responsible-ai-labs/rail-guard-benchmark' },
        { name: 'SafeEditBench / UnsafeBench', who: 'Fudan·Tencent·PKU · arXiv 2603.01228', size: 'LlavaGuard test 기반', what: '같은 이미지에 정책만 바꿨을 때 판정이 따라 바뀌는지(정책 적응형 이미지 가드레일).', prefix: ['safeeditbench_', 'unsafebench_', 'imageguard_'], url: 'https://arxiv.org/abs/2603.01228' },
        { name: 'GA Jailbreak / Long Context Bench', who: 'General Analysis (2025-10)', size: '— / 1,500 traces', what: 'RL 공격 모델이 만든 분포 밖 탈옥 프롬프트, 평균 10.3K 토큰 에이전트 트레이스(절반에 주입·정책 위반).', prefix: ['ga_jailbreak_bench', 'ga_long_context_bench'], url: 'https://generalanalysis.com/blog/ga-guard-series' },
        { name: 'Red Hat EvalHub (NeMo Guardrails)', who: 'Red Hat AI Safety · 2026-10-02', size: 'class-balanced', what: '프롬프트 인젝션 · 콘텐츠 안전/욕설 두 과제를 NeMo Guardrails 안에서 정확도·지연으로 비교.', prefix: ['redhat_evalhub_'], url: 'https://developers.redhat.com/articles/2026/10/02/benchmarking-ai-decision-models-against-traditional-guardrails' },
        { name: 'TrueFoundry provider benchmark', who: 'TrueFoundry', size: '400 / task', what: 'PII · 콘텐츠 모더레이션 · 프롬프트 인젝션을 게이트웨이 하나로 동일 조건 비교.', prefix: ['truefoundry_'], url: 'https://www.truefoundry.com/blog/benchmarking-llm-guardrail-providers' }
    ],

    // ───────────────────────── helpers ─────────────────────────
    _el: function(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; },
    _idx: function() { return (window.App && App.getScoreIndex) ? App.getScoreIndex() : null; },
    _val: function(mid, bid) { var i = this._idx(); var s = i && i.byModelBench[mid + '|' + bid]; return s ? s.value : null; },
    _bench: function(bid) { var i = this._idx(); return (i && i.byBench[bid]) || []; },
    _name: function(mid) { var m = this._models[mid]; var n = (m && m.name && m.name !== mid) ? m.name : mid.split('/').pop(); return n; },
    _kind: function(mid) { return this.PROMPTED[mid] ? 'prompted' : (this.API_GUARDS[mid] ? 'api' : 'open'); },
    _kindColor: function(mid) { var k = this._kind(mid); return k === 'prompted' ? Theme.series[2] : (k === 'api' ? Theme.series[4] : Theme.series[0]); },
    _chart: function(el, opt) { var c = echarts.init(el); c.setOption(opt); this._charts.push(c); return c; },
    _cellColor: function(v, min, max, lower) {
        if (v == null || max === min) return Theme.textMuted;
        var t = (v - min) / (max - min); if (lower) t = 1 - t;
        var stops = [[239, 68, 68], [245, 158, 11], [16, 185, 129]];
        var a = t < 0.5 ? stops[0] : stops[1], b = t < 0.5 ? stops[1] : stops[2], u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
        return 'rgb(' + [0, 1, 2].map(function(k) { return Math.round(a[k] + (b[k] - a[k]) * u); }).join(',') + ')';
    },
    _section: function(root, title, blurb) {
        var s = this._el('div', 'mb-10');
        s.appendChild(this._el('h2', 'text-section mb-2', title));
        if (blurb) s.appendChild(this._el('p', 'text-sm text-gray-400 mb-4', blurb));
        root.appendChild(s); return s;
    },
    _link: function(url, text) { var a = this._el('a', 'text-xs text-blue-400 hover:underline', text || '원문 ↗'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; return a; },

    // Heatmap table: rows = models with >= minCov values, cols = [id, label, lowerOverride]
    _heatTable: function(cols, opts) {
        var self = this; opts = opts || {};
        var mids = {};
        cols.forEach(function(c) { self._bench(c[0]).forEach(function(s) { mids[s.model_id] = (mids[s.model_id] || 0) + 1; }); });
        var rows = Object.keys(mids).filter(function(m) { return mids[m] >= (opts.minCov || 1); });
        var stats = {};
        cols.forEach(function(c) {
            var vs = rows.map(function(m) { return self._val(m, c[0]); }).filter(function(v) { return v != null; });
            stats[c[0]] = { min: Math.min.apply(null, vs), max: Math.max.apply(null, vs), lower: c[2] != null ? c[2] : /_lower_better$/.test(c[0]) };
        });
        var sortCol = opts.sortBy || cols[0][0], sl = stats[sortCol] && stats[sortCol].lower;
        rows.sort(function(a, b) {
            var va = self._val(a, sortCol), vb = self._val(b, sortCol);
            if (va == null) return 1; if (vb == null) return -1;
            return sl ? va - vb : vb - va;
        });
        var wrap = this._el('div', 'overflow-x-auto');
        var t = this._el('table', 'sota-table text-xs'); var thead = this._el('thead'), hr = this._el('tr');
        hr.appendChild(this._el('th', null, 'Model'));
        cols.forEach(function(c) { var th = self._el('th', null, c[1]); th.style.whiteSpace = 'nowrap'; th.title = c[0]; hr.appendChild(th); });
        thead.appendChild(hr); t.appendChild(thead);
        var tb = this._el('tbody');
        rows.forEach(function(mid) {
            var tr = self._el('tr');
            var tn = self._el('td', null, self._name(mid)); tn.style.whiteSpace = 'nowrap'; tn.style.cursor = 'pointer'; tn.title = mid;
            tn.style.color = self._kindColor(mid);
            tn.addEventListener('click', function() { if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(mid); });
            tr.appendChild(tn);
            cols.forEach(function(c) {
                var v = self._val(mid, c[0]), st = stats[c[0]];
                var td = self._el('td', null, v == null ? '—' : (Math.abs(v) >= 100 ? v.toFixed(0) : (Math.abs(v) < 1 && v !== 0 ? v.toFixed(2) : v.toFixed(1))));
                td.style.textAlign = 'center';
                if (v == null) td.style.color = Theme.textDisabled;
                else {
                    td.style.color = self._cellColor(v, st.min, st.max, st.lower);
                    if (v === (st.lower ? st.min : st.max)) td.style.fontWeight = 'bold';
                    td.style.cursor = 'pointer'; td.title = '클릭하면 검증 소스';
                    td.addEventListener('click', function() { if (typeof Modal !== 'undefined' && Modal.showScoreSource) Modal.showScoreSource(mid, c[0]); });
                }
                tr.appendChild(td);
            });
            tb.appendChild(tr);
        });
        t.appendChild(tb); wrap.appendChild(t);
        return { el: wrap, n: rows.length };
    },

    _legend: function() {
        var self = this, d = this._el('div', 'flex flex-wrap gap-4 text-xs text-gray-400 mb-3');
        [['open', '오픈 가중치 가드 모델'], ['api', '관리형 API / 상용 가드'], ['prompted', '범용 LLM을 분류기로 프롬프트']].forEach(function(k) {
            var s = self._el('span'); var dot = self._el('span', null, '●  ');
            dot.style.color = k[0] === 'prompted' ? Theme.series[2] : (k[0] === 'api' ? Theme.series[4] : Theme.series[0]);
            s.appendChild(dot); s.appendChild(document.createTextNode(k[1])); d.appendChild(s);
        });
        return d;
    },

    // ───────────────────────── render ─────────────────────────
    render: function() {
        if (this._initialized) return;
        if (!window.App || !App.data || !App.data.scores || !App.data.scores.length || !this._idx()) return;
        var self = this, root = document.getElementById('guardrail-content');
        if (!root) return;
        root.textContent = '';
        this._models = {}; (App.data.models || []).forEach(function(m) { self._models[m.id] = m; });
        this._renderGuide(root);
        this._renderAA(root);
        this._renderVendor(root);
        this._renderPapers(root);
        this._renderAgent(root);
        this._renderDatasets(root);
        this._renderRegistry(root);
        window.addEventListener('resize', function() { self._charts.forEach(function(c) { c.resize(); }); });
        this._initialized = true;
    },

    _renderGuide: function(root) {
        var self = this;
        var g = this._el('div', 'grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8');
        var cards = [
            ['가드레일 모델이란', [
                '사용자 입력이나 모델 출력이 안전한지 판정만 하는 분류기입니다. 대화나 답변은 하지 않습니다.',
                '입력 가드는 탈옥·프롬프트 인젝션·개인정보 요청을 메인 모델 앞에서 막고, 출력 가드는 유해 응답·정보 유출을 사용자에게 가기 전에 막습니다.',
                '모든 요청에 붙기 때문에 정확도뿐 아니라 지연과 비용도 함께 봐야 합니다.']],
            ['지표 읽는 법', [
                'F1: 유해를 잘 잡으면서(재현율) 정상을 잘못 막지 않는(정밀도) 균형 점수. 높을수록 좋습니다.',
                '재현율(recall): 유해 콘텐츠 중 잡아낸 비율. 의료·아동 안전처럼 한 번의 누락도 치명적이면 이 값을 우선합니다.',
                '특이도(specificity): 정상 콘텐츠를 통과시킨 비율. 100 − 특이도 = 과잉 거절률. 소비자 챗·창작 도구는 이 값이 중요합니다.',
                'ASR(공격 성공률)·FPR(오탐률)·지연(ms)은 낮을수록 좋습니다. 벤더가 직접 돌린 비교(GA·TrueFoundry·DeepRails)는 자사에 유리한 조건일 수 있어 독립 평가(AA·Red Hat·논문)와 따로 표시합니다.']]
        ];
        cards.forEach(function(c) {
            var d = self._el('div', 'rounded-lg border border-gray-800 p-4 space-y-2');
            d.appendChild(self._el('h3', 'text-sm font-semibold text-gray-200', c[0]));
            c[1].forEach(function(p) { d.appendChild(self._el('p', 'text-sm text-gray-400 leading-relaxed', p)); });
            g.appendChild(d);
        });
        root.appendChild(g);
    },

    _renderAA: function(root) {
        var self = this, A = this.AA;
        var rows = this._bench(A.avg).slice().sort(function(a, b) { return b.value - a.value; });
        if (!rows.length) return;
        var s = this._section(root, 'Artificial Analysis 가드레일 벤치마크 — 안전성 · 과잉 거절 · 지연',
            '2026-06-11, NVIDIA 협력. ' + rows.length + '개 구성(전문 가드 모델, 모더레이션 API, 범용 gpt-oss를 분류기로 프롬프트)에 WildGuardTest 프롬프트 유해성(1,699) · ToxicChat(5,083) · XSTest(450)를 동일 조건(temperature 0, 프롬프트 단위)으로 실행. 헤드라인 = 세 데이터셋 F1 평균. 지연은 B200 자체 호스팅에서 450개 요청을 하나씩 측정(omni-moderation만 OpenAI API).');
        s.appendChild(this._legend());
        var grid = this._el('div', 'grid grid-cols-1 xl:grid-cols-2 gap-6');
        var c1 = this._el('div'); c1.style.height = '520px';
        var c2 = this._el('div'); c2.style.height = '520px';
        grid.appendChild(c1); grid.appendChild(c2); s.appendChild(grid);
        var names = rows.map(function(r) { return self._name(r.model_id); });
        this._chart(c1, {
            backgroundColor: 'transparent',
            title: { text: '평균 F1 (높을수록 좋음)', textStyle: { color: Theme.textSecondary, fontSize: 13 } },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) {
                var mid = rows[p[0].dataIndex].model_id; var out = [names[p[0].dataIndex], '평균 F1 ' + p[0].value];
                A.ds.forEach(function(d) { var v = self._val(mid, 'aa_guardrail_' + d.k + '_f1'); if (v != null) out.push(d.label + ' F1 ' + v.toFixed(1)); });
                var l = self._val(mid, A.lat); if (l != null) out.push('지연 ' + l.toFixed(0) + ' ms');
                return out.join('<br>'); } },
            grid: { left: 8, right: 30, top: 34, bottom: 8, containLabel: true },
            xAxis: { type: 'value', min: 50, max: 100, axisLabel: { color: Theme.textMuted }, splitLine: { lineStyle: { color: Theme.border } } },
            yAxis: { type: 'category', inverse: true, data: names, axisLabel: { color: Theme.textMuted, fontSize: 10 } },
            series: [{ type: 'bar', barWidth: '62%', data: rows.map(function(r) { return { value: +r.value.toFixed(1), itemStyle: { color: self._kindColor(r.model_id) } }; }),
                       label: { show: true, position: 'right', color: Theme.textMuted, fontSize: 10 } }]
        });
        // F1 vs latency (log x)
        var pts = rows.map(function(r) { return { mid: r.model_id, f1: r.value, lat: self._val(r.model_id, A.lat) }; }).filter(function(p) { return p.lat != null; });
        this._chart(c2, {
            backgroundColor: 'transparent',
            title: { text: '탐지 품질 vs 지연 (왼쪽 위가 좋음)', textStyle: { color: Theme.textSecondary, fontSize: 13 } },
            tooltip: { formatter: function(p) { var d = pts[p.dataIndex]; return self._name(d.mid) + '<br>F1 ' + d.f1.toFixed(1) + ' · 평균 지연 ' + d.lat.toFixed(0) + ' ms'; } },
            grid: { left: 50, right: 30, top: 40, bottom: 50 },
            xAxis: { type: 'log', logBase: 10, min: 10, max: 3000, name: '평균 지연 (ms, 로그 축)', nameLocation: 'middle', nameGap: 28, nameTextStyle: { color: Theme.textMuted },
                     axisLine: { show: true, lineStyle: { color: Theme.borderStrong } }, axisLabel: { show: true, color: Theme.textMuted, formatter: function(v) { return v >= 1000 ? (v / 1000) + 's' : v + 'ms'; } }, splitLine: { lineStyle: { color: Theme.border } } },
            yAxis: { type: 'value', min: 60, max: 95, axisLabel: { color: Theme.textMuted }, splitLine: { lineStyle: { color: Theme.border } } },
            series: [{ type: 'scatter', symbolSize: 11, data: pts.map(function(d) { return { value: [d.lat, +d.f1.toFixed(1)], itemStyle: { color: self._kindColor(d.mid) } }; }),
                       label: { show: true, position: 'right', color: Theme.textDim, fontSize: 9, formatter: function(p) { var n = self._name(pts[p.dataIndex].mid); return n.length > 22 ? n.slice(0, 21) + '…' : n; } } }]
        });
        // Recall vs specificity
        var c3 = this._el('div'); c3.style.height = '480px'; c3.className = 'mt-6';
        s.appendChild(c3);
        var rs = rows.map(function(r) { return { mid: r.model_id, rec: self._val(r.model_id, A.recall), sp: self._val(r.model_id, A.spec) }; }).filter(function(p) { return p.rec != null && p.sp != null; });
        this._chart(c3, {
            backgroundColor: 'transparent',
            title: { text: '유해 탐지(재현율) vs 정상 통과(특이도) — 오른쪽 위가 좋음. 위쪽 = 엄격형, 오른쪽 = 관대형', textStyle: { color: Theme.textSecondary, fontSize: 13 } },
            tooltip: { formatter: function(p) { var d = rs[p.dataIndex]; return self._name(d.mid) + '<br>재현율 ' + d.rec.toFixed(1) + ' · 특이도 ' + d.sp.toFixed(1) + '<br>과잉 거절률 ' + (100 - d.sp).toFixed(1) + '%'; } },
            grid: { left: 50, right: 40, top: 70, bottom: 40 },
            xAxis: { type: 'value', name: '특이도 (정상 통과, %)', min: 80, max: 100, nameLocation: 'middle', nameGap: 26, nameTextStyle: { color: Theme.textMuted }, axisLabel: { color: Theme.textMuted }, splitLine: { lineStyle: { color: Theme.border } } },
            yAxis: { type: 'value', name: '재현율 (유해 탐지, %)', min: 30, max: 100, nameGap: 14, nameTextStyle: { color: Theme.textMuted, align: 'left' }, axisLabel: { color: Theme.textMuted }, splitLine: { lineStyle: { color: Theme.border } } },
            series: [{ type: 'scatter', symbolSize: 11, data: rs.map(function(d) { return { value: [+d.sp.toFixed(1), +d.rec.toFixed(1)], itemStyle: { color: self._kindColor(d.mid) } }; }),
                       label: { show: true, position: 'right', color: Theme.textDim, fontSize: 9, formatter: function(p) { var n = self._name(rs[p.dataIndex].mid); return n.length > 22 ? n.slice(0, 21) + '…' : n; } } }]
        });
        // Table
        var cols = [[A.avg, '평균 F1'], ['aa_guardrail_wildguardtest_f1', 'WildGuardTest F1'], ['aa_guardrail_toxicchat_f1', 'ToxicChat F1'], ['aa_guardrail_xstest_f1', 'XSTest F1'],
                    [A.recall, '재현율'], [A.precision, '정밀도'], [A.spec, '특이도'], ['aa_guardrail_xstest_specificity', 'XSTest 특이도'],
                    [A.lat, '평균 지연 ms'], [A.p95, 'p95 ms'], [A.tok, '출력 토큰', true]];
        var t = this._heatTable(cols, { sortBy: A.avg });
        t.el.classList.add('mt-6'); s.appendChild(t.el);
        var foot = this._el('p', 'text-xs text-gray-500 mt-2', 'gpt-oss-20B / 120B (Prompted)는 AA가 쓴 짧은 분류 지시문으로 돌린 탐색용 기준선이며 공식 안전 분류기 구성이 아닙니다. 출력 토큰은 판정 1건당 생성 토큰 수로, 적을수록 비용·지연이 낮습니다(추론형 가드는 100–330개). ');
        foot.appendChild(this._link(A.url, 'AA 원문 ↗')); s.appendChild(foot);
    },

    _renderVendor: function(root) {
        var self = this;
        var s = this._section(root, '공급사·플랫폼이 직접 돌린 비교', '아래 수치는 가드 제공사나 플랫폼이 자체 조건으로 측정한 결과입니다. 같은 공개 데이터셋 이름이라도 하네스·프롬프트·정책이 달라 다른 출처의 수치와 직접 비교하지 마세요.');
        // GA Guard
        var ga = this._el('div', 'mb-8');
        ga.appendChild(this._el('h3', 'text-sm font-semibold text-gray-200 mb-1', 'General Analysis GA Guard 시리즈 (2025-10, 14개 가드)'));
        ga.appendChild(this._el('p', 'text-xs text-gray-500 mb-2', 'GA가 클라우드 가드(AWS·Azure·Vertex·Lakera)와 오픈 가드를 직접 실행. GA Jailbreak Bench는 GA의 RL 공격 모델이 만든 새 탈옥 프롬프트, Long Context Bench는 평균 10.3K 토큰 에이전트 트레이스입니다.'));
        var gt = this._heatTable([['ga_guard_eval_openai_moderation_f1', 'OpenAI Mod F1'], ['ga_guard_eval_wildguard_f1', 'WildGuard F1'], ['ga_guard_eval_harmbench_behaviors_f1', 'HarmBench F1'],
            ['ga_jailbreak_bench_f1', 'GA Jailbreak F1'], ['ga_jailbreak_bench_fpr_lower_better', 'GA Jailbreak FPR'], ['ga_long_context_bench_f1', 'Long Ctx F1'],
            ['ga_long_context_bench_fpr_lower_better', 'Long Ctx FPR'], ['ga_guard_eval_avg_time_s_lower_better', '평균 시간 s']], { sortBy: 'ga_jailbreak_bench_f1' });
        ga.appendChild(gt.el); ga.appendChild(this._link('https://generalanalysis.com/blog/ga-guard-series', 'GA Guard 원문 ↗'));
        s.appendChild(ga);
        // Red Hat
        var rh = this._el('div', 'mb-8');
        rh.appendChild(this._el('h3', 'text-sm font-semibold text-gray-200 mb-1', 'Red Hat EvalHub — 결정 모델(Jev류) vs 전통 가드레일 (2026-10-02)'));
        rh.appendChild(this._el('p', 'text-xs text-gray-500 mb-2', 'NeMo Guardrails 안에서 9가지 방식을 비교: 사전학습 소형 분류기(OpenShift AI 기본), BART-MNLI 제로샷, LLM-as-a-judge(Nemotron 3.5 기본/맞춤 정책, Qwen3.6-35B), Jev·Laya·DiffusionGemma 결정 모델. Shieldstral은 원문 본문 표와 부록 표에서 과제별 수치가 뒤바뀌어 있어 제외했습니다.'));
        var rt = this._heatTable([['redhat_evalhub_prompt_injection_acc', '인젝션 정확도'], ['redhat_evalhub_prompt_injection_blocked_f1', '인젝션 차단 F1'],
            ['redhat_evalhub_prompt_injection_median_latency_ms_lower_better', '인젝션 중앙 지연 ms'], ['redhat_evalhub_content_safety_acc', '콘텐츠 안전 정확도'],
            ['redhat_evalhub_content_safety_blocked_f1', '콘텐츠 차단 F1'], ['redhat_evalhub_content_safety_median_latency_ms_lower_better', '콘텐츠 중앙 지연 ms']], { sortBy: 'redhat_evalhub_content_safety_acc' });
        rh.appendChild(rt.el); rh.appendChild(this._link('https://developers.redhat.com/articles/2026/10/02/benchmarking-ai-decision-models-against-traditional-guardrails', 'Red Hat 원문 ↗'));
        s.appendChild(rh);
        // TrueFoundry
        var tf = this._el('div', 'mb-4');
        tf.appendChild(this._el('h3', 'text-sm font-semibold text-gray-200 mb-1', 'TrueFoundry AI Gateway — 과제별 제공사 비교 (과제당 400개)'));
        var tt = this._heatTable([['truefoundry_content_moderation_f1', '모더레이션 F1'], ['truefoundry_content_moderation_latency_ms_lower_better', '모더레이션 ms'],
            ['truefoundry_pii_f1', 'PII F1'], ['truefoundry_pii_latency_ms_lower_better', 'PII ms'], ['truefoundry_prompt_injection_f1', '인젝션 F1'],
            ['truefoundry_prompt_injection_recall', '인젝션 재현율'], ['truefoundry_prompt_injection_latency_ms_lower_better', '인젝션 ms']]);
        tf.appendChild(tt.el);
        var tfp = this._el('p', 'text-xs text-gray-500 mt-2', 'DeepRails vs AWS Bedrock 비교(60쌍, 상대 개선율 +37~53%만 공개)는 절대 수치가 없어 저장하지 않았습니다. ');
        tfp.appendChild(this._link('https://www.truefoundry.com/blog/benchmarking-llm-guardrail-providers', 'TrueFoundry 원문 ↗'));
        tf.appendChild(tfp); s.appendChild(tf);
    },

    _renderPapers: function(root) {
        var self = this;
        var s = this._section(root, '논문 벤치마크 결과', '모든 수치는 논문 PDF의 표·그림 숫자 줄과 기계 대조해 확인했습니다. 셀을 누르면 근거 줄이 나옵니다.');
        s.appendChild(this._legend());
        this.PAPERS.forEach(function(p) {
            var box = self._el('div', 'mb-8');
            box.appendChild(self._el('h3', 'text-sm font-semibold text-gray-200 mb-1', p.title));
            box.appendChild(self._el('p', 'text-xs text-gray-500 mb-2', p.note));
            var cols = p.cols;
            if (p.prefixCols) {
                var seen = {}; cols = [];
                (App.data.benchmarks || []).forEach(function(b) {
                    if ((/^guardbench_/.test(b.id) || /_rerun_guardbench$/.test(b.id)) && !seen[b.id] && self._bench(b.id).length) {
                        seen[b.id] = 1;
                        var lab = b.id.replace(/^guardbench_/, '').replace(/_rerun_guardbench$/, '').replace(/^prompt_/, 'P·').replace(/^conv_/, 'C·').replace(/_(recall|f1)$/, '').replace(/_prompt$|_response$/, '').replace(/_/g, ' ');
                        cols.push([b.id, lab]);
                    }
                });
            }
            var sb = p.sortBy || (cols[cols.length - 1][0] === 'guardsetx_average_asr_lower_better' ? 'guardsetx_average_asr_lower_better' : cols[0][0]);
            var t = self._heatTable(cols, { sortBy: sb });
            box.appendChild(t.el);
            box.appendChild(self._link(p.url, '논문 ↗'));
            s.appendChild(box);
        });
    },

    _renderAgent: function(root) {
        var self = this;
        var conds = [['railguard_unsafe_tool_exec_no_guardrail_lower_better', '가드레일 없음'], ['railguard_unsafe_tool_exec_text_only_eval_lower_better', '텍스트만 평가'],
                     ['railguard_unsafe_tool_exec_pre_action_eval_lower_better', '실행 전 평가'], ['railguard_unsafe_tool_exec_pre_action_remediation_lower_better', '실행 전 평가 + 계획 수정']];
        var mids = {}; conds.forEach(function(c) { self._bench(c[0]).forEach(function(r) { mids[r.model_id] = 1; }); });
        mids = Object.keys(mids); if (!mids.length) return;
        var s = this._section(root, '에이전트 도구 호출 가드레일 — RAIL Guard (arXiv 2607.16215)',
            '에이전트가 위험한 도구 호출(권한 변경, 송금, 파일 삭제 등)을 실제로 실행한 비율. 텍스트로는 거절하면서 도구는 실행하는 경우(GAP)도 확인합니다. 낮을수록 좋습니다. 모델당 조건별 400회 실행.');
        var c = this._el('div'); c.style.height = '360px'; s.appendChild(c);
        this._chart(c, {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: mids.map(function(m) { return self._name(m); }), textStyle: { color: Theme.textMuted, fontSize: 11 }, top: 0 },
            grid: { left: 40, right: 20, top: 40, bottom: 30 },
            xAxis: { type: 'category', data: conds.map(function(x) { return x[1]; }), axisLabel: { color: Theme.textMuted } },
            yAxis: { type: 'value', name: '위험 실행률 %', nameTextStyle: { color: Theme.textMuted }, axisLabel: { color: Theme.textMuted }, splitLine: { lineStyle: { color: Theme.border } } },
            series: mids.map(function(m, i) { return { name: self._name(m), type: 'bar', itemStyle: { color: Theme.series[i % Theme.series.length] },
                data: conds.map(function(x) { return self._val(m, x[0]); }), label: { show: true, position: 'top', color: Theme.textDim, fontSize: 9 } }; })
        });
        var t = this._heatTable([['railguard_content_failure_rate_overall_lower_better', '콘텐츠 실패율 전체'], ['railguard_content_failure_rate_code_lower_better', '코드'],
            ['railguard_content_failure_rate_legal_lower_better', '법률'], ['railguard_content_failure_rate_finance_lower_better', '금융'],
            ['railguard_content_failure_rate_healthcare_lower_better', '의료'], ['railguard_content_failure_rate_education_lower_better', '교육'],
            ['railguard_content_failure_rate_customer_support_lower_better', '고객지원']]);
        s.appendChild(this._el('p', 'text-xs text-gray-500 mt-4 mb-2', 'Pool A 콘텐츠 실패율: 8개 책임 AI 차원 종합 점수가 7.0 미만인 응답 비율(%). 코드 생성이 모든 모델에서 가장 취약합니다.'));
        s.appendChild(t.el);
    },

    _renderDatasets: function(root) {
        var self = this;
        var s = this._section(root, '가드레일 벤치마크 데이터셋', '이 탭에 결과가 들어 있는 평가 데이터셋입니다. 숫자는 현재 DB에 저장된 벤치마크 id 수와 점수가 있는 모델 수입니다.');
        var g = this._el('div', 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4');
        var allB = (App.data.benchmarks || []).map(function(b) { return b.id; });
        this.DATASETS.forEach(function(d) {
            var ids = allB.filter(function(id) { return d.prefix.some(function(p) { return p.charAt(0) === '_' ? id.slice(-p.length) === p : id.indexOf(p) === 0; }); });
            var ms = {}; ids.forEach(function(id) { self._bench(id).forEach(function(r) { ms[r.model_id] = 1; }); });
            var c = self._el('div', 'rounded-lg border border-gray-800 p-4 space-y-1');
            c.appendChild(self._el('div', 'text-sm font-semibold text-gray-200', d.name));
            c.appendChild(self._el('div', 'text-xs text-gray-500', d.who + ' · ' + d.size));
            c.appendChild(self._el('p', 'text-sm text-gray-400', d.what));
            c.appendChild(self._el('div', 'text-xs text-gray-500', '벤치마크 id ' + ids.length + '개 · 점수 있는 모델 ' + Object.keys(ms).length + '개'));
            c.appendChild(self._link(d.url));
            g.appendChild(c);
        });
        s.appendChild(g);
    },

    _renderRegistry: function(root) {
        var self = this;
        var ids = Object.keys(this._models).filter(function(id) { return self._models[id].type === 'guard'; }).concat(this.EXTRA_GUARDS.filter(function(id) { return self._models[id]; }));
        var s = this._section(root, '가드레일 모델 레지스트리 (' + ids.length + '개)', '오픈 가중치 가드 모델, 관리형 가드 API, 정책 적응형 이미지 가드를 포함합니다. 출시일은 Hugging Face 저장소 생성일 또는 공급사 발표일이며, API 서비스는 비워 두었습니다.');
        var i = this._idx();
        ids.sort(function(a, b) { return (self._models[b].release_date || '').localeCompare(self._models[a].release_date || ''); });
        var t = this._el('table', 'sota-table text-xs'), th = this._el('thead'), hr = this._el('tr');
        ['Model', '구분', 'Vendor', '파라미터', '출시', 'AA 평균 F1', '점수 수'].forEach(function(h) { hr.appendChild(self._el('th', null, h)); });
        th.appendChild(hr); t.appendChild(th);
        var tb = this._el('tbody');
        ids.forEach(function(id) {
            var m = self._models[id], tr = self._el('tr');
            var tn = self._el('td', null, self._name(id)); tn.style.cursor = 'pointer'; tn.style.whiteSpace = 'nowrap'; tn.style.color = self._kindColor(id); tn.title = id;
            tn.addEventListener('click', function() { if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(id); });
            tr.appendChild(tn);
            tr.appendChild(self._el('td', null, self.API_GUARDS[id] ? 'API' : '오픈 가중치'));
            tr.appendChild(self._el('td', null, m.vendor || ''));
            tr.appendChild(self._el('td', null, m.parameters || '—'));
            tr.appendChild(self._el('td', null, m.release_date || '—'));
            var f = self._val(id, self.AA.avg); tr.appendChild(self._el('td', null, f == null ? '—' : f.toFixed(1)));
            tr.appendChild(self._el('td', null, String(((i && i.byModel[id]) || []).length)));
            tb.appendChild(tr);
        });
        t.appendChild(tb);
        var w = this._el('div', 'overflow-x-auto'); w.appendChild(t); s.appendChild(w);
    }
};
