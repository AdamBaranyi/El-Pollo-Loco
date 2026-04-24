/**
 * Tracks the state of all relevant keyboard keys and binds key events.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    D = false;

    /**
     * Creates a Keyboard instance and binds keydown/keyup events.
     */
    constructor() {
        this.bindKeyEvents();
    }

    /**
     * Registers keydown and keyup listeners on the window.
     */
    bindKeyEvents() {
        window.addEventListener('keydown', e => this.handleKeyDown(e));
        window.addEventListener('keyup', e => this.handleKeyUp(e));
    }

    /**
     * Sets the corresponding key state to true on keydown.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    handleKeyDown(e) {
        if (e.keyCode === 37) this.LEFT = true;
        if (e.keyCode === 39) this.RIGHT = true;
        if (e.keyCode === 38 || e.keyCode === 32) this.UP = true;
        if (e.keyCode === 68) this.D = true;
        if (e.keyCode === 32) e.preventDefault();
        if (e.altKey && e.keyCode === 13) { e.preventDefault(); toggleFullscreen(); }
        if (e.keyCode === 27 || e.keyCode === 80) togglePause();
    }

    /**
     * Sets the corresponding key state to false on keyup.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    handleKeyUp(e) {
        if (e.keyCode === 37) this.LEFT = false;
        if (e.keyCode === 39) this.RIGHT = false;
        if (e.keyCode === 38 || e.keyCode === 32) this.UP = false;
        if (e.keyCode === 68) this.D = false;
    }
}
