import type { CreateNoteRequest, Note, UpdateNoteRequest } from "../types/types.js"; 
import crypto from 'node:crypto';

class NotesRepo {
    private notesArr: Note[] = [];

    saveNote = async (note: CreateNoteRequest):  Promise<Note> => {
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

    retrieveNotes = async (offset?: number, limit?: number): Promise<Note[]> => {
        console.log('DEBUG[repo]: ', 'Offset:', offset, 'Limit:', limit);
        
        if (!(offset && limit)) {
            return [...this.notesArr]; 
        }

        console.log('offset: ', offset);
        console.log('limit: ', limit);
        
        return this.notesArr.slice(offset, offset + limit); 
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

        result.updatedAt = new Date();

        return result;
    }

    removeNote = async (noteId: string): Promise<boolean> => {
        const originalLength = this.notesArr.length;
        
        this.notesArr = this.notesArr.filter(note => note.id !== noteId);

        return this.notesArr.length < originalLength;        
    }
}

export default new NotesRepo();

