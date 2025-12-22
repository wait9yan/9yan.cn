export function extractTextSummary(content: string, maxLength = 150): string {
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

export function extractFirstImage(content: string, slug: string): string | undefined {
  const imgRegex = /!\[.*?\]\(([^)]+)\)/;
  const match = content.match(imgRegex);

  if (!match) return undefined;

  const imgPath = match[1];
  if (imgPath.startsWith('http')) return imgPath;
  return `/blogs/${slug}/${imgPath}`;
}

export function enrichMetadata<T extends { summary?: string; cover?: string }>(
  metadata: T,
  content: string,
  slug: string,
): T {
  return {
    ...metadata,
    summary: metadata.summary || extractTextSummary(content),
    cover: metadata.cover || extractFirstImage(content, slug),
  };
}
