export type JeeExamId = 'main' | 'advanced'

export type JeeTopic = {
  title: string
  page: number
}

export type JeeDocument = {
  id: string
  exam: JeeExamId
  paperId: string
  subject: string
  title: string
  description: string
  file: string
  pageCount: number
  topics: JeeTopic[]
}

export type JeePaper = {
  id: string
  name: string
  code: string
  summary: string
  documentIds: string[]
}

export type JeeExam = {
  id: JeeExamId
  name: string
  kicker: string
  summary: string
  highlights: string[]
  papers: JeePaper[]
}

const mathsUnits: JeeTopic[] = [
  { title: 'Sets, Relations and Functions', page: 1 },
  { title: 'Complex Numbers and Quadratic Equations', page: 1 },
  { title: 'Matrices and Determinants', page: 1 },
  { title: 'Permutations and Combinations', page: 1 },
  { title: 'Binomial Theorem and its Simple Applications', page: 1 },
  { title: 'Sequence and Series', page: 1 },
  { title: 'Limit, Continuity and Differentiability', page: 1 },
  { title: 'Integral Calculus', page: 1 },
  { title: 'Differential Equations', page: 2 },
  { title: 'Coordinate Geometry', page: 2 },
  { title: 'Three Dimensional Geometry', page: 2 },
  { title: 'Vector Algebra', page: 2 },
  { title: 'Statistics and Probability', page: 2 },
  { title: 'Trigonometry', page: 2 },
]

const physicsUnits: JeeTopic[] = [
  { title: 'Units and Measurements', page: 1 },
  { title: 'Kinematics', page: 1 },
  { title: 'Laws of Motion', page: 1 },
  { title: 'Work, Energy and Power', page: 1 },
  { title: 'Rotational Motion', page: 1 },
  { title: 'Gravitation', page: 1 },
  { title: 'Properties of Solids and Liquids', page: 1 },
  { title: 'Thermodynamics', page: 2 },
  { title: 'Kinetic Theory of Gases', page: 2 },
  { title: 'Oscillations and Waves', page: 2 },
  { title: 'Electrostatics', page: 3 },
  { title: 'Current Electricity', page: 3 },
  { title: 'Magnetic Effects of Current and Magnetism', page: 3 },
  { title: 'Electromagnetic Induction and Alternating Currents', page: 3 },
  { title: 'Electromagnetic Waves', page: 4 },
  { title: 'Optics', page: 4 },
  { title: 'Dual Nature of Matter and Radiation', page: 4 },
  { title: 'Atoms and Nuclei', page: 4 },
  { title: 'Electronic Devices', page: 4 },
  { title: 'Experimental Skills', page: 4 },
]

const chemistryUnits: JeeTopic[] = [
  { title: 'Some Basic Concepts in Chemistry', page: 1 },
  { title: 'Atomic Structure', page: 1 },
  { title: 'Chemical Bonding and Molecular Structure', page: 1 },
  { title: 'Chemical Thermodynamics', page: 1 },
  { title: 'Solutions', page: 2 },
  { title: 'Equilibrium', page: 2 },
  { title: 'Redox Reactions and Electrochemistry', page: 2 },
  { title: 'Chemical Kinetics', page: 2 },
  { title: 'Classification of Elements and Periodicity in Properties', page: 3 },
  { title: 'p-Block Elements', page: 3 },
  { title: 'd- and f-Block Elements', page: 3 },
  { title: 'Coordination Compounds', page: 3 },
  { title: 'Purification and Characterisation of Organic Compounds', page: 3 },
  { title: 'Some Basic Principles of Organic Chemistry', page: 3 },
  { title: 'Hydrocarbons', page: 3 },
  { title: 'Organic Compounds Containing Halogens', page: 4 },
  { title: 'Organic Compounds Containing Oxygen', page: 4 },
  { title: 'Organic Compounds Containing Nitrogen', page: 4 },
  { title: 'Biomolecules', page: 5 },
  { title: 'Principles Related to Practical Chemistry', page: 5 },
]

