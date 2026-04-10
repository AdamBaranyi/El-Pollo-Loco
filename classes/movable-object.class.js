/**
 * Base class for all movable game objects. Handles physics and collisions.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    groundY = 130;
    isThrowable = false;

    /**
     * Applies gravity to this object continuously.
     * Non-throwable objects are snapped to their ground level to prevent sinking.
     */
    applyGravity() {
        const id = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
                if (!this.isThrowable) this.y = this.groundY;
            }
        }, 1000 / 25);
        storeInterval(id);
    }

    /**
     * Checks if the object is above the ground level.
     * Throwable objects are always considered above ground (gravity always active).
     * @returns {boolean}
     */
    isAboveGround() {
        if (this.isThrowable) return true;
        return this.y < this.groundY;
    }

    /**
     * Checks if this object collides with another using offset hitboxes.
     * @param {MovableObject} mo - The other movable object.
     * @returns {boolean}
     */
    isColliding(mo) {
        return (
            this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
        );
    }

    /**
     * Reduces object energy by the defined hit strength.
     * @param {number} [damage] - Optional damage amount, defaults to object's hitStrength or 5.
     */
    hit(damage) {
        this.energy -= damage || this.hitStrength || 5;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
    }

    /**
     * Checks if the object has zero energy (is dead).
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Checks if the object was hurt within the last second.
     * @returns {boolean}
     */
    isHurt() {
        const timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 1000;
    }

    /**
     * Advances the animation by one frame cycling through the given images.
     * @param {string[]} images - Array of image paths to cycle through.
     */
    playAnimation(images) {
        const i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    /**
     * Moves the object to the right by its speed value.
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Moves the object to the left by its speed value.
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = true;
    }

    /**
     * Makes the object jump by setting an upward vertical speed.
     */
    jump() {
        this.speedY = 28;
    }
}
