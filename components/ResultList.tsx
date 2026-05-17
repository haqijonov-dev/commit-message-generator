// Claude qaytargan variantlar ro'yxati.
// Faqat UI: bo'sh bo'lsa null qaytaradi, aks holda har bir element uchun ResultCard.

import type { CommitSuggestion } from '@/types'
import ResultCard from './ResultCard'

interface Props {
  suggestions: CommitSuggestion[]
}

export default function ResultList({ suggestions }: Props) {
  if (suggestions.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
        Takliflar
      </h2>
      <div className="flex flex-col gap-3">
        {suggestions.map((s, i) => (
          <ResultCard key={`${s.full}-${i}`} suggestion={s} />
        ))}
      </div>
    </section>
  )
}
