// Bitta commit suggestion'ni karta sifatida chiqaradi.
// Faqat UI: rangli type badge, description, va "Copy" tugma.
// Copy bosilganda full string clipboard'ga ko'chiriladi va 2s'ga "Copied!" deb o'zgaradi.

'use client'

import { useState } from 'react'
import type { CommitSuggestion, CommitType } from '@/types'

interface Props {
  suggestion: CommitSuggestion
}

// Har bir conventional commit type'i uchun mos rang.
// Tailwind class'lari runtime'da yasalmaydi (purger to'la string'larni izlaydi) — shu sababli to'liq class string.
const TYPE_STYLES: Record<CommitType, string> = {
  feat: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  fix: 'bg-red-500/15 text-red-300 border-red-500/30',
  docs: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  refactor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  chore: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
  style: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  test: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  perf: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
}

const FALLBACK_STYLE = 'bg-gray-500/15 text-gray-300 border-gray-500/30'

export default function ResultCard({ suggestion }: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(suggestion.full)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API ishlamasa — jim qolamiz, foydalanuvchi qo'lda nusxalashi mumkin.
    }
  }

  const badgeClass = TYPE_STYLES[suggestion.type] ?? FALLBACK_STYLE

  return (
    <div className="group rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition hover:border-gray-700 hover:bg-gray-900/80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}
          >
            {suggestion.type}
          </span>
          {suggestion.scope && (
            <span className="shrink-0 rounded-md bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
              {suggestion.scope}
            </span>
          )}
          <p className="truncate text-sm text-gray-200">{suggestion.description}</p>
        </div>
        <button
          type="button"
          onClick={copy}
          className={`shrink-0 rounded-md border px-3 py-1 text-xs font-medium transition ${
            copied
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:text-white'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <code className="mt-3 block rounded-md bg-black/30 px-3 py-2 font-mono text-xs text-gray-300">
        {suggestion.full}
      </code>
    </div>
  )
}
