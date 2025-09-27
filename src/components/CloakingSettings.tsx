import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Shield, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Palette, 
  Lock,
  Settings,
  Monitor,
  Smartphone,
  Globe,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/useTheme';

interface CloakingSettingsProps {
  onClose: () => void;
}

export const CloakingSettings: React.FC<CloakingSettingsProps> = ({ onClose }) => {
  const { toast } = useToast();
  const { settings, updateSetting, enableAboutBlank, exportSettings, importSettings } = useSettings();
  const { theme, changeTheme, themes } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeOptions = [
    { id: 'pink', name: 'Pink (Default)', colors: ['#ec4899', '#f472b6'] },
    { id: 'blue', name: 'Ocean Blue', colors: ['#3b82f6', '#60a5fa'] },
    { id: 'purple', name: 'Galaxy Purple', colors: ['#8b5cf6', '#a78bfa'] },
    { id: 'green', name: 'Forest Green', colors: ['#10b981', '#34d399'] },
    { id: 'dark', name: 'Stealth Dark', colors: ['#374151', '#4b5563'] }
  ];

  const panicKeys = [
    { value: 'Space', label: 'Spacebar' },
    { value: 'Escape', label: 'Escape' },
    { value: 'F1', label: 'F1' },
    { value: 'ControlShift', label: 'Ctrl + Shift' }
  ];

  const presetCloaks = [
    { name: 'Google', title: 'Google', favicon: 'https://www.google.com/favicon.ico' },
    { name: 'Google Classroom', title: 'Google Classroom', favicon: 'https://ssl.gstatic.com/classroom/favicon.png' },
    { name: 'Canvas', title: 'Canvas', favicon: 'https://canvas.instructure.com/favicon.ico' },
    { name: 'Wikipedia', title: 'Wikipedia', favicon: 'https://www.wikipedia.org/favicon.ico' },
    { name: 'Khan Academy', title: 'Khan Academy', favicon: 'https://www.khanacademy.org/favicon.ico' }
  ];

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSetting(key, value);
  };

  const applyPresetCloak = (preset: typeof presetCloaks[0]) => {
    handleSettingChange('customTitle', preset.title);
    handleSettingChange('customFavicon', preset.favicon);
    toast({
      title: "Cloak Applied",
      description: `Applied ${preset.name} cloak preset`,
    });
  };

  const handleAboutBlank = () => {
    const success = enableAboutBlank();
    if (success) {
      toast({
        title: "About:Blank Opened",
        description: "New cloaked window opened in about:blank",
      });
    } else {
      toast({
        title: "Failed to Open",
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

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-primary/20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="border-b border-primary/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Underground Facility Settings</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="cloaking" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="cloaking">Cloaking</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="cloaking" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Tab Cloaking</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Change the tab title and favicon to disguise the site
                    </p>
                  </div>
                  <Switch
                    checked={settings.tabCloaking}
                    onCheckedChange={(checked) => handleSettingChange('tabCloaking', checked)}
                  />
                </div>

                {settings.tabCloaking && (
                  <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customTitle">Custom Title</Label>
                        <Input
                          id="customTitle"
                          value={settings.customTitle}
                          onChange={(e) => handleSettingChange('customTitle', e.target.value)}
                          placeholder="Enter custom title..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customFavicon">Favicon URL</Label>
                        <Input
                          id="customFavicon"
                          value={settings.customFavicon}
                          onChange={(e) => handleSettingChange('customFavicon', e.target.value)}
                          placeholder="Enter favicon URL..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Quick Presets</Label>
                      <div className="flex flex-wrap gap-2">
                        {presetCloaks.map((preset) => (
                          <Button
                            key={preset.name}
                            variant="outline"
                            size="sm"
                            onClick={() => applyPresetCloak(preset)}
                            className="flex items-center space-x-2"
                          >
                            <img src={preset.favicon} alt="" className="h-4 w-4" />
                            <span>{preset.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>About:Blank Cloaking</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Open the site in a new about:blank window for maximum stealth
                    </p>
                  </div>
                  <Button
                    onClick={handleAboutBlank}
                    className="bg-gradient-to-r from-primary to-accent"
                  >
                    Open About:Blank
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium flex items-center space-x-2">
                      <EyeOff className="h-4 w-4" />
                      <span>Hide in History</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent the site from appearing in browser history
                    </p>
                  </div>
                  <Switch
                    checked={settings.hideInHistory}
                    onCheckedChange={(checked) => handleSettingChange('hideInHistory', checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Password Protection</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Require a password to access the proxy
                    </p>
                  </div>
                  <Switch
                    checked={settings.passwordProtection}
                    onCheckedChange={(checked) => handleSettingChange('passwordProtection', checked)}
                  />
                </div>

                {settings.passwordProtection && (
                  <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={settings.password}
                        onChange={(e) => handleSettingChange('password', e.target.value)}
                        placeholder="Enter password..."
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Label className="text-base font-medium">Panic Key Settings</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="panicKey">Panic Key</Label>
                      <Select value={settings.panicKey} onValueChange={(value) => handleSettingChange('panicKey', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {panicKeys.map((key) => (
                            <SelectItem key={key.value} value={key.value}>
                              {key.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panicUrl">Panic URL</Label>
                      <Input
                        id="panicUrl"
                        value={settings.panicUrl}
                        onChange={(e) => handleSettingChange('panicUrl', e.target.value)}
                        placeholder="URL to redirect to on panic..."
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Press the panic key to instantly redirect to a safe URL
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span>Theme Selection</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themeOptions.map((themeOption) => (
                      <Card
                        key={themeOption.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          theme === themeOption.id 
                            ? 'ring-2 ring-primary border-primary' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => {
                          changeTheme(themeOption.id as any);
                          handleSettingChange('theme', themeOption.id);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              {themeOption.colors.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{themeOption.name}</p>
                              {theme === themeOption.id && (
                                <Badge className="mt-1">Current</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Export/Import Settings</Label>
                  <div className="flex space-x-2">
                    <Button onClick={exportSettings} variant="outline">
                      Export Settings
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
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

                <div className="space-y-2">
                  <Label className="text-base font-medium">Device Detection</Label>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Monitor className="h-3 w-3" />
                      <span>Desktop Mode</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Globe className="h-3 w-3" />
                      <span>Proxy Active</span>
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Performance Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable Hardware Acceleration</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Preload Popular Sites</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-Clear Cache</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6 pt-6 border-t border-primary/20">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Your preferences have been saved successfully",
                });
                onClose();
              }}
              className="bg-gradient-to-r from-primary to-accent"
            >
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};