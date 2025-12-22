import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogSlugs } from '@/lib/blog';
import { BlogPreview } from '@/components/BlogPreview';

interface PageProps {
  params: Promise<{ blog: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ blog: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { blog: slug } = await params;
    const blog = await getBlogPost(decodeURIComponent(slug));

    return {
      title: blog.metadata.title,
      description: blog.metadata.summary,
      openGraph: blog.metadata.cover
        ? {
            images: [blog.metadata.cover],
          }
        : undefined,
    };
  } catch {
    return {
      title: 'Blog Not Found',
    };
  }
}

export default async function BlogPage({ params }: PageProps) {
  const { blog: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  let blog;
  try {
    blog = await getBlogPost(slug);
  } catch {
    notFound();
  }

  return (
    <BlogPreview
      markdown={blog.content}
      title={blog.metadata.title}
      tags={blog.metadata.categories || []}
      date={blog.metadata.date}
      slug={slug}
    />
  );
}
