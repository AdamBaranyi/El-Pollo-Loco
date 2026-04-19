/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');

/** Tracks all active setInterval IDs for cleanup on restart. */
let allIntervals = [];

/** @type {World} */
let world;

/** @type {number} */
let currentLevelNum = 1;

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

/** @type {Keyboard} */
const keyboard = new Keyboard();

// Mobile touch controls

/**
 * Binds touch events to a mobile button to simulate key presses.
 * @param {string} id - The button element ID.
 * @param {string} key - The keyboard key to toggle.
 */
function bindMobileButton(id, key) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', e => { e.preventDefault(); keyboard[key] = true; }, { passive: false });
    btn.addEventListener('touchend', () => { keyboard[key] = false; });
    btn.addEventListener('contextmenu', e => e.preventDefault());
}

// Game lifecycle

/**
 * Starts the game: hides the start screen and initializes the world.
 * @param {number} levelNum - The level to start (default 1).
 */
/**
 * Returns the correct level object for the given level number.
 * @param {number} num
 * @returns {Level}
 */
function createLevel(num) {
    if (num === 3) return initLevel3();
    if (num === 2) return initLevel2();
    return initLevel1();
}

/**
 * Updates the Next Level button visibility based on the current level.
 */
function updateNextLevelBtn() {
    const btn = document.getElementById('next-level-btn');
    if (btn) btn.style.display = currentLevelNum >= 3 ? 'none' : '';
}

function startGame(levelNum = 1) {
    currentLevelNum = levelNum;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('pause-btn').style.display = 'block';
    soundManager.getCtx();
    updateNextLevelBtn();
    world = new World(canvas, keyboard, createLevel(currentLevelNum));
    soundManager.startLevelMusic();
}

/**
 * Restarts the game after game-over or win without reloading the page.
 */
function restartGame() {
    clearAllIntervals();
    if (world) cancelAnimationFrame(world.animFrame);
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('win-screen').classList.add('hidden');
    document.getElementById('pause-btn').style.display = 'block';
    soundManager.stopBgMusic();
    world = new World(canvas, keyboard, createLevel(currentLevelNum));
    soundManager.startLevelMusic();
}

/**
 * Starts the next level (max level 3).
 */
function nextLevel() {
    document.getElementById('win-screen').classList.add('hidden');
    startGame(Math.min(currentLevelNum + 1, 3));
}

/**
 * Returns the player to the home screen without reloading the page.
 */
function goHome() {
    clearAllIntervals();
    if (world) cancelAnimationFrame(world.animFrame);
    world = null;
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('win-screen').classList.add('hidden');
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('pause-btn').style.display = 'none';
    soundManager.startMenuMusic();
    updateHighscoreDisplay();
}

// UI helpers

/**
 * Opens the controls dialog overlay.
 */
function openControls() {
    soundManager.startMenuMusic();
    document.getElementById('controls-dialog').classList.remove('hidden');
}

/**
 * Opens the how-to-play dialog overlay.
 */
function openHowToPlay() {
    soundManager.startMenuMusic();
    document.getElementById('how-to-play-dialog').classList.remove('hidden');
}

/**
 * Closes a dialog overlay by its element ID.
 * @param {string} id - The dialog element ID to close.
 */
function closeDialog(id) {
    document.getElementById(id).classList.add('hidden');
}

/**
 * Closes a dialog when clicking the backdrop.
 * @param {Event} e - The click event.
 * @param {string} id - The dialog element ID.
 */
function closeOnBackdrop(e, id) {
    if (e.target.id === id) closeDialog(id);
}

/**
 * Toggles the pause state of the running game.
 */
function togglePause() {
    if (!world || world.gameEnded) return;
    world.paused = !world.paused;
    const btn = document.getElementById('pause-btn');
    if (btn) btn.textContent = world.paused ? '▶' : '⏸';
    if (world.paused) soundManager.stopBgMusic();
    else soundManager.resumeMusic();
}

/**
 * Toggles the global mute state via the SoundManager.
 * Also starts menu music on first interaction if still on the start screen.
 */
function toggleMute() {
    if (!world) soundManager.startMenuMusic();
    soundManager.toggleMute();
}

/**
 * Updates the mute button icon to reflect current mute state.
 */
function updateMuteButton() {
    const btn = document.getElementById('mute-btn');
    if (btn) btn.textContent = soundManager.muted ? '🔇' : '🔊';
}

/**
 * Toggles fullscreen mode for the canvas container.
 */
function toggleFullscreen() {
    const container = document.getElementById('canvas-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen();
    }
}

/**
 * Initialization function called on page load.
 * Sets up UI state and binds mobile touch controls.
 */
/**
 * Updates the highscore display on the start screen from localStorage.
 */
function updateHighscoreDisplay() {
    const best = localStorage.getItem('highscore');
    const el = document.getElementById('highscore-display');
    if (el) el.textContent = best ? `Best: ${best} pts` : '';
}

/**
 * Initialization function called on page load.
 * Sets up UI state and binds mobile touch controls.
 */
function init() {
    updateMuteButton();
    updateHighscoreDisplay();
    applyTranslations();
    bindMobileButton('btn-left', 'LEFT');
    bindMobileButton('btn-right', 'RIGHT');
    bindMobileButton('btn-jump', 'UP');
    bindMobileButton('btn-throw', 'D');
}
