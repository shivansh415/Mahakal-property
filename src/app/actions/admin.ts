'use server'

import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import type { Property, Reel } from '@/lib/supabase'

// ── Auth Actions ────────────────────────────────────────────────
export async function loginAdmin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      path: '/' 
    })
    return { success: true }
  }
  return { success: false, error: 'Incorrect password' }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
}

export async function checkAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

// ── Properties CRUD ─────────────────────────────────────────────
export async function addPropertyAction(payload: Partial<Property>) {
  if (!(await checkAdmin())) throw new Error('Unauthorized')
  const { data, error } = await supabaseAdmin.from('properties').insert([payload]).select()
  if (error) throw new Error(error.message)
  return data
}

export async function updatePropertyAction(id: string, payload: Partial<Property>) {
  if (!(await checkAdmin())) throw new Error('Unauthorized')
  const { data, error } = await supabaseAdmin.from('properties').update(payload).eq('id', id).select()
  if (error) throw new Error(error.message)
  return data
}

export async function deletePropertyAction(id: string) {
  if (!(await checkAdmin())) throw new Error('Unauthorized')
  const { error } = await supabaseAdmin.from('properties').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

// ── Reels CRUD ──────────────────────────────────────────────────
export async function addReelAction(payload: Partial<Reel>) {
  if (!(await checkAdmin())) throw new Error('Unauthorized')
  const { data, error } = await supabaseAdmin.from('reels').insert([payload]).select()
  if (error) throw new Error(error.message)
  return data
}

export async function updateReelAction(id: string, payload: Partial<Reel>) {
  if (!(await checkAdmin())) throw new Error('Unauthorized')
  const { data, error } = await supabaseAdmin.from('reels').update(payload).eq('id', id).select()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteReelAction(id: string) {
  if (!(await checkAdmin())) throw new Error('Unauthorized')
  const { error } = await supabaseAdmin.from('reels').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return true
}
