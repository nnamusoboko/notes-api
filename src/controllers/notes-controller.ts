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

    getAllNotes: RequestHandler = async (_req: Request, res: Response) => {
       const allNotes = await NotesService.getNotes(); 
       return res.status(200).json({
           "message": "All notes returned",
           "data": allNotes
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

        if (!userInfo.title || userInfo.title.trim() === "") {
            return res.status(400).json({"message": "No title provided"});
        }

        if (!userInfo.contents || userInfo.contents.trim() === "") {
            return res.status(400).json({"message": "No contents provided"});
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
}

export default new NotesController();
