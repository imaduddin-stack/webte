export default function YoutubeEmbed({ videoUrl, title = 'Video profil prodi' }) {
  if (!videoUrl) return null

  // Normalize to nocookie embed URL
  let src = videoUrl
  src = src.replace('youtube.com/watch?v=', 'youtube-nocookie.com/embed/')
  src = src.replace('www.youtube.com/embed/', 'www.youtube-nocookie.com/embed/')
  if (!src.includes('youtube-nocookie.com')) {
    src = src.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/')
  }

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
