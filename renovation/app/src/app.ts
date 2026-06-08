import express, { NextFunction, Request, Response } from 'express';
import { isApiError } from './errors';
import { router } from './routes';

export const app = express();

app.use(express.json());
app.use('/', router);

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (isApiError(error)) {
    res.status(error.status).json({ error: error.message, code: error.code });
    return;
  }

  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' });
}

app.use(errorHandler);
