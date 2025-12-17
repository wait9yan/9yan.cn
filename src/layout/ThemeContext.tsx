'use client';

import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';

export type Appearance = 'light' | 'dark' | 'auto';
export type Palette = 'gray' | 'blue' | 'purple' | 'pink' | 'red' | 'brown';

interface AppearanceContextType {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  actualAppearance: 'light' | 'dark';
}

interface PaletteContextType {
  palette: Palette;
  setPalette: (palette: Palette) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);
const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

function getSystemAppearance(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppearanceProvider({ children }: PropsWithChildren) {
  const [appearance, setAppearanceState] = useState<Appearance>('light');
  const [palette, setPaletteState] = useState<Palette>('gray');
  const [mounted, setMounted] = useState(false);

  const actualAppearance = appearance === 'auto' ? getSystemAppearance() : appearance;

  function applyAppearance(appearance: Appearance) {
    const root = document.documentElement;
    if (appearance === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  const applyPalette = (newPalette: Palette) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', newPalette);
  };

  // 客户端挂载时初始化主题
  useEffect(() => {
    const init = () => {
      const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'auto';
      const savedPalette = (localStorage.getItem('palette') as Palette) || 'gray';

      setAppearanceState(savedAppearance);
      setPaletteState(savedPalette);

      const initAppearance = savedAppearance === 'auto' ? getSystemAppearance() : savedAppearance;
      applyAppearance(initAppearance);
      applyPalette(savedPalette);

      setMounted(true);
    };

    requestAnimationFrame(init);

    // 监听系统外观变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentAppearance = localStorage.getItem('appearance') as Appearance;
      if (currentAppearance === 'auto') {
        applyAppearance(getSystemAppearance());
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 外观变化时更新 DOM
  useEffect(() => {
    if (mounted) {
      applyAppearance(actualAppearance);
    }
  }, [actualAppearance, mounted]);

  // 色调变化时更新 DOM
  useEffect(() => {
    if (mounted) {
      applyPalette(palette);
    }
  }, [palette, mounted]);

  const setAppearance = (newAppearance: Appearance) => {
    setAppearanceState(newAppearance);
    localStorage.setItem('appearance', newAppearance);
  };

  const setPalette = (newPalette: Palette) => {
    setPaletteState(newPalette);
    localStorage.setItem('palette', newPalette);
  };

  return (
    <>
      <AppearanceContext.Provider value={{ appearance, setAppearance, actualAppearance }}>
        <PaletteContext.Provider value={{ palette, setPalette }}>
          {children}
        </PaletteContext.Provider>
      </AppearanceContext.Provider>
    </>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function usePalette() {
  const context = useContext(PaletteContext);
  if (context === undefined) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }
  return context;
}
