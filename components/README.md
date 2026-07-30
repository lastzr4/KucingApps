# /components

Struktur cadangan untuk Fasa 3 (UI Gamified):

```
components/
  cats/
    CatCard.tsx          # Kad RPG - Rarity border, EXP tag, stats
    CatCardGrid.tsx
  map/
    RegionMap.tsx        # Peta wilayah (Leaflet.js / Custom SVG Grid)
    CatSprite.tsx
  snap/
    SnapTagForm.tsx       # Camera API + upload
  quests/
    QuestList.tsx
    FeederSpotCard.tsx
  profile/
    UserLevelBadge.tsx
  ui/
    Button.tsx, Badge.tsx, ... (elemen kongsi)
```

Setiap komponen guna Tailwind CSS sahaja (tiada CSS-in-JS) dan icon dari `lucide-react`.
