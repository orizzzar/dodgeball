/**
 * Main class of this Game.
 */
class Game {

    private canvas: HTMLCanvasElement;

    private ballRadius: number;
    private ballPositionX: number;
    private ballPositionY: number;
    private ballSpeedX: number;
    private ballSpeedY: number;

    private playerPositionX: number;

    private previous: number;

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
        this.ballRadius = 25 + 25 * Math.random();
        this.ballSpeedX = -5 + 10 * Math.random();
        this.ballSpeedY = 0;
        this.ballPositionX = this.ballRadius +  
            (this.canvas.width - 2 * this.ballRadius)*Math.random();
        this.ballPositionY = this.canvas.height * 0.8 + this.canvas.height * 0.2 * Math.random();
        
        // Set the player at the center
        this.playerPositionX = this.canvas.width / 2;

        // Start the animation
        console.log('start animation');
        this.previous = performance.now();
        requestAnimationFrame(this.step);
    }

    /**
     * This MUST be an arrow method in order to keep the `this` variable 
     * working correctly. It will be overwritten by another object otherwise
     * caused by javascript scoping behaviour.
     */
    step = (timestamp: number) => {
        // Timedifference (t) in ms between previous and now
        const elapsed = timestamp - this.previous;
        this.previous = timestamp;

        // Calculate the new position of the ball
        // Some physics here: the y-portion of the speed changes due to gravity
        // Formula: Vt = V0 + gt
        // 9.8 is the gravitational constant and time=1
        this.ballSpeedY -= 0.0098 * elapsed; 
        // Calculate new X and Y parts of the position 
        // Formula: S = v*t
        this.ballPositionX += this.ballSpeedX * elapsed;
        // Formula: S=v0*t + 0.5*g*t^2
        this.ballPositionY += this.ballSpeedY * elapsed + 0.5 * 0.0098 * elapsed * elapsed;

        // Collision detection: check if the ball hits the walls and let it bounce
        // Left wall
            this.ballPositionX >= this.canvas.width-this.ballRadius;
        if(this.ballPositionX <= this.ballRadius && this.ballSpeedX<0) {
            this.ballSpeedX = -this.ballSpeedX;
        }
        // Right wall
        if(this.ballPositionX >= this.canvas.width-this.ballRadius 
            && this.ballSpeedX>0) {
            this.ballSpeedX = -this.ballSpeedX;
        }

        // Bottom only (ball will always come down)
        if(this.ballPositionY <= this.ballRadius && this.ballSpeedY < 0) {
            this.ballSpeedY = -this.ballSpeedY;
        }

        //  if the ball collides with the player. It's game over then
        const distX = this.playerPositionX - this.ballPositionX;
        const distY = 50 - this.ballPositionY;
        // Calculate the distance between ball and player using Pythagoras'
        // theorem
        const distance = Math.sqrt(distX*distX + distY*distY);
        // Collides is distance <= sum of radii of both circles
        const gameover = distance <= (this.ballRadius + 50);

        // Render the items on the canvas
        // Get the canvas rendering context
        const ctx = this.canvas.getContext('2d');
        // Clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the player
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.ellipse(this.playerPositionX, 50, 50, 50, 0, 0, 2*Math.PI);
        ctx.fill();

        // Render the ball
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        // reverse height, so the ball falls down
        ctx.ellipse(this.ballPositionX, this.ballPositionY, this.ballRadius, 
            this.ballRadius, 0, 0, 2*Math.PI);
        ctx.fill();

        // Call this method again on the next animation frame
        // A quick-and-dirty game over situation: just stop animating :/
        // The user must hit F5 to reload the game
        if (!gameover) {
            requestAnimationFrame(this.step);
        }
    }

}