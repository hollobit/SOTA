/* Price tab — 3D "all-metric skyline" (three.js).
 *
 * One integrated view of every priced model against every metric at once:
 *   X = models ordered by token price (floor stripes = price bands),
 *   Z = metric rows (front row "★ 종합" = mean percentile over the metrics a model has),
 *   Y = the model's percentile inside that metric (lower-is-better metrics flipped).
 * Below the floor a front row of bars hangs down with the (log) price itself, so
 * "what you pay" and "what you get" read off the same column.
 * The "가격대별" mode collapses the columns into price bands (best or median per band).
 *
 * Model set, prices, vendor colours and filters come from Price3D.util.pricedModels(),
 * so this view always agrees with the 2D chart and the metric corridor.
 */
window.PriceSky = (function () {
    'use strict';

    var BG = 0x0b1220, HMAX = 5, ROW = 0.62, MIN_COV_METRIC = 5;
    var BANDS = [
        { lo: 0, hi: 0.1, label: '< $0.1' }, { lo: 0.1, hi: 0.3, label: '$0.1–0.3' }, { lo: 0.3, hi: 1, label: '$0.3–1' },
        { lo: 1, hi: 3, label: '$1–3' }, { lo: 3, hi: 10, label: '$3–10' }, { lo: 10, hi: 30, label: '$10–30' },
        { lo: 30, hi: Infinity, label: '≥ $30' }
    ];
    // Perceptual "cold → hot" ramp: low percentile = deep blue, top = red.
    var RAMP = [[0, '#1e3a8a'], [0.3, '#0ea5e9'], [0.55, '#22c55e'], [0.75, '#facc15'], [0.9, '#f97316'], [1, '#ef4444']];

    var THREE = null, U = null;
    var st = null, data = null, ui = {}, visible = false, wired = false, flight = null;
    var opt = { mode: 'model', sort: 'price', agg: 'max', color: 'perf', minCov: 6, spin: false };
    var hover = null, searchModel = null, rampCols = null;
    var flat = 0, flatTo = 0;              // 0 = bars, 1 = flat heatmap tiles (top view)

    function $(id) { return document.getElementById(id); }
    function bandOf(p) { for (var i = 0; i < BANDS.length; i++) if (p >= BANDS[i].lo && p < BANDS[i].hi) return i; return BANDS.length - 1; }
    function pctStr(x) { return Math.round(x * 100) + '%'; }
    function rampColor(t, out) {
        if (!rampCols) rampCols = RAMP.map(function (r) { return [r[0], new THREE.Color(r[1])]; });
        t = Math.max(0, Math.min(1, t));
        for (var i = 1; i < rampCols.length; i++) {
            if (t <= rampCols[i][0]) {
                var a = rampCols[i - 1], b = rampCols[i], f = (t - a[0]) / (b[0] - a[0]);
                return out.copy(a[1]).lerp(b[1], f);
            }
        }
        return out.copy(rampCols[rampCols.length - 1][1]);
    }

    // ------------------------------------------------------------------ data
    function buildData() {
        var api = Price.api, idx = api.scoreIdx();
        var pm = U.pricedModels(), priced = pm.models;

        // Percentile of every priced model inside every metric (computed over all priced models,
        // so a model's percentile does not change when the coverage slider hides others).
        var metrics = [];
        api.metrics.forEach(function (def) {
            var mp = idx[def[0]] || {}, pts = [];
            Object.keys(mp).forEach(function (id) { if (priced[id]) pts.push({ id: id, v: +mp[id] }); });
            if (pts.length < 8) return;
            var inv = U.lowerBetter(def[0]);
            pts.sort(function (a, b) { return inv ? a.v - b.v : b.v - a.v; });
            var cells = {}, n = pts.length, rank = 0;
            pts.forEach(function (p, i) {
                if (i === 0 || p.v !== pts[i - 1].v) rank = i + 1;          // ties share a rank
                cells[p.id] = { v: p.v, rank: rank, pct: n > 1 ? 1 - (rank - 1) / (n - 1) : 1 };
            });
            metrics.push({ id: def[0], label: def[1], cat: def[2], inv: inv, n: n, cells: cells });
        });

        // Models with enough metric coverage.
        var models = [];
        Object.keys(priced).forEach(function (id) {
            var cov = 0, sum = 0;
            metrics.forEach(function (m) { var c = m.cells[id]; if (c) { cov++; sum += c.pct; } });
            if (cov < opt.minCov) return;
            var o = priced[id];
            models.push({ id: id, name: o.name, vendor: o.vendor, color: o.color, price: o.price, rel: o.rel,
                          cov: cov, comp: sum / cov, band: bandOf(o.price) });
        });
        // Rows: metrics that still have a few models after the coverage cut.
        var inSet = {}; models.forEach(function (m) { inSet[m.id] = 1; });
        metrics = metrics.filter(function (m) { return Object.keys(m.cells).filter(function (id) { return inSet[id]; }).length >= MIN_COV_METRIC; });
        // Composite on the surviving rows only.
        models.forEach(function (mo) {
            var cov = 0, sum = 0;
            metrics.forEach(function (m) { var c = m.cells[mo.id]; if (c) { cov++; sum += c.pct; } });
            mo.cov = cov; mo.comp = cov ? sum / cov : 0;
        });
        models = models.filter(function (m) { return m.cov > 0; });
        var byComp = models.slice().sort(function (a, b) { return b.comp - a.comp; });
        byComp.forEach(function (m, i) { m.compRank = i + 1; });

        var sorters = {
            price: function (a, b) { return a.price - b.price || b.comp - a.comp; },
            comp: function (a, b) { return b.comp - a.comp; },
            vendor: function (a, b) { return a.vendor < b.vendor ? -1 : a.vendor > b.vendor ? 1 : a.price - b.price; },
            value: function (a, b) { return valueScore(b) - valueScore(a); }
        };
        models.sort(sorters[opt.sort] || sorters.price);

        var ps = models.map(function (m) { return m.price; });
        var lmin = ps.length ? Math.log10(Math.min.apply(null, ps)) : -2, lmax = ps.length ? Math.log10(Math.max.apply(null, ps)) : 2;
        if (lmax - lmin < 0.5) lmax = lmin + 0.5;

        // Band summaries.
        var bands = BANDS.map(function (b, i) { return { i: i, label: b.label, models: [] }; });
        models.forEach(function (m) { bands[m.band].models.push(m); });
        bands = bands.filter(function (b) { return b.models.length; });
        bands.forEach(function (b) {
            var cs = b.models.map(function (m) { return m.comp; }).sort(function (x, y) { return x - y; });
            b.median = cs[Math.floor((cs.length - 1) / 2)] * 0.5 + cs[Math.ceil((cs.length - 1) / 2)] * 0.5;
            b.top = b.models.slice().sort(function (x, y) { return y.comp - x.comp; }).slice(0, 3);
            b.best = b.top[0];
        });
        return { models: models, metrics: metrics, bands: bands, lmin: lmin, lmax: lmax, basis: pm.basis, total: Object.keys(priced).length };
    }
    // "Value" = composite percentile per decade of price above the cheapest ($0.01 → 0).
    function valueScore(m) { return m.comp / (Math.log10(Math.max(m.price, 0.01)) + 3); }

    // Band-mode cell: best or median percentile among a band's models for one metric.
    function bandCell(b, row) {
        var arr = [];
        b.models.forEach(function (m) {
            var c = row ? row.cells[m.id] : { pct: m.comp, v: m.comp };
            if (c) arr.push({ m: m, pct: c.pct, v: c.v, rank: c.rank });
        });
        if (!arr.length) return null;
        arr.sort(function (x, y) { return y.pct - x.pct; });
        var pct = opt.agg === 'max' ? arr[0].pct : arr[Math.floor((arr.length - 1) / 2)].pct * 0.5 + arr[Math.ceil((arr.length - 1) / 2)].pct * 0.5;
        return { pct: pct, top: arr.slice(0, 3), n: arr.length };
    }

    // ---------------------------------------------------------------- scene
    function initScene() {
        var host = $('pricesky-canvas');
        var r = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        r.setSize(host.clientWidth, host.clientHeight);
        r.setClearColor(BG, 1);
        host.appendChild(r.domElement);
        var scene = new THREE.Scene();
        scene.fog = new THREE.Fog(BG, 45, 120);
        var cam = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.1, 500);
        var Controls = U.controls();
        var controls = new Controls(cam, r.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.08;
        controls.maxDistance = 110; controls.minDistance = 4; controls.maxPolarAngle = Math.PI * 0.495;
        controls.autoRotateSpeed = 0.6;
        scene.add(new THREE.HemisphereLight(0xdbeafe, 0x0b1220, 0.75));
        var dl = new THREE.DirectionalLight(0xffffff, 1.15); dl.position.set(-12, 22, 16); scene.add(dl);
        var rl = new THREE.DirectionalLight(0x7c9cff, 0.35); rl.position.set(14, 6, -12); scene.add(rl);
        st = { renderer: r, scene: scene, camera: cam, controls: controls, raycaster: new THREE.Raycaster(), pointer: new THREE.Vector2(),
               group: null, mesh: null, cells: null, hi: null };
        new ResizeObserver(function () {
            if (!host.clientWidth) return;
            r.setSize(host.clientWidth, host.clientHeight);
            cam.aspect = host.clientWidth / host.clientHeight; cam.updateProjectionMatrix();
        }).observe(host);
        new IntersectionObserver(function (entries) {
            var on = entries[0].isIntersecting && !document.hidden;
            if (on && !visible) { visible = true; loop(); } else if (!on) visible = false;
        }).observe(host);
        r.domElement.addEventListener('pointermove', onPointerMove);
        r.domElement.addEventListener('pointerleave', function () { setHover(null); controls.enableZoom = false; });
        // Wheel zoom only after the canvas is clicked, so scrolling the page past the view never gets trapped.
        controls.enableZoom = false;
        r.domElement.addEventListener('pointerdown', function () { controls.enableZoom = true; });
        r.domElement.addEventListener('click', onClick);
        r.domElement.addEventListener('pointerdown', function () { flight = null; });
    }

    // Layout: columns along X, rows along -Z, composite row at the front (z = +gap).
    function layout() {
        var bandMode = opt.mode === 'band';
        var nCol = bandMode ? data.bands.length : data.models.length;
        var dx = bandMode ? 2.4 : 0.36;
        var fw = bandMode ? 1.7 : 0.27, fd = bandMode ? 0.46 : 0.44;
        var width = nCol * dx;
        return { bandMode: bandMode, nCol: nCol, dx: dx, fw: fw, fd: fd, width: width,
                 x: function (c) { return -width / 2 + dx * (c + 0.5); },
                 z: function (r) { return r < 0 ? 1.0 : -r * ROW; },          // r = -1 → composite row
                 depth: data.metrics.length * ROW };
    }

    function build() {
        data = buildData();
        if (st.group) U.disposeGroup(st.group);
        if (st.hi) st.hi = null;
        var g = new THREE.Group(); st.group = g; st.scene.add(g);
        if (!data.models.length || !data.metrics.length) { renderHud(); return; }
        var L = layout(); data.L = L;

        // --- cells (one InstancedMesh of unit boxes with their base at y = 0)
        var cells = [];
        var rows = [-1].concat(data.metrics.map(function (_, i) { return i; }));
        if (L.bandMode) {
            data.bands.forEach(function (b, c) {
                rows.forEach(function (r) {
                    var bc = bandCell(b, r < 0 ? null : data.metrics[r]);
                    cells.push({ col: c, row: r, band: b, bc: bc, pct: bc ? bc.pct : 0, missing: !bc });
                });
            });
        } else {
            data.models.forEach(function (m, c) {
                rows.forEach(function (r) {
                    var cell = r < 0 ? { pct: m.comp } : data.metrics[r].cells[m.id];
                    cells.push({ col: c, row: r, model: m, cell: cell || null, pct: cell ? cell.pct : 0, missing: !cell });
                });
            });
        }
        var box = new THREE.BoxGeometry(1, 1, 1); box.translate(0, 0.5, 0);
        var mesh = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.1 }), cells.length);
        g.add(mesh); st.mesh = mesh; st.cells = cells;

        // --- price bars hanging below the floor in front of the composite row
        var pBox = new THREE.BoxGeometry(1, 1, 1); pBox.translate(0, -0.5, 0);
        var cols = L.bandMode ? data.bands.map(function (b) {
            var ps = b.models.map(function (m) { return m.price; }).sort(function (x, y) { return x - y; });
            return ps[Math.floor(ps.length / 2)];
        }) : data.models.map(function (m) { return m.price; });
        var pm = new THREE.InstancedMesh(pBox, new THREE.MeshStandardMaterial({ color: 0xa78bfa, roughness: 0.5, transparent: true, opacity: 0.85 }), cols.length);
        var M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), S = new THREE.Vector3();
        cols.forEach(function (p, c) {
            var h = 0.15 + 2.6 * (Math.log10(p) - data.lmin) / (data.lmax - data.lmin);
            P.set(L.x(c), -0.02, 2.1); S.set(L.fw, h, 0.44); M.compose(P, Q, S); pm.setMatrixAt(c, M);
        });
        g.add(pm);
        var pl = U.textSprite('▼ 토큰 가격 (' + data.basis + ', log)', { size: 30, color: '#c4b5fd', scale: 0.012, center: [1, 0.5] });
        pl.position.set(-L.width / 2 - 0.4, -0.6, 2.1); g.add(pl);

        // --- floor: price-band stripes (model mode) or plain plate (band mode)
        var zFront = 2.5, zBack = -L.depth + ROW * 0.3;
        if (!L.bandMode) {
            var start = 0, lastBand = null;
            for (var c = 1; c <= data.models.length; c++) {
                if (c < data.models.length && data.models[c].band === data.models[start].band && opt.sort === 'price') continue;
                if (opt.sort !== 'price') { start = c; continue; }
                var x0 = L.x(start) - L.dx / 2, x1 = L.x(c - 1) + L.dx / 2, bi = data.models[start].band;
                var tile = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, zFront - zBack),
                    new THREE.MeshBasicMaterial({ color: bi % 2 ? 0x1e293b : 0x172554, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
                tile.rotation.x = -Math.PI / 2; tile.position.set((x0 + x1) / 2, -0.01, (zFront + zBack) / 2); g.add(tile);
                var bl = U.textSprite(BANDS[bi].label, { size: 34, bold: true, color: '#93c5fd', scale: 0.012, center: [0.5, 1] });
                var bx = (x0 + x1) / 2, drop = lastBand !== null && bx - lastBand.x < 3.2 && !lastBand.low;
                bl.position.set(bx, drop ? -3.65 : -2.95, 2.1); g.add(bl);
                lastBand = { x: bx, low: drop };
                var sep = new THREE.BufferGeometry(); sep.setAttribute('position', new THREE.Float32BufferAttribute([x0, 0, zFront, x0, 0, zBack], 3));
                g.add(new THREE.Line(sep, new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.5 })));
                start = c;
            }
            if (opt.sort !== 'price') {
                var fl = new THREE.Mesh(new THREE.PlaneGeometry(L.width, zFront - zBack),
                    new THREE.MeshBasicMaterial({ color: 0x172554, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
                fl.rotation.x = -Math.PI / 2; fl.position.set(0, -0.01, (zFront + zBack) / 2); g.add(fl);
            }
        } else {
            data.bands.forEach(function (b, c) {
                var tile = new THREE.Mesh(new THREE.PlaneGeometry(L.dx * 0.92, zFront - zBack),
                    new THREE.MeshBasicMaterial({ color: c % 2 ? 0x1e293b : 0x172554, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
                tile.rotation.x = -Math.PI / 2; tile.position.set(L.x(c), -0.01, (zFront + zBack) / 2); g.add(tile);
                var bl = U.textSprite(b.label + '  (' + b.models.length + ')', { size: 34, bold: true, color: '#93c5fd', scale: 0.013, center: [0.5, 1] });
                bl.position.set(L.x(c), -2.95, 2.1); g.add(bl);
            });
        }

        // --- row labels (left) and a back wall scale
        var catPrev = null;
        rows.forEach(function (r) {
            var txt = r < 0 ? '★ 종합 (평균 백분위)' : data.metrics[r].label + (data.metrics[r].inv ? ' ↓' : '');
            var s = U.textSprite(txt, { size: r < 0 ? 34 : 28, bold: r < 0, color: r < 0 ? '#fde68a' : '#cbd5e1', scale: 0.0115, center: [1, 0.5] });
            s.position.set(-L.width / 2 - 0.35, 0.12, L.z(r)); g.add(s);
            if (r >= 0 && data.metrics[r].cat !== catPrev) {
                catPrev = data.metrics[r].cat;
                var cs = U.textSprite(catPrev, { size: 26, color: '#64748b', scale: 0.011, center: [0, 0.5] });
                cs.position.set(L.width / 2 + 0.35, 0.12, L.z(r)); g.add(cs);
            }
        });
        var wp = [];
        [0.25, 0.5, 0.75, 1].forEach(function (t) {
            var y = t * HMAX; wp.push(-L.width / 2, y, zBack, L.width / 2, y, zBack);
            var s = U.textSprite(pctStr(t), { size: 26, color: '#64748b', scale: 0.011, center: [1, 0.5] });
            s.position.set(-L.width / 2 - 0.25, y, zBack); g.add(s);
        });
        var wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3));
        g.add(new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.6 })));

        // --- names above the composite row: top composite models (model mode) / best per band (band mode)
        var named = [];
        if (L.bandMode) {
            data.bands.forEach(function (b, c) {
                var bc = bandCell(b, null); if (!bc) return;
                var s = U.textSprite(bc.top[0].m.name, { size: 28, color: '#f8fafc', bg: 'rgba(15,23,42,0.75)', scale: 0.0105, center: [0.5, 0] });
                s.position.set(L.x(c), HMAX * bc.pct + 0.25, L.z(-1)); s.userData.tall = 1; g.add(s);
            });
        } else {
            data.models.slice().sort(function (a, b) { return a.compRank - b.compRank; }).forEach(function (m) {
                if (named.length >= 8) return;
                var c = data.models.indexOf(m), x = L.x(c);
                var lvl = 0; while (named.some(function (q) { return q.l === lvl && Math.abs(q.x - x) < 4.2; })) lvl++;
                if (lvl > 4) return;
                named.push({ x: x, l: lvl });
                var s = U.textSprite(m.name, { size: 28, color: '#f8fafc', bg: 'rgba(15,23,42,0.75)', scale: 0.0105, center: [0.5, 0] });
                s.position.set(x, HMAX * m.comp + 0.35 + lvl * 0.6, L.z(-1)); s.userData.tall = 1; g.add(s);
                var lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute([x, HMAX * m.comp, L.z(-1), x, HMAX * m.comp + 0.35 + lvl * 0.6, L.z(-1)], 3));
                var ln = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.5 })); ln.userData.tall = 1; g.add(ln);
            });
        }

        applyStyles();
        renderHud();
        camPreset(data.camPreset || 'bird', true);
    }

    // Colour + size every cell; the hovered model's column and metric's row stay lit, the rest dim.
    function applyStyles(quick) {
        if (!st.mesh || !data || !data.L) return;
        var L = data.L, M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), S = new THREE.Vector3();
        var c = new THREE.Color(), bg = new THREE.Color(BG), miss = new THREE.Color(0x273449), gold = new THREE.Color(0xfde68a);
        var focusCol = hover ? hover.col : -1, focusRow = hover ? hover.row : null;
        if (searchModel && !L.bandMode) { var si = data.models.map(function (m) { return m.id; }).indexOf(searchModel); if (si >= 0 && focusCol < 0) focusCol = si; }
        st.cells.forEach(function (k, i) {
            var h = k.missing ? 0.03 : (0.04 + HMAX * k.pct) * (1 - flat) + 0.06 * flat;
            var shrink = k.row < 0 ? 1 : 0.92;
            P.set(L.x(k.col), 0, L.z(k.row)); S.set(L.fw * shrink, h, L.fd * shrink); M.compose(P, Q, S); st.mesh.setMatrixAt(i, M);
            if (k.missing) c.copy(miss);
            else if (opt.color === 'vendor' && !L.bandMode) c.set(k.model.color);
            else rampColor(k.pct, c);
            if (k.row < 0 && !k.missing && opt.color === 'perf') c.lerp(gold, 0.18);
            var lit = focusCol < 0 || k.col === focusCol || (focusRow !== null && k.row === focusRow);
            if (!lit) c.lerp(bg, 0.7);
            else if (focusCol >= 0 && k.col === focusCol && !k.missing) c.lerp(new THREE.Color(0xffffff), 0.12);
            st.mesh.setColorAt(i, c);
        });
        st.mesh.instanceMatrix.needsUpdate = true; if (st.mesh.instanceColor) st.mesh.instanceColor.needsUpdate = true;
        st.group.children.forEach(function (o) { if (o.userData.tall) o.visible = flat < 0.5; });
        if (!quick) drawFocusLabel(focusCol);
    }

    function drawFocusLabel(col) {
        if (st.hi) { U.disposeGroup(st.hi); st.hi = null; }
        if (col < 0 || !data.L) return;
        var L = data.L, txt, h;
        if (L.bandMode) { var b = data.bands[col]; txt = b.label + ' · ' + b.models.length + '개 모델'; h = HMAX * (bandCell(b, null) || { pct: 0 }).pct; }
        else { var m = data.models[col]; txt = m.name + '  ' + U.fmtPrice(m.price) + ' · 종합 ' + pctStr(m.comp); h = HMAX * m.comp; }
        var g = new THREE.Group();
        var s = U.textSprite(txt, { size: 32, bold: true, color: '#0f172a', bg: 'rgba(250,204,21,0.95)', scale: 0.0115, center: [0.5, 0] });
        s.position.set(L.x(col), Math.max(h, HMAX * 0.2) + 2.4, L.z(-1)); g.add(s);
        st.hi = g; st.group.add(g);
    }

    // --------------------------------------------------------------- camera
    function camPreset(name, instant) {
        if (!data || !data.L) return;
        data.camPreset = name;
        flatTo = name === 'top' ? 1 : 0;
        var L = data.L, d = L.depth, w = Math.max(L.width, d * 1.45, 12), midZ = (2.5 - d) / 2;
        var tgt = new THREE.Vector3(0, 1.2, midZ), pos;
        if (name === 'front') pos = new THREE.Vector3(0, 3.2, 2.5 + w * 0.78);
        else if (name === 'side') { pos = new THREE.Vector3(-w * 0.55 - d * 1.4, 4.5, midZ); tgt.set(-w * 0.15, 1.5, midZ); }
        else if (name === 'top') { pos = new THREE.Vector3(-1.5, w * 0.8 + d * 0.5, midZ + 1.2); tgt.set(-1.5, 0, midZ + 1.19); }
        else { pos = new THREE.Vector3(-w * 0.3, w * 0.36 + 4, 2.5 + w * 0.5 + d * 0.3); tgt.set(-w * 0.06, 0.2, midZ + 1.5); }
        if (instant) { st.camera.position.copy(pos); st.controls.target.copy(tgt); flight = null; }
        else flight = { t0: performance.now(), dur: 1100, p0: st.camera.position.clone(), g0: st.controls.target.clone(), p1: pos, g1: tgt };
        if (ui.cams) [].forEach.call(ui.cams.querySelectorAll('button'), function (b) { b.classList.toggle('p3d-chip-on', b.getAttribute('data-cam') === name); });
    }
    function focusColumn(col) {
        if (!data.L || col < 0) return;
        var x = data.L.x(col), midZ = (2.5 - data.L.depth) / 2;
        flight = { t0: performance.now(), dur: 1000, p0: st.camera.position.clone(), g0: st.controls.target.clone(),
                   p1: new THREE.Vector3(x - 9, 8, 9), g1: new THREE.Vector3(x, 1.5, midZ + 1) };
    }

    // -------------------------------------------------------------- picking
    function pick(ev) {
        if (!st.mesh) return null;
        var rect = st.renderer.domElement.getBoundingClientRect();
        st.pointer.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
        st.raycaster.setFromCamera(st.pointer, st.camera);
        var hit = st.raycaster.intersectObject(st.mesh, false)[0];
        return hit ? st.cells[hit.instanceId] : null;
    }
    var moveRaf = 0;
    function onPointerMove(ev) {
        if (moveRaf) return;
        moveRaf = requestAnimationFrame(function () { moveRaf = 0; setHover(pick(ev), ev); });
    }
    function setHover(k, ev) {
        var tip = ui.tip;
        if (!k) { if (hover) { hover = null; applyStyles(); } if (tip) tip.style.display = 'none'; if (st) st.renderer.domElement.style.cursor = ''; return; }
        if (!hover || hover.col !== k.col || hover.row !== k.row) { hover = { col: k.col, row: k.row }; applyStyles(); }
        st.renderer.domElement.style.cursor = 'pointer';
        tip.innerHTML = data.L.bandMode ? bandTip(k) : modelTip(k);
        var box = ui.wrap.getBoundingClientRect(), x = ev.clientX - box.left + 16, y = ev.clientY - box.top + 12;
        tip.style.display = 'block';
        tip.style.left = Math.min(x, box.width - tip.offsetWidth - 8) + 'px';
        tip.style.top = Math.max(4, Math.min(y, box.height - tip.offsetHeight - 8)) + 'px';
    }
    function modelTip(k) {
        var m = k.model, esc = U.esc, row = k.row >= 0 ? data.metrics[k.row] : null;
        var mine = data.metrics.map(function (mt) { var c = mt.cells[m.id]; return c ? { mt: mt, c: c } : null; }).filter(Boolean)
            .sort(function (a, b) { return b.c.pct - a.c.pct; });
        var line = function (o) {
            return '<tr><td style="padding-right:8px">' + esc(o.mt.label) + '</td><td style="text-align:right">' + U.fmtVal(o.c.v) +
                   '</td><td style="text-align:right;color:#94a3b8;padding-left:6px">#' + o.c.rank + '/' + o.mt.n + '</td></tr>';
        };
        var head = row
            ? (k.missing ? '<div style="color:#94a3b8">' + esc(row.label) + ': 점수 없음</div>'
                         : '<div style="color:#fde68a">' + esc(row.label) + ': <b>' + U.fmtVal(k.cell.v) + '</b> · #' + k.cell.rank + '/' + row.n + ' · 상위 ' + pctStr(1 - k.cell.pct) + '</div>')
            : '<div style="color:#fde68a">종합 백분위 <b>' + pctStr(m.comp) + '</b> · ' + m.compRank + '위 / ' + data.models.length + '</div>';
        return '<div style="font-weight:600;color:#f8fafc">' + esc(m.name) + '</div>' +
            '<div style="color:#94a3b8;font-size:11px;margin-bottom:4px">' + esc(m.vendor) + (m.rel ? ' · ' + esc(m.rel) : '') + ' · ' +
            U.fmtPrice(m.price) + ' / 1M (' + esc(data.basis) + ') · ' + BANDS[m.band].label + '</div>' + head +
            '<div style="font-size:11px;color:#cbd5e1;margin-top:4px">종합 ' + pctStr(m.comp) + ' · 지표 ' + m.cov + '/' + data.metrics.length + '개 보유</div>' +
            '<div style="font-size:11px;color:#86efac;margin-top:4px">강점</div><table style="font-size:11px;color:#cbd5e1">' + mine.slice(0, 3).map(line).join('') + '</table>' +
            (mine.length > 3 ? '<div style="font-size:11px;color:#fca5a5;margin-top:2px">약점</div><table style="font-size:11px;color:#cbd5e1">' + mine.slice(-Math.min(3, mine.length - 3)).map(line).join('') + '</table>' : '') +
            '<div style="color:#64748b;font-size:10px;margin-top:4px">클릭: 모델 상세</div>';
    }
    function bandTip(k) {
        var b = k.band, esc = U.esc, row = k.row >= 0 ? data.metrics[k.row] : null, bc = k.bc;
        var title = row ? row.label : '종합 (평균 백분위)';
        if (!bc) return '<div style="font-weight:600;color:#f8fafc">' + esc(b.label) + '</div><div style="color:#94a3b8">' + esc(title) + ': 이 가격대에 점수 있는 모델 없음</div>';
        return '<div style="font-weight:600;color:#f8fafc">' + esc(b.label) + ' · ' + b.models.length + '개 모델</div>' +
            '<div style="color:#fde68a">' + esc(title) + ' — ' + (opt.agg === 'max' ? '최고' : '중앙값') + ' 백분위 <b>' + pctStr(bc.pct) + '</b> (' + bc.n + '개 모델 보유)</div>' +
            '<table style="font-size:11px;color:#cbd5e1;margin-top:4px">' + bc.top.map(function (t, i) {
                return '<tr><td style="color:#94a3b8;padding-right:6px">' + (i + 1) + '</td><td style="padding-right:8px">' + esc(t.m.name) + '</td><td style="text-align:right">' +
                    (row ? U.fmtVal(t.v) : pctStr(t.pct)) + '</td><td style="text-align:right;color:#94a3b8;padding-left:6px">' + U.fmtPrice(t.m.price) + '</td></tr>';
            }).join('') + '</table>' +
            '<div style="color:#64748b;font-size:10px;margin-top:4px">클릭: 1위 모델 상세</div>';
    }
    function onClick(ev) {
        var k = pick(ev); if (!k || typeof Modal === 'undefined' || !Modal.showModel) return;
        if (data.L.bandMode) { if (k.bc) Modal.showModel(k.bc.top[0].m.id); }
        else Modal.showModel(k.model.id);
    }

    // ------------------------------------------------------------------- HUD
    function renderHud() {
        if (!ui.info || !data) return;
        var L = data.L;
        if (!data.models.length) {
            ui.info.textContent = '현재 필터에서 지표 ' + opt.minCov + '개 이상을 가진 가격 보유 모델이 없습니다. 최소 지표 수를 낮추거나 기간을 늘려 보세요.';
            ui.bands.innerHTML = ''; return;
        }
        ui.info.textContent = (L && L.bandMode ? data.bands.length + '개 가격대' : data.models.length + '개 모델') +
            ' × ' + data.metrics.length + '개 지표 (+종합) · 가격 보유 ' + data.total + '개 중 지표 ' + opt.minCov + '개 이상 보유 모델만 · 높이 = 지표 내 백분위 (100% = 1위)' +
            ' · 가격 기준: ' + data.basis;
        ui.covVal.textContent = opt.minCov;
        [].forEach.call(ui.modes.querySelectorAll('button'), function (b) { b.classList.toggle('p3d-chip-on', b.getAttribute('data-mode') === opt.mode); });
        ui.agg.parentNode.style.display = L && L.bandMode ? '' : 'none';
        ui.sort.parentNode.style.display = L && L.bandMode ? 'none' : '';
        var esc = U.esc;
        ui.bands.innerHTML = '<table class="w-full text-xs"><thead><tr class="text-gray-400 text-left">' +
            '<th class="py-1 pr-3">가격대</th><th class="pr-3 text-right">모델</th><th class="pr-3 text-right">종합 중앙값</th><th class="pr-3">종합 1위</th><th class="pr-3">종합 2·3위</th></tr></thead><tbody>' +
            data.bands.map(function (b) {
                var bar = '<span style="display:inline-block;width:' + Math.round(b.median * 60) + 'px;height:6px;border-radius:3px;background:linear-gradient(90deg,#0ea5e9,#facc15);margin-right:6px;vertical-align:middle"></span>';
                return '<tr class="border-t border-gray-800 text-gray-300"><td class="py-1 pr-3 font-semibold text-blue-300">' + esc(b.label) + '</td>' +
                    '<td class="pr-3 text-right">' + b.models.length + '</td><td class="pr-3 text-right whitespace-nowrap">' + bar + pctStr(b.median) + '</td>' +
                    '<td class="pr-3"><a href="#" data-mid="' + esc(b.best.id) + '" class="text-blue-400 hover:underline">' + esc(b.best.name) + '</a> <span class="text-gray-500">' + pctStr(b.best.comp) + ' · ' + U.fmtPrice(b.best.price) + '</span></td>' +
                    '<td class="pr-3">' + (b.top.slice(1).map(function (m) {
                        return '<a href="#" data-mid="' + esc(m.id) + '" class="text-blue-400 hover:underline">' + esc(m.name) + '</a> <span class="text-gray-500">' + pctStr(m.comp) + ' · ' + U.fmtPrice(m.price) + '</span>';
                    }).join(' · ') || '—') + '</td></tr>';
            }).join('') + '</tbody></table>';
        if (ui.searchList) ui.searchList.innerHTML = data.models.map(function (m) { return '<option value="' + esc(m.name) + '">'; }).join('');
    }

    function wireHud() {
        ui.wrap = $('pricesky-wrap'); ui.tip = $('pricesky-tip'); ui.info = $('pricesky-info'); ui.bands = $('pricesky-bands');
        ui.modes = $('pricesky-modes'); ui.cams = $('pricesky-cams'); ui.sort = $('pricesky-sort'); ui.agg = $('pricesky-agg');
        ui.color = $('pricesky-color'); ui.cov = $('pricesky-cov'); ui.covVal = $('pricesky-cov-val');
        ui.search = $('pricesky-search'); ui.searchList = $('pricesky-search-list');
        ui.modes.addEventListener('click', function (e) {
            var b = e.target.closest('button'); if (!b) return; opt.mode = b.getAttribute('data-mode'); hover = null; build();
        });
        ui.cams.addEventListener('click', function (e) {
            var b = e.target.closest('button[data-cam]'); if (b) camPreset(b.getAttribute('data-cam'));
        });
        $('pricesky-spin').addEventListener('change', function (e) { opt.spin = e.target.checked; st.controls.autoRotate = opt.spin; });
        ui.sort.addEventListener('change', function () { opt.sort = ui.sort.value; build(); });
        ui.agg.addEventListener('change', function () { opt.agg = ui.agg.value; build(); });
        ui.color.addEventListener('change', function () { opt.color = ui.color.value; applyStyles(); });
        ui.cov.addEventListener('input', function () { ui.covVal.textContent = ui.cov.value; });
        ui.cov.addEventListener('change', function () { opt.minCov = +ui.cov.value; build(); });
        ui.search.addEventListener('input', function () {
            var q = ui.search.value.trim().toLowerCase(); searchModel = null;
            if (q && data) {
                var hit = data.models.filter(function (m) { return m.name.toLowerCase() === q; })[0] ||
                          data.models.filter(function (m) { return m.name.toLowerCase().indexOf(q) !== -1; })[0];
                if (hit) { searchModel = hit.id; if (opt.mode === 'model') focusColumn(data.models.indexOf(hit)); }
            }
            applyStyles();
        });
        ui.bands.addEventListener('click', function (e) {
            var a = e.target.closest('a[data-mid]'); if (!a) return; e.preventDefault();
            if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(a.getAttribute('data-mid'));
        });
        ['price-basis', 'price-hitrate', 'price-period', 'price-vendor', 'price-country'].forEach(function (id) {
            var el = $(id); if (el) el.addEventListener('change', function () { if (isShown() && st) build(); });
        });
    }
    function isShown() { var w = $('pricesky-wrap'); return !!(w && w.style.display !== 'none'); }

    function loop() {
        if (!visible) return;
        requestAnimationFrame(loop);
        if (flight) {
            var t = Math.min(1, (performance.now() - flight.t0) / flight.dur), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            st.camera.position.lerpVectors(flight.p0, flight.p1, e);
            st.controls.target.lerpVectors(flight.g0, flight.g1, e);
            if (t >= 1) flight = null;
        }
        if (flat !== flatTo) {
            flat += (flatTo - flat) * 0.14; if (Math.abs(flatTo - flat) < 0.01) flat = flatTo;
            applyStyles(true);
        }
        st.controls.update();
        st.renderer.render(st.scene, st.camera);
    }

    // Called by Price3D.setView('sky') once three.js is loaded.
    function show() {
        U = Price3D.util; THREE = U.three();
        if (!st) { initScene(); }
        if (!wired) { wireHud(); wired = true; }
        build();
        if (!visible) { visible = true; loop(); }
    }
    function hide() { visible = false; if (ui.tip) ui.tip.style.display = 'none'; }

    document.addEventListener('visibilitychange', function () { if (document.hidden) visible = false; });

    return { show: show, hide: hide };
})();
