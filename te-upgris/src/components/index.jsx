// src/components/Footer.jsx
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
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
              {[['Beranda','/'],['Profil','/profil'],['Akademik','/akademik'],['Dosen','/dosen'],['Penelitian','/penelitian'],['Capstone','/capstone']].map(([l,p]) =>
                <li key={p}><Link to={p}>{l}</Link></li>
              )}
            </ul>
          </div>
          <div>
            <h4>Informasi</h4>
            <ul className="footer-links">
              {[['Pengumuman','/pengumuman'],['Berita & Kegiatan','/berita'],['SPMI','/spmi'],['PMB UPGRIS','https://pmb.upgris.ac.id'],['Website UPGRIS','https://upgris.ac.id']].map(([l,p]) =>
                <li key={p}>
                  {p.startsWith('http')
                    ? <a href={p} target="_blank" rel="noreferrer">{l}</a>
                    : <Link to={p}>{l}</Link>}
                </li>
              )}
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

// src/components/PageHeader.jsx
export function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <div className="page-header">
      <div className="container">
        {breadcrumbs.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom:'0.75rem' }}>
            {breadcrumbs.map((b, i) => (
              <span key={i} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                {i > 0 && <span aria-hidden>›</span>}
                {b.path
                  ? <a href={b.path}>{b.label}</a>
                  : <span style={{ color:'rgba(255,255,255,0.9)' }}>{b.label}</span>
                }
              </span>
            ))}
          </nav>
        )}
        <h1 style={{ marginBottom: subtitle ? '0.5rem' : 0 }}>{title}</h1>
        {subtitle && <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'1.05rem', maxWidth:600 }}>{subtitle}</p>}
      </div>
    </div>
  )
}

// src/components/DataState.jsx
export function DataState({ loading, error, children }) {
  if (loading) return (
    <div className="loading-wrap">
      <div className="loading-spinner" aria-hidden="true" />
      <p>Memuat data...</p>
    </div>
  )
  if (error) return (
    <div className="error-wrap" role="alert">
      <strong>Gagal memuat data</strong>
      <p style={{ marginTop:'0.5rem', fontSize:'0.85rem' }}>{error}</p>
    </div>
  )
  return children
}

// src/components/MarkdownRenderer.jsx
export function MarkdownRenderer({ content }) {
  if (!content) return null

  function parseMarkdown(md) {
    const lines = md.split('\n')
    let html = ''
    let inUl = false, inOl = false, inPre = false, preContent = '', preLang = ''

    const closeList = () => {
      if (inUl) { html += '</ul>'; inUl = false }
      if (inOl) { html += '</ol>'; inOl = false }
    }
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    const inline = s => s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i]

      if (!inPre && raw.startsWith('```')) {
        closeList()
        inPre = true
        preLang = raw.slice(3).trim()
        preContent = ''
        continue
      }
      if (inPre) {
        if (raw === '```') {
          html += `<pre><code class="language-${preLang}">${esc(preContent)}</code></pre>`
          inPre = false
        } else {
          preContent += (preContent ? '\n' : '') + raw
        }
        continue
      }

      if (!raw.trim()) { closeList(); html += ''; continue }
      if (/^#{1,6} /.test(raw)) {
        closeList()
        const lvl = raw.match(/^(#+)/)[1].length
        const txt = inline(raw.slice(lvl + 1))
        html += `<h${lvl}>${txt}</h${lvl}>`
      } else if (raw.startsWith('> ')) {
        closeList()
        html += `<blockquote>${inline(raw.slice(2))}</blockquote>`
      } else if (/^[-*] /.test(raw)) {
        if (!inUl) { closeList(); html += '<ul>'; inUl = true }
        html += `<li>${inline(raw.slice(2))}</li>`
      } else if (/^\d+\. /.test(raw)) {
        if (!inOl) { closeList(); html += '<ol>'; inOl = true }
        html += `<li>${inline(raw.replace(/^\d+\. /, ''))}</li>`
      } else if (raw.trim() === '---') {
        closeList(); html += '<hr />'
      } else if (raw.startsWith('| ')) {
        closeList()
        const cells = raw.split('|').filter((_,idx,arr) => idx !== 0 && idx !== arr.length-1).map(c => c.trim())
        const isHeader = lines[i+1]?.startsWith('|') && lines[i+1]?.includes('---')
        if (isHeader) {
          html += `<table><thead><tr>${cells.map(c=>`<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>`
          i++ // skip separator
        } else {
          html += `<tr>${cells.map(c=>`<td>${inline(c)}</td>`).join('')}</tr>`
          if (!lines[i+1]?.startsWith('| ')) html += '</tbody></table>'
        }
      } else if (/^!\[.*\]\(.*\)/.test(raw)) {
        closeList()
        const m = raw.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
        if (m) html += `<img src="${m[2]}" alt="${m[1]}" loading="lazy" />`
      } else {
        closeList()
        html += `<p>${inline(raw)}</p>`
      }
    }
    closeList()
    return html
  }

  return (
    <div
      className="md-body"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}

// src/components/YoutubeEmbed.jsx
export function YoutubeEmbed({ videoUrl, title = 'Video profil prodi' }) {
  if (!videoUrl) return null
  // Ensure nocookie
  const src = videoUrl
    .replace('youtube.com/watch?v=', 'youtube-nocookie.com/embed/')
    .replace('youtube.com/embed/', 'youtube-nocookie.com/embed/')
  return (
    <div className="yt-wrap">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}

// src/components/RpsButton.jsx
export function RpsButton({ rpsUrl, mkNama }) {
  if (rpsUrl) {
    return (
      <a href={rpsUrl} target="_blank" rel="noreferrer"
        className="btn btn-primary btn-sm rps-btn"
        title={`Lihat RPS: ${mkNama}`}>
        Lihat RPS ↗
      </a>
    )
  }
  return (
    <span className="btn btn-disabled btn-sm rps-btn"
      aria-disabled="true" title="RPS belum tersedia">
      Belum Tersedia
    </span>
  )
}

// src/components/NewsImage.jsx
export function NewsImage({ src, alt, className = 'news-img', height = 180 }) {
  const [err, setErr] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || err) {
    return (
      <div className="news-img-placeholder" style={{ height }}
        role="img" aria-label={alt || 'Gambar berita'}>
        📰
      </div>
    )
  }
  return (
    <img
      src={src} alt={alt || ''}
      className={className}
      style={{ height, opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
      onError={() => setErr(true)}
      onLoad={() => setLoaded(true)}
      loading="lazy"
    />
  )
}

// Need useState import at top - re-export from proper file
import { useState } from 'react'
export default Footer
