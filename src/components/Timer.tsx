
import React from 'react';
import { Play, Pause, SkipForward, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTimer } from '@/context/TimerContext';
import { Progress } from '@/components/ui/progress';

const Timer: React.FC = () => {
  const { 
    minutes, 
    seconds, 
    timerState, 
    isActive,
    workDuration,
    breakDuration,
    startTimer, 
    pauseTimer, 
    resetTimer,
    skipTimer
  } = useTimer();

  // Calculate the total time in seconds for the current timer state
  const totalSeconds = timerState === 'work' 
    ? workDuration * 60 
    : breakDuration * 60;
    
  // Calculate the remaining time in seconds
  const remainingSeconds = minutes * 60 + seconds;
  
  // Calculate progress percentage
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  // Pad the minutes and seconds with zeros
  const displayMinutes = minutes.toString().padStart(2, '0');
  const displaySeconds = seconds.toString().padStart(2, '0');

  return (
    <Card className="shadow-md border-none">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-2">
          <div className="inline-flex items-center bg-secondary rounded-full px-4 py-1.5">
            <span className={`text-sm font-medium ${timerState === 'work' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Work
            </span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className={`text-sm font-medium ${timerState === 'break' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Break
            </span>
          </div>
        </div>
        
        <div className="timer-display">
          {displayMinutes}:{displaySeconds}
        </div>
        
        <Progress 
          value={progress} 
          className={`h-2 mb-6 ${timerState === 'break' ? 'bg-secondary [&>div]:bg-accent' : ''}`}
        />
        
        <div className="flex justify-center space-x-3">
          {isActive ? (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={pauseTimer}
              className="rounded-full h-12 w-12"
            >
              <Pause className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="icon" 
              onClick={startTimer}
              className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90"
            >
              <Play className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={resetTimer}
            className="rounded-full h-12 w-12"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={skipTimer}
            className="rounded-full h-12 w-12"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {timerState === 'work' 
            ? 'Focus on your task' 
            : 'Take a short break'}
        </div>
      </CardContent>
    </Card>
  );
};

export default Timer;
