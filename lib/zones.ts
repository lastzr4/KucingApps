// Sumber tunggal untuk padanan Block/Area <-> zoneId Peta Wilayah
// Guna oleh SnapTagForm (pilihan lokasi) & Map page (susun sighting ikut zon)

export type BlockOption = { label: string; zoneId: string };

export const BLOCKS: BlockOption[] = [
  { label: "Block A", zoneId: "block-a" },
  { label: "Block B", zoneId: "block-b" },
  { label: "Block C", zoneId: "block-c" },
  { label: "Feeder Spot 1", zoneId: "feeder-1" },
  { label: "Parking B1", zoneId: "parking-b1" },
];

export function blockLabelToZoneId(label?: string | null): string {
  return BLOCKS.find((b) => b.label === label)?.zoneId ?? "block-a";
}
