// Koleksi Kad Kucing (Cat RPG Collection)
// TODO: gantikan MOCK_CATS dengan query sebenar prisma.cat.findMany()

import CatCardGrid from "@/components/cats/CatCardGrid";
import { MOCK_CATS } from "@/lib/mock-data";

export default function CatsCollectionPage() {
  return (
    <main className="min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">🃏 Koleksi Kad Kucing</h1>
      <CatCardGrid cats={MOCK_CATS} />
    </main>
  );
}
