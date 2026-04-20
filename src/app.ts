import express from "express";
import routes from './routes/routes.js';
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
