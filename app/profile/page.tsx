"use client";

// Profil Pengguna - Level, EXP, Badges (fetch dari /api/session, cipta guest user automatik)

import { useEffect, useState } from "react";
import { User as UserIcon } from "lucide-react";
import { expForNextLevel, expProgress } from "@/lib/gamification";

type SessionUser = {
  id: string;
  name: string;
  level: number;
  exp: number;
  unitNumber: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-6 pb-28 text-white">
        <p className="text-slate-400">Memuatkan profil...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen p-6 pb-28 text-white">
        <p className="text-red-400">Gagal memuatkan profil. Sila refresh.</p>
      </main>
    );
  }

  const progress = expProgress(user.exp, user.level);

  return (
    <main className="min-h-screen p-6 pb-28 text-white space-y-4">
      {/* Header profil gaya RPG */}
      <div className="relative rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-5 overflow-hidden shine-sweep">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gold-shine border-2 border-amber-200/70 flex items-center justify-center shadow-lg shadow-amber-500/40 shrink-0">
            <UserIcon className="w-7 h-7 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">{user.name}</h1>
            <p className="text-slate-400 text-xs">
              {user.unitNumber || "Unit belum didaftarkan"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-amber-400/20 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-1 font-display">
          <span className="text-amber-400 font-bold">LEVEL {user.level}</span>
          <span className="text-slate-300">
            {user.exp} / {expForNextLevel(user.level)} EXP
          </span>
        </div>
        <div className="h-2.5 bg-slate-950/60 rounded-full overflow-hidden ring-1 ring-white/5">
          <div
            className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div>
        <h2 className="font-display font-bold uppercase tracking-wide text-sm text-amber-400 mb-2">
          🏅 Lencana
        </h2>
        <p className="text-slate-400 text-sm">
          Belum ada lencana. Mula snap kucing untuk dapatkan lencana pertama!
        </p>
      </div>
    </main>
  );
}
