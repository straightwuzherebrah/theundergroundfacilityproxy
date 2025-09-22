import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Globe } from 'lucide-react';

interface ProxyTab {
  id: string;
  title: string;
  url: string;
  active: boolean;
  favicon?: string;
}

interface TabManagerProps {
  tabs: ProxyTab[];
  activeTabId: string;
  onSwitchTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
}

export const TabManager: React.FC<TabManagerProps> = ({
  tabs,
  activeTabId,
  onSwitchTab,
  onCloseTab,
  onNewTab,
}) => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20">
      <div className="flex items-center space-x-1 flex-1 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              relative flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer group min-w-0 max-w-48
              ${tab.id === activeTabId 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'hover:bg-primary/10 text-foreground'
              }
            `}
            onClick={() => onSwitchTab(tab.id)}
          >
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {tab.favicon ? (
                <img 
                  src={tab.favicon} 
                  alt="" 
                  className="h-4 w-4 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Globe className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="text-sm font-medium truncate">
                {tab.title || 'New Tab'}
              </span>
            </div>
            
            {tabs.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className={`
                  h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity
                  ${tab.id === activeTabId ? 'hover:bg-primary-foreground/20' : 'hover:bg-primary/20'}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {tab.url && (
              <div className="absolute -top-1 -right-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNewTab}
        className="flex-shrink-0 border-primary/20 hover:bg-primary/5"
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      <Badge variant="secondary" className="flex-shrink-0">
        {tabs.length} tab{tabs.length !== 1 ? 's' : ''}
      </Badge>
    </div>
  );
};