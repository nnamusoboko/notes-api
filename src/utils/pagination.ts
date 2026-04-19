import type { NotesMetaData } from "../types/types.js";

export function getMetaData(page: number, limit: number, notesCount: number): NotesMetaData  {
   let totalPages: number;  
   let hasPrev: boolean, hasNext: boolean;

   const totalCount: number = notesCount;

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
