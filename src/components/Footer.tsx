'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { config } from '@/lib/config'
import { buildGeneralEnquiryURL, openWhatsApp } from '@/lib/whatsapp'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!footerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-cta-content',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.footer-cta-section', start: 'top 80%' },
        }
      )
    }, footerRef)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef}>
      {/* ── PART A — Hero CTA Section ──────────────────────── */}
      <div
        className="footer-cta-section"
        style={{
          position: 'relative',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
          }}
        />

        {/* Content */}
        <div
          className="footer-cta-content"
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <h2
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              letterSpacing: '0.05em',
              fontWeight: 600,
              fontSize: 'clamp(32px, 5vw, 60px)',
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '28px',
              maxWidth: '700px',
            }}
          >
            {config.footerCTA.headline}
          </h2>
          <button
            className="btn-gold-fill"
            style={{ padding: '18px 48px', fontSize: '15px' }}
            onClick={() => openWhatsApp(buildGeneralEnquiryURL())}
          >
            {config.footerCTA.button} →
          </button>
        </div>
      </div>

      {/* ── PART B — Footer Info ───────────────────────────── */}
      <div style={{ background: 'var(--bg-2)', padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 80px)' }}>
        {/* Row 1: Newsletter + Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '48px',
            marginBottom: '48px',
            paddingBottom: '48px',
            borderBottom: '1px solid var(--border-dim)',
          }}
        >
          {/* Newsletter */}
          <div>
            <h3
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                letterSpacing: '0.05em',
                fontWeight: 600,
                fontSize: '24px',
                color: 'var(--text)',
                marginBottom: '20px',
              }}
            >
              Subscribe to our Newsletter!
            </h3>
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '8px',
              }}
            >
              <input
                type="email"
                placeholder="Enter address"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '15px',
                }}
              />
              <button
                style={{
                  color: 'var(--gold)',
                  fontSize: '20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 8px',
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              {config.footerLinks.map((link) => (
                <a
                  key={link}
                  href={link === 'Admin' ? '/admin' : `#${link.toLowerCase()}`}
                  style={{
                    display: 'block',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: 'var(--text)',
                    marginBottom: '12px',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--gold)' }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text)' }}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Social */}
            <div>
              {Object.entries(config.social).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '15px',
                    color: 'var(--text-muted)',
                    marginBottom: '12px',
                    textTransform: 'capitalize',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--gold)' }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)' }}
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Contact Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '48px',
          }}
        >
          <div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'uppercase' }}>
              Head Office
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '15px', color: 'var(--text)', lineHeight: 1.5 }}>
              {config.address.line1}<br />{config.address.line2}
            </p>
          </div>
          <div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'uppercase' }}>
              Email Us
            </p>
            <a href={`mailto:${config.email}`} style={{ fontFamily: '"Inter", sans-serif', fontSize: '15px', color: 'var(--text)', transition: 'color 0.3s' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--gold)' }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text)' }}
            >
              {config.email}
            </a>
          </div>
          <div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'uppercase' }}>
              Call Us
            </p>
            <a href={`tel:${config.phone}`} style={{ fontFamily: '"Inter", sans-serif', fontSize: '15px', color: 'var(--text)', transition: 'color 0.3s' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--gold)' }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text)' }}
            >
              {config.phone}
            </a>
          </div>
        </div>

        {/* Row 3: Giant Watermark */}
        <div
          style={{
            textAlign: 'center',
            overflow: 'hidden',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(80px, 12vw, 200px)',
              color: 'rgba(255,255,255,0.04)',
              lineHeight: 1,
              display: 'block',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            MAHAKAL PROPERTY
          </span>
        </div>

        {/* Row 4: Legal */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-dim)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontFamily: '"Inter", sans-serif',
              fontSize: '13px',
              color: 'var(--text-dim)',
            }}
          >
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)' }} onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-dim)' }}>Terms</a>
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)' }} onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-dim)' }}>Privacy Policy</a>
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)' }} onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-dim)' }}>About Us</a>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontFamily: '"Inter", sans-serif',
              fontSize: '13px',
              color: 'var(--text-dim)',
            }}
          >
            <span>{config.brandName}</span>
            <span>Copyright © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
