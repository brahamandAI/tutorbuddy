import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await authenticateUser(req);
    
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can book sessions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { tutorId, startTime, endTime } = body;


    // Validate input
    if (!tutorId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      // Create student profile if it doesn't exist
      const newStudentProfile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          grade: 'General', // Default grade
          subjects: [], // Empty subjects array
        },
      });
      return NextResponse.json(
        { error: 'Student profile created. Please try booking again.' },
        { status: 400 }
      );
    }


    // Check if tutor exists
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: 'Tutor not found' },
        { status: 404 }
      );
    }


    // Validate booking time against tutor's availability
    // Convert UTC time back to the original local time that was selected
    const bookingDate = new Date(startTime);
    
    // Since the frontend sends UTC time, we need to convert it back to the original local time
    // The frontend originally selected a local time, then converted to UTC for transmission
    // We need to reverse this process to get the original local time
    const localBookingDate = new Date(bookingDate.getTime() + (bookingDate.getTimezoneOffset() * 60000));
    const dayOfWeek = localBookingDate.getDay();
    const bookingStartTime = `${localBookingDate.getHours().toString().padStart(2, '0')}:${localBookingDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Parse availability JSON and check if tutor is available
    const availability = tutor.availability as any;
    let isAvailable = false;
    
    // Handle different availability formats
    if (availability) {
      if (Array.isArray(availability)) {
        // Format: [{ dayOfWeek: 0, startTime: "09:00", endTime: "17:00" }]
        isAvailable = availability.some((slot: any) => 
          slot.dayOfWeek === dayOfWeek &&
          slot.startTime <= bookingStartTime &&
          slot.endTime > bookingStartTime
        );
      } else if (typeof availability === 'object') {
        // Format: { monday: { available: true, slots: [...] }, ... }
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dayOfWeek];
        const dayAvailability = availability[dayName];
        
        if (dayAvailability && dayAvailability.available && dayAvailability.slots) {
          // Check if the booking time falls within any of the available slots
          isAvailable = dayAvailability.slots.some((slot: any) => {
            let slotStart: string, slotEnd: string;
            
            // Handle both string format ('16:00-17:00') and object format
            if (typeof slot === 'string') {
              [slotStart, slotEnd] = slot.split('-');
            } else {
              slotStart = slot.startTime || slot.start;
              slotEnd = slot.endTime || slot.end;
            }
            
            const isInSlot = slotStart <= bookingStartTime && slotEnd > bookingStartTime;
            
            return isInSlot;
          });
        }
      }
    }


    if (!isAvailable) {
    
    if (Array.isArray(availability)) {
      const daySlots = availability.filter((slot: any) => slot.dayOfWeek === dayOfWeek);
      console.log('Day slots:', daySlots);
    } else if (typeof availability === 'object') {
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayOfWeek];
      console.log(`${dayName} availability:`, availability[dayName]);
      
      // Show the actual available time slots
      const dayData = availability[dayName];
      if (dayData && dayData.available && dayData.slots) {
        dayData.slots.forEach((slot: any, index: number) => {
          if (typeof slot === 'string') {
            console.log(`  Slot ${index + 1}: ${slot}`);
          } else {
            console.log(`  Slot ${index + 1}: ${slot.start} - ${slot.end}`);
          }
        });
      }
    }
      
      // Get available slots for better error message
      let availableSlots: string[] = [];
      let availableDays: string[] = [];
      
      if (typeof availability === 'object') {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dayOfWeek];
        const dayData = availability[dayName];
        
        if (dayData && dayData.available && dayData.slots) {
          availableSlots = dayData.slots.map((slot: any) => {
            if (typeof slot === 'string') {
              return slot;
            } else {
              return `${slot.start}-${slot.end}`;
            }
          });
        }
        
        // Also show which days the tutor is available
        dayNames.forEach((name, index) => {
          const data = availability[name];
          if (data && data.available && data.slots && data.slots.length > 0) {
            availableDays.push(name.charAt(0).toUpperCase() + name.slice(1));
          }
        });
      }
      
      let errorMessage = 'Tutor is not available at this time.';
      
      if (availableSlots.length > 0) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        // Convert 24-hour format to 12-hour format for consistency with frontend
        const formattedSlots = availableSlots.map(slot => {
          const [startTime, endTime] = slot.split('-');
          const [startHour, startMinute] = startTime.split(':');
          const [endHour, endMinute] = endTime.split(':');
          
          const startHourNum = parseInt(startHour);
          const endHourNum = parseInt(endHour);
          
          const startAmpm = startHourNum >= 12 ? 'PM' : 'AM';
          const endAmpm = endHourNum >= 12 ? 'PM' : 'AM';
          
          const startDisplayHour = startHourNum === 0 ? 12 : startHourNum > 12 ? startHourNum - 12 : startHourNum;
          const endDisplayHour = endHourNum === 0 ? 12 : endHourNum > 12 ? endHourNum - 12 : endHourNum;
          
          return `${startDisplayHour}:${startMinute} ${startAmpm} - ${endDisplayHour}:${endMinute} ${endAmpm}`;
        });
        
        errorMessage += ` Available slots for ${dayNames[dayOfWeek]}: ${formattedSlots.join(', ')}`;
      } else {
        errorMessage += ` Please select a different day. Tutor is available on: ${availableDays.join(', ')}`;
      }
        
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Check for existing bookings in the same time slot
    const existingBooking = await prisma.booking.findFirst({
      where: {
        tutorId,
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        tutorId,
        studentId: studentProfile.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        subject: 'General', // Default subject since it's required
        status: 'pending',
      },
    });


    // Create or get conversation between student and tutor
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { studentId: studentProfile.id },
          { tutorId: tutor.id },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          studentId: studentProfile.id,
          tutorId: tutor.id,
        },
      });
    } else {
    }

    // Create notification for the tutor
    try {
      const notification = await prisma.notification.create({
        data: {
          type: 'booking',
          title: 'New Booking Request',
          message: `You have a new booking request from ${user.name} for ${new Date(startTime).toLocaleDateString('en-GB')} at ${new Date(startTime).toLocaleTimeString()}`,
          userId: tutor.userId,
        },
      });
    } catch (notificationError) {
      console.log('⚠️ Debug: Failed to create notification:', notificationError);
      // Don't fail the booking if notification fails
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await authenticateUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let bookings;
    if (user.role === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
      });

      if (!studentProfile) {
        return NextResponse.json(
          { error: 'Student profile not found' },
          { status: 404 }
        );
      }

      bookings = await prisma.booking.findMany({
        where: { studentId: studentProfile.id },
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startTime: 'desc' },
      });
    } else {
      const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: user.id },
      });

      if (!tutorProfile) {
        return NextResponse.json(
          { error: 'Tutor profile not found' },
          { status: 404 }
        );
      }

      bookings = await prisma.booking.findMany({
        where: { tutorId: tutorProfile.id },
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startTime: 'desc' },
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 