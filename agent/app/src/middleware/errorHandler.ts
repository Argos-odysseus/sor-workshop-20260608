import { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: 'Route not found', code: 'NOT_FOUND' });
}

export function errorHandler(
  _err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
}
