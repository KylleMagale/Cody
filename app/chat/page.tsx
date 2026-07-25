'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, MoreHorizontal, PanelLeftClose, PanelLeft } from 'lucide-react'
import { getGreeting } from '@/lib/greeting'

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
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [greeting, setGreeting] = useState<{ icon: string; text: string } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const loadUser = async () => {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email) setUserEmail(user.email)

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, nickname')
        .eq('id', user.id)
        .single()

      if (!profile?.username || !profile?.nickname) {
        router.push('/onboarding')
        return
      }

      const userNickname = profile?.nickname || ''

      setNickname(userNickname)

      // Generate greeting AFTER nickname is loaded
      setGreeting(getGreeting(userNickname))
    }
  }

  const loadConversations = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('conversations')
      .select('id, title')
      .order('updated_at', { ascending: false })
    setConversations(data || [])
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConversations()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteConversation = async (id: string) => {
    const supabase = createClient()
    await supabase.from('conversations').delete().eq('id', id)
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (conversationId === id) {
      setMessages([])
      setConversationId(null)
    }
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
    router.push('/')
  }

  const currentConversation = conversations.find((c) => c.id === conversationId)
  const currentTitle = currentConversation?.title || 'New conversation'

  const openRename = () => {
    setTitleDraft(currentTitle)
    setRenaming(true)
  }

  const saveRename = async () => {
    if (!conversationId || !titleDraft.trim()) {
      setRenaming(false)
      return
    }
    const supabase = createClient()
    await supabase.from('conversations').update({ title: titleDraft.trim() }).eq('id', conversationId)
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, title: titleDraft.trim() } : c))
    )
    setRenaming(false)
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

      if (!res.ok) {
        const fallbackMessage =
          res.status === 502
            ? "Cody's a bit overwhelmed and reached its current usage limit. Please try again in a moment."
            : "Sorry! Cody couldn't complete your request. Please try again later."
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: fallbackMessage },
        ])
        return
      }

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
      <aside
        className={`flex flex-col overflow-hidden border-r bg-muted/30 transition-all duration-200 ${
          sidebarOpen ? 'w-64 p-3' : 'w-0 border-r-0 p-0'
        }`}
      >
        <div className="flex w-60 items-center justify-between px-2">
          <h1 className="font-heading text-xl font-bold text-companion-teal">Cody</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Hide sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
          >
            <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="w-60">
          <Button onClick={startNewChat} className="mb-3 mt-3 w-full justify-start">
            + New chat
          </Button>
        </div>

        <div className="w-60 flex-1 overflow-y-auto">
          <p className="mb-1 px-2 text-xs font-medium uppercase text-muted-foreground">Recents</p>
          <div className="space-y-1">
            {conversations.map((c) => (
              <div key={c.id} className="group relative flex items-center">
                <button
                  onClick={() => loadConversation(c.id)}
                  className={`w-full truncate rounded-lg py-2 pl-3 pr-8 text-left text-sm hover:bg-muted ${
                    conversationId === c.id ? 'bg-muted font-medium' : ''
                  }`}
                >
                  {c.title}
                </button>

                <DropdownMenu onOpenChange={(open) => setMenuOpenId(open ? c.id : null)}>
                  <DropdownMenuTrigger
                    className={`absolute right-1 flex h-6 w-6 items-center justify-center rounded-md hover:bg-background ${
                      menuOpenId === c.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="end">
                    <DropdownMenuItem
                      onClick={() => handleDeleteConversation(c.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={openRename}>Rename</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        <div className="w-60 border-t pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-muted">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-companion-teal text-sm font-semibold text-white">
                {(nickname || userEmail) ? (nickname || userEmail)[0].toUpperCase() : '?'}
              </span>
              <span className="truncate text-sm">{nickname || userEmail || 'Account'}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <div className="truncate px-2 py-1.5 text-xs font-normal text-muted-foreground">
                {userEmail}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/memory')}>Memory</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/learn-more')}>Learn more</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="relative flex flex-1 flex-col">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Show sidebar"
            className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          >
            <PanelLeft className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        <header className="flex items-center justify-center p-4">
          {renaming ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={saveRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveRename()
                if (e.key === 'Escape') setRenaming(false)
              }}
              className="rounded-md border px-2 py-1 text-center text-sm"
            />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium hover:bg-muted disabled:cursor-default disabled:hover:bg-transparent"
                disabled={!conversationId}
              >
                {currentTitle}
                {conversationId && <ChevronDown className="h-4 w-4" />}
              </DropdownMenuTrigger>
              {conversationId && (
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={openRename}>Rename</DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          )}
        </header>

        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            {greeting && (
              <h2 className="font-heading mb-6 flex items-center gap-3 text-3xl font-semibold">
                <span>{greeting.icon}</span>
                <span>{greeting.text}</span>
              </h2>
            )}
            <form
              onSubmit={handleSend}
              className="flex w-full max-w-2xl items-center gap-2 rounded-2xl bg-muted/50 p-2 shadow-sm"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                disabled={loading}
              />
              <Button type="submit" disabled={loading} className="rounded-xl">
                Send
              </Button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-2xl space-y-3 p-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.role === 'user' ? 'bg-companion-teal text-white' : 'bg-muted text-foreground'
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

            <div className="p-4">
              <form
                onSubmit={handleSend}
                className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl bg-muted/50 p-2 shadow-sm"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading} className="rounded-xl">
                  Send
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}