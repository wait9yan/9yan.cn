import { Metadata } from 'next';
import { Suspense } from 'react';
import { getBlogList } from '@/lib/blog';
import { BlogCard } from '@/components/BlogCard';

export const metadata: Metadata = {
  title: '文章',
};

export default async function Blogs() {
  const blogs = await getBlogList();
  const isEmpty = blogs.length === 0;
  return (
    <>
      {isEmpty && <p className='text-text-2 text-center text-sm'>暂无文章</p>}
      {!isEmpty && (
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
    </>
  );
}
