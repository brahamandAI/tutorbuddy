import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function extractTextFromPDF(pdfUrl: string, pageNumber: number): Promise<string> {
  try {
    // For now, we'll use educational content templates based on the PDF structure
    // In a production environment, you would use proper PDF parsing libraries
    
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
        mockContent = `This is page ${pageNumber} of English Chapter ${chapterNum}. 
        
Key topics covered:
- Basic English vocabulary and word recognition
- Simple sentence formation and grammar rules
- Reading comprehension exercises with short stories
- Letter recognition and phonetic sounds
- Interactive activities for language development

Learning objectives:
Students will learn fundamental English language skills including basic vocabulary, sentence construction, and reading comprehension suitable for Class 1 level.`
        break
        
      case 'hindi':
        mockContent = `यह हिंदी अध्याय ${chapterNum} का पृष्ठ ${pageNumber} है।
        
मुख्य विषय:
- देवनागरी लिपि और वर्णमाला की पहचान
- सरल शब्द निर्माण और उच्चारण
- छोटी कहानियों के माध्यम से पढ़ना सीखना
- व्याकरण की बुनियादी बातें
- भाषा विकास के लिए मजेदार गतिविधियां

सीखने के उद्देश्य:
छात्र हिंदी भाषा के मूल कौशल सीखेंगे जिसमें बुनियादी शब्दावली और वाक्य निर्माण शामिल है।`
        break
        
      case 'maths':
        mockContent = `This is page ${pageNumber} of Mathematics Chapter ${chapterNum}.
        
Mathematical concepts covered:
- Number recognition and counting (1-10, 1-20, 1-100)
- Basic addition and subtraction with visual aids
- Shape recognition (circle, square, triangle, rectangle)
- Pattern identification and sequence building
- Measurement concepts (big/small, long/short, heavy/light)
- Simple problem-solving activities

Learning outcomes:
Students will develop fundamental mathematical thinking including number sense, basic operations, and geometric awareness appropriate for Class 1.`
        break
        
      default:
        mockContent = `Educational content for page ${pageNumber}. This page contains important concepts and exercises designed for Class 1 students to build foundational knowledge in the subject.`
    }
    
    return mockContent
    
  } catch (error) {
    console.error('Error extracting PDF text:', error)
    return 'Error extracting text from PDF page.'
  }
}

async function generateSummary(text: string, chapterName: string, pageNumber: number): Promise<string> {
  try {
    const prompt = `You are an educational AI assistant. Please provide a clear and concise summary of the following text from "${chapterName}", Page ${pageNumber}. 

The summary should:
- Be suitable for students
- Highlight key concepts and learning objectives
- Be 2-3 paragraphs maximum
- Use simple, clear language

Text to summarize:
${text}

Please provide the summary:`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful educational assistant that creates clear, concise summaries for students."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    })

    return completion.choices[0]?.message?.content || 'Unable to generate summary.'
    
  } catch (error) {
    console.error('Error generating summary:', error)
    return 'Error generating AI summary. Please try again later.'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl, pageNumber, chapterName } = await request.json()

    if (!pdfUrl || !pageNumber || !chapterName) {
      return NextResponse.json(
        { error: 'Missing required fields: pdfUrl, pageNumber, chapterName' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Extract text from the specific PDF page
    const pageText = await extractTextFromPDF(pdfUrl, pageNumber)
    
    // Generate AI summary
    const summary = await generateSummary(pageText, chapterName, pageNumber)
    
    return NextResponse.json({
      summary,
      pageNumber,
      chapterName
    })
    
  } catch (error) {
    console.error('Error in PDF summarize API:', error)
    return NextResponse.json(
      { error: 'Internal server error while generating summary' },
      { status: 500 }
    )
  }
}