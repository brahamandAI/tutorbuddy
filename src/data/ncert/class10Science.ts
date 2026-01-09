import { Class, Chapter, Topic, SubTopic } from './interfaces';

// Class 10 Science - Detailed data
export const class10Science: Class = {
  number: 10,
  name: 'Class 10',
  progress: 45,
  subjects: [
    {
      code: 'science',
      name: 'Science',
      description: 'NCERT Class 10 Science covers key concepts in Physics, Chemistry and Biology',
      progress: 45,
      color: '#4CAF50',
      iconUrl: '/images/subjects/science.svg',
      chapters: [
        {
          number: 1,
          title: 'Chemical Reactions and Equations',
          description: 'Study of chemical reactions, their types and how to balance chemical equations',
          learningObjectives: [
            'Understand what chemical reactions are',
            'Learn how to write and balance chemical equations',
            'Identify different types of chemical reactions',
            'Understand oxidation and reduction'
          ],
          hasQuiz: true,
          hasFlashcards: true,
          progress: 85,
          difficulty: 'medium',
          timeEstimate: 120,
          iconUrl: '/images/chapters/chemical-reactions.svg',
          topics: [
            {
              id: '10-sci-1-1',
              title: 'Chemical Reactions',
              content: 'A chemical reaction is a process where one or more substances are converted into one or more different substances. The substances that participate in a chemical reaction are called reactants, and the substances formed are called products.',
              hasQuiz: true,
              hasFlashcards: true,
              subtopics: [
                {
                  id: '10-sci-1-1-1',
                  title: 'Characteristics of Chemical Reactions',
                  content: 'Chemical reactions are characterized by changes such as evolution of gas, change in color, change in temperature, and formation of precipitate.'
                },
                {
                  id: '10-sci-1-1-2',
                  title: 'Indicators of Chemical Reactions',
                  content: 'There are several visual indicators that a chemical reaction has occurred: change in state, change in color, evolution of a gas, change in temperature, and formation of a precipitate.'
                }
              ]
            },
            {
              id: '10-sci-1-2',
              title: 'Chemical Equations',
              content: 'A chemical equation is a symbolic representation of a chemical reaction. It shows the reactants and products, their physical states, and the direction of the reaction.',
              hasQuiz: true,
              interactiveElements: [
                {
                  type: 'exercise',
                  title: 'Balancing Chemical Equations',
                  description: 'Practice balancing different chemical equations with immediate feedback.'
                }
              ],
              subtopics: [
                {
                  id: '10-sci-1-2-1',
                  title: 'Writing Chemical Equations',
                  content: 'Chemical equations are written with reactants on the left side and products on the right side, separated by an arrow (→) that indicates the direction of the reaction.'
                },
                {
                  id: '10-sci-1-2-2',
                  title: 'Balancing Chemical Equations',
                  content: 'A balanced chemical equation has an equal number of atoms of each element on both the reactant and product sides. This follows the law of conservation of mass.',
                  hasQuiz: true,
                  interactiveElements: [
                    {
                      type: 'simulation',
                      title: 'Balancing Simulation',
                      description: 'Interactive simulation to understand the process of balancing chemical equations'
                    }
                  ]
                }
              ]
            },
            {
              id: '10-sci-1-3',
              title: 'Types of Chemical Reactions',
              content: 'Chemical reactions can be classified into different types based on the way reactants change into products.',
              hasQuiz: true,
              hasFlashcards: true,
              subtopics: [
                {
                  id: '10-sci-1-3-1',
                  title: 'Combination Reactions',
                  content: 'In a combination reaction, two or more substances combine to form a single product.'
                },
                {
                  id: '10-sci-1-3-2',
                  title: 'Decomposition Reactions',
                  content: 'In a decomposition reaction, a single compound breaks down into two or more simpler substances.'
                },
                {
                  id: '10-sci-1-3-3',
                  title: 'Displacement Reactions',
                  content: 'In a displacement reaction, a more reactive element displaces a less reactive element from its compound.'
                },
                {
                  id: '10-sci-1-3-4',
                  title: 'Double Displacement Reactions',
                  content: 'In a double displacement reaction, there is an exchange of ions between two compounds.'
                }
              ]
            },
            {
              id: '10-sci-1-4',
              title: 'Oxidation and Reduction',
              content: 'Oxidation is the gain of oxygen or loss of hydrogen or loss of electrons. Reduction is the loss of oxygen or gain of hydrogen or gain of electrons.',
              hasFlashcards: true,
              subtopics: [
                {
                  id: '10-sci-1-4-1',
                  title: 'Oxidation',
                  content: 'Oxidation is the process in which a substance gains oxygen, loses hydrogen, or loses electrons.'
                },
                {
                  id: '10-sci-1-4-2',
                  title: 'Reduction',
                  content: 'Reduction is the process in which a substance loses oxygen, gains hydrogen, or gains electrons.'
                },
                {
                  id: '10-sci-1-4-3',
                  title: 'Redox Reactions',
                  content: 'Redox reactions are reactions in which oxidation and reduction occur simultaneously.'
                }
              ]
            }
          ],
          keyTerms: [
            { term: 'Chemical Reaction', definition: 'Process where substances (reactants) are converted into new substances (products)' },
            { term: 'Balanced Equation', definition: 'Chemical equation with equal number of atoms of each element on both sides' },
            { term: 'Oxidation', definition: 'Process involving gain of oxygen, loss of hydrogen, or loss of electrons' },
            { term: 'Reduction', definition: 'Process involving loss of oxygen, gain of hydrogen, or gain of electrons' },
            { term: 'Redox Reaction', definition: 'Reaction where both oxidation and reduction occur simultaneously' }
          ]
        },
        {
          number: 2,
          title: 'Acids, Bases and Salts',
          description: 'Study of properties of acids, bases and salts and their reactions',
          hasQuiz: true,
          hasFlashcards: true,
          progress: 65,
          difficulty: 'medium',
          timeEstimate: 150,
          iconUrl: '/images/chapters/acids-bases.svg',
          topics: [
            {
              id: '10-sci-2-1',
              title: 'Acids and Bases',
              content: 'Acids are substances that taste sour and turn blue litmus red. Bases are substances that taste bitter and turn red litmus blue.',
              hasQuiz: true,
              hasFlashcards: true,
              subtopics: [
                {
                  id: '10-sci-2-1-1',
                  title: 'Properties of Acids',
                  content: 'Acids taste sour, turn blue litmus red, react with metals to form hydrogen gas, and react with bases to form salt and water.'
                },
                {
                  id: '10-sci-2-1-2',
                  title: 'Properties of Bases',
                  content: 'Bases taste bitter, turn red litmus blue, feel slippery, and react with acids to form salt and water.'
                }
              ]
            },
            {
              id: '10-sci-2-2',
              title: 'pH Scale',
              content: 'The pH scale is a measure of the acidity or basicity of a solution. It ranges from 0 to 14, with 7 being neutral.',
              hasQuiz: true,
              interactiveElements: [
                {
                  type: 'simulation',
                  title: 'pH Scale Simulator',
                  description: 'Interactive pH scale to understand acid-base measurements'
                }
              ],
              subtopics: [
                {
                  id: '10-sci-2-2-1',
                  title: 'Understanding the pH Scale',
                  content: 'The pH scale ranges from 0 to 14. Solutions with pH less than 7 are acidic, pH equal to 7 are neutral, and pH greater than 7 are basic.'
                },
                {
                  id: '10-sci-2-2-2',
                  title: 'Importance of pH in Everyday Life',
                  content: 'pH plays a crucial role in our digestive system, agriculture, and various industrial processes.'
                }
              ]
            }
          ]
        },
        {
          number: 3,
          title: 'Metals and Non-metals',
          description: 'Study of properties and reactions of metals and non-metals',
          hasQuiz: true,
          hasFlashcards: true,
          progress: 40,
          difficulty: 'hard',
          timeEstimate: 180,
          iconUrl: '/images/chapters/metals.svg',
          topics: [
            {
              id: '10-sci-3-1',
              title: 'Physical Properties of Metals',
              content: 'Metals are generally lustrous, malleable, ductile, and good conductors of heat and electricity.',
              hasFlashcards: true,
              subtopics: []
            },
            {
              id: '10-sci-3-2',
              title: 'Chemical Properties of Metals',
              content: 'Metals react with oxygen, water, acids, and other metal salts.',
              hasQuiz: true,
              subtopics: []
            }
          ]
        }
      ]
    }
  ]
};