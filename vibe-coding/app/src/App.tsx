import { useBookings } from './hooks/useBookings';
import { ZoneCard } from './components/ZoneCard';

export default function App() {
  const { zones } = useBookings();

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
                onBook={() => {}}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
