import type { NotesMetaData } from "../types/types.js";
import { AppError } from "./error.js";
import { HTTP_STATUS } from "./constants.js";

export function getMetaData(page: number, limit: number, notesCount: number): NotesMetaData  {
   let totalPages: number;  
   let hasPrev: boolean, hasNext: boolean;

   const totalCount: number = notesCount;

   if (limit < 0) {
        throw new AppError("Page limit is 0", HTTP_STATUS.BAD_REQUEST);
   }

   totalPages = Math.ceil(totalCount / limit);

   hasPrev = page > 1 && page <= totalPages;
   hasNext = page < totalPages;
   
   return {
      totalCount,
      totalPages,
      currentPage: page,
      limit,
      hasNext,
      hasPrev
   }
}
