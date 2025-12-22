import { Metadata } from 'next';
import { Suspense } from 'react';
import { getBlogList } from '@/lib/blog';
import { BlogCard } from '@/components/BlogCard';

export const metadata: Metadata = {
  title: '文章',
};

export default async function Blogs() {
  const blogs = await getBlogList();
  return (
    <div className='bg-bg-1 mt-2 w-full overflow-hidden rounded-3xl'>
      <div className='text-text-1 p-6 lg:p-8'>
        {blogs.length === 0 ? (
          <p className='text-text-2 text-center text-sm'>暂无文章</p>
        ) : (
          <div className='flex flex-col gap-4'>
            <Suspense fallback={<div>加载中...</div>}>
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.slug}
                  blog={blog}
                />
              ))}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
