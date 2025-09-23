import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Settings, 
  Shield, 
  Eye, 
  Globe,
  Gamepad2,
  Youtube,
  Search,
  Monitor,
  Smartphone
} from 'lucide-react';
import { CloakingSettings } from './CloakingSettings';
import { TabManager } from './TabManager';
import { WindowPopout } from './WindowPopout';
import { ProxyEngine } from './ProxyEngine';
import { AdvancedFeatures } from './AdvancedFeatures';

interface ProxyTab {
  id: string;
  title: string;
  url: string;
  active: boolean;
  favicon?: string;
}

export const ProxyInterface = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tabs, setTabs] = useState<ProxyTab[]>([
    { id: '1', title: 'Home', url: '', active: true }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');

  const quickLinks = [
    { name: 'Google', url: 'https://google.com', icon: <Search className="h-4 w-4" />, category: 'search' },
    { name: 'YouTube', url: 'https://youtube.com', icon: <Youtube className="h-4 w-4" />, category: 'media' },
    { name: 'Discord', url: 'https://discord.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'Netflix', url: 'https://netflix.com', icon: <Globe className="h-4 w-4" />, category: 'media' },
    { name: 'Spotify', url: 'https://spotify.com', icon: <Globe className="h-4 w-4" />, category: 'media' },
    { name: 'GitHub', url: 'https://github.com', icon: <Globe className="h-4 w-4" />, category: 'dev' },
    { name: 'Reddit', url: 'https://reddit.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'Instagram', url: 'https://instagram.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'Twitter', url: 'https://twitter.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'TikTok', url: 'https://tiktok.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'Twitch', url: 'https://twitch.tv', icon: <Globe className="h-4 w-4" />, category: 'media' },
    { name: 'Amazon', url: 'https://amazon.com', icon: <Globe className="h-4 w-4" />, category: 'shopping' },
  ];

  const games = [
    { name: 'Shell Shockers', url: 'https://shellshock.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Krunker', url: 'https://krunker.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: '1v1.LOL', url: 'https://1v1.lol', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Drift Hunters', url: 'https://drifthunters.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Slope Game', url: 'https://slope-game.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Agar.io', url: 'https://agar.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Paper.io', url: 'https://paper-io.com', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Bloons TD', url: 'https://bloons.com', icon: <Gamepad2 className="h-4 w-4" /> },
  ];

  const handleNavigate = (targetUrl: string) => {
    if (!targetUrl) return;
    
    setIsLoading(true);
    
    // Add protocol if missing
    const formattedUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    
    // Update active tab
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, url: formattedUrl, title: new URL(formattedUrl).hostname }
        : tab
    );
    
    setTabs(updatedTabs);
    setUrl(formattedUrl);
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000);
  };

  const createNewTab = () => {
    const newId = Date.now().toString();
    const newTab: ProxyTab = {
      id: newId,
      title: 'New Tab',
      url: '',
      active: true
    };
    
    const updatedTabs = tabs.map(tab => ({ ...tab, active: false }));
    setTabs([...updatedTabs, newTab]);
    setActiveTabId(newId);
    setUrl('');
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return; // Don't close last tab
    
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);
    
    if (tabId === activeTabId) {
      const newActiveTab = updatedTabs[0];
      setActiveTabId(newActiveTab.id);
      setUrl(newActiveTab.url);
    }
  };

  const switchTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    setActiveTabId(tabId);
    setUrl(tab.url);
    
    const updatedTabs = tabs.map(t => ({ ...t, active: t.id === tabId }));
    setTabs(updatedTabs);
  };

  const currentTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                The Underground Facility
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvanced(true)}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Features
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Cloaking
            </Button>
          </div>
        </div>

        {/* Tab Manager */}
        <TabManager
          tabs={tabs}
          activeTabId={activeTabId}
          onSwitchTab={switchTab}
          onCloseTab={closeTab}
          onNewTab={createNewTab}
        />

        {/* URL Input */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  type="url"
                  placeholder="Enter URL or search term..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNavigate(url)}
                  className="pl-10 border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white/40"
                />
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              </div>
              <Button 
                onClick={() => handleNavigate(url)}
                disabled={isLoading}
                className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/20"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Tabs defaultValue="sites" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="sites" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80">
              Popular Sites
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80">
              Games
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80">
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sites" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickLinks.map((link) => (
                <Card 
                  key={link.name}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  onClick={() => handleNavigate(link.url)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mb-2">
                      <div className="text-white">{link.icon}</div>
                    </div>
                    <p className="text-sm font-medium text-white">{link.name}</p>
                    <Badge variant="secondary" className="mt-1 text-xs bg-white/20 text-white">
                      {link.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {games.map((game) => (
                <Card 
                  key={game.name}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  onClick={() => handleNavigate(game.url)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mb-2">
                      <div className="text-white">{game.icon}</div>
                    </div>
                    <p className="text-sm font-medium text-white">{game.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mb-2">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-white">Proxy Status</p>
                  <Badge className="mt-1 bg-green-500/20 text-green-300">Active</Badge>
                </CardContent>
              </Card>
              
              <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mb-2">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-white">Tab Cloaking</p>
                  <Badge className="mt-1 bg-blue-500/20 text-blue-300">Enabled</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Proxy Engine - Real browsing interface */}
        <ProxyEngine
          url={currentTab?.url || ''}
          title={currentTab?.title || 'The Underground Facility'}
          onNavigate={(newUrl) => {
            const updatedTabs = tabs.map(tab => 
              tab.id === activeTabId 
                ? { ...tab, url: newUrl, title: newUrl ? new URL(newUrl).hostname : 'New Tab' }
                : tab
            );
            setTabs(updatedTabs);
            setUrl(newUrl);
          }}
          onTitleChange={(newTitle) => {
            const updatedTabs = tabs.map(tab => 
              tab.id === activeTabId 
                ? { ...tab, title: newTitle }
                : tab
            );
            setTabs(updatedTabs);
          }}
        />
      </div>

      {/* Settings Modals */}
      {showSettings && (
        <CloakingSettings onClose={() => setShowSettings(false)} />
      )}
      
      {showAdvanced && (
        <AdvancedFeatures 
          isVisible={showAdvanced}
          onClose={() => setShowAdvanced(false)} 
        />
      )}
    </div>
  );
};