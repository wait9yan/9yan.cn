import { PropsWithChildren } from 'react';
import PageLayout from '@/components/page-layout';

export default function ProjectsLayout({ children }: PropsWithChildren) {
  return <PageLayout>{children}</PageLayout>;
}
