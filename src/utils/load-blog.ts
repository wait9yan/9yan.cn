export type BlogMetadata = {
  title: string;
  date: string;
  categories?: string[];
  summary?: string;
  cover?: string;
};

export type BlogListItem = {
  slug: string;
  metadata: BlogMetadata;
};

export type LoadedBlog = {
  slug: string;
  markdown: string;
  metadata?: BlogMetadata;
};

function parseFrontmatter(markdown: string): { metadata: BlogMetadata; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return {
      metadata: { title: 'Untitled', date: '' },
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

/**
 * Load blog data (client-side only)
 */
export async function loadBlog(slug: string): Promise<LoadedBlog> {
  if (!slug) {
    throw new Error('Slug is required');
  }

  const mdRes = await fetch(`/blogs/${encodeURIComponent(slug)}/index.md`);
  if (!mdRes.ok) {
    throw new Error('Blog not found');
  }
  const markdown = await mdRes.text();
  const { metadata, content } = parseFrontmatter(markdown);

  return { slug, markdown: content, metadata };
}
