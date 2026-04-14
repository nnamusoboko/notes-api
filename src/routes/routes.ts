import express from "express";

const router = express.Router();

router.get('/health', (_req, res) => {
    res.status(200).json({"message": "Server running"});
});

router.post('/notes', (_req, res) => {
    res.status(201).json({"message": "soon creating new notes"});
});
router.get('/notes', (_req, res) => {
    res.status(200).json({"message": "soon returning created notes"});
});
router.get('/notes/:id', (_req, res) => {
    res.status(200).json({"message": "soon returning contents of a note"});
});
router.patch('/notes/:id', (_req, res) => {
    res.status(200).json({"message": "soon updating note"});
});
router.delete('/notes/:id', (_req, res) => {
    res.status(204).json({"message": "soon deleting created note"});
});

export default router;
