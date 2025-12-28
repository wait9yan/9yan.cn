'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify-icon/react';
import clsx from 'clsx';
import { usePalette, useAppearance, Palette } from '@/layout/ThemeContext';
import ColorTableDialog from '@/layout/ColorTableDialog';

const paletteConfig: {
  value: Palette;
  label: string;
  icon?: React.ReactNode;
}[] = [
  { value: 'gray', label: '北欧灰' },
  { value: 'blue', label: '深海蓝' },
  { value: 'purple', label: '暮山紫' },
  { value: 'red', label: '朱砂红' },
  { value: 'brown', label: '落栗褐' },
  { value: 'green', label: '青松绿' },
  { value: 'random', label: '随机', icon: <Icon icon='lucide:shuffle' /> },
];

function getThemeColor(theme: string, isDark: boolean): string {
  const tempEl = document.createElement('div');
  tempEl.setAttribute('data-theme', theme);
  if (isDark) {
    tempEl.classList.add('dark');
  }
  tempEl.style.display = 'none';
  document.body.appendChild(tempEl);

  const color = window.getComputedStyle(tempEl).getPropertyValue('--primary-2').trim();

  document.body.removeChild(tempEl);
  return color;
}

export default function PalettesSwitcher() {
  const { palette, setPalette } = usePalette();
  const { actualAppearance } = useAppearance();
  const [showColorTable, setShowColorTable] = useState(false);

  const palettesWithColors = useMemo(() => {
    if (typeof window === 'undefined') return paletteConfig;

    const isDark = actualAppearance === 'dark';
    return paletteConfig.map((p) => ({
      ...p,
      color: p.icon ? undefined : getThemeColor(p.value, isDark),
    }));
  }, [actualAppearance]) as Array<{
    value: Palette;
    label: string;
    icon?: React.ReactNode;
    color?: string;
  }>;

  return (
    <>
      <div className='flex gap-1'>
        {palettesWithColors.map((t) => (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.9 }}
            key={t.value}
            onClick={() => setPalette(t.value)}
            className={`group text-text-1 flex h-5 w-5 items-center justify-center rounded-md ${
              palette === t.value
                ? 'border-primary-1 ring-primary-1 hover:ring-primary-2 hover:border-primary-2 ring-offset-bg-2 border-2 ring-2 ring-offset-2'
                : 'border-primary-1 hover:border-primary-2 border-2'
            }`}
            style={t.color ? { backgroundColor: t.color } : undefined}
            title={t.label}
            aria-label={`切换到${t.label}色调`}
          >
            {t.icon ? (
              <span
                className={clsx(
                  palette === t.value && 'opacity-100',
                  'flex items-center justify-center opacity-60',
                )}
              >
                {t.icon}
              </span>
            ) : (
              palette === t.value && <span className='text-xs'>✓</span>
            )}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowColorTable(true)}
          className={
            'group text-text-1 border-primary-1 hover:border-primary-2 flex h-5 w-5 items-center justify-center rounded-md border-2'
          }
          aria-label='查看配色表'
        >
          <Icon
            icon='lucide:eye'
            className='flex items-center justify-center opacity-60'
          />
        </motion.button>
      </div>

      <ColorTableDialog
        open={showColorTable}
        onClose={() => setShowColorTable(false)}
      />
    </>
  );
}
