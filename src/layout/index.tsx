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
    label: '哔哩哔哩',
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

      <motion.div
        className={clsx(
          'bg-primary-1 flex min-h-screen flex-col items-center px-2 transition-colors sm:px-4 lg:px-8',
          isHome && 'justify-center',
        )}
      >
        {/* 导航栏 */}
        <motion.div className={clsx('bg-bg-1 mt-2 rounded-3xl', isHome && 'w-full max-w-sm')}>
          <div className='flex gap-2 px-6 py-4'>
            {navList.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={clsx(
                  'text-text-1 hover:bg-primary-1 rounded-full px-2 font-medium transition-all',
                  pathname === item.path && 'bg-primary-1',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {isHome && (
            <motion.div className='flex flex-col items-center px-6 py-4'>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className='border-bg-3 ring-bg-3 hover:ring-primary-2 hover:border-primary-2 ring-offset-bg-2 h-32 w-32 overflow-hidden rounded-full border-2 ring-8 ring-offset-2'
              >
                <Image
                  src='/images/avatar.png'
                  alt='avatar'
                  width={128}
                  height={128}
                />
              </motion.div>
              <h2 className='text-text-1 mt-10 text-2xl font-bold'>
                九言<span className='text-xl'>@wait9yan</span>
              </h2>
              <p className='text-text-2 mt-2 text-sm'>
                你好 👋，我是一个前端开发工程师（2024 ～ 至今）
              </p>
              <div className='mt-10 flex justify-center gap-2'>
                {linkList.map((item) => (
                  <motion.button
                    key={item.href}
                    layout // 开启布局动画，当上方弹窗出现时，位置变化会平滑过渡
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.9 }}
                    className='bg-bg-3 text-text-1 flex h-9 w-9 items-center justify-center rounded-full'
                  ></motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
        {/* 主内容卡片 */}
        {children}
      </motion.div>
    </AppearanceProvider>
  );
}
