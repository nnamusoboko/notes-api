import type { CreateNoteRequest, Note, UpdateNoteRequest } from "../types/types.js"; 
import crypto from 'node:crypto';

class NotesRepo {
    private readonly notesArr: Note[] = [];

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

        let tempArr: Note[] = [];

        if (offset === undefined || limit === undefined) {
            tempArr = this.notesArr.filter(note => note.deletedAt === null);
            return tempArr; 
        }
        
        tempArr = this.notesArr.slice(offset, offset + limit).filter(note => note.deletedAt === null);

        return tempArr;
    }

    retrieveNoteById = async (noteId: string, includeDeleted = false): Promise<Note | undefined> => {
        return  this.notesArr.find(note => {
            const matchesId = note.id === noteId;

            if (includeDeleted) {
                return matchesId; 
            }         
            return matchesId && note.deletedAt == null; 
        });
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
        let isDeleted: boolean = false;
        
        // soft delete
        for (const note of this.notesArr) {
            if (note.id === noteId && note.deletedAt === null) {
                const now = new Date();
                note.deletedAt = now;
                note.updatedAt = now;
                isDeleted = true;

                return isDeleted;
            }
        }

        return isDeleted;        
    }

    returnNoteCount = async (): Promise<number> => {
        return this.notesArr.length;
    }

    extractDeletedNotes = async (): Promise<Note[]> => {
        return this.notesArr.filter(note => note.deletedAt !== null);
    }

    restoreNote = async (noteId: string): Promise<Note | null> => {
        const note: Note | undefined = await this.retrieveNoteById(noteId, true);

        if (!note) return null;

        note.updatedAt = new Date();
        note.deletedAt = null;

        return note;
    }
}

export default new NotesRepo();

