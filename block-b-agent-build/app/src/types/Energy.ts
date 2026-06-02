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
