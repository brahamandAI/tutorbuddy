import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Force dynamic route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class')

    if (!className) {
      return NextResponse.json({ error: 'Class parameter is required' }, { status: 400 })
    }

    // Path to the PDFs directory for this class
    const classDir = path.join(process.cwd(), 'public', 'pdfs', `class${className}`)

    // Check if class directory exists
    if (!fs.existsSync(classDir)) {
      return NextResponse.json({ 
        error: 'Class not found',
        subjects: [] 
      }, { status: 404 })
    }

    // Read all subdirectories (subjects) in the class directory
    const items = fs.readdirSync(classDir, { withFileTypes: true })
    const subjectDirs = items.filter(item => item.isDirectory())

    const subjects = subjectDirs.map(dir => {
      const subjectName = dir.name
      const subjectPath = path.join(classDir, subjectName)
      
      // Count PDF files in subject directory
      let chapterCount = 0
      try {
        const files = fs.readdirSync(subjectPath)
        chapterCount = files.filter(file => file.toLowerCase().endsWith('.pdf')).length
      } catch (err) {
        console.warn(`Could not read subject directory: ${subjectPath}`)
      }

      // Extract subject ID from folder name (e.g., "class1english" -> "english")
      const subjectId = subjectName.replace(/^class\d+/, '').toLowerCase()
      
      return {
        id: subjectId,
        name: subjectName,
        displayName: getSubjectDisplayName(subjectId),
        chapters: chapterCount,
        description: getSubjectDescription(subjectId, className),
        color: getSubjectColor(subjectId)
      }
    })

    return NextResponse.json({ 
      success: true,
      class: className,
      subjects: subjects.sort((a, b) => a.displayName.localeCompare(b.displayName))
    })

  } catch (error) {
    console.error('Error loading subjects:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      subjects: [] 
    }, { status: 500 })
  }
}

function getSubjectDisplayName(subjectId: string): string {
  const subjectNames: Record<string, string> = {
    'english': 'English',
    'hindi': 'Hindi',
    'maths': 'Mathematics',
    'math': 'Mathematics',
    'science': 'Science',
    'social': 'Social Studies',
    'evs': 'Environmental Studies',
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'history': 'History',
    'geography': 'Geography',
    'civics': 'Civics',
    'economics': 'Economics'
  }
  return subjectNames[subjectId] || subjectId.charAt(0).toUpperCase() + subjectId.slice(1)
}

function getSubjectDescription(subjectId: string, className: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    'english': {
      '1': 'Basic English language learning with stories and vocabulary',
      '2': 'Expanded English vocabulary and simple reading comprehension',
      'default': 'English language and literature'
    },
    'hindi': {
      '1': 'Hindi language fundamentals and basic reading skills',
      '2': 'Intermediate Hindi reading and writing skills',
      'default': 'Hindi language and literature'
    },
    'maths': {
      '1': 'Basic mathematical concepts, numbers, and simple operations',
      '2': 'Elementary arithmetic and problem-solving',
      'default': 'Mathematical concepts and problem-solving'
    },
    'science': {
      'default': 'Scientific concepts and experiments'
    },
    'social': {
      'default': 'Social studies, history, and geography'
    }
  }

  const subjectDescriptions = descriptions[subjectId]
  if (subjectDescriptions) {
    return subjectDescriptions[className] || subjectDescriptions['default']
  }
  
  return `${getSubjectDisplayName(subjectId)} learning materials for Class ${className}`
}

function getSubjectColor(subjectId: string): string {
  const colors: Record<string, string> = {
    'english': 'bg-blue-500',
    'hindi': 'bg-orange-500',
    'maths': 'bg-green-500',
    'math': 'bg-green-500',
    'science': 'bg-purple-500',
    'social': 'bg-red-500',
    'evs': 'bg-teal-500',
    'physics': 'bg-indigo-500',
    'chemistry': 'bg-pink-500',
    'biology': 'bg-emerald-500',
    'history': 'bg-amber-500',
    'geography': 'bg-cyan-500',
    'civics': 'bg-rose-500',
    'economics': 'bg-violet-500'
  }
  return colors[subjectId] || 'bg-gray-500'
}