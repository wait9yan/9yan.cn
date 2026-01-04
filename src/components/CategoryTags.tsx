import clsx from 'clsx';

interface CategoryTagsProps {
  categories: string[];
  className?: string;
}

export function CategoryTags({ categories, className }: CategoryTagsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {categories.map((cat) => (
        <span
          key={cat}
          className='text-text-2 bg-primary-1/50 hover:bg-primary-1 rounded-full px-2 py-1 text-xs transition-colors'
        >
          {cat}
        </span>
      ))}
    </div>
  );
}
