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
    const height = vp ? vp.height : window.innerHeight;
    const width = vp ? vp.width : window.innerWidth;
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
        const canvas = document.getElementById('canvas');
        if (isTouchDevice() && width > height) applyMobileLandscape(wrapper, canvas, width, height);
        else applyDesktopAspect(wrapper, canvas, width, height);
    }
    document.body.style.width = width + 'px';
    document.body.style.height = height + 'px';
}

/** 
 * Applies native widescreen to fill mobile landscape without distortion. 
 * @param {HTMLElement} wrapper - The game wrapper element.
 * @param {HTMLCanvasElement} canvas - The game canvas.
 * @param {number} width - The viewport width.
 * @param {number} height - The viewport height.
 */
function applyMobileLandscape(wrapper, canvas, width, height) {
    const newWidth = Math.max(720, 480 * (width / height));
    if (canvas) canvas.width = newWidth;
    wrapper.style.width = width + 'px';
    wrapper.style.height = height + 'px';
}

/** 
 * Maintains strict 720x480 aspect ratio to prevent squishing on desktop/portrait. 
 * @param {HTMLElement} wrapper - The game wrapper element.
 * @param {HTMLCanvasElement} canvas - The game canvas.
 * @param {number} width - The viewport width.
 * @param {number} height - The viewport height.
 */
function applyDesktopAspect(wrapper, canvas, width, height) {
    if (canvas) canvas.width = 720;
    const ratio = 720 / 480;
    wrapper.style.width = Math.min(width, height * ratio) + 'px';
    wrapper.style.height = Math.min(height, width / ratio) + 'px';
}

/**
 * Initializes layout listeners for resizing and visual viewport changes.
 */
function setupLayoutListeners() {
    updateLayout();
    if (window.visualViewport) window.visualViewport.addEventListener('resize', updateLayout);
    window.addEventListener('resize', () => {
        updateLayout();
        if (!isTouchDevice()) hideMobileControls();
        else if (world && !world.gameEnded) showMobileControls();
    });
}

/**
 * Initializes UI elements like mute button, highscore, translations, and hides mobile controls.
 */
function initUIAndTranslations() {
    updateMuteButton();
    updateHighscoreDisplay();
    applyTranslations();
    hideMobileControls();
    registerAudioUnlock();
}

/**
 * Registers a one-time event listener to unlock audio on first user interaction.
 * Required by the browser Autoplay Policy which blocks audio until interaction.
 */
function registerAudioUnlock() {
    const unlockAudio = () => {
        if (!soundManager.muted) soundManager.startMenuMusic();
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
}

/**
 * Binds all mobile touch buttons to their respective keyboard keys.
 */
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
