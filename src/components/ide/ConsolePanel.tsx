import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ConsoleMessage } from '@/types/ide';
import { Trash2, Terminal, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ConsolePanelProps {
  className?: string;
}

export function ConsolePanel({ className = '' }: ConsolePanelProps) {
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: '1',
      type: 'system',
      message: 'APK Builder IDE initialized successfully',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'info',
      message: 'Live preview enabled',
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'debug',
      message: 'IndexedDB storage available',
      timestamp: new Date()
    }
  ]);
  
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for messages from preview iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        const newMessage: ConsoleMessage = {
          id: crypto.randomUUID(),
          type: event.data.level,
          message: event.data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages]);

  const clearConsole = () => {
    setMessages([]);
  };

  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      case 'warn':
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'info':
        return <Info className="w-3 h-3 text-blue-400" />;
      case 'debug':
        return <Terminal className="w-3 h-3 text-gray-400" />;
      case 'system':
        return <Terminal className="w-3 h-3 text-[hsl(195,100%,50%)]" />;
      default:
        return <Terminal className="w-3 h-3 text-gray-400" />;
    }
  };

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'debug':
        return 'text-gray-400';
      case 'system':
        return 'text-[hsl(195,100%,50%)]';
      default:
        return 'text-gray-300';
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`h-32 bg-[hsl(0,0%,12%)] border-t border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300 flex items-center">
          <Terminal className="w-4 h-4 mr-2" />
          Console
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearConsole}
          className="text-gray-400 hover:text-white p-1 h-6 w-6"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      
      <div 
        ref={consoleRef}
        className="console-output text-gray-400 space-y-1 h-20 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm italic">Console cleared</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-2 text-xs">
              <span className="text-gray-500 font-mono text-[10px] mt-0.5 flex-shrink-0">
                {formatTime(message.timestamp)}
              </span>
              <div className="flex items-start space-x-1 flex-1 min-w-0">
                {getMessageIcon(message.type)}
                <span className={`${getMessageColor(message.type)} break-words`}>
                  {message.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
