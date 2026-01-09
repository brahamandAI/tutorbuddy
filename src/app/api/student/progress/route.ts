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

    // Get the user and their student profile
    const userWithProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: { studentProfile: true }
    });

    if (!userWithProfile || userWithProfile.role !== 'STUDENT' || !userWithProfile.studentProfile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    // Fetch bookings for this student to calculate progress
    const bookings = await prisma.booking.findMany({
      where: { 
        studentId: userWithProfile.studentProfile.id,
        status: 'completed'
      },
      include: {
        tutor: {
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

    // Calculate progress by subject
    const progressBySubject = new Map<string, { sessionsCompleted: number; totalSessions: number; improvement: number }>();

    // Initialize with subjects from student profile
    userWithProfile.studentProfile.subjects.forEach(subject => {
      progressBySubject.set(subject, { sessionsCompleted: 0, totalSessions: 0, improvement: 0 });
    });

    // Count completed sessions by subject
    bookings.forEach(booking => {
      const current = progressBySubject.get(booking.subject);
      if (current) {
        current.sessionsCompleted++;
        current.totalSessions++;
        // Simulate improvement based on session count (in real app, this would come from assessments)
        current.improvement = Math.min(100, current.sessionsCompleted * 15);
      }
    });

    // Transform to array format expected by frontend
    const progress = Array.from(progressBySubject.entries()).map(([subject, data]) => ({
      subject,
      improvement: data.improvement,
      sessionsCompleted: data.sessionsCompleted,
      totalSessions: Math.max(data.totalSessions, 10) // Assume 10 total sessions per subject
    }));

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 