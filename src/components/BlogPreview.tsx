'use client';

import { motion } from 'motion/react';
import { useMarkdownRender } from '@/hooks/use-markdown-render';
import { CategoryTags } from './CategoryTags';

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

  return (
    <>
      <article>
        <motion.h1
          layoutId={`blog-title-${slug}`}
          className='text-text-1 text-2xl leading-tight font-bold sm:text-3xl'
        >
          {title}
        </motion.h1>

        <motion.div
          layoutId={`blog-meta-${slug}`}
          className='mt-6 flex flex-wrap items-center gap-2 text-xs'
        >
          <time className='text-text-2 font-semibold'>{date}</time>
          <CategoryTags categories={tags ?? []} />
        </motion.div>
        <div className='border-b-primary-1 mt-8 border-b'></div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-text-2 py-16 text-center text-sm'
          >
            渲染中...
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='prose mx-auto mt-8 max-w-none'
          >
            {content}
          </motion.div>
        )}
      </article>

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
