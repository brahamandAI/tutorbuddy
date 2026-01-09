import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // For now, we'll skip session validation since next-auth is not set up
    // TODO: Implement proper authentication
    const { notificationId, userId } = await req.json();

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return new NextResponse('Notification not found', { status: 404 });
    }

    if (notification.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 