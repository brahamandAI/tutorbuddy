import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'TUTOR') {
      return NextResponse.json(
        { error: 'Only tutors can access messages' },
        { status: 403 }
      );
    }

    const { id: conversationId } = params;

    // Get tutor profile
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutorProfile) {
      return NextResponse.json(
        { error: 'Tutor profile not found' },
        { status: 404 }
      );
    }

    // Verify the conversation belongs to this tutor
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    if (conversation.tutorId !== tutorProfile.id) {
      return NextResponse.json(
        { error: 'You can only access your own conversations' },
        { status: 403 }
      );
    }

    // Fetch messages for this conversation
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    // Transform the data to match frontend expectations
    const transformedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt.toISOString(),
    }));


    return NextResponse.json(transformedMessages);
  } catch (error) {
    console.error('❌ Error fetching conversation messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await authenticateUser(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'TUTOR') {
      return NextResponse.json(
        { error: 'Only tutors can send messages' },
        { status: 403 }
      );
    }

    const { id: conversationId } = params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Get tutor profile
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutorProfile) {
      return NextResponse.json(
        { error: 'Tutor profile not found' },
        { status: 404 }
      );
    }

    // Verify the conversation belongs to this tutor
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    if (conversation.tutorId !== tutorProfile.id) {
      return NextResponse.json(
        { error: 'You can only send messages in your own conversations' },
        { status: 403 }
      );
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        receiverId: conversation.student.userId,
        content: content.trim(),
      },
    });

    // Create notification for the student
    await prisma.notification.create({
      data: {
        type: 'message',
        title: 'New Message',
        message: `You have a new message from ${user.name}`,
        userId: conversation.student.userId,
      },
    });


    return NextResponse.json({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 