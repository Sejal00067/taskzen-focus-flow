
import React from 'react';
import { Clock } from 'lucide-react';
import SettingsModal from './SettingsModal';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex items-center space-x-2">
        <Clock className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">FocusFlow</h1>
      </div>
      <SettingsModal />
    </header>
  );
};

export default Header;
