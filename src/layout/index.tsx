'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify-icon/react';
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
    icon: <Icon icon='lucide:user' />,
  },
  {
    label: '文章',
    path: '/blogs',
    icon: <Icon icon='lucide:book' />,
  },
  {
    label: '项目',
    path: '/projects',
    icon: <Icon icon='lucide:code' />,
  },
];

const linkList = [
  {
    label: 'Github',
    href: 'https://github.com/wait9yan',
    icon: <Icon icon='lucide:github' />,
  },
  {
    label: '哔哩哔哩',
    href: 'https://space.bilibili.com/396767727',
    icon: <Icon icon='ri:bilibili-line' />,
  },
  {
    label: 'Email',
    href: 'mailto:wait9yan@gmail.com',
    icon: <Icon icon='lucide:mail' />,
  },
  {
    label: 'QQ',
    href: 'tencent://message/?uin=1234567890&Site=www.qq.com&Menu=yes',
    icon: <Icon icon='ri:qq-line' />,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/2yan',
    icon: <Icon icon='ri:telegram-2-line' />,
  },
];

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isActive = (path: string) => pathname === path;
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
          'bg-primary-1 flex min-h-screen flex-col items-center px-2 transition-colors sm:px-4 lg:px-8',
        )}
      >
        {/* 导航栏 */}
        <motion.div
          layout
          transition={{
            layout: {
              type: 'tween',
              ease: ['easeIn', 'easeOut'],
              delay: isHome ? 0 : 0.2,
            },
          }}
          className={clsx('bg-bg-1 mt-2 rounded-3xl', isHome && 'mt-[25vh] w-full max-w-sm')}
        >
          <div className='flex justify-center gap-2 px-6 py-4'>
            {navList.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={clsx(
                  'group text-text-2 text-md hover:bg-primary-1 flex items-center rounded-full py-0.5 font-medium transition-all duration-300 hover:px-4',
                  isActive(item.path) && 'bg-primary-1 px-4',
                )}
              >
                <span
                  className={clsx(
                    'flex items-center overflow-hidden transition-all duration-300 ease-in-out',
                    isActive(item.path)
                      ? 'mr-1 max-w-6 opacity-100'
                      : 'mr-0 max-w-0 opacity-0 group-hover:mr-1 group-hover:max-w-6 group-hover:opacity-100',
                  )}
                >
                  {item.icon}
                </span>
                <span className='group relative cursor-pointer'>
                  {item.label}
                  {/* 下划线元素 */}
                  <span className='bg-primary-1 absolute bottom-0 left-0 h-1 w-full origin-left scale-y-100 rounded-full transition-all duration-300 group-hover:scale-y-0'></span>
                </span>
              </Link>
            ))}
          </div>
          {/* 首页内容 */}
          <AnimatePresence>
            {isHome && (
              <motion.div
                key='home-content'
                initial={{ height: 0, overflow: 'hidden' }}
                animate={{
                  height: 'auto',
                  transition: {
                    height: { duration: 0.3 },
                  },
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  height: 0,
                  transition: {
                    height: { duration: 0.2, delay: 0.1 },
                    opacity: { duration: 0.2 },
                    y: { duration: 0.2 },
                  },
                }}
                className='flex flex-col items-center px-6 py-4'
              >
                <motion.div
                  whileHover={{ scale: 1.04 }}
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
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.9 }}
                      className='bg-primary-3 text-bg-1 flex h-9 w-9 items-center justify-center rounded-full'
                    >
                      {item.icon}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {/* 主内容卡片 */}
        <AnimatePresence>
          {!isHome && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.5, // 等待导航栏动画完成后再显示
                  duration: 0.3,
                },
              }}
              exit={{
                opacity: 0,
                y: 20,
                transition: { duration: 0.2 }, // 立即消失
              }}
              className='flex w-full flex-col flex-wrap content-center'
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppearanceProvider>
  );
}
