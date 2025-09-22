import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ExternalLink, 
  Maximize2, 
  Monitor, 
  Smartphone,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WindowPopoutProps {
  url: string;
  title: string;
}

export const WindowPopout: React.FC<WindowPopoutProps> = ({ url, title }) => {
  const { toast } = useToast();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [popoutSettings, setPopoutSettings] = useState({
    width: 1200,
    height: 800,
    resizable: true,
    scrollbars: true,
    menubar: false,
    toolbar: false,
    location: false,
    status: false,
    fullscreen: false,
    customTitle: title || 'Google',
    customFavicon: 'https://www.google.com/favicon.ico'
  });

  const presetSizes = [
    { name: 'Desktop', width: 1200, height: 800, icon: <Monitor className="h-4 w-4" /> },
    { name: 'Laptop', width: 1024, height: 768, icon: <Monitor className="h-4 w-4" /> },
    { name: 'Tablet', width: 768, height: 1024, icon: <Smartphone className="h-4 w-4" /> },
    { name: 'Mobile', width: 375, height: 667, icon: <Smartphone className="h-4 w-4" /> },
  ];

  const openPopoutWindow = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL first",
        variant: "destructive"
      });
      return;
    }

    const features = [
      `width=${popoutSettings.width}`,
      `height=${popoutSettings.height}`,
      `resizable=${popoutSettings.resizable ? 'yes' : 'no'}`,
      `scrollbars=${popoutSettings.scrollbars ? 'yes' : 'no'}`,
      `menubar=${popoutSettings.menubar ? 'yes' : 'no'}`,
      `toolbar=${popoutSettings.toolbar ? 'yes' : 'no'}`,
      `location=${popoutSettings.location ? 'yes' : 'no'}`,
      `status=${popoutSettings.status ? 'yes' : 'no'}`,
      'directories=no',
      'copyhistory=no'
    ].join(',');

    try {
      const popupWindow = window.open('', '_blank', features);
      
      if (popupWindow) {
        // Create the HTML content for the popup
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${popoutSettings.customTitle}</title>
              <link rel="icon" href="${popoutSettings.customFavicon}">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  background: linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #a855f7 100%);
                  overflow: hidden;
                  height: 100vh;
                }
                .header {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(10px);
                  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                  padding: 8px 16px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  color: white;
                  font-size: 14px;
                }
                .url-bar {
                  flex: 1;
                  max-width: 400px;
                  padding: 4px 8px;
                  border: 1px solid rgba(255, 255, 255, 0.3);
                  border-radius: 4px;
                  background: rgba(255, 255, 255, 0.1);
                  color: white;
                  font-size: 12px;
                }
                .url-bar::placeholder {
                  color: rgba(255, 255, 255, 0.6);
                }
                iframe {
                  width: 100%;
                  height: calc(100vh - 40px);
                  border: none;
                  background: white;
                }
                .controls {
                  display: flex;
                  gap: 8px;
                  align-items: center;
                }
                .btn {
                  background: rgba(255, 255, 255, 0.2);
                  border: none;
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 12px;
                  transition: background 0.2s;
                }
                .btn:hover {
                  background: rgba(255, 255, 255, 0.3);
                }
                .loading {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: calc(100vh - 40px);
                  color: white;
                  font-size: 18px;
                }
                .spinner {
                  border: 2px solid rgba(255, 255, 255, 0.3);
                  border-top: 2px solid white;
                  border-radius: 50%;
                  width: 24px;
                  height: 24px;
                  animation: spin 1s linear infinite;
                  margin-right: 12px;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="controls">
                  <span style="font-weight: 600;">🛡️ Underground Facility</span>
                </div>
                <input 
                  type="text" 
                  class="url-bar" 
                  value="${url}" 
                  placeholder="Enter URL..."
                  id="urlInput"
                >
                <div class="controls">
                  <button class="btn" onclick="refreshFrame()">↻ Refresh</button>
                  <button class="btn" onclick="toggleFullscreen()">${popoutSettings.fullscreen ? '⛶' : '⛶'} Fullscreen</button>
                  <button class="btn" onclick="window.close()">✕ Close</button>
                </div>
              </div>
              <div class="loading" id="loading">
                <div class="spinner"></div>
                Loading content...
              </div>
              <iframe 
                id="contentFrame" 
                src="${url}" 
                style="display: none;"
                allow="fullscreen; microphone; camera; midi; encrypted-media; picture-in-picture; display-capture"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation"
              ></iframe>
              
              <script>
                const iframe = document.getElementById('contentFrame');
                const loading = document.getElementById('loading');
                const urlInput = document.getElementById('urlInput');
                
                iframe.onload = function() {
                  loading.style.display = 'none';
                  iframe.style.display = 'block';
                  
                  // Update title to match the iframe content when possible
                  try {
                    if (iframe.contentDocument) {
                      const iframeTitle = iframe.contentDocument.title;
                      if (iframeTitle) {
                        document.title = iframeTitle;
                      }
                    }
                  } catch (e) {
                    // Cross-origin restrictions prevent title reading
                  }
                };
                
                function refreshFrame() {
                  loading.style.display = 'flex';
                  iframe.style.display = 'none';
                  iframe.src = iframe.src;
                }
                
                function toggleFullscreen() {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }
                
                urlInput.addEventListener('keypress', function(e) {
                  if (e.key === 'Enter') {
                    const newUrl = this.value;
                    if (newUrl) {
                      loading.style.display = 'flex';
                      iframe.style.display = 'none';
                      iframe.src = newUrl.startsWith('http') ? newUrl : 'https://' + newUrl;
                    }
                  }
                });
                
                // Prevent the popup from being blocked
                window.focus();
              </script>
            </body>
          </html>
        `;

        popupWindow.document.write(htmlContent);
        popupWindow.document.close();

        toast({
          title: "Window Opened",
          description: `Opened ${title || 'website'} in a new popup window`,
        });
      } else {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site to use the window popout feature",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open popup window",
        variant: "destructive"
      });
    }
  };

  const applyPresetSize = (preset: typeof presetSizes[0]) => {
    setPopoutSettings(prev => ({
      ...prev,
      width: preset.width,
      height: preset.height
    }));
  };

  if (showCustomizer) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Maximize2 className="h-5 w-5" />
              <span>Window Popout Settings</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowCustomizer(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={popoutSettings.width}
                onChange={(e) => setPopoutSettings(prev => ({ ...prev, width: parseInt(e.target.value) || 1200 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={popoutSettings.height}
                onChange={(e) => setPopoutSettings(prev => ({ ...prev, height: parseInt(e.target.value) || 800 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preset Sizes</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presetSizes.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPresetSize(preset)}
                  className="flex items-center space-x-2"
                >
                  {preset.icon}
                  <span>{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="resizable">Resizable</Label>
                <Switch
                  id="resizable"
                  checked={popoutSettings.resizable}
                  onCheckedChange={(checked) => setPopoutSettings(prev => ({ ...prev, resizable: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="scrollbars">Scrollbars</Label>
                <Switch
                  id="scrollbars"
                  checked={popoutSettings.scrollbars}
                  onCheckedChange={(checked) => setPopoutSettings(prev => ({ ...prev, scrollbars: checked }))}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="menubar">Menu Bar</Label>
                <Switch
                  id="menubar"
                  checked={popoutSettings.menubar}
                  onCheckedChange={(checked) => setPopoutSettings(prev => ({ ...prev, menubar: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="toolbar">Tool Bar</Label>
                <Switch
                  id="toolbar"
                  checked={popoutSettings.toolbar}
                  onCheckedChange={(checked) => setPopoutSettings(prev => ({ ...prev, toolbar: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customTitle">Window Title</Label>
              <Input
                id="customTitle"
                value={popoutSettings.customTitle}
                onChange={(e) => setPopoutSettings(prev => ({ ...prev, customTitle: e.target.value }))}
                placeholder="Enter window title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customFavicon">Favicon URL</Label>
              <Input
                id="customFavicon"
                value={popoutSettings.customFavicon}
                onChange={(e) => setPopoutSettings(prev => ({ ...prev, customFavicon: e.target.value }))}
                placeholder="Enter favicon URL..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCustomizer(false)}>
              Cancel
            </Button>
            <Button 
              onClick={openPopoutWindow}
              className="bg-gradient-to-r from-primary to-accent"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Window
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={openPopoutWindow}
        variant="outline"
        size="sm"
        className="border-primary/20 hover:bg-primary/5"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Quick Popout
      </Button>
      <Button
        onClick={() => setShowCustomizer(true)}
        variant="outline"
        size="sm"
        className="border-primary/20 hover:bg-primary/5"
      >
        <Maximize2 className="h-4 w-4 mr-2" />
        Customize
      </Button>
    </div>
  );
};