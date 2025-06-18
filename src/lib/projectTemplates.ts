import { FileNode } from '@/types/ide';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  files: FileNode[];
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'hello-world',
    name: 'Hello World',
    description: 'Basic HTML structure with JavaScript',
    files: [
      {
        id: 'index-html',
        name: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Hello World!</h1>
        <button id="clickButton">Click Me</button>
        <p id="output">Welcome to your new app</p>
    </div>
    <script src="app.js"></script>
</body>
</html>`
      },
      {
        id: 'styles-css',
        name: 'styles.css',
        type: 'file',
        language: 'css',
        content: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    padding: 40px 20px;
}

h1 {
    font-size: 2.5em;
    margin-bottom: 30px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

button {
    background: rgba(255,255,255,0.2);
    border: 2px solid white;
    color: white;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 20px 0;
}

button:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

p {
    font-size: 1.2em;
    margin-top: 20px;
}`
      },
      {
        id: 'app-js',
        name: 'app.js',
        type: 'file',
        language: 'javascript',
        content: `document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('clickButton');
    const output = document.getElementById('output');
    let clickCount = 0;

    button.addEventListener('click', function() {
        clickCount++;
        output.textContent = \`Button clicked \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`;
        
        // Add some visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'translateY(-2px)';
        }, 100);
    });

    console.log('App initialized successfully!');
});`
      }
    ]
  },
  {
    id: 'android-layout',
    name: 'Android Layout',
    description: 'Material Design components and layout',
    files: [
      {
        id: 'index-html-android',
        name: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Android Style App</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-bar">
        <span class="material-icons">menu</span>
        <h1>My Android App</h1>
        <span class="material-icons">more_vert</span>
    </div>
    
    <div class="content">
        <div class="card">
            <div class="card-header">
                <h2>Welcome</h2>
                <span class="material-icons">favorite</span>
            </div>
            <div class="card-content">
                <p>This is a Material Design inspired layout for your Android app.</p>
                <button class="material-button">
                    <span class="material-icons">android</span>
                    GET STARTED
                </button>
            </div>
        </div>
        
        <div class="list">
            <div class="list-item">
                <span class="material-icons">home</span>
                <span>Home</span>
            </div>
            <div class="list-item">
                <span class="material-icons">settings</span>
                <span>Settings</span>
            </div>
            <div class="list-item">
                <span class="material-icons">info</span>
                <span>About</span>
            </div>
        </div>
    </div>
    
    <div class="fab">
        <span class="material-icons">add</span>
    </div>
    
    <script src="app.js"></script>
</body>
</html>`
      },
      {
        id: 'styles-css-android',
        name: 'styles.css',
        type: 'file',
        language: 'css',
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Roboto', Arial, sans-serif;
    background: #f5f5f5;
    color: #333;
}

.app-bar {
    background: #2196F3;
    color: white;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    position: sticky;
    top: 0;
    z-index: 100;
}

.app-bar h1 {
    font-size: 20px;
    font-weight: 500;
}

.content {
    padding: 16px;
    max-width: 600px;
    margin: 0 auto;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 16px;
    overflow: hidden;
}

.card-header {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.card-content {
    padding: 16px;
}

.material-button {
    background: #2196F3;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    transition: all 0.2s ease;
    margin-top: 16px;
}

.material-button:hover {
    background: #1976D2;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.list {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
}

.list-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-bottom: 1px solid #e9ecef;
    cursor: pointer;
    transition: background 0.2s ease;
}

.list-item:last-child {
    border-bottom: none;
}

.list-item:hover {
    background: #f8f9fa;
}

.fab {
    position: fixed;
    bottom: 16px;
    right: 16px;
    width: 56px;
    height: 56px;
    background: #FF5722;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
}

.fab:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 87, 34, 0.4);
}

