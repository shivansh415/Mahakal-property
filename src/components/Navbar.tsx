'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { config } from '@/lib/config'
import { buildGeneralEnquiryURL, openWhatsApp } from '@/lib/whatsapp'

const navLinks = [
  { label: 'Properties', href: '#properties' },
  { label: 'Buy', href: '#buy-sell-rent' },
  { label: 'Sell', href: '#buy-sell-rent' },
  { label: 'Rent', href: '#buy-sell-rent' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY

      // Blur background after 100px
      setScrolled(currentY > 100)

      // Hide on scroll down, show on scroll up
      if (currentY > lastScrollY.current && currentY > 200) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animate mobile menu
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo(
        '.mobile-menu-link',
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.2,
        }
      )
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 clamp(20px, 4vw, 60px)',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
          background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(17,17,17,0.06)'
            : '1px solid transparent',
          boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.03)' : 'none',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '22px',
              color: '#FFFFFF',
              letterSpacing: '0.05em',
              paddingTop: '2px', // visual center for bebas
            }}
          >
            M
          </div>
          <span
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '24px',
              color: scrolled ? '#111111' : '#111111',
              letterSpacing: '0.08em',
              paddingTop: '3px',
            }}
          >
            {config.brandName}
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div
          className="hide-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: scrolled ? '#555555' : '#333333',
                position: 'relative',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLElement).style.color = 'var(--gold)'
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLElement).style.color = scrolled ? '#555555' : '#333333'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <button
          className="btn-gold-fill hide-mobile"
          style={{ padding: '12px 32px', fontSize: '13px' }}
          onClick={() => openWhatsApp(buildGeneralEnquiryURL())}
        >
          Enquire Now
        </button>

        {/* Mobile Hamburger */}
        <button
          className="hide-desktop"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: menuOpen ? '0px' : '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            zIndex: 102,
          }}
        >
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: '#111111',
              borderRadius: '1px',
              transition: 'transform 0.3s, opacity 0.3s',
              transform: menuOpen
                ? 'rotate(45deg) translateY(0px)'
                : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: '#111111',
              borderRadius: '1px',
              transition: 'opacity 0.3s',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: '#111111',
              borderRadius: '1px',
              transition: 'transform 0.3s, opacity 0.3s',
              transform: menuOpen
                ? 'rotate(-45deg) translateY(0px)'
                : 'none',
              marginTop: menuOpen ? '-4px' : '0',
            }}
          />
        </button>
      </nav>

      {/* Mobile Full-Screen Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(10px)',
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 40px',
            gap: '16px',
          }}
        >
          {/* Close button inside menu */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '44px',
              height: '44px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 105,
            }}
            aria-label="Close menu"
          >
            <div style={{ position: 'relative', width: '24px', height: '24px' }}>
              <span style={{ position: 'absolute', top: '11px', width: '24px', height: '2px', background: '#111111', transform: 'rotate(45deg)' }} />
              <span style={{ position: 'absolute', top: '11px', width: '24px', height: '2px', background: '#111111', transform: 'rotate(-45deg)' }} />
            </div>
          </button>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-menu-link"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 'clamp(48px, 12vw, 80px)',
                color: '#111111',
                textDecoration: 'none',
                opacity: 0,
                transition: 'color 0.3s',
                lineHeight: 1,
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLElement).style.color = 'var(--gold)'
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLElement).style.color = '#111111'
              }}
            >
              {link.label}
            </a>
          ))}

          <button
            className="mobile-menu-link btn-gold-fill"
            style={{
              marginTop: '40px',
              opacity: 0,
              padding: '16px 48px',
              fontSize: '16px',
            }}
            onClick={() => {
              setMenuOpen(false)
              openWhatsApp(buildGeneralEnquiryURL())
            }}
          >
            Enquire Now
          </button>
        </div>
      )}
    </>
  )
}
