import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3000,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


export const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection succesful: ', result.rows[0].now);
    } catch (err: unknown) {
        console.log('Database connecstion error:', err);
        process.exit(1);
    }
}
