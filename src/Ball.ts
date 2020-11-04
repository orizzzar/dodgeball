/**
 * Class representing a moving ball in the game
 */
class Ball {

    private radius: number;

    private positionX: number;

    private positionY: number;

    private speedX: number;

    private speedY: number;

    private color: string;


    /**
     * Constructor that defines how to construct a new object of this class.
     * 
     * @param radius 
     * @param positionX 
     * @param positionY 
     * @param speedX 
     * @param speedY 
     * @param color 
     */
    public constructor(radius: number, positionX: number,
        positionY: number, speedX: number, speedY: number, color:string) {
            this.radius = radius;
            this.positionX = positionX;
            this.positionY = positionY;
            this.speedX = speedX;
            this.speedY = speedY;
            this.color = color;
    }

    /**
     * Apply the laws of physics to the movement of the ball. the y-portion of 
     * the speed changes due to gravity.
     * Formula for vertical speed: Vt = V0 + gt
     * Formula for horizontal displacement: S = v*t
     * Formula for vertical displacement: S=v0*t + 0.5*g*t^2
     * Game.GRAVITY defines the gravitational constant (g) and time (t) is 
     * assumed 1
     */
    public applyPhysics() {
        this.speedY -= Game.GRAVITY;
        // Calculate new X and Y parts of the position 
        this.positionX += this.speedX;
        this.positionY += this.speedY + 0.5 * Game.GRAVITY;
    }

    /**
     * Check if the ball hits the walls and let it bounce.
     * 
     * @param left 
     * @param right 
     * @param lower 
     */
    public bounceToWalls(left: number, right: number, lower: number) {
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

    /**
     * Check of this Ball overlaps (collides) with another Ball.
     * 
     * @param ball 
     */
    public overlapsWithBall(ball: Ball) {
        const distX = ball.positionX - this.positionX;
        const distY = ball.positionY - this.positionY;
        // Calculate the distance between ball and player using Pythagoras'
        // theorem
        const distance = Math.sqrt(distX * distX + distY * distY);
        // Collides is distance <= sum of radii of both circles
        return distance <= (this.radius + ball.radius);
    }

    /**
     * Draw this Ball to the specified context.
     * 
     * @param ctx 
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.positionX, this.positionY, this.radius, 
            this.radius, 0, 0, Game.FULL_CIRCLE);
        ctx.fill();
    }
}