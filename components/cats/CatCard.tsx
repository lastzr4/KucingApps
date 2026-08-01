import { Heart, Smile, Weight, Scissors } from "lucide-react";
import {
  RARITY_STYLES,
  STATUS_LABELS,
  expForNextLevel,
  expProgress,
  type Rarity,
  type CatStatus,
} from "@/lib/gamification";

export type CatCardData = {
  id: string;
  name: string;
  primaryImageUrl?: string | null;
  status: CatStatus;
  rarity: Rarity;
  level: number;
  exp: number;
  cuteness: number;
  friendliness: number;
  chonkiness: number;
  earTipped: boolean;
  currentBlock?: string | null;
};

function StatBar({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-400">{icon}</span>
      <span className="w-16 text-slate-300">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-950/60 rounded-full overflow-hidden ring-1 ring-white/5">
        <div
          className="h-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded-full"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className="w-6 text-right text-slate-400">{value}</span>
    </div>
  );
}

const GLOW_ANIMATION: Partial<Record<Rarity, string>> = {
  LEGENDARY: "animate-glow-legendary",
  EPIC: "animate-glow-epic",
};

export default function CatCard({ cat }: { cat: CatCardData }) {
  const rarity = RARITY_STYLES[cat.rarity];
  const status = STATUS_LABELS[cat.status];
  const progress = expProgress(cat.exp, cat.level);
  const nextLevelExp = expForNextLevel(cat.level);
  const glowAnim = GLOW_ANIMATION[cat.rarity] ?? "";

  return (
    <div
      className={`relative w-64 rounded-2xl border-2 ${rarity.border} bg-gradient-to-b from-slate-800 to-slate-950 shadow-lg ${rarity.glow} ${glowAnim}`}
    >
      {/* Gem level badge - diamond gaya RPG */}
      <div className="absolute -top-3 -right-3 z-20">
        <div className="w-11 h-11 rotate-45 bg-gold-shine border-2 border-amber-200/80 shadow-lg flex items-center justify-center rounded-md">
          <span className="-rotate-45 text-[10px] font-display font-bold text-black tracking-tight">
            Lv{cat.level}
          </span>
        </div>
      </div>

      {/* Ribbon rarity gaya banner permainan */}
      <div
        className={`absolute top-3 left-0 z-10 ${rarity.text} font-display font-bold text-[10px] uppercase tracking-widest bg-black/70 pl-3 pr-5 py-1`}
        style={{ clipPath: "polygon(0 0, 100% 0, 88% 50%, 100% 100%, 0 100%)" }}
      >
        {rarity.label}
      </div>

      {/* Imej kucing + sapuan shine */}
      <div className="relative w-full h-40 rounded-t-2xl overflow-hidden shine-sweep">
        {cat.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cat.primaryImageUrl}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-800">
            🐱
          </div>
        )}
        {cat.earTipped && (
          <div className="absolute bottom-2 right-2 bg-emerald-600/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <Scissors className="w-3 h-3" /> Ear-tipped
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Body kad */}
      <div className="p-3 space-y-2 rounded-b-2xl">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display font-bold text-white uppercase tracking-wide text-sm truncate">
            {cat.name}
          </h3>
          <span
            className={`shrink-0 text-[10px] text-white px-2 py-0.5 rounded-full ${status.badgeClass}`}
          >
            {status.label}
          </span>
        </div>

        {cat.currentBlock && (
          <p className="text-xs text-slate-400">📍 {cat.currentBlock}</p>
        )}

        <div className="space-y-1 pt-1">
          <StatBar icon={<Heart className="w-3 h-3" />} label="Cuteness" value={cat.cuteness} />
          <StatBar icon={<Smile className="w-3 h-3" />} label="Friendly" value={cat.friendliness} />
          <StatBar icon={<Weight className="w-3 h-3" />} label="Chonky" value={cat.chonkiness} />
        </div>

        {/* EXP progress ke level seterusnya */}
        <div className="pt-1">
          <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
            <span className="font-display tracking-wide">EXP</span>
            <span>{cat.exp} / {nextLevelExp}</span>
          </div>
          <div className="h-1.5 bg-slate-950/60 rounded-full overflow-hidden ring-1 ring-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
