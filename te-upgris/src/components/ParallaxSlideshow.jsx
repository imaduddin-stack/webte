import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const ICONS = ['🎓','🔧','🔬','👨‍🏫']
const DURATION = 5500 // ms per slide

export default function ParallaxSlideshow({ slides = [] }) {
  const [cur, setCur]         = useState(0)
  const [prog, setProg]       = useState(0)
  const [paused, setPaused]   = useState(false)
  const vpRef    = useRef(null)
  const bgRefs   = useRef([])
  const rafRef   = useRef(null)
  const startRef = useRef(null)
  const pauseRef = useRef(0)
  const navigate = useNavigate()
  const N = slides.length

  // ── parallax on scroll ──────────────────────────────────────
  const applyParallax = useCallback(() => {
    const vp = vpRef.current
    if (!vp) return
    const { top, height } = vp.getBoundingClientRect()
    const winH = window.innerHeight
    if (top > winH || top + height < 0) return
    const rel = (top + height / 2 - winH / 2) / winH
    bgRefs.current.forEach((bg, i) => {
      if (bg) bg.style.transform = i === cur ? `translateY(${rel * 70}px)` : 'translateY(0)'
    })
  }, [cur])

  useEffect(() => {
    window.addEventListener('scroll', applyParallax, { passive: true })
    applyParallax()
    return () => window.removeEventListener('scroll', applyParallax)
  }, [applyParallax])

  // ── timer ───────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (!startRef.current) startRef.current = performance.now()
    const elapsed = performance.now() - startRef.current - pauseRef.current
    const pct = Math.min((elapsed / DURATION) * 100, 100)
    setProg(pct)
    if (pct >= 100) {
      setCur(c => (c + 1) % N)
      startRef.current = performance.now()
      pauseRef.current = 0
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [N])

  const startTimer = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    startRef.current = performance.now()
    pauseRef.current = 0
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  useEffect(() => {
    if (!paused && N > 0) startTimer()
    return () => cancelAnimationFrame(rafRef.current)
  }, [paused, N, startTimer])

  const goTo = useCallback(idx => {
    setCur(((idx % N) + N) % N)
    startRef.current = performance.now()
    pauseRef.current = 0
    setProg(0)
  }, [N])

  // pause/resume on hover
  const onEnter = () => {
    setPaused(true)
    cancelAnimationFrame(rafRef.current)
    pauseRef._enterAt = performance.now()
  }
  const onLeave = () => {
    if (pauseRef._enterAt) {
      pauseRef.current += performance.now() - pauseRef._enterAt
      pauseRef._enterAt = null
    }
    setPaused(false)
  }

  // keyboard nav
  useEffect(() => {
    const h = e => {
      if (e.key === 'ArrowLeft') goTo(cur - 1)
      if (e.key === 'ArrowRight') goTo(cur + 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [cur, goTo])

  // drag/swipe
  const dragX = useRef(null)
  const onPointerDown = e => { dragX.current = e.clientX }
  const onPointerUp   = e => {
    if (dragX.current === null) return
    const dx = e.clientX - dragX.current
    dragX.current = null
    if (Math.abs(dx) > 45) goTo(dx < 0 ? cur + 1 : cur - 1)
  }

  const handleCta = (cta) => {
    if (!cta) return
    if (cta.url) window.open(cta.url, '_blank', 'noreferrer')
    else if (cta.path) navigate(cta.path)
  }

  if (!N) return null

  return (
    <section className="slideshow-wrap" aria-label="Slideshow beranda">
      <div
        className="slideshow-viewport"
        ref={vpRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ userSelect: 'none' }}
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`slide${i === cur ? ' active' : ''}`}
            aria-hidden={i !== cur}
          >
            {/* Background with parallax */}
            <div
              className="slide-bg"
              ref={el => bgRefs.current[i] = el}
              style={{ backgroundImage: `url(${s.image})`, backgroundColor: '#0d1b3e' }}
            />
            {/* Overlay */}
            <div
              className="slide-overlay"
              style={{ background: `linear-gradient(135deg, ${s.overlayColor || 'rgba(10,24,60,0.82)'} 0%, ${(s.overlayColor || 'rgba(10,24,60,0.82)').replace(/[\d.]+\)$/, '0.4)')} 100%)` }}
            />
            {/* Content */}
            <div className="slide-content">
              <div
                className="slide-tag"
                style={{ color: s.tagColor || '#f59e0b', borderColor: `${s.tagColor || '#f59e0b'}66` }}
              >
                {s.tag}
              </div>
              <h2 className="slide-title">{s.title}</h2>
              <p className="slide-subtitle">{s.subtitle}</p>
              <div className="slide-btns">
                {s.ctaPrimary && (
                  <button className="slide-btn-primary" onClick={() => handleCta(s.ctaPrimary)}>
                    {s.ctaPrimary.label} →
                  </button>
                )}
                {s.ctaSecondary && (
                  <button className="slide-btn-outline" onClick={() => handleCta(s.ctaSecondary)}>
                    {s.ctaSecondary.label}
                  </button>
                )}
              </div>
              {s.meta && <p className="slide-meta">{s.meta}</p>}
            </div>
          </div>
        ))}

        {/* Arrow navigation */}
        <button className="slide-arrow slide-prev" onClick={() => goTo(cur - 1)} aria-label="Slide sebelumnya">‹</button>
        <button className="slide-arrow slide-next" onClick={() => goTo(cur + 1)} aria-label="Slide berikutnya">›</button>

        {/* Dots */}
        <div className="slide-dots" role="tablist" aria-label="Pilih slide">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`slide-dot${i === cur ? ' active' : ''}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === cur}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="slide-counter" aria-live="polite" aria-atomic>{cur + 1} / {N}</div>

        {/* Progress bar */}
        <div className="slide-progress" style={{ width: `${prog}%` }} aria-hidden="true" />
      </div>

      {/* Thumbnail strip */}
      <div
        className="slide-thumbs"
        style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
        role="tablist"
        aria-label="Navigasi cepat slide"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`slide-thumb${i === cur ? ' active' : ''}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === cur}
            style={{ border: 'none', textAlign: 'center' }}
          >
            <span className="thumb-icon" aria-hidden="true">{ICONS[i] || '📌'}</span>
            <div className="thumb-label">{s.tag}</div>
            <div className="thumb-sub">{s.meta?.split('·')[0].trim()}</div>
          </button>
        ))}
      </div>
    </section>
  )
}
