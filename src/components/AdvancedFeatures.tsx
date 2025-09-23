import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Monitor, 
  Globe, 
  Zap,
  Lock,
  Wifi,
  Server,
  Database,
  Clock,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdvancedFeaturesProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({ 
  isVisible, 
  onClose 
}) => {
  const { toast } = useToast();
  const [features, setFeatures] = useState({
    // Interstellar Features
    dynamicTitle: true,
    favicon: 'https://classroom.google.com/favicon.ico',
    customTitle: 'Google Classroom',
    aboutBlank: false,
    panicKey: 'Escape',
    historyFlooding: false,
    
    // Proxy Features
    userAgent: 'default',
    cookieHandling: true,
    javascriptEnabled: true,
    adBlocker: false,
    popupBlocker: true,
    
    // Security Features
    httpsUpgrade: true,
    referrerPolicy: 'no-referrer',
    corsProxy: true,
    ipSpoofing: false,
    
    // Performance Features
    cacheEnabled: true,
    compression: true,
    prefetch: false,
    
    // Stealth Features
    fingerPrintResistance: true,
    canvasBlocking: false,
    webRTCBlocking: true,
    geolocationBlocking: true
  });

  const presetTitles = [
    { name: 'Google Classroom', title: 'Google Classroom', favicon: 'https://classroom.google.com/favicon.ico' },
    { name: 'Khan Academy', title: 'Khan Academy', favicon: 'https://www.khanacademy.org/favicon.ico' },
    { name: 'Schoology', title: 'Schoology', favicon: 'https://asset-cdn.schoology.com/favicon.ico' },
    { name: 'Canvas', title: 'Canvas', favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' },
    { name: 'Google Docs', title: 'Google Docs', favicon: 'https://docs.google.com/favicon.ico' },
    { name: 'Wikipedia', title: 'Wikipedia', favicon: 'https://www.wikipedia.org/favicon.ico' }
  ];

  const userAgents = [
    { name: 'Default', value: 'default' },
    { name: 'Chrome Windows', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
    { name: 'Firefox Windows', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0' },
    { name: 'Safari macOS', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15' },
    { name: 'Mobile Chrome', value: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' }
  ];

  const updateFeature = (key: string, value: any) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
    
    // Apply feature immediately
    switch (key) {
      case 'customTitle':
      case 'dynamicTitle':
        if (features.dynamicTitle) {
          document.title = value || 'The Underground Facility';
        }
        break;
      case 'favicon':
        updateFavicon(value);
        break;
      case 'aboutBlank':
        if (value) {
          enableAboutBlank();
        }
        break;
      case 'panicKey':
        setupPanicKey(value);
        break;
      case 'historyFlooding':
        if (value) {
          startHistoryFlooding();
        }
        break;
    }
  };

  const updateFavicon = (faviconUrl: string) => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  const enableAboutBlank = () => {
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${features.customTitle}</title>
            <link rel="icon" href="${features.favicon}">
          </head>
          <body style="margin:0;padding:0;">
            <iframe src="${window.location.href}" style="width:100%;height:100vh;border:none;"></iframe>
          </body>
        </html>
      `);
      newWindow.document.close();
      window.location.href = 'about:blank';
    }
  };

  const setupPanicKey = (key: string) => {
    document.addEventListener('keydown', (e) => {
      if (e.key === key) {
        window.location.href = 'https://classroom.google.com';
      }
    });
  };

  const startHistoryFlooding = () => {
    const urls = [
      'https://classroom.google.com',
      'https://www.khanacademy.org',
      'https://www.wikipedia.org',
      'https://docs.google.com',
      'https://www.edpuzzle.com'
    ];
    
    for (let i = 0; i < 50; i++) {
      const randomUrl = urls[Math.floor(Math.random() * urls.length)];
      window.history.pushState({}, '', randomUrl);
    }
  };

  const applyPreset = (preset: typeof presetTitles[0]) => {
    updateFeature('customTitle', preset.title);
    updateFeature('favicon', preset.favicon);
    
    toast({
      title: "Preset Applied",
      description: `Tab disguised as ${preset.name}`,
    });
  };

  const exportSettings = () => {
    const settingsBlob = new Blob([JSON.stringify(features, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(settingsBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'underground-facility-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setFeatures(importedSettings);
          toast({
            title: "Settings Imported",
            description: "Your settings have been successfully imported",
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid settings file",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (features.dynamicTitle) {
      document.title = features.customTitle;
    }
    updateFavicon(features.favicon);
  }, [features.customTitle, features.favicon, features.dynamicTitle]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-primary/20 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Advanced Features & Settings</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Tab Cloaking Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Tab Cloaking & Stealth</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customTitle">Custom Tab Title</Label>
                <Input
                  id="customTitle"
                  value={features.customTitle}
                  onChange={(e) => updateFeature('customTitle', e.target.value)}
                  placeholder="Enter custom title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  value={features.favicon}
                  onChange={(e) => updateFeature('favicon', e.target.value)}
                  placeholder="Enter favicon URL..."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Quick Presets</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {presetTitles.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="justify-start"
                  >
                    <img src={preset.favicon} alt="" className="h-4 w-4 mr-2" />
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dynamicTitle">Dynamic Title Updates</Label>
                <Switch
                  id="dynamicTitle"
                  checked={features.dynamicTitle}
                  onCheckedChange={(checked) => updateFeature('dynamicTitle', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="aboutBlank">About:Blank Cloaking</Label>
                <Switch
                  id="aboutBlank"
                  checked={features.aboutBlank}
                  onCheckedChange={(checked) => updateFeature('aboutBlank', checked)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="panicKey">Panic Key</Label>
                <Input
                  id="panicKey"
                  value={features.panicKey}
                  onChange={(e) => updateFeature('panicKey', e.target.value)}
                  placeholder="Enter key (e.g., Escape)"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="historyFlooding">History Flooding</Label>
                <Switch
                  id="historyFlooding"
                  checked={features.historyFlooding}
                  onCheckedChange={(checked) => updateFeature('historyFlooding', checked)}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Proxy Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Proxy Configuration</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userAgent">User Agent</Label>
              <select
                id="userAgent"
                value={features.userAgent}
                onChange={(e) => updateFeature('userAgent', e.target.value)}
                className="w-full p-2 border border-primary/20 rounded-md bg-background"
              >
                {userAgents.map((agent) => (
                  <option key={agent.value} value={agent.value}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="cookieHandling">Cookie Handling</Label>
                <Switch
                  id="cookieHandling"
                  checked={features.cookieHandling}
                  onCheckedChange={(checked) => updateFeature('cookieHandling', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="javascriptEnabled">Enable JavaScript</Label>
                <Switch
                  id="javascriptEnabled"
                  checked={features.javascriptEnabled}
                  onCheckedChange={(checked) => updateFeature('javascriptEnabled', checked)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="httpsUpgrade">HTTPS Upgrade</Label>
                <Switch
                  id="httpsUpgrade"
                  checked={features.httpsUpgrade}
                  onCheckedChange={(checked) => updateFeature('httpsUpgrade', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="corsProxy">CORS Proxy</Label>
                <Switch
                  id="corsProxy"
                  checked={features.corsProxy}
                  onCheckedChange={(checked) => updateFeature('corsProxy', checked)}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Security & Privacy Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Security & Privacy</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="fingerPrintResistance">Fingerprint Resistance</Label>
                <Switch
                  id="fingerPrintResistance"
                  checked={features.fingerPrintResistance}
                  onCheckedChange={(checked) => updateFeature('fingerPrintResistance', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="webRTCBlocking">Block WebRTC</Label>
                <Switch
                  id="webRTCBlocking"
                  checked={features.webRTCBlocking}
                  onCheckedChange={(checked) => updateFeature('webRTCBlocking', checked)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="geolocationBlocking">Block Geolocation</Label>
                <Switch
                  id="geolocationBlocking"
                  checked={features.geolocationBlocking}
                  onCheckedChange={(checked) => updateFeature('geolocationBlocking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="adBlocker">Ad Blocker</Label>
                <Switch
                  id="adBlocker"
                  checked={features.adBlocker}
                  onCheckedChange={(checked) => updateFeature('adBlocker', checked)}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Performance Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Performance</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="cacheEnabled">Enable Caching</Label>
                <Switch
                  id="cacheEnabled"
                  checked={features.cacheEnabled}
                  onCheckedChange={(checked) => updateFeature('cacheEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="compression">Enable Compression</Label>
                <Switch
                  id="compression"
                  checked={features.compression}
                  onCheckedChange={(checked) => updateFeature('compression', checked)}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Settings Import/Export */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Settings Management</h3>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={exportSettings} variant="outline">
                Export Settings
              </Button>
              <Button asChild variant="outline">
                <label htmlFor="importSettings" className="cursor-pointer">
                  Import Settings
                  <input
                    id="importSettings"
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={features.dynamicTitle ? "default" : "secondary"}>
              <Eye className="h-3 w-3 mr-1" />
              Tab Cloaking: {features.dynamicTitle ? 'ON' : 'OFF'}
            </Badge>
            <Badge variant={features.httpsUpgrade ? "default" : "secondary"}>
              <Lock className="h-3 w-3 mr-1" />
              HTTPS: {features.httpsUpgrade ? 'ON' : 'OFF'}
            </Badge>
            <Badge variant={features.corsProxy ? "default" : "secondary"}>
              <Server className="h-3 w-3 mr-1" />
              CORS Proxy: {features.corsProxy ? 'ON' : 'OFF'}
            </Badge>
            <Badge variant={features.fingerPrintResistance ? "default" : "secondary"}>
              <Shield className="h-3 w-3 mr-1" />
              Fingerprint Protection: {features.fingerPrintResistance ? 'ON' : 'OFF'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};