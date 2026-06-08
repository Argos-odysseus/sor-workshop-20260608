import { Router, Request, Response, NextFunction } from 'express';
import { checkIn, getHistory } from './services/checkinService';
import { getBillingSummary } from './services/billingService';
import { addMember, getAllMembers, requireMember } from './services/memberService';
import type { CreateMemberInput } from './types';

export const router = Router();

function routeHandler(handler: (req: Request, res: Response) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

router.get('/members', (_req: Request, res: Response) => {
  res.json(getAllMembers());
});

router.get(
  '/members/:id',
  routeHandler((req: Request, res: Response) => {
    res.json(requireMember(req.params.id));
  }),
);

router.post(
  '/members',
  routeHandler((req: Request, res: Response) => {
    const member = addMember(req.body as CreateMemberInput);
    res.status(201).json(member);
  }),
);

router.post(
  '/members/:id/checkin',
  routeHandler((req: Request, res: Response) => {
    res.json(checkIn(req.params.id, (req.body as { date?: unknown }).date));
  }),
);

router.get(
  '/members/:id/checkins',
  routeHandler((req: Request, res: Response) => {
    res.json(getHistory(req.params.id));
  }),
);

router.get(
  '/members/:id/billing',
  routeHandler((req: Request, res: Response) => {
    res.json(getBillingSummary(req.params.id));
  }),
);
