import { Class, Chapter, Topic, SubTopic } from './interfaces';

// Class 6 Mathematics - Detailed data
export const class6Maths: Class = {
  number: 6,
  name: 'Class 6',
  progress: 60,
  subjects: [
    {
      code: 'maths',
      name: 'Mathematics',
      description: 'NCERT Class 6 Mathematics covers foundational concepts that build a strong base for higher mathematics',
      progress: 60,
      color: '#2196F3',
      iconUrl: '/images/subjects/maths.svg',
      chapters: [
        {
          number: 1,
          title: 'Knowing Our Numbers',
          description: 'Understanding place value, comparing numbers, and estimating quantities',
          learningObjectives: [
            'Read and write large numbers up to crores',
            'Compare numbers and use place value',
            'Use estimation and rounding in problem solving',
            'Understand the basics of Indian and International number systems'
          ],
          hasQuiz: true,
          hasFlashcards: true,
          progress: 90,
          difficulty: 'easy',
          timeEstimate: 100,
          iconUrl: '/images/chapters/numbers.svg',
          topics: [
            {
              id: '6-math-1-1',
              title: 'Introduction to Large Numbers',
              content: 'In our daily lives, we come across many situations where we use large numbers. For example, the population of a city, money transactions, distances between cities, etc.',
              hasQuiz: true,
              hasFlashcards: true,
              subtopics: [
                {
                  id: '6-math-1-1-1',
                  title: 'Reading and Writing Large Numbers',
                  content: 'To read and write large numbers, we use the place value system. Each digit in a number has a place value depending on its position.'
                },
                {
                  id: '6-math-1-1-2',
                  title: 'Place Value Chart',
                  content: 'A place value chart helps us understand the value of each digit in a number based on its position.'
                }
              ]
            },
            {
              id: '6-math-1-2',
              title: 'Comparing Numbers',
              content: 'Comparing numbers involves determining which of the given numbers is greater or smaller.',
              hasQuiz: true,
              interactiveElements: [
                {
                  type: 'exercise',
                  title: 'Number Comparison',
                  description: 'Practice comparing different numbers with immediate feedback.'
                }
              ],
              subtopics: [
                {
                  id: '6-math-1-2-1',
                  title: 'Rules for Comparing Numbers',
                  content: 'When comparing two numbers, first check the number of digits. If the number of digits is the same, start comparing digits from left to right.'
                },
                {
                  id: '6-math-1-2-2',
                  title: 'Using Symbols to Compare Numbers',
                  content: 'We use symbols like > (greater than), < (less than), and = (equal to) to compare numbers.'
                }
              ]
            },
            {
              id: '6-math-1-3',
              title: 'Estimation',
              content: 'Estimation is the process of finding an approximate value that is close enough to the exact value.',
              hasFlashcards: true,
              subtopics: [
                {
                  id: '6-math-1-3-1',
                  title: 'Rounding Numbers',
                  content: 'Rounding is a type of estimation where we find a number that is easier to work with and is close to the original number.'
                },
                {
                  id: '6-math-1-3-2',
                  title: 'Estimating Sum and Difference',
                  content: 'We can estimate the sum and difference by rounding numbers to the nearest tens, hundreds, or thousands.'
                }
              ]
            }
          ],
          keyTerms: [
            { term: 'Place Value', definition: 'The value of a digit based on its position in a number' },
            { term: 'Estimation', definition: 'Finding an approximate value that is close to the exact value' },
            { term: 'Rounding', definition: 'Replacing a number with an approximate value that is easier to work with' },
            { term: 'Comparison', definition: 'Determining which of the given numbers is greater or smaller' }
          ]
        },
        {
          number: 2,
          title: 'Whole Numbers',
          description: 'Understanding properties of whole numbers and basic operations',
          hasQuiz: true,
          hasFlashcards: true,
          progress: 75,
          difficulty: 'easy',
          timeEstimate: 90,
          iconUrl: '/images/chapters/whole-numbers.svg',
          topics: [
            {
              id: '6-math-2-1',
              title: 'Natural Numbers and Whole Numbers',
              content: 'Natural numbers are counting numbers starting from 1 (1, 2, 3, ...). Whole numbers include all natural numbers and zero (0, 1, 2, 3, ...).',
              hasQuiz: true,
              subtopics: [
                {
                  id: '6-math-2-1-1',
                  title: 'Number Line',
                  content: 'A number line is a line with points corresponding to numbers. It extends infinitely in both directions.'
                },
                {
                  id: '6-math-2-1-2',
                  title: 'Successor and Predecessor',
                  content: 'The successor of a whole number is obtained by adding 1 to the number. The predecessor is obtained by subtracting 1 from the number.'
                }
              ]
            },
            {
              id: '6-math-2-2',
              title: 'Properties of Whole Numbers',
              content: 'Whole numbers follow certain properties with respect to addition, subtraction, multiplication, and division.',
              hasFlashcards: true,
              interactiveElements: [
                {
                  type: 'exercise',
                  title: 'Properties Practice',
                  description: 'Interactive exercises to understand the properties of whole numbers'
                }
              ],
              subtopics: [
                {
                  id: '6-math-2-2-1',
                  title: 'Closure Property',
                  content: 'When we add or multiply two whole numbers, the result is always a whole number.'
                },
                {
                  id: '6-math-2-2-2',
                  title: 'Commutative Property',
                  content: 'The order of numbers does not affect the result of addition and multiplication.'
                },
                {
                  id: '6-math-2-2-3',
                  title: 'Associative Property',
                  content: 'The grouping of numbers does not affect the result of addition and multiplication.'
                },
                {
                  id: '6-math-2-2-4',
                  title: 'Distributive Property',
                  content: 'Multiplication of a number by the sum of two numbers is equal to the sum of the products of the number with each of the two numbers.'
                }
              ]
            }
          ]
        },
        {
          number: 3,
          title: 'Playing with Numbers',
          description: 'Exploring factors, multiples, prime and composite numbers',
          hasQuiz: true,
          hasFlashcards: true,
          progress: 60,
          difficulty: 'medium',
          timeEstimate: 120,
          iconUrl: '/images/chapters/playing-numbers.svg',
          topics: [
            {
              id: '6-math-3-1',
              title: 'Factors and Multiples',
              content: 'A factor of a number divides the number completely without leaving a remainder. A multiple of a number is obtained by multiplying the number by any whole number.',
              hasQuiz: true,
              hasFlashcards: true,
              subtopics: [
                {
                  id: '6-math-3-1-1',
                  title: 'Finding Factors',
                  content: 'To find factors of a number, we need to find all the whole numbers that divide the number completely.'
                },
                {
                  id: '6-math-3-1-2',
                  title: 'Finding Multiples',
                  content: 'To find multiples of a number, we multiply the number by 1, 2, 3, and so on.'
                }
              ]
            },
            {
              id: '6-math-3-2',
              title: 'Prime and Composite Numbers',
              content: 'A prime number has exactly two factors: 1 and the number itself. A composite number has more than two factors.',
              hasQuiz: true,
              interactiveElements: [
                {
                  type: 'simulation',
                  title: 'Sieve of Eratosthenes',
                  description: 'Interactive simulation to find prime numbers using the Sieve of Eratosthenes method'
                }
              ],
              subtopics: [
                {
                  id: '6-math-3-2-1',
                  title: 'Identifying Prime Numbers',
                  content: 'A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers.'
                },
                {
                  id: '6-math-3-2-2',
                  title: 'Identifying Composite Numbers',
                  content: 'A composite number is a natural number greater than 1 that has factors other than 1 and itself.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};