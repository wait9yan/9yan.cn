'use client';

import { motion } from 'motion/react';
import { usePalette, Palette } from '@/layout/ThemeContext';

const palettes: { value: Palette; label: string; color: string }[] = [
  { value: 'gray', label: '北欧灰', color: '#7e95ab' },
  { value: 'blue', label: '深海蓝', color: '#3b82f6' },
  { value: 'purple', label: '暮山紫', color: '#a855f7' },
  { value: 'pink', label: '樱花粉', color: '#ec4899' },
  { value: 'red', label: '朱砂红', color: '#d4715f' },
  { value: 'brown', label: '棕榈黄', color: '#b07961' },
];

export default function PalettesSwitcher() {
  const { palette, setPalette } = usePalette();

  return (
    <div className='flex gap-1'>
      {palettes.map((t) => (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.9 }}
          key={t.value}
          onClick={() => setPalette(t.value)}
          className={`group text-text-1 flex h-5 w-5 items-center justify-center rounded-md ${
            palette === t.value
              ? 'border-bg-3 ring-bg-3 hover:ring-primary-2 hover:border-primary-2 ring-offset-bg-2 border-2 ring-2 ring-offset-2'
              : 'border-bg-3 hover:border-primary-2 border-2'
          }`}
          style={{ backgroundColor: t.color }}
          title={t.label}
          aria-label={`切换到${t.label}色调`}
        >
          {palette === t.value && <span className='text-xs'>✓</span>}
        </motion.button>
      ))}
    </div>
  );
}
