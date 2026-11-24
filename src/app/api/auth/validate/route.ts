import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setAuthCookie } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { user, error } = await authenticateUser(req);

  if (error || !user) {
    return NextResponse.json({ valid: false, error: error || 'Invalid token' }, { status: 401 });
  }

  const response = NextResponse.json({ valid: true, user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isAdmin: Boolean(user.isAdmin),
  }});

  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (token) {
    setAuthCookie(response, token);
  }
  return response;
} 