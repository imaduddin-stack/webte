# te-upgris — Website Program Studi Teknik Elektro UPGRIS

React 18 + Vite 5 SPA dengan data dinamis dari GitHub.

## Quick Start

```bash
npm install
npm run dev        # Development (dummy data, no network)
npm run build      # Production build (fetches from GitHub)
npm run preview    # Preview production build locally
```

## Mode Data

| Mode | Sumber Data | Network |
|------|------------|---------|
| `development` | `src/data/dummy/*.json` (lokal) | ❌ Tidak ada |
| `production` | GitHub raw content API | ✅ Fetch saat load |

## Fitur v3.0
- ★ **Parallax Slideshow** — 4 slide otomatis + parallax scroll di beranda
- ★ **Halaman Capstone Design** — showcase proyek mahasiswa per angkatan
- ★ **Link RPS** — setiap MK di kurikulum memiliki tombol link RPS
- ★ **Video Profil Prodi** — YouTube embed di beranda
- ★ **Berita dengan Gambar** — hero image di list & detail
- ★ **Logo UPGRIS** — ganti placeholder di `Navbar.jsx` dengan `<img src="/logo-upgris.svg" />`

## Struktur

```
src/
├── config/env.js          ← DEV/PROD switch + GitHub base URL
├── hooks/useData.js       ← Universal data hook
├── data/dummy/*.json      ← Data lokal untuk development
├── components/            ← Shared components
│   ├── Navbar.jsx
│   ├── ParallaxSlideshow.jsx  ← ★ Komponen slideshow baru
│   └── index.jsx          ← Footer, PageHeader, DataState, dll
└── pages/                 ← Semua halaman

github-data/               ← Push ke GitHub → update konten
├── data/                  ← JSON files
├── content/               ← Markdown articles
└── images/                ← Gambar
```

## Deploy Logo UPGRIS

Ganti baris di `src/components/Navbar.jsx`:
```jsx
// Sebelum (placeholder):
<div className="navbar-logo-placeholder">TE</div>

// Sesudah (file logo asli):
<img src="/logo-upgris.svg" alt="Logo UPGRIS" className="navbar-logo" />
```

Letakkan file logo di `public/logo-upgris.svg` (atau `.png`).
