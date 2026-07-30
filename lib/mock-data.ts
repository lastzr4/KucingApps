import type { CatCardData } from "@/components/cats/CatCard";
import type { CatPin } from "@/components/map/RegionMap";

// Data contoh - gantikan dengan query Prisma (prisma.cat.findMany()) di Fasa 4
export const MOCK_CATS: CatCardData[] = [
  {
    id: "1",
    name: "Oyen",
    primaryImageUrl: null,
    status: "STRAY_GUARDIAN",
    rarity: "RARE",
    level: 4,
    exp: 250,
    cuteness: 82,
    friendliness: 65,
    chonkiness: 70,
    earTipped: true,
    currentBlock: "Block A",
  },
  {
    id: "2",
    name: "Comel",
    primaryImageUrl: null,
    status: "OWNED",
    rarity: "COMMON",
    level: 2,
    exp: 90,
    cuteness: 95,
    friendliness: 90,
    chonkiness: 40,
    earTipped: false,
    currentBlock: "Block B",
  },
  {
    id: "3",
    name: "Blackie",
    primaryImageUrl: null,
    status: "TNR",
    rarity: "LEGENDARY",
    level: 8,
    exp: 640,
    cuteness: 70,
    friendliness: 55,
    chonkiness: 88,
    earTipped: true,
    currentBlock: "Feeder Spot 1",
  },
];

export const MOCK_MAP_PINS: CatPin[] = [
  { id: "1", name: "Oyen", zoneId: "block-a", rarity: "RARE" },
  { id: "2", name: "Comel", zoneId: "block-b", rarity: "COMMON" },
  { id: "3", name: "Blackie", zoneId: "feeder-1", rarity: "LEGENDARY" },
];
