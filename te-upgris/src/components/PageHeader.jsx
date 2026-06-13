export default function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <div className="page-header">
      <div className="container">
        {breadcrumbs.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom:'0.75rem' }}>
            {breadcrumbs.map((b, i) => (
              <span key={i} style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                {i > 0 && <span aria-hidden="true">›</span>}
                {b.path
                  ? <a href={b.path}>{b.label}</a>
                  : <span style={{ color:'rgba(255,255,255,0.9)' }}>{b.label}</span>
                }
              </span>
            ))}
          </nav>
        )}
        <h1 style={{ marginBottom: subtitle ? '0.5rem' : 0 }}>{title}</h1>
        {subtitle && (
          <p style={{ color:'rgba(255,255,255,0.78)', fontSize:'1.05rem', maxWidth:640, lineHeight:1.65 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
