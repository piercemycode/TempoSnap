/* ==============================
   TempoSnap — Lógica completa
   ============================== */

(function () {
    'use strict';

    // ==================== DOM ====================
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.getElementById('menuBtn');
    const navBtns = document.querySelectorAll('.nav-btn');
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeBtn = document.getElementById('mobileThemeBtn');

    // ---- CRONÓMETRO ----
    const cronoDisplay = document.getElementById('cronoDisplay');
    const cronoExtra = document.getElementById('cronoExtra');
    const cronoStart = document.getElementById('cronoStart');
    const cronoVuelta = document.getElementById('cronoVuelta');
    const cronoReset = document.getElementById('cronoReset');
    const cronoEmpty = document.getElementById('cronoEmpty');
    const cronoTable = document.getElementById('cronoTable');
    const cronoTbody = document.getElementById('cronoTbody');
    const cronoBadge = document.getElementById('cronoBadge');
    const cronoColor = document.getElementById('cronoColor');
    const cronoSise = document.getElementById('cronoSise');
    const cronoSizeVal = document.getElementById('cronoSizeVal');

    // ---- TEMPORIZADOR ----
    const timerSet = document.getElementById('timerSet');
    const timerDisplayWrap = document.getElementById('timerDisplayWrap');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerExtra = document.getElementById('timerExtra');
    const timerHours = document.getElementById('timerHours');
    const timerMins = document.getElementById('timerMins');
    const timerSecs = document.getElementById('timerSecs');
    const timerStartBtn = document.getElementById('timerStartBtn');
    const timerPauseBtn = document.getElementById('timerPauseBtn');
    const timerStopBtn = document.getElementById('timerStopBtn');

    // ---- ALARMA ----
    const alarmClock = document.getElementById('alarmClock');
    const alarmNow = document.getElementById('alarmNow');
    const alarmHour = document.getElementById('alarmHour');
    const alarmMin = document.getElementById('alarmMin');
    const alarmSetBtn = document.getElementById('alarmSetBtn');
    const alarmStatus = document.getElementById('alarmStatus');

    // ---- RELOJ ----
    const clockDisplay = document.getElementById('clockDisplay');
    const clockDate = document.getElementById('clockDate');
    const clock24h = document.getElementById('clock24h');
    const clock12h = document.getElementById('clock12h');

    // ==================== SONIDO ====================
    const SOUND_DATA = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAgICAf39/f4CAgIB/f39/gICAf39/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f4CAgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f4CAgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f3+AgH9/f3+AgH9/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f4CAf39/f3+AgH9/f39/gIB/f39/gICAf39/f4CAgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f4CAf39/f3+AgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f3+AgH9/f3+AgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f4CAgH9/f3+AgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f3+AgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAgH9/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CAf39/f39/gIB/f39/gICAf39/f4CA';

    function createSound() {
        const audio = new Audio(SOUND_DATA);
        audio.loop = true;
        return audio;
    }

    // ==================== TEMA ====================
    const THEME_KEY = 'temposnap_theme';

    function setTheme(theme) {
        document.body.className = theme;
        try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    }

    function toggleTheme() {
        setTheme(document.body.className === 'dark' ? 'light' : 'dark');
    }

    function loadTheme() {
        try {
            const saved = localStorage.getItem(THEME_KEY);
            if (saved === 'light' || saved === 'dark') setTheme(saved);
        } catch (_) {}
    }

    // ==================== CRONÓMETRO ====================
    let cronoStartTime = null;
    let cronoAcc = 0;
    let cronoRunning = false;
    let cronoId = null;
    let cronoLaps = [];

    const perf = () => performance.now();

    function cronoElapsed() {
        return cronoStartTime ? cronoAcc + (perf() - cronoStartTime) : cronoAcc;
    }

    function cronoFmt(ms) {
        const t = Math.max(0, ms);
        const totalSec = Math.floor(t / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const c = Math.floor((t % 1000) / 10);
        if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(c).padStart(2,'0')}`;
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(c).padStart(2,'0')}`;
    }

    function cronoRender() {
        const ms = cronoElapsed();
        const totalSec = Math.floor(Math.max(0, ms) / 1000);
        const h = Math.floor(totalSec / 3600);
        cronoDisplay.textContent = cronoFmt(ms);
        cronoExtra.textContent = h > 0 ? `${h} hora${h > 1 ? 's' : ''}` : '';
    }

    function cronoStartFn() {
        if (cronoRunning) return;
        cronoRunning = true;
        cronoStartTime = perf();
        cronoId = setInterval(cronoRender, 16);
        cronoStart.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Parar';
        cronoStart.className = 'btn btn-stop';
        cronoVuelta.disabled = false;
        cronoReset.style.display = 'none';
        cronoSave();
    }

    function cronoStopFn() {
        if (!cronoRunning) return;
        cronoAcc = cronoElapsed();
        cronoRunning = false;
        clearInterval(cronoId);
        cronoId = null;
        cronoStartTime = null;
        cronoStart.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg> Iniciar';
        cronoStart.className = 'btn btn-primary';
        cronoVuelta.disabled = true;
        cronoReset.style.display = cronoAcc > 0 ? '' : 'none';
        cronoSave();
    }

    function cronoToggle() { cronoRunning ? cronoStopFn() : cronoStartFn(); }

    function cronoResetFn() {
        if (cronoRunning) return;
        cronoAcc = 0;
        cronoStartTime = null;
        cronoLaps = [];
        cronoRender();
        cronoRenderLaps();
        cronoSave();
        cronoReset.style.display = 'none';
    }

    function cronoAddLap() {
        if (!cronoRunning) return;
        const total = cronoElapsed();
        const prev = cronoLaps.length ? cronoLaps[cronoLaps.length - 1].total : 0;
        cronoLaps.push({ lap: total - prev, total });
        cronoRenderLaps();
        cronoSave();
    }

    function cronoRenderLaps() {
        if (!cronoLaps.length) {
            cronoEmpty.style.display = '';
            cronoTable.style.display = 'none';
            cronoBadge.textContent = '0';
            return;
        }
        cronoEmpty.style.display = 'none';
        cronoTable.style.display = '';
        cronoBadge.textContent = String(cronoLaps.length);
        cronoTbody.innerHTML = '';
        const frag = document.createDocumentFragment();
        cronoLaps.forEach((l, i) => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td'); td1.textContent = i + 1;
            const td2 = document.createElement('td'); td2.textContent = cronoFmt(l.lap);
            if (i === cronoLaps.length - 1) td2.classList.add('highlight');
            const td3 = document.createElement('td'); td3.textContent = cronoFmt(l.total);
            tr.append(td1, td2, td3);
            frag.appendChild(tr);
        });
        cronoTbody.appendChild(frag);
    }

    function cronoLoad() {
        try {
            const d = JSON.parse(localStorage.getItem('temposnap_crono'));
            if (!d) return;
            cronoAcc = d.acc || 0;
            cronoLaps = d.laps || [];
            cronoRunning = false;
            cronoStartTime = null;
            if (cronoId) { clearInterval(cronoId); cronoId = null; }
            cronoStart.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg> Iniciar';
            cronoStart.className = 'btn btn-primary';
            cronoVuelta.disabled = true;
            cronoReset.style.display = cronoAcc > 0 ? '' : 'none';
            cronoRender();
            cronoRenderLaps();
        } catch (_) {}
    }

    function cronoSave() {
        try {
            localStorage.setItem('temposnap_crono', JSON.stringify({
                acc: cronoRunning ? cronoElapsed() : cronoAcc,
                laps: cronoLaps
            }));
        } catch (_) {}
    }

    // ==================== TEMPORIZADOR ====================
    let timerTotalMs = 0;
    let timerRemaining = 0;
    let timerRunning = false;
    let timerPaused = false;
    let timerId = null;
    let timerSound = null;

    function timerFmt(ms) {
        const t = Math.max(0, ms);
        const totalSec = Math.floor(t / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const c = Math.floor((t % 1000) / 10);
        if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(c).padStart(2,'0')}`;
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(c).padStart(2,'0')}`;
    }

    function timerRender() {
        timerDisplay.textContent = timerFmt(timerRemaining);
        const totalSec = Math.floor(Math.max(0, timerRemaining) / 1000);
        const h = Math.floor(totalSec / 3600);
        timerExtra.textContent = h > 0 ? `${h} hora${h > 1 ? 's' : ''} restante${h > 1 ? 's' : ''}` : '';
    }

    function timerStartFn() {
        const h = parseInt(timerHours.value) || 0;
        const m = parseInt(timerMins.value) || 0;
        const s = parseInt(timerSecs.value) || 0;
        if (h === 0 && m === 0 && s === 0) return;

        timerTotalMs = (h * 3600 + m * 60 + s) * 1000;
        timerRemaining = timerTotalMs;
        timerRunning = true;
        timerPaused = false;

        timerSet.style.display = 'none';
        timerDisplayWrap.style.display = 'block';
        timerPauseBtn.textContent = 'Pausa';
        timerRender();

        clearInterval(timerId);
        timerId = setInterval(() => {
            if (!timerPaused) {
                timerRemaining -= 1000 / 60;
                if (timerRemaining <= 0) {
                    timerRemaining = 0;
                    timerRender();
                    timerFinish();
                    return;
                }
                timerRender();
            }
        }, 1000 / 60);
    }

    function timerPauseFn() {
        if (!timerRunning) return;
        timerPaused = !timerPaused;
        timerPauseBtn.textContent = timerPaused ? 'Reanudar' : 'Pausa';
    }

    function timerStopFn() {
        timerRunning = false;
        timerPaused = false;
        clearInterval(timerId);
        timerId = null;
        timerRemaining = 0;
        if (timerSound) { timerSound.pause(); timerSound = null; }
        timerSet.style.display = 'block';
        timerDisplayWrap.style.display = 'none';
    }

    function timerFinish() {
        clearInterval(timerId);
        timerId = null;
        timerRunning = false;
        timerPaused = false;

        if (!timerSound) timerSound = createSound();
        timerSound.currentTime = 0;
        timerSound.play().catch(() => {});

        timerPauseBtn.textContent = 'Pausa';
        const origHtml = timerStopBtn.innerHTML;
        timerStopBtn.innerHTML = '🔕 Cerrar';
        timerStopBtn.onclick = () => {
            if (timerSound) { timerSound.pause(); timerSound = null; }
            timerStopBtn.innerHTML = origHtml;
            timerStopBtn.onclick = timerStopFn;
            timerSet.style.display = 'block';
            timerDisplayWrap.style.display = 'none';
        };
    }

    // ==================== ALARMA ====================
    let alarmSound = null;
    let alarmInterval = null;
    let alarmActive = false;

    function alarmCheck() {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const targetH = parseInt(alarmHour.value) || 0;
        const targetM = parseInt(alarmMin.value) || 0;

        if (alarmActive && h === targetH && m === targetM) {
            if (!alarmSound) alarmSound = createSound();
            alarmSound.currentTime = 0;
            alarmSound.play().catch(() => {});
            alarmStatus.textContent = '🔔 ¡ALARMA! 🔔';
            alarmStatus.className = 'alarm-status ringing';
            clearInterval(alarmInterval);
            alarmInterval = null;
        }
    }

    function alarmToggle() {
        if (alarmActive) {
            alarmActive = false;
            if (alarmSound) { alarmSound.pause(); alarmSound = null; }
            if (alarmInterval) { clearInterval(alarmInterval); alarmInterval = null; }
            alarmStatus.textContent = 'Alarma desactivada';
            alarmStatus.className = 'alarm-status';
            alarmSetBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> Activar alarma';
        } else {
            alarmActive = true;
            const h = parseInt(alarmHour.value) || 0;
            const m = parseInt(alarmMin.value) || 0;
            alarmStatus.textContent = `⏰ Alarma activada a las ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
            alarmStatus.className = 'alarm-status active';
            alarmSetBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Desactivar alarma';
            alarmInterval = setInterval(alarmCheck, 10000);
            alarmCheck();
        }
    }

    function alarmUpdateClock() {
        const now = new Date();
        alarmClock.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        alarmNow.textContent = `Hora actual · ${now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
    }

    // ==================== RELOJ ====================
    let clock24 = true;

    function clockUpdate() {
        const now = new Date();
        let h = now.getHours();
        let period = '';
        if (!clock24) {
            period = h >= 12 ? ' PM' : ' AM';
            h = h % 12 || 12;
        }
        clockDisplay.textContent = `${String(h).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}` + (clock24 ? '' : period);
        clockDate.textContent = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    // ==================== NAVEGACIÓN ====================
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

    // ==================== CONFIG CRONO ====================
    function cronoApplyColor(c) {
        document.documentElement.style.setProperty('--accent', c);
        cronoDisplay.style.color = c;
        document.querySelector('.logo').style.color = c;
        document.querySelector('.mobile-logo').style.color = c;
        document.querySelectorAll('.laps-badge').forEach(b => b.style.color = c);
        document.querySelector('.clock-display').style.color = c;
        alarmClock.style.color = c;
    }

    function cronoApplySize(s) {
        cronoDisplay.style.fontSize = s + 'rem';
        cronoSizeVal.textContent = s;
    }

    function cronoLoadSettings() {
        try {
            const d = JSON.parse(localStorage.getItem('temposnap_cfg_crono'));
            if (!d) return;
            if (d.color) { cronoColor.value = d.color; cronoApplyColor(d.color); }
            if (d.size) { cronoSise.value = d.size; cronoApplySize(d.size); }
        } catch (_) {}
    }

    function cronoSaveSettings() {
        try {
            localStorage.setItem('temposnap_cfg_crono', JSON.stringify({ color: cronoColor.value, size: cronoSise.value }));
        } catch (_) {}
    }

    // ==================== EVENTOS ====================
    function bindEvents() {
        menuBtn.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('open'); });
        overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });
        navBtns.forEach(b => b.addEventListener('click', () => switchSection(b.dataset.section)));

        themeToggle.addEventListener('click', toggleTheme);
        mobileThemeBtn.addEventListener('click', toggleTheme);

        cronoStart.addEventListener('click', cronoToggle);
        cronoVuelta.addEventListener('click', cronoAddLap);
        cronoReset.addEventListener('click', cronoResetFn);
        cronoColor.addEventListener('input', e => { cronoApplyColor(e.target.value); cronoSaveSettings(); });
        cronoSise.addEventListener('input', e => { cronoApplySize(e.target.value); cronoSaveSettings(); });

        timerStartBtn.addEventListener('click', timerStartFn);
        timerPauseBtn.addEventListener('click', timerPauseFn);
        timerStopBtn.addEventListener('click', timerStopFn);

        alarmSetBtn.addEventListener('click', alarmToggle);

        clock24h.addEventListener('click', () => { clock24 = true; clock24h.classList.add('active'); clock12h.classList.remove('active'); clockUpdate(); });
        clock12h.addEventListener('click', () => { clock24 = false; clock12h.classList.add('active'); clock24h.classList.remove('active'); clockUpdate(); });

        document.addEventListener('keydown', e => {
            if (e.target.tagName === 'INPUT') return;
            const sec = document.getElementById('section-cronometro');
            if (!sec || !sec.classList.contains('active')) return;
            if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); cronoToggle(); }
            if ((e.key === 'l' || e.key === 'L') && !cronoVuelta.disabled) cronoAddLap();
            if (e.key === 'r' || e.key === 'R') { if (!cronoRunning) cronoResetFn(); }
        });

        window.addEventListener('beforeunload', () => { cronoSave(); });

        setInterval(alarmUpdateClock, 1000);
        setInterval(clockUpdate, 1000);

        timerSet.style.display = 'block';
        timerDisplayWrap.style.display = 'none';
    }

    // ==================== INICIO ====================
    function init() {
        loadTheme();
        cronoLoadSettings();
        cronoLoad();
        alarmUpdateClock();
        clockUpdate();
        bindEvents();
    }

    document.addEventListener('DOMContentLoaded', init);
})();