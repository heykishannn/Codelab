import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProjectTemplate, projectTemplates } from '@/lib/projectTemplates';
import { Code, Globe, Smartphone } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string, projectName: string) => void;
}

export function TemplateModal({ isOpen, onClose, onSelectTemplate }: TemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');

  const handleCreate = () => {
    if (selectedTemplate && projectName.trim()) {
      onSelectTemplate(selectedTemplate, projectName.trim());
      onClose();
      setSelectedTemplate(null);
      setProjectName('');
    }
  };

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'hello-world':
        return <Code className="w-8 h-8 text-[hsl(195,100%,50%)]" />;
      case 'android-layout':
        return <Smartphone className="w-8 h-8 text-green-400" />;
      case 'web-app':
        return <Globe className="w-8 h-8 text-purple-400" />;
      default:
        return <Code className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[hsl(0,0%,12%)] border-gray-700 text-gray-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-[hsl(195,100%,50%)]">
            Choose Template
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectName" className="text-sm font-medium text-gray-300">
              Project Name
            </Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome App"
              className="mt-1 bg-[hsl(0,0%,18%)] border-gray-600 text-gray-100"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">Template</Label>
            {projectTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 bg-[hsl(0,0%,18%)] rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-[hsl(195,100%,50%)] bg-[hsl(195,100%,50%)] bg-opacity-10'
                    : 'border-gray-600 hover:border-[hsl(195,100%,50%)] hover:bg-[hsl(195,100%,50%)] hover:bg-opacity-5'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start space-x-3">
                  {getTemplateIcon(template.id)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-100 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedTemplate || !projectName.trim()}
            className="bg-[hsl(195,100%,50%)] text-[hsl(0,0%,7%)] font-medium hover:bg-cyan-400"
          >
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
