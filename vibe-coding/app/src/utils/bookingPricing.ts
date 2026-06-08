import type { ParkingZone } from '../types/Booking';

const MS_PER_DAY = 86_400_000;

interface BookingDayCountOptions {
  minimumDays?: number;
}

export function getBookingDayCount(
  arrivalDate: string,
  departureDate: string,
  options: BookingDayCountOptions = {},
): number {
  if (!arrivalDate || !departureDate) {
    return 0;
  }

  const arrival = new Date(`${arrivalDate}T00:00:00Z`);
  const departure = new Date(`${departureDate}T00:00:00Z`);
  const diffMs = departure.getTime() - arrival.getTime();
  const dayCount = Math.ceil(diffMs / MS_PER_DAY);

  return Math.max(options.minimumDays ?? 0, dayCount);
}

export function getBookingPrice(
  arrivalDate: string,
  departureDate: string,
  zone: ParkingZone | undefined,
  options: BookingDayCountOptions = {},
): number {
  if (!zone) {
    return 0;
  }

  return getBookingDayCount(arrivalDate, departureDate, options) * zone.pricePerDay;
}
