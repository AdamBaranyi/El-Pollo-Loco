/**
 * Builds and returns the background tile objects for level 2.
 * @returns {BackgroundObject[]}
 */
function createBackgroundObjectsL2() {
    const objs = [];
    for (let i = -1; i <= 6; i++) {
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
 * Returns the enemy array for level 2.
 * @returns {MovableObject[]}
 */
function createEnemiesL2() {
    const endboss = new Endboss({
        hitStrength: 25,
        chargeInterval: 2000,
        chargeMultiplier: 2.0,
        phaseSpeed: [2.0, 3.5, 5.5]
    });
    endboss.x = 4200;
    return [
        new Chicken(700),
        new Chicken(900),
        new SmallChicken(1000),
        new Chicken(1200),
        new SmallChicken(1400),
        new Chicken(1600),
        new Chicken(1800),
        new SmallChicken(2000),
        new Chicken(2300),
        new SmallChicken(2500),
        new Chicken(2800),
        new SmallChicken(3000),
        new Chicken(3200),
        new Chicken(3500),
        new SmallChicken(3700),
        new Chicken(3900),
        endboss
    ];
}

/**
 * Returns the cloud array for level 2.
 * @returns {Cloud[]}
 */
function createCloudsL2() {
    return [
        new Cloud(200),
        new Cloud(700),
        new Cloud(1300),
        new Cloud(1900),
        new Cloud(2500),
        new Cloud(3100),
        new Cloud(3700),
        new Cloud(4300)
    ];
}

/**
 * Returns the coin array for level 2.
 * @returns {Coin[]}
 */
function createCoinsL2() {
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
        new Coin(2050, 230),
        new Coin(2250, 280),
        new Coin(2500, 230),
        new Coin(2750, 280),
        new Coin(3000, 200),
        new Coin(3300, 260),
        new Coin(3500, 280),
        new Coin(3800, 230)
    ];
}

/**
 * Returns the salsa bottle array for level 2.
 * Extra bottles placed near the endboss so players can restock before the final fight.
 * @returns {SalsaBottle[]}
 */
function createBottlesL2() {
    return [
        new SalsaBottle(300),
        new SalsaBottle(500),
        new SalsaBottle(700),
        new SalsaBottle(1000),
        new SalsaBottle(1300),
        new SalsaBottle(1600),
        new SalsaBottle(1900),
        new SalsaBottle(2200),
        new SalsaBottle(2600),
        new SalsaBottle(2900),
        new SalsaBottle(3200),
        new SalsaBottle(3500),
        new SalsaBottle(3800),
        new SalsaBottle(3950),
        new SalsaBottle(4050),
        new SalsaBottle(4100),
        new SalsaBottle(4150)
    ];
}

/**
 * Initializes and returns the complete Level 2 instance.
 * @returns {Level}
 */
function initLevel2() {
    const level = new Level(
        createEnemiesL2(),
        createCloudsL2(),
        createBackgroundObjectsL2(),
        createCoinsL2(),
        createBottlesL2()
    );
    level.level_end_x = 4200;
    return level;
}
