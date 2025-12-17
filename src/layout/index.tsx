'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import clsx from 'clsx';
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

const linkList = [
  {
    label: 'Github',
    href: 'https://github.com/wait9yan',
  },
  {
    label: 'Bilibili',
    href: 'https://space.bilibili.com/396767727',
  },
  {
    label: 'Email',
    href: 'mailto:wait9yan@gmail.com',
  },
  {
    label: 'QQ',
    href: 'tencent://message/?uin=1234567890&Site=www.qq.com&Menu=yes',
  },
  {
    label: 'Telegram',
    href: 'https://t.me/2yan',
  },
];

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isHome = pathname === '/';
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

      <div
        className={clsx(
          'bg-primary-1 flex min-h-screen flex-col items-center px-2 sm:px-4 lg:px-8',
          isHome && 'justify-center',
        )}
      >
        {/* 导航栏 */}
        <nav className={clsx('bg-bg-1 mt-2 rounded-2xl px-6 py-4', isHome && 'min-w-sx max-w-md')}>
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
          {isHome && (
            <div>
              <Image
                src='/images/avatar.png'
                alt='avatar'
                width={240}
                height={240}
              />
              <h2>
                九言<span>@wait9yan</span>
              </h2>
              <p>你好 👋，我是一个前端开发人员（2024 ～ 至今），从事于互联网行业。</p>
              <div className='flex justify-center gap-2'>
                {linkList.map((item) => (
                  <motion.button
                    key={item.href}
                    layout // 开启布局动画，当上方弹窗出现时，位置变化会平滑过渡
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='bg-bg-3 text-text-1 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-colors'
                  ></motion.button>
                ))}
              </div>
            </div>
          )}
        </nav>
        {/* 主内容卡片 */}
        {children}
      </div>
    </AppearanceProvider>
  );
}
