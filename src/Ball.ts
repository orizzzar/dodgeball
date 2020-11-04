/**
 * Class representing a moving ball in the game
 */
class Ball {

    // TODO: encapsulate
    public radius: number;
    public positionX: number;
    public positionY: number;
    public speedX: number;
    public speedY: number;


    public constructor(radius: number, positionX: number,
        positionY: number, speedX: number, speedY: number) {
            this.radius = radius;
            this.positionX = positionX;
            this.positionY = positionY;
            this.speedX = speedX;
            this.speedY = speedY;
    }

    public applyPhysics() {
        // Some physics here: the y-portion of the speed changes due to gravity
        // Formula: Vt = V0 + gt
        // 9.8 is the gravitational constant and time=1
        this.speedY -= Game.GRAVITY;
        // Calculate new X and Y parts of the position 
        // Formula: S = v*t
        this.positionX += this.speedX;
        // Formula: S=v0*t + 0.5*g*t^2
        this.positionY += this.speedY + 0.5 * Game.GRAVITY;
    }

    public bounceToWalls(left: number, right: number, lower: number) {
        // check if the ball hits the walls and let it bounce
        // Left wall
        if (this.positionX <= this.radius && this.speedX < left) {
            this.speedX = -this.speedX;
        }
        // Right wall
        if (this.positionX >= right - this.radius
            && this.speedX > 0) {
            this.speedX = -this.speedX;
        }

        // Bottom only (ball will always come down)
        if (this.positionY <= this.radius && this.speedY < lower) {
            this.speedY = -this.speedY;
        }

    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = Game.BALL_COLOR;
        ctx.beginPath();
        // reverse height, so the ball falls down
        ctx.ellipse(this.positionX, this.positionY, this.radius, 
            this.radius, 0, 0, Game.FULL_CIRCLE);
        ctx.fill();
    }
}