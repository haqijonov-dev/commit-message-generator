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

interface ServerResponse {
  suggestions: CommitSuggestion[];
  error?: string;
}

const API_URL = 'https://commit-message-generator-one.vercel.app/api/generate';

export async function generateCommitMessages(diff: string): Promise<CommitSuggestion[]> {
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diff }),
    });
  } catch {
    throw new Error('Server bilan ulanishda xato');
  }

  let data: ServerResponse;
  try {
    data = (await response.json()) as ServerResponse;
  } catch {
    throw new Error('Server bilan ulanishda xato');
  }

  if (!response.ok) {
    throw new Error(data.error || `Server xatosi (${response.status})`);
  }

  if (!data.suggestions || !Array.isArray(data.suggestions) || data.suggestions.length === 0) {
    throw new Error("Commit message yaratib bo'lmadi");
  }

  return data.suggestions.map((s) => ({
    type: s.type,
    scope: s.scope || undefined,
    description: s.description,
    full:
      s.full ||
      (s.scope ? `${s.type}(${s.scope}): ${s.description}` : `${s.type}: ${s.description}`),
  }));
}
