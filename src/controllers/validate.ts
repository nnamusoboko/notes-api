import { AppError } from '../utils/error.js';
import { HTTP_STATUS } from '../utils/constants.js';
import type { QueryParams } from '../types/types.js';

export const validateQueryParams =  (query: QueryParams) =>  {
    const allowedParams = new Set(['page', 'limit', 'search']);
    const BAD_REQUEST = HTTP_STATUS.BAD_REQUEST;

    // check unknow params
    for (const key of Object.keys(query)) {
        if (!allowedParams.has(key)) {
            throw new AppError(`unknown param key: ${key}`, BAD_REQUEST);
        }
    }

    if (query.page !== undefined) {
        const pageNum = Number(query.page);
        if (Number.isNaN(pageNum) || pageNum < 1) {
            throw new AppError(`Page must be a number >=1`, BAD_REQUEST);
        }
    }

    if (query.limit !== undefined) {
        const pageLimit = Number(query.limit);
        if (Number.isNaN(pageLimit) || pageLimit < 1 || pageLimit > 50) {
            throw new AppError(`Page limit must be a number >=1 and <= 50`, BAD_REQUEST);
        }
    }

    if (query.search !== undefined) {
        const searchString = query.search;
        if (typeof searchString !== 'string' || searchString.trim() === '') { 
            throw new AppError(`${query.search} must be a non-empty string`, BAD_REQUEST);
        }
    } 
}