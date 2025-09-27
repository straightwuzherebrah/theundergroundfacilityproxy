import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import { CloakingSettings } from './CloakingSettings';
import { TabManager } from './TabManager';
import { WindowPopout } from './WindowPopout';
import { ProxyEngine } from './ProxyEngine';
import { AdvancedFeatures } from './AdvancedFeatures';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/useTheme';

interface ProxyTab {
  id: string;
  title: string;
  url: string;
  active: boolean;
  favicon?: string;
}

const ProxyInterface = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tabs, setTabs] = useState<ProxyTab[]>([
    { id: '1', title: 'Home', url: '', active: true }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');

  const quickLinks = [
    { name: 'Google', url: 'google.com', icon: <Search className="h-4 w-4" />, category: 'search' },
    { name: 'YouTube', url: 'youtube.com', icon: <Youtube className="h-4 w-4" />, category: 'media' },
    { name: 'Discord', url: 'discord.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'Netflix', url: 'netflix.com', icon: <Globe className="h-4 w-4" />, category: 'media' },
    { name: 'Spotify', url: 'spotify.com', icon: <Globe className="h-4 w-4" />, category: 'media' },
    { name: 'GitHub', url: 'github.com', icon: <Globe className="h-4 w-4" />, category: 'dev' },
    { name: 'Reddit', url: 'reddit.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'Instagram', url: 'instagram.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'Twitter', url: 'twitter.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'TikTok', url: 'tiktok.com', icon: <Globe className="h-4 w-4" />, category: 'social' },
    { name: 'Twitch', url: 'twitch.tv', icon: <Globe className="h-4 w-4" />, category: 'media' },
    { name: 'Amazon', url: 'amazon.com', icon: <Globe className="h-4 w-4" />, category: 'shopping' },
  ];

  const games = [
    { name: 'Shell Shockers', url: 'shellshock.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Krunker', url: 'krunker.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: '1v1.LOL', url: '1v1.lol', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Drift Hunters', url: 'drifthunters.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Slope Game', url: 'slope-game.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Agar.io', url: 'agar.io', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Paper.io', url: 'paper-io.com', icon: <Gamepad2 className="h-4 w-4" /> },
    { name: 'Bloons TD', url: 'bloons.com', icon: <Gamepad2 className="h-4 w-4" /> },
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                The Underground Facility
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvanced(true)}
              className="glass"
            >
              <Settings className="h-4 w-4 mr-2" />
              Features
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="glass"
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
        <Card className="glass-card">
          <CardContent className="p-4">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Input
                    type="url"
                    placeholder="Enter URL or search term..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavigate(url)}
                    className="liquid-input pl-12 h-12 text-foreground placeholder:text-foreground/60 border-0"
                  />
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground/70" />
                </div>
                <Button 
                  onClick={() => handleNavigate(url)}
                  disabled={isLoading}
                  className="liquid-button h-12 px-6"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <ExternalLink className="h-5 w-5" />
                  )}
                </Button>
                
                {/* Window Popout Controls */}
                <WindowPopout url={url} title={currentTab?.title || 'The Underground Facility'} />
              </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Tabs defaultValue="sites" className="w-full">
          <TabsList className="glass-strong grid w-full grid-cols-3 h-12">
            <TabsTrigger value="sites" className="data-[state=active]:glass-strong data-[state=active]:text-foreground text-foreground/80 rounded-lg">
              Popular Sites
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:glass-strong data-[state=active]:text-foreground text-foreground/80 rounded-lg">
              Games
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:glass-strong data-[state=active]:text-foreground text-foreground/80 rounded-lg">
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sites" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickLinks.map((link) => (
                <Card 
                  key={link.name}
                  className="cursor-pointer glass-card group"
                  onClick={() => handleNavigate(link.url)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-foreground text-lg">{link.icon}</div>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{link.name}</p>
                    <Badge variant="secondary" className="glass text-xs">
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
                  className="cursor-pointer glass-card group"
                  onClick={() => handleNavigate(game.url)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-foreground text-lg">{game.icon}</div>
                    </div>
                    <p className="text-sm font-medium text-foreground">{game.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-2">
                    <Shield className="h-6 w-6 text-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Proxy Status</p>
                  <Badge variant="secondary" className="mt-1">Active</Badge>
                </CardContent>
              </Card>
              
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-2">
                    <Eye className="h-6 w-6 text-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Tab Cloaking</p>
                  <Badge variant="secondary" className="mt-1">Enabled</Badge>
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

export default ProxyInterface;