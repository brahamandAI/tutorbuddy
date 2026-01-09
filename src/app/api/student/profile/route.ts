import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Access denied. Student only.' }, { status: 403 });
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    return NextResponse.json(studentProfile);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Access denied. Student only.' }, { status: 403 });
    }

    const body = await request.json();
    const { grade, subjects } = body;

    // Validate required fields
    if (!grade) {
      return NextResponse.json({ error: 'Grade is required' }, { status: 400 });
    }

    // Update or create student profile
    const updatedProfile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        grade,
        subjects: subjects || [],
      },
      create: {
        userId: user.id,
        grade,
        subjects: subjects || [],
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating student profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 