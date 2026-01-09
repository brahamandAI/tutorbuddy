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
        status: 'active',
        challenger: 'friend@example.com',
        opponent: user.email,
        xp: 0,
        battleCode: 'DEMO123'
      });
    }

    const { battleCode } = await req.json();
    
    if (!battleCode) {
      return NextResponse.json({ error: 'Battle code is required' }, { status: 400 });
    }

    // In a real app, you'd fetch the battle from your database
    // For now, we'll return a mock battle
    const battle = {
      id: battleCode,
      subject: 'Class 10 Science',
      questions: [
        { q: 'What is the chemical formula for water?', options: ['H2O', 'CO2', 'O2'], answerIndex: 0 },
        { q: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth'], answerIndex: 1 },
        { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome'], answerIndex: 1 },
        { q: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt'], answerIndex: 1 },
        { q: 'Which gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen'], answerIndex: 1 }
      ],
      status: 'active',
      challenger: 'friend@example.com',
      opponent: user.email,
      xp: 0,
      battleCode,
      currentQuestion: 0,
      challengerScore: 0,
      opponentScore: 0,
      timeLimit: 30
    };
    
    return NextResponse.json(battle);
  } catch (err: any) {
    console.error('doubt-battle join error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
} 