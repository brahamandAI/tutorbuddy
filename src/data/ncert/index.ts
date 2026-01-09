import { NCERTData } from './interfaces';
import { class10Science } from './class10Science';
import { class6Maths } from './class6Maths';

// Main NCERT data structure with all classes
export const ncertData: NCERTData = {
  classes: [
    {
      number: 1,
      name: 'Class 1',
      progress: 0,
      subjects: []
    },
    {
      number: 2,
      name: 'Class 2',
      progress: 0,
      subjects: []
    },
    {
      number: 3,
      name: 'Class 3',
      progress: 0,
      subjects: []
    },
    {
      number: 4,
      name: 'Class 4',
      progress: 0,
      subjects: []
    },
    {
      number: 5,
      name: 'Class 5',
      progress: 0,
      subjects: []
    },
    class6Maths,
    {
      number: 7,
      name: 'Class 7',
      progress: 0,
      subjects: []
    },
    {
      number: 8,
      name: 'Class 8',
      progress: 0,
      subjects: []
    },
    {
      number: 9,
      name: 'Class 9',
      progress: 0,
      subjects: []
    },
    class10Science,
    {
      number: 11,
      name: 'Class 11',
      progress: 0,
      subjects: []
    },
    {
      number: 12,
      name: 'Class 12',
      progress: 0,
      subjects: []
    },
  ]
};

// Helper function to find a class by number
export const getClassByNumber = (classNumber: number): typeof class6Maths | null => {
  return ncertData.classes.find(cls => cls.number === classNumber) || null;
};

// Helper function to find a subject by class number and subject code
export const getSubjectByCode = (classNumber: number, subjectCode: string) => {
  const classData = getClassByNumber(classNumber);
  if (!classData) return null;
  
  return classData.subjects.find(subject => subject.code === subjectCode) || null;
};

// Helper function to find a chapter by class number, subject code, and chapter number
export const getChapterByNumber = (classNumber: number, subjectCode: string, chapterNumber: number) => {
  const subject = getSubjectByCode(classNumber, subjectCode);
  if (!subject) return null;
  
  return subject.chapters.find(chapter => chapter.number === chapterNumber) || null;
};

// Helper function to find a topic by class number, subject code, chapter number, and topic id
export const getTopicById = (classNumber: number, subjectCode: string, chapterNumber: number, topicId: string) => {
  const chapter = getChapterByNumber(classNumber, subjectCode, chapterNumber);
  if (!chapter) return null;
  
  return chapter.topics.find(topic => topic.id === topicId) || null;
};

// Helper function to get all available classes
export const getAllClasses = () => {
  return ncertData.classes;
};

// Helper function to get all subjects for a class
export const getSubjectsForClass = (classNumber: number) => {
  const classData = getClassByNumber(classNumber);
  if (!classData) return [];
  
  return classData.subjects;
};

// Helper function to get all chapters for a subject
export const getChaptersForSubject = (classNumber: number, subjectCode: string) => {
  const subject = getSubjectByCode(classNumber, subjectCode);
  if (!subject) return [];
  
  return subject.chapters;
};

// Helper function to get all topics for a chapter
export const getTopicsForChapter = (classNumber: number, subjectCode: string, chapterNumber: number) => {
  const chapter = getChapterByNumber(classNumber, subjectCode, chapterNumber);
  if (!chapter) return [];
  
  return chapter.topics;
};

export default ncertData;