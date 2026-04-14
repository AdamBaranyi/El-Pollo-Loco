/**
 * The main game world. Manages the draw loop, physics, and game state.
 */
class World {
    character = new Character();
    throwableObjects = [];
    camera_x = 0;
    coinsCollected = 0;
    bottlesCollected = 0;
    throwPending = false;
    gameEnded = false;
    animFrame;
    endboss;

    /**
     * Creates and initializes the game world.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Keyboard} keyboard - The keyboard input state object.
     * @param {Level} level - The current level object.
     */
    constructor(canvas, keyboard, level) {
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
     * Updates the camera position to follow the character.
     */
    updateCamera() {
        this.camera_x = -this.character.x + 100;
        this.camera_x = Math.min(0, this.camera_x);
    }

    /**
     * Main draw loop — clears canvas and renders all game objects each frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawFixedUI();
        this.animFrame = requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws all scrolling world objects onto the canvas.
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
    }

    /**
     * Draws all fixed HUD elements (status bars) on top of the canvas.
     */
    drawFixedUI() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        if (this.endboss && this.endboss.firstContact) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    /**
     * Draws a single object, handling horizontal flip if needed.
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flips the canvas context to draw an object facing left.
     * @param {DrawableObject} mo
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas context after a horizontal flip.
     * @param {DrawableObject} mo
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Calls addToMap for each object in an array.
     * @param {DrawableObject[]} objects
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
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
    }

    /**
     * Checks if character collects any coins.
     */
    checkCoinCollisions() {
        this.level.coins = this.level.coins.filter(coin => {
            if (this.character.isColliding(coin)) {
                this.collectCoin();
                return false;
            }
            return true;
        });
    }

    /**
     * Handles coin collection: updates counter, status bar, and grants bonus health every 10 coins.
     */
    collectCoin() {
        this.coinsCollected++;
        this.statusBarCoin.setPercentage(Math.min(100, this.coinsCollected * 10));
        soundManager.collectCoin();
        if (this.coinsCollected % 10 === 0 && this.character.energy < 100) {
            this.character.energy = Math.min(100, this.character.energy + 20);
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
                const pct = this.bottlesCollected * 10;
                this.statusBarBottle.setPercentage(pct);
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
            if (bottle.y + bottle.height > 370 && !bottle.splashing) {
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
                if (!enemy.isDead() && bottle.isColliding(enemy)) {
                    this.handleBottleHit(bottle, enemy);
                }
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
        if (enemy.isEndboss) {
            enemy.hit(20);
        } else {
            enemy.hit(50);
        }
        soundManager.splash();
        if (enemy.isEndboss) {
            this.statusBarEndboss.setPercentage(enemy.energy);
        }
        if (enemy.isDead() && enemy.die) enemy.die();
        if (enemy.isDead() && !enemy.isEndboss) soundManager.enemyDead();
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
        }
    }

    /**
     * Checks whether the game has been won or lost and triggers the end screen.
     */
    checkGameEnd() {
        if (this.gameEnded) return;
        const deadAnimDone = this.character.currentDeadFrame >= this.character.IMAGES_DEAD.length - 1;
        if (this.character.isDead() && deadAnimDone) {
            this.gameEnded = true;
            this.triggerGameOver();
        }
        if (this.endboss && this.endboss.isDead()) {
            this.gameEnded = true;
            this.triggerWin();
        }
    }

    /**
     * Stops the game and shows the game-over screen.
     */
    triggerGameOver() {
        clearAllIntervals();
        cancelAnimationFrame(this.animFrame);
        soundManager.gameOver();
        setTimeout(() => document.getElementById('game-over-screen').classList.remove('hidden'), 500);
    }

    /**
     * Stops the game and shows the win screen.
     */
    triggerWin() {
        clearAllIntervals();
        cancelAnimationFrame(this.animFrame);
        soundManager.win();
        setTimeout(() => document.getElementById('win-screen').classList.remove('hidden'), 1800);
    }
}
