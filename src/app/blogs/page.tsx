import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文章',
};

export default function Blogs() {
  return (
    <div className='bg-bg-1 mt-2 w-full overflow-hidden rounded-2xl'>
      <div className='text-text-1 p-8'>
        <h2>
          我的文章<span>@wait9yan</span>
        </h2>
      </div>
    </div>
  );
}
