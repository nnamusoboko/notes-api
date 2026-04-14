import type { CreateNoteRequest, CreateNoteResponse } from "../types/types.js"
import NotesRepo from '../repositories/notes-repo.js';

class NotesService {
    create = async (note: CreateNoteRequest): Promise<CreateNoteResponse> => {
        console.log(`[SENT NOTE]: ${note}`);
        
        return NotesRepo.saveNote(note);
    }
}

export default new NotesService();
