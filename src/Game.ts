/**
 * Main class of this Game.
 */
class Game {

    // Constants for removing the scroll bars in the browser
    public static readonly WINDOW_WIDTH_OFFSET = 1;
    public static readonly WINDOW_HEIGHT_OFFSET = 4;

    // Generic math and physics constants
    public static readonly GRAVITY = 0.98;
    public static readonly FULL_CIRCLE = 2 * Math.PI;

    // Constants that define the allowed ball dimensions
    public static readonly MIN_BALL_RADIUS = 25;
    public static readonly BALL_RADIUS_SCATTER = 25;
    public static readonly MIN_BALL_X_SPEED = -50;
    public static readonly BALL_X_SPEED_SCATTER = 100;
    public static readonly MIN_BALL_Y_SPEED = 0;
    public static readonly BALL_Y_SPEED_SCATTER = 0;
    public static readonly BALL_Y_POSITION_AREA = 0.2;
    public static readonly BALL_COLOR = 'blue';

    public static readonly INITIAL_BALL_COUNT = 2;

    // Constants for the player
    public static readonly PLAYER_BALL_RADIUS = 50;
    public static readonly PLAYER_COLOR = 'red';

    private canvas: HTMLCanvasElement;

    private balls: Ball[];

    private player: Ball;

    /**
     * Constructor that defines how to construct a new object of this class.
     * 
     * @param canvas 
     */
    public constructor(canvas: HTMLElement) {
        this.canvas = <HTMLCanvasElement>canvas;
        
        // Resize the canvas to full window size minus some small offset
        this.canvas.width = window.innerWidth - Game.WINDOW_WIDTH_OFFSET;
        this.canvas.height = window.innerHeight - Game.WINDOW_HEIGHT_OFFSET; 
        
        // Transform the rendering context so that (0,0) is the lower left 
        // corner.
        const ctx = this.canvas.getContext('2d');
        ctx.transform(1, 0, 0, -1, 0, this.canvas.height);

        // Spawn the Balls
        this.balls = [];
        for(let i=0; i<Game.INITIAL_BALL_COUNT; i++) {
            this.balls.push(this.spawnBall());
        }

        // Spawn the player
        this.player = new Ball(Game.PLAYER_BALL_RADIUS, this.canvas.width / 2,
            Game.PLAYER_BALL_RADIUS, 0, 0, Game.PLAYER_COLOR);

        // Start the animation
        console.log('start animation');
        requestAnimationFrame(this.animate);
    }


    /**
     * Helper method that creates a random Ball.
     */
    private spawnBall(): Ball {
        const radius = Game.MIN_BALL_RADIUS + Game.BALL_RADIUS_SCATTER * Math.random();
        return new Ball(
            radius,
            radius + (this.canvas.width - 2 * radius)*Math.random(),
            this.canvas.height * (1 - Game.BALL_Y_POSITION_AREA) + 
                this.canvas.height * Game.BALL_Y_POSITION_AREA * Math.random(),
            Game.MIN_BALL_X_SPEED + Game.BALL_X_SPEED_SCATTER * Math.random(),
            Game.MIN_BALL_Y_SPEED + Game.BALL_Y_SPEED_SCATTER * Math.random(),
            Game.BALL_COLOR
        );
    }

    /**
     * This MUST be an arrow method in order to keep the `this` variable 
     * working correctly. It will be overwritten by another object otherwise
     * caused by javascript scoping behaviour.
     */
    animate = () => {
        this.move();
        this.collide();
        const gameover = this.adjust();
        this.draw();

        // Call this method again on the next animation frame
        // A quick-and-dirty game over situation: just stop animating :/
        // The user must hit F5 to reload the game
        if (!gameover) {
            requestAnimationFrame(this.animate);
        }
    }

    /**
     * Move the items over the scene
     */
    private move() {
        // calculate the new position of the ball
        this.balls.forEach((ball) => ball.applyPhysics());
    }

    /**
     * Check if gameitems are colliding, and handle them.
     */
    private collide() {
        this.balls.forEach((ball) => 
            ball.bounceToWalls(0, this.canvas.width, 0));
    }

    /**
     * Adjust the game state if needed
     */
    private adjust() {
        return this.balls.reduce((prev, ball) => 
          prev || this.player.overlapsWithBall(ball)
        , false);
    }

    /**
     * Draw the scene on the screen.
     */
    private draw() {
        // Get the canvas rendering context
        const ctx = this.canvas.getContext('2d');
        // Clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the player
        this.player.draw(ctx);

        // Draw the ball
        this.balls.forEach((ball) => ball.draw(ctx));
    }
}