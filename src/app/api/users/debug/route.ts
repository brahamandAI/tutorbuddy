import { NextResponse } from 'next/server';

// Use the shared users array
declare global {
  var users: any[];
}

if (!global.users) {
  global.users = [];
}

const users = global.users;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        provider: user.provider,
        googleId: user.googleId,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      })),
    });
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 