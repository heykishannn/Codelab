import { useEffect, useRef, useState } from 'react';
import { EditorTab } from '@/types/ide';
import { Button } from '@/components/ui/button';
import { X, FileText, Code, Settings } from 'lucide-react';

interface CodeEditorProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onContentChange: (tabId: string, content: string) => void;
  onDrop: (content: string) => void;
}

export function CodeEditor({ 
  tabs, 
  activeTabId, 
  onTabChange, 
  onTabClose, 
  onContentChange,
  onDrop 
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    if (textareaRef.current && activeTab) {
      textareaRef.current.value = activeTab.content;
    }
  }, [activeTab]);

  const handleContentChange = (content: string) => {
    if (activeTab) {
      onContentChange(activeTab.id, content);
    }
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'html': return <FileText className="w-4 h-4 text-orange-400" />;
      case 'css': return <Code className="w-4 h-4 text-blue-400" />;
      case 'javascript': return <Code className="w-4 h-4 text-yellow-400" />;
      case 'typescript': return <Code className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedContent = e.dataTransfer.getData('text/plain');
    if (droppedContent && activeTab) {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = textarea.value;
        const newContent = currentContent.substring(0, start) + droppedContent + currentContent.substring(end);
        
        handleContentChange(newContent);
        onDrop(droppedContent);
        
        // Set cursor position after the inserted content
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + droppedContent.length;
          textarea.focus();
        }, 0);
      }
    }
  };

  const renderLineNumbers = () => {
    if (!activeTab) return null;
    
    const lines = activeTab.content.split('\n').length;
    return (
      <div className="bg-[hsl(0,0%,8%)] border-r border-gray-700 px-3 py-4 text-right text-sm text-gray-500 font-mono select-none">
        {Array.from({ length: Math.max(lines, 20) }, (_, i) => (
          <div key={i + 1} className="leading-6">{i + 1}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Editor Tabs */}
      <div className="bg-[hsl(0,0%,12%)] border-b border-gray-700 px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center px-3 py-2 text-sm rounded-t-md cursor-pointer transition-colors ${
                tab.id === activeTabId 
                  ? 'tab-active bg-[hsl(0,0%,18%)] text-[hsl(195,100%,50%)]' 
                  : 'hover:bg-[hsl(0,0%,18%)]'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {getLanguageIcon(tab.language)}
              <span className="ml-1 mr-2">{tab.name}</span>
              {tab.isDirty && <div className="w-2 h-2 bg-orange-400 rounded-full mr-1" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="p-0 h-4 w-4 opacity-60 hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex">
        {activeTab ? (
          <>
            {renderLineNumbers()}
            <div 
              className={`flex-1 relative ${dragOver ? 'bg-[hsl(195,100%,50%)] bg-opacity-10' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <textarea
                ref={textareaRef}
                className="w-full h-full p-4 bg-[hsl(0,0%,10%)] text-gray-300 font-mono text-sm leading-6 resize-none focus:outline-none"
                placeholder="Start coding..."
                defaultValue={activeTab.content}
                onChange={(e) => handleContentChange(e.target.value)}
                spellCheck={false}
              />
              {dragOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-[hsl(195,100%,50%)] bg-opacity-20 border-2 border-dashed border-[hsl(195,100%,50%)]">
                  <div className="text-[hsl(195,100%,50%)] font-medium">Drop UI component here</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[hsl(0,0%,10%)] text-gray-500">
            <div className="text-center">
              <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No file selected</p>
              <p className="text-sm">Open a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
