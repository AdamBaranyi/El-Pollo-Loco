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

// ─── Keyboard ───────────────────────────────────────────────────────────────

/** Holds the current state of all relevant keyboard keys. */
const keyboard = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    D: false
};

window.addEventListener('keydown', e => {
    if (e.keyCode === 37) keyboard.LEFT = true;
    if (e.keyCode === 39) keyboard.RIGHT = true;
    if (e.keyCode === 38 || e.keyCode === 32) keyboard.UP = true;
    if (e.keyCode === 68) keyboard.D = true;
    if (e.keyCode === 32) e.preventDefault();
});

window.addEventListener('keyup', e => {
    if (e.keyCode === 37) keyboard.LEFT = false;
    if (e.keyCode === 39) keyboard.RIGHT = false;
    if (e.keyCode === 38 || e.keyCode === 32) keyboard.UP = false;
    if (e.keyCode === 68) keyboard.D = false;
});

// ─── Mobile touch controls ───────────────────────────────────────────────────

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

bindMobileButton('btn-left', 'LEFT');
bindMobileButton('btn-right', 'RIGHT');
bindMobileButton('btn-jump', 'UP');
bindMobileButton('btn-throw', 'D');

// ─── Sound Manager ───────────────────────────────────────────────────────────

/**
 * Manages all in-game audio using the Web Audio API.
 */
class SoundManager {
    constructor() {
        this.audioCtx = null;
        this.muted = localStorage.getItem('muted') === 'true';
        this.bgInterval = null;
        this.bgNote = 0;
        this.bgNotes = [
            330, 0, 330, 440,  0, 440, 330, 220,  
            330, 0, 330, 440,  0, 440, 330, 220,
            440, 0, 440, 554,  0, 554, 440, 330, 
            330, 0, 330, 440,  0, 440, 330, 220  
        ];
    }

    /**
     * Returns (and lazily creates) the shared AudioContext.
     * @returns {AudioContext}
     */
    getCtx() {
        if (!this.audioCtx) this.audioCtx = new AudioContext();
        return this.audioCtx;
    }

    /**
     * Creates and connects an oscillator/gain node pair to the audio context.
     * @param {AudioContext} ctx
     * @param {string} type - Oscillator waveform type.
     * @param {number} freq - Frequency in Hz.
     * @returns {{ osc: OscillatorNode, gain: GainNode }}
     */
    buildOscillator(ctx, type, freq) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.value = freq;
        return { osc, gain };
    }

    /**
     * Plays a synthesized tone with the given frequency and duration.
     * @param {number} freq - Frequency in Hz.
     * @param {number} duration - Duration in seconds.
     * @param {string} [type='sine'] - Oscillator waveform type.
     */
    playTone(freq, duration, type = 'sine') {
        if (this.muted) return;
        const ctx = this.getCtx();
        const { osc, gain } = this.buildOscillator(ctx, type, freq);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    /** Plays jump sound effect. */
    jump() { this.playTone(523, 0.15); }

    /** Plays coin collection sound effect. */
    collectCoin() { this.playTone(880, 0.1); }

    /** Plays bottle pickup sound effect. */
    collectBottle() { this.playTone(440, 0.12); }

    /** Plays bottle throw sound effect. */
    throwBottle() { this.playTone(330, 0.2, 'sawtooth'); }

    /** Plays bottle splash sound effect. */
    splash() { this.playTone(220, 0.3, 'triangle'); }

    /** Plays enemy death sound effect. */
    enemyDead() { this.playTone(200, 0.25, 'sawtooth'); }

    /** Plays player hurt sound effect. */
    hurt() { this.playTone(150, 0.4, 'sawtooth'); }

    /** Plays game over sound effect. */
    gameOver() { this.playTone(110, 1.0, 'sawtooth'); }

    /** Plays victory sound effect. */
    win() {
        this.playTone(523, 0.2);
        setTimeout(() => this.playTone(659, 0.2), 200);
        setTimeout(() => this.playTone(784, 0.4), 400);
    }

    /**
     * Starts the looping background music.
     */
    startBgMusic() {
        if (this.bgInterval) return;
        this.bgInterval = setInterval(() => {
            const note = this.bgNotes[this.bgNote % this.bgNotes.length];
            if (note > 0) this.playTone(note, 0.15, 'triangle');
            this.bgNote++;
        }, 200);
        storeInterval(this.bgInterval);
    }

    /**
     * Stops the background music.
     */
    stopBgMusic() {
        if (this.bgInterval) {
            clearInterval(this.bgInterval);
            this.bgInterval = null;
        }
    }

    /**
     * Toggles mute state and persists it in localStorage.
     */
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('muted', this.muted);
        if (this.muted) this.stopBgMusic();
        else this.startBgMusic();
        updateMuteButton();
    }
}

const soundManager = new SoundManager();

// ─── Game lifecycle ───────────────────────────────────────────────────────────

/**
 * Starts the game: hides the start screen and initializes the world.
 * @param {number} levelNum - The level to start (default 1).
 */
function startGame(levelNum = 1) {
    currentLevelNum = levelNum;
    document.getElementById('start-screen').style.display = 'none';
    soundManager.getCtx();
    let levelObj = currentLevelNum === 1 ? initLevel1() : initLevel2();
    world = new World(canvas, keyboard, levelObj);
    soundManager.startBgMusic();
}

/**
 * Restarts the game after game-over or win without reloading the page.
 */
function restartGame() {
    clearAllIntervals();
    if (world) cancelAnimationFrame(world.animFrame);
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('win-screen').classList.add('hidden');
    soundManager.stopBgMusic();
    soundManager.bgInterval = null;
    let levelObj = currentLevelNum === 1 ? initLevel1() : initLevel2();
    world = new World(canvas, keyboard, levelObj);
    soundManager.startBgMusic();
}

/**
 * Starts the next level.
 */
function nextLevel() {
    startGame(currentLevelNum === 1 ? 2 : 1);
    document.getElementById('win-screen').classList.add('hidden');
}

/**
 * Returns the player to the home screen without reloading the page.
 */
function goHome() {
    clearAllIntervals();
    if (world) cancelAnimationFrame(world.animFrame);
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('win-screen').classList.add('hidden');
    document.getElementById('start-screen').style.display = 'flex';
    soundManager.stopBgMusic();
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

/**
 * Opens the controls dialog overlay.
 */
function openControls() {
    document.getElementById('controls-dialog').classList.remove('hidden');
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
 * Toggles the global mute state via the SoundManager.
 */
function toggleMute() {
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

// Apply saved mute state on load
updateMuteButton();
