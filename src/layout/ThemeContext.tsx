'use client';

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  PropsWithChildren,
} from 'react';

export type Appearance = 'light' | 'dark' | 'auto';
export type Palette = 'gray' | 'blue' | 'purple' | 'red' | 'brown' | 'green' | 'random';

export const actualPalettes: Exclude<Palette, 'random'>[] = [
  'gray',
  'blue',
  'purple',
  'red',
  'brown',
  'green',
];

function getRandomPalette(): Exclude<Palette, 'random'> {
  return actualPalettes[Math.floor(Math.random() * actualPalettes.length)];
}

interface AppearanceContextType {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  actualAppearance: 'light' | 'dark';
}

interface PaletteContextType {
  palette: Palette;
  setPalette: (palette: Palette) => void;
  actualPalette: Exclude<Palette, 'random'>;
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
  const [actualPalette, setActualPaletteState] = useState<Exclude<Palette, 'random'>>('gray');
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

  const applyPaletteToDOM = (resolvedPalette: Exclude<Palette, 'random'>) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedPalette);
  };

  const resolvePalette = (newPalette: Palette): Exclude<Palette, 'random'> => {
    return newPalette === 'random' ? getRandomPalette() : newPalette;
  };

  // 客户端挂载时初始化主题
  useEffect(() => {
    const init = () => {
      const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'auto';
      const savedPalette = (localStorage.getItem('palette') as Palette) || 'random';

      setAppearanceState(savedAppearance);
      setPaletteState(savedPalette);

      const initAppearance = savedAppearance === 'auto' ? getSystemAppearance() : savedAppearance;
      applyAppearance(initAppearance);
      const resolvedInitPalette = resolvePalette(savedPalette);
      applyPaletteToDOM(resolvedInitPalette);
      setActualPaletteState(resolvedInitPalette);

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
  useLayoutEffect(() => {
    if (mounted) {
      const resolvedPalette = resolvePalette(palette);
      applyPaletteToDOM(resolvedPalette);
      if (resolvedPalette !== actualPalette) {
        setActualPaletteState(resolvedPalette);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette, mounted]);

  const setAppearance = (newAppearance: Appearance) => {
    setAppearanceState(newAppearance);
    localStorage.setItem('appearance', newAppearance);
  };

  const setPalette = (newPalette: Palette) => {
    setPaletteState(newPalette);
    localStorage.setItem('palette', newPalette);
    const resolvedPalette = resolvePalette(newPalette);
    setActualPaletteState(resolvedPalette);
  };

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance, actualAppearance }}>
      <PaletteContext.Provider value={{ palette, setPalette, actualPalette }}>
        {children}
      </PaletteContext.Provider>
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within a AppearanceProvider');
  }
  return context;
}

export function usePalette() {
  const context = useContext(PaletteContext);
  if (context === undefined) {
    throw new Error('usePalette must be used within a AppearanceProvider');
  }
  return context;
}
