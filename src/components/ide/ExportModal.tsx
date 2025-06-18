import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface ExportStep {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportType: 'zip' | 'apk';
  onComplete: () => void;
}

export function ExportModal({ isOpen, onClose, exportType, onComplete }: ExportModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ExportStep[]>([]);

  useEffect(() => {
    if (isOpen) {
      const exportSteps = exportType === 'apk' ? [
        { id: 'compile', label: 'Compiling HTML/CSS/JS', completed: false, active: false },
        { id: 'wrapper', label: 'Creating Android WebView wrapper', completed: false, active: false },
        { id: 'permissions', label: 'Generating APK with permissions', completed: false, active: false },
        { id: 'signing', label: 'Signing APK', completed: false, active: false }
      ] : [
        { id: 'collect', label: 'Collecting project files', completed: false, active: false },
        { id: 'compress', label: 'Compressing files', completed: false, active: false },
        { id: 'finalize', label: 'Finalizing archive', completed: false, active: false }
      ];

      setSteps(exportSteps);
      setProgress(0);
      setCurrentStep(0);
      
      // Start export process
      simulateExportProcess(exportSteps);
    }
  }, [isOpen, exportType]);

  const simulateExportProcess = async (exportSteps: ExportStep[]) => {
    const stepDuration = exportType === 'apk' ? 1000 : 600;
    
    for (let i = 0; i < exportSteps.length; i++) {
      // Set current step as active
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        active: index === i,
        completed: index < i
      })));
      
      setCurrentStep(i);
      
      // Animate progress for current step
      const stepProgress = ((i + 1) / exportSteps.length) * 100;
      const startProgress = (i / exportSteps.length) * 100;
      
      // Animate progress smoothly
      for (let p = startProgress; p <= stepProgress; p += 2) {
        setProgress(Math.min(p, stepProgress));
        await new Promise(resolve => setTimeout(resolve, stepDuration / 50));
      }
      
      // Mark step as completed
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        completed: index <= i,
        active: false
      })));
      
      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setProgress(100);
    
    // Complete export after a short delay
    setTimeout(() => {
      onComplete();
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[hsl(0,0%,12%)] border-gray-700 text-gray-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-[hsl(195,100%,50%)]">
            Exporting {exportType.toUpperCase()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : step.active ? (
                    <Loader2 className="w-4 h-4 text-[hsl(195,100%,50%)] animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <span className={`text-sm ${
                  step.completed 
                    ? 'text-green-400' 
                    : step.active 
                      ? 'text-[hsl(195,100%,50%)]' 
                      : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="w-full h-2"
            />
            <p className="text-sm text-gray-400 text-center">
              {Math.round(progress)}% complete
            </p>
          </div>
          
          {progress === 100 && (
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-green-400 font-medium">
                {exportType.toUpperCase()} export completed successfully!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
