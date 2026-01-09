import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import stripe from '@/lib/stripe';
import { sendEmail, generateBookingConfirmationEmail, generatePaymentFailedEmail } from '@/lib/email';
import { getSocketIO } from '@/lib/socket';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe webhook secret is not configured' },
      { status: 500 }
    );
  }

  if (!stripe) {
    return NextResponse.json(
      { error: 'Payment service not configured' },
      { status: 503 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const io = getSocketIO();

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        const { bookingId } = paymentIntent.metadata;

        // Get booking with related data
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
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
          throw new Error('Booking not found');
        }

        // Update booking status
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'confirmed',
          },
        });

        // Send confirmation emails
        const studentEmail = generateBookingConfirmationEmail(booking);
        await sendEmail({
          to: booking.student.user.email,
          ...studentEmail,
        });

        // Send notification to tutor
        const tutorSubject = 'New Booking Confirmed - TutorBuddy';
        const tutorText = `
          A new booking has been confirmed!

          Student: ${booking.student.user.name}
          Date: ${new Date(booking.startTime).toLocaleDateString()}
          Time: ${new Date(booking.startTime).toLocaleTimeString()} - ${new Date(booking.endTime).toLocaleTimeString()}

          You can view the booking details in your dashboard:
          ${process.env.NEXT_PUBLIC_APP_URL}/tutor/bookings
        `;

        await sendEmail({
          to: booking.tutor.user.email,
          subject: tutorSubject,
          text: tutorText,
          html: tutorText.replace(/\n/g, '<br>'),
        });

        // Emit socket events
        if (io) {
          io.to(`user:${booking.student.userId}`).emit('payment_success', {
            bookingId: booking.id,
          });

          io.to(`user:${booking.tutor.userId}`).emit('booking_confirmed', {
            bookingId: booking.id,
            studentName: booking.student.user.name,
          });
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        const { bookingId } = paymentIntent.metadata;

        // Get booking with related data
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
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
          throw new Error('Booking not found');
        }

        // Update booking status
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'cancelled',
          },
        });

        // Send failure notification to student
        const failureEmail = generatePaymentFailedEmail(booking);
        await sendEmail({
          to: booking.student.user.email,
          ...failureEmail,
        });

        // Emit socket event
        if (io) {
          io.to(`user:${booking.student.userId}`).emit('payment_failed', {
            bookingId: booking.id,
          });
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
} 