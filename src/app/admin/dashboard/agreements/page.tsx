'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AgreementsPage() {
  const [loading, setLoading] = useState(false)
  const [agreement, setAgreement] = useState('')
  const [form, setForm] = useState({
    landlordName: '', landlordPhone: '', landlordAadhaar: '', landlordAddress: '',
    tenantName: '', tenantPhone: '', tenantAadhaar: '', tenantPermanentAddress: '',
    propertyAddress: '', monthlyRent: '', securityDeposit: '', startDate: '',
    duration: '11 months', lockIn: 'None', noticePeriod: '1 month',
    maintenance: 'Tenant', specialConditions: '',
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!sessionStorage.getItem('admin_auth')) {
      window.location.href = '/admin'
    }
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.landlordName || !form.tenantName || !form.propertyAddress || !form.monthlyRent) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setAgreement('')

    try {
      const res = await fetch('/api/generate-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        let errorMsg = 'Request failed with status ' + res.status
        try {
          const errData = await res.json()
          errorMsg = errData.error || errorMsg
        } catch {
          const text = await res.text().catch(() => '')
          console.error('Non-JSON error response:', text)
        }
        throw new Error(errorMsg)
      }

      let data
      try {
        data = await res.json()
      } catch {
        console.error('Non-JSON response from server')
        throw new Error('Server returned invalid response')
      }

      console.log('API Response:', data)

      if (data.error) throw new Error(data.error)

      setAgreement(data.agreement)
      toast.success('Agreement generated!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate agreement.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    const jsPDF = (await import('jspdf')).default
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(agreement, 170)
    let y = 20
    lines.forEach((line: string) => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.text(line, 20, y)
      y += 6
    })
    doc.save(`Rent_Agreement_${form.tenantName}_${Date.now()}.pdf`)
    toast.success('PDF downloaded!')
  }

  const inputStyle: React.CSSProperties = { marginBottom: '16px' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 'clamp(24px, 3vw, 40px)' }}>
      <a href="/admin/dashboard" style={{ fontFamily: '"Inter"', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>← Back to Dashboard</a>

      {/* Header with AI Badge */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1 style={{ fontFamily: '"Bebas Neue"', fontWeight: 600, fontSize: '28px', color: 'var(--text)' }}>
            Rent Agreement Generator
          </h1>
          <span style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
            color: 'var(--bg)', fontFamily: '"Inter"', fontSize: '11px', fontWeight: 700,
            padding: '4px 12px', borderRadius: '999px', letterSpacing: '0.05em',
          }}>
            AI POWERED
          </span>
        </div>
        <p style={{ fontFamily: '"Inter"', fontSize: '15px', color: 'var(--text-muted)' }}>
          Generate legally-worded rent agreements in seconds using Gemini AI
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: agreement ? '1fr 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>
        {/* Form */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-dim)', borderRadius: '20px', padding: '32px' }}>
          <form onSubmit={handleGenerate}>
            {/* Landlord */}
            <h3 style={{ fontFamily: '"Bebas Neue"', fontWeight: 600, fontSize: '18px', color: 'var(--gold)', marginBottom: '16px' }}>Landlord Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label className="form-label">Full Name *</label><input className="form-input" value={form.landlordName} onChange={(e) => setForm({ ...form, landlordName: e.target.value })} placeholder="Landlord name" /></div>
              <div><label className="form-label">Phone</label><input className="form-input" value={form.landlordPhone} onChange={(e) => setForm({ ...form, landlordPhone: e.target.value })} placeholder="Phone number" /></div>
            </div>
            <div style={{ marginTop: '16px' }}><label className="form-label">Address</label><input className="form-input" value={form.landlordAddress} onChange={(e) => setForm({ ...form, landlordAddress: e.target.value })} placeholder="Full address" style={inputStyle} /></div>

            {/* Tenant */}
            <h3 style={{ fontFamily: '"Bebas Neue"', fontWeight: 600, fontSize: '18px', color: 'var(--gold)', marginBottom: '16px', marginTop: '8px' }}>Tenant Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label className="form-label">Full Name *</label><input className="form-input" value={form.tenantName} onChange={(e) => setForm({ ...form, tenantName: e.target.value })} placeholder="Tenant name" /></div>
              <div><label className="form-label">Phone</label><input className="form-input" value={form.tenantPhone} onChange={(e) => setForm({ ...form, tenantPhone: e.target.value })} placeholder="Phone number" /></div>
            </div>
            <div style={{ marginTop: '16px' }}><label className="form-label">Permanent Address</label><input className="form-input" value={form.tenantPermanentAddress} onChange={(e) => setForm({ ...form, tenantPermanentAddress: e.target.value })} placeholder="Full address" style={inputStyle} /></div>

            {/* Property */}
            <h3 style={{ fontFamily: '"Bebas Neue"', fontWeight: 600, fontSize: '18px', color: 'var(--gold)', marginBottom: '16px', marginTop: '8px' }}>Property Details</h3>
            <label className="form-label">Property Address *</label>
            <input className="form-input" value={form.propertyAddress} onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })} placeholder="Complete property address" style={inputStyle} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label className="form-label">Monthly Rent (₹) *</label><input className="form-input" value={form.monthlyRent} onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })} placeholder="15000" /></div>
              <div><label className="form-label">Security Deposit (₹)</label><input className="form-input" value={form.securityDeposit} onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })} placeholder="30000" /></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div><label className="form-label">Start Date</label><input className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
              <div>
                <label className="form-label">Duration</label>
                <select className="form-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                  <option>11 months</option><option>12 months</option><option>2 years</option><option>3 years</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label className="form-label">Lock-in</label>
                <select className="form-input" value={form.lockIn} onChange={(e) => setForm({ ...form, lockIn: e.target.value })}>
                  <option>None</option><option>3 months</option><option>6 months</option><option>11 months</option>
                </select>
              </div>
              <div>
                <label className="form-label">Notice Period</label>
                <select className="form-input" value={form.noticePeriod} onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })}>
                  <option>1 month</option><option>2 months</option><option>3 months</option>
                </select>
              </div>
              <div>
                <label className="form-label">Maintenance</label>
                <select className="form-input" value={form.maintenance} onChange={(e) => setForm({ ...form, maintenance: e.target.value })}>
                  <option>Tenant</option><option>Landlord</option><option>Shared</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="form-label">Special Conditions</label>
              <textarea className="form-input" rows={3} value={form.specialConditions} onChange={(e) => setForm({ ...form, specialConditions: e.target.value })} placeholder="Any special terms..." style={{ resize: 'vertical', marginBottom: '24px' }} />
            </div>

            <button type="submit" className="btn-gold-fill" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Generating Agreement...' : '✨ Generate Agreement with AI'}
            </button>
          </form>
        </div>

        {/* Preview */}
        {agreement && (
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-dim)', borderRadius: '20px', padding: '32px', position: 'sticky', top: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: '"Bebas Neue"', fontWeight: 600, fontSize: '18px', color: 'var(--text)' }}>Generated Agreement</h3>
              <button className="btn-gold-fill" onClick={handleDownloadPDF} style={{ padding: '10px 20px', fontSize: '13px' }}>
                📥 Download PDF
              </button>
            </div>
            <div style={{ maxHeight: '70vh', overflowY: 'auto', background: 'var(--bg-3)', borderRadius: '12px', padding: '24px', fontFamily: '"Inter"', fontSize: '14px', color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {agreement}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
