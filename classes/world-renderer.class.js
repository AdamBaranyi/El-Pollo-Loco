/**
 * Handles all canvas rendering for the game world.
 * Extended by World to separate drawing logic from game logic.
 */
class WorldRenderer {
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
            this.statusBarEndboss.x = this.canvas.width - 210;
            this.addToMap(this.statusBarEndboss);
        }
        this.drawScore();
    }

    /**
     * Draws the current score in the top-center of the canvas.
     */
    drawScore() {
        const text = `Score: ${this.score}`;
        this.ctx.font = 'bold 28px Boogaloo, sans-serif';
        this.ctx.textAlign = 'center';
        
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillText(text, this.canvas.width / 2 + 2, 34);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(text, this.canvas.width / 2, 32);

        this.ctx.textAlign = 'left';
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
}
