import type { CreateNoteRequest, CreateNoteResponse, Note, UpdateNoteRequest,  } from "../types/types.js"; 
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

    retrieveNotes = async (): Promise<Note[]> => {
       return [...this.notesArr]; 
    }

    retrieveNoteById = async (noteId: string): Promise<Note | undefined> => {
        return this.notesArr.find(note => note.id === noteId);
    }

    updateNote = async (noteId: string, noteInfo: UpdateNoteRequest): Promise<Note | undefined> => {
        
        const result: Note | undefined = await this.retrieveNoteById(noteId);

        if (!result) {
            return undefined;
        }

        result.title = noteInfo.title ?? result.title;
        result.contents = noteInfo.contents ?? result.contents;

        return result;
    }
}

export default new NotesRepo();

