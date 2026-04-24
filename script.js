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

/** Shows mobile controls during gameplay. */
function showMobileControls() {
    const el = document.getElementById('mobile-controls');
    if (el) el.style.display = 'flex';
}

/** Hides mobile controls on menu/non-game screens. */
function hideMobileControls() {
    const el = document.getElementById('mobile-controls');
    if (el) el.style.display = 'none';
}

/**
 * Initialization function called on page load.
 * Sets up UI state and binds mobile touch controls.
 */
function init() {
    updateMuteButton();
    updateHighscoreDisplay();
    applyTranslations();
    hideMobileControls();
    bindMobileButton('btn-left', 'LEFT');
    bindMobileButton('btn-right', 'RIGHT');
    bindMobileButton('btn-jump', 'UP');
    bindMobileButton('btn-throw', 'D');
}
