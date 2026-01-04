import { Metadata } from 'next';
import Link from 'next/link';
import PageLayoutAnimate from '@/components/PageLayoutAnimate';
import PageLayout from '@/components/PageLayout';
import Button from '@/components/Button';

export const metadata: Metadata = {
  title: '404',
};

export default function NotFound() {
  return (
    <PageLayoutAnimate>
      <PageLayout>
        <div className='flex flex-col items-center justify-center pt-20 text-center'>
          <h2 className='text-primary-2 mb-4 text-8xl font-bold'>404</h2>
          <p className='text-text-2 mb-8 text-xl'>抱歉，您访问的页面不存在</p>
          <Link href='/'>
            <Button className='px-6 py-3'>返回首页</Button>
          </Link>
        </div>
      </PageLayout>
    </PageLayoutAnimate>
  );
}
