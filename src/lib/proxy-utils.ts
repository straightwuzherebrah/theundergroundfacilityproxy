// Advanced proxy utilities for bypassing restrictions and firewalls

export interface ProxyService {
  name: string;
  baseUrl: string;
  format: (url: string) => string;
  priority: number;
}

export const PROXY_SERVICES: ProxyService[] = [
  {
    name: 'AllOrigins',
    baseUrl: 'https://api.allorigins.win',
    format: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    priority: 1
  },
  {
    name: 'CORS Anywhere',
    baseUrl: 'https://cors-anywhere.herokuapp.com',
    format: (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
    priority: 2
  },
  {
    name: 'CORS Proxy',
    baseUrl: 'https://corsproxy.io',
    format: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    priority: 3
  },
  {
    name: 'ThingProxy',
    baseUrl: 'https://thingproxy.freeboard.io',
    format: (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
    priority: 4
  },
  {
    name: 'Proxy6',
    baseUrl: 'https://proxy6.worker.js.org',
    format: (url: string) => `https://proxy6.worker.js.org/?u=${encodeURIComponent(url)}`,
    priority: 5
  },
  {
    name: 'CrossOrigin',
    baseUrl: 'https://crossorigin.me',
    format: (url: string) => `https://crossorigin.me/${url}`,
    priority: 6
  }
];

export class ProxyManager {
  private static instance: ProxyManager;
  private failedProxies: Set<string> = new Set();
  private currentProxy = 0;

  static getInstance(): ProxyManager {
    if (!ProxyManager.instance) {
      ProxyManager.instance = new ProxyManager();
    }
    return ProxyManager.instance;
  }

  getWorkingProxies(): ProxyService[] {
    return PROXY_SERVICES.filter(proxy => !this.failedProxies.has(proxy.name))
      .sort((a, b) => a.priority - b.priority);
  }

  markProxyAsFailed(proxyName: string): void {
    this.failedProxies.add(proxyName);
    console.log(`Proxy ${proxyName} marked as failed`);
  }

  getNextProxy(url: string): string | null {
    const workingProxies = this.getWorkingProxies();
    
    if (workingProxies.length === 0) {
      // Reset failed proxies if all have failed
      this.failedProxies.clear();
      return this.getRandomProxy(url);
    }

    const proxy = workingProxies[this.currentProxy % workingProxies.length];
    this.currentProxy++;
    
    return proxy.format(url);
  }

  getRandomProxy(url: string): string {
    const workingProxies = this.getWorkingProxies();
    if (workingProxies.length === 0) {
      return PROXY_SERVICES[0].format(url);
    }
    
    const randomProxy = workingProxies[Math.floor(Math.random() * workingProxies.length)];
    return randomProxy.format(url);
  }

  // Advanced URL obfuscation to bypass content filters
  obfuscateUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Convert to IP if possible (simple method)
      if (urlObj.hostname.includes('.')) {
        // Add some randomization to avoid pattern detection
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        
        // Use different encoding methods
        const methods = [
          () => btoa(url).replace(/=/g, ''),
          () => encodeURIComponent(url),
          () => url.split('').map(c => c.charCodeAt(0).toString(16)).join(''),
        ];
        
        const method = methods[Math.floor(Math.random() * methods.length)];
        return method();
      }
    } catch (e) {
      console.warn('URL obfuscation failed:', e);
    }
    
    return url;
  }

  // Check if a URL is likely to be blocked
  isLikelyBlocked(url: string): boolean {
    const blockedKeywords = [
      'proxy', 'vpn', 'bypass', 'unblock', 'anonymous',
      'gaming', 'social', 'youtube', 'facebook', 'tiktok'
    ];
    
    const lowercaseUrl = url.toLowerCase();
    return blockedKeywords.some(keyword => lowercaseUrl.includes(keyword));
  }

  // Generate alternative URLs for blocked sites
  getAlternativeUrls(url: string): string[] {
    const alternatives: string[] = [];
    
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      // Add www/non-www variants
      if (domain.startsWith('www.')) {
        alternatives.push(url.replace('www.', ''));
      } else {
        alternatives.push(url.replace(domain, `www.${domain}`));
      }
      
      // Add mobile variants
      alternatives.push(url.replace(domain, `m.${domain}`));
      alternatives.push(url.replace(domain, `mobile.${domain}`));
      
      // Add different protocols
      if (url.startsWith('https://')) {
        alternatives.push(url.replace('https://', 'http://'));
      }
      
    } catch (e) {
      console.warn('Failed to generate alternatives:', e);
    }
    
    return alternatives;
  }

  reset(): void {
    this.failedProxies.clear();
    this.currentProxy = 0;
  }
}

export const proxyManager = ProxyManager.getInstance();