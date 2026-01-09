import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import Chatbot from '@/components/Chatbot'
import Navbar from '@/components/navbar'
import { GlobalAuthPopup } from '@/components/GlobalAuthPopup'
import { SidebarProvider } from '@/contexts/SidebarContext'
import ConditionalSidebarWrapper from '@/components/ConditionalSidebarWrapper'
import { LearningToolsProvider, ToolsLauncher, AITutorChat, SnapSolve } from '@/components/learning-tools'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true
})

export const metadata: Metadata = {
  title: 'TutorBuddy - AI-Powered Learning Platform',
  description: 'Learn Smart with AI — From KG to Competitive Exams. Online and offline tutoring with AI assistance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <Providers>
          <Navbar />
          <ConditionalSidebarWrapper>
            <main className="pt-16">
              {children}
            </main>
          </ConditionalSidebarWrapper>
          <Chatbot />
          <GlobalAuthPopup />
          <ToolsLauncher />
          <AITutorChat />
          <SnapSolve />
        </Providers>
      </body>
    </html>
  )
} 