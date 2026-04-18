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
            updatedAt: now,
            deletedAt: null
        }
        this.notesArr.push(newNote);    
        
        return newNote;
    }

    retrieveNotes = async (offset?: number, limit?: number): Promise<Note[]> => {
        console.log('DEBUG[repo]: ', 'Offset:', offset, 'Limit:', limit);

        if (offset === undefined || limit === undefined) {
            return [...this.notesArr]; 
        }
        
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
        // this.notesArr = this.notesArr.filter(note => note.id !== noteId);
        let isDeleted: boolean = false;
        
        // soft delete
        for (const note of this.notesArr) {
            if (note.id === noteId) {
                note.deletedAt = new Date();
                isDeleted = true;
                return isDeleted;
            }
        }

        return isDeleted;        
    }

    returnNoteCount = async (): Promise<number> => {
        return this.notesArr.length;
    }
}

export default new NotesRepo();

