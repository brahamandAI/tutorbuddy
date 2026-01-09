// NCERT Data Structure Interfaces

export interface Topic {
  id: string;
  title: string;
  content?: string;
  subtopics?: SubTopic[];
  hasQuiz?: boolean;
  hasFlashcards?: boolean;
  videoUrl?: string;
  interactiveElements?: InteractiveElement[];
}

export interface SubTopic {
  id: string;
  title: string;
  content?: string;
  hasQuiz?: boolean;
  hasFlashcards?: boolean;
  videoUrl?: string;
  interactiveElements?: InteractiveElement[];
}

export interface InteractiveElement {
  type: 'diagram' | 'animation' | 'experiment' | 'exercise' | 'simulation';
  title: string;
  description?: string;
  url?: string;
  data?: any;
}

export interface Chapter {
  number: number;
  title: string;
  description?: string;
  learningObjectives?: string[];
  topics: Topic[];
  keyTerms?: { term: string; definition: string }[];
  timeEstimate?: number; // in minutes
  difficulty?: 'easy' | 'medium' | 'hard';
  hasQuiz: boolean;
  hasFlashcards: boolean;
  progress?: number; // 0-100
  iconUrl?: string;
}

export interface Subject {
  code: string;
  name: string;
  description?: string;
  chapters: Chapter[];
  progress?: number; // 0-100
  iconUrl?: string;
  color?: string;
}

export interface Class {
  number: number;
  name: string;
  subjects: Subject[];
  progress?: number; // 0-100
}

export interface NCERTData {
  classes: Class[];
}