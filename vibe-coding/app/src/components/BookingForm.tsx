import { FormEvent, useMemo, useState } from 'react';
import type { BookingDraft, ParkingZone, ZoneId } from '../types/Booking';
import { getBookingDayCount, getBookingPrice } from '../utils/bookingPricing';

interface BookingFormProps {
  zones: ParkingZone[];
  selectedZoneId: ZoneId;
  onSelectedZoneChange: (zoneId: ZoneId) => void;
  onSubmit: (draft: BookingDraft) => void;
}

interface FormErrors {
  licensePlate?: string;
  arrivalDate?: string;
  departureDate?: string;
  zoneId?: string;
}

const platePattern = /^[A-Z]{2}\d{5}$/;

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function BookingForm({
  zones,
  selectedZoneId,
  onSelectedZoneChange,
  onSubmit,
}: BookingFormProps) {
  const today = toDateOnly(new Date());
  const [licensePlate, setLicensePlate] = useState('');
  const [arrivalDate, setArrivalDate] = useState(today);
  const [departureDate, setDepartureDate] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? zones[0];
  const dayCount = getBookingDayCount(arrivalDate, departureDate);
  const estimate = getBookingPrice(arrivalDate, departureDate, selectedZone);

  const sortedZones = useMemo(
    () => [...zones].sort((left, right) => left.pricePerDay - right.pricePerDay),
    [zones],
  );

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    const normalizedPlate = licensePlate.trim().toUpperCase();

    if (!selectedZone) {
      nextErrors.zoneId = 'Velg en parkeringssone.';
    } else if (selectedZone.availableSpots <= 0) {
      nextErrors.zoneId = 'Valgt sone er full.';
    }

    if (!platePattern.test(normalizedPlate)) {
      nextErrors.licensePlate = 'Registreringsnummer må være på formatet AB12345.';
    }

    if (!arrivalDate) {
      nextErrors.arrivalDate = 'Velg ankomstdato.';
    } else if (arrivalDate < today) {
      nextErrors.arrivalDate = 'Ankomst kan ikke være i fortiden.';
    }

    if (!departureDate) {
      nextErrors.departureDate = 'Velg avreisedato.';
    } else if (arrivalDate && departureDate <= arrivalDate) {
      nextErrors.departureDate = 'Avreise må være minst én dag etter ankomst.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !selectedZone) {
      return;
    }

    onSubmit({
      zoneId: selectedZone.id,
      licensePlate: licensePlate.trim().toUpperCase(),
      arrivalDate,
      departureDate,
    });
    setLicensePlate('');
    setDepartureDate('');
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-blue-700">Ny booking</p>
        <h2 className="text-xl font-semibold text-gray-950">Reserver parkering</h2>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Sone
          <select
            value={selectedZoneId}
            onChange={(event) => onSelectedZoneChange(event.target.value as ZoneId)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {sortedZones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} · {zone.pricePerDay} kr/dag
              </option>
            ))}
          </select>
          {errors.zoneId ? <span className="text-xs text-red-600">{errors.zoneId}</span> : null}
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Registreringsnummer
          <input
            value={licensePlate}
            onChange={(event) => setLicensePlate(event.target.value.toUpperCase())}
            placeholder="AB12345"
            className="rounded-md border border-gray-300 px-3 py-2 uppercase text-gray-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {errors.licensePlate ? (
            <span className="text-xs text-red-600">{errors.licensePlate}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Ankomst
          <input
            type="date"
            min={today}
            value={arrivalDate}
            onChange={(event) => setArrivalDate(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {errors.arrivalDate ? (
            <span className="text-xs text-red-600">{errors.arrivalDate}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Avreise
          <input
            type="date"
            min={arrivalDate || today}
            value={departureDate}
            onChange={(event) => setDepartureDate(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {errors.departureDate ? (
            <span className="text-xs text-red-600">{errors.departureDate}</span>
          ) : null}
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-md bg-blue-50 p-4 text-sm text-blue-950 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">{selectedZone?.name}</p>
          <p className="text-blue-700">
            {dayCount > 0 ? `${dayCount} døgn × ${selectedZone?.pricePerDay} kr` : 'Velg datoer for prisestimat'}
          </p>
        </div>
        <p className="text-2xl font-bold">{estimate > 0 ? `${estimate} kr` : '—'}</p>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        Bekreft booking
      </button>
    </form>
  );
}
