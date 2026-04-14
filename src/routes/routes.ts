import express from "express";
import Handler from '../controllers/notes-controller.js';

const router = express.Router();

router.get('/health', (_req, res) => {
    res.status(200).json({"message": "Server running"});
});

router.post('/notes', Handler.createNote);
router.get('/notes', Handler.getAllNotes);
router.get('/notes/:id', Handler.getSingleNote);
router.patch('/notes/:id', (_req, res) => {
    res.status(200).json({"message": "soon updating note"});
});
router.delete('/notes/:id', (_req, res) => {
    res.status(204).json({"message": "soon deleting created note"});
});

export default router;
