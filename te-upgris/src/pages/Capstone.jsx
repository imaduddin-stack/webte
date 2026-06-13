import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useData, useMarkdown } from '../hooks/useData.js'
import { DataState, PageHeader, MarkdownRenderer, NewsImage, YoutubeEmbed } from './index.jsx'

const KATEGORI_COLORS = {
  IoT:'badge-blue', Energi:'badge-amber', Kontrol:'badge-green',
  Elektronika:'badge-purple', Telekomunikasi:'badge-blue', Lainnya:'badge-gray'
}

// ── List View ─────────────────────────────────────────────────
export default function Capstone() {
  const { data, loading, error } = useData('capstone')
  const [filterKat, setFilterKat]  = useState('Semua')
  const [filterThn, setFilterThn]  = useState('Semua')

  const kategoriList = ['Semua', ...new Set(data?.map(c => c.kategori) || [])]
  const tahunList    = ['Semua', ...new Set(data?.map(c => c.tahun) || []).values()].sort().reverse()

  const filtered = (data || []).filter(c => {
    const okK = filterKat === 'Semua' || c.kategori === filterKat
    const okT = filterThn === 'Semua' || c.tahun === filterThn
    return okK && okT
  })

  return (
    <div>
      <PageHeader
        title="Capstone Design"
        subtitle="Showcase proyek akhir terpadu mahasiswa — solusi rekayasa nyata untuk permasalahan dunia usaha dan industri."
        breadcrumbs={[{ label:'Beranda', path:'/' }, { label:'Capstone Design' }]}
      />

      <section className="section">
        <div className="container">

          {/* Stats bar */}
          <div className="grid-4 mb-4">
            {[
              [data?.length || 0, 'Total Proyek'],
              [new Set(data?.map(c=>c.angkatan)||[]).size, 'Angkatan'],
              [new Set(data?.map(c=>c.kategori)||[]).size, 'Bidang'],
              [new Set(data?.map(c=>c.pembimbing)||[]).size, 'Dosen Pembimbing'],
            ].map(([n,l]) => (
              <div key={l} className="card text-center">
                <div style={{ fontSize:'2rem', fontWeight:800, color:'var(--electric)' }}>{n}</div>
                <div style={{ color:'var(--gray-500)', fontSize:'0.85rem' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
            <div>
              <span style={{ fontSize:'0.8rem', color:'var(--gray-500)', marginRight:'0.5rem' }}>Bidang:</span>
              <div className="filter-chips" style={{ display:'inline-flex', marginBottom:0 }}>
                {kategoriList.map(k => (
                  <button key={k} className={`chip${filterKat===k?' active':''}`} onClick={() => setFilterKat(k)}>{k}</button>
                ))}
              </div>
            </div>
            <div>
              <span style={{ fontSize:'0.8rem', color:'var(--gray-500)', marginRight:'0.5rem' }}>Tahun:</span>
              <div className="filter-chips" style={{ display:'inline-flex', marginBottom:0 }}>
                {tahunList.map(t => (
                  <button key={t} className={`chip${filterThn===t?' active':''}`} onClick={() => setFilterThn(t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          <DataState loading={loading} error={error}>
            {filtered.length === 0
              ? <p style={{ color:'var(--gray-500)', textAlign:'center', padding:'3rem' }}>Tidak ada proyek ditemukan.</p>
              : (
                <div className="capstone-grid">
                  {filtered.map(c => (
                    <Link key={c.id} to={`/capstone/${c.id}`} style={{ textDecoration:'none' }}>
                      <article className="capstone-card card-hover">
                        <NewsImage src={c.image} alt={c.judul} className="capstone-img" height={200} />
                        <div className="capstone-body">
                          <div className="capstone-meta" style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                            <span className={`badge ${KATEGORI_COLORS[c.kategori]||'badge-gray'}`} style={{ fontSize:'0.7rem' }}>{c.kategori}</span>
                            <span style={{ fontSize:'0.72rem', color:'var(--gray-500)' }}>{c.tahun}</span>
                          </div>
                          <h3 style={{ fontSize:'0.95rem', marginTop:'0.5rem', marginBottom:'0.5rem', color:'var(--navy)' }}>{c.judul}</h3>
                          <p style={{ fontSize:'0.82rem', color:'var(--gray-500)', marginBottom:'0.5rem' }}>
                            👤 {c.mahasiswa}
                          </p>
                          <p style={{ fontSize:'0.82rem', color:'var(--gray-500)', marginBottom:'0.75rem' }}>
                            🎓 Pembimbing: {c.pembimbing}
                          </p>
                          <p style={{ fontSize:'0.82rem', color:'var(--gray-700)', lineHeight:1.5, flex:1 }}>
                            {c.abstrak?.slice(0,120)}…
                          </p>
                          <div style={{ marginTop:'1rem' }}>
                            <span className="btn btn-primary btn-sm">Lihat Detail →</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )
            }
          </DataState>
        </div>
      </section>
    </div>
  )
}

// ── Detail View ───────────────────────────────────────────────
export function CapstoneDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, loading, error } = useData('capstone')
  const item = data?.find(c => String(c.id) === id)
  const { markdown, loading: lMd } = useMarkdown(item?.contentUrl || null)

  return (
    <div>
      <PageHeader
        title="Detail Capstone"
        breadcrumbs={[{ label:'Beranda', path:'/' }, { label:'Capstone Design', path:'/capstone' }, { label:'Detail' }]}
      />
      <section className="section">
        <div className="container">
          <DataState loading={loading} error={error}>
            {!item
              ? <div className="error-wrap">Proyek tidak ditemukan. <button className="btn btn-ghost btn-sm" onClick={() => navigate('/capstone')}>Kembali</button></div>
              : (
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2.5rem' }}>
                  {/* Main */}
                  <div>
                    <NewsImage src={item.image} alt={item.judul} className="news-img" height={360} style={{ borderRadius:'var(--radius-lg)', width:'100%', objectFit:'cover' }} />
                    <div style={{ marginTop:'1.5rem' }}>
                      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1rem' }}>
                        <span className={`badge ${KATEGORI_COLORS[item.kategori]||'badge-gray'}`}>{item.kategori}</span>
                        <span className="badge badge-gray">{item.tahun}</span>
                        <span className="badge badge-gray">Angkatan {item.angkatan}</span>
                      </div>
                      <h1 style={{ marginBottom:'1rem' }}>{item.judul}</h1>
                      <div className="card" style={{ marginBottom:'1.5rem' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', fontSize:'0.875rem' }}>
                          <div><strong style={{ color:'var(--gray-500)' }}>Mahasiswa</strong><br />{item.mahasiswa}</div>
                          <div><strong style={{ color:'var(--gray-500)' }}>NIM</strong><br />{item.nim}</div>
                          <div><strong style={{ color:'var(--gray-500)' }}>Dosen Pembimbing</strong><br />{item.pembimbing}</div>
                          <div><strong style={{ color:'var(--gray-500)' }}>Tahun Akademik</strong><br />{item.tahun}</div>
                        </div>
                      </div>

                      {/* YouTube demo */}
                      {item.demoUrl && (
                        <div style={{ marginBottom:'1.5rem' }}>
                          <h3 style={{ marginBottom:'0.75rem' }}>📹 Demo Proyek</h3>
                          <YoutubeEmbed videoUrl={item.demoUrl} title={`Demo: ${item.judul}`} />
                        </div>
                      )}

                      {/* Markdown content */}
                      <DataState loading={lMd} error={null}>
                        {markdown
                          ? <MarkdownRenderer content={markdown} />
                          : <p style={{ color:'var(--gray-500)', fontStyle:'italic' }}>{item.abstrak}</p>
                        }
                      </DataState>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div>
                    <div className="card" style={{ marginBottom:'1rem' }}>
                      <h4 style={{ marginBottom:'1rem', color:'var(--navy)' }}>Dokumen & Tautan</h4>
                      {item.laporanUrl
                        ? <a href={item.laporanUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginBottom:'0.5rem' }}>📄 Unduh Laporan</a>
                        : <span className="btn btn-disabled" style={{ width:'100%', justifyContent:'center', marginBottom:'0.5rem' }}>Laporan Belum Tersedia</span>
                      }
                      {item.demoUrl && <a href={item.demoUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ width:'100%', justifyContent:'center' }}>▶ Tonton Demo</a>}
                    </div>
                    <button className="btn btn-ghost" onClick={() => navigate('/capstone')} style={{ width:'100%', justifyContent:'center' }}>
                      ← Kembali ke Capstone
                    </button>
                  </div>
                </div>
              )
            }
          </DataState>
        </div>
      </section>
    </div>
  )
}
