/**
 * Cyber & Coding tab: renders cybersecurity attack and coding capability views.
 */
var CyberCoding = {
    CYBER_BENCHMARKS: ['cybench', 'cvebench', 'cybergym', 'evmbench_exploit', 'evmbench_detect', 'airtbench', 'firefox_147', 'cyber_range'],
    DEFENSE_BENCHMARKS: ['autopatchbench', 'cybersoceval', 'zerodaybench', 'evmbench_patch', 'dfir_metric'],
    AGENT_BENCHMARKS: ['osworld_verified', 'gaia', 'browsecomp', 'tau_bench', 'tau2_bench', 'webarena', 'deepsearchqa', 'mcp_atlas'],
    CODING_BENCHMARKS: ['swe_bench_verified', 'swe_bench_pro', 'terminal_bench_2', 'livecodebench'],

    BENCH_DESCRIPTIONS: {
        cybench: {
            name: 'Cybench (CTF)',
            desc: '40개 professional-level CTF 과제 (crypto, web, reversing, forensics, exploitation). 에이전트의 자율 해킹 능력을 pass@1 비율로 측정.',
            source: 'cybench.github.io'
        },
        cvebench: {
            name: 'CVE-Bench',
            desc: '40개 critical-severity CVE 기반 실제 웹 앱 취약점 악용 벤치마크. 제로데이/원데이 시나리오에서 exploit 성공률 측정.',
            source: 'github.com/uiuc-kang-lab/cve-bench'
        },
        cybergym: {
            name: 'CyberGym',
            desc: '실제 오픈소스 프로젝트에서 기발견 취약점 재현 + 신규 제로데이 발견 능력. $2 비용 제한 내 성공률 측정.',
            source: 'cybergym.io'
        },
        evmbench_exploit: {
            name: 'EVMbench (Exploit)',
            desc: '120개 Ethereum 스마트 컨트랙트 취약점 exploit 생성. 로컬 EVM 환경에서 실제 exploit 성공률 측정.',
            source: 'github.com/openai/evmbench'
        },
        evmbench_detect: {
            name: 'EVMbench (Detect)',
            desc: '120개 Ethereum 스마트 컨트랙트 보안 감사. 취약점 탐지(Audit) 정확도 측정.',
            source: 'github.com/openai/evmbench'
        },
        airtbench: {
            name: 'AIRTBench',
            desc: '70개 AI/ML 시스템 대상 자율 레드팀 CTF. 프롬프트 인젝션, 모델 역추론, 시스템 악용 능력 측정.',
            source: 'github.com/dreadnode/AIRTBench-Code'
        },
        autopatchbench: {
            name: 'AutoPatchBench',
            desc: '136개 실제 C/C++ 취약점 자동 패치. Fuzzing + 차분 테스트로 패치 정확성 검증. (CyberSecEval 4)',
            source: 'github.com/facebookresearch/CyberSecEval'
        },
        cybersoceval: {
            name: 'CyberSOCEval',
            desc: '보안 운영센터(SOC) 맬웨어 분석 + 위협 인텔리전스 추론 능력 평가. Meta + CrowdStrike 공동 개발.',
            source: 'github.com/CrowdStrike/CyberSOCEval_data'
        },
        zerodaybench: {
            name: 'ZeroDayBench',
            desc: '미공개 제로데이 취약점 탐지 및 패치 능력. 정보 수준별(zero-day, +CWE, +description) 성공률 측정.',
            source: 'arxiv.org/abs/2603.02297'
        },
        baxbench: {
            name: 'BaxBench',
            desc: '392개 보안-critical 백엔드 코딩 과제. 14개 프레임워크 × 6개 언어. 정확성 + 보안 exploit 동시 평가.',
            source: 'baxbench.com'
        },
        osworld_verified: {
            name: 'OSWorld-Verified',
            desc: '실제 컴퓨터 환경(Ubuntu)에서 오픈엔디드 작업 수행. 멀티모달 에이전트의 GUI/CLI 조작 능력 측정.',
            source: 'os-world.github.io'
        },
        gaia: {
            name: 'GAIA',
            desc: '450+ 비자명 질문. 웹 검색, 파일 처리, 코드 실행 등 도구 활용 + 다단계 추론 능력 종합 평가.',
            source: 'huggingface.co/spaces/gaia-benchmark'
        },
        browsecomp: {
            name: 'BrowseComp',
            desc: '1,266개 난이도 높은 웹 정보 검색 과제. 지속적 탐색과 정보 종합 능력 측정. OpenAI 개발.',
            source: 'openai.com/index/browsecomp'
        },
        tau_bench: {
            name: 'TAU-bench',
            desc: '항공/리테일/통신 도메인 고객 서비스 에이전트 시뮬레이션. 도구-에이전트-사용자 상호작용 정확도 측정.',
            source: 'sierra.ai/blog/tau-bench'
        },
        metr_time_horizons: {
            name: 'METR Time Horizons',
            desc: 'AI 에이전트가 50% 성공률로 자율 완료할 수 있는 인간 작업 시간 측정. ML 연구/SWE/운영 과제.',
            source: 'metr.org/time-horizons'
        },
        tau2_bench: {
            name: 'τ2-bench',
            desc: 'Tool-Agent-User 상호작용 v2. Retail/Telecom 도메인 고객 서비스 에이전트 시뮬레이션.',
            source: 'sierra-research/tau2-bench'
        },
        webarena: {
            name: 'WebArena',
            desc: '실제 웹 애플리케이션에서 자율 작업 수행. CMS, 이커머스, 포럼 등 다양한 사이트 자동화.',
            source: 'webarena.dev'
        },
        deepsearchqa: {
            name: 'DeepSearchQA',
            desc: '다단계 웹 리서치. 깊은 브라우징과 정보 종합이 필요한 복잡한 질문에 대한 F1 점수 측정.',
            source: 'Anthropic internal'
        },
        mcp_atlas: {
            name: 'MCP-Atlas',
            desc: '36개 실제 MCP 서버, 220개 도구를 활용한 1,000개 멀티스텝 워크플로우 작업.',
            source: 'MCP-Atlas benchmark'
        },
        firefox_147: {
            name: 'Firefox 147 Exploitation',
            desc: '실제 브라우저 크래시 입력에서 JS shell exploit 생성. 코드 실행 성공률 측정.',
            source: 'Anthropic internal'
        },
        cyber_range: {
            name: 'Cyber Range',
            desc: '15개 네트워크 공격 시나리오 (C2, SSRF, Binary Exploit, EDR Evasion 등). 시나리오 통과율 측정.',
            source: 'OpenAI internal'
        },
        dfir_metric: {
            name: 'DFIR-Metric',
            desc: '디지털 포렌식 및 사고 대응 능력. Module I (MCQ 지식) + Module II (CTF 포렌식 실습).',
            source: 'DFIR-Metric benchmark'
        },
        evmbench_patch: {
            name: 'EVMbench (Patch)',
            desc: '스마트 컨트랙트 취약점 패치. 기능 보존하면서 보안 수정하는 능력 측정.',
            source: 'github.com/openai/evmbench'
        },
        swe_bench_verified: {
            name: 'SWE-bench Verified',
            desc: '실제 GitHub 이슈를 해결하는 능력 측정. 2,294개 검증된 태스크. 가장 널리 인용되는 코딩 벤치마크.',
            source: 'swebench.com'
        },
        swe_bench_pro: {
            name: 'SWE-bench Pro',
            desc: 'SWE-bench의 고급 버전. 복잡한 multi-step reasoning이 필요한 실제 SW 엔지니어링 과제. Verified의 80%가 Pro에서 46-58% 수준.',
            source: 'labs.scale.com'
        },
        terminal_bench_2: {
            name: 'Terminal-Bench 2.0',
            desc: '89개 Docker 컨테이너 과제 (SWE, 생물학, 보안, 게임). 자율 에이전트의 터미널 환경 작업 수행 능력 측정.',
            source: 'tbench.ai'
        },
        livecodebench: {
            name: 'LiveCodeBench',
            desc: '매월 갱신되는 contamination-free 코딩 벤치마크. 경쟁 프로그래밍 문제 기반 pass@1 정확도 측정.',
            source: 'livecodebench.github.io'
        }
    },

    // frontier models to highlight
    FRONTIER_MODELS: [
        'anthropic/claude-opus-4.7',
        'anthropic/claude-mythos-preview',
        'anthropic/claude-opus-4.6',
        'anthropic/claude-opus-4.5',
        'anthropic/claude-sonnet-4.6',
        'google/gemini-3.1-pro',
        'google/gemini-3-pro',
        'openai/gpt-5.4',
        'openai/gpt-5.4-thinking',
        'openai/gpt-5.3-codex',
        'openai/gpt-5.2',
        'openai/gpt-5',
        'xai/grok-4-heavy',
        'meta/muse-spark',
        'zhipu/glm-5',
        'zhipu/glm-5.1',
        'alibaba/qwen3.6-plus',
        'deepseek/deepseek-v3.2',
        'moonshot/kimi-k2.5',
        'moonshot/kimi-k2-thinking',
        'minimax/m2.7',
        'baidu/ernie-5.0',
        'lg/exaone-4.5-33b',
        'skt/ax-k1'
    ],

    _models: [],
    _benchmarks: [],
    _scores: [],

    init: function(models, benchmarks, scores) {
        this._models = models;
        this._benchmarks = benchmarks;
        this._scores = scores;
    },

    render: function() {
        // Always refresh from App.data in case init was called before data loaded
        this._models = App.data.models;
        this._benchmarks = App.data.benchmarks;
        this._scores = App.data.scores;

        this._renderBarChart('cyber-chart', this.CYBER_BENCHMARKS, 'Cybersecurity');
        this._renderBarChart('coding-chart', this.CODING_BENCHMARKS, 'Coding');
        this._renderTable('cyber-table-container', this.CYBER_BENCHMARKS);
        this._renderTable('coding-table-container', this.CODING_BENCHMARKS);
        this._renderTable('defense-table-container', this.DEFENSE_BENCHMARKS);
        this._renderBarChart('agent-chart', this.AGENT_BENCHMARKS, 'Agent');
        this._renderTable('agent-table-container', this.AGENT_BENCHMARKS);
        this._renderRadar();
        this._renderDescriptions();
    },

    _getScoresForBenchmarks: function(benchmarkIds) {
        var self = this;
        var result = {};
        this._scores.forEach(function(s) {
            if (benchmarkIds.indexOf(s.benchmark_id) === -1) return;
            if (!result[s.model_id]) result[s.model_id] = {};
            result[s.model_id][s.benchmark_id] = s.value;
        });
        return result;
    },

    _getModelName: function(modelId) {
        var m = this._models.find(function(m) { return m.id === modelId; });
        return m ? m.name : modelId.split('/').pop();
    },

    _renderBarChart: function(containerId, benchmarkIds, title) {
        var el = document.getElementById(containerId);
        if (!el) return;
        var chart = echarts.init(el);

        var modelScores = this._getScoresForBenchmarks(benchmarkIds);
        var self = this;

        // filter to frontier models that have at least one score
        var modelIds = this.FRONTIER_MODELS.filter(function(mid) {
            return modelScores[mid] && Object.keys(modelScores[mid]).length > 0;
        });

        // sort by average score descending
        modelIds.sort(function(a, b) {
            var avgA = 0, cntA = 0, avgB = 0, cntB = 0;
            benchmarkIds.forEach(function(bid) {
                if (modelScores[a] && modelScores[a][bid]) { avgA += modelScores[a][bid]; cntA++; }
                if (modelScores[b] && modelScores[b][bid]) { avgB += modelScores[b][bid]; cntB++; }
            });
            return (cntB ? avgB / cntB : 0) - (cntA ? avgA / cntA : 0);
        });

        modelIds = modelIds.slice(0, 12);

        var benchNames = benchmarkIds.map(function(bid) {
            var b = self._benchmarks.find(function(x) { return x.id === bid; });
            return b ? b.name : bid;
        });

        var colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        var series = benchmarkIds.map(function(bid, i) {
            return {
                name: benchNames[i],
                type: 'bar',
                data: modelIds.map(function(mid) {
                    return (modelScores[mid] && modelScores[mid][bid]) || 0;
                }),
                itemStyle: { color: colors[i % colors.length] },
                barGap: '10%'
            };
        });

        var option = {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: {
                data: benchNames,
                textStyle: { color: '#9ca3af', fontSize: 10 },
                top: 0
            },
            grid: { left: 8, right: 16, bottom: 40, top: 40, containLabel: true },
            xAxis: {
                type: 'category',
                data: modelIds.map(function(mid) { return self._getModelName(mid); }),
                axisLabel: { color: '#9ca3af', fontSize: 9, rotate: 30 },
                axisLine: { lineStyle: { color: '#374151' } }
            },
            yAxis: {
                type: 'value',
                max: 100,
                axisLabel: { color: '#9ca3af', formatter: '{value}%' },
                splitLine: { lineStyle: { color: '#1f2937' } }
            },
            series: series
        };

        chart.setOption(option);
        window.addEventListener('resize', function() { chart.resize(); });
    },

    _renderTable: function(containerId, benchmarkIds) {
        var container = document.getElementById(containerId);
        if (!container) return;
        container.textContent = '';

        var modelScores = this._getScoresForBenchmarks(benchmarkIds);
        var self = this;

        // get all models with scores, sorted by first benchmark score
        var modelIds = Object.keys(modelScores);
        modelIds.sort(function(a, b) {
            var avgA = 0, cntA = 0, avgB = 0, cntB = 0;
            benchmarkIds.forEach(function(bid) {
                if (modelScores[a][bid]) { avgA += modelScores[a][bid]; cntA++; }
                if (modelScores[b][bid]) { avgB += modelScores[b][bid]; cntB++; }
            });
            return (cntB ? avgB / cntB : 0) - (cntA ? avgA / cntA : 0);
        });

        var table = document.createElement('table');
        table.className = 'sota-table text-sm';

        var thead = document.createElement('thead');
        var hr = document.createElement('tr');
        var thModel = document.createElement('th');
        thModel.textContent = 'Model';
        hr.appendChild(thModel);
        benchmarkIds.forEach(function(bid) {
            var th = document.createElement('th');
            var b = self._benchmarks.find(function(x) { return x.id === bid; });
            th.textContent = b ? b.name : bid;
            th.style.fontSize = '11px';
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');

        // find max for each benchmark for highlighting
        var maxes = {};
        benchmarkIds.forEach(function(bid) {
            var max = 0;
            modelIds.forEach(function(mid) {
                if (modelScores[mid][bid] && modelScores[mid][bid] > max) max = modelScores[mid][bid];
            });
            maxes[bid] = max;
        });

        modelIds.forEach(function(mid) {
            var tr = document.createElement('tr');
            var tdName = document.createElement('td');
            tdName.textContent = self._getModelName(mid);
            tdName.style.whiteSpace = 'nowrap';
            tr.appendChild(tdName);

            benchmarkIds.forEach(function(bid) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                var val = modelScores[mid][bid];
                if (val) {
                    td.textContent = val.toFixed(1) + '%';
                    // color based on relative position
                    var ratio = maxes[bid] > 0 ? val / maxes[bid] : 0;
                    if (ratio >= 0.95) {
                        td.style.color = '#10b981';
                        td.style.fontWeight = 'bold';
                    } else if (ratio >= 0.8) {
                        td.style.color = '#3b82f6';
                    } else if (ratio >= 0.6) {
                        td.style.color = '#f59e0b';
                    } else {
                        td.style.color = '#ef4444';
                    }
                } else {
                    td.textContent = '\u2014';
                    td.style.color = '#4b5563';
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    },

    _renderRadar: function() {
        var el = document.getElementById('cyber-coding-radar');
        if (!el) return;
        var chart = echarts.init(el);
        var self = this;

        var allBenchmarks = this.CYBER_BENCHMARKS.concat(this.CODING_BENCHMARKS);

        // Pick top frontier models that have the most scores
        var modelScores = this._getScoresForBenchmarks(allBenchmarks);
        var topModels = this.FRONTIER_MODELS.filter(function(mid) {
            if (!modelScores[mid]) return false;
            var cnt = 0;
            allBenchmarks.forEach(function(bid) { if (modelScores[mid][bid]) cnt++; });
            return cnt >= 3;
        }).slice(0, 6);

        var indicators = allBenchmarks.map(function(bid) {
            var b = self._benchmarks.find(function(x) { return x.id === bid; });
            var name = b ? b.name : bid;
            // shorten long names
            name = name.replace('SWE-bench ', 'SWE-').replace('Terminal-Bench ', 'T-Bench ');
            return { name: name, max: 100 };
        });

        var colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        var series = [{
            type: 'radar',
            data: topModels.map(function(mid, i) {
                return {
                    name: self._getModelName(mid),
                    value: allBenchmarks.map(function(bid) {
                        return (modelScores[mid] && modelScores[mid][bid]) || 0;
                    }),
                    lineStyle: { color: colors[i], width: 2 },
                    itemStyle: { color: colors[i] },
                    areaStyle: { color: colors[i], opacity: 0.08 }
                };
            })
        }];

        var option = {
            backgroundColor: 'transparent',
            tooltip: {},
            legend: {
                data: topModels.map(function(mid) { return self._getModelName(mid); }),
                textStyle: { color: '#9ca3af', fontSize: 11 },
                top: 0
            },
            radar: {
                indicator: indicators,
                shape: 'polygon',
                splitNumber: 5,
                axisName: { color: '#9ca3af', fontSize: 10 },
                splitLine: { lineStyle: { color: '#1f2937' } },
                splitArea: { areaStyle: { color: ['transparent'] } },
                axisLine: { lineStyle: { color: '#374151' } }
            },
            series: series
        };

        chart.setOption(option);
        window.addEventListener('resize', function() { chart.resize(); });
    },

    _renderDescriptions: function() {
        var self = this;

        var cyberContainer = document.getElementById('cyber-bench-descriptions');
        if (cyberContainer) {
            cyberContainer.textContent = '';
            this.CYBER_BENCHMARKS.forEach(function(bid) {
                var info = self.BENCH_DESCRIPTIONS[bid];
                if (!info) return;
                var div = document.createElement('div');
                var strong = document.createElement('strong');
                strong.className = 'text-gray-200';
                strong.textContent = info.name;
                div.appendChild(strong);
                div.appendChild(document.createTextNode(' \u2014 ' + info.desc));
                var src = document.createElement('div');
                src.className = 'text-xs text-gray-500 mt-1';
                src.textContent = 'Source: ' + info.source;
                div.appendChild(src);
                cyberContainer.appendChild(div);
            });
        }

        var defenseContainer = document.getElementById('defense-bench-descriptions');
        if (defenseContainer) {
            defenseContainer.textContent = '';
            this.DEFENSE_BENCHMARKS.forEach(function(bid) {
                var info = self.BENCH_DESCRIPTIONS[bid];
                if (!info) return;
                var div = document.createElement('div');
                var strong = document.createElement('strong');
                strong.className = 'text-gray-200';
                strong.textContent = info.name;
                div.appendChild(strong);
                div.appendChild(document.createTextNode(' \u2014 ' + info.desc));
                var src = document.createElement('div');
                src.className = 'text-xs text-gray-500 mt-1';
                src.textContent = 'Source: ' + info.source;
                div.appendChild(src);
                defenseContainer.appendChild(div);
            });
        }

        var agentContainer = document.getElementById('agent-bench-descriptions');
        if (agentContainer) {
            agentContainer.textContent = '';
            this.AGENT_BENCHMARKS.forEach(function(bid) {
                var info = self.BENCH_DESCRIPTIONS[bid];
                if (!info) return;
                var div = document.createElement('div');
                var strong = document.createElement('strong');
                strong.className = 'text-gray-200';
                strong.textContent = info.name;
                div.appendChild(strong);
                div.appendChild(document.createTextNode(' \u2014 ' + info.desc));
                var src = document.createElement('div');
                src.className = 'text-xs text-gray-500 mt-1';
                src.textContent = 'Source: ' + info.source;
                div.appendChild(src);
                agentContainer.appendChild(div);
            });
        }

        var codingContainer = document.getElementById('coding-bench-descriptions');
        if (codingContainer) {
            codingContainer.textContent = '';
            this.CODING_BENCHMARKS.forEach(function(bid) {
                var info = self.BENCH_DESCRIPTIONS[bid];
                if (!info) return;
                var div = document.createElement('div');
                var strong = document.createElement('strong');
                strong.className = 'text-gray-200';
                strong.textContent = info.name;
                div.appendChild(strong);
                div.appendChild(document.createTextNode(' \u2014 ' + info.desc));
                var src = document.createElement('div');
                src.className = 'text-xs text-gray-500 mt-1';
                src.textContent = 'Source: ' + info.source;
                div.appendChild(src);
                codingContainer.appendChild(div);
            });
        }
    }
};
