import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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
        { error: 'Only tutors can access conversations' },
        { status: 403 }
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

    // Fetch conversations for this tutor
    const conversations = await prisma.conversation.findMany({
      where: { tutorId: tutorProfile.id },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get only the last message
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Transform the data to match frontend expectations
    const transformedConversations = conversations.map(conversation => ({
      id: conversation.id,
      student: {
        id: conversation.student.id,
        user: {
          id: conversation.student.user.id,
          name: conversation.student.user.name,
        },
      },
      lastMessage: conversation.messages[0] ? {
        id: conversation.messages[0].id,
        content: conversation.messages[0].content,
        senderId: conversation.messages[0].senderId,
        createdAt: conversation.messages[0].createdAt.toISOString(),
      } : undefined,
      unreadCount: 0, // TODO: Implement unread count logic
    }));


    return NextResponse.json(transformedConversations);
  } catch (error) {
    console.error('❌ Error fetching tutor conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
} 