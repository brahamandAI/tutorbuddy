"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Pen, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Undo, 
  Redo, 
  Download, 
  Share, 
  Users,
  Palette,
  Trash2,
  Save,
  Loader2
} from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface DrawingAction {
  type: 'draw' | 'erase' | 'text' | 'shape'
  points: Point[]
  color: string
  strokeWidth: number
  text?: string
  shape?: 'rectangle' | 'circle'
}

export default function VirtualWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'text' | 'rectangle' | 'circle'>('pen')
  const [color, setColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [actions, setActions] = useState<DrawingAction[]>([])
  const [currentAction, setCurrentAction] = useState<DrawingAction | null>(null)
  const [undoStack, setUndoStack] = useState<DrawingAction[]>([])
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [collaborators, setCollaborators] = useState(0)

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ]

  const tools = [
    { id: 'pen', icon: <Pen className="h-4 w-4" />, label: 'Pen' },
    { id: 'eraser', icon: <Eraser className="h-4 w-4" />, label: 'Eraser' },
    { id: 'text', icon: <Type className="h-4 w-4" />, label: 'Text' },
    { id: 'rectangle', icon: <Square className="h-4 w-4" />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle className="h-4 w-4" />, label: 'Circle' }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set initial styles
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = color
    ctx.lineWidth = strokeWidth
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    
    const newAction: DrawingAction = {
      type: currentTool === 'eraser' ? 'erase' : 'draw',
      points: [{ x, y }],
      color: currentTool === 'eraser' ? '#FFFFFF' : color,
      strokeWidth: currentTool === 'eraser' ? 20 : strokeWidth
    }

    setCurrentAction(newAction)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAction) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const updatedAction = {
      ...currentAction,
      points: [...currentAction.points, { x, y }]
    }

    setCurrentAction(updatedAction)
    drawAction(updatedAction)
  }

  const stopDrawing = () => {
    if (currentAction) {
      setActions(prev => [...prev, currentAction])
      setUndoStack([])
    }
    setIsDrawing(false)
    setCurrentAction(null)
  }

  const drawAction = (action: DrawingAction) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = action.color
    ctx.lineWidth = action.strokeWidth

    if (action.points.length > 1) {
      ctx.beginPath()
      ctx.moveTo(action.points[0].x, action.points[0].y)
      
      for (let i = 1; i < action.points.length; i++) {
        ctx.lineTo(action.points[i].x, action.points[i].y)
      }
      
      ctx.stroke()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setActions([])
    setUndoStack([])
  }

  const undo = () => {
    if (actions.length > 0) {
      const lastAction = actions[actions.length - 1]
      setUndoStack(prev => [...prev, lastAction])
      setActions(prev => prev.slice(0, -1))
      redrawCanvas()
    }
  }

  const redo = () => {
    if (undoStack.length > 0) {
      const actionToRedo = undoStack[undoStack.length - 1]
      setActions(prev => [...prev, actionToRedo])
      setUndoStack(prev => prev.slice(0, -1))
      redrawCanvas()
    }
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    actions.forEach(action => {
      drawAction(action)
    })
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const shareWhiteboard = () => {
    // Generate shareable link
    const shareLink = `${window.location.origin}/whiteboard?session=${Date.now()}`
    navigator.clipboard.writeText(shareLink)
    // Show toast notification
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Virtual Whiteboard</h1>
          <p className="text-muted-foreground">Interactive drawing and writing for collaborative learning</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Tools Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pen className="h-5 w-5" />
                Drawing Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tools */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={currentTool === tool.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentTool(tool.id as any)}
                      className="flex items-center gap-2"
                    >
                      {tool.icon}
                      {tool.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Colors</h3>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((colorOption) => (
                    <button
                      key={colorOption}
                      className={`w-8 h-8 rounded-full border-2 ${
                        color === colorOption ? 'border-foreground' : 'border-muted'
                      }`}
                      style={{ backgroundColor: colorOption }}
                      onClick={() => setColor(colorOption)}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Width */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Stroke Width</h3>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">{strokeWidth}px</div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={actions.length === 0}
                  >
                    <Undo className="h-4 w-4 mr-1" />
                    Undo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={undoStack.length === 0}
                  >
                    <Redo className="h-4 w-4 mr-1" />
                    Redo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCanvas}
                    className="col-span-2"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Export */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Export</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadCanvas}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareWhiteboard}
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Drawing Canvas</CardTitle>
                    <CardDescription>
                      Click and drag to draw. Use the tools panel to change drawing options.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    {isCollaborating && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {collaborators} collaborators
                      </Badge>
                    )}
                    <Button
                      variant={isCollaborating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIsCollaborating(!isCollaborating)}
                    >
                      {isCollaborating ? 'Stop Collaboration' : 'Start Collaboration'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-[600px] cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Collaboration Status */}
        {isCollaborating && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaboration Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Share this link with others to collaborate in real-time
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Session ID: {Date.now()}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 