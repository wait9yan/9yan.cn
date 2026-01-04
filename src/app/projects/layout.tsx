import { PropsWithChildren } from 'react';
import PageLayoutAnimate from '@/components/PageLayoutAnimate';
import PageLayout from '@/components/PageLayout';

export default function ProjectsLayout({ children }: PropsWithChildren) {
  return (
    <PageLayoutAnimate>
      <PageLayout>{children}</PageLayout>
    </PageLayoutAnimate>
  );
}
