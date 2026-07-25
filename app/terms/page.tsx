import Link from 'next/link'
import Image from 'next/image'

export default function TermsPage() {
  return (
    <div 
        className="mx-auto max-w-2xl space-y-6 p-6 pt-10">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/cody-logo.png" alt="Cody logo" width={30} height={30} style={{ borderRadius: 8 }} />
        <span className="font-heading text-lg font-bold text-companion-teal">Cody</span>
      </Link>

      <h1 className="font-heading text-3xl font-bold text-companion-teal">Terms of Use</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>

      <h2 className="text-lg font-semibold">What Cody is</h2>
      <p className="text-muted-foreground">
        Cody is a portfolio project, not a commercial product or a licensed medical or mental
        health service. It&apos;s provided free of charge, as-is, without warranty of any kind.
      </p>

      <h2 className="text-lg font-semibold">Not a substitute for professional care</h2>
      <p className="text-muted-foreground">
        Cody cannot diagnose, treat, or provide medical or mental health advice. If you&apos;re
        experiencing a crisis or need professional support, please contact a licensed
        professional or a crisis line rather than relying on Cody.
      </p>

      <h2 className="text-lg font-semibold">Service availability</h2>
      <p className="text-muted-foreground">
        Since this project runs on free-tier infrastructure, availability isn&apos;t guaranteed —
        the service may be slow, temporarily unavailable, or discontinued at any time without
        notice.
      </p>

      <h2 className="text-lg font-semibold">Acceptable use</h2>
      <p className="text-muted-foreground">
        Please don&apos;t use Cody to attempt to harm others, break the law, or abuse the
        underlying AI providers&apos; usage policies.
      </p>
    </div>
  )
}