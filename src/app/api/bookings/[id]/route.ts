import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PATCH(
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

    if (user.role !== 'TUTOR') {
      return NextResponse.json(
        { error: 'Only tutors can update booking status' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { status } = body;


    // Validate status
    if (!['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "confirmed" or "cancelled"' },
        { status: 400 }
      );
    }

    // Get the booking and verify it belongs to this tutor
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify the booking belongs to this tutor
    if (booking.tutor.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only update your own bookings' },
        { status: 403 }
      );
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    // Create notification for the student
    await prisma.notification.create({
      data: {
        type: 'booking',
        title: status === 'confirmed' ? 'Booking Confirmed' : 'Booking Cancelled',
        message: status === 'confirmed' 
          ? `Your booking with ${booking.tutor.user.name} has been confirmed for ${new Date(booking.startTime).toLocaleDateString('en-GB')} at ${new Date(booking.startTime).toLocaleTimeString()}`
          : `Your booking with ${booking.tutor.user.name} has been cancelled`,
        userId: booking.student.userId,
      },
    });


    return NextResponse.json({
      message: `Booking ${status} successfully`,
      booking: updatedBooking,
    });

  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
} 