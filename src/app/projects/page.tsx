import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '项目',
};

export default function Home() {
  return (
    <div className='mt-2 w-full max-w-4xl'>
      <div className='bg-bg-1 overflow-hidden rounded-2xl transition-all'>
        <div className='text-text-1 p-8'>
          <h2>
            我的项目<span>@wait9yan</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
