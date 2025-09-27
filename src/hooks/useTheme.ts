import { useState, useEffect } from 'react';

type Theme = 'pink' | 'blue' | 'purple' | 'green' | 'dark';

interface ThemeColors {
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  gradientPrimary: string;
  gradientSecondary: string;
  gradientHero: string;
}

const themeConfigs: Record<Theme, ThemeColors> = {
  pink: {
    primary: '315 85% 65%',
    primaryForeground: '0 0% 98%',
    accent: '315 85% 70%',
    accentForeground: '0 0% 98%',
    gradientPrimary: 'linear-gradient(135deg, hsl(315 85% 65%) 0%, hsl(280 85% 70%) 50%, hsl(245 85% 75%) 100%)',
    gradientSecondary: 'linear-gradient(135deg, hsl(315 25% 90%) 0%, hsl(280 25% 95%) 100%)',
    gradientHero: 'linear-gradient(135deg, hsl(315 85% 45%) 0%, hsl(280 85% 55%) 25%, hsl(245 85% 65%) 50%, hsl(210 85% 70%) 75%, hsl(315 85% 75%) 100%)',
  },
  blue: {
    primary: '217 91% 60%',
    primaryForeground: '0 0% 98%',
    accent: '217 91% 70%',
    accentForeground: '0 0% 98%',
    gradientPrimary: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(200 91% 65%) 50%, hsl(190 91% 70%) 100%)',
    gradientSecondary: 'linear-gradient(135deg, hsl(217 25% 90%) 0%, hsl(200 25% 95%) 100%)',
    gradientHero: 'linear-gradient(135deg, hsl(217 91% 40%) 0%, hsl(200 91% 50%) 25%, hsl(190 91% 60%) 50%, hsl(180 91% 70%) 75%, hsl(170 91% 75%) 100%)',
  },
  purple: {
    primary: '262 83% 58%',
    primaryForeground: '0 0% 98%',
    accent: '262 83% 68%',
    accentForeground: '0 0% 98%',
    gradientPrimary: 'linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(280 83% 63%) 50%, hsl(295 83% 68%) 100%)',
    gradientSecondary: 'linear-gradient(135deg, hsl(262 25% 90%) 0%, hsl(280 25% 95%) 100%)',
    gradientHero: 'linear-gradient(135deg, hsl(262 83% 38%) 0%, hsl(280 83% 48%) 25%, hsl(295 83% 58%) 50%, hsl(310 83% 68%) 75%, hsl(325 83% 73%) 100%)',
  },
  green: {
    primary: '142 76% 36%',
    primaryForeground: '0 0% 98%',
    accent: '142 76% 46%',
    accentForeground: '0 0% 98%',
    gradientPrimary: 'linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(160 76% 41%) 50%, hsl(175 76% 46%) 100%)',
    gradientSecondary: 'linear-gradient(135deg, hsl(142 25% 90%) 0%, hsl(160 25% 95%) 100%)',
    gradientHero: 'linear-gradient(135deg, hsl(142 76% 16%) 0%, hsl(160 76% 26%) 25%, hsl(175 76% 36%) 50%, hsl(190 76% 46%) 75%, hsl(200 76% 51%) 100%)',
  },
  dark: {
    primary: '210 40% 98%',
    primaryForeground: '222 84% 5%',
    accent: '210 40% 90%',
    accentForeground: '222 84% 5%',
    gradientPrimary: 'linear-gradient(135deg, hsl(210 40% 90%) 0%, hsl(220 40% 85%) 50%, hsl(230 40% 80%) 100%)',
    gradientSecondary: 'linear-gradient(135deg, hsl(210 25% 20%) 0%, hsl(220 25% 25%) 100%)',
    gradientHero: 'linear-gradient(135deg, hsl(210 40% 10%) 0%, hsl(220 40% 15%) 25%, hsl(230 40% 20%) 50%, hsl(240 40% 25%) 75%, hsl(250 40% 30%) 100%)',
  },
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'pink';
    return (localStorage.getItem('underground-theme') as Theme) || 'pink';
  });

  const applyTheme = (newTheme: Theme) => {
    const config = themeConfigs[newTheme];
    const root = document.documentElement;

    // Apply theme colors
    root.style.setProperty('--primary', config.primary);
    root.style.setProperty('--primary-foreground', config.primaryForeground);
    root.style.setProperty('--accent', config.accent);
    root.style.setProperty('--accent-foreground', config.accentForeground);
    root.style.setProperty('--gradient-primary', config.gradientPrimary);
    root.style.setProperty('--gradient-secondary', config.gradientSecondary);
    root.style.setProperty('--gradient-hero', config.gradientHero);

    // Update dark mode based on theme
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      root.style.setProperty('--background', '222 84% 5%');
      root.style.setProperty('--foreground', '210 40% 98%');
      root.style.setProperty('--card', '222 84% 7%');
      root.style.setProperty('--card-foreground', '210 40% 98%');
      root.style.setProperty('--muted', '217 33% 17%');
      root.style.setProperty('--muted-foreground', '215 20% 65%');
    } else {
      document.documentElement.classList.remove('dark');
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '220 9% 15%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '220 9% 15%');
      root.style.setProperty('--muted', `${config.primary.split(' ')[0]} 15% 95%`);
      root.style.setProperty('--muted-foreground', `${config.primary.split(' ')[0]} 10% 45%`);
    }
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('underground-theme', newTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return { theme, changeTheme, themes: Object.keys(themeConfigs) as Theme[] };
};