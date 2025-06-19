import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DeviceType } from '@/types/ide';
import { 
  RefreshCw, 
  Maximize2, 
  Smartphone, 
  Tablet, 
  Monitor,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

interface LivePreviewProps {
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  onExportZip: () => void;
  onExportApk: () => void;
}

export function LivePreview({ 
  htmlContent, 
  cssContent, 
  jsContent, 
  onExportZip, 
  onExportApk 
}: LivePreviewProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline] = useState(navigator.onLine);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    updatePreview();
  }, [htmlContent, cssContent, jsContent]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const combinedContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
        <style>
          ${cssContent}
          
          /* Prevent iframe issues */
          * { box-sizing: border-box; }
          body { margin: 0; padding: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          // Console override to capture logs
          (function() {
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            
            window.parent.postMessage({ type: 'console', level: 'info', message: 'Preview loaded successfully' }, '*');
            
            console.log = function(...args) {
              window.parent.postMessage({ type: 'console', level: 'info', message: args.join(' ') }, '*');
              originalLog.apply(console, args);
            };
            
            console.error = function(...args) {
              window.parent.postMessage({ type: 'console', level: 'error', message: args.join(' ') }, '*');
              originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
              window.parent.postMessage({ type: 'console', level: 'warn', message: args.join(' ') }, '*');
              originalWarn.apply(console, args);
            };
            
            window.onerror = function(msg, url, line, col, error) {
              window.parent.postMessage({ 
                type: 'console', 
                level: 'error', 
                message: \`Error: \${msg} at \${url}:\${line}:\${col}\`
              }, '*');
            };
          })();
          
          ${jsContent}
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([combinedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
  };

  const handleRefresh = () => {
    updatePreview();
  };

  const getDeviceClasses = () => {
    switch (deviceType) {
      case 'mobile':
        return 'w-60 h-96';
      case 'tablet':
        return 'w-80 h-96';
      case 'desktop':
        return 'w-full h-96';
      default:
        return 'w-60 h-96';
    }
  };

  const renderStatusBar = () => (
    <div className="bg-[hsl(0,0%,18%)] h-6 rounded-t-lg flex items-center justify-between px-3 text-xs text-gray-400">
      <div className="flex items-center space-x-1">
        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
        <Signal className="w-3 h-3" />
        <span>Preview</span>
      </div>
      <div className="flex items-center space-x-1">
        <span>12:34</span>
        {isOnline ? <Wifi className="w-3 h-3" /> : <span className="text-red-400">Offline</span>}
        <Battery className="w-3 h-3" />
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-[hsl(0,0%,12%)] border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-300">Live Preview</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="p-1 rounded hover:bg-gray-600"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded hover:bg-gray-600"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-3">
          <Button
            variant={deviceType === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDeviceType('mobile')}
            className={`px-2 py-1 text-xs ${
              deviceType === 'mobile' 
                ? 'bg-[hsl(195,100%,50%)] text-[hsl(0,0%,7%)]' 
                : 'bg-[hsl(0,0%,18%)]'
            }`}
          >
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile
          </Button>
          <Button
            variant={deviceType === 'tablet' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDeviceType('tablet')}
            className={`px-2 py-1 text-xs ${
              deviceType === 'tablet' 
                ? 'bg-[hsl(195,100%,50%)] text-[hsl(0,0%,7%)]' 
                : 'bg-[hsl(0,0%,18%)]'
            }`}
          >
            <Tablet className="w-3 h-3 mr-1" />
            Tablet
          </Button>
          <Button
            variant={deviceType === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDeviceType('desktop')}
            className={`px-2 py-1 text-xs ${
              deviceType === 'desktop' 
                ? 'bg-[hsl(195,100%,50%)] text-[hsl(0,0%,7%)]' 
                : 'bg-[hsl(0,0%,18%)]'
            }`}
          >
            <Monitor className="w-3 h-3 mr-1" />
            Desktop
          </Button>
        </div>
      </div>
      
      {/* Mobile Device Frame */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className={`mobile-frame bg-black p-2 relative ${getDeviceClasses()}`}>
          {deviceType === 'mobile' && renderStatusBar()}
          
          {/* App Content */}
          <div className="preview-frame h-full bg-white rounded-b-lg relative overflow-hidden">
            <iframe
              ref={iframeRef}
              className="w-full h-full border-none"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin"
            />
            
            {/* Live Update Indicator */}
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Home Indicator for mobile */}
          {deviceType === 'mobile' && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-400 rounded-full"></div>
          )}
        </div>
      </div>
      
      {/* Export Options */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Button
          onClick={onExportApk}
          className="w-full bg-[hsl(195,100%,50%)] text-[hsl(0,0%,7%)] py-2 px-4 rounded-lg font-medium hover:bg-cyan-400 transition-colors ripple"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Export APK
        </Button>
        <Button
          onClick={onExportZip}
          variant="secondary"
          className="w-full bg-[hsl(0,0%,18%)] py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors ripple"
        >
          <Monitor className="w-4 h-4 mr-2" />
          Export ZIP
        </Button>
      </div>
    </div>
  );
}
