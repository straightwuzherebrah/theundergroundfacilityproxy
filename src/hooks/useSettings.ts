import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface AppSettings {
  // Tab Cloaking
  tabCloaking: boolean;
  aboutBlankCloaking: boolean;
  customTitle: string;
  customFavicon: string;
  hideInHistory: boolean;
  
  // Security
  passwordProtection: boolean;
  password: string;
  panicKey: string;
  panicUrl: string;
  
  // Theme
  theme: string;
  
  // Advanced Features
  dynamicTitle: boolean;
  historyFlooding: boolean;
  userAgent: string;
  cookieHandling: boolean;
  javascriptEnabled: boolean;
  httpsUpgrade: boolean;
  corsProxy: boolean;
  fingerPrintResistance: boolean;
  webRTCBlocking: boolean;
  geolocationBlocking: boolean;
  adBlocker: boolean;
  cacheEnabled: boolean;
  compression: boolean;
}

const defaultSettings: AppSettings = {
  // Tab Cloaking
  tabCloaking: true,
  aboutBlankCloaking: false,
  customTitle: 'Google',
  customFavicon: 'https://www.google.com/favicon.ico',
  hideInHistory: true,
  
  // Security
  passwordProtection: false,
  password: '',
  panicKey: 'Space',
  panicUrl: 'https://classroom.google.com',
  
  // Theme
  theme: 'pink',
  
  // Advanced Features
  dynamicTitle: true,
  historyFlooding: false,
  userAgent: 'default',
  cookieHandling: true,
  javascriptEnabled: true,
  httpsUpgrade: true,
  corsProxy: true,
  fingerPrintResistance: true,
  webRTCBlocking: true,
  geolocationBlocking: true,
  adBlocker: false,
  cacheEnabled: true,
  compression: true,
};

export const useSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    
    try {
      const saved = localStorage.getItem('underground-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !settings.passwordProtection || sessionStorage.getItem('underground-auth') === 'true';
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('underground-settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applySettings = (currentSettings: AppSettings) => {
    // Apply tab cloaking
    if (currentSettings.tabCloaking && currentSettings.dynamicTitle) {
      document.title = currentSettings.customTitle;
      updateFavicon(currentSettings.customFavicon);
    }

    // Apply panic key
    setupPanicKey(currentSettings.panicKey, currentSettings.panicUrl);

    // Apply history flooding if enabled
    if (currentSettings.historyFlooding) {
      performHistoryFlooding();
    }

    // Apply user agent spoofing
    if (currentSettings.userAgent !== 'default') {
      // This would need to be implemented at the proxy level
      console.log('User agent spoofing:', currentSettings.userAgent);
    }
  };

  const updateFavicon = (faviconUrl: string) => {
    try {
      let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = faviconUrl;
    } catch (error) {
      console.warn('Failed to update favicon:', error);
    }
  };

  const setupPanicKey = (key: string, redirectUrl: string) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let shouldTrigger = false;

      switch (key) {
        case 'Space':
          shouldTrigger = event.code === 'Space' && event.ctrlKey && event.shiftKey;
          break;
        case 'Escape':
          shouldTrigger = event.key === 'Escape';
          break;
        case 'F1':
          shouldTrigger = event.key === 'F1';
          break;
        case 'ControlShift':
          shouldTrigger = event.ctrlKey && event.shiftKey && event.key === 'P';
          break;
        default:
          shouldTrigger = event.key === key;
      }

      if (shouldTrigger) {
        event.preventDefault();
        window.location.href = redirectUrl;
      }
    };

    // Remove existing listeners
    document.removeEventListener('keydown', handleKeyDown);
    // Add new listener
    document.addEventListener('keydown', handleKeyDown);
  };

  const performHistoryFlooding = () => {
    const educationalUrls = [
      'https://classroom.google.com',
      'https://www.khanacademy.org',
      'https://www.wikipedia.org',
      'https://docs.google.com',
      'https://www.edpuzzle.com',
      'https://www.coursera.org',
      'https://canvas.instructure.com',
      'https://www.schoology.com',
    ];

    // Add 25 educational URLs to history
    for (let i = 0; i < 25; i++) {
      const randomUrl = educationalUrls[Math.floor(Math.random() * educationalUrls.length)];
      window.history.pushState({}, '', randomUrl + `?t=${Date.now()}`);
    }

    // Return to current page
    window.history.pushState({}, '', window.location.href);
  };

  const enableAboutBlank = () => {
    try {
      const aboutBlankWindow = window.open('about:blank', '_blank');
      if (aboutBlankWindow) {
        aboutBlankWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${settings.customTitle}</title>
              <link rel="icon" href="${settings.customFavicon}">
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  background: ${settings.theme === 'dark' ? '#111' : 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #a855f7 100%)'};
                  overflow: hidden;
                }
                iframe {
                  width: 100vw;
                  height: 100vh;
                  border: none;
                }
              </style>
            </head>
            <body>
              <iframe src="${window.location.origin}" allow="fullscreen"></iframe>
            </body>
          </html>
        `);
        aboutBlankWindow.document.close();
        return true;
      }
    } catch (error) {
      console.warn('Failed to open about:blank window:', error);
    }
    return false;
  };

  const authenticate = (password: string): boolean => {
    if (password === settings.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('underground-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('underground-auth');
  };

  const exportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'underground-facility-settings.json';
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Settings Exported",
        description: "Your settings have been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export settings",
        variant: "destructive"
      });
    }
  };

  const importSettings = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings({ ...defaultSettings, ...importedSettings });
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
  };

  return {
    settings,
    updateSetting,
    isAuthenticated,
    authenticate,
    logout,
    enableAboutBlank,
    exportSettings,
    importSettings,
    applySettings: () => applySettings(settings),
  };
};