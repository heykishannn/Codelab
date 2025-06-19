import { FileNode, Project } from '@/types/ide';

const DB_NAME = 'APKBuilderIDE';
const DB_VERSION = 1;
const PROJECTS_STORE = 'projects';

class FileSystemService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
          const projectStore = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });
          projectStore.createIndex('name', 'name', { unique: false });
          projectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  async saveProject(project: Project): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PROJECTS_STORE], 'readwrite');
      const store = transaction.objectStore(PROJECTS_STORE);
      
      const updatedProject = {
        ...project,
        updatedAt: new Date()
      };

      const request = store.put(updatedProject);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async loadProject(projectId: string): Promise<Project | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PROJECTS_STORE], 'readonly');
      const store = transaction.objectStore(PROJECTS_STORE);
      
      const request = store.get(projectId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async listProjects(): Promise<Project[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PROJECTS_STORE], 'readonly');
      const store = transaction.objectStore(PROJECTS_STORE);
      const index = store.index('updatedAt');
      
      const request = index.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const projects = request.result.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        resolve(projects);
      };
    });
  }

  async deleteProject(projectId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PROJECTS_STORE], 'readwrite');
      const store = transaction.objectStore(PROJECTS_STORE);
      
      const request = store.delete(projectId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  createFileNode(name: string, type: 'file' | 'folder', content?: string): FileNode {
    return {
      id: crypto.randomUUID(),
      name,
      type,
      content: content || '',
      language: type === 'file' ? this.getLanguageFromExtension(name) : undefined,
      children: type === 'folder' ? [] : undefined
    };
  }

  private getLanguageFromExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'xml': 'xml',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'kt': 'kotlin',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'cpp': 'cpp',
      'c': 'c'
    };
    
    return languageMap[ext || ''] || 'text';
  }

  findFileById(files: FileNode[], fileId: string): FileNode | null {
    for (const file of files) {
      if (file.id === fileId) return file;
      if (file.children) {
        const found = this.findFileById(file.children, fileId);
        if (found) return found;
      }
    }
    return null;
  }

  updateFileContent(files: FileNode[], fileId: string, content: string): FileNode[] {
    return files.map(file => {
      if (file.id === fileId) {
        return { ...file, content };
      }
      if (file.children) {
        return {
          ...file,
          children: this.updateFileContent(file.children, fileId, content)
        };
      }
      return file;
    });
  }

  addFileToFolder(files: FileNode[], folderId: string, newFile: FileNode): FileNode[] {
    return files.map(file => {
      if (file.id === folderId && file.type === 'folder') {
        return {
          ...file,
          children: [...(file.children || []), newFile]
        };
      }
      if (file.children) {
        return {
          ...file,
          children: this.addFileToFolder(file.children, folderId, newFile)
        };
      }
      return file;
    });
  }

  removeFile(files: FileNode[], fileId: string): FileNode[] {
    return files.filter(file => {
      if (file.id === fileId) return false;
      if (file.children) {
        file.children = this.removeFile(file.children, fileId);
      }
      return true;
    });
  }
}

export const fileSystem = new FileSystemService();
