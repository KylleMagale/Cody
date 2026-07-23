// A modest set of patterns to catch clear expressions of crisis or self-harm intent.
// This is intentionally simple and fast — it runs before every AI call.
// It won't catch everything; it's one layer of a defense-in-depth approach,
// paired with the system prompt instruction in the chat API route.

const CRISIS_PATTERNS: RegExp[] = [
  /\bkill (myself|me)\b/i,
  /\bend (my|it all)\b/i,
  /\bsuicid/i,
  /\bwant to die\b/i,
  /\bno reason to live\b/i,
  /\bnot worth living\b/i,
  /\bhurt myself\b/i,
  /\bself[\s-]?harm\b/i,
  /\bcan'?t go on\b/i,
  /\bbetter off dead\b/i,
]

export function containsCrisisLanguage(message: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(message))
}

export const CRISIS_RESPONSE = `I'm really glad you told me this, and I want to make sure you get support from someone who can really help right now.

If you're in the Philippines, you can reach the National Center for Mental Health Crisis Hotline, free and available 24/7:
- 1553 (landline, nationwide)
- 1800-1888-1553 (toll-free)
- 0917-899-8727 (Globe/TM)

If you're elsewhere, please look up your local emergency or crisis line, or reach out to someone you trust right now.

I'm an AI companion built for a portfolio project, and I'm not able to provide the kind of support you need in this moment — but a real person on one of these lines can help. You don't have to go through this alone.`