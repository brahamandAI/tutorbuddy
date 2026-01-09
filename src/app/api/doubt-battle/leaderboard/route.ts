import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    // Check authentication
    const { user, error } = await authenticateUser(req as any);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (process.env.NEXT_PUBLIC_DEMO === '1') {
      return NextResponse.json([
        { user: user.email, xp: 120, wins: 5, streak: 2 },
        { user: 'friend1@example.com', xp: 100, wins: 4, streak: 1 },
        { user: 'friend2@example.com', xp: 80, wins: 3, streak: 1 },
        { user: 'friend3@example.com', xp: 60, wins: 2, streak: 0 },
        { user: 'friend4@example.com', xp: 40, wins: 1, streak: 0 }
      ]);
    }

    // In a real app, you'd fetch from your database
    // For now, return mock data
    const leaderboard = [
      { user: user.email, xp: 120, wins: 5, streak: 2 },
      { user: 'friend1@example.com', xp: 100, wins: 4, streak: 1 },
      { user: 'friend2@example.com', xp: 80, wins: 3, streak: 1 },
      { user: 'friend3@example.com', xp: 60, wins: 2, streak: 0 },
      { user: 'friend4@example.com', xp: 40, wins: 1, streak: 0 }
    ];
    
    return NextResponse.json(leaderboard);
  } catch (err: any) {
    console.error('doubt-battle leaderboard error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
} 