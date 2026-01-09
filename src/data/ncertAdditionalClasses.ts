// Extended NCERT Data with all classes 1-12
// This file adds the remaining classes that aren't already in ncertData.ts

import { NCERTClass } from './ncertData';

// Class 2
export const class2Data: NCERTClass = {
  id: 'class-2',
  className: 'Class 2',
  classNumber: 2,
  ageGroup: '7-8 years',
  description: 'Building basic concepts through engaging activities',
  icon: 'BookOpen',
  color: 'bg-orange-500',
  gradient: 'from-orange-400 to-amber-500',
  subjects: [
    {
      id: 'eng-2',
      name: 'English',
      code: 'ENG',
      description: 'Developing reading and writing skills',
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
          description: 'Introduction to school environment',
          estimatedTime: 45,
          keyPoints: ['Vocabulary related to school', 'Simple sentences', 'Reading comprehension'],
          topics: [
            {
              id: 'eng-2-ch1-t1',
              title: 'School Vocabulary',
              description: 'Learning words related to school',
              learningObjectives: ['Learn 20 new school-related words', 'Use them in sentences'],
              difficulty: 'Easy',
              estimatedTime: 20
            },
            {
              id: 'eng-2-ch1-t2',
              title: 'Reading Exercise',
              description: 'Reading and understanding a simple story',
              learningObjectives: ['Read with proper pronunciation', 'Answer questions about the story'],
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
      description: 'Building number sense and basic operations',
      icon: 'Calculator',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
      totalChapters: 14,
      board: 'NCERT',
      chapters: [
        {
          id: 'math-2-ch1',
          chapterNumber: 1,
          title: 'What is Long, What is Round?',
          description: 'Understanding shapes and measurements',
          estimatedTime: 50,
          keyPoints: ['Identifying shapes', 'Comparing sizes', 'Basic measurements'],
          topics: [
            {
              id: 'math-2-ch1-t1',
              title: 'Shapes Around Us',
              description: 'Identifying different shapes in our surroundings',
              learningObjectives: ['Identify circles, squares, triangles', 'Recognize shapes in everyday objects'],
              difficulty: 'Easy',
              estimatedTime: 25
            },
            {
              id: 'math-2-ch1-t2',
              title: 'Comparing Sizes',
              description: 'Learning to compare objects by size',
              learningObjectives: ['Compare objects by length', 'Use terms like longer, shorter, bigger, smaller'],
              difficulty: 'Easy',
              estimatedTime: 25
            }
          ]
        }
      ]
    },
    {
      id: 'evs-2',
      name: 'Environmental Studies',
      code: 'EVS',
      description: 'Exploring our environment and surroundings',
      icon: 'Globe',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-emerald-600',
      totalChapters: 12,
      board: 'NCERT',
      chapters: [
        {
          id: 'evs-2-ch1',
          chapterNumber: 1,
          title: 'Plants and Animals Around Us',
          description: 'Introduction to plants and animals in our surroundings',
          estimatedTime: 60,
          keyPoints: ['Types of plants', 'Domestic and wild animals', 'Taking care of plants and animals'],
          topics: [
            {
              id: 'evs-2-ch1-t1',
              title: 'Plants in Our Surroundings',
              description: 'Learning about different types of plants',
              learningObjectives: ['Identify different parts of plants', 'Understand how plants grow'],
              difficulty: 'Easy',
              estimatedTime: 30
            },
            {
              id: 'evs-2-ch1-t2',
              title: 'Animals We Know',
              description: 'Learning about different animals',
              learningObjectives: ['Differentiate between domestic and wild animals', 'Understand animal habitats'],
              difficulty: 'Easy',
              estimatedTime: 30
            }
          ]
        }
      ]
    }
  ]
};

// Class 3
export const class3Data: NCERTClass = {
  id: 'class-3',
  className: 'Class 3',
  classNumber: 3,
  ageGroup: '8-9 years',
  description: 'Expanding knowledge with diverse subjects',
  icon: 'BookOpen',
  color: 'bg-yellow-500',
  gradient: 'from-yellow-400 to-amber-600',
  subjects: [
    {
      id: 'eng-3',
      name: 'English',
      code: 'ENG',
      description: 'Developing communication and comprehension skills',
      icon: 'Languages',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      totalChapters: 10,
      board: 'NCERT',
      chapters: [
        {
          id: 'eng-3-ch1',
          chapterNumber: 1,
          title: 'The Magic Garden',
          description: 'A story about imagination and nature',
          estimatedTime: 50,
          keyPoints: ['Reading comprehension', 'Vocabulary building', 'Creative writing'],
          topics: [
            {
              id: 'eng-3-ch1-t1',
              title: 'Reading the Story',
              description: 'Reading and understanding the story',
              learningObjectives: ['Read with proper expression', 'Understand the main ideas'],
              difficulty: 'Easy',
              estimatedTime: 25
            },
            {
              id: 'eng-3-ch1-t2',
              title: 'New Words',
              description: 'Learning new vocabulary from the story',
              learningObjectives: ['Learn 15 new words', 'Use them in sentences'],
              difficulty: 'Medium',
              estimatedTime: 25
            }
          ]
        }
      ]
    },
    {
      id: 'math-3',
      name: 'Mathematics',
      code: 'MATH',
      description: 'Learning numbers, patterns and basic operations',
      icon: 'Calculator',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
      totalChapters: 14,
      board: 'NCERT',
      chapters: [
        {
          id: 'math-3-ch1',
          chapterNumber: 1,
          title: 'Where to Look From',
          description: 'Understanding spatial visualization',
          estimatedTime: 60,
          keyPoints: ['Shapes and spatial understanding', 'Patterns', 'Mental mapping'],
          topics: [
            {
              id: 'math-3-ch1-t1',
              title: 'Looking at Things',
              description: 'Learning to observe objects from different perspectives',
              learningObjectives: ['Visualize objects from different angles', 'Understand top, side, and front views'],
              difficulty: 'Medium',
              estimatedTime: 30
            },
            {
              id: 'math-3-ch1-t2',
              title: 'Finding Patterns',
              description: 'Identifying and creating patterns',
              learningObjectives: ['Recognize patterns in everyday objects', 'Create simple patterns'],
              difficulty: 'Medium',
              estimatedTime: 30
            }
          ]
        }
      ]
    },
    {
      id: 'evs-3',
      name: 'Environmental Studies',
      code: 'EVS',
      description: 'Learning about our environment and society',
      icon: 'Globe',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-emerald-600',
      totalChapters: 12,
      board: 'NCERT',
      chapters: [
        {
          id: 'evs-3-ch1',
          chapterNumber: 1,
          title: 'Poonam\'s Day Out',
          description: 'Understanding daily activities and routines',
          estimatedTime: 60,
          keyPoints: ['Daily routines', 'Time management', 'Personal hygiene'],
          topics: [
            {
              id: 'evs-3-ch1-t1',
              title: 'Daily Activities',
              description: 'Learning about daily routines and activities',
              learningObjectives: ['Identify various daily activities', 'Understand the importance of routines'],
              difficulty: 'Easy',
              estimatedTime: 30
            },
            {
              id: 'evs-3-ch1-t2',
              title: 'Personal Care',
              description: 'Understanding the importance of personal hygiene',
              learningObjectives: ['Learn about personal hygiene practices', 'Understand their importance'],
              difficulty: 'Easy',
              estimatedTime: 30
            }
          ]
        }
      ]
    }
  ]
};

// Class 4
export const class4Data: NCERTClass = {
  id: 'class-4',
  className: 'Class 4',
  classNumber: 4,
  ageGroup: '9-10 years',
  description: 'Building stronger foundations across subjects',
  icon: 'BookOpen',
  color: 'bg-green-500',
  gradient: 'from-green-400 to-teal-500',
  subjects: [
    {
      id: 'eng-4',
      name: 'English',
      code: 'ENG',
      description: 'Advancing language skills through stories and poems',
      icon: 'Languages',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      totalChapters: 10,
      board: 'NCERT',
      chapters: [
        {
          id: 'eng-4-ch1',
          chapterNumber: 1,
          title: 'Wake Up!',
          description: 'A poem about morning routines and nature',
          estimatedTime: 50,
          keyPoints: ['Poetry appreciation', 'Rhyming words', 'Morning routines'],
          topics: [
            {
              id: 'eng-4-ch1-t1',
              title: 'Reading the Poem',
              description: 'Reading and appreciating the poem',
              learningObjectives: ['Read with rhythm and expression', 'Understand the poem\'s message'],
              difficulty: 'Medium',
              estimatedTime: 20
            },
            {
              id: 'eng-4-ch1-t2',
              title: 'Vocabulary and Comprehension',
              description: 'Understanding new words and answering questions',
              learningObjectives: ['Learn new vocabulary', 'Answer comprehension questions'],
              difficulty: 'Medium',
              estimatedTime: 30
            }
          ]
        }
      ]
    },
    {
      id: 'math-4',
      name: 'Mathematics',
      code: 'MATH',
      description: 'Exploring numbers, shapes, and patterns',
      icon: 'Calculator',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
      totalChapters: 14,
      board: 'NCERT',
      chapters: [
        {
          id: 'math-4-ch1',
          chapterNumber: 1,
          title: 'Building with Bricks',
          description: 'Learning about shapes and structures',
          estimatedTime: 60,
          keyPoints: ['Patterns in architecture', '3D shapes', 'Spatial understanding'],
          topics: [
            {
              id: 'math-4-ch1-t1',
              title: 'Shapes Around Us',
              description: 'Identifying shapes in buildings and structures',
              learningObjectives: ['Recognize various shapes in architecture', 'Understand how shapes provide strength'],
              difficulty: 'Medium',
              estimatedTime: 30
            },
            {
              id: 'math-4-ch1-t2',
              title: 'Building Models',
              description: 'Creating simple models using shapes',
              learningObjectives: ['Create models using basic shapes', 'Understand spatial arrangements'],
              difficulty: 'Medium',
              estimatedTime: 30
            }
          ]
        }
      ]
    },
    {
      id: 'evs-4',
      name: 'Environmental Studies',
      code: 'EVS',
      description: 'Understanding our environment and society',
      icon: 'Globe',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-emerald-600',
      totalChapters: 12,
      board: 'NCERT',
      chapters: [
        {
          id: 'evs-4-ch1',
          chapterNumber: 1,
          title: 'Going to School',
          description: 'Exploring different ways children go to school',
          estimatedTime: 60,
          keyPoints: ['Transportation methods', 'Regional diversity', 'Physical geography'],
          topics: [
            {
              id: 'evs-4-ch1-t1',
              title: 'Different Ways to Travel',
              description: 'Learning about various transportation methods',
              learningObjectives: ['Identify different means of transport', 'Understand regional variations'],
              difficulty: 'Medium',
              estimatedTime: 30
            },
            {
              id: 'evs-4-ch1-t2',
              title: 'Challenges in Different Regions',
              description: 'Understanding geographical challenges',
              learningObjectives: ['Learn about physical geography', 'Understand how environment affects daily life'],
              difficulty: 'Medium',
              estimatedTime: 30
            }
          ]
        }
      ]
    }
  ]
};

// Class 5
export const class5Data: NCERTClass = {
  id: 'class-5',
  className: 'Class 5',
  classNumber: 5,
  ageGroup: '10-11 years',
  description: 'Preparing for middle school with advanced concepts',
  icon: 'BookOpen',
  color: 'bg-blue-500',
  gradient: 'from-blue-400 to-indigo-500',
  subjects: [
    {
      id: 'eng-5',
      name: 'English',
      code: 'ENG',
      description: 'Strengthening language skills through literature',
      icon: 'Languages',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      totalChapters: 10,
      board: 'NCERT',
      chapters: [
        {
          id: 'eng-5-ch1',
          chapterNumber: 1,
          title: 'Ice-Cream Man',
          description: 'A poem about an ice-cream seller in summer',
          estimatedTime: 50,
          keyPoints: ['Poetry comprehension', 'Descriptive language', 'Seasonal changes'],
          topics: [
            {
              id: 'eng-5-ch1-t1',
              title: 'Understanding the Poem',
              description: 'Reading and analyzing the poem',
              learningObjectives: ['Understand poetic devices', 'Appreciate descriptive language'],
              difficulty: 'Medium',
              estimatedTime: 25
            },
            {
              id: 'eng-5-ch1-t2',
              title: 'Writing Skills',
              description: 'Creative writing inspired by the poem',
              learningObjectives: ['Write descriptive paragraphs', 'Use sensory language'],
              difficulty: 'Medium',
              estimatedTime: 25
            }
          ]
        }
      ]
    },
    {
      id: 'math-5',
      name: 'Mathematics',
      code: 'MATH',
      description: 'Advancing numerical skills and problem solving',
      icon: 'Calculator',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
      totalChapters: 14,
      board: 'NCERT',
      chapters: [
        {
          id: 'math-5-ch1',
          chapterNumber: 1,
          title: 'The Fish Tale',
          description: 'Understanding large numbers through practical examples',
          estimatedTime: 60,
          keyPoints: ['Large numbers', 'Place value', 'Estimation'],
          topics: [
            {
              id: 'math-5-ch1-t1',
              title: 'Working with Large Numbers',
              description: 'Understanding and representing large numbers',
              learningObjectives: ['Read and write large numbers', 'Understand place value'],
              difficulty: 'Medium',
              estimatedTime: 30
            },
            {
              id: 'math-5-ch1-t2',
              title: 'Estimation and Comparison',
              description: 'Learning to estimate and compare large numbers',
              learningObjectives: ['Estimate quantities', 'Compare large numbers'],
              difficulty: 'Medium',
              estimatedTime: 30
            }
          ]
        }
      ]
    },
    {
      id: 'evs-5',
      name: 'Environmental Studies',
      code: 'EVS',
      description: 'Exploring environment, society, and natural phenomena',
      icon: 'Globe',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-emerald-600',
      totalChapters: 12,
      board: 'NCERT',
      chapters: [
        {
          id: 'evs-5-ch1',
          chapterNumber: 1,
          title: 'Super Senses',
          description: 'Learning about animal senses and adaptations',
          estimatedTime: 60,
          keyPoints: ['Animal adaptations', 'Sense organs', 'Survival strategies'],
          topics: [
            {
              id: 'evs-5-ch1-t1',
              title: 'Animal Senses',
              description: 'Understanding how animals use their senses',
              learningObjectives: ['Learn about different animal senses', 'Understand sense organs'],
              difficulty: 'Medium',
              estimatedTime: 30
            },
            {
              id: 'evs-5-ch1-t2',
              title: 'Adaptations for Survival',
              description: 'Learning how animals adapt to their environment',
              learningObjectives: ['Understand animal adaptations', 'Relate adaptations to habitats'],
              difficulty: 'Medium',
              estimatedTime: 30
            }
          ]
        }
      ]
    }
  ]
};

// Class 7
export const class7Data: NCERTClass = {
  id: 'class-7',
  className: 'Class 7',
  classNumber: 7,
  ageGroup: '12-13 years',
  description: 'Advancing knowledge with detailed subject exploration',
  icon: 'BookOpen',
  color: 'bg-indigo-500',
  gradient: 'from-indigo-400 to-purple-500',
  subjects: [
    {
      id: 'eng-7',
      name: 'English',
      code: 'ENG',
      description: 'Developing advanced reading and writing skills',
      icon: 'Languages',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      totalChapters: 10,
      board: 'NCERT',
      chapters: [
        {
          id: 'eng-7-ch1',
          chapterNumber: 1,
          title: 'Three Questions',
          description: 'A story by Leo Tolstoy about wisdom and right actions',
          estimatedTime: 60,
          keyPoints: ['Moral values', 'Critical thinking', 'Literary analysis'],
          topics: [
            {
              id: 'eng-7-ch1-t1',
              title: 'Understanding the Story',
              description: 'Reading and analyzing the narrative',
              learningObjectives: ['Comprehend the main theme', 'Analyze character motivations'],
              difficulty: 'Medium',
              estimatedTime: 30
            },
            {
              id: 'eng-7-ch1-t2',
              title: 'Moral and Message',
              description: 'Exploring the moral lessons in the story',
              learningObjectives: ['Identify key moral lessons', 'Relate to real-life situations'],
              difficulty: 'Medium',
              estimatedTime: 30
            }
          ]
        }
      ]
    },
    {
      id: 'math-7',
      name: 'Mathematics',
      code: 'MATH',
      description: 'Building algebraic thinking and geometric understanding',
      icon: 'Calculator',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
      totalChapters: 15,
      board: 'NCERT',
      chapters: [
        {
          id: 'math-7-ch1',
          chapterNumber: 1,
          title: 'Integers',
          description: 'Understanding and operating with positive and negative numbers',
          estimatedTime: 70,
          keyPoints: ['Number line', 'Operations with integers', 'Properties of integers'],
          topics: [
            {
              id: 'math-7-ch1-t1',
              title: 'Understanding Integers',
              description: 'Learning about positive and negative numbers',
              learningObjectives: ['Represent integers on number line', 'Understand absolute value'],
              difficulty: 'Medium',
              estimatedTime: 35
            },
            {
              id: 'math-7-ch1-t2',
              title: 'Operations with Integers',
              description: 'Adding, subtracting, multiplying, and dividing integers',
              learningObjectives: ['Perform operations with integers', 'Solve problems involving integers'],
              difficulty: 'Medium',
              estimatedTime: 35
            }
          ]
        }
      ]
    },
    {
      id: 'sci-7',
      name: 'Science',
      code: 'SCI',
      description: 'Exploring physical, chemical, and biological phenomena',
      icon: 'Microscope',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-teal-500',
      totalChapters: 18,
      board: 'NCERT',
      chapters: [
        {
          id: 'sci-7-ch1',
          chapterNumber: 1,
          title: 'Nutrition in Plants',
          description: 'Understanding how plants make their food',
          estimatedTime: 70,
          keyPoints: ['Photosynthesis', 'Modes of nutrition', 'Plant adaptations'],
          topics: [
            {
              id: 'sci-7-ch1-t1',
              title: 'Photosynthesis',
              description: 'Understanding the process of photosynthesis',
              learningObjectives: ['Explain the process of photosynthesis', 'Identify factors affecting photosynthesis'],
              difficulty: 'Medium',
              estimatedTime: 35
            },
            {
              id: 'sci-7-ch1-t2',
              title: 'Other Modes of Nutrition',
              description: 'Learning about parasitic and saprophytic nutrition',
              learningObjectives: ['Identify different modes of nutrition', 'Understand plant adaptations'],
              difficulty: 'Medium',
              estimatedTime: 35
            }
          ]
        }
      ]
    },
    {
      id: 'sst-7',
      name: 'Social Science',
      code: 'SST',
      description: 'Exploring history, geography, and civics',
      icon: 'Globe',
      color: 'bg-orange-500',
      gradient: 'from-orange-400 to-amber-500',
      totalChapters: 20,
      board: 'NCERT',
      chapters: [
        {
          id: 'hist-7-ch1',
          chapterNumber: 1,
          title: 'Tracing Changes Through a Thousand Years',
          description: 'Understanding historical developments in the medieval period',
          estimatedTime: 70,
          keyPoints: ['Historical sources', 'Medieval India', 'Social and political changes'],
          topics: [
            {
              id: 'hist-7-ch1-t1',
              title: 'Sources of Medieval History',
              description: 'Learning about historical sources from medieval period',
              learningObjectives: ['Identify different historical sources', 'Evaluate their significance'],
              difficulty: 'Medium',
              estimatedTime: 35
            },
            {
              id: 'hist-7-ch1-t2',
              title: 'Major Developments',
              description: 'Understanding key developments during this period',
              learningObjectives: ['Trace major historical developments', 'Understand their impact'],
              difficulty: 'Medium',
              estimatedTime: 35
            }
          ]
        }
      ]
    }
  ]
};

// Class 8
export const class8Data: NCERTClass = {
  id: 'class-8',
  className: 'Class 8',
  classNumber: 8,
  ageGroup: '13-14 years',
  description: 'Strengthening knowledge across all subjects',
  icon: 'BookOpen',
  color: 'bg-purple-500',
  gradient: 'from-purple-400 to-fuchsia-500',
  subjects: [
    {
      id: 'eng-8',
      name: 'English',
      code: 'ENG',
      description: 'Developing advanced language and literature skills',
      icon: 'Languages',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      totalChapters: 10,
      board: 'NCERT',
      chapters: [
        {
          id: 'eng-8-ch1',
          chapterNumber: 1,
          title: 'The Best Christmas Present in the World',
          description: 'A story about peace and humanity during war',
          estimatedTime: 60,
          keyPoints: ['War and peace', 'Humanity', 'Historical fiction'],
          topics: [
            {
              id: 'eng-8-ch1-t1',
              title: 'Reading the Story',
              description: 'Understanding the narrative and context',
              learningObjectives: ['Comprehend the historical setting', 'Analyze the theme of humanity'],
              difficulty: 'Medium',
              estimatedTime: 30
            },
            {
              id: 'eng-8-ch1-t2',
              title: 'Analyzing the Message',
              description: 'Exploring the deeper themes in the story',
              learningObjectives: ['Identify key messages', 'Relate to modern contexts'],
              difficulty: 'Medium',
              estimatedTime: 30
            }
          ]
        }
      ]
    },
    {
      id: 'math-8',
      name: 'Mathematics',
      code: 'MATH',
      description: 'Advanced mathematical concepts and problem-solving',
      icon: 'Calculator',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
      totalChapters: 16,
      board: 'NCERT',
      chapters: [
        {
          id: 'math-8-ch1',
          chapterNumber: 1,
          title: 'Rational Numbers',
          description: 'Understanding and operating with rational numbers',
          estimatedTime: 70,
          keyPoints: ['Properties of rational numbers', 'Operations', 'Representation on number line'],
          topics: [
            {
              id: 'math-8-ch1-t1',
              title: 'Understanding Rational Numbers',
              description: 'Learning about rational numbers and their properties',
              learningObjectives: ['Define rational numbers', 'Represent them on number line'],
              difficulty: 'Medium',
              estimatedTime: 35
            },
            {
              id: 'math-8-ch1-t2',
              title: 'Operations with Rational Numbers',
              description: 'Performing operations with rational numbers',
              learningObjectives: ['Add, subtract, multiply, and divide rational numbers', 'Solve problems'],
              difficulty: 'Hard',
              estimatedTime: 35
            }
          ]
        }
      ]
    },
    {
      id: 'sci-8',
      name: 'Science',
      code: 'SCI',
      description: 'Exploring advanced scientific concepts',
      icon: 'Microscope',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-teal-500',
      totalChapters: 18,
      board: 'NCERT',
      chapters: [
        {
          id: 'sci-8-ch1',
          chapterNumber: 1,
          title: 'Crop Production and Management',
          description: 'Understanding agricultural practices and crop management',
          estimatedTime: 70,
          keyPoints: ['Agricultural practices', 'Crop types', 'Farm management'],
          topics: [
            {
              id: 'sci-8-ch1-t1',
              title: 'Agricultural Practices',
              description: 'Learning about different agricultural methods',
              learningObjectives: ['Understand various agricultural practices', 'Identify tools used in farming'],
              difficulty: 'Medium',
              estimatedTime: 35
            },
            {
              id: 'sci-8-ch1-t2',
              title: 'Crop Management',
              description: 'Understanding how crops are managed and protected',
              learningObjectives: ['Learn about irrigation methods', 'Understand pest control'],
              difficulty: 'Medium',
              estimatedTime: 35
            }
          ]
        }
      ]
    },
    {
      id: 'sst-8',
      name: 'Social Science',
      code: 'SST',
      description: 'Exploring history, geography, and civics in depth',
      icon: 'Globe',
      color: 'bg-orange-500',
      gradient: 'from-orange-400 to-amber-500',
      totalChapters: 20,
      board: 'NCERT',
      chapters: [
        {
          id: 'hist-8-ch1',
          chapterNumber: 1,
          title: 'How, When and Where',
          description: 'Understanding historical records and periodization',
          estimatedTime: 70,
          keyPoints: ['Historical sources', 'Colonial period', 'Administrative records'],
          topics: [
            {
              id: 'hist-8-ch1-t1',
              title: 'Historical Records',
              description: 'Learning about different types of historical records',
              learningObjectives: ['Identify various historical sources', 'Understand their significance'],
              difficulty: 'Medium',
              estimatedTime: 35
            },
            {
              id: 'hist-8-ch1-t2',
              title: 'Colonial Administration',
              description: 'Understanding colonial record-keeping and administration',
              learningObjectives: ['Learn about colonial administrative records', 'Understand their perspective'],
              difficulty: 'Medium',
              estimatedTime: 35
            }
          ]
        }
      ]
    }
  ]
};

// Class 9
export const class9Data: NCERTClass = {
  id: 'class-9',
  className: 'Class 9',
  classNumber: 9,
  ageGroup: '14-15 years',
  description: 'Preparing for board exam foundations with comprehensive study',
  icon: 'BookOpen',
  color: 'bg-teal-500',
  gradient: 'from-teal-400 to-cyan-500',
  subjects: [
    {
      id: 'eng-9',
      name: 'English',
      code: 'ENG',
      description: 'Advanced literature and language study',
      icon: 'Languages',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      totalChapters: 11,
      board: 'NCERT',
      chapters: [
        {
          id: 'eng-9-ch1',
          chapterNumber: 1,
          title: 'The Fun They Had',
          description: 'A science fiction story about future education',
          estimatedTime: 60,
          keyPoints: ['Future technology', 'Education systems', 'Human connection'],
          topics: [
            {
              id: 'eng-9-ch1-t1',
              title: 'Reading and Analysis',
              description: 'Understanding the story and its themes',
              learningObjectives: ['Analyze the story\'s setting', 'Understand character perspectives'],
              difficulty: 'Medium',
              estimatedTime: 30
            },
            {
              id: 'eng-9-ch1-t2',
              title: 'Theme Exploration',
              description: 'Exploring the themes of technology and education',
              learningObjectives: ['Identify key themes', 'Compare with current education system'],
              difficulty: 'Medium',
              estimatedTime: 30
            }
          ]
        }
      ]
    },
    {
      id: 'math-9',
      name: 'Mathematics',
      code: 'MATH',
      description: 'Building strong foundations for higher mathematics',
      icon: 'Calculator',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
      totalChapters: 15,
      board: 'NCERT',
      chapters: [
        {
          id: 'math-9-ch1',
          chapterNumber: 1,
          title: 'Number Systems',
          description: 'Understanding real numbers and their properties',
          estimatedTime: 80,
          keyPoints: ['Real numbers', 'Rational and irrational numbers', 'Number line representation'],
          topics: [
            {
              id: 'math-9-ch1-t1',
              title: 'Real Numbers',
              description: 'Understanding the real number system',
              learningObjectives: ['Classify numbers into rational and irrational', 'Represent real numbers on number line'],
              difficulty: 'Hard',
              estimatedTime: 40
            },
            {
              id: 'math-9-ch1-t2',
              title: 'Operations with Real Numbers',
              description: 'Performing operations and understanding properties',
              learningObjectives: ['Apply properties of real numbers', 'Solve problems involving real numbers'],
              difficulty: 'Hard',
              estimatedTime: 40
            }
          ]
        }
      ]
    },
    {
      id: 'sci-9',
      name: 'Science',
      code: 'SCI',
      description: 'Comprehensive study of physics, chemistry, and biology',
      icon: 'Microscope',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-teal-500',
      totalChapters: 15,
      board: 'NCERT',
      chapters: [
        {
          id: 'sci-9-ch1',
          chapterNumber: 1,
          title: 'Matter in Our Surroundings',
          description: 'Understanding the nature and behavior of matter',
          estimatedTime: 80,
          keyPoints: ['States of matter', 'Physical properties', 'Change of state'],
          topics: [
            {
              id: 'sci-9-ch1-t1',
              title: 'States of Matter',
              description: 'Understanding solids, liquids, and gases',
              learningObjectives: ['Describe characteristics of different states', 'Explain particle arrangement'],
              difficulty: 'Medium',
              estimatedTime: 40
            },
            {
              id: 'sci-9-ch1-t2',
              title: 'Change of State',
              description: 'Understanding transitions between states of matter',
              learningObjectives: ['Explain processes like melting and boiling', 'Understand latent heat'],
              difficulty: 'Hard',
              estimatedTime: 40
            }
          ]
        }
      ]
    },
    {
      id: 'sst-9',
      name: 'Social Science',
      code: 'SST',
      description: 'Detailed study of history, geography, economics, and political science',
      icon: 'Globe',
      color: 'bg-orange-500',
      gradient: 'from-orange-400 to-amber-500',
      totalChapters: 24,
      board: 'NCERT',
      chapters: [
        {
          id: 'hist-9-ch1',
          chapterNumber: 1,
          title: 'The French Revolution',
          description: 'Understanding the causes and impact of the French Revolution',
          estimatedTime: 80,
          keyPoints: ['Causes of the revolution', 'Major events', 'Impact on modern democracy'],
          topics: [
            {
              id: 'hist-9-ch1-t1',
              title: 'Causes of the Revolution',
              description: 'Understanding the factors that led to the French Revolution',
              learningObjectives: ['Identify social, economic, and political causes', 'Understand the role of Enlightenment'],
              difficulty: 'Hard',
              estimatedTime: 40
            },
            {
              id: 'hist-9-ch1-t2',
              title: 'Impact and Legacy',
              description: 'Understanding the impact of the French Revolution',
              learningObjectives: ['Analyze how it shaped modern democracy', 'Understand its global influence'],
              difficulty: 'Hard',
              estimatedTime: 40
            }
          ]
        }
      ]
    }
  ]
};

// Class 11
export const class11Data: NCERTClass = {
  id: 'class-11',
  className: 'Class 11',
  classNumber: 11,
  ageGroup: '16-17 years',
  description: 'Advanced preparation for higher education with specialized subjects',
  icon: 'BookOpen',
  color: 'bg-amber-500',
  gradient: 'from-amber-400 to-orange-500',
  subjects: [
    {
      id: 'eng-11',
      name: 'English',
      code: 'ENG',
      description: 'Advanced literature and language study',
      icon: 'Languages',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      totalChapters: 8,
      board: 'NCERT',
      chapters: [
        {
          id: 'eng-11-ch1',
          chapterNumber: 1,
          title: 'The Portrait of a Lady',
          description: 'A moving account of the author\'s relationship with his grandmother',
          estimatedTime: 90,
          keyPoints: ['Character analysis', 'Theme of generation gap', 'Cultural values'],
          topics: [
            {
              id: 'eng-11-ch1-t1',
              title: 'Character Study',
              description: 'Analyzing the character of the grandmother',
              learningObjectives: ['Understand character development', 'Analyze relationships between characters'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'eng-11-ch1-t2',
              title: 'Thematic Analysis',
              description: 'Exploring the themes presented in the story',
              learningObjectives: ['Identify major themes', 'Analyze how they are developed'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    },
    {
      id: 'phy-11',
      name: 'Physics',
      code: 'PHY',
      description: 'Comprehensive study of physical phenomena and laws',
      icon: 'Atom',
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-indigo-500',
      totalChapters: 15,
      board: 'NCERT',
      chapters: [
        {
          id: 'phy-11-ch1',
          chapterNumber: 1,
          title: 'Physical World',
          description: 'Introduction to physics and its scope',
          estimatedTime: 90,
          keyPoints: ['Nature of physics', 'Fundamental forces', 'Applications of physics'],
          topics: [
            {
              id: 'phy-11-ch1-t1',
              title: 'What is Physics?',
              description: 'Understanding the nature and scope of physics',
              learningObjectives: ['Define physics and its scope', 'Understand its relation to other sciences'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'phy-11-ch1-t2',
              title: 'Fundamental Forces',
              description: 'Understanding the fundamental forces in nature',
              learningObjectives: ['Identify the four fundamental forces', 'Understand their relative strengths'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    },
    {
      id: 'chem-11',
      name: 'Chemistry',
      code: 'CHEM',
      description: 'Study of matter, its properties, and transformations',
      icon: 'FlaskConical',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-teal-500',
      totalChapters: 14,
      board: 'NCERT',
      chapters: [
        {
          id: 'chem-11-ch1',
          chapterNumber: 1,
          title: 'Some Basic Concepts of Chemistry',
          description: 'Fundamental concepts of chemistry',
          estimatedTime: 90,
          keyPoints: ['Matter and its properties', 'Laws of chemical combination', 'Atomic and molecular mass'],
          topics: [
            {
              id: 'chem-11-ch1-t1',
              title: 'Nature of Matter',
              description: 'Understanding matter and its classification',
              learningObjectives: ['Define matter and its states', 'Classify substances as elements, compounds, and mixtures'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'chem-11-ch1-t2',
              title: 'Laws of Chemical Combination',
              description: 'Understanding the basic laws governing chemical reactions',
              learningObjectives: ['State and explain the laws of chemical combination', 'Solve numerical problems'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    },
    {
      id: 'math-11',
      name: 'Mathematics',
      code: 'MATH',
      description: 'Advanced mathematics for higher education',
      icon: 'Calculator',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
      totalChapters: 16,
      board: 'NCERT',
      chapters: [
        {
          id: 'math-11-ch1',
          chapterNumber: 1,
          title: 'Sets',
          description: 'Introduction to set theory and operations',
          estimatedTime: 90,
          keyPoints: ['Set concepts', 'Set operations', 'Venn diagrams'],
          topics: [
            {
              id: 'math-11-ch1-t1',
              title: 'Set Concepts',
              description: 'Understanding basic set concepts and notation',
              learningObjectives: ['Define sets and their representation', 'Identify types of sets'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'math-11-ch1-t2',
              title: 'Set Operations',
              description: 'Understanding operations on sets',
              learningObjectives: ['Perform union, intersection, and difference operations', 'Solve problems using Venn diagrams'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    },
    {
      id: 'bio-11',
      name: 'Biology',
      code: 'BIO',
      description: 'Study of living organisms and their interactions',
      icon: 'Microscope',
      color: 'bg-emerald-500',
      gradient: 'from-emerald-400 to-green-500',
      totalChapters: 22,
      board: 'NCERT',
      chapters: [
        {
          id: 'bio-11-ch1',
          chapterNumber: 1,
          title: 'The Living World',
          description: 'Introduction to the diversity and classification of living organisms',
          estimatedTime: 90,
          keyPoints: ['Characteristics of living organisms', 'Taxonomy', 'Biodiversity'],
          topics: [
            {
              id: 'bio-11-ch1-t1',
              title: 'What is Living?',
              description: 'Understanding the characteristics of living organisms',
              learningObjectives: ['Identify characteristics of life', 'Differentiate between living and non-living'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'bio-11-ch1-t2',
              title: 'Taxonomy',
              description: 'Understanding the classification of living organisms',
              learningObjectives: ['Explain taxonomic categories', 'Understand binomial nomenclature'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    }
  ]
};

// Class 12
export const class12Data: NCERTClass = {
  id: 'class-12',
  className: 'Class 12',
  classNumber: 12,
  ageGroup: '17-18 years',
  description: 'Final preparation for board exams and higher education entrance',
  icon: 'BookOpen',
  color: 'bg-rose-500',
  gradient: 'from-rose-400 to-red-500',
  subjects: [
    {
      id: 'eng-12',
      name: 'English',
      code: 'ENG',
      description: 'Advanced literature and language skills',
      icon: 'Languages',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      totalChapters: 8,
      board: 'NCERT',
      chapters: [
        {
          id: 'eng-12-ch1',
          chapterNumber: 1,
          title: 'The Last Lesson',
          description: 'A story by Alphonse Daudet about language and identity',
          estimatedTime: 90,
          keyPoints: ['Historical context', 'Theme of linguistic identity', 'Political symbolism'],
          topics: [
            {
              id: 'eng-12-ch1-t1',
              title: 'Historical Context',
              description: 'Understanding the Franco-Prussian War background',
              learningObjectives: ['Relate the story to its historical context', 'Understand the significance of language in national identity'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'eng-12-ch1-t2',
              title: 'Thematic Analysis',
              description: 'Exploring the themes of identity and regret',
              learningObjectives: ['Analyze major themes', 'Evaluate the author\'s message'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    },
    {
      id: 'phy-12',
      name: 'Physics',
      code: 'PHY',
      description: 'Advanced physics for board exams and competitive tests',
      icon: 'Atom',
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-indigo-500',
      totalChapters: 15,
      board: 'NCERT',
      chapters: [
        {
          id: 'phy-12-ch1',
          chapterNumber: 1,
          title: 'Electric Charges and Fields',
          description: 'Understanding electric charges and their interactions',
          estimatedTime: 90,
          keyPoints: ['Electric charge', 'Coulomb\'s law', 'Electric field'],
          topics: [
            {
              id: 'phy-12-ch1-t1',
              title: 'Electric Charges',
              description: 'Understanding basic properties of electric charges',
              learningObjectives: ['Explain properties of electric charges', 'Apply conservation of charge'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'phy-12-ch1-t2',
              title: 'Electric Field',
              description: 'Understanding electric field and its applications',
              learningObjectives: ['Calculate electric field due to various charge distributions', 'Solve numerical problems'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    },
    {
      id: 'chem-12',
      name: 'Chemistry',
      code: 'CHEM',
      description: 'Advanced chemistry for science and medical aspirants',
      icon: 'FlaskConical',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-teal-500',
      totalChapters: 16,
      board: 'NCERT',
      chapters: [
        {
          id: 'chem-12-ch1',
          chapterNumber: 1,
          title: 'The Solid State',
          description: 'Understanding the solid state of matter',
          estimatedTime: 90,
          keyPoints: ['Crystal structures', 'Packing in solids', 'Imperfections in solids'],
          topics: [
            {
              id: 'chem-12-ch1-t1',
              title: 'Crystal Structures',
              description: 'Understanding different types of crystal structures',
              learningObjectives: ['Identify various crystal systems', 'Calculate packing efficiency'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'chem-12-ch1-t2',
              title: 'Imperfections in Solids',
              description: 'Understanding defects in crystal structures',
              learningObjectives: ['Identify types of point defects', 'Understand their effects on properties'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    },
    {
      id: 'math-12',
      name: 'Mathematics',
      code: 'MATH',
      description: 'Advanced mathematics for engineering and science aspirants',
      icon: 'Calculator',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
      totalChapters: 13,
      board: 'NCERT',
      chapters: [
        {
          id: 'math-12-ch1',
          chapterNumber: 1,
          title: 'Relations and Functions',
          description: 'Understanding mathematical relations and functions',
          estimatedTime: 90,
          keyPoints: ['Types of relations', 'Functions and their properties', 'Composition of functions'],
          topics: [
            {
              id: 'math-12-ch1-t1',
              title: 'Relations',
              description: 'Understanding relations and their types',
              learningObjectives: ['Define relations', 'Identify equivalence relations'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'math-12-ch1-t2',
              title: 'Functions',
              description: 'Understanding functions and their operations',
              learningObjectives: ['Identify injective, surjective, and bijective functions', 'Perform composition of functions'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    },
    {
      id: 'bio-12',
      name: 'Biology',
      code: 'BIO',
      description: 'Advanced biology for medical aspirants',
      icon: 'Microscope',
      color: 'bg-emerald-500',
      gradient: 'from-emerald-400 to-green-500',
      totalChapters: 16,
      board: 'NCERT',
      chapters: [
        {
          id: 'bio-12-ch1',
          chapterNumber: 1,
          title: 'Reproduction in Organisms',
          description: 'Understanding the process of reproduction in various organisms',
          estimatedTime: 90,
          keyPoints: ['Asexual reproduction', 'Sexual reproduction', 'Reproductive patterns'],
          topics: [
            {
              id: 'bio-12-ch1-t1',
              title: 'Asexual Reproduction',
              description: 'Understanding various methods of asexual reproduction',
              learningObjectives: ['Identify methods of asexual reproduction', 'Understand their advantages and disadvantages'],
              difficulty: 'Hard',
              estimatedTime: 45
            },
            {
              id: 'bio-12-ch1-t2',
              title: 'Sexual Reproduction',
              description: 'Understanding the process of sexual reproduction',
              learningObjectives: ['Describe the process of gametogenesis', 'Understand fertilization and embryo development'],
              difficulty: 'Hard',
              estimatedTime: 45
            }
          ]
        }
      ]
    }
  ]
};

export const additionalClassesData = [
  class2Data,
  class3Data,
  class4Data,
  class5Data,
  class7Data,
  class8Data,
  class9Data,
  class11Data,
  class12Data
];