
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useTimer } from '@/context/TimerContext';

const SettingsModal: React.FC = () => {
  const { workDuration, breakDuration, setWorkDuration, setBreakDuration } = useTimer();
  const [tempWorkDuration, setTempWorkDuration] = React.useState(workDuration);
  const [tempBreakDuration, setTempBreakDuration] = React.useState(breakDuration);

  const handleSave = () => {
    setWorkDuration(tempWorkDuration);
    setBreakDuration(tempBreakDuration);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="workDuration" className="text-right">
              Work Duration
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="workDuration"
                type="number"
                min={1}
                max={60}
                value={tempWorkDuration}
                onChange={(e) => setTempWorkDuration(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="breakDuration" className="text-right">
              Break Duration
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="breakDuration"
                type="number"
                min={1}
                max={30}
                value={tempBreakDuration}
                onChange={(e) => setTempBreakDuration(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
