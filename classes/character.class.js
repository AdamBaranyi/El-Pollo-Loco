/**
 * Represents the main player character (Pepe).
 */
class Character extends MovableObject {
    x = 120;
    y = 110;
    height = 320;
    width = 120;
    speed = 3;
    groundY = 110;
    lastMoveTime = Date.now();
    lastSnoreTime = 0;
    currentDeadFrame = 0;
    world;
    offset = { top: 130, bottom: 15, left: 30, right: 30 };

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Creates the player character and loads all animations.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImage(this.IMAGES_IDLE[0]);
        this.applyGravity();
        this.animate();
    }

    /**
     * Starts the character's movement and animation loops.
     * Ground/hurt animations run at 80ms for responsiveness.
     * Jump animation is velocity-based (playJumpAnimation handles frame selection).
     */
    animate() {
        const id1 = setInterval(() => this.handleMovement(), 1000 / 60);
        const id2 = setInterval(() => this.handleAnimation(), 80);
        storeInterval(id1);
        storeInterval(id2);
    }

    /**
     * Processes keyboard input and updates character position.
     * Does nothing if the character is dead (immobile after death).
     */
    handleMovement() {
        if (this.isDead()) return;
        if (this.world.paused) return;
        this.handleWalk();
        this.handleJump();
        this.world.updateCamera();
    }

    /**
     * Moves the character left or right based on keyboard state.
     */
    handleWalk() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.lastMoveTime = Date.now();
        }
        if (this.world.keyboard.LEFT && this.x > -200) {
            this.moveLeft();
            this.lastMoveTime = Date.now();
        }
    }

    /**
     * Makes the character jump if on the ground and the jump key is pressed.
     */
    handleJump() {
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
            this.lastMoveTime = Date.now();
            soundManager.jump();
        }
    }

    /**
     * Overrides jump to reset the animation frame.
     * Prevents the jump animation from starting in the middle and twitching.
     */
    jump() {
        super.jump();
        this.currentImage = 0;
    }

    /**
     * Selects the correct animation frame based on current character state.
     */
    handleAnimation() {
        if (this.world && this.world.paused) return;
        if (this.isDead()) return this.playDeadAnimation();
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        if (this.isAboveGround()) return this.playJumpAnimation();
        this.playGroundAnimation();
    }

    /**
     * Plays the jump animation based on vertical direction.
     * Guaranteed to keep hands up only while ascending, and hands down while falling.
     */
    playJumpAnimation() {
        if (this.speedY > 0) {
            // Ascending: play the first half of the jump (hands going up)
            this.playAnimation(this.IMAGES_JUMPING.slice(1, 5));
        } else {
            // Descending: lock to the final jump frame (hands down) 
            // so his hands are never in the air while falling.
            this.img = this.imageCache[this.IMAGES_JUMPING[8]];
        }
    }

    /**
     * Plays walk, idle, or long-idle animation depending on activity.
     */
    playGroundAnimation() {
        const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
        if (isMoving) return this.playAnimation(this.IMAGES_WALKING);
        const isLongIdle = Date.now() - this.lastMoveTime > 5000;
        if (isLongIdle) { this.playSnore(); return this.playAnimation(this.IMAGES_LONG_IDLE); }
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Plays a snore sound every 3 seconds during sleep animation.
     */
    playSnore() {
        if (Date.now() - this.lastSnoreTime < 3000) return;
        this.lastSnoreTime = Date.now();
        soundManager.snore();
    }

    /**
     * Advances the death animation one frame at a time (no looping).
     */
    playDeadAnimation() {
        const maxFrame = this.IMAGES_DEAD.length - 1;
        const frame = Math.min(this.currentDeadFrame, maxFrame);
        this.img = this.imageCache[this.IMAGES_DEAD[frame]];
        if (this.currentDeadFrame < maxFrame) this.currentDeadFrame++;
    }
}
