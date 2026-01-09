"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Pen, 
  Video, 
  Users, 
  BookOpen, 
  Brain, 
  Target, 
  Sparkles,
  ArrowRight,
  Play,
  MessageSquare,
  Download,
  Share,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react'
import { LearningToolsProvider, ToolsLauncher } from '@/components/learning-tools';

export default function LearningTools() {
  const tools = [
    {
      id: 'whiteboard',
      name: 'Virtual Whiteboard',
      description: 'Interactive drawing and writing for collaborative learning sessions',
      icon: <Pen className="h-8 w-8" />,
      href: '/whiteboard',
      features: ['Real-time collaboration', 'Multiple drawing tools', 'Export & share', 'Undo/Redo'],
      color: 'bg-blue-500',
      status: 'active'
    },
    {
      id: 'screen-recording',
      name: 'Screen Recording',
      description: 'Record your tutoring sessions for review and sharing',
      icon: <Video className="h-8 w-8" />,
      href: '/screen-recording',
      features: ['HD recording', 'Audio capture', 'Session management', 'Download & share'],
      color: 'bg-green-500',
      status: 'active'
    },
    {
      id: 'study-groups',
      name: 'Study Groups',
      description: 'Collaborate with peers in real-time study sessions',
      icon: <Users className="h-8 w-8" />,
      href: '/study-groups',
      features: ['Group chat', 'Video calls', 'Shared whiteboard', 'Member management'],
      color: 'bg-purple-500',
      status: 'active'
    },
    {
      id: 'flashcards',
      name: 'AI Flashcard System',
      description: 'Generate smart flashcards from your notes and study materials',
      icon: <BookOpen className="h-8 w-8" />,
      href: '/flashcards',
      features: ['AI generation', 'Spaced repetition', 'Progress tracking', 'Multiple subjects'],
      color: 'bg-orange-500',
      status: 'active'
    }
  ]

  const recentSessions = [
    {
      id: '1',
      tool: 'Virtual Whiteboard',
      title: 'Mathematics Session',
      duration: '45 min',
      participants: 3,
      date: '2024-01-15'
    },
    {
      id: '2',
      tool: 'Screen Recording',
      title: 'Physics Tutorial',
      duration: '32 min',
      participants: 1,
      date: '2024-01-14'
    },
    {
      id: '3',
      tool: 'Study Groups',
      title: 'JEE Mathematics Group',
      duration: '60 min',
      participants: 8,
      date: '2024-01-13'
    }
  ]

  const stats = [
    { label: 'Total Sessions', value: '156', icon: <Play className="h-4 w-4" /> },
    { label: 'Active Groups', value: '12', icon: <Users className="h-4 w-4" /> },
    { label: 'Flashcards Created', value: '1,234', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Collaboration Hours', value: '89', icon: <Clock className="h-4 w-4" /> }
  ]

  return (
    <LearningToolsProvider questionRef="learning-tools-demo" initialText="">
      <ToolsLauncher />
      <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Learning Tools</h1>
            <p className="text-muted-foreground">Powerful tools to enhance your learning experience</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 mb-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Learning Tools Grid */}
          <div className="grid gap-6 mb-8 lg:grid-cols-2">
            {tools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${tool.color} text-white`}>
                        {tool.icon}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {tool.name}
                          {tool.status === 'active' && (
                            <Badge variant="secondary" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={tool.href}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI Powered
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Popular
                        </span>
                      </div>
                      <Button asChild>
                        <Link href={tool.href}>
                          Launch Tool
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
              <CardDescription>
                Your recent learning tool sessions and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {session.tool === 'Virtual Whiteboard' && <Pen className="h-4 w-4" />}
                        {session.tool === 'Screen Recording' && <Video className="h-4 w-4" />}
                        {session.tool === 'Study Groups' && <Users className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">{session.tool}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {session.participants}
                      </span>
                      <span>{session.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Pen className="h-12 w-12 mx-auto text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Start Drawing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a new whiteboard session for collaborative learning
                </p>
                <Button asChild className="w-full">
                  <Link href="/whiteboard">
                    <Pen className="mr-2 h-4 w-4" />
                    Open Whiteboard
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Video className="h-12 w-12 mx-auto text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Record Session</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start recording your tutoring session for later review
                </p>
                <Button asChild className="w-full">
                  <Link href="/screen-recording">
                    <Video className="mr-2 h-4 w-4" />
                    Start Recording
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Users className="h-12 w-12 mx-auto text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Join Study Group</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with peers for collaborative learning sessions
                </p>
                <Button asChild className="w-full">
                  <Link href="/study-groups">
                    <Users className="mr-2 h-4 w-4" />
                    Find Groups
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LearningToolsProvider>
  )
}
