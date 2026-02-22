'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      // If user came from the reset email link, supabase-js should detect the session from URL.
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setMsg('Invalid or expired reset link. Please request a new one.')
      }
    })()
  }, [])

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMsg('Password updated. Redirecting…')
      setTimeout(() => router.push('/dashboard'), 800)
    } catch (err: any) {
      setMsg(err?.message ?? 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Reset password</h1>
      <p style={{ marginBottom: 20, opacity: 0.8 }}>Enter a new password.</p>

      <form onSubmit={updatePassword} style={{ display: 'grid', gap: 12 }}>
        <label>
          New password
          <input
            style={{ width: '100%', padding: 10, marginTop: 6 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            minLength={6}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1px solid #ddd',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>

        {msg && <div style={{ padding: 12, background: '#f6f6f6', borderRadius: 10 }}>{msg}</div>}
      </form>
    </main>
  )
}