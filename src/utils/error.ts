export class AppError extends Error {
    public readonly statusCode: number; // makes it accessible outside
    
    constructor(message: string, statusCode: number) {
        super(message);  // sets message property on parent error class
        this.statusCode = statusCode;  // attaches custom error

        // Ensures class name AppError shows in the logs
        this.name = this.constructor.name; 

        // optional; but shows location where error happened
        Error.captureStackTrace(this, this.constructor);
    }
}
