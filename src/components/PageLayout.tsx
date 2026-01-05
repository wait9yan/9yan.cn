import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

export default function PageLayout({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={twMerge(
        'bg-bg-1 text-text-1 mt-2 overflow-hidden rounded-3xl px-4 py-4 sm:px-8 sm:py-8 lg:px-10',
        className,
      )}
    >
      {children}
    </div>
  );
}
