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
    const overlay = document.getElementById('pause-overlay');
    if (btn) btn.textContent = world.paused ? '▶' : '⏸';
    if (overlay) overlay.classList.toggle('hidden', !world.paused);
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
 * Applies a fake-fullscreen using the actual visual viewport (window.innerWidth/Height).
 * Avoids the iOS landscape bug where screen.width/height return portrait values.
 */
function applyFakeFullscreen(container) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ratio = 720 / 480;
    const fsW = Math.min(vw, vh * ratio);
    const fsH = Math.min(vh, vw / ratio);
    container.classList.add('fake-fullscreen');
    container.style.position = 'fixed';
    container.style.top    = Math.max(0, (vh - fsH) / 2) + 'px';
    container.style.left   = Math.max(0, (vw - fsW) / 2) + 'px';
    container.style.width  = fsW + 'px';
    container.style.height = fsH + 'px';
    container.style.border = 'none';
    container.style.borderRadius = '0';
    container.style.zIndex = '9999';
}

/**
 * Removes fake-fullscreen and restores all inline styles.
 */
function removeFakeFullscreen(container) {
    container.classList.remove('fake-fullscreen');
    ['position','top','left','width','height','border','borderRadius','zIndex'].forEach(p => {
        container.style[p] = '';
    });
}

/**
 * Toggles fullscreen. Native API on desktop browsers, JS fake-fullscreen on iOS Safari.
 */
function toggleFullscreen() {
    const container = document.getElementById('canvas-container');
    const isNative = document.fullscreenElement || document.webkitFullscreenElement;
    const isFake = container.classList.contains('fake-fullscreen');

    if (isNative) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        return;
    }
    if (isFake) {
        removeFakeFullscreen(container);
        return;
    }
    const req = container.requestFullscreen || container.webkitRequestFullscreen;
    if (req) {
        try {
            Promise.resolve(req.call(container)).catch(() => applyFakeFullscreen(container));
        } catch (_) {
            applyFakeFullscreen(container);
        }
    } else {
        applyFakeFullscreen(container);
    }
}
