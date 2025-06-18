import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileNode, UIComponent } from '@/types/ide';
import { 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  Trash2,
  FileText,
  Code,
  Image,
  Music,
  Video,
  Globe,
  Smartphone,
  Type,
  Edit,
  MousePointer
} from 'lucide-react';

interface FileExplorerProps {
  files: FileNode[];
  selectedFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (name: string, type: 'file' | 'folder', parentId?: string) => void;
  onFileDelete: (fileId: string) => void;
  projectName: string;
}

const uiComponents: UIComponent[] = [
  { id: 'button', name: 'Button', icon: 'MousePointer', type: 'button', template: '<button>Click Me</button>', props: {} },
  { id: 'textview', name: 'TextView', icon: 'Type', type: 'text', template: '<p>Text content</p>', props: {} },
  { id: 'edittext', name: 'EditText', icon: 'Edit', type: 'input', template: '<input type="text" placeholder="Enter text">', props: {} },
  { id: 'imageview', name: 'ImageView', icon: 'Image', type: 'image', template: '<img src="#" alt="Image">', props: {} },
  { id: 'videoview', name: 'VideoView', icon: 'Video', type: 'video', template: '<video controls><source src="#" type="video/mp4"></video>', props: {} },
  { id: 'audio', name: 'Audio Player', icon: 'Music', type: 'audio', template: '<audio controls><source src="#" type="audio/mpeg"></audio>', props: {} },
  { id: 'webview', name: 'WebView', icon: 'Globe', type: 'webview', template: '<iframe src="about:blank"></iframe>', props: {} },
];

export function FileExplorer({ 
  files, 
  selectedFileId, 
  onFileSelect, 
  onFileCreate, 
  onFileDelete,
  projectName 
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? FolderOpen : Folder;
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html': case 'htm': return FileText;
      case 'css': return Code;
      case 'js': case 'ts': case 'jsx': case 'tsx': return Code;
      case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': return Image;
      case 'mp3': case 'wav': case 'ogg': return Music;
      case 'mp4': case 'webm': case 'avi': return Video;
      default: return File;
    }
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const isFolder = !newFileName.includes('.');
      onFileCreate(newFileName.trim(), isFolder ? 'folder' : 'file');
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const renderFileNode = (file: FileNode, depth = 0) => {
    const Icon = getFileIcon(file);
    const isSelected = file.id === selectedFileId;
    
    return (
      <div key={file.id}>
        <div 
          className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors file-tree-item ${
            isSelected ? 'bg-[hsl(195,100%,50%)] bg-opacity-20 text-[hsl(195,100%,50%)]' : 'hover:bg-gray-600'
          }`}
          style={{ marginLeft: `${depth * 16}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.id);
            } else {
              onFileSelect(file.id);
            }
          }}
        >
          <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate flex-1">{file.name}</span>
          {file.type === 'file' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFileDelete(file.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
        {file.type === 'folder' && expandedFolders.has(file.id) && file.children && (
          <div>
            {file.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderUIComponent = (component: UIComponent) => {
    const iconMap: Record<string, any> = {
      MousePointer, Type, Edit, Image, Video, Music, Globe
    };
    const Icon = iconMap[component.icon] || MousePointer;

    return (
      <div 
        key={component.id}
        className="drag-item bg-[hsl(0,0%,18%)] p-2 rounded-md border border-gray-600 cursor-grab"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', component.template);
          e.dataTransfer.setData('component/type', component.type);
        }}
      >
        <div className="flex items-center">
          <Icon className="w-4 h-4 mr-2 text-[hsl(195,100%,50%)]" />
          <span className="text-sm">{component.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 bg-[hsl(0,0%,12%)] border-r border-gray-700 flex flex-col">
      {/* Project Explorer */}
      <div className="p-4 border-b border-gray-700 flex-1 max-h-1/2 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-300">Project Explorer</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewFileInput(true)}
            className="p-1 h-6 w-6"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center px-3 py-2 rounded-md text-sm bg-[hsl(0,0%,18%)] text-gray-300">
            <Folder className="w-4 h-4 mr-2" />
            <span>{projectName}</span>
          </div>
          
          {showNewFileInput && (
            <div className="ml-6 flex items-center space-x-1">
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="filename.ext"
                className="h-6 text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFile();
                  if (e.key === 'Escape') setShowNewFileInput(false);
                }}
                autoFocus
              />
            </div>
          )}
          
          <div className="ml-6 space-y-1">
            {files.map(file => renderFileNode(file, 0))}
          </div>
        </div>
      </div>
      
      {/* UI Components */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="font-medium text-gray-300 mb-3">UI Components</h3>
        <div className="space-y-2">
          {uiComponents.map(renderUIComponent)}
        </div>
      </div>
    </div>
  );
}
