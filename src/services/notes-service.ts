import type { CreateNoteRequest, ISearchResult, Note, NotesMetaData, PaginatedResponse, UpdateNoteRequest } from "../types/types.js"
import NotesRepo from '../repositories/notes-repo.js';
import { AppError } from "../utils/error.js";
import { getMetaData } from "../utils/pagination.js";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER, HTTP_STATUS } from "../utils/constants.js";

class NotesService {
    create = async (note: CreateNoteRequest): Promise<Note> => {
        this.validateNoteContent(note.title, note.contents);
        return await NotesRepo.saveNote(note);
    }

    getNotes = async (pageNumber?: number, pageLimit?: number, search?: string): Promise<PaginatedResponse> => {
        let notesData: Note[];
        let meta: NotesMetaData;
        let offset: number;

        if (search?.trim() === '') {
            throw new AppError("Please provide search keyword", HTTP_STATUS.BAD_REQUEST);
        }

        pageNumber = pageNumber || DEFAULT_PAGE_NUMBER;
        pageLimit = pageLimit || DEFAULT_PAGE_LIMIT;

        if (search) {
            let searchResult: ISearchResult;

            offset = (pageNumber -1) * pageLimit;
            searchResult = await NotesRepo.searchByKeyword(offset, pageLimit, search);
    
            meta = getMetaData(pageNumber, pageLimit, searchResult.searchCount);

            return {
                meta: meta,
                notes: searchResult.matchingList
            }
        }

        offset = (pageNumber - 1) * pageLimit;
        notesData = await NotesRepo.retrieveNotes(offset, pageLimit);
        const totalNoteCount = await NotesRepo.returnNoteCount(); // O(1)
        meta =  getMetaData(pageNumber, pageLimit, totalNoteCount);

        return {
            meta,
            notes: notesData,
        }
    }

    getNote = async (noteId: string): Promise<Note> => {
        const note = await NotesRepo.retrieveNoteById(noteId);

        if (!note) {
            throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
        }

        return note
    }

    updateNote = async (noteId: string, noteInfo: UpdateNoteRequest): Promise<Note> => {
        this.validateNoteContent(noteInfo.title, noteInfo.contents)

        const note = await NotesRepo.updateNote(noteId, noteInfo);
        if (!note) {
            throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
        }

        return note;
    }

    remove = async (noteId: string): Promise<void> => {

        const result: boolean = await NotesRepo.removeNote(noteId);

        if (!result) {
           throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
        }
    }

    getDeletedNotes = async (): Promise<Note[]>  => {
        return await NotesRepo.extractDeletedNotes();
    }

    restoreNote = async (noteId: string): Promise<Note> => {
        if (!noteId) {
            throw new AppError("Provide note-id", HTTP_STATUS.BAD_REQUEST);
        }

        const note: Note | null = await NotesRepo.restoreNote(noteId);

        if (note === null) {
            throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
        }

        return note;
    }

    private readonly validateNoteContent = (title?: string, contents?: string): void=> {
        if (title !== undefined) {
            if (typeof title !== 'string') {
                throw new AppError("Title must be text", HTTP_STATUS.BAD_REQUEST); 
            }
            if (title.trim() === "") {
                throw new AppError("Title cannot be empty", HTTP_STATUS.BAD_REQUEST); 
            }
        }


        if (contents !== undefined) {
            if (typeof contents !== 'string') {
                throw new AppError('Content must be string', HTTP_STATUS.BAD_REQUEST);
            }

            if (contents.trim() === '') {
                throw new AppError("Contents cannot be empty", HTTP_STATUS.BAD_REQUEST);
            }
        }
    }
}

export default new NotesService();
