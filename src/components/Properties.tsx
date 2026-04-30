'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase, type Property } from '@/lib/supabase'
import { buildWhatsAppURL, openWhatsApp } from '@/lib/whatsapp'
import toast from 'react-hot-toast'

gsap.registerPlugin(ScrollTrigger)

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Fetch properties from Supabase
  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Failed to fetch properties from Supabase:', error)
          setProperties([])
        } else {
          setProperties(data || [])
        }
      } catch (err) {
        console.error('Supabase fetch crashed:', err)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  // Scroll animations
  useEffect(() => {
    if (loading || !gridRef.current || properties.length === 0) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.property-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [loading, properties.length])

  return (
    <section
      id="properties"
      className="section-padding"
      style={{ background: 'var(--bg)' }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
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
          Our Properties
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
          Featured Listings
        </h2>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton-shimmer"
              style={{
                height: '420px',
                borderRadius: '16px',
              }}
            />
          ))}
        </div>
      )}

      {/* Property Grid */}
      {!loading && (
        <div
          ref={gridRef}
          style={properties.length === 0 ? { display: 'block' } : {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px',
          }}
        >
          {properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-2)', borderRadius: '16px', border: '1px solid var(--border-dim)' }}>
              <p style={{ fontFamily: '"Inter", sans-serif', color: 'var(--text-muted)' }}>No properties available at the moment. Please check back later.</p>
            </div>
          ) : (
            properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEnquiry={() => setSelectedProperty(property)}
              />
            ))
          )}
        </div>
      )}

      {/* WhatsApp Enquiry Drawer */}
      {selectedProperty && (
        <EnquiryDrawer
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </section>
  )
}

// ── Property Card ─────────────────────────────────────────────
function PropertyCard({
  property,
  onEnquiry,
}: {
  property: Property
  onEnquiry: () => void
}) {
  return (
    <div
      className="property-card"
      style={{
        background: 'var(--bg-2)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-dim)',
        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
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
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            aspectRatio: '16/10',
            overflow: 'hidden',
          }}
        >
          <img
            src={
              property.image_url ||
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
            }
            alt={property.title}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLElement).style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLElement).style.transform = 'scale(1)'
            }}
          />
        </div>
        {/* Badge */}
        <span
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            background: 'var(--gold)',
            color: 'var(--bg)',
            fontFamily: '"Inter", sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: '999px',
            letterSpacing: '0.03em',
          }}
        >
          {property.price_type === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '22px 24px 24px' }}>
        {/* Price */}
        <div
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontWeight: 600,
            fontSize: '22px',
            color: 'var(--gold)',
            marginBottom: '6px',
          }}
        >
          {property.price}
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontWeight: 500,
            fontSize: '20px',
            color: 'var(--text)',
            marginBottom: '6px',
            lineHeight: 1.2,
          }}
        >
          {property.title}
        </h3>

        {/* Location */}
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '14px',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {property.location}
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            fontFamily: '"Inter", sans-serif',
            fontSize: '14px',
            color: 'var(--text-muted)',
          }}
        >
          {property.beds !== null && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7v11m0-4h18m0 4V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3" />
              </svg>
              {property.beds} Bed
            </span>
          )}
          {property.baths !== null && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M6 12V5a2 2 0 012-2h1" />
              </svg>
              {property.baths} Bath
            </span>
          )}
          {property.area && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              </svg>
              {property.area}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onEnquiry}
          className="btn-gold-outline"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '12px',
            fontSize: '14px',
          }}
        >
          View Details →
        </button>
      </div>
    </div>
  )
}

// ── Enquiry Drawer ────────────────────────────────────────────
function EnquiryDrawer({
  property,
  onClose,
}: {
  property: Property
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState(
    `I am interested in ${property.title} at ${property.location}.`
  )
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    if (drawerRef.current) {
      gsap.fromTo(
        drawerRef.current,
        { y: '100%' },
        { y: '0%', duration: 0.4, ease: 'power3.out' }
      )
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    if (drawerRef.current) {
      gsap.to(drawerRef.current, {
        y: '100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: onClose,
      })
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    // Log to Supabase
    try {
      await supabase.from('enquiries').insert({
        name,
        phone,
        property_id: property.id,
        property_title: property.title,
        message,
      })
    } catch {
      // Non-blocking
    }

    // Open WhatsApp
    const url = buildWhatsAppURL({
      name,
      phone,
      propertyTitle: property.title,
      propertyUrl: typeof window !== 'undefined' ? window.location.href : '',
      message,
    })
    openWhatsApp(url)
    handleClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={handleClose} />

      {/* Drawer */}
      <div ref={drawerRef} className="drawer-panel" style={{ padding: '32px clamp(20px, 5vw, 40px)' }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: 'var(--text-muted)',
          }}
        >
          ✕
        </button>

        {/* Property Info */}
        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontWeight: 600,
              fontSize: '22px',
              color: 'var(--text)',
              marginBottom: '4px',
            }}
          >
            {property.title}
          </h3>
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '14px',
              color: 'var(--text-muted)',
            }}
          >
            {property.location} · {property.price}
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Your Name *</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Phone Number *</label>
            <input
              className="form-input"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
            />
          </div>
          <div>
            <label className="form-label">Message</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* WhatsApp Button */}
          <button className="whatsapp-btn" onClick={handleSubmit}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Enquiry on WhatsApp
          </button>
        </div>
      </div>
    </>
  )
}
