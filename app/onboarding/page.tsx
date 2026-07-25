'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function OnboardingPage() {
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, nickname')
        .eq('id', user.id)
        .single()

      if (profile?.username && profile?.nickname) {
        router.push('/chat')
      } else {
        setChecking(false)
      }
    }
    check()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !nickname.trim()) {
      setError('Please fill in both fields.')
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim(), nickname: nickname.trim() })
        .eq('id', user.id)

        if (error) {
            if (error.message.includes('profiles_username_unique')) {
                setError('That username is already taken. Please choose another.')
            } else if (error.message.includes('profiles_nickname_unique')) {
                setError('That nickname is already taken. Please choose another.')
            } else {
                setError('Something went wrong saving your info. Please try again.')
            }
            return
        }

        router.push('/chat')
    }

  if (checking) return null

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-heading text-2xl font-bold text-companion-teal">Welcome to Cody</h1>
        <p className="text-sm text-muted-foreground">
          Just two quick things before we start chatting.
        </p>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. kylle_dev"
            className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">
            Nickname (what Cody calls you)
          </label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Kylle"
            className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full">Continue</Button>
      </form>
    </div>
  )
}