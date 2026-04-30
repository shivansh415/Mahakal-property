'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { config } from '@/lib/config'
import { buildBuySellRentURL, openWhatsApp } from '@/lib/whatsapp'

gsap.registerPlugin(ScrollTrigger)

const panels = [
  {
    key: 'buy' as const,
    ...config.panels.buy,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
  },
  {
    key: 'sell' as const,
    ...config.panels.sell,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  },
  {
    key: 'rent' as const,
    ...config.panels.rent,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
  },
]

export default function BuySellRent() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Animate each panel on scroll
      panels.forEach((_, i) => {
        const panel = `.bsr-panel-${i}`

        // Parallax background
        gsap.to(`${panel} .bsr-bg`, {
          y: '-15%',
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })

        // Text reveal
        gsap.from(`${panel} .bsr-number`, {
          opacity: 0,
          x: -30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 75%' },
        })

        gsap.from(`${panel} .bsr-desc`, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 75%' },
        })

        gsap.from(`${panel} .bsr-title`, {
          clipPath: 'inset(0 100% 0 0)',
          duration: 1,
          delay: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 70%' },
        })

        gsap.from(`${panel} .bsr-arrow`, {
          opacity: 0,
          x: -40,
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 70%' },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="buy-sell-rent">
      {panels.map((panel, i) => (
        <div
          key={panel.key}
          className={`bsr-panel-${i}`}
          onClick={() => openWhatsApp(buildBuySellRentURL(panel.key))}
          style={{
            position: 'relative',
            height: '85vh',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'filter 0.4s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.filter = 'brightness(1)'
          }}
        >
          {/* Background Image with Parallax */}
          <div
            className="bsr-bg"
            style={{
              position: 'absolute',
              inset: '-15% 0',
              zIndex: 1,
              backgroundImage: `url(${panel.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Dark Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              background: 'rgba(0,0,0,0.45)',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              width: '100%',
              padding: '0 clamp(24px, 6vw, 100px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Left — Number + Description */}
            <div
              style={{
                maxWidth: '320px',
              }}
            >
              <span
                className="bsr-number"
                style={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '16px',
                  display: 'block',
                }}
              >
                {panel.number}
              </span>
              <p
                className="bsr-desc"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 'clamp(13px, 1.2vw, 15px)',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.7,
                }}
              >
                {panel.description}
              </p>
            </div>

            {/* Center — Giant Title */}
            <div
              className="bsr-title"
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(80px, 14vw, 180px)',
                color: '#FFFFFF',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {panel.title}
            </div>

            {/* Right — Arrow */}
            <div
              className="bsr-arrow"
              style={{
                fontSize: 'clamp(48px, 8vw, 100px)',
                color: '#FFFFFF',
                fontWeight: 300,
                transition: 'transform 0.3s',
              }}
            >
              →
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
