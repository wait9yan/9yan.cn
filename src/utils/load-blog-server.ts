import fs from 'fs/promises';
import path from 'path';
import type { BlogListItem, BlogMetadata } from './load-blog';

function extractTextSummary(content: string, maxLength = 150): string {
  const text = content
    .replace(/^#{1,6}\s+.+$/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

function extractFirstImage(content: string, slug: string): string | undefined {
  const imgRegex = /!\[.*?\]\(([^)]+)\)/;
  const match = content.match(imgRegex);

  if (!match) return undefined;

  const imgPath = match[1];
  if (imgPath.startsWith('http')) return imgPath;
  return `/blogs/${slug}/${imgPath}`;
}

function parseFrontmatter(markdown: string): { metadata: BlogMetadata; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  if (!match) {
    return {
      metadata: { title: 'Untitled', date: '', categories: [] },
      content: markdown,
    };
  }

  const [, frontmatterText, content] = match;
  const metadata: Partial<BlogMetadata> = {};

  frontmatterText.split('\n').forEach((line) => {
    if (line.startsWith('  - ') && metadata.categories) {
      metadata.categories.push(line.slice(4).trim());
      return;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    if (key === 'title') metadata.title = value;
    else if (key === 'date') metadata.date = value;
    else if (key === 'summary') metadata.summary = value;
    else if (key === 'cover') metadata.cover = value;
    else if (key === 'categories') metadata.categories = [];
  });

  return {
    metadata: {
      title: metadata.title || 'Untitled',
      date: metadata.date || '',
      categories: metadata.categories,
      summary: metadata.summary,
      cover: metadata.cover,
    },
    content,
  };
}

export async function getBlogList(): Promise<BlogListItem[]> {
  const blogsDir = path.join(process.cwd(), 'public', 'blogs');

  try {
    const entries = await fs.readdir(blogsDir, { withFileTypes: true });
    const blogs: BlogListItem[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const slug = entry.name;
      const indexPath = path.join(blogsDir, slug, 'index.md');

      try {
        const markdown = await fs.readFile(indexPath, 'utf-8');
        const { metadata, content } = parseFrontmatter(markdown);

        const enrichedMetadata = {
          ...metadata,
          summary: metadata.summary || extractTextSummary(content),
          cover: metadata.cover || extractFirstImage(content, slug),
        };

        blogs.push({ slug, metadata: enrichedMetadata });
      } catch {
        continue;
      }
    }

    // Sort by date descending
    blogs.sort((a, b) => {
      const dateA = new Date(a.metadata.date).getTime();
      const dateB = new Date(b.metadata.date).getTime();
      return dateB - dateA;
    });

    return blogs;
  } catch {
    return [];
  }
}

/**
 * Load blog from filesystem (server-side only)
 */
export async function loadBlogServer(slug: string) {
  const blogPath = path.join(process.cwd(), 'public', 'blogs', slug, 'index.md');
  try {
    const markdown = await fs.readFile(blogPath, 'utf-8');
    const { metadata, content } = parseFrontmatter(markdown);
    return { slug, markdown: content, metadata };
  } catch {
    throw new Error('Blog not found');
  }
}