.material-icons {
    user-select: none;
}`
      },
      {
        id: 'app-js-android',
        name: 'app.js',
        type: 'file',
        language: 'javascript',
        content: `document.addEventListener('DOMContentLoaded', function() {
    // Material Design ripple effect
    function createRipple(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = \`
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 600ms linear;
            background-color: rgba(255, 255, 255, 0.7);
            left: \${x}px;
            top: \${y}px;
            width: \${size}px;
            height: \${size}px;
        \`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.material-button, .fab, .list-item');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });
    
    // FAB click handler
    const fab = document.querySelector('.fab');
    fab.addEventListener('click', function() {
        alert('Floating Action Button clicked!');
    });
    
    // List item click handlers
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span:last-child').textContent;
            console.log(\`Clicked on: \${text}\`);
        });
    });
    
    console.log('Android Material Design app initialized!');
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = \`
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
\`;
document.head.appendChild(style);`
      }
    ]
  },
  {
    id: 'web-app',
    name: 'Web App',
    description: 'Progressive Web App with service worker',
    files: [
      {
        id: 'index-html-pwa',
        name: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Progressive Web App</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2196F3">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app">
        <header class="header">
            <h1>Progressive Web App</h1>
            <button id="installBtn" class="install-btn" style="display: none;">Install App</button>
        </header>
        
        <main class="main">
            <div class="feature-card">
                <h2>🚀 Fast & Responsive</h2>
                <p>Built with modern web technologies for optimal performance</p>
            </div>
            
            <div class="feature-card">
                <h2>📱 Mobile-First</h2>
                <p>Designed to work perfectly on all devices</p>
            </div>
            
            <div class="feature-card">
                <h2>🔄 Offline Ready</h2>
                <p id="networkStatus">Checking connection...</p>
            </div>
            
            <div class="actions">
                <button id="notifyBtn" class="action-btn">Send Notification</button>
                <button id="shareBtn" class="action-btn">Share App</button>
            </div>
        </main>
    </div>
    
    <script src="app.js"></script>
</body>
</html>`
      },
      {
        id: 'styles-css-pwa',
        name: 'styles.css',
        type: 'file',
        language: 'css',
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.app {
    max-width: 800px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header h1 {
    font-size: 1.8em;
    font-weight: 600;
}

.install-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.install-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.main {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.feature-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-card h2 {
    font-size: 1.3em;
    margin-bottom: 12px;
    color: #333;
}

.feature-card p {
    color: #666;
    font-size: 0.95em;
}

.actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
}

.action-btn {
    background: rgba(33, 150, 243, 0.9);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.action-btn:hover {
    background: rgba(33, 150, 243, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        gap: 16px;
    }
    
    .main {
        padding: 16px;
    }
    
    .actions {
        flex-direction: column;
    }
    
    .action-btn {
        width: 100%;
    }
}`
      },
      {
        id: 'app-js-pwa',
        name: 'app.js',
        type: 'file',
        language: 'javascript',
        content: `// PWA Installation
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(\`User response to the install prompt: \${outcome}\`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    }
});

// Network Status
function updateNetworkStatus() {
    const statusElement = document.getElementById('networkStatus');
    if (navigator.onLine) {
        statusElement.textContent = '✅ You are online and ready to go!';
        statusElement.style.color = '#4CAF50';
    } else {
        statusElement.textContent = '📴 You are offline - but the app still works!';
        statusElement.style.color = '#FF9800';
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

// Notifications
document.getElementById('notifyBtn').addEventListener('click', async () => {
    if ('Notification' in window) {
        let permission = await Notification.requestPermission();
        if (permission === 'granted') {
            new Notification('Hello from your PWA!', {
                body: 'This is a test notification from your Progressive Web App.',
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png'
            });
        }
    }
});

// Web Share API
document.getElementById('shareBtn').addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Progressive Web App',
                text: 'Check out this awesome PWA!',
                url: window.location.href,
            });
        } catch (err) {
            console.log('Error sharing:', err);
        }
    } else {
        // Fallback for browsers that don't support Web Share API
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

console.log('Progressive Web App initialized!');`
      },
      {
        id: 'manifest-json',
        name: 'manifest.json',
        type: 'file',
        language: 'json',
        content: `{
  "name": "Progressive Web App",
  "short_name": "PWA Demo",
  "description": "A sample Progressive Web App built with modern web technologies",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#2196F3",
  "theme_color": "#2196F3",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["productivity", "utilities"],
  "lang": "en",
  "scope": "/"
}`
      }
    ]
  }
];

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return projectTemplates.find(template => template.id === id);
}

export function createProjectFromTemplate(templateId: string, projectName: string): Project | null {
  const template = getTemplateById(templateId);
  if (!template) return null;

  return {
    id: crypto.randomUUID(),
    name: projectName,
    files: template.files.map(file => ({
      ...file,
      id: crypto.randomUUID()
    })),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
