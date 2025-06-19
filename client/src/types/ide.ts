export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  parent?: string;
}

export interface Project {
  id: string;
  name: string;
  files: FileNode[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
  path: string;
}

export interface UIComponent {
  id: string;
  name: string;
  icon: string;
  type: string;
  template: string;
  props: Record<string, any>;
}

export interface ConsoleMessage {
  id: string;
  type: 'info' | 'warn' | 'error' | 'debug' | 'system';
  message: string;
  timestamp: Date;
}

export interface ExportProgress {
  step: string;
  progress: number;
  completed: boolean;
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type ThemeMode = 'dark' | 'light';
