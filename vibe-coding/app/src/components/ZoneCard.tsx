import type { ParkingZone } from '../types/Booking';

interface ZoneCardProps {
  zone: ParkingZone;
  onBook: (zoneId: ParkingZone['id']) => void;
  isSelected: boolean;
}

export function ZoneCard({ zone, onBook, isSelected }: ZoneCardProps) {
  const isAlmostFull = zone.availableSpots < 10;

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-950">{zone.name}</h3>
        {isAlmostFull ? (
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
            Få igjen
          </span>
        ) : null}
      </div>
      <p className="text-gray-600 text-sm">{zone.distanceMinutes} min gange til terminal</p>
      <p className="text-gray-800 font-medium">{zone.pricePerDay} kr / dag</p>
      <p className={`text-sm ${isAlmostFull ? 'font-medium text-amber-700' : 'text-gray-500'}`}>
        {zone.availableSpots} ledige plasser
      </p>
      <button
        onClick={() => onBook(zone.id)}
        className="mt-auto rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {isSelected ? 'Valgt' : 'Velg sone'}
      </button>
    </div>
  );
}
