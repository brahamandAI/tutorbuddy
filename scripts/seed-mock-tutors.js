const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const weekdays = (start, end) =>
  [1, 2, 3, 4, 5].map((dayOfWeek) => ({ dayOfWeek, startTime: start, endTime: end }))

const tutors = [
  {
    name: 'Ananya Sharma',
    email: 'ananya.sharma@tutorbuddy.local',
    bio: 'Class 9–12 mathematics teacher. I break algebra and calculus into short, workable steps.',
    subjects: ['Mathematics'],
    hourlyRate: 700,
    qualifications: 'M.Sc. Mathematics, Delhi University',
    mode: 'Online & Offline',
    location: 'Saket, Delhi',
    experience: '8 years',
    contact: '+91 98100 11001',
    languages: ['English', 'Hindi'],
    profilePicture: '',
    availability: [...weekdays('16:00', '20:00'), { dayOfWeek: 6, startTime: '10:00', endTime: '14:00' }],
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@tutorbuddy.local',
    bio: 'Physics tutor for board exams and JEE foundations. Sessions focus on numericals and concepts.',
    subjects: ['Physics', 'Mathematics'],
    hourlyRate: 900,
    qualifications: 'B.Tech, IIT Delhi',
    mode: 'Online',
    location: 'Dwarka, Delhi',
    experience: '6 years',
    contact: '+91 98100 11002',
    languages: ['English', 'Hindi'],
    profilePicture: '',
    availability: weekdays('17:00', '21:00'),
  },
  {
    name: 'Neha Kapoor',
    email: 'neha.kapoor@tutorbuddy.local',
    bio: 'Chemistry teacher for Class 11 and 12. Organic reactions, mole concept, and lab-style practice.',
    subjects: ['Chemistry'],
    hourlyRate: 800,
    qualifications: 'M.Sc. Chemistry, Jawaharlal Nehru University',
    mode: 'Online & Offline',
    location: 'Lajpat Nagar, Delhi',
    experience: '9 years',
    contact: '+91 98100 11003',
    languages: ['English', 'Hindi'],
    profilePicture: '',
    availability: [...weekdays('15:00', '19:00'), { dayOfWeek: 6, startTime: '11:00', endTime: '15:00' }],
  },
  {
    name: 'Aisha Khan',
    email: 'aisha.khan@tutorbuddy.local',
    bio: 'Biology tutor for school boards and NEET basics. Diagrams, definitions, and revision plans.',
    subjects: ['Biology'],
    hourlyRate: 750,
    qualifications: 'M.Sc. Botany, Delhi University',
    mode: 'Offline',
    location: 'Rohini, Delhi',
    experience: '7 years',
    contact: '+91 98100 11004',
    languages: ['English', 'Hindi', 'Urdu'],
    profilePicture: '',
    availability: weekdays('10:00', '14:00'),
  },
  {
    name: 'Vikram Iyer',
    email: 'vikram.iyer@tutorbuddy.local',
    bio: 'English language and literature for Classes 6–12. Writing, grammar, and unseen passages.',
    subjects: ['English'],
    hourlyRate: 600,
    qualifications: 'M.A. English, Jamia Millia Islamia',
    mode: 'Online',
    location: 'Janakpuri, Delhi',
    experience: '10 years',
    contact: '+91 98100 11005',
    languages: ['English', 'Hindi', 'Tamil'],
    profilePicture: '',
    availability: [...weekdays('18:00', '21:00'), { dayOfWeek: 0, startTime: '10:00', endTime: '13:00' }],
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@tutorbuddy.local',
    bio: 'History and geography tutor. I use maps, timelines, and short notes for board revision.',
    subjects: ['History', 'Geography'],
    hourlyRate: 550,
    qualifications: 'M.A. History, University of Delhi',
    mode: 'Online & Offline',
    location: 'Pitampura, Delhi',
    experience: '5 years',
    contact: '+91 98100 11006',
    languages: ['English', 'Hindi', 'Malayalam'],
    profilePicture: '',
    availability: weekdays('16:00', '19:00'),
  },
  {
    name: 'Arjun Desai',
    email: 'arjun.desai@tutorbuddy.local',
    bio: 'Computer science tutor for Class 11–12 and beginners. Python, data structures, and school practicals.',
    subjects: ['Computer Science'],
    hourlyRate: 1000,
    qualifications: 'B.Tech Computer Science, NSUT',
    mode: 'Online',
    location: 'Saket, Delhi',
    experience: '4 years',
    contact: '+91 98100 11007',
    languages: ['English', 'Hindi', 'Gujarati'],
    profilePicture: '',
    availability: [2, 4, 6].map((dayOfWeek) => ({ dayOfWeek, startTime: '19:00', endTime: '22:00' })),
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@tutorbuddy.local',
    bio: 'Economics and business studies for Classes 11 and 12. Case studies, graphs, and exam writing.',
    subjects: ['Economics', 'Business Studies'],
    hourlyRate: 650,
    qualifications: 'M.A. Economics, Delhi School of Economics',
    mode: 'Online & Offline',
    location: 'Dwarka, Delhi',
    experience: '11 years',
    contact: '+91 98100 11008',
    languages: ['English', 'Hindi', 'Marathi'],
    profilePicture: '',
    availability: [...weekdays('09:00', '13:00'), { dayOfWeek: 6, startTime: '09:00', endTime: '12:00' }],
  },
]

async function main() {
  const password = await bcrypt.hash('Tutor@123', 10)
  let created = 0

  for (const tutor of tutors) {
    const existing = await prisma.user.findUnique({ where: { email: tutor.email } })
    if (existing) {
      console.log('skip', tutor.email)
      continue
    }

    await prisma.user.create({
      data: {
        email: tutor.email,
        password,
        name: tutor.name,
        role: 'TUTOR',
        emailVerified: true,
        tutorProfile: {
          create: {
            bio: tutor.bio,
            subjects: tutor.subjects,
            hourlyRate: tutor.hourlyRate,
            availability: tutor.availability,
            qualifications: tutor.qualifications,
            mode: tutor.mode,
            location: tutor.location,
            experience: tutor.experience,
            contact: tutor.contact,
            languages: tutor.languages,
            profilePicture: tutor.profilePicture,
          },
        },
      },
    })
    created += 1
    console.log('created', tutor.name)
  }

  const total = await prisma.tutorProfile.count()
  console.log(`done: ${created} new, ${total} tutor profiles in the database`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
