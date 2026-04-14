import express from "express";

const app = express();

app.get('/health', (_req, res) => {
    res.status(200).json({"message": "Server running"});
});

app.post('/api/notes', (_req, res) => {
    res.status(201).json({"message": "soon creating new notes"});
});
app.get('/api/notes', (_req, res) => {
    res.status(200).json({"message": "soon returning created notes"});
});
app.get('/api/notes/:id', (_req, res) => {
    res.status(200).json({"message": "soon returning contents of a note"});
});
app.patch('/api/notes/:id', (_req, res) => {
    res.status(200).json({"message": "soon updating note"});
});
app.delete('/api/note/:id', (_req, res) => {
    res.status(204).json({"message": "soon deleting created note"});
});

export default app;
