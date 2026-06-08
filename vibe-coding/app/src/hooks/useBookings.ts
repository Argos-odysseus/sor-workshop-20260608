import { useState } from 'react';
import type { Booking, BookingDraft, ParkingZone } from '../types/Booking';

const INITIAL_ZONES: ParkingZone[] = [
  {
    id: 'P1',
    name: 'P1 – Langtidsparkering',
    pricePerDay: 99,
    distanceMinutes: 15,
    availableSpots: 142,
  },
  {
    id: 'P2',
    name: 'P2 – Langtidsparkering',
    pricePerDay: 149,
    distanceMinutes: 10,
    availableSpots: 87,
  },
  {
    id: 'P3',
    name: 'P3 – Korttidsparkering',
    pricePerDay: 199,
    distanceMinutes: 6,
    availableSpots: 34,
  },
  {
    id: 'EXPRESS',
    name: 'Express – Terminalparking',
    pricePerDay: 349,
    distanceMinutes: 2,
    availableSpots: 12,
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-001',
    zoneId: 'P1',
    licensePlate: 'AB12345',
    arrivalDate: '2026-06-10',
    departureDate: '2026-06-17',
    createdAt: '2026-06-01T08:00:00Z',
  },
  {
    id: 'bk-002',
    zoneId: 'EXPRESS',
    licensePlate: 'EF67890',
    arrivalDate: '2026-06-12',
    departureDate: '2026-06-14',
    createdAt: '2026-06-01T09:30:00Z',
  },
];

export function useBookings() {
  const [baseZones] = useState<ParkingZone[]>(INITIAL_ZONES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const zones = baseZones.map((zone) => ({
    ...zone,
    availableSpots: Math.max(
      0,
      zone.availableSpots - bookings.filter((booking) => booking.zoneId === zone.id).length,
    ),
  }));

  function addBooking(draft: BookingDraft): void {
    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      zoneId: draft.zoneId,
      licensePlate: draft.licensePlate.toUpperCase(),
      arrivalDate: draft.arrivalDate,
      departureDate: draft.departureDate,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
  }

  function cancelBooking(id: string): void {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  return { zones, bookings, addBooking, cancelBooking };
}
