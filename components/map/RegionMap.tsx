"use client";

import { useState } from "react";
import { RARITY_STYLES, type Rarity } from "@/lib/gamification";

export type MapZone = {
  id: string;
  label: string;
  gridArea: string; // cth "1 / 1 / 2 / 2" (CSS grid-area)
  emoji?: string; // ikon zon, cth 🏢 🍚 🅿️
};

export type CatPin = {
  id: string;
  name: string;
  zoneId: string;
  rarity: Rarity;
};

const DEFAULT_ZONES: MapZone[] = [
  { id: "block-a", label: "Block A", gridArea: "1 / 1 / 3 / 2", emoji: "🏢" },
  { id: "block-b", label: "Block B", gridArea: "1 / 2 / 3 / 3", emoji: "🏢" },
  { id: "block-c", label: "Block C", gridArea: "1 / 3 / 3 / 4", emoji: "🏢" },
  { id: "feeder-1", label: "Feeder Spot 1", gridArea: "3 / 1 / 4 / 2", emoji: "🍚" },
  { id: "parking-b1", label: "Parking B1", gridArea: "3 / 2 / 4 / 4", emoji: "🅿️" },
];

export default function RegionMap({
  zones = DEFAULT_ZONES,
  cats,
}: {
  zones?: MapZone[];
  cats: CatPin[];
}) {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const catsInZone = (zoneId: string) => cats.filter((c) => c.zoneId === zoneId);

  return (
    <div className="w-full">
      <div
        className="grid gap-2 w-full aspect-[4/3] max-w-2xl mx-auto"
        style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)" }}
      >
        {zones.map((zone) => {
          const zoneCats = catsInZone(zone.id);
          const isActive = activeZone === zone.id;

          return (
            <button
              key={zone.id}
              style={{ gridArea: zone.gridArea }}
              onClick={() => setActiveZone(isActive ? null : zone.id)}
              className={`relative rounded-xl border-2 flex flex-col items-center justify-center gap-1 p-2 transition-colors ${
                isActive
                  ? "border-amber-400 bg-slate-700"
                  : "border-slate-600 bg-slate-800 hover:border-slate-400"
              }`}
            >
              <span className="text-2xl">{zone.emoji}</span>
              <span className="text-xs text-slate-200 font-medium text-center">
                {zone.label}
              </span>

              {/* Sprite kucing dalam zon */}
              {zoneCats.length > 0 && (
                <div className="absolute -top-2 -right-2 flex -space-x-2">
                  {zoneCats.slice(0, 3).map((cat) => (
                    <span
                      key={cat.id}
                      title={cat.name}
                      className={`w-6 h-6 rounded-full bg-slate-900 border-2 ${RARITY_STYLES[cat.rarity].border} flex items-center justify-center text-xs`}
                    >
                      🐱
                    </span>
                  ))}
                  {zoneCats.length > 3 && (
                    <span className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-500 flex items-center justify-center text-[10px] text-slate-300">
                      +{zoneCats.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Panel info zon aktif */}
      {activeZone && (
        <div className="mt-4 max-w-2xl mx-auto rounded-xl bg-slate-800 border border-slate-600 p-4">
          <h3 className="font-bold text-white mb-2">
            {zones.find((z) => z.id === activeZone)?.label}
          </h3>
          {catsInZone(activeZone).length === 0 ? (
            <p className="text-sm text-slate-400">Tiada sighting kucing di zon ini.</p>
          ) : (
            <ul className="space-y-1">
              {catsInZone(activeZone).map((cat) => (
                <li key={cat.id} className="text-sm text-slate-200 flex items-center gap-2">
                  🐱 {cat.name}
                  <span className={`text-xs ${RARITY_STYLES[cat.rarity].text}`}>
                    ({RARITY_STYLES[cat.rarity].label})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
