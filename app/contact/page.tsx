import Link from 'next/link'
import Image from 'next/image'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 pt-10">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/cody-logo.png" alt="Cody logo" width={30} height={30} style={{ borderRadius: 8 }} />
        <span className="font-heading text-lg font-bold text-companion-teal">Cody</span>
      </Link>

      <h1 className="font-heading text-3xl font-bold text-companion-teal">Contact</h1>

      <p className="text-muted-foreground">
        Cody was built by Kylle Adrian Cuyos as a portfolio project. Questions, feedback, or bug
        reports are always welcome.
      </p>

      <a
        href="https://github.com/KylleMagale"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-medium text-companion-blue hover:underline"
      >
        github.com/KylleMagale
      </a>
    </div>
  )
}