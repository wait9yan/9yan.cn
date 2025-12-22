import { PropsWithChildren } from 'react';
import PageLayout from '@/components/PageLayout';

export default function BlogsLayout({ children }: PropsWithChildren) {
  return <PageLayout>{children}</PageLayout>;
}
