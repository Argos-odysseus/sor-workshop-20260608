import request from 'supertest';
import { app } from '../src/app';
import { EnergyValidationError, energyService } from '../src/services/EnergyService';
import { CreateReadingDto } from '../src/types/Energy';

describe('GET /houses', () => {
  it('returns a list of houses', async () => {
    const res = await request(app).get('/houses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('returns houses with expected shape', async () => {
    const res = await request(app).get('/houses');
    const house = res.body[0];
    expect(house).toHaveProperty('id');
    expect(house).toHaveProperty('address');
    expect(house).toHaveProperty('ownerId');
  });
});

describe('GET /houses/:id', () => {
  it('returns a house when it exists', async () => {
    const res = await request(app).get('/houses/house-001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('house-001');
  });

  it('returns 404 when the house does not exist', async () => {
    const res = await request(app).get('/houses/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('HOUSE_NOT_FOUND');
  });
});

describe('GET /houses/:id/readings', () => {
  it('returns readings for a house that has them', async () => {
    const res = await request(app).get('/houses/house-001/readings');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('returns an empty array for a house with no readings', async () => {
    const res = await request(app).get('/houses/house-002/readings');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 404 when the house does not exist', async () => {
    const res = await request(app).get('/houses/does-not-exist/readings');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('HOUSE_NOT_FOUND');
  });

  it('returns readings with expected shape', async () => {
    const res = await request(app).get('/houses/house-001/readings');
    const reading = res.body[0];
    expect(reading).toHaveProperty('id');
    expect(reading).toHaveProperty('houseId');
    expect(reading).toHaveProperty('timestamp');
    expect(reading).toHaveProperty('kwh');
  });

  it('filters readings by inclusive from and to timestamps', async () => {
    const allReadings = await request(app).get('/houses/house-001/readings');
    const selectedReading = allReadings.body[5];

    const res = await request(app)
      .get('/houses/house-001/readings')
      .query({ from: selectedReading.timestamp, to: selectedReading.timestamp });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([selectedReading]);
  });

  it('returns 400 when date filters are not valid ISO timestamps', async () => {
    const res = await request(app)
      .get('/houses/house-001/readings')
      .query({ from: '2026-06-05', to: 'not-a-date' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when from is after to', async () => {
    const res = await request(app)
      .get('/houses/house-001/readings')
      .query({
        from: '2026-06-06T00:00:00.000Z',
        to: '2026-06-05T00:00:00.000Z',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /houses/:id/readings/summary', () => {
  it('returns total, average, count, and daily averages for a house', async () => {
    const res = await request(app).get('/houses/house-001/readings/summary');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(24);
    expect(res.body.total).toBeCloseTo(36.8);
    expect(res.body.average).toBeCloseTo(36.8 / 24);
    expect(res.body.dailyAverages.length).toBeGreaterThan(0);
    expect(res.body.dailyAverages[0]).toMatchObject({
      date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      total: expect.any(Number),
      average: expect.any(Number),
      count: expect.any(Number),
    });
  });

  it('returns an empty summary for a house with no readings', async () => {
    const res = await request(app).get('/houses/house-002/readings/summary');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 0, average: 0, count: 0, dailyAverages: [] });
  });

  it('returns 404 when summary house does not exist', async () => {
    const res = await request(app).get('/houses/does-not-exist/readings/summary');

    expect(res.status).toBe(404);
    expect(res.body.code).toBe('HOUSE_NOT_FOUND');
  });
});

describe('POST /houses/:id/readings', () => {
  it('creates a reading and returns 201 with the created resource', async () => {
    const res = await request(app)
      .post('/houses/house-002/readings')
      .send({ timestamp: '2026-06-05T10:00:00.000Z', kwh: 1.5 });
    expect(res.status).toBe(201);
    expect(res.body.houseId).toBe('house-002');
    expect(res.body.kwh).toBe(1.5);
    expect(res.body.id).toBeDefined();
  });

  it('returns 404 when the house does not exist', async () => {
    const res = await request(app)
      .post('/houses/does-not-exist/readings')
      .send({ timestamp: '2026-06-05T10:00:00.000Z', kwh: 1.5 });
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('HOUSE_NOT_FOUND');
  });

  it('returns 400 when kwh is missing', async () => {
    const res = await request(app)
      .post('/houses/house-002/readings')
      .send({ timestamp: '2026-06-05T10:00:00.000Z' });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when kwh is zero', async () => {
    const res = await request(app)
      .post('/houses/house-002/readings')
      .send({ timestamp: '2026-06-05T10:00:00.000Z', kwh: 0 });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when kwh is negative', async () => {
    const res = await request(app)
      .post('/houses/house-002/readings')
      .send({ timestamp: '2026-06-05T10:00:00.000Z', kwh: -1 });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when kwh is non-finite', async () => {
    const res = await request(app)
      .post('/houses/house-002/readings')
      .set('Content-Type', 'application/json')
      .send('{"timestamp":"2026-06-05T10:00:00.000Z","kwh":1e309}');

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when timestamp is missing', async () => {
    const res = await request(app)
      .post('/houses/house-002/readings')
      .send({ kwh: 1.5 });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when timestamp is not a valid ISO date', async () => {
    const res = await request(app)
      .post('/houses/house-002/readings')
      .send({ timestamp: 'not-a-date', kwh: 1.5 });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when timestamp is a loosely parsed date', async () => {
    const res = await request(app)
      .post('/houses/house-002/readings')
      .send({ timestamp: '2026-02-31T10:00:00.000Z', kwh: 1.5 });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});

describe('EnergyService validation', () => {
  it('rejects direct writes with invalid timestamps or non-finite kwh without changing summaries', () => {
    const before = energyService.getReadingSummaryForHouse('house-002');

    expect(() =>
      energyService.addReading({
        houseId: 'house-002',
        timestamp: 'not-a-date',
        kwh: 1.5,
      }),
    ).toThrow(EnergyValidationError);

    expect(() =>
      energyService.addReading({
        houseId: 'house-002',
        timestamp: '2026-06-05T10:00:00.000Z',
        kwh: Infinity,
      }),
    ).toThrow(EnergyValidationError);

    expect(energyService.getReadingSummaryForHouse('house-002')).toEqual(before);
  });

  it('rejects direct range reads with invalid timestamps or inverted ranges', () => {
    expect(() => energyService.getReadingsForHouseInRange('house-001', '2026-06-05')).toThrow(
      EnergyValidationError,
    );

    expect(() =>
      energyService.getReadingsForHouseInRange(
        'house-001',
        '2026-06-06T00:00:00.000Z',
        '2026-06-05T00:00:00.000Z',
      ),
    ).toThrow(EnergyValidationError);
  });

  it('rejects direct writes when timestamp or kwh are missing at runtime', () => {
    expect(() =>
      energyService.addReading({
        houseId: 'house-002',
        kwh: 1.5,
      } as CreateReadingDto),
    ).toThrow(EnergyValidationError);

    expect(() =>
      energyService.addReading({
        houseId: 'house-002',
        timestamp: '2026-06-05T10:00:00.000Z',
      } as CreateReadingDto),
    ).toThrow(EnergyValidationError);
  });
});

describe('DELETE /readings/:id', () => {
  it('deletes an existing reading and returns 204', async () => {
    const created = await request(app)
      .post('/houses/house-003/readings')
      .send({ timestamp: '2026-06-05T12:00:00.000Z', kwh: 2.0 });
    expect(created.status).toBe(201);

    const res = await request(app).delete(`/readings/${created.body.id}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 when the reading does not exist', async () => {
    const res = await request(app).delete('/readings/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('READING_NOT_FOUND');
  });

  it('confirms the reading is gone after deletion', async () => {
    const created = await request(app)
      .post('/houses/house-003/readings')
      .send({ timestamp: '2026-06-05T13:00:00.000Z', kwh: 3.0 });

    await request(app).delete(`/readings/${created.body.id}`);

    const res = await request(app).delete(`/readings/${created.body.id}`);
    expect(res.status).toBe(404);
  });
});
