import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const NAV = [
  { label: 'Beranda', path: '/' },
  {
    label: 'Profil', path: '/profil',
    sub: [
      { label: 'Visi & Misi', path: '/profil#visi' },
      { label: 'Identitas Prodi', path: '/profil#identitas' },
      { label: 'Akreditasi', path: '/profil#akreditasi' },
      { label: 'Kebijakan Prodi', path: '/profil#kebijakan' },
    ]
  },
  { label: 'Akademik', path: '/akademik' },
  { label: 'Dosen', path: '/dosen' },
  { label: 'Penelitian', path: '/penelitian' },
  { label: 'Capstone', path: '/capstone' },
  { label: 'Pengumuman', path: '/pengumuman' },
  { label: 'Berita', path: '/berita' },
  { label: 'SPMI', path: '/spmi' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <div className="ann-bar">
        🎓 Penerimaan Mahasiswa Baru 2025/2026 — <a href="https://pmb.upgris.ac.id" target="_blank" rel="noreferrer">Daftar sekarang →</a>
      </div>
      <nav className="navbar" aria-label="Navigasi utama">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand" aria-label="Teknik Elektro UPGRIS - Beranda">
            {/* Replace with <img src="/logo-upgris.svg" alt="Logo UPGRIS" className="navbar-logo" /> when file is provided */}
            <img src="/logo-upgris.svg" alt="Logo UPGRIS" className="navbar-logo" />
            <div className="navbar-title">
              Teknik Elektro
              <span>Universitas PGRI Semarang</span>
            </div>
          </Link>

          <div className={`nav-links${open ? ' open' : ''}`}>
            {NAV.map(item =>
              item.sub ? (
                <div key={item.path} className="nav-dropdown" ref={dropRef}>
                  <button
                    className={`nav-link tab-btn`}
                    onClick={() => setDropOpen(v => !v)}
                    aria-expanded={dropOpen}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {item.label} ▾
                  </button>
                  {dropOpen && (
                    <div className="nav-dropdown-menu">
                      <Link to={item.path} className="nav-dropdown-item" onClick={() => { setDropOpen(false); setOpen(false) }}>
                        Semua Profil
                      </Link>
                      {item.sub.map(s => (
                        <Link key={s.path} to={s.path} className="nav-dropdown-item"
                          onClick={() => { setDropOpen(false); setOpen(false) }}>
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={item.path} to={item.path}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={() => setOpen(false)}
                  end={item.path === '/'}>
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          <button className="nav-hamburger" onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu" aria-expanded={open}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </>
  )
}
