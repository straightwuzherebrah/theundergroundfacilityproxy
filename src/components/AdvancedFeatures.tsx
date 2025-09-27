import React, { useRef } from 'react';
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
  Settings,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';

interface AdvancedFeaturesProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({ 
  isVisible, 
  onClose 
}) => {
  const { toast } = useToast();
  const { settings, updateSetting, enableAboutBlank, exportSettings, importSettings } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const updateFeature = (key: keyof typeof settings, value: any) => {
    updateSetting(key, value);
    
    // Show feedback for certain features
    switch (key) {
      case 'historyFlooding':
        if (value) {
          toast({
            title: "History Flooding Enabled",
            description: "Browser history will be flooded with educational sites",
          });
        }
        break;
      case 'panicKey':
        toast({
          title: "Panic Key Updated",
          description: `Press ${value} to quickly redirect to safe URL`,
        });
        break;
    }
  };

  const handleAboutBlank = () => {
    const success = enableAboutBlank();
    if (success) {
      toast({
        title: "About:Blank Window Opened",
        description: "New cloaked window created successfully",
      });
    } else {
      toast({
        title: "Failed to Open Window",
        description: "Please allow popups for this site",
        variant: "destructive"
      });
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importSettings(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const applyPreset = (preset: typeof presetTitles[0]) => {
    updateFeature('customTitle', preset.title);
    updateFeature('customFavicon', preset.favicon);
    
    toast({
      title: "Preset Applied",
      description: `Tab disguised as ${preset.name}`,
    });
  };

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
                  value={settings.customTitle}
                  onChange={(e) => updateFeature('customTitle', e.target.value)}
                  placeholder="Enter custom title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  value={settings.customFavicon}
                  onChange={(e) => updateFeature('customFavicon', e.target.value)}
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
                  checked={settings.dynamicTitle}
                  onCheckedChange={(checked) => updateFeature('dynamicTitle', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="aboutBlank">About:Blank Cloaking</Label>
                <Button
                  onClick={handleAboutBlank}
                  variant="outline"
                  size="sm"
                >
                  Open About:Blank
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="panicKey">Panic Key</Label>
                <Input
                  id="panicKey"
                  value={settings.panicKey}
                  onChange={(e) => updateFeature('panicKey', e.target.value)}
                  placeholder="Enter key (e.g., Escape)"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="historyFlooding">History Flooding</Label>
                <Switch
                  id="historyFlooding"
                  checked={settings.historyFlooding}
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
                value={settings.userAgent}
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
                  checked={settings.cookieHandling}
                  onCheckedChange={(checked) => updateFeature('cookieHandling', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="javascriptEnabled">Enable JavaScript</Label>
                <Switch
                  id="javascriptEnabled"
                  checked={settings.javascriptEnabled}
                  onCheckedChange={(checked) => updateFeature('javascriptEnabled', checked)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="httpsUpgrade">HTTPS Upgrade</Label>
                <Switch
                  id="httpsUpgrade"
                  checked={settings.httpsUpgrade}
                  onCheckedChange={(checked) => updateFeature('httpsUpgrade', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="corsProxy">CORS Proxy</Label>
                <Switch
                  id="corsProxy"
                  checked={settings.corsProxy}
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
                  checked={settings.fingerPrintResistance}
                  onCheckedChange={(checked) => updateFeature('fingerPrintResistance', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="webRTCBlocking">Block WebRTC</Label>
                <Switch
                  id="webRTCBlocking"
                  checked={settings.webRTCBlocking}
                  onCheckedChange={(checked) => updateFeature('webRTCBlocking', checked)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="geolocationBlocking">Block Geolocation</Label>
                <Switch
                  id="geolocationBlocking"
                  checked={settings.geolocationBlocking}
                  onCheckedChange={(checked) => updateFeature('geolocationBlocking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="adBlocker">Ad Blocker</Label>
                <Switch
                  id="adBlocker"
                  checked={settings.adBlocker}
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
                  checked={settings.cacheEnabled}
                  onCheckedChange={(checked) => updateFeature('cacheEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="compression">Enable Compression</Label>
                <Switch
                  id="compression"
                  checked={settings.compression}
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
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};