import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const { user, error } = await authenticateUser(request);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user and their tutor profile
    const userWithProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: { tutorProfile: true }
    });

    if (!userWithProfile || userWithProfile.role !== 'TUTOR' || !userWithProfile.tutorProfile) {
      return NextResponse.json({ error: 'Tutor profile not found' }, { status: 404 });
    }

    // Fetch bookings for this tutor
    const bookings = await prisma.booking.findMany({
      where: { tutorId: userWithProfile.tutorProfile.id },
      include: {
        student: {
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
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      studentName: booking.student.user.name,
      subject: booking.subject,
      date: booking.startTime.toISOString().split('T')[0],
      time: booking.startTime.toTimeString().split(' ')[0].substring(0, 5),
      duration: Math.round((booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60)),
      price: userWithProfile.tutorProfile!.hourlyRate * (Math.round((booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60)) / 60),
      status: booking.status,
      studentAvatar: booking.student.user.picture || `/avatars/default.jpg`,
      location: userWithProfile.tutorProfile!.mode === 'online' ? 'Online' : userWithProfile.tutorProfile!.location,
      rating: null, // TODO: Add rating system
      review: null // TODO: Add review system
    }));

    return NextResponse.json(transformedBookings);
  } catch (error) {
    console.error('Error fetching tutor bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 