import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404',
};

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center pt-20 text-center'>
      <h2 className='mb-4 text-8xl font-bold text-gray-800/80'>404</h2>
      <p className='mb-8 text-xl text-gray-600'>抱歉，您访问的页面不存在</p>
      <Link
        href='/'
        className='rounded-full bg-gray-800 px-6 py-3 text-white transition-all hover:bg-gray-700 hover:shadow-lg'
      >
        返回首页
      </Link>
    </div>
  );
}
