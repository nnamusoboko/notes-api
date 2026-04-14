import type { CreateNoteRequest, CreateNoteResponse, Note } from "../types/types.js"; 
import crypto from 'node:crypto';

class NotesRepo {
    notesArr: Note[] = [];

    saveNote = async (note: CreateNoteRequest):  Promise<CreateNoteResponse> => {
        const now = new Date();
        const newNote = {
            id: crypto.randomUUID(), 
            title: note.title,
            contents: note.contents,
            createdAt: now,
            updatedAt: now
        }
        this.notesArr.push(newNote);    
        
        return newNote;
    }
}

export default new NotesRepo();

