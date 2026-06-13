import { Link } from 'react-router-dom'
import { useData } from '../hooks/useData.js'
import { DataState, YoutubeEmbed, NewsImage } from './index.jsx'
import ParallaxSlideshow from '../components/ParallaxSlideshow.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })
}

const KATEGORI_COLOR = {
  Prestasi: 'badge-amber', Akademik: 'badge-blue', Penelitian: 'badge-blue',
  Pengabdian: 'badge-green', Kerjasama: 'badge-purple', default: 'badge-gray'
}

export default function Home() {
  const { data: slideshow, loading: lSlide }      = useData('slideshow')
  const { data: beranda }                          = useData('beranda')
  const { data: berita, loading: lBerita }         = useData('berita')
  const { data: pengumuman, loading: lPengumuman } = useData('pengumuman')
  const { data: dosen, loading: lDosen }           = useData('dosen')

  return (
    <div>
      {/* ── 1. Hero ───────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Teknik Elektro<br />UPGRIS Semarang</h1>
            <p>Portal resmi Program Studi Teknik Elektro S1 Universitas PGRI Semarang. Terakreditasi Baik oleh LAMTEK — membentuk insinyur kompeten, berkarakter, dan siap industri.</p>
            <div className="hero-btns">
              <a href="https://pmb.upgris.ac.id" target="_blank" rel="noreferrer" className="btn btn-accent">🎓 Daftar PMB 2025/2026</a>
              <Link to="/profil" className="btn btn-outline" style={{ color:'#fff', borderColor:'rgba(255,255,255,0.6)' }}>Kenali Prodi →</Link>
            </div>
          </div>
          <div className="hero-stats">
            {[['203','Mahasiswa Aktif'],['8','Dosen Tetap'],['12+','Mitra Industri'],['3.32','IPK Rata-rata']].map(([n,l]) => (
              <div key={l} className="hero-stat">
                <span className="hero-stat-num">{n}</span>
                <span className="hero-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Info strip ─────────────────────────────────────── */}
      <div className="info-strip">
        {[['🎓','Program S1','Sarjana Teknik Elektro'],['✅','Akreditasi Baik','LAMTEK 2021'],['📜','Gelar S.T.','Sarjana Teknik'],['🏆','Prestasi KRI','Tingkat Nasional']].map(([ic,s,d]) => (
          <div key={s} className="info-strip-item">
            <strong>{ic} {s}</strong><span>{d}</span>
          </div>
        ))}
      </div>

      {/* ── 3. Parallax Slideshow (middle section) ────────────── */}
      {!lSlide && slideshow && <ParallaxSlideshow slides={slideshow} />}

      {/* ── 4. Video Profil Prodi ─────────────────────────────── */}
      {beranda?.videoUrl && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-title text-center">
              <h2>Profil Program Studi</h2>
              <p>{beranda.videoDeskripsi}</p>
            </div>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <YoutubeEmbed videoUrl={beranda.videoUrl} title={beranda.videoJudul} />
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Pengumuman + Berita ────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'2.5rem' }}>
            {/* Pengumuman */}
            <div>
              <div className="flex-between mb-3">
                <h2 style={{ fontSize:'1.4rem' }}>📢 Pengumuman</h2>
                <Link to="/pengumuman" className="btn btn-ghost btn-sm">Semua →</Link>
              </div>
              <DataState loading={lPengumuman} error={null}>
                {pengumuman?.slice(0,4).map(p => (
                  <div key={p.id} style={{ padding:'0.875rem 0', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.35rem', flexWrap:'wrap' }}>
                      <span className={`badge badge-blue`} style={{ fontSize:'0.7rem' }}>{p.kategori}</span>
                      <span style={{ fontSize:'0.75rem', color:'var(--gray-500)' }}>{formatDate(p.tanggal)}</span>
                    </div>
                    <p style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--navy)', marginBottom:'0.25rem' }}>
                      {p.judul}
                    </p>
                    <p style={{ fontSize:'0.8rem', color:'var(--gray-500)', lineHeight:1.5 }}>{p.deskripsi?.slice(0,100)}…</p>
                    <Link to={`/pengumuman/${p.id}`} style={{ fontSize:'0.78rem', color:'var(--electric)', fontWeight:600 }}>Selengkapnya →</Link>
                  </div>
                ))}
              </DataState>
            </div>

            {/* Berita */}
            <div>
              <div className="flex-between mb-3">
                <h2 style={{ fontSize:'1.4rem' }}>📰 Berita Terbaru</h2>
                <Link to="/berita" className="btn btn-ghost btn-sm">Semua →</Link>
              </div>
              <DataState loading={lBerita} error={null}>
                <div className="news-grid" style={{ gridTemplateColumns:'1fr 1fr' }}>
                  {berita?.slice(0,4).map(b => (
                    <Link key={b.id} to={`/berita/${b.id}`} style={{ textDecoration:'none' }}>
                      <div className="news-card card-hover">
                        <NewsImage src={b.image} alt={b.judul} />
                        <div className="news-body">
                          <div className="news-meta">
                            <span className={`badge ${KATEGORI_COLOR[b.kategori] || 'badge-gray'}`} style={{ fontSize:'0.7rem' }}>{b.kategori}</span>
                            {' '}{formatDate(b.tanggal)}
                          </div>
                          <p className="news-title">{b.judul}</p>
                          <p className="news-excerpt">{b.ringkasan?.slice(0,90)}…</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </DataState>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Stats dark ────────────────────────────────────── */}
      <section className="section-dark">
        <div className="container">
          <div className="text-center mb-4"><h2>Teknik Elektro UPGRIS dalam Angka</h2></div>
          <div className="stats-grid">
            {[['87%','Kesesuaian Bidang Kerja'],['3.32','IPK Rata-rata Lulusan'],['20+','Mitra Industri'],['18+','Publikasi Ilmiah'],['≤3 bln','Waktu Tunggu Kerja'],['4','Prestasi Nasional']].map(([n,l]) => (
              <div key={l} className="stat-card">
                <span className="stat-num">{n}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Dosen highlight ────────────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <div className="flex-between mb-4">
            <div>
              <h2>Dosen Program Studi</h2>
              <p style={{ color:'var(--gray-500)' }}>Tenaga pengajar berpengalaman dan bersertifikasi</p>
            </div>
            <Link to="/dosen" className="btn btn-outline">Lihat Semua →</Link>
          </div>
          <DataState loading={lDosen} error={null}>
            <div className="dosen-grid">
              {dosen?.filter(d=>d.kategori==='DTPS').slice(0,6).map(d => (
                <div key={d.id} className="dosen-card card-hover">
                  <div className="dosen-avatar">{d.nama.replace(/[^A-Z]/g,'').slice(0,2)}</div>
                  <div className="dosen-nama">{d.nama}</div>
                  <div className="dosen-meta">{d.jabatan}</div>
                  <div className="dosen-meta" style={{ color:'var(--electric)' }}>{d.bidang}</div>
                  <div className="dosen-meta" style={{ marginTop:'0.5rem', fontSize:'0.78rem' }}>{d.pendidikan}</div>
                  <div className="dosen-links">
                    {d.sinta && <a href={d.sinta} target="_blank" rel="noreferrer" className="dosen-link">SINTA</a>}
                    {d.scholar && <a href={d.scholar} target="_blank" rel="noreferrer" className="dosen-link">Scholar</a>}
                  </div>
                </div>
              ))}
            </div>
          </DataState>
        </div>
      </section>

      {/* ── 8. CTA ───────────────────────────────────────────── */}
      <section style={{ background:'linear-gradient(135deg, var(--navy) 0%, #1e40af 100%)', padding:'3.5rem 0', color:'#fff', textAlign:'center' }}>
        <div className="container">
          <h2 style={{ color:'#fff', marginBottom:'0.75rem' }}>Siap Bergabung dengan Teknik Elektro UPGRIS?</h2>
          <p style={{ color:'rgba(255,255,255,0.8)', marginBottom:'2rem', maxWidth:500, margin:'0 auto 2rem' }}>
            Raih masa depan cerah bersama kami. Akreditasi Baik, dosen berpengalaman, dan lulusan siap kerja.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <a href="https://pmb.upgris.ac.id" target="_blank" rel="noreferrer" className="btn btn-accent">🎓 Daftar PMB Sekarang</a>
            <Link to="/profil" className="btn btn-outline" style={{ color:'#fff', borderColor:'rgba(255,255,255,0.6)' }}>Pelajari Lebih Lanjut</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
