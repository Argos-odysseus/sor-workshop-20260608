import { Router, Request, Response, NextFunction } from 'express';
import { EnergyValidationError, energyService } from '../services/EnergyService';
import { CreateReadingDto } from '../types/Energy';

export const energyRouter = Router();

function getStringQueryParam(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function sendValidationError(res: Response, err: EnergyValidationError): void {
  res.status(400).json({ error: err.message, code: err.code });
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
energyRouter.get('/houses/:id/readings', (req: Request, res: Response, next: NextFunction) => {
  const house = energyService.getHouseById(req.params.id);
  if (!house) {
    res.status(404).json({ error: 'House not found', code: 'HOUSE_NOT_FOUND' });
    return;
  }

  const from = getStringQueryParam(req.query.from);
  const to = getStringQueryParam(req.query.to);

  try {
    res.json(energyService.getReadingsForHouseInRange(req.params.id, from, to));
  } catch (err) {
    if (err instanceof EnergyValidationError) {
      sendValidationError(res, err);
      return;
    }

    next(err);
  }
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

      const reading = energyService.addReading({
        houseId: req.params.id,
        timestamp,
        kwh,
      } as CreateReadingDto);

      res.status(201).json(reading);
    } catch (err) {
      if (err instanceof EnergyValidationError) {
        sendValidationError(res, err);
        return;
      }

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
