export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type CatStatus = "OWNED" | "STRAY_GUARDIAN" | "TNR" | "EMERGENCY";

export const RARITY_STYLES: Record<
  Rarity,
  { label: string; border: string; glow: string; text: string }
> = {
  COMMON: {
    label: "Common",
    border: "border-slate-400",
    glow: "shadow-slate-400/30",
    text: "text-slate-300",
  },
  UNCOMMON: {
    label: "Uncommon",
    border: "border-green-500",
    glow: "shadow-green-500/40",
    text: "text-green-400",
  },
  RARE: {
    label: "Rare",
    border: "border-blue-500",
    glow: "shadow-blue-500/40",
    text: "text-blue-400",
  },
  EPIC: {
    label: "Epic",
    border: "border-purple-500",
    glow: "shadow-purple-500/50",
    text: "text-purple-400",
  },
  LEGENDARY: {
    label: "Legendary",
    border: "border-amber-400",
    glow: "shadow-amber-400/60",
    text: "text-amber-300",
  },
};

export const STATUS_LABELS: Record<CatStatus, { label: string; badgeClass: string }> = {
  OWNED: { label: "Ada Tuan", badgeClass: "bg-sky-600" },
  STRAY_GUARDIAN: { label: "Penjaga Blok", badgeClass: "bg-slate-600" },
  TNR: { label: "TNR", badgeClass: "bg-emerald-600" },
  EMERGENCY: { label: "Kecemasan", badgeClass: "bg-red-600" },
};

/** EXP diperlukan untuk naik ke level seterusnya (curve mudah). */
export function expForNextLevel(level: number): number {
  return level * 100;
}

export function expProgress(exp: number, level: number): number {
  const needed = expForNextLevel(level);
  return Math.min(100, Math.round((exp / needed) * 100));
}

/** Tambah EXP dan kira level baru (naik level ikut expForNextLevel). */
export function applyExpGain(
  currentLevel: number,
  currentExp: number,
  gained: number
): { level: number; exp: number } {
  let level = currentLevel;
  let exp = currentExp + gained;

  while (exp >= expForNextLevel(level)) {
    exp -= expForNextLevel(level);
    level += 1;
  }

  return { level, exp };
}
