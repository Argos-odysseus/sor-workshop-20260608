import { Router, Request, Response, NextFunction } from 'express';
import { energyService } from '../services/EnergyService';
import { CreateReadingDto } from '../types/Energy';

export const energyRouter = Router();

function isValidIsoTimestamp(value: string): boolean {
  const isoTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
  if (!isoTimestampPattern.test(value)) {
    return false;
  }

  const normalizedValue = value.includes('.') ? value : value.replace('Z', '.000Z');
  const parsed = new Date(value);

  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === normalizedValue;
}

function getStringQueryParam(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

// GET /houses
energyRouter.get('/houses', (_req: Request, res: Response) => {
  res.json(energyService.getHouses());
});

// GET /houses/:id
energyRouter.get('/houses/:id', (req: Request, res: Response) => {
  const house = energyService.getHouseById(req.params.id);
  if (!house) {
    res.status(404).json({ error: 'House not found', code: 'HOUSE_NOT_FOUND' });
    return;
  }
  res.json(house);
});

// GET /houses/:id/readings/summary
energyRouter.get('/houses/:id/readings/summary', (req: Request, res: Response) => {
  const house = energyService.getHouseById(req.params.id);
  if (!house) {
    res.status(404).json({ error: 'House not found', code: 'HOUSE_NOT_FOUND' });
    return;
  }
  res.json(energyService.getReadingSummaryForHouse(req.params.id));
});

// GET /houses/:id/readings
energyRouter.get('/houses/:id/readings', (req: Request, res: Response) => {
  const house = energyService.getHouseById(req.params.id);
  if (!house) {
    res.status(404).json({ error: 'House not found', code: 'HOUSE_NOT_FOUND' });
    return;
  }

  const from = getStringQueryParam(req.query.from);
  const to = getStringQueryParam(req.query.to);

  if ((from && !isValidIsoTimestamp(from)) || (to && !isValidIsoTimestamp(to))) {
    res
      .status(400)
      .json({ error: 'from and to must be valid ISO timestamps', code: 'VALIDATION_ERROR' });
    return;
  }

  if (from && to && new Date(from).getTime() > new Date(to).getTime()) {
    res.status(400).json({ error: 'from must be before to', code: 'VALIDATION_ERROR' });
    return;
  }

  res.json(energyService.getReadingsForHouseInRange(req.params.id, from, to));
});

// POST /houses/:id/readings
energyRouter.post(
  '/houses/:id/readings',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const house = energyService.getHouseById(req.params.id);
      if (!house) {
        res.status(404).json({ error: 'House not found', code: 'HOUSE_NOT_FOUND' });
        return;
      }

      const { timestamp, kwh } = req.body as Partial<CreateReadingDto>;

      if (typeof kwh !== 'number' || kwh <= 0) {
        res
          .status(400)
          .json({ error: 'kwh must be a positive number', code: 'VALIDATION_ERROR' });
        return;
      }

      if (!timestamp || typeof timestamp !== 'string') {
        res
          .status(400)
          .json({ error: 'timestamp is required', code: 'VALIDATION_ERROR' });
        return;
      }

      if (!isValidIsoTimestamp(timestamp)) {
        res
          .status(400)
          .json({ error: 'timestamp must be a valid ISO timestamp', code: 'VALIDATION_ERROR' });
        return;
      }

      const reading = energyService.addReading({
        houseId: req.params.id,
        timestamp,
        kwh,
      });

      res.status(201).json(reading);
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /readings/:id
energyRouter.delete('/readings/:id', (req: Request, res: Response) => {
  const deleted = energyService.deleteReading(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Reading not found', code: 'READING_NOT_FOUND' });
    return;
  }
  res.status(204).send();
});
