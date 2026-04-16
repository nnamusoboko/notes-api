import type { CreateNoteRequest, Note, UpdateNoteRequest } from "../types/types.js"
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

    getNotes = async (): Promise<Note[]> => {
        return await NotesRepo.retrieveNotes();
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

         return; 
    }
}

export default new NotesService();
