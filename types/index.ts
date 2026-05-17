// Loyihada ishlatiladigan barcha TypeScript interface'lari shu yerda.
// Maqsad: bir manba — frontend, backend va lib bir xil shaklni ko'radi.

export type CommitType = 'feat' | 'fix' | 'docs' | 'refactor' | 'chore' | 'style' | 'test' | 'perf'

export interface CommitSuggestion {
  type: CommitType
  scope?: string
  description: string
  full: string
}

export interface GenerateRequest {
  diff: string
}

export interface GenerateResponse {
  suggestions: CommitSuggestion[]
  error?: string
}
