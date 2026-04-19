import type { CreateNoteRequest, Note, NotesMetaData, PaginatedResponse, UpdateNoteRequest } from "../types/types.js"
import NotesRepo from '../repositories/notes-repo.js';
import { AppError } from "../utils/error.js";
import { getMetaData } from "../utils/pagination.js";

class NotesService {
    create = async (note: CreateNoteRequest): Promise<Note> => {
        this.validateNoteContent(note.title, note.contents);
        return await NotesRepo.saveNote(note);
    }

    getNotes = async (page = 1, limit = 3, search?: string): Promise<PaginatedResponse> => {
        let notesData: Note[];
        let meta: NotesMetaData;
        let offset: number;

        if (search && page && limit) {
            offset = (page - 1) * limit;
            if (search.trim() === "") throw new AppError("Please provide search keyword", 400);
            
            notesData = await NotesRepo.retrieveNotes(offset, limit, search);

            meta = getMetaData(page, limit, notesData.length);

            return {
                meta: meta,
                notes: notesData
            }
        }

        offset = (page - 1) * limit;
        notesData = await NotesRepo.retrieveNotes(offset, limit);
        const notesCount = await NotesRepo.returnNoteCount(); 
        meta =  getMetaData(page, limit, notesCount);

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
        this.validateNoteContent(noteInfo.title, noteInfo.contents)

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

    getDeletedNotes = async (): Promise<Note[]>  => {
        return await NotesRepo.extractDeletedNotes();
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

    private readonly validateNoteContent = (title?: string, contents?: string): void=> {
        if (typeof title !== 'string') {
              throw new AppError("Content must be a string", 400);
        }

        if (title.trim() === "") {
            throw new AppError("No title provided", 400);
        }

        if (typeof contents !== 'string') {
            throw new AppError('Content must be a string', 400);
        }

        if (contents.trim() === '') {
            throw new AppError('Content is empty', 400);
        }
    }
}

export default new NotesService();
