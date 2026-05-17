// Claude API bilan ishlovchi yagona joy (FAQAT server tomonida).
// Maqsad: git diff'ni Claude Haiku 3.5'ga yuborib, 3 ta conventional commit variant olish.
// 'server-only' import — bu modul brauzer bundle'iga tushib qolsa build xato beradi.

import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import type { CommitSuggestion } from '@/types'

const MODEL = 'claude-haiku-4-5'
const MAX_TOKENS = 1024

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `Sen tajribali dasturchisan va Conventional Commits standartining mutaxassisisan.
Sening vazifang: berilgan git diff'ni o'qib, 3 xil sifatli commit message taklif qilish.

Qoidalar:
- Type majburiy: feat | fix | docs | refactor | chore | style | test | perf
- Scope ixtiyoriy, qavs ichida (masalan: auth, api, ui)
- Description qisqa, imperative mood, 72 belgidan kam, nuqta bilan tugamaydi
- 3 ta variant TURLICHA bo'lsin: turli type, scope yoki ifoda
- Faqat JSON array qaytar, boshqa hech narsa yozma — markdown ham, tushuntirish ham yo'q

Javob formati (qat'iy):
[
  { "type": "feat", "scope": "auth", "description": "add password reset flow", "full": "feat(auth): add password reset flow" },
  { "type": "fix", "scope": "auth", "description": "handle expired reset tokens", "full": "fix(auth): handle expired reset tokens" },
  { "type": "refactor", "description": "extract token validation helper", "full": "refactor: extract token validation helper" }
]`

export async function generateCommitMessages(diff: string): Promise<CommitSuggestion[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY .env.local faylida topilmadi')
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Quyidagi git diff uchun 3 ta commit message taklif qil:\n\n${diff}`,
      },
    ],
  })

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim()

  return parseSuggestions(text)
}

// Claude ba'zan JSON oldidan/keyin matn qo'shadi — array qismini qidirib topamiz.
function parseSuggestions(raw: string): CommitSuggestion[] {
  const start = raw.indexOf('[')
  const end = raw.lastIndexOf(']')
  if (start === -1 || end === -1) {
    throw new Error('Claude javobida JSON array topilmadi')
  }

  const json = raw.slice(start, end + 1)
  const parsed = JSON.parse(json) as CommitSuggestion[]

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Claude bo\'sh yoki noto\'g\'ri JSON qaytardi')
  }

  return parsed
}
