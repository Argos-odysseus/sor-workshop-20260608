export type ZoneId = 'P1' | 'P2' | 'P3' | 'EXPRESS';

export interface ParkingZone {
  id: ZoneId;
  name: string;
  pricePerDay: number;
  distanceMinutes: number;
  availableSpots: number;
}

export interface Booking {
  id: string;
  zoneId: ZoneId;
  licensePlate: string;
  arrivalDate: string;
  departureDate: string;
  createdAt: string;
}

export interface BookingDraft {
  zoneId: ZoneId;
  licensePlate: string;
  arrivalDate: string;
  departureDate: string;
}
