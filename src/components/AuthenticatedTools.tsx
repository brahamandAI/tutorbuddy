'use client'

import Chatbot from '@/components/Chatbot'
import { AITutorChat, SnapSolve } from '@/components/learning-tools'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthenticatedTools() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return null
  return (
    <>
      <Chatbot />
      <AITutorChat />
      <SnapSolve />
    </>
  )
}
