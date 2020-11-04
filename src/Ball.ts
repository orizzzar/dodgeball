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

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = Game.BALL_COLOR;
        ctx.beginPath();
        // reverse height, so the ball falls down
        ctx.ellipse(this.positionX, this.positionY, this.radius, 
            this.radius, 0, 0, Game.FULL_CIRCLE);
        ctx.fill();
    }
}