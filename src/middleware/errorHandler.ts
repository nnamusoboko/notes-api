import type { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/error.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    console.error('[ERROR STACK]: ', err); // internal

    const isCustomError = err instanceof AppError;
    const statusCode = isCustomError ? err.statusCode : 500;
    const message = isCustomError ? err.message : 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        message
    });
}
