'use client'

import { useState, useEffect } from 'react'
import {
  Brain,
  Sparkles,
  Target,
  CheckCircle,
  XCircle,
  Shuffle,
  Loader2,
  Trophy,
  Star,
  Zap,
  BookOpen,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface InteractiveLearningHubProps {
  summary: {
    pages: number[]
    summary: string
    timestamp: string
  }
  subject?: string
  pdfPath?: string
  className?: string
}

interface MatchPair {
  id: string
  left: string
  right: string
}

interface FillInBlank {
  id: string
  sentence: string
  blank: string
  options: string[]
  correctAnswer: string
}

interface ExerciseData {
  matchPairs: MatchPair[]
  fillInBlanks: FillInBlank[]
}

export default function InteractiveLearningHub({
  summary,
  subject = 'general',
  pdfPath = '',
  className = ''
}: InteractiveLearningHubProps) {
  const [activeTab, setActiveTab] = useState<'match' | 'fill'>('match')
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<ExerciseData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Match-the-Following state
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({})
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [shuffledRight, setShuffledRight] = useState<MatchPair[]>([])
  const [matchScore, setMatchScore] = useState(0)
  const [matchCompleted, setMatchCompleted] = useState(false)
  const [wrongMatch, setWrongMatch] = useState<string | null>(null) // For showing incorrect match feedback

  // Fill-in-the-Blanks state
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({})
  const [fillScore, setFillScore] = useState(0)
  const [fillCompleted, setFillCompleted] = useState(false)
  const [showFillResults, setShowFillResults] = useState(false)

  // Reset everything when summary changes
  useEffect(() => {
    resetAllStates()
    loadExercises()
  }, [summary.timestamp, summary.pages.join(',')])

  const resetAllStates = () => {
    setMatchedPairs({})
    setSelectedLeft(null)
    setMatchScore(0)
    setMatchCompleted(false)
    setWrongMatch(null)
    setFillAnswers({})
    setFillScore(0)
    setFillCompleted(false)
    setShowFillResults(false)
    setError(null)
  }

  const loadExercises = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/learning/generate-exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: summary.summary,
          pages: summary.pages,
          subject: subject,
          pdfPath: pdfPath
        })
      })

      if (response.ok) {
        const data = await response.json()
        setExercises(data)
        
        // Shuffle right side for matching
        if (data.matchPairs && data.matchPairs.length > 0) {
          const shuffled = [...data.matchPairs].sort(() => Math.random() - 0.5)
          setShuffledRight(shuffled)
        }
      } else {
        setError('Failed to generate exercises. Please try again.')
      }
    } catch (err) {
      console.error('Error loading exercises:', err)
      setError('An error occurred while generating exercises.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMatchClick = (leftId: string, rightId: string | null) => {
    if (matchCompleted) return

    // If clicking on the left column
    if (rightId === null) {
      // Toggle selection
      if (selectedLeft === leftId) {
        setSelectedLeft(null)
      } else {
        setSelectedLeft(leftId)
      }
      return
    }

    // If clicking on the right column with a left item selected
    if (selectedLeft) {
      // Check if match is correct
      const leftItem = exercises?.matchPairs.find(p => p.id === selectedLeft)
      const rightItem = exercises?.matchPairs.find(p => p.id === rightId)

      if (leftItem?.id === rightItem?.id) {
        // Correct match!
        setMatchedPairs(prev => ({ ...prev, [selectedLeft]: rightId }))
        setMatchScore(prev => prev + 1)
        
        // Check if all matched
        const newMatchedCount = Object.keys(matchedPairs).length + 1
        if (newMatchedCount === exercises?.matchPairs.length) {
          setMatchCompleted(true)
        }
      } else {
        // Wrong match - show feedback
        setWrongMatch(rightId)
        setTimeout(() => setWrongMatch(null), 500) // Clear after animation
      }
      
      // Reset selection after attempt (correct or incorrect)
      setSelectedLeft(null)
    }
  }

  const resetMatch = () => {
    setMatchedPairs({})
    setSelectedLeft(null)
    setMatchScore(0)
    setMatchCompleted(false)
    setWrongMatch(null)
    if (exercises?.matchPairs) {
      const shuffled = [...exercises.matchPairs].sort(() => Math.random() - 0.5)
      setShuffledRight(shuffled)
    }
  }

  const handleFillAnswer = (questionId: string, answer: string) => {
    if (showFillResults) return
    setFillAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const checkFillAnswers = () => {
    if (!exercises?.fillInBlanks) return

    let correct = 0
    exercises.fillInBlanks.forEach(q => {
      if (fillAnswers[q.id] === q.correctAnswer) {
        correct++
      }
    })

    setFillScore(correct)
    setShowFillResults(true)
    setFillCompleted(correct === exercises.fillInBlanks.length)
  }

  const resetFill = () => {
    setFillAnswers({})
    setFillScore(0)
    setFillCompleted(false)
    setShowFillResults(false)
  }

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50 p-8 ${className}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4 animate-pulse">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Generating Interactive Exercises...
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            AI is creating personalized learning activities based on your summary
          </p>
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mx-auto" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-700 p-6 ${className}`}>
        <div className="flex items-center space-x-3 text-red-700 dark:text-red-300">
          <XCircle className="h-6 w-6" />
          <div>
            <p className="font-semibold">Error Loading Exercises</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <Button onClick={loadExercises} className="mt-4" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  if (!exercises) return null

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Target className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Interactive Learning Hub</h3>
                <p className="text-indigo-100 text-sm">
                  Practice with AI-generated exercises
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">AI Tutor Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('match')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'match'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <Shuffle className="h-4 w-4" />
            <span>Match the Following</span>
            {matchCompleted && <CheckCircle className="h-4 w-4 text-green-300" />}
          </button>
          <button
            onClick={() => setActiveTab('fill')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'fill'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Fill in the Blanks</span>
            {fillCompleted && <CheckCircle className="h-4 w-4 text-green-300" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'match' ? (
          <MatchTheFollowingModule
            pairs={exercises.matchPairs}
            shuffledRight={shuffledRight}
            matchedPairs={matchedPairs}
            selectedLeft={selectedLeft}
            score={matchScore}
            completed={matchCompleted}
            wrongMatch={wrongMatch}
            onMatchClick={handleMatchClick}
            onReset={resetMatch}
          />
        ) : (
          <FillInBlanksModule
            questions={exercises.fillInBlanks}
            answers={fillAnswers}
            score={fillScore}
            completed={fillCompleted}
            showResults={showFillResults}
            onAnswer={handleFillAnswer}
            onCheck={checkFillAnswers}
            onReset={resetFill}
          />
        )}
      </div>
    </div>
  )
}

// Match the Following Module Component
function MatchTheFollowingModule({
  pairs,
  shuffledRight,
  matchedPairs,
  selectedLeft,
  score,
  completed,
  wrongMatch,
  onMatchClick,
  onReset
}: any) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            Match the terms with their definitions
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click on items from both columns to match them
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {score}/{pairs.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Matched</div>
          </div>
          <Button onClick={onReset} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {completed && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <h5 className="font-bold text-green-800 dark:text-green-300 text-lg">
                Perfect Score! 🎉
              </h5>
              <p className="text-sm text-green-700 dark:text-green-400">
                You've matched all pairs correctly. Great job!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <ArrowRight className="h-4 w-4 mr-2" />
            Terms / Questions
          </div>
          {pairs.map((pair: MatchPair) => {
            const isMatched = matchedPairs[pair.id]
            const isSelected = selectedLeft === pair.id
            
            return (
              <button
                key={pair.id}
                onClick={() => !isMatched && onMatchClick(pair.id, null)}
                disabled={isMatched}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                  isMatched
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500 cursor-default'
                    : isSelected
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {pair.left}
                  </span>
                  {isMatched && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <ArrowRight className="h-4 w-4 mr-2" />
            Answers / Definitions
          </div>
          {shuffledRight.map((pair: MatchPair) => {
            const isMatched = Object.values(matchedPairs).includes(pair.id)
            const isWrong = wrongMatch === pair.id
            
            return (
              <button
                key={pair.id}
                onClick={() => selectedLeft && !isMatched && onMatchClick(selectedLeft, pair.id)}
                disabled={!selectedLeft || isMatched}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                  isMatched
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500 cursor-default'
                    : isWrong
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-500 animate-shake'
                    : selectedLeft && !isMatched
                    ? 'bg-white dark:bg-gray-700 border-purple-300 dark:border-purple-600 hover:border-purple-500 hover:shadow-md cursor-pointer'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {pair.right}
                  </span>
                  {isMatched && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {isWrong && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedLeft && (
        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg text-center">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            Now select the matching answer from the right column
          </p>
        </div>
      )}
    </div>
  )
}

// Fill in the Blanks Module Component
function FillInBlanksModule({
  questions,
  answers,
  score,
  completed,
  showResults,
  onAnswer,
  onCheck,
  onReset
}: any) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            Complete the sentences
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select the correct word to fill in each blank
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {showResults && (
            <div className="text-center bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {score}/{questions.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Correct</div>
            </div>
          )}
          <Button onClick={onReset} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {completed && showResults && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <h5 className="font-bold text-green-800 dark:text-green-300 text-lg">
                Perfect Score! 🎉
              </h5>
              <p className="text-sm text-green-700 dark:text-green-400">
                All answers are correct. Excellent work!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question: FillInBlank, index: number) => {
          const userAnswer = answers[question.id]
          const isCorrect = showResults && userAnswer === question.correctAnswer
          const isWrong = showResults && userAnswer && userAnswer !== question.correctAnswer

          return (
            <div
              key={question.id}
              className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : isWrong
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {index + 1}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                  {question.sentence.split('____').map((part, i) => (
                    <span key={i}>
                      {part}
                      {i < question.sentence.split('____').length - 1 && (
                        <span className="inline-flex items-center">
                          <span className="mx-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg font-semibold text-indigo-700 dark:text-indigo-300">
                            {userAnswer || '____'}
                          </span>
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 ml-11">
                {question.options.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => onAnswer(question.id, option)}
                    disabled={showResults}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      showResults && option === question.correctAnswer
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300'
                        : userAnswer === option
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                    } ${showResults ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResults && option === question.correctAnswer && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {showResults && userAnswer === option && option !== question.correctAnswer && (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showResults && isWrong && (
                <div className="mt-3 ml-11 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Correct answer:</strong> {question.correctAnswer}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!showResults && (
        <div className="mt-6 text-center">
          <Button
            onClick={onCheck}
            disabled={Object.keys(answers).length !== questions.length}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Check Answers
          </Button>
          {Object.keys(answers).length < questions.length && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Answer all questions to check your results
            </p>
          )}
        </div>
      )}
    </div>
  )
}
