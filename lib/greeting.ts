export function getGreeting(nickname?: string): { icon: string; text: string } {
  const hour = new Date().getHours()
  const name = nickname?.trim()

  let icon: string
  let options: string[]

  if (hour < 5) {
    icon = '🌙'
        options = [
            name ? `Still up, ${name}? I'm here.` : "Still up? I'm here.",
            name ? `Burning the midnight oil, ${name}?` : 'Burning the midnight oil?',
            name ? `Night owl mode, ${name}. Engaged.` : 'Night owl mode, engaged',
            name ? `The world's a little quieter now, ${name}.` : "The world's a little quieter now.",
            name ? `Late-night thoughts are welcome here, ${name}.` : 'Late-night thoughts are welcome here.',
            name ? `Looks like it's just you and me tonight, ${name}.` : "Looks like it's just you and me tonight.",
            name ? `Working late or just wide awake, ${name}?` : 'Working late or just wide awake?',
            name ? `Sleep can wait, ${name}—what can I help with?` : 'Sleep can wait—what can I help with?'
        ]
    } else if (hour < 8) {
    icon = '🌅'
        options = [
            name ? `Hey, early bird, ${name}.` : 'Hey, early bird',
            name ? `Up before the sun, ${name}?` : 'Up before the sun, huh?',
            name ? `Rise and shine, ${name}.` : 'Rise and shine',
            name ? `You're getting a head start today, ${name}.` : "You're getting a head start today.",
            name ? `Coffee first or Cody first, ${name}?` : 'Coffee first or Cody first?',
            name ? `A fresh day, a fresh start, ${name}.` : 'A fresh day, a fresh start.',
            name ? `Ready to kick things off, ${name}?` : 'Ready to kick things off?',
            name ? `Let's make today count, ${name}.` : "Let's make today count."
        ]
    } else if (hour < 12) {
    icon = '☀️'
        options = [
            name ? `Morning, ${name}! Ready when you are.` : 'Morning! Ready when you are',
            name ? `Hey there, bright and early, ${name}.` : 'Hey there, bright and early',
            name ? `Fresh start to the day, ${name}.` : 'Fresh start to the day',
            name ? `What's today's challenge, ${name}?` : "What's today's challenge?",
            name ? `Need a second brain, ${name}?` : 'Need a second brain?',
            name ? `Let's get something done, ${name}.` : "Let's get something done.",
            name ? `What are we building today, ${name}?` : 'What are we building today?',
            name ? `I'm all set whenever you are, ${name}.` : "I'm all set whenever you are."
        ]
    } else if (hour < 17) {
    icon = '🌤️'
        options = [
            name ? `Hey ${name}, hope today's treating you well.` : "Hey, hope today's treating you well",
            name ? `Midday check-in, ${name}?` : 'Midday check-in?',
            name ? `Afternoon, ${name}. What's on your mind?` : "Afternoon, what's on your mind?",
            name ? `Need a quick hand, ${name}?` : 'Need a quick hand?',
            name ? `Let's keep the momentum going, ${name}.` : "Let's keep the momentum going.",
            name ? `What's next on your list, ${name}?` : "What's next on your list?",
            name ? `Got something interesting to solve, ${name}?` : 'Got something interesting to solve?',
            name ? `I'm ready for whatever's next, ${name}.` : "I'm ready for whatever's next."
        ]
    } else if (hour < 21) {
    icon = '🌇'
        options = [
            name ? `Evening, ${name}. How'd today go?` : "Evening, how'd today go?",
            name ? `Hey, winding down, ${name}?` : 'Hey, winding down?',
            name ? `Evening check-in, ${name}.` : 'Evening check-in',
            name ? `Wrapping things up, ${name}?` : 'Wrapping things up?',
            name ? `Let's finish the day strong, ${name}.` : "Let's finish the day strong.",
            name ? `Still got something on your mind, ${name}?` : 'Still got something on your mind?',
            name ? `Need one last answer before the day ends, ${name}?` : 'Need one last answer before the day ends?',
            name ? `I'm here if you need me, ${name}.` : "I'm here if you need me."
        ]
    } else {
    icon = '✨'
        options = [
            name ? `Hey, night owl, ${name}.` : 'Hey, night owl',
            name ? `Quiet hours, ${name}. Good time to talk.` : 'Quiet hours, good time to talk',
            name ? `Late one tonight, ${name}?` : 'Late one tonight?',
            name ? `Looks like it's a productive night, ${name}.` : "Looks like it's a productive night.",
            name ? `No matter the hour, ${name}, Cody's ready.` : "No matter the hour, Cody's ready.",
            name ? `Still going, ${name}? So am I.` : 'Still going? So am I.',
            name ? `The day may be ending, ${name}, but the ideas keep coming.` : 'The day may be ending, but the ideas keep coming.',
            name ? `What's keeping you up tonight, ${name}?` : "What's keeping you up tonight?"
        ]
    }

  const text = options[Math.floor(Math.random() * options.length)]

  return { icon, text }
}