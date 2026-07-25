'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push('/chat')}
      aria-label="Back to chat"
      className="fixed left-4 top-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-companion-teal text-white transition-colors hover:bg-companion-teal/85"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  )
}