"use client"

import { useState } from 'react'
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

  const recentSessions = [
    {
      id: '1',
      title: 'Mathematics - Algebra Basics',
      subject: 'Mathematics',
      duration: '45 min',
      date: '2024-01-15',
      type: 'AI Avatar',
      language: 'English',
      progress: 85
    },
    {
      id: '2',
      title: 'Physics - Newton\'s Laws',
      subject: 'Physics',
      duration: '60 min',
      date: '2024-01-14',
      type: 'Voice Lesson',
      language: 'Hindi',
      progress: 92
    },
    {
      id: '3',
      title: 'English Grammar Quiz',
      subject: 'English',
      duration: '30 min',
      date: '2024-01-13',
      type: 'Smart Quiz',
      language: 'English',
      progress: 78
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">AI Teaching Assistant</h1>
          <p className="text-muted-foreground text-lg">
            Enhance your learning with AI-powered tools, voice lessons, and smart content analysis
          </p>
        </div>

        {/* AI Features Overview */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {aiFeatures.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-card to-card/50">
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
            {/* Recent Sessions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Your latest AI learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map(session => (
                    <div key={session.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{session.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{session.type}</span>
                          <span>•</span>
                          <span>{session.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{session.progress}%</div>
                        <div className="w-16 h-1 bg-muted rounded-full">
                          <div 
                            className="h-1 bg-primary rounded-full"
                            style={{ width: `${session.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download Session
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share className="mr-2 h-4 w-4" />
                    Share Progress
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    AI Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>AI Learning Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sessions Completed</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Learning Time</span>
                    <span className="font-semibold">18h 32m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">AI Recommendations</span>
                    <span className="font-semibold">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 