'use client';
import React, { useState, useRef } from 'react';
import { LearningToolsProvider, useLearningTools } from '@/components/learning-tools';
import { postJSON, postForm } from '@/lib/apiClient';
import { Star, Brain, Trophy, Target, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

// Types
type QuizMode = 'files' | 'subject';
type QuizPhase = 'setup' | 'quiz' | 'results';
type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizResponse {
  questions: QuizQuestion[];
}

interface QuizResult {
  questionIndex: number;
  selectedAnswer: number;
  correct: boolean;
  timeSpent: number;
}

// Subject data
const subjects = [
  { id: 'mathematics', name: 'Mathematics', icon: '🧮', color: 'blue' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'green' },
  { id: 'english', name: 'English', icon: '📚', color: 'purple' },
  { id: 'history', name: 'History', icon: '🏛️', color: 'amber' },
  { id: 'geography', name: 'Geography', icon: '🌍', color: 'emerald' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: 'red' },
  { id: 'physics', name: 'Physics', icon: '⚛️', color: 'indigo' },
  { id: 'biology', name: 'Biology', icon: '🧬', color: 'teal' },
  { id: 'general', name: 'General Knowledge', icon: '🎓', color: 'pink' },
];

// Enhanced Micro Quiz Interface Component
function MicroQuizInterface() {
  const { selectedText, userMeta, onToolUsed } = useLearningTools();
  
  // Quiz Setup States
  const [mode, setMode] = useState<QuizMode>('subject');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quiz State
  const [phase, setPhase] = useState<QuizPhase>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File Upload Handlers
  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'docx', 'doc', 'txt', 'md'].includes(extension || '');
    });
    
    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were skipped. Only PDF, DOCX, DOC, TXT, and MD files are supported.');
    } else {
      setError(null);
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Quiz Generation
  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let res: QuizResponse;
      
      if (mode === 'files' && files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        formData.append('questionCount', questionCount.toString());
        formData.append('difficulty', difficulty);
        
        res = await postForm('/api/micro-quiz', formData);
      } else {
        const payload = {
          subject: selectedSubject,
          difficulty,
          questionCount,
          userLevel: userMeta.classLevel || 'class10'
        };
        res = await postJSON('/api/micro-quiz', payload);
      }
      
      setQuestions(res.questions);
      setUserAnswers(new Array(res.questions.length).fill(-1));
      setResults([]);
      setCurrentQuestion(0);
      setPhase('quiz');
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
      
      onToolUsed('microQuiz', { mode, selectedSubject, difficulty, questionCount }, res);
    } catch (e: any) {
      setError(e.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  // Quiz Navigation
  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
    
    const timeSpent = Date.now() - questionStartTime;
    const newResults = [...results];
    newResults[currentQuestion] = {
      questionIndex: currentQuestion,
      selectedAnswer: answerIndex,
      correct: answerIndex === questions[currentQuestion].correct,
      timeSpent
    };
    setResults(newResults);
    
    // Auto-advance after 1 second
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setQuestionStartTime(Date.now());
      } else {
        setPhase('results');
      }
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
    } else {
      setPhase('results');
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const restartQuiz = () => {
    setPhase('setup');
    setQuestions([]);
    setUserAnswers([]);
    setResults([]);
    setCurrentQuestion(0);
    setError(null);
  };

  // Calculate Results
  const score = results.filter(r => r.correct).length;
  const percentage = Math.round((score / questions.length) * 100);
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  const avgTimePerQuestion = Math.round(totalTime / questions.length);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = () => {
    if (percentage >= 90) return { text: 'Excellent!', icon: '🏆', color: 'bg-yellow-500' };
    if (percentage >= 80) return { text: 'Great!', icon: '🎉', color: 'bg-green-500' };
    if (percentage >= 70) return { text: 'Good!', icon: '👍', color: 'bg-blue-500' };
    if (percentage >= 60) return { text: 'Fair', icon: '👌', color: 'bg-yellow-500' };
    return { text: 'Keep Trying!', icon: '💪', color: 'bg-red-500' };
  };

  // Setup Phase Render
  if (phase === 'setup') {
    return (
      <div className="bg-white/80 dark:bg-pink-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-pink-200 dark:border-pink-800 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-pink-900 dark:text-white mb-2">
            Create Your Quiz ⭐
          </h2>
          <p className="text-pink-700 dark:text-pink-200">
            Generate interactive quizzes from your documents or choose a subject
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setMode('subject')}
            className={`flex-1 p-6 rounded-xl border-2 transition-all ${
              mode === 'subject'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/50'
                : 'border-pink-200 hover:border-pink-300 dark:border-pink-700'
            }`}
          >
            <Brain className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <h3 className="font-semibold text-pink-900 dark:text-pink-100">Subject-Based</h3>
            <p className="text-sm text-pink-600 dark:text-pink-300 mt-1">
              Generate quiz from curriculum topics
            </p>
          </button>
          
          <button
            onClick={() => setMode('files')}
            className={`flex-1 p-6 rounded-xl border-2 transition-all ${
              mode === 'files'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/50'
                : 'border-pink-200 hover:border-pink-300 dark:border-pink-700'
            }`}
          >
            <Target className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <h3 className="font-semibold text-pink-900 dark:text-pink-100">Document-Based</h3>
            <p className="text-sm text-pink-600 dark:text-pink-300 mt-1">
              Upload files to create custom quiz
            </p>
          </button>
        </div>

        {/* Subject Selection */}
        {mode === 'subject' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100 mb-4">
              Choose Subject
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSubject === subject.id
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/50'
                      : 'border-pink-200 hover:border-pink-300 dark:border-pink-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{subject.icon}</div>
                  <div className="text-sm font-medium text-pink-900 dark:text-pink-100">
                    {subject.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* File Upload */}
        {mode === 'files' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100 mb-4">
              Upload Documents
            </h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/50' 
                  : 'border-pink-300 hover:border-pink-400 dark:border-pink-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-4xl mb-4">📁</div>
              <div className="text-lg font-medium text-pink-900 dark:text-pink-100 mb-2">
                Drop your files here, or 
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-pink-600 hover:text-pink-700 ml-1 underline"
                >
                  browse
                </button>
              </div>
              <div className="text-sm text-pink-600 dark:text-pink-300">
                Supports PDF, DOCX, DOC, TXT, and MD files (up to 10MB each)
                <br />
                <span className="text-xs text-pink-500">✨ AI-powered document analysis for all formats!</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc,.txt,.md"
              multiple
              onChange={(e) => e.target.files && handleFileSelect(Array.from(e.target.files))}
            />

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">📄</span>
                      <div>
                        <div className="font-medium text-pink-900 dark:text-pink-100">{file.name}</div>
                        <div className="text-sm text-pink-600 dark:text-pink-300">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz Settings */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-pink-800 dark:text-pink-200 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-pink-800 dark:border-pink-600"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-800 dark:text-pink-200 mb-2">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-pink-800 dark:border-pink-600"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 mb-6">
            {error}
          </div>
        )}

        <button
          onClick={generateQuiz}
          disabled={loading || (mode === 'files' && files.length === 0)}
          className="w-full bg-pink-600 text-white rounded-lg px-6 py-4 font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Quiz...
            </div>
          ) : (
            'Generate Quiz ⭐'
          )}
        </button>
      </div>
    );
  }

  // Quiz Phase Render
  if (phase === 'quiz' && questions.length > 0) {
    const question = questions[currentQuestion];
    const hasAnswered = userAnswers[currentQuestion] !== -1;
    
    return (
      <div className="bg-white/80 dark:bg-pink-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-pink-200 dark:border-pink-800 max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-pink-700 dark:text-pink-200">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-pink-600 dark:text-pink-300">
              {score}/{currentQuestion + (hasAnswered ? 1 : 0)} correct
            </span>
          </div>
          <div className="w-full bg-pink-200 dark:bg-pink-800 rounded-full h-2">
            <div 
              className="bg-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-6">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all ";
              
              if (hasAnswered) {
                if (index === question.correct) {
                  buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200";
                } else if (index === userAnswers[currentQuestion]) {
                  buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
                } else {
                  buttonClass += "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400";
                }
              } else {
                buttonClass += "border-pink-300 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-pink-900 dark:text-pink-100";
              }

              return (
                <button
                  key={index}
                  onClick={() => !hasAnswered && selectAnswer(index)}
                  disabled={hasAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {hasAnswered && index === question.correct && (
                      <CheckCircle2 className="ml-auto h-5 w-5 text-green-600" />
                    )}
                    {hasAnswered && index === userAnswers[currentQuestion] && index !== question.correct && (
                      <XCircle className="ml-auto h-5 w-5 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {hasAnswered && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Explanation:</h4>
            <p className="text-blue-800 dark:text-blue-200">{question.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={!hasAnswered}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    );
  }

  // Results Phase Render
  if (phase === 'results') {
    const badge = getScoreBadge();
    
    return (
      <div className="bg-white/80 dark:bg-pink-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-pink-200 dark:border-pink-800 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${badge.color} text-white text-3xl mb-4`}>
            {badge.icon}
          </div>
          <h2 className="text-3xl font-bold text-pink-900 dark:text-white mb-2">
            {badge.text}
          </h2>
          <p className="text-pink-700 dark:text-pink-200">
            Quiz completed successfully!
          </p>
        </div>

        {/* Score Display */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-pink-50 dark:bg-pink-900/50 rounded-lg">
            <Trophy className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <div className={`text-3xl font-bold ${getScoreColor()}`}>
              {score}/{questions.length}
            </div>
            <div className="text-sm text-pink-600 dark:text-pink-300">Score</div>
          </div>
          
          <div className="text-center p-6 bg-pink-50 dark:bg-pink-900/50 rounded-lg">
            <Target className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <div className={`text-3xl font-bold ${getScoreColor()}`}>
              {percentage}%
            </div>
            <div className="text-sm text-pink-600 dark:text-pink-300">Accuracy</div>
          </div>
          
          <div className="text-center p-6 bg-pink-50 dark:bg-pink-900/50 rounded-lg">
            <Clock className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-pink-700 dark:text-pink-200">
              {avgTimePerQuestion}s
            </div>
            <div className="text-sm text-pink-600 dark:text-pink-300">Avg Time</div>
          </div>
        </div>

        {/* Question Review */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100 mb-4">
            Question Review
          </h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                result.correct 
                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                  : 'border-red-200 bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Question {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {result.correct ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(result.timeSpent / 1000)}s
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            New Quiz
          </button>
          
          <button
            onClick={() => setPhase('setup')}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function MicroQuizPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-pink-900 via-pink-400/30 to-pink-100 dark:from-gray-900 dark:to-pink-900 overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-pink-600/20 rounded-full blur-2xl animate-pulse" />
      </div>
      
      {/* Hero */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white/30 dark:bg-pink-900/60 backdrop-blur-lg rounded-full p-8 shadow-2xl mb-4 border-4 border-pink-300 animate-float">
          <Star className="h-16 w-16 text-pink-700 dark:text-pink-200 drop-shadow-glow animate-bounce" />
        </div>
        <h1 className="text-5xl font-extrabold text-pink-900 dark:text-white mb-6 drop-shadow-glow tracking-tight">Micro Quiz Generator</h1>
        <p className="text-xl text-pink-700 dark:text-pink-200 mb-8 text-center max-w-2xl font-semibold">
          <span className="inline-block animate-wiggle">⭐</span> Create interactive quizzes from documents or subjects! <br />
          <span className="italic text-pink-500 dark:text-pink-300">"Quiz yourself, level up fast!"</span>
        </p>
      </div>

      {/* Micro Quiz Interface */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 mb-8">
        <MicroQuizInterface />
      </div>

      {/* Floating Mascot */}
      <div className="fixed bottom-8 left-8 z-20 hidden md:block animate-float">
        <span className="text-5xl">🎯</span>
        <div className="text-xs text-pink-700 dark:text-pink-200 font-bold mt-1">Quiz Master</div>
      </div>
    </div>
  );
} 