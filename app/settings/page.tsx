'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

    useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    }, [])

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
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="space-y-2">
        <h2 className="font-medium">Theme</h2>
        <div className="flex gap-2">
          {mounted ? (
            <>
              <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>
                Light
              </Button>
              <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>
                Dark
              </Button>
              <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>
                System
              </Button>
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
          <Button variant="destructive" onClick={() => setConfirming(true)}>
            Delete my account
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Yes, permanently delete'}
            </Button>
            <Button variant="outline" onClick={() => setConfirming(false)} disabled={deleting}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}