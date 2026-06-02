import { Router, Request, Response, NextFunction } from 'express';
import { energyService } from '../services/EnergyService';
import { CreateReadingDto } from '../types/Energy';

export const energyRouter = Router();

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

// GET /houses/:id/readings
energyRouter.get('/houses/:id/readings', (req: Request, res: Response) => {
  const house = energyService.getHouseById(req.params.id);
  if (!house) {
    res.status(404).json({ error: 'House not found', code: 'HOUSE_NOT_FOUND' });
    return;
  }
  res.json(energyService.getReadingsForHouse(req.params.id));
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
