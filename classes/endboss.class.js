/**
 * Represents the end boss enemy (giant chicken).
 * Accepts an optional config object to adjust difficulty per level.
 */
class Endboss extends MovableObject {
    x = 2400;
    y = 55;
    width = 250;
    isEndboss = true;
    height = 400;
    energy = 100;
    canBeStopped = false;
    firstContact = false;
    isAlerting = false;
    isCharging = false;
    phase = 1;
    speed = 0.4;
    otherDirection = false;
    offset = { top: 60, bottom: 20, left: 30, right: 30 };

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates the endboss with optional difficulty config.
     * @param {Object} [config={}] - Optional overrides for difficulty.
     * @param {number} [config.hitStrength=20] - Damage dealt to character per hit.
     * @param {number} [config.chargeInterval=3000] - Ms between charge attacks.
     * @param {number} [config.chargeMultiplier=1.8] - Speed multiplier during a charge.
     * @param {number[]} [config.phaseSpeed=[1.5,2.5,4.0]] - Base speed per phase.
     */
    constructor(config = {}) {
        super();
        this.hitStrength = config.hitStrength || 20;
        this.chargeInterval = config.chargeInterval || 3000;
        this.chargeMultiplier = config.chargeMultiplier || 1.8;
        this.phaseSpeed = config.phaseSpeed || [1.5, 2.5, 4.0];
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImage(this.IMAGES_WALKING[0]);
        this.animate();
    }

    /**
     * Starts the endboss animation loop at 150ms intervals.
     */
    animate() {
        const id = setInterval(() => this.handleAnimation(), 150);
        storeInterval(id);
    }

    /**
     * Selects the correct animation based on current state.
     */
    handleAnimation() {
        if (this.isDead()) return this.playAnimation(this.IMAGES_DEAD);
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        if (this.isAlerting) return this.playAnimation(this.IMAGES_ALERT);
        if (!this.firstContact) return this.playAnimation(this.IMAGES_WALKING);
        this.playAnimation(this.IMAGES_ATTACK);
    }

    /**
     * Triggers first contact: plays alert animation for 2s, then starts attacking.
     */
    triggerFirstContact() {
        this.firstContact = true;
        this.isAlerting = true;
        setTimeout(() => {
            this.isAlerting = false;
            this.startChargeLoop();
        }, 2000);
    }

    /**
     * Starts the periodic charge attack loop using the configured interval.
     */
    startChargeLoop() {
        const id = setInterval(() => {
            if (this.isDead()) { clearInterval(id); return; }
            this.triggerCharge();
        }, this.chargeInterval);
        storeInterval(id);
    }

    /**
     * Triggers a short charge attack for 700ms.
     */
    triggerCharge() {
        this.isCharging = true;
        setTimeout(() => { this.isCharging = false; }, 700);
    }

    /**
     * Updates the boss phase based on remaining energy.
     * Phase 1: >60%, Phase 2: 30–60%, Phase 3: <30%
     */
    updatePhase() {
        if (this.energy > 60) this.phase = 1;
        else if (this.energy > 30) this.phase = 2;
        else this.phase = 3;
    }

    /**
     * Returns the base movement speed for the current phase.
     * @returns {number}
     */
    getBaseSpeed() {
        return this.phaseSpeed[this.phase - 1];
    }

    /**
     * Moves the endboss toward the character with phase speed and charge multiplier.
     * @param {number} characterX - The character's current x position.
     */
    moveTowardCharacter(characterX) {
        if (!this.firstContact || this.isDead() || this.isAlerting) return;
        if (this.isHurt()) { this.knockback(); return; }
        this.updatePhase();
        this.speed = this.isCharging ? this.getBaseSpeed() * this.chargeMultiplier : this.getBaseSpeed();
        this.moveInDirection(characterX);
    }

    /**
     * Knocks the endboss back slightly when hurt.
     */
    knockback() {
        this.x += this.otherDirection ? -3 : 3;
    }

    /**
     * Moves the endboss left or right toward the character.
     * @param {number} characterX - The character's current x position.
     */
    moveInDirection(characterX) {
        if (characterX < this.x) {
            this.x -= this.speed;
            this.otherDirection = false;
        } else {
            this.x += this.speed;
            this.otherDirection = true;
        }
    }
}
