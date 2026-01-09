import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Check authentication
    const { user, error } = await authenticateUser(req as any);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { battleCode, questionIndex, selectedAnswer, timeTaken } = await req.json();
    
    if (!battleCode || questionIndex === undefined || selectedAnswer === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_DEMO === '1') {
      // Mock response for demo mode
      const isCorrect = Math.random() > 0.5; // Random for demo
      return NextResponse.json({
        correct: isCorrect,
        correctAnswer: 1, // Mock correct answer
        explanation: 'This is a demo explanation for the answer.',
        score: isCorrect ? 10 : 0,
        timeBonus: Math.floor(Math.random() * 5) + 1,
        nextQuestion: questionIndex + 1,
        battleComplete: questionIndex >= 4 // 5 questions total
      });
    }

    // In a real app, you'd:
    // 1. Fetch the battle from database
    // 2. Check if the answer is correct
    // 3. Calculate score with time bonus
    // 4. Update battle progress
    // 5. Check if battle is complete
    
    // Mock response for now
    const isCorrect = Math.random() > 0.5;
    const score = isCorrect ? 10 : 0;
    const timeBonus = Math.max(0, 5 - Math.floor(timeTaken / 10)); // Bonus for fast answers
    
    return NextResponse.json({
      correct: isCorrect,
      correctAnswer: 1, // Mock correct answer
      explanation: 'This is an explanation for the correct answer.',
      score: score + timeBonus,
      timeBonus,
      nextQuestion: questionIndex + 1,
      battleComplete: questionIndex >= 4
    });
  } catch (err: any) {
    console.error('doubt-battle submit-answer error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
} 