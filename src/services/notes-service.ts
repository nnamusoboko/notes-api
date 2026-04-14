import type { CreateNoteRequest, CreateNoteResponse, Note, UpdateNoteRequest } from "../types/types.js"
import NotesRepo from '../repositories/notes-repo.js';
import { AppError } from "../utils/error.js";

class NotesService {
    create = async (note: CreateNoteRequest): Promise<CreateNoteResponse> => {        
        return NotesRepo.saveNote(note);
    }

    getNotes = async (): Promise<Note[]> => {
        return NotesRepo.retrieveNotes();
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

        if (result) {
            return console.log(`Note removed`);
        }

        throw new Error("NOT_FOUND");
    }
}

export default new NotesService();
