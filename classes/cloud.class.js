/**
 * Represents a moving cloud in the background.
 */
class Cloud extends MovableObject {
    y = 20;
    width = 400;
    height = 200;

    /**
     * Creates a cloud at the given x position.
     * @param {number} x - Starting horizontal position.
     */
    constructor(x) {
        super();
        const imgs = [
            'img/5_background/layers/4_clouds/1.png',
            'img/5_background/layers/4_clouds/2.png'
        ];
        this.loadImage(imgs[Math.floor(Math.random() * 2)]);
        this.x = x || Math.random() * 2500;
        this.speed = 0.12 + Math.random() * 0.05;
        this.animate();
    }

    /**
     * Starts the cloud's drift animation (moves left continuously).
     */
    animate() {
        const id = setInterval(() => {
            this.x -= this.speed;
            if (this.x < -this.width) this.x = 2800;
        }, 1000 / 60);
        storeInterval(id);
    }
}
