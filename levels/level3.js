/**
 * Builds and returns the background tile objects for level 3.
 * @returns {BackgroundObject[]}
 */
function createBackgroundObjectsL3() {
    const objs = [];
    for (let i = -1; i <= 8; i++) {
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
 * Returns the enemy array for level 3 — hardest endboss config.
 * @returns {MovableObject[]}
 */
function createEnemiesL3() {
    const endboss = new Endboss({
        hitStrength: 30,
        chargeInterval: 1500,
        chargeMultiplier: 2.2,
        phaseSpeed: [2.5, 4.0, 6.5]
    });
    endboss.x = 5500;
    return [
        new Chicken(700),    new SmallChicken(900),
        new Chicken(1100),   new SmallChicken(1300),
        new Chicken(1600),   new SmallChicken(1800),
        new Chicken(2100),   new SmallChicken(2300),
        new Chicken(2600),   new SmallChicken(2800),
        new Chicken(3100),   new SmallChicken(3300),
        new Chicken(3600),   new SmallChicken(3800),
        new Chicken(4100),   new SmallChicken(4300),
        new Chicken(4600),   new SmallChicken(4800),
        new Chicken(5000),
        endboss
    ];
}

/**
 * Returns the cloud array for level 3.
 * @returns {Cloud[]}
 */
function createCloudsL3() {
    return [
        new Cloud(200),  new Cloud(700),
        new Cloud(1300), new Cloud(1900),
        new Cloud(2500), new Cloud(3100),
        new Cloud(3700), new Cloud(4300),
        new Cloud(4900), new Cloud(5500)
    ];
}

/**
 * Returns the coin array for level 3.
 * @returns {Coin[]}
 */
function createCoinsL3() {
    return [
        new Coin(300, 280),  new Coin(550, 230),
        new Coin(800, 280),  new Coin(1050, 200),
        new Coin(1300, 260), new Coin(1550, 280),
        new Coin(1800, 230), new Coin(2050, 260),
        new Coin(2300, 280), new Coin(2550, 230),
        new Coin(2800, 280), new Coin(3050, 200),
        new Coin(3300, 260), new Coin(3550, 280),
        new Coin(3800, 230), new Coin(4050, 260),
        new Coin(4300, 280), new Coin(4600, 230),
        new Coin(4900, 260), new Coin(5200, 280)
    ];
}

/**
 * Returns the salsa bottle array for level 3.
 * Extra bottles near the endboss for final restocking.
 * @returns {SalsaBottle[]}
 */
function createBottlesL3() {
    return [
        new SalsaBottle(300),  new SalsaBottle(600),
        new SalsaBottle(900),  new SalsaBottle(1200),
        new SalsaBottle(1600), new SalsaBottle(1900),
        new SalsaBottle(2300), new SalsaBottle(2700),
        new SalsaBottle(3100), new SalsaBottle(3500),
        new SalsaBottle(3900), new SalsaBottle(4300),
        new SalsaBottle(4700), new SalsaBottle(5000),
        new SalsaBottle(5100), new SalsaBottle(5200),
        new SalsaBottle(5300), new SalsaBottle(5400)
    ];
}

/**
 * Initializes and returns the complete Level 3 instance.
 * @returns {Level}
 */
function initLevel3() {
    const level = new Level(
        createEnemiesL3(),
        createCloudsL3(),
        createBackgroundObjectsL3(),
        createCoinsL3(),
        createBottlesL3()
    );
    level.level_end_x = 5500;
    return level;
}
