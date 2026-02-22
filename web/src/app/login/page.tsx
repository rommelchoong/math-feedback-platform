'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMsg('Sign up successful. If email confirmation is enabled, check your inbox.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err: any) {
      setMsg(err?.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Math Feedback Platform</h1>
      <p style={{ marginBottom: 24, opacity: 0.8 }}>
        {mode === 'signin' ? 'Sign in to continue' : 'Create an account'}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input
            style={{ width: '100%', padding: 10, marginTop: 6 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>

        <label>
          Password
          <input
            style={{ width: '100%', padding: 10, marginTop: 6 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
<button
  type="button"
  disabled={loading || !email}
  onClick={async () => {
    setLoading(true)
    setMsg(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setMsg('Password reset email sent. Check your inbox.')
    } catch (err: any) {
      setMsg(err?.message ?? 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }}
  style={{
    padding: 12,
    borderRadius: 10,
    border: '1px solid #eee',
    cursor: 'pointer',
    background: 'white',
  }}
>
  Forgot password?
</button>
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
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1px solid #eee',
            cursor: 'pointer',
            background: 'white',
          }}
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>

        {msg && <div style={{ padding: 12, background: '#f6f6f6', borderRadius: 10 }}>{msg}</div>}
      </form>
    </main>
  )
}