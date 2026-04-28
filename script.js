/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');

/** Tracks all active setInterval IDs for cleanup on restart. */
let allIntervals = [];

/** @type {World} */
let world;

/** @type {number} */
let currentLevelNum = 1;

/** Score carried over from the previous level. */
let carryScore = 0;

/** @type {Keyboard} */
const keyboard = new Keyboard();

/**
 * Registers an interval ID so it can be cleared on game restart.
 * @param {number} id - The interval ID returned by setInterval.
 */
function storeInterval(id) {
    allIntervals.push(id);
}

/**
 * Clears all registered intervals and resets the tracking array.
 */
function clearAllIntervals() {
    allIntervals.forEach(id => clearInterval(id));
    allIntervals = [];
}

/**
 * Binds touch events to a mobile button to simulate key presses.
 * @param {string} id - The button element ID.
 * @param {string} key - The keyboard key to toggle.
 */
function bindMobileButton(id, key) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const release = () => { keyboard[key] = false; };
    btn.addEventListener('touchstart', e => { e.preventDefault(); keyboard[key] = true; }, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('contextmenu', e => e.preventDefault());
}

/**
 * Detects whether the user is on a touch device.
 * @returns {boolean}
 */
function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

/** Shows mobile controls during gameplay, but only on touch devices. */
function showMobileControls() {
    if (isTouchDevice()) {
        const el = document.getElementById('mobile-controls');
        if (el) el.style.display = 'flex';
    }
}

/** Hides mobile controls on menu/non-game screens. */
function hideMobileControls() {
    const el = document.getElementById('mobile-controls');
    if (el) el.style.display = 'none';
}

/**
 * Sets wrapper/body dimensions from the actual visible viewport (fixes iOS Safari 100vh bug).
 * Uses visualViewport when available so the canvas always fits the visible area exactly.
 */
function updateLayout() {
    const vp = window.visualViewport;
    const h = vp ? vp.height : window.innerHeight;
    const w = vp ? vp.width : window.innerWidth;
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
        const canvas = document.getElementById('canvas');
        if (isTouchDevice() && w > h) applyMobileLandscape(wrapper, canvas, w, h);
        else applyDesktopAspect(wrapper, canvas, w, h);
    }
    document.body.style.width = w + 'px';
    document.body.style.height = h + 'px';
}

/** Applies native widescreen to fill mobile landscape without distortion. */
function applyMobileLandscape(wrapper, canvas, w, h) {
    const newWidth = Math.max(720, 480 * (w / h));
    if (canvas) canvas.width = newWidth;
    wrapper.style.width = w + 'px';
    wrapper.style.height = h + 'px';
}

/** Maintains strict 720x480 aspect ratio to prevent squishing on desktop/portrait. */
function applyDesktopAspect(wrapper, canvas, w, h) {
    if (canvas) canvas.width = 720;
    const ratio = 720 / 480;
    wrapper.style.width = Math.min(w, h * ratio) + 'px';
    wrapper.style.height = Math.min(h, w / ratio) + 'px';
}

function setupLayoutListeners() {
    updateLayout();
    if (window.visualViewport) window.visualViewport.addEventListener('resize', updateLayout);
    window.addEventListener('resize', () => {
        updateLayout();
        if (!isTouchDevice()) hideMobileControls();
        else if (world && !world.gameEnded) showMobileControls();
    });
}

function initUIAndTranslations() {
    updateMuteButton();
    updateHighscoreDisplay();
    applyTranslations();
    hideMobileControls();
}

function bindMobileControls() {
    bindMobileButton('btn-left', 'LEFT');
    bindMobileButton('btn-right', 'RIGHT');
    bindMobileButton('btn-jump', 'UP');
    bindMobileButton('btn-throw', 'D');
}

/**
 * Initialization function called on page load.
 * Sets up UI state and binds mobile touch controls.
 */
function init() {
    setupLayoutListeners();
    initUIAndTranslations();
    bindMobileControls();
}
