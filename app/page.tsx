// Bosh sahifa (/). Dark, professional UI.
// Maqsad: DiffInput va ResultList'ni birlashtirish, /api/generate bilan bog'lash.
// Hook ishlatmaymiz — state shu component ichida, talab bo'yicha.

'use client'

import { useState } from 'react'
import DiffInput from '@/components/DiffInput'
import ResultList from '@/components/ResultList'
import type { CommitSuggestion, GenerateResponse } from '@/types'

export default function Page() {
  const [suggestions, setSuggestions] = useState<CommitSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(diff: string) {
    setIsLoading(true)
    setError(null)
    setSuggestions([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diff }),
      })

      const data = (await res.json()) as GenerateResponse

      if (!res.ok || data.error) {
        throw new Error(data.error ?? `So'rov muvaffaqiyatsiz: ${res.status}`)
      }

      setSuggestions(data.suggestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noma\'lum xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black px-4 py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/60 px-3 py-1 text-xs text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Powered by Claude Haiku 3.5
          </span>
          <h1 className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            AI Commit Message Generator
          </h1>
          <p className="max-w-xl text-base text-gray-400">
            Paste your git diff, get perfect commit messages.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-800 bg-gray-900/30 p-5 shadow-xl shadow-black/20 backdrop-blur">
          <DiffInput onGenerate={handleGenerate} isLoading={isLoading} />
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            <span className="font-medium">Xatolik:</span> {error}
          </div>
        )}

        <ResultList suggestions={suggestions} />

        {!isLoading && suggestions.length === 0 && !error && (
          <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/20 p-8 text-center text-sm text-gray-500">
            Hozircha takliflar yo'q — yuqoriga diff joylab "Generate" tugmasini bosing.
          </div>
        )}

        <footer className="mt-auto pt-6 text-center text-xs text-gray-600">
          Conventional Commits formatida 3 ta variant taklif qilinadi.
        </footer>
      </div>
    </main>
  )
}
