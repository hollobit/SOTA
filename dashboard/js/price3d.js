/* Price tab — 3D "metric corridor" explorer (three.js).
 *
 * Every performance metric is a vertical slice along Z. Inside a slice,
 * X = token price (log) and Y = the metric, min-max normalised within that
 * slice (lower-is-better metrics flipped so "up" is always better). The same
 * model is joined across slices by a faint thread, so you can fly from metric
 * to metric and watch how its standing changes at the same price.
 *
 * three.js is imported lazily (import map in index.html) the first time the
 * 3D view is opened; the render loop runs only while the view is visible.
 * Prices, vendors, colours and dates come from Price.api, so the 3D view
 * agrees with the 2D chart and the price table.
 */
window.Price3D = (function () {
    'use strict';

    var W = 16, H = 9, GAP = 7;          // slice width / height, distance between slices
    var MIN_COVERAGE = 8;                 // a metric needs this many plotted models to get a slice
    var BG = 0x0b1220;

    var THREE = null, OrbitControls = null;
    var st = null;                        // scene state (created once)
    var data = null;                      // current build: slices, points, models
    var ui = {};                          // HUD elements
    var cur = 0, tourTimer = null, visible = false, wired = false;
    var flight = null;                    // camera tween
    var showThreads = true, showPareto = true, showLabels = true;
    var hoverModel = null, searchModel = null;

    function $(id) { return document.getElementById(id); }
    function val(id, d) { var e = $(id); return e ? e.value : d; }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }
    // Vendor strings vary ("Mistral AI", "Zhipu AI", "Google DeepMind"); fold them onto the
    // Price palette keys, and lift colours that vanish on the dark 3D background (xAI's near-black).
    var VENDOR_ALIAS = { 'mistral ai': 'mistral', 'mistralai': 'mistral', 'zhipu ai': 'zhipu', 'z.ai': 'zhipu', 'zai': 'zhipu',
        'google deepmind': 'google', 'deepmind': 'google', 'x.ai': 'xai', 'spacexai': 'xai', 'moonshot ai': 'moonshot', 'moonshotai': 'moonshot',
        'meta ai': 'meta', 'minimax ai': 'minimax', 'qwen': 'alibaba', 'alibaba cloud': 'alibaba', 'deepseek ai': 'deepseek', 'deepseek-ai': 'deepseek' };
    var DARK_FIX = { xai: '#e5e7eb', cohere: '#5eead4', bytedance: '#60a5fa' };
    function vendorKey(v, id) {
        var k = String(v || '').toLowerCase().trim();
        if (VENDOR_ALIAS[k]) return VENDOR_ALIAS[k];
        var pre = id && id.indexOf('/') !== -1 ? id.split('/')[0].toLowerCase() : '';
        return VENDOR_ALIAS[pre] || (pre && Price.api.vendorColor(pre) !== '#9ca3af' ? pre : k);
    }
    function vendorColor(k) { return DARK_FIX[k] || Price.api.vendorColor(k); }
    function lowerBetter(id) { return /lower_better|(^|_)asr(_|$)/.test(id); }
    function fmtPrice(p) { return '$' + (p < 0.1 ? p.toFixed(3) : p < 10 ? p.toFixed(2) : p.toFixed(0)); }
    function fmtVal(v) { return Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2); }

    // ------------------------------------------------------------------ data
    function buildData() {
        var api = Price.api, idx = api.scoreIdx(), byId = api.modelsById();
        var basis = val('price-basis', 'output'), hit = parseInt(val('price-hitrate', '0'), 10) || 0;
        var months = parseInt(val('price-period', '12'), 10) || 12;
        var vendorF = val('price-vendor', 'all'), countryF = val('price-country', 'all');
        var now = new Date(), cut = new Date(now.getFullYear(), now.getMonth() - months, now.getDate()).toISOString().slice(0, 10);

        // Priced models passing the page filters.
        var priced = {};
        Object.keys(idx[api.priceIds.input] || {}).concat(Object.keys(idx[api.priceIds.output] || {})).forEach(function (id) {
            if (priced[id] !== undefined) return;
            var m = byId[id]; if (!m) return;
            var raw = api.vendor(id, m), ven = vendorKey(raw, id);
            if (vendorF !== 'all' && raw !== vendorF) return;
            if (countryF !== 'all' && api.country(id, m) !== countryF) return;
            var rel = api.relDate(m); if (rel && rel < cut) return;
            var p = api.price(id, basis, hit); if (p == null || p <= 0) return;
            priced[id] = { id: id, name: m.name || id, vendor: ven, color: vendorColor(ven), price: p, rel: rel || '' };
        });

        // One slice per metric with enough coverage, in the 2D dropdown's order.
        var slices = [];
        api.metrics.forEach(function (def) {
            var mp = idx[def[0]] || {}, pts = [];
            Object.keys(mp).forEach(function (id) { if (priced[id]) pts.push({ id: id, v: +mp[id] }); });
            if (pts.length < MIN_COVERAGE) return;
            var lo = Infinity, hi = -Infinity;
            pts.forEach(function (p) { if (p.v < lo) lo = p.v; if (p.v > hi) hi = p.v; });
            var inv = lowerBetter(def[0]), span = (hi - lo) || 1;
            pts.forEach(function (p) { var n = (p.v - lo) / span; p.n = inv ? 1 - n : n; });
            var ranked = pts.slice().sort(function (a, b) { return b.n - a.n; });
            ranked.forEach(function (p, i) { p.rank = i + 1; });
            slices.push({ id: def[0], label: def[1], cat: def[2], lo: lo, hi: hi, inv: inv, pts: pts, n: pts.length });
        });

        var ps = Object.keys(priced).map(function (k) { return priced[k].price; });
        var lmin = Math.floor(Math.log10(Math.min.apply(null, ps.length ? ps : [0.01])) * 2) / 2;
        var lmax = Math.ceil(Math.log10(Math.max.apply(null, ps.length ? ps : [100])) * 2) / 2;
        if (lmax - lmin < 1) lmax = lmin + 1;
        return { models: priced, slices: slices, lmin: lmin, lmax: lmax, basis: basis };
    }

    function px(price) { return W * ((Math.log10(price) - data.lmin) / (data.lmax - data.lmin)) - W / 2; }
    function py(n) { return H * n - H / 2; }
    function pz(i) { return -i * GAP; }

    // ------------------------------------------------------------- helpers
    function textSprite(text, opts) {
        opts = opts || {};
        var size = opts.size || 40, pad = 10;
        var c = document.createElement('canvas'), g = c.getContext('2d');
        var font = (opts.bold ? '600 ' : '400 ') + size + 'px system-ui, -apple-system, "Segoe UI", sans-serif';
        g.font = font;
        var w = Math.ceil(g.measureText(text).width) + pad * 2, h = size + pad * 2;
        c.width = w; c.height = h;
        g.font = font;
        if (opts.bg) { g.fillStyle = opts.bg; g.beginPath(); if (g.roundRect) g.roundRect(0, 0, w, h, 10); else g.rect(0, 0, w, h); g.fill(); }
        g.fillStyle = opts.color || '#e5e7eb'; g.textBaseline = 'middle'; g.fillText(text, pad, h / 2 + 1);
        var tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearFilter;
        var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: opts.opacity == null ? 1 : opts.opacity });
        var s = new THREE.Sprite(mat), scale = (opts.scale || 0.012);
        s.scale.set(w * scale, h * scale, 1);
        if (opts.center) s.center.set(opts.center[0], opts.center[1]);
        return s;
    }

    function disposeGroup(g) {
        g.traverse(function (o) {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
                (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) {
                    if (m.map) m.map.dispose(); m.dispose();
                });
            }
        });
        if (g.parent) g.parent.remove(g);
    }

    // ---------------------------------------------------------------- scene
    function initScene() {
        var host = $('price3d-canvas');
        var r = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        r.setSize(host.clientWidth, host.clientHeight);
        r.setClearColor(BG, 1);
        host.appendChild(r.domElement);

        var scene = new THREE.Scene();
        scene.fog = new THREE.Fog(BG, 18, 60);
        var cam = new THREE.PerspectiveCamera(48, host.clientWidth / host.clientHeight, 0.1, 400);
        cam.position.set(4, 3, 14);
        var controls = new OrbitControls(cam, r.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.08;
        controls.maxDistance = 60; controls.minDistance = 3;

        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        var dl = new THREE.DirectionalLight(0xffffff, 1.1); dl.position.set(6, 10, 8); scene.add(dl);
        var rl = new THREE.DirectionalLight(0x88aaff, 0.35); rl.position.set(-8, -2, -6); scene.add(rl);

        // Starfield backdrop for depth cues.
        var sg = new THREE.BufferGeometry(), sp = [];
        for (var i = 0; i < 900; i++) sp.push((Math.random() - 0.5) * 160, (Math.random() - 0.5) * 90, 20 - Math.random() * 200);
        sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
        scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0x5b6b8c, size: 0.12, transparent: true, opacity: 0.7 })));

        st = { renderer: r, scene: scene, camera: cam, controls: controls, raycaster: new THREE.Raycaster(),
               pointer: new THREE.Vector2(), group: null, mesh: null, threads: null, hi: null, clock: new THREE.Clock() };

        new ResizeObserver(function () {
            if (!host.clientWidth) return;
            r.setSize(host.clientWidth, host.clientHeight);
            cam.aspect = host.clientWidth / host.clientHeight; cam.updateProjectionMatrix();
        }).observe(host);

        // Render only while the 3D view is actually on screen (tab switch, 2D mode, scrolled away).
        new IntersectionObserver(function (entries) {
            var on = entries[0].isIntersecting && !document.hidden;
            if (on && !visible) { visible = true; loop(); }
            else if (!on) { visible = false; stopTour(); }
        }).observe(host);

        r.domElement.addEventListener('pointermove', onPointerMove);
        r.domElement.addEventListener('pointerleave', function () { setHover(null); });
        r.domElement.addEventListener('click', onClick);
        r.domElement.addEventListener('pointerdown', stopTour);
        r.domElement.addEventListener('wheel', stopTour, { passive: true });
    }

    function build() {
        data = buildData();
        if (st.group) disposeGroup(st.group);
        var group = new THREE.Group(); st.group = group; st.scene.add(group);
        var S = data.slices;
        if (!S.length) { renderHud(); return; }
        if (cur >= S.length) cur = 0;

        // Slice frames, floors, titles and axis ticks.
        var ticks = [];
        for (var e = Math.ceil(data.lmin); e <= Math.floor(data.lmax); e++) ticks.push(Math.pow(10, e));
        S.forEach(function (sl, i) {
            var z = pz(i);
            var plane = new THREE.Mesh(new THREE.PlaneGeometry(W, H),
                new THREE.MeshBasicMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false }));
            plane.position.set(0, 0, z); plane.userData.slice = i; plane.userData.kind = 'plane'; group.add(plane);
            var fr = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(W, H)),
                new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.35 }));
            fr.position.set(0, 0, z); fr.userData.slice = i; fr.userData.kind = 'frame'; group.add(fr);
            // price grid lines
            var gp = [];
            ticks.forEach(function (t) { var x = px(t); gp.push(x, -H / 2, z, x, H / 2, z); });
            for (var q = 1; q < 4; q++) { var y = -H / 2 + H * q / 4; gp.push(-W / 2, y, z, W / 2, y, z); }
            var gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(gp, 3));
            var grid = new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.35 }));
            grid.userData.slice = i; grid.userData.kind = 'grid'; group.add(grid);

            var title = textSprite(sl.label + (sl.inv ? '  (↓ better, flipped)' : ''), { size: 44, bold: true, color: '#f8fafc', scale: 0.011, center: [0, 0] });
            title.position.set(-W / 2, H / 2 + 0.35, z); title.userData.slice = i; title.userData.kind = 'title'; group.add(title);
            var sub = textSprite(sl.cat + ' · ' + sl.n + ' models', { size: 30, color: '#94a3b8', scale: 0.011, center: [1, 0] });
            sub.position.set(W / 2, H / 2 + 0.35, z); sub.userData.slice = i; sub.userData.kind = 'title'; group.add(sub);
            ticks.forEach(function (t) {
                var s = textSprite(fmtPrice(t), { size: 28, color: '#94a3b8', scale: 0.01, center: [0.5, 1] });
                s.position.set(px(t), -H / 2 - 0.15, z); s.userData.slice = i; s.userData.kind = 'tick'; group.add(s);
            });
            var yl = [[sl.inv ? sl.hi : sl.lo, -H / 2], [sl.inv ? sl.lo : sl.hi, H / 2]];
            yl.forEach(function (a) {
                var s = textSprite(fmtVal(a[0]), { size: 28, color: '#94a3b8', scale: 0.01, center: [1, 0.5] });
                s.position.set(-W / 2 - 0.15, a[1], z); s.userData.slice = i; s.userData.kind = 'tick'; group.add(s);
            });
        });

        // All points as one InstancedMesh.
        var pts = [];
        S.forEach(function (sl, i) {
            sl.pts.forEach(function (p) {
                var m = data.models[p.id];
                pts.push({ id: p.id, slice: i, v: p.v, n: p.n, rank: p.rank, x: px(m.price), y: py(p.n), z: pz(i), color: new THREE.Color(m.color) });
            });
        });
        data.points = pts;
        var mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 18, 14),
            new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.15 }), pts.length);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        group.add(mesh); st.mesh = mesh;

        // Model threads across slices.
        var byModel = {};
        pts.forEach(function (p, k) { (byModel[p.id] || (byModel[p.id] = [])).push(k); });
        data.byModel = byModel;
        var tp = [], tc = [], ts = [];
        Object.keys(byModel).forEach(function (id) {
            var ks = byModel[id]; if (ks.length < 2) return;
            ks.sort(function (a, b) { return pts[a].slice - pts[b].slice; });
            for (var j = 0; j + 1 < ks.length; j++) {
                var a = pts[ks[j]], b = pts[ks[j + 1]];
                tp.push(a.x, a.y, a.z, b.x, b.y, b.z);
                tc.push(a.color.r, a.color.g, a.color.b, b.color.r, b.color.g, b.color.b);
                ts.push(a.slice);
            }
        });
        var tg = new THREE.BufferGeometry();
        tg.setAttribute('position', new THREE.Float32BufferAttribute(tp, 3));
        tg.setAttribute('color', new THREE.Float32BufferAttribute(tc, 3));
        st.threads = new THREE.LineSegments(tg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.16, depthWrite: false }));
        st.threads.visible = showThreads; group.add(st.threads);
        st.threadSlice = ts; st.threadColor = tc.slice();

        // Pareto frontier (cheapest-best envelope) per slice.
        S.forEach(function (sl, i) {
            var arr = sl.pts.map(function (p) { return { x: px(data.models[p.id].price), y: py(p.n) }; })
                .sort(function (a, b) { return a.x - b.x || b.y - a.y; });
            var best = -Infinity, fp = [];
            arr.forEach(function (a) { if (a.y > best + 1e-9) { best = a.y; fp.push(a.x, a.y, pz(i) + 0.01); } });
            if (fp.length < 6) return;
            var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3));
            var line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.85 }));
            line.userData.slice = i; line.userData.kind = 'pareto'; line.visible = showPareto; group.add(line);
        });

        // Labels for the top 3 of every slice.
        S.forEach(function (sl, i) {
            var placed = [];
            sl.pts.slice().sort(function (a, b) { return a.rank - b.rank; }).slice(0, 6).forEach(function (p) {
                if (placed.length >= 3) return;
                var m = data.models[p.id], lx = px(m.price), ly = py(p.n);
                if (placed.some(function (q) { return Math.abs(q[0] - lx) < 3.2 && Math.abs(q[1] - ly) < 0.45; })) return;
                placed.push([lx, ly]);
                var s = textSprite(m.name, { size: 30, color: '#f1f5f9', bg: 'rgba(15,23,42,0.72)', scale: 0.009, center: [0, -0.35] });
                s.position.set(px(m.price) + 0.12, py(p.n), pz(i)); s.userData.slice = i; s.userData.kind = 'label';
                s.visible = showLabels; group.add(s);
            });
        });

        applyStyles();
        renderHud();
        flyTo(cur, true);
    }

    // Emphasise the current slice (and hovered / searched model); dim the rest.
    function applyStyles() {
        if (!data || !st.mesh) return;
        var M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), Sc = new THREE.Vector3();
        var bg = new THREE.Color(BG), c = new THREE.Color(), focus = hoverModel || searchModel;
        data.points.forEach(function (p, k) {
            var here = p.slice === cur, sel = focus && p.id === focus;
            // slices in front of the current one sit between camera and focus plane → hide
            var s = p.slice < cur ? 0 : sel ? 2.1 : here ? 1.0 : 0.55;
            P.set(p.x, p.y, p.z); Sc.set(s, s, s); M.compose(P, Q, Sc); st.mesh.setMatrixAt(k, M);
            c.copy(p.color); if (!here && !sel) c.lerp(bg, 0.72); else if (focus && !sel) c.lerp(bg, 0.45);
            if (sel) c.lerp(new THREE.Color(0xffffff), 0.25);
            st.mesh.setColorAt(k, c);
        });
        st.mesh.instanceMatrix.needsUpdate = true; if (st.mesh.instanceColor) st.mesh.instanceColor.needsUpdate = true;
        // threads that start on a hidden (in-front) slice fade into the background
        if (st.threads && st.threadSlice) {
            var ca = st.threads.geometry.getAttribute('color'), arr = ca.array, src = st.threadColor;
            for (var j = 0; j < st.threadSlice.length; j++) {
                var hide = st.threadSlice[j] < cur, o = j * 6;
                for (var q = 0; q < 6; q++) arr[o + q] = hide ? (q % 3 === 0 ? bg.r : q % 3 === 1 ? bg.g : bg.b) : src[o + q];
            }
            ca.needsUpdate = true;
        }
        st.group.children.forEach(function (o) {
            var i = o.userData.slice; if (i === undefined) return;
            var d = Math.abs(i - cur), k = o.userData.kind, m = o.material;
            if (i < cur) { o.visible = false; return; }
            if (k === 'frame' || k === 'plane' || k === 'grid' || k === 'title') o.visible = true;
            if (k === 'frame') m.opacity = d === 0 ? 0.8 : 0.18;
            else if (k === 'plane') m.opacity = d === 0 ? 0.09 : 0.025;
            else if (k === 'grid') m.opacity = d === 0 ? 0.45 : 0.08;
            else if (k === 'title') m.opacity = d === 0 ? 1 : d === 1 ? 0.45 : 0.18;
            else if (k === 'tick') o.visible = d === 0;
            else if (k === 'label') { o.visible = showLabels && d === 0; }
            else if (k === 'pareto') { o.visible = showPareto; m.opacity = d === 0 ? 0.9 : 0.15; }
        });
        drawHighlight();
    }

    function drawHighlight() {
        if (st.hi) { disposeGroup(st.hi); st.hi = null; }
        var focus = hoverModel || searchModel;
        if (!focus || !data.byModel[focus]) return;
        var ks = data.byModel[focus].slice().sort(function (a, b) { return data.points[a].slice - data.points[b].slice; });
        var g = new THREE.Group(), pos = [];
        ks.forEach(function (k) { var p = data.points[k]; pos.push(p.x, p.y, p.z); });
        if (ks.length > 1) {
            var lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            g.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })));
        }
        var m = data.models[focus];
        var s = textSprite(m.name + '  ' + fmtPrice(m.price), { size: 32, bold: true, color: '#0f172a', bg: 'rgba(250,204,21,0.95)', scale: 0.009, center: [0, -0.5] });
        var here = ks.map(function (k) { return data.points[k]; }).filter(function (p) { return p.slice === cur; })[0] || data.points[ks[0]];
        s.position.set(here.x + 0.15, here.y + 0.2, here.z); g.add(s);
        st.hi = g; st.group.add(g);
    }

    // ---------------------------------------------------------- navigation
    function flyTo(i, instant) {
        if (!data || !data.slices.length) return;
        cur = Math.max(0, Math.min(data.slices.length - 1, i));
        var z = pz(cur);
        var toPos = new THREE.Vector3(2.6, 2.0, z + 15.5), toTgt = new THREE.Vector3(0, 0.3, z);
        if (instant) { st.camera.position.copy(toPos); st.controls.target.copy(toTgt); flight = null; }
        else flight = { t0: performance.now(), dur: 950, p0: st.camera.position.clone(), g0: st.controls.target.clone(), p1: toPos, g1: toTgt };
        applyStyles(); renderHud();
        var sel = $('price-metric'); if (sel && sel.value !== data.slices[cur].id && [].some.call(sel.options, function (o) { return o.value === data.slices[cur].id; })) sel.value = data.slices[cur].id;
    }
    function step(d) { stopTour(); flyTo(cur + d); }
    function toggleTour() {
        if (tourTimer) { stopTour(); return; }
        tourTimer = setInterval(function () { flyTo((cur + 1) % data.slices.length); }, 3400);
        renderHud();
    }
    function stopTour() { if (tourTimer) { clearInterval(tourTimer); tourTimer = null; renderHud(); } }

    // -------------------------------------------------------------- picking
    function pick(ev) {
        if (!st.mesh || !data) return null;
        var rect = st.renderer.domElement.getBoundingClientRect();
        st.pointer.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
        st.raycaster.setFromCamera(st.pointer, st.camera);
        var hits = st.raycaster.intersectObject(st.mesh, false);
        for (var h = 0; h < hits.length; h++) {
            var p = data.points[hits[h].instanceId];
            if (p && Math.abs(p.slice - cur) <= 1) return p;   // ignore far, dimmed slices
        }
        return null;
    }
    var moveRaf = 0;
    function onPointerMove(ev) {
        if (moveRaf) return;
        moveRaf = requestAnimationFrame(function () {
            moveRaf = 0;
            var p = pick(ev);
            setHover(p ? p.id : null, p, ev);
        });
    }
    function setHover(id, p, ev) {
        var tip = ui.tip;
        if (!id) { if (hoverModel) { hoverModel = null; applyStyles(); } if (tip) tip.style.display = 'none'; st.renderer.domElement.style.cursor = ''; return; }
        if (hoverModel !== id) { hoverModel = id; applyStyles(); }
        st.renderer.domElement.style.cursor = 'pointer';
        var m = data.models[id], sl = data.slices[p.slice];
        var rows = data.byModel[id].map(function (k) { return data.points[k]; })
            .sort(function (a, b) { return a.slice - b.slice; })
            .map(function (q) {
                var s2 = data.slices[q.slice];
                return '<tr' + (q.slice === cur ? ' style="color:#fde68a"' : '') + '><td style="padding-right:8px">' + esc(s2.label) +
                       '</td><td style="text-align:right">' + fmtVal(q.v) + '</td><td style="text-align:right;color:#94a3b8;padding-left:6px">#' + q.rank + '/' + s2.n + '</td></tr>';
            }).join('');
        tip.innerHTML = '<div style="font-weight:600;color:#f8fafc">' + esc(m.name) + '</div>' +
            '<div style="color:#94a3b8;font-size:11px;margin-bottom:4px">' + esc(m.vendor) + (m.rel ? ' · ' + esc(m.rel) : '') +
            ' · ' + fmtPrice(m.price) + ' / 1M (' + esc(data.basis) + ')</div>' +
            '<div style="font-size:11px;color:#cbd5e1;margin-bottom:2px">' + esc(sl.label) + ': <b>' + fmtVal(p.v) + '</b> · rank ' + p.rank + ' / ' + sl.n + '</div>' +
            '<table style="font-size:11px;color:#cbd5e1;margin-top:4px">' + rows + '</table>' +
            '<div style="color:#64748b;font-size:10px;margin-top:4px">클릭: 모델 상세 · 흰 선: 지표 간 궤적</div>';
        var box = ui.wrap.getBoundingClientRect();
        var x = ev.clientX - box.left + 16, y = ev.clientY - box.top + 12;
        tip.style.display = 'block';
        tip.style.left = Math.min(x, box.width - tip.offsetWidth - 8) + 'px';
        tip.style.top = Math.min(y, box.height - tip.offsetHeight - 8) + 'px';
    }
    function onClick(ev) {
        var p = pick(ev);
        if (!p) return;
        if (p.slice !== cur) { flyTo(p.slice); return; }
        if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(p.id);
    }

    // ------------------------------------------------------------------- HUD
    function renderHud() {
        if (!ui.chips || !data) return;
        ui.chips.innerHTML = data.slices.map(function (sl, i) {
            return '<button data-i="' + i + '" class="p3d-chip' + (i === cur ? ' p3d-chip-on' : '') + '" title="' + esc(sl.cat) + ' · ' + sl.n + ' models">' + esc(sl.label) + '</button>';
        }).join('') || '<span class="text-xs text-gray-400">선택한 필터에서 지표별 ' + MIN_COVERAGE + '개 이상 모델을 가진 지표가 없습니다.</span>';
        var on = ui.chips.querySelector('.p3d-chip-on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center' });
        if (ui.tour) ui.tour.textContent = tourTimer ? '❚❚ 투어 정지' : '▶ 자동 투어';
        if (ui.info && data.slices[cur]) {
            var sl = data.slices[cur];
            ui.info.textContent = (cur + 1) + ' / ' + data.slices.length + ' · ' + sl.label + ' · ' + sl.n + '개 모델 · Y: ' +
                fmtVal(sl.inv ? sl.hi : sl.lo) + ' → ' + fmtVal(sl.inv ? sl.lo : sl.hi) + (sl.inv ? ' (낮을수록 좋음 → 위로 뒤집음)' : '') +
                ' · X: ' + data.basis + ' $/1M (log)';
        }
        if (ui.legend) {
            var cnt = {};
            Object.keys(data.models).forEach(function (k) { var m = data.models[k]; cnt[m.vendor] = (cnt[m.vendor] || { n: 0, c: m.color }); cnt[m.vendor].n++; });
            ui.legend.innerHTML = Object.keys(cnt).sort(function (a, b) { return cnt[b].n - cnt[a].n; }).slice(0, 12).map(function (v) {
                return '<span style="display:inline-flex;align-items:center;gap:4px;margin-right:10px"><i style="width:9px;height:9px;border-radius:50%;background:' + cnt[v].c + ';display:inline-block"></i>' + esc(v) + '</span>';
            }).join('');
        }
        if (ui.searchList) {
            ui.searchList.innerHTML = Object.keys(data.models).map(function (k) { return '<option value="' + esc(data.models[k].name) + '">'; }).join('');
        }
    }

    function wireHud() {
        ui.wrap = $('price3d-wrap'); ui.chips = $('price3d-chips'); ui.tip = $('price3d-tip');
        ui.info = $('price3d-info'); ui.legend = $('price3d-legend'); ui.tour = $('price3d-tour');
        ui.search = $('price3d-search'); ui.searchList = $('price3d-search-list');
        ui.chips.addEventListener('click', function (e) {
            var b = e.target.closest('.p3d-chip'); if (!b) return; stopTour(); flyTo(+b.getAttribute('data-i'));
        });
        $('price3d-prev').addEventListener('click', function () { step(-1); });
        $('price3d-next').addEventListener('click', function () { step(1); });
        ui.tour.addEventListener('click', toggleTour);
        $('price3d-reset').addEventListener('click', function () { stopTour(); flyTo(cur, false); });
        $('price3d-threads').addEventListener('change', function (e) { showThreads = e.target.checked; if (st.threads) st.threads.visible = showThreads; });
        $('price3d-pareto').addEventListener('change', function (e) { showPareto = e.target.checked; applyStyles(); });
        $('price3d-labels').addEventListener('change', function (e) { showLabels = e.target.checked; applyStyles(); });
        ui.search.addEventListener('input', function () {
            var q = ui.search.value.trim().toLowerCase(); searchModel = null;
            if (q) {
                var ids = Object.keys(data.models), exact = ids.filter(function (k) { return data.models[k].name.toLowerCase() === q; })[0];
                searchModel = exact || ids.filter(function (k) { return data.models[k].name.toLowerCase().indexOf(q) !== -1; })[0] || null;
            }
            applyStyles();
        });
        document.addEventListener('keydown', function (e) {
            if (!visible || /input|select|textarea/i.test((e.target && e.target.tagName) || '')) return;
            if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
            else if (e.key === ' ') { e.preventDefault(); toggleTour(); }
        });
        // Rebuild when the shared 2D filters change while the 3D view is open.
        ['price-basis', 'price-hitrate', 'price-period', 'price-vendor', 'price-country'].forEach(function (id) {
            var el = $(id); if (!el) return;
            el.addEventListener('change', function () { if (visible && st) build(); });
        });
        var ms = $('price-metric');
        if (ms) ms.addEventListener('change', function () {
            if (!visible || !data) return;
            var i = data.slices.map(function (s) { return s.id; }).indexOf(ms.value); if (i >= 0 && i !== cur) { stopTour(); flyTo(i); }
        });
    }

    // ------------------------------------------------------------------ loop
    function loop() {
        if (!visible) return;
        requestAnimationFrame(loop);
        if (flight) {
            var t = Math.min(1, (performance.now() - flight.t0) / flight.dur), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            st.camera.position.lerpVectors(flight.p0, flight.p1, e);
            st.controls.target.lerpVectors(flight.g0, flight.g1, e);
            if (t >= 1) flight = null;
        }
        st.controls.update();
        st.renderer.render(st.scene, st.camera);
    }

    // ----------------------------------------------------------- public API
    function loadThree() {
        if (THREE) return Promise.resolve();
        return Promise.all([import('three'), import('three/addons/controls/OrbitControls.js')]).then(function (mods) {
            THREE = mods[0]; OrbitControls = mods[1].OrbitControls;
        });
    }

    function setView(mode) {
        var is3d = mode === '3d';
        $('price-view-2d').classList.toggle('p3d-tab-on', !is3d);
        $('price-view-3d').classList.toggle('p3d-tab-on', is3d);
        $('price-chart').style.display = is3d ? 'none' : '';
        $('price-note').style.display = is3d ? 'none' : '';
        $('price3d-wrap').style.display = is3d ? '' : 'none';
        try { localStorage.setItem('price_view', mode); } catch (e) { /* storage unavailable */ }
        if (!is3d) { visible = false; stopTour(); return; }
        $('price3d-status').textContent = '3D 엔진 로딩 중…';
        loadThree().then(function () {
            $('price3d-status').textContent = '';
            if (!st) { initScene(); if (!wired) { wireHud(); wired = true; } }
            // current 2D metric becomes the starting slice
            var ms = $('price-metric'); build();
            if (ms) { var i = data.slices.map(function (s) { return s.id; }).indexOf(ms.value); if (i >= 0) flyTo(i, true); }
            if (!visible) { visible = true; loop(); }
        }).catch(function (err) {
            $('price3d-status').textContent = '3D 엔진을 불러오지 못했습니다: ' + (err && err.message ? err.message : err);
        });
    }

    function init() {
        var b2 = $('price-view-2d'), b3 = $('price-view-3d');
        if (!b2 || b2.dataset.wired) return;
        b2.dataset.wired = '1';
        b2.addEventListener('click', function () { setView('2d'); });
        b3.addEventListener('click', function () { setView('3d'); });
        var saved = null; try { saved = localStorage.getItem('price_view'); } catch (e) { saved = null; }
        if (saved === '3d') setView('3d');
    }

    document.addEventListener('visibilitychange', function () { if (document.hidden) visible = false; });

    return { init: init, setView: setView };
})();
