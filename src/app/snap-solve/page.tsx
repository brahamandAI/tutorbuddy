'use client';
import { LearningToolsProvider, SnapSolve, ToolsLauncher } from '@/components/learning-tools';
import { useLearningTools } from '@/components/learning-tools';
import { Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPopup } from '@/hooks/useAuthPopup';
import React from 'react';
// import Lottie from 'lottie-react';
// import snapAnimation from '@/public/animations/snap.json';

function TryNowButton() {
  const { openTool } = useLearningTools();
  const { isAuthenticated } = useAuth();
  const { openPopup } = useAuthPopup();
  return (
    <button
      onClick={() => {
        if (!isAuthenticated) {
          openPopup('login');
          return;
        }
        openTool('snapSolve');
      }}
      className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 animate-shimmer"
    >
      Try Now 🚀
    </button>
  );
}

export default function SnapSolvePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-400/30 to-blue-100 dark:from-gray-900 dark:to-blue-900 overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-600/20 rounded-full blur-2xl animate-pulse" />
      </div>
      {/* Hero */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white/30 dark:bg-blue-900/60 backdrop-blur-lg rounded-full p-8 shadow-2xl mb-4 border-4 border-blue-300 animate-float">
          {/* <Lottie animationData={snapAnimation} loop style={{ width: 80, height: 80 }} /> */}
          <Camera className="h-16 w-16 text-blue-700 dark:text-blue-200 drop-shadow-glow animate-bounce" />
        </div>
        <h1 className="text-5xl font-extrabold text-blue-900 dark:text-white mb-2 drop-shadow-glow tracking-tight">Snap & Solve</h1>
        <p className="text-xl text-blue-700 dark:text-blue-200 mb-4 text-center max-w-2xl font-semibold">
          <span className="inline-block animate-wiggle">📸</span> Click, upload, and let AI do the magic! <br />
          <span className="italic text-blue-500 dark:text-blue-300">“Homework? Solved in a snap.”</span>
        </p>
      </div>
      {/* Description Card */}
      <div className="relative z-10 bg-white/60 dark:bg-blue-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 mb-8 max-w-xl w-full flex flex-col items-center border border-blue-200 dark:border-blue-800">
        <ul className="list-disc text-blue-700 dark:text-blue-200 mb-4 pl-6 text-left w-full space-y-1">
          <li title="Upload a photo of any question">Upload any question image <span className="ml-1">🖼️</span></li>
          <li title="AI extracts text instantly">Instant text extraction <span className="ml-1">⚡</span></li>
          <li title="Get step-by-step solutions">Step-by-step solutions <span className="ml-1">🧩</span></li>
          <li title="Works for math, science, and more!">All subjects welcome <span className="ml-1">🌎</span></li>
        </ul>
        <TryNowButton />
      </div>
      {/* Tool Launcher + Tool */}
      <div id="tool" className="relative z-10 w-full flex flex-col items-center">
        <ToolsLauncher />
        <SnapSolve />
      </div>
      {/* Floating Mascot */}
      <div className="fixed bottom-8 left-8 z-20 hidden md:block animate-float">
        <span className="text-5xl">🤖</span>
        <div className="text-xs text-blue-700 dark:text-blue-200 font-bold mt-1">AI Buddy</div>
      </div>
    </div>
  );
} 