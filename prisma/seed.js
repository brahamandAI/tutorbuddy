// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // --- USERS ---
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'arjun.sharma@example.com',
        password: 'hashedpassword1',
        name: 'Arjun Sharma',
        role: 'student',
      },
      {
        email: 'priya.verma@example.com',
        password: 'hashedpassword2',
        name: 'Priya Verma',
        role: 'student',
      },
      {
        email: 'rahul.patel@example.com',
        password: 'hashedpassword3',
        name: 'Rahul Patel',
        role: 'tutor',
      },
      {
        email: 'anita.singh@example.com',
        password: 'hashedpassword4',
        name: 'Anita Singh',
        role: 'tutor',
      },
    ],
  });

  // Fetch created users
  const arjun = await prisma.user.findUnique({ where: { email: 'arjun.sharma@example.com' } });
  const priya = await prisma.user.findUnique({ where: { email: 'priya.verma@example.com' } });
  const rahul = await prisma.user.findUnique({ where: { email: 'rahul.patel@example.com' } });
  const anita = await prisma.user.findUnique({ where: { email: 'anita.singh@example.com' } });

  // --- STUDENT PROFILES ---
  const arjunStudent = await prisma.studentProfile.create({
    data: {
      userId: arjun.id,
      grade: '10',
      subjects: ['Mathematics', 'Science'],
    },
  });
  const priyaStudent = await prisma.studentProfile.create({
    data: {
      userId: priya.id,
      grade: '12',
      subjects: ['Biology', 'Chemistry'],
    },
  });

  // --- TUTOR PROFILES ---
  const rahulTutor = await prisma.tutorProfile.create({
    data: {
      userId: rahul.id,
      bio: 'Experienced Mathematics tutor from Mumbai.',
      subjects: ['Mathematics', 'Physics'],
      hourlyRate: 800,
      availability: { "mon": ["16:00-18:00"], "wed": ["14:00-16:00"] },
      qualifications: 'M.Sc. Mathematics, IIT Bombay',
      mode: 'online',
      location: 'Mumbai, Maharashtra',
      experience: '5 years',
      contact: '+91-9876543210',
      languages: ['Hindi', 'English', 'Marathi'],
      profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  });
  const anitaTutor = await prisma.tutorProfile.create({
    data: {
      userId: anita.id,
      bio: 'Passionate Biology tutor from Delhi.',
      subjects: ['Biology', 'Chemistry'],
      hourlyRate: 900,
      availability: { "tue": ["10:00-12:00"], "thu": ["15:00-17:00"] },
      qualifications: 'M.Sc. Biology, Delhi University',
      mode: 'offline',
      location: 'Delhi',
      experience: '7 years',
      contact: '+91-9123456780',
      languages: ['Hindi', 'English'],
      profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  });

  // --- CONVERSATIONS ---
  const conv1 = await prisma.conversation.create({
    data: {
      studentId: arjunStudent.id,
      tutorId: rahulTutor.id,
    },
  });
  const conv2 = await prisma.conversation.create({
    data: {
      studentId: priyaStudent.id,
      tutorId: anitaTutor.id,
    },
  });

  // --- MESSAGES ---
  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderId: arjun.id,
        receiverId: rahul.id,
        content: 'Hello Sir, I need help with quadratic equations.',
      },
      {
        conversationId: conv1.id,
        senderId: rahul.id,
        receiverId: arjun.id,
        content: 'Sure Arjun, let us schedule a session.',
      },
      {
        conversationId: conv2.id,
        senderId: priya.id,
        receiverId: anita.id,
        content: 'Ma’am, can you explain photosynthesis?',
      },
      {
        conversationId: conv2.id,
        senderId: anita.id,
        receiverId: priya.id,
        content: 'Of course Priya, let’s start with the basics.',
      },
    ],
  });

  // --- BOOKINGS ---
  await prisma.booking.createMany({
    data: [
      {
        studentId: arjunStudent.id,
        tutorId: rahulTutor.id,
        startTime: new Date(Date.now() + 86400000), // tomorrow
        endTime: new Date(Date.now() + 90000000), // tomorrow + 1 hour
        subject: 'Mathematics',
        status: 'confirmed',
      },
      {
        studentId: priyaStudent.id,
        tutorId: anitaTutor.id,
        startTime: new Date(Date.now() + 172800000), // day after tomorrow
        endTime: new Date(Date.now() + 173700000), // day after + 1 hour
        subject: 'Biology',
        status: 'pending',
      },
    ],
  });

  // --- NOTIFICATIONS ---
  await prisma.notification.createMany({
    data: [
      {
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your session with Rahul Patel is confirmed.',
        userId: arjun.id,
      },
      {
        type: 'message',
        title: 'New Message',
        message: 'You have a new message from Arjun Sharma.',
        userId: rahul.id,
      },
      {
        type: 'booking',
        title: 'Booking Pending',
        message: 'Your session with Anita Singh is pending.',
        userId: priya.id,
      },
      {
        type: 'message',
        title: 'New Message',
        message: 'You have a new message from Priya Verma.',
        userId: anita.id,
      },
    ],
  });

  console.log('✅ Mock data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 