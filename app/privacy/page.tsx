import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 pt-10">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/cody-logo.png" alt="Cody logo" width={30} height={30} style={{ borderRadius: 8 }} />
        <span className="font-heading text-lg font-bold text-companion-teal">Cody</span>
      </Link>

      <h1 className="font-heading text-3xl font-bold text-companion-teal">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>

      <p className="text-muted-foreground">
        Cody is a portfolio project built to demonstrate product and engineering practices. This
        page explains, plainly, what data is collected and how it&apos;s used.
      </p>

      <h2 className="text-lg font-semibold">What we collect</h2>
      <p className="text-muted-foreground">
        Your email address, the username and nickname you choose, your chat messages, and any
        facts Cody remembers about you (things you&apos;ve shared, like hobbies or goals) are
        stored securely in our database.
      </p>

      <h2 className="text-lg font-semibold">How it&apos;s used</h2>
      <p className="text-muted-foreground">
        Your messages are sent to third-party AI providers (Google Gemini and Groq) to generate
        Cody&apos;s replies. We don&apos;t control how those providers handle data on their end —
        check their own privacy policies for details. We never sell your data or share it with
        advertisers.
      </p>

      <h2 className="text-lg font-semibold">Your control over your data</h2>
      <p className="text-muted-foreground">
        You can view and delete individual memories from the Memory page at any time, and
        permanently delete your entire account — including all conversations and memories — from
        Settings. Deletion is immediate and irreversible.
      </p>

      <h2 className="text-lg font-semibold">Security</h2>
      <p className="text-muted-foreground">
        Data is protected with row-level security, meaning only you can access your own account
        data. As a portfolio project, please avoid sharing highly sensitive personal information.
      </p>
    </div>
  )
}