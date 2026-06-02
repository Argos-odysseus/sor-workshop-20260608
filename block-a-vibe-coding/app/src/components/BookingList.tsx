import type { Booking, ParkingZone } from '../types/Booking';

interface BookingListProps {
  bookings: Booking[];
  zones: ParkingZone[];
  onCancel: (id: string) => void;
}

export function BookingList({ bookings, zones, onCancel }: BookingListProps) {
  function zoneName(zoneId: string): string {
    return zones.find((z) => z.id === zoneId)?.name ?? zoneId;
  }

  return (
    <div>
      <h2 className="font-semibold text-xl mb-3">Dine bestillinger</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-3 py-2">Sone</th>
              <th className="border px-3 py-2">Regnr.</th>
              <th className="border px-3 py-2">Ankomst</th>
              <th className="border px-3 py-2">Avreise</th>
              <th className="border px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="even:bg-gray-50">
                <td className="border px-3 py-2">{zoneName(booking.zoneId)}</td>
                <td className="border px-3 py-2">{booking.licensePlate}</td>
                <td className="border px-3 py-2">{booking.arrivalDate}</td>
                <td className="border px-3 py-2">{booking.departureDate}</td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => onCancel(booking.id)}
                    className="text-red-600 hover:underline"
                  >
                    Avbestill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
