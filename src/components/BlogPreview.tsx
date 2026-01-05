'use client';

import { motion } from 'motion/react';
import { useMarkdownRender } from '@/hooks/use-markdown-render';
import { CategoryTags } from '@/components/CategoryTags';
import PageLayout from '@/components/PageLayout';

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
    <div className='flex gap-4'>
      <PageLayout className='max-w-3xl'>
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
      </PageLayout>

      {toc.length > 0 && (
        <PageLayout className='sticky top-4 hidden h-fit max-h-[calc(100vh-2rem)] grow overflow-y-auto lg:block lg:px-4 lg:py-4'>
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
        </PageLayout>
      )}
    </div>
  );
}
