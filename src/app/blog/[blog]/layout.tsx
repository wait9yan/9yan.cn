import { PropsWithChildren } from 'react';

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <div className='bg-bg-1 mt-2 w-full overflow-hidden rounded-3xl'>
      <div className='text-text-1'>{children}</div>
    </div>
  );
}
