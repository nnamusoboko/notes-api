import type { CreateNoteRequest, Note, UpdateNoteRequest, ISearchResult } from "../types/types.js"; 
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

    retrieveNotes = async (offset?: number, limit?: number, search?: string): Promise<Note[]> => {
        console.log('DEBUG[repo]: ', 'Offset:', offset, 'Limit:', limit, 'Search', search);

        let tempArr: Note[] = [];

        // no pagination, no search
        if (offset === undefined && limit === undefined && search === undefined) {
            tempArr = this.notesArr.filter(note => note.deletedAt === null);
            return tempArr; 
        }

        // pagination only
        if (offset !== undefined && limit !== undefined && search === undefined) {
            return this.notesArr.filter(note => note.deletedAt === null).slice(offset, offset + limit);
        }
        return [];
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
        const note = await this.retrieveNoteById(noteId);

        if (!note) { return false; }
        // soft delete
        const now = new Date();
        note.deletedAt = now;
        note.updatedAt = now;

        return true;
    }

    returnNoteCount = async (): Promise<number> => {
        return this.notesArr.filter(note => note.deletedAt === null).length;
    }

    extractDeletedNotes = async (): Promise<Note[]> => {
        return this.notesArr.filter(note => note.deletedAt !== null);
    }

    restoreNote = async (noteId: string): Promise<Note | null> => {
        const note: Note | undefined = await this.retrieveNoteById(noteId, true);

        if (!note) return null;

        if (note.deletedAt === null) return null;

        note.updatedAt = new Date();
        note.deletedAt = null;

        return note;
    }

    searchByKeyword = async (offset: number, limit: number, search: string): Promise<ISearchResult> => {
        let totalMatches = 0;
        const searchResult: Note[] = [];

        for (const note of this.notesArr) {
            const matchesSearch = note.title.toLocaleLowerCase().includes(search.toLocaleLowerCase());
            if (note.deletedAt === null && matchesSearch) {
                totalMatches++;
                const isAfterOffset = totalMatches > offset;
                const isBeforLimit = searchResult.length < limit;  
                
                if (isAfterOffset && isBeforLimit) {
                    searchResult.push(note);
                }
            }
        }

        return {
            matchingList: searchResult,
            searchCount: totalMatches
        }
    }
}

export default new NotesRepo();

