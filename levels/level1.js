/**
 * Builds and returns the background tile objects for level 1.
 * Alternates between image variants to create a seamless loop.
 * @returns {BackgroundObject[]}
 */
function createBackgroundObjects() {
    const objs = [];
    for (let i = -1; i <= 7; i++) {
        const v = Math.abs(i % 2) === 0 ? '1' : '2';
        objs.push(
            new BackgroundObject('img/5_background/layers/air.png', 719 * i),
            new BackgroundObject(`img/5_background/layers/3_third_layer/${v}.png`, 719 * i),
            new BackgroundObject(`img/5_background/layers/2_second_layer/${v}.png`, 719 * i),
            new BackgroundObject(`img/5_background/layers/1_first_layer/${v}.png`, 719 * i)
        );
    }
    return objs;
}

/**
 * Returns the enemy array for level 1.
 * @returns {MovableObject[]}
 */
function createEnemiesL1() {
    return [
        new Chicken(700),
        new Chicken(900),
        new SmallChicken(1000),
        new Chicken(1200),
        new SmallChicken(1350),
        new Chicken(1500),
        new SmallChicken(1700),
        new Chicken(1900),
        new Endboss()
    ];
}

/**
 * Returns the cloud array for level 1.
 * @returns {Cloud[]}
 */
function createCloudsL1() {
    return [
        new Cloud(200),
        new Cloud(700),
        new Cloud(1300),
        new Cloud(1900),
        new Cloud(2400)
    ];
}

/**
 * Returns the coin array for level 1.
 * @returns {Coin[]}
 */
function createCoinsL1() {
    return [
        new Coin(300, 280),
        new Coin(480, 230),
        new Coin(650, 280),
        new Coin(850, 200),
        new Coin(1050, 260),
        new Coin(1250, 280),
        new Coin(1450, 230),
        new Coin(1650, 260),
        new Coin(1850, 280),
        new Coin(2050, 230)
    ];
}

/**
 * Returns the salsa bottle array for level 1.
 * @returns {SalsaBottle[]}
 */
function createBottlesL1() {
    return [
        new SalsaBottle(300),
        new SalsaBottle(550),
        new SalsaBottle(800),
        new SalsaBottle(1050),
        new SalsaBottle(1300),
        new SalsaBottle(1550),
        new SalsaBottle(1800),
        new SalsaBottle(2050),
        new SalsaBottle(2150),
        new SalsaBottle(2300)
    ];
}

/**
 * Initializes and returns the complete Level 1 instance.
 * @returns {Level}
 */
function initLevel1() {
    const level = new Level(
        createEnemiesL1(),
        createCloudsL1(),
        createBackgroundObjects(),
        createCoinsL1(),
        createBottlesL1()
    );
    level.level_end_x = 3000;
    return level;
}
