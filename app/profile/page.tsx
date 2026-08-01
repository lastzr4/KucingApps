"use client";

// Profil Pengguna - Level, EXP, Badges (fetch dari /api/session, cipta guest user automatik)

import { useEffect, useState } from "react";
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
      <div>
        <h1 className="text-2xl font-bold">👤 {user.name}</h1>
        <p className="text-slate-400 text-sm">{user.unitNumber || "Unit belum didaftarkan"}</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Level {user.level}</span>
          <span>
            {user.exp} / {expForNextLevel(user.level)} EXP
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div>
        <h2 className="font-bold mb-2">🏅 Lencana</h2>
        <p className="text-slate-400 text-sm">
          Belum ada lencana. Mula snap kucing untuk dapatkan lencana pertama!
        </p>
      </div>
    </main>
  );
}
