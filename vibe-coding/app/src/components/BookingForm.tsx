import { useState } from 'react';
import type { ParkingZone, ZoneId } from '../types/Booking';

interface BookingFormProps {
  zones: ParkingZone[];
  selectedZoneId: ZoneId | null;
  onSubmit: (zoneId: ZoneId, licensePlate: string, arrivalDate: string, departureDate: string) => void;
}

export function BookingForm({ zones, selectedZoneId, onSubmit }: BookingFormProps) {
  const [zoneId, setZoneId] = useState<ZoneId>(selectedZoneId ?? zones[0].id);
  const [licensePlate, setLicensePlate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  // Sync if parent changes selectedZoneId
  if (selectedZoneId !== null && selectedZoneId !== zoneId) {
    setZoneId(selectedZoneId);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!licensePlate || !arrivalDate || !departureDate) return;
    onSubmit(zoneId, licensePlate, arrivalDate, departureDate);
    setLicensePlate('');
    setArrivalDate('');
    setDepartureDate('');
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded p-4 bg-white shadow-sm flex flex-col gap-3 max-w-md">
      <h2 className="font-semibold text-xl">Ny bestilling</h2>

      <label className="flex flex-col gap-1 text-sm">
        Sone
        <select
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value as ZoneId)}
          className="border rounded px-2 py-1"
        >
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Registreringsnummer
        <input
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          placeholder="AB12345"
          className="border rounded px-2 py-1 uppercase"
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Ankomstdato
        <input
          type="date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Avreisedato
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        Bekreft bestilling
      </button>
    </form>
  );
}
