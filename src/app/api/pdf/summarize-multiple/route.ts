import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function extractTextFromPDF(pdfUrl: string, pageNumber: number): Promise<string> {
  try {
    // Extract chapter and subject info from URL
    const urlParts = pdfUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const chapterMatch = fileName.match(/chapter(\d+)/)
    const subjectMatch = pdfUrl.match(/class1(english|hindi|maths)/)
    
    const chapterNum = chapterMatch ? chapterMatch[1] : '1'
    const subject = subjectMatch ? subjectMatch[1] : 'general'
    
    // Generate mock educational content based on subject and page
    let mockContent = ''
    
    switch (subject) {
      case 'english':
        mockContent = `Page ${pageNumber} - English Chapter ${chapterNum}: Basic vocabulary, sentence formation, reading exercises, phonetic sounds, and language development activities suitable for Class 1 students.`
        break
        
      case 'hindi':
        mockContent = `पृष्ठ ${pageNumber} - हिंदी अध्याय ${chapterNum}: देवनागरी लिपि, वर्णमाला, शब्द निर्माण, छोटी कहानियां, और भाषा विकास की गतिविधियां कक्षा 1 के छात्रों के लिए।`
        break
        
      case 'maths':
        mockContent = `Page ${pageNumber} - Mathematics Chapter ${chapterNum}: Number recognition, counting, basic operations, shapes, patterns, measurement concepts, and problem-solving activities for Class 1.`
        break
        
      default:
        mockContent = `Page ${pageNumber}: Educational content with foundational concepts for Class 1 students.`
    }
    
    return mockContent
    
  } catch (error) {
    console.error('Error extracting PDF text:', error)
    return 'Error extracting text from PDF page.'
  }
}

async function generateCombinedSummary(
  texts: string[], 
  chapterName: string, 
  pageNumbers: number[]
): Promise<string> {
  try {
    const combinedText = texts.join('\\n\\n')
    
    const prompt = `You are an educational AI assistant. Please provide a comprehensive summary of the following content from "${chapterName}", covering pages ${pageNumbers.join(', ')}.

The summary should:
- Combine and synthesize information from all pages
- Be suitable for Class 1 students and teachers
- Highlight the main learning objectives and key concepts
- Be well-organized and easy to understand
- Be 3-4 paragraphs maximum

Content from multiple pages:
${combinedText}

Please provide a comprehensive summary:`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful educational assistant that creates clear, comprehensive summaries for elementary students and teachers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    return completion.choices[0]?.message?.content || 'Unable to generate combined summary.'
    
  } catch (error) {
    console.error('Error generating combined summary:', error)
    return 'Error generating AI summary. Please try again later.'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl, pageNumbers, chapterName } = await request.json()

    if (!pdfUrl || !pageNumbers || !Array.isArray(pageNumbers) || !chapterName) {
      return NextResponse.json(
        { error: 'Missing required fields: pdfUrl, pageNumbers (array), chapterName' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Extract text from all specified pages
    const pageTexts = await Promise.all(
      pageNumbers.map(pageNum => extractTextFromPDF(pdfUrl, pageNum))
    )
    
    // Generate combined AI summary
    const summary = await generateCombinedSummary(pageTexts, chapterName, pageNumbers)
    
    return NextResponse.json({
      summary,
      pageNumbers,
      chapterName,
      pageCount: pageNumbers.length
    })
    
  } catch (error) {
    console.error('Error in PDF multi-summarize API:', error)
    return NextResponse.json(
      { error: 'Internal server error while generating combined summary' },
      { status: 500 }
    )
  }
}