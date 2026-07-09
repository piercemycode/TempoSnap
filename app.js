/* ==============================
   TempoSnap – Lógica completa
   ============================== */

(function () {
    'use strict';

    // ---- Referencias DOM ----
    const timeDisplay = document.getElementById('timeDisplay');
    const timeExtra = document.getElementById('timeExtra');
    const btnStart = document.getElementById('btnStart');
    const btnLap = document.getElementById('btnLap');
    const btnReset = document.getElementById('btnReset');
    const lapsBody = document.getElementById('lapsBody');
    const lapsEmpty = document.getElementById('lapsEmpty');
    const lapsCount = document.getElementById('lapsCount');
    const colorInput = document.getElementById('colorInput');
    const sizeRange = document.getElementById('sizeRange');
    const sizeValue = document.getElementById('sizeValue');

    // Sidebar
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuToggle = document.getElementById('menuToggle');
    const navBtns = document.querySelectorAll('.nav-btn');

    // ---- Estado del cronómetro ----
    let startTime = null;
    let accumulated = 0;
    let running = false;
    let intervalId = null;
    let laps = [];

    const STORAGE_KEY = 'temposnap_state';
    const SETTINGS_KEY = 'temposnap_settings';

    // ---- Inicialización ----
    function init() {
        loadSettings();
        restoreState();
        bindEvents();
    }

    // ================================================================
    //  GESTIÓN DEL TIEMPO (formato MM:SS.cc)
    // ================================================================

    function now() {
        return performance.now();
    }

    function elapsed() {
        if (!startTime) return accumulated;
        return accumulated + (now() - startTime);
    }

    /**
     * Formatea como MM:SS.cc (minutos:segundos.centésimas)
     * Si es >= 1 hora, muestra HH:MM:SS.cc
     */
    function formatTime(ms) {
        const totalMs = Math.max(0, ms);
        const totalSec = Math.floor(totalMs / 1000);

        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        const centesimas = Math.floor((totalMs % 1000) / 10);

        let time;
        if (hours > 0) {
            time = String(hours).padStart(2, '0') + ':' +
                   String(minutes).padStart(2, '0') + ':' +
                   String(secs).padStart(2, '0') + '.' +
                   String(centesimas).padStart(2, '0');
        } else {
            time = String(minutes).padStart(2, '0') + ':' +
                   String(secs).padStart(2, '0') + '.' +
                   String(centesimas).padStart(2, '0');
        }

        return { time, hours, minutes };
    }

    function renderDisplay() {
        const ms = elapsed();
        const { time, hours } = formatTime(ms);

        timeDisplay.textContent = time;

        if (hours > 0) {
            timeExtra.textContent = hours + ' hora' + (hours > 1 ? 's' : '') + ' transcurrida' + (hours > 1 ? 's' : '');
        } else {
            timeExtra.textContent = '';
        }
    }

    function tick() {
        renderDisplay();
    }

    // ================================================================
    //  ACCIONES DEL CRONÓMETRO
    // ================================================================

    function start() {
        if (running) return;
        running = true;
        startTime = now();

        intervalId = setInterval(tick, 16);

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
        btnReset.style.display = accumulated > 0 ? '' : 'none';

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
        if (running) stop();
        else start();
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
            lapsCount.textContent = '0';
            return;
        }

        lapsEmpty.style.display = 'none';
        lapsCount.textContent = String(laps.length);

        const fragment = document.createDocumentFragment();

        laps.forEach((lap, i) => {
            const tr = document.createElement('tr');

            const tdIndex = document.createElement('td');
            tdIndex.textContent = i + 1;

            const tdLap = document.createElement('td');
            tdLap.textContent = formatTime(lap.lapTime).time;
            if (i === laps.length - 1) tdLap.classList.add('highlight');

            const tdTotal = document.createElement('td');
            tdTotal.textContent = formatTime(lap.totalTime).time;

            tr.appendChild(tdIndex);
            tr.appendChild(tdLap);
            tr.appendChild(tdTotal);
            fragment.appendChild(tr);
        });

        lapsBody.appendChild(fragment);

        const scrollContainer = lapsBody.closest('.laps-scroll');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    // ================================================================
    //  CONFIGURACIÓN
    // ================================================================

    function applyColor(color) {
        document.documentElement.style.setProperty('--accent', color);
        timeDisplay.style.color = color;
        document.querySelector('.sidebar-logo').style.color = color;
        document.querySelectorAll('.nav-btn.active').forEach(el => {
            el.style.color = color;
        });
    }

    function applySize(size) {
        timeDisplay.style.fontSize = size + 'rem';
        sizeValue.textContent = parseFloat(size).toFixed(1);
    }

    function loadSettings() {
        try {
            const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
            if (!saved) return;

            if (saved.color) {
                colorInput.value = saved.color;
                applyColor(saved.color);
            }
            if (saved.size) {
                sizeRange.value = saved.size;
                applySize(saved.size);
            }
        } catch (_) {}
    }

    function saveSettings() {
        const data = {
            color: colorInput.value,
            size: sizeRange.value
        };
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
        } catch (_) {}
    }

    // ================================================================
    //  PERSISTENCIA DE ESTADO
    // ================================================================

    function saveState() {
        const data = {
            accumulated: running ? elapsed() : accumulated,
            running: false,
            laps: laps
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (_) {}
    }

    function restoreState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);

            accumulated = data.accumulated || 0;
            laps = data.laps || [];

            running = false;
            startTime = null;
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }

            btnStart.textContent = 'Iniciar';
            btnStart.classList.add('btn-start');
            btnStart.classList.remove('btn-stop');
            btnStart.style.background = '';
            btnStart.style.color = '';
            btnLap.disabled = true;
            btnReset.style.display = accumulated > 0 ? '' : 'none';

            renderDisplay();
            renderLaps();
        } catch (_) {}
    }

    // ================================================================
    //  NAVEGACIÓN ENTRE SECCIONES (Sidebar)
    // ================================================================

    function switchSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        // Desactivar todos los botones
        navBtns.forEach(btn => btn.classList.remove('active'));

        // Activar la sección correspondiente
        const targetSection = document.getElementById('section-' + sectionId);
        const targetBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);

        if (targetSection) targetSection.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');

        // Cerrar sidebar en móvil
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    }

    // ================================================================
    //  EVENTOS
    // ================================================================

    function bindEvents() {
        // Botones del cronómetro
        btnStart.addEventListener('click', toggleStartStop);
        btnLap.addEventListener('click', addLap);
        btnReset.addEventListener('click', reset);

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

            // Solo en sección de cronómetro activa
            const cronoSection = document.getElementById('section-cronometro');
            if (!cronoSection.classList.contains('active')) return;

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
        colorInput.addEventListener('input', (e) => {
            applyColor(e.target.value);
            saveSettings();
        });

        sizeRange.addEventListener('input', (e) => {
            applySize(e.target.value);
            saveSettings();
        });

        // Sidebar: navegación
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                switchSection(section);
            });
        });

        // Menú hamburguesa (móvil)
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        });

        // Persistencia al cerrar
        window.addEventListener('beforeunload', saveState);
    }

    // ---- Arranque ----
    document.addEventListener('DOMContentLoaded', init);
})();