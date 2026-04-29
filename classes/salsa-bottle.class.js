/**
 * Represents a salsa bottle item lying on the ground (collectible).
 */
class SalsaBottle extends MovableObject {
    width = 70;
    height = 70;
    offset = { top: 15, bottom: 10, left: 20, right: 20 };

    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a salsa bottle on the ground at the specified x position.
     * @param {number} x - Horizontal position.
     */
    constructor(x) {
        super();
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[Math.floor(Math.random() * 2)]);
        this.x = x;
        this.y = 355;
    }
}
