/**
 * Main class of this Game.
 */
class Game {

    public static readonly GRAVITY = 0.0098;
    public static readonly FULL_CIRCLE = Math.PI * 2;

    // Constants that define the allowed ball dimensions
    public static readonly MIN_BALL_RADIUS = 25;
    public static readonly BALL_RADIUS_SCATTER = 25;
    public static readonly MIN_BALL_X_SPEED = -5;
    public static readonly BALL_X_SPEED_SCATTER = 10;
    public static readonly MIN_BALL_Y_SPEED = 0;
    public static readonly BALL_Y_POSITION_AREA = 0.2;
    public static readonly BALL_COLOR = 'blue';

    // Constants for the player
    public static readonly PLAYER_BALL_RADIUS = 50;
    public static readonly PLAYER_COLOR = 'red';

    private canvas: HTMLCanvasElement;

    private ball: Ball;

    private playerPositionX: number;

    private previous: number;

    public constructor(canvas: HTMLElement) {
        this.canvas = <HTMLCanvasElement>canvas;
        
        // Resize the canvas to full window size
        this.canvas.width = window.innerWidth - 1;
        this.canvas.height = window.innerHeight - 4; 
        
        // Transform the rendering context so that (0,0) is the lower left 
        // corner.
        const ctx = this.canvas.getContext('2d');
        ctx.transform(1, 0, 0, -1, 0, this.canvas.height);

        // Spawn a Ball
        this.ball = new Ball(this.canvas);
        
        // Set the player at the center
        this.playerPositionX = this.canvas.width / 2;

        // Start the animation
        console.log('start animation');
        this.previous = performance.now();
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

        const gameover = this.update(elapsed);

        this.render();

        // Call this method again on the next animation frame
        // A quick-and-dirty game over situation: just stop animating :/
        // The user must hit F5 to reload the game
        if (!gameover) {
            requestAnimationFrame(this.step);
        }
    }


    private update(elapsed: number) {
        this.ball.applyPhysics(elapsed);

        this.ball.bounceFromCanvasWalls(this.canvas);

        return this.ball.overlapsWith(this.playerPositionX, 
            Game.PLAYER_BALL_RADIUS, Game.PLAYER_BALL_RADIUS);
    }


    private render() {
        // Render the items on the canvas
        // Get the canvas rendering context
        const ctx = this.canvas.getContext('2d');
        // Clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the player
        ctx.fillStyle = Game.PLAYER_COLOR;
        ctx.beginPath();
        ctx.ellipse(this.playerPositionX, Game.PLAYER_BALL_RADIUS, 
            Game.PLAYER_BALL_RADIUS, Game.PLAYER_BALL_RADIUS, 0, 0, Game.FULL_CIRCLE);
        ctx.fill();
        
        this.ball.render(ctx);
    }

}