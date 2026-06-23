'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { config } from '@/lib/config'

export default function AdminDashboard() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ properties: 0, active: 0, enquiries: 0 })
  const [enquiries, setEnquiries] = useState<Array<{ id: string; name: string; phone: string; property_title: string; created_at: string }>>([])

  // Auth guard — only runs client-side after mount
  useEffect(() => {
    setMounted(true)
    if (!sessionStorage.getItem('admin_auth')) {
      window.location.href = '/admin'
    }
  }, [])

  // Fetch stats
  useEffect(() => {
    if (!mounted) return

    async function fetchStats() {
      try {
        const [propRes, activeRes, enqRes] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('enquiries').select('id', { count: 'exact', head: true }),
        ])
        setStats({
          properties: propRes.count || 0,
          active: activeRes.count || 0,
          enquiries: enqRes.count || 0,
        })

        const { data } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        if (data) setEnquiries(data)
      } catch (err) {
        console.error('Admin Dashboard: Failed to fetch stats:', err)
      }
    }
    fetchStats()
  }, [mounted])

  // Don't render until mounted (avoids hydration mismatch with sessionStorage)
  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton-shimmer" style={{ width: '200px', height: '24px', borderRadius: '8px' }} />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Properties', value: stats.properties, icon: '🏠' },
    { label: 'Active Listings', value: stats.active, icon: '✅' },
    { label: 'Total Enquiries', value: stats.enquiries, icon: '📩' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar hide-mobile" style={{ width: '260px', padding: '24px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Bebas Neue"', fontWeight: 700, fontSize: '14px', color: 'var(--bg)' }}>M</div>
            <span style={{ fontFamily: '"Bebas Neue"', letterSpacing: '0.05em', fontWeight: 600, fontSize: '15px', color: 'var(--text)' }}>{config.brandName}</span>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {config.admin.sidebarLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`admin-nav-item ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="admin-nav-item"
          onClick={() => {
            sessionStorage.removeItem('admin_auth')
            window.location.href = '/admin'
          }}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 'clamp(24px, 3vw, 40px)' }}>
        <h1 style={{ fontFamily: '"Bebas Neue"', letterSpacing: '0.05em', fontWeight: 600, fontSize: '28px', color: 'var(--text)', marginBottom: '32px' }}>
          Dashboard
        </h1>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {statCards.map((card) => (
            <div key={card.label} className="stat-card">
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.icon}</div>
              <div style={{ fontFamily: '"Bebas Neue"', letterSpacing: '0.05em', fontWeight: 600, fontSize: '32px', color: 'var(--text)', marginBottom: '4px' }}>{card.value}</div>
              <div style={{ fontFamily: '"Inter"', fontSize: '14px', color: 'var(--text-muted)' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Supabase not configured notice */}
        {!isSupabaseConfigured && (
          <div style={{ background: 'var(--bg-2)', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <p style={{ fontFamily: '"Inter"', fontSize: '14px', color: 'var(--gold)' }}>
              ⚠️ Supabase is not configured yet. Add your credentials to <code>.env.local</code> to enable live data.
            </p>
          </div>
        )}

        {/* Recent Enquiries */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-dim)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontFamily: '"Bebas Neue"', letterSpacing: '0.05em', fontWeight: 600, fontSize: '20px', color: 'var(--text)', marginBottom: '20px' }}>
            Recent Enquiries
          </h2>

          {enquiries.length === 0 ? (
            <p style={{ fontFamily: '"Inter"', color: 'var(--text-muted)', fontSize: '14px' }}>
              No enquiries yet. They&apos;ll appear here once users submit via WhatsApp.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Inter"', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Property</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq.id} style={{ borderBottom: '1px solid var(--border-dim)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{enq.name || '—'}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{enq.phone || '—'}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{enq.property_title || '—'}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
