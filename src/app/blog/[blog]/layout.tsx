import { PropsWithChildren } from 'react';
import PageLayoutAnimate from '@/components/PageLayoutAnimate';

export default function BlogsLayout({ children }: PropsWithChildren) {
  return <PageLayoutAnimate>{children}</PageLayoutAnimate>;
}
