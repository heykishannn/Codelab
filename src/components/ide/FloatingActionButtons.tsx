import { Button } from '@/components/ui/button';
import { Plus, Play, Save, Download } from 'lucide-react';

interface FloatingActionButtonsProps {
  onNewFile: () => void;
  onRunProject: () => void;
  onSaveProject: () => void;
  onExportProject: () => void;
}

export function FloatingActionButtons({
  onNewFile,
  onRunProject,
  onSaveProject,
  onExportProject
}: FloatingActionButtonsProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
      <Button
        className="fab w-14 h-14 bg-[hsl(267,85%,76%)] hover:bg-purple-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={onNewFile}
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>
      
      <Button
        className="fab w-12 h-12 bg-[hsl(351,100%,60%)] hover:bg-red-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={onRunProject}
      >
        <Play className="w-4 h-4 text-white" />
      </Button>
      
      <Button
        className="fab w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={onSaveProject}
      >
        <Save className="w-4 h-4 text-white" />
      </Button>
      
      <Button
        className="fab w-12 h-12 bg-blue-500 hover:bg-blue-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={onExportProject}
      >
        <Download className="w-4 h-4 text-white" />
      </Button>
    </div>
  );
}
