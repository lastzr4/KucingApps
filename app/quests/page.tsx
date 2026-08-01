// Misi Komuniti & EXP - Feeder Spots, Supply Drop, badge tracking

import { prisma } from "@/lib/prisma";
import FeederSpotCard from "@/components/quests/FeederSpotCard";

export const dynamic = "force-dynamic";

export default async function QuestsPage() {
  const feederSpots = await prisma.feederSpot.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen p-6 pb-28 text-white">
      <h1 className="text-2xl font-display font-bold uppercase tracking-wide mb-4">
        🎯 Misi Komuniti
      </h1>

      <h2 className="font-display font-bold uppercase tracking-wide mb-2 text-sm text-amber-400">
        🍚 Feeder Spots
      </h2>
      {feederSpots.length === 0 ? (
        <p className="text-slate-400 text-sm">
          Belum ada Feeder Spot didaftarkan lagi.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {feederSpots.map((spot) => (
            <FeederSpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </main>
  );
}
