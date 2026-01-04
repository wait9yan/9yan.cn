'use client';

import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={twMerge(
        'bg-primary-3 text-bg-1 flex items-center justify-center rounded-full transition-all',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
