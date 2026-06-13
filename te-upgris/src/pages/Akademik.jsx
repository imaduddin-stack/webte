import { useState } from 'react'
import { useData } from '../hooks/useData.js'
import { DataState, PageHeader, RpsButton } from './index.jsx'

const TIPE_COLOR = { 'Kompetensi Utama': 'badge-navy', 'Pendukung': 'badge-gray' }

export default function Akademik() {
  const { data, loading, error } = useData('kurikulum')
  const [activeSmt, setActiveSmt] = useState(1)

  const bySemester = data
    ? Array.from({ length: 8 }, (_, i) => data.filter(mk => mk.semester === i + 1))
    : []

  const totalSKS = data?.reduce((s, mk) => s + mk.sks, 0) || 0
  const totalMK  = data?.length || 0
  const mkKompetensi = data?.filter(mk => mk.tipe === 'Kompetensi Utama').length || 0
  const sksSmt   = bySemester[activeSmt - 1]?.reduce((s, mk) => s + mk.sks, 0) || 0

  return (
    <div>
      <PageHeader
        title="Kurikulum"
        subtitle="Struktur kurikulum Program Studi Teknik Elektro S1 — 8 semester, dirancang memenuhi standar LAMTEK dan kebutuhan industri."
        breadcrumbs={[{ label:'Beranda', path:'/' }, { label:'Akademik' }]}
      />

      <section className="section">
        <div className="container">
          {/* Stats */}
          <div className="grid-4 mb-4">
            {[['8','Semester'],[ `${totalSKS}+`,'Total SKS'],[`${mkKompetensi}`,'MK Kompetensi'],[`${totalMK}`,'Total MK']].map(([n,l]) => (
              <div key={l} className="card text-center">
                <div style={{ fontSize:'2rem', fontWeight:800, color:'var(--electric)' }}>{n}</div>
                <div style={{ color:'var(--gray-500)', fontSize:'0.85rem' }}>{l}</div>
              </div>
            ))}
          </div>

          <DataState loading={loading} error={error}>
            {/* Semester tabs */}
            <div className="tabs mb-4" role="tablist" aria-label="Pilih semester">
              {Array.from({ length: 8 }, (_, i) => {
                const sks = bySemester[i]?.reduce((s, mk) => s + mk.sks, 0) || 0
                return (
                  <button key={i+1}
                    className={`tab-btn${activeSmt === i+1 ? ' active' : ''}`}
                    onClick={() => setActiveSmt(i+1)}
                    role="tab" aria-selected={activeSmt === i+1}>
                    Smt {i+1} <span style={{ fontSize:'0.75rem', opacity:0.7 }}>({sks} SKS)</span>
                  </button>
                )
              })}
            </div>

            {/* Table */}
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Kode</th>
                    <th>Nama Mata Kuliah</th>
                    <th style={{ textAlign:'center' }}>SKS</th>
                    <th>Tipe</th>
                    <th style={{ textAlign:'center' }}>RPS</th>
                  </tr>
                </thead>
                <tbody>
                  {bySemester[activeSmt - 1]?.map((mk, i) => (
                    <tr key={mk.id}
                      style={{ background: mk.tipe === 'Kompetensi Utama' ? '#EFF6FF' : undefined }}>
                      <td style={{ color:'var(--gray-500)' }}>{i + 1}</td>
                      <td><code style={{ fontSize:'0.8rem' }}>{mk.kode}</code></td>
                      <td style={{ fontWeight: mk.tipe === 'Kompetensi Utama' ? 600 : 400 }}>{mk.nama}</td>
                      <td style={{ textAlign:'center', fontWeight:700 }}>{mk.sks}</td>
                      <td><span className={`badge ${TIPE_COLOR[mk.tipe] || 'badge-gray'}`} style={{ fontSize:'0.7rem' }}>{mk.tipe}</span></td>
                      <td style={{ textAlign:'center' }}>
                        <RpsButton rpsUrl={mk.rpsUrl} mkNama={mk.nama} />
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background:'var(--off-white)', fontWeight:700 }}>
                    <td colSpan={3} style={{ textAlign:'right' }}>Total Semester {activeSmt}</td>
                    <td style={{ textAlign:'center' }}>{sksSmt}</td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', flexWrap:'wrap' }}>
              <span className="badge badge-navy">Kompetensi Utama</span>
              <span className="badge badge-gray">Pendukung</span>
              <span style={{ fontSize:'0.8rem', color:'var(--gray-500)' }}>
                Klik "Lihat RPS" untuk membuka Rencana Pembelajaran Semester di tab baru.
              </span>
            </div>
          </DataState>
        </div>
      </section>
    </div>
  )
}
