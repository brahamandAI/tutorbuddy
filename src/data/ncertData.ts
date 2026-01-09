// NCERT Syllabus Data Structure
// Comprehensive class-wise subject and chapter organization

export interface NCERTTopic {
  id: string;
  title: string;
  description: string;
  content?: string; // NCERT text content
  learningObjectives: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: number; // in minutes
}

export interface NCERTChapter {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  topics: NCERTTopic[];
  keyPoints: string[];
  aiSummary?: string;
  imageUrl?: string;
  videoUrl?: string;
  estimatedTime: number; // total time for chapter
}

export interface NCERTSubject {
  id: string;
  name: string;
  code: string; // e.g., 'MATH', 'SCI', 'ENG'
  description: string;
  icon: string; // icon name for lucide-react
  color: string; // CSS color class
  gradient: string; // gradient CSS classes
  chapters: NCERTChapter[];
  totalChapters: number;
  board: string; // CBSE, NCERT
}

export interface NCERTClass {
  id: string;
  className: string; // 'Class 1', 'Class 2', etc.
  classNumber: number;
  ageGroup: string;
  description: string;
  subjects: NCERTSubject[];
  icon: string;
  color: string;
  gradient: string;
}

// Complete NCERT Data for Classes 1-12
export const ncertData: NCERTClass[] = [
  {
    id: 'class-1',
    className: 'Class 1',
    classNumber: 1,
    ageGroup: '6-7 years',
    description: 'Foundation learning with fun activities',
    icon: 'BookOpen',
    color: 'bg-red-500',
    gradient: 'from-red-400 to-pink-500',
    subjects: [
      {
        id: 'eng-1',
        name: 'English',
        code: 'ENG',
        description: 'Basic reading, writing and speaking',
        icon: 'Languages',
        color: 'bg-blue-500',
        gradient: 'from-blue-400 to-indigo-500',
        totalChapters: 10,
        board: 'NCERT',
        chapters: [
          {
            id: 'eng-1-ch1',
            chapterNumber: 1,
            title: 'A Happy Child',
            description: 'Introduction to basic words and sounds',
            estimatedTime: 45,
            keyPoints: ['Basic vocabulary', 'Letter recognition', 'Simple words'],
            topics: [
              {
                id: 'eng-1-ch1-t1',
                title: 'Learning Letters',
                description: 'Introduction to alphabets A-Z',
                learningObjectives: ['Recognize all 26 letters', 'Write uppercase and lowercase'],
                difficulty: 'Easy',
                estimatedTime: 20
              },
              {
                id: 'eng-1-ch1-t2',
                title: 'Simple Words',
                description: 'Basic 3-letter words',
                learningObjectives: ['Read CVC words', 'Understand word formation'],
                difficulty: 'Easy',
                estimatedTime: 25
              }
            ]
          },
          {
            id: 'eng-1-ch2',
            chapterNumber: 2,
            title: 'Three Little Pigs',
            description: 'Story reading and comprehension',
            estimatedTime: 50,
            keyPoints: ['Story comprehension', 'Character identification', 'Moral values'],
            topics: [
              {
                id: 'eng-1-ch2-t1',
                title: 'Story Reading',
                description: 'Read the story of three little pigs',
                learningObjectives: ['Understand the story', 'Identify main characters'],
                difficulty: 'Easy',
                estimatedTime: 30
              },
              {
                id: 'eng-1-ch2-t2',
                title: 'Story Questions',
                description: 'Answer questions about the story',
                learningObjectives: ['Recall story events', 'Express understanding'],
                difficulty: 'Medium',
                estimatedTime: 20
              }
            ]
          }
          // More chapters would be added here...
        ]
      },
      {
        id: 'math-1',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Numbers, counting and basic operations',
        icon: 'Calculator',
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500',
        totalChapters: 13,
        board: 'NCERT',
        chapters: [
          {
            id: 'math-1-ch1',
            chapterNumber: 1,
            title: 'Shapes and Space',
            description: 'Basic shapes and spatial understanding',
            estimatedTime: 60,
            keyPoints: ['Circle, Square, Triangle', 'Big and small', 'Inside and outside'],
            topics: [
              {
                id: 'math-1-ch1-t1',
                title: 'Basic Shapes',
                description: 'Identify circle, square, triangle, rectangle',
                learningObjectives: ['Recognize basic shapes', 'Draw simple shapes'],
                difficulty: 'Easy',
                estimatedTime: 30
              },
              {
                id: 'math-1-ch1-t2',
                title: 'Size Comparison',
                description: 'Understand big and small concepts',
                learningObjectives: ['Compare sizes', 'Use comparative terms'],
                difficulty: 'Easy',
                estimatedTime: 30
              }
            ]
          }
          // More chapters...
        ]
      },
      {
        id: 'evt-1',
        name: 'Environmental Studies',
        code: 'EVT',
        description: 'Nature, family and surroundings',
        icon: 'Globe',
        color: 'bg-amber-500',
        gradient: 'from-amber-400 to-orange-500',
        totalChapters: 22,
        board: 'NCERT',
        chapters: [
          {
            id: 'evt-1-ch1',
            chapterNumber: 1,
            title: 'Our Family',
            description: 'Understanding family relationships',
            estimatedTime: 40,
            keyPoints: ['Family members', 'Relationships', 'Love and care'],
            topics: [
              {
                id: 'evt-1-ch1-t1',
                title: 'Family Members',
                description: 'Identify different family members',
                learningObjectives: ['Name family members', 'Understand relationships'],
                difficulty: 'Easy',
                estimatedTime: 20
              },
              {
                id: 'evt-1-ch1-t2',
                title: 'Family Love',
                description: 'How family members care for each other',
                learningObjectives: ['Express love for family', 'Understand caring'],
                difficulty: 'Easy',
                estimatedTime: 20
              }
            ]
          }
          // More chapters...
        ]
      }
    ]
  },
  {
    id: 'class-6',
    className: 'Class 6',
    classNumber: 6,
    ageGroup: '11-12 years',
    description: 'Foundation for secondary education',
    icon: 'GraduationCap',
    color: 'bg-purple-500',
    gradient: 'from-purple-400 to-violet-500',
    subjects: [
      {
        id: 'math-6',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Numbers, algebra, geometry basics',
        icon: 'Calculator',
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500',
        totalChapters: 14,
        board: 'NCERT',
        chapters: [
          {
            id: 'math-6-ch1',
            chapterNumber: 1,
            title: 'Knowing Our Numbers',
            description: 'Large numbers, place value, comparison',
            estimatedTime: 120,
            keyPoints: ['Place value', 'Comparison of numbers', 'Rounding off', 'Roman numerals'],
            topics: [
              {
                id: 'math-6-ch1-t1',
                title: 'Counting in Groups',
                description: 'Understanding large numbers through grouping',
                learningObjectives: ['Count systematically', 'Understand place value concept'],
                difficulty: 'Easy',
                estimatedTime: 40
              },
              {
                id: 'math-6-ch1-t2',
                title: 'Place Value',
                description: 'Ones, tens, hundreds, thousands concept',
                learningObjectives: ['Write numbers in expanded form', 'Understand place value'],
                difficulty: 'Medium',
                estimatedTime: 40
              },
              {
                id: 'math-6-ch1-t3',
                title: 'Comparing Numbers',
                description: 'Compare and arrange numbers',
                learningObjectives: ['Compare large numbers', 'Arrange in ascending/descending order'],
                difficulty: 'Medium',
                estimatedTime: 40
              }
            ]
          },
          {
            id: 'math-6-ch2',
            chapterNumber: 2,
            title: 'Whole Numbers',
            description: 'Properties and operations on whole numbers',
            estimatedTime: 150,
            keyPoints: ['Number line', 'Properties of whole numbers', 'Patterns in numbers'],
            topics: [
              {
                id: 'math-6-ch2-t1',
                title: 'Introduction to Whole Numbers',
                description: 'Understanding whole numbers and number line',
                learningObjectives: ['Define whole numbers', 'Represent on number line'],
                difficulty: 'Easy',
                estimatedTime: 50
              },
              {
                id: 'math-6-ch2-t2',
                title: 'Properties of Whole Numbers',
                description: 'Commutative, associative, distributive properties',
                learningObjectives: ['Apply properties in calculations', 'Understand closure property'],
                difficulty: 'Medium',
                estimatedTime: 50
              },
              {
                id: 'math-6-ch2-t3',
                title: 'Number Patterns',
                description: 'Finding patterns in number sequences',
                learningObjectives: ['Identify patterns', 'Continue number sequences'],
                difficulty: 'Medium',
                estimatedTime: 50
              }
            ]
          }
          // More chapters for Class 6 Math...
        ]
      },
      {
        id: 'sci-6',
        name: 'Science',
        code: 'SCI',
        description: 'Physics, Chemistry, Biology fundamentals',
        icon: 'FlaskConical',
        color: 'bg-purple-500',
        gradient: 'from-purple-400 to-indigo-500',
        totalChapters: 16,
        board: 'NCERT',
        chapters: [
          {
            id: 'sci-6-ch1',
            chapterNumber: 1,
            title: 'Food: Where Does It Come From?',
            description: 'Sources of food and food habits',
            estimatedTime: 90,
            keyPoints: ['Plant sources', 'Animal sources', 'Food habits', 'Herbivores, carnivores, omnivores'],
            topics: [
              {
                id: 'sci-6-ch1-t1',
                title: 'Plant Sources of Food',
                description: 'Foods we get from plants',
                learningObjectives: ['Identify plant-based foods', 'Understand different plant parts we eat'],
                difficulty: 'Easy',
                estimatedTime: 30
              },
              {
                id: 'sci-6-ch1-t2',
                title: 'Animal Sources of Food',
                description: 'Foods we get from animals',
                learningObjectives: ['Identify animal-based foods', 'Understand food from different animals'],
                difficulty: 'Easy',
                estimatedTime: 30
              },
              {
                id: 'sci-6-ch1-t3',
                title: 'Food Habits of Animals',
                description: 'Classification based on eating habits',
                learningObjectives: ['Classify animals as herbivores, carnivores, omnivores', 'Understand food chains'],
                difficulty: 'Medium',
                estimatedTime: 30
              }
            ]
          }
          // More science chapters...
        ]
      }
      // More subjects for Class 6...
    ]
  },
  {
    id: 'class-10',
    className: 'Class 10',
    classNumber: 10,
    ageGroup: '15-16 years',
    description: 'Board exam preparation',
    icon: 'Award',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-purple-500',
    subjects: [
      {
        id: 'math-10',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Algebra, geometry, trigonometry, statistics',
        icon: 'Calculator',
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500',
        totalChapters: 15,
        board: 'NCERT',
        chapters: [
          {
            id: 'math-10-ch1',
            chapterNumber: 1,
            title: 'Real Numbers',
            description: 'Euclid\'s division lemma, HCF, LCM, rational and irrational numbers',
            estimatedTime: 180,
            keyPoints: ['Euclid\'s division algorithm', 'Fundamental theorem of arithmetic', 'HCF and LCM', 'Rational and irrational numbers'],
            topics: [
              {
                id: 'math-10-ch1-t1',
                title: 'Euclid\'s Division Lemma',
                description: 'Understanding and applying Euclid\'s division lemma',
                learningObjectives: ['Apply division lemma', 'Find HCF using Euclidean algorithm'],
                difficulty: 'Medium',
                estimatedTime: 60
              },
              {
                id: 'math-10-ch1-t2',
                title: 'Fundamental Theorem of Arithmetic',
                description: 'Prime factorization and its applications',
                learningObjectives: ['Express numbers as product of primes', 'Find HCF and LCM using prime factorization'],
                difficulty: 'Medium',
                estimatedTime: 60
              },
              {
                id: 'math-10-ch1-t3',
                title: 'Rational and Irrational Numbers',
                description: 'Properties and decimal representations',
                learningObjectives: ['Identify rational and irrational numbers', 'Understand decimal expansions'],
                difficulty: 'Hard',
                estimatedTime: 60
              }
            ]
          }
          // More Class 10 chapters...
        ]
      }
      // More Class 10 subjects...
    ]
  }
  // Classes 2-5, 7-9, 11-12 would be added here with similar structure...
];

// Helper functions for data access
export function getClassData(classNumber: number): NCERTClass | undefined {
  return ncertData.find(cls => cls.classNumber === classNumber);
}

export function getSubjectData(classNumber: number, subjectCode: string): NCERTSubject | undefined {
  const classData = getClassData(classNumber);
  return classData?.subjects.find(subject => subject.code === subjectCode);
}

export function getChapterData(classNumber: number, subjectCode: string, chapterId: string): NCERTChapter | undefined {
  const subjectData = getSubjectData(classNumber, subjectCode);
  return subjectData?.chapters.find(chapter => chapter.id === chapterId);
}

export function getAllClasses(): NCERTClass[] {
  return ncertData;
}

// Progress tracking interfaces
export interface UserProgress {
  userId: string;
  classId: string;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  completedAt: Date;
  timeSpent: number; // in minutes
  quizScore?: number;
  notes?: string;
}

export interface ClassProgress {
  classId: string;
  totalChapters: number;
  completedChapters: number;
  progressPercentage: number;
  streakDays: number;
  badges: string[];
}