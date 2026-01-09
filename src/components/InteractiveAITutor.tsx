'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Sparkles, 
  MessageCircle, 
  Brain, 
  Lightbulb,
  BookOpen,
  Calculator,
  FileText,
  Loader2,
  Bot,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface InteractiveAITutorProps {
  summary: {
    pages: number[]
    summary: string
    timestamp: string
  } | null
  subject?: string
  className?: string
  chapterTitle?: string
  pdfPath?: string
}

interface FollowUpQuestion {
  id: string
  question: string
  icon: any
  category: string
}

export default function InteractiveAITutor({ 
  summary, 
  subject = 'general', 
  className = '',
  chapterTitle = '',
  pdfPath = ''
}: InteractiveAITutorProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(true) // Start with chat visible for immediate engagement
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Reset state when summary changes (new summarization)
  useEffect(() => {
    if (summary) {
      // Clear all previous conversation data
      setMessages([])
      setInput('')
      setIsLoading(false)
    }
  }, [summary?.timestamp, summary?.pages.join(',')]) // Reset when timestamp or pages change

  // Return null if no summary available
  if (!summary) {
    return null
  }

  // Generate context-aware follow-up questions based on subject and content
  const generateFollowUpQuestions = (): FollowUpQuestion[] => {
    const baseQuestions: FollowUpQuestion[] = []
    const summaryContent = summary.summary.toLowerCase()
    
    // Subject-specific questions with content awareness
    if (subject.toLowerCase().includes('english') || subject.toLowerCase().includes('language')) {
      baseQuestions.push(
        {
          id: '1',
          question: summaryContent.includes('poem') || summaryContent.includes('rhyme') ? 
            `Create a short story based on this ${summaryContent.includes('rhyme') ? 'rhyme' : 'poem'}` :
            `Explain the main theme in detail`,
          icon: summaryContent.includes('poem') || summaryContent.includes('rhyme') ? FileText : BookOpen,
          category: summaryContent.includes('poem') || summaryContent.includes('rhyme') ? 'Creative' : 'Understanding'
        },
        {
          id: '2', 
          question: summaryContent.includes('grammar') ? 
            `Give me more grammar exercises like this` :
            `What are the key vocabulary words I should learn?`,
          icon: Brain,
          category: 'Learning'
        },
        {
          id: '3',
          question: `How can I improve my writing using these concepts?`,
          icon: Lightbulb,
          category: 'Application'
        }
      )
    } else if (subject.toLowerCase().includes('math') || subject.toLowerCase().includes('mathematics')) {
      baseQuestions.push(
        {
          id: '1',
          question: summaryContent.includes('theorem') ?
            `Explain the ${summaryContent.includes('pythagorean') ? 'Pythagorean theorem' : 'theorem'} in detail` :
            `Show me similar practice problems`,
          icon: summaryContent.includes('theorem') ? Lightbulb : Calculator,
          category: summaryContent.includes('theorem') ? 'Understanding' : 'Practice'
        },
        {
          id: '2',
          question: `Break down the solution step by step`,
          icon: Brain,
          category: 'Process'
        },
        {
          id: '3',
          question: `How can I apply this in real life?`,
          icon: FileText,
          category: 'Application'
        }
      )
    } else if (subject.toLowerCase().includes('science')) {
      baseQuestions.push(
        {
          id: '1',
          question: `What experiments can help me understand this better?`,
          icon: Lightbulb,
          category: 'Practical'
        },
        {
          id: '2',
          question: `Explain the scientific concepts in simpler terms`,
          icon: Brain,
          category: 'Understanding'
        },
        {
          id: '3',
          question: `What are the real-world applications?`,
          icon: FileText,
          category: 'Application'
        }
      )
    } else {
      // General questions for other subjects
      baseQuestions.push(
        {
          id: '1',
          question: `Explain the key concepts in simpler terms`,
          icon: Lightbulb,
          category: 'Understanding'
        },
        {
          id: '2',
          question: `Give me examples related to this topic`,
          icon: FileText,
          category: 'Examples'
        },
        {
          id: '3',
          question: `Test my understanding with questions`,
          icon: Brain,
          category: 'Assessment'
        }
      )
    }

    // Add dynamic page-specific questions
    if (summary.pages.length === 1) {
      baseQuestions.push({
        id: '4',
        question: `Explain page ${summary.pages[0]} in more detail`,
        icon: BookOpen,
        category: 'Deep Dive'
      })
    } else if (summary.pages.length <= 3) {
      baseQuestions.push({
        id: '4',
        question: `Compare the concepts across pages ${summary.pages.join(', ')}`,
        icon: BookOpen,
        category: 'Analysis'
      })
    } else {
      baseQuestions.push({
        id: '4',
        question: `What are the main topics covered in these ${summary.pages.length} pages?`,
        icon: BookOpen,
        category: 'Overview'
      })
    }

    // Add a contextual question based on chapter title
    if (chapterTitle) {
      baseQuestions.push({
        id: '5',
        question: `How does this connect to other topics in ${chapterTitle}?`,
        icon: Sparkles,
        category: 'Connections'
      })
    }

    return baseQuestions.slice(0, 6) // Limit to 6 questions for better UI
  }

  const followUpQuestions = generateFollowUpQuestions()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Prepare context with previous messages for continuity
      const conversationContext = messages.map(msg => 
        `${msg.type === 'user' ? 'Student' : 'AI Tutor'}: ${msg.content}`
      ).join('\n')

      const response = await fetch('/api/ncert/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfPath: pdfPath,
          pages: summary.pages,
          summaryType: 'chat',
          chatMessage: content,
          previousContext: conversationContext,
          originalSummary: summary.summary,
          subject: subject,
          chapterTitle: chapterTitle
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response || data.summary || 'I apologize, but I couldn\'t generate a proper response. Please try again.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowUpClick = (question: string) => {
    handleSendMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(input)
    }
  }

  // We now show the chat immediately, so this is no longer needed
  // The chat interface is the main component

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${className}`}>
      {/* Header with Summary Display */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Bot className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AI Tutor Chat</h3>
                <p className="text-indigo-100 text-sm">
                  Pages {summary.pages.join(', ')} • {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Active</span>
            </div>
          </div>
          
          {/* Summary Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-indigo-100">Summary Generated</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
              {summary.summary}
            </p>
            <div className="mt-2 text-xs text-indigo-200">
              Generated at {new Date(summary.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Get Started with These Questions</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Click on any question below to start an interactive conversation with your AI tutor:
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {followUpQuestions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => handleFollowUpClick(question.question)}
                className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-left group backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 dark:group-hover:from-indigo-800/70 dark:group-hover:to-purple-800/70 transition-all duration-300 shadow-sm">
                  <question.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                    {question.question}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-white bg-indigo-500 px-2 py-0.5 rounded-full">
                      {question.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Click to ask
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50">
              <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300">
                <Brain className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Pro Tip: You can also type your own question in the chat box below!
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 text-center border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{summary.pages.length}</div>
                <div className="text-blue-700 dark:text-blue-300">Pages Analyzed</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 text-center border border-purple-200/50 dark:border-purple-700/50">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{followUpQuestions.length}</div>
                <div className="text-purple-700 dark:text-purple-300">Smart Questions</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 text-center border border-green-200/50 dark:border-green-700/50">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">AI</div>
                <div className="text-green-700 dark:text-green-300">Tutor Ready</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-3 text-center border border-amber-200/50 dark:border-amber-700/50">
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">∞</div>
                <div className="text-amber-700 dark:text-amber-300">Learning Potential</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className={`${messages.length === 0 ? 'h-auto' : 'h-96'} overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50`}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Start Your Conversation
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your conversation history will appear here once you start chatting.
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-indigo-200 dark:shadow-indigo-900/30'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-gray-200 dark:shadow-gray-800/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                  <p className={`text-xs mt-3 flex items-center space-x-1 ${
                    message.type === 'user' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-indigo-100" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="max-w-[85%] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI tutor is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/10 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about the content..."
                className="w-full px-4 py-4 pr-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-400 resize-none text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                rows={2}
                disabled={isLoading}
              />
              <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                {input.length}/500
              </div>
            </div>
          </div>
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="h-5 w-5" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-4">
            <span>Press Enter to send • Shift+Enter for new line</span>
            {messages.length > 0 && (
              <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                {messages.length} messages
              </span>
            )}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span>AI Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}