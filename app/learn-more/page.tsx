'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { BackButton } from '@/components/back-button'

export default function LearnMorePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [hintPhase, setHintPhase] = useState<'hidden' | 'visible' | 'hiding'>('hidden')
  const [profileVisible, setProfileVisible] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)

    const profileTimer = setTimeout(() => setProfileVisible(true), 2000)

    const showHintTimer = setTimeout(() => setHintPhase('visible'), 4000)
    const hideHintTimer = setTimeout(() => setHintPhase('hiding'), 4000 + 8000)
    const removeHintTimer = setTimeout(() => setHintPhase('hidden'), 4000 + 8000 + 300)

    return () => {
      clearTimeout(profileTimer)
      clearTimeout(showHintTimer)
      clearTimeout(hideHintTimer)
      clearTimeout(removeHintTimer)
    }
  }, [])

  const handleAvatarClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="mx-auto max-w-5xl p-6 pt-20">
      <BackButton />

      <div className="grid gap-10 md:grid-cols-2">
        <div
          className={`flex flex-col items-center space-y-2 text-center ${
            profileVisible ? 'animate-pop-in' : 'opacity-0'
          }`}
        >
          <div className="relative h-6 w-full">
            {hintPhase !== 'hidden' && (
              <p
                className={`absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-companion-amber px-3 py-1 text-xs font-medium text-black shadow-sm ${
                  hintPhase === 'visible' ? 'animate-pop-in-shake' : 'animate-pop-out'
                }`}
              >
                Psst... click me please🤡
              </p>
            )}
          </div>

          <button
            onClick={handleAvatarClick}
            aria-label="Click to toggle theme"
            className="overflow-hidden rounded-full border-4 border-companion-teal transition-transform hover:scale-105"
          >
            {mounted && (
              <Image
                src={theme === 'dark' ? '/avatar-dark.jpg' : '/avatar-light.jpg'}
                alt="Developer avatar"
                width={160}
                height={160}
                className="h-64 w-64 object-cover"
              />
            )}
          </button>

          <p className="font-heading pt-3.5 text-sm text-companion-teal">
            Curious what I&apos;ve built? Take a peek 👀
          </p>
          <a
            href="https://github.com/KylleMagale"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading pt-3 text-sm font-medium text-companion-blue hover:underline"
          >
            github.com/KylleMagale
          </a>

          <h2 className="font-heading pt-4 text-3xl font-bold text-companion-teal">
            Who&apos;s this guy?
          </h2> 
          <p className="font-heading pt-2 text-sm leading-7 text-muted-foreground">
              I&apos;m <span className="font-semibold text-foreground">Kylle Adrian Cuyos</span>, a Computer Engineering
              student at the University of San Jose–Recoletos (USJR) (3rd yr as of 2026... still
              an irregular student, haha).
              <br />
              <br />
              I&apos;m from Cebu, Philippines, and I&apos;m the person behind this simple
              project. I built it because I was bored and had some free time while waiting
              for our removal exam in electronics. Instead of doing nothing, I decided to build something
              fun while learning along the way.
              <br />
              <br />
              My dream is to become a Software Engineer or Software Developer someday after
              I finish college—which i dont know when or to be determine. I&apos;m still learning, making
              mistakes, and improving one step at a time.
              <br />
              <br />
              Thank you for checking out my project! Before you go, I&apos;d like to leave
              you with a quote that keeps me going:
              <br />
              <br />
              <span className="italic font-heading text-lg text-companion-teal">
                &quot;Seven times down, eight times up.&quot;
              </span>
              <br />
              <br />
              If you&apos;re in college or chasing a dream, I hope those words remind you to
              keep moving forward no matter how many setbacks you face.
              <br />
              <br />
              Peace! ✌️
          </p>
      </div>

        <div className="space-y-6">
          <h1 className="font-heading text-3xl font-bold text-companion-teal">About Cody</h1>

          <p className="text-muted-foreground">
            Cody is an AI companion built for friendly conversation, gentle encouragement, and
            remembering the things that matter to you — your name, your hobbies, your goals, and
            the small details that make a conversation feel personal.
          </p>

          <h2 className="text-lg font-semibold">Why we built this</h2>
          <p className="text-muted-foreground">
            Cody started as a portfolio project to explore what it takes to build a thoughtful,
            production-minded AI product — not just a chatbot wrapper, but something with real
            memory, resilience when providers fail, and care around sensitive topics.
          </p>

          <h2 className="text-lg font-semibold">What Cody is not</h2>
          <p className="text-muted-foreground">
            Cody is not a licensed therapist, counselor, or medical professional, and it cannot
            diagnose or treat any condition. It&apos;s a supportive conversational companion, not a
            replacement for professional mental health care. If you&apos;re going through something
            serious, please reach out to a real person — a professional, or someone you trust.
          </p>

          <h2 className="text-lg font-semibold">Your data</h2>
          <p className="text-muted-foreground">
            Everything Cody remembers about you is visible and deletable from the Memory page at
            any time, and you can permanently delete your account and all associated data from
            Settings.
          </p>
        </div>
      </div>
    </div>
  )
}