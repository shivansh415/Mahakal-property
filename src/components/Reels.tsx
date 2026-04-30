'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase, type Reel } from '@/lib/supabase'

gsap.registerPlugin(ScrollTrigger)

export default function Reels() {
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    async function fetchReels() {
      try {
        const { data, error } = await supabase
          .from('reels')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          
        if (error) {
          console.error('Failed to fetch reels from Supabase:', error)
          setReels([])
        } else {
          setReels(data || [])
        }
      } catch (err) {
        console.error('Supabase fetch crashed:', err)
        setReels([])
      } finally {
        setLoading(false)
      }
    }
    fetchReels()
  }, [])

  useEffect(() => {
    if (loading || !sectionRef.current || reels.length === 0) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reel-card',
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [loading, reels.length])

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--bg)',
        padding: 'clamp(60px, 8vw, 120px) 0',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0 clamp(20px, 5vw, 80px)',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--gold)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Instagram
          </p>
          <h2
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'var(--text-display)',
              color: 'var(--text)',
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}
          >
            Featured Reels
          </h2>
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '16px',
              color: 'var(--text-muted)',
              marginTop: '8px',
            }}
          >
            Explore our latest property showcases
          </p>
        </div>

        {/* Navigation arrows */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={scrollLeft}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--gold)',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.3s, color 0.3s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'var(--gold)'
              el.style.color = 'var(--bg)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'transparent'
              el.style.color = 'var(--gold)'
            }}
          >
            ←
          </button>
          <button
            onClick={scrollRight}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--gold)',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.3s, color 0.3s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'var(--gold)'
              el.style.color = 'var(--bg)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'transparent'
              el.style.color = 'var(--gold)'
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Skeleton Loading */}
      {loading && (
        <div
          style={{
            display: 'flex',
            gap: '24px',
            padding: '0 clamp(20px, 5vw, 80px)',
            overflow: 'hidden',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton-shimmer"
              style={{
                minWidth: '260px',
                aspectRatio: '9/16',
                borderRadius: '16px',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Reels Horizontal Scroll */}
      {!loading && (
        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            padding: '0 clamp(20px, 5vw, 80px)',
            paddingBottom: '8px',
            msOverflowStyle: 'none',
          }}
        >
          {reels.length === 0 ? (
            <div style={{ flex: 1, textAlign: 'center', padding: '60px 20px', background: 'var(--bg-2)', borderRadius: '16px', border: '1px solid var(--border-dim)' }}>
              <p style={{ fontFamily: '"Inter", sans-serif', color: 'var(--text-muted)' }}>No reels available at the moment.</p>
            </div>
          ) : (
            reels.map((reel, index) => {
              const fallbackThumbnails = [
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
              ]
              const thumbnailSrc = reel.thumbnail_url || fallbackThumbnails[index % fallbackThumbnails.length]

              return (
                <a
                  key={reel.id}
                  href={reel.instagram_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reel-card"
                  style={{
                    minWidth: '260px',
                    maxWidth: '260px',
                    aspectRatio: '9/16',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-dim)',
                    background: 'var(--bg-3)',
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    display: 'block',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(201,164,92,0.4)'
                    el.style.transform = 'translateY(-6px)'
                    el.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border-dim)'
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Thumbnail Image */}
                  <img
                    src={thumbnailSrc}
                    alt={reel.title || 'Property reel'}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      inset: 0,
                    }}
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.dataset.retried) {
                        img.dataset.retried = 'true'
                        img.src = fallbackThumbnails[index % fallbackThumbnails.length]
                      }
                    }}
                  />

                  {/* Overlay with play button */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.3)',
                      transition: 'background 0.4s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.85)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      Watch on Instagram
                    </span>
                  </div>

                  {/* Title bar */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '20px 16px 16px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      pointerEvents: 'none',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#fff',
                        margin: 0,
                      }}
                    >
                      {reel.title || 'Property Tour'}
                    </p>
                  </div>

                  {/* Instagram badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(6px)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      pointerEvents: 'none',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="white" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
                    </svg>
                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', color: '#fff', fontWeight: 600, letterSpacing: '0.05em' }}>REEL</span>
                  </div>
                </a>
              )
            })
          )}
        </div>
      )}
    </section>
  )
}
