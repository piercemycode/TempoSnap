/* ==============================
   TempoSnap – Lógica del cronómetro
   ============================== */

(function () {
    'use strict';

    // ---- Referencias DOM ----
    const timeDisplay = document.getElementById('timeDisplay');
    const daysDisplay = document.getElementById('daysDisplay');
    const btnStart = document.getElementById('btnStart');
    const btnLap = document.getElementById('btnLap');
    const btnReset = document.getElementById('btnReset');
    const lapsBody = document.getElementById('lapsBody');
    const lapsEmpty = document.getElementById('lapsEmpty');
    const lapsCount = document.getElementById('lapsCount');
    const precisionSelect = document.getElementById('precisionSelect');
    const colorInput = document.getElementById('colorInput');
    const fontSelect = document.getElementById('fontSelect');
    const sizeRange = document.getElementById('sizeRange');
    const sizeValue = document.getElementById('sizeValue');

    // ---- Estado interno ----
    let startTime = null;          // timestamp de la última reanudación
    let accumulated = 0;          // ms acumulados antes de la última pausa
    let running = false;
    let intervalId = null;
    let laps = [];                // { lapTime, totalTime }

    // ---- Constantes de almacenamiento ----
    const STORAGE_KEY = 'temposnap_state';

    // ---- Inicialización ----
    function init() {
        loadSettings();
        restoreState();
        bindEvents();
    }

    // ================================================================
    //  GESTIÓN DEL TIEMPO
    // ================================================================

    function now() {
        return performance.now();
    }

    /** Devuelve los ms totales transcurridos (incluyendo lo acumulado) */
    function elapsed() {
        if (!startTime) return accumulated;
        return accumulated + (now() - startTime);
    }

    function formatTime(ms, precision) {
        if (precision === undefined) precision = getPrecision();

        const totalMs = Math.max(0, ms);
        const totalSeconds = Math.floor(totalMs / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        const frac = totalMs % 1000;

        let fractionalPart;
        switch (precision) {
            case 0: fractionalPart = ''; break;
            case 1: fractionalPart = '.' + String(Math.floor(frac / 100)); break;
            case 2: fractionalPart = '.' + String(Math.floor(frac / 10)).padStart(2, '0'); break;
            default:
            case 3: fractionalPart = '.' + String(Math.floor(frac)).padStart(3, '0'); break;
        }

        const time = [
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(secs).padStart(2, '0')
        ].join(':') + fractionalPart;

        return { time, days };
    }

    function renderDisplay() {
        const ms = elapsed();
        const { time, days } = formatTime(ms);
        timeDisplay.textContent = time;

        if (days > 0) {
            daysDisplay.textContent = `${days} día${days > 1 ? 's' : ''} transcurrido${days > 1 ? 's' : ''}`;
        } else {
            daysDisplay.textContent = '';
        }
    }

    function tick() {
        renderDisplay();
    }

    function start() {
        if (running) return;
        running = true;
        startTime = now();

        intervalId = setInterval(tick, 16); // ~60 fps

        btnStart.textContent = 'Parar';
        btnStart.classList.remove('btn-start');
        btnStart.classList.add('btn-stop');
        btnStart.style.background = '#ff4757';
        btnStart.style.color = '#fff';
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

        btnStart.textContent = 'Iniciar';
        btnStart.classList.add('btn-start');
        btnStart.classList.remove('btn-stop');
        btnStart.style.background = '';
        btnStart.style.color = '';
        btnLap.disabled = true;
        btnReset.style.display = '';

        saveState();
    }

    function reset() {
        if (running) return;
        accumulated = 0;
        startTime = null;
        laps = [];
        renderDisplay();
        renderLaps();
        saveState();

        btnReset.style.display = 'none';
    }

    function toggleStartStop() {
        if (running) {
            stop();
        } else {
            start();
        }
    }

    // ================================================================
    //  VUELTAS
    // ================================================================

    function addLap() {
        if (!running) return;

        const totalMs = elapsed();
        const prevTotal = laps.length > 0 ? laps[laps.length - 1].totalTime : 0;
        const lapMs = totalMs - prevTotal;

        laps.push({ lapTime: lapMs, totalTime: totalMs });
        renderLaps();
        saveState();
    }

    function renderLaps() {
        lapsBody.innerHTML = '';

        if (laps.length === 0) {
            lapsEmpty.style.display = '';
            lapsCount.textContent = '(0)';
            return;
        }

        lapsEmpty.style.display = 'none';
        lapsCount.textContent = `(${laps.length})`;

        const precision = getPrecision();
        const fragment = document.createDocumentFragment();

        laps.forEach((lap, i) => {
            const tr = document.createElement('tr');

            const tdIndex = document.createElement('td');
            tdIndex.textContent = i + 1;

            const tdLap = document.createElement('td');
            tdLap.textContent = formatTime(lap.lapTime, precision).time;
            if (i === laps.length - 1) tdLap.classList.add('highlight');

            const tdTotal = document.createElement('td');
            tdTotal.textContent = formatTime(lap.totalTime, precision).time;

            tr.appendChild(tdIndex);
            tr.appendChild(tdLap);
            tr.appendChild(tdTotal);
            fragment.appendChild(tr);
        });

        lapsBody.appendChild(fragment);

        // Scroll automático al fondo
        const scrollContainer = lapsBody.closest('.laps-scroll');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    // ================================================================
    //  CONFIGURACIÓN
    // ================================================================

    function getPrecision() {
        return parseInt(precisionSelect.value, 10);
    }

    function applyColor(color) {
        document.documentElement.style.setProperty('--accent', color);
        timeDisplay.style.color = color;
        document.querySelector('.logo').style.color = color;
    }

    function applyFont(font) {
        timeDisplay.style.fontFamily = `'Inter', ${font}`;
    }

    function applySize(size) {
        timeDisplay.style.fontSize = size + 'rem';
        sizeValue.textContent = size;
    }

    function loadSettings() {
        try {
            const saved = JSON.parse(localStorage.getItem('temposnap_settings'));
            if (!saved) return;

            if (saved.precision) precisionSelect.value = saved.precision;
            if (saved.color) { colorInput.value = saved.color; applyColor(saved.color); }
            if (saved.font) { fontSelect.value = saved.font; applyFont(saved.font); }
            if (saved.size) { sizeRange.value = saved.size; applySize(saved.size); }
        } catch (_) { /* ignorar */ }
    }

    function saveSettings() {
        const data = {
            precision: precisionSelect.value,
            color: colorInput.value,
            font: fontSelect.value,
            size: sizeRange.value
        };
        try {
            localStorage.setItem('temposnap_settings', JSON.stringify(data));
        } catch (_) { /* ignorar */ }
    }

    // ================================================================
    //  PERSISTENCIA DE ESTADO (vueltas + tiempo al cerrar)
    // ================================================================

    function saveState() {
        const data = {
            accumulated: running ? elapsed() : accumulated,
            running: false,  // al recargar siempre arranca detenido
            laps: laps,
            precision: precisionSelect.value
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (_) { /* ignorar */ }
    }

    function restoreState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);

            accumulated = data.accumulated || 0;
            laps = data.laps || [];

            // Forzar que arranque detenido
            running = false;
            startTime = null;
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }

            btnStart.textContent = 'Iniciar';
            btnStart.style.background = '';
            btnStart.style.color = '';
            btnLap.disabled = true;
            btnReset.style.display = accumulated > 0 ? '' : 'none';

            renderDisplay();
            renderLaps();
        } catch (_) { /* ignorar */ }
    }

    // ================================================================
    //  EVENTOS
    // ================================================================

    function bindEvents() {
        // Botones principales
        btnStart.addEventListener('click', toggleStartStop);
        btnLap.addEventListener('click', addLap);
        btnReset.addEventListener('click', reset);

        // Teclado: espacio para iniciar/parar
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                toggleStartStop();
            }
            if ((e.key === 'l' || e.key === 'L') && !btnLap.disabled) {
                addLap();
            }
            if (e.key === 'r' || e.key === 'R') {
                if (!running) reset();
            }
        });

        // Configuración
        precisionSelect.addEventListener('change', () => {
            renderDisplay();
            renderLaps();
            saveSettings();
        });

        colorInput.addEventListener('input', (e) => {
            applyColor(e.target.value);
            saveSettings();
        });

        fontSelect.addEventListener('change', (e) => {
            applyFont(e.target.value);
            saveSettings();
        });

        sizeRange.addEventListener('input', (e) => {
            applySize(e.target.value);
            saveSettings();
        });

        // Guardar estado al cerrar/recargar
        window.addEventListener('beforeunload', saveState);

        // También guardamos cuando se detiene o se añade vuelta
        // (ya se hace en start/stop/addLap/reset)
    }

    // ================================================================
    //  ARRANQUE
    // ================================================================

    document.addEventListener('DOMContentLoaded', init);
})();