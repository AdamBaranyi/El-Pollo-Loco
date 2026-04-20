/**
 * UI helper functions: dialogs, pause, mute, fullscreen, HUD updates.
 * Depends on global variables defined in script.js (world, soundManager, etc.)
 */

/**
 * Updates the Next Level button visibility based on the current level.
 */
function updateNextLevelBtn() {
    const btn = document.getElementById('next-level-btn');
    if (btn) btn.style.display = currentLevelNum >= 3 ? 'none' : '';
}

/**
 * Updates the highscore display on the start screen from localStorage.
 */
function updateHighscoreDisplay() {
    const best = localStorage.getItem('highscore');
    const el = document.getElementById('highscore-display');
    if (el) el.textContent = best ? `Best: ${best} pts` : '';
}

/**
 * Updates the mute button icon to reflect current mute state.
 */
function updateMuteButton() {
    const btn = document.getElementById('mute-btn');
    if (btn) btn.textContent = soundManager.muted ? '🔇' : '🔊';
}

/**
 * Opens the controls dialog overlay.
 */
function openControls() {
    document.getElementById('controls-dialog').classList.remove('hidden');
}

/**
 * Opens the how-to-play dialog overlay.
 */
function openHowToPlay() {
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
 * When unmuting on the menu, starts the menu music.
 */
function toggleMute() {
    soundManager.toggleMute();
    if (!soundManager.muted && !world) soundManager.startMenuMusic();
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
