import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

interface GenerateExercisesRequest {
  summary: string
  pages: number[]
  subject?: string
  pdfPath?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateExercisesRequest = await request.json()
    const { summary, pages, subject = 'general', pdfPath } = body

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary is required' },
        { status: 400 }
      )
    }

    // Generate exercises using OpenAI
    const systemPrompt = `You are an expert educational AI that creates engaging practice exercises.
Your task is to generate interactive learning activities based on provided content.

Guidelines:
1. Create exercises that test understanding, not just memory
2. Make questions clear and unambiguous
3. Ensure all information is derived from the provided content
4. Create age-appropriate exercises for the subject
5. Focus on key concepts and important details

Subject: ${subject}
Pages: ${pages.join(', ')}

You must respond with ONLY valid JSON in this exact format:
{
  "matchPairs": [
    {
      "id": "unique-id-1",
      "left": "Term or concept",
      "right": "Definition or explanation"
    }
  ],
  "fillInBlanks": [
    {
      "id": "unique-id-1",
      "sentence": "The ____ is an important concept.",
      "blank": "answer",
      "options": ["answer", "wrong1", "wrong2", "wrong3"],
      "correctAnswer": "answer"
    }
  ]
}

Important:
- Generate 5-6 matching pairs
- Generate 4-5 fill-in-the-blank questions
- Each fill-in-the-blank should have 4 options (1 correct, 3 plausible distractors)
- Use ____ to indicate where the blank should be in the sentence
- Make distractors plausible but clearly incorrect
- Return ONLY the JSON object, no additional text`

    const userPrompt = `Based on this educational content, create interactive exercises:

${summary}

Generate matching pairs and fill-in-the-blank questions that test understanding of this content.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      return NextResponse.json(
        { error: 'Failed to generate exercises' },
        { status: 500 }
      )
    }

    try {
      // Parse the JSON response
      const exercises = JSON.parse(responseText)

      // Validate the structure
      if (!exercises.matchPairs || !exercises.fillInBlanks) {
        throw new Error('Invalid exercise structure')
      }

      // Add unique IDs if not present
      exercises.matchPairs = exercises.matchPairs.map((pair: any, index: number) => ({
        ...pair,
        id: pair.id || `match-${index}`
      }))

      exercises.fillInBlanks = exercises.fillInBlanks.map((question: any, index: number) => ({
        ...question,
        id: question.id || `fill-${index}`
      }))

      return NextResponse.json(exercises)

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Response was:', responseText)
      
      // Return fallback exercises
      return NextResponse.json({
        matchPairs: [
          {
            id: "match-1",
            left: "Key Concept 1",
            right: "Definition from the summary"
          },
          {
            id: "match-2",
            left: "Key Concept 2",
            right: "Another important definition"
          },
          {
            id: "match-3",
            left: "Key Concept 3",
            right: "Related explanation"
          }
        ],
        fillInBlanks: [
          {
            id: "fill-1",
            sentence: "The main topic discussed in this section is ____.",
            blank: "concept",
            options: ["concept", "unrelated", "incorrect", "wrong"],
            correctAnswer: "concept"
          },
          {
            id: "fill-2",
            sentence: "An important characteristic mentioned is ____.",
            blank: "feature",
            options: ["feature", "aspect", "trait", "quality"],
            correctAnswer: "feature"
          }
        ]
      })
    }

  } catch (error) {
    console.error('Error generating exercises:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate exercises',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Learning Exercises Generation API',
    usage: 'POST with { summary, pages, subject, pdfPath }',
    returns: '{ matchPairs: [], fillInBlanks: [] }'
  })
}
