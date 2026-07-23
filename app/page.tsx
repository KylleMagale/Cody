import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <Image src="/cody-logo.png" alt="Cody logo" width={96} height={96} />
      <h1 className="font-heading text-4xl font-bold text-companion-teal">Cody</h1>
      <p className="max-w-md text-muted-foreground">
        A friendly AI companion for conversation, encouragement, and remembering the things that matter to you.
      </p>
      <div className="flex gap-3">
        <Link href="/login">
          <Button variant="outline">Log in</Button>
        </Link>
        <Link href="/register">
          <Button className="bg-companion-teal hover:bg-companion-teal/90">Get started</Button>
        </Link>
      </div>
      <p className="mt-4 max-w-md text-xs text-muted-foreground">
        Cody is a portfolio project and not a substitute for professional mental health support.
      </p>
    </div>
  )
}