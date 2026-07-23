'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

type Memory = {
  id: string
  category: string
  content: string
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('memories')
        .select('id, category, content')
        .order('created_at', { ascending: false })
      setMemories(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from('memories').delete().eq('id', id)
    setMemories((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">What Cody remembers</h1>
      {loading && <p className="text-muted-foreground">Loading...</p>}
      {!loading && memories.length === 0 && (
        <p className="text-muted-foreground">Nothing remembered yet — chat a bit more with Cody.</p>
      )}
      <div className="space-y-2">
        {memories.map((mem) => (
          <div key={mem.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <span className="mr-2 rounded-full bg-muted px-2 py-0.5 text-xs uppercase text-muted-foreground">
                {mem.category}
              </span>
              {mem.content}
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(mem.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}