const aptitudeUnits: JeeTopic[] = [
  { title: 'Awareness of persons, buildings, materials and objects', page: 1 },
  { title: 'Three-dimensional perception', page: 1 },
]

const planningUnits: JeeTopic[] = [
  { title: 'General Awareness', page: 17 },
  { title: 'Social Sciences', page: 17 },
  { title: 'Thinking Skills', page: 17 },
]

export const jeeDocuments: JeeDocument[] = [
  {
    id: 'main-complete',
    exam: 'main',
    paperId: 'overview',
    subject: 'Complete syllabus',
    title: 'JEE Main 2026 complete syllabus',
    description: 'Paper 1, Paper 2A and Paper 2B in one PDF, including Planning.',
    file: 'JEE_Main_2026_Syllabus_TutorBuddy.pdf',
    pageCount: 17,
    topics: [
      { title: 'Paper 1 · Mathematics, Physics and Chemistry', page: 1 },
      { title: 'Paper 2A · B.Arch.', page: 12 },
      { title: 'Paper 2B · B.Planning', page: 15 },
    ],
  },
  {
    id: 'main-p1-physics',
    exam: 'main',
    paperId: 'paper-1',
    subject: 'Physics',
    title: 'JEE Main Physics',
    description: 'Paper 1 (B.E. / B.Tech.) physics syllabus, units 1 to 20.',
    file: '02_Paper1_BE-BTech_Physics.pdf',
    pageCount: 4,
    topics: physicsUnits,
  },
  {
    id: 'main-p1-chemistry',
    exam: 'main',
    paperId: 'paper-1',
    subject: 'Chemistry',
    title: 'JEE Main Chemistry',
    description: 'Physical, inorganic and organic chemistry for Paper 1.',
    file: '03_Paper1_BE-BTech_Chemistry.pdf',
    pageCount: 5,
    topics: chemistryUnits,
  },
  {
    id: 'main-p1-maths',
    exam: 'main',
    paperId: 'paper-1',
    subject: 'Mathematics',
    title: 'JEE Main Mathematics',
    description: 'Paper 1 mathematics, from sets through trigonometry.',
    file: '01_Paper1_BE-BTech_Mathematics.pdf',
    pageCount: 2,
    topics: mathsUnits,
  },
  {
    id: 'main-2a-maths',
    exam: 'main',
    paperId: 'paper-2a',
    subject: 'Mathematics',
    title: 'B.Arch. Mathematics',
    description: 'Paper 2A mathematics syllabus for B.Arch.',
    file: '04_Paper2A_BArch_Mathematics.pdf',
    pageCount: 2,
    topics: mathsUnits,
  },
  {
    id: 'main-2a-aptitude',
    exam: 'main',
    paperId: 'paper-2a',
    subject: 'Aptitude',
    title: 'B.Arch. Aptitude Test',
    description: 'Architecture awareness, visualisation and mental ability.',
    file: '05_Paper2A_BArch_Aptitude_Test.pdf',
    pageCount: 1,
    topics: aptitudeUnits,
  },
  {
    id: 'main-2a-drawing',
    exam: 'main',
    paperId: 'paper-2a',
    subject: 'Drawing',
    title: 'B.Arch. Drawing Test',
    description: 'Sketching urbanscape, landscape and rural life from memory.',
    file: '06_Paper2A_BArch_Drawing_Test.pdf',
    pageCount: 1,
    topics: [{ title: 'Sketching scenes and activities from memory', page: 1 }],
  },
  {
    id: 'main-2b-maths',
    exam: 'main',
    paperId: 'paper-2b',
    subject: 'Mathematics',
    title: 'B.Planning Mathematics',
    description: 'Paper 2B mathematics syllabus for B.Planning.',
    file: '07_Paper2B_BPlanning_Mathematics.pdf',
    pageCount: 2,
    topics: mathsUnits,
  },
  {
    id: 'main-2b-aptitude',
    exam: 'main',
    paperId: 'paper-2b',
    subject: 'Aptitude',
    title: 'B.Planning Aptitude Test',
    description: 'Architecture awareness and three-dimensional perception.',
    file: '08_Paper2B_BPlanning_Aptitude_Test.pdf',
    pageCount: 1,
    topics: aptitudeUnits,
  },
  {
    id: 'main-2b-planning',
    exam: 'main',
    paperId: 'paper-2b',
    subject: 'Planning',
    title: 'B.Planning',
    description: 'General awareness, social sciences and thinking skills. Opens in the complete syllabus PDF.',
    file: 'JEE_Main_2026_Syllabus_TutorBuddy.pdf',
    pageCount: 17,
    topics: planningUnits,
  },
  {
    id: 'adv-complete',
    exam: 'advanced',
    paperId: 'overview',
    subject: 'Complete syllabus',
    title: 'JEE Advanced 2026 complete syllabus',
    description: 'Chemistry, mathematics and physics together. Same scope as JEE Advanced 2025.',
    file: '00_JEE_Advanced_2026_Full_Syllabus.pdf',
    pageCount: 16,
    topics: [
      { title: 'Chemistry', page: 1 },
      { title: 'Mathematics', page: 9 },
      { title: 'Physics', page: 13 },
    ],
  },
  {
    id: 'adv-physics',
    exam: 'advanced',
    paperId: 'pcm',
    subject: 'Physics',
    title: 'JEE Advanced Physics',
    description: 'Mechanics through modern physics, including the listed experiments.',
    file: '03_JEE_Advanced_2026_Physics.pdf',
    pageCount: 4,
    topics: [
      { title: 'General', page: 1 },
      { title: 'Mechanics', page: 1 },
      { title: 'Thermal Physics', page: 2 },
      { title: 'Electricity and Magnetism', page: 2 },
      { title: 'Electromagnetic Waves', page: 3 },
      { title: 'Optics', page: 3 },
      { title: 'Modern Physics', page: 4 },
    ],
  },
  {
    id: 'adv-chemistry',
    exam: 'advanced',
    paperId: 'pcm',
    subject: 'Chemistry',
    title: 'JEE Advanced Chemistry',
    description: 'Physical, inorganic and organic chemistry for JEE Advanced 2026.',
    file: '01_JEE_Advanced_2026_Chemistry.pdf',
    pageCount: 8,
    topics: [
      { title: 'General topics', page: 1 },
      { title: 'States of Matter: Gases and Liquids', page: 1 },
      { title: 'Atomic Structure', page: 1 },
      { title: 'Chemical Bonding and Molecular Structure', page: 1 },
      { title: 'Chemical Thermodynamics', page: 2 },
      { title: 'Chemical and Ionic Equilibrium', page: 2 },
      { title: 'Electrochemistry', page: 2 },
      { title: 'Chemical Kinetics', page: 2 },
      { title: 'Solid State', page: 3 },
      { title: 'Solutions', page: 3 },
      { title: 'Surface Chemistry', page: 3 },
      { title: 'Classification of Elements and Periodicity', page: 3 },
      { title: 'Hydrogen', page: 3 },
      { title: 's-Block Elements', page: 3 },
      { title: 'p-Block Elements', page: 4 },
      { title: 'd-Block Elements', page: 4 },
      { title: 'f-Block Elements', page: 5 },
      { title: 'Coordination Compounds', page: 5 },
      { title: 'Isolation of Metals', page: 5 },
      { title: 'Principles of Qualitative Analysis', page: 5 },
      { title: 'Environmental Chemistry', page: 5 },
      { title: 'Basic Principles of Organic Chemistry', page: 5 },
      { title: 'Alkanes', page: 6 },
      { title: 'Alkenes and Alkynes', page: 6 },
      { title: 'Benzene', page: 6 },
      { title: 'Phenols', page: 6 },
      { title: 'Alkyl Halides', page: 7 },
      { title: 'Alcohols', page: 7 },
      { title: 'Ethers', page: 7 },
      { title: 'Aldehydes and Ketones', page: 7 },
      { title: 'Carboxylic Acids', page: 7 },
      { title: 'Amines', page: 7 },
      { title: 'Haloarenes', page: 8 },
      { title: 'Biomolecules', page: 8 },
      { title: 'Polymers', page: 8 },
      { title: 'Chemistry in Everyday Life', page: 8 },
      { title: 'Practical Organic Chemistry', page: 8 },
    ],
  },
  {
    id: 'adv-maths',
    exam: 'advanced',
    paperId: 'pcm',
    subject: 'Mathematics',
    title: 'JEE Advanced Mathematics',
    description: 'Sets, algebra, calculus, geometry, probability and vectors.',
    file: '02_JEE_Advanced_2026_Mathematics.pdf',
    pageCount: 4,
    topics: [
      { title: 'Sets, Relations and Functions', page: 1 },
      { title: 'Algebra', page: 1 },
      { title: 'Matrices', page: 2 },
      { title: 'Probability and Statistics', page: 2 },
      { title: 'Trigonometry', page: 2 },
      { title: 'Analytical Geometry', page: 2 },
      { title: 'Differential Calculus', page: 3 },
      { title: 'Integral Calculus', page: 4 },
      { title: 'Vectors', page: 4 },
    ],
  },
]

