import Anthropic from '@anthropic-ai/sdk';

export type CommitType =
  | 'feat'
  | 'fix'
  | 'docs'
  | 'refactor'
  | 'chore'
  | 'style'
  | 'test'
  | 'perf';

export interface CommitSuggestion {
  type: CommitType;
  scope?: string;
  description: string;
  full: string;
}

interface ClaudeResponse {
  suggestions: CommitSuggestion[];
}

const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 1024;

const SYSTEM_PROMPT = `Sen tajribali dasturchisan va Conventional Commits standartining mutaxassisisan.
Sening vazifang: berilgan git diff'ni o'qib, 3 xil sifatli commit message taklif qilish.

Qoidalar:
- Type majburiy: feat | fix | docs | refactor | chore | style | test | perf
- Scope ixtiyoriy, qavs ichida (masalan: auth, api, ui)
- Description O'ZBEK TILIDA yozilsin, qisqa, imperative mood, 72 belgidan kam, nuqta bilan tugamaydi
- 3 ta variant TURLICHA bo'lsin: turli type, scope yoki ifoda
- "full" field: agar scope bo'lsa "type(scope): description", aks holda "type: description"
- FAQAT JSON qaytar, boshqa hech narsa yozma — markdown ham, tushuntirish ham yo'q

Javob formati (qat'iy):
{"suggestions":[{"type":"feat","scope":"auth","description":"add password reset flow","full":"feat(auth): add password reset flow"},{"type":"fix","scope":"auth","description":"handle expired reset tokens","full":"fix(auth): handle expired reset tokens"},{"type":"refactor","scope":"","description":"extract token validation helper","full":"refactor: extract token validation helper"}]}`;

export async function generateCommitMessages(diff: string): Promise<CommitSuggestion[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY topilmadi. cli/.env faylga qo'shing.");
  }

  const client = new Anthropic({ apiKey });

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
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();

  return parseSuggestions(text);
}

function parseSuggestions(raw: string): CommitSuggestion[] {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error("Claude javobida JSON ob'ekt topilmadi");
  }

  const json = raw.slice(start, end + 1);
  let parsed: ClaudeResponse;
  try {
    parsed = JSON.parse(json) as ClaudeResponse;
  } catch (e) {
    throw new Error("Claude javobini JSON sifatida o'qib bo'lmadi");
  }

  if (!parsed.suggestions || !Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0) {
    throw new Error("Claude javobida 'suggestions' arrayi bo'sh yoki yo'q");
  }

  return parsed.suggestions.map((s) => ({
    type: s.type,
    scope: s.scope || undefined,
    description: s.description,
    full: s.full || (s.scope ? `${s.type}(${s.scope}): ${s.description}` : `${s.type}: ${s.description}`),
  }));
}
