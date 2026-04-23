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

const shutDown = async () => {
    try {
        console.log('\nSIGTERM received. Cleaning up....');
        await pool.end()
        console.log('Database pool closed successfully');
        process.exit(0);
    } catch (err: unknown) {
        console.error('Error while shutting down database:', err);
        process.exit(1);
    }
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
