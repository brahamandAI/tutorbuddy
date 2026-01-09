import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await authenticateUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'TUTOR') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutorProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tutorProfile.availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user, error } = await authenticateUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'TUTOR') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { availability } = body;

    if (!Array.isArray(availability)) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Validate each availability slot
    for (const slot of availability) {
      if (
        typeof slot.dayOfWeek !== 'number' ||
        typeof slot.startTime !== 'string' ||
        typeof slot.endTime !== 'string' ||
        slot.dayOfWeek < 0 ||
        slot.dayOfWeek > 6
      ) {
        return NextResponse.json(
          { error: 'Invalid availability format' },
          { status: 400 }
        );
      }
    }

    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutorProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update availability in the tutor profile
    const updatedProfile = await prisma.tutorProfile.update({
      where: { userId: user.id },
      data: {
        availability: availability,
      },
    });

    return NextResponse.json(updatedProfile.availability);
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 