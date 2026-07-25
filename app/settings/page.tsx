'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/back-button'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [nickname, setNickname] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const loadProfile = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setEmail(user.email || '')

    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name, nickname')
      .eq('id', user.id)
      .single()

    if (profile) {
      setUsername(profile.username || '')
      setFullName(profile.full_name || '')
      setNickname(profile.nickname || '')
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    loadProfile()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ full_name: fullName, nickname: nickname }).eq('id', user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const res = await fetch('/api/delete-account', { method: 'POST' })
    if (res.ok) {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } else {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 pt-20">
      <BackButton />
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="space-y-3">
        <h2 className="font-medium">Account</h2>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Email</label>
          <input value={email} disabled className="w-full rounded-xl border bg-muted p-2 text-muted-foreground" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Username</label>
          <input value={username} disabled className="w-full rounded-xl border bg-muted p-2 text-muted-foreground" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Nickname (what Cody calls you)</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="What should Cody call you?"
            className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button onClick={handleSaveProfile} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
        </Button>
      </div>

      <div className="space-y-2">
        <h2 className="font-medium">Theme</h2>
        <div className="flex gap-2">
          {mounted ? (
            <>
              <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
              <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
              <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>System</Button>
            </>
          ) : (
            <>
              <Button variant="outline" disabled>Light</Button>
              <Button variant="outline" disabled>Dark</Button>
              <Button variant="outline" disabled>System</Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-red-300 p-4">
        <h2 className="font-medium text-red-600">Delete account</h2>
        <p className="text-sm text-muted-foreground">
          This permanently deletes your account, conversations, and everything Cody remembers about you. This cannot be undone.
        </p>
        {!confirming ? (
          <Button variant="destructive" onClick={() => setConfirming(true)}>Delete my account</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Yes, permanently delete'}
            </Button>
            <Button variant="outline" onClick={() => setConfirming(false)} disabled={deleting}>Cancel</Button>
          </div>
        )}
      </div>
    </div>
  )
}