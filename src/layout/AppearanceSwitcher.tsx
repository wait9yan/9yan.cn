'use client';
import { motion } from 'motion/react';
import { SunMedium, Moon, SunMoon } from 'lucide-react';
import { useAppearance, Appearance } from '@/layout/ThemeContext';

const appearances: { value: Appearance; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: '浅色', icon: <SunMedium size={14} /> },
  { value: 'dark', label: '深色', icon: <Moon size={14} /> },
  { value: 'auto', label: '自动', icon: <SunMoon size={14} /> },
];

export default function AppearanceSwitcher() {
  const { appearance, setAppearance } = useAppearance();

  return (
    <div className='flex gap-2'>
      {appearances.map((t) => (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          key={t.value}
          onClick={() => setAppearance(t.value)}
          className={`group text-text-1 flex h-5 w-15 items-center justify-center rounded-md ${
            appearance === t.value
              ? 'border-bg-3 ring-bg-3 hover:ring-primary-2 hover:border-primary-2 ring-offset-bg-2 bg-bg-3 border-2 ring-2 ring-offset-2'
              : 'border-bg-3 hover:border-primary-2 border-2'
          }`}
          title={t.label}
          aria-label={`切换到${t.label}外观`}
        >
          {t.icon}
        </motion.button>
      ))}
    </div>
  );
}
