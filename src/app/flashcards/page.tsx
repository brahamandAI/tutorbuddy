"use client"

import { useState } from 'react';

export default function FlashcardsPage() {
  const [currentCard, setCurrentCard] = useState(0);
  
  const flashcards = [
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is the largest planet?", answer: "Jupiter" }
  ];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Flashcards</h1>
      
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Question {currentCard + 1}</h2>
            <p className="text-lg mb-4">{flashcards[currentCard].question}</p>
            <p className="text-sm text-gray-600">Click to reveal answer</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={prevCard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Previous
          </button>
          <button
            onClick={nextCard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 