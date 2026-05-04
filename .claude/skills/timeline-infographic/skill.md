---
name: timeline-infographic
description: "시간순 이벤트(모델 출시, 제품 릴리즈, 컨퍼런스, 마일스톤 등)를 월별 컬럼 + 카드 레이아웃의 SVG 인포그래픽으로 시각화하는 작업에 사용한다. '타임라인 인포그래픽 만들어줘', '월별 출시 모델 그래프', '릴리즈 타임라인 시각화', 'release timeline chart', '시간순 이벤트 인포그래픽' 같은 요청 시 활용한다. 가로형 16:9 레이아웃, 월별 색상 구분, 좌→우 시간 진행, 카드형 이벤트 표시, 모호한 표현 금지(정확한 버전명 필수), PNG/SVG/CSV 다운로드를 일관된 규칙으로 만들어낸다. 단, 인터랙티브 차트 라이브러리(ECharts/Chart.js/D3 force layout)가 필요한 경우나, 시계열 수치 데이터(주가/지표)는 이 스킬의 범위가 아니다."
---

# Timeline Infographic — 월별 카드형 인포그래픽 제작 가이드

이벤트 리스트를 받아 가로형 SVG 인포그래픽을 생성하는 작업에 적용하는 규칙. 핵심 사상은 "**한 화면 내에서 모든 이벤트를 빠짐없이 보여주되 카드 간 겹침은 없게**"다.

## When to use this skill

- 모델/제품/릴리즈/마일스톤을 시간순으로 정리해 한눈에 비교하는 인포그래픽 요청
- 가로형 SVG 다운로드(PNG/SVG)가 필요한 경우
- ECharts/D3 같은 인터랙티브 라이브러리 없이 vanilla SVG로 만들어야 할 때
- 사용자가 "월별 컬럼", "타임라인", "릴리즈 인포그래픽" 같은 키워드를 사용할 때

**Use 안 함:**
- 시계열 수치(주가, 지표) → ECharts 라인 차트가 적합
- 노드 간 관계도 → D3 force layout 적합
- 인터랙티브 필터링이 무거운 경우 → 차트 라이브러리 사용

## 핵심 규칙 (Hard Rules)

### 1. 데이터 정확성

- **정확한 버전명 필수**: `gpt-5.2` ✅, "GPT-5 계열" ❌, "신규 버전" ❌
- **이벤트 출처 모두 1차 출처**: 벤더 공식 발표, 공식 페이퍼, 1차 출처 페이지에서만 추출
- **임의 데이터 추가 금지**: 사용자 데이터에 없는 항목을 채우지 않는다
- **모호한 표현 금지**: "업데이트", "신규 기능", "최신 모델" 같은 표현 차단

### 2. 레이아웃

- **가로 16:9 SVG viewBox** (예: `0 0 1920 1080`); 카드 수에 따라 동적 확장
- **월별 컬럼 배치**: 좌측 = 가장 오래된 월, 우측 = 가장 최신 월
- **컬럼 너비 가변** (busy month는 넓게, 한산한 month는 좁게):
  - 1~14 이벤트: 1 sub-column (≈280px)
  - 15~28 이벤트: 2 sub-columns (≈566px)
  - 29~42 이벤트: 3 sub-columns (≈852px)
  - 43+ 이벤트: 4 sub-columns (≈1138px)
- **컬럼 내부 정렬**: 같은 월 안에서 날짜 오름차순 (이른 날짜 = 좌상단, 늦은 날짜 = 우하단). column-major fill로 sub-column에 분배.
- **카드 사이 간격 일정 유지** (CARD_GAP 6~8px)
- **카드 겹침 0**: 모든 이벤트가 보일 때까지 sub-column을 늘리거나 카드 높이를 줄인다

### 3. 색상 시스템

- **월별 12색 팔레트** (Jan~Dec, 한 바퀴):
  ```
  Jan #3b82f6 blue        Jul #14b8a6 teal
  Feb #8b5cf6 violet      Aug #84cc16 lime
  Mar #ec4899 pink        Sep #eab308 amber
  Apr #f97316 orange      Oct #f43f5e rose
  May #10b981 emerald     Nov #a855f7 purple
  Jun #0ea5e9 sky         Dec #06b6d4 cyan
  ```
- 같은 월 카드는 같은 accent 컬러 (좌측 stripe, 헤더 pill, MM.DD 텍스트, 노드 모두 동일)
- 라이선스 pill 배경:
  ```
  proprietary  bg #fef2f2 fg #b91c1c
  open-weight  bg #f0fdf4 fg #15803d
  open-source  bg #eff6ff fg #1d4ed8
  ```

### 4. 카드 4-코너 레이아웃 (필수 준수)

