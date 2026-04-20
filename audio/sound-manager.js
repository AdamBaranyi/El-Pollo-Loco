/**
 * Manages all in-game audio using the Web Audio API.
 * Supports three background music tracks: menu, level, and endboss.
 */
class SoundManager {
    MENU_NOTES = [
        392, 0, 440, 0, 494, 0, 523, 0,
        494, 0, 440, 0, 392, 0,   0, 0,
        392, 0, 349, 0, 392, 0, 440, 0,
        440, 0,   0, 0,   0, 0,   0, 0,
        523, 0, 494, 0, 440, 0, 494, 0,
        523, 0, 587, 0, 523, 0,   0, 0,
        440, 0, 494, 0, 440, 0, 392, 0,
        392, 0,   0, 0,   0, 0,   0, 0
    ];

    LEVEL_NOTES = [
        330, 0, 392, 0, 440, 0, 523, 0,
        494, 0, 440, 0, 392, 0, 330, 0,
        294, 0, 330, 0, 392, 0, 440, 0,
        523, 0, 494, 0, 523, 0,   0, 0,
        392, 0, 440, 0, 494, 0, 440, 0,
        392, 0, 330, 0, 294, 0, 330, 0,
        440, 0, 494, 0, 523, 0, 587, 0,
        523, 0, 494, 0, 440, 0,   0, 0
    ];

    ENDBOSS_NOTES = [
        220, 0, 220, 0, 262, 0, 220, 0,
        196, 0, 196, 0, 220, 0, 196, 0,
        220, 0, 262, 0, 294, 0, 330, 0,
        294, 0, 262, 0, 220, 0,   0, 0,
        220, 0, 247, 0, 262, 0, 247, 0,
        220, 0, 196, 0, 175, 0, 196, 0,
        220, 0, 262, 0, 294, 0, 262, 0,
        220, 0,   0, 0, 220, 0,   0, 0
    ];

    constructor() {
        this.audioCtx = null;
        this.muted = localStorage.getItem('muted') !== 'false';
        this.bgInterval = null;
        this.bgNote = 0;
        this.activeNotes = null;
        this.activeTempo = 200;
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

    /** Starts the cheerful menu background music (280ms tempo). */
    startMenuMusic() { this.switchTrack(this.MENU_NOTES, 280); }

    /** Starts the energetic level background music (200ms tempo). */
    startLevelMusic() { this.switchTrack(this.LEVEL_NOTES, 200); }

    /** Starts the intense endboss background music (140ms tempo). */
    startEndbossMusic() { this.switchTrack(this.ENDBOSS_NOTES, 140); }

    /**
     * Switches to a new background music track.
     * @param {number[]} notes - Array of note frequencies (0 = pause).
     * @param {number} tempo - Milliseconds per beat.
     */
    switchTrack(notes, tempo) {
        this.stopBgMusic();
        this.activeNotes = notes;
        this.activeTempo = tempo;
        if (this.muted) return;
        this.bgNote = 0;
        this.bgInterval = setInterval(() => {
            const note = notes[this.bgNote++ % notes.length];
            if (note > 0) this.playTone(note, (tempo / 1000) * 0.75, 'triangle');
        }, tempo);
        storeInterval(this.bgInterval);
    }

    /**
     * Resumes the active track from where it left off (used after unmute/unpause).
     */
    resumeMusic() {
        if (!this.activeNotes || this.muted) return;
        this.bgInterval = setInterval(() => {
            const note = this.activeNotes[this.bgNote++ % this.activeNotes.length];
            if (note > 0) this.playTone(note, (this.activeTempo / 1000) * 0.75, 'triangle');
        }, this.activeTempo);
        storeInterval(this.bgInterval);
    }

    /**
     * Stops the currently playing background music.
     */
    stopBgMusic() {
        if (this.bgInterval) {
            clearInterval(this.bgInterval);
            this.bgInterval = null;
        }
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

    /** Plays endboss hurt/cluck sound when the endboss takes damage. */
    endbossHurt() {
        this.playTone(600, 0.05, 'sawtooth');
        setTimeout(() => this.playTone(500, 0.05, 'sawtooth'), 60);
        setTimeout(() => this.playTone(400, 0.1,  'sawtooth'), 120);
    }

    /** Plays snore sound effect during sleep animation. */
    snore() {
        this.playTone(180, 0.3, 'sine');
        setTimeout(() => this.playTone(140, 0.5, 'sine'), 350);
    }

    /** Plays victory fanfare. */
    win() {
        this.playTone(523, 0.2);
        setTimeout(() => this.playTone(659, 0.2), 200);
        setTimeout(() => this.playTone(784, 0.4), 400);
    }

    /**
     * Toggles mute state, persists it, and pauses/resumes music accordingly.
     */
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('muted', this.muted);
        if (this.muted) this.stopBgMusic();
        else this.resumeMusic();
        updateMuteButton();
    }
}

const soundManager = new SoundManager();
