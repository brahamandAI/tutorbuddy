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
    const chapterNumber = searchParams.get('chapter')

    if (!className || !subjectId || !chapterNumber) {
      return NextResponse.json({ 
        error: 'Class, subject, and chapter parameters are required' 
      }, { status: 400 })
    }

    const chapterNum = parseInt(chapterNumber, 10)
    if (isNaN(chapterNum)) {
      return NextResponse.json({ 
        error: 'Invalid chapter number' 
      }, { status: 400 })
    }

    // Find the subject directory
    const classDir = path.join(process.cwd(), 'public', 'pdfs', `class${className}`)
    
    if (!fs.existsSync(classDir)) {
      return NextResponse.json({ 
        error: 'Class not found' 
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
        error: 'Subject not found' 
      }, { status: 404 })
    }

    const subjectPath = path.join(classDir, subjectFolder.name)

    // Find the PDF file for this chapter
    const files = fs.readdirSync(subjectPath)
    const chapterFile = files.find(file => {
      const fileChapterNum = extractChapterNumber(file)
      return fileChapterNum === chapterNum && file.toLowerCase().endsWith('.pdf')
    })

    if (!chapterFile) {
      return NextResponse.json({ 
        error: 'Chapter not found' 
      }, { status: 404 })
    }

    // Get file stats for additional information
    const filePath = path.join(subjectPath, chapterFile)
    const stats = fs.statSync(filePath)

    const chapter = {
      number: chapterNum,
      title: generateChapterTitle(subjectId, chapterNum),
      filename: chapterFile,
      pdfUrl: `/pdfs/class${className}/${subjectFolder.name}/${chapterFile}`,
      description: generateChapterDescription(subjectId, chapterNum, className),
      fileSize: formatFileSize(stats.size),
      lastModified: stats.mtime.toISOString(),
      totalPages: await estimatePageCount(filePath) // This is an estimate
    }

    return NextResponse.json({ 
      success: true,
      class: className,
      subject: subjectId,
      chapter: chapter
    })

  } catch (error) {
    console.error('Error loading chapter:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

function extractChapterNumber(filename: string): number {
  // Extract number from filenames like "chapter1.pdf", "ch1.pdf", "1.pdf", etc.
  const match = filename.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

function generateChapterTitle(subjectId: string, chapterNumber: number): string {
  // Custom chapter titles based on actual NCERT content
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
      9: 'बंदर और गिलहरी',
      10: 'पत्ते ही पत्ते',
      11: 'पतंग',
      12: 'गेंद-बल्ला',
      13: 'बंदर बाँट',
      14: 'एक बुढ़िया',
      15: 'मैं भी',
      16: 'लालू और पीलू',
      17: 'चकई के चकदुम',
      18: 'छोटी का कमाल',
      19: 'चार चने'
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
      9: 'Data Handling',
      10: 'Patterns',
      11: 'Numbers',
      12: 'Games and Fun',
      13: 'How Many?'
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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function estimatePageCount(filePath: string): Promise<number> {
  // This is a rough estimate based on file size
  // In a real implementation, you'd use a PDF library to get exact page count
  try {
    const stats = fs.statSync(filePath)
    const fileSizeMB = stats.size / (1024 * 1024)
    
    // Rough estimation: 1 page ≈ 50-200 KB for typical textbook content
    // This varies greatly based on images, text density, etc.
    const estimatedPages = Math.max(1, Math.round(fileSizeMB / 0.1)) // Assume ~100KB per page
    
    // Cap the estimate at reasonable bounds
    return Math.min(Math.max(estimatedPages, 1), 50)
  } catch (error) {
    console.warn('Could not estimate page count:', error)
    return 10 // Default fallback
  }
}