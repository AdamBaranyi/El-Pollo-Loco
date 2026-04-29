/**
 * The main game world. Manages the game loop, physics, and game state.
 * Extends WorldRenderer for all canvas drawing logic.
 */
class World extends WorldRenderer {
    character = new Character();
    throwableObjects = [];
    camera_x = 0;
    coinsCollected = 0;
    bottlesCollected = 0;
    throwPending = false;
    gameEnded = false;
    paused = false;
    score = 0;
    animFrame;
    endboss;

    /**
     * Creates and initializes the game world.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Keyboard} keyboard - The keyboard input state object.
     * @param {Level} level - The current level object.
     */
    constructor(canvas, keyboard, level) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = level;
        this.character.world = this;
        this.endboss = level.enemies.find(e => e.isEndboss);
        this.setupStatusBars();
        this.draw();
        this.run();
    }

    /**
     * Initializes all HUD status bars at their default positions.
     */
    setupStatusBars() {
        this.statusBarHealth = new StatusBar('health', 10, 0);
        this.statusBarCoin = new StatusBar('coin', 10, 40);
        this.statusBarBottle = new StatusBar('bottle', 10, 80);
        this.statusBarEndboss = new StatusBar('endboss', 510, 50);
        this.statusBarCoin.setPercentage(0);
        this.statusBarBottle.setPercentage(0);
    }

    /**
     * Starts the main game logic loop at 60fps.
     */
    run() {
        const id = setInterval(() => {
            if (this.paused) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkThrowableHits();
            this.checkThrowableGround();
            this.cleanupThrowables();
            this.moveEndboss();
            this.checkEndbossFirstContact();
            this.checkGameEnd();
        }, 1000 / 60);
        storeInterval(id);
    }

    /**
     * Checks all collision types each game tick.
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottlePickups();
    }

    /**
     * Checks if character collides with any living enemy.
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (!enemy.isDead() && this.character.isColliding(enemy)) {
                this.handleEnemyCollision(enemy);
            }
        });
    }

    /**
     * Handles the outcome of a character–enemy collision.
     * @param {MovableObject} enemy - The enemy involved.
     */
    handleEnemyCollision(enemy) {
        if (enemy.canBeStopped && this.isStomping(enemy)) {
            this.stompEnemy(enemy);
        } else if (!this.character.isHurt() && !this.character.isDead()) {
            this.character.hit(enemy.hitStrength || 5);
            this.statusBarHealth.setPercentage(this.character.energy);
            soundManager.hurt();
        }
    }

    /**
     * Determines whether the character is landing on top of an enemy.
     * @param {MovableObject} enemy
     * @returns {boolean}
     */
    isStomping(enemy) {
        const charBottom = this.character.y + this.character.height - this.character.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top;
        return this.character.speedY < 0 && charBottom < enemyTop + 30;
    }

    /**
     * Kills an enemy by stomp and gives the character a bounce.
     * @param {MovableObject} enemy
     */
    stompEnemy(enemy) {
        enemy.energy = 0;
        enemy.die();
        this.character.speedY = 15;
        soundManager.enemyDead();
        this.score += enemy instanceof SmallChicken ? 100 : 50;
        this.scheduleEnemyRemoval(enemy);
    }

    /**
     * Removes a dead enemy from the level after 1 second.
     * @param {MovableObject} enemy
     */
    scheduleEnemyRemoval(enemy) {
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }, 1000);
    }

    /**
     * Checks if character collects any coins.
     */
    checkCoinCollisions() {
        this.level.coins = this.level.coins.filter(coin => {
            if (this.character.isColliding(coin)) { this.collectCoin(); return false; }
            return true;
        });
    }

    /**
     * Handles coin collection: updates counter, status bar, and grants bonus health every 10 coins.
     */
    collectCoin() {
        this.coinsCollected++;
        this.score += 10;
        this.statusBarCoin.setPercentage(Math.min(100, this.coinsCollected * 10));
        soundManager.collectCoin();
        if (this.coinsCollected % 5 === 0 && this.character.energy < 100) {
            this.character.energy = Math.min(100, this.character.energy + 10);
            this.statusBarHealth.setPercentage(this.character.energy);
        }
    }

    /**
     * Checks if character picks up ground bottles.
     */
    checkBottlePickups() {
        this.level.bottles = this.level.bottles.filter(bottle => {
            if (this.character.isColliding(bottle) && this.bottlesCollected < 10) {
                this.bottlesCollected++;
                this.statusBarBottle.setPercentage(this.bottlesCollected * 10);
                soundManager.collectBottle();
                return false;
            }
            return true;
        });
    }

    /**
     * Checks if the player throws a bottle (D key) and creates a throwable object.
     */
    checkThrowObjects() {
        if (this.keyboard.D && !this.throwPending && this.bottlesCollected > 0) {
            const x = this.character.otherDirection ? this.character.x : this.character.x + 100;
            this.throwableObjects.push(new ThrowableObject(x, this.character.y + 100, this.character.otherDirection));
            this.bottlesCollected--;
            this.statusBarBottle.setPercentage(this.bottlesCollected * 10);
            soundManager.throwBottle();
            this.throwPending = true;
            setTimeout(() => { this.throwPending = false; }, 500);
        }
    }

    /**
     * Checks if any thrown bottle has hit the ground and triggers splash.
     */
    checkThrowableGround() {
        this.throwableObjects.forEach(bottle => {
            if (bottle.y + bottle.height > 385 && !bottle.splashing) {
                bottle.splash();
                soundManager.splash();
            }
        });
    }

    /**
     * Checks if any thrown bottle collides with a living enemy.
     */
    checkThrowableHits() {
        this.throwableObjects.forEach(bottle => {
            if (bottle.splashing) return;
            this.level.enemies.forEach(enemy => {
                if (!enemy.isDead() && bottle.isColliding(enemy)) this.handleBottleHit(bottle, enemy);
            });
        });
    }

    /**
     * Applies damage to an enemy hit by a thrown bottle.
     * @param {ThrowableObject} bottle
     * @param {MovableObject} enemy
     */
    handleBottleHit(bottle, enemy) {
        bottle.splash();
        soundManager.splash();
        enemy.hit(enemy.isEndboss ? 20 : 50);
        if (enemy.isEndboss) this.onEndbossHit(enemy);
        if (!enemy.isEndboss && enemy.isDead()) this.onEnemyKilled(enemy);
    }

    /**
     * Handles endboss-specific bottle hit: updates status bar, plays sound, awards score.
     * @param {MovableObject} enemy
     */
    onEndbossHit(enemy) {
        this.statusBarEndboss.setPercentage(enemy.energy);
        soundManager.endbossHurt();
        if (enemy.isDead()) {
            this.statusBarEndboss.setPercentage(0);
            if (enemy.die) enemy.die();
            this.score += 500;
        }
    }

    /**
     * Handles regular enemy death by bottle: plays sound, awards score, schedules removal.
     * @param {MovableObject} enemy
     */
    onEnemyKilled(enemy) {
        if (enemy.die) enemy.die();
        soundManager.enemyDead();
        this.score += enemy instanceof SmallChicken ? 100 : 50;
        this.scheduleEnemyRemoval(enemy);
    }

    /**
     * Removes bottles from the array once their splash animation is complete.
     */
    cleanupThrowables() {
        this.throwableObjects = this.throwableObjects.filter(b => !b.splashDone);
    }

    /**
     * Moves the endboss toward the character once activated.
     */
    moveEndboss() {
        if (this.endboss) this.endboss.moveTowardCharacter(this.character.x);
    }

    /**
     * Triggers the endboss's first-contact state when character gets close.
     */
    checkEndbossFirstContact() {
        if (this.endboss && !this.endboss.firstContact && this.character.x > (this.endboss.x - 600)) {
            this.endboss.triggerFirstContact();
            soundManager.startEndbossMusic();
        }
    }

    /**
     * Checks whether the game has been won or lost and triggers the end screen.
     */
    checkGameEnd() {
        if (this.gameEnded) return;
        const deadAnimDone = this.character.currentDeadFrame >= this.character.IMAGES_DEAD.length - 1;
        if (this.character.isDead() && deadAnimDone) { this.gameEnded = true; this.triggerGameOver(); }
        if (this.endboss && this.endboss.isDead()) { this.gameEnded = true; this.triggerWin(); }
    }

    /**
     * Stops the game and shows the game-over screen.
     */
    triggerGameOver() {
        clearAllIntervals();
        cancelAnimationFrame(this.animFrame);
        soundManager.gameOver();
        this.saveHighscore();
        setTimeout(() => document.getElementById('game-over-screen').classList.remove('hidden'), 500);
    }

    /**
     * Stops the game and shows the win screen.
     */
    triggerWin() {
        clearAllIntervals();
        cancelAnimationFrame(this.animFrame);
        soundManager.win();
        this.saveHighscore();
        this.showWinScreenSequence();
    }

    /**
     * Shows "You Won" image quickly, then fades in the menu buttons.
     */
    showWinScreenSequence() {
        const winScreen = document.getElementById('win-screen');
        const winMenu = winScreen.querySelector('.end-content');
        winMenu.style.display = 'none';
        setTimeout(() => winScreen.classList.remove('hidden'), 500);
        setTimeout(() => { winMenu.style.display = ''; }, 1500);
    }

    /**
     * Saves the current score as highscore in localStorage if it's a new record.
     */
    saveHighscore() {
        const best = parseInt(localStorage.getItem('highscore') || '0');
        if (this.score > best) localStorage.setItem('highscore', this.score);
    }
}
