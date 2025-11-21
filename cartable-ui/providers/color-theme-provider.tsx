'use client';

import * as React from 'react';
import {
  COLOR_THEMES,
  ColorTheme,
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
} from '@/config/themes';

interface ColorThemeContextType {
  /** تم فعلی */
  colorTheme: ColorTheme;
  /** شناسه تم فعلی */
  colorThemeId: string;
  /** تغییر تم */
  setColorTheme: (themeId: string) => void;
  /** لیست تم‌های موجود */
  availableThemes: ColorTheme[];
}

const ColorThemeContext = React.createContext<ColorThemeContextType | undefined>(
  undefined
);

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorThemeId, setColorThemeId] = React.useState<string>(DEFAULT_THEME_ID);
  const [mounted, setMounted] = React.useState(false);

  // Load saved theme from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && COLOR_THEMES.find((t) => t.id === savedTheme)) {
      setColorThemeId(savedTheme);
    }
    setMounted(true);
  }, []);

  // Apply theme data attribute to body
  React.useEffect(() => {
    if (!mounted) return;

    const body = document.body;

    // Set data attribute for theme
    if (colorThemeId !== 'default') {
      body.setAttribute('data-color-theme', colorThemeId);
    } else {
      body.removeAttribute('data-color-theme');
    }

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, colorThemeId);
  }, [colorThemeId, mounted]);

  const setColorTheme = React.useCallback((themeId: string) => {
    const theme = COLOR_THEMES.find((t) => t.id === themeId);
    if (theme) {
      setColorThemeId(themeId);
    }
  }, []);

  const colorTheme = React.useMemo(
    () => COLOR_THEMES.find((t) => t.id === colorThemeId) || COLOR_THEMES[0],
    [colorThemeId]
  );

  const value = React.useMemo(
    () => ({
      colorTheme,
      colorThemeId,
      setColorTheme,
      availableThemes: COLOR_THEMES,
    }),
    [colorTheme, colorThemeId, setColorTheme]
  );

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = React.useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
}
