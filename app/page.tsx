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
      {/* Hero banner gaya game */}
      <div className="relative rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-5 overflow-hidden shine-sweep">
        <p className="text-[10px] font-display uppercase tracking-[0.3em] text-amber-400">
          Komuniti Apartment
        </p>
        <h1 className="text-3xl font-display font-black mt-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
          KucingApps
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-[85%]">
          Snap, kutip EXP, dan jadi legenda penjaga kucing komuniti anda!
        </p>
      </div>

      <Link
        href="/snap"
        className="block text-center bg-gold-shine text-black font-display font-bold uppercase tracking-wide py-3.5 rounded-xl shadow-lg shadow-amber-500/30 border border-amber-200/60"
      >
        📸 Snap Kucing Sekarang
      </Link>

      <div>
        <h2 className="font-display font-bold uppercase tracking-wide text-sm text-slate-300 mb-3">
          🔥 Kucing Terkini
        </h2>
        <CatCardGrid cats={recentCats} />
      </div>
    </main>
  );
}
