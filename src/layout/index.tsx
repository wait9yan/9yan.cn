'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@iconify-icon/react';
import clsx from 'clsx';
import DelaunayBackground from '@/layout/DelaunayBackground';
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

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isBlog = pathname.startsWith('/blogs');
  const isProject = pathname.startsWith('/projects');
  const isActive = (path: string) => pathname === path;
  return (
    <AppearanceProvider>
      {/* 背景 */}
      <div className='pointer-events-none fixed inset-0 -z-1'>
        <DelaunayBackground
          width='100%'
          height='100%'
          animate={false}
          maxPoints={100} // 全屏面积大，可以适当增加点数
        />
      </div>

      {/* 配置按钮 */}
      <SecretTrigger />
      <ConfigWidget className='-z-9999' />

      <div
        className={clsx(
          'flex min-h-screen flex-col items-center px-2 transition-colors sm:px-4 lg:px-8',
          isHome && 'justify-center',
          isBlog && 'justify-start',
          isProject && 'justify-start',
        )}
      >
        <div
          className={clsx(
            'flex w-full flex-col items-start',
            isHome && 'w-full max-w-sm',
            isBlog && 'max-w-4xl',
            isProject && 'max-w-7xl',
            !isHome && !isBlog && !isProject && 'max-w-4xl',
          )}
        >
          {/* 导航栏 */}
          <motion.div
            layout
            initial={{ borderRadius: '24px' }}
            animate={{
              borderRadius: isHome ? '24px 24px 0  0' : '24px',
              transition: {
                borderRadius: { duration: 0.3, delay: 0.3 },
              },
            }}
            exit={{ borderRadius: '24px' }}
            transition={{
              layout: {
                type: 'tween',
                ease: ['easeIn', 'easeOut'],
                delay: isHome ? 0 : 0.3,
                duration: 0.3,
              },
            }}
            className={clsx('bg-bg-1 mt-2', isHome ? 'w-full rounded-t-3xl' : 'rounded-3xl')}
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
          </motion.div>
          {/* 主内容*/}
          <AnimatePresence mode='wait'>{children}</AnimatePresence>
        </div>
      </div>
    </AppearanceProvider>
  );
}
