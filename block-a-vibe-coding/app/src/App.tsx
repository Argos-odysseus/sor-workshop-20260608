import { useState } from 'react';
import { useBookings } from './hooks/useBookings';
import { ZoneCard } from './components/ZoneCard';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import type { ZoneId } from './types/Booking';

export default function App() {
  const { zones, bookings, addBooking, cancelBooking } = useBookings();
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white py-6 px-4">
        <h1 className="text-2xl font-bold">Gardermoen Parkering</h1>
        <p className="text-blue-200 text-sm mt-1">Book parkeringsplass ved Oslo Lufthavn</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-10">

        <section>
          <h2 className="font-semibold text-xl mb-4">Tilgjengelige soner</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                onBook={(id) => setSelectedZoneId(id)}
              />
            ))}
          </div>
        </section>

        <section>
          <BookingForm
            zones={zones}
            selectedZoneId={selectedZoneId}
            onSubmit={(zoneId, licensePlate, arrivalDate, departureDate) => {
              addBooking(zoneId, licensePlate, arrivalDate, departureDate);
              setSelectedZoneId(null);
            }}
          />
        </section>

        {bookings.length > 0 && (
          <section>
            <BookingList
              bookings={bookings}
              zones={zones}
              onCancel={cancelBooking}
            />
          </section>
        )}

      </main>
    </div>
  );
}
