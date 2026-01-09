"use client"

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/Button'

export default function TestTheme() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Theme Test Page</h1>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Current Theme: {theme}</h2>
          
          <div className="flex gap-4">
            <Button onClick={() => setTheme('light')} variant="outline">
              Light Theme
            </Button>
            <Button onClick={() => setTheme('dark')} variant="outline">
              Dark Theme
            </Button>
            <Button onClick={() => setTheme('system')} variant="outline">
              System Theme
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="p-6 bg-card text-card-foreground rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Card Component</h3>
            <p className="text-muted-foreground">
              This card should change colors based on the theme.
            </p>
          </div>
          
          <div className="p-6 bg-primary text-primary-foreground rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Primary Button Style</h3>
            <p>This uses primary colors that should adapt to the theme.</p>
          </div>
          
          <div className="p-6 bg-secondary text-secondary-foreground rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Secondary Background</h3>
            <p>This uses secondary colors for the theme.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 