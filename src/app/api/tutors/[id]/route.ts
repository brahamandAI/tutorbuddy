import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await authenticateUser(req);
    
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    
    // Fetch the specific tutor
    const tutor = await prisma.tutorProfile.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: 'Tutor not found' },
        { status: 404 }
      );
    }


    // Parse availability from JSON or provide default mock data
    let availability: Array<{ dayOfWeek: number; startTime: string; endTime: string }> = [];
    
    if (Array.isArray(tutor.availability)) {
      availability = tutor.availability as Array<{ dayOfWeek: number; startTime: string; endTime: string }>;
    } else if (typeof tutor.availability === 'object' && tutor.availability !== null) {
      // Convert the object format to array format for frontend compatibility
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const availabilityObj = tutor.availability as any;
      
      // Create multiple entries for each slot in each day
      dayNames.forEach((dayName, dayIndex) => {
        const dayData = availabilityObj[dayName];
        if (dayData && dayData.available && dayData.slots && dayData.slots.length > 0) {
          // Create an entry for each slot
          dayData.slots.forEach((slot: any) => {
            let startTime, endTime;
            
            if (typeof slot === 'string') {
              // Handle string format like '16:00-17:00'
              [startTime, endTime] = slot.split('-');
            } else {
              // Handle object format
              startTime = slot.startTime || slot.start || '09:00';
              endTime = slot.endTime || slot.end || '17:00';
            }
            
            availability.push({
              dayOfWeek: dayIndex,
              startTime,
              endTime
            });
          });
        }
      });
    }
    
    // Provide default availability if none exists or conversion failed
    if (availability.length === 0) {
      availability = [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
        { dayOfWeek: 6, startTime: '10:00', endTime: '15:00' }, // Saturday
      ];
    }

    // Mock reviews data (until review system is implemented)
    const mockReviews = [
      {
        id: '1',
        rating: 4.5,
        comment: 'Great tutor! Very patient and explains concepts clearly.',
        student: {
          user: {
            name: 'John Doe',
          },
        },
        createdAt: new Date('2024-01-15').toISOString(),
      },
      {
        id: '2',
        rating: 5.0,
        comment: 'Excellent teaching style. Highly recommended!',
        student: {
          user: {
            name: 'Jane Smith',
          },
        },
        createdAt: new Date('2024-01-10').toISOString(),
      },
    ];

    // Calculate average rating
    const totalRating = mockReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    const averageRating = mockReviews.length > 0 ? totalRating / mockReviews.length : 0;

    // Format the response
    const formattedTutor = {
      id: tutor.id,
      user: {
        name: tutor.user.name,
        email: tutor.user.email,
      },
      subjects: tutor.subjects,
      hourlyRate: tutor.hourlyRate,
      bio: tutor.bio,
      rating: averageRating,
      reviewCount: mockReviews.length,
      availability: availability,
      reviews: mockReviews,
      qualifications: tutor.qualifications || '',
      mode: tutor.mode || '',
      location: tutor.location || '',
      experience: tutor.experience || '',
      contact: tutor.contact || '',
      languages: tutor.languages || [],
      profilePicture: tutor.profilePicture || '',
    };

    return NextResponse.json(formattedTutor);
  } catch (error) {
    console.error('❌ Debug: Error in individual tutor endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 