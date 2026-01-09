// Enhanced NCERT Data for Class 6 Mathematics
// Providing more detailed content and structure for real implementation

import { NCERTClass, NCERTSubject, NCERTChapter, NCERTTopic } from './ncertData';

export const class6MathematicsEnhanced: NCERTSubject = {
  id: 'math-6',
  name: 'Mathematics',
  code: 'MATH',
  description: 'Build foundational skills in numbers, algebra, geometry, and data handling',
  icon: 'Calculator',
  color: 'bg-blue-500',
  gradient: 'from-blue-400 to-indigo-500',
  totalChapters: 14,
  board: 'NCERT',
  chapters: [
    {
      id: 'math-6-ch1',
      chapterNumber: 1,
      title: 'Knowing Our Numbers',
      description: 'Understanding place value, comparing numbers, and estimating quantities',
      estimatedTime: 120,
      keyPoints: [
        'Indian and International Number System',
        'Place values and face values',
        'Comparing numbers',
        'Shifting digits',
        'Estimation and rounding'
      ],
      topics: [
        {
          id: 'math-6-ch1-t1',
          title: 'Numbers in Daily Life',
          description: 'How we use large numbers in real-world contexts',
          learningObjectives: [
            'Identify situations where large numbers are used',
            'Read and write large numbers in daily contexts'
          ],
          difficulty: 'Easy',
          estimatedTime: 20,
          content: `
In our daily lives, we encounter large numbers in various contexts:

1. **Population**: The population of India is over 1.3 billion (1,300,000,000)
2. **Distance**: The distance from Earth to the Sun is about 150,000,000 kilometers
3. **Money**: National budgets are often in billions or trillions of rupees
4. **Data Storage**: Computer storage is measured in gigabytes (billions of bytes) or terabytes (trillions of bytes)

Being able to read, write, and understand these large numbers helps us make sense of the world around us.
          `
        },
        {
          id: 'math-6-ch1-t2',
          title: 'Indian and International Number Systems',
          description: 'Understanding different ways to group digits in large numbers',
          learningObjectives: [
            'Distinguish between Indian and International place value systems',
            'Convert numbers between the two systems',
            'Read and write numbers in both formats'
          ],
          difficulty: 'Medium',
          estimatedTime: 35,
          content: `
## Indian Number System

In the Indian number system, we group digits in a specific way:
- The rightmost three digits form one group (ones, tens, hundreds)
- The next two digits form the next group (thousands, ten thousands)
- Each subsequent group has two digits (lakhs, ten lakhs, crores, ten crores, etc.)

Example: 7,65,43,210
- 7 crores
- 65 lakhs
- 43 thousands
- 210 ones

## International Number System

In the international system, digits are grouped in threes:
- The rightmost three digits form one group (ones, tens, hundreds)
- Each subsequent group has three digits (thousands, millions, billions, etc.)

Example: 76,543,210
- 76 million
- 543 thousand
- 210 ones

## Conversion Table
Indian      | International
------------|-------------
1 lakh      | 100 thousand
10 lakh     | 1 million
1 crore     | 10 million
          `
        },
        {
          id: 'math-6-ch1-t3',
          title: 'Comparing Numbers',
          description: 'Methods to determine which of two or more numbers is larger',
          learningObjectives: [
            'Apply rules for comparing numbers',
            'Use symbols >, <, = correctly',
            'Order a set of numbers'
          ],
          difficulty: 'Easy',
          estimatedTime: 25,
          content: `
## Rules for Comparing Numbers

1. **Count the digits**: The number with more digits is larger.
   Example: 5678 > 987 (5678 has four digits, 987 has three)

2. **Compare from left to right**: If two numbers have the same number of digits, start comparing from the leftmost digit. The number with the larger digit at the first differing position is larger.
   Example: 45732 > 45389 (7 > 3 at the third position)

3. **Use symbols**:
   - ">" means "greater than" (5 > 3)
   - "<" means "less than" (2 < 7)
   - "=" means "equal to" (4 = 4)

4. **Ascending order**: Arranging numbers from smallest to largest
   Example: 342, 587, 1024 (in ascending order)

5. **Descending order**: Arranging numbers from largest to smallest
   Example: 1024, 587, 342 (in descending order)
          `
        },
        {
          id: 'math-6-ch1-t4',
          title: 'Estimation and Rounding',
          description: 'Techniques for approximating numbers to make calculations easier',
          learningObjectives: [
            'Round numbers to the nearest tens, hundreds, thousands, etc.',
            'Estimate sums, differences, products, and quotients',
            'Apply estimation in real-life situations'
          ],
          difficulty: 'Medium',
          estimatedTime: 40,
          content: `
## Rounding Numbers

Rounding makes numbers easier to work with by approximating them to a specific place value.

### Rules for Rounding:
1. Identify the place value you want to round to
2. Look at the digit to the right of this place
3. If it's 5 or more, round up; if it's less than 5, round down

### Examples:
- Rounding 738 to the nearest ten:
  Look at the ones digit (8)
  Since 8 > 5, round up: 738 → 740

- Rounding 4,362 to the nearest hundred:
  Look at the tens digit (6)
  Since 6 > 5, round up: 4,362 → 4,400

- Rounding 78,215 to the nearest thousand:
  Look at the hundreds digit (2)
  Since 2 < 5, round down: 78,215 → 78,000

## Estimation

Estimation helps us get approximate answers quickly. It's useful when:
- We don't need an exact answer
- We want to check if our exact calculation is reasonable
- We need to make quick decisions

### Estimating Calculations:
1. Round the numbers to a convenient place value
2. Perform the calculation with the rounded numbers

### Example:
To estimate 328 + 753:
- Round to the nearest hundred: 300 + 800 = 1,100
- The exact sum is 1,081, which is close to our estimate
          `
        }
      ]
    },
    {
      id: 'math-6-ch2',
      chapterNumber: 2,
      title: 'Whole Numbers',
      description: 'Properties and operations with whole numbers',
      estimatedTime: 110,
      keyPoints: [
        'Natural numbers and whole numbers',
        'Number line representation',
        'Properties of addition and multiplication',
        'Patterns in whole numbers'
      ],
      topics: [
        {
          id: 'math-6-ch2-t1',
          title: 'Natural Numbers and Whole Numbers',
          description: 'Understanding the set of counting numbers and zero',
          learningObjectives: [
            'Distinguish between natural numbers and whole numbers',
            'Represent whole numbers on a number line'
          ],
          difficulty: 'Easy',
          estimatedTime: 25,
          content: `
## Natural Numbers and Whole Numbers

**Natural Numbers**: The counting numbers 1, 2, 3, 4, 5, ...
Natural numbers are used for counting objects.

**Whole Numbers**: Natural numbers including zero: 0, 1, 2, 3, 4, 5, ...
Whole numbers include all natural numbers plus zero.

The only difference between natural numbers and whole numbers is that whole numbers include zero.

## Representation on a Number Line

A number line is a straight line with points corresponding to numbers. To represent whole numbers on a number line:
1. Draw a horizontal line
2. Mark a point as zero (0)
3. Mark equal intervals to the right for positive whole numbers
4. Label each point with the corresponding whole number

On a number line, whole numbers are arranged from left to right, with equal spacing:

0---1---2---3---4---5---6---7---8→

Properties of the whole number line:
- Numbers increase as we move right
- Each whole number has a unique position
- The distance between consecutive whole numbers is always the same
          `
        },
        {
          id: 'math-6-ch2-t2',
          title: 'Properties of Addition and Multiplication',
          description: 'Understanding the mathematical properties that apply to operations on whole numbers',
          learningObjectives: [
            'Apply closure, commutative, associative, and distributive properties',
            'Identify the identity elements for addition and multiplication',
            'Understand the role of zero and one in operations'
          ],
          difficulty: 'Medium',
          estimatedTime: 40,
          content: `
## Properties of Addition

1. **Closure Property**: The sum of any two whole numbers is always a whole number.
   Example: 5 + 7 = 12 (12 is a whole number)

2. **Commutative Property**: Changing the order of addition doesn't change the sum.
   Example: 8 + 6 = 6 + 8 = 14

3. **Associative Property**: The grouping of numbers in addition doesn't affect the sum.
   Example: (3 + 4) + 5 = 3 + (4 + 5) = 12

4. **Identity Element**: Zero is the identity element for addition. Adding zero to any number gives the number itself.
   Example: 9 + 0 = 9

## Properties of Multiplication

1. **Closure Property**: The product of any two whole numbers is always a whole number.
   Example: 6 × 4 = 24 (24 is a whole number)

2. **Commutative Property**: Changing the order of multiplication doesn't change the product.
   Example: 7 × 5 = 5 × 7 = 35

3. **Associative Property**: The grouping of numbers in multiplication doesn't affect the product.
   Example: (2 × 3) × 4 = 2 × (3 × 4) = 24

4. **Identity Element**: One is the identity element for multiplication. Multiplying any number by one gives the number itself.
   Example: 8 × 1 = 8

5. **Distributive Property**: Multiplication distributes over addition.
   Example: 3 × (4 + 5) = (3 × 4) + (3 × 5) = 12 + 15 = 27
          `
        },
        {
          id: 'math-6-ch2-t3',
          title: 'Patterns in Whole Numbers',
          description: 'Discovering and understanding sequences and patterns in whole numbers',
          learningObjectives: [
            'Identify patterns in sequences of whole numbers',
            'Continue number patterns based on observed rules',
            'Create number patterns using operations'
          ],
          difficulty: 'Medium',
          estimatedTime: 30,
          content: `
## Number Patterns

Number patterns are sequences of numbers that follow a specific rule. Recognizing and extending patterns is an important mathematical skill.

### Common Patterns:

1. **Even Numbers**: 2, 4, 6, 8, 10, ...
   Rule: Add 2 to get the next number

2. **Odd Numbers**: 1, 3, 5, 7, 9, ...
   Rule: Add 2 to get the next number

3. **Square Numbers**: 1, 4, 9, 16, 25, ...
   Rule: These are numbers obtained by multiplying a number by itself (1², 2², 3², 4², 5², ...)

4. **Triangular Numbers**: 1, 3, 6, 10, 15, ...
   Rule: These represent the number of dots needed to form a triangle with equal sides
   (1, 1+2, 1+2+3, 1+2+3+4, ...)

5. **Fibonacci Sequence**: 0, 1, 1, 2, 3, 5, 8, 13, ...
   Rule: Each number is the sum of the two preceding numbers

### Creating Patterns:

You can create patterns using operations like:
- Adding or subtracting a fixed number
- Multiplying or dividing by a fixed number
- Combining different operations

### Example:

Start with 2 and multiply by 3 each time:
2, 6, 18, 54, 162, ...

Start with 100 and subtract 7 each time:
100, 93, 86, 79, 72, ...
          `
        }
      ]
    },
    {
      id: 'math-6-ch3',
      chapterNumber: 3,
      title: 'Playing with Numbers',
      description: 'Factors, multiples, prime numbers, and divisibility tests',
      estimatedTime: 130,
      keyPoints: [
        'Factors and multiples',
        'Prime and composite numbers',
        'Tests of divisibility',
        'Prime factorization',
        'HCF and LCM'
      ],
      topics: [
        {
          id: 'math-6-ch3-t1',
          title: 'Factors and Multiples',
          description: 'Understanding the relationship between factors and multiples',
          learningObjectives: [
            'Find all factors of a number',
            'Generate multiples of a number',
            'Solve problems involving factors and multiples'
          ],
          difficulty: 'Medium',
          estimatedTime: 35
        },
        {
          id: 'math-6-ch3-t2',
          title: 'Prime and Composite Numbers',
          description: 'Classification of numbers based on their factors',
          learningObjectives: [
            'Identify prime and composite numbers',
            'Apply the Sieve of Eratosthenes to find prime numbers',
            'Understand the significance of prime numbers'
          ],
          difficulty: 'Medium',
          estimatedTime: 30
        },
        {
          id: 'math-6-ch3-t3',
          title: 'HCF and LCM',
          description: 'Methods to find Highest Common Factor and Least Common Multiple',
          learningObjectives: [
            'Calculate HCF using factorization and division methods',
            'Calculate LCM using multiples and prime factorization',
            'Understand the relationship between HCF and LCM'
          ],
          difficulty: 'Hard',
          estimatedTime: 45
        }
      ]
    },
    {
      id: 'math-6-ch4',
      chapterNumber: 4,
      title: 'Basic Geometrical Ideas',
      description: 'Introduction to points, lines, angles and basic shapes',
      estimatedTime: 110,
      keyPoints: [
        'Points, lines, line segments, and rays',
        'Angles and their types',
        'Parallel and intersecting lines',
        'Polygons and their properties'
      ],
      topics: [
        {
          id: 'math-6-ch4-t1',
          title: 'Points, Lines and Angles',
          description: 'Fundamental concepts of geometry',
          learningObjectives: [
            'Distinguish between points, lines, rays, and line segments',
            'Identify different types of angles',
            'Measure angles using a protractor'
          ],
          difficulty: 'Easy',
          estimatedTime: 40
        },
        {
          id: 'math-6-ch4-t2',
          title: 'Polygons and Curves',
          description: 'Introduction to closed shapes and curves',
          learningObjectives: [
            'Identify different types of polygons',
            'Understand the properties of polygons',
            'Distinguish between open and closed curves'
          ],
          difficulty: 'Medium',
          estimatedTime: 35
        }
      ]
    },
    {
      id: 'math-6-ch5',
      chapterNumber: 5,
      title: 'Understanding Elementary Shapes',
      description: 'Classification and measurement of angles and shapes',
      estimatedTime: 120,
      keyPoints: [
        'Measuring line segments',
        'Angles - acute, obtuse, right, straight',
        'Triangles classification',
        'Quadrilaterals and their types',
        'Polygons and regular shapes'
      ],
      topics: [
        {
          id: 'math-6-ch5-t1',
          title: 'Measuring and Classifying Angles',
          description: 'Using tools to measure angles and classifying them by size',
          learningObjectives: [
            'Measure angles using a protractor',
            'Classify angles as acute, right, obtuse, straight, or reflex',
            'Estimate the measure of angles'
          ],
          difficulty: 'Medium',
          estimatedTime: 40
        },
        {
          id: 'math-6-ch5-t2',
          title: 'Classification of Triangles',
          description: 'Types of triangles based on sides and angles',
          learningObjectives: [
            'Classify triangles based on sides (scalene, isosceles, equilateral)',
            'Classify triangles based on angles (acute, right, obtuse)',
            'Identify properties of different triangles'
          ],
          difficulty: 'Medium',
          estimatedTime: 40
        }
      ]
    }
  ]
};

export const class6EnhancedData: NCERTClass = {
  id: 'class-6',
  className: 'Class 6',
  classNumber: 6,
  ageGroup: '11-12 years',
  description: 'Foundational concepts across all subjects',
  icon: 'BookOpen',
  color: 'bg-indigo-500',
  gradient: 'from-indigo-400 to-purple-500',
  subjects: [class6MathematicsEnhanced]
};