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
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-slate-300 to-white rounded-full"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className="w-6 text-right text-slate-400">{value}</span>
    </div>
  );
}

export default function CatCard({ cat }: { cat: CatCardData }) {
  const rarity = RARITY_STYLES[cat.rarity];
  const status = STATUS_LABELS[cat.status];
  const progress = expProgress(cat.exp, cat.level);
  const nextLevelExp = expForNextLevel(cat.level);

  return (
    <div
      className={`relative w-64 rounded-2xl border-2 ${rarity.border} bg-slate-900 shadow-lg ${rarity.glow} overflow-hidden`}
    >
      {/* Rarity ribbon */}
      <div
        className={`absolute top-2 left-2 z-10 text-[10px] font-bold uppercase tracking-wide ${rarity.text} bg-black/60 px-2 py-0.5 rounded-full`}
      >
        {rarity.label}
      </div>

      {/* EXP badge */}
      <div className="absolute top-2 right-2 z-10 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full">
        Lv.{cat.level}
      </div>

      {/* Imej kucing */}
      <div className="relative w-full h-40 bg-slate-800">
        {cat.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cat.primaryImageUrl}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🐱
          </div>
        )}
        {cat.earTipped && (
          <div className="absolute bottom-2 right-2 bg-emerald-600/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <Scissors className="w-3 h-3" /> Ear-tipped
          </div>
        )}
      </div>

      {/* Body kad */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white truncate">{cat.name}</h3>
          <span
            className={`text-[10px] text-white px-2 py-0.5 rounded-full ${status.badgeClass}`}
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
            <span>EXP</span>
            <span>{cat.exp} / {nextLevelExp}</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
