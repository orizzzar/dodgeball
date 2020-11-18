/**
 * Main class of this Game.
 */
class Game {

    public static readonly GRAVITY = 0.0098;
    public static readonly FULL_CIRCLE = Math.PI * 2;

    // Constants that define the allowed ball dimensions
    public static readonly MIN_BALL_RADIUS = 25;
    public static readonly BALL_RADIUS_SCATTER = 25;
    public static readonly MIN_BALL_X_SPEED = -0.5;
    public static readonly BALL_X_SPEED_SCATTER = 1;
    public static readonly MIN_BALL_Y_SPEED = 0;
    public static readonly BALL_Y_POSITION_AREA = 0.2;
    public static readonly BALL_COLOR = 'blue';

    // Constants for the player
    public static readonly PLAYER_BALL_RADIUS = 50;
    public static readonly PLAYER_HAND_RADIUS = 50;
    public static readonly PLAYER_COLOR = 'red';
    public static readonly PLAYER_HAND_COLOR = 'green';

    private previous: number;

    /**
     * The amount of ms that the game's "now" is behind the player's.
     */
    private lag: number;

    /**
     * The size of the fixed time steps that the game's "now" will be updated.
     */
    protected readonly ms_per_update: number = 1;

    private canvas: HTMLElement;
    
    private scene: Scene;

    /**
     * Construct a new Game.
     * 
     * @param canvas the HTMLCanvasElement to render to
     */
    public constructor(canvas: HTMLElement) {
        this.canvas = canvas;
        this.scene = new Scene(canvas, Scene.INITIAL_BALL_COUNT);

        // Start the animation
        console.log('start animation');
        this.previous = performance.now();
        this.lag = 0;
        requestAnimationFrame(this.step);
    }

    /**
     * This MUST be an arrow method in order to keep the `this` variable 
     * working correctly. It will be overwritten by another object otherwise
     * caused by javascript scoping behaviour.
     */
    step = (timestamp: number) => {
        // Timedifference (t) in ms between previous and now
        const elapsed = timestamp - this.previous;
        this.previous = timestamp;
        this.lag += elapsed;
        let gameover = false;
        
        this.scene.processInput();
        while (!gameover && this.lag >= this.ms_per_update)
        {
            // Let the game's "now" catch up with the real now
            gameover = this.scene.update(this.ms_per_update);
            this.lag -= this.ms_per_update;
        }
        this.scene.render();

        if (this.scene.isWin()) {
            this.scene = new Scene(
                this.canvas, 
                this.scene.getLevel()+1, 
                this.scene.getScore()
            );
        }

        
        // Call this method again on the next animation frame
        // A quick-and-dirty game over situation: just stop animating :/
        // The user must hit F5 to reload the game
        if (!gameover) {
            requestAnimationFrame(this.step);
        }
    }


}