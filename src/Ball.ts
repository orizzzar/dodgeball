class Ball {
    private ballRadius: number;
    private ballPositionX: number;
    private ballPositionY: number;
    private ballSpeedX: number;
    private ballSpeedY: number;

    public constructor(canvas: HTMLCanvasElement) {
        this.ballRadius = Game.MIN_BALL_RADIUS + Game.BALL_RADIUS_SCATTER * Math.random();
        this.ballSpeedX = -Game.MIN_BALL_X_SPEED + Game.BALL_X_SPEED_SCATTER * Math.random();
        this.ballSpeedY = Game.MIN_BALL_Y_SPEED;
        this.ballPositionX = this.ballRadius +  
            (canvas.width - 2 * this.ballRadius)*Math.random();
        this.ballPositionY = canvas.height * (1-Game.BALL_Y_POSITION_AREA) 
            + canvas.height * Game.BALL_Y_POSITION_AREA * Math.random();
    }

    public applyPhysics(elapsed: number) {
        // Calculate the new position of the ball
        // Some physics here: the y-portion of the speed changes due to gravity
        // Formula: Vt = V0 + gt
        // 9.8 is the gravitational constant and time=1
        this.ballSpeedY -= Game.GRAVITY * elapsed;
        // Calculate new X and Y parts of the position 
        // Formula: S = v*t
        this.ballPositionX += this.ballSpeedX * elapsed;
        // Formula: S=v0*t + 0.5*g*t^2
        this.ballPositionY += this.ballSpeedY * elapsed + 0.5 * Game.GRAVITY * elapsed * elapsed;
    }

    public bounceFromCanvasWalls(canvas: HTMLCanvasElement) {
        // Collision detection: check if the ball hits the walls and let it bounce
        // Left wall
        this.ballPositionX >= canvas.width - this.ballRadius;
        if (this.ballPositionX <= this.ballRadius && this.ballSpeedX < 0) {
            this.ballSpeedX = -this.ballSpeedX;
        }
        // Right wall
        if (this.ballPositionX >= canvas.width - this.ballRadius
            && this.ballSpeedX > 0) {
            this.ballSpeedX = -this.ballSpeedX;
        }

        // Bottom only (ball will always come down)
        if (this.ballPositionY <= this.ballRadius && this.ballSpeedY < 0) {
            this.ballSpeedY = -this.ballSpeedY;
        }
    }

    public overlapsWith(x: number, y:number, r: number) {
        //  if the ball collides with the player. It's game over then
        const distX = x - this.ballPositionX;
        const distY = y - this.ballPositionY;
        // Calculate the distance between ball and player using Pythagoras'
        // theorem
        const distance = Math.sqrt(distX * distX + distY * distY);
        // Collides is distance <= sum of radii of both circles
        return distance <= (this.ballRadius + r);
    }

    public render(ctx: CanvasRenderingContext2D) {
        // Render the ball
        ctx.fillStyle = Game.BALL_COLOR;
        ctx.beginPath();
        // reverse height, so the ball falls down
        ctx.ellipse(this.ballPositionX, this.ballPositionY, this.ballRadius,
            this.ballRadius, 0, 0, Game.FULL_CIRCLE);
        ctx.fill();
    }
}