import { useState } from 'react'

export default function NewsImage({ src, alt, className = 'news-img', height = 180, style = {} }) {
  const [err, setErr]       = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || err) {
    return (
      <div
        className="news-img-placeholder"
        style={{ height, ...style }}
        role="img"
        aria-label={alt || 'Gambar'}
      >
        📰
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      style={{ height, opacity: loaded ? 1 : 0, transition: 'opacity 0.3s', ...style }}
      onError={() => setErr(true)}
      onLoad={() => setLoaded(true)}
      loading="lazy"
    />
  )
}
