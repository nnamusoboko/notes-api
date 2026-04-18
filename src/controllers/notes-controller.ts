import type { Request, Response, RequestHandler } from "express";
import NotesService from '../services/notes-service.js';
import type  { CreateNoteRequest, Note, UpdateNoteRequest } from "../types/types.js";
import { AppError } from "../utils/error.js";

class NotesController {
    createNote: RequestHandler = async (req: Request, res: Response) => {
        const {title, contents}: CreateNoteRequest = req.body;
        
        const createdNote = await NotesService.create({title, contents});
        return res.status(201).json({
            "message": "Note created",
            "data": createdNote
        });
    }

    getAllNotes: RequestHandler = async (req: Request, res: Response) => {
        const {page, limit} = req.query;

        let pageNum;
        let limitNum = limit ? Number(limit) : undefined;
        console.log('DEBUG[controller]: ', 'Page:', pageNum, 'Limit:', limitNum);

        if (page !== undefined) {
            pageNum = Number(page);

            if (Number.isNaN(pageNum) || pageNum < 1) {
                return res.status(400).json({"message": "Please valid page number"});
            }
        }

        if (limit !== undefined) {
            limitNum = Number(limit)
            if (Number.isNaN(limitNum) || limitNum < 1) {
                return res.status(400).json({"message": "Provide valid page limit"});
            }
        }

       const data = await NotesService.getNotes(pageNum, limitNum); 
       return res.status(200).json({
           data
       })
    }

    getSingleNote: RequestHandler = async (req: Request, res: Response) => {
        const noteId = req.params.id;

        if (!noteId || typeof noteId !== "string") {
            return res.status(400).json({
                "message": "Provide note-id"
            })
        }

        try {
            const result: Note = await NotesService.getNote(noteId);
            return res.status(200).json({
            "data": result
        });
        } catch(error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({"message": error.message});
            }

            return res.status(500).json({"message": "internal Server Error"});                
        }
    }

    updateSingleNote: RequestHandler = async (req: Request, res: Response) => {
        const noteId  = req.params.id;
        const userInfo: UpdateNoteRequest = req.body;
        
        if (!noteId || typeof noteId !== 'string') {
            return res.status(400).json({
                "message": "provide note-id"
            })
        }

        if ("title" in userInfo) {
            if (typeof userInfo.title !== 'string') {
                return res.status(400).json({"message": "Enter a valid title"});
            }

            if (userInfo.title.trim() === "") {
                return res.status(400).json({"message": "No title provided"});
            }
        }
        
        if ("contents" in userInfo) {
            if (typeof userInfo.contents !== 'string') {
                return res.status(400).json({"message": "Wrong format of content provided"});
            }

            if (userInfo.contents.trim() === "") {
                return res.status(400).json({"message": "No contents provided"});
            }
        }

        try {
            const note: Note = await NotesService.updateNote(noteId, userInfo);
            return res.status(200).json({
                "message": "Note updated",
                "data": note
            });
        } catch(error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({"message": error.message});
            }
            return res.status(500).json({"message": "Internal Server Error"});
        }
    }

    deleteNote:RequestHandler = async (req, res) => {
        const noteId = req.params.id;

        if (!noteId || typeof noteId !== 'string') {
            return res.status(400).json({"message": "note-id not provide"});
        }

        try {
            await NotesService.remove(noteId);
            return res.status(204).send();
        } catch (error) {
            
            if (error instanceof AppError){
                return res.status(error.statusCode).json({"message": error.message});
            }
            return res.status(500).json({"message": "Internal server error"});
        }
    }

    getDeletedNotes: RequestHandler = async (_req, res) => {
        try {
            const data = await NotesService.getDeletedNotes();
            return res.status(200).json({
                data
            })
        } catch (error: unknown) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({"message": error.message}); 
            }

            return res.status(500).json({
                "message": "Internal server Error"
            })
        }
    }

    getRestoredNote: RequestHandler = async (req: Request, res:Response) => {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                "message": "Provide note-id"
            });
        }

        if (typeof id !== 'string') {
            return res.status(400).json({
                "message": "Provide a valid note-id"
            });
        }

        try {
            const restoredNote: Note = await NotesService.restoreNote(id);
            return res.status(200).json({
                "data": restoredNote
            });
        } catch (error: unknown) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    "message": error.message
                });
            }

            return res.status(500).json({
                "message": "Internal server Error"
            })
        }
    }
}

export default new NotesController();
