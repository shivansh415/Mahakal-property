'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!preloaderRef.current) return
    // Prevent scroll during preloader
    document.body.style.overflow = 'hidden'

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          setIsVisible(false)
        },
      })

      // Phase 1: Fade in the sky background
      tl.to('.preloader-bg', {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      })

      // Phase 2: Building rises from bottom
      tl.to(
        '.preloader-building',
        {
          y: '0%',
          duration: 1.4,
          ease: 'power3.out',
        },
        0.3
      )

      // Phase 3: Clouds drift in
      tl.to(
        '.preloader-cloud-1',
        {
          x: 0,
          opacity: 0.85,
          duration: 1.8,
          ease: 'power2.out',
        },
        0.8
      )

      tl.to(
        '.preloader-cloud-2',
        {
          x: 0,
          opacity: 0.75,
          duration: 1.8,
          ease: 'power2.out',
        },
        1.0
      )

      tl.to(
        '.preloader-cloud-3',
        {
          y: 0,
          opacity: 0.9,
          duration: 1.6,
          ease: 'power2.out',
        },
        1.2
      )

      // Phase 4: "MAHAKAL PROPERTY" letter-by-letter reveal
      tl.to(
        '.loader-char',
        {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          duration: 0.5,
          ease: 'power3.out',
        },
        1.4
      )

      // Phase 5: Progress bar fills
      tl.to(
        '.preloader-progress-fill',
        {
          scaleX: 1,
          duration: 0.7,
          ease: 'power2.inOut',
        },
        2.2
      )

      // Phase 6: Entire preloader exits
      tl.to(
        preloaderRef.current,
        {
          yPercent: -100,
          duration: 0.9,
          ease: 'power3.inOut',
        },
        2.9
      )
    }, preloaderRef)

    return () => ctx.revert()
  }, [])

  if (!isVisible) return null

  // Split "MAHAKAL PROPERTY" into chars
  const brandText = 'MAHAKAL PROPERTY'
  const chars = brandText.split('')

  return (
    <div
      ref={preloaderRef}
      className="preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Sky Background */}
      <div
        className="preloader-bg preloader-sky"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          background:
            'linear-gradient(180deg, #C8D8E8 0%, #D0D8E0 30%, #E8D5B0 70%, #D4C4A0 100%)',
        }}
      />

      {/* Building Image — starts off-screen bottom */}
      <div
        className="preloader-building"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%) translateY(120%)',
          width: '40vw',
          maxWidth: '500px',
          zIndex: 2,
        }}
      >
        <Image
          src="/building.png"
          alt="Mahakal Property"
          width={800}
          height={1000}
          priority
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'brightness(0.95)',
          }}
        />
      </div>

      {/* Cloud 1 — Left side, starts off-screen */}
      <div
        className="preloader-cloud-1"
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '-5%',
          width: '55vw',
          zIndex: 3,
          opacity: 0,
          transform: 'translateX(-200px)',
        }}
      >
        <Image
          src="/white cloud transparent PNG.png"
          alt=""
          width={1200}
          height={600}
          priority
          style={{
            width: '100%',
            height: 'auto',
            filter: 'brightness(1.05)',
          }}
        />
      </div>

      {/* Cloud 2 — Right side, starts off-screen */}
      <div
        className="preloader-cloud-2"
        style={{
          position: 'absolute',
          bottom: '12%',
          right: '-5%',
          width: '50vw',
          zIndex: 3,
          opacity: 0,
          transform: 'translateX(200px) scaleX(-1)',
        }}
      >
        <Image
          src="/white cloud transparent PNG.png"
          alt=""
          width={1200}
          height={600}
          priority
          style={{
            width: '100%',
            height: 'auto',
            filter: 'brightness(1.02)',
          }}
        />
      </div>

      {/* Cloud 3 — Bottom foreground, starts below */}
      <div
        className="preloader-cloud-3"
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '50%',
          transform: 'translateX(-50%) translateY(80px)',
          width: '110vw',
          zIndex: 4,
          opacity: 0,
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
            filter: 'brightness(1.08) blur(1px)',
            transform: 'scaleY(0.7)',
          }}
        />
      </div>

      {/* Brand Text — letter by letter */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(28px, 5vw, 56px)',
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            display: 'flex',
            justifyContent: 'center',
            gap: '2px',
          }}
        >
          {chars.map((char, i) => (
            <span
              key={i}
              className="loader-char"
              style={{
                display: 'inline-block',
                opacity: 0,
                transform: 'translateY(40px)',
                width: char === ' ' ? '0.3em' : 'auto',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '2px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '2px',
          zIndex: 6,
          overflow: 'hidden',
        }}
      >
        <div
          className="preloader-progress-fill"
          style={{
            width: '100%',
            height: '100%',
            background: '#C9A96E',
            borderRadius: '2px',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
          }}
        />
      </div>
    </div>
  )
}
