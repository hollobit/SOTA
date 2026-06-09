/**
 * Physical AI — Edge & Mobile Small-LLM Widget Suite (≤12B models).
 *
 * Renders 4 sub-widgets into a single host container:
 *   A) Device-class buckets (5 cards: MCU/Wearable, Lightweight Mobile,
 *      Standard Mobile, High-end Mobile, Workstation)
 *   B) Size-vs-AAII Pareto scatter chart (ECharts)
 *   C) Vendor / Country distribution donut (ECharts)
 *   D) Sortable comparison table (Model · Size · AAII · MMLU-Pro · Country · Released · Type)
 *
 * Datasource: App.data.{models,benchmarks,scores} (loaded by app.js).
 * Filters models by `parameters` regex → numeric B value ≤ 12.5 AND at least
 * one of the comparison benchmarks. Country derived from vendor lookup.
 */
(function(root) {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────
  // Device-class buckets (size in B parameters).
  // Order is render order. `max` is exclusive upper bound except last.
  // ──────────────────────────────────────────────────────────────────────
  var DEVICE_CLASSES = [
    { code: 'mcu',      icon: '🌍', label: 'MCU · Wearable',          range: '< 0.5B',  min: 0,    max: 0.5,
      note: '스마트워치·이어버드·BLE 센서. ~250-500MB RAM, INT8 quantized.' },
    { code: 'lite',     icon: '⌚', label: 'Lightweight Mobile',      range: '0.5 - 2B', min: 0.5,  max: 2.0,
      note: '엔트리/미드 스마트폰. ~1-3GB RAM, NPU 4-bit quant 가능.' },
    { code: 'mid',      icon: '📱', label: 'Standard Mobile',         range: '2 - 4B',   min: 2.0,  max: 4.0,
      note: 'Galaxy S25·iPhone 16급. ~3-6GB RAM 점유, 토큰 20-40 t/s.' },
    { code: 'high',     icon: '🚀', label: 'High-end Mobile · Edge',  range: '4 - 8B',   min: 4.0,  max: 8.0,
      note: 'Snapdragon 8 Elite/Tensor G5 · Jetson Orin. ~6-10GB RAM.' },
    { code: 'work',     icon: '🖥️', label: 'Laptop · Workstation',    range: '8 - 13B',  min: 8.0,  max: 13.0,
      note: '노트북 NPU/dGPU · Mac M-series · Jetson AGX. 8-16GB VRAM.' }
  ];

  // Vendor → Country (flag emoji + label) mapping. Used by donut + table.
  // Falls back to '🌐 Other' when vendor unrecognized.
  var COUNTRY_MAP = {
    // 🇺🇸 USA
    'google':                '🇺🇸 USA',
    'google deepmind':       '🇺🇸 USA',
    'google (usa)':          '🇺🇸 USA',
    'meta':                  '🇺🇸 USA',
    'meta ai (usa)':         '🇺🇸 USA',
    'microsoft':             '🇺🇸 USA',
    'microsoft (usa)':       '🇺🇸 USA',
    'nvidia':                '🇺🇸 USA',
    'ibm':                   '🇺🇸 USA',
    'apple':                 '🇺🇸 USA',
    'liquid ai':             '🇺🇸 USA',
    'ai21':                  '🇮🇱 Israel',  // tech-Israel; AI21 HQ Tel Aviv
    'allen ai':              '🇺🇸 USA',
    'allenai':               '🇺🇸 USA',
    'zyphra (usa)':          '🇺🇸 USA',
    'zyphra':                '🇺🇸 USA',
    // 🇨🇦 Canada
    'cohere':                '🇨🇦 Canada',
    'cohere labs':           '🇨🇦 Canada',
    'cohere labs (canada)':  '🇨🇦 Canada',
    // 🇨🇳 China
    'alibaba':               '🇨🇳 China',
    'alibaba (qwen)':        '🇨🇳 China',
    'tencent':               '🇨🇳 China',
    'tencent (china)':       '🇨🇳 China',
    'deepseek':              '🇨🇳 China',
    'deepseek (china)':      '🇨🇳 China',
    'xiaomi':                '🇨🇳 China',
    'moonshot ai':           '🇨🇳 China',
    'moonshot':              '🇨🇳 China',
    'thudm':                 '🇨🇳 China',
    'tsinghua thudm':        '🇨🇳 China',
    'zhipu':                 '🇨🇳 China',
    'baichuan':              '🇨🇳 China',
    '01.ai':                 '🇨🇳 China',
    'openbmb':               '🇨🇳 China',
    'openbmb (tsinghua)':    '🇨🇳 China',
    'shanghai ai lab':       '🇨🇳 China',
    'stepfun':               '🇨🇳 China',
    'nanbeige':              '🇨🇳 China',
    'china-mobile':          '🇨🇳 China',
    'internlm':              '🇨🇳 China',
    // 🇫🇷 France
    'mistral ai':            '🇫🇷 France',
    'mistral':               '🇫🇷 France',
    'hugging face':          '🇫🇷 France',
    'huggingface':           '🇫🇷 France',
    // 🇰🇷 Korea
    'lg ai research':        '🇰🇷 Korea',
    'ncsoft':                '🇰🇷 Korea',
    'ncsoft (nc ai)':        '🇰🇷 Korea',
    'upstage':               '🇰🇷 Korea',
    'motif technologies':    '🇰🇷 Korea',
    'motif':                 '🇰🇷 Korea',
    'elyza':                 '🇯🇵 Japan',
    // 🇸🇬 Singapore
    'ai singapore':          '🇸🇬 Singapore',
    // 🇦🇪 UAE
    'tii':                   '🇦🇪 UAE',
    'tii (uae)':             '🇦🇪 UAE',
    // 🇩🇪 Germany / EU
    'aleph alpha':           '🇩🇪 Germany',
    'sber':                  '🇷🇺 Russia',
    'vikhrmodels (russia community)': '🇷🇺 Russia',
    'swiss ai initiative':   '🇨🇭 Switzerland',
    // 🇮🇱 Israel
    'dicta':                 '🇮🇱 Israel',
    'dicta (israel)':        '🇮🇱 Israel',
    'sber ai':               '🇷🇺 Russia',
    'kakao':                 '🇰🇷 Korea',
    'konan technology':      '🇰🇷 Korea',
    'bigcode':               '🌐 OSS',
    'allen ai (ai2)':        '🇺🇸 USA',
    'opengpt-x (fraunhofer iais/iis + jülich + tu dresden + dfki)': '🇩🇪 Germany'
  };

  // Benchmarks we render in the table. Order = render order.
  var TABLE_BENCHMARKS = [
    { id: 'aa_intelligence_index', label: 'AAII',     digits: 0 },
    { id: 'mmlu_pro',              label: 'MMLU-Pro', digits: 1, suffix: '%' },
    { id: 'gpqa_diamond',          label: 'GPQA-D',   digits: 1, suffix: '%' }
  ];

  // ──────────────────────────────────────────────────────────────────────
  // Internal helpers.
  // ──────────────────────────────────────────────────────────────────────
  var _state = {
    modelsBySize: null,    // cached array of {id, name, vendor, size, country, scores:{bid:value}, release_date, type, modalities}
    selectedClass: 'all',  // 'all' or DEVICE_CLASSES.code
    tableSortKey: 'aaii',
    tableSortDir: 'desc'
  };

  function _parseSize(parameters, modelId) {
    if (!parameters && !modelId) return null;
    var txt = (parameters || '') + ' ' + (modelId || '');
    // Match "11.9B", "7B", "1.7B", "270M", "350m" (case-insensitive, word boundary)
    var bMatch = txt.match(/(\d+(?:\.\d+)?)\s*B(?:\b|[^a-z])/i);
    if (bMatch) return parseFloat(bMatch[1]);
    var mMatch = txt.match(/(\d+(?:\.\d+)?)\s*M(?:\b|[^a-z])/i);
    if (mMatch) return parseFloat(mMatch[1]) / 1000.0;
    // Pattern in id like "qwen3-4b" or "gemma-3-270m"
    var idMatch = (modelId || '').toLowerCase().match(/-(\d+(?:\.\d+)?)b(?:-|$)/);
    if (idMatch) return parseFloat(idMatch[1]);
    return null;
  }

  function _country(vendor) {
    if (!vendor) return '🌐 Other';
    var key = String(vendor).toLowerCase().trim();
    return COUNTRY_MAP[key] || '🌐 Other';
  }

  function _classifyDevice(sizeB) {
    if (sizeB == null) return null;
    for (var i = 0; i < DEVICE_CLASSES.length; i++) {
      var c = DEVICE_CLASSES[i];
      // Last bucket is inclusive of max to capture 12B exactly
      var inRange = (i === DEVICE_CLASSES.length - 1)
        ? (sizeB >= c.min && sizeB <= c.max)
        : (sizeB >= c.min && sizeB <  c.max);
      if (inRange) return c;
    }
    return null;
  }

  function _buildIndex() {
    if (!root.App || !root.App.data) return [];
    var models = root.App.data.models || [];
    var scores = root.App.data.scores || [];
    // Index scores by model id for fast lookup
    var scoreMap = {};
    for (var i = 0; i < scores.length; i++) {
      var s = scores[i];
      if (!scoreMap[s.model_id]) scoreMap[s.model_id] = {};
      scoreMap[s.model_id][s.benchmark_id] = s.value;
    }
    var out = [];
    for (var j = 0; j < models.length; j++) {
      var m = models[j];
      var size = _parseSize(m.parameters, m.id);
      if (size == null || size > 12.5) continue;
      var deviceClass = _classifyDevice(size);
      if (!deviceClass) continue;
      var modelScores = scoreMap[m.id] || {};
      // Require at least one of AAII / MMLU-Pro / GPQA-D / MMLU to qualify
      var hasCore = (modelScores.aa_intelligence_index != null) ||
                    (modelScores.mmlu_pro != null) ||
                    (modelScores.gpqa_diamond != null) ||
                    (modelScores.mmlu != null);
      if (!hasCore) continue;
      out.push({
        id: m.id,
        name: m.name || m.id,
        vendor: m.vendor || '',
        country: _country(m.vendor),
        size: size,
        device: deviceClass.code,
        release_date: m.release_date || '',
        type: m.type || '',
        modalities: Array.isArray(m.modalities) ? m.modalities : [],
        scores: modelScores
      });
    }
    out.sort(function(a, b) { return b.size - a.size; });
    return out;
  }

  function _ensureSection() {
    var host = document.getElementById('phys-edge-llm');
    if (!host) return null;
    if (host.dataset.built === '1') return host;
    host.textContent = '';
    host.dataset.built = '1';

    // ── A. Device-class buckets ──
    var bucketSection = document.createElement('div');
    bucketSection.className = 'mb-6';
    var bucketTitle = document.createElement('h4');
    bucketTitle.className = 'text-sm font-semibold text-gray-300 mb-2';
    bucketTitle.textContent = '디바이스 클래스별 분포 — 모델 카운트 + 클래스 1위 (AAII 기준)';
    bucketSection.appendChild(bucketTitle);
    var bucketGrid = document.createElement('div');
    bucketGrid.id = 'edge-llm-buckets';
    bucketGrid.className = 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3';
    bucketSection.appendChild(bucketGrid);
    host.appendChild(bucketSection);

    // ── B. Pareto chart ──
    var paretoSection = document.createElement('div');
    paretoSection.className = 'mb-6';
    var paretoTitle = document.createElement('h4');
    paretoTitle.className = 'text-sm font-semibold text-gray-300 mb-1';
    paretoTitle.textContent = '크기 × 성능 Pareto Frontier';
    paretoSection.appendChild(paretoTitle);
    var paretoHint = document.createElement('p');
    paretoHint.className = 'text-xs text-gray-500 mb-2';
    paretoHint.textContent = 'X = 파라미터 (B, log scale) · Y = AAII (Artificial Analysis Intelligence Index). 같은 사이즈에서 위쪽일수록, 같은 성능에서 왼쪽일수록 dominant. Pareto edge가 device deployment의 합리적 선택지.';
    paretoSection.appendChild(paretoHint);
    var paretoChart = document.createElement('div');
    paretoChart.id = 'edge-llm-pareto';
    paretoChart.className = 'w-full';
    paretoChart.style.height = '420px';
    paretoSection.appendChild(paretoChart);
    host.appendChild(paretoSection);

    // ── C. Vendor / Country distribution ──
    var distSection = document.createElement('div');
    distSection.className = 'mb-6 grid grid-cols-1 md:grid-cols-2 gap-4';
    var donutWrap = document.createElement('div');
    var donutTitle = document.createElement('h4');
    donutTitle.className = 'text-sm font-semibold text-gray-300 mb-1';
    donutTitle.textContent = 'Country / Region 분포';
    donutWrap.appendChild(donutTitle);
    var donutHint = document.createElement('p');
    donutHint.className = 'text-xs text-gray-500 mb-2';
    donutHint.textContent = '벤더 국가별 ≤12B 모델 보유 현황 — 미·중·유럽·한국·중동 분산도 확인.';
    donutWrap.appendChild(donutHint);
    var donutChart = document.createElement('div');
    donutChart.id = 'edge-llm-country-donut';
    donutChart.className = 'w-full';
    donutChart.style.height = '340px';
    donutWrap.appendChild(donutChart);
    distSection.appendChild(donutWrap);

    var classWrap = document.createElement('div');
    var classTitle = document.createElement('h4');
    classTitle.className = 'text-sm font-semibold text-gray-300 mb-1';
    classTitle.textContent = 'Country × Device Class Stacked';
    classWrap.appendChild(classTitle);
    var classHint = document.createElement('p');
    classHint.className = 'text-xs text-gray-500 mb-2';
    classHint.textContent = '국가별 device-class portfolio — 누가 어느 사이즈를 출시하고 있나.';
    classWrap.appendChild(classHint);
    var classChart = document.createElement('div');
    classChart.id = 'edge-llm-country-stack';
    classChart.className = 'w-full';
    classChart.style.height = '340px';
    classWrap.appendChild(classChart);
    distSection.appendChild(classWrap);
    host.appendChild(distSection);

    // ── D. Comparison table ──
    var tblSection = document.createElement('div');
    tblSection.className = 'mb-2';
    var tblTitle = document.createElement('h4');
    tblTitle.className = 'text-sm font-semibold text-gray-300 mb-1';
    tblTitle.textContent = '전체 비교 테이블 — 사이즈 / 성능 / 출시 / 모달리티';
    tblSection.appendChild(tblTitle);
    var tblHint = document.createElement('p');
    tblHint.className = 'text-xs text-gray-500 mb-2';
    tblHint.textContent = '컬럼 헤더 클릭 → 정렬. 디바이스 클래스 칩 클릭 → 필터. 같은 클래스 안에서 dominant 모델 비교에 사용.';
    tblSection.appendChild(tblHint);
    var filterRow = document.createElement('div');
    filterRow.id = 'edge-llm-filters';
    filterRow.className = 'flex flex-wrap gap-2 mb-2';
    tblSection.appendChild(filterRow);
    var tblWrap = document.createElement('div');
    tblWrap.id = 'edge-llm-table-wrap';
    tblWrap.className = 'overflow-x-auto bg-gray-900 border border-gray-800 rounded-lg';
    tblSection.appendChild(tblWrap);
    host.appendChild(tblSection);

    return host;
  }

  // ──────────────────────────────────────────────────────────────────────
  // Renderers.
  // ──────────────────────────────────────────────────────────────────────
  function _renderBuckets(data) {
    var grid = document.getElementById('edge-llm-buckets');
    if (!grid) return;
    grid.textContent = '';

    DEVICE_CLASSES.forEach(function(cls) {
      var members = data.filter(function(m) { return m.device === cls.code; });
      members.sort(function(a, b) {
        var aai = a.scores.aa_intelligence_index;
        var bai = b.scores.aa_intelligence_index;
        if (aai == null && bai == null) return 0;
        if (aai == null) return 1;
        if (bai == null) return -1;
        return bai - aai;
      });
      var card = document.createElement('div');
      card.className = 'bg-gray-900 border border-gray-800 rounded-lg p-3 flex flex-col cursor-pointer hover:border-blue-500 transition-colors';
      card.dataset.cls = cls.code;
      card.title = '클릭하여 ' + cls.label + ' 클래스 필터';
      card.addEventListener('click', function() {
        _state.selectedClass = (_state.selectedClass === cls.code) ? 'all' : cls.code;
        _renderFilters(data);
        _renderTable(data);
      });

      var head = document.createElement('div');
      head.className = 'flex items-center gap-2';
      var ic = document.createElement('span');
      ic.style.fontSize = '20px';
      ic.textContent = cls.icon;
      head.appendChild(ic);
      var lbl = document.createElement('span');
      lbl.className = 'text-xs font-semibold text-gray-200';
      lbl.textContent = cls.label;
      head.appendChild(lbl);
      card.appendChild(head);

      var rng = document.createElement('div');
      rng.className = 'text-xs text-blue-400 font-mono mt-1';
      rng.textContent = cls.range + ' · ' + members.length + ' 모델';
      card.appendChild(rng);

      var note = document.createElement('p');
      note.className = 'text-xs text-gray-500 mt-1';
      note.textContent = cls.note;
      card.appendChild(note);

      if (members.length > 0) {
        var top = members[0];
        var topRow = document.createElement('div');
        topRow.className = 'mt-2 pt-2 border-t border-gray-800';
        var topLbl = document.createElement('div');
        topLbl.className = 'text-xs text-gray-500';
        topLbl.textContent = 'Top AAII';
        topRow.appendChild(topLbl);
        var topNm = document.createElement('div');
        topNm.className = 'text-xs text-gray-200 font-mono truncate';
        topNm.textContent = top.id;
        topNm.title = top.id + ' · ' + top.size.toFixed(1) + 'B';
        topRow.appendChild(topNm);
        var topVal = document.createElement('div');
        topVal.className = 'text-xs text-green-400 font-bold';
        var aai = top.scores.aa_intelligence_index;
        topVal.textContent = aai != null ? ('AAII ' + Math.round(aai)) : 'AAII —';
        topRow.appendChild(topVal);
        card.appendChild(topRow);
      }

      grid.appendChild(card);
    });
  }

  function _renderPareto(data) {
    var el = document.getElementById('edge-llm-pareto');
    if (!el || typeof echarts === 'undefined') return;
    var prev = echarts.getInstanceByDom(el);
    if (prev) prev.dispose();

    // Group by device class for colored series
    var colorMap = {
      'mcu':  '#a855f7',
      'lite': '#3b82f6',
      'mid':  '#10b981',
      'high': '#f59e0b',
      'work': '#ef4444'
    };
    var series = DEVICE_CLASSES.map(function(cls) {
      var pts = data
        .filter(function(m) { return m.device === cls.code && m.scores.aa_intelligence_index != null; })
        .map(function(m) {
          return {
            value: [m.size, m.scores.aa_intelligence_index, m.id, m.country, m.vendor],
            symbolSize: Math.max(10, Math.min(28, 10 + (m.scores.aa_intelligence_index / 2.5)))
          };
        });
      return {
        name: cls.icon + ' ' + cls.label,
        type: 'scatter',
        data: pts,
        itemStyle: { color: colorMap[cls.code], opacity: 0.85, borderColor: '#0f172a', borderWidth: 1 }
      };
    });

    var chart = echarts.init(el);
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          var v = p.value;
          return '<b>' + v[2] + '</b><br/>' +
                 v[4] + ' (' + v[3] + ')<br/>' +
                 'Size: <b>' + v[0].toFixed(1) + 'B</b><br/>' +
                 'AAII: <b>' + Math.round(v[1]) + '</b>';
        }
      },
      legend: {
        textStyle: { color: '#9ca3af', fontSize: 11 },
        top: 0
      },
      grid: { left: 50, right: 24, top: 38, bottom: 50 },
      xAxis: {
        type: 'log',
        name: 'Parameters (B)',
        nameTextStyle: { color: '#9ca3af' },
        min: 0.05,
        max: 15,
        axisLabel: { color: '#9ca3af', formatter: function(v) { return v >= 1 ? v + 'B' : (v * 1000).toFixed(0) + 'M'; } },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: 'rgba(75,85,99,0.3)' } }
      },
      yAxis: {
        type: 'value',
        name: 'AAII',
        nameTextStyle: { color: '#9ca3af' },
        min: 0,
        max: 40,
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: 'rgba(75,85,99,0.3)' } }
      },
      series: series
    });
    window.addEventListener('resize', function() { chart.resize(); });
  }

  function _renderCountryDonut(data) {
    var el = document.getElementById('edge-llm-country-donut');
    if (!el || typeof echarts === 'undefined') return;
    var prev = echarts.getInstanceByDom(el);
    if (prev) prev.dispose();
    var byCountry = {};
    data.forEach(function(m) { byCountry[m.country] = (byCountry[m.country] || 0) + 1; });
    var arr = Object.keys(byCountry).map(function(c) { return { name: c, value: byCountry[c] }; })
                  .sort(function(a, b) { return b.value - a.value; });
    var chart = echarts.init(el);
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: '{b}: {c} 모델 ({d}%)'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 8, top: 'center',
        textStyle: { color: '#9ca3af', fontSize: 11 }
      },
      series: [{
        name: 'Country',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: true,
        label: { color: '#e5e7eb', fontSize: 11 },
        itemStyle: { borderColor: '#0f172a', borderWidth: 2 },
        data: arr
      }]
    });
    window.addEventListener('resize', function() { chart.resize(); });
  }

  function _renderCountryStack(data) {
    var el = document.getElementById('edge-llm-country-stack');
    if (!el || typeof echarts === 'undefined') return;
    var prev = echarts.getInstanceByDom(el);
    if (prev) prev.dispose();

    var countries = {};
    data.forEach(function(m) {
      if (!countries[m.country]) countries[m.country] = { name: m.country, total: 0 };
      countries[m.country][m.device] = (countries[m.country][m.device] || 0) + 1;
      countries[m.country].total += 1;
    });
    var sortedCountries = Object.values(countries).sort(function(a, b) { return b.total - a.total; });
    var colorMap = { 'mcu': '#a855f7', 'lite': '#3b82f6', 'mid': '#10b981', 'high': '#f59e0b', 'work': '#ef4444' };

    var series = DEVICE_CLASSES.map(function(cls) {
      return {
        name: cls.icon + ' ' + cls.label,
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        itemStyle: { color: colorMap[cls.code] },
        data: sortedCountries.map(function(c) { return c[cls.code] || 0; })
      };
    });

    var chart = echarts.init(el);
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151',
        textStyle: { color: '#e5e7eb' }
      },
      legend: { textStyle: { color: '#9ca3af', fontSize: 10 }, top: 0 },
      grid: { left: 80, right: 16, top: 38, bottom: 40 },
      xAxis: {
        type: 'value',
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: 'rgba(75,85,99,0.3)' } }
      },
      yAxis: {
        type: 'category',
        data: sortedCountries.map(function(c) { return c.name; }),
        axisLabel: { color: '#9ca3af', fontSize: 11 },
        axisLine: { lineStyle: { color: '#4b5563' } },
        inverse: true
      },
      series: series
    });
    window.addEventListener('resize', function() { chart.resize(); });
  }

  function _renderFilters(data) {
    var row = document.getElementById('edge-llm-filters');
    if (!row) return;
    row.textContent = '';
    var classes = [{ code: 'all', icon: '🔍', label: 'All' }].concat(DEVICE_CLASSES);
    classes.forEach(function(cls) {
      var chip = document.createElement('button');
      chip.type = 'button';
      var active = (_state.selectedClass === cls.code);
      chip.className = 'px-3 py-1 text-xs rounded-full border transition-colors ' +
        (active ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-500');
      var count = (cls.code === 'all') ? data.length : data.filter(function(m) { return m.device === cls.code; }).length;
      chip.textContent = cls.icon + ' ' + cls.label + ' (' + count + ')';
      chip.addEventListener('click', function() {
        _state.selectedClass = cls.code;
        _renderFilters(data);
        _renderTable(data);
      });
      row.appendChild(chip);
    });
  }

  function _renderTable(data) {
    var wrap = document.getElementById('edge-llm-table-wrap');
    if (!wrap) return;
    wrap.textContent = '';

    var filtered = (_state.selectedClass === 'all')
      ? data.slice()
      : data.filter(function(m) { return m.device === _state.selectedClass; });

    // Sort
    var key = _state.tableSortKey;
    var dir = _state.tableSortDir === 'asc' ? 1 : -1;
    filtered.sort(function(a, b) {
      var av, bv;
      switch (key) {
        case 'model':       av = a.id; bv = b.id; break;
        case 'size':        av = a.size; bv = b.size; break;
        case 'aaii':        av = a.scores.aa_intelligence_index; bv = b.scores.aa_intelligence_index; break;
        case 'mmlu_pro':    av = a.scores.mmlu_pro; bv = b.scores.mmlu_pro; break;
        case 'gpqa_diamond':av = a.scores.gpqa_diamond; bv = b.scores.gpqa_diamond; break;
        case 'country':     av = a.country; bv = b.country; break;
        case 'release':     av = a.release_date; bv = b.release_date; break;
        case 'type':        av = a.type; bv = b.type; break;
        default:            av = 0; bv = 0;
      }
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });

    var table = document.createElement('table');
    table.className = 'w-full text-xs';
    var thead = document.createElement('thead');
    thead.className = 'bg-gray-800 text-gray-300';
    var trh = document.createElement('tr');
    var cols = [
      { key: 'model',        label: 'Model',     defDir: 'asc' },
      { key: 'size',         label: 'Size',      defDir: 'desc' },
      { key: 'aaii',         label: 'AAII',      defDir: 'desc' },
      { key: 'mmlu_pro',     label: 'MMLU-Pro',  defDir: 'desc' },
      { key: 'gpqa_diamond', label: 'GPQA-D',    defDir: 'desc' },
      { key: 'country',      label: 'Country',   defDir: 'asc' },
      { key: 'release',      label: 'Released',  defDir: 'desc' },
      { key: 'type',         label: 'Type',      defDir: 'asc' },
      { key: null,           label: 'Modal',     defDir: null }
    ];
    cols.forEach(function(c) {
      var th = document.createElement('th');
      th.className = 'p-2 text-left ' + (c.key ? 'cursor-pointer hover:text-blue-400' : '');
      var ind = '';
      if (_state.tableSortKey === c.key) {
        ind = _state.tableSortDir === 'asc' ? ' ▲' : ' ▼';
      }
      th.textContent = c.label + ind;
      if (c.key) {
        th.addEventListener('click', function() {
          if (_state.tableSortKey === c.key) {
            _state.tableSortDir = (_state.tableSortDir === 'asc') ? 'desc' : 'asc';
          } else {
            _state.tableSortKey = c.key;
            _state.tableSortDir = c.defDir;
          }
          _renderTable(data);
        });
      }
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    filtered.forEach(function(m, idx) {
      var tr = document.createElement('tr');
      tr.className = (idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850') + ' border-t border-gray-800 hover:bg-gray-800';
      var cells = [
        m.id,
        m.size.toFixed(1) + 'B',
        m.scores.aa_intelligence_index != null ? Math.round(m.scores.aa_intelligence_index) : '—',
        m.scores.mmlu_pro != null ? m.scores.mmlu_pro.toFixed(1) + '%' : '—',
        m.scores.gpqa_diamond != null ? m.scores.gpqa_diamond.toFixed(1) + '%' : '—',
        m.country,
        m.release_date || '—',
        m.type || '—',
        (m.modalities || []).map(function(x) {
          switch (x) {
            case 'text': return '📝';
            case 'image': return '🖼️';
            case 'audio': return '🎵';
            case 'video': return '🎬';
            case 'audio-tts': return '🔊';
            case 'audio-transcription': return '🎙️';
            default: return '·';
          }
        }).join('')
      ];
      cells.forEach(function(v, ci) {
        var td = document.createElement('td');
        td.className = 'p-2 ' + (ci === 0 ? 'font-mono text-gray-200' : 'text-gray-300');
        if (ci === 2 && v !== '—') td.className += ' text-green-400 font-semibold';
        if (ci === 7 && v !== '—') {
          // type badge
          var badge = document.createElement('span');
          badge.className = 'px-2 py-0.5 rounded text-xs ' +
            (v.indexOf('open') === 0 ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300');
          badge.textContent = v;
          td.appendChild(badge);
        } else {
          td.textContent = v;
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);

    // Footer count
    var footer = document.createElement('div');
    footer.className = 'text-xs text-gray-500 p-2 border-t border-gray-800';
    footer.textContent = filtered.length + ' / ' + data.length + ' 모델 표시';
    wrap.appendChild(footer);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Public API.
  // ──────────────────────────────────────────────────────────────────────
  function render() {
    var host = _ensureSection();
    if (!host) return;
    var data = _buildIndex();
    _state.modelsBySize = data;
    if (data.length === 0) {
      host.textContent = '';
      var msg = document.createElement('div');
      msg.className = 'text-sm text-gray-400 italic p-4 bg-gray-900 border border-gray-800 rounded';
      msg.textContent = '≤12B 모델 데이터를 찾을 수 없습니다. App.data가 로드된 후 다시 시도해주세요.';
      host.appendChild(msg);
      host.dataset.built = '';
      return;
    }
    _renderBuckets(data);
    _renderPareto(data);
    _renderCountryDonut(data);
    _renderCountryStack(data);
    _renderFilters(data);
    _renderTable(data);
  }

  root.EdgeLLM = {
    render: render,
    DEVICE_CLASSES: DEVICE_CLASSES,
    _parseSize: _parseSize,
    _country: _country
  };
})(typeof window !== 'undefined' ? window : globalThis);
