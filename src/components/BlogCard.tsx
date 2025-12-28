'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { BlogListItem } from '@/lib/blog';

type BlogCardProps = {
  blog: BlogListItem;
};

export function BlogCard({ blog }: BlogCardProps) {
  const { slug, metadata } = blog;
  const { title, date, categories, summary, cover } = metadata;

  return (
    <Link href={`/blog/${encodeURIComponent(slug)}`}>
      <article className='bg-bg-2/50 group border-primary-2/50 hover:bg-bg-2 hover:border-primary-2 flex cursor-pointer overflow-hidden rounded-xl border transition-all'>
        <div className='p-2 sm:p-4 lg:p-6'>
          <h3 className='text-text-1 text-lg font-semibold transition-colors'>{title}</h3>
          <div className='text-text-3 mt-2 flex flex-wrap items-center gap-3 text-xs'>
            <time>{date}</time>
            {categories && categories.length > 0 && (
              <>
                <span>·</span>
                <div className='flex flex-wrap gap-2'>
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className='bg-primary-1/50 hover:bg-primary-1 rounded-full px-2 py-1'
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {summary && <p className='text-text-2 mt-2 line-clamp-2 text-sm'>{summary}</p>}
        </div>

        {cover && (
          <div className='relative aspect-video w-full overflow-hidden'>
            <Image
              src={cover}
              alt={title}
              fill
              className='object-cover transition-transform group-hover:scale-105'
            />
          </div>
        )}
      </article>
    </Link>
  );
}
