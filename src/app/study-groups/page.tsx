"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Plus, 
  Search, 
  MessageSquare, 
  Video, 
  Calendar, 
  Clock, 
  MapPin,
  BookOpen,
  Target,
  Star,
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Settings,
  Share,
  Edit,
  Trash2,
  UserPlus,
  Crown
} from 'lucide-react'
import { useSocket } from '@/contexts/SocketContext';

interface StudyGroup {
  id: string
  name: string
  subject: string
  description: string
  maxMembers: number
  currentMembers: number
  createdBy: string
  createdAt: string
  nextSession: string
  isActive: boolean
  members: GroupMember[]
  tags: string[]
}

interface GroupMember {
  id: string
  name: string
  avatar: string
  role: 'admin' | 'member'
  joinedAt: string
  isOnline: boolean
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file'
}

export default function StudyGroups() {
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const { socket, isConnected } = useSocket();

  // Sample data
  useEffect(() => {
    setGroups([
      {
        id: '1',
        name: 'JEE Mathematics Study Group',
        subject: 'Mathematics',
        description: 'Advanced mathematics preparation for JEE aspirants. We solve complex problems together.',
        maxMembers: 15,
        currentMembers: 8,
        createdBy: 'Dr. Sarah Johnson',
        createdAt: '2024-01-10',
        nextSession: '2024-01-20 14:00',
        isActive: true,
        members: [
          { id: '1', name: 'Dr. Sarah Johnson', avatar: '/avatars/sarah.jpg', role: 'admin', joinedAt: '2024-01-10', isOnline: true },
          { id: '2', name: 'Rahul Kumar', avatar: '/avatars/rahul.jpg', role: 'member', joinedAt: '2024-01-11', isOnline: true },
          { id: '3', name: 'Priya Sharma', avatar: '/avatars/priya.jpg', role: 'member', joinedAt: '2024-01-12', isOnline: false },
          { id: '4', name: 'Amit Patel', avatar: '/avatars/amit.jpg', role: 'member', joinedAt: '2024-01-13', isOnline: true }
        ],
        tags: ['JEE', 'Mathematics', 'Advanced']
      },
      {
        id: '2',
        name: 'NEET Biology Discussion',
        subject: 'Biology',
        description: 'Biology concepts and MCQs for NEET preparation. Weekly mock tests included.',
        maxMembers: 20,
        currentMembers: 12,
        createdBy: 'Prof. Michael Chen',
        createdAt: '2024-01-08',
        nextSession: '2024-01-18 16:00',
        isActive: true,
        members: [
          { id: '1', name: 'Prof. Michael Chen', avatar: '/avatars/michael.jpg', role: 'admin', joinedAt: '2024-01-08', isOnline: true },
          { id: '2', name: 'Anjali Singh', avatar: '/avatars/anjali.jpg', role: 'member', joinedAt: '2024-01-09', isOnline: true },
          { id: '3', name: 'Vikram Mehta', avatar: '/avatars/vikram.jpg', role: 'member', joinedAt: '2024-01-10', isOnline: false }
        ],
        tags: ['NEET', 'Biology', 'MCQs']
      },
      {
        id: '3',
        name: 'English Literature Club',
        subject: 'English',
        description: 'Reading and analyzing classic literature. Perfect for improving English skills.',
        maxMembers: 10,
        currentMembers: 6,
        createdBy: 'Emma Rodriguez',
        createdAt: '2024-01-05',
        nextSession: '2024-01-22 18:00',
        isActive: true,
        members: [
          { id: '1', name: 'Emma Rodriguez', avatar: '/avatars/emma.jpg', role: 'admin', joinedAt: '2024-01-05', isOnline: false },
          { id: '2', name: 'Kavya Reddy', avatar: '/avatars/kavya.jpg', role: 'member', joinedAt: '2024-01-06', isOnline: true }
        ],
        tags: ['English', 'Literature', 'Classic']
      }
    ])

    setMessages([
      { id: '1', sender: 'Dr. Sarah Johnson', content: 'Welcome everyone! Today we\'ll be solving calculus problems.', timestamp: '14:00', type: 'text' },
      { id: '2', sender: 'Rahul Kumar', content: 'Hi! I\'m excited to learn calculus.', timestamp: '14:01', type: 'text' },
      { id: '3', sender: 'Priya Sharma', content: 'Can we start with derivatives?', timestamp: '14:02', type: 'text' },
      { id: '4', sender: 'Dr. Sarah Johnson', content: 'Absolutely! Let\'s begin with the basics of derivatives.', timestamp: '14:03', type: 'text' }
    ])
  }, [])

  // Join/leave group room on group selection
  useEffect(() => {
    if (socket && selectedGroup) {
      socket.emit('join-room', `group:${selectedGroup.id}`);
      // Listen for group messages
      const handleGroupMessage = (message: any) => {
        setMessages((prev) => [...prev, message]);
      };
      socket.on('group-message', handleGroupMessage);
      return () => {
        socket.emit('leave-room', `group:${selectedGroup.id}`);
        socket.off('group-message', handleGroupMessage);
      };
    }
  }, [socket, selectedGroup]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const joinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, currentMembers: group.currentMembers + 1 }
        : group
    ))
  }

  const leaveGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, currentMembers: Math.max(0, group.currentMembers - 1) }
        : group
    ))
  }

  // Send message via socket
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You', // Replace with actual user name if available
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text' as const,
      };
      setMessages((prev) => [...prev, message]);
      if (socket && selectedGroup) {
        socket.emit('group-message', {
          room: `group:${selectedGroup.id}`,
          message: { ...message, sender: 'Someone' }, // Replace 'Someone' with actual user name
        });
      }
      setNewMessage('');
    }
  }

  const startCall = () => {
    setIsInCall(true)
  }

  const endCall = () => {
    setIsInCall(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Study Groups</h1>
              <p className="text-muted-foreground">Collaborate with peers and learn together</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Groups List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Available Groups
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedGroup?.id === group.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedGroup(group)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{group.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{group.subject}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {group.currentMembers}/{group.maxMembers} members
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Next: {group.nextSession}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {group.isActive && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Group Details & Chat */}
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <div className="space-y-6">
                {/* Group Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedGroup.name}</CardTitle>
                        <CardDescription>{selectedGroup.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button 
                          variant={selectedGroup.currentMembers < selectedGroup.maxMembers ? 'default' : 'outline'}
                          size="sm"
                          disabled={selectedGroup.currentMembers >= selectedGroup.maxMembers}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Join Group
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Group Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subject:</span>
                            <span className="font-medium">{selectedGroup.subject}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Members:</span>
                            <span className="font-medium">{selectedGroup.currentMembers}/{selectedGroup.maxMembers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Created by:</span>
                            <span className="font-medium">{selectedGroup.createdBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Next session:</span>
                            <span className="font-medium">{selectedGroup.nextSession}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedGroup.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Members ({selectedGroup.members.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedGroup.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{member.name}</span>
                                {member.role === 'admin' && <Crown className="h-3 w-3 text-yellow-500" />}
                                {member.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                              </div>
                              <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Group Chat
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={isInCall ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={isInCall ? endCall : startCall}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          {isInCall ? 'End Call' : 'Start Call'}
                        </Button>
                        {isInCall && (
                          <>
                            <Button
                              variant={isMuted ? 'destructive' : 'outline'}
                              size="sm"
                              onClick={toggleMute}
                            >
                              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant={isVideoOn ? 'outline' : 'destructive'}
                              size="sm"
                              onClick={toggleVideo}
                            >
                              {isVideoOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Messages */}
                      <div className="h-64 overflow-y-auto space-y-3">
                        {messages.map((message) => (
                          <div key={message.id} className="flex items-start space-x-3">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {message.sender.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{message.sender}</span>
                                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                              </div>
                              <p className="text-sm mt-1">{message.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a study group to start collaborating</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 