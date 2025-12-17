'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
// import BackgroundCanvas from '@/layout/BackgroundCanvas';
// import DelaunayHero, { PresetDistribution, PresetFillColor } from '@/layout/DelaunayHero';
// import { getPalette } from '@/lib/colorPalettes';
import SecretTrigger from '@/layout/SecretTrigger';
import ConfigWidget from '@/layout/ConfigWidget';
import { AppearanceProvider } from '@/layout/ThemeContext';

const navList = [
  {
    label: '我',
    path: '/',
  },
  {
    label: '文章',
    path: '/blogs',
  },
  {
    label: '项目',
    path: '/projects',
  },
];

export default function Layout({ children }: PropsWithChildren) {
  return (
    <AppearanceProvider>
      {/* 背景 */}
      {/* <BackgroundCanvas
        width={1920}
        height={1080}
        cellSize={100}
        algorithm='delaunay'
        distributed={true}
        maxSteps={15}
        palette={getPalette('grays')}
        shareColor={true}
      /> */}

      {/* <div className='pointer-events-none fixed inset-0 -z-1'>
        <DelaunayHero
          className='bg-blue-200'
          width='100%'
          height='100%'
          animate={false}
          maxPoints={100} // 全屏面积大，可以适当增加点数
        />
      </div> */}

      {/* 配置按钮 */}
      <SecretTrigger />
      <ConfigWidget className='-z-9999' />

      <div className='bg-primary-1 flex min-h-screen flex-col items-center px-2 sm:px-4 lg:px-8'>
        {/* 导航栏 */}
        <nav className='bg-bg-1 mt-2 rounded-2xl px-6 py-4'>
          <div className='flex gap-6'>
            {navList.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className='text-text-1 font-medium transition-all hover:px-2'
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className='mt-2 w-full max-w-4xl'>
          {/* 主内容卡片 */}
          <div className='bg-bg-1 overflow-hidden rounded-2xl transition-all'>
            {/* 页面内容 */}
            <main className='text-text-1 p-8'>{children}</main>
          </div>
        </div>
      </div>
    </AppearanceProvider>
  );
}
