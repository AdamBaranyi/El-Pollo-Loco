/**
 * Represents a status bar (health, coin, bottle, or endboss) in the HUD.
 */
class StatusBar extends DrawableObject {
    percentage = 100;
    width = 200;
    height = 50;
    IMAGES = [];

    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
    ];

    IMAGES_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    IMAGES_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    IMAGES_ENDBOSS = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    /**
     * Creates a status bar of the given type at the specified position.
     * @param {'health'|'coin'|'bottle'|'endboss'} type - Bar type.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(type, x, y) {
        super();
        this.x = x;
        this.y = y;
        this.selectImages(type);
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

    /**
     * Assigns the correct image set based on bar type.
     * @param {'health'|'coin'|'bottle'|'endboss'} type
     */
    selectImages(type) {
        const map = {
            health: this.IMAGES_HEALTH,
            coin: this.IMAGES_COIN,
            bottle: this.IMAGES_BOTTLE,
            endboss: this.IMAGES_ENDBOSS
        };
        this.IMAGES = map[type] || this.IMAGES_HEALTH;
    }

    /**
     * Updates the bar to reflect the given percentage value.
     * @param {number} percentage - A value between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[this.IMAGES[this.getImageIndex()]];
    }

    /**
     * Maps the percentage to one of six image indices.
     * @returns {number} Index 0–5 corresponding to fill level.
     */
    getImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}
