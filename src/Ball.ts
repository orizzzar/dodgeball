/**
 * Class representing a moving ball in the game
 */
class Ball {

    // TODO: encapsulate
    private radius: number;
    private positionX: number;
    private positionY: number;
    private speedX: number;
    private speedY: number;


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

    overlapsWithCircle(centerX: number, centerY: number, radius: number) {
        // Check if the ball collides with the player. It's game over then
        const distX = centerX - this.positionX;
        const distY = centerY - this.positionY;
        // Calculate the distance between ball and player using Pythagoras'
        // theorem
        const distance = Math.sqrt(distX * distX + distY * distY);
        // Collides is distance <= sum of radii of both circles
        return distance <= (this.radius + radius);
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