import { PropsWithChildren } from 'react';
import PageLayout from '@/components/PageLayout';

export default function ProjectsLayout({ children }: PropsWithChildren) {
  return <PageLayout>{children}</PageLayout>;
}
