// Koleksi Kad Kucing (Cat RPG Collection) - data sebenar dari Postgres via Prisma

import CatCardGrid from "@/components/cats/CatCardGrid";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CatsCollectionPage() {
  const cats = await prisma.cat.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen p-6 pb-28 text-white">
      <h1 className="text-2xl font-bold mb-4">🃏 Koleksi Kad Kucing</h1>
      <CatCardGrid cats={cats} />
    </main>
  );
}
