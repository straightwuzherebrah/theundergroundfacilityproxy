import ProxyInterface from '@/components/ProxyInterface';
import { PasswordProtection } from '@/components/PasswordProtection';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

const Index = () => {
  const { settings, isAuthenticated, authenticate } = useSettings();
  const { theme } = useTheme();

  useEffect(() => {
    // Apply initial settings on page load
    if (settings.tabCloaking && settings.dynamicTitle) {
      document.title = settings.customTitle;
      
      // Create or update favicon
      let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = settings.customFavicon;
    }
  }, [settings]);

  // Show password protection if enabled and not authenticated
  if (settings.passwordProtection && !isAuthenticated) {
    return <PasswordProtection onAuthenticate={authenticate} />;
  }

  return <ProxyInterface />;
};

export default Index;
