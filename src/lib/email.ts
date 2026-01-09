import sgMail from '@sendgrid/mail';

// Only configure SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(data: EmailData) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Email service not configured. Skipping email send.');
    console.log('Email would have been sent to:', data.to);
    console.log('Subject:', data.subject);
    return;
  }

  const msg = {
    to: data.to,
    from: process.env.EMAIL_FROM!,
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export function generateBookingConfirmationEmail(booking: any) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const subject = 'Booking Confirmation - TutorBuddy';
  const text = `
    Your booking has been confirmed!

    Booking Details:
    Date: ${startTime.toLocaleDateString()}
    Time: ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}
    Tutor: ${booking.tutor.user.name}

    You can join the session at the scheduled time by visiting:
    ${process.env.NEXT_PUBLIC_APP_URL}/student/session/${booking.id}

    Thank you for using TutorBuddy!
  `;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Your booking has been confirmed!</h1>
      
      <div style="margin: 24px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
        <h2 style="margin-top: 0; color: #1f2937;">Booking Details</h2>
        <p><strong>Date:</strong> ${startTime.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}</p>
        <p><strong>Tutor:</strong> ${booking.tutor.user.name}</p>
      </div>

      <p>You can join the session at the scheduled time by clicking the button below:</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/student/session/${booking.id}"
         style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Join Session
      </a>

      <p style="color: #6b7280; margin-top: 24px;">
        Thank you for using TutorBuddy!
      </p>
    </div>
  `;

  return { subject, text, html };
}

export function generatePaymentFailedEmail(booking: any) {
  const subject = 'Payment Failed - TutorBuddy';
  const text = `
    Your payment for the booking with ${booking.tutor.user.name} has failed.
    Please try again by visiting:
    ${process.env.NEXT_PUBLIC_APP_URL}/student/payment/${booking.id}

    If you continue to experience issues, please contact our support team.
  `;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #dc2626;">Payment Failed</h1>
      
      <p>Your payment for the booking with ${booking.tutor.user.name} has failed.</p>
      
      <p>Please try again by clicking the button below:</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/student/payment/${booking.id}"
         style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Retry Payment
      </a>

      <p style="color: #6b7280; margin-top: 24px;">
        If you continue to experience issues, please contact our support team.
      </p>
    </div>
  `;

  return { subject, text, html };
} 