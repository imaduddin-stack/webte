// src/config/env.js
// ─────────────────────────────────────────────────────────────
//  DATA SOURCE SWITCHER
//  MODE=development  → import from local dummy JSON (no network)
//  MODE=production   → fetch from GitHub raw content API
// ─────────────────────────────────────────────────────────────

export const IS_DEV = import.meta.env.MODE === 'development'

export const GITHUB_BASE =
  'https://raw.githubusercontent.com/imaduddin-stack/teupgris/refs/heads/main'

// Paths used by useGithubData hook
export const DATA_PATHS = {
  beranda:    '/data/static/beranda.json',
  profil:     '/data/static/profil.json',
  dosen:      '/data/static/dosen.json',
  kurikulum:  '/data/static/kurikulum.json',
  berita:     '/data/berita.json',
  pengumuman: '/data/pengumuman.json',
  penelitian: '/data/penelitian.json',
  pkm:        '/data/pkm.json',
  publikasi:  '/data/publikasi.json',
  mitra:      '/data/mitra.json',
  capstone:   '/data/capstone.json',
  spmi:       '/data/spmi.json',
  slideshow:  '/data/static/slideshow.json',
}
