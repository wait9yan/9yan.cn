'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import type { BlogListItem } from '@/lib/blog';
import { CategoryTags } from './CategoryTags';

interface BlogCardProps {
  blog: BlogListItem;
}

export function BlogCard({ blog }: BlogCardProps) {
  const { slug, metadata } = blog;
  const { title, date, categories, summary, cover } = metadata;

  return (
    <Link href={`/blog/${encodeURIComponent(slug)}`}>
      <article className='bg-bg-2/50 border-primary-2/50 hover:border-primary-2 group relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-colors lg:p-6'>
        {cover && (
          <div className='absolute inset-0 overflow-hidden mask-[linear-gradient(120deg,transparent_0%,transparent_30%,black_200%)]'>
            <Image
              src={cover}
              alt={title}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-110'
            />
          </div>
        )}

        <motion.h3
          layoutId={`blog-title-${slug}`}
          className='text-text-1 text-lg font-semibold transition-colors'
        >
          {title}
        </motion.h3>
        <motion.div
          layoutId={`blog-meta-${slug}`}
          className='mt-2 flex flex-wrap items-center gap-2 text-xs'
        >
          <time className='text-text-2 font-semibold'>{date}</time>
          <CategoryTags categories={categories ?? []} />
        </motion.div>

        {summary && <p className='text-text-2 mt-2 line-clamp-2 text-sm'>{summary}</p>}
      </article>
    </Link>
  );
}
