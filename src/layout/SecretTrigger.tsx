'use client';

import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { isConfigButtonVisibleAtom } from '@/hooks/use-config';

export default function SecretTrigger() {
  const setVisible = useSetAtom(isConfigButtonVisibleAtom);

  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      const now = Date.now();
      const timeDiff = now - lastClickTimeRef.current;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // timerRef.current = setTimeout(() => {
      //   setVisible(false);
      // }, 30000);

      if (timeDiff < 400 && timeDiff > 0) {
        clickCountRef.current += 1;
      } else {
        clickCountRef.current = 1;
      }

      lastClickTimeRef.current = now;

      if (clickCountRef.current === 7) {
        setVisible(true);
        clickCountRef.current = 0;
      }
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [setVisible]);

  return null;
}
