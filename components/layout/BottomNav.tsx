"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, LayoutGrid, Camera, Trophy, User } from "lucide-react";

const TABS = [
  { href: "/map", label: "Peta", icon: Map },
  { href: "/cats", label: "Koleksi", icon: LayoutGrid },
  { href: "/snap", label: "Snap", icon: Camera, isCenter: true },
  { href: "/quests", label: "Misi", icon: Trophy },
  { href: "/profile", label: "Saya", icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur border-t border-slate-700 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-2 py-2">
          {TABS.map(({ href, label, icon: Icon, isCenter }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");

            if (isCenter) {
              return (
                <Link key={href} href={href} className="flex flex-col items-center -mt-6">
                  <span className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
                    <Icon className="w-6 h-6 text-black" />
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${
                  active ? "text-amber-400" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
