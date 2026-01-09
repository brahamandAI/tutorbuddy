// Mock course data to ensure all filter combinations have results
export interface MockCourse {
  id: string
  title: string
  subject: string
  class: string
  board: string
  mode: 'online' | 'offline' | 'hybrid'
  price: number
  duration: string
  tutor: {
    name: string
    avatar: string
    rating: number
    experience: string
  }
  syllabus: string[]
  aiRecommendation: boolean
  location?: string
  students: number
  rating: number
  reviews: number
}

// Generate comprehensive mock data
function generateMockCourses(): MockCourse[] {
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science']
  const classes = ['Kindergarten', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'Competitive Exams']
  const boards = ['CBSE', 'ICSE', 'State Board', 'International']
  const modes: ('online' | 'offline' | 'hybrid')[] = ['online', 'offline', 'hybrid']

  const tutors = [
    { name: 'Dr. Priya Sharma', avatar: '/avatars/priya.jpg', rating: 4.9, experience: '8+ years' },
    { name: 'Prof. Rajesh Kumar', avatar: '/avatars/rajesh.jpg', rating: 4.7, experience: '12+ years' },
    { name: 'Ms. Sarah Johnson', avatar: '/avatars/sarah.jpg', rating: 4.6, experience: '5+ years' },
    { name: 'Dr. Amit Patel', avatar: '/avatars/amit.jpg', rating: 4.8, experience: '10+ years' },
    { name: 'Prof. Meera Reddy', avatar: '/avatars/meera.jpg', rating: 4.9, experience: '15+ years' },
    { name: 'Mr. Suresh Gupta', avatar: '/avatars/suresh.jpg', rating: 4.5, experience: '6+ years' },
    { name: 'Dr. Kavya Nair', avatar: '/avatars/kavya.jpg', rating: 4.8, experience: '9+ years' },
    { name: 'Prof. Arjun Singh', avatar: '/avatars/arjun.jpg', rating: 4.7, experience: '11+ years' },
    { name: 'Ms. Ritika Jain', avatar: '/avatars/ritika.jpg', rating: 4.6, experience: '7+ years' },
    { name: 'Dr. Vikram Rao', avatar: '/avatars/vikram.jpg', rating: 4.9, experience: '13+ years' }
  ]

  const syllabi: Record<string, string[][]> = {
    'Mathematics': [
      ['Algebra', 'Geometry', 'Trigonometry', 'Statistics'],
      ['Calculus', 'Probability', 'Coordinate Geometry', 'Mensuration'],
      ['Number Theory', 'Linear Equations', 'Quadratic Equations', 'Logarithms']
    ],
    'Physics': [
      ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics'],
      ['Waves', 'Modern Physics', 'Atomic Structure', 'Nuclear Physics'],
      ['Motion', 'Force', 'Energy', 'Gravitation']
    ],
    'Chemistry': [
      ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
      ['Acids & Bases', 'Chemical Bonding', 'Periodic Table', 'Stoichiometry'],
      ['Reactions', 'Solutions', 'Electrochemistry', 'Thermochemistry']
    ],
    'Biology': [
      ['Botany', 'Zoology', 'Human Physiology', 'Ecology'],
      ['Cell Biology', 'Genetics', 'Evolution', 'Biotechnology'],
      ['Plant Kingdom', 'Animal Kingdom', 'Life Processes', 'Reproduction']
    ],
    'English': [
      ['Grammar', 'Literature', 'Writing Skills', 'Comprehension'],
      ['Poetry', 'Prose', 'Drama', 'Vocabulary'],
      ['Communication', 'Creative Writing', 'Essay Writing', 'Speaking Skills']
    ],
    'Hindi': [
      ['व्याकरण', 'गद्य', 'पद्य', 'लेखन कौशल'],
      ['कहानी', 'कविता', 'निबंध', 'पत्र लेखन'],
      ['भाषा कौशल', 'साहित्य', 'व्याकरण नियम', 'रचना']
    ],
    'Social Studies': [
      ['History', 'Geography', 'Civics', 'Economics'],
      ['Indian History', 'World Geography', 'Government', 'Democracy'],
      ['Ancient History', 'Physical Geography', 'Constitution', 'Markets']
    ],
    'Computer Science': [
      ['Programming', 'Data Structures', 'Algorithms', 'Database'],
      ['Web Development', 'Software Engineering', 'Computer Networks', 'AI'],
      ['Python', 'Java', 'HTML/CSS', 'JavaScript']
    ]
  }

  const courseDetails: Record<string, { duration: string; priceRange: [number, number] }> = {
    'Kindergarten': { duration: '3 months', priceRange: [800, 1500] },
    'Class 1-5': { duration: '4 months', priceRange: [1200, 2000] },
    'Class 6-8': { duration: '5 months', priceRange: [1800, 2800] },
    'Class 9-10': { duration: '6 months', priceRange: [2500, 3500] },
    'Class 11-12': { duration: '8 months', priceRange: [3000, 4500] },
    'Competitive Exams': { duration: '12 months', priceRange: [4000, 6000] }
  }

  const locations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Dwarka', 'Lajpat Nagar', 
    'Rohini', 'Gurgaon', 'Noida', 'Faridabad'
  ]

  function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function generateCourseTitle(subject: string, className: string, board: string): string {
    const templates = [
      `Complete ${subject} for ${className}`,
      `${subject} Mastery - ${className} ${board}`,
      `Advanced ${subject} Course`,
      `${subject} Foundation for ${className}`,
      `Comprehensive ${subject} Program`,
      `${subject} Excellence Course`,
      `Master ${subject} - ${board} Curriculum`,
      `${subject} Success Program`
    ]
    
    return getRandomElement(templates)
  }

  const courses: MockCourse[] = []
  let courseId = 1

  // Generate at least one course for each combination to ensure no "no courses found"
  subjects.forEach(subject => {
    classes.forEach(className => {
      boards.forEach(board => {
        modes.forEach(mode => {
          const tutor = getRandomElement(tutors)
          const syllabus = getRandomElement(syllabi[subject] || [['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4']])
          const details = courseDetails[className]
          const price = getRandomNumber(details.priceRange[0], details.priceRange[1])
          
          const course: MockCourse = {
            id: courseId.toString(),
            title: generateCourseTitle(subject, className, board),
            subject: subject,
            class: className,
            board: board,
            mode: mode,
            price: price,
            duration: details.duration,
            tutor: tutor,
            syllabus: syllabus,
            aiRecommendation: Math.random() > 0.6,
            students: getRandomNumber(15, 60),
            rating: +(4.3 + Math.random() * 0.7).toFixed(1),
            reviews: getRandomNumber(8, 35)
          }

          if (mode === 'offline') {
            course.location = getRandomElement(locations)
          }

          courses.push(course)
          courseId++
        })
      })
    })
  })

  // Add some extra popular courses for variety
  const popularCombinations = [
    { subject: 'Physics', class: 'Class 6-8', board: 'ICSE', mode: 'online' as const },
    { subject: 'Mathematics', class: 'Class 9-10', board: 'CBSE', mode: 'online' as const },
    { subject: 'English', class: 'Class 1-5', board: 'ICSE', mode: 'hybrid' as const },
    { subject: 'Computer Science', class: 'Class 11-12', board: 'CBSE', mode: 'offline' as const },
    { subject: 'Biology', class: 'Competitive Exams', board: 'CBSE', mode: 'hybrid' as const }
  ]

  popularCombinations.forEach(combo => {
    const tutor = getRandomElement(tutors)
    const syllabus = getRandomElement(syllabi[combo.subject] || [['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4']])
    const details = courseDetails[combo.class]
    const price = getRandomNumber(details.priceRange[0], details.priceRange[1])
    
    const course: MockCourse = {
      id: courseId.toString(),
      title: generateCourseTitle(combo.subject, combo.class, combo.board),
      subject: combo.subject,
      class: combo.class,
      board: combo.board,
      mode: combo.mode,
      price: price,
      duration: details.duration,
      tutor: tutor,
      syllabus: syllabus,
      aiRecommendation: true, // Make popular courses AI recommended
      students: getRandomNumber(40, 80),
      rating: +(4.6 + Math.random() * 0.4).toFixed(1),
      reviews: getRandomNumber(20, 50)
    }

    if (combo.mode === 'offline') {
      course.location = getRandomElement(locations)
    }

    courses.push(course)
    courseId++
  })

  return courses
}

export const mockCourses = generateMockCourses() 