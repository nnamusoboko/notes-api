import type { Request, Response, RequestHandler } from "express";
import NotesService from '../services/notes-service.js';
import type  { CreateNoteRequest } from "../types/types.js";

class NotesController {
    createNote: RequestHandler = async (req: Request, res: Response) => {
        const {title, contents}: CreateNoteRequest = req.body;
        
        const createdNote = await NotesService.create({title, contents});
        return res.status(200).json({
            "message": "Note created",
            "data": createdNote
        });
    }
}

export default new NotesController();
