// POST /api/generate — frontend shu endpoint'ga git diff yuboradi.
// Maqsad: API kalitni serverda saqlash, Claude'ga proksilash va xatolarni
// foydalanuvchiga tushunarli holatda qaytarish.

import { NextResponse } from 'next/server'
import { generateCommitMessages } from '@/lib/claude'
import type { GenerateRequest, GenerateResponse } from '@/types'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: GenerateRequest
  try {
    body = (await request.json()) as GenerateRequest
  } catch {
    return NextResponse.json<GenerateResponse>(
      { suggestions: [], error: 'Noto\'g\'ri JSON yuborildi' },
      { status: 400 },
    )
  }

  const diff = body.diff?.trim()
  if (!diff) {
    return NextResponse.json<GenerateResponse>(
      { suggestions: [], error: 'Diff bo\'sh bo\'lishi mumkin emas' },
      { status: 400 },
    )
  }

  // Juda katta diff'ni Claude'ga yubormaymiz — token limitiga urilmaslik uchun.
  if (diff.length > 50_000) {
    return NextResponse.json<GenerateResponse>(
      { suggestions: [], error: 'Diff juda katta (50 000 belgidan ko\'p)' },
      { status: 413 },
    )
  }

  try {
    const suggestions = await generateCommitMessages(diff)
    return NextResponse.json<GenerateResponse>({ suggestions })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server xatosi'
    console.error('[api/generate]', err)
    return NextResponse.json<GenerateResponse>(
      { suggestions: [], error: message },
      { status: 500 },
    )
  }
}
