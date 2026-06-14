// src/pages/stubs.jsx  — all remaining pages
import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useData, useMarkdown } from '../hooks/useData.js'
import { DataState, PageHeader, MarkdownRenderer, NewsImage, YoutubeEmbed } from './index.jsx'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
}
const KAT_COLOR = { Prestasi:'badge-amber', Akademik:'badge-blue', Penelitian:'badge-blue', Pengabdian:'badge-green', Kerjasama:'badge-purple', default:'badge-gray' }

// ════════════════ PROFIL ════════════════════════════════════
export function Profil() {
  const { data, loading, error } = useData('profil')
  const [tab, setTab] = useState('visi')
  const TABS = [{ id:'visi', label:'Visi & Misi' }, { id:'identitas', label:'Identitas Prodi' }, { id:'akreditasi', label:'Akreditasi' }, { id:'kebijakan', label:'Kebijakan' }]
  return (
    <div>
      <PageHeader title="Profil Program Studi" subtitle="Mengenal Program Studi Teknik Elektro S1 UPGRIS — visi, misi, identitas, dan kebijakan akademik." breadcrumbs={[{label:'Beranda',path:'/'},{label:'Profil'}]} />
      <section className="section"><div className="container">
        <div className="tabs mb-4">{TABS.map(t => <button key={t.id} className={`tab-btn${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
        <DataState loading={loading} error={error}>
          {data && tab==='visi' && (
            <div className="grid-2">
              <div>
                <div className="card" style={{background:'var(--navy)',color:'#fff',marginBottom:'1rem'}}>
                  <h3 style={{color:'#fff',marginBottom:'0.75rem'}}>Visi Keilmuan Program Studi</h3>
                  <p style={{color:'rgba(255,255,255,0.85)',lineHeight:1.7}}>{data.visi}</p>
                </div>
                <div className="card">
                  <h4 style={{marginBottom:'0.75rem'}}>Tujuan Program Studi</h4>
                  <ul style={{paddingLeft:'1.25rem'}}>
                    {data.tujuan?.map((t,i) => <li key={i} style={{marginBottom:'0.5rem',fontSize:'0.9rem'}}>{t}</li>)}
                  </ul>
                </div>
              </div>
              <div>
                <h3 style={{marginBottom:'1rem'}}>Misi</h3>
                {Array.isArray(data.misi) && data.misi.map((m,i) => (
                  <div key={i} className="card" style={{marginBottom:'0.75rem',display:'flex',gap:'1rem',alignItems:'flex-start'}}>
                    <div style={{background:'var(--electric)',color:'#fff',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',fontWeight:700,flexShrink:0}}>{i+1}</div>
                    <p style={{fontSize:'0.9rem',lineHeight:1.6}}>{m}</p>
                  </div>
                ))}

                <h3 style={{marginTop:'2rem', marginBottom:'1rem'}}>Strategi</h3>
                {Array.isArray(data.strategi) && data.strategi.map((s,i) => (
                  <div key={i} className="card" style={{marginBottom:'0.75rem',display:'flex',gap:'1rem',alignItems:'flex-start'}}>
                    <div style={{background:'var(--electric)',color:'#fff',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',fontWeight:700,flexShrink:0}}>{i+1}</div>
                    <p style={{fontSize:'0.9rem',lineHeight:1.6}}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data && tab==='identitas' && (
            <div className="grid-2">
              {[['Nama Prodi',data.nama],['Jenjang',data.jenjang],['Universitas',data.universitas],['Fakultas',data.fakultas],['Akreditasi',data.akreditasi],['No. SK',data.noSK],['Gelar',data.gelar],['Mhs Aktif',data.mahasiswaAktif+' orang'],['IPK Rata-rata',data.ipkRataRata],['Email',data.email],['Telepon',data.telepon],['Alamat',data.alamat]].map(([k,v]) => (
                <div key={k} className="card" style={{padding:'1rem'}}>
                  <div style={{fontSize:'0.78rem',color:'var(--gray-500)',marginBottom:'0.25rem'}}>{k}</div>
                  <div style={{fontWeight:600,color:'var(--navy)',fontSize:'0.9rem'}}>{v}</div>
                </div>
              ))}
            </div>
          )}
          {data && tab==='akreditasi' && (
            <div className="card" style={{maxWidth:600,margin:'0 auto',textAlign:'center',padding:'2.5rem'}}>
              <div style={{fontSize:'4rem',marginBottom:'1rem'}}>🏅</div>
              <h2 style={{marginBottom:'0.5rem'}}>Terakreditasi Baik</h2>
              <p style={{color:'var(--gray-500)',marginBottom:'1.5rem'}}>Lembaga Akreditasi Mandiri Teknik (LAMTEK)</p>
              <div className="card" style={{background:'var(--off-white)',padding:'1rem'}}>
                <div style={{fontSize:'0.85rem',color:'var(--gray-500)'}}>Nomor SK</div>
                <div style={{fontWeight:700,color:'var(--navy)',fontSize:'1.1rem'}}>{data.noSK}</div>
              </div>
            </div>
          )}
          {data && tab==='kebijakan' && (
            <div className="card" style={{maxWidth:800}}><p style={{lineHeight:1.8}}>{data.kebijakan}</p></div>
          )}
        </DataState>
      </div></section>
    </div>
  )
}

// ════════════════ DOSEN ════════════════════════════════════
export function Dosen() {
  const { data, loading, error } = useData('dosen')
  const dtps    = data?.filter(d => d.kategori === 'DTPS') || []
  const lainnya = data?.filter(d => d.kategori !== 'DTPS') || []
  return (
    <div>
      <PageHeader title="Dosen Program Studi" subtitle="Tenaga pengajar tetap (DTPS) dan dosen lainnya — berpengalaman, bersertifikasi, aktif meneliti." breadcrumbs={[{label:'Beranda',path:'/'},{label:'Dosen'}]} />
      <section className="section"><div className="container">
        <DataState loading={loading} error={error}>
          <h2 style={{marginBottom:'1.5rem'}}>Dosen Tetap Program Studi (DTPS)</h2>
          <div className="dosen-grid mb-4">
            {dtps.map(d => (
              <div key={d.id} className="dosen-card card-hover">
                <div className="dosen-avatar">{d.nama.replace(/[^A-Z]/g,'').slice(0,2)||d.nama.slice(0,2).toUpperCase()}</div>
                <div className="dosen-nama">{d.nama}</div>
                <div className="dosen-meta">NIDN: {d.nidn}</div>
                <div className="dosen-meta">{d.jabatan}</div>
                <div className="dosen-meta" style={{color:'var(--electric)',fontWeight:600}}>{d.bidang}</div>
                <div className="dosen-meta">{d.pendidikan}</div>
                {d.sertifikasi && <div className="dosen-meta" style={{marginTop:'0.5rem'}}><span className="badge badge-green" style={{fontSize:'0.7rem'}}>{d.sertifikasi}</span></div>}
                {d.mataKuliah && <div className="dosen-meta" style={{marginTop:'0.5rem',fontSize:'0.78rem'}}>📚 {d.mataKuliah}</div>}
                <div className="dosen-links">
                  {d.sinta && <a href={d.sinta} target="_blank" rel="noreferrer" className="dosen-link">SINTA</a>}
                  {d.scholar && <a href={d.scholar} target="_blank" rel="noreferrer" className="dosen-link">Scholar</a>}
                </div>
              </div>
            ))}
          </div>
          {lainnya.length > 0 && <>
            <h2 style={{marginBottom:'1.5rem'}}>Dosen Lainnya</h2>
            <div className="dosen-grid">{lainnya.map(d => <div key={d.id} className="dosen-card"><div className="dosen-avatar">{d.nama.slice(0,2).toUpperCase()}</div><div className="dosen-nama">{d.nama}</div><div className="dosen-meta">{d.jabatan}</div><div className="dosen-meta" style={{color:'var(--electric)'}}>{d.bidang}</div></div>)}</div>
          </>}
        </DataState>
      </div></section>
    </div>
  )
}

// ════════════════ PENELITIAN ════════════════════════════════
export function Penelitian() {
  const [tab, setTab] = useState('penelitian')
  const { data: penelitian, loading: lP } = useData('penelitian')
  const { data: pkm,        loading: lPkm } = useData('pkm')
  const { data: publikasi,  loading: lPub } = useData('publikasi')
  const { data: mitra,      loading: lM }   = useData('mitra')
  const TABS = [{id:'penelitian',label:'Penelitian'},{id:'pkm',label:'Pengabdian (PkM)'},{id:'publikasi',label:'Publikasi'},{id:'kerjasama',label:'Kerjasama'}]

  const RisetTable = ({ data, loading, basePath }) => (
    <DataState loading={loading} error={null}>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>#</th><th>Judul</th><th>Dosen</th><th>Roadmap</th><th>Tahun</th><th>Dana</th><th>Sumber</th><th>Detail</th></tr></thead>
          <tbody>{data?.map((r,i) => (
            <tr key={r.id}>
              <td>{i+1}</td>
              <td style={{maxWidth:300}}>
                {r.image && <img src={r.image} alt="" style={{width:48,height:36,objectFit:'cover',borderRadius:4,marginRight:8,verticalAlign:'middle'}} loading="lazy" onError={e=>e.target.style.display='none'} />}
                <span style={{fontSize:'0.875rem',fontWeight:600}}>{r.judul}</span>
              </td>
              <td style={{fontSize:'0.85rem'}}>{r.dosen}</td>
              <td><span className="badge badge-blue" style={{fontSize:'0.7rem'}}>{r.roadmap}</span></td>
              <td>{r.tahun}</td>
              <td style={{fontSize:'0.85rem',whiteSpace:'nowrap'}}>{r.dana}</td>
              <td><span className="badge badge-gray" style={{fontSize:'0.7rem'}}>{r.sumber}</span></td>
              <td>{r.contentUrl && <Link to={`${basePath}/${r.id}`} className="btn btn-primary btn-sm" style={{fontSize:'0.75rem'}}>Detail</Link>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </DataState>
  )

  return (
    <div>
      <PageHeader title="Penelitian & Pengabdian" subtitle="Rekam jejak riset, pengabdian masyarakat, publikasi ilmiah, dan kerjasama Program Studi Teknik Elektro UPGRIS." breadcrumbs={[{label:'Beranda',path:'/'},{label:'Penelitian'}]} />
      <section className="section"><div className="container">
        <div className="tabs mb-4">{TABS.map(t => <button key={t.id} className={`tab-btn${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
        {tab==='penelitian' && <RisetTable data={penelitian} loading={lP} basePath="/penelitian" />}
        {tab==='pkm' && <RisetTable data={pkm} loading={lPkm} basePath="/penelitian" />}
        {tab==='publikasi' && <DataState loading={lPub} error={null}><div className="table-wrap"><table className="data-table"><thead><tr><th>#</th><th>Judul</th><th>Dosen</th><th>Jenis</th><th>Tahun</th><th>Link</th><th>Keterangan</th></tr></thead><tbody>{publikasi?.map((p,i)=><tr key={p.id}><td>{i+1}</td><td style={{fontSize:'0.875rem',fontWeight:600}}>{p.judul}</td><td style={{fontSize:'0.85rem'}}>{p.dosen}</td><td><span className="badge badge-blue" style={{fontSize:'0.7rem'}}>{p.jenis}</span></td><td>{p.tahun}</td><td>{p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{fontSize:'0.8rem'}}>↗ Lihat</a>}</td><td style={{fontSize:'0.8rem',color:'var(--gray-500)'}}>{p.keterangan}</td></tr>)}</tbody></table></div></DataState>}
        {tab==='kerjasama' && <DataState loading={lM} error={null}><div style={{display:'grid',gap:'0.75rem'}}>{mitra?.map(m=><div key={m.id} className="card" style={{display:'flex',alignItems:'center',gap:'1rem'}}><div style={{fontSize:'1.5rem'}}>{m.tingkat==='Internasional'?'🌐':m.tingkat==='Nasional'?'🏛':'🏙'}</div><div style={{flex:1}}><div style={{fontWeight:700,color:'var(--navy)'}}>{m.nama}</div><div style={{fontSize:'0.85rem',color:'var(--gray-500)'}}>{m.jenis} — {m.judul}</div></div><span className={`badge ${m.tingkat==='Internasional'?'badge-blue':m.tingkat==='Nasional'?'badge-green':'badge-gray'}`} style={{fontSize:'0.75rem'}}>{m.tingkat}</span></div>)}</div></DataState>}
      </div></section>
    </div>
  )
}

// ════════════════ PENELITIAN DETAIL ════════════════════════
export function PenelitianDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: penelitian } = useData('penelitian')
  const { data: pkm }        = useData('pkm')
  const all = [...(penelitian||[]), ...(pkm||[])]
  const item = all.find(r => String(r.id) === id)
  const { markdown, loading } = useMarkdown(item?.contentUrl||null)
  return (
    <div>
      <PageHeader title="Detail Penelitian" breadcrumbs={[{label:'Beranda',path:'/'},{label:'Penelitian',path:'/penelitian'},{label:'Detail'}]} />
      <section className="section"><div className="container" style={{maxWidth:800}}>
        {item ? <>
          <h1 style={{marginBottom:'1.5rem'}}>{item.judul}</h1>
          <div className="card mb-4"><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',fontSize:'0.875rem'}}>
            {[['Dosen',item.dosen],['Tahun',item.tahun],['Dana',item.dana],['Sumber',item.sumber],['Roadmap',item.roadmap],['Jenis',item.jenis]].map(([k,v])=><div key={k}><strong style={{color:'var(--gray-500)'}}>{k}</strong><br/>{v}</div>)}
          </div></div>
          <DataState loading={loading} error={null}>
            {markdown ? <MarkdownRenderer content={markdown} /> : <p style={{color:'var(--gray-500)',fontStyle:'italic'}}>Konten detail belum tersedia.</p>}
          </DataState>
          <button className="btn btn-ghost mt-4" onClick={()=>navigate('/penelitian')}>← Kembali</button>
        </> : <div className="error-wrap">Data tidak ditemukan.<button className="btn btn-ghost btn-sm" onClick={()=>navigate('/penelitian')}>Kembali</button></div>}
      </div></section>
    </div>
  )
}

// ════════════════ PENGUMUMAN ════════════════════════════════
export function Pengumuman() {
  const { data, loading, error } = useData('pengumuman')
  const [filter, setFilter] = useState('Semua')
  const CATS = ['Semua', ...new Set(data?.map(p=>p.kategori)||[])]
  const filtered = filter === 'Semua' ? data : data?.filter(p=>p.kategori===filter)
  return (
    <div>
      <PageHeader title="Pengumuman" subtitle="Informasi resmi dari Program Studi Teknik Elektro UPGRIS." breadcrumbs={[{label:'Beranda',path:'/'},{label:'Pengumuman'}]} />
      <section className="section"><div className="container">
        <div className="filter-chips">{CATS.map(c=><button key={c} className={`chip${filter===c?' active':''}`} onClick={()=>setFilter(c)}>{c}</button>)}</div>
        <DataState loading={loading} error={error}>
          <div style={{display:'grid',gap:'1rem'}}>
            {filtered?.map(p=>(
              <div key={p.id} className="card" style={{display:'grid',gridTemplateColumns:'auto 1fr auto',gap:'1.5rem',alignItems:'start'}}>
                <div style={{textAlign:'center',background:'var(--navy)',color:'#fff',padding:'0.75rem',borderRadius:'var(--radius)',minWidth:64}}>
                  <div style={{fontSize:'1.4rem',fontWeight:800,lineHeight:1}}>{new Date(p.tanggal).getDate()}</div>
                  <div style={{fontSize:'0.7rem',opacity:0.8}}>{new Date(p.tanggal).toLocaleDateString('id-ID',{month:'short'})}</div>
                  <div style={{fontSize:'0.7rem',opacity:0.8}}>{new Date(p.tanggal).getFullYear()}</div>
                </div>
                <div>
                  <span className="badge badge-blue" style={{fontSize:'0.72rem',marginBottom:'0.5rem'}}>{p.kategori}</span>
                  <h3 style={{fontSize:'1rem',marginBottom:'0.5rem'}}>{p.judul}</h3>
                  <p style={{fontSize:'0.875rem',color:'var(--gray-500)',lineHeight:1.6}}>{p.deskripsi}</p>
                  <div style={{marginTop:'0.75rem',display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
                    {p.contentUrl && <Link to={`/pengumuman/${p.id}`} style={{fontSize:'0.82rem',color:'var(--electric)',fontWeight:600}}>Selengkapnya →</Link>}
                    {p.lampiran && <a href={p.lampiran} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{fontSize:'0.78rem'}}>📎 Unduh Dokumen</a>}
                  </div>
                </div>
                <div />
              </div>
            ))}
          </div>
        </DataState>
      </div></section>
    </div>
  )
}

// ════════════════ PENGUMUMAN DETAIL ════════════════════════
export function PengumumanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data } = useData('pengumuman')
  const item = data?.find(p => String(p.id) === id)
  const { markdown, loading } = useMarkdown(item?.contentUrl||null)
  return (
    <div>
      <PageHeader title="Detail Pengumuman" breadcrumbs={[{label:'Beranda',path:'/'},{label:'Pengumuman',path:'/pengumuman'},{label:'Detail'}]} />
      <section className="section"><div className="container" style={{maxWidth:800}}>
        {item ? <>
          <span className="badge badge-blue mb-2">{item.kategori}</span>
          <span style={{fontSize:'0.85rem',color:'var(--gray-500)',marginLeft:'0.75rem'}}>{formatDate(item.tanggal)}</span>
          <h1 style={{marginBottom:'1.5rem',marginTop:'0.5rem'}}>{item.judul}</h1>
          <DataState loading={loading} error={null}>
            {markdown ? <MarkdownRenderer content={markdown} /> : <p>{item.deskripsi}</p>}
          </DataState>
          {item.lampiran && <a href={item.lampiran} target="_blank" rel="noreferrer" className="btn btn-primary mt-4">📎 Unduh Dokumen</a>}
          <br/><button className="btn btn-ghost mt-3" onClick={()=>navigate('/pengumuman')}>← Kembali</button>
        </> : <div className="error-wrap">Pengumuman tidak ditemukan.</div>}
      </div></section>
    </div>
  )
}

// ════════════════ BERITA ════════════════════════════════════
export function Berita() {
  const { data, loading, error } = useData('berita')
  const [filter, setFilter] = useState('Semua')
  const CATS = ['Semua', ...new Set(data?.map(b=>b.kategori)||[])]
  const filtered = filter === 'Semua' ? data : data?.filter(b=>b.kategori===filter)
  return (
    <div>
      <PageHeader title="Berita & Kegiatan" subtitle="Kabar terkini seputar akademik, penelitian, prestasi, dan kegiatan Program Studi Teknik Elektro UPGRIS." breadcrumbs={[{label:'Beranda',path:'/'},{label:'Berita'}]} />
      <section className="section"><div className="container">
        <div className="filter-chips">{CATS.map(c=><button key={c} className={`chip${filter===c?' active':''}`} onClick={()=>setFilter(c)}>{c}</button>)}</div>
        <DataState loading={loading} error={error}>
          <div className="news-grid">
            {filtered?.map(b=>(
              <Link key={b.id} to={`/berita/${b.id}`} style={{textDecoration:'none'}}>
                <article className="news-card card-hover">
                  <NewsImage src={b.image} alt={b.judul} />
                  <div className="news-body">
                    <div className="news-meta"><span className={`badge ${KAT_COLOR[b.kategori]||'badge-gray'}`} style={{fontSize:'0.7rem'}}>{b.kategori}</span> {formatDate(b.tanggal)}</div>
                    <p className="news-title">{b.judul}</p>
                    <p className="news-excerpt">{b.ringkasan}</p>
                    <span style={{fontSize:'0.8rem',color:'var(--electric)',fontWeight:600}}>Baca selengkapnya →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </DataState>
      </div></section>
    </div>
  )
}

// ════════════════ BERITA DETAIL ════════════════════════════
export function BeritaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data } = useData('berita')
  const item = data?.find(b => String(b.id) === id)
  const others = data?.filter(b => String(b.id) !== id).slice(0,3) || []
  const { markdown, loading } = useMarkdown(item?.contentUrl||null)
  return (
    <div>
      <PageHeader title="Berita" breadcrumbs={[{label:'Beranda',path:'/'},{label:'Berita',path:'/berita'},{label:'Artikel'}]} />
      <section className="section"><div className="container">
        {item ? (
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'2.5rem'}}>
            <div>
              <div style={{marginBottom:'1rem',display:'flex',gap:'0.75rem',alignItems:'center',flexWrap:'wrap'}}>
                <span className={`badge ${KAT_COLOR[item.kategori]||'badge-gray'}`}>{item.kategori}</span>
                <span style={{fontSize:'0.85rem',color:'var(--gray-500)'}}>{formatDate(item.tanggal)} · {item.penulis}</span>
              </div>
              <h1 style={{marginBottom:'1.5rem'}}>{item.judul}</h1>
              <NewsImage src={item.image} alt={item.judul} className="news-img" height={360} style={{borderRadius:'var(--radius-lg)',width:'100%',objectFit:'cover',marginBottom:'1.5rem'}} />
              <DataState loading={loading} error={null}>
                {markdown ? <MarkdownRenderer content={markdown} /> : <p style={{lineHeight:1.85}}>{item.ringkasan}</p>}
              </DataState>
              <button className="btn btn-ghost mt-4" onClick={()=>navigate('/berita')}>← Kembali ke Berita</button>
            </div>
            <div>
              <h4 style={{marginBottom:'1rem'}}>Berita Lainnya</h4>
              {others.map(b=>(
                <Link key={b.id} to={`/berita/${b.id}`} style={{textDecoration:'none',display:'flex',gap:'0.75rem',marginBottom:'1rem',alignItems:'flex-start'}}>
                  <NewsImage src={b.image} alt={b.judul} height={56} style={{width:80,height:56,objectFit:'cover',borderRadius:6,flexShrink:0}} />
                  <div><p style={{fontSize:'0.85rem',fontWeight:600,color:'var(--navy)',lineHeight:1.4,marginBottom:'0.25rem'}}>{b.judul}</p><p style={{fontSize:'0.75rem',color:'var(--gray-500)'}}>{formatDate(b.tanggal)}</p></div>
                </Link>
              ))}
            </div>
          </div>
        ) : <div className="error-wrap">Berita tidak ditemukan.</div>}
      </div></section>
    </div>
  )
}

// ════════════════ SPMI ════════════════════════════════════
export function SPMI() {
  const { data, loading, error } = useData('spmi')
  const CATS = ['Semua', ...new Set(data?.map(d=>d.kategori)||[])]
  const [filter, setFilter] = useState('Semua')
  const filtered = filter==='Semua' ? data : data?.filter(d=>d.kategori===filter)
  const ICONS = {'Kebijakan Mutu':'📋','Standar Mutu':'📐','SOP':'📝','Formulir':'📄','Laporan AMI':'📊'}
  return (
    <div>
      <PageHeader title="SPMI" subtitle="Sistem Penjaminan Mutu Internal — dokumen kebijakan, standar, prosedur, dan formulir akademik Program Studi Teknik Elektro UPGRIS." breadcrumbs={[{label:'Beranda',path:'/'},{label:'SPMI'}]} />
      <section className="section"><div className="container">
        <div className="filter-chips">{CATS.map(c=><button key={c} className={`chip${filter===c?' active':''}`} onClick={()=>setFilter(c)}>{c}</button>)}</div>
        <DataState loading={loading} error={error}>
          <div style={{display:'grid',gap:'0.75rem'}}>
            {filtered?.map(doc=>(
              <div key={doc.id} className="card" style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{fontSize:'1.75rem',flexShrink:0}}>{ICONS[doc.kategori]||'📄'}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:'var(--navy)',marginBottom:'0.2rem'}}>{doc.nama}</div>
                  <div style={{fontSize:'0.8rem',color:'var(--gray-500)'}}>{doc.nomor} · {doc.kategori} · {doc.tahun}</div>
                </div>
                {doc.fileUrl
                  ? <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">📥 Unduh</a>
                  : <span className="btn btn-disabled btn-sm">Belum Tersedia</span>
                }
              </div>
            ))}
          </div>
        </DataState>
      </div></section>
    </div>
  )
}

// ════════════════ 404 ════════════════════════════════════
export function NotFound() {
  return (
    <div style={{textAlign:'center',padding:'6rem 1rem'}}>
      <div style={{fontSize:'5rem',marginBottom:'1rem'}}>⚡</div>
      <h1 style={{marginBottom:'0.75rem'}}>404 — Halaman Tidak Ditemukan</h1>
      <p style={{color:'var(--gray-500)',marginBottom:'2rem'}}>Halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
    </div>
  )
}
