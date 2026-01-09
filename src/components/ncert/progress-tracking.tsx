'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, BarChart3, Trophy, Calendar, BookOpen, Zap, Target, Award, TrendingUp, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Interface for progress data
interface ProgressData {
  userId: string;
  chapterId: string;
  topicId: string;
  completed: boolean;
  timeSpent: number; // in minutes
  lastAccessedAt: Date;
  quizScore?: number;
}

// Component for displaying progress in a class
export function ClassProgressTracker({ 
  classNumber, 
  classProgress = { completed: 0, total: 0 }
}: { 
  classNumber: number;
  classProgress?: { completed: number; total: number };
}) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample badges for demonstration
  const badges = [
    { id: 'streak-7', name: '7-Day Streak', icon: Calendar, color: 'bg-blue-500', achieved: true },
    { id: 'perfect-quiz', name: 'Perfect Quiz', icon: Target, color: 'bg-green-500', achieved: true },
    { id: 'chapter-master', name: 'Chapter Master', icon: BookOpen, color: 'bg-purple-500', achieved: false },
    { id: 'fast-learner', name: 'Fast Learner', icon: Zap, color: 'bg-yellow-500', achieved: true },
    { id: 'math-wizard', name: 'Math Wizard', icon: Award, color: 'bg-pink-500', achieved: false },
    { id: 'consistent', name: 'Consistent Learner', icon: TrendingUp, color: 'bg-indigo-500', achieved: true },
  ];
  
  // Calculate progress percentage
  const progressPercentage = classProgress.total > 0 
    ? Math.round((classProgress.completed / classProgress.total) * 100) 
    : 0;
  
  // Sample recent activity data
  const recentActivities = [
    { type: 'chapter', name: 'Completed "Whole Numbers" Chapter', date: '2 days ago', icon: CheckCircle, color: 'text-green-500' },
    { type: 'quiz', name: 'Scored 90% on "Factors and Multiples" Quiz', date: '3 days ago', icon: Target, color: 'text-purple-500' },
    { type: 'topic', name: 'Studied "Properties of Addition"', date: '4 days ago', icon: BookOpen, color: 'text-blue-500' },
    { type: 'streak', name: 'Achieved 7-day Learning Streak', date: '1 week ago', icon: Calendar, color: 'text-orange-500' },
  ];
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white">
          <BarChart3 className="w-5 h-5 mr-2" />
          Class {classNumber} Progress
        </CardTitle>
        <CardDescription className="text-white/80">
          Track your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2.5" />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{classProgress.completed} of {classProgress.total} topics completed</span>
                <span>{classProgress.total - classProgress.completed} remaining</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">18.5h</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-2">
                  <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Quiz Score</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Subject Progress</h3>
              <div className="space-y-4">
                {['Mathematics', 'Science', 'English', 'Social Science'].map((subject, index) => {
                  const subjectProgress = [75, 60, 40, 50][index];
                  return (
                    <div key={subject} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>{subject}</span>
                        <span className="text-sm">{subjectProgress}%</span>
                      </div>
                      <Progress value={subjectProgress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map(badge => (
                <div 
                  key={badge.id}
                  className={`flex flex-col items-center p-4 rounded-lg ${
                    badge.achieved 
                      ? 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-md' 
                      : 'bg-gray-100 dark:bg-gray-800/50 opacity-60'
                  }`}
                >
                  <div className={`${badge.color} ${badge.achieved ? 'opacity-100' : 'opacity-50'} w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
                    <badge.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-center font-medium">{badge.name}</span>
                  {badge.achieved ? (
                    <Badge variant="secondary" className="mt-2">Achieved</Badge>
                  ) : (
                    <Badge variant="outline" className="mt-2 opacity-60">Locked</Badge>
                  )}
                </div>
              ))}
            </div>
            
            {user && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 dark:bg-amber-800 rounded-full p-2">
                    <Crown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Achieve 'Full Master' Badge</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Complete all chapters with at least 90% quiz scores</p>
                    <Progress value={65} className="h-1.5 mt-2" />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`mt-0.5 ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              View Full History
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Component for displaying topic progress
export function TopicProgressTracker({
  chapterId,
  topicId,
  onProgressUpdate
}: {
  chapterId: string;
  topicId: string;
  onProgressUpdate?: (progress: ProgressData) => void;
}) {
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Start timer when component mounts
  useEffect(() => {
    if (!user) return;
    
    // Start a timer to track time spent
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute
    
    setTimer(interval);
    
    // Load saved progress if available
    const savedProgress = localStorage.getItem(`progress-${user.id}-${chapterId}-${topicId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setIsCompleted(progress.completed);
      setTimeSpent(progress.timeSpent);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      
      // Save progress on unmount
      saveProgress();
    };
  }, [user, chapterId, topicId]);
  
  // Save progress to local storage (in a real app, this would save to a database)
  const saveProgress = () => {
    if (!user) return;
    
    const progress: ProgressData = {
      userId: user.id,
      chapterId,
      topicId,
      completed: isCompleted,
      timeSpent,
      lastAccessedAt: new Date()
    };
    
    localStorage.setItem(`progress-${user.id}-${chapterId}-${topicId}`, JSON.stringify(progress));
    
    if (onProgressUpdate) {
      onProgressUpdate(progress);
    }
  };
  
  // Mark topic as completed
  const markAsCompleted = () => {
    setIsCompleted(true);
    saveProgress();
  };
  
  return (
    <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Time spent: {timeSpent} min
            </span>
          </div>
          
          {isCompleted ? (
            <Badge className="bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          ) : (
            <Button size="sm" onClick={markAsCompleted}>
              Mark as Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Progress context provider that would be used in a real implementation
// This is a simplified version for the demo
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<ProgressData[]>([]);
  
  // Load progress from local storage on mount
  useEffect(() => {
    if (!user) return;
    
    // In a real app, this would fetch from an API
    const loadProgress = () => {
      const progress: ProgressData[] = [];
      
      // Iterate through localStorage to find all progress items for this user
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`progress-${user.id}`)) {
          const item = localStorage.getItem(key);
          if (item) {
            progress.push(JSON.parse(item));
          }
        }
      }
      
      setUserProgress(progress);
    };
    
    loadProgress();
  }, [user]);
  
  // Update progress
  const updateProgress = (progress: ProgressData) => {
    setUserProgress(prev => {
      const index = prev.findIndex(p => 
        p.userId === progress.userId && 
        p.chapterId === progress.chapterId && 
        p.topicId === progress.topicId
      );
      
      if (index >= 0) {
        const newProgress = [...prev];
        newProgress[index] = progress;
        return newProgress;
      } else {
        return [...prev, progress];
      }
    });
    
    // In a real app, this would save to an API
    localStorage.setItem(
      `progress-${progress.userId}-${progress.chapterId}-${progress.topicId}`, 
      JSON.stringify(progress)
    );
  };
  
  // Get progress for a specific topic
  const getTopicProgress = (chapterId: string, topicId: string): ProgressData | undefined => {
    return userProgress.find(p => 
      p.userId === user?.id && 
      p.chapterId === chapterId && 
      p.topicId === topicId
    );
  };
  
  // Get chapter completion percentage
  const getChapterProgress = (chapterId: string, totalTopics: number): number => {
    const completedTopics = userProgress.filter(p => 
      p.userId === user?.id && 
      p.chapterId === chapterId && 
      p.completed
    ).length;
    
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };
  
  return (
    <div>{children}</div>
  );
}