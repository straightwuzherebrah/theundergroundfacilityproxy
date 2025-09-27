// Advanced proxy utilities for bypassing restrictions and firewalls

export interface ProxyService {
  name: string;
  baseUrl: string;
  format: (url: string) => string;
  priority: number;
  headers?: Record<string, string>;
}

export const PROXY_SERVICES: ProxyService[] = [
  {
    name: 'AllOrigins',
    baseUrl: 'https://api.allorigins.win',
    format: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    priority: 1,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  },
  {
    name: 'CORS Proxy IO',
    baseUrl: 'https://corsproxy.io',
    format: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    priority: 2
  },
  {
    name: 'Proxy Worker',
    baseUrl: 'https://proxy.cors.sh',
    format: (url: string) => `https://proxy.cors.sh/${url}`,
    priority: 3
  },
  {
    name: 'ThingProxy',
    baseUrl: 'https://thingproxy.freeboard.io',
    format: (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
    priority: 4
  },
  {
    name: 'CrossOrigin',
    baseUrl: 'https://crossorigin.me',
    format: (url: string) => `https://crossorigin.me/${url}`,
    priority: 5
  },
  {
    name: 'CORS Anywhere',
    baseUrl: 'https://cors-anywhere.herokuapp.com',
    format: (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
    priority: 6
  }
];

// Additional fallback proxies for high-traffic sites
export const FALLBACK_PROXIES: ProxyService[] = [
  {
    name: 'Proxy Mirror 1',
    baseUrl: 'https://api.codetabs.com',
    format: (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    priority: 7
  },
  {
    name: 'Proxy Mirror 2',
    baseUrl: 'https://yacdn.org',
    format: (url: string) => `https://yacdn.org/proxy/${encodeURIComponent(url)}`,
    priority: 8
  }
];

export class ProxyManager {
  private static instance: ProxyManager;
  private failedProxies: Set<string> = new Set();
  private currentProxy = 0;
  private retryCount = 0;
  private maxRetries = 3;

  static getInstance(): ProxyManager {
    if (!ProxyManager.instance) {
      ProxyManager.instance = new ProxyManager();
    }
    return ProxyManager.instance;
  }

  getAllProxies(): ProxyService[] {
    return [...PROXY_SERVICES, ...FALLBACK_PROXIES];
  }

  getWorkingProxies(): ProxyService[] {
    const allProxies = this.getAllProxies();
    return allProxies.filter(proxy => !this.failedProxies.has(proxy.name))
      .sort((a, b) => a.priority - b.priority);
  }

  markProxyAsFailed(proxyName: string): void {
    this.failedProxies.add(proxyName);
    console.log(`Proxy ${proxyName} marked as failed`);
    
    // If all proxies have failed, reset after a delay
    if (this.failedProxies.size >= this.getAllProxies().length) {
      setTimeout(() => {
        console.log('All proxies failed, resetting...');
        this.reset();
      }, 5000);
    }
  }

  getNextProxy(url: string): string | null {
    const workingProxies = this.getWorkingProxies();
    
    if (workingProxies.length === 0) {
      // Reset failed proxies if all have failed
      this.failedProxies.clear();
      this.retryCount++;
      
      if (this.retryCount > this.maxRetries) {
        return this.getDirectUrl(url);
      }
      
      return this.getRandomProxy(url);
    }

    const proxy = workingProxies[this.currentProxy % workingProxies.length];
    this.currentProxy++;
    
    return this.formatProxyUrl(proxy, url);
  }

  getRandomProxy(url: string): string {
    const workingProxies = this.getWorkingProxies();
    if (workingProxies.length === 0) {
      return this.formatProxyUrl(PROXY_SERVICES[0], url);
    }
    
    const randomProxy = workingProxies[Math.floor(Math.random() * workingProxies.length)];
    return this.formatProxyUrl(randomProxy, url);
  }

  private formatProxyUrl(proxy: ProxyService, url: string): string {
    try {
      // Ensure URL has protocol
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      return proxy.format(url);
    } catch (error) {
      console.warn(`Failed to format URL for proxy ${proxy.name}:`, error);
      return proxy.format(url);
    }
  }

  private getDirectUrl(url: string): string {
    // As a last resort, try direct connection with protocol correction
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }

  // Advanced URL obfuscation to bypass content filters
  obfuscateUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Convert to different formats to avoid detection
      const methods = [
        () => url,
        () => url.replace('www.', ''),
        () => url.replace('https://', 'http://'),
        () => `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}${urlObj.search}`,
      ];
      
      const method = methods[Math.floor(Math.random() * methods.length)];
      return method();
    } catch (e) {
      console.warn('URL obfuscation failed:', e);
    }
    
    return url;
  }

  // Check if a URL is likely to be blocked
  isLikelyBlocked(url: string): boolean {
    const blockedKeywords = [
      'proxy', 'vpn', 'bypass', 'unblock', 'anonymous',
      'gaming', 'social', 'youtube', 'facebook', 'tiktok',
      'discord', 'reddit', 'twitter', 'instagram'
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
      } else if (url.startsWith('http://')) {
        alternatives.push(url.replace('http://', 'https://'));
      }
      
      // Add subdomain variants for popular sites
      const popularSites = {
        'youtube.com': ['m.youtube.com', 'www.youtube.com'],
        'google.com': ['www.google.com', 'google.co.uk'],
        'facebook.com': ['m.facebook.com', 'www.facebook.com'],
        'twitter.com': ['mobile.twitter.com', 'www.twitter.com'],
        'reddit.com': ['old.reddit.com', 'www.reddit.com']
      };
      
      Object.entries(popularSites).forEach(([site, variants]) => {
        if (domain.includes(site)) {
          variants.forEach(variant => {
            alternatives.push(url.replace(domain, variant));
          });
        }
      });
      
    } catch (e) {
      console.warn('Failed to generate alternatives:', e);
    }
    
    return alternatives;
  }

  // Test proxy connectivity
  async testProxy(proxy: ProxyService): Promise<boolean> {
    try {
      const testUrl = proxy.format('https://httpbin.org/get');
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...proxy.headers
        },
        signal: AbortSignal.timeout(5000)
      });
      
      return response.ok;
    } catch (error) {
      console.warn(`Proxy ${proxy.name} test failed:`, error);
      return false;
    }
  }

  reset(): void {
    this.failedProxies.clear();
    this.currentProxy = 0;
    this.retryCount = 0;
  }

  // Get proxy status for debugging
  getStatus(): { working: number; failed: number; total: number } {
    const total = this.getAllProxies().length;
    const failed = this.failedProxies.size;
    const working = total - failed;
    
    return { working, failed, total };
  }
}

export const proxyManager = ProxyManager.getInstance();