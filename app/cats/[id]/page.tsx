// Profil Detail Kucing - Sighting Logs, ulasan jiran, butang "Saya Nampak Kucing Ni Hari Ni!"

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CatCard from "@/components/cats/CatCard";
import SpottingCheckinButton from "@/components/cats/SpottingCheckinButton";

export const dynamic = "force-dynamic";

export default async function CatDetailPage({ params }: { params: { id: string } }) {
  const cat = await prisma.cat.findUnique({
    where: { id: params.id },
    include: {
      sightings: {
        orderBy: { timestamp: "desc" },
        take: 20,
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!cat) return notFound();

  return (
    <main className="min-h-screen p-6 pb-28 text-white space-y-6">
      <div className="flex justify-center">
        <CatCard cat={cat} />
      </div>

      <SpottingCheckinButton catId={cat.id} />

      <section>
        <h2 className="font-bold text-lg mb-2">📋 Sighting Logs</h2>
        {cat.sightings.length === 0 ? (
          <p className="text-slate-400 text-sm">Belum ada sighting direkodkan.</p>
        ) : (
          <ul className="space-y-2">
            {cat.sightings.map((s) => (
              <li key={s.id} className="bg-slate-800 rounded-lg p-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>📍 {s.locationBlock}</span>
                  <span className="text-slate-500">
                    {new Date(s.timestamp).toLocaleDateString("ms-MY")}
                  </span>
                </div>
                {s.note && <p className="mt-1 text-slate-400">&quot;{s.note}&quot;</p>}
                <p className="mt-1 text-xs text-slate-500">oleh {s.user.name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
