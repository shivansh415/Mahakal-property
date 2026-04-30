'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 769px)',
        isMobile: '(max-width: 768px)',
      },
      (context) => {
        const { isMobile } = context.conditions as { isDesktop: boolean; isMobile: boolean }

        const ctx = gsap.context(() => {
          // ── INTRO ANIMATION (On Load) ──
          const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

          introTl
            .from('.hero-sky', { scale: 1.1, filter: 'brightness(1.5)', duration: 1.5 })
            .from('.hero-text-main', { y: '10vh', opacity: 0, filter: 'blur(10px)', duration: 1.2 }, '-=1')
            .from('.hero-text-sub', { y: '5vh', opacity: 0, duration: 1 }, '-=0.8')
            .from('.hero-building', { y: '10vh', opacity: 0, duration: 1.5 }, '-=1.2')
            .from(['.cloud-left', '.cloud-right', '.cloud-bottom'], { y: '5vh', opacity: 0, duration: 1.5, stagger: 0.1 }, '-=1')

          // ── SCROLL ANIMATION ──
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          })

          // ── PHASE 1: Title fades + scales ──
          tl.to(
            '.hero-title',
            {
              scale: 1.06,
              opacity: 0,
              y: '-3vh',
              duration: 0.35,
              ease: 'power1.out',
            },
            0
          )

          // ── Sky: subtle warm shift ──
          tl.to(
            '.hero-sky',
            {
              scale: 1.04,
              filter: 'brightness(0.92) saturate(1.15)',
              duration: 1,
              ease: 'power1.out',
            },
            0
          )

          // ── Building: rises + zooms ──
          tl.to(
            '.hero-building',
            {
              scale: isMobile ? 1.15 : 1.25,
              y: '-3vh',
              duration: 1,
              ease: 'power1.out',
              transformOrigin: 'bottom center',
            },
            0
          )

          // ── Clouds split apart ──
          tl.to(
            '.cloud-left',
            {
              x: '-60vw',
              y: '-10vh',
              scale: 1.3,
              opacity: 0,
              duration: 0.75,
              ease: 'power1.out',
            },
            0
          )

          tl.to(
            '.cloud-right',
            {
              x: '60vw',
              y: '-8vh',
              scale: 1.3,
              opacity: 0,
              duration: 0.75,
              ease: 'power1.out',
            },
            0
          )

          tl.to(
            '.cloud-bottom',
            {
              y: '30vh',
              scale: 1.2,
              opacity: 0,
              duration: 0.65,
              ease: 'power1.out',
            },
            0
          )

          // ── CTA fades in at end ──
          tl.fromTo(
            '.hero-cta',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power1.out' },
            0.65
          )

          // ── Scroll indicator fades out early ──
          tl.to(
            '.scroll-indicator',
            {
              opacity: 0,
              duration: 0.15,
              ease: 'none',
            },
            0.05
          )
        }, wrapperRef)

        return () => ctx.revert()
      }
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={wrapperRef}
      className="hero-wrapper"
      id="hero"
      style={{
        height: '600vh',
        position: 'relative',
      }}
    >
      {/* ── STICKY INNER ─────────────────────────────────────── */}
      <div
        className="hero-inner"
        style={{
          height: '100vh',
          width: '100%',
          position: 'sticky',
          top: 0,
          overflow: 'hidden',
        }}
      >
        {/* LAYER 1 — Sky Background */}
        <div
          className="hero-sky"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            backgroundImage: 'url("/golden hour sky.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform, filter',
            filter: 'brightness(1) saturate(1)',
          }}
        />

        {/* LAYER 2 — Hero Title */}
        <div
          className="hero-title"
          style={{
            position: 'absolute',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%) translateZ(0)',
            zIndex: 2,
            textAlign: 'center',
            pointerEvents: 'none',
            willChange: 'transform, opacity, filter',
            mixBlendMode: 'multiply',
          }}
        >
          <div
            className="hero-text-main"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(90px, 18vw, 300px)',
              color: '#111111',
              letterSpacing: '0.15em',
              lineHeight: 0.85,
              opacity: 0.9,
              textShadow: '0 10px 40px rgba(255,255,255,0.4)',
              filter: 'blur(0px)',
            }}
          >
            MAHAKAL
          </div>
          <div
            className="hero-text-sub"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(36px, 7.5vw, 120px)',
              color: '#111111',
              letterSpacing: '0.3em',
              marginTop: '4px',
              opacity: 0.8,
              textShadow: '0 4px 20px rgba(255,255,255,0.3)',
            }}
          >
            PROPERTY
          </div>
        </div>

        {/* LAYER 3 — Building */}
        <div
          className="hero-building"
          style={{
            position: 'absolute',
            bottom: '-5%',
            left: '50%',
            transform: 'translateX(-50%)',
            transformOrigin: 'bottom center',
            zIndex: 3,
            willChange: 'transform',
            width: 'clamp(280px, 55vw, 660px)',
          }}
        >
          <Image
            src="/building.png"
            alt="Luxury property skyscraper"
            width={800}
            height={1000}
            priority
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>

        {/* LAYER 4a — Cloud Left */}
        <div
          className="cloud-left"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '-8%',
            width: 'clamp(300px, 65vw, 900px)',
            zIndex: 4,
            willChange: 'transform, opacity',
          }}
        >
          <Image
            src="/white cloud transparent PNG.png"
            alt=""
            width={1200}
            height={600}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        {/* LAYER 4b — Cloud Right */}
        <div
          className="cloud-right"
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '-8%',
            width: 'clamp(260px, 58vw, 800px)',
            zIndex: 4,
            willChange: 'transform, opacity',
            transform: 'scaleX(-1)',
          }}
        >
          <Image
            src="/white cloud transparent PNG.png"
            alt=""
            width={1200}
            height={600}
            priority
            style={{ width: '100%', height: 'auto', filter: 'brightness(0.97)' }}
          />
        </div>

        {/* LAYER 4c — Cloud Bottom */}
        <div
          className="cloud-bottom"
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120vw',
            zIndex: 4,
            willChange: 'transform, opacity',
          }}
        >
          <Image
            src="/white cloud transparent PNG.png"
            alt=""
            width={1600}
            height={800}
            priority
            style={{
              width: '100%',
              height: 'auto',
              filter: 'brightness(1.05)',
              transform: 'scaleY(0.6)',
            }}
          />
        </div>

        {/* LAYER 5 — Dark Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {/* LAYER 6 — CTA (appears at end of scroll) */}
        <div
          className="hero-cta"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 6,
            textAlign: 'center',
            opacity: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(14px, 1.5vw, 18px)',
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.06em',
              marginBottom: '20px',
            }}
          >
            Find Your Space. Own Your Future.
          </p>
          <a
            href="#properties"
            className="btn-gold-outline"
            style={{ fontSize: 'clamp(13px, 1.2vw, 15px)' }}
          >
            Explore Properties →
          </a>
        </div>

        {/* LAYER 7 — Scroll Indicator */}
        <div
          className="scroll-indicator hide-mobile"
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 7,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.45)',
            fontFamily: '"Inter", sans-serif',
            fontSize: '11px',
            letterSpacing: '0.18em',
          }}
        >
          <div>SCROLL</div>
          <div
            style={{
              marginTop: '8px',
              animation: 'scrollBounce 1.4s ease-in-out infinite',
              fontSize: '14px',
            }}
          >
            ↓
          </div>
        </div>
      </div>
    </section>
  )
}
