'use client';

import React, { useState } from 'react';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { TextArea } from '../ui/TextArea';
import { postJSON, postForm } from '@/lib/apiClient';

// Types
export type BattleSubject = 'Class 10 Science' | 'Class 10 Math' | 'Competitive' | 'Custom';
export type BattleStatus = 'pending' | 'active' | 'completed';

export interface Battle {
  id: string;
  subject: BattleSubject;
  questions: Array<{ q: string; options: string[]; answerIndex: number; explanation?: string }>;
  status: BattleStatus;
  challenger: string;
  opponent: string;
  xp: number;
  winner?: string;
  battleCode: string;
  createdAt?: string;
  challengerScore?: number;
  opponentScore?: number;
  currentQuestion?: number;
  timeLimit?: number;
}

export interface LeaderboardEntry {
  user: string;
  xp: number;
  wins: number;
  streak: number;
}

const subjects: BattleSubject[] = [
  'Class 10 Science',
  'Class 10 Math',
  'Competitive',
  'Custom',
];

interface DoubtBattleProps {
  showTitle?: boolean;
  contextText?: string;
}

export const DoubtBattle = ({ showTitle = true, contextText = '' }: DoubtBattleProps) => {
  const { currentTool, closeTool, selectedText, questionId, saveToolResult, getToolResult, onToolUsed } = useLearningTools();
  const [tab, setTab] = useState<'start' | 'join' | 'leaderboard' | 'play'>('start');
  // Start Battle
  const [friend, setFriend] = useState('');
  const [subject, setSubject] = useState<BattleSubject>('Class 10 Science');
  const [numQ, setNumQ] = useState(5);
  const [startLoading, setStartLoading] = useState(false);
  const [battleCode, setBattleCode] = useState('');
  const [startResult, setStartResult] = useState<Battle | null>(null);
  // Join Battle
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinResult, setJoinResult] = useState<Battle | null>(null);
  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(false);
  
  // Play Battle
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [battleComplete, setBattleComplete] = useState(false);

  // Dummy quiz preview
  const quizPreview = [
    { q: 'What is H2O?', options: ['Water', 'Oxygen', 'Hydrogen'], answerIndex: 0 },
    { q: '2+2=?', options: ['3', '4', '5'], answerIndex: 1 },
  ];

  // Start Battle handler
  const handleStartBattle = async () => {
    if (!friend.trim()) {
      alert('Please enter your friend\'s username or email');
      return;
    }
    
    setStartLoading(true);
    setStartResult(null);
    
    try {
      const result = await postJSON<any, Battle>('/api/doubt-battle/start', {
        subject,
        numQuestions: numQ,
        opponent: friend.trim()
      });
      
      setStartResult(result);
      setBattleCode(result.battleCode);
    } catch (error: any) {
      alert(`Failed to start battle: ${error.message}`);
    } finally {
      setStartLoading(false);
    }
  };

  // Join Battle handler
  const handleJoinBattle = async () => {
    if (!joinCode.trim()) {
      alert('Please enter a battle code');
      return;
    }
    
    setJoinLoading(true);
    setJoinResult(null);
    
    try {
      const result = await postJSON<any, Battle>('/api/doubt-battle/join', {
        battleCode: joinCode.trim()
      });
      
      setJoinResult(result);
    } catch (error: any) {
      alert(`Failed to join battle: ${error.message}`);
    } finally {
      setJoinLoading(false);
    }
  };

  // Load leaderboard
  const loadLeaderboard = async () => {
    setLbLoading(true);
    
    try {
      const result = await fetch('/api/doubt-battle/leaderboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (result.ok) {
        const data = await result.json();
        setLeaderboard(data);
      } else {
        console.error('Failed to load leaderboard');
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLbLoading(false);
    }
  };

  // Start playing a battle
  const startPlayingBattle = (battle: Battle) => {
    setCurrentBattle(battle);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setTimeLeft(30);
    setScore(0);
    setBattleComplete(false);
    setTab('play');
  };

  // Submit answer
  const submitAnswer = async () => {
    if (selectedAnswer === null || !currentBattle) return;
    
    const startTime = Date.now();
    const timeTaken = (Date.now() - startTime) / 1000;
    
    try {
      const result = await postJSON<any, any>('/api/doubt-battle/submit-answer', {
        battleCode: currentBattle.battleCode,
        questionIndex: currentQuestionIndex,
        selectedAnswer,
        timeTaken
      });
      
      if (result.correct) {
        setScore(prev => prev + result.score);
      }
      
      setIsAnswerSubmitted(true);
      
      // Move to next question after delay
      setTimeout(() => {
        if (result.battleComplete) {
          setBattleComplete(true);
        } else {
          setCurrentQuestionIndex(result.nextQuestion);
          setSelectedAnswer(null);
          setIsAnswerSubmitted(false);
          setTimeLeft(30);
        }
      }, 2000);
      
    } catch (error: any) {
      alert(`Failed to submit answer: ${error.message}`);
    }
  };

  // Timer effect for questions
  React.useEffect(() => {
    if (tab === 'play' && !battleComplete && !isAnswerSubmitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            if (selectedAnswer !== null) {
              submitAnswer();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [tab, battleComplete, isAnswerSubmitted, timeLeft, selectedAnswer]);

  // Auto-load leaderboard on tab switch
  React.useEffect(() => {
    if (tab === 'leaderboard') loadLeaderboard();
  }, [tab]);

  return (
    <Modal open={currentTool === 'doubtBattle'} onClose={closeTool} title="Doubt Battles – Friendly Quiz Duels">
      <div className="flex flex-col gap-2 w-full max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-2">
          <button className={`px-3 py-1 rounded ${tab === 'start' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`} onClick={() => setTab('start')}>Start Battle</button>
          <button className={`px-3 py-1 rounded ${tab === 'join' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`} onClick={() => setTab('join')}>Join Battle</button>
          <button className={`px-3 py-1 rounded ${tab === 'leaderboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`} onClick={() => setTab('leaderboard')}>Leaderboard</button>
          {currentBattle && (
            <button className={`px-3 py-1 rounded ${tab === 'play' ? 'bg-green-600 text-white' : 'bg-green-100 dark:bg-green-800'}`} onClick={() => setTab('play')}>Play Battle ⚔️</button>
          )}
        </div>
        {/* Start Battle Tab */}
        {tab === 'start' && (
          <div className="flex flex-col gap-3">
            <input className="border rounded p-2" placeholder="Friend's username/email" value={friend} onChange={e => setFriend(e.target.value)} />
            <select className="border rounded p-2" value={subject} onChange={e => setSubject(e.target.value as BattleSubject)}>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input className="border rounded p-2" type="number" min={5} max={10} value={numQ} onChange={e => setNumQ(Number(e.target.value))} />
            <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors" onClick={handleStartBattle} disabled={startLoading}>
              {startLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚔️</span>
                  Generating Questions...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  ⚔️ Start Battle
                </span>
              )}
            </button>
            {startResult && (
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-sm mt-2">
                Battle created! Code: <span className="font-bold">{battleCode}</span>
                <div className="mt-2 flex items-center gap-2">
                  <span>Share this code with your friend to join:</span>
                  <button 
                    className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm font-mono hover:bg-blue-200 dark:hover:bg-blue-800"
                    onClick={() => {
                      navigator.clipboard.writeText(battleCode);
                      alert('Battle code copied to clipboard!');
                    }}
                  >
                    {battleCode} 📋
                  </button>
                </div>
                <div className="mt-2 font-semibold">Quiz Preview:</div>
                <ul className="list-disc ml-6">
                  {startResult.questions.map((q, i) => <li key={i}>{q.q}</li>)}
                </ul>
                <button 
                  className="mt-3 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
                  onClick={() => startPlayingBattle(startResult)}
                >
                  Start Playing! ⚔️
                </button>
              </div>
            )}
          </div>
        )}
        {/* Join Battle Tab */}
        {tab === 'join' && (
          <div className="flex flex-col gap-3">
            <input className="border rounded p-2" placeholder="Enter Battle Code" value={joinCode} onChange={e => setJoinCode(e.target.value)} />
            <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors" onClick={handleJoinBattle} disabled={joinLoading}>
              {joinLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">🎯</span>
                  Joining Battle...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🎯 Join Battle
                </span>
              )}
            </button>
            {joinResult && (
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded text-sm mt-2">
                Joined battle! Subject: <span className="font-bold">{joinResult.subject}</span>
                <div className="mt-2 font-semibold">Quiz Preview:</div>
                <ul className="list-disc ml-6">
                  {joinResult.questions.map((q, i) => <li key={i}>{q.q}</li>)}
                </ul>
                <button 
                  className="mt-3 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
                  onClick={() => startPlayingBattle(joinResult)}
                >
                  Start Playing! ⚔️
                </button>
              </div>
            )}
          </div>
        )}
        {/* Leaderboard Tab */}
        {tab === 'leaderboard' && (
          <div className="flex flex-col gap-3">
            {lbLoading ? (
              <div>Loading leaderboard...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th>User</th>
                    <th>XP</th>
                    <th>Wins</th>
                    <th>Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr key={i} className={i === 0 ? 'font-bold text-blue-700 dark:text-blue-300' : ''}>
                      <td>{entry.user}</td>
                      <td>{entry.xp}</td>
                      <td>{entry.wins}</td>
                      <td>{entry.streak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {/* Play Battle Tab */}
        {tab === 'play' && currentBattle && (
          <div className="flex gap-4 max-h-[70vh]">
            {battleComplete ? (
              <div className="text-center animate-bounce w-full">
                <div className="text-3xl mb-2">🎉🏆🎉</div>
                <h3 className="text-lg font-bold mb-2 text-green-600">Battle Complete!</h3>
                <div className="text-base mb-1">Final Score:</div>
                <div className="text-2xl font-bold text-green-600 mb-3 animate-pulse">{score}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {score > 30 ? '🏆 Champion! Amazing performance!' : 
                   score > 20 ? '🥈 Great job! You\'re getting better!' : 
                   score > 10 ? '🥉 Good effort! Keep practicing!' : 
                   '💪 Nice try! Every battle makes you stronger!'}
                </div>
                <button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-4 py-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  onClick={() => setTab('start')}
                >
                  ⚔️ Start New Battle
                </button>
              </div>
                        ) : (
              <>
                {/* Left Column - Stats and Progress */}
                <div className="w-1/3 flex flex-col gap-3">
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                      style={{ width: `${((currentQuestionIndex + 1) / currentBattle.questions.length) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3 font-bold">
                    <span className="inline-block animate-pulse text-lg">⚔️</span> Progress: {currentQuestionIndex + 1}/{currentBattle.questions.length} <span className="inline-block animate-pulse text-lg">⚔️</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/40 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="text-center mb-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-bold">Question</div>
                      <div className="text-xl font-bold text-blue-600 animate-pulse">
                        {currentQuestionIndex + 1}/{currentBattle.questions.length}
                      </div>
                    </div>
                    <div className="text-center mb-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-bold">Score</div>
                      <div className="text-xl font-bold text-green-600 animate-bounce">
                        {score}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-bold">Time Left</div>
                      <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                        {timeLeft}s
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Question and Options */}
                <div className="w-2/3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2 animate-bounce">🤔💭🧠</div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                      {currentBattle.questions[currentQuestionIndex]?.q}
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                      Choose the best answer below ⬇️
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {currentBattle.questions[currentQuestionIndex]?.options.map((option, index) => (
                      <button
                        key={index}
                        className={`w-full p-3 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                          selectedAnswer === index
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-xl scale-[1.02] ring-2 ring-blue-200 dark:ring-blue-800'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-blue-400 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedAnswer(index)}
                        disabled={isAnswerSubmitted}
                      >
                        <div className="flex items-center">
                          <span className={`inline-block w-8 h-8 rounded-full border-2 border-current mr-3 text-center text-sm font-bold leading-8 transition-all duration-200 ${
                            selectedAnswer === index ? 'scale-110 animate-pulse' : ''
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-base font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {!isAnswerSubmitted && selectedAnswer !== null && (
                    <div className="text-center">
                      <button
                        className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white rounded-full px-6 py-3 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-xl text-base font-bold relative overflow-hidden group"
                        onClick={submitAnswer}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="flex items-center justify-center gap-2 relative z-10">
                          <span className="animate-bounce text-xl">🚀</span>
                          Submit Answer
                          <span className="animate-bounce text-xl">⚡</span>
                        </span>
                      </button>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-bold">
                        Lock in your answer! 💪
                      </div>
                    </div>
                  )}
                  
                  {isAnswerSubmitted && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-xl">
                      <div className="text-center">
                        <div className="text-2xl mb-2 animate-bounce">✨🎯✨</div>
                        <div className="text-sm text-blue-800 dark:text-blue-200 font-bold mb-1">
                          Answer submitted! 🚀
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Moving to next question... 💪
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}; 