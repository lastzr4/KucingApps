// Peta Wilayah Interaktif - sighting terkini dari Postgres via Prisma

import RegionMap from "@/components/map/RegionMap";
import { prisma } from "@/lib/prisma";
import { blockLabelToZoneId } from "@/lib/zones";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const cats = await prisma.cat.findMany({
    where: { currentBlock: { not: null } },
  });

  const pins = cats.map((cat) => ({
    id: cat.id,
    name: cat.name,
    zoneId: blockLabelToZoneId(cat.currentBlock),
    rarity: cat.rarity,
  }));

  return (
    <main className="min-h-screen p-6 pb-28 text-white">
      <h1 className="text-2xl font-bold mb-4">🗺️ Peta Wilayah</h1>
      <RegionMap cats={pins} />
    </main>
  );
}
