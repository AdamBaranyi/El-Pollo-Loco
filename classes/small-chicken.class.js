/**
 * Represents a small, faster chicken enemy.
 */
class SmallChicken extends MovableObject {
    y = 375;
    width = 55;
    height = 55;
    energy = 5;
    canBeStopped = true;
    offset = { top: 5, bottom: 3, left: 5, right: 5 };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_small/2_dead/dead.png';

    /**
     * Creates a small chicken at the given horizontal position.
     * @param {number} x - Starting x position.
     * @param {Object} [config={}] - Optional difficulty config.
     * @param {number} [config.speedMultiplier=1] - Speed multiplier.
     * @param {number} [config.hitStrength=5] - Damage dealt to character.
     */
    constructor(x, config = {}) {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGES_WALKING[0]);
        this.x = x;
        this.hitStrength = config.hitStrength || 5;
        this.speed = (0.5 + Math.random() * 0.6) * (config.speedMultiplier || 1);
        this.animate();
    }

    /**
     * Starts the small chicken's walk animation and movement loop.
     */
    animate() {
        const id1 = setInterval(() => {
            if (world && world.paused) return;
            if (!this.isDead()) this.playAnimation(this.IMAGES_WALKING);
        }, 100);
        const id2 = setInterval(() => {
            if (world && world.paused) return;
            this.x -= this.speed;
        }, 1000 / 60);
        storeInterval(id1);
        storeInterval(id2);
    }

    /**
     * Loads the dead image and stops movement.
     */
    die() {
        this.loadImage(this.IMAGE_DEAD);
        this.speed = 0;
    }
}
