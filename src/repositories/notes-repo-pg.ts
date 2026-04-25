import type { Note } from "../types/types.js";
import { pool } from "../config/database.js";
import { isValidUUID } from "../utils/uuid.js";


class NotesRepo {

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

}

export default new NotesRepo();