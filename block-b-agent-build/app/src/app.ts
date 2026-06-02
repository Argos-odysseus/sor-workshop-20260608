import express from 'express';
import { energyRouter } from './routes/energy';
import { notFound, errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(express.json());
app.use(energyRouter);
app.use(notFound);
app.use(errorHandler);
