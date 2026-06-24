# te-upgris GitHub Data Repository

Repositori ini menyimpan semua data konten website Program Studi Teknik Elektro UPGRIS.
Update konten **tanpa rebuild aplikasi** — cukup push ke repositori ini.

## Struktur Folder

```
/
├── data/
│   ├── static/               ← Data yang jarang diupdate
│   │   ├── beranda.json      ← Config video YouTube & hero beranda
│   │   ├── slideshow.json    ← Konten 4 slide parallax slideshow
│   │   ├── profil.json       ← Visi, misi, identitas prodi
│   │   ├── dosen.json        ← Data dosen DTPS dan lainnya
│   │   └── kurikulum.json    ← Mata kuliah 8 semester + link RPS
│   │
│   ├── berita.json           ← Daftar berita + URL gambar
│   ├── pengumuman.json       ← Daftar pengumuman
│   ├── penelitian.json       ← Data penelitian dosen
│   ├── pkm.json              ← Data pengabdian masyarakat
│   ├── publikasi.json        ← Daftar publikasi ilmiah
│   ├── mitra.json            ← Daftar mitra kerjasama
│   ├── capstone.json         ← Data proyek Capstone Design ★
│   └── spmi.json             ← Daftar dokumen SPMI
│
├── content/                  ← Konten artikel panjang (.md)
│   ├── berita/
│   │   └── berita-1.md
│   ├── penelitian/
│   ├── pkm/
│   ├── capstone/
│   │   └── capstone-1.md
│   └── pengumuman/
│
└── images/                   ← Gambar (host di GitHub raw)
    ├── berita/
    ├── capstone/
    └── dosen/
```

## Cara Update Konten

### Menambah Berita Baru
1. Edit `data/berita.json` — tambah object dengan `id` unik (increment)
2. Upload gambar ke `images/berita/` — format: `berita-[id].jpg`
3. Isi field `image` dengan: `https://raw.githubusercontent.com/imaduddin-stack/teupgris/main/images/berita/berita-[id].jpg`
4. Untuk artikel panjang: buat `content/berita/berita-[id].md`
5. Push → langsung tampil di website (tanpa rebuild)

### Menambah Proyek Capstone
1. Edit `data/capstone.json` — tambah object baru
2. Upload gambar ke `images/capstone/`
3. Buat `content/capstone/capstone-[id].md` menggunakan template di bawah
4. Push

### Template Markdown Capstone
```markdown
# Judul Proyek

## Latar Belakang
...

## Tujuan
- Tujuan 1

## Metodologi
...

## Hasil & Pembahasan
...

## Kesimpulan
...
```

### Update RPS Mata Kuliah
1. Upload PDF RPS ke Google Drive → atur sharing "Anyone with link can view"
2. Edit `data/static/kurikulum.json` — isi field `rpsUrl` pada MK yang bersangkutan
3. Push

### Update Video Profil Prodi di Beranda
1. Copy YouTube video ID dari URL
2. Edit `data/static/beranda.json` → update `videoUrl` ke: `https://www.youtube-nocookie.com/embed/[VIDEO_ID]`
3. Push

---
Base URL raw content: `https://raw.githubusercontent.com/imaduddin-stack/teupgris/refs/heads/main`
