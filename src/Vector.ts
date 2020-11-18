/**
 * This class represents a mathematical (Euclidian) Vector mainly used in 
 * physics and engineering to represent directed quantities. Basically it's
 * responsible for holding a x- and y-coordinate, length and angle. It can also
 * perform basic vector operations like adding, subtracting and scaling.
 * 
 * The state of a vector object is immutable. This means that it is by design
 * not allowed to change the internal state of the vector. The different 
 * computation methods that perform different computations like adding, 
 * subtracting, scaling and mirroring all return a new Vector object or just a 
 * number.
 * 
 * @see https://en.wikipedia.org/wiki/Euclidean_vector
 * @author dwaard
 */
class Vector {

    /**
     * The x-coordinate of the vector in a Cartesian Coordinate Space.
     */
    public readonly x : number;


    /**
     * The y-coordinate of the vector in a Cartesian Coordinate Space.
     */
    public readonly y : number;


    // Cached computed values, so we only need expensive calculations once.
    private _length: number = null;
    private _angle: number = null;


    /**
     * Constructs a new Vector.
     * 
     * @param x the x-coordinate of the endpoint of this vector an a Cartesian 
     * Coordinate Space.
     * @param y the y-coordinate of the endpoint of this vector an a Cartesian 
     * Coordinate Space.
     */
    public constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }


    /**
     * Factory method that constructs a vector from the given size and angle
     * 
     * @param size the length of the vector 
     * @param angle the angle of the vector (in radians)
     */
    public static fromSizeAndAngle(size: number, angle: number) : Vector {
        let x = size * Math.cos(angle);
        let y = size * Math.sin(angle);
        return new Vector(x, y);
    }


    /**
     * Returns the size or length of this Vector
     * 
     * @return the size or length of this Vector
     */
    public get length(): number
    {
        if (!this._length) {
            // Calculate only once for performance reasons
            this._length = Math.sqrt(Math.pow(this.x, 2) + 
                                   Math.pow(this.y, 2));

        }
        return this._length;
    }


    /**
     * Returns the angle between this vector and the X-axis in radians as a 
     * value between -PI/2 and PI/2 radians.
     * 
     * @return the angle between this vector and the X-axis in radians as a 
     * value between -PI/2 and PI/2 radians.
     */
    public get angle(): number
    {
        if (!this._angle) {
            // Calculate only once for performance reasons
            this._angle = Math.atan2(this.y, this.x);
        }
        return this._angle;
    }


    /**
     * Returns `true` if and only if this vector is equal to the specified
     * other vector.
     * 
     * @see https://en.wikipedia.org/wiki/Euclidean_vector#Equality
     * 
     * @param input the other vector
     */
    public isEqualTo(input: Vector) : boolean {
        return this.x == input.x && this.y == input.y;
    }


    /**
     * Returns `true` if and only if this vector is opposite to the specified
     * other vector.
     * 
     * @see https://en.wikipedia.org/wiki/Euclidean_vector#Opposite,_parallel,_and_antiparallel_vectors
     * @param input the other vector
     */
    public isOppositeTo(input: Vector) : boolean {
        return this.x == -input.x && this.y == -input.y; 
    }


    /**
     * Returns `true` if and only if this vector is parallel to the specified
     * other vector.
     * 
     * @see https://en.wikipedia.org/wiki/Euclidean_vector#Opposite,_parallel,_and_antiparallel_vectors
     * @param input the other vector
     */
    public isParallelTo(input: Vector) : boolean {
        return this.angle == input.angle; 
    }


    /**
     * Returns `true` if and only if this vector is antiparallel to the 
     * specified other vector.
     * 
     * @see https://en.wikipedia.org/wiki/Euclidean_vector#Opposite,_parallel,_and_antiparallel_vectors
     * @param input the other vector
     */
    public isAntiParallelTo(input: Vector) : boolean {
        const scaled = input.scale(-1);
        return this.angle == scaled.angle; 
    }


    /**
     * Returns a new Vector representing the sum of this Vector and the given 
     * input.
     * 
     * @see https://en.wikipedia.org/wiki/Euclidean_vector#Addition_and_subtraction
     * @param input the Vector that must be subtracted to this Vector
     */
    public add(input: Vector) : Vector
    {
        return new Vector(
            this.x + input.x,
            this.y + input.y
        );
    }


    /**
     * Returns a new Vector representing the difference between this Vector and 
     * the given input.
     * 
     * @see https://en.wikipedia.org/wiki/Euclidean_vector#Addition_and_subtraction
     * @param input the Vector that must be subtracted to this Vector
     * @return a new Vector representing the difference between this Vector and 
     * the input.
     */
    public subtract(input: Vector) : Vector
    {
        return new Vector(
            this.x - input.x,
            this.y - input.y
        );
    }

    /**
     * Returns a new Vector representing the result of the multiplication of 
     * this vector and the specified scalar.
     * 
     * @see https://en.wikipedia.org/wiki/Euclidean_vector#Scalar_multiplication
     * @param scalar the scalar that should be used in the calculation
     */
    public scale(scalar: number) : Vector
    {
        return new Vector(
            this.x * scalar,
            this.y * scalar
        );
    }

    /**
     * Returns a new Vector representing a unit vector with the same angle.
     * 
     * @see https://en.wikipedia.org/wiki/Euclidean_vector#Length
     */
    public normalize() : Vector
    {
        return Vector.fromSizeAndAngle(1, this.angle);
    }

    /**
     * Returns the dot product (sometimes called the inner product, or, since 
     * its result is a scalar, the scalar product) of this vector and the 
     * specified other vector.
     * 
     * @see https://en.wikipedia.org/wiki/Euclidean_vector#Dot_product
     * @param input the other vector
     */
    public dotProduct(input: Vector) : number {
        return this.length * input.length * Math.cos(this.angle - input.angle);
    }

    /**
     * Returns a new Vector representing the mirrored version of this vector 
     * with respect to the X-axis. This means that the
     * Y-portion of this vector will be multiplied by -1.
     */
    public mirror_X(): Vector
    {
        return new Vector(this.x, this.y * -1);
    }


    /**
     * Returns a new Vector representing the mirrored version of this vector 
     * with respect to the Y-axis. This means that the
     * X-portion of this vector will be multiplied by -1.
     */
    public mirror_Y(): Vector
    {
        return new Vector(this.x * -1, this.y);
    }


    /**
     * Returns the distance between the endpoints of this vector and the given 
     * input.
     * 
     * @param input the Vector that must be subtracted to this Vector
     */
    public distance(input: Vector): number
    {
        return this.subtract(input).length;
    }

}