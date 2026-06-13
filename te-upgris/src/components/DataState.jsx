export default function DataState({ loading, error, children }) {
  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Memuat data...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="error-wrap" role="alert">
        <strong>Gagal memuat data</strong>
        <p style={{ marginTop:'0.5rem', fontSize:'0.85rem' }}>{error}</p>
      </div>
    )
  }
  return children
}
