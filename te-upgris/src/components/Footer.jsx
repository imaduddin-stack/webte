import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
              {/* Replace with <img src="/logo-upgris.svg" alt="Logo UPGRIS" className="navbar-logo" /> when file is provided */}
              <div className="navbar-logo-placeholder" style={{ width:40, height:40, fontSize:'0.9rem' }}>TE</div>
              <div>
                <div style={{ color:'#fff', fontWeight:700, fontSize:'0.95rem' }}>Teknik Elektro</div>
                <div style={{ fontSize:'0.78rem', opacity:0.65 }}>Universitas PGRI Semarang</div>
              </div>
            </div>
            <p style={{ fontSize:'0.85rem', lineHeight:1.7 }}>
              Program Studi Teknik Elektro S1 — Terakreditasi Baik oleh LAMTEK.<br />
              Fakultas Teknik dan Informatika, UPGRIS Semarang.
            </p>
            <p style={{ fontSize:'0.8rem', marginTop:'0.75rem', opacity:0.65 }}>
              📧 teknikelektro@upgris.ac.id<br />
              📞 (024) 8316377<br />
              📍 Jl. Sidodadi Timur No.24, Semarang
            </p>
          </div>

          <div>
            <h4>Navigasi</h4>
            <ul className="footer-links">
              {[['Beranda','/'],['Profil','/profil'],['Akademik','/akademik'],['Dosen','/dosen'],['Penelitian','/penelitian'],['Capstone','/capstone']].map(([l,p]) => (
                <li key={p}><Link to={p}>{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Informasi</h4>
            <ul className="footer-links">
              {[['Pengumuman','/pengumuman'],['Berita & Kegiatan','/berita'],['SPMI','/spmi']].map(([l,p]) => (
                <li key={p}><Link to={p}>{l}</Link></li>
              ))}
              <li><a href="https://pmb.upgris.ac.id" target="_blank" rel="noreferrer">PMB UPGRIS</a></li>
              <li><a href="https://upgris.ac.id" target="_blank" rel="noreferrer">Website UPGRIS</a></li>
            </ul>
          </div>

          <div>
            <h4>Media Sosial</h4>
            <ul className="footer-links">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">📷 Instagram</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer">▶ YouTube</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer">👥 Facebook</a></li>
              <li><a href="https://github.com/imaduddin-stack/teupgris" target="_blank" rel="noreferrer">💻 GitHub (Data)</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Program Studi Teknik Elektro — Universitas PGRI Semarang. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
