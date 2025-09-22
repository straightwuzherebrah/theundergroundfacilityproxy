import { ProxyInterface } from '@/components/ProxyInterface';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Set initial tab cloaking
    document.title = 'Google';
    
    // Create or update favicon
    let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = 'https://www.google.com/favicon.ico';

    // Set up panic key listener (Space key)
    const handlePanicKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.ctrlKey && e.shiftKey) {
        window.location.href = 'https://classroom.google.com';
      }
    };

    document.addEventListener('keydown', handlePanicKey);
    
    return () => {
      document.removeEventListener('keydown', handlePanicKey);
    };
  }, []);

  return <ProxyInterface />;
};

export default Index;
