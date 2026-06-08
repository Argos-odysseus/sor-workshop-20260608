export interface House {
  id: string;
  address: string;
  ownerId: string;
}

export interface EnergyReading {
  id: string;
  houseId: string;
  timestamp: string; // ISO datetime
  kwh: number;       // consumption in that hour
}

export interface CreateReadingDto {
  houseId: string;
  timestamp: string;
  kwh: number;
}

export interface DailyReadingSummary {
  date: string;
  total: number;
  average: number;
  count: number;
}

export interface ReadingSummary {
  total: number;
  average: number;
  count: number;
  dailyAverages: DailyReadingSummary[];
}
