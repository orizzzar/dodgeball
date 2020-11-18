class Player {
    private leftHand: Ball;
    private body: Ball;
    private rightHand: Ball;

    /**
     * Construct a new `Player`.
     * 
     * @param canvas The `canvas` that knows the size of the scene
     */
    public constructor(x: number) {
        this.body = new Ball(
            Game.PLAYER_BALL_RADIUS,
            x, Game.PLAYER_BALL_RADIUS,
            0,0,
            Game.PLAYER_COLOR
        );
        this.leftHand = new Ball(
            Game.PLAYER_HAND_RADIUS, 
            x-Game.PLAYER_BALL_RADIUS-Game.PLAYER_HAND_RADIUS, Game.PLAYER_BALL_RADIUS,
            0,0,
            Game.PLAYER_HAND_COLOR
        );
        this.rightHand = new Ball(
            Game.PLAYER_HAND_RADIUS, 
            x+Game.PLAYER_BALL_RADIUS+Game.PLAYER_HAND_RADIUS, Game.PLAYER_BALL_RADIUS,
            0,0,
            Game.PLAYER_HAND_COLOR
        );

    }


    /**
     * Move the player to the left until it reaches its limit
     * 
     * @param step amount of pixels to move in this direction
     * @param min the left limit of the player position.
     */
    moveLeft(step: number, limit: number) {
        this.leftHand.moveLeft(step, limit);
        this.body.moveLeft(step, limit + 2*Game.PLAYER_HAND_RADIUS);
        this.rightHand.moveLeft(step, limit + 2*Game.PLAYER_HAND_RADIUS + 2*Game.PLAYER_BALL_RADIUS);
    }

    /**
     * Move the ball to the right until it reaches its limit
     * 
     * @param step amount of pixels to move in this direction
     * @param min the right limit of the player position.
     */
    moveRight(step: number, limit: number) {
        this.rightHand.moveRight(step, limit);
        this.body.moveRight(step, limit - 2*Game.PLAYER_HAND_RADIUS);
        this.leftHand.moveRight(step, limit - 2*Game.PLAYER_HAND_RADIUS - 2*Game.PLAYER_BALL_RADIUS);
    }

    /**
     * Returns `true` if the specified ball overlaps with one of the hands.
     * 
     * @param ball 
     */
    isCaught(ball: Ball) {
        return this.leftHand.overlapsWith(ball) || this.rightHand.overlapsWith(ball);
    }

    /**
     * Returns `true` if the specified ball overlaps with the body.
     * 
     * @param ball 
     */
    isHit(ball: Ball) {
        return this.body.overlapsWith(ball);
    }


    /**
     * Let the player draw itself on the specified context.
     * 
     * @param ctx the `CanvasRenderingContext2D` to render to
     */
    render(ctx: CanvasRenderingContext2D) {
        this.leftHand.render(ctx);
        this.body.render(ctx);
        this.rightHand.render(ctx);
    }

}