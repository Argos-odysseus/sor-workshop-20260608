import { useState } from 'react';
import { useBookings } from './hooks/useBookings';
import { ZoneCard } from './components/ZoneCard';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import type { ZoneId } from './types/Booking';

export default function App() {
  const { zones, bookings, addBooking, cancelBooking } = useBookings();
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId>('P1');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 px-4 py-6 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold">Gardermoen Parkering</h1>
          <p className="mt-1 text-sm text-blue-200">Book parkeringsplass ved Oslo Lufthavn</p>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
        <section>
          <div className="mb-4 flex flex-col gap-1">
            <p className="text-sm font-medium text-blue-700">Velg parkering</p>
            <h2 className="text-xl font-semibold text-gray-950">Tilgjengelige soner</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                isSelected={zone.id === selectedZoneId}
                onBook={setSelectedZoneId}
              />
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <BookingForm
            zones={zones}
            selectedZoneId={selectedZoneId}
            onSelectedZoneChange={setSelectedZoneId}
            onSubmit={addBooking}
          />
          <BookingList bookings={bookings} zones={zones} onCancel={cancelBooking} />
        </div>
      </main>
    </div>
  );
}
