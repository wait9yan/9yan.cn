'use client';

import { motion } from 'motion/react';
import { useMarkdownRender } from '@/hooks/use-markdown-render';

type BlogPreviewProps = {
  markdown: string;
  title: string;
  tags: string[];
  date: string;
  summary?: string;
  cover?: string;
  slug?: string;
};

export function BlogPreview({ markdown, title, tags, date, slug }: BlogPreviewProps) {
  const basePath = slug ? `/blogs/${slug}` : undefined;
  const { content, toc, loading } = useMarkdownRender(markdown, basePath);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='text-text-2 text-sm'
        >
          渲染中...
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-bg-1 overflow-hidden rounded-2xl shadow-lg'
      >
        <div className='p-6 sm:p-8 lg:p-10'>
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='border-b-bg-3 border-b pb-8'
          >
            <h1 className='text-text-1 text-center text-3xl leading-tight font-bold max-sm:text-2xl'>
              {title}
            </h1>

            <div className='mt-6 flex flex-wrap items-center justify-center gap-4'>
              <time className='text-text-2 text-sm'>{date}</time>

              {tags.length > 0 && (
                <>
                  <span className='text-text-3'>·</span>
                  <div className='flex flex-wrap items-center justify-center gap-2'>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className='text-text-2 bg-primary-1/50 hover:bg-primary-1 rounded-full px-3 py-1 text-xs font-medium transition-colors'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='prose mx-auto mt-8 max-w-none'
          >
            {content}
          </motion.div>
        </div>
      </motion.article>

      {toc.length > 0 && (
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className='bg-bg-1 mt-8 rounded-2xl p-6 shadow-lg'
        >
          <h2 className='text-text-1 mb-4 text-lg font-semibold'>目录</h2>
          <nav className='space-y-2'>
            {toc.map((item, index) => (
              <a
                key={index}
                href={`#${item.id}`}
                className='text-text-2 hover:text-text-1 block text-sm transition-colors'
                style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </motion.aside>
      )}
    </>
  );
}
