"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  X, 
  Minimize2, 
  Maximize2,
  Languages,
  BookOpen,
  Target,
  Brain,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Settings,
  HelpCircle,
  User,
  Clock,
  Star
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type: 'text' | 'voice' | 'quick-reply'
  quickReplies?: string[]
}

interface QuickAction {
  icon: React.ReactNode
  label: string
  action: string
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm ब्रह्मांड Ai, your learning assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      quickReplies: [
        'Find a course',
        'Book a session',
        'AI features',
        'Help with studies'
      ]
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [isMuted, setIsMuted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' }
  ]

  const quickActions: QuickAction[] = [
    { icon: <BookOpen className="h-4 w-4" />, label: 'Courses', action: 'Show me available courses' },
    { icon: <Target className="h-4 w-4" />, label: 'Tutors', action: 'Find tutors near me' },
    { icon: <Brain className="h-4 w-4" />, label: 'AI Help', action: 'How can AI help me learn?' },
    { icon: <Clock className="h-4 w-4" />, label: 'Schedule', action: 'Book a session' }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(text)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        quickReplies: getQuickReplies(text)
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('course') || input.includes('class')) {
      return 'I can help you find the perfect course! We offer courses from Kindergarten to Competitive Exams. What subject are you interested in?'
    } else if (input.includes('tutor') || input.includes('teacher')) {
      return 'Great! We have expert tutors available for both online and offline sessions. Would you like to see tutors in your area?'
    } else if (input.includes('ai') || input.includes('artificial intelligence')) {
      return 'Our AI features include personalized learning paths, smart assessments, voice lessons, and 24/7 doubt resolution. Which feature interests you most?'
    } else if (input.includes('book') || input.includes('schedule')) {
      return 'I can help you book a session! Do you prefer online or offline sessions? I can show you available time slots.'
    } else if (input.includes('delhi') || input.includes('location')) {
      return 'We have centers in Lajpat Nagar, Dwarka, Saket, Rohini, and other areas across Delhi. Which area is convenient for you?'
    } else {
      return 'I\'m here to help with your learning journey! You can ask me about courses, tutors, AI features, or booking sessions. What would you like to know?'
    }
  }

  const getQuickReplies = (userInput: string): string[] => {
    const input = userInput.toLowerCase()
    
    if (input.includes('course')) {
      return ['Mathematics', 'Physics', 'English', 'Show all courses']
    } else if (input.includes('tutor')) {
      return ['Online tutors', 'Offline tutors', 'View profiles', 'Book session']
    } else if (input.includes('ai')) {
      return ['Voice lessons', 'Smart quizzes', 'PDF analysis', 'AI avatar']
    } else {
      return ['Find a course', 'Book a session', 'AI features', 'Help with studies']
    }
  }

  const handleQuickReply = (reply: string) => {
    sendMessage(reply)
  }

  const handleQuickAction = (action: string) => {
    sendMessage(action)
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    setIsListening(true)
    // Implement voice recording logic
    setTimeout(() => {
      setIsRecording(false)
      setIsListening(false)
      // Simulate voice input
      sendMessage('I want to learn mathematics')
    }, 3000)
  }

  const stopVoiceRecording = () => {
    setIsRecording(false)
    setIsListening(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-xl border-0 bg-gradient-to-br from-card to-card/50 ${isMinimized ? 'h-16' : 'h-96'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">ब्रह्मांड Ai</CardTitle>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="h-6 w-6 p-0"
              >
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Language Selector */}
            <div className="px-4 pb-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-input rounded bg-background"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.name}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className="h-48 overflow-y-auto px-4 space-y-3">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    {message.sender === 'bot' && (
                      <Avatar className="w-6 h-6 mb-1">
                        <AvatarFallback className="text-xs">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-2 rounded-lg text-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.text}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                    
                    {/* Quick Replies */}
                    {message.quickReplies && message.sender === 'bot' && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs h-6 px-2"
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t">
              <div className="grid grid-cols-2 gap-2 mb-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs h-8"
                  >
                    {action.icon}
                    <span className="ml-1">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="px-4 pb-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                />
                <Button
                  size="sm"
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className="h-8 w-8 p-0"
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  onClick={() => sendMessage(inputText)}
                  className="h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
} 