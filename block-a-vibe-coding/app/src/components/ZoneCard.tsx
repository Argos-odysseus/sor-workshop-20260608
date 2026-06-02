import type { ParkingZone } from '../types/Booking';

interface ZoneCardProps {
  zone: ParkingZone;
  onBook: (zoneId: ParkingZone['id']) => void;
}

export function ZoneCard({ zone, onBook }: ZoneCardProps) {
  return (
    <div className="border rounded p-4 flex flex-col gap-2 bg-white shadow-sm">
      <h3 className="font-semibold text-lg">{zone.name}</h3>
      <p className="text-gray-600 text-sm">{zone.distanceMinutes} min gange til terminal</p>
      <p className="text-gray-800 font-medium">{zone.pricePerDay} kr / dag</p>
      <p className="text-sm text-gray-500">{zone.availableSpots} ledige plasser</p>
      <button
        onClick={() => onBook(zone.id)}
        className="mt-auto bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 text-sm"
      >
        Book
      </button>
    </div>
  );
}
