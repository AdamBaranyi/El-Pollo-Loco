/**
 * Represents a collectible coin item in the game world.
 */
class Coin extends MovableObject {
    width = 80;
    height = 80;
    offset = { top: 10, bottom: 10, left: 10, right: 10 };

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a coin at the specified position.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[0]);
        this.x = x;
        this.y = y || 280;
        this.animate();
    }

    /**
     * Plays the coin's spinning animation loop.
     */
    animate() {
        const id = setInterval(() => this.playAnimation(this.IMAGES), 200);
        storeInterval(id);
    }
}
