'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSetAtom } from 'jotai';
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
    timerRef.current = setTimeout(() => {
      setConfigVisible(false);
    }, 30000);

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

      const isPageTallerThanViewport = docHeight > viewportHeight + 100;
      const isNearBottom = scrollBottom >= docHeight - 100;

      if (!isPageTallerThanViewport || isNearBottom) {
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
    <>
      <AnimatePresence mode='wait'>
        {footerState === 'bottom' && (
          <motion.footer
            key='bottom-footer'
            onClick={handleFooterClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.9 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`text-text-2 fixed bottom-4 left-1/2 -translate-x-1/2 cursor-pointer rounded-full px-6 py-2 text-sm backdrop-blur-sm transition-transform ${className}`}
          >
            © 2025 wait9yan v{process.env.APP_VERSION}
          </motion.footer>
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {footerState === 'side' && (
          <motion.div
            key='side-footer'
            onClick={handleFooterClick}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.9 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`bg-bg-1 text-text-2 fixed right-4 bottom-4 z-50 cursor-pointer rounded-full px-4 py-2 text-sm shadow-lg backdrop-blur-sm transition-transform ${className}`}
          >
            © wait9yan {process.env.APP_VERSION}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
