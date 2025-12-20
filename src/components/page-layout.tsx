'use client';

import { PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.6,
            duration: 0.3,
          },
        }}
        exit={{
          opacity: 0,
          y: 100,
          transition: { duration: 0.3 }, // 立即消失
        }}
        className='flex w-full flex-col flex-wrap content-center'
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
