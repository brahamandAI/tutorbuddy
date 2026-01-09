"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Calculator, Atom, Dna, Book, History, Code, Music, Palette, Globe, Heart, Zap } from 'lucide-react'

interface Subject {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  tutorCount: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
}

export default function SubjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const subjects: Subject[] = [
    {
      id: '1',
      name: 'Mathematics',
      description: 'Algebra, calculus, geometry, and statistics',
      icon: <Calculator className="h-8 w-8" />,
      tutorCount: 45,
      difficulty: 'Intermediate',
      category: 'STEM'
    },
    {
      id: '2',
      name: 'Physics',
      description: 'Mechanics, thermodynamics, and quantum physics',
      icon: <Atom className="h-8 w-8" />,
      tutorCount: 32,
      difficulty: 'Advanced',
      category: 'STEM'
    },
    {
      id: '3',
      name: 'Chemistry',
      description: 'Organic chemistry, biochemistry, and analytical chemistry',
      icon: <Zap className="h-8 w-8" />,
      tutorCount: 28,
      difficulty: 'Intermediate',
      category: 'STEM'
    },
    {
      id: '4',
      name: 'Biology',
      description: 'Cell biology, genetics, and ecology',
      icon: <Dna className="h-8 w-8" />,
      tutorCount: 35,
      difficulty: 'Intermediate',
      category: 'STEM'
    },
    {
      id: '5',
      name: 'English Literature',
      description: 'Classic literature, poetry, and creative writing',
      icon: <Book className="h-8 w-8" />,
      tutorCount: 52,
      difficulty: 'Beginner',
      category: 'Humanities'
    },
    {
      id: '6',
      name: 'History',
      description: 'World history, American history, and ancient civilizations',
      icon: <History className="h-8 w-8" />,
      tutorCount: 38,
      difficulty: 'Beginner',
      category: 'Humanities'
    },
    {
      id: '7',
      name: 'Computer Science',
      description: 'Programming, algorithms, and software development',
      icon: <Code className="h-8 w-8" />,
      tutorCount: 41,
      difficulty: 'Advanced',
      category: 'STEM'
    },
    {
      id: '8',
      name: 'Music Theory',
      description: 'Music composition, theory, and performance',
      icon: <Music className="h-8 w-8" />,
      tutorCount: 25,
      difficulty: 'Intermediate',
      category: 'Arts'
    },
    {
      id: '9',
      name: 'Art History',
      description: 'Renaissance, modern art, and contemporary movements',
      icon: <Palette className="h-8 w-8" />,
      tutorCount: 18,
      difficulty: 'Beginner',
      category: 'Arts'
    },
    {
      id: '10',
      name: 'Geography',
      description: 'Physical geography, human geography, and cartography',
      icon: <Globe className="h-8 w-8" />,
      tutorCount: 22,
      difficulty: 'Beginner',
      category: 'Humanities'
    },
    {
      id: '11',
      name: 'Psychology',
      description: 'Cognitive psychology, behavioral science, and research methods',
      icon: <Heart className="h-8 w-8" />,
      tutorCount: 29,
      difficulty: 'Intermediate',
      category: 'Social Sciences'
    },
    {
      id: '12',
      name: 'Economics',
      description: 'Microeconomics, macroeconomics, and economic theory',
      icon: <BookOpen className="h-8 w-8" />,
      tutorCount: 31,
      difficulty: 'Advanced',
      category: 'Social Sciences'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Subjects' },
    { id: 'STEM', name: 'STEM' },
    { id: 'Humanities', name: 'Humanities' },
    { id: 'Arts', name: 'Arts' },
    { id: 'Social Sciences', name: 'Social Sciences' }
  ]

  const filteredSubjects = selectedCategory === 'all' 
    ? subjects 
    : subjects.filter(subject => subject.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Academic Subjects</h1>
          <p className="text-muted-foreground text-lg">Explore our comprehensive range of subjects and find the perfect tutor</p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSubjects.map(subject => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-primary">
                    {subject.icon}
                  </div>
                  <Badge className={getDifficultyColor(subject.difficulty)}>
                    {subject.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <CardDescription>{subject.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {subject.tutorCount} tutors available
                  </span>
                  <Button size="sm" variant="outline">
                    Find Tutors
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No subjects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
} 