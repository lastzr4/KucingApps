import Link from "next/link";

const NAV = [
  { href: "/map", label: "🗺️ Peta Wilayah" },
  { href: "/cats", label: "🃏 Koleksi Kad Kucing" },
  { href: "/snap", label: "📸 Snap & Tag" },
  { href: "/quests", label: "🎯 Misi Komuniti" },
  { href: "/profile", label: "👤 Profil Saya" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-white">
      <h1 className="text-3xl font-bold">🐱 KucingApps</h1>
      <p className="text-slate-400 text-center max-w-md text-sm">
        Rekod, pantau & uruskan populasi kucing komuniti - gamified!
      </p>
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl bg-slate-800 border border-slate-600 hover:border-amber-400 px-4 py-3 text-center font-medium"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
