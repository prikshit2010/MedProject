import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { dark } from '@clerk/themes'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'AuraHealth | AI Medical Voice Agent',
  description: 'Instant, real-time medical consultations with specialized AI doctors.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: 'hsl(250, 60%, 50%)',
          colorBackground: '#1a1a24',
        }
      }}
    >
      <html lang="en" className={`${inter.variable} dark`}>
        <body className="antialiased font-sans text-foreground bg-background min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
