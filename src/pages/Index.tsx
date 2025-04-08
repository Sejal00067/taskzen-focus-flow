
import React from 'react';
import Header from '@/components/Header';
import Timer from '@/components/Timer';
import TaskList from '@/components/TaskList';
import FocusZone from '@/components/FocusZone';
import { TimerProvider } from '@/context/TimerContext';

const Index = () => {
  return (
    <TimerProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Header />
          <main className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Timer />
                <TaskList />
              </div>
              <div>
                <FocusZone />
              </div>
            </div>
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground">
            <p>FocusFlow - Your Customizable Task Timer</p>
          </footer>
        </div>
      </div>
    </TimerProvider>
  );
};

export default Index;
