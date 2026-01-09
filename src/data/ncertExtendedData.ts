// Extended NCERT data for all classes (2-5, 7-9, 11-12)
// This file extends the base ncertData with complete class coverage

import { NCERTClass } from './ncertData';

export const additionalNCERTData: NCERTClass[] = [
  {
    id: 'class-2',
    className: 'Class 2',
    classNumber: 2,
    ageGroup: '7-8 years',
    description: 'Building on foundation skills',
    icon: 'BookMarked',
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-red-500',
    subjects: [
      {
        id: 'eng-2',
        name: 'English',
        code: 'ENG',
        description: 'Improved vocabulary and sentence formation',
        icon: 'Languages',
        color: 'bg-blue-500',
        gradient: 'from-blue-400 to-indigo-500',
        totalChapters: 10,
        board: 'NCERT',
        chapters: [
          {
            id: 'eng-2-ch1',
            chapterNumber: 1,
            title: 'First Day at School',
            description: 'Story about starting school',
            estimatedTime: 50,
            keyPoints: ['New vocabulary', 'Sentence formation', 'Story comprehension'],
            topics: [
              {
                id: 'eng-2-ch1-t1',
                title: 'New Words',
                description: 'Learning new vocabulary from the story',
                learningObjectives: ['Understand new words', 'Use words in sentences'],
                difficulty: 'Easy',
                estimatedTime: 25
              },
              {
                id: 'eng-2-ch1-t2',
                title: 'Story Time',
                description: 'Reading and understanding the story',
                learningObjectives: ['Read with expression', 'Answer questions about story'],
                difficulty: 'Easy',
                estimatedTime: 25
              }
            ]
          }
        ]
      },
      {
        id: 'math-2',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Addition, subtraction, and patterns',
        icon: 'Calculator',
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500',
        totalChapters: 15,
        board: 'NCERT',
        chapters: [
          {
            id: 'math-2-ch1',
            chapterNumber: 1,
            title: 'What is Long, What is Round?',
            description: 'Understanding length and shapes',
            estimatedTime: 60,
            keyPoints: ['Long and short', 'Measurement', 'Shapes around us'],
            topics: [
              {
                id: 'math-2-ch1-t1',
                title: 'Comparing Lengths',
                description: 'Understanding long, short, longer, shorter',
                learningObjectives: ['Compare lengths', 'Use measurement terms'],
                difficulty: 'Easy',
                estimatedTime: 30
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'class-7',
    className: 'Class 7',
    classNumber: 7,
    ageGroup: '12-13 years',
    description: 'Advanced concepts and critical thinking',
    icon: 'Brain',
    color: 'bg-teal-500',
    gradient: 'from-teal-400 to-cyan-500',
    subjects: [
      {
        id: 'math-7',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Integers, fractions, decimals, geometry',
        icon: 'Calculator',
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500',
        totalChapters: 15,
        board: 'NCERT',
        chapters: [
          {
            id: 'math-7-ch1',
            chapterNumber: 1,
            title: 'Integers',
            description: 'Operations on integers and their properties',
            estimatedTime: 120,
            keyPoints: ['Addition of integers', 'Subtraction of integers', 'Properties of integers'],
            topics: [
              {
                id: 'math-7-ch1-t1',
                title: 'Introduction to Integers',
                description: 'Understanding positive and negative numbers',
                learningObjectives: ['Identify integers on number line', 'Compare integers'],
                difficulty: 'Medium',
                estimatedTime: 40
              },
              {
                id: 'math-7-ch1-t2',
                title: 'Addition of Integers',
                description: 'Rules for adding integers',
                learningObjectives: ['Add integers with same signs', 'Add integers with different signs'],
                difficulty: 'Medium',
                estimatedTime: 40
              },
              {
                id: 'math-7-ch1-t3',
                title: 'Subtraction of Integers',
                description: 'Rules for subtracting integers',
                learningObjectives: ['Subtract integers', 'Understand additive inverse'],
                difficulty: 'Medium',
                estimatedTime: 40
              }
            ]
          },
          {
            id: 'math-7-ch2',
            chapterNumber: 2,
            title: 'Fractions and Decimals',
            description: 'Operations on fractions and decimals',
            estimatedTime: 150,
            keyPoints: ['Proper and improper fractions', 'Mixed numbers', 'Decimal operations'],
            topics: [
              {
                id: 'math-7-ch2-t1',
                title: 'Types of Fractions',
                description: 'Understanding different types of fractions',
                learningObjectives: ['Identify proper, improper, mixed fractions', 'Convert between types'],
                difficulty: 'Easy',
                estimatedTime: 50
              },
              {
                id: 'math-7-ch2-t2',
                title: 'Operations on Fractions',
                description: 'Addition, subtraction, multiplication, division of fractions',
                learningObjectives: ['Perform operations on fractions', 'Solve word problems'],
                difficulty: 'Medium',
                estimatedTime: 50
              },
              {
                id: 'math-7-ch2-t3',
                title: 'Decimals',
                description: 'Understanding and operating with decimals',
                learningObjectives: ['Convert fractions to decimals', 'Perform decimal operations'],
                difficulty: 'Medium',
                estimatedTime: 50
              }
            ]
          }
        ]
      },
      {
        id: 'sci-7',
        name: 'Science',
        code: 'SCI',
        description: 'Physics, chemistry, biology in detail',
        icon: 'Atom',
        color: 'bg-purple-500',
        gradient: 'from-purple-400 to-indigo-500',
        totalChapters: 18,
        board: 'NCERT',
        chapters: [
          {
            id: 'sci-7-ch1',
            chapterNumber: 1,
            title: 'Nutrition in Plants',
            description: 'How plants make their own food',
            estimatedTime: 100,
            keyPoints: ['Photosynthesis', 'Chlorophyll', 'Autotrophic nutrition', 'Symbiosis'],
            topics: [
              {
                id: 'sci-7-ch1-t1',
                title: 'Photosynthesis',
                description: 'Process of photosynthesis in plants',
                learningObjectives: ['Understand photosynthesis equation', 'Identify factors affecting photosynthesis'],
                difficulty: 'Medium',
                estimatedTime: 50
              },
              {
                id: 'sci-7-ch1-t2',
                title: 'Other Modes of Nutrition',
                description: 'Parasitic and symbiotic nutrition',
                learningObjectives: ['Understand different modes of nutrition', 'Give examples of each type'],
                difficulty: 'Medium',
                estimatedTime: 50
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'class-8',
    className: 'Class 8',
    classNumber: 8,
    ageGroup: '13-14 years',
    description: 'Pre-board preparation foundation',
    icon: 'Target',
    color: 'bg-rose-500',
    gradient: 'from-rose-400 to-pink-500',
    subjects: [
      {
        id: 'math-8',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Algebra, geometry, mensuration',
        icon: 'Calculator',
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500',
        totalChapters: 16,
        board: 'NCERT',
        chapters: [
          {
            id: 'math-8-ch1',
            chapterNumber: 1,
            title: 'Rational Numbers',
            description: 'Properties and operations on rational numbers',
            estimatedTime: 120,
            keyPoints: ['Properties of rational numbers', 'Representation on number line', 'Operations'],
            topics: [
              {
                id: 'math-8-ch1-t1',
                title: 'Introduction to Rational Numbers',
                description: 'Understanding rational numbers and their properties',
                learningObjectives: ['Define rational numbers', 'Identify rational numbers'],
                difficulty: 'Medium',
                estimatedTime: 40
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'class-9',
    className: 'Class 9',
    classNumber: 9,
    ageGroup: '14-15 years',
    description: 'Foundation for board classes',
    icon: 'Lightbulb',
    color: 'bg-yellow-500',
    gradient: 'from-yellow-400 to-amber-500',
    subjects: [
      {
        id: 'math-9',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Algebra, geometry, coordinate geometry, statistics',
        icon: 'Calculator',
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500',
        totalChapters: 15,
        board: 'NCERT',
        chapters: [
          {
            id: 'math-9-ch1',
            chapterNumber: 1,
            title: 'Number Systems',
            description: 'Real numbers, irrational numbers, rationalization',
            estimatedTime: 150,
            keyPoints: ['Rational and irrational numbers', 'Real number line', 'Laws of exponents'],
            topics: [
              {
                id: 'math-9-ch1-t1',
                title: 'Review of Rational Numbers',
                description: 'Revisiting rational numbers and their decimal representations',
                learningObjectives: ['Express rational numbers as decimals', 'Understand terminating and non-terminating decimals'],
                difficulty: 'Medium',
                estimatedTime: 50
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'class-11',
    className: 'Class 11',
    classNumber: 11,
    ageGroup: '16-17 years',
    description: 'Higher secondary foundation',
    icon: 'Microscope',
    color: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-teal-500',
    subjects: [
      {
        id: 'math-11',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Sets, functions, trigonometry, sequences',
        icon: 'Calculator',
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500',
        totalChapters: 16,
        board: 'NCERT',
        chapters: [
          {
            id: 'math-11-ch1',
            chapterNumber: 1,
            title: 'Sets',
            description: 'Introduction to sets, operations on sets',
            estimatedTime: 180,
            keyPoints: ['Set theory', 'Venn diagrams', 'Operations on sets', 'Laws of sets'],
            topics: [
              {
                id: 'math-11-ch1-t1',
                title: 'Introduction to Sets',
                description: 'Definition and representation of sets',
                learningObjectives: ['Define sets', 'Represent sets using different methods'],
                difficulty: 'Easy',
                estimatedTime: 60
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'class-12',
    className: 'Class 12',
    classNumber: 12,
    ageGroup: '17-18 years',
    description: 'Board exam and competitive prep',
    icon: 'Trophy',
    color: 'bg-violet-500',
    gradient: 'from-violet-400 to-purple-500',
    subjects: [
      {
        id: 'math-12',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Calculus, vectors, probability, linear programming',
        icon: 'Calculator',
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500',
        totalChapters: 13,
        board: 'NCERT',
        chapters: [
          {
            id: 'math-12-ch1',
            chapterNumber: 1,
            title: 'Relations and Functions',
            description: 'Types of relations and functions, inverse functions',
            estimatedTime: 200,
            keyPoints: ['Types of relations', 'Types of functions', 'Composite functions', 'Inverse functions'],
            topics: [
              {
                id: 'math-12-ch1-t1',
                title: 'Relations',
                description: 'Understanding different types of relations',
                learningObjectives: ['Define relations', 'Classify relations as reflexive, symmetric, transitive'],
                difficulty: 'Medium',
                estimatedTime: 70
              }
            ]
          }
        ]
      }
    ]
  }
];

// Gamification data
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: string;
}

export const badges: Badge[] = [
  {
    id: 'first-chapter',
    name: 'Chapter Champion',
    description: 'Completed your first chapter!',
    icon: 'Trophy',
    color: 'bg-yellow-500',
    criteria: 'Complete any chapter'
  },
  {
    id: 'math-master',
    name: 'Math Master',
    description: 'Completed 5 math chapters',
    icon: 'Calculator',
    color: 'bg-green-500',
    criteria: 'Complete 5 mathematics chapters'
  },
  {
    id: 'science-explorer',
    name: 'Science Explorer',
    description: 'Completed 5 science chapters',
    icon: 'Atom',
    color: 'bg-purple-500',
    criteria: 'Complete 5 science chapters'
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Scored 90%+ in 10 quizzes',
    icon: 'Star',
    color: 'bg-blue-500',
    criteria: 'Score 90% or above in 10 quizzes'
  },
  {
    id: 'streak-warrior',
    name: 'Streak Warrior',
    description: '30-day learning streak!',
    icon: 'Zap',
    color: 'bg-orange-500',
    criteria: 'Maintain 30-day study streak'
  },
  {
    id: 'ai-buddy',
    name: 'AI Buddy',
    description: 'Asked 50 questions to AI tutor',
    icon: 'Brain',
    color: 'bg-pink-500',
    criteria: 'Ask 50 questions to AI tutor'
  }
];

// AI Learning Tools Configuration
export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isAvailable: boolean;
  apiEndpoint?: string;
}

export const aiLearningTools: AITool[] = [
  {
    id: 'ai-summary',
    name: 'AI Summary',
    description: 'Get chapter summary in simple language',
    icon: 'BookOpen',
    color: 'bg-blue-500',
    isAvailable: true,
    apiEndpoint: '/api/ai-summary'
  },
  {
    id: 'ai-flashcards',
    name: 'Smart Flashcards',
    description: 'Auto-generate flashcards from chapter content',
    icon: 'Star',
    color: 'bg-green-500',
    isAvailable: true,
    apiEndpoint: '/api/generate-flashcards'
  },
  {
    id: 'ai-quiz',
    name: 'Quick Quiz',
    description: 'Practice with AI-generated questions',
    icon: 'Target',
    color: 'bg-purple-500',
    isAvailable: true,
    apiEndpoint: '/api/generate-quiz'
  },
  {
    id: 'ai-tutor',
    name: 'Ask TutorBuddy',
    description: 'Get instant doubt clarification',
    icon: 'MessageSquare',
    color: 'bg-orange-500',
    isAvailable: true,
    apiEndpoint: '/api/ai-tutor'
  },
  {
    id: 'ai-voice',
    name: 'Voice Tutor',
    description: 'Listen to explanations with AI voice',
    icon: 'Mic',
    color: 'bg-pink-500',
    isAvailable: true,
    apiEndpoint: '/api/text-to-speech'
  },
  {
    id: 'ai-explain',
    name: 'Magic Explain',
    description: 'Explain any concept in simple terms',
    icon: 'Sparkles',
    color: 'bg-indigo-500',
    isAvailable: true,
    apiEndpoint: '/api/magic-explain'
  }
];

// Study plan recommendations
export interface StudyPlan {
  id: string;
  classNumber: number;
  title: string;
  description: string;
  dailyTimeMinutes: number;
  topics: string[];
  estimatedDays: number;
}

export const studyPlans: StudyPlan[] = [
  {
    id: 'class-6-math-foundations',
    classNumber: 6,
    title: 'Math Foundations',
    description: 'Master basic mathematical concepts',
    dailyTimeMinutes: 45,
    topics: ['Numbers', 'Basic operations', 'Fractions', 'Decimals'],
    estimatedDays: 30
  },
  {
    id: 'class-10-board-prep',
    classNumber: 10,
    title: 'Board Exam Preparation',
    description: 'Complete preparation for board exams',
    dailyTimeMinutes: 120,
    topics: ['All subjects', 'Sample papers', 'Revision', 'Doubt clearing'],
    estimatedDays: 90
  }
];