import type { CreateNoteRequest, CreateNoteResponse, Note } from "../types/types.js"
import NotesRepo from '../repositories/notes-repo.js';

class NotesService {
    create = async (note: CreateNoteRequest): Promise<CreateNoteResponse> => {
        console.log(`[SENT NOTE]: ${note}`);
        
        return NotesRepo.saveNote(note);
    }

    getNotes = async (): Promise<Note[]> => {
        return NotesRepo.retrieveNotes();
    }

    getNote = async (noteId: string): Promise<Note | undefined> => {
        return NotesRepo.retrieveNoteById(noteId);
    }
}

export default new NotesService();