export const jeeExams: JeeExam[] = [
  {
    id: 'main',
    name: 'JEE Main',
    kicker: '2026 syllabus',
    summary: 'Three papers. Pick B.E. / B.Tech., B.Arch. or B.Planning, then open the subject PDF.',
    highlights: ['Paper 1 · B.E. / B.Tech.', 'Paper 2A · B.Arch.', 'Paper 2B · B.Planning'],
    papers: [
      {
        id: 'paper-1',
        name: 'Paper 1',
        code: 'B.E. / B.Tech.',
        summary: 'Physics, Chemistry and Mathematics.',
        documentIds: ['main-p1-physics', 'main-p1-chemistry', 'main-p1-maths'],
      },
      {
        id: 'paper-2a',
        name: 'Paper 2A',
        code: 'B.Arch.',
        summary: 'Mathematics, Aptitude Test and Drawing Test.',
        documentIds: ['main-2a-maths', 'main-2a-aptitude', 'main-2a-drawing'],
      },
      {
        id: 'paper-2b',
        name: 'Paper 2B',
        code: 'B.Planning',
        summary: 'Mathematics, Aptitude Test and Planning.',
        documentIds: ['main-2b-maths', 'main-2b-aptitude', 'main-2b-planning'],
      },
    ],
  },
  {
    id: 'advanced',
    name: 'JEE Advanced',
    kicker: '2026 syllabus',
    summary: 'Same syllabus as JEE Advanced 2025. Physics, Chemistry and Mathematics, topic by topic.',
    highlights: ['Physics', 'Chemistry', 'Mathematics'],
    papers: [
      {
        id: 'pcm',
        name: 'PCM',
        code: 'Physics · Chemistry · Mathematics',
        summary: 'Open a subject, or read the full syllabus in one PDF.',
        documentIds: ['adv-physics', 'adv-chemistry', 'adv-maths'],
      },
    ],
  },
]

const byId = new Map(jeeDocuments.map((doc) => [doc.id, doc]))

export function getJeeDocument(id: string) {
  return byId.get(id) ?? null
}

export function jeePdfUrl(file: string) {
  return `/pdfs/jee/${file}`
}

export function getJeeExam(id: JeeExamId) {
  return jeeExams.find((exam) => exam.id === id) ?? null
}
