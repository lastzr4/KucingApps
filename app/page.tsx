// Home feed - dashboard gaya phone app (navigasi utama guna BottomNav, bukan senarai link browser)

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CatCardGrid from "@/components/cats/CatCardGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recentCats = await prisma.cat.findMany({
    orderBy: { updatedAt: "desc" },
    take: 4,
  });

  return (
    <main className="min-h-screen p-6 pb-28 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🐱 KucingApps</h1>
        <p className="text-slate-400 text-sm mt-1">
          Rekod, pantau & uruskan populasi kucing komuniti - gamified!
        </p>
      </div>

      <Link
        href="/snap"
        className="block text-center bg-amber-500 text-black font-bold py-3 rounded-xl"
      >
        📸 Snap Kucing Sekarang
      </Link>

      <div>
        <h2 className="font-bold mb-3">Kucing Terkini</h2>
        <CatCardGrid cats={recentCats} />
      </div>
    </main>
  );
}
