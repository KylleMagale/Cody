'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Moon, Sun, Plus } from 'lucide-react'

const faqs = [
  {
    q: 'What is Cody and how does it work?',
    a: 'Cody is an AI companion built for real conversation. Unlike chatbots that forget you the moment you close the tab, Cody maintains a long-term memory of your conversations — your goals, your setbacks, the things that matter to you. Every exchange makes Cody more attuned to who you are. Just open a conversation and Cody meets you exactly where you are.',
  },
  {
    q: 'What can I use Cody for?',
    a: 'People use Cody for daily emotional check-ins, thinking through difficult decisions, processing stress, journaling out loud, and staying accountable to personal goals. Some users talk to Cody every morning; others reach out when they need someone to think alongside them. There is no wrong way — Cody adapts entirely to how you communicate and what you need.',
  },
  {
    q: 'Can I trust it?',
    a: "Your conversations are stored securely with row-level access controls, meaning only you can ever see your own data. You can view or delete everything Cody remembers about you at any time from the Memory page, and permanently delete your account and all associated data from Settings. Cody is a portfolio project, so treat it like a demo rather than a place for highly sensitive information — but your data is never sold, shared with advertisers, or shown to other users.",
  },
  {
    q: 'How much does it cost to use?',
    a: "Cody is completely free — no credit card, no subscription, no hidden tiers. It's a portfolio project built to demonstrate real product engineering, not a commercial product.",
  },
]