```
┌────────────────────────────┐
│ [Logo]      [MM.DD]        │  ← 좌상단: 벤더 로고 타일 / 우상단: 날짜
│  Model Name (정확한 버전)   │
│  Vendor Name                │
│ [License] Country  [🇺🇸]   │  ← 좌하단: 라이선스 / 중하단: 국가명 / 우하단: 국기
└────────────────────────────┘
```

겹침 방지의 핵심 원칙:
- **국기와 날짜는 같은 코너에 두지 않는다.** 사용자가 가장 자주 지적하는 회귀 포인트
- 국기 = 28×28 슬레이트-50 타일, 24px emoji 중앙 정렬, 우하단
- 날짜 = MM.DD 형식, 15px bold, 월 accent 컬러, 우상단 단독
- 국가명 라벨은 license badge 끝부터 flag tile 시작 직전까지의 가용 너비를 측정해 자동 ellipsis

### 5. 헤더 / 타임라인 axis

- 컬럼 상단 둥근 pill (rx=8) — 월 컬러 + 흰색 글자로 "월 이름 + 출시 건수" 표시
- 메인 타임라인 axis: 헤더 아래 슬레이트-300 가로선 (2px) + 컬럼 중앙마다 7px 원형 노드 (월 컬러 + 흰색 stroke)
- 노드에서 첫 카드까지 점선 connector (dasharray 3,3)

### 6. 푸터 (다운로드 시 attribution)

3-요소 2줄 footer (PNG/SVG export 시 함께 저장됨):
- **좌상단 1행** (12px / weight 600 / slate-600): `Author: <Name> · <Email>`
- **좌하단 2행** (11px / slate-500): `Source: <URL> · data verified against ...`
- **우하단 2행** (11px / slate-400 / right-aligned): `Generated YYYY-MM-DD`
- PAD_BOTTOM 70px 이상 확보

### 7. 다운로드 메뉴 (필수)

3가지 포맷 버튼 — 사용자가 매번 요구한다:
- **⬇ PNG**: SVG → Image → Canvas 2x scale → Blob (raster, 고해상도)
- **⬇ SVG**: XMLSerializer 직렬화 → Blob (vector, 편집 가능)
- **⬇ CSV**: 원본 데이터 (`date, id, name, vendor, country, type` 등) RFC 4180 escaping

PNG export 시 viewBox를 그대로 native 해상도로 raster (1920×1080 → 3840×2160 @ 2x).

### 8. 호스트 컨테이너 — 스크롤 없음

```html
<div class="bg-white rounded border overflow-hidden">
  <svg viewBox="0 0 W H" width="100%" style="display:block; height:auto;"
       preserveAspectRatio="xMidYMid meet">
```

- `overflow: hidden` — 절대 스크롤바 만들지 않는다
- SVG `width="100%"` + `height="auto"` + viewBox로 비율 유지하며 폭에 맞춰 축소
- 좁은 viewport에서도 모든 카드 보이도록 viewBox 좌표계가 비례 축소

## 구현 절차

### Step 1: 데이터 수집

1. 사용자가 이벤트 리스트(혹은 데이터 소스 포인터) 제공
2. 각 이벤트에 필수 필드: `date` (YYYY-MM-DD), `id` (unique), `name` (정확한 버전), `vendor` (회사명), `country` (국가, flag emoji 포함), `type` (라이선스/카테고리 — optional)
3. 출시일 검증: `version-vs-date contradiction audit` 권장 (버전 v_n+1이 v_n보다 늦은 날짜인지 확인)

### Step 2: 월 버킷팅

```js
function bucketByMonth(entries, monthsBack) {
  var now = new Date();
  var months = [];
  for (var i = monthsBack - 1; i >= 0; i--) {
    var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    var ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    months.push({ ym: ym, month: d.getMonth(), label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }), color: MONTH_COLORS[d.getMonth()], entries: [] });
  }
  entries.forEach(function(e) { /* push into matching month */ });
  // 컬럼 내부 정렬: 날짜 오름차순
  months.forEach(function(c) { c.entries.sort(function(a, b) { return a.ts - b.ts; }); });
  return months;
}
```

### Step 3: 동적 너비/높이 계산

```js
function subColsForMonth(n) {
  if (n <= 14) return 1;
  if (n <= 28) return 2;
  if (n <= 42) return 3;
  return 4;
}
months.forEach(function(c) {
  c.subCols = subColsForMonth(c.entries.length);
  c.width = c.subCols * CARD_W_BASE + (c.subCols - 1) * SUBCOL_GAP;
});
// 카드 높이는 globalLayout이 busiest month 기준으로 84/76/72/68/64 중 선택
// SVG_W = 패딩 + 모든 컬럼 너비 + 컬럼간 간격
// SVG_H = 패딩 + 헤더 + axis + maxStack * (cardH + gap) + 푸터
```

### Step 4: SVG 렌더링

