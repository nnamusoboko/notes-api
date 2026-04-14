import type { CreateNoteRequest, CreateNoteResponse, Note, UpdateNoteRequest } from "../types/types.js"
import NotesRepo from '../repositories/notes-repo.js';

class NotesService {
    create = async (note: CreateNoteRequest): Promise<CreateNoteResponse> => {        
        return NotesRepo.saveNote(note);
    }

    getNotes = async (): Promise<Note[]> => {
        return NotesRepo.retrieveNotes();
    }

    getNote = async (noteId: string): Promise<Note | undefined> => {
        return NotesRepo.retrieveNoteById(noteId);
    }

    updateNote = async (noteId: string, noteInfo: UpdateNoteRequest): Promise<Note | undefined> => {
        return NotesRepo.updateNote(noteId, noteInfo);
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
