import request from 'supertest';
import { NextFunction, Request, Response } from 'express';
import { app, errorHandler } from '../src/app';
import {
  checkIn,
  clearAllCheckins,
  countForWeek,
  getWeekKey,
} from '../src/services/checkinService';
import {
  daysSinceLastPayment,
  getAnnualCost,
  getMonthlyFee,
  getProRatedFee,
  isOverdue,
} from '../src/services/billingService';
import { getPlans, resetMembers } from '../src/services/memberService';

beforeEach(() => {
  resetMembers();
  clearAllCheckins();
});

describe('member routes', () => {
  it('lists the seeded members', async () => {
    const res = await request(app).get('/members');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
    expect(res.body[0]).toMatchObject({ id: 'm1', name: 'Alice', plan: 'premium' });
  });

  it('returns a member by id', async () => {
    const res = await request(app).get('/members/m2');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 'm2', email: 'bob@example.com' });
  });

  it('returns a consistent 404 for missing members', async () => {
    const res = await request(app).get('/members/missing');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Member not found', code: 'MEMBER_NOT_FOUND' });
  });

  it('creates a valid member with defaults', async () => {
    const res = await request(app)
      .post('/members')
      .send({ name: 'Erika', email: 'erika@example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: 'm5',
      name: 'Erika',
      email: 'erika@example.com',
      plan: 'basic',
      active: true,
    });
    expect(res.body.joinDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('rejects invalid member input', async () => {
    const res = await request(app)
      .post('/members')
      .send({ name: '', email: 'not-email', plan: 'vip' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('rejects invalid email input after a valid name', async () => {
    const res = await request(app).post('/members').send({ name: 'Erika', email: 'not-email' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('rejects invalid plan input after valid identity fields', async () => {
    const res = await request(app)
      .post('/members')
      .send({ name: 'Erika', email: 'erika@example.com', plan: 'vip' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('rejects invalid join dates', async () => {
    const res = await request(app)
      .post('/members')
      .send({ name: 'Erika', email: 'erika@example.com', joinDate: 'bad-date' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('creates a valid member with explicit id, plan, and join date', async () => {
    const res = await request(app).post('/members').send({
      id: 'm99',
      name: 'Frida',
      email: 'frida@example.com',
      plan: 'premium',
      joinDate: '2026-06-08',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: 'm99',
      plan: 'premium',
      joinDate: '2026-06-08',
    });
  });

  it('defaults blank optional member fields', async () => {
    const res = await request(app)
      .post('/members')
      .send({ id: ' ', name: 'Guro', email: 'guro@example.com', joinDate: ' ' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 'm5', joinDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) });
  });

  it('rejects missing required member fields', async () => {
    const res = await request(app).post('/members').send({});

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('rejects impossible join dates', async () => {
    const res = await request(app)
      .post('/members')
      .send({ name: 'Hanna', email: 'hanna@example.com', joinDate: '2026-02-31' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('rejects duplicate member ids', async () => {
    const res = await request(app)
      .post('/members')
      .send({ id: 'm1', name: 'Alice Two', email: 'alice2@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});

describe('check-in routes and service', () => {
  it('checks in an active member', async () => {
    const res = await request(app)
      .post('/members/m2/checkin')
      .send({ date: '2026-06-08T09:00:00.000Z' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ memberId: 'm2', week: '2026-06-08', count: 1 });
  });

  it('calculates Monday week keys correctly for Sundays', () => {
    expect(getWeekKey('2026-06-14T12:00:00.000Z')).toBe('2026-06-08');
  });

  it('counts check-ins inside a Monday-based week', () => {
    checkIn('m2', '2026-06-08T09:00:00.000Z');
    checkIn('m2', '2026-06-14T09:00:00.000Z');

    expect(countForWeek('m2', '2026-06-10T09:00:00.000Z')).toBe(2);
  });

  it('returns check-in history for a member', async () => {
    await request(app).post('/members/m2/checkin').send({ date: '2026-06-08T09:00:00.000Z' });

    const res = await request(app).get('/members/m2/checkins');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(['2026-06-08T09:00:00.000Z']);
  });

  it('returns an empty check-in history for a member without visits', async () => {
    const res = await request(app).get('/members/m2/checkins');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects missing members on check-in', async () => {
    const res = await request(app)
      .post('/members/missing/checkin')
      .send({ date: '2026-06-08T09:00:00.000Z' });

    expect(res.status).toBe(404);
    expect(res.body.code).toBe('MEMBER_NOT_FOUND');
  });

  it('rejects inactive members on check-in', async () => {
    const res = await request(app)
      .post('/members/m3/checkin')
      .send({ date: '2026-06-08T09:00:00.000Z' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('MEMBER_INACTIVE');
  });

  it('rejects invalid check-in dates', async () => {
    const res = await request(app).post('/members/m2/checkin').send({ date: 'not-a-date' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('rejects non-string check-in dates', async () => {
    const res = await request(app).post('/members/m2/checkin').send({ date: 123 });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('uses the current time when check-in date is omitted', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-06-10T09:00:00.000Z'));

    const res = await request(app).post('/members/m2/checkin').send({});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ memberId: 'm2', week: '2026-06-08', count: 1 });

    jest.useRealTimers();
  });

  it('rejects invalid dates in direct week-key calculations', () => {
    expect(() => getWeekKey('not-a-date')).toThrow('date must be a valid date string');
  });

  it('enforces basic plan weekly limits', async () => {
    for (const day of ['08', '09', '10', '11']) {
      await request(app).post('/members/m2/checkin').send({ date: `2026-06-${day}T09:00:00.000Z` });
    }

    const res = await request(app)
      .post('/members/m2/checkin')
      .send({ date: '2026-06-12T09:00:00.000Z' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('PLAN_LIMIT_EXCEEDED');
  });
});

describe('billing routes and service', () => {
  it('returns billing summary using the plan map', async () => {
    const res = await request(app).get('/members/m1/billing');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      member: 'Alice',
      plan: 'Premium',
      monthlyFee: 499,
      annualCost: 5988,
      active: true,
    });
  });

  it('returns consistent 404 errors from billing routes', async () => {
    const res = await request(app).get('/members/missing/billing');

    expect(res.status).toBe(404);
    expect(res.body.code).toBe('MEMBER_NOT_FOUND');
  });

  it('calculates monthly, annual, pro-rated, and overdue values', () => {
    const plans = getPlans();

    expect(getMonthlyFee('basic', plans)).toBe(299);
    expect(getAnnualCost('premium', plans)).toBe(5988);
    expect(getProRatedFee('basic', plans, '2026-06-10')).toBe(199);
    expect(daysSinceLastPayment('2026-05-01T00:00:00.000Z', new Date('2026-06-10T00:00:00.000Z'))).toBe(40);
    expect(isOverdue('2026-05-01T00:00:00.000Z', new Date('2026-06-10T00:00:00.000Z'))).toBe(true);
  });

  it('uses the current date for payment age helpers when no clock is supplied', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-06-10T00:00:00.000Z'));

    expect(daysSinceLastPayment('2026-06-01T00:00:00.000Z')).toBe(9);
    expect(isOverdue('2026-06-01T00:00:00.000Z')).toBe(false);

    jest.useRealTimers();
  });
});

describe('error handling', () => {
  it('returns a consistent 500 response for unknown errors', () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as Response;

    errorHandler(
      new Error('boom'),
      {} as Request,
      res,
      jest.fn() as NextFunction,
    );

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    });
  });
});
