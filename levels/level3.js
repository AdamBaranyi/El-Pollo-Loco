/**
 * Builds and returns the background tile objects for level 3.
 * @returns {BackgroundObject[]}
 */
function createBackgroundObjectsL3() {
    const objs = [];
    for (let i = -1; i <= 9; i++) {
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
    const cfg = { speedMultiplier: 1.5, hitStrength: 15 };
    const cfgS = { speedMultiplier: 1.5, hitStrength: 12 };
    const endboss = new Endboss({
        hitStrength: 30,
        chargeInterval: 1500,
        chargeMultiplier: 2.2,
        phaseSpeed: [2.5, 4.0, 6.5]
    });
    endboss.x = 5500;
    return [
        new Chicken(700, cfg),    new SmallChicken(900, cfgS),
        new Chicken(1100, cfg),   new SmallChicken(1300, cfgS),
        new Chicken(1600, cfg),   new SmallChicken(1800, cfgS),
        new Chicken(2100, cfg),   new SmallChicken(2300, cfgS),
        new Chicken(2600, cfg),   new SmallChicken(2800, cfgS),
        new Chicken(3100, cfg),   new SmallChicken(3300, cfgS),
        new Chicken(3600, cfg),   new SmallChicken(3800, cfgS),
        new Chicken(4100, cfg),   new SmallChicken(4300, cfgS),
        new Chicken(4600, cfg),   new SmallChicken(4800, cfgS),
        new Chicken(5000, cfg),
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
        new SalsaBottle(300),  new SalsaBottle(700),
        new SalsaBottle(1100), new SalsaBottle(1600),
        new SalsaBottle(2000), new SalsaBottle(2500),
        new SalsaBottle(3000), new SalsaBottle(3500),
        new SalsaBottle(4000), new SalsaBottle(4500),
        new SalsaBottle(4900), new SalsaBottle(5100),
        new SalsaBottle(5300)
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
    level.level_end_x = 6500;
    return level;
}
