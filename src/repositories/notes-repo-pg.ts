import type { ISearchResult, Note, UpdateNoteRequest } from "../types/types.js";
import { pool } from "../config/database.js";
import { isValidUUID } from "../utils/uuid.js";
import { AppError } from "../utils/error.js";
import { HTTP_STATUS } from "../utils/constants.js";

class NotesRepo {

  saveNote = async (note: Note): Promise<Note> => {
    const query = `INSERT INTO notes (title, contents) VALUES ($1, $2) RETURNING *`;
    const result = await pool.query(query, [note.title, note.contents]);

    return result.rows[0];
  }

  retrieveNotes = async (offset: number, limit: number): Promise<Note[]> => {
    const query = `SELECT * FROM notes WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1 OFFSET $2`;

    const result = await pool.query(query, [limit, offset]);
    console.table(result.rows);

    return result.rows;
  }

  retrieveNoteById = async (id: string): Promise<Note | null> => {
    const query = `SELECT * FROM notes WHERE (deleted_at IS NULL AND id = $1)`;

    if (!isValidUUID(id)) {
      return null;
    }

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    console.log('Expected correct result: ', result.rows[0])

    return result.rows[0];
  }

  getActiveNoteCount =  async (): Promise<number> => {
    const query = `SELECT COUNT(*) FROM notes WHERE deleted_at IS NULL`;
    const result = await pool.query(query);

    return Number.parseInt(result.rows[0].count);
  }

  updateNote = async (noteId: string, noteInfo: UpdateNoteRequest): Promise<Note | null> => {
    if (!isValidUUID(noteId)) {
      throw new AppError('Invalid note-id', HTTP_STATUS.BAD_REQUEST);
    }

    const query = `UPDATE notes SET title = $1, contents = $2, updated_at = NOW() WHERE id = $3 AND deleted_at IS NULL RETURNING *`;
    const result = await pool.query(query, [noteInfo.title, noteInfo.contents, noteId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  removeNote = async (noteId: string): Promise<boolean> => {
    if (!isValidUUID(noteId)) {
      throw new AppError('Invalid note-id', HTTP_STATUS.BAD_REQUEST);
    }

    const query = `UPDATE notes SET deleted_at = NOW(), updated_at = NOW() WHERE (id = $1 AND deleted_at IS NULL) RETURNING *`;
    const result = await pool.query(query, [noteId]);

    return result.rows.length === 0;
  }

  searchByKeyword = async (offset: number, limit: number, search: string): Promise<ISearchResult> => {
    const searchPattern = `%${search}%`;

    const query = `SELECT * FROM notes WHERE (title ILIKE $1 AND deleted_at IS NULL) LIMIT $1 OFFSET $2`;

    const pageResult = await pool.query(query, [searchPattern, limit, offset]);
    const notes = pageResult.rows;

    const activeNoteCount = await this.getActiveNoteCount();

    return {
      matchingList: notes,
      searchCount: activeNoteCount
    }   
  }
  
  extractDeletedNotes = async (): Promise<Note[]> => {
    const query = `SELECT * FROM notes WHERE deleted_at IS NOT NULL`;
    const results = await pool.query(query);

    return results.rows;
  }
  
  restoreNote = async (noteId: string): Promise<Note | null> => {
    if (!isValidUUID(noteId)) {
      throw new AppError('Invalid note-id', HTTP_STATUS.BAD_REQUEST);
    }

    const query = `SELECT * FROM notes WHERE id = $1 AND deleted_at IS NULL`;
    const results = await pool.query(query, [noteId]);

    if (results.rows.length == 0) {
      return null;
    }

    return results.rows[0];
  }

}

export default new NotesRepo();