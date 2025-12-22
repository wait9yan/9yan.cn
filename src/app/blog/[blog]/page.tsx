'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { BlogPreview } from '@/components/BlogPreview';
import { loadBlog } from '@/utils/load-blog';

function ErrorState({ message }: { message: string }) {
  return (
    <div className='flex min-h-screen items-center justify-center px-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-bg-1 max-w-md rounded-2xl p-8 text-center shadow-lg'
      >
        <div className='text-text-1 mb-4 text-6xl'>😕</div>
        <h2 className='text-text-1 mb-2 text-xl font-semibold'>{message}</h2>
        <p className='text-text-2 text-sm'>请检查链接是否正确</p>
      </motion.div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='text-center'
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='text-accent-1 border-accent-1/20 border-t-accent-1 mx-auto mb-4 h-12 w-12 rounded-full border-4'
        />
        <p className='text-text-2 text-sm'>加载中...</p>
      </motion.div>
    </div>
  );
}

export default function Page() {
  const params = useParams() as { blog?: string | string[] };
  const rawSlug = Array.isArray(params?.blog) ? params.blog[0] : params?.blog || '';
  const slug = decodeURIComponent(rawSlug);

  const [blog, setBlog] = useState<Awaited<ReturnType<typeof loadBlog>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!slug) return;
      try {
        setLoading(true);
        const blogData = await loadBlog(slug);

        if (!cancelled) {
          setBlog(blogData);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) setError((e as Error).message || '加载失败');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) return <ErrorState message='无效的链接' />;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!blog) return <ErrorState message='文章不存在' />;

  return (
    <BlogPreview
      markdown={blog.markdown}
      title={blog.metadata?.title || 'Untitled'}
      tags={blog.metadata?.categories || []}
      date={blog.metadata?.date || ''}
      summary={blog.metadata?.summary}
      cover={blog.metadata?.cover}
      slug={slug}
    />
  );
}
