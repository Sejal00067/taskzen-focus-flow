
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Task, { TaskType } from './Task';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useTimer } from '@/context/TimerContext';

const TaskList: React.FC = () => {
  const { totalCompletedPomodoros } = useTimer();
  const [tasks, setTasks] = useLocalStorage<TaskType[]>('focusflow-tasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== '') {
      const newTask: TaskType = {
        id: Date.now().toString(),
        title: newTaskTitle,
        estimatedPomodoros: newTaskPomodoros,
        completedPomodoros: 0,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskPomodoros(1);
      setIsAddingTask(false);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id: string, title: string, estimatedPomodoros: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, title, estimatedPomodoros } 
        : task
    ));
  };

  const handleCompletePomodoro = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completedPomodoros: task.completedPomodoros + 1 } 
        : task
    ));
  };

  // Auto-complete a pomodoro for the first incomplete task when a session finishes
  React.useEffect(() => {
    if (totalCompletedPomodoros > 0) {
      const incompleteTask = tasks.find(task => task.completedPomodoros < task.estimatedPomodoros);
      if (incompleteTask) {
        handleCompletePomodoro(incompleteTask.id);
      }
    }
  }, [totalCompletedPomodoros]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button 
          size="sm" 
          variant={isAddingTask ? "outline" : "default"}
          onClick={() => setIsAddingTask(!isAddingTask)}
        >
          {isAddingTask ? 'Cancel' : <><Plus className="h-4 w-4 mr-1" /> Add Task</>}
        </Button>
      </div>

      {isAddingTask && (
        <div className="task-card animate-fade-in">
          <div className="flex flex-col space-y-3">
            <Input 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What are you working on?"
              className="font-medium"
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Estimated pomodoros:</span>
              <Input 
                type="number"
                min={1}
                value={newTaskPomodoros}
                onChange={(e) => setNewTaskPomodoros(Number(e.target.value))}
                className="w-16"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </div>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <Task 
              key={task.id} 
              task={task} 
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onCompletePomo={handleCompletePomodoro}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
