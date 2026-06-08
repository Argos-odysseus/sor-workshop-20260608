import type { Booking, ParkingZone } from '../types/Booking';
import { getBookingDayCount, getBookingPrice } from '../utils/bookingPricing';

interface BookingListProps {
  bookings: Booking[];
  zones: ParkingZone[];
  onCancel: (id: string) => void;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('nb-NO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function BookingList({ bookings, zones, onCancel }: BookingListProps) {
  const zoneById = new Map(zones.map((zone) => [zone.id, zone]));

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-700">Mine reservasjoner</p>
          <h2 className="text-xl font-semibold text-gray-950">Aktive bookinger</h2>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {bookings.length} aktive
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">
          Ingen aktive bookinger ennå.
        </div>
      ) : (
        <div className="grid gap-3">
          {bookings.map((booking) => {
            const zone = zoneById.get(booking.zoneId);
            const days = getBookingDayCount(booking.arrivalDate, booking.departureDate, {
              minimumDays: 1,
            });
            const price = getBookingPrice(booking.arrivalDate, booking.departureDate, zone, {
              minimumDays: 1,
            });

            return (
              <article
                key={booking.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-950">{booking.licensePlate}</h3>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {zone?.name ?? booking.zoneId}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatDate(booking.arrivalDate)} til {formatDate(booking.departureDate)} · {days}{' '}
                      døgn
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <p className="text-lg font-bold text-gray-950">{price} kr</p>
                    <button
                      type="button"
                      onClick={() => onCancel(booking.id)}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      Avbestill
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
