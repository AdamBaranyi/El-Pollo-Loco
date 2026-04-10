/**
 * Base class for all drawable game objects.
 */
class DrawableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };

    /**
     * Loads a single image and sets it as current image.
     * @param {string} path - Relative path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads multiple images into the image cache.
     * @param {string[]} paths - Array of image paths to preload.
     */
    loadImages(paths) {
        paths.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object onto the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (e) {}
    }
}
