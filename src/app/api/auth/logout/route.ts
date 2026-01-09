import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the token cookie by setting it to empty and expiring it
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });
  return response;
} 