import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const { user, error } = await authenticateUser(request);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user and their student profile
    const userWithProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: { studentProfile: true }
    });

    if (!userWithProfile || userWithProfile.role !== 'STUDENT' || !userWithProfile.studentProfile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    // Fetch bookings for this student
    const bookings = await prisma.booking.findMany({
      where: { studentId: userWithProfile.studentProfile.id },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true,
                picture: true
              }
            }
          }
        }
      },
      orderBy: { startTime: 'desc' }
    });

    // Transform the data to match frontend expectations
    const transformedBookings = bookings.map((booking: {
      id: string;
      subject: string;
      startTime: Date;
      endTime: Date;
      status: string;
      tutor: {
        id: string;
        hourlyRate: number;
        mode: string;
        location: string | null;
        user: {
          name: string;
          picture: string | null;
        };
      };
    }) => ({
      id: booking.id,
      tutorName: booking.tutor.user.name,
      tutorId: booking.tutor.id,
      subject: booking.subject,
      date: booking.startTime.toISOString().split('T')[0],
      time: booking.startTime.toTimeString().split(' ')[0].substring(0, 5),
      duration: Math.round((booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60)),
      price: booking.tutor.hourlyRate * (Math.round((booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60)) / 60),
      status: booking.status,
      tutorAvatar: booking.tutor.user.picture || `/avatars/default.jpg`,
      location: booking.tutor.mode === 'online' ? 'Online' : booking.tutor.location,
      rating: null, // TODO: Add rating system
      review: null, // TODO: Add review system
      conversationId: null // TODO: Add conversation lookup
    }));

    return NextResponse.json(transformedBookings);
  } catch (error) {
    console.error('Error fetching student bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 