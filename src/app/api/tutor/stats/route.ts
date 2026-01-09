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

    // Fetch all bookings for this tutor
    const allBookings = await prisma.booking.findMany({
      where: { tutorId: userWithProfile.tutorProfile.id },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Calculate statistics
    const totalStudents = new Set(allBookings.map(booking => booking.studentId)).size;
    const upcomingSessions = allBookings.filter(booking => 
      booking.status === 'confirmed' && booking.startTime > new Date()
    ).length;
    
    const completedSessions = allBookings.filter(booking => 
      booking.status === 'completed'
    ).length;

    // Calculate average rating (placeholder - would come from rating system)
    const averageRating = 4.8; // TODO: Implement rating system

    // Calculate monthly earnings
    const currentMonth = new Date();
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthlyBookings = allBookings.filter(booking => 
      booking.status === 'completed' && 
      booking.startTime >= monthStart && 
      booking.startTime <= monthEnd
    );

    const monthlyEarnings = monthlyBookings.reduce((total, booking) => {
      const duration = (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60); // hours
      return total + (userWithProfile.tutorProfile!.hourlyRate * duration);
    }, 0);

    const stats = {
      totalStudents,
      upcomingSessions,
      averageRating,
      monthlyEarnings: Math.round(monthlyEarnings),
      completedSessions
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching tutor stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 