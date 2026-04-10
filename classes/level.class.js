/**
 * Represents a game level and holds all its game objects.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 2200;

    /**
     * Creates a level with all its game objects.
     * @param {MovableObject[]} enemies - All enemy instances.
     * @param {Cloud[]} clouds - Cloud objects for the background.
     * @param {BackgroundObject[]} backgroundObjects - Parallax background tiles.
     * @param {Coin[]} coins - Collectible coins.
     * @param {SalsaBottle[]} bottles - Ground salsa bottles.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
