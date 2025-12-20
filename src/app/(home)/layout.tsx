'use client';

import { PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export default function HomeTemplate({ children }: PropsWithChildren) {
  return (
    <AnimatePresence>
      <motion.div
        key='home-content'
        initial={{ height: 0, padding: 0, overflow: 'hidden' }}
        animate={{
          height: 'auto',
          padding: '16px 24px',
          transition: {
            type: 'tween',
            ease: 'linear',
            duration: 0.3,
            delay: 0.3,
          },
        }}
        exit={{
          height: 0,
          padding: 0,
          transition: {
            height: { duration: 0.3 },
            padding: { duration: 0.3 },
            borderRadius: { duration: 0.3 },
          },
        }}
        className='bg-bg-1 flex w-full flex-col items-center rounded-b-3xl'
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
