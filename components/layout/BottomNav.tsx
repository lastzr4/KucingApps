"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, LayoutGrid, Camera, Trophy, User } from "lucide-react";
import { playClick } from "@/lib/sound";

type Tab = {
  href: string;
  label: string;
  icon: typeof Map;
  isCenter: boolean;
};

const TABS: Tab[] = [
  { href: "/map", label: "Peta", icon: Map, isCenter: false },
  { href: "/cats", label: "Koleksi", icon: LayoutGrid, isCenter: false },
  { href: "/snap", label: "Snap", icon: Camera, isCenter: true },
  { href: "/quests", label: "Misi", icon: Trophy, isCenter: false },
  { href: "/profile", label: "Saya", icon: User, isCenter: false },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto relative">
        {/* garis emas nipis di atas nav */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
        <div className="bg-slate-950/95 backdrop-blur border-t border-slate-800 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around px-2 py-2">
            {TABS.map(({ href, label, icon: Icon, isCenter }) => {
              const active = pathname === href || pathname?.startsWith(href + "/");

              if (isCenter) {
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => playClick()}
                    className="relative flex flex-col items-center -mt-7"
                  >
                    <span className="absolute inset-0 rounded-full animate-fab-ring" />
                    <span className="relative w-14 h-14 rounded-full bg-gold-shine border-2 border-amber-200/70 flex items-center justify-center shadow-lg shadow-amber-500/50">
                      <Icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => playClick()}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                    active ? "text-amber-400" : "text-slate-500"
                  }`}
                >
                  <Icon
                    className="w-5 h-5"
                    style={active ? { filter: "drop-shadow(0 0 6px rgba(245,158,11,0.8))" } : undefined}
                  />
                  <span className={`text-[10px] font-display ${active ? "font-bold" : ""}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
