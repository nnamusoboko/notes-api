import type { Request, Response, RequestHandler, NextFunction } from "express";
import NotesService from '../services/notes-service.js';
import type  { CreateNoteRequest, Note, UpdateNoteRequest } from "../types/types.js";
import { HTTP_STATUS, MAX_PAGE_LIMIT } from "../utils/constants.js";

class NotesController {
    createNote: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const {title, contents}: CreateNoteRequest = req.body;
        
        try {
            const createdNote = await NotesService.create({title, contents});
            return res.status(HTTP_STATUS.CREATED).json({
                "message": "Note created",
                "data": createdNote
            });

        } catch (error: unknown) {
            return next(error);
        }
    }

    getAllNotes: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const {page, limit, search} = req.query;

        let pageNum;
        let limitNum = limit ? Number(limit) : undefined;
        console.log('DEBUG[controller]: ', 'Page:', pageNum, 'Limit:', limitNum);

        if (page !== undefined) {
            pageNum = Number(page);

            if (Number.isNaN(pageNum) || pageNum < 1) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({"message": "Please valid page number"});
            }
        }

        if (limit !== undefined) {
            limitNum = Number(limit)
            if (Number.isNaN(limitNum) || limitNum < 1) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({"message": "Provide valid page limit"});
            }

            limitNum = limitNum > MAX_PAGE_LIMIT ? MAX_PAGE_LIMIT : limitNum;
        }

        if (search !== undefined) {
            if (typeof search !== 'string') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    "message": "Provide a valid search word"
                });
            }

            if (search.trim() === "") {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({"message": "Provide a search word"});
            }
        }
        try {
            const data = await NotesService.getNotes(pageNum, limitNum, search); 
            return res.status(HTTP_STATUS.OK).json({
                data
            }); 
        } catch (error: unknown) {
            return next(error);
        }
    }

    getSingleNote: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const noteId = req.params.id;

        if (!noteId || typeof noteId !== "string") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                "message": "Provide note-id"
            })
        }

        try {
            const result: Note = await NotesService.getNote(noteId);
            return res.status(HTTP_STATUS.OK).json({
            "data": result
        });
        } catch(error: unknown) {
            return next(error);
        }
    }

    updateSingleNote: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const noteId  = req.params.id;
        const userInfo: UpdateNoteRequest = req.body;
        
        if (!noteId || typeof noteId !== 'string') {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                "message": "provide note-id"
            })
        }

        if ("title" in userInfo) {
            if (typeof userInfo.title !== 'string') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({"message": "Enter a valid title"});
            }

            if (userInfo.title.trim() === "") {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({"message": "No title provided"});
            }
        }
        
        if ("contents" in userInfo) {
            if (typeof userInfo.contents !== 'string') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({"message": "Wrong format of content provided"});
            }

            if (userInfo.contents.trim() === "") {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({"message": "No contents provided"});
            }
        }

        try {
            const note: Note = await NotesService.updateNote(noteId, userInfo);
            return res.status(HTTP_STATUS.OK).json({
                "message": "Note updated",
                "data": note
            });
        } catch(error: unknown) {
            return next(error);
        }
    }

    deleteNote:RequestHandler = async (req, res, next) => {
        const noteId = req.params.id;

        if (!noteId || typeof noteId !== 'string') {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({"message": "note-id not provide"});
        }

        try {
            await NotesService.remove(noteId);
            return res.status(HTTP_STATUS.NO_CONTENT).send();
        } catch (error: unknown) {
            return next(error);
        }
    }

    getDeletedNotes: RequestHandler = async (_req, res, next) => {
        try {
            const data = await NotesService.getDeletedNotes();
            return res.status(HTTP_STATUS.OK).json({
                data
            })
        } catch (error: unknown) {
            return next(error);
        }
    }

    getRestoredNote: RequestHandler = async (req: Request, res:Response, next: NextFunction) => {
        const { id } = req.params;
        
        if (!id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                "message": "Provide note-id"
            });
        }

        if (typeof id !== 'string') {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                "message": "Provide a valid note-id"
            });
        }

        try {
            const restoredNote: Note = await NotesService.restoreNote(id);
            return res.status(HTTP_STATUS.OK).json({
                "data": restoredNote
            });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new NotesController();
