import { v4 as uuidv4 } from 'uuid';
import {
  House,
  EnergyReading,
  CreateReadingDto,
  DailyReadingSummary,
  ReadingSummary,
} from '../types/Energy';

const houses: Map<string, House> = new Map([
  [
    'house-001',
    { id: 'house-001', address: '12 Maple Street, Oslo', ownerId: 'owner-a' },
  ],
  [
    'house-002',
    { id: 'house-002', address: '7 Birch Lane, Bergen', ownerId: 'owner-b' },
  ],
  [
    'house-003',
    { id: 'house-003', address: '3 Oak Avenue, Trondheim', ownerId: 'owner-c' },
  ],
]);

// Pre-seed ~24 hourly readings for house-001 covering the last 24 hours
const readings: Map<string, EnergyReading> = new Map();

const seedKwh = [
  0.4, 0.3, 0.3, 0.4, 0.5, 0.7, 1.2, 1.8, 2.1, 1.9, 1.5, 1.4,
  1.6, 1.7, 1.5, 1.4, 1.6, 2.0, 2.5, 3.0, 3.5, 2.8, 1.8, 0.9,
];

const now = new Date();
seedKwh.forEach((kwh, i) => {
  const ts = new Date(now);
  ts.setHours(now.getHours() - (23 - i), 0, 0, 0);
  const reading: EnergyReading = {
    id: `reading-seed-${String(i).padStart(2, '0')}`,
    houseId: 'house-001',
    timestamp: ts.toISOString(),
    kwh,
  };
  readings.set(reading.id, reading);
});

export const energyService = {
  getHouses(): House[] {
    return Array.from(houses.values());
  },

  getHouseById(id: string): House | undefined {
    return houses.get(id);
  },

  getReadingsForHouse(houseId: string): EnergyReading[] {
    return Array.from(readings.values()).filter((r) => r.houseId === houseId);
  },

  getReadingsForHouseInRange(
    houseId: string,
    from?: string,
    to?: string,
  ): EnergyReading[] {
    const fromTime = from ? new Date(from).getTime() : undefined;
    const toTime = to ? new Date(to).getTime() : undefined;

    return this.getReadingsForHouse(houseId).filter((reading) => {
      const readingTime = new Date(reading.timestamp).getTime();
      return (
        (fromTime === undefined || readingTime >= fromTime) &&
        (toTime === undefined || readingTime <= toTime)
      );
    });
  },

  getReadingSummaryForHouse(houseId: string): ReadingSummary {
    const houseReadings = this.getReadingsForHouse(houseId);
    const total = houseReadings.reduce((sum, reading) => sum + reading.kwh, 0);
    const count = houseReadings.length;
    const average = count > 0 ? total / count : 0;
    const dailyReadings = new Map<string, EnergyReading[]>();

    houseReadings.forEach((reading) => {
      const date = reading.timestamp.slice(0, 10);
      const dayReadings = dailyReadings.get(date) ?? [];
      dayReadings.push(reading);
      dailyReadings.set(date, dayReadings);
    });

    const dailyAverages: DailyReadingSummary[] = Array.from(dailyReadings.entries())
      .sort(([leftDate], [rightDate]) => leftDate.localeCompare(rightDate))
      .map(([date, dayReadings]) => {
        const dayTotal = dayReadings.reduce((sum, reading) => sum + reading.kwh, 0);
        const dayCount = dayReadings.length;

        return {
          date,
          total: dayTotal,
          average: dayTotal / dayCount,
          count: dayCount,
        };
      });

    return {
      total,
      average,
      count,
      dailyAverages,
    };
  },

  addReading(dto: CreateReadingDto): EnergyReading {
    const reading: EnergyReading = {
      id: uuidv4(),
      houseId: dto.houseId,
      timestamp: dto.timestamp,
      kwh: dto.kwh,
    };
    readings.set(reading.id, reading);
    return reading;
  },

  deleteReading(id: string): boolean {
    return readings.delete(id);
  },
};
