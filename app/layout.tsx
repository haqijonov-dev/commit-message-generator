// Root layout — har bir sahifa shu shablon ichida render bo'ladi.
// Maqsad: <html>, <body>, metadata va global stillarni ulash.

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Commit Message Generator',
  description: 'Paste your git diff, get perfect commit messages.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
