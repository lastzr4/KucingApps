// Peta Wilayah Interaktif - avatar/sprite kucing mengikut Block/Area
// TODO: gantikan MOCK_MAP_PINS dengan sighting terkini dari prisma.catSighting

import RegionMap from "@/components/map/RegionMap";
import { MOCK_MAP_PINS } from "@/lib/mock-data";

export default function MapPage() {
  return (
    <main className="min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">🗺️ Peta Wilayah</h1>
      <RegionMap cats={MOCK_MAP_PINS} />
    </main>
  );
}
