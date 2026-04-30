'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { config } from '@/lib/config'
import { buildGeneralEnquiryURL, openWhatsApp } from '@/lib/whatsapp'

gsap.registerPlugin(ScrollTrigger)

export default function AnimatedText() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const words = sectionRef.current!.querySelectorAll('.anim-word')
      if (!words.length) return

      gsap.fromTo(
        words,
        { clipPath: 'inset(0 0 100% 0)', y: 60 },
        {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      // Sub-text fade in
      gsap.fromTo(
        '.anim-subtext',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      // CTA fade in
      gsap.fromTo(
        '.anim-cta',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Helper to wrap words in spans
  const renderWords = (text: string, style: React.CSSProperties) => {
    return text.split(' ').map((word, i) => (
      <span
        key={i}
        className="anim-word"
        style={{
          display: 'inline-block',
          marginRight: '0.3em',
          ...style,
        }}
      >
        {word}
      </span>
    ))
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding"
      style={{
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minHeight: '80vh',
        justifyContent: 'center',
      }}
    >
      {/* Main headline */}
      <div
        style={{
          marginBottom: '40px',
          maxWidth: '900px',
        }}
      >
        {/* Line 1 — Gold */}
        <div
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'var(--text-display)',
            lineHeight: 0.95,
            letterSpacing: '0.02em',
            marginBottom: '8px',
          }}
        >
          {renderWords(config.animatedText.line1, { color: 'var(--gold)' })}
        </div>

        {/* Line 2 — Dark */}
        <div
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'var(--text-display)',
            lineHeight: 0.95,
            letterSpacing: '0.02em',
            marginBottom: '8px',
            opacity: 0.8,
          }}
        >
          {renderWords(config.animatedText.line2, { color: 'var(--text)' })}
        </div>

        {/* Line 3 — Dark Solid */}
        <div
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'var(--text-display)',
            lineHeight: 0.95,
            letterSpacing: '0.02em',
          }}
        >
          {renderWords(config.animatedText.line3, { color: 'var(--text)' })}
        </div>
      </div>

      {/* Subtext */}
      <p
        className="anim-subtext"
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 'var(--text-lead)',
          color: 'var(--text-muted)',
          maxWidth: '560px',
          lineHeight: 1.7,
          marginBottom: '32px',
        }}
      >
        {config.animatedText.subtext}
      </p>

      {/* CTA */}
      <button
        className="anim-cta btn-gold-outline"
        onClick={() => openWhatsApp(buildGeneralEnquiryURL())}
      >
        {config.animatedText.cta} →
      </button>
    </section>
  )
}
