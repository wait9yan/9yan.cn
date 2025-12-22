import fs from 'fs/promises';
import path from 'path';
import { cache } from 'react';
import type { BlogListItem, BlogPost } from './types';
import { parseFrontmatter } from './parser';
import { enrichMetadata } from './helpers';

const BLOGS_DIR = path.join(process.cwd(), 'public', 'blogs');

async function readBlogFile(slug: string): Promise<string> {
  const blogPath = path.join(BLOGS_DIR, slug, 'index.md');
  return fs.readFile(blogPath, 'utf-8');
}

export const getBlogPost = cache(async (slug: string): Promise<BlogPost> => {
  try {
    const markdown = await readBlogFile(slug);
    const { metadata, content } = parseFrontmatter(markdown);
    const enrichedMetadata = enrichMetadata(metadata, content, slug);

    return {
      slug,
      content,
      metadata: enrichedMetadata,
    };
  } catch {
    throw new Error(`Blog not found: ${slug}`);
  }
});

export const getBlogList = cache(async (): Promise<BlogListItem[]> => {
  try {
    const entries = await fs.readdir(BLOGS_DIR, { withFileTypes: true });
    const blogs: BlogListItem[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const slug = entry.name;

      try {
        const markdown = await readBlogFile(slug);
        const { metadata, content } = parseFrontmatter(markdown);
        const enrichedMetadata = enrichMetadata(metadata, content, slug);

        blogs.push({ slug, metadata: enrichedMetadata });
      } catch {
        continue;
      }
    }

    return blogs.sort((a, b) => {
      const dateA = new Date(a.metadata.date).getTime();
      const dateB = new Date(b.metadata.date).getTime();
      return dateB - dateA;
    });
  } catch {
    return [];
  }
});

export async function getBlogSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(BLOGS_DIR, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
}
