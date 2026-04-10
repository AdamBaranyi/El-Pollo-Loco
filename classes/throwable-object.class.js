/**
 * Represents a thrown salsa bottle projectile.
 */
class ThrowableObject extends MovableObject {
    width = 60;
    height = 60;
    groundY = 370;
    isThrowable = true;
    splashing = false;
    splashDone = false;
    offset = { top: 5, bottom: 5, left: 5, right: 5 };

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates and launches a bottle from the character's position.
     * @param {number} x - Starting x position.
     * @param {number} y - Starting y position.
     * @param {boolean} otherDirection - True if thrown to the left.
     */
    constructor(x, y, otherDirection) {
        super();
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.throw();
    }

    /**
     * Starts the throwing arc with gravity and horizontal motion.
     */
    throw() {
        this.speedY = 10;
        this.applyGravity();
        const id = setInterval(() => {
            if (!this.splashing) {
                this.x += this.otherDirection ? -10 : 10;
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 25);
        storeInterval(id);
    }

    /**
     * Triggers the splash animation and marks the bottle for removal after completion.
     */
    splash() {
        if (this.splashing) return;
        this.splashing = true;
        this.speedY = 0;
        this.acceleration = 0;
        let frame = 0;
        const id = setInterval(() => {
            if (frame < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[frame]];
                frame++;
            } else {
                clearInterval(id);
                this.splashDone = true;
            }
        }, 80);
        storeInterval(id);
    }
}