function MiniChatUI() {
  const convos = ['Morning check-in', 'Weekend plans', 'Work anxiety', 'Book ideas', 'Family call']
  return (
    <div style={{ display: 'flex', height: '100%', fontSize: 0 }}>
      <div
        style={{
          width: 112,
          background: '#173636',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          padding: '10px 6px',
          gap: 2,
        }}
      >
        <div
          style={{
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            color: '#FFFFFF',
            padding: '0 6px 8px',
            letterSpacing: '-0.3px',
          }}
        >
          Cody
        </div>
        <div
          style={{
            fontSize: 8,
            color: '#5A9A9A',
            fontWeight: 600,
            padding: '0 6px 4px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Chats
        </div>
        {convos.map((c, i) => (
          <div
            key={c}
            style={{
              fontSize: 9,
              padding: '5px 8px',
              borderRadius: 8,
              fontWeight: i === 0 ? 600 : 400,
              background: i === 0 ? '#2D6A6A' : 'transparent',
              color: i === 0 ? '#FFFFFF' : '#6AACAC',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {c}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FAFAFA', minWidth: 0 }}>
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #EBEBEB',
            fontSize: 9,
            fontWeight: 600,
            color: '#444',
            flexShrink: 0,
          }}
        >
          Morning check-in
        </div>

        <div style={{ flex: 1, padding: '10px 10px 4px', display: 'flex', flexDirection: 'column', gap: 7, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, maxWidth: '78%' }}>
            <div style={{ background: '#EBEBEB', borderRadius: '12px 12px 12px 3px', padding: '5px 9px', fontSize: 8, color: '#444', lineHeight: 1.5 }}>
              Good morning! How are you feeling today? ☀️
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ background: '#2D6A6A', borderRadius: '12px 12px 3px 12px', padding: '5px 9px', fontSize: 8, color: '#FFF', lineHeight: 1.5, maxWidth: '70%' }}>
              A bit anxious about work honestly
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, maxWidth: '85%' }}>
            <div style={{ background: '#EBEBEB', borderRadius: '12px 12px 12px 3px', padding: '5px 9px', fontSize: 8, color: '#444', lineHeight: 1.5 }}>
              Remember that presentation you nailed last Tuesday? You&apos;ve got this. 💚
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ background: '#2D6A6A', borderRadius: '12px 12px 3px 12px', padding: '5px 9px', fontSize: 8, color: '#FFF', lineHeight: 1.5, maxWidth: '60%' }}>
              I forgot you remembered that 🥹
            </div>
          </div>
        </div>

        <div style={{ padding: '6px 8px', borderTop: '1px solid #EBEBEB', flexShrink: 0 }}>
          <div style={{ background: '#F0F0F0', borderRadius: 10, padding: '5px 8px', fontSize: 8, color: '#AAA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Message Cody...</span>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#2D6A6A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 0, height: 0, borderLeft: '5px solid white', borderTop: '3px solid transparent', borderBottom: '3px solid transparent', marginLeft: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Laptop mockup — screen only, no keyboard base
function LaptopMockup() {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0 40px', width: '100%', maxWidth: 460, margin: '0 auto' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '72%',
          height: 32,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ perspective: '1300px', perspectiveOrigin: '50% 40%' }}>
          <div
            className="laptop-tilt"
            style={{
              transformStyle: 'preserve-3d',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
          <div
            style={{
              width: '100%',
              maxWidth: 460,
              background: 'linear-gradient(160deg, #424242 0%, #373737 100%)',
              borderRadius: '16px 16px 12px 12px',
              padding: '8px 8px 10px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.18)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5A5A5A' }} />
            </div>
            <div style={{ height: 278, borderRadius: '10px', overflow: 'hidden' }}>
              <MiniChatUI />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: isOpen ? '1px solid rgba(31,84,84,0.22)' : '1px solid var(--border)',
        background: 'var(--card)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          gap: 16,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: 'var(--foreground)',
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {q}
        </span>
        <div
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: isOpen ? '2px solid var(--companion-teal)' : '2px solid var(--border)',
            background: isOpen ? 'rgba(31,84,84,0.08)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.28s ease-out, border-color 0.2s ease, background 0.2s ease',
          }}
        >
          <Plus size={14} style={{ color: isOpen ? 'var(--companion-teal)' : 'var(--muted-foreground)' }} strokeWidth={2.5} />
        </div>
      </button>
      <div
        style={{
          maxHeight: isOpen ? 400 : 0,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
          overflow: 'hidden',
          transition: 'max-height 0.32s ease-out, opacity 0.24s ease-out, transform 0.24s ease-out',
        }}
      >
        <p
          style={{
            padding: '0 24px 22px',
            margin: 0,
            fontSize: 14,
            lineHeight: 1.75,
            color: 'var(--muted-foreground)',
          }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isDark = mounted && theme === 'dark'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* NAV */}
      <nav style={{ background: 'var(--companion-teal)', position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/cody-logo.png" alt="Cody logo" width={34} height={34} style={{ borderRadius: 10 }} />
            <span className="font-heading" style={{ fontWeight: 700, fontSize: 22, color: 'white', letterSpacing: '-0.4px' }}>
              Cody
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label="Toggle dark mode"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
            <button
              onClick={() => router.push('/login')}
              style={{
                padding: '8px 18px',
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.88)',
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.32)',
                cursor: 'pointer',
              }}
            >
              Continue
            </button>
            <button
              onClick={() => router.push('/register')}
              style={{
                padding: '9px 20px',
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 700,
                color: '#1C1200',
                background: 'var(--companion-amber)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(245,166,35,0.35)',
              }}
            >
              Try Cody
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1152, margin: '0 auto', padding: 'clamp(40px, 8vw, 80px) 20px clamp(50px, 10vw, 100px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
          <div style={{ flex: '1 1 380px', maxWidth: 520 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 50,
                background: 'rgba(31,84,84,0.09)',
                marginBottom: 28,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--companion-teal)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--companion-teal)', letterSpacing: '0.02em' }}>
                Always here for you
              </span>
            </div>

            <h1 className="font-heading" style={{ fontWeight: 700, fontSize: 'clamp(38px, 5vw, 58px)', lineHeight: 1.1, letterSpacing: '-1px', margin: '0 0 20px' }}>
              A friend who remembers, <span style={{ color: 'var(--companion-teal)' }}>always here</span> to listen
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--muted-foreground)', margin: '0 0 36px', maxWidth: 440 }}>
              Cody is your AI companion that grows with you — recalling your stories, celebrating your wins, and showing up whenever you need to talk.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/register')}
                style={{
                  padding: '15px 34px',
                  borderRadius: 50,
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#1C1200',
                  background: 'var(--companion-amber)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(245,166,35,0.38)',
                }}
              >
                Try Cody — it&apos;s free
              </button>
              <span style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 500 }}>No credit card needed</span>
            </div>
          </div>

          <div style={{ flex: '1 1 420px', display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0 }}>
            <LaptopMockup />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="font-heading" style={{ fontWeight: 700, fontSize: 34, letterSpacing: '-0.5px', margin: '0 0 10px' }}>
            Questions? We&apos;ve got answers.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted-foreground)', margin: 0 }}>Everything you need to know about Cody.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '28px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Image src="/cody-logo.png" alt="Cody logo" width={26} height={26} style={{ borderRadius: 8 }} />
            <span className="font-heading" style={{ fontWeight: 700, fontSize: 15 }}>
              Cody
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: 0 }}>© 2026 Cody. Made with care for real humans.</p>
          {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <a key={link.label} href={link.href} style={{ fontSize: 13, color: 'var(--muted-foreground)', textDecoration: 'none', fontWeight: 500 }}>
                {link.label}
              </a>
            ))}
        </div>
      </footer>
    </div>
  )
}