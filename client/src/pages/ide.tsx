import { useState, useEffect } from 'react';
import { TopNavigation } from '@/components/ide/TopNavigation';
import { FileExplorer } from '@/components/ide/FileExplorer';
import { CodeEditor } from '@/components/ide/CodeEditor';
import { LivePreview } from '@/components/ide/LivePreview';
import { ConsolePanel } from '@/components/ide/ConsolePanel';
import { FloatingActionButtons } from '@/components/ide/FloatingActionButtons';
import { TemplateModal } from '@/components/ide/TemplateModal';
import { ExportModal } from '@/components/ide/ExportModal';
import { useToast } from '@/hooks/use-toast';
import { FileNode, Project, EditorTab, ThemeMode } from '@/types/ide';
import { fileSystem } from '@/lib/fileSystem';
import { exportService } from '@/lib/exportUtils';
import { createProjectFromTemplate } from '@/lib/projectTemplates';

export default function IDE() {
  const [project, setProject] = useState<Project | null>(null);
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'zip' | 'apk'>('zip');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  
  const { toast } = useToast();

  useEffect(() => {
    initializeFileSystem();
  }, []);

  const initializeFileSystem = async () => {
    try {
      await fileSystem.init();
      console.log('File system initialized');
    } catch (error) {
      console.error('Failed to initialize file system:', error);
      toast({
        title: "Error",
        description: "Failed to initialize local storage",
        variant: "destructive"
      });
    }
  };

  const handleTemplateSelect = (templateId: string, projectName: string) => {
    const newProject = createProjectFromTemplate(templateId, projectName);
    if (newProject) {
      setProject(newProject);
      setShowTemplateModal(false);
      
      // Open the main HTML file by default
      const indexFile = newProject.files.find(f => f.name === 'index.html');
      if (indexFile) {
        handleFileSelect(indexFile.id);
      }
      
      toast({
        title: "Success",
        description: `Project "${projectName}" created successfully`
      });
    }
  };

  const handleFileSelect = (fileId: string) => {
    if (!project) return;
    
    const file = fileSystem.findFileById(project.files, fileId);
    if (!file || file.type !== 'file') return;

    setSelectedFileId(fileId);

    // Check if tab already exists
    const existingTab = tabs.find(tab => tab.id === fileId);
    if (existingTab) {
      setActiveTabId(fileId);
      return;
    }

    // Create new tab
    const newTab: EditorTab = {
      id: fileId,
      name: file.name,
      content: file.content || '',
      language: file.language || 'text',
      isDirty: false,
      path: file.name
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(fileId);
  };

  const handleTabClose = (tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;

    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        const newActiveIndex = Math.max(0, tabIndex - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      } else {
        setActiveTabId(null);
      }
    }
  };

  const handleContentChange = (tabId: string, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, isDirty: true }
        : tab
    ));

    // Update project files
    if (project) {
      const updatedFiles = fileSystem.updateFileContent(project.files, tabId, content);
      setProject(prev => prev ? { ...prev, files: updatedFiles } : null);
    }
  };

  const handleFileCreate = (name: string, type: 'file' | 'folder', parentId?: string) => {
    if (!project) return;

    const newFile = fileSystem.createFileNode(name, type);
    
    if (parentId) {
      const updatedFiles = fileSystem.addFileToFolder(project.files, parentId, newFile);
      setProject(prev => prev ? { ...prev, files: updatedFiles } : null);
    } else {
      setProject(prev => prev ? { 
        ...prev, 
        files: [...prev.files, newFile] 
      } : null);
    }

    toast({
      title: "Success",
      description: `${type === 'file' ? 'File' : 'Folder'} "${name}" created`
    });
  };

  const handleFileDelete = (fileId: string) => {
    if (!project) return;

    // Close tab if file is open
    const tabToClose = tabs.find(tab => tab.id === fileId);
    if (tabToClose) {
      handleTabClose(fileId);
    }

    const updatedFiles = fileSystem.removeFile(project.files, fileId);
    setProject(prev => prev ? { ...prev, files: updatedFiles } : null);

    toast({
      title: "Success",
      description: "File deleted"
    });
  };

  const handleSaveProject = async () => {
    if (!project) return;

    try {
      await fileSystem.saveProject(project);
      
      // Mark all tabs as clean
      setTabs(prev => prev.map(tab => ({ ...tab, isDirty: false })));
      
      toast({
        title: "Success",
        description: "Project saved successfully"
      });
    } catch (error) {
      console.error('Failed to save project:', error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive"
      });
    }
  };

  const handleExportZip = async () => {
    if (!project) return;

    try {
      const blob = await exportService.exportAsZIP(project);
      exportService.downloadFile(blob, `${project.name}.zip`);
      
      toast({
        title: "Success",
        description: "Project exported as ZIP"
      });
    } catch (error) {
      console.error('Failed to export ZIP:', error);
      toast({
        title: "Error",
        description: "Failed to export ZIP",
        variant: "destructive"
      });
    }
  };

  const handleExportApk = () => {
    setExportType('apk');
    setShowExportModal(true);
  };

  const handleExportComplete = async () => {
    if (!project) return;

    try {
      if (exportType === 'apk') {
        const { progress } = await exportService.exportAsAPK(project);
        const blob = await progress((prog, step) => {
          console.log(`${step}: ${prog}%`);
        });
        exportService.downloadFile(blob, `${project.name}.apk`);
        
        toast({
          title: "Success",
          description: "APK exported successfully"
        });
      }
    } catch (error) {
      console.error('Failed to export APK:', error);
      toast({
        title: "Error",
        description: "Failed to export APK",
        variant: "destructive"
      });
    }
  };

  const getFileContent = (fileName: string) => {
    if (!project) return '';
    
    const file = project.files.find(f => f.name === fileName);
    return file?.content || '';
  };

  const handleNewProject = () => {
    setShowTemplateModal(true);
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (!project) {
    return (
      <div className="h-screen bg-[hsl(0,0%,7%)] text-gray-100">
        <TemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[hsl(0,0%,7%)] text-gray-100 overflow-hidden">
      <TopNavigation
        onNewProject={handleNewProject}
        onSaveProject={handleSaveProject}
        onToggleTheme={handleToggleTheme}
        isDarkTheme={theme === 'dark'}
        projectName={project.name}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <FileExplorer
          files={project.files}
          selectedFileId={selectedFileId}
          onFileSelect={handleFileSelect}
          onFileCreate={handleFileCreate}
          onFileDelete={handleFileDelete}
          projectName={project.name}
        />
        
        <div className="flex-1 flex flex-col">
          <CodeEditor
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
            onTabClose={handleTabClose}
            onContentChange={handleContentChange}
            onDrop={(content) => {
              console.log('Dropped content:', content);
            }}
          />
          
          <ConsolePanel />
        </div>
        
        <LivePreview
          htmlContent={getFileContent('index.html')}
          cssContent={getFileContent('styles.css')}
          jsContent={getFileContent('app.js')}
          onExportZip={handleExportZip}
          onExportApk={handleExportApk}
        />
      </div>
      
      <FloatingActionButtons
        onNewFile={() => handleFileCreate('new-file.html', 'file')}
        onRunProject={() => {
          toast({
            title: "Info",
            description: "Project is running in live preview"
          });
        }}
        onSaveProject={handleSaveProject}
        onExportProject={handleExportZip}
      />
      
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleTemplateSelect}
      />
      
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        exportType={exportType}
        onComplete={handleExportComplete}
      />
    </div>
  );
}
