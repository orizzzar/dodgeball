/**
 * Responsible for maintaining the game scene logic.
 */
class Scene {

    public static readonly INITIAL_BALL_COUNT = 6;

    public static readonly PLAYER_STEP = 5;

    private canvas: HTMLCanvasElement;

    private keyboard: KeyListener;

    private balls: Ball[];

    private player: Player;

    private level: number;
    private score: number;

    /**
     * Construct a new Scene.
     * 
     * @param canvas the `HTMLCanvasElement` to render to
     */
    public constructor(canvas: HTMLElement, level: number, score: number=0) {
        this.canvas = <HTMLCanvasElement>canvas;

        this.keyboard = new KeyListener();
        
        // Resize the canvas to full window size
        this.canvas.width = window.innerWidth - 1;
        this.canvas.height = window.innerHeight - 4; 
        
        // Transform the rendering context so that (0,0) is the lower left 
        // corner.
        const ctx = this.canvas.getContext('2d');
        ctx.transform(1, 0, 0, -1, 0, this.canvas.height);

        this.score = score;
        this.level = level;

        // Spawn the Balls
        this.balls = [];
        for(let i=0; i<level; i++) {
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
            Game.MIN_BALL_Y_SPEED + Game.BALL_Y_SPEED_SCATTER * Math.random(),
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

        for (let i=0; i<this.balls.length; i++) {
            for (let j=i; j<this.balls.length; j++) {
                this.processBallBallCollision(this.balls[i], this.balls[j]);
            }
        }

        // const currentBallCount = this.balls.length;
        // this.balls = this.balls.filter((ball) => !this.player.isCaught(ball))
        // const newBallCount = this.balls.length;
        // this.score+=(currentBallCount - newBallCount);

        // return this.balls.reduce((prev, ball) => 
        //     prev || 
        //     this.player.isHit(ball)
        //   , false);
        return false;
    }
    
    processBallBallCollision(b0: Ball, b1: Ball) {
        if (b0.overlapsWith(b1)) {
            b0.processCollisionWith(b1);
        }
    }
;

    public isWin(): boolean {
        return this.balls.length == 0;
    }

    public getScore(): number {
        return this.score;
    }

    public getLevel(): number {
        return this.level;
    }

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

        ctx.save();
        ctx.fillStyle = "black";
        ctx.resetTransform();
        ctx.font = '20px serif';
        ctx.fillText(`Score: ${this.score}`, 0, 20);
        ctx.restore();

        // Render the player
        this.player.render(ctx);
        
        this.balls.forEach((ball) => ball.render(ctx));
    }

}