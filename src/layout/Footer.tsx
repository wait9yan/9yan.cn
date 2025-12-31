'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useSetAtom } from 'jotai';
import clsx from 'clsx';
import { isConfigButtonVisibleAtom } from '@/hooks/use-config';

export default function Footer({ className }: { className?: string }) {
  const [footerState, setFooterState] = useState<'bottom' | 'side' | 'hidden'>('bottom');
  const setConfigVisible = useSetAtom(isConfigButtonVisibleAtom);

  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFooterClick = () => {
    const now = Date.now();
    const timeDiff = now - lastClickTimeRef.current;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // timerRef.current = setTimeout(() => {
    //   setConfigVisible(false);
    // }, 30000);

    if (timeDiff < 400 && timeDiff > 0) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }

    lastClickTimeRef.current = now;

    if (clickCountRef.current === 7) {
      setConfigVisible(true);
      clickCountRef.current = 0;
    }
  };

  useEffect(() => {
    const checkFooterPosition = () => {
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollBottom = scrollTop + viewportHeight;

      const isNearBottom = scrollBottom >= docHeight - 16;

      if (isNearBottom) {
        setFooterState('bottom');
      } else {
        setFooterState('side');
      }
    };

    checkFooterPosition();

    window.addEventListener('scroll', checkFooterPosition);
    window.addEventListener('resize', checkFooterPosition);

    const observer = new MutationObserver(checkFooterPosition);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener('scroll', checkFooterPosition);
      window.removeEventListener('resize', checkFooterPosition);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.footer
      layout
      onClick={handleFooterClick}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={clsx(
        'text-text-2/50 fixed bottom-4 z-2 flex cursor-pointer items-center gap-1 rounded-full px-6 py-2 text-xs backdrop-blur-sm select-none',
        footerState === 'side' && 'right-4 bottom-4',
        footerState === 'bottom' && 'left-1/2 -translate-x-1/2',
        className,
      )}
    >
      {footerState === 'bottom' && (
        <span className='flex gap-1'>
          copyright © {new Date().getFullYear()}
          <a
            href='https://beian.miit.gov.cn/'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:decoration-text-2/50 underline decoration-transparent underline-offset-4 transition-all duration-300 ease-out'
          >
            浙ICP备2025221186号-1
          </a>
          wait9yan
        </span>
      )}
      <span>v{process.env.APP_VERSION}</span>
    </motion.footer>
  );
}
