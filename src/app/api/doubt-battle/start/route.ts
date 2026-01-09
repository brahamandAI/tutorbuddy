import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { authenticateUser } from '@/lib/auth';

export const runtime = 'nodejs';

function extractJsonFromText(text: string): any {
  try {
    return JSON.parse(text);
  } catch {}
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  return null;
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const { user, error } = await authenticateUser(req as any);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (process.env.NEXT_PUBLIC_DEMO === '1') {
      return NextResponse.json({
        id: 'DEMO123',
        subject: 'Class 10 Science',
        questions: [
          { q: 'What is the chemical formula for water?', options: ['H2O', 'CO2', 'O2'], answerIndex: 0 },
          { q: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth'], answerIndex: 1 },
          { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome'], answerIndex: 1 },
          { q: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt'], answerIndex: 1 },
          { q: 'Which gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen'], answerIndex: 1 }
        ],
        status: 'pending',
        challenger: user.email,
        opponent: 'friend@example.com',
        xp: 0,
        battleCode: 'DEMO123'
      });
    }

    const { subject, numQuestions = 5, opponent } = await req.json();
    
    if (!subject || !numQuestions || !opponent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfigured: OPENAI_API_KEY missing' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });
    
    // Generate battle-specific questions using OpenAI
    const systemPrompt = `You are an expert educational content creator. Generate ${numQuestions} multiple-choice questions for the subject: ${subject}. 
    
    Return STRICT JSON only with this exact format:
    {
      "questions": [
        {
          "q": "Question text here?",
          "options": ["Option A", "Option B", "Option C"],
          "answerIndex": 0,
          "explanation": "Brief explanation of why this is correct"
        }
      ]
    }
    
    Guidelines:
    - Make questions engaging and challenging but appropriate for the subject level
    - Include 3 options for each question
    - answerIndex should be 0, 1, or 2 (corresponding to the options array)
    - Add a brief explanation for each correct answer
    - Questions should test understanding, not just memorization`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${numQuestions} questions for ${subject}. Make them fun and educational!` }
      ],
    });

    const content = completion.choices?.[0]?.message?.content || '';
    const parsed = extractJsonFromText(content);

    if (!parsed || !Array.isArray(parsed.questions)) {
      return NextResponse.json(
        { error: 'AI response malformed. Please try again.' },
        { status: 502 }
      );
    }

    // Generate unique battle code
    const battleCode = `BATTLE${Date.now().toString(36).toUpperCase()}`;
    
    // Create battle object
    const battle = {
      id: battleCode,
      subject,
      questions: parsed.questions,
      status: 'pending',
      challenger: user.email,
      opponent,
      xp: 0,
      battleCode,
      createdAt: new Date().toISOString(),
      challengerScore: 0,
      opponentScore: 0,
      currentQuestion: 0,
      timeLimit: 30 // seconds per question
    };

    // In a real app, you'd save this to your database
    // For now, we'll return it directly
    
    return NextResponse.json(battle);
  } catch (err: any) {
    console.error('doubt-battle start error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
} 