import type { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/error.js";
import { HTTP_STATUS } from '../utils/constants.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    console.error('[ERROR STACK]: ', err); // internal

    const isCustomError = err instanceof AppError;
    const statusCode = isCustomError ? err.statusCode : HTTP_STATUS.SERVER_ERROR;
    const message = isCustomError ? err.message : 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        message
    });
}
