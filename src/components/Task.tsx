
import React, { useState } from 'react';
import { Check, Trash2, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export interface TaskType {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

interface TaskProps {
  task: TaskType;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, estimatedPomodoros: number) => void;
  onCompletePomo: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, onDelete, onEdit, onCompletePomo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editEstimated, setEditEstimated] = useState(task.estimatedPomodoros);

  const handleSave = () => {
    if (editTitle.trim() !== '') {
      onEdit(task.id, editTitle, editEstimated);
      setIsEditing(false);
    }
  };

  const progress = task.estimatedPomodoros > 0 
    ? (task.completedPomodoros / task.estimatedPomodoros) * 100 
    : 0;

  if (isEditing) {
    return (
      <div className="task-card animate-fade-in">
        <div className="flex flex-col space-y-3">
          <Input 
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task name"
            className="font-medium"
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Estimated pomodoros:</span>
            <Input 
              type="number"
              min={1}
              value={editEstimated}
              onChange={(e) => setEditEstimated(Number(e.target.value))}
              className="w-16"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSave}
            >
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-lg">{task.title}</h3>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Progress: {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between items-center pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onCompletePomo(task.id)}
            disabled={task.completedPomodoros >= task.estimatedPomodoros}
          >
            <Check className="h-4 w-4 mr-1" /> Complete Pomodoro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Task;
