import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Folder, Save, Moon, Sun, Settings, User, Menu } from 'lucide-react';

interface TopNavigationProps {
  onNewProject: () => void;
  onSaveProject: () => void;
  onToggleTheme: () => void;
  isDarkTheme: boolean;
  projectName: string;
}

export function TopNavigation({ 
  onNewProject, 
  onSaveProject, 
  onToggleTheme, 
  isDarkTheme,
  projectName 
}: TopNavigationProps) {
  return (
    <header className="bg-[hsl(0,0%,12%)] border-b border-gray-700 px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Code className="text-[hsl(195,100%,50%)] text-2xl animate-glow" />
          <h1 className="text-xl font-medium text-[hsl(195,100%,50%)]">APK Builder IDE</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onNewProject}
            className="bg-[hsl(0,0%,18%)] hover:bg-gray-600 text-gray-300 ripple"
          >
            <Folder className="w-4 h-4 mr-1" />
            New Project
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onSaveProject}
            className="bg-[hsl(0,0%,18%)] hover:bg-gray-600 text-gray-300 ripple"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-400 hidden md:block">{projectName}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 bg-[hsl(267,85%,76%)] rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  );
}
