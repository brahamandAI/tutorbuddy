// Integration of enhanced NCERT data with existing implementation
import { ncertData, NCERTClass, NCERTSubject, NCERTChapter } from './ncertData';
import { 
  class2Data, 
  class3Data, 
  class4Data, 
  class5Data, 
  class7Data, 
  class8Data, 
  class9Data, 
  class11Data, 
  class12Data,
  additionalClassesData
} from './ncertAdditionalClasses';

// Combine existing and additional classes
export const completeNcertData: NCERTClass[] = [
  ...ncertData,
  ...additionalClassesData
];

// Sort the classes by classNumber for consistent display
export const sortedCompleteNcertData: NCERTClass[] = [...completeNcertData]
  .sort((a, b) => a.classNumber - b.classNumber);

// Export a function to use the complete data
export function getCompleteClassData(classNumber: number): NCERTClass | undefined {
  return sortedCompleteNcertData.find(cls => cls.classNumber === classNumber);
}

export function getCompleteSubjectData(classNumber: number, subjectCode: string): NCERTSubject | undefined {
  const classData = getCompleteClassData(classNumber);
  return classData?.subjects.find(subject => subject.code === subjectCode);
}

export function getCompleteChapterData(classNumber: number, subjectCode: string, chapterId: string): NCERTChapter | undefined {
  const subjectData = getCompleteSubjectData(classNumber, subjectCode);
  return subjectData?.chapters.find(chapter => chapter.id === chapterId);
}

export function getAllCompleteClasses(): NCERTClass[] {
  return sortedCompleteNcertData;
}