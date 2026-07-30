# 🐱 KucingApps

PWA gamified untuk komuniti apartment merekod, memantau & menguruskan populasi kucing (peliharaan & liar).

## Status: Fasa 1 selesai — Skema Database & Struktur Projek

### Tech Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + Lucide Icons + next-pwa
- **Database:** PostgreSQL (Railway) via Prisma ORM
- **Storan Imej:** Cloudinary / Supabase Storage
- **Repo/CI:** GitLab + GitLab CI/CD → Railway.app

### Struktur Projek

```
KucingApps/
├── app/
│   ├── layout.tsx            # Root layout + PWA metadata
│   ├── page.tsx               # Laman utama
│   ├── globals.css
│   ├── map/page.tsx           # Peta Wilayah Interaktif
│   ├── cats/page.tsx          # Koleksi Kad Kucing
│   ├── cats/[id]/page.tsx     # Profil Detail Kucing
│   ├── snap/page.tsx          # Snap & Tag Form
│   ├── quests/page.tsx        # Misi Komuniti
│   └── profile/page.tsx       # Profil Pengguna (Level/EXP/Badge)
├── components/                # Komponen UI (Fasa 3)
├── lib/
│   └── prisma.ts              # Prisma client singleton
├── prisma/
│   └── schema.prisma          # Skema DB: User, Cat, CatSighting, FeederSpot, Badge, Donation
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # Icon PWA (192/512)
├── .env.example
├── next.config.js             # next-pwa (service worker)
├── tailwind.config.ts
└── package.json
```

### Skema Database (ringkasan)

| Jadual | Kandungan |
|---|---|
| `users` | level, exp, totalDonation, unitNumber, block, relasi ke badges/sightings |
| `badges` / `user_badges` | Wira Snapshot, Detektif Bulu, Pakar TNR, dll. |
| `cats` | status (OWNED/STRAY_GUARDIAN/TNR/EMERGENCY), rarity, stats (cuteness/friendliness/chonkiness), earTipped, level/exp kucing |
| `cat_sightings` | catId, userId, locationBlock, imageUrl, timestamp, note |
| `feeder_spots` / `feeder_refill_logs` | lokasi, status bekalan, sejarah isi semula |
| `donations` | mata "Penderma Komuniti" — food/litter/medical/affiliate |

### Setup Pembangunan Tempatan

```bash
npm install
cp .env.example .env       # isi DATABASE_URL, dll.
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### Roadmap Seterusnya
- **Fasa 2:** Pipeline GitLab CI/CD → Railway (env vars, auto-deploy on push)
- **Fasa 3:** Komponen UI gamified — `CatCard`, `SnapTagForm`, `RegionMap`
- **Fasa 4:** Sistem EXP/badge automation + integrasi affiliate/Group Buy
