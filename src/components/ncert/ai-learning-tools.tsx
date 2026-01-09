'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Send, Loader2, Brain, SquareStack, Book, Lightbulb } from 'lucide-react';

// Component for AI-powered flashcard generation
export function AIFlashcardGenerator({ 
  chapterContent, 
  onFlashcardsGenerated 
}: { 
  chapterContent: string;
  onFlashcardsGenerated: (flashcards: { question: string; answer: string; }[]) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [customTopic, setCustomTopic] = useState('');
  const [flashcardCount, setFlashcardCount] = useState(5);

  // Simulate flashcard generation with OpenAI API
  const generateFlashcards = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 300);
    
    try {
      // In a real implementation, this would call the OpenAI API
      // For demo purposes, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Sample flashcard generation
      const generatedFlashcards = [
        {
          question: "What are whole numbers?",
          answer: "Whole numbers are the set of natural numbers including zero: 0, 1, 2, 3, 4, 5, and so on."
        },
        {
          question: "What is the closure property of addition for whole numbers?",
          answer: "The closure property states that the sum of any two whole numbers is always a whole number."
        },
        {
          question: "What is the identity element for addition?",
          answer: "Zero (0) is the identity element for addition because adding zero to any number gives the number itself."
        },
        {
          question: "What is the commutative property of multiplication?",
          answer: "The commutative property of multiplication states that changing the order of multiplication doesn't change the product. For example, a × b = b × a."
        },
        {
          question: "What is the distributive property?",
          answer: "The distributive property states that multiplication distributes over addition. For example, a × (b + c) = (a × b) + (a × c)."
        }
      ];
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      onFlashcardsGenerated(generatedFlashcards);
      
      // Reset after completion
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error("Error generating flashcards:", error);
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white">
          <Brain className="w-5 h-5 mr-2" />
          AI Flashcard Generator
        </CardTitle>
        <CardDescription className="text-white/80">
          Create custom flashcards to help you memorize key concepts
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Topic (Optional)</label>
          <Input
            placeholder="E.g., Properties of Whole Numbers"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Flashcards</label>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFlashcardCount(prev => Math.max(3, prev - 1))}
              disabled={isGenerating || flashcardCount <= 3}
            >
              -
            </Button>
            <span className="w-8 text-center">{flashcardCount}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFlashcardCount(prev => Math.min(10, prev + 1))}
              disabled={isGenerating || flashcardCount >= 10}
            >
              +
            </Button>
          </div>
        </div>
        
        {isGenerating ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Generating flashcards...</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-gray-500 italic">
              Our AI is analyzing the chapter content and creating targeted flashcards
            </p>
          </div>
        ) : (
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={generateFlashcards}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Flashcards
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Component for AI-powered chapter summary
export function AIChapterSummary({ 
  chapterContent,
  onSummaryGenerated 
}: { 
  chapterContent: string;
  onSummaryGenerated: (summary: string) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [summaryLength, setSummaryLength] = useState('medium');

  // Simulate summary generation with OpenAI API
  const generateSummary = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 300);
    
    try {
      // In a real implementation, this would call the OpenAI API
      // For demo purposes, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Sample summary based on length
      let generatedSummary = "";
      
      if (summaryLength === 'short') {
        generatedSummary = "Whole numbers include natural numbers and zero. They have properties like closure, commutativity, associativity, and distributivity. Zero is the identity for addition, and one is the identity for multiplication.";
      } else if (summaryLength === 'medium') {
        generatedSummary = "Whole numbers consist of natural numbers (1, 2, 3, ...) and zero. These numbers have several key properties:\n\n1. Closure: Addition and multiplication of whole numbers always result in whole numbers.\n\n2. Commutativity: The order of addition or multiplication doesn't change the result.\n\n3. Associativity: The grouping of numbers in addition or multiplication doesn't affect the result.\n\n4. Identity: Zero is the identity element for addition, and one is the identity element for multiplication.\n\n5. Distributivity: Multiplication distributes over addition.\n\nThese properties form the foundation for understanding algebraic operations and patterns in mathematics.";
      } else {
        generatedSummary = "Whole numbers encompass the set of natural numbers (1, 2, 3, ...) along with zero (0). This chapter explores the fundamental properties and operations of whole numbers.\n\nKey Properties:\n\n1. Closure Property: When we add or multiply any two whole numbers, the result is always a whole number. For example, 5 + 7 = 12 and 4 × 6 = 24 are both whole numbers.\n\n2. Commutative Property: The order of operations doesn't affect the result in addition and multiplication. For example, 8 + 6 = 6 + 8 = 14 and 7 × 5 = 5 × 7 = 35.\n\n3. Associative Property: The grouping of numbers doesn't change the result in addition and multiplication. For example, (3 + 4) + 5 = 3 + (4 + 5) = 12 and (2 × 3) × 4 = 2 × (3 × 4) = 24.\n\n4. Identity Elements: Zero is the identity element for addition, meaning any number plus zero equals the number itself (9 + 0 = 9). One is the identity element for multiplication, meaning any number multiplied by one equals the number itself (8 × 1 = 8).\n\n5. Distributive Property: Multiplication distributes over addition, expressed as a × (b + c) = (a × b) + (a × c). For example, 3 × (4 + 5) = (3 × 4) + (3 × 5) = 12 + 15 = 27.\n\nNumber Patterns:\nThe chapter also explores various patterns in whole numbers, including even numbers (2, 4, 6, ...), odd numbers (1, 3, 5, ...), square numbers (1, 4, 9, 16, ...), and other sequences. Understanding these patterns helps develop mathematical reasoning and problem-solving skills.\n\nNumber Line Representation:\nWhole numbers can be visualized on a number line, where each number has a unique position. This representation helps in understanding the ordering of whole numbers and concepts like greater than and less than.\n\nThe study of whole numbers provides a foundation for more advanced mathematical concepts and is essential for everyday calculations and problem-solving.";
      }
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      onSummaryGenerated(generatedSummary);
      
      // Reset after completion
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error("Error generating summary:", error);
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white">
          <Book className="w-5 h-5 mr-2" />
          AI Chapter Summary
        </CardTitle>
        <CardDescription className="text-white/80">
          Generate a concise summary of the chapter
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Summary Length</label>
          <div className="flex space-x-2">
            <Button 
              variant={summaryLength === 'short' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSummaryLength('short')}
              disabled={isGenerating}
            >
              Short
            </Button>
            <Button 
              variant={summaryLength === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSummaryLength('medium')}
              disabled={isGenerating}
            >
              Medium
            </Button>
            <Button 
              variant={summaryLength === 'long' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSummaryLength('long')}
              disabled={isGenerating}
            >
              Detailed
            </Button>
          </div>
        </div>
        
        {isGenerating ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Generating summary...</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-gray-500 italic">
              Our AI is condensing the chapter content into a concise summary
            </p>
          </div>
        ) : (
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            onClick={generateSummary}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Summary
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Component for AI-powered doubt solving
export function AIDoubtSolver() {
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [conversation, setConversation] = useState<{role: 'user' | 'ai'; content: string}[]>([]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    // Add user question to conversation
    setConversation(prev => [...prev, {role: 'user', content: question}]);
    setIsAsking(true);
    
    try {
      // In a real implementation, this would call the OpenAI API
      // For demo purposes, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sample response based on question
      let response = "";
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes('whole number') && lowerQuestion.includes('property')) {
        response = "Whole numbers have several important properties:\n\n1. Closure Property: The sum or product of any two whole numbers is always a whole number.\n\n2. Commutative Property: The order of numbers in addition or multiplication doesn't affect the result (a + b = b + a; a × b = b × a).\n\n3. Associative Property: The grouping of numbers in addition or multiplication doesn't affect the result ((a + b) + c = a + (b + c); (a × b) × c = a × (b × c)).\n\n4. Identity Property: Zero is the identity for addition (a + 0 = a), and one is the identity for multiplication (a × 1 = a).\n\n5. Distributive Property: Multiplication distributes over addition (a × (b + c) = (a × b) + (a × c)).\n\nDo you want me to explain any of these properties in more detail?";
      } else if (lowerQuestion.includes('factor') && lowerQuestion.includes('multiple')) {
        response = "Factors and multiples are related concepts but they're different:\n\n• A factor of a number is a number that divides it exactly (without a remainder).\nFor example, the factors of 12 are 1, 2, 3, 4, 6, and 12.\n\n• A multiple of a number is the product of that number and any whole number.\nFor example, the multiples of 3 are 3, 6, 9, 12, 15, 18, and so on.\n\nNotice that 12 is a multiple of 3, and 3 is a factor of 12. This relationship always holds: if a is a factor of b, then b is a multiple of a.";
      } else if (lowerQuestion.includes('prime') && lowerQuestion.includes('compos')) {
        response = "Prime and composite numbers are classifications based on the number of factors:\n\n• A prime number has exactly two factors: 1 and itself.\nExamples: 2, 3, 5, 7, 11, 13, 17, 19, 23, etc.\n\n• A composite number has more than two factors.\nExamples: 4, 6, 8, 9, 10, 12, 14, 15, 16, etc.\n\nNote that 1 is neither prime nor composite as it has only one factor (itself).\n\nThe Sieve of Eratosthenes is a method to find all prime numbers up to a certain limit by marking the multiples of each prime number as composite.";
      } else {
        response = "I'd be happy to help with your question about \"" + question + "\". Could you provide a bit more context or be more specific about what aspect of this topic you're struggling with? That way, I can give you a more targeted explanation.";
      }
      
      // Add AI response to conversation
      setConversation(prev => [...prev, {role: 'ai', content: response}]);
      setQuestion('');
      
    } catch (error) {
      console.error("Error asking question:", error);
      setConversation(prev => [...prev, {role: 'ai', content: "I'm sorry, I encountered an error while processing your question. Please try again."}]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white">
          <Lightbulb className="w-5 h-5 mr-2" />
          AI Doubt Solver
        </CardTitle>
        <CardDescription className="text-white/80">
          Ask any question about this chapter
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-80 overflow-y-auto space-y-4">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 p-6">
              <SquareStack className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No questions yet. Ask something about this chapter!</p>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-100 dark:bg-blue-900 ml-auto text-blue-900 dark:text-blue-100'
                    : 'bg-gray-100 dark:bg-gray-700 mr-auto'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
            ))
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <TextArea
            label=""
            value={question}
            onChange={setQuestion}
            rows={3}
          />
          <Button
            className="h-full aspect-square bg-green-500 hover:bg-green-600"
            onClick={askQuestion}
            disabled={isAsking || !question.trim()}
          >
            {isAsking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for AI-powered quiz generation
export function AIQuizGenerator({ 
  chapterContent,
  onQuizGenerated 
}: { 
  chapterContent: string;
  onQuizGenerated: (questions: { id: string; question: string; options: string[]; correctAnswer: string; explanation: string; }[]) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');

  // Simulate quiz generation with OpenAI API
  const generateQuiz = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 300);
    
    try {
      // In a real implementation, this would call the OpenAI API
      // For demo purposes, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Sample quiz questions
      const generatedQuiz = [
        {
          id: 'q1',
          question: 'Which of the following is NOT a whole number?',
          options: ['0', '1', '-1', '100'],
          correctAnswer: '-1',
          explanation: 'Whole numbers consist of all natural numbers (1, 2, 3, ...) and zero. Negative numbers like -1 are not whole numbers.'
        },
        {
          id: 'q2',
          question: 'What is the identity element for addition of whole numbers?',
          options: ['0', '1', '10', 'No identity element exists'],
          correctAnswer: '0',
          explanation: 'Zero is the identity element for addition because when you add zero to any number, you get the original number back (a + 0 = a).'
        },
        {
          id: 'q3',
          question: 'Which property states that a × (b + c) = (a × b) + (a × c)?',
          options: ['Commutative property', 'Associative property', 'Distributive property', 'Closure property'],
          correctAnswer: 'Distributive property',
          explanation: 'The distributive property states that multiplication distributes over addition. For example, 3 × (4 + 5) = (3 × 4) + (3 × 5) = 12 + 15 = 27.'
        },
        {
          id: 'q4',
          question: 'If a + b = b + a for all whole numbers a and b, which property is demonstrated?',
          options: ['Commutative property', 'Associative property', 'Distributive property', 'Identity property'],
          correctAnswer: 'Commutative property',
          explanation: 'The commutative property states that the order of numbers doesn\'t affect the result in addition or multiplication. For example, 5 + 3 = 3 + 5.'
        },
        {
          id: 'q5',
          question: 'What happens when you multiply any whole number by zero?',
          options: ['You get zero', 'You get the original number', 'You get one', 'You get an undefined result'],
          correctAnswer: 'You get zero',
          explanation: 'When any number is multiplied by zero, the result is always zero. This is known as the zero property of multiplication.'
        }
      ];
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      onQuizGenerated(generatedQuiz);
      
      // Reset after completion
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error("Error generating quiz:", error);
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white">
          <SquareStack className="w-5 h-5 mr-2" />
          AI Quiz Generator
        </CardTitle>
        <CardDescription className="text-white/80">
          Generate a custom quiz to test your knowledge
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Questions</label>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setQuestionCount(prev => Math.max(3, prev - 1))}
              disabled={isGenerating || questionCount <= 3}
            >
              -
            </Button>
            <span className="w-8 text-center">{questionCount}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setQuestionCount(prev => Math.min(10, prev + 1))}
              disabled={isGenerating || questionCount >= 10}
            >
              +
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty Level</label>
          <div className="flex space-x-2">
            <Button 
              variant={difficulty === 'easy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficulty('easy')}
              disabled={isGenerating}
            >
              Easy
            </Button>
            <Button 
              variant={difficulty === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficulty('medium')}
              disabled={isGenerating}
            >
              Medium
            </Button>
            <Button 
              variant={difficulty === 'hard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficulty('hard')}
              disabled={isGenerating}
            >
              Hard
            </Button>
          </div>
        </div>
        
        {isGenerating ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Generating quiz...</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-gray-500 italic">
              Our AI is creating challenging questions based on chapter content
            </p>
          </div>
        ) : (
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            onClick={generateQuiz}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Quiz
          </Button>
        )}
      </CardContent>
    </Card>
  );
}