/**
 * Represents a single Ball in the game.
 */
class Ball {

    private color: string;
    private radius: number;

    private position: Vector;

    private speed: Vector;

    // private positionX: number;
    // private positionY: number;
    // private speedX: number;
    // private speedY: number;

    /**
     * Construct a new `Ball`.
     * 
     * @param canvas The `canvas` that knows the size of the scene
     */
    public constructor(radius: number, positionX: number, positionY: number, 
        speedX: number, speedY: number, color: string) {
            this.radius = radius;
            this.position = new Vector(positionX, positionY);
            this.speed = new Vector(speedX, speedY);
            this.color = color;
    }

    /**
     * Apply the laws of physics to simulate a falling ball under gravity.
     * 
     * @param elapsed amount of milliseconds that passed since the last 
     * update.
     */
    public applyPhysics(elapsed: number) {
        // Calculate the new position of the ball
        // Some physics here:
        // Calculate new X and Y parts of the position 
        // Formula for X: S = v*t
        // Formula for Y: S=v0*t + 0.5*g*t^2
        this.position = this.position.add(new Vector(
            this.speed.x * elapsed,
            this.speed.y * elapsed + 0.5 * Game.GRAVITY * elapsed * elapsed
        ));
        // The y-portion of the speed changes due to gravity
        // Formula: Vt = V0 + gt
        // 9.8 is the gravitational constant and time=1
        this.speed = this.speed.subtract(new Vector(0, Game.GRAVITY * elapsed));
    }

    /**
     * Check whether the ball is currently hitting one of the canvas boundaries
     * and let it bounce back.
     *  
     * @param canvas The canvas that knows the size of the scene
     */
    public bounceFromCanvasWalls(canvas: HTMLCanvasElement) {
        // Collision detection: check if the ball hits the walls and let it bounce
        // Left wall
        this.position.x >= canvas.width - this.radius;
        if (this.position.x <= this.radius && this.speed.x < 0) {
            this.speed = this.speed.mirror_Y();
        }
        // Right wall
        if (this.position.x >= canvas.width - this.radius
            && this.speed.x > 0) {
                this.speed = this.speed.mirror_Y();
        }

        // Bottom only (ball will always come down)
        if (this.position.y <= this.radius && this.speed.y < 0) {
            this.speed = this.speed.mirror_X();
        }
    }

    /**
     * Checks whether the ball currently overlaps with another ball with the
     * specified dimensions.
     * 
     * @param x the x-position of the other ball
     * @param y the y-position of the other ball
     * @param r the radius of the other ball
     */
    public overlapsWith(other: Ball) {
        //  if the ball collides with the player. It's game over then
        // Calculate the distance between ball and player using Pythagoras'
        // theorem
        const distance = other.position.subtract(this.position).length;
        // Collides is distance <= sum of radii of both circles
        return distance <= (other.radius + this.radius);
    }

    /**
     * Let the ball draw itself on the specified context.
     * 
     * @param ctx the `CanvasRenderingContext2D` to render to
     */
    public render(ctx: CanvasRenderingContext2D) {
        // Render the ball
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // reverse height, so the ball falls down
        ctx.ellipse(this.position.x, this.position.y, this.radius,
            this.radius, 0, 0, Game.FULL_CIRCLE);
        ctx.fill();
    }

    /**
     * Move the ball to the left until it reaches its limit
     * 
     * @param step amount of pixels to move in this direction
     * @param min the left limit of the ball position.
     */
    public moveLeft(step: number, min: number) {
        this.position = this.position.subtract(new Vector(step, 0));
        const limit = this.radius;
        if (this.position.x < limit) {
            this.position = new Vector(limit, this.position.y);
        }
    }

    /**
     * Move the ball to the right until it reaches its limit
     * 
     * @param step amount of pixels to move in this direction
     * @param min the right limit of the ball position.
     */
    public moveRight(step: number, max: number) {
        this.position = this.position.add(new Vector(step, 0));
        const limit = max - this.radius;
        if (this.position.x > limit) {
            this.position = new Vector(limit, this.position.y);
        }
    }

}