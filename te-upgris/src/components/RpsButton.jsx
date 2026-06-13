export default function RpsButton({ rpsUrl, mkNama }) {
  if (rpsUrl) {
    return (
      <a
        href={rpsUrl}
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary btn-sm rps-btn"
        title={`Lihat RPS: ${mkNama}`}
      >
        Lihat RPS ↗
      </a>
    )
  }
  return (
    <span
      className="btn btn-disabled btn-sm rps-btn"
      aria-disabled="true"
      title="RPS belum tersedia"
    >
      Belum Tersedia
    </span>
  )
}
