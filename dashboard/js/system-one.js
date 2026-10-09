/**
 * System One tab (S301) — decision models ("System One" models): typed yes/no / class / score answers instead of text.
 * Sections: 1. what a decision model is  2. Jev Decision Index text board  3. per-benchmark heatmap  4. vision board
 *           5. vendor / repo self-reported results (by benchmark-id prefix)  6. products & APIs  7. model registry
 * Data-driven from the App score index; all text via textContent; cells open Modal.showScoreSource.
 */
var SystemOne = {
    _initialized: false,
    _charts: [],
    DIX: { v: 'decision_index_v0_3', pub: 'decision_index_v0_3_public', same: 'decision_index_v0_3_same_skills', nd: 'decision_index_v0_3_new_domains',
           lat: 'decision_index_median_latency_ms_lower_better', ece: 'decision_index_ece_lower_better', brier: 'decision_index_brier_lower_better',
           vfull: 'decision_index_vision_full', vpub: 'decision_index_vision_public', vpriv: 'decision_index_vision_private',
           url: 'https://huggingface.co/spaces/multimodalart/jev-decision-index' },
    // headline per-benchmark columns for the heatmap (dix_* ids), grouped as on the board
    DIX_COLS: [
        ['tools', '도구 호출·라우팅', ['dix_bfcl', 'dix_toolret', 'dix_api_bank', 'dix_routerbench', 'dix_when2call', 'dix_home_appliances']],
        ['retrieval', '검색·분류', ['dix_banking77', 'dix_clinc150', 'dix_sgd', 'dix_amazon_esci', 'dix_bright', 'dix_hover', 'dix_phishnchips']],
        ['language', '언어 이해', ['dix_anli', 'dix_contractnli', 'dix_hellaswag', 'dix_ragtruth', 'dix_nli4ct', 'dix_finentity', 'dix_vast', 'dix_isarcasmeval', 'dix_acos']],
        ['knowledge', '지식·추론', ['dix_mmlu_pro', 'dix_mmlu', 'dix_gpqa_diamond', 'dix_gsm8k', 'dix_bbh', 'dix_musr', 'dix_cruxeval', 'dix_cladder', 'dix_chessbench', 'dix_hle', 'dix_winogrande', 'dix_sata_bench']],
        ['arts', '취향·창작 판단', ['dix_new_yorker', 'dix_humicroedit', 'dix_habermas', 'dix_bpomp', 'dix_pop909', 'dix_cfcolor']]
    ],
    // vendor / repo self-reported sections: benchmark-id prefixes → section (filled from the S301 reader outputs)
    SOURCES: [
        { prefix: ['cloudflare_dix_', 'cloudflare_typesafe_', 'cloudflare_decision_latency', 'cloudflare_domain'], title: 'Cloudflare Clef 발표 (2026-10-01) — Decision Index 10개 과제 · TypeSafe 워크플로 평가 · 지연',
          note: 'Cloudflare가 자체 환경에서 Clef(Qwen3.8-27B 고정 백본) · Clef-flash(Qwen3.5-9B)와 Jev · Kev 9B · Laya · DiffusionGemma Jev를 실행. 과제는 보드와 같지만 버전·조건이 달라 위 독립 보드와 별개입니다.', url: 'https://blog.cloudflare.com/clef-decision-models/', strip: /^Cloudflare-run — / },
        { prefix: ['fastino_dix_'], title: 'Fastino GLiDE (2026-09-30) — Decision Index 0.2.1 자체 실행', note: 'Fastino가 공식 채점기로 0.2.1 전체를 직접 실행(공개 보드 미등재). GLiDE 64.81 vs Jev 57.91. 영역별 값 일부는 발표 차트 이미지에서 읽었습니다.', url: 'https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model', strip: /^Fastino-run Decision Index 0.2.1 — / },
        { prefix: ['fastino_fast_decisions', 'fastino_gliner'], title: 'Fastino GLiNER2.5-Decide (2026-09-24) — Fast Decisions 17개 셋 · 하드웨어별 지연', note: '340M 인코더 결정 모델. Fastino 내부의 미공개 Fast Decisions 셋(5,100문항)에서 JevK5·SemIf·GLiFormer·Laya와 비교.', url: 'https://fastino.ai/blog/gliner-2-5-decide-open-weight-decision-model' },
        { prefix: ['kev_'], title: 'Kev (jaredpalmer/kev) — 자체 평가 · 서빙 지연', note: 'Qwen3.5 기반 0.8B/4B/9B(LoRA + 포인터 헤드)와 Qwen3.8-27B 전체 미세조정. 비교 대상 Jev는 버전 미표기 API.', url: 'https://github.com/jaredpalmer/kev', max: 14 },
        { prefix: ['jevbench_v1_4_'], title: 'JevBench v1.4 (von README에 재수록)', note: 'Jev 1.13과 오픈 모델을 같은 문항으로 비교한 커뮤니티 보드. Von은 로컬에서 다시 측정.', url: 'https://github.com/wfzyx/von' },
        { prefix: ['opendecider_', 'typed_decisions_opendecider'], title: 'opendecider — 보정된 System 1 결정 모델', note: '오픈 교사 모델에서 증류한 nano~large. Jev 1.13은 TypeSafe API로 직접 측정.', url: 'https://github.com/manjunathshiva/opendecider', max: 14 },
        { prefix: ['laya_', 'typed_decisions_laya'], title: 'Laya 모델 카드 — 워크플로 배터리 · 다국어 · T4 지연', note: 'Laya 세 체크포인트를 같은 질문으로 측정. 카드의 Jev 수치는 제3자 발표값이라 저장하지 않았습니다.', url: 'https://huggingface.co/convaiinnovations/laya', max: 16 },
        { prefix: ['clm_'], title: 'Contrastive-LM CLM-8B — 에이전트 과제 · 검증기', note: 'Qwen3-8B 고정 + 20M 대조 헤드. Jev(버전 미표기)와 같은 게임·도구 호출 과제에서 지연과 성공률 비교, DeepSWE·Terminal-Bench 2.1 검증기 결과.', url: 'https://github.com/contrastive-lm/clm' },
        { prefix: ['semif_'], title: 'SemIf (구 OpenJev) — 동결된 오픈 모델의 옵션 로짓', note: '직접 작성한 144개 결정과 TypeSafe 공개 102행 부분집합에서의 일치율.', url: 'https://github.com/TheoLeeCJ/SemIf-OpenJev' },
        { prefix: ['oaj_', 'typed_decisions_oaj'], title: 'open-alternative-jev (so1) — 오픈 LLM 한 번의 순전파로 타입 결정', note: '보통의 ChatML LLM에서 묶음 질문으로 결정 확률을 읽는 라이브러리. typed-decisions·RACE-H·MMLU 묶음 실험.', url: 'https://github.com/ikermoel/open-alternative-jev' },
        { prefix: ['gliclass_'], include: ['imdb_zeroshot_f1', 'sst2_zeroshot_f1', 'ag_news_zeroshot_f1', 'banking77_zeroshot_f1', 'emotion_zeroshot_f1', 'snips_zeroshot_f1', 'massive_zeroshot_f1', 'enron_spam_zeroshot_f1', 'financial_phrasebank_zeroshot_f1', 'rotten_tomatoes_zeroshot_f1', 'cr_zeroshot_f1', 'sst5_zeroshot_f1', 'cap_sotu_zeroshot_f1', '20_newsgroups_zeroshot_f1'],
          title: 'GLiClass v3.0 — 제로샷 분류기 14개 데이터셋 F1', note: '결정 모델의 선배 격인 단일 패스 제로샷 분류기(32.7M~439M). knowledgator 모델 카드 기준.', url: 'https://huggingface.co/knowledgator/gliclass-large-v3.0', max: 16 },
        { prefix: ['imdb_zero_shot', 'imdb_finetuned'], title: 'Raschka — IMDb 25,000건: Jev 제로샷 vs 미세조정 ModernBERT', note: 'Sebastian Raschka의 직접 실험(2026-09-29). Jev Choice 96.47%(25k 리뷰에 약 $0.65) vs 전체 길이로 미세조정한 ModernBERT-large 96.50%.', url: 'https://magazine.sebastianraschka.com/p/classifier-history-and-jev' },
        { prefix: ['openrouter_'], title: 'TypeSafe 발표 — LLM의 구조화 출력·도구 호출 오류율 (OpenRouter 데이터)', note: 'TypeSafe가 OpenRouter 데이터를 인용한 차트. Jev는 스키마가 보장되어 0%라 저장하지 않았습니다. luna/terra/sol = GPT-5.6 계열(발표일 2026-09-15 기준), astra = GPT-6 Astra.', url: 'https://typesafe.ai/blog/introducing-system-one-models-and-jev' }
    ],
    PRODUCTS: [
        { name: 'TypeSafe Jev', who: 'TypeSafe AI · 2026-09-15 발표 · API', what: '카테고리를 연 결정 모델. 예/아니오 확률(Noul)·선택(최대 255개)·점수 질문, 70–500 ms, 입력 100만 토큰당 $0.042, 출력 무료. 공개 벤치마크 결과는 일부러 내지 않음.', url: 'https://typesafe.ai/blog/introducing-system-one-models-and-jev' },
        { name: 'OpenAI Decisions API', who: 'OpenAI · 공개 베타', what: 'POST /v1/decisions, 모델은 gpt-6-luna 하나. 텍스트·이미지에 대한 predicate/choice/score 질문. Responses API보다 약 10배 빠르다고 주장, 입력 100만 토큰당 $0.10, 출력 과금 없음.', url: 'https://developers.openai.com/api/docs/guides/decisions' },
        { name: 'Perplexity Decisions API', who: 'Perplexity · pplx-decider-v1.1-27b', what: 'noul/choice/score 질문, 입력 100만 토큰당 $0.02. 질문 128개·보기 255개 한도. 가중치도 HF에 공개(Decision Index 상위권).', url: 'https://docs.perplexity.ai/docs/decisions/quickstart' },
        { name: 'Cloudflare Clef / Clef-flash', who: 'Cloudflare · 2026-10-01 · Apache-2.0', what: 'Qwen3.8-27B / Qwen3.5-9B 기반 오픈 결정 모델, Workers AI 호스팅, Jev API 호환, 이미지 입력, 64K 컨텍스트. RL 미세조정 서비스(RLCD)도 발표.', url: 'https://blog.cloudflare.com/clef-decision-models/' },
        { name: 'Fastino GLiDE · GLiNER2.5-Decide', who: 'Fastino · 2026-09-30 / 09-24', what: 'GLiDE는 적응형 추론을 하는 "생각하는" 결정 모델(API, 40K 컨텍스트). GLiNER2.5-Decide는 340M 오픈 인코더 결정 모델.', url: 'https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model' },
        { name: 'Databricks ai_decide', who: 'Databricks · 베타', what: 'SQL·REST로 거버넌스 데이터 위에서 결정을 내리는 AI Function. 바탕 모델 비공개, TypeSafe API 호환. 정량 수치 없음.', url: 'https://www.databricks.com/blog/introducing-aidecide-make-fast-decisions-your-governed-data' },
        { name: 'AutoTrust JEV-27B / -VL / -9B', who: 'AutoTrust AI Lab · 2026-09-29~30 · Apache-2.0', what: '고정한 Qwen3.8-27B 위에 108.9M 학습 블록을 얹어 Jev 1.13에서 증류. JEV-27B-VL은 Vision 보드 상위.', url: 'https://huggingface.co/autotrust/JEV-27B-VL' },
        { name: '오픈 복제 모델', who: 'kev · von · opendecider · CLM · SemIf · open-alternative-jev · Laya', what: 'Jev 공개 이틀 만에 6개 복제가 나왔고(AINews), 9월 말 GitHub 관련 저장소 1,142개(PyTorchKR 정리). 대부분 Qwen·ModernBERT 위에 결정 헤드를 얹고 Jev 출력으로 증류.', url: 'https://www.latent.space/p/ainews-here-are-6-clones-of-jev-in' },
        { name: '인접 분야', who: 'GLiClass · TabPFN · IBM ODM', what: '제로샷 분류기(GLiClass), 표 데이터 결정용 파운데이션 모델(TabPFN), 규칙 기반 의사결정 관리(IBM ODM, ML 모델 아님) — 비교 맥락용.', url: 'https://docs.priorlabs.ai/overview' }
    ],

    // ECharts renders tooltip strings as HTML — escape every data-derived string (model / vendor names come from external sources).
    _esc: function(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    _el: function(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; },
    _idx: function() { return (window.App && App.getScoreIndex) ? App.getScoreIndex() : null; },
    _val: function(mid, bid) { var i = this._idx(); var s = i && i.byModelBench[mid + '|' + bid]; return s ? s.value : null; },
    _bench: function(bid) { var i = this._idx(); return (i && i.byBench[bid]) || []; },
    _name: function(mid) { var m = this._models[mid]; return (m && m.name && m.name !== mid) ? m.name : mid.split('/').pop(); },
    _vendor: function(mid) { var m = this._models[mid]; return (m && m.vendor) || mid.split('/')[0]; },
    _chart: function(el, opt) { var c = echarts.init(el); c.setOption(opt); this._charts.push(c); return c; },
    _link: function(url, text) { var a = this._el('a', 'text-xs text-blue-400 hover:underline', text || '원문 ↗'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; return a; },
    _section: function(root, title, blurb) {
        var s = this._el('div', 'mb-10');
        s.appendChild(this._el('h2', 'text-section mb-2', title));
        if (blurb) s.appendChild(this._el('p', 'text-sm text-gray-400 mb-4', blurb));
        root.appendChild(s); return s;
    },
    _paramsB: function(mid) {
        var p = (this._models[mid] || {}).parameters; if (!p) return null;
        var m = String(p).match(/([\d.]+)\s*([BbMm])/); if (!m) return null;
        return parseFloat(m[1]) / (m[2].toLowerCase() === 'm' ? 1000 : 1);
    },
    _sizeColor: function(b) { if (b == null) return Theme.textDim; return b >= 20 ? Theme.series[3] : (b >= 6 ? Theme.series[2] : (b >= 1.5 ? Theme.series[1] : Theme.series[0])); },
    _cellColor: function(v, min, max, lower) {
        if (v == null || max === min) return Theme.textMuted;
        var t = (v - min) / (max - min); if (lower) t = 1 - t;
        var st = [[239, 68, 68], [245, 158, 11], [16, 185, 129]], a = t < 0.5 ? st[0] : st[1], b = t < 0.5 ? st[1] : st[2], u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
        return 'rgb(' + [0, 1, 2].map(function(k) { return Math.round(a[k] + (b[k] - a[k]) * u); }).join(',') + ')';
    },
    _heatTable: function(cols, opts) {
        var self = this; opts = opts || {};
        var cnt = {};
        cols.forEach(function(c) { self._bench(c[0]).forEach(function(s) { cnt[s.model_id] = (cnt[s.model_id] || 0) + 1; }); });
        var rows = opts.rows || Object.keys(cnt).filter(function(m) { return cnt[m] >= (opts.minCov || 1); });
        var st = {};
        cols.forEach(function(c) {
            var vs = rows.map(function(m) { return self._val(m, c[0]); }).filter(function(v) { return v != null; });
            st[c[0]] = { min: Math.min.apply(null, vs), max: Math.max.apply(null, vs), lower: c[2] != null ? c[2] : /_lower_better$/.test(c[0]) };
        });
        if (!opts.rows) {
            var sc = opts.sortBy || cols[0][0], sl = st[sc] && st[sc].lower;
            rows.sort(function(a, b) { var va = self._val(a, sc), vb = self._val(b, sc); if (va == null) return 1; if (vb == null) return -1; return sl ? va - vb : vb - va; });
        }
        if (opts.limit) rows = rows.slice(0, opts.limit);
        var w = this._el('div', 'overflow-x-auto'), t = this._el('table', 'sota-table text-xs'), th = this._el('thead'), hr = this._el('tr');
        hr.appendChild(this._el('th', null, 'Model'));
        if (opts.showParams) hr.appendChild(this._el('th', null, '크기'));
        cols.forEach(function(c) { var h = self._el('th', null, c[1]); h.style.whiteSpace = 'nowrap'; h.title = c[0]; hr.appendChild(h); });
        th.appendChild(hr); t.appendChild(th);
        var tb = this._el('tbody');
        rows.forEach(function(mid) {
            var tr = self._el('tr'), tn = self._el('td', null, self._name(mid));
            tn.style.whiteSpace = 'nowrap'; tn.style.cursor = 'pointer'; tn.title = mid + ' — ' + self._vendor(mid);
            tn.addEventListener('click', function() { if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(mid); });
            tr.appendChild(tn);
            if (opts.showParams) { var pb = self._paramsB(mid); var tp = self._el('td', null, pb == null ? '—' : (pb >= 1 ? pb.toFixed(pb >= 10 ? 0 : 1) + 'B' : Math.round(pb * 1000) + 'M')); tp.style.color = self._sizeColor(pb); tr.appendChild(tp); }
            cols.forEach(function(c) {
                var v = self._val(mid, c[0]), s = st[c[0]];
                var td = self._el('td', null, v == null ? '—' : (Math.abs(v) >= 100 ? v.toFixed(0) : (Math.abs(v) < 1 && v !== 0 ? v.toFixed(2) : v.toFixed(1))));
                td.style.textAlign = 'center';
                if (v == null) td.style.color = Theme.textDisabled;
                else {
                    td.style.color = self._cellColor(v, s.min, s.max, s.lower);
                    if (v === (s.lower ? s.min : s.max)) td.style.fontWeight = 'bold';
                    td.style.cursor = 'pointer'; td.title = '클릭하면 검증 소스';
                    td.addEventListener('click', function() { if (typeof Modal !== 'undefined' && Modal.showScoreSource) Modal.showScoreSource(mid, c[0]); });
                }
                tr.appendChild(td);
            });
            tb.appendChild(tr);
        });
        t.appendChild(tb); w.appendChild(t);
        return { el: w, n: rows.length };
    },
    _sizeLegend: function() {
        var self = this, d = this._el('div', 'flex flex-wrap gap-4 text-xs text-gray-400 mb-3');
        [[0.5, '< 1.5B'], [3, '1.5–6B'], [9, '6–20B'], [27, '≥ 20B'], [null, '크기 미상']].forEach(function(k) {
            var s = self._el('span'), dot = self._el('span', null, '●  '); dot.style.color = self._sizeColor(k[0]);
            s.appendChild(dot); s.appendChild(document.createTextNode(k[1])); d.appendChild(s);
        });
        return d;
    },

    render: function() {
        if (this._initialized) return;
        if (!window.App || !App.data || !App.data.scores || !App.data.scores.length || !this._idx()) return;
        var self = this, root = document.getElementById('system-one-content');
        if (!root) return;
        root.textContent = '';
        this._models = {}; (App.data.models || []).forEach(function(m) { self._models[m.id] = m; });
        this._renderGuide(root);
        this._renderBoard(root);
        this._renderHeat(root);
        this._renderVision(root);
        this._renderSources(root);
        this._renderProducts(root);
        this._renderRegistry(root);
        window.addEventListener('resize', function() { self._charts.forEach(function(c) { c.resize(); }); });
        this._initialized = true;
    },

    _renderGuide: function(root) {
        var self = this, g = this._el('div', 'grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8');
        [['결정 모델(System One)이란', [
            '질문과 상황(state)을 받아 글을 쓰는 대신 정해진 형식의 답 하나를 돌려주는 모델입니다. 예: "이 결제를 승인할까?" → 예일 확률 0.92.',
            '답의 형식(예/아니오 확률, 보기 중 하나, 점수, 순위)이 스키마로 보장되어 프로그램에 그대로 꽂아 쓸 수 있습니다.',
            '이름은 빠른 직관적 판단(System 1)과 느린 숙고(System 2)를 나눈 카너먼의 구분에서 왔습니다.']],
          ['LLM과 무엇이 다른가', [
            '토큰을 하나씩 생성하지 않고 한 번의 순전파로 결정을 내므로 수십 ms 안에 끝나고 호출당 비용이 낮습니다.',
            '확률이 실제 정답률과 맞는지(보정, calibration)가 중요합니다. ECE·Brier가 낮을수록 "0.9"라는 답을 믿을 수 있습니다.',
            '사전학습 분류기와 달리 질문을 바꿔도 다시 학습할 필요가 없는 제로샷 방식입니다. 그 대신 프롬프트 표현에 민감할 수 있습니다.']],
          ['이 탭의 데이터', [
            'TypeSafe AI가 2026년 9월 Jev를 공개한 뒤 공개 가중치 복제 모델과 클라우드 API가 쏟아졌습니다.',
            '독립 평가는 커뮤니티가 운영하는 Jev Decision Index(같은 GPU, 같은 문제, 비공개 테스트 포함)를 기준으로 삼았습니다.',
            '각 저장소·공급사가 자체 측정한 수치는 조건이 달라 별도 절로 분리했습니다.']]
        ].forEach(function(c) {
            var d = self._el('div', 'rounded-lg border border-gray-800 p-4 space-y-2');
            d.appendChild(self._el('h3', 'text-sm font-semibold text-gray-200', c[0]));
            c[1].forEach(function(p) { d.appendChild(self._el('p', 'text-sm text-gray-400 leading-relaxed', p)); });
            g.appendChild(d);
        });
        root.appendChild(g);
    },

    _renderBoard: function(root) {
        var self = this, D = this.DIX;
        var rows = this._bench(D.v).slice().sort(function(a, b) { return b.value - a.value; });
        if (!rows.length) return;
        var s = this._section(root, 'Jev Decision Index 0.3 — 결정 모델 독립 평가 (' + rows.length + '개 모델)',
            '커뮤니티 리더보드(HF Space multimodalart/jev-decision-index, 2026-10-07). 모든 모델을 RTX PRO 6000 한 장에서 같은 42개 벤치마크로 실행하고, 무작위 추측 대비 보정한 skill로 채점합니다. 종합 = 공개 벤치마크 20% + 같은 능력의 비공개 문제 50% + 새 영역 비공개 문제 30%. Jev는 TypeSafe API로 측정했습니다.');
        s.appendChild(this._sizeLegend());
        var top = rows.slice(0, 30);
        var c1 = this._el('div'); c1.style.height = '640px'; s.appendChild(c1);
        var names = top.map(function(r) { return self._name(r.model_id); });
        this._chart(c1, {
            backgroundColor: 'transparent',
            title: { text: '종합 점수 상위 30 (색 = 모델 크기)', textStyle: { color: Theme.textSecondary, fontSize: 13 } },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) {
                var mid = top[p[0].dataIndex].model_id, out = [names[p[0].dataIndex] + ' — ' + self._vendor(mid), '종합 ' + p[0].value];
                [[D.pub, '공개'], [D.same, '비공개(같은 능력)'], [D.nd, '비공개(새 영역)'], [D.lat, '중앙 지연 ms'], [D.ece, 'ECE×100']].forEach(function(x) { var v = self._val(mid, x[0]); if (v != null) out.push(x[1] + ' ' + v); });
                return out.map(self._esc).join('<br>'); } },
            grid: { left: 8, right: 40, top: 34, bottom: 8, containLabel: true },
            xAxis: { type: 'value', axisLabel: { color: Theme.textMuted }, splitLine: { lineStyle: { color: Theme.border } } },
            yAxis: { type: 'category', inverse: true, data: names, axisLabel: { color: Theme.textMuted, fontSize: 10 } },
            series: [{ type: 'bar', barWidth: '62%', data: top.map(function(r) { return { value: +r.value.toFixed(1), itemStyle: { color: self._sizeColor(self._paramsB(r.model_id)) } }; }),
                       label: { show: true, position: 'right', color: Theme.textMuted, fontSize: 10 } }]
        });
        // quality vs latency
        var pts = rows.map(function(r) { return { mid: r.model_id, v: r.value, lat: self._val(r.model_id, D.lat), p: self._paramsB(r.model_id) }; }).filter(function(p) { return p.lat != null && p.lat > 0; });
        var c2 = this._el('div', 'mt-6'); c2.style.height = '520px'; s.appendChild(c2);
        this._chart(c2, {
            backgroundColor: 'transparent',
            title: { text: '종합 점수 vs 중앙 지연 (왼쪽 위가 좋음, 점 크기 = 파라미터)', textStyle: { color: Theme.textSecondary, fontSize: 13 } },
            tooltip: { formatter: function(p) { var d = pts[p.dataIndex]; return self._esc(self._name(d.mid)) + '<br>종합 ' + d.v.toFixed(1) + ' · 지연 ' + d.lat + ' ms' + (d.p ? ' · ' + d.p + 'B' : ''); } },
            grid: { left: 50, right: 30, top: 46, bottom: 50 },
            xAxis: { type: 'log', min: 1, max: 1000, name: '중앙 지연 (ms, 로그 축)', nameLocation: 'middle', nameGap: 28, nameTextStyle: { color: Theme.textMuted }, axisLine: { show: true, lineStyle: { color: Theme.borderStrong } }, axisLabel: { color: Theme.textMuted }, splitLine: { lineStyle: { color: Theme.border } } },
            yAxis: { type: 'value', min: 0, axisLabel: { color: Theme.textMuted }, splitLine: { lineStyle: { color: Theme.border } } },
            series: [{ type: 'scatter', data: pts.map(function(d) { return { value: [d.lat, +d.v.toFixed(1)], symbolSize: d.p ? Math.max(6, Math.min(28, 5 + Math.sqrt(d.p) * 4)) : 6, itemStyle: { color: self._sizeColor(d.p), opacity: 0.85 } }; }),
                       label: { show: true, position: 'right', color: Theme.textDim, fontSize: 9, formatter: function(p) { var d = pts[p.dataIndex]; return d.v >= 58 || (d.lat <= 8 && d.v >= 2) || (d.v >= 45 && d.lat <= 30) ? self._name(d.mid) : ''; } } }]
        });
        var t = this._heatTable([[D.v, '종합'], [D.pub, '공개'], [D.same, '비공개·같은 능력'], [D.nd, '비공개·새 영역'], [D.ece, 'ECE×100'], [D.brier, 'Brier×100'], [D.lat, '중앙 지연 ms']], { sortBy: D.v, showParams: true });
        t.el.classList.add('mt-6'); s.appendChild(t.el);
        var f = this._el('p', 'text-xs text-gray-500 mt-2', '저장소나 조직이 확인되지 않는 익명 출품작은 제외했습니다. 지연은 보드 GPU에서 직접 서빙한 값이며 Jev만 API 왕복 시간입니다. ');
        f.appendChild(this._link(D.url, 'Jev Decision Index ↗')); s.appendChild(f);
    },

    _renderHeat: function(root) {
        var self = this, D = this.DIX;
        var s = this._section(root, '벤치마크별 점수 — 상위 모델 × 42개 과제', '같은 보드의 과제별 원점수(%)입니다. 원래는 LLM용인 MMLU·GPQA·GSM8K 같은 데이터셋도 결정 모델의 형식(보기 확률·예/아니오)으로 바꿔 풀게 한 값이라 LLM 리더보드 수치와 직접 비교할 수 없습니다.');
        var rows = this._bench(D.v).slice().sort(function(a, b) { return b.value - a.value; }).map(function(r) { return r.model_id; });
        var withDetail = rows.filter(function(m) { return self._val(m, 'dix_bfcl') != null || self._val(m, 'dix_mmlu_pro') != null; });
        if (this._val('typesafe/jev-1.13', 'dix_bfcl') != null && withDetail.indexOf('typesafe/jev-1.13') < 0) withDetail.unshift('typesafe/jev-1.13');
        this.DIX_COLS.forEach(function(g) {
            var cols = g[2].filter(function(id) { return self._bench(id).length; }).map(function(id) {
                var b = (App.data.benchmarks || []).find(function(x) { return x.id === id; });
                var lab = b ? b.name.replace('Jev Decision Index — ', '').replace(/\s*\(.*\)\s*$/, '') : id;
                return [id, lab];
            });
            if (!cols.length) return;
            s.appendChild(self._el('h3', 'text-sm font-semibold text-gray-200 mt-4 mb-1', g[1]));
            s.appendChild(self._heatTable(cols, { rows: withDetail, showParams: true }).el);
        });
    },

    _renderVision: function(root) {
        var self = this, D = this.DIX;
        var rows = this._bench(D.vfull).slice().sort(function(a, b) { return b.value - a.value; });
        if (!rows.length) return;
        var s = this._section(root, 'Jev Decision Index — Vision 보드 (' + rows.length + '개)', '이미지를 보고 결정하는 모델. 공개 비전 벤치마크(CV-Bench, BLINK, RealWorldQA, CharXiv, InfographicVQA, Mind2Web, Winoground, KIE, 혐오 밈 판별 등) 50% + 새 이미지로 만든 비공개 테스트 50%.');
        var vb = (App.data.benchmarks || []).filter(function(b) { return /^dix_vision_/.test(b.id) && self._bench(b.id).length; }).map(function(b) { return [b.id, b.name.replace('Jev Decision Index Vision — ', '').replace(' (public)', '')]; });
        var t = this._heatTable([[D.vfull, '종합'], [D.vpub, '공개'], [D.vpriv, '비공개']].concat(vb), { sortBy: D.vfull, showParams: true });
        s.appendChild(t.el);
    },

    _renderSources: function(root) {
        var self = this;
        if (!this.SOURCES.length) return;
        var s = this._section(root, '공급사·저장소가 직접 측정한 결과', '각 출처가 자체 조건(하드웨어, 프롬프트, 데이터 분할)으로 잰 값입니다. 출처끼리, 또는 위의 독립 보드와 직접 비교하지 마세요.');
        var allB = (App.data.benchmarks || []);
        this.SOURCES.forEach(function(src) {
            var cols = allB.filter(function(b) { return src.prefix.some(function(p) { return b.id.indexOf(p) === 0; }) && self._bench(b.id).length; })
                           .map(function(b) { return [b.id, b.name.replace(src.strip || /^$/, '')]; });
            if (src.include) src.include.forEach(function(id) { if (self._bench(id).length && !cols.some(function(c) { return c[0] === id; })) cols.push([id, id]); });
            if (!cols.length) return;
            if (src.max && cols.length > src.max) cols = cols.slice(0, src.max);
            var box = self._el('div', 'mb-8');
            box.appendChild(self._el('h3', 'text-sm font-semibold text-gray-200 mb-1', src.title));
            if (src.note) box.appendChild(self._el('p', 'text-xs text-gray-500 mb-2', src.note));
            box.appendChild(self._heatTable(cols, { showParams: true }).el);
            box.appendChild(self._link(src.url));
            s.appendChild(box);
        });
    },

    _renderProducts: function(root) {
        var self = this;
        if (!this.PRODUCTS.length) return;
        var s = this._section(root, '결정 모델 제품 · API · 오픈소스 지도', '공급사 API, 오픈 가중치 모델, 학습 레시피 저장소를 한눈에. 각 카드의 숫자는 원문에 적힌 사양입니다.');
        var g = this._el('div', 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4');
        this.PRODUCTS.forEach(function(p) {
            var c = self._el('div', 'rounded-lg border border-gray-800 p-4 space-y-1');
            c.appendChild(self._el('div', 'text-sm font-semibold text-gray-200', p.name));
            c.appendChild(self._el('div', 'text-xs text-gray-500', p.who));
            c.appendChild(self._el('p', 'text-sm text-gray-400', p.what));
            if (p.url) c.appendChild(self._link(p.url));
            g.appendChild(c);
        });
        s.appendChild(g);
    },

    _renderRegistry: function(root) {
        var self = this, i = this._idx();
        var ids = Object.keys(this._models).filter(function(id) { return self._models[id].type === 'decision'; });
        var s = this._section(root, '결정 모델 레지스트리 (' + ids.length + '개)', '종합 점수 순. 출시일은 원문이나 저장소에 적힌 경우만 표시합니다.');
        ids.sort(function(a, b) { var va = self._val(a, self.DIX.v), vb = self._val(b, self.DIX.v); if (va == null && vb == null) return a.localeCompare(b); if (va == null) return 1; if (vb == null) return -1; return vb - va; });
        var t = this._el('table', 'sota-table text-xs'), th = this._el('thead'), hr = this._el('tr');
        ['Model', 'Vendor', '파라미터', '출시', 'Decision Index', 'Vision', '점수 수'].forEach(function(h) { hr.appendChild(self._el('th', null, h)); });
        th.appendChild(hr); t.appendChild(th);
        var tb = this._el('tbody');
        ids.forEach(function(id) {
            var m = self._models[id], tr = self._el('tr');
            var tn = self._el('td', null, self._name(id)); tn.style.whiteSpace = 'nowrap'; tn.style.cursor = 'pointer'; tn.title = id;
            tn.addEventListener('click', function() { if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(id); });
            tr.appendChild(tn);
            tr.appendChild(self._el('td', null, m.vendor || ''));
            tr.appendChild(self._el('td', null, m.parameters || '—'));
            tr.appendChild(self._el('td', null, m.release_date || '—'));
            var v = self._val(id, self.DIX.v), vv = self._val(id, self.DIX.vfull);
            tr.appendChild(self._el('td', null, v == null ? '—' : v.toFixed(1)));
            tr.appendChild(self._el('td', null, vv == null ? '—' : vv.toFixed(1)));
            tr.appendChild(self._el('td', null, String(((i && i.byModel[id]) || []).length)));
            tb.appendChild(tr);
        });
        t.appendChild(tb);
        var w = this._el('div', 'overflow-x-auto'); w.appendChild(t); s.appendChild(w);
    }
};
