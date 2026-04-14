import type { Request, Response, RequestHandler } from "express";
import NotesService from '../services/notes-service.js';
import type  { CreateNoteRequest, Note, UpdateNoteRequest } from "../types/types.js";

class NotesController {
    createNote: RequestHandler = async (req: Request, res: Response) => {
        const {title, contents}: CreateNoteRequest = req.body;
        
        const createdNote = await NotesService.create({title, contents});
        return res.status(200).json({
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
        
        const result: Note | undefined = await NotesService.getNote(noteId);
        if (!result) {
            return res.status(404).json({"message": "Note doesnt exist"});
        }

        return res.status(200).json({
            "data": result
        });
    }

    updateSingleNote: RequestHandler = async (req: Request, res: Response) => {
        const userInfo: UpdateNoteRequest = req.body;

        const noteId  = req.params.id;
        
        if (!noteId || typeof noteId !== 'string') {
            return res.status(400).json({
                "message": "provide note-id"
            })
        }

        const note = await NotesService.updateNote(noteId, userInfo);

        if (!note) {
            return res.status(400).json({
                "message": `Note with [noteId]: ${noteId} doesnt exist` 
            });
        }

        return res.status(200).json({
            "message": "Note updated",
            "data": note
        })
    }
}

export default new NotesController();
