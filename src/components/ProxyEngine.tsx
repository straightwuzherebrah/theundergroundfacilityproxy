import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Lock, 
  Globe,
  AlertTriangle,
  ExternalLink,
  Maximize2,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { proxyManager } from '@/lib/proxy-utils';

interface ProxyEngineProps {
  url: string;
  title: string;
  onNavigate: (url: string) => void;
  onTitleChange: (title: string) => void;
}

export const ProxyEngine: React.FC<ProxyEngineProps> = ({ 
  url, 
  title, 
  onNavigate, 
  onTitleChange 
}) => {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isSecure, setIsSecure] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentProxy, setCurrentProxy] = useState<string>('');
  // Read-mode fallback when iframe embedding is blocked by X-Frame-Options/CSP
  const [readMode, setReadMode] = useState(false);
  const [snapshotHtml, setSnapshotHtml] = useState<string | null>(null);
  const [readModeAttempted, setReadModeAttempted] = useState(false);

  useEffect(() => {
    // Extract original URL if it's proxied
    let originalUrl = url;
    if (url.includes('allorigins.win/raw?url=')) {
      originalUrl = decodeURIComponent(url.split('url=')[1]);
    } else if (url.includes('corsproxy.io/?')) {
      originalUrl = decodeURIComponent(url.split('corsproxy.io/?')[1]);
    } else if (url.includes('cors-anywhere.herokuapp.com/')) {
      originalUrl = url.replace('https://cors-anywhere.herokuapp.com/', '');
    } else if (url.includes('thingproxy.freeboard.io/fetch/')) {
      originalUrl = url.replace('https://thingproxy.freeboard.io/fetch/', '');
    }
    
    setCurrentUrl(originalUrl);
    setIsSecure(originalUrl.startsWith('https://'));
    if (url) {
      setIsLoading(true);
      setError(null);
    }
  }, [url]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if ((event as MessageEvent)?.data?.type === 'proxy-navigate' && typeof (event as MessageEvent).data.url === 'string') {
        navigateToUrl((event as MessageEvent).data.url);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    try {
      if (iframeRef.current?.contentWindow) {
        const iframeUrl = iframeRef.current.contentWindow.location.href;
        if (iframeUrl !== 'about:blank') {
          setCurrentUrl(iframeUrl);
          onNavigate(iframeUrl);
          
          // Try to get title from iframe
          const iframeTitle = iframeRef.current.contentDocument?.title;
          if (iframeTitle) {
            onTitleChange(iframeTitle);
          }
        }
      }
    } catch (e) {
      // Cross-origin restrictions prevent access
    }
  };

  // Fetch and render read-only snapshot when iframe embedding is blocked
  const tryReadModeFetch = async (targetUrl: string) => {
    setReadModeAttempted(true);
    setIsLoading(true);
    const candidates = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      proxyManager.getNextProxy(targetUrl) || targetUrl
    ];
    for (const endpoint of candidates) {
      try {
        const res = await fetch(endpoint);
        const html = await res.text();
        const built = buildSnapshotHtml(html, targetUrl);
        setSnapshotHtml(built);
        setReadMode(true);
        setIsLoading(false);
        setError('Embedding blocked by site policy. Showing read-only snapshot.');
        toast({ title: 'Read Mode Enabled', description: 'Site blocks embedding. Showing snapshot instead.' });
        return;
      } catch (e) {
        console.warn('Read mode fetch failed via endpoint', endpoint, e);
      }
    }
    setReadMode(false);
    setSnapshotHtml(null);
    setIsLoading(false);
  };

  const buildSnapshotHtml = (html: string, baseUrl: string) => {
    try {
      // Strip scripts and inline handlers for safety
      const withoutScripts = html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/onload=|onclick=|onerror=|onmouseover=/gi, '');
      const base = `<base href="${baseUrl}">`;
      const intercept = `
        <script>
          (function(){
            document.addEventListener('click', function(e){
              var a = e.target && e.target.closest ? e.target.closest('a') : null;
              if(a && a.href){
                e.preventDefault();
                try { window.parent.postMessage({ type: 'proxy-navigate', url: a.href }, '*'); } catch {}
              }
            }, true);
          })();
        </script>
      `;
      return `<!DOCTYPE html><html><head>${base}</head><body>${withoutScripts}${intercept}</body></html>`;
    } catch {
      return html;
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setRetryCount(prev => prev + 1);
    
    // Mark current proxy as failed
    if (currentProxy) {
      proxyManager.markProxyAsFailed(currentProxy);
    }
    
    if (retryCount < 3 && currentUrl) {
      // Try next proxy automatically
      setTimeout(() => {
        const nextProxiedUrl = getProxiedUrl(currentUrl);
        console.log(`Attempting retry ${retryCount + 1} with different proxy...`);
        onNavigate(nextProxiedUrl);
      }, 1500);
      
      setError(`Connection failed. Trying alternative route (${retryCount + 1}/3)...`);
      toast({
        title: "Switching Proxy",
        description: `Attempting alternative route ${retryCount + 1}...`,
        variant: "default"
      });
    } else {
      // All retries exhausted, try alternatives or show error
      setError('All proxy routes failed. The site may be heavily restricted or temporarily unavailable.');
      
      // Try alternative URLs
      if (currentUrl) {
        const alternatives = proxyManager.getAlternativeUrls(currentUrl);
        if (alternatives.length > 0) {
          setTimeout(() => {
            const altUrl = alternatives[0];
            console.log('Trying alternative URL:', altUrl);
            navigateToUrl(altUrl);
          }, 2000);
          setError('Primary route blocked. Trying alternative access method...');
        }
      }

      // Fallback to read-only snapshot if embedding is blocked
      if (!readModeAttempted && currentUrl) {
        tryReadModeFetch(currentUrl);
      }
      
      toast({
        title: "Connection Blocked",
        description: "Embedding likely blocked by X-Frame-Options/CSP or network filter. Read Mode attempted.",
        variant: "destructive"
      });
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setError(null);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const goHome = () => {
    onNavigate('');
    setCurrentUrl('');
  };

  const getProxiedUrl = (targetUrl: string) => {
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    
    // Use the advanced proxy manager
    const proxiedUrl = proxyManager.getNextProxy(targetUrl);
    if (proxiedUrl) {
      setCurrentProxy(proxiedUrl.split('/')[2]); // Extract domain for display
      return proxiedUrl;
    }
    
    // Fallback to direct URL if no proxy available
    return targetUrl;
  };

  const navigateToUrl = (targetUrl: string) => {
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    
    setRetryCount(0);
    setError(null);
    
    // Check if URL is likely to be blocked
    if (proxyManager.isLikelyBlocked(targetUrl)) {
      toast({
        title: "High Risk URL Detected",
        description: "This site may be heavily filtered. Using enhanced bypass methods.",
        variant: "default"
      });
    }
    
    // Use proxied URL instead of direct URL
    const proxiedUrl = getProxiedUrl(targetUrl);
    onNavigate(proxiedUrl);
    setCurrentUrl(targetUrl); // Show original URL to user
  };

  const openInNewWindow = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank');
    }
  };

  const getDomainName = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  if (!url) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Welcome to The Underground Facility</h3>
          <p className="text-muted-foreground mb-4">
            Enter a URL above to start browsing safely and anonymously
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="bg-primary/10">
              <Shield className="h-3 w-3 mr-1" />
              Advanced Proxy
            </Badge>
            <Badge variant="outline" className="bg-accent/10">
              Firewall Bypass
            </Badge>
            <Badge variant="outline" className="bg-secondary/10">
              Multi-Route Access
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-sm">
            {isSecure ? (
              <Lock className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
            <span className="truncate max-w-md">{getDomainName(currentUrl)}</span>
            {isLoading && (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              disabled={!canGoBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.forward()}
              disabled={!canGoForward}
              className="h-8 w-8 p-0"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goHome}
              className="h-8 w-8 p-0"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={openInNewWindow}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-2">
          <div className="flex-1 relative">
            <Input
              type="url"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  navigateToUrl(currentUrl);
                }
              }}
              className="text-sm border-primary/20 focus:border-primary pl-8"
              placeholder="Enter URL..."
            />
            <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            size="sm"
            onClick={() => navigateToUrl(currentUrl)}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Go
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative aspect-video bg-background rounded-lg overflow-hidden border border-primary/20">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
              <div className="text-center p-6">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <h3 className="text-lg font-semibold mb-2">Proxy Connection Failed</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">{error}</p>
                <div className="flex justify-center space-x-2 flex-wrap gap-2">
                  <Button size="sm" onClick={refresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Proxy
                  </Button>
                  <Button size="sm" onClick={() => navigateToUrl(currentUrl)} variant="outline">
                    Different Route
                  </Button>
                  <Button size="sm" onClick={openInNewWindow}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Direct
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Loading {getDomainName(url)}...</p>
                  </div>
                </div>
              )}
              
              {readMode && snapshotHtml ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={snapshotHtml}
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
                  title={`Read mode snapshot: ${getDomainName(currentUrl)}`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <iframe
                  ref={iframeRef}
                  src={url}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation allow-downloads"
                  allow="fullscreen; microphone; camera; midi; encrypted-media; picture-in-picture; display-capture; clipboard-read; clipboard-write"
                  title={`Proxied content: ${getDomainName(currentUrl)}`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              )}
            </>
          )}
        </div>
        
          <div className="p-2 bg-muted/50 border-t border-primary/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Badge variant={isSecure ? "default" : "secondary"} className="text-xs">
                  {isSecure ? "Secure" : "Insecure"}
                </Badge>
                <span>Proxied via {currentProxy || 'Advanced Route'}</span>
                {retryCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Route {retryCount + 1}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm" 
                onClick={openInNewWindow}
                className="h-6 text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Direct Access
              </Button>
            </div>
          </div>
      </CardContent>
    </Card>
  );
};