순서대로:
1. 흰 배경 `<rect fill="#ffffff" width="100%" height="100%">`
2. 타이틀 + 부제 (가운데 정렬)
3. 메인 가로 axis line + 컬럼별 노드/connector
4. 월별 컬럼 헤더 pill (월 컬러)
5. 컬럼 내 카드 (column-major sub-column fill)
6. 푸터 (저자/출처/날짜)

각 카드:
1. White bg + slate-200 border + 좌측 4px accent stripe (월 컬러)
2. 좌상단 36×36 벤더 로고 타일 (벤더 해시 색 + 첫글자)
3. 우상단 MM.DD 날짜 (15px bold, 월 컬러)
4. 모델명 (vendor prefix 제거, 26자 truncate, hover `<title>`로 full name)
5. 벤더명 (smaller, slate)
6. 좌하단 라이선스 pill
7. 중하단 국가명 라벨 (가용 너비 측정해 ellipsis)
8. 우하단 28×28 flag tile (24px emoji)
9. 투명 click rect + Modal 라우팅

### Step 5: 다운로드 핸들러

```js
function downloadPNG(svg, filename) {
  var viewBox = svg.getAttribute('viewBox').split(/\s+/);
  var nativeW = parseFloat(viewBox[2]), nativeH = parseFloat(viewBox[3]);
  var svgStr = new XMLSerializer().serializeToString(svg);
  var img = new Image();
  var url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml' }));
  img.onload = function() {
    var canvas = document.createElement('canvas');
    canvas.width = nativeW * 2;
    canvas.height = nativeH * 2;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function(blob) { triggerDownload(URL.createObjectURL(blob), filename + '.png'); }, 'image/png');
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
```

## 검증 체크리스트 (구현 후 항상 실행)

Playwright로 한 번에 실행해 모든 항목 통과 확인:

```js
// 1. SVG 렌더링됨
const svg = host.querySelector('svg');
assert(svg);

// 2. 모든 카드 렌더링 (truncation 0)
const cards = svg.querySelectorAll('rect[rx="6"][fill="#ffffff"]').length;
assert(cards === expectedCount);

// 3. '+N more' truncation pill 0개
const truncated = Array.from(svg.querySelectorAll('text')).filter(t => /^\+\d+ more$/.test(t.textContent));
assert(truncated.length === 0);

// 4. 호스트 스크롤 없음
const host = document.getElementById('timeline-infographic-host');
assert(host.scrollHeight <= host.offsetHeight && host.scrollWidth <= host.offsetWidth);

// 5. 4-코너 레이아웃 (flag at bottom-right, date at top-right, no overlap)
// 첫 카드 검사: flag y > h/2, date y < h/2, |flag.y - date.y| > 20

// 6. Footer 3요소 모두 존재
const author = allText.find(t => t.includes('@'));
const source = allText.find(t => /^Source:/.test(t));
const stamp = allText.find(t => /^Generated /.test(t));
assert(author && source && stamp);

// 7. PNG export valid
const dataUrl = chart.getDataURL ? chart.getDataURL(...) : null;
assert(svgStr.length > 1000);
```

## 자주 회귀하는 실수 (Anti-patterns)

1. **카드 truncation `+N more`** — busy month에서 일부만 보이는 회귀. 항상 sub-column fan-out으로 모두 표시
2. **국기와 날짜 같은 코너** — 우상단 둘 다 두면 겹친다. 항상 4 코너로 분리
3. **모호한 모델명** — "GPT-5 계열", "신규 Claude" 같은 표현. 항상 정확한 버전 ID
4. **Tailwind arbitrary value 의존** — `h-[520px]` 같은 JIT 문법은 CDN에서 작동 안 함. 인라인 스타일 사용
5. **innerHTML 사용** — security hook이 차단함. `document.createElement` + `appendChild`로 안전한 DOM 구성
6. **PNG export 고정 해상도** — viewBox가 동적으로 변하는데 1920×1080 고정으로 raster 하면 잘림. native 해상도 사용
7. **호스트 overflow:auto** — 사용자가 명시적으로 "스크롤 없게"를 요구하므로 `overflow:hidden` + viewBox 비례 축소
8. **컬럼 너비 일률** — 한산한 월도 넓게 만들면 공간 낭비. busy/quiet에 따라 가변 너비
9. **footer attribution 누락** — 다운로드한 PNG/SVG가 배포될 때 출처를 잃는다. 항상 author + source URL + 생성 날짜 3요소

## Output 형식

작업 완료 시 사용자에게 보고할 항목:
- 렌더링된 카드 수 / 전체 이벤트 수 (예: 114/114)
- SVG viewBox 크기 (예: 3064×1490)
- 컬럼별 너비 분포 (가변 너비 적용 결과)
- 다운로드 검증 (PNG/SVG/CSV 각각 valid한지)
- 4-코너 레이아웃 검증 (flag/date 겹침 없음)
- 푸터 attribution 포함 여부
