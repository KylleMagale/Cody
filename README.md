# Cody — AI Companion

Cody is an AI companion for friendly conversation, emotional check-ins, and long-term personalized memory. Built as a portfolio project to demonstrate full-stack development, AI integration, authentication, database design, and thoughtful safety design.

**Live demo:** https://talktocody.vercel.app/

> ⚠️ Cody is a portfolio project, not a substitute for professional mental health care. If you're in crisis, please contact a real crisis line (see below) rather than relying on this app.

## Features

- 🔐 Authentication (register, login, session handling) via Supabase Auth
- 💬 Real-time AI chat with markdown support
- 🧠 Long-term memory — Cody remembers facts you share across sessions (name, hobbies, goals, etc.)
- 🔄 Automatic AI provider failover (Gemini → Groq) — if one provider is down, the conversation continues uninterrupted
- 🛟 A safety gate that detects crisis/self-harm language and responds with real crisis resources instead of an AI-generated reply
- 📝 Conversation summarization to keep long chats efficient
- 🌗 Light/dark mode

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (Auth, Postgres, Row Level Security) |
| AI | Google Gemini (primary), Groq (automatic fallback) |
| Hosting | Vercel |

## Architecture

```
User message
   → API route receives it
   → Safety check (pattern match for crisis language)
        → matched: return static crisis-resource response, log, stop
        → clear: continue
   → Load memory + conversation context, build prompt
   → Call Gemini (fallback to Groq on failure)
   → Save reply, update memory, return to user
```

## Running locally

1. Clone the repo:
   ```
   git clone https://github.com/KylleMagale/Cody.git
   cd cody
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   GEMINI_API_KEY=your-gemini-key
   GROQ_API_KEY=your-groq-key
   ```
4. Run the dev server:
   ```
   npm run dev
   ```

## Safety note

The crisis-detection pattern list in this project is intentionally simple and built for demonstration purposes — it is **not** a production-grade safety system and won't catch every case. If you're building on this for real-world use, pair it with a proper moderation API and involve people with relevant clinical/safety expertise.

## Crisis resources

- 🇵🇭 Philippines — National Center for Mental Health Crisis Hotline: 1553 (nationwide), 1800-1888-1553 (toll-free)
- 🌍 Elsewhere — please look up your local crisis line or emergency number

## Status

Actively in development as a portfolio project.