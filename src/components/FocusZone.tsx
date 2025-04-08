
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Trophy, CalendarDays } from 'lucide-react';
import { useTimer } from '@/context/TimerContext';
import useLocalStorage from '@/hooks/useLocalStorage';

interface FocusStats {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalFocusMinutes: number;
  dailyGoal: number;
  todayMinutes: number;
  lastUpdateDate: string;
}

const initialStats: FocusStats = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  totalFocusMinutes: 0,
  dailyGoal: 100, // Default goal: 100 minutes (4 pomodoros)
  todayMinutes: 0,
  lastUpdateDate: new Date().toDateString(),
};

const FocusZone: React.FC = () => {
  const { timerState, totalCompletedPomodoros, workDuration } = useTimer();
  const [focusStats, setFocusStats] = useLocalStorage<FocusStats>('focusflow-stats', initialStats);
  const [message, setMessage] = useState('');
  const [showTrophy, setShowTrophy] = useState(false);

  // Messages for different levels of focus
  const messages = [
    "Ready to start focusing?",
    "Great start! Keep going!",
    "You're doing well!",
    "Amazing focus today!",
    "Incredible concentration!",
    "You're on fire! Unstoppable!",
  ];

  // Check and update daily progress, streaks when pomodoros are completed
  useEffect(() => {
    if (totalCompletedPomodoros > 0) {
      const today = new Date().toDateString();
      const lastDate = focusStats.lastUpdateDate;
      
      // Check if this is a new day
      if (today !== lastDate) {
        // Reset today's minutes if it's a new day
        setFocusStats({
          ...focusStats,
          todayMinutes: workDuration,
          lastUpdateDate: today
        });
      } else {
        // Update today's minutes
        const newTodayMinutes = focusStats.todayMinutes + workDuration;
        setFocusStats({
          ...focusStats,
          todayMinutes: newTodayMinutes,
          totalFocusMinutes: focusStats.totalFocusMinutes + workDuration
        });
      }
    }
  }, [totalCompletedPomodoros]);

  // Update streaks
  useEffect(() => {
    const today = new Date().toDateString();
    
    // If we've reached the daily goal
    if (focusStats.todayMinutes >= focusStats.dailyGoal) {
      // If this is the first time reaching the goal today or it's a new day
      if (focusStats.lastCompletedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        // Check if the streak continues
        const streakContinues = focusStats.lastCompletedDate === yesterdayString;
        
        const newStreak = streakContinues ? focusStats.currentStreak + 1 : 1;
        const newLongestStreak = Math.max(newStreak, focusStats.longestStreak);
        
        setFocusStats({
          ...focusStats,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastCompletedDate: today
        });
        
        // Show trophy animation for new streak milestones
        if (newStreak > 0 && newStreak % 5 === 0) {
          setShowTrophy(true);
          setTimeout(() => setShowTrophy(false), 3000);
        }
      }
    }
  }, [focusStats.todayMinutes]);

  // Update message based on progress
  useEffect(() => {
    const dailyProgress = focusStats.todayMinutes / focusStats.dailyGoal;
    const messageIndex = Math.min(
      Math.floor(dailyProgress * messages.length),
      messages.length - 1
    );
    setMessage(messages[messageIndex]);
  }, [focusStats.todayMinutes]);

  const dailyProgress = Math.min((focusStats.todayMinutes / focusStats.dailyGoal) * 100, 100);

  return (
    <Card className="shadow-md border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Flame className="h-5 w-5 mr-2 text-accent" />
          Focus Zone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {showTrophy && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse-gentle z-10">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold">{message}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {timerState === 'work' 
                  ? "You're in a work session" 
                  : timerState === 'break' 
                    ? "You're on a break" 
                    : "Start the timer to begin"}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Today's progress</span>
                <span className="font-medium">{focusStats.todayMinutes}/{focusStats.dailyGoal} min</span>
              </div>
              <Progress value={dailyProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-secondary rounded-lg">
                <div className="flex justify-center items-center text-primary mb-1">
                  <Flame className="h-4 w-4 mr-1" />
                </div>
                <div className="text-2xl font-bold">{focusStats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              
              <div className="text-center p-3 bg-secondary rounded-lg">
                <div className="flex justify-center items-center text-primary mb-1">
                  <CalendarDays className="h-4 w-4 mr-1" />
                </div>
                <div className="text-2xl font-bold">{Math.floor(focusStats.totalFocusMinutes / 60)}</div>
                <div className="text-xs text-muted-foreground">Total Hours</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusZone;
