/**
 * Represents a normal-sized chicken enemy.
 */
class Chicken extends MovableObject {
    y = 350;
    width = 80;
    height = 80;
    energy = 5;
    canBeStopped = true;
    offset = { top: 5, bottom: 3, left: 5, right: 5 };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    /**
     * Creates a chicken enemy at the given horizontal position.
     * @param {number} x - Starting x position.
     */
    constructor(x) {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGES_WALKING[0]);
        this.x = x;
        this.speed = 0.3 + Math.random() * 0.5;
        this.animate();
    }

    /**
     * Starts the chicken's walk animation and movement loop.
     */
    animate() {
        const id1 = setInterval(() => {
            if (!this.isDead()) this.playAnimation(this.IMAGES_WALKING);
        }, 150);
        const id2 = setInterval(() => { this.x -= this.speed; }, 1000 / 60);
        storeInterval(id1);
        storeInterval(id2);
    }

    /**
     * Plays the death animation when chicken energy reaches zero.
     */
    die() {
        this.loadImage(this.IMAGE_DEAD);
        this.speed = 0;
    }
}
