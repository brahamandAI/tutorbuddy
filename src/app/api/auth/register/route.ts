import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    // Validate input
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    // Create profile based on role
    if (role === 'TUTOR') {
      const {
        bio,
        subjects,
        hourlyRate,
        availability,
        qualifications,
        mode,
        location,
        experience,
        contact,
        languages,
        profilePicture
      } = body;
      await prisma.tutorProfile.create({
        data: {
          userId: user.id,
          bio: bio || '',
          subjects: subjects || [],
          hourlyRate: hourlyRate || 0,
          availability: availability || [],
          qualifications: qualifications || '',
          mode: mode || '',
          location: location || '',
          experience: experience || '',
          contact: contact || '',
          languages: languages || [],
          profilePicture: profilePicture || '',
        } as import('@prisma/client').Prisma.TutorProfileUncheckedCreateInput,
      });
    } else if (role === 'STUDENT') {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          grade: '', // Provide default value for required field
          subjects: [],
        },
      });
    }

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 