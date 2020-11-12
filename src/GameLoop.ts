/**
 * This class implements a game loop using the "Play catch up" method. It will 
 * update the game using a fixed time step because that makes everything simpler 
 * and more stable for physics and AI. But it will allow flexibility in when we 
 * render in order to free up some processor time.
 * 
 * It goes like this: A certain amount of real time has elapsed since the last 
 * turn of the game loop. This is how much game time we need to simulate for the 
 * game’s “now” to catch up with the player’s. We do that using a series of 
 * fixed time steps. 
 * 
 * It uses the `window.requestAnimationFrame()` method to keep the rendering 
 * interval equal to the browsers refresh rate. This is usually 60 times per 
 * second.
 * 
 * @see https://gameprogrammingpatterns.com/game-loop.html#play-catch-up
 * @author BugSlayer
 */
class GameLoop {

    /**
     * The timestamp at the start of the previous animation frame or the 
     * moment of instantiation of this object.
     */
    private previous: number;

    /**
     * The amount of ms that the game's "now" is behind the player's.
     */
    private lag: number;

    /**
     * The size of the fixed time steps that the game's "now" will be updated.
     */
    protected readonly ms_per_update: number = 1;
    
    /**
     * Reference to the requestAnimation timeout, so it can be canceled.
     */
    private ref_id: number;

    /**
     * Reference to the Game object that must be animated.
     */
    private game: Game;


    /**
     * Construct a new instance of this class.
     * 
     * @param game the game to animate
     * @param ms_per_update OPTIONAL the value of the `ms_per_update` setting.
     * The default value is set to 1
     */
    public constructor(game: Game, ms_per_update: number = 1) {
        this.game = game;
        this.ms_per_update = ms_per_update;
    }


    /**
     * Returns `true` if the interval timer is running.
     */
    public isRunning(): boolean {
        return this.ref_id!=null;
    }


    /**
     * Toggles the interval timer. If the timer is running, it will stop the 
     * timer. Otherwise it will start the timer.
     */
    public toggle() {
        if (this.isRunning()) {
            this.stop();
        } else {
            this.start();
        }
    }
    

    /**
     * Starts the animation timer if the timer is not yet running.
     */
    public start() {
        if (!this.isRunning()) {
            this.previous = performance.now();
            this.lag = 0;
            this.ref_id = requestAnimationFrame(this.step);        
        }
    }


    /**
     * Stops the animation timer if the timer is running.
     */
    public stop() {
        if (this.isRunning()) {
            cancelAnimationFrame(this.ref_id);   
            this.ref_id = null; //so this object knows the animation isn't running.    
        }
    }


    /**
     * This MUST be an arrow method in order to keep the `this` variable 
     * working correctly. It will be overwritten by another object otherwise
     * caused by javascript scoping behaviour.
     */
    step = (timestamp: number) => {
        const elapsed = timestamp - this.previous;
        this.previous = timestamp;
        this.lag += elapsed;
        let gameover = false;
        if (this.game!=null) {
            this.game.processInput(timestamp);
            while (!gameover && this.lag >= this.ms_per_update)
            {
                // Let the game's "now" catch up with the real now
                gameover = this.game.update(this.ms_per_update);
                this.lag -= this.ms_per_update;
            }
            this.game.render();
        }
        // Call this method again on the next animation frame
        // A quick-and-dirty game over situation: just stop animating :/
        // The user must hit F5 to reload the game
        if (gameover) {
            this.ref_id = null;
        } else {
            requestAnimationFrame(this.step);
        }
    }

}