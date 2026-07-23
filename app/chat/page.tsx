'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type Conversation = {
  id: string
  title: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('conversations')
      .select('id, title')
      .order('updated_at', { ascending: false })
    setConversations(data || [])
  }

  const loadConversation = async (id: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('messages')
      .select('id, role, content')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    setConversationId(id)
  }

  const startNewChat = () => {
    setMessages([])
    setConversationId(null)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const isNewConvo = !conversationId

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: userMessage.content }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setConversationId(data.conversationId)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: data.reply },
      ])

      if (isNewConvo) loadConversations()
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "Sorry, I couldn't respond just now. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r bg-muted/30 p-3">
        <Button
          onClick={startNewChat}
          className="mb-3 w-full justify-start bg-companion-teal hover:bg-companion-teal/90"
        >
          + New chat
        </Button>

        <div className="flex-1 space-y-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => loadConversation(c.id)}
              className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm hover:bg-muted ${
                conversationId === c.id ? 'bg-muted font-medium' : ''
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div className="mt-2 space-y-1 border-t pt-2">
          <Link href="/memory" className="block rounded-lg px-3 py-2 text-sm hover:bg-muted">
            Memory
          </Link>
          <Link href="/settings" className="block rounded-lg px-3 py-2 text-sm hover:bg-muted">
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        <header className="border-b p-4 text-center">
          <h1 className="font-heading text-lg font-bold text-companion-teal">Cody</h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl space-y-3 p-4">
            {messages.length === 0 && (
              <p className="pt-12 text-center text-muted-foreground">
                Say hello to start the conversation.
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-companion-teal text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl bg-muted px-4 py-2 text-foreground">
                  Cody is typing...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSend} className="mx-auto flex max-w-2xl gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border px-4 py-2"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}