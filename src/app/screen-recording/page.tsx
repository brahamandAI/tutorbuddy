"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  Square, 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  Settings, 
  Clock,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  HardDrive,
  AlertCircle
} from 'lucide-react'

interface Recording {
  id: string
  title: string
  duration: string
  size: string
  date: string
  type: 'screen' | 'camera' | 'both'
  url: string
}

export default function ScreenRecording() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [settings, setSettings] = useState({
    includeAudio: true,
    includeVideo: true,
    quality: 'high' as 'low' | 'medium' | 'high',
    maxDuration: 60 // minutes
  })
  const [error, setError] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Sample recordings
  useEffect(() => {
    setRecordings([
      {
        id: '1',
        title: 'Mathematics Session - Algebra Basics',
        duration: '45:30',
        size: '125 MB',
        date: '2024-01-15',
        type: 'both',
        url: '/recordings/math-session.mp4'
      },
      {
        id: '2',
        title: 'Physics Tutorial - Newton\'s Laws',
        duration: '32:15',
        size: '89 MB',
        date: '2024-01-14',
        type: 'screen',
        url: '/recordings/physics-tutorial.mp4'
      },
      {
        id: '3',
        title: 'Chemistry Lab Session',
        duration: '58:42',
        size: '156 MB',
        date: '2024-01-13',
        type: 'camera',
        url: '/recordings/chemistry-lab.mp4'
      }
    ])
  }, [])

  const startRecording = async () => {
    try {
      setError('')
      
      const constraints: MediaStreamConstraints = {
        video: settings.includeVideo ? {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } : false,
        audio: settings.includeAudio ? {
          echoCancellation: true,
          noiseSuppression: true
        } : false
      }

      const stream = await navigator.mediaDevices.getDisplayMedia(constraints)
      streamRef.current = stream

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data])
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        
        const newRecording: Recording = {
          id: Date.now().toString(),
          title: `Recording ${new Date().toLocaleString()}`,
          duration: formatTime(recordingTime),
          size: formatFileSize(blob.size),
          date: new Date().toISOString().split('T')[0],
          type: settings.includeVideo && settings.includeAudio ? 'both' : 
                settings.includeVideo ? 'screen' : 'camera',
          url
        }

        setRecordings(prev => [newRecording, ...prev])
        setRecordedChunks([])
        setRecordingTime(0)
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= settings.maxDuration * 60) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)

      return () => clearInterval(timer)
    } catch (err) {
      setError('Failed to start recording. Please check permissions.')
      console.error('Recording error:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setIsRecording(false)
    setMediaRecorder(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const downloadRecording = (recording: Recording) => {
    const link = document.createElement('a')
    link.href = recording.url
    link.download = `${recording.title}.webm`
    link.click()
  }

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id))
  }

  const getRecordingTypeIcon = (type: string) => {
    switch (type) {
      case 'screen': return <Monitor className="h-4 w-4" />
      case 'camera': return <Camera className="h-4 w-4" />
      case 'both': return <Video className="h-4 w-4" />
      default: return <Video className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Screen Recording</h1>
          <p className="text-muted-foreground">Record your tutoring sessions for review and sharing</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recording Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Recording Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recording Status */}
              <div className="text-center p-4 border rounded-lg">
                {isRecording ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-red-600">Recording</span>
                    </div>
                    <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    Ready to record
                  </div>
                )}
              </div>

              {/* Recording Buttons */}
              <div className="space-y-2">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording}
                    className="w-full"
                    size="lg"
                  >
                    <Video className="mr-2 h-5 w-5" />
                    Start Recording
                  </Button>
                ) : (
                  <Button 
                    onClick={stopRecording}
                    variant="destructive"
                    className="w-full"
                    size="lg"
                  >
                    <Square className="mr-2 h-5 w-5" />
                    Stop Recording
                  </Button>
                )}
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Recording Settings</h3>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.includeAudio}
                      onChange={(e) => setSettings(prev => ({ ...prev, includeAudio: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Include Audio</span>
                    {settings.includeAudio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.includeVideo}
                      onChange={(e) => setSettings(prev => ({ ...prev, includeVideo: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Include Video</span>
                    {settings.includeVideo ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality</label>
                  <select
                    value={settings.quality}
                    onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value as any }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="low">Low (Smaller file)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="high">High (Best quality)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Duration: {settings.maxDuration} minutes</label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={settings.maxDuration}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxDuration: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {isRecording ? 'Live recording preview' : 'Recording preview will appear here'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {isRecording ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground">Recording in progress...</p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-2" />
                    <p>Click "Start Recording" to begin</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recordings List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Recorded Sessions
            </CardTitle>
            <CardDescription>
              Your recorded tutoring sessions for review and sharing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recordings.length > 0 ? (
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div key={recording.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getRecordingTypeIcon(recording.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{recording.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recording.duration}
                          </span>
                          <span>{recording.size}</span>
                          <span>{recording.date}</span>
                          <Badge variant="secondary">
                            {recording.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadRecording(recording)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRecording(recording.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="h-12 w-12 mx-auto mb-2" />
                <p>No recordings yet. Start recording your first session!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 