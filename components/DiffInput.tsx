// Git diff matnini kiritish uchun textarea va "Generate" tugmasi.
// Faqat UI komponent: ichki state — diff matni; tashqi state — loading.
// Submit qilingan diff onGenerate orqali ota komponentga uzatiladi.

'use client'

import { useState } from 'react'

interface Props {
  onGenerate: (diff: string) => void
  isLoading: boolean
}

export default function DiffInput({ onGenerate, isLoading }: Props) {
  const [diff, setDiff] = useState('')

  function handleSubmit() {
    const trimmed = diff.trim()
    if (!trimmed || isLoading) return
    onGenerate(trimmed)
  }

  const isEmpty = diff.trim().length === 0

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="diff" className="text-sm font-medium text-gray-300">
        Git diff
      </label>
      <textarea
        id="diff"
        value={diff}
        onChange={(e) => setDiff(e.target.value)}
        placeholder="diff --git a/file.ts b/file.ts&#10;@@ ... @@&#10;-old line&#10;+new line"
        rows={14}
        spellCheck={false}
        className="w-full resize-y rounded-lg border border-gray-700 bg-gray-900/60 p-4 font-mono text-sm text-gray-100 placeholder-gray-600 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{diff.length} belgi</span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || isEmpty}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              Yaratilmoqda...
            </>
          ) : (
            <>Generate</>
          )}
        </button>
      </div>
    </div>
  )
}
