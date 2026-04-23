import app from './app.js';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

dotenv.config();

const PORT = process.env.SERVER_PORT;


const startServer = async () => {
    await testConnection();

    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    });
}

startServer();