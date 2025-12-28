'use client';

import { Icon } from '@iconify-icon/react';
import { DialogModal } from '@/components/DialogModel';
import { actualPalettes, type Palette } from '@/layout/ThemeContext';

const paletteLabels: Record<Exclude<Palette, 'random'>, string> = {
  gray: '北欧灰',
  blue: '深海蓝',
  purple: '暮山紫',
  red: '朱砂红',
  brown: '落栗褐',
  green: '青松绿',
};

const colorVariables = [
  { key: '--bg-1', label: '背景色1' },
  { key: '--bg-2', label: '背景色2' },
  { key: '--bg-3', label: '背景色3' },
  { key: '--primary-1', label: '主色1' },
  { key: '--primary-2', label: '主色2' },
  { key: '--primary-3', label: '主色3' },
  { key: '--text-1', label: '主文字色' },
  { key: '--text-2', label: '次文字色' },
  { key: '--accent-1', label: '主强调色' },
  { key: '--accent-2', label: '次强调色' },
];

function getAllThemeColors(theme: string, isDark: boolean): Record<string, string> {
  const tempEl = document.createElement('div');
  tempEl.setAttribute('data-theme', theme);
  if (isDark) {
    tempEl.classList.add('dark');
  }
  tempEl.style.display = 'none';
  document.body.appendChild(tempEl);

  const styles = window.getComputedStyle(tempEl);
  const colors: Record<string, string> = {};

  colorVariables.forEach(({ key }) => {
    colors[key] = styles.getPropertyValue(key).trim();
  });

  document.body.removeChild(tempEl);
  return colors;
}

function isColorDark(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

interface ColorTableDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ColorTableDialog({ open, onClose }: ColorTableDialogProps) {
  return (
    <DialogModal
      open={open}
      onClose={onClose}
    >
      <div className='bg-bg-1 border-bg-3 text-text-1 max-h-[85vh] w-[95vw] max-w-7xl overflow-auto rounded-2xl border-2 shadow-xl'>
        <div className='border-bg-3 bg-bg-1 sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3'>
          <h2 className='text-lg font-bold'>主题配色表</h2>
          <button
            onClick={onClose}
            className='hover:bg-bg-3 rounded p-1 transition-colors'
            aria-label='关闭'
          >
            <Icon
              icon='lucide:x'
              className='text-lg'
            />
          </button>
        </div>

        <div className='overflow-x-auto p-4'>
          <table className='w-full border-collapse text-xs'>
            <thead>
              <tr className='border-bg-3 border-b'>
                <th className='text-text-2 bg-bg-1 sticky left-0 p-2 text-left font-medium'>
                  变量
                </th>
                {actualPalettes.map((paletteValue) => (
                  <th
                    key={`${paletteValue}-light`}
                    className='text-text-1 bg-bg-2 p-2 text-center font-medium'
                  >
                    <div className='flex flex-col items-center gap-1'>
                      <span>{paletteLabels[paletteValue]}</span>
                      <span className='text-text-2 text-[10px]'>浅色</span>
                    </div>
                  </th>
                ))}
                {actualPalettes.map((paletteValue) => (
                  <th
                    key={`${paletteValue}-dark`}
                    className='text-text-1 bg-bg-3 p-2 text-center font-medium'
                  >
                    <div className='flex flex-col items-center gap-1'>
                      <span>{paletteLabels[paletteValue]}</span>
                      <span className='text-text-2 text-[10px]'>深色</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {colorVariables.map(({ key, label }) => (
                <tr
                  key={key}
                  className='border-bg-3 border-b'
                >
                  <td className='text-text-2 bg-bg-1 sticky left-0 p-3 font-medium'>
                    <span className='text-xs'>{label}</span>
                  </td>
                  {actualPalettes.map((paletteValue) => {
                    const lightColors = getAllThemeColors(paletteValue, false);
                    const bgColor = lightColors[key];
                    const isDarkBg = isColorDark(bgColor);
                    return (
                      <td
                        key={`${paletteValue}-light-${key}`}
                        className='border-bg-3 border p-0 text-center'
                        style={{ backgroundColor: bgColor }}
                        title={bgColor}
                      >
                        <div className='flex min-h-12 items-center justify-center px-2 py-3'>
                          <code
                            className='text-[10px] font-medium'
                            style={{ color: isDarkBg ? '#ffffff' : '#000000' }}
                          >
                            {bgColor}
                          </code>
                        </div>
                      </td>
                    );
                  })}
                  {actualPalettes.map((paletteValue) => {
                    const darkColors = getAllThemeColors(paletteValue, true);
                    const bgColor = darkColors[key];
                    const isDarkBg = isColorDark(bgColor);
                    return (
                      <td
                        key={`${paletteValue}-dark-${key}`}
                        className='border-bg-3 border p-0 text-center'
                        style={{ backgroundColor: bgColor }}
                        title={bgColor}
                      >
                        <div className='flex min-h-12 items-center justify-center px-2 py-3'>
                          <code
                            className='text-[10px] font-medium'
                            style={{ color: isDarkBg ? '#ffffff' : '#000000' }}
                          >
                            {bgColor}
                          </code>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DialogModal>
  );
}
