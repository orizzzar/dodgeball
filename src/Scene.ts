/**
 * Responsible for maintaining the game scene logic.
 */
class Scene {

    public static readonly INITIAL_BALL_COUNT = 2;

    public static readonly PLAYER_STEP = 5;

    private canvas: HTMLCanvasElement;

    private keyboard: KeyListener;

    private balls: Ball[];

    private player: Player;

    /**
     * Construct a new Scene.
     * 
     * @param canvas the `HTMLCanvasElement` to render to
     */
    public constructor(canvas: HTMLElement) {
        this.canvas = <HTMLCanvasElement>canvas;

        this.keyboard = new KeyListener();
        
        // Resize the canvas to full window size
        this.canvas.width = window.innerWidth - 1;
        this.canvas.height = window.innerHeight - 4; 
        
        // Transform the rendering context so that (0,0) is the lower left 
        // corner.
        const ctx = this.canvas.getContext('2d');
        ctx.transform(1, 0, 0, -1, 0, this.canvas.height);

        // Spawn a Ball
        // Spawn the Balls
        this.balls = [];
        for(let i=0; i<Scene.INITIAL_BALL_COUNT; i++) {
            this.balls.push(this.createBall());
        }
        
        // Set the player at the center
        this.player = new Player(this.canvas.width / 2);
    }

    private createBall(): Ball {
        const radius = Game.MIN_BALL_RADIUS + Game.BALL_RADIUS_SCATTER * Math.random();
        return new Ball(
            radius,
            radius + (this.canvas.width - 2 * radius)*Math.random(),
            this.canvas.height * (1-Game.BALL_Y_POSITION_AREA) 
            + this.canvas.height * Game.BALL_Y_POSITION_AREA * Math.random(),
            -Game.MIN_BALL_X_SPEED + Game.BALL_X_SPEED_SCATTER * Math.random(),
            Game.MIN_BALL_Y_SPEED,
            Game.BALL_COLOR
        );
    }

    /**
     * Handle any user input that has happened since the last call. 
     */
    public processInput() {
        if (this.keyboard.isKeyDown(KeyListener.KEY_RIGHT)) {
            this.player.moveRight(Scene.PLAYER_STEP, this.canvas.width);
        }
        if (this.keyboard.isKeyDown(KeyListener.KEY_LEFT)) {
            this.player.moveLeft(Scene.PLAYER_STEP, 0);
        }
    }

    /**
     * Advance the game simulation one step.
     * 
     * @param elapsed the amount of milliseconds that has passed since the last 
     * update.
     */
    public update(elapsed: number) {
        this.balls.forEach((ball) => {
            ball.applyPhysics(elapsed);
            ball.bounceFromCanvasWalls(this.canvas);
        });

        this.balls = this.balls.filter((ball) => !this.player.isCaught(ball))

        return this.balls.reduce((prev, ball) => 
            prev || 
            this.player.isHit(ball)
          , false);
      };


    /**
     * Draw the game on the HTMLCanvasElement so the player can see what 
     * happened.
     */
    public render() {
        // Render the items on the canvas
        // Get the canvas rendering context
        const ctx = this.canvas.getContext('2d');
        // Clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the player
        this.player.render(ctx);
        
        this.balls.forEach((ball) => ball.render(ctx));
    }

}