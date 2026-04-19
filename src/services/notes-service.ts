import type { CreateNoteRequest, Note, NotesMetaData, PaginatedResponse, UpdateNoteRequest } from "../types/types.js"
import NotesRepo from '../repositories/notes-repo.js';
import { AppError } from "../utils/error.js";

class NotesService {
    create = async (note: CreateNoteRequest): Promise<Note> => {
        if (typeof note.title !== 'string' ) {
              throw new AppError("Wrong title format provided", 400);
        }

        if (note.title.trim() === "") {
            throw new AppError("No title provided", 400);
        }

        if (typeof note.contents !== 'string') {
            throw new AppError("Invalid content type provided", 400);
        }

        if (note.contents.trim() === "") {
            throw new AppError("No contents provided", 400);
        }

        return await NotesRepo.saveNote(note);
    }

    getNotes = async (page?: number, limit?: number, search?: string): Promise<PaginatedResponse> => {
        let notesData: Note[];
        let meta: NotesMetaData;
        let offset: number;

        if (search !== undefined && page === undefined && limit === undefined) {
            if (search?.trim() === "") throw new AppError("Provide a valid keyword", 400);
            
            const notesData = await NotesRepo.retrieveNotes(undefined, undefined, search);
            if (notesData.length < 1) throw new AppError(`No notes found with word [${search}] in title`, 404);
            
            const meta = this.getMetaData(1, 10, notesData.length);
            
            return {
                meta,
                notes: notesData,
            };
        } 
        
        if (page && limit && search === undefined) {
            offset = (page -1) * limit;

            console.log('DEBUG[service]: ', 'Page:', page, 'Limit:', limit);

            notesData = await NotesRepo.retrieveNotes(offset, limit);
            meta = this.getMetaData(page, limit, notesData.length);

            return {
                meta,
                notes: notesData,
            };
        }

        if (search && page && limit) {
            offset = (page - 1) * limit;
            if (search.trim() === "") throw new AppError("Please provide search keyword", 400);
            
            notesData = await NotesRepo.retrieveNotes(offset, limit, search);
            if (!notesData) throw new AppError("No notes match your saerch found", 404);

            meta = this.getMetaData(page, limit, notesData.length);

            return {
                meta: meta,
                notes: notesData
            }
        }

        // set default page and limit if user doesnt provide
        page = 1;
        limit = 10;

        notesData = await NotesRepo.retrieveNotes();
        meta =  this.getMetaData(page, limit, notesData.length);

        return {
            meta,
            notes: notesData,
        }
    }

    getNote = async (noteId: string): Promise<Note> => {
        const note = await NotesRepo.retrieveNoteById(noteId);

        if (!note) {
            throw new AppError("Note not found", 404);
        }

        return note
    }

    updateNote = async (noteId: string, noteInfo: UpdateNoteRequest): Promise<Note> => {
        const note = await NotesRepo.updateNote(noteId, noteInfo);

        if (!note) {
            throw new AppError("Note not found", 404);
        }

        return note;
    }

    remove = async (noteId: string): Promise<void> => {

        const result: boolean = await NotesRepo.removeNote(noteId);

        if (!result) {
           throw new AppError("Note not found", 404);
        }
    }

    getMetaData =  (page: number, limit: number, noteCount: number): NotesMetaData => {
        const totalCount: number =  noteCount;
        let totalPages: number;  
        let hasPrev: boolean, hasNext: boolean;

        if (!totalCount) {
            throw new AppError("No notes found", 404);
        }

        totalPages = Math.ceil(totalCount / limit);

        hasPrev = page > 1 && page <= totalPages;
        hasNext = page < totalPages;

        if (page > totalPages) throw new AppError("Requested page doesnt exist basing on your limit", 404);
        
        return {
           totalCount,
           totalPages,
           currentPage: page,
           limit,
           hasNext,
           hasPrev
        }
    }

    getDeletedNotes = async (): Promise<Note[]>  => {
        const returned: Note[] = await NotesRepo.extractDeletedNotes();
        
        if (returned.length < 1) {
            throw new AppError("No deleted notes found", 404);
        }

        return returned;
    }

    restoreNote = async (noteId: string): Promise<Note> => {
        if (!noteId) {
            throw new AppError("Provide note-id", 400);
        }

        const note: Note | null = await NotesRepo.restoreNote(noteId);

        if (note === null) {
            throw new AppError("Note not found", 404);
        }

        return note;
    }
}

export default new NotesService();
