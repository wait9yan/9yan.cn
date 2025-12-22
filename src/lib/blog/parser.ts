import type { BlogMetadata, ParsedFrontmatter } from './types';

const DEFAULT_METADATA: BlogMetadata = {
  title: 'Untitled',
  date: '',
  categories: [],
};

export function parseFrontmatter(markdown: string): ParsedFrontmatter {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return {
      metadata: DEFAULT_METADATA,
      content: markdown,
    };
  }

  const [, frontmatterText, content] = match;
  const metadata: Partial<BlogMetadata> = {};

  frontmatterText.split(/\r?\n/).forEach((line) => {
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
      title: metadata.title || DEFAULT_METADATA.title,
      date: metadata.date || DEFAULT_METADATA.date,
      categories: metadata.categories,
      summary: metadata.summary,
      cover: metadata.cover,
    },
    content,
  };
}
