/**
 * Manages all in-game audio.
 * Background music uses real audio files (menu, level).
 * Endboss music and sound effects use Web Audio API synthesis.
 */
class SoundManager {
    constructor() {
        this.muted = localStorage.getItem('muted') !== 'false';
        this.bgAudio = null;
        this.activeTrack = null;
    }

/**
     * Plays a looping real audio file as background music.
     * @param {string} src - Path to the audio file.
     * @param {number} [volume=0.4]
     */
    startBgAudio(src, volume = 0.4) {
        this.bgAudio = new Audio(src);
        this.bgAudio.loop = true;
        this.bgAudio.volume = volume;
        this.bgAudio.play().catch(() => {});
    }

    /** Starts the menu background music. */
    startMenuMusic() {
        this.stopBgMusic();
        this.activeTrack = 'menu';
        if (this.muted) return;
        this.startBgAudio('audio/sounds/menu/menu_sound.mp3');
    }

    /** Starts the level background music. */
    startLevelMusic() {
        this.stopBgMusic();
        this.activeTrack = 'level';
        if (this.muted) return;
        this.startBgAudio('audio/sounds/menu/game_background_sound.mp3');
    }

    /** Starts the endboss background music. */
    startEndbossMusic() {
        this.stopBgMusic();
        this.activeTrack = 'endboss';
        if (this.muted) return;
        this.startBgAudio('audio/sounds/menu/endboss_background_sound.mp3');
    }

    /**
     * Resumes the active background track (used after unmute/unpause).
     */
    resumeMusic() {
        if (this.muted || !this.activeTrack) return;
        if (this.activeTrack === 'menu') this.startMenuMusic();
        else if (this.activeTrack === 'level') this.startLevelMusic();
        else if (this.activeTrack === 'endboss') this.startEndbossMusic();
    }

    /**
     * Stops all background music (real and synthesized).
     */
    stopBgMusic() {
        if (this.bgAudio) {
            this.bgAudio.pause();
            this.bgAudio.currentTime = 0;
            this.bgAudio = null;
        }
    }

    /**
     * Plays a real audio file as a one-shot sound effect.
     * @param {string} src - Path to the audio file.
     * @param {number} [volume=1]
     */
    playSound(src, volume = 1) {
        if (this.muted) return;
        const audio = new Audio(src);
        audio.volume = volume;
        audio.play().catch(() => {});
    }

    /** Plays sound when starting a game. */
    playGameStart() { this.playSound('audio/sounds/menu/play_game_sound.mp3', 0.8); }

    /** Plays sound when advancing to the next level. */
    nextLevelSound() { this.playSound('audio/sounds/menu/next_level_sound.mp3', 0.8); }

    /** Plays sound when returning to the main menu. */
    backToMenuSound() { this.playSound('audio/sounds/menu/back_to_mainmenu_sound.mp3', 0.8); }

    /** Plays jump sound effect. */
    jump() { this.playSound('audio/sounds/character/characterJump.wav', 0.6); }

    /** Plays coin collection sound effect. */
    collectCoin() { this.playSound('audio/sounds/collectibles/collectSound.wav', 0.7); }

    /** Plays bottle pickup sound effect. */
    collectBottle() { this.playSound('audio/sounds/collectibles/bottleCollectSound.wav', 0.7); }

    /** Plays bottle throw sound effect. */
    throwBottle() { this.playSound('audio/sounds/throwable/throw_bottle_sound.mp3', 0.8); }

    /** Plays bottle splash/break sound effect. */
    splash() { this.playSound('audio/sounds/throwable/bottleBreak.mp3', 0.8); }

    /** Plays enemy death sound effect. */
    enemyDead() { this.playSound('audio/sounds/chicken/chickenDead.mp3', 0.8); }

    /** Plays player hurt sound effect. */
    hurt() { this.playSound('audio/sounds/character/characterDamage.mp3', 0.8); }

    /** Plays game over sound effect. */
    gameOver() { this.playSound('audio/sounds/character/characterDead.wav', 1.0); }

    /** Plays endboss hurt sound. */
    endbossHurt() { this.playSound('audio/sounds/endboss/endbossApproach.wav', 0.9); }

    /** Plays snore sound effect during sleep animation. */
    snore() { this.playSound('audio/sounds/character/characterSnoring.mp3', 0.5); }

    /** Plays victory fanfare. */
    win() { this.playSound('audio/sounds/game/gameStart.mp3', 1.0); }

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
