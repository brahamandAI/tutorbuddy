"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Upload, 
  FileText, 
  Brain, 
  Mic, 
  Video, 
  Play, 
  Pause, 
  Volume2,
  Settings,
  Download,
  Share,
  MessageSquare,
  BookOpen,
  Target,
  Award,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Bot,
  Languages,
  Camera,
  Monitor,
  Smartphone,
  Zap,
  Sparkles
} from 'lucide-react'

export default function AITeachingPage() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [activeTab, setActiveTab] = useState('upload')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' }
  ]

  const aiFeatures = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "PDF Analysis",
      description: "Upload textbooks and get AI-generated summaries, key points, and practice questions"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Smart Quizzes",
      description: "AI creates personalized quizzes based on your learning progress and weak areas"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "AI Avatar Lessons",
      description: "Learn from AI avatars that adapt to your learning style and pace"
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice Learning",
      description: "Practice pronunciation and get instant feedback in multiple Indian languages"
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const startRecording = () => {
    setIsRecording(true)
    // Implement voice recording logic
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Implement stop recording logic
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Tutor</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Ask a question, then practice or open a chapter.
          </p>
        </div>

        <Card className="mb-8 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">What do you want to learn today?</CardTitle>
            <CardDescription>Your tutor is ready. Start with a question.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault()
                const trimmed = question.trim()
                if (trimmed) sessionStorage.setItem('tb-ask', trimmed)
                router.push('/magic-explain')
              }}
            >
              <Input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask your AI Tutor..."
              />
              <Button type="submit">Ask</Button>
            </form>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => router.push('/magic-explain')}>Explain a topic</Button>
              <Button variant="outline" onClick={() => router.push('/micro-quiz')}>Practice</Button>
              <Button variant="outline" onClick={() => router.push('/ncert')}>Ask from a chapter</Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Features Overview */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {aiFeatures.map((feature, index) => (
            <Card key={index} className="border-border/60 text-center shadow-sm">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Teach with AI</CardTitle>
                    <CardDescription>
                      Upload content, create quizzes, and start AI-powered learning sessions
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.name}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Tabs */}
                <div className="flex space-x-1 mb-6">
                  {[
                    { id: 'upload', label: 'Upload Content', icon: <Upload className="h-4 w-4" /> },
                    { id: 'quiz', label: 'Create Quiz', icon: <Target className="h-4 w-4" /> },
                    { id: 'avatar', label: 'AI Avatar', icon: <Video className="h-4 w-4" /> },
                    { id: 'voice', label: 'Voice Lesson', icon: <Mic className="h-4 w-4" /> }
                  ].map(tab => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab(tab.id)}
                      className="flex items-center space-x-2"
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'upload' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Upload Your Learning Materials</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload PDFs, images, or documents to get AI-generated summaries and practice questions
                      </p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Files
                        </Button>
                      </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Uploaded Files</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button size="sm" variant="outline">
                                <Brain className="mr-2 h-4 w-4" />
                                Analyze
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                          <option>Mathematics</option>
                          <option>Physics</option>
                          <option>Chemistry</option>
                          <option>Biology</option>
                          <option>English</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Topic</label>
                        <Input placeholder="Enter the topic for quiz" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                        <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Number of Questions</label>
                        <Input type="number" placeholder="10" min="5" max="50" />
                      </div>
                    </div>
                    <Button className="w-full">
                      <Brain className="mr-2 h-4 w-4" />
                      Generate AI Quiz
                    </Button>
                  </div>
                )}

                {activeTab === 'avatar' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Bot className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">AI Teaching Avatar</h3>
                      <p className="text-muted-foreground mb-4">
                        Choose your preferred AI avatar and start an interactive learning session
                      </p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      {['Mathematics', 'Physics', 'Chemistry'].map(subject => (
                        <Card key={subject} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                            <h4 className="font-semibold">{subject} Tutor</h4>
                            <p className="text-sm text-muted-foreground">AI Avatar</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'voice' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Mic className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Voice Learning Session</h3>
                      <p className="text-muted-foreground mb-4">
                        Practice pronunciation and get instant feedback in {selectedLanguage}
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        variant={isRecording ? "destructive" : "default"}
                        onClick={isRecording ? stopRecording : startRecording}
                        className="w-32 h-32 rounded-full"
                      >
                        {isRecording ? (
                          <>
                            <Pause className="mr-2 h-6 w-6" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-6 w-6" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/magic-explain')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Magic Explain
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/micro-quiz')}>
                    <Target className="mr-2 h-4 w-4" />
                    Micro Quiz
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/ncert')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
} 