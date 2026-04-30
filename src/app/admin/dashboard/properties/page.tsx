'use client'
import { useEffect, useState } from 'react'
import { supabase, type Property } from '@/lib/supabase'
import { addPropertyAction, updatePropertyAction, deletePropertyAction } from '@/app/actions/admin'
import toast from 'react-hot-toast'

const emptyProperty = {
  title: '', location: '', price: '', price_type: 'sale', category: 'residential',
  beds: 0, baths: 0, area: '', description: '', image_url: '',
  is_featured: false, is_active: true, whatsapp_message: '',
}

export default function PropertiesManager() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyProperty)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!sessionStorage.getItem('admin_auth')) {
      window.location.href = '/admin'
    }
  }, [])

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setProperties(data || [])
    } catch (err: any) {
      const errorMessage = err?.message || JSON.stringify(err) || 'Unknown error'
      console.error('Admin: Failed to fetch properties:', errorMessage, err)
      toast.error(`Fetch failed: ${errorMessage}`)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProperties() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.location || !form.price) {
      toast.error('Title, Location, and Price are required')
      return
    }

    const payload: Partial<Property> = {
      ...form,
      price_type: form.price_type as 'sale' | 'rent' | 'lease',
      category: form.category as 'residential' | 'commercial' | 'plot',
      whatsapp_message: form.whatsapp_message || `I am interested in ${form.title} in ${form.location}.`,
    }

    try {
      if (editingId) {
        await updatePropertyAction(editingId, payload)
        toast.success('Property updated')
      } else {
        await addPropertyAction(payload)
        toast.success('Property added')
      }
      setShowModal(false)
      setEditingId(null)
      setForm(emptyProperty)
      fetchProperties()
    } catch (err: any) {
      const errorMessage = err?.message || JSON.stringify(err) || 'Unknown error'
      toast.error(`Save failed: ${errorMessage}`)
      console.error('Admin: Failed to save property:', errorMessage, err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property? This cannot be undone.')) return
    try {
      await deletePropertyAction(id)
      toast.success('Property deleted')
      fetchProperties()
    } catch (err: any) {
      toast.error(`Failed to delete: ${err?.message || 'Unknown error'}`)
    }
  }

  const openEdit = (prop: Property) => {
    setEditingId(prop.id)
    setForm({
      title: prop.title, location: prop.location, price: prop.price,
      price_type: prop.price_type, category: prop.category,
      beds: prop.beds || 0, baths: prop.baths || 0, area: prop.area || '',
      description: prop.description || '', image_url: prop.image_url || '',
      is_featured: prop.is_featured, is_active: prop.is_active,
      whatsapp_message: prop.whatsapp_message || '',
    })
    setShowModal(true)
  }

  const inputStyle: React.CSSProperties = { marginBottom: '16px' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 'clamp(24px, 3vw, 40px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <a href="/admin/dashboard" style={{ fontFamily: '"Inter"', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>← Back to Dashboard</a>
          <h1 style={{ fontFamily: '"Bebas Neue"', letterSpacing: '0.05em', fontWeight: 600, fontSize: '28px', color: 'var(--text)' }}>Properties</h1>
        </div>
        <button className="btn-gold-fill" onClick={() => { setEditingId(null); setForm(emptyProperty); setShowModal(true) }}>
          + Add Property
        </button>
      </div>

      {/* Properties Table */}
      {loading ? (
        <div className="skeleton-shimmer" style={{ height: '200px', borderRadius: '16px' }} />
      ) : properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-2)', borderRadius: '16px', border: '1px solid var(--border-dim)' }}>
          <p style={{ fontFamily: '"Inter"', color: 'var(--text-muted)' }}>No properties yet. Add your first listing!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Inter"', fontSize: '14px', background: 'var(--bg-2)', borderRadius: '16px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Image</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Title</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Location</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Price</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Type</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Featured</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Active</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} style={{ borderBottom: '1px solid var(--border-dim)' }}>
                  <td style={{ padding: '10px 16px' }}>
                    {prop.image_url ? (
                      <img src={prop.image_url} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <div style={{ width: '60px', height: '40px', background: 'var(--bg-3)', borderRadius: '6px' }} />
                    )}
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--text)', fontWeight: 500 }}>{prop.title}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-muted)' }}>{prop.location}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--gold)', fontWeight: 600 }}>{prop.price}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{prop.price_type}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>{prop.is_featured ? '⭐' : '—'}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center', color: prop.is_active ? '#4ade80' : 'var(--text-dim)' }}>{prop.is_active ? '●' : '○'}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    <button onClick={() => openEdit(prop)} style={{ color: 'var(--gold)', marginRight: '12px', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => handleDelete(prop.id)} style={{ color: '#ef4444', fontSize: '13px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '85vh', overflowY: 'auto', zIndex: 1001 }}>
            <h2 style={{ fontFamily: '"Bebas Neue"', letterSpacing: '0.05em', fontWeight: 600, fontSize: '24px', color: 'var(--text)', marginBottom: '24px' }}>
              {editingId ? 'Edit Property' : 'Add Property'}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Property title" style={inputStyle} />

              <label className="form-label">Location *</label>
              <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Vijay Nagar, Indore" style={inputStyle} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Price *</label>
                  <input className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="₹1.5 Cr" style={inputStyle} />
                </div>
                <div>
                  <label className="form-label">Price Type</label>
                  <select className="form-input" value={form.price_type} onChange={(e) => setForm({ ...form, price_type: e.target.value })} style={inputStyle}>
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                    <option value="lease">Lease</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Beds</label>
                  <input className="form-input" type="number" value={form.beds} onChange={(e) => setForm({ ...form, beds: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div>
                  <label className="form-label">Baths</label>
                  <input className="form-input" type="number" value={form.baths} onChange={(e) => setForm({ ...form, baths: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div>
                  <label className="form-label">Area</label>
                  <input className="form-input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="2100 sq ft" style={inputStyle} />
                </div>
              </div>

              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Property description" style={{ ...inputStyle, resize: 'vertical' }} />

              <label className="form-label">Image URL</label>
              <input className="form-input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://images.unsplash.com/..." style={inputStyle} />

              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"Inter"', fontSize: '14px', color: 'var(--text)' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"Inter"', fontSize: '14px', color: 'var(--text)' }}>
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-gold-fill" style={{ flex: 1, justifyContent: 'center' }}>
                  {editingId ? 'Update Property' : 'Add Property'}
                </button>
                <button type="button" className="btn-gold-outline" onClick={() => setShowModal(false)} style={{ padding: '14px 24px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
