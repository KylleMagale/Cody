import { containsCrisisLanguage, CRISIS_RESPONSE } from '@/lib/safety'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Cody, a warm and supportive AI companion. You chat casually, remember details the user shares, and offer gentle encouragement. You are not a therapist and should never diagnose or give clinical advice. If someone expresses sadness, stress, or difficulty, respond with warmth, but gently encourage them to talk to a trusted person or professional if it seems serious — don't try to counsel them through it yourself. Keep replies short — 2 to 4 sentences maximum, like a real text message exchange, not an essay. Only go longer if the user explicitly asks for detail or a deeper explanation. Avoid packing multiple questions or suggestions into one reply — pick one thing to focus on.

After forming your reply, check if the user shared any new, meaningful, long-term fact worth remembering (their name, a hobby, a goal, a favorite thing, a relationship, a pet). Small talk or one-off details don't count — only things worth recalling weeks later.

Respond ONLY with valid JSON in exactly this shape, no text outside the JSON:
{"reply": "your conversational reply text here", "memories": [{"category": "hobby", "content": "short fact, e.g. plays basketball on weekends"}]}

Valid categories are: hobby, goal, favorite, relationship, pet, other. If there's nothing new to remember, use an empty array for memories.`

async function callGemini(message: string, systemPrompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: 'low' },
          maxOutputTokens: 1024,
        },
      }),
    }
  )
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Gemini request failed (${res.status}): ${errorBody}`)
  }
    const data = await res.json()
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined
        if (!raw) {
            throw new Error(`Gemini returned no usable content: ${JSON.stringify(data)}`)
        }
        try {
            return JSON.parse(raw) as { reply: string; memories: { category: string; content: string }[] }
        } catch {
            throw new Error(`Gemini returned invalid JSON: ${raw}`)
        }
     }                      

async function callGeminiPlainText(prompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          thinkingConfig: { thinkingLevel: 'low' },
        },
      }),
    }
  )
  if (!res.ok) throw new Error('Gemini summarization failed')
  const data = await res.json()
  return data.candidates[0].content.parts[0].text as string
}

async function callGroq(message: string, systemPrompt: string) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
    }),
  })
  if (!res.ok) throw new Error('Groq request failed')
  const data = await res.json()
  const raw = data.choices[0].message.content as string
  return JSON.parse(raw) as { reply: string; memories: { category: string; content: string }[] }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { conversationId, message } = await request.json()

  if (containsCrisisLanguage(message)) {
    let convoId = conversationId
    if (!convoId) {
      const { data: convo } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, title: 'Conversation' })
        .select()
        .single()
      convoId = convo?.id
    }

    await supabase.from('messages').insert({
      conversation_id: convoId,
      role: 'user',
      content: message,
    })
    await supabase.from('messages').insert({
      conversation_id: convoId,
      role: 'assistant',
      content: CRISIS_RESPONSE,
      provider: 'safety-gate',
    })

    return NextResponse.json({ conversationId: convoId, reply: CRISIS_RESPONSE })
  }

  let convoId = conversationId

  if (!convoId) {
    const { data: convo, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: message.slice(0, 40) })
      .select()
      .single()

    if (error || !convo) {
      return NextResponse.json({ error: 'Could not start conversation' }, { status: 500 })
    }
    convoId = convo.id
  }

  await supabase.from('messages').insert({
    conversation_id: convoId,
    role: 'user',
    content: message,
  })

  const { data: existingMemories } = await supabase
    .from('memories')
    .select('category, content')
    .eq('user_id', user.id)

  const memoryContext =
    existingMemories && existingMemories.length > 0
      ? `\n\nKnown facts about this user:\n` +
        existingMemories.map((m) => `- (${m.category}) ${m.content}`).join('\n')
      : ''

  const { data: profileData } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .single()

  const nicknameContext = profileData?.nickname
    ? `\n\nThe user's preferred name is "${profileData.nickname}". You already know this — refer to them by this name naturally when it fits, and never ask them what their name is.`
    : ''

  const { data: conversation } = await supabase
    .from('conversations')
    .select('summary, summarized_count')
    .eq('id', convoId)
    .single()

  const { data: recentMessages } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', convoId)
    .order('created_at', { ascending: false })
    .limit(15)

  const historyMessages = (recentMessages || []).reverse()
  const historyText = historyMessages
    .map((m) => `${m.role === 'user' ? 'User' : 'Cody'}: ${m.content}`)
    .join('\n')

  const conversationContext =
    (conversation?.summary ? `\n\nSummary of earlier conversation:\n${conversation.summary}` : '') +
    (historyText ? `\n\nRecent conversation:\n${historyText}` : '')

  const fullSystemPrompt = SYSTEM_PROMPT + nicknameContext + memoryContext + conversationContext

  let result: { reply: string; memories: { category: string; content: string }[] }
  let provider: string

  try {
    result = await callGemini(message, fullSystemPrompt)
    provider = 'gemini'
  } catch (geminiError) {
    console.error('Gemini failed:', geminiError)
    try {
      result = await callGroq(message, fullSystemPrompt)
      provider = 'groq'
    } catch (groqError) {
      console.error('Groq also failed:', groqError)
      return NextResponse.json(
        { error: 'Both AI providers are unavailable right now.' },
        { status: 502 }
      )
    }
  }

  if (result.memories && result.memories.length > 0) {
    await supabase.from('memories').insert(
      result.memories.map((m) => ({
        user_id: user.id,
        category: m.category,
        content: m.content,
        importance: 1,
      }))
    )
  }

  await supabase.from('messages').insert({
    conversation_id: convoId,
    role: 'assistant',
    content: result.reply,
    provider,
  })

  const { count: totalMessages } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', convoId)

  const summarizedSoFar = conversation?.summarized_count || 0

  if (totalMessages && totalMessages > 40 && totalMessages - summarizedSoFar >= 20) {
    const { data: allMessages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', convoId)
      .order('created_at', { ascending: true })

    const toSummarize = (allMessages || []).slice(0, -15)
    const summaryInput = toSummarize.map((m) => `${m.role}: ${m.content}`).join('\n')

    const summaryPrompt = `Summarize the key facts, topics, and emotional context from this conversation in 3-5 concise sentences, for use as context in future replies. Do not include pleasantries, only substance.\n\n${
      conversation?.summary ? 'Previous summary: ' + conversation.summary + '\n\n' : ''
    }Conversation:\n${summaryInput}`

    try {
      const newSummary = await callGeminiPlainText(summaryPrompt)
      await supabase
        .from('conversations')
        .update({ summary: newSummary, summarized_count: toSummarize.length })
        .eq('id', convoId)
    } catch {
      // Summarization is best-effort — if it fails, just skip it this round
    }
  }

  return NextResponse.json({ conversationId: convoId, reply: result.reply })
}