'use client'
import { useEffect, useState } from 'react'
import { supabase, type Reel } from '@/lib/supabase'
import { addReelAction, updateReelAction, deleteReelAction } from '@/app/actions/admin'
import toast from 'react-hot-toast'

function getEmbedUrl(url: string): string {
  const clean = url.endsWith('/') ? url : url + '/'
  return clean + 'embed/'
}

const emptyReel = {
  title: '', instagram_url: '', embed_url: '', thumbnail_url: '', display_order: 0, is_active: true,
}

export default function ReelsManager() {
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyReel)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!sessionStorage.getItem('admin_auth')) {
      window.location.href = '/admin'
    }
  }, [])

  const fetchReels = async () => {
    try {
      const { data, error } = await supabase.from('reels').select('*').order('display_order', { ascending: true })
      if (error) throw error
      setReels(data || [])
    } catch (err: any) {
      const errorMessage = err?.message || JSON.stringify(err) || 'Unknown error'
      console.error('Admin: Failed to fetch reels:', errorMessage, err)
      toast.error(`Fetch failed: ${errorMessage}`)
    }
    setLoading(false)
  }

  useEffect(() => { fetchReels() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.instagram_url) {
      toast.error('Instagram URL is required')
      return
    }

    const payload = {
      ...form,
      embed_url: form.embed_url || getEmbedUrl(form.instagram_url),
    }

    try {
      if (editingId) {
        await updateReelAction(editingId, payload)
        toast.success('Reel updated')
      } else {
        await addReelAction(payload)
        toast.success('Reel added')
      }
      setShowModal(false)
      setEditingId(null)
      setForm(emptyReel)
      fetchReels()
    } catch (err: any) {
      const errorMessage = err?.message || JSON.stringify(err) || 'Unknown error'
      toast.error(`Save failed: ${errorMessage}`)
      console.error('Admin: Failed to save reel:', errorMessage, err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reel?')) return
    try {
      await deleteReelAction(id)
      toast.success('Reel deleted')
      fetchReels()
    } catch (err: any) {
      toast.error(`Failed to delete: ${err?.message || 'Unknown error'}`)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 'clamp(24px, 3vw, 40px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <a href="/admin/dashboard" style={{ fontFamily: '"Inter"', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>← Back to Dashboard</a>
          <h1 style={{ fontFamily: '"Bebas Neue"', letterSpacing: '0.05em', fontWeight: 600, fontSize: '28px', color: 'var(--text)' }}>Reels</h1>
        </div>
        <button className="btn-gold-fill" onClick={() => { setEditingId(null); setForm(emptyReel); setShowModal(true) }}>
          + Add Reel
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {[1, 2, 3].map((i) => <div key={i} className="skeleton-shimmer" style={{ height: '180px', borderRadius: '16px' }} />)}
        </div>
      ) : reels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-2)', borderRadius: '16px', border: '1px solid var(--border-dim)' }}>
          <p style={{ fontFamily: '"Inter"', color: 'var(--text-muted)' }}>No reels yet. Add Instagram reel URLs!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {reels.map((reel) => (
            <div key={reel.id} style={{ background: 'var(--bg-2)', border: '1px solid var(--border-dim)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontFamily: '"Bebas Neue"', letterSpacing: '0.05em', fontWeight: 500, fontSize: '16px', color: 'var(--text)', marginBottom: '8px' }}>{reel.title || 'Untitled'}</h3>
              <p style={{ fontFamily: '"Inter"', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px', wordBreak: 'break-all' }}>{reel.instagram_url}</p>
              <p style={{ fontFamily: '"Inter"', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '12px' }}>Order: {reel.display_order} · {reel.is_active ? '🟢 Active' : '🔴 Inactive'}</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setEditingId(reel.id); setForm({ title: reel.title || '', instagram_url: reel.instagram_url, embed_url: reel.embed_url || '', thumbnail_url: reel.thumbnail_url || '', display_order: reel.display_order, is_active: reel.is_active }); setShowModal(true) }} style={{ color: 'var(--gold)', fontSize: '13px' }}>Edit</button>
                <button onClick={() => handleDelete(reel.id)} style={{ color: '#ef4444', fontSize: '13px' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', maxWidth: '500px', width: '90%', maxHeight: '85vh', overflowY: 'auto', zIndex: 1001 }}>
            <h2 style={{ fontFamily: '"Bebas Neue"', letterSpacing: '0.05em', fontWeight: 600, fontSize: '22px', color: 'var(--text)', marginBottom: '24px' }}>{editingId ? 'Edit Reel' : 'Add Reel'}</h2>
            <form onSubmit={handleSubmit}>
              <label className="form-label">Title</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Reel title" style={{ marginBottom: '16px' }} />

              <label className="form-label">Instagram URL *</label>
              <input className="form-input" value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value, embed_url: getEmbedUrl(e.target.value) })} placeholder="https://www.instagram.com/reel/ABC123/" style={{ marginBottom: '16px' }} />

              <label className="form-label">Thumbnail URL (optional)</label>
              <input className="form-input" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="Fallback image URL" style={{ marginBottom: '16px' }} />

              <label className="form-label">Display Order</label>
              <input className="form-input" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} style={{ marginBottom: '16px' }} />

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"Inter"', fontSize: '14px', color: 'var(--text)', marginBottom: '24px' }}>
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active
              </label>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-gold-fill" style={{ flex: 1, justifyContent: 'center' }}>{editingId ? 'Update' : 'Add Reel'}</button>
                <button type="button" className="btn-gold-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
