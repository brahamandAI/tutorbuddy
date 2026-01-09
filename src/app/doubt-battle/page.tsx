'use client';
import { LearningToolsProvider, DoubtBattle, ToolsLauncher, useLearningTools } from '@/components/learning-tools';
import { Swords } from 'lucide-react';
// import Lottie from 'lottie-react';
// import battleAnimation from '@/public/animations/battle.json';

export default function DoubtBattlePage() {
  return (
    <LearningToolsProvider questionRef="doubt-battle-page" initialText="">
      <DoubtBattlePageContent />
    </LearningToolsProvider>
  );
}

function DoubtBattlePageContent() {
  const { openTool } = useLearningTools();
  
  return (
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-400/30 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-600/20 rounded-full blur-2xl animate-pulse" />
        </div>
        {/* Hero */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white/30 dark:bg-indigo-900/60 backdrop-blur-lg rounded-full p-8 shadow-2xl mb-4 border-4 border-indigo-300 animate-float">
            {/* <Lottie animationData={battleAnimation} loop style={{ width: 80, height: 80 }} /> */}
            <Swords className="h-16 w-16 text-indigo-700 dark:text-indigo-200 drop-shadow-glow animate-bounce" />
          </div>
          <h1 className="text-5xl font-extrabold text-indigo-900 dark:text-white mb-2 drop-shadow-glow tracking-tight">Doubt Battles – Friendly Quiz Duels</h1>
          <p className="text-xl text-indigo-700 dark:text-indigo-200 mb-4 text-center max-w-2xl font-semibold">
            <span className="inline-block animate-wiggle">⚔️</span> Challenge your friends to a quiz duel, earn XP, and climb the leaderboard! <br />
            <span className="italic text-indigo-500 dark:text-indigo-300">“Battle your doubts, win the game!”</span>
          </p>
        </div>
        {/* Description Card */}
        <div className="relative z-10 bg-white/60 dark:bg-indigo-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 mb-8 max-w-xl w-full flex flex-col items-center border border-indigo-200 dark:border-indigo-800">
          <ul className="list-disc text-indigo-700 dark:text-indigo-200 mb-4 pl-6 text-left w-full space-y-1">
            <li>Challenge friends to quiz duels <span className="ml-1">👊</span></li>
            <li>Earn XP and climb the leaderboard <span className="ml-1">🏆</span></li>
            <li>Custom battles by subject <span className="ml-1">📚</span></li>
            <li>Fun, competitive, and social! <span className="ml-1">🎉</span></li>
          </ul>
          <button 
            onClick={() => openTool('doubtBattle')}
            className="mt-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200 animate-shimmer cursor-pointer"
          >
            Start a Battle ⚔️
          </button>
        </div>
        {/* Tool Launcher + Tool */}
        <div id="tool" className="relative z-10 w-full flex flex-col items-center">
          <ToolsLauncher />
          <DoubtBattle />
        </div>
        {/* Floating Mascot */}
        <div className="fixed bottom-8 left-8 z-20 hidden md:block animate-float">
          <span className="text-5xl">🐉</span>
          <div className="text-xs text-indigo-700 dark:text-indigo-200 font-bold mt-1">Battle Dragon</div>
        </div>
      </div>
    );
} 