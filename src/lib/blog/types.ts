export interface BlogMetadata {
  title: string;
  date: string;
  categories?: string[];
  summary?: string;
  cover?: string;
}

export interface BlogListItem {
  slug: string;
  metadata: BlogMetadata;
}

export interface BlogPost {
  slug: string;
  content: string;
  metadata: BlogMetadata;
}

export interface ParsedFrontmatter {
  metadata: BlogMetadata;
  content: string;
}
