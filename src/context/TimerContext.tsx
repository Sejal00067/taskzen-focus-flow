
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

type TimerState = 'work' | 'break' | 'idle';

interface TimerContextType {
  minutes: number;
  seconds: number;
  timerState: TimerState;
  isActive: boolean;
  workDuration: number;
  breakDuration: number;
  totalCompletedPomodoros: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  setWorkDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [minutes, setMinutes] = useState(workDuration);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [totalCompletedPomodoros, setTotalCompletedPomodoros] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    if (timerState === 'work') {
      toast({
        title: "Work session completed!",
        description: "Time for a break.",
      });
      setTimerState('break');
      setMinutes(breakDuration);
      setSeconds(0);
      setTotalCompletedPomodoros(prev => prev + 1);
    } else {
      toast({
        title: "Break time's over!",
        description: "Ready to focus again?",
      });
      setTimerState('work');
      setMinutes(workDuration);
      setSeconds(0);
    }
  };

  const startTimer = () => {
    if (timerState === 'idle') {
      setTimerState('work');
    }
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    pauseTimer();
    if (timerState === 'work' || timerState === 'idle') {
      setMinutes(workDuration);
    } else {
      setMinutes(breakDuration);
    }
    setSeconds(0);
  };

  const skipTimer = () => {
    pauseTimer();
    if (timerState === 'work') {
      setTimerState('break');
      setMinutes(breakDuration);
      setTotalCompletedPomodoros(prev => prev + 1);
    } else {
      setTimerState('work');
      setMinutes(workDuration);
    }
    setSeconds(0);
  };

  const handleSetWorkDuration = (value: number) => {
    setWorkDuration(value);
    if (timerState === 'idle' || timerState === 'work') {
      setMinutes(value);
      setSeconds(0);
    }
  };

  const handleSetBreakDuration = (value: number) => {
    setBreakDuration(value);
    if (timerState === 'break') {
      setMinutes(value);
      setSeconds(0);
    }
  };

  const value = {
    minutes,
    seconds,
    timerState,
    isActive,
    workDuration,
    breakDuration,
    totalCompletedPomodoros,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setWorkDuration: handleSetWorkDuration,
    setBreakDuration: handleSetBreakDuration,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
