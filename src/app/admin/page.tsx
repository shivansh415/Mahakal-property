'use client'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { loginAdmin } from '@/app/actions/admin'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await loginAdmin(password)
      if (res.success) {
        toast.success('Welcome to Mahakal Property Admin')
        // Also set sessionStorage for legacy client-side checks to prevent immediate flicker
        sessionStorage.setItem('admin_auth', 'true')
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 800)
      } else {
        toast.error(res.error || 'Login failed')
        setLoading(false)
      }
    } catch (err) {
      toast.error('An error occurred')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#F0EDE8',
            border: '1px solid rgba(201,169,110,0.3)',
            fontFamily: '"Inter", sans-serif',
          },
        }}
      />

      <div
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: 'clamp(32px, 5vw, 48px)',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A96E, #D4BA82)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Bebas Neue", sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#0A0A0A',
              margin: '0 auto 16px',
            }}
          >
            M
          </div>
          <h1
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              letterSpacing: '0.05em',
              fontWeight: 600,
              fontSize: '24px',
              color: '#F0EDE8',
              marginBottom: '4px',
            }}
          >
            Admin Panel
          </h1>
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '14px',
              color: 'rgba(240,237,232,0.5)',
            }}
          >
            Mahakal Property Dashboard
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: 'block',
              fontFamily: '"Inter", sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(240,237,232,0.5)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: '12px',
              padding: '14px 18px',
              color: '#F0EDE8',
              fontFamily: '"Inter", sans-serif',
              fontSize: '15px',
              outline: 'none',
              marginBottom: '24px',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(201,169,110,0.5)' : 'linear-gradient(135deg, #C9A96E, #D4BA82)',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'opacity 0.3s',
            }}
          >
            {loading ? 'Redirecting...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
