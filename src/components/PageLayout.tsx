import { PropsWithChildren } from 'react';

export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className='bg-bg-1 text-text-1 mt-2 w-full overflow-hidden rounded-3xl px-4 py-4 sm:px-8 sm:py-8 lg:px-10'>
      {children}
    </div>
  );
}
