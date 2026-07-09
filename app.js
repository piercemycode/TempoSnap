/* ==============================
   TempoSnap — Lógica completa
   ============================== */

(function () {
    'use strict';

    // ---- DOM ----
    const display = document.getElementById('display');
    const displayExtra = document.getElementById('displayExtra');
    const btnStart = document.getElementById('btnStart');
    const btnLap = document.getElementById('btnLap');
    const btnReset = document.getElementById('btnReset');
    const lapsTbody = document.getElementById('lapsTbody');
    const lapsEmpty = document.getElementById('lapsEmpty');
    const lapsTable = document.getElementById('lapsTable');
    const lapsBadge = document.getElementById('lapsBadge');
    const colorInput = document.getElementById('colorInput');
    const sizeRange = document.getElementById('sizeRange');
    const sizeVal = document.getElementById('sizeVal');

    // Sidebar
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.getElementById('menuBtn');
    const navBtns = document.querySelectorAll('.nav-btn');

    // ---- Estado ----
    let startTime = null;
    let accumulated = 0;
    let running = false;
    let intervalId = null;
    let laps = [];

    const STORAGE_KEY = 'temposnap';
    const SETTINGS_KEY = 'temposnap_cfg';

    // ---- Init ----
    function init() {
        loadSettings();
        restoreState();
        bindEvents();
    }

    // ---- Tiempo ----
    const now = () => performance.now();

    function elapsed() {
        return startTime ? accumulated + (now() - startTime) : accumulated;
    }

    function fmt(ms) {
        const t = Math.max(0, ms);
        const totalSec = Math.floor(t / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const c = Math.floor((t % 1000) / 10);

        let str;
        if (h > 0) {
            str = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(c).padStart(2,'0')}`;
        } else {
            str = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(c).padStart(2,'0')}`;
        }
        return { str, h };
    }

    function render() {
        const { str, h } = fmt(elapsed());
        display.textContent = str;
        displayExtra.textContent = h > 0 ? `${h} hora${h > 1 ? 's' : ''} transcurrida${h > 1 ? 's' : ''}` : '';
    }

    function tick() { render(); }

    // ---- Acciones ----
    function start() {
        if (running) return;
        running = true;
        startTime = now();
        intervalId = setInterval(tick, 16);
        btnStart.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Parar';
        btnStart.className = 'btn btn-stop';
        btnLap.disabled = false;
        btnReset.style.display = 'none';
        saveState();
    }

    function stop() {
        if (!running) return;
        accumulated = elapsed();
        running = false;
        clearInterval(intervalId);
        intervalId = null;
        startTime = null;
        btnStart.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg> Iniciar';
        btnStart.className = 'btn btn-primary';
        btnLap.disabled = true;
        btnReset.style.display = accumulated > 0 ? '' : 'none';
        saveState();
    }

    function toggle() { running ? stop() : start(); }

    function reset() {
        if (running) return;
        accumulated = 0;
        startTime = null;
        laps = [];
        render();
        renderLaps();
        saveState();
        btnReset.style.display = 'none';
    }

    // ---- Vueltas ----
    function addLap() {
        if (!running) return;
        const total = elapsed();
        const prev = laps.length ? laps[laps.length - 1].total : 0;
        laps.push({ lap: total - prev, total });
        renderLaps();
        saveState();
    }

    function renderLaps() {
        if (!laps.length) {
            lapsEmpty.style.display = '';
            lapsTable.style.display = 'none';
            lapsBadge.textContent = '0';
            return;
        }
        lapsEmpty.style.display = 'none';
        lapsTable.style.display = '';
        lapsBadge.textContent = String(laps.length);

        lapsTbody.innerHTML = '';
        const frag = document.createDocumentFragment();
        laps.forEach((l, i) => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td'); td1.textContent = i + 1;
            const td2 = document.createElement('td'); td2.textContent = fmt(l.lap).str;
            if (i === laps.length - 1) td2.classList.add('highlight');
            const td3 = document.createElement('td'); td3.textContent = fmt(l.total).str;
            tr.append(td1, td2, td3);
            frag.appendChild(tr);
        });
        lapsTbody.appendChild(frag);
    }

    // ---- Config ----
    function applyColor(c) {
        document.documentElement.style.setProperty('--accent', c);
        display.style.color = c;
        document.querySelector('.logo').style.color = c;
        document.querySelector('.mobile-logo').style.color = c;
    }

    function applySize(s) {
        display.style.fontSize = s + 'rem';
        sizeVal.textContent = s;
    }

    function loadSettings() {
        try {
            const d = JSON.parse(localStorage.getItem(SETTINGS_KEY));
            if (!d) return;
            if (d.color) { colorInput.value = d.color; applyColor(d.color); }
            if (d.size) { sizeRange.value = d.size; applySize(d.size); }
        } catch (_) {}
    }

    function saveSettings() {
        try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ color: colorInput.value, size: sizeRange.value })); } catch (_) {}
    }

    // ---- Persistencia ----
    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                accumulated: running ? elapsed() : accumulated,
                laps
            }));
        } catch (_) {}
    }

    function restoreState() {
        try {
            const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!d) return;
            accumulated = d.accumulated || 0;
            laps = d.laps || [];
            running = false;
            startTime = null;
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
            btnStart.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg> Iniciar';
            btnStart.className = 'btn btn-primary';
            btnLap.disabled = true;
            btnReset.style.display = accumulated > 0 ? '' : 'none';
            render();
            renderLaps();
        } catch (_) {}
    }

    // ---- Navegación ----
    function switchSection(id) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        navBtns.forEach(b => b.classList.remove('active'));
        const sec = document.getElementById('section-' + id);
        const btn = document.querySelector(`.nav-btn[data-section="${id}"]`);
        if (sec) sec.classList.add('active');
        if (btn) btn.classList.add('active');
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    }

    // ---- Eventos ----
    function bindEvents() {
        btnStart.addEventListener('click', toggle);
        btnLap.addEventListener('click', addLap);
        btnReset.addEventListener('click', reset);

        document.addEventListener('keydown', e => {
            if (e.target.tagName === 'INPUT') return;
            const sec = document.getElementById('section-cronometro');
            if (!sec || !sec.classList.contains('active')) return;
            if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggle(); }
            if ((e.key === 'l' || e.key === 'L') && !btnLap.disabled) addLap();
            if (e.key === 'r' || e.key === 'R') { if (!running) reset(); }
        });

        colorInput.addEventListener('input', e => { applyColor(e.target.value); saveSettings(); });
        sizeRange.addEventListener('input', e => { applySize(e.target.value); saveSettings(); });

        navBtns.forEach(b => b.addEventListener('click', () => switchSection(b.dataset.section)));

        menuBtn.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('open'); });
        overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });

        window.addEventListener('beforeunload', saveState);
    }

    document.addEventListener('DOMContentLoaded', init);
})();