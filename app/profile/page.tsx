"use client";

// Profil Pengguna - Level, EXP, Badges (fetch dari /api/session, cipta guest user automatik)
// Boleh edit nama, unit & block sendiri (PATCH /api/session)

import { useEffect, useState } from "react";
import { User as UserIcon, Pencil, Save, X, Loader2 } from "lucide-react";
import { expForNextLevel, expProgress } from "@/lib/gamification";

type SessionUser = {
  id: string;
  name: string;
  level: number;
  exp: number;
  unitNumber: string | null;
  block: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", unitNumber: "", block: "" });
  const [errorMsg, setErrorMsg] = useState("");

  function loadSession() {
    setLoading(true);
    return fetch("/api/session")
      .then((res) => res.json())
      .then((data: SessionUser) => {
        setUser(data);
        setForm({
          name: data.name || "",
          unitNumber: data.unitNumber || "",
          block: data.block || "",
        });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSession();
  }, []);

  function startEdit() {
    if (!user) return;
    setForm({
      name: user.name || "",
      unitNumber: user.unitNumber || "",
      block: user.block || "",
    });
    setErrorMsg("");
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal simpan");
      setUser(data);
      setEditing(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal simpan profil.");
    } finally {
      setSaving(false);
    }
  }

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
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-full bg-gold-shine border-2 border-amber-200/70 flex items-center justify-center shadow-lg shadow-amber-500/40 shrink-0">
            <UserIcon className="w-7 h-7 text-black" />
          </div>

          {!editing ? (
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-display font-bold text-white truncate">
                {user.name}
              </h1>
              <p className="text-slate-400 text-xs">
                {[user.block, user.unitNumber].filter(Boolean).join(" · ") ||
                  "Unit belum didaftarkan"}
              </p>
            </div>
          ) : (
            <div className="flex-1 space-y-2">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nama"
                className="w-full rounded-lg bg-slate-800/80 border border-slate-600 px-3 py-1.5 text-sm outline-none focus:border-amber-400"
              />
              <div className="flex gap-2">
                <input
                  value={form.block}
                  onChange={(e) => setForm((f) => ({ ...f, block: e.target.value }))}
                  placeholder="Block (cth: Block A)"
                  className="w-1/2 rounded-lg bg-slate-800/80 border border-slate-600 px-3 py-1.5 text-xs outline-none focus:border-amber-400"
                />
                <input
                  value={form.unitNumber}
                  onChange={(e) => setForm((f) => ({ ...f, unitNumber: e.target.value }))}
                  placeholder="No. Unit (cth: A-12-3)"
                  className="w-1/2 rounded-lg bg-slate-800/80 border border-slate-600 px-3 py-1.5 text-xs outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {!editing ? (
            <button
              onClick={startEdit}
              className="shrink-0 p-2 rounded-lg bg-slate-800/80 border border-slate-600 text-slate-300 hover:border-amber-400 hover:text-amber-400"
              aria-label="Edit profil"
            >
              <Pencil className="w-4 h-4" />
            </button>
          ) : (
            <div className="shrink-0 flex flex-col gap-1.5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-2 rounded-lg bg-gold-shine border border-amber-200/60 text-black disabled:opacity-60"
                aria-label="Simpan"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="p-2 rounded-lg bg-slate-800/80 border border-slate-600 text-slate-300"
                aria-label="Batal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {errorMsg && <p className="text-red-400 text-xs mt-2">{errorMsg}</p>}
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
