import type { Note, CreateNoteRequest, UpdateNoteRequest, ISearchResult } from "../types/types.js";
import arrayNotesRepo from "./notes-repo.js";
import pgNotesRepo from "./notes-repo-pg.js";

export interface INotesRepository {
    saveNote(note: CreateNoteRequest): Promise<Note>;
    retrieveNotes(offset: number, limit: number): Promise<Note[]>;
    retrieveNoteById(id: string): Promise<Note | null>;
    updateNote(id: string, noteInfo: UpdateNoteRequest): Promise<Note | null>;
    removeNote(id: string): Promise<boolean>;
    getActiveNoteCount(): Promise<number>;
    searchByKeyword(offset: number, limit: number, search: string): Promise<ISearchResult>;
    extractDeletedNotes(): Promise<Note[]>;
    restoreNote(id: string): Promise<Note | null>;
}

const usePostgres = process.env.DB_STORAGE === 'postgres';

export const notesRepo: INotesRepository = usePostgres ? pgNotesRepo : arrayNotesRepo;
