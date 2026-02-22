'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.replace('/login')
        return
      }
      setEmail(data.user.email ?? null)
      setLoading(false)
    }
    load()
  }, [router])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <main style={{ padding: 40, fontFamily: 'sans-serif' }}>Loading…</main>

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 26 }}>Dashboard</h1>
      <p style={{ marginTop: 10 }}>Logged in as: <b>{email}</b></p>

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <a href="/practice" style={{ padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
          Go to Practice
        </a>
        <button onClick={signOut} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
          Sign out
        </button>
      </div>
    </main>
  )
}