import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Force dynamic route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class')
    const subjectId = searchParams.get('subject')

    if (!className || !subjectId) {
      return NextResponse.json({ 
        error: 'Class and subject parameters are required' 
      }, { status: 400 })
    }

    // Find the subject directory
    const classDir = path.join(process.cwd(), 'public', 'pdfs', `class${className}`)
    
    if (!fs.existsSync(classDir)) {
      return NextResponse.json({ 
        error: 'Class not found',
        chapters: [] 
      }, { status: 404 })
    }

    // Find the correct subject folder
    const items = fs.readdirSync(classDir, { withFileTypes: true })
    const subjectFolder = items.find(item => 
      item.isDirectory() && 
      item.name.toLowerCase().includes(subjectId.toLowerCase())
    )

    if (!subjectFolder) {
      return NextResponse.json({ 
        error: 'Subject not found',
        chapters: [] 
      }, { status: 404 })
    }

    const subjectPath = path.join(classDir, subjectFolder.name)

    // Read all PDF files in the subject directory
    const files = fs.readdirSync(subjectPath)
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'))

    // Sort files naturally (chapter1.pdf, chapter2.pdf, etc.)
    pdfFiles.sort((a, b) => {
      const aNum = extractChapterNumber(a)
      const bNum = extractChapterNumber(b)
      return aNum - bNum
    })

    const chapters = pdfFiles.map((filename, index) => {
      const chapterNumber = extractChapterNumber(filename) || (index + 1)
      
      return {
        number: chapterNumber,
        title: generateChapterTitle(subjectId, chapterNumber),
        filename: filename,
        pdfUrl: `/pdfs/class${className}/${subjectFolder.name}/${filename}`,
        description: generateChapterDescription(subjectId, chapterNumber, className)
      }
    })

    return NextResponse.json({ 
      success: true,
      class: className,
      subject: subjectId,
      subjectFolder: subjectFolder.name,
      chapters: chapters
    })

  } catch (error) {
    console.error('Error loading chapters:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      chapters: [] 
    }, { status: 500 })
  }
}

function extractChapterNumber(filename: string): number {
  // Extract number from filenames like "chapter1.pdf", "ch1.pdf", "1.pdf", etc.
  const match = filename.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

function generateChapterTitle(subjectId: string, chapterNumber: number): string {
  // You can customize chapter titles based on actual NCERT content
  const customTitles: Record<string, Record<number, string>> = {
    'english': {
      1: 'A Happy Child',
      2: 'Three Little Pigs',
      3: 'After a Bath',
      4: 'The Bubble, the Straw and the Shoe',
      5: 'Lazy Frog',
      6: 'The Turtle and the Rabbit',
      7: 'Murali\'s New Friend',
      8: 'Flying-Man',
      9: 'My Good Friend'
    },
    'hindi': {
      1: 'झूला',
      2: 'आम की कहानी', 
      3: 'कबूतर',
      4: 'पगड़ी',
      5: 'पकौड़ी',
      6: 'छुक-छुक गाड़ी',
      7: 'रसोईघर',
      8: 'चूहो! म्याऊँ सो रही है',
      9: 'बंदर और गिलहरी'
    },
    'maths': {
      1: 'Shapes and Space',
      2: 'Numbers from One to Nine',
      3: 'Addition',
      4: 'Subtraction', 
      5: 'Numbers from Ten to Twenty',
      6: 'Time',
      7: 'Measurement',
      8: 'Money',
      9: 'Data Handling'
    }
  }

  const subjectTitles = customTitles[subjectId]
  if (subjectTitles && subjectTitles[chapterNumber]) {
    return `Chapter ${chapterNumber}: ${subjectTitles[chapterNumber]}`
  }

  return `Chapter ${chapterNumber}`
}

function generateChapterDescription(subjectId: string, chapterNumber: number, className: string): string {
  const subjectName = getSubjectDisplayName(subjectId)
  return `${subjectName} - Chapter ${chapterNumber} learning materials for Class ${className}`
}

function getSubjectDisplayName(subjectId: string): string {
  const subjectNames: Record<string, string> = {
    'english': 'English',
    'hindi': 'Hindi',
    'maths': 'Mathematics',
    'math': 'Mathematics',
    'science': 'Science',
    'social': 'Social Studies'
  }
  return subjectNames[subjectId] || subjectId.charAt(0).toUpperCase() + subjectId.slice(1)
}