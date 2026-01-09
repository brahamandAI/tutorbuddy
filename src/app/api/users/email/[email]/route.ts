import { NextRequest, NextResponse } from 'next/server';

// Use the shared users array
declare global {
  var users: any[];
}

if (!global.users) {
  global.users = [];
}

const users = global.users;

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);
    
    // Find user by email
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        user: null,
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        provider: user.provider,
        googleId: user.googleId,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
      },
    });

  } catch (error) {
    console.error('Get user by email error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
} 