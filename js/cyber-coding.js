/**
 * Cyber & Coding tab: renders cybersecurity attack and coding capability views.
 */
var CyberCoding = {
    CYBER_BENCHMARKS: ['cybench', 'cvebench', 'cybergym', 'evmbench_exploit', 'evmbench_detect', 'airtbench', 'firefox_147', 'cyber_range', 'cyscenariobench', 'tlo_cyber_range', 'openai_ctf_professional', 'irregular_atomic_network', 'irregular_atomic_vuln_research', 'irregular_atomic_evasion', 'uk_aisi_narrow_cyber'],
    DEFENSE_BENCHMARKS: ['autopatchbench', 'cybersoceval', 'zerodaybench', 'evmbench_patch', 'dfir_metric'],
    AGENT_BENCHMARKS: ['osworld_verified', 'gaia', 'gaia2', 'browsecomp', 'tau_bench', 'tau2_bench', 'tau3_bench', 'webarena', 'deepsearchqa', 'mcp_atlas', 'toolathlon', 'mcpmark', 'android_world', 'qwen_web_bench', 'arc_agi_3', 'claw_eval'],
    CODING_BENCHMARKS: ['swe_bench_verified', 'swe_bench_pro', 'swe_bench_multilingual', 'terminal_bench_2', 'livecodebench', 'livecodebench_v6', 'nl2repo', 'codeforces_elo'],

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
        },
        livecodebench_v6: {
            name: 'LiveCodeBench v6',
            desc: 'LiveCodeBench 6차 갱신본. 2026 경쟁 프로그래밍 문제 포함. Frontier 모델들이 80% 이상 넘어서면서 난이도 상향 필요성 대두.',
            source: 'livecodebench.github.io'
        },
        swe_bench_multilingual: {
            name: 'SWE-bench Multilingual',
            desc: 'SWE-bench 다국어 확장판. Python 외 Java/Go/TS/JS/C++/Rust/C 언어 리포지토리의 실제 GitHub 이슈 해결 능력 측정.',
            source: 'swebench.com'
        },
        cyscenariobench: {
            name: 'CyScenarioBench',
            desc: 'Irregular 팀 개발 멀티 스텝 사이버 공격 시나리오 평균 성공률. GPT-5.5에서 26% (GPT-5.4 9% 대비 +17pt).',
            source: 'Irregular external eval'
        },
        tlo_cyber_range: {
            name: 'The Last Ones (TLO)',
            desc: 'UK AISI 32단계 기업 네트워크 공격 시뮬레이션. 20 human-hour 난이도. GPT-5.5가 pass@10에서 1회 해결.',
            source: 'UK AISI research'
        },
        toolathlon: {
            name: 'Toolathlon',
            desc: '다영역 도구 활용 에이전트 벤치마크. 장기(long-horizon) 워크플로우에서의 도구 선택·연속 호출 정확도 측정. Kimi K2.6 릴리스에서 주요 지표.',
            source: 'Kimi K2.6 release'
        },
        mcpmark: {
            name: 'MCPMark',
            desc: 'Model Context Protocol 기반 에이전트 도구 사용 벤치마크. 다단계 MCP 서버 호출 정확도. Qwen3.6-35B-A3B 릴리스에서 도입.',
            source: 'Qwen3.6 release'
        },
        android_world: {
            name: 'AndroidWorld',
            desc: 'Android 모바일 OS 에이전트 벤치마크. 20개 실제 Android 앱에서 116개 과제 수행. Google Research.',
            source: 'arxiv.org/abs/2405.14573'
        },
        qwen_web_bench: {
            name: 'QwenWebBench',
            desc: 'Alibaba Qwen 팀의 웹 브라우징 에이전트 ELO 평가. 멀티턴 웹 네비게이션 태스크에서의 상대 순위.',
            source: 'Qwen3.6 release'
        },
        nl2repo: {
            name: 'NL2Repo',
            desc: '자연어 → 리포지토리 합성 벤치마크. 단일 함수가 아닌 전체 리포 구조를 NL 명세만으로 생성하는 정확도 측정.',
            source: 'Qwen3.6 release'
        },
        expert_swe: {
            name: 'Expert-SWE',
            desc: 'OpenAI 내부 expert-level 소프트웨어 엔지니어링 벤치마크. SWE-bench 대비 더 어려운 실제 시니어 엔지니어 시나리오.',
            source: 'GPT-5.5 launch'
        },
        openai_ctf_professional: {
            name: 'OpenAI CTF (Professional)',
            desc: 'OpenAI가 직접 큐레이션한 professional-level CTF (web/rev/pwn/crypto/misc). pass@12 over 16 rollouts. Stanford Cybench와 별개의 벤치마크.',
            source: 'System Card Figure 16'
        },
        irregular_atomic_network: {
            name: 'Irregular Atomic — Network Attack',
            desc: 'Irregular(ex-Pattern Labs)의 atomic challenge suite 중 Network Attack Simulation 카테고리. 개별 네트워크 공격 skill을 격리 평가.',
            source: 'Irregular publications'
        },
        irregular_atomic_vuln_research: {
            name: 'Irregular Atomic — Vuln Research',
            desc: 'Irregular atomic challenge의 Vulnerability Research & Exploitation 카테고리. 취약점 발견/익스플로잇 primitive 능력 측정.',
            source: 'Irregular publications'
        },
        irregular_atomic_evasion: {
            name: 'Irregular Atomic — Evasion',
            desc: 'Irregular atomic challenge의 Evasion 카테고리. 탐지 우회 및 방어 도구 회피 skill을 격리 평가.',
            source: 'Irregular publications'
        },
        uk_aisi_narrow_cyber: {
            name: 'UK AISI Narrow Cyber (pass@5)',
            desc: 'UK AI Security Institute의 expert-level narrow cyber 태스크. pass@5 with 50M-token budget per attempt. TLO 32-step range와 별개의 평가.',
            source: 'UK AISI research'
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
        'openai/gpt-5.5',
        'openai/gpt-5.5-pro',
        'openai/gpt-5.4',
        'openai/gpt-5.4-thinking',
        'openai/gpt-5.3-codex',
        'openai/gpt-5.2',
        'openai/gpt-5',
        'xai/grok-4-heavy',
        'xai/grok-4.20',
        'meta/muse-spark',
        'zhipu/glm-5',
        'zhipu/glm-5.1',
        'alibaba/qwen3.6-plus',
        'alibaba/qwen3.6-27b',
        'alibaba/qwen3.6-35b-a3b',
        'deepseek/deepseek-v3.2',
        'moonshot/kimi-k2.6',
        'moonshot/kimi-k2.5',
        'moonshot/kimi-k2-thinking',
        'minimax/m2.7',
        'baidu/ernie-5.0',
        'lg/exaone-4.5-33b',
        'skt/ax-k1',
        // Apr 2026 frontier sweep — coding/agent leaders
        'tencent/hy3-preview',
        'xiaomi/mimo-v2.5-pro',
        'inclusionai/ling-2.6-1t',
        'anthropic/claude-mythos-preview'
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
        this._renderBarChart('defense-chart', this.DEFENSE_BENCHMARKS, 'Cyber Defense');
        this._renderBarChart('agent-chart', this.AGENT_BENCHMARKS, 'Agent');
        this._renderTable('cyber-table-container', this.CYBER_BENCHMARKS);
        this._renderTable('coding-table-container', this.CODING_BENCHMARKS);
        this._renderTable('defense-table-container', this.DEFENSE_BENCHMARKS);
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

        // Benchmark-centric grouping: x-axis = benchmarks, series = top models.
        // Filter benchmarks that have at least one score, ordered by coverage
        // (most-evaluated first) so the densest columns sit on the left.
        var benchWithCoverage = benchmarkIds.map(function(bid) {
            var count = 0;
            Object.keys(modelScores).forEach(function(mid) {
                if (modelScores[mid] && modelScores[mid][bid]) count++;
            });
            return { bid: bid, count: count };
        }).filter(function(x) { return x.count > 0; });
        benchWithCoverage.sort(function(a, b) { return b.count - a.count; });
        var activeBids = benchWithCoverage.map(function(x) { return x.bid; });

        // Filter to frontier models with ≥1 score across this benchmark set.
        var modelIds = this.FRONTIER_MODELS.filter(function(mid) {
            return modelScores[mid] && activeBids.some(function(bid) { return modelScores[mid][bid]; });
        });

        // Sort models by average score across the benchmark set, keep top-8
        // so the grouped-bar legend stays legible (7±2 rule).
        modelIds.sort(function(a, b) {
            var avgA = 0, cntA = 0, avgB = 0, cntB = 0;
            activeBids.forEach(function(bid) {
                if (modelScores[a] && modelScores[a][bid]) { avgA += modelScores[a][bid]; cntA++; }
                if (modelScores[b] && modelScores[b][bid]) { avgB += modelScores[b][bid]; cntB++; }
            });
            return (cntB ? avgB / cntB : 0) - (cntA ? avgA / cntA : 0);
        });
        modelIds = modelIds.slice(0, 8);

        var benchNames = activeBids.map(function(bid) {
            var b = self._benchmarks.find(function(x) { return x.id === bid; });
            return b ? b.name : bid;
        });

        // One series per MODEL. Each series has a value for each benchmark on
        // the x-axis. ECharts renders clustered bars grouped by x-category,
        // so every benchmark column shows top-N models side-by-side.
        var modelNames = modelIds.map(function(mid) { return self._getModelName(mid); });
        var series = modelIds.map(function(mid, i) {
            return {
                name: modelNames[i],
                type: 'bar',
                data: activeBids.map(function(bid) {
                    return (modelScores[mid] && modelScores[mid][bid]) || 0;
                }),
                itemStyle: { color: Theme.series[i % Theme.series.length] },
                barGap: '10%'
            };
        });

        var option = {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: {
                data: modelNames,
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                top: 0,
                type: 'scroll'
            },
            grid: { left: 8, right: 16, bottom: 60, top: 40, containLabel: true },
            xAxis: {
                type: 'category',
                data: benchNames,
                axisLabel: {
                    color: Theme.textMuted,
                    fontSize: 9,
                    rotate: 35,
                    interval: 0,
                    formatter: function(val) { return val.length > 22 ? val.slice(0, 20) + '…' : val; }
                },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: Theme.textMuted },
                splitLine: { lineStyle: { color: Theme.border } }
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
                        td.style.color = Theme.series[0];
                        td.style.fontWeight = 'bold';
                    } else if (ratio >= 0.8) {
                        td.style.color = Theme.series[1];
                    } else if (ratio >= 0.6) {
                        td.style.color = Theme.series[2];
                    } else {
                        td.style.color = Theme.series[3];
                    }
                    // Clickable \u2192 opens score source detail modal
                    td.style.cursor = 'pointer';
                    td.setAttribute('role', 'button');
                    td.setAttribute('title', '\ud074\ub9ad\ud558\uba74 \uac80\uc99d \uc18c\uc2a4\uc640 \uc218\uc9d1\uc77c \ud45c\uc2dc');
                    td.addEventListener('click', (function(modelId, benchId) {
                        return function() {
                            if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                                Modal.showScoreSource(modelId, benchId);
                            }
                        };
                    })(mid, bid));
                } else {
                    td.textContent = '\u2014';
                    td.style.color = Theme.textDisabled;
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

        // Calculate per-axis max dynamically
        var indicators = allBenchmarks.map(function(bid) {
            var b = self._benchmarks.find(function(x) { return x.id === bid; });
            var name = b ? b.name : bid;
            name = name.replace('SWE-bench ', 'SWE-').replace('Terminal-Bench ', 'T-Bench ');
            var axisMax = 0;
            topModels.forEach(function(mid) {
                var v = (modelScores[mid] && modelScores[mid][bid]) || 0;
                if (v > axisMax) axisMax = v;
            });
            if (axisMax <= 100) axisMax = 100;
            else axisMax = Math.ceil(axisMax / 100) * 100;
            return { name: name, max: axisMax };
        });

        var series = [{
            type: 'radar',
            data: topModels.map(function(mid, i) {
                var color = Theme.rankColor(i);
                return {
                    name: self._getModelName(mid),
                    value: allBenchmarks.map(function(bid) {
                        return (modelScores[mid] && modelScores[mid][bid]) || 0;
                    }),
                    lineStyle: { color: color, width: 2 },
                    itemStyle: { color: color },
                    areaStyle: { color: color, opacity: 0.08 }
                };
            })
        }];

        var option = {
            backgroundColor: 'transparent',
            tooltip: {},
            legend: {
                data: topModels.map(function(mid) { return self._getModelName(mid); }),
                textStyle: { color: Theme.textMuted, fontSize: 11 },
                top: 0
            },
            radar: {
                indicator: indicators,
                shape: 'polygon',
                splitNumber: 5,
                axisName: { color: Theme.textMuted, fontSize: 10 },
                splitLine: { lineStyle: { color: Theme.border } },
                splitArea: { areaStyle: { color: ['transparent'] } },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
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
