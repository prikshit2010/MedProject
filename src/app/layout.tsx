import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'AuraHealth | AI Medical Voice Agent',
  description: 'Instant, real-time medical consultations with specialized AI doctors.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: 'oklch(0.7 0.1 260)',
        }
      }}
    >
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="antialiased font-sans text-foreground bg-background min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
