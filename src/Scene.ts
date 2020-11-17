/**
 * Responsible for maintaining the game scene logic.
 */
class Scene {

    public static readonly INITIAL_BALL_COUNT = 2;

    private canvas: HTMLCanvasElement;

    private balls: Ball[];

    private playerPositionX: number;

    /**
     * Construct a new Scene.
     * 
     * @param canvas the `HTMLCanvasElement` to render to
     */
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
        // Spawn the Balls
        this.balls = [];
        for(let i=0; i<Scene.INITIAL_BALL_COUNT; i++) {
            this.balls.push(new Ball(this.canvas));
        }
        
        // Set the player at the center
        this.playerPositionX = this.canvas.width / 2;
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

        return this.balls.reduce((prev, ball) => 
            prev || 
            ball.overlapsWith(this.playerPositionX, 
                Game.PLAYER_BALL_RADIUS, Game.PLAYER_BALL_RADIUS)
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
        ctx.fillStyle = Game.PLAYER_COLOR;
        ctx.beginPath();
        ctx.ellipse(this.playerPositionX, Game.PLAYER_BALL_RADIUS, 
            Game.PLAYER_BALL_RADIUS, Game.PLAYER_BALL_RADIUS, 0, 0, Game.FULL_CIRCLE);
        ctx.fill();
        
        this.balls.forEach((ball) => ball.render(ctx));
    }


}