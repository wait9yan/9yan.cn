import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '项目',
};

export default function Projects() {
  return (
    <div className='bg-bg-1 mt-2 w-full overflow-hidden rounded-3xl'>
      <div className='text-text-1 p-8'>
        <h2>开发中...</h2>
      </div>
    </div>
  );
}
