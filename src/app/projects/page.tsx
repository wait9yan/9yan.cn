import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '项目',
};

export default function Projects() {
  const projects = [];
  const isEmpty = projects.length === 0;
  return <>{isEmpty && <p className='text-text-2 text-center text-sm'>开发中...</p>}</>;
}
