/**
 * Game lifecycle functions: start, restart, next level, go home.
 * Depends on global variables defined in script.js (canvas, keyboard, world, etc.)
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
 * Starts the game: hides the start screen and initializes the world.
 * @param {number} levelNum - The level to start (default 1).
 */
function startGame(levelNum = 1) {
    currentLevelNum = levelNum;
    document.getElementById('start-screen').style.display = 'none';
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.style.display = 'block';
    pauseBtn.textContent = '⏸';
    soundManager.playGameStart();
    updateNextLevelBtn();
    showMobileControls();
    world = new World(canvas, keyboard, createLevel(currentLevelNum));
    world.score = carryScore;
    carryScore = 0;
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
    document.getElementById('pause-overlay').classList.add('hidden');
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.style.display = 'block';
    pauseBtn.textContent = '⏸';
    soundManager.stopBgMusic();
    world = new World(canvas, keyboard, createLevel(currentLevelNum));
    soundManager.startLevelMusic();
}

/**
 * Starts the next level (max level 3), carrying over the current score.
 */
function nextLevel() {
    carryScore = world ? world.score : 0;
    soundManager.nextLevelSound();
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
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('pause-btn').style.display = 'none';
    hideMobileControls();
    soundManager.backToMenuSound();
    soundManager.startMenuMusic();
    updateHighscoreDisplay();
}
