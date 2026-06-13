// src/hooks/useData.js
// ─────────────────────────────────────────────────────────────
//  Universal data hook.
//  DEV  → imports from local dummy JSON (zero network requests)
//  PROD → fetches from GitHub raw content API
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react'
import { IS_DEV, GITHUB_BASE, DATA_PATHS } from '../config/env.js'

// ── static imports of ALL dummy JSON files (only bundled in dev) ──────────
import berandaDummy    from '../data/dummy/beranda.json'
import slideshowDummy  from '../data/dummy/slideshow.json'
import profilDummy     from '../data/dummy/profil.json'
import dosenDummy      from '../data/dummy/dosen.json'
import kurikulumDummy  from '../data/dummy/kurikulum.json'
import beritaDummy     from '../data/dummy/berita.json'
import pengumumanDummy from '../data/dummy/pengumuman.json'
import penelitianDummy from '../data/dummy/penelitian.json'
import pkmDummy        from '../data/dummy/pkm.json'
import publikasiDummy  from '../data/dummy/publikasi.json'
import mitraDummy      from '../data/dummy/mitra.json'
import capstoneDummy   from '../data/dummy/capstone.json'
import spmiDummy       from '../data/dummy/spmi.json'

const DUMMY_MAP = {
  beranda:    berandaDummy,
  slideshow:  slideshowDummy,
  profil:     profilDummy,
  dosen:      dosenDummy,
  kurikulum:  kurikulumDummy,
  berita:     beritaDummy,
  pengumuman: pengumumanDummy,
  penelitian: penelitianDummy,
  pkm:        pkmDummy,
  publikasi:  publikasiDummy,
  mitra:      mitraDummy,
  capstone:   capstoneDummy,
  spmi:       spmiDummy,
}

/**
 * useData(key)
 * key: one of the keys in DATA_PATHS / DUMMY_MAP
 * returns { data, loading, error }
 */
export function useData(key) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const abort = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    if (IS_DEV) {
      // Instant — return dummy data synchronously (wrapped in microtask to keep
      // hook behaviour consistent and allow React batching)
      Promise.resolve(DUMMY_MAP[key] ?? null).then(d => {
        if (!cancelled) { setData(d); setLoading(false) }
      })
      return () => { cancelled = true }
    }

    // Production: fetch from GitHub
    const path = DATA_PATHS[key]
    if (!path) {
      setError('Unknown data key: ' + key)
      setLoading(false)
      return
    }
    const url = GITHUB_BASE + path
    abort.current = new AbortController()

    fetch(url, { signal: abort.current.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} — ${url}`)
        return r.json()
      })
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => {
        if (!cancelled && e.name !== 'AbortError') {
          setError(e.message)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
      abort.current?.abort()
    }
  }, [key])

  return { data, loading, error }
}

/**
 * useMarkdown(url)
 * url: full URL or GitHub-relative path to a .md file
 * DEV: returns a hardcoded placeholder so no network is needed
 */
export function useMarkdown(url) {
  const [markdown, setMarkdown] = useState(null)
  const [loading, setLoading]   = useState(!!url)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!url) { setLoading(false); return }
    let cancelled = false
    setLoading(true)

    if (IS_DEV) {
      Promise.resolve(`# Konten Dummy\n\nIni adalah placeholder konten Markdown untuk mode development.\n\nPada mode **production**, konten ini akan diambil dari GitHub raw content:\n\`${url}\`\n\n## Fitur\n- Heading H1–H4\n- **Bold** dan *italic*\n- Daftar berurutan dan tidak berurutan\n- \`inline code\` dan blok kode\n- [Link eksternal](https://upgris.ac.id)\n\n---\n\n> Ganti file \`.md\` di repositori GitHub untuk konten nyata.`)
        .then(md => { if (!cancelled) { setMarkdown(md); setLoading(false) } })
      return () => { cancelled = true }
    }

    const fullUrl = url.startsWith('http') ? url : GITHUB_BASE + url
    fetch(fullUrl)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then(md => { if (!cancelled) { setMarkdown(md); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false) } })

    return () => { cancelled = true }
  }, [url])

  return { markdown, loading, error }
}
