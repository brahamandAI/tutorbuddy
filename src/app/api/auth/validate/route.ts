import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { user, error } = await authenticateUser(req);

  if (error || !user) {
    return NextResponse.json({ valid: false, error: error || 'Invalid token' }, { status: 401 });
  }

  return NextResponse.json({ valid: true, user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }});
} 