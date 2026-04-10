/**
 * Represents a static background layer tile for parallax scrolling.
 */
class BackgroundObject extends DrawableObject {
    width = 719;
    height = 480;

    /**
     * Creates a background tile at the given position.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position of the tile.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 0;
    }
}
